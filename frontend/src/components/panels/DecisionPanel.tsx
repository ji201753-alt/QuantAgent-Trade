import React from 'react';
import { useTerminalStore } from '../../state/terminalState';
import { Panel } from '../layout/Panel';

export const DecisionPanel: React.FC = () => {
  return (
    <Panel title="Decision Cognition & Uncertainty">
      <div className="p-3 font-mono text-[10px] space-y-4 overflow-y-auto h-full">
        {/* Consensus State */}
        <div className="bg-slate-900 border border-slate-800 p-2 rounded relative group">
           <span className="text-slate-500 font-black uppercase text-[8px] block mb-2">Cross-System Consensus</span>
           <div className="flex justify-between items-center mb-1">
              <span className="text-indigo-400 font-bold tracking-widest">COHERENCE_STABLE</span>
              <span className="bg-indigo-500/20 text-indigo-300 px-1 rounded">0.92</span>
           </div>
           <div className="text-slate-200 font-bold uppercase italic tracking-tighter">Bullish_Hypothesis_Dominant</div>
           <div className="mt-2 flex gap-1 h-1">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`flex-1 ${i < 8 ? 'bg-indigo-500 shadow-[0_0_5px_#6366f1]' : 'bg-slate-800'}`} />
              ))}
           </div>
        </div>

        {/* Confidence Topology */}
        <div className="space-y-2">
           <span className="text-slate-500 font-black uppercase text-[8px]">Structural Confidence Topology</span>
           <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'FORECASTS', val: 0.84 },
                { label: 'ANOMALIES', val: 0.72 },
                { label: 'LIQUIDITY', val: 0.91 },
                { label: 'MACRO', val: 0.64 }
              ].map(sys => (
                <div key={sys.label} className="bg-slate-950 p-1.5 border border-slate-900 rounded flex justify-between items-center">
                   <span className="text-slate-600 text-[8px] font-bold">{sys.label}</span>
                   <span className="text-indigo-400 font-black">{(sys.val * 100).toFixed(0)}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Operational Decision Pressure */}
        <div className="border-t border-slate-800 pt-3">
           <div className="flex justify-between items-center mb-2">
              <span className="text-slate-500 font-black uppercase text-[8px]">Operational Decision Pressure</span>
              <span className="text-red-500 font-bold animate-pulse tracking-tighter">LOW_PRESSURE</span>
           </div>
           <div className="flex items-end gap-1 h-8">
              {[0.2, 0.3, 0.25, 0.4, 0.35, 0.2, 0.22, 0.18].map((v, i) => (
                <div key={i} className="flex-1 bg-indigo-500/40 border-t border-indigo-500" style={{ height: `${v * 100}%` }} />
              ))}
           </div>
        </div>
      </div>
    </Panel>
  );
};
