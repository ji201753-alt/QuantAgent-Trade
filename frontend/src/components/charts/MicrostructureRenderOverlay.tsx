import React from 'react';
import { useTerminalStore } from '../../state/terminalState';

export const MicrostructureRenderOverlay: React.FC = () => {
  const { marketStructure } = useTerminalStore();
  const mode = marketStructure.dataMode;
  const overlayOrder = marketStructure.overlayOrder;
  const footprintFrames = marketStructure.activeFrames.slice(0, 10).reverse();
  const profile = marketStructure.activeProfile;
  const maxProfile = Math.max(...profile.map((level: any) => Number(level.total_volume || level.total || 0)), 1);
  const highVolumeNode = profile.reduce((max: any, level: any) => Number(level.total_volume || level.total || 0) > Number(max?.total_volume || max?.total || 0) ? level : max, profile[0]);

  if (!overlayOrder.includes('footprint') && !overlayOrder.includes('profile')) return null;

  return (
    <div className="absolute inset-y-8 right-3 w-64 pointer-events-none font-mono text-[8px] z-20 flex gap-2 justify-end">
      {overlayOrder.includes('footprint') && (
        <div className="w-36 self-end max-h-[55%] overflow-hidden rounded border border-slate-800 bg-black/70 backdrop-blur-sm p-2 shadow-2xl">
          <div className={`mb-2 font-black uppercase ${mode === 'LIVE_AGGREGATION_MODE' ? 'text-green-400' : 'text-amber-400'}`}>Footprint · {mode === 'LIVE_AGGREGATION_MODE' ? 'AGGREGATED_FOOTPRINT_MODE' : mode}</div>
          {footprintFrames.length === 0 && <div className="text-amber-400 uppercase">No execution frames</div>}
          <div className="space-y-1">
            {footprintFrames.map((frame: any) => {
              const delta = Number(frame.order_flow?.delta || 0);
              const cumulative = Number(frame.order_flow?.cumulative_delta || 0);
              const aggressive = Math.abs(delta) > Math.max(1, Number(frame.order_flow?.buy_volume || 0) + Number(frame.order_flow?.sell_volume || 0)) * 0.6;
              const analytics = frame.metadata?.analytics || {};
              const structureAlert = analytics.absorption_score > 0.65 || analytics.liquidity_vacuum_score > 0.6 || analytics.pressure_transition_score > 0;
              return (
                <div key={`${frame.timestamp}-${cumulative}`} className={`rounded px-1 py-0.5 ${structureAlert ? 'bg-amber-500/10 ring-1 ring-amber-500/20' : aggressive ? 'bg-cyan-500/10 ring-1 ring-cyan-500/20' : 'bg-slate-900/60'}`}>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-500">{new Date(frame.timestamp).toISOString().slice(14, 19)}</span>
                    <span className={delta >= 0 ? 'text-green-400' : 'text-red-400'}>Δ {delta.toFixed(0)}</span>
                    <span className={cumulative >= 0 ? 'text-indigo-300' : 'text-red-300'}>Σ {cumulative.toFixed(0)}</span>
                  </div>
                  <div className="mt-0.5 grid grid-cols-3 gap-1 text-[7px] text-slate-500">
                    <span>ABS {Number(analytics.absorption_score || 0).toFixed(2)}</span>
                    <span>VAC {Number(analytics.liquidity_vacuum_score || 0).toFixed(2)}</span>
                    <span>STK {frame.order_flow?.stacked_imbalance_count || 0}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {overlayOrder.includes('profile') && (
        <div className="w-28 self-stretch rounded border border-slate-800 bg-black/70 backdrop-blur-sm p-2 shadow-2xl overflow-hidden">
          <div className="mb-2 text-indigo-300 font-black uppercase">Volume_Profile</div>
          {profile.length === 0 && <div className="text-amber-400 uppercase">No VAP data</div>}
          <div className="space-y-1">
            {profile.slice(0, 18).map((level) => {
              const width = Math.max(4, (Number(level.total_volume || level.total || 0) / maxProfile) * 100);
              const isHvn = highVolumeNode && level.price === highVolumeNode.price;
              const isGap = Number(level.total_volume || level.total || 0) < maxProfile * 0.2;
              return (
                <div key={level.price} className="relative h-3 flex items-center">
                  <div className={`absolute left-0 h-2 rounded ${level.delta >= 0 ? 'bg-green-500/30' : 'bg-red-500/30'} ${isHvn ? 'ring-1 ring-indigo-400' : ''} ${isGap ? 'opacity-30' : ''}`} style={{ width: `${width}%` }} />
                  <span className={`relative z-10 ${level.classification?.includes?.('IMBALANCE') ? 'text-amber-300' : 'text-slate-400'}`}>{level.price.toFixed(4)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
