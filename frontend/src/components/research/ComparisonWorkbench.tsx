import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CinematicPanel } from '../layout/CinematicPanel';
import { theme } from '../../theme';
import { Columns, History, Target, ArrowRight } from 'lucide-react';

export const ComparisonWorkbench: React.FC = () => {
  const [activeWindows, setActiveWindows] = useState([
    { id: 'win_1', title: 'LIVE_STATE', type: 'live' },
    { id: 'win_2', title: 'HISTORICAL_ANALOG_A', type: 'replay', timestamp: '2024-03-12 14:22' }
  ]);

  return (
    <div className="h-full flex flex-col p-1 gap-1">
      <div className="h-10 bg-slate-900/50 border border-slate-800 rounded flex justify-between items-center px-4">
         <div className="flex items-center gap-2">
            <Columns size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Comparison_Workbench</span>
         </div>
         <div className="flex gap-2">
            <button className="bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded shadow-lg">New_Analog_Window</button>
            <button className="bg-slate-800 text-slate-400 text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded border border-slate-700">Sync_Replay_Clocks</button>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-1 overflow-hidden">
        {activeWindows.map(win => (
          <div key={win.id} className="flex flex-col gap-1 overflow-hidden">
            <CinematicPanel
              title={win.title}
              statusColor={win.type === 'live' ? theme.colors.semantic.success : theme.colors.semantic.warning}
            >
               <div className="p-4 space-y-6">
                  {win.type === 'replay' && (
                    <div className="bg-amber-500/10 border border-amber-500/30 p-2 rounded flex justify-between items-center mb-4">
                       <span className="text-[9px] font-black text-amber-500 uppercase">Analog_Context</span>
                       <span className="text-[10px] font-mono font-bold text-amber-200">{win.timestamp}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                     <span className="text-slate-500 font-black uppercase text-[8px] tracking-widest">Structural_Fingerprint</span>
                     <div className="grid grid-cols-4 gap-2 h-20">
                        {[0.8, 0.4, 0.9, 0.2, 0.5, 0.7, 0.3, 0.6].map((v, i) => (
                           <div key={i} className="flex flex-col justify-end gap-1">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${v * 100}%` }}
                                className="bg-indigo-500/40 border-t border-indigo-400"
                              />
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-900">
                     <span className="text-slate-500 font-black uppercase text-[8px] tracking-widest">Active_Regime_Topology</span>
                     <div className="p-4 bg-black border border-slate-900 rounded relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-white font-bold text-[11px] italic">Volatile_Structural_Expansion</span>
                        <div className="mt-2 text-slate-400 text-[10px] leading-relaxed">
                           "Confidence in current regime is decaying while cross-domain synchronization remains elevated."
                        </div>
                     </div>
                  </div>
               </div>
            </CinematicPanel>

            <div className="h-1/3">
               <CinematicPanel title={`${win.title}_Microstructure_Metrics`}>
                  <div className="p-4 grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <span className="text-slate-500 font-black text-[8px] uppercase">Z-Score_imb</span>
                        <span className="text-xl font-mono font-bold text-indigo-400">2.41</span>
                     </div>
                     <div className="space-y-1">
                        <span className="text-slate-500 font-black text-[8px] uppercase">Roll_Vol</span>
                        <span className="text-xl font-mono font-bold text-amber-400">14.2%</span>
                     </div>
                  </div>
               </CinematicPanel>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Summary Bar */}
      <div className="h-14 bg-indigo-950/20 border border-indigo-500/20 rounded flex items-center justify-between px-6">
         <div className="flex items-center gap-4">
            <Target size={20} className="text-indigo-400" />
            <div>
               <span className="text-[9px] font-black uppercase text-indigo-300 block mb-0.5">Similarity_Discovery</span>
               <span className="text-white font-bold text-xs">Structural Correlation: 0.92 (HIGH)</span>
            </div>
         </div>
         <div className="flex items-center gap-6">
            <div className="text-right">
               <span className="text-[9px] font-black uppercase text-slate-500 block mb-0.5">Recurrence_Prob</span>
               <span className="text-green-400 font-black font-mono">82%</span>
            </div>
            <button className="bg-white text-black px-6 py-2 rounded-sm font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-xl">Synthesize_Forensic_Report</button>
         </div>
      </div>
    </div>
  );
};
