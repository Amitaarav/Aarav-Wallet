import { useState } from "react";
import { createPortal } from "react-dom";
import { sendSol } from "../app/solana";

interface SendModalProps {
    isOpen: boolean;
    onClose: () => void;
    wallet: any;
}

/**
 * Modal for sending Solana (SOL) transactions.
 * Uses React Portals for perfect positioning regardless of parent layout.
 * Includes address validation (via required input) and loading/status states.
 */
export function SendModal({ isOpen, onClose, wallet }: SendModalProps) {
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error", message: string } | null>(null);

    if (!isOpen) return null;

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        try {
            const signature = await sendSol(wallet.keypair, recipient, parseFloat(amount));
            setStatus({ type: "success", message: `Sent! tx: ${signature ? signature.slice(0, 12) : "N/A"}…` });
            setTimeout(() => {
                onClose();
                setStatus(null);
                setAmount("");
                setRecipient("");
            }, 3000);
        } catch (err: any) {
            setStatus({ type: "error", message: err.message || "Transaction failed" });
        } finally {
            setLoading(false);
        }
    };

    const handleMax = () => {
        if (wallet.balance) setAmount((wallet.balance - 0.000005).toFixed(6));
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ isolation: 'isolate' }}
        >
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            <div className="bg-[#0c0c0c] border border-white/[0.08] rounded-2xl w-full max-w-md p-8 relative animate-slide-up">

                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <h3 className="text-2xl font-black text-white font-outfit tracking-[-0.03em]">Send SOL</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all duration-150"
                        aria-label="Close"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSend} className="space-y-5">

                    {/* Recipient */}
                    <div className="space-y-2">
                        <label className="block text-white/40 text-[11px] font-semibold uppercase tracking-widest">
                            Recipient
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Solana wallet address"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-white/[0.16] focus:bg-white/[0.05] transition-all duration-150 text-sm"
                        />
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="block text-white/40 text-[11px] font-semibold uppercase tracking-widest">
                                Amount
                            </label>
                            <button
                                type="button"
                                onClick={handleMax}
                                className="text-white/30 hover:text-white/60 text-[11px] font-medium tracking-wide transition-colors duration-150"
                            >
                                Max · {wallet.balance?.toFixed(4)} SOL
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                step="any"
                                required
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-white/[0.16] focus:bg-white/[0.05] transition-all duration-150 font-outfit text-2xl font-black pr-16 tabular-nums tracking-[-0.02em]"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 font-semibold text-xs uppercase tracking-widest">
                                SOL
                            </span>
                        </div>
                    </div>

                    {/* Status */}
                    {status && (
                        <div className={`text-sm font-medium animate-enter ${status.type === "success" ? "text-green-400" : "text-red-400"}`}>
                            {status.message}
                        </div>
                    )}

                    {/* Submit */}
                    <div className="pt-1 space-y-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-bold text-sm tracking-[-0.01em] py-4 rounded-xl hover:bg-white/90 transition-all duration-150 disabled:opacity-40 active:scale-[0.98]"
                        >
                            {loading ? "Sending…" : "Confirm & Send"}
                        </button>

                        <p className="text-center text-[10px] text-white/20 font-medium tabular-nums">
                            ~0.000005 SOL network fee
                        </p>
                    </div>
                </form>
            </div>
        </div>,
    document.body
    );
}
