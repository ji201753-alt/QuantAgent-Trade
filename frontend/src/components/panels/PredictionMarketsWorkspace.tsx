import React from 'react';
import { motion } from 'framer-motion';
import { HighFrequencyChart } from '../charts/HighFrequencyChart';
import { OrderbookPanel } from './OrderbookPanel';
import { MicrostructurePanel } from './OrderbookPanel'; // Reuse for now
import { CinematicPanel } from '../layout/CinematicPanel';
import { useTerminalStore } from '../../state/terminalState';
import { theme } from '../../theme';
import { Filter, Users, TrendingUp } from 'lucide-react';

export const PredictionMarketsWorkspace: React.FC = () => {
  const { activeSymbol } = useTerminalStore();

  return (
    <div className="h-full grid grid-cols-12 gap-1 p-1 bg-black">
      {/* Market Sidebar Controls */}
      <div className="col-span-2 flex flex-col gap-1 overflow-hidden">
         <CinematicPanel title="Market_Filters">
            <div className="p-3 space-y-4">
               <div className="space-y-2">
                  <span className="text-[9px] font-black text-slate-600 uppercase">Categories</span>
                  <div className="flex flex-wrap gap-1">
                     {['Politics', 'Crypto', 'Economics', 'Sports'].map(c => (
                       <span key={c} className="px-2 py-0.5 bg-slate-900 border border-white/5 rounded text-[8px] text-slate-400 font-bold">{c}</span>
                     ))}
                  </div>
               </div>
               <div className="pt-2 border-t border-white/5 space-y-2">
                  <span className="text-[9px] font-black text-slate-600 uppercase">Risk_Level</span>
                  <input type="range" className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
               </div>
            </div>
         </CinematicPanel>
         <div className="flex-1 overflow-hidden">
            <CinematicPanel title="Active_Predictions">
               <div className="p-2 space-y-1">
                  {[
                    { id: '1', name: 'US_ELEC_24', val: 0.542, change: '+2%' },
                    { id: '2', name: 'BTC_OCT_100K', val: 0.12, change: '-4%' },
                    { id: '3', name: 'FED_RATE_CUT', val: 0.88, change: '+0.5%' }
                  ].map(m => (
                    <div key={m.id} className="p-2 bg-slate-900/50 border border-transparent hover:border-indigo-500/30 rounded flex justify-between items-center group cursor-pointer transition-all">
                       <span className="text-[10px] font-bold text-slate-300 group-hover:text-white">{m.name}</span>
                       <span className="text-[10px] font-mono font-black text-indigo-400">{m.val}</span>
                    </div>
                  ))}
               </div>
            </CinematicPanel>
         </div>
      </div>

      {/* Central Intelligence Surface */}
      <div className="col-span-7 flex flex-col gap-1 overflow-hidden">
         <div className="flex-[3] overflow-hidden">
            <CinematicPanel title={`Intelligence_Stream: ${activeSymbol} // Source: Polymarket_CLOB`}>
               <HighFrequencyChart />
            </CinematicPanel>
         </div>
         <div className="flex-1 grid grid-cols-2 gap-1 overflow-hidden">
            <OrderbookPanel />
            <CinematicPanel title="Whale_Pressure_Delta">
               <div className="p-4 flex flex-col justify-center items-center h-full">
                  <TrendingUp size={32} className="text-indigo-400 mb-2 opacity-50" />
                  <span className="text-2xl font-black text-white">0.62</span>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">Large_Accumulation_Detected</span>
               </div>
            </CinematicPanel>
         </div>
      </div>

      {/* Right Intelligence Rail */}
      <div className="col-span-3 flex flex-col gap-1 overflow-hidden">
         <CinematicPanel title="Contextual_Reasoning">
            <div className="p-4">
               <div className="bg-slate-900 border-l-2 border-indigo-500 p-3 rounded-r">
                  <p className="text-[11px] text-slate-300 italic leading-relaxed">
                     "Probability movement aligns with structural recurrence pattern K-421. Forecasting indicates localized instability collapse in T-15m."
                  </p>
               </div>
               <div className="mt-4 space-y-4">
                  <div className="flex justify-between items-baseline">
                     <span className="text-[8px] font-black text-slate-600 uppercase">Regime_Confidence</span>
                     <span className="text-xs font-bold text-indigo-400">82%</span>
                  </div>
                  <div className="flex justify-between items-baseline border-t border-white/5 pt-2">
                     <span className="text-[8px] font-black text-slate-600 uppercase">Uncertainty_Index</span>
                     <span className="text-xs font-bold text-amber-500">0.24</span>
                  </div>
               </div>
            </div>
         </CinematicPanel>
         <div className="flex-1 overflow-hidden">
            <CinematicPanel title="Event_Catalysts">
               <div className="p-3 space-y-3">
                  {[
                    { ts: '14:22', title: 'Macro_Release: CPI', impact: 'high' },
                    { ts: '14:05', title: 'Network_Stability', impact: 'low' }
                  ].map((e, i) => (
                    <div key={i} className="flex gap-3">
                       <span className="text-[9px] font-mono text-slate-600">{e.ts}</span>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-300">{e.title}</span>
                          <span className={`text-[8px] font-black uppercase ${e.impact === 'high' ? 'text-red-500' : 'text-slate-500'}`}>{e.impact}_Impact</span>
                       </div>
                    </div>
                  ))}
               </div>
            </CinematicPanel>
         </div>
      </div>
    </div>
  );
};
