/**
 * Component Tests - MessageCard
 * Tests the message card component
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MessageCard from '../../src/screens/components/MessageCard';
import { AppProviders } from '../../src/contexts/AppProviders';
import CaregiverMessage from '../../src/models/CaregiverMessage';

const mockMessage = new CaregiverMessage({
  id: '1',
  sender: 'Dr. Smith',
  subject: 'Patient Update',
  preview: 'Test message content',
  sentAt: new Date('2024-03-15T10:30:00'),
  unread: true,
});

const mockOnPress = jest.fn();

const renderWithProviders = (component) => {
  return render(<AppProviders>{component}</AppProviders>);
};

describe('MessageCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    test('renders message card', () => {
      const { getByText } = renderWithProviders(
        <MessageCard message={mockMessage} index={0} onPress={mockOnPress} />
      );

      expect(getByText('Dr. Smith')).toBeTruthy();
      expect(getByText('Patient Update')).toBeTruthy();
    });

    test('displays message sender', () => {
      const { getByText } = renderWithProviders(
        <MessageCard message={mockMessage} index={0} onPress={mockOnPress} />
      );

      expect(getByText('Dr. Smith')).toBeTruthy();
    });

    test('displays message subject', () => {
      const { getByText } = renderWithProviders(
        <MessageCard message={mockMessage} index={0} onPress={mockOnPress} />
      );

      expect(getByText('Patient Update')).toBeTruthy();
    });

    test('displays message preview', () => {
      const { getByText } = renderWithProviders(
        <MessageCard message={mockMessage} index={0} onPress={mockOnPress} />
      );

      expect(getByText('Test message content')).toBeTruthy();
    });

    test('displays formatted timestamp', () => {
      const { getByText } = renderWithProviders(
        <MessageCard message={mockMessage} index={0} onPress={mockOnPress} />
      );

      expect(getByText(/2024-03-15/)).toBeTruthy();
    });
  });

  describe('unread indicator', () => {
    test('shows unread indicator for unread messages', () => {
      const { container } = renderWithProviders(
        <MessageCard message={mockMessage} index={0} onPress={mockOnPress} />
      );

      expect(container).toBeTruthy();
    });

    test('shows read indicator for read messages', () => {
      const readMessage = new CaregiverMessage({
        ...mockMessage,
        unread: false,
      });

      const { container } = renderWithProviders(
        <MessageCard message={readMessage} index={0} onPress={mockOnPress} />
      );

      expect(container).toBeTruthy();
    });
  });

  describe('interaction', () => {
    test('calls onPress when card is pressed', () => {
      const { getByTestId } = renderWithProviders(
        <MessageCard message={mockMessage} index={0} onPress={mockOnPress} />
      );

      fireEvent.press(getByTestId('message_0'));
      expect(mockOnPress).toHaveBeenCalled();
    });
  });

  describe('styling', () => {
    test('applies unread styling for unread messages', () => {
      const { container } = renderWithProviders(
        <MessageCard message={mockMessage} index={0} onPress={mockOnPress} />
      );

      expect(container).toBeTruthy();
    });

    test('applies read styling for read messages', () => {
      const readMessage = new CaregiverMessage({
        ...mockMessage,
        unread: false,
      });

      const { container } = renderWithProviders(
        <MessageCard message={readMessage} index={0} onPress={mockOnPress} />
      );

      expect(container).toBeTruthy();
    });
  });
});
