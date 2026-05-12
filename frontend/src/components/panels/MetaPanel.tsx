import React from 'react';
import { useTerminalStore } from '../../state/terminalState';
import { Panel } from '../layout/Panel';

export const MetaPanel: React.FC = () => {
  return (
    <Panel title="Meta-Intelligence & Structural Cognition">
      <div className="p-3 font-mono text-[10px] space-y-4 overflow-y-auto h-full">
        {/* Market Evolution Path */}
        <div className="space-y-1">
           <span className="text-slate-600 font-black uppercase text-[8px]">Structural Evolution Path</span>
           <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
              {['NORMAL', 'VOL_SPIKE', 'LIQ_STRESS', 'CONSOLIDATION'].map((s, i) => (
                <React.Fragment key={i}>
                   <div className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-indigo-400 font-bold whitespace-nowrap">
                      {s}
                   </div>
                   {i < 3 && <span className="text-slate-700">→</span>}
                </React.Fragment>
              ))}
           </div>
        </div>

        {/* Intelligence Families */}
        <div className="grid grid-cols-2 gap-2">
           <div className="bg-indigo-500/5 border border-indigo-500/20 p-2 rounded relative">
              <span className="text-indigo-400 font-black text-[8px] uppercase block mb-1">Pattern Family</span>
              <span className="text-slate-100 font-bold">Liquidity Collapse</span>
              <div className="text-[7px] text-slate-500 mt-1 uppercase">84% Historical Escalation</div>
           </div>
           <div className="bg-amber-500/5 border border-amber-500/20 p-2 rounded relative">
              <span className="text-amber-400 font-black text-[8px] uppercase block mb-1">Structural Archetype</span>
              <span className="text-slate-100 font-bold">Vol_Expansion_v4</span>
              <div className="text-[7px] text-slate-500 mt-1 uppercase">Recurrence: High</div>
           </div>
        </div>

        {/* Operational Attention */}
        <div className="border-t border-slate-800 pt-3">
           <div className="flex justify-between items-center mb-2">
              <span className="text-slate-500 font-black uppercase text-[8px]">Operational Attention Rank</span>
              <span className="text-indigo-500 font-bold tracking-tighter animate-pulse">LEARNING_ESC...</span>
           </div>
           <div className="space-y-1.5">
              {[
                { id: 'REGIME_SHIFT', score: 0.92, reason: 'High Persistence' },
                { id: 'SPREAD_CLUSTER', score: 0.74, reason: 'Recurrence Weighted' }
              ].map(a => (
                <div key={a.id} className="flex items-center justify-between bg-slate-950 p-1.5 rounded border border-slate-900">
                   <div className="flex flex-col">
                      <span className="text-slate-300 font-bold">{a.id}</span>
                      <span className="text-[7px] text-slate-600 uppercase">{a.reason}</span>
                   </div>
                   <div className="text-right">
                      <div className="text-indigo-400 font-black">{(a.score * 100).toFixed(0)}</div>
                      <div className="w-10 h-1 bg-slate-900 rounded-full overflow-hidden mt-0.5">
                         <div className="h-full bg-indigo-500" style={{ width: `${a.score * 100}%` }} />
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </Panel>
  );
};
