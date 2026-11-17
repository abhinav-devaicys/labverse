import { create } from 'zustand';
import { getPathForView, parseRouteFromPath, type AppView } from '../types/navigation';
import type { SubjectSlug } from '../types/subject';

const STORAGE_KEY = 'labverse_learning_journey_v3';

interface PersistedLearning {
  savedSubjects: SubjectSlug[];
  recentSubjects: SubjectSlug[];
  subjectNotes: Partial<Record<SubjectSlug, string>>;
}

function loadPersisted(): PersistedLearning {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { savedSubjects: ['physics'], recentSubjects: [], subjectNotes: {} };
    }
    const parsed = JSON.parse(raw) as Partial<PersistedLearning>;
    return {
      savedSubjects: Array.isArray(parsed.savedSubjects) ? parsed.savedSubjects : ['physics'],
      recentSubjects: Array.isArray(parsed.recentSubjects) ? parsed.recentSubjects : [],
      subjectNotes: parsed.subjectNotes ?? {},
    };
  } catch {
    return { savedSubjects: ['physics'], recentSubjects: [], subjectNotes: {} };
  }
}

function savePersisted(data: PersistedLearning): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage access errors
  }
}

interface LearningStore {
  view: AppView;
  savedSubjects: SubjectSlug[];
  recentSubjects: SubjectSlug[];
  subjectNotes: Partial<Record<SubjectSlug, string>>;

  navigate: (view: AppView, scrollTargetId?: string) => void;
  syncFromLocation: () => void;
  toggleSavedSubject: (slug: SubjectSlug) => void;
  setSubjectNote: (slug: SubjectSlug, note: string) => void;
}

const initialPersisted =
  typeof window !== 'undefined'
    ? loadPersisted()
    : { savedSubjects: ['physics'] as SubjectSlug[], recentSubjects: [] as SubjectSlug[], subjectNotes: {} };

const initialView: AppView =
  typeof window !== 'undefined'
    ? parseRouteFromPath(window.location.pathname, window.location.hash)
    : { type: 'home' };

export const useLearningStore = create<LearningStore>((set, get) => ({
  view: initialView,
  savedSubjects: initialPersisted.savedSubjects,
  recentSubjects:
    initialView.type === 'subject' && !initialPersisted.recentSubjects.includes(initialView.slug)
      ? [initialView.slug, ...initialPersisted.recentSubjects].slice(0, 4)
      : (initialView.type === 'subject-topic' || initialView.type === 'experiment') &&
          !initialPersisted.recentSubjects.includes(initialView.subjectSlug)
        ? [initialView.subjectSlug, ...initialPersisted.recentSubjects].slice(0, 4)
        : initialPersisted.recentSubjects,
  subjectNotes: initialPersisted.subjectNotes,

  navigate: (nextView, scrollTargetId) => {
    let nextRecent = get().recentSubjects;
    const trackedSlug =
      nextView.type === 'subject'
        ? nextView.slug
        : nextView.type === 'subject-topic' || nextView.type === 'experiment'
          ? nextView.subjectSlug
          : null;

    if (trackedSlug) {
      nextRecent = [
        trackedSlug,
        ...nextRecent.filter((s) => s !== trackedSlug),
      ].slice(0, 4);
      savePersisted({
        savedSubjects: get().savedSubjects,
        recentSubjects: nextRecent,
        subjectNotes: get().subjectNotes,
      });
    }

    set({ view: nextView, recentSubjects: nextRecent });

    if (typeof window !== 'undefined') {
      const targetPath = getPathForView(nextView);
      const currentFull = `${window.location.pathname}${window.location.hash}`;
      if (currentFull !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }

      if (scrollTargetId) {
        setTimeout(() => {
          const el = document.getElementById(scrollTargetId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 70);
      } else if (nextView.type === 'subject' && nextView.highlightModuleCode) {
        setTimeout(() => {
          const el = document.getElementById(`module-${nextView.highlightModuleCode}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  },

  syncFromLocation: () => {
    if (typeof window !== 'undefined') {
      const parsed = parseRouteFromPath(window.location.pathname, window.location.hash);
      set({ view: parsed });
    }
  },

  toggleSavedSubject: (slug) => {
    const current = get().savedSubjects;
    const next = current.includes(slug)
      ? current.filter((item) => item !== slug)
      : [...current, slug];
    set({ savedSubjects: next });
    savePersisted({
      savedSubjects: next,
      recentSubjects: get().recentSubjects,
      subjectNotes: get().subjectNotes,
    });
  },

  setSubjectNote: (slug, note) => {
    const nextNotes = { ...get().subjectNotes, [slug]: note };
    set({ subjectNotes: nextNotes });
    savePersisted({
      savedSubjects: get().savedSubjects,
      recentSubjects: get().recentSubjects,
      subjectNotes: nextNotes,
    });
  },
}));
