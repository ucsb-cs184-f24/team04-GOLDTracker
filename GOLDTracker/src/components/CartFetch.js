import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Alert, Text, TouchableOpacity } from "react-native"; 
import { getClasses, deregisterClass } from '../components/ClassRegister'; 
import { auth } from "../../firebaseConfig"; 
import { COLORS, SPACING } from "../theme/theme";

const CartFetch = ({ setClasses, setErrorMessage }) => {
    const [fullCourseDetails, setFullCourseDetails] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
    const [refreshing, setRefreshing] = useState(false); 

    const fetchCartClasses = async () => {
        const classList = await getClasses();
        console.log("Class List: ", classList);
        if (classList) {
            const courseIds = Object.keys(classList);
            const courseDetails = await Promise.all(courseIds.map(async (courseId) => {
                let idToken = await auth.currentUser.getIdToken();
                let authHeader = new Headers();
                authHeader.append("authorization", idToken);

                const currentClass = await (await fetch(`https://us-central1-goldtracker-beb96.cloudfunctions.net/poll/20244/${courseId}`, { headers: authHeader })).json();

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
        console.log(`Unfollowing Class with Enroll Code: ${classEnrollCode}, Section Enroll Code: ${sectionEnrollCode}`);

        const success = await deregisterClass(classEnrollCode, sectionEnrollCode);
        if (success) {
            Alert.alert("Success", "You have unfollowed the class.");
            setIsUpdated(!isUpdated);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchCartClasses();
        setRefreshing(false); 
    };

    const renderClassItem = ({ item }) => {
        return (
            <View style={styles.classBox}>
                <Text style={styles.courseId}>Course ID: {item.courseId}</Text>
                <Text style={styles.courseTitle}>Title: {item.title}</Text>

                {item.classSections.length > 0 ? (
                    item.classSections.map((section) => {
                        const sectionEnrollCode = section.enrollCode;

                        const sectionTime = section.timeLocations.length > 0
                            ? `${section.timeLocations[0].days} ${section.timeLocations[0].beginTime} - ${section.timeLocations[0].endTime}`
                            : "N/A";

                        return (
                            <View key={sectionEnrollCode} style={styles.sectionContainer}>
                                <Text style={styles.sectionTime}>Time: {sectionTime}</Text>
                                <Text style={styles.sectionSpace}>
                                    Space: {section.enrolledTotal || 0}/{section.maxEnroll || 0}
                                </Text>
                                <TouchableOpacity
                                    style={styles.unfollowButton}
                                    onPress={() => handleUnfollow(item.classEnrollCode, sectionEnrollCode)}
                                >
                                    <Text style={{ color: '#fff' }}>Unfollow</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })
                ) : (
                    <Text style={styles.noSectionsText}>No sections available for this course. 
                        <TouchableOpacity
                            style={styles.unfollowButton2}
                            onPress={() => handleUnfollow(item.classEnrollCode, item.sectionEnrollCode)}
                        >
                            <Text style={{ color: '#fff' }}>Unfollow</Text>
                        </TouchableOpacity>
                    </Text>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
                <Text style={styles.pullToRefreshText}>Pull to refresh</Text>
                <FlatList
                    data={fullCourseDetails}
                    keyExtractor={(item) => item.courseId}
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
        display: 'flex'
    },
    flatListContainer: {
        paddingBottom: 20,
    },
    pullToRefreshText: {
        textAlign: 'center',
        color: 'grey'
    },
    classBox: {
        backgroundColor: '#f9fafb',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
        marginLeft: 10,
        marginRight: 10,
    },
    courseId: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    courseTitle: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    sectionContainer: {
        marginTop: 10,
    },
    sectionTime: {
        fontSize: 14,
        color: '#555',
    },
    sectionSpace: {
        fontSize: 14,
        color: '#555',
    },
    unfollowButton: {
        color : 'white',
        paddingVertical: SPACING.space_8,
        borderRadius: 16,
        alignItems: "center",
        textAlign: 'center',
        marginLeft: 120,
        marginRight: 120,
        backgroundColor: COLORS.darkBlue,

    },
    unfollowButton2: {
        color: 'white',
        paddingVertical: SPACING.space_8,
        borderRadius: 16,
        alignItems: "center",
        textAlign: 'center',
        marginLeft: 120,
        marginRight: 120,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: COLORS.darkBlue,

    },
    noSectionsText: {
        color: 'gray',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5,
    },
});

export default CartFetch;