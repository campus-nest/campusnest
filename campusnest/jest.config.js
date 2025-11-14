const ignoreReactNativePreset = true;

module.exports = {
  preset: "jest-expo",
  testEnvironment: "jsdom",

  // Stop React Native from loading react-native/jest/setup.js
  haste: {
    defaultPlatform: "ios",
    platforms: ["ios", "android"],
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },

  transformIgnorePatterns: [
    "node_modules/(?!(expo|expo-router|expo-modules-core|expo-status-bar|react-native|react-native-svg|react-native-reanimated|@react-native)/)"
  ],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(svg)$": "<rootDir>/tests/__mocks__/svgMock.js",
  },
};
