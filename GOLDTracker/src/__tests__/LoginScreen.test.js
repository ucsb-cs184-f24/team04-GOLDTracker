import React from 'react';
import { render, screen } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';

describe('LoginScreen', () => {
  it('renders the logo image', () => {
    const { getByRole } = render(<LoginScreen promptAsync={jest.fn()} />);
    
    const image = getByRole('image');
    expect(image).toBeTruthy(); // Verifies the image exists
    expect(image.props.source.testUri).toContain('ucsbLOGO.png'); // Checks the image source
  });

  it('renders a login button', () => {
    const { getByText } = render(<LoginScreen promptAsync={jest.fn()} />);
    
    const button = getByText('Log in With Your UCSB Account');
    expect(button).toBeTruthy(); // Verifies the button exists
  });
});
