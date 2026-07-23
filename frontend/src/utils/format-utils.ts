export function cleanPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  return phone.replace(/[^0-9+]/g, '');
}

export function parseJsonField<T>(field: unknown, fallback: T): T {
  if (!field) return fallback;
  if (typeof field === 'object') return field as T;
  if (typeof field === 'string') {
    try { return JSON.parse(field) as T; } catch { return fallback; }
  }
  return fallback;
}
