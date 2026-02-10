/**
 * Component Tests - AccessibilityDetailScreen
 * Tests the accessibility mode detail screen
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AccessibilityDetailScreen from '../../src/screens/AccessibilityDetailScreen';
import { AppProviders } from '../../src/contexts/AppProviders';

const mockOnToggle = jest.fn();
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const navigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
};

const mockRoute = {
  params: {
    title: 'Color Blindness',
    description: 'Adjust colors for better visibility',
    icon: '👁',
    enabled: false,
    onToggle: mockOnToggle,
  },
};

const renderWithProviders = (component) => {
  return render(<AppProviders>{component}</AppProviders>);
};

describe('AccessibilityDetailScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    test('renders accessibility detail screen', () => {
      const { getByText } = renderWithProviders(
        <AccessibilityDetailScreen navigation={navigation} route={mockRoute} />
      );

      expect(getByText(mockRoute.params.title)).toBeTruthy();
    });

    test('displays mode description', () => {
      const { getByText } = renderWithProviders(
        <AccessibilityDetailScreen navigation={navigation} route={mockRoute} />
      );

      expect(getByText(mockRoute.params.description)).toBeTruthy();
    });

    test('displays mode icon', () => {
      const { getByText } = renderWithProviders(
        <AccessibilityDetailScreen navigation={navigation} route={mockRoute} />
      );

      expect(getByText(mockRoute.params.icon)).toBeTruthy();
    });

    test('renders back button', () => {
      const { getByText } = renderWithProviders(
        <AccessibilityDetailScreen navigation={navigation} route={mockRoute} />
      );

      expect(getByText(/back/i)).toBeTruthy();
    });

    test('shows disabled state', () => {
      const { getByText } = renderWithProviders(
        <AccessibilityDetailScreen navigation={navigation} route={mockRoute} />
      );

      expect(getByText('Disabled')).toBeTruthy();
    });
  });

  describe('navigation', () => {
    test('navigates back when back button pressed', () => {
      const { getByText } = renderWithProviders(
        <AccessibilityDetailScreen navigation={navigation} route={mockRoute} />
      );

      const backButton = getByText(/back/i);
      fireEvent.press(backButton);

      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('toggle functionality', () => {
    test('displays toggle switch', () => {
      const { UNSAFE_getByType } = renderWithProviders(
        <AccessibilityDetailScreen navigation={navigation} route={mockRoute} />
      );

      const switches = UNSAFE_getByType('Switch');
      expect(switches).toBeTruthy();
    });

    test('calls onToggle when switch is toggled', () => {
      const { UNSAFE_getAllByType } = renderWithProviders(
        <AccessibilityDetailScreen navigation={navigation} route={mockRoute} />
      );

      const switches = UNSAFE_getAllByType('Switch');
      if (switches.length > 0) {
        fireEvent(switches[0], 'valueChange', true);
        expect(mockOnToggle).toHaveBeenCalledWith(true);
      }
    });

    test('shows enabled state when enabled', () => {
      const enabledRoute = {
        params: { ...mockRoute.params, enabled: true },
      };

      const { getByText } = renderWithProviders(
        <AccessibilityDetailScreen navigation={navigation} route={enabledRoute} />
      );

      expect(getByText('Enabled')).toBeTruthy();
    });
  });

  describe('informational content', () => {
    test('displays implementation note', () => {
      const { getByText } = renderWithProviders(
        <AccessibilityDetailScreen navigation={navigation} route={mockRoute} />
      );

      expect(getByText(/UI state only/i)).toBeTruthy();
    });

    test('shows toggle subtitle', () => {
      const { getByText } = renderWithProviders(
        <AccessibilityDetailScreen navigation={navigation} route={mockRoute} />
      );

      expect(getByText(/toggle on to activate/i)).toBeTruthy();
    });
  });

  describe('handedness support', () => {
    test('renders with handedness context', () => {
      const { container } = renderWithProviders(
        <AccessibilityDetailScreen navigation={navigation} route={mockRoute} />
      );

      expect(container).toBeTruthy();
    });
  });
});
