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

export default function MoreScreen({ navigation }) {
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
                    <View style={styles.profileRow}>
                        <Avatar.Image
                            source={{ uri: userInfo.image }}
                            size={80} // Adjust size if needed
                            marginRight={10} // Spacing between image and text
                        />
                        <View style={styles.profileTextContainer}>
                            <Text style={styles.nameStyle}>{userInfo.displayName}</Text>
                            <Text style={styles.emailStyle}>{userInfo.email}</Text>
                        </View>
                    </View>
                </View>
            )}
            
            {/* 添加阴影分隔线 */}
            <View style={styles.separator} />

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
                            await signOut(auth);
                            DevSettings.reload(); // Reload the app after successful sign-out
                        } catch (error) {
                            console.error("Error signing out: ", error);
                        }
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    userInfoContainer: {
        marginBottom: 10,
        marginTop: 100, // wait for header bar
        marginLeft:40,
    },
    profileRow: {
        flexDirection: 'row',
    },
    profileTextContainer: {
        flexDirection: 'column',
        marginLeft:50,
        marginTop:20,
    },
    nameStyle: {
        fontWeight: "bold",
        fontSize: 25,
    },
    emailStyle: {
        fontSize: 14,
        color: '#666', // Optional: Change email color for better readability
    },
    separator: {
        height: 1, // Height of the separator
        width: '100%', // Adjust width if needed
        backgroundColor: '#e0e0e0', // Line color
        elevation: 4, // Android shadow effect
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.3, // Shadow opacity
        shadowRadius: 2, // Shadow blur radius
        //marginVertical: 15, 
    },
    menu: {
        marginTop: 10,
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
