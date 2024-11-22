import {waitFor} from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as classRegister from "../../components/ClassRegister";
import classFixtures from "../../fixtures/classFixtures";
import {auth, database} from "../../../firebaseConfig";
import firebasemock from "firebase-mock";
import mocksdk from "../../../__mocks__/firebase";

describe("ClassRegister Tests", () => {
    jest.mock("@react-native-async-storage/async-storage");
    test("GetClasses returns a class", async () =>{
        AsyncStorage.getItem.mockReturnValue(Promise.resolve(JSON.stringify(classFixtures.getClassFixture)));
        let returnValue = await classRegister.getClasses();
        expect(AsyncStorage.getItem).toBeCalledWith("class-list");
        expect(returnValue).toEqual(classFixtures.getClassFixture);
    });

    test("RegisterClass adds a class to the class register", async () => {
        AsyncStorage.getItem.mockReturnValue(Promise.resolve(JSON.stringify(classFixtures.getClassFixture)));
        await classRegister.registerClass("123","456")
        let modifiedClassFixtures = classFixtures.getClassFixture;
        modifiedClassFixtures["123"] = ["456"]
        expect(AsyncStorage.setItem).toBeCalledWith("class-list",JSON.stringify(modifiedClassFixtures));
    });

    test("DeregisterClass removes a class from the class register", async () => {
        AsyncStorage.getItem.mockReturnValue(Promise.resolve(JSON.stringify(classFixtures.getClassFixture)));
        await classRegister.deregisterClass("07815","07856")
        let modifiedClassFixtures = classFixtures.getClassFixture;
        modifiedClassFixtures["07815"] = ["07831"]
        expect(AsyncStorage.setItem).toBeCalledWith("class-list",JSON.stringify(modifiedClassFixtures));
    });
})