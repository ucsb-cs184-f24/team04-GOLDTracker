import BackgroundFetch from "react-native-background-fetch";
import {AppState} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {auth} from "../../firebaseConfig";
import {getPresentedNotificationsAsync, scheduleNotificationAsync, setNotificationHandler} from "expo-notifications";
import * as ClassRegister from "./ClassRegister";

export function setupBackgroundNotifications() {
    let status = BackgroundFetch.configure({}, checkAvailability, timedOut)
    status.then((response) => {
        console.log(response)
    })
}

async function checkAvailability(id) {
    if (AppState.currentState !== "active" && auth.currentUser) {
        let idToken = await auth.currentUser.getIdToken();
        let classList = await ClassRegister.getClasses();
        let classes = Object.keys(classList);
        let availCourses = {};
        let authHeader = new Headers();
        authHeader.append("authorization", idToken);
        for (let i = 0; i < classes.length; i++) {
            let currentClass = await (await fetch(`https://us-central1-goldtracker-beb96.cloudfunctions.net/poll/20244/${classes[i]}`, {headers: authHeader})).json()
            if (currentClass.classSections[0].hasOwnProperty("enrolledTotal") && (currentClass.classSections[0]["enrolledTotal"] < currentClass.classSections[0]["maxEnroll"])) {
                for (let j = 1; j < currentClass.classSections.length; j++) {
                    if (classList[classes[i]].indexOf(currentClass.classSections[j]["enrollCode"]) !== -1) {
                        if (currentClass.classSections[j].hasOwnProperty("enrolledTotal") && (currentClass.classSections[j]["enrolledTotal"] < currentClass.classSections[j]["maxEnroll"]))
                            availCourses[`${classes[i]}`] = currentClass.courseId;
                        break;
                    }
                }
            }
        }
        if (Object.keys(availCourses).length > 0 && (await getPresentedNotificationsAsync()).length === 0) {
            setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: false,
                    shouldSetBadge: false,
                }),
            });

            scheduleNotificationAsync({
                content: {
                    title: 'GOLDTracker',
                    body: "You have courses available to register!",
                },
                trigger: null,
            });
        }
    }
    BackgroundFetch.finish(id);
}

async function timedOut(id) {
    console.error("Timed out!")
    BackgroundFetch.finish(id);
}
