import AsyncStorage from "@react-native-async-storage/async-storage";
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