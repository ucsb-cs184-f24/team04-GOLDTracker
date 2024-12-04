import React, { useState, useEffect, useRef } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { COLORS } from "../theme/theme";
import SearchComponent from "../components/SearchComponent";
import { auth, firestore } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [major, setMajor] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchUserMajor = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user is logged in.");
        return;
      }

      try {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setMajor(userData.major || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserMajor();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserMajor = async () => {
        const user = auth.currentUser;
        if (!user) {
          console.error("No user is logged in.");
          return;
        }

        try {
          const userDocRef = doc(firestore, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setMajor(userData.major || "");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserMajor();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar style="auto" />

        <SearchComponent
          search={search}
          setSearch={setSearch}
          setIsSearching={setIsSearching}
          major={major}
        />
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
});

export default HomeScreen;
