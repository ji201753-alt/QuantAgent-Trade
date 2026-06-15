import { create } from 'zustand';


const loadSession = () => {
  try {
    return JSON.parse(localStorage.getItem('quant_session_v1') || '{}');
  } catch {
    return {};
  }
};

const restoredSession = loadSession();
const restoredWorkspaceId = restoredSession.activeWorkspaceId === 'crypto' ? 'market-structure' : restoredSession.activeWorkspaceId;

const frameTimestampMs = (frame: any) => new Date(frame?.timestamp || frame?.replay_anchor || 0).getTime();
const signalTimestampMs = (signal: any) => new Date(signal?.timestamp || signal?.frame_anchor || 0).getTime();
const initialActiveOverlays = restoredSession.activeOverlays || ['candlesticks', 'zones'];
const initialMarketData: MarketDataState = {
  orderbook: { bids: [], asks: [] },
  metrics: { imbalance: 0, volatility: 0, liquidity: 0, pressure: 0 },
  forecasts: [],
  candles: [],
  signals: [],
  anomalies: [],
  microstructureFrames: [],
  microstructureSignals: [],
  latestMicrostructure: null
};

export const deriveMarketStructureState = (marketData: MarketDataState, replayMode: any, activeOverlays: string[] = initialActiveOverlays, kronos: any = null, runtimeTelemetry: any = null): MarketStructureState => {
  const frames = marketData.microstructureFrames || [];
  const signals = marketData.microstructureSignals || [];
  const forecasts = marketData.forecasts || [];
  const replayAnchorMs = replayMode?.isActive && replayMode.currentTime ? new Date(replayMode.currentTime).getTime() : null;
  const activeFrames = replayAnchorMs === null
    ? frames
    : frames.filter((frame: any) => frameTimestampMs(frame) <= replayAnchorMs);
  const activeFrame = replayAnchorMs === null
    ? (marketData.latestMicrostructure || activeFrames[0] || null)
    : (activeFrames[0] || null);
  const activeSignals = (replayAnchorMs === null
    ? signals
    : signals.filter((signal: any) => signalTimestampMs(signal) <= replayAnchorMs))
    .slice(0, 12);
  const activeForecasts = (replayAnchorMs === null
    ? forecasts
    : forecasts.filter((forecast: any) => new Date(forecast?.timestamp || 0).getTime() <= replayAnchorMs))
    .slice(0, 12);
  const activeAnalogs = (kronos?.activeAnalogs || []).filter((analog: any) => {
    if (replayAnchorMs === null || !analog?.timestamp) return true;
    return new Date(analog.timestamp).getTime() <= replayAnchorMs;
  });
  const activeProfile = activeFrame?.volume_profile || [];
  const activeAnalytics = activeFrame?.metadata?.analytics || {};
  const primarySignal = activeSignals[0] || null;
  const overlayOrder = ['footprint', 'profile', 'zones', 'forecast', 'analogs']
    .filter((overlay) => activeOverlays.includes(overlay));
  const frameTime = activeFrame ? frameTimestampMs(activeFrame) : null;
  const isReplayAligned = replayAnchorMs === null || (frameTime !== null && frameTime <= replayAnchorMs);

  return {
    activeFrame,
    activeFrames,
    activeSignals,
    activeProfile,
    activeAnalytics,
    forecasts: {
      active: activeForecasts,
      status: runtimeTelemetry?.runtime_orchestrator?.timesfm?.status || runtimeTelemetry?.runtime_orchestrator?.diagnostics?.status || 'UNVERIFIED',
      stale: Boolean(runtimeTelemetry?.runtime_orchestrator?.timesfm?.stale_inference || runtimeTelemetry?.runtime_orchestrator?.diagnostics?.stale_inference),
      error: runtimeTelemetry?.runtime_orchestrator?.timesfm?.error || runtimeTelemetry?.runtime_orchestrator?.diagnostics?.error || null,
    },
    kronos: {
      activeAnalogs,
      status: runtimeTelemetry?.runtime_orchestrator?.kronos?.status || runtimeTelemetry?.runtime_orchestrator?.models?.Kronos || 'UNVERIFIED',
      reason: runtimeTelemetry?.runtime_orchestrator?.kronos?.reason || (activeAnalogs.length ? null : 'NO_ANALOGS_ACTIVE'),
      trajectories: activeAnalogs.map((analog: any) => analog.trajectory || []).filter((trajectory: any[]) => trajectory.length > 0),
      regimeTransitions: kronos?.divergencePoints || [],
    },
    dataMode: activeFrame?.data_mode || 'LIMITED_DATA_MODE',
    replayAnchor: replayMode?.isActive ? replayMode.currentTime : (activeFrame?.replay_anchor || activeFrame?.timestamp || null),
    isReplayAligned,
    primarySignal,
    overlayOrder,
    interpretation: {
      severity: primarySignal?.severity || (Math.abs(activeFrame?.depth_imbalance || 0) > 0.75 ? 'high' : 'normal'),
      contextId: primarySignal?.signal_type || activeFrame?.replay_anchor || activeFrame?.timestamp || null,
      source: replayMode?.isActive ? 'replay' : 'live',
      explanation: activeFrame
        ? `${activeFrame.data_mode}; delta ${Number(activeFrame.order_flow?.delta || 0).toFixed(2)}; imbalance ${Number(activeFrame.depth_imbalance || 0).toFixed(3)}`
        : 'No market-structure frame available'
    }
  };
};

