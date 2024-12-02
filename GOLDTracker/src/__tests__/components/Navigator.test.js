import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import Navigator from '../../components/Navigator';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('@expo/vector-icons/Entypo', () => 'Icon');
jest.mock('../../components/Header', () => 'Header');

jest.mock('../../screen/HomeScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>Welcome to Home Screen</Text>;
});

jest.mock('../../screen/CartScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>Your Cart</Text>;
});

jest.mock('../../screen/NotificationScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>Notifications Screen</Text>;
});

jest.mock('../../screen/MoreScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>More Options</Text>;
});

jest.mock('../../screen/CourseDetailScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>Course Details Screen</Text>;
});

// Mock Animated components to avoid unnecessary state updates
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('Navigator Component', () => {
  it('renders bottom navigation tabs correctly', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    );

    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Cart')).toBeTruthy();
    expect(getByText('Notifications')).toBeTruthy();
    expect(getByText('More')).toBeTruthy();
  });

  it('navigates to the Home screen when Home tab is pressed', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    );

    await act(async () => {
      fireEvent.press(getByText('Home'));
    });

    await waitFor(() => {
      expect(getByText('Welcome to Home Screen')).toBeTruthy();
    });
  });

  it('navigates to the Cart screen when Cart tab is pressed', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    );

    await act(async () => {
      fireEvent.press(getByText('Cart'));
    });

    await waitFor(() => {
      expect(getByText('Your Cart')).toBeTruthy();
    });
  });

  it('navigates to the Notifications screen when Notifications tab is pressed', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    );

    await act(async () => {
      fireEvent.press(getByText('Notifications'));
    });

    await waitFor(() => {
      expect(getByText('Notifications Screen')).toBeTruthy();
    });
  });

  it('navigates to the More screen when More tab is pressed', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    );

    await act(async () => {
      fireEvent.press(getByText('More'));
    });

    await waitFor(() => {
      expect(getByText('More Options')).toBeTruthy();
    });
  });
});
