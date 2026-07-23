/**
 * Extract a human-readable message from any error type.
 * Handles: Error instances, Supabase error objects, strings, unknown.
 */
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message: unknown }).message);
  }
  if (typeof err === 'string') return err;
  return String(err);
}
