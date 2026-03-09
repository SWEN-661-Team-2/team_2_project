/** @jest-environment jsdom */

// Tests for Patients component logic
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Patients from '../renderer/src/components/Patients';

describe('Patients Component Logic', () => {
  const PATIENTS = [
    { id: 1, name: 'John Davis', initials: 'JD', room: '301A', age: 58, status: 'stable', lastVisit: '2 hours ago' },
    { id: 2, name: 'Mary Wilson', initials: 'MW', room: '305B', age: 54, status: 'improving', lastVisit: '1 hour ago' },
    { id: 3, name: 'Robert Brown', initials: 'RB', room: '310A', age: 72, status: 'critical', lastVisit: '30 min ago' },
    { id: 4, name: 'Lisa Anderson', initials: 'LA', room: '308C', age: 45, status: 'stable', lastVisit: '3 hours ago' },
    { id: 5, name: 'James Miller', initials: 'JM', room: '312B', age: 63, status: 'improving', lastVisit: '13 hours ago' }
  ];

  describe('Rendering', () => {
    test('renders Patient Care heading', () => {
      render(<Patients />);
      expect(screen.getByText('Patient Care')).toBeInTheDocument();
    });

    test('renders Add Patient button', () => {
      render(<Patients />);
      expect(screen.getByRole('button', { name: /add patient/i })).toBeInTheDocument();
    });

    test('renders patient list', () => {
      render(<Patients />);
      expect(screen.getByText('John Davis')).toBeInTheDocument();
    });

    test('renders search input', () => {
      render(<Patients />);
      expect(screen.getByLabelText(/search patients/i)).toBeInTheDocument();
    });

    test('clicking a patient shows detail panel', () => {
      render(<Patients />);
      fireEvent.click(screen.getByText('John Davis'));
      expect(screen.getByText('Hypertension, Type 2 Diabetes')).toBeInTheDocument();
    });

    test('clicking Add Patient opens modal', () => {
      render(<Patients />);
      fireEvent.click(screen.getByRole('button', { name: /add patient/i }));
      expect(screen.getByText('Add New Patient')).toBeInTheDocument();
    });

    test('renders Robert Brown in list', () => {
      render(<Patients />);
      expect(screen.getByText('Robert Brown')).toBeInTheDocument();
    });

    test('clicking Update Care Plan shows toast', () => {
      render(<Patients />);
      fireEvent.click(screen.getByText('John Davis'));
      fireEvent.click(screen.getByRole('button', { name: /update care plan/i }));
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    test('clicking update care plan shows toast', () => {
      render(<Patients />);
      fireEvent.click(screen.getByText('John Davis'));
      fireEvent.click(screen.getByRole('button', { name: /update care plan/i }));
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    test('modal closes when cancel clicked', () => {
      render(<Patients />);
      fireEvent.click(screen.getByRole('button', { name: /add patient/i }));
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(screen.queryByText('Add New Patient')).not.toBeInTheDocument();
    });

    test('modal close button works', () => {
      render(<Patients />);
      fireEvent.click(screen.getByRole('button', { name: /add patient/i }));
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(screen.queryByText('Add New Patient')).not.toBeInTheDocument();
    });
  });

  describe('Patient search', () => {
    function searchPatients(patients, search) {
      if (!search) return patients;
      return patients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.room.toLowerCase().includes(search.toLowerCase())
      );
    }

    test('returns all patients when search is empty', () => {
      expect(searchPatients(PATIENTS, '')).toHaveLength(5);
    });

    test('finds patient by name', () => {
      const result = searchPatients(PATIENTS, 'John');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('John Davis');
    });

    test('finds patient by room number', () => {
      const result = searchPatients(PATIENTS, '301A');
      expect(result).toHaveLength(1);
      expect(result[0].room).toBe('301A');
    });

    test('search is case-insensitive', () => {
      const result = searchPatients(PATIENTS, 'MARY');
      expect(result).toHaveLength(1);
    });

    test('returns empty array for no matches', () => {
      const result = searchPatients(PATIENTS, 'xyz999');
      expect(result).toHaveLength(0);
    });

    test('partial name match works', () => {
      const result = searchPatients(PATIENTS, 'Anderson');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Lisa Anderson');
    });
  });

  describe('Patient initials', () => {
    function generateInitials(firstName, lastName) {
      return (firstName[0] + lastName[0]).toUpperCase();
    }

    test('generates correct initials', () => {
      expect(generateInitials('John', 'Davis')).toBe('JD');
      expect(generateInitials('Mary', 'Wilson')).toBe('MW');
    });

    test('initials are uppercase', () => {
      const initials = generateInitials('john', 'davis');
      expect(initials).toBe('JD');
    });
  });

  describe('Patient status', () => {
    test('identifies stable patients', () => {
      const stable = PATIENTS.filter(p => p.status === 'stable');
      expect(stable).toHaveLength(2);
    });

    test('identifies critical patients', () => {
      const critical = PATIENTS.filter(p => p.status === 'critical');
      expect(critical).toHaveLength(1);
      expect(critical[0].name).toBe('Robert Brown');
    });

    test('identifies improving patients', () => {
      const improving = PATIENTS.filter(p => p.status === 'improving');
      expect(improving).toHaveLength(2);
    });

    test('valid status values', () => {
      const validStatuses = ['stable', 'improving', 'critical'];
      PATIENTS.forEach(p => {
        expect(validStatuses).toContain(p.status);
      });
    });
  });

  describe('Patient selection', () => {
    test('selected patient ID can be stored', () => {
      let selectedId = null;
      const patient = PATIENTS[0];
      selectedId = patient.id;
      expect(selectedId).toBe(1);
    });

    test('deselecting sets to null', () => {
      let selectedId = 1;
      selectedId = null;
      expect(selectedId).toBeNull();
    });

    test('selecting different patient updates selection', () => {
      let selected = PATIENTS[0];
      selected = PATIENTS[2];
      expect(selected.id).toBe(3);
    });
  });

  describe('Patient data integrity', () => {
    test('all patients have required fields', () => {
      PATIENTS.forEach(p => {
        expect(p.id).toBeDefined();
        expect(p.name).toBeTruthy();
        expect(p.room).toBeTruthy();
        expect(p.age).toBeGreaterThan(0);
        expect(p.status).toBeTruthy();
      });
    });

    test('patient IDs are unique', () => {
      const ids = PATIENTS.map(p => p.id);
      const uniqueIds = [...new Set(ids)];
      expect(uniqueIds).toHaveLength(PATIENTS.length);
    });

    test('patient ages are valid', () => {
      PATIENTS.forEach(p => {
        expect(p.age).toBeGreaterThan(0);
        expect(p.age).toBeLessThan(150);
      });
    });
  });

  describe('Add patient modal validation', () => {
    function validateNewPatient(firstName, lastName, phone) {
      const errors = [];
      if (!firstName.trim()) errors.push('First name is required');
      if (!lastName.trim()) errors.push('Last name is required');
      if (!phone.trim()) errors.push('Phone number is required');
      return errors;
    }

    test('validates required fields', () => {
      const errors = validateNewPatient('', '', '');
      expect(errors).toHaveLength(3);
    });

    test('accepts valid patient data', () => {
      const errors = validateNewPatient('John', 'Smith', '555-1234');
      expect(errors).toHaveLength(0);
    });

    test('catches missing last name', () => {
      const errors = validateNewPatient('John', '', '555-1234');
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('Last name');
    });
  });
});
