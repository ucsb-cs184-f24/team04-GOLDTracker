import React, { useState } from "react";
import { StatusBar, StyleSheet, Text, View, FlatList } from "react-native";
import { SearchBar } from "react-native-elements";
import { API_KEY, API_URL } from "@env";
import Class from "../components/Class";
import { useNavigation } from "@react-navigation/native";

const SearchComponent = ({ search, setSearch }) => {
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();

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

  const handleSearchSubmit = async () => {
    if (search.trim()) {
      try {
        const quarter = "20244";
        let apiUrl;

        if (/^\s*\w+\s*\d+\s*$/.test(search.trim())) {
          apiUrl = `${ API_URL }?quarter=${quarter}&courseId=${encodeURIComponent(
            search
          )}&includeClassSections=true`;
        } else {
          apiUrl = `${ API_URL }?quarter=${quarter}&deptCode=${encodeURIComponent(
            search
          )}&includeClassSections=true`;
        }

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "ucsb-api-key": `${API_KEY}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2));

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
      <View style={styles.searchBarBackground} />

      <SearchBar
        placeholder="Search here, e.g. CMPSC 8 or CMPSC"
        onChangeText={updateSearch}
        value={search}
        lightTheme
        round
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchInputContainer}
        onSubmitEditing={handleSearchSubmit}
        returnKeyType="search"
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
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "white",
    elevation: 5,
    zIndex: 0,
  },
  searchBarContainer: {
    width: "100%",
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    position: "absolute",
    top: 20,
    zIndex: 1,
  },
  searchInputContainer: {
    backgroundColor: "#e0e0e0",
  },
  errorBox: {
    backgroundColor: "#ffe6e6",
    padding: 15,
    borderRadius: 8,
    margin: 10,
    marginTop: 90,
  },
  errorMessage: {
    color: "#d9534f",
    textAlign: "center",
  },
  flatList: {
    marginTop: 80,
  },
});

export default SearchComponent;
