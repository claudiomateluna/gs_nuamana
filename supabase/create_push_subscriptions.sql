-- 1. Crear tabla para almacenar las suscripciones push de cada usuario
CREATE TABLE IF NOT EXISTS public.suscripciones_push (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    perfil_id uuid REFERENCES public.perfiles(id) ON DELETE CASCADE,
    endpoint text UNIQUE NOT NULL,
    p256dh text NOT NULL,
    auth text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.suscripciones_push ENABLE ROW LEVEL SECURITY;

-- 2. Políticas de Seguridad (RLS) para suscripciones_push
DROP POLICY IF EXISTS "Suscripciones push manage policy" ON public.suscripciones_push;
CREATE POLICY "Suscripciones push manage policy" 
    ON public.suscripciones_push
    FOR ALL
    TO authenticated
    USING (perfil_id = auth.uid())
    WITH CHECK (perfil_id = auth.uid());

-- 3. Asegurar que pg_net está instalado
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 4. Crear la función del trigger para disparar la petición HTTP al Webhook de Next.js
CREATE OR REPLACE FUNCTION public.send_push_notification_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Hacemos un HTTP POST asíncrono usando pg_net
  -- Enviamos la notificación a la ruta de Next.js que la procesará y enviará mediante Web Push
  PERFORM net.http_post(
    url := 'https://nuamana.cl/api/push/send-webhook',
    headers := '{"Content-Type": "application/json", "x-webhook-secret": "nua-mana-secret-push-token-2026"}'::jsonb,
    body := json_build_object(
      'perfil_id', NEW.perfil_id,
      'titulo', NEW.titulo,
      'contenido', NEW.contenido,
      'accion_url', COALESCE(NEW.accion_url, '')
    )::jsonb
  );
  
  RETURN NEW;
END;
$$;

-- 5. Crear el trigger en la tabla 'notificaciones'
DROP TRIGGER IF EXISTS trigger_send_push ON public.notificaciones;
CREATE TRIGGER trigger_send_push
AFTER INSERT ON public.notificaciones
FOR EACH ROW
EXECUTE FUNCTION public.send_push_notification_trigger();
