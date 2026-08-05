'use server';

/**
 * Server Action: Get Site Config (public read)
 * Returns the full site configuration for client components.
 */

import { loadSiteConfig } from '@/lib/site-config';
import type { SiteConfigRecord } from '@/lib/site-config.types';

export async function getSiteConfig(): Promise<SiteConfigRecord> {
  return loadSiteConfig();
}
