'use client';

import { Bookmark } from '@/types/bookmark';
import { Tag } from '@/types/tag';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { TagBadge } from '@/components/tag/tag-badge';

export function PublicBookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  async function handleClick() {
    fetch(`/api/bookmarks/click/${bookmark.id}`, {
      method: 'POST',
      keepalive: true,
    });
  }

  return (
    <Link
      href={bookmark.url}
      onClick={handleClick}
      target="_blank"
      className="group flex items-start gap-3 rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-muted/50 no-underline"
    >
      {bookmark.favicon ? (
        <img src={bookmark.favicon} alt="" className="mt-0.5 size-4 shrink-0 rounded-sm" />
      ) : (
        <div className="mt-0.5 size-4 shrink-0 rounded-sm bg-muted" />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="font-medium group-hover:underline">{bookmark.title}</span>
          <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
        </div>

        {bookmark.description && (
          <p className="mt-1 text-sm text-muted-foreground">{bookmark.description}</p>
        )}

        <p className="mt-1 truncate text-xs text-muted-foreground">{bookmark.url}</p>

        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {bookmark.tags.map((tag: Tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
