'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import z from 'zod';

const createSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid color').default('#6366f1'),
});

const applySchema = z.object({
  bookmarkId: z.uuid(),
  tagId: z.uuid(),
});

type CreateInput = z.infer<typeof createSchema>;
type ApplyInput = z.infer<typeof applySchema>;

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error('Unauthorized');

  return session.user;
}

export async function createTag(input: CreateInput) {
  const user = await getSession();
  const data = createSchema.parse(input);

  const existing = await db('tags').where({ user_id: user.id, name: data.name }).first();
  if (existing) throw new Error('A tag with this name already exists');

  const [tag] = await db('tags')
    .insert({
      user_id: user.id,
      name: data.name,
      color: data.color,
    })
    .returning('*');

  revalidatePath('/dashboard');

  return tag;
}

export async function deleteTag(id: string) {
  const user = await getSession();

  const existing = await db('tags').where({ id, user_id: user.id }).first();
  if (!existing) throw new Error('Tag not found');

  await db('tags').where({ id, user_id: user.id }).delete();

  revalidatePath('/dashboard');
}

export async function applyTagToBookmark(input: ApplyInput) {
  const user = await getSession();
  const data = applySchema.parse(input);

  // ownership check
  const bookmark = await db('bookmarks')
    .where({ id: data.bookmarkId, user_id: user.id })
    .first();
  if (!bookmark) throw new Error('Bookmark not found');

  const tag = await db('tags').where({ id: data.tagId, user_id: user.id }).first();
  if (!tag) throw new Error('Tag not found');

  // ignora se já existir
  await db('bookmark_tags')
    .insert({ bookmark_id: data.bookmarkId, tag_id: data.tagId })
    .onConflict(['bookmark_id', 'tag_id'])
    .ignore();

  revalidatePath('/dashboard');
}

export async function removeTagFromBookmark(input: ApplyInput) {
  const user = await getSession();
  const data = applySchema.parse(input);

  const bookmark = await db('bookmarks')
    .where({ id: data.bookmarkId, user_id: user.id })
    .first();
  if (!bookmark) throw new Error('Bookmark not found');

  await db('bookmark_tags')
    .where({ bookmark_id: data.bookmarkId, tag_id: data.tagId })
    .delete();

  revalidatePath('/dashboard');
}
