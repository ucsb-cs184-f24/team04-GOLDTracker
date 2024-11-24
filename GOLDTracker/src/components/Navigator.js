import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { COLORS } from "../theme/theme";
import { BlurView } from "expo-blur";

import HomeScreen from "../screen/HomeScreen";
import NotificationScreen from "../screen/NotificationScreen";
import MoreScreen from "../screen/MoreScreen";
import CartScreen from "../screen/CartScreen";
import AboutScreen from "../screen/AboutScreen";
import HelpScreen from "../screen/HelpScreen";
import TermsOfUseScreen from "../screen/TermOfUseScreen";
import CourseDetailScreen from "../screen/CourseDetailScreen";
import CustomizedPage from "../screen/CustomizedPage";

import Header from "../components/Header"; 

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const MoreStack = createStackNavigator();

const MoreStackScreen = () => (
  <MoreStack.Navigator>
    <MoreStack.Screen
      name="MoreScreen" 
      component={MoreScreen}
      options={{ header: () => <Header /> }}
    />
    <MoreStack.Screen name="CustomizedPage" component={CustomizedPage} options={{ title: "Preferences" }} />
    <MoreStack.Screen
      name="AboutScreen"
      component={AboutScreen}
      options={{ title: "About" }}
    />
    <MoreStack.Screen
      name="HelpScreen"
      component={HelpScreen}
      options={{ title: "Help" }}
    />
    <MoreStack.Screen
      name="TermsOfUseScreen" 
      component={TermsOfUseScreen}
      options={{ title: "Terms of Use" }}
    />
  </MoreStack.Navigator>
);

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="HomeScreen" 
      component={HomeScreen}
      options={{ header: () => <Header /> }}
    />
    <HomeStack.Screen
      name="CourseDetailScreen"
      component={CourseDetailScreen}
      options={{ headerShown: true, title: "Course Details" }}
    />
    <HomeStack.Screen name="CustomizedPage" component={CustomizedPage} />
  </HomeStack.Navigator>
);

const Navigator = () => {
  return (
    <Tab.Navigator
    screenOptions={{
      tabBarBackground: () => (
        <BlurView
          intensity={50}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
      ),
      tabBarStyle: [
        styles.tabBar,
        styles.shadow,
      ],
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
          headerShown: false,
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
          header: () => <Header />,
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
          header: () => <Header />,
        }}
      />

      <Tab.Screen
        name="More"
        component={MoreStackScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="dots-three-horizontal"
              size={25}
              color={focused ? COLORS.yellow : COLORS.darkBlue}
            />
          ),
          headerShown: false,
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
  tabBar: {
    position: "absolute",
    borderTopWidth: 0,
    backgroundColor: "transparent", // Set to transparent for the blur effect
  },
});

export default Navigator;