import React from 'react';

const MetricRow: React.FC<{ label: string; value: string | number; color: string; percent?: number }> = ({ label, value, color, percent }) => (
  <div className="group">
    <div className="flex justify-between items-baseline mb-1">
      <span className="text-slate-500 text-[9px] uppercase tracking-tighter">{label}</span>
      <span className={`text-xs font-bold ${color}`}>{value}</span>
    </div>
    {percent !== undefined && (
      <div className="h-1.5 bg-slate-800 rounded-sm relative overflow-hidden">
        <div className={`h-full ${color} opacity-60`} style={{ width: `${percent}%` }}></div>
      </div>
    )}
  </div>
);

export const MicrostructurePanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full text-slate-100 font-mono overflow-hidden p-3 space-y-4">
      <MetricRow label="Bid/Ask Imbalance" value="0.42" color="text-green-500" percent={71} />
      <div className="grid grid-cols-2 gap-4">
        <MetricRow label="Realized Vol" value="14.2%" color="text-amber-400" />
        <MetricRow label="Liquidity Conc" value="0.88" color="text-blue-400" />
      </div>
      <div className="pt-2 border-t border-slate-800">
        <MetricRow label="Market Pressure" value="+0.12" color="text-indigo-400" percent={56} />
      </div>
    </div>
  );
};
