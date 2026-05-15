import React from 'react';
import { useTerminalStore } from '../../state/terminalState';
import { CinematicPanel } from '../layout/CinematicPanel';
import { theme } from '../../theme';
import { Activity, ShieldCheck, Database, Zap } from 'lucide-react';

export const ObservabilityPanel: React.FC = () => {
  const { stats, isConnected } = useTerminalStore();

  return (
    <CinematicPanel
      title="System Observability & Diagnostics"
      statusColor={isConnected ? theme.colors.semantic.success : theme.colors.semantic.error}
    >
      <div className="p-3 font-mono text-[9px] space-y-3 uppercase">
        <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded border border-slate-800">
          <span className="text-slate-500">Sync_Status</span>
          <span className={isConnected ? 'text-green-400 font-bold' : 'text-red-500 font-bold'}>
            {isConnected ? 'STABLE' : 'ERROR'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-indigo-400 font-bold">
           <div className="bg-slate-900/30 p-2 rounded border border-slate-800">
             <span className="text-slate-500 block mb-1">Bus_Load</span>
             <span>142 msg/s</span>
           </div>
           <div className="bg-slate-900/30 p-2 rounded border border-slate-800">
             <span className="text-slate-500 block mb-1">Latency</span>
             <span>12ms</span>
           </div>
        </div>

        {/* Inference Runtime Diagnostics */}
        <div className="pt-2 border-t border-white/5">
           <span className="text-slate-600 font-black text-[7px] block mb-2 tracking-widest">Inference_Runtime</span>
           <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                 <span className="text-slate-400">TimesFM_Engine</span>
                 <span className="text-indigo-400 font-bold">ACTIVE_GPU</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-slate-400">Inference_Lat</span>
                 <span className="text-slate-200 font-mono">42ms</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-500 w-[82%]" />
              </div>
           </div>
        </div>
      </div>
    </CinematicPanel>
  );
};
