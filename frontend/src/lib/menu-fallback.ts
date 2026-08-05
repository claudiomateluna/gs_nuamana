/**
 * Hardcoded Menu Fallback
 * Mirrors today's hardcoded sidebar (src/components/ui/menu.tsx) as pure data,
 * so an empty menu_items table renders exactly today's navigation.
 *
 * `icono` values are either iconos.tsx export names (icon string names, e.g.
 * 'IconoInicio', 'IconoBlog', 'IconoUnidades') or `/images/...` paths (the
 * unit badges). ui/menu.tsx (PR4b) resolves names via ICON_MAP/SPECIAL_ICONS
 * and renders paths as <img>.
 */

import type { MenuItemNode } from './menu-items.types';

function node(
  id: string,
  parentId: string | null,
  titulo: string,
  href: string | null,
  icono: string | null,
  orden: number,
  children: MenuItemNode[] = [],
): MenuItemNode {
  return {
    id,
    parent_id: parentId,
    titulo,
    href,
    icono,
    orden,
    visible: true,
    roles_permitidos: [], // empty = public (same semantics as the DB)
    children,
  };
}

export const HARDCODED_MENU_TREE: MenuItemNode[] = [
  node('menu-inicio', null, 'Inicio', '/', 'IconoInicio', 1),
  node('menu-acerca-de', null, 'Acerca de', null, 'IconoAcercaDe', 2, [
    node('menu-acerca-de-quienes-somos', 'menu-acerca-de', 'Quiénes Somos', '/acerca-de/quienes-somos', 'IconoAcercaDeQuienesSomos', 1),
    node('menu-acerca-de-nuestra-historia', 'menu-acerca-de', 'Nuestra Historia', '/acerca-de/nuestra-historia', 'IconoAcercaDeNuestraHistoria', 2),
    node('menu-acerca-de-mision-vision', 'menu-acerca-de', 'Misión y Visión', '/acerca-de/mision-y-vision', 'IconoAcercaDeMisionVision', 3),
    node('menu-acerca-de-nuestro-equipo', 'menu-acerca-de', 'Nuestro Equipo', '/acerca-de/nuestro-equipo', 'IconoAcercaDeNuestroEquipo', 4),
    node('menu-acerca-de-nuestros-apoderados', 'menu-acerca-de', 'Nuestros Apoderados', '/acerca-de/nuestros-apoderados', 'IconoAcercaDeNuestrosApoderados', 5),
    node('menu-acerca-de-institucion-patrocinante', 'menu-acerca-de', 'Institución Patrocinante', '/acerca-de/institucion-patrocinante', 'IconoAcercaDeInstitucionPatrocinante', 6),
  ]),
  node('menu-lo-que-hacemos', null, 'Lo que hacemos', null, 'IconoLoQueHacemos', 3, [
    node('menu-lqh-ley-y-promesa', 'menu-lo-que-hacemos', 'Ley y Promesa', '/lo-que-hacemos/ley-y-promesa', 'IconoLoQueHacemos', 1),
    node('menu-lqh-el-metodo-scout', 'menu-lo-que-hacemos', 'El Método Scout', '/lo-que-hacemos/el-metodo-scout', 'IconoLoQueHacemosMetodoScout', 2),
    node('menu-lqh-aprender-haciendo', 'menu-lo-que-hacemos', 'Aprender Haciendo', '/lo-que-hacemos/aprender-haciendo', 'IconoLoQueHacemosAprenderHaciendo', 3),
    node('menu-lqh-sistema-de-equipos', 'menu-lo-que-hacemos', 'Sistema de Equipos', '/lo-que-hacemos/sistema-de-equipos', 'IconoLoQueHacemosSistemaEquipos', 4),
    node('menu-lqh-vida-al-aire-libre', 'menu-lo-que-hacemos', 'Vida al Aire Libre', '/lo-que-hacemos/vida-al-aire-libre', 'IconoLoQueHacemosAireLibre', 5),
    node('menu-lqh-habilidades-y-tecnicas', 'menu-lo-que-hacemos', 'Habilidades y Técnicas', '/lo-que-hacemos/habilidades-y-tecnicas', 'IconoLoQueHacemosHabilidadesTecnicas', 6),
    node('menu-lqh-vida-reflexiva', 'menu-lo-que-hacemos', 'Vida Reflexiva', '/lo-que-hacemos/vida-reflexiva', 'IconoLoQueHacemosVidaReflexiva', 7),
    node('menu-lqh-programa-y-actividades', 'menu-lo-que-hacemos', 'Programa y Actividades', '/lo-que-hacemos/programa-y-actividades', 'IconoLoQueHacemosProgramasActividades', 8),
  ]),
  node('menu-blog', null, 'Blog', '/blog', 'IconoBlog', 4),
  node('menu-nuestras-unidades', null, 'Nuestras Unidades', null, 'IconoUnidades', 5, [
    node('menu-unidades-manada', 'menu-nuestras-unidades', 'Manada (Ahi Niho Vænga)', '/unidad/manada', '/images/logos/iconos_lobatos.svg', 1),
    node('menu-unidades-compania', 'menu-nuestras-unidades', 'Compañía (Põ Vui Vaikava)', '/unidad/compania', '/images/logos/iconos_guias.svg', 2),
    node('menu-unidades-tropa', 'menu-nuestras-unidades', "Tropa (A'ata)", '/unidad/tropa', '/images/logos/iconos_scouts.svg', 3),
    node('menu-unidades-avanzada', 'menu-nuestras-unidades', 'Avanzada (Rapahango)', '/unidad/avanzada', '/images/logos/iconos_pioneres.svg', 4),
    node('menu-unidades-clan', 'menu-nuestras-unidades', 'Clan (Ahu Akivi)', '/unidad/clan', '/images/logos/iconos_caminantes.svg', 5),
  ]),
];
