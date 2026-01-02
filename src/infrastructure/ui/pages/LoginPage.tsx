import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import { useToast } from '../hooks/useToast.ts';
import type { LoginUseCase } from '../../../application/auth/LoginUseCase.ts';
import type { SendPasswordResetEmailUseCase } from '../../../application/auth/SendPasswordResetEmailUseCase.ts';
import { BaseModal } from '../components/modals/BaseModal.tsx';
import { ResetPasswordForm } from '../components/modals/ResetPasswordForm.tsx';
import { StarfieldBackground } from '../components/StarfieldBackground.tsx';

interface LoginPageProps {
  loginUseCase: LoginUseCase;
  sendPasswordResetEmailUseCase: SendPasswordResetEmailUseCase;
}

export function LoginPage({ loginUseCase, sendPasswordResetEmailUseCase }: LoginPageProps) {
  const { setUser } = useAuth();
  const { showToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingReset, setIsLoadingReset] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await loginUseCase.execute(email, password);
      setUser(user);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async(email: string) => {
    setIsLoadingReset(true);
    try {
      await sendPasswordResetEmailUseCase.execute(email);
      showToast('Recovery email sent successfully', 'success');
      setIsOpen(false);
    } catch (err) {
      if (err instanceof Error) showToast(err.message, 'error');
      else showToast('Failed to send recovery email', 'error');
    } finally {
      setIsLoadingReset(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#010310] overflow-hidden flex items-center justify-center">
      <StarfieldBackground />

      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="backdrop-blur-xl bg-black/40 rounded-2xl border border-white/10 p-8 shadow-2xl shadow-black/50 transition-all duration-300">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-xl bg-linear-to-br from-sky-500/90 to-blue-600/90 shadow-lg shadow-blue-500/20">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-light text-white tracking-wide mb-2">
              GScribe
            </h1>
            <p className="text-xs text-gray-400 font-light mb-3">
              Intelligent Platform
            </p>
            <div className="h-px w-12 mx-auto bg-linear-to-r from-transparent via-gray-500 to-transparent"></div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50 focus:bg-white/10 focus:ring-1 focus:ring-sky-500/50 transition-all duration-200"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className="text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors focus:outline-none"
                >
                  Forgot your password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50 focus:bg-white/10 focus:ring-1 focus:ring-sky-500/50 transition-all duration-200"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-red-300 text-center">
                  {error}
                </p>
              </div>
            )}

            <button
              disabled={isLoading}
              type="submit"
              className="w-full py-3.5 mt-2 bg-linear-to-r from-sky-500 to-blue-600 text-white rounded-lg font-medium shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-sky-400 hover:text-sky-300 transition-colors font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <BaseModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Reset Password"
        maxWidth="max-w-md"
      >
        <ResetPasswordForm
          isLoading={isLoadingReset}
          onSubmit={handleResetPassword}
          onCancel={() => setIsOpen(false)}
        />
      </BaseModal>
    </div>
  );
}