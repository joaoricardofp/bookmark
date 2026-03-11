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
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Collection } from '@/types/collection';
import { deleteCollection, reorderCollections } from '@/actions/collection';
import { CollectionForm } from './collection-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Pencil, Trash2, Plus, FolderOpen, Star, Tag, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gooeyToast } from '@/components/ui/goey-toaster';

function SortableCollectionItem({
  collection,
  pathname,
  onEdit,
  onDelete,
}: {
  collection: Collection;
  pathname: string;
  onEdit: (c: Collection) => void;
  onDelete: (c: Collection) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: collection.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted',
        pathname === `/dashboard/collections/${collection.slug}` && 'bg-muted font-medium'
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-3.5" />
      </button>

      <FolderOpen className="size-3.5 shrink-0 text-muted-foreground" />

      <Link
        href={`/dashboard/collections/${collection.slug}`}
        className="min-w-0 flex-1 truncate"
      >
        {collection.name}
      </Link>

      <div className="hidden shrink-0 items-center gap-0.5 group-hover:flex">
        <Button variant="ghost" size="icon" className="size-6" onClick={() => onEdit(collection)}>
          <Pencil className="size-3" />
        </Button>
        <Button variant="ghost" size="icon" className="size-6" onClick={() => onDelete(collection)}>
          <Trash2 className="size-3" />
        </Button>
      </div>
    </div>
  );
}

type Props = {
  collections: Collection[];
};

export function CollectionSidebar({ collections: initial }: Props) {
  const pathname = usePathname();
  const [collections, setCollections] = useState<Collection[]>(initial);
  const [editing, setEditing] = useState<Collection | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = collections.findIndex((c) => c.id === active.id);
    const newIndex = collections.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(collections, oldIndex, newIndex);

    setCollections(reordered);

    try {
      await reorderCollections({ ids: reordered.map((c) => c.id) });
    } catch {
      setCollections(collections);
      gooeyToast.error('Failed to reorder collections');
    }
  }

  async function handleDelete(collection: Collection) {
    try {
      await deleteCollection(collection.id);
      gooeyToast.success('Collection deleted');
    } catch {
      gooeyToast.error('Something went wrong');
    }
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col gap-1">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Collections
        </span>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="size-6">
              <Plus className="size-3.5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New collection</DialogTitle>
            </DialogHeader>
            <CollectionForm />
          </DialogContent>
        </Dialog>
      </div>

      <Link
        href="/dashboard"
        className={cn(
          'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted',
          pathname === '/dashboard' && 'bg-muted font-medium'
        )}
      >
        All bookmarks
      </Link>

      <Link
        href="/dashboard/favorites"
        className={cn(
          'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted',
          pathname === '/dashboard/favorites' && 'bg-muted font-medium'
        )}
      >
        <Star className="size-3.5 text-muted-foreground" />
        Favorites
      </Link>

      <Link
        href="/dashboard/tags"
        className={cn(
          'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted',
          pathname === '/dashboard/tags' && 'bg-muted font-medium'
        )}
      >
        <Tag className="size-3.5 text-muted-foreground" />
        Tags
      </Link>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={collections.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {collections.map((collection) => (
            <SortableCollectionItem
              key={collection.id}
              collection={collection}
              pathname={pathname}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </DndContext>

      {collections.length === 0 && (
        <p className="px-2 text-xs text-muted-foreground">No collections yet</p>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit collection</DialogTitle>
          </DialogHeader>
          {editing && (
            <CollectionForm collection={editing} onSuccess={() => setEditing(null)} />
          )}
        </DialogContent>
      </Dialog>
    </aside>
  );
}
