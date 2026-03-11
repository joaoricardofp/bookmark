'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { gooeyToast } from '@/components/ui/goey-toaster';
import { Spinner } from '@/components/ui/spinner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';

const schema = z.object({
  name: z.string().min(3).max(100),
  email: z.email().trim(),
  password: z.string().min(8).max(100).trim(),
});

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      await authClient.signUp.email({
        email: data.email,
        name: data.name,
        password: data.password,
        callbackURL: '/dashboard',
        fetchOptions: {
          query: params ? Object.fromEntries(params.entries()) : undefined,
          onError: (ctx) => { gooeyToast.error(ctx.error.message); },
          onSuccess: () => {
            gooeyToast.success('Successfully signed up');
            router.push('/dashboard');
          },
        },
      });
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
              <Input {...field} id="name" type="text" placeholder="Name" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input {...field} id="email" type="email" placeholder="you@example.com" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input {...field} id="password" type="password" placeholder="Password" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : 'Register'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
