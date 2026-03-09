/** @jest-environment jsdom */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Shortcuts from '../renderer/src/components/Shortcuts';

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

  beforeEach(() => {
    mockOnBack.mockClear();
  });
});
