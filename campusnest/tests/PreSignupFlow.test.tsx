import { renderRoute, mockRouter } from "./test-utils";
import { fireEvent } from "@testing-library/react-native";

describe("PreSignup → Signup flow", () => {
  it("Student → navigates to signup-student", () => {
    const screen = renderRoute("/pre-signup");

    fireEvent.press(screen.getByText("Choose role"));
    fireEvent.press(screen.getByText("Student"));
    fireEvent.press(screen.getByText("Create Account"));

    expect(mockRouter.push).toHaveBeenCalledWith("/signup-student");
  });
});
