/**
 * Component Tests - PatientRow
 * Tests the PatientRow component rendering and interactions
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PatientRow from '../../src/screens/components/PatientRow';
import { Patient, PatientCriticality } from '../../src/models/Patient';

describe('PatientRow Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  describe('rendering', () => {
    test('renders patient name', () => {
      const patient = new Patient('John', 'Doe');
      const { getByText } = render(
        <PatientRow patient={patient} onPress={mockOnPress} />
      );

      expect(getByText('John Doe')).toBeTruthy();
    });

    test('renders patient with criticality', () => {
      const patient = new Patient('Jane', 'Smith', PatientCriticality.HIGH);
      const { getByText } = render(
        <PatientRow patient={patient} onPress={mockOnPress} />
      );

      expect(getByText('Jane Smith')).toBeTruthy();
    });

    test('renders patient with next visit date', () => {
      const nextVisit = new Date('2024-03-20');
      const patient = new Patient('Bob', 'Johnson', PatientCriticality.MEDIUM, nextVisit);
      const { getByText } = render(
        <PatientRow patient={patient} onPress={mockOnPress} />
      );

      expect(getByText('Bob Johnson')).toBeTruthy();
    });
  });

  describe('interactions', () => {
    test('calls onPress when tapped', () => {
      const patient = new Patient('Alice', 'Brown');
      const { getByText } = render(
        <PatientRow patient={patient} onPress={mockOnPress} />
      );

      fireEvent.press(getByText('Alice Brown'));

      expect(mockOnPress).toHaveBeenCalledTimes(1);
      expect(mockOnPress).toHaveBeenCalledWith(patient);
    });

    test('handles multiple taps', () => {
      const patient = new Patient('Charlie', 'Wilson');
      const { getByText } = render(
        <PatientRow patient={patient} onPress={mockOnPress} />
      );

      const row = getByText('Charlie Wilson');
      fireEvent.press(row);
      fireEvent.press(row);
      fireEvent.press(row);

      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });
  });
});
