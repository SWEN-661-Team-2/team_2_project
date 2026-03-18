// import { useForm } from 'react-hook-form';
// import { X, UserPlus, Calendar as CalendarIcon, Mail, Phone, AlertCircle } from 'lucide-react';

// interface PatientFormData {
//   readonly firstName: string;
//   readonly lastName: string;
//   readonly dateOfBirth: string;
//   readonly gender: string;
//   readonly phone: string;
//   readonly email: string;
// }

// interface AddPatientModalProps {
//   readonly isOpen: boolean;
//   readonly onClose: () => void;
//   readonly onSubmit: (data: PatientFormData) => void;
// }

// export function AddPatientModal({ isOpen, onClose, onSubmit }: AddPatientModalProps) {
//   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PatientFormData>();

//   if (!isOpen) return null;

//   const handleFormSubmit = async (data: PatientFormData) => {
//     // Artificial delay for UI feedback
//     await new Promise((resolve) => setTimeout(resolve, 600));
//     onSubmit(data);
//     onClose();
//   };

//   const getInputClass = (hasError: boolean, hasIcon: boolean = false) => `
//     w-full h-12 md:h-14 rounded-xl border-2 transition-all outline-none font-medium
//     ${hasIcon ? 'pl-11 pr-4' : 'px-4'}
//     ${hasError 
//       ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-200' 
//       : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400'
//     }
//     placeholder:text-slate-400 dark:placeholder:text-slate-500
//   `;

//   const labelClass = "block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide ml-1";

//   const chevron = (
//     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//       <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
//       </svg>
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//       {/* Backdrop */}
//       <div 
//         className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
//         onClick={onClose}
//       />

//       {/* Modal Container */}
//       <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

//         {/* Header */}
//         <div className="flex-shrink-0 px-6 md:px-8 py-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-900">
//           <div className="flex items-start justify-between">
//             <div className="flex-1">
//               <div className="flex items-center gap-2 mb-1 text-emerald-600 dark:text-emerald-400">
//                 <UserPlus className="w-6 h-6" />
//                 <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Add New Patient</h2>
//               </div>
//               <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Register a new profile in the system</p>
//             </div>
//             <button 
//               onClick={onClose} 
//               className="flex-shrink-0 p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-500 dark:text-slate-400"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>
//         </div>

//         {/* Form Body */}
//         <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto">
//           <div className="px-6 md:px-8 py-6 space-y-6">

