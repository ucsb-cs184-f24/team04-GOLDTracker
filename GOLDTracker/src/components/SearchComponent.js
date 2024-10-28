import React, { useState } from "react";
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    FlatList,
} from "react-native";
import { SearchBar } from 'react-native-elements';
import { API_KEY, API_URL } from '@env';

const SearchComponent = () => {
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
                let apiUrl;

                if (/^\s*\w+\s*\d+\s*$/.test(search.trim())) {
                    apiUrl = `${API_URL}?quarter=${quarter}&courseId=${encodeURIComponent(search)}&includeClassSections=true`;
                } else {
                    apiUrl = `${API_URL}?quarter=${quarter}&deptCode=${encodeURIComponent(search)}&includeClassSections=true`;
                }

                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'ucsb-api-key': `${API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                console.log("API Response:", JSON.stringify(data, null, 2));

                if (data.classes && data.classes.length > 0) {
                    setResults(data.classes);
                    setErrorMessage('');
                } else {
                    setResults([]);
                    setErrorMessage('No classes found for the given search term.');
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setResults([]);
                setErrorMessage('An error occurred while fetching data.');
            }
        }
    };

    const renderCourseItem = ({ item }) => {
        return (
            <View style={styles.infoBox}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.detail}>Course ID: {item.courseId.trim()}</Text>
                <Text style={styles.detail}>Department: {item.deptCode}</Text>
                <Text style={styles.detail}>Units: {item.unitsFixed}</Text>
                {item.classSections && item.classSections.length > 0 && (
                    <View style={styles.sectionDetail}>
                        <Text style={styles.detail}>Total Enrolled: {item.classSections[0].enrolledTotal}</Text>
                        <Text style={styles.detail}>Max Enrolled: {item.classSections[0].maxEnroll}</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* White bar behind the search bar */}
            <View style={styles.searchBarBackground} />

            <SearchBar
                placeholder="Search here, e.g. CMPSCI 8 or CMPSC"
                onChangeText={updateSearch}
                value={search}
                lightTheme
                round
                containerStyle={styles.searchBarContainer}
                inputContainerStyle={styles.searchInputContainer}
                onSubmitEditing={handleSearchSubmit}
                returnKeyType="search"
            />
            {errorMessage ? (
                <View style={styles.errorBox}>
                    <Text style={styles.errorMessage}>{errorMessage}</Text>
                </View>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.courseId.trim()}
                    renderItem={renderCourseItem}
                    contentContainerStyle={{ paddingBottom: 20, paddingTop: 100 }}
                />
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
    searchBarBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: 'white',
        elevation: 5,
        zIndex: 0,
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
        marginTop: 10,
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
    sectionDetail: {
        marginTop: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    errorBox: {
        backgroundColor: '#ffe6e6',
        padding: 15,
        borderRadius: 8,
        margin: 10,
        marginTop: 90,
    },
    errorMessage: {
        color: '#d9534f',
        textAlign: 'center',
    },
});

export default SearchComponent;
