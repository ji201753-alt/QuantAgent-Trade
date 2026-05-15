import React from 'react';
import { motion } from 'framer-motion';
import { CinematicPanel } from '../layout/CinematicPanel';
import { theme } from '../../theme';
import { SearchCode, RefreshCw, Zap, TrendingDown, ArrowRightLeft } from 'lucide-react';

const SpreadCard: React.FC<{ region: string; spread: number; confidence: number }> = ({ region, spread, confidence }) => {
  const isHealthy = spread > 0.5 && confidence > 0.7;
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-slate-900/40 border border-slate-800 p-4 rounded flex flex-col justify-between group hover:border-indigo-500/30 transition-all cursor-pointer"
    >
       <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-indigo-400 transition-colors">{region}</span>
          <div className={`w-1.5 h-1.5 rounded-full ${isHealthy ? 'bg-green-500 shadow-glow-green' : 'bg-amber-500 opacity-50'}`} />
       </div>
       <div className="space-y-4">
          <div className="flex justify-between items-baseline">
             <span className="text-2xl font-mono font-black text-white">{spread.toFixed(2)}%</span>
             <span className="text-[8px] font-black text-slate-600 uppercase">Realtime_Spread</span>
          </div>
          <div className="space-y-1">
             <div className="flex justify-between text-[9px] uppercase font-bold">
                <span className="text-slate-500">Execution_Conf</span>
                <span className="text-indigo-400">{(confidence * 100).toFixed(0)}%</span>
             </div>
             <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${confidence * 100}%` }} className="h-full bg-indigo-500" />
             </div>
          </div>
       </div>
    </motion.div>
  );
};

export const ArbitrageMonitorWorkspace: React.FC = () => {
  return (
    <div className="h-full flex flex-col gap-1 p-1 bg-black">
       {/* Spread Matrix Surface */}
       <div className="grid grid-cols-5 gap-1 shrink-0">
          <SpreadCard region="Argentina_ARS" spread={1.42} confidence={0.88} />
          <SpreadCard region="Brazil_BRL" spread={0.68} confidence={0.92} />
          <SpreadCard region="Colombia_COP" spread={2.15} confidence={0.45} />
          <SpreadCard region="Mexico_MXN" spread={0.34} confidence={0.95} />
          <SpreadCard region="Europe_EUR" spread={0.12} confidence={0.98} />
       </div>

       <div className="flex-1 grid grid-cols-12 gap-1 overflow-hidden">
          <div className="col-span-8">
             <CinematicPanel
               title="Regional Capital Flow & Route Analysis"
               helpTitle="Arbitrage Pathing"
               helpExplanation="Simulates theoretical capital movement across regional markets. Path thickness indicates liquidity depth, while color reflects route stability and execution risk."
             >
                <div className="w-full h-full bg-[#030303] flex items-center justify-center relative">
                   <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:40px_40px]" />
                   <div className="relative flex flex-col items-center">
                      <ArrowRightLeft size={64} className="text-indigo-500/20 mb-6" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 animate-pulse">Analyzing_Route_Viability</span>
                   </div>
                   {/* Visualization nodes would be rendered here */}
                </div>
             </CinematicPanel>
          </div>

          <div className="col-span-4 flex flex-col gap-1">
             <CinematicPanel title="Spread_Decay_Velocity">
                <div className="p-4 space-y-4">
                   {[
                     { pair: 'ARS/USDT', decay: 'High', persistence: '12m' },
                     { pair: 'BRL/USDT', decay: 'Low', persistence: '48m' }
                   ].map((p, i) => (
                     <div key={i} className="bg-slate-900/50 p-3 rounded border border-slate-800">
                        <div className="flex justify-between items-center mb-2 text-[10px] font-bold">
                           <span className="text-slate-300">{p.pair}</span>
                           <span className={p.decay === 'High' ? 'text-red-500' : 'text-green-500'}>{p.decay}_Decay</span>
                        </div>
                        <div className="text-[9px] text-slate-500 uppercase font-black">Persistence: <span className="text-slate-100">{p.persistence}</span></div>
                     </div>
                   ))}
                </div>
             </CinematicPanel>
             <div className="flex-1 overflow-hidden">
                <CinematicPanel title="Market_Divergence_Monitor">
                   <div className="p-4 flex flex-col items-center justify-center h-full gap-4">
                      <Zap size={32} className="text-amber-500 opacity-20" />
                      <div className="text-center">
                         <div className="text-lg font-black text-white">0.024%</div>
                         <div className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Global_Mean_Divergence</div>
                      </div>
                   </div>
                </CinematicPanel>
             </div>
          </div>
       </div>
    </div>
  );
};
