import { useState, useEffect } from "react";
import { Lock, Unlock, Trash2, Eye, Copy, RefreshCw, EyeOff } from "lucide-react";
import { VaultItem, loadVault, getHasVault, updateVaultWhole } from "../lib/vault";

export function VaultTab() {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [items, setItems] = useState<VaultItem[]>([]);
  const [error, setError] = useState("");
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const hasVaultOnInit = getHasVault();

  const handleUnlock = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!password) return;
    
    const vaultItems = loadVault(password);
    if (vaultItems === null) {
      setError("Incorrect master password");
      return;
    }
    
    setItems(vaultItems);
    setIsUnlocked(true);
    setError("");
  };

  const lock = () => {
    setIsUnlocked(false);
    setPassword("");
    setItems([]);
    setRevealedIds(new Set());
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this phrase?")) return;
    const newItems = items.filter(t => t.id !== id);
    if (updateVaultWhole(password, newItems)) {
      setItems(newItems);
    }
  };

  const toggleReveal = (id: string) => {
    const next = new Set(revealedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setRevealedIds(next);
  };

  const copyPhrase = (phrase: string[]) => {
    navigator.clipboard.writeText(phrase.join(" "));
  };

  if (!hasVaultOnInit && !isUnlocked) {
    return (
      <div className="text-center py-20 px-4 bg-white rounded-2xl border border-slate-200 border-dashed animate-in fade-in shadow-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <Lock className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-slate-900 font-bold text-lg">No Vault Yet</h3>
        <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto leading-relaxed font-medium">
          The offline encrypted vault will be automatically created when you save your first phrase from the Generator screen.
        </p>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="py-12 animate-in slide-in-from-bottom-4 duration-300">
        <div className="max-w-sm mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
            <Lock className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Unlock Secure Vault</h2>
          <p className="text-slate-500 text-sm mb-6 font-medium">Enter your master password to decrypt data stored locally in your browser.</p>
          
          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              autoFocus
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Master password..."
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium font-mono text-slate-900 placeholder:text-slate-400 shadow-sm"
            />
            {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
            <button
              disabled={!password}
              type="submit"
              className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-bold disabled:opacity-50 shadow-md shadow-indigo-200"
            >
              <Unlock className="w-4 h-4" />
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-bold text-slate-900 text-lg">Local Vault Storage</h2>
            <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-200 text-[10px] uppercase font-bold text-emerald-700 rounded-full">Unlocked</span>
          </div>
          <p className="text-slate-500 text-xs font-medium">Locally stored encrypted data on your device. ({items.length} items)</p>
        </div>
        <button onClick={lock} className="text-slate-600 hover:text-slate-900 text-sm font-bold px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-lg transition-all shadow-sm">
          Lock Vault
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4 bg-white">
      {items.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <RefreshCw className="w-8 h-8 opacity-20 mx-auto mb-3" />
          <p className="font-medium">Vault is empty. Go back to the Generator to save a phrase!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => {
            const isRevealed = revealedIds.has(item.id);
            return (
              <div key={item.id} className="p-4 sm:p-5 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors bg-slate-50/30 group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-slate-800 font-bold text-base leading-tight uppercase tracking-tight">{item.name}</h4>
                    <p className="text-slate-500 text-[10px] mt-1 font-bold uppercase tracking-wider">
                      {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })} • {item.wordCount} WORDS
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleReveal(item.id)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all border border-transparent hover:border-indigo-100 bg-white shadow-sm sm:shadow-none sm:bg-transparent"
                    >
                      {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => {
                        copyPhrase(item.phrase);
                        alert("Copied to clipboard");
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-all border border-transparent hover:border-slate-300 bg-white shadow-sm sm:shadow-none sm:bg-transparent"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all border border-transparent hover:border-red-100 bg-white shadow-sm sm:shadow-none sm:bg-transparent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  {!isRevealed && (
                    <div 
                      className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer bg-white/70 rounded-lg backdrop-blur-sm border border-slate-200 hover:bg-white/90 transition-all shadow-sm"
                      onClick={() => toggleReveal(item.id)}
                    >
                      <p className="text-slate-700 font-bold text-sm flex items-center gap-2">
                        <Lock className="w-4 h-4 text-indigo-500" /> Click to reveal
                      </p>
                    </div>
                  )}
                  <div className={`p-4 bg-white border border-slate-200 rounded-lg font-mono text-sm leading-loose text-slate-600 break-words shadow-sm font-medium ${!isRevealed ? "select-none blur-sm" : ""}`}>
                    {item.phrase.join(" ")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
