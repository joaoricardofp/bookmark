import { Skeleton } from '@/components/ui/skeleton';

export function TagSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="size-8 rounded-md" />
    </div>
  );
}

export function TagListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <TagSkeleton key={i} />
      ))}
    </div>
  );
}
