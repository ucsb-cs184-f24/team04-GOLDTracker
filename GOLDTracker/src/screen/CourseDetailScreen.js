import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { FetchProfessorsByDepartment } from "../components/FetchProfessors";
import { registerClass, deregisterClass } from "../components/ClassRegister"  // import your class registration logic
import { COLORS, SPACING } from "../theme/theme";

const CourseDetailScreen = ({ route }) => {
  const { course } = route.params; // course is the "classes" component of the json return by UCSB search API

  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followingAll, setFollowingAll] = useState(false); // Track the state of following all sections

  const courseCode = course.courseId ? course.courseId.trim() : "N/A";
  const courseTitle = course.title || "No Title";
  const courseDescription = course.description || "No Description";
  const courseInstructor = course.classSections[0].instructors[0].instructor;
  const courseDepartment = course.deptCode;

  // In case there is a space after the department code returned by GOLD 💀
  const removeLeadingAndTrailingSpaces = (str) => str.trim();
  const cleanedDepartmentCode = removeLeadingAndTrailingSpaces(courseDepartment);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchedProfessor = await FetchProfessorsByDepartment(
          cleanedDepartmentCode,
          courseInstructor
        );
        if (matchedProfessor.length > 0) {
          setProfessor(matchedProfessor[0]); // We only need the first match
        }
      } catch (error) {
        console.error("Error fetching professors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseDepartment, courseInstructor]);

  const toggleFollowAll = async () => {
    // if (followingAll) {
    //   // Deregister all sections
    //   for (let section of course.classSections) {
    //     if (section.enrollCode) {
    //       await deregisterClass(course.enrollCode, section.enrollCode);
    //     }
    //   }
    // } else {
    //   // Register all sections
    //   for (let section of course.classSections) {
    //     if (section.enrollCode) {
    //       await registerClass(course.enrollCode, section.enrollCode);
    //     }
    //   }
    // }
    // setFollowingAll(!followingAll); // Toggle the state
    Alert.alert("not finished");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.courseCode}>{courseCode}</Text>
      <Text style={styles.courseTitle}>{courseTitle}</Text>
      <Text style={styles.courseDescription}>{courseDescription}</Text>

      {/* Follow all sections button */}
      <TouchableOpacity
        style={[styles.followAllButton, followingAll ? styles.following : styles.notFollowing]}
        onPress={toggleFollowAll}
      >
        <Text style={styles.followAllButtonText}>
          {followingAll ? "Following All Sections" : "Follow All Sections"}
        </Text>
      </TouchableOpacity>


      <View style={styles.professorContainer}>
        <Text style={styles.sectionHeader}>Instructor's RateMyProfessor</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : professor ? (
          <View style={styles.professorCard}>
            <Text style={styles.professorName}>{professor.firstName} {professor.lastName}</Text>
            <View style={styles.professorStats}>
              <Text style={[styles.rating, {
                color: professor.avgRating > 3 ? "#2e8b57" : "#ff4500", // Green for rating > 3, else red
              }]}>
                ⭐ Rating: {professor.avgRating} / 5
              </Text>
              <Text style={[styles.difficulty, {
                color: professor.avgDifficulty < 3 ? "#2e8b57" : "#ff4500", // Green for difficulty < 3, else red
              }]}>
                🔥 Difficulty: {professor.avgDifficulty} / 5
              </Text>
              <Text style={[styles.takeAgain, {
                color: professor.wouldTakeAgainPercent > 70 ? "#2e8b57" : "#ff4500", // Similar to above
              }]}>
                💯 Would Take Again: {professor.wouldTakeAgainPercent}%
              </Text>
              <Text style={styles.numRatings}>
                🗳 Number of Ratings: {professor.numRatings}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noProfessorText}>
            No matching professor found for this course.
          </Text>
        )}
      </View>
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
  followAllButton: {
    width: "100%",
    paddingVertical: SPACING.space_8,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  following: {
    backgroundColor: COLORS.lightBlue,
  },
  notFollowing: {
    backgroundColor: COLORS.darkBlue,
  },
  followAllButtonText: {
    fontSize: 18,
    color: "#fff", // Blue color for "Follow"
    fontWeight: "500",
    textShadowColor: "#007BFF", // Shadow color (black)
    textShadowOffset: { width: 1, height: 1 }, // Shadow offset
    textShadowRadius: 3, // Shadow blur radius
    fontFamily:"Nunito-Regular",
  },
  professorContainer: {
    marginTop: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  professorCard: {
    padding: 16,
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  professorName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  professorStats: {
    marginTop: 8,
  },
  rating: {
    fontSize: 18,
    marginBottom: 4,
  },
  difficulty: {
    fontSize: 18,
    marginBottom: 4,
  },
  takeAgain: {
    fontSize: 18, 
    marginBottom: 4,
  },
  numRatings: {
    fontSize: 16,
    color: "#555",
  },
});

export default CourseDetailScreen;
