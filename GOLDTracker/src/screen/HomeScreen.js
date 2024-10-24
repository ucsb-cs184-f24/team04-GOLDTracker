import React, { useState, useCallback } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    View,
} from "react-native";

import { SearchBar } from 'react-native-elements';
import { API_KEY, API_URL } from '@env';

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"; //navigation
import Entypo from "@expo/vector-icons/Entypo"; //icon
import { Colors } from "react-native/Libraries/NewAppScreen"; //color
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from "../theme/theme"; //local color list


const HomeScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const updateSearch = (searchText) => {
        setSearch(searchText);
    };

 
    const handleSearchSubmit = async () => {
        if (search.trim()) {
            try {
                const quarter = '20244';
                const response = await fetch(`${API_URL}?quarter=${quarter}&courseId=${encodeURIComponent(search)}&includeClassSections=true`, {
                    method: 'GET',
                    headers: {
                        'ucsb-api-key': `${API_KEY}`, 
                        'Content-Type': 'application/json', 
                    },
                });
                console.log("API send:", response);
                const data = await response.json();

                console.log("API Response:", JSON.stringify(data, null, 2));


                if (data.classes && data.classes.length > 0) {
                    setResults(data.classes);
                    setErrorMessage('');
                } else {
                    setResults([]);
                    setErrorMessage('No classes found for the given course ID.'); 
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setResults([]);
                setErrorMessage('An error occurred while fetching data.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <SearchBar
                placeholder="Search here, e.g. CMPSCI 8"
                onChangeText={updateSearch}
                value={search}
                lightTheme
                round
                containerStyle={styles.searchBarContainer}
                inputContainerStyle={styles.searchInputContainer}
                onSubmitEditing={handleSearchSubmit}
                returnKeyType="search"
            />
            {errorMessage ? ( // Display error message if there is one
                <View style={styles.errorBox}>
                    <Text style={styles.errorMessage}>{errorMessage}</Text>
                </View>
            ) : (
                results.length > 0 && (
                    <View style={styles.infoBox}>
                        <Text style={styles.title}>{results[0].title}</Text>
                        <Text style={styles.detail}>Course ID: {results[0].courseId.trim()}</Text>
                        <Text style={styles.detail}>Department: {results[0].deptCode}</Text>
                        <Text style={styles.detail}>Units: {results[0].unitsFixed}</Text>
                        <View style={styles.sectionDetail}>
                            <Text style={styles.detail}>Total Enrolled: {results[0].classSections[0].enrolledTotal}</Text>
                            <Text style={styles.detail}>Max Enrolled: {results[0].classSections[0].maxEnroll}</Text>
                        </View>
                    </View>
                )
            )}
            <StatusBar style="auto" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchBarContainer: {
        width: '100%', 
        backgroundColor: 'transparent', 
        borderBottomWidth: 0, 
        position: 'absolute', 
        top: 20, 
        zIndex: 1,
    },
    searchInputContainer: {
        backgroundColor: '#e0e0e0',
    },
    infoBox: {
        backgroundColor: '#f0f8ff',
        padding: 15,
        borderRadius: 8,
        margin: 10,
        marginTop: 90,
        elevation: 2, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    detail: {
        fontSize: 14,
        marginVertical: 2,
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    errorBox: {
        backgroundColor: '#ffe6e6', // Light red background
        padding: 15,
        borderRadius: 8,
        margin: 10,
        marginTop: 90,
    },
    errorMessage: {
        color: '#d9534f', // Red text color
        textAlign: 'center',
    },
});

export default HomeScreen;
