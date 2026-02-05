// tests/unit/components/stats-row.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import StatsRow from '@components/hero/StatsRow.astro'
import type { StatItem } from '@/types'

describe('StatsRow Component', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  // Fixture de base valide
  const mockStats: StatItem[] = [
    {
      id: 'stat-productivity',
      value: '50%',
      numericValue: 50,
      unit: '%',
      label: 'Gain de productivité avec les agents IA',
      source: 'McKinsey Global Institute, 2024',
      sourceUrl: 'https://www.mckinsey.com/example',
      order: 1,
      locale: 'fr',
      isActive: true,
      highlight: true,
      updatedAt: new Date('2026-02-02'),
    },
    {
      id: 'stat-speed',
      value: '3x',
      numericValue: 3,
      unit: 'x',
      label: 'Plus rapide pour coder avec assistance IA',
      source: 'GitHub Copilot Research, 2023',
      sourceUrl: 'https://github.blog/example',
      order: 2,
      locale: 'fr',
      isActive: true,
      highlight: false,
      updatedAt: new Date('2026-02-02'),
    },
    {
      id: 'stat-satisfaction',
      value: '>90%',
      numericValue: 90,
      unit: '%',
      label: "Des développeurs satisfaits de l'IA",
      source: 'Stack Overflow Developer Survey 2024',
      sourceUrl: 'https://survey.stackoverflow.co/2024/ai',
      order: 3,
      locale: 'fr',
      isActive: true,
      highlight: false,
      updatedAt: new Date('2026-02-02'),
    },
  ]

  describe('Rendu de base', () => {
    it('T-00: should render as section element', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('<section')
      expect(result).toContain('</section>')
    })

    it('T-00b: should render aria-labelledby on section', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('aria-labelledby="stats-section-title"')
    })

    it('T-00c: should render h2 title element', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('<h2')
      expect(result).toContain('id="stats-section-title"')
    })

    it('should render correct number of StatDisplay components', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      const statValueMatches = result.match(/stat-value/g)
      expect(statValueMatches).toHaveLength(3)
    })

    it('should render grid container', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('grid')
    })

    it('should render all stat values', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('50%')
      expect(result).toContain('3x')
      // >90% sera échappé en HTML
      expect(result).toContain('90%')
    })

    it('should render all stat labels', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('Gain de productivité')
      expect(result).toContain('Plus rapide pour coder')
      expect(result).toContain('développeurs satisfaits')
    })

    it('should render all stat sources', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('McKinsey')
      expect(result).toContain('GitHub')
      expect(result).toContain('Stack Overflow')
    })
  })

  describe('Props: columns', () => {
    it('should apply auto column classes by default', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).toContain('md:grid-cols-3')
    })

    it('T-11: should apply 1 column classes', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, columns: 1 },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).not.toContain('md:grid-cols-3')
      expect(result).not.toContain('md:grid-cols-2')
    })

    it('T-12: should apply 2 column classes', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, columns: 2 },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).toContain('md:grid-cols-2')
    })

    it('should apply 3 column classes', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, columns: 3 },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).toContain('md:grid-cols-3')
    })
  })

  describe('Props: gap', () => {
    it('should apply md gap classes by default', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('gap-6')
      expect(result).toContain('md:gap-8')
    })

    it('should apply sm gap classes', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, gap: 'sm' },
      })

      expect(result).toContain('gap-4')
      expect(result).toContain('md:gap-5')
    })

    it('T-13: should apply lg gap classes', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, gap: 'lg' },
      })

      expect(result).toContain('gap-8')
      expect(result).toContain('md:gap-12')
    })
  })

  describe('Props: title et showTitle', () => {
    it('T-15: should render sr-only title by default', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('sr-only')
      expect(result).toContain('Chiffres clés')
    })

    it('T-14: should render visible title when showTitle=true', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, showTitle: true },
      })

      // Le h2 titre ne doit pas avoir la classe sr-only
      // (d'autres éléments comme les spans de StatDisplay peuvent avoir sr-only)
      const h2Match = result.match(/<h2[^>]*class="([^"]*)"/)
      expect(h2Match).toBeTruthy()
      expect(h2Match![1]).not.toContain('sr-only')
      expect(h2Match![1]).toContain('text-2xl')
      expect(h2Match![1]).toContain('font-bold')
    })

    it('T-16: should render custom title', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, title: 'AIAD en chiffres' },
      })

      expect(result).toContain('AIAD en chiffres')
    })
  })

  describe('Props: showDividers', () => {
    it('T-18: should render dividers by default', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('border-t')
      expect(result).toContain('border-gray-200')
      expect(result).toContain('md:border-l')
    })

    it('T-17: should not render dividers when showDividers=false', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, showDividers: false },
      })

      expect(result).not.toContain('border-t border-gray-200')
      expect(result).not.toContain('md:border-l')
    })

    it('should not render divider on first stat', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      // Compter le nombre d'occurrences de la classe séparateur
      const dividerMatches = result.match(/border-t border-gray-200/g)
      // Il doit y avoir exactement 2 séparateurs pour 3 stats
      expect(dividerMatches).toHaveLength(2)
    })
  })

  describe('Props: statVariant et auto-highlight', () => {
    it('T-27: should auto-detect highlight from stat data', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      // La première stat (highlight=true) doit avoir les classes highlight
      expect(result).toContain('bg-blue-50')
      expect(result).toContain('text-blue-700')

      // Les autres stats doivent avoir les classes default
      expect(result).toContain('text-blue-600')
    })

    it('T-26: should override highlight with statVariant="compact"', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, statVariant: 'compact' },
      })

      // Toutes les stats doivent être compact
      expect(result).toContain('text-2xl')
      expect(result).toContain('p-2')

      // Pas de styles highlight
      expect(result).not.toContain('bg-blue-50')
    })

    it('T-28: should handle mix of highlight and default', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      // bg-blue-50 ne doit apparaître qu'une fois (pour la stat highlight)
      const highlightMatches = result.match(/bg-blue-50/g)
      expect(highlightMatches).toHaveLength(1)
    })
  })

  describe('Props: showSources et linkSources', () => {
    it('should show sources by default', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('<cite')
      expect(result).toContain('McKinsey')
    })

    it('T-24: should hide sources when showSources=false', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, showSources: false },
      })

      expect(result).not.toContain('<cite')
      expect(result).not.toContain('<footer')
    })

    it('should render source links by default', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('<a')
      expect(result).toContain('target="_blank"')
    })

    it('T-25: should render plain text sources when linkSources=false', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, linkSources: false },
      })

      expect(result).toContain('<cite')
      expect(result).toContain('text-gray-500')
      // Pas de liens
      expect(result).not.toContain('target="_blank"')
    })
  })

  describe('Props: centered et maxWidth', () => {
    it('should apply centered classes by default', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('mx-auto')
    })

    it('T-19: should not apply mx-auto when centered=false', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, centered: false },
      })

      expect(result).not.toContain('mx-auto')
    })

    it('should apply default maxWidth', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('max-w-5xl')
    })

    it('T-20: should apply custom maxWidth', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, maxWidth: 'max-w-3xl' },
      })

      expect(result).toContain('max-w-3xl')
      expect(result).not.toContain('max-w-5xl')
    })
  })

  describe('Props: class et id', () => {
    it('T-21: should apply custom class', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, class: 'mt-8 custom-class' },
      })

      expect(result).toContain('mt-8')
      expect(result).toContain('custom-class')
    })

    it('T-22: should apply custom id', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, id: 'custom-stats' },
      })

      expect(result).toContain('id="custom-stats"')
      expect(result).toContain('aria-labelledby="custom-stats-title"')
    })
  })

  describe('Cas limites: Nombre de statistiques', () => {
    it('T-01: should not render section when stats array is empty', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: [] },
      })

      expect(result).not.toContain('<section')
    })

    it('T-02: should render correctly with 1 stat (no divider)', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: [mockStats[0]] },
      })

      expect(result).toContain('<section')
      const statValueMatches = result.match(/stat-value/g)
      expect(statValueMatches).toHaveLength(1)

      // Pas de séparateur avec 1 seule stat
      expect(result).not.toContain('border-t border-gray-200')
    })

    it('T-03: should render correctly with 2 stats (1 divider)', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats.slice(0, 2) },
      })

      const statValueMatches = result.match(/stat-value/g)
      expect(statValueMatches).toHaveLength(2)

      const dividerMatches = result.match(/border-t border-gray-200/g)
      expect(dividerMatches).toHaveLength(1)
    })

    it('T-04: should render correctly with 4 stats', async () => {
      const fourStats = [
        ...mockStats,
        { ...mockStats[0], id: 'stat-4', order: 4, highlight: false },
      ]

      const result = await container.renderToString(StatsRow, {
        props: { stats: fourStats },
      })

      const statValueMatches = result.match(/stat-value/g)
      expect(statValueMatches).toHaveLength(4)
    })

    it('T-05: should render with 6 stats', async () => {
      const sixStats = [
        ...mockStats,
        { ...mockStats[0], id: 'stat-4', order: 4, highlight: false },
        { ...mockStats[1], id: 'stat-5', order: 5 },
        { ...mockStats[2], id: 'stat-6', order: 6 },
      ]

      const result = await container.renderToString(StatsRow, {
        props: { stats: sixStats },
      })

      const statValueMatches = result.match(/stat-value/g)
      expect(statValueMatches).toHaveLength(6)
    })
  })

  describe('Cas limites: Tri et filtrage', () => {
    it('T-07: should render stats sorted by order', async () => {
      const unorderedStats = [
        { ...mockStats[2], order: 3 },
        { ...mockStats[0], order: 1 },
        { ...mockStats[1], order: 2 },
      ]

      const sortedStats = [...unorderedStats].sort((a, b) => a.order - b.order)

      const result = await container.renderToString(StatsRow, {
        props: { stats: sortedStats },
      })

      const productivityIndex = result.indexOf('productivité')
      const rapideIndex = result.indexOf('rapide')
      const satisfaitsIndex = result.indexOf('satisfaits')

      expect(productivityIndex).toBeLessThan(rapideIndex)
      expect(rapideIndex).toBeLessThan(satisfaitsIndex)
    })
  })

  describe('Accessibilité', () => {
    it('should use section element for semantic structure', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result.match(/<section/g)?.length).toBe(1)
    })

    it('should have aria-labelledby linking to title', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('aria-labelledby="stats-section-title"')
      expect(result).toContain('id="stats-section-title"')
    })

    it('should use h2 for section title', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('<h2')
      expect(result).not.toContain('<h1')
    })

    it('should have cite elements for each source', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      const citeMatches = result.match(/<cite/g)
      expect(citeMatches).toHaveLength(3)
    })

    it('should have noopener noreferrer on external links', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      const noopenerMatches = result.match(/rel="noopener noreferrer"/g)
      expect(noopenerMatches).toHaveLength(3)
    })

    it('should have sr-only text for external links', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      const srOnlyMatches = result.match(/nouvel onglet/g)
      expect(srOnlyMatches).toHaveLength(3)
    })
  })
})
