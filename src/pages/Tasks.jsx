export default function Tasks() {
  return (
    <div className="space-y-6 fade-in">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">Tasks</h2>
        <p className="text-sm text-zinc-400 mt-1">Manage and track your active tasks.</p>
      </header>
      <div className="h-96 rounded-2xl border border-zinc-800/50 bg-zinc-900/40 flex items-center justify-center shadow-sm">
        <p className="text-zinc-500 text-sm tracking-wide">Tasks List Content</p>
      </div>
    </div>
  );
}
