import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback, ScrollView,
} from "react-native";
import { COLORS } from "../theme/theme";
import departmentMapping from "../assets/departmentList.json";
import AntDesign from "react-native-vector-icons/AntDesign";


const CategorySearch = forwardRef(
  (
    {
      onDepartmentSelect,
      onQuarterSelect,
      onSearch,
      selectedDept,
      selectedQuarter,
      setIsSearching,
      major,
    },
    ref
  ) => {
    const [isDeptDropdownVisible, setIsDeptDropdownVisible] = useState(false);
    const [isQuarterDropdownVisible, setIsQuarterDropdownVisible] =
      useState(false);
    const animatedDeptHeight = useRef(new Animated.Value(0)).current;
    const animatedQuarterHeight = useRef(new Animated.Value(0)).current;

    const departmentOptions = [
      { code: "Your Major", label: "Cancel Selection" }, // Add "My Major" option
      ...Object.keys(departmentMapping).map((code) => ({
        code,
        label: departmentMapping[code],
      })),
    ];

    const quarterOptions = [
      {code: "20251", label: "Winter 2025"},
      { code: "20244", label: "Fall 2024" },
      { code: "20243", label: "Summer 2024" },
      { code: "20242", label: "Spring 2024" },
      { code: "20241", label: "Winter 2024" },
    ];

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
          onDepartmentSelect(major); // Set to the user's major
          onSearch(major); // Trigger search with major
        } else {
          onDepartmentSelect(item.code);
          onSearch(item.code);
        }
        toggleDeptDropdown();
      } else if (type === "quarter") {
        onQuarterSelect(item.code);
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

    useImperativeHandle(ref, () => ({
      closeDropdowns,
    }));

    return (
      <View style={styles.container}>
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
            <View style={styles.dropdownOverlay}>
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
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
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
  dropdownOverlay: {
    flex: 1,
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    overflow: "hidden",
    borderRadius: 5, // Outer curve for the border
    marginHorizontal: 5,
    marginTop: 5,
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

export default CategorySearch;
