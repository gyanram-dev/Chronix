export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-6 h-6 border-2 border-zinc-700 border-t-zinc-300 rounded-full animate-spin" />
      <p className="text-sm text-zinc-500">{text}</p>
    </div>
  );
}
