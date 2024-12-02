import {StatusBar} from 'expo-status-bar';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import * as BackgroundRegister from "../components/BackgroundRegister";
import Notification from "../components/Notification";
import {useEffect, useState} from "react";

export default function NotificationScreen() {
    let [currentCourses, setCurrentCourses] = useState([]);
    useEffect( () => {
        async function getCourses() {
            let courses = await BackgroundRegister.checkAvailability();
            setCurrentCourses(courses);
        }
        getCourses();
        console.log("please no more infinite loop")
    },[])
    const renderNotification = (item) => {
        return (
            <Notification course={item.item}/>
        )
    }
    return (
        <View style={styles.container}>
            <Text>Notification</Text>
            <StatusBar style="auto"/>
            <FlatList data={currentCourses} keyExtractor={(item) => item.courseId.trim()}
                      renderItem={renderNotification} contentContainerStyle={{paddingBottom: 20}}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});