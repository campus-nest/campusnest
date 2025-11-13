import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import LandingScreen from "../app/landing";
import { useRouter } from "expo-router";

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

// Mock SVG imports
jest.mock("../assets/images/landing_page_top_home.svg", () => "SvgMock");
jest.mock("../assets/images/landing_page_bottom_logo.svg", () => "SvgMock");

describe("LandingScreen", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("renders the title", () => {
    const { getByText } = render(<LandingScreen />);
    expect(getByText("CampusNest")).toBeTruthy();
  });

  it("renders the subtitle", () => {
    const { getByText } = render(<LandingScreen />);
    expect(getByText("Let's get Started!")).toBeTruthy();
  });

  it("renders Login and Sign Up buttons", () => {
    const { getByText } = render(<LandingScreen />);
    expect(getByText("Login")).toBeTruthy();
    expect(getByText("Sign Up")).toBeTruthy();
  });

  it("navigates to /login when Login is pressed", () => {
    const { getByText } = render(<LandingScreen />);
    fireEvent.press(getByText("Login"));
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("navigates to /pre-signup when Sign Up is pressed", () => {
    const { getByText } = render(<LandingScreen />);
    fireEvent.press(getByText("Sign Up"));
    expect(mockPush).toHaveBeenCalledWith("/pre-signup");
  });
});
