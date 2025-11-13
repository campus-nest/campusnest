import { fireEvent } from "@testing-library/react-native";
import { renderRoute } from "./test-utils";

describe("LandingScreen → PreSignup flow", () => {
  it("navigates to PreSignup when Sign Up is pressed", () => {
    const screen = renderRoute("/landing");

    fireEvent.press(screen.getByText("Sign Up"));

    // Re-render the screen after navigation
    screen.rerenderRoute();

    expect(screen.getByText("Select a Role!")).toBeTruthy();
  });
});
