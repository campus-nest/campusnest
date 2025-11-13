import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import PreSignUpScreen from "../app/pre-signup";
import { useRouter } from "expo-router";
import { Platform } from "react-native";

jest.mock("react-native/Libraries/Utilities/Platform", () => ({
  OS: "ios", // default for all tests
  select: (objs: any) => objs.ios,
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

// Mock SVG imports
jest.mock("../assets/images/landing_page_top_home.svg", () => "SvgMock");
jest.mock("../assets/images/pre_sign_up_bottom_house.svg", () => "SvgMock");

// Mock PageContainer
jest.mock("@/components/page-container", () => ({
  PageContainer: ({ children }: any) => children,
}));

describe("PreSignUpScreen", () => {
  const mockPush = jest.fn();
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    });
  });

  it("renders the title", () => {
    const { getByText } = render(<PreSignUpScreen />);
    expect(getByText("Select a Role!")).toBeTruthy();
  });

  it("renders the role selector default text", () => {
    const { getByText } = render(<PreSignUpScreen />);
    expect(getByText("Choose role")).toBeTruthy();
  });

  it("opens dropdown when role input is pressed", () => {
    const { getByText } = render(<PreSignUpScreen />);
    fireEvent.press(getByText("Choose role"));
    expect(getByText("Student")).toBeTruthy();
    expect(getByText("Landlord")).toBeTruthy();
  });

  it("selects Student and closes dropdown", () => {
    const { getByText, queryByText } = render(<PreSignUpScreen />);

    fireEvent.press(getByText("Choose role"));
    fireEvent.press(getByText("Student"));

    expect(getByText("Student")).toBeTruthy();
    expect(queryByText("Landlord")).toBeNull();
  });

  it("selects Landlord and closes dropdown", () => {
    const { getByText, queryByText } = render(<PreSignUpScreen />);

    fireEvent.press(getByText("Choose role"));
    fireEvent.press(getByText("Landlord"));

    expect(getByText("Landlord")).toBeTruthy();
    expect(queryByText("Student")).toBeNull();
  });

  it("Create Account button is disabled until role is selected", () => {
    const { getByText } = render(<PreSignUpScreen />);
    const btn = getByText("Create Account").parent;

    expect(btn.props.disabled).toBe(true);
  });

  it("navigates to /signup-student when Student selected", () => {
    const { getByText } = render(<PreSignUpScreen />);

    fireEvent.press(getByText("Choose role"));
    fireEvent.press(getByText("Student"));
    fireEvent.press(getByText("Create Account"));

    expect(mockPush).toHaveBeenCalledWith("/signup-student");
  });

  it("navigates to /signup-landlord when Landlord selected", () => {
    const { getByText } = render(<PreSignUpScreen />);

    fireEvent.press(getByText("Choose role"));
    fireEvent.press(getByText("Landlord"));
    fireEvent.press(getByText("Create Account"));

    expect(mockPush).toHaveBeenCalledWith("/signup-landlord");
  });

  it("Android back button triggers router.back()", () => {
    Platform.OS = "android"; // force Android mode
    const { getByText } = render(<PreSignUpScreen />);

    fireEvent.press(getByText("←"));

    expect(mockBack).toHaveBeenCalled();
  });
});
