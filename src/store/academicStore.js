import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialSemesters = [
  {
    id: 'sem-4',
    name: 'Semester 4',
    activeSemester: true,
    subjects: [
      {
        id: 'os',
        name: 'Operating Systems',
        topics: [
          { id: 'os-1', title: 'Process Management', completed: false },
          { id: 'os-2', title: 'Memory Management', completed: false },
          { id: 'os-3', title: 'File Systems', completed: false },
          { id: 'os-4', title: 'I/O Management', completed: false },
        ],
      },
      {
        id: 'cn',
        name: 'Computer Networks',
        topics: [
          { id: 'cn-1', title: 'OSI & TCP/IP Models', completed: false },
          { id: 'cn-2', title: 'Routing Algorithms', completed: false },
          { id: 'cn-3', title: 'Transport Layer Protocols', completed: false },
          { id: 'cn-4', title: 'Application Layer Protocols', completed: false },
        ],
      },
      {
        id: 'daa',
        name: 'Design and Analysis of Algorithms',
        topics: [
          { id: 'daa-1', title: 'Asymptotic Analysis', completed: false },
          { id: 'daa-2', title: 'Divide & Conquer', completed: false },
          { id: 'daa-3', title: 'Dynamic Programming', completed: false },
          { id: 'daa-4', title: 'Greedy Algorithms', completed: false },
          { id: 'daa-5', title: 'Graph Algorithms', completed: false },
        ],
      },
    ],
  },
  {
    id: 'sem-3',
    name: 'Semester 3',
    activeSemester: false,
    subjects: [
      {
        id: 'ds',
        name: 'Data Structures',
        topics: [
          { id: 'ds-1', title: 'Arrays & Linked Lists', completed: true },
          { id: 'ds-2', title: 'Stacks & Queues', completed: true },
          { id: 'ds-3', title: 'Trees & Graphs', completed: false },
        ],
      },
    ],
  },
];

export const useAcademicStore = create(
  persist(
    (set) => ({
      semesters: initialSemesters,

      setActiveSemester: (id) => set((state) => ({
        semesters: state.semesters.map((sem) => ({
          ...sem,
          activeSemester: sem.id === id,
        })),
      })),

      addSemester: (name) => set((state) => ({
        semesters: [
          ...state.semesters.map((sem) => ({ ...sem, activeSemester: false })),
          {
            id: crypto.randomUUID(),
            name,
            activeSemester: true,
            subjects: [],
          },
        ],
      })),

      deleteSemester: (id) => set((state) => {
        const filtered = state.semesters.filter((sem) => sem.id !== id);
        if (filtered.length > 0 && !filtered.some((sem) => sem.activeSemester)) {
          filtered[0].activeSemester = true;
        }
        return { semesters: filtered };
      }),

      editSemester: (id, name) => set((state) => ({
        semesters: state.semesters.map((sem) =>
          sem.id === id ? { ...sem, name } : sem
        ),
      })),

      addSubject: (semesterId, name) => set((state) => ({
        semesters: state.semesters.map((sem) =>
          sem.id === semesterId
            ? { ...sem, subjects: [...sem.subjects, { id: crypto.randomUUID(), name, topics: [] }] }
            : sem
        ),
      })),

      deleteSubject: (semesterId, subjectId) => set((state) => ({
        semesters: state.semesters.map((sem) =>
          sem.id === semesterId
            ? { ...sem, subjects: sem.subjects.filter((sub) => sub.id !== subjectId) }
            : sem
        ),
      })),

      editSubject: (semesterId, subjectId, name) => set((state) => ({
        semesters: state.semesters.map((sem) =>
          sem.id === semesterId
            ? {
                ...sem,
                subjects: sem.subjects.map((sub) =>
                  sub.id === subjectId ? { ...sub, name } : sub
                ),
              }
            : sem
        ),
      })),

      addTopic: (semesterId, subjectId, title) => set((state) => ({
        semesters: state.semesters.map((sem) =>
          sem.id === semesterId
            ? {
                ...sem,
                subjects: sem.subjects.map((sub) =>
                  sub.id === subjectId
                    ? { ...sub, topics: [...sub.topics, { id: crypto.randomUUID(), title, completed: false }] }
                    : sub
                ),
              }
            : sem
        ),
      })),

      deleteTopic: (semesterId, subjectId, topicId) => set((state) => ({
        semesters: state.semesters.map((sem) =>
          sem.id === semesterId
            ? {
                ...sem,
                subjects: sem.subjects.map((sub) =>
                  sub.id === subjectId
                    ? { ...sub, topics: sub.topics.filter((t) => t.id !== topicId) }
                    : sub
                ),
              }
            : sem
        ),
      })),

      editTopic: (semesterId, subjectId, topicId, title) => set((state) => ({
        semesters: state.semesters.map((sem) =>
          sem.id === semesterId
            ? {
                ...sem,
                subjects: sem.subjects.map((sub) =>
                  sub.id === subjectId
                    ? {
                        ...sub,
                        topics: sub.topics.map((t) =>
                          t.id === topicId ? { ...t, title } : t
                        ),
                      }
                    : sub
                ),
              }
            : sem
        ),
      })),

      toggleTopic: (semesterId, subjectId, topicId) => set((state) => ({
        semesters: state.semesters.map((sem) =>
          sem.id === semesterId
            ? {
                ...sem,
                subjects: sem.subjects.map((sub) =>
                  sub.id === subjectId
                    ? {
                        ...sub,
                        topics: sub.topics.map((t) =>
                          t.id === topicId ? { ...t, completed: !t.completed } : t
                        ),
                      }
                    : sub
                ),
              }
            : sem
        ),
      })),
    }),
    {
      name: 'chronix-academic',
    }
  )
);
