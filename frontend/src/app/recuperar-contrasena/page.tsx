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
        let errorMsg = data.error || 'Ocurrió un error al procesar la solicitud.'
        const lower = errorMsg.toLowerCase()
        if (lower.includes('rate limit') || lower.includes('too many requests')) {
          errorMsg = 'Demasiadas solicitudes. Por favor espera unos momentos antes de reintentar.'
        } else if (lower.includes('network') || lower.includes('failed to fetch')) {
          errorMsg = 'Error de red o conexión con el servidor.'
        }
        throw new Error(errorMsg)
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
    <div className="min-h-screen bg-clr1 dark:bg-dclr1 font-body transition-colors">
      <SecondaryHeader />
      
      <main className="max-w-[1080px] mx-auto px-6 py-32 flex justify-center">
        <div className="w-full max-w-md bg-clr1 dark:bg-dclr1 rounded-[3rem] p-10 shadow-2xl border border-clr7 dark:border-dclr7 animate-in fade-in zoom-in duration-700">
          
          <div className="text-center mb-10">
            <div className="inline-block p-4 bg-clr4 dark:bg-dclr4 rounded-full mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-clr1 dark:text-dclr1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black font-display text-clr4 dark:text-dclr4 uppercase leading-none">
              Recuperar Acceso
            </h1>
            <p className="text-clr2 dark:text-dclr2 text-xs font-bold uppercase tracking-widest mt-3 italic">
              Ingresa tu R.U.N. registrado
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
                  className="inline-block py-3 px-6 bg-clr7 dark:bg-dclr7 text-clr1 dark:text-dclr1 font-bold text-xs uppercase rounded-xl hover:brightness-110 active:scale-95 transition-all tracking-wider shadow-md"
                >
                  Volver a Iniciar Sesión
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[0.8em] font-black uppercase tracking-widest text-clr4 dark:text-dclr4 mb-2 ml-4">
                  R.U.N. de Usuario
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
                  className="w-full bg-clr1 dark:bg-dclr1 border-2 border-transparent border-clr7 dark:border-dclr7 focus:border-clr6 dark:focus:border-dclr6 rounded-2xl p-4 text-clr2 dark:text-dclr2 outline-none transition-all font-bold text-lg text-center tracking-widest shadow-inner placeholder:text-clr3/50 dark:placeholder:text-dclr3/50" 
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
                {loading ? 'Consultando...' : 'Enviar Instrucciones'}
              </button>

              <div className="text-center pt-6 border-t border-clr7 dark:border-dclr7 mt-8">
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
