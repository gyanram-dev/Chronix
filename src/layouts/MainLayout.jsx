import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, BookOpen, BarChart3, Settings } from 'lucide-react';

export default function MainLayout() {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Academic', path: '/syllabus', icon: BookOpen },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans selection:bg-zinc-800 selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900/40 backdrop-blur-xl border-r border-zinc-800/40 flex flex-col m-4 rounded-2xl shadow-2xl relative z-10">
        <div className="p-6 flex-1 flex flex-col">
          <h1 className="text-xl font-medium tracking-[0.2em] text-zinc-100 mb-10 select-none px-2">
            CHRONIX
          </h1>
          <nav className="space-y-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-out group ${
                      isActive
                        ? 'bg-zinc-800/80 text-white shadow-sm ring-1 ring-zinc-700/50'
                        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                    }`
                  }
                >
                  <Icon className="w-[18px] h-[18px] stroke-[1.8]" />
                  <span className="text-sm font-medium tracking-wide">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
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
