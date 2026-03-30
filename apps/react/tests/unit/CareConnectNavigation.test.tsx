import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CareConnectNavigation } from '../../src/app/components/CareConnectNavigation';

// Unit tests for CareConnectNavigation.
// Covers: rendering all nav items, active state styling, navigation callbacks,
// sidebar position toggle, logout, and mobile slide-over menu behaviour.
describe('CareConnectNavigation', () => {

  // Shared props used across all tests — individual tests override as needed
  const mockProps = {
    activeItem: 'dashboard',
    onNavigate: vi.fn(),
    onLogout: vi.fn(),
    sidebarPosition: 'left' as const,
    onSidebarPositionChange: vi.fn(),
  };

  // Confirms the desktop sidebar renders all primary nav item labels.
  // getAllByText is used because each label may appear in multiple nav surfaces
  // (desktop sidebar, tablet sidebar, mobile bottom bar).
  it('renders all navigation items in the desktop sidebar', () => {
    render(<CareConnectNavigation {...mockProps} />);
    expect(screen.getAllByText('Dashboard')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Tasks')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Patients')[0]).toBeInTheDocument();
  });

  // Clicking a nav label should call onNavigate with the matching route ID
  it('calls onNavigate with the correct id when a link is clicked', () => {
    render(<CareConnectNavigation {...mockProps} />);

    // Click the first Tasks label — corresponds to the desktop sidebar button
    const tasksButton = screen.getAllByText('Tasks')[0];
    fireEvent.click(tasksButton);

    expect(mockProps.onNavigate).toHaveBeenCalledWith('tasks');
  });

  // The active nav button should have the blue gradient classes applied
  it('highlights the active item based on the activeItem prop', () => {
    render(<CareConnectNavigation {...mockProps} activeItem="tasks" />);

    // Find the Tasks button that has the active gradient or solid blue class
    const tasksButtons = screen.getAllByRole('button');
    const activeTasksButton = tasksButtons.find((btn) =>
      btn.textContent?.includes('Tasks') &&
      (btn.className.includes('from-blue-500') || btn.className.includes('bg-blue-500'))
    );

    expect(activeTasksButton).toBeDefined();
  });

  // Clicking the layout toggle should call onSidebarPositionChange with the opposite position.
  // The toggle is located by finding the Layout label and querying its parent container.
  it('toggles sidebar position when the layout switch is clicked', () => {
    render(<CareConnectNavigation {...mockProps} sidebarPosition="left" />);

    const layoutLabel = screen.getByText('Layout');
    const container = layoutLabel.closest('.flex.items-center.justify-between');
    const toggleButton = container?.querySelector('button');

    if (!toggleButton) {
      throw new Error('Toggle button not found. Check if the container classes match.');
    }

    fireEvent.click(toggleButton);
    expect(mockProps.onSidebarPositionChange).toHaveBeenCalledWith('right');
  });

  // Clicking any logout button should invoke the onLogout callback
  it('calls onLogout when the logout button is clicked', () => {
    render(<CareConnectNavigation {...mockProps} />);

    // Logout may appear in both desktop and tablet sidebars — click the first instance
    const logoutButtons = screen.getAllByText(/logout/i);
    fireEvent.click(logoutButtons[0]);

    expect(mockProps.onLogout).toHaveBeenCalled();
  });

  // Mobile-specific interaction tests
  describe('Mobile Interactions', () => {

    // Clicking "More" in the mobile bottom bar should open the slide-over panel,
    // which adds a "Menu" heading and an additional Settings button to the DOM
    it('opens the mobile slide-over menu when "More" is clicked', () => {
      render(<CareConnectNavigation {...mockProps} />);

      fireEvent.click(screen.getByText('More'));

      expect(screen.getByText('Menu')).toBeInTheDocument();
      // Settings appears in the desktop sidebar AND the mobile slide-over
      expect(screen.getAllByText('Settings').length).toBeGreaterThan(1);
    });

    // Clicking a nav item inside the slide-over should call onNavigate
    // and close the panel (Menu heading disappears)
    it('closes the mobile menu after navigating', () => {
      render(<CareConnectNavigation {...mockProps} />);

      // Open the mobile slide-over
      fireEvent.click(screen.getByText('More'));

      // Click the Settings button inside the slide-over (last in DOM order)
      const settingsButtons = screen.getAllByText('Settings');
      const lastSettings = settingsButtons.at(-1);
      if (lastSettings) fireEvent.click(lastSettings);

      expect(mockProps.onNavigate).toHaveBeenCalledWith('settings');
      // Slide-over should be unmounted — Menu heading no longer present
      expect(screen.queryByText('Menu')).not.toBeInTheDocument();
    });
  });
});
