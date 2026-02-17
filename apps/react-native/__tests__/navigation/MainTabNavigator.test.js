import React from 'react';
import { render } from '@testing-library/react-native';
import MainTabNavigator from '../../src/navigation/MainTabNavigator';
import { messagesRepository } from '../../src/repositories/MessagesRepository';

// Mock screens to keep them out of the test loop
jest.mock('../../src/screens/CaregiverDashboardScreen', () => () => null);
jest.mock('../../src/screens/PatientsScreen', () => () => null);
jest.mock('../../src/screens/TasksScreen', () => () => null);
jest.mock('../../src/screens/MessagesListScreen', () => () => null);
jest.mock('../../src/screens/SettingsScreen', () => () => null);

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: jest.fn().mockReturnValue({
    Navigator: ({ children }) => {
      const { View } = require('react-native');
      return <View>{children}</View>;
    },
    Screen: ({ options, name }) => {
      const { View, Text } = require('react-native');
      
      // CRITICAL: This executes the arrow functions on lines 41-88
      const icon = options?.tabBarIcon ? options.tabBarIcon({ color: 'black' }) : null;
      
      return (
        <View testID={`screen-${name}`}>
          <Text>{options?.tabBarAccessibilityLabel}</Text>
          {/* We render the icon result to ensure the emojis are 'touched' */}
          {icon}
        </View>
      );
    },
  }),
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => {
    const { View } = require('react-native');
    return <View>{children}</View>;
  },
}));

describe('MainTabNavigator Accessibility & Icon Coverage', () => {
  
  test('Executes all icon functions and displays labels', () => {
    // Set unread count to 5 to trigger the 'positive' branch of the ternary
    jest.spyOn(messagesRepository, 'unreadCount').mockReturnValue(5);
    
    const { getByText } = render(<MainTabNavigator />);
    
    // Check Accessibility Labels
    expect(getByText('Home Dashboard')).toBeTruthy();
    expect(getByText('Messages, 5 unread items')).toBeTruthy();
    
    // Check Emojis (This proves the functions in lines 41-88 ran)
    expect(getByText('🏠')).toBeTruthy();
    expect(getByText('💬')).toBeTruthy();
    expect(getByText('⚙️')).toBeTruthy();

    messagesRepository.unreadCount.mockRestore();
  });

  test('Covers the "no unread items" branch', () => {
    // Set unread count to 0 to trigger the 'else' branch of the ternary
    jest.spyOn(messagesRepository, 'unreadCount').mockReturnValue(0);
    
    const { getByText } = render(<MainTabNavigator />);
    
    expect(getByText('Messages, no unread items')).toBeTruthy();
    
    messagesRepository.unreadCount.mockRestore();
  });
});