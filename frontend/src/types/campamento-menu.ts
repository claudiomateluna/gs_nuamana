export type TiempoComidaTipo = 'desayuno' | 'almuerzo' | 'bano_fruta' | 'once' | 'cena'

export type ResponsableCocinaTipo =
  | 'Manada'
  | 'Compañía'
  | 'Tropa'
  | 'Avanzada'
  | 'Clan'
  | 'Dirigentes y Guiadoras'
  | 'Apoderados'
  | 'Viaje (COCAVI)'
  | string

export type CategoriaInsumo =
  | 'Abarrotes'
  | 'Panadería'
  | 'Verdulería'
  | 'Carnicería'
  | 'Lácteos'
  | 'Condimentos y Aceites'
  | 'Bebidas'
  | 'Aseo y Cocina'

export type CategoriaPlatoReceta =
  | 'Bebida'
  | 'Liquido'
  | 'Plato Principal'
  | 'Agregado'
  | 'Agregado para Pan'
  | 'Alternativa'
  | 'Ensalada'
  | 'Fruta'
  | 'Postre'
  | 'Sopa'
  | 'bebida_liquido'
  | 'plato_principal'
  | 'agregado'
  | 'agregado_pan'
  | 'alternativa'
  | 'ensalada'
  | 'fruta'
  | 'postre'
  | 'sopa'

export function normalizarCategoriaPlato(cat?: string): string {
  if (!cat) return ''
  const c = cat.toLowerCase().trim().replace(/_/g, ' ')
  if (c === 'bebida' || c === 'bebidas') return 'Bebida'
  if (c === 'liquido' || c === 'líquido' || c === 'liquidos') return 'Liquido'
  if (c === 'bebida liquido' || c === 'bebida líquido' || c === 'bebida / liquido' || c === 'bebida / líquido' || c === 'bebida o liquido' || c === 'bebida o líquido') return 'Bebida o Liquido'
  if (c === 'plato principal' || c === 'principal') return 'Plato Principal'
  if (c === 'agregado para pan' || c === 'agregado pan') return 'Agregado para Pan'
  if (c === 'agregado' || c === 'agregados') return 'Agregado'
  if (c === 'alternativa' || c === 'alternativas') return 'Alternativa'
  if (c === 'ensalada' || c === 'ensaladas') return 'Ensalada'
  if (c === 'fruta' || c === 'frutas') return 'Fruta'
  if (c === 'postre' || c === 'postres') return 'Postre'
  if (c === 'sopa' || c === 'sopas') return 'Sopa'
  return cat
}

export function obtenerCategoriasReceta(receta?: CampamentoReceta | null): string[] {
  if (!receta) return []
  const cats: string[] = []
  if (Array.isArray(receta.categorias_plato) && receta.categorias_plato.length > 0) {
    for (const c of receta.categorias_plato) {
      const norm = normalizarCategoriaPlato(c)
      if (norm && !cats.includes(norm)) cats.push(norm)
    }
  } else if (receta.categoria_plato) {
    const norm = normalizarCategoriaPlato(receta.categoria_plato)
    if (norm && !cats.includes(norm)) cats.push(norm)
  }
  return cats
}

export interface SlotsCulinarios {
  bebidas_ids: string[]
  plato_principal_ids: string[]
  agregados_ids: string[]
  alternativas_ids: string[]
  ensaladas_ids: string[]
  postres_ids: string[]
  sopas_ids: string[]
  recetas_ids: string[]
}

/**
 * Distribuye una lista de recetas_ids dentro de los slots correspondientes
 * según las categorías de cada receta, preservando los slots existentes si ya contienen recetas.
 */
