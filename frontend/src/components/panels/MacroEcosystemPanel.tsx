import React from 'react';
import { motion } from 'framer-motion';
import { CinematicPanel } from '../layout/CinematicPanel';
import { theme } from '../../theme';
import { Activity, Zap, ShieldAlert, Globe } from 'lucide-react';

const EcosystemNode: React.FC<{ name: string; pressure: number; status: string; color: string }> = ({ name, pressure, status, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-slate-900/40 border border-slate-800 p-4 rounded-sm relative overflow-hidden group cursor-pointer"
  >
    <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: color }} />
    <div className="flex justify-between items-start mb-3">
       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{name}</span>
       <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${color}20`, color }}>{status}</span>
    </div>
    <div className="space-y-1">
       <div className="flex justify-between items-baseline">
          <span className="text-[9px] text-slate-600 font-black uppercase">Systemic_Pressure</span>
          <span className="text-sm font-mono font-bold text-slate-200">{pressure.toFixed(2)}</span>
       </div>
       <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pressure * 100}%` }}
            className="h-full"
            style={{ backgroundColor: color }}
          />
       </div>
    </div>
  </motion.div>
);

export const MacroEcosystemPanel: React.FC = () => {
  return (
    <div className="h-full flex flex-col gap-1 p-1 bg-black">
      <div className="grid grid-cols-4 gap-1 h-32">
        <EcosystemNode name="Polymarket_CLOB" pressure={0.42} status="STABLE" color={theme.colors.semantic.success} />
        <EcosystemNode name="Binance_Spot" pressure={0.78} status="ELEVATED" color={theme.colors.semantic.warning} />
        <EcosystemNode name="CME_Futures" pressure={0.15} status="CALM" color={theme.colors.semantic.info} />
        <EcosystemNode name="DVOL_Index" pressure={0.88} status="CRITICAL" color={theme.colors.semantic.error} />
      </div>

      <div className="flex-1 grid grid-cols-12 gap-1 overflow-hidden">
        <div className="col-span-8">
           <CinematicPanel
             title="Systemic Contagion Propagation Map"
             helpTitle="Ecosystem Contagion"
             helpExplanation="Visualizes how structural instability in one market domain propagates across the broader ecosystem. Arrows indicate information flow and correlation vectors."
           >
              <div className="w-full h-full bg-[#050505] flex items-center justify-center relative overflow-hidden">
                 {/* Visual Propagation Map Placeholder */}
                 <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:20px_20px]" />
                 <div className="relative flex flex-col items-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-64 h-64 border border-indigo-500/20 rounded-full flex items-center justify-center"
                    >
                       <div className="w-32 h-32 border border-indigo-500/40 rounded-full flex items-center justify-center">
                          <Globe size={40} className="text-indigo-400 animate-pulse" />
                       </div>
                    </motion.div>
                    <span className="mt-6 text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Synchronizing_Global_Intelligence</span>
                 </div>

                 {/* Propagation Vectors */}
                 <div className="absolute top-1/4 left-1/4 text-indigo-400/40 animate-pulse">
                    <Zap size={24} />
                    <span className="text-[8px] font-black block mt-1">VOL_FLOW</span>
                 </div>
                 <div className="absolute bottom-1/4 right-1/4 text-amber-400/40 animate-pulse delay-700">
                    <Activity size={24} />
                    <span className="text-[8px] font-black block mt-1">LIQ_MIGRATION</span>
                 </div>
              </div>
           </CinematicPanel>
        </div>

        <div className="col-span-4 flex flex-col gap-1">
           <CinematicPanel title="Liquidity Migration & Flow">
              <div className="p-4 space-y-4">
                 {[
                   { from: 'BINANCE', to: 'POLYMARKET', vol: '1.2M', trend: 'increasing' },
                   { from: 'CME', to: 'BINANCE', vol: '400K', trend: 'stable' }
                 ].map((flow, i) => (
                   <div key={i} className="bg-slate-900/50 p-3 rounded border border-slate-800 group hover:border-indigo-500/30 transition-all">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-slate-500 text-[9px] font-black uppercase">{flow.from}</span>
                         <div className="flex-1 h-px bg-slate-800 mx-3 relative">
                            <motion.div
                               animate={{ left: ['0%', '100%'] }}
                               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                               className="absolute -top-1 w-2 h-2 bg-indigo-500 rounded-full blur-[2px]"
                            />
                         </div>
                         <span className="text-slate-500 text-[9px] font-black uppercase">{flow.to}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono">
                         <span className="text-slate-400">Flow_Vol: {flow.vol}</span>
                         <span className="text-indigo-400 font-bold uppercase italic">{flow.trend}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </CinematicPanel>

           <CinematicPanel title="Systemic Stability Index">
              <div className="p-4 flex flex-col items-center justify-center h-full gap-4">
                 <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                       <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-900" />
                       <motion.circle
                          cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                          strokeDasharray={364}
                          animate={{ strokeDashoffset: 364 * (1 - 0.72) }}
                          className="text-indigo-500"
                       />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                       <span className="text-2xl font-black text-white">0.72</span>
                       <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Stability</span>
                    </div>
                 </div>
                 <div className="text-[10px] text-slate-400 text-center italic px-4">
                    "Ecosystem remains structurally coherent despite localized volatility expansion."
                 </div>
              </div>
           </CinematicPanel>
        </div>
      </div>
    </div>
  );
};
