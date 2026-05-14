import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Target, Zap, Activity, ChevronRight } from 'lucide-react';
import { theme } from '../../theme';

const entrySteps = [
  {
    title: "Intelligence_OS",
    subtitle: "Core Initialization",
    description: "Welcome to the operational core. This workstation is a unified environment for market microstructure intelligence and situational cognition.",
    icon: Shield,
    color: theme.colors.semantic.confidence
  },
  {
    title: "Contextual_Reasoning",
    subtitle: "Beyond Signals",
    description: "We focus on regimes, instability, and structural fragility. Intelligence is grounded in quantified microstructure, not just price action.",
    icon: Activity,
    color: theme.colors.semantic.instability
  },
  {
    title: "Deterministic_Replay",
    subtitle: "Historical Fidelity",
    description: "Analyze market shocks with high-fidelity historical reconstruction. Replay state is synchronized across all analytical layers.",
    icon: Zap,
    color: theme.colors.semantic.warning
  }
];

export const GuidedEntry: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const next = () => {
    if (step < entrySteps.length - 1) {
      setStep(step + 1);
    } else {
      setIsVisible(false);
      setTimeout(onComplete, 800);
    }
  };

  if (!isVisible) return null;

  const current = entrySteps[step];
  const Icon = current.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black flex items-center justify-center p-8 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.05, y: -20 }}
        transition={theme.motion.transitions.cinematic}
        className="max-w-lg w-full text-center space-y-8 relative"
      >
        <div className="flex justify-center">
           <div
             className="w-20 h-20 rounded-2xl flex items-center justify-center relative shadow-2xl"
             style={{ backgroundColor: `${current.color}10`, border: `1px solid ${current.color}30` }}
           >
              <Icon size={40} style={{ color: current.color }} />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl"
                style={{ boxShadow: `0 0 30px ${current.color}40` }}
              />
           </div>
        </div>

        <div className="space-y-4">
           <div className="space-y-1">
              <span className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">{current.subtitle}</span>
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">{current.title}</h2>
           </div>
           <p className="text-slate-400 text-sm leading-relaxed font-medium px-4">
              {current.description}
           </p>
        </div>

        <div className="pt-8 flex flex-col items-center gap-6">
           <button
             onClick={next}
             className="group flex items-center gap-3 bg-white text-black px-8 py-3 rounded-sm font-black uppercase text-xs tracking-widest hover:bg-indigo-500 hover:text-white transition-all active:scale-95 shadow-xl"
           >
              Proceed <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
           </button>

           <div className="flex gap-2">
              {entrySteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-800'}`}
                />
              ))}
           </div>
        </div>
      </motion.div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-10 opacity-30">
         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Institutional_Grade</span>
         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Local_Execution</span>
         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Zero_Trust</span>
      </div>
    </motion.div>
  );
};
