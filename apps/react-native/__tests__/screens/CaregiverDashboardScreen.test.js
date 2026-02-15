/**
 * Component Tests - CaregiverDashboardScreen
 * Tests dashboard rendering, stats display, and responsive layout
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Dimensions } from 'react-native';
import CaregiverDashboardScreen from '../../src/screens/CaregiverDashboardScreen';
import { DashboardProvider } from '../../src/contexts/DashboardContext';
import { PatientsProvider } from '../../src/contexts/PatientsContext';
import { AppProviders } from '../../src/contexts/AppProviders';

const mockNavigation = {
  navigate: jest.fn(),
  setOptions: jest.fn(),
};

const renderDashboard = () => {
  return render(
    <AppProviders>
      <PatientsProvider>
        <DashboardProvider>
          <CaregiverDashboardScreen navigation={mockNavigation} />
        </DashboardProvider>
      </PatientsProvider>
    </AppProviders>
  );
};

describe('CaregiverDashboardScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    test('renders dashboard title', () => {
      const { getByText } = renderDashboard();

      expect(getByText('CareConnect')).toBeTruthy();
    });

    test('renders stat cards', () => {
      const { getByText, getAllByText } = renderDashboard();

      expect(getByText('Active Patients')).toBeTruthy();
      const upcomingMatches = getAllByText('Upcoming Visits');
      expect(upcomingMatches.length).toBeGreaterThan(0);
    });
  });

  describe('statistics cards', () => {
    test('renders stat cards when dashboard loads', async () => {
      const { getByText } = renderDashboard();

      await waitFor(() => {
        // Look for common stat labels
        expect(getByText(/Active Patients/i) || getByText(/Total Patients/i)).toBeTruthy();
      });
    });
  });

  describe('patients section', () => {
    test('renders patients needing attention section', async () => {
      const { getAllByText } = renderDashboard();

      await waitFor(() => {
        const matches = getAllByText(/Patients Needing Attention/i);
        expect(matches.length).toBeGreaterThan(0);
      });
    });
  });

  describe('responsive layout', () => {
    test('renders on tablet layout (width >= 600)', () => {
      // Mock large screen
      jest.spyOn(Dimensions, 'get').mockReturnValue({
        width: 900,
        height: 900,
        scale: 1,
        fontScale: 1,
      });

      const { getByText } = renderDashboard();

      expect(getByText('CareConnect')).toBeTruthy();
    });

    test('renders on phone layout (width < 600)', () => {
      // Mock small screen
      jest.spyOn(Dimensions, 'get').mockReturnValue({
        width: 390,
        height: 844,
        scale: 3,
        fontScale: 1,
      });

      const { getByText } = renderDashboard();

      expect(getByText('CareConnect')).toBeTruthy();
    });
  });

  describe('upcoming visits section', () => {
    test('renders upcoming visits section', async () => {
      const { getAllByText } = renderDashboard();

      await waitFor(() => {
        // Check for section header or stat card
        const matches = getAllByText(/Upcoming Visits/i);
        expect(matches.length).toBeGreaterThan(0);
      });
    });
  });
});
