import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks'; // Add this
import { db, type Task } from '../../db'; // Import from your db file
import {
  Plus, Search, Clock, User, Filter,
  CheckCircle2, Circle, AlertCircle,
} from 'lucide-react';
import { CreateTaskModal } from './CreateTaskModal';

type FilterTab = 'all' | 'pending' | 'in-progress' | 'completed';

const filterTabs: { readonly id: FilterTab; readonly label: string }[] = [
  { id: 'all', label: 'All Tasks' },
  { id: 'pending', label: 'Pending' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
];

export function TaskManagement() {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  // 1. Database Hook
  const tasksFromDb = useLiveQuery(() => db.tasks.toArray()) || [];

  // 2. Filter Logic
  const filteredTasks = tasksFromDb.filter((task) => {
    const statusMatch = activeFilter === 'all' || task.status === activeFilter;
    const searchMatch = searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.patient.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  // 3. Database Actions
  const updateTaskStatus = async (taskId: number, newStatus: Task['status']) => {
    try {
      await db.tasks.update(taskId, { status: newStatus });
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleCreateTask = async (data: any) => {
    try {
      await db.tasks.add({
        ...data,
        status: 'pending',
        time: data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setTaskModalOpen(false);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  // 4. Helper Functions
  const getPriorityStyles = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return { bg: 'bg-red-700', text: 'text-red-600 dark:text-red-400', bgLight: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800' };
      case 'medium': return { bg: 'bg-yellow-700', text: 'text-yellow-700 dark:text-yellow-400', bgLight: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800' };
      case 'low': return { bg: 'bg-green-700', text: 'text-green-700 dark:text-green-400', bgLight: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' };
      default: return { bg: 'bg-slate-700', text: 'text-slate-600', bgLight: 'bg-slate-50', border: 'border-slate-200' };
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-700 dark:text-green-500" strokeWidth={2} />;
      case 'in-progress': return <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />;
      case 'pending': return <Circle className="w-5 h-5 text-slate-400 dark:text-slate-500" strokeWidth={2} />;
    }
  };

  const getStatusStyles = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'in-progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'pending': return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-transparent pb-20 lg:pb-0">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Task Management</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage and track all care tasks</p>
            </div>
            <button
              onClick={() => setTaskModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 h-12 md:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              <span>New Task</span>
            </button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <label htmlFor="task-search-input" className="sr-only">
                Search tasks by title or patient name
              </label>

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                id="task-search-input"
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 md:h-14 pl-12 pr-4 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-blue-500 focus:outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Tabs Desktop */}
          <div className="hidden md:flex gap-2 border-b border-slate-200 dark:border-slate-700">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-6 py-3 font-semibold text-sm transition-all relative rounded-t-lg ${activeFilter === tab.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
              >
                {tab.label}
                {activeFilter === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500" />
                )}
              </button>
            ))}
          </div>

          {/* Tabs Mobile */}
          <div className="md:hidden overflow-x-auto -mx-4 px-4">
            <div className="flex gap-2 pb-2 border-b border-slate-200 dark:border-slate-700 min-w-max">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-5 py-3 font-semibold text-sm transition-all rounded-lg whitespace-nowrap ${activeFilter === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredTasks.length}</span> tasks
            </p>
          </div>

          {filteredTasks.length > 0 ? (
            <div className="space-y-4">
              {filteredTasks.map((task) => {
                const priorityStyles = getPriorityStyles(task.priority);
                return (
                  <div key={task.id} className="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all group overflow-hidden">
                    <div className="p-5 md:p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 mt-1">{getStatusIcon(task.status)}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{task.title}</h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                <User className="w-4 h-4" />
                                <span className="font-medium">{task.patient}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                <Clock className="w-4 h-4" />
                                <span>{task.time}</span>
                              </div>
                              {task.category && (
                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full">
                                  {task.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-3 py-1.5 ${priorityStyles.bg} text-white text-xs font-bold rounded-full uppercase shadow-sm`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border ${getStatusStyles(task.status)}`}>
                          {getStatusIcon(task.status)}
                          <span>{getStatusLabel(task.status)}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                            View Details
                          </button>
                          {task.status === 'pending' && (
                            <button
                              onClick={() => task.id && updateTaskStatus(task.id, 'in-progress')}
                              className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                              Start Task
                            </button>
                          )}
                          {task.status === 'in-progress' && (
                            <button
                              onClick={() => task.id && updateTaskStatus(task.id, 'completed')}
                              className="px-4 py-2 text-sm font-medium text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No tasks found</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                No tasks match your current criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      <CreateTaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}