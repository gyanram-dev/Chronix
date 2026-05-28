import { useState } from 'react';
import {
  ChevronDown, CheckCircle2, Circle, Pencil, Trash2, Plus, X, Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAcademicStore } from '../store/academicStore';

const THEME = [
  { border: 'border-blue-500/20', hoverBorder: 'hover:border-blue-500/40', bar: 'bg-blue-500', text: 'text-blue-400', bg: 'bg-blue-500/10', check: 'text-blue-400' },
  { border: 'border-emerald-500/20', hoverBorder: 'hover:border-emerald-500/40', bar: 'bg-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10', check: 'text-emerald-400' },
  { border: 'border-purple-500/20', hoverBorder: 'hover:border-purple-500/40', bar: 'bg-purple-500', text: 'text-purple-400', bg: 'bg-purple-500/10', check: 'text-purple-400' },
  { border: 'border-amber-500/20', hoverBorder: 'hover:border-amber-500/40', bar: 'bg-amber-500', text: 'text-amber-400', bg: 'bg-amber-500/10', check: 'text-amber-400' },
  { border: 'border-rose-500/20', hoverBorder: 'hover:border-rose-500/40', bar: 'bg-rose-500', text: 'text-rose-400', bg: 'bg-rose-500/10', check: 'text-rose-400' },
];

export default function AcademicCard({ subject, semesterId, colorIndex }) {
  const { deleteSubject, editSubject, addTopic, deleteTopic, editTopic, toggleTopic } = useAcademicStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(false);
  const [subjectName, setSubjectName] = useState(subject.name);
  const [addingTopic, setAddingTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [editingTopicTitle, setEditingTopicTitle] = useState('');

  const theme = THEME[colorIndex % THEME.length];
  const totalTopics = subject.topics.length;
  const completedTopics = subject.topics.filter((t) => t.completed).length;
  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const isComplete = progress === 100;

  const handleSaveSubject = () => {
    if (subjectName.trim()) {
      editSubject(semesterId, subject.id, subjectName.trim());
    }
    setEditingSubject(false);
  };

  const handleDeleteSubject = () => {
    if (window.confirm(`Delete "${subject.name}" and all its topics?`)) {
      deleteSubject(semesterId, subject.id);
    }
  };

  const handleAddTopic = () => {
    if (newTopicTitle.trim()) {
      addTopic(semesterId, subject.id, newTopicTitle.trim());
      setNewTopicTitle('');
    }
  };

  const handleSaveTopic = (topicId) => {
    if (editingTopicTitle.trim()) {
      editTopic(semesterId, subject.id, topicId, editingTopicTitle.trim());
    }
    setEditingTopicId(null);
  };

  return (
    <div
      className={`rounded-2xl border ${theme.border} ${theme.hoverBorder} bg-zinc-900/40 shadow-sm transition-all duration-300 overflow-hidden ${
        isOpen ? 'ring-1 ring-zinc-700/50' : ''
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-5 focus:outline-none"
      >
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {editingSubject ? (
              <div className="flex items-center gap-1.5 flex-1">
                <input
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="bg-zinc-800/80 border border-zinc-700/50 rounded-lg px-2.5 py-1.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600 w-full min-w-0"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); handleSaveSubject(); }}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setEditingSubject(false); setSubjectName(subject.name); }}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <h3 className={`font-medium tracking-wide truncate ${isComplete ? theme.text : 'text-zinc-200'}`}>
                {subject.name}
              </h3>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm text-zinc-500 font-mono bg-zinc-950/50 px-2.5 py-1 rounded-md border border-zinc-800/50">
              {completedTopics}<span className="text-zinc-600">/</span>{totalTopics}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-zinc-500"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </div>
        </div>

        <div className="relative w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50 shadow-inner">
          <motion.div
            className={`absolute top-0 left-0 h-full rounded-full ${theme.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        <div className="flex items-center justify-between mt-2.5">
          <span className={`text-xs font-medium ${isComplete ? theme.text : 'text-zinc-500'}`}>
            {progress}% complete
          </span>
          {!editingSubject && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => { setEditingSubject(true); setSubjectName(subject.name); }}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all"
                title="Edit subject"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDeleteSubject}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-all"
                title="Delete subject"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
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
            <div className="px-5 pb-4 pt-1 border-t border-zinc-800/40 space-y-0.5">
              {subject.topics.map((topic) => (
                <div key={topic.id} className="group/topic">
                  {editingTopicId === topic.id ? (
                    <div className="flex items-center gap-1.5 px-2 py-2">
                      <input
                        value={editingTopicTitle}
                        onChange={(e) => setEditingTopicTitle(e.target.value)}
                        className="bg-zinc-800/80 border border-zinc-700/50 rounded-lg px-2.5 py-1.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600 flex-1 min-w-0"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveTopic(topic.id)}
                        className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingTopicId(null)}
                        className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleTopic(semesterId, subject.id, topic.id)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-zinc-800/30 transition-all group/topic"
                    >
                      {topic.completed ? (
                        <CheckCircle2 className={`w-[18px] h-[18px] ${theme.check} flex-shrink-0`} />
                      ) : (
                        <Circle className="w-[18px] h-[18px] text-zinc-600 group-hover/topic:text-zinc-400 transition-colors flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm flex-1 text-left transition-all ${
                          topic.completed
                            ? 'text-zinc-500 line-through'
                            : 'text-zinc-300 group-hover/topic:text-white'
                        }`}
                      >
                        {topic.title}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover/topic:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => { setEditingTopicId(topic.id); setEditingTopicTitle(topic.title); }}
                          className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all"
                          title="Edit topic"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this topic?')) {
                              deleteTopic(semesterId, subject.id, topic.id);
                            }
                          }}
                          className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-all"
                          title="Delete topic"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </button>
                  )}
                </div>
              ))}

              {addingTopic ? (
                <div className="flex items-center gap-1.5 px-2 pt-2 pb-1">
                  <input
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddTopic(); if (e.key === 'Escape') { setAddingTopic(false); setNewTopicTitle(''); } }}
                    placeholder="New topic title..."
                    className="bg-zinc-800/80 border border-zinc-700/50 rounded-lg px-2.5 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 flex-1 min-w-0"
                    autoFocus
                  />
                  <button
                    onClick={handleAddTopic}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setAddingTopic(false); setNewTopicTitle(''); }}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAddingTopic(true)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 mt-1 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30 transition-all text-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add topic
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
