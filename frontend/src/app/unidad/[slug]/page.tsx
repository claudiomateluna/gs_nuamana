import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generar parámetros estáticos para SSG (Static Site Generation)
export async function generateStaticParams() {
  return [
    { slug: 'manada' },
    { slug: 'compania' },
    { slug: 'tropa' },
    { slug: 'avanzada' },
    { slug: 'clan' }
  ]
}

// Generar metadatos dinámicos para SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const unitId = getUnitIdBySlug(slug)
  if (!unitId) return {}

  const { data: unit } = await supabase
    .from('unidades')
    .select('*')
    .eq('id', unitId)
    .single()

  if (!unit) return {}

  return {
    title: `${unit.nombre} ${unit.nombre_unidad ? `"${unit.nombre_unidad}"` : ''} - Guías y Scouts Nua Mana`,
    description: `${unit.descripcion}. Conoce más sobre la propuesta pedagógica, actividades y desafíos de la unidad.`,
  }
}

function getUnitIdBySlug(slug: string): number | null {
  const map: { [key: string]: number } = {
    manada: 1,
    compania: 2,
    tropa: 3,
    avanzada: 4,
    clan: 5
  }
  return map[slug.toLowerCase()] || null
}

const detailedDescriptions: { [key: number]: string } = {
  1: "La Manada de Lobatos es la primera etapa del camino scout. Aquí, niños y niñas de 7 a 11 años viven la fantasía del 'Libro de las Tierras Vírgenes' (Mowgli). Aprenden a convivir en el Pueblo Libre, guiados por Akela, Baloo y Bagheera, bajo el lema 'Siempre Mejor'. A través de juegos, talleres y el contacto con la naturaleza, los lobatos desarrollan su carácter, afectividad y sociabilidad, aprendiendo el valor de la buena acción diaria.",
  2: "La Compañía de Guías reúne a jóvenes de 11 a 15 años que se organizan en Patrullas para vivir grandes aventuras al aire libre. Guiadas por el espíritu del Escultismo, desarrollan su autonomía, liderazgo y trabajo en equipo, preparándose para ser ciudadanas activas bajo el lema 'Siempre Listas'. El sistema de patrulla les permite asumir responsabilidades reales, tomar decisiones democráticas y planificar sus propias excursiones y proyectos.",
  3: "La Tropa de Scouts es el espacio para jóvenes de 11 a 15 años donde la vida en patrulla cobra todo su sentido. A través de campamentos, excursiones, técnicas de supervivencia y especialidades, cada scout descubre su potencial y se compromete a dejar el mundo en mejores condiciones de cómo lo encontró, bajo el lema 'Siempre Listos'. La vida al aire libre es su principal aula, donde aprenden civismo, cabuyería, orientación y primeros auxilios.",
  4: "La Avanzada de Pioneros reúne a jóvenes de 15 a 17 años en la Comunidad de Pioneros. Es una etapa de grandes desafíos, proyectos colectivos ('Aventuras') y exploración de competencias. Los pioneros definen su propio rumbo, debaten ideas y construyen su identidad bajo el lema 'Siempre Adelante'. En esta unidad, las especialidades tradicionales se transforman en Competencias en 7 rumbos clave, impulsando el liderazgo juvenil y la participación comunitaria.",
  5: "El Clan de Caminantes (o Rovers) es la etapa terminal para jóvenes de 17 a 20 años. Los caminantes se preparan para la vida adulta remando su propia canoa. A través de proyectos de servicio comunitario, metas personales y un profundo compromiso social, emprenden el viaje hacia 'La Partida' bajo el lema 'Servir'. Su progresión se basa en proyectos individuales de 12 pasos y una agenda personal de objetivos a 6 meses para forjar ciudadanos conscientes y comprometidos."
}

