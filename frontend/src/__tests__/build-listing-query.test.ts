import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  buildListingQuery,
  parseBlogFilters,
  BLOG_LISTING_SELECT,
  POSTS_PER_PAGE,
  type BlogFilters,
} from '@/lib/blog-listing';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Superficie más riesgosa del listado: la query armada por buildListingQuery.
 * Un fake client que solo registra llamadas — sin red, sin PostgREST — para
 * pinnear el contrato: estado, paginación, select y los filtros opcionales.
 */

interface RecordedCall {
  method: string;
  args: unknown[];
}

function createFakeClient() {
  const calls: RecordedCall[] = [];
  const chain: Record<string, (...args: unknown[]) => unknown> = {};
  const chainable = [
    'from',
    'select',
    'eq',
    'order',
    'range',
    'ilike',
    'contains',
    'or',
    'abortSignal',
  ];
  for (const method of chainable) {
    chain[method] = (...args: unknown[]) => {
      calls.push({ method, args });
      return chain;
    };
  }
  const client = { from: chain.from } as unknown as SupabaseClient;
  const find = (method: string) => calls.filter((c) => c.method === method);
  const last = (method: string) => find(method).at(-1);
  return { client, calls, find, last };
}

function filtersFrom(query: string): BlogFilters {
  return parseBlogFilters(new URLSearchParams(query));
}

const noFilters = parseBlogFilters(new URLSearchParams());

afterEach(() => {
  vi.restoreAllMocks();
});

describe('buildListingQuery — garantías de base', () => {
  it.each([
    ['sin filtros', noFilters],
    ['búsqueda', filtersFrom('q=agua')],
    ['categoría', filtersFrom('category=10')],
    ['unidad + área', filtersFrom('unidades=compania&areas=caracter')],
    ['tag', filtersFrom('tag=nudos')],
    ['meta', filtersFrom('meta_key=duracion&meta_value=30')],
    ['objetivo educativo', filtersFrom('obj_ed=objetivo')],
  ])('siempre aplica .eq estado=publicado (%s)', (_name, filters) => {
    const { client, find } = createFakeClient();
    buildListingQuery(client, filters, 0);

    const estadoCalls = find('eq').filter((c) => c.args[0] === 'estado');
    expect(estadoCalls).toHaveLength(1);
    expect(estadoCalls[0].args).toEqual(['estado', 'publicado']);
  });

  it('el primer filtro aplicado es estado=publicado (nada lo precede)', () => {
    const { client, find } = createFakeClient();
    buildListingQuery(client, filtersFrom('q=agua&tag=nudos'), 0);

    const firstEq = find('eq')[0];
    expect(firstEq.args).toEqual(['estado', 'publicado']);
  });

  it('ordena por created_at desc y desempata por id asc (orden estable)', () => {
    const { client, find } = createFakeClient();
    buildListingQuery(client, noFilters, 0);

    expect(find('order').map((c) => c.args)).toEqual([
      ['created_at', { ascending: false }],
      ['id', { ascending: true }],
    ]);
  });
});

describe('buildListingQuery — paginación', () => {
  it('usa el tamaño de página compartido (9)', () => {
    expect(POSTS_PER_PAGE).toBe(9);
  });

  it('page 0 → range(0, 8)', () => {
    const { client, last } = createFakeClient();
    buildListingQuery(client, noFilters, 0);
    expect(last('range')?.args).toEqual([0, 8]);
  });

  it('page 2 → range(18, 26)', () => {
    const { client, last } = createFakeClient();
    buildListingQuery(client, noFilters, 2);
    expect(last('range')?.args).toEqual([18, 26]);
  });

  it('el rango es from .. from + POSTS_PER_PAGE - 1 en cualquier página', () => {
    for (const page of [0, 1, 2, 7]) {
      const { client, last } = createFakeClient();
      buildListingQuery(client, noFilters, page);
      const from = page * POSTS_PER_PAGE;
      expect(last('range')?.args).toEqual([from, from + POSTS_PER_PAGE - 1]);
    }
  });
});

describe('buildListingQuery — select por categoría', () => {
  it('category=todas usa el select por defecto (sin !inner)', () => {
    const { client, last } = createFakeClient();
    buildListingQuery(client, noFilters, 0);
    const select = last('select')?.args[0] as string;

    expect(select).toBe(BLOG_LISTING_SELECT);
    expect(select).not.toContain('!inner');
  });

  it('category≠todas usa el select con articulo_categorias!inner', () => {
    const { client, last } = createFakeClient();
    buildListingQuery(client, filtersFrom('category=10'), 0);
    const select = last('select')?.args[0] as string;

    expect(select).toContain('articulo_categorias!inner(');
    expect(select).not.toBe(BLOG_LISTING_SELECT);
  });

  it('category≠todas además filtra por el id de la categoría', () => {
    const { client, find } = createFakeClient();
    buildListingQuery(client, filtersFrom('category=10'), 0);

    expect(find('eq').map((c) => c.args)).toContainEqual(['articulo_categorias.categoria_id', 10]);
  });
});

