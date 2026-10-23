import type {
  InsumoCotizadoCatalogo,
  CampamentoReceta,
  CampamentoPlantillaComida,
  CampamentoMenuBloque,
  CampamentoMenu
} from '@/types/campamento-menu'

export const DEFAULT_PROVEEDORES: string[] = [
  'Super Bodega aCuenta',
  'Distribuidora Franchi',
  'La Vega Central',
  'Líder / Walmart',
  'Panadería local',
  'Feria Libre',
  'Mayorista 10',
  'Verdulería local',
  'Carnicería local',
  'Macro Food'
]

export const DEFAULT_PROVEEDORES_URLS: Record<string, string> = {
  'Super Bodega aCuenta': 'https://www.acuenta.cl',
  'Líder / Walmart': 'https://www.lider.cl/supermercado',
  'Mayorista 10': 'https://www.mayorista10.cl',
  'Macro Food': 'https://www.macrofood.cl',
  'Distribuidora Franchi': 'https://www.distribuidorafranchi.cl'
}

export const DEFAULT_INSUMOS_CATALOGO: InsumoCotizadoCatalogo[] = [
  {
    id: 'ins-1',
    nombre: 'Leche semidescremada en polvo',
    categoria: 'Lácteos',
    formato_envase: 'Bolsa 800g / 1kg',
    porciones_por_envase: 32, // 25g por ración
    unidad_medida_compra: 'bolsa',
    precio_referencia: 5090,
    proveedor: 'Macro Food / aCuenta',
    observacion: 'Ración base: 25g por persona al desayuno'
  },
  {
    id: 'ins-2',
    nombre: 'Chocolate / Cacao en polvo',
    categoria: 'Abarrotes',
    formato_envase: 'Bolsa 200g',
    porciones_por_envase: 20,
    unidad_medida_compra: 'bolsa',
    precio_referencia: 790,
    proveedor: 'Líder / aCuenta',
    observacion: '500g diarios para fondo comunitario'
  },
  {
    id: 'ins-3',
    nombre: 'Pan batido / Marraqueta',
    categoria: 'Panadería',
    formato_envase: 'Unidad fresca diaria',
    porciones_por_envase: 1,
    unidad_medida_compra: 'unidad',
    precio_referencia: 150,
    proveedor: 'Panadería local',
    observacion: '3 panes por persona al día (Desayuno, Almuerzo, Once)'
  },
  {
    id: 'ins-4',
    nombre: 'Mermelada de Mora',
    categoria: 'Abarrotes',
    formato_envase: 'Pote 250g',
    porciones_por_envase: 5,
    unidad_medida_compra: 'unidad',
    precio_referencia: 410,
    proveedor: 'Super Bodega aCuenta',
    observacion: '1 unidad cada 5 personas'
  },
  {
    id: 'ins-5',
    nombre: 'Cecina / Jamón sándwich',
    categoria: 'Carnicería',
    formato_envase: 'Pieza por Kilo',
    porciones_por_envase: 20, // 50g por sándwich
    unidad_medida_compra: 'kilo',
    precio_referencia: 4490,
    proveedor: 'Distribuidora Franchi SPA',
    observacion: 'Barra pesable'
  },
  {
    id: 'ins-6',
    nombre: 'Margarina',
    categoria: 'Lácteos',
    formato_envase: 'Bolsa 1kg',
    porciones_por_envase: 50,
    unidad_medida_compra: 'kilo',
    precio_referencia: 2390,
    proveedor: 'Super Bodega aCuenta',
    observacion: 'Apta para alternativa vegana'
  },
  {
    id: 'ins-7',
    nombre: 'Huevos de gallina',
    categoria: 'Abarrotes',
    formato_envase: 'Bandeja 30 unidades',
    porciones_por_envase: 30,
    unidad_medida_compra: 'bandeja',
    precio_referencia: 5490,
    proveedor: 'Distribuidora / EatTouch',
    observacion: '1 huevo por persona en desayuno o 1 huevo para 6 croquetas'
  },
  {
    id: 'ins-8',
    nombre: 'Manjar',
    categoria: 'Lácteos',
    formato_envase: 'Bolsa 1kg',
    porciones_por_envase: 30,
    unidad_medida_compra: 'kilo',
    precio_referencia: 1990,
    proveedor: 'Super Bodega aCuenta',
    observacion: '1 kg cada 30 personas'
  },
  {
    id: 'ins-9',
    nombre: 'Tallarines N° 5',
    categoria: 'Abarrotes',
    formato_envase: 'Paquete 400g',
    porciones_por_envase: 4,
    unidad_medida_compra: 'paquete',
    precio_referencia: 460,
    proveedor: 'Super Bodega aCuenta',
    observacion: '1 paquete cada 4 personas'
  },
  {
    id: 'ins-10',
    nombre: 'Salsa de tomates tradicional',
    categoria: 'Abarrotes',
    formato_envase: 'Caja / Doypack 200g',
    porciones_por_envase: 3,
    unidad_medida_compra: 'unidad',
    precio_referencia: 320,
    proveedor: 'San Remo / aCuenta',
    observacion: '17 salsas por almuerzo de 50 personas'
  },
  {
    id: 'ins-11',
    nombre: 'Carne de soya deshidratada',
    categoria: 'Abarrotes',
    formato_envase: 'Bolsa 1kg',
    porciones_por_envase: 25,
    unidad_medida_compra: 'kilo',
    precio_referencia: 4000,
    proveedor: 'Líder / Mayorista',
    observacion: '2 kg por almuerzo de 50 personas'
  },
  {
    id: 'ins-12',
    nombre: 'Arroz largo fino Grado 2',
    categoria: 'Abarrotes',
    formato_envase: 'Bolsa 1kg',
    porciones_por_envase: 10,
    unidad_medida_compra: 'kilo',
    precio_referencia: 1050,
    proveedor: 'Super Bodega aCuenta',
    observacion: '1 kg cada 10 personas'
  },
  {
    id: 'ins-13',
    nombre: 'Puré de papas instantáneo',
    categoria: 'Abarrotes',
    formato_envase: 'Bolsa 1kg',
    porciones_por_envase: 25,
    unidad_medida_compra: 'kilo',
    precio_referencia: 4190,
    proveedor: 'Líder / Maggi',
    observacion: '1 kg rinde 25 porciones generosas'
  },
  {
    id: 'ins-14',
    nombre: 'Vienesas tradicionales',
    categoria: 'Carnicería',
    formato_envase: 'Paquete 1kg (20 unidades)',
    porciones_por_envase: 6.6, // 3 vienesas por persona
    unidad_medida_compra: 'kilo',
    precio_referencia: 2990,
    proveedor: 'Distribuidora Franchi SPA',
    observacion: '3 vienesas por persona'
  },
  {
    id: 'ins-15',
    nombre: 'Jurel al natural',
    categoria: 'Abarrotes',
    formato_envase: 'Tarro 425g',
    porciones_por_envase: 4,
    unidad_medida_compra: 'tarro',
    precio_referencia: 1350,
    proveedor: 'Super Bodega aCuenta',
    observacion: '1 tarro cada 4 personas'
  },
  {
    id: 'ins-16',
    nombre: 'Tomates frescos de primera',
    categoria: 'Verdulería',
    formato_envase: 'Cajón 18kg',
    porciones_por_envase: 72,
    unidad_medida_compra: 'cajón',
    precio_referencia: 21420,
    proveedor: 'La Vega / GreenGreen',
    observacion: 'Tomaticán 2 tomates/persona; Ensalada 1 tomate para 2 personas'
  },
  {
    id: 'ins-17',
    nombre: 'Papas de guarda',
    categoria: 'Verdulería',
    formato_envase: 'Saco 25kg',
    porciones_por_envase: 100, // 250g por persona
    unidad_medida_compra: 'saco',
    precio_referencia: 25990,
    proveedor: 'La Vega / GreenGreen',
    observacion: 'Saco de 25 kg para puré casero, papas mayo o cocidas'
  },
  {
    id: 'ins-18',
    nombre: 'Cebollas',
    categoria: 'Verdulería',
    formato_envase: 'Malla 15kg',
    porciones_por_envase: 60,
    unidad_medida_compra: 'malla',
    precio_referencia: 15900,
    proveedor: 'La Vega / GreenGreen',
    observacion: 'Base para sofritos, cazuela y tomaticán'
  },
  {
    id: 'ins-19',
    nombre: 'Zanahorias',
    categoria: 'Verdulería',
    formato_envase: 'Kilo / Malla',
    porciones_por_envase: 8,
    unidad_medida_compra: 'kilo',
    precio_referencia: 790,
    proveedor: 'La Vega / GreenGreen',
    observacion: 'Para sofritos, arroz y ensalada mixta'
  },
  {
    id: 'ins-20',
    nombre: 'Lechuga española',
    categoria: 'Verdulería',
    formato_envase: 'Unidad',
    porciones_por_envase: 8,
    unidad_medida_compra: 'unidad',
    precio_referencia: 790,
    proveedor: 'La Vega / GreenGreen',
    observacion: '1 lechuga cada 8 personas'
  },
  {
    id: 'ins-21',
    nombre: 'Repollo verde',
    categoria: 'Verdulería',
    formato_envase: 'Unidad (2 kg aprox)',
    porciones_por_envase: 16,
    unidad_medida_compra: 'unidad',
    precio_referencia: 1990,
    proveedor: 'La Vega / GreenGreen',
    observacion: 'Rinde excelente volumen para ensalada'
  },
  {
    id: 'ins-22',
    nombre: 'Zapallo camote',
    categoria: 'Verdulería',
    formato_envase: 'Trozo por Kilo',
    porciones_por_envase: 10,
    unidad_medida_compra: 'kilo',
    precio_referencia: 2500,
    proveedor: 'La Vega / GreenGreen',
    observacion: 'Para cazuela y charquicán'
  },
  {
    id: 'ins-23',
    nombre: 'Choclo entero',
    categoria: 'Verdulería',
    formato_envase: 'Unidad',
    porciones_por_envase: 2,
    unidad_medida_compra: 'unidad',
    precio_referencia: 1100,
    proveedor: 'La Vega / GreenGreen',
    observacion: '1/2 choclo por plato en cazuela o desgranado'
  },
  {
    id: 'ins-24',
    nombre: 'Aceite vegetal para freír/cocinar',
    categoria: 'Condimentos y Aceites',
    formato_envase: 'Bidón 5 Litros',
    porciones_por_envase: 150,
    unidad_medida_compra: 'bidón',
    precio_referencia: 7290,
    proveedor: 'Super Bodega aCuenta',
    observacion: '1 bidón rinde para campamento de 4 a 9 días'
  },
  {
    id: 'ins-25',
    nombre: 'Sal de mesa fina',
    categoria: 'Condimentos y Aceites',
    formato_envase: 'Bolsa 1kg',
    porciones_por_envase: 200,
    unidad_medida_compra: 'kilo',
    precio_referencia: 420,
    proveedor: 'Super Bodega aCuenta',
    observacion: 'Sal Lobos tradicional'
  },
  {
    id: 'ins-26',
    nombre: 'Sopa instantánea de pollo con fideos',
    categoria: 'Abarrotes',
    formato_envase: 'Sobre 68g (Maggi/Líder)',
    porciones_por_envase: 4,
    unidad_medida_compra: 'sobre',
    precio_referencia: 440,
    proveedor: 'Líder / aCuenta',
    observacion: 'Cena rápida y caliente de campamento'
  },
  {
    id: 'ins-27',
    nombre: 'Té Ceylán tradicional',
    categoria: 'Abarrotes',
    formato_envase: 'Caja 100 bolsitas',
    porciones_por_envase: 100,
    unidad_medida_compra: 'caja',
    precio_referencia: 2290,
    proveedor: 'Super Bodega aCuenta',
    observacion: '20 bolsitas por fondo comunitario de once'
  },
  {
    id: 'ins-28',
    nombre: 'Endulzante Stevia líquido',
    categoria: 'Abarrotes',
    formato_envase: 'Frasco 270ml',
    porciones_por_envase: 50,
    unidad_medida_compra: 'frasco',
    precio_referencia: 1990,
    proveedor: 'Super Bodega aCuenta',
    observacion: '1 frasco por día de campamento'
  },
  {
    id: 'ins-29',
    nombre: 'Jugo en polvo concentrado',
    categoria: 'Bebidas',
    formato_envase: 'Sobre para 2 Litros',
    porciones_por_envase: 8,
    unidad_medida_compra: 'sobre',
    precio_referencia: 250,
    proveedor: 'Super Bodega aCuenta',
    observacion: 'Para acompañar los almuerzos'
  },
  {
    id: 'ins-30',
    nombre: 'Sucedáneo de limón',
    categoria: 'Condimentos y Aceites',
    formato_envase: 'Botella 5 Litros',
    porciones_por_envase: 150,
    unidad_medida_compra: 'bidón',
    precio_referencia: 3890,
    proveedor: 'Super Bodega aCuenta',
    observacion: 'Para aderezo de ensaladas'
  }
]

