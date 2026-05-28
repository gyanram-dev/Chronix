import { useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, BookOpen, Calendar, Timer, BarChart3, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../store/settingsStore';
import { useAcademicStore } from '../store/academicStore';

export default function MainLayout() {
  const compactMode = useSettingsStore((s) => s.appearance.compactMode);
  const accentColor = useSettingsStore((s) => s.appearance.accentColor);
  const currentSemester = useSettingsStore((s) => s.academic.currentSemester);
  const setActiveSemester = useAcademicStore((s) => s.setActiveSemester);

  useEffect(() => {
    if (currentSemester) {
      setActiveSemester(currentSemester);
    }
  }, [currentSemester, setActiveSemester]);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Academic', path: '/syllabus', icon: BookOpen },
    { name: 'Planner', path: '/planner', icon: Calendar },
    { name: 'Focus', path: '/focus', icon: Timer },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div
      data-compact={compactMode ? 'true' : 'false'}
      data-accent={accentColor}
      className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans selection:bg-zinc-800 selection:text-white"
    >
      <aside className="w-64 bg-zinc-900/40 backdrop-blur-xl border-r border-zinc-800/40 flex flex-col m-4 rounded-2xl shadow-2xl relative z-10">
        <div className="p-6 flex-1 flex flex-col">
          <motion.h1
            className="text-xl font-medium tracking-[0.2em] text-zinc-100 mb-10 select-none px-2"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            CHRONIX
          </motion.h1>

          <nav className="space-y-1.5 flex-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05, ease: 'easeOut' }}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-out group relative ${
                        isActive
                          ? 'text-white shadow-sm'
                          : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.div
                            layoutId="navHighlight"
                            className="absolute inset-0 bg-zinc-800/80 rounded-xl ring-1 ring-zinc-700/50"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                        <Icon className="w-[18px] h-[18px] stroke-[1.8] relative z-10" />
                        <span className="text-sm font-medium tracking-wide relative z-10">{item.name}</span>
                      </>
                    )}
                  </NavLink>
                </motion.div>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 pl-0">
        <div className="h-full bg-zinc-900/20 rounded-2xl border border-zinc-800/30 overflow-y-auto backdrop-blur-3xl shadow-inner">
          <div className="max-w-6xl mx-auto p-8 lg:p-12">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
