import HomeScreen from "../../screen/HomeScreen";
import {render} from "@testing-library/react-native";
import {NavigationContainer} from "@react-navigation/native";

test("test", () =>{
    render(<NavigationContainer><HomeScreen /></NavigationContainer>)
})