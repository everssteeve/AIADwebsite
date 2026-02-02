// tests/unit/content/hero-main.test.ts

import { describe, it, expect, beforeAll } from 'vitest'
import { heroContentSchemaWithRefinements } from '@/schemas/hero'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('Hero Content - main.json', () => {
  let heroContent: unknown

  beforeAll(() => {
    const filePath = join(process.cwd(), 'src/content/hero/main.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    heroContent = JSON.parse(fileContent)
  })

  describe('Validation du schéma', () => {
    it('T-00: should validate against heroContentSchemaWithRefinements', () => {
      const result = heroContentSchemaWithRefinements.safeParse(heroContent)

      expect(result.success).toBe(true)
      if (!result.success) {
        console.error('Validation errors:', result.error.issues)
      }
    })

    it('T-00b: should transform updatedAt to Date object', () => {
      const result = heroContentSchemaWithRefinements.safeParse(heroContent)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.updatedAt).toBeInstanceOf(Date)
      }
    })
  })

  describe('Règle R1 - Title contient AIAD', () => {
    it('T-01: should have title containing "AIAD"', () => {
      const content = heroContent as { title: string }
      expect(content.title).toContain('AIAD')
    })

    it('T-02: should reject "aiad" in lowercase (case-sensitive check)', () => {
      // Note: Le schéma T-001-B1 implémente une vérification case-sensitive
      // "AIAD" doit être en majuscules
      const testContent = {
        ...(heroContent as object),
        title: 'aiad : Le framework pour les agents IA',
      }
      const result = heroContentSchemaWithRefinements.safeParse(testContent)

      expect(result.success).toBe(false)
    })
  })

  describe('Règle R2 - Tagline ne répète pas title', () => {
    it('T-03: should reject tagline that repeats title words > 50%', () => {
      const testContent = {
        ...(heroContent as object),
        title: 'AIAD : Le framework pour développer avec des agents IA',
        tagline: 'Le framework pour développer avec des agents IA en entreprise',
      }
      const result = heroContentSchemaWithRefinements.safeParse(testContent)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('tagline')
      }
    })

    it('should accept tagline with < 50% overlap', () => {
      const content = heroContent as { title: string; tagline: string }
      const titleWords = new Set(
        content.title
          .toLowerCase()
          .split(/\s+/)
          .filter((w) => w.length > 3)
      )
      const taglineWords = content.tagline.toLowerCase().split(/\s+/)
      const significantTaglineWords = taglineWords.filter((w) => w.length > 3)
      const overlap = significantTaglineWords.filter((w) => titleWords.has(w))

      expect(overlap.length).toBeLessThan(significantTaglineWords.length * 0.5)
    })
  })

  describe('Règle R3 - ValueProposition termine par point', () => {
    it('T-04: should reject valueProposition without ending period', () => {
      const testContent = {
        ...(heroContent as object),
        valueProposition: 'Une méthodologie sans point final',
      }
      const result = heroContentSchemaWithRefinements.safeParse(testContent)

      expect(result.success).toBe(false)
    })

    it('T-05: should accept valueProposition with trailing space after period', () => {
      const testContent = {
        ...(heroContent as object),
        valueProposition: 'Une méthodologie éprouvée pour les agents IA. ',
      }
      const result = heroContentSchemaWithRefinements.safeParse(testContent)

      expect(result.success).toBe(true)
    })

    it('should have valueProposition ending with period', () => {
      const content = heroContent as { valueProposition: string }
      expect(content.valueProposition.trim()).toMatch(/\.$/)
    })
  })

  describe('Validation des champs requis', () => {
    it('should have correct id format', () => {
      const content = heroContent as { id: string }
      expect(content.id).toBe('hero-main-fr')
      expect(content.id).toMatch(/^[a-z0-9-]+$/)
    })

    it('should have locale "fr"', () => {
      const content = heroContent as { locale: string }
      expect(content.locale).toBe('fr')
    })

    it('should be active', () => {
      const content = heroContent as { isActive: boolean }
      expect(content.isActive).toBe(true)
    })

    it('should have valid ISO 8601 updatedAt', () => {
      const content = heroContent as { updatedAt: string }
      expect(() => new Date(content.updatedAt)).not.toThrow()
      expect(new Date(content.updatedAt).toISOString()).toBe(content.updatedAt)
    })
  })

  describe('Validation des métadonnées SEO', () => {
    it('should have metadata object', () => {
      const content = heroContent as { metadata?: object }
      expect(content.metadata).toBeDefined()
    })

    it('should have seoTitle under 60 characters', () => {
      const content = heroContent as { metadata?: { seoTitle?: string } }
      expect(content.metadata?.seoTitle).toBeDefined()
      expect(content.metadata!.seoTitle!.length).toBeLessThanOrEqual(60)
    })

    it('T-08: should reject seoTitle over 60 characters', () => {
      const testContent = {
        ...(heroContent as object),
        metadata: {
          seoTitle: 'A'.repeat(61),
        },
      }
      const result = heroContentSchemaWithRefinements.safeParse(testContent)

      expect(result.success).toBe(false)
    })

    it('should have seoDescription under 160 characters', () => {
      const content = heroContent as { metadata?: { seoDescription?: string } }
      expect(content.metadata?.seoDescription).toBeDefined()
      expect(content.metadata!.seoDescription!.length).toBeLessThanOrEqual(160)
    })

    it('T-09: should reject seoDescription over 160 characters', () => {
      const testContent = {
        ...(heroContent as object),
        metadata: {
          seoDescription: 'A'.repeat(161),
        },
      }
      const result = heroContentSchemaWithRefinements.safeParse(testContent)

      expect(result.success).toBe(false)
    })
  })

  describe('Validation des contraintes de longueur', () => {
    it('should have title between 10 and 80 characters', () => {
      const content = heroContent as { title: string }
      expect(content.title.length).toBeGreaterThanOrEqual(10)
      expect(content.title.length).toBeLessThanOrEqual(80)
    })

    it('should have tagline between 10 and 120 characters', () => {
      const content = heroContent as { tagline: string }
      expect(content.tagline.length).toBeGreaterThanOrEqual(10)
      expect(content.tagline.length).toBeLessThanOrEqual(120)
    })

    it('should have valueProposition between 20 and 200 characters', () => {
      const content = heroContent as { valueProposition: string }
      expect(content.valueProposition.length).toBeGreaterThanOrEqual(20)
      expect(content.valueProposition.length).toBeLessThanOrEqual(200)
    })
  })

  describe('Cas limites - ID', () => {
    it('T-10: should reject ID with uppercase', () => {
      const testContent = {
        ...(heroContent as object),
        id: 'Hero-Main-FR',
      }
      const result = heroContentSchemaWithRefinements.safeParse(testContent)

      expect(result.success).toBe(false)
    })

    it('T-11: should reject ID with spaces', () => {
      const testContent = {
        ...(heroContent as object),
        id: 'hero main fr',
      }
      const result = heroContentSchemaWithRefinements.safeParse(testContent)

      expect(result.success).toBe(false)
    })
  })

  describe('Cas limites - Locale', () => {
    it('T-06: should reject locale with 3 characters', () => {
      const testContent = {
        ...(heroContent as object),
        locale: 'fra',
      }
      const result = heroContentSchemaWithRefinements.safeParse(testContent)

      expect(result.success).toBe(false)
    })
  })

  describe('Cas limites - Caractères spéciaux', () => {
    it('T-12: should accept accented characters', () => {
      const testContent = {
        ...(heroContent as object),
        tagline: 'Découvrez l\'efficacité de l\'IA générative',
      }
      const result = heroContentSchemaWithRefinements.safeParse(testContent)

      expect(result.success).toBe(true)
    })

    it('T-13: should accept both apostrophe types', () => {
      const testContent1 = {
        ...(heroContent as object),
        tagline: "Structurez l'intelligence artificielle", // apostrophe droite
      }
      const testContent2 = {
        ...(heroContent as object),
        tagline: "Structurez l\u2019intelligence artificielle", // apostrophe typographique (U+2019)
      }

      expect(heroContentSchemaWithRefinements.safeParse(testContent1).success).toBe(true)
      expect(heroContentSchemaWithRefinements.safeParse(testContent2).success).toBe(true)
    })
  })
})

