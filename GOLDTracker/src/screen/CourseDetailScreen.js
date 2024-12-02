import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { FetchProfessorsByDepartment } from "../components/FetchProfessors"

const CourseDetailScreen = ({ route }) => {
  const { course } = route.params;

  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false); // State for description toggle

  const courseCode = course.courseId ? course.courseId.trim() : "N/A";
  const courseTitle = course.title || "No Title";
  const courseDescription = course.description || "No Description";
  const courseInstructor = course.classSections[0].instructors[0].instructor;
  const courseDepartment = course.deptCode;

  const removeLeadingAndTrailingSpaces = (str) => str.trim();
  const cleanedDepartmentCode = removeLeadingAndTrailingSpaces(courseDepartment);

  console.log("course department from GOLD: ", cleanedDepartmentCode);
  console.log("course instructor from GOLD: ", courseInstructor);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchedProfessor = await FetchProfessorsByDepartment(
          cleanedDepartmentCode,
          courseInstructor
        );
        console.log("matchedProfessor: ", matchedProfessor);
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

      {/* Collapsible Course Description */}
      <Text
        style={styles.courseDescription}
        numberOfLines={showFullDescription ? undefined : 2} // Show full or truncated
      >
        {courseDescription}
      </Text>
      <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
        <Text style={styles.readMoreButton}>
          {showFullDescription ? "Read less" : "Read more"}
        </Text>
      </TouchableOpacity>

      <View style={styles.professorContainer}>
        <Text style={styles.sectionHeader}>Instructor's RateMyProfessor</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : professor ? (
          <>
            {/* Professor Information Card */}
            <View style={styles.professorCard}>
              <Text style={styles.professorName}>
                {professor.firstName} {professor.lastName}
              </Text>
              <View style={styles.professorStats}>
                <Text
                  style={[
                    styles.rating,
                    {
                      color: professor.avgRating > 3 ? "#2e8b57" : "#ff4500",
                    },
                  ]}
                >
                  ⭐ Rating: {professor.avgRating} / 5
                </Text>
                <Text
                  style={[
                    styles.difficulty,
                    {
                      color: professor.avgDifficulty < 3 ? "#2e8b57" : "#ff4500",
                    },
                  ]}
                >
                  🔥 Difficulty: {professor.avgDifficulty} / 5
                </Text>
                <Text
                  style={[
                    styles.takeAgain,
                    {
                      color: professor.wouldTakeAgainPercent > 70
                        ? "#2e8b57"
                        : "#ff4500",
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

            {/* New Comments Card */}
            <View style={styles.commentsCard}>
              <Text style={styles.commentTitle}>💬 Summarized Comments:</Text>
              <Text style={styles.commentContent}>
                {professor.commentsSummarizedByGPT || "Not enough comments"}
              </Text>
            </View>
          </>
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  professorCard: {
    padding: 16,
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    marginBottom: 0,
    marginTop: 8, 
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
    marginBottom: 0,
  },
  commentContainer: {
    marginBottom: 10,
  },
  commentsCard: {
    marginTop: 16, // Add spacing from the professor card
    padding: 16, // Padding inside the card
    backgroundColor: "#f0f8ff", // Light background color for contrast
    borderRadius: 8, // Rounded corners
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.1, // Shadow opacity for iOS
    shadowRadius: 8, // Shadow radius for iOS
    elevation: 4, // Shadow for Android
    borderWidth: 1, // Optional: Add border
    borderColor: "#ddd", // Optional: Border color
  },
  commentTitle: {
    fontSize: 18, // Font size for the title
    // Bold for the title
    lineHeight: 28, 
  },
  commentContent: {
    fontSize: 18, // Font size for the content
    color: "#555", // Text color
    textAlign: "justify", // Justifies text to align edges
    marginLeft: 28, // Indent subsequent lines
    lineHeight: 24,
    maxWidth: 290,
    
  },
  readMoreButton: {
    fontSize: 16,
    color: "#007bff", // Blue color for the link
    fontWeight: "bold",
    marginTop: -14,
    marginBottom: 8,
  },
});

export default CourseDetailScreen;
