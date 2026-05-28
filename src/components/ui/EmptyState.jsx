export default function EmptyState({ icon, message, action }) {
  return (
    <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
      {icon && <div className="flex justify-center mb-4 text-zinc-600">{icon}</div>}
      <p className="text-zinc-500 text-sm">{message}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
