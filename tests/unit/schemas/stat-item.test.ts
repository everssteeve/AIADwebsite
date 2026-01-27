// tests/unit/schemas/stat-item.test.ts

import { describe, it, expect } from 'vitest'
import { statItemSchema, statItemListSchema } from '@/schemas/stat'

describe('StatItem Schema', () => {
  // Fixture de base valide
  const validStatItem = {
    id: 'stat-productivity',
    value: '50%',
    numericValue: 50,
    label: 'Gain de productivité moyen',
    source: 'Étude interne AIAD 2025',
    order: 1,
    locale: 'fr',
    isActive: true,
    highlight: false,
    updatedAt: '2026-01-27T10:00:00.000Z',
  }

  describe('Validation basique', () => {
    it('T-00: should validate a correct StatItem', () => {
      const result = statItemSchema.safeParse(validStatItem)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe('stat-productivity')
        expect(result.data.value).toBe('50%')
        expect(result.data.updatedAt).toBeInstanceOf(Date)
      }
    })

    it('T-00b: should apply default values', () => {
      const minimal = {
        id: 'stat-test',
        value: '100',
        label: 'Une statistique de test',
        source: 'Source de test',
        order: 1,
        updatedAt: '2026-01-27T10:00:00.000Z',
      }

      const result = statItemSchema.safeParse(minimal)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.locale).toBe('fr')
        expect(result.data.isActive).toBe(true)
        expect(result.data.highlight).toBe(false)
      }
    })
  })

  describe('Validation du champ value', () => {
    it('T-01: should accept value with exactly 20 characters', () => {
      const value20 = '12345678901234567890'
      const valid = { ...validStatItem, value: value20 }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('T-02: should reject value exceeding 20 characters', () => {
      const value21 = '123456789012345678901'
      const invalid = { ...validStatItem, value: value21 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('20 caractères')
    })

    it('T-03: should reject value without digit (règle R5)', () => {
      const invalid = { ...validStatItem, value: 'N/A' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('chiffre')
    })

    it('T-12: should reject value with symbol only', () => {
      const invalid = { ...validStatItem, value: '%' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-13: should accept value "0"', () => {
      const valid = { ...validStatItem, value: '0' }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('should accept various valid value formats', () => {
      const validValues = ['50%', '3x', '100+', '>90%', '24h', '1000', '2.5x']

      for (const value of validValues) {
        const valid = { ...validStatItem, value }
        const result = statItemSchema.safeParse(valid)
        expect(result.success).toBe(true)
      }
    })
  })

  describe('Validation du champ label', () => {
    it('T-04: should reject label shorter than 10 characters', () => {
      const invalid = { ...validStatItem, label: 'Court' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('10 caractères')
    })

    it('should accept label with exactly 10 characters', () => {
      const valid = { ...validStatItem, label: '1234567890' }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('should reject label exceeding 100 characters', () => {
      const label101 = 'A'.repeat(101)
      const invalid = { ...validStatItem, label: label101 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })
  })

  describe('Validation du champ source', () => {
    it('T-05: should reject empty source', () => {
      const invalid = { ...validStatItem, source: '' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should reject source shorter than 5 characters', () => {
      const invalid = { ...validStatItem, source: 'Test' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('5 caractères')
    })

    it('should reject source exceeding 150 characters', () => {
      const source151 = 'A'.repeat(151)
      const invalid = { ...validStatItem, source: source151 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })
  })

  describe('Validation du champ sourceUrl', () => {
    it('T-06: should reject invalid sourceUrl', () => {
      const invalid = { ...validStatItem, sourceUrl: 'not-a-url' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('URL')
    })

    it('T-14: should accept valid HTTPS sourceUrl', () => {
      const valid = {
        ...validStatItem,
        sourceUrl: 'https://example.com/study'
      }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('should accept missing sourceUrl', () => {
      const valid = { ...validStatItem }
      delete (valid as any).sourceUrl
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ order', () => {
    it('T-07: should reject order = 0', () => {
      const invalid = { ...validStatItem, order: 0 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('positif')
    })

    it('T-08: should reject negative order', () => {
      const invalid = { ...validStatItem, order: -1 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-09: should reject decimal order', () => {
      const invalid = { ...validStatItem, order: 1.5 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('entier')
    })

    it('should accept positive integer order', () => {
      const valid = { ...validStatItem, order: 10 }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ highlight', () => {
    it('should accept highlight = true', () => {
      const valid = { ...validStatItem, highlight: true }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.highlight).toBe(true)
      }
    })

    it('should default highlight to false', () => {
      const minimal = {
        id: 'stat-test',
        value: '100',
        label: 'Une statistique de test',
        source: 'Source de test',
        order: 1,
        updatedAt: '2026-01-27T10:00:00.000Z',
      }

      const result = statItemSchema.safeParse(minimal)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.highlight).toBe(false)
      }
    })
  })

  describe('Validation du champ id', () => {
    it('should reject id with uppercase letters', () => {
      const invalid = { ...validStatItem, id: 'Stat-Test' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('id')
    })

    it('should reject id with spaces', () => {
      const invalid = { ...validStatItem, id: 'stat test' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should reject id shorter than 3 characters', () => {
      const invalid = { ...validStatItem, id: 'ab' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('3 caractères')
    })

    it('should reject id exceeding 50 characters', () => {
      const invalid = { ...validStatItem, id: 'a'.repeat(51) }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('50 caractères')
    })
  })

  describe('Validation du champ locale', () => {
    it('should reject locale with 3 characters', () => {
      const invalid = { ...validStatItem, locale: 'fra' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('2 caractères')
    })

    it('should accept valid 2-letter locale', () => {
      const valid = { ...validStatItem, locale: 'en' }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ updatedAt', () => {
    it('should reject invalid date format', () => {
      const invalid = { ...validStatItem, updatedAt: 'invalid-date' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should transform valid ISO string to Date object', () => {
      const result = statItemSchema.safeParse(validStatItem)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.updatedAt).toBeInstanceOf(Date)
        expect(result.data.updatedAt.toISOString()).toBe('2026-01-27T10:00:00.000Z')
      }
    })
  })

  describe('Validation des champs optionnels', () => {
    it('should accept numericValue', () => {
      const valid = { ...validStatItem, numericValue: 50 }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.numericValue).toBe(50)
      }
    })

    it('should accept unit', () => {
      const valid = { ...validStatItem, unit: '%' }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.unit).toBe('%')
      }
    })

    it('should reject unit exceeding 10 characters', () => {
      const invalid = { ...validStatItem, unit: 'A'.repeat(11) }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('10 caractères')
    })
  })
})

describe('StatItemList Schema', () => {
  const createStat = (overrides = {}) => ({
    id: 'stat-test',
    value: '100%',
    label: 'Une statistique de test',
    source: 'Source de test valide',
    order: 1,
    locale: 'fr',
    isActive: true,
    highlight: false,
    updatedAt: '2026-01-27T10:00:00.000Z',
    ...overrides,
  })

  describe('Règle R1 - Unicité de order par locale', () => {
    it('T-10: should reject duplicate orders for same locale', () => {
      const list = [
        createStat({ id: 'stat-1', order: 1 }),
        createStat({ id: 'stat-2', order: 1 }), // Même order
      ]
      const result = statItemListSchema.safeParse(list)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('unique')
    })

    it('should accept same order for different locales', () => {
      const list = [
        createStat({ id: 'stat-1', order: 1, locale: 'fr' }),
        createStat({ id: 'stat-2', order: 1, locale: 'en' }),
      ]
      const result = statItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })

    it('should accept duplicate orders for inactive stats', () => {
      const list = [
        createStat({ id: 'stat-1', order: 1, isActive: true }),
        createStat({ id: 'stat-2', order: 1, isActive: false }),
      ]
      const result = statItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })
  })

  describe('Règle R4 - Maximum 6 statistiques actives par locale', () => {
    it('T-11: should reject more than 6 active stats for same locale', () => {
      const list = Array.from({ length: 7 }, (_, i) =>
        createStat({ id: `stat-${i}`, order: i + 1 })
      )
      const result = statItemListSchema.safeParse(list)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('Maximum 6')
    })

    it('should accept exactly 6 active stats', () => {
      const list = Array.from({ length: 6 }, (_, i) =>
        createStat({ id: `stat-${i}`, order: i + 1 })
      )
      const result = statItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })

    it('should accept 7 stats if one is inactive', () => {
      const list = [
        ...Array.from({ length: 6 }, (_, i) =>
          createStat({ id: `stat-${i}`, order: i + 1 })
        ),
        createStat({ id: 'stat-7', order: 7, isActive: false }),
      ]
      const result = statItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })
  })

  describe('Liste vide et cas limites', () => {
    it('should accept empty list', () => {
      const result = statItemListSchema.safeParse([])

      expect(result.success).toBe(true)
    })

    it('should accept single item', () => {
      const list = [createStat()]
      const result = statItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })

    it('should accept 6 active stats per locale for different locales', () => {
      const frStats = Array.from({ length: 6 }, (_, i) =>
        createStat({ id: `stat-fr-${i}`, order: i + 1, locale: 'fr' })
      )
      const enStats = Array.from({ length: 6 }, (_, i) =>
        createStat({ id: `stat-en-${i}`, order: i + 1, locale: 'en' })
      )
      const list = [...frStats, ...enStats]
      const result = statItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })
  })
})
