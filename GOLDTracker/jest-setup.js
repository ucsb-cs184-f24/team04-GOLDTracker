import "react-native-gesture-handler/jestSetup";

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => require("react-native-reanimated/mock"));

// Mock react-native-elements components
jest.mock("react-native-elements", () => ({
  Button: jest.fn(),
  SearchBar: jest.fn(),
}));

// Mock @expo/vector-icons
jest.mock("@expo/vector-icons", () => ({
  Entypo: jest.fn(),
  MaterialIcons: jest.fn(),
  FontAwesome: jest.fn(),
}));

// Mock NativeAnimatedHelper to suppress warnings
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// Mock @react-native-async-storage/async-storage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock Firebase modules
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({ name: "mockApp" })),
}));

jest.mock("firebase/auth", () => ({
  getReactNativePersistence: jest.fn(),
  initializeAuth: jest.fn(() => ({
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(),
  })),
}));

jest.mock("firebase/database", () => ({
  getDatabase: jest.fn(() => ({
    ref: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
  })),
}));

// Mock NativeModules to avoid `__fbBatchedBridgeConfig` error
import { NativeModules } from "react-native";
NativeModules.UIManager = NativeModules.UIManager || {
  RCTView: () => ({}),
};
NativeModules.PlatformConstants = NativeModules.PlatformConstants || {
  forceTouchAvailable: false,
};
