import { useState } from 'react';
import { useAcademicStore } from '../store/academicStore';
import AcademicCard from '../components/AcademicCard';
import { BookOpen, CheckCircle, Target, Plus, Pencil, Trash2, X, Check, GraduationCap } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Academic() {
  const { semesters, setActiveSemester, addSemester, deleteSemester, editSemester, addSubject } = useAcademicStore();
  const [showSemModal, setShowSemModal] = useState(false);
  const [semName, setSemName] = useState('');
  const [editingSemId, setEditingSemId] = useState(null);
  const [editingSemName, setEditingSemName] = useState('');
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [subjectName, setSubjectName] = useState('');

  const activeSemester = semesters.find((s) => s.activeSemester) || semesters[0];
  const subjects = activeSemester?.subjects || [];

  const totalTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0);
  const completedTopics = subjects.reduce((acc, s) => acc + s.topics.filter((t) => t.completed).length, 0);
  const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const handleAddSemester = () => {
    if (semName.trim()) {
      addSemester(semName.trim());
      setSemName('');
      setShowSemModal(false);
    }
  };

  const handleSaveSemester = (id) => {
    if (editingSemName.trim()) {
      editSemester(id, editingSemName.trim());
    }
    setEditingSemId(null);
  };

  const handleAddSubject = () => {
    if (subjectName.trim() && activeSemester) {
      addSubject(activeSemester.id, subjectName.trim());
      setSubjectName('');
      setShowSubjectModal(false);
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">Academic Workspace</h2>
          <p className="text-sm text-zinc-400 mt-1">Manage your semester subjects and track topic progress.</p>
        </div>
      </header>

      {/* Semester Switcher */}
      <div className="flex items-center gap-3 flex-wrap">
        <GraduationCap className="w-5 h-5 text-zinc-500 flex-shrink-0" />
        {semesters.map((sem) => (
          <div key={sem.id} className="flex items-center gap-1">
            {editingSemId === sem.id ? (
              <div className="flex items-center gap-1">
                <input
                  value={editingSemName}
                  onChange={(e) => setEditingSemName(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700/50 rounded-lg px-2.5 py-1.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600 w-32"
                  autoFocus
                />
                <button
                  onClick={() => handleSaveSemester(sem.id)}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setEditingSemId(null)}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveSemester(sem.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    sem.activeSemester
                      ? 'bg-zinc-800/80 text-white ring-1 ring-zinc-700/50'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                >
                  {sem.name}
                </button>
                {sem.activeSemester && (
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => { setEditingSemId(sem.id); setEditingSemName(sem.name); }}
                      className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all"
                      title="Edit semester"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${sem.name}" and all its subjects?`)) {
                          deleteSemester(sem.id);
                        }
                      }}
                      className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-all"
                      title="Delete semester"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <button
          onClick={() => setShowSemModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all border border-dashed border-zinc-700/50"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Semester
        </button>
      </div>

      {/* Stats */}
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
            <p className="text-xs text-emerald-500/70 uppercase tracking-wider font-medium mt-0.5">Topics Done</p>
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

      {/* Subjects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium tracking-tight text-zinc-200">Subjects</h3>
          <button
            onClick={() => setShowSubjectModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:bg-zinc-800 text-sm font-medium text-zinc-300 transition-all hover:text-white"
          >
            <Plus className="w-4 h-4" />
            Add Subject
          </button>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
            <p className="text-zinc-500 text-sm">No subjects yet. Add your first subject to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {subjects.map((subject, idx) => (
              <AcademicCard key={subject.id} subject={subject} semesterId={activeSemester.id} colorIndex={idx} />
            ))}
          </div>
        )}
      </div>

      {/* Add Semester Modal */}
      <AnimatePresence>
        {showSemModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowSemModal(false)}
            />
            <motion.div
              className="relative w-full max-w-sm mx-4 rounded-2xl border border-zinc-700/50 bg-zinc-900/90 backdrop-blur-xl p-6 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold tracking-tight text-zinc-100">New Semester</h3>
                <button onClick={() => setShowSemModal(false)} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); handleAddSemester(); }}
                className="space-y-5"
              >
                <input
                  value={semName}
                  onChange={(e) => setSemName(e.target.value)}
                  placeholder="e.g. Semester 5"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all text-sm"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowSemModal(false)} className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all text-sm font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-100 text-zinc-900 hover:bg-white transition-all text-sm font-semibold">
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Subject Modal */}
      <AnimatePresence>
        {showSubjectModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowSubjectModal(false)}
            />
            <motion.div
              className="relative w-full max-w-sm mx-4 rounded-2xl border border-zinc-700/50 bg-zinc-900/90 backdrop-blur-xl p-6 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold tracking-tight text-zinc-100">New Subject</h3>
                <button onClick={() => setShowSubjectModal(false)} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); handleAddSubject(); }}
                className="space-y-5"
              >
                <input
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g. Database Systems"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all text-sm"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowSubjectModal(false)} className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all text-sm font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-100 text-zinc-900 hover:bg-white transition-all text-sm font-semibold">
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
