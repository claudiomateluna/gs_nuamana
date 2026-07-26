DO $$
DECLARE
  v_admin_id UUID;
  v_articulo_id UUID := uuid_generate_v4();
BEGIN
  SELECT id INTO v_admin_id FROM perfiles WHERE rol_id = 1 LIMIT 1;
  IF v_admin_id IS NULL THEN
    SELECT id INTO v_admin_id FROM perfiles LIMIT 1;
  END IF;

  INSERT INTO articulos (
    id,
    autor_id,
    categoria_id,
    titulo,
    slug,
    contenido,
    extracto,
    imagen_destacada,
    estado,
    etiquetas,
    metadata
  ) VALUES (
    v_articulo_id,
    v_admin_id,
    NULL,
    'El Nido de los Recuerdos',
    'el-nido-de-los-recuerdos',
    '## 📜 Descripción del Juego

**El Nido de los Recuerdos** es un divertido juego de tablero gigante en el que los participantes lanzan dados y avanzan por un circuito dibujado en papel. Cada casilla contiene un desafío de conversación donde los niños comparten una vivencia, un sentimiento o una anécdota alegre con sus compañeros.

---

### 🎲 ¿Cómo se juega?

1. **Preparación:** En un pliego grande de papel, se dibuja un gran nido central y un camino de casillas alrededor. Cada jugador busca un objeto pequeño (una piedra bonita, una ficha o una chapa) que servirá como su ficha de juego.
2. **Inicio:** El primer jugador tira el dado y avanza el número de casillas indicado. Si cae en una casilla vacía, escribe una consigna sencilla (por ejemplo: *"Cuenta tu momento más feliz del campamento"* o *"Menciona tu juego favorito"*).
3. **Desarrollo:** Si el jugador cae en una casilla que ya tiene una consigna escrita, debe responder a esa pregunta o compartir su experiencia sobre ese tema.
4. **Cierre:** El juego continúa formando un circuito cerrado hasta que todos hayan compartido sus vivencias y el grupo decida finalizar.

---

### 💡 Variaciones

- **Nido Temático:** Las casillas se enfocan en temas específicos como historias scouts, la Ley y Promesa o anécdotas de la patrulla.
- **Nido de Dibujos:** En lugar de hablar, los participantes dibujan su respuesta en la casilla para que los demás la adivinen.

---

### 🛡️ Recomendaciones para Dirigentes

- Mantener un ambiente de confianza, respeto y escucha activa.
- Evitar preguntas incómodas; las consignas deben ser siempre constructivas y alegres.',
    'Un juego de tablero gigante cooperativo donde los participantes avanzan casillas compartiendo vivencias, reflexiones y anécdotas con su seisena o patrulla.',
    '/uploads/actividad_elNido.webp',
    'publicado',
    ARRAY['juego', 'cooperativo', 'integracion', 'expresion', 'confianza'],
    '{
      "unidades": ["manada", "compañía", "tropa", "avanzada"],
      "duracion": "30 minutos",
      "cantidad": "06 participantes",
      "lugares": ["Interior", "sala"],
      "materiales": ["Papel", "Lápices", "Dados"],
      "areas": ["Sociabilidad", "Afectividad", "Carácter"],
      "objetivos": ["Conocer a los demás", "Facilitar el conocimiento entre los pares", "Fomentar un entorno de confianza", "Favorecer la comunicación en el grupo"],
      "justificacion_areas": "El Nido fomenta la sociabilidad y el afecto entre los participantes mediante la expresión abierta de vivencias en un clima de respeto y empatía. Ayuda a consolidar la confianza grupal y el desarrollo del carácter al compartir sentimientos y escuchar activamente a los compañeros.",
      "variaciones": "Nido Temático (enfocado en anécdotas scouts) o Nido de Dibujos (respuestas graficadas en papel).",
      "recomendaciones": "Asegurar un clima acogedor de escucha activa sin juzgar las intervenciones de ningún participante.",
      "objetivos_educativos": [
        {
          "id": "cfa10133-c25c-4deb-aebe-a00f8fe3f7ef",
          "area": "Sociabilidad",
          "texto": "Comparto lo que tengo con mis compañeros y compañeras.",
          "unidad": "Manada",
          "como_se_cumple": "Compartiendo mis vivencias, tarjetas y respuestas de forma abierta con mi seisena durante el recorrido en el tablero del nido."
        },
        {
          "id": "5cbe35dc-d15b-4070-9a36-5b0e652c7946",
          "area": "Sociabilidad",
          "texto": "Respeto las opiniones de los demás.",
          "unidad": "Manada",
          "como_se_cumple": "Escuchando con atención y respetando los sentimientos que mis compañeros expresan al caer en las casillas del juego."
        }
      ]
    }'::jsonb
  );

  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 10) ON CONFLICT DO NOTHING;
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 1) ON CONFLICT DO NOTHING;

END $$;
