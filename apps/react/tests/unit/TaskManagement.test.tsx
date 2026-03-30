import { render, screen, fireEvent, within, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskManagement } from '../../src/app/components/TaskManagement';

// Mock useLiveQuery to return a fixed task list instead of querying IndexedDB.
// Provides deterministic data for all test assertions without browser storage.
vi.mock('dexie-react-hooks', () => ({
  useLiveQuery: () => [
    { id: 1, title: 'Medication Administration', priority: 'high',   patient: 'John Davis',    time: '2:00 PM', status: 'pending',     category: 'Medication' },
    { id: 2, title: 'Vital Signs Check',          priority: 'medium', patient: 'Mary Wilson',   time: '2:30 PM', status: 'in-progress', category: 'Assessment' },
    { id: 3, title: 'Wound Care',                 priority: 'high',   patient: 'Robert Brown',  time: '3:00 PM', status: 'pending',     category: 'Treatment'  },
    { id: 4, title: 'Patient Education',          priority: 'low',    patient: 'Lisa Anderson', time: '4:30 PM', status: 'pending',     category: 'Assessment' },
  ],
}));

// Mock the db module so updateTaskStatus and handleCreateTask never touch real IndexedDB
vi.mock('../../src/db', () => ({
  db: {
    tasks: {
      toArray: vi.fn(),
      update:  vi.fn(),
      add:     vi.fn(),
    },
  },
}));

// Mock CreateTaskModal to keep TaskManagement tests focused on the task list UI.
// Renders a minimal testid element when open and a Close button to test dismissal.
vi.mock('../../src/app/components/CreateTaskModal', () => ({
  CreateTaskModal: ({ isOpen, onClose }: { readonly isOpen: boolean; readonly onClose: () => void }) =>
    isOpen ? (
      <div data-testid="task-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null,
}));

// Unit tests for TaskManagement.
// Covers: initial list render, status tab filtering, empty search state,
// per-status action buttons, and modal open/close behaviour.
describe('TaskManagement Component', () => {

  // Unmount the previous render before each test to prevent DOM bleed-through
  beforeEach(() => {
    cleanup();
  });

  // Confirms all four mocked tasks are rendered and the count label is correct
  it('renders the initial list of tasks from the mocked database', () => {
    render(<TaskManagement />);

    expect(screen.getByText('Medication Administration')).toBeInTheDocument();
    expect(screen.getByText('Vital Signs Check')).toBeInTheDocument();
    expect(screen.getByText(/Showing/i)).toHaveTextContent('Showing 4 tasks');
  });

  // Clicking the In Progress tab should show only in-progress tasks
  // and hide pending ones like Medication Administration
  it('filters tasks when clicking status tabs', () => {
    render(<TaskManagement />);

    // Multiple tab buttons exist (desktop + mobile) — click the first instance
    const inProgressTabs = screen.getAllByRole('button', { name: /in progress/i });
    fireEvent.click(inProgressTabs[0]);

    expect(screen.getByText('Vital Signs Check')).toBeInTheDocument();
    expect(screen.queryByText('Medication Administration')).not.toBeInTheDocument();
  });

  // Searching for a term that matches nothing should show the empty state panel
  it('shows an empty state when no tasks match search', () => {
    render(<TaskManagement />);

    const searchInput = screen.getByPlaceholderText(/search tasks/i);
    fireEvent.change(searchInput, { target: { value: 'NonExistentTask' } });

    expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
  });

  // Each task card should show the correct action button based on its status:
  // pending → Start Task, in-progress → Complete
  it('displays the correct action buttons based on task status', () => {
    render(<TaskManagement />);

    // Scope queries to each task card to avoid cross-card false positives
    const pendingTaskEl = screen.getByText('Medication Administration').closest('.bg-white');
    if (!pendingTaskEl) throw new Error('Pending task container not found');
    const pendingTask = pendingTaskEl as HTMLElement;
    expect(within(pendingTask).getByRole('button', { name: /start task/i })).toBeInTheDocument();

    const inProgressTaskEl = screen.getByText('Vital Signs Check').closest('.bg-white');
    if (!inProgressTaskEl) throw new Error('In-progress task container not found');
    const inProgressTask = inProgressTaskEl as HTMLElement;
    expect(within(inProgressTask).getByRole('button', { name: /complete/i })).toBeInTheDocument();
  });

  // Clicking New Task should open the modal; clicking Close Modal should dismiss it
  it('opens and closes the "New Task" modal', async () => {
    render(<TaskManagement />);

    fireEvent.click(screen.getByRole('button', { name: /new task/i }));

    const modal = await screen.findByTestId('task-modal');
    expect(modal).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close Modal'));
    expect(screen.queryByTestId('task-modal')).not.toBeInTheDocument();
  });
});
