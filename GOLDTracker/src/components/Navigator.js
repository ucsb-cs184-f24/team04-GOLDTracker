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
import AboutScreen from "../screen/AboutScreen";
import HelpScreen from "../screen/HelpScreen";
import TermsOfUseScreen from "../screen/TermOfUseScreen";
import CourseDetailScreen from "../screen/CourseDetailScreen";
import CustomizedPage from "../screen/CustomizedPage";


const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

const MoreStack = createStackNavigator();

const MoreStackScreen = () => (
  <MoreStack.Navigator
    screenOptions={({ navigation }) => ({
      headerShown: true,
      headerLeft: ({ tintColor }) => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 15 }} // Adjust position here
        >
          <Entypo name="chevron-left" size={35} color={tintColor || "#91908d"} />
        </TouchableOpacity>
      ),
      headerTitleStyle: {
        fontSize: 24, // Increase the title size
        //fontWeight: 'bold', // Optional: make the title bold
        color:"#60605e",
      },
    })}
  >
    <MoreStack.Screen
      name="More"
      component={MoreScreen}
      options={{ headerShown: false }}
    />
    <MoreStack.Screen name="CustomizedPage" component={CustomizedPage} options={{ title: "Preferences" }} />
    <MoreStack.Screen name="AboutScreen" component={AboutScreen} options={{ title: "About" }} />
    <MoreStack.Screen name="HelpScreen" component={HelpScreen} options={{ title: "Help" }} />
    <MoreStack.Screen name="TermOfUseScreen" component={TermsOfUseScreen} options={{ title: "Terms of Use" }} />
  </MoreStack.Navigator>
);



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

const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name=" " component={HomeScreen} />
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
        component={MoreStackScreen}
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
