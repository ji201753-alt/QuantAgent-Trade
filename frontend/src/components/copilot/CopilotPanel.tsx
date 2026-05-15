import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Shield, Zap, Target } from 'lucide-react';
import { CinematicPanel } from '../layout/CinematicPanel';
import { useTerminalStore } from '../../state/terminalState';
import { theme } from '../../theme';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  context?: string;
}

export const OperationalCopilot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Operational analyst active. I have full visibility of the current microstructure, forecasting trajectory, and unified chronology.",
      context: "MODE: INVESTIGATIVE_COGNITION"
    }
  ]);
  const [input, setInput] = useState('');
  const { activeSymbol, replayMode } = useTerminalStore();

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate grounded response with enhanced context awareness
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Analyzing ${activeSymbol} structural evolution. Observed divergence in ${replayMode.isActive ? 'historical' : 'realtime'} liquidity depth matches high-confidence analog clusters. Suggested forensic path: Review volatility precursors at T-5m.`,
        context: `INTELLIGENCE_OS // ${activeSymbol} // ${replayMode.isActive ? 'REPLAY_RECONSTRUCTION' : 'LIVE_INGESTION'}`
      };
      setMessages(prev => [...prev, response]);
    }, 800);
  };

  return (
    <CinematicPanel
      title="Operational Copilot & Assistant"
      helpTitle="Forensic Reasoning Assistant"
      helpExplanation="AI-assisted investigative copilot strictly grounded in platform intelligence. Automatically synchronizes with current replay, chart, and investigation context."
    >
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
                {m.context && (
                  <span className="text-[8px] text-slate-600 font-black mb-1 uppercase tracking-widest">{m.context}</span>
                )}
                <div className={`max-w-[90%] p-3 rounded-sm border ${
                  m.role === 'assistant'
                  ? 'bg-slate-900/40 border-slate-800 text-slate-300 italic'
                  : 'bg-indigo-600 border-indigo-500 text-white font-bold'
                }`}>
                  {m.content}
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
              placeholder="Query structural intelligence..."
              className="w-full bg-slate-900/50 border border-slate-800 rounded-sm py-2 pl-3 pr-10 text-[11px] text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
            />
            <button
              onClick={handleSend}
              className="absolute right-2 text-indigo-500 hover:text-indigo-400 transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </CinematicPanel>
  );
};
