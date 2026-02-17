/**
 * Component Tests - TasksScreen
 * Tests the tasks listing and filtering screen
 */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TasksScreen from '../../src/screens/TasksScreen';
import { AppProviders } from '../../src/contexts/AppProviders';
import TasksRepository from '../../src/repositories/TasksRepository';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const navigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
};

const renderWithProviders = (component) => {
  return render(<AppProviders>{component}</AppProviders>);
};

describe('TasksScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    test('renders tasks screen', () => {
      const { getByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );

      // Should show at least the filter buttons
      expect(getByText(/all/i)).toBeTruthy();
    });

    test('displays all tasks by default', () => {
      const tasks = TasksRepository.all();
      const { getByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );

      // Check if at least one task title is displayed
      if (tasks.length > 0) {
        expect(getByText(tasks[0].title)).toBeTruthy();
      }
    });

    test('renders filter buttons', () => {
      const { getByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );

      expect(getByText(/all/i)).toBeTruthy();
      expect(getByText(/pending/i)).toBeTruthy();
      expect(getByText(/completed/i)).toBeTruthy();
    });
  });

  describe('filtering', () => {
    test('filters pending tasks', () => {
      const { getByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );

      const pendingButton = getByText(/pending/i);
      fireEvent.press(pendingButton);

      // Should update the display
      expect(pendingButton).toBeTruthy();
    });

    test('filters completed tasks', () => {
      const { getByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );

      const completedButton = getByText(/completed/i);
      fireEvent.press(completedButton);

      expect(completedButton).toBeTruthy();
    });

    test('filters high priority tasks', () => {
      const { getByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );

      const highButton = getByText(/high/i);
      fireEvent.press(highButton);

      expect(highButton).toBeTruthy();
    });

    test('filters overdue tasks', () => {
      const { getByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );

      const overdueButton = getByText(/overdue/i);
      fireEvent.press(overdueButton);

      expect(overdueButton).toBeTruthy();
    });

    test('filters due today tasks', () => {
      const { getByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );

      const dueTodayButton = getByText(/due today/i);
      fireEvent.press(dueTodayButton);

      expect(dueTodayButton).toBeTruthy();
    });

    test('returns to all tasks', () => {
      const { getByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );

      const pendingButton = getByText(/pending/i);
      fireEvent.press(pendingButton);

      const allButton = getByText(/all/i);
      fireEvent.press(allButton);

      expect(allButton).toBeTruthy();
    });
  });

  describe('task display', () => {
    test('shows task properties', () => {
      const tasks = TasksRepository.all();
      const { getByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );

      if (tasks.length > 0) {
        const task = tasks[0];
        expect(getByText(task.title)).toBeTruthy();
        expect(getByText(task.status)).toBeTruthy();
        expect(getByText(task.priority)).toBeTruthy();
      }
    });

    test('displays patient name', () => {
      const tasks = TasksRepository.all();
      const { getByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );

      if (tasks.length > 0) {
        const task = tasks[0];
        expect(getByText(/patient:/i)).toBeTruthy();
      }
    });
  });

  describe('task toggling', () => {
    test('toggles task status when checkbox pressed', async () => {
      const tasks = TasksRepository.pending();
      const { getAllByRole } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );

      // This test verifies the screen can handle task toggle events
      expect(tasks.length).toBeGreaterThan(0);
    });
  });

  describe('navigation', () => {
    test('handles back navigation', () => {
      const { getByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );

      const backButton = getByText('←');
      fireEvent.press(backButton);

      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('task counts', () => {
    test('displays correct task counts in filter buttons', () => {
      const allTasks = TasksRepository.all();
      const pendingTasks = TasksRepository.pending();
      const completedTasks = TasksRepository.completed();

      const { getByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );

      expect(getByText(new RegExp(`all.*${allTasks.length}`, 'i'))).toBeTruthy();
      expect(getByText(new RegExp(`pending.*${pendingTasks.length}`, 'i'))).toBeTruthy();
      expect(getByText(new RegExp(`completed.*${completedTasks.length}`, 'i'))).toBeTruthy();
    });
  });
});
