import dynamic from 'next/dynamic'

interface RadarSnapshotItem {
  subject: string
  Autoevaluacion?: number
  Apoderado?: number
  Dirigente?: number
}

const Radar = dynamic(() => import('recharts').then(m => m.Radar), { ssr: false })
const RadarChart = dynamic(() => import('recharts').then(m => m.RadarChart), { ssr: false })
const PolarGrid = dynamic(() => import('recharts').then(m => m.PolarGrid), { ssr: false })
const PolarAngleAxis = dynamic(() => import('recharts').then(m => m.PolarAngleAxis), { ssr: false })
const PolarRadiusAxis = dynamic(() => import('recharts').then(m => m.PolarRadiusAxis), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false })
const Legend = dynamic(() => import('recharts').then(m => m.Legend), { ssr: false })

interface RadarChartLazyProps {
  data: RadarSnapshotItem[]
  themePrimary: string
  showTooltip?: boolean
  showLegend?: boolean
  outerRadius?: string
}

export default function RadarChartLazy({
  data,
  themePrimary,
  showTooltip = true,
  showLegend = true,
  outerRadius = '70%'
}: RadarChartLazyProps) {
  return (
    <div style={{ minHeight: '200px', width: '100%', height: '100%' }}>
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius={outerRadius} data={data}>
        <PolarGrid stroke="#e4e4e7" strokeWidth={1} />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 8]}
          tickCount={5}
          tick={{ fill: '#a1a1aa', fontSize: 8 }}
        />
        <Radar
          name="Mi Autoevaluación"
          dataKey="Autoevaluacion"
          stroke={themePrimary}
          fill={themePrimary}
          fillOpacity={0.2}
        />
        <Radar
          name="Apoderado"
          dataKey="Apoderado"
          stroke="#d97706"
          fill="#d97706"
          fillOpacity={0.15}
        />
        <Radar
          name="Dirigente"
          dataKey="Dirigente"
          stroke="#16a34a"
          fill="#16a34a"
          fillOpacity={0.2}
        />
        {showTooltip && (
          <Tooltip
            contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
          />
        )}
        {showLegend && (
          <Legend
            wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }}
          />
        )}
      </RadarChart>
    </ResponsiveContainer>
    </div>
  )
}