export interface MarketDataState {
  orderbook: { bids: any[], asks: any[] };
  metrics: {
    imbalance: number;
    volatility: number;
    liquidity: number;
    pressure: number;
  };
  forecasts: any[];
  candles: any[];
  signals: any[];
  anomalies: any[];
  microstructureFrames: any[];
  microstructureSignals: any[];
  latestMicrostructure: any | null;
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

export interface MarketStructureState {
  activeFrame: any | null;
  activeFrames: any[];
  activeSignals: any[];
  activeProfile: any[];
  activeAnalytics: Record<string, any>;
  forecasts: { active: any[]; status: string; stale: boolean; error: string | null };
  kronos: { activeAnalogs: any[]; status: string; reason: string | null; trajectories: any[]; regimeTransitions: any[] };
  dataMode: string;
  replayAnchor: string | null;
  isReplayAligned: boolean;
  primarySignal: any | null;
  overlayOrder: string[];
  interpretation: {
    severity: string;
    contextId: string | null;
    source: 'live' | 'replay';
    explanation: string;
  };
}

interface TerminalState {
  isConnected: boolean;
  setConnected: (status: boolean) => void;
  activeSymbol: string;
  setActiveSymbol: (symbol: string) => void;

  marketData: MarketDataState;
  updateMarketData: (update: Partial<MarketDataState>) => void;
  addMicrostructureFrame: (frame: any) => void;
  addMicrostructureSignal: (signal: any) => void;
  marketStructure: MarketStructureState;

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
  setReplayMode: (active: boolean, time?: string | null) => void;
  stepReplayTime: (deltaMs: number) => void;
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
    type: 'price' | 'signal' | 'anomaly' | 'event' | 'forecast' | 'microstructure' | null;
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

  runtimeTelemetry: any | null;
  setRuntimeTelemetry: (telemetry: any) => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  isConnected: false,
  setConnected: (status) => set({ isConnected: status }),
  activeSymbol: restoredSession.activeSymbol || "BTC",
  setActiveSymbol: (symbol) => set({ activeSymbol: symbol }),

  marketData: initialMarketData,
  marketStructure: deriveMarketStructureState(initialMarketData, restoredSession.replayMode || { isActive: false, currentTime: null, speed: 1.0 }, initialActiveOverlays, null, null),
  updateMarketData: (update) => set((state) => {
    const marketData = { ...state.marketData, ...update };
    return { marketData, marketStructure: deriveMarketStructureState(marketData, state.replayMode, state.activeOverlays, state.kronos, state.runtimeTelemetry) };
  }),
  addMicrostructureFrame: (frame) => set((state) => {
    const marketData = {
      ...state.marketData,
      latestMicrostructure: frame,
      microstructureFrames: [frame, ...(state.marketData.microstructureFrames || [])].slice(0, 512)
    };
    return { marketData, marketStructure: deriveMarketStructureState(marketData, state.replayMode, state.activeOverlays, state.kronos, state.runtimeTelemetry) };
  }),
  addMicrostructureSignal: (signal) => set((state) => {
    const marketData = {
      ...state.marketData,
      microstructureSignals: [signal, ...(state.marketData.microstructureSignals || [])].slice(0, 128)
    };
    return { marketData, marketStructure: deriveMarketStructureState(marketData, state.replayMode, state.activeOverlays, state.kronos, state.runtimeTelemetry) };
  }),

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

