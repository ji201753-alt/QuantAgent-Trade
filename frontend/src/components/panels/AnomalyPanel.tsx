import React from 'react';
import { CinematicPanel } from '../layout/CinematicPanel';

export const AnomalyPanel: React.FC = () => (
  <CinematicPanel title="Anomaly_Clusters">
    <div className="p-3 space-y-2">
      <div className="flex justify-between items-center text-[10px] font-mono">
        <span className="text-slate-500">Liquidity_Spike:</span>
        <span className="text-amber-500 font-bold">DETECTED</span>
      </div>
    </div>
  </CinematicPanel>
);
