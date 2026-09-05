'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export interface ParentCategoryPromo {
  id: number
  nombre: string
  slug: string
  count: number
  description: string
  badgeText: string
  icon: string
}

const CATEGORY_META: Record<string, { description: string; badgeText: string; icon: string }> = {
  actividades: {
    description: 'Juegos cooperativos, dinámicas de grupo, veladas nocturnas y desafíos al aire libre.',
    badgeText: 'Juegos y Dinámicas',
    icon: '🎲'
  },
  tecnicas: {
    description: 'Cabuyería, campismo, pionerismo, cocina de marcha, señales y primeros auxilios.',
    badgeText: 'Habilidades Scouts',
    icon: '⚜️'
  },
  historia: {
    description: 'Biografías inspiradoras, tradiciones del escultismo mundial y la historia de Nua Mana.',
    badgeText: 'Tradición e Historia',
    icon: '📜'
  }
}

export default function CategoryPromoBanner({ className = '' }: { className?: string }) {
  const [parentCategories, setParentCategories] = useState<ParentCategoryPromo[]>([])
  const [totalArticles, setTotalArticles] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchParentCategoryCounts = async () => {
      // 1. Obtener todas las categorías para construir el árbol de padres e hijos
      const { data: allCats } = await supabase.from('categorias').select('id, nombre, slug, parent_id')
      if (!allCats || allCats.length === 0) {
        setLoading(false)
        return
      }

      // 2. Obtener todas las relaciones de artículos publicados
      const { data: rawLinks } = await supabase
        .from('articulo_categorias')
        .select('categoria_id, articulos!inner(id, estado)')
        .eq('articulos.estado', 'publicado')

      if (!rawLinks) {
        setLoading(false)
        return
      }

      // Mapear cada categoría a su padre de nivel superior
      const getTopParent = (catId: number): { id: number; nombre: string; slug: string } => {
        const cat = allCats.find(c => c.id === catId)
        if (!cat) return { id: catId, nombre: 'General', slug: 'general' }
        if (!cat.parent_id) return { id: cat.id, nombre: cat.nombre, slug: cat.slug }
        return getTopParent(cat.parent_id)
      }

      // Mapear artículos únicos por categoría padre
      const parentArticleSets: Record<number, Set<string>> = {}
      const parentCatMeta: Record<number, { id: number; nombre: string; slug: string }> = {}
      const allUniqueArticleIds = new Set<string>()

      const ALLOWED_SLUGS = ['actividades', 'tecnicas', 'historia']

      rawLinks.forEach((item: any) => {
        const artId = item.articulos?.id
        if (!artId) return

        const topParent = getTopParent(item.categoria_id)
        const parentSlug = topParent.slug.toLowerCase()
        if (!ALLOWED_SLUGS.includes(parentSlug)) return

        allUniqueArticleIds.add(artId)

        if (!parentArticleSets[topParent.id]) {
          parentArticleSets[topParent.id] = new Set()
          parentCatMeta[topParent.id] = topParent
        }
        parentArticleSets[topParent.id].add(artId)
      })

      const parentList: ParentCategoryPromo[] = Object.keys(parentArticleSets)
        .map(key => {
          const pid = parseInt(key)
          const meta = parentCatMeta[pid]
          const count = parentArticleSets[pid].size
          const defaultInfo = CATEGORY_META[meta.slug] || {
            description: 'Explora nuestros contenidos de ' + meta.nombre,
            badgeText: meta.nombre,
            icon: '🏕️'
          }

          return {
            id: meta.id,
            nombre: meta.nombre,
            slug: meta.slug,
            count,
            ...defaultInfo
          }
        })
        .filter(p => p.count > 0)
        .sort((a, b) => b.count - a.count)

      setParentCategories(parentList)
      setTotalArticles(allUniqueArticleIds.size)
      setLoading(false)
    }

    fetchParentCategoryCounts()
  }, [])

  if (loading || parentCategories.length === 0) return null

  return (
    <section className="py-8 bg-cbclr9 dark:bg-cbdclr9 transition-colors">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6">
        <div
          className={`relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] p-2 shadow-xl border border-cbclr8 dark:border-cbdclr8 bg-gradient-to-br from-cbclr2 to-cbclr3 dark:from-cbdclr2 dark:to-cbdclr3 text-cbclr5 dark:text-cbdclr5 transition-colors ${className}`}
        >
          {/* Fondo decorativo con luces tenue */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-cbclr4 dark:bg-cbdclr4 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 rounded-full bg-cbclr5 dark:bg-cbdclr5 blur-[80px] pointer-events-none" />

          {/* Encabezado publicitario tipo Anuncio */}
          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-2 mb-2 sm:mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cbclr3 dark:bg-cbdclr3 border border-cbclr8 dark:border-cbdclr8 text-cbclr4 dark:text-cbdclr4 text-[0.75rem] font-black uppercase tracking-widest">
              <span>⚡ RECURSOS PEDAGÓGICOS SCOUTS</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display uppercase tracking-tight leading-tight text-cbclr4 dark:text-cbdclr4">
              ¡TENEMOS MÁS DE{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cbclr6 to-cbclr7 dark:from-cbdclr6 dark:to-cbdclr7">
                {totalArticles > 0 ? `${totalArticles}+` : '100+'}
              </span>{' '}
              RECURSOS!
            </h2>
          </div>

          {/* Tarjetas de Categorías Padre */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-2">
            {parentCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog/${cat.slug}`}
                className="group relative flex flex-col justify-between p-4 rounded-[1.25rem] md:rounded-[1.5rem] bg-cbclr1 dark:bg-cbdclr1 backdrop-blur-md bg-gradient-to-br hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl">{cat.icon}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[0.7rem] font-black uppercase tracking-wider bg-cbclr8 dark:bg-cbdclr8 text-cbclr5 dark:text-cbdclr5 border border-cbclr8 dark:border-cbdclr8">
                      {cat.badgeText}
                    </span>
                  </div>

                  <div>
                    <div className="text-3xl md:text-4xl font-black font-display tracking-tighter mb-0.5 text-cbclr6 dark:text-cbdclr6">
                      +{cat.count}
                    </div>
                    <h3 className="text-lg md:text-xl font-black font-display uppercase tracking-tight text-cbclr4 dark:text-cbdclr4 group-hover:text-cbclr6 dark:group-hover:text-cbdclr6 transition-colors">
                      {cat.nombre}
                    </h3>
                  </div>

                  <p className="text-[0.9em] font-body leading-relaxed line-clamp-2 text-cbclr5 dark:text-cbdclr5">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-cbclr8 dark:border-cbdclr8 flex items-center justify-between text-[0.75rem] font-black uppercase tracking-wider text-cbclr7 dark:text-cbdclr7 group-hover:translate-x-1 transition-transform">
                  <span>Explorar {cat.nombre} ({cat.count})</span>
                  <span className="text-base">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
