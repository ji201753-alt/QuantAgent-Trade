import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertTriangle, Database } from 'lucide-react';
import { CinematicPanel } from '../layout/CinematicPanel';
import { useTerminalStore } from '../../state/terminalState';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  context?: string;
  isStatus?: boolean;
  evidenceLinks?: Array<{ label: string, target: string }>;
}

export const OperationalCopilot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Operational analyst active. Responses are grounded only in current workstation state and will report unavailable evidence explicitly.',
      context: 'RUNTIME: GROUNDED'
    }
  ]);
  const [input, setInput] = useState('');
  const {
    activeSymbol,
    stats,
    activeWorkspaceId,
    replayMode,
    activeOverlays,
    marketData,
    marketStructure,
    runtimeTelemetry,
    kronos,
    setWorkspace,
    setContextualFocus,
  } = useTerminalStore();

  const isDegraded = stats.droppedEvents > 0 || runtimeTelemetry?.runtime_orchestrator?.diagnostics?.stale_inference;

  const followEvidence = (target: string) => {
    if (target === 'forecast') {
      setWorkspace('market-structure');
      setContextualFocus('forecast', marketStructure.forecasts.active[0]?.horizon || 'latest', marketStructure.forecasts.active[0] || marketStructure.forecasts);
    }
    if (target === 'microstructure') {
      setWorkspace('market-structure');
      setContextualFocus('microstructure', marketStructure.interpretation.contextId || 'microstructure', marketStructure.activeFrame || marketStructure.primarySignal);
    }
    if (target === 'kronos') {
      setWorkspace('recurrence');
      setContextualFocus('event', marketStructure.kronos.activeAnalogs[0]?.analog_id || 'kronos', marketStructure.kronos.activeAnalogs[0] || marketStructure.kronos);
    }
    if (target === 'replay') {
      setWorkspace('replay');
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const latestForecast = marketStructure.forecasts.active[0];
    const latestFrame = marketStructure.activeFrame;
    const latestStructureSignal = marketStructure.primarySignal;
    const modelStatus = marketStructure.forecasts.status || runtimeTelemetry?.runtime_orchestrator?.diagnostics?.status || 'UNVERIFIED';
    const kronosStatus = marketStructure.kronos.status;
    const context = replayMode.isActive ? `REPLAY // ${replayMode.currentTime}` : `LIVE // ${activeWorkspaceId.toUpperCase()}`;
    const content = [
      `Symbol ${activeSymbol}; overlays active: ${activeOverlays.join(', ') || 'none'}.`,
      `TimesFM state: ${modelStatus}${latestForecast ? `; latest ${latestForecast.horizon} forecast ${Number(latestForecast.prediction).toFixed(4)}` : '; no runtime forecast available'}.`,
      latestFrame ? `Microstructure ${latestFrame.data_mode}; delta ${Number(latestFrame.order_flow?.delta || 0).toFixed(2)}, imbalance ${Number(latestFrame.depth_imbalance || 0).toFixed(3)}${latestStructureSignal ? `; latest structure event ${latestStructureSignal.signal_type} (${Number(latestStructureSignal.value || 0).toFixed(2)})` : ''}.` : 'No replayable microstructure frame available yet.',
      marketStructure.kronos.activeAnalogs.length ? `Kronos ${kronosStatus}; active analogs ${marketStructure.kronos.activeAnalogs.length}.` : `Kronos ${kronosStatus}; ${marketStructure.kronos.reason || 'no active analog evidence available'}.`,
      replayMode.isActive ? 'Replay mode is active; inspect chronology and evidence before returning to live.' : 'Live mode active; use alerts or timeline events to anchor replay when investigating.',
    ].join(' ');

    const evidenceLinks: Message['evidenceLinks'] = [
      { label: 'Forecast', target: 'forecast' },
      { label: 'Microstructure', target: 'microstructure' },
      { label: 'Kronos', target: 'kronos' },
      { label: 'Replay', target: 'replay' },
    ];

    const response: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content,
      context,
      isStatus: isDegraded,
      evidenceLinks
    };
    setMessages(prev => [...prev, response]);
  };

  return (
    <CinematicPanel title="Operational Copilot & Assistant">
      <div className="flex flex-col h-full bg-[#030303]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-[11px]">
          <AnimatePresence initial={false}>
            {messages.map(m => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                   {m.isStatus && <AlertTriangle size={10} className="text-red-500" />}
                   <span className={`text-[8px] font-black uppercase tracking-widest ${m.isStatus ? 'text-red-500' : 'text-slate-600'}`}>{m.context}</span>
                </div>
                <div className={`max-w-[90%] p-3 rounded-sm border ${
                  m.role === 'assistant'
                  ? `bg-slate-900/40 ${m.isStatus ? 'border-red-900/50' : 'border-slate-800'} text-slate-300 italic`
                  : 'bg-indigo-600 border-indigo-500 text-white font-bold'
                }`}>
                  {m.content}

                  {m.evidenceLinks && m.evidenceLinks.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-white/5">
                        {m.evidenceLinks.map((link, i) => (
                            <button key={i} onClick={() => followEvidence(link.target)} className="flex items-center gap-1.5 px-2 py-1 bg-black/40 border border-white/10 rounded-sm text-[8px] text-indigo-400 hover:text-white hover:border-indigo-500/50 transition-all">
                                <Database size={10} /> {link.label}
                            </button>
                        ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="p-3 border-t border-white/5 bg-black/40">
          <div className="relative flex items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query grounded workstation state..."
              className="w-full bg-slate-900/50 border border-slate-800 rounded-sm py-2 pl-3 pr-10 text-[11px] text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
            />
            <button onClick={handleSend} className="absolute right-2 text-indigo-500 hover:text-indigo-400">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </CinematicPanel>
  );
};
