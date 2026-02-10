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
      new CaregiverMessage(
        'm07',
        'Pharmacy',
        'Prescription ready',
        'Your refill for Metformin is ready for pickup.',
        new Date(2026, 1, 1, 9, 10),
        false
      ),
      new CaregiverMessage(
        'm08',
        'CareConnect Alerts',
        'New symptom entry',
        'A new symptom was logged: dizziness.',
        new Date(2026, 1, 1, 10, 5),
        true
      ),
      new CaregiverMessage(
        'm09',
        'Dr. Rivera',
        'Medication adjustment',
        'Reduce evening dose by half starting tonight.',
        new Date(2026, 1, 1, 11, 25),
        false
      ),
      new CaregiverMessage(
        'm10',
        'Lab Services',
        'Fasting reminder',
        'Reminder: fasting is required before tomorrow’s blood draw.',
        new Date(2026, 1, 1, 12, 0),
        true
      ),
      new CaregiverMessage(
        'm11',
        'Clinic Scheduler',
        'Appointment moved',
        'Your appointment has been moved from 2:00 PM to 3:30 PM.',
        new Date(2026, 1, 1, 13, 40),
        false
      ),
      new CaregiverMessage(
        'm12',
        'Care Team',
        'Care plan review',
        'Please review updated meal and hydration recommendations.',
        new Date(2026, 1, 1, 14, 15),
        true
      ),
      new CaregiverMessage(
        'm13',
        'Home Health RN',
        'Visit notes',
        'Patient tolerated mobility exercises well. Mild fatigue reported.',
        new Date(2026, 1, 1, 15, 55),
        false
      ),
      new CaregiverMessage(
        'm14',
        'CareConnect Alerts',
        'Missed check-in',
        'Daily wellness check-in was not completed.',
        new Date(2026, 1, 1, 16, 20),
        true
      ),
      new CaregiverMessage(
        'm15',
        'Dr. Hassan',
        'Follow-up question',
        'Has swelling improved since last week?',
        new Date(2026, 1, 1, 17, 45),
        false
      ),
      new CaregiverMessage(
        'm16',
        'CareConnect Support',
        'Ticket update',
        'Your support request has been received and is being reviewed.',
        new Date(2026, 1, 1, 18, 30),
        true
      ),
      new CaregiverMessage(
        'm17',
        'Nutrition Services',
        'Dietary guidance',
        'Please limit sodium intake to help manage blood pressure.',
        new Date(2026, 1, 2, 8, 10),
        false
      ),
      new CaregiverMessage(
        'm18',
        'CareConnect Alerts',
        'New task assigned',
        'A new caregiver task has been assigned: medication audit.',
        new Date(2026, 1, 2, 9, 0),
        true
      ),
      new CaregiverMessage(
        'm19',
        'Clinic Scheduler',
        'Transportation note',
        'Transportation confirmed for the 11:00 AM visit.',
        new Date(2026, 1, 2, 9, 35),
        true
      ),
      new CaregiverMessage(
        'm20',
        'Dr. Williams',
        'Lab review',
        'Lab results reviewed. No urgent concerns at this time.',
        new Date(2026, 1, 2, 10, 50),
        false
      ),
      new CaregiverMessage(
        'm21',
        'Care Team',
        'Pain level update requested',
        'Please update today’s pain score in the chart.',
        new Date(2026, 1, 2, 11, 15),
        true
      ),
      new CaregiverMessage(
        'm22',
        'CareConnect Alerts',
        'Device disconnected',
        'Blood pressure device has not synced in 24 hours.',
        new Date(2026, 1, 2, 12, 30),
        true
      ),
      new CaregiverMessage(
        'm23',
        'Home Health PT',
        'Exercise plan',
        'Please continue balance exercises twice daily.',
        new Date(2026, 1, 2, 13, 5),
        false
      ),
      new CaregiverMessage(
        'm24',
        'Care Team',
        'Medication refill needed',
        'Reminder: medication supply is low. Please request a refill.',
        new Date(2026, 1, 2, 14, 25),
        true
      ),
      new CaregiverMessage(
        'm25',
        'CareConnect Alerts',
        'Upcoming visit reminder',
        'Upcoming visit scheduled within the next 24 hours.',
        new Date(2026, 1, 2, 15, 40),
        false
      ),
      new CaregiverMessage(
        'm26',
        'Billing Office',
        'Statement available',
        'A new billing statement is now available in your account.',
        new Date(2026, 1, 2, 16, 15),
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
