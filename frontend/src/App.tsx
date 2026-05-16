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
import { ArbitrageSurface } from './components/panels/ArbitrageSurface';
import { DataSourcesWorkspace } from './components/panels/DataSourcesWorkspace';
import { InvestigationBuilder } from './components/panels/InvestigationBuilder';
import { RuntimeDiagnosticsPanel } from './components/panels/RuntimeDiagnosticsPanel';
import { ForecastingPanel } from './components/panels/ForecastingPanel';
import { SignalPanel } from './components/panels/SignalPanel';
import { AnomalyPanel } from './components/panels/AnomalyPanel';
import { ContextPanel } from './components/panels/ContextPanel';
import { MetaPanel } from './components/panels/MetaPanel';
import { MacroPanel } from './components/panels/MacroPanel';
import { MacroEcosystemPanel } from './components/panels/MacroEcosystemPanel';
import { DecisionPanel } from './components/panels/DecisionPanel';
import { ReasoningPanel } from './components/panels/ReasoningPanel';
import { ModelInterpretabilityPanel } from './components/panels/ModelInterpretabilityPanel';
import { OperationalCopilot } from './components/copilot/CopilotPanel';
import { InvestigativeTimeline } from './components/panels/InvestigativeTimeline';
import { InvestigationPanel } from './components/panels/InvestigationPanel';
import { HighFrequencyChart } from './components/charts/HighFrequencyChart';
import { FactorExplorer } from './components/research/FactorExplorer';
import { ComparisonWorkbench } from './components/research/ComparisonWorkbench';
import { AnalogInvestigationWorkspace } from './components/research/AnalogInvestigationWorkspace';
import { AlertTimeline } from './components/alerts/AlertTimeline';
import { ReplayControl } from './components/replay/ReplayControl';
import { Panel } from './components/layout/Panel';

const App: React.FC = () => {
  const { isConnected, activeSymbol, decisionIntelligence, operationalStressLevel, activeWorkspaceId, replayMode } = useTerminalStore();
  const [showGuidedEntry, setShowGuidedEntry] = useState(() => !localStorage.getItem('quant_onboarded'));

  const isInstabilityActive = decisionIntelligence?.confidence.is_collapsing || false;

  useEffect(() => {
    terminalWS.connect();
    return () => {};
  }, []);

  return (
    <div className={`h-screen w-screen bg-black text-slate-100 flex flex-row font-sans overflow-hidden select-none antialiased transition-all duration-1000 ${
      replayMode.isActive ? 'grayscale-[0.3] brightness-90' : ''
    } ${
      isInstabilityActive ? 'ring-inset ring-2 ring-red-500/20' : ''
    }`}>
      {/* Adaptive Environmental Surface */}
      <motion.div
        animate={{
          backgroundColor: isInstabilityActive ? `rgba(239, 68, 68, ${0.05 + operationalStressLevel * 0.1})` : '#000',
          transition: { duration: 2 }
        }}
        className="fixed inset-0 pointer-events-none z-0"
      />
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
            <ArbitrageSurface />
          </motion.div>
        )}

        {activeWorkspaceId === 'crypto' && (
          <motion.div
            key="crypto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <main className="h-full grid grid-cols-12 gap-1 p-1 bg-black">
               <div className="col-span-3 flex flex-col gap-1 overflow-hidden shadow-lg"><OrderbookPanel /></div>
               <div className="col-span-6 flex flex-col gap-1 overflow-hidden shadow-2xl">
                  <HighFrequencyChart />
               </div>
               <div className="col-span-3 flex flex-col gap-1 overflow-hidden shadow-lg">
                  <ForecastingPanel />
                  <SignalPanel />
               </div>
            </main>
          </motion.div>
        )}

        {activeWorkspaceId === 'macro' && (
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

        {activeWorkspaceId === 'replay' && (
          <motion.div
            key="replay"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <InvestigationBuilder />
          </motion.div>
        )}

        {activeWorkspaceId === 'recurrence' && (
          <motion.div
            key="recurrence"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <AnalogInvestigationWorkspace />
          </motion.div>
        )}

        {activeWorkspaceId === 'sources' && (
          <motion.div
            key="sources"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <DataSourcesWorkspace />
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
            <div className="max-w-4xl mx-auto h-full grid grid-cols-2 gap-4">
               <RuntimeDiagnosticsPanel />
               <ModelInterpretabilityPanel />
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      <footer className="h-6 bg-black border-t border-slate-900 flex items-center px-4 justify-between font-mono text-[9px] text-slate-500 uppercase z-40">
        <div className="flex gap-8 items-center font-bold">
           <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_5px_#6366f1]"></div> OPERATIONAL_V1.5</span>
           <span className="opacity-60">Database: <span className="text-green-500/80">SYNCHRONIZED_OK</span></span>
           <span className="opacity-60 text-indigo-400">EventBus: 842 msg/sec</span>
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
