import { describe, it, expect, vi, beforeEach } from 'vitest'

// vi.hoisted ensures these are available when vi.mock factories run (they're hoisted)
const { supabaseFromMock, createChainable } = vi.hoisted(() => {
  function createChainable(defaultData: any[] = []) {
    const chain: Record<string, any> = {}
    const methods = [
      'select', 'eq', 'in', 'neq', 'gte', 'lte', 'like', 'ilike',
      'contains', 'overlaps', 'filter', 'order', 'not', 'limit', 'match',
    ]
    for (const m of methods) {
      chain[m] = vi.fn(() => chain)
    }
    for (const m of ['insert', 'update', 'delete', 'upsert']) {
      chain[m] = vi.fn(() => chain)
    }
    chain.maybeSingle = vi.fn(async () => ({ data: null, error: null }))
    chain.single = vi.fn(async () => ({ data: null, error: null }))
    chain.then = (resolve: any, reject: any) =>
      Promise.resolve({ data: defaultData, error: null }).then(resolve, reject)
    return chain
  }
  return { supabaseFromMock: vi.fn(() => createChainable()), createChainable }
})

vi.mock('@/lib/supabase', () => ({
  supabase: { from: supabaseFromMock },
}))

vi.mock('@/lib/roles', () => ({
  getRoleIds: vi.fn(() => [9, 10, 11, 12, 13]),
}))

vi.mock('@/lib/db', () => ({
  db: {
    ciclo_activo: {
      get: vi.fn(),
      where: vi.fn(() => ({ equals: vi.fn(() => ({ first: vi.fn() })) })),
    },
  },
}))

import { cycleService } from '@/services/cycleService'
import { supabase } from '@/lib/supabase'

beforeEach(() => {
  vi.clearAllMocks()
})

// ── getActiveCycle ──────────────────────────────────────────────────────────

describe('getActiveCycle', () => {
  it('returns cycle data when found by unidadId', async () => {
    const cycleData = { id: 'c1', unidad_id: 1, estado: 'activo' }
    const chain = createChainable()
    chain.maybeSingle.mockResolvedValue({ data: cycleData, error: null })
    supabaseFromMock.mockReturnValue(chain)

    const result = await cycleService.getActiveCycle(1)

    expect(result).toEqual(cycleData)
    expect(supabase.from).toHaveBeenCalledWith('ciclos_unidad')
    expect(chain.eq).toHaveBeenCalledWith('unidad_id', 1)
    expect(chain.eq).toHaveBeenCalledWith('estado', 'activo')
  })

  it('returns null when no cycle found', async () => {
    const chain = createChainable()
    supabaseFromMock.mockReturnValue(chain)

    const result = await cycleService.getActiveCycle(1)
    expect(result).toBeNull()
  })

  it('queries by overrideId when provided', async () => {
    const chain = createChainable()
    chain.maybeSingle.mockResolvedValue({ data: { id: 'override-1' }, error: null })
    supabaseFromMock.mockReturnValue(chain)

    const result = await cycleService.getActiveCycle(null, 'override-1')

    expect(result).toEqual({ id: 'override-1' })
    expect(chain.eq).toHaveBeenCalledWith('id', 'override-1')
  })

  it('returns null when no unidadId and no overrideId and not directivo', async () => {
    const result = await cycleService.getActiveCycle(null)
    expect(result).toBeNull()
  })

  it('queries latest active cycle for directivo admin', async () => {
    const chain = createChainable()
    chain.maybeSingle.mockResolvedValue({ data: { id: 'c-directivo' }, error: null })
    supabaseFromMock.mockReturnValue(chain)

    const result = await cycleService.getActiveCycle(null, undefined, true)

    expect(result).toEqual({ id: 'c-directivo' })
    expect(chain.eq).toHaveBeenCalledWith('estado', 'activo')
    expect(chain.order).toHaveBeenCalledWith('created_at', { ascending: false })
    expect(chain.limit).toHaveBeenCalledWith(1)
  })

  it('falls back to local when online query fails', async () => {
    const chain = createChainable()
    chain.maybeSingle.mockRejectedValue(new Error('network'))
    supabaseFromMock.mockReturnValue(chain)

    const result = await cycleService.getActiveCycle(1)
    expect(result).toBeNull()
  })
})