export const DEFAULT_RECETAS: CampamentoReceta[] = [
  {
    id: 'rec-charquican',
    nombre: 'Charquicán con Carne de Soya',
    tipo_comida: 'almuerzo',
    categoria_plato: 'Plato Principal',
    categorias_plato: ['Plato Principal'],
    porciones_base: 10,
    instrucciones: 'Cocer las papas y el zapallo trozados. En olla aparte sofreír la cebolla con pimentón, condimentos, carne de soya previamente hidratada y las 3 zanahorias picadas. Moler papas y zapallo rústicamente y mezclar.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-1', ingrediente_nombre: 'Papas de guarda', categoria: 'Verdulería', cantidad_base: 2.5, unidad_medida: 'kg', precio_referencia_unitario: 1040 },
      { id: 'ri-2', ingrediente_nombre: 'Zapallo camote', categoria: 'Verdulería', cantidad_base: 1.0, unidad_medida: 'kg', precio_referencia_unitario: 2500 },
      { id: 'ri-3', ingrediente_nombre: 'Zanahorias', categoria: 'Verdulería', cantidad_base: 3.0, unidad_medida: 'unidad', precio_referencia_unitario: 100 },
      { id: 'ri-4', ingrediente_nombre: 'Cebollas', categoria: 'Verdulería', cantidad_base: 2.0, unidad_medida: 'unidad', precio_referencia_unitario: 250 },
      { id: 'ri-5', ingrediente_nombre: 'Carne de soya deshidratada', categoria: 'Abarrotes', cantidad_base: 0.4, unidad_medida: 'kg', precio_referencia_unitario: 4000 },
      { id: 'ri-6', ingrediente_nombre: 'Aceite vegetal para freír/cocinar', categoria: 'Condimentos y Aceites', cantidad_base: 0.1, unidad_medida: 'litro', precio_referencia_unitario: 1450 }
    ]
  },
  {
    id: 'rec-arroz-graneado',
    nombre: 'Arroz Graneado con Zanahoria',
    tipo_comida: 'almuerzo',
    categoria_plato: 'Plato Principal',
    categorias_plato: ['Plato Principal', 'Agregado'],
    porciones_base: 10,
    instrucciones: 'Lavar y secar el arroz. Sofreír en aceite con ajo y 1 zanahoria rallada finamente. Agregar 2 tazas de agua hirviendo por taza de arroz y cocinar a fuego lento sobre tostador.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-7', ingrediente_nombre: 'Arroz largo fino Grado 2', categoria: 'Abarrotes', cantidad_base: 1.0, unidad_medida: 'kg', precio_referencia_unitario: 1050 },
      { id: 'ri-8', ingrediente_nombre: 'Zanahorias', categoria: 'Verdulería', cantidad_base: 1.0, unidad_medida: 'unidad', precio_referencia_unitario: 100 },
      { id: 'ri-9', ingrediente_nombre: 'Aceite vegetal para freír/cocinar', categoria: 'Condimentos y Aceites', cantidad_base: 0.05, unidad_medida: 'litro', precio_referencia_unitario: 1450 }
    ]
  },
  {
    id: 'rec-fideos-salsa',
    nombre: 'Tallarines con Salsa Boloñesa de Soya',
    tipo_comida: 'almuerzo',
    categoria_plato: 'Plato Principal',
    categorias_plato: ['Plato Principal'],
    porciones_base: 10,
    instrucciones: 'Cocer los fideos en agua hirviendo con sal durante 8-10 minutos. Hidratar la carne de soya en caldo. Preparar sofrito de cebolla, agregar carne de soya y salsas de tomate. Mezclar.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-10', ingrediente_nombre: 'Tallarines N° 5', categoria: 'Abarrotes', cantidad_base: 2.5, unidad_medida: 'paquete', precio_referencia_unitario: 460 },
      { id: 'ri-11', ingrediente_nombre: 'Salsa de tomates tradicional', categoria: 'Abarrotes', cantidad_base: 4.0, unidad_medida: 'unidad', precio_referencia_unitario: 320 },
      { id: 'ri-12', ingrediente_nombre: 'Carne de soya deshidratada', categoria: 'Abarrotes', cantidad_base: 0.4, unidad_medida: 'kg', precio_referencia_unitario: 4000 },
      { id: 'ri-13', ingrediente_nombre: 'Cebollas', categoria: 'Verdulería', cantidad_base: 1.0, unidad_medida: 'unidad', precio_referencia_unitario: 250 }
    ]
  },
  {
    id: 'rec-pure-vienesas',
    nombre: 'Puré Instantáneo con Vienesas',
    tipo_comida: 'almuerzo',
    categoria_plato: 'Plato Principal',
    categorias_plato: ['Plato Principal'],
    porciones_base: 10,
    instrucciones: 'Hervir agua con sal y margarina. Retirar del fuego, agregar leche y espolvorear el puré instantáneo revolviendo suavemente. Hervir o dorar 3 vienesas por persona.',
    es_vegetariano: false,
    ingredientes: [
      { id: 'ri-14', ingrediente_nombre: 'Puré de papas instantáneo', categoria: 'Abarrotes', cantidad_base: 0.4, unidad_medida: 'kg', precio_referencia_unitario: 4190 },
      { id: 'ri-15', ingrediente_nombre: 'Vienesas tradicionales', categoria: 'Carnicería', cantidad_base: 1.5, unidad_medida: 'kg', precio_referencia_unitario: 2990 },
      { id: 'ri-16', ingrediente_nombre: 'Margarina', categoria: 'Lácteos', cantidad_base: 0.1, unidad_medida: 'kg', precio_referencia_unitario: 2390 }
    ]
  },
  {
    id: 'rec-cazuela-pollo',
    nombre: 'Cazuela de Pollo',
    tipo_comida: 'almuerzo',
    categoria_plato: 'Plato Principal',
    categorias_plato: ['Plato Principal'],
    porciones_base: 10,
    instrucciones: 'Dorar el pollo en la olla. Agregar agua hirviendo, papas enteras, trozos de zapallo, choclo y zanahorias en bastones. Cocinar a fuego medio hasta que las papas estén blandas.',
    es_vegetariano: false,
    ingredientes: [
      { id: 'ri-17', ingrediente_nombre: 'Papas de guarda', categoria: 'Verdulería', cantidad_base: 2.0, unidad_medida: 'kg', precio_referencia_unitario: 1040 },
      { id: 'ri-18', ingrediente_nombre: 'Zapallo camote', categoria: 'Verdulería', cantidad_base: 1.0, unidad_medida: 'kg', precio_referencia_unitario: 2500 },
      { id: 'ri-19', ingrediente_nombre: 'Choclo entero', categoria: 'Verdulería', cantidad_base: 5.0, unidad_medida: 'unidad', precio_referencia_unitario: 1100 },
      { id: 'ri-20', ingrediente_nombre: 'Zanahorias', categoria: 'Verdulería', cantidad_base: 2.0, unidad_medida: 'unidad', precio_referencia_unitario: 100 }
    ]
  },
  {
    id: 'rec-desayuno-leche-pan',
    nombre: 'Desayuno Tradicional: Leche con Chocolate y Pan',
    tipo_comida: 'desayuno',
    categoria_plato: 'Plato Principal',
    categorias_plato: ['Plato Principal'],
    porciones_base: 10,
    instrucciones: 'Hervir agua en fondo comunitario. Disolver leche en polvo (25g por persona) y cacao en polvo dulce. Servir 1 pan por persona con mermelada, cecina o margarina.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-21', ingrediente_nombre: 'Leche semidescremada en polvo', categoria: 'Lácteos', cantidad_base: 0.25, unidad_medida: 'kg', precio_referencia_unitario: 5090 },
      { id: 'ri-22', ingrediente_nombre: 'Chocolate / Cacao en polvo', categoria: 'Abarrotes', cantidad_base: 0.1, unidad_medida: 'kg', precio_referencia_unitario: 3950 },
      { id: 'ri-23', ingrediente_nombre: 'Pan batido / Marraqueta', categoria: 'Panadería', cantidad_base: 10.0, unidad_medida: 'unidad', precio_referencia_unitario: 150 },
      { id: 'ri-24', ingrediente_nombre: 'Mermelada de Mora', categoria: 'Abarrotes', cantidad_base: 2.0, unidad_medida: 'unidad', precio_referencia_unitario: 410 }
    ]
  },
  {
    id: 'rec-once-te-pan',
    nombre: 'Once Scout: Té en Fondo con Pan Agregado',
    tipo_comida: 'once',
    categoria_plato: 'Plato Principal',
    categorias_plato: ['Plato Principal'],
    porciones_base: 10,
    instrucciones: 'Hervir fondo de agua y reposar 4 bolsitas de té por cada 10 personas. Servir 1 pan por persona con manjar, huevo revuelto o cecina.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-25', ingrediente_nombre: 'Té Ceylán tradicional', categoria: 'Abarrotes', cantidad_base: 4.0, unidad_medida: 'unidad', precio_referencia_unitario: 25 },
      { id: 'ri-26', ingrediente_nombre: 'Pan batido / Marraqueta', categoria: 'Panadería', cantidad_base: 10.0, unidad_medida: 'unidad', precio_referencia_unitario: 150 },
      { id: 'ri-27', ingrediente_nombre: 'Manjar', categoria: 'Lácteos', cantidad_base: 0.33, unidad_medida: 'kg', precio_referencia_unitario: 1990 }
    ]
  },
  {
    id: 'rec-cena-sopa',
    nombre: 'Cena Caliente: Sopa con Fideos',
    tipo_comida: 'cena',
    categoria_plato: 'Sopa',
    categorias_plato: ['Sopa'],
    porciones_base: 10,
    instrucciones: 'Disolver sobres de sopa instantánea en agua hirviendo a razón de 1 sobre cada 4 personas. Dejar hervir a fuego suave 5 minutos y servir caliente.',
    es_vegetariano: false,
    ingredientes: [
      { id: 'ri-28', ingrediente_nombre: 'Sopa instantánea de pollo con fideos', categoria: 'Abarrotes', cantidad_base: 2.5, unidad_medida: 'sobre', precio_referencia_unitario: 440 }
    ]
  },
  // Recetas atómicas (Nivel 1 de la escala para componer Plantillas)
  {
    id: 'rec-te-fondo',
    nombre: 'Té Caliente en Fondo Comunitario',
    tipo_comida: 'once',
    categoria_plato: 'Bebida',
    categorias_plato: ['Bebida', 'Liquido'],
    porciones_base: 10,
    instrucciones: 'Hervir agua en fondo comunitario de campamento. Reposar 4 bolsitas de té por cada 10 personas. Endulzar moderadamente.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-at-1', ingrediente_nombre: 'Té Ceylán tradicional', categoria: 'Abarrotes', cantidad_base: 4.0, unidad_medida: 'unidad', precio_referencia_unitario: 25 },
      { id: 'ri-at-2', ingrediente_nombre: 'Endulzante Stevia líquido', categoria: 'Abarrotes', cantidad_base: 0.1, unidad_medida: 'frasco', precio_referencia_unitario: 1990 }
    ]
  },
  {
    id: 'rec-leche-caliente',
    nombre: 'Leche Semidescremada Caliente',
    tipo_comida: 'desayuno',
    categoria_plato: 'Bebida',
    categorias_plato: ['Bebida', 'Liquido'],
    porciones_base: 10,
    instrucciones: 'Disolver leche en polvo en agua caliente sin hervir.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-at-lc', ingrediente_nombre: 'Leche semidescremada en polvo', categoria: 'Lácteos', cantidad_base: 0.25, unidad_medida: 'kg', precio_referencia_unitario: 5090 }
    ]
  },
  {
    id: 'rec-leche-chocolate',
    nombre: 'Leche con Chocolate Caliente en Fondo',
    tipo_comida: 'desayuno',
    categoria_plato: 'Bebida',
    categorias_plato: ['Bebida', 'Liquido'],
    porciones_base: 10,
    instrucciones: 'Disolver leche en polvo en agua caliente sin hervir y mezclar con cacao en polvo dulce.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-at-9', ingrediente_nombre: 'Leche semidescremada en polvo', categoria: 'Lácteos', cantidad_base: 0.25, unidad_medida: 'kg', precio_referencia_unitario: 5090 },
      { id: 'ri-at-10', ingrediente_nombre: 'Chocolate / Cacao en polvo', categoria: 'Abarrotes', cantidad_base: 0.1, unidad_medida: 'kg', precio_referencia_unitario: 3950 }
    ]
  },
  {
    id: 'rec-jugo',
    nombre: 'Jugo de Frutas Concentrado para Almuerzo',
    tipo_comida: 'almuerzo',
    categoria_plato: 'Bebida',
    categorias_plato: ['Bebida', 'Liquido'],
    porciones_base: 10,
    instrucciones: 'Disolver sobres de concentrado en agua purificada fría.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-at-25', ingrediente_nombre: 'Jugo en polvo concentrado', categoria: 'Bebidas', cantidad_base: 1.25, unidad_medida: 'sobre', precio_referencia_unitario: 250 }
    ]
  },
  {
    id: 'rec-bebida-carbonatada',
    nombre: 'Bebida Carbonatada / Gaseosa',
    tipo_comida: 'almuerzo',
    categoria_plato: 'Bebida',
    categorias_plato: ['Bebida', 'Liquido'],
    porciones_base: 10,
    instrucciones: 'Servir fría en vasos individuales.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-at-bc', ingrediente_nombre: 'Jugo en polvo concentrado', categoria: 'Bebidas', cantidad_base: 1.0, unidad_medida: 'sobre', precio_referencia_unitario: 250 }
    ]
  },
  {
    id: 'rec-agua-purificada',
    nombre: 'Agua Purificada de Bidón',
    tipo_comida: 'almuerzo',
    categoria_plato: 'Liquido',
    categorias_plato: ['Liquido', 'Bebida'],
    porciones_base: 10,
    instrucciones: 'Dispensar agua potable fresca en bidón de campamento.',
    es_vegetariano: true,
    ingredientes: []
  },
  {
    id: 'rec-fideos',
    nombre: 'Tallarines N° 5 al Dente',
    tipo_comida: 'almuerzo',
    categoria_plato: 'Plato Principal',
    categorias_plato: ['Plato Principal', 'Agregado'],
    porciones_base: 10,
    instrucciones: 'Cocer la pasta en abundante agua con sal por 8 a 10 minutos. Escurrir bien.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-at-11', ingrediente_nombre: 'Tallarines N° 5', categoria: 'Abarrotes', cantidad_base: 2.5, unidad_medida: 'paquete', precio_referencia_unitario: 460 },
      { id: 'ri-at-12', ingrediente_nombre: 'Aceite vegetal para freír/cocinar', categoria: 'Condimentos y Aceites', cantidad_base: 0.05, unidad_medida: 'litro', precio_referencia_unitario: 1450 }
    ]
  },
  {
    id: 'rec-pure',
    nombre: 'Puré de Papas Instantáneo con Margarina',
    tipo_comida: 'almuerzo',
    categoria_plato: 'Plato Principal',
    categorias_plato: ['Plato Principal', 'Agregado'],
    porciones_base: 10,
    instrucciones: 'Hervir agua con sal y margarina. Retirar de fuego, incorporar leche e integrar copos de papa suavemente.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-at-16', ingrediente_nombre: 'Puré de papas instantáneo', categoria: 'Abarrotes', cantidad_base: 0.4, unidad_medida: 'kg', precio_referencia_unitario: 4190 },
      { id: 'ri-at-17', ingrediente_nombre: 'Margarina', categoria: 'Lácteos', cantidad_base: 0.1, unidad_medida: 'kg', precio_referencia_unitario: 2390 }
    ]
  },
  {
    id: 'rec-huevos-revueltos',
    nombre: 'Huevos Revueltos de Campo al Sartén',
    tipo_comida: 'once',
    categoria_plato: 'Agregado',
    categorias_plato: ['Agregado', 'Plato Principal'],
    porciones_base: 10,
    instrucciones: 'Batir 10 huevos con sal a gusto. Calentar sartén o perol con una pizca de margarina o aceite vegetal y revolver hasta punto cremoso.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-at-4', ingrediente_nombre: 'Huevos de gallina', categoria: 'Abarrotes', cantidad_base: 10.0, unidad_medida: 'unidad', precio_referencia_unitario: 183 },
      { id: 'ri-at-5', ingrediente_nombre: 'Margarina', categoria: 'Lácteos', cantidad_base: 0.05, unidad_medida: 'kg', precio_referencia_unitario: 2390 }
    ]
  },
  {
    id: 'rec-salsa-soya',
    nombre: 'Salsa Boloñesa con Carne de Soya',
    tipo_comida: 'almuerzo',
    categoria_plato: 'Agregado',
    categorias_plato: ['Agregado'],
    porciones_base: 10,
    instrucciones: 'Hidratar carne de soya. Sofreír cebolla en cubos pequeños, agregar la soya y verter salsas de tomates tradicionales con condimentos.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-at-13', ingrediente_nombre: 'Carne de soya deshidratada', categoria: 'Abarrotes', cantidad_base: 0.4, unidad_medida: 'kg', precio_referencia_unitario: 4000 },
      { id: 'ri-at-14', ingrediente_nombre: 'Salsa de tomates tradicional', categoria: 'Abarrotes', cantidad_base: 4.0, unidad_medida: 'unidad', precio_referencia_unitario: 320 },
      { id: 'ri-at-15', ingrediente_nombre: 'Cebollas', categoria: 'Verdulería', cantidad_base: 1.0, unidad_medida: 'unidad', precio_referencia_unitario: 250 }
    ]
  },
  {
    id: 'rec-vienesas',
    nombre: 'Vienesas Tradicionales',
    tipo_comida: 'almuerzo',
    categoria_plato: 'Agregado',
    categorias_plato: ['Agregado'],
    porciones_base: 10,
    instrucciones: 'Cocer vienesas en agua hirviendo durante 5 minutos a fuego suave.',
    es_vegetariano: false,
    ingredientes: [
      { id: 'ri-at-18', ingrediente_nombre: 'Vienesas tradicionales', categoria: 'Carnicería', cantidad_base: 1.5, unidad_medida: 'kg', precio_referencia_unitario: 2990 }
    ]
  },
  {
    id: 'rec-pan-campamento',
    nombre: 'Porción de Pan Batido / Marraqueta Fresca',
    tipo_comida: 'once',
    categoria_plato: 'Agregado para Pan',
    categorias_plato: ['Agregado para Pan', 'Agregado'],
    porciones_base: 10,
    instrucciones: 'Retirar pan fresco de panadería local y racionar 1 unidad por persona.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-at-3', ingrediente_nombre: 'Pan batido / Marraqueta', categoria: 'Panadería', cantidad_base: 10.0, unidad_medida: 'unidad', precio_referencia_unitario: 150 }
    ]
  },
  {
    id: 'rec-pan-manjar',
    nombre: 'Agregado de Manjar Artesanal',
    tipo_comida: 'once',
    categoria_plato: 'Agregado para Pan',
    categorias_plato: ['Agregado para Pan', 'Agregado'],
    porciones_base: 10,
    instrucciones: 'Servir en pocillos comunitarios para untar en pan batido fresco.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-at-6', ingrediente_nombre: 'Manjar', categoria: 'Lácteos', cantidad_base: 0.33, unidad_medida: 'kg', precio_referencia_unitario: 1990 }
    ]
  },
  {
    id: 'rec-pan-mermelada',
    nombre: 'Agregado de Mermelada de Mora',
    tipo_comida: 'desayuno',
    categoria_plato: 'Agregado para Pan',
    categorias_plato: ['Agregado para Pan', 'Agregado'],
    porciones_base: 10,
    instrucciones: 'Disponer potes para servicio en mesa.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-at-7', ingrediente_nombre: 'Mermelada de Mora', categoria: 'Abarrotes', cantidad_base: 2.0, unidad_medida: 'unidad', precio_referencia_unitario: 410 }
    ]
  },
  {
    id: 'rec-pan-cecina',
    nombre: 'Agregado de Cecina / Jamón Sándwich',
    tipo_comida: 'once',
    categoria_plato: 'Agregado para Pan',
    categorias_plato: ['Agregado para Pan', 'Agregado'],
    porciones_base: 10,
    instrucciones: 'Cortar en rebanadas para sándwich individual.',
    es_vegetariano: false,
    ingredientes: [
      { id: 'ri-at-8', ingrediente_nombre: 'Cecina / Jamón sándwich', categoria: 'Carnicería', cantidad_base: 0.5, unidad_medida: 'kg', precio_referencia_unitario: 4490 }
    ]
  },
  {
    id: 'rec-alternativa-veggie',
    nombre: 'Alternativa Vegana: Hamburguesa de Lentejas o Soya',
    tipo_comida: 'almuerzo',
    categoria_plato: 'Alternativa',
    categorias_plato: ['Alternativa', 'Plato Principal'],
    porciones_base: 10,
    instrucciones: 'Preparar medallones de legumbres para comensales con dieta vegetariana o vegana.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-at-av', ingrediente_nombre: 'Carne de soya deshidratada', categoria: 'Abarrotes', cantidad_base: 0.3, unidad_medida: 'kg', precio_referencia_unitario: 4000 }
    ]
  },
  {
    id: 'rec-alternativa-sin-gluten',
    nombre: 'Alternativa Celíaca: Porción sin Gluten',
    tipo_comida: 'almuerzo',
    categoria_plato: 'Alternativa',
    categorias_plato: ['Alternativa', 'Plato Principal'],
    porciones_base: 10,
    instrucciones: 'Cocinar en olla separada con utensilios exclusivos libres de contaminación cruzada.',
    es_vegetariano: true,
    es_sin_gluten: true,
    ingredientes: [
      { id: 'ri-at-ag', ingrediente_nombre: 'Arroz largo fino Grado 2', categoria: 'Abarrotes', cantidad_base: 1.0, unidad_medida: 'kg', precio_referencia_unitario: 1050 }
    ]
  },
  {
    id: 'rec-ensalada-repollo',
    nombre: 'Ensalada Fresca de Repollo y Zanahoria',
    tipo_comida: 'almuerzo',
    categoria_plato: 'Ensalada',
    categorias_plato: ['Ensalada'],
    porciones_base: 10,
    instrucciones: 'Picar repollo finamente y amortiguar si es necesario. Rallar zanahorias y aderezar con limón, aceite y sal.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-at-19', ingrediente_nombre: 'Repollo verde', categoria: 'Verdulería', cantidad_base: 0.6, unidad_medida: 'unidad', precio_referencia_unitario: 1990 },
      { id: 'ri-at-20', ingrediente_nombre: 'Zanahorias', categoria: 'Verdulería', cantidad_base: 1.0, unidad_medida: 'unidad', precio_referencia_unitario: 100 },
      { id: 'ri-at-21', ingrediente_nombre: 'Sucedáneo de limón', categoria: 'Condimentos y Aceites', cantidad_base: 0.05, unidad_medida: 'litro', precio_referencia_unitario: 800 }
    ]
  },
  {
    id: 'rec-ensalada-tomate',
    nombre: 'Ensalada de Tomate con Cebolla a la Chilena',
    tipo_comida: 'almuerzo',
    categoria_plato: 'Ensalada',
    categorias_plato: ['Ensalada'],
    porciones_base: 10,
    instrucciones: 'Rebanar tomates de primera y mezclar con cebolla amortiguada en pluma. Aliñar con aceite y sal.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-at-22', ingrediente_nombre: 'Tomates frescos de primera', categoria: 'Verdulería', cantidad_base: 2.0, unidad_medida: 'kg', precio_referencia_unitario: 1190 },
      { id: 'ri-at-23', ingrediente_nombre: 'Cebollas', categoria: 'Verdulería', cantidad_base: 1.0, unidad_medida: 'unidad', precio_referencia_unitario: 250 },
      { id: 'ri-at-24', ingrediente_nombre: 'Aceite vegetal para freír/cocinar', categoria: 'Condimentos y Aceites', cantidad_base: 0.05, unidad_medida: 'litro', precio_referencia_unitario: 1450 }
    ]
  },
  {
    id: 'rec-fruta-temporada',
    nombre: 'Fruta Fresca de Temporada (Plátano / Manzana / Naranja)',
    tipo_comida: 'almuerzo',
    categoria_plato: 'Fruta',
    categorias_plato: ['Fruta', 'Postre', 'Ensalada'],
    porciones_base: 10,
    instrucciones: 'Lavar y sanitizar la fruta. Servir 1 unidad por persona como postre o colación.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-at-26', ingrediente_nombre: 'Plátano / Manzana de temporada', categoria: 'Verdulería', cantidad_base: 10.0, unidad_medida: 'unidad', precio_referencia_unitario: 250 }
    ]
  },
  {
    id: 'rec-jalea',
    nombre: 'Jalea de Frutas con Agua Purificada',
    tipo_comida: 'almuerzo',
    categoria_plato: 'Postre',
    categorias_plato: ['Postre'],
    porciones_base: 10,
    instrucciones: 'Disolver sobre de gelatina en agua caliente y completar con agua fría. Refrigerar en potes individuales.',
    es_vegetariano: true,
    ingredientes: [
      { id: 'ri-at-27', ingrediente_nombre: 'Jalea de frutas en polvo', categoria: 'Abarrotes', cantidad_base: 2.0, unidad_medida: 'sobre', precio_referencia_unitario: 450 }
    ]
  }
]

