import { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { CheckCircle2, Circle, Trash2, ListTodo, CheckCircle, Clock, Plus } from 'lucide-react';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import GridLayout from '../components/ui/GridLayout';

const CATEGORIES = ['DSA', 'Semester Study', 'Project Building', 'Extra Learning'];

export default function Tasks() {
  const { tasks, addTask, toggleTaskCompletion, deleteTask } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({ title: title.trim(), category });
    setTitle('');
    setCategory(CATEGORIES[0]);
    setIsModalOpen(false);
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Tasks"
        description="Manage and track your active tasks."
        action={
          <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        }
      />

      <GridLayout columns={3}>
        <StatCard icon={<ListTodo className="w-6 h-6 stroke-[1.5]" />} value={totalTasks} label="Total Tasks" />
        <StatCard icon={<CheckCircle className="w-6 h-6 stroke-[1.5]" />} value={completedTasks} label="Completed" accent />
        <StatCard icon={<Clock className="w-6 h-6 stroke-[1.5]" />} value={pendingTasks} label="Pending" accent={false} />
      </GridLayout>

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
              <Button
                variant="danger"
                size="icon"
                onClick={() => deleteTask(task.id)}
                title="Delete Task"
              >
                <Trash2 className="w-[18px] h-[18px]" />
              </Button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <EmptyState message="No tasks found. Enjoy your free time!" />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Task">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you want to work on?"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all text-sm"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all text-sm appearance-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-zinc-800">{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
            <Button variant="primary" type="submit" className="flex-1">Create Task</Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
