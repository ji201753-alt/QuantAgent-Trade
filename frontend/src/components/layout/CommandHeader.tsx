import React from 'react';
import { Command, Wifi, WifiOff } from 'lucide-react';
import { useTerminalStore } from '../../state/terminalState';

export const CommandHeader: React.FC = () => {
  const { activeWorkspaceId, activeSymbol, isConnected, runtimeTelemetry, setCommandPalette } = useTerminalStore();
  const queueDepth = runtimeTelemetry?.event_bus?.queue_depth ?? 'N/A';
  const modelState = runtimeTelemetry?.runtime_orchestrator?.diagnostics?.status || 'UNVERIFIED';

  return (
    <header className="h-12 bg-black border-b border-slate-900 flex items-center justify-between px-4 z-40 font-mono uppercase">
      <div className="flex items-center gap-4">
        <span className="text-slate-200 font-black tracking-[0.2em] text-[11px]">QuantAgent Workstation</span>
        <span className="text-slate-600 text-[9px]">Workspace: <span className="text-indigo-400">{activeWorkspaceId}</span></span>
        <span className="text-slate-600 text-[9px]">Symbol: <span className="text-slate-300">{activeSymbol}</span></span>
      </div>
      <div className="flex items-center gap-4 text-[9px]">
        <span className="text-slate-600">EventBus_Q: <span className="text-slate-300">{queueDepth}</span></span>
        <span className="text-slate-600">TimesFM: <span className="text-amber-400">{modelState}</span></span>
        <span className={`flex items-center gap-1 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
          {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
          WS_{isConnected ? 'OK' : 'DOWN'}
        </span>
        <button onClick={() => setCommandPalette(true)} className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-400 hover:text-white">
          <Command size={12} /> CTRL_K
        </button>
      </div>
    </header>
  );
};
