import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SignInScreen from '../components/GoogleSignIn'; 
import SecondScreen from '../components/SecondPage'; 

export default function App() {
  const [showWelcomePage, setShowWelcomePage] = useState(true);  // Manage the current screen

  // Function to switch to the "Welcome Page"
  const goToWelcomePage = () => {
    setShowWelcomePage(true);
  };

  const goToSignInPage = () => {
    setShowWelcomePage(false);
  };
  
  const CustomButton = ({ title, onPress }) => {
    return (
      <TouchableOpacity style={styles.customButton} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
  };

  // If the user is on the "Sign In Page"
  if (!showWelcomePage) {
    return (
      <View style={styles.container}>
        <SignInScreen />
        <CustomButton title="Welcome Page" onPress={goToWelcomePage} />
      </View>
    );
  }

  // If the user is on the "Welcome Page"
  return (
    <View style={styles.container}>
      <SecondScreen />
      <CustomButton title="Sign In Page" onPress={goToSignInPage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    backgroundColor: '#aaf347', 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    elevation: 3, 
    shadowColor: '#000',  
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff', 
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});