import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
  // Placeholder function for Google OAuth login
  const handleGoogleLogin = () => {
    console.log('Google Login button pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Page</Text>
      <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
        <Text style={styles.buttonText}>Login with Google</Text>
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
