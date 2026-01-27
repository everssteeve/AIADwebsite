// tests/unit/schemas/benefit-item.test.ts

import { describe, it, expect } from 'vitest'
import { benefitItemSchema, benefitItemListSchema } from '@/schemas/benefit'

describe('BenefitItem Schema', () => {
  // Fixture de base valide
  const validBenefitItem = {
    id: 'benefit-productivity',
    icon: 'trending-up',
    title: 'Productivité accrue',
    description: 'Gagnez 50% de temps sur vos tâches répétitives.',
    order: 1,
    locale: 'fr',
    isActive: true,
    updatedAt: '2026-01-26T10:00:00.000Z',
  }

  describe('Validation basique', () => {
    it('T-00: should validate a correct BenefitItem', () => {
      const result = benefitItemSchema.safeParse(validBenefitItem)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe('benefit-productivity')
        expect(result.data.icon).toBe('trending-up')
        expect(result.data.updatedAt).toBeInstanceOf(Date)
      }
    })

    it('T-00b: should apply default values', () => {
      const minimal = {
        id: 'benefit-test',
        icon: 'zap',
        title: 'Titre valide',
        description: 'Une description valide et complète.',
        order: 1,
        updatedAt: '2026-01-26T10:00:00.000Z',
      }

      const result = benefitItemSchema.safeParse(minimal)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.locale).toBe('fr')
        expect(result.data.isActive).toBe(true)
      }
    })
  })

  describe('Validation du champ id', () => {
    it('should reject id with uppercase letters', () => {
      const invalid = { ...validBenefitItem, id: 'Benefit-Test' }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('id')
    })

    it('should reject id with spaces', () => {
      const invalid = { ...validBenefitItem, id: 'benefit test' }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should reject id shorter than 3 characters', () => {
      const invalid = { ...validBenefitItem, id: 'ab' }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('3 caractères')
    })

    it('should reject id exceeding 50 characters', () => {
      const invalid = { ...validBenefitItem, id: 'a'.repeat(51) }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('50 caractères')
    })
  })

  describe('Validation du champ icon', () => {
    it('T-06: should reject invalid icon', () => {
      const invalid = { ...validBenefitItem, icon: 'invalid-icon' }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('icon')
    })

    it('should accept all valid icons', () => {
      const validIcons = ['zap', 'target', 'wrench', 'trending-up', 'shield']

      for (const icon of validIcons) {
        const valid = { ...validBenefitItem, icon }
        const result = benefitItemSchema.safeParse(valid)
        expect(result.success).toBe(true)
      }
    })
  })

  describe('Validation du champ title', () => {
    it('T-01: should accept title with exactly 50 characters', () => {
      const title50 = 'A'.repeat(50)
      const valid = { ...validBenefitItem, title: title50 }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('T-02: should reject title exceeding 50 characters', () => {
      const title51 = 'A'.repeat(51)
      const invalid = { ...validBenefitItem, title: title51 }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('50 caractères')
    })

    it('T-03: should reject title with more than 5 words (règle R2)', () => {
      const invalid = {
        ...validBenefitItem,
        title: 'Un titre avec plus de cinq mots'
      }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('5 mots')
    })

    it('should accept title with exactly 5 words', () => {
      const valid = {
        ...validBenefitItem,
        title: 'Un deux trois quatre cinq'
      }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('should reject title shorter than 5 characters', () => {
      const invalid = { ...validBenefitItem, title: 'Abcd' }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('5 caractères')
    })

    it('T-13: should accept emoji in title', () => {
      const valid = {
        ...validBenefitItem,
        title: 'Productivité 🚀'
      }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ description', () => {
    it('T-04: should reject description without ending punctuation (règle R3)', () => {
      const invalid = {
        ...validBenefitItem,
        description: 'Une description sans ponctuation finale'
      }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('point')
    })

    it('T-05: should reject description ending with question mark', () => {
      const invalid = {
        ...validBenefitItem,
        description: 'Une description qui termine par une question?'
      }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-14: should accept description ending with exclamation mark', () => {
      const valid = {
        ...validBenefitItem,
        description: 'Une description qui se termine bien!'
      }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('should reject description shorter than 20 characters', () => {
      const invalid = { ...validBenefitItem, description: 'Court.' }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('20 caractères')
    })

    it('should reject description exceeding 150 characters', () => {
      const description151 = 'A'.repeat(150) + '.'
      const invalid = { ...validBenefitItem, description: description151 }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('150 caractères')
    })

    it('should accept description with exactly 150 characters', () => {
      const description150 = 'A'.repeat(149) + '.'
      const valid = { ...validBenefitItem, description: description150 }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ order', () => {
    it('T-07: should reject order = 0', () => {
      const invalid = { ...validBenefitItem, order: 0 }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('positif')
    })

    it('T-08: should reject negative order', () => {
      const invalid = { ...validBenefitItem, order: -1 }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-09: should reject decimal order', () => {
      const invalid = { ...validBenefitItem, order: 1.5 }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('entier')
    })

    it('should accept positive integer order', () => {
      const valid = { ...validBenefitItem, order: 10 }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ locale', () => {
    it('should reject locale with 3 characters', () => {
      const invalid = { ...validBenefitItem, locale: 'fra' }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('2 caractères')
    })

    it('should accept valid 2-letter locale', () => {
      const valid = { ...validBenefitItem, locale: 'en' }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ ariaLabel', () => {
    it('should accept valid ariaLabel', () => {
      const valid = {
        ...validBenefitItem,
        ariaLabel: 'Icône représentant la productivité'
      }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('T-12: should reject ariaLabel exceeding 100 characters', () => {
      const invalid = {
        ...validBenefitItem,
        ariaLabel: 'A'.repeat(101)
      }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('100 caractères')
    })

    it('should accept ariaLabel with exactly 100 characters', () => {
      const valid = {
        ...validBenefitItem,
        ariaLabel: 'A'.repeat(100)
      }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ updatedAt', () => {
    it('should reject invalid date format', () => {
      const invalid = { ...validBenefitItem, updatedAt: 'invalid-date' }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should transform valid ISO string to Date object', () => {
      const result = benefitItemSchema.safeParse(validBenefitItem)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.updatedAt).toBeInstanceOf(Date)
        expect(result.data.updatedAt.toISOString()).toBe('2026-01-26T10:00:00.000Z')
      }
    })
  })
})

describe('BenefitItemList Schema', () => {
  const createBenefit = (overrides = {}) => ({
    id: 'benefit-test',
    icon: 'zap',
    title: 'Titre valide',
    description: 'Une description valide et complète.',
    order: 1,
    locale: 'fr',
    isActive: true,
    updatedAt: '2026-01-26T10:00:00.000Z',
    ...overrides,
  })

  describe('Règle R1 - Unicité de order par locale', () => {
    it('T-10: should reject duplicate orders for same locale', () => {
      const list = [
        createBenefit({ id: 'benefit-1', order: 1 }),
        createBenefit({ id: 'benefit-2', order: 1 }), // Même order
      ]
      const result = benefitItemListSchema.safeParse(list)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('unique')
    })

    it('should accept same order for different locales', () => {
      const list = [
        createBenefit({ id: 'benefit-1', order: 1, locale: 'fr' }),
        createBenefit({ id: 'benefit-2', order: 1, locale: 'en' }),
      ]
      const result = benefitItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })

    it('should accept duplicate orders for inactive benefits', () => {
      const list = [
        createBenefit({ id: 'benefit-1', order: 1, isActive: true }),
        createBenefit({ id: 'benefit-2', order: 1, isActive: false }),
      ]
      const result = benefitItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })

    it('should accept different orders for same locale', () => {
      const list = [
        createBenefit({ id: 'benefit-1', order: 1 }),
        createBenefit({ id: 'benefit-2', order: 2 }),
        createBenefit({ id: 'benefit-3', order: 3 }),
      ]
      const result = benefitItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })
  })

  describe('Règle R4 - Maximum 5 bénéfices actifs par locale', () => {
    it('T-11: should reject more than 5 active benefits for same locale', () => {
      const list = Array.from({ length: 6 }, (_, i) =>
        createBenefit({ id: `benefit-${i}`, order: i + 1 })
      )
      const result = benefitItemListSchema.safeParse(list)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('Maximum 5')
    })

    it('should accept exactly 5 active benefits', () => {
      const list = Array.from({ length: 5 }, (_, i) =>
        createBenefit({ id: `benefit-${i}`, order: i + 1 })
      )
      const result = benefitItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })

    it('should accept 6 benefits if one is inactive', () => {
      const list = [
        ...Array.from({ length: 5 }, (_, i) =>
          createBenefit({ id: `benefit-${i}`, order: i + 1 })
        ),
        createBenefit({ id: 'benefit-6', order: 6, isActive: false }),
      ]
      const result = benefitItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })

    it('should accept 5 active benefits per locale for different locales', () => {
      const frBenefits = Array.from({ length: 5 }, (_, i) =>
        createBenefit({ id: `benefit-fr-${i}`, order: i + 1, locale: 'fr' })
      )
      const enBenefits = Array.from({ length: 5 }, (_, i) =>
        createBenefit({ id: `benefit-en-${i}`, order: i + 1, locale: 'en' })
      )
      const list = [...frBenefits, ...enBenefits]
      const result = benefitItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })
  })

  describe('Liste vide et cas limites', () => {
    it('should accept empty list', () => {
      const result = benefitItemListSchema.safeParse([])

      expect(result.success).toBe(true)
    })

    it('should accept single item', () => {
      const list = [createBenefit()]
      const result = benefitItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })
  })
})
