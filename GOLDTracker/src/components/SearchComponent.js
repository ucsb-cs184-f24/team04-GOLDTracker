import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
} from "react";
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
import EmptyState from "../components/EmptyState"; // Import EmptyState

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const SearchComponent = ({
  search,
  setSearch,
  setIsSearching,
  major,
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;

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

  // Total height of the search bar and filter section
  const totalHeaderHeight = 120;

  // Interpolation for search bar's animation when scrolling
  const animatedSearchBarTranslate = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -600],
    extrapolate: "clamp",
  });

  // Interpolation for filter section's sticky behavior
  const animatedFilterTranslate = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, -60],
    extrapolate: "clamp",
  });

  // Interpolation for the FlatList to move up with the search bar
  const animatedListTranslate = scrollY.interpolate({
    inputRange: [0, totalHeaderHeight],
    outputRange: [0, -totalHeaderHeight],
    extrapolate: "clamp",
  });

  const departmentOptions = [
    { code: "Your Major", label: "Cancel Selection" },
    ...Object.keys(departmentMapping).map((code) => ({
      code,
      label: departmentMapping[code][0],
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
        setSelectedDept(major);
        handleSearchSubmit(major);
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
    setIsSearching(true); // Start searching
    setIsLoading(true);

    try {
      const quarter = selectedQuarter;
      const searchTerm = deptCode || search.trim();

      if (!searchTerm) {
        setErrorMessage(
          "Please enter a search term or select a department."
        );
        setIsSearching(false); // Stop searching
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
    } finally {
      setIsLoading(false);
      // Keep isSearching true if there are results or an error message
      setIsSearching(!(results.length === 0 && !errorMessage));
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
      handleSearchSubmit(major);
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
          placeholder="Search by course or department"
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

      {/* Sticky Filter Section */}
      <Animated.View
        style={[
          styles.stickyFilterContainer,
          { transform: [{ translateY: animatedFilterTranslate }] },
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
      </Animated.View>

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
          </View>
        </TouchableWithoutFeedback>
      )}

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {/* Error Message */}
      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      ) : results.length > 0 ? (
        // Results List
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateY: animatedListTranslate }],
          }}
        >
          <AnimatedFlatList
            data={results}
            keyExtractor={(item) => item.courseId.trim()}
            renderItem={renderCourseItem}
            contentContainerStyle={{
              paddingBottom: 20,
              paddingTop: totalHeaderHeight,
            }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            style={styles.flatList}
          />
        </Animated.View>
      ) : (
        // Empty State
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
  },
  searchBar: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    borderTopWidth: 0,
    marginTop: 10,
    marginHorizontal: 20,
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
    top: 120,
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
    top: 60,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 1)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomColor: "#ccc",
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
    borderRadius: 5,
    marginHorizontal: 0,
    marginTop: -3,
    width: "100%",
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
    elevation: 5,
  },
  list: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 120,
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
    paddingTop: 120,
  },
});

export default SearchComponent;
