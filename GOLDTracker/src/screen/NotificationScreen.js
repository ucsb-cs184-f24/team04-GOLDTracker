import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Alert } from "react-native";

import { StatusBar } from 'expo-status-bar';
import * as BackgroundRegister from "../components/BackgroundRegister";
import { Swipeable } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { COLORS, SPACING } from "../theme/theme";
import {useFocusEffect} from "@react-navigation/native";



export default function NotificationScreen() {
    let [currentCourses, setCurrentCourses] = useState([]);

    useFocusEffect(React.useCallback(() => {
        async function getCourses() {
            let courses = await BackgroundRegister.getNotificationHistory();
            setCurrentCourses(courses);
        }
        getCourses();
    },[]));

    const handlePress = async () => {
        await WebBrowser.openBrowserAsync("https://my.sa.ucsb.edu/gold/");
    };

    //TO DO
    const handleDelete = async (id) => {
        await BackgroundRegister.deleteNotification(id);
        setCurrentCourses(prevCourses => prevCourses.filter(course => course.id !== id));
    };

    const renderNotification = ({ item }) => {
        const courseCode = item.courseId ? item.courseId.replace(/\s+/, " ") : "N/A";
        const courseProfessor = item.classSections[0]?.instructors[0] ? item.classSections[0]?.instructors[0].instructor : "TBA";

        const renderRightActions = (progress, dragX) => {
            return (
                <View style={styles.rightAction}>
                    {/* Go to Gold Button */}
                    <TouchableOpacity
                        style={styles.goToGold}
                        onPress={handlePress}
                    >
                        <Text style={styles.Goldtext}>Go To Gold</Text>
                    </TouchableOpacity>
                    {/* Delete Notification Button */}
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(item.id)}
                    >
                        <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            );
        };

        return (
            <Swipeable
                key={item.id}
                renderRightActions={renderRightActions}
                overshootRight={false}
            >
                <View key={item.id} style={styles.courseContainerNoSections}>
                    <View style={styles.sectionDetails}>
                        <Text style={styles.text}>{`${courseCode.replace(/\s+/, " ")} with ${courseProfessor} has available sections`}</Text> 
                        <FontAwesome
                            name="chevron-left"
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
                data={currentCourses}
                keyExtractor={(item) => item.id}
                renderItem={renderNotification}
                contentContainerStyle={styles.flatListContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    flatListContainer: {
        paddingBottom: 90,
    },
    goToGold: {
        backgroundColor: COLORS.darkBlue,
        paddingVertical: 20,
        borderRadius: 16,
        paddingHorizontal: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    deleteButton: {
        backgroundColor: "#ba2f33",
        paddingVertical: 20,
        paddingHorizontal: 12,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    rightAction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 15,
        marginBottom: 10,
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
        padding: 30,
        //borderRadius: 12,
        backgroundColor: COLORS.lightGrey,
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    text : {
        marginRight:20,
        fontSize: 16,
    }
});
