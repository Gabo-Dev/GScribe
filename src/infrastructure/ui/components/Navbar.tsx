interface Props {
  userEmail: string | null | undefined;
  isLogoutLoading: boolean;
  isDeleteAccountLoading: boolean;
  onLogout: () => void;
  onOpenLegal: () => void;
  onDeleteAccount: () => void;
}

export function Navbar({
  userEmail,
  isLogoutLoading,
  isDeleteAccountLoading,
  onLogout,
  onOpenLegal,
  onDeleteAccount,
}: Props) {
  return (
    <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-900/20">
              <span className="font-bold text-white">G</span>
            </div>
            <span className="font-semibold text-lg tracking-tight text-gray-100">
              GScribe
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenLegal}
              type="button"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title="Información Legal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Legal Notice</span>
            </button>

            <span className="text-sm text-gray-400 hidden sm:block">
              {userEmail}
            </span>

            <button
              onClick={onDeleteAccount}
              type="button"
              disabled={isDeleteAccountLoading}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-shadow-gray-50 hover:text-white  rounded-lg border border-gray-800 hover:border-gray-700 transition-all bg-red-600 hover:bg-red-400/50"
            >
              {isDeleteAccountLoading ? "Deleting..." : "Delete Account"}
            </button>

            <button
              onClick={onLogout}
              type="button"
              disabled={isLogoutLoading}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg border border-gray-800 hover:border-gray-700 transition-all"
            >
              {isLogoutLoading ? "Bye..." : "Sign Out"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
