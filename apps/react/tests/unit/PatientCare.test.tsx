import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PatientCare } from '../../src/app/components/PatientCare';

describe('PatientCare', () => {
  it('renders Patient Care heading', () => {
    render(<PatientCare />);
    expect(screen.getByRole('heading', { name: 'Patient Care' })).toBeInTheDocument();
  });

  it('renders Add Patient button', () => {
    render(<PatientCare />);
    expect(screen.getByRole('button', { name: /Add Patient/i })).toBeInTheDocument();
  });

  it('renders patient search input', () => {
    render(<PatientCare />);
    expect(screen.getByPlaceholderText('Search patients by name or room...')).toBeInTheDocument();
  });

  it('renders patient list', () => {
    render(<PatientCare />);
    expect(screen.getByText('John Davis')).toBeInTheDocument();
    expect(screen.getByText('Mary Wilson')).toBeInTheDocument();
  });

  it('renders patient room numbers', () => {
    render(<PatientCare />);
    expect(screen.getByText('Room 204A')).toBeInTheDocument();
  });

  it('selects a patient when clicked', async () => {
    const user = userEvent.setup();
    render(<PatientCare />);
    await user.click(screen.getByText('John Davis'));
    expect(screen.getByText('Hypertension')).toBeInTheDocument();
  });

  it('filters patients by search', async () => {
    const user = userEvent.setup();
    render(<PatientCare />);
    await user.type(screen.getByPlaceholderText('Search patients by name or room...'), 'Mary');
    expect(screen.getByText('Mary Wilson')).toBeInTheDocument();
    expect(screen.queryByText('John Davis')).not.toBeInTheDocument();
  });

  it('shows empty state when no search results', async () => {
    const user = userEvent.setup();
    render(<PatientCare />);
    await user.type(screen.getByPlaceholderText('Search patients by name or room...'), 'ZZZNOMATCH');
    expect(screen.getByText('No patients found')).toBeInTheDocument();
  });

  it('opens Add Patient modal', async () => {
    const user = userEvent.setup();
    render(<PatientCare />);
    fireEvent.click(screen.getAllByText('Add Patient')[0]);
    expect(screen.getByRole('heading', { name: 'Add New Patient' })).toBeInTheDocument();
  });

  it('closes Add Patient modal when X clicked', async () => {
    const user = userEvent.setup();
    render(<PatientCare />);
    fireEvent.click(screen.getAllByText('Add Patient')[0]);
    await user.click(screen.getAllByRole('button', { name: 'Close modal' })[0]);
    expect(screen.queryByRole('heading', { name: 'Add New Patient' })).not.toBeInTheDocument();
  });

  it('renders patient status badges', () => {
    render(<PatientCare />);
    expect(screen.getAllByText(/stable|critical|recovering/i).length).toBeGreaterThan(0);
  });

  it('shows patient details panel on selection', async () => {
    const user = userEvent.setup();
    render(<PatientCare />);
    await user.click(screen.getByText('John Davis'));
    expect(screen.getByText('Diagnosis')).toBeInTheDocument();
  });

  it('renders multiple patients', () => {
    render(<PatientCare />);
    const patients = screen.getAllByText(/Room/i);
    expect(patients.length).toBeGreaterThan(1);
  });
});
