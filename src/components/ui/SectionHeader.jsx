export default function SectionHeader({ title, description, action }) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">{title}</h2>
        {description && <p className="text-sm text-zinc-400 mt-1">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </header>
  );
}
