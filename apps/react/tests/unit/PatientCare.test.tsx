// PatientCare.test.tsx
// Tests the PatientCare component in isolation using two module-level mocks:
//   1. dexie-react-hooks — returns static patient records instead of querying IndexedDB
//   2. ../../src/db — stubs out db.patients.add so no real DB writes occur
// This keeps tests fast, deterministic, and free of browser storage dependencies.
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PatientCare } from '../../src/app/components/PatientCare';

// Mock useLiveQuery to return static patient records instead of querying IndexedDB.
// This prevents "IndexedDB not found" errors in the jsdom test environment and
// provides deterministic data for all assertions.
vi.mock('dexie-react-hooks', () => ({
  useLiveQuery: () => [
    {
      id: 1, firstName: 'John',  lastName: 'Davis',  initials: 'JD',
      room: '204A', age: 68, gender: 'Male',   status: 'stable',
      phone: '555-0101', email: 'john@example.com',
      diagnosis: ['Hypertension'], medications: ['Metformin'],
      allergies: ['Penicillin'], bloodType: 'A+',
    },
    {
      id: 2, firstName: 'Mary',  lastName: 'Wilson', initials: 'MW',
      room: '301B', age: 54, gender: 'Female', status: 'critical',
      phone: '555-0202', email: 'mary@example.com',
      diagnosis: ['Pneumonia'],   medications: ['Amoxicillin'],
      allergies: ['Latex'], bloodType: 'O-',
    },
  ],
}));

// Mock the db module so PatientCare's handleAddPatient never touches real IndexedDB
vi.mock('../../src/db', () => ({
  db: {
    patients: { add: vi.fn() },
  },
}));

// UI tests for the PatientCare component.
// Covers: list rendering, search filtering, detail panel selection,
// status labels, and mobile back-navigation behaviour.
describe('PatientCare UI Tests', () => {

  // Unmount the previous render before each test to avoid DOM bleed-through
  beforeEach(() => {
    cleanup();
  });

  // Confirms both seeded patients and the first patient's room number are visible on mount
  it('renders the patient list and initial state', () => {
    render(<PatientCare />);
    expect(screen.getByText('John Davis')).toBeInTheDocument();
    expect(screen.getByText('Mary Wilson')).toBeInTheDocument();
    expect(screen.getByText('Room 204A')).toBeInTheDocument();
  });

  // Typing in the search box should hide non-matching patients
  it('filters the patient list based on search input', () => {
    render(<PatientCare />);
    const searchInput = screen.getByPlaceholderText(/search patients/i);

    fireEvent.change(searchInput, { target: { value: 'Mary' } });

    expect(screen.getByText('Mary Wilson')).toBeInTheDocument();
    expect(screen.queryByText('John Davis')).not.toBeInTheDocument();
  });

  // Clicking a patient in the list should show their email in the detail panel
  it('updates the detail view when a patient is selected', () => {
    render(<PatientCare />);

    fireEvent.click(screen.getByText('Mary Wilson'));

    expect(screen.getByText('mary@example.com')).toBeInTheDocument();
  });

  // Status labels are derived from the mock data's status field via getStatusLabel()
  it('displays correct status labels', () => {
    render(<PatientCare />);
    expect(screen.getByText('Stable')).toBeInTheDocument();
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  // On narrow viewports the detail panel replaces the list, and a Back button appears.
  // Clicking Back should return to the list view with the search input visible.
  it('handles mobile "Back to list" functionality', () => {
    // Simulate a 375px mobile viewport
    Object.defineProperty(globalThis, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    globalThis.dispatchEvent(new Event('resize'));


    render(<PatientCare />);

    // Navigate into the detail panel by selecting a patient
    fireEvent.click(screen.getByText('John Davis'));

    // Back button is only rendered when showMobileDetail is true
    const backButton = screen.getByText(/back to list/i);
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);

    // After going back the search input should be visible again
    expect(screen.getByPlaceholderText(/search patients/i)).toBeVisible();
  });
});
