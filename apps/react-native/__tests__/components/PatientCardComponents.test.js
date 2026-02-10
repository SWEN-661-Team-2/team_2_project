/**
 * Component Tests - PatientCardComponents
 * Tests the patient card components (Priority, Visit, standard)
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PriorityPatientCard, { VisitPatientCard, PatientCard } from '../../src/screens/components/PatientCardComponents';
import Patient, { PatientCriticality } from '../../src/models/Patient';

const mockPatient = new Patient({
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: new Date('1950-01-15'),
  criticality: PatientCriticality.high,
  nextVisit: new Date('2024-04-01T10:00:00'),
});

const mockOnPress = jest.fn();

describe('PriorityPatientCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    test('renders patient name', () => {
      const { getByText } = render(
        <PriorityPatientCard patient={mockPatient} index={0} onPress={mockOnPress} />
      );

      expect(getByText('John Doe')).toBeTruthy();
    });

    test('displays next visit date', () => {
      const { getByText } = render(
        <PriorityPatientCard patient={mockPatient} index={0} onPress={mockOnPress} />
      );

      expect(getByText(/Visit:/)).toBeTruthy();
    });

    test('shows criticality tag', () => {
      const { getByText } = render(
        <PriorityPatientCard patient={mockPatient} index={0} onPress={mockOnPress} />
      );

      expect(getByText(/HIGH/i)).toBeTruthy();
    });

    test('handles patient without visit', () => {
      const patientNoVisit = new Patient({
        ...mockPatient,
        nextVisit: null,
      });

      const { getByText } = render(
        <PriorityPatientCard patient={patientNoVisit} index={0} onPress={mockOnPress} />
      );

      expect(getByText(/No upcoming visit/i)).toBeTruthy();
    });
  });

  describe('interaction', () => {
    test('calls onPress when card is pressed', () => {
      const { getByTestId } = render(
        <PriorityPatientCard patient={mockPatient} index={0} onPress={mockOnPress} />
      );

      fireEvent.press(getByTestId('patient_card_0'));
      expect(mockOnPress).toHaveBeenCalled();
    });
  });

  describe('criticality colors', () => {
    test('displays critical patient with critical styling', () => {
      const criticalPatient = new Patient({
        ...mockPatient,
        criticality: PatientCriticality.critical,
      });

      const { getByText } = render(
        <PriorityPatientCard patient={criticalPatient} index={0} onPress={mockOnPress} />
      );

      expect(getByText(/CRITICAL/i)).toBeTruthy();
    });

    test('displays medium criticality patient', () => {
      const mediumPatient = new Patient({
        ...mockPatient,
        criticality: PatientCriticality.medium,
      });

      const { getByText } = render(
        <PriorityPatientCard patient={mediumPatient} index={0} onPress={mockOnPress} />
      );

      expect(getByText(/MEDIUM/i)).toBeTruthy();
    });

    test('displays low criticality patient', () => {
      const lowPatient = new Patient({
        ...mockPatient,
        criticality: PatientCriticality.low,
      });

      const { getByText } = render(
        <PriorityPatientCard patient={lowPatient} index={0} onPress={mockOnPress} />
      );

      expect(getByText(/LOW/i)).toBeTruthy();
    });
  });
});

describe('VisitPatientCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    test('renders patient name', () => {
      const { getByText } = render(
        <VisitPatientCard patient={mockPatient} index={0} onPress={mockOnPress} />
      );

      expect(getByText('John Doe')).toBeTruthy();
    });

    test('displays visit date', () => {
      const { getByText } = render(
        <VisitPatientCard patient={mockPatient} index={0} onPress={mockOnPress} />
      );

      expect(getByText(/2024-04-01/)).toBeTruthy();
    });
  });

  describe('interaction', () => {
    test('calls onPress when card is pressed', () => {
      const { getByTestId } = render(
        <VisitPatientCard patient={mockPatient} index={0} onPress={mockOnPress} />
      );

      fireEvent.press(getByTestId('visit_card_0'));
      expect(mockOnPress).toHaveBeenCalled();
    });
  });
});

describe('PatientCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    test('renders patient name', () => {
      const { getByText } = render(
        <PatientCard patient={mockPatient} index={0} onPress={mockOnPress} />
      );

      expect(getByText('John Doe')).toBeTruthy();
    });

    test('displays patient age', () => {
      const { getByText } = render(
        <PatientCard patient={mockPatient} index={0} onPress={mockOnPress} />
      );

      expect(getByText(/years old/i)).toBeTruthy();
    });

    test('shows criticality', () => {
      const { getByText } = render(
        <PatientCard patient={mockPatient} index={0} onPress={mockOnPress} />
      );

      expect(getByText(/HIGH/i)).toBeTruthy();
    });
  });

  describe('interaction', () => {
    test('calls onPress when card is pressed', () => {
      const { getByTestId } = render(
        <PatientCard patient={mockPatient} index={0} onPress={mockOnPress} />
      );

      fireEvent.press(getByTestId('all_patient_card_0'));
      expect(mockOnPress).toHaveBeenCalled();
    });
  });
});
