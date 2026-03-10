'use client';

import { useState } from 'react';
import { Bookmark } from '@/types/bookmark';
import { Tag } from '@/types/tag';
import { BookmarkCard } from './bookmark-card';
import { BookmarkForm } from './bookmark-form';
import { TagFilter } from '@/components/tag/tag-filter';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Text } from '../ui/typography';

type Props = {
  bookmarks: Bookmark[];
  tags: Tag[];
};

export function BookmarkList({ bookmarks, tags }: Props) {
  const [editing, setEditing] = useState<Bookmark | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filtered = selectedTag
    ? bookmarks.filter((b) => b.tags?.some((t) => t.id === selectedTag))
    : bookmarks;

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <Text variant="lead">No bookmarks yet</Text>
        <Text variant="muted">Add your first bookmark using the button above.</Text>
      </div>
    );
  }

  return (
    <>
      <TagFilter tags={tags} selected={selectedTag} onChange={setSelectedTag} />

      <div className="mt-4 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <Text variant="muted">No bookmarks with this tag.</Text>
          </div>
        ) : (
          filtered.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} onEdit={setEditing} />
          ))
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit bookmark</DialogTitle>
          </DialogHeader>
          {editing && (
            <BookmarkForm bookmark={editing} tags={tags} onSuccess={() => setEditing(null)} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}