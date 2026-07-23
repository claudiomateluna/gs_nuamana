'use client';

import { useState, ReactNode } from 'react';

interface Objective {
  id: string;
  area_id: number;
  texto_infantil: string;
  texto_terminal: string;
}

export interface UnitArea {
  id: number;
  name: string;
  icon?: string;
  img: string;
  color: string;
  symbol?: string;
  symbolDesc?: string;
  desc: string;
}

export interface UnitTab {
  key: string;
  label: string;
  content: ReactNode;
}

export interface UnitViewProps {
  primario: string;
  secundario: string;
  areas: UnitArea[];
  objectives: Objective[];
  tabs: UnitTab[];
  profileTabLabels?: { desarrollo: string; egreso: string };
  profileContent: { desarrollo: ReactNode; egreso: ReactNode };
}

export function getObjectivesByArea(objectives: Objective[], areaId: number) {
  return objectives.filter(o => o.area_id === areaId);
}

export function UnitView({
  primario,
  secundario,
  areas,
  objectives,
  tabs,
  profileTabLabels = { desarrollo: 'Desarrollo', egreso: 'Perfil de Egreso' },
  profileContent,
}: UnitViewProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || '');
  const [profileTab, setProfileTab] = useState<'desarrollo' | 'egreso'>('desarrollo');

  const isTwoColor = secundario !== '#1b1b1b' && secundario !== '#FFFFFF' && secundario !== primario;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-zinc-200 dark:border-white/10 pb-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-2 py-1 rounded-[0.5rem] text-[0.9em] font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === tab.key
                  ? 'text-white shadow-lg'
                  : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10'
              }`}
              style={{
                backgroundColor: activeTab === tab.key
                  ? (isTwoColor ? secundario : primario)
                  : undefined,
                color: activeTab === tab.key && isTwoColor
                  ? primario
                  : undefined,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {tabs.map(tab => (
        activeTab === tab.key && (
          <div key={tab.key} className="animate-in fade-in duration-300">
            {tab.content}
          </div>
        )
      ))}

      {/* Profile Sub-Tabs (shared across all units) */}
      {activeTab === 'perfil' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex justify-center border-b border-zinc-200 dark:border-white/10 pb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setProfileTab('desarrollo')}
                className={`px-4 py-2 rounded-xl text-[0.85em] font-black uppercase tracking-wider transition-all duration-300 ${
                  profileTab === 'desarrollo'
                    ? 'text-white shadow-md'
                    : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300'
                }`}
                style={{
                  backgroundColor: profileTab === 'desarrollo'
                    ? (isTwoColor ? secundario : primario)
                    : undefined,
                  color: profileTab === 'desarrollo' && isTwoColor
                    ? primario
                    : undefined,
                }}
              >
                {profileTabLabels.desarrollo}
              </button>
              <button
                onClick={() => setProfileTab('egreso')}
                className={`px-4 py-2 rounded-xl text-[0.85em] font-black uppercase tracking-wider transition-all duration-300 ${
                  profileTab === 'egreso'
                    ? 'text-white shadow-md'
                    : 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300'
                }`}
                style={{
                  backgroundColor: profileTab === 'egreso'
                    ? (isTwoColor ? secundario : primario)
                    : undefined,
                  color: profileTab === 'egreso' && isTwoColor
                    ? primario
                    : undefined,
                }}
              >
                {profileTabLabels.egreso}
              </button>
            </div>
          </div>

          {profileTab === 'desarrollo'
            ? profileContent.desarrollo
            : profileContent.egreso
          }
        </div>
      )}
    </div>
  );
}
