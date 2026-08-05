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
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { AdminZone, ZoneSection, ZoneSectionField } from '@/lib/admin-zones';
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
  if (field.type === 'number' && typeof raw === 'string' && raw.trim() !== '') {
    return Number(raw);
  }
  return raw;
}

/** Per-card resolver: serialize first, then validate with the section's schema. */
function buildResolver(section: ZoneSection): Resolver<Record<string, unknown>> {
  const schema = schemaResolver[section.schemaId].schema;
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
  // Split schema ids (branding.header/.footer, social.header/.footer) save
  // only the edited fields; plain categories keep the full-category behavior.
  const isSplitCard = section.schemaId !== section.category;
  const [saving, setSaving] = useState(false);

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
      <div className="flex items-center gap-2 text-[0.8em] font-black uppercase tracking-widest text-clr2 ml-2">
        <label htmlFor={fieldId} className="cursor-pointer">
          {field.label}
        </label>
        {field.tooltip && (
          <span className="group relative">
            <svg className="w-4 h-4 text-clr2/50 hover:text-clr7 cursor-help transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4m0-4h.01" />
            </svg>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 text-xs font-normal normal-case tracking-normal text-left bg-clr7 text-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
              {field.tooltip}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-clr7" />
            </span>
          </span>
        )}
      </div>
    );

    const errorText = error && (
      <p className="text-clr7 text-[0.8em] ml-2 font-black uppercase tracking-wider">{error.message}</p>
    );

    const inputClass =
      'w-full bg-zinc-50 dark:bg-black/20 border-2 border-transparent focus:border-clr7 rounded-2xl p-4 text-clr4 dark:text-clr1 outline-none transition-all font-bold text-sm shadow-inner';

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
              className="w-12 h-12 rounded-xl border-2 border-transparent focus:border-clr7 cursor-pointer"
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gradient-to-br from-white/30 via-clr5/20 to-clr7/40 dark:from-clr4 dark:via-clr5 dark:to-clr7/20 rounded-[1rem] p-2 md:p-4 shadow-2xl border border-clr10 dark:border-clr4"
    >
      <h3 className="text-lg font-black font-display text-clr5 dark:text-clr1 uppercase tracking-tighter px-4 pt-2">
        {section.title}
      </h3>

      <div className="space-y-6 p-4">{section.fields.map(renderField)}</div>

      <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-clr4 px-4 pb-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-4 bg-clr7 text-white font-black font-display uppercase rounded-[2rem] shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest text-sm disabled:opacity-50"
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
