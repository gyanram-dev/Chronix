import { useState } from 'react';
import { useAcademicStore } from '../store/academicStore';
import AcademicCard from '../components/AcademicCard';
import { BookOpen, CheckCircle, Target, Plus, Pencil, Trash2, X, Check, GraduationCap } from 'lucide-react';
import PageContainer from '../components/ui/PageContainer';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import GridLayout from '../components/ui/GridLayout';

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
    <PageContainer>
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">Academic Workspace</h2>
          <p className="text-sm text-zinc-400 mt-1">Manage your semester subjects and track topic progress.</p>
        </div>
      </header>

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
                <Button variant="ghost" size="icon" onClick={() => handleSaveSemester(sem.id)}><Check className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => setEditingSemId(null)}><X className="w-3.5 h-3.5" /></Button>
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
                    <Button variant="ghost" size="icon-sm" onClick={() => { setEditingSemId(sem.id); setEditingSemName(sem.name); }} title="Edit semester">
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => { if (window.confirm(`Delete "${sem.name}" and all its subjects?`)) deleteSemester(sem.id); }} title="Delete semester">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <Button variant="ghost" onClick={() => setShowSemModal(true)} className="border border-dashed border-zinc-700/50">
          <Plus className="w-3.5 h-3.5" />
          Add Semester
        </Button>
      </div>

      <GridLayout columns={3}>
        <StatCard icon={<BookOpen className="w-6 h-6 stroke-[1.5]" />} value={subjects.length} label="Subjects" />
        <StatCard icon={<CheckCircle className="w-6 h-6 stroke-[1.5]" />} value={completedTopics} label="Topics Done" accent />
        <StatCard icon={<Target className="w-6 h-6 stroke-[1.5]" />} value={`${overallProgress}%`} label="Overall Progress" />
      </GridLayout>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium tracking-tight text-zinc-200">Subjects</h3>
          <Button variant="secondary" onClick={() => setShowSubjectModal(true)}>
            <Plus className="w-4 h-4" />
            Add Subject
          </Button>
        </div>

        {subjects.length === 0 ? (
          <EmptyState message="No subjects yet. Add your first subject to get started." />
        ) : (
          <GridLayout columns={2}>
            {subjects.map((subject, idx) => (
              <AcademicCard key={subject.id} subject={subject} semesterId={activeSemester.id} colorIndex={idx} />
            ))}
          </GridLayout>
        )}
      </div>

      <Modal isOpen={showSemModal} onClose={() => setShowSemModal(false)} title="New Semester">
        <form onSubmit={(e) => { e.preventDefault(); handleAddSemester(); }} className="space-y-5">
          <input
            value={semName}
            onChange={(e) => setSemName(e.target.value)}
            placeholder="e.g. Semester 5"
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all text-sm"
            autoFocus
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowSemModal(false)} className="flex-1">Cancel</Button>
            <Button variant="primary" type="submit" className="flex-1">Create</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showSubjectModal} onClose={() => setShowSubjectModal(false)} title="New Subject">
        <form onSubmit={(e) => { e.preventDefault(); handleAddSubject(); }} className="space-y-5">
          <input
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="e.g. Database Systems"
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all text-sm"
            autoFocus
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowSubjectModal(false)} className="flex-1">Cancel</Button>
            <Button variant="primary" type="submit" className="flex-1">Create</Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}
