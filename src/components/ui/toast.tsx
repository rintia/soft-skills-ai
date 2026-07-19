"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { clsx } from "clsx";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const autoDismiss = setTimeout(() => {
      handleClose();
    }, 4000);

    return () => clearTimeout(autoDismiss);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // match exit animation duration
  };

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />,
  };

  const borderColors = {
    success: "border-l-4 border-l-teal-500",
    error: "border-l-4 border-l-red-500",
    info: "border-l-4 border-l-blue-500",
  };

  return (
    <div
      className={clsx(
        "pointer-events-auto flex items-center justify-between w-full p-4 rounded-xl shadow-2xl backdrop-blur-md bg-slate-900/90 dark:bg-slate-950/90 text-slate-100 border border-slate-800/80 transition-all duration-300",
        borderColors[toast.type],
        isExiting ? "animate-toast-out" : "animate-toast-in"
      )}
    >
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <p className="text-sm font-medium pr-4 leading-normal">{toast.message}</p>
      </div>
      <button
        onClick={handleClose}
        className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-800/50"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
