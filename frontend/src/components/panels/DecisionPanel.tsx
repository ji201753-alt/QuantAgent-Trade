import React from 'react';
import { useTerminalStore } from '../../state/terminalState';
import { CinematicPanel } from '../layout/CinematicPanel';
import { theme } from '../../theme';

export const DecisionPanel: React.FC = () => {
  const { decisionIntelligence } = useTerminalStore();
  const isCollapsing = decisionIntelligence?.confidence.is_collapsing;
  const consensus = decisionIntelligence?.consensus;
  const confidence = decisionIntelligence?.confidence;
  const pressure = decisionIntelligence?.operational_pressure;
  const topology = confidence?.uncertainty_topology ? Object.entries(confidence.uncertainty_topology) : [];

  return (
    <CinematicPanel
      title="Decision Cognition & Uncertainty"
      statusColor={isCollapsing ? theme.colors.semantic.error : undefined}
    >
      <div className="p-3 font-mono text-[10px] space-y-4 overflow-y-auto h-full">
        <div className="bg-slate-900 border border-slate-800 p-2 rounded relative group">
           <span className="text-slate-500 font-black uppercase text-[8px] block mb-2">Cross-System Consensus</span>
           {!decisionIntelligence && <div className="text-amber-400 uppercase font-black">Decision runtime unavailable</div>}
           {decisionIntelligence && (
             <>
               <div className="flex justify-between items-center mb-1">
                  <span className={isCollapsing ? 'text-red-400 font-bold tracking-widest' : 'text-indigo-400 font-bold tracking-widest'}>{isCollapsing ? 'CONFIDENCE_COLLAPSING' : 'RUNTIME_REPORTED'}</span>
                  <span className="bg-indigo-500/20 text-indigo-300 px-1 rounded">{consensus?.agreement_score?.toFixed?.(2) ?? 'N/A'}</span>
               </div>
               <div className="text-slate-200 font-bold uppercase italic tracking-tighter">{consensus?.dominant_hypothesis || 'No dominant hypothesis'}</div>
               <div className="mt-2 flex gap-1 h-1">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className={`flex-1 ${i < Math.round((consensus?.agreement_score || 0) * 10) ? 'bg-indigo-500 shadow-[0_0_5px_#6366f1]' : 'bg-slate-800'}`} />
                  ))}
               </div>
             </>
           )}
        </div>

        <div className="space-y-2">
           <span className="text-slate-500 font-black uppercase text-[8px]">Structural Confidence Topology</span>
           {topology.length === 0 && <div className="text-[9px] text-slate-600 uppercase">No topology emitted by runtime</div>}
           <div className="grid grid-cols-2 gap-2">
              {topology.map(([label, val]) => (
                <div key={label} className="bg-slate-950 p-1.5 border border-slate-900 rounded flex justify-between items-center">
                   <span className="text-slate-600 text-[8px] font-bold">{label}</span>
                   <span className="text-indigo-400 font-black">{(Number(val) * 100).toFixed(0)}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="border-t border-slate-800 pt-3">
           <div className="flex justify-between items-center mb-2">
              <span className="text-slate-500 font-black uppercase text-[8px]">Operational Decision Pressure</span>
              <span className={`font-bold tracking-tighter ${pressure && pressure > 0.7 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>{pressure === undefined ? 'UNVERIFIED' : pressure > 0.7 ? 'HIGH_PRESSURE' : 'LOW_PRESSURE'}</span>
           </div>
           <div className="h-2 bg-slate-900 rounded overflow-hidden">
             <div className="h-full bg-indigo-500/50" style={{ width: `${Math.max(0, Math.min(1, pressure || 0)) * 100}%` }} />
           </div>
        </div>
      </div>
    </CinematicPanel>
  );
};
