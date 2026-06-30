-- Add nombre_unidad column to unidades table and seed the names
ALTER TABLE unidades ADD COLUMN IF NOT EXISTS nombre_unidad text;

UPDATE unidades SET nombre_unidad = 'Ahi Niho Vænga' WHERE id = 1;
UPDATE unidades SET nombre_unidad = 'Põ Vui Vaikava' WHERE id = 2;
UPDATE unidades SET nombre_unidad = 'A''ata' WHERE id = 3;
UPDATE unidades SET nombre_unidad = 'Rapahango' WHERE id = 4;
UPDATE unidades SET nombre_unidad = 'Ahu Akivi' WHERE id = 5;
