import React, { useState } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./src/components/Navigator";
import ProfileScreen from "./src/screen/ProfileScreen";
import LoginScreen from "./src/screen/LoginScreen";

const Stack = createNativeStackNavigator();
const App = () => {
      return (
              <NavigationContainer independent={true}>
                  <Stack.Navigator screenOptions={{ headerShown: false }}>
                      <Stack.Screen
                          name="Tab"
                          component={Navigator}
                          options={{ animation: "slide_from_bottom" }}
                      ></Stack.Screen>

                      <Stack.Screen
                        name="Profile"
                        component={ProfileScreen}
                        />

                      <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        />
                  </Stack.Navigator>
              </NavigationContainer>
    );
};

export default App;
