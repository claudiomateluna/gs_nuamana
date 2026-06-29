-- Sistema Completo de Notificaciones Automatizadas (Triggers de Base de Datos)
-- 20260627010000_comprehensive_notifications.sql

-- =========================================================================
-- 1. REGISTRO DE CUENTA (CREACIÓN)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.notificar_nuevo_registro()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_leader record;
BEGIN
  -- 1. Notificar al Administrador (Rol 1)
  FOR v_leader IN SELECT id FROM perfiles WHERE rol_id = 1 LOOP
    INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
    VALUES (
      v_leader.id,
      'Nueva cuenta registrada pendiente de activación: ' || NEW.nombres || ' ' || NEW.apellidos || ' (Rol: ' || COALESCE((SELECT name FROM public.roles WHERE id = NEW.rol_id), 'Sin Rol') || ')',
      'sistema'
    );
  END LOOP;

  -- 2. Notificar a los Dirigentes/Guiadoras (Rol 2, 3) de la unidad
  IF NEW.unidad_id IS NOT NULL THEN
    FOR v_leader IN SELECT id FROM perfiles WHERE rol_id IN (2, 3) AND unidad_id = NEW.unidad_id LOOP
      INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
      VALUES (
        v_leader.id,
        'Nueva cuenta registrada pendiente de activación en tu unidad: ' || NEW.nombres || ' ' || NEW.apellidos || ' (Rol: ' || COALESCE((SELECT name FROM public.roles WHERE id = NEW.rol_id), 'Sin Rol') || ')',
        'sistema'
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_notificar_nuevo_registro ON public.perfiles;
CREATE TRIGGER trigger_notificar_nuevo_registro
  AFTER INSERT ON public.perfiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notificar_nuevo_registro();


-- =========================================================================
-- 2. EDICIÓN DE FICHA DE PERFIL
-- =========================================================================
CREATE OR REPLACE FUNCTION public.notificar_cambio_perfil()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_leader record;
  v_actor_name text;
BEGIN
  -- Solo actuar si hubo cambios reales en datos personales importantes
  IF (OLD.nombres IS DISTINCT FROM NEW.nombres OR
      OLD.apellidos IS DISTINCT FROM NEW.apellidos OR
      OLD.rol_id IS DISTINCT FROM NEW.rol_id OR
      OLD.unidad_id IS DISTINCT FROM NEW.unidad_id OR
      OLD.telefono IS DISTINCT FROM NEW.telefono OR
      OLD.direccion IS DISTINCT FROM NEW.direccion OR
      OLD.estado IS DISTINCT FROM NEW.estado) THEN
      
    -- Obtener nombre de quien realiza el cambio
    SELECT COALESCE(nombres || ' ' || apellidos, 'Un administrador') INTO v_actor_name FROM perfiles WHERE id = auth.uid();

    -- 1. Notificar al propio usuario modificado (si el cambio no lo hizo él mismo)
    IF NEW.id != COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid) THEN
      INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
      VALUES (NEW.id, 'Tu información de perfil ha sido actualizada por ' || v_actor_name || '.', 'sistema');
    END IF;

    -- 2. Notificar al Administrador (Rol 1)
    FOR v_leader IN SELECT id FROM perfiles WHERE rol_id = 1 AND id != COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid) LOOP
      INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
      VALUES (v_leader.id, 'Se ha actualizado la ficha de ' || NEW.nombres || ' ' || NEW.apellidos || ' (por ' || v_actor_name || ').', 'sistema');
    END LOOP;

    -- 3. Notificar a los Dirigentes/Guiadoras (Rol 2, 3) de la unidad del usuario
    IF NEW.unidad_id IS NOT NULL THEN
      FOR v_leader IN SELECT id FROM perfiles WHERE rol_id IN (2, 3) AND unidad_id = NEW.unidad_id AND id != COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid) LOOP
        INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
        VALUES (v_leader.id, 'Se ha actualizado la ficha de ' || NEW.nombres || ' ' || NEW.apellidos || ' en tu unidad (por ' || v_actor_name || ').', 'sistema');
      END LOOP;
    END IF;

    -- 4. Notificar al Apoderado del usuario (si tiene)
    IF NEW.apoderado_id IS NOT NULL AND NEW.apoderado_id != COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid) THEN
      INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
      VALUES (NEW.apoderado_id, 'Se ha actualizado la ficha de tu pupilo/a ' || NEW.nombres || ' ' || NEW.apellidos || ' (por ' || v_actor_name || ').', 'sistema');
    END IF;
    
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_notificar_cambio_perfil ON public.perfiles;
CREATE TRIGGER trigger_notificar_cambio_perfil
  AFTER UPDATE ON public.perfiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notificar_cambio_perfil();


