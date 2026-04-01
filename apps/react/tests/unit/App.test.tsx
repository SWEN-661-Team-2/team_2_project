import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import App from '../../src/App';
import { useAppContext } from '../../src/app/context/AppContext';

// Mock the AppContext module so tests can control auth and settings state
// without relying on localStorage or a real AppProvider
vi.mock('../../src/app/context/AppContext', () => ({
  useAppContext: vi.fn(),
}));

// Mock heavy page components to keep App.test.tsx focused on routing logic only.
// Each mock returns a minimal identifiable element so assertions remain simple.
vi.mock('../../src/app/components/Login', () => ({
  Login: () => <div>Mock Login Page</div>,
}));
vi.mock('../../src/app/components/CareConnectDashboard', () => ({
  CareConnectDashboard: () => <div>Mock Dashboard Content</div>,
}));
vi.mock('../../src/app/components/CareConnectNavigation', () => ({
  CareConnectNavigation: () => <nav>Mock Navigation</nav>,
}));

describe('App Routing', () => {

  // Base context shape used across all tests — unauthenticated by default.
  // Individual tests spread this and override only the fields they need.
  const mockContextBase = {
    state: {
      isLoggedIn: false,
      sidebarPosition: 'left' as const,
      tasks: [],
      patients: [],
      settings: {
        theme: 'light' as const,
        highContrastMode: false,
        defaultZoom: '100%',
        leftHandedMode: false,
        userName: '',
        userRole: '',
        enhancedKeyboardNav: false,
        alwaysFocusIndicators: false,
        reduceMotion: false,
        taskReminders: false,
        urgentTaskAlerts: false,
        reminderLeadTime: '15 minutes',
      },
    },
    login: vi.fn(),
    logout: vi.fn(),
    setSidebarPosition: vi.fn(),
    updateAllSettings: vi.fn(),
  };

  // Reset all mock call counts and return values before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Unauthenticated users navigating to any route should be redirected to login
  it('redirects to login when not authenticated', () => {
    vi.mocked(useAppContext).mockReturnValue(mockContextBase);

    render(
      <MemoryRouter initialEntries={['/tasks']}>
        <App />
      </MemoryRouter>
    );

    // The Login mock renders this text — its presence confirms the redirect worked
    expect(screen.getByText(/Mock Login Page/i)).toBeInTheDocument();
  });

  // Authenticated users at the root path should see the dashboard
  it('renders dashboard when authenticated', () => {
    vi.mocked(useAppContext).mockReturnValue({
      ...mockContextBase,
      state: { ...mockContextBase.state, isLoggedIn: true },
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Mock Dashboard Content/i)).toBeInTheDocument();
  });

  // When theme is 'dark', AppLayout's useEffect should add 'dark' to <html>
  it('applies dark theme class to document root', () => {
    vi.mocked(useAppContext).mockReturnValue({
      ...mockContextBase,
      state: {
        ...mockContextBase.state,
        isLoggedIn: true,
        settings: { ...mockContextBase.state.settings, theme: 'dark' },
      },
    });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
