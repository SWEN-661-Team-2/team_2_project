/** @jest-environment jsdom */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Settings from '../renderer/src/components/Settings';

const mockOnSave = jest.fn().mockResolvedValue('right');
const mockOnBack = jest.fn();

beforeEach(() => {
  mockOnSave.mockClear();
  mockOnBack.mockClear();
});

describe('Settings Component Logic', () => {
  describe('Rendering', () => {
    test('renders Settings heading', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      expect(screen.getByText(/settings/i)).toBeInTheDocument();
    });

    test('renders General tab', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      expect(screen.getByRole('tab', { name: /general/i })).toBeInTheDocument();
    });

    test('renders Accessibility tab', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      expect(screen.getByRole('tab', { name: /accessibility/i })).toBeInTheDocument();
    });

    test('renders Notifications tab', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      expect(screen.getByRole('tab', { name: /notifications/i })).toBeInTheDocument();
    });

    test('renders Save Changes button', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    });

    test('clicking Accessibility tab shows its content', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('tab', { name: /accessibility/i }));
      expect(screen.getByText(/high contrast/i)).toBeInTheDocument();
    });

    test('clicking Notifications tab shows its content', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('tab', { name: /notifications/i }));
      expect(screen.getByText(/task reminders/i)).toBeInTheDocument();
    });

    test('clicking Save Changes calls onSave', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);

      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

      expect(mockOnSave).toHaveBeenCalled();
    });

    test('clicking Cancel calls onBack', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(mockOnBack).toHaveBeenCalled();
    });

    test('renders left-handed mode toggle', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      expect(screen.getByText(/left-handed mode/i)).toBeInTheDocument();
    });

    test('renders zoom level select', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      expect(screen.getByLabelText(/zoom level/i)).toBeInTheDocument();
    });

    test('renders reduce motion toggle in accessibility tab', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('tab', { name: /accessibility/i }));
      expect(screen.getByText(/reduce motion/i)).toBeInTheDocument();
    });

    test('renders urgent alerts toggle in notifications tab', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('tab', { name: /notifications/i }));
      expect(screen.getByText(/urgent task alerts/i)).toBeInTheDocument();
    });

    test('renders user name field on General tab', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    test('can change zoom level', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.change(screen.getByLabelText(/zoom level/i), { target: { value: '125%' } });
      expect(screen.getByLabelText(/zoom level/i).value).toBe('125%');
    });

    test('can toggle enhanced keyboard navigation', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('tab', { name: /accessibility/i }));
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      expect(checkboxes[0]).not.toBeChecked();
    });

    test('can toggle high contrast mode', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('tab', { name: /accessibility/i }));
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[2]);
      expect(checkboxes[2]).toBeChecked();
    });

    test('can toggle task reminders', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('tab', { name: /notifications/i }));
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      expect(checkboxes[0]).not.toBeChecked();
    });

    test('can toggle urgent task alerts', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('tab', { name: /notifications/i }));
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]);
      expect(checkboxes[1]).not.toBeChecked();
    });
    test('can toggle left-handed mode checkbox', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      expect(checkboxes[0]).toBeChecked();
    });

    test('can toggle focus indicators', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('tab', { name: /accessibility/i }));
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]);
      expect(checkboxes[1]).not.toBeChecked();
    });

    test('can toggle reduce motion', () => {
      render(<Settings layoutMode="right" onSave={mockOnSave} onBack={mockOnBack} />);
      fireEvent.click(screen.getByRole('tab', { name: /accessibility/i }));
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[3]);
      expect(checkboxes[3]).toBeChecked();
    });
  });

});
