import React, { useState, useEffect, useRef } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  FlatList,
} from "react-native";
import { COLORS, SPACING } from "../theme/theme";
import SearchComponent from "../components/SearchComponent";
import { auth, firestore } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Class from "../components/Class";
import { useFocusEffect } from "@react-navigation/native";
import { API_KEY, API_URL } from "@env";
import EmptyState from "../components/EmptyState";

const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [major, setMajor] = useState("");
  const [courses, setCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const resetStateRef = useRef(() => {});

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
    }, [])
  );

  const resetState = () => {
    setSearch("");
    setMajor("");
    setCourses([]);
    setErrorMessage("");
    setIsSearching(false);
  };

  useEffect(() => {
    resetStateRef.current = resetState; // Assign the reset function to ref
  }, [resetState]);

  const fetchCoursesForMajor = async (major) => {
    const quarter = "20244";
    const apiUrl = `${API_URL}?quarter=${quarter}&deptCode=${encodeURIComponent(
      major
    )}&includeClassSections=true`;

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar style="auto" />

        <SearchComponent
          search={search}
          setSearch={setSearch}
          setIsSearching={setIsSearching}
        />

        {!isSearching && major === "" ? (
          <EmptyState navigation={navigation} />
        ) : major !== "" ? (
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
        ) : null}
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
