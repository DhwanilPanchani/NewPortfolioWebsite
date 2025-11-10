import { cn } from '@/lib/utils';

interface TagProps {
  label: string;
  size?: 'sm' | 'md';
  variant?: 'primary' | 'secondary' | 'accent';
}

export default function Tag({
  label,
  size = 'md',
  variant = 'primary',
}: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-colors',
        {
          'px-2 py-1 text-xs': size === 'sm',
          'px-3 py-1.5 text-sm': size === 'md',
          'bg-primary/10 text-primary hover:bg-primary/20': variant === 'primary',
          'bg-secondary/10 text-secondary hover:bg-secondary/20':
            variant === 'secondary',
          'bg-accent/10 text-accent hover:bg-accent/20': variant === 'accent',
        }
      )}
    >
      {label}
    </span>
  );
}