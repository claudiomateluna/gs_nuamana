const fs = require('fs');
const file = 'frontend/src/components/dashboard/dash_ciclo.tsx';
let str = fs.readFileSync(file, 'utf8');

// 1. Añadir estados locales
if (!str.includes('const [votosTotales, setVotosTotales]')) {
    const stateInsertion = `  const [votosTotales, setVotosTotales] = useState(1)
  const [votosMax, setVotosMax] = useState(1)
  const [votosIlimitados, setVotosIlimitados] = useState(false)
  const [savingRules, setSavingRules] = useState(false)`;
    str = str.replace('const [error, setError] = useState<string | null>(null)', 'const [error, setError] = useState<string | null>(null)\n' + stateInsertion);
}

// 2. Inicializar estados en fetchCiclo
const oldInit = 'if (currentCiclo) {';
const newInit = `if (currentCiclo) {
        setVotosTotales(currentCiclo.votos_totales_por_persona || 1)
        setVotosMax(currentCiclo.votos_max_por_propuesta || 1)
        setVotosIlimitados(currentCiclo.votos_ilimitados || false)`;

if (str.includes(oldInit) && !str.includes('setVotosTotales(currentCiclo')) {
    str = str.replace(oldInit, newInit);
}

// 3. Añadir función para guardar reglas
const saveFunc = `  const guardarReglasVotacion = async () => {
    if (!cicloActivo) return
    setSavingRules(true)
    try {
      const { error } = await supabase
        .from('ciclos_unidad')
        .update({ 
          votos_totales_por_persona: votosTotales,
          votos_max_por_propuesta: votosMax,
          votos_ilimitados: votosIlimitados
        })
        .eq('id', cicloActivo.id)
      
      if (error) throw error
      alert('Reglas de votación actualizadas.')
      fetchCiclo(true)
    } catch (err: any) {
      alert('Error al guardar reglas: ' + err.message)
    } finally {
      setSavingRules(false)
    }
  }

  const guardarEvaluacion = async () => {`;

if (str.includes('const guardarEvaluacion = async () => {') && !str.includes('const guardarReglasVotacion = async')) {
    str = str.replace('const guardarEvaluacion = async () => {', saveFunc);
}

// 4. Modificar fetchCiclo para soportar modo silencioso
if (!str.includes('fetchCiclo = async (silent: boolean = false)')) {
    str = str.replace('const fetchCiclo = async () => {', 'const fetchCiclo = async (silent: boolean = false) => {');
    str = str.replace('setLoading(true)', 'if (!silent) setLoading(true)');
}

// 5. Actualizar los fetchCiclo() en el useEffect
str = str.replace('fetchCiclo()', 'fetchCiclo(false)');

fs.writeFileSync(file, str, 'utf8');
console.log('Refactored rules logic successfully');
