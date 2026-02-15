/**
 * Component Tests - MessageCard
 * Focus: High Coverage and Accessibility
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MessageCard from '../../src/screens/components/MessageCard';
import { AppProviders } from '../../src/contexts/AppProviders';

// FIX: Mock the handedness context specifically for branch testing
jest.mock('../../src/contexts/AppProviders', () => {
  const actual = jest.requireActual('../../src/contexts/AppProviders');
  return {
    ...actual,
    useHandedness: jest.fn(() => ({ isLeftHanded: false })), 
  };
});

import { useHandedness } from '../../src/contexts/AppProviders';

// FIX: Using a plain object instead of 'new CaregiverMessage' 
// This avoids the "not a constructor" TypeError and isolates the UI test.
const createMockMessage = (overrides = {}) => ({
  id: '123',
  sender: 'Nurse Joy',
  subject: 'Check-up',
  preview: 'Your appointment is confirmed.',
  sentAt: new Date('2026-02-14T10:00:00'),
  unread: true,
  ...overrides,
});

const renderMessageCard = (props) => {
  return render(
    <AppProviders>
      <MessageCard {...props} />
    </AppProviders>
  );
};

describe('MessageCard Coverage Tests', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation
    useHandedness.mockReturnValue({ isLeftHanded: false });
  });

  describe('Accessibility & UI Structure', () => {
    test('provides a full summary label for screen readers', () => {
      const message = createMockMessage();
      const { getByRole } = renderMessageCard({ message, index: 0, onPress: mockOnPress });
      
      const card = getByRole('button');
      // Updated to match the accessibilityLabel we added to MessageCard.js
      expect(card.props.accessibilityLabel).toContain('Nurse Joy');
      expect(card.props.accessibilityLabel).toContain('Check-up');
      expect(card.props.accessibilityLabel).toMatch(/unread/i);
    });

    test('sets accessibilityState.selected based on unread status', () => {
      const message = createMockMessage({ unread: true });
      const { getByRole } = renderMessageCard({ message, index: 0, onPress: mockOnPress });
      
      expect(getByRole('button').props.accessibilityState.selected).toBe(true);
    });
  });

  describe('Handedness Logic (Branch Coverage)', () => {
    test('renders in right-handed mode by default', () => {
      useHandedness.mockReturnValue({ isLeftHanded: false });
      const { getByTestId } = renderMessageCard({ 
        message: createMockMessage(), 
        index: 0, 
        onPress: mockOnPress 
      });

      const card = getByTestId('message_0');
      // The content view is the first child of the TouchableOpacity
      const contentView = card.children[0];
      
      // Verify reversed style is NOT present
      const styles = contentView.props.style;
      const hasReversed = Array.isArray(styles) 
        ? styles.some(s => s && s.flexDirection === 'row-reverse')
        : styles?.flexDirection === 'row-reverse';
        
      expect(hasReversed).toBe(false);
    });

    test('applies contentReversed style for left-handed users', () => {
      useHandedness.mockReturnValue({ isLeftHanded: true });
      const { getByTestId } = renderMessageCard({ 
        message: createMockMessage(), 
        index: 5, 
        onPress: mockOnPress 
      });

      const card = getByTestId('message_5');
      const contentView = card.children[0];
      
      // Check for the row-reverse style in the style array
      expect(contentView.props.style).toContainEqual(
        expect.objectContaining({ flexDirection: 'row-reverse' })
      );
    });
  });

  describe('Visual State Coverage', () => {
    test('applies cardUnread background style for unread messages', () => {
      const message = createMockMessage({ unread: true });
      const { getByTestId } = renderMessageCard({ message, index: 0, onPress: mockOnPress });
      
      const card = getByTestId('message_0');
      expect(card.props.style).toContainEqual(
        expect.objectContaining({ backgroundColor: '#E3F2FD' })
      );
    });

    test('uses standard styles for read messages', () => {
      const message = createMockMessage({ unread: false });
      const { getByTestId } = renderMessageCard({ message, index: 0, onPress: mockOnPress });
      
      const card = getByTestId('message_0');
      // Standard card should not have the Blue unread background
      const styles = card.props.style;
      const isBlue = Array.isArray(styles) 
        ? styles.some(s => s && s.backgroundColor === '#E3F2FD')
        : styles?.backgroundColor === '#E3F2FD';

      expect(isBlue).toBe(false);
    });
  });

  describe('Interaction', () => {
    test('executes onPress callback when tapped', () => {
      const { getByTestId } = renderMessageCard({ 
        message: createMockMessage(), 
        index: 99, 
        onPress: mockOnPress 
      });

      fireEvent.press(getByTestId('message_99'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });
});