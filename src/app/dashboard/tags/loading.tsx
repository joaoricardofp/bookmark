import { TagListSkeleton } from '@/components/tag/tag-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function TagsLoading() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
      <TagListSkeleton />
    </div>
  );
}
