import { useState } from "react";
import { generateMnemonic, deriveSolanaWallet, deriveEthereumWallet } from "./app/wallet";
import { getSolBalance, getUSDCBalance } from "./app/solana";
import { MnemonicSection } from "./components/MnemonicSection";
import { WalletCard } from "./components/WalletCard";
import { SendModal } from "./components/SendModal";
import { ToastProvider, useToast } from "./components/Toast";
import { Dialog } from "./components/Dialog";
import pkg from "../package.json";

export default function App() {
  return (
    <ToastProvider>
      <WalletApp />
    </ToastProvider>
  );
}

function WalletApp() {
  const { showToast } = useToast();
  const [mnemonic, setMnemonic] = useState("");
  const [solWallets, setSolWallets] = useState<Array<any>>([]);
  const [ethWallets, setEthWallets] = useState<Array<any>>([]);
  const [activeWallet, setActiveWallet] = useState<any>(null);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEraseDialogOpen, setIsEraseDialogOpen] = useState(false);
  const [deleteContext, setDeleteContext] = useState<{ type: "Solana" | "Ethereum", index: number } | null>(null);

  const initWallet = () => {
    const m = generateMnemonic();
    setMnemonic(m);
    addSolWallet(m, 0);
    addEthWallet(m, 0);
    showToast("New wallet generated!", "success");
  };

  const handleErase = () => {
    setMnemonic("");
    setSolWallets([]);
    setEthWallets([]);
    showToast("Wallet erased successfully", "info");
  };

  const deleteWallet = (type: "Solana" | "Ethereum", index: number) => {
    if (type === "Solana") {
      setSolWallets(prev => prev.filter((_, i) => i !== index));
    } else {
      setEthWallets(prev => prev.filter((_, i) => i !== index));
    }
    showToast(`${type} account removed`, "info");
  };

  const addSolWallet = async (m: string, index: number) => {
    const w = deriveSolanaWallet(m, index);
    const sol = await getSolBalance(w.publicKey);
    const usdc = await getUSDCBalance(w.publicKey);
    setSolWallets(prev => [...prev, { ...w, balance: sol, usdcBalance: usdc }]);
  };

  const addEthWallet = async (m: string, index: number) => {
    const w = deriveEthereumWallet(m, index);
    setEthWallets(prev => [...prev, { ...w, balance: 0 }]);
  };

  const refreshBalances = async () => {
    if (!mnemonic) return;
    setIsRefreshing(true);
    const updatedSol = await Promise.all(solWallets.map(async (w) => {
      const sol = await getSolBalance(w.publicKey);
      const usdc = await getUSDCBalance(w.publicKey);
      return { ...w, balance: sol, usdcBalance: usdc };
    }));
    setSolWallets(updatedSol);
    setIsRefreshing(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-24 animate-fade-in">

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-medium font-outfit mb-2">Multi-chain</p>
          <h1 className="text-5xl font-black tracking-tighter font-outfit text-white">
            Aarav <span className="text-white/20">Wallet</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {mnemonic ? (
            <>
              <button
                onClick={refreshBalances}
                disabled={isRefreshing}
                className="px-5 py-3.5 rounded-2xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95 disabled:opacity-40 text-xs font-black uppercase tracking-widest"
              >
                {isRefreshing ? "Syncing..." : "Refresh"}
              </button>
              <button
                onClick={() => addSolWallet(mnemonic, solWallets.length)}
                className="px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 text-white/60 hover:text-white"
              >
                + Solana
              </button>
              <button
                onClick={() => addEthWallet(mnemonic, ethWallets.length)}
                className="px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 text-white/60 hover:text-white"
              >
                + Ethereum
              </button>
              <button
                onClick={() => setIsEraseDialogOpen(true)}
                className="px-5 py-3.5 text-red-400/60 hover:text-red-400 border border-red-500/10 hover:border-red-500/30 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500/10 transition-all active:scale-95"
              >
                Erase
              </button>
            </>
          ) : (
            <button
              onClick={initWallet}
              className="px-10 py-5 bg-white text-black font-black text-sm uppercase tracking-[0.2em] rounded-3xl hover:bg-gray-100 transition-all shadow-2xl shadow-white/10 active:scale-95"
            >
              Generate Wallet
            </button>
          )}
        </div>
      </header>

      <MnemonicSection mnemonic={mnemonic} />

      {mnemonic && (
        <main className="space-y-24">

          {/* Solana */}
          <section>
            <div className="flex items-center gap-6 mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-medium font-outfit">Network</p>
                <h2 className="text-2xl font-black text-white font-outfit tracking-tight">Solana</h2>
              </div>
              <div className="h-px flex-1 bg-white/600" />
              <span className="text-white/20 font-mono text-xs">{solWallets.length} accounts</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solWallets.map((w, i) => (
                <WalletCard
                  key={i}
                  type="Solana"
                  address={w.publicKey}
                  balance={w.balance}
                  usdcBalance={w.usdcBalance}
                  index={i}
                  onSend={() => { setActiveWallet(w); setIsSendOpen(true); }}
                  onDelete={() => setDeleteContext({ type: "Solana", index: i })}
                />
              ))}
            </div>
          </section>

          {/* Ethereum */}
          <section>
            <div className="flex items-center gap-6 mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-medium font-outfit">Network</p>
                <h2 className="text-2xl font-black text-white font-outfit tracking-tight">Ethereum</h2>
              </div>
              <div className="h-px flex-1 bg-white/600" />
              <span className="text-white/20 font-mono text-xs">{ethWallets.length} accounts</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ethWallets.map((w, i) => (
                <WalletCard
                  key={i}
                  type="Ethereum"
                  address={w.address}
                  balance={w.balance}
                  index={i}
                  onDelete={() => setDeleteContext({ type: "Ethereum", index: i })}
                />
              ))}
            </div>
          </section>

        </main>
      )}

      {activeWallet && (
        <SendModal
          isOpen={isSendOpen}
          onClose={() => setIsSendOpen(false)}
          wallet={activeWallet}
        />
      )}

      {!mnemonic && (
        <div className="mt-20 text-center py-32 relative animate-fade-in">
          <div className="absolute inset-0 rounded-[64px] bg-linear-to-b from-white/300 to-transparent pointer-events-none" />
          <div className="absolute inset-0 rounded-[64px] border border-white/600" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
          <div className="relative z-10 space-y-5">
            <p className="text-xs uppercase tracking-[0.3em] text-white/20 font-medium font-outfit">Getting Started</p>
            <h2 className="text-4xl font-black text-white font-outfit tracking-tight">Your wallet lives here.</h2>
            <p className="text-gray-500 max-w-sm mx-auto text-base leading-relaxed">
              Import or generate a seed phrase to load your accounts. Non-custodial - your keys never leave this device.
            </p>
            <div className="flex items-center justify-center gap-1.5 pt-2">
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="w-1 h-1 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      )}

      <footer className="mt-32 pt-12 border-t border-white/5 text-center flex flex-col items-center gap-4">
        <p className="text-white/20 text-sm font-bold tracking-[0.3em] uppercase">Developed by Amit</p>
        <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-black text-white/20 tracking-widest uppercase">
          v{pkg.version}
        </span>
      </footer>

      {/* Dialogs */}
      <Dialog
        isOpen={isEraseDialogOpen}
        onClose={() => setIsEraseDialogOpen(false)}
        onConfirm={handleErase}
        title="Erase Wallet?"
        description="This will permanently delete your seed phrase and all accounts from this device. Make sure you have backed up your recovery phrase."
        confirmText="Yes, Erase Everything"
      />

      <Dialog
        isOpen={!!deleteContext}
        onClose={() => setDeleteContext(null)}
        onConfirm={() => deleteContext && deleteWallet(deleteContext.type, deleteContext.index)}
        title="Remove Account?"
        description={`This will remove this ${deleteContext?.type} account from your view. You can always re-derive it using the same index.`}
        confirmText="Remove Account"
      />
    </div>
  );
}