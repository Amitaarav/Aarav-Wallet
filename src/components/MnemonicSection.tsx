import { useState } from "react";

export function MnemonicSection({ mnemonic }: { mnemonic: string }) {
    const [isVisible, setIsVisible] = useState(false);

    if (!mnemonic) return null;

    const words = mnemonic.split(" ");

    return (
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[32px] p-8 mb-12 shadow-2xl animate-fade-in">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/20 font-medium font-outfit mb-1">Wallet</p>
                    <h3 className="text-2xl font-bold text-white tracking-tight">Recovery Phrase</h3>
                </div>
                <button
                    onClick={() => setIsVisible(!isVisible)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold text-white transition-all border border-white/5 active:scale-95"
                >
                    {isVisible ? "Hide" : "Reveal"}
                </button>
            </div>

            {/* Word Grid */}
            <div className="relative">
                <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 transition-all duration-500 ${isVisible ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-lg scale-[0.98] select-none pointer-events-none'}`}>
                    {words.map((word, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-3 hover:bg-white/[0.08] transition-colors group">
                            <span className="text-white/20 text-xs font-mono font-bold group-hover:text-white/40 transition-colors">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="text-white font-medium">{word}</span>
                        </div>
                    ))}
                </div>

                {/* Inline reveal prompt — replaces the clunky overlay */}
                {!isVisible && (
                    <button
                        onClick={() => setIsVisible(true)}
                        className="absolute inset-0 w-full flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 hover:bg-white/[0.04] hover:border-white/20 transition-all group"
                    >
                        <p className="text-white/60 font-semibold text-sm tracking-wide group-hover:text-white/80 transition-colors">
                            Click to reveal your phrase
                        </p>
                        <p className="text-white/20 text-xs">
                            Make sure no one is watching
                        </p>
                    </button>
                )}
            </div>

            {/* Warning — stripped down, text-only */}
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
                <p className="text-orange-400/80 text-xs font-semibold uppercase tracking-widest mb-1">Keep this private</p>
                <p className="text-white/30 text-xs leading-relaxed">
                    Anyone with these 12 words controls your wallet. Never share them, screenshot them, or store them online.
                </p>
            </div>
        </div>
    );
}