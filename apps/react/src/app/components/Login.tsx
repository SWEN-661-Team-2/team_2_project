import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

// Database instance — used to query the IndexedDB Users table on login
import { db } from '../../db';

// Form field shape for the login form
interface LoginFormData {
  readonly email: string;
  readonly password: string;
  readonly rememberMe: boolean;
}

// Callback fired when the user successfully authenticates
interface LoginProps {
  readonly onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  // Controls password field visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // Holds the error message shown when DB auth fails or throws
  const [loginError, setLoginError] = useState<string | null>(null);

  // react-hook-form — handles field registration, validation, and submission state
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    // Clear any previous auth error before each attempt
    setLoginError(null);

    // Short artificial delay so the loading spinner is visible
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      // Query IndexedDB Users table.
      // The form field is named 'email' but the DB stores it as 'username' —
      // data.email is passed as the username value to bridge the two.
      const user = await db.users.where({
        username: data.email,
        password: data.password,
      }).first();

      if (user) {
        // Valid credentials — notify the parent to transition to the app
        onLogin();
      } else {
        setLoginError('Invalid email or password. Try admin@careconnect.com / password123');
      }
    } catch (err) {
      // Surface the raw error message if available, otherwise show a generic fallback
      const message = err instanceof Error ? err.message : 'Database connection error. Please try again.';
      setLoginError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4 md:p-6">

      {/* Decorative background blobs — purely visual, hidden from assistive tech */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-white rounded-none md:rounded-2xl shadow-none md:shadow-xl border-0 md:border border-slate-200 overflow-hidden">

          {/* Branding header — logo, app name, tagline */}
          <div className="px-6 md:px-8 pt-8 md:pt-10 pb-6 text-center border-b border-slate-100">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <img src="/careconnect_logo.png" alt="CareConnect logo" className="w-12 h-12 rounded-xl" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">CareConnect</h1>
            <p className="text-slate-600 text-sm md:text-base">Supporting Care, Connecting Hearts</p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 md:px-8 py-8">
            <div className="space-y-5">

              {/* Auth error banner — shown when DB lookup fails or returns no match */}
              {loginError && (
                <div
                  role="alert"
                  className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-700"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <p className="text-sm font-medium">{loginError}</p>
                </div>
              )}

              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@careconnect.com"
                  className={`w-full h-12 md:h-14 px-4 rounded-lg border ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 placeholder:text-slate-400`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
                  })}
                />
                {errors.email && (
                  <div className="flex items-center gap-1.5 mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    <p className="text-sm font-medium">{errors.email.message}</p>
                  </div>
                )}
              </div>

              {/* Password field with show/hide toggle */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`w-full h-12 md:h-14 px-4 pr-12 rounded-lg border ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 placeholder:text-slate-400`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    })}
                  />
                  {/* Native button — toggles password visibility */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword
                      ? <EyeOff className="w-5 h-5" aria-hidden="true" />
                      : <Eye className="w-5 h-5" aria-hidden="true" />
                    }
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1.5 mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    <p className="text-sm font-medium">{errors.password.message}</p>
                  </div>
                )}
              </div>

              {/* Remember me checkbox + Forgot password link */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-blue-500 cursor-pointer"
                    {...register('rememberMe')}
                  />
                  <span className="text-sm text-slate-600 select-none">Remember me</span>
                </label>
                {/* Native button — no role attribute needed */}
                <button
                  type="button"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit button — shows spinner while isSubmitting */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 md:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>

            </div>
          </form>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-500 pb-6">
            Protected by industry-standard encryption. Your data is secure.
          </p>
        </div>
      </div>
    </div>
  );
}
