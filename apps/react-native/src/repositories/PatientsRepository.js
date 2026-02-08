/**
 * Patients Repository
 * Equivalent to Flutter's PatientsRepository
 * 
 * Manages patient data and provides sorting/filtering methods
 */

import { Patient, PatientCriticality } from '../models/Patient';

class PatientsRepository {
  constructor() {
    this._patients = [
      // --- OVERLAP (6): needing attention + upcoming appointment ---
      new Patient(
        'Sarah',
        'Johnson',
        PatientCriticality.CRITICAL,
        new Date(2026, 1, 1, 9, 0)
      ),
      new Patient(
        'Michael',
        'Chen',
        PatientCriticality.CRITICAL,
        new Date(2026, 0, 31, 21, 0)
      ),
      new Patient(
        'Emma',
        'Williams',
        PatientCriticality.HIGH,
        new Date(2026, 1, 2, 14, 30)
      ),
      new Patient(
        'David',
        'Nguyen',
        PatientCriticality.HIGH,
        new Date(2026, 1, 3, 10, 15)
      ),
      new Patient(
        'Priya',
        'Patel',
        PatientCriticality.MEDIUM,
        new Date(2026, 1, 4, 16, 45)
      ),
      new Patient(
        'Robert',
        'King',
        PatientCriticality.LOW,
        new Date(2026, 1, 5, 11, 30)
      ),

      // --- needing attention ONLY (4 more) ---
      new Patient('Amina', 'Hassan', PatientCriticality.CRITICAL, null),
      new Patient('Carlos', 'Rivera', PatientCriticality.HIGH, null),
      new Patient('Linda', 'Baker', PatientCriticality.MEDIUM, null),
      new Patient('Noah', 'Brooks', PatientCriticality.LOW, null),

      // --- upcoming visits ONLY (6 more) ---
      new Patient('Anna', 'Lopez', null, new Date(2026, 1, 1, 14, 30)),
      new Patient('Mark', 'Lee', null, new Date(2026, 1, 1, 16, 0)),
      new Patient('Zoe', 'Adams', null, new Date(2026, 1, 2, 8, 15)),
      new Patient('James', 'Stewart', null, new Date(2026, 1, 2, 9, 45)),
      new Patient('Mia', 'Carter', null, new Date(2026, 1, 3, 13, 0)),
      new Patient('Ethan', 'Turner', null, new Date(2026, 1, 4, 15, 15)),
    ];
  }

  allPatients() {
    return [...this._patients];
  }

  needingAttentionSorted() {
    const items = this._patients.filter(p => p.criticality !== null);

    items.sort((a, b) => {
      const critRankA = this._critRank(a.criticality);
      const critRankB = this._critRank(b.criticality);
      const critCompare = critRankA - critRankB;
      if (critCompare !== 0) return critCompare;

      // If both have visits, sort by visit time
      if (a.nextVisit && b.nextVisit) {
        const visitCompare = a.nextVisit.getTime() - b.nextVisit.getTime();
        if (visitCompare !== 0) return visitCompare;
      } else if (a.nextVisit && !b.nextVisit) {
        return -1;
      } else if (!a.nextVisit && b.nextVisit) {
        return 1;
      }

      // Sort by last name
      const lastNameCompare = a.lastName.localeCompare(b.lastName);
      if (lastNameCompare !== 0) return lastNameCompare;
      return a.firstName.localeCompare(b.firstName);
    });

    return items;
  }

  upcomingVisitsSorted() {
    const items = this._patients.filter(p => p.nextVisit !== null);

    items.sort((a, b) => {
      const visitCompare = a.nextVisit.getTime() - b.nextVisit.getTime();
      if (visitCompare !== 0) return visitCompare;

      const lastNameCompare = a.lastName.localeCompare(b.lastName);
      if (lastNameCompare !== 0) return lastNameCompare;
      return a.firstName.localeCompare(b.firstName);
    });

    return items;
  }

  topNeedingAttention(n) {
    return this.needingAttentionSorted().slice(0, n);
  }

  topUpcomingVisits(n) {
    return this.upcomingVisitsSorted().slice(0, n);
  }

  _critRank(criticality) {
    switch (criticality) {
      case PatientCriticality.CRITICAL:
        return 0;
      case PatientCriticality.HIGH:
        return 1;
      case PatientCriticality.MEDIUM:
        return 2;
      case PatientCriticality.LOW:
        return 3;
      default:
        return 4;
    }
  }
}

export const patientsRepository = new PatientsRepository();
