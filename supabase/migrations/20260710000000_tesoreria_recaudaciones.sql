-- 1. Crear tabla de recaudaciones
CREATE TABLE IF NOT EXISTS public.tesoreria_recaudaciones (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre text NOT NULL,
    fecha_inicio date NOT NULL,
    plazo_maximo date NOT NULL,
    unidad text NOT NULL CHECK (unidad IN ('Grupal', 'Manada', 'Compañía', 'Tropa', 'Avanzada', 'Clan')),
    creado_por uuid NOT NULL REFERENCES public.perfiles(id),
    estado text NOT NULL DEFAULT 'abierta' CHECK (estado IN ('abierta', 'completada')),
    monto_gastado integer DEFAULT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Crear tabla de comprobantes de recaudaciones
CREATE TABLE IF NOT EXISTS public.tesoreria_recaudaciones_comprobantes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    recaudacion_id uuid NOT NULL REFERENCES public.tesoreria_recaudaciones(id) ON DELETE CASCADE,
    monto integer NOT NULL,
    imagen_url text NOT NULL,
    fecha date NOT NULL DEFAULT CURRENT_DATE,
    hecho_por uuid NOT NULL REFERENCES public.perfiles(id),
    estado text NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'validado', 'rechazado')),
    validado_por uuid REFERENCES public.perfiles(id),
    created_at timestamp with time zone DEFAULT now()
);

-- 3. Crear tabla de unión para relacionar comprobantes con usuarios (NNJ/miembros pagados)
CREATE TABLE IF NOT EXISTS public.tesoreria_recaudaciones_comprobantes_usuarios (
    comprobante_id uuid NOT NULL REFERENCES public.tesoreria_recaudaciones_comprobantes(id) ON DELETE CASCADE,
    usuario_id uuid NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
    PRIMARY KEY (comprobante_id, usuario_id)
);

-- 4. Crear tabla de descuentos de recaudaciones por NNJ
CREATE TABLE IF NOT EXISTS public.tesoreria_recaudaciones_descuentos (
    recaudacion_id uuid NOT NULL REFERENCES public.tesoreria_recaudaciones(id) ON DELETE CASCADE,
    usuario_id uuid NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
    descuento integer NOT NULL DEFAULT 0,
    motivo text,
    registrado_por uuid NOT NULL REFERENCES public.perfiles(id),
    PRIMARY KEY (recaudacion_id, usuario_id)
);

-- 5. Habilitar RLS en todas las tablas
ALTER TABLE public.tesoreria_recaudaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tesoreria_recaudaciones_comprobantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tesoreria_recaudaciones_comprobantes_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tesoreria_recaudaciones_descuentos ENABLE ROW LEVEL SECURITY;

-- 6. Crear políticas RLS
DO $$
BEGIN
    -- Tabla: tesoreria_recaudaciones
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Lectura pública de recaudaciones' AND tablename = 'tesoreria_recaudaciones') THEN
        CREATE POLICY "Lectura pública de recaudaciones" ON public.tesoreria_recaudaciones
            FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Creación de recaudaciones para administración' AND tablename = 'tesoreria_recaudaciones') THEN
        CREATE POLICY "Creación de recaudaciones para administración" ON public.tesoreria_recaudaciones
            FOR INSERT WITH CHECK (((SELECT perfiles.rol_id FROM public.perfiles WHERE perfiles.id = auth.uid()) <= 5));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Edición de recaudaciones' AND tablename = 'tesoreria_recaudaciones') THEN
        CREATE POLICY "Edición de recaudaciones" ON public.tesoreria_recaudaciones
            FOR UPDATE USING (((SELECT perfiles.rol_id FROM public.perfiles WHERE perfiles.id = auth.uid()) <= 5));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Eliminación de recaudaciones' AND tablename = 'tesoreria_recaudaciones') THEN
        CREATE POLICY "Eliminación de recaudaciones" ON public.tesoreria_recaudaciones
            FOR DELETE USING (((SELECT perfiles.rol_id FROM public.perfiles WHERE perfiles.id = auth.uid()) <= 5));
    END IF;

    -- Tabla: tesoreria_recaudaciones_comprobantes
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Lectura de comprobantes propios o administración' AND tablename = 'tesoreria_recaudaciones_comprobantes') THEN
        CREATE POLICY "Lectura de comprobantes propios o administración" ON public.tesoreria_recaudaciones_comprobantes
            FOR SELECT USING ((hecho_por = auth.uid() OR ((SELECT perfiles.rol_id FROM public.perfiles WHERE perfiles.id = auth.uid()) <= 5)));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Subida de comprobantes para todos' AND tablename = 'tesoreria_recaudaciones_comprobantes') THEN
        CREATE POLICY "Subida de comprobantes para todos" ON public.tesoreria_recaudaciones_comprobantes
            FOR INSERT WITH CHECK ((hecho_por = auth.uid()));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Validación de comprobantes' AND tablename = 'tesoreria_recaudaciones_comprobantes') THEN
        CREATE POLICY "Validación de comprobantes" ON public.tesoreria_recaudaciones_comprobantes
            FOR UPDATE USING (((SELECT perfiles.rol_id FROM public.perfiles WHERE perfiles.id = auth.uid()) <= 5));
    END IF;

    -- Tabla: tesoreria_recaudaciones_comprobantes_usuarios
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Lectura de relaciones de comprobante' AND tablename = 'tesoreria_recaudaciones_comprobantes_usuarios') THEN
        CREATE POLICY "Lectura de relaciones de comprobante" ON public.tesoreria_recaudaciones_comprobantes_usuarios
            FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Inserción de relaciones de comprobante' AND tablename = 'tesoreria_recaudaciones_comprobantes_usuarios') THEN
        CREATE POLICY "Inserción de relaciones de comprobante" ON public.tesoreria_recaudaciones_comprobantes_usuarios
            FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Edición de relaciones de comprobante por administración' AND tablename = 'tesoreria_recaudaciones_comprobantes_usuarios') THEN
        CREATE POLICY "Edición de relaciones de comprobante por administración" ON public.tesoreria_recaudaciones_comprobantes_usuarios
            FOR ALL USING (((SELECT perfiles.rol_id FROM public.perfiles WHERE perfiles.id = auth.uid()) <= 5));
    END IF;

    -- Tabla: tesoreria_recaudaciones_descuentos
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Lectura de descuentos' AND tablename = 'tesoreria_recaudaciones_descuentos') THEN
        CREATE POLICY "Lectura de descuentos" ON public.tesoreria_recaudaciones_descuentos
            FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Gestión de descuentos por administración' AND tablename = 'tesoreria_recaudaciones_descuentos') THEN
        CREATE POLICY "Gestión de descuentos por administración" ON public.tesoreria_recaudaciones_descuentos
            FOR ALL USING (((SELECT perfiles.rol_id FROM public.perfiles WHERE perfiles.id = auth.uid()) <= 5));
    END IF;
