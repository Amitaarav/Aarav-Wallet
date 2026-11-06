import { useState } from "react";
import { createPortal } from "react-dom";

interface PrivateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: {
    address?: string;
    publicKey?: string;
    secretKey?: string;
    privateKey?: string;
    type: "Solana" | "Ethereum";
    index: number;
  } | null;
}

export function PrivateKeyModal({ isOpen, onClose, wallet }: PrivateKeyModalProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !wallet) return null;

  const key = wallet.type === "Solana" ? wallet.secretKey : wallet.privateKey;

  const handleCopy = () => {
    if (!key) return;
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setRevealed(false);
    setCopied(false);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ isolation: "isolate" }}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />
      <div className="bg-[#0e0e0e] border border-white/[0.08] rounded-2xl w-full max-w-sm p-6 relative animate-slide-up shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white font-outfit tracking-[-0.02em]">
            Export Private Key
          </h3>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
          <p className="text-[11px] text-amber-300 font-semibold mb-1">
            Never share your private key
          </p>
          <p className="text-[11px] text-amber-200/60 leading-relaxed">
            Anyone who has this key has full control of this account.
          </p>
        </div>

        <div className="mb-5">
          <label className="block text-white/40 text-[11px] font-semibold uppercase tracking-wider mb-2">
            {wallet.type} Account #{wallet.index + 1} Key
          </label>
          <div className="relative">
            <div
              className={`p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] font-mono text-xs break-all select-all transition-all ${
                revealed
                  ? "text-white/90"
                  : "text-transparent filter blur-sm select-none"
              }`}
            >
              {key || "Key unavailable"}
            </div>
            {!revealed && (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="absolute inset-0 w-full h-full flex items-center justify-center rounded-xl bg-black/40 hover:bg-black/30 text-xs font-semibold text-white transition-all backdrop-blur-[2px]"
              >
                Click to Reveal
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {revealed && (
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold tracking-wide border border-white/[0.08] transition-colors"
            >
              {copied ? "Copied!" : "Copy Key"}
            </button>
          )}
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-semibold tracking-wide transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

