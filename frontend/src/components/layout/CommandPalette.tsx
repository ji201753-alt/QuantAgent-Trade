import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Shield, Target, Zap, Activity } from 'lucide-react';
import { useTerminalStore } from '../../state/terminalState';
import { theme } from '../../theme';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPalette, setWorkspace, toggleOverlay } = useTerminalStore();
  const [input, setInput] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPalette(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape') setCommandPalette(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const actions = [
    { icon: Shield, label: 'Jump to Active Investigation', cmd: 'GOTO_INV', run: () => setWorkspace('replay') },
    { icon: Target, label: 'Compare Historical Analogs', cmd: 'ANALOG_COMP', run: () => setWorkspace('recurrence') },
    { icon: Zap, label: 'Analyze Volatility Precursors', cmd: 'VOL_FORENSICS', run: () => setWorkspace('diagnostics') },
    { icon: Activity, label: 'Open Market Structure Workspace', cmd: 'GOTO_STRUCTURE', run: () => setWorkspace('market-structure') },
    { icon: Activity, label: 'Toggle Forecast Overlay', cmd: 'TOGGLE_FORECAST', run: () => toggleOverlay('forecast') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-32 p-4"
      onClick={() => setCommandPalette(false)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-lg shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-black/20">
           <Search size={18} className="text-slate-500" />
           <input
             autoFocus
             value={input}
             onChange={(e) => setInput(e.target.value)}
             placeholder="Search investigations, analogs, or overlays (⌘K)"
             className="w-full bg-transparent border-none focus:outline-none text-[13px] text-slate-100 placeholder:text-slate-600 font-medium"
           />
        </div>

        <div className="p-2 max-h-[300px] overflow-y-auto">
           <div className="px-3 py-2 text-[9px] font-black uppercase text-slate-500 tracking-widest">Contextual_Actions</div>
           {actions.map((a, i) => (
             <button
               key={i}
               onClick={() => { a.run(); setCommandPalette(false); }}
               className="w-full flex items-center gap-3 px-3 py-2.5 rounded hover:bg-indigo-600/10 group transition-all text-left"
             >
                <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-colors">
                   <a.icon size={14} />
                </div>
                <span className="text-[11px] font-bold text-slate-300 group-hover:text-white transition-colors">{a.label}</span>
                <span className="ml-auto text-[9px] font-mono text-slate-600 font-black">{a.cmd}</span>
             </button>
           ))}
        </div>

        <div className="p-3 bg-black/40 border-t border-white/5 flex items-center gap-6 justify-center opacity-40">
           <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Intelligence_OS_Ready</span></div>
           <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Core_Synchronized</span></div>
        </div>
      </motion.div>
    </motion.div>
  );
};
