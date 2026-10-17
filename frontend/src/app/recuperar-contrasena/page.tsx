'use client'

import { useState } from 'react'
import Link from 'next/link'
import SecondaryHeader from '@/components/SecondaryHeader'
import { validarRut } from '@/lib/validation-utils'

export default function RecuperarContrasenaPage() {
  const [rut, setRut] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMensaje(null)

    if (!validarRut(rut)) {
      setError('Por favor ingresa un R.U.T. válido.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/recuperar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Ocurrió un error al procesar la solicitud.')
      }

      setMensaje(data.message || 'Si el R.U.T. coincide con un usuario registrado, hemos enviado las instrucciones a tu correo electrónico personal.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con el servidor';
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-clr7 dark:bg-dclr7 font-body transition-colors">
      <SecondaryHeader />
      
      <main className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="w-full max-w-md bg-clr1 dark:bg-dclr1 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-clr7/20 dark:border-dclr7/20">
          
          <div className="text-center mb-8">
            <span className="text-[0.8em] font-black uppercase tracking-widest text-clr4 bg-clr4/10 px-4 py-1.5 rounded-full inline-block mb-3">
              Seguridad
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-clr2 dark:text-dclr2">
              Recuperar Acceso
            </h1>
            <p className="text-clr3 text-xs sm:text-sm mt-2 font-bold leading-relaxed">
              Ingresa tu R.U.T. y enviaremos un enlace a tu correo registrado para restablecer tu contraseña.
            </p>
          </div>

          {mensaje ? (
            <div className="space-y-6">
              <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed text-center shadow-sm">
                <p className="font-bold mb-2">¡Solicitud procesada!</p>
                <p>{mensaje}</p>
              </div>

              <div className="text-center pt-2">
                <Link 
                  href="/login" 
                  className="inline-block py-3 px-6 bg-clr4 text-clr1 font-bold text-xs uppercase rounded-xl hover:brightness-110 active:scale-95 transition-all tracking-wider shadow-md"
                >
                  Volver a Iniciar Sesión
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[0.8em] font-black uppercase tracking-widest text-clr3 mb-2 ml-4">
                  R.U.T. de Acceso
                </label>
                <input 
                  type="text" 
                  value={rut}
                  placeholder="12345678-9"
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    let v = e.currentTarget.value.toUpperCase().replace(/[^0-9K]/g, ''); 
                    if (v.length > 1) v = v.slice(0, -1) + '-' + v.slice(-1); 
                    setRut(v);
                  }}
                  className="w-full bg-clr7 dark:bg-dclr7 border-2 border-transparent focus:border-clr4 dark:focus:border-dclr4 rounded-2xl p-4 text-clr2 dark:text-dclr2 outline-none transition-all font-bold text-lg text-center tracking-widest shadow-inner placeholder:text-clr3/50 dark:placeholder:text-dclr3/50" 
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
                {loading ? 'Consultando...' : 'Enviar Instrucciones'}
              </button>

              <div className="text-center pt-4 border-t border-clr7 dark:border-dclr7 mt-6">
                <Link 
                  href="/login" 
                  className="text-[0.8em] font-bold text-clr3 dark:text-dclr3 uppercase tracking-widest hover:text-clr4 dark:hover:text-dclr4 transition-colors"
                >
                  ← Volver al inicio de sesión
                </Link>
              </div>
            </form>
          )}

        </div>
      </main>
    </div>
  )
}
