/**
 * Patients Context
 * Equivalent to Flutter's PatientsListScreen state management
 * 
 * Provides patient data and filtering functionality
 */

import React, { createContext, useContext, useState, useMemo } from 'react';
import PatientsRepository from '../repositories/PatientsRepository';

const PatientsContext = createContext();

export const PatientViewMode = {
  ALL: 'all',
  UPCOMING_VISITS: 'upcomingVisits',
  NEEDING_ATTENTION: 'needingAttention',
};

export const PatientsProvider = ({ children }) => {
  const [viewMode, setViewMode] = useState(PatientViewMode.ALL);
  const patientsRepository = new PatientsRepository();

  const getPatients = () => {
    switch (viewMode) {
      case PatientViewMode.NEEDING_ATTENTION:
        return patientsRepository.needingAttentionSorted();
      case PatientViewMode.UPCOMING_VISITS:
        return patientsRepository.upcomingVisitsSorted();
      case PatientViewMode.ALL:
      default:
        return patientsRepository.allPatients();
    }
  };

  const value = useMemo(
    () => ({
      viewMode,
      setViewMode,
      patients: getPatients(),
    }),
    [viewMode]
  );

  return (
    <PatientsContext.Provider value={value}>
      {children}
    </PatientsContext.Provider>
  );
};

export const usePatients = () => {
  const context = useContext(PatientsContext);
  if (!context) {
    throw new Error('usePatients must be used within a PatientsProvider');
  }
  return context;
};
