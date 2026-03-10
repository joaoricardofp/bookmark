'use client';

import { Tag } from '@/types/tag';
import { TagBadge } from './tag-badge';
import { cn } from '@/lib/utils';

type Props = {
  tags: Tag[];
  selected: string | null;
  onChange: (tagId: string | null) => void;
};

export function TagFilter({ tags, selected, onChange }: Props) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={cn(
          'rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
          selected === null
            ? 'border-foreground bg-foreground text-background'
            : 'border-border text-muted-foreground hover:border-foreground/50'
        )}
      >
        All
      </button>

      {tags.map((tag) => (
        <button key={tag.id} onClick={() => onChange(selected === tag.id ? null : tag.id)}>
          <TagBadge
            tag={tag}
            className={cn(
              'cursor-pointer transition-opacity',
              selected !== null && selected !== tag.id && 'opacity-40'
            )}
          />
        </button>
      ))}
    </div>
  );
}
