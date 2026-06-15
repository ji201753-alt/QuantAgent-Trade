import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Activity, ShieldAlert, Zap, ChevronRight, History } from 'lucide-react';
import { Panel } from '../layout/Panel';
import { theme } from '../../theme';
import { useTerminalStore } from '../../state/terminalState';

interface AlertEvent {
  id: string;
  type: 'instability' | 'anomaly' | 'consensus' | 'macro' | 'microstructure' | 'forecast' | 'kronos';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  timestamp: string;
  description: string;
  source: any;
}

const AlertCard: React.FC<{ alert: AlertEvent }> = ({ alert }) => {
  const { setReplayMode, setWorkspace, setContextualFocus, setInvestigation, activeOverlays } = useTerminalStore();
  const color = alert.severity === 'critical' ? theme.colors.semantic.error :
                alert.severity === 'high' ? theme.colors.semantic.warning :
                alert.severity === 'medium' ? theme.colors.semantic.info :
                theme.colors.text.secondary;

  const Icon = alert.type === 'instability' ? Activity :
               alert.type === 'anomaly' ? Zap :
               alert.type === 'consensus' ? ShieldAlert :
               AlertTriangle;

  const jumpToReplay = () => {
    setReplayMode(true, alert.timestamp);
    setWorkspace('replay');
    setContextualFocus('event', alert.id, alert);
  };

  const openInvestigation = () => {
    setInvestigation({
      id: `INV-${alert.id}`,
      title: alert.title,
      replayTime: alert.timestamp,
      activeOverlays,
      pinnedEvidence: [`${alert.type}:${alert.description}`],
      reasoningHistory: [],
      workspaceId: 'replay',
    });
    jumpToReplay();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-900/50 border border-slate-800 rounded p-3 relative group hover:bg-slate-800/80 transition-all cursor-pointer"
      onClick={openInvestigation}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l" style={{ backgroundColor: color }} />
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
           <Icon size={14} style={{ color }} />
           <span className="text-[10px] font-black uppercase tracking-widest" style={{ color }}>{alert.type}</span>
        </div>
        <span className="text-[8px] text-slate-500 font-mono">{new Date(alert.timestamp).toISOString().slice(11, 19)}</span>
      </div>
      <h4 className="text-white text-[11px] font-bold mb-1 group-hover:text-indigo-400 transition-colors">{alert.title}</h4>
      <p className="text-slate-400 text-[10px] leading-snug italic line-clamp-2">"{alert.description}"</p>

      <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
         <button onClick={(e) => { e.stopPropagation(); jumpToReplay(); }} className="flex items-center gap-1 text-indigo-400 text-[8px] font-black uppercase tracking-widest hover:text-indigo-300">
            <History size={10} /> Jump_to_Replay
         </button>
         <button onClick={(e) => { e.stopPropagation(); openInvestigation(); }} className="flex items-center gap-1 text-slate-400 text-[8px] font-black uppercase tracking-widest hover:text-white">
            <ChevronRight size={10} /> Investigate
         </button>
      </div>
    </motion.div>
  );
};

