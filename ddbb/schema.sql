-- Esquema de Base de Datos para Nua Mana PWA (PostgreSQL / Supabase)

-- 1. Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tablas Maestras
CREATE TABLE public.roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL -- 'Admin', 'Dirigente', 'Beneficiario', 'Apoderado'
);

CREATE TABLE public.unidades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL, -- 'Manada', 'Compañía', 'Tropa', 'Avanzada'
    descripcion TEXT,
    imagen_url TEXT,
    colores JSONB, -- { "primario": "#hex", "secundario": "#hex" }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Usuarios (Perfil extendido vinculado a Auth de Supabase)
CREATE TABLE public.perfiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    rol_id INTEGER REFERENCES public.roles(id),
    unidad_id INTEGER REFERENCES public.unidades(id),
    
    -- Información Personal
    nombres VARCHAR(100),
    apellidos VARCHAR(100),
    rut VARCHAR(12) UNIQUE,
    telefono VARCHAR(20),
    direccion TEXT,
    comuna VARCHAR(50),
    fecha_nacimiento DATE,
    genero VARCHAR(20),
    religion VARCHAR(50),
    
    -- Institucional
    colegio VARCHAR(100),
    tipo_estudiante VARCHAR(50),
    
    -- Salud
    sistema_salud VARCHAR(50),
    detalle_salud TEXT,
    tipo_sangre VARCHAR(5),
    alergias TEXT,
    antecedentes_medicos TEXT,
    tratamiento_medico TEXT,
    consumo_medicamentos TEXT,
    dieta_alimentaria JSONB, -- Array de opciones
    
    -- Emergencia
    emergencia_1_nombre VARCHAR(100),
    emergencia_1_telefono VARCHAR(20),
    emergencia_1_relacion VARCHAR(50),
    emergencia_2_nombre VARCHAR(100),
    emergencia_2_telefono VARCHAR(20),
    emergencia_2_relacion VARCHAR(50),
    emergencia_3_nombre VARCHAR(100),
    emergencia_3_telefono VARCHAR(20),
    emergencia_3_relacion VARCHAR(50),
    
    -- Vínculos (Apoderados <-> Pupilos)
    apoderado_id UUID REFERENCES public.perfiles(id),
    
    -- Otros
    autoriza_fotos BOOLEAN DEFAULT FALSE,
    fe_publica BOOLEAN DEFAULT FALSE,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Blog y Contenido
CREATE TABLE public.categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    parent_id INTEGER REFERENCES public.categorias(id),
    descripcion TEXT
);

CREATE TABLE public.articulos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    autor_id UUID REFERENCES public.perfiles(id),
    categoria_id INTEGER REFERENCES public.categorias(id),
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    contenido TEXT,
    extracto TEXT,
    imagen_destacada TEXT,
    estado VARCHAR(20) DEFAULT 'borrador', -- 'borrador', 'publicado'
    
    -- SEO
    seo_titulo VARCHAR(255),
    seo_descripcion TEXT,
    
    -- Campos Condicionales (almacenados como JSON para flexibilidad o tablas separadas)
    campos_personalizados JSONB, 
    -- Estructura esperada para Actividades: { "materiales": [], "variaciones": "", "recomendaciones": "" }
    -- Estructura esperada para Biografías: { "lugar_nacimiento": "", "pais_nacimiento": "", "fecha_defuncion": "" }
    -- Estructura esperada para Historia: { "lugar": "", "pais": "", "ano": 0 }
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Inventario
CREATE TABLE public.inventario (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    unidad_id INTEGER REFERENCES public.unidades(id), -- NULL si es de Grupo
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    cantidad INTEGER DEFAULT 1,
    categoria VARCHAR(100),
    estado VARCHAR(50), -- 'Bueno', 'Regular', 'Dañado', 'Perdido'
    ultima_revision TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tesorería
CREATE TABLE public.tesoreria_categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) -- 'Ingreso', 'Egreso'
);

CREATE TABLE public.tesoreria_movimientos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    unidad_id INTEGER REFERENCES public.unidades(id),
    categoria_id INTEGER REFERENCES public.tesoreria_categorias(id),
    monto INTEGER NOT NULL,
    fecha DATE NOT NULL,
    descripcion TEXT,
    comprobante_url TEXT,
    responsable_id UUID REFERENCES public.perfiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Actas de Reunión
CREATE TABLE public.actas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    unidad_id INTEGER REFERENCES public.unidades(id),
    fecha TIMESTAMP WITH TIME ZONE NOT NULL,
    lugar VARCHAR(255),
    asistentes JSONB, -- Lista de IDs de perfiles
    temas TEXT,
    acuerdos TEXT,
    creado_por UUID REFERENCES public.perfiles(id)
);

-- 8. Progresión Scout
CREATE TABLE public.progresion_etapas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL, -- 'Cernícalo', 'Halcón', etc.
    unidad_id INTEGER REFERENCES public.unidades(id)
);

CREATE TABLE public.progresion_objetivos (
    id SERIAL PRIMARY KEY,
    etapa_id INTEGER REFERENCES public.progresion_etapas(id),
    area VARCHAR(50), -- 'Creatividad', 'Corporalidad', etc.
    descripcion TEXT
);

CREATE TABLE public.progresion_usuario (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    usuario_id UUID REFERENCES public.perfiles(id),
    objetivo_id INTEGER REFERENCES public.progresion_objetivos(id),
    estado VARCHAR(20) DEFAULT 'en_progreso', -- 'en_progreso', 'completado'
    fecha_completado TIMESTAMP WITH TIME ZONE,
    evaluador_id UUID REFERENCES public.perfiles(id),
    notas TEXT
);

-- 9. Funciones y Triggers para actualización automática de 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_perfiles_updated_at BEFORE UPDATE ON public.perfiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_articulos_updated_at BEFORE UPDATE ON public.articulos FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
