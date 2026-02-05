// tests/unit/schemas/schemas-production.test.ts

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { benefitItemSchema, benefitItemListSchema } from '@/schemas/benefit'
import { statItemSchema, statItemListSchema } from '@/schemas/stat'

/**
 * Charge un fichier JSON depuis src/content/
 */
function loadJson(relativePath: string): unknown {
  const fullPath = resolve(__dirname, '../../../src/content', relativePath)
  return JSON.parse(readFileSync(fullPath, 'utf-8'))
}

describe('Validation croisée - Données de production', () => {
  describe('Fichiers JSON BenefitItem', () => {
    const benefitFiles = [
      'benefits/benefit-productivity.json',
      'benefits/benefit-quality.json',
      'benefits/benefit-collaboration.json',
    ]

    for (const file of benefitFiles) {
      it(`PROD-B-${file}: devrait valider ${file}`, () => {
        const data = loadJson(file)
        const result = benefitItemSchema.safeParse(data)
        expect(result.success, `${file} ne passe pas la validation: ${JSON.stringify(result.error?.issues)}`).toBe(true)
      })
    }

    it('PROD-BL: la liste complète des bénéfices de production devrait être valide', () => {
      const allBenefits = [
        loadJson('benefits/benefit-productivity.json'),
        loadJson('benefits/benefit-quality.json'),
        loadJson('benefits/benefit-collaboration.json'),
      ]
      const result = benefitItemListSchema.safeParse(allBenefits)
      expect(result.success).toBe(true)
    })

    it('PROD-BL-ORDER: les bénéfices de production ne doivent pas avoir d\'ordres dupliqués', () => {
      const allBenefits = [
        loadJson('benefits/benefit-productivity.json'),
        loadJson('benefits/benefit-quality.json'),
        loadJson('benefits/benefit-collaboration.json'),
      ]
      const result = benefitItemListSchema.safeParse(allBenefits)
      expect(result.success).toBe(true)
    })
  })

  describe('Fichiers JSON StatItem', () => {
    const statFiles = [
      'stats/stat-productivity.json',
      'stats/stat-speed.json',
      'stats/stat-satisfaction.json',
    ]

    for (const file of statFiles) {
      it(`PROD-S-${file}: devrait valider ${file}`, () => {
        const data = loadJson(file)
        const result = statItemSchema.safeParse(data)
        expect(result.success, `${file} ne passe pas la validation: ${JSON.stringify(result.error?.issues)}`).toBe(true)
      })
    }

    it('PROD-SL: la liste complète des statistiques de production devrait être valide', () => {
      const allStats = [
        loadJson('stats/stat-productivity.json'),
        loadJson('stats/stat-speed.json'),
        loadJson('stats/stat-satisfaction.json'),
      ]
      const result = statItemListSchema.safeParse(allStats)
      expect(result.success).toBe(true)
    })

    it('PROD-SL-ORDER: les statistiques de production ne doivent pas avoir d\'ordres dupliqués', () => {
      const allStats = [
        loadJson('stats/stat-productivity.json'),
        loadJson('stats/stat-speed.json'),
        loadJson('stats/stat-satisfaction.json'),
      ]
      const result = statItemListSchema.safeParse(allStats)
      expect(result.success).toBe(true)
    })
  })
})
