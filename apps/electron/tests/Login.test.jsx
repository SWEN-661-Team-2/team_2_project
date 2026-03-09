/** @jest-environment jsdom */

// Tests for Login component
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../renderer/src/components/Login';

describe('Login Component Full Coverage', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    mockOnLogin.mockClear();
  });

  test('Hits all logic: Validation, Forgot Password, and Remember Me', async () => {
    render(<Login onLogin={mockOnLogin} />);

    // 1. Hit the "Remember Me" checkbox
    const checkbox = screen.getByLabelText(/Remember me/i);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    // 2. Trigger Validation Error (Invalid email/short password)
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'bademail' } });
    fireEvent.change(passInput, { target: { value: '123' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();

    // 3. Trigger "Forgot Password" link
    const forgotLink = screen.getByText(/Forgot your password\?/i);
    fireEvent.click(forgotLink);
    expect(screen.getByText(/Password reset not implemented/i)).toBeInTheDocument();

    // 4. Hit Successful Login branch
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passInput, { target: { value: 'password123' } });
    
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  describe('UI Rendering', () => {
    test('renders all essential form elements', () => {
      render(<Login onLogin={mockOnLogin} />);
      expect(screen.getByText('CareConnect')).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });
  });
});
