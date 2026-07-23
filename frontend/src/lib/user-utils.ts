import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import type { Perfil } from '@/types'

export async function toggleUsuarioEstado(miembro: Perfil, onSuccess: () => void) {
  const nuevoEstado = miembro.estado === 'inactivo' ? 'activo' : 'inactivo'
  const { error } = await supabase
    .from('perfiles')
    .update({ estado: nuevoEstado })
    .eq('id', miembro.id)
  if (error) {
    toast.error('Error al cambiar estado: ' + error.message)
  } else {
    toast.success(`Estado cambiado a ${nuevoEstado}`)
    onSuccess()
  }
}
