// lib/core/messages/messages_repository.dart

import 'caregiver_message.dart';

class MessagesRepository {
  MessagesRepository._();
  static final MessagesRepository instance = MessagesRepository._();

  final List<CaregiverMessage> _messages = [
    CaregiverMessage(
      id: 'm01',
      patientId: 'p01',
      sender: 'Care Team',
      subject: 'New care plan note',
      preview: 'Updated instructions for evening medication.',
      sentAt: DateTime(2026, 1, 31, 21, 45),
      unread: true,
    ),
    CaregiverMessage(
      id: 'm02',
      patientId: 'p02',
      sender: 'Dr. Patel',
      subject: 'Visit follow-up',
      preview: 'Please monitor blood pressure twice daily.',
      sentAt: DateTime(2026, 1, 31, 21, 15),
      unread: true,
    ),
    CaregiverMessage(
      id: 'm03',
      patientId: 'p01',
      sender: 'Clinic Scheduler',
      subject: 'Appointment confirmed',
      preview: 'Appointment confirmed for 2026-02-01 0900.',
      sentAt: DateTime(2026, 1, 31, 20, 30),
      unread: false,
    ),
    CaregiverMessage(
      id: 'm04',
      patientId: 'p03',
      sender: 'CareConnect Alerts',
      subject: 'Medication missed',
      preview: 'Morning insulin marked as missed.',
      sentAt: DateTime(2026, 1, 31, 19, 45),
      unread: true,
    ),
    CaregiverMessage(
      id: 'm05',
      patientId: 'p04',
      sender: 'Care Team',
      subject: 'Lab results available',
      preview: 'New lab results have been uploaded to the chart.',
      sentAt: DateTime(2026, 1, 31, 18, 00),
      unread: false,
    ),
    CaregiverMessage(
      id: 'm06',
      patientId: 'p05',
      sender: 'Dr. Nguyen',
      subject: 'Symptom check-in',
      preview: 'How is the chest pain today? Any changes?',
      sentAt: DateTime(2026, 1, 31, 17, 30),
      unread: true,
    ),
    CaregiverMessage(
      id: 'm07',
      patientId: 'p06',
      sender: 'Home Health',
      subject: 'Visit notes',
      preview: 'Summary: mobility improving; continue exercises.',
      sentAt: DateTime(2026, 1, 31, 16, 15),
      unread: false,
    ),
    CaregiverMessage(
      id: 'm08',
      patientId: 'p02',
      sender: 'CareConnect Alerts',
      subject: 'New message from provider',
      preview: 'You have a new message regarding upcoming visits.',
      sentAt: DateTime(2026, 1, 31, 15, 00),
      unread: true,
    ),
    CaregiverMessage(
      id: 'm09',
      patientId: 'p01',
      sender: 'Clinic Scheduler',
      subject: 'Reschedule request',
      preview: 'Would you like to move Mark Lee to 4:30 PM?',
      sentAt: DateTime(2026, 1, 31, 14, 30),
      unread: false,
    ),
    CaregiverMessage(
      id: 'm10',
      patientId: 'p07',
      sender: 'Care Team',
      subject: 'Diet reminder',
      preview: 'Low sodium meals recommended this week.',
      sentAt: DateTime(2026, 1, 31, 13, 45),
      unread: false,
    ),
    CaregiverMessage(
      id: 'm11',
      patientId: 'p03',
      sender: 'CareConnect Alerts',
      subject: 'Blood pressure alert',
      preview: 'Elevated reading recorded. Review recommended.',
      sentAt: DateTime(2026, 1, 31, 12, 15),
      unread: true,
    ),
    CaregiverMessage(
      id: 'm12',
      patientId: 'p02',
      sender: 'Dr. Patel',
      subject: 'Medication adjustment',
      preview: 'Adjust dosage starting tomorrow morning.',
      sentAt: DateTime(2026, 1, 31, 11, 30),
      unread: true,
    ),
    CaregiverMessage(
      id: 'm13',
      patientId: 'p08',
      sender: 'Home Health',
      subject: 'Supplies delivered',
      preview: 'Supplies delivered to the front desk.',
      sentAt: DateTime(2026, 1, 31, 10, 00),
      unread: false,
    ),
    CaregiverMessage(
      id: 'm14',
      patientId: 'p09',
      sender: 'Care Team',
      subject: 'Daily summary',
      preview: '3 patients need attention. 12 visits scheduled.',
      sentAt: DateTime(2026, 1, 31, 9, 15),
      unread: false,
    ),
    CaregiverMessage(
      id: 'm15',
      patientId: 'p01',
      sender: 'CareConnect Alerts',
      subject: 'Task overdue',
      preview: 'Caregiver task overdue: confirm appointment details.',
      sentAt: DateTime(2026, 1, 31, 8, 45),
      unread: true,
    ),
    CaregiverMessage(
      id: 'm16',
      patientId: 'p10',
      sender: 'Clinic Scheduler',
      subject: 'Check-in instructions',
      preview: 'Arrive 10 minutes early and bring ID.',
      sentAt: DateTime(2026, 1, 31, 8, 00),
      unread: false,
    ),
    CaregiverMessage(
      id: 'm17',
      patientId: 'p04',
      sender: 'Care Team',
      subject: 'Care plan update',
      preview: 'Updated fall risk precautions added.',
      sentAt: DateTime(2026, 1, 31, 7, 30),
      unread: false,
    ),

    // -----------------------------------------------------------------------
    // NEW (8) — total now 25
    // -----------------------------------------------------------------------
    CaregiverMessage(
      id: 'm18',
      patientId: 'p02',
      sender: 'Care Team',
      subject: 'Caregiver note requested',
      preview: 'Please add an update after the evening routine.',
      sentAt: DateTime(2026, 1, 31, 7, 00),
      unread: true,
    ),
    CaregiverMessage(
      id: 'm19',
      patientId: 'p03',
      sender: 'Clinic Scheduler',
      subject: 'Appointment time change',
      preview: 'Appointment moved to 10:30 AM tomorrow.',
      sentAt: DateTime(2026, 1, 31, 6, 30),
      unread: false,
    ),
    CaregiverMessage(
      id: 'm20',
      patientId: 'p05',
      sender: 'CareConnect Alerts',
      subject: 'New lab order',
      preview: 'A new lab order was placed. Please review instructions.',
      sentAt: DateTime(2026, 1, 31, 6, 00),
      unread: true,
    ),
    CaregiverMessage(
      id: 'm21',
      patientId: 'p07',
      sender: 'Dr. Nguyen',
      subject: 'Medication question',
      preview: 'Did the patient take the morning dose as scheduled?',
      sentAt: DateTime(2026, 1, 31, 5, 30),
      unread: true,
    ),
    CaregiverMessage(
      id: 'm22',
      patientId: 'p01',
      sender: 'Home Health',
      subject: 'Visit confirmation',
      preview: 'Home visit confirmed for tomorrow morning.',
      sentAt: DateTime(2026, 1, 31, 5, 00),
      unread: false,
    ),
    CaregiverMessage(
      id: 'm23',
      patientId: 'p08',
      sender: 'CareConnect Alerts',
      subject: 'Refill reminder',
      preview: 'Medication supply low. Consider requesting a refill.',
      sentAt: DateTime(2026, 1, 31, 4, 30),
      unread: true,
    ),
    CaregiverMessage(
      id: 'm24',
      patientId: 'p09',
      sender: 'Care Team',
      subject: 'Diet follow-up',
      preview: 'Please track fluid intake for the next 48 hours.',
      sentAt: DateTime(2026, 1, 31, 4, 00),
      unread: false,
    ),
    CaregiverMessage(
      id: 'm25',
      patientId: 'p10',
      sender: 'Clinic Scheduler',
      subject: 'Paperwork needed',
      preview: 'Please complete intake paperwork before arrival.',
      sentAt: DateTime(2026, 1, 31, 3, 30),
      unread: true,
    ),
  ];

  List<CaregiverMessage> all() {
    final items = List<CaregiverMessage>.from(_messages);
    items.sort((a, b) => b.sentAt.compareTo(a.sentAt));
    return items;
  }

  int unreadCount() => _messages.where((m) => m.unread).length;

  List<CaregiverMessage> topN(int n) => all().take(n).toList();
}