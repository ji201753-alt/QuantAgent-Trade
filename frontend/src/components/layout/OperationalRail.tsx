import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Search,
  ShieldAlert,
  Globe,
  BarChart3,
  Cpu,
  Zap,
  Settings,
  Menu,
  ChevronRight,
  Database,
  SearchCode
} from 'lucide-react';
import { useTerminalStore } from '../../state/terminalState';
import { theme } from '../../theme';
import { DynamicStatus } from './Common';

export const OperationalRail: React.FC = () => {
  const { isConnected, activeWorkspaceId, setWorkspace } = useTerminalStore();

  const workspaces = [
    { id: 'prediction', label: 'Prediction_Markets', icon: BarChart3 },
    { id: 'crypto', label: 'Crypto_Intelligence', icon: Activity },
    { id: 'arbitrage', label: 'Arbitrage_Monitor', icon: SearchCode },
    { id: 'macro', label: 'Macro_Intelligence', icon: Globe },
    { id: 'replay', label: 'Replay_Investigation', icon: ShieldAlert },
    { id: 'recurrence', label: 'Structural_Recurrence', icon: Database },
    { id: 'research', label: 'Research_Lab', icon: Zap },
    { id: 'diagnostics', label: 'System_Diagnostics', icon: Cpu },
  ];

  return (
    <aside className="w-16 h-full bg-black border-r border-white/5 flex flex-col items-center py-4 z-[60] shadow-2xl relative shrink-0">
      {/* Platform Health Spine */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center font-black text-white shadow-glow group cursor-pointer">Q</div>
        <div className="flex flex-col gap-1 items-center">
           <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`} />
           <div className="w-1 h-8 bg-slate-800 rounded-full relative overflow-hidden">
              <motion.div animate={{ height: ['20%', '80%', '40%'] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-0 w-full bg-indigo-500" />
           </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {workspaces.map(ws => {
           const Icon = ws.icon;
           const isActive = activeWorkspaceId === ws.id;
           return (
             <button
               key={ws.id}
               onClick={() => setWorkspace(ws.id)}
               className={`w-12 h-12 rounded-sm flex items-center justify-center transition-all relative group ${
                 isActive ? 'bg-indigo-600 text-white shadow-glow' : 'text-slate-500 hover:text-slate-100 hover:bg-white/5'
               }`}
             >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {/* Contextual Tooltip */}
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-[10px] font-black uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-[100] shadow-2xl">
                   {ws.label}
                </div>
             </button>
           );
        })}
      </nav>

      <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
         <button className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
            <Settings size={18} />
         </button>
      </div>
    </aside>
  );
};
