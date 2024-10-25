import { Image, View, StyleSheet, StatusBar, SafeAreaView, Text, TouchableOpacity } from "react-native";


export default function LoginScreen({ promptAsync }) {
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/ucsbLOGO.png')}
          style={styles.logo}
        />
      </View>
      <Text style={styles.subtitle}>GoldTracker</Text>
      <TouchableOpacity style={styles.loginButton} onPress={() => promptAsync()}>
        <Text style={styles.loginButtonText}>Log in With Your UCSB Account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  logoContainer: {
    marginTop: 130,
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 180,
  },
  loginButton: {
    backgroundColor: '#1a3a67',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
