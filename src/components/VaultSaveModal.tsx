import { useState } from "react";
import { X, Lock, Save, AlertCircle } from "lucide-react";
import { saveToVault, getHasVault, encryptVault } from "../lib/vault";

interface Props {
  phrase: string[];
  wordCount: number;
  onClose: () => void;
}

export function VaultSaveModal({ phrase, wordCount, onClose }: Props) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const hasVault = getHasVault();

  const handleSave = () => {
    if (!name.trim() || !password) {
      setError("Please enter a name and password");
      return;
    }

    const newItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      phrase,
      wordCount,
      createdAt: Date.now(),
    };

    if (!hasVault) {
      // First time saving, create vault
      const data = [newItem];
      localStorage.setItem("bip39_offline_vault_data", encryptVault(data, password));
      onClose();
    } else {
      // Append to existing vault
      const success = saveToVault(password, newItem);
      if (!success) {
        setError("Incorrect master password");
      } else {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col zoom-in-95 animate-in duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            Save to Secure Vault
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white border border-slate-200 p-1 rounded-md shadow-sm transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-5">
          {!hasVault && (
            <div className="flex gap-3 bg-amber-50 border border-amber-100 text-amber-900 p-4 rounded-xl text-sm shadow-sm">
              <AlertCircle className="w-5 h-5 flex-none text-amber-600" />
              <p className="text-xs leading-relaxed font-medium">You don't have a Vault yet. The password entered below will become your <strong>Master Password</strong> to unlock your vault. Keep it safe!</p>
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wide">Label (e.g. Main Metamask Wallet)</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-sm"
              placeholder="Wallet / Asset name"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wide">{hasVault ? "Master Password" : "Create Master Password"}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSave()}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400 font-mono shadow-sm"
              placeholder="Enter password"
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
        </div>
        
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-sm"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-bold text-sm shadow-md shadow-indigo-200/50"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
