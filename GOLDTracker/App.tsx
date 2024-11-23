import * as React from "react";
import {useState, useEffect} from "react";

import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import Navigator from "./src/components/Navigator";
import LoginScreen from "./src/screen/LoginScreen";
import Header from "./src/components/Header"

import {auth, firestore} from "./firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
    signOut,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IOS_CLIENT_ID , ANDROID_CLIENT_ID } from "@env";
import {syncToFirebase} from "./src/components/ClassRegister";
import {AppState} from "react-native"
import {getPermissionsAsync, requestPermissionsAsync} from "expo-notifications";
import {setupBackgroundNotifications} from "./src/components/BackgroundRegister";
import { DevSettings } from "react-native";


WebBrowser.maybeCompleteAuthSession();

const Stack = createNativeStackNavigator();

const App = () => {

    const [userInfo, setUserInfo] = useState();
    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: IOS_CLIENT_ID,
        androidClientId: ANDROID_CLIENT_ID,
    });

    const saveUserOnLogin = async (user) => {
        try {
          const userDocRef = doc(firestore, "users", user.uid); // User doc ID = auth UID
          const userDoc = await getDoc(userDocRef);
      
          if (!userDoc.exists()) {
            // Save user info only if the document doesn't exist
            await setDoc(userDocRef, {
              email: user.email,
              name: user.displayName || "Anonymous",
              major: "",
              "pass time": {
                pass1: "",
                pass2: "",
                pass3: ""
              }
            });
            console.log("User saved successfully");
          } else {
            console.log("User already exists in Firestore");
          }
        } catch (error) {
          console.error("Error saving user to Firestore:", error);
        }
      };

    useEffect(() => {
        if (userInfo) {
            syncToFirebase();
        }
    }, [userInfo]);

    useEffect(() => {
        if (response?.type == "success") {
            const {id_token} = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential).then((result) => {
                const user = result.user;
                if (!user.email || !user.email.endsWith("@ucsb.edu")) {
                    alert("Only UCSB emails are allowed."); // Display the alert
                    signOut(auth).then(() => {
                    setTimeout(() => {
                        DevSettings.reload(); // Reload after a longer delay
                    }, 1000); // Extend the delay
                });             
                }
                
            }).catch((error) => {
                console.error("Error signing in with Google credential: ", error);
            });
        }
    }, [response]);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log(JSON.stringify(user, null, 2));
                setUserInfo(user);
                await AsyncStorage.setItem("@user", JSON.stringify(user));
                await saveUserToFirestore(user);
            } else {
                console.log("User is not logged in");
                setUserInfo(null);
                await AsyncStorage.removeItem("@user");
            }
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        getPermissionsAsync().then(async (hasPermissions) => {
            if (!hasPermissions.granted && hasPermissions.canAskAgain) {
                await requestPermissionsAsync();

            }
        })
        setupBackgroundNotifications();
    }, []);

    useEffect(() => {
        getPermissionsAsync().then(async (hasPermissions) => {
            if (!hasPermissions.granted && hasPermissions.canAskAgain) {
                await requestPermissionsAsync();
            }
        });
        setupBackgroundNotifications();
    }, []);


    useEffect(() => {
        const makeSync = AppState.addEventListener("change", async (toState) => {
            if (toState === "background") {
                await syncToFirebase();
            }
        });
        return () => makeSync.remove(); // Clean up the event listener
    }, []);
    
    return (
        <NavigationContainer independent={true}>
            {userInfo ?
                (
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen
                            name="Tab"
                            component={Navigator}
                            options={{animation: "slide_from_bottom"}}
                        ></Stack.Screen>
                    </Stack.Navigator>
                )
                : (<LoginScreen promptAsync={promptAsync}/>)
                
            }
        </NavigationContainer>
    );
};

export default App;