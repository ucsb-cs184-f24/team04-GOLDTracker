import React, { useState } from "react";
import { StatusBar, StyleSheet, Text, View, FlatList, TouchableOpacity} from "react-native";
import { SearchBar } from "react-native-elements";
import Class from "../components/Class";
import { useNavigation } from "@react-navigation/native";
import {auth} from "../../firebaseConfig";
import departmentMapping from "../assets/departmentMapping.json";
import RNPickerSelect from "react-native-picker-select";
import { COLORS } from "../theme/theme";

const SearchComponent = ({ search, setSearch }) => {
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDept, setSelectedDept] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const data = departmentMapping;


  const navigation = useNavigation();
  const API_URL = "https://us-central1-goldtracker-beb96.cloudfunctions.net/search"
  

  const deptOptions = Object.keys(departmentMapping).map((dept) => ({
    label: dept,
    value: dept,
  }));


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
    if (search.trim() || selectedDept) {
      try {
        const quarter = "20244";
        let apiUrl;
        console.log("Search:", search);

        if (/^[A-Z]{2,}\s[\dA-Z]+$/.test(search.trim())) {
          apiUrl = `${ API_URL }?quarter=${quarter}&courseId=${encodeURIComponent(
            search
          )}&includeClassSections=true`;
        } else if (selectedDept) {
          apiUrl = `${API_URL}?quarter=20244&deptCode=${encodeURIComponent(
            selectedDept
        )}&includeClassSections=true&pageNumber=1&pageSize=30`;
        } else {
          apiUrl = `${ API_URL }?quarter=${quarter}&deptCode=${encodeURIComponent(
            search
          )}&includeClassSections=true&pageNumber=1&pageSize=30`;
        }
        console.log(apiUrl);
        const headers = new Headers();
        headers.append("authorization", await auth.currentUser.getIdToken());
        const response = await fetch(apiUrl, {headers:headers});

        const data = await response.json();
        // console.log("API Response:", JSON.stringify(data, null, 2));

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
      <StatusBar style="auto" />

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsDropdownVisible((prev) => !prev)}
      >
        <Text style={styles.toggleButtonText}>
          {isDropdownVisible ? "Back to Search" : "Search by Department"}
        </Text>
      </TouchableOpacity>

      {isDropdownVisible ? (
        <View style={styles.dropdownContainer}>
          <RNPickerSelect
            onValueChange={(value) => setSearch(value)} 
            items={deptOptions}
            placeholder={{
              label: "Select a department",
              value: null,
            }}
            style={{
              ...pickerSelectStyles,
            }}
          />

          <TouchableOpacity style={styles.dropdownButton} onPress={handleSearchSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <SearchBar
          placeholder="Search by course or department"
          onChangeText={updateSearch}
          value={search}
          lightTheme
          round
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchInputContainer}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
      )}

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
  searchBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "white",
    elevation: 5,
    zIndex: 0,
  },
  searchBarContainer: {
    width: "95%",
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    borderTopWidth: 0,
    position: "absolute",
    top: 20,
    paddingTop: 15,
    zIndex: 1,
    alignSelf: "center",
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
    zIndex: 0
  },
  toggleButton: {
    marginTop: 5,
    alignSelf: "center",
    backgroundColor: COLORS.darkBlue,
    borderRadius: 8,
    paddingLeft: 20,
    paddingTop: 1,
    paddingBottom: 1,
    paddingRight: 20,
  },
  toggleButtonText: {
    color: "white",
    fontSize: 16,
  },
  dropdownContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: "95%",
      zIndex: 1,
      position: "absolute",
      top: 30, 
  },
  dropdownButton: {
    alignSelf: "center",
    backgroundColor: COLORS.darkBlue,
    borderRadius: 8,
    paddingLeft: 9,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 9,
    marginTop: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    alignSelf: "center",
    height: 45,
    width: 250, 
    marginTop: 5,
  },
});

export default SearchComponent;