import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Landing from '@/app/landing'; // adjust if needed
import { useRouter } from 'expo-router';

// mock router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

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
