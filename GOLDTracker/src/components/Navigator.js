import React from "react";
import { StyleSheet, TouchableOpacity, Image, Text } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { COLORS } from "../theme/theme";

import HomeScreen from "../screen/HomeScreen";
import NotificationScreen from "../screen/NotificationScreen";
import MoreScreen from "../screen/MoreScreen";
import CartScreen from "../screen/CartScreen";
import AboutScreen from "../screen/AboutScreen";
import HelpScreen from "../screen/HelpScreen";
import TermsOfUseScreen from "../screen/TermOfUseScreen";
import CourseDetailScreen from "../screen/CourseDetailScreen";
import CustomizedPage from "../screen/CustomizedPage";
import { BlurView } from "expo-blur";

import Header from "../components/Header";

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const MoreStack = createStackNavigator();
const CartStack = createStackNavigator();
const NotificationStack = createStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={({ navigation, route }) => ({
        header: (props) => (
          <Header
            {...props}
            title="GOLD TRACKER"
            showImage={true}
            showUser={true}
            showBackButton={false} 
            navigation={navigation}
            onLogoPress={route.params?.resetState}
          />
        ),
      })}
    />
    <HomeStack.Screen
      name="CourseDetailScreen"
      component={CourseDetailScreen}
      options={({ navigation }) => ({
        header: (props) => (
          <Header
            {...props}
            title="Course Details"
            showImage={false}
            showUser={false}
            showBackButton={true} 
            navigation={navigation}
          />
        ),
      })}
    />
    <HomeStack.Screen
      name="CustomizedPage"
      component={CustomizedPage}
      options={({ navigation }) => ({
        header: (props) => (
          <Header
            {...props}
            title="Preferences"
            showImage={false}
            showUser={false}
            showBackButton={true} 
            navigation={navigation}
          />
        ),
      })}
    />
  </HomeStack.Navigator>
);

const MoreStackScreen = () => (
  <MoreStack.Navigator>
    <MoreStack.Screen
      name="MoreScreen"
      component={MoreScreen}
      options={({ navigation }) => ({
        header: (props) => (
          <Header
            {...props}
            title="PROFILE"
            showImage={false}
            showUser={false}
            showBackButton={false} 
            navigation={navigation}
          />
        ),
      })}
    />
    <MoreStack.Screen
      name="CustomizedPage"
      component={CustomizedPage}
      options={({ navigation }) => ({
        header: (props) => (
          <Header
            {...props}
            title="Preferences"
            showImage={false}
            showUser={false}
            showBackButton={true}
            navigation={navigation}
          />
        ),
      })}
    />
    <MoreStack.Screen
      name="AboutScreen"
      component={AboutScreen}
      options={({ navigation }) => ({
        header: (props) => (
          <Header
            {...props}
            title="About"
            showImage={false}
            showUser={false}
            showBackButton={true} 
            navigation={navigation}
          />
        ),
      })}
    />
    <MoreStack.Screen
      name="HelpScreen"
      component={HelpScreen}
      options={({ navigation }) => ({
        header: (props) => (
          <Header
            {...props}
            title="Help"
            showImage={false}
            showUser={false}
            showBackButton={true}
            navigation={navigation}
          />
        ),
      })}
    />
    <MoreStack.Screen
      name="TermsOfUseScreen"
      component={TermsOfUseScreen}
      options={({ navigation }) => ({
        header: (props) => (
          <Header
            {...props}
            title="Terms of Use"
            showImage={false}
            showUser={false}
            showBackButton={true} 
            navigation={navigation}
          />
        ),
      })}
    />
  </MoreStack.Navigator>
);

const CartStackScreen = () => (
  <CartStack.Navigator>
    <CartStack.Screen
      name="CartScreen"
      component={CartScreen}
      options={({ navigation }) => ({
        header: (props) => (
          <Header
            {...props}
            title="CART"
            showImage={false}
            showUser={false}
            showBackButton={false} 
            navigation={navigation}
          />
        ),
      })}
    />
  </CartStack.Navigator>
);

const NotificationStackScreen = () => (
  <NotificationStack.Navigator>
    <NotificationStack.Screen
      name="NotificationScreen"
      component={NotificationScreen}
      options={({ navigation }) => ({
        header: (props) => (
          <Header
            {...props}
            title="NOTIFICATIONS"
            showImage={false}
            showUser={false}
            showBackButton={false} 
            navigation={navigation}
          />
        ),
      })}
    />
  </NotificationStack.Navigator>
);

const Navigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#e3dd98',
        tabBarInactiveTintColor: COLORS.white,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Nunito-Bold',
        },
        tabBarStyle: {
          backgroundColor: 'rgba(231, 119, 87, 0.9)', // Add transparency to your color
          position: 'absolute', // Keep the bar overlaying
          borderTopWidth: 0, // Remove the border for a clean look
        },
        headerShown: false, 
      }}
    >
      <Tab.Screen
        name="HOME"
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('../assets/images/wow.png')
                  : require('../assets/images/schedule.png')
              }
              style={styles.navIcon}
            />
          ),
        }}
      />

      <Tab.Screen
        name="CART"
        component={CartStackScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('../assets/images/wow.png')
                  : require('../assets/images/cart.png')
              }
              style={styles.navIcon}
            />
          ),
        }}
      />

      <Tab.Screen
        name="NOTIFICATION"
        component={NotificationStackScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('../assets/images/wow.png')
                  : require('../assets/images/allert.png')
              }
              style={styles.navIcon}
            />
          ),
        }}
      />

      <Tab.Screen
        name="PROFILE"
        component={MoreStackScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('../assets/images/wow.png')
                  : require('../assets/images/normal.png')
              }
              style={styles.navIcon}
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
  navIcon: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
});

export default Navigator;
