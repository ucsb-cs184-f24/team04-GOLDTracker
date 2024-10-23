// src/config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDJTggfratZmJv1SuEpc4EYHM_20hJ5Vk8',
  authDomain: 'goldtracker-beb96.firebaseapp.com',
  databaseURL: 'https://goldtracker-beb96.firebaseio.com',
  projectId: 'goldtracker-beb96',
  storageBucket: 'goldtracker-beb96.appspot.com',
  messagingSenderId: '756708191969',
  appId: '1:756708191969:ios:7eac66d175a40e3c4c91a0',
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth };
