import { useState } from "react";

interface WalletProps {
    address: string;
    balance?: number;
    usdcBalance?: number;
    type: "Solana" | "Ethereum";
    index: number;
    onSend?: () => void;
    onDelete?: () => void;
}

export function WalletCard({ address, balance, usdcBalance, type, index, onSend, onDelete }: WalletProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isSolana = type === "Solana";
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-6)}`;
    
    return (
        <div
            className="group relative bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-[32px] p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/40 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            {/* Header row */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isSolana ? 'bg-purple-400' : 'bg-blue-400'}`} />
                    <span className="text-[10px] uppercase font-black tracking-[0.25em] text-white/30">
                        {type} · {index + 1}
                    </span>
                </div>

                {/* Copy address button — text only */}
                <button
                    onClick={copyToClipboard}
                    className="text-[11px] font-bold uppercase tracking-widest transition-colors"
                    style={{ color: copied ? 'rgb(74 222 128)' : 'rgba(255,255,255,0.2)' }}
                >
                    {copied ? "Copied" : shortAddress}
                </button>
            </div>

            {/* Balance */}
            <div className="mb-6">
                <p className="text-white/20 text-[10px] uppercase tracking-[0.25em] font-bold mb-2">Balance</p>
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-white leading-none font-outfit">
                        {balance?.toLocaleString(undefined, { maximumFractionDigits: 4 }) || "0.0000"}
                    </span>
                    <span className="text-sm font-bold text-white/30 mb-1">
                        {isSolana ? "SOL" : "ETH"}
                    </span>
                </div>
            </div>

            {/* USDC row */}
            {isSolana && (
                <div className="flex justify-between items-center mb-8 pt-5 border-t border-white/[0.06]">
                    <span className="text-white/25 text-[10px] uppercase tracking-[0.25em] font-bold">USDC</span>
                    <span className="text-base font-black text-white/60 font-outfit">
                        ${usdcBalance?.toFixed(2) || "0.00"}
                    </span>
                </div>
            )}

            {!isSolana && <div className="mb-8 pt-5 border-t border-white/[0.06]" />}

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={onSend}
                    disabled={!isSolana}
                    className={`flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 ${
                        isSolana
                            ? 'bg-white text-black hover:bg-gray-100'
                            : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                    }`}
                >
                    Send
                </button>
                <button
                    disabled
                    className="flex-1 py-3.5 rounded-2xl bg-white/5 text-white/25 font-black text-xs uppercase tracking-[0.2em] border border-white/5 cursor-not-allowed"
                >
                    Swap
                </button>
                <button
                    onClick={onDelete}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-500/10 text-red-400/40 hover:text-red-400 hover:bg-red-500/20 border border-red-500/10 transition-all active:scale-95 group/del"
                    title="Remove Account"
                >
                    <span className="text-lg leading-none mt-[-2px] group-hover/del:scale-110 transition-transform">×</span>
                </button>
            </div>
        </div>
    );
}