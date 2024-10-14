import React, { useState, useCallback } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    View,
    ToastAndroid,
} from "react-native";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"; //navigation
import Entypo from "@expo/vector-icons/Entypo"; //icon
import { Colors } from "react-native/Libraries/NewAppScreen"; //color
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from "../theme/theme"; //local color list


const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
        <Text>HomeScreen</Text>
        <StatusBar style="auto" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
});

export default HomeScreen;
