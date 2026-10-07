import type { MetadataRoute } from 'next'

/**
 * Robots.txt metadata route.
 *
 * Everything public is crawlable; only the private surfaces are blocked
 * (admin panel, content backoffice, auth screens, the blog editors and the
 * API handlers). Next serializes every `allow` entry before the `disallow`
 * entries of the same rule, so precedence cannot come from line order: robots
 * matchers pick the LONGEST matching path (Google's rules and RFC 9309), and
 * the disallow list below is ordered longest -> shortest so crawlers that
 * still read top-down meet the strictest rule first.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/administracion',
          '/blog/editar',
          '/blog/crear',
          '/registro',
          '/panel',
          '/login',
          '/api',
        ],
      },
    ],
    sitemap: 'https://nuamana.cl/sitemap.xml',
  }
}
