import React from 'react';
import { render } from '@testing-library/react-native';
import LoginScreen from '../../screen/LoginScreen';

describe('LoginScreen Component', () => {
  it('renders the logo image correctly', () => {
    const { getByTestId } = render(
      <LoginScreen promptAsync={jest.fn()} />
    );

    const logoImage = getByTestId('logo-image');
    expect(logoImage).toBeTruthy(); 
    expect(logoImage.props.source).toEqual(
      require('../../assets/ucsbLOGO.png')
    ); 
  });

  it('renders the login button correctly', () => {
    const { getByText } = render(
      <LoginScreen promptAsync={jest.fn()} />
    );

    const loginButton = getByText('Log in With Your UCSB Account');
    expect(loginButton).toBeTruthy(); 
  });
});
