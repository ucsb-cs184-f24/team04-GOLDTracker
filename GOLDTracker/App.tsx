import * as React from "react";
import { useState, useEffect } from "react";

import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import Navigator from "./src/components/Navigator";
import LoginScreen from "./src/screen/LoginScreen";

import {auth} from "./firebaseConfig";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IOS_CLIENT_ID, ANDROID_CLIENT_ID } from "@env";

WebBrowser.maybeCompleteAuthSession();

const Stack = createNativeStackNavigator();
const App = () => {
    const [userInfo, setUserInfo] =useState();
    const [request, response, promptAsync] = Google.useAuthRequest({
      iosClientId: IOS_CLIENT_ID,
      androidClientId: ANDROID_CLIENT_ID,
    });
    
    useEffect(()=>{
      if(response?.type == "success"){
          const {id_token} =response.params;
          const credential = GoogleAuthProvider.credential(id_token);
          signInWithCredential(auth, credential);
      }
    },[response])

    useEffect(()=>{
      const unsub = onAuthStateChanged(auth, async(user) => {
        if(user){
          console.log(JSON.stringify(user,null,2));
          setUserInfo(user);
          await AsyncStorage.setItem("@user",JSON.stringify(user));
        }else{
          console.log("User is not logged in");
        }
      });
      return ()=> unsub();
    },[]);
    return (
        <NavigationContainer independent={true}>
           {userInfo ?
                (
                  <Stack.Navigator screenOptions={{ headerShown: false }}>
                      <Stack.Screen
                          name="Tab"
                          component={Navigator}
                          options={{ animation: "slide_from_bottom" }}
                      ></Stack.Screen>
                  </Stack.Navigator>
                )
                  :  (<LoginScreen promptAsync={promptAsync} />)
                }
        </NavigationContainer>
    );
};

export default App;