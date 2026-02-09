/**
 * Patient Model and Criticality Enum
 * Equivalent to Flutter's Patient class and PatientCriticality enum
 */

export const PatientCriticality = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export class Patient {
  constructor(firstName, lastName, criticality = null, nextVisit = null) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.criticality = criticality;
    // Ensure nextVisit is always a Date object, not a string
    this.nextVisit = nextVisit ? (nextVisit instanceof Date ? nextVisit : new Date(nextVisit)) : null;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
