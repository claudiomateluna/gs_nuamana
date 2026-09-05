import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ---------------------------------------------------------------------------
// R1 (spec): the `.dark` block of src/app/globals.css MUST map --background to
// var(--dclr1) and --foreground to var(--dclr2), while :root keeps the 74
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
  it('declares all 96 palette variables in the first :root block', () => {
    const css = readGlobalsCss();
    const rootBlock = blockFor(css, /:root/);
    for (let i = 1; i <= 10; i++) {
      expect(rootBlock, `--clr${i} must be declared in :root`).toContain(`--clr${i}:`);
      expect(rootBlock, `--dclr${i} must be declared in :root`).toContain(`--dclr${i}:`);
    }
    for (let i = 1; i <= 6; i++) {
      expect(rootBlock, `--tclr${i} must be declared in :root`).toContain(`--tclr${i}:`);
      expect(rootBlock, `--tdclr${i} must be declared in :root`).toContain(`--tdclr${i}:`);
    }
    for (let i = 1; i <= 13; i++) {
      expect(rootBlock, `--hclr${i} must be declared in :root`).toContain(`--hclr${i}:`);
      expect(rootBlock, `--hdclr${i} must be declared in :root`).toContain(`--hdclr${i}:`);
    }
    for (let i = 1; i <= 11; i++) {
      expect(rootBlock, `--mclr${i} must be declared in :root`).toContain(`--mclr${i}:`);
      expect(rootBlock, `--mdclr${i} must be declared in :root`).toContain(`--mdclr${i}:`);
    }
    // Footer (10 roles) — light + dark
    for (let i = 1; i <= 10; i++) {
      expect(rootBlock, `--foclr${i} must be declared in :root`).toContain(`--foclr${i}:`);
      expect(rootBlock, `--fodclr${i} must be declared in :root`).toContain(`--fodclr${i}:`);
    }
  });

  it('declares all 18 CategoryPromoBanner variables (cbclr1-9, cbdclr1-9) in the first :root block', () => {
    const css = readGlobalsCss();
    const rootBlock = blockFor(css, /:root/);
    for (let i = 1; i <= 9; i++) {
      expect(rootBlock, `--cbclr${i} must be declared in :root`).toContain(`--cbclr${i}:`);
      expect(rootBlock, `--cbdclr${i} must be declared in :root`).toContain(`--cbdclr${i}:`);
    }
  });

  it('declares all 18 BlogSlideshow variables (bsclr1-9, bsdclr1-9) in the first :root block', () => {
    const css = readGlobalsCss();
    const rootBlock = blockFor(css, /:root/);
    for (let i = 1; i <= 9; i++) {
      expect(rootBlock, `--bsclr${i} must be declared in :root`).toContain(`--bsclr${i}:`);
      expect(rootBlock, `--bsdclr${i} must be declared in :root`).toContain(`--bsdclr${i}:`);
    }
  });

  it('declares all 16 Testimonials variables (tsclr1-8, tsdclr1-8) in the first :root block', () => {
    const css = readGlobalsCss();
    const rootBlock = blockFor(css, /:root/);
    for (let i = 1; i <= 8; i++) {
      expect(rootBlock, `--tsclr${i} must be declared in :root`).toContain(`--tsclr${i}:`);
      expect(rootBlock, `--tsdclr${i} must be declared in :root`).toContain(`--tsdclr${i}:`);
    }
  });

  it('declares all 18 VisitSection variables (vsclr1-9, vsdclr1-9) in the first :root block', () => {
    const css = readGlobalsCss();
    const rootBlock = blockFor(css, /:root/);
    for (let i = 1; i <= 9; i++) {
      expect(rootBlock, `--vsclr${i} must be declared in :root`).toContain(`--vsclr${i}:`);
      expect(rootBlock, `--vsdclr${i} must be declared in :root`).toContain(`--vsdclr${i}:`);
    }
  });

  it('binds the 18 CategoryPromoBanner colors in @theme so Tailwind emits cbclr/cbdclr utilities', () => {
    const css = readGlobalsCss();
    const themeBlock = blockFor(css, /@theme/);
    for (let i = 1; i <= 9; i++) {
      expect(themeBlock, `--color-cbclr${i} must be bound in @theme`).toContain(
        `--color-cbclr${i}: var(--cbclr${i})`,
      );
      expect(themeBlock, `--color-cbdclr${i} must be bound in @theme`).toContain(
        `--color-cbdclr${i}: var(--cbdclr${i})`,
      );
    }
  });

  it('binds the 18 BlogSlideshow colors in @theme so Tailwind emits bsclr/bsdclr utilities', () => {
    const css = readGlobalsCss();
    const themeBlock = blockFor(css, /@theme/);
    for (let i = 1; i <= 9; i++) {
      expect(themeBlock, `--color-bsclr${i} must be bound in @theme`).toContain(
        `--color-bsclr${i}: var(--bsclr${i})`,
      );
      expect(themeBlock, `--color-bsdclr${i} must be bound in @theme`).toContain(
        `--color-bsdclr${i}: var(--bsdclr${i})`,
      );
    }
  });

  it('binds the 16 Testimonials colors in @theme so Tailwind emits tsclr/tsdclr utilities', () => {
    const css = readGlobalsCss();
    const themeBlock = blockFor(css, /@theme/);
    for (let i = 1; i <= 8; i++) {
      expect(themeBlock, `--color-tsclr${i} must be bound in @theme`).toContain(
        `--color-tsclr${i}: var(--tsclr${i})`,
      );
      expect(themeBlock, `--color-tsdclr${i} must be bound in @theme`).toContain(
        `--color-tsdclr${i}: var(--tsdclr${i})`,
      );
    }
  });

  it('binds the 18 VisitSection colors in @theme so Tailwind emits vsclr/vsdclr utilities', () => {
    const css = readGlobalsCss();
    const themeBlock = blockFor(css, /@theme/);
    for (let i = 1; i <= 9; i++) {
      expect(themeBlock, `--color-vsclr${i} must be bound in @theme`).toContain(
        `--color-vsclr${i}: var(--vsclr${i})`,
      );
      expect(themeBlock, `--color-vsdclr${i} must be bound in @theme`).toContain(
        `--color-vsdclr${i}: var(--vsdclr${i})`,
      );
    }
  });

  it('declares all 16 FAQ variables (fclr1-8, fdclr1-8) in the first :root block', () => {
    const css = readGlobalsCss();
    const rootBlock = blockFor(css, /:root/);
    for (let i = 1; i <= 8; i++) {
      expect(rootBlock, `--fclr${i} must be declared in :root`).toContain(`--fclr${i}:`);
      expect(rootBlock, `--fdclr${i} must be declared in :root`).toContain(`--fdclr${i}:`);
    }
  });

  it('binds the 16 FAQ colors in @theme so Tailwind emits fclr/fdclr utilities', () => {
    const css = readGlobalsCss();
    const themeBlock = blockFor(css, /@theme/);
    for (let i = 1; i <= 8; i++) {
      expect(themeBlock, `--color-fclr${i} must be bound in @theme`).toContain(
        `--color-fclr${i}: var(--fclr${i})`,
      );
      expect(themeBlock, `--color-fdclr${i} must be bound in @theme`).toContain(
        `--color-fdclr${i}: var(--fdclr${i})`,
      );
    }
  });

  it('declares all 28 SecondaryHeader variables (shclr1-14, shdclr1-14) in the first :root block', () => {
    const css = readGlobalsCss();
    const rootBlock = blockFor(css, /:root/);
    for (let i = 1; i <= 14; i++) {
      expect(rootBlock, `--shclr${i} must be declared in :root`).toContain(`--shclr${i}:`);
      expect(rootBlock, `--shdclr${i} must be declared in :root`).toContain(`--shdclr${i}:`);
    }
  });

  it('binds the 28 SecondaryHeader colors in @theme so Tailwind emits shclr/shdclr utilities', () => {
    const css = readGlobalsCss();
    const themeBlock = blockFor(css, /@theme/);
    for (let i = 1; i <= 14; i++) {
      expect(themeBlock, `--color-shclr${i} must be bound in @theme`).toContain(
        `--color-shclr${i}: var(--shclr${i})`,
      );
      expect(themeBlock, `--color-shdclr${i} must be bound in @theme`).toContain(
        `--color-shdclr${i}: var(--shdclr${i})`,
      );
    }
  });

  it('binds the 20 Footer colors in @theme so Tailwind emits foclr/fodclr utilities', () => {
    const css = readGlobalsCss();
    const themeBlock = blockFor(css, /@theme/);
    for (let i = 1; i <= 10; i++) {
      expect(themeBlock, `--color-foclr${i} must be bound in @theme`).toContain(
        `--color-foclr${i}: var(--foclr${i})`,
      );
      expect(themeBlock, `--color-fodclr${i} must be bound in @theme`).toContain(
        `--color-fodclr${i}: var(--fodclr${i})`,
      );
    }
  });

  it('uses clr10/clr9 for scrollbar color (thumb/track) in light mode', () => {
    const css = readGlobalsCss();
    expect(css).toContain('scrollbar-color: var(--clr10) var(--clr9)');
  });

  it('uses dclr10/dclr9 for scrollbar color (thumb/track) in dark mode', () => {
    const css = readGlobalsCss();
    expect(css).toContain('scrollbar-color: var(--dclr10) var(--dclr9)');
  });

  it('uses clr10 for webkit scrollbar thumb and clr9 for track in light mode', () => {
    const css = readGlobalsCss();
    expect(css).toContain('::-webkit-scrollbar-thumb');
    expect(css).toContain('::-webkit-scrollbar-track');
    // The light thumb uses --clr10 (found in the .custom-scrollbar or main thumb rule)
    expect(css).toContain('background: var(--clr10)');
    expect(css).toContain('background: var(--clr9)');
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
    expect(rootBlock).toContain('--foreground: var(--clr2)');
  });

  it('no longer references clr4/clr1 inside the .dark block (R1 contract)', () => {
    const css = readGlobalsCss();
    const darkBlock = blockFor(css, /\.dark/);
    expect(darkBlock).not.toContain('var(--clr4)');
    expect(darkBlock).not.toContain('var(--clr1)');
  });
});
