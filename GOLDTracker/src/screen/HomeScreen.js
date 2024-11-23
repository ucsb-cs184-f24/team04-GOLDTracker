import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { COLORS, SPACING } from "../theme/theme";
import SearchComponent from "../components/SearchComponent";
import { auth, firestore } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Class from "../components/Class";
import { API_KEY, API_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({ navigation,route }) => {
  const [search, setSearch] = useState("");
  const [major, setMajor] = useState("");
  const [courses, setCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUserMajor = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user is logged in.");
        return;
      }

      try {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setMajor(userData.major || "");
          if (userData.major) {
            fetchCoursesForMajor(userData.major);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserMajor();
  }, []);
    // Refetch user major and courses on screen focus
    useFocusEffect(
      React.useCallback(() => {
        const fetchUserMajor = async () => {
          const user = auth.currentUser;
          if (!user) {
            console.error("No user is logged in.");
            return;
          }
  
          try {
            const userDocRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
  
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setMajor(userData.major || "");
              if (userData.major) {
                fetchCoursesForMajor(userData.major);
              }
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };
  
        fetchUserMajor();
      }, [route.params?.updated]) // Refetch when `updated` parameter changes
    );
  
  const fetchCoursesForMajor = async (major) => {
    const quarter = "20244";
    const apiUrl = `${API_URL}?quarter=${quarter}&deptCode=${encodeURIComponent(
      major
    )}&includeClassSections=true`;
  
    console.log("API URL:", apiUrl); // Debugging log
  
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "ucsb-api-key": API_KEY,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("API Response:", data); // Debugging log
  
      if (data.classes && data.classes.length > 0) {
        setCourses(data.classes);
        setErrorMessage("");
      } else {
        setCourses([]);
        setErrorMessage("No courses found for your major.");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
      setErrorMessage("An error occurred while fetching courses.");
    }
  };
  

  const renderCourseItem = ({ item }) => (
    <Class course={item} toggleFollow={() => {}} navigation={navigation} />
  );

  return (
    <SafeAreaView style={styles.safeArea} testID="safe-area-view">
      <View style={styles.container}>
        <StatusBar style="auto" />

        <View style={styles.searchComponentContainer}>
          <SearchComponent search={search} setSearch={setSearch} />
        </View>

        {major === "" ? (
          // Show prompt to add major if not set
          <View style={styles.centeredTextContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("CustomizedPage")}
            >
              <Text style={styles.addMajorText}>
                Add Your Major to See Your Courses
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Display courses related to the user's major
          <View style={styles.courseListContainer}>
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : (
              <FlatList
                data={courses}
                keyExtractor={(item) => item.courseId.trim()}
                renderItem={renderCourseItem}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </View>
        )}
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
  searchComponentContainer: {
    paddingTop: 0,
  },
  centeredTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  addMajorText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.lightYellow,
    backgroundColor: COLORS.darkBlue,
    padding: 10,
    borderRadius: 8,
  },
  courseListContainer: {
    flex: 1,
    marginTop: SPACING.space_8,
  },
  errorMessage: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: SPACING.space_8,
  },
});

export default HomeScreen;
