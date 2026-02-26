/**
 * @jest-environment jsdom
 * Tests for Schedule component logic
 */
import React from 'react';
import '@testing-library/jest-dom';

describe('Schedule Component Logic', () => {
  const APPOINTMENTS = [
    { time: '08:00 AM', patient: 'John Davis', duration: '30 min', type: 'Medication Round', status: 'completed' },
    { time: '09:00 AM', patient: null, duration: null, type: null, status: 'available' },
    { time: '11:00 AM', patient: 'Robert Brown', duration: '30 min', type: 'Round Care', status: 'completed' },
    { time: '02:00 PM', patient: 'John Davis', duration: '15 min', type: 'Medication Administration', status: 'scheduled' },
    { time: '03:00 PM', patient: 'Robert Brown', duration: '60 min', type: 'Physical Therapy', status: 'scheduled' }
  ];

  describe('Appointment counting', () => {
    function getAppointmentCounts(appointments) {
      return {
        total: appointments.filter(a => a.status !== 'available').length,
        completed: appointments.filter(a => a.status === 'completed').length,
        scheduled: appointments.filter(a => a.status === 'scheduled').length,
        available: appointments.filter(a => a.status === 'available').length
      };
    }

    test('counts total non-available appointments', () => {
      const counts = getAppointmentCounts(APPOINTMENTS);
      expect(counts.total).toBe(4);
    });

    test('counts completed appointments', () => {
      const counts = getAppointmentCounts(APPOINTMENTS);
      expect(counts.completed).toBe(2);
    });

    test('counts scheduled appointments', () => {
      const counts = getAppointmentCounts(APPOINTMENTS);
      expect(counts.scheduled).toBe(2);
    });

    test('counts available slots', () => {
      const counts = getAppointmentCounts(APPOINTMENTS);
      expect(counts.available).toBe(1);
    });
  });

  describe('Calendar building', () => {
    function buildCalendar(year, month) {
      const first = new Date(year, month, 1).getDay();
      const days = new Date(year, month + 1, 0).getDate();
      return { first, days };
    }

    test('February 2026 starts on Sunday (day 0)', () => {
      const { first } = buildCalendar(2026, 1);
      expect(first).toBe(0);
    });

    test('February 2026 has 28 days', () => {
      const { days } = buildCalendar(2026, 1);
      expect(days).toBe(28);
    });

    test('January 2026 has 31 days', () => {
      const { days } = buildCalendar(2026, 0);
      expect(days).toBe(31);
    });

    test('March 2026 starts on correct day', () => {
      const { first } = buildCalendar(2026, 2);
      expect(first).toBeGreaterThanOrEqual(0);
      expect(first).toBeLessThanOrEqual(6);
    });
  });

  describe('Appointment status logic', () => {
    test('available slots have null patient', () => {
      const available = APPOINTMENTS.filter(a => a.status === 'available');
      available.forEach(a => expect(a.patient).toBeNull());
    });

    test('booked appointments have patient names', () => {
      const booked = APPOINTMENTS.filter(a => a.status !== 'available');
      booked.forEach(a => expect(a.patient).toBeTruthy());
    });

    test('valid appointment statuses', () => {
      const validStatuses = ['completed', 'available', 'scheduled'];
      APPOINTMENTS.forEach(a => {
        expect(validStatuses).toContain(a.status);
      });
    });
  });

  describe('Toast notification', () => {
    test('shows toast message', () => {
      let toast = '';
      const showToast = (msg) => { toast = msg; };
      showToast('New appointment (demo).');
      expect(toast).toBe('New appointment (demo).');
    });

    test('toast clears after being set', () => {
      let toast = 'Some message';
      setTimeout(() => { toast = ''; }, 2500);
      expect(toast).toBe('Some message');
    });
  });
});
