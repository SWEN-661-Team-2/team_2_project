/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../renderer/src/components/Login.jsx';

describe('Login Component Full Coverage', () => {
  const mockOnLogin = jest.fn();

  test('Hits all logic: Validation, Forgot Password, and Remember Me', () => {
    render(<Login onLogin={mockOnLogin} />);

    // 1. Hit the "Remember Me" checkbox (Missing branch)
    const checkbox = screen.getByLabelText(/Remember me/i);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    // 2. Trigger the Validation Error (Lines 15-16)
    // We send a bad email (no @) to trigger the 'if' block
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'bademail' } });
    fireEvent.change(passInput, { target: { value: '123' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();

    // 3. Trigger the "Forgot Password" link (Lines 62-76)
    const forgotLink = screen.getByText(/Forgot your password\?/i);
    fireEvent.click(forgotLink);
    expect(screen.getByText(/Password reset not implemented/i)).toBeInTheDocument();

    // 4. Hit the Successful Login branch
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);

    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });
});