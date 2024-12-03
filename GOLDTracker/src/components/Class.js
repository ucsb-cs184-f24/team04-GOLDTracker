import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, SPACING } from "../theme/theme";
import Entypo from "@expo/vector-icons/Entypo";
import { deregisterClass, registerClass } from "./ClassRegister";

class Class extends React.Component {
  goToDetails = () => {
    const { course, navigation } = this.props;
    navigation.navigate("CourseDetailScreen", { course });
  };

  render() {
    const { course, toggleFollow, setFollow } = this.props;

    const courseCode = course.courseId ? course.courseId.trim() : "N/A";
    const firstSection = course.classSections && course.classSections[0];

    const timeLocation =
      firstSection &&
      firstSection.timeLocations &&
      firstSection.timeLocations[0];

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
      firstSection && firstSection.instructors && firstSection.instructors[0]
        ? firstSection.instructors[0].instructor
        : "N/A";

    return (
      <View style={styles.wrapper}>
        <View style={styles.courseContainer}>
          <View style={styles.courseHeader}>
            {/* Course Code */}
            <Text style={styles.courseCode}>{courseCode}</Text>
            <TouchableOpacity
              onPress={this.goToDetails}
              style={styles.detailsButton}
            >
              <Entypo name="chevron-right" size={24} color={COLORS.black} />
            </TouchableOpacity>
          </View>

          <View style={styles.courseDetailsContainer}>
            <Text style={styles.courseTime}>{courseTime}</Text>
            <View style={styles.professorContainer}>
              <Text style={styles.courseProfessor}>{courseProfessor}</Text>
            </View>
          </View>

          {course.classSections &&
            course.classSections.filter((section) => section.courseCancelled !== "C         ").map((section, index) => {
              if (index === 0) return null;

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

              if (section.following === undefined) {
                section.following = false;
              }

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
                  <TouchableOpacity
                    testID={`follow-button-${section.section}`}
                    style={[
                      styles.followButton,
                      section.following
                        ? styles.following
                        : styles.notFollowing,
                    ]}
                    onPress={() => {
                      toggleFollow(course.courseId.trim(), section.section);
                      if (section.following) {
                        deregisterClass(
                          `${course.classSections[0].enrollCode}`,
                          `${section.enrollCode}`
                        );
                      } else {
                        registerClass(
                          `${course.classSections[0].enrollCode}`,
                          `${section.enrollCode}`
                        );
                      }
                    }}
                  >
                    <Text style={styles.followText}>
                      {section.following ? "Following" : "Follow"}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
        </View>
      </View>
    );
  }
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

export default Class;
