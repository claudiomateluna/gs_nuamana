import { describe, it, expect } from 'vitest';
import { buildArticleGraph, detectarTipo, headingSteps, MIN_HOWTO_STEPS } from '@/lib/schema/build-article';
import { categoryChain, deepestChain, MAX_CATEGORY_DEPTH } from '@/lib/schema/chains';
import type { ArticleKind, ArticleSchemaInput, CategoriaRow } from '@/lib/schema/types';
import type { ArticuloMetadata } from '@/types';

/**
 * Mirrors supabase/migrations/20260223000000_init.sql (categorias, lines
 * 3647-3669). A made-up tree here lets classification rules pass without ever
 * being exercised, so ids and parents must match production exactly.
 */
const CATEGORIAS: CategoriaRow[] = [
  { id: 1, nombre: 'Actividades', slug: 'actividades', parent_id: null },
  { id: 2, nombre: 'Técnicas', slug: 'tecnicas', parent_id: null },
  { id: 3, nombre: 'Historia', slug: 'historia', parent_id: null },
  { id: 4, nombre: 'Administrativo', slug: 'administrativo', parent_id: null },
  { id: 5, nombre: 'Ciudadanía', slug: 'ciudadania', parent_id: null },
  { id: 6, nombre: 'Reflexión', slug: 'reflexion', parent_id: null },
  { id: 7, nombre: 'Juegos', slug: 'juegos', parent_id: 1 },
  { id: 8, nombre: 'Juegos Democráticos', slug: 'juegos-democraticos', parent_id: 1 },
  { id: 9, nombre: 'Juegos Nocturnos', slug: 'juegos-nocturnos', parent_id: 1 },
  { id: 10, nombre: 'Dinámicas', slug: 'dinamicas', parent_id: 1 },
  { id: 11, nombre: 'Talleres', slug: 'talleres', parent_id: 1 },
  { id: 12, nombre: 'Apoderados', slug: 'apoderados', parent_id: 4 },
  { id: 13, nombre: 'Información', slug: 'informacion', parent_id: 4 },
  { id: 14, nombre: 'Biografías', slug: 'biografias', parent_id: 3 },
  { id: 15, nombre: 'Historia Scout', slug: 'historia-scout', parent_id: 3 },
  { id: 16, nombre: 'Historias Scouts', slug: 'historias-scouts', parent_id: 3 },
  { id: 17, nombre: 'Animación', slug: 'animacion', parent_id: 2 },
  { id: 18, nombre: 'Cabuyería', slug: 'cabuyeria', parent_id: 2 },
  { id: 19, nombre: 'Campismo', slug: 'campismo', parent_id: 2 },
  { id: 20, nombre: 'Claves y Pistas', slug: 'claves-y-pistas', parent_id: 2 },
  { id: 21, nombre: 'Cocina', slug: 'cocina', parent_id: 2 },
  { id: 22, nombre: 'Pionerismo', slug: 'pionerismo', parent_id: 2 },
  { id: 23, nombre: 'Primeros Auxilios', slug: 'primeros-auxilios', parent_id: 2 },
  // Synthetic: production has no non-game, non-talleres child of Actividades yet.
  // Guards the `roots.has('actividades') && hasGameMetadata` rule on a DESCENDANT.
  { id: 900, nombre: 'Otras Actividades', slug: 'otras-actividades', parent_id: 1 },
];

const byId = new Map<number, CategoriaRow>(CATEGORIAS.map((c) => [c.id, c]));

interface MakeInputOverrides extends Partial<ArticleSchemaInput> {
  /** Test shorthand: resolve chain/chains from the fixture tree. */
  categoriaIds?: number[];
}

function makeInput(overrides: MakeInputOverrides = {}): ArticleSchemaInput {
  const { categoriaIds, ...rest } = overrides;
  const chains = Array.isArray(rest.chains)
    ? rest.chains
    : (categoriaIds ?? [])
        .map((id) => categoryChain(id, byId))
        .filter((resolved) => resolved.length > 0);
  const chain = rest.chain ?? deepestChain(chains);
  return {
    titulo: 'Título de prueba',
    contenido: '<p>Cuerpo del artículo.</p>',
    extracto: 'Extracto del artículo',
    imagen_destacada: '/uploads/portada.webp',
    created_at: '2026-01-15T10:00:00.000Z',
    updated_at: null,
    etiquetas: null,
    autor: null,
    metadata: null,
    canonicalUrl: 'https://nuamana.cl/blog/actividades/juegos/titulo-de-prueba',
    ...rest,
    chain,
    chains,
  };
}

