// tests/unit/schemas/hero-content.test.ts

import { describe, it, expect } from 'vitest'
import { heroContentSchema, heroContentSchemaWithRefinements } from '@/schemas/hero'

describe('HeroContent Schema', () => {
  // Fixture de base valide
  const validHeroContent = {
    id: 'hero-main-fr',
    title: 'AIAD : Le framework pour développer avec des agents IA',
    tagline: 'Structurez votre collaboration avec l\'intelligence artificielle',
    valueProposition: 'Une méthodologie éprouvée pour intégrer les agents IA.',
    locale: 'fr',
    isActive: true,
    updatedAt: '2026-01-26T10:00:00.000Z',
  }

  describe('Validation basique', () => {
    it('T-00: should validate a correct HeroContent', () => {
      const result = heroContentSchemaWithRefinements.safeParse(validHeroContent)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe('hero-main-fr')
        expect(result.data.updatedAt).toBeInstanceOf(Date)
      }
    })

    it('T-00b: should apply default values', () => {
      const minimal = {
        id: 'hero-test',
        title: 'AIAD : Titre de test valide',
        tagline: 'Une tagline suffisamment longue',
        valueProposition: 'Une proposition de valeur complète et bien formulée.',
        updatedAt: '2026-01-26T10:00:00.000Z',
      }

      const result = heroContentSchema.safeParse(minimal)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.locale).toBe('fr')
        expect(result.data.isActive).toBe(true)
      }
    })
  })

  describe('Validation du champ id', () => {
    it('T-06: should reject id with uppercase letters', () => {
      const invalid = { ...validHeroContent, id: 'Hero-Main' }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('id')
    })

    it('T-07: should reject id with spaces', () => {
      const invalid = { ...validHeroContent, id: 'hero main' }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should reject id shorter than 3 characters', () => {
      const invalid = { ...validHeroContent, id: 'ab' }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('3 caractères')
    })
  })

  describe('Validation du champ title', () => {
    it('T-01: should accept title with exactly 80 characters', () => {
      const title80 = 'AIAD : ' + 'A'.repeat(73) // Exactement 80
      const valid = { ...validHeroContent, title: title80 }
      const result = heroContentSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('T-02: should reject title exceeding 80 characters', () => {
      const title81 = 'AIAD : ' + 'A'.repeat(74) // 81 caractères
      const invalid = { ...validHeroContent, title: title81 }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('80 caractères')
    })

    it('T-03: should reject title without AIAD (règle R1)', () => {
      const invalid = {
        ...validHeroContent,
        title: 'Le framework pour développer avec des agents IA'
      }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('AIAD')
    })

    it('should reject title shorter than 10 characters', () => {
      const invalid = { ...validHeroContent, title: 'AIAD' }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-11: should accept special characters in title', () => {
      const valid = {
        ...validHeroContent,
        title: 'AIAD : Développez avec l\'IA — rapidement & efficacement'
      }
      const result = heroContentSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ tagline', () => {
    it('T-04: should reject tagline that repeats title (règle R2)', () => {
      const invalid = {
        ...validHeroContent,
        title: 'AIAD : Le framework pour les agents IA',
        tagline: 'Le framework pour les agents IA en entreprise'
      }
      const result = heroContentSchemaWithRefinements.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('tagline')
    })

    it('should reject tagline exceeding 120 characters', () => {
      const tagline121 = 'A'.repeat(121)
      const invalid = { ...validHeroContent, tagline: tagline121 }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-12: should accept emoji in tagline', () => {
      const valid = {
        ...validHeroContent,
        tagline: 'Boostez votre productivité avec l\'IA 🚀'
      }
      const result = heroContentSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ valueProposition', () => {
    it('T-05: should reject valueProposition without ending period (règle R3)', () => {
      const invalid = {
        ...validHeroContent,
        valueProposition: 'Une méthodologie sans point final'
      }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('point')
    })

    it('should accept valueProposition ending with period', () => {
      const valid = {
        ...validHeroContent,
        valueProposition: 'Une proposition complète qui se termine correctement.'
      }
      const result = heroContentSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('T-13: should accept HTML in valueProposition (escaped at render)', () => {
      const valid = {
        ...validHeroContent,
        valueProposition: 'Une <strong>méthodologie</strong> avec du HTML.'
      }
      const result = heroContentSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ locale', () => {
    it('T-08: should reject locale with 3 characters', () => {
      const invalid = { ...validHeroContent, locale: 'fra' }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('2 caractères')
    })

    it('should accept valid 2-letter locale', () => {
      const valid = { ...validHeroContent, locale: 'en' }
      const result = heroContentSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ updatedAt', () => {
    it('T-09: should reject invalid date format', () => {
      const invalid = { ...validHeroContent, updatedAt: 'invalid-date' }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should transform valid ISO string to Date object', () => {
      const result = heroContentSchema.safeParse(validHeroContent)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.updatedAt).toBeInstanceOf(Date)
        expect(result.data.updatedAt.toISOString()).toBe('2026-01-26T10:00:00.000Z')
      }
    })
  })

  describe('Validation du champ metadata', () => {
    it('should accept valid metadata', () => {
      const valid = {
        ...validHeroContent,
        metadata: {
          seoTitle: 'AIAD - Framework IA',
          seoDescription: 'Description SEO courte.',
        },
      }
      const result = heroContentSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('should reject seoTitle exceeding 60 characters', () => {
      const invalid = {
        ...validHeroContent,
        metadata: {
          seoTitle: 'A'.repeat(61),
        },
      }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should reject seoDescription exceeding 160 characters', () => {
      const invalid = {
        ...validHeroContent,
        metadata: {
          seoDescription: 'A'.repeat(161),
        },
      }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })
  })
})
