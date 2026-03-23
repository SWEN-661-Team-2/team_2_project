import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsPage } from '../../src/app/components/SettingsPage';

const mockOnLeftHandedChange = jest.fn();

const defaultProps = {
  leftHandedMode: false,
  onLeftHandedChange: mockOnLeftHandedChange,
};

beforeEach(() => mockOnLeftHandedChange.mockClear());

describe('SettingsPage', () => {
  it('renders Settings & Preferences heading', () => {
    render(<SettingsPage {...defaultProps} />);
    expect(screen.getByText('Settings & Preferences')).toBeInTheDocument();
  });

  it('renders General tab by default', () => {
    render(<SettingsPage {...defaultProps} />);
    expect(screen.getByText('General')).toBeInTheDocument();
  });

  it('renders Accessibility tab', () => {
    render(<SettingsPage {...defaultProps} />);
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
  });

  it('renders Notifications tab', () => {
    render(<SettingsPage {...defaultProps} />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('renders Left-Handed Mode toggle', () => {
    render(<SettingsPage {...defaultProps} />);
    expect(screen.getByRole('switch', { name: 'Left-Handed Mode' })).toBeInTheDocument();
  });

  it('Left-Handed Mode toggle is off by default', () => {
    render(<SettingsPage {...defaultProps} />);
    expect(screen.getByRole('switch', { name: 'Left-Handed Mode' })).toHaveAttribute('aria-checked', 'false');
  });

  it('Left-Handed Mode toggle is on when prop is true', () => {
    render(<SettingsPage leftHandedMode={true} onLeftHandedChange={mockOnLeftHandedChange} />);
    expect(screen.getByRole('switch', { name: 'Left-Handed Mode' })).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onLeftHandedChange when Left-Handed Mode toggled', async () => {
    const user = userEvent.setup();
    render(<SettingsPage {...defaultProps} />);
    await user.click(screen.getByRole('switch', { name: 'Left-Handed Mode' }));
    expect(mockOnLeftHandedChange).toHaveBeenCalledWith('right');
  });

  it('renders Save Changes button', () => {
    render(<SettingsPage {...defaultProps} />);
    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
  });

  it('shows saved confirmation after Save Changes clicked', async () => {
    const user = userEvent.setup();
    render(<SettingsPage {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /Save Changes/i }));
    const toggle = screen.getByRole('switch', { name: 'Left-Handed Mode' });
    await user.click(toggle);
    await user.click(screen.getByRole('button', { name: /Save Changes/i }));
    expect(await screen.findByText('Settings saved')).toBeInTheDocument();
  });

  it('switches to Accessibility tab', async () => {
    const user = userEvent.setup();
    render(<SettingsPage {...defaultProps} />);
    await user.click(screen.getByText('Accessibility'));
    expect(screen.getByText('Enhanced Keyboard Navigation')).toBeInTheDocument();
  });

  it('switches to Notifications tab', async () => {
    const user = userEvent.setup();
    render(<SettingsPage {...defaultProps} />);
    await user.click(screen.getByText('Notifications'));
    expect(screen.getByText('Task Reminders')).toBeInTheDocument();
  });

  it('renders user name field', () => {
    render(<SettingsPage {...defaultProps} />);
    expect(screen.getByDisplayValue('Sarah Johnson, RN')).toBeInTheDocument();
  });

  it('renders default zoom dropdown', () => {
    render(<SettingsPage {...defaultProps} />);
    expect(screen.getByDisplayValue('100%')).toBeInTheDocument();
  });

  it('toggles High Contrast Mode in Accessibility tab', async () => {
    const user = userEvent.setup();
    render(<SettingsPage {...defaultProps} />);
    await user.click(screen.getByText('Accessibility'));
    const toggle = screen.getByRole('switch', { name: 'High Contrast Mode' });
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles Task Reminders in Notifications tab', async () => {
    const user = userEvent.setup();
    render(<SettingsPage {...defaultProps} />);
    await user.click(screen.getByText('Notifications'));
    const toggle = screen.getByRole('switch', { name: 'Task Reminders' });
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });
});

describe('SettingsPage - additional coverage', () => {
  it('updates user name field', async () => {
    const user = userEvent.setup();
    render(<SettingsPage {...defaultProps} />);
    const nameInput = screen.getByDisplayValue('Sarah Johnson, RN');
    await user.clear(nameInput);
    await user.type(nameInput, 'Jane Doe');
    expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
  });

  it('updates user role field', async () => {
    const user = userEvent.setup();
    render(<SettingsPage {...defaultProps} />);
    const roleInput = screen.getByDisplayValue('Registered Nurse');
    await user.clear(roleInput);
    await user.type(roleInput, 'Doctor');
    expect(screen.getByDisplayValue('Doctor')).toBeInTheDocument();
  });

  it('enables Save Changes after making a change', async () => {
    const user = userEvent.setup();
    render(<SettingsPage {...defaultProps} />);
    await user.click(screen.getByRole('switch', { name: 'Left-Handed Mode' }));
    expect(screen.getByRole('button', { name: /Save Changes/i })).not.toBeDisabled();
  });

  it('toggles Enhanced Keyboard Navigation', async () => {
    const user = userEvent.setup();
    render(<SettingsPage {...defaultProps} />);
    await user.click(screen.getByText('Accessibility'));
    const toggle = screen.getByRole('switch', { name: 'Enhanced Keyboard Navigation' });
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles Always Show Focus Indicators', async () => {
    const user = userEvent.setup();
    render(<SettingsPage {...defaultProps} />);
    await user.click(screen.getByText('Accessibility'));
    const toggle = screen.getByRole('switch', { name: 'Always Show Focus Indicators' });
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles Reduce Motion', async () => {
    const user = userEvent.setup();
    render(<SettingsPage {...defaultProps} />);
    await user.click(screen.getByText('Accessibility'));
    const toggle = screen.getByRole('switch', { name: 'Reduce Motion' });
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles Urgent Task Alerts', async () => {
    const user = userEvent.setup();
    render(<SettingsPage {...defaultProps} />);
    await user.click(screen.getByText('Notifications'));
    const toggle = screen.getByRole('switch', { name: 'Urgent Task Alerts' });
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('changes zoom level', async () => {
    const user = userEvent.setup();
    render(<SettingsPage {...defaultProps} />);
    const zoom = screen.getByDisplayValue('100%');
    await user.selectOptions(zoom, '125%');
    expect(screen.getByDisplayValue('125%')).toBeInTheDocument();
  });

  it('Enter key toggles switch', () => {
    render(<SettingsPage {...defaultProps} />);
    const toggle = screen.getByRole('switch', { name: 'Left-Handed Mode' });
    toggle.focus();
    fireEvent.keyDown(toggle, { key: 'Enter' });
    expect(mockOnLeftHandedChange).toHaveBeenCalled();
  });
});
