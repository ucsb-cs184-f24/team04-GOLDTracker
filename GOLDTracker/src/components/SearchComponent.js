import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, } from "react";
import { 
  StatusBar, 
  StyleSheet, 
  View, 
  FlatList, 
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Easing,
  TouchableWithoutFeedback,
 } from "react-native";
import { SearchBar } from "react-native-elements";
import Class from "../components/Class";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../firebaseConfig";
import { COLORS } from "../theme/theme";
import departmentMapping from "../assets/departmentMapping.json";
import AntDesign from "react-native-vector-icons/AntDesign";


const SearchComponent = ({ search, setSearch, setIsSearching, major }) => {
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState("20244");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeptDropdownVisible, setIsDeptDropdownVisible] = useState(false);
  const [isQuarterDropdownVisible, setIsQuarterDropdownVisible] =
    useState(false);
  const animatedDeptHeight = useRef(new Animated.Value(0)).current;
  const animatedQuarterHeight = useRef(new Animated.Value(0)).current;

  const departmentOptions = [
    { code: "Your Major", label: "Cancel Selection" }, // Add "My Major" option
    ...Object.keys(departmentMapping).map((code) => ({
      code,
      label: departmentMapping[code][0],
    })),
  ];

  const quarterOptions = [
    { code: "20244", label: "Fall 2024" },
    { code: "20243", label: "Summer 2024" },
    { code: "20242", label: "Spring 2024" },
    { code: "20241", label: "Winter 2024" },
  ];

  const categorySearchRef = useRef(null);
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
  const toggleDeptDropdown = () => {
    if (!isDeptDropdownVisible) {
      setIsSearching(true);
    } else if (!isQuarterDropdownVisible) {
      setIsSearching(false);
    }
    setIsDeptDropdownVisible((prev) => !prev);
    if (!isDeptDropdownVisible) {
      setIsQuarterDropdownVisible(false);
      Animated.timing(animatedQuarterHeight, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
      }).start();
    }
    Animated.timing(animatedDeptHeight, {
      toValue: isDeptDropdownVisible ? 0 : 300,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const toggleQuarterDropdown = () => {
    if (!isQuarterDropdownVisible) {
      setIsSearching(true);
    } else if (!isDeptDropdownVisible) {
      setIsSearching(false);
    }
    setIsQuarterDropdownVisible((prev) => !prev);
    if (!isQuarterDropdownVisible) {
      setIsDeptDropdownVisible(false);
      Animated.timing(animatedDeptHeight, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
      }).start();
    }
    Animated.timing(animatedQuarterHeight, {
      toValue: isQuarterDropdownVisible ? 0 : 300,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const handleSelect = (type, item) => {
    if (type === "department") {
      if (item.code === "Your Major") {
        setSelectedDept(major); // Set to the user's major
        handleSearchSubmit(major); // Trigger search with major
      } else {
        setSelectedDept(item.code);
        handleSearchSubmit(item.code);
      }
      toggleDeptDropdown();
    } else if (type === "quarter") {
      setSelectedQuarter(item.code);
      toggleQuarterDropdown();
    }
  };

  const closeDropdowns = () => {
    if (isDeptDropdownVisible || isQuarterDropdownVisible) {
      setIsSearching(false);
    }
    if (isDeptDropdownVisible) {
      setIsDeptDropdownVisible(false);
      Animated.timing(animatedDeptHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    if (isQuarterDropdownVisible) {
      setIsQuarterDropdownVisible(false);
      Animated.timing(animatedQuarterHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  useImperativeHandle(categorySearchRef, () => ({
    closeDropdowns,
  }));

  const handleSearchSubmit = async (deptCode = null) => {
    if (major && major !== "") {
      searchTerm = major;
      setIsLoading(true);
    }  
      
    try {
      const quarter = selectedQuarter; 
      const searchTerm = deptCode || search.trim(); // Prioritize deptCode; fallback to text input
      // If major is not an empty string, use the major as deptCode


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
    }finally {
      setIsLoading(false);
    }
  };

  const renderCourseItem = ({ item }) => (
    <Class
      course={item}
      toggleFollow={toggleFollow}
      navigation={navigation}
    />
  );

  useEffect(() => {
    if (major && major !== "") {
      handleSearchSubmit(major); // Fetch courses for the major if it's not empty
    }
  }, [major]);

  const handleClearSearch = () => {
    setSearch(""); // Clear the search input
    setResults([]); // Reset the search results
    setErrorMessage(""); // Reset the error message
    setIsSearching(false); // Stop the searching state

    if (major && major !== "") {
      handleSearchSubmit(major);
    }
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
        onFocus={() => setIsSearching(true)} // Set isSearching to true when focused
        onBlur={() => {
          if (search.trim() === "") {
            setIsSearching(false);
          }
        }} 
        leftIconContainerStyle={styles.leftIconContainer}
        onClear={handleClearSearch}
      />

      {/*filters */}
      <View style={styles.buttonRow}>
      <TouchableOpacity
            style={[styles.toggleButton, styles.centeredButton]}
            onPress={toggleDeptDropdown}
      >
      <Text style={styles.toggleButtonText}>
        {selectedDept || "Department"}
            </Text>
            <AntDesign
              name={isDeptDropdownVisible ? "caretup" : "caretdown"}
              size={12}
              color="#fff"
              style={styles.shadowIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleButton, styles.centeredButton]}
            onPress={toggleQuarterDropdown}
          >
            <Text style={styles.toggleButtonText}>
              {selectedQuarter
              ? `${selectedQuarter.slice(0, 4)} ${
                  quarterOptions.find((q) => q.code === selectedQuarter)?.label[0]
                }`
              : "Select Quarter"}
            </Text>
            <AntDesign
              name={isQuarterDropdownVisible ? "caretup" : "caretdown"}
              size={12}
              color="#fff"
              style={styles.shadowIcon}
            />
          </TouchableOpacity>
        </View>

        {(isDeptDropdownVisible || isQuarterDropdownVisible) && (
          <TouchableWithoutFeedback onPress={closeDropdowns}>
            <View style={styles.overlay}>
              {isDeptDropdownVisible && (
                <Animated.View
                  style={[
                    styles.dropdownContainer,
                    { height: animatedDeptHeight },
                  ]}
                >
                  <FlatList
                    data={departmentOptions}
                    keyExtractor={(item) => item.code}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.dropdownOption}
                        onPress={() => handleSelect("department", item)}
                      >
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            selectedDept === item.code && styles.selectedText,
                          ]}
                        >
                          {item.label} ({item.code})
                        </Text>
                      </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                  />
                </Animated.View>
              )}

              {isQuarterDropdownVisible && (
                <Animated.View
                  style={[
                    styles.dropdownContainer,
                    { height: animatedQuarterHeight },
                  ]}
                >
                  <FlatList
                    data={quarterOptions}
                    keyExtractor={(item) => item.code}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.dropdownOption}
                        onPress={() => handleSelect("quarter", item)}
                      >
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            selectedQuarter === item.code && styles.selectedText,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                  />
                </Animated.View>
              )}
            </View>
          </TouchableWithoutFeedback>
        )}

      {isLoading ? (
        <ActivityIndicator size={25} color="#0000ff" />
      ) : null}

      {/* Error Message or Results */}
      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      ) : results.length > 0 ? (
        <View style={styles.listContainer}>
          <FlatList
            data={results}
            keyExtractor={(item) => item.courseId.trim()}
            renderItem={renderCourseItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            onScroll={() => {
              if (categorySearchRef.current) {
                categorySearchRef.current.closeDropdowns();
              }
            }}
            style={styles.flatList}
          />
        </View>
      ) : null}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex:1,
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
  overlay: {
    position: "absolute",
    top: 130,  // Start at the top of the screen/container
    left: 0,  // Align with the left side of the screen
    right: 0,  // Align with the right side of the screen
    bottom: 0,  // Cover everything below the header (up to the course list)
    backgroundColor: "rgba(0, 0, 0, 0.3)",  // Semi-transparent grey overlay
    zIndex: 1,  // Ensure it is above the course list and other elements
  },
  flatList: {
    marginTop: 20, // Space between search bar and first course
  },
  leftIconContainer: {
    marginLeft: 15, // Adjust the value to move the icon further to the right
  },
  buttonRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toggleButton: {
    backgroundColor: COLORS.darkBlue,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 18,
    width: "40%",
  },
  centeredButton: {
    justifyContent: "center",
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    paddingRight: 5,
    fontFamily: "Nunito-Regular", 
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    overflow: "hidden",
    borderRadius: 5, // Outer curve for the border
    marginHorizontal: 5,
    marginTop: 10,
    borderBottomWidth: 8, 
    borderBottomColor: COLORS.orange, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 6, 
    elevation: 5,
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dropdownOptionText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Nunito-Regular", 
  },
  selectedText: {
    fontWeight: "bold",
    color: COLORS.orange,
    fontFamily: "Nunito-Regular", 
  },
  shadowIcon: {
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5, // Shadow for Android
  },
});

export default SearchComponent;
