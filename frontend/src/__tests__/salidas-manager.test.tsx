import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DashSalidasManager from '../components/dashboard/salidas/DashSalidasManager'
import type { Perfil, ActividadProgramada, AutorizacionActividad } from '../types'

vi.mock('@/utils/excel-export', () => ({
  exportarSalidaAutorizacionesExcel: vi.fn()
}))

describe('DashSalidasManager component', () => {
  const mockPerfil: Perfil = {
    id: 'dir-1',
    nombres: 'Dirigente',
    apellidos: 'Prueba',
    rut: '11.111.111-1',
    rol_id: 2,
    unidad_id: 1,
    roles: { id: 2, name: 'Dirigente' } as any
  }

  const mockMiembros: Perfil[] = [
    {
      id: 'm1',
      nombres: 'Lucas',
      apellidos: 'Silva',
      rut: '22.222.222-2',
      unidad_id: 1,
      rol_id: 5,
      unidades: { id: 1, nombre: 'Manada Seeonee' } as any,
      alergias: 'Maní'
    },
    {
      id: 'm2',
      nombres: 'Camila',
      apellidos: 'Rojas',
      rut: '23.333.333-3',
      unidad_id: 1,
      rol_id: 5,
      unidades: { id: 1, nombre: 'Manada Seeonee' } as any
    }
  ]

  const mockActividades: ActividadProgramada[] = [
    {
      id: 'act-1',
      nombre: 'Salida al Cerro San Cristóbal',
      tipo: 'Salida por el día',
      lugar: 'Cerro San Cristóbal',
      fecha_inicio: '2026-11-15',
      fecha_fin: '2026-11-15',
      unidad_id: 1
    },
    {
      id: 'act-2',
      nombre: 'Campamento Anual 2025',
      tipo: 'Campamento',
      lugar: 'Picarquín',
      fecha_inicio: '2025-01-10',
      fecha_fin: '2025-01-15',
      unidad_id: 1
    }
  ]

  const mockAutorizaciones: AutorizacionActividad[] = [
    {
      id: 'auth-1',
      perfil_id: 'm1',
      actividad_id: 'act-1',
      actividad_nombre: 'Salida al Cerro San Cristóbal',
      firmado: true,
      nombre_firmante: 'Rodrigo Silva',
      rut_firmante: '10.222.333-4',
      fecha_firma: '2026-10-19T10:00:00Z',
      estado: 'Vigente'
    }
  ]

  it('separa salidas activas de las del historial según fecha', () => {
    render(
      <DashSalidasManager
        perfil={mockPerfil}
        actividades={mockActividades}
        autorizaciones={mockAutorizaciones}
        miembros={mockMiembros}
        onVerAutorizacion={vi.fn()}
      />
    )

    // Por defecto muestra activas
    expect(screen.getAllByText('Salida al Cerro San Cristóbal').length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText('Campamento Anual 2025')).toBeNull()

    // Cambiar a Historial
    const btnHistorial = screen.getByRole('button', { name: /Historial \(1\)/i })
    fireEvent.click(btnHistorial)

    expect(screen.getAllByText('Campamento Anual 2025').length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText('Salida al Cerro San Cristóbal')).toBeNull()
  })

  it('muestra el banner offline si isOffline es true', () => {
    render(
      <DashSalidasManager
        perfil={mockPerfil}
        actividades={mockActividades}
        autorizaciones={mockAutorizaciones}
        miembros={mockMiembros}
        isOffline={true}
        onVerAutorizacion={vi.fn()}
      />
    )

    expect(screen.getByText(/Modo Sin Conexión/i)).toBeDefined()
  })

  it('permite abrir el modal de ver autorización al hacer clic en el botón', () => {
    const handleVerAuth = vi.fn()
    render(
      <DashSalidasManager
        perfil={mockPerfil}
        actividades={mockActividades}
        autorizaciones={mockAutorizaciones}
        miembros={mockMiembros}
        onVerAutorizacion={handleVerAuth}
      />
    )

    const btnVer = screen.getByText('📄 Ver Autorización Firmada')
    fireEvent.click(btnVer)

    expect(handleVerAuth).toHaveBeenCalledTimes(1)
    expect(handleVerAuth).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'auth-1' }),
      expect.objectContaining({ id: 'm1' })
    )
  })
})
