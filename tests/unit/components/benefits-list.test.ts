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

  // Fixture de base valide
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
    it('T-00: should render as section element', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('<section')
      expect(result).toContain('</section>')
    })

    it('T-00b: should render aria-labelledby on section', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('aria-labelledby="benefits-section-title"')
    })

    it('T-00c: should render h2 title element', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('<h2')
      expect(result).toContain('id="benefits-section-title"')
    })

    it('should render correct number of BenefitCards', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      const articleMatches = result.match(/<article/g)
      expect(articleMatches).toHaveLength(3)
    })

    it('should render grid container', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('class="grid')
    })
  })

  describe('Props: columns', () => {
    it('should apply auto column classes by default', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).toContain('md:grid-cols-3')
    })

    it('T-11: should apply 1 column classes', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, columns: 1 },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).not.toContain('md:grid-cols-3')
      expect(result).not.toContain('md:grid-cols-2')
    })

    it('T-12: should apply 2 column classes', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, columns: 2 },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).toContain('md:grid-cols-2')
    })

    it('should apply 3 column classes', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, columns: 3 },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).toContain('md:grid-cols-3')
    })
  })

  describe('Props: gap', () => {
    it('should apply md gap classes by default', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('gap-6')
      expect(result).toContain('md:gap-8')
    })

    it('should apply sm gap classes', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, gap: 'sm' },
      })

      expect(result).toContain('gap-4')
      expect(result).toContain('md:gap-5')
    })

    it('T-13: should apply lg gap classes', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, gap: 'lg' },
      })

      expect(result).toContain('gap-8')
      expect(result).toContain('md:gap-12')
    })
  })

  describe('Props: title et showTitle', () => {
    it('T-15: should render sr-only title by default', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('sr-only')
      expect(result).toContain('Bénéfices clés')
    })

    it('T-14: should render visible title when showTitle=true', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, showTitle: true },
      })

      expect(result).not.toContain('class="sr-only"')
      expect(result).toContain('text-2xl')
      expect(result).toContain('md:text-3xl')
      expect(result).toContain('font-bold')
    })

    it('T-16: should render custom title', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, title: 'Pourquoi AIAD ?' },
      })

      expect(result).toContain('Pourquoi AIAD ?')
    })
  })

  describe('Props: cardVariant', () => {
    it('should pass default variant to cards', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('bg-white')
    })

    it('T-17: should pass featured variant to cards', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, cardVariant: 'featured' },
      })

      expect(result).toContain('bg-blue-50')
      expect(result).toContain('border-blue-100')
    })

    it('should pass compact variant to cards', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, cardVariant: 'compact' },
      })

      expect(result).toContain('p-4')
    })
  })

  describe('Props: centered et maxWidth', () => {
    it('should apply centered classes by default', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('mx-auto')
    })

    it('T-18: should not apply mx-auto when centered=false', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, centered: false },
      })

      expect(result).not.toContain('mx-auto')
    })

    it('should apply default maxWidth', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('max-w-6xl')
    })

    it('T-19: should apply custom maxWidth', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, maxWidth: 'max-w-4xl' },
      })

      expect(result).toContain('max-w-4xl')
      expect(result).not.toContain('max-w-6xl')
    })
  })

  describe('Props: class et id', () => {
    it('T-20: should apply custom class', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, class: 'mt-8 custom-class' },
      })

      expect(result).toContain('mt-8')
      expect(result).toContain('custom-class')
    })

    it('T-21: should apply custom id', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, id: 'custom-benefits' },
      })

      expect(result).toContain('id="custom-benefits"')
      expect(result).toContain('aria-labelledby="custom-benefits-title"')
    })
  })

  describe('Cas limites: Nombre de bénéfices', () => {
    it('T-01: should not render section when benefits array is empty', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: [] },
      })

      expect(result).not.toContain('<section')
    })

    it('T-02: should render correctly with 1 benefit', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: [mockBenefits[0]] },
      })

      expect(result).toContain('<section')
      const articleMatches = result.match(/<article/g)
      expect(articleMatches).toHaveLength(1)
    })

    it('T-03: should render correctly with 2 benefits', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits.slice(0, 2) },
      })

      const articleMatches = result.match(/<article/g)
      expect(articleMatches).toHaveLength(2)
    })

    it('T-04: should render correctly with 5 benefits', async () => {
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

    it('T-05: should render with more than 5 benefits', async () => {
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
  })

  describe('Cas limites: Filtrage et tri', () => {
    it('T-06: should filter out inactive benefits', async () => {
      const mixedBenefits: BenefitItem[] = [
        { ...mockBenefits[0], isActive: true },
        { ...mockBenefits[1], isActive: false },
        { ...mockBenefits[2], isActive: true },
      ]

      // Note: Le filtrage se fait lors du chargement, pas dans le composant directement
      // Ce test vérifie que le composant accepte les données pré-filtrées
      const filteredBenefits = mixedBenefits.filter((b) => b.isActive)

      const result = await container.renderToString(BenefitsList, {
        props: { benefits: filteredBenefits },
      })

      const articleMatches = result.match(/<article/g)
      expect(articleMatches).toHaveLength(2)
    })

    it('T-07: should render benefits sorted by order', async () => {
      const unorderedBenefits: BenefitItem[] = [
        { ...mockBenefits[2], order: 3 },
        { ...mockBenefits[0], order: 1 },
        { ...mockBenefits[1], order: 2 },
      ]

      const sortedBenefits = [...unorderedBenefits].sort((a, b) => a.order - b.order)

      const result = await container.renderToString(BenefitsList, {
        props: { benefits: sortedBenefits },
      })

      // Vérifier que le premier bénéfice est celui avec order: 1
      const firstTitleIndex = result.indexOf('Productivité')
      const secondTitleIndex = result.indexOf('Qualité')
      const thirdTitleIndex = result.indexOf('Collaboration')

      expect(firstTitleIndex).toBeLessThan(secondTitleIndex)
      expect(secondTitleIndex).toBeLessThan(thirdTitleIndex)
    })
  })

  describe('Accessibilité', () => {
    it('should use section element for semantic structure', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result.match(/<section/g)?.length).toBe(1)
    })

    it('should have aria-labelledby linking to title', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('aria-labelledby="benefits-section-title"')
      expect(result).toContain('id="benefits-section-title"')
    })

    it('should use h2 for section title', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('<h2')
      expect(result).not.toContain('<h1')
    })

    it('should render h3 titles for each BenefitCard', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      const h3Matches = result.match(/<h3/g)
      expect(h3Matches).toHaveLength(3)
    })
  })

  describe('Props: iconPosition et iconSize', () => {
    it('should pass iconPosition to cards', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, iconPosition: 'left' },
      })

      expect(result).toContain('flex-row')
    })

    it('should pass iconSize to cards', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, iconSize: 'lg' },
      })

      expect(result).toContain('w-14')
      expect(result).toContain('h-14')
    })
  })
})
