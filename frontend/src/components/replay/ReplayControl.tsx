import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Clock } from 'lucide-react';
import { useTerminalStore } from '../../state/terminalState';
import { theme } from '../../theme';

export const ReplayControl: React.FC = () => {
  const { replayMode, setReplayMode, setReplaySpeed, stepReplayTime } = useTerminalStore();

  return (
    <div className={`border rounded p-4 h-full flex flex-col justify-between shadow-2xl transition-all duration-700 ${
      replayMode.isActive ? 'bg-amber-950/10 border-amber-500/30' : 'bg-slate-950 border-slate-900'
    }`}>
      <div className="flex justify-between items-center mb-4">
         <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${replayMode.isActive ? 'bg-amber-500 animate-pulse' : 'bg-slate-700'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
               {replayMode.isActive ? 'Mode: Historical_Replay' : 'Mode: Live_Stream'}
            </span>
         </div>
         <div className="flex items-center gap-2 bg-black px-3 py-1 rounded border border-slate-800">
            <Clock size={12} className="text-indigo-400" />
            <span className="text-[11px] font-mono font-bold text-slate-200">
               {replayMode.currentTime || 'REAL_TIME'}
            </span>
         </div>
      </div>

      <div className="flex-1 flex items-center justify-center gap-6">
         <button onClick={() => stepReplayTime(-60_000)} className="text-slate-500 hover:text-white transition-colors" aria-label="Step replay back one minute"><SkipBack size={20} /></button>
         <button
            onClick={() => setReplayMode(!replayMode.isActive)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
               replayMode.isActive ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-slate-800 text-slate-300'
            }`}
         >
            {replayMode.isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
         </button>
         <button onClick={() => stepReplayTime(60_000)} className="text-slate-500 hover:text-white transition-colors" aria-label="Step replay forward one minute"><SkipForward size={20} /></button>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-900 flex justify-between items-center">
         <div className="flex gap-1">
            {[0.5, 1, 2, 5, 10].map(s => (
               <button
                  key={s}
                  onClick={() => setReplaySpeed(s)}
                  className={`px-2 py-0.5 rounded text-[9px] font-black border transition-all ${
                     replayMode.speed === s ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
               >
                  {s}x
               </button>
            ))}
         </div>
         <button onClick={() => setReplayMode(false, null)} className="text-[9px] font-black uppercase text-indigo-400 hover:underline">Exit_to_Live</button>
      </div>
    </div>
  );
};
