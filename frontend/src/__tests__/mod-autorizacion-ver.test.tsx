import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashModAutorizacionVer from '../components/dashboard/autorizacion/mod_autorizacion_ver'
import type { AutorizacionActividad } from '../types'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null })
        })
      })
    })
  }
}))

vi.mock('@/lib/db', () => ({
  db: {
    perfiles: { get: vi.fn().mockResolvedValue(null) },
    contactos_emergencia: {
      where: () => ({
        equals: () => ({
          toArray: vi.fn().mockResolvedValue([])
        })
      })
    },
    fichas_medicas: { get: vi.fn().mockResolvedValue(null) },
    autorizaciones: { get: vi.fn().mockResolvedValue(null), delete: vi.fn().mockResolvedValue(true) }
  }
}))

vi.mock('@/lib/pdf-service', () => ({
  generateOfficialPDF: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]))
}))

// Mock URL.createObjectURL / revokeObjectURL for node environment
globalThis.URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost/pdf-test')
globalThis.URL.revokeObjectURL = vi.fn()

describe('DashModAutorizacionVer component', () => {
  const mockAuth: AutorizacionActividad = {
    id: 'auth-historial-1',
    perfil_id: 'perfil-eliminado-o-null',
    actividad_nombre: 'Campamento de Invierno 2024',
    nombre_firmante: 'Carlos Ramirez',
    rut_firmante: '12.345.678-9',
    fecha_firma: '2024-07-15T10:00:00Z',
    firmado: true
  }

  it('no arroja error de lectura si el perfil pasado es null (caso de historial)', () => {
    // Renderizar con perfil = null
    expect(() => {
      render(
        <DashModAutorizacionVer
          isOpen={true}
          onClose={vi.fn()}
          auth={mockAuth}
          perfil={null}
        />
      )
    }).not.toThrow()

    // Debe mostrar el título del modal
    expect(screen.getByText('Expediente Oficial Digital')).toBeDefined()
    // Debe mostrar el nombre de la actividad y fallback
    expect(screen.getByText(/Campamento de Invierno 2024/i)).toBeDefined()
  })
})
