import { useState } from "react";
import { generateMnemonic, deriveSolanaWallet, deriveEthereumWallet } from "./app/wallet";
import { getSolBalance, getUSDCBalance } from "./app/solana";
import { MnemonicSection } from "./components/MnemonicSection";
import { WalletCard } from "./components/WalletCard";
import { SendModal } from "./components/SendModal";
import { ReceiveModal } from "./components/ReceiveModal";
import { PrivateKeyModal } from "./components/PrivateKeyModal";
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

  // App State
  const [mnemonic, setMnemonic] = useState("");
  const [solWallets, setSolWallets] = useState<Array<any>>([]);
  const [ethWallets, setEthWallets] = useState<Array<any>>([]);
  const [activeTab, setActiveTab] = useState<"All" | "Solana" | "Ethereum">("All");

  // Modal States
  const [sendWallet, setSendWallet] = useState<any>(null);
  const [receiveWallet, setReceiveWallet] = useState<any>(null);
  const [keyWallet, setKeyWallet] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dialog State
  const [isEraseDialogOpen, setIsEraseDialogOpen] = useState(false);
  const [deleteContext, setDeleteContext] = useState<{
    type: "Solana" | "Ethereum";
    index: number;
  } | null>(null);

  const initWallet = () => {
    const m = generateMnemonic();
    setMnemonic(m);
    addSolWallet(m, 0);
    addEthWallet(m, 0);
    showToast("New multi-chain wallet created", "success");
  };

  const handleErase = () => {
    setMnemonic("");
    setSolWallets([]);
    setEthWallets([]);
    showToast("Wallet erased from device", "info");
  };

  const deleteWallet = (type: "Solana" | "Ethereum", index: number) => {
    if (type === "Solana") {
      setSolWallets((prev) => prev.filter((_, i) => i !== index));
    } else {
      setEthWallets((prev) => prev.filter((_, i) => i !== index));
    }
    showToast(`${type} account removed`, "info");
  };

  const addSolWallet = async (m: string, index: number) => {
    const w = deriveSolanaWallet(m, index);
    const sol = await getSolBalance(w.publicKey);
    const usdc = await getUSDCBalance(w.publicKey);
    setSolWallets((prev) => [...prev, { ...w, balance: sol, usdcBalance: usdc, type: "Solana" }]);
  };

  const addEthWallet = async (m: string, index: number) => {
    const w = deriveEthereumWallet(m, index);
    setEthWallets((prev) => [...prev, { ...w, balance: 0, type: "Ethereum" }]);
  };

  const refreshBalances = async () => {
    if (!mnemonic) return;
    setIsRefreshing(true);
    const updatedSol = await Promise.all(
      solWallets.map(async (w) => {
        const sol = await getSolBalance(w.publicKey);
        const usdc = await getUSDCBalance(w.publicKey);
        return { ...w, balance: sol, usdcBalance: usdc };
      })
    );
    setSolWallets(updatedSol);
    setIsRefreshing(false);
    showToast("Balances updated", "success");
  };

  // Portfolio Totals
  const totalSol = solWallets.reduce((acc, w) => acc + (w.balance || 0), 0);
  const totalUsdc = solWallets.reduce((acc, w) => acc + (w.usdcBalance || 0), 0);
  const totalEth = ethWallets.reduce((acc, w) => acc + (w.balance || 0), 0);
  const totalAccounts = solWallets.length + ethWallets.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-white/[0.06] animate-enter">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center font-outfit font-black text-lg text-white">
            A
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-[-0.03em] font-outfit text-white leading-none">
              Aarav<span className="text-white/40 ml-1.5 font-semibold">Wallet</span>
            </h1>
            <p className="text-[11px] text-white/35 mt-1">Multi-Chain Non-Custodial</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {mnemonic ? (
            <>
              <button
                onClick={refreshBalances}
                disabled={isRefreshing}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-white/60 hover:text-white hover:bg-white/[0.08] transition-all text-xs font-medium flex items-center gap-1.5 active:scale-[0.97] disabled:opacity-40"
              >
                <svg
                  className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span>{isRefreshing ? "Syncing…" : "Refresh"}</span>
              </button>

              <button
                onClick={() => setIsEraseDialogOpen(true)}
                className="px-3 py-1.5 rounded-lg border border-rose-500/15 hover:border-rose-500/30 text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/[0.06] transition-all text-xs font-medium active:scale-[0.97]"
              >
                Lock / Erase
              </button>
            </>
          ) : (
            <button
              onClick={initWallet}
              className="px-6 py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-white/90 transition-all active:scale-[0.97] shadow-sm"
            >
              Generate New Wallet
            </button>
          )}
        </div>
      </header>

      {/* Portfolio Quick Overview Bar */}
      {mnemonic && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4 animate-enter">
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Total Holdings</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-black text-white font-outfit tabular-nums">
                  {totalSol.toFixed(4)} <span className="text-xs text-violet-400 font-bold">SOL</span>
                </span>
                <span className="text-white/20">·</span>
                <span className="text-xl font-black text-white font-outfit tabular-nums">
                  {totalEth.toFixed(4)} <span className="text-xs text-sky-400 font-bold">ETH</span>
                </span>
                {totalUsdc > 0 && (
                  <>
                    <span className="text-white/20">·</span>
                    <span className="text-sm font-bold text-emerald-400 font-outfit tabular-nums">
                      ${totalUsdc.toFixed(2)} USDC
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="h-7 w-px bg-white/[0.06] hidden sm:block" />

            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Accounts</p>
              <p className="text-sm font-semibold text-white/70 mt-0.5 tabular-nums">
                {totalAccounts} active across 2 networks
              </p>
            </div>
          </div>

          {/* Quick Add Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => addSolWallet(mnemonic, solWallets.length)}
              className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-all active:scale-[0.97]"
            >
              + Solana Account
            </button>
            <button
              onClick={() => addEthWallet(mnemonic, ethWallets.length)}
              className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-all active:scale-[0.97]"
            >
              + Ethereum Account
            </button>
          </div>
        </div>
      )}

      {/* Mnemonic Seed Phrase Section */}
      <MnemonicSection mnemonic={mnemonic} />

      {mnemonic && (
        <main className="space-y-6">
          {/* View Filter Tabs */}
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-1.5">
              {(["All", "Solana", "Ethereum"] as const).map((tab) => {
                const count =
                  tab === "All"
                    ? totalAccounts
                    : tab === "Solana"
                    ? solWallets.length
                    : ethWallets.length;
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? "bg-white/10 text-white border border-white/15"
                        : "text-white/40 hover:text-white hover:bg-white/[0.04] border border-transparent"
                    }`}
                  >
                    <span>{tab}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-white/[0.05] text-white/40"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accounts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(activeTab === "All" || activeTab === "Solana") &&
              solWallets.map((w, i) => (
                <WalletCard
                  key={`sol-${i}`}
                  type="Solana"
                  address={w.publicKey}
                  balance={w.balance}
                  usdcBalance={w.usdcBalance}
                  index={i}
                  onSend={() => setSendWallet(w)}
                  onReceive={() => setReceiveWallet({ ...w, type: "Solana", index: i })}
                  onViewPrivateKey={() => setKeyWallet({ ...w, type: "Solana", index: i })}
                  onDelete={() => setDeleteContext({ type: "Solana", index: i })}
                />
              ))}

            {(activeTab === "All" || activeTab === "Ethereum") &&
              ethWallets.map((w, i) => (
                <WalletCard
                  key={`eth-${i}`}
                  type="Ethereum"
                  address={w.address}
                  balance={w.balance}
                  index={i}
                  onReceive={() => setReceiveWallet({ ...w, type: "Ethereum", index: i })}
                  onViewPrivateKey={() => setKeyWallet({ ...w, type: "Ethereum", index: i })}
                  onDelete={() => setDeleteContext({ type: "Ethereum", index: i })}
                />
              ))}
          </div>
        </main>
      )}

      {/* Empty State */}
      {!mnemonic && (
        <div className="mt-12 py-20 text-center animate-enter">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-white/50 text-xl font-black">
            🔒
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit tracking-[-0.03em] mb-2">
            Non-Custodial Multi-Chain Wallet
          </h2>
          <p className="text-white/40 max-w-sm mx-auto text-xs sm:text-sm leading-relaxed mb-6">
            Generate a secure seed phrase to derive Solana and Ethereum accounts locally on your machine.
          </p>
          <button
            onClick={initWallet}
            className="px-6 py-3 bg-white text-black font-semibold text-xs tracking-wide rounded-xl hover:bg-white/90 transition-all active:scale-[0.97]"
          >
            Create Your Wallet Now
          </button>
        </div>
      )}

      {/* Modals */}
      {sendWallet && (
        <SendModal
          isOpen={!!sendWallet}
          onClose={() => setSendWallet(null)}
          wallet={sendWallet}
        />
      )}

      {receiveWallet && (
        <ReceiveModal
          isOpen={!!receiveWallet}
          onClose={() => setReceiveWallet(null)}
          wallet={receiveWallet}
        />
      )}

      {keyWallet && (
        <PrivateKeyModal
          isOpen={!!keyWallet}
          onClose={() => setKeyWallet(null)}
          wallet={keyWallet}
        />
      )}

      {/* Confirmation Dialogs */}
      <Dialog
        isOpen={isEraseDialogOpen}
        onClose={() => setIsEraseDialogOpen(false)}
        onConfirm={handleErase}
        title="Erase wallet data?"
        description="This will clear your mnemonic phrase and all accounts from this browser session. Make sure your recovery phrase is safely saved."
        confirmText="Erase Everything"
      />

      <Dialog
        isOpen={!!deleteContext}
        onClose={() => setDeleteContext(null)}
        onConfirm={() =>
          deleteContext && deleteWallet(deleteContext.type, deleteContext.index)
        }
        title="Remove account?"
        description={`This will remove this ${deleteContext?.type} account from view. You can always re-derive it in order.`}
        confirmText="Remove Account"
      />

      {/* Footer */}
      <footer className="mt-20 pt-6 border-t border-white/[0.06] text-center">
        <p className="text-white/30 text-[11px] font-medium">
          Aarav Wallet · <span className="tabular-nums">v{pkg.version}</span>
        </p>
      </footer>
    </div>
  );
}
