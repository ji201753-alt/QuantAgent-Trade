import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Check, X, Shield, Target, Zap, Activity } from 'lucide-react';
import { useTerminalStore } from '../../state/terminalState';
import { theme } from '../../theme';

const overlayDefinitions = [
  { id: 'analogs', label: 'Kronos_Analogs', icon: Target, color: theme.colors.semantic.confidence },
  { id: 'forecast', label: 'TimesFM_Projections', icon: Zap, color: theme.colors.semantic.pressure },
  { id: 'zones', label: 'Liquidity_Zones', icon: Activity, color: theme.colors.semantic.success },
  { id: 'anomalies', label: 'Anomaly_Clusters', icon: Shield, color: theme.colors.semantic.instability },
];

export const OverlayManager: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { activeOverlays, toggleOverlay } = useTerminalStore();

  if (!isOpen) return null;

  return (
    <div className="absolute top-14 right-6 w-72 bg-slate-900 border border-slate-800 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[100] overflow-hidden">
      <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center bg-black/40">
         <div className="flex items-center gap-2">
            <Layers size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Overlay_Control</span>
         </div>
         <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={14} /></button>
      </div>

      <div className="p-2 space-y-1">
         {overlayDefinitions.map(o => {
            const isActive = activeOverlays.includes(o.id);
            const Icon = o.icon;
            return (
              <button
                key={o.id}
                onClick={() => toggleOverlay(o.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all group ${
                  isActive ? 'bg-indigo-600/10 text-white' : 'text-slate-500 hover:bg-white/5'
                }`}
              >
                 <div
                   className="w-5 h-5 rounded flex items-center justify-center border"
                   style={{ borderColor: isActive ? o.color : 'rgba(255,255,255,0.1)', backgroundColor: isActive ? `${o.color}20` : 'transparent' }}
                 >
                    <Icon size={12} style={{ color: isActive ? o.color : 'inherit' }} />
                 </div>
                 <span className="text-[11px] font-bold text-left flex-1 uppercase tracking-tighter">{o.label}</span>
                 {isActive && <Check size={12} className="text-indigo-400" />}
              </button>
            );
         })}
      </div>

      <div className="p-3 bg-black/40 border-t border-white/5 flex items-center justify-between">
         <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">Active_Layers: {activeOverlays.length}</span>
         <button className="text-[8px] font-black uppercase text-indigo-400 hover:underline">Reset_Defaults</button>
      </div>
    </div>
  );
};
