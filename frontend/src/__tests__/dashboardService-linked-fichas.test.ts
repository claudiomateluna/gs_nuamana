import { describe, it, expect, vi, beforeEach } from 'vitest'

// Build a chainable mock: fluent methods return chain, terminal async methods also return chain.
// The chain is thenable — `then()` resolves to { data, error }.
function createChainable(resolvedData: any = []) {
  const chain: Record<string, any> = {}
  // Fluent sync methods — return chain for chaining
  const fluentMethods = [
    'select', 'eq', 'in', 'neq', 'gte', 'lte', 'like', 'ilike',
    'contains', 'overlaps', 'filter', 'order', 'not', 'or'
  ]
  for (const m of fluentMethods) {
    chain[m] = vi.fn(() => chain)
  }
  // Terminal async methods — also return chain (so `.insert().select()` etc. works)
  // The final resolution comes from `then()` when the chain is awaited.
  for (const m of ['insert', 'update', 'delete', 'upsert', 'single', 'maybeSingle']) {
    chain[m] = vi.fn(() => chain)
  }
  // `then` makes the chain await-able
  chain.then = vi.fn((resolve: any, reject: any) =>
    Promise.resolve({ data: resolvedData, error: null }).then(resolve, reject)
  )
  return chain
}

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => createChainable()),
  },
}))

import { supabase } from '@/lib/supabase'
import { fetchLinkedFichas, linkFichasToAcuerdo } from '@/services/dashboardService'

describe('fetchLinkedFichas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns articulo list for an acuerdo', async () => {
    const mockData = [
      { articulo: { id: 'art-1', titulo: 'Caminata', slug: 'caminata' } },
      { articulo: { id: 'art-2', titulo: 'Nudo', slug: 'nudo' } },
    ]
    vi.mocked(supabase.from).mockReturnValue(createChainable(mockData) as any)

    const result = await fetchLinkedFichas('acuerdo-1')

    expect(supabase.from).toHaveBeenCalledWith('acta_acuerdo_fichas')
    expect(result).toHaveLength(2)
    expect(result[0].titulo).toBe('Caminata')
    expect(result[1].slug).toBe('nudo')
  })

  it('returns empty array when no fichas linked', async () => {
    vi.mocked(supabase.from).mockReturnValue(createChainable([]) as any)

    const result = await fetchLinkedFichas('acuerdo-empty')
    expect(result).toEqual([])
  })

  it('filters out null articulos gracefully', async () => {
    const mockData = [
      { articulo: { id: 'art-1', titulo: 'OK', slug: 'ok' } },
      { articulo: null },
    ]
    vi.mocked(supabase.from).mockReturnValue(createChainable(mockData) as any)

    const result = await fetchLinkedFichas('acuerdo-mixed')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('art-1')
  })
})

describe('linkFichasToAcuerdo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deletes old links and inserts new ones', async () => {
    vi.mocked(supabase.from).mockReturnValue(createChainable() as any)

    await linkFichasToAcuerdo('acuerdo-1', ['art-1', 'art-2'])

    // Two calls: delete then insert
    expect(supabase.from).toHaveBeenCalledTimes(2)
    expect(supabase.from).toHaveBeenCalledWith('acta_acuerdo_fichas')
  })

  it('with empty array only deletes (no insert)', async () => {
    vi.mocked(supabase.from).mockReturnValue(createChainable() as any)

    await linkFichasToAcuerdo('acuerdo-2', [])

    // Only one call: delete
    expect(supabase.from).toHaveBeenCalledTimes(1)
  })
})
