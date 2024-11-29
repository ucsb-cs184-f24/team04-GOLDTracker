import React, { useState } from "react";
import { StatusBar, StyleSheet, View, FlatList, Text } from "react-native";
import { SearchBar } from "react-native-elements";
import Class from "../components/Class";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../firebaseConfig";
import { COLORS } from "../theme/theme";
import CategorySearch from "../components/CategorySearch";

const SearchComponent = ({ search, setSearch }) => {
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDept, setSelectedDept] = useState(null); 
  const [selectedQuarter, setSelectedQuarter] = useState("20244"); 

  const navigation = useNavigation();
  const API_URL =
    "https://us-central1-goldtracker-beb96.cloudfunctions.net/search";

  const updateSearch = (searchText) => {
    setSearch(searchText);
  };

  const toggleFollow = (courseId, sectionId) => {
    setResults((prevResults) =>
      prevResults.map((course) =>
        course.courseId.trim() === courseId
          ? {
              ...course,
              classSections: course.classSections.map((section) =>
                section.section === sectionId
                  ? { ...section, following: !section.following }
                  : section
              ),
            }
          : course
      )
    );
  };

  const handleSearchSubmit = async (deptCode = null) => {
    try {
      const quarter = selectedQuarter; 
      const searchTerm = deptCode || search.trim(); // Prioritize deptCode; fallback to text input
      if (!searchTerm) {
        setErrorMessage("Please enter a search term or select a department.");
        return;
      }

      const apiUrl = /^[A-Z]{2,}\s[\dA-Z]+$/.test(searchTerm)
        ? `${API_URL}?quarter=${quarter}&courseId=${encodeURIComponent(
            searchTerm
          )}&includeClassSections=true`
        : `${API_URL}?quarter=${quarter}&deptCode=${encodeURIComponent(
            searchTerm
          )}&includeClassSections=true&pageNumber=1&pageSize=30`;

      const headers = new Headers();
      headers.append("authorization", await auth.currentUser.getIdToken());
      const response = await fetch(apiUrl, { headers });

      const data = await response.json();

      if (data.classes && data.classes.length > 0) {
        const coursesWithFollowing = data.classes.map((course) => ({
          ...course,
          classSections: course.classSections.map((section) => ({
            ...section,
            following: false,
          })),
        }));
        setResults(coursesWithFollowing);
        setErrorMessage("");
      } else {
        setResults([]);
        setErrorMessage("No classes found for the given search term.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
      setErrorMessage("An error occurred while fetching data.");
    }
  };

  const renderCourseItem = ({ item }) => {
    return (
      <Class
        course={item}
        toggleFollow={toggleFollow}
        navigation={navigation}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Search Bar */}
      <SearchBar
        placeholder="Search by course or department"
        onChangeText={updateSearch}
        value={search}
        lightTheme
        round
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchInputContainer}
        onSubmitEditing={() => handleSearchSubmit()} 
        returnKeyType="search"
      />

      {/* Category Search Dropdown */}
      <CategorySearch
        onDepartmentSelect={setSelectedDept} 
        onQuarterSelect={setSelectedQuarter} 
        selectedDept={selectedDept}
        onSearch={handleSearchSubmit}
        selectedQuarter={selectedQuarter}
      />

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.courseId.trim()}
          renderItem={renderCourseItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          style={styles.flatList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  searchBarContainer: {
    width: "95%",
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    borderTopWidth: 0,
    alignSelf: "center",
    marginTop: 10,
  },
  searchInputContainer: {
    backgroundColor: "#e0e0e0",
  },
  errorBox: {
    backgroundColor: "#ffe6e6",
    padding: 15,
    borderRadius: 8,
    margin: 10,
    marginTop: 10,
  },
  errorMessage: {
    color: "#d9534f",
    textAlign: "center",
  },
  flatList: {
    marginTop: 20, // Space between search bar and first course
  },
});

export default SearchComponent;
