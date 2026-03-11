export type OgData = {
  title: string;
  description: string;
  ogImage: string | null;
  favicon: string | null;
};

export async function fetchOgData(url: string): Promise<OgData> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; bookmark-bot/1.0)' },
    signal: AbortSignal.timeout(5000),
  });

  const html = await res.text();

  function getMeta(property: string): string | null {
    const match =
      html.match(
        new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i')
      ) ||
      html.match(
        new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${property}["']`, 'i')
      );
    return match?.[1] ?? null;
  }

  function getMetaName(name: string): string | null {
    const match =
      html.match(new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']+)["']`, 'i')) ||
      html.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${name}["']`, 'i'));
    return match?.[1] ?? null;
  }

  function getTitle(): string {
    return (
      getMeta('og:title') ||
      getMetaName('twitter:title') ||
      html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ||
      ''
    );
  }

  function getOgImage(): string | null {
    const raw = getMeta('og:image') || getMetaName('twitter:image');
    if (!raw) return null;
    if (raw.startsWith('http')) return raw;
    const base = new URL(url);
    return `${base.origin}${raw.startsWith('/') ? raw : `/${raw}`}`;
  }

  function getFavicon(): string | null {
    const match = html.match(/<link[^>]*rel=["'][^"']*icon[^"']*["'][^>]*href=["']([^"']+)["']/i);
    const href = match?.[1] ?? null;
    if (!href) {
      const base = new URL(url);
      return `${base.origin}/favicon.ico`;
    }
    if (href.startsWith('http')) return href;
    const base = new URL(url);
    return `${base.origin}${href.startsWith('/') ? href : `/${href}`}`;
  }

  return {
    title: getTitle(),
    description: getMeta('og:description') || getMetaName('description') || '',
    ogImage: getOgImage(),
    favicon: getFavicon(),
  };
}
