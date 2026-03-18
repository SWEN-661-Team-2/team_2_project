// import { render, screen, fireEvent, within } from '@testing-library/react';
// import { describe, it, expect, vi } from 'vitest';
// import { TaskManagement } from '../../src/app/components/TaskManagement';

// // Mock the CreateTaskModal
// vi.mock('../../src/app/components/CreateTaskModal', () => ({
//     CreateTaskModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
//         isOpen ? (
//             <div data-testid="task-modal">
//                 <button onClick={onClose}>Close Modal</button>
//             </div>
//         ) : null
// }));

// describe('TaskManagement Component', () => {
//     it('renders the initial list of tasks from tasksData', () => {
//         render(<TaskManagement />);

//         // Check for a few known titles from the static data
//         expect(screen.getByText('Medication Administration')).toBeInTheDocument();
//         expect(screen.getByText('Vital Signs Check')).toBeInTheDocument();
//         expect(screen.getByText(/Showing/i)).toHaveTextContent('Showing 4 tasks');
//     });

//     it('filters tasks when clicking status tabs', () => {
//         render(<TaskManagement />);

//         // Click "In Progress" tab
//         const inProgressTabs = screen.getAllByRole('button', { name: /in progress/i });
//         fireEvent.click(inProgressTabs[0]);

//         expect(screen.getByText('Vital Signs Check')).toBeInTheDocument();
//         expect(screen.queryByText('Medication Administration')).not.toBeInTheDocument();
//     });

//     it('shows an empty state when no tasks match filters', () => {
//         render(<TaskManagement />);

//         const searchInput = screen.getByPlaceholderText(/search tasks/i);
//         fireEvent.change(searchInput, { target: { value: 'NonExistentTask' } });

//         expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
//         // expect(screen.getByText('Showing 0 tasks')).toBeInTheDocument();
//     });

//     it('displays the correct action buttons based on task status', () => {
//         render(<TaskManagement />);

//         const pendingTask = screen.getByText('Medication Administration').closest('.bg-white') as HTMLElement;

//         expect(within(pendingTask).getByRole('button', { name: /start task/i })).toBeInTheDocument();

//         const inProgressTask = screen.getByText('Vital Signs Check').closest('.bg-white') as HTMLElement;
//         expect(within(inProgressTask).getByRole('button', { name: /complete/i })).toBeInTheDocument();
//     });

//     it('opens and closes the "New Task" modal', async () => {
//         render(<TaskManagement />);

//         const newTaskBtn = screen.getByRole('button', { name: /new task/i });
//         fireEvent.click(newTaskBtn);

//         const modal = await screen.findByTestId('task-modal');
//         expect(modal).toBeInTheDocument();

//         const closeBtn = screen.getByText('Close Modal');
//         fireEvent.click(closeBtn);
//         expect(screen.queryByTestId('task-modal')).not.toBeInTheDocument();
//     });
// });
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskManagement } from '../../src/app/components/TaskManagement';
import '@testing-library/jest-dom';

// 1. Mock the Data Source (Dexie Hooks)
vi.mock('dexie-react-hooks', () => ({
  useLiveQuery: (fn: any) => {
    // This returns our "Fake" Database state for the tests
    return [
      { id: 1, title: 'Medication Administration', priority: 'high', patient: 'John Davis', time: '2:00 PM', status: 'pending', category: 'Medication' },
      { id: 2, title: 'Vital Signs Check', priority: 'medium', patient: 'Mary Wilson', time: '2:30 PM', status: 'in-progress', category: 'Assessment' },
      { id: 3, title: 'Wound Care', priority: 'high', patient: 'Robert Brown', time: '3:00 PM', status: 'pending', category: 'Treatment' },
      { id: 4, title: 'Patient Education', priority: 'low', patient: 'Lisa Anderson', time: '4:30 PM', status: 'pending', category: 'Assessment' },
    ];
  },
}));

// 2. Mock the Database Instance
vi.mock('../../src/db', () => ({
  db: {
    tasks: {
      toArray: vi.fn(),
      update: vi.fn(),
      add: vi.fn(),
    },
  },
}));

// 3. Mock the CreateTaskModal
vi.mock('../../src/app/components/CreateTaskModal', () => ({
  CreateTaskModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="task-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null
}));

describe('TaskManagement Component', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders the initial list of tasks from the mocked database', () => {
    render(<TaskManagement />);

    expect(screen.getByText('Medication Administration')).toBeInTheDocument();
    expect(screen.getByText('Vital Signs Check')).toBeInTheDocument();
    // Verify the "Showing X tasks" logic works with the mock count
    expect(screen.getByText(/Showing/i)).toHaveTextContent('Showing 4 tasks');
  });

  it('filters tasks when clicking status tabs', () => {
    render(<TaskManagement />);

    // Click "In Progress" tab (Desktop version usually index 0 or 1 depending on DOM order)
    const inProgressTabs = screen.getAllByRole('button', { name: /in progress/i });
    fireEvent.click(inProgressTabs[0]);

    expect(screen.getByText('Vital Signs Check')).toBeInTheDocument();
    // Medication is 'pending', so it should disappear
    expect(screen.queryByText('Medication Administration')).not.toBeInTheDocument();
  });

  it('shows an empty state when no tasks match search', () => {
    render(<TaskManagement />);

    const searchInput = screen.getByPlaceholderText(/search tasks/i);
    fireEvent.change(searchInput, { target: { value: 'NonExistentTask' } });

    expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
  });

  it('displays the correct action buttons based on task status', () => {
    render(<TaskManagement />);

    // We find the container for a specific task to check its specific buttons
    const pendingTask = screen.getByText('Medication Administration').closest('.bg-white') as HTMLElement;
    expect(within(pendingTask).getByRole('button', { name: /start task/i })).toBeInTheDocument();

    const inProgressTask = screen.getByText('Vital Signs Check').closest('.bg-white') as HTMLElement;
    expect(within(inProgressTask).getByRole('button', { name: /complete/i })).toBeInTheDocument();
  });

  it('opens and closes the "New Task" modal', async () => {
    render(<TaskManagement />);

    const newTaskBtn = screen.getByRole('button', { name: /new task/i });
    fireEvent.click(newTaskBtn);

    const modal = await screen.findByTestId('task-modal');
    expect(modal).toBeInTheDocument();

    const closeBtn = screen.getByText('Close Modal');
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('task-modal')).not.toBeInTheDocument();
  });
});