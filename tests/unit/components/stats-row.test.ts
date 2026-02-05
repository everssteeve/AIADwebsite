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
    it('SR-00: devrait rendre dans un <section>', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('<section')
      expect(result).toContain('</section>')
    })

    it('SR-00b: devrait avoir aria-labelledby sur la section', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('aria-labelledby="stats-section-title"')
    })

    it('SR-00c: devrait rendre un <h2> pour le titre de section', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('<h2')
      expect(result).toContain('id="stats-section-title"')
    })

    it('SR-01: devrait rendre le nombre correct de StatDisplay (stat-value)', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      const statValueMatches = result.match(/stat-value/g)
      expect(statValueMatches).toHaveLength(3)
    })

    it('SR-02: devrait rendre un conteneur grid', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('grid')
    })

    it('SR-03: devrait rendre toutes les valeurs', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('50%')
      expect(result).toContain('3x')
      expect(result).toContain('90%')
    })

    it('SR-04: devrait rendre tous les labels', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('Gain de productivité')
      expect(result).toContain('Plus rapide pour coder')
      expect(result).toContain('développeurs satisfaits')
    })

    it('SR-05: devrait rendre toutes les sources', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('McKinsey')
      expect(result).toContain('GitHub')
      expect(result).toContain('Stack Overflow')
    })
  })

  describe('Props: columns', () => {
    it('SR-06: devrait appliquer columns auto par défaut (grid-cols-1 md:grid-cols-3)', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).toContain('md:grid-cols-3')
    })

    it('SR-07: devrait appliquer columns=1 (grid-cols-1 uniquement)', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, columns: 1 },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).not.toContain('md:grid-cols-3')
      expect(result).not.toContain('md:grid-cols-2')
    })

    it('SR-08: devrait appliquer columns=2 (grid-cols-1 md:grid-cols-2)', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, columns: 2 },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).toContain('md:grid-cols-2')
    })
  })

  describe('Props: gap', () => {
    it('SR-09: devrait appliquer gap md par défaut (gap-6 md:gap-8)', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('gap-6')
      expect(result).toContain('md:gap-8')
    })

    it('SR-10: devrait appliquer gap sm (gap-4 md:gap-5)', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, gap: 'sm' },
      })

      expect(result).toContain('gap-4')
      expect(result).toContain('md:gap-5')
    })

    it('SR-11: devrait appliquer gap lg (gap-8 md:gap-12)', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, gap: 'lg' },
      })

      expect(result).toContain('gap-8')
      expect(result).toContain('md:gap-12')
    })
  })

  describe('Props: title et showTitle', () => {
    it('SR-12: devrait rendre le titre en sr-only par défaut (showTitle=false)', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('sr-only')
      expect(result).toContain('Chiffres clés')
    })

    it('SR-13: devrait rendre le titre visible quand showTitle=true', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, showTitle: true },
      })

      const h2Match = result.match(/<h2[^>]*class="([^"]*)"/)
      expect(h2Match).toBeTruthy()
      expect(h2Match![1]).not.toContain('sr-only')
      expect(h2Match![1]).toContain('text-2xl')
      expect(h2Match![1]).toContain('font-bold')
    })

    it('SR-14: devrait rendre un titre custom', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, title: 'AIAD en chiffres' },
      })

      expect(result).toContain('AIAD en chiffres')
    })
  })

  describe('Props: showDividers', () => {
    it('SR-15: devrait rendre les séparateurs par défaut (showDividers=true)', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('border-t')
      expect(result).toContain('border-gray-200')
      expect(result).toContain('md:border-l')
    })

    it('SR-16: devrait ne pas rendre de séparateurs quand showDividers=false', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, showDividers: false },
      })

      expect(result).not.toContain('border-t border-gray-200')
      expect(result).not.toContain('md:border-l')
    })

    it('SR-17: devrait ne pas avoir de séparateur sur la première stat', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      const dividerMatches = result.match(/border-t border-gray-200/g)
      expect(dividerMatches).toHaveLength(2)
    })
  })

  describe('Props: statVariant', () => {
    it('SR-18: devrait overrider le highlight auto avec statVariant', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, statVariant: 'compact' },
      })

      expect(result).toContain('text-2xl')
      expect(result).toContain('p-2')
      expect(result).not.toContain('bg-blue-50')
    })

    it('SR-19: devrait auto-détecter highlight depuis stat.highlight', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('bg-blue-50')
      expect(result).toContain('text-blue-700')
      expect(result).toContain('text-blue-600')
    })

    it('SR-20: devrait avoir 1 seul bg-blue-50 pour le mix highlight/default', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      const highlightMatches = result.match(/bg-blue-50/g)
      expect(highlightMatches).toHaveLength(1)
    })
  })

  describe('Props: showSources et linkSources', () => {
    it('SR-21: devrait afficher les sources par défaut (showSources=true)', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('<cite')
      expect(result).toContain('McKinsey')
    })

    it('SR-22: devrait masquer les sources quand showSources=false', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, showSources: false },
      })

      expect(result).not.toContain('<cite')
      expect(result).not.toContain('<footer')
    })

    it('SR-23: devrait rendre les sources en liens par défaut (linkSources=true)', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('<a')
      expect(result).toContain('target="_blank"')
    })

    it('SR-24: devrait rendre les sources en texte quand linkSources=false', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, linkSources: false },
      })

      expect(result).toContain('<cite')
      expect(result).toContain('text-gray-500')
      expect(result).not.toContain('target="_blank"')
    })
  })

  describe('Props: centered et maxWidth', () => {
    it('SR-25: devrait appliquer mx-auto par défaut (centered=true)', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('mx-auto')
    })

    it('SR-26: devrait ne pas appliquer mx-auto quand centered=false', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, centered: false },
      })

      expect(result).not.toContain('mx-auto')
    })

    it('SR-27: devrait appliquer max-w-5xl par défaut', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('max-w-5xl')
    })

    it('SR-28: devrait appliquer un maxWidth custom', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, maxWidth: 'max-w-3xl' },
      })

      expect(result).toContain('max-w-3xl')
      expect(result).not.toContain('max-w-5xl')
    })
  })

  describe('Props: class et id', () => {
    it('SR-29: devrait appliquer une classe custom', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, class: 'mt-8 custom-class' },
      })

      expect(result).toContain('mt-8')
      expect(result).toContain('custom-class')
    })

    it('SR-30: devrait appliquer un id custom avec IDs cohérents', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, id: 'custom-stats' },
      })

      expect(result).toContain('id="custom-stats"')
      expect(result).toContain('aria-labelledby="custom-stats-title"')
    })
  })

  describe('Cas limites: Contenu', () => {
    it('SR-CL-01: devrait ne pas rendre de <section> quand la liste est vide', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: [] },
      })

      expect(result).not.toContain('<section')
    })

    it('SR-CL-02: devrait rendre 1 stat sans séparateur', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: [mockStats[0]] },
      })

      expect(result).toContain('<section')
      const statValueMatches = result.match(/stat-value/g)
      expect(statValueMatches).toHaveLength(1)
      expect(result).not.toContain('border-t border-gray-200')
    })

    it('SR-CL-03: devrait rendre 2 stats avec 1 séparateur', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats.slice(0, 2) },
      })

      const statValueMatches = result.match(/stat-value/g)
      expect(statValueMatches).toHaveLength(2)

      const dividerMatches = result.match(/border-t border-gray-200/g)
      expect(dividerMatches).toHaveLength(1)
    })

    it('SR-CL-04: devrait rendre 4 stats', async () => {
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

    it('SR-CL-05: devrait rendre 6 stats (limite haute)', async () => {
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

    it('SR-CL-06: devrait respecter l\'ordre des stats', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      const productivityIndex = result.indexOf('productivité')
      const rapideIndex = result.indexOf('rapide')
      const satisfaitsIndex = result.indexOf('satisfaits')

      expect(productivityIndex).toBeLessThan(rapideIndex)
      expect(rapideIndex).toBeLessThan(satisfaitsIndex)
    })
  })

  describe('Accessibilité', () => {
    it('SR-A-01: devrait avoir une seule <section>', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result.match(/<section/g)?.length).toBe(1)
    })

    it('SR-A-02: devrait avoir aria-labelledby cohérent avec <h2> id', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('aria-labelledby="stats-section-title"')
      expect(result).toContain('id="stats-section-title"')
    })

    it('SR-A-03: devrait utiliser un <h2> (pas h1)', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('<h2')
      expect(result).not.toContain('<h1')
    })

    it('SR-A-04: devrait avoir un <cite> pour chaque source', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      const citeMatches = result.match(/<cite/g)
      expect(citeMatches).toHaveLength(3)
    })

    it('SR-A-05: devrait avoir rel="noopener noreferrer" sur chaque lien source', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      const noopenerMatches = result.match(/rel="noopener noreferrer"/g)
      expect(noopenerMatches).toHaveLength(3)
    })

    it('SR-A-06: devrait avoir sr-only "nouvel onglet" sur chaque lien', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      const srOnlyMatches = result.match(/nouvel onglet/g)
      expect(srOnlyMatches).toHaveLength(3)
    })
  })
})
