import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import { useToast } from '../hooks/useToast.ts';
import { useUpdatePassword } from '../hooks/useUpdatePassword.ts';
import { StarfieldBackground } from '../components/StarfieldBackground.tsx';

export const UpdatePasswordPage = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const { isLoading, error, success, handleUpdatePassword } = useUpdatePassword();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (success) {
            showToast('Password updated successfully. Welcome back!', 'success');
            navigate('/');
        }
    }, [success, navigate, showToast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (newPassword !== confirmPassword) {
            setLocalError('Passwords do not match.');
            return;
        }

        await handleUpdatePassword(newPassword);
    };

    return (
        <div className="relative min-h-screen bg-[#010310] overflow-hidden flex items-center justify-center">
            <StarfieldBackground />

            <div className="relative z-10 w-full max-w-sm px-6">
                <div className="backdrop-blur-xl bg-black/40 rounded-2xl border border-white/10 p-8 shadow-2xl shadow-black/50 transition-all duration-300">
                    
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-xl bg-linear-to-br from-sky-500/90 to-blue-600/90 shadow-lg shadow-blue-500/20">
                            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-light text-white tracking-wide mb-2">
                            Update Password
                        </h1>
                        <p className="text-xs text-gray-400 font-light mb-3">
                            Secure your account with a new password
                        </p>
                        <div className="h-px w-12 mx-auto bg-linear-to-r from-transparent via-gray-500 to-transparent"></div>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50 focus:bg-white/10 focus:ring-1 focus:ring-sky-500/50 transition-all duration-200"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50 focus:bg-white/10 focus:ring-1 focus:ring-sky-500/50 transition-all duration-200"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {(error || localError) && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
                                <p className="text-sm text-red-300 text-center">
                                    {localError || error}
                                </p>
                            </div>
                        )}

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full py-3.5 mt-2 bg-linear-to-r from-sky-500 to-blue-600 text-white rounded-lg font-medium shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};