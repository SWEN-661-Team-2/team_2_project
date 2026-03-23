import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CareConnectDashboard } from '../../src/app/components/CareConnectDashboard';

describe('CareConnectDashboard', () => {
  it('renders Dashboard heading', () => {
    render(<CareConnectDashboard />);
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('renders Active Tasks card', () => {
    render(<CareConnectDashboard />);
    expect(screen.getByText('Active Tasks')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders Urgent Tasks card', () => {
    render(<CareConnectDashboard />);
    expect(screen.getByRole('heading', { name: 'Urgent Tasks' })).toBeInTheDocument();
  });

  it('renders Appointments card', () => {
    render(<CareConnectDashboard />);
    expect(screen.getByText('Appointments')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('renders Patients card', () => {
    render(<CareConnectDashboard />);
    expect(screen.getByText('Patients')).toBeInTheDocument();
    expect(screen.getByText('156')).toBeInTheDocument();
  });

  it('renders urgent tasks list', () => {
    render(<CareConnectDashboard />);
    expect(screen.getByText('Medication Round - Room 204')).toBeInTheDocument();
    expect(screen.getByText('Blood Pressure Check')).toBeInTheDocument();
    expect(screen.getByText('Post-Surgery Assessment')).toBeInTheDocument();
  });

  it('renders New Appointment quick action', () => {
    render(<CareConnectDashboard />);
    expect(screen.getByRole('button', { name: /New Appointment/i })).toBeInTheDocument();
  });

  it('renders Add Patient quick action', () => {
    render(<CareConnectDashboard />);
    expect(screen.getByRole('button', { name: /Patient/i })).toBeInTheDocument();
  });

  it('renders New Task quick action', () => {
    render(<CareConnectDashboard />);
    expect(screen.getByRole('button', { name: /New Task/i })).toBeInTheDocument();
  });

  it('opens New Appointment modal', async () => {
    const user = userEvent.setup();
    render(<CareConnectDashboard />);
    await user.click(screen.getByRole('button', { name: /Appointment/i }));
    expect(screen.getAllByText('New Appointment').length).toBeGreaterThan(0);
  });

  it('opens Add Patient modal', async () => {
    const user = userEvent.setup();
    render(<CareConnectDashboard />);
    await user.click(screen.getByRole('button', { name: /Patient/i }));
    expect(screen.getByText('Add New Patient')).toBeInTheDocument();
  });

  it('opens New Task modal', async () => {
    const user = userEvent.setup();
    render(<CareConnectDashboard />);
    await user.click(screen.getByRole('button', { name: /New Task/i }));
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
  });

  it('renders todays schedule section', () => {
    render(<CareConnectDashboard />);
    expect(screen.getByText("Today's Schedule")).toBeInTheDocument();
  });

  it('renders recent activity section', () => {
    render(<CareConnectDashboard />);
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });
});

describe('CareConnectDashboard - modal submissions', () => {
  it('closes New Appointment modal when X clicked', async () => {
    const user = userEvent.setup();
    render(<CareConnectDashboard />);
    fireEvent.click(screen.getByText('Appt'));
    await user.click(screen.getAllByRole('button', { name: 'Close modal' })[0]);
    expect(screen.queryByText('Schedule care for a patient')).not.toBeInTheDocument();
  });

  it('closes Add Patient modal when X clicked', async () => {
    const user = userEvent.setup();
    render(<CareConnectDashboard />);
    await user.click(screen.getByRole('button', { name: /Patient/i }));
    await user.click(screen.getAllByRole('button', { name: 'Close modal' })[0]);
    expect(screen.queryByText('Add New Patient')).not.toBeInTheDocument();
  });

  it('closes New Task modal when X clicked', async () => {
    const user = userEvent.setup();
    render(<CareConnectDashboard />);
    await user.click(screen.getByRole('button', { name: /New Task/i }));
    await user.click(screen.getAllByRole('button', { name: 'Close modal' })[0]);
    expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();
  });

  it('submits new appointment from dashboard', async () => {
    const user = userEvent.setup();
    render(<CareConnectDashboard />);
    fireEvent.click(screen.getByText('Appt'));
    await user.selectOptions(screen.getByLabelText(/Time/i), '08:00 AM');
    await user.selectOptions(screen.getByLabelText(/Duration/i), '30 min');
    await user.type(screen.getByPlaceholderText('Enter patient name'), 'John Davis');
    await user.selectOptions(screen.getByLabelText(/Appointment Type/i), 'Medication Round');
    await user.selectOptions(screen.getByLabelText(/Status/i), 'Scheduled');
    await user.click(screen.getByRole('button', { name: /Save Appointment/i }));
    await waitFor(() => {
      expect(screen.queryByText('Schedule care for a patient')).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('submits new task from dashboard', async () => {
    const user = userEvent.setup();
    render(<CareConnectDashboard />);
    await user.click(screen.getByRole('button', { name: /New Task/i }));
    await user.type(screen.getByPlaceholderText('Enter task name...'), 'Blood Pressure Check');
    await user.selectOptions(screen.getByLabelText(/Priority/i), 'High');
    await user.selectOptions(screen.getByLabelText(/Category/i), 'Assessment');
    await user.click(screen.getByRole('button', { name: /Create Task/i }));
    await waitFor(() => {
      expect(screen.queryByText('Create New Task')).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
