import { SITE_URL } from '@/lib/constants';
import { i18n } from '@/lib/i18n';
import { blog, source } from '@/lib/source';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Home pages
  for (const lang of i18n.languages) {
    entries.push({
      url: `${SITE_URL}/${lang}/`,
      changeFrequency: 'monthly',
      priority: 1.0,
    });
  }

  // API reference pages
  for (const lang of i18n.languages) {
    entries.push({
      url: `${SITE_URL}/${lang}/api-reference/`,
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  }

  // Documentation pages
  for (const lang of i18n.languages) {
    const pages = source.getPages(lang);
    for (const page of pages) {
      entries.push({
        url: `${SITE_URL}${page.url}/`,
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }
  }

  // Blog pages (index)
  for (const lang of i18n.languages) {
    entries.push({
      url: `${SITE_URL}/${lang}/blog/`,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // Blog posts
  for (const lang of i18n.languages) {
    const posts = blog.getPages(lang);
    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}${post.url}/`,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
