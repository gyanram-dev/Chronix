import { useProgressStore } from '../store/progressStore';
import ProgressCard from '../components/ProgressCard';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import GridLayout from '../components/ui/GridLayout';
import { Target, Trophy, RotateCcw, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { categories, resetDay } = useProgressStore();

  const totalTargetHours = categories.reduce((acc, cat) => acc + cat.targetHours, 0);
  const totalCompletedHours = categories.reduce((acc, cat) => acc + cat.completedHours, 0);
  const totalPercentage = Math.round((totalCompletedHours / totalTargetHours) * 100) || 0;

  const completedCategories = categories.filter(cat => cat.percentage === 100).length;
  const totalCategories = categories.length;

  const handleResetDay = () => {
    if (window.confirm('Reset all progress for today? This will set all study hours back to zero.')) {
      resetDay();
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title={<>Welcome back <Sparkles className="w-5 h-5 text-amber-400 inline" /></>}
        description="Track your study hours and hit your daily goals."
        action={
          <Button variant="secondary" onClick={handleResetDay}>
            <RotateCcw className="w-4 h-4" />
            Reset Day
          </Button>
        }
      />

      <GridLayout columns={2}>
        <div className="relative rounded-3xl border border-zinc-800/60 bg-zinc-900/40 p-8 flex items-center justify-between overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <p className="text-xs text-zinc-400 font-medium tracking-widest uppercase mb-2">Overall Progress</p>
            <div className="flex items-baseline gap-2">
              <p className="text-5xl font-semibold tracking-tighter text-white">{totalPercentage}%</p>
              <span className="text-sm text-zinc-500 font-medium">/ 100%</span>
            </div>
          </div>
          <div className="relative z-10 w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center text-zinc-300 border border-zinc-700/30 shadow-inner transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
            <Target className="w-8 h-8 stroke-[1.5]" />
          </div>
        </div>

        <div className={`relative rounded-3xl border p-8 flex items-center justify-between overflow-hidden group transition-colors duration-500 ${
          completedCategories === totalCategories ? 'border-emerald-900/30 bg-emerald-950/20' : 'border-zinc-800/60 bg-zinc-900/40'
        }`}>
          {completedCategories === totalCategories && <div className="absolute inset-0 bg-emerald-500/5" />}
          <div className="relative z-10">
            <p className={`text-xs font-medium tracking-widest uppercase mb-2 ${
              completedCategories === totalCategories ? 'text-emerald-500/70' : 'text-zinc-400'
            }`}>Goals Hit</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-5xl font-semibold tracking-tighter ${
                completedCategories === totalCategories ? 'text-emerald-400' : 'text-white'
              }`}>{completedCategories}</p>
              <span className={`text-sm font-medium ${
                completedCategories === totalCategories ? 'text-emerald-500/50' : 'text-zinc-500'
              }`}>/ {totalCategories}</span>
            </div>
          </div>
          <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner transform rotate-6 group-hover:rotate-0 transition-all duration-500 ${
            completedCategories === totalCategories
              ? 'bg-emerald-900/40 text-emerald-400 border-emerald-800/40'
              : 'bg-zinc-800/50 text-zinc-300 border-zinc-700/30'
          }`}>
            <Trophy className="w-8 h-8 stroke-[1.5]" />
          </div>
        </div>
      </GridLayout>

      <div className="space-y-4">
        <h3 className="text-lg font-medium tracking-tight text-zinc-200">Study Categories</h3>
        <GridLayout columns={2}>
          {categories.map((category) => (
            <ProgressCard key={category.id} category={category} />
          ))}
        </GridLayout>
      </div>
    </PageContainer>
  );
}
