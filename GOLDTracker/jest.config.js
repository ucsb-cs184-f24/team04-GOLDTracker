module.exports = {
    preset: "react-native",
    transform: {
      "^.+\\.[jt]sx?$": "babel-jest",
    },
    transformIgnorePatterns: [
      "node_modules/(?!(react-native|@react-native|expo|@expo|expo-font|expo-constants|expo-linear-gradient|@expo/vector-icons|@react-navigation|@react-native-elements|@react-native-google-signin|@react-native/polyfills)/)",
    ],
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$": "<rootDir>/__mocks__/fileMock.js",
    },
    setupFiles: ["<rootDir>/jest-setup.js"],
  };
  