import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import App from '../../src/App';
import { useAppContext } from '../../src/app/context/AppContext';

// 1. Mock the Context
vi.mock('../../src/app/context/AppContext', () => ({
  useAppContext: vi.fn(),
}));

// 2. Fix the Mock paths to match your project structure
// We mock these to keep the App test focused only on Routing logic
vi.mock('../../src/app/components/Login', () => ({ 
  Login: () => <div>Mock Login Page</div> 
}));
vi.mock('../../src/app/components/CareConnectDashboard', () => ({ 
  CareConnectDashboard: () => <div>Mock Dashboard Content</div> 
}));
vi.mock('../../src/app/components/CareConnectNavigation', () => ({ 
  CareConnectNavigation: () => <nav>Mock Navigation</nav> 
}));

describe('App Routing', () => {
  const mockContextBase = {
    state: {
      isLoggedIn: false,
      sidebarPosition: 'left' as const,
      settings: {
        theme: 'light',
        highContrastMode: false,
        defaultZoom: '100%',
      },
    },
    login: vi.fn(),
    logout: vi.fn(),
    setSidebarPosition: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to login when not authenticated', () => {
    (useAppContext as any).mockReturnValue(mockContextBase);

    render(
      <MemoryRouter initialEntries={['/tasks']}>
        <App />
      </MemoryRouter>
    );

    // Now looking for the text from our Mock above
    expect(screen.getByText(/Mock Login Page/i)).toBeInTheDocument();
  });

  it('renders dashboard when authenticated', () => {
    (useAppContext as any).mockReturnValue({
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

  it('applies dark theme class to document root', () => {
    (useAppContext as any).mockReturnValue({
      ...mockContextBase,
      state: { 
        ...mockContextBase.state, 
        isLoggedIn: true,
        settings: { ...mockContextBase.state.settings, theme: 'dark' } 
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