import React, {useEffect, useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, SPACING } from "../theme/theme";
import Entypo from "@expo/vector-icons/Entypo";
import { deregisterClass, registerClass } from "./ClassRegister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ClassRegister from "./ClassRegister";
import {useFocusEffect} from "@react-navigation/native";

export default function Class({course, navigation, setFollow, toggleFollow, shouldFollow}) {
  const goToDetails = (lectureSections) => {
    navigation.navigate("CourseDetailScreen", {course, lectureSections});
  };

  let lectureSections = [];
  for (let i = 0; i < course.classSections.length; i++) {
    if (course.classSections[i].section.slice(2, 4) === "00") {
      lectureSections.push(course.classSections[i].enrollCode);
    }
  }
  let noSections = false;
  if (lectureSections.length === course.classSections.length) {
    noSections = true;
  }

  useFocusEffect(React.useCallback(() => {
    async function runRecheck() {
      let followedCourses = [];
      for (let i = 0; i < lectureSections.length; i++) {
        followedCourses = followedCourses.concat(await ClassRegister.getIndividualClass(lectureSections[i]));
      }
      for (let i = 0; i < course.classSections.length; i++) {
        if (course.classSections[i].following && followedCourses.indexOf(course.classSections[i].enrollCode) === -1) {
          setFollow(course.courseId.replace(/\s+/, " "), course.classSections[i].section, false);
          course.classSections[i].following = false;
        } else if (!course.classSections[i].following && followedCourses.indexOf(course.classSections[i].enrollCode) !== -1) {
          setFollow(course.courseId.replace(/\s+/, " "), course.classSections[i].section, true);
          course.classSections[i].following = true;
        }
      }
    }

    runRecheck();
  }, []))

  const courseCode = course.courseId ? course.courseId.replace(/\s+/, " ") : "N/A";

  return (
      <View style={styles.wrapper}>
        <View style={styles.courseContainer}>
          <View style={styles.courseHeader}>
            {/* Course Code */}
            <Text style={styles.courseCode}>{courseCode}</Text>
            <TouchableOpacity
                onPress={() => goToDetails(lectureSections)}
                style={styles.detailsButton}
            >
              <Entypo name="chevron-right" size={24} color={COLORS.black}/>
            </TouchableOpacity>
          </View>

          {course.classSections &&
              course.classSections.filter((section) => section.courseCancelled !== "C         ").map((section, index) => {
                if (!noSections && section.section.slice(2, 4) === "00") {
                  const timeLocation =
                      section &&
                      section.timeLocations &&
                      section.timeLocations[0];

                  const days =
                      timeLocation && timeLocation.days
                          ? timeLocation.days.replace(/\s/g, "")
                          : "N/A";

                  const beginTime = timeLocation && timeLocation.beginTime;
                  const endTime = timeLocation && timeLocation.endTime;

                  const courseTime =
                      days && beginTime && endTime
                          ? `${days} ${beginTime} - ${endTime}`
                          : "N/A";

                  const courseProfessor =
                      section && section.instructors && section.instructors[0]
                          ? section.instructors[0].instructor
                          : "N/A";
                  return (
                      <View key={section.enrollCode} style={styles.courseDetailsContainer}>
                        <Text style={styles.courseTime}>{courseTime}</Text>
                        <View style={styles.professorContainer}>
                          <Text style={styles.courseProfessor}>{courseProfessor}</Text>
                        </View>
                      </View>
                  )
                }

                const timeLocation =
                    section.timeLocations && section.timeLocations[0];

                const days =
                    timeLocation && timeLocation.days
                        ? timeLocation.days.replace(/\s/g, "")
                        : "N/A";

                const beginTime = timeLocation && timeLocation.beginTime;
                const endTime = timeLocation && timeLocation.endTime;

                const sectionTime =
                    days && beginTime && endTime
                        ? `${days} ${beginTime} - ${endTime}`
                        : "N/A";

                const sectionSpace = `${section.enrolledTotal || 0}/${
                    section.maxEnroll || 0
                }`;


                return (
                    <View
                        key={section.enrollCode}
                        style={[
                          styles.sectionContainer,
                          {
                            backgroundColor:
                                index % 2 === 0 ? COLORS.lightGrey : COLORS.darkGrey,
                          },
                        ]}
                    >
                      <Text style={styles.sectionTime}>{sectionTime}</Text>
                      <Text style={styles.sectionSpace}>Space: {sectionSpace}</Text>
                      {shouldFollow &&(<TouchableOpacity
                          testID={`follow-button-${section.section}`}
                          style={[
                            styles.followButton,
                            section.following
                                ? styles.following
                                : styles.notFollowing,
                          ]}
                          onPress={() => {
                            toggleFollow(course.courseId.replace(/\s+/, " "), section.section);
                            if (section.following) {
                              deregisterClass(
                                  `${lectureSections[parseInt(section.section.slice(0, 2)) - 1]}`,
                                  `${section.enrollCode}`
                              );
                            } else {
                              registerClass(
                                  `${lectureSections[parseInt(section.section.slice(0, 2)) - 1]}`,
                                  `${section.enrollCode}`
                              );
                            }
                          }}
                      >
                        <Text style={styles.followText}>
                          {section.following ? "Following" : "Follow"}
                        </Text>
                      </TouchableOpacity>)}
                    </View>
                );
              })}
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: SPACING.space_16,
    
  },
  courseContainer: {
    backgroundColor: COLORS.lightGrey,
    paddingTop: SPACING.space_8,
    paddingHorizontal: 0,
    borderRadius: 16,
    marginTop: SPACING.space_18,
  },
  courseCode: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.ucsbBlue,
    paddingVertical: SPACING.space_4,
    marginLeft: SPACING.space_8,
  },
  courseDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.space_4,
  },
  professorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  courseTime: {
    fontSize: 14,
    color: COLORS.black,
    flex: 1,
    marginLeft: SPACING.space_8,
  },
  courseProfessor: {
    fontSize: 14,
    color: COLORS.black,
    marginRight: SPACING.space_6,
  },
  detailsButton: {
    padding: 0,
  },
  sectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    marginTop: SPACING.space_4,
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  sectionTime: {
    width: 150,
    fontSize: 14,
    color: COLORS.black,
    marginLeft: SPACING.space_8,
  },
  sectionSpace: {
    width: 100,
    fontSize: 14,
    color: COLORS.black,
    textAlign: "left",
  },
  followButton: {
    width: 80,
    paddingVertical: SPACING.space_8,
    borderRadius: 16,
    alignItems: "center",

  },
  following: {
    backgroundColor: COLORS.lightBlue,
  },
  notFollowing: {
    backgroundColor: COLORS.darkBlue,
  },
  followText: {
    fontSize: 15,
    color: "#fff", // Blue color for "Follow"
    fontWeight: "500",
    textShadowColor: "#007BFF", // Shadow color (black)
    textShadowOffset: { width: 1, height: 1 }, // Shadow offset
    textShadowRadius: 3, // Shadow blur radius
    fontFamily:"Nunito-Regular",
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.space_4,
  },
});

