import { Plus, Minus } from 'lucide-react';
import { useProgressStore } from '../store/progressStore';

export default function ProgressCard({ category }) {
  const { incrementProgress, decrementProgress } = useProgressStore();
  const { id, name, targetHours, completedHours, percentage } = category;

  // Visual state classes
  const isCompleted = percentage === 100;
  const progressBarColor = isCompleted ? 'bg-emerald-500' : 'bg-white';
  const glowOpacity = isCompleted ? 'opacity-10' : 'opacity-0';

  return (
    <div className="relative rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 shadow-sm hover:bg-zinc-900/60 hover:border-zinc-700/80 transition-all duration-300 group overflow-hidden">
      {/* Subtle background glow for completed state */}
      <div className={`absolute inset-0 bg-emerald-500 transition-opacity duration-700 ${glowOpacity}`} />
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className={`font-medium tracking-wide transition-colors ${isCompleted ? 'text-emerald-400' : 'text-zinc-200'}`}>
            {name}
          </h3>
          <span className="text-sm text-zinc-500 font-mono bg-zinc-950/50 px-2.5 py-1 rounded-md border border-zinc-800/50">
            {completedHours} <span className="text-zinc-600">/</span> {targetHours}h
          </span>
        </div>
        
        {/* Linear Progress Bar */}
        <div className="relative w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden mb-6 border border-zinc-800/50 shadow-inner">
          <div 
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out ${progressBarColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between items-end">
          <div>
            <span className={`text-3xl font-semibold transition-colors ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
              {percentage}%
            </span>
          </div>
          
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button 
              onClick={() => decrementProgress(id)}
              disabled={completedHours === 0}
              className="w-9 h-9 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-zinc-700/50 hover:scale-105 active:scale-95"
              title="-30 min"
            >
              <Minus className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button 
              onClick={() => incrementProgress(id)}
              disabled={completedHours >= targetHours}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed border hover:scale-105 active:scale-95 ${
                isCompleted 
                  ? 'bg-zinc-800/80 text-zinc-500 border-zinc-800' 
                  : 'bg-white/10 text-white hover:bg-white hover:text-zinc-900 border-white/20'
              }`}
              title="+30 min"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
