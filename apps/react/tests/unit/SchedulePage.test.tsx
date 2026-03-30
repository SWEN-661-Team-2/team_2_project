/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SchedulePage } from '../../src/app/components/SchedulePage';

// Mock useLiveQuery to return a seeded available appointment for day 26.
// Without this the Daily Schedule panel renders empty and the Book button never appears.
vi.mock('dexie-react-hooks', () => ({
  useLiveQuery: () => [
    { id: 1, time: '09:00 AM', patient: null, duration: null, type: null, status: 'available', year: 2026, month: 1, day: 26 },
  ],
}));

// Mock the db module so the live query never touches real IndexedDB
vi.mock('../../src/db', () => ({
  db: {
    appointments: {
      where: vi.fn().mockReturnThis(),
      toArray: vi.fn().mockResolvedValue([]),
    },
  },
}));

// Mock NewAppointmentModal to avoid rendering the full modal implementation.
// The mock renders a testid element when open and a Close button to test onClose.
vi.mock('../../src/app/components/NewAppointmentModal', () => ({
  NewAppointmentModal: ({ isOpen, onClose }: { readonly isOpen: boolean; readonly onClose: () => void }) =>
    isOpen ? (
      <div data-testid="appointment-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null,
}));

// Unit tests for SchedulePage.
// Covers: date selection, selected date string update, modal open triggers,
// and calendar day highlight styles for today vs selected date.
describe('SchedulePage Component', () => {

  // Clicking a calendar day button should update the Selected Date footer.
  // The component uses toLocaleDateString so we assert on the formatted string parts.
  it('updates the selected date when a calendar day is clicked', () => {
    render(<SchedulePage />);

    // February 14 is a Saturday in 2026
    const day14 = screen.getByRole('button', { name: 'February 2026 14' });
    fireEvent.click(day14);

    expect(screen.getByText(/Saturday/i)).toBeInTheDocument();
    expect(screen.getByText(/February 14, 2026/i)).toBeInTheDocument();
  });

  // Clicking the "New Appointment" header button should open the modal
  it('opens the New Appointment modal from the header button', async () => {
    render(<SchedulePage />);

    fireEvent.click(screen.getByRole('button', { name: /new appointment/i }));

    const modal = await screen.findByTestId('appointment-modal');
    expect(modal).toBeInTheDocument();
  });

  // Clicking a "Book" button on an available appointment slot should open the modal.
  // Requires the dexie-react-hooks mock to return an available appointment for the selected date.
  it('opens the modal when clicking a "Book" button in an available slot', async () => {
    render(<SchedulePage />);

    const bookBtns = screen.getAllByRole('button', { name: /book/i });
    fireEvent.click(bookBtns[0]);

    const modal = await screen.findByTestId('appointment-modal');
    expect(modal).toBeInTheDocument();
  });

  // Today (day 25) should have the blue ring class from getDayStyles.
  // The default selected day (26) should have the white text class indicating selection.
  it('highlights "today" and the "selected date" correctly', () => {
    render(<SchedulePage />);

    const todayBtn    = screen.getByRole('button', { name: 'February 2026 25' });
    const selectedBtn = screen.getByRole('button', { name: 'February 2026 26' });

    // Today gets a blue focus ring per getDayStyles
    expect(todayBtn.className).toContain('ring-blue-500');

    // Selected day gets a dark/blue background with white text
    expect(selectedBtn.className).toContain('text-white');
  });
});
