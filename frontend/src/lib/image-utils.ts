import imageCompression from 'browser-image-compression';

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
    const compressedFile = await imageCompression(file, options);
    console.log(`Compresión finalizada: ${file.size / 1024 / 1024}MB -> ${compressedFile.size / 1024 / 1024}MB`);
    return compressedFile;
  } catch (error) {
    console.error('Error al comprimir imagen:', error);
    return file; // Si falla, devolvemos el original para no bloquear el flujo
  }
}
