import { createPortal } from "react-dom";
import type { Toast, ToastType } from "../../context/ToastContext.tsx";

interface ToastListProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

const getToastStyles = (type: ToastType) => {
    switch (type) {
        case 'success':
            return "bg-green-50 border-green-200 text-green-800";
        case 'error':
            return "bg-red-50 border-red-200 text-red-800";
        case 'info':
            return "bg-blue-50 border-blue-200 text-blue-800";
        default:
            return "bg-gray-50 border-gray-200 text-gray-800";
    }
};

const getIcon = (type: ToastType) => {
    switch (type) {
        case 'success':
            return (
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            );
        case 'error': 
            return (
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            );
        default: 
            return (
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
    }
};

export function ToastList({ toasts, onRemove }: ToastListProps) {
    // 1. Busamos el anclaje en el index.html
    const portalRoot = document.getElementById("portal-root");

    if (!portalRoot) return null;

    // 2. Renderizamos fuera de la App, directo en el body
    return createPortal(
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm px-4 sm:px-0">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                        flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 animate-in slide-in-from-right-full
                        ${getToastStyles(toast.type)}
                    `}
                    role="alert"
                >
                    <div className="shrink-0 mt-0.5">
                        {getIcon(toast.type)}
                    </div>

                    <div className="flex-1 text-sm font-medium wrap-break-word">
                        {toast.message}
                    </div>

                    <button
                        type="button"
                        onClick={() => onRemove(toast.id)}
                        className="shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>,
        portalRoot 
    );
}