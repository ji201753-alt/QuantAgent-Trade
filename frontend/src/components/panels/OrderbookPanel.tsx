import React, { useEffect, useState } from 'react';
import { useTerminalStore } from '../../state/terminalState';
import { CinematicPanel } from '../layout/CinematicPanel';

export const OrderbookPanel: React.FC = () => {
  const { contextualFocus, setContextualFocus, marketData, marketStructure } = useTerminalStore();
  const [bids, setBids] = useState<any[]>([]);
  const [asks, setAsks] = useState<any[]>([]);

  useEffect(() => {
    const nextBids = (marketData?.orderbook?.bids || []).map((b: any) => ({ price: Number(b.price), amount: Number(b.amount) }));
    const nextAsks = (marketData?.orderbook?.asks || []).map((a: any) => ({ price: Number(a.price), amount: Number(a.amount) }));
    setBids(nextBids);
    setAsks(nextAsks);
  }, [marketData?.orderbook]);

  const latestFrame = marketStructure.activeFrame;
  const analytics = marketStructure.activeAnalytics;
  const mode = marketStructure.dataMode || (bids.length >= 5 && asks.length >= 5 ? 'PARTIAL_DEPTH_MODE' : 'LIMITED_DATA_MODE');
  const bestBid = bids[0]?.price;
  const bestAsk = asks[0]?.price;
  const spread = (bestBid !== undefined && bestAsk !== undefined) ? (bestAsk - bestBid) : null;
  const mid = (bestBid !== undefined && bestAsk !== undefined) ? (bestBid + bestAsk) / 2 : null;
  const maxDepth = Math.max(...bids.concat(asks).map((level) => level.amount), 1);

  const renderLevel = (level: any, side: 'bid' | 'ask') => {
    const width = Math.max(4, (level.amount / maxDepth) * 100);
    return (
      <div
        key={`${side}-${level.price}`}
        className={`relative flex justify-between cursor-crosshair transition-colors ${side === 'bid' ? 'hover:bg-green-400/10' : 'hover:bg-red-400/10'} ${contextualFocus.id === level.price ? (side === 'bid' ? 'bg-green-400/20' : 'bg-red-400/20') : ''}`}
        onMouseEnter={() => setContextualFocus('price', level.price, { side, amount: level.amount, mode })}
        onMouseLeave={() => setContextualFocus(null, null)}
      >
        <div className={`absolute inset-y-0 ${side === 'bid' ? 'right-0 bg-green-500/10' : 'left-0 bg-red-500/10'}`} style={{ width: `${width}%` }} />
        <span className="relative z-10">{level.price.toFixed(4)}</span>
        <span className="relative z-10 text-slate-500">{level.amount.toFixed(0)}</span>
      </div>
    );
  };

  return (
    <CinematicPanel
      title="DOM / Depth of Market"
      helpTitle="DOM Ladder"
      helpExplanation="Displays available L2 depth from the active connector. The panel explicitly reports partial/limited depth when the connector cannot provide full market-by-order visibility."
      helpRelationship="DOM imbalance feeds replayable microstructure frames, volume profile, and liquidity-zone overlays."
    >
    <div className="flex flex-col h-full text-slate-100 font-mono text-[10px] overflow-hidden">
      <div className={`px-2 py-1 border-b border-slate-900 uppercase font-black ${mode === 'LIVE_AGGREGATION_MODE' ? 'text-green-400' : 'text-amber-400'}`}>DOM_MODE: {mode}</div>
      <div className="flex-1 overflow-y-auto px-2">
        {bids.length === 0 && asks.length === 0 && (
          <div className="text-[10px] text-amber-400 uppercase py-4">No live orderbook depth available</div>
        )}
        <div className="grid grid-cols-2 gap-x-6">
          <div className="text-red-400 space-y-0.5">
            {asks.slice(0, 15).reverse().map((a) => renderLevel(a, 'ask'))}
          </div>
          <div className="text-green-400 space-y-0.5">
            {bids.slice(0, 15).map((b) => renderLevel(b, 'bid'))}
          </div>
        </div>
      </div>
      <div className="p-2 border-t border-slate-800 bg-slate-950 flex justify-between text-xs font-bold uppercase tracking-tighter">
         <span>Spread: <span className="text-cyan-400">{spread !== null ? spread.toFixed(4) : 'N/A'}</span></span>
         <span className="text-slate-500">Mid: {mid !== null ? mid.toFixed(4) : 'N/A'}</span>
         <span className={analytics.depth_contraction > 0.25 ? 'text-red-400' : 'text-slate-500'}>Depth_Migration: {analytics.depth_contraction !== undefined ? Number(analytics.depth_contraction).toFixed(2) : 'N/A'}</span>
      </div>
    </div>
    </CinematicPanel>
  );
};
