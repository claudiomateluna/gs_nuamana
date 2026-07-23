import { describe, it, expect } from 'vitest';
import {
  getObjetivoTerm,
  getEvalLabel,
  getFieldColor,
  getFieldLabel,
  getFieldBgColor,
  getFieldTextColor,
  getFieldLogoPath,
  getFieldEmoji,
  getSpecialtyInsigniaPath,
  EVAL_SCALE,
} from '@/lib/progression-utils';

describe('getObjetivoTerm', () => {
  it('returns huella for unidad 1 (Manada)', () => {
    expect(getObjetivoTerm(1)).toBe('huella');
  });

  it('returns desafío for unidad 2 (Compañía)', () => {
    expect(getObjetivoTerm(2)).toBe('desafío');
  });

  it('returns desafío for unidad 3 (Tropa)', () => {
    expect(getObjetivoTerm(3)).toBe('desafío');
  });

  it('returns objetivo for unidad 4 (Avanzada)', () => {
    expect(getObjetivoTerm(4)).toBe('objetivo');
  });

  it('returns objetivo for unidad 5 (Clan)', () => {
    expect(getObjetivoTerm(5)).toBe('objetivo');
  });

  it('returns default objetivo for unknown unit', () => {
    expect(getObjetivoTerm(99)).toBe('objetivo');
  });

  it('returns default objetivo for 0', () => {
    expect(getObjetivoTerm(0)).toBe('objetivo');
  });
});

describe('getEvalLabel', () => {
  it('returns correct label with huella for Manada', () => {
    const label = getEvalLabel(1, 1);
    expect(label).toBe('Siento que no se pudo ver el/la huella');
  });

  it('returns correct label with desafío for Compañía', () => {
    const label = getEvalLabel(5, 2);
    expect(label).toBe('Participe en la actividad desarrollando esta/este desafío');
  });

  it('returns correct label with objetivo for Clan', () => {
    const label = getEvalLabel(8, 5);
    expect(label).toBe('Lo que logre en este/esta objetivo se puede proyectar a mi vida');
  });

  it('returns empty string for out-of-range value', () => {
    expect(getEvalLabel(0, 1)).toBe('');
    expect(getEvalLabel(9, 1)).toBe('');
  });

  it('handles all 8 evaluation levels', () => {
    for (let i = 1; i <= 8; i++) {
      const label = getEvalLabel(i, 1);
      expect(label).toBeTruthy();
      expect(label).toContain('huella');
    }
  });
});

describe('EVAL_SCALE', () => {
  it('has 8 entries', () => {
    expect(EVAL_SCALE).toHaveLength(8);
  });

  it('has values 1 through 8', () => {
    EVAL_SCALE.forEach((item, idx) => {
      expect(item.value).toBe(idx + 1);
    });
  });

  it('each label contains {term} placeholder', () => {
    EVAL_SCALE.forEach((item) => {
      expect(item.label).toContain('{term}');
    });
  });
});

describe('getFieldColor', () => {
  const cases: [string, string][] = [
    ['arte_expresion', '#dd0061'],
    ['deportes', '#b78913'],
    ['ciencia_tecnologia', '#261d4e'],
    ['aire_libre', '#29397d'],
    ['espiritual', '#0093c4'],
    ['servicio_comunidad', '#00a946'],
  ];

  it.each(cases)('returns %s color for %s', (field, expected) => {
    expect(getFieldColor(field)).toBe(expected);
  });

  it('returns default color for unknown field', () => {
    expect(getFieldColor('unknown')).toBe('#1b1b1b');
  });

  it('returns default color for empty string', () => {
    expect(getFieldColor('')).toBe('#1b1b1b');
  });
});