/** Fails the test when the graph holds '', [], null, undefined or an empty object. */
function expectNoEmptyValues(value: unknown, path = '$'): void {
  if (value === undefined) throw new Error(`${path} is undefined`);
  if (value === null) throw new Error(`${path} is null`);
  if (typeof value === 'string' && value.trim() === '') throw new Error(`${path} is an empty string`);
  if (Array.isArray(value)) {
    if (value.length === 0) throw new Error(`${path} is an empty array`);
    value.forEach((item, i) => expectNoEmptyValues(item, `${path}[${i}]`));
    return;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) throw new Error(`${path} is an empty object`);
    entries.forEach(([key, entry]) => expectNoEmptyValues(entry, `${path}.${key}`));
  }
}

const gameMetadata = {
  unidades: ['manada'],
  areas: ['corporalidad', 'corporalidad'],
  lugares: ['campo abierto', 'Bosque'],
  duracion: '90 minutos',
  cantidad: '04 participantes',
  materiales: ['Antorchas', 'Silbato'],
  objetivos: ['Jugar en equipo', 'Cuidar el fuego'],
  variaciones: '<p>Jugar con menos luz.</p>',
  recomendaciones: '<p>Vigilar siempre el fuego.</p>',
  objetivos_educativos: [
    { id: 'a1', texto: 'Cuido el entorno', unidad: 'Manada', area: 'Corporalidad', como_se_cumple: 'Reutiliza materiales' },
  ],
};

const gameInput = makeInput({
  titulo: 'Las Antorchas',
  contenido: '<h2>Preparación</h2><p>Reúnan las antorchas.</p><h2>Desarrollo</h2><p>Jueguen en círculo.</p>',
  extracto: 'Un juego nocturno para manada',
  etiquetas: ['nocturno', 'manada'],
  autor: { nombres: 'Ana', apellidos: 'Pérez' },
  categoriaIds: [9],
  metadata: gameMetadata,
});

const gameWithoutMetadata = makeInput({
  titulo: 'Juego sin ficha',
  contenido: '<p>Descripción breve.</p>',
  extracto: null,
  etiquetas: null,
  categoriaIds: [7],
  metadata: null,
});

const biografiaInput = makeInput({
  titulo: 'Rosa Ibáñez',
  contenido: '<p>Una vida dedicada al movimiento.</p>',
  categoriaIds: [14],
  metadata: {
    lugar_nacimiento: 'Santiago',
    pais_nacimiento: 'Chile',
    fecha_nacimiento: '1930-05-01',
    fecha_defuncion: '2020-11-11',
  },
});

const historiaInput = makeInput({
  titulo: 'La gran travesía',
  contenido: '<p>Una tarde de verano el grupo subió al cerro.</p>',
  etiquetas: ['memoria'],
  categoriaIds: [15],
  metadata: { lugar_hecho: 'Valparaíso', pais_hecho: 'Chile', ano_hecho: '1965' },
});

const tecnicaConHeadings = makeInput({
  titulo: 'Nudo palomero',
  contenido:
    '<h2>Material</h2><p>Cuerda y navaja.</p><h3>Montaje</h3><p>Tensa la cuerda entre dos árboles.</p>',
  categoriaIds: [21],
  metadata: { duracion: '30 minutos', materiales: ['Cuerda'] },
});

const tecnicaSinHeadings = makeInput({
  titulo: 'Lazada sencilla',
  contenido: 'Instrucciones en texto plano, sin encabezados.',
  categoriaIds: [21],
  metadata: { duracion: '20 minutos' },
});

const articuloSinCategoria = makeInput({
  titulo: 'Crónica suelta',
  contenido: '<p>Texto editorial sin categoría scout.</p>',
  extracto: null,
  imagen_destacada: null,
  etiquetas: null,
  categoriaIds: [4],
  metadata: null,
});

