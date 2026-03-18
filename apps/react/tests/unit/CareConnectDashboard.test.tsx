import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CareConnectDashboard } from '../../src/app/components/CareConnectDashboard';

// Mock the sub-components
vi.mock('./NewAppointmentModal', () => ({
  NewAppointmentModal: ({ isOpen }: { isOpen: boolean }) => 
    isOpen ? <div data-testid="appointment-modal">Appointment Modal Open</div> : null
}));

vi.mock('./AddPatientModal', () => ({
  AddPatientModal: ({ isOpen }: { isOpen: boolean }) => 
    isOpen ? <div data-testid="patient-modal">Patient Modal Open</div> : null
}));

vi.mock('./CreateTaskModal', () => ({
  CreateTaskModal: ({ isOpen }: { isOpen: boolean }) => 
    isOpen ? <div data-testid="task-modal">Task Modal Open</div> : null
}));

describe('CareConnectDashboard', () => {
  
  it('renders the dashboard title and welcome message', () => {
    render(<CareConnectDashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
  });

  it('renders all summary cards with correct data', () => {
    render(<CareConnectDashboard />);
    expect(screen.getByText('Active Tasks')).toBeInTheDocument();
    expect(screen.getByText('156')).toBeInTheDocument();
    expect(screen.getByText('Appointments')).toBeInTheDocument();
  });

  it('renders the urgent tasks list', () => {
    render(<CareConnectDashboard />);
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Blood Pressure Check')).toBeInTheDocument();
    expect(screen.getByText('URGENT')).toBeInTheDocument();
  });

  it('opens the Task Modal when "New Task" is clicked', () => {
    render(<CareConnectDashboard />);
    
    // We use getByRole to find the BUTTON specifically, ignoring <span> or <p> tags
    const taskBtn = screen.getByRole('button', { name: /new task/i });
    fireEvent.click(taskBtn);
    
    expect(screen.getByTestId('task-modal')).toBeInTheDocument();
  });

  it('opens the Patient Modal when "New Patient" is clicked', () => {
    render(<CareConnectDashboard />);
    
    // This fixes the "Multiple Elements" error by specifying we want the BUTTON
    const patientBtn = screen.getByRole('button', { name: /new patient/i });
    fireEvent.click(patientBtn);
    
    expect(screen.getByTestId('patient-modal')).toBeInTheDocument();
  });

  it('opens the Appointment Modal when "New Appointment" is clicked', () => {
    render(<CareConnectDashboard />);
    
    const appointmentBtn = screen.getByRole('button', { name: /new appointment/i });
    fireEvent.click(appointmentBtn);
    
    expect(screen.getByTestId('appointment-modal')).toBeInTheDocument();
  });

  it('contains a search input with correct placeholder', () => {
    render(<CareConnectDashboard />);
    const searchInput = screen.getByPlaceholderText(/search patients, tasks/i);
    expect(searchInput).toBeInTheDocument();
  });
});