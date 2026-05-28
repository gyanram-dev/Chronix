import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useFocusStore, MODE_CONFIG, SESSION_CATEGORIES } from '../store/focusStore';
import { useSettingsStore } from '../store/settingsStore';
import { useProgressStore } from '../store/progressStore';
import {
  Play, Pause, RotateCcw, Timer, Zap, Clock, History, Target,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import GridLayout from '../components/ui/GridLayout';
import EmptyState from '../components/ui/EmptyState';

const MODES = Object.entries(MODE_CONFIG).map(([id, cfg]) => ({ id, ...cfg }));
const RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const g = ctx.createGain();
    g.connect(ctx.destination);
    g.gain.value = 0.15;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const o = ctx.createOscillator();
      o.connect(g);
      o.type = 'sine';
      o.frequency.value = freq;
      o.start(ctx.currentTime + i * 0.15);
      o.stop(ctx.currentTime + i * 0.15 + 0.4);
    });
  } catch {
    /* audio not available */
  }
}

export default function Focus() {
  const setMode = useFocusStore((s) => s.setMode);
  const start = useFocusStore((s) => s.start);
  const pause = useFocusStore((s) => s.pause);
  const resume = useFocusStore((s) => s.resume);
  const tick = useFocusStore((s) => s.tick);
  const reset = useFocusStore((s) => s.reset);
  const setCategory = useFocusStore((s) => s.setCategory);
  const sessions = useFocusStore((s) => s.sessions);
  const status = useFocusStore((s) => s.status);
  const timeRemaining = useFocusStore((s) => s.timeRemaining);
  const duration = useFocusStore((s) => s.duration);
  const focusCategory = useFocusStore((s) => s.category);

  const pomodoroDuration = useSettingsStore((s) => s.productivity.pomodoroDuration);
  const incrementProgress = useProgressStore((s) => s.incrementProgress);

  const [justCompleted, setJustCompleted] = useState(null);
  const [selectedMode, setSelectedMode] = useState('pomodoro');

  const todaySessions = useMemo(() =>
    sessions.filter((s) => s.endTime?.startsWith(new Date().toISOString().split('T')[0])),
    [sessions]
  );

  const todayMinutes = useMemo(() =>
    Math.round(todaySessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 60),
    [todaySessions]
  );

  useEffect(() => {
    const minutes = MODE_CONFIG.pomodoro.defaultMinutes;
    setMode('pomodoro', (pomodoroDuration || minutes) * 60);
  }, [pomodoroDuration, setMode]);

  useEffect(() => {
    let id;
    if (status === 'running') {
      id = setInterval(() => tick(), 1000);
    }
    return () => { if (id) clearInterval(id); };
  }, [status, tick]);

  const prevLen = useRef(sessions.length);
  useEffect(() => {
    if (sessions.length > prevLen.current) {
      const latest = sessions[0];
      if (latest && latest.category && latest.mode !== 'short-break' && latest.mode !== 'long-break') {
        incrementProgress(latest.category);
      }
      if (latest) {
        playChime();
        setTimeout(() => setJustCompleted(latest), 0);
        setTimeout(() => setJustCompleted(null), 4000);
      }
    }
    prevLen.current = sessions.length;
  }, [sessions, incrementProgress]);

  const handleModeChange = useCallback((modeId) => {
    setSelectedMode(modeId);
    const cfg = MODE_CONFIG[modeId];
    const minutes = modeId === 'pomodoro' ? pomodoroDuration : cfg.defaultMinutes;
    setMode(modeId, minutes * 60);
    setJustCompleted(null);
  }, [pomodoroDuration, setMode]);

  const handleStart = useCallback(() => {
    if (status === 'idle') {
      start();
    } else if (status === 'paused') {
      resume();
    }
  }, [status, start, resume]);

  const handlePause = useCallback(() => pause(), [pause]);
  const handleReset = useCallback(() => { reset(); setJustCompleted(null); }, [reset]);

  const progress = duration > 0 ? (duration - timeRemaining) / duration : 0;
  const offset = CIRCUMFERENCE - progress * CIRCUMFERENCE;
  const isBreak = selectedMode === 'short-break' || selectedMode === 'long-break';

  const sessionCount = sessions.length;

  return (
    <PageContainer>
      <SectionHeader
        title="Focus Session"
        description="Stay focused with Pomodoro and Deep Work sessions."
      />

      <GridLayout columns={3}>
        <StatCard icon={<Timer className="w-5 h-5 stroke-[1.5]" />} value={sessionCount} label="Total Sessions" accent />
        <StatCard icon={<Clock className="w-5 h-5 stroke-[1.5]" />} value={`${todayMinutes}m`} label="Today's Focus" />
        <StatCard icon={<Zap className="w-5 h-5 stroke-[1.5]" />} value="—" label="Current Streak" />
      </GridLayout>

      <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 md:p-8 flex flex-col items-center">
        <div className="flex items-center gap-1.5 mb-8 bg-zinc-950/50 rounded-xl p-1 border border-zinc-800/40">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedMode === m.id
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="relative mb-6">
          <svg width="280" height="280" className="transform -rotate-90">
            <circle cx="140" cy="140" r={RADIUS} fill="none" stroke="#27272a" strokeWidth="6" />
            <motion.circle
              cx="140" cy="140" r={RADIUS} fill="none"
              stroke={isBreak ? '#34d399' : '#60a5fa'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-semibold tracking-tighter text-white tabular-nums">
              {formatTime(timeRemaining)}
            </span>
            <span className="text-sm text-zinc-500 mt-2 font-medium">
              {status === 'running' && (isBreak ? 'Break time' : 'Focusing...')}
              {status === 'paused' && 'Paused'}
              {status === 'idle' && (isBreak ? 'Ready for a break' : 'Ready to focus')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <p className="text-xs text-zinc-500 mr-1">Focus on:</p>
          {SESSION_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              disabled={status !== 'idle'}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                focusCategory === cat.id
                  ? 'bg-zinc-700/80 text-white ring-1 ring-zinc-600'
                  : 'bg-zinc-800/40 text-zinc-400 hover:text-zinc-200'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {status === 'running' ? (
            <Button variant="secondary" onClick={handlePause} size="md">
              <Pause className="w-4 h-4" />
              Pause
            </Button>
          ) : (
            <Button
              variant={status === 'idle' ? 'primary' : 'secondary'}
              onClick={handleStart}
              size="md"
              disabled={status === 'idle' && !isBreak && !focusCategory}
            >
              <Play className="w-4 h-4" />
              {status === 'paused' ? 'Resume' : 'Start'}
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={handleReset} title="Reset">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {status === 'idle' && !isBreak && !focusCategory && (
          <p className="text-xs text-zinc-600 mt-3">Select a category to start focusing</p>
        )}
      </div>

      <AnimatePresence>
        {justCompleted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-emerald-900/30 bg-emerald-950/15 p-4 flex items-center gap-3"
          >
            <Target className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-emerald-300">Session completed!</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                {formatDuration(justCompleted.durationSeconds)} —{' '}
                {MODE_CONFIG[justCompleted.mode]?.label || justCompleted.mode}
                {justCompleted.category && (
                  ` — ${SESSION_CATEGORIES.find((c) => c.id === justCompleted.category)?.name || ''}`
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium tracking-tight text-zinc-200 flex items-center gap-2">
            <History className="w-4 h-4 text-zinc-500" />
            Session History
          </h3>
        </div>

        {sessions.length === 0 ? (
          <EmptyState message="No sessions yet. Complete a focus session to see your history here." />
        ) : (
          <div className="space-y-1.5">
            {sessions.slice(0, 20).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/40 border border-zinc-800/40 hover:bg-zinc-900/60 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Timer className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-zinc-300 truncate">
                      {MODE_CONFIG[session.mode]?.label || session.mode}
                      {session.category && (
                        <span className="text-zinc-500 font-normal">
                          {' '}· {SESSION_CATEGORIES.find((c) => c.id === session.category)?.name || session.category}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-xs text-zinc-600 font-mono">{formatDuration(session.durationSeconds || 0)}</span>
                  <span className="text-xs text-zinc-600">
                    {session.endTime
                      ? new Date(session.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                      : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
