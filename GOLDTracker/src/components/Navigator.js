import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { COLORS } from "../theme/theme";

import HomeScreen from "../screen/HomeScreen";
import NotificationScreen from "../screen/NotificationScreen";
import Profile from "../screen/ProfileScreen";
import CartScreen from "../screen/CartScreen";


const Tab = createBottomTabNavigator();

const Navigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Courses"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Entypo
              name="list"
              size={25}
              color={focused ? COLORS.yellow : COLORS.darkBlue}
            />
          ),
        }}
      ></Tab.Screen>

      <Tab.Screen
        name="Followed"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Entypo
              name="heart"
              size={25}
              color={focused ? COLORS.yellow : COLORS.darkBlue}
            />
          ),
        }}
      ></Tab.Screen>

      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Entypo
              name="notification"
              size={25}
              color={focused ? COLORS.yellow : COLORS.darkBlue}
            />
          ),
        }}
      ></Tab.Screen>

      <Tab.Screen
        name="Setting"
        component={Profile}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Entypo
              name="cog"
              size={25}
              color={focused ? COLORS.yellow : COLORS.darkBlue}
            />
          ),
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 100, height: 15 },
    shadowOpacity: 10,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default Navigator;
