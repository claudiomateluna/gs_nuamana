import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageTemplate from '@/components/PageTemplate';
import MarkdownRenderer from '@/components/markdown-renderer';
import { readContentFile } from '@/lib/content-service';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { metadata } = await readContentFile('lo-que-hacemos', slug);
    return {
      title: `${metadata.title} | Nua Mana`,
      description: metadata.description,
    };
  } catch (e) {
    return { title: 'Página no encontrada' };
  }
}

export default async function LoQueHacemosSubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const { content, metadata } = await readContentFile('lo-que-hacemos', slug);
    return (
      <PageTemplate title={metadata.title || slug}>
        <article className="space-y-8">
          
          {/* Cabecera Refinada: Imagen + Texto */}
          <header className="flex flex-col md:flex-row gap-8 md:items-center">
            {metadata.image && (
              <div className="shrink-0 w-full md:w-[350px] lg:w-[450px] aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-clr4">
                <img 
                  src={metadata.image} 
                  alt={metadata.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-black font-display text-clr5 dark:text-clr1 uppercase tracking-tighter leading-none">
                {metadata.title}
              </h1>
              {metadata.description && (
                <p className="text-xl lg:text-2xl text-clr2 font-body font-bold italic leading-relaxed">
                  {metadata.description}
                </p>
              )}
              <div className="w-24 h-2 bg-clr7 rounded-full" />
            </div>
          </header>

          <div className="max-w-none pt-12 border-t border-clr10 dark:border-clr4">
            <MarkdownRenderer content={content} />
          </div>
        </article>
      </PageTemplate>
    );
  } catch (e) {
    notFound();
  }
}
