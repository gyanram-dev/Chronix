import { useTaskStore } from '../store/taskStore';
import { CheckCircle2, Circle, Trash2, ListTodo, CheckCircle, Clock } from 'lucide-react';

export default function Tasks() {
  const { tasks, toggleTaskCompletion, deleteTask } = useTaskStore();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="space-y-8 fade-in">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">Tasks</h2>
        <p className="text-sm text-zinc-400 mt-1">Manage and track your active tasks.</p>
      </header>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5 shadow-sm flex items-center gap-4 transition-all hover:bg-zinc-900/60">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300">
            <ListTodo className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">{totalTasks}</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium mt-0.5">Total Tasks</p>
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-900/20 bg-emerald-950/10 p-5 shadow-sm flex items-center gap-4 transition-all hover:bg-emerald-950/20">
          <div className="w-12 h-12 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-emerald-400">{completedTasks}</p>
            <p className="text-xs text-emerald-500/70 uppercase tracking-wider font-medium mt-0.5">Completed</p>
          </div>
        </div>
        <div className="rounded-2xl border border-amber-900/20 bg-amber-950/10 p-5 shadow-sm flex items-center gap-4 transition-all hover:bg-amber-950/20">
          <div className="w-12 h-12 rounded-full bg-amber-900/30 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-amber-400">{pendingTasks}</p>
            <p className="text-xs text-amber-500/70 uppercase tracking-wider font-medium mt-0.5">Pending</p>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group ${
              task.completed 
                ? 'bg-zinc-900/20 border-zinc-800/30 opacity-70' 
                : 'bg-zinc-900/60 border-zinc-800/60 hover:border-zinc-700/80 hover:bg-zinc-800/40 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => toggleTaskCompletion(task.id)}
                className="text-zinc-500 hover:text-emerald-400 transition-colors focus:outline-none"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-[22px] h-[22px] text-emerald-500" />
                ) : (
                  <Circle className="w-[22px] h-[22px]" />
                )}
              </button>
              
              <div>
                <p className={`text-[15px] font-medium transition-all ${
                  task.completed ? 'text-zinc-500 line-through' : 'text-zinc-200 group-hover:text-white'
                }`}>
                  {task.title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${
                task.completed 
                  ? 'bg-zinc-800/30 border-zinc-800/50 text-zinc-500'
                  : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-300'
              }`}>
                {task.category}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all p-2 rounded-lg focus:outline-none opacity-0 group-hover:opacity-100"
                title="Delete Task"
              >
                <Trash2 className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
            <p className="text-zinc-500 text-sm">No tasks found. Enjoy your free time!</p>
          </div>
        )}
      </div>
    </div>
  );
}
