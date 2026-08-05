import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { HARDCODED_MENU_TREE } from '@/lib/menu-fallback';
import type { MenuItemNode } from '@/lib/menu-items.types';

// ---------------------------------------------------------------------------
// Mocks — next/navigation + next/link (renders as plain <a>), chainable supabase
// (getSession only), and the get-menu-items server action. ui/menu.tsx (PR4b)
// resolves the session and calls getMenuItems(access_token); the action derives
// the rol server-side, so the client never queries perfiles nor sends a role.
// ---------------------------------------------------------------------------

const routerMocks = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerMocks.push, prefetch: vi.fn(), replace: vi.fn() }),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children?: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const supabaseMocks = vi.hoisted(() => {
  const getSession = vi.fn(
    async (): Promise<{ data: { session: unknown }; error: null }> => ({
      data: { session: null },
      error: null,
    }),
  );
  const supabase = { auth: { getSession }, from: vi.fn() };
  return {
    supabase,
    getSession,
    setSession: (session: unknown) => {
      getSession.mockResolvedValue({ data: { session }, error: null });
    },
  };
});
vi.mock('@/lib/supabase', () => ({ supabase: supabaseMocks.supabase }));

const getMenuItemsMock = vi.hoisted(() =>
  vi.fn(
    async (): Promise<{ items: MenuItemNode[]; dbEmpty: boolean }> => ({ items: [], dbEmpty: true }),
  ),
);
vi.mock('@/app/(admin)/actions/get-menu-items', () => ({
  getMenuItems: getMenuItemsMock,
}));

// jsdom lacks matchMedia — ui/menu calls it on mount (iOS install helper).
beforeAll(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
});

afterAll(() => {
  vi.unstubAllGlobals();
});

// ---------------------------------------------------------------------------
// Imports — component under test. RED: ICON_MAP/SPECIAL_ICONS do not exist yet
// on the current hardcoded ui/menu.tsx, so this import fails until PR4b lands.
// ---------------------------------------------------------------------------

import SidebarDrawer, { ICON_MAP, SPECIAL_ICONS } from '@/components/ui/menu';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function node(
  id: string,
  titulo: string,
  href: string | null,
  icono: string | null,
  orden: number,
  children: MenuItemNode[] = [],
): MenuItemNode {
  return {
    id,
    parent_id: null,
    titulo,
    href,
    icono,
    orden,
    visible: true,
    roles_permitidos: [],
    children,
  };
}

function renderDrawer() {
  const onClose = vi.fn();
  render(<SidebarDrawer isOpen onClose={onClose} />);
  return onClose;
}

// ---------------------------------------------------------------------------
// Spec: menu-public-wiring — role-filtered DB menu (src/components/ui/menu.tsx)
// ---------------------------------------------------------------------------

