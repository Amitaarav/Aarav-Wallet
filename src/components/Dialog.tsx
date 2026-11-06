import React from "react";
import { createPortal } from "react-dom";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "info";
}

/**
 * Reusable Confirmation Dialog component.
 * Rendered using a React Portal to the document body to avoid parent layout issues (like transforms).
 * Feature-rich design with glassmorphism and danger/info variants.
 */
export function Dialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}: DialogProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in"
      style={{ isolation: 'isolate' }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] w-full max-w-md p-10 shadow-3xl relative overflow-hidden group animate-in fade-in zoom-in duration-300">
        {/* Decorative background gradient */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[100px] opacity-20 transition-colors duration-500 ${variant === 'danger' ? 'bg-red-500' : 'bg-blue-500'}`} />
        
        <div className="relative z-10">
          <h3 className="text-3xl font-black text-white font-outfit tracking-tight mb-4">{title}</h3>
          <p className="text-white/40 text-sm leading-relaxed mb-10 font-medium">{description}</p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98] ${
                variant === "danger"
                  ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
                  : "bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/5"
              }`}
            >
              {confirmText}
            </button>
            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-white/5 text-white/40 font-black text-xs uppercase tracking-[0.2em] border border-white/5 hover:bg-white/10 hover:text-white transition-all active:scale-[0.98]"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
