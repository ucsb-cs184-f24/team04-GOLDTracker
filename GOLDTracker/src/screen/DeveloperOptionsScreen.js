import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {runBackgroundNotificationSequence} from "../components/BackgroundRegister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ClassRegister from "../components/ClassRegister";

const DeveloperOptionsScreen = () => {
    const [time, setTime] = useState(new Date());
    const handlePress = async () => {
        await runBackgroundNotificationSequence();
    }
    const resetItems = async () => {
        await AsyncStorage.setItem("notifiedClasses", "");
        await AsyncStorage.setItem("lastPass", "");
    }
    const resetStorage = async () => {
        await ClassRegister.reset();
    }
    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={handlePress}>
                <Text>Press to manually fire the background task to check if your courses are available.</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={resetItems}>
                <Text>Press to reset already sent notifications for the pass</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={resetStorage}>
                <Text>Press to reset local storage</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
});

export default DeveloperOptionsScreen;
