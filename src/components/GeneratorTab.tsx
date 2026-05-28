import { useState, useEffect } from "react";
import { Copy, Download, RefreshCw, Eye, EyeOff, Save, Check } from "lucide-react";
import { generateBip39, WordCount } from "../lib/bip39";
import { cn } from "../lib/utils";
import { WordCountSelector } from "./WordCountSelector";
import { VaultSaveModal } from "./VaultSaveModal";

export function GeneratorTab() {
  const [wordCount, setWordCount] = useState<WordCount>(12);
  const [phrase, setPhrase] = useState<string[]>([]);
  const [isRevealed, setIsRevealed] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const generate = (count: WordCount) => {
    setPhrase(generateBip39(count));
    setIsRevealed(true);
    setCopied(false);
  };

  useEffect(() => {
    generate(wordCount);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(phrase.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const timestamp = new Date().toISOString().split("T")[0];
    const file = new Blob([phrase.join(" ")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `bip39-backup-${timestamp}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Passphrase Generator</h2>
          <p className="text-slate-500 text-sm mt-1">Generate a secure recovery phrase following the BIP39 standard.</p>
        </div>
        <WordCountSelector value={wordCount} onChange={(v) => {
          setWordCount(v);
          generate(v);
        }} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-6 flex flex-col mb-8">
        <div className="relative group mb-6">
          {!isRevealed && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 transition-all cursor-pointer shadow-sm" onClick={() => setIsRevealed(true)}>
              <Eye className="w-8 h-8 text-slate-400 mb-3" />
              <p className="text-slate-700 font-bold tracking-wide">Click to reveal Seed Phrase</p>
              <p className="text-slate-500 text-sm mt-1 font-medium">Make sure no one is watching</p>
            </div>
          )}

          <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 transition-all duration-300", !isRevealed && "blur-sm opacity-50 select-none")}>
            {phrase.map((word, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3 shadow-sm">
                <span className="text-xs font-mono text-slate-400 w-5 text-right flex-none">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="font-semibold text-slate-700 px-1 truncate">
                  {word}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
          <button
            onClick={() => generate(wordCount)}
            className="flex-1 flex justify-center items-center gap-2 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200/50 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Generate New Phrase
          </button>
          
          <div className="flex gap-4 flex-1">
            <button
              onClick={handleCopy}
              disabled={!isRevealed}
              className="flex-1 flex justify-center items-center gap-2 py-3 border border-slate-200 font-bold text-slate-700 bg-white rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={handleDownload}
              disabled={!isRevealed}
              className="px-4 flex justify-center items-center gap-2 py-3 border border-slate-200 font-bold text-slate-700 bg-white rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              title="Save TXT"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!isRevealed}
              className="flex-1 flex justify-center items-center gap-2 py-3 bg-slate-900 border border-slate-900 font-bold text-white rounded-xl hover:bg-slate-800 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm"
            >
              <Save className="w-4 h-4" />
              Save to Vault
            </button>
          </div>
        </div>
        <div className={cn("text-center transition-opacity duration-300 mt-4", isRevealed ? "opacity-100" : "opacity-0 invisible")}>
          <button onClick={() => setIsRevealed(false)} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm transition-colors font-bold">
            <EyeOff className="w-4 h-4" /> Hide Phrase
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl shadow-sm">
          <div className="font-bold text-blue-900 mb-1 text-sm">High Entropy</div>
          <p className="text-blue-700 text-xs leading-relaxed font-medium">Uses ethers.randomBytes() to ensure maximum cryptographic randomness for your recovery phase.</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-5 rounded-xl shadow-sm">
          <div className="font-bold text-amber-900 mb-1 text-sm">Security Notice</div>
          <p className="text-amber-700 text-xs leading-relaxed font-medium">Never share this phrase with anyone. It gives complete access to your assets. This data is never sent to a server.</p>
        </div>
      </div>
      {isModalOpen && (
        <VaultSaveModal 
          phrase={phrase} 
          wordCount={wordCount}
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}