//             {/* Names */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className={labelClass}>First Name</label>
//                 <input 
//                   type="text" 
//                   placeholder="e.g. Jane" 
//                   className={getInputClass(!!errors.firstName)}
//                   {...register('firstName', { required: 'First name is required' })} 
//                 />
//                 {errors.firstName && (
//                   <p className="mt-2 text-xs text-red-500 font-bold uppercase flex items-center gap-1 ml-1">
//                     <AlertCircle className="w-3.5 h-3.5" /> {errors.firstName.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className={labelClass}>Last Name</label>
//                 <input 
//                   type="text" 
//                   placeholder="e.g. Smith" 
//                   className={getInputClass(!!errors.lastName)}
//                   {...register('lastName', { required: 'Last name is required' })} 
//                 />
//                 {errors.lastName && (
//                   <p className="mt-2 text-xs text-red-500 font-bold uppercase flex items-center gap-1 ml-1">
//                     <AlertCircle className="w-3.5 h-3.5" /> {errors.lastName.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* DOB & Gender */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className={labelClass}>Date of Birth</label>
//                 <div className="relative">
//                   <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 z-10" />
//                   <input 
//                     type="date" 
//                     className={getInputClass(!!errors.dateOfBirth, true)}
//                     {...register('dateOfBirth', { required: 'Date of birth is required' })} 
//                   />
//                 </div>
//                 {errors.dateOfBirth && (
//                   <p className="mt-2 text-xs text-red-500 font-bold uppercase flex items-center gap-1 ml-1">
//                     <AlertCircle className="w-3.5 h-3.5" /> {errors.dateOfBirth.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className={labelClass}>Gender</label>
//                 <div className="relative">
//                   <select 
//                     className={`${getInputClass(!!errors.gender)} appearance-none cursor-pointer`}
//                     {...register('gender', { required: 'Gender is required' })}
//                   >
//                     <option value="">Select gender...</option>
//                     {['Male','Female','Other','Prefer not to say'].map((o) => <option key={o} value={o}>{o}</option>)}
//                   </select>
//                   {chevron}
//                 </div>
//                 {errors.gender && (
//                   <p className="mt-2 text-xs text-red-500 font-bold uppercase flex items-center gap-1 ml-1">
//                     <AlertCircle className="w-3.5 h-3.5" /> {errors.gender.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Contact Info */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className={labelClass}>Phone Number</label>
//                 <div className="relative">
//                   <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 z-10" />
//                   <input 
//                     type="tel" 
//                     placeholder="(555) 000-0000" 
//                     className={getInputClass(!!errors.phone, true)}
//                     {...register('phone', {
//                       required: 'Phone number is required',
//                       pattern: { value: /^[\d\s\-()+]+$/, message: 'Invalid phone format' },
//                     })} 
//                   />
//                 </div>
//                 {errors.phone && (
//                   <p className="mt-2 text-xs text-red-500 font-bold uppercase flex items-center gap-1 ml-1">
//                     <AlertCircle className="w-3.5 h-3.5" /> {errors.phone.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className={labelClass}>Email Address</label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 z-10" />
//                   <input 
//                     type="email" 
//                     placeholder="name@example.com" 
//                     className={getInputClass(!!errors.email, true)}
//                     {...register('email', {
//                       required: 'Email is required',
//                       pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' },
//                     })} 
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="mt-2 text-xs text-red-500 font-bold uppercase flex items-center gap-1 ml-1">
//                     <AlertCircle className="w-3.5 h-3.5" /> {errors.email.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Footer Actions */}
//           <div className="flex-shrink-0 px-6 md:px-8 py-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
//             <button 
//               type="button" 
//               onClick={onClose} 
//               className="h-12 md:h-14 px-8 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all"
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit" 
//               disabled={isSubmitting} 
//               className="h-12 md:h-14 px-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {isSubmitting ? (
//                 <>
//                   <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
//                   <span>Processing...</span>
//                 </>
//               ) : (
//                 <>
//                   <UserPlus className="w-5 h-5" />
//                   <span>Register Patient</span>
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useForm } from 'react-hook-form';
import { X, UserPlus, Calendar as CalendarIcon, Mail, Phone, AlertCircle } from 'lucide-react';

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
    // Artificial delay for UI feedback
    await new Promise((resolve) => setTimeout(resolve, 600));
    onSubmit(data);
    onClose();
  };

  const getInputClass = (hasError: boolean, hasIcon: boolean = false) => `
    w-full h-12 md:h-14 rounded-xl border-2 transition-all outline-none font-medium
    ${hasIcon ? 'pl-11 pr-4' : 'px-4'}
    ${hasError 
      ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-200' 
      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400'
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex-shrink-0 px-6 md:px-8 py-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 text-emerald-600 dark:text-emerald-400">
                <UserPlus className="w-6 h-6" />
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Add New Patient</h2>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Register a new profile in the system</p>
            </div>
            <button 
              onClick={onClose} 
              className="flex-shrink-0 p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-500 dark:text-slate-400"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto">
          <div className="px-6 md:px-8 py-6 space-y-6">

            {/* Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className={labelClass}>First Name</label>
                <input 
                  id="firstName"
                  type="text" 
                  placeholder="e.g. Jane" 
                  className={getInputClass(!!errors.firstName)}
                  {...register('firstName', { required: 'First name is required' })} 
                />
                {errors.firstName && (
                  <p className="mt-2 text-xs text-red-500 font-bold uppercase flex items-center gap-1 ml-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className={labelClass}>Last Name</label>
                <input 
                  id="lastName"
                  type="text" 
                  placeholder="e.g. Smith" 
                  className={getInputClass(!!errors.lastName)}
                  {...register('lastName', { required: 'Last name is required' })} 
                />
                {errors.lastName && (
                  <p className="mt-2 text-xs text-red-500 font-bold uppercase flex items-center gap-1 ml-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* DOB & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="dateOfBirth" className={labelClass}>Date of Birth</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 z-10" />
                  <input 
                    id="dateOfBirth"
                    type="date" 
                    className={getInputClass(!!errors.dateOfBirth, true)}
                    {...register('dateOfBirth', { required: 'Date of birth is required' })} 
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="mt-2 text-xs text-red-500 font-bold uppercase flex items-center gap-1 ml-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.dateOfBirth.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="gender" className={labelClass}>Gender</label>
                <div className="relative">
                  <select 
                    id="gender"
                    className={`${getInputClass(!!errors.gender)} appearance-none cursor-pointer`}
                    {...register('gender', { required: 'Gender is required' })}
                  >
                    <option value="">Select gender...</option>
                    {['Male','Female','Other','Prefer not to say'].map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {chevron}
                </div>
                {errors.gender && (
                  <p className="mt-2 text-xs text-red-500 font-bold uppercase flex items-center gap-1 ml-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className={labelClass}>Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 z-10" />
                  <input 
                    id="phone"
                    type="tel" 
                    placeholder="(555) 000-0000" 
                    className={getInputClass(!!errors.phone, true)}
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: { value: /^[\d\s\-()+]+$/, message: 'Invalid phone format' },
                    })} 
                  />
                </div>
                {errors.phone && (
                  <p className="mt-2 text-xs text-red-500 font-bold uppercase flex items-center gap-1 ml-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 z-10" />
                  <input 
                    id="email"
                    type="email" 
                    placeholder="name@example.com" 
                    className={getInputClass(!!errors.email, true)}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' },
                    })} 
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-xs text-red-500 font-bold uppercase flex items-center gap-1 ml-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex-shrink-0 px-6 md:px-8 py-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
            <button 
              type="button" 
              onClick={onClose} 
              className="h-12 md:h-14 px-8 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="h-12 md:h-14 px-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Register Patient</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}