export default function SettingsSection({ icon: Icon, title, description, children }) {
  return (
    <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 overflow-hidden">
      <div className="px-6 pt-5 pb-3 border-b border-zinc-800/30">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="w-4 h-4 text-zinc-400" />}
          <h3 className="text-sm font-medium tracking-wide text-zinc-200">{title}</h3>
        </div>
        {description && <p className="text-xs text-zinc-500 mt-1 ml-7">{description}</p>}
      </div>
      <div className="px-6 py-4 space-y-4">
        {children}
      </div>
    </div>
  );
}
