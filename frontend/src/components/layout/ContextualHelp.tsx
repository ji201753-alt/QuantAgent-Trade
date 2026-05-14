import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { theme } from '../../theme';

interface ContextualHelpProps {
  title: string;
  explanation: string;
  relationship?: string;
  onClose: () => void;
}

export const ContextualHelp: React.FC<ContextualHelpProps> = ({
  title, explanation, relationship, onClose
}) => (
  <motion.div
    initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
    animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
    exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
    className="absolute inset-0 z-[100] bg-black/60 flex items-center justify-center p-6"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-slate-900 border border-slate-800 rounded-lg max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-black/20">
        <div className="flex items-center gap-2">
           <Info size={14} className="text-indigo-400" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Intelligence_Guidance</span>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-indigo-400 font-black uppercase text-xs tracking-tighter mb-2 italic">Understanding: {title}</h3>
          <p className="text-slate-300 text-[11px] leading-relaxed font-medium">
            {explanation}
          </p>
        </div>

        {relationship && (
          <div className="pt-4 border-t border-slate-800/50">
             <span className="text-slate-500 font-bold uppercase text-[9px] block mb-2 tracking-widest">Cross-Layer_Dependency</span>
             <p className="text-slate-400 text-[10px] italic bg-black/40 p-3 rounded border border-slate-800/30">
               {relationship}
             </p>
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-black/40 flex justify-end">
        <button
          onClick={onClose}
          className="bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded hover:bg-indigo-500 transition-all active:scale-95"
        >
          Acknowledge
        </button>
      </div>
    </motion.div>
  </motion.div>
);
