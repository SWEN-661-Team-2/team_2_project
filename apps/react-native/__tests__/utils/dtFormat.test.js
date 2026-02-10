/**
 * Business Logic Tests - Date Formatting Utilities
 * Tests date formatting functions
 */
import { formatDtYmdHmm, formatDtMmmDdYyyyHmm } from '../../src/utils/dtFormat';

describe('Date Formatting Utilities', () => {
  describe('formatDtYmdHmm', () => {
    test('formats date correctly in YYYY-MM-DD HH:MM format', () => {
      const date = new Date('2024-03-15T14:30:00');
      const formatted = formatDtYmdHmm(date);

      expect(formatted).toBe('2024-03-15 14:30');
    });

    test('pads single digit months and days with zero', () => {
      const date = new Date('2024-01-05T09:05:00');
      const formatted = formatDtYmdHmm(date);

      expect(formatted).toBe('2024-01-05 09:05');
    });

    test('handles midnight correctly', () => {
      const date = new Date('2024-12-25T00:00:00');
      const formatted = formatDtYmdHmm(date);

      expect(formatted).toBe('2024-12-25 00:00');
    });

    test('handles end of day correctly', () => {
      const date = new Date('2024-12-31T23:59:00');
      const formatted = formatDtYmdHmm(date);

      expect(formatted).toBe('2024-12-31 23:59');
    });

    test('returns empty string for null date', () => {
      const formatted = formatDtYmdHmm(null);

      expect(formatted).toBe('');
    });

    test('returns empty string for undefined date', () => {
      const formatted = formatDtYmdHmm(undefined);

      expect(formatted).toBe('');
    });
  });

  describe('formatDtMmmDdYyyyHmm', () => {
    test('formats date correctly in MMM DD, YYYY HH:MM format', () => {
      const date = new Date('2024-03-15T14:30:00');
      const formatted = formatDtMmmDdYyyyHmm(date);

      // Format may vary slightly by locale, but should contain key parts
      expect(formatted).toContain('Mar');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
      expect(formatted).toContain('14:30');
    });

    test('returns empty string for null date', () => {
      const formatted = formatDtMmmDdYyyyHmm(null);

      expect(formatted).toBe('');
    });

    test('returns empty string for undefined date', () => {
      const formatted = formatDtMmmDdYyyyHmm(undefined);

      expect(formatted).toBe('');
    });

    test('handles different months correctly', () => {
      const dates = [
        new Date('2024-01-15T10:00:00'),
        new Date('2024-06-15T10:00:00'),
        new Date('2024-12-15T10:00:00'),
      ];

      const formatted = dates.map(formatDtMmmDdYyyyHmm);

      expect(formatted[0]).toContain('Jan');
      expect(formatted[1]).toContain('Jun');
      expect(formatted[2]).toContain('Dec');
    });
  });

  describe('edge cases', () => {
    test('handles leap year dates correctly', () => {
      const date = new Date('2024-02-29T12:00:00');
      const formatted = formatDtYmdHmm(date);

      expect(formatted).toBe('2024-02-29 12:00');
    });

    test('handles year transitions correctly', () => {
      const date = new Date('2024-01-01T00:00:00');
      const formatted = formatDtYmdHmm(date);

      expect(formatted).toBe('2024-01-01 00:00');
    });
  });
});
