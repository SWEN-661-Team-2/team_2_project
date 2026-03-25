import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { X, CheckSquare} from 'lucide-react';

// 1. Updated Interface to match DB/Parent expectations
interface TaskFormData {
  readonly title: string; // Changed from taskTitle to title
  readonly priority: 'high' | 'medium' | 'low'; // lowercase to match DB
  readonly category: string;
  readonly patient: string; // Added this as tasks usually need a patient name
}

interface CreateTaskModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: any) => void;
}

export function CreateTaskModal({ isOpen, onClose, onSubmit }: CreateTaskModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<TaskFormData>();
  const taskTitleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => taskTitleRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: TaskFormData) => {
    // Artificial delay for UI polish
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    // Pass the data up to TaskManagement's handleCreateTask
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

  const { ref: registerRef, ...restRegister } = register('title', { required: 'Task description is required' });

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6" data-testid="task-modal">
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative w-full md:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-200">
        
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 text-purple-600 dark:text-purple-400">
                <CheckSquare className="w-6 h-6" />
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Create Task</h2>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Add a new item to your daily workflow</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-500 dark:text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="px-6 py-6 space-y-5">
            {/* Task Description */}
            <div>
              <label className={labelClass}>Description</label>
              <input
                type="text"
                placeholder="e.g. Check vital signs"
                className={getInputClass(!!errors.title)}
                {...restRegister}
                ref={(e) => {
                  registerRef(e);
                  taskTitleRef.current = e;
                }}
              />
            </div>

            {/* Patient Name - Added to ensure data integrity */}
            <div>
              <label className={labelClass}>Patient Name</label>
              <input
                type="text"
                placeholder="e.g. John Davis"
                className={getInputClass(!!errors.patient)}
                {...register('patient', { required: 'Patient is required' })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Priority</label>
                <div className="relative">
                  <select 
                    className={`${getInputClass(!!errors.priority)} appearance-none cursor-pointer`}
                    {...register('priority', { required: 'Required' })}
                  >
                    <option value="">Select...</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  {chevron}
                </div>
              </div>

              <div>
                <label className={labelClass}>Category</label>
                <div className="relative">
                  <select 
                    className={`${getInputClass(!!errors.category)} appearance-none cursor-pointer`}
                    {...register('category', { required: 'Required' })}
                  >
                    <option value="">Select...</option>
                    {['Medication','Assessment','Treatment'].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {chevron}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row gap-3">
            <button type="button" onClick={onClose} className="h-12 md:h-14 px-6 bg-white dark:bg-slate-800 font-bold rounded-xl sm:flex-1">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="h-12 md:h-14 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg sm:flex-1 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}