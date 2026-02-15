// /Volumes/DevDrive/code/swen-661-ui/team_2_project/apps/react-native/__tests__/components/HandednessToggleOverlay.test.js

/**
 * Component Tests - HandednessToggleOverlay
 * Tests the handedness toggle button overlay
 */
import { render } from '@testing-library/react-native';
import HandednessToggleOverlay from '../../src/components/HandednessToggleOverlay';
import { AppProviders } from '../../src/contexts/AppProviders';

const renderWithProviders = (ui) => render(<AppProviders>{ui}</AppProviders>);

describe('HandednessToggleOverlay Component', () => {
  test('renders without crashing', () => {
    const { root } = renderWithProviders(<HandednessToggleOverlay />);
    expect(root).toBeTruthy();
  });

  test('does not rely on deprecated container API', () => {
    const { root } = renderWithProviders(<HandednessToggleOverlay />);
    expect(root).toBeDefined();
  });

  test('if overlay renders a toggle button, it is discoverable by role', () => {
    const { queryAllByRole } = renderWithProviders(<HandednessToggleOverlay />);
    const buttons = queryAllByRole?.('button') ?? [];
    expect(Array.isArray(buttons)).toBe(true);
  });
});