// ── deleteActiveCycle ───────────────────────────────────────────────────────

describe('deleteActiveCycle', () => {
  it('deletes cycle by id', async () => {
    const chain = createChainable()
    supabaseFromMock.mockReturnValue(chain)

    await cycleService.deleteActiveCycle('ciclo-123')

    expect(supabase.from).toHaveBeenCalledWith('ciclos_unidad')
    expect(chain.delete).toHaveBeenCalled()
    expect(chain.eq).toHaveBeenCalledWith('id', 'ciclo-123')
  })

  it('propagates error from Supabase', async () => {
    const chain = createChainable()
    chain.then = (resolve: any, reject: any) =>
      Promise.resolve({ data: null, error: new Error('delete failed') }).then(resolve, reject)
    supabaseFromMock.mockReturnValue(chain)

    await expect(cycleService.deleteActiveCycle('ciclo-123')).rejects.toThrow()
  })
})

// ── registerVote ────────────────────────────────────────────────────────────

describe('registerVote', () => {
  it('upserts vote when cantidad > 0', async () => {
    const chain = createChainable()
    supabaseFromMock.mockReturnValue(chain)

    await cycleService.registerVote('prop-1', 'perfil-1', 5)

    expect(supabase.from).toHaveBeenCalledWith('ciclo_votos')
    expect(chain.upsert).toHaveBeenCalledWith(
      { propuesta_id: 'prop-1', perfil_id: 'perfil-1', cantidad: 5 },
      { onConflict: 'propuesta_id,perfil_id' },
    )
  })

  it('deletes vote when cantidad is 0', async () => {
    const chain = createChainable()
    supabaseFromMock.mockReturnValue(chain)

    await cycleService.registerVote('prop-1', 'perfil-1', 0)

    expect(chain.delete).toHaveBeenCalled()
    expect(chain.match).toHaveBeenCalledWith({ propuesta_id: 'prop-1', perfil_id: 'perfil-1' })
  })

  it('deletes vote when cantidad is negative', async () => {
    const chain = createChainable()
    supabaseFromMock.mockReturnValue(chain)

    await cycleService.registerVote('prop-1', 'perfil-1', -1)

    expect(chain.delete).toHaveBeenCalled()
  })

  it('propagates upsert error', async () => {
    const chain = createChainable()
    chain.then = (resolve: any, reject: any) =>
      Promise.resolve({ data: null, error: new Error('conflict') }).then(resolve, reject)
    supabaseFromMock.mockReturnValue(chain)

    await expect(cycleService.registerVote('prop-1', 'perfil-1', 3)).rejects.toThrow()
  })
})

// ── closeCycle ──────────────────────────────────────────────────────────────

describe('closeCycle', () => {
  it('sets estado to cerrado with fecha_fin', async () => {
    const chain = createChainable()
    supabaseFromMock.mockReturnValue(chain)

    await cycleService.closeCycle('ciclo-42')

    expect(supabase.from).toHaveBeenCalledWith('ciclos_unidad')
    expect(chain.update).toHaveBeenCalledWith(
      expect.objectContaining({ estado: 'cerrado' }),
    )
    expect(chain.eq).toHaveBeenCalledWith('id', 'ciclo-42')
  })

  it('propagates error', async () => {
    const chain = createChainable()
    chain.then = (resolve: any, reject: any) =>
      Promise.resolve({ data: null, error: new Error('fail') }).then(resolve, reject)
    supabaseFromMock.mockReturnValue(chain)

    await expect(cycleService.closeCycle('ciclo-42')).rejects.toThrow()
  })
})

// ── advanceStage ────────────────────────────────────────────────────────────

