import { Heading, Link, Text } from '@/components/ui/typography';
import { GalleryVerticalEndIcon } from 'lucide-react';

export default function AuthLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <Link href="/">
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEndIcon className="size-6" />
              </div>
              <span className="sr-only">LinkHub</span>
            </Link>
            <Heading>{title}</Heading>
            <Text variant="muted">{description}</Text>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
