import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../theme';

interface GlowContainerProps {
  children: React.ReactNode;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export const GlowContainer: React.FC<GlowContainerProps> = ({
  children,
  color = theme.colors.semantic.confidence,
  intensity = 'medium',
  className = ''
}) => {
  const shadowOpacity = intensity === 'low' ? 0.1 : intensity === 'medium' ? 0.3 : 0.6;
  return (
    <div
      className={`relative rounded overflow-hidden ${className}`}
      style={{
        boxShadow: `0 0 25px ${color}${Math.floor(shadowOpacity * 255).toString(16).padStart(2, '0')}`,
        border: `1px solid ${color}44`
      }}
    >
      {children}
    </div>
  );
};

interface DynamicStatusProps {
  status: 'stable' | 'warning' | 'critical' | 'syncing';
  label: string;
}

export const DynamicStatus: React.FC<DynamicStatusProps> = ({ status, label }) => {
  const color = status === 'stable' ? theme.colors.semantic.success :
                status === 'warning' ? theme.colors.semantic.warning :
                status === 'critical' ? theme.colors.semantic.error :
                theme.colors.semantic.info;

  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: status === 'critical' ? 0.5 : 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
      />
      <span className="text-[9px] font-black uppercase tracking-widest" style={{ color }}>{label}</span>
    </div>
  );
};

interface SemanticLabelProps {
  children: React.ReactNode;
  type?: 'primary' | 'secondary' | 'accent' | 'instability';
  className?: string;
}

export const SemanticLabel: React.FC<SemanticLabelProps> = ({
  children,
  type = 'primary',
  className = ''
}) => {
  const color = type === 'primary' ? theme.colors.text.primary :
                type === 'secondary' ? theme.colors.text.secondary :
                type === 'accent' ? theme.colors.semantic.confidence :
                theme.colors.semantic.instability;

  return (
    <span className={`text-[9px] font-black uppercase tracking-widest ${className}`} style={{ color }}>
      {children}
    </span>
  );
};
