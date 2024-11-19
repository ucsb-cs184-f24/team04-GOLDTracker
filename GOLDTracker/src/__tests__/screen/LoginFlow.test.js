import React from "react";
import {render, fireEvent, screen} from "@testing-library/react-native";
import LoginScreen from "../../screen/LoginScreen";
import HomeScreen from "../../screen/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

describe("Login flow", () => {

  it("navigates to HomeScreen after login button is pressed", async () => {
    const mockPromptAsync = jest.fn(() => Promise.resolve(true)); // Mock login behavior

    const App = () => (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={() => <LoginScreen promptAsync={mockPromptAsync} />}
          />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    render(<App />);

    // Check that the LoginScreen is initially rendered
    await screen.findByText("Log in With Your UCSB Account")

    // Simulate login button press
    const loginButton = screen.getByText("Log in With Your UCSB Account");
    fireEvent.press(loginButton);

    await screen.findByText("Search to View More Courses");

    // Verify navigation to HomeScreen
  });
});
