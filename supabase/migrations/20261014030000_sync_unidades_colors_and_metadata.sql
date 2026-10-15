-- Sincronización de colores y nombres de unidades configurados en local
-- Compatible tanto por nombre de unidad como por ID

UPDATE unidades SET
  nombre_unidad = 'Ahi Niho Vænga',
  colores = '{
    "primario": "#f5cd16",
    "secundario": "#2b2c77",
    "fondo": "#ffffff",
    "fondo_oscuro": "#121212",
    "borde": "#f5cd16",
    "borde_oscuro": "#f5cd16",
    "texto": "#2b2c77",
    "texto_oscuro": "#b0b0b0",
    "tarjeta_bg": "#f5f5f5",
    "tarjeta_bg_oscuro": "#1b1b1b",
    "tarjeta_b_bg": "#f5f5f5",
    "tarjeta_b_bg_oscuro": "#1b1b1b",
    "tab_inactivo_bg": "#e2e8f0",
    "tab_inactivo_bg_oscuro": "#2b2b2b",
    "tab_hover_bg": "#f5cd16",
    "tab_hover_bg_oscuro": "#f5cd16",
    "hero_desc_texto": "#ffffff",
    "hero_desc_texto_oscuro": "#e2e8f0",
    "hero_gradient_from": "rgba(43, 44, 119, 0.95)",
    "hero_gradient_via": "rgba(43, 44, 119, 0.8)",
    "hero_gradient_to": "rgba(245, 205, 22, 0.4)"
  }'::jsonb
WHERE nombre = 'Manada' OR id = 1;

UPDATE unidades SET
  nombre_unidad = 'Põ Nui Vaikava',
  colores = '{
    "primario": "#00b7dc",
    "secundario": "#e7a913",
    "fondo": "#ffffff",
    "fondo_oscuro": "#121212",
    "borde": "#00b7dc",
    "borde_oscuro": "#e7a913",
    "texto": "#333333",
    "texto_oscuro": "#b0b0b0",
    "tarjeta_bg": "#EBFCFF",
    "tarjeta_bg_oscuro": "#00333D",
    "tarjeta_b_bg": "#EBFCFF",
    "tarjeta_b_bg_oscuro": "#00333D",
    "tab_inactivo_bg": "#00b7dc",
    "tab_inactivo_bg_oscuro": "#00333D",
    "tab_hover_bg": "#e7a913",
    "tab_hover_bg_oscuro": "#e7a913",
    "hero_desc_texto": "#f8f9fa",
    "hero_desc_texto_oscuro": "#b0b0b0",
    "hero_gradient_from": "rgba(24, 66, 51, 0.95)",
    "hero_gradient_via": "rgba(24, 66, 51, 0.8)",
    "hero_gradient_to": "rgba(27, 138, 90, 0.4)"
  }'::jsonb
WHERE nombre = 'Compañía' OR id = 2;

UPDATE unidades SET
  nombre_unidad = 'A''ata',
  colores = '{
    "primario": "#1e592d",
    "secundario": "#FFFFFF",
    "fondo": "#f4faf5",
    "fondo_oscuro": "#0d2312",
    "borde": "#1e592d",
    "borde_oscuro": "#f4faf5",
    "texto": "#0d2312",
    "texto_oscuro": "#f4faf5",
    "tarjeta_bg": "#f4faf5",
    "tarjeta_bg_oscuro": "#0d2312",
    "tarjeta_b_bg": "#f4faf5",
    "tarjeta_b_bg_oscuro": "#0d2312",
    "tab_inactivo_bg": "#FFFFFF",
    "tab_inactivo_bg_oscuro": "#1e592d",
    "tab_hover_bg": "#1e592d",
    "tab_hover_bg_oscuro": "#FFFFFF",
    "hero_desc_texto": "#FFFFFF",
    "hero_desc_texto_oscuro": "#FFFFFF",
    "hero_gradient_from": "rgba(21, 87, 36, 0.95)",
    "hero_gradient_via": "rgba(21, 87, 36, 0.8)",
    "hero_gradient_to": "rgba(30, 126, 52, 0.4)"
  }'::jsonb
WHERE nombre = 'Tropa' OR id = 3;

UPDATE unidades SET
  nombre_unidad = 'Rapahango',
  colores = '{
    "primario": "#4a3f8c",
    "secundario": "#FFFFFF",
    "fondo": "#f0f7fc",
    "fondo_oscuro": "#081c2c",
    "borde": "#4a3f8c",
    "borde_oscuro": "#f0f7fc",
    "texto": "#081c2c",
    "texto_oscuro": "#f0f7fc",
    "tarjeta_bg": "#BEB9DF",
    "tarjeta_bg_oscuro": "#16132A",
    "tarjeta_b_bg": "#D8D5EC",
    "tarjeta_b_bg_oscuro": "#1E1A38",
    "tab_inactivo_bg": "#BEB9DF",
    "tab_inactivo_bg_oscuro": "#1E1A38",
    "tab_hover_bg": "#f0f7fc",
    "tab_hover_bg_oscuro": "#f0f7fc",
    "hero_desc_texto": "#f0f7fc",
    "hero_desc_texto_oscuro": "#f0f7fc",
    "hero_gradient_from": "rgba(11, 65, 104, 0.95)",
    "hero_gradient_via": "rgba(11, 65, 104, 0.8)",
    "hero_gradient_to": "rgba(16, 117, 187, 0.4)"
  }'::jsonb
WHERE nombre = 'Avanzada' OR id = 4;

UPDATE unidades SET
  nombre_unidad = 'Ahu Akivi',
  colores = '{
    "primario": "#e32328",
    "secundario": "#fac620",
    "fondo": "#fcf6f5",
    "fondo_oscuro": "#180f0e",
    "borde": null,
    "borde_oscuro": null,
    "texto": null,
    "texto_oscuro": null,
    "tarjeta_bg": null,
    "tarjeta_bg_oscuro": null,
    "tarjeta_b_bg": null,
    "tarjeta_b_bg_oscuro": null,
    "tab_inactivo_bg": null,
    "tab_inactivo_bg_oscuro": null,
    "tab_hover_bg": null,
    "tab_hover_bg_oscuro": null,
    "hero_desc_texto": "#fcf6f5",
    "hero_desc_texto_oscuro": "#fcf6f5",
    "hero_gradient_from": "rgba(27, 27, 27, 0.95)",
    "hero_gradient_via": "rgba(27, 27, 27, 0.8)",
    "hero_gradient_to": "rgba(203, 51, 39, 0.4)"
  }'::jsonb
WHERE nombre = 'Clan' OR id = 5;
