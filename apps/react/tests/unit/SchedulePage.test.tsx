import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SchedulePage } from '../../src/app/components/SchedulePage'

// Top-level mock for the modal
vi.mock('./NewAppointmentModal', () => ({
    NewAppointmentModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
        isOpen ? (
            <div data-testid="appointment-modal">
                <button onClick={onClose}>Close Modal</button>
            </div>
        ) : null
}));

describe('SchedulePage Component', () => {

    it('updates the selected date when a calendar day is clicked', () => {
        render(<SchedulePage />);

        // Click on February 14th
        const day14 = screen.getByRole('button', { name: '14' });
        fireEvent.click(day14);

        // Check if the "Selected Date" display updates
        // The component uses toLocaleDateString, so we look for the date parts
        expect(screen.getByText(/Saturday/i)).toBeInTheDocument();
        expect(screen.getByText(/February 14, 2026/i)).toBeInTheDocument();
    });

    it('opens the New Appointment modal from the header button', async () => {
        render(<SchedulePage />);

        const newBtn = screen.getByRole('button', { name: /new appointment/i });
        fireEvent.click(newBtn);

        const modal = await screen.findByTestId('appointment-modal');
        expect(modal).toBeInTheDocument();
    });

    it('opens the modal when clicking a "Book" button in an available slot', async () => {
        render(<SchedulePage />);

        const bookBtns = screen.getAllByRole('button', { name: /book/i });
        fireEvent.click(bookBtns[0]);

        const modal = await screen.findByTestId('appointment-modal');
        expect(modal).toBeInTheDocument();
    });

    it('highlights "today" and the "selected date" correctly', () => {
        render(<SchedulePage />);

        // Today is 25, default selected is 26
        const todayBtn = screen.getByRole('button', { name: '25' });
        const selectedBtn = screen.getByRole('button', { name: '26' });

        // Based on getDayStyles, today (25) should have the blue ring class
        expect(todayBtn.className).toContain('ring-blue-500');

        // Selected (26) should have the slate-900 or blue-600 background
        expect(selectedBtn.className).toContain('text-white');
    });
});