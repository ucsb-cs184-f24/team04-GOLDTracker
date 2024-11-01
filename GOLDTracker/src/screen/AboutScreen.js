import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const AboutScreen = () => {
  return (
    <ScrollView style={styles.container}>
       <Text></Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
});

export default AboutScreen;
