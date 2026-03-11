import { Skeleton } from '@/components/ui/skeleton';
import { BookmarkListSkeleton } from '@/components/bookmark/bookmark-skeleton';

export default function PublicProfileLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-12 flex flex-col items-center gap-3">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
      <BookmarkListSkeleton />
    </div>
  );
}
