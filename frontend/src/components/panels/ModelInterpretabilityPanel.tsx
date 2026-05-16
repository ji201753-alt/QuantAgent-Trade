import React from 'react';
import { motion } from 'framer-motion';
import { CinematicPanel } from '../layout/CinematicPanel';
import { theme } from '../../theme';
import { Target, Zap, AlertTriangle, TrendingDown } from 'lucide-react';

const ConfidenceGradient: React.FC<{ label: string; confidence: number }> = ({ label, confidence }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-[9px] font-black uppercase">
       <span className="text-slate-500">{label}</span>
       <span className="text-indigo-400">{(confidence * 100).toFixed(0)}%</span>
    </div>
    <div className="h-1.5 bg-slate-800 rounded-full relative overflow-hidden">
       <motion.div
         initial={{ width: 0 }}
         animate={{ width: `${confidence * 100}%` }}
         className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400"
       />
    </div>
  </div>
);

export const ModelInterpretabilityPanel: React.FC = () => {
  return (
    <CinematicPanel title="Intelligence_Interpretability">
      <div className="p-4 space-y-6">
         {/* TimesFM Forecasting Confidence */}
         <section>
            <div className="flex items-center gap-2 mb-3">
               <Zap size={14} className="text-amber-500" />
               <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic">TimesFM_Calibration</h3>
            </div>
            <div className="space-y-4">
               <ConfidenceGradient label="Projection_Confidence" confidence={0.82} />
               <div className="bg-amber-950/10 border border-amber-500/20 p-2 rounded flex gap-3 items-center">
                  <AlertTriangle size={12} className="text-amber-500 shrink-0" />
                  <p className="text-[8px] text-amber-200/70 font-medium">Forecast uncertainty expansion detected in T+15m horizon.</p>
               </div>
            </div>
         </section>

         {/* Kronos Structural Alignment */}
         <section className="pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 mb-3">
               <Target size={14} className="text-indigo-400" />
               <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic">Kronos_Structural_Alignment</h3>
            </div>
            <div className="space-y-3">
               <div className="flex justify-between items-baseline text-[10px]">
                  <span className="text-slate-500 font-bold uppercase">Analog_Match:</span>
                  <span className="text-white font-mono font-black">0.92 [K-842]</span>
               </div>
               <div className="flex justify-between items-baseline text-[10px]">
                  <span className="text-slate-500 font-bold uppercase">Recurrence_Prob:</span>
                  <span className="text-green-400 font-mono font-black">84%</span>
               </div>
            </div>
         </section>

         {/* Accuracy Historical */}
         <section className="pt-4 border-t border-white/5">
            <div className="flex justify-between items-center mb-3">
               <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Realtime_Accuracy_Drift</span>
               <TrendingDown size={12} className="text-red-500 opacity-30" />
            </div>
            <div className="h-10 flex items-end gap-1">
               {[0.8, 0.85, 0.72, 0.91, 0.78, 0.65, 0.7].map((v, i) => (
                 <div key={i} className="flex-1 bg-indigo-500/20 border-t border-indigo-500/40" style={{ height: `${v * 100}%` }} />
               ))}
            </div>
         </section>
      </div>
    </CinematicPanel>
  );
};
