-- 1. Agregar columna motivo_rechazo a la tabla de comprobantes de recaudación
ALTER TABLE public.tesoreria_recaudaciones_comprobantes
ADD COLUMN IF NOT EXISTS motivo_rechazo text;

-- 2. Crear función para notificar al usuario sobre el resultado de su comprobante
CREATE OR REPLACE FUNCTION public.notify_comprobante_recaudacion_validado()
RETURNS TRIGGER AS $$
DECLARE
    recaudacion_nombre text;
BEGIN
    -- Solo actuar si el estado cambia a validado o rechazado
    IF OLD.estado IS DISTINCT FROM NEW.estado AND NEW.estado IN ('validado', 'rechazado') THEN
        SELECT nombre INTO recaudacion_nombre FROM public.tesoreria_recaudaciones WHERE id = NEW.recaudacion_id;
        
        INSERT INTO public.notificaciones (perfil_id, mensaje, tipo, link_url)
        VALUES (
            NEW.hecho_por, 
            'Tu comprobante de $' || to_char(NEW.monto, '999G999G999') || ' para "' || recaudacion_nombre || '" fue ' || 
            CASE WHEN NEW.estado = 'validado' THEN 'APROBADO.' ELSE 'RECHAZADO. Motivo: ' || COALESCE(NEW.motivo_rechazo, 'No especificado') END,
            'comprobante_resultado',
            '/dashboard'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Crear trigger para disparar la notificación al actualizar el comprobante
CREATE OR REPLACE TRIGGER trigger_comprobante_recaudacion_validado
    AFTER UPDATE ON public.tesoreria_recaudaciones_comprobantes
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_comprobante_recaudacion_validado();
