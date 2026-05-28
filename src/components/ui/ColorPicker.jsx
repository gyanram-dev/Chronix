const COLORS = [
  { id: 'blue', class: 'bg-blue-500', ring: 'ring-blue-400' },
  { id: 'emerald', class: 'bg-emerald-500', ring: 'ring-emerald-400' },
  { id: 'purple', class: 'bg-purple-500', ring: 'ring-purple-400' },
  { id: 'amber', class: 'bg-amber-500', ring: 'ring-amber-400' },
  { id: 'rose', class: 'bg-rose-500', ring: 'ring-rose-400' },
];

export default function ColorPicker({ value, onChange, label }) {
  return (
    <div>
      {label && <p className="text-sm font-medium text-zinc-200 mb-3">{label}</p>}
      <div className="flex items-center gap-3">
        {COLORS.map((c) => (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={`w-8 h-8 rounded-full ${c.class} transition-all duration-200 ${
              value === c.id
                ? 'ring-2 ring-offset-2 ring-offset-zinc-900 scale-110'
                : 'hover:scale-110 opacity-60 hover:opacity-100'
            }`}
            title={c.id.charAt(0).toUpperCase() + c.id.slice(1)}
          />
        ))}
      </div>
    </div>
  );
}
