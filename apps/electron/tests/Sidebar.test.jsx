/** @jest-environment jsdom */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from '../renderer/src/components/Sidebar';

const mockNavigate = jest.fn();
const mockToggleLayout = jest.fn();
const mockLogout = jest.fn();

beforeEach(() => {
  mockNavigate.mockClear();
  mockToggleLayout.mockClear();
  mockLogout.mockClear();
});

describe('Sidebar Component', () => {
  test('renders CareConnect brand', () => {
    render(<Sidebar route="dashboard" open={true} layoutMode="right" onNavigate={mockNavigate} onToggleLayout={mockToggleLayout} onLogout={mockLogout} />);
    expect(screen.getByText('CareConnect')).toBeInTheDocument();
  });

  test('renders nav items when open', () => {
    render(<Sidebar route="dashboard" open={true} layoutMode="right" onNavigate={mockNavigate} onToggleLayout={mockToggleLayout} onLogout={mockLogout} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });

  test('calls onNavigate when nav item clicked', () => {
    render(<Sidebar route="dashboard" open={true} layoutMode="right" onNavigate={mockNavigate} onToggleLayout={mockToggleLayout} onLogout={mockLogout} />);
    fireEvent.click(screen.getByText('Tasks'));
    expect(mockNavigate).toHaveBeenCalledWith('tasks');
  });

  test('calls onToggleLayout when layout button clicked', () => {
    render(<Sidebar route="dashboard" open={true} layoutMode="right" onNavigate={mockNavigate} onToggleLayout={mockToggleLayout} onLogout={mockLogout} />);
    fireEvent.click(screen.getByTitle(/left-handed/i));
    expect(mockToggleLayout).toHaveBeenCalled();
  });

  test('calls onLogout when logout clicked', () => {
    render(<Sidebar route="dashboard" open={true} layoutMode="right" onNavigate={mockNavigate} onToggleLayout={mockToggleLayout} onLogout={mockLogout} />);
    fireEvent.click(screen.getByTitle('Logout'));
    expect(mockLogout).toHaveBeenCalled();
  });

  test('shows left-handed toggle when in right mode', () => {
    render(<Sidebar route="dashboard" open={true} layoutMode="right" onNavigate={mockNavigate} onToggleLayout={mockToggleLayout} onLogout={mockLogout} />);
    expect(screen.getByText('Left-Handed')).toBeInTheDocument();
  });

  test('shows right-handed toggle when in left mode', () => {
    render(<Sidebar route="dashboard" open={true} layoutMode="left" onNavigate={mockNavigate} onToggleLayout={mockToggleLayout} onLogout={mockLogout} />);
    expect(screen.getByText('Right-Handed')).toBeInTheDocument();
  });

  test('active route has active class', () => {
    render(<Sidebar route="tasks" open={true} layoutMode="right" onNavigate={mockNavigate} onToggleLayout={mockToggleLayout} onLogout={mockLogout} />);
    expect(screen.getByTitle('Tasks').closest('button')).toHaveClass('active');
  });
});
