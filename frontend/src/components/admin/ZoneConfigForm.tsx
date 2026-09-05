'use client';

/**
 * ZoneConfigForm — Client component for editing site configuration by zone.
 *
 * One react-hook-form card per section (from ADMIN_ZONES metadata) with its
 * own Guardar button. JSON array fields are displayed as pretty-printed
 * strings and serialized back to arrays/objects BEFORE Zod validation, so the
 * resolver validates the real payload (the old SiteConfigForm parsed inside
 * onSubmit, where a strict z.array schema would already have rejected the raw
 * string). Split cards (branding/social header|footer) submit ONLY the edited
 * (dirty) fields so a partial save touches a single row; full-category cards
 * submit every field, keeping the full-category behavior unchanged.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Resolver, FieldErrors } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { AdminZone, ZoneSection, ZoneSectionField } from '@/lib/admin-zones';
import { gridRowGroups } from '@/lib/admin-zones';
import { schemaResolver } from '@/lib/site-config.validation';
import { saveSiteConfig } from '@/app/(admin)/actions/save-site-config';
import type { SiteConfigRecord } from '@/lib/site-config.types';

interface ZoneConfigFormProps {
  config: SiteConfigRecord;
  zone: AdminZone;
}

// ---------------------------------------------------------------------------
// JSON (de)serialization — rules inherited from the old SiteConfigForm
// ---------------------------------------------------------------------------

/**
 * JSON array fields whose invalid-JSON fallback splits on newlines (one entry
 * per line). Every other json field keeps the raw string so Zod reports the
 * validation error.
 */
const JSON_LINE_FALLBACK_FIELDS = new Set(['frases', 'imagenes_pool']);

function toDisplayValue(field: ZoneSectionField, value: unknown): unknown {
  if (field.type === 'json' && Array.isArray(value)) {
    return JSON.stringify(value, null, 2);
  }
  return value ?? '';
}

/** Transforms the raw form value into the value Zod validates. */
function serializeFieldValue(field: ZoneSectionField, raw: unknown): unknown {
  if (field.type === 'json' && typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      if (JSON_LINE_FALLBACK_FIELDS.has(field.key)) {
        return raw
          .split('\n')
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
      return raw; // leave as string — Zod rejects with its message
    }
  }
  if (field.type === 'number' && typeof raw === 'string') {
    // Empty string → undefined so the schema can apply its default (e.g. opacity 100)
    if (raw.trim() === '') return undefined;
    return Number(raw);
  }
  return raw;
}

/** Per-card resolver: serialize first, then validate with the section's schema. */
function buildResolver(section: ZoneSection): Resolver<Record<string, unknown>> {
  const fullSchema = schemaResolver[section.schemaId].schema;
  // When a section only shows a subset of a schema's fields (e.g. the partial
  // header-colors / menu-colors grids within theme_colors), we build a
  // .pick().partial() schema that only validates the section's own fields.
  // For split branding/social schemas whose sections carry extra cross-zone
  // fields (e.g. logo_sidebar in branding.header), we use the full schema as-is.
  const schemaKeys = new Set(
    'shape' in fullSchema ? Object.keys((fullSchema as z.ZodObject<z.ZodRawShape>).shape) : [],
  );
  const fieldKeys = section.fields
    .filter((f) => f.type !== 'heading')
    .map((f) => f.key);
  const isSubset = fieldKeys.length > 0 && fieldKeys.every((k) => schemaKeys.has(k)) && fieldKeys.length < schemaKeys.size;
  let schema = fullSchema;
  if (isSubset && 'pick' in fullSchema && 'partial' in fullSchema) {
    const pickObj: Record<string, true> = {};
    for (const k of fieldKeys) pickObj[k] = true;
    schema = (fullSchema as z.ZodObject<z.ZodRawShape>).pick(pickObj).partial();
  }
  return async (values) => {
    const serialized: Record<string, unknown> = {};
    for (const field of section.fields) {
      serialized[field.key] = serializeFieldValue(field, values[field.key]);
    }

    const parsed = schema.safeParse(serialized);
    if (parsed.success) {
      return { values: parsed.data as Record<string, unknown>, errors: {} };
    }

    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? '');
      if (key && !errors[key]) {
        errors[key] = { type: issue.code, message: issue.message };
      }
    }
    return { values: {}, errors: errors as FieldErrors<Record<string, unknown>> };
  };
}

