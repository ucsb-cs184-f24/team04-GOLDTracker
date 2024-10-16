import AsyncStorage from "@react-native-async-storage/async-storage";
async function registerClass(id){
    let classList = await AsyncStorage.getItem("class-list");
    if(!classList){
        let newClass = [id];
        await AsyncStorage.setItem("class-list", JSON.stringify(newClass));
    }else{
        let parsedClassList = JSON.parse(classList);
        parsedClassList.add(id);
        await AsyncStorage.setItem("class-list", JSON.stringify(parsedClassList));
    }
}

async function deregisterClass(id){
    let classList = await AsyncStorage.getItem("class-list");
    if(!classList){
        return false;
    }else{
        let parsedClassList = JSON.parse(classList);
        if(parsedClassList.has(id)){
            parsedClassList.remove(id);
            await AsyncStorage.setItem("class-list", JSON.stringify(parsedClassList));
            return false;
        }else{
            return true;
        }
    }
}

async function getClasses(){
    let classList = await AsyncStorage.getItem("class-list");

    if(!classList){
        return null;
    }else{
        return JSON.parse(classList);
    }
}
