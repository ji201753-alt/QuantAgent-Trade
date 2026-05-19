import React from 'react';
import { CinematicPanel } from '../layout/CinematicPanel';
import { useTerminalStore } from '../../state/terminalState';

export const DataSourcesWorkspace: React.FC = () => {
  const { connectors, toggleConnector } = useTerminalStore();
  return (
    <div className="h-full p-4 bg-black overflow-y-auto">
       <h1 className="text-xl font-black text-white mb-6">Market_Ingestion_Registry</h1>
       <div className="space-y-2 max-w-2xl">
          {Object.entries(connectors).map(([id, c]) => (
            <div key={id} className="p-4 bg-slate-900/40 border border-slate-800 rounded flex justify-between items-center">
               <span className="text-slate-200 font-bold uppercase">{id}</span>
               <button onClick={() => toggleConnector(id)} className={`px-4 py-1.5 rounded text-[9px] font-black ${c.enabled ? 'bg-slate-800 text-slate-400' : 'bg-indigo-600 text-white'}`}>
                  {c.enabled ? 'Deactivate' : 'Enable'}
               </button>
            </div>
          ))}
       </div>
    </div>
  );
};
