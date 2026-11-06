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
 * Uses React Portal with crisp, distraction-free modal geometry and clear hierarchy.
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ isolation: "isolate" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="bg-[#0c0c0c] border border-white/[0.08] rounded-2xl w-full max-w-sm p-6 relative animate-slide-up shadow-2xl">
        <h3 className="text-xl font-bold text-white font-outfit tracking-[-0.02em] mb-2">
          {title}
        </h3>
        <p className="text-white/50 text-xs leading-relaxed mb-6">
          {description}
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`w-full py-3 rounded-xl font-semibold text-xs tracking-wide transition-all duration-150 active:scale-[0.98] ${
              variant === "danger"
                ? "bg-rose-600 text-white hover:bg-rose-500 shadow-md shadow-rose-950/40"
                : "bg-white text-black hover:bg-white/90"
            }`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-white/[0.04] text-white/50 font-semibold text-xs tracking-wide border border-white/[0.06] hover:bg-white/[0.08] hover:text-white transition-all duration-150 active:scale-[0.98]"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
