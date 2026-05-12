import React from 'react';

export const FactorExplorer: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 font-mono">
       <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-indigo-400 tracking-tighter">FACTOR_EXPLORER_V1</h2>
          <div className="flex gap-2">
             <button className="px-3 py-1 bg-slate-800 text-[10px] rounded hover:bg-slate-700 transition-colors uppercase font-bold">Export Dataset</button>
             <button className="px-3 py-1 bg-indigo-600 text-[10px] rounded hover:bg-indigo-500 transition-colors uppercase font-bold">Run Correlation Study</button>
          </div>
       </div>

       <div className="grid grid-cols-3 gap-4 flex-1 overflow-hidden">
          <div className="col-span-1 border border-slate-800 rounded p-2 overflow-y-auto">
             <span className="text-[10px] text-slate-500 block mb-2 uppercase">Active Factors</span>
             <div className="space-y-1">
                {['IMBALANCE_TOB', 'LIQ_CONCENTRATION', 'VOL_REALIZED_1M', 'SPREAD_INTENSITY', 'FLOW_PRESSURE'].map(f => (
                  <div key={f} className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-800/50 hover:border-indigo-500/50 cursor-pointer group">
                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                     <span className="text-[10px] text-slate-300 group-hover:text-white transition-colors">{f}</span>
                  </div>
                ))}
             </div>
          </div>
          <div className="col-span-2 border border-slate-800 rounded bg-slate-900/30 flex flex-col relative overflow-hidden">
             <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <span className="text-4xl font-black rotate-12">RESEARCH_SANDBOX</span>
             </div>
             <div className="p-4 flex-1">
                {/* Heatmap/Scatter plot placeholder */}
                <div className="w-full h-full border border-dashed border-slate-700 rounded flex items-center justify-center">
                   <span className="text-[10px] text-slate-600 uppercase tracking-widest">Select factors to visualize correlation matrix</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
