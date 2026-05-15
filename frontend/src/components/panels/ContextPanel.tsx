import React from 'react';
import { CinematicPanel } from '../layout/CinematicPanel';

export const ContextPanel: React.FC = () => (
  <CinematicPanel title="Situational_Context">
    <div className="p-3 text-[10px] text-slate-400 italic">
      "Regime stability remains within expected volatility corridors."
    </div>
  </CinematicPanel>
);