const articuloSinCategoriasResueltas = makeInput({
  titulo: 'Nota suelta',
  contenido: '<p>Texto sin categorías resolubles.</p>',
  imagen_destacada: null,
  etiquetas: null,
  categoriaIds: [999],
  metadata: null,
});

describe('detectarTipo', () => {
  const cases: Array<{
    name: string;
    categoriaIds: number[];
    metadata: ArticuloMetadata | null;
    expected: ArticleKind;
  }> = [
    { name: 'biografía', categoriaIds: [14], metadata: null, expected: 'biografia' },
    { name: 'historia por slug corto', categoriaIds: [15], metadata: null, expected: 'historia' },
    { name: 'historia por slug largo', categoriaIds: [16], metadata: null, expected: 'historia' },
    { name: 'raíz técnicas', categoriaIds: [2], metadata: null, expected: 'howto' },
    { name: 'hijo de técnicas (cocina)', categoriaIds: [21], metadata: null, expected: 'howto' },
    // Would become 'article' if `slugs.has('talleres')` were removed: its root is Actividades.
    { name: 'slug talleres bajo actividades', categoriaIds: [11], metadata: null, expected: 'howto' },
    { name: 'slug juegos', categoriaIds: [7], metadata: null, expected: 'game' },
    { name: 'slug juegos democráticos', categoriaIds: [8], metadata: null, expected: 'game' },
    { name: 'slug juegos nocturnos', categoriaIds: [9], metadata: null, expected: 'game' },
    { name: 'slug dinámicas', categoriaIds: [10], metadata: null, expected: 'game' },
    { name: 'actividades con metadata de juego', categoriaIds: [1], metadata: { unidades: ['manada'] }, expected: 'game' },
    {
      name: 'hijo directo de actividades con solo variaciones',
      categoriaIds: [900],
      metadata: { variaciones: '<p>Otra forma de jugar.</p>' },
      expected: 'game',
    },
    {
      name: 'actividades con solo variaciones (regla del gate)',
      categoriaIds: [1],
      metadata: { variaciones: '<p>Otra forma de jugar.</p>' },
      expected: 'game',
    },
    { name: 'actividades sin metadata', categoriaIds: [1], metadata: null, expected: 'article' },
    { name: 'categoría sin regla', categoriaIds: [4], metadata: null, expected: 'article' },
    { name: 'id inexistente', categoriaIds: [999], metadata: null, expected: 'article' },
  ];

  for (const entry of cases) {
    it(`detects ${entry.name}`, () => {
      expect(detectarTipo(makeInput({ categoriaIds: entry.categoriaIds, metadata: entry.metadata }))).toBe(
        entry.expected,
      );
    });
  }

  // Would become 'article' if 'recomendaciones' left GAME_METADATA_KEYS: the
  // article still carries game data, so the type must stay a Game.
  it('stays a Game when recomendaciones is the only game metadata key', () => {
    const graph = buildArticleGraph(
      makeInput({ categoriaIds: [1], metadata: { recomendaciones: '<p>Vigilar siempre el fuego.</p>' } }),
    );
    expect(graph['@type']).toEqual(['Article', 'Game']);
  });

  // Would become 'article' if 'objetivos_educativos' left GAME_METADATA_KEYS.
  it('stays a Game when objetivos_educativos is the only game metadata key', () => {
    const graph = buildArticleGraph(
      makeInput({
        categoriaIds: [1],
        metadata: { objetivos_educativos: [{ id: 'gate', texto: 'Cuido el entorno' }] },
      }),
    );
    expect(graph['@type']).toEqual(['Article', 'Game']);
  });

  // Would become 'game' if the roots.has('actividades') check left the gate:
  // game metadata alone must not promote an article from another root.
  it('keeps a plain article outside actividades even with game metadata', () => {
    const input = makeInput({
      categoriaIds: [4],
      metadata: { unidades: ['manada'], duracion: '90 minutos' },
    });
    expect(detectarTipo(input)).toBe('article');
    expect(buildArticleGraph(input)['@type']).toBe('Article');
  });

  it('ignores malformed chains instead of throwing', () => {
    const input = {
      ...makeInput({ categoriaIds: [7] }),
      chains: 'bogus' as unknown as CategoriaRow[][],
      chain: null as unknown as CategoriaRow[],
    };
    // No usable hierarchy → no classification, but never an exception.
    expect(detectarTipo(input)).toBe('article');
    expect(() => buildArticleGraph(input)).not.toThrow();
  });

  it('tolerates legacy comma-separated tags', () => {
    const graph = buildArticleGraph(
      makeInput({ categoriaIds: [7], etiquetas: 'nocturno, manada' as unknown as string[] }),
    );
    expect(graph.keywords).toBe('nocturno, manada');
  });
});

