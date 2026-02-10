class CaregiverMessage {
  final String id;
  final String sender;
  final String subject;
  final String preview;
  final DateTime sentAt;
  final bool unread;

  const CaregiverMessage({
    required this.id,
    required this.sender,
    required this.subject,
    required this.preview,
    required this.sentAt,
    required this.unread,
  });
}
