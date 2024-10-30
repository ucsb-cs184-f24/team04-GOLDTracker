import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import { auth } from "../../firebaseConfig";
import { Avatar } from "react-native-paper";
import { DevSettings } from "react-native";
import Entypo from "@expo/vector-icons/Entypo"; //icon

export default function MoreScreen({ navigation }) { // Add navigation prop here
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserInfo({
                    displayName: user.displayName,
                    email: user.email,
                    image: user.photoURL,
                });
            } else {
                setUserInfo(null);
            }
        });
        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

    const MenuButton = ({ icon, label, onPress }) => (
        <TouchableOpacity style={styles.menuButton} onPress={onPress}>
            <Entypo name={icon} size={24} color="#000" />
            <Text style={styles.menuText}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {userInfo && (
                <View style={styles.userInfoContainer}>
                    <Avatar.Image
                        source={{ uri: userInfo.image }}
                        size={100} // Adjust if needed
                        marginBottom={30}
                    />
                    <Text style={styles.nameStyle}>{userInfo.displayName}</Text>
                    <Text style={styles.emailStyle}>{userInfo.email}</Text>
                </View>
            )}
            <View style={styles.menu}>
                <MenuButton icon="help" label="Help" onPress={() => navigation.navigate("HelpScreen")} />
                <MenuButton icon="link" label="Link To GOLD" onPress={() => navigation.navigate("GoldLinkScreen")} />
                <MenuButton icon="share" label="Share GoldTracker" onPress={() => navigation.navigate("ShareScreen")} />
                <MenuButton icon="text-document" label="Term of Use" onPress={() => navigation.navigate("TermsScreen")} />
                <MenuButton icon="info" label="About" onPress={() => navigation.navigate("AboutScreen")} />
                <MenuButton
                    icon="log-out"
                    label="Log Out"
                    onPress={async () => {
                        try {
                            await signOut(auth); // Sign out the user
                            DevSettings.reload(); // Reload the app after successful sign-out
                        } catch (error) {
                            console.error("Error signing out: ", error);
                        }
                    }}
                />
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    userInfoContainer: {
        alignItems: "center",
        marginBottom: 20,
        marginTop: 100, // wait for header bar
    },
    userImage: {
        borderRadius: 50,
        marginBottom: 10,
    },
    nameStyle: {
        fontWeight: "bold",
        fontSize: 30,
    },
    emailStyle: {},
    menu: {
        marginTop: 20,
    },
    menuButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    menuText: {
        fontSize: 16,
        marginLeft: 10,
    },
    signOutButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#f44336", // Change to your desired color
        borderRadius: 5,
    },
    signOutButtonText: {
        color: "#fff",
        fontSize: 16,
    },
});
