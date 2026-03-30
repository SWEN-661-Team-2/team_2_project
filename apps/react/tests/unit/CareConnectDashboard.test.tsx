import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CareConnectDashboard } from '../../src/app/components/CareConnectDashboard';

// Mock child modals to isolate the Dashboard from their implementations.
// Each mock renders a identifiable testid element only when isOpen is true,
// so modal open/close behaviour can be asserted without mounting the real modals.
vi.mock('./NewAppointmentModal', () => ({
  NewAppointmentModal: ({ isOpen }: { readonly isOpen: boolean }) =>
    isOpen ? <div data-testid="appointment-modal">Appointment Modal Open</div> : null,
}));

vi.mock('./AddPatientModal', () => ({
  AddPatientModal: ({ isOpen }: { readonly isOpen: boolean }) =>
    isOpen ? <div data-testid="patient-modal">Patient Modal Open</div> : null,
}));

vi.mock('./CreateTaskModal', () => ({
  CreateTaskModal: ({ isOpen }: { readonly isOpen: boolean }) =>
    isOpen ? <div data-testid="task-modal">Task Modal Open</div> : null,
}));

describe('CareConnectDashboard', () => {

  // Confirms the page heading and welcome subtitle are rendered on mount
  it('renders the dashboard title and welcome message', () => {
    render(<CareConnectDashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
  });

  // Spot-checks a selection of summary card labels and values from the static data
  it('renders all summary cards with correct data', () => {
    render(<CareConnectDashboard />);
    expect(screen.getByText('Active Tasks')).toBeInTheDocument();
    expect(screen.getByText('156')).toBeInTheDocument();
    expect(screen.getByText('Appointments')).toBeInTheDocument();
  });

  // Verifies the urgent tasks panel renders seeded patient names and priority badges
  it('renders the urgent tasks list', () => {
    render(<CareConnectDashboard />);
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Blood Pressure Check')).toBeInTheDocument();
    expect(screen.getByText('URGENT')).toBeInTheDocument();
  });

  // Clicking "New Task" should set taskModalOpen to true, revealing the mock modal.
  // getByRole scopes to the button to avoid matching span/p text with the same label.
  it('opens the Task Modal when "New Task" is clicked', () => {
    render(<CareConnectDashboard />);
    fireEvent.click(screen.getByRole('button', { name: /new task/i }));
    expect(screen.getByTestId('task-modal')).toBeInTheDocument();
  });

  // Clicking "New Patient" should set patientModalOpen to true
  it('opens the Patient Modal when "New Patient" is clicked', () => {
    render(<CareConnectDashboard />);
    fireEvent.click(screen.getByRole('button', { name: /new patient/i }));
    expect(screen.getByTestId('patient-modal')).toBeInTheDocument();
  });

  // Clicking "New Appointment" should set appointmentModalOpen to true
  it('opens the Appointment Modal when "New Appointment" is clicked', () => {
    render(<CareConnectDashboard />);
    fireEvent.click(screen.getByRole('button', { name: /new appointment/i }));
    expect(screen.getByTestId('appointment-modal')).toBeInTheDocument();
  });

  // Confirms the global search input is rendered with the correct placeholder text
  it('contains a search input with correct placeholder', () => {
    render(<CareConnectDashboard />);
    const searchInput = screen.getByPlaceholderText(/search patients, tasks/i);
    expect(searchInput).toBeInTheDocument();
  });
});
