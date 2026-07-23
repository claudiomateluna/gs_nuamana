import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock dependencies before importing
vi.mock('@/lib/supabase', () => {
  const chain: Record<string, any> = {}
  const syncMethods = ['select', 'eq', 'in', 'neq', 'gte', 'lte', 'like', 'ilike', 'contains', 'overlaps', 'filter', 'order', 'upsert']
  for (const m of syncMethods) {
    chain[m] = vi.fn(() => chain)
  }
  chain.insert = vi.fn(async () => ({ data: null, error: null }))
  chain.update = vi.fn(async () => ({ data: null, error: null }))
  chain.delete = vi.fn(async () => ({ data: null, error: null }))
  chain.upsert = vi.fn(async () => ({ data: null, error: null }))
  chain.single = vi.fn(async () => ({ data: { id: 'acta-1' }, error: null }))

  const fromChain = vi.fn(() => ({ ...chain }))

  return {
    supabase: {
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: { user: { id: 'user-1' } } },
          error: null,
        }),
      },
      from: fromChain,
    },
  }
})

vi.mock('@/lib/db', () => ({
  db: {
    outbox_queue: {
      add: vi.fn().mockResolvedValue(undefined),
      toArray: vi.fn().mockResolvedValue([]),
      orderBy: vi.fn(() => ({ toArray: vi.fn().mockResolvedValue([]) })),
      delete: vi.fn().mockResolvedValue(undefined),
      update: vi.fn().mockResolvedValue(undefined),
      clear: vi.fn().mockResolvedValue(undefined),
    },
  },
}))

import { outboxService } from '@/lib/outbox-service'
import { supabase } from '@/lib/supabase'
import { db } from '@/lib/db'

const mockQueue = vi.mocked(db.outbox_queue)