describe('categoryChain', () => {
  it('stops on a parent_id cycle instead of looping forever', () => {
    const cyclic = new Map<number, CategoriaRow>([
      [100, { id: 100, nombre: 'A', slug: 'a', parent_id: 101 }],
      [101, { id: 101, nombre: 'B', slug: 'b', parent_id: 100 }],
    ]);
    const chain = categoryChain(100, cyclic);
    expect(chain.map((c) => c.id)).toEqual([101, 100]);
    expect(chain).toHaveLength(2);
  });

  it('caps a runaway hierarchy at MAX_CATEGORY_DEPTH', () => {
    const deep = new Map<number, CategoriaRow>();
    for (let i = 1; i <= 40; i++) {
      deep.set(i, { id: i, nombre: `Cat ${i}`, slug: `cat-${i}`, parent_id: i === 1 ? null : i - 1 });
    }
    const chain = categoryChain(40, deep);
    expect(chain).toHaveLength(MAX_CATEGORY_DEPTH);
    expect(chain[chain.length - 1].id).toBe(40);
    expect(deepestChain([chain, [deep.get(1)!]])).toBe(chain);
  });
});

describe('buildArticleGraph — game', () => {
  const graph = buildArticleGraph(gameInput);

  it('keeps the common Article shape', () => {
    expect(graph['@context']).toBe('https://schema.org');
    expect(graph['@type']).toEqual(['Article', 'Game']);
    expect(graph.headline).toBe('Las Antorchas');
    expect(graph.description).toBe('Un juego nocturno para manada');
    expect(graph.mainEntityOfPage).toEqual({ '@type': 'WebPage', '@id': gameInput.canonicalUrl });
    expect(graph.datePublished).toBe('2026-01-15T10:00:00.000Z');
    expect(graph.dateModified).toBe('2026-01-15T10:00:00.000Z');
    expect(graph.author).toEqual({ '@type': 'Person', name: 'Ana Pérez' });
    expect(graph.publisher).toEqual({ '@id': 'https://nuamana.cl/#organization' });
    expect(graph.image).toEqual({
      '@type': 'ImageObject',
      url: 'https://nuamana.cl/uploads/portada.webp',
      width: 1200,
      height: 630,
    });
    expect(graph.isFamilyFriendly).toBe(true);
    expect(graph.inLanguage).toBe('es');
    expect(graph.articleSection).toBe('Juegos Nocturnos');
    expect(graph.keywords).toBe('nocturno, manada');
  });

  it('emits the game metadata', () => {
    expect(graph.typicalAgeRange).toBe('7-11');
    expect(graph.timeRequired).toBe('PT1H30M');
    expect(graph.numberOfPlayers).toEqual({
      '@type': 'QuantitativeValue',
      value: 4,
      minValue: 4,
      maxValue: 4,
      unitText: 'People',
    });
    expect(graph.gameItem).toEqual([{ '@type': 'Thing', name: 'Corporalidad' }]);
    expect(graph.gameLocation).toEqual([
      { '@type': 'Place', name: 'Campo Abierto' },
      { '@type': 'Place', name: 'Bosque' },
    ]);
    expect(graph.material).toEqual(['Antorchas', 'Silbato']);
    expect(graph.quest).toEqual({
      '@type': 'Thing',
      name: 'Objetivos',
      description: 'Jugar en equipo. Cuidar el fuego.',
    });
    expect(graph.workExample).toEqual({
      '@type': 'CreativeWork',
      name: 'Variaciones',
      description: 'Jugar con menos luz.',
    });
    expect(graph.disambiguatingDescription).toBe('Vigilar siempre el fuego.');
    expect(graph.educationalLevel).toBe('Manada');
    expect(graph.educationalAlignment).toEqual([
      {
        '@type': 'AlignmentObject',
        educationalFramework: 'Progresión Educativa Nua Mana',
        targetDescription: 'Cuido el entorno',
        description: 'Reutiliza materiales',
      },
    ]);
  });

  it('exposes categories as DefinedTerm with root-to-leaf urls', () => {
    const about = graph.about as Array<Record<string, unknown>>;
    expect(Array.isArray(about)).toBe(true);
    expect(about[0]['@type']).toBe('DefinedTerm');
    expect(about.map((term) => term.url)).toEqual([
      'https://nuamana.cl/blog/actividades',
      'https://nuamana.cl/blog/actividades/juegos-nocturnos',
    ]);
  });

  it('returns an articleBody without html and no empty values', () => {
    expect(graph.articleBody).toBe('Preparación Reúnan las antorchas. Desarrollo Jueguen en círculo.');
    expect(graph.articleBody).not.toContain('<');
    expectNoEmptyValues(graph);
  });

  it('reads objectives from the relational rows the page renders', () => {
    const withRelational = buildArticleGraph({
      ...gameInput,
      metadata: { ...gameMetadata, objetivos_educativos: [{ id: 'jsonb', texto: 'Del JSONB' }] },
      objetivosEducativos: [
        { id: 'rel', texto: 'De la tabla', unidad: 'Manada', area: 'Corporalidad', como_se_cumple: 'Observa' },
      ],
    });
    expect(withRelational.educationalAlignment).toEqual([
      {
        '@type': 'AlignmentObject',
        educationalFramework: 'Progresión Educativa Nua Mana',
        targetDescription: 'De la tabla',
        description: 'Observa',
      },
    ]);
    expect(withRelational.educationalLevel).toBe('Manada');
  });

  it('falls back to the metadata JSONB when there are no relational rows', () => {
    const fallback = buildArticleGraph({ ...gameInput, objetivosEducativos: [] });
    expect(fallback.educationalAlignment).toEqual([
      {
        '@type': 'AlignmentObject',
        educationalFramework: 'Progresión Educativa Nua Mana',
        targetDescription: 'Cuido el entorno',
        description: 'Reutiliza materiales',
      },
    ]);
  });
});

