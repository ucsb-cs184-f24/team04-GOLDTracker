import React, { useState, useEffect } from "react";
import {signOut} from "firebase/auth";
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    Button
} from "react-native";
import {auth} from "../../firebaseConfig"
import { Avatar } from "react-native-paper";
import { DevSettings } from 'react-native';

export default function MoreScreen() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
          setUserInfo({
          displayName: user.displayName,
          email: user.email,
          image: user.photoURL,
          });
      } else {
          setUserInfo(null);
      }
      });
      return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  return (
      <View style={styles.container}>
          {userInfo && (
          <View style={styles.userInfoContainer}>
          <Avatar.Image
            source={{ uri: userInfo.image }}
            size={100} // Adjust if needed
            marginBottom = {30}
          />
          <Text>Welcome, {userInfo.displayName}!</Text>
          <Text>Email: {userInfo.email}</Text>
          </View>
      )}
      <Button title="Sign Out" onPress={async () => 
        {
          try {
            await signOut(auth); // Sign out the user
            DevSettings.reload(); // Reload the app after successful sign-out
          } catch (error) {
            console.error("Error signing out: ", error);
          }
        }
      } />
      <StatusBar style="auto" />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,  
    marginBottom: 10,
  },
});