beforeEach(() => {
  vi.clearAllMocks()
  vi.useFakeTimers()
  Object.defineProperty(window.navigator, 'onLine', { value: true, configurable: true })

  // Default: empty queue
  mockQueue.orderBy.mockReturnValue({
    toArray: vi.fn().mockResolvedValue([]),
  } as any)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('outboxService.enqueue', () => {
  it('adds item to IndexedDB outbox queue', async () => {
    await outboxService.enqueue('bitacoras_unidad', 'INSERT', { id: 'b1', titulo: 'Test' })

    expect(mockQueue.add).toHaveBeenCalledWith({
      tabla: 'bitacoras_unidad',
      accion: 'INSERT',
      payload: { id: 'b1', titulo: 'Test' },
      timestamp: expect.any(Number),
      intentos: 0,
    })
  })

  it('includes a timestamp', async () => {
    vi.setSystemTime(1700000000000)
    await outboxService.enqueue('bitacoras_unidad', 'INSERT', { id: 'b1' })

    expect(mockQueue.add).toHaveBeenCalledWith(
      expect.objectContaining({ timestamp: 1700000000000 })
    )
  })
})

describe('outboxService.processQueue', () => {
  it('returns early if queue is empty', async () => {
    mockQueue.orderBy.mockReturnValue({
      toArray: vi.fn().mockResolvedValue([]),
    } as any)

    await outboxService.processQueue()

    expect(supabase.from).not.toHaveBeenCalled()
  })

  it('processes a successful INSERT and deletes it from queue', async () => {
    const item = {
      id: 1,
      tabla: 'bitacoras_unidad',
      accion: 'INSERT',
      payload: { id: 'b1', titulo: 'Test' },
      timestamp: Date.now(),
      intentos: 0,
    }
    mockQueue.orderBy.mockReturnValue({
      toArray: vi.fn().mockResolvedValue([item]),
    } as any)

    await outboxService.processQueue()

    expect(supabase.from).toHaveBeenCalledWith('bitacoras_unidad')
    expect(mockQueue.delete).toHaveBeenCalledWith(1)
  })

  it('processes a UPSERT on progresion_avance', async () => {
    const item = {
      id: 2,
      tabla: 'progresion_avance',
      accion: 'UPSERT',
      payload: { perfil_id: 'p1', objetivo_id: 'o1' },
      timestamp: Date.now(),
      intentos: 0,
    }
    mockQueue.orderBy.mockReturnValue({
      toArray: vi.fn().mockResolvedValue([item]),
    } as any)

    await outboxService.processQueue()

    expect(supabase.from).toHaveBeenCalledWith('progresion_avance')
    expect(mockQueue.delete).toHaveBeenCalledWith(2)
  })

  it('stops processing on network error', async () => {
    const chain: Record<string, any> = {}
    const syncMethods = ['select', 'eq', 'update', 'delete', 'order']
    for (const m of syncMethods) chain[m] = vi.fn(() => chain)
    chain.insert = vi.fn().mockResolvedValue({ error: { message: 'Failed to fetch', status: 0 } })
    chain.upsert = vi.fn().mockResolvedValue({ error: { message: 'Failed to fetch', status: 0 } })

    vi.mocked(supabase.from).mockReturnValue(chain as any)

    const item = {
      id: 3,
      tabla: 'bitacoras_unidad',
      accion: 'INSERT',
      payload: { id: 'b2' },
      timestamp: Date.now(),
      intentos: 0,
    }
    mockQueue.orderBy.mockReturnValue({
      toArray: vi.fn().mockResolvedValue([item, { ...item, id: 4 }]),
    } as any)

    await outboxService.processQueue()

    // Should only attempt first item, then break on network error
    expect(mockQueue.delete).not.toHaveBeenCalled()
  })

  it('retries validation errors and deletes after 3 failures', async () => {
    const chain: Record<string, any> = {}
    const syncMethods = ['select', 'eq', 'update', 'delete', 'order']
    for (const m of syncMethods) chain[m] = vi.fn(() => chain)
    chain.insert = vi.fn().mockResolvedValue({ error: { message: 'Duplicate key', status: 409 } })

    vi.mocked(supabase.from).mockReturnValue(chain as any)

    const item = {
      id: 5,
      tabla: 'bitacoras_unidad',
      accion: 'INSERT',
      payload: { id: 'b3' },
      timestamp: Date.now(),
      intentos: 2, // already failed twice
    }
    mockQueue.orderBy.mockReturnValue({
      toArray: vi.fn().mockResolvedValue([item]),
    } as any)

    await outboxService.processQueue()

    // 3rd attempt → intentos becomes 3 → delete
    expect(mockQueue.delete).toHaveBeenCalledWith(5)
  })

  it('increments intentos on validation error before threshold', async () => {
    const chain: Record<string, any> = {}
    const syncMethods = ['select', 'eq', 'update', 'delete', 'order']
    for (const m of syncMethods) chain[m] = vi.fn(() => chain)
    chain.insert = vi.fn().mockResolvedValue({ error: { message: 'Invalid data', status: 400 } })

    vi.mocked(supabase.from).mockReturnValue(chain as any)

    const item = {
      id: 6,
      tabla: 'bitacoras_unidad',
      accion: 'INSERT',
      payload: { id: 'b4' },
      timestamp: Date.now(),
      intentos: 0,
    }
    mockQueue.orderBy.mockReturnValue({
      toArray: vi.fn().mockResolvedValue([item]),
    } as any)

    await outboxService.processQueue()

    expect(mockQueue.update).toHaveBeenCalledWith(6, {
      intentos: 1,
      error_ultimo: 'Invalid data',
    })
    expect(mockQueue.delete).not.toHaveBeenCalled()
  })

  it('aborts if no active session', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null } as any,
      error: null,
    })

    const item = {
      id: 7,
      tabla: 'bitacoras_unidad',
      accion: 'INSERT',
      payload: { id: 'b5' },
      timestamp: Date.now(),
      intentos: 0,
    }
    mockQueue.orderBy.mockReturnValue({
      toArray: vi.fn().mockResolvedValue([item]),
    } as any)

    await outboxService.processQueue()

    expect(supabase.from).not.toHaveBeenCalled()
  })

  it('returns early if offline', async () => {
    Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true })

    await outboxService.processQueue()

    expect(mockQueue.orderBy).not.toHaveBeenCalled()
  })

  it('processes actas_completo INSERT with fichas_vinculadas into acta_acuerdo_fichas', async () => {
    // Restore session mock (previous test overrode it to null)
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } } as any,
      error: null,
    })

    const item = {
      id: 10,
      tabla: 'actas_completo',
      accion: 'INSERT',
      payload: {
        payload: { tipo: 'Reunion', fecha: '2026-07-15' },
        temas: [{ titulo: 'Tema 1' }],
        participantes: [{ perfil_id: 'p1', asistencia: 'Presente' }],
        acuerdos: [
          {
            titulo: 'Acuerdo Grupal',
            descripcion: 'Test',
            es_actividad_grupal: true,
            fichas_vinculadas: ['art-1', 'art-2'],
          },
        ],
      },
      timestamp: Date.now(),
      intentos: 0,
    }
    mockQueue.orderBy.mockReturnValue({
      toArray: vi.fn().mockResolvedValue([item]),
    } as any)

    // Build a chainable mock that supports the full actas_completo flow:
    // from('actas').insert().select().single() → returns new acta ID
    // from('acta_temas').insert() → success
    // from('acta_participantes').insert() → success
    // from('acta_firmas').insert() → success
    // from('acta_acuerdos').insert().select() → returns inserted acuerdo IDs
    // from('acta_acuerdo_fichas').insert() → success (fichas links)
    // from('notificaciones').insert() → success
    const tableResults: Record<string, any> = {
      actas: { data: { id: 'new-acta-1' }, error: null },
      acta_acuerdos: { data: [{ id: 'acuerdo-1' }], error: null },
    }
    const fichaInsertCalls: any[][] = []

    vi.mocked(supabase.from).mockImplementation(((table: string) => {
      const chain: Record<string, any> = {}
      const fluentMethods = ['select', 'eq', 'in', 'neq', 'gte', 'lte', 'like', 'ilike', 'contains', 'overlaps', 'filter', 'order', 'not', 'or']
      for (const m of fluentMethods) {
        chain[m] = vi.fn(() => chain)
      }
      for (const m of ['insert', 'update', 'delete', 'upsert']) {
        chain[m] = vi.fn((payload?: any) => {
          if (table === 'acta_acuerdo_fichas' && Array.isArray(payload)) {
            fichaInsertCalls.push(payload)
          }
          return chain
        })
      }
      chain.single = vi.fn(async () => tableResults[table] || { data: null, error: null })
      chain.maybeSingle = vi.fn(async () => tableResults[table] || { data: null, error: null })
      chain.then = (resolve: any, reject: any) =>
        Promise.resolve(tableResults[table] || { data: null, error: null }).then(resolve, reject)
      return chain
    }) as any)

    await outboxService.processQueue()

    // Verify acta_acuerdo_fichas was called for the fichas links
    const fromCalls = vi.mocked(supabase.from).mock.calls.map(c => c[0])
    expect(fromCalls).toContain('acta_acuerdo_fichas')
    // Verify the insert call included the ficha links
    expect(fichaInsertCalls.length).toBeGreaterThan(0)
    expect(fichaInsertCalls[0]).toEqual([
      { acuerdo_id: 'acuerdo-1', articulo_id: 'art-1' },
      { acuerdo_id: 'acuerdo-1', articulo_id: 'art-2' },
    ])
  })
})