describe('buildArticleGraph — game without metadata', () => {
  const graph = buildArticleGraph(gameWithoutMetadata);

  it('is a Game with no empty game properties', () => {
    expect(graph['@type']).toEqual(['Article', 'Game']);
    expect(graph).not.toHaveProperty('typicalAgeRange');
    expect(graph).not.toHaveProperty('educationalLevel');
    expect(graph).not.toHaveProperty('timeRequired');
    expect(graph).not.toHaveProperty('numberOfPlayers');
    expect(graph).not.toHaveProperty('material');
    expect(graph).not.toHaveProperty('quest');
    expect(graph).not.toHaveProperty('gameItem');
    expect(graph.description).toBe('Descripción breve.');
    expect(graph.keywords).toBe('Actividades, Juegos');
    expectNoEmptyValues(graph);
  });
});

describe('buildArticleGraph — game aliases and legacy values', () => {
  it('reads areas_desarrollo and lugar when the modern keys are missing', () => {
    const graph = buildArticleGraph(
      makeInput({ categoriaIds: [7], metadata: { areas_desarrollo: ['corporalidad'], lugar: ['Bosque'] } }),
    );
    expect(graph.gameItem).toEqual([{ '@type': 'Thing', name: 'Corporalidad' }]);
    expect(graph.gameLocation).toEqual([{ '@type': 'Place', name: 'Bosque' }]);
    expectNoEmptyValues(graph);
  });

  it('skips blank list items so a filled alias still wins', () => {
    const graph = buildArticleGraph(
      makeInput({ categoriaIds: [7], metadata: { areas: [''], areas_desarrollo: ['corporalidad'] } }),
    );
    expect(graph.gameItem).toEqual([{ '@type': 'Thing', name: 'Corporalidad' }]);
  });

  it('keeps an objective that only carries texto_terminal', () => {
    const graph = buildArticleGraph(
      makeInput({
        categoriaIds: [7],
        metadata: { objetivos_educativos: [{ id: 'only-terminal', texto_terminal: 'El niño distingue...' }] },
      }),
    );
    expect(graph.educationalAlignment).toEqual([
      {
        '@type': 'AlignmentObject',
        educationalFramework: 'Progresión Educativa Nua Mana',
        targetDescription: 'El niño distingue...',
      },
    ]);
    // Objectives without a unit in metadata must not invent a level.
    expect(graph).not.toHaveProperty('educationalLevel');
  });
});

