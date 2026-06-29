-- ======================================================
-- SISTEMA DE NOTIFICACIONES AUTOMATIZADAS (CORREGIDO)
-- Versión compatible con el esquema actual
-- ======================================================

-- 1. Asegurar tabla de notificaciones
CREATE TABLE IF NOT EXISTS public.notificaciones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    perfil_id UUID REFERENCES public.perfiles(id) ON DELETE CASCADE,
    titulo VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo VARCHAR(50), -- 'progresion', 'inventario', 'tesoreria', 'perfil'
    leido BOOLEAN DEFAULT FALSE,
    link VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar RLS en Notificaciones
ALTER TABLE public.notificaciones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuarios pueden ver sus propias notificaciones" ON public.notificaciones;
CREATE POLICY "Usuarios pueden ver sus propias notificaciones" ON public.notificaciones
FOR SELECT USING (auth.uid() = perfil_id);

DROP POLICY IF EXISTS "Sistema puede insertar notificaciones" ON public.notificaciones;
CREATE POLICY "Sistema puede insertar notificaciones" ON public.notificaciones
FOR INSERT WITH CHECK (true);

-- 3. FUNCIÓN GENÉRICA PARA CREAR NOTIFICACIONES
CREATE OR REPLACE FUNCTION public.crear_notificacion(p_id UUID, tit TEXT, msg TEXT, t_tipo TEXT, lnk TEXT DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.notificaciones (perfil_id, titulo, mensaje, tipo, link)
    VALUES (p_id, tit, msg, t_tipo, lnk);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. GESTIÓN DE NOTIFICACIONES DE PROGRESIÓN
CREATE OR REPLACE FUNCTION public.fn_notificar_progresion()
RETURNS TRIGGER AS $$
DECLARE
    v_nombres_nnj TEXT;
    v_apoderado_id UUID;
    v_unidad_id INTEGER;
    v_obj_texto TEXT;
BEGIN
    SELECT nombres, apoderado_id, unidad_id INTO v_nombres_nnj, v_apoderado_id, v_unidad_id 
    FROM public.perfiles WHERE id = NEW.perfil_id;
    
    SELECT texto_infantil INTO v_obj_texto 
    FROM public.progresion_objetivos WHERE id = NEW.objetivo_id;

    IF (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.estado = 'pendiente')) AND NEW.estado = 'en_proceso' THEN
        IF v_apoderado_id IS NOT NULL THEN
            PERFORM public.crear_notificacion(v_apoderado_id, 'Avance de Progresión', v_nombres_nnj || ' marcó como realizado: "' || v_obj_texto || '".', 'progresion');
        END IF;
        INSERT INTO public.notificaciones (perfil_id, titulo, mensaje, tipo)
        SELECT id, 'Nueva Autoevaluación', v_nombres_nnj || ' espera validación en: "' || v_obj_texto || '".', 'progresion'
        FROM public.perfiles WHERE unidad_id = v_unidad_id AND rol_id IN (2,3);
    END IF;

    IF (TG_OP = 'UPDATE' AND NEW.comentario_apoderado IS DISTINCT FROM OLD.comentario_apoderado) THEN
        INSERT INTO public.notificaciones (perfil_id, titulo, mensaje, tipo)
        SELECT id, 'Observación de Familia', 'El apoderado de ' || v_nombres_nnj || ' comentó una huella.', 'progresion'
        FROM public.perfiles WHERE unidad_id = v_unidad_id AND rol_id IN (2,3);
    END IF;

    IF (TG_OP = 'UPDATE' AND OLD.estado != 'logrado' AND NEW.estado = 'logrado') THEN
        PERFORM public.crear_notificacion(NEW.perfil_id, '¡Huella Lograda!', 'Tu dirigente validó el objetivo: "' || v_obj_texto || '". ¡Felicidades!', 'progresion');
        IF v_apoderado_id IS NOT NULL THEN
            PERFORM public.crear_notificacion(v_apoderado_id, 'Objetivo Validado', 'El dirigente aprobó el avance de ' || v_nombres_nnj || ' en: "' || v_obj_texto || '".', 'progresion');
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_notificar_progresion ON public.progresion_avance;
CREATE TRIGGER tr_notificar_progresion
AFTER INSERT OR UPDATE ON public.progresion_avance
FOR EACH ROW EXECUTE FUNCTION public.fn_notificar_progresion();

-- 5. GESTIÓN DE PERFILES (EDICIÓN)
CREATE OR REPLACE FUNCTION public.fn_notificar_perfil_update()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.* IS DISTINCT FROM NEW.*) THEN
        PERFORM public.crear_notificacion(NEW.id, 'Perfil Actualizado', 'Tu información de perfil ha sido modificada.', 'perfil');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_notificar_perfil_update ON public.perfiles;
CREATE TRIGGER tr_notificar_perfil_update
AFTER UPDATE ON public.perfiles
FOR EACH ROW EXECUTE FUNCTION public.fn_notificar_perfil_update();

-- 6. PERMISOS DE COMUNIDAD (CORREGIDO PARA DASHUSUARIOS)
-- Permitir a todos los autenticados LEER perfiles (necesario para el buscador)
-- (Ya existen políticas restrictivas para INSERT/UPDATE/DELETE)
DROP POLICY IF EXISTS "Todos pueden ver perfiles básicos" ON public.perfiles;
CREATE POLICY "Todos pueden ver perfiles básicos" ON public.perfiles
FOR SELECT USING (auth.role() = 'authenticated');
