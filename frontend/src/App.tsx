import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTerminalStore } from './state/terminalState';
import { terminalWS } from './services/websocket';
import { IntelligentSidebar } from './components/layout/Sidebar';
import { DynamicStatus } from './components/layout/Common';
import { GuidedEntry } from './components/layout/GuidedEntry';
import { OrderbookPanel } from './components/panels/OrderbookPanel';
import { MicrostructurePanel } from './components/panels/MicrostructurePanel';
import { ForecastingPanel } from './components/panels/ForecastingPanel';
import { SignalPanel } from './components/panels/SignalPanel';
import { AnomalyPanel } from './components/panels/AnomalyPanel';
import { ContextPanel } from './components/panels/ContextPanel';
import { MetaPanel } from './components/panels/MetaPanel';
import { MacroPanel } from './components/panels/MacroPanel';
import { MacroEcosystemPanel } from './components/panels/MacroEcosystemPanel';
import { DecisionPanel } from './components/panels/DecisionPanel';
import { ReasoningPanel } from './components/panels/ReasoningPanel';
import { InvestigationPanel } from './components/panels/InvestigationPanel';
import { HighFrequencyChart } from './components/charts/HighFrequencyChart';
import { FactorExplorer } from './components/research/FactorExplorer';
import { ComparisonWorkbench } from './components/research/ComparisonWorkbench';
import { AlertTimeline } from './components/alerts/AlertTimeline';
import { ReplayControl } from './components/replay/ReplayControl';
import { Panel } from './components/layout/Panel';

type Workspace = 'realtime' | 'research' | 'operational' | 'macro';

