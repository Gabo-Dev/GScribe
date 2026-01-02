import { BaseModal } from "./BaseModal.tsx";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteAccountModal({ isOpen, onClose, onConfirm, isLoading }: Props) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Account"
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex gap-4 items-start">
          <svg
            className="w-6 h-6 text-red-500 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div className="space-y-2">
            <h4 className="text-red-400 font-medium">Warning: Irreversible Action</h4>
            <p className="text-sm text-red-300/80 leading-relaxed">
              You are about to permanently delete your account and all associated data (notes). This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            type="button"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirm}
            type="button"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-lg shadow-red-900/20 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? "Deleting..." : "Confirm Deletion"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}