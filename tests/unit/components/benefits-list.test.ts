// tests/unit/components/benefits-list.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import BenefitsList from '@components/hero/BenefitsList.astro'
import type { BenefitItem } from '@/types'

describe('BenefitsList Component', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  const mockBenefits: BenefitItem[] = [
    {
      id: 'benefit-1',
      icon: 'trending-up',
      title: 'Productivité décuplée',
      description: 'Automatisez les tâches répétitives et concentrez-vous sur la valeur.',
      order: 1,
      locale: 'fr',
      isActive: true,
      updatedAt: new Date('2026-02-02'),
    },
    {
      id: 'benefit-2',
      icon: 'check-circle',
      title: 'Qualité garantie',
      description: 'Des standards de code et des validations intégrés.',
      order: 2,
      locale: 'fr',
      isActive: true,
      updatedAt: new Date('2026-02-02'),
    },
    {
      id: 'benefit-3',
      icon: 'users',
      title: 'Collaboration fluide',
      description: 'Une méthodologie claire pour structurer le travail.',
      order: 3,
      locale: 'fr',
      isActive: true,
      updatedAt: new Date('2026-02-02'),
    },
  ]

  describe('Rendu de base', () => {
    it('BL-00: devrait rendre dans un <section>', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('<section')
      expect(result).toContain('</section>')
    })

    it('BL-00b: devrait avoir aria-labelledby sur la section', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('aria-labelledby="benefits-section-title"')
    })

    it('BL-00c: devrait rendre un <h2> pour le titre de section', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('<h2')
      expect(result).toContain('id="benefits-section-title"')
    })

    it('BL-01: devrait rendre le nombre correct de BenefitCards (<article>)', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      const articleMatches = result.match(/<article/g)
      expect(articleMatches).toHaveLength(3)
    })

    it('BL-02: devrait rendre un conteneur grid', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('class="grid')
    })
  })

  describe('Props: columns', () => {
    it('BL-03: devrait appliquer columns auto par défaut (grid-cols-1 md:grid-cols-3)', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).toContain('md:grid-cols-3')
    })

    it('BL-04: devrait appliquer columns=1 (grid-cols-1 sans md:grid-cols-*)', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, columns: 1 },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).not.toContain('md:grid-cols-3')
      expect(result).not.toContain('md:grid-cols-2')
    })

    it('BL-05: devrait appliquer columns=2 (grid-cols-1 md:grid-cols-2)', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, columns: 2 },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).toContain('md:grid-cols-2')
    })

    it('BL-06: devrait appliquer columns=3 (grid-cols-1 md:grid-cols-3)', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, columns: 3 },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).toContain('md:grid-cols-3')
    })
  })

  describe('Props: gap', () => {
    it('BL-07: devrait appliquer gap md par défaut (gap-6 md:gap-8)', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('gap-6')
      expect(result).toContain('md:gap-8')
    })

    it('BL-08: devrait appliquer gap sm (gap-4 md:gap-5)', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, gap: 'sm' },
      })

      expect(result).toContain('gap-4')
      expect(result).toContain('md:gap-5')
    })

    it('BL-09: devrait appliquer gap lg (gap-8 md:gap-12)', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, gap: 'lg' },
      })

      expect(result).toContain('gap-8')
      expect(result).toContain('md:gap-12')
    })
  })

  describe('Props: showTitle', () => {
    it('BL-10: devrait rendre le titre en sr-only par défaut (showTitle=false)', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('sr-only')
      expect(result).toContain('Bénéfices clés')
    })

    it('BL-11: devrait rendre le titre visible quand showTitle=true', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, showTitle: true },
      })

      expect(result).not.toContain('class="sr-only"')
      expect(result).toContain('text-2xl')
      expect(result).toContain('md:text-3xl')
      expect(result).toContain('font-bold')
    })

    it('BL-12: devrait rendre un titre custom', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, title: 'Pourquoi AIAD ?' },
      })

      expect(result).toContain('Pourquoi AIAD ?')
    })
  })

  describe('Props: cardVariant', () => {
    it('BL-13: devrait propager cardVariant default (bg-white)', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('bg-white')
    })

    it('BL-14: devrait propager cardVariant featured (bg-blue-50 border-blue-100)', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, cardVariant: 'featured' },
      })

      expect(result).toContain('bg-blue-50')
      expect(result).toContain('border-blue-100')
    })

    it('BL-15: devrait propager cardVariant compact (p-4)', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, cardVariant: 'compact' },
      })

      expect(result).toContain('p-4')
    })
  })

  describe('Props: centered', () => {
    it('BL-16: devrait appliquer mx-auto par défaut (centered=true)', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('mx-auto')
    })

    it('BL-17: devrait ne pas appliquer mx-auto quand centered=false', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, centered: false },
      })

      expect(result).not.toContain('mx-auto')
    })
  })

  describe('Props: maxWidth', () => {
    it('BL-18: devrait appliquer max-w-6xl par défaut', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('max-w-6xl')
    })

    it('BL-19: devrait appliquer un maxWidth custom', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, maxWidth: 'max-w-4xl' },
      })

      expect(result).toContain('max-w-4xl')
      expect(result).not.toContain('max-w-6xl')
    })
  })

  describe('Props: class et id', () => {
    it('BL-20: devrait appliquer une classe custom', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, class: 'mt-8 custom-class' },
      })

      expect(result).toContain('mt-8')
      expect(result).toContain('custom-class')
    })

    it('BL-21: devrait appliquer un id custom avec aria-labelledby cohérent', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, id: 'custom' },
      })

      expect(result).toContain('id="custom"')
      expect(result).toContain('aria-labelledby="custom-title"')
    })
  })

  describe('Props: propagation', () => {
    it('BL-22: devrait propager iconPosition=left aux cartes', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, iconPosition: 'left' },
      })

      expect(result).toContain('flex-row')
    })

    it('BL-23: devrait propager iconSize=lg aux cartes', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, iconSize: 'lg' },
      })

      expect(result).toContain('w-14')
      expect(result).toContain('h-14')
    })
  })

  describe('Cas limites: Contenu', () => {
    it('BL-CL-01: devrait ne pas rendre de <section> quand la liste est vide', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: [] },
      })

      expect(result).not.toContain('<section')
    })

    it('BL-CL-02: devrait rendre 1 <article> pour 1 bénéfice', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: [mockBenefits[0]] },
      })

      expect(result).toContain('<section')
      const articleMatches = result.match(/<article/g)
      expect(articleMatches).toHaveLength(1)
    })

    it('BL-CL-03: devrait rendre 2 <article> pour 2 bénéfices', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits.slice(0, 2) },
      })

      const articleMatches = result.match(/<article/g)
      expect(articleMatches).toHaveLength(2)
    })

    it('BL-CL-04: devrait rendre 5 <article> pour 5 bénéfices', async () => {
      const fiveBenefits: BenefitItem[] = [
        ...mockBenefits,
        { ...mockBenefits[0], id: 'benefit-4', order: 4 },
        { ...mockBenefits[0], id: 'benefit-5', order: 5 },
      ]

      const result = await container.renderToString(BenefitsList, {
        props: { benefits: fiveBenefits },
      })

      const articleMatches = result.match(/<article/g)
      expect(articleMatches).toHaveLength(5)
    })

    it('BL-CL-05: devrait rendre 6 bénéfices sans crash (dépassement)', async () => {
      const sixBenefits: BenefitItem[] = [
        ...mockBenefits,
        { ...mockBenefits[0], id: 'benefit-4', order: 4 },
        { ...mockBenefits[0], id: 'benefit-5', order: 5 },
        { ...mockBenefits[0], id: 'benefit-6', order: 6 },
      ]

      const result = await container.renderToString(BenefitsList, {
        props: { benefits: sixBenefits },
      })

      const articleMatches = result.match(/<article/g)
      expect(articleMatches).toHaveLength(6)
    })

    it('BL-CL-06: devrait gérer les bénéfices pré-filtrés (actifs uniquement)', async () => {
      const mixedBenefits: BenefitItem[] = [
        { ...mockBenefits[0], isActive: true },
        { ...mockBenefits[1], isActive: false },
        { ...mockBenefits[2], isActive: true },
      ]

      const filteredBenefits = mixedBenefits.filter((b) => b.isActive)

      const result = await container.renderToString(BenefitsList, {
        props: { benefits: filteredBenefits },
      })

      const articleMatches = result.match(/<article/g)
      expect(articleMatches).toHaveLength(2)
    })

    it('BL-CL-07: devrait respecter l\'ordre des bénéfices', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      const firstTitleIndex = result.indexOf('Productivité')
      const secondTitleIndex = result.indexOf('Qualité')
      const thirdTitleIndex = result.indexOf('Collaboration')

      expect(firstTitleIndex).toBeLessThan(secondTitleIndex)
      expect(secondTitleIndex).toBeLessThan(thirdTitleIndex)
    })
  })

  describe('Accessibilité', () => {
    it('BL-A-01: devrait avoir une seule <section>', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result.match(/<section/g)?.length).toBe(1)
    })

    it('BL-A-02: devrait avoir aria-labelledby pointant vers l\'id du <h2>', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('aria-labelledby="benefits-section-title"')
      expect(result).toContain('id="benefits-section-title"')
    })

    it('BL-A-03: devrait utiliser un <h2> pour le titre (pas h1)', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('<h2')
      expect(result).not.toContain('<h1')
    })

    it('BL-A-04: devrait rendre un <h3> dans chaque BenefitCard', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      const h3Matches = result.match(/<h3/g)
      expect(h3Matches).toHaveLength(3)
    })
  })
})
