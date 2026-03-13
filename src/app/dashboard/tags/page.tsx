import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { TagForm } from '@/components/tag/tag-form';
import { TagList } from '@/components/tag/tag-list';
import { Tag } from '@/types/tag';
import { Heading } from '@/components/ui/typography';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tags',
};

export default async function TagsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/login');

  const tags = (await db('tags').where({ user_id: session.user.id })) as Tag[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Heading>Tags</Heading>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              New tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New tag</DialogTitle>
            </DialogHeader>
            <TagForm />
          </DialogContent>
        </Dialog>
      </div>

      <TagList tags={tags} />
    </div>
  );
}
