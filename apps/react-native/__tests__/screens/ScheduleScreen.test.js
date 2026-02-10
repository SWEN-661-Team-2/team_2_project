/**
 * Component Tests - ScheduleScreen
 * Tests the schedule screen
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ScheduleScreen from '../../src/screens/ScheduleScreen';
import { AppProviders } from '../../src/contexts/AppProviders';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const navigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
};

const renderWithProviders = (component) => {
  return render(<AppProviders>{component}</AppProviders>);
};

describe('ScheduleScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    test('renders schedule screen', () => {
      const { getByText } = renderWithProviders(
        <ScheduleScreen navigation={navigation} />
      );

      expect(getByText('Schedule')).toBeTruthy();
    });

    test('displays coming soon placeholder', () => {
      const { getByText } = renderWithProviders(
        <ScheduleScreen navigation={navigation} />
      );

      expect(getByText(/coming soon/i)).toBeTruthy();
    });

    test('renders back button', () => {
      const { getByText } = renderWithProviders(
        <ScheduleScreen navigation={navigation} />
      );

      expect(getByText('←')).toBeTruthy();
    });
  });

  describe('navigation', () => {
    test('navigates back when back button pressed', () => {
      const { getByText } = renderWithProviders(
        <ScheduleScreen navigation={navigation} />
      );

      const backButton = getByText('←');
      fireEvent.press(backButton);

      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    test('title is readable', () => {
      const { getByText } = renderWithProviders(
        <ScheduleScreen navigation={navigation} />
      );

      const title = getByText('Schedule');
      expect(title).toBeTruthy();
    });

    test('back button is accessible', () => {
      const { getByText } = renderWithProviders(
        <ScheduleScreen navigation={navigation} />
      );

      const backButton = getByText('←');
      expect(backButton).toBeTruthy();
    });
  });
});
