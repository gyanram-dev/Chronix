export default function Dashboard() {
  return (
    <div className="space-y-6 fade-in">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">Dashboard</h2>
        <p className="text-sm text-zinc-400 mt-1">Overview of your productivity and upcoming tasks.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-zinc-800 mb-3" />
            <div className="w-1/2 h-4 rounded bg-zinc-800/80 mb-2" />
            <div className="w-1/3 h-3 rounded bg-zinc-800/50" />
          </div>
        ))}
      </div>
      
      <div className="h-96 rounded-2xl border border-zinc-800/50 bg-zinc-900/40 flex items-center justify-center shadow-sm">
        <p className="text-zinc-500 text-sm tracking-wide">Main Dashboard Content</p>
      </div>
    </div>
  );
}
