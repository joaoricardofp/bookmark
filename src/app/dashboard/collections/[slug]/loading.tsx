import { BookmarkListSkeleton } from '@/components/bookmark/bookmark-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function CollectionLoading() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>
      <BookmarkListSkeleton />
    </div>
  );
}
