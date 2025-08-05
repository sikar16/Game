import React from 'react';
import { useToast } from './use-toast';

const Toast = ({ toast, onRemove }) => {
    const getVariantStyles = (variant) => {
        switch (variant) {
            case 'destructive':
                return 'bg-red-600 text-white border-red-600';
            case 'success':
                return 'bg-green-600 text-white border-green-600';
            default:
                return 'bg-white text-gray-900 border-gray-200 shadow-lg';
        }
    };

    return (
        <div
            className={`
        relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all
        ${getVariantStyles(toast.variant)}
      `}
        >
            <div className="grid gap-1">
                {toast.title && (
                    <div className="text-sm font-semibold">{toast.title}</div>
                )}
                {toast.description && (
                    <div className="text-sm opacity-90">{toast.description}</div>
                )}
            </div>
            <button
                onClick={() => onRemove(toast.id)}
                className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
            >
                <span className="sr-only">Close</span>
                <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    );
};

export const Toaster = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
};