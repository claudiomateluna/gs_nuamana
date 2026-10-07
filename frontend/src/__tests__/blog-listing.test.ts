import { describe, it, expect } from 'vitest';
import {
  POSTS_PER_PAGE,
  UNIDADES,
  AREAS,
  parseBlogFilters,
  hasAnyFilter,
  blogFiltersKey,
  resolveBlogCanonical,
  articlePath,
  attachArticlePaths,
  indexCategoriasById,
  type BlogArticleRow,
} from '@/lib/blog-listing';
import type { CategoriaRow } from '@/lib/schema/types';

const CATEGORIAS: CategoriaRow[] = [
  { id: 1, nombre: 'Actividades', slug: 'actividades', parent_id: null },
  { id: 4, nombre: 'Administrativo', slug: 'administrativo', parent_id: null },
  { id: 10, nombre: 'Dinámicas', slug: 'dinamicas', parent_id: 1 },
  { id: 13, nombre: 'Información', slug: 'informacion', parent_id: 4 },
  { id: 21, nombre: 'Cocina', slug: 'cocina', parent_id: 2 },
];

const byId = indexCategoriasById(CATEGORIAS);

function makeRow(overrides: Partial<BlogArticleRow> = {}): BlogArticleRow {
  return {
    id: 'a1',
    slug: 'creacion-de-objetos-utiles',
    titulo: 'Creación de objetos útiles',
    extracto: 'Extracto',
    imagen_destacada: null,
    articulo_categorias: [{ categoria_id: 10, categorias: CATEGORIAS[2] }],
    ...overrides,
  };
}

describe('contrato del listado', () => {
  it('mantiene el tamaño de página de la paginación infinita', () => {
    expect(POSTS_PER_PAGE).toBe(9);
  });

  it('usa los valores de filtros con tilde, alineados a lo que la BD guarda', () => {
    expect(UNIDADES).toEqual(['manada', 'compañía', 'tropa', 'avanzada', 'clan']);
    expect(AREAS).toEqual(['corporalidad', 'creatividad', 'carácter', 'afectividad', 'sociabilidad', 'espiritualidad']);
  });
});

describe('parseBlogFilters', () => {
  it('usa los defaults cuando la URL no trae filtros', () => {
    expect(parseBlogFilters(new URLSearchParams())).toEqual({
      q: '',
      category: 'todas',
      unidades: '',
      areas: '',
      tag: '',
      metaKey: '',
      metaValue: '',
      objEd: '',
    });
  });

  it('lee los 7 filtros desde URLSearchParams (cliente)', () => {
    const sp = new URLSearchParams(
      'q=agua&category=10&unidades=compania&areas=caracter&tag=nudos&meta_key=duracion&meta_value=30&obj_ed=objetivo',
    );
    expect(parseBlogFilters(sp)).toEqual({
      q: 'agua',
      category: '10',
      unidades: 'compania',
      areas: 'caracter',
      tag: 'nudos',
      metaKey: 'duracion',
      metaValue: '30',
      objEd: 'objetivo',
    });
  });

  it('lee los 7 filtros desde searchParams del servidor (Promise resuelta)', () => {
    const sp = { unidades: ['compania'], q: 'fuego' };
    expect(parseBlogFilters(sp).unidades).toBe('compania');
    expect(parseBlogFilters(sp).q).toBe('fuego');
    expect(parseBlogFilters(sp).category).toBe('todas');
  });

  it('el orden de los parámetros en la URL no cambia el resultado', () => {
    const a = parseBlogFilters(new URLSearchParams('q=fuego&unidades=tropa'));
    const b = parseBlogFilters(new URLSearchParams('unidades=tropa&q=fuego'));
    expect(a).toEqual(b);
  });
});

