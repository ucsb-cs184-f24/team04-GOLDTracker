import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { COLORS } from "../theme/theme";

const EmptyState = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/sad.png")}
        style={styles.cryImage}
      />
      <Text style={styles.descriptionText}>
        You did not set your major or pass time!{"\n"}
        Search for a course above or {"\n"} view courses by editing your major.
      </Text>
      <TouchableOpacity
        style={styles.editMajorButton}
        onPress={() => navigation.navigate("CustomizedPage", { isEditable: true })}
      >
        <Text style={styles.editMajorButtonText}>Edit Major</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 20,
    flex: 1,
    // borderWidth: 1,
  },
  cryImage: {
    width: 250,
    height: 250,
  },
  descriptionText: {
    fontSize: 16,
    color: COLORS.darkBlue,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Nunito-Bold",
  },
  editMajorButton: {
    backgroundColor: COLORS.darkBlue,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  editMajorButtonText: {
    color: COLORS.lightYellow,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EmptyState;
