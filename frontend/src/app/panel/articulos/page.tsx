'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useDashboardContext } from '@/contexts/DashboardContext'
import { supabase } from '@/lib/supabase'
import { isInactive } from '@/lib/roles'
import type { Articulo } from '@/types'

const DashBitacoras = dynamic(() => import('@/components/dashboard/p_articulos'), { ssr: false })

const PAGE_SIZE = 12

interface Categoria {
  id: number
  nombre: string
}

export default function ArticulosPage() {
  const { perfil, directivo, nnj, fetchProfile, loading: ctxLoading } = useDashboardContext()
  
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [filter, setFilter] = useState('todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | ''>('')
  const [categorias, setCategorias] = useState<Categoria[]>([])

  // Fetch categories from the categorias table
  useEffect(() => {
    if (!perfil) return
    const fetchCategorias = async () => {
      const { data } = await supabase.from('categorias').select('id, nombre').order('nombre')
      setCategorias((data || []) as Categoria[])
    }
    fetchCategorias()
  }, [perfil?.id])

  const buildFilters = useCallback((query: any) => {
    if (!directivo && nnj && perfil?.id) {
      query = query.eq('autor_id', perfil.id)
    }
    if (filter !== 'todos') {
      query = query.eq('estado', filter)
    }
    if (selectedCategoriaId !== '') {
      query = query.eq('articulo_categorias.categoria_id', selectedCategoriaId)
    }
    if (searchQuery.trim()) {
      query = query.ilike('titulo', `%${searchQuery.trim()}%`)
    }
    return query
  }, [directivo, nnj, perfil?.id, filter, selectedCategoriaId, searchQuery])

  const fetchArticulos = useCallback(async (offset: number, append: boolean) => {
    try {
      // Get count (use head:true for lightweight count)
      if (offset === 0) {
        let countQuery = supabase.from('articulos').select('*', { count: 'exact', head: true })
        countQuery = buildFilters(countQuery)
        const { count } = await countQuery
        setTotalCount(count || 0)
      }

      // Get paginated data with join
      let query = supabase.from('articulos').select('*, articulo_categorias(categorias(id, nombre))')
        .order('created_at', { ascending: false })
      query = buildFilters(query)
      const { data } = await query.range(offset, offset + PAGE_SIZE - 1)
      
      if (append) {
        setArticulos(prev => [...prev, ...(data || []) as Articulo[]])
      } else {
        setArticulos((data || []) as Articulo[])
      }
      
      setHasMore((data || []).length === PAGE_SIZE)
    } catch (err) {
      console.error('Error fetching articulos:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [buildFilters])

  // Initial fetch
  useEffect(() => {
    if (!perfil) return
    setLoading(true)
    setArticulos([])
    setHasMore(true)
    fetchArticulos(0, false)
  }, [perfil?.id, filter, selectedCategoriaId, searchQuery])

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    fetchArticulos(articulos.length, true)
  }, [loadingMore, hasMore, articulos.length, fetchArticulos])

  if (ctxLoading || loading) {
    return <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">Cargando...</div>
  }

  if (!perfil) return null

  return (
    <div className="animate-in fade-in duration-500">
      <DashBitacoras
        articulos={articulos}
        filter={filter}
        setFilter={setFilter}
        onDelete={async (id) => { /* TODO */ }}
        isAdmin={directivo}
        inactive={isInactive(perfil)}
        totalCount={totalCount}
        hasMore={hasMore}
        loadingMore={loadingMore}
        onLoadMore={loadMore}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categorias={categorias}
        selectedCategoriaId={selectedCategoriaId}
        setSelectedCategoriaId={setSelectedCategoriaId}
      />
    </div>
  )
}
