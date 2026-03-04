/** @jest-environment jsdom */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Settings from '../renderer/src/components/Settings';

describe('Settings Component Logic and Tabs', () => {
  const mockOnSave = jest.fn().mockResolvedValue('right');
  const mockOnBack = jest.fn();
  
  const defaultProps = {
    layoutMode: 'right',
    onSave: mockOnSave,
    onBack: mockOnBack,
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Tab Navigation', () => {
    test('renders and switches between all tabs', () => {
      render(<Settings {...defaultProps} />);
      
      // Check initial tab (General)
      expect(screen.getByText(/layout preferences/i)).toBeInTheDocument();

      // Switch to Accessibility
      fireEvent.click(screen.getByRole('tab', { name: /accessibility/i }));
      expect(screen.getByText(/keyboard & navigation/i)).toBeInTheDocument();
      expect(screen.getByText(/high contrast/i)).toBeInTheDocument();

      // Switch to Notifications
      fireEvent.click(screen.getByRole('tab', { name: /notifications/i }));
      expect(screen.getByText(/task notifications/i)).toBeInTheDocument();
      expect(screen.getByText(/urgent task alerts/i)).toBeInTheDocument();
    });
  });

  describe('Form Controls and Persistence', () => {
    test('handles General tab inputs (Layout, Zoom, and User Info)', () => {
      render(<Settings {...defaultProps} />);

      // Toggle Left-Handed Mode
      const checkboxes = screen.getAllByRole('checkbox');
      const layoutToggle = checkboxes[0]; 
      fireEvent.click(layoutToggle);
      expect(layoutToggle.checked).toBe(true);

      // Change Zoom Level
      const zoomSelect = screen.getByLabelText(/zoom level/i);
      fireEvent.change(zoomSelect, { target: { value: '150%' } });
      expect(zoomSelect.value).toBe('150%');

      // Verify default user info
      expect(screen.getByLabelText(/name/i)).toHaveValue('Sarah Johnson, RN');
    });

    test('handles Accessibility and Notification toggles', () => {
      render(<Settings {...defaultProps} />);
      
      // Accessibility Toggles
      fireEvent.click(screen.getByRole('tab', { name: /accessibility/i }));
      const accToggles = screen.getAllByRole('checkbox');
      fireEvent.click(accToggles[2]); // High Contrast
      expect(accToggles[2].checked).toBe(true);

      // Notification Toggles
      fireEvent.click(screen.getByRole('tab', { name: /notifications/i }));
      const notifToggles = screen.getAllByRole('checkbox');
      fireEvent.click(notifToggles[0]); // Task Reminders
      expect(notifToggles[0].checked).toBe(false);
    });
  });

  describe('Actions and Feedback', () => {
    test('triggers onBack when Cancel is clicked', () => {
      render(<Settings {...defaultProps} />);
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    test('handles Save, calls onSave, and manages toast timer', async () => {
      render(<Settings {...defaultProps} />);
      
      const saveBtn = screen.getByRole('button', { name: /save changes/i });
      
      await act(async () => {
        fireEvent.click(saveBtn);
      });

      expect(mockOnSave).toHaveBeenCalled();
      
      // Verify Toast
      const toast = screen.getByRole('status');
      expect(toast).toHaveTextContent(/settings saved/i);

      // Fast-forward to clear toast
      act(() => {
        jest.advanceTimersByTime(2500);
      });

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });
});