/**
 * Message Model
 * Equivalent to Flutter's CaregiverMessage class
 */

export class CaregiverMessage {
  constructor(id, sender, subject, preview, sentAt, unread = false) {
    this.id = id;
    this.sender = sender;
    this.subject = subject;
    this.preview = preview;
    this.sentAt = sentAt;
    this.unread = unread;
  }
}

export default CaregiverMessage;