describe('advanceStage', () => {
  it('updates fase_actual', async () => {
    const chain = createChainable()
    supabaseFromMock.mockReturnValue(chain)

    await cycleService.advanceStage('ciclo-99', 3)

    expect(chain.update).toHaveBeenCalledWith({ fase_actual: 3 })
    expect(chain.eq).toHaveBeenCalledWith('id', 'ciclo-99')
  })

  it('propagates error', async () => {
    const chain = createChainable()
    chain.then = (resolve: any, reject: any) =>
      Promise.resolve({ data: null, error: new Error('nope') }).then(resolve, reject)
    supabaseFromMock.mockReturnValue(chain)

    await expect(cycleService.advanceStage('ciclo-99', 2)).rejects.toThrow()
  })
})

// ── updateVotingRules ───────────────────────────────────────────────────────

describe('updateVotingRules', () => {
  it('updates all three voting rule fields', async () => {
    const chain = createChainable()
    supabaseFromMock.mockReturnValue(chain)

    await cycleService.updateVotingRules('ciclo-1', 10, 3, true)

    expect(chain.update).toHaveBeenCalledWith({
      votos_totales_por_persona: 10,
      votos_max_por_propuesta: 3,
      votos_ilimitados: true,
    })
    expect(chain.eq).toHaveBeenCalledWith('id', 'ciclo-1')
  })
})

// ── updateGeneralEvaluation ─────────────────────────────────────────────────

describe('updateGeneralEvaluation', () => {
  it('updates evaluacion fields', async () => {
    const chain = createChainable()
    supabaseFromMock.mockReturnValue(chain)

    await cycleService.updateGeneralEvaluation('ciclo-5', 'Gen', 'Enf')

    expect(chain.update).toHaveBeenCalledWith({
      evaluacion_general: 'Gen',
      evaluacion_enfasis: 'Enf',
    })
    expect(chain.eq).toHaveBeenCalledWith('id', 'ciclo-5')
  })
})

// ── deleteProposal ──────────────────────────────────────────────────────────

describe('deleteProposal', () => {
  it('deletes proposal by id', async () => {
    const chain = createChainable()
    supabaseFromMock.mockReturnValue(chain)

    await cycleService.deleteProposal('prop-7')

    expect(supabase.from).toHaveBeenCalledWith('ciclo_propuestas')
    expect(chain.delete).toHaveBeenCalled()
    expect(chain.eq).toHaveBeenCalledWith('id', 'prop-7')
  })

  it('propagates error', async () => {
    const chain = createChainable()
    chain.then = (resolve: any, reject: any) =>
      Promise.resolve({ data: null, error: new Error('locked') }).then(resolve, reject)
    supabaseFromMock.mockReturnValue(chain)

    await expect(cycleService.deleteProposal('prop-7')).rejects.toThrow()
  })
})

// ── updateProposalEvaluation ────────────────────────────────────────────────

describe('updateProposalEvaluation', () => {
  it('updates evaluacion field on proposal', async () => {
    const chain = createChainable()
    supabaseFromMock.mockReturnValue(chain)

    await cycleService.updateProposalEvaluation('prop-3', 'Buena propuesta')

    expect(chain.update).toHaveBeenCalledWith({ evaluacion: 'Buena propuesta' })
    expect(chain.eq).toHaveBeenCalledWith('id', 'prop-3')
  })
})

// ── toggleProposalPreselection ──────────────────────────────────────────────

describe('toggleProposalPreselection', () => {
  it('sets preseleccionada to true', async () => {
    const chain = createChainable()
    supabaseFromMock.mockReturnValue(chain)

    await cycleService.toggleProposalPreselection('prop-5', true)

    expect(chain.update).toHaveBeenCalledWith({ preseleccionada: true })
    expect(chain.eq).toHaveBeenCalledWith('id', 'prop-5')
  })

  it('sets preseleccionada to false', async () => {
    const chain = createChainable()
    supabaseFromMock.mockReturnValue(chain)

    await cycleService.toggleProposalPreselection('prop-5', false)

    expect(chain.update).toHaveBeenCalledWith({ preseleccionada: false })
  })
})

// ── unscheduleProposal ──────────────────────────────────────────────────────

