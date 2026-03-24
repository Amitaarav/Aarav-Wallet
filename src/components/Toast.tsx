import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { createPortal } from "react-dom";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`
                pointer-events-auto
                min-w-[320px] max-w-md px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl
                flex items-center gap-4 animate-fade-in
                ${toast.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : ""}
                ${toast.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" : ""}
                ${toast.type === "info" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : ""}
              `}
            >
              <div className={`w-2 h-2 rounded-full ${
                toast.type === "success" ? "bg-green-400" :
                toast.type === "error" ? "bg-red-400" : "bg-blue-400"
              }`} />
              <p className="text-sm font-bold tracking-tight">{toast.message}</p>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}
