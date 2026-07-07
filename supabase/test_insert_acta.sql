BEGIN;
-- Simular usuario Claudio Mateluna González (Dirigente de Tropa, rol_id = 2, unidad_id = 3)
SELECT set_config('request.jwt.claims', '{"sub": "b9a11ea4-7b00-4901-a9b1-585cdb5f916c"}', true);

-- Intentar el INSERT exacto
INSERT INTO public.actas (
    tipo, 
    fecha, 
    resumen, 
    confidencialidad, 
    unidad_id, 
    proxima_reunion, 
    observaciones_finales, 
    estado, 
    codigo, 
    ingresado_por
)
VALUES (
    'Consejo de Unidad', 
    '2026-07-07', 
    'Test resumen', 
    'Pública Interna', 
    3, 
    null, 
    'Test observaciones', 
    'Aprobada', 
    'ACT-2026-9999', 
    'b9a11ea4-7b00-4901-a9b1-585cdb5f916c'
)
RETURNING *;

ROLLBACK;
