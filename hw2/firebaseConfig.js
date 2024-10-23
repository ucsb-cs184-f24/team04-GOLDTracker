// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDZXtwXy4KcmPg3ruA3wnIuLLBmQ6hd4tw",
  authDomain: "cs184-hw2-a4108.firebaseapp.com",
  projectId: "cs184-hw2-a4108",
  storageBucket: "cs184-hw2-a4108.appspot.com",
  messagingSenderId: "311277958610",
  appId: "1:311277958610:web:2fb928a01ba34797be840b",
  measurementId: "G-T1HXBKWG35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//export const auth = getAuth(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

//IOS: 311277958610-c2b5he1l63vqj6jc83rjqtkj6m2ovacr.apps.googleusercontent.com


