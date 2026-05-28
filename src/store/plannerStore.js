import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialSections = [
  { id: 'dsa', name: 'DSA', items: [] },
  { id: 'semester', name: 'Semester Study', items: [] },
  { id: 'projects', name: 'Project Building', items: [] },
  { id: 'extra', name: 'Extra Learning', items: [] },
];

export const usePlannerStore = create(
  persist(
    (set) => ({
      planDate: new Date().toISOString().split('T')[0],
      sections: initialSections,
      tomorrowItems: [],

      addToPlan: (sectionId, item) => set((state) => ({
        sections: state.sections.map((sec) =>
          sec.id === sectionId
            ? { ...sec, items: [...sec.items, { ...item, id: crypto.randomUUID() }] }
            : sec
        ),
      })),

      removeFromPlan: (sectionId, itemId) => set((state) => ({
        sections: state.sections.map((sec) =>
          sec.id === sectionId
            ? { ...sec, items: sec.items.filter((item) => item.id !== itemId) }
            : sec
        ),
      })),

      togglePlannedItem: (sectionId, itemId) => set((state) => ({
        sections: state.sections.map((sec) =>
          sec.id === sectionId
            ? {
                ...sec,
                items: sec.items.map((item) =>
                  item.id === itemId ? { ...item, completed: !item.completed } : item
                ),
              }
            : sec
        ),
      })),

      moveToTomorrow: (sectionId, itemId) => set((state) => {
        const section = state.sections.find((s) => s.id === sectionId);
        const item = section?.items.find((i) => i.id === itemId);
        if (!item) return state;
        return {
          sections: state.sections.map((sec) =>
            sec.id === sectionId
              ? { ...sec, items: sec.items.filter((i) => i.id !== itemId) }
              : sec
          ),
          tomorrowItems: [...state.tomorrowItems, { ...item }],
        };
      }),

      setItemPriority: (sectionId, itemId, priority) => set((state) => ({
        sections: state.sections.map((sec) =>
          sec.id === sectionId
            ? {
                ...sec,
                items: sec.items.map((item) =>
                  item.id === itemId ? { ...item, priority } : item
                ),
              }
            : sec
        ),
      })),
    }),
    {
      name: 'chronix-planner',
    }
  )
);
