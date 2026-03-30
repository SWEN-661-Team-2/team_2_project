/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Login } from '../../src/app/components/Login';
import { db } from '../../src/db';

// Mock the Dexie database module so tests never touch real IndexedDB.
// The where().first() chain is mocked — individual tests override first() as needed.
vi.mock('../../src/db', () => ({
  db: {
    users: {
      where: vi.fn().mockReturnThis(),
      first: vi.fn(),
    },
  },
}));

// Typed helper to access the mocked first() function without using `as any`
const mockFirst = () => db.users.where({}).first as ReturnType<typeof vi.fn>;

// Unit tests for the Login component.
// Covers: form rendering, empty field validation, failed auth, and successful auth.
describe('Login Component', () => {
  const mockOnLogin = vi.fn();

  // Reset all mock call counts and return values before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Confirms the email input and Sign In button are present on initial render
  it('renders login form correctly', () => {
    render(<Login onLogin={mockOnLogin} />);
    expect(screen.getByPlaceholderText(/admin@careconnect.com/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  // Submitting with empty fields should surface both required field messages
  // defined in the react-hook-form register() calls
  it('shows validation errors for empty fields', async () => {
    render(<Login onLogin={mockOnLogin} />);

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  // When the DB returns null (no matching user), the error banner should appear
  // and onLogin must not be called
  it('shows error message when database returns no user', async () => {
    // Simulate a failed lookup — no user found for these credentials
    mockFirst().mockResolvedValue(null);

    render(<Login onLogin={mockOnLogin} />);

    fireEvent.change(screen.getByPlaceholderText(/admin@careconnect.com/i), {
      target: { value: 'wrong@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  // When the DB returns a user record, onLogin should be called exactly once.
  // waitFor timeout accounts for the 800ms artificial delay in onSubmit.
  it('calls onLogin when database finds a valid user', async () => {
    // Simulate a successful lookup — matching user found
    mockFirst().mockResolvedValue({ username: 'admin@careconnect.com' });

    render(<Login onLogin={mockOnLogin} />);

    fireEvent.change(screen.getByPlaceholderText(/admin@careconnect.com/i), {
      target: { value: 'admin@careconnect.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    }, { timeout: 2000 });
  });
});
