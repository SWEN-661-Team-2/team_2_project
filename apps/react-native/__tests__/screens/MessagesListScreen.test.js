import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MessagesListScreen from '../../src/screens/MessagesListScreen';
import * as MessagesContext from '../../src/contexts/MessagesContext';
import * as AppProviders from '../../src/contexts/AppProviders';

// Mock contexts
jest.mock('../../src/contexts/MessagesContext', () => ({
  useMessages: jest.fn(),
}));

jest.mock('../../src/contexts/AppProviders', () => ({
  useHandedness: jest.fn(),
}));

// Mock components
jest.mock('../../src/screens/components/FilterMenu', () => (props) => {
  const { View } = require('react-native');
  return <View testID="MockFilterMenu" onModeChange={props.onModeChange} />;
});


jest.mock('../../src/screens/components/MessageCard', () => 'MessageCard');
jest.mock('../../src/components/HandednessToggleOverlay', () => 'HandednessToggleOverlay');

describe('MessagesListScreen Hardening & Accessibility', () => {
  const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
  const mockSetViewMode = jest.fn();
  const defaultMessages = [{ id: '1', sender: 'Dr. Smith', subject: 'Checkup', read: false }];

  beforeEach(() => {
    jest.clearAllMocks();
    AppProviders.useHandedness.mockReturnValue({ isLeftHanded: false });
    MessagesContext.useMessages.mockReturnValue({
      messages: defaultMessages,
      viewMode: 'all',
      setViewMode: mockSetViewMode,
    });
  });

  test('applies initial viewMode from route params', () => {
    const route = { params: { viewMode: 'unread' } };
    render(<MessagesListScreen navigation={mockNavigation} route={route} />);
    expect(mockSetViewMode).toHaveBeenCalledWith('unread');
  });

  test('toggles filter modal and changes mode', () => {
    // Note: Use getByTestId (lowercase 'd') for RNTL v12+
    const { getByLabelText, getByTestId } = render(
      <MessagesListScreen navigation={mockNavigation} />
    );
    // 1. Open the modal
    const filterBtn = getByLabelText('Filter messages');
    fireEvent.press(filterBtn);

    const filterMenu = getByTestId('MockFilterMenu');
    // 3. Trigger the callback prop
    filterMenu.props.onModeChange('unread');

    expect(mockSetViewMode).toHaveBeenCalledWith('unread');
  });

  test('handles back navigation', () => {
    const { getByLabelText } = render(<MessagesListScreen navigation={mockNavigation} />);
    fireEvent.press(getByLabelText('Go back'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  test('renders empty state when no messages exist', () => {
    MessagesContext.useMessages.mockReturnValue({
      messages: [],
      viewMode: 'all',
      setViewMode: mockSetViewMode,
    });
    const { getByText } = render(<MessagesListScreen navigation={mockNavigation} />);
    expect(getByText('No messages')).toBeTruthy();
  });

  test('supports left-handed layout styles', () => {
    AppProviders.useHandedness.mockReturnValue({ isLeftHanded: true });
    const { getByText, UNSAFE_getAllByType } = render(
      <MessagesListScreen navigation={mockNavigation} />
    );
    
    // Find all Views
    const allViews = UNSAFE_getAllByType('View');
    
    // Check if ANY view has the row-reverse style when handedness is toggled
    const hasRowReverse = allViews.some(v => {
      const s = v.props.style;
      if (!s) return false;
      const flat = Array.isArray(s) ? Object.assign({}, ...s.flat()) : s;
      return flat.flexDirection === 'row-reverse';
    });

    expect(hasRowReverse).toBe(true);
  });
});