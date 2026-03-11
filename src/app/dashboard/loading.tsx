import { BookmarkListSkeleton } from '@/components/bookmark/bookmark-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>
      <BookmarkListSkeleton />
    </div>
  );
}
