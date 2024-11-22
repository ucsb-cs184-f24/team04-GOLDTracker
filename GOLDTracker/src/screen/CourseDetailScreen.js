import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { FetchProfessorsByDepartment } from "../components/FetchProfessors"

const CourseDetailScreen = ({ route }) => {
  const { course } = route.params; // course is the "classes" component of the json return by UCSB search API 

  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);

  const courseCode = course.courseId ? course.courseId.trim() : "N/A";
  const courseTitle = course.title || "No Title";
  const courseDescription = course.description || "No Description";
  const courseInstructor = course.classSections[0].instructors[0].instructor
  const courseDepartment = course.deptCode

  // In case there is a space after the department code returned by GOLD 💀
  const removeLeadingAndTrailingSpaces = (str) => str.trim();
  const cleanedDepartmentCode = removeLeadingAndTrailingSpaces(courseDepartment);

  console.log("course department from GOLD: ", cleanedDepartmentCode)
  console.log("course instructor from GOLD: ", courseInstructor)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchedProfessor = await FetchProfessorsByDepartment(
          cleanedDepartmentCode,
          courseInstructor
        );
        console.log("matchedProfessor: ", matchedProfessor)
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.courseCode}>{courseCode}</Text>
      <Text style={styles.courseTitle}>{courseTitle}</Text>
      <Text style={styles.courseDescription}>{courseDescription}</Text>
      
      <View style={styles.professorContainer}>
        <Text style={styles.sectionHeader}>Instructor's RateMyProfessor</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : professor ? (
          <View style={styles.professorCard}>
            <Text style={styles.professorName}>{professor.firstName} {professor.lastName}</Text>
            <View style={styles.professorStats}>
              <Text style={[styles.rating,
                {
                  color: professor.avgRating > 3 ? "#2e8b57" : "#ff4500", // Green for rating > 3, else red
                }
              ]}>
                ⭐ Rating: {professor.avgRating} / 5
              </Text>
              <Text style={[styles.difficulty,
                {
                  color: professor.avgDifficulty < 3 ? "#2e8b57" : "#ff4500", //Green for difficulty < 3, else red
                }
              ]}>
                🔥 Difficulty: {professor.avgDifficulty} / 5
              </Text>
              <Text
                style={[
                  styles.takeAgain,
                  {
                    color: professor.wouldTakeAgainPercent > 70 ? "#2e8b57" : "#ff4500", // Similar to above
                  },
                ]}
              >
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
    fontSize: 18,
    color: "#555",
  },
});

export default CourseDetailScreen;
