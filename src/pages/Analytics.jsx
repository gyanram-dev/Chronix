import { useMemo } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useProgressStore } from '../store/progressStore';
import { useAcademicStore } from '../store/academicStore';
import { usePlannerStore } from '../store/plannerStore';
import { useFocusStore } from '../store/focusStore';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import StatCard from '../components/ui/StatCard';
import GridLayout from '../components/ui/GridLayout';
import {
  CheckCircle, Clock, TrendingUp, TrendingDown, Zap, BookOpen,
  Lightbulb, Target, Calendar,
} from 'lucide-react';

const THEME = {
  dsa: '#60a5fa', semester: '#a78bfa', projects: '#34d399', extra: '#fbbf24',
};
const CHART_COLORS = ['#60a5fa', '#a78bfa', '#34d399', '#fbbf24', '#f472b6'];
const PIE_COLORS = ['#34d399', '#3f3f46'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-zinc-900/95 backdrop-blur-md border border-zinc-700/60 rounded-xl px-3.5 py-2.5 shadow-2xl text-sm">
      <p className="text-zinc-400 text-xs mb-1.5 font-medium">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="text-zinc-200 font-medium" style={{ color: entry.color }}>
          {entry.name}: {entry.value}{entry.name?.toLowerCase().includes('hour') ? 'h' : '%'}
        </p>
      ))}
    </div>
  );
}

