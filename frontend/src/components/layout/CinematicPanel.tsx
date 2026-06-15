import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Maximize2 } from 'lucide-react';
import { theme } from '../../theme';
import { ContextualHelp } from './ContextualHelp';

interface CinematicPanelProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
  helpTitle?: string;
  helpExplanation?: string;
  helpRelationship?: string;
  statusColor?: string;
}

export const CinematicPanel: React.FC<CinematicPanelProps> = ({
  title, children, className = '',
  helpTitle, helpExplanation, helpRelationship,
  statusColor
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      layout
      className={`flex flex-col h-full bg-[#050505] border border-white/5 rounded-sm shadow-2xl overflow-hidden relative group transition-all duration-700 ${
        isFocused ? 'ring-1 ring-indigo-500/30' : ''
      } ${className}`}
      animate={{
        borderColor: statusColor ? `${statusColor}44` : 'rgba(255,255,255,0.05)',
        boxShadow: statusColor ? `0 0 30px ${statusColor}11` : '0 0 20px rgba(0,0,0,0.5)'
      }}
    >
      {/* Cinematic Header */}
      <div className="px-4 py-2 border-b border-white/[0.03] bg-black/40 flex justify-between items-center relative">
        <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ backgroundColor: statusColor || 'transparent' }} />

        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 group-hover:text-slate-100 transition-colors duration-500">
          {title}
        </span>

        <div className="flex items-center gap-4 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
          {helpExplanation && (
            <button
              onClick={() => setShowHelp(true)}
              className="text-slate-500 hover:text-indigo-400 transition-colors"
            >
              <HelpCircle size={13} />
            </button>
          )}
          <button
            onClick={() => setIsFocused(!isFocused)}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      {/* Content Area with Layered Depth */}
      <div className="flex-1 overflow-auto relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />

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

      {/* Interactive Bottom Accent */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-indigo-500/40 origin-left"
      />
    </motion.div>
  );
};
