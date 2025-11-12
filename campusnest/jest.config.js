module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },

  transformIgnorePatterns: [
    'node_modules/(?!(?:.pnpm/)?(' +
      'react-native|' +
      'react-native/.*|' +
      '@react-native|' +
      '@react-native/.*|' +
      '@react-native-community|' +
      '@react-navigation|' +
      'expo|' +
      'expo-.*|' +
      '@expo|' +
      '@expo/.*|' +
      '@unimodules|' +
      'unimodules|' +
      'sentry-expo|' +
      'native-base|' +
      'react-native-svg' +
    '))',
  ],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/src/lib/supabaseClient$': '<rootDir>/__mocks__/src/lib/supabaseClient.ts',
  },

  globals: {
    'process.env.EXPO_OS': 'ios',
  },
};
