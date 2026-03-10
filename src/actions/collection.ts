'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import z from 'zod';

const createSchema = z.object({
  name: z.string().min(1).max(255),
  isPublic: z.boolean().default(false),
});

const updateSchema = createSchema.partial().extend({
  id: z.uuid(),
});

type CreateInput = z.infer<typeof createSchema>;
type UpdateInput = z.infer<typeof updateSchema>;

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error('Unauthorized');

  return session.user;
}

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export async function createCollection(input: CreateInput) {
  const user = await getSession();
  const data = createSchema.parse(input);

  const slug = toSlug(data.name);

  const existing = await db('collections').where({ user_id: user.id, slug }).first();
  if (existing) throw new Error('A collection with this name already exists');

  const maxOrder = await db('collections')
    .where({ user_id: user.id })
    .max('order as max')
    .first();

  const nextOrder = (maxOrder?.max ?? -1) + 1;

  const [collection] = await db('collections')
    .insert({
      user_id: user.id,
      name: data.name,
      slug,
      is_public: data.isPublic,
      order: nextOrder,
    })
    .returning('*');

  revalidatePath('/dashboard');

  return collection;
}

export async function updateCollection(input: UpdateInput) {
  const user = await getSession();
  const { id, ...rest } = updateSchema.parse(input);

  const existing = await db('collections').where({ id, user_id: user.id }).first();
  if (!existing) throw new Error('Collection not found');

  const slug = rest.name ? toSlug(rest.name) : undefined;

  if (slug && slug !== existing.slug) {
    const slugConflict = await db('collections')
      .where({ user_id: user.id, slug })
      .whereNot({ id })
      .first();
    if (slugConflict) throw new Error('A collection with this name already exists');
  }

  const [updated] = await db('collections')
    .where({ id, user_id: user.id })
    .update({
      ...(rest.name !== undefined && { name: rest.name, slug }),
      ...(rest.isPublic !== undefined && { is_public: rest.isPublic }),
    })
    .returning('*');

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/collections/${existing.slug}`);

  return updated;
}

export async function deleteCollection(id: string) {
  const user = await getSession();

  const existing = await db('collections').where({ id, user_id: user.id }).first();
  if (!existing) throw new Error('Collection not found');

  await db('collections').where({ id, user_id: user.id }).delete();

  revalidatePath('/dashboard');
}