describe('hasAnyFilter / resolveBlogCanonical', () => {
  it('/blog sin filtros es indexable y se canonicaliza a sí mismo', () => {
    const filters = parseBlogFilters(new URLSearchParams());
    expect(hasAnyFilter(filters)).toBe(false);
    expect(resolveBlogCanonical(filters)).toEqual({ canonical: '/blog', index: true });
  });

  it('category=todas explícito no cuenta como filtro', () => {
    const filters = parseBlogFilters(new URLSearchParams('category=todas'));
    expect(hasAnyFilter(filters)).toBe(false);
    expect(resolveBlogCanonical(filters).index).toBe(true);
  });

  it.each([
    ['q', 'q=agua'],
    ['category', 'category=10'],
    ['unidades', 'unidades=compania'],
    ['areas', 'areas=caracter'],
    ['tag', 'tag=nudos'],
    ['meta', 'meta_key=duracion&meta_value=30'],
    ['obj_ed', 'obj_ed=objetivo'],
  ])('la ruta filtrada (%s) canonicaliza a /blog y sale del índice', (_name, query) => {
    const filters = parseBlogFilters(new URLSearchParams(query));
    expect(hasAnyFilter(filters)).toBe(true);
    expect(resolveBlogCanonical(filters)).toEqual({ canonical: '/blog', index: false });
  });
});

describe('blogFiltersKey', () => {
  it('es estable ante el orden de los parámetros', () => {
    const a = blogFiltersKey(parseBlogFilters(new URLSearchParams('q=fuego&unidades=tropa')));
    const b = blogFiltersKey(parseBlogFilters(new URLSearchParams('unidades=tropa&q=fuego')));
    expect(a).toBe(b);
  });

  it('cambia cuando cambia cualquier filtro', () => {
    const base = blogFiltersKey(parseBlogFilters(new URLSearchParams()));
    const changed = blogFiltersKey(parseBlogFilters(new URLSearchParams('areas=caracter')));
    expect(changed).not.toBe(base);
  });
});

describe('articlePath', () => {
  it('une la cadena de categorías con el slug del artículo', () => {
    expect(articlePath(makeRow(), byId)).toBe('actividades/dinamicas/creacion-de-objetos-utiles');
  });

  it('usa la categoría más profunda entre las vinculadas', () => {
    const row = makeRow({
      articulo_categorias: [
        { categoria_id: 1, categorias: CATEGORIAS[0] },
        { categoria_id: 10, categorias: CATEGORIAS[2] },
      ],
    });
    expect(articlePath(row, byId)).toBe('actividades/dinamicas/creacion-de-objetos-utiles');
  });

  it('resuelve ancestros sin artículos publicados (tabla completa, no el subconjunto del listado)', () => {
    const row = makeRow({
      articulo_categorias: [{ categoria_id: 13, categorias: CATEGORIAS[3] }],
    });
    expect(articlePath(row, byId)).toBe('administrativo/informacion/creacion-de-objetos-utiles');
  });

  it('cae a general/ cuando el artículo no tiene categorías', () => {
    expect(articlePath(makeRow({ articulo_categorias: [] }), byId)).toBe('general/creacion-de-objetos-utiles');
    expect(articlePath(makeRow({ articulo_categorias: null }), byId)).toBe('general/creacion-de-objetos-utiles');
  });

  it('cae a general/ cuando la categoría no está en la tabla', () => {
    const row = makeRow({
      articulo_categorias: [{ categoria_id: 999, categorias: { id: 999, nombre: 'Perdida', slug: 'perdida', parent_id: null } }],
    });
    expect(articlePath(row, byId)).toBe('general/creacion-de-objetos-utiles');
  });
});

describe('attachArticlePaths', () => {
  it('agrega path a cada fila sin tocar el resto de los campos', () => {
    const rows = [makeRow(), makeRow({ id: 'a2', slug: 'otro-articulo' })];
    const decorated = attachArticlePaths(rows, byId);

    expect(decorated.map((r) => r.path)).toEqual([
      'actividades/dinamicas/creacion-de-objetos-utiles',
      'actividades/dinamicas/otro-articulo',
    ]);
    expect(decorated[0].titulo).toBe(rows[0].titulo);
    expect(decorated[0].id).toBe('a1');
  });
});