-- =========================================================================
-- 3. CREACIÓN DE AUTORIZACIÓN
-- =========================================================================
CREATE OR REPLACE FUNCTION public.notificar_nueva_autorizacion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_leader record;
  v_nnj record;
BEGIN
  -- Obtener info del NNJ y su apoderado
  SELECT nombres, apellidos, unidad_id, apoderado_id INTO v_nnj FROM perfiles WHERE id = NEW.perfil_id;

  -- 1. Notificar al Administrador (Rol 1)
  FOR v_leader IN SELECT id FROM perfiles WHERE rol_id = 1 LOOP
    INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
    VALUES (v_leader.id, 'Nueva autorización creada para ' || v_nnj.nombres || ' ' || v_nnj.apellidos || '.', 'sistema');
  END LOOP;

  -- 2. Notificar a los Dirigentes/Guiadoras (Rol 2, 3) de la unidad
  IF v_nnj.unidad_id IS NOT NULL THEN
    FOR v_leader IN SELECT id FROM perfiles WHERE rol_id IN (2, 3) AND unidad_id = v_nnj.unidad_id LOOP
      INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
      VALUES (v_leader.id, 'Nueva autorización creada para ' || v_nnj.nombres || ' ' || v_nnj.apellidos || ' en tu unidad.', 'sistema');
    END LOOP;
  END IF;

  -- 3. Notificar al Apoderado
  IF v_nnj.apoderado_id IS NOT NULL THEN
    INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
    VALUES (v_nnj.apoderado_id, 'Se ha generado una nueva autorización de actividad para tu pupilo/a ' || v_nnj.nombres || ' ' || v_nnj.apellidos || '.', 'sistema');
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_notificar_nueva_autorizacion ON public.autorizaciones_actividades;
CREATE TRIGGER trigger_notificar_nueva_autorizacion
  AFTER INSERT ON public.autorizaciones_actividades
  FOR EACH ROW
  EXECUTE FUNCTION public.notificar_nueva_autorizacion();


-- =========================================================================
-- 6. COMPLETACIÓN DE FIRMAS DE ACTA
-- =========================================================================
CREATE OR REPLACE FUNCTION public.verificar_firmas_completas()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pendientes int;
  v_participante record;
  v_acta record;
BEGIN
  -- Solo actuar si se marcó como firmado
  IF NEW.firmado = true AND (OLD.firmado = false OR OLD.firmado IS NULL) THEN
    -- Contar cuántas firmas faltan para esta acta
    SELECT COUNT(*) INTO v_pendientes 
    FROM public.acta_firmas 
    WHERE acta_id = NEW.acta_id AND firmado = false;
    
    -- Si ya no quedan firmas pendientes
    IF v_pendientes = 0 THEN
      SELECT codigo, tipo, fecha INTO v_acta FROM public.actas WHERE id = NEW.acta_id;
      
      -- Notificar a todos los asistentes
      FOR v_participante IN SELECT perfil_id FROM public.acta_participantes WHERE acta_id = NEW.acta_id LOOP
        INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
        VALUES (
          v_participante.perfil_id,
          'Se han completado todas las firmas para el acta ' || v_acta.codigo || ' (' || v_acta.tipo || ') del ' || to_char(v_acta.fecha, 'DD/MM/YYYY') || '.',
          'sistema'
        );
      END LOOP;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_verificar_firmas_completas ON public.acta_firmas;
