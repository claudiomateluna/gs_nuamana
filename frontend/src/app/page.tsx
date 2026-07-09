'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Hero from '@/components/hero';
import FAQ from '@/components/faq';
import Testimonials from '@/components/testimonials';
import Visitanos from '@/components/visit-section';
import FeaturesSection from '@/components/features-section';
import BlogSlideshow from '@/components/blog-slideshow';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Obtener sesión
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <div className="bg-white dark:bg-clr4 transition-colors">
      <Header />
      
      <main className="w-full overflow-x-hidden">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <FeaturesSection />

        {/* Blog Slideshow */}
        <BlogSlideshow />

        {/* Testimonials */}
        <Testimonials />

        {/* Visit Section */}
        <Visitanos />

        {/* FAQ Section */}
        <FAQ />

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-clr1 via-white to-clr2/20 dark:from-clr4 dark:via-black/20 dark:to-clr7/20" />
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-clr7/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-clr8/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="max-w-[1080px] mx-auto px-6 relative z-10 text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-7xl font-black font-display uppercase tracking-tighter leading-none">
                {user ? (
                  <>
                    <span className="text-clr5 dark:text-clr1 block italic text-2xl mb-4 font-body">¡Nos alegra verte de nuevo!</span>
                    <span className="text-clr7 block">Explora tu Panel</span>
                  </>
                ) : (
                  <>
                    <span className="text-clr5 dark:text-clr1 block">¿Listo para comenzar</span>
                    <span className="text-clr7 block">tu aventura?</span>
                  </>
                )}
              </h2>
              <p className="text-xl md:text-2xl text-clr2 font-body font-bold italic max-w-2xl mx-auto leading-relaxed">
                {user 
                  ? "Accede a tus herramientas de gestión, revisa tus bitácoras y mantente al día con el grupo."
                  : "Únete a la comunidad guía y scout más grande y comienza hoy mismo tu camino de crecimiento personal."
                }
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4">
              {user ? (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-12 py-6 bg-clr7 text-white font-black font-display uppercase rounded-[2.5rem] shadow-2xl hover:scale-105 active:scale-95 transition-all tracking-widest text-lg"
                >
                  Ir a mi Panel Personal
                </button>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/registro')}
                    className="px-12 py-6 bg-clr7 text-white font-black font-display uppercase rounded-[2.5rem] shadow-2xl hover:scale-105 active:scale-95 transition-all tracking-widest text-lg"
                  >
                    ¡Únete Ahora!
                  </button>
                  <button
                    onClick={() => router.push('/login')}
                    className="px-12 py-6 border-4 border-clr5 dark:border-clr1 text-clr5 dark:text-clr1 font-black font-display uppercase rounded-[2.5rem] hover:bg-clr5 hover:text-white dark:hover:bg-clr1 dark:hover:text-clr4 transition-all tracking-widest text-lg shadow-xl"
                  >
                    Iniciar Sesión
                  </button>
                </>
              )}
            </div>

            {deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="mt-12 text-[0.8em] font-black uppercase tracking-[0.3em] text-clr2 hover:text-clr7 transition-colors underline decoration-dotted underline-offset-8"
              >
                Instalar Aplicación
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
