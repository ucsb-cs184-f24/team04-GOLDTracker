import {render, screen} from "@testing-library/react-native";
import Header from "../../components/Header";

describe("Header Component Tests", () => {
   test("Header component renders as expected", async () => {
       render(<Header />);
       await screen.findByText("GoldTracker");
   });
});