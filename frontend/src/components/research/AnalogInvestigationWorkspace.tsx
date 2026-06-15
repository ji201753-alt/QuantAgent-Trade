import React from 'react';
import { ComparisonWorkbench } from '../research/ComparisonWorkbench';
import { Target } from 'lucide-react';
import { useTerminalStore } from '../../state/terminalState';

export const AnalogInvestigationWorkspace: React.FC = () => {
  const { marketStructure } = useTerminalStore();
  const analogCount = marketStructure.kronos.activeAnalogs.length;
  const status = marketStructure.kronos.status;
  const reason = marketStructure.kronos.reason;

  return (
    <div className="h-full flex flex-col bg-black">
      <header className="h-12 border-b border-white/5 bg-[#050505] flex items-center px-6 justify-between shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-6 h-6 rounded bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
               <Target size={14} className="text-indigo-400" />
            </div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 italic">Kronos_Forensic_Workbench</h2>
         </div>
         <div className="flex gap-4">
            <span className={`text-[9px] font-black uppercase tracking-widest bg-black/40 px-3 py-1 rounded border ${status === 'ACTIVE' ? 'text-green-400 border-green-500/20' : 'text-amber-400 border-amber-500/20'}`}>Kronos: {status}</span>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest bg-black/40 px-3 py-1 rounded border border-white/5">Context: {marketStructure.dataMode}</span>
         </div>
      </header>

      <div className="flex-1 overflow-hidden p-1">
         <ComparisonWorkbench />
      </div>

      <footer className="h-10 border-t border-white/5 bg-[#050505] flex items-center px-6 justify-between shrink-0 font-mono text-[9px] text-slate-500 uppercase">
         <div className="flex gap-8">
            <span>Active_Analogs: {analogCount}</span>
            <span>Regime_Transitions: {marketStructure.kronos.regimeTransitions.length}</span>
            <span>Trajectory_Sets: {marketStructure.kronos.trajectories.length}</span>
         </div>
         <span className="text-amber-500">{reason || marketStructure.interpretation.explanation}</span>
      </footer>
    </div>
  );
};
