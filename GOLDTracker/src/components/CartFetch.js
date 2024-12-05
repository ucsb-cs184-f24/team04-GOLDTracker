import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Alert, Text, TouchableOpacity } from "react-native";
import { getClasses, deregisterClass } from '../components/ClassRegister';
import { auth } from "../../firebaseConfig";
import { COLORS, SPACING } from "../theme/theme";
import { Swipeable } from 'react-native-gesture-handler';
import Clipboard from '@react-native-clipboard/clipboard';
import Entypo from '@expo/vector-icons/Entypo';
import {useFocusEffect} from "@react-navigation/native";

const CartFetch = ({ setClasses, setErrorMessage }) => {
    const [fullCourseDetails, setFullCourseDetails] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const fetchCartClasses = async () => {
        const classList = await getClasses();
        if (classList) {
            const courseIds = Object.keys(classList);
            const courseDetails = await Promise.all(courseIds.map(async (courseId) => {
                let idToken = await auth.currentUser.getIdToken();
                let authHeader = new Headers();
                authHeader.append("authorization", idToken);

                const currentClass = await (await fetch(`https://us-central1-goldtracker-beb96.cloudfunctions.net/poll/20251/${courseId}`, { headers: authHeader })).json();

                currentClass.classSections = currentClass.classSections.filter(section =>
                    classList[courseId] && classList[courseId].includes(section.enrollCode)
                );

                currentClass.classSections.forEach(section => {
                    section.following = true; 
                });

                const classEnrollCode = courseId;
                const sectionEnrollCode = classList[courseId][0];

                return { courseId, classEnrollCode, sectionEnrollCode, ...currentClass };
            }));

            setFullCourseDetails(courseDetails);
            setClasses(courseDetails);
            setErrorMessage('');
        } else {
            setErrorMessage('No classes in your cart.');
        }
    };

    useEffect(() => {
        fetchCartClasses();
    }, [isUpdated]);

    const handleUnfollow = async (classEnrollCode, sectionEnrollCode) => {

        Alert.alert(
            "Unfollow",
            "Are you sure you want to unfollow this section?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            await deregisterClass(classEnrollCode, sectionEnrollCode);
                            setIsUpdated(!isUpdated);
                            //DevSettings.reload(); // Reload the app after successful sign-out
                        } catch (error) {
                            console.error("Error signing out: ", error);
                        }
                    },
                },
            ]
        )
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchCartClasses();
        setRefreshing(false);
    };

    const copyToClipboard = (sectionId) => {
        Clipboard.setString(sectionId);
        Alert.alert("Success!", `Section ID has been copied to clipboard.`);
    };
    // ${sectionId}
    const renderClassItem = ({ item }) => {
        const renderRightActions = (progress, dragX, sectionEnrollCode) => {
            return (
                <View style={styles.rightAction}>
                    {/* Follow Button */}
                    <TouchableOpacity
                        style={styles.followButton}
                        onPress={() => handleUnfollow(item.classEnrollCode, item.sectionEnrollCode)}
                    >
                        <Text style={styles.FollowText}>Unfollow</Text>
                    </TouchableOpacity>
                    {/* Copy to Clipboard Button */}
                    <TouchableOpacity
                        style={styles.joinButton}
                        onPress={() => copyToClipboard(sectionEnrollCode)}
                    >
                        <Text style={styles.JoinText}>Copy ID</Text>
                    </TouchableOpacity>
                </View>
            );
        };

        return (
            <View style={styles.classBox}>
                <Text style={styles.courseId}>{item.courseId.replace(/\s+/, " ")}</Text>

                {item.classSections.length > 0 ? (
                    item.classSections.map((section, index) => {
                        const sectionEnrollCode = section.enrollCode;

                        const sectionTime =
                            section.timeLocations.length > 0
                                ? `${section.timeLocations[0].days} ${section.timeLocations[0].beginTime} - ${section.timeLocations[0].endTime}`
                                : "N/A";

                        const formattedSectionTime = sectionTime
                            ? sectionTime.replace(/(\w)\s(\d{2}:\d{2})/g, "$1 $2") // Adjusting for consistent formatting
                            : "N/A";

                        return (
                            <Swipeable
                                key={sectionEnrollCode}
                                renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, sectionEnrollCode)}
                                overshootRight={false}
                            >
                                <View
                                    key={sectionEnrollCode}
                                    style={[
                                        styles.sectionContainer,
                                        {
                                            backgroundColor:
                                                index % 2 === 0 ? COLORS.darkGrey : COLORS.lightGrey,
                                            paddingVertical: 12,
                                            paddingHorizontal: 10,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            borderRadius: 12,
                                            marginTop: 8,
                                        },
                                    ]}
                                >
                                    <View style={styles.sectionDetails}>
                                        <Text style={styles.sectionTime}>{formattedSectionTime}</Text>
                                        <Text style={styles.sectionSpace}>
                                            Space: {section.enrolledTotal || 0}/{section.maxEnroll || 0}
                                        </Text>
                                    </View>
                                    <View style={styles.sectionDetails}>
                                        <Entypo
                                            name="chevron-left"
                                            size={20}
                                            color= {COLORS.ucsbBlue}
                                        />
                                    </View>
                                </View>
                            </Swipeable>
                        );
                    })
                ) : (
                    // For courses with no sections, allow swipeable functionality for the entire course card
                    <Swipeable
                        key={item.courseId}
                        renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.classEnrollCode)}
                        overshootRight={false}
                    >
                        <View
                            key={item.courseId}
                            style={styles.courseContainerNoSections}
                        >
                            <Text style={styles.noSectionsText}>No sections available</Text>
                            <View style={styles.sectionDetails}>
                                        <Entypo
                                            name="chevron-left"
                                            size={20}
                                            color= {COLORS.ucsbBlue}
                                        />
                             </View>
                        </View>
                    </Swipeable>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.pullToRefreshText}>Pull to Refresh</Text>
            <FlatList
                data={fullCourseDetails}
                keyExtractor={(item) => item.classSections[0].enrollCode}
                renderItem={renderClassItem}
                refreshing={refreshing}
                onRefresh={onRefresh}
                contentContainerStyle={styles.flatListContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        backgroundColor: COLORS.white,
    },
    flatListContainer: {
        paddingBottom: 100,
    },
    pullToRefreshText: {
        textAlign: 'center',
        color: 'grey',
    },
    classBox: {
        backgroundColor: COLORS.lightGrey,
        borderRadius: 20,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
        marginLeft: 15,
        marginRight: 15,
    },
    courseId: {
        fontSize: 18,
        paddingVertical: 6,
        marginLeft: 15,
        marginTop: 8,
        marginBottom: 10,
        fontWeight: 'bold',
        color: COLORS.ucsbBlue,
    },
    sectionDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        
    },
    sectionContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 16,
        paddingVertical: 10,
        height: 40,
    },
    sectionTime: {
        width: 170,
        fontSize: 14,
        color: COLORS.black,
    },
    sectionSpace: {
        width: 100,
        fontSize: 14,
        color: COLORS.black,
    },
    followButton: {
        color: 'white',
        width: 100,
        paddingVertical: 9,
        borderRadius: 16,
        alignItems: "center",
        textAlign: 'center',
        backgroundColor: "#ba2f33",
        marginRight: 4,
    },
    joinButton: {
        width: 100,
        paddingVertical: 9,
        borderRadius: 16,
        alignItems: "center",
        textAlign: 'center',
        backgroundColor: COLORS.darkBlue,
    },
    courseContainerNoSections: {
        padding: 15,
        borderRadius: 12,
        backgroundColor: COLORS.lightGrey,
        //alignItems: 'center',
        ///justifyContent: 'center',
        flexDirection: "row",
        justifyContent: "space-between",
    },
    noSectionsText: {
        fontSize: 14,
        color: COLORS.black,
        marginLeft:100,
    },
    rightAction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 15,
        marginBottom:4,
        height: 40,
        marginTop:8,
    },
    FollowText:{
        fontSize: 15,
        color: "#fff",
        fontWeight: "500",
        textShadowColor: COLORS.black,
        textShadowOffset: { width: 1, height: 1 }, // Shadow offset
        textShadowRadius: 8, // Shadow blur radius
        fontFamily:"Nunito-Regular",
    },
    JoinText:{
        fontSize: 15,
        color: "#fff",
        fontWeight: "500",
        textShadowColor: COLORS.black,
        textShadowOffset: { width: 1, height: 1 }, 
        textShadowRadius: 3, // Increased radius for a more spread out blur
        fontFamily: "Nunito-Regular",
    }
});

export default CartFetch;
