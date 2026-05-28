import { WordCount } from "../lib/bip39";
import { cn } from "../lib/utils";

interface Props {
  value: WordCount;
  onChange: (value: WordCount) => void;
}

export function WordCountSelector({ value, onChange }: Props) {
  const counts: WordCount[] = [12, 15, 18, 21, 24];
  
  return (
    <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200 shadow-sm">
      {counts.map(count => (
        <button
          key={count}
          onClick={() => onChange(count)}
          className={cn(
            "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
            value === count 
              ? "bg-white shadow-sm text-slate-800 border.border-transparent" 
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
          )}
        >
          {count} Words
        </button>
      ))}
    </div>
  );
}
