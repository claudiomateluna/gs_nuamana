'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import SecondaryHeader from '@/components/SecondaryHeader'
import { validarRut } from '@/lib/validation-utils'

const loginSchema = z.object({
  rut: z.string().min(8, 'RUT inválido').refine(validarRut, { message: 'RUT inválido' }),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setError(null)
    try {
      // Convertimos el RUT a un alias de email interno
      const emailAlias = `${data.rut.toLowerCase()}@nuamana.cl`;

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: emailAlias,
        password: data.password,
      })

      if (authError) throw authError

      window.location.href = '/panel' 
    } catch (e: unknown) {
      setError('Credenciales inválidas. Verifica tu RUT y contraseña.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-clr7 dark:bg-dclr7 font-body transition-colors">
      <SecondaryHeader />
      
      <main className="max-w-[1080px] mx-auto px-6 py-32 flex justify-center">
        <div className="w-full max-w-md bg-clr1 dark:bg-dclr1 rounded-[3rem] p-10 shadow-2xl border border-clr7 dark:border-dclr7 animate-in fade-in zoom-in duration-700">
          
          <div className="text-center mb-10">
            <div className="inline-block p-4 bg-clr4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-clr4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black font-display text-clr4 dark:text-dclr4 uppercase leading-none">Acceso Intranet</h1>
            <p className="text-clr3 text-xs font-bold uppercase tracking-widest mt-3 italic">Ingresa con tu R.U.N.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-[0.8em] font-black uppercase tracking-widest text-clr3 mb-2 ml-4">R.U.N. de Usuario</label>
              <input 
                type="text" 
                {...register('rut')} 
                placeholder="12345678-9"
                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                  let v = e.currentTarget.value.toUpperCase().replace(/[^0-9K]/g, ''); 
                  if (v.length > 1) v = v.slice(0, -1) + '-' + v.slice(-1); 
                  e.currentTarget.value = v;
                }}
                className="w-full bg-clr7 dark:bg-dclr7 border-2 border-transparent focus:border-clr4 rounded-2xl p-4 text-clr2 dark:text-dclr2 outline-none transition-all font-bold text-lg text-center tracking-widest shadow-inner" 
              />
              {errors.rut && <p className="text-clr4 text-[0.8em] mt-2 ml-4 font-black uppercase tracking-wider">{errors.rut.message}</p>}
            </div>

            <div>
              <label className="block text-[0.8em] font-black uppercase tracking-widest text-clr3 mb-2 ml-4">Contraseña</label>
              <input 
                type="password" 
                {...register('password')} 
                className="w-full bg-clr7 dark:bg-dclr7 border-2 border-transparent focus:border-clr4 rounded-2xl p-4 text-clr2 dark:text-dclr2 outline-none transition-all font-bold text-sm shadow-inner" 
                placeholder="••••••••"
              />
              {errors.password && <p className="text-clr4 text-[0.8em] mt-2 ml-4 font-black uppercase tracking-wider">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="p-4 bg-clr4 border-l-4 border-clr4 text-clr4 text-xs rounded-xl font-bold">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-clr4 text-clr1 font-black font-display uppercase rounded-[2rem] shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest text-sm disabled:opacity-50"
            >
              {loading ? 'Validando...' : 'Iniciar Sesión'}
            </button>

            <div className="text-center pt-6 border-t border-clr7 dark:border-dclr7 mt-8">
              <p className="text-[0.8em] font-bold text-clr3 uppercase tracking-widest leading-loose">
                ¿Aún no eres parte?<br />
                <Link href="/registro" className="text-clr4 font-black hover:underline underline-offset-4">Inicia tu registro aquí</Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
