'use client';

import { useState } from 'react';
import { Bookmark } from '@/types/bookmark';
import { BookmarkCard } from './bookmark-card';
import { BookmarkForm } from './bookmark-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Text } from '../ui/typography';

type Props = {
  bookmarks: Bookmark[];
};

export function BookmarkList({ bookmarks }: Props) {
  const [editing, setEditing] = useState<Bookmark | null>(null);

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <Text variant="lead">
          No bookmarks yet
        </Text>
        <Text variant="muted">
          Add your first bookmark using the button above.
        </Text>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onEdit={setEditing}
          />
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit bookmark</DialogTitle>
          </DialogHeader>
          {editing && (
            <BookmarkForm
              bookmark={editing}
              onSuccess={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
