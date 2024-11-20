import {render, screen, userEvent, waitFor} from "@testing-library/react-native";
import CartFetch from "../../components/CartFetch";
import * as ClassRegister from "../../components/ClassRegister";
import classFixtures from "../../fixtures/classFixtures";
import {auth} from "../../../firebaseConfig";
import {View} from "react-native";


jest.mock("../../components/ClassRegister");
jest.mock("../../../firebaseConfig");
describe("CartFetch Tests", () =>{
    test("No classes in cart", async () =>{
        ClassRegister.getClasses = jest.fn().mockReturnValue(Promise.resolve(0));
        const setErrorMessage = jest.fn();
        const setClasses = jest.fn();
        render(<CartFetch setErrorMessage={setErrorMessage} setClasses={setClasses} />);
        await waitFor(() => {
            expect(setErrorMessage).toHaveBeenCalledWith("No classes in your cart.");
        });
    });
    beforeEach(() => {
        fetch = jest.fn().mockReturnValue(Promise.resolve({json: () => classFixtures.fetchResponse}))
        ClassRegister.getClasses = jest.fn().mockReturnValue(Promise.resolve(classFixtures.getClassFixture));
        auth.currentUser = {getIdToken: jest.fn().mockReturnValue(Promise.resolve(""))};
        ClassRegister.deregisterClass = jest.fn().mockReturnValue(Promise.resolve(true));
    })
    test("Runs as expected when ClassRegister returns a value", async () => {

        const setClasses = jest.fn();
        const setErrorMessage = jest.fn();
        render(<View><CartFetch setErrorMessage={setErrorMessage} setClasses={setClasses} /></View>);
        await screen.findByText("Course ID: CMPSC     8  ");
        const button = screen.getByText("Unfollow");
        await userEvent.press(button);
        await waitFor(() => {
            expect(ClassRegister.deregisterClass).toHaveBeenCalledWith("07815","07831")
        })
    })
})