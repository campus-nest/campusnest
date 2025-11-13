global.__DEV__ = true;

// Suppress react-test-renderer deprecation warnings in Jest
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("react-test-renderer is deprecated")
  ) {
    return;
  }
  originalError(...args);
};

jest.mock("react-native/Libraries/BatchedBridge/NativeModules", () => ({
  PlatformConstants: { reactNativeVersion: { major: 0, minor: 81, patch: 0 } },
}));

jest.mock("react-native/Libraries/TurboModule/TurboModuleRegistry", () => ({
  getEnforcing: (name) => {
    if (name === "NativeDeviceInfo") {
      return {
        getConstants: () => ({
          Dimensions: {
            window: { width: 1080, height: 1920, scale: 2, fontScale: 2 },
            screen: { width: 1080, height: 1920, scale: 2, fontScale: 2 },
          },
        }),
      };
    }
    return {};
  },
  get: () => ({}),
}));

jest.mock(
  "react-native/src/private/specs_DEPRECATED/modules/NativeDeviceInfo",
  () => ({
    getConstants: () => ({
      Dimensions: {
        window: { width: 1080, height: 1920, scale: 2, fontScale: 2 },
        screen: { width: 1080, height: 1920, scale: 2, fontScale: 2 },
      },
    }),
  }),
);

jest.mock(
  "react-native/src/private/featureflags/specs/NativeReactNativeFeatureFlags",
  () => ({
    getConstants: () => ({}),
    get: () => ({}),
  }),
);

jest.mock("react-native/Libraries/Utilities/Platform", () => ({
  OS: "ios",
  select: (objs) => objs.ios,
}));

jest.mock("react-native/Libraries/ReactNative/UIManager", () => ({
  RCTView: () => {},
  ViewManagerNames: [],
  getViewManagerConfig: () => ({}),
  hasViewManagerConfig: () => true,
}));

import "dotenv/config";
import "@testing-library/jest-native/extend-expect";
jest.mock("expo", () => ({}));