describe('buildArticleGraph — educationalLevel', () => {
  it('lives on the root node, never inside an AlignmentObject', () => {
    const graph = buildArticleGraph(gameInput);
    const alignment = graph.educationalAlignment as Array<Record<string, unknown>>;
    expect(alignment[0]).not.toHaveProperty('educationalLevel');
    expect(graph.educationalLevel).toBe('Manada');
  });

  it('is a plain string when metadata carries exactly one unit', () => {
    const graph = buildArticleGraph(makeInput({ categoriaIds: [7], metadata: { unidades: ['manada'] } }));
    expect(graph.educationalLevel).toBe('Manada');
    expect(Array.isArray(graph.educationalLevel)).toBe(false);
  });

  it('is an array holding every unit, sorted by age, from two units on', () => {
    const graph = buildArticleGraph(
      makeInput({ categoriaIds: [7], metadata: { unidades: ['clan', 'manada'] } }),
    );
    expect(graph.educationalLevel).toEqual(['Manada', 'Clan']);
  });

  it('is absent when metadata carries no recognizable unit', () => {
    expect(buildArticleGraph(articuloSinCategoria)).not.toHaveProperty('educationalLevel');
    expect(buildArticleGraph(gameWithoutMetadata)).not.toHaveProperty('educationalLevel');
    expect(
      buildArticleGraph(makeInput({ categoriaIds: [7], metadata: { unidades: ['piratas'] } })),
    ).not.toHaveProperty('educationalLevel');
  });
});

describe('buildArticleGraph — biografía', () => {
  const graph = buildArticleGraph(biografiaInput);
  const about = graph.about as Record<string, unknown>;

  it('uses a plain Article type and a Person as about', () => {
    expect(graph['@type']).toBe('Article');
    expect(Array.isArray(about)).toBe(false);
    expect(about['@type']).toBe('Person');
    expect(about.name).toBe('Rosa Ibáñez');
    expect(about.birthPlace).toEqual({ '@type': 'Place', name: 'Santiago, Chile' });
    expect(about.birthDate).toBe('1930-05-01');
    expect(about.deathDate).toBe('2020-11-11');
    expect(about).not.toHaveProperty('deathPlace');
  });

  it('keeps categories in section and keywords', () => {
    expect(graph.articleSection).toBe('Biografías');
    expect(graph.keywords).toBe('Historia, Biografías');
    expectNoEmptyValues(graph);
  });
});

describe('buildArticleGraph — historia', () => {
  const graph = buildArticleGraph(historiaInput);

  it('uses ShortStory with place and year', () => {
    expect(graph['@type']).toEqual(['Article', 'ShortStory']);
    expect(graph.genre).toBe('Historia Scout');
    expect(graph.spatialCoverage).toEqual({ '@type': 'Place', name: 'Valparaíso' });
    expect(graph.temporal).toBe('1965');
    expect(graph.keywords).toBe('memoria');
    expect(Array.isArray(graph.about)).toBe(true);
    expectNoEmptyValues(graph);
  });
});

describe('headingSteps', () => {
  it('returns nothing below MIN_HOWTO_STEPS', () => {
    expect(MIN_HOWTO_STEPS).toBe(2);
    expect(headingSteps('')).toEqual([]);
    expect(headingSteps('<h2>Único</h2><p>Texto.</p>')).toEqual([]);
  });

  it('drops steps without a heading or without body text', () => {
    expect(headingSteps('<h2>Único</h2>')).toEqual([]);
    const steps = headingSteps('<h2>A</h2><p>uno</p><h2></h2><h2>B</h2><p>dos</p>');
    expect(steps).toEqual([
      { name: 'A', text: 'uno' },
      { name: 'B', text: 'dos' },
    ]);
  });
});

