

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."es_apoderado_de"("apoderado_uuid" "uuid", "pupilo_uuid" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.perfiles 
        WHERE id = pupilo_uuid AND apoderado_id = apoderado_uuid
    );
END;
$$;


ALTER FUNCTION "public"."es_apoderado_de"("apoderado_uuid" "uuid", "pupilo_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."es_staff"() RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM perfiles 
    WHERE id = auth.uid() AND rol_id IN (1, 2, 3)
  );
$$;


ALTER FUNCTION "public"."es_staff"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_my_rol"() RETURNS integer
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT rol_id FROM perfiles WHERE id = auth.uid();
$$;


ALTER FUNCTION "public"."get_my_rol"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notificar_nuevo_pendiente"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Solo actuar si el estado es 'pendiente'
    IF NEW.estado = 'pendiente' THEN
        INSERT INTO public.notificaciones (perfil_id, mensaje, tipo)
        VALUES (
            NEW.id, 
            'Nuevo registro pendiente de validación: ' || NEW.nombres || ' ' || NEW.apellidos || ' (Rol: ' || 
            (SELECT name FROM public.roles WHERE id = NEW.rol_id) || ')',
            'sistema'
        );
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."notificar_nuevo_pendiente"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."puede_crear_tipo_acta"("tipo_acta" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_rol_id int;
BEGIN
  SELECT rol_id INTO v_rol_id FROM public.perfiles WHERE id = auth.uid();
  IF v_rol_id IN (1, 2, 3) THEN RETURN TRUE; END IF;
  IF v_rol_id IN (9, 10, 11, 12, 13) AND tipo_acta = 'Consejo de Unidad' THEN RETURN TRUE; END IF;
  IF v_rol_id IN (4, 5, 6, 7) AND tipo_acta IN ('Comité de Padres', 'Comite de Padres', 'Reunión de Apoderados', 'Reunion de Apoderados', 'Consejo de Grupo') THEN RETURN TRUE; END IF;
  RETURN FALSE;
END;
$$;


ALTER FUNCTION "public"."puede_crear_tipo_acta"("tipo_acta" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."puede_ver_acta"("acta_uuid" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Regla 1: Staff (Admin, Dirigente, Guiadora) ven todo
  IF EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol_id IN (1, 2, 3)) THEN
    RETURN TRUE;
  END IF;

  -- Regla 2: Participantes ven su acta
  IF EXISTS (SELECT 1 FROM acta_participantes WHERE acta_id = acta_uuid AND perfil_id = auth.uid()) THEN
    RETURN TRUE;
  END IF;

  -- Regla 3: Nivel de confidencialidad
  RETURN EXISTS (
    SELECT 1 FROM actas a
    WHERE a.id = acta_uuid
    AND (
      a.confidencialidad = 'Pública'
      OR (a.confidencialidad = 'Pública Interna' AND EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol_id = 8))
    )
  );
END;
$$;


ALTER FUNCTION "public"."puede_ver_acta"("acta_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."puede_ver_acta_v2"("acta_id_param" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_rol_id int;
  v_unidad_id int;
  v_acta record;
  v_asistencia text;
BEGIN
  -- Obtener datos del usuario
  SELECT rol_id, unidad_id INTO v_rol_id, v_unidad_id FROM perfiles WHERE id = v_user_id;
  
  -- Obtener datos del acta
  SELECT * INTO v_acta FROM actas WHERE id = acta_id_param;
  IF NOT FOUND THEN RETURN FALSE; END IF;

  -- Obtener asistencia del usuario en esta acta
  SELECT asistencia INTO v_asistencia FROM acta_participantes WHERE acta_id = acta_id_param AND perfil_id = v_user_id;

  -- REGLA DE ORO: Admin ve todo. Confidencialidad "Pública" es para todos.
  IF v_rol_id = 1 OR v_acta.confidencialidad = 'Pública' THEN RETURN TRUE; END IF;

  -- REGLAS POR CONFIDENCIALIDAD
  -- Confidencial: Solo Presente o Remoto
  IF v_acta.confidencialidad = 'Confidencial' THEN
    RETURN v_asistencia IN ('Presente', 'Remoto');
  END IF;

  -- Restringida: Cualquier estado de asistencia (excepto No Invitado o NULL)
  IF v_acta.confidencialidad = 'Restringida' THEN
    RETURN v_asistencia IN ('Presente', 'Remoto', 'Ausente', 'Justificado');
  END IF;

  -- Pública Interna: Según el tipo de reunión y rol
  IF v_acta.confidencialidad = 'Pública Interna' THEN
    CASE v_acta.tipo
      WHEN 'Consejo de Unidad' THEN
        RETURN v_unidad_id = v_acta.unidad_id OR v_rol_id IN (2,3); -- Miembros unidad o dirigentes
      WHEN 'Reunión de Sábado' THEN
        RETURN v_rol_id IN (2, 3); -- Solo dirigentes/guiadoras
      WHEN 'Comité de Padres' THEN
        RETURN v_rol_id IN (2, 3, 4, 5, 6, 7);
      WHEN 'Reunión de Apoderados' THEN
        RETURN v_rol_id IN (2, 3, 4, 5, 6, 7, 8);
      WHEN 'Consejo de Grupo' THEN
        RETURN TRUE; -- Visible para todos (NNJ, Apoderados, Staff) según tu regla
      ELSE
        RETURN FALSE;
    END CASE;
  END IF;

  RETURN FALSE;
END;
$$;


ALTER FUNCTION "public"."puede_ver_acta_v2"("acta_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."verificar_automatizaciones_inventario"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Regla 1: Marcar como Baja si caducó (Alimentos)
  UPDATE public.inventario 
  SET estado = 'Baja/Perdido'
  WHERE fecha_caducidad < CURRENT_DATE 
  AND estado != 'Baja/Perdido';

  -- Regla 2: Desactivar garantía si ya pasó la fecha
  UPDATE public.inventario
  SET tiene_garantia = FALSE
  WHERE tiene_garantia = TRUE 
  AND fecha_garantia < CURRENT_DATE;
END;
$$;


ALTER FUNCTION "public"."verificar_automatizaciones_inventario"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."verificar_caducidad_inventario"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE public.inventario 
  SET estado = 'Baja/Perdido'
  WHERE fecha_caducidad < CURRENT_DATE 
  AND estado != 'Baja/Perdido';
END;
$$;


ALTER FUNCTION "public"."verificar_caducidad_inventario"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."acta_acuerdos" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "acta_id" "uuid",
    "titulo" character varying(255) NOT NULL,
    "descripcion" "text",
    "responsable_id" "uuid",
    "fecha_compromiso" "date",
    "prioridad" character varying(20),
    "estado" character varying(20) DEFAULT 'Abierta'::character varying,
    "evidencia_url" "text",
    "dependencias" "jsonb" DEFAULT '[]'::"jsonb",
    "es_actividad_grupal" boolean DEFAULT false
);


ALTER TABLE "public"."acta_acuerdos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."acta_adjuntos" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "acta_id" "uuid",
    "nombre" character varying(255) NOT NULL,
    "tipo" character varying(50),
    "url" "text" NOT NULL,
    "hash" "text",
    "subido_por" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."acta_adjuntos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."acta_firmas" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "acta_id" "uuid",
    "perfil_id" "uuid",
    "firmado" boolean DEFAULT false,
    "fecha_firma" timestamp with time zone
);


ALTER TABLE "public"."acta_firmas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."acta_participantes" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "acta_id" "uuid",
    "perfil_id" "uuid",
    "rol_en_reunion" character varying(50),
    "asistencia" character varying(20)
);


ALTER TABLE "public"."acta_participantes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."acta_temas" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "acta_id" "uuid",
    "orden" integer,
    "titulo" character varying(255),
    "descripcion" "text",
    "conclusiones" "text",
    "duracion_estimada" integer,
    "duracion_real" integer
);


ALTER TABLE "public"."acta_temas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."actas" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "codigo" character varying(20) NOT NULL,
    "tipo" character varying(50) NOT NULL,
    "fecha" "date" NOT NULL,
    "estado" character varying(20) DEFAULT 'Borrador'::character varying,
    "confidencialidad" character varying(20) DEFAULT 'Pública Interna'::character varying,
    "resumen" "text",
    "unidad_id" integer,
    "ingresado_por" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "proxima_reunion" "date",
    "observaciones_finales" "text"
);


ALTER TABLE "public"."actas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."actividades_programadas" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "tipo" character varying(50) NOT NULL,
    "nombre" character varying(255) NOT NULL,
    "lugar" character varying(255) NOT NULL,
    "fecha_inicio" "date" NOT NULL,
    "fecha_fin" "date" NOT NULL,
    "unidad_id" integer,
    "creado_por" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."actividades_programadas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."acuerdo_historial" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "acuerdo_id" "uuid",
    "cambio" "text" NOT NULL,
    "valor_anterior" "text",
    "valor_nuevo" "text",
    "cambiado_por" "uuid",
    "cambiado_en" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."acuerdo_historial" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."agendas_personales" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "perfil_id" "uuid" NOT NULL,
    "quien_soy" "text",
    "vision_futuro" "text",
    "etapa_progresion" character varying(30) DEFAULT 'ninguna'::character varying NOT NULL,
    "fecha_fuego" "date",
    "fecha_antorcha" "date",
    "fecha_partida" "date",
    "compromiso_texto" "text",
    "fecha_compromiso" "date",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "como_me_visualizo" "text",
    "que_hago_hoy" "text",
    CONSTRAINT "agendas_personales_etapa_progresion_check" CHECK ((("etapa_progresion")::"text" = ANY ((ARRAY['ninguna'::character varying, 'fuego'::character varying, 'antorcha'::character varying, 'partida'::character varying])::"text"[])))
);


ALTER TABLE "public"."agendas_personales" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."articulo_categorias" (
    "id" integer NOT NULL,
    "articulo_id" "uuid",
    "categoria_id" integer
);


ALTER TABLE "public"."articulo_categorias" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."articulo_categorias_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."articulo_categorias_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."articulo_categorias_id_seq" OWNED BY "public"."articulo_categorias"."id";



CREATE TABLE IF NOT EXISTS "public"."articulo_resenas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "articulo_id" "uuid",
    "perfil_id" "uuid",
    "calificacion" integer,
    "comentario" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "es_anonimo" boolean DEFAULT false,
    "edad_resena" integer,
    "unidad_resena" "text",
    "unidad_color_resena" "text",
    "unidad_logo_resena" "text",
    CONSTRAINT "articulo_resenas_calificacion_check" CHECK ((("calificacion" >= 1) AND ("calificacion" <= 7)))
);


ALTER TABLE "public"."articulo_resenas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."articulos" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "autor_id" "uuid",
    "categoria_id" integer,
    "titulo" character varying(255) NOT NULL,
    "slug" character varying(255) NOT NULL,
    "contenido" "text",
    "extracto" "text",
    "imagen_destacada" "text",
    "estado" character varying(20) DEFAULT 'borrador'::character varying,
    "seo_titulo" character varying(255),
    "seo_descripcion" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "etiquetas" "text"[] DEFAULT '{}'::"text"[]
);


ALTER TABLE "public"."articulos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."asistencia_actividades" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "propuesta_id" "uuid",
    "perfil_id" "uuid",
    "asistio" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."asistencia_actividades" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."autorizaciones_actividades" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "perfil_id" "uuid",
    "actividad_nombre" character varying(255) NOT NULL,
    "lugar" character varying(255) NOT NULL,
    "fecha_inicio" "date" NOT NULL,
    "fecha_fin" "date" NOT NULL,
    "tipo_formulario" character varying(50),
    "firmado_por_id" "uuid",
    "nombre_firmante" character varying(255) NOT NULL,
    "rut_firmante" character varying(15) NOT NULL,
    "firma_digital_b64" "text" NOT NULL,
    "fecha_firma" timestamp with time zone DEFAULT "now"(),
    "estado" character varying(50) DEFAULT 'Vigente'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "actividad_id" "uuid"
);


ALTER TABLE "public"."autorizaciones_actividades" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bitacoras_unidad" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "unidad_id" integer,
    "autor_id" "uuid",
    "titulo" character varying(255) NOT NULL,
    "historia" "text" NOT NULL,
    "imagenes" "jsonb" DEFAULT '[]'::"jsonb",
    "fecha_suceso" "date" DEFAULT CURRENT_DATE NOT NULL,
    "excluir_dirigentes" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bitacoras_unidad" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."categorias" (
    "id" integer NOT NULL,
    "nombre" character varying(100) NOT NULL,
    "slug" character varying(100) NOT NULL,
    "parent_id" integer,
    "descripcion" "text"
);


ALTER TABLE "public"."categorias" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."categorias_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."categorias_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."categorias_id_seq" OWNED BY "public"."categorias"."id";



CREATE TABLE IF NOT EXISTS "public"."ceremonia_mensajes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "ceremonia_id" "uuid" NOT NULL,
    "remitente_id" "uuid" NOT NULL,
    "mensaje" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."ceremonia_mensajes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ceremonias" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "perfil_id" "uuid" NOT NULL,
    "tipo" character varying NOT NULL,
    "nombre_hito" character varying NOT NULL,
    "campamento" character varying,
    "lugar" character varying,
    "fecha" "date" NOT NULL,
    "foto_url" character varying,
    "radar_snapshot" "jsonb",
    "padrino_id" "uuid",
    "madrina_id" "uuid",
    "unidad_origen_id" integer,
    "unidad_destino_id" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."ceremonias" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ciclo_propuestas" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "ciclo_id" "uuid",
    "autor_id" "uuid",
    "titulo" character varying(200) NOT NULL,
    "descripcion" "text",
    "evaluacion" "text",
    "seleccionada" boolean DEFAULT false NOT NULL,
    "fecha_programada" "date",
    "articulo_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "preseleccionada" boolean DEFAULT false
);


ALTER TABLE "public"."ciclo_propuestas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ciclo_votos" (
    "propuesta_id" "uuid" NOT NULL,
    "perfil_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "cantidad" integer DEFAULT 1
);


ALTER TABLE "public"."ciclo_votos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ciclos_unidad" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "nombre" character varying(100) NOT NULL,
    "enfasis" "text",
    "diagnostico" "text",
    "fecha_fin" timestamp with time zone,
    "unidad_id" integer,
    "creado_por" "uuid",
    "fase_actual" integer DEFAULT 1 NOT NULL,
    "estado" character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    "evaluacion_general" "text",
    "evaluacion_enfasis" "text",
    "articulo_juego_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "votos_totales_por_persona" integer DEFAULT 1,
    "votos_max_por_propuesta" integer DEFAULT 1,
    "votos_ilimitados" boolean DEFAULT false
);


ALTER TABLE "public"."ciclos_unidad" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contactos_emergencia" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "perfil_id" "uuid",
    "nombre" character varying(100) NOT NULL,
    "relacion" character varying(50) NOT NULL,
    "telefono" character varying(20) NOT NULL
);


ALTER TABLE "public"."contactos_emergencia" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."especialidades_actividades" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "especialidad_personal_id" "uuid",
    "descripcion" "text" NOT NULL,
    "completada" boolean DEFAULT false NOT NULL,
    "fecha_completado" "date",
    "evidencia_texto" "text",
    "evidencia_url" "text",
    "comentario_monitor" "text",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "detalles" "text",
    "articulo_id" "uuid",
    "actividad_programada_id" "uuid",
    "fecha_limite" "date",
    "autoevaluacion" "text"
);


ALTER TABLE "public"."especialidades_actividades" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."especialidades_definiciones" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "unidad_id" integer,
    "campo_interes" character varying(50) NOT NULL,
    "nombre" character varying(100) NOT NULL,
    "descripcion" "text",
    "imagen_sugerida_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."especialidades_definiciones" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."especialidades_personales" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "perfil_id" "uuid",
    "definicion_id" "uuid",
    "nombre_personalizado" character varying(100),
    "campo_interes" character varying(50) NOT NULL,
    "fase" character varying(25) DEFAULT 'exploracion'::character varying NOT NULL,
    "meta_general" "text" NOT NULL,
    "diagnostico_previo" "text",
    "monitor_nombre" character varying(100),
    "monitor_perfil_id" "uuid",
    "fecha_inicio" "date" DEFAULT CURRENT_DATE,
    "fecha_fin" "date",
    "estado" character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "evaluacion_final" "text",
    "objetivo_cumplido" boolean DEFAULT false,
    "fecha_entrega" "date",
    "aprobado_monitor" boolean DEFAULT false,
    "comentario_monitor" "text",
    "firma_monitor_b64" "text",
    "firma_dirigente_b64" "text"
);


ALTER TABLE "public"."especialidades_personales" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."evaluacion_objetivos" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "perfil_id" "uuid",
    "evaluador_id" "uuid",
    "propuesta_id" "uuid",
    "area" character varying(50) NOT NULL,
    "objetivo_texto" "text" NOT NULL,
    "valor" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "evaluacion_objetivos_valor_check" CHECK ((("valor" >= 1) AND ("valor" <= 8)))
);


ALTER TABLE "public"."evaluacion_objetivos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."inventario" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "unidad_id" integer,
    "nombre" character varying(255) NOT NULL,
    "cantidad" integer DEFAULT 1,
    "estado" character varying(50),
    "responsable_id" "uuid",
    "ultima_revision" timestamp with time zone DEFAULT "now"(),
    "descripcion" "text",
    "categoria" character varying(50) DEFAULT 'Otros'::character varying,
    "ubicacion" character varying(255),
    "fecha_caducidad" "date",
    "imagen_url" "text",
    "condicion" character varying(50) DEFAULT 'Funcional'::character varying,
    "origen" character varying(50),
    "fecha_adquisicion" "date",
    "tiene_garantia" boolean DEFAULT false,
    "fecha_garantia" "date"
);


ALTER TABLE "public"."inventario" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notificaciones" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "perfil_id" "uuid",
    "mensaje" "text" NOT NULL,
    "leido" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "tipo" character varying(50) DEFAULT 'sistema'::character varying,
    "link_url" "text"
);


ALTER TABLE "public"."notificaciones" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."perfiles" (
    "id" "uuid" NOT NULL,
    "rol_id" integer,
    "unidad_id" integer,
    "nombres" character varying(100) NOT NULL,
    "apellidos" character varying(100) NOT NULL,
    "rut" character varying(12) NOT NULL,
    "telefono" character varying(20),
    "fecha_nacimiento" "date" NOT NULL,
    "direccion" "text" NOT NULL,
    "comuna" character varying(50) NOT NULL,
    "sexo" character varying(20) NOT NULL,
    "religion" character varying(100) NOT NULL,
    "pertenece_grupo_nua_mana" boolean DEFAULT true,
    "colegio" character varying(100),
    "nivel_educacional" character varying(50),
    "nombre_apoderado_contacto" character varying(100),
    "relacion_apoderado_contacto" character varying(50),
    "telefono_apoderado_contacto" character varying(20),
    "sistema_salud" character varying(50),
    "detalle_sistema_salud" "text",
    "tipo_sangre" character varying(10),
    "alergias" "text",
    "antecedentes_medicos" "text",
    "tratamientos_medicos" "text",
    "medicamentos" "text",
    "dieta_alimentaria" "jsonb",
    "autoriza_fotos" boolean DEFAULT false,
    "fe_publica" boolean DEFAULT false,
    "apoderado_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "estado" character varying(20) DEFAULT 'pendiente'::character varying,
    "email" character varying(255),
    "nacionalidad" character varying(100),
    "nombre_social" character varying(100),
    "nombre_grupo" character varying(255) DEFAULT 'Guías y Scouts Nua Mana'::character varying,
    "zona" character varying(100) DEFAULT 'La Florida'::character varying,
    "distrito" character varying(100) DEFAULT 'Mapurayen'::character varying,
    "seguro_complementario" boolean DEFAULT false,
    "nombre_seguro_complementario" "text",
    "tiene_alergias" boolean DEFAULT false,
    "tiene_intolerancia" boolean DEFAULT false,
    "describe_intolerancia" "text",
    "enfermedades_cronicas_json" "jsonb" DEFAULT '[]'::"jsonb",
    "progresion_etapa_id" integer
);


ALTER TABLE "public"."perfiles" OWNER TO "postgres";


COMMENT ON COLUMN "public"."perfiles"."estado" IS 'Valores posibles: activo, pendiente, rechazado. Seguridad por defecto en pendiente.';



COMMENT ON COLUMN "public"."perfiles"."email" IS 'Copia del correo real del usuario o apoderado para facilitar consultas en la intranet.';



COMMENT ON COLUMN "public"."perfiles"."progresion_etapa_id" IS 'ID de la etapa de progresión asignada manualmente por el dirigente.';



CREATE TABLE IF NOT EXISTS "public"."perfiles_ficha_medica" (
    "perfil_id" "uuid" NOT NULL,
    "estatura_m" numeric(4,2),
    "peso_kg" numeric(5,2),
    "asma" boolean DEFAULT false,
    "diabetes" boolean DEFAULT false,
    "hipertension" boolean DEFAULT false,
    "epilepsia" boolean DEFAULT false,
    "enfermedad_renal" boolean DEFAULT false,
    "alteraciones_sanguineas" boolean DEFAULT false,
    "enfermedad_autoinmune" boolean DEFAULT false,
    "patologia_cardiaca" boolean DEFAULT false,
    "hipo_hipertiroidismo" boolean DEFAULT false,
    "otras_cronicas" "text",
    "diagnostico_salud_mental" boolean DEFAULT false,
    "detalle_salud_mental" "text",
    "tratamiento_salud_mental" boolean DEFAULT false,
    "profesional_tratante_contacto" "text",
    "hospitalizaciones_previas" "text",
    "cirugias_previas" "text",
    "malestares_recientes" "text",
    "tratamiento_reciente" "text",
    "vacunas_al_dia" boolean DEFAULT true,
    "vacunas_extra" "text",
    "viajes_extranjero" "text",
    "menstruaciones" boolean DEFAULT false,
    "ciclo_regular" boolean DEFAULT false,
    "dismenorrea" boolean DEFAULT false,
    "medicamento_colicos" "text",
    "metodo_anticonceptivo" "text",
    "embarazo" boolean DEFAULT false,
    "ultimo_control_dental" "date",
    "tratamiento_dental_curso" boolean DEFAULT false,
    "necesidades_especiales" "text",
    "intereses_disfrute" "text",
    "situaciones_estres" "text",
    "conductas_previas_desregulacion" "text",
    "estrategias_calma" "text",
    "apoyo_comunicacion" "text",
    "dificultades_sensoriales" "text",
    "ayuda_organizacion" "text",
    "otras_necesidades" "text",
    "observaciones_adicionales" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "tiene_seguro_complementario" boolean DEFAULT false,
    "intolerancia_alimentaria" "text",
    "medicamentos_detalle" "text",
    "salud_mental_diagnostico" "text",
    "salud_mental_tratamiento" boolean DEFAULT false,
    "salud_mental_medicamentos" "text",
    "salud_mental_profesional" character varying(255),
    "salud_mental_contacto" character varying(50),
    "lista_hospitalizaciones" "jsonb" DEFAULT '[]'::"jsonb",
    "lista_cirugias" "jsonb" DEFAULT '[]'::"jsonb",
    "reciente_fiebre" boolean DEFAULT false,
    "reciente_diarrea" boolean DEFAULT false,
    "reciente_vomitos" boolean DEFAULT false,
    "reciente_erupciones" boolean DEFAULT false,
    "reciente_tos" boolean DEFAULT false,
    "reciente_otros" "text",
    "contacto_infecto" boolean DEFAULT false,
    "contacto_infecto_detalle" "text",
    "vacunas_covid" integer DEFAULT 0,
    "vacunas_observaciones" "text",
    "presenta_diagnostico_relevante" boolean DEFAULT false,
    "diagnostico_relevante_detalle" "text",
    "contacto_profesional_tratante" "text",
    "inicio_tratamiento_reciente" "date",
    "medicamentos_malestar" "text",
    "pais_viaje" "text",
    "fecha_viaje" "date",
    "vacuna_viaje" "text",
    "semanas_embarazo" integer,
    "fecha_ultimo_control_embarazo" "date",
    "especifique_tratamiento_dental" "text"
);


ALTER TABLE "public"."perfiles_ficha_medica" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."progresion_areas" (
    "id" integer NOT NULL,
    "nombre" character varying(50) NOT NULL,
    "color" character varying(20),
    "icono" character varying(50),
    "descripcion" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."progresion_areas" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."progresion_areas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."progresion_areas_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."progresion_areas_id_seq" OWNED BY "public"."progresion_areas"."id";



CREATE TABLE IF NOT EXISTS "public"."progresion_avance" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "perfil_id" "uuid",
    "objetivo_id" "uuid",
    "estado" character varying(20) DEFAULT 'pendiente'::character varying,
    "fecha_logro" timestamp with time zone,
    "validado_por" "uuid",
    "comentarios" "text",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "comentario_apoderado" "text",
    "fecha_comentario_apoderado" timestamp with time zone,
    "valor" integer,
    "valor_dirigente" integer,
    "valor_apoderado" integer,
    CONSTRAINT "progresion_avance_valor_apoderado_check" CHECK ((("valor_apoderado" >= 1) AND ("valor_apoderado" <= 8))),
    CONSTRAINT "progresion_avance_valor_check" CHECK ((("valor" >= 1) AND ("valor" <= 8))),
    CONSTRAINT "progresion_avance_valor_dirigente_check" CHECK ((("valor_dirigente" >= 1) AND ("valor_dirigente" <= 8)))
);


ALTER TABLE "public"."progresion_avance" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."progresion_etapas" (
    "id" integer NOT NULL,
    "unidad_id" integer,
    "nombre" character varying(50) NOT NULL,
    "orden" integer NOT NULL,
    "rango_edad" character varying(50),
    "color_etapa" character varying(20),
    "descripcion" "text",
    "imagen_url" "text"
);


ALTER TABLE "public"."progresion_etapas" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."progresion_etapas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."progresion_etapas_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."progresion_etapas_id_seq" OWNED BY "public"."progresion_etapas"."id";



CREATE TABLE IF NOT EXISTS "public"."progresion_hitos" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "perfil_id" "uuid",
    "nombre_hito" character varying(100) NOT NULL,
    "fecha_entrega" "date",
    "tipo" character varying(50),
    "entregado_por" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."progresion_hitos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."progresion_objetivos" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "area_id" integer,
    "unidad_id" integer,
    "etapa_id" integer,
    "rango_edad" character varying(50),
    "texto_infantil" "text" NOT NULL,
    "texto_terminal" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."progresion_objetivos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."proyecto_objetivos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "agenda_id" "uuid",
    "proyecto_id" "uuid",
    "objetivo_id" "uuid" NOT NULL,
    "meta_personal" "text",
    "estado" character varying(30) DEFAULT 'pendiente'::character varying NOT NULL,
    "evidencia_texto" "text",
    "evidencia_url" "text",
    "evaluacion_lider" "text",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "proyecto_objetivos_estado_check" CHECK ((("estado")::"text" = ANY ((ARRAY['pendiente'::character varying, 'en_progreso'::character varying, 'alcanzado'::character varying])::"text"[])))
);


ALTER TABLE "public"."proyecto_objetivos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."proyecto_participantes" (
    "proyecto_id" "uuid" NOT NULL,
    "perfil_id" "uuid" NOT NULL,
    "rol_en_proyecto" character varying(100) DEFAULT 'participante'::character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "tarea_asignada" "text"
);


ALTER TABLE "public"."proyecto_participantes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."proyectos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "unidad_id" integer NOT NULL,
    "perfil_id" "uuid",
    "es_grupal" boolean DEFAULT true NOT NULL,
    "titulo" character varying(200) NOT NULL,
    "campo_prioritario" character varying(50),
    "fase" character varying(30) DEFAULT 'seleccion'::character varying NOT NULL,
    "fecha_inicio" "date",
    "fecha_fin" "date",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "paso1_que_haremos" "text",
    "paso2_por_que" "text",
    "paso3_para_que" "text",
    "paso4_para_quienes" "text",
    "paso5_donde" "text",
    "paso6_como_lo_haremos" "text",
    "paso7_cuales_actividades" "text",
    "paso8_cuando_cronograma" "text",
    "paso9_quienes_equipo" "text",
    "paso10_cuanto_presupuesto" "text",
    "paso11_con_que_financiamiento" "text",
    "paso12_como_lo_hicimos" "text",
    "paso2_por_que_diagnostico" "text",
    "paso2_por_que_justificacion" "text",
    "paso3_para_que_general" "text",
    "paso3_para_que_especificos" "text",
    "participantes_manuales" "jsonb" DEFAULT '[]'::"jsonb",
    "competencias_asociadas" "jsonb" DEFAULT '[]'::"jsonb",
    CONSTRAINT "proyectos_campo_prioritario_check" CHECK ((("campo_prioritario")::"text" = ANY ((ARRAY['servicio'::character varying, 'naturaleza'::character varying, 'trabajo'::character varying, 'viaje'::character varying])::"text"[]))),
    CONSTRAINT "proyectos_fase_check" CHECK ((("fase")::"text" = ANY ((ARRAY['seleccion'::character varying, 'preparacion'::character varying, 'ejecucion'::character varying, 'evaluacion'::character varying, 'completado'::character varying])::"text"[])))
);


ALTER TABLE "public"."proyectos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."roles" (
    "id" integer NOT NULL,
    "name" character varying(50) NOT NULL
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."roles_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."roles_id_seq" OWNED BY "public"."roles"."id";



CREATE TABLE IF NOT EXISTS "public"."solicitudes_competencias" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "perfil_id" "uuid" NOT NULL,
    "proyecto_id" "uuid",
    "area_competencia" character varying(50) NOT NULL,
    "justificacion_nnj" "text" NOT NULL,
    "evidencia_url" "text",
    "estado" character varying(30) DEFAULT 'pendiente'::character varying NOT NULL,
    "evaluacion_lider" "text",
    "aprobado_por" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "solicitudes_competencias_area_competencia_check" CHECK ((("area_competencia")::"text" = ANY ((ARRAY['cultura'::character varying, 'actividad_fisica'::character varying, 'trabajo_equipo'::character varying, 'innovacion'::character varying, 'comunicacion'::character varying, 'ciudadania'::character varying, 'medioambiente'::character varying])::"text"[]))),
    CONSTRAINT "solicitudes_competencias_estado_check" CHECK ((("estado")::"text" = ANY ((ARRAY['pendiente'::character varying, 'aprobada'::character varying, 'solicitud_cambio'::character varying, 'rechazada'::character varying])::"text"[])))
);


ALTER TABLE "public"."solicitudes_competencias" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tesoreria_comprobante_detalles" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "comprobante_id" "uuid",
    "item_id" integer,
    "descripcion" "text",
    "valor" integer DEFAULT 0
);


ALTER TABLE "public"."tesoreria_comprobante_detalles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tesoreria_comprobantes" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "folio" integer NOT NULL,
    "tipo" character varying(20) NOT NULL,
    "pagado_recibido_nombre" character varying(255) NOT NULL,
    "suma_palabras" "text" NOT NULL,
    "fecha" "date" DEFAULT CURRENT_DATE,
    "forma_pago" character varying(50),
    "numero_documento" character varying(100),
    "unidad_id" integer,
    "hecho_por" "uuid",
    "visto_bueno_por" "uuid",
    "estado" character varying(50) DEFAULT 'Pendiente'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tesoreria_comprobantes" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."tesoreria_comprobantes_folio_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."tesoreria_comprobantes_folio_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."tesoreria_comprobantes_folio_seq" OWNED BY "public"."tesoreria_comprobantes"."folio";



CREATE TABLE IF NOT EXISTS "public"."tesoreria_items" (
    "id" integer NOT NULL,
    "codigo" character varying(20),
    "nombre" character varying(255) NOT NULL,
    "tipo" character varying(50),
    "categoria" character varying(100)
);


ALTER TABLE "public"."tesoreria_items" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."tesoreria_items_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."tesoreria_items_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."tesoreria_items_id_seq" OWNED BY "public"."tesoreria_items"."id";



CREATE TABLE IF NOT EXISTS "public"."tesoreria_movimientos" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "dia" integer NOT NULL,
    "mes" integer NOT NULL,
    "anio" integer NOT NULL,
    "fecha_completa" "date" NOT NULL,
    "comprobante_numero" character varying(100),
    "tipo_documento" character varying(5),
    "descripcion" "text" NOT NULL,
    "item_id" integer,
    "monto_ingreso" integer DEFAULT 0,
    "monto_egreso" integer DEFAULT 0,
    "imagen_respaldo_url" "text",
    "unidad_id" integer,
    "registrado_por" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tesoreria_movimientos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tesoreria_rendicion_movimientos" (
    "rendicion_id" "uuid" NOT NULL,
    "movimiento_id" "uuid" NOT NULL
);


ALTER TABLE "public"."tesoreria_rendicion_movimientos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tesoreria_rendiciones" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "nombre_responsable" character varying(255),
    "fecha" "date" DEFAULT CURRENT_DATE,
    "motivo" "text",
    "unidad_id" integer,
    "monto_a_rendir" integer DEFAULT 0,
    "total_rendicion" integer DEFAULT 0,
    "saldo_final" integer DEFAULT 0,
    "estado" character varying(50) DEFAULT 'En Proceso'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "cargo_responsable" character varying(255),
    "banco_nombre_titular" character varying(255),
    "banco_nombre_banco" character varying(255),
    "banco_tipo_cuenta" character varying(100),
    "banco_rut" character varying(20),
    "banco_email" character varying(255)
);


ALTER TABLE "public"."tesoreria_rendiciones" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."unidades" (
    "id" integer NOT NULL,
    "nombre" character varying(50) NOT NULL,
    "descripcion" "text",
    "imagen_url" "text",
    "colores" "jsonb" DEFAULT '{"primario": "#000000", "secundario": "#FFFFFF"}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "logo_unidad_url" "text",
    "logo_rama_url" "text"
);


ALTER TABLE "public"."unidades" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."unidades_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."unidades_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."unidades_id_seq" OWNED BY "public"."unidades"."id";



ALTER TABLE ONLY "public"."articulo_categorias" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."articulo_categorias_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."categorias" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."categorias_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."progresion_areas" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."progresion_areas_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."progresion_etapas" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."progresion_etapas_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."roles" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."roles_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."tesoreria_comprobantes" ALTER COLUMN "folio" SET DEFAULT "nextval"('"public"."tesoreria_comprobantes_folio_seq"'::"regclass");



ALTER TABLE ONLY "public"."tesoreria_items" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."tesoreria_items_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."unidades" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."unidades_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."acta_acuerdos"
    ADD CONSTRAINT "acta_acuerdos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."acta_adjuntos"
    ADD CONSTRAINT "acta_adjuntos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."acta_firmas"
    ADD CONSTRAINT "acta_firmas_acta_id_perfil_id_key" UNIQUE ("acta_id", "perfil_id");



ALTER TABLE ONLY "public"."acta_firmas"
    ADD CONSTRAINT "acta_firmas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."acta_participantes"
    ADD CONSTRAINT "acta_participantes_acta_id_perfil_id_key" UNIQUE ("acta_id", "perfil_id");



ALTER TABLE ONLY "public"."acta_participantes"
    ADD CONSTRAINT "acta_participantes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."acta_temas"
    ADD CONSTRAINT "acta_temas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."actas"
    ADD CONSTRAINT "actas_codigo_key" UNIQUE ("codigo");



ALTER TABLE ONLY "public"."actas"
    ADD CONSTRAINT "actas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."actividades_programadas"
    ADD CONSTRAINT "actividades_programadas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."acuerdo_historial"
    ADD CONSTRAINT "acuerdo_historial_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."agendas_personales"
    ADD CONSTRAINT "agendas_personales_perfil_id_key" UNIQUE ("perfil_id");



ALTER TABLE ONLY "public"."agendas_personales"
    ADD CONSTRAINT "agendas_personales_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."articulo_categorias"
    ADD CONSTRAINT "articulo_categorias_articulo_id_categoria_id_key" UNIQUE ("articulo_id", "categoria_id");



ALTER TABLE ONLY "public"."articulo_categorias"
    ADD CONSTRAINT "articulo_categorias_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."articulo_resenas"
    ADD CONSTRAINT "articulo_resenas_articulo_id_perfil_id_key" UNIQUE ("articulo_id", "perfil_id");



ALTER TABLE ONLY "public"."articulo_resenas"
    ADD CONSTRAINT "articulo_resenas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."articulos"
    ADD CONSTRAINT "articulos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."articulos"
    ADD CONSTRAINT "articulos_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."asistencia_actividades"
    ADD CONSTRAINT "asistencia_actividades_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."asistencia_actividades"
    ADD CONSTRAINT "asistencia_actividades_propuesta_id_perfil_id_key" UNIQUE ("propuesta_id", "perfil_id");



ALTER TABLE ONLY "public"."autorizaciones_actividades"
    ADD CONSTRAINT "autorizaciones_actividades_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bitacoras_unidad"
    ADD CONSTRAINT "bitacoras_unidad_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categorias"
    ADD CONSTRAINT "categorias_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categorias"
    ADD CONSTRAINT "categorias_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."ceremonia_mensajes"
    ADD CONSTRAINT "ceremonia_mensajes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ceremonias"
    ADD CONSTRAINT "ceremonias_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ciclo_propuestas"
    ADD CONSTRAINT "ciclo_propuestas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ciclo_votos"
    ADD CONSTRAINT "ciclo_votos_pkey" PRIMARY KEY ("propuesta_id", "perfil_id");



ALTER TABLE ONLY "public"."ciclos_unidad"
    ADD CONSTRAINT "ciclos_unidad_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contactos_emergencia"
    ADD CONSTRAINT "contactos_emergencia_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."especialidades_actividades"
    ADD CONSTRAINT "especialidades_actividades_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."especialidades_definiciones"
    ADD CONSTRAINT "especialidades_definiciones_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."especialidades_definiciones"
    ADD CONSTRAINT "especialidades_definiciones_unidad_id_nombre_key" UNIQUE ("unidad_id", "nombre");



ALTER TABLE ONLY "public"."especialidades_personales"
    ADD CONSTRAINT "especialidades_personales_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."evaluacion_objetivos"
    ADD CONSTRAINT "evaluacion_objetivos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."evaluacion_objetivos"
    ADD CONSTRAINT "evaluacion_objetivos_unicos" UNIQUE ("perfil_id", "evaluador_id", "propuesta_id", "objetivo_texto");



ALTER TABLE ONLY "public"."inventario"
    ADD CONSTRAINT "inventario_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notificaciones"
    ADD CONSTRAINT "notificaciones_admin_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."perfiles_ficha_medica"
    ADD CONSTRAINT "perfiles_ficha_medica_pkey" PRIMARY KEY ("perfil_id");



ALTER TABLE ONLY "public"."perfiles"
    ADD CONSTRAINT "perfiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."perfiles"
    ADD CONSTRAINT "perfiles_rut_key" UNIQUE ("rut");



ALTER TABLE ONLY "public"."progresion_areas"
    ADD CONSTRAINT "progresion_areas_nombre_key" UNIQUE ("nombre");



ALTER TABLE ONLY "public"."progresion_areas"
    ADD CONSTRAINT "progresion_areas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."progresion_avance"
    ADD CONSTRAINT "progresion_avance_perfil_id_objetivo_id_key" UNIQUE ("perfil_id", "objetivo_id");



ALTER TABLE ONLY "public"."progresion_avance"
    ADD CONSTRAINT "progresion_avance_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."progresion_etapas"
    ADD CONSTRAINT "progresion_etapas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."progresion_etapas"
    ADD CONSTRAINT "progresion_etapas_unidad_id_nombre_key" UNIQUE ("unidad_id", "nombre");



ALTER TABLE ONLY "public"."progresion_hitos"
    ADD CONSTRAINT "progresion_hitos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."progresion_objetivos"
    ADD CONSTRAINT "progresion_objetivos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."proyecto_objetivos"
    ADD CONSTRAINT "proyecto_objetivos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."proyecto_participantes"
    ADD CONSTRAINT "proyecto_participantes_pkey" PRIMARY KEY ("proyecto_id", "perfil_id");



ALTER TABLE ONLY "public"."proyectos"
    ADD CONSTRAINT "proyectos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."solicitudes_competencias"
    ADD CONSTRAINT "solicitudes_competencias_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tesoreria_comprobante_detalles"
    ADD CONSTRAINT "tesoreria_comprobante_detalles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tesoreria_comprobantes"
    ADD CONSTRAINT "tesoreria_comprobantes_folio_key" UNIQUE ("folio");



ALTER TABLE ONLY "public"."tesoreria_comprobantes"
    ADD CONSTRAINT "tesoreria_comprobantes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tesoreria_items"
    ADD CONSTRAINT "tesoreria_items_codigo_key" UNIQUE ("codigo");



ALTER TABLE ONLY "public"."tesoreria_items"
    ADD CONSTRAINT "tesoreria_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tesoreria_movimientos"
    ADD CONSTRAINT "tesoreria_movimientos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tesoreria_rendicion_movimientos"
    ADD CONSTRAINT "tesoreria_rendicion_movimientos_pkey" PRIMARY KEY ("rendicion_id", "movimiento_id");



ALTER TABLE ONLY "public"."tesoreria_rendiciones"
    ADD CONSTRAINT "tesoreria_rendiciones_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."unidades"
    ADD CONSTRAINT "unidades_nombre_key" UNIQUE ("nombre");



ALTER TABLE ONLY "public"."unidades"
    ADD CONSTRAINT "unidades_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "trigger_notificar_pendiente" AFTER INSERT ON "public"."perfiles" FOR EACH ROW EXECUTE FUNCTION "public"."notificar_nuevo_pendiente"();



CREATE OR REPLACE TRIGGER "update_actas_updated_at" BEFORE UPDATE ON "public"."actas" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_agendas_personales_updated_at" BEFORE UPDATE ON "public"."agendas_personales" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_articulos_updated_at" BEFORE UPDATE ON "public"."articulos" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bitacoras_updated_at" BEFORE UPDATE ON "public"."bitacoras_unidad" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_perfiles_ficha_medica_updated_at" BEFORE UPDATE ON "public"."perfiles_ficha_medica" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_perfiles_updated_at" BEFORE UPDATE ON "public"."perfiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_progresion_avance_updated_at" BEFORE UPDATE ON "public"."progresion_avance" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_proyecto_objetivos_updated_at" BEFORE UPDATE ON "public"."proyecto_objetivos" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_proyectos_updated_at" BEFORE UPDATE ON "public"."proyectos" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."acta_acuerdos"
    ADD CONSTRAINT "acta_acuerdos_acta_id_fkey" FOREIGN KEY ("acta_id") REFERENCES "public"."actas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."acta_acuerdos"
    ADD CONSTRAINT "acta_acuerdos_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "public"."perfiles"("id");



ALTER TABLE ONLY "public"."acta_adjuntos"
    ADD CONSTRAINT "acta_adjuntos_acta_id_fkey" FOREIGN KEY ("acta_id") REFERENCES "public"."actas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."acta_adjuntos"
    ADD CONSTRAINT "acta_adjuntos_subido_por_fkey" FOREIGN KEY ("subido_por") REFERENCES "public"."perfiles"("id");



ALTER TABLE ONLY "public"."acta_firmas"
    ADD CONSTRAINT "acta_firmas_acta_id_fkey" FOREIGN KEY ("acta_id") REFERENCES "public"."actas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."acta_firmas"
    ADD CONSTRAINT "acta_firmas_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfiles"("id");



ALTER TABLE ONLY "public"."acta_participantes"
    ADD CONSTRAINT "acta_participantes_acta_id_fkey" FOREIGN KEY ("acta_id") REFERENCES "public"."actas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."acta_participantes"
    ADD CONSTRAINT "acta_participantes_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfiles"("id");



ALTER TABLE ONLY "public"."acta_temas"
    ADD CONSTRAINT "acta_temas_acta_id_fkey" FOREIGN KEY ("acta_id") REFERENCES "public"."actas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."actas"
    ADD CONSTRAINT "actas_ingresado_por_fkey" FOREIGN KEY ("ingresado_por") REFERENCES "public"."perfiles"("id");



ALTER TABLE ONLY "public"."actas"
    ADD CONSTRAINT "actas_unidad_id_fkey" FOREIGN KEY ("unidad_id") REFERENCES "public"."unidades"("id");



ALTER TABLE ONLY "public"."actividades_programadas"
    ADD CONSTRAINT "actividades_programadas_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "public"."perfiles"("id");



ALTER TABLE ONLY "public"."actividades_programadas"
    ADD CONSTRAINT "actividades_programadas_unidad_id_fkey" FOREIGN KEY ("unidad_id") REFERENCES "public"."unidades"("id");



ALTER TABLE ONLY "public"."acuerdo_historial"
    ADD CONSTRAINT "acuerdo_historial_acuerdo_id_fkey" FOREIGN KEY ("acuerdo_id") REFERENCES "public"."acta_acuerdos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."acuerdo_historial"
    ADD CONSTRAINT "acuerdo_historial_cambiado_por_fkey" FOREIGN KEY ("cambiado_por") REFERENCES "public"."perfiles"("id");



ALTER TABLE ONLY "public"."agendas_personales"
    ADD CONSTRAINT "agendas_personales_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."articulo_categorias"
    ADD CONSTRAINT "articulo_categorias_articulo_id_fkey" FOREIGN KEY ("articulo_id") REFERENCES "public"."articulos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."articulo_categorias"
    ADD CONSTRAINT "articulo_categorias_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."articulo_resenas"
    ADD CONSTRAINT "articulo_resenas_articulo_id_fkey" FOREIGN KEY ("articulo_id") REFERENCES "public"."articulos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."articulo_resenas"
    ADD CONSTRAINT "articulo_resenas_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."articulos"
    ADD CONSTRAINT "articulos_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "public"."perfiles"("id");



ALTER TABLE ONLY "public"."articulos"
    ADD CONSTRAINT "articulos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("id");



ALTER TABLE ONLY "public"."asistencia_actividades"
    ADD CONSTRAINT "asistencia_actividades_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."asistencia_actividades"
    ADD CONSTRAINT "asistencia_actividades_propuesta_id_fkey" FOREIGN KEY ("propuesta_id") REFERENCES "public"."ciclo_propuestas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."autorizaciones_actividades"
    ADD CONSTRAINT "autorizaciones_actividades_actividad_id_fkey" FOREIGN KEY ("actividad_id") REFERENCES "public"."actividades_programadas"("id");



ALTER TABLE ONLY "public"."autorizaciones_actividades"
    ADD CONSTRAINT "autorizaciones_actividades_firmado_por_id_fkey" FOREIGN KEY ("firmado_por_id") REFERENCES "public"."perfiles"("id");



ALTER TABLE ONLY "public"."autorizaciones_actividades"
    ADD CONSTRAINT "autorizaciones_actividades_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bitacoras_unidad"
    ADD CONSTRAINT "bitacoras_unidad_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "public"."perfiles"("id");



ALTER TABLE ONLY "public"."bitacoras_unidad"
    ADD CONSTRAINT "bitacoras_unidad_unidad_id_fkey" FOREIGN KEY ("unidad_id") REFERENCES "public"."unidades"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."categorias"
    ADD CONSTRAINT "categorias_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."categorias"("id");



ALTER TABLE ONLY "public"."ceremonia_mensajes"
    ADD CONSTRAINT "ceremonia_mensajes_ceremonia_id_fkey" FOREIGN KEY ("ceremonia_id") REFERENCES "public"."ceremonias"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ceremonia_mensajes"
    ADD CONSTRAINT "ceremonia_mensajes_remitente_id_fkey" FOREIGN KEY ("remitente_id") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ceremonias"
    ADD CONSTRAINT "ceremonias_madrina_id_fkey" FOREIGN KEY ("madrina_id") REFERENCES "public"."perfiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."ceremonias"
    ADD CONSTRAINT "ceremonias_padrino_id_fkey" FOREIGN KEY ("padrino_id") REFERENCES "public"."perfiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."ceremonias"
    ADD CONSTRAINT "ceremonias_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ceremonias"
    ADD CONSTRAINT "ceremonias_unidad_destino_id_fkey" FOREIGN KEY ("unidad_destino_id") REFERENCES "public"."unidades"("id");



ALTER TABLE ONLY "public"."ceremonias"
    ADD CONSTRAINT "ceremonias_unidad_origen_id_fkey" FOREIGN KEY ("unidad_origen_id") REFERENCES "public"."unidades"("id");



ALTER TABLE ONLY "public"."ciclo_propuestas"
    ADD CONSTRAINT "ciclo_propuestas_articulo_id_fkey" FOREIGN KEY ("articulo_id") REFERENCES "public"."articulos"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."ciclo_propuestas"
    ADD CONSTRAINT "ciclo_propuestas_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ciclo_propuestas"
    ADD CONSTRAINT "ciclo_propuestas_ciclo_id_fkey" FOREIGN KEY ("ciclo_id") REFERENCES "public"."ciclos_unidad"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ciclo_votos"
    ADD CONSTRAINT "ciclo_votos_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ciclo_votos"
    ADD CONSTRAINT "ciclo_votos_propuesta_id_fkey" FOREIGN KEY ("propuesta_id") REFERENCES "public"."ciclo_propuestas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ciclos_unidad"
    ADD CONSTRAINT "ciclos_unidad_articulo_juego_id_fkey" FOREIGN KEY ("articulo_juego_id") REFERENCES "public"."articulos"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."ciclos_unidad"
    ADD CONSTRAINT "ciclos_unidad_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "public"."perfiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."ciclos_unidad"
    ADD CONSTRAINT "ciclos_unidad_unidad_id_fkey" FOREIGN KEY ("unidad_id") REFERENCES "public"."unidades"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contactos_emergencia"
    ADD CONSTRAINT "contactos_emergencia_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."especialidades_actividades"
    ADD CONSTRAINT "especialidades_actividades_actividad_programada_id_fkey" FOREIGN KEY ("actividad_programada_id") REFERENCES "public"."actividades_programadas"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."especialidades_actividades"
    ADD CONSTRAINT "especialidades_actividades_articulo_id_fkey" FOREIGN KEY ("articulo_id") REFERENCES "public"."articulos"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."especialidades_actividades"
    ADD CONSTRAINT "especialidades_actividades_especialidad_personal_id_fkey" FOREIGN KEY ("especialidad_personal_id") REFERENCES "public"."especialidades_personales"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."especialidades_definiciones"
    ADD CONSTRAINT "especialidades_definiciones_unidad_id_fkey" FOREIGN KEY ("unidad_id") REFERENCES "public"."unidades"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."especialidades_personales"
    ADD CONSTRAINT "especialidades_personales_definicion_id_fkey" FOREIGN KEY ("definicion_id") REFERENCES "public"."especialidades_definiciones"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."especialidades_personales"
    ADD CONSTRAINT "especialidades_personales_monitor_perfil_id_fkey" FOREIGN KEY ("monitor_perfil_id") REFERENCES "public"."perfiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."especialidades_personales"
    ADD CONSTRAINT "especialidades_personales_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."evaluacion_objetivos"
    ADD CONSTRAINT "evaluacion_objetivos_evaluador_id_fkey" FOREIGN KEY ("evaluador_id") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."evaluacion_objetivos"
    ADD CONSTRAINT "evaluacion_objetivos_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."evaluacion_objetivos"
    ADD CONSTRAINT "evaluacion_objetivos_propuesta_id_fkey" FOREIGN KEY ("propuesta_id") REFERENCES "public"."ciclo_propuestas"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."inventario"
    ADD CONSTRAINT "inventario_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "public"."perfiles"("id");



ALTER TABLE ONLY "public"."inventario"
    ADD CONSTRAINT "inventario_unidad_id_fkey" FOREIGN KEY ("unidad_id") REFERENCES "public"."unidades"("id");



ALTER TABLE ONLY "public"."notificaciones"
    ADD CONSTRAINT "notificaciones_admin_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfiles"("id");



ALTER TABLE ONLY "public"."perfiles"
    ADD CONSTRAINT "perfiles_apoderado_id_fkey" FOREIGN KEY ("apoderado_id") REFERENCES "public"."perfiles"("id");



ALTER TABLE ONLY "public"."perfiles_ficha_medica"
    ADD CONSTRAINT "perfiles_ficha_medica_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."perfiles"
    ADD CONSTRAINT "perfiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."perfiles"
    ADD CONSTRAINT "perfiles_progresion_etapa_id_fkey" FOREIGN KEY ("progresion_etapa_id") REFERENCES "public"."progresion_etapas"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."perfiles"
    ADD CONSTRAINT "perfiles_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "public"."roles"("id");



ALTER TABLE ONLY "public"."perfiles"
    ADD CONSTRAINT "perfiles_unidad_id_fkey" FOREIGN KEY ("unidad_id") REFERENCES "public"."unidades"("id");



ALTER TABLE ONLY "public"."progresion_avance"
    ADD CONSTRAINT "progresion_avance_objetivo_id_fkey" FOREIGN KEY ("objetivo_id") REFERENCES "public"."progresion_objetivos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."progresion_avance"
    ADD CONSTRAINT "progresion_avance_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."progresion_avance"
    ADD CONSTRAINT "progresion_avance_validado_por_fkey" FOREIGN KEY ("validado_por") REFERENCES "public"."perfiles"("id");



ALTER TABLE ONLY "public"."progresion_etapas"
    ADD CONSTRAINT "progresion_etapas_unidad_id_fkey" FOREIGN KEY ("unidad_id") REFERENCES "public"."unidades"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."progresion_hitos"
    ADD CONSTRAINT "progresion_hitos_entregado_por_fkey" FOREIGN KEY ("entregado_por") REFERENCES "public"."perfiles"("id");



ALTER TABLE ONLY "public"."progresion_hitos"
    ADD CONSTRAINT "progresion_hitos_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."progresion_objetivos"
    ADD CONSTRAINT "progresion_objetivos_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "public"."progresion_areas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."progresion_objetivos"
    ADD CONSTRAINT "progresion_objetivos_etapa_id_fkey" FOREIGN KEY ("etapa_id") REFERENCES "public"."progresion_etapas"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."progresion_objetivos"
    ADD CONSTRAINT "progresion_objetivos_unidad_id_fkey" FOREIGN KEY ("unidad_id") REFERENCES "public"."unidades"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."proyecto_objetivos"
    ADD CONSTRAINT "proyecto_objetivos_agenda_id_fkey" FOREIGN KEY ("agenda_id") REFERENCES "public"."agendas_personales"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."proyecto_objetivos"
    ADD CONSTRAINT "proyecto_objetivos_objetivo_id_fkey" FOREIGN KEY ("objetivo_id") REFERENCES "public"."progresion_objetivos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."proyecto_objetivos"
    ADD CONSTRAINT "proyecto_objetivos_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."proyecto_participantes"
    ADD CONSTRAINT "proyecto_participantes_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."proyecto_participantes"
    ADD CONSTRAINT "proyecto_participantes_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."proyectos"
    ADD CONSTRAINT "proyectos_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."proyectos"
    ADD CONSTRAINT "proyectos_unidad_id_fkey" FOREIGN KEY ("unidad_id") REFERENCES "public"."unidades"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."solicitudes_competencias"
    ADD CONSTRAINT "solicitudes_competencias_aprobado_por_fkey" FOREIGN KEY ("aprobado_por") REFERENCES "public"."perfiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."solicitudes_competencias"
    ADD CONSTRAINT "solicitudes_competencias_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."solicitudes_competencias"
    ADD CONSTRAINT "solicitudes_competencias_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."tesoreria_comprobante_detalles"
    ADD CONSTRAINT "tesoreria_comprobante_detalles_comprobante_id_fkey" FOREIGN KEY ("comprobante_id") REFERENCES "public"."tesoreria_comprobantes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tesoreria_comprobante_detalles"
    ADD CONSTRAINT "tesoreria_comprobante_detalles_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."tesoreria_items"("id");



ALTER TABLE ONLY "public"."tesoreria_comprobantes"
    ADD CONSTRAINT "tesoreria_comprobantes_hecho_por_fkey" FOREIGN KEY ("hecho_por") REFERENCES "public"."perfiles"("id");



ALTER TABLE ONLY "public"."tesoreria_comprobantes"
    ADD CONSTRAINT "tesoreria_comprobantes_unidad_id_fkey" FOREIGN KEY ("unidad_id") REFERENCES "public"."unidades"("id");



ALTER TABLE ONLY "public"."tesoreria_comprobantes"
    ADD CONSTRAINT "tesoreria_comprobantes_visto_bueno_por_fkey" FOREIGN KEY ("visto_bueno_por") REFERENCES "public"."perfiles"("id");



ALTER TABLE ONLY "public"."tesoreria_movimientos"
    ADD CONSTRAINT "tesoreria_movimientos_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."tesoreria_items"("id");



ALTER TABLE ONLY "public"."tesoreria_movimientos"
    ADD CONSTRAINT "tesoreria_movimientos_registrado_por_fkey" FOREIGN KEY ("registrado_por") REFERENCES "public"."perfiles"("id");



ALTER TABLE ONLY "public"."tesoreria_movimientos"
    ADD CONSTRAINT "tesoreria_movimientos_unidad_id_fkey" FOREIGN KEY ("unidad_id") REFERENCES "public"."unidades"("id");



ALTER TABLE ONLY "public"."tesoreria_rendicion_movimientos"
    ADD CONSTRAINT "tesoreria_rendicion_movimientos_movimiento_id_fkey" FOREIGN KEY ("movimiento_id") REFERENCES "public"."tesoreria_movimientos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tesoreria_rendicion_movimientos"
    ADD CONSTRAINT "tesoreria_rendicion_movimientos_rendicion_id_fkey" FOREIGN KEY ("rendicion_id") REFERENCES "public"."tesoreria_rendiciones"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tesoreria_rendiciones"
    ADD CONSTRAINT "tesoreria_rendiciones_unidad_id_fkey" FOREIGN KEY ("unidad_id") REFERENCES "public"."unidades"("id");



CREATE POLICY "Acta adjuntos auth read" ON "public"."acta_adjuntos" FOR SELECT USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Actas delete policy" ON "public"."actas" FOR DELETE USING ((( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = 1));



CREATE POLICY "Actas insert policy v2" ON "public"."actas" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Actas select policy" ON "public"."actas" FOR SELECT USING ("public"."puede_ver_acta_v2"("id"));



CREATE POLICY "Actas update management" ON "public"."actas" FOR UPDATE USING (((EXISTS ( SELECT 1
   FROM "public"."perfiles"
  WHERE (("perfiles"."id" = "auth"."uid"()) AND ("perfiles"."rol_id" = 1)))) OR ("ingresado_por" = "auth"."uid"()) OR ("id" IN ( SELECT "acta_participantes"."acta_id"
   FROM "public"."acta_participantes"
  WHERE (("acta_participantes"."perfil_id" = "auth"."uid"()) AND (("acta_participantes"."rol_en_reunion")::"text" = 'Tomador de Notas'::"text"))))));



CREATE POLICY "Actas update policy" ON "public"."actas" FOR UPDATE USING (((( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = 1) OR ("ingresado_por" = "auth"."uid"()) OR ("id" IN ( SELECT "acta_participantes"."acta_id"
   FROM "public"."acta_participantes"
  WHERE (("acta_participantes"."perfil_id" = "auth"."uid"()) AND (("acta_participantes"."rol_en_reunion")::"text" = 'Tomador de Notas'::"text"))))));



CREATE POLICY "Actas update staff" ON "public"."actas" FOR UPDATE USING ((("public"."get_my_rol"() = 1) OR ("ingresado_por" = "auth"."uid"()) OR ("id" IN ( SELECT "acta_participantes"."acta_id"
   FROM "public"."acta_participantes"
  WHERE (("acta_participantes"."perfil_id" = "auth"."uid"()) AND (("acta_participantes"."rol_en_reunion")::"text" = 'Tomador de Notas'::"text"))))));



CREATE POLICY "Actividades programadas public read" ON "public"."actividades_programadas" FOR SELECT USING (true);



CREATE POLICY "Actualizar agenda propia o staff" ON "public"."agendas_personales" FOR UPDATE USING ((("auth"."uid"() = "perfil_id") OR "public"."es_staff"()));



CREATE POLICY "Actualizar objetivos de proyecto logueado" ON "public"."proyecto_objetivos" FOR UPDATE USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Actualizar solicitud de competencia logueado" ON "public"."solicitudes_competencias" FOR UPDATE USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Acuerdo historial auth read" ON "public"."acuerdo_historial" FOR SELECT USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Acuerdos open insert" ON "public"."acta_acuerdos" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Acuerdos select policy" ON "public"."acta_acuerdos" FOR SELECT USING ("public"."puede_ver_acta_v2"("acta_id"));



CREATE POLICY "Acuerdos visibility" ON "public"."acta_acuerdos" FOR SELECT USING (("acta_id" IN ( SELECT "actas"."id"
   FROM "public"."actas")));



CREATE POLICY "Adjuntos manage" ON "public"."acta_adjuntos" USING (("acta_id" IN ( SELECT "actas"."id"
   FROM "public"."actas"
  WHERE (("actas"."ingresado_por" = "auth"."uid"()) OR (( SELECT "perfiles"."rol_id"
           FROM "public"."perfiles"
          WHERE ("perfiles"."id" = "auth"."uid"())) = 1)))));



CREATE POLICY "Adjuntos visibility" ON "public"."acta_adjuntos" FOR SELECT USING (("acta_id" IN ( SELECT "actas"."id"
   FROM "public"."actas")));



CREATE POLICY "Admin puede todo en autorizaciones" ON "public"."autorizaciones_actividades" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."perfiles"
  WHERE (("perfiles"."id" = "auth"."uid"()) AND ("perfiles"."rol_id" = 1)))));



CREATE POLICY "Allow insert messages for authenticated" ON "public"."ceremonia_mensajes" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "remitente_id"));



CREATE POLICY "Allow manage own messages" ON "public"."ceremonia_mensajes" TO "authenticated" USING ((("auth"."uid"() = "remitente_id") OR (( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3])))) WITH CHECK ((("auth"."uid"() = "remitente_id") OR (( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3]))));



CREATE POLICY "Allow read definitions to all authenticated" ON "public"."especialidades_definiciones" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow select for authenticated" ON "public"."ceremonias" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow select messages for authenticated" ON "public"."ceremonia_mensajes" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow write definitions to leaders/admins" ON "public"."especialidades_definiciones" TO "authenticated" USING ((( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3])));



CREATE POLICY "Allow write for leaders" ON "public"."ceremonias" TO "authenticated" USING ((( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3]))) WITH CHECK ((( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3])));



CREATE POLICY "Articulo categorias public read" ON "public"."articulo_categorias" FOR SELECT USING (true);



CREATE POLICY "Articulos delete policy" ON "public"."articulos" FOR DELETE USING (((( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3])) OR ("autor_id" = "auth"."uid"())));



CREATE POLICY "Articulos insert policy" ON "public"."articulos" FOR INSERT WITH CHECK ((( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3, 9, 10, 11, 12, 13])));



CREATE POLICY "Articulos public read" ON "public"."articulos" FOR SELECT USING (((("estado")::"text" = 'publicado'::"text") OR (("auth"."uid"() IS NOT NULL) AND ((( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3])) OR ("autor_id" = "auth"."uid"())))));



CREATE POLICY "Articulos update policy" ON "public"."articulos" FOR UPDATE USING (((( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3])) OR ("autor_id" = "auth"."uid"())));



CREATE POLICY "Categorias public read" ON "public"."categorias" FOR SELECT USING (true);



CREATE POLICY "Comprobantes staff access" ON "public"."tesoreria_comprobantes" USING ((EXISTS ( SELECT 1
   FROM "public"."perfiles"
  WHERE (("perfiles"."id" = "auth"."uid"()) AND ("perfiles"."rol_id" = ANY (ARRAY[1, 2, 3, 5]))))));



CREATE POLICY "Contactos emergencia access" ON "public"."contactos_emergencia" USING ((("perfil_id" = "auth"."uid"()) OR (( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3]))));



CREATE POLICY "Crear solicitud de competencia propia o staff" ON "public"."solicitudes_competencias" FOR INSERT WITH CHECK ((("auth"."uid"() = "perfil_id") OR "public"."es_staff"()));



CREATE POLICY "Cualquier usuario logueado actualiza proyectos" ON "public"."proyectos" FOR UPDATE USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Cualquier usuario logueado crea proyectos" ON "public"."proyectos" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Cualquiera actualiza/borra propuestas" ON "public"."ciclo_propuestas" USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Cualquiera crea propuestas" ON "public"."ciclo_propuestas" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Cualquiera gestiona asistencia" ON "public"."asistencia_actividades" USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Cualquiera gestiona evaluacion objetivos" ON "public"."evaluacion_objetivos" USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Cualquiera gestiona sus votos" ON "public"."ciclo_votos" USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Delete own notifications" ON "public"."notificaciones" FOR DELETE USING (("perfil_id" = "auth"."uid"()));



CREATE POLICY "Delete personal specialties" ON "public"."especialidades_personales" FOR DELETE TO "authenticated" USING ((("perfil_id" = "auth"."uid"()) OR (( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3]))));



CREATE POLICY "Detalles staff access" ON "public"."tesoreria_comprobante_detalles" USING ((EXISTS ( SELECT 1
   FROM "public"."perfiles"
  WHERE (("perfiles"."id" = "auth"."uid"()) AND ("perfiles"."rol_id" = ANY (ARRAY[1, 2, 3, 5]))))));



CREATE POLICY "Dirigentes pueden actualizar ciclos" ON "public"."ciclos_unidad" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."perfiles"
  WHERE (("perfiles"."id" = "auth"."uid"()) AND ("perfiles"."rol_id" = ANY (ARRAY[1, 2, 3]))))));



CREATE POLICY "Dirigentes pueden crear ciclos" ON "public"."ciclos_unidad" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."perfiles"
  WHERE (("perfiles"."id" = "auth"."uid"()) AND ("perfiles"."rol_id" = ANY (ARRAY[1, 2, 3]))))));



CREATE POLICY "Eliminar agenda staff" ON "public"."agendas_personales" FOR DELETE USING ("public"."es_staff"());



CREATE POLICY "Eliminar objetivos de proyecto staff" ON "public"."proyecto_objetivos" FOR DELETE USING ("public"."es_staff"());



CREATE POLICY "Eliminar proyecto staff o creador" ON "public"."proyectos" FOR DELETE USING (("public"."es_staff"() OR ("perfil_id" = "auth"."uid"())));



CREATE POLICY "Eliminar solicitud de competencia propia o staff" ON "public"."solicitudes_competencias" FOR DELETE USING ((("auth"."uid"() = "perfil_id") OR "public"."es_staff"()));



CREATE POLICY "Firmas insert own policy" ON "public"."acta_firmas" FOR INSERT TO "authenticated" WITH CHECK ((("perfil_id" = "auth"."uid"()) AND "public"."puede_ver_acta_v2"("acta_id")));



CREATE POLICY "Firmas select policy" ON "public"."acta_firmas" FOR SELECT USING ("public"."puede_ver_acta_v2"("acta_id"));



CREATE POLICY "Firmas update" ON "public"."acta_firmas" FOR UPDATE USING ((("perfil_id" = "auth"."uid"()) OR (( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = 1)));



CREATE POLICY "Firmas visibility" ON "public"."acta_firmas" FOR SELECT USING (("acta_id" IN ( SELECT "actas"."id"
   FROM "public"."actas")));



CREATE POLICY "Gestionar objetivos de proyecto logueado" ON "public"."proyecto_objetivos" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Gestionar participantes logueado" ON "public"."proyecto_participantes" USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Gestión de autorizaciones propias o de pupilos" ON "public"."autorizaciones_actividades" TO "authenticated" USING ((("auth"."uid"() = "perfil_id") OR ("auth"."uid"() = "firmado_por_id") OR (EXISTS ( SELECT 1
   FROM "public"."perfiles"
  WHERE (("perfiles"."id" = "auth"."uid"()) AND ("perfiles"."id" = ( SELECT "perfiles_1"."apoderado_id"
           FROM "public"."perfiles" "perfiles_1"
          WHERE ("perfiles_1"."id" = "autorizaciones_actividades"."perfil_id"))))))));



CREATE POLICY "Insert notifications from auth users" ON "public"."notificaciones" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Insert personal specialties" ON "public"."especialidades_personales" FOR INSERT TO "authenticated" WITH CHECK (("perfil_id" = "auth"."uid"()));



CREATE POLICY "Insertar agenda propia o staff" ON "public"."agendas_personales" FOR INSERT WITH CHECK ((("auth"."uid"() = "perfil_id") OR "public"."es_staff"()));



CREATE POLICY "Insertar autorizaciones propias o de pupilos" ON "public"."autorizaciones_actividades" FOR INSERT TO "authenticated" WITH CHECK ((("auth"."uid"() = "perfil_id") OR ("auth"."uid"() = ( SELECT "perfiles"."apoderado_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "autorizaciones_actividades"."perfil_id")))));



CREATE POLICY "Inventario manage" ON "public"."inventario" USING ((( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3])));



CREATE POLICY "Inventario visibility" ON "public"."inventario" FOR SELECT USING (((( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3])) OR ("unidad_id" IS NULL) OR ("unidad_id" = ( SELECT "perfiles"."unidad_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())))));



CREATE POLICY "Items lectura publica" ON "public"."tesoreria_items" FOR SELECT USING (true);



CREATE POLICY "Lectura de asistencia" ON "public"."asistencia_actividades" FOR SELECT USING (true);



CREATE POLICY "Lectura de ciclos" ON "public"."ciclos_unidad" FOR SELECT USING (true);



CREATE POLICY "Lectura de evaluacion objetivos" ON "public"."evaluacion_objetivos" FOR SELECT USING (true);



CREATE POLICY "Lectura de propuestas" ON "public"."ciclo_propuestas" FOR SELECT USING (true);



CREATE POLICY "Lectura de votos" ON "public"."ciclo_votos" FOR SELECT USING (true);



CREATE POLICY "Lectura publica de agendas" ON "public"."agendas_personales" FOR SELECT USING (true);



CREATE POLICY "Lectura publica de objetivos de proyecto" ON "public"."proyecto_objetivos" FOR SELECT USING (true);



CREATE POLICY "Lectura publica de participantes" ON "public"."proyecto_participantes" FOR SELECT USING (true);



CREATE POLICY "Lectura publica de proyectos" ON "public"."proyectos" FOR SELECT USING (true);



CREATE POLICY "Lectura publica de solicitudes de competencia" ON "public"."solicitudes_competencias" FOR SELECT USING (true);



CREATE POLICY "Lectura selectiva de bitácoras" ON "public"."bitacoras_unidad" FOR SELECT USING (((EXISTS ( SELECT 1
   FROM "public"."perfiles"
  WHERE (("perfiles"."id" = "auth"."uid"()) AND ("perfiles"."rol_id" = 1)))) OR (("unidad_id" = ( SELECT "perfiles"."unidad_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"()))) AND ((NOT "excluir_dirigentes") OR ("excluir_dirigentes" AND (( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) <> ALL (ARRAY[2, 3])))))));



CREATE POLICY "Los usuarios pueden actualizar su propia ficha médica" ON "public"."perfiles_ficha_medica" TO "authenticated" USING (("auth"."uid"() = "perfil_id")) WITH CHECK (("auth"."uid"() = "perfil_id"));



CREATE POLICY "Los usuarios pueden ver su propia ficha médica" ON "public"."perfiles_ficha_medica" FOR SELECT TO "authenticated" USING ((("auth"."uid"() = "perfil_id") OR (EXISTS ( SELECT 1
   FROM "public"."perfiles"
  WHERE (("perfiles"."id" = "auth"."uid"()) AND ("perfiles"."rol_id" <= 3)))) OR (EXISTS ( SELECT 1
   FROM "public"."perfiles"
  WHERE (("perfiles"."id" = "auth"."uid"()) AND ("perfiles"."id" = ( SELECT "perfiles_1"."apoderado_id"
           FROM "public"."perfiles" "perfiles_1"
          WHERE ("perfiles_1"."id" = "perfiles_ficha_medica"."perfil_id"))))))));



CREATE POLICY "Manage own article categories" ON "public"."articulo_categorias" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."articulos" "a"
  WHERE (("a"."id" = "articulo_categorias"."articulo_id") AND (("a"."autor_id" = "auth"."uid"()) OR (( SELECT "perfiles"."rol_id"
           FROM "public"."perfiles"
          WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3]))))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."articulos" "a"
  WHERE (("a"."id" = "articulo_categorias"."articulo_id") AND (("a"."autor_id" = "auth"."uid"()) OR (( SELECT "perfiles"."rol_id"
           FROM "public"."perfiles"
          WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3])))))));



CREATE POLICY "Manage own or leader activities" ON "public"."actividades_programadas" TO "authenticated" USING ((("creado_por" = "auth"."uid"()) OR (( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3])))) WITH CHECK ((("creado_por" = "auth"."uid"()) OR (( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3]))));



CREATE POLICY "Manage specialty activities" ON "public"."especialidades_actividades" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."especialidades_personales" "ep"
  WHERE (("ep"."id" = "especialidades_actividades"."especialidad_personal_id") AND (("ep"."perfil_id" = "auth"."uid"()) OR (( SELECT "perfiles"."rol_id"
           FROM "public"."perfiles"
          WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3])))))));



CREATE POLICY "Movimientos staff access final" ON "public"."tesoreria_movimientos" USING ((EXISTS ( SELECT 1
   FROM "public"."perfiles"
  WHERE (("perfiles"."id" = "auth"."uid"()) AND ("perfiles"."rol_id" = ANY (ARRAY[1, 2, 3, 5]))))));



CREATE POLICY "NNJ y Admins pueden crear entradas" ON "public"."bitacoras_unidad" FOR INSERT WITH CHECK ((("auth"."uid"() = "autor_id") AND (("unidad_id" = ( SELECT "perfiles"."unidad_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"()))) OR (EXISTS ( SELECT 1
   FROM "public"."perfiles"
  WHERE (("perfiles"."id" = "auth"."uid"()) AND ("perfiles"."rol_id" = 1)))))));



CREATE POLICY "Participantes open insert" ON "public"."acta_participantes" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Participantes select policy" ON "public"."acta_participantes" FOR SELECT USING ("public"."puede_ver_acta_v2"("acta_id"));



CREATE POLICY "Participantes visibility" ON "public"."acta_participantes" FOR SELECT USING (("acta_id" IN ( SELECT "actas"."id"
   FROM "public"."actas")));



CREATE POLICY "Perfiles insert policy" ON "public"."perfiles" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Perfiles lectura pública" ON "public"."perfiles" FOR SELECT USING (true);



CREATE POLICY "Perfiles update policy" ON "public"."perfiles" FOR UPDATE TO "authenticated" USING ((("auth"."uid"() = "id") OR ("public"."get_my_rol"() = ANY (ARRAY[1, 2, 3])) OR ("apoderado_id" = "auth"."uid"()) OR ((("public"."get_my_rol"() >= 2) AND ("public"."get_my_rol"() <= 8)) AND ("apoderado_id" IS NULL)))) WITH CHECK ((("auth"."uid"() = "id") OR ("public"."get_my_rol"() = ANY (ARRAY[1, 2, 3])) OR ("apoderado_id" = "auth"."uid"())));



CREATE POLICY "Progresion areas public read" ON "public"."progresion_areas" FOR SELECT USING (true);



CREATE POLICY "Progresion avance access" ON "public"."progresion_avance" USING ((("perfil_id" = "auth"."uid"()) OR (( SELECT "perfiles"."apoderado_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "progresion_avance"."perfil_id")) = "auth"."uid"()) OR (( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3]))));



CREATE POLICY "Progresion etapas public read" ON "public"."progresion_etapas" FOR SELECT USING (true);



CREATE POLICY "Progresion hitos public read" ON "public"."progresion_hitos" FOR SELECT USING (true);



CREATE POLICY "Progresion objetivos public read" ON "public"."progresion_objetivos" FOR SELECT USING (true);



CREATE POLICY "Rendicion movimientos staff access" ON "public"."tesoreria_rendicion_movimientos" USING ((EXISTS ( SELECT 1
   FROM "public"."perfiles"
  WHERE (("perfiles"."id" = "auth"."uid"()) AND ("perfiles"."rol_id" = ANY (ARRAY[1, 2, 3, 5]))))));



CREATE POLICY "Rendiciones staff access" ON "public"."tesoreria_rendiciones" USING ((EXISTS ( SELECT 1
   FROM "public"."perfiles"
  WHERE (("perfiles"."id" = "auth"."uid"()) AND ("perfiles"."rol_id" = ANY (ARRAY[1, 2, 3, 5]))))));



CREATE POLICY "Roles lectura pública" ON "public"."roles" FOR SELECT USING (true);



CREATE POLICY "Select own notifications" ON "public"."notificaciones" FOR SELECT USING (("perfil_id" = "auth"."uid"()));



CREATE POLICY "Select personal specialties" ON "public"."especialidades_personales" FOR SELECT TO "authenticated" USING ((("perfil_id" = "auth"."uid"()) OR (( SELECT "perfiles"."apoderado_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "especialidades_personales"."perfil_id")) = "auth"."uid"()) OR (( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3]))));



CREATE POLICY "Select specialty activities" ON "public"."especialidades_actividades" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."especialidades_personales" "ep"
  WHERE (("ep"."id" = "especialidades_actividades"."especialidad_personal_id") AND (("ep"."perfil_id" = "auth"."uid"()) OR (( SELECT "perfiles"."apoderado_id"
           FROM "public"."perfiles"
          WHERE ("perfiles"."id" = "ep"."perfil_id")) = "auth"."uid"()) OR (( SELECT "perfiles"."rol_id"
           FROM "public"."perfiles"
          WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3])))))));



CREATE POLICY "Solo autor o admin actualiza" ON "public"."bitacoras_unidad" FOR UPDATE USING ((("auth"."uid"() = "autor_id") OR (EXISTS ( SELECT 1
   FROM "public"."perfiles"
  WHERE (("perfiles"."id" = "auth"."uid"()) AND ("perfiles"."rol_id" = 1))))));



CREATE POLICY "Solo autor o admin elimina" ON "public"."bitacoras_unidad" FOR DELETE USING ((("auth"."uid"() = "autor_id") OR (EXISTS ( SELECT 1
   FROM "public"."perfiles"
  WHERE (("perfiles"."id" = "auth"."uid"()) AND ("perfiles"."rol_id" = 1))))));



CREATE POLICY "Solo creador o admin puede borrar ciclos" ON "public"."ciclos_unidad" FOR DELETE USING ((("creado_por" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."perfiles"
  WHERE (("perfiles"."id" = "auth"."uid"()) AND ("perfiles"."rol_id" = 1))))));



CREATE POLICY "Temas manage" ON "public"."acta_temas" USING (("acta_id" IN ( SELECT "actas"."id"
   FROM "public"."actas"
  WHERE (("actas"."ingresado_por" = "auth"."uid"()) OR (( SELECT "perfiles"."rol_id"
           FROM "public"."perfiles"
          WHERE ("perfiles"."id" = "auth"."uid"())) = 1) OR ("actas"."id" IN ( SELECT "acta_participantes"."acta_id"
           FROM "public"."acta_participantes"
          WHERE (("acta_participantes"."perfil_id" = "auth"."uid"()) AND (("acta_participantes"."rol_en_reunion")::"text" = 'Tomador de Notas'::"text"))))))));



CREATE POLICY "Temas select policy" ON "public"."acta_temas" FOR SELECT USING ("public"."puede_ver_acta_v2"("acta_id"));



CREATE POLICY "Temas visibility" ON "public"."acta_temas" FOR SELECT USING (("acta_id" IN ( SELECT "actas"."id"
   FROM "public"."actas")));



CREATE POLICY "Tesoreria rendiciones access" ON "public"."tesoreria_rendicion_movimientos" USING ((( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3, 7])));



CREATE POLICY "Unidades public read" ON "public"."unidades" FOR SELECT USING (true);



CREATE POLICY "Update own notifications" ON "public"."notificaciones" FOR UPDATE USING (("perfil_id" = "auth"."uid"()));



CREATE POLICY "Update personal specialties" ON "public"."especialidades_personales" FOR UPDATE TO "authenticated" USING ((("perfil_id" = "auth"."uid"()) OR (( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3]))));



CREATE POLICY "Ver autorizaciones propias, de pupilos o de unidad" ON "public"."autorizaciones_actividades" FOR SELECT TO "authenticated" USING ((("auth"."uid"() = "perfil_id") OR ("auth"."uid"() = "firmado_por_id") OR (EXISTS ( SELECT 1
   FROM "public"."perfiles"
  WHERE (("perfiles"."id" = "auth"."uid"()) AND ("perfiles"."rol_id" <= 3) AND ("perfiles"."unidad_id" = ( SELECT "perfiles_1"."unidad_id"
           FROM "public"."perfiles" "perfiles_1"
          WHERE ("perfiles_1"."id" = "autorizaciones_actividades"."perfil_id")))))) OR (EXISTS ( SELECT 1
   FROM "public"."perfiles"
  WHERE (("perfiles"."id" = "auth"."uid"()) AND ("perfiles"."id" = ( SELECT "perfiles_1"."apoderado_id"
           FROM "public"."perfiles" "perfiles_1"
          WHERE ("perfiles_1"."id" = "autorizaciones_actividades"."perfil_id")))))) OR (EXISTS ( SELECT 1
   FROM "public"."perfiles"
  WHERE (("perfiles"."id" = "auth"."uid"()) AND ("perfiles"."rol_id" = 1))))));



ALTER TABLE "public"."acta_acuerdos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."acta_adjuntos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."acta_firmas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."acta_participantes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."acta_temas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."actas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."actividades_programadas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."acuerdo_historial" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."agendas_personales" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."articulo_categorias" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."articulo_resenas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."articulos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."asistencia_actividades" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."autorizaciones_actividades" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bitacoras_unidad" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."categorias" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ceremonia_mensajes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ceremonias" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ciclo_propuestas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ciclo_votos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ciclos_unidad" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contactos_emergencia" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."especialidades_actividades" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."especialidades_definiciones" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."especialidades_personales" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."evaluacion_objetivos" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "insert_own" ON "public"."articulo_resenas" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "perfil_id"));



ALTER TABLE "public"."inventario" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notificaciones" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."perfiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."perfiles_ficha_medica" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."progresion_areas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."progresion_avance" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."progresion_etapas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."progresion_hitos" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "progresion_hitos_write_to_leaders" ON "public"."progresion_hitos" TO "authenticated" USING ((( SELECT "perfiles"."rol_id"
   FROM "public"."perfiles"
  WHERE ("perfiles"."id" = "auth"."uid"())) = ANY (ARRAY[1, 2, 3])));



ALTER TABLE "public"."progresion_objetivos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."proyecto_objetivos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."proyecto_participantes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."proyectos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."roles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "select_public" ON "public"."articulo_resenas" FOR SELECT USING (true);



ALTER TABLE "public"."solicitudes_competencias" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tesoreria_comprobante_detalles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tesoreria_comprobantes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tesoreria_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tesoreria_movimientos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tesoreria_rendicion_movimientos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tesoreria_rendiciones" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."unidades" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "update_own" ON "public"."articulo_resenas" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "perfil_id"));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

















































































































































































GRANT ALL ON FUNCTION "public"."es_apoderado_de"("apoderado_uuid" "uuid", "pupilo_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."es_apoderado_de"("apoderado_uuid" "uuid", "pupilo_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."es_apoderado_de"("apoderado_uuid" "uuid", "pupilo_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."es_staff"() TO "anon";
GRANT ALL ON FUNCTION "public"."es_staff"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."es_staff"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_my_rol"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_my_rol"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_my_rol"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notificar_nuevo_pendiente"() TO "anon";
GRANT ALL ON FUNCTION "public"."notificar_nuevo_pendiente"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notificar_nuevo_pendiente"() TO "service_role";



GRANT ALL ON FUNCTION "public"."puede_crear_tipo_acta"("tipo_acta" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."puede_crear_tipo_acta"("tipo_acta" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."puede_crear_tipo_acta"("tipo_acta" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."puede_ver_acta"("acta_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."puede_ver_acta"("acta_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."puede_ver_acta"("acta_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."puede_ver_acta_v2"("acta_id_param" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."puede_ver_acta_v2"("acta_id_param" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."puede_ver_acta_v2"("acta_id_param" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."verificar_automatizaciones_inventario"() TO "anon";
GRANT ALL ON FUNCTION "public"."verificar_automatizaciones_inventario"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."verificar_automatizaciones_inventario"() TO "service_role";



GRANT ALL ON FUNCTION "public"."verificar_caducidad_inventario"() TO "anon";
GRANT ALL ON FUNCTION "public"."verificar_caducidad_inventario"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."verificar_caducidad_inventario"() TO "service_role";


















GRANT ALL ON TABLE "public"."acta_acuerdos" TO "anon";
GRANT ALL ON TABLE "public"."acta_acuerdos" TO "authenticated";
GRANT ALL ON TABLE "public"."acta_acuerdos" TO "service_role";



GRANT ALL ON TABLE "public"."acta_adjuntos" TO "anon";
GRANT ALL ON TABLE "public"."acta_adjuntos" TO "authenticated";
GRANT ALL ON TABLE "public"."acta_adjuntos" TO "service_role";



GRANT ALL ON TABLE "public"."acta_firmas" TO "anon";
GRANT ALL ON TABLE "public"."acta_firmas" TO "authenticated";
GRANT ALL ON TABLE "public"."acta_firmas" TO "service_role";



GRANT ALL ON TABLE "public"."acta_participantes" TO "anon";
GRANT ALL ON TABLE "public"."acta_participantes" TO "authenticated";
GRANT ALL ON TABLE "public"."acta_participantes" TO "service_role";



GRANT ALL ON TABLE "public"."acta_temas" TO "anon";
GRANT ALL ON TABLE "public"."acta_temas" TO "authenticated";
GRANT ALL ON TABLE "public"."acta_temas" TO "service_role";



GRANT ALL ON TABLE "public"."actas" TO "anon";
GRANT ALL ON TABLE "public"."actas" TO "authenticated";
GRANT ALL ON TABLE "public"."actas" TO "service_role";



GRANT ALL ON TABLE "public"."actividades_programadas" TO "anon";
GRANT ALL ON TABLE "public"."actividades_programadas" TO "authenticated";
GRANT ALL ON TABLE "public"."actividades_programadas" TO "service_role";



GRANT ALL ON TABLE "public"."acuerdo_historial" TO "anon";
GRANT ALL ON TABLE "public"."acuerdo_historial" TO "authenticated";
GRANT ALL ON TABLE "public"."acuerdo_historial" TO "service_role";



GRANT ALL ON TABLE "public"."agendas_personales" TO "anon";
GRANT ALL ON TABLE "public"."agendas_personales" TO "authenticated";
GRANT ALL ON TABLE "public"."agendas_personales" TO "service_role";



GRANT ALL ON TABLE "public"."articulo_categorias" TO "anon";
GRANT ALL ON TABLE "public"."articulo_categorias" TO "authenticated";
GRANT ALL ON TABLE "public"."articulo_categorias" TO "service_role";



GRANT ALL ON SEQUENCE "public"."articulo_categorias_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."articulo_categorias_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."articulo_categorias_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."articulo_resenas" TO "anon";
GRANT ALL ON TABLE "public"."articulo_resenas" TO "authenticated";
GRANT ALL ON TABLE "public"."articulo_resenas" TO "service_role";



GRANT ALL ON TABLE "public"."articulos" TO "anon";
GRANT ALL ON TABLE "public"."articulos" TO "authenticated";
GRANT ALL ON TABLE "public"."articulos" TO "service_role";



GRANT ALL ON TABLE "public"."asistencia_actividades" TO "anon";
GRANT ALL ON TABLE "public"."asistencia_actividades" TO "authenticated";
GRANT ALL ON TABLE "public"."asistencia_actividades" TO "service_role";



GRANT ALL ON TABLE "public"."autorizaciones_actividades" TO "anon";
GRANT ALL ON TABLE "public"."autorizaciones_actividades" TO "authenticated";
GRANT ALL ON TABLE "public"."autorizaciones_actividades" TO "service_role";



GRANT ALL ON TABLE "public"."bitacoras_unidad" TO "anon";
GRANT ALL ON TABLE "public"."bitacoras_unidad" TO "authenticated";
GRANT ALL ON TABLE "public"."bitacoras_unidad" TO "service_role";



GRANT ALL ON TABLE "public"."categorias" TO "anon";
GRANT ALL ON TABLE "public"."categorias" TO "authenticated";
GRANT ALL ON TABLE "public"."categorias" TO "service_role";



GRANT ALL ON SEQUENCE "public"."categorias_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."categorias_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."categorias_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."ceremonia_mensajes" TO "anon";
GRANT ALL ON TABLE "public"."ceremonia_mensajes" TO "authenticated";
GRANT ALL ON TABLE "public"."ceremonia_mensajes" TO "service_role";



GRANT ALL ON TABLE "public"."ceremonias" TO "anon";
GRANT ALL ON TABLE "public"."ceremonias" TO "authenticated";
GRANT ALL ON TABLE "public"."ceremonias" TO "service_role";



GRANT ALL ON TABLE "public"."ciclo_propuestas" TO "anon";
GRANT ALL ON TABLE "public"."ciclo_propuestas" TO "authenticated";
GRANT ALL ON TABLE "public"."ciclo_propuestas" TO "service_role";



GRANT ALL ON TABLE "public"."ciclo_votos" TO "anon";
GRANT ALL ON TABLE "public"."ciclo_votos" TO "authenticated";
GRANT ALL ON TABLE "public"."ciclo_votos" TO "service_role";



GRANT ALL ON TABLE "public"."ciclos_unidad" TO "anon";
GRANT ALL ON TABLE "public"."ciclos_unidad" TO "authenticated";
GRANT ALL ON TABLE "public"."ciclos_unidad" TO "service_role";



GRANT ALL ON TABLE "public"."contactos_emergencia" TO "anon";
GRANT ALL ON TABLE "public"."contactos_emergencia" TO "authenticated";
GRANT ALL ON TABLE "public"."contactos_emergencia" TO "service_role";



GRANT ALL ON TABLE "public"."especialidades_actividades" TO "anon";
GRANT ALL ON TABLE "public"."especialidades_actividades" TO "authenticated";
GRANT ALL ON TABLE "public"."especialidades_actividades" TO "service_role";



GRANT ALL ON TABLE "public"."especialidades_definiciones" TO "anon";
GRANT ALL ON TABLE "public"."especialidades_definiciones" TO "authenticated";
GRANT ALL ON TABLE "public"."especialidades_definiciones" TO "service_role";



GRANT ALL ON TABLE "public"."especialidades_personales" TO "anon";
GRANT ALL ON TABLE "public"."especialidades_personales" TO "authenticated";
GRANT ALL ON TABLE "public"."especialidades_personales" TO "service_role";



GRANT ALL ON TABLE "public"."evaluacion_objetivos" TO "anon";
GRANT ALL ON TABLE "public"."evaluacion_objetivos" TO "authenticated";
GRANT ALL ON TABLE "public"."evaluacion_objetivos" TO "service_role";



GRANT ALL ON TABLE "public"."inventario" TO "anon";
GRANT ALL ON TABLE "public"."inventario" TO "authenticated";
GRANT ALL ON TABLE "public"."inventario" TO "service_role";



GRANT ALL ON TABLE "public"."notificaciones" TO "anon";
GRANT ALL ON TABLE "public"."notificaciones" TO "authenticated";
GRANT ALL ON TABLE "public"."notificaciones" TO "service_role";



GRANT ALL ON TABLE "public"."perfiles" TO "anon";
GRANT ALL ON TABLE "public"."perfiles" TO "authenticated";
GRANT ALL ON TABLE "public"."perfiles" TO "service_role";



GRANT ALL ON TABLE "public"."perfiles_ficha_medica" TO "anon";
GRANT ALL ON TABLE "public"."perfiles_ficha_medica" TO "authenticated";
GRANT ALL ON TABLE "public"."perfiles_ficha_medica" TO "service_role";



GRANT ALL ON TABLE "public"."progresion_areas" TO "anon";
GRANT ALL ON TABLE "public"."progresion_areas" TO "authenticated";
GRANT ALL ON TABLE "public"."progresion_areas" TO "service_role";



GRANT ALL ON SEQUENCE "public"."progresion_areas_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."progresion_areas_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."progresion_areas_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."progresion_avance" TO "anon";
GRANT ALL ON TABLE "public"."progresion_avance" TO "authenticated";
GRANT ALL ON TABLE "public"."progresion_avance" TO "service_role";



GRANT ALL ON TABLE "public"."progresion_etapas" TO "anon";
GRANT ALL ON TABLE "public"."progresion_etapas" TO "authenticated";
GRANT ALL ON TABLE "public"."progresion_etapas" TO "service_role";



GRANT ALL ON SEQUENCE "public"."progresion_etapas_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."progresion_etapas_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."progresion_etapas_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."progresion_hitos" TO "anon";
GRANT ALL ON TABLE "public"."progresion_hitos" TO "authenticated";
GRANT ALL ON TABLE "public"."progresion_hitos" TO "service_role";



GRANT ALL ON TABLE "public"."progresion_objetivos" TO "anon";
GRANT ALL ON TABLE "public"."progresion_objetivos" TO "authenticated";
GRANT ALL ON TABLE "public"."progresion_objetivos" TO "service_role";



GRANT ALL ON TABLE "public"."proyecto_objetivos" TO "anon";
GRANT ALL ON TABLE "public"."proyecto_objetivos" TO "authenticated";
GRANT ALL ON TABLE "public"."proyecto_objetivos" TO "service_role";



GRANT ALL ON TABLE "public"."proyecto_participantes" TO "anon";
GRANT ALL ON TABLE "public"."proyecto_participantes" TO "authenticated";
GRANT ALL ON TABLE "public"."proyecto_participantes" TO "service_role";



GRANT ALL ON TABLE "public"."proyectos" TO "anon";
GRANT ALL ON TABLE "public"."proyectos" TO "authenticated";
GRANT ALL ON TABLE "public"."proyectos" TO "service_role";



GRANT ALL ON TABLE "public"."roles" TO "anon";
GRANT ALL ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."solicitudes_competencias" TO "anon";
GRANT ALL ON TABLE "public"."solicitudes_competencias" TO "authenticated";
GRANT ALL ON TABLE "public"."solicitudes_competencias" TO "service_role";



GRANT ALL ON TABLE "public"."tesoreria_comprobante_detalles" TO "anon";
GRANT ALL ON TABLE "public"."tesoreria_comprobante_detalles" TO "authenticated";
GRANT ALL ON TABLE "public"."tesoreria_comprobante_detalles" TO "service_role";



GRANT ALL ON TABLE "public"."tesoreria_comprobantes" TO "anon";
GRANT ALL ON TABLE "public"."tesoreria_comprobantes" TO "authenticated";
GRANT ALL ON TABLE "public"."tesoreria_comprobantes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."tesoreria_comprobantes_folio_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tesoreria_comprobantes_folio_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tesoreria_comprobantes_folio_seq" TO "service_role";



GRANT ALL ON TABLE "public"."tesoreria_items" TO "anon";
GRANT ALL ON TABLE "public"."tesoreria_items" TO "authenticated";
GRANT ALL ON TABLE "public"."tesoreria_items" TO "service_role";



GRANT ALL ON SEQUENCE "public"."tesoreria_items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tesoreria_items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tesoreria_items_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."tesoreria_movimientos" TO "anon";
GRANT ALL ON TABLE "public"."tesoreria_movimientos" TO "authenticated";
GRANT ALL ON TABLE "public"."tesoreria_movimientos" TO "service_role";



GRANT ALL ON TABLE "public"."tesoreria_rendicion_movimientos" TO "anon";
GRANT ALL ON TABLE "public"."tesoreria_rendicion_movimientos" TO "authenticated";
GRANT ALL ON TABLE "public"."tesoreria_rendicion_movimientos" TO "service_role";



GRANT ALL ON TABLE "public"."tesoreria_rendiciones" TO "anon";
GRANT ALL ON TABLE "public"."tesoreria_rendiciones" TO "authenticated";
GRANT ALL ON TABLE "public"."tesoreria_rendiciones" TO "service_role";



GRANT ALL ON TABLE "public"."unidades" TO "anon";
GRANT ALL ON TABLE "public"."unidades" TO "authenticated";
GRANT ALL ON TABLE "public"."unidades" TO "service_role";



GRANT ALL ON SEQUENCE "public"."unidades_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."unidades_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."unidades_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";
































--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categorias VALUES (1, 'Actividades', 'actividades', NULL, NULL);
INSERT INTO public.categorias VALUES (2, 'Técnicas', 'tecnicas', NULL, NULL);
INSERT INTO public.categorias VALUES (3, 'Historia', 'historia', NULL, NULL);
INSERT INTO public.categorias VALUES (4, 'Administrativo', 'administrativo', NULL, NULL);
INSERT INTO public.categorias VALUES (5, 'Ciudadanía', 'ciudadania', NULL, NULL);
INSERT INTO public.categorias VALUES (6, 'Reflexión', 'reflexion', NULL, NULL);
INSERT INTO public.categorias VALUES (7, 'Juegos', 'juegos', 1, NULL);
INSERT INTO public.categorias VALUES (8, 'Juegos Democráticos', 'juegos-democraticos', 1, NULL);
INSERT INTO public.categorias VALUES (9, 'Juegos Nocturnos', 'juegos-nocturnos', 1, NULL);
INSERT INTO public.categorias VALUES (10, 'Dinámicas', 'dinamicas', 1, NULL);
INSERT INTO public.categorias VALUES (11, 'Talleres', 'talleres', 1, NULL);
INSERT INTO public.categorias VALUES (12, 'Apoderados', 'apoderados', 4, NULL);
INSERT INTO public.categorias VALUES (13, 'Información', 'informacion', 4, NULL);
INSERT INTO public.categorias VALUES (14, 'Biografías', 'biografias', 3, NULL);
INSERT INTO public.categorias VALUES (15, 'Historia Scout', 'historia-scout', 3, NULL);
INSERT INTO public.categorias VALUES (16, 'Historias Scouts', 'historias-scouts', 3, NULL);
INSERT INTO public.categorias VALUES (17, 'Animación', 'animacion', 2, NULL);
INSERT INTO public.categorias VALUES (18, 'Cabuyería', 'cabuyeria', 2, NULL);
INSERT INTO public.categorias VALUES (19, 'Campismo', 'campismo', 2, NULL);
INSERT INTO public.categorias VALUES (20, 'Claves y Pistas', 'claves-y-pistas', 2, NULL);
INSERT INTO public.categorias VALUES (21, 'Cocina', 'cocina', 2, NULL);
INSERT INTO public.categorias VALUES (22, 'Pionerismo', 'pionerismo', 2, NULL);
INSERT INTO public.categorias VALUES (23, 'Primeros Auxilios', 'primeros-auxilios', 2, NULL);


--
-- Data for Name: unidades; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.unidades VALUES (1, 'Manada', 'Niños y niñas de 7 a 11 años', '/images/logos/iconos_UnidadesManada.webp', '{"primario": "#f5cd16", "textoDark": "#1a2a44", "secundario": "#2b2c77", "textoLight": "#ffffff"}', '2026-06-11 07:13:19.360568+00', '/images/logos/iconos_UnidadesManada.webp', '/images/logos/iconos_lobatos.svg');
INSERT INTO public.unidades VALUES (2, 'Compañía', 'Guías de 11 a 15 años', '/images/logos/iconos_UnidadesCia.webp', '{"primario": "#00b7dc", "textoDark": "#083344", "secundario": "#e7a913", "textoLight": "#ffffff"}', '2026-06-11 07:13:19.360568+00', '/images/logos/iconos_UnidadesCia.webp', '/images/logos/iconos_guias.svg');
INSERT INTO public.unidades VALUES (3, 'Tropa', 'Scouts de 11 a 15 años', '/images/logos/iconos_UnidadesTropa.webp', '{"primario": "#1e592d", "textoDark": "#14532d", "secundario": "#FFFFFF", "textoLight": "#ffffff"}', '2026-06-11 07:13:19.360568+00', '/images/logos/iconos_UnidadesTropa.webp', '/images/logos/iconos_scouts.svg');
INSERT INTO public.unidades VALUES (4, 'Avanzada', 'Pioneros y pioneras de 15 a 17 años', '/images/logos/iconos_UnidadesAvanzada.webp', '{"primario": "#4a3f8c", "textoDark": "#14532d", "secundario": "#FFFFFF", "textoLight": "#ffffff"}', '2026-06-11 07:13:19.360568+00', '/images/logos/iconos_UnidadesAvanzada.webp', '/images/logos/iconos_pioneres.svg');
INSERT INTO public.unidades VALUES (5, 'Clan', 'Rutas de 17 a 20 años', '/images/logos/iconos_UnidadesClan.webp', '{"primario": "#e32328", "textoDark": "#14532d", "secundario": "#fac620", "textoLight": "#ffffff"}', '2026-06-11 07:13:19.360568+00', '/images/logos/iconos_UnidadesClan.webp', '/images/logos/iconos_caminantes.svg');


--
-- Data for Name: especialidades_definiciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.especialidades_definiciones VALUES ('3bdd6803-c170-43bc-a520-1cddd5398b86', 1, 'arte_expresion', 'Música', 'Aprende a tocar un instrumento o a entonar canciones del grupo.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('7799ca83-7998-4c6c-81d1-5e92b50a65f7', 1, 'ciencia_tecnologia', 'Drones', 'Pilotaje seguro de cuadricópteros y conocimiento aerodinámico.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('c78034ac-76cd-485b-8e03-0407fc998c51', 1, 'espiritual', 'Animación de la Fe', 'Acompañamiento en oraciones, reflexión e historias de fe.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('901121b7-5d00-4499-85c7-70a3b4af2db6', 1, 'espiritual', 'Tradiciones Indígenas', 'Conocimiento de cosmovisiones y respeto por pueblos originarios.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('c7a58058-8210-4662-8e65-b7fbe2e2ece9', 1, 'espiritual', 'Mandalas', 'Pintura y diseño geométrico enfocado en la relajación.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('48af01d8-b90d-4c0f-9c17-b3e4006f8c4e', 1, 'servicio_comunidad', 'Bullying', 'Campañas preventivas de ciberacoso y sana convivencia.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('fa8e306b-08b5-434c-a93a-0890d1e18920', 2, 'aire_libre', 'Pionerismo', 'Grandes amarres, diseño estructural de puentes o torres con troncos.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('91fc0f66-bd64-44b6-924e-ec5815e21084', 2, 'aire_libre', 'Zoología', 'Estudio de fauna local, huellas y conservación de biodiversidad.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('ee0143d5-16b8-4a32-8bb1-7eac70a3edcd', 2, 'arte_expresion', 'Cine', 'Fotografía cinematográfica, edición de video o guiones scouts.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('5e31f855-5bc1-43f5-ae46-b47024d813f8', 2, 'arte_expresion', 'Modelismo', 'Maquetación e impresión 3D a escala de objetos o campamentos.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('369b86ad-8db2-4b26-871b-bafc3c746d59', 2, 'arte_expresion', 'Alfarería', 'Técnicas de modelado, secado y horneado de arcilla.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('46e33af8-1ffb-49f8-b2e7-d60439495eab', 2, 'ciencia_tecnologia', 'Química', 'Experimentos caseros y comprensión de reacciones básicas.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('7cb1d20d-1f84-4a57-a6c2-7c605d280bea', 2, 'ciencia_tecnologia', 'Cartografía', 'Dibujo de croquis topográficos, escalas y altimetrías.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('2876fb18-613d-4d6c-88ca-f8cd90ff178c', 2, 'ciencia_tecnologia', 'Electrónica', 'Soldadura, armado de circuitos y componentes electrónicos basicos.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('f122b5c1-bf94-4d4d-81eb-94fc3e64339b', 2, 'ciencia_tecnologia', 'Carpintería', 'Uso seguro de serrucho, cepillo y uniones de madera.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('ba4aab22-a5bc-41a8-8833-14c2565b03fb', 2, 'ciencia_tecnologia', 'Reparaciones', 'Taller de electricidad, plomería o reparaciones domésticas.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('541b4160-f773-4430-9f11-cd2eecff80b3', 1, 'deportes', 'Kayak', 'Desplazamiento en kayak, técnicas de paleo y seguridad en el agua.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('921fe863-6dea-4c20-9457-68b79163968e', 1, 'deportes', 'Skate', 'Uso de la patineta, trucos, equilibrio y medidas de seguridad.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('ca330e64-e88c-4fef-b381-e5f4a51077c8', 1, 'deportes', 'Natación', 'Técnicas de nado, estilos, resistencia y salvamento acuático.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('74f64324-dc02-4b9c-8378-8a58431a2049', 1, 'deportes', 'Patinaje', 'Desplazamiento sobre patines en línea o tradicionales y equilibrio.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('944635d1-2a64-4304-86b1-0d9d56c1e2eb', 1, 'deportes', 'Fútbol', 'Tácticas, dominio del balón y trabajo en equipo sobre la cancha.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('01ccdc00-1a45-4e78-b438-9586cac0d970', 1, 'arte_expresion', 'Circo', 'Técnicas de malabarismo, equilibrio, acrobacias y artes escénicas afines.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('26cafeb8-4da0-4636-a626-f2461cb2816b', 1, 'arte_expresion', 'Escultura', 'Moldeado en arcilla, madera u otros materiales para crear formas tridimensionales.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('6f181bd5-4272-498b-818b-d4e67d89ccdc', 1, 'arte_expresion', 'Lettering', 'Como caligrafía artística o escritura dibujada creativamente a mano.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('e7508eaf-c181-48e9-9916-cedccf1d3735', 1, 'arte_expresion', 'Pintura', 'Uso del color, pinceles y diversas técnicas sobre lienzo o papel.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('8f1f0822-d9bc-46c5-ad85-a73e996a343c', 1, 'arte_expresion', 'Teatro', 'Montaje escénico, dirección, expresión dramática y puesta en escena.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('96b5f3e4-009d-46e1-bbe9-521b6064a31b', 1, 'ciencia_tecnologia', 'Astronomía', 'Reconocimiento de constelaciones, planetas, galaxias y fenómenos celestes.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('fd9e0748-c871-4095-bc14-8c8a4555c1e7', 1, 'ciencia_tecnologia', 'Botánica', 'Clasificación y estudio de la flora local, hierbas medicinales y árboles.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('63b75834-2822-4047-b3eb-fcdd3a0ac1f3', 1, 'ciencia_tecnologia', 'Construcción', 'Principios de edificación, uso seguro de herramientas y maquetas.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('84f60b23-8680-40d9-842a-9a242ec1acb4', 1, 'ciencia_tecnologia', 'Dinosaurios', 'Estudio de las especies prehistóricas de dinosaurios y sus ecosistemas.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('46b965da-0a31-47e3-ae93-9500981fa8a3', 1, 'ciencia_tecnologia', 'Robótica', 'Programación y armado de robots sencillos con sensores y motores.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('c6e8b71a-5913-4253-a399-dc6b97dd20f6', 1, 'espiritual', 'Meditación', 'Técnicas de respiración, mindfulness y búsqueda del equilibrio interior.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('86209f1b-d314-43cd-8f08-3154704d0742', 1, 'espiritual', 'Yoga', 'Posturas físicas, estiramientos, equilibrio y respiración consciente.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('f0903e0b-c089-43d1-bf1e-2ec8a6a09433', 1, 'servicio_comunidad', 'Cuidado de Animales', 'Tenencia responsable, alimentación y primeros auxilios para mascotas.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('bb7627d3-220b-4779-b5e3-e056eb6e5e7b', 1, 'servicio_comunidad', 'Lengua de Señas', 'Vocabulario básico, abecedario dactilológico y comunicación inclusiva básica.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('89243d95-2824-46c1-9753-537f533f67f9', 1, 'servicio_comunidad', 'Primeros Auxilios', 'Tratamiento de heridas leves, quemaduras, vendajes y RCP básico.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('e1539e32-632a-4e3a-8818-c4e08c3ac079', 1, 'aire_libre', 'Campismo', 'Técnicas de campamento, instalación de carpas y organización de mochila.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('d565b12c-65a2-4ecc-9d97-0e33bbc9a3be', 1, 'aire_libre', 'Nudos', 'Técnicas de cabuyería, nudos útiles y su aplicación práctica.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('537ff805-1c98-4f03-8439-df02b479e4cb', 1, 'aire_libre', 'Orientación', 'Lectura de mapas, uso de la brújula, GPS y orientación por astros.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('03a3da96-65c1-4fda-b151-f288a492cb2a', 1, 'aire_libre', 'Trekking', 'Senderismo responsable, técnicas de caminata y equipo técnico.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('39904d88-438d-46a3-953e-8927c46cd78a', 1, 'aire_libre', 'Claves', 'Lectura y cifrado de mensajes usando clave morse, semáforo u otras.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('6377e920-d2e6-4ba4-9580-7f80fbd2cb46', 1, 'aire_libre', 'Supervivencia', 'Técnicas básicas para conseguir agua, refugio improvisado y fuego controlado.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('a9ec19d7-2122-46c3-a95f-96f553ea2e44', 2, 'deportes', 'Ciclismo', 'Técnicas de pedaleo, mantenimiento de la bicicleta y rutas seguras.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('7f77af5c-082f-4fd9-a9e2-f3a6e17982a7', 2, 'deportes', 'Atletismo', 'Práctica de carreras, saltos y lanzamientos competitivos o recreativos.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('3d731af4-94fb-4a54-8136-c0e184901610', 2, 'deportes', 'Montañismo', 'Técnicas de marcha en montaña, aclimatación y respeto por la altura.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('6b326b6e-4ff5-495b-9940-c0bec45a5304', 2, 'arte_expresion', 'Canto', 'Técnicas de respiración, afinación y expresión vocal.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('138969e2-502f-457b-88dc-5715ba6f3e30', 2, 'arte_expresion', 'Teatro', 'Montaje escénico, dirección, expresión dramática y puesta en escena.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('c44aba31-09cf-4c85-96c5-7e8b23fd3f3d', 2, 'arte_expresion', 'Repostería', 'Preparación de postres, masas dulces, pastelería y técnicas de horneado.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('4d10257e-ccc5-4270-b933-8196be31907f', 2, 'ciencia_tecnologia', 'Botánica', 'Clasificación y estudio de la flora local, hierbas medicinales y árboles.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('cc4cfe97-2ac5-4598-85ed-377dd9ec9568', 2, 'aire_libre', 'Campismo', 'Técnicas de campamento, instalación de carpas y organización de mochila.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('6a727ee0-3a8d-4d2e-aeb5-339615dd197f', 2, 'aire_libre', 'Supervivencia', 'Técnicas básicas para conseguir agua, refugio improvisado y fuego controlado.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('d3da0e97-14f6-46d7-a51d-8aa0e25ffaed', 2, 'deportes', 'Orientación Terrestre', 'Lectura de brújula militar, azimut y navegación en terreno.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('7ae36140-d19d-4118-be2d-4d24bc160e59', 2, 'servicio_comunidad', 'Socorrismo', 'Rescate en agua, zonas de riesgo o evacuaciones planificadas.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('59e22a4c-38f7-43cc-b579-5d51e0e5e901', 2, 'servicio_comunidad', 'Civismo', 'Participación democrática, juntas vecinales y derechos ciudadanos.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('cf79a0ff-d318-47b3-83f9-584fc1af9784', 2, 'servicio_comunidad', 'Hermandad Mundial', 'Lazos con grupos internacionales y proyectos del programa scout mundial.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('a34a821f-7ce8-47e5-8df4-8918709e3a6e', 2, 'servicio_comunidad', 'No Dejar Rastro', 'Principios éticos de mínimo impacto ecológico al aire libre.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('505779cd-3fe9-45e1-80b4-1ceb4594a15c', 3, 'aire_libre', 'Pionerismo', 'Grandes amarres, diseño estructural de puentes o torres con troncos.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('c33dd21d-505a-49f2-8bf6-79ed13e13295', 3, 'aire_libre', 'Zoología', 'Estudio de fauna local, huellas y conservación de biodiversidad.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('ddfe8e62-37c6-4b93-8fe6-03ea27acb073', 3, 'arte_expresion', 'Cine', 'Fotografía cinematográfica, edición de video o guiones scouts.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('9f32ef5e-cf73-44d4-9ed0-cbbbf4bd8d38', 3, 'arte_expresion', 'Modelismo', 'Maquetación e impresión 3D a escala de objetos o campamentos.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('bd1c505a-f4f4-4561-be51-14ad481b8d06', 3, 'arte_expresion', 'Alfarería', 'Técnicas de modelado, secado y horneado de arcilla.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('4b92de37-7d07-4da4-9ded-020a88173270', 3, 'ciencia_tecnologia', 'Química', 'Experimentos caseros y comprensión de reacciones básicas.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('f059ac18-f5ec-457b-8e25-8d66032c7e37', 3, 'ciencia_tecnologia', 'Cartografía', 'Dibujo de croquis topográficos, escalas y altimetrías.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('4b5e472f-8674-42cf-a607-7dff16b6c645', 3, 'ciencia_tecnologia', 'Electrónica', 'Soldadura, armado de circuitos y componentes electrónicos basicos.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('0fe64c6c-9f9d-4719-b387-00e1c07238e6', 3, 'ciencia_tecnologia', 'Carpintería', 'Uso seguro de serrucho, cepillo y uniones de madera.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('c118a50f-26f0-497d-a7f9-f5be8b409c8b', 3, 'ciencia_tecnologia', 'Reparaciones', 'Taller de electricidad, plomería o reparaciones domésticas.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('46bb1da6-09bc-4520-be8e-644fa34f0522', 3, 'deportes', 'Orientación Terrestre', 'Lectura de brújula militar, azimut y navegación en terreno.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('baa06929-60e4-4d70-9d8d-18714588fd72', 3, 'servicio_comunidad', 'Socorrismo', 'Rescate en agua, zonas de riesgo o evacuaciones planificadas.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('2141fe26-e608-4b45-9a65-73b5a73601af', 3, 'servicio_comunidad', 'Civismo', 'Participación democrática, juntas vecinales y derechos ciudadanos.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('a480572a-3b81-4c5d-978b-9d0774b16c59', 3, 'servicio_comunidad', 'Hermandad Mundial', 'Lazos con grupos internacionales y proyectos del programa scout mundial.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('6aa94776-0e71-483f-9074-d88e667c4664', 3, 'servicio_comunidad', 'No Dejar Rastro', 'Principios éticos de mínimo impacto ecológico al aire libre.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('489671ea-06e7-4688-beb5-a567dc1a688e', 1, 'deportes', 'Surf', 'Práctica de deslizamiento sobre olas usando una tabla, equilibrio y conocimiento del mar.', NULL, '2026-06-24 22:06:58.294986+00');
INSERT INTO public.especialidades_definiciones VALUES ('cbf0169f-d1b5-45b5-b160-8036d337d625', 1, 'deportes', 'Preparación Física', 'Entrenamiento integral para mejorar la fuerza, resistencia y salud corporal.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('56b4a50b-75bc-4cc4-8b98-7e21de58af9e', 1, 'deportes', 'Crossfit', 'Entrenamiento de alta intensidad con movimientos funcionales variados.', NULL, '2026-06-24 22:06:58.300393+00');
INSERT INTO public.especialidades_definiciones VALUES ('7f57826e-d52a-439b-b453-a71f6fe441f3', 1, 'deportes', 'Canotaje', 'Navegación en canoa enfocada en la propulsión y técnicas de remo.', NULL, '2026-06-24 22:06:58.301863+00');
INSERT INTO public.especialidades_definiciones VALUES ('c3413654-7b83-433c-94e3-88722cf1c478', 1, 'deportes', 'Parkour', 'Disciplina de superación de obstáculos urbanos o naturales usando el cuerpo.', NULL, '2026-06-24 22:06:58.305245+00');
INSERT INTO public.especialidades_definiciones VALUES ('0244792f-ff0e-4589-80c5-a3218fbaaafa', 1, 'deportes', 'Ciclismo', 'Técnicas de pedaleo, mantenimiento de la bicicleta y rutas seguras.', NULL, '2026-06-24 22:06:58.307986+00');
INSERT INTO public.especialidades_definiciones VALUES ('5dac1d6a-d009-47b3-9a76-dfc23b36dbac', 1, 'deportes', 'Mountain bike', 'Ciclismo en terrenos montañosos, descenso y superación de obstáculos.', NULL, '2026-06-24 22:06:58.309112+00');
INSERT INTO public.especialidades_definiciones VALUES ('2a4143ba-5bc6-4708-9d48-f6d62b22f403', 1, 'deportes', 'Atletismo', 'Práctica de carreras, saltos y lanzamientos competitivos o recreativos.', NULL, '2026-06-24 22:06:58.312319+00');
INSERT INTO public.especialidades_definiciones VALUES ('47df494d-96f7-4d4d-b696-886b4a21e18a', 1, 'deportes', 'Artes marciales', 'Práctica de defensa personal, disciplina, autocontrol y respeto.', NULL, '2026-06-24 22:06:58.313345+00');
INSERT INTO public.especialidades_definiciones VALUES ('2bd8f43f-e419-411c-8dd5-2686afde7bb3', 1, 'deportes', 'Basketball', 'Fundamentos tácticos, dribling, pases y lanzamientos en equipo.', NULL, '2026-06-24 22:06:58.314438+00');
INSERT INTO public.especialidades_definiciones VALUES ('f2d76098-1011-4c27-9008-c352b73fa63c', 1, 'deportes', 'Boxeo', 'Técnicas de golpeo, defensa, esquiva y acondicionamiento físico del pugilismo.', NULL, '2026-06-24 22:06:58.315671+00');
INSERT INTO public.especialidades_definiciones VALUES ('d9dfc100-0db0-47d9-ad06-b4e3568dafff', 1, 'deportes', 'Lucha', 'Técnicas de derribo, control y sumisión en disciplinas de combate.', NULL, '2026-06-24 22:06:58.316661+00');
INSERT INTO public.especialidades_definiciones VALUES ('60ec83e3-651c-4033-96b6-3f6f093f2072', 1, 'deportes', 'Handball', 'Pases, tiros a portería y juego colectivo con las manos.', NULL, '2026-06-24 22:06:58.319197+00');
INSERT INTO public.especialidades_definiciones VALUES ('566193ec-8f20-4350-8f8f-28393d73c146', 1, 'deportes', 'Montañismo', 'Técnicas de marcha en montaña, aclimatación y respeto por la altura.', NULL, '2026-06-24 22:06:58.320695+00');
INSERT INTO public.especialidades_definiciones VALUES ('05fe1828-7979-4147-aa15-7c0f2c2c94d1', 1, 'deportes', 'Escalada', 'Ascenso en roca o muro artificial, uso de arnés, cuerdas y seguridad.', NULL, '2026-06-24 22:06:58.322027+00');
INSERT INTO public.especialidades_definiciones VALUES ('23e69254-a93c-48c7-b1e8-4be43699031d', 1, 'deportes', 'Descenso', 'Técnicas de rápel y descenso controlado en laderas u obstáculos.', NULL, '2026-06-24 22:06:58.323374+00');
INSERT INTO public.especialidades_definiciones VALUES ('a50119e8-9500-4059-a11f-75585174e2e8', 1, 'deportes', 'Tenis', 'Técnicas de raqueta, saques, golpes y reglas del juego en cancha.', NULL, '2026-06-24 22:06:58.324715+00');
INSERT INTO public.especialidades_definiciones VALUES ('2e9971c7-e8b9-4fd5-b8d6-76a7ca466bc2', 1, 'deportes', 'Pádel', 'Juego de palas, rebotes en paredes y dinámica de dobles.', NULL, '2026-06-24 22:06:58.32593+00');
INSERT INTO public.especialidades_definiciones VALUES ('7283f65d-7dd6-463b-abb4-e4b72a6d4b0a', 1, 'deportes', 'Tenis de Mesa', 'Reflejos, golpes con efecto y agilidad mental con la paleta.', NULL, '2026-06-24 22:06:58.327317+00');
INSERT INTO public.especialidades_definiciones VALUES ('5ee9bfad-cdb6-495c-a15f-87e66e67cb56', 1, 'deportes', 'Rugby', 'Tácticas de juego, pases hacia atrás, tackles y espíritu de equipo.', NULL, '2026-06-24 22:06:58.328415+00');
INSERT INTO public.especialidades_definiciones VALUES ('7a51d4ea-79e9-40e9-8982-232c5e2a32ad', 1, 'deportes', 'Vóleibol', 'Saques, recepciones, voleos, remates y juego en red.', NULL, '2026-06-24 22:06:58.329543+00');
INSERT INTO public.especialidades_definiciones VALUES ('9cbe3ac1-c6c6-46d1-8f8f-87072000f2d9', 1, 'deportes', 'Ajedrez', 'Estrategia, táctica, aperturas y desarrollo del pensamiento lógico.', NULL, '2026-06-24 22:06:58.331363+00');
INSERT INTO public.especialidades_definiciones VALUES ('8ebde1e8-20b3-4e9a-9fc2-f705a4f00b71', 3, 'deportes', 'Ciclismo', 'Técnicas de pedaleo, mantenimiento de la bicicleta y rutas seguras.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('087eda3b-1184-4838-8ad7-4e071922f8ed', 3, 'deportes', 'Atletismo', 'Práctica de carreras, saltos y lanzamientos competitivos o recreativos.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('9573412e-469d-4b38-a2a5-e5e2bd94f5de', 3, 'deportes', 'Montañismo', 'Técnicas de marcha en montaña, aclimatación y respeto por la altura.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('a6071654-7113-40d1-8718-ab812bae65c6', 3, 'arte_expresion', 'Danza', 'Estudio y ejecución de danzas folclóricas, clásicas o contemporáneas.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('46a6869a-e06a-46d2-a617-95d5f1d2f9e3', 3, 'arte_expresion', 'Canto', 'Técnicas de respiración, afinación y expresión vocal.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('c6b1fa7a-dd13-4f52-a451-6a99c76da629', 3, 'arte_expresion', 'Teatro', 'Montaje escénico, dirección, expresión dramática y puesta en escena.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('c35e2d26-a4ea-46c2-895f-3b7c8013f61d', 3, 'ciencia_tecnologia', 'Botánica', 'Clasificación y estudio de la flora local, hierbas medicinales y árboles.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('ab4c4485-3f5f-4fdd-a614-583dded275ec', 3, 'servicio_comunidad', 'Primeros Auxilios', 'Tratamiento de heridas leves, quemaduras, vendajes y RCP básico.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('bd572c49-c695-4b76-9bb2-a39fd90a738b', 3, 'aire_libre', 'Campismo', 'Técnicas de campamento, instalación de carpas y organización de mochila.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('91652d27-caaf-4268-ab3c-18ddaeda2cf2', 3, 'aire_libre', 'Supervivencia', 'Técnicas básicas para conseguir agua, refugio improvisado y fuego controlado.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('594a5a40-8a7d-4ecd-9407-9ddb14cce874', 1, 'deportes', 'Juegos de Cartas', 'Estrategias, reglas y socialización mediante juegos de naipes.', NULL, '2026-06-24 22:06:58.332813+00');
INSERT INTO public.especialidades_definiciones VALUES ('8c54f8b5-7991-45f7-a874-e2e479694ea5', 1, 'deportes', 'Cubos Rubik', 'Algoritmos, velocidad y resolución del rompecabezas tridimensional.', NULL, '2026-06-24 22:06:58.334467+00');
INSERT INTO public.especialidades_definiciones VALUES ('92141a89-16cf-47f9-b423-c98e3ae8196a', 1, 'deportes', 'Juego de Pañolines', 'Juegos tradicionales scouts de agilidad, estrategia y trabajo en equipo.', NULL, '2026-06-24 22:06:58.335687+00');
INSERT INTO public.especialidades_definiciones VALUES ('3157136b-2513-45d0-aa61-e81bf7261c01', 1, 'arte_expresion', 'Artesanía', 'Creación de piezas decorativas o utilitarias con técnicas manuales y materiales diversos.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('41e1acf3-edc5-45d4-81e3-b737a9d73f8c', 1, 'arte_expresion', 'Baile', 'Expresión corporal a través de ritmos modernos y populares.', NULL, '2026-06-24 22:06:58.338238+00');
INSERT INTO public.especialidades_definiciones VALUES ('3bd4ff0e-2504-4d20-a3a7-3c50e7359915', 1, 'arte_expresion', 'Danza', 'Estudio y ejecución de danzas folclóricas, clásicas o contemporáneas.', NULL, '2026-06-24 22:06:58.339356+00');
INSERT INTO public.especialidades_definiciones VALUES ('1633b9ed-48de-4c67-b359-4b78daad95cf', 1, 'arte_expresion', 'Coreografías', 'Creación y dirección de rutinas de baile coordinadas en grupo.', NULL, '2026-06-24 22:06:58.340388+00');
INSERT INTO public.especialidades_definiciones VALUES ('a2b90b35-fbd1-4c40-b3be-386d7202af2f', 1, 'arte_expresion', 'Canto', 'Técnicas de respiración, afinación y expresión vocal.', NULL, '2026-06-24 22:06:58.341427+00');
INSERT INTO public.especialidades_definiciones VALUES ('31cca5b0-f50c-4994-a821-4f51525fad01', 1, 'arte_expresion', 'Intérprete', 'Ejecución vocal o instrumental de piezas musicales de diversos autores.', NULL, '2026-06-24 22:06:58.342436+00');
INSERT INTO public.especialidades_definiciones VALUES ('5162dd43-d824-4d54-85d8-9454260d7e86', 1, 'arte_expresion', 'MC', 'Habilidades de animación, rima, improvisación y dominio del escenario.', NULL, '2026-06-24 22:06:58.343648+00');
INSERT INTO public.especialidades_definiciones VALUES ('00f139aa-e4fc-4a8c-b05a-aeaa2bedc8d7', 1, 'arte_expresion', 'Freestyle', 'Rap e improvisación lírica sobre bases rítmicas al instante.', NULL, '2026-06-24 22:06:58.345046+00');
INSERT INTO public.especialidades_definiciones VALUES ('0b192dfa-78b7-4ab9-8b59-8505c0107579', 1, 'arte_expresion', 'Diseño', 'Fundamentos visuales, maquetación y comunicación gráfica creativa.', NULL, '2026-06-24 22:06:58.347755+00');
INSERT INTO public.especialidades_definiciones VALUES ('ba93f985-90d7-48e7-824e-3e728aed92d0', 1, 'arte_expresion', 'Dibujo', 'Técnicas de trazo, perspectiva, sombras y boceteado.', NULL, '2026-06-24 22:06:58.348999+00');
INSERT INTO public.especialidades_definiciones VALUES ('d360220a-e965-42ff-9c30-52016090a3ab', 1, 'arte_expresion', 'Comics', 'Creación de historias ilustradas mediante viñetas y narrativa secuencial.', NULL, '2026-06-24 22:06:58.350069+00');
INSERT INTO public.especialidades_definiciones VALUES ('41bc0380-bee5-4898-b8e5-3782f69bc615', 1, 'arte_expresion', 'Manga', 'Estilo de dibujo japonés, entintado y narrativa visual característica.', NULL, '2026-06-24 22:06:58.351107+00');
INSERT INTO public.especialidades_definiciones VALUES ('f940d804-5605-43f5-a973-676999e02a57', 1, 'arte_expresion', 'Animé', 'Estudio del arte de la animación japonesa, diseño de personajes y animación.', NULL, '2026-06-24 22:06:58.352187+00');
INSERT INTO public.especialidades_definiciones VALUES ('31e0b7ad-17d6-42c0-ad2a-066a0537d559', 1, 'arte_expresion', 'Interpretación', 'Actuación teatral o dramática encarnando personajes con voz y cuerpo.', NULL, '2026-06-24 22:06:58.353514+00');
INSERT INTO public.especialidades_definiciones VALUES ('a43e38aa-805c-4aac-9c94-43c6acfe50f1', 1, 'arte_expresion', 'Cosplay', 'Diseño y confección de disfraces representando personajes de ficción.', NULL, '2026-06-24 22:06:58.354627+00');
INSERT INTO public.especialidades_definiciones VALUES ('8d2b64c9-3e56-4041-b187-a354bed8b408', 1, 'arte_expresion', 'Cuentacuentos', 'Narración oral de historias de manera expresiva y cautivadora.', NULL, '2026-06-24 22:06:58.355641+00');
INSERT INTO public.especialidades_definiciones VALUES ('43aa8734-6601-400a-ae6b-410dad09bebd', 1, 'arte_expresion', 'Fotografía', 'Uso de cámara, encuadre, iluminación y edición de imágenes.', NULL, '2026-06-24 22:06:58.35765+00');
INSERT INTO public.especialidades_definiciones VALUES ('678ad83f-fab8-4fb7-a421-f7e10ca9e755', 1, 'arte_expresion', 'Globoflexia', 'Creación de figuras creativas mediante el inflado y torsión de globos.', NULL, '2026-06-24 22:06:58.358833+00');
INSERT INTO public.especialidades_definiciones VALUES ('d1e6b61b-5f05-4498-8799-590533bcfc2c', 1, 'arte_expresion', 'Magia', 'Ilusionismo, trucos con cartas u objetos y entretenimiento escénico.', NULL, '2026-06-24 22:06:58.361886+00');
INSERT INTO public.especialidades_definiciones VALUES ('5829d9be-37f4-4f24-bd3b-dd206e8bb4b7', 1, 'arte_expresion', 'Malabarismo', 'Manipulación coordinada de múltiples objetos en el aire.', NULL, '2026-06-24 22:06:58.363198+00');
INSERT INTO public.especialidades_definiciones VALUES ('f6ac4f6e-cb82-4c97-a651-78b09ecb5e31', 1, 'arte_expresion', 'Mimo', 'Teatro gestual, lenguaje corporal e historias sin palabras.', NULL, '2026-06-24 22:06:58.364625+00');
INSERT INTO public.especialidades_definiciones VALUES ('2192a771-bc14-4e54-a4cc-2e4542bea6d9', 1, 'arte_expresion', 'Origami', 'Creación de figuras mediante el plegado de papel sin usar tijeras ni pegamento.', NULL, '2026-06-24 22:06:58.366043+00');
INSERT INTO public.especialidades_definiciones VALUES ('fe89f021-71d7-405d-b792-3c093e41a20d', 1, 'arte_expresion', 'Actuación', 'Técnicas de actuación para cine, televisión o artes representativas.', NULL, '2026-06-24 22:06:58.3696+00');
INSERT INTO public.especialidades_definiciones VALUES ('d83be77d-7459-4e23-8a70-bb042107ad7f', 1, 'arte_expresion', 'Tejido', 'Confección de prendas o accesorios usando agujas, crochet o telares.', NULL, '2026-06-24 22:06:58.371121+00');
INSERT INTO public.especialidades_definiciones VALUES ('8e44537f-2c4a-4b30-9fe1-4ae20728c96d', 1, 'arte_expresion', 'Bordado', 'Decoración de telas mediante costuras con hilos de colores a mano.', NULL, '2026-06-24 22:06:58.37229+00');
INSERT INTO public.especialidades_definiciones VALUES ('8093fb9a-f526-4021-ae92-06599ce39594', 1, 'arte_expresion', 'Vestuario', 'Diseño y selección de prendas de vestir para representaciones o uso temático.', NULL, '2026-06-24 22:06:58.373417+00');
INSERT INTO public.especialidades_definiciones VALUES ('7d2061c4-5fa2-4a36-8ebb-84e3e792a296', 1, 'arte_expresion', 'Confección', 'Corte, costura y armado de prendas textiles a partir de patrones.', NULL, '2026-06-24 22:06:58.374654+00');
INSERT INTO public.especialidades_definiciones VALUES ('7e8ab871-a308-4a75-9797-c436587e8207', 1, 'arte_expresion', 'Armónica', 'Técnicas de respiración y ejecución del instrumento de viento metal.', NULL, '2026-06-24 22:06:58.375913+00');
INSERT INTO public.especialidades_definiciones VALUES ('f2d46d15-4224-413b-ac91-0603f2cb13e5', 1, 'arte_expresion', 'Bajo', 'Estudio del bajo eléctrico, ritmos, acordes y acompañamiento musical.', NULL, '2026-06-24 22:06:58.377099+00');
INSERT INTO public.especialidades_definiciones VALUES ('7665e545-8603-4169-b1dd-521ffb490739', 1, 'arte_expresion', 'Batería', 'Coordinación, ritmo y percusión en la batería acústica o electrónica.', NULL, '2026-06-24 22:06:58.378191+00');
INSERT INTO public.especialidades_definiciones VALUES ('a5fbb4a1-5fd9-494e-9c63-29026b099821', 1, 'arte_expresion', 'DJ', 'Mezcla de pistas musicales, ecualización y animación en vivo.', NULL, '2026-06-24 22:06:58.379291+00');
INSERT INTO public.especialidades_definiciones VALUES ('7e872d33-88dc-4b2d-be5f-e9413bb5eab8', 1, 'arte_expresion', 'Beatmaker', 'Creación y producción de bases musicales y ritmos digitales.', NULL, '2026-06-24 22:06:58.380368+00');
INSERT INTO public.especialidades_definiciones VALUES ('e749a023-7589-45d2-a8f2-10db7b1f4fe2', 1, 'arte_expresion', 'Guitarra', 'Técnicas de punteo, acordes, rasgueos y afinación de la guitarra.', NULL, '2026-06-24 22:06:58.381531+00');
INSERT INTO public.especialidades_definiciones VALUES ('017d7c37-4807-47f2-b2e0-f47787f547ce', 1, 'arte_expresion', 'Violín', 'Postura, uso del arco y afinación en el instrumento de cuerda frotada.', NULL, '2026-06-24 22:06:58.382952+00');
INSERT INTO public.especialidades_definiciones VALUES ('31a7fb31-b3b6-4eab-ba30-9f1cd3e60acf', 1, 'arte_expresion', 'Piano', 'Lectura musical, digitación y técnicas del teclado.', NULL, '2026-06-24 22:06:58.384319+00');
INSERT INTO public.especialidades_definiciones VALUES ('7da3609b-eb56-42f7-b26e-0b7ffe78ede4', 1, 'arte_expresion', 'Flauta', 'Ejecución de flauta dulce o traversa y lectura de partituras.', NULL, '2026-06-24 22:06:58.385738+00');
INSERT INTO public.especialidades_definiciones VALUES ('44f065e7-9ac0-4703-bc4e-5bc5c2490970', 1, 'arte_expresion', 'Órgano', 'Ejecución del teclado electrónico con efectos y armonías avanzadas.', NULL, '2026-06-24 22:06:58.387484+00');
INSERT INTO public.especialidades_definiciones VALUES ('cd6ff57e-d94d-4d53-9802-f1d9950cb26d', 1, 'arte_expresion', 'Corneta', 'Toques oficiales scouts y uso de la corneta o bugle.', NULL, '2026-06-24 22:06:58.388926+00');
INSERT INTO public.especialidades_definiciones VALUES ('90d605ab-95b2-4df8-b0e3-06068cf75eb3', 1, 'arte_expresion', 'Idiomas', 'Aprendizaje de vocabulario y conversación en una lengua extranjera.', NULL, '2026-06-24 22:06:58.391806+00');
INSERT INTO public.especialidades_definiciones VALUES ('b30f6021-6d83-49be-ba8b-47268e4fc8ea', 1, 'arte_expresion', 'Capoeira', 'Arte marcial afrobrasileño que combina danza, acrobacias y música.', NULL, '2026-06-24 22:06:58.393255+00');
INSERT INTO public.especialidades_definiciones VALUES ('ecca302d-3595-4d1e-81fd-94d72eaa525f', 1, 'arte_expresion', 'Cultura de los Pueblos Originarios', 'Estudio de las tradiciones, lenguas e historia de las etnias indígenas chilenas.', NULL, '2026-06-24 22:06:58.394751+00');
INSERT INTO public.especialidades_definiciones VALUES ('844151d7-321e-4f0b-ab6e-80cd3db2f0a3', 1, 'arte_expresion', 'Cultura Rapa Nui', 'Conocimiento de la historia, danzas, tallados y leyendas de Isla de Pascua.', NULL, '2026-06-24 22:06:58.396068+00');
INSERT INTO public.especialidades_definiciones VALUES ('4ba60cd2-c83a-4d4a-89af-c0c62ff00b2d', 1, 'arte_expresion', 'Historia Guía y Scout', 'Orígenes del movimiento, biografía de Baden-Powell e hitos en Chile.', NULL, '2026-06-24 22:06:58.397295+00');
INSERT INTO public.especialidades_definiciones VALUES ('97ede858-eaa9-48ae-9c09-c56434ae74b9', 1, 'arte_expresion', 'Coleccionismo', 'Clasificación, conservación e historia de objetos de colección.', NULL, '2026-06-24 22:06:58.398526+00');
INSERT INTO public.especialidades_definiciones VALUES ('5f9eeb81-2473-4ce7-8545-c68a1c8453ce', 1, 'arte_expresion', 'Patrimonio', 'Estudio y conservación de monumentos, relatos e historia de tu localidad o país.', NULL, '2026-06-24 22:06:58.399633+00');
INSERT INTO public.especialidades_definiciones VALUES ('4001ff40-9b47-4231-9d82-69130c71c957', 1, 'arte_expresion', 'Cocina Saludable', 'Preparación de menús equilibrados, nutrición y alimentación consciente.', NULL, '2026-06-24 22:06:58.400858+00');
INSERT INTO public.especialidades_definiciones VALUES ('2add8198-08bb-4eb5-8a32-9c293bd391c3', 1, 'arte_expresion', 'Literatura', 'Apreciación literaria, redacción creativa de cuentos o poesía y lectura.', NULL, '2026-06-24 22:06:58.402054+00');
INSERT INTO public.especialidades_definiciones VALUES ('128295e4-6e49-4e5c-b7d9-36625e37a6b7', 1, 'arte_expresion', 'Repostería', 'Preparación de postres, masas dulces, pastelería y técnicas de horneado.', NULL, '2026-06-24 22:06:58.403547+00');
INSERT INTO public.especialidades_definiciones VALUES ('79b3929c-b214-45fb-8e7e-79b3dce6efd3', 2, 'arte_expresion', 'Corneta', 'Toques oficiales scouts y uso de la corneta o bugle.', NULL, '2026-06-24 22:06:58.55753+00');
INSERT INTO public.especialidades_definiciones VALUES ('94d4c2bf-2f36-4ad2-bfe2-4684183b0c0f', 1, 'ciencia_tecnologia', 'Arqueología', 'Estudio de civilizaciones antiguas a través de la excavación y análisis de artefactos.', NULL, '2026-06-24 22:06:58.404945+00');
INSERT INTO public.especialidades_definiciones VALUES ('cc0d23ba-35ec-4c71-8146-779f0040bfca', 1, 'ciencia_tecnologia', 'Electricidad', 'Circuitos básicos, medidas de seguridad y reparaciones menores del hogar.', NULL, '2026-06-24 22:06:58.410068+00');
INSERT INTO public.especialidades_definiciones VALUES ('89bc283a-b7e6-4a84-a06a-d0cd2aaf5436', 1, 'ciencia_tecnologia', 'Energía Solar', 'Aprovechamiento del sol, celdas fotovoltaicas y hornos solares caseros.', NULL, '2026-06-24 22:06:58.411582+00');
INSERT INTO public.especialidades_definiciones VALUES ('2bd8ebc0-6715-4dc6-a65f-f08b32c1b10e', 1, 'ciencia_tecnologia', 'Geología', 'Estudio de rocas, minerales, placas tectónicas y relieve terrestre.', NULL, '2026-06-24 22:06:58.412716+00');
INSERT INTO public.especialidades_definiciones VALUES ('6a51f40a-cd30-4290-a0a2-9d1ea7e9137b', 1, 'ciencia_tecnologia', 'Insectos', 'Observación y clasificación de especies de insectos de tu entorno.', NULL, '2026-06-24 22:06:58.413863+00');
INSERT INTO public.especialidades_definiciones VALUES ('3113f6af-4be0-4aea-888e-f57be85589e0', 1, 'ciencia_tecnologia', 'Entomología', 'Estudio científico de la anatomía, comportamiento e importancia ecológica de los insectos.', NULL, '2026-06-24 22:06:58.415074+00');
INSERT INTO public.especialidades_definiciones VALUES ('58234580-f910-49bd-8fcb-3020760e10de', 1, 'ciencia_tecnologia', 'Mecánica', 'Funcionamiento de motores, engranajes y herramientas mecánicas.', NULL, '2026-06-24 22:06:58.416182+00');
INSERT INTO public.especialidades_definiciones VALUES ('db561750-3f6b-4faa-9ac5-e49339e2a351', 1, 'ciencia_tecnologia', 'Automovilismo', 'Funcionamiento del automóvil, señales del tránsito y mantenimiento básico.', NULL, '2026-06-24 22:06:58.417275+00');
INSERT INTO public.especialidades_definiciones VALUES ('9a730e81-4160-47ff-8054-f597cd57534c', 1, 'ciencia_tecnologia', 'Paleontología', 'Estudio de fósiles y de la vida en eras geológicas pasadas.', NULL, '2026-06-24 22:06:58.418414+00');
INSERT INTO public.especialidades_definiciones VALUES ('08f30313-b58e-4722-b778-c64b9b34f209', 1, 'ciencia_tecnologia', 'Matemáticas', 'Resolución de acertijos matemáticos, lógica y aplicaciones numéricas cotidianas.', NULL, '2026-06-24 22:06:58.421303+00');
INSERT INTO public.especialidades_definiciones VALUES ('f9c9f520-386f-4931-bc90-7e05017fd8f9', 1, 'ciencia_tecnologia', 'Computación', 'Fundamentos de hardware, software, internet seguro y ofimática.', NULL, '2026-06-24 22:06:58.422484+00');
INSERT INTO public.especialidades_definiciones VALUES ('d8d0c4bc-9887-4779-9f9b-853de378c1ea', 1, 'ciencia_tecnologia', 'Desarrollador de Contenidos', 'Creación de blogs, videos informativos o podcasts de manera ética y atractiva.', NULL, '2026-06-24 22:06:58.423614+00');
INSERT INTO public.especialidades_definiciones VALUES ('91ae594f-5702-4c63-a545-8966f33e3e2c', 1, 'ciencia_tecnologia', 'Manejo de Drones', 'Pilotaje responsable de drones, aerodinámica y normativa vigente.', NULL, '2026-06-24 22:06:58.424761+00');
INSERT INTO public.especialidades_definiciones VALUES ('dd6690d2-d8dd-4543-8865-9aeeb3d71998', 1, 'ciencia_tecnologia', 'Videojuegos', 'Historia de los videojuegos, diseño de niveles y análisis de jugabilidad.', NULL, '2026-06-24 22:06:58.427048+00');
INSERT INTO public.especialidades_definiciones VALUES ('73c763d5-dc92-452b-a7a2-2a2b6baa856e', 1, 'ciencia_tecnologia', 'Gamer', 'Juego competitivo saludable, estrategia digital y juego limpio online.', NULL, '2026-06-24 22:06:58.428123+00');
INSERT INTO public.especialidades_definiciones VALUES ('1382a130-4db9-41f4-8c6b-f314af01ea36', 1, 'espiritual', 'Mándalas', 'Diseño y coloreado de mandalas como método de concentración y meditación.', NULL, '2026-06-24 22:06:58.429193+00');
INSERT INTO public.especialidades_definiciones VALUES ('a4295cfb-91cb-4d17-be82-05bd7c2d55bd', 1, 'espiritual', 'Tradiciones de los Pueblos Originarios', 'Estudio de la espiritualidad, cosmovisión y conexión con la naturaleza de los pueblos nativos.', NULL, '2026-06-24 22:06:58.431432+00');
INSERT INTO public.especialidades_definiciones VALUES ('aeda009a-7604-428d-aba4-81ba584cd9f2', 1, 'espiritual', 'Animación de la Fé', 'Liderazgo en oraciones, reflexiones espirituales y cantos religiosos.', NULL, '2026-06-24 22:06:58.433662+00');
INSERT INTO public.especialidades_definiciones VALUES ('509d9396-8abe-4ebe-a1eb-9c3046e045ca', 1, 'servicio_comunidad', 'Compostaje', 'Transformación de residuos orgánicos en abono para huertas y plantas.', NULL, '2026-06-24 22:06:58.434884+00');
INSERT INTO public.especialidades_definiciones VALUES ('8880f185-7e5f-43cd-854e-58910f1243b6', 1, 'servicio_comunidad', 'Reciclaje', 'Clasificación, reducción y reutilización creativa de cartón, vidrio, plásticos y metales.', NULL, '2026-06-23 07:23:22.088264+00');
INSERT INTO public.especialidades_definiciones VALUES ('48857abb-48f0-4b80-861f-9fc3578dddf9', 1, 'servicio_comunidad', 'Sostenibilidad', 'Prácticas ecológicas cotidianas para reducir la huella de carbono.', NULL, '2026-06-24 22:06:58.438406+00');
INSERT INTO public.especialidades_definiciones VALUES ('d354c792-15fe-4534-b4d6-d5cabffb20d7', 1, 'servicio_comunidad', 'Apoyo en Emergencias y Desastres', 'Planes de evacuación familiar, mochilas de emergencia y primeros auxilios organizativos.', NULL, '2026-06-24 22:06:58.439923+00');
INSERT INTO public.especialidades_definiciones VALUES ('ff0e8e43-7b84-49b2-9a31-e624c671c534', 1, 'servicio_comunidad', 'Cadete bomberos', 'Conocimiento del servicio de bomberos, prevención de incendios y rescate básico.', NULL, '2026-06-24 22:06:58.441077+00');
INSERT INTO public.especialidades_definiciones VALUES ('69323986-06ce-4c3c-9d2c-141cdaab802c', 1, 'servicio_comunidad', 'No + Bullyng', 'Promoción del respeto, empatía y prevención del acoso escolar y digital.', NULL, '2026-06-24 22:06:58.443203+00');
INSERT INTO public.especialidades_definiciones VALUES ('eb2101cd-aec5-46d9-bc1b-074fb46cffc1', 1, 'servicio_comunidad', 'Emprendimiento', 'Planificación de un negocio pequeño, presupuestos y mercadeo.', NULL, '2026-06-24 22:06:58.444565+00');
INSERT INTO public.especialidades_definiciones VALUES ('a6e68376-288d-4226-84a5-bfa98e278065', 1, 'servicio_comunidad', 'Reparaciones Domésticas', 'Mantención del hogar, pintura, gasfitería básica y carpintería.', NULL, '2026-06-24 22:06:58.447336+00');
INSERT INTO public.especialidades_definiciones VALUES ('ea72f4d4-0a48-46a7-8ae1-5dfb52dc101c', 1, 'servicio_comunidad', 'Cosmética', 'Elaboración artesanal y natural de jabones, cremas y bálsamos ecológicos.', NULL, '2026-06-24 22:06:58.448629+00');
INSERT INTO public.especialidades_definiciones VALUES ('5bf473ec-3b0f-4255-a20b-776015044ae7', 1, 'servicio_comunidad', 'Nutrición', 'Elaboración de dietas balanceadas y hábitos de vida saludables.', NULL, '2026-06-24 22:06:58.449584+00');
INSERT INTO public.especialidades_definiciones VALUES ('5625e270-d5c4-4113-b5d3-5c2c13d4cbf0', 1, 'servicio_comunidad', 'Prevención de Riesgos', 'Identificación de peligros en el hogar, escuela o campamento y cómo evitarlos.', NULL, '2026-06-24 22:06:58.450539+00');
INSERT INTO public.especialidades_definiciones VALUES ('28e06ce3-fa27-4d08-a225-c8536384be69', 1, 'aire_libre', 'Construcciones de Campamento', 'Uso de coligües o troncos, amarres y diseño de comedores o portadas.', NULL, '2026-06-24 22:06:58.454385+00');
INSERT INTO public.especialidades_definiciones VALUES ('dfc65f0b-111b-43d5-8048-812007b7b984', 1, 'aire_libre', 'Mínimo Impacto', 'Principios de No Dejar Rastro en excursiones y campamentos.', NULL, '2026-06-24 22:06:58.455511+00');
INSERT INTO public.especialidades_definiciones VALUES ('a626ad2f-8cbb-4dae-90b6-a48df3ad23b9', 1, 'aire_libre', 'Acecho', 'Caminar sigilosamente y camuflaje en la naturaleza para la observación.', NULL, '2026-06-24 22:06:58.459506+00');
INSERT INTO public.especialidades_definiciones VALUES ('06cf1c74-ae49-4b9b-9aa5-9afc74b42446', 1, 'aire_libre', 'Observación', 'Registro de flora, fauna y clima en bitácoras de campo.', NULL, '2026-06-24 22:06:58.460807+00');
INSERT INTO public.especialidades_definiciones VALUES ('b4307394-4f12-4bb5-a752-445f1dbfc34d', 1, 'aire_libre', 'Pistas', 'Seguimiento de rastros naturales o artificiales en excursiones.', NULL, '2026-06-24 22:06:58.463509+00');
INSERT INTO public.especialidades_definiciones VALUES ('4b81d06c-113f-4271-aa32-61bdbb15c9b1', 1, 'aire_libre', 'Guía de turismo', 'Liderazgo de grupos, relatos históricos y guiado por rutas locales.', NULL, '2026-06-24 22:06:58.464695+00');
INSERT INTO public.especialidades_definiciones VALUES ('84bd5946-5c8c-4042-b94f-2ace0c682e20', 1, 'aire_libre', 'Cocina', 'Cocina al aire libre con cocinilla o fogata y cuidado de alimentos.', NULL, '2026-06-24 22:06:58.390275+00');
INSERT INTO public.especialidades_definiciones VALUES ('11365d80-2295-4f45-8bf3-823a69eda005', 1, 'aire_libre', 'Woodcraft', 'Talla en madera, artesanías de campamento y uso seguro de cuchillo.', NULL, '2026-06-24 22:06:58.467854+00');
INSERT INTO public.especialidades_definiciones VALUES ('3613925c-6c54-4f89-9564-bf4c82846458', 2, 'deportes', 'Surf', 'Práctica de deslizamiento sobre olas usando una tabla, equilibrio y conocimiento del mar.', NULL, '2026-06-24 22:06:58.469134+00');
INSERT INTO public.especialidades_definiciones VALUES ('54ecb55c-3cb4-4f4a-93af-ddd927c2af13', 2, 'deportes', 'Preparación Física', 'Entrenamiento integral para mejorar la fuerza, resistencia y salud corporal.', NULL, '2026-06-24 22:06:58.470618+00');
INSERT INTO public.especialidades_definiciones VALUES ('9b8eab7f-a942-4cd0-81e3-39fb2b415b00', 2, 'deportes', 'Crossfit', 'Entrenamiento de alta intensidad con movimientos funcionales variados.', NULL, '2026-06-24 22:06:58.471856+00');
INSERT INTO public.especialidades_definiciones VALUES ('6f3de77b-7ad5-416d-8b7d-0138202d66cd', 2, 'deportes', 'Canotaje', 'Navegación en canoa enfocada en la propulsión y técnicas de remo.', NULL, '2026-06-24 22:06:58.472982+00');
INSERT INTO public.especialidades_definiciones VALUES ('d9b8c26b-a668-43f6-8e7a-788871791456', 2, 'deportes', 'Kayak', 'Desplazamiento en kayak, técnicas de paleo y seguridad en el agua.', NULL, '2026-06-24 22:06:58.474126+00');
INSERT INTO public.especialidades_definiciones VALUES ('acb8adb4-252f-4b38-94aa-2a1a4773e130', 2, 'deportes', 'Parkour', 'Disciplina de superación de obstáculos urbanos o naturales usando el cuerpo.', NULL, '2026-06-24 22:06:58.475432+00');
INSERT INTO public.especialidades_definiciones VALUES ('c0b38f9f-8b09-4640-9f17-2d06044fc6c8', 2, 'deportes', 'Skate', 'Uso de la patineta, trucos, equilibrio y medidas de seguridad.', NULL, '2026-06-24 22:06:58.476651+00');
INSERT INTO public.especialidades_definiciones VALUES ('6a969f30-51b4-4fcc-877d-938617b789e5', 2, 'deportes', 'Mountain bike', 'Ciclismo en terrenos montañosos, descenso y superación de obstáculos.', NULL, '2026-06-24 22:06:58.479363+00');
INSERT INTO public.especialidades_definiciones VALUES ('65197e05-7bf3-4264-9ae6-a93a39099e1d', 2, 'deportes', 'Natación', 'Técnicas de nado, estilos, resistencia y salvamento acuático.', NULL, '2026-06-24 22:06:58.480798+00');
INSERT INTO public.especialidades_definiciones VALUES ('c1a65234-2bef-49f0-b0e3-8f4e99154b5e', 2, 'deportes', 'Patinaje', 'Desplazamiento sobre patines en línea o tradicionales y equilibrio.', NULL, '2026-06-24 22:06:58.482386+00');
INSERT INTO public.especialidades_definiciones VALUES ('42daea96-4221-40a2-98ce-0e6e3ae752e0', 2, 'deportes', 'Artes marciales', 'Práctica de defensa personal, disciplina, autocontrol y respeto.', NULL, '2026-06-24 22:06:58.484764+00');
INSERT INTO public.especialidades_definiciones VALUES ('109e6fd9-b389-401e-b7cd-0ff955fc6eb5', 2, 'deportes', 'Basketball', 'Fundamentos tácticos, dribling, pases y lanzamientos en equipo.', NULL, '2026-06-24 22:06:58.486385+00');
INSERT INTO public.especialidades_definiciones VALUES ('dad3816b-c199-4b4b-81ec-cf822bda7acd', 2, 'deportes', 'Boxeo', 'Técnicas de golpeo, defensa, esquiva y acondicionamiento físico del pugilismo.', NULL, '2026-06-24 22:06:58.487866+00');
INSERT INTO public.especialidades_definiciones VALUES ('8a47dedc-0a0c-42f4-ad2a-b4eec0b1fcd2', 2, 'deportes', 'Lucha', 'Técnicas de derribo, control y sumisión en disciplinas de combate.', NULL, '2026-06-24 22:06:58.489163+00');
INSERT INTO public.especialidades_definiciones VALUES ('72adbe0a-0218-4465-adbe-49eb67b4d0ce', 2, 'deportes', 'Fútbol', 'Tácticas, dominio del balón y trabajo en equipo sobre la cancha.', NULL, '2026-06-24 22:06:58.490472+00');
INSERT INTO public.especialidades_definiciones VALUES ('e5aa2b19-78de-44b7-be62-4a5b4734af66', 2, 'deportes', 'Handball', 'Pases, tiros a portería y juego colectivo con las manos.', NULL, '2026-06-24 22:06:58.491676+00');
INSERT INTO public.especialidades_definiciones VALUES ('f2b0c19d-be23-402b-a000-7078db2fd180', 2, 'deportes', 'Escalada', 'Ascenso en roca o muro artificial, uso de arnés, cuerdas y seguridad.', NULL, '2026-06-24 22:06:58.493994+00');
INSERT INTO public.especialidades_definiciones VALUES ('d7c49fc1-98bd-431b-bc1a-aafd39c0656e', 2, 'deportes', 'Descenso', 'Técnicas de rápel y descenso controlado en laderas u obstáculos.', NULL, '2026-06-24 22:06:58.495199+00');
INSERT INTO public.especialidades_definiciones VALUES ('b1072b2e-55e9-434b-b4c1-c6977863d3ba', 2, 'deportes', 'Tenis', 'Técnicas de raqueta, saques, golpes y reglas del juego en cancha.', NULL, '2026-06-24 22:06:58.496355+00');
INSERT INTO public.especialidades_definiciones VALUES ('dd6e1b02-e7a0-4275-b3ed-2195c444b6fb', 2, 'deportes', 'Pádel', 'Juego de palas, rebotes en paredes y dinámica de dobles.', NULL, '2026-06-24 22:06:58.497603+00');
INSERT INTO public.especialidades_definiciones VALUES ('0f901dce-c120-4ed4-95b0-6508ddbf17f7', 2, 'deportes', 'Tenis de Mesa', 'Reflejos, golpes con efecto y agilidad mental con la paleta.', NULL, '2026-06-24 22:06:58.498908+00');
INSERT INTO public.especialidades_definiciones VALUES ('2723f3af-4383-45d2-9bb4-1401a453af77', 2, 'deportes', 'Rugby', 'Tácticas de juego, pases hacia atrás, tackles y espíritu de equipo.', NULL, '2026-06-24 22:06:58.500007+00');
INSERT INTO public.especialidades_definiciones VALUES ('80ab08f0-1050-45a7-ac5b-938b6d8b2f90', 2, 'deportes', 'Vóleibol', 'Saques, recepciones, voleos, remates y juego en red.', NULL, '2026-06-24 22:06:58.501182+00');
INSERT INTO public.especialidades_definiciones VALUES ('e54eadfa-d305-443f-a417-e3d0cfd2593d', 2, 'deportes', 'Ajedrez', 'Estrategia, táctica, aperturas y desarrollo del pensamiento lógico.', NULL, '2026-06-24 22:06:58.502577+00');
INSERT INTO public.especialidades_definiciones VALUES ('f8e4b409-e00c-4c69-af18-473c288dabbd', 2, 'deportes', 'Juegos de Cartas', 'Estrategias, reglas y socialización mediante juegos de naipes.', NULL, '2026-06-24 22:06:58.504418+00');
INSERT INTO public.especialidades_definiciones VALUES ('ebe57072-4c21-45db-b148-56019c918025', 2, 'deportes', 'Cubos Rubik', 'Algoritmos, velocidad y resolución del rompecabezas tridimensional.', NULL, '2026-06-24 22:06:58.506092+00');
INSERT INTO public.especialidades_definiciones VALUES ('809ef331-c20d-4d05-95c6-b2543f54f8ad', 2, 'deportes', 'Juego de Pañolines', 'Juegos tradicionales scouts de agilidad, estrategia y trabajo en equipo.', NULL, '2026-06-24 22:06:58.507721+00');
INSERT INTO public.especialidades_definiciones VALUES ('fd914d42-a14c-42ee-98c0-f0f913fb8d7e', 2, 'arte_expresion', 'Artesanía', 'Creación de piezas decorativas o utilitarias con técnicas manuales y materiales diversos.', NULL, '2026-06-24 22:06:58.509147+00');
INSERT INTO public.especialidades_definiciones VALUES ('a6cfa8dd-769d-40a9-990e-6669d5b1bd41', 2, 'arte_expresion', 'Baile', 'Expresión corporal a través de ritmos modernos y populares.', NULL, '2026-06-24 22:06:58.510222+00');
INSERT INTO public.especialidades_definiciones VALUES ('4699f3bc-c517-4985-8313-a7ad8b1a8dd6', 2, 'arte_expresion', 'Danza', 'Estudio y ejecución de danzas folclóricas, clásicas o contemporáneas.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('17471065-5c8a-4bb7-94f6-6939503e9cf0', 2, 'arte_expresion', 'Coreografías', 'Creación y dirección de rutinas de baile coordinadas en grupo.', NULL, '2026-06-24 22:06:58.512496+00');
INSERT INTO public.especialidades_definiciones VALUES ('0c4374c1-a238-4ea7-a7d8-102ce69d3d9a', 2, 'arte_expresion', 'Intérprete', 'Ejecución vocal o instrumental de piezas musicales de diversos autores.', NULL, '2026-06-24 22:06:58.514619+00');
INSERT INTO public.especialidades_definiciones VALUES ('ea94026a-5b4c-4ee1-9ffd-259ab3f34c27', 2, 'arte_expresion', 'MC', 'Habilidades de animación, rima, improvisación y dominio del escenario.', NULL, '2026-06-24 22:06:58.515692+00');
INSERT INTO public.especialidades_definiciones VALUES ('0f056719-656b-4a01-b7d2-5d4cdd5c8aef', 2, 'arte_expresion', 'Freestyle', 'Rap e improvisación lírica sobre bases rítmicas al instante.', NULL, '2026-06-24 22:06:58.516821+00');
INSERT INTO public.especialidades_definiciones VALUES ('44b192fc-d647-4bba-a15a-0693d16a1222', 2, 'arte_expresion', 'Circo', 'Técnicas de malabarismo, equilibrio, acrobacias y artes escénicas afines.', NULL, '2026-06-24 22:06:58.518044+00');
INSERT INTO public.especialidades_definiciones VALUES ('2e328468-78b5-4fdc-a963-2d7ed0be2649', 2, 'arte_expresion', 'Diseño', 'Fundamentos visuales, maquetación y comunicación gráfica creativa.', NULL, '2026-06-24 22:06:58.52024+00');
INSERT INTO public.especialidades_definiciones VALUES ('748d1f6e-11dc-4f7f-af94-aa2f0ef880d4', 2, 'arte_expresion', 'Dibujo', 'Técnicas de trazo, perspectiva, sombras y boceteado.', NULL, '2026-06-24 22:06:58.522053+00');
INSERT INTO public.especialidades_definiciones VALUES ('964ff044-8251-4632-983c-1bf591e09c55', 2, 'arte_expresion', 'Comics', 'Creación de historias ilustradas mediante viñetas y narrativa secuencial.', NULL, '2026-06-24 22:06:58.523358+00');
INSERT INTO public.especialidades_definiciones VALUES ('1436ee69-fa67-467b-bc45-d6c9219244d9', 2, 'arte_expresion', 'Manga', 'Estilo de dibujo japonés, entintado y narrativa visual característica.', NULL, '2026-06-24 22:06:58.52464+00');
INSERT INTO public.especialidades_definiciones VALUES ('db92307e-d0eb-44c2-8b46-595df44e6dc4', 2, 'arte_expresion', 'Animé', 'Estudio del arte de la animación japonesa, diseño de personajes y animación.', NULL, '2026-06-24 22:06:58.525687+00');
INSERT INTO public.especialidades_definiciones VALUES ('379c2ada-005d-4a48-822a-915390e30f44', 2, 'arte_expresion', 'Interpretación', 'Actuación teatral o dramática encarnando personajes con voz y cuerpo.', NULL, '2026-06-24 22:06:58.526702+00');
INSERT INTO public.especialidades_definiciones VALUES ('6046b717-5834-4876-b271-5f171f4ef598', 2, 'arte_expresion', 'Cosplay', 'Diseño y confección de disfraces representando personajes de ficción.', NULL, '2026-06-24 22:06:58.527735+00');
INSERT INTO public.especialidades_definiciones VALUES ('fc378855-fce4-4aa1-b681-edcb64bde357', 2, 'arte_expresion', 'Cuentacuentos', 'Narración oral de historias de manera expresiva y cautivadora.', NULL, '2026-06-24 22:06:58.528743+00');
INSERT INTO public.especialidades_definiciones VALUES ('d05e466c-f2c8-468c-bded-b49fb3b3b7ed', 2, 'arte_expresion', 'Escultura', 'Moldeado en arcilla, madera u otros materiales para crear formas tridimensionales.', NULL, '2026-06-24 22:06:58.529734+00');
INSERT INTO public.especialidades_definiciones VALUES ('b4db8738-e5e0-4d9a-80b5-32781ce89395', 2, 'arte_expresion', 'Fotografía', 'Uso de cámara, encuadre, iluminación y edición de imágenes.', NULL, '2026-06-24 22:06:58.530751+00');
INSERT INTO public.especialidades_definiciones VALUES ('4b7962e0-cc9d-4e82-8819-cfeac7adb007', 2, 'arte_expresion', 'Globoflexia', 'Creación de figuras creativas mediante el inflado y torsión de globos.', NULL, '2026-06-24 22:06:58.531768+00');
INSERT INTO public.especialidades_definiciones VALUES ('81f39ce9-2d20-4342-9c4a-6d769a59498a', 2, 'arte_expresion', 'Lettering', 'Como caligrafía artística o escritura dibujada creativamente a mano.', NULL, '2026-06-24 22:06:58.532889+00');
INSERT INTO public.especialidades_definiciones VALUES ('84c59cf9-22e8-48e3-8390-bd0ae707d17d', 2, 'arte_expresion', 'Magia', 'Ilusionismo, trucos con cartas u objetos y entretenimiento escénico.', NULL, '2026-06-24 22:06:58.53394+00');
INSERT INTO public.especialidades_definiciones VALUES ('a746c435-2b54-4060-83cd-595893f2fed0', 2, 'arte_expresion', 'Malabarismo', 'Manipulación coordinada de múltiples objetos en el aire.', NULL, '2026-06-24 22:06:58.53504+00');
INSERT INTO public.especialidades_definiciones VALUES ('638f6345-de28-4a16-b526-7258c33b2ae7', 2, 'arte_expresion', 'Mimo', 'Teatro gestual, lenguaje corporal e historias sin palabras.', NULL, '2026-06-24 22:06:58.536492+00');
INSERT INTO public.especialidades_definiciones VALUES ('72b56a33-ce47-4388-b0e6-3161b6d90136', 2, 'arte_expresion', 'Origami', 'Creación de figuras mediante el plegado de papel sin usar tijeras ni pegamento.', NULL, '2026-06-24 22:06:58.537811+00');
INSERT INTO public.especialidades_definiciones VALUES ('f7f3b635-d190-4b21-9659-66e899c2a490', 2, 'arte_expresion', 'Pintura', 'Uso del color, pinceles y diversas técnicas sobre lienzo o papel.', NULL, '2026-06-24 22:06:58.538942+00');
INSERT INTO public.especialidades_definiciones VALUES ('90aef6e6-8d16-4891-9b13-816f8030437b', 2, 'arte_expresion', 'Actuación', 'Técnicas de actuación para cine, televisión o artes representativas.', NULL, '2026-06-24 22:06:58.541197+00');
INSERT INTO public.especialidades_definiciones VALUES ('5eb8bf86-1031-4051-9a43-f2c68f9a21fd', 2, 'arte_expresion', 'Tejido', 'Confección de prendas o accesorios usando agujas, crochet o telares.', NULL, '2026-06-24 22:06:58.542253+00');
INSERT INTO public.especialidades_definiciones VALUES ('bbe2318b-9b29-409b-866f-9327dea560d3', 2, 'arte_expresion', 'Bordado', 'Decoración de telas mediante costuras con hilos de colores a mano.', NULL, '2026-06-24 22:06:58.543399+00');
INSERT INTO public.especialidades_definiciones VALUES ('75569982-27e5-43a5-886c-cc3143eccea2', 2, 'arte_expresion', 'Vestuario', 'Diseño y selección de prendas de vestir para representaciones o uso temático.', NULL, '2026-06-24 22:06:58.544454+00');
INSERT INTO public.especialidades_definiciones VALUES ('9edeeeba-63dc-49dd-bdb7-1cf82ab40275', 2, 'arte_expresion', 'Confección', 'Corte, costura y armado de prendas textiles a partir de patrones.', NULL, '2026-06-24 22:06:58.5455+00');
INSERT INTO public.especialidades_definiciones VALUES ('49adeb31-c9fe-43af-8b2d-eceedcf0f500', 2, 'arte_expresion', 'Armónica', 'Técnicas de respiración y ejecución del instrumento de viento metal.', NULL, '2026-06-24 22:06:58.54657+00');
INSERT INTO public.especialidades_definiciones VALUES ('cbf0d102-3322-4bf3-a3a6-ea6d5f43f395', 2, 'arte_expresion', 'Bajo', 'Estudio del bajo eléctrico, ritmos, acordes y acompañamiento musical.', NULL, '2026-06-24 22:06:58.5476+00');
INSERT INTO public.especialidades_definiciones VALUES ('b0222bf8-ff42-4c84-915c-430ee3638a81', 2, 'arte_expresion', 'Batería', 'Coordinación, ritmo y percusión en la batería acústica o electrónica.', NULL, '2026-06-24 22:06:58.548643+00');
INSERT INTO public.especialidades_definiciones VALUES ('9158949a-f660-4fe1-b7f5-151016fe18d5', 2, 'arte_expresion', 'DJ', 'Mezcla de pistas musicales, ecualización y animación en vivo.', NULL, '2026-06-24 22:06:58.54969+00');
INSERT INTO public.especialidades_definiciones VALUES ('2bad4300-f0ca-40e3-8308-83b1563d12f3', 2, 'arte_expresion', 'Beatmaker', 'Creación y producción de bases musicales y ritmos digitales.', NULL, '2026-06-24 22:06:58.550749+00');
INSERT INTO public.especialidades_definiciones VALUES ('9c763fc9-3c5f-40a1-b854-44bf90a369ac', 2, 'arte_expresion', 'Guitarra', 'Técnicas de punteo, acordes, rasgueos y afinación de la guitarra.', NULL, '2026-06-24 22:06:58.551797+00');
INSERT INTO public.especialidades_definiciones VALUES ('54ed7d7f-0b11-41ec-94a6-31c05739720a', 2, 'arte_expresion', 'Violín', 'Postura, uso del arco y afinación en el instrumento de cuerda frotada.', NULL, '2026-06-24 22:06:58.553183+00');
INSERT INTO public.especialidades_definiciones VALUES ('a2bce102-6c07-41dd-a86f-5e71fcee23a7', 2, 'arte_expresion', 'Piano', 'Lectura musical, digitación y técnicas del teclado.', NULL, '2026-06-24 22:06:58.554501+00');
INSERT INTO public.especialidades_definiciones VALUES ('7819c265-e915-4c67-9aaf-d128004f304b', 2, 'arte_expresion', 'Flauta', 'Ejecución de flauta dulce o traversa y lectura de partituras.', NULL, '2026-06-24 22:06:58.555547+00');
INSERT INTO public.especialidades_definiciones VALUES ('95c3250b-448b-4e30-bd27-b39390133925', 2, 'arte_expresion', 'Órgano', 'Ejecución del teclado electrónico con efectos y armonías avanzadas.', NULL, '2026-06-24 22:06:58.556551+00');
INSERT INTO public.especialidades_definiciones VALUES ('1c75c09f-77a8-4268-8cef-c82bcbd8ca2f', 2, 'arte_expresion', 'Idiomas', 'Aprendizaje de vocabulario y conversación en una lengua extranjera.', NULL, '2026-06-24 22:06:58.560779+00');
INSERT INTO public.especialidades_definiciones VALUES ('4eb33c70-8cdf-4daf-bbaf-b4f122522c7c', 2, 'arte_expresion', 'Capoeira', 'Arte marcial afrobrasileño que combina danza, acrobacias y música.', NULL, '2026-06-24 22:06:58.562746+00');
INSERT INTO public.especialidades_definiciones VALUES ('1234748d-a16a-4780-ad89-38be8bff9e67', 2, 'arte_expresion', 'Cultura de los Pueblos Originarios', 'Estudio de las tradiciones, lenguas e historia de las etnias indígenas chilenas.', NULL, '2026-06-24 22:06:58.564565+00');
INSERT INTO public.especialidades_definiciones VALUES ('e046a86a-8e22-4722-b86b-a1bf4848a8f4', 2, 'arte_expresion', 'Cultura Rapa Nui', 'Conocimiento de la historia, danzas, tallados y leyendas de Isla de Pascua.', NULL, '2026-06-24 22:06:58.566046+00');
INSERT INTO public.especialidades_definiciones VALUES ('57dae5a6-2bf1-42d2-9070-4dc5c1f6dd5f', 2, 'arte_expresion', 'Historia Guía y Scout', 'Orígenes del movimiento, biografía de Baden-Powell e hitos en Chile.', NULL, '2026-06-24 22:06:58.567103+00');
INSERT INTO public.especialidades_definiciones VALUES ('8a6678fd-5e9e-49e1-a451-6b570ce83139', 2, 'arte_expresion', 'Coleccionismo', 'Clasificación, conservación e historia de objetos de colección.', NULL, '2026-06-24 22:06:58.568268+00');
INSERT INTO public.especialidades_definiciones VALUES ('94b3e0c9-cd32-48d2-8181-3cbbc2fb1ead', 2, 'arte_expresion', 'Patrimonio', 'Estudio y conservación de monumentos, relatos e historia de tu localidad o país.', NULL, '2026-06-24 22:06:58.569587+00');
INSERT INTO public.especialidades_definiciones VALUES ('2458244e-384c-4d85-9c6e-a97cfcae9ffd', 2, 'arte_expresion', 'Cocina Saludable', 'Preparación de menús equilibrados, nutrición y alimentación consciente.', NULL, '2026-06-24 22:06:58.5711+00');
INSERT INTO public.especialidades_definiciones VALUES ('37a68d56-4ea1-414a-93db-770eeece6dde', 2, 'arte_expresion', 'Literatura', 'Apreciación literaria, redacción creativa de cuentos o poesía y lectura.', NULL, '2026-06-24 22:06:58.572175+00');
INSERT INTO public.especialidades_definiciones VALUES ('7e70727d-8ecd-444b-8a12-1a586664be1a', 2, 'ciencia_tecnologia', 'Arqueología', 'Estudio de civilizaciones antiguas a través de la excavación y análisis de artefactos.', NULL, '2026-06-24 22:06:58.574237+00');
INSERT INTO public.especialidades_definiciones VALUES ('f244ef7d-b9a2-410a-bd25-c1a1b623a4a2', 2, 'ciencia_tecnologia', 'Astronomía', 'Reconocimiento de constelaciones, planetas, galaxias y fenómenos celestes.', NULL, '2026-06-24 22:06:58.575215+00');
INSERT INTO public.especialidades_definiciones VALUES ('400dacde-a38c-48b4-860d-0739351741d4', 2, 'ciencia_tecnologia', 'Construcción', 'Principios de edificación, uso seguro de herramientas y maquetas.', NULL, '2026-06-24 22:06:58.577104+00');
INSERT INTO public.especialidades_definiciones VALUES ('e8477b1e-4e07-4ea3-87d2-00f221f110ea', 2, 'ciencia_tecnologia', 'Electricidad', 'Circuitos básicos, medidas de seguridad y reparaciones menores del hogar.', NULL, '2026-06-24 22:06:58.578038+00');
INSERT INTO public.especialidades_definiciones VALUES ('1e6085f9-a9f5-4dbc-b030-0d3ce13c5771', 2, 'ciencia_tecnologia', 'Energía Solar', 'Aprovechamiento del sol, celdas fotovoltaicas y hornos solares caseros.', NULL, '2026-06-24 22:06:58.579101+00');
INSERT INTO public.especialidades_definiciones VALUES ('b42bd9d3-960f-4169-bd69-065fd970ae64', 2, 'ciencia_tecnologia', 'Geología', 'Estudio de rocas, minerales, placas tectónicas y relieve terrestre.', NULL, '2026-06-24 22:06:58.580302+00');
INSERT INTO public.especialidades_definiciones VALUES ('8628326f-f73c-4b0c-8cf4-bbce810a7008', 2, 'ciencia_tecnologia', 'Insectos', 'Observación y clasificación de especies de insectos de tu entorno.', NULL, '2026-06-24 22:06:58.581297+00');
INSERT INTO public.especialidades_definiciones VALUES ('47d4b1f3-78a0-4f82-bc67-f60e91ac9e51', 2, 'ciencia_tecnologia', 'Entomología', 'Estudio científico de la anatomía, comportamiento e importancia ecológica de los insectos.', NULL, '2026-06-24 22:06:58.58221+00');
INSERT INTO public.especialidades_definiciones VALUES ('3e4024f5-602c-45e5-8853-5c67d1641e4c', 2, 'ciencia_tecnologia', 'Mecánica', 'Funcionamiento de motores, engranajes y herramientas mecánicas.', NULL, '2026-06-24 22:06:58.583168+00');
INSERT INTO public.especialidades_definiciones VALUES ('90869b28-4350-4b76-8d01-5f9f812e83dc', 2, 'ciencia_tecnologia', 'Automovilismo', 'Funcionamiento del automóvil, señales del tránsito y mantenimiento básico.', NULL, '2026-06-24 22:06:58.5841+00');
INSERT INTO public.especialidades_definiciones VALUES ('2e0c1646-4f3b-4d9a-b086-0cc1a669122b', 2, 'ciencia_tecnologia', 'Paleontología', 'Estudio de fósiles y de la vida en eras geológicas pasadas.', NULL, '2026-06-24 22:06:58.585052+00');
INSERT INTO public.especialidades_definiciones VALUES ('0b75823d-21d3-4419-af85-3dbdc185743b', 2, 'ciencia_tecnologia', 'Dinosaurios', 'Estudio de las especies prehistóricas de dinosaurios y sus ecosistemas.', NULL, '2026-06-24 22:06:58.586552+00');
INSERT INTO public.especialidades_definiciones VALUES ('c85c5227-c982-4460-badd-1507c8485a6d', 2, 'ciencia_tecnologia', 'Matemáticas', 'Resolución de acertijos matemáticos, lógica y aplicaciones numéricas cotidianas.', NULL, '2026-06-24 22:06:58.587755+00');
INSERT INTO public.especialidades_definiciones VALUES ('10278d15-beca-4058-8cbf-c92aa79bf337', 2, 'ciencia_tecnologia', 'Computación', 'Fundamentos de hardware, software, internet seguro y ofimática.', NULL, '2026-06-24 22:06:58.588776+00');
INSERT INTO public.especialidades_definiciones VALUES ('02efcbac-ccd3-48be-a69c-6d32658abdd8', 2, 'ciencia_tecnologia', 'Desarrollador de Contenidos', 'Creación de blogs, videos informativos o podcasts de manera ética y atractiva.', NULL, '2026-06-24 22:06:58.589939+00');
INSERT INTO public.especialidades_definiciones VALUES ('17206951-d858-4a59-a7f1-5353d01646f3', 2, 'ciencia_tecnologia', 'Manejo de Drones', 'Pilotaje responsable de drones, aerodinámica y normativa vigente.', NULL, '2026-06-24 22:06:58.590922+00');
INSERT INTO public.especialidades_definiciones VALUES ('66023333-171b-4936-8f5e-e687dc1c9792', 2, 'ciencia_tecnologia', 'Robótica', 'Programación y armado de robots sencillos con sensores y motores.', NULL, '2026-06-24 22:06:58.59203+00');
INSERT INTO public.especialidades_definiciones VALUES ('aeba64e0-f962-4168-9c8a-0ee3bd0b0596', 2, 'ciencia_tecnologia', 'Videojuegos', 'Historia de los videojuegos, diseño de niveles y análisis de jugabilidad.', NULL, '2026-06-24 22:06:58.592982+00');
INSERT INTO public.especialidades_definiciones VALUES ('fee6e226-879c-4e56-95ed-10a46d772309', 2, 'ciencia_tecnologia', 'Gamer', 'Juego competitivo saludable, estrategia digital y juego limpio online.', NULL, '2026-06-24 22:06:58.593985+00');
INSERT INTO public.especialidades_definiciones VALUES ('9305d725-c4b9-451b-96e0-0f5352d76348', 2, 'espiritual', 'Mándalas', 'Diseño y coloreado de mandalas como método de concentración y meditación.', NULL, '2026-06-24 22:06:58.594987+00');
INSERT INTO public.especialidades_definiciones VALUES ('c318c32d-53c9-4446-9947-31d052ffffaf', 2, 'espiritual', 'Meditación', 'Técnicas de respiración, mindfulness y búsqueda del equilibrio interior.', NULL, '2026-06-24 22:06:58.595893+00');
INSERT INTO public.especialidades_definiciones VALUES ('850a5d39-1dfb-4ae3-91fd-91a595644d41', 2, 'espiritual', 'Tradiciones de los Pueblos Originarios', 'Estudio de la espiritualidad, cosmovisión y conexión con la naturaleza de los pueblos nativos.', NULL, '2026-06-24 22:06:58.596803+00');
INSERT INTO public.especialidades_definiciones VALUES ('0f0678eb-7edd-432f-b1fb-78da18ce2ef5', 2, 'espiritual', 'Yoga', 'Posturas físicas, estiramientos, equilibrio y respiración consciente.', NULL, '2026-06-24 22:06:58.597687+00');
INSERT INTO public.especialidades_definiciones VALUES ('1ff700b3-0193-4a99-8396-25d8db93c5ff', 2, 'espiritual', 'Animación de la Fé', 'Liderazgo en oraciones, reflexiones espirituales y cantos religiosos.', NULL, '2026-06-24 22:06:58.59861+00');
INSERT INTO public.especialidades_definiciones VALUES ('bf8b843e-142a-4ad3-9ace-8a3a25978a0a', 2, 'servicio_comunidad', 'Compostaje', 'Transformación de residuos orgánicos en abono para huertas y plantas.', NULL, '2026-06-24 22:06:58.599632+00');
INSERT INTO public.especialidades_definiciones VALUES ('3efca398-d314-4221-85d6-f70ecc083c08', 2, 'servicio_comunidad', 'Reciclaje', 'Clasificación, reducción y reutilización creativa de cartón, vidrio, plásticos y metales.', NULL, '2026-06-24 22:06:58.600529+00');
INSERT INTO public.especialidades_definiciones VALUES ('417926e5-3fc7-4599-b3d7-9fe4bde5b066', 2, 'servicio_comunidad', 'Sostenibilidad', 'Prácticas ecológicas cotidianas para reducir la huella de carbono.', NULL, '2026-06-24 22:06:58.601625+00');
INSERT INTO public.especialidades_definiciones VALUES ('55fd7364-c768-4e56-812b-0743e0c7ba55', 2, 'servicio_comunidad', 'Apoyo en Emergencias y Desastres', 'Planes de evacuación familiar, mochilas de emergencia y primeros auxilios organizativos.', NULL, '2026-06-24 22:06:58.603068+00');
INSERT INTO public.especialidades_definiciones VALUES ('bd64d349-9492-4eb4-93be-6d29c7620836', 2, 'servicio_comunidad', 'Cadete bomberos', 'Conocimiento del servicio de bomberos, prevención de incendios y rescate básico.', NULL, '2026-06-24 22:06:58.604609+00');
INSERT INTO public.especialidades_definiciones VALUES ('c386bca5-4fbf-4d60-be2a-04eb66bbb426', 2, 'servicio_comunidad', 'Cuidado de Animales', 'Tenencia responsable, alimentación y primeros auxilios para mascotas.', NULL, '2026-06-24 22:06:58.605929+00');
INSERT INTO public.especialidades_definiciones VALUES ('8c1f0bda-ecb6-4e2c-8ef4-272e72c06f5a', 2, 'servicio_comunidad', 'No + Bullyng', 'Promoción del respeto, empatía y prevención del acoso escolar y digital.', NULL, '2026-06-24 22:06:58.607121+00');
INSERT INTO public.especialidades_definiciones VALUES ('1b8b4ca8-0745-4c3e-82f4-74094aa2410c', 2, 'servicio_comunidad', 'Emprendimiento', 'Planificación de un negocio pequeño, presupuestos y mercadeo.', NULL, '2026-06-24 22:06:58.608106+00');
INSERT INTO public.especialidades_definiciones VALUES ('1886df85-a1f0-4c50-9b55-593df6024d10', 2, 'servicio_comunidad', 'Lengua de Señas', 'Vocabulario básico, abecedario dactilológico y comunicación inclusiva básica.', NULL, '2026-06-24 22:06:58.609171+00');
INSERT INTO public.especialidades_definiciones VALUES ('acb04324-0bb4-4cb7-bccc-50507a32c002', 2, 'servicio_comunidad', 'Reparaciones Domésticas', 'Mantención del hogar, pintura, gasfitería básica y carpintería.', NULL, '2026-06-24 22:06:58.61037+00');
INSERT INTO public.especialidades_definiciones VALUES ('f49a10b5-7d3b-494f-9e2a-8600f10650b1', 2, 'servicio_comunidad', 'Cosmética', 'Elaboración artesanal y natural de jabones, cremas y bálsamos ecológicos.', NULL, '2026-06-24 22:06:58.611453+00');
INSERT INTO public.especialidades_definiciones VALUES ('8261c291-d9e6-4aea-aa57-c404c5f2aa1d', 2, 'servicio_comunidad', 'Nutrición', 'Elaboración de dietas balanceadas y hábitos de vida saludables.', NULL, '2026-06-24 22:06:58.612494+00');
INSERT INTO public.especialidades_definiciones VALUES ('19025e23-3e40-41cb-91c6-0bb1b521bc48', 2, 'servicio_comunidad', 'Prevención de Riesgos', 'Identificación de peligros en el hogar, escuela o campamento y cómo evitarlos.', NULL, '2026-06-24 22:06:58.613527+00');
INSERT INTO public.especialidades_definiciones VALUES ('7c389548-f155-458f-ac90-a2a9bf39f6fa', 2, 'servicio_comunidad', 'Primeros Auxilios', 'Tratamiento de heridas leves, quemaduras, vendajes y RCP básico.', NULL, '2026-06-23 07:23:22.092634+00');
INSERT INTO public.especialidades_definiciones VALUES ('2dd272e0-01b8-49ce-9e10-ec5ad96aa781', 2, 'aire_libre', 'Cocina', 'Cocina al aire libre con cocinilla o fogata y cuidado de alimentos.', NULL, '2026-06-24 22:06:58.559089+00');
INSERT INTO public.especialidades_definiciones VALUES ('b7e8f1c6-edad-4e90-8d4a-22b610d47d25', 2, 'aire_libre', 'Construcciones de Campamento', 'Uso de coligües o troncos, amarres y diseño de comedores o portadas.', NULL, '2026-06-24 22:06:58.617365+00');
INSERT INTO public.especialidades_definiciones VALUES ('1b6d9551-4d1b-46f5-9801-5b9175af2769', 2, 'aire_libre', 'Mínimo Impacto', 'Principios de No Dejar Rastro en excursiones y campamentos.', NULL, '2026-06-24 22:06:58.618741+00');
INSERT INTO public.especialidades_definiciones VALUES ('48d9a3d2-9dbd-45f7-a0aa-a36c4fa1e7f8', 2, 'aire_libre', 'Nudos', 'Técnicas de cabuyería, nudos útiles y su aplicación práctica.', NULL, '2026-06-24 22:06:58.619987+00');
INSERT INTO public.especialidades_definiciones VALUES ('678cca8b-e201-4c15-8909-d5656da88399', 2, 'aire_libre', 'Orientación', 'Lectura de mapas, uso de la brújula, GPS y orientación por astros.', NULL, '2026-06-24 22:06:58.621181+00');
INSERT INTO public.especialidades_definiciones VALUES ('7fbe8040-f457-4ad9-bb29-19a6cb342547', 2, 'aire_libre', 'Trekking', 'Senderismo responsable, técnicas de caminata y equipo técnico.', NULL, '2026-06-24 22:06:58.622236+00');
INSERT INTO public.especialidades_definiciones VALUES ('07a59dd6-5c1f-4c92-a3e8-4252ff23da45', 2, 'aire_libre', 'Acecho', 'Caminar sigilosamente y camuflaje en la naturaleza para la observación.', NULL, '2026-06-24 22:06:58.623225+00');
INSERT INTO public.especialidades_definiciones VALUES ('9bb11167-e9ca-4223-8ceb-29ccdfdb9ba9', 2, 'aire_libre', 'Observación', 'Registro de flora, fauna y clima en bitácoras de campo.', NULL, '2026-06-24 22:06:58.624333+00');
INSERT INTO public.especialidades_definiciones VALUES ('c48f15f5-bf7e-4d10-9db6-343f1fa4f709', 2, 'aire_libre', 'Claves', 'Lectura y cifrado de mensajes usando clave morse, semáforo u otras.', NULL, '2026-06-24 22:06:58.62529+00');
INSERT INTO public.especialidades_definiciones VALUES ('55d020cf-6bda-4bef-a178-fffe77a80fc2', 2, 'aire_libre', 'Pistas', 'Seguimiento de rastros naturales o artificiales en excursiones.', NULL, '2026-06-24 22:06:58.626246+00');
INSERT INTO public.especialidades_definiciones VALUES ('4332d967-2c6b-49e2-a40d-23e7dd14fd3a', 2, 'aire_libre', 'Guía de turismo', 'Liderazgo de grupos, relatos históricos y guiado por rutas locales.', NULL, '2026-06-24 22:06:58.627275+00');
INSERT INTO public.especialidades_definiciones VALUES ('8024309d-4553-427f-aae2-d2894e1cd2b7', 2, 'aire_libre', 'Woodcraft', 'Talla en madera, artesanías de campamento y uso seguro de cuchillo.', NULL, '2026-06-24 22:06:58.630242+00');
INSERT INTO public.especialidades_definiciones VALUES ('cc2052fb-1f24-405c-aa90-19538db0c7e2', 3, 'deportes', 'Surf', 'Práctica de deslizamiento sobre olas usando una tabla, equilibrio y conocimiento del mar.', NULL, '2026-06-24 22:06:58.631223+00');
INSERT INTO public.especialidades_definiciones VALUES ('1a6404ac-84e5-4ef6-9d50-930296750614', 3, 'deportes', 'Preparación Física', 'Entrenamiento integral para mejorar la fuerza, resistencia y salud corporal.', NULL, '2026-06-24 22:06:58.632123+00');
INSERT INTO public.especialidades_definiciones VALUES ('c7bbece6-9cc8-4cc0-b5a6-e37b1eacd898', 3, 'deportes', 'Crossfit', 'Entrenamiento de alta intensidad con movimientos funcionales variados.', NULL, '2026-06-24 22:06:58.633051+00');
INSERT INTO public.especialidades_definiciones VALUES ('38b491ac-9f0b-4d54-be90-8eeafded73dc', 3, 'deportes', 'Canotaje', 'Navegación en canoa enfocada en la propulsión y técnicas de remo.', NULL, '2026-06-24 22:06:58.634135+00');
INSERT INTO public.especialidades_definiciones VALUES ('1c2190f3-c31a-400b-936f-19d81570d13c', 3, 'deportes', 'Kayak', 'Desplazamiento en kayak, técnicas de paleo y seguridad en el agua.', NULL, '2026-06-24 22:06:58.635178+00');
INSERT INTO public.especialidades_definiciones VALUES ('f70b1d46-203e-44b8-b636-6e6e00e8381f', 3, 'deportes', 'Parkour', 'Disciplina de superación de obstáculos urbanos o naturales usando el cuerpo.', NULL, '2026-06-24 22:06:58.636436+00');
INSERT INTO public.especialidades_definiciones VALUES ('db6c3433-6978-4113-968b-fb7f33c44c62', 3, 'deportes', 'Skate', 'Uso de la patineta, trucos, equilibrio y medidas de seguridad.', NULL, '2026-06-24 22:06:58.637546+00');
INSERT INTO public.especialidades_definiciones VALUES ('7457fe56-f408-4828-90d7-b0087591a78f', 3, 'deportes', 'Mountain bike', 'Ciclismo en terrenos montañosos, descenso y superación de obstáculos.', NULL, '2026-06-24 22:06:58.639478+00');
INSERT INTO public.especialidades_definiciones VALUES ('a705c4be-888b-4db2-b90c-b65df7f03cd1', 3, 'deportes', 'Natación', 'Técnicas de nado, estilos, resistencia y salvamento acuático.', NULL, '2026-06-24 22:06:58.640429+00');
INSERT INTO public.especialidades_definiciones VALUES ('ead84bb1-c434-4712-8b40-a77e52c26991', 3, 'deportes', 'Patinaje', 'Desplazamiento sobre patines en línea o tradicionales y equilibrio.', NULL, '2026-06-24 22:06:58.641341+00');
INSERT INTO public.especialidades_definiciones VALUES ('cbb82ec0-b8d1-417b-baff-b0c53e37c205', 3, 'deportes', 'Artes marciales', 'Práctica de defensa personal, disciplina, autocontrol y respeto.', NULL, '2026-06-24 22:06:58.643341+00');
INSERT INTO public.especialidades_definiciones VALUES ('7b9f54ba-257c-4158-b632-a71ae0ed8da3', 3, 'deportes', 'Basketball', 'Fundamentos tácticos, dribling, pases y lanzamientos en equipo.', NULL, '2026-06-24 22:06:58.644521+00');
INSERT INTO public.especialidades_definiciones VALUES ('c3e27a58-edea-4e8d-a6a0-9ccdfdaed177', 3, 'deportes', 'Boxeo', 'Técnicas de golpeo, defensa, esquiva y acondicionamiento físico del pugilismo.', NULL, '2026-06-24 22:06:58.645772+00');
INSERT INTO public.especialidades_definiciones VALUES ('be6b9603-5c0f-4aa9-b883-f48de0dc8961', 3, 'deportes', 'Lucha', 'Técnicas de derribo, control y sumisión en disciplinas de combate.', NULL, '2026-06-24 22:06:58.646985+00');
INSERT INTO public.especialidades_definiciones VALUES ('0cf15ab7-526e-4955-8074-aae459c749bf', 3, 'deportes', 'Fútbol', 'Tácticas, dominio del balón y trabajo en equipo sobre la cancha.', NULL, '2026-06-24 22:06:58.648276+00');
INSERT INTO public.especialidades_definiciones VALUES ('5026a353-e365-4923-b59b-d7f59be54e11', 3, 'deportes', 'Handball', 'Pases, tiros a portería y juego colectivo con las manos.', NULL, '2026-06-24 22:06:58.649292+00');
INSERT INTO public.especialidades_definiciones VALUES ('ae7c5e87-5dbe-4683-898e-04aa73778622', 3, 'deportes', 'Escalada', 'Ascenso en roca o muro artificial, uso de arnés, cuerdas y seguridad.', NULL, '2026-06-24 22:06:58.651384+00');
INSERT INTO public.especialidades_definiciones VALUES ('b6fe737f-c649-47a7-a250-95249a8d6156', 3, 'deportes', 'Descenso', 'Técnicas de rápel y descenso controlado en laderas u obstáculos.', NULL, '2026-06-24 22:06:58.652622+00');
INSERT INTO public.especialidades_definiciones VALUES ('7982050c-752d-47a5-8a56-c1765598c3cb', 3, 'deportes', 'Tenis', 'Técnicas de raqueta, saques, golpes y reglas del juego en cancha.', NULL, '2026-06-24 22:06:58.653944+00');
INSERT INTO public.especialidades_definiciones VALUES ('ef99e0a3-cd43-4cfe-8646-e84aebb64265', 3, 'deportes', 'Pádel', 'Juego de palas, rebotes en paredes y dinámica de dobles.', NULL, '2026-06-24 22:06:58.654966+00');
INSERT INTO public.especialidades_definiciones VALUES ('fa172a05-1d9e-4328-8781-998391bf88c6', 3, 'deportes', 'Tenis de Mesa', 'Reflejos, golpes con efecto y agilidad mental con la paleta.', NULL, '2026-06-24 22:06:58.655987+00');
INSERT INTO public.especialidades_definiciones VALUES ('c26154bd-cde8-47f8-aa7d-3b71186a4e24', 3, 'deportes', 'Rugby', 'Tácticas de juego, pases hacia atrás, tackles y espíritu de equipo.', NULL, '2026-06-24 22:06:58.65693+00');
INSERT INTO public.especialidades_definiciones VALUES ('e9502b63-31e4-439b-b04b-bc5c7c97644e', 3, 'deportes', 'Vóleibol', 'Saques, recepciones, voleos, remates y juego en red.', NULL, '2026-06-24 22:06:58.657865+00');
INSERT INTO public.especialidades_definiciones VALUES ('3133fcb1-b332-4b30-8ce8-0545cdbf20c3', 3, 'deportes', 'Ajedrez', 'Estrategia, táctica, aperturas y desarrollo del pensamiento lógico.', NULL, '2026-06-24 22:06:58.658776+00');
INSERT INTO public.especialidades_definiciones VALUES ('c2527d2c-2954-43e4-9f5f-93741ca3fd03', 3, 'deportes', 'Juegos de Cartas', 'Estrategias, reglas y socialización mediante juegos de naipes.', NULL, '2026-06-24 22:06:58.659678+00');
INSERT INTO public.especialidades_definiciones VALUES ('26e16a8c-fd5b-43d8-82c4-1632fedd70ca', 3, 'deportes', 'Cubos Rubik', 'Algoritmos, velocidad y resolución del rompecabezas tridimensional.', NULL, '2026-06-24 22:06:58.660623+00');
INSERT INTO public.especialidades_definiciones VALUES ('1b6b91a0-f67c-417e-9b1e-7bbf38e503dc', 3, 'deportes', 'Juego de Pañolines', 'Juegos tradicionales scouts de agilidad, estrategia y trabajo en equipo.', NULL, '2026-06-24 22:06:58.661846+00');
INSERT INTO public.especialidades_definiciones VALUES ('e081305f-8c78-422d-ac2b-233e50cf07de', 3, 'arte_expresion', 'Artesanía', 'Creación de piezas decorativas o utilitarias con técnicas manuales y materiales diversos.', NULL, '2026-06-24 22:06:58.663217+00');
INSERT INTO public.especialidades_definiciones VALUES ('16668e90-af3d-4a07-90f7-5ef05121877a', 3, 'arte_expresion', 'Baile', 'Expresión corporal a través de ritmos modernos y populares.', NULL, '2026-06-24 22:06:58.664216+00');
INSERT INTO public.especialidades_definiciones VALUES ('463a81bd-2391-468c-b3da-c10f1b9fbf93', 3, 'arte_expresion', 'Coreografías', 'Creación y dirección de rutinas de baile coordinadas en grupo.', NULL, '2026-06-24 22:06:58.666725+00');
INSERT INTO public.especialidades_definiciones VALUES ('c14fc8ba-560a-4936-91b0-42b8a93ce4e6', 3, 'arte_expresion', 'Intérprete', 'Ejecución vocal o instrumental de piezas musicales de diversos autores.', NULL, '2026-06-24 22:06:58.669608+00');
INSERT INTO public.especialidades_definiciones VALUES ('1db82023-5515-43de-a733-73b15d8b7cf5', 3, 'arte_expresion', 'MC', 'Habilidades de animación, rima, improvisación y dominio del escenario.', NULL, '2026-06-24 22:06:58.670995+00');
INSERT INTO public.especialidades_definiciones VALUES ('63f4931a-d7b5-4b1f-82fb-3d432f35d9d4', 3, 'arte_expresion', 'Freestyle', 'Rap e improvisación lírica sobre bases rítmicas al instante.', NULL, '2026-06-24 22:06:58.672101+00');
INSERT INTO public.especialidades_definiciones VALUES ('8e5e97ad-6565-4fa6-9ee1-b8931b336559', 3, 'arte_expresion', 'Circo', 'Técnicas de malabarismo, equilibrio, acrobacias y artes escénicas afines.', NULL, '2026-06-24 22:06:58.673233+00');
INSERT INTO public.especialidades_definiciones VALUES ('1d75b83a-31bb-4b6d-a9ca-7b7ccdc4b4e0', 3, 'arte_expresion', 'Diseño', 'Fundamentos visuales, maquetación y comunicación gráfica creativa.', NULL, '2026-06-24 22:06:58.674473+00');
INSERT INTO public.especialidades_definiciones VALUES ('7bad1a22-1f4d-447b-8431-b8bdb6f1b078', 3, 'arte_expresion', 'Dibujo', 'Técnicas de trazo, perspectiva, sombras y boceteado.', NULL, '2026-06-24 22:06:58.675667+00');
INSERT INTO public.especialidades_definiciones VALUES ('60a7e840-b8ae-4507-bdf5-8d25bf5c7277', 3, 'arte_expresion', 'Comics', 'Creación de historias ilustradas mediante viñetas y narrativa secuencial.', NULL, '2026-06-24 22:06:58.676878+00');
INSERT INTO public.especialidades_definiciones VALUES ('1edeb8c7-561d-4db1-bdab-4ae3c79d0f1f', 3, 'arte_expresion', 'Manga', 'Estilo de dibujo japonés, entintado y narrativa visual característica.', NULL, '2026-06-24 22:06:58.677969+00');
INSERT INTO public.especialidades_definiciones VALUES ('8cea832e-8587-4840-b809-9cfb09ac2432', 3, 'arte_expresion', 'Animé', 'Estudio del arte de la animación japonesa, diseño de personajes y animación.', NULL, '2026-06-24 22:06:58.679124+00');
INSERT INTO public.especialidades_definiciones VALUES ('be94fa1a-751f-4768-a3ec-ac4abc4c06c0', 3, 'arte_expresion', 'Interpretación', 'Actuación teatral o dramática encarnando personajes con voz y cuerpo.', NULL, '2026-06-24 22:06:58.680271+00');
INSERT INTO public.especialidades_definiciones VALUES ('c0444140-fc0d-427b-871a-52e486e5841d', 3, 'arte_expresion', 'Cosplay', 'Diseño y confección de disfraces representando personajes de ficción.', NULL, '2026-06-24 22:06:58.681502+00');
INSERT INTO public.especialidades_definiciones VALUES ('690fae67-eb61-45ab-bf38-c0de867863d3', 3, 'arte_expresion', 'Cuentacuentos', 'Narración oral de historias de manera expresiva y cautivadora.', NULL, '2026-06-24 22:06:58.682827+00');
INSERT INTO public.especialidades_definiciones VALUES ('6b5d6949-1c49-405e-95b5-4ae493d991ac', 3, 'arte_expresion', 'Escultura', 'Moldeado en arcilla, madera u otros materiales para crear formas tridimensionales.', NULL, '2026-06-24 22:06:58.68396+00');
INSERT INTO public.especialidades_definiciones VALUES ('f388b12e-0c12-4704-bee6-767ebae5aa5f', 3, 'arte_expresion', 'Fotografía', 'Uso de cámara, encuadre, iluminación y edición de imágenes.', NULL, '2026-06-24 22:06:58.685255+00');
INSERT INTO public.especialidades_definiciones VALUES ('0a9eff9e-3edc-457e-a62a-73668129e9f4', 3, 'arte_expresion', 'Globoflexia', 'Creación de figuras creativas mediante el inflado y torsión de globos.', NULL, '2026-06-24 22:06:58.687108+00');
INSERT INTO public.especialidades_definiciones VALUES ('1abc80da-a454-4302-b305-bcf2b991196e', 3, 'arte_expresion', 'Lettering', 'Como caligrafía artística o escritura dibujada creativamente a mano.', NULL, '2026-06-24 22:06:58.688845+00');
INSERT INTO public.especialidades_definiciones VALUES ('c8c2abee-168a-4b81-84b6-ae84247a2e28', 3, 'arte_expresion', 'Magia', 'Ilusionismo, trucos con cartas u objetos y entretenimiento escénico.', NULL, '2026-06-24 22:06:58.690291+00');
INSERT INTO public.especialidades_definiciones VALUES ('872c761c-f145-4389-9e27-f29200e3b337', 3, 'arte_expresion', 'Malabarismo', 'Manipulación coordinada de múltiples objetos en el aire.', NULL, '2026-06-24 22:06:58.691438+00');
INSERT INTO public.especialidades_definiciones VALUES ('f4785992-e4f7-4050-8aad-03ca77bc37b8', 3, 'arte_expresion', 'Mimo', 'Teatro gestual, lenguaje corporal e historias sin palabras.', NULL, '2026-06-24 22:06:58.692563+00');
INSERT INTO public.especialidades_definiciones VALUES ('3fa985d7-131d-4f2a-8c4e-1dd026aba228', 3, 'arte_expresion', 'Origami', 'Creación de figuras mediante el plegado de papel sin usar tijeras ni pegamento.', NULL, '2026-06-24 22:06:58.693651+00');
INSERT INTO public.especialidades_definiciones VALUES ('be8837de-b00f-4a6c-9984-5c8704426ae3', 3, 'arte_expresion', 'Pintura', 'Uso del color, pinceles y diversas técnicas sobre lienzo o papel.', NULL, '2026-06-24 22:06:58.694741+00');
INSERT INTO public.especialidades_definiciones VALUES ('32f0895a-fdb2-47ed-9b2d-8adba9d08f38', 3, 'arte_expresion', 'Actuación', 'Técnicas de actuación para cine, televisión o artes representativas.', NULL, '2026-06-24 22:06:58.69696+00');
INSERT INTO public.especialidades_definiciones VALUES ('6296b29e-c935-4e50-be98-738b0596ccc9', 3, 'arte_expresion', 'Tejido', 'Confección de prendas o accesorios usando agujas, crochet o telares.', NULL, '2026-06-24 22:06:58.697986+00');
INSERT INTO public.especialidades_definiciones VALUES ('33a23a9e-c3b6-48f4-8c63-d8ef3451af55', 3, 'arte_expresion', 'Bordado', 'Decoración de telas mediante costuras con hilos de colores a mano.', NULL, '2026-06-24 22:06:58.699+00');
INSERT INTO public.especialidades_definiciones VALUES ('872d85c1-f2f8-4d41-bcfb-f315f21a2cf4', 3, 'arte_expresion', 'Vestuario', 'Diseño y selección de prendas de vestir para representaciones o uso temático.', NULL, '2026-06-24 22:06:58.699999+00');
INSERT INTO public.especialidades_definiciones VALUES ('ab17a298-4cbc-447c-84ad-b4b66b4d12fa', 3, 'arte_expresion', 'Confección', 'Corte, costura y armado de prendas textiles a partir de patrones.', NULL, '2026-06-24 22:06:58.700981+00');
INSERT INTO public.especialidades_definiciones VALUES ('42a5360d-42ad-4284-b31b-6efc0ab4f722', 3, 'arte_expresion', 'Armónica', 'Técnicas de respiración y ejecución del instrumento de viento metal.', NULL, '2026-06-24 22:06:58.702067+00');
INSERT INTO public.especialidades_definiciones VALUES ('1a7069a8-4a46-4cec-a305-6253880b4598', 3, 'arte_expresion', 'Bajo', 'Estudio del bajo eléctrico, ritmos, acordes y acompañamiento musical.', NULL, '2026-06-24 22:06:58.703488+00');
INSERT INTO public.especialidades_definiciones VALUES ('e8f62d89-2420-4572-a858-56307edc94c3', 3, 'arte_expresion', 'Batería', 'Coordinación, ritmo y percusión en la batería acústica o electrónica.', NULL, '2026-06-24 22:06:58.704669+00');
INSERT INTO public.especialidades_definiciones VALUES ('2bae7b2b-3072-493e-a5c9-b041cff4935c', 3, 'arte_expresion', 'DJ', 'Mezcla de pistas musicales, ecualización y animación en vivo.', NULL, '2026-06-24 22:06:58.705752+00');
INSERT INTO public.especialidades_definiciones VALUES ('b030cfa9-0828-464c-8c84-84145fc22267', 3, 'arte_expresion', 'Beatmaker', 'Creación y producción de bases musicales y ritmos digitales.', NULL, '2026-06-24 22:06:58.706764+00');
INSERT INTO public.especialidades_definiciones VALUES ('2e051026-ba10-4f7c-a23c-ca7d63e090ac', 3, 'arte_expresion', 'Guitarra', 'Técnicas de punteo, acordes, rasgueos y afinación de la guitarra.', NULL, '2026-06-24 22:06:58.707722+00');
INSERT INTO public.especialidades_definiciones VALUES ('08deef9a-4334-4d4b-8d7c-2483e03593a9', 3, 'arte_expresion', 'Violín', 'Postura, uso del arco y afinación en el instrumento de cuerda frotada.', NULL, '2026-06-24 22:06:58.708693+00');
INSERT INTO public.especialidades_definiciones VALUES ('bf07c278-2b24-4809-8d3a-8a459ed526e8', 3, 'arte_expresion', 'Piano', 'Lectura musical, digitación y técnicas del teclado.', NULL, '2026-06-24 22:06:58.709648+00');
INSERT INTO public.especialidades_definiciones VALUES ('66332850-19ba-4138-b878-81b5936693c4', 3, 'arte_expresion', 'Flauta', 'Ejecución de flauta dulce o traversa y lectura de partituras.', NULL, '2026-06-24 22:06:58.710652+00');
INSERT INTO public.especialidades_definiciones VALUES ('6b2fc0b4-825c-4d46-b8a1-fb6c3619305f', 3, 'arte_expresion', 'Órgano', 'Ejecución del teclado electrónico con efectos y armonías avanzadas.', NULL, '2026-06-24 22:06:58.711617+00');
INSERT INTO public.especialidades_definiciones VALUES ('df5691d6-b655-42c6-aa29-b3681d878af7', 3, 'arte_expresion', 'Corneta', 'Toques oficiales scouts y uso de la corneta o bugle.', NULL, '2026-06-24 22:06:58.712609+00');
INSERT INTO public.especialidades_definiciones VALUES ('11818d88-7cd7-430c-950c-758827d8a236', 3, 'arte_expresion', 'Idiomas', 'Aprendizaje de vocabulario y conversación en una lengua extranjera.', NULL, '2026-06-24 22:06:58.714656+00');
INSERT INTO public.especialidades_definiciones VALUES ('31143fbf-2c3e-4b6a-ac3d-bba09b22f30a', 3, 'arte_expresion', 'Capoeira', 'Arte marcial afrobrasileño que combina danza, acrobacias y música.', NULL, '2026-06-24 22:06:58.715606+00');
INSERT INTO public.especialidades_definiciones VALUES ('081c6414-0354-4490-9e0b-6be8ad6ac2ae', 3, 'arte_expresion', 'Cultura de los Pueblos Originarios', 'Estudio de las tradiciones, lenguas e historia de las etnias indígenas chilenas.', NULL, '2026-06-24 22:06:58.716579+00');
INSERT INTO public.especialidades_definiciones VALUES ('41eed946-f154-4cbb-a9d1-42d759f18735', 3, 'arte_expresion', 'Cultura Rapa Nui', 'Conocimiento de la historia, danzas, tallados y leyendas de Isla de Pascua.', NULL, '2026-06-24 22:06:58.717588+00');
INSERT INTO public.especialidades_definiciones VALUES ('224f4821-c8a4-402e-b0b5-7b111ade8a9e', 3, 'arte_expresion', 'Historia Guía y Scout', 'Orígenes del movimiento, biografía de Baden-Powell e hitos en Chile.', NULL, '2026-06-24 22:06:58.718793+00');
INSERT INTO public.especialidades_definiciones VALUES ('cc400c8c-3d90-45a7-b92f-76b9ed314bd8', 3, 'arte_expresion', 'Coleccionismo', 'Clasificación, conservación e historia de objetos de colección.', NULL, '2026-06-24 22:06:58.720245+00');
INSERT INTO public.especialidades_definiciones VALUES ('75f970ce-9efb-4f50-b8d6-1ba9935e46a8', 3, 'arte_expresion', 'Patrimonio', 'Estudio y conservación de monumentos, relatos e historia de tu localidad o país.', NULL, '2026-06-24 22:06:58.721672+00');
INSERT INTO public.especialidades_definiciones VALUES ('43f8d114-6c91-47fe-a422-b729e9403f31', 3, 'arte_expresion', 'Cocina Saludable', 'Preparación de menús equilibrados, nutrición y alimentación consciente.', NULL, '2026-06-24 22:06:58.723006+00');
INSERT INTO public.especialidades_definiciones VALUES ('d62f95c3-0e28-42be-9ba4-54cd7d36f365', 3, 'arte_expresion', 'Literatura', 'Apreciación literaria, redacción creativa de cuentos o poesía y lectura.', NULL, '2026-06-24 22:06:58.724329+00');
INSERT INTO public.especialidades_definiciones VALUES ('e06e4242-c767-4f9f-b9f8-70dd2afbb0ee', 3, 'arte_expresion', 'Repostería', 'Preparación de postres, masas dulces, pastelería y técnicas de horneado.', NULL, '2026-06-23 07:23:22.095449+00');
INSERT INTO public.especialidades_definiciones VALUES ('9a478f51-24e1-4401-aff8-c7da73adf61d', 3, 'ciencia_tecnologia', 'Arqueología', 'Estudio de civilizaciones antiguas a través de la excavación y análisis de artefactos.', NULL, '2026-06-24 22:06:58.726645+00');
INSERT INTO public.especialidades_definiciones VALUES ('070eaec8-3b9d-46c4-b0c0-20f4b0ff20db', 3, 'ciencia_tecnologia', 'Astronomía', 'Reconocimiento de constelaciones, planetas, galaxias y fenómenos celestes.', NULL, '2026-06-24 22:06:58.727879+00');
INSERT INTO public.especialidades_definiciones VALUES ('5950d466-1a64-4bb7-be26-6e0593dc4fe6', 3, 'ciencia_tecnologia', 'Construcción', 'Principios de edificación, uso seguro de herramientas y maquetas.', NULL, '2026-06-24 22:06:58.73057+00');
INSERT INTO public.especialidades_definiciones VALUES ('a6eba16e-4c0e-4b1f-94f4-04a216647dea', 3, 'ciencia_tecnologia', 'Electricidad', 'Circuitos básicos, medidas de seguridad y reparaciones menores del hogar.', NULL, '2026-06-24 22:06:58.73224+00');
INSERT INTO public.especialidades_definiciones VALUES ('5ea554e0-cbbf-4b80-b942-298f5a70615f', 3, 'ciencia_tecnologia', 'Energía Solar', 'Aprovechamiento del sol, celdas fotovoltaicas y hornos solares caseros.', NULL, '2026-06-24 22:06:58.733303+00');
INSERT INTO public.especialidades_definiciones VALUES ('0dde6938-6935-43aa-9c0f-6c08a575f639', 3, 'ciencia_tecnologia', 'Geología', 'Estudio de rocas, minerales, placas tectónicas y relieve terrestre.', NULL, '2026-06-24 22:06:58.734415+00');
INSERT INTO public.especialidades_definiciones VALUES ('8cf9e32e-850f-4a89-a902-5d944d3ab595', 3, 'ciencia_tecnologia', 'Insectos', 'Observación y clasificación de especies de insectos de tu entorno.', NULL, '2026-06-24 22:06:58.735545+00');
INSERT INTO public.especialidades_definiciones VALUES ('54c61476-3bfc-4538-867d-e4f6cca2d061', 3, 'ciencia_tecnologia', 'Entomología', 'Estudio científico de la anatomía, comportamiento e importancia ecológica de los insectos.', NULL, '2026-06-24 22:06:58.736952+00');
INSERT INTO public.especialidades_definiciones VALUES ('a2b73f5f-3798-4e40-819d-c5630309554f', 3, 'ciencia_tecnologia', 'Mecánica', 'Funcionamiento de motores, engranajes y herramientas mecánicas.', NULL, '2026-06-24 22:06:58.73801+00');
INSERT INTO public.especialidades_definiciones VALUES ('0b37478d-fb9d-4ca9-9833-1212572d48dc', 3, 'ciencia_tecnologia', 'Automovilismo', 'Funcionamiento del automóvil, señales del tránsito y mantenimiento básico.', NULL, '2026-06-24 22:06:58.739076+00');
INSERT INTO public.especialidades_definiciones VALUES ('d43f8a13-bbd9-4756-8be3-be813e31a94f', 3, 'ciencia_tecnologia', 'Paleontología', 'Estudio de fósiles y de la vida en eras geológicas pasadas.', NULL, '2026-06-24 22:06:58.74005+00');
INSERT INTO public.especialidades_definiciones VALUES ('3b9f5426-9f08-47b1-ac0e-f3f9000e346b', 3, 'ciencia_tecnologia', 'Dinosaurios', 'Estudio de las especies prehistóricas de dinosaurios y sus ecosistemas.', NULL, '2026-06-24 22:06:58.740982+00');
INSERT INTO public.especialidades_definiciones VALUES ('d4fba0c0-e3f0-4732-af7b-734813d17565', 3, 'ciencia_tecnologia', 'Matemáticas', 'Resolución de acertijos matemáticos, lógica y aplicaciones numéricas cotidianas.', NULL, '2026-06-24 22:06:58.741936+00');
INSERT INTO public.especialidades_definiciones VALUES ('9155bcb0-8a7f-40ca-93f8-f73bee61a577', 3, 'ciencia_tecnologia', 'Computación', 'Fundamentos de hardware, software, internet seguro y ofimática.', NULL, '2026-06-24 22:06:58.742887+00');
INSERT INTO public.especialidades_definiciones VALUES ('0c3f700c-3801-4533-b749-b336cb8eb43c', 3, 'ciencia_tecnologia', 'Desarrollador de Contenidos', 'Creación de blogs, videos informativos o podcasts de manera ética y atractiva.', NULL, '2026-06-24 22:06:58.743905+00');
INSERT INTO public.especialidades_definiciones VALUES ('6b8c53ae-190a-458a-8aff-6b379a900ecd', 3, 'ciencia_tecnologia', 'Manejo de Drones', 'Pilotaje responsable de drones, aerodinámica y normativa vigente.', NULL, '2026-06-24 22:06:58.744905+00');
INSERT INTO public.especialidades_definiciones VALUES ('44800768-3844-4f15-be42-da59b81133eb', 3, 'ciencia_tecnologia', 'Robótica', 'Programación y armado de robots sencillos con sensores y motores.', NULL, '2026-06-24 22:06:58.74585+00');
INSERT INTO public.especialidades_definiciones VALUES ('9c52d5f9-5f10-40ee-9b99-d9ccca13eb30', 3, 'ciencia_tecnologia', 'Videojuegos', 'Historia de los videojuegos, diseño de niveles y análisis de jugabilidad.', NULL, '2026-06-24 22:06:58.74693+00');
INSERT INTO public.especialidades_definiciones VALUES ('b842d047-2f34-4b0b-aee9-2c7b5d60a14d', 3, 'ciencia_tecnologia', 'Gamer', 'Juego competitivo saludable, estrategia digital y juego limpio online.', NULL, '2026-06-24 22:06:58.747893+00');
INSERT INTO public.especialidades_definiciones VALUES ('53cc349a-0a62-449a-8913-4fcc0adbc7cb', 3, 'espiritual', 'Mándalas', 'Diseño y coloreado de mandalas como método de concentración y meditación.', NULL, '2026-06-24 22:06:58.748843+00');
INSERT INTO public.especialidades_definiciones VALUES ('f906871a-359b-44c9-a617-ed9a1743ff13', 3, 'espiritual', 'Meditación', 'Técnicas de respiración, mindfulness y búsqueda del equilibrio interior.', NULL, '2026-06-24 22:06:58.74979+00');
INSERT INTO public.especialidades_definiciones VALUES ('ba699708-80b4-4219-abff-477620505ae1', 3, 'espiritual', 'Tradiciones de los Pueblos Originarios', 'Estudio de la espiritualidad, cosmovisión y conexión con la naturaleza de los pueblos nativos.', NULL, '2026-06-24 22:06:58.750806+00');
INSERT INTO public.especialidades_definiciones VALUES ('65ebb2f2-5d27-476c-8841-8ca96ff9bd9f', 3, 'espiritual', 'Yoga', 'Posturas físicas, estiramientos, equilibrio y respiración consciente.', NULL, '2026-06-24 22:06:58.752113+00');
INSERT INTO public.especialidades_definiciones VALUES ('5ecdcf5c-7055-4b30-ae25-77e7e6eb02a2', 3, 'espiritual', 'Animación de la Fé', 'Liderazgo en oraciones, reflexiones espirituales y cantos religiosos.', NULL, '2026-06-24 22:06:58.753472+00');
INSERT INTO public.especialidades_definiciones VALUES ('afa1f632-255d-488e-9c41-019f2251b91b', 3, 'servicio_comunidad', 'Compostaje', 'Transformación de residuos orgánicos en abono para huertas y plantas.', NULL, '2026-06-24 22:06:58.75459+00');
INSERT INTO public.especialidades_definiciones VALUES ('7d97001f-d0e3-4850-94d9-3dadfde6dc14', 3, 'servicio_comunidad', 'Reciclaje', 'Clasificación, reducción y reutilización creativa de cartón, vidrio, plásticos y metales.', NULL, '2026-06-24 22:06:58.755679+00');
INSERT INTO public.especialidades_definiciones VALUES ('777b7c81-fe3a-44fa-a3f9-9663b8231900', 3, 'servicio_comunidad', 'Sostenibilidad', 'Prácticas ecológicas cotidianas para reducir la huella de carbono.', NULL, '2026-06-24 22:06:58.75671+00');
INSERT INTO public.especialidades_definiciones VALUES ('d77cfcf8-e153-4bd1-a868-16d2d1d9a0b1', 3, 'servicio_comunidad', 'Apoyo en Emergencias y Desastres', 'Planes de evacuación familiar, mochilas de emergencia y primeros auxilios organizativos.', NULL, '2026-06-24 22:06:58.757672+00');
INSERT INTO public.especialidades_definiciones VALUES ('0f0aad48-cc02-407f-af74-e724197a400a', 3, 'servicio_comunidad', 'Cadete bomberos', 'Conocimiento del servicio de bomberos, prevención de incendios y rescate básico.', NULL, '2026-06-24 22:06:58.758688+00');
INSERT INTO public.especialidades_definiciones VALUES ('702d7b86-0362-4d62-af2e-85da01f1c3f3', 3, 'servicio_comunidad', 'Cuidado de Animales', 'Tenencia responsable, alimentación y primeros auxilios para mascotas.', NULL, '2026-06-24 22:06:58.759687+00');
INSERT INTO public.especialidades_definiciones VALUES ('50b49e93-df61-4c54-a3de-83370b37c989', 3, 'servicio_comunidad', 'No + Bullyng', 'Promoción del respeto, empatía y prevención del acoso escolar y digital.', NULL, '2026-06-24 22:06:58.760656+00');
INSERT INTO public.especialidades_definiciones VALUES ('336a1315-e556-4989-b2de-63dfc2e1ece5', 3, 'servicio_comunidad', 'Emprendimiento', 'Planificación de un negocio pequeño, presupuestos y mercadeo.', NULL, '2026-06-24 22:06:58.761712+00');
INSERT INTO public.especialidades_definiciones VALUES ('518c1f75-6d54-43e7-bdeb-f889d924adca', 3, 'servicio_comunidad', 'Lengua de Señas', 'Vocabulario básico, abecedario dactilológico y comunicación inclusiva básica.', NULL, '2026-06-24 22:06:58.763086+00');
INSERT INTO public.especialidades_definiciones VALUES ('8ef1a056-c7c2-4717-9a2b-97b073f7804f', 3, 'servicio_comunidad', 'Reparaciones Domésticas', 'Mantención del hogar, pintura, gasfitería básica y carpintería.', NULL, '2026-06-24 22:06:58.764238+00');
INSERT INTO public.especialidades_definiciones VALUES ('40d33173-681d-4cf9-a5ef-34d8d8af4612', 3, 'servicio_comunidad', 'Cosmética', 'Elaboración artesanal y natural de jabones, cremas y bálsamos ecológicos.', NULL, '2026-06-24 22:06:58.765245+00');
INSERT INTO public.especialidades_definiciones VALUES ('e5f4349a-5dca-4ec3-add3-7137cbd739d0', 3, 'servicio_comunidad', 'Nutrición', 'Elaboración de dietas balanceadas y hábitos de vida saludables.', NULL, '2026-06-24 22:06:58.766332+00');
INSERT INTO public.especialidades_definiciones VALUES ('09c34b85-ad50-41c1-8d60-b3fa002e37b3', 3, 'servicio_comunidad', 'Prevención de Riesgos', 'Identificación de peligros en el hogar, escuela o campamento y cómo evitarlos.', NULL, '2026-06-24 22:06:58.767712+00');
INSERT INTO public.especialidades_definiciones VALUES ('3ca4de6f-6b3d-46a9-a98d-c8bd3b86dbdb', 3, 'aire_libre', 'Construcciones de Campamento', 'Uso de coligües o troncos, amarres y diseño de comedores o portadas.', NULL, '2026-06-24 22:06:58.772162+00');
INSERT INTO public.especialidades_definiciones VALUES ('12d70bb3-4f32-43c0-8a7e-ebcd87512b1f', 3, 'aire_libre', 'Mínimo Impacto', 'Principios de No Dejar Rastro en excursiones y campamentos.', NULL, '2026-06-24 22:06:58.773203+00');
INSERT INTO public.especialidades_definiciones VALUES ('90f3f7f2-b27b-4caf-bc94-ee16044f547a', 3, 'aire_libre', 'Nudos', 'Técnicas de cabuyería, nudos útiles y su aplicación práctica.', NULL, '2026-06-24 22:06:58.774179+00');
INSERT INTO public.especialidades_definiciones VALUES ('bd8718ae-31b0-4249-9c00-bdb356e44c89', 3, 'aire_libre', 'Orientación', 'Lectura de mapas, uso de la brújula, GPS y orientación por astros.', NULL, '2026-06-24 22:06:58.775685+00');
INSERT INTO public.especialidades_definiciones VALUES ('2757efd2-a856-4427-8b42-2c3b1521df3f', 3, 'aire_libre', 'Trekking', 'Senderismo responsable, técnicas de caminata y equipo técnico.', NULL, '2026-06-24 22:06:58.777259+00');
INSERT INTO public.especialidades_definiciones VALUES ('76818217-dec8-4855-b1fd-463d5a8f5dfd', 3, 'aire_libre', 'Acecho', 'Caminar sigilosamente y camuflaje en la naturaleza para la observación.', NULL, '2026-06-24 22:06:58.778983+00');
INSERT INTO public.especialidades_definiciones VALUES ('fa4daa50-7fe9-4c9b-8241-0b804eb84ac5', 3, 'aire_libre', 'Observación', 'Registro de flora, fauna y clima en bitácoras de campo.', NULL, '2026-06-24 22:06:58.78066+00');
INSERT INTO public.especialidades_definiciones VALUES ('59b281c6-0cd2-455f-b712-29b147a81e2b', 3, 'aire_libre', 'Claves', 'Lectura y cifrado de mensajes usando clave morse, semáforo u otras.', NULL, '2026-06-24 22:06:58.781712+00');
INSERT INTO public.especialidades_definiciones VALUES ('a40ffb83-bde8-4f9c-9d55-06b6e82167a9', 3, 'aire_libre', 'Pistas', 'Seguimiento de rastros naturales o artificiales en excursiones.', NULL, '2026-06-24 22:06:58.782734+00');
INSERT INTO public.especialidades_definiciones VALUES ('94ec91d0-a359-40bc-bb63-b86159627433', 3, 'aire_libre', 'Guía de turismo', 'Liderazgo de grupos, relatos históricos y guiado por rutas locales.', NULL, '2026-06-24 22:06:58.783731+00');
INSERT INTO public.especialidades_definiciones VALUES ('01e24a3a-3504-4ead-9fbf-fe6ce90d5201', 3, 'aire_libre', 'Cocina', 'Cocina al aire libre con cocinilla o fogata y cuidado de alimentos.', NULL, '2026-06-24 22:06:58.713694+00');
INSERT INTO public.especialidades_definiciones VALUES ('2e739df9-056c-41bc-b5a1-2d909f94257d', 3, 'aire_libre', 'Woodcraft', 'Talla en madera, artesanías de campamento y uso seguro de cuchillo.', NULL, '2026-06-24 22:06:58.787364+00');


--
-- Data for Name: progresion_areas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.progresion_areas VALUES (1, 'Corporalidad', '#E74C3C', 'fitness_center', NULL, '2026-06-11 07:13:19.03755+00');
INSERT INTO public.progresion_areas VALUES (2, 'Creatividad', '#F1C40F', 'lightbulb', NULL, '2026-06-11 07:13:19.03755+00');
INSERT INTO public.progresion_areas VALUES (3, 'Carácter', '#3498DB', 'person', NULL, '2026-06-11 07:13:19.03755+00');
INSERT INTO public.progresion_areas VALUES (4, 'Afectividad', '#9B59B6', 'favorite', NULL, '2026-06-11 07:13:19.03755+00');
INSERT INTO public.progresion_areas VALUES (5, 'Sociabilidad', '#2ECC71', 'group', NULL, '2026-06-11 07:13:19.03755+00');
INSERT INTO public.progresion_areas VALUES (6, 'Espiritualidad', '#95A5A6', 'wb_sunny', NULL, '2026-06-11 07:13:19.03755+00');


--
-- Data for Name: progresion_etapas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.progresion_etapas VALUES (1, 1, 'Lobezno', 1, 'Infancia Media', NULL, NULL, '/images/progresion/manada/etapa_lobezno.png');
INSERT INTO public.progresion_etapas VALUES (2, 1, 'Saltador', 2, 'Infancia Media', NULL, NULL, '/images/progresion/manada/etapa_saltador.png');
INSERT INTO public.progresion_etapas VALUES (3, 1, 'Diestro', 3, 'Infancia Tardía', NULL, NULL, '/images/progresion/manada/etapa_diestro.png');
INSERT INTO public.progresion_etapas VALUES (4, 1, 'Cazador', 4, 'Infancia Tardía', NULL, NULL, '/images/progresion/manada/etapa_cazador.png');
INSERT INTO public.progresion_etapas VALUES (38, 2, 'Alba', 1, '11 a 13 años', NULL, NULL, '/images/progresion/compania/etapa_alba.png');
INSERT INTO public.progresion_etapas VALUES (39, 2, 'Amanecer', 2, '11 a 13 años', NULL, NULL, '/images/progresion/compania/etapa_amanecer.png');
INSERT INTO public.progresion_etapas VALUES (40, 2, 'Luz', 3, '13 a 15 años', NULL, NULL, '/images/progresion/compania/etapa_luz.png');
INSERT INTO public.progresion_etapas VALUES (41, 2, 'Resplandor', 4, '13 a 15 años', NULL, NULL, '/images/progresion/compania/etapa_resplandor.png');
INSERT INTO public.progresion_etapas VALUES (42, 3, 'Cernícalo', 1, '11 a 13 años', NULL, NULL, '/images/progresion/tropa/etapa_cernicalo.png');
INSERT INTO public.progresion_etapas VALUES (43, 3, 'Halcón', 2, '11 a 13 años', NULL, NULL, '/images/progresion/tropa/etapa_halcon.png');
INSERT INTO public.progresion_etapas VALUES (44, 3, 'Águila', 3, '13 a 15 años', NULL, NULL, '/images/progresion/tropa/etapa_aguila.png');
INSERT INTO public.progresion_etapas VALUES (45, 3, 'Cóndor', 4, '13 a 15 años', NULL, NULL, '/images/progresion/tropa/etapa_condor.png');
INSERT INTO public.progresion_etapas VALUES (46, 4, 'Sendero', 1, '15 a 17 años', NULL, NULL, '/images/progresion/avanzada/etapa_sendero.png');
INSERT INTO public.progresion_etapas VALUES (47, 4, 'Cumbre', 2, '15 a 17 años', NULL, NULL, '/images/progresion/avanzada/etapa_cumbre.png');
INSERT INTO public.progresion_etapas VALUES (48, 5, 'Fuego', 1, '17 a 20 años', NULL, NULL, '/images/progresion/clan/etapa_fuego.png');
INSERT INTO public.progresion_etapas VALUES (49, 5, 'Antorcha', 2, '17 a 20 años', NULL, NULL, '/images/progresion/clan/etapa_antorcha.png');


--
-- Data for Name: progresion_objetivos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.progresion_objetivos VALUES ('dff629b3-b399-4eb0-b2d5-c46acd2b8931', 1, 1, NULL, 'Infancia Tardía', 'Ando siempre limpio y se nota, por ejemplo, en mi pelo, orejas, dientes y uñas.', 'Valora su aspecto y cuida su higiene personal y la de su entorno.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('be23a0f1-0fa3-426a-bf45-80565066d3cb', 1, 1, NULL, 'Infancia Tardía', 'Sé que tengo que comer los alimentos que me ayudan a crecer.', 'Mantiene una alimentación sencilla y adecuada.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('b76e1d3e-fc1e-4956-806b-f372cd0369bb', 1, 1, NULL, 'Infancia Media', 'Me preocupo porque mi cuerpo esté limpio.', 'Valora su aspecto y cuida su higiene personal y la de su entorno.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('0956c462-5ae8-4a34-8a7d-c08a9b092516', 1, 1, NULL, 'Infancia Media', 'Trato de seguir los consejos que me dan los más grandes para tener un cuerpo fuerte y sano.', 'Asume la parte de responsabilidad que le corresponde en el desarrollo armónico de su cuerpo.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('59c2ff09-83c5-4ace-a5f8-54a8e86c4d9c', 1, 1, NULL, 'Infancia Media', 'Trato de comer de todo y no digo que algo no me gusta sin haberlo probado antes.', 'Mantiene una alimentación sencilla y adecuada.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('418f2b77-f15b-405a-95bd-8033c0b6a4c2', 2, 1, NULL, 'Infancia Tardía', 'Puedo contar con detalles las anécdotas y aventuras que hemos tenido en la Manada.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('942e2a3a-b7b5-4b88-b82a-261244f3683e', 1, 1, NULL, 'Infancia Media', 'He aprendido a medir los riesgos que tienen los juegos y las cosas que hago.', 'Asume la parte de responsabilidad que le corresponde en el desarrollo armónico de su cuerpo.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('b90f17ed-6015-47ea-9f1b-913218d6fccd', 1, 1, NULL, 'Infancia Media', 'Ayudo a limpiar y ordenar los lugares en que estoy.', 'Valora su aspecto y cuida su higiene personal y la de su entorno.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('6467298d-fe2b-4920-9b9a-e3524e4b2aef', 1, 1, NULL, 'Infancia Tardía', 'Sé en qué lugar de mi cuerpo están ubicados los órganos más importantes.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('8985ff05-ee84-4fba-af46-146c5374df89', 2, 1, NULL, 'Infancia Media', 'Participo en los talleres de manualidades que se hacen en la Manada.', 'Une los conocimientos teórico y práctico mediante la aplicación constante de sus habilidades técnicas y manuales.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('26c3a88f-5dd1-4b71-9919-07f14ed5b61e', 2, 1, NULL, 'Infancia Media', 'Quiero aprender cosas nuevas.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('273f60b8-7953-4416-97c3-e8c83615364f', 1, 2, NULL, '11 a 13 años', 'Participo en actividades que me ayudan a mantener mi cuerpo fuerte y sano.', 'Asume la parte de responsabilidad que le corresponde en el desarrollo armónico de su cuerpo.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('66de9e77-aa53-48a1-98db-9de3d3958486', 4, 1, NULL, 'Infancia Tardía', 'Puedo hablar con los demás de las cosas que me ponen alegre y también de las que me ponen triste.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('2394dd5b-87b9-4f3d-9cdd-a42649139782', 5, 1, NULL, 'Infancia Tardía', 'Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre esté de acuerdo con ellas', 'Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('c8993915-0234-464c-934e-2a09f8c4338e', 4, 1, NULL, 'Infancia Tardía', 'Digo lo que pienso sin ofender o insultar a mis compañeros ni burlarme de ellos.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('47bc73e4-d954-48e5-872b-5e18c48b186a', 6, 1, NULL, 'Infancia Media', 'Conozco las principales oraciones de la Manada.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('a7539c03-7e17-4e1b-8e3b-081c8a8161cc', 2, 1, NULL, 'Infancia Tardía', 'Investigo y descubro cómo funcionan las cosas.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('5cbe35dc-d15b-4070-9a36-5b0e652c7946', 5, 1, NULL, 'Infancia Tardía', 'Respeto las opiniones de los demás.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('339ca69e-049b-4861-835e-d36f6139bcf6', 6, 1, NULL, 'Infancia Tardía', 'Comprendo la importancia de rezar juntos en la Manada.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('705b686a-8374-467a-b871-f6470f0d58ae', 1, 2, NULL, '11 a 13 años', 'Me doy cuenta de los cambios que se están produciendo en mi cuerpo.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('b146e0a9-400a-484a-aff4-931528c193e2', 1, 2, NULL, '11 a 13 años', 'Trato de evitar situaciones que puedan dañar mi salud y la de mis compañeras.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('0ba0d3c3-a50a-4a04-8981-601dc7746dd6', 1, 2, NULL, '11 a 13 años', 'Sé lo que puedo y no puedo hacer con mi cuerpo.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('5028854e-fa2e-4724-8662-812ce34fbdb8', 1, 2, NULL, '11 a 13 años', 'Trato de no ser agresiva en juegos y actividades.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('92033b6f-909a-47c4-98b9-fe31db85f9ec', 1, 2, NULL, '11 a 13 años', 'Me preocupo por mi aspecto personal y porque mi cuerpo esté limpio.', 'Valora su aspecto y cuida su higiene personal y la de su entorno.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('19c880a9-5330-42a3-8cd9-cb079bf10946', 1, 2, NULL, '11 a 13 años', 'Ayudo a ordenar y limpiar mi casa y los lugares en que estudio y juego.', 'Valora su aspecto y cuida su higiene personal y la de su entorno.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('1c8b9e06-8a78-462a-bd83-a592bb143768', 1, 2, NULL, '11 a 13 años', 'Como los alimentos que me ayudan a crecer y lo hago a las horas adecuadas.', 'Mantiene una alimentación sencilla y adecuada.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('6c9aa7e2-9994-42fd-a735-b503f934f870', 1, 2, NULL, '11 a 13 años', 'Sé por qué es importante la limpieza al preparar y comer los alimentos.', 'Mantiene una alimentación sencilla y adecuada.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('f4590218-a833-4d8f-8547-fc3f23655811', 1, 2, NULL, '11 a 13 años', 'Le dedico al estudio el tiempo necesario.', 'Administra su tiempo equilibradamente entre sus diversas obligaciones, practicando formas apropiadas de descanso.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('d607fea0-ca2d-4087-92c8-6707dbb9a8a9', 1, 2, NULL, '11 a 13 años', 'Me gusta participar en distintas actividades recreativas.', 'Administra su tiempo equilibradamente entre sus diversas obligaciones, practicando formas apropiadas de descanso.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('d5b111f1-5f6f-4716-8a02-e1826d653c59', 1, 2, NULL, '11 a 13 años', 'Participo en los juegos, excursiones y campamentos que organiza mi patrulla.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('23f716be-638a-44ad-bd08-4d7512236a72', 1, 2, NULL, '11 a 13 años', 'Practico regularmente un deporte.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('28433366-23af-4d9a-a8c6-fbca64ef0c95', 4, 3, NULL, '13 a 15 años', 'Estoy siempre dispuesto a ayudar a mis compañeros de patrulla.', 'Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('57887da4-c70e-45bc-bdfb-f79db513a89c', 1, 2, NULL, '13 a 15 años', 'Sé qué hacer frente a una enfermedad o accidente.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('6d5d4863-b365-4ac0-8ebd-f8a647eaa6c8', 1, 2, NULL, '13 a 15 años', 'Converso con mis compañeras para resolver los problemas que se producen entre nosotras.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('43f67b2f-0d1d-4a96-bb5e-c70730dff3cc', 1, 2, NULL, '13 a 15 años', 'Me preocupo por mi aspecto personal y siempre trato de estar limpia y ordenada.', 'Valora su aspecto y cuida su higiene personal y la de su entorno.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('0741812e-1386-4a7f-a2b7-f96ca8a45bb4', 1, 2, NULL, '13 a 15 años', 'Cuido, limpio y ordeno los lugares en que acampo.', 'Valora su aspecto y cuida su higiene personal y la de su entorno.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('6de41cbf-80e7-4527-8a39-6dc788986097', 1, 2, NULL, '13 a 15 años', 'Sé qué alimentos me ayudan a crecer y cuáles no.', 'Mantiene una alimentación sencilla y adecuada.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('e4e8699e-a780-4a2a-a93c-454d00d25223', 1, 2, NULL, '13 a 15 años', 'Organizo bien mi tiempo para estudiar, compartir con mi familia y estar con mis amigas y amigos.', 'Administra su tiempo equilibradamente entre sus diversas obligaciones, practicando formas apropiadas de descanso.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('1427451e-b8b3-493b-8525-e53298381e07', 1, 2, NULL, '11 a 13 años', 'Conozco y practico diferentes juegos y respeto sus reglas.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('b12da732-d736-480c-82b8-95b312316390', 1, 2, NULL, '13 a 15 años', 'Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('a3e5dd16-5205-4d00-b79b-e14d0492e34d', 1, 2, NULL, '13 a 15 años', 'Preparo juegos para distintas ocasiones.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('1b5e42cb-c832-4c3a-8ed5-a3050b6e2285', 2, 2, NULL, '11 a 13 años', 'Me intereso por conocer más sobre lo que pasa a mi alrededor.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('aacee532-b682-4d8e-8c5d-d6e9396162a4', 2, 2, NULL, '13 a 15 años', 'Me preocupo por saber cada vez más sobre los temas que me interesan.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('fa068326-4494-40d0-a6b5-02c883e8b946', 2, 2, NULL, '13 a 15 años', 'Me intereso en leer sobre diferentes temas.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('e1b7276f-4fd2-4c39-a32a-bd7fadbee702', 2, 2, NULL, '11 a 13 años', 'Doy mi opinión sobre las cosas que me pasan.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('551a36af-f5bc-46f8-9e85-fd5af16a08bd', 2, 2, NULL, '11 a 13 años', 'Participo en la organización de las excursiones de mi patrulla.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('9f30f035-9179-4ac4-acfb-bea0e169e97a', 2, 2, NULL, '13 a 15 años', 'Propongo temas para discutir en mi patrulla.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('103661fc-3396-4eac-9182-58b7e54d5115', 2, 2, NULL, '11 a 13 años', 'Perfecciono mis habilidades manuales.', 'Une los conocimientos teórico y práctico mediante la aplicación constante de sus habilidades técnicas y manuales.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('0f60be94-6de3-4c34-a6ff-5b5018f0b156', 2, 2, NULL, '13 a 15 años', 'Coopero en la mantención y renovación del local y materiales de mi patrulla.', 'Une los conocimientos teórico y práctico mediante la aplicación constante de sus habilidades técnicas y manuales.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('b1f38e56-d524-41a4-9f91-ff698f1d1e7d', 2, 2, NULL, '11 a 13 años', 'Elijo y completo una especialidad.', 'Elige su vocación considerando conjuntamente sus aptitudes, posibilidades e intereses; y valora sin prejuicios las opciones de los demás.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('a8203ec6-e9e8-4895-8547-d37d9dfd7784', 2, 2, NULL, '13 a 15 años', 'Perfecciono mis conocimientos en las especialidades que he elegido.', 'Elige su vocación considerando conjuntamente sus aptitudes, posibilidades e intereses; y valora sin prejuicios las opciones de los demás.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('d581cfa7-db1f-4b08-b4d3-525b23e418ea', 2, 2, NULL, '11 a 13 años', 'Participo con entusiasmo en las actividades artísticas de mi Compañía.', 'Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('beb4b3e4-fe1c-4f06-af34-2c7f88202eb7', 2, 2, NULL, '13 a 15 años', 'Me gusta cantar y conozco muchas canciones.', 'Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('feb7f1d5-9e24-4c03-bad2-69408c845c7f', 2, 2, NULL, '11 a 13 años', 'Puedo identificar las principales partes de un problema.', 'Valora la ciencia y la técnica como medios para comprender y servir al hombre, la sociedad y el mundo.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('d531dd19-4d49-4342-8114-184de017ac49', 2, 2, NULL, '11 a 13 años', 'Conozco diferentes técnicas de comunicación y sé utilizar algunas de ellas.', 'Valora la ciencia y la técnica como medios para comprender y servir al hombre, la sociedad y el mundo.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('321a6234-3300-49cc-bbd3-f4120493ef83', 2, 2, NULL, '13 a 15 años', 'He participado en un proyecto que presenta una solución novedosa a un problema técnico habitual.', 'Valora la ciencia y la técnica como medios para comprender y servir al hombre, la sociedad y el mundo.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('075c93b1-81d2-4370-8e47-f0a4d086b20e', 3, 2, NULL, '11 a 13 años', 'Sé lo que significa ser leal.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('3a35ddd8-f6dc-4e00-a04d-107a0825bd99', 3, 2, NULL, '11 a 13 años', 'Escucho las críticas que me hacen los demás y reflexiono sobre ellas.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('2385386e-34db-4282-9934-7fcc515cb449', 3, 2, NULL, '11 a 13 años', 'Me propongo metas para ser mejor.', 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('04da7d20-1fd1-4012-b57e-5e5a3608e52b', 3, 2, NULL, '11 a 13 años', 'Hago cosas que me ayudan a cumplir mis metas.', 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('2845964c-1778-4ed7-8284-c5d830ea0a0d', 3, 2, NULL, '11 a 13 años', 'Trato de ser leal con lo que creo, conmigo misma y con las demás personas.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('a8667e56-d5f7-4f7b-b666-06c0b0d0d430', 3, 2, NULL, '11 a 13 años', 'Conozco y comprendo la Ley y la Promesa Guía.', 'Construye su proyecto de vida en base a los valores de la Ley y la Promesa Guía y Scout.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('aef9c842-05fa-4c53-a59c-8c334cb566a4', 3, 2, NULL, '11 a 13 años', 'Participo en actividades que muestran la importancia de actuar con lealtad.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('d98af0cf-c30c-42c5-ae17-f454ffa02553', 4, 2, NULL, '13 a 15 años', 'Estoy siempre dispuesta a ayudar a mis compañeras de patrulla.', 'Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('c1b60b80-c7cb-4ee7-adc8-4a87b14e6533', 4, 2, NULL, '11 a 13 años', 'Me informo adecuadamente sobre lo que significa ser hombre y ser mujer.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('d6d149a2-1b98-4d72-b305-601b7d50d368', 4, 2, NULL, '11 a 13 años', 'Comparto por igual con mis hermanas y hermanos las tareas que nos piden en la casa.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('c0614109-bebc-4286-a69a-aec4cac82a94', 4, 2, NULL, '13 a 15 años', 'Me preparo para vivir mi sexualidad unida al amor.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('8dd84c89-ac81-4ebd-9d92-0f01b9d12178', 4, 2, NULL, '13 a 15 años', 'Considero con igual dignidad a hombres y mujeres.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('28520ee0-a72d-4652-ae7f-048ee028c2a3', 4, 2, NULL, '11 a 13 años', 'Me gusta hacer cosas con mi familia y ayudo en lo que me piden para organizarlas.', 'Reconoce el matrimonio y la familia como base de la sociedad, convirtiendo la suya en una comunidad de amor conyugal, filial y fraterno.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('ceaa05c0-48ca-49dd-9885-393a8c4707de', 4, 2, NULL, '13 a 15 años', 'Converso con mis padres sobre lo que consideran bueno para mí y mis hermanos y hermanas.', 'Reconoce el matrimonio y la familia como base de la sociedad, convirtiendo la suya en una comunidad de amor conyugal, filial y fraterno.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('fce82191-77ea-444b-89d9-e33b62a323a5', 5, 2, NULL, '11 a 13 años', 'Procuro que respetemos a nuestras compañeras, cualquiera sea su manera de ser.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('670852e4-d07d-48f5-b39b-b0b336059600', 5, 2, NULL, '11 a 13 años', 'Converso con mi patrulla sobre los derechos humanos.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('007e85ea-2b06-48c2-8ac1-873d59643aae', 5, 2, NULL, '11 a 13 años', 'Conozco y respeto las principales normas de convivencia.', 'Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('6c23b04f-9399-4acf-a032-d3c64e665799', 5, 2, NULL, '11 a 13 años', 'Participo en las elecciones de mi patrulla y coopero con las que son elegidas.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 5, 2, NULL, '11 a 13 años', 'Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.', 'Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('006c5b09-47cf-4ed8-bf25-212203261a03', 3, 2, NULL, '13 a 15 años', 'Sé que soy capaz de hacer cosas y de hacerlas bien.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('672c638b-637e-4518-9dfb-ec92fb03c5cf', 3, 2, NULL, '13 a 15 años', 'Soy constante en mis propósitos.', 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('7a9e143e-c837-473b-a014-e41ef5fc2ec2', 3, 2, NULL, '13 a 15 años', 'Entiendo que es importante actuar de acuerdo a lo que pienso.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('2b89163c-b44c-4a1e-b71d-f5e9e2e87abd', 3, 2, NULL, '13 a 15 años', 'Comprendo que lo que me piden la Ley y la Promesa Guía es importante para mi vida.', 'Construye su proyecto de vida en base a los valores de la Ley y la Promesa Guía y Scout.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('c4fe900a-9641-4cad-a265-3f31073d83cb', 3, 2, NULL, '13 a 15 años', 'Me esfuerzo por hacer las cosas según lo que pienso.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('117bbf3f-7e3d-4c61-b305-821609bf2e5a', 3, 2, NULL, '11 a 13 años', 'Contribuyo al ambiente de alegría de mi Compañía.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('fb8a1e37-a978-433c-883b-965c7a6d9d3e', 3, 2, NULL, '11 a 13 años', 'Expreso mi alegría sin burlarme de los demás.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('25b24d3a-9d47-44af-b460-680508e644f3', 3, 2, NULL, '13 a 15 años', 'Soy alegre.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('592deebb-73b2-48c5-8611-4b53c4af6484', 3, 2, NULL, '13 a 15 años', 'Comparto mi alegría con mis amigas, amigos y familia.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('81cd6596-30cd-40fe-83e8-c86bf12a21f2', 3, 2, NULL, '11 a 13 años', 'Aprecio los consejos que me dan en mi patrulla.', 'Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('0da6c9df-7a09-44cd-9961-e06c0173d41a', 3, 2, NULL, '13 a 15 años', 'Ayudo a mis compañeras de patrulla a superarse.', 'Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('818d8a25-549b-4e01-a830-e50d73e39025', 4, 2, NULL, '11 a 13 años', 'Me doy cuenta y puedo hablar de las cosas que me atemorizan.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('b17b867f-9ff4-43f1-ae48-d8933e29298f', 4, 2, NULL, '11 a 13 años', 'Me doy cuenta por qué reacciono de la manera en que a veces lo hago.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('67a2f0fa-9b1e-4b7b-bda2-e25696c87898', 4, 2, NULL, '13 a 15 años', 'Trato de dominar mis reacciones, aún en situaciones difíciles o inesperadas.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('bb4bbc06-8313-45b2-b06e-c2a52a3d9322', 4, 2, NULL, '13 a 15 años', 'Comparto mis sentimientos y emociones con mi patrulla.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('2f8359db-221e-4a64-b2df-2b3e7b74a2db', 4, 2, NULL, '11 a 13 años', 'Escucho las opiniones de las demás personas y si no estoy de acuerdo lo digo con respeto.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('c41ebefe-da04-4671-a854-40d544b6366e', 4, 2, NULL, '11 a 13 años', 'Soy leal con mis amigas y amigos sin dejar de lado o tratar mal a quienes no lo son.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('3621f4ae-1316-4b3e-8682-3e3c9ad381a7', 4, 2, NULL, '13 a 15 años', 'Mantengo mi opinión cuando estoy convencida que es correcta.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('9ad078db-d6b6-4302-9663-cafd868b6876', 4, 2, NULL, '11 a 13 años', 'Me gusta querer y que me quieran.', 'Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('1999e4c0-935b-4134-95be-92f01a5edf81', 4, 2, NULL, '11 a 13 años', 'Me intereso por las demás personas y soy generosa.', 'Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('944660c8-0093-4181-ba2c-5f95cc74ba47', 5, 2, NULL, '13 a 15 años', 'No me gusta cuando no se respetan los derechos humanos y lo digo.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('de2f5693-de4b-48f1-b870-3c62be99aea8', 5, 2, NULL, '13 a 15 años', 'Respeto las normas de convivencia de los distintos ambientes en que actúo, aunque no siempre esté de acuerdo con ellas.', 'Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('5b72f437-583d-4e96-b3df-69a8e24e6482', 5, 2, NULL, '13 a 15 años', 'Sé cómo se toman las decisiones en mi país y quiénes intervienen en ellas.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('e2770a37-9927-47ed-a4d6-bae9feaf691c', 5, 2, NULL, '13 a 15 años', 'Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.', 'Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('edd3b4b5-1096-44fe-8b8b-7364449cd520', 5, 2, NULL, '11 a 13 años', 'Trato de realizar una buena acción todos los días.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('518e0a94-ba79-45e4-a31f-bc7e3636d2d3', 5, 2, NULL, '11 a 13 años', 'Conozco las distintas realidades sociales del lugar en que vivo.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('e169f226-166a-4dcc-bbf3-46cbdebd6dfb', 5, 2, NULL, '13 a 15 años', 'Mantengo una agenda de direcciones útiles.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('b3d92c8b-c7c8-42bc-bc03-4e925e019a87', 5, 2, NULL, '13 a 15 años', 'Propongo actividades de servicio de mi patrulla y Compañía y colaboro en su organización.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('5676c7f9-7ae5-4c1c-aece-adb2aa0f35cd', 5, 2, NULL, '13 a 15 años', 'Conozco las diferentes posiciones políticas que hay en mi país.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('b0f283cd-6264-45ed-8581-a374c4d304d9', 5, 2, NULL, '11 a 13 años', 'Conozco los principales productos propios de la cultura de mi país.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('09467abf-7e86-4946-8039-52e03147e1fe', 5, 2, NULL, '11 a 13 años', 'Participo en las actividades de mi patrulla que muestran la cultura de mi país.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('ef616bd7-c049-44c1-80f0-bedf6419458e', 5, 2, NULL, '13 a 15 años', 'Conozco la geografía de mi país y su influencia en nuestra cultura.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('8b70124d-391d-4667-a0d1-78924cb04afd', 5, 2, NULL, '13 a 15 años', 'Propongo en mi patrulla y Compañía actividades que muestren los valores propios de la cultura de nuestro país.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('db923b30-d3f1-4840-8b46-c7e5994c99ce', 5, 2, NULL, '11 a 13 años', 'Participo en actividades organizadas por mi Asociación.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('8f3363bc-c9a1-4cc9-818b-7d7936bcbcf3', 5, 2, NULL, '11 a 13 años', 'Participo en actividades y talleres en que aprendo la importancia de la comprensión internacional y la paz.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('55483921-f740-4e87-ad94-590acf7a3b55', 5, 2, NULL, '13 a 15 años', 'Participo en los contactos que mantiene mi Grupo con guías y scouts de otros países.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('3f8479d3-c971-42ea-babc-989eae8b74db', 5, 2, NULL, '13 a 15 años', 'Me gusta saber cómo viven las personas en otros países.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('9ed1f4d8-b2c7-405c-9f1b-9d1850f21f7a', 5, 2, NULL, '11 a 13 años', 'Ayudo en la limpieza y el mejoramiento de los lugares en que paseo y acampo.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('04b948d1-dee0-44ba-9122-966844fd61bf', 5, 2, NULL, '11 a 13 años', 'He participado con mi patrulla en la mantención de un huerto productivo u otro proyecto similar.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('46017e67-80b2-4334-a154-3c2d0dfda7e3', 5, 2, NULL, '13 a 15 años', 'He participado con mi patrulla en proyectos de conservación.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('bb45965a-61c8-4d96-a9d8-397d4dde55b6', 6, 2, NULL, '11 a 13 años', 'Reflexiono con mi patrulla cuando hacemos excursiones o campamentos.', 'Busca siempre a Dios en forma personal y comunitaria, aprendiendo a reconocerlo en las personas y en la Creación.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('e46c29f7-a6ac-48b8-ae8d-23255973d16b', 6, 2, NULL, '13 a 15 años', 'Preparo y conduzco algunas de las actividades que nos ayudan a descubrir a Dios en la naturaleza.', 'Busca siempre a Dios en forma personal y comunitaria, aprendiendo a reconocerlo en las personas y en la Creación.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('a2947284-3caa-481d-86db-0882b2e70fd2', 6, 2, NULL, '11 a 13 años', 'Conozco los fundamentos de mi fe.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('0805846e-930c-4f30-8c0c-9d3a1b7021ea', 6, 2, NULL, '11 a 13 años', 'Asumo tareas en las celebraciones religiosas que hacemos en mi Compañía.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('d1600a6e-7b9d-4fda-ae4c-25831a76fb77', 6, 2, NULL, '13 a 15 años', 'Participo en las celebraciones y actividades de mi religión.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('624432ab-cdc2-4ce4-8a92-e94df38991d4', 6, 2, NULL, '11 a 13 años', 'Me gusta rezar y trato de hacerlo todos los días.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('11161574-bf77-4360-8e2b-c1ee8376cf35', 6, 2, NULL, '11 a 13 años', 'Siempre encuentro en lo que hago razones para pedir y dar gracias a Dios.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('bd61b7a2-ae66-48d9-abdd-f734048337f9', 6, 2, NULL, '13 a 15 años', 'Entiendo la oración como una manera de conversar con Dios.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('19e6a3d4-da90-474a-b665-77993a334b6e', 6, 2, NULL, '11 a 13 años', 'Entiendo por qué mi fe me pide que ayude a los demás.', 'Integra sus principios religiosos a su conducta cotidiana, estableciendo coherencia entre su fe, su vida personal y su participación social.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('8e0a1acf-2e7e-47b7-bc07-1d643c36c88b', 6, 2, NULL, '13 a 15 años', 'Organizo y comparto momentos de oración con mi patrulla y mi familia.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('1e51fc1f-0449-469c-8404-f0f8b998419e', 6, 2, NULL, '13 a 15 años', 'Invito a mi patrulla a cooperar con las acciones que mi comunidad religiosa hace por los demás.', 'Integra sus principios religiosos a su conducta cotidiana, estableciendo coherencia entre su fe, su vida personal y su participación social.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('e1488f10-f38f-48f9-b9c8-50f32085e417', 6, 2, NULL, '13 a 15 años', 'Me interesa conocer otras religiones.', 'Dialoga con todas las personas cualquiera sea su opción religiosa, buscando establecer vínculos de comunión entre los hombres.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('8cae916f-5e67-4697-b3cd-c59b5c7d1439', 1, 3, NULL, '11 a 13 años', 'Trato de evitar situaciones que puedan dañar mi salud y la de mis compañeros.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('68add558-4b03-4105-b00d-e7f2ead6ac23', 1, 3, NULL, '13 a 15 años', 'Sé qué hacer frente a una enfermedad o accidente.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('36321046-051e-4c14-bb1e-7045faf4f5b4', 1, 3, NULL, '11 a 13 años', 'Trato de no ser agresivo en juegos y actividades.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('ed541fb6-fe51-4269-aa4e-aaca7c8cc3eb', 1, 3, NULL, '13 a 15 años', 'Converso con mis compañeros para resolver los problemas que se producen entre nosotros.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('46d36119-8d9f-44f3-ae11-b9851a71eff1', 1, 3, NULL, '11 a 13 años', 'Me preocupo por mi aspecto personal y porque mi cuerpo esté limpio.', 'Valora su aspecto y cuida su higiene personal y la de su entorno.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('96bdbf37-8f31-4b08-8583-513072761cc2', 1, 3, NULL, '13 a 15 años', 'Me preocupo por mi aspecto personal y siempre trato de estar limpio y ordenado.', 'Valora su aspecto y cuida su higiene personal y la de su entorno.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('25418fdb-79e0-412a-96c6-915ebf6f8566', 1, 3, NULL, '13 a 15 años', 'Mantengo limpio y ordenado mi dormitorio y mis cosas.', 'Valora su aspecto y cuida su higiene personal y la de su entorno.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('4f90e6f6-a236-4822-94f8-81cd65f3052c', 1, 3, NULL, '11 a 13 años', 'Como los alimentos que me ayudan a crecer y lo hago a las horas adecuadas.', 'Mantiene una alimentación sencilla y adecuada.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('faf46431-6c47-4187-b194-1a72daacf751', 1, 3, NULL, '11 a 13 años', 'Sé por qué es importante la limpieza al preparar y comer los alimentos.', 'Mantiene una alimentación sencilla y adecuada.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('e1940dcc-883f-40fe-bf22-3845055f8473', 1, 3, NULL, '13 a 15 años', 'Sé qué alimentos me ayudan a crecer y cuáles no.', 'Mantiene una alimentación sencilla y adecuada.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('1614526e-f154-47a0-b9c1-58ff3f9637db', 1, 3, NULL, '11 a 13 años', 'Le dedico al estudio el tiempo necesario.', 'Administra su tiempo equilibradamente entre sus diversas obligaciones, practicando formas apropiadas de descanso.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('d55b454f-5d8d-4cea-9a26-208b250c10d9', 1, 3, NULL, '13 a 15 años', 'Sé elegir entre las diferentes actividades recreativas.', 'Administra su tiempo equilibradamente entre sus diversas obligaciones, practicando formas apropiadas de descanso.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('58b4936a-816e-4d17-8d0a-c92d0606009d', 1, 3, NULL, '11 a 13 años', 'Participo en los juegos, excursiones y campamentos que organiza mi patrulla.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('6dc8574b-1c8c-421f-8298-12c97e0feda7', 1, 3, NULL, '11 a 13 años', 'Practico regularmente un deporte.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('6768d60a-187e-4bbf-97b9-cdc25a316030', 1, 3, NULL, '13 a 15 años', 'Ayudo a preparar los juegos, excursiones y campamentos de mi patrulla y mi Tropa.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('7c91a6b0-5a22-464b-b965-dd216859db69', 1, 3, NULL, '13 a 15 años', 'Preparo juegos para distintas ocasiones.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('a93b3a5c-a023-4e0c-815d-c77c6700dd89', 2, 3, NULL, '11 a 13 años', 'Me intereso por conocer más sobre lo que pasa a mi alrededor.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('289e03b9-f6dd-4fde-b121-82470456247e', 2, 3, NULL, '11 a 13 años', 'Busco mis propias lecturas y puedo relacionarlas con las cosas que me pasan.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('8bbd7392-24e1-453f-bd7a-8265d57877c9', 2, 3, NULL, '13 a 15 años', 'Saco mis propias conclusiones de los hechos que pasan a mi alrededor.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('49ae6ac6-be8f-4f2c-8b3e-6711d041181f', 2, 3, NULL, '11 a 13 años', 'Doy mi opinión sobre las cosas que me pasan.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('4bf35d9c-ed0c-46fa-9bfd-0f5e9adff9a3', 2, 3, NULL, '11 a 13 años', 'Participo en la organización de las excursiones de mi patrulla.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('cf530cf9-73a6-4423-a075-79be433fe96c', 2, 3, NULL, '13 a 15 años', 'Propongo temas para discutir en mi patrulla.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('11320fb6-98de-4725-825d-db858e3bffa2', 2, 3, NULL, '11 a 13 años', 'Perfecciono mis habilidades manuales.', 'Une los conocimientos teórico y práctico mediante la aplicación constante de sus habilidades técnicas y manuales.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('fd3d3e14-e92b-4ab5-8298-9018c6e70b20', 2, 3, NULL, '13 a 15 años', 'Coopero en la mantención y renovación del local y materiales de mi patrulla.', 'Une los conocimientos teórico y práctico mediante la aplicación constante de sus habilidades técnicas y manuales.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('7a4bc14c-077d-48b1-b329-b0d70e081fe4', 2, 3, NULL, '11 a 13 años', 'Uso las especialidades que he adquirido para resolver problemas cotidianos.', 'Elige su vocación considerando conjuntamente sus aptitudes, posibilidades e intereses; y valora sin prejuicios las opciones de los demás.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('981fa19b-7f60-4e0e-b2fa-16123df5e37e', 2, 3, NULL, '11 a 13 años', 'Expreso mis pensamientos y experiencias en el Tally.', 'Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('0b23d4c8-6e40-4e8e-a476-97ed92efa152', 2, 3, NULL, '11 a 13 años', 'Conozco diferentes técnicas de comunicación y sé utilizar algunos de ellos.', 'Valora la ciencia y la técnica como medios para comprender y servir al hombre, la sociedad y el mundo.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('80ff5a70-cc39-4599-99b1-38aa13b44f49', 4, 2, NULL, '13 a 15 años', 'Aprecio a las personas por lo que son.', 'Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('e159e73b-f5c4-40d2-9506-34330988b66b', 4, 3, NULL, '11 a 13 años', 'Comparto por igual con mis hermanas y hermanos las tareas que nos piden en la casa.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('78d2d117-05c8-43a4-91c8-7ddb090f1c48', 4, 3, NULL, '11 a 13 años', 'Me gusta hacer cosas con mi familia y ayudo en lo que me piden para organizarlas.', 'Reconoce el matrimonio y la familia como base de la sociedad, convirtiendo la suya en una comunidad de amor conyugal, filial y fraterno.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('afa62c83-7a6b-4bbb-b60f-59a6d414e241', 4, 3, NULL, '13 a 15 años', 'Soy cariñoso con mi familia y acepto las decisiones que se toman en mi casa.', 'Reconoce el matrimonio y la familia como base de la sociedad, convirtiendo la suya en una comunidad de amor conyugal, filial y fraterno.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('13f36ce9-0b0a-40fb-b74b-0dc4a09fb542', 2, 3, NULL, '13 a 15 años', 'Aplico mis especialidades en las actividades de servicio.', 'Elige su vocación considerando conjuntamente sus aptitudes, posibilidades e intereses; y valora sin prejuicios las opciones de los demás.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('f9cea3e0-24f4-43ab-9efb-1a4541a29943', 2, 3, NULL, '13 a 15 años', 'Ayudo a preparar materiales para las representaciones artísticas.', 'Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('91ed07ce-f3b6-4396-b3fe-d8340a06118e', 2, 3, NULL, '13 a 15 años', 'He participado en un proyecto que presenta una solución novedosa a un problema técnico habitual.', 'Valora la ciencia y la técnica como medios para comprender y servir al hombre, la sociedad y el mundo.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('62876ebe-214f-4caf-b164-664e12fd30ae', 3, 3, NULL, '11 a 13 años', 'Me gusta participar en actividades que me ayudan a conocerme.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('b7636377-26c8-4626-89ca-94dc250d4d17', 3, 3, NULL, '11 a 13 años', 'Sé que puedo ser cada día mejor.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('c380e11a-571d-4617-924c-aa933ae30138', 3, 3, NULL, '13 a 15 años', 'Soy capaz de criticarme.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('41386aca-6175-4483-9e3b-54ac85ca5eb9', 3, 3, NULL, '11 a 13 años', 'Me propongo metas para ser mejor.', 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('bca03af0-a499-49c9-9824-cda992e0224c', 3, 3, NULL, '11 a 13 años', 'Me ofrezco para ayudar en mi patrulla y en mi casa.', 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('71413ac6-8ae9-4034-b580-e2f1c2f9f42c', 3, 3, NULL, '13 a 15 años', 'Me esfuerzo cada vez más en superar mis defectos.', 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('88841d17-0f73-4d1d-9973-40632eac1888', 3, 3, NULL, '13 a 15 años', 'Cumplo las responsabilidades que asumo.', 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('38f4863e-12a6-4a4b-9767-8cdf55020734', 3, 3, NULL, '11 a 13 años', 'Sé lo que significa ser leal.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('f77525b1-07a3-4188-9051-4d3ba86aadfc', 3, 3, NULL, '11 a 13 años', 'Trato de ser leal con lo que creo, conmigo mismo y con los demás personas.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('9bff5b7a-0d53-456f-9b26-e819f0f26771', 3, 3, NULL, '11 a 13 años', 'He prometido esforzarme por vivir la Ley y la Promesa Scout.', 'Construye su proyecto de vida en base a los valores de la Ley y la Promesa Guía y Scout.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('646d5c04-82c3-4280-b3a9-54384e21f4ac', 3, 3, NULL, '11 a 13 años', 'Participo en actividades que muestran la importancia de actuar con lealtad.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('5311be36-87be-40c4-ab4a-e6ce6e662183', 3, 3, NULL, '13 a 15 años', 'Entiendo que es importante actuar de acuerdo a lo que pienso.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('0eaaf466-0634-48b9-aca9-cf49813b8596', 3, 3, NULL, '13 a 15 años', 'Me esfuerzo por hacer las cosas según lo que pienso.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('4d66ed86-48ec-4801-bd0a-e5c8d023c8cd', 3, 3, NULL, '11 a 13 años', 'Enfrento y resuelvo mis dificultades con alegría.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('73b20cb5-9d12-46ba-96b1-53613aa8c58c', 3, 3, NULL, '11 a 13 años', 'Contribuyo al ambiente de alegría de mi Tropa.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('b0042e1b-f294-4e30-88e6-418a996add56', 3, 3, NULL, '11 a 13 años', 'Expreso mi alegría sin burlarme de los demás.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('9a38e454-f93a-40a5-9f68-e500ba7e0655', 3, 3, NULL, '13 a 15 años', 'Comparto mi alegría con mis amigos, amigos y familia.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('0969a204-e8c6-4ab6-ac4f-c777bae066df', 3, 3, NULL, '11 a 13 años', 'Aprecio los consejos que me dan en mi patrulla.', 'Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('f608eb2d-613a-477a-86f9-03e769a87bf2', 3, 3, NULL, '13 a 15 años', 'Ayudo a mis compañeros de patrulla a superarse.', 'Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('03ccaf4c-03c4-42a8-b311-47fef60f204c', 4, 3, NULL, '11 a 13 años', 'Me doy cuenta y puedo hablar de las cosas que me atemorizan.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('f172d443-a723-48ea-8701-b218eae20162', 4, 3, NULL, '11 a 13 años', 'Me doy cuenta por qué reacciono de la manera en que a veces lo hago.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('74e6c7e0-f9f6-47d3-acdb-d6df315ef123', 4, 3, NULL, '13 a 15 años', 'Trato de dominar mis reacciones, aún en situaciones difíciles o inesperadas.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('4deb9334-aee6-48e4-b480-c562929584ad', 4, 3, NULL, '13 a 15 años', 'Comparto mis sentimientos y emociones con mi patrulla.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('a4060c60-7ce9-425b-bf2a-76941a689937', 4, 3, NULL, '11 a 13 años', 'Escucho las opiniones de los demás personas y si no estoy de acuerdo lo digo con respeto.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('20b1ffa1-6c06-49b4-91fd-fe92628f7a19', 4, 3, NULL, '11 a 13 años', 'Soy capaz de decir que no cuando creo que algo es incorrecto.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('4ade9c82-6b0d-4a44-8bc6-2eb47a011ffb', 4, 3, NULL, '13 a 15 años', 'Digo lo que pienso con respeto hacia los demás personas.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('e4184d1a-67af-43c4-a7d6-9ece26430f05', 4, 3, NULL, '11 a 13 años', 'Me gusta querer y que me quieran.', 'Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('54591111-688b-43e0-86fd-860a75f3ca3d', 4, 3, NULL, '13 a 15 años', 'Entiendo la importancia del amor en mi vida.', 'Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('037be973-3e1a-450c-a9f4-65d053aec372', 4, 3, NULL, '13 a 15 años', 'Aprecio a las personas por lo que son.', 'Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('3ddc1a76-99d4-460b-82fa-9a9934de32a7', 4, 3, NULL, '13 a 15 años', 'Me preparo para vivir mi sexualidad unida al amor.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('674e26df-2c2d-4df7-8e90-69bb7593e76c', 4, 3, NULL, '13 a 15 años', 'Considero con igual dignidad a hombres y mujeres.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('5c103fdc-0d8d-4624-8df4-94d2f6cca951', 4, 3, NULL, '13 a 15 años', 'Converso con mis padres sobre lo que consideran bueno para mí y mis hermanos y hermanas.', 'Reconoce el matrimonio y la familia como base de la sociedad, convirtiendo la suya en una comunidad de amor conyugal, filial y fraterno.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('a3d7abdf-ca3b-42b8-92b5-403958fb537c', 5, 3, NULL, '11 a 13 años', 'Procuro que respetemos a nuestras compañeros, cualquiera sea su manera de ser.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('9c8c7e3e-0d7c-45e7-9154-2dc5ed6a85e3', 5, 3, NULL, '11 a 13 años', 'Converso con mi patrulla sobre los derechos humanos.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('0d3af46a-d64c-4e59-a765-1f72dc41ba76', 5, 3, NULL, '13 a 15 años', 'Ayudo a mi patrulla en los compromisos que tomamos.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('72eeece4-524d-4ff2-94f0-c7bcad92c9ce', 5, 3, NULL, '13 a 15 años', 'Participo en actividades relacionadas con los derechos de las personas.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('857f21bc-db3c-4e5e-bcd5-d3d331276fad', 5, 3, NULL, '11 a 13 años', 'Conozco y respeto las principales normas de convivencia.', 'Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('a6986b0d-dba2-4946-bf09-f7f11ca04334', 5, 3, NULL, '11 a 13 años', 'Participo en las elecciones de mi patrulla y coopero con las que son elegidos.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('aaf3fb6f-8423-4bd7-89c8-e97cca87421b', 5, 3, NULL, '13 a 15 años', 'Sé cómo se toman las decisiones en mi país y quiénes intervienen en ellas.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('06ed2700-c963-4f13-a86a-2815b3a1530a', 5, 3, NULL, '11 a 13 años', 'Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.', 'Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('bbc48d53-f4aa-4de7-84d4-95614df76034', 5, 3, NULL, '13 a 15 años', 'Respeto las normas de convivencia de los distintos ambientes en que actúo, aunque no siempre esté de acuerdo con ellas.', 'Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('fc26cfce-9532-4f60-b1e4-2aef8774109c', 5, 3, NULL, '11 a 13 años', 'Sé qué hacen los bomberos, la policía, los hospitales, el municipio y otros servicios públicos de mi comunidad.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('16388e31-ed8c-443f-9881-4dea357f2edd', 5, 3, NULL, '11 a 13 años', 'Trato de realizar una buena acción todos los días.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('9cbecce7-5147-4405-8725-18b15baa8ecd', 5, 3, NULL, '11 a 13 años', 'Conozco las distintas realidades sociales del lugar en que vivo.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('8a38e69e-7013-4ec8-8112-181f68e4224a', 5, 3, NULL, '13 a 15 años', 'Realizo una buena acción cada día.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('5615c6b9-5355-4a4e-a0f9-d6dad0ab0770', 5, 3, NULL, '13 a 15 años', 'Me gusta participar en actividades que ayudan a superar las diferencias sociales.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('2dc9c7fe-979a-47c8-8008-fd2d11016a18', 5, 3, NULL, '11 a 13 años', 'Conozco los principales productos propios de la cultura de mi país.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('15e0977f-8b22-4074-a6c4-7dc302a0a049', 5, 2, NULL, '11 a 13 años', 'Me gusta sentirme parte de la cultura de mi país.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('523939cc-bdbd-433b-bba6-681ba10c4296', 5, 3, NULL, '11 a 13 años', 'Participo en las actividades de mi patrulla que muestran la cultura de mi país.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('02eb45f3-b00d-41e5-8412-c7a4d962e40d', 5, 3, NULL, '13 a 15 años', 'Aprecio la cultura de mi país y me identifico con ella.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('e6f4fb0e-bd0b-4689-a258-524eb5be560a', 5, 3, NULL, '13 a 15 años', 'Propongo en mi patrulla y Tropa actividades que muestren los valores propios de la cultura de nuestro país.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('616f6f67-9b73-411d-91f6-276b25b67db9', 5, 3, NULL, '11 a 13 años', 'Participo en actividades organizadas por mi Asociación.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('b93753b8-f0c9-4c79-808b-34f059c1f020', 5, 3, NULL, '11 a 13 años', 'Participo en actividades y talleres en que aprendo la importancia de la comprensión internacional y la paz.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('cc54a608-36e7-4053-8eb5-a10e66d4f198', 5, 3, NULL, '13 a 15 años', 'Participo en los contactos que mantiene mi Grupo con guías y scouts de otros países.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('8a999f90-77c6-49a4-bdd3-1567bb8fe50d', 5, 3, NULL, '13 a 15 años', 'Me gusta saber cómo viven las personas en otros países.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('6a42179d-752c-4624-a9db-df85e0116d1b', 5, 3, NULL, '11 a 13 años', 'Ayudo en la limpieza y el mejoramiento de los lugares en que paseo y acampo.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('595ef0ea-e126-4e93-8b3e-79bee8d8e1a9', 5, 3, NULL, '13 a 15 años', 'Sé cuáles son los principales problemas ambientales de mi país.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('385a0c5c-c0c0-46f9-8294-95c7af828da5', 5, 3, NULL, '13 a 15 años', 'He participado con mi patrulla en proyectos de conservación.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('58925561-3ea5-4144-a704-52e21dd78a3f', 6, 3, NULL, '11 a 13 años', 'Escucho a los demás y aprendo de ellos.', 'Busca siempre a Dios en forma personal y comunitaria, aprendiendo a reconocerlo en las personas y en la Creación.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('164d437f-1bd0-40d1-bbe4-cfaa20bf4833', 6, 3, NULL, '11 a 13 años', 'Conozco los fundamentos de mi fe.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('1311db4d-dddf-4870-9cb3-7403223abb6d', 6, 3, NULL, '13 a 15 años', 'Procuro que en mi patrulla nos escuchemos y aprendamos unos de otros.', 'Busca siempre a Dios en forma personal y comunitaria, aprendiendo a reconocerlo en las personas y en la Creación.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('d82038fb-d5d3-4f3a-92ec-f3a85e311709', 6, 3, NULL, '11 a 13 años', 'Asumo tareas en las celebraciones religiosas que hacemos en mi Tropa.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('7df5b1af-2e16-4aab-9349-c8f609ca05c1', 6, 3, NULL, '13 a 15 años', 'Participo en las celebraciones y actividades de mi religión.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('3e7ead4f-2d2a-4930-950d-a181fa4b18d9', 6, 3, NULL, '11 a 13 años', 'Me gusta rezar y trato de hacerlo todos los días.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('1b0ba742-c359-4bfd-be94-00d4ca032787', 6, 3, NULL, '11 a 13 años', 'Rezo habitualmente con mi patrulla.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('4498e68e-ce3c-4b60-a9c4-2b92ebe54e4a', 6, 3, NULL, '13 a 15 años', 'Rezo para conversar con Dios y alabarlo, darle gracias, ofrecerle lo que hago y pedirle por las cosas que me pasan.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('640d3b5e-c2c7-4f9e-ad5c-a0995acbd5b7', 6, 3, NULL, '11 a 13 años', 'Trato de vivir las enseñanzas de mi fe en todo lo que hago.', 'Integra sus principios religiosos a su conducta cotidiana, estableciendo coherencia entre su fe, su vida personal y su participación social.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('dac2fcea-547e-4015-9081-76bed2aac4fa', 6, 3, NULL, '13 a 15 años', 'Me siento feliz cuando los demás ven en mí a una persona que vive de acuerdo a su fe.', 'Integra sus principios religiosos a su conducta cotidiana, estableciendo coherencia entre su fe, su vida personal y su participación social.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('cd0494e1-4d1f-4884-9522-2d8fb0af9b58', 6, 3, NULL, '11 a 13 años', 'Comparto con todas las personas, sean o no de mi religión.', 'Dialoga con todas las personas cualquiera sea su opción religiosa, buscando establecer vínculos de comunión entre los hombres.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('86f9442a-7e48-4faa-949c-78ba01c68b27', 6, 3, NULL, '13 a 15 años', 'Trato que en mi patrulla se respeten las opciones religiosas de las personas.', 'Dialoga con todas las personas cualquiera sea su opción religiosa, buscando establecer vínculos de comunión entre los hombres.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('4286ab90-9388-4a76-93f4-59ce145f6ef2', 6, 3, NULL, '13 a 15 años', 'Actúo con respeto frente a las ideas, celebraciones y actividades de otros religiones.', 'Dialoga con todas las personas cualquiera sea su opción religiosa, buscando establecer vínculos de comunión entre los hombres.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('05f42879-f5f5-40c4-bed6-c577bf61340a', 1, 4, NULL, '15 a 17 años', 'Cuido mi salud y mantengo hábitos que la protegen.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('e876d520-d14d-44f3-8baf-bf698dc08dac', 1, 4, NULL, '15 a 17 años', 'Acepto mi imagen corporal.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('4be40502-6fe1-4e5e-a838-bf04efc80c00', 1, 4, NULL, '15 a 17 años', 'Trato de mantener un aspecto personal ordenado y limpio.', 'Valora su aspecto y cuida su higiene personal y la de su entorno.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('5c70275e-5186-41b2-a952-56d3647448fb', 1, 4, NULL, '15 a 17 años', 'Como alimentos que me ayudan a crecer y a mantenerme saludable.', 'Mantiene una alimentación sencilla y adecuada.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('334e948b-05c8-4503-a7d0-e81d26486b68', 1, 4, NULL, '15 a 17 años', 'Respeto a los horarios de las diferentes comidas del día.', 'Mantiene una alimentación sencilla y adecuada.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('7b405bef-1616-439d-b68b-c89b6c2b1922', 1, 4, NULL, '15 a 17 años', 'Preparo menús variados y adecuados a las diferentes de mi Comunidad y Avanzada.', 'Mantiene una alimentación sencilla y adecuada.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('ccdd3cf8-fa9d-49ca-a3b5-3465ff4f9a19', 1, 4, NULL, '15 a 17 años', 'Uso parte de mi tiempo libre en diferentes actividades recreativas.', 'Administra su tiempo equilibradamente entre sus diversas obligaciones, practicando formas apropiadas de descanso.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('7200435f-b020-46fc-b323-8249048b1d18', 1, 4, NULL, '15 a 17 años', 'Participo en la organización de juegos y actividades recreativas para los demás.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('f4c586e3-6a99-41f5-8fcb-a15886e93337', 1, 4, NULL, '15 a 17 años', 'Practico regularmente un deporte.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('fefc6ed0-97f8-4a71-99d9-f56729ba0a92', 2, 4, NULL, '15 a 17 años', 'Me informo de lo que pasa a mi alrededor y soy capaz de valorar críticamente lo que veo, leo y escucho.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('3cdf4b56-b55f-4878-b3fa-da32a7200ca4', 2, 4, NULL, '15 a 17 años', 'Soy capaz de sintetizar, criticar, proponer y apreciar las opiniones de los demás.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('310eb631-8ca9-4eaf-ac80-232a5150d024', 2, 4, NULL, '15 a 17 años', 'Creo actividades y juegos para realizar con mi comunidad y soy capaz de motivarlos.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('843fda9c-6c4a-4516-b30c-23c92ef755a8', 2, 4, NULL, '15 a 17 años', 'Puedo resolver la mayoría de los problemas técnicos domésticos simples.', 'Une los conocimientos teórico y práctico mediante la aplicación constante de sus habilidades técnicas y manuales.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('00b2b445-7bbf-43be-be8a-ac1054c2abd5', 2, 4, NULL, '15 a 17 años', 'Desarrollo algunas competencias relacionadas con mis intereses.', 'Elige su vocación considerando conjuntamente sus aptitudes, posibilidades e intereses; y valora sin prejuicios las opciones de los demás.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('d252cb51-c224-4528-90b3-e0288aa343dd', 2, 4, NULL, '15 a 17 años', 'Comparto con los demás mis inquietudes, aspiraciones y creaciones artísticas.', 'Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('d316b3fd-7975-4bfe-9249-35268d91f12b', 2, 4, NULL, '15 a 17 años', 'Soy capaz de relacionar mis valores con los procedimientos científicos y técnicos.', 'Valora la ciencia y la técnica como medios para comprender y servir al hombre, la sociedad y el mundo.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('dea08f50-52d5-4d87-ad7f-b7dbbb2702fc', 3, 4, NULL, '15 a 17 años', 'Me acepto tal como soy, sin dejar de mirarme críticamente.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('fb090834-c3f7-48f8-aab1-4a6a8c7b0ab9', 3, 4, NULL, '15 a 17 años', 'Me propongo metas que me ayuden a crecer como persona.', 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('60b6f382-00ec-4569-8ee9-da68638f5b58', 3, 4, NULL, '15 a 17 años', 'Participo en proyectos que me ayudan a cumplir las metas que me he propuesto.', 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('51210a26-62f2-4e33-8ca4-09b4b364a143', 3, 4, NULL, '15 a 17 años', 'Comprendo el significado de la Ley y la Promesa en esta etapa de mi vida.', 'Construye su proyecto de vida en base a los valores de la Ley y la Promesa Guía y Scout.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('a8d2d3fc-63a7-41ed-9029-9d65b6badba1', 3, 4, NULL, '15 a 17 años', 'Opto por valores personales para mi vida.', 'Construye su proyecto de vida en base a los valores de la Ley y la Promesa Guía y Scout.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('1d9d6751-4ab1-45db-9999-3f18606b4909', 3, 4, NULL, '15 a 17 años', 'Soy fiel a la palabra dada.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('d94bd61b-b8bf-4e80-a790-b5e83532a7b6', 3, 4, NULL, '15 a 17 años', 'Contribuyo para que en mi Comunidad y en la Avanzada seamos consecuentes.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('4b2e406f-2d78-4039-9ce2-4ccb743eb553', 3, 4, NULL, '15 a 17 años', 'Soy capaz de reírme de mis propios absurdos.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('dead8658-5e9c-4d29-9ffc-f12a2c3d9564', 3, 4, NULL, '15 a 17 años', 'Tengo buen humor y trato de expresarlo sin agresividad ni vulgaridad.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('04ded0fb-289b-4d90-9f5f-821ec20a56c7', 3, 4, NULL, '15 a 17 años', 'Aporto mi experiencia personal en las reuniones de mi Comunidad.', 'Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('31b61322-1fcc-4d94-a600-80280116f92b', 3, 4, NULL, '15 a 17 años', 'Me comprometo en los proyectos que asume mi Comunidad, mi Avanzada o mi Grupo.', 'Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('81298790-d245-48c6-8b1b-266b218c69da', 4, 4, NULL, '15 a 17 años', 'Me esfuerzo por encontrar mi identidad personal.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('755d107c-33ab-4e9a-b6f4-a1fdaf538bd5', 4, 4, NULL, '15 a 17 años', 'Comparto mis sentimientos con mi comunidad.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('6c2b5054-70e8-4529-957f-a8abea073918', 4, 4, NULL, '15 a 17 años', 'Expreso mis opiniones libremente, sin descalificar a los demás.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('3b32ea2c-da58-487c-bea4-e02f301f5e3e', 4, 4, NULL, '15 a 17 años', 'Trato con afecto a los demás.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('8ae35dd0-ef83-45ac-a5af-3305a7d7b32d', 4, 4, NULL, '15 a 17 años', 'Actuar con amor hacia los demás me permite realizarme como persona y ser feliz.', 'Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('edfc3452-910a-4b7b-bcc5-73628cf20c0a', 4, 4, NULL, '15 a 17 años', 'Comparto y defiendo el derecho de los demás a ser valorados por lo que son y no por lo que tienen.', 'Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('dd5ca901-0bec-4144-9555-0961e91bd494', 4, 4, NULL, '15 a 17 años', 'Opino y actúo de acuerdo a mis valores en temas relacionados con la sexualidad.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('7997aaa9-cfd9-4450-8703-ba8f7e227dae', 4, 4, NULL, '15 a 17 años', 'Trato con respeto e igualdad a las personas.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('0d15923e-f877-486d-9a1b-9c3e487f035c', 4, 4, NULL, '15 a 17 años', 'Logro una relación de comprensión y afecto con mis padres y mantengo permanente comunicación con ellos.', 'Reconoce el matrimonio y la familia como base de la sociedad, convirtiendo la suya en una comunidad de amor conyugal, filial y fraterno.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('8de78b0e-6abc-417a-a70a-77fbe8642778', 4, 4, NULL, '15 a 17 años', 'Converso y comparto con mis hermanos y hermanas y aprendo de nuestra relación.', 'Reconoce el matrimonio y la familia como base de la sociedad, convirtiendo la suya en una comunidad de amor conyugal, filial y fraterno.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('a4565b31-ab5e-4ac0-90fc-604a6573bd45', 4, 4, NULL, '15 a 17 años', 'Asumo mi relación de pareja como parte de mi proyecto de vida.', 'Reconoce el matrimonio y la familia como base de la sociedad, convirtiendo la suya en una comunidad de amor conyugal, filial y fraterno.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('5abfbe81-75e4-4444-b52d-38e59e8b6ec7', 5, 4, NULL, '15 a 17 años', 'Estoy siempre disponible para ayudar a los demás, incluso cuando se trata de tareas pesadas o poco agradables.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('bf199285-12a9-422e-b97a-2fe99f326809', 5, 4, NULL, '15 a 17 años', 'Valoro la democracia como sistema de generación de la autoridad.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('810efaf9-df8b-434e-9f6f-838a6e9e2a83', 5, 4, NULL, '15 a 17 años', 'Respeto la autoridad válidamente elegida, aunque no comparta sus ideas.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('6d98798f-014d-4bb3-940f-b0c038c6dbbb', 5, 4, NULL, '15 a 17 años', 'Cuando me corresponde ejercer autoridad lo hago sin autoritarismo ni abusos.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('f1496221-0da5-4775-b3ba-29e65603cfee', 5, 4, NULL, '15 a 17 años', 'Acepto las normas de los diferentes ambientes en que actúo, sin renunciar a mi derecho de tratar de cambiarlas cuando no me parecen correctas.', 'Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('ca4b2a5d-a921-4485-a452-ccbf5db59fbc', 5, 4, NULL, '15 a 17 años', 'Me esfuerzo por orientar creativamente mis actitudes de rebeldía y oposición.', 'Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('7064c110-0fce-4a48-bf5b-340538cfb926', 5, 4, NULL, '15 a 17 años', 'Participo en las actividades de servicio que se desarrollan en mi colegio o trabajo.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('07d61bf7-36fc-40f6-8f8e-21fe97b169f0', 4, 5, NULL, '17 a 20 años', 'Logro y mantengo un estado interior de libertad, equilibrio y madurez emocional.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('95546855-37cf-48db-b6ad-eeab1ae8c614', 5, 4, NULL, '15 a 17 años', 'Valoro críticamente las ideologías y posiciones políticas existentes en mi país.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('c07a9c41-d867-4ac1-af49-d315453cf61f', 5, 4, NULL, '15 a 17 años', 'Aprecio críticamente los elementos, cambios y metas de mi cultura.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('59fb6967-0c2f-4ec5-84f1-196222b90692', 5, 4, NULL, '15 a 17 años', 'Expreso mi afecto por los valores de mi cultura a través de alguna de mis habilidades artísticas.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('81e94072-5a28-4c4b-986f-9baed77721b2', 5, 4, NULL, '15 a 17 años', 'Conozco de un modo general el Movimiento en América.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('2e2aba4b-1925-4107-8952-5218881fc1bc', 5, 4, NULL, '15 a 17 años', 'Participo en actividades y proyectos que ayudan a la comprensión entre los países de América.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('f18e6014-6b70-45e8-b9c9-fc57cd637b3c', 5, 4, NULL, '15 a 17 años', 'Valoro las distintas formas en que se expresa la cultura.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('c3387367-af13-4910-9d13-002a08f93627', 5, 4, NULL, '15 a 17 años', 'Desarrollo proyectos de conservación en conjunto con jóvenes que no son guías o scouts.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('c165a639-f87a-4f6c-a637-69894848b507', 6, 4, NULL, '15 a 17 años', 'Respeto y cuido la naturaleza porque me siento responsable de la obra creadora de Dios.', 'Busca siempre a Dios en forma personal y comunitaria, aprendiendo a reconocerlo en las personas y en la Creación.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('b16cc7a4-25eb-46d8-a26a-ba3eddb32736', 6, 4, NULL, '15 a 17 años', 'Organizo actividades en las que se da a conocer el testimonio de otras personas.', 'Busca siempre a Dios en forma personal y comunitaria, aprendiendo a reconocerlo en las personas y en la Creación.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('6f0f7391-7d89-4944-b27c-899542a2ea78', 6, 4, NULL, '15 a 17 años', 'Confirmo mi opción de fe en la forma establecida por mi religión.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('e70ea75c-141b-497a-a83f-e8444bd55f5e', 6, 4, NULL, '15 a 17 años', 'Ayudo en la educación religiosa de mis compañeros y compañeras de Avanzada que participan de mi fe.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('c95c7481-dd7f-4f14-938c-b74d5159799b', 6, 4, NULL, '15 a 17 años', 'Integro la oración en las decisiones más importantes de mi vida.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('57a9f554-a5ba-48bc-913b-47e187d1513c', 6, 4, NULL, '15 a 17 años', 'Trato que mi vida refleje aquello en que creo.', 'Integra sus principios religiosos a su conducta cotidiana, estableciendo coherencia entre su fe, su vida personal y su participación social.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('d3b63616-c432-49bc-9455-5971de2e414a', 6, 4, NULL, '15 a 17 años', 'Comparto con otros jóvenes la experiencia de vivir de acuerdo a mi fe.', 'Integra sus principios religiosos a su conducta cotidiana, estableciendo coherencia entre su fe, su vida personal y su participación social.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('03e4eec9-2151-4ecd-bfc4-9cafeba53458', 6, 4, NULL, '15 a 17 años', 'Conozco los postulados básicos de las principales religiones.', 'Dialoga con todas las personas cualquiera sea su opción religiosa, buscando establecer vínculos de comunión entre los hombres.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('a3315f76-1391-4f5b-a468-8a823596be95', 6, 4, NULL, '15 a 17 años', 'Me intereso por conocer el pensamiento religioso diferente de las personas con quienes comparto.', 'Dialoga con todas las personas cualquiera sea su opción religiosa, buscando establecer vínculos de comunión entre los hombres.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('bc8f595b-6949-4f2e-9304-86a2306449e1', 1, 5, NULL, '17 a 20 años', 'Asumo la parte de responsabilidad que me corresponde en el desarrollo armónico de mi cuerpo.', 'Asume la parte de responsabilidad que le corresponde en el desarrollo armónico de su cuerpo.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('0bdd48c4-4bce-4e8e-8db1-59bddebf7ad5', 1, 5, NULL, '17 a 20 años', 'Valoro mi aspecto y cuido mi higiene personal y la de mi entorno.', 'Valora su aspecto y cuida su higiene personal y la de su entorno.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('438c0d3d-f127-4b59-ad45-b14f5147e8ba', 1, 5, NULL, '17 a 20 años', 'Mantengo mi alimentación sencilla y adecuada.', 'Mantiene una alimentación sencilla y adecuada.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('f50793ec-af57-47d1-b3dd-1c7b178dcd32', 1, 5, NULL, '17 a 20 años', 'Administro mi tiempo equilibradamente entre mis diversas obligaciones, practicando formas apropiadas de descanso.', 'Administra su tiempo equilibradamente entre sus diversas obligaciones, practicando formas apropiadas de descanso.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('106e27af-ec7a-45fa-9295-fcef88fbef3d', 1, 5, NULL, '17 a 20 años', 'Convivo constantemente en la naturaleza y participo en actividades deportivas y recreativas.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('ef75fbed-4a6d-49ea-bfab-f2952415e1a0', 2, 5, NULL, '17 a 20 años', 'Actúo con agilidad mental ante las situaciones más diversas, desarrollando mi capacidad de pensar, innovar y aventurar.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('b8819a1e-93e3-473b-b6f3-cef1b9d90334', 2, 5, NULL, '17 a 20 años', 'Elijo mi vocación considerando conjuntamente mis aptitudes, posibilidades e intereses; y valoro sin prejuicios las opciones de los demás.', 'Elige su vocación considerando conjuntamente sus aptitudes, posibilidades e intereses; y valora sin prejuicios las opciones de los demás.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('27935a55-2a37-46f9-b6d6-3de72592181b', 2, 5, NULL, '17 a 20 años', 'Valoro la ciencia y la técnica como medios para comprender y servir al hombre, la sociedad y el mundo.', 'Valora la ciencia y la técnica como medios para comprender y servir al hombre, la sociedad y el mundo.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('8f0eb7d9-c291-44f3-9551-4330c19e0cc2', 3, 5, NULL, '17 a 20 años', 'Conozco mis posibilidades y limitaciones, aceptándome con capacidad de autocrítica y manteniendo a la vez una buena imagen de mí mismo.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('dc250033-597f-4c74-8142-74a7a1cc3d13', 3, 5, NULL, '17 a 20 años', 'Soy el principal responsable de mi desarrollo y me esfuerzo por superarme constantemente.', 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('770a8ff3-7bb8-45dd-b114-5ae1069eff62', 3, 5, NULL, '17 a 20 años', 'Actúo consecuentemente con los valores que me inspiran.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('d716bdfb-2fea-4b96-9a46-b86d66692d45', 3, 5, NULL, '17 a 20 años', 'Enfrento la vida con alegría y sentido del humor.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('49cf9c94-b84e-4b5d-a521-550f7710ce5b', 4, 3, NULL, '11 a 13 años', 'Me informo adecuadamente sobre lo que significa ser hombre y ser mujer.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('7c785c59-5116-455b-adc1-550937b56b42', 4, 5, NULL, '17 a 20 años', 'Conozco, acepto y respeto mi sexualidad y la del sexo complementario como expresión del amor.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('f79e2572-ab05-4256-863a-7af534aa33b1', 4, 5, NULL, '17 a 20 años', 'Reconozco a la familia como base de la sociedad, convirtiendo la mía en una comunidad de amor conyugal, filial y fraterno.', 'Reconoce el matrimonio y la familia como base de la sociedad, convirtiendo la suya en una comunidad de amor conyugal, filial y fraterno.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('90b668d6-3e32-4544-ac2a-7f1348b4f37f', 5, 5, NULL, '17 a 20 años', 'Reconozco y respeto la autoridad válidamente establecida y la ejerzo al servicio de los demás.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('b5954f1c-4d0d-4bdb-97d8-821583beb77e', 5, 5, NULL, '17 a 20 años', 'Cumplo las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.', 'Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('3c89c7ee-5827-4002-9c1d-76bd26bae6fa', 5, 5, NULL, '17 a 20 años', 'Hago míos los valores de mi país, mi pueblo y mi cultura.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('5d199d2b-a65d-4195-8915-5f8dab0450de', 5, 5, NULL, '17 a 20 años', 'Promuevo la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('0a9a9dac-0b1c-4f11-8600-291de10b1b95', 6, 5, NULL, '17 a 20 años', 'Busco siempre a Dios en forma personal y comunitaria, aprendiendo a reconocerlo en los hombres y en la Creación.', 'Busca siempre a Dios en forma personal y comunitaria, aprendiendo a reconocerlo en las personas y en la Creación.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('cefd7d3c-5a3c-46b9-ba94-4f3556ba68e6', 6, 5, NULL, '17 a 20 años', 'Practico la oración personal y comunitaria, como expresión de mi búsqueda de Dios y como un medio de relacionarme con Él.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('5c2e103a-bea4-4e16-bf81-bc47d0ae8ad1', 6, 5, NULL, '17 a 20 años', 'Dialogo con todas las personas cualquiera sea su opción religiosa, buscando establecer vínculos de comunión entre los hombres y mujeres.', 'Dialoga con todas las personas cualquiera sea su opción religiosa, buscando establecer vínculos de comunión entre los hombres.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('36d989b6-30dd-434a-874a-70a993ed0bec', 1, 1, NULL, 'Infancia Media', 'Conozco las principales enfermedades que me pueden dar y por qué.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('d9ebcd96-c9cf-444f-94fb-5569110a1b99', 1, 1, NULL, 'Infancia Media', 'Participo en actividades que me ayudan a tener un cuerpo cada vez más fuerte, ágil, veloz y flexible.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('dfd0c152-ec28-450d-a0ce-194be92ab63e', 1, 1, NULL, 'Infancia Media', 'Cuando algo me molesta lo digo sin necesidad de pelear con los demás.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('d0e3d3e7-df02-4092-a5b8-20c3cf6e6159', 1, 1, NULL, 'Infancia Tardía', 'Tengo hábitos que protegen mi salud, como por ejemplo, lavarme las manos después de ir al baño.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('626a313e-0407-4cfd-b714-c6aa6e51738c', 1, 1, NULL, 'Infancia Tardía', 'Manejo cada vez mejor mis brazos, piernas, manos y pies.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('24addc27-b61b-44c5-ad5d-8bd12d1c4664', 1, 1, NULL, 'Infancia Tardía', 'Arreglo mis problemas con mis compañeros sin usar la fuerza.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('0645e815-1412-4f5c-981c-cb5c1d94d772', 1, 1, NULL, 'Infancia Tardía', 'Mantengo ordenada y limpia mi habitación y los lugares en que trabajo y juego.', 'Valora su aspecto y cuida su higiene personal y la de su entorno.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('e05d2a87-7bc9-409a-8f47-5a93ae9ab96f', 1, 1, NULL, 'Infancia Media', 'Como a las horas adecuadas y no a cada rato.', 'Mantiene una alimentación sencilla y adecuada.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('66d54629-17c7-4e5f-9337-598a91e93b20', 1, 1, NULL, 'Infancia Tardía', 'Cuando como o preparo alimentos me preocupo de lavarme y de que todo esté limpio.', 'Mantiene una alimentación sencilla y adecuada.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('199eca16-d16a-4b54-b496-ed512925c24d', 1, 1, NULL, 'Infancia Media', 'Hago a tiempo y con calma las tareas que me dan en la escuela.', 'Administra su tiempo equilibradamente entre sus diversas obligaciones, practicando formas apropiadas de descanso.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('01763bdc-ae6b-4d45-a609-a063f7bb2dc1', 1, 1, NULL, 'Infancia Tardía', 'Sé distribuir bien mi tiempo entre las distintas cosas que hago.', 'Administra su tiempo equilibradamente entre sus diversas obligaciones, practicando formas apropiadas de descanso.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('424b6329-db74-4745-a50a-f68d20acde71', 1, 1, NULL, 'Infancia Tardía', 'Duermo las horas que necesito para descansar bien.', 'Administra su tiempo equilibradamente entre sus diversas obligaciones, practicando formas apropiadas de descanso.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('4bf1e3dd-7f21-4c24-962d-9d6d64e32f25', 1, 1, NULL, 'Infancia Media', 'Me gusta hacer actividades al aire libre.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5', 1, 1, NULL, 'Infancia Media', 'Me gusta practicar deportes.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('5d2d48ed-c461-4a8e-9048-cceecd3de2e2', 1, 1, NULL, 'Infancia Tardía', 'Me gusta jugar con otros niños y niñas y respeto las reglas de los juegos.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('897408de-c314-4908-aee0-4a0e0e56d4ba', 2, 1, NULL, 'Infancia Media', 'Converso con los demás sobre las cosas que me llaman la atención.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('03ee81d8-8e06-446d-82be-7d5e7fe3f392', 2, 1, NULL, 'Infancia Media', 'Leo las historias que me recomiendan mis papás, profesores y dirigentes.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('ec280dd0-2d80-4b84-86ad-2d362da14886', 2, 1, NULL, 'Infancia Media', 'Me gusta participar en juegos de observación.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('fa1660fa-083d-4ce9-8fa0-b42d35ad155d', 4, 2, NULL, '11 a 13 años', 'Entiendo que la sexualidad humana está unida al amor.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('252e20b0-1f6a-48ff-8c52-5645b7eaebdf', 2, 1, NULL, 'Infancia Tardía', 'Soy capaz de contarle a los demás lo que leo y aprendo.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('9fe305a1-531d-47b6-9aaa-e7d6b2dbd3b1', 2, 1, NULL, 'Infancia Tardía', 'Relaciono las cosas imaginarias con las que pasan de verdad.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('4e6b0cd4-85bb-404b-9af2-36fd5b2a4f04', 2, 1, NULL, 'Infancia Tardía', 'Saco mis propias conclusiones de los cuentos e historias que leo.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('d4232b99-5655-49c6-9d24-099cfe9c8180', 2, 1, NULL, 'Infancia Tardía', 'Practico continuamente mis habilidades manuales.', 'Une los conocimientos teórico y práctico mediante la aplicación constante de sus habilidades técnicas y manuales.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('c40d64dd-b9cc-41fd-9e1f-7827714cb222', 2, 1, NULL, 'Infancia Media', 'Sé lo que hacen las personas en los trabajos más conocidos.', 'Elige su vocación considerando conjuntamente sus aptitudes, posibilidades e intereses; y valora sin prejuicios las opciones de los demás.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('d9abc195-8f33-4d52-8e2e-b8fdc6f09e17', 2, 1, NULL, 'Infancia Tardía', 'Demuestro las distintas cosas que puedo hacer.', 'Elige su vocación considerando conjuntamente sus aptitudes, posibilidades e intereses; y valora sin prejuicios las opciones de los demás.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('e5eada78-3a2d-467e-8d15-da159b60552f', 2, 1, NULL, 'Infancia Media', 'Me gusta dibujar y pintar.', 'Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('47e7e2d8-12cd-447d-8df4-251e83aa547b', 2, 1, NULL, 'Infancia Tardía', 'Trato de hablar claro y conocer nuevas palabras.', 'Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('2c14c363-c2d3-487a-9c7b-ef634074d4b7', 2, 1, NULL, 'Infancia Media', 'Quiero conocer y manejar nuevos objetos.', 'Valora la ciencia y la técnica como medios para comprender y servir al hombre, la sociedad y el mundo.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('3b7790eb-15dc-4587-a735-710cc6eb28aa', 2, 1, NULL, 'Infancia Tardía', 'Quiero saber por qué ocurren las cosas.', 'Valora la ciencia y la técnica como medios para comprender y servir al hombre, la sociedad y el mundo.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('51281d36-2e3c-439d-b0a5-74e7327d273f', 2, 1, NULL, 'Infancia Media', 'Sé cómo se usan y para qué sirven los objetos que conozco.', 'Valora la ciencia y la técnica como medios para comprender y servir al hombre, la sociedad y el mundo.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('b66418eb-3eee-466e-9836-457b3bb922cc', 3, 1, NULL, 'Infancia Tardía', 'Sé lo que puedo hacer y lo que no puedo hacer.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('4df1ba93-06fe-4f49-b273-fddc3800cf17', 3, 1, NULL, 'Infancia Tardía', 'Le doy importancia a las cosas que hago bien.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('eba5dac5-e1aa-498d-8d94-9655162890e5', 3, 1, NULL, 'Infancia Media', 'Entiendo que es bueno que tenga metas que me ayuden a ser cada día mejor.', 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('5b3c7730-2cc5-42c0-b867-1ce06b3675a7', 3, 1, NULL, 'Infancia Tardía', 'Hago bien los trabajos que acepto.', 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('869ed744-5399-41d1-bbb1-5f100f151595', 3, 1, NULL, 'Infancia Media', 'Conozco la Ley y la Promesa de la Manada y entiendo lo que significan.', 'Construye su proyecto de vida en base a los valores de la Ley y la Promesa Scout.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('b83bd29c-0117-423b-af20-1e4964a46efb', 3, 1, NULL, 'Infancia Tardía', 'Sé lo que significa cumplir la Ley y la Promesa en mi vida diaria.', 'Construye su proyecto de vida en base a los valores de la Ley y la Promesa Scout.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('baa365a9-087c-4c25-b0ad-57893df5ff74', 3, 1, NULL, 'Infancia Media', 'Sé lo que significa decir la verdad.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('a2b1a0ea-f0f6-42c9-8048-3a3c54f264c3', 3, 1, NULL, 'Infancia Media', 'He aprendido que en las cosas que hago con mis compañeros debo cumplir la Ley de la Manada.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('e9f10dfe-654a-46fd-95ff-5a3d21a26e00', 3, 1, NULL, 'Infancia Media', 'Participo en juegos y representaciones que muestran la importancia de decir la verdad.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('506b7596-cac4-48e0-88c7-942d575172db', 3, 1, NULL, 'Infancia Tardía', 'Digo la verdad, aunque a veces no me gusten las consecuencias.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('b5503f0e-0969-4448-9ebb-b6050e7c541a', 3, 1, NULL, 'Infancia Tardía', 'Ayudo a que en la Manada se diga siempre la verdad.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('8c1cbf88-6e1d-496b-b789-9e0b767c8814', 3, 1, NULL, 'Infancia Media', 'Casi siempre estoy alegre.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('df453b65-c52f-43c8-a7c4-d399eb81e44a', 3, 1, NULL, 'Infancia Media', 'Tengo buen humor y puedo hacer bromas sin burlarme de los demás.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('d408da3c-207d-4442-a891-8f50efbeecb1', 3, 1, NULL, 'Infancia Tardía', 'Enfrento las dificultades con buen ánimo.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('5e3a214d-733d-4b8c-99e2-249da7e37eeb', 3, 1, NULL, 'Infancia Tardía', 'Ayudo a que en la Manada nos riamos sin ofender a los demás.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('99c6e695-ef0b-4e36-956b-3faf15ada355', 3, 1, NULL, 'Infancia Media', 'Escucho a los demás lobatos, a mis papás y a mis dirigentes y guiadoras.', 'Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('3a84066e-ad27-4122-9a89-4ae45844668b', 3, 1, NULL, 'Infancia Tardía', 'Tengo amigos y amigas con los que siempre juego y me encuentro.', 'Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('054680a5-f07a-4771-8d7a-811a5db8f505', 4, 1, NULL, 'Infancia Media', 'Acepto separarme de mi familia cuando voy de campamento con la Manada.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('6e25f6ed-277c-41b4-9d0f-322b0a2d4c94', 4, 1, NULL, 'Infancia Media', 'Acepto las opiniones de mis compañeros, aunque yo piense distinto.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('36b44b5b-601f-4d7f-a510-8266479c9da1', 4, 1, NULL, 'Infancia Media', 'Me gusta tener nuevos amigos y amigas.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('a955b97f-7e94-4772-b1a8-878fa8b31ec1', 4, 1, NULL, 'Infancia Media', 'Ayudo a los nuevos lobatos para que se sientan contentos en la Manada.', 'Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('95ebdbf3-8067-46d2-ae38-2af656eebac2', 4, 3, NULL, '11 a 13 años', 'Entiendo que la sexualidad humana está unida al amor.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('05df5772-eea5-43e9-8aa5-2d777ada0402', 4, 1, NULL, 'Infancia Tardía', 'Acepto cuando en la Manada me dicen que no hice algo bien, aunque no siempre esté de acuerdo.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('b8e24cea-86b8-4908-90cc-9ad5e7beb463', 4, 1, NULL, 'Infancia Tardía', 'Pienso bien lo que voy a hacer antes de hacerlo.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('9f8cdd1f-20d5-47f8-92c2-a660693c348f', 4, 1, NULL, 'Infancia Tardía', 'Soy cada vez más amigo de mis amigos y amigas, pero igual aprecio a mis demás compañeros.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('b658a9a2-c0fb-4aec-b862-528eb90e07d1', 4, 1, NULL, 'Infancia Tardía', 'Comparto con todos mis compañeros, sin importarme su raza, en qué trabajan sus papás, o si tienen o no dinero.', 'Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('e4d2c4e4-983e-4b35-96cd-75d43e2b7c1c', 4, 1, NULL, 'Infancia Media', 'Juego y hago actividades por igual con niños y niñas.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('d72cc3b0-e3a4-412f-a1d7-500eda367b33', 4, 1, NULL, 'Infancia Tardía', 'Trato con igual justicia y de la misma manera a mis compañeras y a mis compañeros.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('a2c1bf0b-e34b-42e5-a9b1-d6474c4912e2', 4, 1, NULL, 'Infancia Media', 'Soy cariñoso con mis papás y demás familiares.', 'Reconoce el matrimonio y la familia como base de la sociedad, convirtiendo la suya en una comunidad de amor conyugal, filial y fraterno.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('917b35da-9406-40a3-b5db-c16fcea35699', 4, 1, NULL, 'Infancia Tardía', 'Le cuento a mi familia las cosas que hacemos en la Manada.', 'Reconoce el matrimonio y la familia como base de la sociedad, convirtiendo la suya en una comunidad de amor conyugal, filial y fraterno.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('cfa10133-c25c-4deb-aebe-a00f8fe3f7ef', 5, 1, NULL, 'Infancia Media', 'Comparto lo que tengo con mis compañeros y compañeras.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('a5c8bf0d-4e75-4f7a-89a2-9feabf5ec808', 5, 1, NULL, 'Infancia Media', 'Participo en juegos y actividades sobre los derechos del niño.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('d15e8733-8e84-44e4-9e9c-f8090e201b6e', 5, 1, NULL, 'Infancia Tardía', 'Conozco los derechos del niño y los relaciono con situaciones que conozco o con otras de las que he oído hablar.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('71dbded5-c880-4593-8a7b-3aa755570ece', 5, 1, NULL, 'Infancia Media', 'Sé por qué tengo que respetar las decisiones que toman los mayores.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('46916a35-67a6-417d-ab93-c6cfee4167df', 5, 1, NULL, 'Infancia Tardía', 'Respeto a mis papás y profesores y las decisiones que toman.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('b69188bf-2391-43c1-a885-abd1b13912be', 5, 1, NULL, 'Infancia Media', 'Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.', 'Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('201cf9be-ca1f-40c4-a20a-ee589346e863', 5, 1, NULL, 'Infancia Media', 'Ayudo en mi casa tan pronto como me lo piden.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('2c0a4112-199e-48a7-bf61-e4fb747245b2', 5, 1, NULL, 'Infancia Media', 'Sé donde están los bomberos, la policía, el hospital y algunos otros servicios públicos del lugar donde vivo.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('7bedad89-69e0-46b5-907e-a84c19e188d1', 5, 1, NULL, 'Infancia Tardía', 'Sé cuáles son y dónde están los principales servicios públicos del lugar donde vivo.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('d5415bd4-83bf-4a22-aeaf-9926b88f9b00', 5, 1, NULL, 'Infancia Tardía', 'Participo siempre en campañas de ayuda a quienes lo necesitan.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('cafa257b-1d05-486a-8b69-ef5695a33925', 5, 1, NULL, 'Infancia Media', 'Conozco los símbolos de mi país, como por ejemplo la bandera, el himno y el escudo.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('e3b22fc6-8896-44bd-9aa4-48f1a0ca49fd', 5, 1, NULL, 'Infancia Media', 'Respeto los símbolos de mi país.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('8888b244-344e-40a1-9abe-d547a43deecb', 5, 1, NULL, 'Infancia Tardía', 'Algo conozco de las cosas típicas del lugar en que vivo.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('f5e2e054-9561-4132-a855-ffc9f25fac33', 5, 1, NULL, 'Infancia Tardía', 'Me gusta la cultura de mi país y las distintas formas en que se expresa.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('b770bce4-9786-4fd6-bc7d-5bde211417a6', 5, 1, NULL, 'Infancia Media', 'Sé cuáles son las distintas Unidades que hay en mi Grupo y conozco sus nombres.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('85d5cef4-2483-4b79-a1e1-b7117f60fdc2', 5, 1, NULL, 'Infancia Media', 'Sé cuáles son los países americanos.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('472be67d-b110-4fd9-aa16-1f0bf088067c', 5, 1, NULL, 'Infancia Tardía', 'Participo en actividades de intercambio con Manadas de otros Grupos.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('45392af0-cfd3-4a56-8453-6caff4de44a8', 5, 1, NULL, 'Infancia Tardía', 'Participo en actividades en que aprendo lo importante que es la paz.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('789469d9-0a2c-4187-bead-5b9ed5d0cf72', 5, 1, NULL, 'Infancia Media', 'Cuido las plantas que hay en mi casa.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('a73a7bab-3ed2-46de-9ada-f6e9e54ea039', 5, 1, NULL, 'Infancia Media', 'He sembrado y cuidado yo solo una o varias plantas.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('e13cc7f4-052f-476c-b068-95dc59e284b2', 5, 1, NULL, 'Infancia Tardía', 'Cuido los árboles y las plantas en los lugares en que juego, trabajo y vivo.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('934eca69-acec-46b9-acd9-16ff6071e515', 5, 1, NULL, 'Infancia Tardía', 'Mantengo un pequeño jardín.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('7d6d5c5e-ad6d-4cad-b664-ca94268814d2', 4, 3, NULL, '13 a 15 años', 'Comparto con los demás, sin vergüenza ni burla, lo que sé sobre sexualidad del hombre y de la mujer.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('ed4aa274-064c-4980-88c1-b4433dd03aa3', 1, 1, NULL, 'Infancia Tardía', 'Entiendo para qué sirven los sistemas más importantes de mi cuerpo.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('fe35ae87-749a-4d0a-8672-671b635c9b5b', 1, 1, NULL, 'Infancia Media', 'Me gusta jugar con compañeros de mi edad.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('576005f7-e4a0-41dd-bde0-d7ee9b5df129', 1, 1, NULL, 'Infancia Tardía', 'Ayudo a preparar las excursiones de la Manada.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('309c6121-94fc-43a2-b0fb-f6a975f78962', 1, 1, NULL, 'Infancia Tardía', 'Practico deportes, conozco sus reglas y sé perder.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('0fdac5b5-f76d-4141-9dba-397ca49a5fcc', 2, 1, NULL, 'Infancia Media', 'Participo en actividades donde puedo conocer algo nuevo.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('a2ef0709-ac6d-4d90-9fe8-c96eeff5cf14', 2, 1, NULL, 'Infancia Media', 'No me olvido de las cosas que me pasan.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('dcdcce42-6b31-45f7-a135-290f0f74b5a6', 2, 1, NULL, 'Infancia Tardía', 'Me gustan los juegos en que tengo que usar mi agilidad mental.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('9d28d37d-bf61-4500-90a1-8f34b5f94d38', 2, 1, NULL, 'Infancia Media', 'Sé para qué sirven las herramientas que uso.', 'Une los conocimientos teórico y práctico mediante la aplicación constante de sus habilidades técnicas y manuales.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('ccae8bbe-0001-4e5e-bbe4-077f60d9401f', 2, 1, NULL, 'Infancia Tardía', 'Hago trabajos cada vez mejores con mis manos.', 'Une los conocimientos teórico y práctico mediante la aplicación constante de sus habilidades técnicas y manuales.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('2ffaa671-a988-4f32-a98a-6ce0aabde6a6', 2, 1, NULL, 'Infancia Media', 'Participo en actividades que me ayudan a conocer más sobre los diferentes trabajos de las personas.', 'Elige su vocación considerando conjuntamente sus aptitudes, posibilidades e intereses; y valora sin prejuicios las opciones de los demás.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('7873fc64-de64-4d1b-8426-9d6d2d62c06d', 2, 1, NULL, 'Infancia Tardía', 'Participo en representaciones artísticas sobre las profesiones y oficios.', 'Elige su vocación considerando conjuntamente sus aptitudes, posibilidades e intereses; y valora sin prejuicios las opciones de los demás.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('52b5580a-7d0f-454f-b2ae-0d3318129165', 2, 1, NULL, 'Infancia Media', 'Canto, bailo y preparo actuaciones con mis amigos de la Manada.', 'Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('14b82459-ac31-4496-a875-8e9bd5666030', 2, 1, NULL, 'Infancia Tardía', 'En las actividades que hago se nota lo que pienso y siento.', 'Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('44d43ff8-3810-49eb-a04e-95db31f38355', 2, 1, NULL, 'Infancia Tardía', 'Me doy cuenta y me gusta cuando los demás hablan bien.', 'Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('e168aabd-00aa-44b5-8a9a-f0e8a94a0ccd', 2, 1, NULL, 'Infancia Tardía', 'Le busco solución a los problemas que aparecen en las cosas que hago.', 'Valora la ciencia y la técnica como medios para comprender y servir al hombre, la sociedad y el mundo.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('041daaea-c4a7-472b-a613-951bd25cfa85', 3, 1, NULL, 'Infancia Media', 'Reconozco y acepto mis errores.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('8adf65db-9e04-465f-89d3-b76d0e7f4ed6', 3, 1, NULL, 'Infancia Media', 'Participo en actividades que me ayudan a descubrir lo que puedo hacer.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('845608c7-9c26-477b-86fb-46a65bf78f29', 3, 1, NULL, 'Infancia Tardía', 'Acepto mis defectos y sé que existen cosas que aún no puedo hacer.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('4c30bc21-ce45-4e13-995d-d9e0cce0159d', 6, 1, NULL, 'Infancia Tardía', 'Me gusta cuando las personas hacen cosas buenas por los demás.', 'Busca siempre a Dios en forma personal y comunitaria, aprendiendo a reconocerlo en las personas y en la Creación.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('a83e64d6-253a-4dde-9f45-5960f15ad601', 6, 1, NULL, 'Infancia Media', 'Tengo interés en conocer cada vez más sobre Dios y mi religión.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('04d56fd0-d9de-4136-b59b-7867b63dc031', 6, 1, NULL, 'Infancia Media', 'Participo con mi familia en las celebraciones de mi religión.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('0b0087c4-822e-4167-9ac1-89b778fff1f0', 6, 1, NULL, 'Infancia Tardía', 'Pregunto a las demás personas sobre las cosas que me interesan de mi religión.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('0c1d89cb-8251-4a9d-ab03-a8ac4c61dbd9', 6, 1, NULL, 'Infancia Tardía', 'Ayudo en las celebraciones religiosas de la Manada.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('9b599552-3cb9-4282-b3e2-9091ed0a8b6d', 6, 1, NULL, 'Infancia Media', 'Participo con mi familia cuando decimos juntos una oración.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('2aea1dec-5396-4476-bcaa-808060f82c7e', 6, 1, NULL, 'Infancia Tardía', 'A veces yo dirijo las oraciones que decimos en la Manada.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('d2bd3583-59cf-4a97-bc1d-2d5f0d9556c5', 6, 1, NULL, 'Infancia Tardía', 'Me doy cuenta cuando las personas viven de acuerdo a las enseñanzas de su religión.', 'Integra sus principios religiosos a su conducta cotidiana, estableciendo coherencia entre su fe, su vida personal y su participación social.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('76affcb7-970b-40eb-8621-98bce9be6c1b', 6, 1, NULL, 'Infancia Tardía', 'Comprendo que las enseñanzas de mi religión se deben notar en la forma en que soy con mis amigos y compañeros.', 'Integra sus principios religiosos a su conducta cotidiana, estableciendo coherencia entre su fe, su vida personal y su participación social.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('22623dfd-12ad-42f9-bbeb-1d9477c8213c', 6, 1, NULL, 'Infancia Tardía', 'Todos mis compañeros son importantes, aunque no tengan mi misma religión.', 'Dialoga con todas las personas cualquiera sea su opción religiosa, buscando establecer vínculos de comunión entre los hombres.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('60db073f-4295-4b2a-bc51-5e67ba00c605', 3, 1, NULL, 'Infancia Media', 'Acepto los consejos que me dan mis papás, profesores y dirigentes para ayudarme a ser mejor.', 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('feeaf72d-4c33-4edd-8513-000a659d0491', 3, 1, NULL, 'Infancia Tardía', 'Me propongo tareas y metas que me ayudan a superar mis defectos.', 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('b1a1caa9-5321-4441-ae5d-e6fd070962e7', 3, 1, NULL, 'Infancia Media', 'He prometido cumplir la Ley y la Promesa de la Manada.', 'Construye su proyecto de vida en base a los valores de la Ley y la Promesa Scout.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('a19c6090-81ff-4d1d-aa26-fdb39aedfdba', 3, 1, NULL, 'Infancia Tardía', 'Trato de cumplir la Ley y la Promesa en la Manada, en mi casa y en mi escuela.', 'Construye su proyecto de vida en base a los valores de la Ley y la Promesa Scout.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('88114f29-acff-4cfc-9343-36312a86ddc7', 3, 1, NULL, 'Infancia Tardía', 'Entiendo que tengo que cumplir la Ley de la Manada también en mi casa.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('7fcaa85f-358b-40e2-bc67-d1445d8deee8', 3, 1, NULL, 'Infancia Media', 'Participo con alegría en las actividades de la Manada.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('121c9a27-6775-4242-992f-1b361fc7b08b', 3, 1, NULL, 'Infancia Tardía', 'Me siento feliz cuando logro lo que me propuse; y también cuando a mis compañeros las cosas les resultan bien.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('6b8c5fb5-6730-4c61-a332-2a7e6033bd94', 3, 1, NULL, 'Infancia Tardía', 'Me llevo bien con todos los lobatos de la Manada.', 'Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('80102a2d-bc83-41fc-85ab-d98b42dbca76', 4, 1, NULL, 'Infancia Media', 'Trato de no esconder mis alegrías, mis penas, las cosas que me gustan y las que me dan miedo.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('ab6e594f-b0a0-4e6d-96aa-7779299b02ef', 4, 1, NULL, 'Infancia Media', 'Trato con cariño a los demás en la Manada y me gusta que me traten igual.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('b39109f4-260d-46e2-9192-2db4de116b1b', 4, 1, NULL, 'Infancia Media', 'Converso y comparto con todas las personas.', 'Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('5227552d-304d-4199-bcc0-b366ca081a4d', 4, 1, NULL, 'Infancia Tardía', 'Estoy siempre dispuesto a ayudar a los demás.', 'Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('6f3547e4-e456-41e0-8de8-6f60e12891b9', 4, 1, NULL, 'Infancia Media', 'Conozco las diferencias físicas entre el hombre y la mujer y no me burlo de eso.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('491af933-4736-4c07-9b26-e3f6a42fac20', 4, 1, NULL, 'Infancia Media', 'Le pregunto a mis papás cada vez que no sé algo sobre temas de sexuales y escucho con atención sus respuestas.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('58ade12f-15d1-4f46-b989-63392c538f02', 4, 1, NULL, 'Infancia Tardía', 'Sé cómo una mujer queda embarazada, cómo nacen los bebés y qué hacen el hombre y la mujer en esos procesos naturales.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('7ff0c343-64ea-4668-bdd1-c44e53581bdb', 4, 1, NULL, 'Infancia Media', 'Soy cariñoso con mis hermanos, hago cosas con ellos y trato de no pelear.', 'Reconoce el matrimonio y la familia como base de la sociedad, convirtiendo la suya en una comunidad de amor conyugal, filial y fraterno.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('c7f99a9b-0b82-4d4f-9018-09bbed370a45', 4, 1, NULL, 'Infancia Tardía', 'Comparto con la familia de mis amigos e invito a que compartan con la mía.', 'Reconoce el matrimonio y la familia como base de la sociedad, convirtiendo la suya en una comunidad de amor conyugal, filial y fraterno.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('7449ad52-5047-4116-b71b-1937cca85587', 5, 1, NULL, 'Infancia Media', 'Cumplo las tareas de servicio que me encargan en la Manada.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('27a71b44-9900-46e9-be75-38900c629663', 5, 1, NULL, 'Infancia Tardía', 'Ayudo siempre en las tareas de servicio que se deben hacer en la Manada.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('cd92f892-9044-4391-b409-af0506651568', 5, 1, NULL, 'Infancia Media', 'Ayudo a mis compañeros cuando les toca dirigir alguna actividad.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('926326bb-ea81-4153-9943-74aee26e9119', 5, 1, NULL, 'Infancia Tardía', 'Elijo con mis compañeros a los seiseneros y ayudo al que ganó.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('59a7750e-a71e-4b25-a59c-c9594d5f2e0a', 5, 1, NULL, 'Infancia Tardía', 'Digo con respeto lo que me gusta y no me gusta de las normas que hay en mi casa y en la escuela.', 'Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('88ecaf2b-fa30-45c3-9248-3ad08306471d', 5, 1, NULL, 'Infancia Media', 'Colaboro en lo que puedo en campañas de ayuda a los que más lo necesitan.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('3b6cf976-db3d-479e-b214-f165bf311a5f', 5, 1, NULL, 'Infancia Tardía', 'Ayudo siempre en las tareas que hay que hacer en mi casa y en la escuela.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('7abeef40-f5e7-4d81-93b7-16ba07fc76ba', 5, 1, NULL, 'Infancia Media', 'Participo con respeto y entusiasmo en las celebraciones patrias.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('cfe04f24-2d03-4b2e-be50-850dbbc70616', 5, 1, NULL, 'Infancia Tardía', 'Participo en las actividades de la Manada en que se expresa la cultura de mi país.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('65bb28a7-2bed-4cea-8966-d10533db8b29', 5, 1, NULL, 'Infancia Media', 'Participo en actividades con otras Unidades de mi Grupo.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('09fec030-f76f-4564-9252-d42d2e28ab02', 5, 1, NULL, 'Infancia Tardía', 'Puedo nombrar la mayoría de los Grupos Scouts que quedan cerca del mío.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('7ae3eb76-9d80-45ea-9a97-6c1658d1136e', 5, 1, NULL, 'Infancia Tardía', 'Conozco los símbolos patrios de otros países de América.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('9593e059-a969-465e-9ebc-3a04a6d2bd63', 5, 1, NULL, 'Infancia Media', 'Conozco los principales árboles, plantas, animales, peces y aves de la región en que vivo.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('03dceb73-d64f-46f6-994c-d5a2d7cbe9e3', 5, 1, NULL, 'Infancia Tardía', 'Conozco los principales animales y plantas de mi país que podrían desaparecer si no hacemos algo por ellos.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('8e6e41e8-5ac4-48a0-82bc-08fe0461a18e', 6, 1, NULL, 'Infancia Media', 'He aprendido a reconocer la naturaleza como obra de Dios.', 'Busca siempre a Dios en forma personal y comunitaria, aprendiendo a reconocerlo en las personas y en la Creación.', '2026-06-11 07:13:19.113121+00');
INSERT INTO public.progresion_objetivos VALUES ('dd8ed348-6402-4220-b44a-a33bc4ebcd26', 6, 1, NULL, 'Infancia Media', 'Me gusta mucho la naturaleza y la vida al aire libre.', 'Busca siempre a Dios en forma personal y comunitaria, aprendiendo a reconocerlo en las personas y en la Creación.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('2f2380f7-f392-4a13-9337-d455147e5326', 6, 1, NULL, 'Infancia Media', 'Reconozco las buenas acciones que hacen mis compañeros y compañeras.', 'Busca siempre a Dios en forma personal y comunitaria, aprendiendo a reconocerlo en las personas y en la Creación.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('227fadd7-c845-4343-b45f-83b8479b8e00', 6, 1, NULL, 'Infancia Media', 'Participo en las celebraciones religiosas que se hacen en mi Manada.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('55adf656-05fb-4c47-b3d6-9d1bed2a396b', 6, 1, NULL, 'Infancia Tardía', 'Participo en actividades en que aprendo sobre mi religión.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('be8c1e16-f369-487d-a3f9-10bb0c3c535a', 6, 1, NULL, 'Infancia Media', 'Participo en las oraciones que hacemos en la Manada.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('fd408b98-3322-4a41-910f-5302d55c7aa1', 6, 1, NULL, 'Infancia Tardía', 'Rezo en los momentos importantes del día.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('d72ff466-6ae8-4c44-ba3c-2452bbbb63e3', 6, 1, NULL, 'Infancia Media', 'Conozco la historia de algunas personas que han vivido de acuerdo a su fe.', 'Integra sus principios religiosos a su conducta cotidiana, estableciendo coherencia entre su fe, su vida personal y su participación social.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('e08f9ed4-7c67-40b2-a5c2-4ed1d51516f7', 6, 1, NULL, 'Infancia Media', 'Entiendo que lo que aprendo de mi religión se tiene que notar en la forma en que soy con mi familia.', 'Integra sus principios religiosos a su conducta cotidiana, estableciendo coherencia entre su fe, su vida personal y su participación social.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('a0f2f650-9090-4eca-ac43-c6012cf92f72', 6, 1, NULL, 'Infancia Media', 'Sé que hay personas que son muy buenas y que no tienen la misma religión que yo.', 'Dialoga con todas las personas cualquiera sea su opción religiosa, buscando establecer vínculos de comunión entre los hombres.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('fef361ce-7ca6-4051-bd13-c7d68098a23e', 6, 1, NULL, 'Infancia Tardía', 'Conozco que hay otras religiones distintas de la mía.', 'Dialoga con todas las personas cualquiera sea su opción religiosa, buscando establecer vínculos de comunión entre los hombres.', '2026-06-11 07:33:34.836714+00');
INSERT INTO public.progresion_objetivos VALUES ('5c9843d1-39fd-4298-870c-5e46f29ffbf6', 1, 3, NULL, '11 a 13 años', 'Participo en actividades que me ayudan a mantener mi cuerpo fuerte y sano.', 'Asume la parte de responsabilidad que le corresponde en el desarrollo armónico de su cuerpo.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('91473f71-9345-4bcf-bfc7-dea709d12361', 1, 2, NULL, '13 a 15 años', 'Respeto mi cuerpo y el de los demás.', 'Asume la parte de responsabilidad que le corresponde en el desarrollo armónico de su cuerpo.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('fb56310a-a9cf-46e3-9c34-c4643f6b9035', 1, 3, NULL, '13 a 15 años', 'Respeto mi cuerpo y el de los demás.', 'Asume la parte de responsabilidad que le corresponde en el desarrollo armónico de su cuerpo.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('521a0e4f-0ac3-4ccf-92f6-34b74f39d3a0', 1, 3, NULL, '11 a 13 años', 'Me doy cuenta de los cambios que se están produciendo en mi cuerpo.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('4946a6aa-4a9f-4e7b-89a3-cb5249db8257', 1, 3, NULL, '11 a 13 años', 'Sé lo que puedo y no puedo hacer con mi cuerpo.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('e13e188d-06e6-46b1-814b-60cd859363ba', 1, 3, NULL, '13 a 15 años', 'Comprendo que los cambios que se están produciendo en mi cuerpo influyen en mi manera de ser.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('eb06a0bf-b136-40e6-bc03-5de70cff4bdd', 1, 2, NULL, '13 a 15 años', 'Comprendo que los cambios que se están produciendo en mi cuerpo influyen en mi manera de ser.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('333453ab-e111-4f06-b0e3-a3e7f06b2439', 1, 3, NULL, '13 a 15 años', 'Trato de superar las dificultades físicas propias de mi crecimiento.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('52d9399a-4bf1-4010-a7ca-682b7d1c22a8', 1, 2, NULL, '13 a 15 años', 'Trato de superar las dificultades físicas propias de mi crecimiento.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('340c56d0-afb4-4f7e-bdb2-82c8df15746f', 1, 3, NULL, '11 a 13 años', 'Ayudo a ordenar y limpiar mi casa y los lugares en que estudio y juego.', 'Valora su aspecto y cuida su higiene personal y la de su entorno.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('9d5891bf-e322-464a-8383-1e8b5b24af5e', 1, 2, NULL, '13 a 15 años', 'Mantengo limpio y ordenado mi dormitorio y mis cosas.', 'Valora su aspecto y cuida su higiene personal y la de su entorno.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('4d7e6d41-d06a-4ebf-b731-8f93155a8284', 1, 3, NULL, '13 a 15 años', 'Cuido, limpio y ordeno los lugares en que acampo.', 'Valora su aspecto y cuida su higiene personal y la de su entorno.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('139eb8e0-a67a-40dd-b0ba-a3c604387081', 1, 3, NULL, '13 a 15 años', 'Sé preparar comidas sencillas y lo hago con orden y limpieza.', 'Mantiene una alimentación sencilla y adecuada.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('4d10f2f8-2406-4d5b-ad9d-a280f3e05e95', 1, 2, NULL, '13 a 15 años', 'Sé preparar comidas sencillas y lo hago con orden y limpieza.', 'Mantiene una alimentación sencilla y adecuada.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('e42c9ee1-dc9e-476b-8f17-aa059ceb4f39', 1, 3, NULL, '11 a 13 años', 'Me gusta participar en distintas actividades recreativas.', 'Administra su tiempo equilibradamente entre sus diversas obligaciones, practicando formas apropiadas de descanso.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('38a97562-ae5f-455c-bd20-c563fe7f97af', 1, 3, NULL, '13 a 15 años', 'Organizo bien mi tiempo para estudiar, compartir con mi familia y estar con mis amigos y amigas.', 'Administra su tiempo equilibradamente entre sus diversas obligaciones, practicando formas apropiadas de descanso.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('f94a689f-c0bd-4562-abb1-9b3daefff0b4', 1, 2, NULL, '13 a 15 años', 'Sé elegir entre las diferentes actividades recreativas.', 'Administra su tiempo equilibradamente entre sus diversas obligaciones, practicando formas apropiadas de descanso.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('0765469b-caef-4457-9d6b-cb739c855402', 1, 3, NULL, '11 a 13 años', 'Conozco y practico diferentes juegos y respeto sus reglas.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('2d033cc1-87bb-4990-846e-bbac8a4249fe', 1, 2, NULL, '13 a 15 años', 'Ayudo a preparar los juegos, excursiones y campamentos de mi patrulla y mi Compañía.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('08369c53-2c02-4e9c-8bb5-f949cd092c98', 1, 3, NULL, '13 a 15 años', 'Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('f4bf4e41-7b4a-4968-b22c-380eb81e61a9', 2, 3, NULL, '11 a 13 años', 'Aprendo cosas nuevas además de las que me enseñan en la escuela.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('f9b94724-1f89-4513-91e0-be850e2a67e7', 2, 2, NULL, '11 a 13 años', 'Aprendo cosas nuevas además de las que me enseñan en la escuela.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('0fc96b82-592d-4237-9986-baeb2ba049fa', 2, 2, NULL, '11 a 13 años', 'Busco mis propias lecturas y puedo relacionarlas con las cosas que me pasan.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('071e6f2d-cb33-48c7-a385-4c63d873b254', 2, 3, NULL, '13 a 15 años', 'Me preocupo por saber cada vez más sobre los temas que me interesan.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('fda4f3c9-2c6e-425d-9b86-3b37b40ddb8b', 2, 2, NULL, '13 a 15 años', 'Saco mis propias conclusiones de los hechos que pasan a mi alrededor.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('654179bd-9385-4c8a-a701-c5cddd66689e', 2, 3, NULL, '13 a 15 años', 'Me intereso en leer sobre diferentes temas.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('12686e7d-d6af-4c74-928d-c859d5b883d5', 2, 2, NULL, '11 a 13 años', 'Ayudo en la preparación de los temas que discutimos en mi patrulla.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('e465926e-deed-4341-956f-047f56860e5e', 2, 3, NULL, '11 a 13 años', 'Ayudo en la preparación de los temas que discutimos en mi patrulla.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('0009f64a-0654-46bf-b6fc-7b9d7f278485', 2, 2, NULL, '13 a 15 años', 'Puedo analizar una situación desde distintos puntos de vista.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('3d0dff9b-11cd-4a30-b3a6-ec011ad95062', 2, 3, NULL, '13 a 15 años', 'Puedo analizar una situación desde distintos puntos de vista.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('d287b1bf-76a7-4c41-8ddf-fb5c83a4fa3b', 2, 3, NULL, '13 a 15 años', 'Organizo actividades novedosas para realizar con mi patrulla.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('e0c02bfe-4056-4d1b-b0b1-013bda1fffa6', 2, 2, NULL, '13 a 15 años', 'Organizo actividades novedosas para realizar con mi patrulla.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('d8c45409-4dcd-4629-a764-cdf52e8b9340', 2, 2, NULL, '11 a 13 años', 'Conozco y uso algunas técnicas de campismo y pionerismo.', 'Une los conocimientos teórico y práctico mediante la aplicación constante de sus habilidades técnicas y manuales.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('2a1587b7-9b40-40e1-9113-8ccd928e1464', 2, 3, NULL, '11 a 13 años', 'Conozco y uso algunas técnicas de campismo y pionerismo.', 'Une los conocimientos teórico y práctico mediante la aplicación constante de sus habilidades técnicas y manuales.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('78e8ab9b-5313-4642-8f12-8ca4e94ffa5c', 2, 3, NULL, '13 a 15 años', 'Participo en el diseño e instalación de las construcciones de campamento.', 'Une los conocimientos teórico y práctico mediante la aplicación constante de sus habilidades técnicas y manuales.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('b49b1e68-9cc5-4c76-9cd7-4d6f4c3c1ec6', 2, 2, NULL, '13 a 15 años', 'Participo en el diseño e instalación de las construcciones de campamento.', 'Une los conocimientos teórico y práctico mediante la aplicación constante de sus habilidades técnicas y manuales.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('0757e157-1952-4d0c-9fa9-1d55a8a03431', 2, 3, NULL, '11 a 13 años', 'Elijo y completo una especialidad.', 'Elige su vocación considerando conjuntamente sus aptitudes, posibilidades e intereses; y valora sin prejuicios las opciones de los demás.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('8ff9ffda-2a4a-47b5-b8a6-65f63dcf7dbb', 2, 2, NULL, '11 a 13 años', 'Uso las especialidades que he adquirido para resolver problemas cotidianos.', 'Elige su vocación considerando conjuntamente sus aptitudes, posibilidades e intereses; y valora sin prejuicios las opciones de los demás.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('97eb30cd-0509-4b8e-bb1f-20348779ecf9', 2, 3, NULL, '13 a 15 años', 'Perfecciono mis conocimientos en las especialidades que he elegido.', 'Elige su vocación considerando conjuntamente sus aptitudes, posibilidades e intereses; y valora sin prejuicios las opciones de los demás.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('afb2215a-73bb-4087-9e80-da6af9792b18', 2, 2, NULL, '13 a 15 años', 'Aplico mis especialidades en las actividades de servicio.', 'Elige su vocación considerando conjuntamente sus aptitudes, posibilidades e intereses; y valora sin prejuicios las opciones de los demás.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('39eaf1aa-f703-4fd0-a4b3-b9756dc30539', 2, 3, NULL, '11 a 13 años', 'Participo con entusiasmo en las actividades artísticas de mi Tropa.', 'Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('0d742d23-ebe1-40e6-97df-37bc03edb010', 2, 2, NULL, '11 a 13 años', 'Expreso mis pensamientos y experiencias en el Tally.', 'Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('9758e4f9-728b-4435-a8a3-11fd36c5e3be', 2, 2, NULL, '13 a 15 años', 'Expreso por distintos medios mis intereses y aptitudes artísticas.', 'Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('6e910d1c-7021-49a5-9ece-637f480a1ec7', 2, 3, NULL, '13 a 15 años', 'Expreso por distintos medios mis intereses y aptitudes artísticas.', 'Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('0136350b-c2b2-429f-8feb-2fdc57e29b8b', 2, 3, NULL, '13 a 15 años', 'Me gusta cantar y conozco muchas canciones.', 'Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('bba0a6d4-9f06-4bd8-a550-110ffc397e08', 2, 2, NULL, '13 a 15 años', 'Ayudo a preparar materiales para las representaciones artísticas.', 'Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('e583e70f-7cb5-4071-aedb-536048e68e3d', 2, 3, NULL, '11 a 13 años', 'Puedo identificar las principales partes de un problema.', 'Valora la ciencia y la técnica como medios para comprender y servir al hombre, la sociedad y el mundo.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('27bc66a0-bfba-4e22-9b3e-d1d4fa6112b4', 2, 3, NULL, '13 a 15 años', 'Conozco cómo funcionan los servicios que uso habitualmente, como el teléfono, la electricidad, la radio, la televisión y otros.', 'Valora la ciencia y la técnica como medios para comprender y servir al hombre, la sociedad y el mundo.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('d20cab83-3c15-4bb0-8435-a790e72b6d50', 2, 2, NULL, '13 a 15 años', 'Conozco cómo funcionan los servicios que uso habitualmente, como el teléfono, la electricidad, la radio, la televisión y otros.', 'Valora la ciencia y la técnica como medios para comprender y servir al hombre, la sociedad y el mundo.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('fedb6bcf-2ee2-43f5-96d9-505f78284a6a', 3, 2, NULL, '11 a 13 años', 'Me gusta participar en actividades que me ayudan a conocerme.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('6d5e1f25-c6a0-4c85-9e12-ff78d37b7ea0', 3, 3, NULL, '11 a 13 años', 'Escucho las críticas que me hacen los demás y reflexiono sobre ellas.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('2cc128e0-7cc6-49df-a7c5-825f6ab79793', 3, 2, NULL, '11 a 13 años', 'Sé que puedo ser cada día mejor.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('9ad7086c-b056-4c28-aad6-eedb4a82ce51', 3, 3, NULL, '13 a 15 años', 'Pienso sobre mi manera de ser y trato cada día de mejorar.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('f9656af7-d540-41c1-add1-75bf017c29f7', 3, 2, NULL, '13 a 15 años', 'Pienso sobre mi manera de ser y trato cada día de mejorar.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('fd91a885-6848-443b-87e0-9d2fdbca6a2d', 3, 2, NULL, '13 a 15 años', 'Soy capaz de criticarme.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('78bd48d3-5d26-4218-843a-33712bade630', 3, 3, NULL, '13 a 15 años', 'Sé que soy capaz de hacer cosas y de hacerlas bien.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('bea664e6-8082-4cb1-b207-1c5decb41744', 3, 3, NULL, '11 a 13 años', 'Hago cosas que me ayudan a cumplir mis metas.', 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('7b02b3d7-174b-42c4-93df-886af70707e3', 3, 2, NULL, '11 a 13 años', 'Me ofrezco para ayudar en mi patrulla y en mi casa.', 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('97f596d3-4cd2-45e2-bc4c-3a91070c1765', 3, 2, NULL, '13 a 15 años', 'Me esfuerzo cada vez más en superar mis defectos.', 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('e96adee9-c4e3-42a2-a32d-8c31a3dbf375', 3, 3, NULL, '13 a 15 años', 'Soy constante en mis propósitos.', 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('79d0c199-0ffa-49db-9dfa-4a9867a0caa2', 3, 2, NULL, '13 a 15 años', 'Cumplo las responsabilidades que asumo.', 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('40e83b59-78d1-4ba2-880c-db945817af91', 3, 2, NULL, '13 a 15 años', 'Me esfuerzo por vivir la Ley y la Promesa.', 'Construye su proyecto de vida en base a los valores de la Ley y la Promesa Guía y Scout.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('a8a02119-585a-4d04-852c-fddc9a10e465', 3, 3, NULL, '13 a 15 años', 'Me esfuerzo por vivir la Ley y la Promesa.', 'Construye su proyecto de vida en base a los valores de la Ley y la Promesa Guía y Scout.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('48c41c31-30d5-494e-bd72-5702c6a11419', 3, 2, NULL, '11 a 13 años', 'He prometido esforzarme por vivir la Ley y la Promesa Guía.', 'Construye su proyecto de vida en base a los valores de la Ley y la Promesa Guía y Scout.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('58730385-703d-4410-b7aa-757c2e387e27', 3, 3, NULL, '11 a 13 años', 'Conozco y comprendo la Ley y la Promesa Scout.', 'Construye su proyecto de vida en base a los valores de la Ley y la Promesa Guía y Scout.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('631f013b-4c64-4c61-bd35-b9965f0c5e8e', 3, 3, NULL, '13 a 15 años', 'Comprendo que lo que me piden la Ley y la Promesa Scout es importante para mi vida.', 'Construye su proyecto de vida en base a los valores de la Ley y la Promesa Guía y Scout.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('835ce12d-82cb-471c-a9ed-750d21d7e61e', 3, 3, NULL, '13 a 15 años', 'Contribuyo para que en mi patrulla nos comprometamos con lo que creemos.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('ab3b90f6-309f-463e-bc9b-718049441689', 3, 2, NULL, '13 a 15 años', 'Contribuyo para que en mi patrulla nos comprometamos con lo que creemos.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('9396e4d3-95a1-4772-a3be-ccab9a2f1f78', 3, 2, NULL, '11 a 13 años', 'Enfrento y resuelvo mis dificultades con alegría.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('b93d09e8-cee4-4811-abca-1fade85c266a', 3, 3, NULL, '13 a 15 años', 'Soy alegre.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('97918197-8685-4bd1-bc4c-f5363326a572', 3, 3, NULL, '13 a 15 años', 'Ayudo para que en mi Tropa seamos alegres sin ofender a los demás.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('f2c7b28a-1103-476f-aae4-99907f8502b8', 3, 2, NULL, '13 a 15 años', 'Ayudo para que en mi Compañía seamos alegres sin ofender a las demás.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('f0bd8ba8-8b11-4988-8fb6-ad8e883c2a5b', 3, 3, NULL, '11 a 13 años', 'Respeto las decisiones tomadas en mi patrulla, aun cuando piense distinto.', 'Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('85f8abea-eb57-4f78-9e11-5c2ab5d71044', 3, 2, NULL, '11 a 13 años', 'Respeto las decisiones tomadas en mi patrulla, aun cuando piense distinto.', 'Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('e531fa27-a4f3-46df-b559-1f08e2d03ab3', 3, 2, NULL, '13 a 15 años', 'Opino y asumo responsabilidades en el Consejo de Patrulla.', 'Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('41aec261-3a8f-4f29-9c01-f539fe589fed', 3, 3, NULL, '13 a 15 años', 'Opino y asumo responsabilidades en el Consejo de Patrulla.', 'Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('683c27f6-a692-4869-b22e-63f473395547', 4, 2, NULL, '11 a 13 años', 'Busco apoyo en mi patrulla cuando estoy triste o algo me confunde.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('e2d76e3f-2da7-42ad-901b-797eac8840a8', 4, 3, NULL, '11 a 13 años', 'Busco apoyo en mi patrulla cuando estoy triste o algo me confunde.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('264d7abe-e120-43b2-9884-fade01c7f96e', 4, 2, NULL, '13 a 15 años', 'Sé que es normal que a veces prefiera la soledad, o no me atreva a hacer algo, o sienta inseguridad o rabia; y trato de manejar estos sentimientos.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('61bf9404-4342-4011-b1d7-41d738fec032', 4, 3, NULL, '13 a 15 años', 'Sé que es normal que a veces prefiera la soledad, o no me atreva a hacer algo, o sienta inseguridad o rabia; y trato de manejar estos sentimientos.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('735f4317-b63a-4c4e-924a-85cca98a8593', 4, 2, NULL, '11 a 13 años', 'Soy capaz de decir que no cuando creo que algo es incorrecto.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('34b68e26-4ce0-43e1-b45a-0b41336af495', 4, 3, NULL, '11 a 13 años', 'Soy leal con mis amigos y amigos sin dejar de lado o tratar mal a quienes no lo son.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('a23affa5-6463-41ec-9f51-7f92aa7fdd60', 5, 3, NULL, '13 a 15 años', 'Mantengo una agenda de direcciones útiles.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('672a5da0-8cab-42bb-85dd-0d1f285a1b91', 4, 2, NULL, '13 a 15 años', 'Digo lo que pienso con respeto hacia las demás personas.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('4d7cdda1-0812-474a-b381-52e3e7b7d85b', 4, 3, NULL, '13 a 15 años', 'Mantengo mi opinión cuando estoy convencido que es correcta.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('3693aeed-e3ad-4ac9-878c-5874b61dc8d3', 4, 3, NULL, '13 a 15 años', 'Aprecio a mis amigos y amigos y no me enojo con ellos por cosas cualquier cosa.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('0be7336d-2934-49dd-95c1-3d881a510463', 4, 2, NULL, '13 a 15 años', 'Aprecio a mis amigos y amigas y no me enojo con ellos por cosas cualquier cosa.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('70177516-c52f-4e19-8c59-32375c40eaac', 4, 3, NULL, '11 a 13 años', 'Me intereso por los demás personas y soy generoso.', 'Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('8c9ae799-9f9c-4194-89c5-3c5c8e934565', 4, 2, NULL, '13 a 15 años', 'Entiendo la importancia del amor en mi vida.', 'Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('f56cdf5e-7f65-4b11-9eed-c5065499c723', 4, 2, NULL, '13 a 15 años', 'Comparto con los demás, sin vergüenza ni burla, lo que sé sobre sexualidad del hombre y de la mujer.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('4f07f03b-46ab-4dba-b0c7-3faa33cf3a72', 4, 3, NULL, '11 a 13 años', 'Le cuento a mi familia lo que hacemos en los scouts y trato que ellos participen en las actividades.', 'Reconoce el matrimonio y la familia como base de la sociedad, convirtiendo la suya en una comunidad de amor conyugal, filial y fraterno.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('a55b8cc7-5752-4f78-bd08-5d4ede63a3c0', 4, 2, NULL, '11 a 13 años', 'Le cuento a mi familia lo que hacemos en las guías y trato que ellos participen en las actividades.', 'Reconoce el matrimonio y la familia como base de la sociedad, convirtiendo la suya en una comunidad de amor conyugal, filial y fraterno.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('0592c035-8c25-4e7d-b569-1c4644ab304f', 4, 2, NULL, '13 a 15 años', 'Soy cariñosa con mi familia y acepto las decisiones que se toman en mi casa.', 'Reconoce el matrimonio y la familia como base de la sociedad, convirtiendo la suya en una comunidad de amor conyugal, filial y fraterno.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('e511f096-2f45-49f9-b025-44b6f52e17f6', 4, 3, NULL, '13 a 15 años', 'Estoy siempre dispuesto a ayudar a mis hermanos y hermanas.', 'Reconoce el matrimonio y la familia como base de la sociedad, convirtiendo la suya en una comunidad de amor conyugal, filial y fraterno.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('76e49cc6-a230-4809-b063-4d34890e5724', 4, 2, NULL, '13 a 15 años', 'Estoy siempre dispuesta a ayudar a mis hermanos y hermanas.', 'Reconoce el matrimonio y la familia como base de la sociedad, convirtiendo la suya en una comunidad de amor conyugal, filial y fraterno.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('9478b46f-6f74-4a7e-bf9c-d66caaba1381', 5, 2, NULL, '11 a 13 años', 'Cumplo los compromisos que asumo.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('5ff08326-49d9-4f83-8ffd-9b4b83425a95', 5, 3, NULL, '11 a 13 años', 'Cumplo los compromisos que asumo.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('9e3ce0d2-2b56-4d1e-9135-029cfaaa0e6b', 5, 3, NULL, '13 a 15 años', 'Respeto a todas las personas, independientemente de sus ideas, su clase social y su forma de vida.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('ea86ecee-b201-4a49-be9d-4e55de7ffe8c', 5, 2, NULL, '13 a 15 años', 'Respeto a todas las personas, independientemente de sus ideas, su clase social y su forma de vida.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('8bb5d75e-3033-4f5a-a1a5-d2f09b50ce25', 5, 2, NULL, '13 a 15 años', 'Ayudo a mi patrulla en los compromisos que tomamos.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('234b7941-49cb-4656-8080-d30b65cf0029', 5, 3, NULL, '13 a 15 años', 'No me gusta cuando no se respetan los derechos humanos y lo digo.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('80b09c0c-3389-4fed-aaa8-ee1fc2ae8bf2', 5, 2, NULL, '13 a 15 años', 'Participo en actividades relacionadas con los derechos de las personas.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('813203a3-5467-4dad-9e4d-951d115556c2', 5, 2, NULL, '13 a 15 años', 'Considero las opiniones de las demás personas cuando tengo que tomar decisiones que las afectan.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('86784e96-688b-45d1-897f-d31527a51134', 5, 3, NULL, '13 a 15 años', 'Considero las opiniones de los demás personas cuando tengo que tomar decisiones que las afectan.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('dc2d07ac-ee5a-45b5-84d1-098e77012347', 5, 3, NULL, '13 a 15 años', 'Opino con respeto sobre las personas que ejercen autoridad.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('cf246b8f-61bc-48f4-9310-0ce3967a5860', 5, 2, NULL, '13 a 15 años', 'Opino con respeto sobre las personas que ejercen autoridad.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('c6ec1a8c-37fb-441c-860c-755143523afe', 5, 3, NULL, '11 a 13 años', 'Trabajo con los demás personas para lograr las metas que nos hemos propuesto.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('d737dfda-2d8d-4ca8-b650-8612d90b434e', 5, 2, NULL, '11 a 13 años', 'Trabajo con las demás personas para lograr las metas que nos hemos propuesto.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('c7115070-c44f-4b79-94db-b8fe8dcbe44d', 5, 2, NULL, '11 a 13 años', 'Entiendo cuáles son mis responsabilidades cuando tengo un cargo.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('a1d57e25-0012-41f5-bbff-05c5845dfb0f', 5, 3, NULL, '11 a 13 años', 'Entiendo cuáles son mis responsabilidades cuando tengo un cargo.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('a594a460-1ab9-4c09-b01a-c2555163e86e', 5, 3, NULL, '13 a 15 años', 'Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.', 'Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('047150a7-8af8-4ecf-9495-b371dda0e598', 5, 2, NULL, '11 a 13 años', 'Sé qué hacen los bomberos, la policía, los hospitales, el municipio y otros servicios públicos de mi comunidad.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('0d3b6b51-07ed-4d62-ba46-e68bab986e57', 5, 3, NULL, '11 a 13 años', 'Participo en las actividades de servicio que organiza mi patrulla.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('e6645d74-6f5c-4151-b036-d52b621a101f', 5, 2, NULL, '11 a 13 años', 'Participo en las actividades de servicio que organiza mi patrulla.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('b98c1bb4-08e3-4310-bda4-793552993138', 5, 2, NULL, '13 a 15 años', 'Realizo una buena acción cada día.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('02b90ae6-edbc-4221-a9ec-4ac50d8b8b30', 5, 3, NULL, '13 a 15 años', 'Propongo actividades de servicio de mi patrulla y Tropa y colaboro en su organización.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('b8c315db-582b-49f2-92f9-44c489813986', 5, 2, NULL, '13 a 15 años', 'Me gusta participar en actividades que ayudan a superar las diferencias sociales.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('ce61d539-018b-4f09-a53d-957a1a9d50ec', 5, 3, NULL, '13 a 15 años', 'Conozco las diferentes posiciones políticas que hay en mi país.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('4dcd5192-7990-43df-aee2-517dde3fc548', 5, 3, NULL, '11 a 13 años', 'Me gusta sentirme parte de la cultura de mi país.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('482b9b0f-88a3-41ba-b5d7-abffa0eee808', 5, 3, NULL, '13 a 15 años', 'Conozco la geografía de mi país y su influencia en nuestra cultura.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('66ae3385-8256-4450-a1fa-861ee5eaddd7', 5, 2, NULL, '13 a 15 años', 'Aprecio la cultura de mi país y me identifico con ella.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('e75ca4e5-7124-44f1-9243-e399b7885856', 5, 3, NULL, '11 a 13 años', 'Conozco los principales símbolos, tanto del Movimiento Guía como del Movimiento Scout.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('d335c612-4228-482b-af22-28c33f889e01', 5, 2, NULL, '11 a 13 años', 'Conozco los principales símbolos, tanto del Movimiento Guía como del Movimiento Scout.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('b3b7d5f7-54cd-4b3c-8016-2138bb409d59', 5, 3, NULL, '11 a 13 años', 'Conozco las principales culturas originarias de América.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('e0dfc43c-5ec4-4c4d-a4c5-27325f947fbf', 5, 2, NULL, '11 a 13 años', 'Conozco las principales culturas originarias de América.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('1d2a2643-ce30-4838-b0d3-3252c0857006', 5, 2, NULL, '13 a 15 años', 'Conozco el Movimiento Guía y Scout de mi país.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('3226db8e-8203-44b8-94f6-542c0a820eb7', 5, 3, NULL, '13 a 15 años', 'Conozco el Movimiento Guía y Scout de mi país.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('2f6656bb-3e43-4d77-93b8-b1e7f66f2b46', 5, 3, NULL, '13 a 15 años', 'Me intereso en conocer en detalle una cultura originaria de América.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('8edcfb3c-29b9-4559-ba0c-2565e4d186f3', 5, 2, NULL, '13 a 15 años', 'Me intereso en conocer en detalle una cultura originaria de América.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('658630b7-58fa-4ea9-8285-35ded35e3688', 5, 2, NULL, '11 a 13 años', 'Conozco los diferentes ecosistemas de mi país.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('39a993cd-7703-4757-8782-4f39d5e0dda2', 5, 3, NULL, '11 a 13 años', 'Conozco los diferentes ecosistemas de mi país.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('8fb20cc7-537c-48c3-95dc-f1e836d576a2', 5, 3, NULL, '13 a 15 años', 'Aplico técnicas que me permiten mejorar el medioambiente y no dañar los lugares en que acampo.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('6f041425-5479-45ee-9855-3c02fc79525a', 5, 2, NULL, '13 a 15 años', 'Aplico técnicas que me permiten mejorar el medioambiente y no dañar los lugares en que acampo.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('bb7fb904-59e9-406c-a732-ff9805dc243c', 5, 3, NULL, '11 a 13 años', 'He participado con mi patrulla en la mantención de un huerto productivo u otro proyecto similar.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('a34ccaa1-751c-43eb-adac-d837fa3e739c', 5, 2, NULL, '13 a 15 años', 'Sé cuáles son los principales problemas ambientales de mi país.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('0756d867-587c-4476-a14a-5fcc2746871c', 6, 3, NULL, '11 a 13 años', 'Reflexiono con mi patrulla cuando hacemos excursiones o campamentos.', 'Busca siempre a Dios en forma personal y comunitaria, aprendiendo a reconocerlo en las personas y en la Creación.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('8d4dc6a3-8e3a-45c5-b440-6cf075c44e82', 6, 2, NULL, '11 a 13 años', 'Escucho a las demás y aprendo de ellas.', 'Busca siempre a Dios en forma personal y comunitaria, aprendiendo a reconocerlo en las personas y en la Creación.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('1bb4e791-ecb7-41bd-b158-6505868e7625', 6, 3, NULL, '13 a 15 años', 'Preparo y conduzco algunas de las actividades que nos ayudan a descubrir a Dios en la naturaleza.', 'Busca siempre a Dios en forma personal y comunitaria, aprendiendo a reconocerlo en las personas y en la Creación.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('a533450a-b017-427b-9e4e-9910f097a9b9', 6, 2, NULL, '13 a 15 años', 'Procuro que en mi patrulla nos escuchemos y aprendamos unas de otras.', 'Busca siempre a Dios en forma personal y comunitaria, aprendiendo a reconocerlo en las personas y en la Creación.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('dc14baf9-c7f5-4567-b2cf-fd3a332ea1fd', 6, 2, NULL, '11 a 13 años', 'Soy constante en los compromisos que he asumido con mi religión.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('33ce5714-b473-4993-85e1-51d651c20ca4', 6, 3, NULL, '11 a 13 años', 'Soy constante en los compromisos que he asumido con mi religión.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('4173a06d-fe09-43c6-9b6c-bb9a8147b549', 6, 2, NULL, '13 a 15 años', 'Leo los libros sagrados de mi fe y converso con adultos que me ayudan a conocerla mejor.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('399993d9-4256-4aad-a807-57ef7b82424c', 6, 3, NULL, '13 a 15 años', 'Leo los libros sagrados de mi fe y converso con adultos que me ayudan a conocerla mejor.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('6f8f9872-ac14-4db2-b5bc-867b9a3111b6', 6, 3, NULL, '13 a 15 años', 'Comparto con mi patrulla reflexiones de los textos sagrados de mi fe.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('a33faaeb-1751-47b1-a88c-e51bd570ab2e', 6, 2, NULL, '13 a 15 años', 'Comparto con mi patrulla reflexiones de los textos sagrados de mi fe.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('1bb11e2a-9426-41b5-aec9-c81e29660345', 6, 3, NULL, '11 a 13 años', 'Siempre encuentro en lo que hago razones para pedir y dar gracias a Dios.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('79ba7900-442d-4c61-b7f9-38235f0ed346', 6, 2, NULL, '11 a 13 años', 'Rezo habitualmente con mi patrulla.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('6157a80b-5d3e-4394-9f1f-c288e9e2fce7', 6, 3, NULL, '13 a 15 años', 'Entiendo la oración como una manera de conversar con Dios.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('a8f951da-9ffb-49a8-b544-34f00653cace', 6, 2, NULL, '13 a 15 años', 'Rezo para conversar con Dios y alabarlo, darle gracias, ofrecerle lo que hago y pedirle por las cosas que me pasan.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('fa3124fb-f9f1-4124-b4f4-dcb1f860a710', 6, 3, NULL, '13 a 15 años', 'Organizo y comparto momentos de oración con mi patrulla y mi familia.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('0d821713-1464-4775-8233-887619e08bd7', 6, 2, NULL, '11 a 13 años', 'Trato de vivir las enseñanzas de mi fe en todo lo que hago.', 'Integra sus principios religiosos a su conducta cotidiana, estableciendo coherencia entre su fe, su vida personal y su participación social.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('126c3a79-10bb-427b-a38f-6b724fe94d36', 6, 3, NULL, '11 a 13 años', 'Entiendo por qué mi fe me pide que ayude a los demás.', 'Integra sus principios religiosos a su conducta cotidiana, estableciendo coherencia entre su fe, su vida personal y su participación social.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('0618f6f9-5112-484b-bc74-7398c2bde639', 6, 2, NULL, '13 a 15 años', 'Me siento feliz cuando los demás ven en mí a una persona que vive de acuerdo a su fe.', 'Integra sus principios religiosos a su conducta cotidiana, estableciendo coherencia entre su fe, su vida personal y su participación social.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('f0f037eb-608e-4008-a769-7eb2d5a23bf6', 6, 3, NULL, '13 a 15 años', 'Invito a mi patrulla a cooperar con las acciones que mi comunidad religiosa hace por los demás.', 'Integra sus principios religiosos a su conducta cotidiana, estableciendo coherencia entre su fe, su vida personal y su participación social.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('aa58c465-354f-4fbc-835c-c625ac4d9a35', 6, 2, NULL, '11 a 13 años', 'Comparto con todas las personas, sean o no de mi religión.', 'Dialoga con todas las personas cualquiera sea su opción religiosa, buscando establecer vínculos de comunión entre los hombres.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('1d155740-4327-4685-a7de-c6b43b0a417a', 6, 2, NULL, '11 a 13 años', 'Sé cuáles son las principales religiones que hay en mi país.', 'Dialoga con todas las personas cualquiera sea su opción religiosa, buscando establecer vínculos de comunión entre los hombres.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('3fd0332e-1444-4895-ad2f-52ac3f82bb79', 6, 3, NULL, '11 a 13 años', 'Sé cuáles son las principales religiones que hay en mi país.', 'Dialoga con todas las personas cualquiera sea su opción religiosa, buscando establecer vínculos de comunión entre los hombres.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('e193cc0c-9ffa-4e5d-a1d0-f824b9156a1a', 6, 2, NULL, '13 a 15 años', 'Trato que en mi patrulla se respeten las opciones religiosas de las personas.', 'Dialoga con todas las personas cualquiera sea su opción religiosa, buscando establecer vínculos de comunión entre los hombres.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('c89084eb-1316-4deb-914c-b81c674d801f', 6, 3, NULL, '13 a 15 años', 'Me interesa conocer otros religiones.', 'Dialoga con todas las personas cualquiera sea su opción religiosa, buscando establecer vínculos de comunión entre los hombres.', '2026-06-11 07:28:06.516942+00');
INSERT INTO public.progresion_objetivos VALUES ('82b768fb-1abc-4692-90b7-0f8b24b98d56', 6, 2, NULL, '13 a 15 años', 'Actúo con respeto frente a las ideas, celebraciones y actividades de otras religiones.', 'Dialoga con todas las personas cualquiera sea su opción religiosa, buscando establecer vínculos de comunión entre los hombres.', '2026-06-11 07:28:03.665841+00');
INSERT INTO public.progresion_objetivos VALUES ('e1c20419-a6d0-48b2-91e8-20a96d2b11c3', 1, 4, NULL, '15 a 17 años', 'Mantengo buen estado físico', 'Asume la parte de responsabilidad que le corresponde en el desarrollo armónico de su cuerpo.', '2026-06-16 05:45:05.324571+00');
INSERT INTO public.progresion_objetivos VALUES ('da923c85-6669-4e29-a6a3-fb893a11b85f', 1, 4, NULL, '15 a 17 años', 'Comprendo las diferencias físicas y psicológicas entre las personas y establezco relaciones de igualdad y respeto.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('a40889c7-cacc-4772-9ce5-4e1fd65f077b', 1, 4, NULL, '15 a 17 años', 'Reflexiono sobre mi comportamiento y me esfuerzo por gobernarlo.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('e6ae4bba-4f41-45b5-b292-5da4e256eb56', 1, 4, NULL, '15 a 17 años', 'Asumo responsabilidades para mantener mi hogar ordenado y limpio.', 'Valora su aspecto y cuida su higiene personal y la de su entorno.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('64ce0e85-129f-4508-8485-8d370799fd61', 1, 4, NULL, '15 a 17 años', 'Valoro mi tiempo y lo distribuyo de manera equilibrada entre mis diferentes actividades.', 'Administra su tiempo equilibradamente entre sus diversas obligaciones, practicando formas apropiadas de descanso.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('bcabf6c9-087a-422b-bb4c-eea11313aaff', 1, 4, NULL, '15 a 17 años', 'Acampo continuamente y lo hago en buenas condiciones técnicas.', 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('3f40b58d-07d2-4e51-8af4-e77fac7fa655', 2, 4, NULL, '15 a 17 años', 'Progresivamente investigo y aprendo sobre los temas que me interesan.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('93cf0a2b-1fe0-45e2-b3d2-89828f64a016', 2, 4, NULL, '15 a 17 años', 'Me formo una opinión personal a partir de los libros que leo y de los documentos e informaciones que conozco por distintos medios.', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('24294fc7-bfde-4283-938e-0d16c5ce6313', 2, 4, NULL, '15 a 17 años', 'Reflexiono y discuto con mi Comunidad y propongo acciones para realizar en conjunto.', 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('fe57c89e-be7b-46a1-b370-64df400355fa', 2, 4, NULL, '15 a 17 años', 'Trato de aprender más sobre cuestiones técnicas relacionadas con el sonido, la imagen, la mecánica, la informática y otros.', 'Une los conocimientos teórico y práctico mediante la aplicación constante de sus habilidades técnicas y manuales.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('396c5f51-f186-45da-b869-47477299f5cf', 2, 4, NULL, '15 a 17 años', 'Busco mi vocación teniendo en cuenta mis habilidades, lo que me gustaría hacer y las posibilidades que me ofrece el ambiente en que me desarrollo.', 'Elige su vocación considerando conjuntamente sus aptitudes, posibilidades e intereses; y valora sin prejuicios las opciones de los demás.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('c946e215-48ab-4348-9479-932bc68b42e7', 2, 4, NULL, '15 a 17 años', 'Elijo entre las distintas actividades artísticas y culturales que llaman mi atención.', 'Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('ed17d59c-1c64-4080-a206-bbe72eeae5a4', 2, 4, NULL, '15 a 17 años', 'Trato de expresarme de un modo propio, y soy capaz de mirar críticamente tendencias e ídolos sociales.', 'Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('93c826b9-9933-41cf-9074-10d0d40a5714', 2, 4, NULL, '15 a 17 años', 'He participado en proyectos que aplican tecnología innovadora.', 'Valora la ciencia y la técnica como medios para comprender y servir al hombre, la sociedad y el mundo.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('33d5c450-baaa-40c2-bdde-6b354868cabd', 3, 4, NULL, '15 a 17 años', 'Conozco mis capacidades y limitaciones y puedo proyectarlas para mi vida adulta.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('4bfc99e3-ba0c-4986-bfb5-5cb4f0651593', 3, 4, NULL, '15 a 17 años', 'Sé que soy capaz de lograr las cosas que me he propuesto.', 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('30edb315-be9c-4e06-b44b-eb3914d4bc98', 3, 4, NULL, '15 a 17 años', 'Evalúo mis resultados.', 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('cd69934e-f0e0-47b7-b0eb-447884b615c6', 3, 4, NULL, '15 a 17 años', 'Renuevo mi compromiso con el Movimiento.', 'Construye su proyecto de vida en base a los valores de la Ley y la Promesa Guía y Scout.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('ebb5f0fb-8f13-4b7b-8cde-fd47bfe349ba', 3, 4, NULL, '15 a 17 años', 'Trato de actuar de acuerdo a mis valores en todas las cosas que hago.', 'Actúa consecuentemente con los valores que lo inspiran.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('4f4ccb0f-8cae-45b8-8053-590cfe974015', 3, 4, NULL, '15 a 17 años', 'Soy alegre y optimista en todos los ambientes donde participo.', 'Enfrenta la vida con alegría y sentido del humor.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('db877208-738b-4e2e-bcbc-591331f75703', 3, 4, NULL, '15 a 17 años', 'Reconozco en mi Avanzada una comunidad de vida y acepto las críticas y recomendaciones que mis compañeros y compañeras me hacen.', 'Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('84988974-0afa-4fa1-9abc-8923a0d53451', 4, 4, NULL, '15 a 17 años', 'Manejo cada vez mejor mis emociones y sentimientos y trato de mantener un estado de ánimo estable.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('4a2eef1b-1971-4b0b-ac6a-f4f653988403', 4, 4, NULL, '15 a 17 años', 'Acepto que a veces las cosas no suceden de la forma en que las había programado; y mantengo mi buen ánimo cuando esto ocurre.', 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('d24ef58c-8306-4065-9625-8f5e663febcb', 4, 4, NULL, '15 a 17 años', 'Tengo buenos amigos y amigas y me esfuerzo por hacer crecer nuestra amistad.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('78cf9951-82fc-434d-b399-aba3c7439f0f', 4, 4, NULL, '15 a 17 años', 'Me intereso en las cosas porque creo que son importantes o justas, y no porque quiera obtener algún beneficio a cambio.', 'Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('354916e1-0b89-46f1-9a3b-5331c539a6f7', 4, 4, NULL, '15 a 17 años', 'Mis relaciones afectivas son testimonio de amor y responsabilidad.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('f2e77c12-e433-48c0-96a4-ab06745cec2b', 4, 4, NULL, '15 a 17 años', 'Participo en actividades destinadas a obtener igualdad de derechos y oportunidades para las personas.', 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('09b634da-f057-49c8-8a56-0f66f4455014', 4, 4, NULL, '15 a 17 años', 'Mantengo con mis padres una relación en la que consideran mis discrepancias, confían en mí y me ayudan a obtener autonomía, respetando también los límites que hemos acordado.', 'Reconoce el matrimonio y la familia como base de la sociedad, convirtiendo la suya en una comunidad de amor conyugal, filial y fraterno.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('007591fb-a2b6-4fb5-9286-acde65455f53', 5, 4, NULL, '15 a 17 años', 'Creo que todas las personas somos iguales en dignidad y eso marca mis relaciones con los demás.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('97b83994-e34f-4a8d-89b5-9899995b3a04', 5, 4, NULL, '15 a 17 años', 'Asumo una posición activa frente a los atropellos a las personas que observo en mi vida cotidiana.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('db847997-0666-4704-98b6-9b2c77b20726', 5, 4, NULL, '15 a 17 años', 'Acepto las decisiones de mis padres y les expreso con respeto mis diferencias.', 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('3fd19eb4-737c-43c5-9ea8-5e5307ce0309', 5, 4, NULL, '15 a 17 años', 'Comprendo que las normas sociales permiten el desarrollo de mi libertad respetando la libertad de los demás.', 'Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('5d43ab14-8bc5-4188-b966-c7229ad236d8', 5, 4, NULL, '15 a 17 años', 'Conozco las principales organizaciones sociales y de servicio de mi comunidad local en las que puedo ayudar.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('6ad49405-62ca-4a55-9d9e-78f1a48337d7', 5, 4, NULL, '15 a 17 años', 'Participo activamente en las campañas de servicio y desarrollo de la comunidad que organiza mi Grupo o mi Asociación.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('3582b3bd-17bf-4262-a60b-6bd2e534e111', 5, 4, NULL, '15 a 17 años', 'Me comprometo por distintos medios con la superación de las diferencias sociales.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('9e05cede-e22e-47db-88db-b10dd77cb9ec', 5, 4, NULL, '15 a 17 años', 'Conozco historias, leyendas, danzas, canciones, mitos, artesanías y otras expresiones de la herencia artística de mi cultura.', 'Hace suyos los valores de su país, su pueblo y su cultura.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('83c0d653-beae-44c5-b76d-577e2d18920a', 5, 4, NULL, '15 a 17 años', 'Participo, en la medida de lo posible, en eventos internacionales o nacionales en que puedo conocer a guías y scouts de otros países.', 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('7e7417a5-a16e-4ff3-843f-93e711d017d4', 5, 4, NULL, '15 a 17 años', 'Aplico en campamentos o proyectos específicos tecnologías que preservan o mejoran el medio ambiente.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('d744cb60-173d-427e-ba5e-94f1ac492cb0', 5, 4, NULL, '15 a 17 años', 'Puedo fundamentar mis opiniones sobre los problemas que considero más urgentes en la conservación del medio ambiente de mi comunidad local.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('7c141a8b-fa19-4433-8c2e-ac60b4b569f6', 6, 4, NULL, '15 a 17 años', 'Profundizo cada vez más el conocimiento de mi religión y mi compromiso con ella.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('ad483fdf-fc5a-4bf2-8db5-64f07e4bb1d0', 6, 4, NULL, '15 a 17 años', 'Colaboro en las actividades de mi comunidad religiosa.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('7736016c-05b9-48ab-b4d1-45862b42b0d5', 6, 4, NULL, '15 a 17 años', 'Mantengo diariamente momentos de silencio, reflexión y oración personal.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('0f3aae44-a26a-4598-bc2b-b7213836c887', 6, 4, NULL, '15 a 17 años', 'Preparo oraciones para diferentes momentos de la vida de mi Comunidad, mi Avanzada, mi Grupo y mi familia.', 'Practica la oración personal y comunitaria, como expresión del amor a Dios y como un medio de relacionarse con Él.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('a75d6b49-73f9-4b6a-905e-4bc436a3e531', 6, 4, NULL, '15 a 17 años', 'Promuevo en mi equipo y en mi Avanzada la realización de proyectos sociales en que se manifiesten nuestras opciones religiosas.', 'Integra sus principios religiosos a su conducta cotidiana, estableciendo coherencia entre su fe, su vida personal y su participación social.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('4027c134-0497-4992-9ee8-520c184d4780', 6, 4, NULL, '15 a 17 años', 'Desarrollo una actitud crítica frente a manifestaciones espirituales contrarias a los valores del Movimiento.', 'Dialoga con todas las personas cualquiera sea su opción religiosa, buscando establecer vínculos de comunión entre los hombres.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('9d8726d7-0973-4444-84eb-3a4d792dac52', 6, 4, NULL, '15 a 17 años', 'Participo en actividades que me permiten dialogar con jóvenes de otras religiones.', 'Dialoga con todas las personas cualquiera sea su opción religiosa, buscando establecer vínculos de comunión entre los hombres.', '2026-06-11 07:28:12.198009+00');
INSERT INTO public.progresion_objetivos VALUES ('69fff91f-a493-483d-92d6-8319700236c2', 1, 5, NULL, '17 a 20 años', 'Conozco los procesos biológicos que regulan mi organismo, protejo mi salud, acepto mis posibilidades físicas y oriento mis impulsos y fuerzas.', 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('30e41a98-a04a-459f-a64c-c4fc4f15f77d', 2, 5, NULL, '17 a 20 años', 'Incremento continuamente mis conocimientos mediante la autoformación y el aprendizaje sistemático', 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('29eee8b1-a414-4df9-90e1-520a384fb9aa', 2, 5, NULL, '17 a 20 años', 'Uno los conocimientos teórico y práctico mediante la aplicación constante de mis habilidades técnicas y manuales.', 'Une los conocimientos teórico y práctico mediante la aplicación constante de sus habilidades técnicas y manuales.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('91e60eba-e267-4d1a-b27b-ef61a7b03b31', 2, 5, NULL, '17 a 20 años', 'Expreso lo que pienso y siento a través de distintos medios, creando en los ambientes en que actúo espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.', 'Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('0bdf2252-6db5-41f9-8bc7-87e4da3ee602', 3, 5, NULL, '17 a 20 años', 'Construyo mi proyecto de vida en base a los valores de la Ley y la Promesa.', 'Construye su proyecto de vida en base a los valores de la Ley y la Promesa Guía y Scout.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('8df0eaed-f805-4347-881d-3d5fac18c8a5', 3, 5, NULL, '17 a 20 años', 'Reconozco en mi grupo de pertenencia un apoyo para mi crecimiento personal y para la realización de mi proyecto de vida.', 'Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('d0ba748f-313b-4ffe-b2a3-fb21c1f8943f', 4, 5, NULL, '17 a 20 años', 'Practico una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('39de3f68-3477-4c1f-8a29-170e914596d7', 4, 5, NULL, '17 a 20 años', 'Construyo mi felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.', 'Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('b5a81328-5c07-41bd-a1ea-1ed401762841', 5, 5, NULL, '17 a 20 años', 'Vivo mi libertad de un modo solidario, ejerciendo mis derechos, cumpliendo mis obligaciones y defendiendo igual derecho para los demás.', 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('f47192a7-6d68-4a3a-9847-8d1c29f7ba49', 5, 5, NULL, '17 a 20 años', 'Sirvo activamente en mi comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('c4f78e61-6790-4cf4-b477-993900b5bf02', 5, 5, NULL, '17 a 20 años', 'Contribuyo a preservar la vida a través de la conservación de la integridad del mundo natural.', 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('1c28f12c-5f38-4609-b095-215c54ec707d', 6, 5, NULL, '17 a 20 años', 'Adhiero a principios espirituales, soy fiel a la religión que los expresa y acepto los deberes que de ello se desprenden.', 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.', '2026-06-11 07:28:15.095701+00');
INSERT INTO public.progresion_objetivos VALUES ('ed57439e-1d13-4cb2-ae32-ddd3978d33bd', 6, 5, NULL, '17 a 20 años', 'Integro mis principios religiosos a mi conducta cotidiana, estableciendo coherencia entre mi fe, mi vida personal y mi participación social.', 'Integra sus principios religiosos a su conducta cotidiana, estableciendo coherencia entre su fe, su vida personal y su participación social.', '2026-06-11 07:28:15.095701+00');


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.roles VALUES (1, 'admin');
INSERT INTO public.roles VALUES (2, 'dirigente');
INSERT INTO public.roles VALUES (3, 'guiadora');
INSERT INTO public.roles VALUES (4, 'presidente');
INSERT INTO public.roles VALUES (5, 'tesorera');
INSERT INTO public.roles VALUES (6, 'secretario');
INSERT INTO public.roles VALUES (7, 'representante');
INSERT INTO public.roles VALUES (8, 'apoderado');
INSERT INTO public.roles VALUES (9, 'lobato (a)');
INSERT INTO public.roles VALUES (10, 'guia');
INSERT INTO public.roles VALUES (11, 'scout');
INSERT INTO public.roles VALUES (12, 'pionera (o)');
INSERT INTO public.roles VALUES (13, 'caminante');
INSERT INTO public.roles VALUES (14, 'Sin Rol');


--
-- Data for Name: tesoreria_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tesoreria_items VALUES (11, 'I-1.1', 'Cuotas de registro', 'Ingreso', '1. INGRESOS');
INSERT INTO public.tesoreria_items VALUES (12, 'I-1.2', 'Cuotas anuales ordinarias', 'Ingreso', '1. INGRESOS');
INSERT INTO public.tesoreria_items VALUES (13, 'I-1.3', 'Aportes de la Institución Patrocinante', 'Ingreso', '1. INGRESOS');
INSERT INTO public.tesoreria_items VALUES (14, 'I-1.4', 'Otros Ingresos (no contemplados)', 'Ingreso', '1. INGRESOS');
INSERT INTO public.tesoreria_items VALUES (15, 'I-2.1', 'Cuotas de Campamento', 'Ingreso', '2. PROGRAMA');
INSERT INTO public.tesoreria_items VALUES (16, 'I-2.2', 'Cuotas de salidas', 'Ingreso', '2. PROGRAMA');
INSERT INTO public.tesoreria_items VALUES (17, 'I-2.3', 'Cuotas por actividades distritales', 'Ingreso', '2. PROGRAMA');
INSERT INTO public.tesoreria_items VALUES (18, 'I-2.4', 'Cuotas por actividades zonales', 'Ingreso', '2. PROGRAMA');
INSERT INTO public.tesoreria_items VALUES (19, 'I-2.5', 'Cuotas por actividades nacionales', 'Ingreso', '2. PROGRAMA');
INSERT INTO public.tesoreria_items VALUES (20, 'I-2.6', 'Materiales de Programa (Venta)', 'Ingreso', '2. PROGRAMA');
INSERT INTO public.tesoreria_items VALUES (21, 'I-2.7', 'Ingresos por otras actividades', 'Ingreso', '2. PROGRAMA');
INSERT INTO public.tesoreria_items VALUES (22, 'I-3.1', 'Ingresos de campañas de la Asociación', 'Ingreso', '3. PROYECTOS');
INSERT INTO public.tesoreria_items VALUES (23, 'I-3.2', 'Ingresos de campañas del Comité de Grupo', 'Ingreso', '3. PROYECTOS');
INSERT INTO public.tesoreria_items VALUES (24, 'I-3.3', 'Ingresos de campañas de las Unidades', 'Ingreso', '3. PROYECTOS');
INSERT INTO public.tesoreria_items VALUES (25, 'I-3.4', 'Subvenciones Municipales', 'Ingreso', '3. PROYECTOS');
INSERT INTO public.tesoreria_items VALUES (26, 'I-3.5', 'Subvenciones de Empresas', 'Ingreso', '3. PROYECTOS');
INSERT INTO public.tesoreria_items VALUES (27, 'I-3.6', 'Subvenciones de particulares', 'Ingreso', '3. PROYECTOS');
INSERT INTO public.tesoreria_items VALUES (28, 'I-3.7', 'Otros Aportes (campañas/subvenciones)', 'Ingreso', '3. PROYECTOS');
INSERT INTO public.tesoreria_items VALUES (29, 'I-4.1', 'Cuotas de formación dirigentes', 'Ingreso', '4. VOLUNTARIADO');
INSERT INTO public.tesoreria_items VALUES (30, 'I-4.2', 'Cuotas participación otros cursos', 'Ingreso', '4. VOLUNTARIADO');
INSERT INTO public.tesoreria_items VALUES (31, 'I-5.1', 'Saldo del año anterior', 'Ingreso', '5. OTROS');
INSERT INTO public.tesoreria_items VALUES (32, 'E-1.1', 'Servicios Básicos (Luz, Agua, Teléfono)', 'Egreso', '1. ADMINISTRACIÓN');
INSERT INTO public.tesoreria_items VALUES (33, 'E-1.2', 'Aseo (Insumos sede)', 'Egreso', '1. ADMINISTRACIÓN');
INSERT INTO public.tesoreria_items VALUES (34, 'E-1.3', 'Movilización (Pasajes/Combustible)', 'Egreso', '1. ADMINISTRACIÓN');
INSERT INTO public.tesoreria_items VALUES (35, 'E-1.4', 'Artículos y materiales de oficina', 'Egreso', '1. ADMINISTRACIÓN');
INSERT INTO public.tesoreria_items VALUES (36, 'E-1.5', 'Artículos y materiales de oficina (Manuales)', 'Egreso', '1. ADMINISTRACIÓN');
INSERT INTO public.tesoreria_items VALUES (37, 'E-1.6', 'Gastos de uso de la sede del Grupo', 'Egreso', '1. ADMINISTRACIÓN');
INSERT INTO public.tesoreria_items VALUES (38, 'E-1.7', 'Despacho y correspondencia', 'Egreso', '1. ADMINISTRACIÓN');
INSERT INTO public.tesoreria_items VALUES (39, 'E-1.8', 'Reuniones de trabajo', 'Egreso', '1. ADMINISTRACIÓN');
INSERT INTO public.tesoreria_items VALUES (40, 'E-1.9', 'Gastos de representación del Grupo', 'Egreso', '1. ADMINISTRACIÓN');
INSERT INTO public.tesoreria_items VALUES (41, 'E-1.10', 'Gastos por cuota anual en la Asociación', 'Egreso', '1. ADMINISTRACIÓN');
INSERT INTO public.tesoreria_items VALUES (42, 'E-1.11', 'Otros Gastos Administración', 'Egreso', '1. ADMINISTRACIÓN');
INSERT INTO public.tesoreria_items VALUES (43, 'E-2.1', 'Gastos de Cursos (I, M, A, Inst)', 'Egreso', '2. FORMACIÓN');
INSERT INTO public.tesoreria_items VALUES (44, 'E-2.2', 'Gastos por otros cursos', 'Egreso', '2. FORMACIÓN');
INSERT INTO public.tesoreria_items VALUES (45, 'E-2.3', 'Otros gastos formación', 'Egreso', '2. FORMACIÓN');
INSERT INTO public.tesoreria_items VALUES (46, 'E-3.1', 'Gastos Campamentos', 'Egreso', '3. PROGRAMA');
INSERT INTO public.tesoreria_items VALUES (47, 'E-3.2', 'Gastos por salidas', 'Egreso', '3. PROGRAMA');
INSERT INTO public.tesoreria_items VALUES (48, 'E-3.3', 'Gastos por actividades Distritales/Zonales', 'Egreso', '3. PROGRAMA');
INSERT INTO public.tesoreria_items VALUES (49, 'E-3.4', 'Gastos por actividades nacionales', 'Egreso', '3. PROGRAMA');
INSERT INTO public.tesoreria_items VALUES (50, 'E-3.5', 'Otros gastos programa', 'Egreso', '3. PROGRAMA');
INSERT INTO public.tesoreria_items VALUES (51, 'E-4.1', 'Gastos campañas de la Asociación', 'Egreso', '4. PROYECTO');
INSERT INTO public.tesoreria_items VALUES (52, 'E-4.2', 'Gastos campañas del Comité de Grupo', 'Egreso', '4. PROYECTO');
INSERT INTO public.tesoreria_items VALUES (53, 'E-4.3', 'Gastos campañas de unidades del Grupo', 'Egreso', '4. PROYECTO');
INSERT INTO public.tesoreria_items VALUES (54, 'E-4.4', 'Gastos gestión de ingresos extraordinarios', 'Egreso', '4. PROYECTO');
INSERT INTO public.tesoreria_items VALUES (55, 'E-4.5', 'Otros gastos proyectos', 'Egreso', '4. PROYECTO');
INSERT INTO public.tesoreria_items VALUES (56, 'E-5.1', 'Gastos compra de carpas', 'Egreso', '5. INFRAESTRUCTURA');
INSERT INTO public.tesoreria_items VALUES (57, 'E-5.2', 'Gastos compra de Cocinilla', 'Egreso', '5. INFRAESTRUCTURA');
INSERT INTO public.tesoreria_items VALUES (58, 'E-5.3', 'Gastos por recuperación de equipos', 'Egreso', '5. INFRAESTRUCTURA');
INSERT INTO public.tesoreria_items VALUES (59, 'E-5.4', 'Gastos por mantención sede', 'Egreso', '5. INFRAESTRUCTURA');
INSERT INTO public.tesoreria_items VALUES (60, 'E-5.5', 'Otros Gastos Infraestructura', 'Egreso', '5. INFRAESTRUCTURA');
INSERT INTO public.tesoreria_items VALUES (61, 'E-6.1', 'Préstamos (Cancelación o abono)', 'Egreso', '6. ENDEUDAMIENTO');


--
-- Name: categorias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_id_seq', 39, true);


--
-- Name: progresion_areas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.progresion_areas_id_seq', 33, true);


--
-- Name: progresion_etapas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.progresion_etapas_id_seq', 49, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 33, true);


--
-- Name: tesoreria_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tesoreria_items_id_seq', 66, true);


--
-- Name: unidades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.unidades_id_seq', 34, true);


--
-- PostgreSQL database dump complete
--




-- =========================================================================
-- STORAGE BUCKETS AND RLS POLICIES SEEDING
-- =========================================================================

-- 1. Create buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tesoreria', 'tesoreria', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('articulos', 'articulos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('bitacoras', 'bitacoras', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('inventario', 'inventario', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('ceremonias', 'ceremonias', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage security policies
DROP POLICY IF EXISTS "Tesoreria storage access" ON storage.objects;
CREATE POLICY "Tesoreria storage access" ON storage.objects
FOR ALL USING (
  bucket_id = 'tesoreria' 
  AND (SELECT rol_id FROM public.perfiles WHERE id = auth.uid()) IN (1, 2, 3, 5)
);

DROP POLICY IF EXISTS "Allow public select on public buckets" ON storage.objects;
CREATE POLICY "Allow public select on public buckets" ON storage.objects
FOR SELECT USING (bucket_id IN ('articulos', 'bitacoras', 'inventario'));

DROP POLICY IF EXISTS "Allow authenticated manage on public buckets" ON storage.objects;
CREATE POLICY "Allow authenticated manage on public buckets" ON storage.objects
FOR ALL TO authenticated USING (bucket_id IN ('articulos', 'bitacoras', 'inventario')) 
WITH CHECK (bucket_id IN ('articulos', 'bitacoras', 'inventario'));

DROP POLICY IF EXISTS "Allow public select on ceremonias bucket" ON storage.objects;
CREATE POLICY "Allow public select on ceremonias bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'ceremonias');

DROP POLICY IF EXISTS "Allow authenticated manage on ceremonias bucket" ON storage.objects;
CREATE POLICY "Allow authenticated manage on ceremonias bucket" ON storage.objects
FOR ALL TO authenticated USING (bucket_id = 'ceremonias')
WITH CHECK (bucket_id = 'ceremonias');
