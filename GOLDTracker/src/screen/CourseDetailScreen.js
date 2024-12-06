import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { FetchProfessorsByDepartment } from "../components/FetchProfessors";
import { COLORS, SPACING } from "../theme/theme";
import {
  deregisterClass,
  getClasses,
  getIndividualClass,
  registerClass,
} from "../components/ClassRegister";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

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
      <TouchableOpacity
        onPress={() => setShowFullDescription(!showFullDescription)}
      >
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
      
      {/* <View style={styles.divider} /> */}

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
                {/* Rating */}
                {professor && (
                  <>
                    <View style={styles.statContainer}>
                      {(() => {
                        const ratingColor =
                          professor.avgRating > 3 ? "#2e8b57" : "#ff4500";
                        return (
                          <>
                            <MaterialIcons
                              name="star"
                              size={24}
                              color={ratingColor}
                            />
                            <Text
                              style={[styles.rating, { color: ratingColor }]}
                            >
                              {"  "}Rating: {professor.avgRating} / 5
                            </Text>
                          </>
                        );
                      })()}
                    </View>

                    {/* Difficulty */}
                    <View style={styles.statContainer}>
                      {(() => {
                        const difficultyColor =
                          professor.avgDifficulty < 3 ? "#2e8b57" : "#ff4500";
                        return (
                          <>
                            <MaterialIcons
                              name="local-fire-department"
                              size={24}
                              color={difficultyColor}
                            />
                            <Text
                              style={[
                                styles.difficulty,
                                { color: difficultyColor },
                              ]}
                            >
                              {"  "}Difficulty: {professor.avgDifficulty} / 5
                            </Text>
                          </>
                        );
                      })()}
                    </View>

                    {/* Would Take Again */}
                    <View style={styles.statContainer}>
                      {(() => {
                        const takeAgainColor =
                          professor.wouldTakeAgainPercent > 70
                            ? "#2e8b57"
                            : "#ff4500";
                        return (
                          <>
                            <MaterialIcons
                              name="menu-book"
                              size={24}
                              color={takeAgainColor}
                            />
                            <Text
                              style={[
                                styles.takeAgain,
                                { color: takeAgainColor },
                              ]}
                            >
                              {"  "}Would Take Again:{" "}
                              {professor.wouldTakeAgainPercent}%
                            </Text>
                          </>
                        );
                      })()}
                    </View>

                    {/* Number of Ratings */}
                    <View style={styles.statContainer}>
                      <MaterialIcons
                        name="how-to-vote"
                        size={24}
                        color="#555" // or choose a color consistent with your design
                      />
                      <Text style={styles.numRatings}>
                        {"  "}Number of Ratings: {professor.numRatings}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            {/* New Comments Card */}
            <View style={styles.commentsCard}>
              <Text style={styles.commentTitle}>
                <MaterialIcons
                  name="rate-review"
                  size={20}
                  color={COLORS.ucsbBlue}
                />
                {"  "}
                Summarized Comments:
              </Text>
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
    fontFamily: "Nunito-Bold",
  },
  courseTitle: {
    fontSize: 20,
    marginVertical: 2,
    marginBottom: 20,
    color: "#555",
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
    fontFamily: "Nunito-Bold",
    textAlign: "center",
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
    marginBottom: 8,
    fontFamily: "Nunito-Bold",
  },
  professorStats: {
    marginTop: 8,
  },
  statContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rating: {
    fontSize: 17,
    marginVertical: 4,
    fontFamily: "Nunito-Bold",
  },
  difficulty: {
    fontSize: 17,
    marginVertical: 4,
    fontFamily: "Nunito-Bold",
  },
  takeAgain: {
    fontSize: 17,
    marginVertical: 4,
    fontFamily: "Nunito-Bold",
  },
  numRatings: {
    fontSize: 17,
    color: "#555",
    marginVertical: 4,
    fontFamily: "Nunito-Bold",
  },
  commentContainer: {
    marginBottom: 10,
  },
  commentsCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 120,
  },
  commentTitle: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: "Nunito-Bold",
  },
  commentContent: {
    fontSize: 16,
    color: "#555",
    textAlign: "justify",
    lineHeight: 24,
    marginLeft: 0,
    maxWidth: "100%",
    paddingHorizontal: 8,
    fontFamily: "Nunito-Regular",
  },
  readMoreButton: {
    fontSize: 16,
    color: COLORS.darkBlue,
    fontFamily: "Nunito-Bold",
    marginTop: -14,
    marginBottom: 8,
  },
  followAllButton: {
    width: "50%",
    paddingVertical: SPACING.space_8,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "center",
  },
  following: {
    backgroundColor: COLORS.lightBlue,
  },
  notFollowing: {
    backgroundColor: COLORS.darkBlue,
  },
  followAllButtonText: {
    fontSize: 14,
    color: "#fff",
    textShadowColor: "#007BFF",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontFamily: "Nunito-Bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd", 
    marginVertical: 20, 
    alignSelf: "stretch", 
  },
  noProfessorText: {  
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    fontFamily: "Nunito-Regular",
  },
  
});

export default CourseDetailScreen;
