import React from "react";
import { render } from "@testing-library/react-native";
import { useRouter } from "expo-router";

// Global mock state for navigation
let currentRoute = "/";
let listeners: Function[] = [];

// Mock the router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

export const mockRouter = {
  push: (route: string) => {
    currentRoute = route;
    listeners.forEach((fn) => fn());
  },
  back: () => {
    currentRoute = "/";
    listeners.forEach((fn) => fn());
  },
  getCurrentRoute: () => currentRoute,
  subscribe: (fn: Function) => listeners.push(fn)
};

beforeEach(() => {
  currentRoute = "/";
  listeners = [];
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
});

// Map routes to screens
import LandingScreen from "../app/landing";
import PreSignUpScreen from "../app/pre-signup";

const routeMap: Record<string, React.FC> = {
  "/landing": LandingScreen,
  "/pre-signup": PreSignUpScreen,
  "/": LandingScreen,
};

export function renderRoute(route: string) {
  currentRoute = route;

  const screen = render(React.createElement(routeMap[route] || LandingScreen));

  return {
    ...screen,
    rerenderRoute() {
      screen.rerender(
        React.createElement(routeMap[mockRouter.getCurrentRoute()] || LandingScreen)
      );
    }
  };
}
