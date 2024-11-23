import React from 'react';
import { render, act } from '@testing-library/react-native';
import HomeScreen from '../../screen/HomeScreen';

jest.mock('../../components/SearchComponent', () => {
  const React = require('react');
  const { TextInput } = require('react-native');
  return ({ search, setSearch }) => (
    <TextInput
      value={search}
      onChangeText={setSearch}
      testID="search-component"
    />
  );
});

describe('HomeScreen Component', () => {
  it('renders correctly with all components', () => {
    const { getByTestId, getByText } = render(<HomeScreen />);

    const safeAreaView = getByTestId('safe-area-view');
    expect(safeAreaView).toBeTruthy();

    const searchComponent = getByTestId('search-component');
    expect(searchComponent).toBeTruthy();

    const descriptionText = getByText('Search to View More Courses');
    expect(descriptionText).toBeTruthy();
  });

  it('does not show description text when search is not empty', async () => {
    const { getByTestId, queryByText } = render(<HomeScreen />);

    // Simulate setting a search query
    const searchComponent = getByTestId('search-component');
    await act(async () => {
      searchComponent.props.onChangeText('Test');
    });

    // Verify the description text is not present
    const descriptionText = queryByText('Search to View More Courses');
    expect(descriptionText).toBeNull();
  });
});
