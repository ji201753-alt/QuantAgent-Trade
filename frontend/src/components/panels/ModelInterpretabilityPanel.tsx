import React from 'react';
import { motion } from 'framer-motion';
import { CinematicPanel } from '../layout/CinematicPanel';
import { Target, Zap, AlertTriangle, TrendingDown } from 'lucide-react';
import { useTerminalStore } from '../../state/terminalState';

const ConfidenceGradient: React.FC<{ label: string; confidence: number | null }> = ({ label, confidence }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-[9px] font-black uppercase">
       <span className="text-slate-500">{label}</span>
       <span className={confidence === null ? 'text-amber-400' : 'text-indigo-400'}>{confidence === null ? 'UNVERIFIED' : `${(confidence * 100).toFixed(0)}%`}</span>
    </div>
    <div className="h-1.5 bg-slate-800 rounded-full relative overflow-hidden">
       <motion.div
         initial={{ width: 0 }}
         animate={{ width: `${(confidence || 0) * 100}%` }}
         className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400"
       />
    </div>
  </div>
);

export const ModelInterpretabilityPanel: React.FC = () => {
  const { marketStructure } = useTerminalStore();
  const latestForecast = marketStructure.forecasts.active[0];
  const forecastConfidence = latestForecast ? Math.max(0, Math.min(1, 1 - Number(latestForecast.uncertainty_score || 0))) : null;
  const kronosAnalog = marketStructure.kronos.activeAnalogs[0];
  const kronosConfidence = kronosAnalog ? Number(kronosAnalog.similarity_score || 0) : null;

  return (
    <CinematicPanel title="Intelligence_Interpretability">
      <div className="p-4 space-y-6">
         <section>
            <div className="flex items-center gap-2 mb-3">
               <Zap size={14} className="text-amber-500" />
               <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic">TimesFM_Calibration</h3>
            </div>
            <div className="space-y-4">
               <ConfidenceGradient label="Projection_Confidence" confidence={forecastConfidence} />
               <div className="bg-amber-950/10 border border-amber-500/20 p-2 rounded flex gap-3 items-center">
                  <AlertTriangle size={12} className="text-amber-500 shrink-0" />
                  <p className="text-[8px] text-amber-200/70 font-medium">TimesFM state: {marketStructure.forecasts.status}{marketStructure.forecasts.error ? ` · ${marketStructure.forecasts.error}` : ''}</p>
               </div>
            </div>
         </section>

         <section className="pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 mb-3">
               <Target size={14} className="text-indigo-400" />
               <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic">Kronos_Structural_Alignment</h3>
            </div>
            <div className="space-y-3">
               <div className="flex justify-between items-baseline text-[10px]">
                  <span className="text-slate-500 font-bold uppercase">Analog_Match:</span>
                  <span className="text-white font-mono font-black">{kronosAnalog ? `${kronosConfidence?.toFixed(2)} [${kronosAnalog.analog_id}]` : marketStructure.kronos.status}</span>
               </div>
               <div className="flex justify-between items-baseline text-[10px]">
                  <span className="text-slate-500 font-bold uppercase">Recurrence_Prob:</span>
                  <span className="text-green-400 font-mono font-black">{kronosAnalog ? `${(Number(kronosAnalog.recurrence_probability || 0) * 100).toFixed(0)}%` : 'UNVERIFIED'}</span>
               </div>
            </div>
         </section>

         <section className="pt-4 border-t border-white/5">
            <div className="flex justify-between items-center mb-3">
               <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Runtime_Model_Drift</span>
               <TrendingDown size={12} className="text-red-500 opacity-30" />
            </div>
            <div className="text-[9px] text-slate-500 uppercase">No historical model-drift telemetry connected yet.</div>
         </section>
      </div>
    </CinematicPanel>
  );
};
