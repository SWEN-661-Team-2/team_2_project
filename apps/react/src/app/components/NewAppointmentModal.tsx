import { useForm } from 'react-hook-form';
import { X, Clock, User, FileText, AlertCircle, Calendar } from 'lucide-react';

// Form field shape for a new appointment
interface AppointmentFormData {
  readonly time: string;
  readonly duration: string;
  readonly patientName: string;
  readonly appointmentType: string;
  readonly status: string;
}

// Props passed in from SchedulePage
interface NewAppointmentModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: AppointmentFormData) => void;
}

export function NewAppointmentModal({ isOpen, onClose, onSubmit }: NewAppointmentModalProps) {
  // react-hook-form — handles validation, submission state, and error messages
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AppointmentFormData>();

  // Early return keeps the DOM clean when the modal is not needed
  if (!isOpen) return null;

  // Available time slots shown in the time selection dropdown
  const timeSlots = [
    '08:00 AM','08:30 AM','09:00 AM','09:30 AM','10:00 AM','10:30 AM',
    '11:00 AM','11:30 AM','12:00 PM','12:30 PM','01:00 PM','01:30 PM',
    '02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM',
    '05:00 PM','05:30 PM','06:00 PM',
  ];

  // Adds a short artificial delay before calling the parent onSubmit handler
  // so the loading spinner is visible for at least one animation frame
  const handleFormSubmit = async (data: AppointmentFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    onSubmit(data);
    onClose();
  };

  // Reusable inline SVG chevron for custom select dropdowns
  const chevron = (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  // Returns Tailwind classes for form inputs — red tint when the field has a validation error
  const inputClasses = (hasError: boolean) => `
    w-full h-12 md:h-14 pl-11 pr-4 rounded-xl border-2 transition-all outline-none font-medium
    ${hasError
      ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-200'
      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400'
    }
  `;

  return (
    // Full-screen overlay — traps focus context for the modal
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6"
      data-testid="appointment-modal"
    >
      {/* Backdrop — clicking outside closes the modal */}
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 w-full cursor-default"
        onClick={onClose}
        aria-label="Close appointment modal"
      />
      {/* Modal Container */}
      <div className="relative w-full h-full md:h-auto md:max-w-2xl md:rounded-3xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

        {/* Modal Header — title, subtitle, and close button */}
        <div className="flex-shrink-0 px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">New Appointment</h2>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Schedule a new care session for a patient</p>
            </div>
            {/* Close button — native button for full keyboard and assistive tech support */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="flex-shrink-0 p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-500 dark:text-slate-400"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form Body — scrollable on small screens */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">

            {/* Row 1: Time + Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Time selection dropdown */}
              <div>
                <label
                  htmlFor="appointment-time"
                  className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide ml-1"
                >
                  Time Selection
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 z-10" />
                  <select
                    id="appointment-time"
                    className={`${inputClasses(!!errors.time)} appearance-none cursor-pointer`}
                    {...register('time', { required: 'Time is required' })}
                  >
                    <option value="">Select a time...</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  {chevron}
                </div>
                {errors.time && (
                  <div className="flex items-center gap-1.5 mt-2 text-red-500 font-bold text-xs ml-1 uppercase">
                    <AlertCircle className="w-4 h-4" />
                    {errors.time.message}
                  </div>
                )}
              </div>

              {/* Duration dropdown */}
              <div>
                <label
                  htmlFor="appointment-duration"
                  className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide ml-1"
                >
                  Duration
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 z-10" />
                  <select
                    id="appointment-duration"
                    className={`${inputClasses(!!errors.duration)} appearance-none cursor-pointer`}
                    {...register('duration', { required: 'Duration is required' })}
                  >
                    <option value="">Choose length...</option>
                    {['15 min', '30 min', '45 min', '60 min'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {chevron}
                </div>
              </div>
            </div>

            {/* Patient name text input */}
            <div>
              <label
                htmlFor="appointment-patient"
                className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide ml-1"
              >
                Patient Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 z-10" />
                <input
                  id="appointment-patient"
                  type="text"
                  placeholder="e.g. John Doe"
                  className={inputClasses(!!errors.patientName)}
                  {...register('patientName', { required: 'Patient name is required' })}
                />
              </div>
              {errors.patientName && (
                <div className="flex items-center gap-1.5 mt-2 text-red-500 font-bold text-xs ml-1 uppercase">
                  <AlertCircle className="w-4 h-4" />
                  {errors.patientName.message}
                </div>
              )}
            </div>

            {/* Row 2: Session Type + Priority Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Appointment type dropdown */}
              <div>
                <label
                  htmlFor="appointment-type"
                  className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide ml-1"
                >
                  Session Type
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 z-10" />
                  <select
                    id="appointment-type"
                    className={`${inputClasses(!!errors.appointmentType)} appearance-none cursor-pointer`}
                    {...register('appointmentType', { required: 'Type is required' })}
                  >
                    <option value="">Select type...</option>
                    {['Medication Round', 'Consultation', 'Check-up', 'Therapy'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {chevron}
                </div>
              </div>

              {/* Priority / status dropdown */}
              <div>
                <label
                  htmlFor="appointment-status"
                  className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide ml-1"
                >
                  Priority Status
                </label>
                <div className="relative">
                  <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 z-10" />
                  <select
                    id="appointment-status"
                    className={`${inputClasses(!!errors.status)} appearance-none cursor-pointer`}
                    {...register('status', { required: 'Status is required' })}
                  >
                    <option value="">Select status...</option>
                    {['Scheduled', 'Completed', 'Urgent'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {chevron}
                </div>
              </div>
            </div>
          </div>

          {/* Footer — Cancel and Schedule buttons, sticky on mobile */}
          <div className="sticky md:relative bottom-0 px-6 py-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 backdrop-blur-md">
            <div className="flex flex-col-reverse md:flex-row gap-3">

              {/* Cancel — native button, no role needed */}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-12 md:h-14 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all"
              >
                Cancel
              </button>

              {/* Submit — shows spinner while isSubmitting */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] h-12 md:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5" />
                    <span>Schedule Appointment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
