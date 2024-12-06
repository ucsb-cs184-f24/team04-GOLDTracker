import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { FetchProfessorsByDepartment } from "../components/FetchProfessors"
import { COLORS, SPACING } from "../theme/theme";
import {deregisterClass, getClasses, getIndividualClass, registerClass} from "../components/ClassRegister";

const CourseDetailScreen = ({ route }) => {
  const { course, lectureSections } = route.params;

  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false); // State for description toggle
  const [followingAll, setFollowingAll] = useState(false); // Track the state of following all sections

  const courseCode = course.courseId ? course.courseId.replace(/\s+/, " ") : "N/A";
  const courseTitle = course.title || "No Title";
  const courseDescription = course.description || "No Description";
  const courseInstructor = course.classSections[0] && course.classSections[0].instructors && course.classSections[0].instructors[0]
      ? course.classSections[0].instructors[0].instructor
      : "N/A";
  const courseDepartment = course.deptCode;

  const removeLeadingAndTrailingSpaces = (str) => str.trim();
  const cleanedDepartmentCode = removeLeadingAndTrailingSpaces(courseDepartment);

  console.log("course department from GOLD: ", cleanedDepartmentCode);
  console.log("course instructor from GOLD: ", courseInstructor);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (courseInstructor == "N/A"){
          console.log("courseInstructor is undefined:", courseInstructor);
        }
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
        let sectionCount = 0;
        for(let i = 0; i < lectureSections.length; i++) {
          let currentClass = await getIndividualClass(lectureSections[i]);
          sectionCount += currentClass.length;
        }
        if(course.classSections.length === lectureSections.length){
          if(lectureSections.length === sectionCount){
            setFollowingAll(true);
          }
        }
        if((course.classSections.length - lectureSections.length) === sectionCount){
          setFollowingAll(true);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [courseDepartment, courseInstructor]);

  const toggleFollowAll = async () => {
    if (followingAll) {
      // Deregister all sections
      for (let section of course.classSections) {
        if (section.enrollCode) {
          if (section.section.slice(2, 4) === "00") {
            continue;
          } else {
            await deregisterClass(
                `${lectureSections[parseInt(section.section.slice(0, 2)) - 1]}`,
                `${section.enrollCode}`
            );
          }
        }
      }
    } else {
      // Register all sections
      for (let section of course.classSections) {
        if (section.enrollCode) {
          if (section.section.slice(2, 4) === "00") {
            continue;
          } else {
            await registerClass(
                `${lectureSections[parseInt(section.section.slice(0, 2)) - 1]}`,
                `${section.enrollCode}`
            );
          }
        }
      }
    }
    console.log(await getClasses())
    setFollowingAll(!followingAll); // Toggle the state
  };

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
    marginBottom: 120,
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
});

export default CourseDetailScreen;