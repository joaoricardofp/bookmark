'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import z from 'zod';

const createSchema = z.object({
  title: z.string().min(1).max(255),
  url: z.url('Invalid URL'),
  description: z.string().max(500).optional(),
  collectionId: z.uuid().optional(),
  isFavorite: z.boolean().default(false),
  isPublic: z.boolean().default(false),
  ogImage: z.string().optional(),
  favicon: z.string().optional(),
});

const updateSchema = createSchema.partial().extend({
  id: z.uuid(),
});

const reorderSchema = z.object({
  ids: z.array(z.string()),
});

type CreateInput = z.infer<typeof createSchema>;
type UpdateInput = z.infer<typeof updateSchema>;
type ReorderInput = z.infer<typeof reorderSchema>;

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error('Unauthorized');

  return session.user;
}

export async function createBookmark(input: CreateInput) {
  const user = await getSession();
  const data = createSchema.parse(input);

  const maxOrder = await db('bookmark').where({ userId: user.id }).max('order as max').first();

  const nextOrder = (maxOrder?.max ?? -1) + 1;

  const [bookmark] = await db('bookmark')
    .insert({
      userId: user.id,
      title: data.title,
      url: data.url,
      description: data.description,
      collectionId: data.collectionId,
      isFavorite: data.isFavorite,
      isPublic: data.isPublic,
      ogImage: data.ogImage,
      favicon: data.favicon,
      order: nextOrder,
    })
    .returning('*');

  revalidatePath('/dashboard');

  return bookmark;
}

export async function updateBookmark(input: UpdateInput) {
  const user = await getSession();
  const { id, ...rest } = updateSchema.parse(input);

  const existing = await db('bookmark').where({ id, userId: user.id }).first();

  if (!existing) throw new Error('Bookmark not found');

  const [update] = await db('bookmark')
    .where({ id, userId: user.id })
    .update({
      ...(rest.title && { title: rest.title }),
      ...(rest.url && { url: rest.url }),
      ...(rest.description && { description: rest.description }),
      ...(rest.collectionId && { collectionId: rest.collectionId }),
      ...(rest.isFavorite && { isFavorite: rest.isFavorite }),
      ...(rest.isPublic && { isPublic: rest.isPublic }),
      ...(rest.ogImage && { ogImage: rest.ogImage }),
      ...(rest.favicon && { favicon: rest.favicon }),
    })
    .returning('*');

  revalidatePath('/dashbard');

  return update;
}

export async function deleteBookmark(id: string) {
  const user = await getSession();

  const existing = await db('bookmark').where({ id, userId: user.id }).first();

  if (!existing) throw new Error('Bookmark not found');

  await db('bookmark').where({ id, userId: user.id }).delete();

  revalidatePath('/dashboard');
}

export async function toogleFavorite(id: string) {
  const user = await getSession();

  const existing = await db('bookmark').where({ id, userId: user.id }).first();

  if (!existing) throw new Error('Bookmark not found');

  const [update] = await db('bookmark')
    .where({ id, userId: user.id })
    .update({
      isFavorite: !existing.isFavorite,
    })
    .returning('*');

  revalidatePath('/dashboard');

  return update;
}

export async function reorderBookmarks(input: ReorderInput) {
  const user = await getSession();
  const { ids } = reorderSchema.parse(input);

  await db.transaction(async (trx) => {
    await Promise.all(
      ids.map((id, index) =>
        trx('bookmark').where({ id, userId: user.id }).update({ order: index })
      )
    );
  });

  revalidatePath('/dashboard');
}
