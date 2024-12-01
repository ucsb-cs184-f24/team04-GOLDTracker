import React from "react";
import { Image, View, StyleSheet, StatusBar, SafeAreaView, Text, TouchableOpacity } from "react-native";
import {LinearGradient} from "react-native-linear-gradient"; 
import { COLORS } from "../theme/theme";

export default function LoginScreen({ promptAsync }) {
  return (
    <LinearGradient
      colors={['#9ad5e6', '#b4d5de', '#cdeef7']} 
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/login.png')}
            style={styles.logo}
            testID="logo-image"
          />
        </View>
        <View style={styles.subtitleContainer}>
          <Text style={styles.blueText}>Welcome to </Text>
          <Text style={styles.yellowText}>GOLD </Text>
          <Text style={styles.blueText}>Tracker</Text>
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => promptAsync()}
          testID="login-button"
        >
          <Text style={styles.loginButtonText}>Sign in With Your UCSB Account</Text>
        </TouchableOpacity>
      </SafeAreaView>
   </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: 130,
    alignItems: 'center',
    marginBottom: 0,
  },
  logo: {
    width: 330,
    height: 330,
    resizeMode: 'contain',
  },
  subtitleContainer: {
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  blueText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Rowdies-Light',
    color: COLORS.ucsbBlue,
  },
  yellowText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Rowdies-Light',
    color: '#ebb609',
  },
  loginButton: {
    backgroundColor: COLORS.orange,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Rowdies-Light',
  },
});
