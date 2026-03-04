<<<<<<< HEAD
/** @jest-environment jsdom */

=======
>>>>>>> origin/main
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Shortcuts from '../renderer/src/components/Shortcuts';

<<<<<<< HEAD
const mockOnBack = jest.fn();

beforeEach(() => {
  mockOnBack.mockClear();
});

describe('Shortcuts Component', () => {
  test('renders Keyboard Shortcuts heading', () => {
    render(<Shortcuts onBack={mockOnBack} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Keyboard Shortcuts');
    });

  test('renders Navigation section', () => {
    render(<Shortcuts onBack={mockOnBack} />);
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  test('renders Quick Actions section', () => {
    render(<Shortcuts onBack={mockOnBack} />);
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
  });

  test('renders Layout section', () => {
    render(<Shortcuts onBack={mockOnBack} />);
    expect(screen.getByText('Layout')).toBeInTheDocument();
  });

  test('renders Application section', () => {
    render(<Shortcuts onBack={mockOnBack} />);
    expect(screen.getByText('Application')).toBeInTheDocument();
  });

  test('renders back button', () => {
    render(<Shortcuts onBack={mockOnBack} />);
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  test('calls onBack when back button clicked', () => {
    render(<Shortcuts onBack={mockOnBack} />);
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test('renders Dashboard shortcut', () => {
    render(<Shortcuts onBack={mockOnBack} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('renders shortcut keys as kbd elements', () => {
    render(<Shortcuts onBack={mockOnBack} />);
    const kbdElements = document.querySelectorAll('kbd');
    expect(kbdElements.length).toBeGreaterThan(0);
  });

  test('renders New Task shortcut', () => {
    render(<Shortcuts onBack={mockOnBack} />);
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });
});
=======
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
>>>>>>> origin/main
