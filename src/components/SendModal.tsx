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
            setStatus({ type: "success", message: `Sent! tx: ${signature ? signature.slice(0, 12) : "N/A"}...` });
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
            style={{ isolation: 'isolate' }}
        >
            <div 
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={onClose}
            />
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] w-full max-w-lg p-10 shadow-2xl relative">

                {/* Header */}
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/20 font-medium font-outfit mb-1">Solana</p>
                        <h3 className="text-3xl font-black text-white font-outfit tracking-tight">Send SOL</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/20 hover:text-white/60 transition-colors text-2xl leading-none font-light mt-1"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSend} className="space-y-6">

                    {/* Recipient */}
                    <div className="space-y-2">
                        <label className="block text-white/40 text-xs font-black uppercase tracking-[0.2em]">
                            Recipient
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Solana wallet address"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all font-mono text-sm"
                        />
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="block text-white/40 text-xs font-black uppercase tracking-[0.2em]">
                                Amount
                            </label>
                            <button
                                type="button"
                                onClick={handleMax}
                                className="text-white/30 hover:text-white/60 text-xs font-bold uppercase tracking-widest transition-colors"
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
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-5 text-white placeholder-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all font-outfit text-3xl font-black pr-20"
                            />
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 font-black font-outfit text-sm uppercase tracking-widest">
                                SOL
                            </span>
                        </div>
                    </div>

                    {/* Status */}
                    {status && (
                        <div className={`pt-1 text-sm font-semibold animate-fade-in ${status.type === "success" ? "text-green-400" : "text-red-400"}`}>
                            {status.message}
                        </div>
                    )}

                    {/* Submit */}
                    <div className="pt-2 space-y-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-black text-sm uppercase tracking-[0.3em] py-5 rounded-[20px] hover:bg-gray-100 transition-all disabled:opacity-40 active:scale-[0.98]"
                        >
                            {loading ? "Sending..." : "Confirm & Send"}
                        </button>

                        {/* Divider + fee */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-white/[0.06]" />
                            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest whitespace-nowrap">
                                ~0.000005 SOL fee
                            </p>
                            <div className="flex-1 h-px bg-white/[0.06]" />
                        </div>
                    </div>
                </form>
            </div>
        </div>,
    document.body
    );
}