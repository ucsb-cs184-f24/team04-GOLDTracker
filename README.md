# team04-GOLDTracker
<br />

### Description: 
This is a class availability notification app. <br />

### Project members:  
| Name            | GithubID       |
|-----------------|----------------|
| Simranjit Mann  | Simonmann17    |
| Daniel Jesen    | Division7      |
| Xinyao Song     | xinyao-song    |
| Karsten Lansing | KarstenLansing |
| June Bi         | zhenbi93       |
| Allen Hu        | AllenHsm       |

### Which tech stack(s) your group plans to evaluate/use? 
We are planning to use React Native with Expo Go

### Used Libraries
- react-native-navigation
- expo framework and related libraries
- firebase
- @react-native-google-signin
- react-native-community/blur
- react-native-community/datetimepicker
- react-native-async-storage
- dotenv

### User Roles
- UCSB students
  1. They could check information of courses they are interested in.
  2. They could login with their UCSB account to save their information.
  3. They could search courses in different subjects and could use filters to see the rank based on professors' scores.
  4. They could save courses in their cart, and when the course has spare space, they will receive notifications.
  5. They could use Join button to copy the course number and quickly added course in the GOLD.

# Deployment Instructions

## Android
1. Download the APK file.
2. Install it on an Android device.

## iOS/Android (Development Mode)
1. Clone the repository:
   ```bash
   git clone https://github.com/ucsb-cs184-f24/team04-GOLDTracker.git
   ```

2. In the terminal, navigate into the project directory:
   ```bash
   cd GOLDTracker
   ```

3. Install the necessary dependencies:
   ```bash
   npm install
   ```
4. Add the `.env` to the directory
   - Add the `.env` file pinned in the team04 channel on slack into the GOLDTracker directory
   
6. Linke assests
   ```
   npx react-native-asset
   ```


7. For iOS only:
   - Navigate to the ios folder:
     ```bash
     cd ios
     ```
   - Install CocoaPods dependencies:
     ```bash
     pod install
     ```
   - Return to the root project directory:
     ```bash
     cd ..
     ```

8. Run the app:
   - iOS:
     ```bash
     npx expo run:ios
     ```
   - Android:
     ```bash
     npx expo run:android
     ```
