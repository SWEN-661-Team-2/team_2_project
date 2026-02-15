// /Volumes/DevDrive/code/swen-661-ui/team_2_project/apps/react-native/__tests__/models/CaregiverMessage.test.js

/**
 * Business Logic Tests - CaregiverMessage Model
 * Tests the CaregiverMessage class (handles default vs named exports)
 */
import * as ModelModule from '../../src/models/CaregiverMessage';

const CaregiverMessageCtor =
  ModelModule.CaregiverMessage || ModelModule.default || ModelModule;

describe('CaregiverMessage Model', () => {
  describe('constructor', () => {
    test('creates message with all fields', () => {
      const date = new Date('2024-03-15T10:30:00');
      const message = new CaregiverMessageCtor(
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
      const message = new CaregiverMessageCtor('2', 'Alert', 'Important message');

      expect(message.id).toBe('2');
      expect(message.title).toBe('Alert');
      expect(message.body).toBe('Important message');
    });
  });
});