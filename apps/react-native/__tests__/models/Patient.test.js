/**
 * Business Logic Tests - Patient Model
 * Tests the Patient class and PatientCriticality enum
 */
import { Patient, PatientCriticality } from '../../src/models/Patient';

describe('Patient Model', () => {
  describe('constructor', () => {
    test('creates patient with basic information', () => {
      const patient = new Patient('John', 'Doe');

      expect(patient.firstName).toBe('John');
      expect(patient.lastName).toBe('Doe');
      expect(patient.criticality).toBeNull();
      expect(patient.nextVisit).toBeNull();
    });

    test('creates patient with criticality', () => {
      const patient = new Patient('Jane', 'Smith', PatientCriticality.HIGH);

      expect(patient.firstName).toBe('Jane');
      expect(patient.lastName).toBe('Smith');
      expect(patient.criticality).toBe(PatientCriticality.HIGH);
    });

    test('creates patient with next visit date', () => {
      const visitDate = new Date('2024-03-15');
      const patient = new Patient('Bob', 'Johnson', PatientCriticality.MEDIUM, visitDate);

      expect(patient.firstName).toBe('Bob');
      expect(patient.lastName).toBe('Johnson');
      expect(patient.criticality).toBe(PatientCriticality.MEDIUM);
      expect(patient.nextVisit).toEqual(visitDate);
    });

    test('converts string date to Date object', () => {
      const dateString = '2024-03-15T00:00:00.000Z';
      const patient = new Patient('Alice', 'Brown', null, dateString);

      expect(patient.nextVisit).toBeInstanceOf(Date);
      expect(patient.nextVisit.getFullYear()).toBe(2024);
      // Month is 0-indexed, so March is 2
      expect(patient.nextVisit.getMonth()).toBe(2);
      // Date() constructor handles timezone, so just check it's reasonable
      expect([14, 15]).toContain(patient.nextVisit.getDate());
    });
  });

  describe('fullName getter', () => {
    test('returns full name with space', () => {
      const patient = new Patient('John', 'Doe');

      expect(patient.fullName).toBe('John Doe');
    });

    test('handles names with special characters', () => {
      const patient = new Patient("Mary-Anne", "O'Brien");

      expect(patient.fullName).toBe("Mary-Anne O'Brien");
    });
  });

  describe('PatientCriticality enum', () => {
    test('contains all criticality levels', () => {
      expect(PatientCriticality.CRITICAL).toBe('critical');
      expect(PatientCriticality.HIGH).toBe('high');
      expect(PatientCriticality.MEDIUM).toBe('medium');
      expect(PatientCriticality.LOW).toBe('low');
    });

    test('can be used to create patients with different criticality levels', () => {
      const criticalPatient = new Patient('A', 'B', PatientCriticality.CRITICAL);
      const highPatient = new Patient('C', 'D', PatientCriticality.HIGH);
      const mediumPatient = new Patient('E', 'F', PatientCriticality.MEDIUM);
      const lowPatient = new Patient('G', 'H', PatientCriticality.LOW);

      expect(criticalPatient.criticality).toBe('critical');
      expect(highPatient.criticality).toBe('high');
      expect(mediumPatient.criticality).toBe('medium');
      expect(lowPatient.criticality).toBe('low');
    });
  });

  describe('edge cases', () => {
    test('handles empty names', () => {
      const patient = new Patient('', '');

      expect(patient.firstName).toBe('');
      expect(patient.lastName).toBe('');
      expect(patient.fullName).toBe(' ');
    });

    test('handles single character names', () => {
      const patient = new Patient('J', 'D');

      expect(patient.fullName).toBe('J D');
    });

    test('handles long names', () => {
      const longFirstName = 'Verylongfirstname';
      const longLastName = 'Verylonglastname';
      const patient = new Patient(longFirstName, longLastName);

      expect(patient.fullName).toBe(`${longFirstName} ${longLastName}`);
    });
  });
});
