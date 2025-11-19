import { create } from 'zustand';

interface AppState {
  selectedDemo: string | null;
  theme: 'dark';
  modelDiffOpen: boolean;
  setSelectedDemo: (demo: string | null) => void;
  setModelDiffOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedDemo: null,
  theme: 'dark',
  modelDiffOpen: false,
  setSelectedDemo: (demo) => set({ selectedDemo: demo }),
  setModelDiffOpen: (open) => set({ modelDiffOpen: open }),
}));
