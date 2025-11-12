import React from 'react';
import { render } from '@testing-library/react-native';
import Signup from '@/app/signup';

describe('Signup Screen UI', () => {
  it('renders all expected fields and buttons', () => {
    const { getByPlaceholderText, getByText } = render(<Signup />);

    expect(getByPlaceholderText(/email/i)).toBeTruthy();
    expect(getByPlaceholderText(/password/i)).toBeTruthy();
    expect(getByText(/sign\s*up/i)).toBeTruthy();
  });
});
