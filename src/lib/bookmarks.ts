import { db } from '@/lib/db';
import { Bookmark } from '@/types/bookmark';
import { Tag } from '@/types/tag';

type Options = {
  userId: string;
  collectionId?: string;
  onlyFavorites?: boolean;
};

export async function getBookmarksWithTags(options: Options): Promise<Bookmark[]> {
  const { userId, collectionId, onlyFavorites } = options;

  let query = db('bookmarks').where({ user_id: userId });

  if (collectionId) query = query.where({ collection_id: collectionId });
  if (onlyFavorites) query = query.where({ is_favorite: true });

  const bookmarks = await query.orderBy('order', 'asc');

  if (bookmarks.length === 0) return [];

  const bookmarkIds = bookmarks.map((b) => b.id);

  const tagRows = await db('bookmark_tags')
    .join('tags', 'bookmark_tags.tag_id', 'tags.id')
    .whereIn('bookmark_tags.bookmark_id', bookmarkIds)
    .select('bookmark_tags.bookmark_id', 'tags.id', 'tags.name', 'tags.color', 'tags.user_id');

  const tagsByBookmark = tagRows.reduce<Record<string, Tag[]>>((acc, row) => {
    if (!acc[row.bookmark_id]) acc[row.bookmark_id] = [];
    acc[row.bookmark_id].push({
      id: row.id,
      name: row.name,
      color: row.color,
      user_id: row.user_id,
    });
    return acc;
  }, {});

  return bookmarks.map((b) => ({ ...b, tags: tagsByBookmark[b.id] ?? [] }));
}
