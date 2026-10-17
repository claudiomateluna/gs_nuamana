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

      if (updateErr) throw updateErr

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
        <div className="p-5 bg-clr4/10 border border-clr4 text-clr4 rounded-2xl text-xs sm:text-sm font-bold leading-relaxed">
          {error}
        </div>
        <Link
          href="/recuperar-contrasena"
          className="inline-block py-4 px-8 bg-clr4 text-clr1 font-bold text-xs uppercase rounded-2xl hover:brightness-110 active:scale-95 transition-all tracking-wider shadow-lg"
        >
          Solicitar Nuevo Enlace
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <span className="text-[0.8em] font-black uppercase tracking-widest text-clr4 bg-clr4/10 px-4 py-1.5 rounded-full inline-block mb-3">
          Nueva Credencial
        </span>
        <h1 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-clr2 dark:text-dclr2">
          Nueva Contraseña
        </h1>
        <p className="text-clr3 text-xs sm:text-sm mt-2 font-bold leading-relaxed">
          Ingresa y confirma tu nueva clave de acceso para tu cuenta.
        </p>
      </div>

      {success ? (
        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 rounded-2xl text-center text-xs sm:text-sm font-bold leading-relaxed shadow-sm space-y-3">
          <p className="text-base font-black">¡Contraseña actualizada con éxito!</p>
          <p className="font-normal opacity-90">Redirigiendo a la pantalla de inicio de sesión...</p>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-[0.8em] font-black uppercase tracking-widest text-clr3 dark:text-dclr3 mb-2 ml-4">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-clr7 dark:bg-dclr7 border-2 border-transparent focus:border-clr4 dark:focus:border-dclr4 rounded-2xl p-4 text-clr2 dark:text-dclr2 outline-none font-bold text-sm shadow-inner transition-all placeholder:text-clr3/50 dark:placeholder:text-dclr3/50"
              required
            />
          </div>

          <div>
            <label className="block text-[0.8em] font-black uppercase tracking-widest text-clr3 dark:text-dclr3 mb-2 ml-4">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-clr7 dark:bg-dclr7 border-2 border-transparent focus:border-clr4 dark:focus:border-dclr4 rounded-2xl p-4 text-clr2 dark:text-dclr2 outline-none font-bold text-sm shadow-inner transition-all placeholder:text-clr3/50 dark:placeholder:text-dclr3/50"
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
            className="w-full py-5 bg-clr4 dark:bg-dclr4 text-clr1 dark:text-dclr1 font-black font-display uppercase rounded-[2rem] shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest text-sm disabled:opacity-50"
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
    <div className="min-h-screen bg-clr7 dark:bg-dclr7 font-body transition-colors">
      <SecondaryHeader />
      
      <main className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="w-full max-w-md bg-clr1 dark:bg-dclr1 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-clr7/20 dark:border-dclr7/20">
          <Suspense fallback={
            <div className="text-center p-8">
              <p className="font-bold text-clr3 uppercase text-xs tracking-widest">Cargando...</p>
            </div>
          }>
            <CambiarContrasenaForm />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
