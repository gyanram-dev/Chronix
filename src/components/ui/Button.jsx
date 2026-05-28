import { forwardRef } from 'react';

const VARIANTS = {
  primary: 'bg-zinc-100 text-zinc-900 hover:bg-white transition-all text-sm font-semibold',
  secondary: 'bg-zinc-900/60 border border-zinc-800/80 hover:bg-zinc-800 text-sm font-medium text-zinc-300 transition-all hover:text-white',
  ghost: 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30 transition-all text-sm',
  danger: 'text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all text-sm font-medium',
  'add-row': 'w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30 transition-all text-sm',
};

const SIZES = {
  sm: 'px-2.5 py-1.5 rounded-lg text-xs',
  md: 'px-4 py-2.5 rounded-xl text-sm',
  icon: 'p-1.5 rounded-lg',
  'icon-sm': 'p-1 rounded-lg',
};

const Button = forwardRef(({ variant = 'secondary', size = 'md', className = '', children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 font-medium focus:outline-none ${VARIANTS[variant] || VARIANTS.secondary} ${SIZES[size] || SIZES.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
