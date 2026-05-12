import React from 'react';

const ForecastHorizon: React.FC<{ horizon: string; value: number; uncertainty: number }> = ({ horizon, value, uncertainty }) => (
  <div className="flex flex-col border-l-2 border-indigo-500 pl-3 bg-indigo-500/5 py-2 mb-2 group hover:bg-indigo-500/10 transition-colors">
    <div className="flex justify-between items-center mb-1">
      <span className="text-indigo-400 font-bold text-[10px] tracking-widest">{horizon}</span>
      <span className="text-[9px] text-slate-500 uppercase tracking-tighter">Probabilistic Output</span>
    </div>
    <div className="flex justify-between items-baseline mb-2">
      <span className="text-sm font-bold text-slate-200">{value.toFixed(4)}</span>
      <span className="text-[10px] text-slate-400">σ: {uncertainty.toFixed(3)}</span>
    </div>
    {/* Visual distribution confidence interval */}
    <div className="relative h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
      <div
        className="absolute h-full bg-indigo-500/40 rounded-full"
        style={{ left: '20%', right: '20%' }}
      ></div>
      <div
        className="absolute h-full w-0.5 bg-white shadow-[0_0_8px_white] left-1/2 -ml-px"
      ></div>
    </div>
  </div>
);

export const ForecastingPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full text-slate-100 font-mono text-xs overflow-hidden p-2">
      <div className="text-slate-500 mb-3 italic text-[9px] uppercase tracking-tighter">Realtime multi-horizon TimesFM inference</div>
      <div className="space-y-1">
        <ForecastHorizon horizon="T+1m" value={0.5422} uncertainty={0.012} />
        <ForecastHorizon horizon="T+5m" value={0.5435} uncertainty={0.028} />
        <ForecastHorizon horizon="T+15m" value={0.5410} uncertainty={0.045} />
      </div>
      <div className="mt-auto pt-2 border-t border-slate-800 flex justify-between text-[9px] text-slate-600">
         <span>CONTEXT_LEN: 512</span>
         <span>INFERENCE_OK</span>
      </div>
    </div>
  );
};
