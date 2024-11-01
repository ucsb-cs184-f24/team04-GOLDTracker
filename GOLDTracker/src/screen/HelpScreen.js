import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const HelpScreen = () => {
  return (
    <ScrollView style={styles.container}>
        <Text > a. Search Function: {'\n'} You need to use Courses Code shown in GOLD. 
            Courses Code often consists of dept code and course number. Department code has to be capitablized, and there has a space between dept code and course number.</Text>
        <Text > b. Follow Function:
            After finding courses you interested in, simply click follow button to save it in your cart.
            Once, there is a spare space in the course. You could go to Cart page, and click join button to save the course Join Code with corresponding section.
            Then, go to GOLD My Scedule page, and paste the join code to add the course quickly. {'\n'} </Text>
        <Text > c. Customize Your Info: You could set your pass time and major in the More page. Then, we will show your major courses opened in next quarter, remind you when your pass time starts and give you notification when the course has spare spaces. {'\n'} </Text>
        <Text > d. Filter Function: You could rank the major courses based on previous A rate, references provided by NEXUS.{'\n'} </Text>
        <Text > e. Choose Courses with More Info: You could check course description page to get more infomation about a course.{'\n'} </Text>

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

export default HelpScreen;
