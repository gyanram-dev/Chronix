export default function Card({ children, className = '', hover = true, accent = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border bg-zinc-900/40 shadow-sm overflow-hidden ${
        hover ? 'transition-all duration-300 hover:bg-zinc-900/60' : ''
      } ${accent || 'border-zinc-800/60'} ${
        accent ? '' : hover ? 'hover:border-zinc-700/80' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
