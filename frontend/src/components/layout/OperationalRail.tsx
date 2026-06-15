import React from 'react';
import { Activity, BarChart3, Database, GitCompare, History, Radio, Repeat, Settings } from 'lucide-react';
import { useTerminalStore } from '../../state/terminalState';

const workspaces = [
  { id: 'prediction', label: 'Prediction', icon: BarChart3 },
  { id: 'arbitrage', label: 'Arbitrage', icon: GitCompare },
  { id: 'market-structure', label: 'Structure', icon: Activity },
  { id: 'macro', label: 'Macro', icon: Radio },
  { id: 'replay', label: 'Replay', icon: History },
  { id: 'recurrence', label: 'Kronos', icon: Repeat },
  { id: 'sources', label: 'Sources', icon: Database },
  { id: 'diagnostics', label: 'Diagnostics', icon: Settings },
];

const overlays = ['forecast', 'analogs', 'zones', 'footprint', 'profile'];

export const OperationalRail: React.FC = () => {
  const { activeWorkspaceId, setWorkspace, activeOverlays, toggleOverlay, isConnected } = useTerminalStore();

  return (
    <aside className="w-20 bg-black border-r border-slate-900 flex flex-col items-center py-3 gap-3 z-50">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} title={isConnected ? 'WebSocket connected' : 'WebSocket disconnected'} />
      <nav className="flex flex-col gap-1 w-full px-2">
        {workspaces.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setWorkspace(id)}
            title={label}
            className={`h-10 rounded flex items-center justify-center transition-colors ${activeWorkspaceId === id ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-600 hover:text-slate-300 hover:bg-slate-900/60'}`}
          >
            <Icon size={16} />
          </button>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-1 w-full px-2 border-t border-slate-900 pt-3">
        {overlays.map((id) => (
          <button
            key={id}
            onClick={() => toggleOverlay(id)}
            title={`Toggle ${id} overlay`}
            className={`px-1 py-1 rounded text-[8px] uppercase font-black ${activeOverlays.includes(id) ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-900 text-slate-600'}`}
          >
            {id.slice(0, 4)}
          </button>
        ))}
      </div>
    </aside>
  );
};