END
$$;

-- 7. Crear bucket de storage para comprobantes
INSERT INTO storage.buckets (id, name, public)
VALUES ('comprobantes_recaudacion', 'comprobantes_recaudacion', false)
ON CONFLICT (id) DO NOTHING;

-- Crear políticas de storage para el bucket 'comprobantes_recaudacion'
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Acceso de subida de comprobantes' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Acceso de subida de comprobantes" ON storage.objects
            FOR INSERT WITH CHECK ((bucket_id = 'comprobantes_recaudacion' AND auth.role() = 'authenticated'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Lectura de comprobantes para dueños y administración' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Lectura de comprobantes para dueños y administración" ON storage.objects
            FOR SELECT USING (
                bucket_id = 'comprobantes_recaudacion' AND (
                    owner = auth.uid() OR 
                    ((SELECT perfiles.rol_id FROM public.perfiles WHERE perfiles.id = auth.uid()) <= 5)
                )
            );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Eliminación de comprobantes por administración' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Eliminación de comprobantes por administración" ON storage.objects
            FOR DELETE USING (
                bucket_id = 'comprobantes_recaudacion' AND 
                ((SELECT perfiles.rol_id FROM public.perfiles WHERE perfiles.id = auth.uid()) <= 5)
            );
    END IF;
END
$$;

-- 8. Funciones y Triggers para Notificaciones Automáticas

-- Función 8.1: Notificación de nueva recaudación creada
CREATE OR REPLACE FUNCTION public.notify_recaudacion_creada()
RETURNS TRIGGER AS $$
BEGIN
    -- Notificar a todos los apoderados (rol_id = 8) y directiva (rol_id IN (4,5,6,7))
    INSERT INTO public.notificaciones (perfil_id, mensaje, tipo, link_url)
    SELECT id, 'Se ha creado la recaudación: ' || NEW.nombre || '. Plazo máximo: ' || to_char(NEW.plazo_maximo, 'DD-MM-YYYY') || '.', 'recaudacion_nueva', '/dashboard'
    FROM public.perfiles
    WHERE rol_id IN (4, 5, 6, 7, 8);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger 8.1: Lanza la notificación tras crear la recaudación
CREATE OR REPLACE TRIGGER trigger_recaudacion_creada
    AFTER INSERT ON public.tesoreria_recaudaciones
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_recaudacion_creada();

-- Función 8.2: Notificación de comprobante de recaudación cargado
CREATE OR REPLACE FUNCTION public.notify_comprobante_recaudacion_cargado()
RETURNS TRIGGER AS $$
DECLARE
    recaudacion_nombre text;
    uploader_nombre text;
BEGIN
    -- Obtener nombre de la recaudación
    SELECT nombre INTO recaudacion_nombre FROM public.tesoreria_recaudaciones WHERE id = NEW.recaudacion_id;
    -- Obtener nombre del uploader
    SELECT nombres || ' ' || apellidos INTO uploader_nombre FROM public.perfiles WHERE id = NEW.hecho_por;

    -- Notificar a admin, dirigentes, guiadoras, presidente y tesorera (rol_id <= 5)
    INSERT INTO public.notificaciones (perfil_id, mensaje, tipo, link_url)
    SELECT id, uploader_nombre || ' cargó un comprobante de $' || to_char(NEW.monto, '999G999G999') || ' para "' || recaudacion_nombre || '".', 'comprobante_nuevo', '/dashboard'
    FROM public.perfiles
    WHERE rol_id <= 5;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger 8.2: Lanza la notificación tras subir un comprobante
CREATE OR REPLACE TRIGGER trigger_comprobante_recaudacion_cargado
    AFTER INSERT ON public.tesoreria_recaudaciones_comprobantes
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_comprobante_recaudacion_cargado();
