import { describe, it, expect } from 'vitest'
import {
  Rol,
  hasRole,
  hasAnyRole,
  isDirectivo,
  isNNJ,
  isDirigenteOrGuiadora,
  isDirectivaPadres,
  isAdultoConPupilos,
  isNNJConAgenda,
  canSeeTreasury,
  canActionTreasury,
  canSeeAllTabs,
  isAdmin,
  isApoderado,
  canViewOthersProgression,
  canSyncOffline,
  canProgramActivity,
  canDeleteUser,
  canSeeGroupMembers,
  canSeeAllArticles,
  canCloseRecaudacion,
  canManageInventory,
  canCreateActa,
  getRoleIds,
} from '@/lib/roles'

// Helper para crear perfiles mock
const perfil = (rol_id: number | null) => ({ rol_id })

describe('Rol enum', () => {
  it('should have correct numeric values', () => {
    expect(Rol.Admin).toBe(1)
    expect(Rol.Dirigente).toBe(2)
    expect(Rol.Guiadora).toBe(3)
    expect(Rol.Apoderado).toBe(8)
    expect(Rol.NNJ1).toBe(9)
    expect(Rol.NNJ5).toBe(13)
    expect(Rol.Restringido).toBe(14)
  })
})

describe('hasRole', () => {
  it('returns true when perfil has exact role', () => {
    expect(hasRole(perfil(1), Rol.Admin)).toBe(true)
  })

  it('returns false when perfil has different role', () => {
    expect(hasRole(perfil(2), Rol.Admin)).toBe(false)
  })

  it('returns false when rol_id is null', () => {
    expect(hasRole(perfil(null), Rol.Admin)).toBe(false)
  })
})

describe('hasAnyRole', () => {
  it('returns true when perfil has one of the roles', () => {
    expect(hasAnyRole(perfil(2), [Rol.Admin, Rol.Dirigente])).toBe(true)
  })

  it('returns false when perfil has none of the roles', () => {
    expect(hasAnyRole(perfil(9), [Rol.Admin, Rol.Dirigente])).toBe(false)
  })
})

describe('isDirectivo', () => {
  it.each([Rol.Admin, Rol.Dirigente, Rol.Guiadora])('rol %i is directivo', (rol) => {
    expect(isDirectivo(perfil(rol))).toBe(true)
  })

  it.each([Rol.Apoderado, Rol.NNJ1, Rol.Restringido, Rol.DirectivaPadres4])('rol %i is NOT directivo', (rol) => {
    expect(isDirectivo(perfil(rol))).toBe(false)
  })

  it('returns false for null', () => {
    expect(isDirectivo(perfil(null))).toBe(false)
  })
})

describe('isNNJ', () => {
  it.each([9, 10, 11, 12, 13])('rol %i is NNJ', (rol) => {
    expect(isNNJ(perfil(rol))).toBe(true)
  })

  it.each([1, 2, 8, 14])('rol %i is NOT NNJ', (rol) => {
    expect(isNNJ(perfil(rol))).toBe(false)
  })
})

describe('isDirigenteOrGuiadora', () => {
  it('returns true for Dirigente', () => {
    expect(isDirigenteOrGuiadora(perfil(2))).toBe(true)
  })

  it('returns true for Guiadora', () => {
    expect(isDirigenteOrGuiadora(perfil(3))).toBe(true)
  })

  it('returns false for Admin', () => {
    expect(isDirigenteOrGuiadora(perfil(1))).toBe(false)
  })
})

describe('isDirectivaPadres', () => {
  it.each([4, 5, 6, 7])('rol %i is DirectivaPadres', (rol) => {
    expect(isDirectivaPadres(perfil(rol))).toBe(true)
  })

  it.each([1, 2, 3, 8, 9])('rol %i is NOT DirectivaPadres', (rol) => {
    expect(isDirectivaPadres(perfil(rol))).toBe(false)
  })
})

describe('isAdultoConPupilos', () => {
  it.each([2, 3, 4, 5, 6, 7, 8])('rol %i can see pupils', (rol) => {
    expect(isAdultoConPupilos(perfil(rol))).toBe(true)
  })

  it.each([1, 9, 10, 14])('rol %i cannot see pupils', (rol) => {
    expect(isAdultoConPupilos(perfil(rol))).toBe(false)
  })
})

describe('isNNJConAgenda', () => {
  it('returns true for NNJ4 (12)', () => {
    expect(isNNJConAgenda(perfil(12))).toBe(true)
  })

  it('returns true for NNJ5 (13)', () => {
    expect(isNNJConAgenda(perfil(13))).toBe(true)
  })

  it.each([9, 10, 11, 1, 8])('rol %i does NOT have agenda', (rol) => {
    expect(isNNJConAgenda(perfil(rol))).toBe(false)
  })
})

