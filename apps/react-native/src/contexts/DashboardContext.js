// /src/contexts/DashboardContext.js
import React, { createContext, useContext, useMemo } from 'react';
import { patientsRepository } from '../repositories/PatientsRepository';
import { messagesRepository } from '../repositories/MessagesRepository';

const DashboardContext = createContext(null);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within DashboardProvider');
  return context;
};

export function DashboardProvider({ children }) {
  const value = useMemo(() => {
    const allPatients = patientsRepository.allPatients();
    const upcomingVisits = patientsRepository.upcomingVisitsSorted();        // FULL
    const needingAttention = patientsRepository.needingAttentionSorted();    // FULL

    return {
      // Full lists (for counts + filtering)
      allPatients,
      upcomingVisits,
      needingAttention,

      // Top 3 (for preview cards)
      upcomingTop3: patientsRepository.topUpcomingVisits(3),
      needingTop3: patientsRepository.topNeedingAttention(3),

      // Messages
      unreadMessageCount: messagesRepository.unreadCount(),

      // Stats (optional, but fine)
      totalPatients: allPatients.length,
      totalUpcomingVisits: upcomingVisits.length,
      totalNeedingAttention: needingAttention.length,

      // Repository access (optional)
      patientsRepository,
      messagesRepository,
    };
  }, []);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
