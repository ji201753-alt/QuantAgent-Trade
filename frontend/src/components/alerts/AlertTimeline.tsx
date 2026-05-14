import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Activity,
  ShieldAlert,
  Zap,
  ChevronRight,
  History
} from 'lucide-react';
import { Panel } from '../layout/Panel';
import { theme } from '../../theme';

interface AlertEvent {
  id: string;
  type: 'instability' | 'anomaly' | 'consensus' | 'macro';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  timestamp: string;
  description: string;
}

const AlertCard: React.FC<{ alert: AlertEvent }> = ({ alert }) => {
  const color = alert.severity === 'critical' ? theme.colors.semantic.error :
                alert.severity === 'high' ? theme.colors.semantic.warning :
                alert.severity === 'medium' ? theme.colors.semantic.info :
                theme.colors.text.secondary;

  const Icon = alert.type === 'instability' ? Activity :
               alert.type === 'anomaly' ? Zap :
               alert.type === 'consensus' ? ShieldAlert :
               AlertTriangle;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-900/50 border border-slate-800 rounded p-3 relative group hover:bg-slate-800/80 transition-all cursor-pointer"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l" style={{ backgroundColor: color }} />
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
           <Icon size={14} style={{ color }} />
           <span className="text-[10px] font-black uppercase tracking-widest" style={{ color }}>{alert.type}</span>
        </div>
        <span className="text-[8px] text-slate-500 font-mono">{alert.timestamp}</span>
      </div>
      <h4 className="text-white text-[11px] font-bold mb-1 group-hover:text-indigo-400 transition-colors">{alert.title}</h4>
      <p className="text-slate-400 text-[10px] leading-snug italic line-clamp-2">"{alert.description}"</p>

      <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
         <button className="flex items-center gap-1 text-indigo-400 text-[8px] font-black uppercase tracking-widest hover:text-indigo-300">
            <History size={10} /> Jump_to_Replay
         </button>
         <button className="flex items-center gap-1 text-slate-400 text-[8px] font-black uppercase tracking-widest hover:text-white">
            <ChevronRight size={10} /> Details
         </button>
      </div>
    </motion.div>
  );
};

export const AlertTimeline: React.FC = () => {
  const alerts: AlertEvent[] = [
    {
      id: '1',
      type: 'instability',
      severity: 'critical',
      title: 'Confidence_Collapse_Detected',
      timestamp: '14:22:01',
      description: 'Systemic divergence across forecasting and microstructure layers. Confidence dropped from 0.82 to 0.12 in 400ms.'
    },
    {
      id: '2',
      type: 'anomaly',
      severity: 'high',
      title: 'Liquidity_Arrival_Anomaly',
      timestamp: '14:21:45',
      description: 'Sudden 400% increase in orderbook depth at 0.5420. Non-toxic cluster identified.'
    },
    {
      id: '3',
      type: 'macro',
      severity: 'medium',
      title: 'Cross_Domain_Contagion',
      timestamp: '14:20:12',
      description: 'Volatility in Binance_BTC correlates with local regime shift (p=0.92).'
    }
  ];

  return (
    <Panel
      title="Operational Intelligence Timeline"
      helpTitle="Intelligence Alerts"
      helpExplanation="Prioritized stream of structural events. Alerts are automatically linked to historical replay and investigation contexts."
    >
      <div className="p-3 space-y-3 overflow-y-auto h-full">
        <AnimatePresence initial={false}>
          {alerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </AnimatePresence>
      </div>
    </Panel>
  );
};