describe('SidebarDrawer — DB menu consumption', () => {
  it('resolves an anonymous visitor to token null and renders the public DB tree', async () => {
    getMenuItemsMock.mockResolvedValue({
      items: [
        node('n1', 'Portada', '/', 'IconoInicio', 1),
        node('n2', 'Noticias', '/noticias', 'IconoBlog', 2),
      ],
      dbEmpty: false,
    });
    const onClose = renderDrawer();

    await waitFor(() => expect(getMenuItemsMock).toHaveBeenCalledWith(null));
    expect(await screen.findByText('Noticias')).toBeInTheDocument();
    expect(supabaseMocks.supabase.from).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('passes the session access_token (NOT a role) to the action and renders the gated tree', async () => {
    supabaseMocks.setSession({ user: { id: 'u-1' }, access_token: 'token-xyz' });
    getMenuItemsMock.mockResolvedValue({
      items: [node('n1', 'Panel Admin', '/panel', 'IconoInicio', 1)],
      dbEmpty: false,
    });
    renderDrawer();

    await waitFor(() => expect(getMenuItemsMock).toHaveBeenCalledWith('token-xyz'));
    // The client no longer queries perfiles — the action derives the rol server-side.
    expect(supabaseMocks.supabase.from).not.toHaveBeenCalled();
    expect(await screen.findByText('Panel Admin')).toBeInTheDocument();
  });
});

describe('SidebarDrawer — icono resolution', () => {
  it('renders icon-name iconos through ICON_MAP as an svg, not an img', async () => {
    getMenuItemsMock.mockResolvedValue({
      items: [node('n1', 'Portada', '/', 'IconoInicio', 1)],
      dbEmpty: false,
    });
    renderDrawer();

    const item = (await screen.findByText('Portada')).closest('button') as HTMLElement;
    expect(item.querySelector('[data-icon-name="IconoInicio"]')).toBeInTheDocument();
    expect(item.querySelector('img')).not.toBeInTheDocument();
  });

  it('renders the special IconoBlog value through SPECIAL_ICONS', async () => {
    getMenuItemsMock.mockResolvedValue({
      items: [node('n1', 'Noticias', '/blog', 'IconoBlog', 1)],
      dbEmpty: false,
    });
    renderDrawer();

    const item = (await screen.findByText('Noticias')).closest('button') as HTMLElement;
    expect(item.querySelector('[data-icon-name="IconoBlog"]')).toBeInTheDocument();
    expect(item.querySelector('img')).not.toBeInTheDocument();
  });

  it('renders a "/"-prefixed icono as an <img> with that src and empty alt', async () => {
    getMenuItemsMock.mockResolvedValue({
      items: [node('n1', 'Manada Ahi Niho', '/unidad/manada', '/images/logos/iconos_lobatos.svg', 1)],
      dbEmpty: false,
    });
    renderDrawer();

    const item = (await screen.findByText('Manada Ahi Niho')).closest('button') as HTMLElement;
    const img = item.querySelector('img');
    expect(img).toHaveAttribute('src', '/images/logos/iconos_lobatos.svg');
    expect(img).toHaveAttribute('alt', '');
  });
});

describe('SidebarDrawer — hardcoded fallback on empty DB', () => {
  it('renders HARDCODED_MENU_TREE when the action reports an empty DB (dbEmpty=true)', async () => {
    getMenuItemsMock.mockResolvedValue({ items: [], dbEmpty: true });
    renderDrawer();

    // The fetch must have run and returned [] with dbEmpty=true — the fallback tree stays rendered.
    await waitFor(() => expect(getMenuItemsMock).toHaveBeenCalled());
    expect(screen.getByRole('button', { name: 'Inicio' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Acerca de' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Lo que hacemos' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Blog' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nuestras Unidades' })).toBeInTheDocument();
  });

  it('renders an EMPTY menu (not the hardcoded fallback) when the DB has rows but none are visible to this user', async () => {
    // DB rows exist but every one is role-gated and the visitor is anonymous →
    // the action returns { items: [], dbEmpty: false }. The drawer must NOT
    // fall back to HARDCODED_MENU_TREE (deterministic role-filter bypass).
    getMenuItemsMock.mockResolvedValue({ items: [], dbEmpty: false });
    renderDrawer();

    await waitFor(() => expect(getMenuItemsMock).toHaveBeenCalledWith(null));
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Inicio' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Acerca de' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Nuestras Unidades' })).not.toBeInTheDocument();
    });
  });

  it('lets the user navigate the fallback sub-views (drawer UX preserved)', async () => {
    getMenuItemsMock.mockResolvedValue({ items: [], dbEmpty: true });
    renderDrawer();

    await waitFor(() => expect(getMenuItemsMock).toHaveBeenCalled());
    await userEvent.click(screen.getByRole('button', { name: 'Acerca de' }));
    expect(await screen.findByText('Quiénes Somos')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /volver al men/i }));
    expect(screen.getByRole('button', { name: 'Inicio' })).toBeInTheDocument();
  });
});

describe('SidebarDrawer — drawer sub-view UX from tree data', () => {
  it('opens a sub-view for roots with children and back returns to main, without pushing a route', async () => {
    routerMocks.push.mockClear();
    getMenuItemsMock.mockResolvedValue({
      items: [
        node('p1', 'Secciones', null, 'IconoAcercaDe', 1, [
          node('c1', 'Sección Uno', '/seccion-uno', 'IconoLoQueHacemos', 1),
        ]),
      ],
      dbEmpty: false,
    });
    renderDrawer();

    await userEvent.click(await screen.findByRole('button', { name: 'Secciones' }));
    expect(await screen.findByText('Sección Uno')).toBeInTheDocument();
    expect(routerMocks.push).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: /volver al men/i }));
    expect(screen.getByRole('button', { name: 'Secciones' })).toBeInTheDocument();
  });

  it('navigates leaf roots with an href directly and closes the drawer', async () => {
    routerMocks.push.mockClear();
    getMenuItemsMock.mockResolvedValue({
      items: [node('l1', 'Blog Directo', '/blog', 'IconoBlog', 1)],
      dbEmpty: false,
    });
    const onClose = renderDrawer();

    await userEvent.click(await screen.findByRole('button', { name: 'Blog Directo' }));
    expect(routerMocks.push).toHaveBeenCalledWith('/blog');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('SidebarDrawer — icon resolution coverage invariant', () => {
  it('resolves every non-path icono of HARDCODED_MENU_TREE through ICON_MAP or SPECIAL_ICONS', () => {
    const iconos = HARDCODED_MENU_TREE.flatMap((n) => [
      n.icono,
      ...n.children.map((c) => c.icono),
    ]).filter((i): i is string => i !== null && !i.startsWith('/'));

    expect(iconos.length).toBeGreaterThan(0);
    for (const icono of iconos) {
      expect(ICON_MAP[icono] ?? SPECIAL_ICONS[icono]).toBeDefined();
    }
    // The two special string values must resolve through SPECIAL_ICONS.
    expect(SPECIAL_ICONS.IconoBlog).toBeDefined();
    expect(SPECIAL_ICONS.IconoUnidades).toBeDefined();
  });
});
