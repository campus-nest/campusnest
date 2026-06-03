import React from "react";
import { render } from "@testing-library/react-native";

let currentRoute = "/";
const listeners: Function[] = [];

export const mockRouter = {
  push: jest.fn((value: any) => {
    if (typeof value === "string") {
      currentRoute = value;
    } else if (typeof value === "object" && value.pathname) {
      currentRoute = value.pathname;
    }
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

import LandingScreen from "../app/landing";
import PreSignUpScreen from "../app/pre-signup";

const FakeScreen = () => null;

const routeMap: Record<string, React.FC> = {
  "/": LandingScreen,
  "/landing": LandingScreen,
  "/pre-signup": PreSignUpScreen,
  "/signup": FakeScreen,
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
