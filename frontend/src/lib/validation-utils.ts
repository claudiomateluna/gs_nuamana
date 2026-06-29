/**
 * Valida un RUT chileno (con guion y dígito verificador).
 * Soporta guion normal (-) y guion largo (‐).
 * 
 * @param rut string con formato 12345678-9 o 12345678-K
 * @returns boolean indicando si el RUT es válido
 */
export const validarRut = (rut: string): boolean => {
  if (!rut) return false
  // Acepta números seguidos de guion y dígito verificador (número o k/K)
  if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) return false
  const [numero, dv] = rut.split('-')
  if (!numero || !dv) return false

  let sum = 0
  let mul = 2
  for (let i = numero.length - 1; i >= 0; i--) {
    sum += parseInt(numero[i]) * mul
    mul = mul === 7 ? 2 : mul + 1
  }
  const res = 11 - (sum % 11)
  const expectedDv = res === 11 ? '0' : res === 10 ? 'k' : res.toString()
  return expectedDv === dv.toLowerCase()
}
