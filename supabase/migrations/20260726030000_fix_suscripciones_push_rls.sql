-- Migration: Crear la tabla suscripciones_push y otorgar políticas de seguridad RLS
CREATE TABLE IF NOT EXISTS public.suscripciones_push (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perfil_id UUID REFERENCES public.perfiles(id) ON DELETE CASCADE,
    endpoint TEXT UNIQUE NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.suscripciones_push ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir insercion anonima suscripciones_push" ON public.suscripciones_push;
CREATE POLICY "Permitir insercion anonima suscripciones_push"
  ON public.suscripciones_push
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
