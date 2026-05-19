import React from 'react';
import { CinematicPanel } from '../layout/CinematicPanel';

export const SignalPanel: React.FC = () => (
  <CinematicPanel title="Probabilistic_Signals">
    <div className="p-4 space-y-2">
       <div className="flex justify-between items-center text-[10px] font-bold">
          <span className="text-slate-500">Direction:</span>
          <span className="text-green-500">LONG</span>
       </div>
    </div>
  </CinematicPanel>
);