describe('unscheduleProposal', () => {
  it('clears seleccionada and fecha_programada', async () => {
    const chain = createChainable()
    supabaseFromMock.mockReturnValue(chain)

    await cycleService.unscheduleProposal('prop-10')

    expect(chain.update).toHaveBeenCalledWith({ seleccionada: false, fecha_programada: null })
    expect(chain.eq).toHaveBeenCalledWith('id', 'prop-10')
  })
})

// ── getVotes ────────────────────────────────────────────────────────────────

describe('getVotes', () => {
  it('returns vote data', async () => {
    const votes = [
      { propuesta_id: 'p1', perfil_id: 'u1', cantidad: 3 },
      { propuesta_id: 'p2', perfil_id: 'u2', cantidad: 1 },
    ]
    const chain = createChainable(votes)
    supabaseFromMock.mockReturnValue(chain)

    const result = await cycleService.getVotes()

    expect(result).toEqual(votes)
  })

  it('returns empty array on error', async () => {
    const chain = createChainable()
    chain.then = (resolve: any, reject: any) =>
      Promise.resolve({ data: null, error: new Error('db') }).then(resolve, reject)
    supabaseFromMock.mockReturnValue(chain)

    await expect(cycleService.getVotes()).rejects.toThrow()
  })
})

// ── getAsistencias ──────────────────────────────────────────────────────────

describe('getAsistencias', () => {
  it('returns empty array for empty ids', async () => {
    const result = await cycleService.getAsistencias([])
    expect(result).toEqual([])
  })

  it('queries with propuesta ids', async () => {
    const data = [{ perfil_id: 'u1', propuesta_id: 'p1' }]
    const chain = createChainable(data)
    supabaseFromMock.mockReturnValue(chain)

    const result = await cycleService.getAsistencias(['p1', 'p2'])

    expect(supabase.from).toHaveBeenCalledWith('asistencia_actividades')
    expect(chain.in).toHaveBeenCalledWith('propuesta_id', ['p1', 'p2'])
    expect(result).toEqual(data)
  })

  it('filters by perfilId when provided', async () => {
    const chain = createChainable()
    supabaseFromMock.mockReturnValue(chain)

    await cycleService.getAsistencias(['p1'], 'perfil-1')

    expect(chain.eq).toHaveBeenCalledWith('perfil_id', 'perfil-1')
  })
})

// ── getDbObjetivosFiltrados ─────────────────────────────────────────────────

describe('getDbObjetivosFiltrados', () => {
  it('returns empty array for empty ids', async () => {
    const result = await cycleService.getDbObjetivosFiltrados([])
    expect(result).toEqual([])
  })

  it('queries objectives by ids', async () => {
    const objs = [{ id: 'obj-1', rango_edad: '9-11', unidad_id: 1 }]
    const chain = createChainable(objs)
    supabaseFromMock.mockReturnValue(chain)

    const result = await cycleService.getDbObjetivosFiltrados(['obj-1'])

    expect(supabase.from).toHaveBeenCalledWith('progresion_objetivos')
    expect(chain.in).toHaveBeenCalledWith('id', ['obj-1'])
    expect(result).toEqual(objs)
  })
})

// ── getProposals ────────────────────────────────────────────────────────────

describe('getProposals', () => {
  it('queries proposals by cicloId', async () => {
    const proposals = [{ id: 'p1', titulo: 'Test' }]
    const chain = createChainable(proposals)
    supabaseFromMock.mockReturnValue(chain)

    const result = await cycleService.getProposals('ciclo-1')

    expect(supabase.from).toHaveBeenCalledWith('ciclo_propuestas')
    expect(chain.eq).toHaveBeenCalledWith('ciclo_id', 'ciclo-1')
    expect(result).toEqual(proposals)
  })

  it('returns empty array when no proposals', async () => {
    const chain = createChainable()
    supabaseFromMock.mockReturnValue(chain)

    const result = await cycleService.getProposals('ciclo-1')
    expect(result).toEqual([])
  })
})
