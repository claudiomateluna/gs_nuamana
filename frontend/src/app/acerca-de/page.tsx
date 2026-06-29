import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import PageTemplate from '@/components/PageTemplate';
import MarkdownRenderer from '@/components/markdown-renderer';
import { readContentFile, getAllContentMetadata } from '@/lib/content-service';

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await readContentFile('acerca-de', 'acerca-de');
  return {
    title: `${metadata.title} | Nua Mana`,
    description: metadata.description,
  };
}

export default async function AcercaDePage() {
  const { content, metadata } = await readContentFile('acerca-de', 'acerca-de');
  const allContent = await getAllContentMetadata('acerca-de');

  const subPages = allContent
    .filter(item => item.slug !== 'acerca-de')
    .map(item => ({
      slug: item.slug,
      title: item.metadata.title || item.slug,
      description: item.metadata.description || '',
      image: item.metadata.image || '/images/logos/logo-nuamana.webp'
    }));

  return (
    <PageTemplate title={metadata.title || 'Acerca de Nua Mana'}>
      <section className="space-y-12">
        <MarkdownRenderer content={content} />

        <div className="pt-12 border-t border-clr10 dark:border-clr4">
          <h2 className="text-3xl font-black font-display text-clr7 uppercase tracking-tighter mb-8">Más información sobre nosotros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subPages.map((item) => (
              <Link key={item.slug} href={`/acerca-de/${item.slug}`} className="group p-6 bg-zinc-50 dark:bg-black/20 rounded-[2rem] border border-transparent hover:border-clr7 hover:bg-white dark:hover:bg-zinc-900 transition-all shadow-sm hover:shadow-xl flex gap-6 items-center">
                <div className="shrink-0 w-24 h-24 rounded-2xl overflow-hidden bg-white shadow-md border-2 border-white group-hover:scale-110 transition-transform duration-500">
                  <Image src={item.image} alt={item.title} width={100} height={100} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-display text-clr5 dark:text-clr1 uppercase group-hover:text-clr7 transition-colors leading-none mb-2">{item.title}</h3>
                  <p className="text-xs text-clr2 line-clamp-2 font-bold">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageTemplate>
  );
}
