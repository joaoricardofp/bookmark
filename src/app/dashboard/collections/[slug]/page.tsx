import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { headers } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { BookmarkList } from '@/components/bookmark/bookmark-list';
import { BookmarkForm } from '@/components/bookmark/bookmark-form';
import { Bookmark } from '@/types/bookmark';
import { Collection } from '@/types/collection';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tag } from '@/types/tag';
import { getBookmarksWithTags } from '@/lib/bookmarks';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/login');

  const collection = (await db('collections').where({ user_id: session.user.id, slug }).first()) as
    | Collection
    | undefined;

  if (!collection) notFound();

  const bookmarks = await getBookmarksWithTags({
    userId: session.user.id,
    collectionId: collection.id,
  });

  const tags = (await db('tags').where({ user_id: session.user.id })) as Tag[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{collection.name}</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              Add bookmark
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add bookmark</DialogTitle>
            </DialogHeader>
            <BookmarkForm collectionId={collection.id} />
          </DialogContent>
        </Dialog>
      </div>

      <BookmarkList bookmarks={bookmarks} tags={tags} />
    </div>
  );
}
