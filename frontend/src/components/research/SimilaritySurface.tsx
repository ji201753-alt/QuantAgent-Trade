import React from 'react';
import { motion } from 'framer-motion';
import { CinematicPanel } from '../layout/CinematicPanel';
import { theme } from '../../theme';
import { Share2, Search, Target } from 'lucide-react';

export const SimilaritySurface: React.FC = () => {
  return (
    <CinematicPanel
      title="Structural Similarity Surface"
      helpTitle="Recurrence Discovery"
      helpExplanation="Visualizes current market structure against high-confidence historical analogs. Heat intensities represent structural agreement across multi-factor embeddings."
    >
      <div className="w-full h-full bg-[#020202] relative overflow-hidden flex items-center justify-center p-8">
         <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] [background-size:30px_30px]" />

         <div className="relative w-full max-w-md h-full flex flex-col justify-center">
            <div className="space-y-4">
               {[
                 { id: 'ANALOG_842', sim: 0.92, label: 'VOL_EXPANSION_A', color: theme.colors.semantic.instability },
                 { id: 'ANALOG_121', sim: 0.85, label: 'LIQ_TRANSITION_B', color: theme.colors.semantic.confidence },
                 { id: 'ANALOG_440', sim: 0.78, label: 'PRESSURE_DRIFT_C', color: theme.colors.semantic.pressure }
               ].map((analog, i) => (
                 <motion.div
                   key={analog.id}
                   initial={{ opacity: 0, x: -50 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="bg-slate-900/40 border border-slate-800 p-3 rounded-sm flex justify-between items-center group hover:border-indigo-500/30 transition-all cursor-pointer"
                 >
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center bg-black/40">
                          <Share2 size={14} className="text-slate-500" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-100 uppercase tracking-widest">{analog.id}</span>
                          <span className="text-[8px] text-slate-500 font-bold italic uppercase">{analog.label}</span>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className="text-[10px] font-mono font-black" style={{ color: analog.color }}>{(analog.sim * 100).toFixed(0)}%</span>
                       <div className="w-20 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${analog.sim * 100}%` }}
                            className="h-full"
                            style={{ backgroundColor: analog.color }}
                          />
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between opacity-30">
               <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Cognitive_Search_Active</span>
               <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse delay-75" />
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse delay-150" />
               </div>
            </div>
         </div>
      </div>
    </CinematicPanel>
  );
};
