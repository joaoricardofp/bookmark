import { Link } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Heading, Text } from '@/components/ui/typography';
import { Bookmark } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl border bg-card shadow-sm">
          <Bookmark className="size-6" />
        </div>

        <div className="flex flex-col gap-2">
          <Heading>Bookmark</Heading>
          <Text variant="muted">Save, organize and share your favorite links.</Text>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button asChild>
          <Link href="/register" className="text-secondary-foreground no-underline hover:text-secondary-foreground">
            Get started
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/login" className="text-secondary-foreground no-underline">
            Sign in
          </Link>
        </Button>
      </div>
    </div>
  );
}
