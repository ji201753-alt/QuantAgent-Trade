export const theme = {
  colors: {
    background: '#000000',
    panel: '#050505',
    border: '#111111',
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      muted: '#475569',
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      instability: '#ec4899',
      confidence: '#6366f1',
      uncertainty: '#94a3b8',
      pressure: '#a855f7',
      neutral: '#334155',
    },
    glow: {
      primary: 'rgba(99, 102, 241, 0.2)',
      instability: 'rgba(236, 72, 153, 0.25)',
      pressure: 'rgba(139, 92, 246, 0.2)',
    }
  },
  motion: {
    spring: {
      stiff: { type: 'spring', stiffness: 400, damping: 30 },
      default: { type: 'spring', stiffness: 200, damping: 25 },
      gentle: { type: 'spring', stiffness: 100, damping: 20 },
      slow: { type: 'spring', stiffness: 50, damping: 20 },
    },
    transitions: {
      fade: { duration: 0.3, ease: 'easeOut' },
      cinematic: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    }
  }
};
