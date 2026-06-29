import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Guías y Scouts Nua Mana',
    short_name: 'Nua Mana',
    description: 'Portal oficial del Grupo Guía y Scout Nua Mana. Educación para la vida, empoderamiento juvenil y aventuras al aire libre.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#cb3327',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: '/icon-1024x1024.png',
        sizes: '1024x1024',
        type: 'image/png'
      }
    ],
    orientation: 'portrait',
    lang: 'es',
    dir: 'ltr'
  }
}
