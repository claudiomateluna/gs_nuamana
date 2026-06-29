-- Add logo_unidad_url and logo_rama_url columns to public.unidades table
ALTER TABLE public.unidades ADD COLUMN IF NOT EXISTS logo_unidad_url TEXT;
ALTER TABLE public.unidades ADD COLUMN IF NOT EXISTS logo_rama_url TEXT;

-- Update existing units with their logos
UPDATE public.unidades SET 
    logo_unidad_url = '/images/logos/iconos_UnidadesManada.webp', 
    logo_rama_url = '/images/logos/iconos_lobatos.svg'
WHERE nombre = 'Manada';

UPDATE public.unidades SET 
    logo_unidad_url = '/images/logos/iconos_UnidadesCia.webp', 
    logo_rama_url = '/images/logos/iconos_guias.svg'
WHERE nombre = 'Compañía';

UPDATE public.unidades SET 
    logo_unidad_url = '/images/logos/iconos_UnidadesTropa.webp', 
    logo_rama_url = '/images/logos/iconos_scouts.svg'
WHERE nombre = 'Tropa';

UPDATE public.unidades SET 
    logo_unidad_url = '/images/logos/iconos_UnidadesAvanzada.webp', 
    logo_rama_url = '/images/logos/iconos_pioneres.svg'
WHERE nombre = 'Avanzada';

UPDATE public.unidades SET 
    logo_unidad_url = '/images/logos/iconos_UnidadesClan.webp', 
    logo_rama_url = '/images/logos/iconos_caminantes.svg'
WHERE nombre = 'Clan';
