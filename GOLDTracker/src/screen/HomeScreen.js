import React, { useState } from "react";
import { View, ScrollView, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { COLORS, SPACING } from "../theme/theme";
import Class from "../components/Class";
import coursesData from "../assets/courses"; // replace later with school API
import SearchComponent from '../components/SearchComponent';

const HomeScreen = ({ navigation }) => {
  const [courses, setCourses] = useState(coursesData);

  // TODO: Toggle follow status of a section, following status will be passed to cart in later implimentation
  const toggleFollow = (courseId, sectionId) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              sections: course.sections.map((section) =>
                section.id === sectionId
                  ? { ...section, following: !section.following }
                  : section
              ),
            }
          : course
      )
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
        <SearchComponent />
          {courses.map((course) => (
            <Class key={course.id} course={course} toggleFollow={toggleFollow} navigation={navigation}/>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    padding: SPACING.space_8,
  },
});

export default HomeScreen;
