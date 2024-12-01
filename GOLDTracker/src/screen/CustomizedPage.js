import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebaseConfig';
import departmentMapping from '../assets/departmentMapping.json';

const CustomizedPage = ({ navigation, route }) => {
  const [major, setMajor] = useState('');
  const [classTimes, setClassTimes] = useState({
    pass1: new Date(),
    pass2: new Date(),
    pass3: new Date(),
  });
  const [showTimePicker, setShowTimePicker] = useState({ show: false, key: null });
  const [isEditable, setIsEditable] = useState(route.params?.isEditable || false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'No user is logged in.');
      return;
    }

    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setMajor(userData.major || '');
        setClassTimes({
          pass1: userData['pass time']?.pass1
            ? new Date(userData['pass time'].pass1)
            : new Date(),
          pass2: userData['pass time']?.pass2
            ? new Date(userData['pass time'].pass2)
            : new Date(),
          pass3: userData['pass time']?.pass3
            ? new Date(userData['pass time'].pass3)
            : new Date(),
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const saveUserData = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'No user is logged in.');
      return;
    }
  
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          major, // Save the label of the major
          'pass time': {
            pass1: classTimes.pass1.toISOString(),
            pass2: classTimes.pass2.toISOString(),
            pass3: classTimes.pass3.toISOString(),
          },
        },
        { merge: true }
      );
      navigation.navigate('HomeScreen', { updated: true });
    } catch (error) {
      Alert.alert('Error', `Failed to save data: ${error.message}`);
    }
  };
  

  const departmentOptions = Object.keys(departmentMapping).map((code) => ({
    code,
    label: departmentMapping[code][0],
  }));

  const handleSubmit = () => {
    if (!major) {
      Alert.alert('Error', 'Please select a major before submitting.');
      return;
    }
    // Confirmation alert before saving data
    Alert.alert(
      'Confirm Submission',
      'Are you sure you want to save these changes?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            saveUserData(major, classTimes);
            navigation.goBack(); // Navigate back to the previous screen
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Major</Text>
      <View style={styles.pickerContainer}>
        {!isEditable ? (
          <TouchableOpacity style={styles.majorButton}>
            <Text style={styles.majorText}>{major || 'No major selected'}</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.majorButton}
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <View style={styles.rowContainer}>
                <Text style={styles.majorText}>{major || 'Select a Major'}</Text>
                <Text style={styles.dropdownIcon}>{showDropdown ? '▲' : '▼'}</Text>
              </View>
            </TouchableOpacity>
            {showDropdown && (
              <FlatList
                data={departmentOptions}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownOption}
                    onPress={() => {
                      setMajor(item.code);
                      setShowDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>
                      {item.label} ({item.code})
                    </Text>
                  </TouchableOpacity>
                )}
                style ={styles.flatlistContiner}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
              />
            )}
          </>
        )}
      </View>

      {['pass1', 'pass2', 'pass3'].map((pass, index) => (
        <View key={index} style={styles.passContainer}>
          <Text style={styles.label}>{`Pass ${index + 1}`}</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => isEditable && setShowTimePicker({ show: true, key: pass })}
          >
            <Text style={styles.timeText}>
              {classTimes[pass].toLocaleDateString()} {classTimes[pass].toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
          {showTimePicker.show && showTimePicker.key === pass && (
            <DateTimePicker
              value={classTimes[pass]}
              mode="datetime"
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setClassTimes((prev) => ({ ...prev, [pass]: selectedDate }));
                }
                setShowTimePicker({ show: false, key: null });
              }}
            />
          )}
        </View>
      ))}

      <View style={styles.buttonContainer}>
        {!isEditable ? (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditable(true)}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Save</Text>
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
    marginBottom: 16,
  },
  majorText: {
    fontSize: 16,
    color: '#333',
  },
  passContainer: {
    marginBottom: 16,
  },
  majorButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 16,
    marginBottom: 8,
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownIcon: {
    fontSize: 15,
    color: '#333',
  },
  dropdownOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  dropdownOptionText: {
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
  flatlistContiner: {
    marginBottom:230,
  }
});

export default CustomizedPage;
