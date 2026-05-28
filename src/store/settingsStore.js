import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  appearance: {
    darkMode: true,
    accentColor: 'blue',
    compactMode: false,
  },
  productivity: {
    dailyTargetHours: 4,
    pomodoroDuration: 25,
    autoReset: false,
  },
  academic: {
    currentSemester: null,
    defaultCategory: 'all',
    autoFocusWeak: true,
  },
  notifications: {
    studyReminder: false,
    plannerReminder: false,
  },
};

export const useSettingsStore = create(
  persist(
    (set) => ({
      ...initialState,

      updateAppearance: (patch) => set((s) => ({
        appearance: { ...s.appearance, ...patch },
      })),

      updateProductivity: (patch) => set((s) => ({
        productivity: { ...s.productivity, ...patch },
      })),

      updateAcademic: (patch) => set((s) => ({
        academic: { ...s.academic, ...patch },
      })),

      updateNotifications: (patch) => set((s) => ({
        notifications: { ...s.notifications, ...patch },
      })),

      resetAll: () => set({ ...initialState }),
    }),
    {
      name: 'chronix-settings',
    }
  )
);