export default async function UnidadPage({ params }: PageProps) {
  const { slug } = await params
  const unitId = getUnitIdBySlug(slug)
  if (!unitId) return notFound()

  // 1. Obtener datos de la unidad
  const { data: unit } = await supabase
    .from('unidades')
    .select('*')
    .eq('id', unitId)
    .single()

  if (!unit) return notFound()

  // 2. Obtener categorías para resolver las rutas jerárquicas del blog
  const { data: allCats } = await supabase.from('categorias').select('*')
  const cats = allCats || []

  const buildCatPathSlugs = (catId: number): string[] => {
    const cat = cats.find(c => c.id === catId)
    if (!cat) return []
    return cat.parent_id ? [...buildCatPathSlugs(cat.parent_id), cat.slug] : [cat.slug]
  }

  // 3. Obtener artículos del blog con sus categorías vinculadas
  const { data: articles } = await supabase
    .from('articulos')
    .select('*, articulo_categorias(categoria_id, categorias(id, nombre, slug, parent_id))')
    .eq('estado', 'publicado')
    .order('created_at', { ascending: false })

  // 4. Filtrar en memoria por la unidad especificada en el array metadata->unidades
  const slugQuery = slug === 'compania' ? 'compania' : slug
  const filteredArticles = articles?.filter(art => {
    const unidades = art.metadata?.unidades
    if (Array.isArray(unidades)) {
      return unidades.some((u: string) => {
        const normalized = u.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        const target = slugQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        return normalized === target
      })
    }
    return false
  }).slice(0, 6) || []

  // 5. Procesar las URLs de los artículos utilizando la lógica jerárquica del blog
  const processedArticles = filteredArticles.map(post => {
    const linkedCats = post.articulo_categorias?.map((ac: any) => ac.categorias).filter(Boolean) || []
    const sortedCats = [...linkedCats].sort((a, b) => buildCatPathSlugs(b.id).length - buildCatPathSlugs(a.id).length)
    const mainCat = sortedCats[0]
    const path = mainCat ? `${buildCatPathSlugs(mainCat.id).join('/')}/${post.slug}` : `general/${post.slug}`
    return { ...post, path }
  })

  return (
    <div className="bg-zinc-50 dark:bg-clr4 text-zinc-900 dark:text-zinc-100 min-h-screen flex flex-col transition-colors duration-300">
      <Header />
      
      {/* Sección Hero / Bandera Full-Screen */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Flag */}
        <div className="absolute inset-0 z-0">
          <img 
            src={unit.bandera_url || "/images/unidades/bandera_manada.jpg"} 
            alt={`Bandera de ${unit.nombre}`}
            className="w-full h-full object-cover scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-zinc-950/70 to-zinc-50 dark:to-clr4 transition-colors duration-300" />
        </div>

        {/* Contenido en 2 Columnas */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-white w-full">
          {/* Columna 1: Logo de la Unidad */}
          <div className="md:col-span-4 flex justify-center">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/20 p-6 shadow-2xl flex items-center justify-center transform hover:rotate-6 transition-transform duration-500">
              <img 
                src={unit.logo_unidad_url || "/images/logos/LogoColor.svg"} 
                alt={`Logo de ${unit.nombre}`}
                className="w-full h-full object-contain filter drop-shadow-xl" 
              />
            </div>
          </div>

          {/* Columna 2: Nombre y Descripción Corta */}
          <div className="md:col-span-8 text-center md:text-left space-y-4">
            <span className="text-[0.9em] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block bg-white/15 backdrop-blur-sm border border-white/10" style={{ color: unit.colores || '#cb3327' }}>
              Unidad del Grupo
            </span>
            <h1 className="text-[3.5em] md:text-[5.5em] font-black uppercase tracking-tighter leading-none text-white drop-shadow-lg">
              {unit.nombre}
              {unit.nombre_unidad && (
                <span className="block text-[0.4em] font-semibold tracking-normal text-zinc-200 capitalize mt-3 font-body">
                  "{unit.nombre_unidad}"
                </span>
              )}
            </h1>
            <p className="text-[1.25em] md:text-[1.75em] font-bold text-zinc-100 leading-relaxed max-w-2xl drop-shadow">
              {unit.descripcion}
            </p>
          </div>
        </div>
      </section>

      {/* Sección Fuera del Full-Screen */}
      <section className="py-20 relative z-10 border-t border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-clr4 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-6 space-y-20">
          {/* Descripción Detallada */}
          <div className="space-y-6">
            <h2 className="text-[2em] font-black uppercase tracking-tight" style={{ color: unit.colores || '#cb3327' }}>
              Nuestra Propuesta Pedagógica
            </h2>
            <p className="text-[1.15em] text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-medium">
              {detailedDescriptions[unit.id]}
            </p>
          </div>

          {/* Muestra de Actividades (Artículos) */}
          <div className="space-y-8">
            <div className="border-b border-zinc-200 dark:border-white/10 pb-4">
              <h2 className="text-[2em] font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                Actividades y Vida en la Unidad
              </h2>
              <p className="text-[0.9em] text-zinc-500 dark:text-zinc-400 font-medium">
                Explora las bitácoras, dinámicas e historias de la {unit.nombre}.
              </p>
            </div>

            {processedArticles.length === 0 ? (
              <div className="p-12 rounded-3xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-center">
                <span className="text-4xl mb-2 block">🎒</span>
                <p className="text-zinc-500 dark:text-zinc-400 font-bold">Aún no hay actividades publicadas para esta unidad.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {processedArticles.map(art => {
                  const imgUrl = art.metadata?.imagen_destacada_url || "/images/especialidades/generico.svg"
                  return (
                    <a 
                      key={art.id} 
                      href={`/blog/${art.path}`}
                      className="group rounded-3xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-48 w-full overflow-hidden relative">
                          <img 
                            src={imgUrl} 
                            alt={art.titulo} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-5 space-y-3">
                          <h4 className="font-bold text-[1.25em] text-zinc-900 dark:text-white group-hover:text-zinc-650 dark:group-hover:text-zinc-300 line-clamp-2 leading-tight uppercase">
                            {art.titulo}
                          </h4>
                          <p className="text-[0.95em] text-zinc-650 dark:text-zinc-400 line-clamp-3 leading-relaxed font-body italic">
                            {art.extracto || "Sin descripción disponible."}
                          </p>
                        </div>
                      </div>
                      <div className="p-5 pt-0 flex justify-end">
                        <span className="text-[0.8em] font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform" style={{ color: unit.colores || '#cb3327' }}>
                          Leer Más →
                        </span>
                      </div>
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
