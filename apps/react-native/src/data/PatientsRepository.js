// Patient criticality levels
export const PatientCriticality = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

// Sample patient data
export class PatientsRepository {
  static instance = new PatientsRepository();

  patients = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      criticality: PatientCriticality.CRITICAL,
      nextVisit: new Date('2026-02-10T10:00:00'),
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      fullName: 'Jane Smith',
      criticality: PatientCriticality.HIGH,
      nextVisit: new Date('2026-02-11T14:00:00'),
    },
    {
      id: '3',
      firstName: 'Bob',
      lastName: 'Johnson',
      fullName: 'Bob Johnson',
      criticality: PatientCriticality.MEDIUM,
      nextVisit: new Date('2026-02-12T09:00:00'),
    },
    {
      id: '4',
      firstName: 'Alice',
      lastName: 'Williams',
      fullName: 'Alice Williams',
      criticality: PatientCriticality.HIGH,
      nextVisit: new Date('2026-02-13T15:30:00'),
    },
    {
      id: '5',
      firstName: 'Charlie',
      lastName: 'Brown',
      fullName: 'Charlie Brown',
      criticality: PatientCriticality.LOW,
      nextVisit: new Date('2026-02-15T11:00:00'),
    },
  ];

  allPatients() {
    return this.patients;
  }

  needingAttentionSorted() {
    return [...this.patients].sort((a, b) => {
      const order = {
        critical: 0,
        high: 1,
        medium: 2,
        low: 3,
      };
      return order[a.criticality] - order[b.criticality];
    });
  }

  topNeedingAttention(n) {
    return this.needingAttentionSorted().slice(0, n);
  }

  upcomingVisitsSorted() {
    return [...this.patients].sort((a, b) => 
      a.nextVisit.getTime() - b.nextVisit.getTime()
    );
  }

  topUpcomingVisits(n) {
    return this.upcomingVisitsSorted().slice(0, n);
  }
}

// Helper functions
export const getCriticalityText = (criticality) => {
  switch (criticality) {
    case PatientCriticality.CRITICAL: return 'Critical';
    case PatientCriticality.HIGH: return 'High';
    case PatientCriticality.MEDIUM: return 'Medium';
    case PatientCriticality.LOW: return 'Low';
    default: return '—';
  }
};

export const getCriticalityTag = (criticality) => {
  switch (criticality) {
    case PatientCriticality.CRITICAL: return 'CRITICAL';
    case PatientCriticality.HIGH: return 'HIGH';
    case PatientCriticality.MEDIUM: return 'MED';
    case PatientCriticality.LOW: return 'LOW';
    default: return '—';
  }
};

export const getCriticalityColor = (criticality) => {
  switch (criticality) {
    case PatientCriticality.CRITICAL: return '#ef4444';
    case PatientCriticality.HIGH: return '#f97316';
    case PatientCriticality.MEDIUM: return '#64748b';
    case PatientCriticality.LOW: return '#10b981';
    default: return '#6b7280';
  }
};
