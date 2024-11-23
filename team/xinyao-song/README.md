# Testing Contributions

Both my teammate Daniel and I are using the same Jest setup, and our modifications are made on the same branch called `jest`. Please consider the following files as part of my contributions:

## Test Files
1. **`GOLDTracker/src/__tests__/components/Class.test.js`**  
   Ensures that the `Class` component correctly renders course information, including details like course code, time, professor name, sections, and space availability.

2. **`GOLDTracker/src/__tests__/components/Navigator.test.js`**  
   Verifies that the `Navigator` component properly renders bottom navigation tabs and navigates to the correct screen when each tab is pressed.

3. **`GOLDTracker/src/__tests__/screen/HomeScreen.test.js`**  
   Tests that the `HomeScreen` component renders its elements (e.g., search bar and description text) correctly and dynamically updates based on user input.

4. **`GOLDTracker/src/__tests__/screen/LoginScreen.test.js`**  
   Confirms that the `LoginScreen` component renders the UCSB logo and the login button accurately.

## Additional Contributions
- **`USER_FEEDBACK_NEEDS.md`**: Added three desired user feedback items along with two additional questions for further user input.

## Notes
- Some modifications were made to the original files to add `testID` attributes to certain components, ensuring that the tests run successfully.
- These changes improve test coverage and ensure the components behave as expected.
