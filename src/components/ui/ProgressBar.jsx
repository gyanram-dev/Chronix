import { motion } from 'framer-motion';

export default function ProgressBar({ progress, color = 'bg-white', size = 'md', className = '' }) {
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-2.5' };
  return (
    <div
      className={`relative w-full ${heights[size] || heights.md} bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50 shadow-inner ${className}`}
    >
      <motion.div
        className={`absolute top-0 left-0 h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(progress, 100)}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}
