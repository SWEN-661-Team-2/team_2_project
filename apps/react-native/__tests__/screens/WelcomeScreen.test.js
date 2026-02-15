/**
 * Component Tests - WelcomeScreen
 * Verified for Accessibility Labels and Carousel Logic
 */
import React from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from '../../src/screens/WelcomeScreen';

// Mock Navigation
const mockNavigation = {
  navigate: jest.fn(),
};

const renderWelcomeScreen = () => {
  return render(
    <NavigationContainer>
      <WelcomeScreen navigation={mockNavigation} />
    </NavigationContainer>
  );
};

describe('WelcomeScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers(); // Required for auto-rotating carousel
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Accessibility & Rendering', () => {
    test('renders grouped branding header with full mission statement label', () => {
      renderWelcomeScreen();
      // Verifies the brandingContainer grouping
      const header = screen.getByRole('header');
      expect(header.props.accessibilityLabel).toContain('CareConnect');
      expect(header.props.accessibilityLabel).toContain('Connecting Hearts');
    });

    test('settings button has correct accessibility labels', () => {
      renderWelcomeScreen();
      const settingsBtn = screen.getByTestId('welcome_settings_button');
      expect(settingsBtn.props.accessibilityLabel).toBe('Settings');
      expect(settingsBtn.props.accessibilityHint).toBe('Navigates to the login screen');
    });

    test('continue button is accessible and navigates to Login', () => {
      renderWelcomeScreen();
      const continueBtn = screen.getByLabelText('Continue to Login');
      
      fireEvent.press(continueBtn);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    test('renders call to action button', () => {
      const { queryByText } = renderWelcomeScreen();

      const ctaButton = 
        queryByText(/Get Started/i) || 
        queryByText(/Login/i) ||
        queryByText(/Sign In/i) ||
        queryByText(/Continue/i);

      expect(ctaButton).toBeTruthy();
    });
  });

  describe('Carousel Logic', () => {
    test('carousel updates accessibility label when auto-rotating', () => {
      renderWelcomeScreen();
      
      // Check initial state (1 of 10)
      const carousel = screen.getByTestId('welcome_carousel');
      expect(carousel.props.accessibilityLabel).toBe('Caregiving illustration 1 of 10');

      // Fast-forward 4 seconds
      act(() => {
        jest.advanceTimersByTime(4000);
      });

      // Check second state (2 of 10)
      expect(carousel.props.accessibilityLabel).toBe('Caregiving illustration 2 of 10');
    });

    test('carousel has polite live region for screen readers', () => {
      renderWelcomeScreen();
      const carousel = screen.getByTestId('welcome_carousel');
      expect(carousel.props.accessibilityLiveRegion).toBe('polite');
    });
  });
});

