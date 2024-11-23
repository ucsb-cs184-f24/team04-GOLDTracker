import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import categories from '../assets/categories';

const CustomizedPage = () => {
  const [major, setMajor] = useState(''); // Selected major
  const [classTime, setClassTime] = useState(new Date()); // Selected date and time
  const [showTimePicker, setShowTimePicker] = useState(false); // DateTimePicker visibility
  const [isEditable, setIsEditable] = useState(false); // Edit mode state

  const handleTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || classTime;
    setShowTimePicker(false);
    setClassTime(currentDate);
  };

  const handleEdit = () => {
    setIsEditable(true); // Enable editing
  };

  const handleSubmit = () => {
    if (!major) {
      Alert.alert('Error', 'Please select a major before submitting.');
      return;
    }
    setIsEditable(false); // Lock editing after submission
    Alert.alert('Saved!', 'Your major and class time have been updated.');
  };

  return (
    <View style={styles.container}>
      {/* Major Section */}
      <Text style={styles.label}>Major</Text>
      <View style={styles.pickerContainer}>
        {!isEditable ? (
          // Display major as plain text when not editable
          <Text style={styles.majorText}>{major || 'No major selected'}</Text>
        ) : (
          // Display major as a picker when editable
          <Picker
            selectedValue={major}
            onValueChange={(itemValue) => setMajor(itemValue)}
          >
            <Picker.Item label="Select a major" value="" />
            {(categories || []).map((category, index) => (
              <Picker.Item key={index} label={category.label} value={category.value} />
            ))}
          </Picker>
        )}
      </View>

      {/* Class Time Section */}
      <Text style={styles.label}>Class Date and Time</Text>
      <TouchableOpacity
        style={[styles.timeButton, !isEditable && styles.disabledButton]}
        onPress={() => isEditable && setShowTimePicker(true)} // Open picker only if editable
      >
        <Text style={styles.timeText}>
          {classTime.toLocaleDateString()} {classTime.toLocaleTimeString()}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={classTime}
          mode="datetime"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* Edit and Submit Buttons */}
      <View style={styles.buttonContainer}>
        {!isEditable ? (
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
    padding: 8,
  },
  majorText: {
    fontSize: 16,
    color: '#333',
  },
  timeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#ffa500',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#008000',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default CustomizedPage;