const App: React.FC = () => {
  const { isConnected, activeSymbol, decisionIntelligence } = useTerminalStore();
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>('realtime');
  const [showGuidedEntry, setShowGuidedEntry] = useState(() => !localStorage.getItem('quant_onboarded'));

  const isInstabilityActive = decisionIntelligence?.confidence.is_collapsing || false;

  useEffect(() => {
    terminalWS.connect();
    return () => {};
  }, []);

  const { replayMode } = useTerminalStore();

  return (
    <div className={`h-screen w-screen bg-black text-slate-100 flex flex-row font-sans overflow-hidden select-none antialiased transition-all duration-1000 ${
      replayMode.isActive ? 'grayscale-[0.3] brightness-90' : ''
    } ${
      isInstabilityActive ? 'ring-inset ring-2 ring-red-500/20' : ''
    }`}>
      {/* Reactive Environmental Glow */}
      <AnimatePresence>
        {isInstabilityActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-red-900 pointer-events-none z-0"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showGuidedEntry && (
          <GuidedEntry onComplete={() => {
            setShowGuidedEntry(false);
            localStorage.setItem('quant_onboarded', 'true');
          }} />
        )}
      </AnimatePresence>

      <IntelligentSidebar activeWorkspace={activeWorkspace} setActiveWorkspace={setActiveWorkspace} />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-1000 ${
        replayMode.isActive ? 'blur-[0.5px]' : ''
      }`}>
      {/* Institutional Header */}
      <header className="h-10 border-b border-slate-900 bg-black flex items-center px-4 justify-between z-40">
        <div className="flex items-center gap-6 h-full">
          <div className="flex items-center gap-2 group cursor-pointer">
             <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center font-black text-[10px] text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]">Q</div>
             <span className="font-black tracking-widest text-[11px] uppercase italic text-slate-300">Intelligence_OS</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Workspace // <span className="text-indigo-400">{activeWorkspace}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex items-center gap-5">
              <DynamicStatus
                status={isConnected ? 'stable' : 'critical'}
                label={isConnected ? 'Sync_Stable' : 'Link_Severed'}
              />
              <span className="bg-slate-900/50 px-2 py-0.5 rounded border border-slate-800 font-bold tracking-widest text-[8px] italic text-indigo-400/70">CORE_REF: 8412-X</span>
           </div>
           <div className="flex gap-2 text-shadow-glow">
              <button className="bg-slate-950 border border-slate-800 hover:border-indigo-500 transition-all text-indigo-400 text-[10px] font-black px-4 py-1 rounded">
                 WORKSPACE_CFG
              </button>
              <button className="bg-white hover:bg-slate-200 text-black text-[10px] font-black px-5 py-1 rounded transition-all active:scale-95 shadow-xl shadow-white/5">
                SYSTEM_STABLE
              </button>
           </div>
        </div>
      </header>

      {/* Main Workstation Layout */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
        {activeWorkspace === 'realtime' && (
          <motion.div
            key="realtime"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
          <main className="h-full grid grid-cols-12 gap-1 p-1 bg-black">
            <div className="col-span-3 flex flex-col gap-1 overflow-hidden">
              <div className="flex-[3] overflow-hidden shadow-lg"><OrderbookPanel /></div>
              <div className="flex-[2] overflow-hidden shadow-lg"><MicrostructurePanel /></div>
            </div>
            <div className="col-span-6 flex flex-col gap-1 overflow-hidden">
               <div className="flex-[4] overflow-hidden shadow-2xl">
                 <Panel title={`INTELLIGENCE_STREAM: ${activeSymbol}/USDT - SOURCE: POLYMARKET`}>
                    <div className="w-full h-full relative">
                       <HighFrequencyChart />
                       <div className="absolute top-4 left-4 z-10 pointer-events-none bg-black/70 backdrop-blur-lg p-3 rounded border border-slate-800/50 shadow-2xl">
                          <div className="text-3xl font-black font-mono tracking-tighter text-shadow-glow">0.5422 <span className="text-green-500 text-xs font-bold tracking-normal">+0.05%</span></div>
                          <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1.5 opacity-80">POLYMARKET_CLOB: 980224_TRUMP</div>
                       </div>
                    </div>
                 </Panel>
               </div>
               <div className="flex-1 grid grid-cols-4 gap-1">
                  <div className="bg-slate-900/50 border border-slate-800/80 p-4 flex flex-col justify-between group hover:bg-indigo-950/10 transition-colors rounded">
                     <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Z-Score_imb</span>
                     <span className="text-2xl font-mono text-cyan-400 font-black text-shadow-glow">2.41</span>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800/80 p-4 flex flex-col justify-between rounded">
                     <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Vol_Regime</span>
                     <span className="text-2xl font-mono font-black tracking-tighter uppercase italic text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.3)]">Spiking</span>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800/80 p-4 flex flex-col justify-between rounded">
                     <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Entropy</span>
                     <span className="text-2xl font-mono text-blue-400 font-black">0.82</span>
                  </div>
                  <div className="bg-indigo-600/90 border border-indigo-500 p-4 flex flex-col justify-between shadow-lg rounded">
                     <span className="text-[9px] text-indigo-100 uppercase font-black tracking-widest">Signal_score</span>
                     <span className="text-2xl font-mono text-white font-black">0.68 (LONG)</span>
                  </div>
               </div>
            </div>
            <div className="col-span-3 flex flex-col gap-1 overflow-hidden">
               <div className="flex-[2] overflow-hidden shadow-lg"><ForecastingPanel /></div>
               <div className="flex-1 overflow-hidden shadow-lg"><AnomalyPanel /></div>
               <div className="flex-1 overflow-hidden shadow-lg"><SignalPanel /></div>
            </div>
          </main>
          </motion.div>
        )}

        {activeWorkspace === 'research' && (
          <motion.div
            key="research"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <ComparisonWorkbench />
          </motion.div>
        )}

        {activeWorkspace === 'operational' && (
          <motion.div
            key="operational"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
          <main className="h-full grid grid-cols-12 gap-1 p-1 bg-black text-shadow-glow">
             <div className="col-span-4 flex flex-col gap-1 overflow-hidden">
                <div className="flex-1 overflow-hidden shadow-lg"><ContextPanel /></div>
                <div className="flex-1 overflow-hidden shadow-lg"><DecisionPanel /></div>
             </div>
             <div className="col-span-4 flex flex-col gap-1 overflow-hidden">
                <div className="flex-[3] overflow-hidden shadow-lg"><ReasoningPanel /></div>
                <div className="flex-[2] overflow-hidden shadow-lg"><AlertTimeline /></div>
             </div>
             <div className="col-span-4 flex flex-col gap-1 overflow-hidden">
                <div className="h-44 overflow-hidden shadow-lg"><ReplayControl /></div>
                <div className="flex-1 overflow-hidden shadow-lg"><InvestigationPanel /></div>
                <div className="flex-1 overflow-hidden shadow-lg"><MetaPanel /></div>
             </div>
          </main>
          </motion.div>
        )}

        {activeWorkspace === 'macro' && (
          <motion.div
            key="macro"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <MacroEcosystemPanel />
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      <footer className="h-6 bg-black border-t border-slate-900 flex items-center px-4 justify-between font-mono text-[9px] text-slate-500 uppercase z-40">
        <div className="flex gap-8 items-center font-bold">
           <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_5px_#6366f1]"></div> OPERATIONAL_V1</span>
           <span className="opacity-60">Database: <span className="text-green-500/80">SYNCHRONIZED_OK</span></span>
           <span className="opacity-60 text-indigo-400">EventBus: 142 msg/sec</span>
        </div>
        <div className="flex gap-8 items-center">
           <span className="tracking-widest">Memory: <span className="text-slate-300 underline decoration-dotted decoration-slate-700">14,241 Archetypes</span></span>
           <span className="text-indigo-500 font-black animate-pulse tracking-widest italic tracking-tighter">COGNITION_COHERENT</span>
           <span className="bg-indigo-900/30 text-indigo-400 px-2 py-0.5 rounded font-black border border-indigo-500/20 tracking-tighter shadow-glow">V22.22.1</span>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default App;
