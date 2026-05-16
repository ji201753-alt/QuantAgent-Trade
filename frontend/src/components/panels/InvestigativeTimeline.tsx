import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Target, Zap, ShieldAlert, MessageSquare } from 'lucide-react';
import { useTerminalStore } from '../../state/terminalState';
import { theme } from '../../theme';

interface NarrativeStep {
  id: string;
  timestamp: string;
  type: 'instability' | 'signal' | 'anomaly' | 'catalyst';
  summary: string;
  confirmation: string[];
}

export const InvestigativeTimeline: React.FC = () => {
  const { replayMode } = useTerminalStore();

  const narrative: NarrativeStep[] = useMemo(() => [
    {
      id: 'n1',
      timestamp: '14:02:10',
      type: 'anomaly',
      summary: 'Liquidity arrival rate increased by 400% in local cluster.',
      confirmation: ['Microstructure_Service', 'Polymarket_L2']
    },
    {
      id: 'n2',
      timestamp: '14:05:32',
      type: 'signal',
      summary: 'Divergence detected between TimesFM projection and current trajectory.',
      confirmation: ['Forecasting_Engine']
    },
    {
      id: 'n3',
      timestamp: '14:12:01',
      type: 'instability',
      summary: 'Structural confidence collapse triggered by cumulative pressure.',
      confirmation: ['Decision_Cognition', 'Consensus_Intelligence']
    }
  ], []);

  return (
    <div className="h-full flex flex-col bg-[#030303] border-l border-white/5 font-mono text-[10px]">
      <header className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40">
         <div className="flex items-center gap-2">
            <History size={14} className="text-indigo-400" />
            <span className="font-black uppercase tracking-widest text-slate-300">Forensic_Chronology</span>
         </div>
         <span className="text-[8px] font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-white/5">AUTO_RECONSTRUCT: ON</span>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 relative">
         <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-800/50" />

         <AnimatePresence>
            {narrative.map((step, i) => (
               <motion.div
                 key={step.id}
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="relative pl-8 group"
               >
                  <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-slate-900 border-2 border-indigo-500 z-10 group-hover:scale-125 transition-transform" />

                  <div className="flex justify-between items-baseline mb-1">
                     <span className="text-[9px] font-bold text-indigo-400">{step.timestamp}</span>
                     <span className="text-[8px] font-black uppercase text-slate-600 tracking-tighter">{step.type}</span>
                  </div>

                  <p className="text-slate-300 leading-relaxed italic pr-2 mb-3">"{step.summary}"</p>

                  <div className="flex flex-wrap gap-2">
                     {step.confirmation.map(c => (
                       <span key={c} className="text-[7px] font-black uppercase bg-indigo-600/10 text-indigo-400/70 border border-indigo-500/20 px-1.5 py-0.5 rounded-sm">
                          {c}
                       </span>
                     ))}
                  </div>
               </motion.div>
            ))}
         </AnimatePresence>
      </div>

      <footer className="p-4 bg-black/40 border-t border-white/5">
         <button className="w-full bg-indigo-600 text-white py-2 rounded-sm font-black uppercase text-[9px] tracking-widest hover:bg-indigo-500 transition-all shadow-xl">
            Synthesize_Briefing
         </button>
      </footer>
    </div>
  );
};
