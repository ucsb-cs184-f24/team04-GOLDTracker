import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import categories from '../assets/categories';

const CustomizedPage = () => {
  const [major, setMajor] = useState(''); // Selected major
  const [classTimes, setClassTimes] = useState({
    pass1: new Date(),
    pass2: new Date(),
    pass3: new Date(),
  }); // Selected dates and times
  const [showTimePicker, setShowTimePicker] = useState(false); 
  const [isEditable, setIsEditable] = useState(false); // Edit mode state

  //TO DO: need to edit,make better UX
  const handleTimeChange = (event, selectedDate) => {
    if (selectedDate) {
      setClassTimes((prev) => ({
        ...prev,
        [showTimePicker.key]: selectedDate, // Update specific pass
      }));
    }
    setShowTimePicker({ show: false, key: null }); // Close picker
  };

  const handleEdit = () => {
    setIsEditable(true); // Enable editing
  };

  const handleSubmit = () => {
    if (!major) {
      Alert.alert('Error', 'Please select a major before submitting.');
      return;
    }
    setIsEditable(false); // Lock editing for the major only
    Alert.alert('Saved!', 'Your major and class times have been updated.');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Major Section */}
        <Text style={styles.label}>Major</Text>
        <View style={styles.pickerContainer}>
          {!isEditable ? (
            <Text style={styles.majorText}>{major || 'No major selected'}</Text>
          ) : (
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
        {['pass1', 'pass2', 'pass3'].map((pass, index) => (
        <View key={index} style={styles.passContainer}>
          <Text style={styles.label}>{`Pass ${index + 1}`}</Text>
          {!isEditable ? (
            // Show the selected time when not in edit mode
            <TouchableOpacity style={styles.timeButton}>
              <Text style={styles.timeText}>
                {classTimes[pass].toLocaleDateString()} {classTimes[pass].toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
          ) : (
            // Show the DateTimePicker in edit mode
            <>
            <TouchableOpacity
              style={[styles.timeButton, !isEditable && styles.disabledButton]}
              onPress={() => setShowTimePicker({ show: true, key: pass })}
            >
          <Text style={styles.timeText}>
            {classTimes[pass].toLocaleDateString()} {classTimes[pass].toLocaleTimeString()}
          </Text>
        </TouchableOpacity>
        {/* Render DateTimePicker only for the selected pass */}
        {showTimePicker.show && showTimePicker.key === pass && (
          <DateTimePicker
            value={classTimes[pass]}
            mode="datetime"
            display="default"
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setClassTimes((prev) => ({
                  ...prev,
                  [pass]: selectedDate,
                }));
              }
              setShowTimePicker({ show: false, key: null });
            }}
          />
        )}
      </>
    )}
  </View>
))}


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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
  passContainer: {
    marginBottom: 16,
  },
  timeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
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
