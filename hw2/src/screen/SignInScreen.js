import { Button, SafeAreaView, Text, TouchableOpacity } from "react-native";

export default function SignInScreen ({promptAsync}){
    return(
        <SafeAreaView style={{flex:1, alignItems:"center", justifyContent:"center"}}
        >
            <TouchableOpacity 
                style={{
                    backgroundColor: "#4285F4",
                    width: "90%",
                    padding: 10,
                    borderRadius: 30,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 80,
                    marginBottom: 150,
                    }}
                    onPress={() => promptAsync()}
                >
                <Text style={{fontWeight: "bold", color: "white", fontSize: 17}}>
                    Sign In with Google
                </Text>

            </TouchableOpacity>
        </SafeAreaView>
    );
}