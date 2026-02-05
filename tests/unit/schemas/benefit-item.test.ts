// tests/unit/schemas/benefit-item.test.ts

import { describe, it, expect } from 'vitest'
import { benefitItemSchema, benefitItemListSchema } from '@/schemas/benefit'

describe('benefitItemSchema', () => {
  // === FIXTURE DE BASE ===
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

  const createBenefit = (overrides = {}) => ({
    ...validBenefitItem,
    ...overrides,
  })

  // === VALIDATION BASIQUE ===

  describe('Validation basique', () => {
    it('BI-00: devrait valider un BenefitItem correct complet', () => {
      const result = benefitItemSchema.safeParse(validBenefitItem)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe('benefit-productivity')
        expect(result.data.icon).toBe('trending-up')
        expect(result.data.title).toBe('Productivité accrue')
        expect(result.data.description).toBe('Gagnez 50% de temps sur vos tâches répétitives.')
        expect(result.data.order).toBe(1)
        expect(result.data.locale).toBe('fr')
        expect(result.data.isActive).toBe(true)
        expect(result.data.updatedAt).toBeInstanceOf(Date)
      }
    })

    it('BI-01: devrait appliquer les valeurs par défaut (locale, isActive)', () => {
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
        expect(result.data.ariaLabel).toBeUndefined()
      }
    })

    it('BI-02: devrait rejeter null', () => {
      const result = benefitItemSchema.safeParse(null)
      expect(result.success).toBe(false)
    })

    it('BI-03: devrait rejeter undefined', () => {
      const result = benefitItemSchema.safeParse(undefined)
      expect(result.success).toBe(false)
    })

    it('BI-04: devrait rejeter un objet vide', () => {
      const result = benefitItemSchema.safeParse({})
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    })

    it('BI-05: devrait rejeter un type primitif (string)', () => {
      const result = benefitItemSchema.safeParse('not-an-object')
      expect(result.success).toBe(false)
    })
  })

  // === CHAMP id ===

  describe('Champ id', () => {
    it('BI-ID-01: devrait accepter un id valide minimal (3 chars)', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ id: 'abc' }))
      expect(result.success).toBe(true)
    })

    it('BI-ID-02: devrait accepter un id valide maximal (50 chars)', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ id: 'a'.repeat(50) }))
      expect(result.success).toBe(true)
    })

    it('BI-ID-03: devrait rejeter un id trop court (2 chars)', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ id: 'ab' }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('3 caractères')
    })

    it('BI-ID-04: devrait rejeter un id trop long (51 chars)', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ id: 'a'.repeat(51) }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('50 caractères')
    })

    it('BI-ID-05: devrait rejeter un id avec majuscules', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ id: 'Benefit-Test' }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('id')
    })

    it('BI-ID-06: devrait rejeter un id avec espaces', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ id: 'benefit test' }))
      expect(result.success).toBe(false)
    })

    it('BI-ID-07: devrait rejeter un id avec underscores', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ id: 'benefit_test' }))
      expect(result.success).toBe(false)
    })

    it('BI-ID-08: devrait rejeter un id avec accents', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ id: 'bénéfit-1' }))
      expect(result.success).toBe(false)
    })

    it('BI-ID-09: devrait accepter un id avec chiffres et tirets', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ id: 'benefit-123-test' }))
      expect(result.success).toBe(true)
    })
  })

  // === CHAMP icon (R5) ===

  describe('Champ icon (R5)', () => {
    it('BI-IC-01: devrait rejeter une icône invalide', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ icon: 'invalid-icon' }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('icon')
    })

    it('BI-IC-02: devrait accepter toutes les 20 icônes valides', () => {
      const validIcons = [
        'zap', 'target', 'wrench', 'trending-up', 'shield',
        'handshake', 'lightbulb', 'refresh-cw', 'package', 'check-circle',
        'rocket', 'users', 'code', 'layers', 'cpu',
        'globe', 'lock', 'star', 'award', 'compass',
      ]
      for (const icon of validIcons) {
        const result = benefitItemSchema.safeParse(createBenefit({ icon }))
        expect(result.success, `L'icône '${icon}' devrait être acceptée`).toBe(true)
      }
    })

    it('BI-IC-03: devrait rejeter une icône vide', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ icon: '' }))
      expect(result.success).toBe(false)
    })
  })

  // === CHAMP title (R2) ===

  describe('Champ title (R2 - max 5 mots)', () => {
    it('BI-T-01: devrait accepter un titre de 5 mots exactement', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ title: 'Un deux trois quatre cinq' })
      )
      expect(result.success).toBe(true)
    })

    it('BI-T-02: devrait rejeter un titre de 6 mots (R2)', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ title: 'Un titre avec plus de cinq' })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('5 mots')
    })

    it('BI-T-03: devrait accepter un titre d\'1 mot (>= 5 chars)', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ title: 'Productivité' })
      )
      expect(result.success).toBe(true)
    })

    it('BI-T-04: devrait rejeter un titre < 5 caractères', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ title: 'Abcd' }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('5 caractères')
    })

    it('BI-T-05: devrait accepter un titre de 50 caractères exactement', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ title: 'A'.repeat(50) })
      )
      expect(result.success).toBe(true)
    })

    it('BI-T-06: devrait rejeter un titre de 51 caractères', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ title: 'A'.repeat(51) })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('50 caractères')
    })

    it('BI-T-07: devrait accepter un emoji dans le titre', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ title: 'Productivité 🚀' })
      )
      expect(result.success).toBe(true)
    })

    it('BI-T-08: devrait compter correctement les mots avec espaces multiples', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ title: 'Un  deux  trois' })
      )
      expect(result.success).toBe(true) // 3 mots malgré doubles espaces
    })
  })

  // === CHAMP description (R3) ===

  describe('Champ description (R3 - ponctuation finale)', () => {
    it('BI-D-01: devrait accepter une description terminant par un point', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ description: 'Une description valide et complète.' })
      )
      expect(result.success).toBe(true)
    })

    it('BI-D-02: devrait accepter une description terminant par un point d\'exclamation', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ description: 'Une description valide et complète!' })
      )
      expect(result.success).toBe(true)
    })

    it('BI-D-03: devrait rejeter une description sans ponctuation finale (R3)', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ description: 'Une description sans ponctuation finale' })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('point')
    })

    it('BI-D-04: devrait rejeter une description terminant par un point d\'interrogation', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ description: 'Une description avec question finale?' })
      )
      expect(result.success).toBe(false)
    })

    it('BI-D-05: devrait rejeter une description < 20 caractères', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ description: 'Court.' })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('20 caractères')
    })

    it('BI-D-06: devrait accepter une description de 150 caractères exactement', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ description: 'A'.repeat(149) + '.' })
      )
      expect(result.success).toBe(true)
    })

    it('BI-D-07: devrait rejeter une description > 150 caractères', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ description: 'A'.repeat(150) + '.' })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('150 caractères')
    })

    it('BI-D-08: devrait accepter une description de 20 caractères avec point', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ description: 'A'.repeat(19) + '.' })
      )
      expect(result.success).toBe(true)
    })
  })

  // === CHAMP order ===

  describe('Champ order', () => {
    it('BI-O-01: devrait accepter un entier positif', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ order: 10 }))
      expect(result.success).toBe(true)
    })

    it('BI-O-02: devrait rejeter order = 0', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ order: 0 }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('positif')
    })

    it('BI-O-03: devrait rejeter un order négatif', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ order: -1 }))
      expect(result.success).toBe(false)
    })

    it('BI-O-04: devrait rejeter un order décimal', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ order: 1.5 }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('entier')
    })

    it('BI-O-05: devrait rejeter order de type string', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ order: '1' }))
      expect(result.success).toBe(false)
    })
  })

  // === CHAMP locale ===

  describe('Champ locale', () => {
    it('BI-LC-01: devrait accepter un code langue de 2 caractères', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ locale: 'en' }))
      expect(result.success).toBe(true)
    })

    it('BI-LC-02: devrait rejeter un code langue de 3 caractères', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ locale: 'fra' }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('2 caractères')
    })

    it('BI-LC-03: devrait rejeter un code langue de 1 caractère', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ locale: 'f' }))
      expect(result.success).toBe(false)
    })
  })

  // === CHAMP ariaLabel ===

  describe('Champ ariaLabel (optionnel)', () => {
    it('BI-AL-01: devrait accepter un ariaLabel valide', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ ariaLabel: 'Icône représentant la productivité' })
      )
      expect(result.success).toBe(true)
    })

    it('BI-AL-02: devrait accepter un ariaLabel de 100 caractères', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ ariaLabel: 'A'.repeat(100) })
      )
      expect(result.success).toBe(true)
    })

    it('BI-AL-03: devrait rejeter un ariaLabel > 100 caractères', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ ariaLabel: 'A'.repeat(101) })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('100 caractères')
    })

    it('BI-AL-04: devrait accepter l\'absence de ariaLabel', () => {
      const input = createBenefit()
      delete (input as any).ariaLabel
      const result = benefitItemSchema.safeParse(input)
      expect(result.success).toBe(true)
    })
  })

  // === CHAMP updatedAt ===

  describe('Champ updatedAt (transformation)', () => {
    it('BI-UA-01: devrait transformer une date ISO en objet Date', () => {
      const result = benefitItemSchema.safeParse(validBenefitItem)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.updatedAt).toBeInstanceOf(Date)
        expect(result.data.updatedAt.toISOString()).toBe('2026-01-26T10:00:00.000Z')
      }
    })

    it('BI-UA-02: devrait rejeter une date invalide', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ updatedAt: 'invalid-date' })
      )
      expect(result.success).toBe(false)
    })

    it('BI-UA-03: devrait rejeter un champ updatedAt manquant', () => {
      const input = { ...validBenefitItem }
      delete (input as any).updatedAt
      const result = benefitItemSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('BI-UA-04: devrait rejeter une date non-ISO (format FR)', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ updatedAt: '26/01/2026' })
      )
      expect(result.success).toBe(false)
    })
  })

  // === CHAMP isActive ===

  describe('Champ isActive (type)', () => {
    it('BI-IA-01: devrait rejeter isActive de type string', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ isActive: 'true' as any })
      )
      expect(result.success).toBe(false)
    })
  })
})

