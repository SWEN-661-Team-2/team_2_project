class CareMessage {
  final String from;
  final String subject;
  final String preview;
  final DateTime sentAt;
  final bool unread;

  const CareMessage({
    required this.from,
    required this.subject,
    required this.preview,
    required this.sentAt,
    required this.unread,
  });
}