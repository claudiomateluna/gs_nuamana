'use client';

import Link from 'next/link';
import { 
  IconoRRSSInstagram, 
  IconoRRSSFacebook, 
  IconoRRSSYoutube, 
  IconoRRSSTiktok, 
  IconoRRSSGoogle, 
  IconoRRSSEmail, 
  IconoRRSSWhatsApp 
} from './ui/iconos';
import UnitSlideShow from './unit-slideshow';
import { useSiteConfigSafe } from '@/contexts/site-config-context';

const FALLBACK = {
  logo_footer: '/images/logos/Iconos-logo.svg',
  nombre_grupo: 'Guías y Scouts Nua Mana',
  slogan: 'una nueva aventura',
  mision: 'Nuestra misión es contribuir a la educación de jóvenes para que participen en la construcción de un mundo mejor, donde las personas se desarrollen plenamente y jueguen un papel constructivo en la sociedad.',
  copyright: 'Guías y Scouts Nua Mana',
  motto: 'Educación para la vida • Empoderamiento juvenil • Un mundo mejor',
  social: [
    { href: 'https://instagram.com/gruponuamana/', key: 'instagram' },
    { href: 'https://facebook.com/gruponuamana', key: 'facebook' },
    { href: 'https://youtube.com/@gruponuamana', key: 'youtube' },
    { href: 'https://tiktok.com/@gruponuamana', key: 'tiktok' },
    { href: 'https://google.com/search?q=Guías+y+Scouts+Nua+Mana', key: 'google' },
    { href: 'mailto:contacto@nuamana.cl', key: 'email' },
    { href: 'https://wa.me/56966896001', key: 'whatsapp' },
  ] as const,
  sede_nombre: 'Sede San José',
  direccion: 'San José de la Estrella 1004<br/>La Granja, Santiago, Chile',
  maps_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.382796811922!2d-70.6096195!3d-33.569409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662d0a6e457520d%3A0xc3892aa7fa7d74b!2sGuias%20y%20Scouts%20Nua%20Mana!5e0!3m2!1ses!2scl!4v1763171854990!5m2!1ses!2scl',
};

const NuaManaFooter = () => {
  const config = useSiteConfigSafe();
  const logoFooter = config?.branding.logo_footer ?? FALLBACK.logo_footer;
  const nombreGrupo = config?.branding.nombre_grupo ?? FALLBACK.nombre_grupo;
  const slogan = config?.branding.slogan ?? FALLBACK.slogan;
  const mision = config?.branding.mision ?? FALLBACK.mision;
  const copyright = config?.branding.copyright ?? FALLBACK.copyright;
  const motto = config?.branding.motto ?? FALLBACK.motto;
  const sedeNombre = config?.contact.sede_nombre ?? FALLBACK.sede_nombre;
  const direccion = config?.contact.direccion ?? FALLBACK.direccion;
  const mapsEmbed = config?.contact.maps_embed ?? FALLBACK.maps_embed;

  const socialLinks = [
    config?.social.instagram && { href: config.social.instagram, icon: IconoRRSSInstagram },
    config?.social.facebook && { href: config.social.facebook, icon: IconoRRSSFacebook },
    config?.social.youtube && { href: config.social.youtube, icon: IconoRRSSYoutube },
    config?.social.tiktok && { href: config.social.tiktok, icon: IconoRRSSTiktok },
    config?.social.google && { href: config.social.google, icon: IconoRRSSGoogle },
    config?.social.email && { href: config.social.email, icon: IconoRRSSEmail },
    config?.social.whatsapp && { href: config.social.whatsapp, icon: IconoRRSSWhatsApp },
  ].filter(Boolean) as { href: string; icon: React.ComponentType<{ className?: string }> }[];

  const direccionLines = direccion.split(/<br\s*\/?>/i);

  return (
    <footer className="bg-gradient-to-br from-white/30 via-clr5/20 to-clr7/40 dark:from-dclr1 dark:via-dclr5 dark:to-dclr7/20 text-clr5 dark:text-dclr2 py-16 px-6">
      <div className="max-w-[1080px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          
          {/* Brand Section */}
          <div className="hidden sm:block space-y-6 col-span-2">
            <div className="flex justify-center md:justify-start">
              <img
                src={logoFooter}
                alt="Logo Nua Mana"
                className="h-20 w-auto object-contain"
              />
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-xl text-center font-black uppercase font-(--inika) leading-none text-clr5 dark:text-dclr2">{nombreGrupo}</h4>
              <h5 className="text-lg text-center italic font-body text-clr7 dark:text-dclr8 font-bold mt-1">{slogan}</h5>
            </div>
            <p className="text-sm text-clr4/70 dark:text-dclr2 text-justify leading-relaxed font-body">
              {mision}
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-cenmter pt-4">
              {socialLinks.map((social, idx) => (
                <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-clr5 dark:bg-dclr1 text-white rounded-full hover:bg-clr7 hover:scale-110 transition-all shadow-md">
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-6 text-center md:text-left">
            <h4 className="text-lg font-black uppercase font-display tracking-widest text-clr7">Encuéntranos</h4>
            <div className="flex flex-col sm:flex-row items-center md:items-start">
              <div className="shrink-0">
                <Link href="#">
                </Link>
              </div>
              <div className="text-center sm:text-left">
                <Link href="#" className="block text-clr5 dark:text-dclr8 font-black font-display uppercase text-sm hover:text-clr7 transition-colors">
                  {sedeNombre}
                </Link>
                <p className="text-sm font-body mt-1 leading-relaxed">
                  {direccionLines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < direccionLines.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-lg h-48 dark:grayscale hover:grayscale-0 transition-all duration-500">
              <iframe
                src={mapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Units Section */}
          <div className="hidden lg:block space-y-6">
            <h4 className="text-lg font-black uppercase font-display tracking-widest text-clr7 text-center">Nuestras Unidades</h4>
            <div className="p-1">
              <UnitSlideShow />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-clr5/10 text-center space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-clr5 dark:text-dclr2">
            🅮 {new Date().getFullYear()} {copyright}
          </p>
          <p className="text-[0.8em] font-body dark:text-dclr8 uppercase tracking-widest">
            {motto}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default NuaManaFooter;
