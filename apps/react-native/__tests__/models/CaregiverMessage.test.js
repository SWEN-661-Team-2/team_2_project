/**
 * Business Logic Tests - CaregiverMessage Model
 * Tests the CaregiverMessage class
 */
import CaregiverMessage from '../../src/models/CaregiverMessage';

describe('CaregiverMessage Model', () => {
  describe('constructor', () => {
    test('creates message with all fields', () => {
      const date = new Date('2024-03-15T10:30:00');
      const message = new CaregiverMessage(
        '1',
        'Care Team',
        'Meeting Reminder',
        'Team meeting tomorrow',
        date,
        false
      );

      expect(message.id).toBe('1');
      expect(message.sender).toBe('Care Team');
      expect(message.subject).toBe('Meeting Reminder');
      expect(message.preview).toBe('Team meeting tomorrow');
      expect(message.sentAt).toEqual(date);
      expect(message.unread).toBe(false);
    });

    test('creates message with minimal fields', () => {
      const message = new CaregiverMessage(
        '2',
        'System',
        'Alert',
        'Important message'
      );

      expect(message.id).toBe('2');
      expect(message.sender).toBe('System');
      expect(message.subject).toBe('Alert');
      expect(message.preview).toBe('Important message');
      expect(message.unread).toBe(false); // default
    });
  });  
});
