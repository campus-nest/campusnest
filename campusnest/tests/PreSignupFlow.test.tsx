import { fireEvent } from "@testing-library/react-native";
import { renderRoute } from "./test-utils";

describe("PreSignup → Signup flow", () => {
  it("Student → navigates to signup-student", () => {
    const screen = renderRoute("/pre-signup");

    fireEvent.press(screen.getByText("Choose role"));
    fireEvent.press(screen.getByText("Student"));

    fireEvent.press(screen.getByText("Create Account"));

    // Automatically rerender after push
    screen.rerenderRoute();

    expect(screen).toMatchSnapshot(); // or check text in next page
  });
});
