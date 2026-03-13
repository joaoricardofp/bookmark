import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { BookmarkList } from '@/components/bookmark/bookmark-list';
import { getBookmarksWithTags } from '@/lib/bookmarks';
import { Tag } from '@/types/tag';
import { Heading } from '@/components/ui/typography';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Favorites',
};

export default async function FavoritesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/login');

  const bookmarks = await getBookmarksWithTags({
    userId: session.user.id,
    onlyFavorites: true,
  });

  const tags = (await db('tags').where({ user_id: session.user.id })) as Tag[];

  return (
    <div>
      <div className="mb-6">
        <Heading>Favorites</Heading>
      </div>

      <BookmarkList bookmarks={bookmarks} tags={tags} />
    </div>
  );
}
