import React from 'react';
import { CinematicPanel } from '../layout/CinematicPanel';
import { HighFrequencyChart } from '../charts/HighFrequencyChart';
import { OrderbookPanel } from './OrderbookPanel';
import { useTerminalStore } from '../../state/terminalState';

export const PredictionMarketsWorkspace: React.FC = () => {
  const { activeSymbol } = useTerminalStore();
  return (
    <div className="h-full grid grid-cols-12 gap-1 p-1 bg-black">
      <div className="col-span-9 flex flex-col gap-1">
         <CinematicPanel title={`Intelligence_Stream: ${activeSymbol}`}>
            <HighFrequencyChart />
         </CinematicPanel>
         <div className="h-1/3"><OrderbookPanel /></div>
      </div>
      <div className="col-span-3 flex flex-col gap-1">
         <CinematicPanel title="Market_Context" />
         <CinematicPanel title="Reasoning_Briefing" />
      </div>
    </div>
  );
};
