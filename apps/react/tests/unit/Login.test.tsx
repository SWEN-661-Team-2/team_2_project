/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Login } from '../../src/app/components/Login'; // Adjust path if needed
import { db } from '../../src/db';

// Mock the database
vi.mock('../../src/db', () => ({
  db: {
    users: {
      where: vi.fn().mockReturnThis(),
      first: vi.fn(),
    },
  },
}));

describe('Login Component', () => {
  const mockOnLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<Login onLogin={mockOnLogin} />);
    expect(screen.getByPlaceholderText(/admin@careconnect.com/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<Login onLogin={mockOnLogin} />);
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('shows error message when database returns no user', async () => {
    // Simulate user not found in DB
    (db.users.where({}).first as any).mockResolvedValue(null);

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

  it('calls onLogin when database finds a valid user', async () => {
    // Simulate successful user find
    (db.users.where({}).first as any).mockResolvedValue({ username: 'admin@careconnect.com' });

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
    }, { timeout: 2000 }); // Account for the 800ms delay in your onSubmit
  });
});