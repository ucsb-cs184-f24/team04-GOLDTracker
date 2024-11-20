import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Header = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.separator} />
      <Image 
        source={require('../assets/ucsbLOGO.png')}
        style={styles.image}
      />
      <Text style={styles.title}>GoldTracker</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
      height: 130,
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 20,
      backgroundColor: '#fff',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5, // Android shadow
  },
  image: {
    width: 70, // Adjust icon size if needed
    height: 60,
    marginRight: 10,
    marginTop:5,
  },
  title: {
    marginTop:5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    position: 'absolute',
    bottom: 0, 
    height: 1, 
    width: '100%',
    backgroundColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
},
});

export default Header;