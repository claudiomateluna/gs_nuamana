'use client';

import type { UnidadSimbolosData } from '@/types';

interface DynamicSimbolosViewProps {
  data: UnidadSimbolosData;
  primario: string;
  secundario: string;
}

export default function DynamicSimbolosView({ data, primario, secundario }: DynamicSimbolosViewProps) {
  const puntos = data.promesa_puntos || [];
  const leyes = data.ley_articulos || [];
  const elementos = data.elementos || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="space-y-4">
        {data.titulo && (
          <h3
            className="text-[1.5em] font-black uppercase tracking-tight p-3 rounded-xl inline-block"
            style={{ backgroundColor: primario, color: secundario }}
          >
            {data.titulo}
          </h3>
        )}
        {data.descripcion && (
          <p className="text-[1.05em] leading-relaxed text-clr2 dark:text-dclr2 whitespace-pre-line font-medium">
            {data.descripcion}
          </p>
        )}
      </div>

      {/* Promesa y Ley */}
      {(data.promesa_texto || leyes.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {data.promesa_texto && (
            <div className="md:col-span-7 unit-card border unit-border rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: primario }} />
              <div className="space-y-4">
                <h4 className="text-[1.25em] font-black uppercase text-clr2 dark:text-dclr2 pl-2">
                  {data.promesa_titulo || 'La Promesa'}
                </h4>
                <blockquote
                  className="unit-card-b p-5 rounded-2xl border-l-4 italic text-[1.1em] pl-4 font-medium leading-relaxed"
                  style={{ borderLeftColor: primario }}
                >
                  "{data.promesa_texto}"
                </blockquote>
                {puntos.length > 0 && (
                  <div className="space-y-2 pl-2">
                    <h5 className="font-extrabold text-[0.95em] uppercase text-clr2 dark:text-dclr2">
                      Significado del Compromiso:
                    </h5>
                    <ul className="space-y-2 text-[0.9em] text-clr2 dark:text-dclr2 leading-relaxed font-semibold">
                      {puntos.map((punto, i) => (
                        <li key={i}>• {punto}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {leyes.length > 0 && (
            <div className="md:col-span-5 unit-card border unit-border rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: secundario }} />
              <div className="space-y-4">
                <h4 className="text-[1.25em] font-black uppercase text-clr2 dark:text-dclr2 pl-2">
                  {data.ley_titulo || 'La Ley'}
                </h4>
                <div className="grid grid-cols-1 gap-2 pt-2 pl-2">
                  {leyes.map((ley, i) => (
                    <div
                      key={i}
                      className="p-2.5 unit-card-b rounded-xl border unit-border flex items-center gap-2.5"
                    >
                      <span className="font-black text-xs" style={{ color: primario }}>
                        ✓
                      </span>
                      <span className="text-[0.88em] font-extrabold text-clr2 dark:text-dclr2 leading-tight">
                        {ley}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Elementos Simbólicos */}
      {elementos.length > 0 && (
        <div className="space-y-4 pt-4">
          <h4 className="text-[1.25em] font-black uppercase text-clr2 dark:text-dclr2">
            Elementos de Tradición e Identidad
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {elementos.map((elem, idx) => (
              <div
                key={idx}
                className="unit-card border unit-border rounded-3xl p-6 shadow-md space-y-3 relative overflow-hidden flex flex-col justify-between hover:shadow-lg transition-shadow"
              >
                <div
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ backgroundColor: idx % 2 === 0 ? primario : secundario }}
                />
                <div className="space-y-3">
                  {elem.imagen_url ? (
                    <div className="w-full h-32 rounded-2xl overflow-hidden unit-card-b flex items-center justify-center p-3 border unit-border shadow-inner group">
                      <img
                        src={elem.imagen_url}
                        alt={elem.titulo}
                        className="max-h-full max-w-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : elem.icono ? (
                    <span className="text-4xl block">{elem.icono}</span>
                  ) : null}
                  <h5 className="font-extrabold uppercase text-[1.1em] text-clr2 dark:text-dclr2">
                    {elem.titulo}
                  </h5>
                  <p className="text-[0.9em] text-clr2 dark:text-dclr2 leading-relaxed font-medium">
                    {elem.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
