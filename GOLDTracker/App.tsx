import * as React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import Navigator from "./src/components/Navigator";
import LoginScreen from "./src/screen/LoginScreen";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {GoogleAuthProvider, signInWithCredential} from "firebase/auth"
import {auth} from "./firebaseConfig"
import {Platform} from "react-native";



const Stack = createNativeStackNavigator();
const App = () => {
    const trySignIn = async () => {
        if(Platform.OS === "android"){
        GoogleSignin.configure({
            webClientId: "756708191969-njdmui6ea8p3jfiibr1hj7rbb6qpkqvk.apps.googleusercontent.com"
        });
        }
        else{
            GoogleSignin.configure({});
        }
        const {type, data} = await GoogleSignin.signIn();
        if (type === 'success') {
            let {idToken} = await GoogleSignin.getTokens();
            const credential = GoogleAuthProvider.credential(idToken);
            await signInWithCredential(auth, credential).catch(error => {console.error(error);});
        }
    }
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen
                    name="Login"
                    options={{animation: "slide_from_bottom"}}
                >
                    {(props) => (
                        <LoginScreen {...props} promptAsync={trySignIn}/>
                    )}
                </Stack.Screen>

                <Stack.Screen
                    name="Tab"
                    component={Navigator}
                    options={{animation: "slide_from_bottom"}}
                ></Stack.Screen>

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
