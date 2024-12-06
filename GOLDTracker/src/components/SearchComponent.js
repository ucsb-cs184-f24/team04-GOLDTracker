import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
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
import * as ClassRegister from "./ClassRegister";
import { COLORS } from "../theme/theme";
import departmentMapping from "../assets/departmentList.json";
import AntDesign from "react-native-vector-icons/AntDesign";
import EmptyState from "../components/EmptyState"; // Import EmptyState
import { CollectionReference } from "firebase/firestore";

const SearchComponent = ({ search, setSearch, setIsSearching, major }) => {
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState("20251");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeptDropdownVisible, setIsDeptDropdownVisible] = useState(false);
  const [isQuarterDropdownVisible, setIsQuarterDropdownVisible] =
    useState(false);
  const [shouldShowFollow, setShouldShowFollow] = useState(true);
  const animatedDeptHeight = useRef(new Animated.Value(0)).current;
  const animatedQuarterHeight = useRef(new Animated.Value(0)).current;

  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const API_URL =
    "https://us-central1-goldtracker-beb96.cloudfunctions.net/search";

  // Heights
  const searchBarHeight = 70; // Adjusted to match actual height
  const filterBarHeight = 50; // Adjusted to match actual height
  const totalHeaderHeight = searchBarHeight + filterBarHeight; // 130

  // Interpolation for search bar's animation when scrolling
  const animatedSearchBarTranslate = scrollY.interpolate({
    inputRange: [0, searchBarHeight],
    outputRange: [0, -searchBarHeight],
    extrapolate: "clamp",
  });

  // Interpolation for filter bar's animation when scrolling
  const animatedFilterBarTranslate = scrollY.interpolate({
    inputRange: [0, searchBarHeight],
    outputRange: [0, -searchBarHeight],
    extrapolate: "clamp",
  });

  // Interpolation for FlatList's paddingTop adjustment
  const animatedPaddingTop = scrollY.interpolate({
    inputRange: [0, searchBarHeight],
    outputRange: [totalHeaderHeight, filterBarHeight], // From 130 to 60
    extrapolate: "clamp",
  });

  // Define animatedDropdownTop
  const animatedDropdownTop = scrollY.interpolate({
    inputRange: [0, searchBarHeight],
    outputRange: [searchBarHeight + filterBarHeight, filterBarHeight],
    extrapolate: "clamp",
  });

  const departmentOptions = [
    { code: "Your Major", label: "Cancel Selection" },
    ...Object.keys(departmentMapping).map((code) => ({
      code,
      label: departmentMapping[code],
    })),
  ];

  const quarterOptions = [
    { code: "20251", label: "Winter 2025" },
    { code: "20244", label: "Fall 2024" },
    { code: "20243", label: "Summer 2024" },
    { code: "20242", label: "Spring 2024" },
    { code: "20241", label: "Winter 2024" },
  ];

  const categorySearchRef = useRef(null);

  const updateSearch = (searchText) => {
    setSearch(searchText);
  };

  const toggleFollow = (courseId, sectionId) => {
    setResults((prevResults) =>
      prevResults.map((course) =>
        course.courseId.replace(/\s+/, " ") === courseId
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

  const setFollow = (courseId, sectionId, value) => {
    setResults((prevResults) =>
        prevResults.map((course) =>
            course.courseId.replace(/\s+/, " ") === courseId
                ? {
                  ...course,
                  classSections: course.classSections.map((section) =>
                      section.section === sectionId
                          ? { ...section, following: value }
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
        setSelectedDept(major);
        handleSearchSubmit(major);
      } else {
        setSelectedDept(item.code);
        handleSearchSubmit(item.code);
      }
      toggleDeptDropdown();
    } else if (type === "quarter") {
      setSelectedQuarter(item.code);
      console.log(item.code)
      if(item.code !== "20251"){
        setShouldShowFollow(false);
      }else{
        setShouldShowFollow(true);
      }
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
    setIsSearching(true);
    setIsLoading(true);

    let searchTerm = "";
    if (deptCode) {
      searchTerm = deptCode;
    } else if (!search && major && major !== "") {
      searchTerm = major;
      setIsLoading(true);
    } else {
      searchTerm = search.trim();
    }

    try {
      const quarter = selectedQuarter;

      if (!searchTerm) {
        setErrorMessage("Please enter a search term or select a department.");
        setIsSearching(false); // Stop searching
        return;
      }
      apiUrl = "";
      if (deptCode) {
        apiUrl = /^[A-Z|a-z]{2,}\s[\d(A-Z|a-z]+$/.test(searchTerm)
          ? `${API_URL}?quarter=${quarter}&courseId=${encodeURIComponent(
              searchTerm
            )}&includeClassSections=true`
          : `${API_URL}?quarter=${quarter}&deptCode=${encodeURIComponent(
              searchTerm
            )}&includeClassSections=true&pageNumber=1&pageSize=30`;
      } else {
        apiUrl = /^[A-Z|a-z]{2,}\s[\d(A-Z|a-z]+$/.test(searchTerm)
          ? `${API_URL}?quarter=${quarter}&courseId=${encodeURIComponent(
              searchTerm
            )}&includeClassSections=true`
          : `${API_URL}?quarter=${quarter}&subjectCode=${encodeURIComponent(
              searchTerm
            )}&includeClassSections=true&pageNumber=1&pageSize=30`;
      }
      const headers = new Headers();
      headers.append("authorization", await auth.currentUser.getIdToken());
      const response = await fetch(apiUrl, { headers });

      const data = await response.json();
      const followedCourses = await ClassRegister.getClasses();
      if (data.classes && data.classes.length > 0) {
        const coursesWithFollowing = data.classes.map((course) => {
          let lectureSections = [];
          for (let i = 0; i < course.classSections.length; i++) {
            if (course.classSections[i].section.slice(2, 4) === "00") {
              lectureSections.push(course.classSections[i].enrollCode);
            }
          }
          return {
            ...course,
            classSections: course.classSections.map((section) => {
              let isFollowing = false;
              if (
                followedCourses &&
                typeof followedCourses === "object" &&
                followedCourses.hasOwnProperty(
                  lectureSections[parseInt(section.section.slice(0, 2)) - 1]
                )
              ) {
                if (
                  followedCourses[
                    `${
                      lectureSections[parseInt(section.section.slice(0, 2)) - 1]
                    }`
                  ].indexOf(section.enrollCode) !== -1
                ) {
                  isFollowing = true;
                }
              }
              return {
                ...section,
                following: isFollowing,
              };
            }),
          };
        });
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
    } finally {
      setIsLoading(false);
    }
  };

  const renderCourseItem = ({ item }) => (
    <Class
      course={item}
      toggleFollow={toggleFollow}
      setFollow={setFollow}
      shouldFollow={shouldShowFollow}
      navigation={navigation}
    />
  );

  useEffect(() => {
    if (major && major !== "") {
      handleSearchSubmit(major); // Fetch courses for the major if it's not empty
    }
  }, [major]);

  const handleClearSearch = () => {
    setSearch("");
    setResults([]);
    setErrorMessage("");
    setIsSearching(false); // Stop searching
    if (major && major !== "") {
      handleSearchSubmit(major);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Animated Search Bar */}
      <Animated.View
        style={[
          styles.searchBarContainer,
          { transform: [{ translateY: animatedSearchBarTranslate }] },
        ]}
      >
        {/* Search Bar */}
        <SearchBar
          placeholder="Search by ID or Subject Area"
          onChangeText={updateSearch}
          value={search}
          lightTheme
          round
          containerStyle={styles.searchBar}
          inputContainerStyle={styles.searchInputContainer}
          onSubmitEditing={() => handleSearchSubmit()}
          returnKeyType="search"
          leftIconContainerStyle={styles.leftIconContainer}
          onClear={handleClearSearch}
        />
      </Animated.View>

      {/* Animated Filter Bar */}
      <Animated.View
        style={[
          styles.stickyFilterContainer,
          { transform: [{ translateY: animatedFilterBarTranslate }] },
        ]}
      >
        {/* Filters */}
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
                    quarterOptions
                      .find((q) => q.code === selectedQuarter)
                      ?.label.split(" ")[0][0]
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
      </Animated.View>

      {(isDeptDropdownVisible || isQuarterDropdownVisible) && (
        <TouchableWithoutFeedback onPress={closeDropdowns}>
          <Animated.View style={[styles.overlay, { top: animatedDropdownTop }]}>
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
                />
              </Animated.View>
            )}
          </Animated.View>
        </TouchableWithoutFeedback>
      )}

      {isLoading && (
        <Animated.View
          style={[
            styles.loadingContainer,
            {
              top: Animated.add(totalHeaderHeight, animatedSearchBarTranslate),
            },
          ]}
        >
          <ActivityIndicator size="large" color={COLORS.orange} />
        </Animated.View>
      )}

      {/* Error Message or Results */}
      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      ) : results.length > 0 ? (
        <Animated.View style={{ flex: 1 }}>
          <Animated.FlatList
            data={results}
            keyExtractor={(item) => item.courseId.replace(/\s+/, " ")}
            renderItem={renderCourseItem}
            contentContainerStyle={{ paddingBottom: 140 }}
            style={[styles.flatList, { paddingTop: animatedPaddingTop }]}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          />
        </Animated.View>
      ) : (
        !isLoading && (
          <View style={styles.emptyStateContainer}>
            <EmptyState navigation={navigation} />
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  searchBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    height: 70, // Matches searchBarHeight
  },
  searchBar: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    borderTopWidth: 0,
    marginTop: 10,
    marginHorizontal: 10,
  },
  searchInputContainer: {
    backgroundColor: "#e0e0e0",
  },
  errorBox: {
    backgroundColor: "#ffe6e6",
    padding: 15,
    borderRadius: 8,
    margin: 10,
    marginTop: 130,
  },
  errorMessage: {
    color: "#d9534f",
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 10,
  },
  leftIconContainer: {
    marginLeft: 15,
  },
  buttonRow: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stickyFilterContainer: {
    position: "absolute",
    top: 65, // Matches searchBarHeight
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 1)",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomColor: "#ccc",
    height: 60, // Matches filterBarHeight
  },
  toggleButton: {
    backgroundColor: COLORS.darkBlue,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 8,
    width: "43%",
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
    borderRadius: 5,
    marginHorizontal: 0,
    marginTop: -3,
    width: "100%",
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
    elevation: 5,
  },
  flatList: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 130, // Matches totalHeaderHeight
  },
});

export default SearchComponent;
