'use client';

import type { UnidadCicloData } from '@/types';

interface DynamicCicloViewProps {
  data: UnidadCicloData;
  primario: string;
  secundario: string;
}

export default function DynamicCicloView({ data, primario, secundario }: DynamicCicloViewProps) {
  const fases = data.fases || [];

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
        {data.subtitulo && (
          <h4 className="text-[1.2em] font-extrabold uppercase text-clr2 dark:text-dclr2">
            {data.subtitulo}
          </h4>
        )}
        {data.descripcion && (
          <p className="text-[1.05em] leading-relaxed text-clr2 dark:text-dclr2 whitespace-pre-line font-medium">
            {data.descripcion}
          </p>
        )}
      </div>

      {fases.length > 0 && (
        <div className="unit-card border rounded-3xl p-6 shadow-md space-y-6">
          <h4 className="text-[1.25em] font-black uppercase text-clr2 dark:text-dclr2 border-b unit-border pb-3">
            Fases del Ciclo de Programa
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {fases.map((fase, i) => (
              <div
                key={i}
                className="unit-card-b rounded-2xl p-5 space-y-2 border relative overflow-hidden flex flex-col justify-between"
              >
                <div
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ backgroundColor: i % 2 === 0 ? primario : secundario }}
                />
                <div>
                  <span
                    className="text-[1.5em] font-black block mb-1"
                    style={{ color: i % 2 === 0 ? primario : secundario }}
                  >
                    0{i + 1}
                  </span>
                  <h5 className="font-extrabold uppercase text-[1em] text-clr2 dark:text-dclr2">
                    {fase.nombre}
                  </h5>
                  <p className="text-[0.9em] text-clr2 dark:text-dclr2 mt-2 leading-relaxed font-medium">
                    {fase.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.extra_info && (
        <div className="unit-card border unit-border rounded-3xl p-6 shadow-md">
          <p className="text-[1em] text-clr2 dark:text-dclr2 leading-relaxed whitespace-pre-line font-medium">
            {data.extra_info}
          </p>
        </div>
      )}
    </div>
  );
}
