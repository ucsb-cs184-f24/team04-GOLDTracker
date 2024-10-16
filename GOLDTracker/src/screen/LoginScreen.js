import React from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as firebase from "firebase/app";

const firebaseConfig = {
  apiKey: 'AIzaSyDJTggfratZmJv1SuEpc4EYHM_20hJ5Vk8',
  authDomain: 'goldtracker-beb96.firebaseapp.com',
  databaseURL: 'https://goldtracker-beb96.firebaseio.com',
  projectId: 'goldtracker-beb96',
  storageBucket: 'goldtracker-beb96.appspot.com',
  messagingSenderId: '756708191969',
  appId: '1:756708191969:ios:7eac66d175a40e3c4c91a0',
};

const app = firebase.initializeApp(firebaseConfig);

const handleGoogleLogin = () => {
  const auth = getAuth(app);

  createUserWithEmailAndPassword(
    auth,
    "janasd.doe@example.com",
    "SuperSecretPassword!"
  )
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};

export default function LoginScreen() {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Page</Text>
      <TouchableOpacity style={styles.button_container} onPress={handleGoogleLogin}>
        <Text style={styles.button_text}>SignUp</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