/**
 * Plantillas de Menú Predefinidas (Nivel 2 de la escala: Receta -> Plantilla -> Horario)
 * Combinan preparaciones atómicas en servicios completos listos para asignar al cronograma.
 */
export const DEFAULT_PLANTILLAS: CampamentoPlantillaComida[] = [
  {
    id: 'plt-once-te-pan-huevos',
    nombre: 'Once Scout: Té con Pan y Huevos Revueltos',
    tipo_comida: 'once',
    descripcion: 'Té caliente en fondo comunitario servido con pan fresco y huevos revueltos preparados al sartén.',
    bebidas_ids: ['rec-te-fondo'],
    plato_principal_ids: [],
    agregados_ids: ['rec-pan-campamento', 'rec-huevos-revueltos'],
    alternativas_ids: [],
    ensaladas_ids: [],
    recetas_ids: ['rec-te-fondo', 'rec-pan-campamento', 'rec-huevos-revueltos'],
    tags: ['clásico', 'energético', 'proteína']
  },
  {
    id: 'plt-once-te-pan-manjar',
    nombre: 'Once Scout: Té con Pan y Manjar',
    tipo_comida: 'once',
    descripcion: 'Té caliente en fondo comunitario acompañado de pan fresco con manjar.',
    bebidas_ids: ['rec-te-fondo'],
    plato_principal_ids: [],
    agregados_ids: ['rec-pan-campamento', 'rec-pan-manjar'],
    alternativas_ids: [],
    ensaladas_ids: [],
    recetas_ids: ['rec-te-fondo', 'rec-pan-campamento', 'rec-pan-manjar'],
    tags: ['clásico', 'rápido']
  },
  {
    id: 'plt-once-te-pan-cecina',
    nombre: 'Once Scout: Té con Pan y Cecina',
    tipo_comida: 'once',
    descripcion: 'Té caliente en fondo acompañado de pan fresco con cecina / jamón.',
    bebidas_ids: ['rec-te-fondo'],
    plato_principal_ids: [],
    agregados_ids: ['rec-pan-campamento', 'rec-pan-cecina'],
    alternativas_ids: [],
    ensaladas_ids: [],
    recetas_ids: ['rec-te-fondo', 'rec-pan-campamento', 'rec-pan-cecina'],
    tags: ['clásico', 'salado']
  },
  {
    id: 'plt-desayuno-leche-pan-mermelada',
    nombre: 'Desayuno Tradicional: Leche con Chocolate y Pan con Mermelada',
    tipo_comida: 'desayuno',
    descripcion: 'Leche caliente con cacao en polvo y marraqueta fresca con mermelada de mora.',
    bebidas_ids: ['rec-leche-chocolate'],
    plato_principal_ids: [],
    agregados_ids: ['rec-pan-campamento', 'rec-pan-mermelada'],
    alternativas_ids: [],
    ensaladas_ids: [],
    recetas_ids: ['rec-leche-chocolate', 'rec-pan-campamento', 'rec-pan-mermelada'],
    tags: ['desayuno', 'clásico']
  },
  {
    id: 'plt-desayuno-leche-pan-cecina',
    nombre: 'Desayuno Campamento: Leche con Chocolate y Pan con Cecina',
    tipo_comida: 'desayuno',
    descripcion: 'Leche caliente con chocolate en fondo y marraqueta con cecina.',
    bebidas_ids: ['rec-leche-chocolate'],
    plato_principal_ids: [],
    agregados_ids: ['rec-pan-campamento', 'rec-pan-cecina'],
    alternativas_ids: [],
    ensaladas_ids: [],
    recetas_ids: ['rec-leche-chocolate', 'rec-pan-campamento', 'rec-pan-cecina'],
    tags: ['desayuno', 'energético']
  },
  {
    id: 'plt-almuerzo-tallarines-soya',
    nombre: 'Almuerzo: Tallarines con Boloñesa de Soya, Ensalada de Repollo y Jugo',
    tipo_comida: 'almuerzo',
    descripcion: 'Tallarines con salsa bolognesa de soya, ensalada fresca de repollo con zanahoria y vaso de jugo.',
    bebidas_ids: ['rec-jugo'],
    plato_principal_ids: ['rec-fideos'],
    agregados_ids: ['rec-salsa-soya'],
    alternativas_ids: [],
    ensaladas_ids: ['rec-ensalada-repollo'],
    postres_ids: ['rec-fruta-temporada'],
    recetas_ids: ['rec-fideos', 'rec-salsa-soya', 'rec-ensalada-repollo', 'rec-jugo', 'rec-fruta-temporada'],
    tags: ['vegetariano', 'clásico', 'económico']
  },
  {
    id: 'plt-almuerzo-pure-vienesas',
    nombre: 'Almuerzo: Puré Instantáneo con Vienesas, Ensalada de Tomate y Jugo',
    tipo_comida: 'almuerzo',
    descripcion: 'Puré suave de papas con vienesas cocidas, ensalada de tomates frescos y jugo.',
    bebidas_ids: ['rec-jugo'],
    plato_principal_ids: ['rec-pure'],
    agregados_ids: ['rec-vienesas'],
    alternativas_ids: [],
    ensaladas_ids: ['rec-ensalada-tomate'],
    postres_ids: ['rec-fruta-temporada'],
    recetas_ids: ['rec-pure', 'rec-vienesas', 'rec-ensalada-tomate', 'rec-jugo', 'rec-fruta-temporada'],
    tags: ['rápido', 'favorito']
  },
  {
    id: 'plt-almuerzo-arroz-vienesas',
    nombre: 'Almuerzo: Arroz Graneado con Vienesas y Ensalada de Repollo',
    tipo_comida: 'almuerzo',
    descripcion: 'Arroz graneado con zanahoria, vienesas y ensalada fresca.',
    bebidas_ids: ['rec-jugo'],
    plato_principal_ids: ['rec-arroz-graneado'],
    agregados_ids: ['rec-vienesas'],
    alternativas_ids: [],
    ensaladas_ids: ['rec-ensalada-repollo'],
    postres_ids: ['rec-fruta-temporada'],
    recetas_ids: ['rec-arroz-graneado', 'rec-vienesas', 'rec-ensalada-repollo', 'rec-jugo', 'rec-fruta-temporada'],
    tags: ['clásico']
  },
  {
    id: 'plt-almuerzo-charquican',
    nombre: 'Almuerzo: Charquicán Campesino con Ensalada a la Chilena',
    tipo_comida: 'almuerzo',
    descripcion: 'Charquicán con papas, zapallo y carne de soya, acompañado de tomate y cebolla.',
    bebidas_ids: ['rec-jugo'],
    plato_principal_ids: ['rec-charquican'],
    agregados_ids: [],
    alternativas_ids: [],
    ensaladas_ids: ['rec-ensalada-tomate'],
    postres_ids: ['rec-fruta-temporada'],
    recetas_ids: ['rec-charquican', 'rec-ensalada-tomate', 'rec-jugo', 'rec-fruta-temporada'],
    tags: ['tradicional', 'vegetariano']
  },
  {
    id: 'plt-almuerzo-cazuela',
    nombre: 'Almuerzo: Cazuela de Pollo Tradicional',
    tipo_comida: 'almuerzo',
    descripcion: 'Cazuela caliente con pollo, papas, zapallo, choclo y zanahorias.',
    bebidas_ids: ['rec-jugo'],
    plato_principal_ids: ['rec-cazuela-pollo'],
    agregados_ids: [],
    alternativas_ids: [],
    ensaladas_ids: [],
    postres_ids: ['rec-fruta-temporada'],
    recetas_ids: ['rec-cazuela-pollo', 'rec-jugo', 'rec-fruta-temporada'],
    tags: ['tradicional', 'nutritivo']
  },
  {
    id: 'plt-cena-sopa-caliente',
    nombre: 'Cena Caliente: Sopa con Fideos de Pollo',
    tipo_comida: 'cena',
    descripcion: 'Sopa caliente reconfortante con fideos para la noche de campamento.',
    bebidas_ids: [],
    plato_principal_ids: [],
    agregados_ids: [],
    alternativas_ids: [],
    ensaladas_ids: [],
    postres_ids: [],
    sopas_ids: ['rec-cena-sopa'],
    recetas_ids: ['rec-cena-sopa'],
    tags: ['cena', 'caliente', 'liviano']
  }
]