export function distribuirRecetasEnSlots(
  recetasIds: string[],
  recetasDisponibles: CampamentoReceta[],
  slotsExistentes?: Partial<SlotsCulinarios>
): SlotsCulinarios {
  const bebidas = new Set<string>(slotsExistentes?.bebidas_ids || [])
  const principales = new Set<string>(slotsExistentes?.plato_principal_ids || [])
  const agregados = new Set<string>(slotsExistentes?.agregados_ids || [])
  const alternativas = new Set<string>(slotsExistentes?.alternativas_ids || [])
  const ensaladas = new Set<string>(slotsExistentes?.ensaladas_ids || [])
  const postres = new Set<string>(slotsExistentes?.postres_ids || [])
  const sopas = new Set<string>(slotsExistentes?.sopas_ids || [])

  const estaAsignada = (id: string) => (
    bebidas.has(id) ||
    principales.has(id) ||
    agregados.has(id) ||
    alternativas.has(id) ||
    ensaladas.has(id) ||
    postres.has(id) ||
    sopas.has(id)
  )

  for (const id of recetasIds) {
    if (estaAsignada(id)) continue

    const receta = recetasDisponibles.find(r => r.id === id)
    if (!receta) {
      principales.add(id)
      continue
    }

    const cats = obtenerCategoriasReceta(receta)
    if (cats.includes('Bebida') || cats.includes('Liquido') || cats.includes('Bebida o Liquido')) {
      bebidas.add(id)
    } else if (cats.includes('Sopa')) {
      sopas.add(id)
    } else if (cats.includes('Postre') || cats.includes('Fruta')) {
      postres.add(id)
    } else if (cats.includes('Ensalada')) {
      ensaladas.add(id)
    } else if (cats.includes('Plato Principal')) {
      principales.add(id)
    } else if (cats.includes('Agregado para Pan') || cats.includes('Agregado')) {
      agregados.add(id)
    } else if (cats.includes('Alternativa')) {
      alternativas.add(id)
    } else {
      principales.add(id)
    }
  }

  const resBebidas = Array.from(bebidas)
  const resPrincipales = Array.from(principales)
  const resAgregados = Array.from(agregados)
  const resAlternativas = Array.from(alternativas)
  const resEnsaladas = Array.from(ensaladas)
  const resPostres = Array.from(postres)
  const resSopas = Array.from(sopas)

  const consolidado = Array.from(
    new Set([
      ...resBebidas,
      ...resPrincipales,
      ...resAgregados,
      ...resAlternativas,
      ...resEnsaladas,
      ...resPostres,
      ...resSopas
    ])
  )

  return {
    bebidas_ids: resBebidas,
    plato_principal_ids: resPrincipales,
    agregados_ids: resAgregados,
    alternativas_ids: resAlternativas,
    ensaladas_ids: resEnsaladas,
    postres_ids: resPostres,
    sopas_ids: resSopas,
    recetas_ids: consolidado
  }
}

export interface RecetaIngredienteItem {
  id: string
  ingrediente_nombre: string
  categoria: CategoriaInsumo
  cantidad_base: number // Cantidad requerida para `porciones_base` personas en esta preparación
  unidad_medida: string // 'unidad', 'kg', 'g', 'litro', 'paquete', 'sobre', 'bolsa'
  contenedor_formato?: string // Ej: 'Malla 1kg', 'Bolsa 1kg', 'Tarro 800g', 'Cajón 18kg', 'Paquete 400g'
  rendimiento_personas_por_contenedor?: number // ¿Para cuántas personas rinde ese contenedor?
  valor_referencia_contenedor?: number // Valor de referencia en $ CLP del contenedor en mercado / internet
  precio_referencia_unitario?: number
  proveedor?: string
}

export interface CampamentoReceta {
  id: string
  nombre: string
  tipo_comida: TiempoComidaTipo
  categoria_plato?: CategoriaPlatoReceta // Para compatibilidad simple
  categorias_plato?: CategoriaPlatoReceta[] // Soporta múltiples clasificaciones por receta
  porciones_base: number // Base estándar de comensales (ej: 10 personas)
  instrucciones?: string
  es_vegetariano?: boolean
  es_sin_lactosa?: boolean
  es_sin_gluten?: boolean
  ingredientes: RecetaIngredienteItem[]
}

/**
 * Plantilla de Comida (Nivel 2 en la jerarquía: Receta -> Plantilla -> Horario)
 * Predefine todos los slots culinarios de una comida completa (Bebida, Principal, Agregados, Ensaladas, etc.)
 */
export interface CampamentoPlantillaComida {
  id: string
  nombre: string
  tipo_comida: TiempoComidaTipo
  descripcion?: string
  // Slots estructurados de recetas
  bebidas_ids?: string[]
  plato_principal_ids?: string[]
  agregados_ids?: string[]
  alternativas_ids?: string[]
  ensaladas_ids?: string[]
  postres_ids?: string[]
  sopas_ids?: string[]
  recetas_ids: string[] // Lista consolidada para compatibilidad
  tags?: string[]
  is_custom?: boolean
  created_at?: string
  updated_at?: string
}

