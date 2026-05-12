import React from 'react';
import { Panel } from '../layout/Panel';

export const MultiTimeframePanel: React.FC = () => {
  return (
    <Panel title="Multi-TF Intelligence">
      <div className="p-2 h-full flex flex-col font-mono text-[9px]">
        {['15s', '1m', '5m', '15m', '1h'].map(tf => (
          <div key={tf} className="flex justify-between py-1 border-b border-slate-900 last:border-0">
             <span className="text-indigo-400 font-black">{tf}</span>
             <span className="text-slate-500">Vol: 12%</span>
             <span className="text-green-500">Imb: 0.42</span>
          </div>
        ))}
      </div>
    </Panel>
  );
};
