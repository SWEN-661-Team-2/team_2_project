import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CareConnectNavigation } from '../../src/app/components/CareConnectNavigation';

describe('CareConnectNavigation', () => {
  const mockProps = {
    activeItem: 'dashboard',
    onNavigate: vi.fn(),
    onLogout: vi.fn(),
    sidebarPosition: 'left' as const,
    onSidebarPositionChange: vi.fn(),
  };

  it('renders all navigation items in the desktop sidebar', () => {
    render(<CareConnectNavigation {...mockProps} />);
    
    // We check the first instance of these labels (Desktop view)
    expect(screen.getAllByText('Dashboard')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Tasks')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Patients')[0]).toBeInTheDocument();
  });

  it('calls onNavigate with the correct id when a link is clicked', () => {
    render(<CareConnectNavigation {...mockProps} />);
    
    const tasksButton = screen.getAllByText('Tasks')[0];
    fireEvent.click(tasksButton);
    
    expect(mockProps.onNavigate).toHaveBeenCalledWith('tasks');
  });

  it('highlights the active item based on the activeItem prop', () => {
    render(<CareConnectNavigation {...mockProps} activeItem="tasks" />);
    
    // Look for the "Tasks" button in the desktop sidebar
    const tasksButtons = screen.getAllByRole('button');
    const activeTasksButton = tasksButtons.find(btn => 
      btn.textContent?.includes('Tasks') && 
      (btn.className.includes('from-blue-500') || btn.className.includes('bg-blue-500'))
    );
    
    expect(activeTasksButton).toBeDefined();
  });

  it('toggles sidebar position when the layout switch is clicked', () => {
    render(<CareConnectNavigation {...mockProps} sidebarPosition="left" />);
    
    // Find the Layout label, then find the button within the same parent container
    const layoutLabel = screen.getByText('Layout');
    const container = layoutLabel.closest('.flex.items-center.justify-between');
    const toggleButton = container?.querySelector('button');
    
    if (!toggleButton) {
      throw new Error('Toggle button not found. Check if the container classes match.');
    }
    
    fireEvent.click(toggleButton);
    expect(mockProps.onSidebarPositionChange).toHaveBeenCalledWith('right');
  });

  it('calls onLogout when the logout button is clicked', () => {
    render(<CareConnectNavigation {...mockProps} />);
    
    const logoutButtons = screen.getAllByText(/logout/i);
    fireEvent.click(logoutButtons[0]); 
    
    expect(mockProps.onLogout).toHaveBeenCalled();
  });

  describe('Mobile Interactions', () => {
    it('opens the mobile slide-over menu when "More" is clicked', () => {
      render(<CareConnectNavigation {...mockProps} />);
      
      const moreButton = screen.getByText('More');
      fireEvent.click(moreButton);
      
      expect(screen.getByText('Menu')).toBeInTheDocument();
      // Settings appears in Desktop and now the Mobile Menu slide-over
      expect(screen.getAllByText('Settings').length).toBeGreaterThan(1);
    });

    it('closes the mobile menu after navigating', () => {
      render(<CareConnectNavigation {...mockProps} />);
      
      // Open mobile menu
      fireEvent.click(screen.getByText('More'));
      
      // Click the 'Settings' button inside the mobile menu (usually the last one in the DOM)
      const settingsButtons = screen.getAllByText('Settings');
      fireEvent.click(settingsButtons[settingsButtons.length - 1]);
      
      expect(mockProps.onNavigate).toHaveBeenCalledWith('settings');
      // The "Menu" header should be gone
      expect(screen.queryByText('Menu')).not.toBeInTheDocument();
    });
  });
});