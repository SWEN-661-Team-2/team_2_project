import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { X, CheckSquare, AlertCircle, Sparkles } from 'lucide-react';

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
  const taskTitleRef = useRef<HTMLInputElement | null>(null);

  // Auto-focus the input when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => taskTitleRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: TaskFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    onSubmit(data);
    reset();
    onClose();
  };

  const getInputClass = (hasError: boolean) => `
    w-full h-12 md:h-14 px-4 rounded-xl border-2 transition-all outline-none font-bold
    ${hasError 
      ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-200' 
      : 'border-purple-100 dark:border-slate-700 bg-purple-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:bg-white dark:focus:bg-slate-800'
    }
    placeholder:text-slate-400 dark:placeholder:text-slate-500
  `;

  const labelClass = "block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide ml-1";

  const chevron = (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  // Destructure ref separately for clean assignment
  const { ref: registerRef, ...restRegister } = register('taskTitle', { required: 'Task title is required' });

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full md:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 text-purple-600 dark:text-purple-400">
                <CheckSquare className="w-6 h-6" />
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Create Task</h2>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Add a new item to your daily workflow</p>
            </div>
            <button 
              onClick={onClose} 
              className="flex-shrink-0 p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-500 dark:text-slate-400"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="px-6 py-6 space-y-6">
            {/* Task Title */}
            <div>
              <label className={labelClass}>Task Description</label>
              <input
                type="text"
                placeholder="e.g. Check vital signs for Room 302"
                autoComplete="off"
                className={getInputClass(!!errors.taskTitle)}
                {...restRegister}
                ref={(e) => {
                  registerRef(e);
                  taskTitleRef.current = e;
                }}
              />
              {errors.taskTitle && (
                <p className="mt-2 text-xs text-red-500 font-bold uppercase flex items-center gap-1 ml-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.taskTitle.message}
                </p>
              )}
            </div>

            {/* Selects Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Priority</label>
                <div className="relative">
                  <select 
                    className={`${getInputClass(!!errors.priority)} appearance-none cursor-pointer`}
                    {...register('priority', { required: 'Priority is required' })}
                  >
                    <option value="">Select...</option>
                    {['High','Medium','Low'].map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {chevron}
                </div>
                {errors.priority && (
                  <p className="mt-1 text-[10px] text-red-500 font-bold uppercase ml-1">{errors.priority.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Category</label>
                <div className="relative">
                  <select 
                    className={`${getInputClass(!!errors.category)} appearance-none cursor-pointer`}
                    {...register('category', { required: 'Category is required' })}
                  >
                    <option value="">Select...</option>
                    {['Medication','Assessment','Treatment'].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {chevron}
                </div>
                {errors.category && (
                  <p className="mt-1 text-[10px] text-red-500 font-bold uppercase ml-1">{errors.category.message}</p>
                )}
              </div>
            </div>

            {/* Tip Box */}
            <div className="flex items-start gap-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-2xl p-4">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                <span className="font-bold text-purple-700 dark:text-purple-400 uppercase tracking-tighter mr-1">Pro Tip:</span> 
                Action-oriented titles like "Verify medication" are more effective than vague notes.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="h-12 md:h-14 px-6 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all sm:flex-1"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="h-12 md:h-14 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed sm:flex-1 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}