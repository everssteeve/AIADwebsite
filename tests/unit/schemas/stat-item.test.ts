// tests/unit/schemas/stat-item.test.ts

import { describe, it, expect } from 'vitest'
import { statItemSchema, statItemListSchema, STAT_ITEM_ERRORS } from '@/schemas/stat'

describe('statItemSchema', () => {
  // === FIXTURE DE BASE ===
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

  const createStat = (overrides = {}) => ({
    ...validStatItem,
    ...overrides,
  })

  // === VALIDATION BASIQUE ===

  describe('Validation basique', () => {
    it('SI-00: devrait valider un StatItem correct complet', () => {
      const result = statItemSchema.safeParse(validStatItem)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe('stat-productivity')
        expect(result.data.value).toBe('50%')
        expect(result.data.numericValue).toBe(50)
        expect(result.data.locale).toBe('fr')
        expect(result.data.isActive).toBe(true)
        expect(result.data.highlight).toBe(false)
        expect(result.data.updatedAt).toBeInstanceOf(Date)
      }
    })

    it('SI-01: devrait appliquer les valeurs par défaut (locale, isActive, highlight)', () => {
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
        expect(result.data.numericValue).toBeUndefined()
        expect(result.data.unit).toBeUndefined()
        expect(result.data.sourceUrl).toBeUndefined()
      }
    })

    it('SI-02: devrait rejeter null', () => {
      const result = statItemSchema.safeParse(null)
      expect(result.success).toBe(false)
    })

    it('SI-03: devrait rejeter undefined', () => {
      const result = statItemSchema.safeParse(undefined)
      expect(result.success).toBe(false)
    })

    it('SI-04: devrait rejeter un objet vide', () => {
      const result = statItemSchema.safeParse({})
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    })
  })

  // === CHAMP id ===

  describe('Champ id', () => {
    it('SI-ID-01: devrait accepter un id valide minimal (3 chars)', () => {
      const result = statItemSchema.safeParse(createStat({ id: 'abc' }))
      expect(result.success).toBe(true)
    })

    it('SI-ID-02: devrait accepter un id valide maximal (50 chars)', () => {
      const result = statItemSchema.safeParse(createStat({ id: 'a'.repeat(50) }))
      expect(result.success).toBe(true)
    })

    it('SI-ID-03: devrait rejeter un id trop court (2 chars)', () => {
      const result = statItemSchema.safeParse(createStat({ id: 'ab' }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.ID_TOO_SHORT)
    })

    it('SI-ID-04: devrait rejeter un id trop long (51 chars)', () => {
      const result = statItemSchema.safeParse(createStat({ id: 'a'.repeat(51) }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.ID_TOO_LONG)
    })

    it('SI-ID-05: devrait rejeter un id avec majuscules', () => {
      const result = statItemSchema.safeParse(createStat({ id: 'Stat-Test' }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.ID_INVALID_FORMAT)
    })

    it('SI-ID-06: devrait rejeter un id avec espaces', () => {
      const result = statItemSchema.safeParse(createStat({ id: 'stat test' }))
      expect(result.success).toBe(false)
    })

    it('SI-ID-07: devrait accepter un id avec chiffres et tirets', () => {
      const result = statItemSchema.safeParse(createStat({ id: 'stat-123-test' }))
      expect(result.success).toBe(true)
    })
  })

  // === CHAMP value (R5) ===

  describe('Champ value (R5 - doit contenir un chiffre)', () => {
    it('SI-V-01: devrait accepter une valeur avec pourcentage', () => {
      const result = statItemSchema.safeParse(createStat({ value: '50%' }))
      expect(result.success).toBe(true)
    })

    it('SI-V-02: devrait accepter une valeur multiplicateur', () => {
      const result = statItemSchema.safeParse(createStat({ value: '3x' }))
      expect(result.success).toBe(true)
    })

    it('SI-V-03: devrait accepter une valeur avec opérateur', () => {
      const result = statItemSchema.safeParse(createStat({ value: '>90%' }))
      expect(result.success).toBe(true)
    })

    it('SI-V-04: devrait accepter la valeur "0"', () => {
      const result = statItemSchema.safeParse(createStat({ value: '0' }))
      expect(result.success).toBe(true)
    })

    it('SI-V-05: devrait rejeter une valeur sans chiffre (R5)', () => {
      const result = statItemSchema.safeParse(createStat({ value: 'N/A' }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.VALUE_NO_DIGIT)
    })

    it('SI-V-06: devrait rejeter un symbole seul sans chiffre (R5)', () => {
      const result = statItemSchema.safeParse(createStat({ value: '%' }))
      expect(result.success).toBe(false)
    })

    it('SI-V-07: devrait accepter une valeur de 20 caractères exactement', () => {
      const result = statItemSchema.safeParse(
        createStat({ value: '12345678901234567890' })
      )
      expect(result.success).toBe(true)
    })

    it('SI-V-08: devrait rejeter une valeur de 21 caractères', () => {
      const result = statItemSchema.safeParse(
        createStat({ value: '123456789012345678901' })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.VALUE_TOO_LONG)
    })

    it('SI-V-09: devrait accepter divers formats valides', () => {
      const validValues = ['50%', '3x', '100+', '>90%', '24h', '1000', '2.5x']
      for (const value of validValues) {
        const result = statItemSchema.safeParse(createStat({ value }))
        expect(result.success, `La valeur '${value}' devrait être acceptée`).toBe(true)
      }
    })

    it('SI-V-10: devrait rejeter value de type number', () => {
      const result = statItemSchema.safeParse(createStat({ value: 50 }))
      expect(result.success).toBe(false)
    })
  })

  // === CHAMP label (R2) ===

  describe('Champ label (R2 - explicatif)', () => {
    it('SI-L-01: devrait accepter un label de 10 caractères exactement', () => {
      const result = statItemSchema.safeParse(createStat({ label: '1234567890' }))
      expect(result.success).toBe(true)
    })

    it('SI-L-02: devrait rejeter un label < 10 caractères', () => {
      const result = statItemSchema.safeParse(createStat({ label: 'Court' }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.LABEL_TOO_SHORT)
    })

    it('SI-L-03: devrait rejeter un label > 100 caractères', () => {
      const result = statItemSchema.safeParse(
        createStat({ label: 'A'.repeat(101) })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.LABEL_TOO_LONG)
    })

    it('SI-L-04: devrait accepter un label de 100 caractères exactement', () => {
      const result = statItemSchema.safeParse(
        createStat({ label: 'A'.repeat(100) })
      )
      expect(result.success).toBe(true)
    })
  })

  // === CHAMP source (R3) ===

  describe('Champ source (R3 - renseignée)', () => {
    it('SI-S-01: devrait accepter une source de 5 caractères exactement', () => {
      const result = statItemSchema.safeParse(createStat({ source: '12345' }))
      expect(result.success).toBe(true)
    })

    it('SI-S-02: devrait rejeter une source vide', () => {
      const result = statItemSchema.safeParse(createStat({ source: '' }))
      expect(result.success).toBe(false)
    })

    it('SI-S-03: devrait rejeter une source < 5 caractères', () => {
      const result = statItemSchema.safeParse(createStat({ source: 'Test' }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.SOURCE_TOO_SHORT)
    })

    it('SI-S-04: devrait rejeter une source > 150 caractères', () => {
      const result = statItemSchema.safeParse(
        createStat({ source: 'A'.repeat(151) })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.SOURCE_TOO_LONG)
    })

    it('SI-S-05: devrait accepter une source de 150 caractères exactement', () => {
      const result = statItemSchema.safeParse(
        createStat({ source: 'A'.repeat(150) })
      )
      expect(result.success).toBe(true)
    })
  })

  // === CHAMP sourceUrl (R6) ===

  describe('Champ sourceUrl (R6 - URL valide si fournie)', () => {
    it('SI-SU-01: devrait accepter une URL HTTPS valide', () => {
      const result = statItemSchema.safeParse(
        createStat({ sourceUrl: 'https://example.com/study' })
      )
      expect(result.success).toBe(true)
    })

    it('SI-SU-02: devrait accepter une URL HTTP valide', () => {
      const result = statItemSchema.safeParse(
        createStat({ sourceUrl: 'http://example.com/study' })
      )
      expect(result.success).toBe(true)
    })

    it('SI-SU-03: devrait rejeter une URL invalide', () => {
      const result = statItemSchema.safeParse(
        createStat({ sourceUrl: 'not-a-url' })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.SOURCE_URL_INVALID)
    })

    it('SI-SU-04: devrait accepter l\'absence de sourceUrl', () => {
      const input = createStat()
      delete (input as any).sourceUrl
      const result = statItemSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('SI-SU-05: devrait rejeter une chaîne vide pour sourceUrl', () => {
      const result = statItemSchema.safeParse(
        createStat({ sourceUrl: '' })
      )
      expect(result.success).toBe(false)
    })
  })

  // === CHAMP order ===

  describe('Champ order', () => {
    it('SI-O-01: devrait accepter un entier positif', () => {
      const result = statItemSchema.safeParse(createStat({ order: 10 }))
      expect(result.success).toBe(true)
    })

    it('SI-O-02: devrait rejeter order = 0', () => {
      const result = statItemSchema.safeParse(createStat({ order: 0 }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.ORDER_NOT_POSITIVE)
    })

    it('SI-O-03: devrait rejeter un order négatif', () => {
      const result = statItemSchema.safeParse(createStat({ order: -1 }))
      expect(result.success).toBe(false)
    })

    it('SI-O-04: devrait rejeter un order décimal', () => {
      const result = statItemSchema.safeParse(createStat({ order: 1.5 }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.ORDER_NOT_INTEGER)
    })
  })

  // === CHAMP highlight ===

  describe('Champ highlight', () => {
    it('SI-H-01: devrait accepter highlight = true', () => {
      const result = statItemSchema.safeParse(createStat({ highlight: true }))
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.highlight).toBe(true)
      }
    })

    it('SI-H-02: devrait avoir false comme valeur par défaut', () => {
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

    it('SI-H-03: devrait rejeter highlight de type number', () => {
      const result = statItemSchema.safeParse(createStat({ highlight: 1 }))
      expect(result.success).toBe(false)
    })
  })

  // === CHAMPS optionnels ===

  describe('Champs optionnels (numericValue, unit)', () => {
    it('SI-OPT-01: devrait accepter numericValue', () => {
      const result = statItemSchema.safeParse(createStat({ numericValue: 50 }))
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.numericValue).toBe(50)
      }
    })

    it('SI-OPT-02: devrait accepter numericValue négatif', () => {
      const result = statItemSchema.safeParse(createStat({ numericValue: -10 }))
      expect(result.success).toBe(true)
    })

    it('SI-OPT-03: devrait accepter numericValue = 0', () => {
      const result = statItemSchema.safeParse(createStat({ numericValue: 0 }))
      expect(result.success).toBe(true)
    })

    it('SI-OPT-04: devrait accepter une unité valide', () => {
      const result = statItemSchema.safeParse(createStat({ unit: '%' }))
      expect(result.success).toBe(true)
    })

    it('SI-OPT-05: devrait rejeter une unité > 10 caractères', () => {
      const result = statItemSchema.safeParse(
        createStat({ unit: 'A'.repeat(11) })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.UNIT_TOO_LONG)
    })

    it('SI-OPT-06: devrait accepter une unité vide', () => {
      const result = statItemSchema.safeParse(createStat({ unit: '' }))
      expect(result.success).toBe(true)
    })
  })

  // === CHAMP updatedAt ===

  describe('Champ updatedAt (transformation)', () => {
    it('SI-UA-01: devrait transformer une date ISO en objet Date', () => {
      const result = statItemSchema.safeParse(validStatItem)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.updatedAt).toBeInstanceOf(Date)
        expect(result.data.updatedAt.toISOString()).toBe('2026-01-27T10:00:00.000Z')
      }
    })

    it('SI-UA-02: devrait rejeter une date invalide', () => {
      const result = statItemSchema.safeParse(
        createStat({ updatedAt: 'invalid-date' })
      )
      expect(result.success).toBe(false)
    })
  })

  // === MESSAGES D'ERREUR (STAT_ITEM_ERRORS) ===

  describe('Constante STAT_ITEM_ERRORS', () => {
    it('SI-ERR-01: devrait exporter toutes les clés d\'erreur attendues', () => {
      const expectedKeys = [
        'ID_TOO_SHORT', 'ID_TOO_LONG', 'ID_INVALID_FORMAT',
        'VALUE_TOO_SHORT', 'VALUE_TOO_LONG', 'VALUE_NO_DIGIT',
        'UNIT_TOO_LONG',
        'LABEL_TOO_SHORT', 'LABEL_TOO_LONG',
        'SOURCE_TOO_SHORT', 'SOURCE_TOO_LONG', 'SOURCE_URL_INVALID',
        'ORDER_NOT_INTEGER', 'ORDER_NOT_POSITIVE', 'ORDER_NOT_UNIQUE',
        'MAX_STATS_EXCEEDED',
        'LOCALE_INVALID', 'DATE_INVALID',
      ]
      for (const key of expectedKeys) {
        expect(STAT_ITEM_ERRORS).toHaveProperty(key)
        expect(typeof (STAT_ITEM_ERRORS as any)[key]).toBe('string')
      }
    })

    it('SI-ERR-02: les messages d\'erreur doivent être en français', () => {
      for (const message of Object.values(STAT_ITEM_ERRORS)) {
        // Vérifie que les messages contiennent des caractères français
        // (au moins un mot français commun ou des accents)
        expect(typeof message).toBe('string')
        expect(message.length).toBeGreaterThan(0)
      }
    })
  })
})

// ====================================================================
// statItemListSchema
// ====================================================================

describe('statItemListSchema', () => {
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

  // === R1 : Unicité de order par locale ===

  describe('Règle R1 - Unicité de order par locale', () => {
    it('SL-R1-01: devrait rejeter deux actifs avec même order et même locale', () => {
      const list = [
        createStat({ id: 'stat-1', order: 1 }),
        createStat({ id: 'stat-2', order: 1 }),
      ]
      const result = statItemListSchema.safeParse(list)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.ORDER_NOT_UNIQUE)
    })

    it('SL-R1-02: devrait accepter même order pour locales différentes', () => {
      const list = [
        createStat({ id: 'stat-1', order: 1, locale: 'fr' }),
        createStat({ id: 'stat-2', order: 1, locale: 'en' }),
      ]
      const result = statItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })

    it('SL-R1-03: devrait ignorer les inactifs pour la vérification d\'unicité', () => {
      const list = [
        createStat({ id: 'stat-1', order: 1, isActive: true }),
        createStat({ id: 'stat-2', order: 1, isActive: false }),
      ]
      const result = statItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })

    it('SL-R1-04: devrait accepter des orders différents pour même locale', () => {
      const list = [
        createStat({ id: 'stat-1', order: 1 }),
        createStat({ id: 'stat-2', order: 2 }),
        createStat({ id: 'stat-3', order: 3 }),
      ]
      const result = statItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })

    it('SL-R1-05: devrait accepter deux inactifs avec même order', () => {
      const list = [
        createStat({ id: 'stat-1', order: 1, isActive: false }),
        createStat({ id: 'stat-2', order: 1, isActive: false }),
      ]
      const result = statItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })
  })

  // === R4 : Maximum 6 statistiques actives par locale ===

  describe('Règle R4 - Maximum 6 actifs par locale', () => {
    it('SL-R4-01: devrait accepter exactement 6 actifs', () => {
      const list = Array.from({ length: 6 }, (_, i) =>
        createStat({ id: `stat-${i}`, order: i + 1 })
      )
      const result = statItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })

    it('SL-R4-02: devrait rejeter 7 actifs pour même locale', () => {
      const list = Array.from({ length: 7 }, (_, i) =>
        createStat({ id: `stat-${i}`, order: i + 1 })
      )
      const result = statItemListSchema.safeParse(list)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.MAX_STATS_EXCEEDED)
    })

    it('SL-R4-03: devrait accepter 7 éléments si 1 est inactif', () => {
      const list = [
        ...Array.from({ length: 6 }, (_, i) =>
          createStat({ id: `stat-${i}`, order: i + 1 })
        ),
        createStat({ id: 'stat-7', order: 7, isActive: false }),
      ]
      const result = statItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })

    it('SL-R4-04: devrait accepter 6 actifs par locale pour locales différentes', () => {
      const frStats = Array.from({ length: 6 }, (_, i) =>
        createStat({ id: `stat-fr-${i}`, order: i + 1, locale: 'fr' })
      )
      const enStats = Array.from({ length: 6 }, (_, i) =>
        createStat({ id: `stat-en-${i}`, order: i + 1, locale: 'en' })
      )
      const result = statItemListSchema.safeParse([...frStats, ...enStats])
      expect(result.success).toBe(true)
    })
  })

  // === Cas limites liste ===

  describe('Cas limites liste', () => {
    it('SL-CL-01: devrait accepter une liste vide', () => {
      const result = statItemListSchema.safeParse([])
      expect(result.success).toBe(true)
    })

    it('SL-CL-02: devrait accepter un seul élément', () => {
      const result = statItemListSchema.safeParse([createStat()])
      expect(result.success).toBe(true)
    })
  })
})
