-- ==============================================================================
-- CMS ADMIN FASE 2: Agregar roles_permitidos a menu_items
-- Fecha: 2026-07-30
-- Propósito: Restringir visibilidad de items del menú por rol
-- ==============================================================================

-- Columna roles_permitidos: array de textos
-- Vacío = visible para todos (público + autenticados)
-- Con valores = solo visible para usuarios con ese rol
-- Valores posibles: 'public', 'authenticated', 'admin', 'dirigente',
--   'guiadora', 'directiva', 'apoderado', 'nnj1'..'nnj5'
ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS roles_permitidos TEXT[] DEFAULT '{}';

-- Migrar datos existentes: todos los items actuales son públicos
-- (no need to update, empty array = visible to all)
