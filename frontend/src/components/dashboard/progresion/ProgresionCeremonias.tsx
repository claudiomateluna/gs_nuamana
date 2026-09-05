'use client'

import React from 'react'
import RadarChartLazy from './RadarChartLazy'
import type { CeremoniaConJoins, RadarSnapshotItem } from '@/types/progresion'
import type { Perfil } from '@/types'

interface ProgresionCeremoniasProps {
  ceremonias: CeremoniaConJoins[]
  userPerfil: Perfil
  themePrimary: string
  themeSecondary: string
  inlineMessageTexts: Record<string, string>
  setInlineMessageTexts: React.Dispatch<React.SetStateAction<Record<string, string>>>
  handleSaveInlineMessage: (id: string) => void
  handleViewReport: (c: CeremoniaConJoins) => void
}

function getRoleLabel(rolId: number) {
  const roles: Record<number, string> = {
    1: 'Admin', 2: 'Dirigente', 3: 'Guiadora', 8: 'Apoderado',
    9: 'Lobato', 10: 'Guía', 11: 'Scout', 12: 'Pionero', 13: 'Caminante'
  }
  return roles[rolId] || 'Miembro'
}

const ProgresionCeremonias = React.memo(function ProgresionCeremonias({
  ceremonias,
  userPerfil,
  themePrimary,
  themeSecondary,
  inlineMessageTexts,
  setInlineMessageTexts,
  handleSaveInlineMessage,
  handleViewReport,
}: ProgresionCeremoniasProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h3 className="font-bold uppercase text-[1.5em] text-clr2 dark:text-dclr2">
          🏆 Álbum de Ceremonias e Hitos
        </h3>
        <p className="text-[0.9em] font-bold text-clr3 mt-1">
          Los momentos más importantes de tu vida scout, celebraciones y cambios de etapa.
        </p>
      </div>

      {ceremonias.length === 0 ? (
        <div className="p-16 text-center border-2 border-dashed rounded-[3rem] opacity-50 bg-clr1 dark:bg-dclr1 dark:border-clr1">
          <span className="text-4xl mb-4 block">🎪</span>
          <p className="italic font-bold uppercase tracking-widest text-[0.8em]">
            No hay ceremonias registradas aún. ¡Cada gran paso es un momento de celebración!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ceremonias.map(c => {
            const formattedDate = c.fecha ? new Date(c.fecha + 'T00:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

            let badgeColor = 'bg-clr4 text-clr1'
            if (c.tipo === 'promesa') badgeColor = 'bg-clr5 text-clr1'
            if (c.tipo === 'paso') badgeColor = 'bg-clr4 text-clr1'
            if (c.tipo === 'egreso') badgeColor = 'bg-clr4 text-clr1'
            if (c.tipo === 'bienvenida') badgeColor = 'bg-clr6 text-clr1'

            const hasMessages = c.mensajes && c.mensajes.length > 0

            const canWriteMessage = userPerfil.id !== c.perfil_id

            const alreadyWrote = c.mensajes?.some((m: { remitente_id: string }) => m.remitente_id === userPerfil.id)
            const showInput = canWriteMessage && !alreadyWrote

            return (
              <div key={c.id} className="bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-[2rem] p-6 shadow-lg flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-[0.8em] font-extrabold uppercase tracking-wider mb-2 ${badgeColor}`}>
                      {c.tipo === 'etapa' ? 'Etapa' : c.tipo === 'promesa' ? 'Promesa' : c.tipo === 'paso' ? 'Paso de Unidad' : c.tipo}
                    </span>
                    <h4 className="text-[1.8em] font-black uppercase tracking-tight text-clr2 dark:text-dclr2 leading-none">
                      {c.nombre_hito}
                    </h4>
                    <p className="text-[0.85em] font-bold text-clr3 mt-1 uppercase tracking-wider">
                      📅 {formattedDate}
                    </p>
                  </div>
                </div>

                {(c.campamento || c.lugar) && (
                  <div className="mt-3 p-3 bg-clr7 dark:bg-dclr7 rounded-2xl border dark:border-clr1 text-[0.85em] font-bold text-clr3 dark:text-dclr3 space-y-1">
                    {c.campamento && <p>🏕️ Campamento: <span className="text-clr2 dark:text-dclr2 uppercase">{c.campamento}</span></p>}
                    {c.lugar && <p>📍 Lugar: <span className="text-clr2 dark:text-dclr2 uppercase">{c.lugar}</span></p>}
                  </div>
                )}

                {c.tipo === 'paso' && (
                  <div className="mt-3 flex items-center gap-2 text-[0.85em] font-black uppercase text-clr4 dark:text-dclr4">
                    <span>👣 {c.unidad_origen?.nombre || 'Origen'}</span>
                    <span>➡️</span>
                    <span>{c.unidad_destino?.nombre || 'Destino'}</span>
                  </div>
                )}

                {c.foto_url && (
                  <div className="mt-4 rounded-2xl overflow-hidden shadow-inner border border-clr7 dark:border-dclr7">
                    <img src={c.foto_url} alt="Ceremonia" className="w-full max-h-64 object-cover" />
                  </div>
                )}

                {c.radar_snapshot && Array.isArray(c.radar_snapshot) && c.radar_snapshot.length > 0 && (
                  <div className="mt-6 flex flex-col items-center bg-clr7 dark:bg-dclr7 p-3 rounded-2xl border dark:border-clr1">
                    <span className="text-[0.8em] font-extrabold uppercase tracking-widest text-clr3 mb-1">
                      📊 Radar de Progresión en Ceremonia
                    </span>
                    <div className="w-full h-44 max-w-[280px]">
                      <RadarChartLazy
                        data={c.radar_snapshot}
                        themePrimary={themePrimary}
                        showTooltip={false}
                        showLegend={false}
                        outerRadius="60%"
                      />
                    </div>
                  </div>
                )}

                {c.tipo === 'promesa' && (c.padrino || c.madrina) && (
                  <div className="mt-4 p-3 bg-clr5 rounded-2xl border border-clr5 text-[0.85em] font-bold text-clr5 dark:text-dclr5 space-y-1">
                    {c.padrino && <p>⛪ Padrino: <span className="text-clr2 dark:text-dclr2 uppercase">{c.padrino.nombres} {c.padrino.apellidos}</span></p>}
                    {c.madrina && <p>⛪ Madrina: <span className="text-clr2 dark:text-dclr2 uppercase">{c.madrina.nombres} {c.madrina.apellidos}</span></p>}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-clr7 dark:border-dclr7 space-y-3">
                  <span className="text-[0.8em] font-extrabold uppercase tracking-widest text-clr3 block">
                    {c.tipo === 'promesa'
                      ? '⛪ Mensajes y Bendiciones'
                      : c.tipo === 'etapa'
                        ? '🎉 Felicitaciones y Saludos'
                        : '💬 Mensajes de Despedida'}
                  </span>

                  {hasMessages ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {c.mensajes?.map((m: { id: string; remitente_id: string; mensaje: string; remitente?: { nombres?: string; apellidos?: string; rol_id?: number } | null }) => (
                        <div key={m.id} className="p-3 bg-clr7 dark:bg-dclr7 rounded-2xl border dark:border-clr1 text-[0.85em]">
                          <p className="text-clr2 dark:text-dclr2 italic font-bold">"{m.mensaje}"</p>
                          <p className="text-[0.8em] text-clr3 font-extrabold uppercase mt-1 text-right">
                            — {m.remitente?.nombres} {m.remitente?.apellidos} {m.remitente?.rol_id ? `(${getRoleLabel(m.remitente.rol_id)})` : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[0.8em] font-bold text-clr3 italic">No hay mensajes aún.</p>
                  )}

                  {showInput && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={inlineMessageTexts[c.id] || ''}
                        onChange={(e) => setInlineMessageTexts(prev => ({ ...prev, [c.id]: e.target.value }))}
                        placeholder={
                          c.tipo === 'promesa'
                            ? "Escribe tus bendiciones para tu ahijado..."
                            : c.tipo === 'etapa'
                              ? "Escribe tus felicitaciones por esta nueva etapa..."
                              : c.tipo === 'paso'
                                ? "Escribe tu despedida al NNJ..."
                                : "Escribe un mensaje de celebración..."
                        }
                        className="flex-1 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 p-2 rounded-xl text-[0.85em] font-bold text-clr2 dark:text-dclr2"
                      />
                      <button
                        onClick={() => handleSaveInlineMessage(c.id)}
                        className="px-4 py-2 text-[0.8em] font-bold uppercase rounded-xl text-clr1 shadow-md hover:brightness-105 active:scale-95 transition-all"
                        style={{ backgroundColor: themePrimary }}
                      >
                        Enviar
                      </button>
                    </div>
                  )}
                </div>

                {c.tipo === 'paso' && (
                  <button
                    onClick={() => handleViewReport(c)}
                    className="mt-4 w-full py-2 border-2 border-dashed border-clr4 hover:border-clr4 hover:bg-clr4 text-clr4 dark:text-dclr4 text-[0.8em] font-bold uppercase rounded-2xl shadow-sm transition-all"
                  >
                    📄 Ver Informe de Logros
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
})

export default ProgresionCeremonias
