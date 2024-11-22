import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from '../../components/Navigator';

describe('Bottom Navigation', () => {
  it('renders bottom navigation tabs correctly', () => {
    const { getByText } = render(
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    );

    // Check if all bottom navigation tabs are rendered
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Cart')).toBeTruthy();
    expect(getByText('Notifications')).toBeTruthy();
    expect(getByText('More')).toBeTruthy();
  });

  it('navigates to the Cart screen when Cart tab is pressed', () => {
    const { getByText } = render(
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    );

    const cartTab = getByText('Cart');
    fireEvent.press(cartTab);

    // Verify if the Cart screen is displayed
    expect(getByText('Your Cart')).toBeTruthy(); 
  });
});
