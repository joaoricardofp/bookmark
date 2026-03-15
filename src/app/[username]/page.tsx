import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { getBookmarksWithTags } from '@/lib/bookmarks';
import { Collection } from '@/types/collection';
import { FolderOpen } from 'lucide-react';
import { Heading, Text } from '@/components/ui/typography';
import { Metadata } from 'next';
import { PublicBookmarkCard } from './public-bookmark-card';

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await db('user').where({ name: username }).first();

  if (!user) return { title: 'Profile not found' };

  return {
    title: user.name,
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;

  const user = await db('user').where({ name: username }).first();

  if (!user) notFound();

  const bookmarks = await getBookmarksWithTags({
    userId: user.id,
    onlyPublic: true,
  });

  const publicCollectionIds = [...new Set(bookmarks.map((b) => b.collection_id).filter(Boolean))];

  const collections =
    publicCollectionIds.length > 0
      ? ((await db('collections')
          .whereIn('id', publicCollectionIds)
          .orderBy('order', 'asc')) as Collection[])
      : [];

  const uncategorized = bookmarks.filter((b) => !b.collection_id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        {user.image && (
          <img
            src={user.image}
            alt={user.name}
            className="mx-auto mb-4 size-16 rounded-full object-cover"
          />
        )}

        <Heading>{user.name}</Heading>

        <Text variant="muted">{bookmarks.length} public bookmarks</Text>
      </div>

      {bookmarks.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <Text variant="lead">No public bookmarks yet</Text>
          <Text variant="muted" className="mt-1">
            This user hasn't shared any bookmarks yet.
          </Text>
        </div>
      )}

      {/* Coleções públicas */}
      {collections.map((collection) => {
        const collectionBookmarks = bookmarks.filter((b) => b.collection_id === collection.id);
        if (collectionBookmarks.length === 0) return null;

        return (
          <section key={collection.id} className="mb-10">
            <div className="mb-4 flex items-center gap-2">
              <FolderOpen className="size-4 text-muted-foreground" />
              <h2 className="font-semibold">{collection.name}</h2>
              <span className="text-xs text-muted-foreground">{collectionBookmarks.length}</span>
            </div>
            <div className="flex flex-col gap-3">
              {collectionBookmarks.map((bookmark) => (
                <PublicBookmarkCard key={bookmark.id} bookmark={bookmark} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Bookmarks sem coleção */}
      {uncategorized.length > 0 && (
        <section className="mb-10">
          {collections.length > 0 && (
            <div className="mb-4 flex items-center gap-2">
              <h2 className="font-semibold text-muted-foreground">Others</h2>
              <span className="text-xs text-muted-foreground">{uncategorized.length}</span>
            </div>
          )}
          <div className="flex flex-col gap-3">
            {uncategorized.map((bookmark) => (
              <PublicBookmarkCard key={bookmark.id} bookmark={bookmark} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