CREATE TRIGGER trigger_verificar_firmas_completas
  AFTER UPDATE ON public.acta_firmas
  FOR EACH ROW
  EXECUTE FUNCTION public.verificar_firmas_completas();


-- =========================================================================
-- 8. TESORERÍA (MOVIMIENTOS Y COMPROBANTES/VALES)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.notificar_movimiento_tesoreria()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_leader record;
  v_mensaje text;
BEGIN
  v_mensaje := 'Se ha registrado un nuevo movimiento de tesorería: "' || NEW.descripcion || '"' || 
               CASE WHEN NEW.monto_ingreso > 0 THEN ' (Ingreso: $' || NEW.monto_ingreso || ')' ELSE '' END ||
               CASE WHEN NEW.monto_egreso > 0 THEN ' (Egreso: $' || NEW.monto_egreso || ')' ELSE '' END || '.';

  -- Notificar a todos los roles 1, 2, 3, 4, 5 (Admin, Dirigente, Guiadora, Presidente, Tesorera)
  FOR v_leader IN SELECT id FROM perfiles WHERE rol_id IN (1, 2, 3, 4, 5) LOOP
    INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
    VALUES (v_leader.id, v_mensaje, 'tesoreria');
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_notificar_movimiento_tesoreria ON public.tesoreria_movimientos;
CREATE TRIGGER trigger_notificar_movimiento_tesoreria
  AFTER INSERT ON public.tesoreria_movimientos
  FOR EACH ROW
  EXECUTE FUNCTION public.notificar_movimiento_tesoreria();

-- Comprobantes / Vales
CREATE OR REPLACE FUNCTION public.notificar_comprobante_tesoreria()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_leader record;
  v_mensaje text;
BEGIN
  v_mensaje := 'Se ha emitido un vale/comprobante de tesorería (' || NEW.tipo || ') Folio: ' || NEW.folio || ' para ' || NEW.pagado_recibido_nombre || '.';

  -- Notificar a todos los roles 1, 2, 3, 4, 5
  FOR v_leader IN SELECT id FROM perfiles WHERE rol_id IN (1, 2, 3, 4, 5) LOOP
    INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
    VALUES (v_leader.id, v_mensaje, 'tesoreria');
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_notificar_comprobante_tesoreria ON public.tesoreria_comprobantes;
CREATE TRIGGER trigger_notificar_comprobante_tesoreria
  AFTER INSERT ON public.tesoreria_comprobantes
  FOR EACH ROW
  EXECUTE FUNCTION public.notificar_comprobante_tesoreria();


-- =========================================================================
-- 9. CICLOS DE UNIDAD (CREACIÓN Y AVANCE DE FASE)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.notificar_cambio_ciclo()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_miembro record;
  v_mensaje text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_mensaje := 'Se ha iniciado un nuevo ciclo de aventuras en tu unidad: "' || NEW.nombre || '".';
  ELSIF TG_OP = 'UPDATE' AND OLD.fase_actual IS DISTINCT FROM NEW.fase_actual THEN
    v_mensaje := 'El ciclo de aventuras "' || NEW.nombre || '" de tu unidad ha avanzado a la fase: ' || NEW.fase_actual || '.';
  END IF;

  IF v_mensaje IS NOT NULL AND NEW.unidad_id IS NOT NULL THEN
    FOR v_miembro IN SELECT id FROM perfiles WHERE unidad_id = NEW.unidad_id LOOP
      INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
      VALUES (v_miembro.id, v_mensaje, 'sistema');
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_notificar_cambio_ciclo ON public.ciclos_unidad;
CREATE TRIGGER trigger_notificar_cambio_ciclo
  AFTER INSERT OR UPDATE ON public.ciclos_unidad
  FOR EACH ROW
  EXECUTE FUNCTION public.notificar_cambio_ciclo();


-- =========================================================================
-- 10 & 11. ARTÍCULOS DE BITÁCORA (CREACIÓN, EDICIÓN, ELIMINACIÓN Y REVISIÓN)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.notificar_cambio_articulo()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor record;
  v_leader record;
  v_mensaje text;
  v_actor_name text;
