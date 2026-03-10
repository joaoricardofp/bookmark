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

  const maxOrder = await db('bookmarks')
    .where({ user_id: user.id })
    .max('order as max')
    .first();

  const nextOrder = (maxOrder?.max ?? -1) + 1;

  const [bookmark] = await db('bookmarks')
    .insert({
      user_id: user.id,
      title: data.title,
      url: data.url,
      description: data.description ?? null,
      collection_id: data.collectionId ?? null,
      is_favorite: data.isFavorite,
      is_public: data.isPublic,
      og_image: data.ogImage ?? null,
      favicon: data.favicon ?? null,
      order: nextOrder,
    })
    .returning('*');

  revalidatePath('/dashboard');

  return bookmark;
}

export async function updateBookmark(input: UpdateInput) {
  const user = await getSession();
  const { id, ...rest } = updateSchema.parse(input);

  const existing = await db('bookmarks').where({ id, user_id: user.id }).first();

  if (!existing) throw new Error('Bookmark not found');

  const [updated] = await db('bookmarks')
    .where({ id, user_id: user.id })
    .update({
      ...(rest.title !== undefined && { title: rest.title }),
      ...(rest.url !== undefined && { url: rest.url }),
      ...(rest.description !== undefined && { description: rest.description }),
      ...(rest.collectionId !== undefined && { collection_id: rest.collectionId }),
      ...(rest.isFavorite !== undefined && { is_favorite: rest.isFavorite }),
      ...(rest.isPublic !== undefined && { is_public: rest.isPublic }),
      ...(rest.ogImage !== undefined && { og_image: rest.ogImage }),
      ...(rest.favicon !== undefined && { favicon: rest.favicon }),
    })
    .returning('*');

  revalidatePath('/dashboard');

  return updated;
}

export async function deleteBookmark(id: string) {
  const user = await getSession();

  const existing = await db('bookmarks').where({ id, user_id: user.id }).first();

  if (!existing) throw new Error('Bookmark not found');

  await db('bookmarks').where({ id, user_id: user.id }).delete();

  revalidatePath('/dashboard');
}

export async function toggleFavorite(id: string) {
  const user = await getSession();

  const existing = await db('bookmarks').where({ id, user_id: user.id }).first();

  if (!existing) throw new Error('Bookmark not found');

  const [updated] = await db('bookmarks')
    .where({ id, user_id: user.id })
    .update({ is_favorite: !existing.is_favorite })
    .returning('*');

  revalidatePath('/dashboard');

  return updated;
}

export async function reorderBookmarks(input: ReorderInput) {
  const user = await getSession();
  const { ids } = reorderSchema.parse(input);

  await db.transaction(async (trx) => {
    await Promise.all(
      ids.map((id, index) =>
        trx('bookmarks').where({ id, user_id: user.id }).update({ order: index })
      )
    );
  });

  revalidatePath('/dashboard');
}