describe('buildArticleGraph — técnica', () => {
  it('builds HowTo steps only from real headings', () => {
    const graph = buildArticleGraph(tecnicaConHeadings);
    expect(graph['@type']).toEqual(['Article', 'HowTo']);
    expect(graph.totalTime).toBe('PT30M');
    expect(graph.supply).toEqual(['Cuerda']);
    expect(graph).not.toHaveProperty('tool');
    expect(graph.step).toEqual([
      { '@type': 'HowToStep', name: 'Material', text: 'Cuerda y navaja.' },
      { '@type': 'HowToStep', name: 'Montaje', text: 'Tensa la cuerda entre dos árboles.' },
    ]);
    expectNoEmptyValues(graph);
  });

  it('is a plain Article when the content has no headings', () => {
    const graph = buildArticleGraph(tecnicaSinHeadings);
    expect(graph['@type']).toBe('Article');
    expect(graph).not.toHaveProperty('step');
    expect(graph.articleBody).toBe('Instrucciones en texto plano, sin encabezados.');
    expectNoEmptyValues(graph);
  });

  it('is a plain Article when a single heading is all there is', () => {
    const graph = buildArticleGraph(
      makeInput({ categoriaIds: [21], contenido: '<h2>Preparación</h2><p>Reúnan la cuerda.</p>' }),
    );
    expect(graph['@type']).toBe('Article');
    expect(graph).not.toHaveProperty('step');
  });

  it('never emits a step without text after its heading', () => {
    const graph = buildArticleGraph(
      makeInput({
        categoriaIds: [21],
        contenido: '<h2>Preparación</h2><p>Reúnan la cuerda.</p><h3>Desarrollo</h3>',
      }),
    );
    expect(graph['@type']).toBe('Article');
    expect(graph).not.toHaveProperty('step');
    expectNoEmptyValues(graph);
  });

  it('emits tool when equipo_necesario is present', () => {
    const graph = buildArticleGraph(
      makeInput({
        categoriaIds: [21],
        contenido: '<h2>Preparación</h2><p>Reúnan.</p><h2>Desarrollo</h2><p>Nuden.</p>',
        metadata: { equipo_necesario: ['Cuerda', 'Navaja'] },
      }),
    );
    expect(graph['@type']).toEqual(['Article', 'HowTo']);
    expect(graph.tool).toEqual(['Cuerda', 'Navaja']);
    expectNoEmptyValues(graph);
  });
});

describe('buildArticleGraph — article body hygiene', () => {
  it('strips the invisible characters the UI already strips', () => {
    const graph = buildArticleGraph(
      makeInput({ categoriaIds: [7], contenido: '<p>Hola&nbsp;mundo&shy;final\u200Bfin</p>' }),
    );
    expect(graph.articleBody).toBe('Hola mundofinalfin');
    expect(graph.articleBody).not.toContain('&nbsp;');
    expect(graph.articleBody).not.toContain('&shy;');
    expect(graph.articleBody).not.toContain('\u200B');
  });
});

describe('buildArticleGraph — plain article', () => {
  const graph = buildArticleGraph(articuloSinCategoria);

  it('falls back to Article for categories outside the article types', () => {
    expect(graph['@type']).toBe('Article');
    expect(graph.articleSection).toBe('Administrativo');
    expect(graph.keywords).toBe('Administrativo');
    expect(graph.description).toBe('Texto editorial sin categoría scout.');
    expect(graph.about).toEqual([
      { '@type': 'DefinedTerm', name: 'Administrativo', url: 'https://nuamana.cl/blog/administrativo' },
    ]);
    expect(graph).not.toHaveProperty('image');
    expectNoEmptyValues(graph);
  });

  it('falls back to the organization when there is no author', () => {
    expect(graph.author).toEqual({ '@id': 'https://nuamana.cl/#organization' });
  });

  it('omits about, section and keywords when no category resolves', () => {
    const orphan = buildArticleGraph(articuloSinCategoriasResueltas);
    expect(orphan['@type']).toBe('Article');
    expect(orphan).not.toHaveProperty('about');
    expect(orphan).not.toHaveProperty('articleSection');
    expect(orphan).not.toHaveProperty('keywords');
    expect(orphan).not.toHaveProperty('image');
    expectNoEmptyValues(orphan);
  });
});



