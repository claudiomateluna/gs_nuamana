'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '@/contexts/theme-context';
import { useSiteConfigSafe } from '@/contexts/site-config-context';

interface Review {
  authorName: string;
  profilePhoto: string;
  rating: number;
  text: string;
  relativeTime: string;
  authorUrl?: string;
}

interface ReviewsData {
  placeName?: string;
  rating?: number;
  userRatingsTotal?: number;
  reviews: Review[];
}

const FALLBACK_CONFIG = {
  titulo_seccion: 'Lo que dicen de nosotros',
};

const Testimonials = () => {
  const { theme } = useTheme();
  const config = useSiteConfigSafe();
  const tituloSeccion = config?.testimonials?.titulo_seccion ?? FALLBACK_CONFIG.titulo_seccion;

  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;
  const mapsUrl = placeId
    ? `https://www.google.com/maps/place/?q=place_id:${placeId}`
    : 'https://maps.google.com';

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    setLoading(true);

    const fetchReviews = async (retries = 2, delay = 600) => {
      try {
        const res = await fetch('/api/google-reviews', { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const resData = await res.json();
        if (isMounted) {
          if (resData.reviews) {
            setData(resData);
          } else {
            setError(resData.error || 'No se pudieron cargar las reseñas.');
          }
          setLoading(false);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        if (retries > 0 && isMounted) {
          await new Promise((r) => setTimeout(r, delay));
          return fetchReviews(retries - 1, delay * 2);
        }
        if (isMounted) {
          console.error('Error fetching Google Reviews:', err);
          setError('Ocurrió un inconveniente al obtener las opiniones.');
          setLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Lógica de autoscroll similar al BlogSlideshow
  useEffect(() => {
    if (!data?.reviews || data.reviews.length === 0) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, offsetWidth, scrollWidth } = scrollRef.current;
        const isAtEnd = scrollLeft + offsetWidth >= scrollWidth - 15;

        if (isAtEnd) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Desplaza 1 tarjeta según el ancho de pantalla
          const scrollAmount = offsetWidth > 768 ? offsetWidth / 3 : offsetWidth * 0.85;
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [data]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { offsetWidth } = scrollRef.current;
      const scrollAmount = offsetWidth > 768 ? offsetWidth / 2 : offsetWidth * 0.85;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= Math.round(rating) ? 'text-amber-400 font-normal' : 'text-gray-300 dark:text-zinc-600'}
        >
          ★
        </span>
      );
    }
    return <div className="flex gap-1 text-[1.1em]">{stars}</div>;
  };

  return (
    <section className="py-20 bg-tsclr1 dark:bg-tsdclr1 border-y border-tsclr8 dark:border-tsdclr8 transition-colors overflow-hidden">
      <div className="max-w-[1080px] mx-auto px-6">
        
        {/* Encabezado */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold font-display text-tsclr2 dark:text-tsdclr2 tracking-tight uppercase mb-3">
            {tituloSeccion}
          </h2>
          <p className="text-[1em] text-tsclr3 dark:text-tsdclr3">
            Reseñas reales de nuestra comunidad en Google Maps
          </p>

          {/* Badge de Rating Promedio */}
          {data?.rating && (
            <div className="inline-flex items-center gap-3 mt-5 px-5 py-2 bg-tsclr4 dark:bg-tsdclr4 rounded-full border border-tsclr8 dark:border-tsdclr8 shadow-sm">
              <span className="text-[1.1em] font-medium text-tsclr5 dark:text-tsdclr5">{data.rating.toFixed(1)}</span>
              {renderStars(data.rating)}
              <span className="text-[0.85em] text-tsclr6 dark:text-tsdclr6">
                ({data.userRatingsTotal} opiniones)
              </span>
            </div>
          )}
        </div>

        {/* Estado: Cargando */}
        {loading && (
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="w-full md:w-[340px] shrink-0 bg-tsclr4 dark:bg-tsdclr4 p-6 rounded-2xl border border-tsclr8 dark:border-tsdclr8 animate-pulse h-52"
              />
            ))}
          </div>
        )}

        {/* Estado: Error */}
        {!loading && error && (
          <div className="text-center py-8 px-4 bg-amber-50 dark:bg-zinc-900/50 rounded-xl border border-amber-200 dark:border-amber-900/30 max-w-md mx-auto">
            <p className="text-[0.9em] text-amber-800 dark:text-amber-300">
              {error}
            </p>
          </div>
        )}

        {/* Slider de Testimonios */}
        {!loading && data?.reviews && data.reviews.length > 0 && (
          <div className="relative group/slider">
            
            {/* Botón Izquierda */}
            <button
              onClick={() => handleScroll('left')}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-tsclr4 dark:bg-tsdclr4 border border-tsclr8 dark:border-tsdclr8 text-tsclr5 dark:text-tsdclr5 flex items-center justify-center shadow-lg hover:bg-tsclr7 hover:text-white dark:hover:bg-tsdclr7 transition-all opacity-0 group-hover/slider:opacity-100 hidden md:flex"
              aria-label="Anterior"
            >
              ‹
            </button>

            {/* Contenedor carrusel */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto py-4 px-1 snap-x snap-mandatory scroll-smooth"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <style dangerouslySetInnerHTML={{
                __html: `div::-webkit-scrollbar { display: none; }`
              }} />

              {data.reviews.map((rev, index) => (
                <div
                  key={index}
                  className="w-[85vw] sm:w-[340px] shrink-0 snap-center bg-tsclr4 dark:bg-tsdclr4 p-6 rounded-2xl border border-tsclr8 dark:border-tsdclr8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      {renderStars(rev.rating)}
                      <span className="text-[0.8em] text-tsclr6 dark:text-tsdclr6">{rev.relativeTime}</span>
                    </div>

                    <p className="text-[0.95em] text-tsclr5 dark:text-tsdclr5 line-clamp-4 leading-relaxed mb-6">
                      "{rev.text}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-tsclr8 dark:border-tsdclr8">
                    {rev.profilePhoto ? (
                      <img
                        src={rev.profilePhoto}
                        alt={rev.authorName}
                        className="w-10 h-10 rounded-full object-cover border border-tsclr8 dark:border-tsdclr8"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-tsclr7 text-tsclr7 flex items-center justify-center font-bold text-[0.9em]">
                        {rev.authorName.charAt(0)}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      {rev.authorUrl ? (
                        <a
                          href={rev.authorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[0.9em] font-medium text-tsclr5 dark:text-tsdclr5 hover:text-tsclr7 dark:hover:text-tsdclr7 truncate block transition-colors"
                        >
                          {rev.authorName}
                        </a>
                      ) : (
                        <p className="text-[0.9em] font-medium text-tsclr5 dark:text-tsdclr5 truncate">
                          {rev.authorName}
                        </p>
                      )}
                      <span className="text-[0.8em] text-tsclr6 dark:text-tsdclr6 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 fill-current text-blue-500" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        Google Maps
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Botón Derecha */}
            <button
              onClick={() => handleScroll('right')}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-tsclr4 dark:bg-tsdclr4 border border-tsclr8 dark:border-tsdclr8 text-tsclr5 dark:text-tsdclr5 flex items-center justify-center shadow-lg hover:bg-tsclr7 hover:text-white dark:hover:bg-tsdclr7 transition-all opacity-0 group-hover/slider:opacity-100 hidden md:flex"
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>
        )}

        {/* Botón a Google Maps */}
        <div className="text-center mt-10">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-tsclr4 dark:bg-tsdclr4 border border-tsclr8 dark:border-tsdclr8 text-tsclr5 dark:text-tsdclr5 font-medium text-[0.9em] hover:bg-tsclr1 dark:hover:bg-tsdclr1 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Ver todas las reseñas en Google Maps
          </a>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
