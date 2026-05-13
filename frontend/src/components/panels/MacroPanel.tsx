import React from 'react';
import { Panel } from '../layout/Panel';

export const MacroPanel: React.FC = () => {
  return (
    <Panel title="Macro-Intelligence & Cross-Domain Cognition">
      <div className="p-3 font-mono text-[10px] space-y-4 overflow-y-auto h-full">
        {/* Macro Regime Status */}
        <div className="bg-indigo-500/10 border-l-2 border-indigo-500 p-2 rounded-sm">
           <span className="text-indigo-400 font-black text-[8px] uppercase block mb-1">Global Ecosystem Regime</span>
           <span className="text-slate-100 font-bold text-sm tracking-widest italic">SYNCHRONIZED_INSTABILITY</span>
           <div className="flex gap-2 mt-1">
              {['CRYPTO', 'PRED_MKTS', 'VIX'].map(d => (
                <span key={d} className="bg-indigo-900/40 text-indigo-300 px-1 rounded text-[7px] border border-indigo-500/20">{d}</span>
              ))}
           </div>
        </div>

        {/* Structural Contagion Tracker */}
        <div className="space-y-2">
           <span className="text-slate-500 font-black uppercase text-[8px]">Active Structural Contagion</span>
           <div className="bg-red-500/5 border border-red-500/20 p-2 rounded relative group">
              <div className="flex justify-between items-center mb-1">
                 <span className="text-red-400 font-bold">VOL_CASCADE</span>
                 <span className="text-slate-600">840ms Latency</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                 <span className="bg-slate-800 px-1 rounded">POLY:TRUMP</span>
                 <span className="text-slate-600">→</span>
                 <span className="bg-slate-800 px-1 rounded">BINANCE:BTC</span>
              </div>
              <div className="h-1 w-full bg-slate-900 mt-2 rounded-full overflow-hidden">
                 <div className="h-full bg-red-500 animate-pulse" style={{ width: '75%' }} />
              </div>
           </div>
        </div>

        {/* Inter-Market Correlations */}
        <div className="border-t border-slate-800 pt-3">
           <span className="text-slate-500 font-black uppercase text-[8px] block mb-2">Lead-Lag Alignment</span>
           <div className="space-y-1">
              {[
                { pair: 'BTC / TRUMP', corr: 0.84, lag: '+12ms' },
                { pair: 'ETH / SPREAD', corr: -0.62, lag: '-4ms' }
              ].map(c => (
                <div key={c.pair} className="flex justify-between items-center bg-slate-950 p-1.5 rounded border border-slate-900 group hover:border-indigo-500/50 transition-colors">
                   <span className="text-slate-400 font-bold">{c.pair}</span>
                   <div className="flex gap-3 items-center">
                      <span className="text-indigo-400">{(c.corr * 100).toFixed(0)}%</span>
                      <span className="text-slate-600 text-[8px]">{c.lag}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </Panel>
  );
};