  workspaces: [
    { id: 'prediction', name: 'Prediction Markets' },
    { id: 'market-structure', name: 'Market Structure' }
  ],
  activeWorkspaceId: restoredWorkspaceId || 'prediction',
  setWorkspace: (id) => set({ activeWorkspaceId: id }),

  stats: { latency: 0, throughput: 0, droppedEvents: 0 },
  updateStats: (update) => set((state) => ({
    stats: { ...state.stats, ...update }
  })),

  replayMode: restoredSession.replayMode || {
    isActive: false,
    currentTime: null,
    speed: 1.0,
  },
  setReplayMode: (active, time) => set((state) => {
    const replayMode = {
      ...state.replayMode,
      isActive: active,
      currentTime: active ? (time ?? state.replayMode.currentTime ?? new Date().toISOString()) : null
    };
    return { replayMode, marketStructure: deriveMarketStructureState(state.marketData, replayMode, state.activeOverlays, state.kronos, state.runtimeTelemetry) };
  }),
  stepReplayTime: (deltaMs) => set((state) => {
    const anchor = state.replayMode.currentTime ? new Date(state.replayMode.currentTime).getTime() : Date.now();
    const replayMode = { ...state.replayMode, isActive: true, currentTime: new Date(anchor + deltaMs).toISOString() };
    return { replayMode, marketStructure: deriveMarketStructureState(state.marketData, replayMode, state.activeOverlays, state.kronos, state.runtimeTelemetry) };
  }),
  setReplaySpeed: (speed) => set((state) => {
    const replayMode = { ...state.replayMode, speed };
    return { replayMode, marketStructure: deriveMarketStructureState(state.marketData, replayMode, state.activeOverlays, state.kronos, state.runtimeTelemetry) };
  }),

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

  activeOverlays: initialActiveOverlays,
  toggleOverlay: (id) => set((state) => {
    const activeOverlays = state.activeOverlays.includes(id)
      ? state.activeOverlays.filter(o => o !== id)
      : [...state.activeOverlays, id];
    return { activeOverlays, marketStructure: deriveMarketStructureState(state.marketData, state.replayMode, activeOverlays, state.kronos, state.runtimeTelemetry) };
  }),

  isCommandPaletteOpen: false,
  setCommandPalette: (open) => set({ isCommandPaletteOpen: open }),

  operationalStressLevel: 0.1,
  setOperationalStress: (level) => set({ operationalStressLevel: level }),

  connectors: {
    polymarket: { enabled: false, status: 'UNVERIFIED', latency: 0 },
    binance: { enabled: false, status: 'UNVERIFIED', latency: 0 },
    bybit: { enabled: false, status: 'UNVERIFIED', latency: 0 },
    okx: { enabled: false, status: 'UNVERIFIED', latency: 0 }
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
  setKronosSettings: (update) => set((state) => {
    const kronos = { ...state.kronos, ...update };
    return { kronos, marketStructure: deriveMarketStructureState(state.marketData, state.replayMode, state.activeOverlays, kronos, state.runtimeTelemetry) };
  }),
  setActiveAnalogs: (analogs) => set((state) => {
    const kronos = { ...state.kronos, activeAnalogs: analogs };
    return { kronos, marketStructure: deriveMarketStructureState(state.marketData, state.replayMode, state.activeOverlays, kronos, state.runtimeTelemetry) };
  }),

  activeInvestigation: restoredSession.activeInvestigation || null,
  setInvestigation: (inv) => set({ activeInvestigation: inv }),
  saveInvestigation: () => {
    const inv = get().activeInvestigation;
    if (inv) {
        const history = JSON.parse(localStorage.getItem('quant_investigations') || '[]');
        localStorage.setItem('quant_investigations', JSON.stringify([inv, ...history.filter((h: any) => h.id !== inv.id)]));
    }
  },

  runtimeTelemetry: null,
  setRuntimeTelemetry: (telemetry) => set((state) => ({
    runtimeTelemetry: telemetry,
    marketStructure: deriveMarketStructureState(state.marketData, state.replayMode, state.activeOverlays, state.kronos, telemetry)
  }))
}));
