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

  // Workspace Persistence
  workspaceConfig: Record<string, any>;
  saveWorkspaceLayout: (workspaceId: string, layout: any) => void;
  loadWorkspaceLayout: (workspaceId: string) => any;

  // Interactivity & Cross-Layer Linking
  highlightedPrice: number | null;
  setHighlightedPrice: (price: number | null) => void;
  hoveredSignalId: string | null;
  setHoveredSignal: (id: string | null) => void;

  contextSnapshots: any[];
  captureSnapshot: () => void;

  // Contextual Ripple System
  contextualFocus: {
    type: 'price' | 'signal' | 'anomaly' | 'event' | null;
    id: string | number | null;
    metadata: any;
  };
  setContextualFocus: (type: any, id: any, metadata?: any) => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
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

  workspaces: [{ id: 'default', name: 'Realtime Monitor' }],
  activeWorkspaceId: 'default',
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
  saveWorkspaceLayout: (workspaceId, layout) => set((state) => {
    const newConfig = { ...state.workspaceConfig, [workspaceId]: layout };
    localStorage.setItem('quant_workspaces', JSON.stringify(newConfig));
    return { workspaceConfig: newConfig };
  }),
  loadWorkspaceLayout: (workspaceId) => (get() as any).workspaceConfig[workspaceId],

  highlightedPrice: null,
  setHighlightedPrice: (price) => set({ highlightedPrice: price }),
  hoveredSignalId: null,
  setHoveredSignal: (id) => set({ hoveredSignalId: id }),

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
}));
