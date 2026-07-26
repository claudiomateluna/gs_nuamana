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
  gradient: string
  borderColor: string
  icon: string
}

const CATEGORY_META: Record<string, { description: string; badgeText: string; gradient: string; borderColor: string; icon: string }> = {
  actividades: {
    description: 'Juegos cooperativos, dinámicas de grupo, veladas nocturnas y desafíos al aire libre.',
    badgeText: 'Juegos y Dinámicas',
    gradient: 'from-amber-500/10 via-orange-500/5 to-red-500/10 dark:from-amber-600/20 dark:to-red-700/20',
    borderColor: 'border-amber-500/20 dark:border-amber-400/30',
    icon: '🎲'
  },
  tecnicas: {
    description: 'Cabuyería, campismo, pionerismo, cocina de marcha, señales y primeros auxilios.',
    badgeText: 'Habilidades Scouts',
    gradient: 'from-emerald-500/10 via-teal-500/5 to-cyan-500/10 dark:from-emerald-600/20 dark:to-cyan-700/20',
    borderColor: 'border-emerald-500/20 dark:border-emerald-400/30',
    icon: '⚜️'
  },
  historia: {
    description: 'Biografías inspiradoras, tradiciones del escultismo mundial y la historia de Nua Mana.',
    badgeText: 'Tradición e Historia',
    gradient: 'from-rose-500/10 via-red-500/5 to-purple-500/10 dark:from-rose-600/20 dark:to-purple-700/20',
    borderColor: 'border-rose-500/20 dark:border-rose-400/30',
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
            gradient: 'from-clr7/10 via-clr1/5 to-clr6/10',
            borderColor: 'border-clr7/20',
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
    <div className={`relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-zinc-50 via-white to-amber-50/40 dark:from-zinc-950 dark:via-zinc-900 dark:to-black p-2 text-zinc-900 dark:text-white shadow-xl border border-zinc-200/80 dark:border-zinc-800 transition-colors ${className}`}>
      {/* Fondo decorativo con luces tenue */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-clr7/10 dark:bg-clr7/15 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />

      {/* Encabezado publicitario tipo Anuncio */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-2 mb-2 sm:mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-clr7/10 dark:bg-clr7/20 border border-clr7/30 dark:border-clr7/40 text-clr7 dark:text-clr8 text-[0.75rem] font-black uppercase tracking-widest">
          <span>⚡ RECURSOS PEDAGÓGICOS SCOUTS</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display uppercase tracking-tight leading-tight text-zinc-900 dark:text-white">
          ¡TENEMOS MÁS DE{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-clr7 via-amber-500 to-clr6 dark:from-clr7 dark:via-amber-400 dark:to-clr6">
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
            className={`group relative flex flex-col justify-between p-4 rounded-[1.25rem] md:rounded-[1.5rem] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md bg-gradient-to-br ${cat.gradient} border ${cat.borderColor} hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-xl`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl">{cat.icon}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[0.7rem] font-black uppercase tracking-wider bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-white border border-zinc-200 dark:border-white/20">
                  {cat.badgeText}
                </span>
              </div>

              <div>
                <div className="text-3xl md:text-4xl font-black font-display text-clr7 dark:text-amber-400 tracking-tighter mb-0.5">
                  +{cat.count}
                </div>
                <h3 className="text-lg md:text-xl font-black font-display text-zinc-900 dark:text-white uppercase tracking-tight group-hover:text-clr7 dark:group-hover:text-amber-300 transition-colors">
                  {cat.nombre}
                </h3>
              </div>

              <p className="text-zinc-600 dark:text-zinc-400 text-[0.9em] font-body leading-relaxed line-clamp-2">
                {cat.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-200/80 dark:border-white/10 flex items-center justify-between text-[0.75rem] font-black uppercase tracking-wider text-clr7 dark:text-amber-300 group-hover:translate-x-1 transition-transform">
              <span>Explorar {cat.nombre} ({cat.count})</span>
              <span className="text-base">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
