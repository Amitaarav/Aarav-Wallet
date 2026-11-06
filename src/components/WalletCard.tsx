import { useState } from "react";

interface WalletProps {
  address: string;
  balance?: number;
  usdcBalance?: number;
  type: "Solana" | "Ethereum";
  index: number;
  onSend?: () => void;
  onReceive?: () => void;
  onViewPrivateKey?: () => void;
  onDelete?: () => void;
}

/**
 * Compact, modern Wallet Account Card.
 * Streamlined geometry to avoid bulky, oversized containers.
 * Integrates quick actions: Send, Receive (QR), Explorer, Private Key export, and Delete.
 */
export function WalletCard({
  address,
  balance,
  usdcBalance,
  type,
  index,
  onSend,
  onReceive,
  onViewPrivateKey,
  onDelete,
}: WalletProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSolana = type === "Solana";
  const shortAddress = `${address.slice(0, 4)}…${address.slice(-4)}`;
  const explorerUrl = isSolana
    ? `https://solscan.io/account/${address}`
    : `https://etherscan.io/address/${address}`;

  return (
    <div
      className="group bg-white/[0.025] hover:bg-white/[0.045] border border-white/[0.07] hover:border-white/[0.12] rounded-xl p-4 transition-all duration-200 animate-enter flex flex-col justify-between"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Top Bar: Network + Account Index + Address Copy */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Network Icon */}
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
              isSolana
                ? "bg-violet-500/15 text-violet-300 border border-violet-500/30"
                : "bg-sky-500/15 text-sky-300 border border-sky-500/30"
            }`}
          >
            {isSolana ? "◎" : "Ξ"}
          </div>
          <div>
            <span className="text-xs font-semibold text-white/90 leading-none">
              Account {index + 1}
            </span>
          </div>
        </div>

        {/* Address Pill + Copy */}
        <div className="flex items-center gap-1">
          <button
            onClick={copyToClipboard}
            title="Click to copy address"
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-[11px] font-mono text-white/60 hover:text-white transition-colors"
          >
            <span>{copied ? "Copied" : shortAddress}</span>
            <svg
              className={`w-3 h-3 ${copied ? "text-emerald-400" : "text-white/40"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {copied ? (
                <polyline points="20 6 9 17 4 12" />
              ) : (
                <>
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </>
              )}
            </svg>
          </button>

          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View on Explorer"
            className="p-1 rounded-md text-white/30 hover:text-white/80 hover:bg-white/[0.06] transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Balance Row */}
      <div className="my-2">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white font-outfit tabular-nums tracking-[-0.02em]">
              {balance?.toLocaleString(undefined, { maximumFractionDigits: 4 }) || "0.0000"}
            </span>
            <span className="text-xs font-bold text-white/40 uppercase">
              {isSolana ? "SOL" : "ETH"}
            </span>
          </div>

          {/* USDC Balance Chip for Solana */}
          {isSolana && usdcBalance !== undefined && usdcBalance > 0 && (
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 tabular-nums">
              ${usdcBalance.toFixed(2)} USDC
            </span>
          )}
        </div>
      </div>

      {/* Action Bar: Compact, ergonomically balanced */}
      <div className="flex items-center gap-1.5 pt-3 mt-1 border-t border-white/[0.05]">
        {/* Send Button */}
        <button
          onClick={onSend}
          disabled={!isSolana}
          className={`flex-1 py-1.5 px-3 rounded-lg font-semibold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1 ${
            isSolana
              ? "bg-white text-black hover:bg-white/90 shadow-sm"
              : "bg-white/[0.03] text-white/20 cursor-not-allowed border border-white/[0.04]"
          }`}
        >
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          <span>Send</span>
        </button>

        {/* Receive Button (QR & Address) */}
        <button
          onClick={onReceive}
          title="Receive & QR Code"
          className="flex-1 py-1.5 px-3 rounded-lg font-semibold text-xs bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/[0.06] transition-all active:scale-[0.98] flex items-center justify-center gap-1"
        >
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="8 17 12 21 16 17" />
            <line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" />
          </svg>
          <span>Receive</span>
        </button>

        {/* Export Key Button */}
        <button
          onClick={onViewPrivateKey}
          title="Export Private Key"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white/80 hover:bg-white/[0.06] border border-transparent hover:border-white/[0.06] transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
          </svg>
        </button>

        {/* Delete / Remove Account */}
        <button
          onClick={onDelete}
          title="Remove Account"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
