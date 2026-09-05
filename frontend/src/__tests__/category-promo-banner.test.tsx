import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

// ---------------------------------------------------------------------------
// Approval test — captures the CURRENT CategoryPromoBanner behavior before
// the inline-styles → Tailwind-classes refactor. Behavioral assertions only
// (content, counts, links, icons) — never class/style details, which are
// implementation internals. Must pass BEFORE and AFTER the refactor.
// ---------------------------------------------------------------------------

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children?: React.ReactNode }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

const supabaseMock = vi.hoisted(() => {
  const defaultImplementation = (table: string) => {
    if (table === 'categorias') {
      return {
        select: vi.fn(async () => ({
          data: [
            { id: 1, nombre: 'Actividades', slug: 'actividades', parent_id: null },
            { id: 2, nombre: 'Técnicas', slug: 'tecnicas', parent_id: null },
            { id: 3, nombre: 'Historia', slug: 'historia', parent_id: null },
            { id: 10, nombre: 'Juegos de Noche', slug: 'juegos-de-noche', parent_id: 1 },
          ],
          error: null,
        })),
      };
    }
    return {
      select: vi.fn(() => ({
        eq: vi.fn(async () => ({
          data: [
            { categoria_id: 10, articulos: { id: 'a1', estado: 'publicado' } },
            { categoria_id: 2, articulos: { id: 'a2', estado: 'publicado' } },
            { categoria_id: 3, articulos: { id: 'a3', estado: 'publicado' } },
            { categoria_id: 3, articulos: { id: 'a4', estado: 'publicado' } },
          ],
          error: null,
        })),
      })),
    };
  };

  const from = vi.fn(defaultImplementation);
  return { supabase: { from } };
});

vi.mock('@/lib/supabase', () => ({ supabase: supabaseMock.supabase }));

import CategoryPromoBanner from '@/components/CategoryPromoBanner';

afterEach(() => {
  supabaseMock.supabase.from.mockReset();
});

describe('CategoryPromoBanner (approval — behavior preserved across Tailwind refactor)', () => {
  it('renders the total counter, category cards, badges, counts and links after the fetch', async () => {
    const { container } = render(<CategoryPromoBanner />);

    // Header counter: 4 unique published articles across all allowed parents
    expect(await screen.findByText('4+')).toBeInTheDocument();
    expect(screen.getByText(/TENEMOS MÁS DE/)).toBeInTheDocument();
    expect(screen.getByText(/RECURSOS!/)).toBeInTheDocument();

    // Section wrapper: the banner is self-contained (own section + max-width container)
    // Assert after the async fetch resolves — the section only exists when content is shown.
    expect(container.querySelector('section')).not.toBeNull();

    // Three allowed parent categories render (sorted by count desc: historia 2, then 1 each)
    expect(screen.getByText('Historia')).toBeInTheDocument();
    expect(screen.getByText('Actividades')).toBeInTheDocument();
    expect(screen.getByText('Técnicas')).toBeInTheDocument();

    // Counts
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.getAllByText('+1')).toHaveLength(2);

    // Badge texts
    expect(screen.getByText('Tradición e Historia')).toBeInTheDocument();
    expect(screen.getByText('Juegos y Dinámicas')).toBeInTheDocument();
    expect(screen.getByText('Habilidades Scouts')).toBeInTheDocument();

    // Icons
    expect(screen.getByText('📜')).toBeInTheDocument();
    expect(screen.getByText('🎲')).toBeInTheDocument();
    expect(screen.getByText('⚜️')).toBeInTheDocument();

    // Footer links
    expect(screen.getByText('Explorar Historia (2)')).toBeInTheDocument();
    expect(screen.getByText('Explorar Actividades (1)')).toBeInTheDocument();
    expect(screen.getByText('Explorar Técnicas (1)')).toBeInTheDocument();

    // Link hrefs
    expect(container.querySelector('a[href="/blog/historia"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/blog/actividades"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/blog/tecnicas"]')).toBeInTheDocument();
  });

  it('renders nothing when there are no categories at all', async () => {
    supabaseMock.supabase.from.mockImplementation(() => ({
      select: vi.fn(async () => ({ data: [], error: null })),
    }));

    const { container } = render(<CategoryPromoBanner />);

    await waitFor(() => {
      expect(container.firstElementChild).toBeNull();
    });
  });
});
