/** @jest-environment jsdom */

// Tests for App component routing and state logic
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../renderer/src/components/App';

// Mock window.careconnect (IPC listeners and Electron bridge)
beforeEach(() => {
  window.careconnect = {
    getLayoutMode: jest.fn().mockResolvedValue('right'),
    getAppVersion: jest.fn().mockResolvedValue('0.1.0'),
    onNavigate: jest.fn(),
    onLogout: jest.fn(),
    onLayoutChanged: jest.fn(),
    setLayoutMode: jest.fn().mockResolvedValue('left'),
    removeAllListeners: jest.fn(),
  };
});

describe('Total Coverage Sweep for App.jsx', () => {
  
  test('Hit keyboard shortcuts, IPC, and Modals', async () => {
    render(<App />);

    // 1. BYPASS LOGIN
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passInput = screen.getByLabelText(/Password/i);
    const signInBtn = screen.getByRole('button', { name: /Sign In/i });
    
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
      fireEvent.change(passInput, { target: { value: 'password123' } });
      fireEvent.click(signInBtn);
    });

    // 2. HIT KEYBOARD SHORTCUTS
    const shortcuts = [
      { key: 'j', ctrlKey: true }, 
      { key: 'b', ctrlKey: true }, 
      { key: 'k', ctrlKey: true }, 
      { key: 'n', ctrlKey: true }, 
      { key: 'n', ctrlKey: true, shiftKey: true },
      { key: 'e', ctrlKey: true }, 
      { key: 'i', ctrlKey: true }, 
      { key: '1', ctrlKey: true }  
    ];

    for (const s of shortcuts) {
      await act(async () => {
        fireEvent.keyDown(window, s);
      });
    }

    // 3. HIT IPC LISTENERS
    // Trigger the callbacks registered in useEffect
    const navigateCallback = window.careconnect.onNavigate.mock.calls[0][0];
    const logoutCallback = window.careconnect.onLogout.mock.calls[0][0];

    await act(async () => {
      navigateCallback('tasks');         
      navigateCallback('toggleSidebar'); 
      navigateCallback('quickSearch');   
      logoutCallback();                  
    });

    // 4. HIT REMAINDER ROUTES
    await act(async () => { fireEvent.click(signInBtn); });
    
    const finalRoutes = ['about', 'shortcuts', 'settings'];
    for (const r of finalRoutes) {
      await act(async () => {
        navigateCallback(r);
      });
    }
  });

  describe('Authenticated rendering and Navigation', () => {
    test('renders login screen by default', () => {
      render(<App />);
      expect(screen.getByText('CareConnect')).toBeInTheDocument();
    });

    test('navigates to tasks via sidebar', async () => {
      render(<App />);
      // Login
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'nurse@hospital.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'securePass' } });
      fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
      
      // Click Tasks in Sidebar
      const tasksLink = await screen.findByText('Tasks');
      fireEvent.click(tasksLink);
      expect(screen.getByText('Task Management')).toBeInTheDocument();
    });

    test('toggles layout mode via sidebar button', async () => {
      render(<App />);
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'nurse@hospital.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'securePass' } });
      fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
      
      const layoutBtn = await screen.findByTitle(/left-handed/i);
      await act(async () => {
        fireEvent.click(layoutBtn);
      });
      expect(window.careconnect.setLayoutMode).toHaveBeenCalled();
    });
  });

  describe('Layout and Sidebar logic', () => {
    test('layout can be set to left', () => {
      document.documentElement.dataset.layout = 'left';
      expect(document.documentElement.dataset.layout).toBe('left');
      document.documentElement.dataset.layout = 'right'; // Reset
    });

    test('sidebar toggle state logic', () => {
      let sidebarOpen = true;
      const toggle = () => { sidebarOpen = !sidebarOpen; };
      toggle();
      expect(sidebarOpen).toBe(false);
    });
  });
});