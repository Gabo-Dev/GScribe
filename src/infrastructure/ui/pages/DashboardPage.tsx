import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import type { LogOutUseCase } from "../../../application/auth/LogOutUseCase";

interface DashboardPageProps {
    logOutUseCase: LogOutUseCase
}
export function DashboardPage({ logOutUseCase }: DashboardPageProps) {
    const { user, setUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logOutUseCase.execute();
            setUser(null); // redirect to login
        } catch (error) {
            console.error(error);
        }finally {
            setIsLoading(false);
        }
    };

    return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                <span className="font-bold text-white">G</span>
              </div>
              <span className="font-semibold text-lg tracking-tight">GScribe</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 hidden sm:block">
                {user?.email || 'Guest User'}
              </span>
              
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 border border-gray-700 hover:border-gray-600"
              >
                {isLoading ? 'Exiting...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-light mb-4">Welcome to your Workspace</h2>
          <p className="text-gray-400">
            Select a project or create a new note to get started.
          </p>
        </div>
      </main>
    </div>
  );
}