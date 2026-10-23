import { describe, it, expect } from 'vitest'
import {
  calcularPresupuestoYCompras,
  exportarListaComprasCSV
} from '@/utils/campamento-menu-calculator'
import {
  generarMenuPredeterminado,
  DEFAULT_RECETAS,
  DEFAULT_PLANTILLAS,
  DEFAULT_INSUMOS_CATALOGO
} from '@/lib/campamento-menu-presets'
import type { CampamentoMenu } from '@/types/campamento-menu'
import { distribuirRecetasEnSlots } from '@/types/campamento-menu'

describe('Campamento Menu Calculator', () => {
  it('resuelve la jerarquía Receta -> Plantilla -> Horario calculando insumos de recetas compuestas', () => {
    const menuConPlantilla: CampamentoMenu = {
      id: 'menu-plantilla-test',
      nombre: 'Campamento Once Test',
      numero_personas: 40,
      dias_totales: 1,
      margen_seguridad_pct: 0,
      precio_pan_unitario: 150,
      consumo_pan_diario: 1,
      bloques: [
        {
          id: 'bloque-once-1',
          menu_id: 'menu-plantilla-test',
          numero_dia: 1,
          dia_etiqueta: 'Día 1',
          tiempo_comida: 'once',
          responsables: ['Tropa'],
          plantilla_id: 'plt-once-te-pan-huevos', // Once = Té + Pan + Huevos revueltos
          recetas_ids: [] // Hereda de la plantilla
        }
      ]
    }

    const resultado = calcularPresupuestoYCompras(
      menuConPlantilla,
      DEFAULT_RECETAS,
      DEFAULT_INSUMOS_CATALOGO,
      DEFAULT_PLANTILLAS
    )

    // Debe contener Huevos de gallina provenientes de la receta atómica rec-huevos-revueltos
    const itemHuevos = resultado.itemsConsolidados.find(i =>
      i.ingrediente_nombre.toLowerCase().includes('huevos')
    )
    expect(itemHuevos).toBeDefined()
    expect(itemHuevos?.cantidad_requerida_neta).toBeGreaterThanOrEqual(40) // 1 huevo por persona

    // Debe contener Té Ceylán de la receta atómica rec-te-fondo
    const itemTe = resultado.itemsConsolidados.find(i =>
      i.ingrediente_nombre.toLowerCase().includes('té')
    )
    expect(itemTe).toBeDefined()

    expect(resultado.costoTotal).toBeGreaterThan(0)
  })

  it('calcula presupuesto para un campamento corto de 4 días y 50 asistentes', () => {
    const menu4Dias = generarMenuPredeterminado('menu-test-4', 4, 50)
    const resultado = calcularPresupuestoYCompras(
      menu4Dias,
      DEFAULT_RECETAS,
      DEFAULT_INSUMOS_CATALOGO,
      DEFAULT_PLANTILLAS
    )

    expect(resultado.costoTotal).toBeGreaterThan(0)
    expect(resultado.costoPorPersona).toBeGreaterThan(0)
    expect(resultado.costoPorDia).toBeGreaterThan(0)

    // Pan: 50 personas * 4 dias * 3 panes = 600 panes (+ margen)
    expect(resultado.totalPanesCampamento).toBeGreaterThanOrEqual(600)
    expect(resultado.costoPanTotal).toBe(resultado.totalPanesCampamento * 150)

    // Debe contener Panadería local en proveedores
    const panaderia = resultado.resumenPorProveedor.find(p => p.proveedor === 'Panadería local')
    expect(panaderia).toBeDefined()
    expect(panaderia?.costo_subtotal).toBe(resultado.costoPanTotal)

    // Items consolidados
    expect(resultado.itemsConsolidados.length).toBeGreaterThan(5)

    // Agrupación de categorías
    expect(resultado.resumenPorCategoria.length).toBeGreaterThan(2)
  })

  it('calcula presupuesto para un campamento largo de 9 días y 60 asistentes', () => {
    const menu9Dias = generarMenuPredeterminado('menu-test-9', 9, 60)
    const resultado = calcularPresupuestoYCompras(menu9Dias, DEFAULT_RECETAS, DEFAULT_INSUMOS_CATALOGO)

    expect(resultado.costoTotal).toBeGreaterThan(100000)
    expect(resultado.totalPanesCampamento).toBeGreaterThanOrEqual(60 * 9 * 3)

    // Exportar CSV
    const csv = exportarListaComprasCSV(resultado, menu9Dias.nombre)
    expect(csv).toContain('PRESUPUESTO Y LISTA DE COMPRAS')
    expect(csv).toContain('Panadería local')
    expect(csv).toContain('Pan batido / Marraqueta fresca')
  })

  it('consolida los ingredientes asignados en slots estructurados y comidas personalizadas', () => {
    const menuConSlots: CampamentoMenu = {
      id: 'menu-slots-test',
      nombre: 'Campamento Slots Test',
      numero_personas: 30,
      dias_totales: 1,
      margen_seguridad_pct: 0,
      precio_pan_unitario: 150,
      consumo_pan_diario: 1,
      bloques: [
        {
          id: 'bloque-cena-slots',
          menu_id: 'menu-slots-test',
          numero_dia: 1,
          orden: 1,
          dia_etiqueta: 'Día 1',
          tiempo_comida: 'cena',
          responsables: ['Compañía'],
          bebidas_ids: ['rec-jugo'],
          plato_principal_ids: ['rec-fideos'],
          agregados_ids: ['rec-salsa-soya'],
          alternativas_ids: [],
          ensaladas_ids: ['rec-ensalada-repollo'],
          postres_ids: ['rec-jalea'],
          sopas_ids: ['rec-cena-sopa'],
          recetas_ids: []
        },
        {
          id: 'bloque-colacion-extra',
          menu_id: 'menu-slots-test',
          numero_dia: 1,
          orden: 2,
          dia_etiqueta: 'Día 1',
          tiempo_comida: 'once',
          es_personalizado: true,
          nombre_personalizado: 'Colación Nocturna de Guardia',
          responsables: ['Clan'],
          bebidas_ids: ['rec-te-fondo'],
          plato_principal_ids: [],
          agregados_ids: ['rec-pan-campamento', 'rec-pan-manjar'],
          alternativas_ids: [],
          ensaladas_ids: [],
          recetas_ids: []
        }
      ]
    }

    const resultado = calcularPresupuestoYCompras(
      menuConSlots,
      DEFAULT_RECETAS,
      DEFAULT_INSUMOS_CATALOGO,
      DEFAULT_PLANTILLAS
    )

    // Debe contener sopa de pollo con fideos del slot sopas_ids
    const itemSopa = resultado.itemsConsolidados.find(i =>
      i.ingrediente_nombre.toLowerCase().includes('sopa instantánea')
    )
    expect(itemSopa).toBeDefined()

    // Debe contener jalea del slot postres_ids
    const itemJalea = resultado.itemsConsolidados.find(i =>
      i.ingrediente_nombre.toLowerCase().includes('jalea')
    )
    expect(itemJalea).toBeDefined()

    // Debe contener fideos del slot plato_principal_ids
    const itemFideos = resultado.itemsConsolidados.find(i =>
      i.ingrediente_nombre.toLowerCase().includes('tallarines')
    )
    expect(itemFideos).toBeDefined()

    // Debe contener té del slot bebidas_ids de la comida personalizada
    const itemTe = resultado.itemsConsolidados.find(i =>
      i.ingrediente_nombre.toLowerCase().includes('té')
    )
    expect(itemTe).toBeDefined()

    expect(resultado.costoTotal).toBeGreaterThan(0)
  })

  it('maneja menús vacíos o sin recetas sin caerse', () => {
    const menuVacio = {
      id: 'menu-vacio',
      nombre: 'Menú Vacío',
      numero_personas: 10,
      dias_totales: 2,
      margen_seguridad_pct: 0,
      precio_pan_unitario: 150,
      consumo_pan_diario: 2,
      bloques: []
    }

    const resultado = calcularPresupuestoYCompras(menuVacio, [], [])
    expect(resultado.costoTotal).toBe(10 * 2 * 2 * 150) // Solo el pan
    expect(resultado.itemsConsolidados.length).toBe(1)
  })

  it('permite manipular y sobreescribir precios de insumos con precios_personalizados', () => {
    const menuConPreciosPersonalizados: CampamentoMenu = {
      id: 'menu-precios-test',
      nombre: 'Menú Precios Custom',
      numero_personas: 10,
      dias_totales: 1,
      margen_seguridad_pct: 0,
      precio_pan_unitario: 150,
      consumo_pan_diario: 1,
      precios_personalizados: {
        'Pan batido / Marraqueta fresca': 200,
        'Té Ceylán tradicional': 1500
      },
      bloques: [
        {
          id: 'bloque-1',
          menu_id: 'menu-precios-test',
          numero_dia: 1,
          dia_etiqueta: 'Día 1',
          tiempo_comida: 'desayuno',
          responsables: ['Clan'],
          bebidas_ids: ['rec-te-fondo'],
          recetas_ids: []
        }
      ]
    }

    const resultado = calcularPresupuestoYCompras(
      menuConPreciosPersonalizados,
      DEFAULT_RECETAS,
      DEFAULT_INSUMOS_CATALOGO
    )

    const itemPan = resultado.itemsConsolidados.find(i => i.ingrediente_nombre.includes('Pan'))
    expect(itemPan).toBeDefined()
    expect(itemPan?.precio_unitario_envase).toBe(200)
    expect(itemPan?.costo_total).toBe(10 * 200)
    expect(itemPan?.precio_modificado).toBe(true)

    const itemTe = resultado.itemsConsolidados.find(i => i.ingrediente_nombre.toLowerCase().includes('té'))
    expect(itemTe).toBeDefined()
    expect(itemTe?.precio_unitario_envase).toBe(1500)
    expect(itemTe?.precio_modificado).toBe(true)
  })

  it('permite manipular y reasignar proveedores personalizados por producto', () => {
    const menuConProveedores: CampamentoMenu = {
      id: 'menu-prov-test',
      nombre: 'Menú Proveedores Custom',
      numero_personas: 10,
      dias_totales: 1,
      margen_seguridad_pct: 0,
      precio_pan_unitario: 150,
      consumo_pan_diario: 1,
      proveedores: ['La Vega Central', 'Distribuidora Franchi', 'Comercio Local Chépica'],
      proveedores_personalizados: {
        'Té Ceylán tradicional': 'Comercio Local Chépica',
        'Pan batido / Marraqueta fresca': 'Panadería Don Carlos'
      },
      bloques: [
        {
          id: 'bloque-prov-1',
          menu_id: 'menu-prov-test',
          numero_dia: 1,
          dia_etiqueta: 'Día 1',
          tiempo_comida: 'desayuno',
          responsables: ['Clan'],
          bebidas_ids: ['rec-te-fondo'],
          recetas_ids: []
        }
      ]
    }

    const resultado = calcularPresupuestoYCompras(
      menuConProveedores,
      DEFAULT_RECETAS,
      DEFAULT_INSUMOS_CATALOGO
    )

    const itemTe = resultado.itemsConsolidados.find(i => i.ingrediente_nombre.toLowerCase().includes('té'))
    expect(itemTe).toBeDefined()
    expect(itemTe?.proveedor).toBe('Comercio Local Chépica')

    const itemPan = resultado.itemsConsolidados.find(i => i.ingrediente_nombre.includes('Pan'))
    expect(itemPan).toBeDefined()
    expect(itemPan?.proveedor).toBe('Panadería Don Carlos')

    const provResumen = resultado.resumenPorProveedor.find(p => p.proveedor === 'Comercio Local Chépica')
    expect(provResumen).toBeDefined()
  })

  it('no resucita recetas eliminadas de los slots aunque bloque conserve plantilla_id', () => {
    // Caso: Un almuerzo que usó la plantilla de tallarines con soya, pero el usuario eliminó los fideos y dejó solo la salsa y ensalada
    const menuConRecetaRemovida: CampamentoMenu = {
      id: 'menu-slot-override',
      nombre: 'Menú Slot Override',
      numero_personas: 40,
      dias_totales: 1,
      margen_seguridad_pct: 0,
      precio_pan_unitario: 150,
      consumo_pan_diario: 1,
      bloques: [
        {
          id: 'bloque-alm-1',
          menu_id: 'menu-slot-override',
          numero_dia: 1,
          dia_etiqueta: 'Día 1',
          tiempo_comida: 'almuerzo',
          responsables: ['Tropa'],
          plantilla_id: 'plt-almuerzo-tallarines-soya',
          bebidas_ids: ['rec-jugo'],
          plato_principal_ids: [], // Se eliminaron los fideos ('rec-fideos')!
          agregados_ids: ['rec-salsa-soya'],
          alternativas_ids: [],
          ensaladas_ids: ['rec-ensalada-repollo'],
          postres_ids: [],
          sopas_ids: [],
          recetas_ids: ['rec-jugo', 'rec-salsa-soya', 'rec-ensalada-repollo']
        }
      ]
    }

    const resultado = calcularPresupuestoYCompras(
      menuConRecetaRemovida,
      DEFAULT_RECETAS,
      DEFAULT_INSUMOS_CATALOGO,
      DEFAULT_PLANTILLAS
    )

    // Fideos NO debe estar en la lista de compras
    const itemFideos = resultado.itemsConsolidados.find(i =>
      i.ingrediente_nombre.toLowerCase().includes('tallarines')
    )
    expect(itemFideos).toBeUndefined()

    // Pero salsa de soya y jugo SÍ deben estar
    const itemSalsa = resultado.itemsConsolidados.find(i =>
      i.ingrediente_nombre.toLowerCase().includes('salsa de tomates')
    )
    expect(itemSalsa).toBeDefined()
  })

  it('recalcula a cero insumos cuando un bloque se vacía completamente', () => {
    const menuBloqueVacio: CampamentoMenu = {
      id: 'menu-vacio-test',
      nombre: 'Menú Bloque Vacío',
      numero_personas: 40,
      dias_totales: 1,
      margen_seguridad_pct: 0,
      precio_pan_unitario: 150,
      consumo_pan_diario: 0,
      bloques: [
        {
          id: 'bloque-alm-vacio',
          menu_id: 'menu-vacio-test',
          numero_dia: 1,
          dia_etiqueta: 'Día 1',
          tiempo_comida: 'almuerzo',
          responsables: [],
          plantilla_id: undefined,
          bebidas_ids: [],
          plato_principal_ids: [],
          agregados_ids: [],
          alternativas_ids: [],
          ensaladas_ids: [],
          postres_ids: [],
          sopas_ids: [],
          recetas_ids: []
        }
      ]
    }

    const resultado = calcularPresupuestoYCompras(
      menuBloqueVacio,
      DEFAULT_RECETAS,
      DEFAULT_INSUMOS_CATALOGO,
      DEFAULT_PLANTILLAS
    )

    expect(resultado.itemsConsolidados.length).toBe(0)
    expect(resultado.costoTotal).toBe(0)
  })

  it('distribuye recetas huérfanas en sus slots correctos según su clasificación', () => {
    const recetasIds = [
      'rec-jugo',            // Bebida
      'rec-fideos',          // Plato Principal
      'rec-salsa-soya',      // Agregado
      'rec-ensalada-repollo',// Ensalada
      'rec-fruta-temporada', // Postre
      'rec-cena-sopa'        // Sopa
    ]

    const slots = distribuirRecetasEnSlots(recetasIds, DEFAULT_RECETAS)

    expect(slots.bebidas_ids).toContain('rec-jugo')
    expect(slots.plato_principal_ids).toContain('rec-fideos')
    expect(slots.agregados_ids).toContain('rec-salsa-soya')
    expect(slots.ensaladas_ids).toContain('rec-ensalada-repollo')
    expect(slots.postres_ids).toContain('rec-fruta-temporada')
    expect(slots.sopas_ids).toContain('rec-cena-sopa')
    expect(slots.recetas_ids.length).toBe(6)
  })

  it('asigna URLs personalizadas y modalidades online/presencial a los productos cotizados', () => {
    const menuConUrls: CampamentoMenu = {
      id: 'menu-urls-test',
      nombre: 'Menú URLs y Modalidades',
      numero_personas: 20,
      dias_totales: 1,
      margen_seguridad_pct: 0,
      precio_pan_unitario: 150,
      consumo_pan_diario: 1,
      urls_personalizadas: {
        'Té Ceylán tradicional': 'https://www.lider.cl/supermercado/product/sku/123456',
        'Pan batido / Marraqueta fresca': 'https://panaderialocal.cl/marraqueta'
      },
      modalidades_compra: {
        'Té Ceylán tradicional': 'online',
        'Pan batido / Marraqueta fresca': 'presencial'
      },
      bloques: [
        {
          id: 'bloque-url-1',
          menu_id: 'menu-urls-test',
          numero_dia: 1,
          dia_etiqueta: 'Día 1',
          tiempo_comida: 'once',
          responsables: ['Manada'],
          bebidas_ids: ['rec-te-fondo'],
          recetas_ids: ['rec-te-fondo']
        }
      ]
    }

    const resultado = calcularPresupuestoYCompras(
      menuConUrls,
      DEFAULT_RECETAS,
      DEFAULT_INSUMOS_CATALOGO
    )

    const itemTe = resultado.itemsConsolidados.find(i => i.ingrediente_nombre.toLowerCase().includes('té'))
    expect(itemTe).toBeDefined()
    expect(itemTe?.url_compra).toBe('https://www.lider.cl/supermercado/product/sku/123456')
    expect(itemTe?.modalidad_compra).toBe('online')

    const itemPan = resultado.itemsConsolidados.find(i => i.ingrediente_nombre.includes('Pan'))
    expect(itemPan).toBeDefined()
    expect(itemPan?.url_compra).toBe('https://panaderialocal.cl/marraqueta')
    expect(itemPan?.modalidad_compra).toBe('presencial')

    // Exportación CSV
    const csv = exportarListaComprasCSV(resultado, menuConUrls.nombre)
    expect(csv).toContain('https://www.lider.cl/supermercado/product/sku/123456')
    expect(csv).toContain('Online')
    expect(csv).toContain('Presencial')
  })
})
