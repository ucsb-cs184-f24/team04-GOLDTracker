import {auth, firestore} from "../../firebaseConfig";
import {getPresentedNotificationsAsync, scheduleNotificationAsync, setNotificationHandler} from "expo-notifications";
import * as ClassRegister from "./ClassRegister";
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import {BackgroundFetchResult} from "expo-background-fetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {doc, getDoc} from "firebase/firestore";

export async function setupBackgroundNotifications() {
    let isRegistered = await TaskManager.isTaskRegisteredAsync("notif-fetch");
    if(!isRegistered) {
        await BackgroundFetch.registerTaskAsync("notif-fetch", {
            minimumInterval: 60,
            stopOnTerminate: false,
            startOnBoot: true
        })
    }
}


export async function checkAvailability() {
    if (auth.currentUser) {
        let idToken = await auth.currentUser.getIdToken();
        let classList = await ClassRegister.getClasses();
        let classes = Object.keys(classList);
        let availCourses = [];
        let authHeader = new Headers();
        authHeader.append("authorization", idToken);
        for (let i = 0; i < classes.length; i++) {
            let currentClass = await (await fetch(`https://us-central1-goldtracker-beb96.cloudfunctions.net/poll/20251/${classes[i]}`, {headers: authHeader})).json()
            if (currentClass.classSections[0].hasOwnProperty("enrolledTotal") && (currentClass.classSections[0]["enrolledTotal"] < currentClass.classSections[0]["maxEnroll"])) {
                for (let j = 1; j < currentClass.classSections.length; j++) {
                    if (classList[classes[i]].indexOf(currentClass.classSections[j]["enrollCode"]) !== -1) {
                        if (currentClass.classSections[j].hasOwnProperty("enrolledTotal") && (currentClass.classSections[j]["enrolledTotal"] < currentClass.classSections[j]["maxEnroll"])){
                            availCourses.push(currentClass);
                            break;
                        }
                    }
                }
            }
        }
        return availCourses;
    }
}

async function prepareNotification(availableCourses, currentPass){
    let alreadyNotified = await AsyncStorage.getItem("notifiedClasses");
    let setPass = await AsyncStorage.getItem("lastPass");
    if (alreadyNotified != null) {
        alreadyNotified = JSON.parse(alreadyNotified);
        setPass = parseInt(setPass);
        if(currentPass !== setPass){
            alreadyNotified = [];
        }
    }else{
        alreadyNotified = [];
    }
    setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });
    for(let i = 0; i < availableCourses.length; i++){
        if(alreadyNotified.indexOf(availableCourses[i]["classSections"][0]["enrollCode"]) === -1){
            scheduleNotificationAsync({
                content: {
                    title: 'GOLDTracker',
                    body: `You can currently register for ${availableCourses[i]["courseId"].trim()}`,
                },
                trigger: null,
            });
            alreadyNotified.push(availableCourses[i]["classSections"][0]["enrollCode"]);
        }
    }

    await AsyncStorage.setItem("notifiedClasses", JSON.stringify(alreadyNotified));
    await AsyncStorage.setItem("lastPass", `${currentPass}`);
}


export async function runBackgroundNotificationSequence(){
    const {pass1, pass2, pass3} = await getPasses();
    if(!pass1 || !pass2 || pass3){
        return BackgroundFetchResult.NoData;
    }
    let currentDate = new Date();
    let currentDateString = Date.parse(currentDate.toUTCString());
    if(( currentDateString < pass2 &&  currentDateString > pass1)){
        let availableCourses = await checkAvailability();
        await prepareNotification(availableCourses, 1);
    }else if(( currentDateString < pass3 &&  currentDateString > pass2)){
        let availableCourses = await checkAvailability();
        await prepareNotification(availableCourses, 2);
    }
    return BackgroundFetchResult.NewData;
}

async function getPasses(){
    let pass1,pass2,pass3;
    try {
        const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            pass1 = userData["pass time"].pass1;
            pass2 = userData["pass time"].pass2;
            pass3 = userData["pass time"].pass3;

        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
    pass1 = Date.parse(pass1);
    pass2 = Date.parse(pass2);
    pass3 = Date.parse(pass3);
    return {pass1, pass2, pass3};
}
