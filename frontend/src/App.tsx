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
  const { isConnected, activeSymbol, decisionIntelligence, operationalStressLevel, activeWorkspaceId, replayMode, activeOverlays, activeInvestigation, runtimeTelemetry, marketStructure, persistSession } = useTerminalStore();
  const [showGuidedEntry, setShowGuidedEntry] = useState(() => !localStorage.getItem('quant_onboarded'));

  const isInstabilityActive = decisionIntelligence?.confidence.is_collapsing || false;

  useEffect(() => {
    persistSession();
  }, [activeSymbol, activeWorkspaceId, replayMode, activeOverlays, activeInvestigation, persistSession]);

  useEffect(() => {
    terminalWS.connect();
    const unsubscribe = terminalWS.subscribe((msg) => {
      if (msg?.type === 'system_connection') {
        useTerminalStore.getState().setConnected(msg.data?.status === 'connected');
      }
      if (msg?.type === 'ForecastingOutput' && msg?.data) {
        const state = useTerminalStore.getState();
        const prev = state.marketData.forecasts || [];
        state.updateMarketData({ forecasts: [msg.data, ...prev].slice(0, 32) });
      }
      if (msg?.type === 'OrderBookSnapshot' && msg?.data) {
        const bids = (msg.data.bids || []).map((level: any) => ({ price: level.price, amount: level.amount }));
        const asks = (msg.data.asks || []).map((level: any) => ({ price: level.price, amount: level.amount }));
        useTerminalStore.getState().updateMarketData({ orderbook: { bids, asks } });
      }
      if (msg?.type === 'MicrostructureFrame' && msg?.data) {
        useTerminalStore.getState().addMicrostructureFrame(msg.data);
      }
      if (msg?.type === 'MicrostructureSignal' && msg?.data) {
        useTerminalStore.getState().addMicrostructureSignal(msg.data);
      }
      if (msg?.type === 'OHLCV' && msg?.data) {
        const state = useTerminalStore.getState();
        const prev = state.marketData.candles || [];
        const candle = {
          time: Math.floor(new Date(msg.data.timestamp).getTime() / 1000),
          open: msg.data.open,
          high: msg.data.high,
          low: msg.data.low,
          close: msg.data.close,
        };
        state.updateMarketData({ candles: [...prev.filter((c: any) => c.time !== candle.time), candle].slice(-512) });
      }
    });
    return () => {
      unsubscribe();
      terminalWS.disconnect();
    };
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

        {activeWorkspaceId === 'market-structure' && (
          <motion.div
            key="market-structure"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <main className="h-full grid grid-cols-12 gap-1 p-1 bg-black">
               <div className="col-span-3 flex flex-col gap-1 overflow-hidden shadow-lg">
                  <div className="shrink-0 border border-indigo-500/20 bg-indigo-500/5 px-3 py-1 font-mono text-[9px] font-black uppercase tracking-widest text-indigo-300">Market_Structure_Workspace · replay-aware order-flow surface</div>
                  <OrderbookPanel /><MicrostructurePanel />
               </div>
               <div className="col-span-6 flex flex-col gap-1 overflow-hidden shadow-2xl">
                  <HighFrequencyChart />
               </div>
               <div className="col-span-3 flex flex-col gap-1 overflow-hidden shadow-lg">
                  <ForecastingPanel />
                  <AlertTimeline />
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
            <main className="h-full grid grid-cols-12 gap-1 p-1 bg-black">
              <div className="col-span-3 overflow-hidden"><ReplayControl /></div>
              <div className="col-span-5 overflow-hidden"><InvestigativeTimeline /></div>
              <div className="col-span-4 grid grid-rows-2 gap-1 overflow-hidden"><InvestigationPanel /><OperationalCopilot /></div>
            </main>
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
           <span className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div> RECOVERY_BUILD</span>
           <span className="opacity-60">Database: <span className="text-amber-400">UNVERIFIED</span></span>
           <span className="opacity-60 text-indigo-400">EventBus_Q: {runtimeTelemetry?.event_bus?.queue_depth ?? 'N/A'}</span>
        </div>
        <div className="flex gap-8 items-center">
           <span className="tracking-widest">TimesFM: <span className="text-slate-300 underline decoration-dotted decoration-slate-700">{marketStructure.forecasts.status || 'UNVERIFIED'}</span></span>
           <span className="text-amber-400 font-black tracking-widest italic tracking-tighter">Kronos_{marketStructure.kronos.status || 'UNVERIFIED'}</span>
           <span className="bg-slate-900 text-slate-400 px-2 py-0.5 rounded font-black border border-slate-700 tracking-tighter">OPERATIONAL_RECOVERY</span>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default App;
