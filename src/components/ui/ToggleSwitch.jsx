import { motion } from 'framer-motion';

export default function ToggleSwitch({ enabled, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        {label && <p className="text-sm font-medium text-zinc-200">{label}</p>}
        {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
          enabled ? 'bg-zinc-600' : 'bg-zinc-800'
        }`}
      >
        <motion.div
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow-md ${
            enabled ? 'bg-white' : 'bg-zinc-500'
          }`}
          animate={{ x: enabled ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}
