import { Tag } from '@/types/tag';
import { cn } from '@/lib/utils';

type Props = {
  tag: Tag;
  className?: string;
};

export function TagBadge({ tag, className }: Props) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', className)}
      style={{
        backgroundColor: `${tag.color}20`,
        color: tag.color,
        border: `1px solid ${tag.color}40`,
      }}
    >
      {tag.name}
    </span>
  );
}