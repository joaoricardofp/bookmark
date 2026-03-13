import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { headers } from 'next/headers';
import { BookmarkList } from '@/components/bookmark/bookmark-list';
import { BookmarkForm } from '@/components/bookmark/bookmark-form';
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
import { Tag } from '@/types/tag';
import { getBookmarksWithTags } from '@/lib/bookmarks';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const bookmarks = await getBookmarksWithTags({ userId: session?.user.id as string });

  const tags = (await db('tags').where({ user_id: session?.user.id })) as Tag[];

  return (
    <div>
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

      <BookmarkList bookmarks={bookmarks} tags={tags} />
    </div>
  );
}
