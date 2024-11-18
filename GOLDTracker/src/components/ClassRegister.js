import AsyncStorage from "@react-native-async-storage/async-storage";
import {auth, database} from "../../firebaseConfig";
import {ref,get,set, child} from "firebase/database"


export async function registerClass(courseId, sectionId){
    let classList = await AsyncStorage.getItem("class-list");
    if(!classList){
        let newList = {};
        newList[`${courseId}`] = [`${sectionId}`];
        await AsyncStorage.setItem("class-list", JSON.stringify(newList));
        await AsyncStorage.setItem("timestamp", `${Date.parse(new Date().toString())}`);
    }else{
        let parsedClassList = JSON.parse(classList);
        if(parsedClassList[`${courseId}`]&&!parsedClassList[`${courseId}`].includes(`${sectionId}`)){
            parsedClassList[`${courseId}`].push(`${sectionId}`);
        }else{
            parsedClassList[`${courseId}`] = [`${sectionId}`]
        }
        await AsyncStorage.setItem("class-list", JSON.stringify(parsedClassList));
        await AsyncStorage.setItem("timestamp", `${Date.parse(new Date().toString())}`);
    }
}

export async function deregisterClass(courseId, sectionId){
    let classList = await AsyncStorage.getItem("class-list");
    if(!classList){
        return false;
    }else{
        let parsedClassList = JSON.parse(classList);
        if(parsedClassList[`${courseId}`] && parsedClassList[`${courseId}`].includes(`${sectionId}`)){
            if(parsedClassList[`${courseId}`].includes(`${sectionId}`) && parsedClassList[`${courseId}`].length === 1){
                delete parsedClassList[`${courseId}`];
            }else{
                let index = parsedClassList[`${courseId}`].indexOf(`${sectionId}`);
                console.log(index)
                parsedClassList[`${courseId}`].splice(index,1);
            }
            await AsyncStorage.setItem("class-list", JSON.stringify(parsedClassList));
            await AsyncStorage.setItem("timestamp", `${Date.parse(new Date().toString())}`);
            return true
        }else{
            return false;
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

export async function reset(){
    await AsyncStorage.setItem("class-list","");
    await AsyncStorage.setItem("timestamp","");
}

export async function syncToFirebase(){
    let classList = JSON.parse(await AsyncStorage.getItem("class-list"));
    let timestamp = parseFloat(await AsyncStorage.getItem("timestamp"));

    const loc = ref(database)
    let serverClassList = await get(child(loc, `users/${auth.currentUser.uid}/classList`)).then((current) => {
        if(current.exists()){
            return JSON.parse(current.val())
        }else{
            return null;
        }
    })


    let serverTimestamp = await get(child(loc, `users/${auth.currentUser.uid}/timestamp`)).then((current) => {
        if(current.exists()){
            return current.val()
        }else{

            return null;
        }
    })


    if(!serverTimestamp && ! timestamp){
        return;
    }

    else if(!serverTimestamp){
        updateServer(classList, timestamp);
    }

    else if(!timestamp){
        await updateLocal(serverClassList,serverTimestamp)
    }

    else if (timestamp > serverTimestamp){
        await updateServer(classList, serverTimestamp);
    }

    else if(timestamp < serverTimestamp){
        await updateLocal(serverClassList,serverTimestamp)
    }

    else{
        //are the same.
        return;
    }

}

async function updateServer(classList, timestamp){
    const loc = ref(database, `users/${auth.currentUser.uid}`)
    await set(loc,{
        classList: JSON.stringify(classList),
        timestamp: timestamp
    });
    console.log("this ran")
}

async function updateLocal(classList, timestamp){
    await AsyncStorage.setItem("timestamp", `${timestamp}`);
    await AsyncStorage.setItem("class-list", JSON.stringify(classList));
}