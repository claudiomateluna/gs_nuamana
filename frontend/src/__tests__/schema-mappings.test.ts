import { describe, it, expect } from 'vitest';
import {
  areasThings,
  cantidadPlayers,
  duracionIso,
  lugaresPlaces,
  objetivosQuest,
  stringsAThing,
  unidadRango,
} from '@/lib/schema/mappings';
import { sinAcentos, stripHtml, titleCase } from '@/lib/schema/normalize';

describe('stripHtml', () => {
  it('removes tags and collapses whitespace', () => {
    expect(stripHtml('<p>Hola   <strong>mundo</strong></p>')).toBe('Hola mundo');
  });

  it('removes script and style blocks with their content', () => {
    expect(stripHtml('<style>.a{color:red}</style><script>alert(1)</script>Texto')).toBe('Texto');
  });

  it('keeps words apart when block tags are removed', () => {
    expect(stripHtml('<h2>Preparación</h2><p>Reúnan las antorchas.</p>')).toBe(
      'Preparación Reúnan las antorchas.',
    );
    expect(stripHtml('pic<strong>ture</strong>')).toBe('picture');
  });

  it('decodes the basic entities', () => {
    expect(stripHtml('a &amp; b &lt;c&gt; &quot;d&quot; &#39;e&#39;')).toBe('a & b <c> "d" \'e\'');
  });

  it('removes the invisible characters the app cleans when displaying', () => {
    expect(stripHtml('Hola&nbsp;mundo&shy;abc&#173;def\u200Bghi')).toBe('Hola mundoabcdefghi');
    expect(stripHtml('a\u00A0b')).toBe('a b');
  });

  it('returns an empty string for null and undefined', () => {
    expect(stripHtml(null)).toBe('');
    expect(stripHtml(undefined)).toBe('');
  });
});

describe('sinAcentos', () => {
  it('collides accented and plain spellings', () => {
    expect(sinAcentos('compañía')).toBe('compania');
    expect(sinAcentos('carácter')).toBe('caracter');
    expect(sinAcentos('compañía')).toBe(sinAcentos('compania'));
  });
});

describe('titleCase', () => {
  it('capitalizes each word keeping accents', () => {
    expect(titleCase('sociabilidad')).toBe('Sociabilidad');
    expect(titleCase('campo abierto')).toBe('Campo Abierto');
    expect(titleCase('carácter')).toBe('Carácter');
  });

  it('returns an empty string for empty input', () => {
    expect(titleCase('')).toBe('');
    expect(titleCase(null)).toBe('');
  });
});

describe('unidadRango', () => {
  it('maps a single unit to its range', () => {
    expect(unidadRango(['manada'])).toBe('7-11');
    expect(unidadRango(['tropa'])).toBe('11-15');
    expect(unidadRango(['avanzada'])).toBe('15-17');
    expect(unidadRango(['clan'])).toBe('17-20');
  });

  it('unions multiple units into one range', () => {
    expect(unidadRango(['manada', 'clan'])).toBe('7-20');
    expect(unidadRango(['manada', 'compania'])).toBe('7-15');
  });

  it('ignores accents and casing', () => {
    expect(unidadRango(['compañía'])).toBe('11-15');
    expect(unidadRango(['Compañía'])).toBe('11-15');
    expect(unidadRango(['MANADA'])).toBe('7-11');
  });

  it('ignores unknown units', () => {
    expect(unidadRango(['piratas'])).toBeUndefined();
    expect(unidadRango(['manada', 'piratas'])).toBe('7-11');
    expect(unidadRango([])).toBeUndefined();
    expect(unidadRango(null)).toBeUndefined();
    expect(unidadRango(undefined)).toBeUndefined();
  });
});

describe('duracionIso', () => {
  it('converts plain minutes', () => {
    expect(duracionIso('05 minutos')).toBe('PT5M');
    expect(duracionIso('15 minutos')).toBe('PT15M');
    expect(duracionIso('20 minutos')).toBe('PT20M');
  });

  it('splits minutes into hours when possible', () => {
    expect(duracionIso('60 minutos')).toBe('PT1H');
    expect(duracionIso('90 minutos')).toBe('PT1H30M');
    expect(duracionIso('120 minutos')).toBe('PT2H');
    expect(duracionIso('180 minutos')).toBe('PT3H');
  });

  it('tolerates surrounding and repeated spaces', () => {
    expect(duracionIso('  45   minutos  ')).toBe('PT45M');
  });

  it('maps a whole day to one day', () => {
    expect(duracionIso('todo el día')).toBe('P1D');
  });

  it('accepts the hour forms stored in production', () => {
    expect(duracionIso('01 hora')).toBe('PT1H');
    expect(duracionIso('2 horas')).toBe('PT2H');
    expect(duracionIso('1 hora 30 minutos')).toBe('PT1H30M');
    expect(duracionIso('0 horas')).toBeUndefined();
  });

  it('rejects unknown formats', () => {
    expect(duracionIso('30 min')).toBeUndefined();
    expect(duracionIso('media hora')).toBeUndefined();
    expect(duracionIso('')).toBeUndefined();
    expect(duracionIso(null)).toBeUndefined();
    expect(duracionIso(undefined)).toBeUndefined();
  });
});

