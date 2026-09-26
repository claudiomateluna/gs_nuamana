'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Categoria {
  id: number
  nombre: string
}

interface DashBitacorasProps {
  articulos: any[]
  filter: string
  setFilter: (f: string) => void
  onDelete: (id: string) => void
  isAdmin: boolean
  inactive?: boolean
  totalCount: number
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  categorias: Categoria[]
  selectedCategoriaId: number | ''
  setSelectedCategoriaId: (id: number | '') => void
}

export default function DashBitacoras({ 
  articulos, filter, setFilter, onDelete, isAdmin, inactive, 
  totalCount, hasMore, loadingMore, onLoadMore,
  searchQuery, setSearchQuery, categorias, selectedCategoriaId, setSelectedCategoriaId
}: DashBitacorasProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (value: string) => {
    setLocalSearch(value)
    const timeout = setTimeout(() => setSearchQuery(value), 300)
    return () => clearTimeout(timeout)
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500 text-[1em]">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar artículos por título..."
          value={localSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-3 pl-10 bg-pclr3 dark:bg-pdclr3 border border-pclr13 dark:border-pdclr13 rounded-xl text-[0.9em] font-bold placeholder:text-pclr7 placeholder:opacity-50 focus:outline-none focus:border-pclr6 transition-colors"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pclr7 opacity-50">🔍</span>
        {localSearch && (
          <button
            onClick={() => { setLocalSearch(''); setSearchQuery(''); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-pclr7 opacity-50 hover:opacity-100"
          >
            ✕
          </button>
        )}
      </div>

      {/* Toggle Filters */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-[0.85em] font-bold uppercase text-pclr7 dark:text-pdclr7 opacity-60 hover:opacity-100 transition-opacity"
      >
        <span>Filtros</span>
        <span className={`transition-transform ${showFilters ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 bg-pclr3 dark:bg-pdclr3 rounded-xl border border-pclr13 dark:border-pdclr13 space-y-4">
          {/* Status Filter */}
          <div>
            <label className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 mb-2 block">Estado</label>
            <div className="flex flex-wrap gap-2">
              {['todos', 'publicado', 'borrador', 'revision'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setFilter(s)} 
                  className={`px-4 py-1 rounded-xl text-[0.85em] uppercase tracking-wider transition-all ${
                    filter === s ? 'bg-pclr10 text-pclr12 shadow-md' : 'bg-pclr1 dark:bg-pdclr1 text-pclr7 opacity-60 hover:opacity-100'
                  }`}
                >
                  {s === 'revision' ? 'En Revisión' : s}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          {categorias.length > 0 && (
            <div>
              <label className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 mb-2 block">Categoría</label>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setSelectedCategoriaId('')} 
                  className={`px-4 py-1 rounded-xl text-[0.85em] uppercase tracking-wider transition-all ${
                    selectedCategoriaId === '' ? 'bg-pclr10 text-pclr12 shadow-md' : 'bg-pclr1 dark:bg-pdclr1 text-pclr7 opacity-60 hover:opacity-100'
                  }`}
                >
                  Todas
                </button>
                {categorias.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => setSelectedCategoriaId(cat.id)} 
                    className={`px-4 py-1 rounded-xl text-[0.85em] uppercase tracking-wider transition-all ${
                      selectedCategoriaId === cat.id ? 'bg-pclr10 text-pclr12 shadow-md' : 'bg-pclr1 dark:bg-pdclr1 text-pclr7 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Count */}
        <div className="text-[0.8em] font-bold uppercase text-pclr7 dark:text-pdclr7 opacity-60">
          {totalCount} artículo{totalCount !== 1 ? 's' : ''}
        </div>
        {!inactive && (
          <Link 
            href="/blog/crear" 
            className="px-6 py-3 bg-pclr10 text-pclr12 font-bold uppercase rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all tracking-widest text-[0.8em]"
          >
            🚀 Nuevo Articulo
          </Link>
        )}
      </div>

      {/* Articles List */}
      <div className="grid gap-3">
        {articulos.map((art: any) => (
          <div key={art.id} className="p-2 sm:p-4 bg-pclr3 dark:bg-pdclr3 rounded-2xl flex justify-between items-center group hover:bg-pclr3 dark:hover:bg-pdclr1 transition-all border border-transparent hover:border-pclr14">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-pclr1 dark:bg-pdclr1 flex items-center justify-center shrink-0 shadow-sm">
                {art.imagen_destacada ? (
                  <img src={art.imagen_destacada} className="w-full h-full object-cover rounded-lg" alt="thumb" />
                ) : (
                  <span className="text-xl">📄</span>
                )}
              </div>
              <div>
                <p className="font-bold text-[0.9em] text-pclr4 dark:text-pclr4 uppercase truncate max-w-[200px] md:max-w-md">
                  {art.titulo}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className={`text-[0.8em] font-bold uppercase px-2 py-0.5 rounded-md ${
                    art.estado === 'publicado' ? 'bg-pclr6 text-pclr12 dark:bg-pdclr6 dark:text-pdclr12' : 'bg-pclr5 text-pclr12 dark:bg-pdclr5 dark:text-pdclr12'
                  }`}>
                    {art.estado}
                  </span>
                  {/* Show categories from join table */}
                  {art.articulo_categorias?.map((ac: any) => ac.categorias?.nombre).filter(Boolean).map((catName: string) => (
                    <span key={catName} className="text-[0.8em] font-bold uppercase px-2 py-0.5 rounded-md bg-pclr8 text-pclr12 dark:bg-pdclr8 dark:text-pdclr12">
                      {catName}
                    </span>
                  ))}
                  <span className="text-[0.8em] opacity-40 font-bold uppercase">
                    {new Date(art.created_at).toLocaleDateString()}
                  </span>
                  
                  {/* Acciones para Móvil */}
                  <div className="flex sm:hidden items-center gap-3 ml-1 border-l pl-3 border-pclr13">
                    {!inactive && (
                      <>
                        <Link href={`/blog/editar/${art.id}`} className="text-[0.8em] font-black text-pclr6 uppercase underline">Editar</Link>
                        <button onClick={() => onDelete(art.id)} className="text-[0.8em] font-black text-pclr4 uppercase underline">Eliminar</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Acciones para Desktop */}
            <div className="hidden sm:flex gap-2">
              {!inactive && (
                <>
                  <Link 
                    href={`/blog/editar/${art.id}`} 
                    className="p-2 bg-pclr1 dark:bg-pdclr1 rounded-lg shadow-sm border hover:bg-pclr10 hover:text-pclr12 transition-all"
                    title="Editar"
                  >
                    ✏️
                  </Link>
                  <button 
                    onClick={() => onDelete(art.id)}
                    className="p-2 bg-pclr1 dark:bg-pdclr1 rounded-lg shadow-sm border hover:bg-pclr10 hover:text-pclr12 transition-all"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {articulos.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed rounded-[3rem] opacity-40">
            <p className="italic uppercase tracking-widest text-[0.8em]">No se encontraron artículos con este filtro.</p>
          </div>
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="px-8 py-3 bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 font-bold uppercase rounded-xl border border-pclr13 dark:border-pdclr13 hover:bg-pclr1 dark:hover:bg-pdclr1 transition-all disabled:opacity-50"
          >
            {loadingMore ? 'Cargando...' : 'Cargar más artículos'}
          </button>
        </div>
      )}
    </div>
  )
}
