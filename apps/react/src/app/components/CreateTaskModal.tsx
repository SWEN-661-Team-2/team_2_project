import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { X, CheckSquare } from 'lucide-react';
import { type TaskFormData } from '../../db';


// Props passed in from TaskManagement
interface CreateTaskModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: TaskFormData) => void | Promise<void>;
}

export function CreateTaskModal({ isOpen, onClose, onSubmit }: CreateTaskModalProps) {
  // react-hook-form — handles field registration, validation, submission state, and reset
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<Omit<TaskFormData, 'time'>>();

  // Ref used to implement focus trap and auto-focus the modal on open
  const modalRef = useRef<HTMLDialogElement>(null);

  // Ref used to auto-focus the task title field when the modal opens
  const taskTitleRef = useRef<HTMLInputElement | null>(null);

  // Focus trap — constrains Tab and Shift+Tab within the modal boundary
  // Also moves focus into the modal on open
  useEffect(() => {
    if (!isOpen) return;

    // Query all focusable elements inside the modal
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = Array.from(
      modal.querySelectorAll<HTMLElement>(focusableSelectors)
    );

    if (focusableElements.length === 0) return;

    // Delay allows the enter animation to complete before focus is applied
    const timer = setTimeout(() => taskTitleRef.current?.focus(), 150);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const first = focusableElements[0];
      const last = focusableElements.at(-1)!;

      if (e.shiftKey && document.activeElement === first) {
        // Shift+Tab — if on first element, wrap to last
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        // Tab — if on last element, wrap to first
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Early return keeps the DOM clean when the modal is not needed
  if (!isOpen) return null;

  // Short artificial delay so the loading state is visible before closing
  const handleFormSubmit = async (data: Omit<TaskFormData, 'time'>) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const fullData: TaskFormData = {
      ...data,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    onSubmit(fullData);
    reset();
    onClose();
  };

  // Returns Tailwind classes for form inputs — red tint on validation error
  const getInputClass = (hasError: boolean) => `
    w-full h-12 md:h-14 px-4 rounded-xl border-2 transition-all outline-none font-bold
    ${hasError
      ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-200'
      : 'border-purple-100 dark:border-slate-700 bg-purple-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:bg-white dark:focus:bg-slate-800'
    }
    placeholder:text-slate-400 dark:placeholder:text-slate-500
  `;

  // Shared label style used across all form fields
  const labelClass = "block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide ml-1";

  // Reusable inline SVG chevron for custom select dropdowns
  const chevron = (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  // Destructure ref from register so we can merge it with the local taskTitleRef
  // This is required because react-hook-form's ref and our focus ref must both be attached
  const { ref: registerRef, ...restRegister } = register('title', { required: 'Task description is required' });

  return (
    // Full-screen overlay — slides up from bottom on mobile, centered on desktop
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6"
      data-testid="task-modal"
    >
      {/* Backdrop — native button for full keyboard and assistive tech support */}
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 w-full cursor-default"
        onClick={onClose}
        aria-label="Close task modal"
      />

      {/* Modal container */}
      <dialog
        ref={modalRef}
        aria-labelledby="create-task-title"
        open
        className="relative w-full md:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-200 m-0 p-0 border-0 bg-transparent"
      >

        {/* Modal header — icon, title, subtitle, close button */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 text-purple-600 dark:text-purple-400">
                <CheckSquare className="w-6 h-6" aria-hidden="true" />
                <h2
                  id="create-task-title"
                  className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white"
                >
                  Create Task
                </h2>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Add a new item to your daily workflow</p>
            </div>
            {/* Native button — no role attribute needed */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-500 dark:text-slate-400"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="px-6 py-6 space-y-5">

            {/* Task description — auto-focused on open via merged ref */}
            <div>
              <label htmlFor="task-title" className={labelClass}>Description</label>
              <input
                id="task-title"
                type="text"
                placeholder="e.g. Check vital signs"
                className={getInputClass(!!errors.title)}
                {...restRegister}
                ref={(e) => {
                  // Attach both react-hook-form's ref and our local focus ref
                  registerRef(e);
                  taskTitleRef.current = e;
                }}
              />
              {errors.title && (
                <p className="mt-1 ml-1 text-xs font-bold text-red-500 uppercase">{errors.title.message}</p>
              )}
            </div>

            {/* Patient name — ensures task can be linked to the correct patient */}
            <div>
              <label htmlFor="task-patient" className={labelClass}>Patient Name</label>
              <input
                id="task-patient"
                type="text"
                placeholder="e.g. John Davis"
                className={getInputClass(!!errors.patient)}
                {...register('patient', { required: 'Patient is required' })}
              />
              {errors.patient && (
                <p className="mt-1 ml-1 text-xs font-bold text-red-500 uppercase">{errors.patient.message}</p>
              )}
            </div>

            {/* Priority + Category — side by side on all screen sizes */}
            <div className="grid grid-cols-2 gap-4">

              {/* Priority dropdown */}
              <div>
                <label htmlFor="task-priority" className={labelClass}>Priority</label>
                <div className="relative">
                  <select
                    id="task-priority"
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
                {errors.priority && (
                  <p className="mt-1 ml-1 text-xs font-bold text-red-500 uppercase">{errors.priority.message}</p>
                )}
              </div>

              {/* Category dropdown */}
              <div>
                <label htmlFor="task-category" className={labelClass}>Category</label>
                <div className="relative">
                  <select
                    id="task-category"
                    className={`${getInputClass(!!errors.category)} appearance-none cursor-pointer`}
                    {...register('category', { required: 'Required' })}
                  >
                    <option value="">Select...</option>
                    {['Medication', 'Assessment', 'Treatment'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {chevron}
                </div>
                {errors.category && (
                  <p className="mt-1 ml-1 text-xs font-bold text-red-500 uppercase">{errors.category.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer — Cancel and Create Task buttons */}
          <div className="px-6 py-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row gap-3">

            {/* Cancel — native button, dismisses without saving */}
            <button
              type="button"
              onClick={onClose}
              className="h-12 md:h-14 px-6 bg-white dark:bg-slate-800 font-bold rounded-xl sm:flex-1"
            >
              Cancel
            </button>

            {/* Submit — disabled while form is processing */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 md:h-14 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg sm:flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
