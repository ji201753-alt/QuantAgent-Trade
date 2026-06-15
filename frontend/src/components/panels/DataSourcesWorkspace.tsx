import React from 'react';
import { useTerminalStore } from '../../state/terminalState';

export const DataSourcesWorkspace: React.FC = () => {
  const { connectors, runtimeTelemetry } = useTerminalStore();
  const connectorTelemetry = runtimeTelemetry?.connectors;

  return (
    <div className="h-full p-4 bg-black overflow-y-auto">
       <h1 className="text-xl font-black text-white mb-6">Market_Ingestion_Registry</h1>
       <div className="space-y-2 max-w-2xl">
          {Object.entries(connectors).map(([id, c]) => {
            const runtimeState = connectorTelemetry?.[id]?.status || 'UNVERIFIED';
            return (
              <div key={id} className="p-4 bg-slate-900/40 border border-slate-800 rounded flex justify-between items-center gap-4">
                 <div>
                   <span className="text-slate-200 font-bold uppercase block">{id}</span>
                   <span className="text-[9px] text-slate-500 font-mono uppercase">Runtime: {runtimeState} · Local default: {c.enabled ? 'enabled' : 'disabled'}</span>
                 </div>
                 <button
                   disabled
                   title="Connector activation requires backend lifecycle API; local-only toggles are disabled to avoid false operational state."
                   className="px-4 py-1.5 rounded text-[9px] font-black bg-slate-900 text-amber-400 border border-amber-500/20 cursor-not-allowed"
                 >
                    Runtime_Control_Unavailable
                 </button>
              </div>
            );
          })}
       </div>
    </div>
  );
};
