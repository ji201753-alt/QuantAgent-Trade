import React from 'react';
import { Panel } from '../layout/Panel';

export const ReasoningPanel: React.FC = () => {
  return (
    <Panel title="Operational Reasoning & Briefing">
      <div className="p-3 font-mono text-[10px] space-y-4 overflow-y-auto h-full select-text">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded shadow-lg relative group">
           <div className="absolute top-0 right-0 p-2 opacity-20">
              <span className="text-indigo-400 animate-pulse font-black uppercase text-[8px]">Grounded_Briefing</span>
           </div>
           <span className="text-slate-500 font-black uppercase text-[8px] block mb-2 tracking-widest">Situation_Summary</span>
           <p className="text-slate-200 leading-relaxed text-[11px] font-medium border-l border-slate-800 pl-3 italic">
              "Cross-domain instability remains elevated while contextual agreement weakens across forecasting and macro layers. Historical analogs showed elevated uncertainty persistence during similar volatility structures."
           </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
           <div className="bg-slate-950 p-2 rounded border border-slate-900">
              <span className="text-slate-600 font-bold uppercase text-[8px] block mb-1">Evidence_Chain</span>
              <ul className="space-y-1 text-[9px] text-slate-400">
                 <li>• Consensus_Score: 0.92</li>
                 <li>• Reg_Persistence: 92m</li>
                 <li>• Anom_Cluster: Detected</li>
              </ul>
           </div>
           <div className="bg-slate-950 p-2 rounded border border-slate-900">
              <span className="text-slate-600 font-bold uppercase text-[8px] block mb-1">Investigation_Paths</span>
              <ul className="space-y-1 text-[9px] text-indigo-400/80 font-bold">
                 <li>→ Review Precursors</li>
                 <li>→ Align Multi-TF</li>
              </ul>
           </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
           <span className="text-slate-600 text-[8px] uppercase font-black tracking-tighter">Model: Institutional_Reasoning_V1</span>
           <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-0.5 rounded font-black uppercase text-[8px] transition-all">
              REFRESH_BRIEF
           </button>
        </div>
      </div>
    </Panel>
  );
};
