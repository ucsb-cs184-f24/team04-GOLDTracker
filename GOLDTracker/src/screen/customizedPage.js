import React, { useState } from 'react';
import { View, Text, Button, Alert, TextInput, StyleSheet } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const customizedPage = () => {
  const [selectedMajor, setSelectedMajor] = useState('');
  const majors = ['Computer Science', 'Engineering', 'Mathematics', 'Biology']; // List of majors
  const [pastTime, setPastTime] = useState(new Date());
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDateTimePicker(false);
    if (selectedDate) {
      setPastTime(selectedDate); // Update the selected time
    }
  };

  const handleSubmit = () => {
    const currentTime = new Date();
    if (selectedMajor && pastTime) {
      Alert.alert(
        'Information Submitted',
        `Major: ${selectedMajor}\nPastime: ${pastTime.toLocaleString()}\nTime: ${currentTime.toLocaleString()}`
      );
    } else {
      Alert.alert('Error', 'Please select both major and pastime.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Select your major:</Text>
      <Picker
        selectedValue={selectedMajor}
        onValueChange={(itemValue) => setSelectedMajor(itemValue)}
      >
        {majors.map((major, index) => (
          <Picker.Item key={index} label={major} value={major} />
        ))}
      </Picker>

      <Text>Select your pastime time:</Text>
      <Button title="Pick a time and date" onPress={() => setShowDateTimePicker(true)} />

      {showDateTimePicker && (
        <DateTimePicker
          value={pastTime}
          mode="datetime"  // You can set to "date", "time", or "datetime"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
});

export default customizedPage;
