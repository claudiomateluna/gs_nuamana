'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const subTabs = [
  { key: 'progreso', label: 'Mi Progreso', href: '/panel/progresion/progreso' },
  { key: 'especialidades', label: 'Mis Especialidades', href: '/panel/progresion/especialidades' },
  { key: 'ceremonias', label: 'Ceremonias e Hitos', href: '/panel/progresion/ceremonias' },
]

export default function ProgresionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Sub-tab navigation */}
      <div className="flex bg-pclr3 dark:bg-pdclr3 p-1 rounded-2xl w-fit">
        {subTabs.map(tab => (
          <Link
            key={tab.key}
            href={tab.href}
            className={`px-6 py-2 rounded-xl text-[0.8em] font-black uppercase transition-colors ${
              pathname === tab.href
                ? 'bg-pclr8 dark:bg-pdclr8 text-pclr12 dark:text-pdclr12 shadow-md'
                : 'text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Page content */}
      {children}
    </div>
  )
}
