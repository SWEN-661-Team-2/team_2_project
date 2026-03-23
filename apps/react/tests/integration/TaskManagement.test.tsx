import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskManagement } from '../../src/app/components/TaskManagement';

const getTaskCount = () =>
  document.querySelectorAll('p.text-sm.text-slate-600')[1]?.textContent?.replace(/\s+/g, ' ').trim() ?? '';

describe('TaskManagement Component', () => {
  it('renders the page title', () => {
    render(<TaskManagement />);
    expect(screen.getByText('Task Management')).toBeInTheDocument();
  });

  it('renders New Task button', () => {
    render(<TaskManagement />);
    expect(screen.getByRole('button', { name: /New Task/i })).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<TaskManagement />);
    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument();
  });

  it('renders all 4 tasks initially', () => {
    render(<TaskManagement />);
    expect(getTaskCount()).toMatch(/Showing 4 tasks/);
  });

  it('renders task titles', () => {
    render(<TaskManagement />);
    expect(screen.getByText('Medication Administration')).toBeInTheDocument();
    expect(screen.getByText('Vital Signs Check')).toBeInTheDocument();
    expect(screen.getByText('Wound Care')).toBeInTheDocument();
    expect(screen.getByText('Patient Education')).toBeInTheDocument();
  });

  it('filters tasks by search query', async () => {
    const user = userEvent.setup();
    render(<TaskManagement />);
    await user.type(screen.getByPlaceholderText('Search tasks...'), 'John');
    expect(getTaskCount()).toMatch(/Showing 1 task/);
  });

  it('shows empty state when search has no results', async () => {
    const user = userEvent.setup();
    render(<TaskManagement />);
    await user.type(screen.getByPlaceholderText('Search tasks...'), 'ZZZNOMATCH');
    expect(screen.getByText('No tasks found')).toBeInTheDocument();
  });

  it('shows Clear search button when searching', async () => {
    const user = userEvent.setup();
    render(<TaskManagement />);
    await user.type(screen.getByPlaceholderText('Search tasks...'), 'John');
    expect(screen.getByText('Clear search')).toBeInTheDocument();
  });

  it('clears search when Clear search clicked', async () => {
    const user = userEvent.setup();
    render(<TaskManagement />);
    await user.type(screen.getByPlaceholderText('Search tasks...'), 'John');
    await user.click(screen.getByText('Clear search'));
    expect(getTaskCount()).toMatch(/Showing 4 tasks/);
  });

  it('filters by Pending tab', async () => {
    const user = userEvent.setup();
    render(<TaskManagement />);
    await user.click(screen.getAllByText('Pending')[0]);
    expect(getTaskCount()).toMatch(/Showing 3 tasks/);
  });

  it('filters by In Progress tab', async () => {
    const user = userEvent.setup();
    render(<TaskManagement />);
    await user.click(screen.getAllByText('In Progress')[0]);
    expect(getTaskCount()).toMatch(/Showing 1 task/);
  });

  it('shows empty state for Completed tab', async () => {
    const user = userEvent.setup();
    render(<TaskManagement />);
    await user.click(screen.getAllByText('Completed')[0]);
    expect(screen.getByText('No tasks found')).toBeInTheDocument();
  });

  it('opens Create Task modal when New Task clicked', async () => {
    const user = userEvent.setup();
    render(<TaskManagement />);
    await user.click(screen.getByRole('button', { name: /New Task/i }));
    expect(screen.getByRole('heading', { name: 'Create New Task' })).toBeInTheDocument();
  });

  it('shows Start Task button for pending tasks', () => {
    render(<TaskManagement />);
    expect(screen.getAllByText('Start Task').length).toBeGreaterThan(0);
  });

  it('shows Complete button for in-progress tasks', () => {
    render(<TaskManagement />);
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('shows high priority badge', () => {
    render(<TaskManagement />);
    expect(screen.getAllByText('high').length).toBeGreaterThan(0);
  });
});