/**
 * Genera la matriz de menú predeterminada para un campamento corto (4 días) o largo (hasta 9 días)
 * con la estructura de comidas y turnos probada en Callejones y Coñaripe.
 */
export function generarMenuPredeterminado(
  menuId: string,
  dias: number = 4,
  asistentes: number = 44
): CampamentoMenu {
  const bloques: CampamentoMenuBloque[] = []

  const nombresDias = ['Jueves', 'Viernes', 'Sábado', 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
  const turnosDesayuno = ['Dirigentes y Guiadoras', 'Tropa', 'Manada', 'Compañía', 'Avanzada', 'Manada', 'Tropa', 'Compañía', 'Manada']
  const turnosAlmuerzo = ['Apoderados', 'Avanzada', 'Compañía', 'Tropa', 'Avanzada', 'Compañía', 'Tropa', 'Avanzada', 'Compañía']
  const turnosOnce = ['Tropa', 'Manada', 'Compañía', 'Manada', 'Avanzada', 'Manada', 'Tropa', 'Avanzada', 'Clan']
  const turnosCena = ['Viaje (COCAVI)', 'Tropa', 'Manada', 'Compañía', 'Avanzada', 'Manada', 'Tropa', 'Apoderados', 'Viaje (COCAVI)']

  const almuerzos = [
    { plantillaId: 'plt-almuerzo-tallarines-soya', plat: 'Tallarines con salsa y carne soya', acomp: 'Tallarines', ens: 'Repollo con zanahoria', recIds: ['rec-fideos', 'rec-salsa-soya', 'rec-ensalada-repollo', 'rec-jugo'] },
    { plantillaId: 'plt-almuerzo-pure-vienesas', plat: 'Puré con vienesas', acomp: 'Puré instantáneo', ens: 'Tomate con cebolla', recIds: ['rec-pure', 'rec-vienesas', 'rec-ensalada-tomate', 'rec-jugo'] },
    { plantillaId: 'plt-almuerzo-charquican', plat: 'Charquicán campesino', acomp: 'Papas y zapallo', ens: 'Tomate con cebolla', recIds: ['rec-charquican', 'rec-ensalada-tomate', 'rec-jugo'] },
    { plantillaId: 'plt-almuerzo-arroz-vienesas', plat: 'Arroz con vienesas', acomp: 'Arroz graneado', ens: 'Repollo', recIds: ['rec-arroz-graneado', 'rec-vienesas', 'rec-ensalada-repollo', 'rec-jugo'] },
    { plantillaId: 'plt-almuerzo-cazuela', plat: 'Cazuela de pollo', acomp: 'Papas y choclo', ens: 'Zanahoria con limón', recIds: ['rec-cazuela-pollo', 'rec-jugo'] },
    { plantillaId: 'plt-almuerzo-charquican', plat: 'Tomaticán con papas cocidas', acomp: 'Papas cocidas', ens: 'Lechuga', recIds: ['rec-charquican', 'rec-ensalada-tomate', 'rec-jugo'] },
    { plantillaId: 'plt-almuerzo-arroz-vienesas', plat: 'Croquetas con arroz', acomp: 'Arroz', ens: 'Tomate', recIds: ['rec-arroz-graneado', 'rec-jugo'] },
    { plantillaId: 'plt-almuerzo-tallarines-soya', plat: 'Tallarines con salsa boloñesa', acomp: 'Tallarines', ens: 'Repollo', recIds: ['rec-fideos', 'rec-salsa-soya', 'rec-ensalada-repollo', 'rec-jugo'] },
    { plantillaId: '', plat: 'Colación de retorno (Viaje)', acomp: 'Sándwich', ens: '', recIds: [] }
  ]

  for (let d = 1; d <= dias; d++) {
    const diaIdx = d - 1
    const diaLabel = `${nombresDias[diaIdx % nombresDias.length]} (Día ${d})`
    const alm = almuerzos[diaIdx % almuerzos.length]

    // 1. Desayuno
    const desPlt = d % 2 === 0 ? 'plt-desayuno-leche-pan-cecina' : 'plt-desayuno-leche-pan-mermelada'
    const desRecs = d % 2 === 0
      ? ['rec-leche-chocolate', 'rec-pan-campamento', 'rec-pan-cecina']
      : ['rec-leche-chocolate', 'rec-pan-campamento', 'rec-pan-mermelada']

    bloques.push({
      id: `${menuId}-d${d}-desayuno`,
      menu_id: menuId,
      numero_dia: d,
      orden: 1,
      dia_etiqueta: diaLabel,
      tiempo_comida: 'desayuno',
      responsables: [turnosDesayuno[diaIdx % turnosDesayuno.length]],
      plantilla_id: desPlt,
      bebidas_ids: ['rec-leche-chocolate'],
      plato_principal_ids: [],
      agregados_ids: d % 2 === 0 ? ['rec-pan-campamento', 'rec-pan-cecina'] : ['rec-pan-campamento', 'rec-pan-mermelada'],
      alternativas_ids: [],
      ensaladas_ids: [],
      recetas_ids: desRecs,
      platos_texto: d % 2 === 0 ? 'Leche con chocolate y pan con cecina' : 'Leche con chocolate y pan con mermelada',
      bebida_texto: 'Leche con chocolate',
      pan_agregado: d % 2 === 0 ? 'Margarina y cecina' : 'Mermelada mora',
      alternativa_dietetica: 'Margarina (Veg)'
    })

    // 2. Almuerzo
    bloques.push({
      id: `${menuId}-d${d}-almuerzo`,
      menu_id: menuId,
      numero_dia: d,
      orden: 2,
      dia_etiqueta: diaLabel,
      tiempo_comida: 'almuerzo',
      responsables: [turnosAlmuerzo[diaIdx % turnosAlmuerzo.length]],
      plantilla_id: alm.plantillaId || undefined,
      bebidas_ids: ['rec-jugo'],
      plato_principal_ids: alm.recIds.filter(id => id === 'rec-fideos' || id === 'rec-pure' || id === 'rec-charquican' || id === 'rec-arroz-graneado' || id === 'rec-cazuela-pollo'),
      agregados_ids: alm.recIds.filter(id => id === 'rec-salsa-soya' || id === 'rec-vienesas'),
      alternativas_ids: [],
      ensaladas_ids: alm.recIds.filter(id => id === 'rec-ensalada-repollo' || id === 'rec-ensalada-tomate'),
      postres_ids: ['rec-fruta-temporada'],
      recetas_ids: [...alm.recIds, 'rec-fruta-temporada'],
      platos_texto: alm.plat,
      acompanamiento_texto: alm.acomp,
      ensalada_texto: alm.ens,
      bebida_texto: 'Jugo concentrado',
      alternativa_dietetica: 'Carne de soya (Veg)'
    })

    // 3. Media tarde: Baños y Fruta
    bloques.push({
      id: `${menuId}-d${d}-bano_fruta`,
      menu_id: menuId,
      numero_dia: d,
      orden: 3,
      dia_etiqueta: diaLabel,
      tiempo_comida: 'bano_fruta',
      responsables: [turnosAlmuerzo[diaIdx % turnosAlmuerzo.length]],
      plantilla_id: undefined,
      bebidas_ids: [],
      plato_principal_ids: [],
      agregados_ids: [],
      alternativas_ids: [],
      ensaladas_ids: [],
      postres_ids: ['rec-fruta-temporada'],
      recetas_ids: ['rec-fruta-temporada'],
      platos_texto: 'Fruta fresca de temporada (Plátano / Manzana / Naranja)',
      notas: 'Sanitización de baños del campamento y entrega de colación'
    })

    // 4. Once
    const oncePlt = d === 1
      ? 'plt-once-te-pan-huevos'
      : d === 2
      ? 'plt-once-te-pan-manjar'
      : 'plt-once-te-pan-cecina'
    const onceRecs = d === 1
      ? ['rec-te-fondo', 'rec-pan-campamento', 'rec-huevos-revueltos']
      : d === 2
      ? ['rec-te-fondo', 'rec-pan-campamento', 'rec-pan-manjar']
      : ['rec-te-fondo', 'rec-pan-campamento', 'rec-pan-cecina']

    bloques.push({
      id: `${menuId}-d${d}-once`,
      menu_id: menuId,
      numero_dia: d,
      orden: 4,
      dia_etiqueta: diaLabel,
      tiempo_comida: 'once',
      responsables: [turnosOnce[diaIdx % turnosOnce.length]],
      plantilla_id: oncePlt,
      bebidas_ids: ['rec-te-fondo'],
      plato_principal_ids: [],
      agregados_ids: d === 1
        ? ['rec-pan-campamento', 'rec-huevos-revueltos']
        : d === 2
        ? ['rec-pan-campamento', 'rec-pan-manjar']
        : ['rec-pan-campamento', 'rec-pan-cecina'],
      alternativas_ids: [],
      ensaladas_ids: [],
      recetas_ids: onceRecs,
      platos_texto: d === 1 ? 'Té con pan y huevos revueltos' : d === 2 ? 'Té con pan y manjar' : 'Té con pan y cecina',
      bebida_texto: 'Té caliente en fondo',
      pan_agregado: d === 1 ? 'Huevo revuelto' : d === 2 ? 'Manjar' : 'Cecina',
      alternativa_dietetica: 'Mermelada (Sin lactosa)'
    })

    // 5. Cena
    bloques.push({
      id: `${menuId}-d${d}-cena`,
      menu_id: menuId,
      numero_dia: d,
      orden: 5,
      dia_etiqueta: diaLabel,
      tiempo_comida: 'cena',
      responsables: [turnosCena[diaIdx % turnosCena.length]],
      plantilla_id: d === dias ? undefined : 'plt-cena-sopa-caliente',
      bebidas_ids: [],
      plato_principal_ids: [],
      agregados_ids: [],
      alternativas_ids: [],
      ensaladas_ids: [],
      postres_ids: [],
      sopas_ids: d === dias ? [] : ['rec-cena-sopa'],
      recetas_ids: d === dias ? [] : ['rec-cena-sopa'],
      platos_texto: d === dias ? 'Colación de viaje (Galleta y jugo)' : 'Sopa instantánea de pollo con fideos'
    })
  }

  return {
    id: menuId,
    nombre: `Menú de Campamento (${dias} Días)`,
    numero_personas: asistentes,
    dias_totales: dias,
    margen_seguridad_pct: 5,
    precio_pan_unitario: 150,
    consumo_pan_diario: 3,
    bloques
  }
}

/**
 * Genera un menú completamente en blanco para un campamento nuevo
 */
export function generarMenuEnBlanco(menuId: string, dias: number, asistentes: number = 40): CampamentoMenu {
  const bloques: CampamentoMenuBloque[] = []
  const tiempos: { id: CampamentoMenuBloque['tiempo_comida']; label: string }[] = [
    { id: 'desayuno', label: 'Desayuno' },
    { id: 'almuerzo', label: 'Almuerzo' },
    { id: 'bano_fruta', label: 'Baños y Fruta' },
    { id: 'once', label: 'Once' },
    { id: 'cena', label: 'Cena' }
  ]

  for (let d = 1; d <= dias; d++) {
    tiempos.forEach((t, idx) => {
      bloques.push({
        id: `${menuId}-d${d}-${t.id}`,
        menu_id: menuId,
        numero_dia: d,
        orden: idx + 1,
        dia_etiqueta: `Día ${d}`,
        tiempo_comida: t.id,
        responsables: [],
        bebidas_ids: [],
        plato_principal_ids: [],
        agregados_ids: [],
        alternativas_ids: [],
        ensaladas_ids: [],
        postres_ids: [],
        sopas_ids: [],
        recetas_ids: [],
        platos_texto: '',
        acompanamiento_texto: '',
        ensalada_texto: '',
        bebida_texto: '',
        pan_agregado: '',
        alternativa_dietetica: '',
        notas: ''
      })
    })
  }

  return {
    id: menuId,
    nombre: `Plan de Menú (${dias} Días)`,
    numero_personas: asistentes,
    dias_totales: dias,
    margen_seguridad_pct: 5,
    precio_pan_unitario: 150,
    consumo_pan_diario: 3,
    bloques
  }
}
