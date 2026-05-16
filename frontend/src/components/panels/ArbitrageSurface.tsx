import React from 'react';
import { motion } from 'framer-motion';
import { CinematicPanel } from '../layout/CinematicPanel';
import { theme } from '../../theme';
import { Globe, ArrowUpRight, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

const SpreadNode: React.FC<{ label: string; spread: number; stability: number; status: string; color: string }> = ({ label, spread, stability, status, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-slate-900/40 border border-slate-800 rounded-sm p-4 relative overflow-hidden group cursor-pointer"
  >
    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
       <ArrowUpRight size={14} style={{ color }} />
    </div>
    <div className="flex justify-between items-start mb-4">
       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</span>
       <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm" style={{ backgroundColor: `${color}15`, color }}>{status}</span>
    </div>
    <div className="flex justify-between items-baseline mb-6">
       <span className="text-3xl font-mono font-black text-white">{spread.toFixed(2)}%</span>
       <span className="text-[8px] font-black text-slate-600 uppercase">Premium_Delta</span>
    </div>
    <div className="space-y-1">
       <div className="flex justify-between items-baseline">
          <span className="text-[9px] text-slate-600 font-black uppercase">Stability_Index</span>
          <span className="text-[10px] font-mono font-bold text-slate-300">{(stability * 100).toFixed(0)}%</span>
       </div>
       <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${stability * 100}%` }} className="h-full" style={{ backgroundColor: color }} />
       </div>
    </div>
  </motion.div>
);

export const ArbitrageSurface: React.FC = () => {
  return (
    <div className="h-full flex flex-col gap-1 p-1 bg-black">
      {/* Geopolitical Spread Surface */}
      <div className="grid grid-cols-4 gap-1 shrink-0 h-44">
        <SpreadNode label="Argentina_ARS" spread={1.42} stability={0.84} status="STABLE" color={theme.colors.semantic.success} />
        <SpreadNode label="Brazil_BRL" spread={0.68} stability={0.92} status="SYNCHRONIZED" color={theme.colors.semantic.info} />
        <SpreadNode label="Colombia_COP" spread={2.15} stability={0.34} status="FRAGILE" color={theme.colors.semantic.warning} />
        <SpreadNode label="Mexico_MXN" spread={0.24} stability={0.98} status="COMPRESSED" color={theme.colors.semantic.confidence} />
      </div>

      <div className="flex-1 grid grid-cols-12 gap-1 overflow-hidden">
         <div className="col-span-9">
            <CinematicPanel
              title="Regional Premium Migration & Capital Flow Topology"
              helpTitle="Capital Migration"
              helpExplanation="Visualizes the movement of liquidity premiums across geographical regions. Escalating intensities indicate widening spreads and structural asymmetry."
            >
               <div className="w-full h-full bg-[#020202] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent_70%)]" />
                  <div className="relative flex flex-col items-center">
                     <div className="relative w-80 h-80 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0 border border-white/5 rounded-full border-dashed"
                        />
                        <div className="absolute flex flex-col items-center">
                           <Globe size={48} className="text-indigo-500 opacity-20 mb-4" />
                           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Cross_Domain_Topology</span>
                        </div>
                        {/* Dynamic Points for Flow */}
                        {[
                          { angle: 0, label: 'NA' }, { angle: 120, label: 'EU' }, { angle: 240, label: 'LATAM' }
                        ].map(p => (
                          <div
                            key={p.label}
                            className="absolute"
                            style={{ transform: `rotate(${p.angle}deg) translateY(-140px)` }}
                          >
                             <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-glow" />
                             <span className="text-[9px] font-black text-slate-600 block mt-2 text-center" style={{ transform: `rotate(-${p.angle}deg)` }}>{p.label}</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </CinematicPanel>
         </div>

         <div className="col-span-3 flex flex-col gap-1">
            <CinematicPanel title="Liquidity_Deterioration">
               <div className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-[9px] font-black uppercase text-slate-500">P2P_Pressure</span>
                     <span className="text-xs font-bold text-red-500">HIGH</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/5 pt-2">
                     <span className="text-[9px] font-black uppercase text-slate-500">Spread_Decay</span>
                     <span className="text-xs font-bold text-indigo-400">1.2%/hr</span>
                  </div>
               </div>
            </CinematicPanel>
            <div className="flex-1 overflow-hidden">
               <CinematicPanel title="Execution_Confidence">
                  <div className="p-4 flex flex-col justify-center items-center h-full">
                     <ShieldCheck size={32} className="text-green-500 opacity-20 mb-3" />
                     <div className="text-2xl font-black text-white">0.92</div>
                     <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-1 italic">Robust_Execution_Path</span>
                  </div>
               </CinematicPanel>
            </div>
         </div>
      </div>
    </div>
  );
};
