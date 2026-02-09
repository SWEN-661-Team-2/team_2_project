/**
 * Messages Repository
 * Equivalent to Flutter's MessagesRepository
 * 
 * Manages caregiver messages
 */

import { CaregiverMessage } from '../models/CaregiverMessage';

class MessagesRepository {
  constructor() {
    this._messages = [
      new CaregiverMessage(
        'm01',
        'Care Team',
        'New care plan note',
        'Updated instructions for evening medication.',
        new Date(2026, 0, 31, 21, 45),
        true
      ),
      new CaregiverMessage(
        'm02',
        'Dr. Patel',
        'Visit follow-up',
        'Please monitor blood pressure twice daily.',
        new Date(2026, 0, 31, 21, 15),
        true
      ),
      new CaregiverMessage(
        'm03',
        'Clinic Scheduler',
        'Appointment confirmed',
        'Appointment confirmed for 2026-02-01 0900.',
        new Date(2026, 0, 31, 20, 30),
        false
      ),
      new CaregiverMessage(
        'm04',
        'CareConnect Alerts',
        'Medication missed',
        'Morning insulin marked as missed.',
        new Date(2026, 0, 31, 19, 45),
        true
      ),
      new CaregiverMessage(
        'm05',
        'Care Team',
        'Lab results available',
        'New lab results have been uploaded to the chart.',
        new Date(2026, 0, 31, 18, 0),
        false
      ),
      new CaregiverMessage(
        'm06',
        'Dr. Nguyen',
        'Blood sugar logs required',
        'Please enter blood sugar readings for past 3 days.',
        new Date(2026, 0, 31, 17, 30),
        true
      ),
    ];
  }

  allMessages() {
    return [...this._messages];
  }

  unreadCount() {
    return this._messages.filter(m => m.unread).length;
  }

  unreadMessages() {
    return this._messages.filter(m => m.unread);
  }
}

export const messagesRepository = new MessagesRepository();
