import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const CourseDetailScreen = ({ route }) => {
  const { course } = route.params; // course is the "classes" component of the json return by UCSB search API 

  const courseCode = course.courseId ? course.courseId.trim() : "N/A";
  const courseTitle = course.title || "No Title";
  const courseDescription = course.description || "No Description";
  const courseInstructor = course.classSections[0].instructors[0].instructor
  const courseDepartment = course.deptCode
  console.log(courseDepartment)

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.courseCode}>{courseCode}</Text>
      <Text style={styles.courseTitle}>{courseTitle}</Text>
      <Text style={styles.courseDescription}>{courseDescription}</Text>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  courseCode: {
    fontSize: 24,
    fontWeight: "bold",
  },
  courseTitle: {
    fontSize: 20,
    marginVertical: 8,
  },
  courseDescription: {
    fontSize: 16,
    marginBottom: 16,
  },
});

export default CourseDetailScreen;
