/**
 * Comprime una imagen en el lado del cliente.
 * Reduce el tamaño del archivo y las dimensiones para optimizar la subida a Supabase.
 * 
 * @param file Archivo original seleccionado por el usuario
 * @param maxWidth Ancho máximo en píxeles (default 1200)
 * @returns Promise<File> Archivo comprimido
 */
export async function compressImage(file: File, maxWidth: number = 1200): Promise<File> {
  const options = {
    maxSizeMB: 0.5,           // Tamaño máximo sugerido (500KB)
    maxWidthOrHeight: maxWidth, // Dimensión máxima
    useWebWorker: true,       // Usa hilos secundarios para no congelar la UI
    initialQuality: 0.8       // Calidad inicial 80%
  };

  try {
    const imageCompression = (await import('browser-image-compression')).default;
    const compressedFile = await imageCompression(file, options);
    console.log(`Compresión finalizada: ${file.size / 1024 / 1024}MB -> ${compressedFile.size / 1024 / 1024}MB`);
    return compressedFile;
  } catch (error) {
    console.error('Error al comprimir imagen:', error);
    return file; // Si falla, devolvemos el original para no bloquear el flujo
  }
}

/**
 * Procesa la imagen del artículo creando un canvas de 1080x1080px,
 * aplicando las capas de fondo, foto recortada, marco frontal y texto (título y categoría),
 * para luego reducirla a 540x540px y comprimirla a WebP.
 * 
 * @param file Archivo original seleccionado por el usuario
 * @param title Título del artículo (mayúsculas, con contorno)
 * @param category Categoría principal (esquina superior derecha, con efecto glow)
 * @returns Promise<File> Imagen final WebP 540x540px
 */
export async function processArticleImage(file: File, title: string, category: string): Promise<File> {
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load template asset: ' + url));
      img.src = url;
    });
  };

  try {
    // 1. Cargar las capas de plantilla y la foto del usuario en paralelo
    const [bgImg, fgImg] = await Promise.all([
      loadImage('/images/template/firma_background.webp'),
      loadImage('/images/template/firma_frontal.webp')
    ]);

    const userImgUrl = URL.createObjectURL(file);
    const userImg = await loadImage(userImgUrl);
    URL.revokeObjectURL(userImgUrl);

    // 2. Crear canvas a escala 1080x1080px (alta resolución para el renderizado del texto)
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D canvas context');

    // Capa 1: Background Template
    ctx.drawImage(bgImg, 0, 0, 1080, 1080);

    // Capa 2: Foto del Usuario (recorte 1:1 centrado)
    const minDim = Math.min(userImg.width, userImg.height);
    const sx = (userImg.width - minDim) / 2;
    const sy = (userImg.height - minDim) / 2;
    ctx.drawImage(userImg, sx, sy, minDim, minDim, 0, 0, 1080, 1080);

    // Capa 3: Foreground Template (marcos y firma)
    ctx.drawImage(fgImg, 0, 0, 1080, 1080);

    // Capa 4: Título del Artículo (Estilo: Negrita, tamaño 40, fuente Inika, mayúsculas, relleno blanco, borde rojo)
    ctx.font = 'bold 40px Inika, Georgia, serif';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#cb3327'; // Rojo institucional
    ctx.lineWidth = 6;
    ctx.lineJoin = 'round';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const targetX = 151;
    const targetY = 954.6;
    const maxWidth = 1080 - targetX - 60; // Margen derecho de 60px

    let textToDraw = title.toUpperCase();
    if (ctx.measureText(textToDraw).width > maxWidth) {
      while (textToDraw.length > 0 && ctx.measureText(textToDraw + '...').width > maxWidth) {
        textToDraw = textToDraw.slice(0, -1);
      }
      textToDraw += '...';
    }

    ctx.strokeText(textToDraw, targetX, targetY);
    ctx.fillText(textToDraw, targetX, targetY);

    // Capa 5: Categoría (Glow rojo, tamaño 40, fuente del cuerpo de página)
    ctx.save();
    ctx.shadowColor = '#cb3327';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#cb3327';
    ctx.font = 'bold 40px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    // Posicionar en la esquina superior derecha con márgenes correctos
    ctx.fillText(category, 1010, 65);
    ctx.restore();

    // 3. Escalar canvas final a 540x540px
    const smallCanvas = document.createElement('canvas');
    smallCanvas.width = 540;
    smallCanvas.height = 540;
    const smallCtx = smallCanvas.getContext('2d');
    if (!smallCtx) throw new Error('Could not get small 2D canvas context');
    smallCtx.drawImage(canvas, 0, 0, 540, 540);

    // 4. Exportar como WebP comprimido (80% calidad)
    return new Promise((resolve, reject) => {
      smallCanvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create WebP blob'));
          return;
        }
        const newFileName = file.name.replace(/\.[^/.]+$/, '') + '_processed.webp';
        const processedFile = new File([blob], newFileName, { type: 'image/webp' });
        resolve(processedFile);
      }, 'image/webp', 0.8);
    });

  } catch (err: any) {
    console.error('Error al procesar capas en la imagen:', err);
    return file; // Retornamos el original ante cualquier error de carga para no bloquear al usuario
  }
}
