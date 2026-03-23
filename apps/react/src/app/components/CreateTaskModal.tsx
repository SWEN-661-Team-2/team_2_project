import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { X, CheckSquare, AlertCircle } from 'lucide-react';

interface TaskFormData {
  readonly taskTitle: string;
  readonly priority: string;
  readonly category: string;
}

interface CreateTaskModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: TaskFormData) => void;
}

export function CreateTaskModal({ isOpen, onClose, onSubmit }: CreateTaskModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<TaskFormData>();
  const taskTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && taskTitleRef.current) {
      setTimeout(() => taskTitleRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: TaskFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSubmit(data);
    reset();
    onClose();
  };

  const chevron = (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  const selectClass = (hasError: boolean) =>
    `w-full h-12 md:h-14 px-4 rounded-lg border-2 ${hasError ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white focus:border-purple-500'} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-slate-900 appearance-none cursor-pointer font-medium`;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm w-full cursor-default"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        aria-label="Close modal"
      />

      <div className="relative w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CheckSquare className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">Create New Task</h2>
              </div>
              <p className="text-sm text-slate-600">Add a task to your workflow</p>
            </div>
            <button onClick={onClose} className="flex-shrink-0 p-2 hover:bg-white rounded-lg transition-colors" aria-label="Close modal">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="px-6 py-6 space-y-5">
            <div>
              <label htmlFor="taskTitle" className="block text-sm font-semibold text-slate-700 mb-2">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                id="taskTitle"
                type="text"
                placeholder="Enter task name..."
                autoComplete="off"
                className={`w-full h-12 md:h-14 px-4 rounded-lg border-2 ${errors.taskTitle ? 'border-red-500 bg-red-50' : 'border-purple-300 bg-purple-50/30 focus:border-purple-500'} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium`}
                {...register('taskTitle', { required: 'Task title is required' })}
                ref={(e) => {
                  register('taskTitle').ref(e);
                  (taskTitleRef as { current: HTMLInputElement | null }).current = e;
                }}
              />
              {errors.taskTitle && (
                <div className="flex items-center gap-1.5 mt-2 text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm font-medium">{errors.taskTitle.message}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-semibold text-slate-700 mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select id="priority" className={selectClass(!!errors.priority)}
                    {...register('priority', { required: 'Priority is required' })}>
                    <option value="">Select</option>
                    {['High','Medium','Low'].map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {chevron}
                </div>
                {errors.priority && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.priority.message}</p>}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select id="category" className={selectClass(!!errors.category)}
                    {...register('category', { required: 'Category is required' })}>
                    <option value="">Select</option>
                    {['Medication','Assessment','Treatment'].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {chevron}
                </div>
                {errors.category && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.category.message}</p>}
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-slate-700">
                <span className="font-semibold text-purple-700">Tip:</span> Use clear, actionable task names for better organization.
              </p>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-3">
            <button type="button" onClick={onClose}
              className="h-12 md:h-14 px-6 bg-white hover:bg-slate-100 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg transition-all sm:flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="h-12 md:h-14 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed sm:flex-1">
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
