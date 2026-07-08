-- Corregir la función del trigger para usar los nombres de columnas reales de la tabla 'notificaciones'
-- Campos reales: 'mensaje' (en lugar de contenido) y 'link_url' (en lugar de accion_url)
CREATE OR REPLACE FUNCTION public.send_push_notification_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Hacer la petición HTTP POST asíncrona a nuestra API de Next.js
  PERFORM net.http_post(
    url := 'https://nuamana.cl/api/push/send-webhook',
    headers := '{"Content-Type": "application/json", "x-webhook-secret": "nua-mana-secret-push-token-2026"}'::jsonb,
    body := json_build_object(
      'perfil_id', NEW.perfil_id,
      'titulo', 'Nua Mana',
      'contenido', NEW.mensaje,                 -- Nombre de columna correcto: mensaje
      'accion_url', COALESCE(NEW.link_url, '')  -- Nombre de columna correcto: link_url
    )::jsonb
  );
  
  RETURN NEW;
END;
$$;
