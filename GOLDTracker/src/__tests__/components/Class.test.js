import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Class from '../../components/Class';
import classFixtures from '../../fixtures/classFixtures';
import { NavigationContainer } from '@react-navigation/native';

// Mock the navigation prop
const mockNavigate = jest.fn();
const navigation = {
  navigate: mockNavigate,
};

// Mock the toggleFollow function
const toggleFollow = jest.fn();

jest.mock('@expo/vector-icons/Entypo', () => 'Icon');

describe('Class Component', () => {
  it('renders course information correctly', () => {
    const { getByText } = render(
      <NavigationContainer>
        <Class
          course={classFixtures.fetchResponse}
          navigation={navigation}
          toggleFollow={toggleFollow}
        />
      </NavigationContainer>
    );

    // Check if the course code is rendered
    expect(getByText('CMPSC     8')).toBeTruthy();

    // Check if the course time is rendered
    expect(getByText('TR 12:30 - 13:45')).toBeTruthy();

    // Check if the professor's name is rendered
    expect(getByText('MIRZA D')).toBeTruthy();
  });

  it('renders sections correctly', () => {
    const { getByText } = render(
      <NavigationContainer>
        <Class
          course={classFixtures.fetchResponse}
          navigation={navigation}
          toggleFollow={toggleFollow}
        />
      </NavigationContainer>
    );

    // Check if the first section (after the main section) is rendered
    expect(getByText('W 08:00 - 09:15')).toBeTruthy();

    // Check if the space availability is rendered
    expect(getByText('Space: 30/36')).toBeTruthy();
  });

});
