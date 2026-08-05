import type { MetadataRoute } from 'next'
import { loadSiteConfig } from '@/lib/site-config'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const config = await loadSiteConfig();
  const { pwa } = config;

  return {
    name: pwa.name,
    short_name: pwa.short_name,
    description: pwa.description,
    start_url: '/',
    display: 'standalone',
    background_color: pwa.background_color,
    theme_color: pwa.theme_color,
    icons: [
      {
        src: pwa.icon_192,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: pwa.icon_512,
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: pwa.icon_1024,
        sizes: '1024x1024',
        type: 'image/png'
      }
    ],
    orientation: 'portrait',
    lang: pwa.lang,
    dir: 'ltr'
  }
}
