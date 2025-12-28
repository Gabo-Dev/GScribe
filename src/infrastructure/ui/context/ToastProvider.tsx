import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { ToastContext } from './ToastContext.tsx';
import type {  Toast, ToastType } from './ToastContext.tsx'; 
import { ToastList } from '../components/feedback/ToastList.tsx';

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}
            <ToastList toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}