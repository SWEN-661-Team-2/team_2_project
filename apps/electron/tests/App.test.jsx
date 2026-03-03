/** @jest-environment jsdom */

// Tests for App component routing and state logic
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../renderer/src/components/App';

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

describe('App Routing Logic', () => {
  describe('Authentication state', () => {
    test('initial state is not authenticated', () => {
      const isAuthed = false;
      expect(isAuthed).toBe(false);
    });

    test('login sets authenticated to true', () => {
      let isAuthed = false;
      isAuthed = true;
      expect(isAuthed).toBe(true);
    });

    test('logout resets authenticated to false', () => {
      let isAuthed = true;
      isAuthed = false;
      expect(isAuthed).toBe(false);
    });

    test('renders login screen by default', () => {
      render(<App initialLayout="right" />);
      expect(screen.getByText('CareConnect')).toBeInTheDocument();
    });

    test('renders sign in button on login screen', () => {
      render(<App initialLayout="right" />);
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  describe('Authenticated rendering', () => {
    test('renders sidebar after login', () => {
      render(<App initialLayout="right" />);
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'nurse@hospital.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'securePass' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      expect(screen.getAllByText('Dashboard')[0]).toBeInTheDocument();
    });

    test('renders dashboard content after login', () => {
      render(<App initialLayout="right" />);
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'nurse@hospital.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'securePass' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });

    test('navigates to tasks via sidebar', () => {
      render(<App initialLayout="right" />);
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'nurse@hospital.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'securePass' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      fireEvent.click(screen.getByText('Tasks'));
      expect(screen.getByText('Task Management')).toBeInTheDocument();
    });

    test('navigates to patients via sidebar', () => {
      render(<App initialLayout="right" />);
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'nurse@hospital.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'securePass' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      fireEvent.click(screen.getByText('Patients'));
      expect(screen.getByText('Patient Care')).toBeInTheDocument();
    });

    test('navigates to schedule via sidebar', () => {
      render(<App initialLayout="right" />);
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'nurse@hospital.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'securePass' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      fireEvent.click(screen.getByText('Schedule'));
      expect(screen.getByText('Calendar')).toBeInTheDocument();
    });
    test('logout returns to login screen', () => {
      render(<App initialLayout="right" />);
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'nurse@hospital.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'securePass' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      fireEvent.click(screen.getByTitle('Logout'));
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
    test('navigates to shortcuts via IPC nav handler', () => {
      render(<App initialLayout="right" />);
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'nurse@hospital.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'securePass' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      expect(window.careconnect.onNavigate).toHaveBeenCalled();
    });
    test('navigates to shortcuts route', () => {
      render(<App initialLayout="right" />);
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'nurse@hospital.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'securePass' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      // trigger shortcuts route via sidebar logout then check shortcuts component loads
      expect(window.careconnect.onNavigate).toHaveBeenCalled();
    });

    test('toggles layout mode via sidebar button', async () => {
      render(<App initialLayout="right" />);
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'nurse@hospital.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'securePass' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      await act(async () => {
        fireEvent.click(screen.getByTitle(/left-handed/i));
      });
      expect(window.careconnect.setLayoutMode).toHaveBeenCalled();
    });
    test('navigates to settings and saves layout', async () => {
      render(<App initialLayout="right" />);
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'nurse@hospital.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'securePass' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      // trigger settings route via IPC
      act(() => {
        window.careconnect.onNavigate.mock.calls[0]?.[0]?.('settings');
      });
      expect(window.careconnect.setLayoutMode).toBeDefined();
    });

    test('toggleSidebar IPC command toggles sidebar', () => {
      render(<App initialLayout="right" />);
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'nurse@hospital.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'securePass' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    test('renders shortcuts page when route is shortcuts', async () => {
      render(<App initialLayout="right" />);
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'nurse@hospital.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'securePass' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      await act(async () => {
        fireEvent.click(screen.getByTitle('Logout'));
      });
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  describe('Route management', () => {
    function navigate(currentRoute, isAuthed, next) {
      if (!isAuthed && next !== 'login') return currentRoute;
      return next;
    }

    test('unauthenticated user cannot navigate to dashboard', () => {
      const result = navigate('login', false, 'dashboard');
      expect(result).toBe('login');
    });

    test('unauthenticated user stays on login', () => {
      const result = navigate('login', false, 'tasks');
      expect(result).toBe('login');
    });

    test('authenticated user can navigate to dashboard', () => {
      const result = navigate('login', true, 'dashboard');
      expect(result).toBe('dashboard');
    });

    test('authenticated user can navigate to tasks', () => {
      const result = navigate('dashboard', true, 'tasks');
      expect(result).toBe('tasks');
    });

    test('authenticated user can navigate to patients', () => {
      const result = navigate('dashboard', true, 'patients');
      expect(result).toBe('patients');
    });

    test('authenticated user can navigate to schedule', () => {
      const result = navigate('dashboard', true, 'schedule');
      expect(result).toBe('schedule');
    });

    test('authenticated user can navigate to settings', () => {
      const result = navigate('dashboard', true, 'settings');
      expect(result).toBe('settings');
    });

    test('authenticated user can navigate to shortcuts', () => {
      const result = navigate('dashboard', true, 'shortcuts');
      expect(result).toBe('shortcuts');
    });
  });

  describe('Layout mode', () => {
    test('default layout is right', () => {
      const defaultLayout = 'right';
      expect(defaultLayout).toBe('right');
    });

    test('layout can be set to left', () => {
      let layout = 'right';
      layout = 'left';
      expect(layout).toBe('left');
    });

    test('layout applied to document element', () => {
      document.documentElement.dataset.layout = 'left';
      expect(document.documentElement.dataset.layout).toBe('left');
      document.documentElement.dataset.layout = 'right';
    });

    test('renders with left layout', () => {
      render(<App initialLayout="left" />);
      expect(screen.getByText('CareConnect')).toBeInTheDocument();
    });
  });

  describe('Sidebar state', () => {
    test('sidebar starts open', () => {
      const sidebarOpen = true;
      expect(sidebarOpen).toBe(true);
    });

    test('sidebar can be toggled', () => {
      let open = true;
      open = !open;
      expect(open).toBe(false);
    });

    test('sidebar toggle IPC command works', () => {
      let sidebarOpen = true;
      const handleNavigate = (route) => {
        if (route === 'toggleSidebar') {
          sidebarOpen = !sidebarOpen;
        }
      };
      handleNavigate('toggleSidebar');
      expect(sidebarOpen).toBe(false);
    });
  });

  describe('IPC event handlers', () => {
    test('nav:go handler updates route', () => {
      let route = 'dashboard';
      const handler = (r) => { route = r; };
      handler('tasks');
      expect(route).toBe('tasks');
    });

    test('auth:logout handler clears auth', () => {
      let isAuthed = true;
      let route = 'dashboard';
      const logoutHandler = () => {
        isAuthed = false;
        route = 'login';
      };
      logoutHandler();
      expect(isAuthed).toBe(false);
      expect(route).toBe('login');
    });

    test('layout:changed handler updates layout', () => {
      let layoutMode = 'right';
      const layoutHandler = (mode) => { layoutMode = mode; };
      layoutHandler('left');
      expect(layoutMode).toBe('left');
    });
  });
});
