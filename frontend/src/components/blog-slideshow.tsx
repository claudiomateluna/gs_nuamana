'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function BlogSlideshow() {
  const [recentPosts, setRecentPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchRecent = async () => {
      const { data } = await supabase
        .from('articulos')
        .select(`*, articulo_categorias(categorias(nombre, slug))`)
        .eq('estado', 'publicado')
        .order('created_at', { ascending: false })
        .limit(10)
      
      setRecentPosts(data || [])
      setLoading(false)
    }
    fetchRecent()
  }, [])

  // Lógica de desplazamiento automático
  useEffect(() => {
    if (recentPosts.length === 0) return

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, offsetWidth, scrollWidth } = scrollRef.current
        // Calculamos el siguiente punto de scroll. 
        // Si llegamos al final (o muy cerca), volvemos al inicio.
        const isAtEnd = scrollLeft + offsetWidth >= scrollWidth - 10
        
        if (isAtEnd) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          // Desplazamos el ancho de una tarjeta aproximadamente (offsetWidth en este contenedor limitado)
          scrollRef.current.scrollBy({ left: offsetWidth / (offsetWidth > 768 ? 2 : 1), behavior: 'smooth' })
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [recentPosts])

  if (loading || recentPosts.length === 0) return null

  return (
    <section className="py-24 bg-bsclr1 dark:bg-bsdclr1 overflow-hidden">
      <div className="max-w-[1080px] mx-auto px-2 mb-12 flex justify-center items-center gap-6 flex-col text-center">
        <div>
          <h2 className="text-4xl font-black font-display uppercase text-bsclr2 dark:text-bsdclr2 leading-none">Últimas Novedades</h2>
          <p className="text-bsclr3 dark:text-bsdclr3 font-bold uppercase tracking-widest text-[1em] italic">Explora nuestras aventuras recientes</p>
          <Link href="/blog" className="text-[1em] font-black uppercase tracking-widest text-bsclr4 dark:text-bsdclr4 hover:underline">Ver Todo el Blog →</Link>
        </div>
      </div>

      {/* Contenedor limitado a 1080px para que el corte sea visible en el ancho de la página */}
      <div className="max-w-[1080px] mx-auto px-2 relative">
        <div 
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {/* Ocultar scrollbar con estilo inline para asegurar compatibilidad */}
          <style dangerouslySetInnerHTML={{ __html: `
            div::-webkit-scrollbar { display: none; }
          `}} />
          
          {recentPosts.map((post) => (
            <Link 
              key={post.id}
              href={`/blog/${post.articulo_categorias?.[0]?.categorias?.slug || 'general'}/${post.slug}`}
              className="group relative rounded-[1rem] overflow-hidden snap-center shadow-2xl border border-bsclr9 dark:border-bsdclr9 shrink-0"
            >
              {post.imagen_destacada ? (
                <img src={post.imagen_destacada} className="w-100 h-100 object-cover transition-all duration-700 group-hover:scale-110" alt={post.titulo} />
              ) : (
                <div className="w-100 h-100 bg-bsclr1 dark:bg-bsdclr1 flex items-center justify-center text-4xl font-display opacity-20">NUA MANA</div>
              )}
              
                <div className="absolute inset-0 bg-gradient-to-t from-bsclr6 via-bsclr6 to-transparent dark:from-bsdclr6 dark:via-bsdclr6 flex flex-col justify-end p-10">
                <span className="text-[0.9em] font-black text-bsclr8 dark:text-bsdclr8 mb-2 bg-bsclr7 dark:bg-bsdclr7 inline-block px-2 py-1 rounded-[0.5rem]">
                  {post.articulo_categorias?.[0]?.categorias?.nombre}
                </span>
                <h3 className="text-2xl font-black font-display text-bsclr5 dark:text-bsdclr5 uppercase leading-none tracking-tighter mb-4 group-hover:text-bsclr4 dark:group-hover:text-bsdclr4 transition-colors">
                  {post.titulo}
                </h3>
                <p className="text-bsclr3 dark:text-bsdclr3 text-xs font-bold italic line-clamp-2 leading-relaxed">
                  {post.extracto}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
