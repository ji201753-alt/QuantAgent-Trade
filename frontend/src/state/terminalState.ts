import { create } from 'zustand';

interface TerminalState {
  isConnected: boolean;
  setConnected: (status: boolean) => void;
  activeSymbol: string;
  setActiveSymbol: (symbol: string) => void;
  workspaceLayout: any;
  setWorkspaceLayout: (layout: any) => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  isConnected: false,
  setConnected: (status) => set({ isConnected: status }),
  activeSymbol: "BTC",
  setActiveSymbol: (symbol) => set({ activeSymbol: symbol }),
  workspaceLayout: {},
  setWorkspaceLayout: (layout) => set({ workspaceLayout: layout }),
}));
