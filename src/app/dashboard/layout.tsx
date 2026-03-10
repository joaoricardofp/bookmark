import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { CollectionSidebar } from '@/components/collection/collection-sidebar';
import { Collection } from '@/types/collection';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/login');

  const collections = await db('collections')
    .where({ user_id: session.user.id })
    .orderBy('order', 'asc') as Collection[];

  return (
    <div className="mx-auto flex max-w-5xl gap-8 px-4 py-10">
      <CollectionSidebar collections={collections} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
