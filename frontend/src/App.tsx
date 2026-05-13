import React, { useEffect, useState } from 'react';
import { useTerminalStore } from './state/terminalState';
import { terminalWS } from './services/websocket';
import { OrderbookPanel } from './components/panels/OrderbookPanel';
import { MicrostructurePanel } from './components/panels/MicrostructurePanel';
import { ForecastingPanel } from './components/panels/ForecastingPanel';
import { SignalPanel } from './components/panels/SignalPanel';
import { AnomalyPanel } from './components/panels/AnomalyPanel';
import { ContextPanel } from './components/panels/ContextPanel';
import { MetaPanel } from './components/panels/MetaPanel';
import { MacroPanel } from './components/panels/MacroPanel';
import { DecisionPanel } from './components/panels/DecisionPanel';
import { ReasoningPanel } from './components/panels/ReasoningPanel';
import { HighFrequencyChart } from './components/charts/HighFrequencyChart';
import { FactorExplorer } from './components/research/FactorExplorer';
import { AlertTimeline } from './components/alerts/AlertTimeline';
import { ReplayControl } from './components/replay/ReplayControl';
import { Panel } from './components/layout/Panel';

type Workspace = 'realtime' | 'research' | 'operational' | 'macro';

const App: React.FC = () => {
  const { isConnected, activeSymbol } = useTerminalStore();
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>('realtime');

  useEffect(() => {
    terminalWS.connect();
    return () => {};
  }, []);

  return (
    <div className="h-screen w-screen bg-black text-slate-100 flex flex-col font-sans overflow-hidden select-none">
      <header className="h-10 border-b border-slate-800 bg-slate-900/50 flex items-center px-4 justify-between z-50 shadow-2xl">
        <div className="flex items-center gap-8 h-full">
          <div className="flex items-center gap-2 group cursor-pointer">
             <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center font-black text-xs text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] group-hover:scale-110 transition-transform">Q</div>
             <span className="font-black tracking-tighter text-sm uppercase italic text-shadow-glow">QuantCore</span>
          </div>
          <nav className="flex gap-1 h-full pt-1">
             {(['realtime', 'research', 'operational', 'macro'] as Workspace[]).map(ws => (
               <button
                  key={ws}
                  onClick={() => setActiveWorkspace(ws)}
                  className={`px-4 text-[10px] uppercase font-black transition-all border-b-2 ${activeWorkspace === ws ? 'text-indigo-400 border-indigo-500 bg-indigo-500/5' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
               >
                  {ws}
               </button>
             ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex items-center gap-4 text-[9px] font-mono text-slate-500 uppercase">
              <span className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'} animate-pulse` } />
                {isConnected ? 'Sync_OK' : 'Sync_Error'}
              </span>
              <span className="bg-slate-800/40 px-2 py-0.5 rounded border border-slate-700 font-bold tracking-widest text-[8px] italic">OPERATIONAL_STABLE</span>
           </div>
           <div className="flex gap-2 text-shadow-glow">
              <button className="bg-slate-950 border border-slate-800 hover:border-indigo-500 transition-all text-indigo-400 text-[10px] font-black px-4 py-1 rounded">
                 BRIEFING_AI
              </button>
              <button className="bg-white hover:bg-slate-200 text-black text-[10px] font-black px-4 py-1 rounded transition-all active:scale-95 shadow-lg shadow-white/5">
                SYSTEM_STABLE
              </button>
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        {activeWorkspace === 'realtime' && (
          <main className="h-full grid grid-cols-12 gap-0.5 p-0.5 bg-slate-900/10">
            <div className="col-span-3 flex flex-col gap-0.5 overflow-hidden">
              <div className="flex-[3] overflow-hidden"><OrderbookPanel /></div>
              <div className="flex-[2] overflow-hidden"><MicrostructurePanel /></div>
            </div>
            <div className="col-span-6 flex flex-col gap-0.5 overflow-hidden">
               <div className="flex-[4] overflow-hidden">
                 <Panel title={`Live Feed: ${activeSymbol}/USDT - POLYMARKET_L2`}>
                    <div className="w-full h-full relative">
                       <HighFrequencyChart />
                       <div className="absolute top-4 left-4 z-10 pointer-events-none bg-black/60 backdrop-blur-md p-2 rounded border border-slate-800/50">
                          <div className="text-3xl font-black font-mono tracking-tighter">0.5422 <span className="text-green-500 text-xs font-bold">+0.05%</span></div>
                          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Instrument: 980224_TRUMP_WIN</div>
                       </div>
                    </div>
                 </Panel>
               </div>
               <div className="flex-1 grid grid-cols-4 gap-0.5">
                  <div className="bg-slate-950 border border-slate-800 p-3 flex flex-col justify-between group hover:border-indigo-500/50 transition-colors">
                     <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Z-Score_imb</span>
                     <span className="text-2xl font-mono text-cyan-400 font-black">2.41</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3 flex flex-col justify-between text-amber-500 border-l-2 border-l-amber-500/50">
                     <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Volatility</span>
                     <span className="text-2xl font-mono font-black tracking-tighter uppercase italic">Spiking</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3 flex flex-col justify-between">
                     <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Entropy</span>
                     <span className="text-2xl font-mono text-blue-400 font-black">0.82</span>
                  </div>
                  <div className="bg-indigo-600 p-3 flex flex-col justify-between shadow-[inset_0_0_40px_rgba(0,0,0,0.4)]">
                     <span className="text-[9px] text-indigo-100 uppercase font-bold tracking-widest font-black">Signal_score</span>
                     <span className="text-2xl font-mono text-white font-black">0.68 (LONG)</span>
                  </div>
               </div>
            </div>
            <div className="col-span-3 flex flex-col gap-0.5 overflow-hidden">
               <div className="flex-[2] overflow-hidden"><ForecastingPanel /></div>
               <div className="flex-1 overflow-hidden"><AnomalyPanel /></div>
               <div className="flex-1 overflow-hidden"><SignalPanel /></div>
            </div>
          </main>
        )}
        {activeWorkspace === 'research' && (
          <main className="h-full p-1 bg-slate-950">
            <FactorExplorer />
          </main>
        )}
        {activeWorkspace === 'operational' && (
          <main className="h-full grid grid-cols-12 gap-0.5 p-0.5 bg-slate-900/10 text-shadow-glow">
             <div className="col-span-4 flex flex-col gap-0.5 overflow-hidden">
                <div className="flex-1 overflow-hidden"><ContextPanel /></div>
                <div className="flex-1 overflow-hidden"><DecisionPanel /></div>
             </div>
             <div className="col-span-4 flex flex-col gap-0.5 overflow-hidden">
                <div className="flex-[3] overflow-hidden"><ReasoningPanel /></div>
                <div className="flex-[2] overflow-hidden"><AlertTimeline /></div>
             </div>
             <div className="col-span-4 flex flex-col gap-0.5 overflow-hidden">
                <div className="h-40 overflow-hidden"><ReplayControl /></div>
                <div className="flex-[2] overflow-hidden"><MetaPanel /></div>
                <div className="flex-1 overflow-hidden">
                   <Panel title="Situational Awareness & Intelligence">
                      <div className="p-3 space-y-4 font-mono text-[10px] uppercase text-shadow-glow">
                         <div className="bg-slate-900/50 p-2 border border-slate-800 rounded group hover:border-indigo-500/50 transition-colors">
                            <span className="text-slate-500 block mb-1 font-black">Regime Persistence</span>
                            <div className="flex items-center justify-between">
                               <span className="text-indigo-400 font-black text-sm tracking-widest italic">STABLE_CONSOLIDATION</span>
                               <span className="text-slate-500">92m</span>
                            </div>
                         </div>
                         <div className="bg-slate-900/50 p-2 border border-slate-800 rounded group hover:border-amber-500/50 transition-colors">
                            <span className="text-slate-500 block mb-1 font-black">Cognitive Load Index</span>
                            <div className="text-amber-500 font-bold text-lg font-black tracking-tighter uppercase italic">MODERATE (0.42)</div>
                         </div>
                      </div>
                   </Panel>
                </div>
             </div>
          </main>
        )}
        {activeWorkspace === 'macro' && (
          <main className="h-full grid grid-cols-12 gap-0.5 p-0.5 bg-slate-900/10">
             <div className="col-span-4 overflow-hidden"><MacroPanel /></div>
             <div className="col-span-8 overflow-hidden relative group">
                <Panel title="Ecosystem Structural Propagation Map">
                   <div className="w-full h-full bg-slate-950 flex items-center justify-center p-10 relative">
                      <div className="relative w-96 h-96 border border-slate-900 rounded-full border-dashed animate-spin-slow opacity-20" />
                      <div className="absolute flex flex-col items-center">
                         <span className="text-indigo-500 font-black text-xs uppercase tracking-widest animate-pulse drop-shadow-glow">Synchronizing Ecosystem Intelligence...</span>
                         <span className="text-slate-700 text-[9px] mt-2 font-mono font-bold tracking-tighter uppercase">CROSS_DOMAIN_COGNITION: ACTIVE</span>
                      </div>
                      <div className="absolute top-20 left-40 w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-[9px] font-black shadow-glow">POLY</div>
                      <div className="absolute bottom-20 right-40 w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[9px] font-black shadow-glow">BINANCE</div>
                      <div className="absolute top-40 right-20 w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-[9px] font-black shadow-glow text-shadow-glow">VIX</div>
                   </div>
                </Panel>
             </div>
          </main>
        )}
      </div>

      <footer className="h-6 bg-slate-950 border-t border-slate-800 flex items-center px-4 justify-between font-mono text-[9px] text-slate-500 uppercase z-50">
        <div className="flex gap-6 items-center">
           <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_#6366f1]"></div> CORE: V2.8-OPERATIONAL</span>
           <span>Database: <span className="text-green-500/70 uppercase font-black tracking-widest">Consistency_Verified</span></span>
           <span>EventBus: <span className="text-slate-300">142 msg/sec</span></span>
        </div>
        <div className="flex gap-6 items-center">
           <span>Memory_Index: <span className="text-slate-300 underline decoration-dotted decoration-slate-700 font-bold tracking-tighter">12,842 Scenarios</span></span>
           <span className="text-indigo-500 font-black animate-pulse tracking-widest italic">CONSOLIDATION_ACTIVE</span>
           <span className="bg-indigo-900/20 text-indigo-400 px-2 rounded font-black border border-indigo-500/20 tracking-tighter">NODE_V22.22.1</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
