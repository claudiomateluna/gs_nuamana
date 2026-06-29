import { supabase } from './supabase'
import { compressImage } from './image-utils'

interface UploadOptions {
  compress?: boolean
  maxWidth?: number
  fileNamePrefix?: string
}

/**
 * Sube un archivo a Supabase Storage con compresión automática client-side para imágenes.
 * 
 * @param file Archivo original a subir
 * @param bucket Nombre del bucket (ej: 'articulos', 'bitacoras', 'ceremonias')
 * @param folder Directorio dentro del bucket (ej: 'blog', '2')
 * @param options Opciones adicionales de compresión y nomenclatura
 * @returns Promise<string> URL pública de la imagen subida
 */
export async function uploadToStorage(
  file: File,
  bucket: string,
  folder: string = '',
  options: UploadOptions = {}
): Promise<string> {
  const { compress = true, maxWidth = 1200, fileNamePrefix = '' } = options

  // 1. Comprimir archivo si es una imagen y compresión está habilitada
  let fileToUpload = file
  if (compress && file.type.startsWith('image/')) {
    try {
      fileToUpload = await compressImage(file, maxWidth)
    } catch (e) {
      console.warn('Fallo la compresión de imagen, procediendo con archivo original:', e)
    }
  }

  // 2. Generar nombre de archivo único
  const fileExt = fileToUpload.name.split('.').pop()
  const randomStr = Math.random().toString(36).substring(2, 9)
  const timestamp = Date.now()
  const prefix = fileNamePrefix ? `${fileNamePrefix}_` : ''
  const fileName = `${prefix}${timestamp}_${randomStr}.${fileExt}`
  
  // Limpiar folder de barras adicionales
  const cleanedFolder = folder ? `${folder.replace(/\/+$/, '')}/` : ''
  const filePath = `${cleanedFolder}${fileName}`

  // 3. Subir archivo a Supabase
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, fileToUpload)

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  // 4. Obtener URL pública
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return data.publicUrl
}
