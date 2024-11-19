import HomeScreen from "../../screen/HomeScreen";
import {render} from "@testing-library/react-native";
import {NavigationContainer} from "@react-navigation/native";

test("my suicide is nigh", () =>{
    render(<NavigationContainer><HomeScreen /></NavigationContainer>)
})