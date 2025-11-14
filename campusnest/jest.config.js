module.exports = {
  preset: "jest-expo",

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