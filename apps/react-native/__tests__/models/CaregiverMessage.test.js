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
        'Meeting Reminder',
        'Team meeting tomorrow',
        'info',
        date,
        false
      );

      expect(message.id).toBe('1');
      expect(message.title).toBe('Meeting Reminder');
      expect(message.body).toBe('Team meeting tomorrow');
      expect(message.category).toBe('info');
      expect(message.timestamp).toEqual(date);
      expect(message.isRead).toBe(false);
    });

    test('creates message with minimal fields', () => {
      const message = new CaregiverMessage(
        '2',
        'Alert',
        'Important message'
      );

      expect(message.id).toBe('2');
      expect(message.title).toBe('Alert');
      expect(message.body).toBe('Important message');
      expect(message.category).toBeUndefined();
      expect(message.timestamp).toBeUndefined();
      expect(message.isRead).toBeUndefined();
    });
  });
});
