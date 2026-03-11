import { Skeleton } from '@/components/ui/skeleton';

export function BookmarkSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-4 shadow-sm">
      <Skeleton className="mt-0.5 size-4 shrink-0 rounded-sm" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <div className="flex gap-1">
        <Skeleton className="size-8 rounded-md" />
        <Skeleton className="size-8 rounded-md" />
        <Skeleton className="size-8 rounded-md" />
      </div>
    </div>
  );
}

export function BookmarkListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <BookmarkSkeleton key={i} />
      ))}
    </div>
  );
}
