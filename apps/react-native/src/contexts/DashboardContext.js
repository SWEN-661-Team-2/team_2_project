/**
 * Dashboard Context
 * Manages dashboard state and operations
 * Equivalent to Flutter's dashboard providers
 */

import React, { createContext, useContext } from 'react';
import { patientsRepository } from '../repositories/PatientsRepository';
import { messagesRepository } from '../repositories/MessagesRepository';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

export function DashboardProvider({ children }) {
  // Get data from repositories
  const allPatients = patientsRepository.allPatients();
  const needingAttention = patientsRepository.topNeedingAttention(3);
  const upcomingVisits = patientsRepository.topUpcomingVisits(3);
  const unreadMessageCount = messagesRepository.unreadCount();

  const value = {
    // Data
    allPatients,
    needingAttention,
    upcomingVisits,
    unreadMessageCount,

    // Statistics
    totalPatients: patientsRepository.allPatients().length,
    totalUpcomingVisits: patientsRepository.upcomingVisitsSorted().length,
    totalNeedingAttention: patientsRepository.needingAttentionSorted().length,

    // Repository access
    patientsRepository,
    messagesRepository,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
