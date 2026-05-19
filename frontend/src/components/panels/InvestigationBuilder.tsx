import React from 'react';
import { CinematicPanel } from '../layout/CinematicPanel';

export const InvestigationBuilder: React.FC = () => (
  <div className="h-full grid grid-cols-12 gap-1 p-1 bg-black">
    <div className="col-span-4"><CinematicPanel title="Case_Inventory" /></div>
    <div className="col-span-8"><CinematicPanel title="Forensic_Workbench" /></div>
  </div>
);