BEGIN
  -- Obtener nombre del que realiza la acción
  SELECT nombres, apellidos INTO v_actor FROM perfiles WHERE id = auth.uid();
  IF v_actor IS NOT NULL THEN
    v_actor_name := v_actor.nombres || ' ' || v_actor.apellidos;
  ELSE
    v_actor_name := 'Un miembro';
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.estado = 'revision' THEN
      v_mensaje := 'El artículo "' || NEW.titulo || '" requiere revisión para ser publicado (creado por ' || v_actor_name || ').';
    ELSE
      v_mensaje := v_actor_name || ' ha creado el artículo "' || NEW.titulo || '".';
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.estado IS DISTINCT FROM NEW.estado AND NEW.estado = 'revision' THEN
      v_mensaje := 'El artículo "' || NEW.titulo || '" requiere revisión para ser publicado (editado por ' || v_actor_name || ').';
    ELSE
      v_mensaje := v_actor_name || ' ha editado el artículo "' || NEW.titulo || '".';
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    v_mensaje := v_actor_name || ' ha eliminado el artículo "' || OLD.titulo || '".';
  END IF;

  -- Notificar a todos los roles 1, 2, 3
  FOR v_leader IN SELECT id FROM perfiles WHERE rol_id IN (1, 2, 3) AND id != COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid) LOOP
    INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
    VALUES (v_leader.id, v_mensaje, 'sistema');
  END LOOP;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS trigger_notificar_cambio_articulo ON public.articulos;
CREATE TRIGGER trigger_notificar_cambio_articulo
  AFTER INSERT OR UPDATE OR DELETE ON public.articulos
  FOR EACH ROW
  EXECUTE FUNCTION public.notificar_cambio_articulo();


-- =========================================================================
-- 12. HISTORIA EN BITÁCORA DE UNIDAD (MOWHA/TALLY)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.notificar_nueva_bitacora()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_miembro record;
BEGIN
  IF NEW.unidad_id IS NOT NULL THEN
    FOR v_miembro IN SELECT id FROM perfiles WHERE unidad_id = NEW.unidad_id LOOP
      INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
      VALUES (v_miembro.id, 'Se ha registrado una nueva historia en la bitácora de tu unidad: "' || NEW.titulo || '".', 'sistema');
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_notificar_nueva_bitacora ON public.bitacoras_unidad;
CREATE TRIGGER trigger_notificar_nueva_bitacora
  AFTER INSERT ON public.bitacoras_unidad
  FOR EACH ROW
  EXECUTE FUNCTION public.notificar_nueva_bitacora();


-- =========================================================================
-- 13. PROGRESIÓN (AVANCES E HITOS)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.notificar_cambio_progresion_avance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nnj record;
  v_leader record;
  v_mensaje text;
BEGIN
  -- Solo actuar si el estado o el valor_dirigente/apoderado cambiaron
  IF (TG_OP = 'INSERT') OR 
     (OLD.estado IS DISTINCT FROM NEW.estado OR 
      OLD.valor_dirigente IS DISTINCT FROM NEW.valor_dirigente OR
      OLD.valor_apoderado IS DISTINCT FROM NEW.valor_apoderado) THEN
      
    SELECT nombres, apellidos, unidad_id, apoderado_id INTO v_nnj FROM perfiles WHERE id = NEW.perfil_id;
    
    v_mensaje := 'Avance de progresión de ' || v_nnj.nombres || ' ' || v_nnj.apellidos || ': Objetivo ' || 
                 COALESCE((SELECT codigo FROM public.progresion_objetivos WHERE id = NEW.objetivo_id), 'Objetivo') || ' se encuentra "' || NEW.estado || '".';

    -- 1. Notificar al propio NNJ (si la acción la hizo otro)
    IF NEW.perfil_id != COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid) THEN
      INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
      VALUES (NEW.perfil_id, v_mensaje, 'progresion');
    END IF;

    -- 2. Notificar al Apoderado
    IF v_nnj.apoderado_id IS NOT NULL AND v_nnj.apoderado_id != COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid) THEN
      INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
      VALUES (v_nnj.apoderado_id, v_mensaje, 'progresion');
    END IF;

    -- 3. Notificar a los Dirigentes/Guiadoras (Rol 2, 3) de la unidad
    IF v_nnj.unidad_id IS NOT NULL THEN
      FOR v_leader IN SELECT id FROM perfiles WHERE rol_id IN (2, 3) AND unidad_id = v_nnj.unidad_id AND id != COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid) LOOP
        INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
        VALUES (v_leader.id, v_mensaje, 'progresion');
      END LOOP;
    END IF;

  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_notificar_cambio_progresion_avance ON public.progresion_avance;
