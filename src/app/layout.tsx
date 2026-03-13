import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { GoeyToaster } from '@/components/ui/goey-toaster';
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Bookmark',
    template: '%s | Bookmark',
  },
  description: 'A personal bookmark manager with collections, tags and public profiles.',
  metadataBase: new URL('https://bookmark.jrfp.dev'),
  openGraph: {
    title: 'Bookmark',
    description: 'A personal bookmark manager with collections, tags and public profiles.',
    url: 'https://bookmark.jrfp.dev',
    siteName: 'Bookmark',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Bookmark',
    description: 'A personal bookmark manager with collections, tags and public profiles.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <GoeyToaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
