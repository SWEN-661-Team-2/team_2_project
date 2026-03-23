import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CareConnectNavigation } from '../../src/app/components/CareConnectNavigation';

const mockOnNavigate = jest.fn();
const mockOnLogout = jest.fn();
const mockOnSidebarPositionChange = jest.fn();

const defaultProps = {
  activeItem: 'dashboard',
  onNavigate: mockOnNavigate,
  onLogout: mockOnLogout,
  sidebarPosition: 'left' as const,
  onSidebarPositionChange: mockOnSidebarPositionChange,
};

beforeEach(() => {
  mockOnNavigate.mockClear();
  mockOnLogout.mockClear();
  mockOnSidebarPositionChange.mockClear();
});

describe('CareConnectNavigation', () => {
  it('renders CareConnect brand name', () => {
    render(<CareConnectNavigation {...defaultProps} />);
    expect(screen.getAllByText('CareConnect')[0]).toBeInTheDocument();
  });

  it('renders all nav items', () => {
    render(<CareConnectNavigation {...defaultProps} />);
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tasks').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Schedule').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Patients').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Settings').length).toBeGreaterThan(0);
  });

  it('calls onNavigate when nav item clicked', async () => {
    const user = userEvent.setup();
    render(<CareConnectNavigation {...defaultProps} />);
    await user.click(screen.getAllByText('Tasks')[0]);
    expect(mockOnNavigate).toHaveBeenCalledWith('tasks');
  });

  it('calls onLogout when logout clicked', async () => {
    const user = userEvent.setup();
    render(<CareConnectNavigation {...defaultProps} />);
    await user.click(screen.getAllByRole('button', { name: 'Logout' })[0]);
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  it('calls onNavigate for dashboard', async () => {
    const user = userEvent.setup();
    render(<CareConnectNavigation {...defaultProps} activeItem="tasks" />);
    await user.click(screen.getAllByText('Dashboard')[0]);
    expect(mockOnNavigate).toHaveBeenCalledWith('dashboard');
  });

  it('calls onNavigate for schedule', async () => {
    const user = userEvent.setup();
    render(<CareConnectNavigation {...defaultProps} />);
    await user.click(screen.getAllByText('Schedule')[0]);
    expect(mockOnNavigate).toHaveBeenCalledWith('schedule');
  });

  it('calls onNavigate for patients', async () => {
    const user = userEvent.setup();
    render(<CareConnectNavigation {...defaultProps} />);
    await user.click(screen.getAllByText('Patients')[0]);
    expect(mockOnNavigate).toHaveBeenCalledWith('patients');
  });

  it('calls onNavigate for settings', async () => {
    const user = userEvent.setup();
    render(<CareConnectNavigation {...defaultProps} />);
    await user.click(screen.getAllByText('Settings')[0]);
    expect(mockOnNavigate).toHaveBeenCalledWith('settings');
  });

  it('toggles sidebar position when switch layout clicked', async () => {
    const user = userEvent.setup();
    render(<CareConnectNavigation {...defaultProps} />);
    await user.click(screen.getAllByRole('button', { name: 'Toggle sidebar position' })[0]);
    expect(mockOnSidebarPositionChange).toHaveBeenCalledWith('right');
  });

  it('renders with right sidebar position', () => {
    render(<CareConnectNavigation {...defaultProps} sidebarPosition="right" />);
    const sidebar = document.querySelector('aside');
    expect(sidebar?.className).toMatch(/right-0/);
  });

  it('highlights active nav item', () => {
    render(<CareConnectNavigation {...defaultProps} activeItem="tasks" />);
    const taskButtons = screen.getAllByText('Tasks');
    expect(taskButtons[0].closest('button')?.className).toMatch(/from-blue-500/);
  });

  it('renders without external sidebar position', () => {
    render(<CareConnectNavigation
      activeItem="dashboard"
      onNavigate={mockOnNavigate}
    />);
    expect(screen.getAllByText('CareConnect')[0]).toBeInTheDocument();
  });

  it('opens mobile menu when More button clicked', async () => {
    const user = userEvent.setup();
    render(<CareConnectNavigation {...defaultProps} />);
    const moreButton = screen.getByRole('button', { name: 'More' });
    await user.click(moreButton);
    expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
  });

  it('closes mobile menu when close button clicked', async () => {
    const user = userEvent.setup();
    render(<CareConnectNavigation {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: 'More' }));
    await user.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(screen.queryByText('More Options')).not.toBeInTheDocument();
  });

  it('navigates to settings from mobile menu', async () => {
    const user = userEvent.setup();
    render(<CareConnectNavigation {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: 'More' }));
    const settingsButtons = screen.getAllByText('Settings');
    await user.click(settingsButtons[settingsButtons.length - 1]);
    expect(mockOnNavigate).toHaveBeenCalledWith('settings');
  });
});
