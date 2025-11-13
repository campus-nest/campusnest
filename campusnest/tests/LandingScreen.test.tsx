import { renderRoute, mockRouter } from "./test-utils";
import { fireEvent } from "@testing-library/react-native";

it("navigates to PreSignup when Sign Up is pressed", () => {
  const screen = renderRoute("/landing");

  fireEvent.press(screen.getByText("Sign Up"));

  expect(mockRouter.push).toHaveBeenCalledWith("/pre-signup");
});
