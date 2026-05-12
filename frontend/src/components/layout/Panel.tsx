import React from 'react';

interface PanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Panel: React.FC<PanelProps> = ({ title, children, className }) => (
  <div className={`flex flex-col h-full bg-slate-900 border border-slate-800 rounded shadow-2xl overflow-hidden ${className}`}>
    <div className="px-3 py-1.5 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{title}</span>
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-slate-800"></div>
        <div className="w-2 h-2 rounded-full bg-slate-800"></div>
      </div>
    </div>
    <div className="flex-1 overflow-auto">
      {children}
    </div>
  </div>
);
