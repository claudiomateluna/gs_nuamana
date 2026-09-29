import type { Metadata, Viewport } from "next";
import { Inika, Quicksand, Roboto_Slab } from "next/font/google";
import { Toaster } from 'sonner';
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-context";
import { SiteConfigProvider } from "@/contexts/site-config-context";
import { loadSiteConfig } from "@/lib/site-config";
import { generateThemeCSS, generateHeaderColorsCSS, generateMenuColorsCSS, generatePromoColorsCSS, generateSlideshowColorsCSS, generateTestimonialsColorsCSS, generateVisitColorsCSS, generateFAQColorsCSS, generateSecondaryHeaderColorsCSS, generateFooterColorsCSS, generatePanelColorsCSS, generateBlogColorsCSS } from "@/lib/theme-css";
import { JsonLd } from "@/components/json-ld";
import Footer from "@/components/footer";

const inika = Inika({
  variable: "--font-inika",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nuamana.cl'),
  title: "Guías y Scouts Nua Mana - Una Nueva Aventura",
  description: "Portal oficial del Grupo Guía y Scout Nua Mana. Educación para la vida, empoderamiento juvenil y aventuras al aire libre.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/icon-192x192.png',
    apple: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "Guías y Scouts Nua Mana",
    description: "Portal oficial del Grupo Guía y Scout Nua Mana. Educación para la vida, empoderamiento juvenil y aventuras al aire libre.",
    url: 'https://nuamana.cl',
    siteName: 'Nua Mana',
    locale: 'es_CL',
    type: 'website',
    images: [{ url: '/images/logos/logo-nuamana.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nua Mana",
  },
};

export async function generateViewport(): Promise<Viewport> {
  const config = await loadSiteConfig();
  return {
    themeColor: config.theme_colors.clr7,
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await loadSiteConfig();

  // Scout network affiliations (Schema.org memberOf) — admin-editable via
  // Footer → Marca → "Afiliaciones Scout (memberOf)".
  const memberOf = [
    {
      '@type': 'Organization',
      'name': config.branding.omms_name || 'Organización Mundial del Movimiento Scout',
      'url': config.branding.omms_url || 'https://www.scout.org/',
      'department': {
        '@type': 'Organization',
        'name': config.branding.osi_name || 'Organización Scout Interamericana',
      },
    },
    {
      '@type': 'Organization',
      'name': config.branding.wagggs_name || 'World Association of Girl Guides and Girl Scouts',
      'url': config.branding.wagggs_url || 'https://www.wagggs.org/',
    },
  ];

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inika.variable} ${quicksand.variable} ${robotoSlab.variable} antialiased bg-clr1 dark:bg-dclr1 text-clr2 dark:text-dclr2`}
      >
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'EducationalOrganization',
          '@id': 'https://nuamana.cl/#organization',
          'name': config.branding.nombre_grupo,
          'legalName': config.branding.legal_name || 'Grupo de Guías y Scouts Nua Mana',
          'url': 'https://nuamana.cl',
          'logo': {
            '@type': 'ImageObject',
            'url': `https://nuamana.cl${config.branding.logo_header}`,
            'width': 512,
            'height': 512,
          },
          'image': `https://nuamana.cl${config.branding.logo_sidebar || config.branding.logo_header}`,
          'description': config.seo?.description || 'Portal oficial del Grupo Guía y Scout Nua Mana.',
          'slogan': config.branding.slogan,
          'email': config.visit?.email || 'contacto@nuamana.cl',
          'telephone': config.branding.telefono || undefined,
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': config.contact?.direccion?.replace(/<br\s*\/?>/g, ', ').replace(/<[^>]*>/g, '') || '',
            'addressLocality': config.contact?.ciudad || 'La Granja',
            'addressRegion': config.contact?.region || 'Región Metropolitana',
            'postalCode': config.contact?.codigo_postal || '8801144',
            'addressCountry': config.contact?.pais || 'CL',
          },
          'foundingDate': config.branding.founding_date || '2005-09-23',
          'isFamilyFriendly': true,
          'inLanguage': {
            '@type': 'Language',
            'name': 'Spanish',
            'alternateName': 'es',
          },
          'funder': config.branding.funder_name ? {
            '@type': 'Organization',
            'name': config.branding.funder_name,
            'url': config.branding.funder_url || undefined,
          } : undefined,
          'hasOfferCatalog': {
            '@type': 'OfferCatalog',
            'name': 'Scouts',
            'itemListElement': [
              {
                '@type': 'Offer',
                'itemOffered': {
                  '@type': 'Service',
                  'name': 'Escultismo',
                  'serviceType': 'Voluntariado',
                },
              },
              {
                '@type': 'Offer',
                'itemOffered': {
                  '@type': 'Service',
                  'name': 'Scouts',
                  'serviceType': 'Voluntariado',
                },
              },
              {
                '@type': 'Offer',
                'itemOffered': {
                  '@type': 'Service',
                  'name': 'Guías',
                  'serviceType': 'Voluntariado',
                },
              },
              {
                '@type': 'Offer',
                'itemOffered': {
                  '@type': 'Service',
                  'name': 'Educación para la Vida',
                  'serviceType': 'Voluntariado',
                },
              },
            ],
          },
          'memberOf': memberOf,
          'parentOrganization': config.branding.parent_organization_name ? {
            '@type': 'Organization',
            'name': config.branding.parent_organization_name,
            'url': config.branding.parent_organization_url || undefined,
          } : undefined,
          'sameAs': config.social_list?.items
            ?.filter(item => item.enabled && item.url && !item.url.startsWith('mailto:'))
            .sort((a, b) => a.order - b.order)
            .map(item => item.url) || [],
        }} />
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': 'https://nuamana.cl/#website',
          'name': 'Guías y Scouts Nua Mana',
          'url': 'https://nuamana.cl',
          'publisher': { '@id': 'https://nuamana.cl/#organization' },
          'inLanguage': 'es',
        }} />
        {/* SSR theme overrides: emitted before ThemeProvider/children so the
            globals.css :root palette vars are overridden on first paint (zero
            FOUC). Re-rendered on save via revalidatePath('/', 'layout') in saveSiteConfig. */}
        <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(config.theme_colors) }} />
        <style dangerouslySetInnerHTML={{ __html: generateHeaderColorsCSS(config.header_colors || {}) }} />
        <style dangerouslySetInnerHTML={{ __html: generateMenuColorsCSS(config.menu_colors || {}) }} />
        <style dangerouslySetInnerHTML={{ __html: generatePromoColorsCSS(config.promo_colors) }} />
        <style dangerouslySetInnerHTML={{ __html: generateSlideshowColorsCSS(config.slideshow_colors || {}) }} />
        <style dangerouslySetInnerHTML={{ __html: generateTestimonialsColorsCSS(config.testimonials_colors || {}) }} />
        <style dangerouslySetInnerHTML={{ __html: generateVisitColorsCSS(config.visit_colors || {}) }} />
        <style dangerouslySetInnerHTML={{ __html: generateFAQColorsCSS(config.faq_colors || {}) }} />
        <style dangerouslySetInnerHTML={{ __html: generateSecondaryHeaderColorsCSS(config.secondary_header_colors || {}) }} />
        <style dangerouslySetInnerHTML={{ __html: generateFooterColorsCSS(config.footer_colors || {}) }} />
        <style dangerouslySetInnerHTML={{ __html: generatePanelColorsCSS(config.panel_colors || {}) }} />
        <style dangerouslySetInnerHTML={{ __html: generateBlogColorsCSS(config.blog_colors || {}) }} />
        <ThemeProvider>
          <SiteConfigProvider config={config}>
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </SiteConfigProvider>
        </ThemeProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
