import { useState, useMemo } from 'react';
import { usePlannerStore } from '../store/plannerStore';
import { useTaskStore } from '../store/taskStore';
import { useAcademicStore } from '../store/academicStore';
import {
  Calendar, Clock, CheckCircle2, Circle, Plus, X, ChevronDown,
  ArrowRight, AlertCircle, Sparkles, ListTodo, Trash2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import PageContainer from '../components/ui/PageContainer';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import GridLayout from '../components/ui/GridLayout';

const PRIORITY_CONFIG = {
  high: { label: 'High', dot: 'bg-red-500', bg: 'bg-red-500/10', text: 'text-red-400' },
  medium: { label: 'Medium', dot: 'bg-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  low: { label: 'Low', dot: 'bg-zinc-500', bg: 'bg-zinc-500/10', text: 'text-zinc-400' },
};

const SECTION_THEME = {
  dsa: { border: 'border-blue-500/20', hoverBorder: 'hover:border-blue-500/40', bar: 'bg-blue-500', text: 'text-blue-400', bg: 'bg-blue-500/10' },
  semester: { border: 'border-purple-500/20', hoverBorder: 'hover:border-purple-500/40', bar: 'bg-purple-500', text: 'text-purple-400', bg: 'bg-purple-500/10' },
  projects: { border: 'border-emerald-500/20', hoverBorder: 'hover:border-emerald-500/40', bar: 'bg-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  extra: { border: 'border-amber-500/20', hoverBorder: 'hover:border-amber-500/40', bar: 'bg-amber-500', text: 'text-amber-400', bg: 'bg-amber-500/10' },
};

function mapToSection(title, category) {
  const t = (title || '').toLowerCase();
  const c = (category || '').toLowerCase();
  if (t.includes('dsa') || c.includes('dsa')) return 'dsa';
  if (t.includes('project') || c.includes('project')) return 'projects';
  if (t.includes('extra') || c.includes('extra')) return 'extra';
  return 'semester';
}

export default function DailyPlanner() {
  const { sections, tomorrowItems, addToPlan, removeFromPlan, togglePlannedItem, moveToTomorrow } = usePlannerStore();
  const tasks = useTaskStore((s) => s.tasks);
  const semesters = useAcademicStore((s) => s.semesters);

  const [expandedSections, setExpandedSections] = useState({});
  const [addingItem, setAddingItem] = useState(null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [dismissedSuggestions, setDismissedSuggestions] = useState(new Set());

  const activeSemester = semesters.find((s) => s.activeSemester) || semesters[0];

  const planItemIds = useMemo(() => {
    const ids = new Set();
    sections.forEach((sec) => sec.items.forEach((item) => ids.add(item.sourceId)));
    return ids;
  }, [sections]);

  const suggestions = useMemo(() => {
    const result = [];
    if (activeSemester) {
      activeSemester.subjects.forEach((subject) => {
        subject.topics.filter((t) => !t.completed && !planItemIds.has(t.id)).forEach((topic) => {
          result.push({
            id: crypto.randomUUID(),
            title: `${subject.name}: ${topic.title}`,
            sectionId: mapToSection(subject.name, ''),
            estimatedMinutes: 60,
            priority: 'medium',
            sourceType: 'academic',
            sourceId: topic.id,
          });
        });
      });
    }
    tasks.filter((t) => !t.completed && !planItemIds.has(t.id)).forEach((task) => {
      result.push({
        id: crypto.randomUUID(),
        title: task.title,
        sectionId: mapToSection(task.title, task.category),
        estimatedMinutes: 30,
        priority: 'high',
        sourceType: 'task',
        sourceId: task.id,
      });
    });
    return result.filter((s) => !dismissedSuggestions.has(s.id));
  }, [activeSemester, tasks, planItemIds, dismissedSuggestions]);

  const totalItems = sections.reduce((acc, s) => acc + s.items.length, 0);
  const completedItems = sections.reduce((acc, s) => acc + s.items.filter((i) => i.completed).length, 0);
  const totalHours = sections.reduce((acc, s) => acc + s.items.reduce((h, i) => h + i.estimatedMinutes, 0), 0);
  const highPriorityCount = sections.reduce((acc, s) => acc + s.items.filter((i) => i.priority === 'high' && !i.completed).length, 0);

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <PageContainer>
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">Daily Planner</h2>
            <span className="flex items-center gap-1.5 text-sm text-zinc-500 bg-zinc-900/60 px-3 py-1 rounded-full border border-zinc-800/50">
              <Calendar className="w-3.5 h-3.5" />
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">Plan your study session for today.</p>
        </div>
      </header>

      <GridLayout columns={4}>
        <StatCard icon={<ListTodo className="w-5 h-5 stroke-[1.5]" />} value={totalItems} label="Planned" />
        <StatCard icon={<CheckCircle2 className="w-5 h-5 stroke-[1.5]" />} value={completedItems} label="Done" accent />
        <StatCard icon={<Clock className="w-5 h-5 stroke-[1.5]" />} value={`${Math.round(totalHours / 60)}h ${totalHours % 60}m`} label="Hours" />
        <StatCard icon={<AlertCircle className="w-5 h-5 stroke-[1.5]" />} value={highPriorityCount} label="Priority" accent={false} />
      </GridLayout>

      {suggestions.length > 0 && (
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/10 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-medium text-indigo-400">Smart Suggestions</h3>
            <span className="text-xs text-indigo-500/70 bg-indigo-500/10 px-2 py-0.5 rounded-full">{suggestions.length}</span>
          </div>
          <div className="space-y-2">
            {suggestions.slice(0, 6).map((suggestion) => {
              const sec = sections.find((s) => s.id === suggestion.sectionId);
              return (
                <div key={suggestion.id} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/40 hover:border-zinc-700/60 transition-all group">
                  <div className={`w-2 h-2 rounded-full ${PRIORITY_CONFIG[suggestion.priority].dot} flex-shrink-0`} />
                  <span className="flex-1 text-sm text-zinc-300 min-w-0 truncate">{suggestion.title}</span>
                  {sec && (
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${SECTION_THEME[sec.id].bg} ${SECTION_THEME[sec.id].text} flex-shrink-0`}>
                      {sec.name}
                    </span>
                  )}
                  <span className="text-[11px] text-zinc-600 font-mono flex-shrink-0">{suggestion.estimatedMinutes}m</span>
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => addToPlan(suggestion.sectionId, {
                      title: suggestion.title, estimatedMinutes: suggestion.estimatedMinutes,
                      priority: suggestion.priority, completed: false,
                      sourceType: suggestion.sourceType, sourceId: suggestion.sourceId,
                    })}
                    title="Add to plan"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => setDismissedSuggestions((prev) => new Set([...prev, suggestion.id]))}
                    title="Dismiss"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tomorrowItems.length > 0 && (
        <div className="rounded-2xl border border-zinc-800/40 bg-zinc-900/30 p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowRight className="w-4 h-4 text-zinc-500" />
            <p className="text-sm text-zinc-400">{tomorrowItems.length} item{tomorrowItems.length !== 1 ? 's' : ''} moved to tomorrow</p>
          </div>
        </div>
      )}

      <GridLayout columns={2}>
        {sections.map((section) => {
          const theme = SECTION_THEME[section.id];
          const isOpen = expandedSections[section.id] !== false;
          const completed = section.items.filter((i) => i.completed).length;
          const progress = section.items.length > 0 ? Math.round((completed / section.items.length) * 100) : 0;

          return (
            <div
              key={section.id}
              className={`rounded-2xl border ${theme.border} ${theme.hoverBorder} bg-zinc-900/40 shadow-sm transition-all duration-300 overflow-hidden ${isOpen ? 'ring-1 ring-zinc-700/50' : ''}`}
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full text-left p-5 focus:outline-none"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <h3 className={`font-medium tracking-wide ${progress === 100 && section.items.length > 0 ? theme.text : 'text-zinc-200'}`}>
                      {section.name}
                    </h3>
                    {section.items.length > 0 && (
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${theme.bg} ${theme.text}`}>
                        {completed}/{section.items.length}
                      </span>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-zinc-500"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </div>
                <ProgressBar progress={progress} color={theme.bar} />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 pt-1 border-t border-zinc-800/40">
                      {section.items.length === 0 && !addingItem && (
                        <p className="text-sm text-zinc-600 text-center py-6">No items planned</p>
                      )}

                      <div className="space-y-0.5">
                        {section.items.map((item) => {
                          const priority = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.medium;
                          return (
                            <div key={item.id} className="group/item flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-zinc-800/30 transition-all">
                              <button
                                onClick={() => togglePlannedItem(section.id, item.id)}
                                className="flex-shrink-0"
                              >
                                {item.completed ? (
                                  <CheckCircle2 className={`w-[18px] h-[18px] ${theme.text}`} />
                                ) : (
                                  <Circle className="w-[18px] h-[18px] text-zinc-600 group-hover/item:text-zinc-400 transition-colors" />
                                )}
                              </button>
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${priority.dot} flex-shrink-0`} title={priority.label} />
                                <span className={`text-sm truncate transition-all ${item.completed ? 'text-zinc-500 line-through' : 'text-zinc-300 group-hover/item:text-white'}`}>
                                  {item.title}
                                </span>
                              </div>
                              <span className="text-[11px] text-zinc-600 font-mono flex-shrink-0">{item.estimatedMinutes}m</span>
                              <div className="flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity flex-shrink-0">
                                <Button variant="ghost" size="icon-sm" onClick={() => moveToTomorrow(section.id, item.id)} title="Move to tomorrow">
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon-sm" onClick={() => removeFromPlan(section.id, item.id)} title="Remove">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {addingItem === section.id ? (
                        <div className="flex items-center gap-1.5 px-2 pt-2">
                          <input
                            value={newItemTitle}
                            onChange={(e) => setNewItemTitle(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { if (newItemTitle.trim()) { addToPlan(section.id, { title: newItemTitle.trim(), estimatedMinutes: 30, priority: 'medium', completed: false, sourceType: 'custom', sourceId: null }); setNewItemTitle(''); setAddingItem(null); } } if (e.key === 'Escape') { setAddingItem(null); setNewItemTitle(''); } }}
                            placeholder="What do you want to study?"
                            className="bg-zinc-800/80 border border-zinc-700/50 rounded-lg px-2.5 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 flex-1 min-w-0"
                            autoFocus
                          />
                          <Button variant="ghost" size="icon" onClick={() => { if (newItemTitle.trim()) { addToPlan(section.id, { title: newItemTitle.trim(), estimatedMinutes: 30, priority: 'medium', completed: false, sourceType: 'custom', sourceId: null }); setNewItemTitle(''); setAddingItem(null); } }}>
                            <Plus className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => { setAddingItem(null); setNewItemTitle(''); }}>
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="add-row" onClick={() => setAddingItem(section.id)}>
                          <Plus className="w-3.5 h-3.5" />
                          Add item
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </GridLayout>
    </PageContainer>
  );
}
