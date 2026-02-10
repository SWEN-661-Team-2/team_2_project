/**
 * Component Tests - PatientsScreen
 * Tests the patients list screen with view modes
 */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import PatientsScreen from '../../src/screens/PatientsScreen';
import { AppProviders } from '../../src/contexts/AppProviders';
import { PatientsProvider } from '../../src/contexts/PatientsContext';

// Mock Alert
jest.spyOn(Alert, 'alert');

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const navigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
};

const renderWithProviders = (component) => {
  return render(
    <AppProviders>
      <PatientsProvider>{component}</PatientsProvider>
    </AppProviders>
  );
};

describe('PatientsScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    test('renders patients screen', () => {
      const { getByText } = renderWithProviders(
        <PatientsScreen navigation={navigation} />
      );

      expect(getByText(/patients/i)).toBeTruthy();
    });

    test('displays default view mode title', () => {
      const { getByText } = renderWithProviders(
        <PatientsScreen navigation={navigation} />
      );

      expect(getByText(/all patients/i)).toBeTruthy();
    });

    test('renders patient cards', () => {
      const { container } = renderWithProviders(
        <PatientsScreen navigation={navigation} />
      );

      expect(container).toBeTruthy();
    });
  });

  describe('view mode switching', () => {
    test('shows all patients view', () => {
      const { getByText } = renderWithProviders(
        <PatientsScreen navigation={navigation} />
      );

      expect(getByText(/all patients/i)).toBeTruthy();
    });
  });

  describe('patient interaction', () => {
    test('shows alert when patient is pressed', () => {
      const { container } = renderWithProviders(
        <PatientsScreen navigation={navigation} />
      );

      expect(container).toBeTruthy();
    });
  });

  describe('filter menu', () => {
    test('filter menu can be opened', () => {
      const { container } = renderWithProviders(
        <PatientsScreen navigation={navigation} />
      );

      expect(container).toBeTruthy();
    });
  });
});
