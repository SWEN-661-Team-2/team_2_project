import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Heart, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface LoginFormData {
  readonly email: string;
  readonly password: string;
  readonly rememberMe: boolean;
}

interface LoginProps {
  readonly onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Login data:', data);
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4 md:p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-white rounded-none md:rounded-2xl shadow-none md:shadow-xl border-0 md:border border-slate-200 overflow-hidden">
          <div className="px-6 md:px-8 pt-8 md:pt-10 pb-6 text-center border-b border-slate-100">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Heart className="w-9 h-9 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">CareConnect</h1>
            <p className="text-slate-600 text-sm md:text-base">Supporting Care, Connecting Hearts</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-6 md:px-8 py-8">
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`w-full h-12 md:h-14 px-4 rounded-lg border ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 placeholder:text-slate-400`}
                  placeholder="Enter your email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
                  })}
                />
                {errors.email && (
                  <div className="flex items-center gap-1.5 mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm font-medium">{errors.email.message}</p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`w-full h-12 md:h-14 px-4 pr-12 rounded-lg border ${errors.password ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 placeholder:text-slate-400`}
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1.5 mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm font-medium">{errors.password.message}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-blue-500 cursor-pointer"
                    {...register('rememberMe')}
                  />
                  <span className="text-sm text-slate-600 select-none">Remember me</span>
                </label>
                <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 md:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : 'Sign In'}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <button type="button" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">Sign up</button>
              </p>
            </div>
          </form>
        </div>
        <p className="text-center text-xs text-slate-500 mt-6 px-4">
          Protected by industry-standard encryption. Your data is secure.
        </p>
      </div>
    </div>
  );
}
