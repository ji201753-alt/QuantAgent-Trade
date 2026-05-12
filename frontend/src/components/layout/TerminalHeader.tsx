import React from 'react';
import { useTerminalStore } from '../../state/terminalState';

export const TerminalHeader: React.FC<{ activeWorkspace: string, setWorkspace: (ws: any) => void }> = ({ activeWorkspace, setWorkspace }) => {
  const isConnected = useTerminalStore(state => state.isConnected);
  return (
    <header className="h-10 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center px-4 justify-between z-50 fixed top-0 left-0 right-0">
      <div className="flex items-center gap-8 h-full">
        <div className="flex items-center gap-2">
           <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center font-black text-xs text-white shadow-glow">Q</div>
           <span className="font-black tracking-tighter text-sm uppercase italic text-slate-200">QuantCore</span>
        </div>
        <nav className="flex gap-1 h-full pt-1">
           {['realtime', 'research', 'operational'].map(ws => (
             <button
                key={ws}
                onClick={() => setWorkspace(ws)}
                className={`px-4 text-[10px] uppercase font-black transition-all border-b-2 ${activeWorkspace === ws ? 'text-indigo-400 border-indigo-500 bg-indigo-500/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
             >
                {ws}
             </button>
           ))}
        </nav>
      </div>

      <div className="flex items-center gap-6">
         <div className="flex items-center gap-4 text-[9px] font-mono text-slate-500 uppercase">
            <span className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-glow-green' : 'bg-red-500'}`} />
              SYNC_{isConnected ? 'OK' : 'ERR'}
            </span>
            <span className="bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700">Latency: 12ms</span>
         </div>
         <button className="bg-white hover:bg-slate-200 text-black text-[10px] font-black px-4 py-1 rounded transition-all active:scale-95">
            DEPLOY_V2
         </button>
      </div>
    </header>
  );
};
