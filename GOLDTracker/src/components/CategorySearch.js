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
  TouchableWithoutFeedback,
} from "react-native";
import { COLORS } from "../theme/theme";
import departmentMapping from "../assets/departmentMapping.json";
import AntDesign from "react-native-vector-icons/AntDesign"; // Added for caret icons

const CategorySearch = forwardRef(
  (
    {
      onDepartmentSelect,
      onQuarterSelect,
      onSearch,
      selectedDept,
      selectedQuarter,
    },
    ref
  ) => {
    const [isDeptDropdownVisible, setIsDeptDropdownVisible] = useState(false);
    const [isQuarterDropdownVisible, setIsQuarterDropdownVisible] =
      useState(false);
    const animatedDeptHeight = useRef(new Animated.Value(0)).current;
    const animatedQuarterHeight = useRef(new Animated.Value(0)).current;

    const departmentOptions = Object.keys(departmentMapping).map((code) => ({
      code,
      label: departmentMapping[code][0],
    }));

    const quarterOptions = [
      { code: "20244", label: "Fall 2024" },
      { code: "20243", label: "Summer 2024" },
      { code: "20242", label: "Spring 2024" },
      { code: "20241", label: "Winter 2024" },
    ];

    const toggleDeptDropdown = () => {
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
        onDepartmentSelect(item.code);
        onSearch(item.code);
        toggleDeptDropdown();
      } else if (type === "quarter") {
        onQuarterSelect(item.code);
        toggleQuarterDropdown();
      }
    };

    const closeDropdowns = () => {
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
        {/* Buttons for Dropdowns */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={toggleDeptDropdown}
          >
            <Text style={styles.toggleButtonText}>
              {selectedDept
                ? `Department: ${selectedDept}`
                : "Select Department"}
            </Text>
            <AntDesign
              name={isDeptDropdownVisible ? "caretup" : "caretdown"}
              size={12}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={toggleQuarterDropdown}
          >
            <Text style={styles.toggleButtonText}>
              {selectedQuarter
                ? `Quarter: ${selectedQuarter}`
                : "Select Quarter"}
            </Text>
            <AntDesign
              name={isQuarterDropdownVisible ? "caretup" : "caretdown"}
              size={12}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Dropdowns */}
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
                            selectedQuarter === item.code &&
                              styles.selectedText,
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
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 18,
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  dropdownOverlay: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  dropdownContainer: {
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
    borderRadius: 8,
    marginHorizontal: 5,
    marginTop: 5,
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
  },
  selectedText: {
    fontWeight: "bold",
    color: COLORS.orange,
  },
});

export default CategorySearch;
