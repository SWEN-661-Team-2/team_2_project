import { useForm } from 'react-hook-form';
import { X, Clock, User, FileText, AlertCircle, Calendar } from 'lucide-react';

interface AppointmentFormData {
  readonly time: string;
  readonly duration: string;
  readonly patientName: string;
  readonly appointmentType: string;
  readonly status: string;
}

interface NewAppointmentModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: AppointmentFormData) => void;
}

export function NewAppointmentModal({ isOpen, onClose, onSubmit }: NewAppointmentModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AppointmentFormData>();

  if (!isOpen) return null;

  const timeSlots = [
    '08:00 AM','08:30 AM','09:00 AM','09:30 AM','10:00 AM','10:30 AM',
    '11:00 AM','11:30 AM','12:00 PM','12:30 PM','01:00 PM','01:30 PM',
    '02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM',
    '05:00 PM','05:30 PM','06:00 PM',
  ];

  const handleFormSubmit = async (data: AppointmentFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSubmit(data);
    onClose();
  };

  const chevron = (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm w-full cursor-default"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        aria-label="Close modal"
      />
      <div className="relative w-full h-full md:h-auto md:max-w-2xl md:rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col">

        <div className="flex-shrink-0 px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">New Appointment</h2>
              </div>
              <p className="text-sm text-slate-600">Schedule care for a patient</p>
            </div>
            <button onClick={onClose} className="flex-shrink-0 p-2 hover:bg-white rounded-lg transition-colors" aria-label="Close modal">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="time" className="block text-sm font-semibold text-slate-700 mb-2">Time <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <select id="time" className={`w-full h-12 md:h-14 pl-11 pr-4 rounded-lg border-2 ${errors.time ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 appearance-none cursor-pointer`}
                    {...register('time', { required: 'Time is required' })}>
                    <option value="">Select time</option>
                    {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                  </select>
                  {chevron}
                </div>
                {errors.time && <div className="flex items-center gap-1.5 mt-2 text-red-600"><AlertCircle className="w-4 h-4 flex-shrink-0" /><p className="text-sm font-medium">{errors.time.message}</p></div>}
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-semibold text-slate-700 mb-2">Duration <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <select id="duration" className="w-full h-12 md:h-14 pl-11 pr-4 rounded-lg border-2 border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 appearance-none cursor-pointer"
                    {...register('duration', { required: 'Duration is required' })}>
                    <option value="">Select duration</option>
                    {['15 min','30 min','45 min','60 min'].map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {chevron}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="patientName" className="block text-sm font-semibold text-slate-700 mb-2">Patient Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input id="patientName" type="text" placeholder="Enter patient name"
                  className="w-full h-12 md:h-14 pl-11 pr-4 rounded-lg border-2 border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
                  {...register('patientName', { required: 'Patient name is required' })} />
              </div>
            </div>

            <div>
              <label htmlFor="appointmentType" className="block text-sm font-semibold text-slate-700 mb-2">Appointment Type <span className="text-red-500">*</span></label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <select id="appointmentType" className="w-full h-12 md:h-14 pl-11 pr-4 rounded-lg border-2 border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 appearance-none cursor-pointer"
                  {...register('appointmentType', { required: 'Appointment type is required' })}>
                  <option value="">Select appointment type</option>
                  {['Medication Round','Consultation','Check-up','Therapy'].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {chevron}
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-slate-700 mb-2">Status <span className="text-red-500">*</span></label>
              <div className="relative">
                <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <select id="status" className="w-full h-12 md:h-14 pl-11 pr-4 rounded-lg border-2 border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 appearance-none cursor-pointer"
                  {...register('status', { required: 'Status is required' })}>
                  <option value="">Select status</option>
                  {['Scheduled','Completed','Urgent'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {chevron}
              </div>
            </div>
          </div>

          <div className="sticky md:relative bottom-0 px-6 py-4 border-t border-slate-200 bg-white">
            <button type="submit" disabled={isSubmitting}
              className="w-full h-12 md:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : 'Save Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
