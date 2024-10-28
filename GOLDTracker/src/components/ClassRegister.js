import AsyncStorage from "@react-native-async-storage/async-storage";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import {get, update,ref} from "firebase/database"
import {database, auth} from "../../firebaseConfig";
export async function registerClass(courseId, sectionId){
    let classList = await AsyncStorage.getItem("class-list");
    if(!classList){
        let newList = {};
        newList[courseId].add(sectionId);
        await AsyncStorage.setItem("class-list", JSON.stringify(newList));
        await AsyncStorage.setItem("timestamp", Date.parse(new Date().toString()));
    }else{
        let parsedClassList = JSON.parse(classList);
        parsedClassList[courseId].add(sectionId);
        await AsyncStorage.setItem("class-list", JSON.stringify(parsedClassList));
        await AsyncStorage.setItem("timestamp", Date.parse(new Date().toString()));
    }
}

export async function deregisterClass(courseId, sectionId){
    let classList = await AsyncStorage.getItem("class-list");
    if(!classList){
        return false;
    }else{
        let parsedClassList = JSON.parse(classList);
        if(parsedClassList.has(courseId).has(sectionId)){
            if(parsedClassList[courseId].has(sectionId) && parsedClassList[courseId].length === 1){
                parsedClassList.remove(courseId);
            }else{
                parsedClassList[courseId].remove(sectionId);
            }
            await AsyncStorage.setItem("class-list", JSON.stringify(parsedClassList));
            await AsyncStorage.setItem("timestamp", new Date.parse(new Date().toString()));
            return false
        }else{
            return true;
        }
    }
}

export async function getClasses(){
    let classList = await AsyncStorage.getItem("class-list");

    if(!classList){
        return null;
    }else{
        return JSON.parse(classList);
    }
}