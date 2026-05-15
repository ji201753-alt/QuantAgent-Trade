import React from 'react';
import { motion } from 'framer-motion';
import { ComparisonWorkbench } from '../research/ComparisonWorkbench';
import { CinematicPanel } from '../layout/CinematicPanel';
import { theme } from '../../theme';
import { Activity, Target, Share2 } from 'lucide-react';

export const AnalogInvestigationWorkspace: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-black">
      <header className="h-12 border-b border-white/5 bg-[#050505] flex items-center px-6 justify-between shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-6 h-6 rounded bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
               <Target size={14} className="text-indigo-400" />
            </div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 italic">Kronos_Forensic_Workbench</h2>
         </div>
         <div className="flex gap-4">
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest bg-black/40 px-3 py-1 rounded border border-white/5">MODE: STRUCTURAL_COMPARISON</span>
         </div>
      </header>

      <div className="flex-1 overflow-hidden p-1">
         <ComparisonWorkbench />
      </div>

      <footer className="h-10 border-t border-white/5 bg-[#050505] flex items-center px-6 justify-between shrink-0 font-mono text-[9px] text-slate-500 uppercase">
         <div className="flex gap-8">
            <span>Analog_Bank: 14,241 Archetypes</span>
            <span className="text-indigo-400 font-bold">Similarity_Search: Active</span>
         </div>
         <div className="flex gap-6 items-center">
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
               <span className="text-slate-600">Factor_Sim:</span>
               <span className="text-white font-bold">0.82 (VBT_ALIGNED)</span>
            </div>
            <button className="bg-indigo-600 text-white px-3 py-1 rounded-sm font-black hover:bg-indigo-500 transition-all">Launch_VBT_Study</button>
            <button className="hover:text-indigo-400 transition-colors">Sync_Traversals</button>
            <button className="hover:text-indigo-400 transition-colors">Export_Forensic_Study</button>
         </div>
      </footer>
    </div>
  );
};