describe('canSeeTreasury', () => {
  it.each([1, 2, 3, 4, 5, 6, 7, 8])('rol %i can see treasury', (rol) => {
    expect(canSeeTreasury(perfil(rol))).toBe(true)
  })

  it.each([9, 10, 13, 14])('rol %i cannot see treasury', (rol) => {
    expect(canSeeTreasury(perfil(rol))).toBe(false)
  })
})

describe('canActionTreasury', () => {
  it.each([1, 2, 3, 4, 5, 6, 7])('rol %i can action treasury', (rol) => {
    expect(canActionTreasury(perfil(rol))).toBe(true)
  })

  it.each([8, 9, 10, 14])('rol %i cannot action treasury', (rol) => {
    expect(canActionTreasury(perfil(rol))).toBe(false)
  })
})

describe('canSeeAllTabs', () => {
  it('returns true for all roles except Restringido', () => {
    for (let rol = 1; rol <= 13; rol++) {
      expect(canSeeAllTabs(perfil(rol))).toBe(true)
    }
  })

  it('returns false for Restringido (14)', () => {
    expect(canSeeAllTabs(perfil(14))).toBe(false)
  })
})

describe('isAdmin', () => {
  it('returns true only for Admin (1)', () => {
    expect(isAdmin(perfil(1))).toBe(true)
  })

  it.each([2, 3, 8, 14])('rol %i is NOT admin', (rol) => {
    expect(isAdmin(perfil(rol))).toBe(false)
  })
})

describe('isApoderado', () => {
  it('returns true only for Apoderado (8)', () => {
    expect(isApoderado(perfil(8))).toBe(true)
  })

  it.each([1, 2, 7, 9])('rol %i is NOT apoderado', (rol) => {
    expect(isApoderado(perfil(rol))).toBe(false)
  })
})

describe('canViewOthersProgression', () => {
  it.each([1, 2, 3])('directivo (rol %i) can view others', (rol) => {
    expect(canViewOthersProgression(perfil(rol))).toBe(true)
  })

  it('apoderado can view others', () => {
    expect(canViewOthersProgression(perfil(8))).toBe(true)
  })

  it.each([9, 10, 12, 14])('rol %i cannot view others', (rol) => {
    expect(canViewOthersProgression(perfil(rol))).toBe(false)
  })
})

describe('permission aliases', () => {
  it('canSyncOffline delegates to isDirectivo', () => {
    expect(canSyncOffline(perfil(1))).toBe(true)
    expect(canSyncOffline(perfil(8))).toBe(false)
  })

  it('canProgramActivity delegates to isDirectivo', () => {
    expect(canProgramActivity(perfil(2))).toBe(true)
    expect(canProgramActivity(perfil(9))).toBe(false)
  })

  it('canDeleteUser delegates to isAdmin', () => {
    expect(canDeleteUser(perfil(1))).toBe(true)
    expect(canDeleteUser(perfil(2))).toBe(false)
  })

  it('canSeeGroupMembers delegates to isDirectivo', () => {
    expect(canSeeGroupMembers(perfil(3))).toBe(true)
    expect(canSeeGroupMembers(perfil(8))).toBe(false)
  })

  it('canSeeAllArticles delegates to isDirectivo', () => {
    expect(canSeeAllArticles(perfil(1))).toBe(true)
    expect(canSeeAllArticles(perfil(9))).toBe(false)
  })

  it('canCloseRecaudacion delegates to canActionTreasury', () => {
    expect(canCloseRecaudacion(perfil(7))).toBe(true)
    expect(canCloseRecaudacion(perfil(8))).toBe(false)
  })

  it('canManageInventory delegates to isDirectivo', () => {
    expect(canManageInventory(perfil(1))).toBe(true)
    expect(canManageInventory(perfil(9))).toBe(false)
  })

  it('canCreateActa delegates to isDirectivo', () => {
    expect(canCreateActa(perfil(2))).toBe(true)
    expect(canCreateActa(perfil(8))).toBe(false)
  })
})

describe('getRoleIds', () => {
  it('directivos returns [1, 2, 3]', () => {
    expect(getRoleIds('directivos')).toEqual([1, 2, 3])
  })

  it('nnj returns [9, 10, 11, 12, 13]', () => {
    expect(getRoleIds('nnj')).toEqual([9, 10, 11, 12, 13])
  })

  it('directivaPadres returns [4, 5, 6, 7]', () => {
    expect(getRoleIds('directivaPadres')).toEqual([4, 5, 6, 7])
  })

  it('adultos returns [2, 3, 4, 5, 6, 7, 8]', () => {
    expect(getRoleIds('adultos')).toEqual([2, 3, 4, 5, 6, 7, 8])
  })

  it('dirigentes returns [2, 3]', () => {
    expect(getRoleIds('dirigentes')).toEqual([2, 3])
  })
})
