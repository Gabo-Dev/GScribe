import { BaseModal } from "./BaseModal.tsx";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteNoteModal({ isOpen, onClose, onConfirm }: Props) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Note"
      maxWidth="max-w-md"
    >
      <div className="space-y-6">
        <p className="text-gray-300 text-sm leading-relaxed">
          Are you sure you want to delete this note? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirm}
            type="button"
            className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-lg shadow-red-900/20"
          >
            Delete Note
          </button>
        </div>
      </div>
    </BaseModal>
  );
}