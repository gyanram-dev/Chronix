export default function StatCard({ icon, value, label, accent = false }) {
  const border = accent ? 'border-emerald-900/20 bg-emerald-950/10' : 'border-zinc-800/50 bg-zinc-900/40';
  const iconWrap = accent
    ? 'bg-emerald-900/30 text-emerald-400'
    : 'bg-zinc-800 text-zinc-300';
  const valueCls = accent ? 'text-emerald-400' : 'text-white';
  const labelCls = accent ? 'text-emerald-500/70' : 'text-zinc-400';

  return (
    <div className={`rounded-2xl border ${border} p-4 md:p-5 shadow-sm flex items-center gap-3 md:gap-4 transition-all hover:bg-zinc-900/60`}>
      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${iconWrap} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className={`text-xl md:text-2xl font-semibold ${valueCls} truncate`}>{value}</p>
        <p className={`text-[11px] md:text-xs ${labelCls} uppercase tracking-wider font-medium mt-0.5`}>{label}</p>
      </div>
    </div>
  );
}
