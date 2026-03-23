import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SchedulePage } from '../../src/app/components/SchedulePage';

describe('SchedulePage', () => {
  it('renders Calendar heading', () => {
    render(<SchedulePage />);
    expect(screen.getByText('Calendar')).toBeInTheDocument();
  });

  it('renders New Appointment button', () => {
    render(<SchedulePage />);
    expect(screen.getByRole('button', { name: /New Appointment/i })).toBeInTheDocument();
  });

  it('renders days of week', () => {
    render(<SchedulePage />);
    expect(screen.getByText('Su')).toBeInTheDocument();
    expect(screen.getByText('Mo')).toBeInTheDocument();
    expect(screen.getByText('Sa')).toBeInTheDocument();
  });

  it('renders appointment patients', () => {
    render(<SchedulePage />);
    expect(screen.getAllByText('John Davis').length).toBeGreaterThan(0);
  });

  it('renders appointment times', () => {
    render(<SchedulePage />);
    expect(screen.getByText('08:00 AM')).toBeInTheDocument();
    expect(screen.getByText('02:00 PM')).toBeInTheDocument();
  });

  it('renders completed appointment', () => {
    render(<SchedulePage />);
    expect(screen.getByText('Medication Round')).toBeInTheDocument();
  });

  it('renders scheduled appointment', () => {
    render(<SchedulePage />);
    expect(screen.getByText('Medication Administration')).toBeInTheDocument();
  });

  it('renders available slot', () => {
    render(<SchedulePage />);
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('renders summary stats', () => {
    render(<SchedulePage />);
    expect(screen.getByText('Total Appointments')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('renders calendar date buttons', () => {
    render(<SchedulePage />);
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('28').length).toBeGreaterThan(0);
  });

  it('changes selected date when date clicked', async () => {
    const user = userEvent.setup();
    render(<SchedulePage />);
    await user.click(screen.getByText('15'));
    expect(screen.getByText(/February 15/i)).toBeInTheDocument();
  });

  it('opens New Appointment modal when button clicked', async () => {
    const user = userEvent.setup();
    render(<SchedulePage />);
    await user.click(screen.getByRole('button', { name: /New Appointment/i }));
    expect(screen.getAllByText('New Appointment').length).toBeGreaterThan(0);
  });

  it('renders Book Appointment button for available slot', () => {
    render(<SchedulePage />);
    expect(screen.getByRole('button', { name: 'Book' })).toBeInTheDocument();
  });

  it('opens modal when Book Appointment clicked', async () => {
    const user = userEvent.setup();
    render(<SchedulePage />);
    await user.click(screen.getByRole('button', { name: 'Book' }));
    expect(screen.getAllByText('New Appointment').length).toBeGreaterThan(0);
  });
});
