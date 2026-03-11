'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bookmark } from '@/types/bookmark';
import { BookmarkCard } from './bookmark-card';
import { GripVertical } from 'lucide-react';

type Props = {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
};

export function SortableBookmarkCard({ bookmark, onEdit }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: bookmark.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-4" />
      </button>

      <div className="min-w-0 flex-1">
        <BookmarkCard bookmark={bookmark} onEdit={onEdit} />
      </div>
    </div>
  );
}
