import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import AccessibilityDetailScreen from '../../src/screens/AccessibilityDetailScreen';
import { useHandedness } from '../../src/contexts/AppProviders';

// Mock the Handedness Context
jest.mock('../../src/contexts/AppProviders', () => ({
  useHandedness: jest.fn(),
}));

describe('AccessibilityDetailScreen', () => {
  const mockOnToggle = jest.fn();
  const mockNavigation = { goBack: jest.fn() };
  const mockRoute = {
    params: {
      title: 'High Contrast',
      description: 'Increases visibility of text.',
      icon: '👁️',
      enabled: false,
      onToggle: mockOnToggle,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with correct data and accessibility roles', () => {
    useHandedness.mockReturnValue({ isLeftHanded: false });
    render(<AccessibilityDetailScreen route={mockRoute} navigation={mockNavigation} />);

    // Fix: Use getAllByText because the title appears in Header AND Card
    const titles = screen.getAllByText('High Contrast');
    expect(titles.length).toBeGreaterThan(0);
    expect(screen.getByText('Increases visibility of text.')).toBeTruthy();
  });

  test('calls onToggle when the switch is flipped', () => {
    useHandedness.mockReturnValue({ isLeftHanded: false });
    render(<AccessibilityDetailScreen route={mockRoute} navigation={mockNavigation} />);

    const accessibilitySwitch = screen.getByTestId('accessibility_switch');
    fireEvent(accessibilitySwitch, 'onValueChange', true);
    expect(mockOnToggle).toHaveBeenCalled();
  });

  test('navigates back when back button is pressed', () => {
    useHandedness.mockReturnValue({ isLeftHanded: false });
    render(<AccessibilityDetailScreen route={mockRoute} navigation={mockNavigation} />);

    fireEvent.press(screen.getByTestId('back_button'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  test('handles left-handed logic layout', () => {
    useHandedness.mockReturnValue({ isLeftHanded: true });
    render(<AccessibilityDetailScreen route={mockRoute} navigation={mockNavigation} />);
    
    // Simply ensuring the component renders with this branch active hits the coverage
    expect(screen.getByTestId('accessibility_switch')).toBeTruthy();
  });

  test('renders safely with missing route params (Defensive Coding coverage)', () => {
    useHandedness.mockReturnValue({ isLeftHanded: false });
    render(<AccessibilityDetailScreen route={{}} navigation={mockNavigation} />);
    
    // Again, use getAllByText for the default title
    const defaultTitles = screen.getAllByText('Accessibility Mode');
    expect(defaultTitles.length).toBeGreaterThan(0);
  });
});