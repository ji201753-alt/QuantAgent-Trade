import { create } from 'zustand';

export interface MarketDataState {
  orderbook: { bids: any[], asks: any[] };
  metrics: {
    imbalance: number;
    volatility: number;
    liquidity: number;
    pressure: number;
  };
  forecasts: any[];
  signals: any[];
  anomalies: any[];
}

export interface MarketContext {
  symbol: string;
  timestamp: string;
  regime: {
    primary_regime: string;
    confidence: number;
    description: string;
    supporting_evidence: string[];
    is_transitional: boolean;
  };
  operational_priority: 'low' | 'medium' | 'high' | 'critical';
  situational_summary: string;
  aggregated_uncertainty: number;
  alignment_score: number;
  active_correlations: any[];
  explainability: Record<string, any>;
}

export interface HistoricalAnalog {
  current_id: string;
  analog_id: string;
  similarity_score: number;
  temporal_distance_days: number;
  description: string;
  recurrence_probability: number;
  trajectory?: any[];
}

export interface MacroRegime {
    id: string;
    timestamp: string;
    label: string;
    synchronized_domains: string[];
    instability_score: number;
    description: string;
}

export interface DecisionIntelligence {
    symbol: string;
    timestamp: string;
    consensus: {
        agreement_score: number;
        divergent_systems: string[];
        dominant_hypothesis: string;
        coherence_index: number;
    };
    confidence: {
        overall_confidence: number;
        uncertainty_topology: Record<string, number>;
        persistence_score: number;
        is_collapsing: boolean;
    };
    operational_pressure: number;
}

export interface InvestigationSession {
  id: string;
  title: string;
  replayTime: string | null;
  activeOverlays: string[];
  pinnedEvidence: string[];
  reasoningHistory: any[];
  workspaceId: string;
}

interface TerminalState {
  isConnected: boolean;
  setConnected: (status: boolean) => void;
  activeSymbol: string;
  setActiveSymbol: (symbol: string) => void;

  marketData: MarketDataState;
  updateMarketData: (update: Partial<MarketDataState>) => void;

  marketContext: MarketContext | null;
  setMarketContext: (context: MarketContext) => void;

  historicalAnalogs: HistoricalAnalog[];
  addAnalog: (analog: HistoricalAnalog) => void;

  macroRegime: MacroRegime | null;
  setMacroRegime: (regime: MacroRegime) => void;

  decisionIntelligence: DecisionIntelligence | null;
  setDecisionIntelligence: (decision: DecisionIntelligence) => void;

  workspaces: any[];
  activeWorkspaceId: string;
  setWorkspace: (id: string) => void;

  stats: {
    latency: number;
    throughput: number;
    droppedEvents: number;
  };
  updateStats: (update: Partial<TerminalState['stats']>) => void;

  replayMode: {
    isActive: boolean;
    currentTime: string | null;
    speed: number;
  };
  setReplayMode: (active: boolean, time?: string) => void;
  setReplaySpeed: (speed: number) => void;

  // Workspace Composition & Presets
  workspaceConfig: Record<string, any>;
  workspacePresets: Array<{ id: string; name: string; layout: any }>;
  saveWorkspaceLayout: (workspaceId: string, layout: any) => void;
  loadWorkspaceLayout: (workspaceId: string) => any;
  savePreset: (name: string, layout: any) => void;

  // Interactivity & Cross-Layer Linking
  highlightedPrice: number | null;
  setHighlightedPrice: (price: number | null) => void;
  hoveredSignalId: string | null;
  setHoveredSignal: (id: string | null) => void;

  // Full Session Persistence
  persistSession: () => void;

  contextSnapshots: any[];
  captureSnapshot: () => void;

  // Contextual Ripple System
  contextualFocus: {
    type: 'price' | 'signal' | 'anomaly' | 'event' | 'forecast' | null;
    id: string | number | null;
    metadata: any;
  };
  setContextualFocus: (type: any, id: any, metadata?: any) => void;

  // Unified Overlay Orchestration
  activeOverlays: string[];
  toggleOverlay: (overlayId: string) => void;

  // Command & Navigation State
  isCommandPaletteOpen: boolean;
  setCommandPalette: (open: boolean) => void;

  // Adaptive Workspace State
  operationalStressLevel: number; // 0.0 to 1.0
  setOperationalStress: (level: number) => void;

  // Multi-Domain Connectors
  connectors: Record<string, { enabled: boolean, status: string, latency: number }>;
  toggleConnector: (id: string) => void;

  // Kronos Structural Cognition State
  kronos: {
    activeAnalogs: HistoricalAnalog[];
    similarityThreshold: number;
    analogDepth: number;
    projectionDistance: number;
    structuralAlignment: number; // 0 to 1
    divergencePoints: Array<{ timestamp: string, severity: number }>;
  };
  setKronosSettings: (settings: Partial<TerminalState['kronos']>) => void;
  setActiveAnalogs: (analogs: HistoricalAnalog[]) => void;

  // Forensic Investigation Continuity
  activeInvestigation: InvestigationSession | null;
  setInvestigation: (inv: InvestigationSession | null) => void;
  saveInvestigation: () => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  isConnected: false,
  setConnected: (status) => set({ isConnected: status }),
  activeSymbol: "BTC",
  setActiveSymbol: (symbol) => set({ activeSymbol: symbol }),