export interface CampamentoMenuBloque {
  id: string
  menu_id: string
  numero_dia: number // 1 a N
  orden?: number // Posición de la comida dentro del día (permite reordenar libremente)
  fecha?: string // '2026-11-01'
  dia_etiqueta: string // 'Jueves 31/10', 'Sábado 6'
  tiempo_comida: TiempoComidaTipo
  es_personalizado?: boolean // true si fue agregada manualmente por el usuario
  nombre_personalizado?: string // Ej: 'Colación Media Mañana', 'Snack de Fogón'
  responsables: ResponsableCocinaTipo[] // Soporta múltiples unidades, Jefatura o Apoderados
  plantilla_id?: string // ID de la plantilla de comida seleccionada
  // Slots culinarios estructurados:
  bebidas_ids?: string[]
  plato_principal_ids?: string[]
  agregados_ids?: string[]
  alternativas_ids?: string[]
  ensaladas_ids?: string[]
  postres_ids?: string[]
  sopas_ids?: string[]
  recetas_ids: string[] // IDs de recetas asignadas (consolidadas)
  platos_texto?: string // Ej: 'Tallarines con salsa y carne soya'
  acompanamiento_texto?: string // Ej: 'Puré', 'Arroz'
  ensalada_texto?: string // Ej: 'Repollo con zanahoria'
  bebida_texto?: string // Ej: 'Leche con chocolate', 'Té en fondo'
  pan_agregado?: string // Ej: 'Mermelada mora', 'Cecina', 'Manjar'
  alternativa_dietetica?: string // Ej: 'Margarina (Veg)', 'Mermelada (Lactosa)'
  notas?: string
}

export interface InsumoCotizadoCatalogo {
  id: string
  nombre: string
  categoria: CategoriaInsumo
  formato_envase: string // 'Paquete 400g', 'Bolsa 1kg', 'Cajón 18kg', 'Saco 25kg'
  porciones_por_envase: number // Rendimiento comercial real
  unidad_medida_compra: string // 'paquete', 'kilo', 'unidad', 'cajón', 'saco'
  precio_referencia: number // Precio en CLP
  proveedor: string // 'Super Bodega aCuenta', 'Distribuidora Franchi', 'La Vega', 'Líder', 'Panadería local'
  url_referencia?: string
  observacion?: string
}

export interface CampamentoMenu {
  id: string
  actividad_id?: string | null
  actividad_nombre?: string
  nombre: string
  numero_personas: number
  dias_totales: number
  margen_seguridad_pct: number
  precio_pan_unitario: number
  consumo_pan_diario: number // Cantidad de panes por persona al día (ej: 3)
  costo_total_estimado?: number
  costo_por_persona?: number
  proveedores?: string[] // Lista personalizada de proveedores para este menú/campamento
  proveedores_personalizados?: Record<string, string> // Insumo -> Proveedor asignado
  precios_personalizados?: Record<string, number> // Nombre ingrediente -> precio personalizado
  urls_personalizadas?: Record<string, string> // Insumo -> URL de compra / referencia del producto online
  modalidades_compra?: Record<string, 'online' | 'presencial'> // Insumo -> modalidad online/presencial
  proveedores_urls?: Record<string, string> // Proveedor -> URL del sitio web / e-commerce
  bloques: CampamentoMenuBloque[]
  created_at?: string
  updated_at?: string
}

export interface ItemCompraConsolidado {
  ingrediente_nombre: string
  categoria: CategoriaInsumo
  proveedor: string
  cantidad_requerida_neta: number
  unidad_medida: string
  formato_envase: string
  porciones_por_envase: number
  envases_a_comprar: number
  precio_unitario_envase: number
  costo_total: number
  detalles_uso: string[] // 'Día 1: Charquicán (15 un)', 'Día 2: Ensalada (10 un)'
  comprado?: boolean
  precio_modificado?: boolean // true si tiene un precio ajustado manualmente por el usuario
  url_compra?: string // URL hacia la página del producto para compra online o muestra del precio de referencia
  modalidad_compra?: 'online' | 'presencial' // Compra online vs presencial en tienda
}
