'use client';

import { Tag } from '@/types/tag';
import { TagBadge } from './tag-badge';
import { deleteTag } from '@/actions/tag';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Text } from '@/components/ui/typography';
import { gooeyToast } from '@/components/ui/goey-toaster';

type Props = {
  tags: Tag[];
};

export function TagList({ tags }: Props) {
  if (tags.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <Text variant="lead">No tags yet</Text>
        <Text variant="muted">Create your first tag using the button above.</Text>
      </div>
    );
  }

  async function handleDelete(id: string) {
    try {
      await deleteTag(id);
      gooeyToast.success('Tag deleted');
    } catch {
      gooeyToast.error('Something went wrong');
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="flex items-center justify-between rounded-lg border bg-card px-4 py-3"
        >
          <TagBadge tag={tag} />

          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => handleDelete(tag.id)}
          >
            <Trash2 className="size-4 text-muted-foreground" />
          </Button>
        </div>
      ))}
    </div>
  );
}
