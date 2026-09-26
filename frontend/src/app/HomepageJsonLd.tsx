'use client';

import { useSiteConfigSafe } from '@/contexts/site-config-context';

/**
 * Renders FAQPage JSON-LD for the homepage.
 * Reads FAQ items from site config (client-side context).
 */
export default function HomepageJsonLd() {
  const config = useSiteConfigSafe();
  const faqItems = config?.faq?.items;

  if (!faqItems || faqItems.length === 0) return null;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqItems.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer.replace(/<[^>]*>/g, ''),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c'),
      }}
    />
  );
}
