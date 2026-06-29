# ¡Guía Mágica para Crear tu App Scout! 🐾

¡Hola, Scout! Vamos a construir juntos el nuevo hogar digital de Nua Mana. Sigue estos pasos como si fueran pistas en un juego de ciudad.

## Paso 1: ¡Prepara tu Mochila! (Herramientas)
Necesitaremos estas herramientas en tu computadora:
1.  **Node.js:** El motor de nuestra app.
2.  **Docker Desktop:** Para correr el "cerebro" local de Supabase.
3.  **Git:** Para guardar tus avances.

## Paso 2: Configura tu Laboratorio Local
He preparado las carpetas base por ti. Ahora abre una terminal en la carpeta del proyecto y haz lo siguiente:

### 1. Inicia el Frontend (Next.js)
Ya he creado la carpeta `frontend/`. Entra en ella e instala las herramientas:
```bash
cd frontend
npm install
```

### 2. Inicia el Backend (Supabase Local)
Vuelve a la carpeta principal y arranca Supabase (asegúrate de tener Docker abierto):
```bash
# Si npx supabase init falla, corre:
npx supabase start
```
Esto creará tu base de datos local con todas las tablas que diseñamos.

## Paso 3: Conecta tu App al Cerebro Local
Cuando Supabase inicie, te dará unas claves llamadas `API URL` y `anon key`.
1.  Crea un archivo llamado `.env.local` dentro de la carpeta `frontend/`.
2.  Pega esto (usa tus códigos reales):
    ```
    NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_local_aqui
    ```

## Paso 4: ¡A Programar!
Para ver tu app en vivo mientras trabajas:
```bash
cd frontend
npm run dev
```
Ahora abre [http://localhost:3000](http://localhost:3000) en tu navegador. ¡Ya puedes empezar a crear!

## Paso 5: Moviendo todo a la Nube (Cuando estés listo)
Una vez que todo funcione perfecto en tu PC:
1.  **Vercel:** Sube el contenido de `frontend/` a un nuevo proyecto en Vercel.
2.  **Supabase Cloud:** Crea un proyecto real en supabase.com y usa `npx supabase db push` para subir tus tablas.
3.  **Oracle Cloud:** Configura tu Bucket y cambia las URLs en tu archivo `.env`.

---
¡Felicidades, Jefe/a de Tropa! Has completado la especialidad de **Desarrollador de Apps**. ¡Buena Caza! 🏕️
