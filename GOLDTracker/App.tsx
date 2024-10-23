import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./src/components/Navigator";

// Google Auth Login Screen imports
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential} from "firebase/auth";
import { auth } from "./firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./src/screen/LoginScreen";
import { IOS_CLIENT_ID, ANDROID_CLIENT_ID } from '@env';
import * as AuthSession from 'expo-auth-session';


WebBrowser.maybeCompleteAuthSession();

const Stack = createNativeStackNavigator();
const App = () => {
    const [userInfo, setUserInfo] = React.useState();
    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: IOS_CLIENT_ID,
        androidClientId: ANDROID_CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({
            scheme: "goldtracker",  
        }),
    });

    React.useEffect(() => {
        if (response?.type === "success") {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
        }
    }, [response]);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log(JSON.stringify(user, null, 2));
            } else {
                console.log("User is signed out");
            }
        });
        return unsubscribe;
    }, [userInfo]);

      return (
              <NavigationContainer independent={true}>
                  <Stack.Navigator screenOptions={{ headerShown: false }}>
                      <Stack.Screen
                        name="Login"
                            options={{ animation: "slide_from_bottom" }}
                        >
                            {(props) => (
                                <LoginScreen {...props} promptAsync={promptAsync} />
                            )}
                        </Stack.Screen>
                    
                      <Stack.Screen
                          name="Tab"
                          component={Navigator}
                          options={{ animation: "slide_from_bottom" }}
                      ></Stack.Screen>

                  </Stack.Navigator>
              </NavigationContainer>
    );
};

export default App;
