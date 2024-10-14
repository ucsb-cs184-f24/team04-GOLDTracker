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

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow,
    }}
    onPress={onPress}
    activeOpacity={0.9}
  >
  </TouchableOpacity>
);

const Navigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Entypo
              name="home"
              size={25}
              color={focused ? COLORS.yellow : COLORS.darkBlue}
            />
          ),
        }}
      ></Tab.Screen>

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Entypo
              name="shopping-cart"
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
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Entypo
              name="user"
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
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default Navigator;