function pickDirty(data: Record<string, unknown>, dirty: Record<string, boolean>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(data).filter(([key]) => dirty[key]));
}

// ---------------------------------------------------------------------------
// Section card — one form per section
// ---------------------------------------------------------------------------

interface SectionCardProps {
  section: ZoneSection;
  config: SiteConfigRecord;
}

function SectionCard({ section, config }: SectionCardProps) {
  const categoryConfig = (config[section.category] as unknown as Record<string, unknown>) ?? {};
  // Split schema ids (branding.header/.footer, social.header/.footer,
  // contact.visit) save only the edited fields; everything else (plain
  // categories, theme_colors, hero_colors) keeps the full-category behavior.
  const SPLIT_SCHEMA_IDS = new Set([
    'branding.header', 'branding.footer',
    'contact.visit',
  ]);
  const isSplitCard = SPLIT_SCHEMA_IDS.has(section.schemaId);
  const [saving, setSaving] = useState(false);

  // Section visibility toggle — reads from the 'section_visibility' category.
  // Defaults to true so a never-saved config still shows every section.
  const visibilityRecord = (config.section_visibility ?? {}) as unknown as Record<string, boolean>;
  const initialVisibility = section.visibilityKey
    ? visibilityRecord[section.visibilityKey] !== false
    : true;
  const [visibilityValue, setVisibilityValue] = useState(initialVisibility);
  const [savingVisibility, setSavingVisibility] = useState(false);

  const saveVisibility = async (key: string, value: boolean) => {
    setSavingVisibility(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        toast.error('Sesión expirada. Recargá la página.');
        // Revert optimistic update
        setVisibilityValue(!value);
        return;
      }
      const result = await saveSiteConfig('section_visibility', { [key]: value }, token);
      if (result.success) {
        toast.success(value ? `Sección "${section.title}" visible` : `Sección "${section.title}" oculta`);
      } else {
        toast.error(`Error al guardar visibilidad: ${result.errors?.join(', ')}`);
        // Revert optimistic update
        setVisibilityValue(!value);
      }
    } finally {
      setSavingVisibility(false);
    }
  };

  const defaultValues = section.fields.reduce<Record<string, unknown>>((acc, field) => {
    acc[field.key] = toDisplayValue(field, categoryConfig[field.key]);
    return acc;
  }, {});

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<Record<string, unknown>>({
    resolver: buildResolver(section),
    defaultValues,
    mode: 'onBlur',
  });

  const onSubmit = async (data: Record<string, unknown>) => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        toast.error('Sesión expirada. Recargá la página.');
        return;
      }

      const payload = isSplitCard ? pickDirty(data, dirtyFields as Record<string, boolean>) : data;
      const result = await saveSiteConfig(section.schemaId, payload, token);

      if (result.success) {
        toast.success(`Configuración de ${section.title} guardada correctamente`);
      } else {
        toast.error(`Error al guardar: ${result.errors?.join(', ')}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field: ZoneSectionField) => {
    const error = (errors as Record<string, { message?: string } | undefined>)[field.key];
    const fieldId = `${section.id}-${field.key}`;

    const labelRow = (
      <div className="flex items-center gap-2 text-[0.8em] font-black uppercase tracking-widest text-clr3 ml-2">
        <label htmlFor={fieldId} className="cursor-pointer">
          {field.label}
        </label>
        {field.tooltip && (
          <span className="group relative">
            <svg className="w-4 h-4 text-clr3 hover:text-clr4 cursor-help transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4m0-4h.01" />
            </svg>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 text-xs font-normal normal-case tracking-normal text-left bg-clr4 text-clr1 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
              {field.tooltip}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-clr4" />
            </span>
          </span>
        )}
      </div>
    );

    const errorText = error && (
      <p className="text-clr4 text-[0.8em] ml-2 font-black uppercase tracking-wider">{error.message}</p>
    );

    const inputClass =
      'w-full bg-clr1 dark:bg-dclr1 border-2 border-transparent focus:border-clr4 rounded-2xl p-4 text-clr2 dark:text-dclr2 outline-none transition-all font-bold text-sm shadow-inner';

    // JSON array fields render as textareas (pretty-printed strings)
    if (field.type === 'json' || field.type === 'textarea') {
      return (
        <div key={field.key} className="space-y-2">
          {labelRow}
          <textarea
            id={fieldId}
            {...register(field.key)}
            rows={field.type === 'json' ? 8 : 3}
            className={`${inputClass} font-mono`}
          />
          {errorText}
        </div>
      );
    }

    if (field.type === 'color') {
      return (
        <div key={field.key} className="space-y-2">
          {labelRow}
          <div className="flex items-center gap-3">
            <input
              type="color"
              id={`${fieldId}-swatch`}
              {...register(field.key)}
              className="w-12 h-12 rounded-xl border-2 border-transparent focus:border-clr4 cursor-pointer"
            />
            <input type="text" id={fieldId} {...register(field.key)} className={inputClass} />
          </div>
          {errorText}
        </div>
      );
    }

    return (
      <div key={field.key} className="space-y-2">
        {labelRow}
        <input
          type={field.type === 'number' ? 'number' : field.type === 'url' ? 'url' : 'text'}
          id={fieldId}
          {...register(field.key)}
          className={inputClass}
        />
        {errorText}
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // Grid rendering — 5-column table (Nombre | Claro | Transp. Claro | Oscuro |
  // Transp. Oscuro). Row-major convention: fields chunked by 4 via
  // gridRowGroups → [clrN(color), clrN_opacity(number), dclrN(color),
  // dclrN_opacity(number)] per row.
  // -------------------------------------------------------------------------

  const renderGridField = (field: ZoneSectionField, rowIndex: number) => {
    const error = (errors as Record<string, { message?: string } | undefined>)[field.key];
    const fieldId = `${section.id}-${field.key}`;
    const inputClass =
      'w-full bg-clr1 dark:bg-dclr1 border-2 border-transparent focus:border-clr4 rounded-xl p-2 text-clr2 dark:text-dclr2 outline-none transition-all font-bold text-sm shadow-inner';

    if (field.type === 'color') {
      return (
        <td key={field.key} className="px-2 py-1 align-middle">
          <div className="flex items-center gap-2">
            <input
              type="color"
              id={`${fieldId}-swatch`}
              aria-label={`${field.label} (selector de color)`}
              {...register(field.key)}
              className="w-10 h-10 rounded-lg border-2 border-transparent focus:border-clr4 cursor-pointer shrink-0"
            />
            <input
              type="text"
              id={fieldId}
              aria-label={field.label}
              {...register(field.key)}
              className={inputClass}
            />
          </div>
          {error && <p className="text-clr4 text-[0.7em] ml-2 font-black uppercase tracking-wider">{error.message}</p>}
        </td>
      );
    }

    return (
      <td key={field.key} className="px-2 py-1 align-middle">
        <input
          type="number"
          id={fieldId}
          aria-label={field.label}
          min={0}
          max={100}
          {...register(field.key)}
          className={inputClass}
        />
        {error && <p className="text-clr4 text-[0.7em] ml-2 font-black uppercase tracking-wider">{error.message}</p>}
      </td>
    );
  };

  const renderGrid = () => {
    const rows = gridRowGroups(section.fields);
    return (
      <div className="overflow-x-auto p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th scope="col" className="px-2 py-2 text-left text-[0.8em] font-black uppercase tracking-widest text-clr3">
                Nombre
              </th>
              <th scope="col" className="px-2 py-2 text-left text-[0.8em] font-black uppercase tracking-widest text-clr3">
                Claro
              </th>
              <th scope="col" className="px-2 py-2 text-left text-[0.8em] font-black uppercase tracking-widest text-clr3">
                Transp. Claro
              </th>
              <th scope="col" className="px-2 py-2 text-left text-[0.8em] font-black uppercase tracking-widest text-clr3">
                Oscuro
              </th>
              <th scope="col" className="px-2 py-2 text-left text-[0.8em] font-black uppercase tracking-widest text-clr3">
                Transp. Oscuro
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              // Heading row: full-width section separator
              if (row[0].type === 'heading') {
                return (
                  <tr key={`heading-${rowIndex}`}>
                    <td colSpan={5} className="px-2 pt-4 pb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[1em] font-black uppercase tracking-widest text-tclr3 dark:text-tdclr3">
                          {row[0].label}
                        </span>
                        {row[0].tooltip && (
                          <span className="text-[0.7em] text-clr3 dark:text-dclr3 normal-case tracking-normal">
                            — {row[0].tooltip}
                          </span>
                        )}
                        <span className="flex-1 h-px bg-clr7 dark:bg-dclr7 ml-2" />
                      </div>
                    </td>
                  </tr>
                );
              }
              const [colorField, lightOpacityField, darkField, darkOpacityField] = row;
              return (
                <tr key={colorField.key} className="border-t border-clr7 dark:border-dclr7">
                  <td className="px-2 py-1 text-[0.8em] font-black uppercase tracking-widest text-clr2 dark:text-dclr2 align-middle">
                    {colorField.label}
                  </td>
                  {renderGridField(colorField, rowIndex)}
                  {renderGridField(lightOpacityField, rowIndex)}
                  {renderGridField(darkField, rowIndex)}
                  {renderGridField(darkOpacityField, rowIndex)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gradient-to-br from-tclr1 to-tclr2 dark:from-tdclr1 dark:to-tdclr2 rounded-[1rem] p-2 md:p-4 shadow-2xl border border-clr7 dark:border-dclr7"
    >
      <h3 className="text-lg font-black font-display text-tclr3 dark:text-tdclr3 uppercase tracking-tighter px-4 pt-2">
        {section.title}
      </h3>

      {section.visibilityKey && (
        <div className="flex items-center justify-between px-4 py-2 mt-2 bg-clr7 dark:bg-dclr7 rounded-t-lg border-b border-clr7 dark:border-dclr7">
          <span className="text-sm font-medium text-clr2 dark:text-dclr2">
            Sección visible en el sitio
          </span>
          <button
            type="button"
            disabled={savingVisibility}
            aria-label={`Alternar visibilidad de ${section.title}`}
            aria-pressed={visibilityValue}
            onClick={() => {
              const newValue = !visibilityValue;
              setVisibilityValue(newValue);
              void saveVisibility(section.visibilityKey!, newValue);
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
              visibilityValue ? 'bg-green-500' : 'bg-gray-300 dark:bg-zinc-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                visibilityValue ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      )}

      {section.layout === 'grid' ? (
        renderGrid()
      ) : (
        <div className="space-y-6 p-4">{section.fields.map(renderField)}</div>
      )}

      <div className="flex gap-3 pt-4 border-t border-clr7 dark:border-dclr7 px-4 pb-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-4 bg-tclr5 dark:bg-tdclr5 text-clr1 font-black font-display uppercase rounded-[2rem] shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest text-sm disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// ZoneConfigForm — one card per section of the zone
// ---------------------------------------------------------------------------

export default function ZoneConfigForm({ config, zone }: ZoneConfigFormProps) {
  return (
    <div className="space-y-6">
      {zone.sections.map((section) => (
        <SectionCard key={section.id} section={section} config={config} />
      ))}
    </div>
  );
}
