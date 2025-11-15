import { renderRoute, mockRouter } from "./test-utils";
import { fireEvent } from "@testing-library/react-native";

describe("PreSignup → Signup flow", () => {
  it("Student → navigates to signup with role=student", () => {
    const screen = renderRoute("/pre-signup");

    fireEvent.press(screen.getByText("Choose role"));
    fireEvent.press(screen.getByText("Student"));
    fireEvent.press(screen.getByText("Create Account"));

    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/signup",
      params: { role: "student" },
    });
  });

  it("Landlord → navigates to signup with role=landlord", () => {
    const screen = renderRoute("/pre-signup");

    fireEvent.press(screen.getByText("Choose role"));
    fireEvent.press(screen.getByText("Landlord"));
    fireEvent.press(screen.getByText("Create Account"));

    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/signup",
      params: { role: "landlord" },
    });
  });
});
