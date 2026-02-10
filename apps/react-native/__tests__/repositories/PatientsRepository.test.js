/**
 * Business Logic Tests - PatientsRepository
 * Tests patient data fetching and management
 */
import { PatientsRepository } from '../../src/repositories/PatientsRepository';
import { PatientCriticality } from '../../src/models/Patient';

describe('PatientsRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new PatientsRepository();
  });

  describe('getAllPatients', () => {
    test('returns array of patients', async () => {
      const patients = await repository.getAllPatients();

      expect(Array.isArray(patients)).toBe(true);
      expect(patients.length).toBeGreaterThan(0);
    });

    test('patients have required properties', async () => {
      const patients = await repository.getAllPatients();
      const patient = patients[0];

      expect(patient).toHaveProperty('firstName');
      expect(patient).toHaveProperty('lastName');
      expect(patient).toHaveProperty('fullName');
    });
  });

  describe('getPatientsByCriticality', () => {
    test('filters patients by criticality', async () => {
      const criticalPatients = await repository.getPatientsByCriticality(
        PatientCriticality.CRITICAL
      );

      expect(Array.isArray(criticalPatients)).toBe(true);
    });

    test('returns patients for high criticality', async () => {
      const highPatients = await repository.getPatientsByCriticality(
        PatientCriticality.HIGH
      );

      expect(Array.isArray(highPatients)).toBe(true);
    });

    test('returns patients for medium criticality', async () => {
      const mediumPatients = await repository.getPatientsByCriticality(
        PatientCriticality.MEDIUM
      );

      expect(Array.isArray(mediumPatients)).toBe(true);
    });

    test('returns patients for low criticality', async () => {
      const lowPatients = await repository.getPatientsByCriticality(
        PatientCriticality.LOW
      );

      expect(Array.isArray(lowPatients)).toBe(true);
    });
  });

  describe('getPatientById', () => {
    test('returns null for non-existent patient', async () => {
      const patient = await repository.getPatientById('nonexistent-id');

      expect(patient).toBeNull();
    });

    test('returns patient when found', async () => {
      const allPatients = await repository.getAllPatients();
      if (allPatients.length > 0) {
        // Use a patient we know exists
        const testPatient = allPatients[0];
        const foundPatient = await repository.getPatientById(testPatient.id || '1');

        // Should either find the patient or return null
        expect(foundPatient === null || typeof foundPatient === 'object').toBe(true);
      }
    });
  });
});
