import "@testing-library/jest-native/extend-expect";
import "dotenv/config";

// Force jsdom environment (RN tests require it)
if (typeof window === "undefined") {
  require("jest-environment-jsdom-global").install();
}

// Reanimated mock
jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

// Expo mocks
jest.mock("expo-router", () => ({ useRouter: jest.fn(), Redirect: jest.fn() }));
jest.mock("expo-status-bar", () => ({ StatusBar: jest.fn() }));
jest.mock("expo", () => ({}));