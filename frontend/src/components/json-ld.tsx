interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Renders structured data (JSON-LD) for search engines and AI crawlers.
 * Place in Server Components only. Next.js hoists it to <head> automatically.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
