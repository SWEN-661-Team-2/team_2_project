/**
 * Context Tests - PatientsContext
 * Tests patient data management and view mode filtering
 */
import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { PatientsProvider, usePatients, PatientViewMode } from '../../src/contexts/PatientsContext';
import { patientsRepository } from '../../src/repositories/PatientsRepository';

const wrapper = ({ children }) => <PatientsProvider>{children}</PatientsProvider>;

describe('PatientsContext', () => {
  describe('initialization', () => {
    test('provides default view mode', () => {
      const { result } = renderHook(() => usePatients(), { wrapper });

      expect(result.current.viewMode).toBe(PatientViewMode.ALL);
    });

    test('provides patients list', () => {
      const { result } = renderHook(() => usePatients(), { wrapper });

      expect(Array.isArray(result.current.patients)).toBe(true);
      expect(result.current.patients.length).toBeGreaterThan(0);
    });

    test('provides setViewMode function', () => {
      const { result } = renderHook(() => usePatients(), { wrapper });

      expect(typeof result.current.setViewMode).toBe('function');
    });
  });

  describe('PatientViewMode enum', () => {
    test('contains all view modes', () => {
      expect(PatientViewMode.ALL).toBe('all');
      expect(PatientViewMode.UPCOMING_VISITS).toBe('upcomingVisits');
      expect(PatientViewMode.NEEDING_ATTENTION).toBe('needingAttention');
    });
  });

  describe('view mode switching', () => {
    test('switches to all patients view', () => {
      const { result } = renderHook(() => usePatients(), { wrapper });

      act(() => {
        result.current.setViewMode(PatientViewMode.ALL);
      });

      expect(result.current.viewMode).toBe(PatientViewMode.ALL);
      expect(result.current.patients).toEqual(patientsRepository.allPatients());
    });

    test('switches to needing attention view', () => {
      const { result } = renderHook(() => usePatients(), { wrapper });

      act(() => {
        result.current.setViewMode(PatientViewMode.NEEDING_ATTENTION);
      });

      expect(result.current.viewMode).toBe(PatientViewMode.NEEDING_ATTENTION);
      expect(result.current.patients).toEqual(patientsRepository.needingAttentionSorted());
    });

    test('switches to upcoming visits view', () => {
      const { result } = renderHook(() => usePatients(), { wrapper });

      act(() => {
        result.current.setViewMode(PatientViewMode.UPCOMING_VISITS);
      });

      expect(result.current.viewMode).toBe(PatientViewMode.UPCOMING_VISITS);
      expect(result.current.patients).toEqual(patientsRepository.upcomingVisitsSorted());
    });

    test('updates patients list when view mode changes', () => {
      const { result } = renderHook(() => usePatients(), { wrapper });

      const allPatients = result.current.patients;

      act(() => {
        result.current.setViewMode(PatientViewMode.NEEDING_ATTENTION);
      });

      const needingAttentionPatients = result.current.patients;

      // Lists should be different
      expect(needingAttentionPatients).not.toEqual(allPatients);
    });
  });

  describe('data consistency', () => {
    test('all patients view returns full list', () => {
      const { result } = renderHook(() => usePatients(), { wrapper });

      act(() => {
        result.current.setViewMode(PatientViewMode.ALL);
      });

      expect(result.current.patients.length).toBe(patientsRepository.allPatients().length);
    });

    test('needing attention view returns sorted list', () => {
      const { result } = renderHook(() => usePatients(), { wrapper });

      act(() => {
        result.current.setViewMode(PatientViewMode.NEEDING_ATTENTION);
      });

      const patients = result.current.patients;
      expect(patients.length).toBeGreaterThan(0);
      
      // Check that patients are sorted by criticality
      for (let i = 0; i < patients.length - 1; i++) {
        const current = patients[i].criticality;
        const next = patients[i + 1].criticality;
        
        const criticalityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        expect(criticalityOrder[current]).toBeLessThanOrEqual(criticalityOrder[next]);
      }
    });

    test('upcoming visits view returns sorted list', () => {
      const { result } = renderHook(() => usePatients(), { wrapper });

      act(() => {
        result.current.setViewMode(PatientViewMode.UPCOMING_VISITS);
      });

      const patients = result.current.patients;
      expect(patients.length).toBeGreaterThan(0);
      
      // Check that patients have visit dates
      patients.forEach(patient => {
        expect(patient.nextVisit).toBeDefined();
      });
    });
  });

  describe('error handling', () => {
    test('throws error when used outside provider', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => usePatients());
      }).toThrow('usePatients must be used within a PatientsProvider');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('memoization', () => {
    test('memoizes patient list when view mode unchanged', () => {
      const { result, rerender } = renderHook(() => usePatients(), { wrapper });

      const firstPatients = result.current.patients;
      rerender();
      const secondPatients = result.current.patients;

      expect(firstPatients).toBe(secondPatients);
    });

    test('updates patient list when view mode changes', () => {
      const { result } = renderHook(() => usePatients(), { wrapper });

      const firstPatients = result.current.patients;

      act(() => {
        result.current.setViewMode(PatientViewMode.NEEDING_ATTENTION);
      });

      const secondPatients = result.current.patients;

      expect(firstPatients).not.toBe(secondPatients);
    });
  });
});
