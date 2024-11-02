import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { COLORS } from "../theme/theme";

import HomeScreen from "../screen/HomeScreen";
import NotificationScreen from "../screen/NotificationScreen";
import MoreScreen from "../screen/MoreScreen";
import CartScreen from "../screen/CartScreen";
import CourseDetailScreen from "../screen/CourseDetailScreen";

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name=" " component={HomeScreen} />
    <HomeStack.Screen
      name="CourseDetailScreen"
      component={CourseDetailScreen}
      options={{ headerShown: true, title: "Course Details" }}
    />
  </HomeStack.Navigator>
);

const Navigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="home"
              size={25}
              color={focused ? COLORS.yellow : COLORS.darkBlue}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="shopping-cart"
              size={25}
              color={focused ? COLORS.yellow : COLORS.darkBlue}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="notification"
              size={25}
              color={focused ? COLORS.yellow : COLORS.darkBlue}
            />
          ),
        }}
      />

      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="dots-three-horizontal"
              size={25}
              color={focused ? COLORS.yellow : COLORS.darkBlue}
            />
          ),
        }}
      />
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
