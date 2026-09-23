'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { DashboardProvider, useDashboardContext } from '@/contexts/DashboardContext'
import SecondaryHeader from '@/components/SecondaryHeader'
import { canSeeAllTabs, isInactive } from '@/lib/roles'
import { getBitacoraName } from '@/lib/bitacora-utils'

const tabs = [
  { key: 'ficha', label: 'Ficha', icon: 'icono_ficha.svg', href: '/panel/ficha', alwaysShow: true },
  { key: 'unidad', label: 'Unidad', icon: 'icono_unidad.svg', href: '/panel/unidad', requiresUnit: true },
  { key: 'usuarios', label: 'Grupo', icon: 'icono_grupo.svg', href: '/panel/usuarios', requiresDirectivo: true },
  { key: 'actas', label: 'Actas', icon: 'icono_actas.svg', href: '/panel/actas', requiresCanSeeAll: true },
  { key: 'tesoreria', label: 'Tesoreria', icon: 'icono_tesoreria.svg', href: '/panel/tesoreria', requiresTeso: true },
  { key: 'ciclo', label: 'Ciclo', icon: 'icono_ciclo.svg', href: '/panel/ciclo', requiresDirectivoOrNnj: true },
  { key: 'articulos', label: 'Articulos', icon: 'icono_articulos.svg', href: '/panel/articulos', requiresDirectivoOrNnj: true },
  { key: 'tally', label: 'Bitacora', icon: 'icono_tally.svg', href: '/panel/tally', requiresDirectivoOrNnj: true },
  { key: 'progresion', label: 'Progresion', icon: 'icono_progresion.svg', href: '/panel/progresion', alwaysShow: true },
  { key: 'inventario', label: 'Inventario', icon: 'icono_inventario.svg', href: '/panel/inventario', requiresCanSeeAll: true },
]

function PanelLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { perfil, directivo, nnj, canSeeTeso, canSeeUnits, loading } = useDashboardContext()

  if (loading) {
    return (
      <div className="min-h-screen bg-pclr1 dark:bg-pdclr1 font-body transition-colors">
        <SecondaryHeader />
        <main className="max-w-[1080px] mx-auto px-2 py-32">
          <div className="p-20 text-center font-body text-pclr7 dark:text-pdclr7 italic tracking-widest uppercase text-[0.8em]">
            Sincronizando Bitacora...
          </div>
        </main>
      </div>
    )
  }

  if (!perfil) return null

  const activeTab = tabs.find(t => pathname.startsWith(t.href))?.key || 'ficha'

  const visibleTabs = tabs.filter(tab => {
    if (tab.alwaysShow) return true
    if (tab.requiresDirectivo && !directivo) return false
    if (tab.requiresUnit && !canSeeUnits) return false
    if (tab.requiresTeso && !canSeeTeso) return false
    if (tab.requiresDirectivoOrNnj && !directivo && !nnj) return false
    if (tab.requiresCanSeeAll && (!canSeeAllTabs(perfil) || isInactive(perfil))) return false
    return true
  })

  return (
    <div className="min-h-screen bg-pclr1 dark:bg-pdclr1 font-body transition-colors">
      <SecondaryHeader />
      <main className="max-w-[1080px] mx-auto px-2 py-32">
        <div className="bg-gradient-to-br from-pclr1 to-pclr2 dark:from-pdclr1 dark:to-pdclr2 rounded-[1rem] p-2 md:p-4 shadow-2xl border border-pclr13 dark:border-pdclr13 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 border-b border-pclr13 dark:border-pdclr13 pb-4">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black font-display text-pclr4 dark:text-pdclr4 uppercase tracking-tighter leading-none font-bold">{perfil.nombres} {perfil.apellidos}</h1>
              <p className="text-sm md:text-xl text-pclr5 dark:text-pdclr5 font-bold uppercase tracking-[0.2em] mt-2">{perfil.roles?.name} • {perfil.unidades?.nombre || 'Grupo Nua Mana'}</p>
            </div>
            <div className="shrink-0 w-24 h-24 bg-pclr3 dark:bg-pdclr3 rounded-full flex items-center justify-center shadow-xl overflow-hidden"><img src="/images/logos/LogoColor.svg" alt="Logo" className="w-28 h-28" /></div>
          </header>

          {/* Tab Bar */}
          <div className="flex border-b border-pclr13 dark:border-pdclr13 mb-5 mt-2 overflow-x-auto scrollbar-hide text-[1em]">
            {visibleTabs.map(tab => (
              <Link
                key={tab.key}
                href={tab.href}
                className={`flex flex-col items-center justify-center px-4 py-2 uppercase font-slab border-b-2 gap-1 transition-colors ${
                  activeTab === tab.key
                    ? 'border-pclr8 text-pclr8 dark:border-pdclr8 dark:text-pdclr8 font-bold'
                    : 'border-transparent text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4'
                }`}
              >
                <div
                  className="w-8 h-8 bg-current"
                  style={{
                    WebkitMaskImage: `url(/images/iconos/${tab.icon})`,
                    maskImage: `url(/images/iconos/${tab.icon})`,
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                  }}
                />
                <span className="text-[0.8em] sm:text-xs leading-none">
                  {tab.key === 'tally' ? getBitacoraName(perfil.unidad_id) : tab.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Page Content */}
          {children}
        </div>
      </main>
    </div>
  )
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <PanelLayoutContent>{children}</PanelLayoutContent>
    </DashboardProvider>
  )
}
