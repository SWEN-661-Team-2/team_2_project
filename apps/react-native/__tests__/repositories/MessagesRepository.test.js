import { messagesRepository } from '../../src/repositories/MessagesRepository';

describe('MessagesRepository', () => {
  
  describe('Core Data', () => {
    test('allMessages returns the full array of caregiver messages', () => {
      const messages = messagesRepository.allMessages();
      expect(Array.isArray(messages)).toBe(true);
      expect(messages.length).toBeGreaterThan(0);
      
      // Verify structure of a message
      const firstMsg = messages[0];
      expect(firstMsg).toHaveProperty('id');
      expect(firstMsg).toHaveProperty('sender');
      expect(firstMsg).toHaveProperty('subject');
    });
  });

  describe('Unread Logic', () => {
    test('unreadCount returns the correct number of unread messages', () => {
      const count = messagesRepository.unreadCount();
      expect(typeof count).toBe('number');
      
      // Ensure it matches the filtered unread list length
      const unreadList = messagesRepository.unreadMessages();
      expect(count).toBe(unreadList.length);
    });

    test('unreadMessages filters correctly', () => {
      const unread = messagesRepository.unreadMessages();
      unread.forEach(msg => {
        expect(msg.unread).toBe(true);
      });
    });
  });

  describe('Accessibility Support', () => {
    // These tests ensure coverage for the summary methods
    test('getInboxStatusSummary returns a descriptive string', () => {
      const summary = messagesRepository.getInboxStatusSummary();
      expect(typeof summary).toBe('string');
      expect(summary).toContain('messages');
    });

    test('getMessageAccessibilitySummary returns formatted details', () => {
      const messages = messagesRepository.allMessages();
      const summary = messagesRepository.getMessageAccessibilitySummary(messages[0]);
      expect(typeof summary).toBe('string');
      expect(summary.length).toBeGreaterThan(0);
    });
  });
});