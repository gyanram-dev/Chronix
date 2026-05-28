import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialSubjects = [
  {
    id: 'os',
    name: 'Operating Systems',
    color: 'blue',
    topics: [
      { id: 'os-1', name: 'Process Management', completed: false },
      { id: 'os-2', name: 'Memory Management', completed: false },
      { id: 'os-3', name: 'File Systems', completed: false },
      { id: 'os-4', name: 'I/O Management', completed: false },
    ],
  },
  {
    id: 'mot',
    name: 'Modelling & Optimization Techniques',
    color: 'purple',
    topics: [
      { id: 'mot-1', name: 'Linear Programming', completed: false },
      { id: 'mot-2', name: 'Simplex Method', completed: false },
      { id: 'mot-3', name: 'Duality & Sensitivity Analysis', completed: false },
    ],
  },
  {
    id: 'daa',
    name: 'Design and Analysis of Algorithms',
    color: 'emerald',
    topics: [
      { id: 'daa-1', name: 'Asymptotic Analysis', completed: false },
      { id: 'daa-2', name: 'Divide & Conquer', completed: false },
      { id: 'daa-3', name: 'Dynamic Programming', completed: false },
      { id: 'daa-4', name: 'Greedy Algorithms', completed: false },
      { id: 'daa-5', name: 'Graph Algorithms', completed: false },
    ],
  },
  {
    id: 'cn',
    name: 'Computer Networks',
    color: 'amber',
    topics: [
      { id: 'cn-1', name: 'OSI & TCP/IP Models', completed: false },
      { id: 'cn-2', name: 'Routing Algorithms', completed: false },
      { id: 'cn-3', name: 'Transport Layer Protocols', completed: false },
      { id: 'cn-4', name: 'Application Layer Protocols', completed: false },
    ],
  },
  {
    id: 'app',
    name: 'Advanced Programming Practice',
    color: 'rose',
    topics: [
      { id: 'app-1', name: 'OOP Concepts & Principles', completed: false },
      { id: 'app-2', name: 'Design Patterns', completed: false },
      { id: 'app-3', name: 'Concurrent Programming', completed: false },
      { id: 'app-4', name: 'Testing & Debugging Strategies', completed: false },
    ],
  },
];

export const useSyllabusStore = create(
  persist(
    (set) => ({
      subjects: initialSubjects,

      toggleTopic: (subjectId, topicId) => set((state) => ({
        subjects: state.subjects.map((subject) => {
          if (subject.id !== subjectId) return subject;
          return {
            ...subject,
            topics: subject.topics.map((topic) =>
              topic.id === topicId ? { ...topic, completed: !topic.completed } : topic
            ),
          };
        }),
      })),
    }),
    {
      name: 'chronix-syllabus',
    }
  )
);
