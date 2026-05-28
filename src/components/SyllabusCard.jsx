import { useState } from 'react';
import { ChevronDown, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSyllabusStore } from '../store/syllabusStore';

const COLORS = {
  blue: {
    border: 'border-blue-500/20',
    hoverBorder: 'hover:border-blue-500/40',
    bar: 'bg-blue-500',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    checkbox: 'text-blue-400',
  },
  purple: {
    border: 'border-purple-500/20',
    hoverBorder: 'hover:border-purple-500/40',
    bar: 'bg-purple-500',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    checkbox: 'text-purple-400',
  },
  emerald: {
    border: 'border-emerald-500/20',
    hoverBorder: 'hover:border-emerald-500/40',
    bar: 'bg-emerald-500',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    checkbox: 'text-emerald-400',
  },
  amber: {
    border: 'border-amber-500/20',
    hoverBorder: 'hover:border-amber-500/40',
    bar: 'bg-amber-500',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    checkbox: 'text-amber-400',
  },
  rose: {
    border: 'border-rose-500/20',
    hoverBorder: 'hover:border-rose-500/40',
    bar: 'bg-rose-500',
    text: 'text-rose-400',
    bg: 'bg-rose-500/10',
    checkbox: 'text-rose-400',
  },
};

export default function SyllabusCard({ subject }) {
  const { toggleTopic } = useSyllabusStore();
  const [isOpen, setIsOpen] = useState(false);

  const totalTopics = subject.topics.length;
  const completedTopics = subject.topics.filter((t) => t.completed).length;
  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const isComplete = progress === 100;
  const theme = COLORS[subject.color] || COLORS.blue;

  return (
    <div
      className={`rounded-2xl border ${theme.border} ${theme.hoverBorder} bg-zinc-900/40 shadow-sm transition-all duration-300 overflow-hidden ${
        isOpen ? 'ring-1 ring-zinc-700/50' : ''
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 focus:outline-none"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-medium tracking-wide ${isComplete ? theme.text : 'text-zinc-200'}`}>
            {subject.name}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500 font-mono bg-zinc-950/50 px-2.5 py-1 rounded-md border border-zinc-800/50">
              {completedTopics} <span className="text-zinc-600">/</span> {totalTopics}
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

        <div className="flex items-center justify-between mt-3">
          <span className={`text-sm font-medium ${isComplete ? theme.text : 'text-zinc-400'}`}>
            {progress}% complete
          </span>
          {isComplete && (
            <span className={`text-xs font-medium ${theme.text} ${theme.bg} px-2 py-0.5 rounded-full`}>
              Completed
            </span>
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
            <div className="px-6 pb-5 pt-1 border-t border-zinc-800/40 space-y-1">
              {subject.topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(subject.id, topic.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-800/30 transition-all group"
                >
                  {topic.completed ? (
                    <CheckCircle2 className={`w-[18px] h-[18px] ${theme.checkbox} flex-shrink-0`} />
                  ) : (
                    <Circle className="w-[18px] h-[18px] text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm transition-all ${
                      topic.completed
                        ? 'text-zinc-500 line-through'
                        : 'text-zinc-300 group-hover:text-white'
                    }`}
                  >
                    {topic.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
