import { SITE_URL } from '@/lib/constants';
import { i18n } from '@/lib/i18n';
import { blog, source } from '@/lib/source';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const BUILD_TIME = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Home pages
  for (const lang of i18n.languages) {
    entries.push({
      url: `${SITE_URL}/${lang}/`,
      lastModified: BUILD_TIME,
      changeFrequency: 'monthly',
      priority: 1.0,
    });
  }

  // API reference pages
  for (const lang of i18n.languages) {
    entries.push({
      url: `${SITE_URL}/${lang}/api-reference/`,
      lastModified: BUILD_TIME,
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
        lastModified: BUILD_TIME,
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }
  }

  // Blog pages (index)
  for (const lang of i18n.languages) {
    const posts = blog.getPages(lang);
    const latest = posts.reduce<Date | undefined>((acc, p) => {
      const d = p.data.date ? new Date(p.data.date) : undefined;
      if (!d || Number.isNaN(d.getTime())) return acc;
      return !acc || d > acc ? d : acc;
    }, undefined);
    entries.push({
      url: `${SITE_URL}/${lang}/blog/`,
      lastModified: latest ?? BUILD_TIME,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // Blog posts
  for (const lang of i18n.languages) {
    const posts = blog.getPages(lang);
    for (const post of posts) {
      const date = post.data.date ? new Date(post.data.date) : undefined;
      entries.push({
        url: `${SITE_URL}${post.url}/`,
        lastModified: date && !Number.isNaN(date.getTime()) ? date : BUILD_TIME,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
