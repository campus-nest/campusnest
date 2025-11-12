import React from 'react';
import { render } from '@testing-library/react-native';
import Login from '@/app/login';

describe('Login Screen UI', () => {
  it('renders all expected input fields and buttons', () => {
    const { getByPlaceholderText, getByText } = render(<Login />);

    expect(getByPlaceholderText(/email/i)).toBeTruthy();
    expect(getByPlaceholderText(/password/i)).toBeTruthy();
    expect(getByText(/login/i)).toBeTruthy();
  });
});
