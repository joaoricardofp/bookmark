import { BookmarkListSkeleton } from '@/components/bookmark/bookmark-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function FavoritesLoading() {
  return (
    <div>
      <div className="mb-6">
        <Skeleton className="h-8 w-28" />
      </div>
      <BookmarkListSkeleton />
    </div>
  );
}
