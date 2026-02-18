// Path: /__tests__/screens/SettingsScreen.test.js
/**
 * Component Tests - SettingsScreen
 */
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { AppProviders } from '../../src/contexts/AppProviders';
import SettingsScreen from '../../src/screens/SettingsScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

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
      const { getByRole } = renderSettings();

      const toggle = await waitFor(() =>
        getByRole('switch', { name: 'Notifications' })
      );

      const initialChecked = toggle.props.accessibilityState?.checked ?? false;

      fireEvent(toggle, 'valueChange', !initialChecked);

      await waitFor(() => {
        const updatedToggle = getByRole('switch', { name: 'Notifications' });
        const checked = updatedToggle.props.accessibilityState?.checked ?? false;
        expect(checked).toBe(!initialChecked);
      });
    });

    test('text size selector uses radio roles and shows selection state', async () => {
      const { getByRole } = renderSettings();

      await waitFor(() => getByRole('radio', { name: /small/i }));

      fireEvent.press(getByRole('radio', { name: /small/i }));

      await waitFor(() => {
        const updatedSmall = getByRole('radio', { name: /small/i });
        expect(updatedSmall.props.accessibilityState?.selected ?? false).toBe(true);
      });
    });
  });

  describe('Modals', () => {
    test('opens reminder frequency picker', async () => {
      const { getByText, getAllByText } = renderSettings();

      const trigger = await waitFor(() => getByText('Reminder frequency'));
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

      const toggleMode = await waitFor(() =>
        getByRole('radio', { name: /toggle mode/i })
      );

      fireEvent.press(toggleMode);

      await waitFor(() => {
        const updatedToggleMode = getByRole('radio', { name: /toggle mode/i });
        expect(updatedToggleMode.props.accessibilityState?.selected ?? false).toBe(true);
      });
    });
  });
});