CREATE TRIGGER trigger_notificar_cambio_progresion_avance
  AFTER INSERT OR UPDATE ON public.progresion_avance
  FOR EACH ROW
  EXECUTE FUNCTION public.notificar_cambio_progresion_avance();

-- Hitos de Progresión
CREATE OR REPLACE FUNCTION public.notificar_cambio_progresion_hito()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nnj record;
  v_leader record;
  v_mensaje text;
BEGIN
  SELECT nombres, apellidos, unidad_id, apoderado_id INTO v_nnj FROM perfiles WHERE id = NEW.perfil_id;
  
  v_mensaje := 'Hito de progresión alcanzado por ' || v_nnj.nombres || ' ' || v_nnj.apellidos || ': "' || NEW.nombre_hito || '".';

  -- 1. Notificar al propio NNJ
  IF NEW.perfil_id != COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid) THEN
    INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
    VALUES (NEW.perfil_id, v_mensaje, 'progresion');
  END IF;

  -- 2. Notificar al Apoderado
  IF v_nnj.apoderado_id IS NOT NULL AND v_nnj.apoderado_id != COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid) THEN
    INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
    VALUES (v_nnj.apoderado_id, v_mensaje, 'progresion');
  END IF;

  -- 3. Notificar a los Dirigentes/Guiadoras (Rol 2, 3) de la unidad
  IF v_nnj.unidad_id IS NOT NULL THEN
    FOR v_leader IN SELECT id FROM perfiles WHERE rol_id IN (2, 3) AND unidad_id = v_nnj.unidad_id AND id != COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid) LOOP
      INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
      VALUES (v_leader.id, v_mensaje, 'progresion');
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_notificar_cambio_progresion_hito ON public.progresion_hitos;
CREATE TRIGGER trigger_notificar_cambio_progresion_hito
  AFTER INSERT ON public.progresion_hitos
  FOR EACH ROW
  EXECUTE FUNCTION public.notificar_cambio_progresion_hito();


-- =========================================================================
-- 14. INVENTARIO
-- =========================================================================
CREATE OR REPLACE FUNCTION public.notificar_cambio_inventario()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_leader record;
  v_mensaje text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_mensaje := 'Se ha agregado un nuevo ítem al inventario: "' || NEW.nombre || '" (Cantidad: ' || NEW.cantidad || ').';
  ELSIF TG_OP = 'UPDATE' THEN
    v_mensaje := 'Se ha modificado el ítem de inventario "' || NEW.nombre || '": Estado: ' || NEW.estado || ', Cantidad: ' || NEW.cantidad || '.';
  ELSIF TG_OP = 'DELETE' THEN
    v_mensaje := 'Se ha eliminado el ítem de inventario: "' || OLD.nombre || '".';
  END IF;

  -- Notificar a todos los roles 1, 2, 3
  FOR v_leader IN SELECT id FROM perfiles WHERE rol_id IN (1, 2, 3) AND id != COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid) LOOP
    INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
    VALUES (v_leader.id, v_mensaje, 'sistema');
  END LOOP;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS trigger_notificar_cambio_inventario ON public.inventario;
CREATE TRIGGER trigger_notificar_cambio_inventario
  AFTER INSERT OR UPDATE OR DELETE ON public.inventario
  FOR EACH ROW
  EXECUTE FUNCTION public.notificar_cambio_inventario();
