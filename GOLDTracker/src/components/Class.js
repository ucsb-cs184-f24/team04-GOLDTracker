import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, SPACING } from "../theme/theme";
import Entypo from "@expo/vector-icons/Entypo";

class Class extends React.Component {
  goToDetails = () => {
    const { course } = this.props;
    this.props.navigation.navigate("CourseDetailsScreen", { course });
  };

  render() {
    const { course, toggleFollow } = this.props;

    const courseCode = course.courseId ? course.courseId.trim() : "N/A";
    const courseTitle = course.title || "No Title";
    const firstSection = course.classSections && course.classSections[0];

    const courseTime =
      firstSection &&
      firstSection.timeLocations &&
      firstSection.timeLocations[0]
        ? `${firstSection.timeLocations[0].beginTime} - ${firstSection.timeLocations[0].endTime}`
        : "N/A";

    const courseProfessor =
      firstSection && firstSection.instructors && firstSection.instructors[0]
        ? firstSection.instructors[0].instructor
        : "N/A";

    return (
      <View style={styles.wrapper}>
        {/* Course Code */}
        <Text style={styles.courseCode}>{courseCode}</Text>

        <View style={styles.courseContainer}>
          {/* Course Title */}
          <Text style={styles.courseTitle}>{courseTitle}</Text>

          <View style={styles.courseDetailsContainer}>
            <Text style={styles.courseTime}>{courseTime}</Text>
            <View style={styles.professorContainer}>
              <Text style={styles.courseProfessor}>{courseProfessor}</Text>

              {/* Navigate to CourseDetailsScreen */}
              {/* TODO */}
              <TouchableOpacity
                onPress={this.goToDetails}
                style={styles.detailsButton}
              >
                <Entypo name="chevron-right" size={16} color={COLORS.black} />
              </TouchableOpacity>
            </View>
          </View>

          {course.classSections &&
            course.classSections.map((section, index) => {
              // Section Time
              const sectionTime =
                section.timeLocations && section.timeLocations[0]
                  ? `${section.timeLocations[0].beginTime} - ${section.timeLocations[0].endTime}`
                  : "N/A";

              // Section Space
              const sectionSpace = `${section.enrolledTotal || 0}/${
                section.maxEnroll || 0
              }`;

              // Ensure 'following' property exists
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
                    style={[
                      styles.followButton,
                      section.following
                        ? styles.following
                        : styles.notFollowing,
                    ]}
                    onPress={() =>
                      toggleFollow(course.courseId.trim(), section.section)
                    }
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
    marginBottom: SPACING.space_8,
    paddingTop: SPACING.space_10,
    paddingHorizontal: SPACING.space_8,
    paddingLeft: SPACING.space_12,
    margin: SPACING.space_8,
  },
  courseContainer: {
    backgroundColor: COLORS.darkGrey,
    padding: SPACING.space_8,
    borderRadius: 8,
    marginTop: SPACING.space_18,
  },
  courseCode: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.ucsbBlue,
    position: "absolute",
    top: SPACING.space_4,
    left: SPACING.space_2,
    backgroundColor: COLORS.lightYellow,
    paddingVertical: SPACING.space_4,
    paddingHorizontal: SPACING.space_4,
    borderRadius: 8,
    overflow: "hidden",
    zIndex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: SPACING.space_4,
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
  },
  courseProfessor: {
    fontSize: 14,
    color: COLORS.black,
    marginRight: SPACING.space_6,
  },
  detailsButton: {
    padding: SPACING.space_,
  },
  sectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.space_4,
    borderRadius: 8,
    marginTop: SPACING.space_4,
  },
  sectionTime: {
    width: 120,
    fontSize: 14,
    color: COLORS.black,
  },
  sectionSpace: {
    width: 100,
    fontSize: 14,
    color: COLORS.black,
    textAlign: "left",
  },
  followButton: {
    width: 80,
    paddingVertical: SPACING.space_2,
    borderRadius: 8,
    alignItems: "center",
  },
  following: {
    backgroundColor: COLORS.lightBlue,
  },
  notFollowing: {
    backgroundColor: COLORS.darkBlue,
  },
  followText: {
    color: COLORS.white,
  },
});

export default Class;
