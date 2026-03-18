import { useState } from 'react';
import {
  Plus, Search, Clock, User, Filter,
  CheckCircle2, Circle, AlertCircle,
} from 'lucide-react';
import { CreateTaskModal } from './CreateTaskModal';

type TaskStatus = 'pending' | 'in-progress' | 'completed';
type TaskPriority = 'high' | 'medium' | 'low';
type FilterTab = 'all' | 'pending' | 'in-progress' | 'completed';

interface Task {
  readonly id: number;
  readonly title: string;
  readonly priority: TaskPriority;
  readonly patient: string;
  readonly time: string;
  readonly status: TaskStatus;
  readonly category?: string;
}

const tasksData: Task[] = [
  { id: 1, title: 'Medication Administration', priority: 'high', patient: 'John Davis', time: '2:00 PM', status: 'pending', category: 'Medication' },
  { id: 2, title: 'Vital Signs Check', priority: 'medium', patient: 'Mary Wilson', time: '2:30 PM', status: 'in-progress', category: 'Assessment' },
  { id: 3, title: 'Wound Care', priority: 'high', patient: 'Robert Brown', time: '3:00 PM', status: 'pending', category: 'Treatment' },
  { id: 4, title: 'Patient Education', priority: 'low', patient: 'Lisa Anderson', time: '4:30 PM', status: 'pending', category: 'Assessment' },
];

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

  const filteredTasks = tasksData.filter((task) => {
    const statusMatch = activeFilter === 'all' || task.status === activeFilter;
    const searchMatch = searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.patient.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  const getPriorityStyles = (priority: TaskPriority) => {
    switch (priority) {
      case 'high': return { bg: 'bg-red-500', text: 'text-red-600', bgLight: 'bg-red-50', border: 'border-red-200' };
      case 'medium': return { bg: 'bg-yellow-500', text: 'text-yellow-700', bgLight: 'bg-yellow-50', border: 'border-yellow-200' };
      case 'low': return { bg: 'bg-green-500', text: 'text-green-600', bgLight: 'bg-green-50', border: 'border-green-200' };
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-600" strokeWidth={2} />;
      case 'in-progress': return <AlertCircle className="w-5 h-5 text-blue-600" strokeWidth={2} />;
      case 'pending': return <Circle className="w-5 h-5 text-slate-400" strokeWidth={2} />;
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'pending': return 'Pending';
    }
  };

  const getStatusStyles = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20 lg:pb-0">
      <div className="p-4 md:p-6 lg:p-8">

        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Task Management</h1>
              <p className="text-sm text-slate-600 mt-1">Manage and track all care tasks</p>
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 md:h-14 pl-12 pr-4 rounded-lg border-2 border-slate-300 bg-white focus:border-blue-500 focus:outline-none transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="hidden md:flex gap-2 border-b border-slate-200">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-6 py-3 font-semibold text-sm transition-all relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-t-lg ${activeFilter === tab.id ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {tab.label}
                {activeFilter === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500" />
                )}
              </button>
            ))}
          </div>

          <div className="md:hidden overflow-x-auto -mx-4 px-4">
            <div className="flex gap-2 pb-2 border-b border-slate-200 min-w-max">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-5 py-3 font-semibold text-sm transition-all rounded-lg whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeFilter === tab.id ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-300'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-900">{filteredTasks.length}</span> task{filteredTasks.length === 1 ? '' : 's'}

            </p>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Clear search
              </button>
            )}
          </div>

          {filteredTasks.length > 0 ? (
            <div className="space-y-4">
              {filteredTasks.map((task) => {
                const priorityStyles = getPriorityStyles(task.priority);
                return (
                  <div key={task.id} className="bg-white rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group overflow-hidden">
                    <div className="p-5 md:p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 mt-1">{getStatusIcon(task.status)}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{task.title}</h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              <div className="flex items-center gap-1.5 text-slate-600">
                                <User className="w-4 h-4" strokeWidth={2} />
                                <span className="font-medium">{task.patient}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-600">
                                <Clock className="w-4 h-4" strokeWidth={2} />
                                <span>{task.time}</span>
                              </div>
                              {task.category && (
                                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">{task.category}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-3 py-1.5 ${priorityStyles.bg} text-white text-xs font-bold rounded-full uppercase tracking-wide shadow-sm`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border ${getStatusStyles(task.status)}`}>
                          {getStatusIcon(task.status)}
                          <span>{getStatusLabel(task.status)}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">View Details</button>
                          {task.status === 'pending' && (
                            <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">Start Task</button>
                          )}
                          {task.status === 'in-progress' && (
                            <button className="px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors">Complete</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border-2 border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No tasks found</h3>
              <p className="text-sm text-slate-600 mb-6">
                {searchQuery ? `No tasks match your search "${searchQuery}"` : 'No tasks in this category'}
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <CreateTaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={(data) => console.log('New Task:', data)}
      />
    </div>
  );
}
