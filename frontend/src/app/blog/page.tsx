import type { Metadata } from 'next'
import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import {
  attachArticlePaths,
  blogFiltersKey,
  fetchListingCategorias,
  fetchListingPage,
  indexCategoriasById,
  parseBlogFilters,
  resolveBlogCanonical,
  type BlogArticle,
  type BlogCategoriaOption,
} from '@/lib/blog-listing'
import type { CategoriaRow } from '@/lib/schema/types'
import BlogListing from './BlogListing'

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const filters = parseBlogFilters(await searchParams)
  const { canonical, index } = resolveBlogCanonical(filters)

  // title/description/openGraph live in blog/layout.tsx — a child segment that
  // omits those keys inherits them; only what depends on the URL is declared here.
  const metadata: Metadata = { alternates: { canonical } }
  if (!index) metadata.robots = { index: false }
  return metadata
}

interface ServerListing {
  articulos: BlogArticle[]
  categorias: BlogCategoriaOption[]
  allCategorias: CategoriaRow[]
  hasMore: boolean
  loaded: boolean
}

/**
 * First page is rendered on the server so the crawler's initial HTML already
 * contains the grid and its links. Every fetch is guarded: if Supabase is down
 * the page ships empty and `initialLoaded=false` makes the client component
 * retry, which is also why `next build` can never fail on a dead Supabase.
 */
async function loadFirstPage(filters: ReturnType<typeof parseBlogFilters>): Promise<ServerListing> {
  const empty: ServerListing = { articulos: [], categorias: [], allCategorias: [], hasMore: false, loaded: false }
  try {
    const [page, categorias] = await Promise.all([
      fetchListingPage(supabase, filters, 0),
      fetchListingCategorias(supabase),
    ])
    if (!page.rows || !categorias) return empty

    return {
      articulos: attachArticlePaths(page.rows, indexCategoriasById(categorias.allCategorias)),
      categorias: categorias.options,
      allCategorias: categorias.allCategorias,
      hasMore: page.hasMore,
      loaded: true,
    }
  } catch (err) {
    console.warn('[blog] SSR listing fetch failed, deferring to the client:', err)
    return empty
  }
}

export default async function BlogPage({ searchParams }: PageProps) {
  const filters = parseBlogFilters(await searchParams)
  const listing = await loadFirstPage(filters)

  return (
    <Suspense fallback={<div className="p-20 text-center font-display uppercase italic text-blclr6 dark:text-bldclr6">Cargando bitácora...</div>}>
      <BlogListing
        initialArticulos={listing.articulos}
        initialCategorias={listing.categorias}
        initialAllCategorias={listing.allCategorias}
        initialHasMore={listing.hasMore}
        initialFiltersKey={blogFiltersKey(filters)}
        initialLoaded={listing.loaded}
      />
    </Suspense>
  )
}
