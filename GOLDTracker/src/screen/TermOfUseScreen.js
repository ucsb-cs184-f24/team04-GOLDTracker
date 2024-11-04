import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const TermsOfUseScreen = () => {
  return (
    <ScrollView style={styles.container}>
        <Text >Effective as of November 1, 2024 {'\n'}</Text>
        <Text>
        GoldTracker Devloped Team(referenced herein as GoldTracker Team) Acceptable Use Policy rules and 
        guidelines (referenced herein collectively as the “AUP GUIDELINES”) cover and govern each individual end user's 
        (referenced herein with “you” or with “your”) use.
        </Text>
        <Text style ={{fontWeight: "bold",fontSize:15}}>BY USING OUR SERVICE, YOU'RE AGREEING TO USE THE SERVICE IN ACCORDANCE WITH THESE AUP GUIDELINES. 
        PLEASE ALSO NOTE THAT THESE AUP GUIDELINES AND THE PRIVACY POLICY ARE SUBJECT TO CHANGE.
        IF YOU DO NOT AGREE TO BE BOUND BY THESE AUP GUIDELINES OR DISAGREE WITH THE PERSONALLY IDENTIFIABLE INFORMATION COLLECTION AND USE PRACTICES, YOU SHOULD AND MAY NOT ACCESS OR USE THE SERVICE. 
      </Text>
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

export default TermsOfUseScreen;
