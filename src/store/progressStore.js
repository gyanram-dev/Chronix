import { create } from 'zustand';

const initialCategories = [
  { id: 'dsa', name: 'DSA', targetHours: 2, completedHours: 0, percentage: 0 },
  { id: 'projects', name: 'Project Building', targetHours: 1, completedHours: 0, percentage: 0 },
  { id: 'semester', name: 'Semester Study', targetHours: 1, completedHours: 0, percentage: 0 },
  { id: 'extra', name: 'Extra Learning', targetHours: 1, completedHours: 0, percentage: 0 },
];

export const useProgressStore = create((set) => ({
  categories: initialCategories,
  
  incrementProgress: (id) => set((state) => ({
    categories: state.categories.map(cat => {
      if (cat.id === id) {
        const newCompleted = Math.min(cat.completedHours + 0.5, cat.targetHours);
        const newPercentage = Math.round((newCompleted / cat.targetHours) * 100);
        return { ...cat, completedHours: newCompleted, percentage: newPercentage };
      }
      return cat;
    })
  })),
  
  decrementProgress: (id) => set((state) => ({
    categories: state.categories.map(cat => {
      if (cat.id === id) {
        const newCompleted = Math.max(cat.completedHours - 0.5, 0);
        const newPercentage = Math.round((newCompleted / cat.targetHours) * 100);
        return { ...cat, completedHours: newCompleted, percentage: newPercentage };
      }
      return cat;
    })
  })),
  
  resetDailyProgress: () => set({ categories: initialCategories }),
}));
