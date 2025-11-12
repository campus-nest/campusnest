module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'jsdom',

  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],

  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },

  transformIgnorePatterns: [
    'node_modules/(?!(react-native|expo(nent)?|@expo(nent)?/.*|@react-native|@react-navigation|@react-native-community)/)',
  ],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],

  moduleNameMapper: {
    // so imports like @/app/login work
    '^@/(.*)$': '<rootDir>/$1',
  },
};
