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

    return (
      <View style={styles.wrapper}>
        {/* Course Name */}
        <Text style={styles.courseCode}>{course.code}</Text>

        <View style={styles.courseContainer}>
         
          <View style={styles.courseDetailsContainer}>
            <Text style={styles.courseTime}>{course.time}</Text>
            <View style={styles.professorContainer}>
              <Text style={styles.courseProfessor}>{course.professor}</Text>
              
              {/* TODO: Toggle to CourseDetialScreen */}
              <TouchableOpacity onPress={this.goToDetails} style={styles.detailsButton}>
                <Entypo name="chevron-right" size={16} color={COLORS.black} />
              </TouchableOpacity>
            </View>
          </View>

          {course.sections.map((section, index) => (
            <View
              key={section.id}
              style={[
                styles.sectionContainer,
                { backgroundColor: index % 2 === 0 ? COLORS.lightGrey : COLORS.darkGrey }
              ]}
            >
              <Text style={styles.sectionTime}>{section.time}</Text>
              <Text style={styles.sectionSpace}>Space: {section.space}</Text>
              <TouchableOpacity
                style={[
                  styles.followButton,
                  section.following ? styles.following : styles.notFollowing
                ]}
                onPress={() => toggleFollow(course.id, section.id)}
              >
                <Text style={styles.followText}>{section.following ? "Following" : "Follow"}</Text>
              </TouchableOpacity>
            </View>
          ))}
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
  courseDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.space_4,
    marginTop: SPACING.space_4,
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
