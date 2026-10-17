'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import SecondaryHeader from '@/components/SecondaryHeader'

function CambiarContrasenaForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // 1. Validar el token_hash al montar el componente
  useEffect(() => {
    async function verifyToken() {
      if (!tokenHash || type !== 'recovery') {
        setError('El enlace de recuperación es inválido o está incompleto.')
        setIsVerifying(false)
        return
      }

      try {
        const { error: verifyErr } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'recovery'
        })

        if (verifyErr) {
          setError('El enlace de recuperación ha expirado o ya fue utilizado. Por favor solicita uno nuevo.')
        } else {
          setVerified(true)
        }
      } catch (err: unknown) {
        setError('Error al validar el enlace de recuperación.')
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, [tokenHash, type])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('La contraseña debe tener un mínimo de 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      const { error: updateErr } = await supabase.auth.updateUser({
        password
      })

      if (updateErr) {
        // Traducir mensajes comunes de Supabase Auth
        let errorSpanish = updateErr.message
        const msgLower = updateErr.message.toLowerCase()
        if (msgLower.includes('password should be at least') || msgLower.includes('password is too short')) {
          errorSpanish = 'La contraseña debe tener al menos 6 caracteres.'
        } else if (msgLower.includes('same password') || msgLower.includes('different from the old')) {
          errorSpanish = 'La nueva contraseña debe ser diferente a la anterior.'
        } else if (msgLower.includes('token') && (msgLower.includes('expired') || msgLower.includes('invalid'))) {
          errorSpanish = 'El enlace de recuperación ha expirado o es inválido. Por favor solicita uno nuevo.'
        } else if (msgLower.includes('rate limit') || msgLower.includes('too many requests')) {
          errorSpanish = 'Demasiados intentos. Por favor espera unos minutos antes de intentar nuevamente.'
        } else if (msgLower.includes('user not found')) {
          errorSpanish = 'Usuario no encontrado o sesión no válida.'
        } else if (msgLower.includes('network') || msgLower.includes('fetch')) {
          errorSpanish = 'Error de conexión. Verifica tu conexión a internet.'
        }
        throw new Error(errorSpanish)
      }

      setSuccess(true)
      // Cerrar sesión para que inicie limpiamente con sus nuevas credenciales
      await supabase.auth.signOut()
      
      setTimeout(() => {
        router.push('/login')
      }, 2500)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar la contraseña';
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="text-center p-8 space-y-3">
        <div className="w-10 h-10 border-4 border-clr4 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-bold text-clr3 uppercase text-xs tracking-widest">
          Validando token de seguridad...
        </p>
      </div>
    )
  }

  if (error && !verified) {
    return (
      <div className="text-center space-y-6">
        <div className="p-4 bg-clr4/10 dark:bg-dclr4/15 border-l-4 border-clr4 dark:border-dclr4 text-clr4 dark:text-dclr4 rounded-xl text-xs sm:text-sm font-bold leading-relaxed">
          {error}
        </div>
        <Link
          href="/recuperar-contrasena"
          className="inline-block py-4 px-8 bg-clr7 dark:bg-dclr7 text-clr1 dark:text-dclr1 font-bold text-xs uppercase rounded-[2rem] hover:brightness-110 active:scale-95 transition-all tracking-wider shadow-lg"
        >
          Solicitar Nuevo Enlace
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-clr4 dark:bg-dclr4 rounded-full mb-4 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-clr1 dark:text-dclr1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-3xl font-black font-display text-clr4 dark:text-dclr4 uppercase leading-none">
          Nueva Contraseña
        </h1>
        <p className="text-clr2 dark:text-dclr2 text-xs font-bold uppercase tracking-widest mt-3 italic">
          Define tu clave personal
        </p>
      </div>

      {success ? (
        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 rounded-2xl text-center text-xs sm:text-sm font-bold leading-relaxed shadow-sm space-y-3">
          <p className="text-base font-black">¡Contraseña actualizada con éxito!</p>
          <p className="font-normal opacity-90">Redirigiendo a la pantalla de inicio de sesión...</p>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-[0.8em] font-black uppercase tracking-widest text-clr4 dark:text-dclr4 mb-2 ml-4">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-clr1 dark:bg-dclr1 border-2 border-transparent border-clr7 dark:border-dclr7 focus:border-clr6 dark:focus:border-dclr6 rounded-2xl p-4 text-clr2 dark:text-dclr2 outline-none font-bold text-sm shadow-inner transition-all placeholder:text-clr3/50 dark:placeholder:text-dclr3/50"
              required
            />
          </div>

          <div>
            <label className="block text-[0.8em] font-black uppercase tracking-widest text-clr4 dark:text-dclr4 mb-2 ml-4">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-clr1 dark:bg-dclr1 border-2 border-transparent border-clr7 dark:border-dclr7 focus:border-clr6 dark:focus:border-dclr6 rounded-2xl p-4 text-clr2 dark:text-dclr2 outline-none font-bold text-sm shadow-inner transition-all placeholder:text-clr3/50 dark:placeholder:text-dclr3/50"
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-clr4/10 dark:bg-dclr4/15 border-l-4 border-clr4 dark:border-dclr4 text-clr4 dark:text-dclr4 text-xs rounded-xl font-bold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-clr7 dark:bg-dclr7 text-clr1 dark:text-dclr1 font-black font-display uppercase rounded-[2rem] shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest text-sm disabled:opacity-50"
          >
            {loading ? 'Guardando cambios...' : 'Guardar Nueva Contraseña'}
          </button>
        </form>
      )}
    </div>
  )
}

export default function CambiarContrasenaPage() {
  return (
    <div className="min-h-screen bg-clr1 dark:bg-dclr1 font-body transition-colors">
      <SecondaryHeader />
      
      <main className="max-w-[1080px] mx-auto px-6 py-32 flex justify-center">
        <div className="w-full max-w-md bg-clr1 dark:bg-dclr1 rounded-[3rem] p-10 shadow-2xl border border-clr7 dark:border-dclr7 animate-in fade-in zoom-in duration-700">
          <Suspense fallback={
            <div className="text-center p-8">
              <p className="font-bold text-clr3 dark:text-dclr3 uppercase text-xs tracking-widest">Cargando...</p>
            </div>
          }>
            <CambiarContrasenaForm />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
