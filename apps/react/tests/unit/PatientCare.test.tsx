import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PatientCare } from '../../src/app/components/PatientCare';

/// FIX 1: Ensure mock is at the very top level
vi.mock('./AddPatientModal', () => ({
  AddPatientModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => 
    isOpen ? (
      <div data-testid="mock-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null
}));

describe('PatientCare Component', () => {
  it('renders the patient list and initial empty state', () => {
    render(<PatientCare />);
    expect(screen.getByText('Patient Care')).toBeInTheDocument();
    expect(screen.getByText('John Davis')).toBeInTheDocument();
  });

  it('filters the patient list based on search input', () => {
    render(<PatientCare />);
    const searchInput = screen.getByPlaceholderText(/search patients/i);
    fireEvent.change(searchInput, { target: { value: 'Mary' } });
    expect(screen.getByText('Mary Wilson')).toBeInTheDocument();
    expect(screen.queryByText('John Davis')).not.toBeInTheDocument();
  });

  it('updates the detail view when a patient is selected', () => {
    render(<PatientCare />);
    const patientButton = screen.getByText('Mary Wilson').closest('button');
    if (patientButton) fireEvent.click(patientButton);
    expect(screen.getByText('mary.wilson@email.com')).toBeInTheDocument();
  });

  it('handles mobile "Back to list" functionality', () => {
    render(<PatientCare />);
    fireEvent.click(screen.getByText('John Davis').closest('button')!);
    const backButton = screen.getByText(/back to list/i);
    fireEvent.click(backButton);
    expect(screen.getByPlaceholderText(/search patients/i)).toBeInTheDocument();
  });

  it('displays correct status labels', () => {
    render(<PatientCare />);
    
    // FIX 2: Use getAllByText because multiple patients are "Stable"
    const stableLabels = screen.getAllByText('Stable');
    expect(stableLabels.length).toBeGreaterThanOrEqual(2);
    
    // Check for a unique one to be safe
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });
});