import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Shortcuts from '../renderer/src/components/Shortcuts';

describe('Shortcuts Component', () => {
  const mockOnBack = jest.fn();

  test('renders all shortcut groups and titles', () => {
    render(<Shortcuts onBack={mockOnBack} />);
    
    // Verify the page titles
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    expect(screen.getByText(/Complete reference/i)).toBeInTheDocument();

    // Verify all group headings are present
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Layout')).toBeInTheDocument();
    expect(screen.getByText('Application')).toBeInTheDocument();
  });

  test('renders all shortcuts within the tables', () => {
    render(<Shortcuts onBack={mockOnBack} />);

    // Verify specific shortcuts from different groups to ensure full mapping
    // Navigation Group
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Cmd/Ctrl + 1')).toBeInTheDocument();

    // Quick Actions Group
    expect(screen.getByText('New Appointment')).toBeInTheDocument();
    expect(screen.getByText('Cmd/Ctrl + Shift + N')).toBeInTheDocument();

    // Application Group
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    expect(screen.getByText('Cmd/Ctrl + /')).toBeInTheDocument();

    // Verify table structure/accessibility
    const tables = screen.getAllByRole('table');
    expect(tables).toHaveLength(4); // One for each SHORTCUT_GROUPS entry
  });

  test('calls onBack when the button is clicked', () => {
    render(<Shortcuts onBack={mockOnBack} />);
    
    const backBtn = screen.getByRole('button', { name: /Back to Dashboard/i });
    fireEvent.click(backBtn);
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test('renders the correct keyboard tags (kbd)', () => {
    render(<Shortcuts onBack={mockOnBack} />);
    
    // Checking a sample kbd element for the correct class
    const kbdElement = screen.getByText('Cmd/Ctrl + B');
    expect(kbdElement).toHaveClass('kbd');
  });
});