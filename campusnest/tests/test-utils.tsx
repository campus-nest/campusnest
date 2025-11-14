import React from "react";
import { render } from "@testing-library/react-native";

let currentRoute = "/";
const listeners: Function[] = [];

export const mockRouter = {
  push: jest.fn((path: string) => {
    currentRoute = path;
    listeners.forEach((fn) => fn());
  }),
  back: jest.fn(() => {
    currentRoute = "/";
    listeners.forEach((fn) => fn());
  }),
};

jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
}));

import LandingScreen from "@/app/landing";
import PreSignUpScreen from "@/app/pre-signup";

const FakeScreen = () => null;

const routeMap: Record<string, React.FC> = {
  "/": LandingScreen,
  "/landing": LandingScreen,
  "/pre-signup": PreSignUpScreen,
  "/signup-student": FakeScreen,
  "/signup-landlord": FakeScreen,
};

export function renderRoute(route: string) {
  currentRoute = route;

  const screen = render(React.createElement(routeMap[currentRoute]));

  return {
    ...screen,
    rerenderRoute() {
      screen.rerender(React.createElement(routeMap[currentRoute]));
    },
  };
}
