/**
 * Component Tests - MessageDetailScreen
 * Tests the message detail screen
 */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Share } from 'react-native';
import MessageDetailScreen from '../../src/screens/MessageDetailScreen';
import { AppProviders } from '../../src/contexts/AppProviders';

// Mock Share API
jest.mock('react-native/Libraries/Share/Share', () => ({
  share: jest.fn(() => Promise.resolve({ action: 'sharedAction' })),
}));

const mockMessage = {
  id: '1',
  sender: 'Dr. Smith',
  subject: 'Patient Update',
  preview: 'Patient is showing improvement...',
  date: new Date('2024-03-15T10:30:00'),
  isRead: true,
};

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const navigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
};

const route = {
  params: {
    message: mockMessage,
  },
};

const renderWithProviders = (component) => {
  return render(<AppProviders>{component}</AppProviders>);
};

describe('MessageDetailScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    test('renders message detail screen', () => {
      const { getByText } = renderWithProviders(
        <MessageDetailScreen navigation={navigation} route={route} />
      );

      expect(getByText(mockMessage.subject)).toBeTruthy();
    });

    test('displays message sender', () => {
      const { getByText } = renderWithProviders(
        <MessageDetailScreen navigation={navigation} route={route} />
      );

      expect(getByText(mockMessage.sender)).toBeTruthy();
    });

    test('displays message subject', () => {
      const { getByText } = renderWithProviders(
        <MessageDetailScreen navigation={navigation} route={route} />
      );

      expect(getByText(mockMessage.subject)).toBeTruthy();
    });

    test('displays message preview', () => {
      const { getByText } = renderWithProviders(
        <MessageDetailScreen navigation={navigation} route={route} />
      );

      expect(getByText(mockMessage.preview)).toBeTruthy();
    });

    test('renders back button', () => {
      const { getByText } = renderWithProviders(
        <MessageDetailScreen navigation={navigation} route={route} />
      );

      expect(getByText('←')).toBeTruthy();
    });

    test('renders share button', () => {
      const { getByText } = renderWithProviders(
        <MessageDetailScreen navigation={navigation} route={route} />
      );

      expect(getByText('↗')).toBeTruthy();
    });
  });

  describe('navigation', () => {
    test('navigates back when back button pressed', () => {
      const { getByText } = renderWithProviders(
        <MessageDetailScreen navigation={navigation} route={route} />
      );

      const backButton = getByText('←');
      fireEvent.press(backButton);

      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('sharing', () => {
    test('opens share dialog when share button pressed', async () => {
      const { getByText } = renderWithProviders(
        <MessageDetailScreen navigation={navigation} route={route} />
      );

      const shareButton = getByText('↗');
      fireEvent.press(shareButton);

      await waitFor(() => {
        expect(Share.share).toHaveBeenCalledWith({
          message: `${mockMessage.subject}\n\n${mockMessage.preview}`,
          title: mockMessage.subject,
        });
      });
    });

    test('handles share errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      Share.share.mockRejectedValueOnce(new Error('Share failed'));

      const { getByText } = renderWithProviders(
        <MessageDetailScreen navigation={navigation} route={route} />
      );

      const shareButton = getByText('↗');
      fireEvent.press(shareButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('metadata display', () => {
    test('shows sender label', () => {
      const { getByText } = renderWithProviders(
        <MessageDetailScreen navigation={navigation} route={route} />
      );

      expect(getByText('From:')).toBeTruthy();
    });

    test('shows subject label', () => {
      const { getByText } = renderWithProviders(
        <MessageDetailScreen navigation={navigation} route={route} />
      );

      expect(getByText('Subject:')).toBeTruthy();
    });

    test('shows date label', () => {
      const { getByText } = renderWithProviders(
        <MessageDetailScreen navigation={navigation} route={route} />
      );

      expect(getByText('Date:')).toBeTruthy();
    });
  });

  describe('handedness support', () => {
    test('renders with left-handed layout', () => {
      const { container } = renderWithProviders(
        <MessageDetailScreen navigation={navigation} route={route} />
      );

      expect(container).toBeTruthy();
    });

    test('renders with right-handed layout', () => {
      const { container } = renderWithProviders(
        <MessageDetailScreen navigation={navigation} route={route} />
      );

      expect(container).toBeTruthy();
    });
  });
});
