/**
 * Content types for paginas_contenido table
 */

export interface PaginaContenido {
  id: string;
  categoria: string;
  slug: string;
  titulo: string;
  descripcion: string | null;
  imagen: string | null;
  contenido: string | null;
  formato: 'markdown' | 'html';
  icono: string | null;
  orden: number;
  visible: boolean;
  es_padre: boolean;
  menu_item_id: string | null;
  created_at: string;
}