describe('Hero Content - Qualité rédactionnelle', () => {
  let heroContent: {
    title: string
    tagline: string
    valueProposition: string
    metadata?: { seoTitle?: string; seoDescription?: string }
  }

  beforeAll(() => {
    const filePath = join(process.cwd(), 'src/content/hero/main.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    heroContent = JSON.parse(fileContent)
  })

  it('should have AIAD at the beginning of title', () => {
    expect(heroContent.title.startsWith('AIAD')).toBe(true)
  })

  it('should contain key SEO terms', () => {
    const allText = [
      heroContent.title,
      heroContent.tagline,
      heroContent.valueProposition,
      heroContent.metadata?.seoTitle || '',
      heroContent.metadata?.seoDescription || '',
    ].join(' ').toLowerCase()

    expect(allText).toContain('aiad')
    expect(allText).toContain('agent')
    expect(allText).toMatch(/framework|méthodologie/)
    expect(allText).toMatch(/ia|intelligence artificielle/)
  })

  it('should not have typos in common French words', () => {
    const text = [
      heroContent.title,
      heroContent.tagline,
      heroContent.valueProposition,
    ].join(' ')

    // Vérifications basiques d'orthographe
    expect(text).not.toMatch(/developpement/) // devrait être "développement"
    expect(text).not.toMatch(/méthodologié/) // faute courante
    expect(text).not.toMatch(/\s{2,}/) // pas de double espaces
  })
})
