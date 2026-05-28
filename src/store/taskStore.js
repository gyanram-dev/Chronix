import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialTasks = [
  { 
    id: '1', 
    title: 'Implement Graph Traversal Algorithms (BFS/DFS)', 
    category: 'DSA', 
    completed: false, 
    createdAt: new Date().toISOString() 
  },
  { 
    id: '2', 
    title: 'Study Process Scheduling Algorithms', 
    category: 'Operating Systems', 
    completed: true, 
    createdAt: new Date().toISOString() 
  },
  { 
    id: '3', 
    title: 'Understand TCP/IP Handshake and UDP Differences', 
    category: 'Computer Networks', 
    completed: false, 
    createdAt: new Date().toISOString() 
  },
  { 
    id: '4', 
    title: 'Design Database Schema for E-commerce App', 
    category: 'Project Building', 
    completed: false, 
    createdAt: new Date().toISOString() 
  },
  { 
    id: '5', 
    title: 'Read System Design Interview Chapter 1', 
    category: 'Extra Learning', 
    completed: false, 
    createdAt: new Date().toISOString() 
  },
];

export const useTaskStore = create(
  persist(
    (set) => ({
      tasks: initialTasks,

      addTask: (task) => set((state) => ({
        tasks: [
          ...state.tasks,
          {
            ...task,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            completed: false,
          },
        ],
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      })),

      toggleTaskCompletion: (id) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        ),
      })),
    }),
    {
      name: 'chronix-tasks',
    }
  )
);