export const AlertTimeline: React.FC = () => {
  const { decisionIntelligence, marketData, macroRegime, marketStructure } = useTerminalStore();
  const alerts: AlertEvent[] = useMemo(() => {
    const events: AlertEvent[] = [];
    if (decisionIntelligence?.confidence?.is_collapsing) {
      events.push({
        id: `decision-${decisionIntelligence.timestamp}`,
        type: 'instability',
        severity: 'critical',
        title: 'Confidence_Collapse_Detected',
        timestamp: decisionIntelligence.timestamp,
        description: `Consensus ${decisionIntelligence.consensus.agreement_score}; pressure ${decisionIntelligence.operational_pressure}`,
        source: decisionIntelligence,
      });
    }
    (marketData.anomalies || []).slice(0, 5).forEach((anomaly: any, index: number) => {
      events.push({
        id: `anomaly-${index}-${anomaly.timestamp}`,
        type: 'anomaly',
        severity: anomaly.severity || 'medium',
        title: anomaly.metric_name || 'Runtime_Anomaly',
        timestamp: anomaly.timestamp || new Date().toISOString(),
        description: anomaly.description || 'Anomaly event emitted by runtime analytics.',
        source: anomaly,
      });
    });
    marketStructure.activeSignals.slice(0, 6).forEach((signal: any) => {
      events.push({
        id: `micro-signal-${signal.signal_type}-${signal.timestamp}`,
        type: 'microstructure',
        severity: signal.severity || 'medium',
        title: signal.signal_type || 'Microstructure_Event',
        timestamp: signal.timestamp || signal.frame_anchor || new Date().toISOString(),
        description: `${signal.description || 'Microstructure signal emitted by runtime analytics.'} · ${signal.data_mode}`,
        source: signal,
      });
    });
    const frame = marketStructure.activeFrame;
    if (frame && Math.abs(frame.depth_imbalance || 0) > 0.5) {
      events.push({
        id: `micro-${frame.timestamp}`,
        type: 'microstructure',
        severity: Math.abs(frame.depth_imbalance) > 0.75 ? 'high' : 'medium',
        title: 'Depth_Imbalance_Event',
        timestamp: frame.timestamp,
        description: `Depth imbalance ${Number(frame.depth_imbalance).toFixed(3)} in ${frame.data_mode}`,
        source: frame,
      });
    }

    if (marketStructure.forecasts.status && !['AVAILABLE', 'FALLBACK_CPU_MODE', 'UNVERIFIED'].includes(marketStructure.forecasts.status)) {
      events.push({
        id: `forecast-${marketStructure.forecasts.status}-${marketStructure.replayAnchor || 'live'}`,
        type: 'forecast',
        severity: marketStructure.forecasts.status === 'ERROR' ? 'high' : 'medium',
        title: `TimesFM_${marketStructure.forecasts.status}`,
        timestamp: marketStructure.replayAnchor || new Date().toISOString(),
        description: marketStructure.forecasts.error || `TimesFM runtime state ${marketStructure.forecasts.status}`,
        source: marketStructure.forecasts,
      });
    }
    if (marketStructure.kronos.status !== 'ACTIVE' && marketStructure.kronos.status !== 'UNVERIFIED') {
      events.push({
        id: `kronos-${marketStructure.kronos.status}-${marketStructure.replayAnchor || 'live'}`,
        type: 'kronos',
        severity: 'medium',
        title: `Kronos_${marketStructure.kronos.status}`,
        timestamp: marketStructure.replayAnchor || new Date().toISOString(),
        description: marketStructure.kronos.reason || 'Kronos structural cognition runtime is not active',
        source: marketStructure.kronos,
      });
    }
    if (macroRegime?.instability_score && macroRegime.instability_score > 0.6) {
      events.push({
        id: `macro-${macroRegime.timestamp}`,
        type: 'macro',
        severity: macroRegime.instability_score > 0.8 ? 'high' : 'medium',
        title: macroRegime.label,
        timestamp: macroRegime.timestamp,
        description: macroRegime.description,
        source: macroRegime,
      });
    }
    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [decisionIntelligence, marketData.anomalies, marketStructure, macroRegime]);

  return (
    <Panel
      title="Operational Intelligence Timeline"
      helpTitle="Intelligence Alerts"
      helpExplanation="Prioritized runtime events. Selecting an alert anchors replay, contextual focus, and investigation state together."
    >
      <div className="p-3 space-y-3 overflow-y-auto h-full">
        {alerts.length === 0 && <div className="text-[10px] text-slate-500 uppercase font-mono">No runtime alerts emitted yet</div>}
        <AnimatePresence initial={false}>
          {alerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </AnimatePresence>
      </div>
    </Panel>
  );
};
