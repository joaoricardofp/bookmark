'use client';

import { useTransition, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { createBookmark, updateBookmark } from '@/actions/bookmark';
import { applyTagToBookmark, createTag } from '@/actions/tag';
import { Bookmark } from '@/types/bookmark';
import { Tag } from '@/types/tag';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { gooeyToast } from '@/components/ui/goey-toaster';
import { Spinner } from '@/components/ui/spinner';
import { TagBadge } from '@/components/tag/tag-badge';
import { cn } from '@/lib/utils';
import { Plus, X } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  url: z.url('Invalid URL'),
  description: z.string().max(500).optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  bookmark?: Bookmark;
  collectionId?: string;
  tags?: Tag[];
  onSuccess?: () => void;
};

export function BookmarkForm({ bookmark, collectionId, tags = [], onSuccess }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isCreatingTag, setIsCreatingTag] = useTransition();
  const isEditing = !!bookmark;

  // tags já aplicadas no bookmark (edição) ou selecionadas agora (criação)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    bookmark?.tags?.map((t) => t.id) ?? []
  );

  // estado para criar nova tag inline
  const [newTagName, setNewTagName] = useState('');
  const [showNewTag, setShowNewTag] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>(tags);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: bookmark?.title ?? '',
      url: bookmark?.url ?? '',
      description: bookmark?.description ?? '',
    },
  });

  function toggleTag(tagId: string) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  }

  function handleCreateTag() {
    if (!newTagName.trim()) return;

    setIsCreatingTag(async () => {
      try {
        const tag = await createTag({ name: newTagName.trim(), color: '#6366f1' });
        setAllTags((prev) => [...prev, tag]);
        setSelectedTagIds((prev) => [...prev, tag.id]);
        setNewTagName('');
        setShowNewTag(false);
        gooeyToast.success('Tag created');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong';
        gooeyToast.error(message);
      }
    });
  }

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        let bookmarkId: string;

        if (isEditing) {
          const updated = await updateBookmark({ id: bookmark.id, ...data });
          bookmarkId = updated.id;
          gooeyToast.success('Bookmark updated');
        } else {
          const created = await createBookmark({ ...data, collectionId });
          bookmarkId = created.id;
          gooeyToast.success('Bookmark created');
        }

        // aplica as tags selecionadas
        await Promise.all(
          selectedTagIds.map((tagId) =>
            applyTagToBookmark({ bookmarkId, tagId })
          )
        );

        form.reset();
        onSuccess?.();
      } catch {
        gooeyToast.error('Something went wrong');
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input {...field} id="title" placeholder="My bookmark" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="url"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="url">URL</FieldLabel>
              <Input {...field} id="url" type="url" placeholder="https://example.com" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">
                Description{' '}
                <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Input {...field} id="description" placeholder="A short description" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Seleção de tags */}
        <Field>
          <FieldLabel>
            Tags{' '}
            <span className="text-muted-foreground">(optional)</span>
          </FieldLabel>

          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
              >
                <TagBadge
                  tag={tag}
                  className={cn(
                    'cursor-pointer transition-opacity',
                    !selectedTagIds.includes(tag.id) && 'opacity-40'
                  )}
                />
              </button>
            ))}

            {/* Criar nova tag inline */}
            {showNewTag ? (
              <div className="flex items-center gap-1">
                <Input
                  autoFocus
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); handleCreateTag(); }
                    if (e.key === 'Escape') { setShowNewTag(false); setNewTagName(''); }
                  }}
                  placeholder="tag name"
                  className="h-6 w-24 px-2 text-xs"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  disabled={isCreatingTag}
                  onClick={handleCreateTag}
                >
                  {isCreatingTag ? <Spinner /> : <Plus className="size-3" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => { setShowNewTag(false); setNewTagName(''); }}
                >
                  <X className="size-3" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowNewTag(true)}
                className="inline-flex items-center gap-1 rounded-full border border-dashed px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-foreground/50 hover:text-foreground"
              >
                <Plus className="size-3" />
                New tag
              </button>
            )}
          </div>
        </Field>

        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : isEditing ? 'Save changes' : 'Add bookmark'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}