describe('getFieldLabel', () => {
  const cases: [string, string][] = [
    ['arte_expresion', 'Arte y Cultura'],
    ['deportes', 'Deportes y Juegos'],
    ['ciencia_tecnologia', 'Ciencia y Tecnología'],
    ['aire_libre', 'Vida al Aire Libre'],
    ['espiritual', 'Vida Espiritual'],
    ['servicio_comunidad', 'Servicio y Comunidad'],
  ];

  it.each(cases)('returns "%s" for %s', (field, expected) => {
    expect(getFieldLabel(field)).toBe(expected);
  });

  it('returns raw field string for unknown field', () => {
    expect(getFieldLabel('unknown')).toBe('unknown');
  });

  it('returns empty string for empty input', () => {
    expect(getFieldLabel('')).toBe('');
  });
});

describe('getFieldBgColor', () => {
  const cases: [string, string][] = [
    ['arte_expresion', '#fe3075'],
    ['deportes', '#d9d306'],
    ['ciencia_tecnologia', '#a479b0'],
    ['aire_libre', '#00aef5'],
    ['espiritual', '#dbebf3'],
    ['servicio_comunidad', '#7bc02c'],
  ];

  it.each(cases)('returns %s for %s', (field, expected) => {
    expect(getFieldBgColor(field)).toBe(expected);
  });

  it('returns default for unknown', () => {
    expect(getFieldBgColor('unknown')).toBe('#f3f4f6');
  });
});

describe('getFieldTextColor', () => {
  const whiteFields = ['arte_expresion', 'ciencia_tecnologia', 'aire_libre', 'servicio_comunidad'];
  const darkFields = ['deportes', 'espiritual'];

  it.each(whiteFields)('returns white text for %s', (field) => {
    expect(getFieldTextColor(field)).toBe('#ffffff');
  });

  it.each(darkFields)('returns dark text for %s', (field) => {
    expect(getFieldTextColor(field)).toBe('#1b1b1b');
  });

  it('returns default dark text for unknown', () => {
    expect(getFieldTextColor('unknown')).toBe('#1b1b1b');
  });
});

describe('getFieldLogoPath', () => {
  const fields = [
    'arte_expresion',
    'deportes',
    'ciencia_tecnologia',
    'aire_libre',
    'espiritual',
    'servicio_comunidad',
  ];

  it.each(fields)('returns correct SVG path for %s', (field) => {
    expect(getFieldLogoPath(field)).toBe(`/images/especialidades/${field}.svg`);
  });

  it('returns generic path for unknown', () => {
    expect(getFieldLogoPath('unknown')).toBe('/images/especialidades/generico.svg');
  });
});

describe('getFieldEmoji', () => {
  const cases: [string, string][] = [
    ['arte_expresion', '🎨'],
    ['deportes', '⚽'],
    ['ciencia_tecnologia', '🔬'],
    ['aire_libre', '⛺'],
    ['espiritual', '🧘'],
    ['servicio_comunidad', '🤝'],
  ];

  it.each(cases)('returns %s for %s', (field, expected) => {
    expect(getFieldEmoji(field)).toBe(expected);
  });

  it('returns default emoji for unknown', () => {
    expect(getFieldEmoji('unknown')).toBe('🎖️');
  });
});

describe('getSpecialtyInsigniaPath', () => {
  it('returns generic path for empty string', () => {
    expect(getSpecialtyInsigniaPath('')).toBe('/images/especialidades/generico.svg');
  });

  it('normalizes accented characters', () => {
    expect(getSpecialtyInsigniaPath('Ciencia y Tecnología')).toBe(
      '/images/especialidades/ciencia_y_tecnologia.svg'
    );
  });

  it('lowercases the name', () => {
    expect(getSpecialtyInsigniaPath('Arte Expresion')).toBe(
      '/images/especialidades/arte_expresion.svg'
    );
  });

  it('replaces spaces and special chars with underscores', () => {
    expect(getSpecialtyInsigniaPath('Aire Libre & Naturaleza')).toBe(
      '/images/especialidades/aire_libre_naturaleza.svg'
    );
  });

  it('trims leading and trailing underscores', () => {
    expect(getSpecialtyInsigniaPath('  Deportes  ')).toBe(
      '/images/especialidades/deportes.svg'
    );
  });

  it('handles simple lowercase input unchanged', () => {
    expect(getSpecialtyInsigniaPath('espiritual')).toBe(
      '/images/especialidades/espiritual.svg'
    );
  });
});
