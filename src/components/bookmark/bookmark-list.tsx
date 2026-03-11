'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { Bookmark } from '@/types/bookmark';
import { Tag } from '@/types/tag';
import { reorderBookmarks } from '@/actions/bookmark';
import { SortableBookmarkCard } from './sortable-bookmark-card';
import { BookmarkForm } from './bookmark-form';
import { TagFilter } from '@/components/tag/tag-filter';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Text } from '../ui/typography';
import { gooeyToast } from '@/components/ui/goey-toaster';

type Props = {
  bookmarks: Bookmark[];
  tags: Tag[];
};

export function BookmarkList({ bookmarks: initial, tags }: Props) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initial);
  const [editing, setEditing] = useState<Bookmark | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }, // evita drag acidental em cliques
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = bookmarks.findIndex((b) => b.id === active.id);
    const newIndex = bookmarks.findIndex((b) => b.id === over.id);
    const reordered = arrayMove(bookmarks, oldIndex, newIndex);

    setBookmarks(reordered); // optimistic update

    try {
      await reorderBookmarks({ ids: reordered.map((b) => b.id) });
    } catch {
      setBookmarks(bookmarks); // rollback se falhar
      gooeyToast.error('Failed to reorder bookmarks');
    }
  }

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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={bookmarks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="mt-4 flex flex-col gap-3">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                <Text variant="muted">No bookmarks with this tag.</Text>
              </div>
            ) : (
              filtered.map((bookmark) => (
                <SortableBookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onEdit={setEditing}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>

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
