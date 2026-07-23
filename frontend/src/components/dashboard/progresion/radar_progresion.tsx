'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip
} from 'recharts'
import { getRoleIds } from '@/lib/roles'

interface RadarProgresionProps {
  perfilId: string
  unidadColor?: string
}

interface RadarDataPoint {
  subject: string
  nnj: number
  dirigente: number
  apoderado: number
  fullMark: number
}

export default function RadarProgresion({ perfilId, unidadColor = '#cb3327' }: RadarProgresionProps) {
  const [data, setData] = useState<RadarDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (perfilId) {
      fetchData()
    }
  }, [perfilId, unidadColor])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: evals, error } = await supabase
        .from('evaluacion_objetivos')
        .select(`
          valor, 
          area, 
          evaluador:perfiles!evaluador_id(rol_id)
        `)
        .eq('perfil_id', perfilId)
      
      if (error) throw error

      const areas = [
        'Corporalidad', 'Creatividad', 'Carácter', 
        'Afectividad', 'Sociabilidad', 'Espiritualidad'
      ]

      const chartData: RadarDataPoint[] = areas.map(area => {
        const areaEvals = evals?.filter(e => e.area === area) || []
        
        const getAvg = (rolIds: number[]) => {
          const filtered = areaEvals.filter(e => {
            const ev = e.evaluador as { rol_id?: number } | { rol_id?: number }[] | null
            const rolId = Array.isArray(ev) ? ev[0]?.rol_id : ev?.rol_id
            return rolId != null && rolIds.includes(rolId)
          })
          if (filtered.length === 0) return 0
          const sum = filtered.reduce((acc, curr) => acc + curr.valor, 0)
          return parseFloat((sum / filtered.length).toFixed(1))
        }

        return {
          subject: area,
          nnj: getAvg(getRoleIds('nnj')),
          dirigente: getAvg(getRoleIds('directivos')),
          apoderado: getAvg(getRoleIds('adultos')),
          fullMark: 8
        }
      })

      setData(chartData)
    } catch (err: unknown) {
      console.error('Error fetching radar data:', err instanceof Error ? err.message : err)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="h-64 flex items-center justify-center animate-pulse text-[1em] font-bold uppercase opacity-40">Generando Radar...</div>

  return (
    <div className="w-full h-[400px] bg-white dark:bg-black/20 rounded-[1rem] p-6 border border-zinc-100 dark:border-clr4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#9ca3af', fontSize: 16, fontWeight: '900' }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 8]} tick={false} axisLine={false} />
          
          <Radar
            name="Mi Percepción"
            dataKey="nnj"
            stroke={unidadColor}
            fill={unidadColor}
            fillOpacity={0.3}
          />
          <Radar
            name="Dirigentes"
            dataKey="dirigente"
            stroke="#1b1b1b"
            fill="#1b1b1b"
            fillOpacity={0.1}
          />
          <Radar
            name="Apoderado"
            dataKey="apoderado"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.1}
          />
          
          <Tooltip 
            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '1em', fontWeight: 'bold' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '1em', fontWeight: '900', textTransform: 'uppercase' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
