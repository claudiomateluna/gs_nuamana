import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
]

/**
 * Shared cache policy for the blog surfaces (`/blog` listing and article
 * catch-all). Mirrors the `s-maxage` Next emits for `/acerca-de` and
 * `/unidad/*` under their own `revalidate = 60`:
 *   - public:              both Cloudflare edge and browsers can cache
 *   - s-maxage=60:         shared caches serve the same HTML for 60s
 *   - stale-while-revalidate=86400: while the 60s window is up, serve the
 *                          stale copy and let Next regenerate in the background
 *   - must-revalidate:     once stale, shared caches MUST revalidate instead
 *                          of serving the expired copy indefinitely
 *
 * Set on the response via next.config headers() so it applies to every
 * dynamic SSR pass. Filtered URLs (`/blog?unidades=...`) already canonicalize
 * to `/blog` on the server, so the listing cache key stays clean.
 *
 * Not applied to `/blog/crear`, `/blog/editar/[id]`, or the panel: those
 * are authenticated/dynamic routes and must not be cached.
 */
const blogCacheHeaders = [
  { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=86400, must-revalidate' },
]

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: false,
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/blog',
        headers: blogCacheHeaders,
      },
      {
        source: '/blog/:path*',
        headers: blogCacheHeaders,
      },
    ]
  },
};

export default nextConfig;
