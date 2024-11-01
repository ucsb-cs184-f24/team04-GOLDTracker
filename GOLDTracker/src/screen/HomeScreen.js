import React, { useState } from "react";
import { View, SafeAreaView, StatusBar, StyleSheet, Text } from "react-native";
import { COLORS, SPACING } from "../theme/theme";
import SearchComponent from "../components/SearchComponent";

const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar style="auto" />

        <View style={styles.searchComponentContainer}>
          <SearchComponent search={search} setSearch={setSearch} />
        </View>

        {/* Show text only if search is empty */}
        {search === "" && (
          <View style={styles.centeredTextContainer}>
            <Text style={styles.homeDescription}>
              Search to View More Courses
            </Text>
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
    flex: 1,
    paddingTop: SPACING.space_8,
  },
  centeredTextContainer: {
    flex: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.space_8,
  },
  homeDescription: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.lightYellow,
    backgroundColor: COLORS.darkBlue,
    padding: 10,
    borderRadius: 8,
  },
});

export default HomeScreen;
