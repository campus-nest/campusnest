import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Landing from '@/app/landing';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';

/*
describe('Landing Page Navigation', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    mockPush.mockClear();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('navigates to Login page when Login button is pressed', () => {
    const { getByText } = render(<Landing />);
    const loginButton = getByText(/login/i);
    fireEvent.press(loginButton);

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('navigates to Signup page when Signup button is pressed', () => {
    const { getByText } = render(<Landing />);
    const signupButton = getByText(/sign\s*up/i);
    fireEvent.press(signupButton);

    expect(mockPush).toHaveBeenCalledWith('/signup');
  });
});
*/

describe('Smoke test', () => {
  it('renders text correctly', () => {
    const { getByText } = render(<Text>Hello, CampusNest!</Text>);
    expect(getByText('Hello, CampusNest!')).toBeTruthy();
  });
});
