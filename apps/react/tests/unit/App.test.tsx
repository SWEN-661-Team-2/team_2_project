import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider, useAppContext } from '../../src/app/context/AppContext';
import App from '../../src/App';

const renderApp = (initialPath = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppProvider>
        <App />
      </AppProvider>
    </MemoryRouter>
  );
};

const renderLoggedInApp = (initialPath = '/') => {
  const Wrapper = () => {
    const { login } = useAppContext();
    React.useEffect(() => { login(); }, []);
    return <App />;
  };
  return render(
    <MemoryRouter initialEntries={[initialPath]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppProvider>
        <Wrapper />
      </AppProvider>
    </MemoryRouter>
  );
};

describe('App - unauthenticated', () => {
  it('shows Login when not logged in', () => {
    renderApp();
    expect(screen.getByText('CareConnect')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders Sign In button', () => {
    renderApp();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('renders email and password fields', () => {
    renderApp();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders Remember me checkbox', () => {
    renderApp();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders tagline', () => {
    renderApp();
    expect(screen.getByText('Supporting Care, Connecting Hearts')).toBeInTheDocument();
  });

  it('login shows validation errors on empty submit', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
  });
});

describe('App - authenticated', () => {
  it('shows dashboard after login', async () => {
    renderLoggedInApp('/');
    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('shows navigation after login', async () => {
    renderLoggedInApp('/');
    expect(await screen.findByText('CareConnect')).toBeInTheDocument();
  });

  it('shows Tasks page at /tasks route', async () => {
    renderLoggedInApp('/tasks');
    expect(await screen.findByText('Task Management')).toBeInTheDocument();
  });

  it('shows Settings page at /settings route', async () => {
    renderLoggedInApp('/settings');
    expect(await screen.findByText('Settings & Preferences')).toBeInTheDocument();
  });

  it('shows Patients page at /patients route', async () => {
    renderLoggedInApp('/patients');
    expect(await screen.findByText('Patient Care')).toBeInTheDocument();
  });

  it('redirects unknown routes to dashboard', async () => {
    renderLoggedInApp('/unknown-route');
    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('sidebar position defaults to left', async () => {
    renderLoggedInApp('/');
    await screen.findByRole('heading', { name: 'Dashboard' });
    const sidebar = document.querySelector('aside');
    expect(sidebar?.className).toMatch(/left-0/);
  });
});
