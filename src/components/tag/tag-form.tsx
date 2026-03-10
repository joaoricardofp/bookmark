'use client';

import { useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { createTag } from '@/actions/tag';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { gooeyToast } from '@/components/ui/goey-toaster';
import { Spinner } from '@/components/ui/spinner';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Invalid color')
    .default('#6366f1'),
});

type FormData = z.infer<typeof schema>;

type Props = {
  onSuccess?: () => void;
};

export function TagForm({ onSuccess }: Props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      color: '#6366f1',
    },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        await createTag(data);
        gooeyToast.success('Tag created');
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
                placeholder="design, dev, tools..."
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="color"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="color">Color</FieldLabel>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="color"
                  value={field.value}
                  onChange={field.onChange}
                  className="size-9 cursor-pointer rounded border bg-transparent p-1"
                />
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="#6366f1"
                  className="font-mono"
                  aria-invalid={fieldState.invalid}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : 'Create tag'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