// ====================================================================
// benefitItemListSchema
// ====================================================================

describe('benefitItemListSchema', () => {
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

  // === R1 : Unicité de order par locale ===

  describe('Règle R1 - Unicité de order par locale', () => {
    it('BL-R1-01: devrait rejeter deux actifs avec même order et même locale', () => {
      const list = [
        createBenefit({ id: 'benefit-1', order: 1 }),
        createBenefit({ id: 'benefit-2', order: 1 }),
      ]
      const result = benefitItemListSchema.safeParse(list)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('unique')
    })

    it('BL-R1-02: devrait accepter même order pour locales différentes', () => {
      const list = [
        createBenefit({ id: 'benefit-1', order: 1, locale: 'fr' }),
        createBenefit({ id: 'benefit-2', order: 1, locale: 'en' }),
      ]
      const result = benefitItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })

    it('BL-R1-03: devrait ignorer les inactifs pour la vérification d\'unicité', () => {
      const list = [
        createBenefit({ id: 'benefit-1', order: 1, isActive: true }),
        createBenefit({ id: 'benefit-2', order: 1, isActive: false }),
      ]
      const result = benefitItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })

    it('BL-R1-04: devrait accepter des orders différents pour même locale', () => {
      const list = [
        createBenefit({ id: 'benefit-1', order: 1 }),
        createBenefit({ id: 'benefit-2', order: 2 }),
        createBenefit({ id: 'benefit-3', order: 3 }),
      ]
      const result = benefitItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })

    it('BL-R1-05: devrait accepter deux inactifs avec même order', () => {
      const list = [
        createBenefit({ id: 'benefit-1', order: 1, isActive: false }),
        createBenefit({ id: 'benefit-2', order: 1, isActive: false }),
      ]
      const result = benefitItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })
  })

  // === R4 : Maximum 5 bénéfices actifs par locale ===

  describe('Règle R4 - Maximum 5 actifs par locale', () => {
    it('BL-R4-01: devrait accepter exactement 5 actifs', () => {
      const list = Array.from({ length: 5 }, (_, i) =>
        createBenefit({ id: `benefit-${i}`, order: i + 1 })
      )
      const result = benefitItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })

    it('BL-R4-02: devrait rejeter 6 actifs pour même locale', () => {
      const list = Array.from({ length: 6 }, (_, i) =>
        createBenefit({ id: `benefit-${i}`, order: i + 1 })
      )
      const result = benefitItemListSchema.safeParse(list)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('Maximum 5')
    })

    it('BL-R4-03: devrait accepter 6 éléments si 1 est inactif', () => {
      const list = [
        ...Array.from({ length: 5 }, (_, i) =>
          createBenefit({ id: `benefit-${i}`, order: i + 1 })
        ),
        createBenefit({ id: 'benefit-6', order: 6, isActive: false }),
      ]
      const result = benefitItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })

    it('BL-R4-04: devrait accepter 5 actifs par locale pour locales différentes', () => {
      const frBenefits = Array.from({ length: 5 }, (_, i) =>
        createBenefit({ id: `benefit-fr-${i}`, order: i + 1, locale: 'fr' })
      )
      const enBenefits = Array.from({ length: 5 }, (_, i) =>
        createBenefit({ id: `benefit-en-${i}`, order: i + 1, locale: 'en' })
      )
      const result = benefitItemListSchema.safeParse([...frBenefits, ...enBenefits])
      expect(result.success).toBe(true)
    })
  })

  // === Cas limites liste ===

  describe('Cas limites liste', () => {
    it('BL-CL-01: devrait accepter une liste vide', () => {
      const result = benefitItemListSchema.safeParse([])
      expect(result.success).toBe(true)
    })

    it('BL-CL-02: devrait accepter un seul élément', () => {
      const result = benefitItemListSchema.safeParse([createBenefit()])
      expect(result.success).toBe(true)
    })
  })
})
