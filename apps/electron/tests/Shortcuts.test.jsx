/** @jest-environment jsdom */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Shortcuts from '../renderer/src/components/Shortcuts';

describe('Shortcuts Component Logic and Accessibility', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
  });

  test('renders all shortcut groups and titles', () => {
    render(<Shortcuts onBack={mockOnBack} />);
    
    // Verify the page titles
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Keyboard Shortcuts');
    expect(screen.getByText(/Complete reference/i)).toBeInTheDocument();

    // Verify all group headings are present
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Layout')).toBeInTheDocument();
    expect(screen.getByText('Application')).toBeInTheDocument();
  });

  test('renders all shortcuts within the tables', () => {
    render(<Shortcuts onBack={mockOnBack} />);

    // Navigation Group check
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Cmd/Ctrl + 1')).toBeInTheDocument();

    // Quick Actions Group check
    expect(screen.getByText('New Appointment')).toBeInTheDocument();
    expect(screen.getByText('Cmd/Ctrl + Shift + N')).toBeInTheDocument();

    // Application Group check
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    expect(screen.getByText('Cmd/Ctrl + /')).toBeInTheDocument();

    // Verify table structure/accessibility: One table for each shortcut group
    const tables = screen.getAllByRole('table');
    expect(tables).toHaveLength(4); 
  });

  test('calls onBack when the button is clicked', () => {
    render(<Shortcuts onBack={mockOnBack} />);
    
    // Support both the specific label and the generic "back" search
    const backBtn = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backBtn);
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test('renders shortcut keys as kbd elements with correct classes', () => {
    render(<Shortcuts onBack={mockOnBack} />);
    
    // Verify the visual 'kbd' tags are rendering
    const kbdElements = document.querySelectorAll('kbd');
    expect(kbdElements.length).toBeGreaterThan(0);
    
    const specificKbd = screen.getByText('Cmd/Ctrl + B');
    expect(specificKbd).toHaveClass('kbd');
  });
});