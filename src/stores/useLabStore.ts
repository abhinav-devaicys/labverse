import { create } from 'zustand';
import { getSimulationById } from '../registry/simulationRegistry';
import type { AppRoute } from '../types/navigation';
import type { SimulationDifficulty, SubjectId } from '../types/simulation';

const STORAGE_KEY = 'labverse_workbench_v1';

interface PersistedLabData {
  savedSimulationIds: string[];
  labNotes: Record<string, string>;
}

function loadPersistedData(): PersistedLabData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        savedSimulationIds: ['pendulum-motion', 'build-an-atom'],
        labNotes: {
          'pendulum-motion':
            'Hypothesis: Doubling pendulum length L increases oscillation period T by factor √2 independent of bob mass.',
        },
      };
    }
    const parsed = JSON.parse(raw) as Partial<PersistedLabData>;
    return {
      savedSimulationIds: Array.isArray(parsed.savedSimulationIds)
        ? parsed.savedSimulationIds
        : ['pendulum-motion'],
      labNotes: parsed.labNotes && typeof parsed.labNotes === 'object' ? parsed.labNotes : {},
    };
  } catch {
    return {
      savedSimulationIds: ['pendulum-motion', 'build-an-atom'],
      labNotes: {},
    };
  }
}

function savePersistedData(data: PersistedLabData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota or private mode restrictions
  }
}

interface LabStoreState {
  activeRoute: AppRoute;
  stagedSimulationId: string;
  selectedSubject: SubjectId | 'all';
  selectedDifficulty: SimulationDifficulty | 'all';
  searchQuery: string;
  savedSimulationIds: string[];
  labNotes: Record<string, string>;
  previewParamsBySim: Record<string, Record<string, number>>;
  isLearningModalOpen: boolean;

  navigateTo: (route: AppRoute) => void;
  stageSimulation: (simulationId: string) => void;
  setSubjectFilter: (subject: SubjectId | 'all') => void;
  setDifficultyFilter: (difficulty: SimulationDifficulty | 'all') => void;
  setSearchQuery: (query: string) => void;
  toggleSavedSimulation: (simulationId: string) => void;
  updateLabNote: (simulationId: string, note: string) => void;
  setPreviewParam: (simulationId: string, key: string, value: number) => void;
  resetPreviewParams: (simulationId: string) => void;
  setLearningModalOpen: (open: boolean) => void;
}

const initialPersisted = typeof window !== 'undefined' ? loadPersistedData() : { savedSimulationIds: [], labNotes: {} };

export const useLabStore = create<LabStoreState>((set, get) => ({
  activeRoute: 'home',
  stagedSimulationId: 'pendulum-motion',
  selectedSubject: 'all',
  selectedDifficulty: 'all',
  searchQuery: '',
  savedSimulationIds: initialPersisted.savedSimulationIds,
  labNotes: initialPersisted.labNotes,
  previewParamsBySim: {},
  isLearningModalOpen: false,

  navigateTo: (route) => {
    set({ activeRoute: route });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  stageSimulation: (simulationId) => {
    const sim = getSimulationById(simulationId);
    if (!sim) return;
    const currentParams = get().previewParamsBySim[simulationId];
    if (!currentParams) {
      const defaults: Record<string, number> = {};
      sim.parameters.forEach((p) => {
        defaults[p.key] = p.defaultValue;
      });
      set((state) => ({
        stagedSimulationId: simulationId,
        activeRoute: 'simulation',
        previewParamsBySim: {
          ...state.previewParamsBySim,
          [simulationId]: defaults,
        },
      }));
    } else {
      set({ stagedSimulationId: simulationId, activeRoute: 'simulation' });
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  setSubjectFilter: (subject) => set({ selectedSubject: subject }),
  setDifficultyFilter: (difficulty) => set({ selectedDifficulty: difficulty }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleSavedSimulation: (simulationId) => {
    const existing = get().savedSimulationIds;
    const next = existing.includes(simulationId)
      ? existing.filter((id) => id !== simulationId)
      : [...existing, simulationId];
    set({ savedSimulationIds: next });
    savePersistedData({ savedSimulationIds: next, labNotes: get().labNotes });
  },

  updateLabNote: (simulationId, note) => {
    const nextNotes = { ...get().labNotes, [simulationId]: note };
    set({ labNotes: nextNotes });
    savePersistedData({ savedSimulationIds: get().savedSimulationIds, labNotes: nextNotes });
  },

  setPreviewParam: (simulationId, key, value) => {
    set((state) => ({
      previewParamsBySim: {
        ...state.previewParamsBySim,
        [simulationId]: {
          ...(state.previewParamsBySim[simulationId] ?? {}),
          [key]: value,
        },
      },
    }));
  },

  resetPreviewParams: (simulationId) => {
    const sim = getSimulationById(simulationId);
    if (!sim) return;
    const defaults: Record<string, number> = {};
    sim.parameters.forEach((p) => {
      defaults[p.key] = p.defaultValue;
    });
    set((state) => ({
      previewParamsBySim: {
        ...state.previewParamsBySim,
        [simulationId]: defaults,
      },
    }));
  },

  setLearningModalOpen: (open) => set({ isLearningModalOpen: open }),
}));
