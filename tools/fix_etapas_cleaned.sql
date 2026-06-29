-- ======================================================
-- RESTAURACIÓN DE ETAPAS Y CONFIGURACIÓN DE COLORES
-- ======================================================

DO $$
DECLARE
    u_manada INTEGER;
    u_compania INTEGER;
    u_tropa INTEGER;
    u_avanzada INTEGER;
    u_clan INTEGER;
BEGIN
    -- 1. Obtener IDs de las Unidades
    SELECT id INTO u_manada FROM public.unidades WHERE nombre = 'Manada' LIMIT 1;
    SELECT id INTO u_compania FROM public.unidades WHERE nombre = 'Compañía' LIMIT 1;
    SELECT id INTO u_tropa FROM public.unidades WHERE nombre = 'Tropa' LIMIT 1;
    SELECT id INTO u_avanzada FROM public.unidades WHERE nombre = 'Avanzada' LIMIT 1;
    SELECT id INTO u_clan FROM public.unidades WHERE nombre = 'Clan' LIMIT 1;

    -- =================================================
    -- 2. CONFIGURAR COLORES INSTITUCIONALES EN UNIDADES
    -- =================================================
    -- Manada: Amarillo Principal, Azul Marino Contraste
    UPDATE public.unidades
    SET colores = '{"primario": "#f5cd16", "secundario": "#2b2c77", "textoLight": "#ffffff", "textoDark": "#1a2a44"}'::jsonb
    WHERE id = u_manada;

    -- Compañía: Cian Principal, Amarillo Dorado Contraste
    UPDATE public.unidades
    SET colores = '{"primario": "#00b7dc", "secundario": "#e7a913", "textoLight": "#ffffff", "textoDark": "#083344"}'::jsonb
    WHERE id = u_compania;

    -- (Opcional) Dejar listos los colores de la Tropa (Verde / Rojo)
    UPDATE public.unidades
    SET colores = '{"primario": "#1e592d", "secundario": "#FFFFFF", "textoLight": "#ffffff", "textoDark": "#14532d"}'::jsonb
    WHERE nombre = 'Tropa';

    -- (Opcional) Dejar listos los colores de la Avanzada (Morado / Blanco)
    UPDATE public.unidades
    SET colores = '{"primario": "#4a3f8c", "secundario": "#FFFFFF", "textoLight": "#ffffff", "textoDark": "#14532d"}'::jsonb
    WHERE nombre = 'Avanzada';

    -- (Opcional) Dejar listos los colores de la Clan (Rojo / Amarillo)
    UPDATE public.unidades
    SET colores = '{"primario": "#e32328", "secundario": "#fac620", "textoLight": "#ffffff", "textoDark": "#14532d"}'::jsonb
    WHERE nombre = 'Clan';

    -- =================================================
    -- 3. RESTAURAR ETAPAS Y SUS IMÁGENES
    -- =================================================

    -- MANADA
    INSERT INTO public.progresion_etapas (unidad_id, nombre, orden, rango_edad, imagen_url) VALUES
    (u_manada, 'Lobezno', 1, 'Infancia Media', '/images/progresion/manada/etapa_lobezno.png'),
    (u_manada, 'Saltador', 2, 'Infancia Media', '/images/progresion/manada/etapa_saltador.png'),
    (u_manada, 'Diestro', 3, 'Infancia Tardía', '/images/progresion/manada/etapa_diestro.png'),
    (u_manada, 'Cazador', 4, 'Infancia Tardía', '/images/progresion/manada/etapa_cazador.png')
    ON CONFLICT (unidad_id, nombre) DO UPDATE
    SET imagen_url = EXCLUDED.imagen_url, orden = EXCLUDED.orden;

    -- COMPAÑÍA
    INSERT INTO public.progresion_etapas (unidad_id, nombre, orden, rango_edad, imagen_url) VALUES
    (u_compania, 'Alba', 1, '11 a 13 años', '/images/progresion/compania/etapa_alba.png'),
    (u_compania, 'Amanecer', 2, '11 a 13 años', '/images/progresion/compania/etapa_amanecer.png'),
    (u_compania, 'Luz', 3, '13 a 15 años', '/images/progresion/compania/etapa_luz.png'),
    (u_compania, 'Resplandor', 4, '13 a 15 años', '/images/progresion/compania/etapa_resplandor.png')
    ON CONFLICT (unidad_id, nombre) DO UPDATE
    SET imagen_url = EXCLUDED.imagen_url, orden = EXCLUDED.orden;

    -- TROPA
    INSERT INTO public.progresion_etapas (unidad_id, nombre, orden, rango_edad, imagen_url) VALUES
    (u_tropa, 'Cernícalo', 1, '11 a 13 años', '/images/progresion/tropa/etapa_cernicalo.png'),
    (u_tropa, 'Halcón', 2, '11 a 13 años', '/images/progresion/tropa/etapa_halcon.png'),
    (u_tropa, 'Águila', 3, '13 a 15 años', '/images/progresion/tropa/etapa_aguila.png'),
    (u_tropa, 'Cóndor', 4, '13 a 15 años', '/images/progresion/tropa/etapa_condor.png')
    ON CONFLICT (unidad_id, nombre) DO UPDATE
    SET imagen_url = EXCLUDED.imagen_url, orden = EXCLUDED.orden;

    -- AVANZADA
    INSERT INTO public.progresion_etapas (unidad_id, nombre, orden, rango_edad, imagen_url) VALUES
    (u_avanzada, 'Sendero', 1, '15 a 17 años', '/images/progresion/avanzada/etapa_sendero.png'),
    (u_avanzada, 'Cumbre', 2, '15 a 17 años', '/images/progresion/avanzada/etapa_cumbre.png')
    ON CONFLICT (unidad_id, nombre) DO UPDATE
    SET imagen_url = EXCLUDED.imagen_url, orden = EXCLUDED.orden;

    -- CLAN
    INSERT INTO public.progresion_etapas (unidad_id, nombre, orden, rango_edad, imagen_url) VALUES
    (u_clan, 'Fuego', 1, '17 a 20 años', '/images/progresion/clan/etapa_fuego.png'),
    (u_clan, 'Antorcha', 2, '17 a 20 años', '/images/progresion/clan/etapa_antorcha.png')
    ON CONFLICT (unidad_id, nombre) DO UPDATE
    SET imagen_url = EXCLUDED.imagen_url, orden = EXCLUDED.orden;

END $$;