  marketData: {
    orderbook: { bids: [], asks: [] },
    metrics: { imbalance: 0, volatility: 0, liquidity: 0, pressure: 0 },
    forecasts: [],
    signals: [],
    anomalies: []
  },
  updateMarketData: (update) => set((state) => ({
    marketData: { ...state.marketData, ...update }
  })),

  marketContext: null,
  setMarketContext: (context) => set({ marketContext: context }),

  historicalAnalogs: [],
  addAnalog: (analog) => set((state) => ({
    historicalAnalogs: [analog, ...state.historicalAnalogs].slice(0, 10)
  })),

  macroRegime: null,
  setMacroRegime: (regime) => set({ macroRegime: regime }),

  decisionIntelligence: null,
  setDecisionIntelligence: (decision) => set({ decisionIntelligence: decision }),

  workspaces: [{ id: 'prediction', name: 'Prediction Markets' }],
  activeWorkspaceId: 'prediction',
  setWorkspace: (id) => set({ activeWorkspaceId: id }),

  stats: { latency: 0, throughput: 0, droppedEvents: 0 },
  updateStats: (update) => set((state) => ({
    stats: { ...state.stats, ...update }
  })),

  replayMode: {
    isActive: false,
    currentTime: null,
    speed: 1.0,
  },
  setReplayMode: (active, time) => set((state) => ({
    replayMode: { ...state.replayMode, isActive: active, currentTime: time || state.replayMode.currentTime }
  })),
  setReplaySpeed: (speed) => set((state) => ({
    replayMode: { ...state.replayMode, speed }
  })),

  workspaceConfig: JSON.parse(localStorage.getItem('quant_workspaces') || '{}'),
  workspacePresets: JSON.parse(localStorage.getItem('quant_presets') || '[]'),
  saveWorkspaceLayout: (workspaceId, layout) => set((state) => {
    const newConfig = { ...state.workspaceConfig, [workspaceId]: layout };
    localStorage.setItem('quant_workspaces', JSON.stringify(newConfig));
    return { workspaceConfig: newConfig };
  }),
  loadWorkspaceLayout: (workspaceId) => (get() as any).workspaceConfig[workspaceId],
  savePreset: (name, layout) => set((state) => {
    const newPresets = [...state.workspacePresets, { id: Date.now().toString(), name, layout }];
    localStorage.setItem('quant_presets', JSON.stringify(newPresets));
    return { workspacePresets: newPresets };
  }),

  highlightedPrice: null,
  setHighlightedPrice: (price) => set({ highlightedPrice: price }),
  hoveredSignalId: null,
  setHoveredSignal: (id) => set({ hoveredSignalId: id }),

  persistSession: () => {
    const state = (get() as any);
    const payload = {
        activeSymbol: state.activeSymbol,
        activeWorkspaceId: state.activeWorkspaceId,
        replayMode: state.replayMode,
        activeOverlays: state.activeOverlays,
        activeInvestigation: state.activeInvestigation
    };
    localStorage.setItem('quant_session_v1', JSON.stringify(payload));
  },

  contextSnapshots: [],
  captureSnapshot: () => set((state) => ({
    contextSnapshots: [{
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      marketContext: state.marketContext,
      decisionIntelligence: state.decisionIntelligence,
    }, ...state.contextSnapshots].slice(0, 5)
  })),

  contextualFocus: { type: null, id: null, metadata: null },
  setContextualFocus: (type, id, metadata) => set({
    contextualFocus: { type, id, metadata: metadata || null }
  }),

  activeOverlays: ['candlesticks', 'zones'],
  toggleOverlay: (id) => set((state) => ({
    activeOverlays: state.activeOverlays.includes(id)
      ? state.activeOverlays.filter(o => o !== id)
      : [...state.activeOverlays, id]
  })),

  isCommandPaletteOpen: false,
  setCommandPalette: (open) => set({ isCommandPaletteOpen: open }),

  operationalStressLevel: 0.1,
  setOperationalStress: (level) => set({ operationalStressLevel: level }),

  connectors: {
    polymarket: { enabled: true, status: 'CONNECTED', latency: 42 },
    binance: { enabled: true, status: 'CONNECTED', latency: 12 },
    bybit: { enabled: false, status: 'IDLE', latency: 0 },
    okx: { enabled: true, status: 'CONNECTED', latency: 18 }
  },
  toggleConnector: (id) => set((state) => ({
    connectors: {
      ...state.connectors,
      [id]: { ...state.connectors[id], enabled: !state.connectors[id].enabled }
    }
  })),

  kronos: {
    activeAnalogs: [],
    similarityThreshold: 0.85,
    analogDepth: 5,
    projectionDistance: 128,
    structuralAlignment: 1.0,
    divergencePoints: []
  },
  setKronosSettings: (update) => set((state) => ({
    kronos: { ...state.kronos, ...update }
  })),
  setActiveAnalogs: (analogs) => set((state) => ({
    kronos: { ...state.kronos, activeAnalogs: analogs }
  })),

  activeInvestigation: null,
  setInvestigation: (inv) => set({ activeInvestigation: inv }),
  saveInvestigation: () => {
    const inv = get().activeInvestigation;
    if (inv) {
        const history = JSON.parse(localStorage.getItem('quant_investigations') || '[]');
        localStorage.setItem('quant_investigations', JSON.stringify([inv, ...history.filter((h: any) => h.id !== inv.id)]));
    }
  }
}));
