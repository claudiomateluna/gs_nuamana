import { describe, it, expect } from 'vitest';
import { validarRut } from '@/lib/validation-utils';

describe('validarRut', () => {
  it('accepts valid RUT 11111111-1', () => {
    expect(validarRut('11111111-1')).toBe(true);
  });

  it('accepts valid RUT 12345678-5', () => {
    expect(validarRut('12345678-5')).toBe(true);
  });

  it('accepts valid RUT with lowercase k', () => {
    expect(validarRut('11111112-k')).toBe(true);
  });

  it('accepts valid RUT with uppercase K', () => {
    expect(validarRut('11111112-K')).toBe(true);
  });

  it('accepts valid RUT with numeric verifier 0', () => {
    expect(validarRut('11112-0')).toBe(true);
  });

  it('rejects RUT with invalid check digit', () => {
    expect(validarRut('11111111-2')).toBe(false);
  });

  it('rejects RUT with wrong check digit for 12345678', () => {
    expect(validarRut('12345678-0')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(validarRut('')).toBe(false);
  });

  it('rejects null-ish empty string', () => {
    expect(validarRut(' ')).toBe(false);
  });

  it('rejects RUT with wrong format — no dash', () => {
    expect(validarRut('111111111')).toBe(false);
  });

  it('rejects RUT with wrong format — letters in body', () => {
    expect(validarRut('abcde1111-1')).toBe(false);
  });

  it('rejects RUT with special characters — dot separator', () => {
    expect(validarRut('12.345.678-1')).toBe(false);
  });

  it('rejects RUT with spaces', () => {
    expect(validarRut('12 345 678-1')).toBe(false);
  });

  it('rejects RUT with multiple dashes', () => {
    expect(validarRut('11-111-111-1')).toBe(false);
  });

  it('rejects RUT with trailing characters', () => {
    expect(validarRut('11111111-1 ')).toBe(false);
  });

  it('rejects RUT with unicode long dash (‐) — passes regex but fails split', () => {
    expect(validarRut('11111111‐1')).toBe(false);
  });

  it('handles short RUT (5 digits)', () => {
    expect(validarRut('11112-0')).toBe(true);
  });

  it('rejects RUT with only digits and no separator', () => {
    expect(validarRut('11111111')).toBe(false);
  });

  it('rejects RUT with separator but no verifier', () => {
    expect(validarRut('11111111-')).toBe(false);
  });
});
