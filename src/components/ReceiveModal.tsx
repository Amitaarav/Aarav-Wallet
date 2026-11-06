import { useState } from "react";
import { createPortal } from "react-dom";

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: {
    address?: string;
    publicKey?: string;
    type: "Solana" | "Ethereum";
    index: number;
  } | null;
}

export function ReceiveModal({ isOpen, onClose, wallet }: ReceiveModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !wallet) return null;

  const address = wallet.publicKey || wallet.address || "";
  const isSolana = wallet.type === "Solana";

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // QR code generated via SVG matrix or trusted static QR API (zero external deps)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&data=${encodeURIComponent(
    address
  )}`;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ isolation: "isolate" }}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="bg-[#0e0e0e] border border-white/[0.08] rounded-2xl w-full max-w-sm p-6 relative animate-slide-up shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isSolana ? "bg-violet-400" : "bg-sky-400"
              }`}
            />
            <h3 className="text-lg font-bold text-white font-outfit tracking-[-0.02em]">
              Receive {wallet.type}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-3.5 rounded-xl mx-auto w-48 h-48 flex items-center justify-center shadow-inner mb-4">
          <img
            src={qrUrl}
            alt="Wallet QR Code"
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>

        <p className="text-center text-xs text-white/40 mb-3">
          Scan QR or copy address to receive {isSolana ? "SOL / SPL tokens" : "ETH / ERC20 tokens"}
        </p>

        {/* Address Display & Copy */}
        <div
          onClick={handleCopy}
          className="group cursor-pointer bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.14] rounded-xl p-3 flex items-center justify-between gap-2 transition-all mb-4"
        >
          <span className="font-mono text-xs text-white/80 break-all select-all">
            {address}
          </span>
          <button
            type="button"
            className="shrink-0 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="flex gap-2">
          <a
            href={
              isSolana
                ? `https://solscan.io/account/${address}`
                : `https://etherscan.io/address/${address}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 text-center rounded-xl bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/[0.06] text-xs font-semibold tracking-wide transition-colors"
          >
            View on {isSolana ? "Solscan" : "Etherscan"} ↗
          </a>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-semibold tracking-wide transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

