import React from 'react';
import { motion } from 'framer-motion';
import { Panel } from '../layout/Panel';
import { theme } from '../../theme';
import { useTerminalStore } from '../../state/terminalState';

const MetricRow: React.FC<{ label: string; value: string | number; color: string; percent?: number }> = ({ label, value, color, percent }) => (
  <div className="group">
    <div className="flex justify-between items-baseline mb-1">
      <span className="text-slate-500 text-[9px] uppercase tracking-tighter">{label}</span>
      <span className={`text-xs font-bold ${color}`}>{value}</span>
    </div>
    {percent !== undefined && (
      <div className="h-1.5 bg-slate-800 rounded-sm relative overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
          transition={theme.motion.transitions.fade}
          className={`h-full ${color.replace('text-', 'bg-')} opacity-60`}
        />
      </div>
    )}
  </div>
);

export const MicrostructurePanel: React.FC = () => {
  const marketStructure = useTerminalStore((state) => state.marketStructure);
  const frame = marketStructure.activeFrame;
  const signals = marketStructure.activeSignals;
  const mode = marketStructure.dataMode;
  const imbalance = frame?.depth_imbalance ?? 0;
  const delta = frame?.order_flow?.delta ?? 0;
  const cumulativeDelta = frame?.order_flow?.cumulative_delta ?? 0;
  const tradeCount = frame?.order_flow?.trade_count ?? 0;
  const profile = marketStructure.activeProfile;
  const maxProfile = Math.max(...profile.map((level: any) => Number(level.total_volume || 0)), 1);
  const highVolumeNode = profile.reduce((max: any, level: any) => Number(level.total_volume || 0) > Number(max?.total_volume || 0) ? level : max, profile[0]);
  const lowLiquidityGaps = profile.filter((level: any) => Number(level.total_volume || 0) < maxProfile * 0.2).length;
  const analytics = marketStructure.activeAnalytics;
  const aggressiveExecution = Math.abs(delta) > Math.max(1, (frame?.order_flow?.buy_volume || 0) + (frame?.order_flow?.sell_volume || 0)) * 0.6;
  const latestSignals = signals.slice(0, 4);

  return (
    <Panel
      title="Microstructure Analytics"
      helpTitle="Realtime Microstructure"
      helpExplanation="Aggregates orderbook depth, execution delta, and volume-at-price from available connector data. Data mode is shown explicitly when full tick/depth is unavailable."
    >
    <div className="flex flex-col h-full text-slate-100 font-mono overflow-hidden p-3 space-y-4">
      <div className={`text-[9px] uppercase font-black ${mode === 'LIVE_AGGREGATION_MODE' ? 'text-green-400' : 'text-amber-400'}`}>Mode: {mode}</div>
      {!frame && <div className="text-[10px] text-amber-400 uppercase">Awaiting replayable microstructure frame</div>}
      <MetricRow label="Bid/Ask Depth Imbalance" value={imbalance.toFixed(3)} color={imbalance >= 0 ? 'text-green-500' : 'text-red-500'} percent={(imbalance + 1) * 50} />
      <div className="grid grid-cols-2 gap-4">
        <MetricRow label="Spread" value={frame ? frame.spread.toFixed(4) : 'N/A'} color="text-amber-400" />
        <MetricRow label="Trade Window" value={tradeCount} color="text-blue-400" />
      </div>
      <div className="pt-2 border-t border-slate-800">
        <MetricRow label="Order Flow Delta" value={delta.toFixed(2)} color={delta >= 0 ? 'text-green-400' : 'text-red-400'} percent={Math.min(100, Math.abs(delta))} />
        <MetricRow label="Cumulative Delta" value={cumulativeDelta.toFixed(2)} color={cumulativeDelta >= 0 ? 'text-indigo-400' : 'text-red-400'} />
        <div className={`text-[9px] uppercase font-black ${aggressiveExecution ? 'text-amber-400' : 'text-slate-600'}`}>Aggressive_Execution: {aggressiveExecution ? 'DETECTED' : 'Not_Detected'}</div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <MetricRow label="Absorption" value={analytics.absorption_score?.toFixed?.(2) ?? 'N/A'} color={analytics.absorption_score > 0.65 ? 'text-amber-400' : 'text-slate-500'} />
          <MetricRow label="Exhaustion" value={analytics.exhaustion_score?.toFixed?.(2) ?? 'N/A'} color={analytics.exhaustion_score > 0.7 ? 'text-purple-400' : 'text-slate-500'} />
          <MetricRow label="Vacuum" value={analytics.liquidity_vacuum_score?.toFixed?.(2) ?? 'N/A'} color={analytics.liquidity_vacuum_score > 0.6 ? 'text-red-400' : 'text-slate-500'} />
          <MetricRow label="Stacked Imb." value={frame?.order_flow?.stacked_imbalance_count ?? 0} color={(frame?.order_flow?.stacked_imbalance_count || 0) > 0 ? 'text-cyan-400' : 'text-slate-500'} />
        </div>
      </div>
      <div className="pt-2 border-t border-slate-800 space-y-1">
        <span className="text-[8px] uppercase text-slate-600 font-black">Market_Structure_Events</span>
        {latestSignals.length === 0 && <div className="text-[9px] text-slate-600 uppercase">No first-class structure events emitted</div>}
        {latestSignals.map((signal: any) => (
          <button
            key={`${signal.signal_type}-${signal.timestamp}`}
            onClick={() => useTerminalStore.getState().setContextualFocus('microstructure', signal.signal_type, signal)}
            className="w-full text-left rounded border border-amber-500/10 bg-amber-500/5 px-2 py-1 text-[9px] uppercase text-amber-300 hover:border-amber-400/40"
          >
            {signal.signal_type} · {Number(signal.value || 0).toFixed(2)} · {signal.data_mode}
          </button>
        ))}
      </div>
      <div className="pt-2 border-t border-slate-800 space-y-1 overflow-y-auto">
        <span className="text-[8px] uppercase text-slate-600 font-black">Volume_At_Price</span>
        {profile.length === 0 && <div className="text-[9px] text-slate-600">No execution volume profile available</div>}
        {highVolumeNode && <div className="text-[9px] text-indigo-300 uppercase">HVN: {Number(highVolumeNode.price).toFixed(4)} · Gaps: {lowLiquidityGaps}</div>}
        {profile.slice(-8).reverse().map((level: any) => (
          <div key={level.price} className={`grid grid-cols-4 gap-2 text-[9px] ${highVolumeNode?.price === level.price ? 'text-indigo-200 bg-indigo-500/10' : 'text-slate-400'}`}>
            <span>{Number(level.price).toFixed(4)}</span>
            <span className="text-green-500">A:{Number(level.ask_volume).toFixed(0)}</span>
            <span className="text-red-500">B:{Number(level.bid_volume).toFixed(0)}</span>
            <span className={level.delta >= 0 ? 'text-green-400' : 'text-red-400'}>Δ:{Number(level.delta).toFixed(0)}</span>
          </div>
        ))}
      </div>
    </div>
    </Panel>
  );
};
