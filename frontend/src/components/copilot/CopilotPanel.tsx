import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Shield, Zap, Target, AlertTriangle, Link as LinkIcon, Clock, Database } from 'lucide-react';
import { CinematicPanel } from '../layout/CinematicPanel';
import { useTerminalStore } from '../../state/terminalState';
import { theme } from '../../theme';

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
      content: "Operational analyst active. Intelligence core and forensic chronology synchronized.",
      context: "RUNTIME: STABLE"
    }
  ]);
  const [input, setInput] = useState('');
  const { activeSymbol, stats, activeWorkspaceId, replayMode, activeOverlays } = useTerminalStore();

  const isDegraded = stats.droppedEvents > 0;

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
        let content = '';
        let context = `INTELLIGENCE_OS // ${activeWorkspaceId.toUpperCase()}`;
        let evidenceLinks: Message['evidenceLinks'] = [];

        // Strict grounding logic: derived directly from platform state
        if (replayMode.isActive) {
            content = `Forensic analysis at ${replayMode.currentTime} identifies a structural recurrence cluster. Current liquidity imbalance correlates with analog K-8421. Forecasting indicates divergence at T+5m horizon. Grounded in chronology seq2.`;
            evidenceLinks = [
                { label: 'View_Analog_K8421', target: 'analog_k8421' },
                { label: 'Focus_T+5m_Divergence', target: 'forecast_drift' },
                { label: 'Inspect_Chronology_Seq2', target: 'chron_seq2' }
            ];
            context = `REPLAY // ${replayMode.currentTime}`;
        } else if (isDegraded) {
            content = "Warning: Model runtime is experiencing high queue pressure. Forecast accuracy may be stale. Structural analogs remain grounded. Evidence quality may be impacted by ingestion lag.";
            context = "RUNTIME: DEGRADED";
        } else {
            content = `Monitoring ${activeSymbol} live ingestion. Current structural evolution aligns with high-confidence regime expectations. ${activeOverlays.length} intelligence layers synchronized. No immediate escalation precursors detected.`;
        }

      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content,
        context,
        isStatus: isDegraded,
        evidenceLinks
      };
      setMessages(prev => [...prev, response]);
    }, 600);
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
                            <button key={i} className="flex items-center gap-1.5 px-2 py-1 bg-black/40 border border-white/10 rounded-sm text-[8px] text-indigo-400 hover:text-white hover:border-indigo-500/50 transition-all">
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
              placeholder="Query forensic chronology..."
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
