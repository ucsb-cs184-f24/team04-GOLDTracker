import React from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {runBackgroundNotificationSequence} from "../components/BackgroundRegister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ClassRegister from "../components/ClassRegister";
import {COLORS} from "../theme/theme";

const DeveloperOptionsScreen = () => {
    const handlePress = async () => {
        console.log("ran handlepress")
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
            <View style={styles.container}>
                <TouchableOpacity onPress={handlePress} style={styles.button}>
                    <Text style={styles.text}>Press to manually fire the background task to check if your courses are available.</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <TouchableOpacity onPress={resetItems} style={styles.button}>
                    <Text style={styles.text}>Press to reset already sent notifications for the pass</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <TouchableOpacity onPress={resetStorage} style={styles.button}>
                    <Text style={styles.text}>Press to reset local storage and storage on Firebase, in case of an error.</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.white,
    },
    button: {
        backgroundColor: COLORS.darkBlue,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 18
    },
    text: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        paddingRight: 5,
        fontFamily: "Nunito-Regular",
    }
});

export default DeveloperOptionsScreen;
