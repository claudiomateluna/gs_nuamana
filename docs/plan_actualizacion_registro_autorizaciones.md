# Plan de Implementación: Reestructuración de Registro y Autorizaciones Digitales

Este documento detalla el cruce técnico para alinear la base de datos, el proceso de registro y el sistema de autorizaciones con la especificación del archivo `Formulario_Autorizaciones.txt`.

## 1. Fase de Base de Datos (Supabase)

### 1.1. Tabla `public.perfiles` (Actualización)
Se deben agregar y reorganizar campos para soportar la precarga del Paso 1 al 6 del formulario.
- **Nuevos Campos:** `nacionalidad`, `nombre_social`, `zona`, `distrito`, `seguro_complementario` (boolean), `nombre_seguro_complementario`, `tiene_alergias` (boolean), `tiene_intolerancia` (boolean), `describe_intolerancia` (text).
- **Refactorización:** Eliminar columnas estáticas de emergencia (`emergencia_1_...`) ya que se usa la tabla `contactos_emergencia`.

### 1.2. Tabla `public.perfiles_ficha_medica` (Sincronización)
Asegurar que existan todos los campos para los pasos 7 al 15.
- **Nuevos Campos:** `contacto_profesional_tratante`, `inicio_tratamiento_reciente` (date), `medicamentos_malestar` (text), `pais_viaje`, `fecha_viaje` (date), `vacuna_viaje`, `semanas_embarazo` (int), `fecha_ultimo_control_embarazo` (date), `especifique_tratamiento_dental` (text).

---

## 2. Fase de Registro (Frontend - Wizard 25 Pasos)

El archivo `frontend/src/app/registro/page.tsx` debe ser actualizado para capturar los datos que alimentarán la ficha médica inicial.

### Cambios en Pasos Específicos:
- **Paso 3:** Agregar `nombre_social`.
- **Paso 4:** Validación estricta de RUN (no modificable en autorizaciones).
- **Paso 11:** Implementar selectores de `Zona` y `Distrito` con la lógica de dependencia de `Formulario_Autorizaciones.txt`.
- **Paso 16:** Agregar lógica de `Seguro Complementario` (Si/No + Nombre).
- **Paso 18:** Agregar checkbox `tiene_alergias` antes del textarea.
- **Paso 19:** Cambiar textarea de enfermedades por checkboxes múltiples + "Otra" (según Sección 6 del .txt).
- **Paso 22:** Agregar `tiene_intolerancia` y `describe_intolerancia`.

---

## 3. Fase de Autorización (Frontend - Nuevo Wizard por Componentes)

Se reemplazará la lógica pesada de `DashModAutorizacionWizard.tsx` por un sistema de componentes atómicos ubicados en `src/components/dashboard/autorizacion/`.

### Estructura de Componentes:
Cada sección del archivo `.txt` será un componente independiente:

1. `Step1_DatosPersonales.tsx`: (Sección 1 y 2) Precarga desde `perfiles`.
2. `Step2_ContactosEmergencia.tsx`: (Sección 3) CRUD dinámico sobre `contactos_emergencia`.
3. `Step3_PrevisionSalud.tsx`: (Sección 4) Lógica de Isapre y Seguro Complementario.
4. `Step4_AntecedentesMedicos.tsx`: (Sección 5 y 6) Alergias, Dieta y Enfermedades Crónicas.
5. `Step5_SaludMental.tsx`: (Sección 7) Diagnóstico, tratamiento y contacto médico.
6. `Step6_HistorialClinico.tsx`: (Sección 8) Hospitalizaciones y cirugías (lista dinámica).
7. `Step7_CondicionesRecientes.tsx`: (Sección 9 y 10) Malestares (2 semanas), tratamientos y viajes.
8. `Step8_VacunasSaludGineco.tsx`: (Sección 11, 12 y 13) Vacunas, Gineco-Obstétrica (filtro por sexo) y Dental.
9. `Step9_RegulacionEmocional.tsx`: (Sección 14 y 15) Necesidades especiales y estrategias de calma.
10. `Step10_LegalParticipacion.tsx`: (Sección 16) **Lógica Mayor/Menor de edad**. Muestra texto íntegro del PDF y un solo Radio (SI/NO).
11. `Step11_LegalImagen.tsx`: (Sección 17) **Lógica Mayor/Menor de edad**. Muestra texto íntegro y un solo Radio (SI/NO).
12. `Step12_FirmaFinal.tsx`: (Sección 18) Signature Pad con datos del responsable (Participante o Apoderado).

---

## 4. Lógica de Discernimiento (Mayores vs Menores)

El Wizard principal de Autorización ejecutará la siguiente lógica en el `useEffect` de carga:
1. Obtener `fecha_nacimiento` del perfil.
2. Calcular `edad` actual.
3. Al llegar a los pasos 10 y 11:
   - Si `edad >= 18`:
     - Renderizar componente con texto: "Al firmar esta autorización, declaro que no he presentado..."
     - Pregunta: "¿Autorizo a quien es responsable...?"
   - Si `edad < 18`:
     - Renderizar componente con texto: "Al firmar esta autorización, declaro que el niño, niña o adolescente que represento..."
     - Pregunta: "¿Autorizo... realizar al niño, niña o adolescente que represento?"

---

## 5. Próximos Pasos Inmediatos

1. **SQL:** Ejecutar la migración de base de datos para asegurar que todos los campos del `.txt` existan.
2. **Types:** Actualizar las interfaces de TypeScript para `Perfil` y `FichaMedica`.
3. **Components:** Crear la carpeta `src/components/dashboard/autorizacion/` y empezar la implementación modular.
4. **Registro:** Modificar el formulario de 25 pasos para que sea el primer alimentador de estos datos.
