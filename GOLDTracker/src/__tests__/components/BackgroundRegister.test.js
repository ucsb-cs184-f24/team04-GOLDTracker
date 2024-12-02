import {auth} from "../../../firebaseConfig";
import classFixtures from "../../fixtures/classFixtures";
import * as ClassRegister from "../../components/ClassRegister";
import * as BackgroundRegister from "../../components/BackgroundRegister";
import {scheduleNotificationAsync} from "expo-notifications";
import {waitFor} from "@testing-library/react-native";

describe("BackgroundRegister tests", () => {
    jest.mock("../../components/ClassRegister");
    jest.mock("../../../firebaseConfig");
    jest.mock("expo-notifications");
    jest.mock("react-native-background-fetch")
    test("Notifications work as expected", async () => {
        fetch = jest.fn().mockReturnValue(Promise.resolve({json: () => classFixtures.fetchResponse}))
        ClassRegister.getClasses = jest.fn().mockReturnValue(Promise.resolve(classFixtures.getClassFixture));
        auth.currentUser = {getIdToken: jest.fn().mockReturnValue(Promise.resolve(""))};
        ClassRegister.deregisterClass = jest.fn().mockReturnValue(Promise.resolve(true));
        BackgroundRegister.checkAvailability(12345)
        await waitFor(() => {
            expect(scheduleNotificationAsync).toBeCalledWith({"content": {"body": "You have courses available to register!", "title": "GOLDTracker"}, "trigger": null})
        });
    })
})