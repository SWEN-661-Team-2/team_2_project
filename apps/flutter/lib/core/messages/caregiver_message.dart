class CaregiverMessage {
  final String id;

  /// NEW: links a message to a patient
  final String patientId;

  final String sender;
  final String subject;
  final String preview;
  final DateTime sentAt;
  final bool unread;

  const CaregiverMessage({
    required this.id,
    required this.patientId,
    required this.sender,
    required this.subject,
    required this.preview,
    required this.sentAt,
    required this.unread,
  });
}
