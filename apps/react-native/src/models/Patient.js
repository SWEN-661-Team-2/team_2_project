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
    this.nextVisit = nextVisit;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