function getWeekLabel(isoStr) {
  const d = new Date(isoStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const mon = new Date(d.setDate(diff));
  return `${mon.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

function getWeekKey(isoStr) {
  const d = new Date(isoStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const mon = new Date(d.setDate(diff));
  return mon.toISOString().split('T')[0];
}

export default function Analytics() {
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useProgressStore((s) => s.categories);
  const semesters = useAcademicStore((s) => s.semesters);
  const plannerSections = usePlannerStore((s) => s.sections);
  const sessions = useFocusStore((s) => s.sessions);

  const activeSemester = useMemo(() => semesters.find((s) => s.activeSemester) || semesters[0], [semesters]);
  const subjects = useMemo(() => activeSemester?.subjects || [], [activeSemester]);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter((t) => t.completed).length;
    const totalHours = categories.reduce((s, c) => s + c.completedHours, 0);
    const maxCat = [...categories].sort((a, b) => b.percentage - a.percentage)[0];
    const minCat = [...categories].sort((a, b) => a.percentage - b.percentage)[0];

    const completedTopics = subjects.reduce(
      (acc, s) => acc + s.topics.filter((t) => t.completed).length, 0
    );

    return { completedTasks, totalHours, maxCat, minCat, completedTopics };
  }, [tasks, categories, subjects]);

  const chartData = useMemo(() => {
    const focusHours = categories.map((c) => ({
      name: c.name,
      Hours: c.completedHours,
      Target: c.targetHours,
      fill: THEME[c.id] || '#71717a',
    }));

    const taskPie = [
      { name: 'Completed', value: stats.completedTasks },
      { name: 'Pending', value: tasks.length - stats.completedTasks },
    ];

    const subjectProgress = subjects.map((s) => {
      const done = s.topics.filter((t) => t.completed).length;
      const pct = s.topics.length > 0 ? Math.round((done / s.topics.length) * 100) : 0;
      return { name: s.name, Progress: pct };
    });

    const taskScore = tasks.length > 0 ? Math.round((stats.completedTasks / tasks.length) * 100) : 0;
    const progressScore = categories.length > 0
      ? Math.round(categories.reduce((s, c) => s + c.percentage, 0) / categories.length)
      : 0;
    const plannerTotal = plannerSections.reduce((s, sec) => s + sec.items.length, 0);
    const plannerDone = plannerSections.reduce((s, sec) => s + sec.items.filter((i) => i.completed).length, 0);
    const plannerScore = plannerTotal > 0 ? Math.round((plannerDone / plannerTotal) * 100) : 0;
    const academicTotal = subjects.reduce((s, sub) => s + sub.topics.length, 0);
    const academicDone = subjects.reduce((s, sub) => s + sub.topics.filter((t) => t.completed).length, 0);
    const academicScore = academicTotal > 0 ? Math.round((academicDone / academicTotal) * 100) : 0;

    const trend = [
      { name: 'Tasks', Score: taskScore },
      { name: 'Study', Score: progressScore },
      { name: 'Academic', Score: academicScore },
      { name: 'Planner', Score: plannerScore },
    ];

    return { focusHours, taskPie, subjectProgress, trend };
  }, [categories, stats, tasks, subjects, plannerSections]);

  const weeklyTrend = useMemo(() => {
    const weeksMap = {};
    sessions.forEach((s) => {
      if (!s.endTime || !s.durationSeconds) return;
      const key = getWeekKey(s.endTime);
      if (!weeksMap[key]) {
        weeksMap[key] = { week: getWeekLabel(s.endTime), dsa: 0, semester: 0, projects: 0, extra: 0 };
      }
      const cat = s.category || 'semester';
      if (weeksMap[key][cat] !== undefined) {
        weeksMap[key][cat] += s.durationSeconds / 3600;
      }
    });
    return Object.entries(weeksMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-8)
      .map(([, v]) => v);
  }, [sessions]);

  const productivityScore = useMemo(() => {
    const scores = chartData.trend.map((d) => d.Score);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [chartData]);

  const insights = useMemo(() => {
    const list = [];

    const dsaCat = categories.find((c) => c.id === 'dsa');
    if (dsaCat) {
      if (dsaCat.percentage >= 80) list.push({ type: 'positive', text: 'DSA consistency is improving — great momentum!' });
      else if (dsaCat.percentage <= 20 && dsaCat.percentage > 0) list.push({ type: 'warning', text: 'DSA progress is low — consider adding more practice time.' });
    }

    const osSubject = subjects.find((s) => s.name.toLowerCase().includes('operating'));
    if (osSubject) {
      const done = osSubject.topics.filter((t) => t.completed).length;
      const pct = osSubject.topics.length > 0 ? Math.round((done / osSubject.topics.length) * 100) : 0;
      if (pct < 30) list.push({ type: 'warning', text: 'Operating Systems progress is low — plan focused study sessions.' });
    }

    const projectsCat = categories.find((c) => c.id === 'projects');
    if (projectsCat && projectsCat.percentage > 0) {
      const others = categories.filter((c) => c.id !== 'projects');
      const avgOthers = others.length > 0 ? others.reduce((s, c) => s + c.percentage, 0) / others.length : 0;
      if (projectsCat.percentage >= avgOthers) list.push({ type: 'positive', text: 'Project Building is your strongest area — keep building!' });
    }

    const worst = [...categories].sort((a, b) => a.percentage - b.percentage)[0];
    if (worst && worst.percentage === 0 && categories.some((c) => c.percentage > 0)) {
      list.push({ type: 'info', text: `"${worst.name}" hasn't been started yet — add it to your daily plan.` });
    }

    if (stats.completedTasks === 0 && tasks.length > 0) {
      list.push({ type: 'warning', text: 'No tasks completed yet — start checking them off!' });
    }

    if (productivityScore >= 60) {
      list.push({ type: 'positive', text: 'Overall productivity is on track — consistent effort pays off.' });
    } else if (productivityScore < 30 && stats.completedTasks > 0) {
      list.push({ type: 'info', text: 'Productivity score is low — try breaking work into smaller chunks.' });
    }

    if (list.length === 0) {
      list.push({ type: 'info', text: 'Start tracking tasks and progress to see personalized insights.' });
    }

    return list.slice(0, 5);
  }, [categories, subjects, stats, productivityScore, tasks]);

  return (
    <PageContainer>
      <SectionHeader
        title="Analytics Dashboard"
        description="View insights and progress across all your activities."
      />

      <GridLayout columns={3}>
        <StatCard icon={<CheckCircle className="w-6 h-6 stroke-[1.5]" />} value={stats.completedTasks} label="Tasks Completed" accent />
        <StatCard icon={<Clock className="w-6 h-6 stroke-[1.5]" />} value={`${stats.totalHours}h`} label="Total Study Hours" />
        <StatCard icon={<TrendingUp className="w-6 h-6 stroke-[1.5]" />} value={stats.maxCat?.name || '—'} label="Strongest Category" accent />
        <StatCard icon={<TrendingDown className="w-6 h-6 stroke-[1.5]" />} value={stats.minCat?.name || '—'} label="Weakest Category" />
        <StatCard icon={<Zap className="w-6 h-6 stroke-[1.5]" />} value="—" label="Active Streak" />
        <StatCard icon={<BookOpen className="w-6 h-6 stroke-[1.5]" />} value={stats.completedTopics} label="Topics Completed" accent />
      </GridLayout>

      {/* Daily Progress */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium tracking-tight text-zinc-200">Daily Progress Analytics</h3>
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6">
          <p className="text-sm text-zinc-400 mb-6">Weekly focus hours by category</p>
          {chartData.focusHours.some((d) => d.Hours > 0) || chartData.focusHours.some((d) => d.Target > 0) ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData.focusHours} barGap={4} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a' }} />
                <Bar dataKey="Hours" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {chartData.focusHours.map((entry, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Bar>
                <Bar dataKey="Target" radius={[6, 6, 0, 0]} maxBarSize={40} fill="#3f3f46" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-zinc-600 text-sm">No study hours tracked yet</div>
          )}
        </div>
      </div>

      {/* Weekly Trends */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium tracking-tight text-zinc-200 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-zinc-500" />
          Weekly Trends
        </h3>
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6">
          <p className="text-sm text-zinc-400 mb-6">Focus hours by category per week</p>
          {weeklyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyTrend} barGap={2} barCategoryGap="15%">
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="week" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a' }} />
                <Bar dataKey="dsa" name="DSA" stackId="a" radius={[0, 0, 0, 0]} fill="#60a5fa" />
                <Bar dataKey="semester" name="Semester" stackId="a" radius={[0, 0, 0, 0]} fill="#a78bfa" />
                <Bar dataKey="projects" name="Projects" stackId="a" radius={[0, 0, 0, 0]} fill="#34d399" />
                <Bar dataKey="extra" name="Extra" stackId="a" radius={[6, 6, 0, 0]} fill="#fbbf24" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-zinc-600 text-sm">Complete focus sessions to see weekly trends</div>
          )}
        </div>
      </div>

      {/* Task & Academic */}
      <GridLayout columns={2}>
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6">
          <h4 className="text-sm font-medium text-zinc-200 mb-1">Task Completion Analytics</h4>
          <p className="text-xs text-zinc-500 mb-5">Completed vs pending tasks</p>
          {tasks.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={chartData.taskPie} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                  paddingAngle={4} dataKey="value" stroke="none"
                >
                  {chartData.taskPie.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: '#a1a1aa' }}
                  formatter={(value) => <span className="text-zinc-400">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[240px] flex items-center justify-center text-zinc-600 text-sm">No tasks yet</div>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6">
          <h4 className="text-sm font-medium text-zinc-200 mb-1">Academic Progress Analytics</h4>
          <p className="text-xs text-zinc-500 mb-5">Subject-wise topic completion</p>
          {chartData.subjectProgress.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData.subjectProgress} layout="vertical" barGap={4} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a' }} />
                <Bar dataKey="Progress" radius={[0, 6, 6, 0]} maxBarSize={20}>
                  {chartData.subjectProgress.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[240px] flex items-center justify-center text-zinc-600 text-sm">No subjects added yet</div>
          )}
        </div>
      </GridLayout>

      {/* Productivity */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium tracking-tight text-zinc-200">Productivity Insights</h3>
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6">
          <p className="text-sm text-zinc-400 mb-6">Performance scores across dimensions</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData.trend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#27272a' }} />
              <Line type="monotone" dataKey="Score" stroke="#60a5fa" strokeWidth={2.5}
                dot={{ fill: '#60a5fa', stroke: '#18181b', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#60a5fa', stroke: '#18181b', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Productivity Score */}
      <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 md:p-8 flex items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-zinc-400" />
            <h3 className="text-lg font-medium tracking-tight text-zinc-200">Productivity Score</h3>
          </div>
          <p className="text-sm text-zinc-500">Based on task completion, study progress, academic work, and planner adherence.</p>
        </div>
        <div className="flex-shrink-0 text-center">
          <div className={`text-5xl font-semibold tracking-tight ${
            productivityScore >= 60 ? 'text-emerald-400' : productivityScore >= 30 ? 'text-amber-400' : 'text-zinc-400'
          }`}>
            {productivityScore}
          </div>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider font-medium">/ 100</p>
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium tracking-tight text-zinc-200 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          Insights
        </h3>
        {insights.length > 0 ? (
          <div className="space-y-2">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border transition-all ${
                  insight.type === 'positive'
                    ? 'bg-emerald-950/10 border-emerald-900/20'
                    : insight.type === 'warning'
                    ? 'bg-amber-950/10 border-amber-900/20'
                    : 'bg-zinc-900/40 border-zinc-800/40'
                }`}
              >
                <Lightbulb className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  insight.type === 'positive' ? 'text-emerald-400' : insight.type === 'warning' ? 'text-amber-400' : 'text-zinc-500'
                }`} />
                <p className={`text-sm ${
                  insight.type === 'positive' ? 'text-emerald-300' : insight.type === 'warning' ? 'text-amber-300' : 'text-zinc-300'
                }`}>
                  {insight.text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
            <Lightbulb className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
            <p className="text-zinc-500 text-sm">No insights yet — start tracking to unlock personalized recommendations.</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
