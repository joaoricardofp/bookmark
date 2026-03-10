import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { BookmarkList } from '@/components/bookmark/bookmark-list';
import { BookmarkForm } from '@/components/bookmark/bookmark-form';
import { Bookmark } from '@/types/bookmark';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Heading } from '@/components/ui/typography';

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/login');

  const bookmarks = await db('bookmarks')
    .where({ user_id: session.user.id })
    .orderBy('order', 'asc') as Bookmark[];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Heading>My Bookmarks</Heading>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              Add bookmark
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add bookmark</DialogTitle>
            </DialogHeader>
            <BookmarkForm />
          </DialogContent>
        </Dialog>
      </div>

      <BookmarkList bookmarks={bookmarks} />
    </div>
  );
}
