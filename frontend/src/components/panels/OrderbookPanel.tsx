import React, { useEffect, useState } from 'react';
import { useTerminalStore } from '../../state/terminalState';
import { CinematicPanel } from '../layout/CinematicPanel';

export const OrderbookPanel: React.FC = () => {
  const { contextualFocus, setContextualFocus } = useTerminalStore();
  const [bids, setBids] = useState<any[]>([]);
  const [asks, setAsks] = useState<any[]>([]);

  // Simulation of dense realtime data for styling
  useEffect(() => {
    const mockBids = Array.from({length: 20}, (_, i) => ({
      price: 0.5420 - (i * 0.0001),
      amount: Math.random() * 1000
    }));
    const mockAsks = Array.from({length: 20}, (_, i) => ({
      price: 0.5422 + (i * 0.0001),
      amount: Math.random() * 1000
    }));
    setBids(mockBids);
    setAsks(mockAsks);
  }, []);

  return (
    <CinematicPanel
      title="Market Liquidity & Depth (L2)"
      helpTitle="L2 Orderbook Microstructure"
      helpExplanation="Visualizes the distribution of limit orders across price levels. Density clusters indicate areas of high liquidity where price movement may face friction."
      helpRelationship="Orderbook imbalance directly feeds the Z-Score_imb metric and volatility precursor detection."
    >
    <div className="flex flex-col h-full text-slate-100 font-mono text-[10px] overflow-hidden">
      <div className="flex-1 overflow-y-auto px-2">
        <div className="grid grid-cols-2 gap-x-6">
          <div className="text-red-400 space-y-0.5">
            {asks.slice(0, 15).reverse().map((a, i) => (
              <div
                key={i}
                className={`flex justify-between hover:bg-red-400/10 cursor-crosshair transition-colors ${contextualFocus.id === a.price ? 'bg-red-400/20' : ''}`}
                onMouseEnter={() => setContextualFocus('price', a.price)}
                onMouseLeave={() => setContextualFocus(null, null)}
              >
                <span>{a.price.toFixed(4)}</span>
                <span className="text-slate-500">{a.amount.toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="text-green-400 space-y-0.5">
            {bids.slice(0, 15).map((b, i) => (
              <div
                key={i}
                className={`flex justify-between hover:bg-green-400/10 cursor-crosshair transition-colors ${contextualFocus.id === b.price ? 'bg-green-400/20' : ''}`}
                onMouseEnter={() => setContextualFocus('price', b.price)}
                onMouseLeave={() => setContextualFocus(null, null)}
              >
                <span>{b.price.toFixed(4)}</span>
                <span className="text-slate-500">{b.amount.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-2 border-t border-slate-800 bg-slate-950 flex justify-between text-xs font-bold uppercase tracking-tighter">
         <span>Spread: <span className="text-cyan-400">0.0002</span></span>
         <span className="text-slate-500">Mid: 0.5421</span>
      </div>
    </div>
    </CinematicPanel>
  );
};
