import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTerminalStore } from './state/terminalState';
import { terminalWS } from './services/websocket';
import { OperationalRail } from './components/layout/OperationalRail';
import { CommandHeader } from './components/layout/CommandHeader';
import { DynamicStatus } from './components/layout/Common';
import { GuidedEntry } from './components/layout/GuidedEntry';
import { CommandPalette } from './components/layout/CommandPalette';
import { OrderbookPanel } from './components/panels/OrderbookPanel';
import { MicrostructurePanel } from './components/panels/MicrostructurePanel';
import { PredictionMarketsWorkspace } from './components/panels/PredictionMarketsWorkspace';
import { ArbitrageMonitorWorkspace } from './components/panels/ArbitrageMonitorWorkspace';
import { ForecastingPanel } from './components/panels/ForecastingPanel';
import { SignalPanel } from './components/panels/SignalPanel';
import { AnomalyPanel } from './components/panels/AnomalyPanel';
import { ContextPanel } from './components/panels/ContextPanel';
import { MetaPanel } from './components/panels/MetaPanel';
import { MacroPanel } from './components/panels/MacroPanel';
import { MacroEcosystemPanel } from './components/panels/MacroEcosystemPanel';
import { RuntimeDiagnosticsPanel } from './components/panels/RuntimeDiagnosticsPanel';
import { DecisionPanel } from './components/panels/DecisionPanel';
import { ReasoningPanel } from './components/panels/ReasoningPanel';
import { OperationalCopilot } from './components/copilot/CopilotPanel';
import { InvestigationPanel } from './components/panels/InvestigationPanel';
import { HighFrequencyChart } from './components/charts/HighFrequencyChart';
import { FactorExplorer } from './components/research/FactorExplorer';
import { ComparisonWorkbench } from './components/research/ComparisonWorkbench';
import { AnalogInvestigationWorkspace } from './components/research/AnalogInvestigationWorkspace';
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

      <CommandPalette />

      <OperationalRail />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-1000 ${
        replayMode.isActive ? 'blur-[0.5px]' : ''
      }`}>
        <CommandHeader />

      {/* Main Workstation Layout */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
        {activeWorkspaceId === 'prediction' && (
          <motion.div
            key="prediction"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <PredictionMarketsWorkspace />
          </motion.div>
        )}

        {activeWorkspaceId === 'arbitrage' && (
          <motion.div
            key="arbitrage"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <ArbitrageMonitorWorkspace />
          </motion.div>
        )}

        {activeWorkspaceId === 'diagnostics' && (
          <motion.div
            key="diagnostics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full p-4"
          >
            <div className="max-w-xl mx-auto h-full">
               <RuntimeDiagnosticsPanel />
            </div>
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
            <AnalogInvestigationWorkspace />
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
                <div className="flex-[3] overflow-hidden shadow-lg"><OperationalCopilot /></div>
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
