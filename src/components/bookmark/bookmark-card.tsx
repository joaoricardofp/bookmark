'use client';

import { Bookmark } from '@/types/bookmark';
import { toggleFavorite, deleteBookmark } from '@/actions/bookmark';
import { Button } from '@/components/ui/button';
import { Star, Trash2, Pencil, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '../ui/typography';

type Props = {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
};

export function BookmarkCard({ bookmark, onEdit }: Props) {
  return (
    <>
      <div className="flex items-start gap-3 rounded-lg border bg-card p-4 shadow-sm">
        {bookmark.favicon ? (
          <img src={bookmark.favicon} alt="" className="mt-0.5 size-4 shrink-0 rounded-sm" />
        ) : (
          <div className="mt-0.5 size-4 shrink-0 rounded-sm bg-muted" />
        )}

        <div className="min-w-0 flex flex-1 items-start flex-col">
          <Link href={bookmark.url} className="flex items-start justify-center gap-2">
            {bookmark.title}
            <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
          </Link>

          {bookmark.description && (
            <p className="mt-1 truncate text-sm text-muted-foreground">{bookmark.description}</p>
          )}

          <p className="mt-1 truncate text-xs text-muted-foreground">{bookmark.url}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => toggleFavorite(bookmark.id)}
          >
            <Star
              className={cn(
                'size-4',
                bookmark.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
              )}
            />
          </Button>

          <Button variant="ghost" size="icon" className="size-8" onClick={() => onEdit(bookmark)}>
            <Pencil className="size-4 text-muted-foreground" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => deleteBookmark(bookmark.id)}
          >
            <Trash2 className="size-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </>
  );
}
