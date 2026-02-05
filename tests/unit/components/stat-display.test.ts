// tests/unit/components/stat-display.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import StatDisplay from '@components/hero/StatDisplay.astro'

describe('StatDisplay Component', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  const defaultProps = {
    value: '50%',
    label: 'Gain de productivité avec les agents IA',
    source: 'McKinsey Global Institute, 2024',
  }

  describe('Rendu de base', () => {
    it('SD-00: devrait rendre un <div> avec flex flex-col', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('<div')
      expect(result).toContain('flex')
      expect(result).toContain('flex-col')
      expect(result).toContain('</div>')
    })

    it('SD-00b: devrait rendre la valeur avec la classe stat-value', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('50%')
      expect(result).toContain('stat-value')
    })

    it('SD-00c: devrait rendre le label dans un <p>', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('<p')
      expect(result).toContain('Gain de productivité avec les agents IA')
    })

    it('SD-00d: devrait rendre la source dans un <cite>', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('<cite')
      expect(result).toContain('McKinsey Global Institute, 2024')
      expect(result).toContain('</cite>')
    })
  })

  describe('Props: variant', () => {
    it('SD-01: devrait appliquer variant default (bg-transparent p-4 text-3xl text-blue-600)', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, variant: 'default' },
      })

      expect(result).toContain('bg-transparent')
      expect(result).toContain('p-4')
      expect(result).toContain('text-3xl')
      expect(result).toContain('text-blue-600')
    })

    it('SD-02: devrait appliquer variant highlight (bg-blue-50 border rounded-xl text-4xl text-blue-700)', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, variant: 'highlight' },
      })

      expect(result).toContain('bg-blue-50')
      expect(result).toContain('border')
      expect(result).toContain('border-blue-100')
      expect(result).toContain('rounded-xl')
      expect(result).toContain('text-4xl')
      expect(result).toContain('text-blue-700')
    })

    it('SD-03: devrait appliquer variant compact (bg-transparent p-2 text-2xl)', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, variant: 'compact' },
      })

      expect(result).toContain('bg-transparent')
      expect(result).toContain('p-2')
      expect(result).toContain('text-2xl')
    })
  })

  describe('Props: alignment', () => {
    it('SD-04: devrait appliquer alignment center par défaut (text-center items-center)', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('text-center')
      expect(result).toContain('items-center')
    })

    it('SD-05: devrait appliquer alignment left (text-left items-start)', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, alignment: 'left' },
      })

      expect(result).toContain('text-left')
      expect(result).toContain('items-start')
    })
  })

  describe('Props: showSource', () => {
    it('SD-06: devrait afficher la source par défaut (showSource=true)', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('McKinsey Global Institute')
      expect(result).toContain('<cite')
    })

    it('SD-07: devrait masquer la source quand showSource=false', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, showSource: false },
      })

      expect(result).not.toContain('McKinsey Global Institute')
      expect(result).not.toContain('<cite')
      expect(result).not.toContain('<footer')
    })
  })

  describe('Props: sourceUrl et linkSource', () => {
    it('SD-08: devrait rendre la source en lien quand sourceUrl est fourni', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: {
          ...defaultProps,
          sourceUrl: 'https://example.com/study',
        },
      })

      expect(result).toContain('<a')
      expect(result).toContain('href="https://example.com/study"')
      expect(result).toContain('target="_blank"')
      expect(result).toContain('rel="noopener noreferrer"')
    })

    it('SD-09: devrait rendre la source en texte quand sourceUrl est absent', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).not.toContain('<a')
      expect(result).toContain('<cite')
    })

    it('SD-10: devrait rendre la source en texte quand linkSource=false', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: {
          ...defaultProps,
          sourceUrl: 'https://example.com/study',
          linkSource: false,
        },
      })

      expect(result).not.toContain('<a')
      expect(result).toContain('<cite')
    })
  })

  describe('Props: unit', () => {
    it('SD-11: devrait afficher l\'unité séparément quand unit est fourni (text-[0.6em])', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, value: '50', unit: '%' },
      })

      expect(result).toContain('50')
      expect(result).toContain('%')
      expect(result).toContain('text-[0.6em]')
    })

    it('SD-12: devrait ne pas afficher de span unité quand unit est absent', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('50%')
      expect(result).not.toContain('text-[0.6em]')
    })
  })

  describe('Props: class', () => {
    it('SD-13: devrait appliquer une classe custom et préserver les défauts', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, class: 'my-custom-class' },
      })

      expect(result).toContain('my-custom-class')
      expect(result).toContain('flex')
      expect(result).toContain('flex-col')
    })
  })

  describe('Styling: Classes Tailwind', () => {
    it('SD-14: devrait avoir font-bold sur la valeur', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('font-bold')
    })

    it('SD-15: devrait avoir leading-none sur la valeur', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('leading-none')
    })

    it('SD-16: devrait avoir text-gray-700 sur le label', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('text-gray-700')
    })

    it('SD-17: devrait avoir max-w-xs sur le label', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('max-w-xs')
    })

    it('SD-18: devrait avoir text-gray-500 sur la source non-lien', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('text-gray-500')
    })

    it('SD-19: devrait avoir text-blue-500 sur la source lien', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, sourceUrl: 'https://example.com' },
      })

      expect(result).toContain('text-blue-500')
    })

    it('SD-20: devrait avoir not-italic sur <cite>', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('not-italic')
    })
  })

  describe('Accessibilité', () => {
    it('SD-A-01: devrait avoir sr-only "nouvel onglet" sur les liens externes', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, sourceUrl: 'https://example.com' },
      })

      expect(result).toContain('sr-only')
      expect(result).toContain('nouvel onglet')
    })

    it('SD-A-02: devrait avoir focus:ring-2 sur les liens sources', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, sourceUrl: 'https://example.com' },
      })

      expect(result).toContain('focus:ring-2')
      expect(result).toContain('focus:ring-blue-500')
    })

    it('SD-A-03: devrait avoir rel="noopener noreferrer" sur les liens', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, sourceUrl: 'https://example.com' },
      })

      expect(result).toContain('rel="noopener noreferrer"')
    })
  })

  describe('Cas limites: Contenu', () => {
    it('SD-CL-01: devrait gérer une valeur longue (20 caractères)', async () => {
      const longValue = '12345678901234567890'
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, value: longValue },
      })

      expect(result).toContain(longValue)
    })

    it('SD-CL-02: devrait gérer une valeur minimale (1 caractère)', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, value: '5' },
      })

      expect(result).toContain('>5<')
    })

    it('SD-CL-03: devrait gérer un label long (100 caractères)', async () => {
      const longLabel = 'A'.repeat(100)
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, label: longLabel },
      })

      expect(result).toContain(longLabel)
      expect(result).toContain('max-w-xs')
    })

    it('SD-CL-04: devrait gérer un label minimal (10 caractères)', async () => {
      const shortLabel = 'Gain temps'
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, label: shortLabel },
      })

      expect(result).toContain(shortLabel)
    })

    it('SD-CL-05: devrait gérer une source longue (150 caractères)', async () => {
      const longSource = 'S'.repeat(150)
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, source: longSource },
      })

      expect(result).toContain(longSource)
    })

    it('SD-CL-06: devrait gérer une source minimale (5 caractères)', async () => {
      const shortSource = 'AIAD!'
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, source: shortSource },
      })

      expect(result).toContain(shortSource)
    })

    it('SD-CL-07: devrait gérer une valeur avec symboles (>90%)', async () => {
      const specialValue = '>90%'
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, value: specialValue },
      })

      expect(result).toContain('90')
      expect(result).toContain('%')
    })

    it('SD-CL-08: devrait échapper l\'injection HTML dans le label', async () => {
      const xssLabel = "<script>alert('xss')</script> Une vraie description."
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, label: xssLabel },
      })

      expect(result).not.toContain('<script>')
      expect(result).toContain('&lt;script&gt;')
    })

    it('SD-CL-09: devrait gérer les accents français dans le label', async () => {
      const accentLabel = 'Économie réalisée significative'
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, label: accentLabel },
      })

      expect(result).toContain('Économie réalisée significative')
    })

    it('SD-CL-10: devrait gérer l\'ampersand dans la source', async () => {
      const ampSource = 'McKinsey & Company, 2024'
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, source: ampSource },
      })

      expect(result).toContain('McKinsey')
      expect(result).toContain('Company')
    })

    it('SD-CL-11: devrait gérer une valeur sans chiffre (+++)', async () => {
      const symbolValue = '+++'
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, value: symbolValue },
      })

      expect(result).toContain('+++')
    })
  })

  describe('Variantes combinées', () => {
    it('SD-CO-01: devrait combiner variant highlight avec alignment left', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, variant: 'highlight', alignment: 'left' },
      })

      expect(result).toContain('bg-blue-50')
      expect(result).toContain('text-left')
      expect(result).toContain('items-start')
    })

    it('SD-CO-02: devrait combiner variant compact avec sourceUrl', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: {
          ...defaultProps,
          variant: 'compact',
          sourceUrl: 'https://example.com',
        },
      })

      expect(result).toContain('p-2')
      expect(result).toContain('text-2xl')
      expect(result).toContain('<a')
    })

    it('SD-CO-03: devrait combiner unit avec variant highlight', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: {
          ...defaultProps,
          value: '50',
          unit: '%',
          variant: 'highlight',
        },
      })

      expect(result).toContain('text-[0.6em]')
      expect(result).toContain('text-blue-700')
      expect(result).toContain('bg-blue-50')
    })
  })
})
