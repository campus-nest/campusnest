import { renderRoute, mockRouter } from "./test-utils";
import { fireEvent } from "@testing-library/react-native";

it("navigates to PreSignup when Sign Up is pressed", () => {
  const screen = renderRoute("/landing");

  fireEvent.press(screen.getByText("Sign Up"));

  // Ensure next route selection
  screen.rerenderRoute();

  expect(mockRouter.push).toHaveBeenCalledWith("/pre-signup");
  expect(screen.getByText("Select a Role!")).toBeTruthy();
});
