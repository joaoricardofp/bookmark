'use client';

import { useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { createBookmark, updateBookmark } from '@/actions/bookmark';
import { Bookmark } from '@/types/bookmark';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { gooeyToast } from '@/components/ui/goey-toaster';
import { Spinner } from '@/components/ui/spinner';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  url: z.url('Invalid URL'),
  description: z.string().max(500).optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  bookmark?: Bookmark;
  collectionId?: string;
  onSuccess?: () => void;
};

export function BookmarkForm({ bookmark, collectionId, onSuccess }: Props) {
  const [isPending, startTransition] = useTransition();
  const isEditing = !!bookmark;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: bookmark?.title ?? '',
      url: bookmark?.url ?? '',
      description: bookmark?.description ?? '',
    },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        if (isEditing) {
          await updateBookmark({ id: bookmark.id, ...data });
          gooeyToast.success('Bookmark updated');
        } else {
          await createBookmark({ ...data, collectionId });
          gooeyToast.success('Bookmark created');
        }
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
              <FieldLabel htmlFor="description">Description <span className="text-muted-foreground">(optional)</span></FieldLabel>
              <Input {...field} id="description" placeholder="A short description" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : isEditing ? 'Save changes' : 'Add bookmark'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