describe('buildListingQuery — filtros opcionales', () => {
  it('filters.q → ilike sobre titulo con los comodines', () => {
    const { client, find } = createFakeClient();
    buildListingQuery(client, filtersFrom('q=agua'), 0);

    expect(find('ilike').map((c) => c.args)).toContainEqual(['titulo', '%agua%']);
  });

  it('filters.tag → contains sobre etiquetas', () => {
    const { client, find } = createFakeClient();
    buildListingQuery(client, filtersFrom('tag=nudos'), 0);

    expect(find('contains').map((c) => c.args)).toContainEqual(['etiquetas', ['nudos']]);
  });

  it('filters.unidades → contains sobre metadata.unidades', () => {
    const { client, find } = createFakeClient();
    buildListingQuery(client, filtersFrom('unidades=compania'), 0);

    expect(find('contains').map((c) => c.args)).toContainEqual(['metadata', { unidades: ['compania'] }]);
  });

  it('filters.areas → contains sobre metadata.areas', () => {
    const { client, find } = createFakeClient();
    buildListingQuery(client, filtersFrom('areas=caracter'), 0);

    expect(find('contains').map((c) => c.args)).toContainEqual(['metadata', { areas: ['caracter'] }]);
  });

  it('sin meta_key/meta_value no se llama .or()', () => {
    const { client, find } = createFakeClient();
    buildListingQuery(client, filtersFrom('q=agua'), 0);

    expect(find('or')).toHaveLength(0);
  });

  it('meta_key/meta_value → un solo .or() con las dos ramas (string y array)', () => {
    const { client, last } = createFakeClient();
    buildListingQuery(client, filtersFrom('meta_key=duracion&meta_value=30'), 0);
    const orArg = last('or')?.args[0] as string;

    expect(orArg).toBe('metadata->>duracion.eq."30",metadata->duracion.cs.["30"]');
  });
});

describe('buildListingQuery — abortSignal (Fix 3)', () => {
  it('siempre llama .abortSignal() con un AbortSignal real', () => {
    const { client, last } = createFakeClient();
    buildListingQuery(client, noFilters, 0);

    const signal = last('abortSignal')?.args[0];
    expect(signal).toBeInstanceOf(AbortSignal);
  });

  it('el timeout es de 5000 ms', () => {
    const timeoutSpy = vi
      .spyOn(AbortSignal, 'timeout')
      .mockReturnValue(new AbortController().signal);

    const { client, last } = createFakeClient();
    buildListingQuery(client, noFilters, 0);

    expect(timeoutSpy).toHaveBeenCalledWith(5000);
    expect(last('abortSignal')?.args[0]).toBeInstanceOf(AbortSignal);
  });

  it('el signal se aplica a la query terminal, después de los filtros', () => {
    const { client, calls } = createFakeClient();
    buildListingQuery(client, filtersFrom('q=agua&tag=nudos'), 1);

    const abortIndex = calls.findIndex((c) => c.method === 'abortSignal');
    const rangeIndex = calls.findIndex((c) => c.method === 'range');
    expect(abortIndex).toBeGreaterThan(-1);
    expect(rangeIndex).toBeGreaterThan(abortIndex);
    expect(calls.at(-1)?.method).toBe('range');
  });
});

/**
 * HALLAZGO (no fix, fuera de alcance a propósito): metaKey/metaValue entran sin
 * escapar en la expresión de filtro de PostgREST. Un valor con comillas cierra
 * el literal y agrega condiciones al grupo OR. Este test caracteriza el
 * comportamiento actual; corregirlo es unidad separada.
 */
describe('buildListingQuery — hallazgo: or() no escapa comillas', () => {
  it('un meta_value con comillas rompe el literal y agrega condiciones al grupo OR', () => {
    const { client, last } = createFakeClient();
    const filters = filtersFrom('meta_key=duracion&meta_value=30');
    filters.metaValue = '30",metadata->>duracion.eq."99';
    buildListingQuery(client, filters, 0);

    const orArg = last('or')?.args[0] as string;

    expect(orArg).toContain('metadata->>duracion.eq."30",metadata->>duracion.eq."99"');
    expect(orArg.split(',')).toHaveLength(4);
  });

  it('un meta_key con comillas también contamina la expresión', () => {
    const { client, last } = createFakeClient();
    const filters = filtersFrom('meta_key=duracion&meta_value=30');
    filters.metaKey = 'duracion".eq."x';
    buildListingQuery(client, filters, 0);

    const orArg = last('or')?.args[0] as string;

    expect(orArg).toContain('metadata->>duracion".eq."x.eq.');
  });
});
