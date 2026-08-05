import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks — @supabase/supabase-js chainable client for the get-menu-items action
// ---------------------------------------------------------------------------

const supabaseMocks = vi.hoisted(() => {
  const createClient = vi.fn();
  let rows: Array<Record<string, unknown>> = [];
  let fetchError: Error | null = null;
  let user: { id: string } | null = null;
  let getUserError: { message: string } | null = null;
  let perfilRolId: number | null = null;
  let perfilError: Error | null = null;

  const chain = {
    select: vi.fn(function (this: unknown) {
      return this;
    }),
    eq: vi.fn(function (this: unknown) {
      return this;
    }),
    single: vi.fn(async () => ({
      data: perfilError ? null : { rol_id: perfilRolId },
      error: perfilError,
    })),
    order: vi.fn(async () => ({ data: rows, error: fetchError })),
  };

  const client = {
    auth: {
      getUser: vi.fn(async () => {
        if (getUserError || !user) return { data: { user: null }, error: getUserError };
        return { data: { user }, error: null };
      }),
    },
    from: vi.fn(() => chain),
  };

  createClient.mockReturnValue(client);

  return {
    createClient,
    client,
    setRows: (next: unknown[]) => {
      rows = next as Array<Record<string, unknown>>;
    },
    setError: (next: Error | null) => {
      fetchError = next;
    },
    setUser: (next: { id: string } | null, error: Error | null = null) => {
      user = next;
      getUserError = error;
    },
    setPerfilRolId: (next: number | null, error: Error | null = null) => {
      perfilRolId = next;
      perfilError = error;
    },
  };
});

vi.mock('@supabase/supabase-js', () => ({
  createClient: supabaseMocks.createClient,
}));

// ---------------------------------------------------------------------------
// Imports — under test (production code does NOT exist yet for the RED run)
// ---------------------------------------------------------------------------

import { canSeeItem, ROL_ID_TO_KEY } from '@/lib/menu-permissions';
import { HARDCODED_MENU_TREE } from '@/lib/menu-fallback';
import { buildTree } from '@/lib/menu-items';
import { getMenuItems } from '@/app/(admin)/actions/get-menu-items';
import type { MenuItem } from '@/lib/menu-items.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function menuRow(
  id: string,
  titulo: string,
  href: string | null,
  icono: string | null,
  orden: number,
  roles_permitidos: string[] = [],
  parent_id: string | null = null,
): MenuItem {
  return {
    id,
    parent_id,
    titulo,
    href,
    icono,
    orden,
    visible: true,
    roles_permitidos,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  };
}

// ---------------------------------------------------------------------------
// canSeeItem — role visibility matrix (spec: menu-public-wiring)
// ---------------------------------------------------------------------------

