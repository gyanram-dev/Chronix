import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const MODE_CONFIG = {
  pomodoro: { label: 'Pomodoro', defaultMinutes: 25 },
  'deep-work': { label: 'Deep Work', defaultMinutes: 90 },
  'short-break': { label: 'Short Break', defaultMinutes: 5 },
  'long-break': { label: 'Long Break', defaultMinutes: 15 },
};

const SESSION_CATEGORIES = [
  { id: 'dsa', name: 'DSA' },
  { id: 'semester', name: 'Semester Study' },
  { id: 'projects', name: 'Project Building' },
  { id: 'extra', name: 'Extra Learning' },
];

export { SESSION_CATEGORIES };

export const useFocusStore = create(
  persist(
    (set, get) => ({
      mode: 'pomodoro',
      status: 'idle',
      timeRemaining: 25 * 60,
      duration: 25 * 60,
      category: null,
      sessions: [],
      currentSession: null,

      setMode: (mode, durationSeconds) => set({
        mode,
        status: 'idle',
        timeRemaining: durationSeconds,
        duration: durationSeconds,
        currentSession: null,
      }),

      setCategory: (category) => set({ category }),

      start: () => {
        if (get().status !== 'idle') return;
        set({
          status: 'running',
          currentSession: {
            startTime: new Date().toISOString(),
            mode: get().mode,
            category: get().category,
          },
        });
      },

      pause: () => {
        if (get().status !== 'running') return;
        set({ status: 'paused' });
      },

      resume: () => {
        if (get().status !== 'paused') return;
        set({ status: 'running' });
      },

      tick: () => {
        if (get().status !== 'running') return;
        const next = get().timeRemaining - 1;
        if (next <= 0) {
          get().completeSession();
        } else {
          set({ timeRemaining: next });
        }
      },

      completeSession: () => {
        const state = get();
        const session = {
          id: crypto.randomUUID(),
          startTime: state.currentSession?.startTime || new Date().toISOString(),
          endTime: new Date().toISOString(),
          mode: state.mode,
          category: state.category,
          durationSeconds: state.duration - state.timeRemaining,
        };
        set((s) => ({
          status: 'idle',
          timeRemaining: s.duration,
          duration: s.duration,
          currentSession: null,
          sessions: [session, ...s.sessions].slice(0, 200),
        }));
        return session;
      },

      reset: () => {
        const state = get();
        set({
          status: 'idle',
          timeRemaining: state.duration,
          duration: state.duration,
          currentSession: null,
        });
      },
    }),
    {
      name: 'chronix-focus',
      partialize: (state) => ({
        sessions: state.sessions,
        mode: state.mode,
        category: state.category,
      }),
    }
  )
);
