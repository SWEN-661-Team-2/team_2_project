import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PatientCare } from '../../src/app/components/PatientCare';

import '@testing-library/jest-dom';

// 1. MOCK THE DATA SOURCE
// This stops the "IndexedDB not found" error and provides the data for your tests
vi.mock('dexie-react-hooks', () => ({
  useLiveQuery: () => [
    {
      id: 1, firstName: 'John', lastName: 'Davis', initials: 'JD',
      room: '204A', age: 68, gender: 'Male', status: 'stable',
      phone: '555-0101', email: 'john@example.com',
      diagnosis: ['Hypertension'], medications: ['Metformin']
    },
    {
      id: 2, firstName: 'Mary', lastName: 'Wilson', initials: 'MW',
      room: '301B', age: 54, gender: 'Female', status: 'critical',
      phone: '555-0202', email: 'mary@example.com',
      diagnosis: ['Pneumonia'], medications: ['Amoxicillin']
    },
  ],
}));

// Mock the DB import so it doesn't try to initialize the real IndexedDB
vi.mock('../../src/db', () => ({
  db: {
    patients: { add: vi.fn() }
  }
}));

describe('PatientCare UI Tests', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders the patient list and initial state', () => {
    render(<PatientCare />);
    // Verify the mocked data is displayed
    expect(screen.getByText('John Davis')).toBeInTheDocument();
    expect(screen.getByText('Mary Wilson')).toBeInTheDocument();
    expect(screen.getByText('Room 204A')).toBeInTheDocument();
  });

  it('filters the patient list based on search input', () => {
    render(<PatientCare />);
    const searchInput = screen.getByPlaceholderText(/search patients/i);

    // Search for Mary
    fireEvent.change(searchInput, { target: { value: 'Mary' } });

    expect(screen.getByText('Mary Wilson')).toBeInTheDocument();
    expect(screen.queryByText('John Davis')).not.toBeInTheDocument();
  });

  it('updates the detail view when a patient is selected', () => {
    render(<PatientCare />);

    // Click on Mary
    fireEvent.click(screen.getByText('Mary Wilson'));

    // Check that her specific email appears in the detail panel
    expect(screen.getByText('mary@example.com')).toBeInTheDocument();
  });

  it('displays correct status labels', () => {
    render(<PatientCare />);

    // "Stable" and "Critical" are from our mock data above
    expect(screen.getByText('Stable')).toBeInTheDocument();
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });


  it('handles mobile "Back to list" functionality', () => {
    // CHANGE: Use 'window' instead of 'global'
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
    window.dispatchEvent(new Event('resize'));

    render(<PatientCare />);

    // Select a patient to enter detail view
    fireEvent.click(screen.getByText('John Davis'));

    // Check for the back button (which only shows on mobile)
    const backButton = screen.getByText(/back to list/i);
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);

    // Verify we are back at the list
    expect(screen.getByPlaceholderText(/search patients/i)).toBeVisible();
  });



});