describe('canSeeItem', () => {
  it('treats empty roles_permitidos as public: true for any user, including anonymous', () => {
    expect(canSeeItem([], null)).toBe(true);
    expect(canSeeItem([], 1)).toBe(true);
    expect(canSeeItem([], 14)).toBe(true);
  });

  it('grants anonymous users (null rolId) access only to public items', () => {
    expect(canSeeItem(['public'], null)).toBe(true);
    expect(canSeeItem(['admin'], null)).toBe(false);
    expect(canSeeItem(['authenticated'], null)).toBe(false);
    expect(canSeeItem(['nnj1'], null)).toBe(false);
  });

  it("treats the explicit 'public' role as visible to logged-in users too", () => {
    expect(canSeeItem(['public'], 1)).toBe(true);
    expect(canSeeItem(['public'], 9)).toBe(true);
    expect(canSeeItem(['public'], 14)).toBe(true);
  });

  it("grants 'authenticated' items to any logged-in user, regardless of rol", () => {
    expect(canSeeItem(['authenticated'], 1)).toBe(true);
    expect(canSeeItem(['authenticated'], 8)).toBe(true);
    expect(canSeeItem(['authenticated'], 14)).toBe(true);
  });

  it('matches a specific rol key only for that rol', () => {
    expect(canSeeItem(['admin'], 1)).toBe(true);
    expect(canSeeItem(['admin'], 2)).toBe(false);
    expect(canSeeItem(['nnj1'], 9)).toBe(true);
    expect(canSeeItem(['nnj1'], 10)).toBe(false);
    expect(canSeeItem(['apoderado'], 8)).toBe(true);
    expect(canSeeItem(['apoderado'], 1)).toBe(false);
  });

  it('grants access when any of several keys matches the user rol', () => {
    expect(canSeeItem(['dirigente', 'nnj3'], 2)).toBe(true);
    expect(canSeeItem(['guiadora', 'nnj3'], 3)).toBe(true);
    expect(canSeeItem(['dirigente', 'nnj3'], 11)).toBe(true);
    expect(canSeeItem(['dirigente', 'nnj3'], 8)).toBe(false);
    expect(canSeeItem(['dirigente', 'nnj3'], null)).toBe(false);
  });

  it('maps the shared directiva key to every Directiva de Padres rol (4-7) and no other', () => {
    expect(ROL_ID_TO_KEY[4]).toBe('directiva');
    expect(ROL_ID_TO_KEY[5]).toBe('directiva');
    expect(ROL_ID_TO_KEY[6]).toBe('directiva');
    expect(ROL_ID_TO_KEY[7]).toBe('directiva');
    expect(canSeeItem(['directiva'], 4)).toBe(true);
    expect(canSeeItem(['directiva'], 5)).toBe(true);
    expect(canSeeItem(['directiva'], 6)).toBe(true);
    expect(canSeeItem(['directiva'], 7)).toBe(true);
    expect(canSeeItem(['directiva'], 8)).toBe(false);
    expect(canSeeItem(['directiva'], null)).toBe(false);
  });

  it('maps every rol key used by MENU_ROLE_OPTIONS to its rol id', () => {
    expect(ROL_ID_TO_KEY[1]).toBe('admin');
    expect(ROL_ID_TO_KEY[2]).toBe('dirigente');
    expect(ROL_ID_TO_KEY[3]).toBe('guiadora');
    expect(ROL_ID_TO_KEY[8]).toBe('apoderado');
    expect(ROL_ID_TO_KEY[9]).toBe('nnj1');
    expect(ROL_ID_TO_KEY[10]).toBe('nnj2');
    expect(ROL_ID_TO_KEY[11]).toBe('nnj3');
    expect(ROL_ID_TO_KEY[12]).toBe('nnj4');
    expect(ROL_ID_TO_KEY[13]).toBe('nnj5');
  });

  it('maps no key for Restringido (rol 14): restricted users only see public/authenticated items', () => {
    expect(ROL_ID_TO_KEY[14]).toBeUndefined();
    expect(canSeeItem(['admin'], 14)).toBe(false);
    expect(canSeeItem(['authenticated'], 14)).toBe(true);
    expect(canSeeItem([], 14)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// HARDCODED_MENU_TREE — mirrors today's sidebar (src/components/ui/menu.tsx)
// ---------------------------------------------------------------------------

describe('HARDCODED_MENU_TREE', () => {
  it('lists the 5 main-view items in today\'s sidebar order', () => {
    expect(HARDCODED_MENU_TREE.map((n) => n.titulo)).toEqual([
      'Inicio',
      'Acerca de',
      'Lo que hacemos',
      'Blog',
      'Nuestras Unidades',
    ]);
  });

  it('keeps today\'s hrefs and icono names on the main items', () => {
    expect(HARDCODED_MENU_TREE[0]).toMatchObject({ titulo: 'Inicio', href: '/', icono: 'IconoInicio' });
    expect(HARDCODED_MENU_TREE[1]).toMatchObject({ titulo: 'Acerca de', href: null, icono: 'IconoAcercaDe' });
    expect(HARDCODED_MENU_TREE[2]).toMatchObject({ titulo: 'Lo que hacemos', href: null, icono: 'IconoLoQueHacemos' });
    expect(HARDCODED_MENU_TREE[3]).toMatchObject({ titulo: 'Blog', href: '/blog', icono: 'IconoBlog' });
    expect(HARDCODED_MENU_TREE[4]).toMatchObject({ titulo: 'Nuestras Unidades', href: null, icono: 'IconoUnidades' });
  });

  it('mirrors the Acerca de submenu with its 6 children', () => {
    expect(HARDCODED_MENU_TREE[1].children.map((c) => c.titulo)).toEqual([
      'Quiénes Somos',
      'Nuestra Historia',
      'Misión y Visión',
      'Nuestro Equipo',
      'Nuestros Apoderados',
      'Institución Patrocinante',
    ]);
    expect(HARDCODED_MENU_TREE[1].children[0]).toMatchObject({
      href: '/acerca-de/quienes-somos',
      icono: 'IconoAcercaDeQuienesSomos',
    });
    expect(HARDCODED_MENU_TREE[1].children[5]).toMatchObject({
      href: '/acerca-de/institucion-patrocinante',
      icono: 'IconoAcercaDeInstitucionPatrocinante',
    });
  });

  it('mirrors the Lo que hacemos submenu with its 8 children', () => {
    expect(HARDCODED_MENU_TREE[2].children.map((c) => c.titulo)).toEqual([
      'Ley y Promesa',
      'El Método Scout',
      'Aprender Haciendo',
      'Sistema de Equipos',
      'Vida al Aire Libre',
      'Habilidades y Técnicas',
      'Vida Reflexiva',
      'Programa y Actividades',
    ]);
    expect(HARDCODED_MENU_TREE[2].children[0]).toMatchObject({
      href: '/lo-que-hacemos/ley-y-promesa',
      icono: 'IconoLoQueHacemos',
    });
    expect(HARDCODED_MENU_TREE[2].children[7]).toMatchObject({
      href: '/lo-que-hacemos/programa-y-actividades',
      icono: 'IconoLoQueHacemosProgramasActividades',
    });
  });

  it('mirrors the Nuestras Unidades submenu with image paths as icono', () => {
    expect(HARDCODED_MENU_TREE[4].children.map((c) => c.titulo)).toEqual([
      'Manada (Ahi Niho Vænga)',
      'Compañía (Põ Vui Vaikava)',
      "Tropa (A'ata)",
      'Avanzada (Rapahango)',
      'Clan (Ahu Akivi)',
    ]);
    expect(HARDCODED_MENU_TREE[4].children[0]).toMatchObject({
      href: '/unidad/manada',
      icono: '/images/logos/iconos_lobatos.svg',
    });
    expect(HARDCODED_MENU_TREE[4].children[4]).toMatchObject({
      href: '/unidad/clan',
      icono: '/images/logos/iconos_caminantes.svg',
    });
  });

  it('forms a valid tree: roots have parent_id null, children reference their parent id', () => {
    expect(HARDCODED_MENU_TREE.every((n) => n.parent_id === null)).toBe(true);
    const childCount = HARDCODED_MENU_TREE.reduce((acc, n) => acc + n.children.length, 0);
    expect(childCount).toBe(6 + 8 + 5); // 19 children across the 3 submenus
    for (const root of HARDCODED_MENU_TREE) {
      for (const child of root.children) {
        expect(child.parent_id).toBe(root.id);
        expect(child.children).toEqual([]);
        expect(child.visible).toBe(true);
        expect(child.roles_permitidos).toEqual([]);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// buildTree — exported flat-array → tree builder (src/lib/menu-items.ts)
// ---------------------------------------------------------------------------

describe('buildTree', () => {
  it('nests children under their parent and keeps input order for roots', () => {
    const tree = buildTree([
      menuRow('p1', 'Padre 1', null, null, 1),
      menuRow('p2', 'Padre 2', null, null, 2),
      menuRow('c1', 'Hijo 1', '/hijo-1', null, 1, [], 'p1'),
      menuRow('c2', 'Hijo 2', '/hijo-2', null, 2, [], 'p1'),
    ]);
    expect(tree.map((n) => n.titulo)).toEqual(['Padre 1', 'Padre 2']);
    expect(tree[0].children.map((n) => n.titulo)).toEqual(['Hijo 1', 'Hijo 2']);
    expect(tree[1].children).toEqual([]);
  });

  it('promotes items with a missing parent to roots (orphan-safe)', () => {
    const tree = buildTree([menuRow('o1', 'Huérfano', '/hu', null, 1, [], 'no-such-parent')]);
    expect(tree.map((n) => n.titulo)).toEqual(['Huérfano']);
    expect(tree[0].parent_id).toBe('no-such-parent');
  });
});

// ---------------------------------------------------------------------------
// getMenuItems action — role-filtered DB tree (PR4a, consumed by PR4b)
// ---------------------------------------------------------------------------

describe('getMenuItems action', () => {
  beforeEach(() => {
    supabaseMocks.setRows([]);
    supabaseMocks.setError(null);
    supabaseMocks.setUser(null);
    supabaseMocks.setPerfilRolId(null);
    vi.clearAllMocks();
  });

  it('derives the rol from the token and returns only matching items (role-gated item for its rol only)', async () => {
    supabaseMocks.setRows([
      menuRow('r1', 'Inicio', '/', 'IconoInicio', 1),
      menuRow('r2', 'Panel Admin', '/panel', null, 2, ['admin']),
    ]);
    supabaseMocks.setUser({ id: 'u-admin' });
    supabaseMocks.setPerfilRolId(1);
    expect((await getMenuItems('token-admin')).items.map((n) => n.titulo)).toEqual(['Inicio', 'Panel Admin']);

    supabaseMocks.setPerfilRolId(9);
    expect((await getMenuItems('token-nnj')).items.map((n) => n.titulo)).toEqual(['Inicio']);
  });

  it('treats empty roles_permitidos as public for any user, including anonymous', async () => {
    supabaseMocks.setRows([menuRow('r1', 'Inicio', '/', null, 1)]);
    expect((await getMenuItems(null)).items.map((n) => n.titulo)).toEqual(['Inicio']);

    supabaseMocks.setUser({ id: 'u-14' });
    supabaseMocks.setPerfilRolId(14);
    expect((await getMenuItems('token-14')).items.map((n) => n.titulo)).toEqual(['Inicio']);
  });

  it('verifies the token server-side: auth.getUser is called with the access token', async () => {
    supabaseMocks.setRows([menuRow('r1', 'Inicio', '/', null, 1)]);
    supabaseMocks.setUser({ id: 'u-1' });
    supabaseMocks.setPerfilRolId(9);

    await getMenuItems('token-abc');

    expect(supabaseMocks.client.auth.getUser).toHaveBeenCalledWith('token-abc');
  });

  it('degrades to public when the token is rejected/invalid (getUser fails)', async () => {
    supabaseMocks.setRows([
      menuRow('r1', 'Solo admin', '/admin-only', null, 1, ['admin']),
      menuRow('r2', 'Publico', '/', null, 2),
    ]);
    supabaseMocks.setUser(null, new Error('JWT expired'));

    const result = await getMenuItems('token-stale');

    expect(result.items.map((n) => n.titulo)).toEqual(['Publico']);
    expect(supabaseMocks.client.auth.getUser).toHaveBeenCalledWith('token-stale');
  });

  it('degrades to public when the verified user has no perfiles rol_id', async () => {
    supabaseMocks.setRows([
      menuRow('r1', 'Solo admin', '/admin-only', null, 1, ['admin']),
      menuRow('r2', 'Publico', '/', null, 2),
    ]);
    supabaseMocks.setUser({ id: 'u-no-perfil' });
    supabaseMocks.setPerfilRolId(null, new Error('not found'));

    const result = await getMenuItems('token-ok');
    expect(result.items.map((n) => n.titulo)).toEqual(['Publico']);
  });

  it('filters every non-public item out for anonymous users and reports dbEmpty=false (rows exist, none visible)', async () => {
    supabaseMocks.setRows([
      menuRow('r1', 'Solo autenticados', '/privado', null, 1, ['authenticated']),
      menuRow('r2', 'Solo admin', '/admin-only', null, 2, ['admin']),
    ]);
    expect(await getMenuItems(null)).toEqual({ items: [], dbEmpty: false });
  });

  it('builds a nested tree and filters children by the rol derived from the token', async () => {
    supabaseMocks.setRows([
      menuRow('p1', 'Acerca de', null, 'IconoAcercaDe', 1),
      menuRow('c1', 'Quiénes Somos', '/acerca-de/quienes-somos', null, 1, [], 'p1'),
      menuRow('c2', 'Solo admin', '/acerca-de/admin', null, 2, ['admin'], 'p1'),
    ]);
    supabaseMocks.setUser({ id: 'u-admin' });
    supabaseMocks.setPerfilRolId(1);
    const tree = await getMenuItems('token-admin');
    expect(tree.items.map((n) => n.titulo)).toEqual(['Acerca de']);
    expect(tree.items[0].children.map((n) => n.titulo)).toEqual(['Quiénes Somos', 'Solo admin']);

    supabaseMocks.setPerfilRolId(9);
    const nnjTree = await getMenuItems('token-nnj');
    expect(nnjTree.items.map((n) => n.titulo)).toEqual(['Acerca de']);
    expect(nnjTree.items[0].children.map((n) => n.titulo)).toEqual(['Quiénes Somos']);
  });

  it('reports dbEmpty=true on an empty menu_items table', async () => {
    supabaseMocks.setRows([]);
    expect(await getMenuItems(null)).toEqual({ items: [], dbEmpty: true });
  });

  it('reports dbEmpty=true when the fetch fails', async () => {
    supabaseMocks.setError(new Error('connection reset'));
    expect(await getMenuItems(null)).toEqual({ items: [], dbEmpty: true });
  });
});
