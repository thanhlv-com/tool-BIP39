import { ShieldAlert, Github, Wallet, Database } from "lucide-react";
import { cn } from "./lib/utils";
import { GeneratorTab } from "./components/GeneratorTab";
import { VaultTab } from "./components/VaultTab";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";

export default function App() {

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans pb-16">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-8 shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold shadow-sm">
            B
          </div>
          <h1 className="font-bold tracking-tight text-slate-900 text-lg">
            BIP39 Vault
          </h1>
        </div>
        <div className="flex items-center gap-4 sm:gap-6 text-sm font-medium text-slate-500">
          <div className="hidden sm:flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="font-semibold text-xs">Offline Ready</span>
          </div>
          <a
            href="https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 transition-colors flex items-center gap-1.5"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">Open Source</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl w-full mx-auto px-4 pt-8">
        {/* Important Disclaimer */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm">
          <div className="hidden sm:flex mt-0.5 w-8 h-8 rounded-full bg-blue-100 items-center justify-center flex-none">
            <ShieldAlert className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-sm">
            <h3 className="text-blue-900 font-bold mb-1">100% Offline & Secure Environment</h3>
            <p className="text-blue-700 text-xs leading-relaxed font-medium">
              This app operates entirely strictly on your browser (Client-side). No data is sent to the internet. Seed phrases are processed securely and stored via AES encryption on your local device.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-lg w-fit mx-auto sm:mx-0 mb-8 shadow-sm">
          <NavLink
            to="/generate"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-md transition-all",
                isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              )
            }
          >
            <Wallet className="w-4 h-4" />
            Generate Phrase
          </NavLink>
          
          <NavLink
            to="/vault"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-md transition-all",
                isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              )
            }
          >
            <Database className="w-4 h-4" />
            Local Vault
          </NavLink>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          <Routes>
            <Route path="/generate" element={<GeneratorTab />} />
            <Route path="/vault" element={<VaultTab />} />
            <Route path="/" element={<Navigate to="/generate" replace />} />
            <Route path="*" element={<Navigate to="/generate" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}