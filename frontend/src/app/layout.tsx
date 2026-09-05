import type { Metadata, Viewport } from "next";
import { Inika, Quicksand, Roboto_Slab } from "next/font/google";
import { Toaster } from 'sonner';
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-context";
import { SiteConfigProvider } from "@/contexts/site-config-context";
import { loadSiteConfig } from "@/lib/site-config";
import { generateThemeCSS, generateHeaderColorsCSS, generateMenuColorsCSS, generatePromoColorsCSS, generateSlideshowColorsCSS, generateTestimonialsColorsCSS, generateVisitColorsCSS, generateFAQColorsCSS, generateSecondaryHeaderColorsCSS, generateFooterColorsCSS, generatePanelColorsCSS } from "@/lib/theme-css";
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

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inika.variable} ${quicksand.variable} ${robotoSlab.variable} antialiased bg-clr1 dark:bg-dclr1 text-clr2 dark:text-dclr2`}
      >
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
