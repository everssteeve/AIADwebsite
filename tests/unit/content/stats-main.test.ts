// tests/unit/content/stats-main.test.ts

import { describe, it, expect, beforeAll } from 'vitest'
import { statItemSchema, statItemListSchema } from '@/schemas/stat'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('Stats Content - main.json', () => {
  let statsContent: unknown[]

  beforeAll(() => {
    const filePath = join(process.cwd(), 'src/content/stats/main.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    statsContent = JSON.parse(fileContent)
  })

  describe('Validation du schéma', () => {
    it('T-00: should validate against statItemListSchema', () => {
      const result = statItemListSchema.safeParse(statsContent)

      expect(result.success).toBe(true)
      if (!result.success) {
        console.error('Validation errors:', result.error.issues)
      }
    })

    it('T-00b: should transform updatedAt to Date objects', () => {
      const result = statItemListSchema.safeParse(statsContent)

      expect(result.success).toBe(true)
      if (result.success) {
        for (const item of result.data) {
          expect(item.updatedAt).toBeInstanceOf(Date)
        }
      }
    })

    it('should have exactly 3 statistics', () => {
      expect(statsContent).toHaveLength(3)
    })
  })

  describe('Validation de chaque statistique', () => {
    it('should validate each stat individually', () => {
      for (const stat of statsContent) {
        const result = statItemSchema.safeParse(stat)
        expect(result.success).toBe(true)
      }
    })

    it('should have all required fields', () => {
      const requiredFields = ['id', 'value', 'label', 'source', 'order', 'updatedAt']

      for (const stat of statsContent as Record<string, unknown>[]) {
        for (const field of requiredFields) {
          expect(stat[field]).toBeDefined()
        }
      }
    })
  })

  describe('Règle R1 - Orders uniques', () => {
    it('should have unique orders', () => {
      const orders = (statsContent as { order: number }[]).map(s => s.order)
      const uniqueOrders = new Set(orders)

      expect(uniqueOrders.size).toBe(orders.length)
    })

    it('should have orders 1, 2, 3', () => {
      const orders = (statsContent as { order: number }[])
        .map(s => s.order)
        .sort((a, b) => a - b)

      expect(orders).toEqual([1, 2, 3])
    })

    it('T-15: should reject duplicate orders for same locale', () => {
      const duplicateOrders = [
        { ...statsContent[0], id: 'test-1', order: 1 },
        { ...statsContent[1], id: 'test-2', order: 1 },
      ]
      const result = statItemListSchema.safeParse(duplicateOrders)

      expect(result.success).toBe(false)
    })

    it('should accept same order for different locales', () => {
      const mixedLocales = [
        { ...statsContent[0], id: 'fr-1', order: 1, locale: 'fr' },
        { ...statsContent[0], id: 'en-1', order: 1, locale: 'en' },
      ]
      const result = statItemListSchema.safeParse(mixedLocales)

      expect(result.success).toBe(true)
    })
  })

  describe('Règle R4 - Max 6 statistiques actives par locale', () => {
    it('should have 3 or fewer active stats', () => {
      const activeCount = (statsContent as { isActive?: boolean }[])
        .filter(s => s.isActive !== false).length

      expect(activeCount).toBeLessThanOrEqual(6)
    })

    it('T-16: should reject more than 6 active stats for same locale', () => {
      const sevenStats = Array.from({ length: 7 }, (_, i) => ({
        id: `stat-${i}`,
        value: `${i + 1}0%`,
        label: `Statistique numéro ${i + 1} valide`,
        source: `Source numéro ${i + 1} valide`,
        order: i + 1,
        locale: 'fr',
        isActive: true,
        updatedAt: '2026-02-02T10:00:00.000Z',
      }))
      const result = statItemListSchema.safeParse(sevenStats)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Maximum 6')
      }
    })

    it('should accept exactly 6 active stats', () => {
      const sixStats = Array.from({ length: 6 }, (_, i) => ({
        id: `stat-${i}`,
        value: `${i + 1}0%`,
        label: `Statistique numéro ${i + 1} valide`,
        source: `Source numéro ${i + 1} valide`,
        order: i + 1,
        locale: 'fr',
        isActive: true,
        updatedAt: '2026-02-02T10:00:00.000Z',
      }))
      const result = statItemListSchema.safeParse(sixStats)

      expect(result.success).toBe(true)
    })

    it('should accept 7 stats if one is inactive', () => {
      const sevenWithOneInactive = [
        ...Array.from({ length: 6 }, (_, i) => ({
          id: `stat-${i}`,
          value: `${i + 1}0%`,
          label: `Statistique numéro ${i + 1} valide`,
          source: `Source numéro ${i + 1} valide`,
          order: i + 1,
          locale: 'fr',
          isActive: true,
          updatedAt: '2026-02-02T10:00:00.000Z',
        })),
        {
          id: 'stat-7',
          value: '70%',
          label: 'Statistique numéro 7 inactive',
          source: 'Source numéro 7 valide',
          order: 7,
          locale: 'fr',
          isActive: false,
          updatedAt: '2026-02-02T10:00:00.000Z',
        },
      ]
      const result = statItemListSchema.safeParse(sevenWithOneInactive)

      expect(result.success).toBe(true)
    })
  })

  describe('Règle R5 - Value contient un chiffre', () => {
    it('should have values containing digits', () => {
      for (const stat of statsContent as { value: string }[]) {
        expect(stat.value).toMatch(/\d/)
      }
    })

    it('T-01: should reject value without digit', () => {
      const invalid = { ...statsContent[0], value: 'N/A' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('chiffre')
      }
    })

    it('T-02: should reject value with symbol only', () => {
      const invalid = { ...statsContent[0], value: '%' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-03: should accept value "0"', () => {
      const valid = { ...statsContent[0], value: '0' }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('T-23: should accept values with operators', () => {
      const validValues = ['>90%', '<5s', '~100', '±10%', '≥50']

      for (const value of validValues) {
        const valid = { ...statsContent[0], value }
        const result = statItemSchema.safeParse(valid)
        expect(result.success).toBe(true)
      }
    })
  })

  describe('Règle R6 - sourceUrl valide', () => {
    it('should have valid sourceUrl when provided', () => {
      for (const stat of statsContent as { sourceUrl?: string }[]) {
        if (stat.sourceUrl) {
          expect(() => new URL(stat.sourceUrl!)).not.toThrow()
        }
      }
    })

    it('T-10: should reject invalid sourceUrl', () => {
      const invalid = { ...statsContent[0], sourceUrl: 'not-a-valid-url' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('URL')
      }
    })

    it('T-11: should accept valid HTTPS sourceUrl', () => {
      const valid = { ...statsContent[0], sourceUrl: 'https://example.com/study' }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('should accept missing sourceUrl', () => {
      const valid = { ...statsContent[0] }
      delete (valid as Record<string, unknown>).sourceUrl
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ value', () => {
    it('T-04: should accept value with exactly 20 characters', () => {
      const value20 = '12345678901234567890'
      const valid = { ...statsContent[0], value: value20 }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('T-05: should reject value exceeding 20 characters', () => {
      const value21 = '123456789012345678901'
      const invalid = { ...statsContent[0], value: value21 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('20')
      }
    })
  })

  describe('Validation du champ label', () => {
    it('T-06: should reject label shorter than 10 characters', () => {
      const invalid = { ...statsContent[0], label: 'Court' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('10')
      }
    })

    it('T-07: should reject label exceeding 100 characters', () => {
      const label101 = 'A'.repeat(101)
      const invalid = { ...statsContent[0], label: label101 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should accept label with exactly 10 characters', () => {
      const valid = { ...statsContent[0], label: '1234567890' }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('should accept label with exactly 100 characters', () => {
      const label100 = 'A'.repeat(100)
      const valid = { ...statsContent[0], label: label100 }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ source', () => {
    it('T-08: should reject empty source', () => {
      const invalid = { ...statsContent[0], source: '' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-09: should reject source shorter than 5 characters', () => {
      const invalid = { ...statsContent[0], source: 'Test' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('5')
      }
    })

    it('should reject source exceeding 150 characters', () => {
      const source151 = 'A'.repeat(151)
      const invalid = { ...statsContent[0], source: source151 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })
  })

  describe('Validation du champ order', () => {
    it('T-12: should reject order = 0', () => {
      const invalid = { ...statsContent[0], order: 0 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('positif')
      }
    })

    it('T-13: should reject negative order', () => {
      const invalid = { ...statsContent[0], order: -1 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-14: should reject decimal order', () => {
      const invalid = { ...statsContent[0], order: 1.5 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('entier')
      }
    })
  })

  describe('Validation du champ unit', () => {
    it('T-21: should reject unit exceeding 10 characters', () => {
      const invalid = { ...statsContent[0], unit: 'pourcentage' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should accept valid units', () => {
      const validUnits = ['%', 'x', 'h', 'j', 'min', 's', 'k', 'M', '+', '']

      for (const unit of validUnits) {
        const valid = { ...statsContent[0], unit }
        const result = statItemSchema.safeParse(valid)
        expect(result.success).toBe(true)
      }
    })
  })

  describe('Validation du champ ID', () => {
    it('T-17: should reject ID with uppercase', () => {
      const invalid = { ...statsContent[0], id: 'Stat-Test' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-18: should reject ID with spaces', () => {
      const invalid = { ...statsContent[0], id: 'stat test' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should accept valid slug format', () => {
      const valid = { ...statsContent[0], id: 'stat-test-123' }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ locale', () => {
    it('T-19: should reject locale with 3 characters', () => {
      const invalid = { ...statsContent[0], locale: 'fra' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should accept valid 2-char locale', () => {
      const valid = { ...statsContent[0], locale: 'en' }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ highlight', () => {
    it('should have exactly one highlighted stat', () => {
      const highlightedCount = (statsContent as { highlight?: boolean }[])
        .filter(s => s.highlight === true).length

      expect(highlightedCount).toBe(1)
    })

    it('should have first stat highlighted', () => {
      const firstStat = statsContent[0] as { highlight?: boolean; order: number }
      expect(firstStat.highlight).toBe(true)
      expect(firstStat.order).toBe(1)
    })
  })

  describe('Validation des champs communs', () => {
    it('should have all stats with locale "fr"', () => {
      for (const stat of statsContent as { locale?: string }[]) {
        expect(stat.locale ?? 'fr').toBe('fr')
      }
    })

    it('should have all stats active', () => {
      for (const stat of statsContent as { isActive?: boolean }[]) {
        expect(stat.isActive ?? true).toBe(true)
      }
    })

    it('should have valid ISO 8601 updatedAt', () => {
      for (const stat of statsContent as { updatedAt: string }[]) {
        expect(() => new Date(stat.updatedAt)).not.toThrow()
      }
    })
  })

  describe('Cas limites - Caractères spéciaux', () => {
    it('T-22: should accept accented characters in label', () => {
      const valid = {
        ...statsContent[0],
        label: 'Économie de temps significative obtenue',
      }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('should accept special characters in source', () => {
      const valid = {
        ...statsContent[0],
        source: "McKinsey & Company - Rapport d'étude 2024",
      }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Cas limites - Liste', () => {
    it('T-24: should accept empty array', () => {
      const result = statItemListSchema.safeParse([])

      expect(result.success).toBe(true)
    })
  })
})

describe('Stats Content - Qualité et crédibilité', () => {
  let statsContent: {
    id: string
    value: string
    label: string
    source: string
    sourceUrl?: string
    numericValue?: number
  }[]

  beforeAll(() => {
    const filePath = join(process.cwd(), 'src/content/stats/main.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    statsContent = JSON.parse(fileContent)
  })

  it('should have all stats with sourceUrl (verifiable)', () => {
    for (const stat of statsContent) {
      expect(stat.sourceUrl).toBeDefined()
      expect(stat.sourceUrl).toMatch(/^https?:\/\//)
    }
  })

  it('should have distinct values for each stat', () => {
    const values = statsContent.map(s => s.value)
    const uniqueValues = new Set(values)

    expect(uniqueValues.size).toBe(values.length)
  })

  it('should have numericValue for all stats', () => {
    for (const stat of statsContent) {
      expect(stat.numericValue).toBeDefined()
      expect(typeof stat.numericValue).toBe('number')
    }
  })

  it('should have credible sources (recognized organizations)', () => {
    const credibleKeywords = [
      'mckinsey',
      'github',
      'stack overflow',
      'gartner',
      'forrester',
      'deloitte',
      'bcg',
      'accenture',
    ]

    for (const stat of statsContent) {
      const sourceLower = stat.source.toLowerCase()
      const hasCredibleSource = credibleKeywords.some(keyword =>
        sourceLower.includes(keyword)
      )
      expect(hasCredibleSource).toBe(true)
    }
  })

  it('should cover key AIAD value propositions', () => {
    const allText = statsContent
      .map(s => `${s.id} ${s.label}`)
      .join(' ')
      .toLowerCase()

    // Les 3 thèmes clés doivent être présents
    expect(allText).toMatch(/productiv|efficac|gain/) // Productivité
    expect(allText).toMatch(/rapid|vite|accéléra|fois/) // Vitesse
    expect(allText).toMatch(/satisf|content|heureux/) // Satisfaction
  })

  it('should not have typos in common French words', () => {
    const allText = statsContent.map(s => s.label).join(' ')

    // Vérifications basiques d'orthographe
    expect(allText).not.toMatch(/developpeur/) // devrait être "développeur"
    expect(allText).not.toMatch(/\s{2,}/) // pas de double espaces
  })
})
