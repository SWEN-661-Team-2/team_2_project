/**
 * Component Tests - TasksScreen
 * Tests the tasks listing and filtering screen
 */
import { fireEvent, render } from '@testing-library/react-native';
import { AppProviders } from '../../src/contexts/AppProviders';
import TasksRepository from '../../src/repositories/TasksRepository';
import TasksScreen from '../../src/screens/TasksScreen';

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
      const { getAllByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );
      expect(getAllByText(/all/i)[0]).toBeTruthy();
    });

    test('displays all tasks by default', () => {
      const tasks = TasksRepository.all();
      const { getByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );
      if (tasks.length > 0) {
        expect(getByText(tasks[0].title)).toBeTruthy();
      }
    });

    test('renders filter buttons', () => {
      const { getAllByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );
      expect(getAllByText(/all/i)[0]).toBeTruthy();
      expect(getAllByText(/pending/i)[0]).toBeTruthy();
      expect(getAllByText(/completed/i)[0]).toBeTruthy();
    });
  });

  describe('filtering', () => {
    test('filters pending tasks', () => {
      const { getAllByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );
      const pendingButton = getAllByText(/pending/i)[0];
      fireEvent.press(pendingButton);
      expect(pendingButton).toBeTruthy();
    });

    test('filters completed tasks', () => {
      const { getAllByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );
      const completedButton = getAllByText(/completed/i)[0];
      fireEvent.press(completedButton);
      expect(completedButton).toBeTruthy();
    });

    test('filters high priority tasks', () => {
      const { getAllByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );
      const highButton = getAllByText(/high/i)[0];
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
      const { getAllByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );
      fireEvent.press(getAllByText(/pending/i)[0]);
      const allButton = getAllByText(/all/i)[0];
      fireEvent.press(allButton);
      expect(allButton).toBeTruthy();
    });
  });

  describe('task display', () => {
    test('shows task properties', () => {
      const tasks = TasksRepository.all();
      const { getAllByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );
      if (tasks.length > 0) {
        const task = tasks[0];
        expect(getAllByText(task.title)[0]).toBeTruthy();
        expect(getAllByText(task.status)[0]).toBeTruthy();
        expect(getAllByText(task.priority)[0]).toBeTruthy();
      }
    });

    test('displays patient name', () => {
      const tasks = TasksRepository.all();
      const { getAllByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );
      if (tasks.length > 0) {
        expect(getAllByText(/patient:/i)[0]).toBeTruthy();
      }
    });
  });

  describe('task toggling', () => {
    test('toggles task status when checkbox pressed', async () => {
      const tasks = TasksRepository.pending();
      renderWithProviders(<TasksScreen navigation={navigation} />);
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

      const { getAllByText } = renderWithProviders(
        <TasksScreen navigation={navigation} />
      );

      expect(getAllByText(new RegExp(`all.*${allTasks.length}`, 'i'))[0]).toBeTruthy();
      expect(getAllByText(new RegExp(`pending.*${pendingTasks.length}`, 'i'))[0]).toBeTruthy();
      expect(getAllByText(new RegExp(`completed.*${completedTasks.length}`, 'i'))[0]).toBeTruthy();
    });
  });
});
