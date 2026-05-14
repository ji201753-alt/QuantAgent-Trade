import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { ContextualHelp } from './ContextualHelp';

interface PanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  helpTitle?: string;
  helpExplanation?: string;
  helpRelationship?: string;
}

export const Panel: React.FC<PanelProps> = ({
  title, children, className,
  helpTitle, helpExplanation, helpRelationship
}) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className={`flex flex-col h-full bg-slate-900 border border-slate-800/80 rounded shadow-2xl overflow-hidden relative ${className}`}>
      <div className="px-3 py-1.5 border-b border-slate-800 bg-black/40 flex justify-between items-center">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 drop-shadow-sm">{title}</span>
        <div className="flex items-center gap-3">
          {helpExplanation && (
            <button
              onClick={() => setShowHelp(true)}
              className="text-slate-600 hover:text-indigo-400 transition-colors"
            >
              <HelpCircle size={12} />
            </button>
          )}
          <div className="flex gap-1.5 opacity-30">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto relative">
        <AnimatePresence>
          {showHelp && (
            <ContextualHelp
              title={helpTitle || title}
              explanation={helpExplanation!}
              relationship={helpRelationship}
              onClose={() => setShowHelp(false)}
            />
          )}
        </AnimatePresence>
        {children}
      </div>
    </div>
  );
};
