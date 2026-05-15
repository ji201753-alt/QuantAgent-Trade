import React from 'react';
import { CinematicPanel } from '../layout/CinematicPanel';

export const SignalPanel: React.FC = () => (
  <CinematicPanel title="Probabilistic_Signals">
    <div className="p-3 space-y-2">
      <div className="flex justify-between items-center text-[10px] font-mono">
        <span className="text-slate-500">Direction:</span>
        <span className="text-green-400 font-bold">LONG</span>
      </div>
      <div className="flex justify-between items-center text-[10px] font-mono">
        <span className="text-slate-500">Confidence:</span>
        <span className="text-indigo-400 font-bold">0.84</span>
      </div>
    </div>
  </CinematicPanel>
);
