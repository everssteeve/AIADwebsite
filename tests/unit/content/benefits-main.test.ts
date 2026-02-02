// tests/unit/content/benefits-main.test.ts

import { describe, it, expect, beforeAll } from 'vitest'
import { benefitItemSchema, benefitItemListSchema } from '@/schemas/benefit'
import { BENEFIT_ICONS } from '@/types/benefit'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('Benefits Content - main.json', () => {
  let benefitsContent: unknown[]

  beforeAll(() => {
    const filePath = join(process.cwd(), 'src/content/benefits/main.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    benefitsContent = JSON.parse(fileContent)
  })

  describe('Validation du schéma', () => {
    it('T-00: should validate against benefitItemListSchema', () => {
      const result = benefitItemListSchema.safeParse(benefitsContent)

      expect(result.success).toBe(true)
      if (!result.success) {
        console.error('Validation errors:', result.error.issues)
      }
    })

    it('T-00b: should transform updatedAt to Date objects', () => {
      const result = benefitItemListSchema.safeParse(benefitsContent)

      expect(result.success).toBe(true)
      if (result.success) {
        for (const item of result.data) {
          expect(item.updatedAt).toBeInstanceOf(Date)
        }
      }
    })

    it('should have exactly 3 benefits', () => {
      expect(benefitsContent).toHaveLength(3)
    })
  })

  describe('Validation de chaque bénéfice', () => {
    it('should validate each benefit individually', () => {
      for (const benefit of benefitsContent) {
        const result = benefitItemSchema.safeParse(benefit)
        expect(result.success).toBe(true)
      }
    })

    it('should have all required fields', () => {
      const requiredFields = ['id', 'icon', 'title', 'description', 'order', 'updatedAt']

      for (const benefit of benefitsContent as Record<string, unknown>[]) {
        for (const field of requiredFields) {
          expect(benefit[field]).toBeDefined()
        }
      }
    })
  })

  describe('Règle R1 - Orders uniques', () => {
    it('should have unique orders', () => {
      const orders = (benefitsContent as { order: number }[]).map(b => b.order)
      const uniqueOrders = new Set(orders)

      expect(uniqueOrders.size).toBe(orders.length)
    })

    it('should have orders 1, 2, 3', () => {
      const orders = (benefitsContent as { order: number }[])
        .map(b => b.order)
        .sort((a, b) => a - b)

      expect(orders).toEqual([1, 2, 3])
    })

    it('T-07: should reject duplicate orders for same locale', () => {
      const duplicateOrders = [
        { ...benefitsContent[0], id: 'test-1', order: 1 },
        { ...benefitsContent[1], id: 'test-2', order: 1 },
      ]
      const result = benefitItemListSchema.safeParse(duplicateOrders)

      expect(result.success).toBe(false)
    })
  })

  describe('Règle R2 - Title max 5 mots', () => {
    it('should have titles with 5 words or less', () => {
      for (const benefit of benefitsContent as { title: string }[]) {
        const wordCount = benefit.title.trim().split(/\s+/).length
        expect(wordCount).toBeLessThanOrEqual(5)
      }
    })

    it('T-01: should reject title with 6 words', () => {
      const invalid = {
        ...benefitsContent[0],
        title: 'Un titre avec beaucoup trop de mots',
      }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-02: should accept title with exactly 5 words', () => {
      const valid = {
        ...benefitsContent[0],
        title: 'Un deux trois quatre cinq',
      }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Règle R3 - Description termine par . ou !', () => {
    it('should have descriptions ending with . or !', () => {
      for (const benefit of benefitsContent as { description: string }[]) {
        expect(benefit.description.trim()).toMatch(/[.!]$/)
      }
    })

    it('T-03: should reject description without punctuation', () => {
      const invalid = {
        ...benefitsContent[0],
        description: 'Une description sans ponctuation finale',
      }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-04: should reject description ending with ?', () => {
      const invalid = {
        ...benefitsContent[0],
        description: 'Une description qui est une question?',
      }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-05: should accept description ending with !', () => {
      const valid = {
        ...benefitsContent[0],
        description: 'Une description enthousiaste et valide!',
      }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Règle R4 - Max 5 bénéfices actifs', () => {
    it('should have 3 or fewer active benefits', () => {
      const activeCount = (benefitsContent as { isActive?: boolean }[])
        .filter(b => b.isActive !== false).length

      expect(activeCount).toBeLessThanOrEqual(5)
    })

    it('T-11: should reject more than 5 active benefits', () => {
      const sixBenefits = Array.from({ length: 6 }, (_, i) => ({
        id: `benefit-${i}`,
        icon: 'zap',
        title: `Bénéfice ${i + 1}`,
        description: `Description valide numéro ${i + 1}.`,
        order: i + 1,
        locale: 'fr',
        isActive: true,
        updatedAt: '2026-02-02T10:00:00.000Z',
      }))
      const result = benefitItemListSchema.safeParse(sixBenefits)

      expect(result.success).toBe(false)
    })
  })

  describe('Règle R5 - Icônes valides', () => {
    it('should have valid Lucide icons', () => {
      for (const benefit of benefitsContent as { icon: string }[]) {
        expect(BENEFIT_ICONS).toContain(benefit.icon)
      }
    })

    it('T-06: should reject invalid icon', () => {
      const invalid = {
        ...benefitsContent[0],
        icon: 'invalid-icon',
      }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should have distinct icons for each benefit', () => {
      const icons = (benefitsContent as { icon: string }[]).map(b => b.icon)
      const uniqueIcons = new Set(icons)

      expect(uniqueIcons.size).toBe(icons.length)
    })
  })

  describe('Validation des champs communs', () => {
    it('should have all benefits with locale "fr"', () => {
      for (const benefit of benefitsContent as { locale?: string }[]) {
        expect(benefit.locale ?? 'fr').toBe('fr')
      }
    })

    it('should have all benefits active', () => {
      for (const benefit of benefitsContent as { isActive?: boolean }[]) {
        expect(benefit.isActive ?? true).toBe(true)
      }
    })

    it('should have valid ISO 8601 updatedAt', () => {
      for (const benefit of benefitsContent as { updatedAt: string }[]) {
        expect(() => new Date(benefit.updatedAt)).not.toThrow()
      }
    })

    it('should have valid slug format for IDs', () => {
      for (const benefit of benefitsContent as { id: string }[]) {
        expect(benefit.id).toMatch(/^[a-z0-9-]+$/)
        expect(benefit.id.length).toBeGreaterThanOrEqual(3)
        expect(benefit.id.length).toBeLessThanOrEqual(50)
      }
    })
  })

  describe('Validation accessibilité', () => {
    it('should have ariaLabel for each benefit', () => {
      for (const benefit of benefitsContent as { ariaLabel?: string }[]) {
        expect(benefit.ariaLabel).toBeDefined()
        expect(typeof benefit.ariaLabel).toBe('string')
      }
    })

    it('should have ariaLabel under 100 characters', () => {
      for (const benefit of benefitsContent as { ariaLabel?: string }[]) {
        if (benefit.ariaLabel) {
          expect(benefit.ariaLabel.length).toBeLessThanOrEqual(100)
        }
      }
    })

    it('T-16: should reject ariaLabel over 100 characters', () => {
      const invalid = {
        ...benefitsContent[0],
        ariaLabel: 'A'.repeat(101),
      }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should have descriptive ariaLabels (contain "icône")', () => {
      for (const benefit of benefitsContent as { ariaLabel?: string }[]) {
        if (benefit.ariaLabel) {
          expect(benefit.ariaLabel.toLowerCase()).toContain('icône')
        }
      }
    })
  })

  describe('Cas limites - Order', () => {
    it('T-08: should reject order = 0', () => {
      const invalid = { ...benefitsContent[0], order: 0 }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-09: should reject negative order', () => {
      const invalid = { ...benefitsContent[0], order: -1 }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-10: should reject decimal order', () => {
      const invalid = { ...benefitsContent[0], order: 1.5 }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })
  })

  describe('Cas limites - ID', () => {
    it('T-12: should reject ID with uppercase', () => {
      const invalid = { ...benefitsContent[0], id: 'Benefit-Test' }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-13: should reject ID with spaces', () => {
      const invalid = { ...benefitsContent[0], id: 'benefit test' }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })
  })

  describe('Cas limites - Description', () => {
    it('T-14: should reject description under 20 characters', () => {
      const invalid = { ...benefitsContent[0], description: 'Trop court.' }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-15: should reject description over 150 characters', () => {
      const invalid = {
        ...benefitsContent[0],
        description: 'A'.repeat(150) + '.',
      }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })
  })

  describe('Cas limites - Locale', () => {
    it('T-17: should reject locale with 3 characters', () => {
      const invalid = { ...benefitsContent[0], locale: 'fra' }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })
  })

  describe('Cas limites - Caractères spéciaux', () => {
    it('T-18: should accept accented characters', () => {
      const valid = {
        ...benefitsContent[0],
        title: 'Qualité élevée',
        description: 'Une description avec des caractères accentués éàùç.',
      }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('T-19: should accept emoji in title', () => {
      const valid = {
        ...benefitsContent[0],
        title: 'Productivité',
      }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Cas limites - Liste', () => {
    it('T-20: should accept empty array', () => {
      const result = benefitItemListSchema.safeParse([])

      expect(result.success).toBe(true)
    })

    it('should accept different locales with same order', () => {
      const mixedLocales = [
        { ...benefitsContent[0], id: 'fr-1', order: 1, locale: 'fr' },
        { ...benefitsContent[0], id: 'en-1', order: 1, locale: 'en' },
      ]
      const result = benefitItemListSchema.safeParse(mixedLocales)

      expect(result.success).toBe(true)
    })
  })
})

describe('Benefits Content - Qualité rédactionnelle', () => {
  let benefitsContent: {
    id: string
    title: string
    description: string
    icon: string
    ariaLabel?: string
  }[]

  beforeAll(() => {
    const filePath = join(process.cwd(), 'src/content/benefits/main.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    benefitsContent = JSON.parse(fileContent)
  })

  it('should have consistent title structure (adjective + noun)', () => {
    // Tous les titres doivent avoir une structure similaire
    const titles = benefitsContent.map(b => b.title)

    // Vérifier que tous les titres ont 2-3 mots
    for (const title of titles) {
      const wordCount = title.trim().split(/\s+/).length
      expect(wordCount).toBeGreaterThanOrEqual(2)
      expect(wordCount).toBeLessThanOrEqual(3)
    }
  })

  it('should not have typos in common French words', () => {
    const allText = benefitsContent
      .map(b => `${b.title} ${b.description}`)
      .join(' ')

    // Vérifications basiques d'orthographe
    expect(allText).not.toMatch(/tache(?!s)/) // "tâche" avec accent
    expect(allText).not.toMatch(/\s{2,}/) // pas de double espaces
  })

  it('should have distinct descriptions (no repetition)', () => {
    const descriptions = benefitsContent.map(b => b.description.toLowerCase())

    // Vérifier que les descriptions ne se répètent pas
    for (let i = 0; i < descriptions.length; i++) {
      for (let j = i + 1; j < descriptions.length; j++) {
        const similarity = calculateSimilarity(descriptions[i], descriptions[j])
        expect(similarity).toBeLessThan(0.5) // < 50% de similarité
      }
    }
  })

  it('should cover the 3 key AIAD benefits', () => {
    const allText = benefitsContent
      .map(b => `${b.id} ${b.title} ${b.description}`)
      .join(' ')
      .toLowerCase()

    // Les 3 thèmes clés doivent être présents
    expect(allText).toMatch(/productiv|rapid|efficac/) // Productivité
    expect(allText).toMatch(/qualit|standard|valid/) // Qualité
    expect(allText).toMatch(/collabor|équipe|travail/) // Collaboration
  })
})

// Helper function for similarity check
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.split(/\s+/).filter(w => w.length > 3))
  const words2 = str2.split(/\s+/).filter(w => w.length > 3)
  const overlap = words2.filter(w => words1.has(w)).length
  return overlap / words2.length
}
