import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Target, Zap, ShieldAlert, MessageSquare, Share2, TrendingUp, ChevronDown } from 'lucide-react';
import { useTerminalStore } from '../../state/terminalState';
import { theme } from '../../theme';

interface OperationalSequence {
  id: string;
  label: string;
  status: 'Escalating' | 'Stabilizing' | 'Collapsing';
  events: Array<{
    id: string;
    timestamp: string;
    type: string;
    summary: string;
  }>;
}

export const InvestigativeTimeline: React.FC = () => {
  const { replayMode } = useTerminalStore();

  const sequences: OperationalSequence[] = useMemo(() => [
    {
      id: 'seq1',
      label: 'Volatility_Precursor_Phase',
      status: 'Escalating',
      events: [
        { id: 'e1', timestamp: '14:02:10', type: 'anomaly', summary: 'Liquidity arrival rate increased by 400%' },
        { id: 'e2', timestamp: '14:05:32', type: 'signal', summary: 'TimesFM projection divergence detected' }
      ]
    },
    {
      id: 'seq2',
      label: 'Structural_Breakdown_Sequence',
      status: 'Collapsing',
      events: [
        { id: 'e3', timestamp: '14:08:45', type: 'recurrence', summary: 'Matched analog K-8421 escalation path' },
        { id: 'e4', timestamp: '14:12:01', type: 'instability', summary: 'Structural confidence collapse triggered' }
      ]
    }
  ], []);

  return (
    <div className="h-full flex flex-col bg-[#030303] border-l border-white/5 font-mono text-[10px]">
      <header className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40">
         <div className="flex items-center gap-2">
            <History size={14} className="text-indigo-400" />
            <span className="font-black uppercase tracking-widest text-slate-300">Forensic_Chronology</span>
         </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
         {sequences.map((seq, i) => (
            <motion.div
              key={seq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="space-y-3"
            >
               <div className="flex justify-between items-center bg-slate-900/30 p-2 rounded-sm border border-white/5">
                  <div className="flex items-center gap-2">
                     <ChevronDown size={12} className="text-slate-600" />
                     <span className="font-black uppercase tracking-tighter text-indigo-400">{seq.label}</span>
                  </div>
                  <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded ${seq.status === 'Collapsing' ? 'bg-red-500/20 text-red-500' : 'bg-indigo-500/20 text-indigo-400'}`}>
                     {seq.status}
                  </span>
               </div>

               <div className="space-y-4 pl-4 border-l border-slate-800">
                  {seq.events.map(event => (
                     <div key={event.id} className="relative group cursor-pointer hover:bg-white/5 p-2 rounded-sm transition-all">
                        <div className="flex justify-between items-baseline mb-1">
                           <span className="text-[9px] font-bold text-slate-500 group-hover:text-indigo-400">{event.timestamp}</span>
                           <span className="text-[7px] font-black uppercase text-slate-700">{event.type}</span>
                        </div>
                        <p className="text-slate-400 italic pr-2 leading-relaxed">"{event.summary}"</p>
                     </div>
                  ))}
               </div>
            </motion.div>
         ))}
      </div>

      <footer className="p-4 bg-black/40 border-t border-white/5">
         <button className="w-full bg-indigo-600 text-white py-2 rounded-sm font-black uppercase text-[9px] tracking-widest hover:bg-indigo-500 transition-all shadow-xl">
            Synthesize_Investigation
         </button>
      </footer>
    </div>
  );
};
