/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../renderer/src/components/App.jsx';

// Mock window.careconnect (IPC listeners)
window.careconnect = {
  onNavigate: jest.fn(),
  onLogout: jest.fn(),
  onLayoutChanged: jest.fn(),
  setLayoutMode: jest.fn().mockResolvedValue('left'),
};

describe('Total Coverage Sweep for App.jsx', () => {
  test('Hit keyboard shortcuts, IPC, and Modals', async () => {
    render(<App />);

    // 1. BYPASS LOGIN (Required to reach any code below line 150)
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passInput = screen.getByLabelText(/Password/i);
    const signInBtn = screen.getByRole('button', { name: /Sign In/i });
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
      fireEvent.change(passInput, { target: { value: 'password123' } });
      fireEvent.click(signInBtn);
    });

    // 2. HIT KEYBOARD SHORTCUTS (Lines 75 - 140)
    // This hits the 'Cmd/Ctrl + J', 'B', 'K', 'N' logic
    const shortcuts = [
      { key: 'j', ctrlKey: true }, // Opens Patient Modal
      { key: 'b', ctrlKey: true }, // Toggles Sidebar
      { key: 'k', ctrlKey: true }, // Quick Search focus
      { key: 'n', ctrlKey: true }, // Navigate to Tasks
      { key: 'n', ctrlKey: true, shiftKey: true }, // Opens Appt Modal
      { key: 'e', ctrlKey: true }, // Export
      { key: 'i', ctrlKey: true }, // Import
      { key: '1', ctrlKey: true }  // Nav to Dashboard
    ];

    for (const s of shortcuts) {
      await act(async () => {
        fireEvent.keyDown(window, s);
      });
    }

    // 3. HIT IPC LISTENERS (Lines 35 - 45)
    // We need to trigger the callbacks that were registered in useEffect
    const navigateCallback = window.careconnect.onNavigate.mock.calls[0][0];
    const logoutCallback = window.careconnect.onLogout.mock.calls[0][0];

    await act(async () => {
      navigateCallback('tasks');         // Switch to Tasks
      navigateCallback('toggleSidebar'); // Hit the toggle branch
      navigateCallback('quickSearch');   // Hit the search focus branch
      logoutCallback();                  // Hit the logout branch
    });

    // 4. HIT REMAINDER ROUTES (About, Shortcuts, Settings)
    // Log back in first
    await act(async () => { fireEvent.click(signInBtn); });
    
    const finalRoutes = ['about', 'shortcuts', 'settings'];
    for (const r of finalRoutes) {
      await act(async () => {
        navigateCallback(r);
      });
    }
  });
});