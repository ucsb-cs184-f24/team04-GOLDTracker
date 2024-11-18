import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import LoginScreen from "../LoginScreen";
import HomeScreen from "../HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

describe("Login flow", () => {
  it("navigates to HomeScreen after login button is pressed", () => {
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

    const { getByText, queryByText } = render(<App />);

    // Check that the LoginScreen is initially rendered
    expect(getByText("Log in With Your UCSB Account")).toBeTruthy();

    // Simulate login button press
    const loginButton = getByText("Log in With Your UCSB Account");
    fireEvent.press(loginButton);

    // Verify navigation to HomeScreen
    expect(queryByText("Search to View More Courses")).toBeTruthy();
  });
});
