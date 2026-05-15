import React, { useState } from 'react';
import { Search, MessageSquare, Layers, Clock, Bell, Bookmark, Command } from 'lucide-react';
import { useTerminalStore } from '../../state/terminalState';
import { theme } from '../../theme';
import { OverlayManager } from './OverlayManager';

export const CommandHeader: React.FC = () => {
  const { setCommandPalette, replayMode } = useTerminalStore();
  const [isOverlayOpen, setOverlayOpen] = useState(false);

  return (
    <header className="h-12 border-b border-white/5 bg-[#050505] flex items-center px-6 justify-between z-50 shrink-0 shadow-xl">
      <div className="flex items-center gap-6 flex-1">
        <div
          onClick={() => setCommandPalette(true)}
          className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-sm px-4 py-1.5 w-96 group cursor-pointer hover:border-indigo-500/30 transition-all"
        >
          <Search size={14} className="text-slate-600 group-hover:text-indigo-400" />
          <span className="text-[11px] text-slate-500 font-medium">Search_Forensics, Analogs, or Command (⌘K)</span>
        </div>
      </div>

      <div className="flex items-center gap-6 h-full">
         <div className="flex items-center gap-1 h-full relative">
            <button
               onClick={() => setOverlayOpen(!isOverlayOpen)}
               className="h-full px-4 text-slate-500 hover:text-indigo-400 hover:bg-white/5 transition-all relative"
            >
               <Layers size={16} />
               <span className="text-[9px] font-black uppercase absolute bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100">Overlays</span>
            </button>
            <OverlayManager isOpen={isOverlayOpen} onClose={() => setOverlayOpen(false)} />
            <div className="h-4 w-px bg-white/5 mx-1" />
            <button className="h-full px-4 text-slate-500 hover:text-indigo-400 hover:bg-white/5 transition-all">
               <Clock size={16} className={replayMode.isActive ? 'text-amber-500' : ''} />
            </button>
            <button className="h-full px-4 text-slate-500 hover:text-indigo-400 hover:bg-white/5 transition-all">
               <Bell size={16} />
            </button>
            <button className="h-full px-4 text-slate-500 hover:text-indigo-400 hover:bg-white/5 transition-all">
               <Bookmark size={16} />
            </button>
         </div>

         <div className="h-4 w-px bg-white/5" />

         <button className="bg-white text-black px-4 py-1.5 rounded-sm font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl active:scale-95">
            Assistant_Link
         </button>
      </div>
    </header>
  );
};
