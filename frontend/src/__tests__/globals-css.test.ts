import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ---------------------------------------------------------------------------
// R1 (spec): the `.dark` block of src/app/globals.css MUST map --background to
// var(--dclr1) and --foreground to var(--dclr2), while :root keeps the 24
// palette variables and the light background/foreground untouched.
// The test reads the real file from disk (fs.readFileSync) so a CSS regression
// fails the suite — no fixtures that could drift from the shipped stylesheet.
// ---------------------------------------------------------------------------

const GLOBALS_CSS_PATH = resolve(process.cwd(), 'src/app/globals.css');

function readGlobalsCss(): string {
  return readFileSync(GLOBALS_CSS_PATH, 'utf-8');
}

/** Extract the first `selector { ... }` block whose selector matches. */
function blockFor(css: string, selector: RegExp): string {
  const match = css.match(new RegExp(`${selector.source}\\s*\\{([^}]*)\\}`));
  expect(match, `expected a "${selector.source}" block in globals.css`).not.toBeNull();
  return match![1];
}

describe('globals.css dark theme contract (R1)', () => {
  it('declares all 24 palette variables in the first :root block', () => {
    const css = readGlobalsCss();
    const rootBlock = blockFor(css, /:root/);
    for (let i = 1; i <= 12; i++) {
      expect(rootBlock, `--clr${i} must be declared in :root`).toContain(`--clr${i}:`);
      expect(rootBlock, `--dclr${i} must be declared in :root`).toContain(`--dclr${i}:`);
    }
  });

  it('maps .dark background to var(--dclr1) and foreground to var(--dclr2)', () => {
    const css = readGlobalsCss();
    const darkBlock = blockFor(css, /\.dark/);
    expect(darkBlock).toContain('--background: var(--dclr1)');
    expect(darkBlock).toContain('--foreground: var(--dclr2)');
  });

  it('keeps the light :root background/foreground roles untouched', () => {
    const css = readGlobalsCss();
    const rootBlock = blockFor(css, /:root/);
    expect(rootBlock).toContain('--background: var(--clr1)');
    expect(rootBlock).toContain('--foreground: var(--clr4)');
  });

  it('no longer references clr4/clr1 inside the .dark block (R1 contract)', () => {
    const css = readGlobalsCss();
    const darkBlock = blockFor(css, /\.dark/);
    expect(darkBlock).not.toContain('var(--clr4)');
    expect(darkBlock).not.toContain('var(--clr1)');
  });
});
