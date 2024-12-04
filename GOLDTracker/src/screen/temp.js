import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Alert } from "react-native";
import { COLORS, SPACING } from "../theme/theme";
import * as WebBrowser from 'expo-web-browser';
import Ionicons from '@expo/vector-icons/Ionicons';
import Notification from "../components/Notification"; 
import { Swipeable } from 'react-native-gesture-handler';

export default function NotificationScreen() {
    //notifications history, not save in the database now
    const [fullCourseDetails, setFullCourseDetails] = useState([
        { courseId: "CS 101", courseName: "Intro to Computer Science", classEnrollCode: "123", instructor: "Dr. Smith" },
        { courseId: "CS 102", courseName: "Data Structures", classEnrollCode: "124", instructor: "Prof. Johnson" },
    ]);

    const handlePress = async () => {
        await WebBrowser.openBrowserAsync("https://my.sa.ucsb.edu/gold/");
    };

    //Need to Change it
    const handleDelete = (courseId) => {
        // Logic to delete the notification (remove item from state)
        setFullCourseDetails(prevState => prevState.filter(item => item.courseId !== courseId));
        Alert.alert("Notification deleted!");
    };

    const renderClassItem = ({ item }) => {
        const renderRightActions = (progress, dragX) => {
            return (
                <View style={styles.rightAction}>
                    {/* Go to Gold Button */}
                    <TouchableOpacity
                        style={styles.goToGold}
                        onPress={handlePress} // Fix by calling the function
                    >
                        <Text style={styles.Goldtext}>Go To Gold</Text>
                    </TouchableOpacity>
                    {/* Delete Notification Button */}
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(item.courseId)} // Pass the courseId to handleDelete
                    >
                        <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            );
        };

        return (
            <Swipeable
                key={item.courseId}
                renderRightActions={renderRightActions}
                overshootRight={false}
            >
                <View key={item.courseId} style={styles.courseContainerNoSections}>
                    <Text style={styles.text}>{`${item.courseName} with ${item.instructor} has available sections`}</Text>
                    <View style={styles.sectionDetails}>
                        <Ionicons
                            name="chevron-back-outline"
                            size={20}
                            color={COLORS.darkBlue}
                        />
                    </View>
                </View>
            </Swipeable>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={fullCourseDetails}
                keyExtractor={(item) => item.courseId}
                renderItem={renderClassItem}
                contentContainerStyle={styles.flatListContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.white,
    },
    text: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Nunito-Regular",
    },
    goToGold: {
        backgroundColor: COLORS.darkBlue,
        paddingVertical: 20,
        borderRadius: 16,
        paddingHorizontal: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: "#ba2f33",
        paddingVertical: 20,
        paddingHorizontal: 12,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    rightAction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 15,
        marginBottom: 6,
        //height:40,
        //paddingVertical:10,
        //paddingHorizontal:10,
        //marginTop: 8,
    },
    Goldtext: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "500",
        fontFamily: "Nunito-Regular",
    },
    deleteText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "500",
        fontFamily: "Nunito-Regular",
    },
    sectionDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    courseContainerNoSections: {
        padding: 15,
        borderRadius: 12,
        backgroundColor: COLORS.lightGrey,
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom:10,
    },
    flatListContainer: {
        paddingBottom: 90,
    },
});