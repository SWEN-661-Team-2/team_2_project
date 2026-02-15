import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { 
  PriorityPatientCard, 
  VisitPatientCard, 
  PatientCard 
} from '../../src/screens/components/PatientCardComponents'; // Path matched to coverage report
import { PatientCriticality } from '../../src/models/Patient';

// Mock the date formatter
jest.mock('../../src/utils/dtFormat', () => ({
  formatDtYmdHmm: jest.fn(() => '2026-02-14 15:30'),
}));

describe('Patient Card Components Coverage', () => {
  const mockPatient = {
    fullName: 'John Doe',
    criticality: PatientCriticality.CRITICAL,
    nextVisit: new Date('2026-02-14T15:30:00'),
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PriorityPatientCard', () => {
    it('renders and matches accessibility requirements', () => {
      const { getByTestId } = render(
        <PriorityPatientCard patient={mockPatient} index={0} onPress={mockOnPress} />
      );
      const card = getByTestId('patient_card_0');

      expect(card.props.accessibilityLabel).toBe(
        'Priority Patient: John Doe. Status: Critical. Visit: 2026-02-14 15:30.'
      );
      
      fireEvent.press(card);
      expect(mockOnPress).toHaveBeenCalled();
    });
  });

  describe('VisitPatientCard', () => {
    it('handles null visit dates for accessibility', () => {
      const noVisitPatient = { ...mockPatient, nextVisit: null };
      const { getByTestId } = render(
        <VisitPatientCard patient={noVisitPatient} index={1} onPress={mockOnPress} />
      );
      
      const card = getByTestId('patient_card_1');
      expect(card.props.accessibilityLabel).toContain('No upcoming visit');
    });
  });

  describe('PatientCard (Default View)', () => {
    it('shows full criticality text', () => {
      const { getByText } = render(
        <PatientCard patient={mockPatient} index={2} onPress={mockOnPress} />
      );
      expect(getByText('Critical')).toBeTruthy();
    });
  });

  describe('Utility Logic Branches', () => {
    const statuses = [
      { level: PatientCriticality.HIGH, label: 'High' },
      { level: PatientCriticality.MEDIUM, label: 'Medium' },
      { level: PatientCriticality.LOW, label: 'Low' },
      { level: 'UNKNOWN', label: '—' }
    ];

    statuses.forEach(({ level, label }) => {
      it(`handles status: ${level}`, () => {
        const patient = { ...mockPatient, criticality: level };
        const { getByText } = render(
          <PatientCard patient={patient} index={0} onPress={mockOnPress} />
        );
        expect(getByText(label)).toBeTruthy();
      });
    });
  });
});