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
}));
