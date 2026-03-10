'use client';

import { useState } from 'react';
import { Collection } from '@/types/collection';
import { deleteCollection } from '@/actions/collection';
import { CollectionForm } from './collection-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pencil, Trash2, Plus, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gooeyToast } from '@/components/ui/goey-toaster';

type Props = {
  collections: Collection[];
};

export function CollectionSidebar({ collections }: Props) {
  const pathname = usePathname();
  const [editing, setEditing] = useState<Collection | null>(null);

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

      {collections.map((collection) => (
        <div
          key={collection.id}
          className={cn(
            'group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted',
            pathname === `/dashboard/collections/${collection.slug}` && 'bg-muted font-medium'
          )}
        >
          <FolderOpen className="size-3.5 shrink-0 text-muted-foreground" />

          <Link
            href={`/dashboard/collections/${collection.slug}`}
            className="min-w-0 flex-1 truncate"
          >
            {collection.name}
          </Link>

          <div className="hidden shrink-0 items-center gap-0.5 group-hover:flex">
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={() => setEditing(collection)}
            >
              <Pencil className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={() => handleDelete(collection)}
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        </div>
      ))}

      {collections.length === 0 && (
        <p className="px-2 text-xs text-muted-foreground">No collections yet</p>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit collection</DialogTitle>
          </DialogHeader>
          {editing && (
            <CollectionForm
              collection={editing}
              onSuccess={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </aside>
  );
}