describe('cantidadPlayers', () => {
  it('parses the number dropping leading zeros', () => {
    expect(cantidadPlayers('04 participantes')).toEqual({
      '@type': 'QuantitativeValue',
      value: 4,
      minValue: 4,
      maxValue: 4,
      unitText: 'People',
    });
    expect(cantidadPlayers('32 participantes')).toEqual({
      '@type': 'QuantitativeValue',
      value: 32,
      minValue: 32,
      maxValue: 32,
      unitText: 'People',
    });
  });

  it('maps individual to a plain number', () => {
    expect(cantidadPlayers('individual')).toBe(1);
  });

  it('keeps a label without digits, schema.org allows Text', () => {
    expect(cantidadPlayers('Toda la Unidad')).toBe('Toda la Unidad');
    expect(cantidadPlayers('un grupo grande')).toBe('un grupo grande');
  });

  it('rejects unusable values', () => {
    expect(cantidadPlayers(null)).toBeUndefined();
    expect(cantidadPlayers(undefined)).toBeUndefined();
    expect(cantidadPlayers('')).toBeUndefined();
    expect(cantidadPlayers('   ')).toBeUndefined();
  });
});

describe('lugaresPlaces', () => {
  it('title-cases and dedupes', () => {
    expect(lugaresPlaces(['campo abierto', 'Bosque', 'campo abierto'])).toEqual([
      { '@type': 'Place', name: 'Campo Abierto' },
      { '@type': 'Place', name: 'Bosque' },
    ]);
  });

  it('ignores empty strings and empty lists', () => {
    expect(lugaresPlaces(['', '   '])).toBeUndefined();
    expect(lugaresPlaces([])).toBeUndefined();
    expect(lugaresPlaces(null)).toBeUndefined();
  });
});

describe('areasThings', () => {
  it('title-cases and dedupes', () => {
    expect(areasThings(['corporalidad', 'carácter', 'Corporalidad'])).toEqual([
      { '@type': 'Thing', name: 'Corporalidad' },
      { '@type': 'Thing', name: 'Carácter' },
    ]);
  });

  it('rejects empty input', () => {
    expect(areasThings([])).toBeUndefined();
    expect(areasThings(undefined)).toBeUndefined();
  });
});

describe('stringsAThing', () => {
  it('keeps plain strings without title-casing', () => {
    expect(stringsAThing(['piedras', 'cuerda larga'])).toEqual(['piedras', 'cuerda larga']);
  });

  it('splits legacy comma-separated strings', () => {
    expect(stringsAThing('piedras, cuerda')).toEqual(['piedras', 'cuerda']);
  });

  it('rejects empty input', () => {
    expect(stringsAThing([])).toBeUndefined();
    expect(stringsAThing('')).toBeUndefined();
    expect(stringsAThing(null)).toBeUndefined();
  });
});

describe('objetivosQuest', () => {
  it('joins objectives and closes the description with a period', () => {
    expect(objetivosQuest(['Aprender a trabajar en equipo', 'Disfrutar el juego'])).toEqual({
      '@type': 'Thing',
      name: 'Objetivos',
      description: 'Aprender a trabajar en equipo. Disfrutar el juego.',
    });
  });

  it('does not duplicate a trailing period', () => {
    expect(objetivosQuest(['Jugar seguro.'])).toEqual({
      '@type': 'Thing',
      name: 'Objetivos',
      description: 'Jugar seguro.',
    });
    expect(objetivosQuest(['Uno.', 'Dos'])?.description).toBe('Uno. Dos.');
  });

  it('treats a legacy string as ONE objective, never splits it on commas', () => {
    expect(objetivosQuest('Trabajar en equipo, escucha activa')).toEqual({
      '@type': 'Thing',
      name: 'Objetivos',
      description: 'Trabajar en equipo, escucha activa.',
    });
  });

  it('rejects empty input', () => {
    expect(objetivosQuest([])).toBeUndefined();
    expect(objetivosQuest(null)).toBeUndefined();
    expect(objetivosQuest(undefined)).toBeUndefined();
  });
});
