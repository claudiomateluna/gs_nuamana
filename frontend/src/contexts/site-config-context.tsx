'use client';

/**
 * Site Config Context
 * Provides the server-loaded SiteConfigRecord to client components.
 * Values are passed as props from the async root layout (SSR contract) — the
 * provider never fetches; useSiteConfig throws outside the provider.
 */

import { createContext, useContext } from 'react';
import type { SiteConfigRecord } from '@/lib/site-config.types';

const SiteConfigContext = createContext<SiteConfigRecord | null>(null);

export function SiteConfigProvider({
  children,
  config,
}: {
  children: React.ReactNode;
  config: SiteConfigRecord;
}) {
  return (
    <SiteConfigContext.Provider value={config}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): SiteConfigRecord {
  const config = useContext(SiteConfigContext);
  if (!config) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return config;
}

/**
 * Safe accessor for components that MAY render outside the provider (e.g. a
 * Header imported by not-found.tsx or an isolated render path). Returns null
 * instead of throwing — callers fall back to their DEFAULT_SITE_CONFIG values
 * per field, so an absent provider behaves identically to an absent DB key.
 */
export function useSiteConfigSafe(): SiteConfigRecord | null {
  try {
    return useSiteConfig();
  } catch {
    return null;
  }
}
