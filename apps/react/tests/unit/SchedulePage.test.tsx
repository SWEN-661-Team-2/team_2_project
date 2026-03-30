/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SchedulePage } from '../../src/app/components/SchedulePage';

// Derive current date values so tests remain valid regardless of when they run
const today = new Date();
const monthLabel = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
const todayDay = today.getDate();

// Pick a day that is never today — day 14 is safe for any month past day 14.
// If today is the 14th, fall back to day 7.
const clickDay = todayDay === 14 ? 7 : 14;
const clickDayName = new Date(today.getFullYear(), today.getMonth(), clickDay)
  .toLocaleDateString('en-US', { weekday: 'long' });
const clickDayLabel = new Date(today.getFullYear(), today.getMonth(), clickDay)
  .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

// Mock useLiveQuery to return a seeded available appointment for today's date.
// Without this the Daily Schedule panel renders empty and the Book button never appears.
vi.mock('dexie-react-hooks', () => ({
  useLiveQuery: () => [
    {
      id: 1, time: '09:00 AM', patient: null, duration: null, type: null,
      status: 'available',
      year: today.getFullYear(), month: today.getMonth(), day: today.getDate(),
    },
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
  // Uses dynamic date values so the test passes on any run date.
  it('updates the selected date when a calendar day is clicked', () => {
    render(<SchedulePage />);

    const dayBtn = screen.getByRole('button', { name: `${monthLabel} ${clickDay}` });
    fireEvent.click(dayBtn);

    expect(screen.getByText(new RegExp(clickDayName, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(clickDayLabel, 'i'))).toBeInTheDocument();
  });

  // Clicking the "New Appointment" header button should open the modal
  it('opens the New Appointment modal from the header button', async () => {
    render(<SchedulePage />);

    fireEvent.click(screen.getByRole('button', { name: /new appointment/i }));

    const modal = await screen.findByTestId('appointment-modal');
    expect(modal).toBeInTheDocument();
  });

  // Clicking a "Book" button on an available appointment slot should open the modal.
  // Requires the dexie-react-hooks mock to return an available appointment for today.
  it('opens the modal when clicking a "Book" button in an available slot', async () => {
    render(<SchedulePage />);

    const bookBtns = screen.getAllByRole('button', { name: /book/i });
    fireEvent.click(bookBtns[0]);

    const modal = await screen.findByTestId('appointment-modal');
    expect(modal).toBeInTheDocument();
  });

  // Today should have the blue ring/bg class from getDayStyles.
  // Since today is also the default selected date, both checks apply to the same button.
  it('highlights "today" and the "selected date" correctly', () => {
    render(<SchedulePage />);

    // Today is both today and selected on initial render
    const todayBtn = screen.getByRole('button', { name: `${monthLabel} ${todayDay}` });

    // Today+selected gets bg-blue-500 per getDayStyles
    expect(todayBtn.className).toContain('bg-blue-500');
    expect(todayBtn.className).toContain('text-white');
  });
});
