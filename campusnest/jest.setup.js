require('dotenv/config');
require('@testing-library/jest-native/extend-expect');

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({ 
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  usePathname: jest.fn(),
  useSegments: jest.fn(),
}));

// Mock expo-image
jest.mock('expo-image', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Image: (props) => React.createElement(View, props),
  };
});

// Mock expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));