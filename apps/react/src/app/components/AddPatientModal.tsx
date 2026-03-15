import { useForm } from 'react-hook-form';
import { X, UserPlus, Calendar as CalendarIcon, Mail, Phone } from 'lucide-react';

interface PatientFormData {
  readonly firstName: string;
  readonly lastName: string;
  readonly dateOfBirth: string;
  readonly gender: string;
  readonly phone: string;
  readonly email: string;
}

interface AddPatientModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: PatientFormData) => void;
}

export function AddPatientModal({ isOpen, onClose, onSubmit }: AddPatientModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PatientFormData>();

  if (!isOpen) return null;

  const handleFormSubmit = async (data: PatientFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSubmit(data);
    onClose();
  };

  const inputClass = (hasError: boolean) =>
    `w-full h-12 md:h-14 px-4 rounded-lg border-2 ${hasError ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 placeholder:text-slate-400`;

  const iconInputClass = (hasError: boolean) =>
    `w-full h-12 md:h-14 pl-11 pr-4 rounded-lg border-2 ${hasError ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 placeholder:text-slate-400`;

  const chevron = (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm w-full cursor-default"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        aria-label="Close modal"
      />
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        <div className="flex-shrink-0 px-6 md:px-8 py-5 border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <UserPlus className="w-5 h-5 text-green-600" />
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">Add New Patient</h2>
              </div>
              <p className="text-sm text-slate-600">Fields marked <span className="text-red-500 font-semibold">*</span> are required.</p>
            </div>
            <button onClick={onClose} className="flex-shrink-0 p-2 hover:bg-white rounded-lg transition-colors" aria-label="Close modal">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto">
          <div className="px-6 md:px-8 py-6 space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-2">First Name <span className="text-red-500">*</span></label>
                <input id="firstName" type="text" placeholder="Enter first name" className={inputClass(!!errors.firstName)}
                  {...register('firstName', { required: 'First name is required' })} />
                {errors.firstName && <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.firstName.message}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-2">Last Name <span className="text-red-500">*</span></label>
                <input id="lastName" type="text" placeholder="Enter last name" className={inputClass(!!errors.lastName)}
                  {...register('lastName', { required: 'Last name is required' })} />
                {errors.lastName && <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-slate-700 mb-2">Date of Birth <span className="text-red-500">*</span></label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input id="dateOfBirth" type="date" className={iconInputClass(!!errors.dateOfBirth)}
                    {...register('dateOfBirth', { required: 'Date of birth is required' })} />
                </div>
                {errors.dateOfBirth && <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.dateOfBirth.message}</p>}
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-semibold text-slate-700 mb-2">Gender <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select id="gender" className={`${inputClass(!!errors.gender)} appearance-none cursor-pointer`}
                    {...register('gender', { required: 'Gender is required' })}>
                    <option value="">Select gender</option>
                    {['Male','Female','Other','Prefer not to say'].map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {chevron}
                </div>
                {errors.gender && <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.gender.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">Phone <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input id="phone" type="tel" placeholder="(555) 123-4567" className={iconInputClass(!!errors.phone)}
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: { value: /^[\d\s\-()+]+$/, message: 'Invalid phone number' },
                    })} />
                </div>
                {errors.phone && <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.phone.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input id="email" type="email" placeholder="patient@example.com" className={iconInputClass(!!errors.email)}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
                    })} />
                </div>
                {errors.email && <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.email.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 px-6 md:px-8 py-5 border-t border-slate-200 bg-slate-50 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
            <button type="button" onClick={onClose} className="h-12 md:h-14 px-6 bg-white hover:bg-slate-100 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg transition-all">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="h-12 md:h-14 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adding...</span>
                </div>
              ) : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
