'use client';

import { useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { createCollection, updateCollection } from '@/actions/collection';
import { Collection } from '@/types/collection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { gooeyToast } from '@/components/ui/goey-toaster';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '../ui/switch';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  isPublic: z.boolean(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  collection?: Collection;
  onSuccess?: () => void;
};

export function CollectionForm({ collection, onSuccess }: Props) {
  const [isPending, startTransition] = useTransition();
  const isEditing = !!collection;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: collection?.name ?? '',
      isPublic: collection?.is_public ?? false,
    },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        if (isEditing) {
          await updateCollection({ id: collection.id, ...data });
          gooeyToast.success('Collection updated');
        } else {
          await createCollection(data);
          gooeyToast.success('Collection created');
        }
        form.reset();
        onSuccess?.();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong';
        gooeyToast.error(message);
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id="name"
                placeholder="My collection"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="isPublic"
          control={form.control}
          render={({ field }) => (
            <Field>
              <div className="flex items-center justify-between">
                <div>
                  <FieldLabel htmlFor="isPublic">Public</FieldLabel>
                  <p className="text-xs text-muted-foreground">
                    Visible on your public profile page
                  </p>
                </div>
                <Switch id="isPublic" checked={field.value} onCheckedChange={field.onChange} />
              </div>
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : isEditing ? 'Save changes' : 'Create collection'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
