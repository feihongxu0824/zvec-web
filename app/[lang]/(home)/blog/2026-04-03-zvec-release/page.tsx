import { i18n } from '@/lib/i18n';

// A temporary redirect.

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default function RedirectPage() {
  if (typeof window !== 'undefined') {
    window.location.replace('/en/blog/2026-04-04-zvec-release/');
  }

  return (
    <meta httpEquiv="refresh" content="0;url=/en/blog/2026-04-04-zvec-release/" />
  );
}
