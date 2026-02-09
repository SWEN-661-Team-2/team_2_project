// Sample messages data
export class MessagesRepository {
  static instance = new MessagesRepository();

  messages = [
    { id: '1', from: 'Dr. Smith', subject: 'Lab results ready', read: false, date: new Date('2026-02-09T08:00:00') },
    { id: '2', from: 'Nurse Johnson', subject: 'Patient update', read: false, date: new Date('2026-02-09T09:30:00') },
    { id: '3', from: 'Admin', subject: 'Schedule change', read: true, date: new Date('2026-02-08T14:00:00') },
    { id: '4', from: 'Dr. Williams', subject: 'Medication review', read: false, date: new Date('2026-02-09T10:15:00') },
  ];

  unreadCount() {
    return this.messages.filter(m => !m.read).length;
  }

  unreadMessages() {
    return this.messages.filter(m => !m.read);
  }

  allMessages() {
    return this.messages;
  }
}
