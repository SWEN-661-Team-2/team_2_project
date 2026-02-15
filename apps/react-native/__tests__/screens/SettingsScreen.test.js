/**
 * Component Tests - SettingsScreen
 */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SettingsScreen from '../../src/screens/SettingsScreen';
import { AppProviders } from '../../src/contexts/AppProviders';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Do NOT wrap render in act
const renderSettings = () => {
  return render(
    <AppProviders>
      <SettingsScreen navigation={mockNavigation} />
    </AppProviders>
  );
};

describe('SettingsScreen Accessibility & Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Interaction & State', () => {
    test('toggles notification switch accessibility state', async () => {
  const { getByLabelText } = renderSettings();

  const toggle = await waitFor(() =>
    getByLabelText('Notifications')
  );

  const initial =
    toggle.props.accessibilityState?.checked;

  fireEvent.press(toggle);

  await waitFor(() => {
    const updatedToggle = getByLabelText('Notifications');
    expect(
      updatedToggle.props.accessibilityState?.checked
    ).toBe(!initial);
  });
});


    test('text size selector uses radio roles and shows selection state', async () => {
      const { getByRole } = renderSettings();

      // Wait for radios to render after AsyncStorage load
      const smallOption = await waitFor(() =>
        getByRole('radio', { name: /small/i })
      );

      fireEvent.press(smallOption);

      await waitFor(() => {
        expect(
          smallOption.props.accessibilityState?.selected
        ).toBe(true);
      });
    });
  });

  describe('Modals', () => {
    test('opens reminder frequency picker', async () => {
      const { getByText, getAllByText } = renderSettings();

      const trigger = await waitFor(() =>
        getByText('Reminder frequency')
      );

      fireEvent.press(trigger);

      await waitFor(() => {
        const dailyOptions = getAllByText('Daily');
        expect(dailyOptions.length).toBeGreaterThan(1);
      });
    });
  });

  describe('Handedness Coverage', () => {
    test('updates handedness when radio button is pressed', async () => {
      const { getByRole } = renderSettings();

      const toggleBtn = await waitFor(() =>
        getByRole('radio', { name: /toggle mode/i })
      );

      fireEvent.press(toggleBtn);

      await waitFor(() => {
        expect(
          toggleBtn.props.accessibilityState?.selected
        ).toBe(true);
      });
    });
  });
});
