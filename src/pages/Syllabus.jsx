import { useSyllabusStore } from '../store/syllabusStore';
import SyllabusCard from '../components/SyllabusCard';
import { BookOpen, CheckCircle, Target } from 'lucide-react';

export default function Syllabus() {
  const subjects = useSyllabusStore((s) => s.subjects);

  const totalTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0);
  const completedTopics = subjects.reduce(
    (acc, s) => acc + s.topics.filter((t) => t.completed).length,
    0
  );
  const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const completedSubjects = subjects.filter(
    (s) => s.topics.length > 0 && s.topics.every((t) => t.completed)
  ).length;

  return (
    <div className="space-y-8 fade-in">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">Syllabus</h2>
        <p className="text-sm text-zinc-400 mt-1">Track your 4th semester Computer Science subjects.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5 shadow-sm flex items-center gap-4 transition-all hover:bg-zinc-900/60">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300">
            <BookOpen className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">{subjects.length}</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium mt-0.5">Subjects</p>
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-900/20 bg-emerald-950/10 p-5 shadow-sm flex items-center gap-4 transition-all hover:bg-emerald-950/20">
          <div className="w-12 h-12 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-emerald-400">{completedTopics}</p>
            <p className="text-xs text-emerald-500/70 uppercase tracking-wider font-medium mt-0.5">
              Topics Done
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5 shadow-sm flex items-center gap-4 transition-all hover:bg-zinc-900/60">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300">
            <Target className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">{overallProgress}%</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium mt-0.5">Overall Progress</p>
          </div>
        </div>
      </div>

      <div>
        {completedSubjects > 0 && (
          <p className="text-sm text-emerald-400/80 mb-4">
            {completedSubjects} of {subjects.length} subjects completed
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {subjects.map((subject) => (
            <SyllabusCard key={subject.id} subject={subject} />
          ))}
        </div>
      </div>
    </div>
  );
}
