import { useState } from "react";

export function MnemonicSection({ mnemonic }: { mnemonic: string }) {
    const [isVisible, setIsVisible] = useState(false);

    if (!mnemonic) return null;

    const words = mnemonic.split(" ");

    return (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 sm:p-5 mb-6 animate-enter">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <h3 className="text-sm font-bold text-white tracking-[-0.01em] font-outfit">Recovery Phrase (12 Words)</h3>
                </div>
                <button
                    onClick={() => setIsVisible(!isVisible)}
                    className="px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-semibold text-white/60 hover:text-white transition-all duration-150 border border-white/[0.06] active:scale-[0.97]"
                >
                    {isVisible ? "Hide Phrase" : "Reveal Phrase"}
                </button>
            </div>

            {/* Word Grid */}
            <div className="relative">
                <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 transition-all duration-300 ${isVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-md select-none pointer-events-none'}`}
                     style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                    {words.map((word, i) => (
                        <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-2.5 py-1.5 flex items-center gap-2 hover:bg-white/[0.05] transition-colors">
                            <span className="text-white/25 text-[10px] font-semibold tabular-nums w-3.5 text-right">
                                {i + 1}
                            </span>
                            <span className="text-white/90 text-xs font-mono font-medium">{word}</span>
                        </div>
                    ))}
                </div>

                {/* Inline reveal prompt */}
                {!isVisible && (
                    <button
                        onClick={() => setIsVisible(true)}
                        className="absolute inset-0 w-full flex flex-col items-center justify-center gap-1 rounded-lg bg-white/[0.02] border border-dashed border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.14] transition-all duration-200"
                    >
                        <p className="text-white/60 font-medium text-xs hover:text-white transition-colors duration-150">
                            Click to reveal 12-word phrase
                        </p>
                        <p className="text-white/30 text-[10px]">
                            Ensure no cameras or onlookers are watching
                        </p>
                    </button>
                )}
            </div>

            {/* Warning */}
            <div className="mt-3.5 pt-3.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-white/40">
                <p>Never share this phrase. It grants full, irreversible access to all derived keys.</p>
            </div>
        </div>
    );
}
