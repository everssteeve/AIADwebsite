// tests/unit/components/stat-display.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import StatDisplay from '@components/hero/StatDisplay.astro'

describe('StatDisplay Component', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  // Fixture de base valide
  const defaultProps = {
    value: '50%',
    label: 'Gain de productivité avec les agents IA',
    source: 'McKinsey Global Institute, 2024',
  }

  describe('Rendu de base', () => {
    it('T-00: should render as div element', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('<div')
      expect(result).toContain('</div>')
    })

    it('T-00b: should render value', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('50%')
      expect(result).toContain('stat-value')
    })

    it('T-00c: should render label in p tag', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('<p')
      expect(result).toContain('Gain de productivité avec les agents IA')
    })

    it('T-00d: should render source in cite tag', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('<cite')
      expect(result).toContain('McKinsey Global Institute, 2024')
      expect(result).toContain('</cite>')
    })

    it('should have flex column layout', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('flex')
      expect(result).toContain('flex-col')
    })
  })

  describe('Props: variant', () => {
    it('should apply default variant classes', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, variant: 'default' },
      })

      expect(result).toContain('bg-transparent')
      expect(result).toContain('p-4')
    })

    it('T-17: should apply highlight variant classes', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, variant: 'highlight' },
      })

      expect(result).toContain('bg-blue-50')
      expect(result).toContain('border')
      expect(result).toContain('border-blue-100')
      expect(result).toContain('rounded-xl')
      expect(result).toContain('text-blue-700')
    })

    it('T-18: should apply compact variant classes', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, variant: 'compact' },
      })

      expect(result).toContain('bg-transparent')
      expect(result).toContain('p-2')
      expect(result).toContain('text-2xl')
    })
  })

  describe('Props: alignment', () => {
    it('should apply center alignment by default', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('text-center')
      expect(result).toContain('items-center')
    })

    it('T-19: should apply left alignment classes', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, alignment: 'left' },
      })

      expect(result).toContain('text-left')
      expect(result).toContain('items-start')
    })
  })

  describe('Props: showSource', () => {
    it('should show source by default', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('McKinsey Global Institute')
      expect(result).toContain('<cite')
    })

    it('T-09: should hide source when showSource=false', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, showSource: false },
      })

      expect(result).not.toContain('McKinsey Global Institute')
      expect(result).not.toContain('<cite')
      expect(result).not.toContain('<footer')
    })
  })

  describe('Props: sourceUrl et linkSource', () => {
    it('T-07: should render source as link when sourceUrl provided', async () => {
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

    it('T-08: should render source as text when sourceUrl not provided', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).not.toContain('<a')
      expect(result).toContain('<cite')
    })

    it('T-10: should render source as text when linkSource=false', async () => {
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

    it('should have sr-only text for external link', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: {
          ...defaultProps,
          sourceUrl: 'https://example.com/study',
        },
      })

      expect(result).toContain('sr-only')
      expect(result).toContain('nouvel onglet')
    })
  })

  describe('Props: unit', () => {
    it('T-20: should render unit separately when provided', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, value: '50', unit: '%' },
      })

      expect(result).toContain('50')
      expect(result).toContain('%')
      expect(result).toContain('text-[0.6em]')
    })

    it('should not render unit span when not provided', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      // Le % fait partie de la value, pas dans un span séparé
      expect(result).toContain('50%')
      expect(result).not.toContain('text-[0.6em]')
    })
  })

  describe('Props: class', () => {
    it('T-15: should apply custom class', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, class: 'my-custom-class' },
      })

      expect(result).toContain('my-custom-class')
    })

    it('should preserve default classes when adding custom class', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, class: 'mt-8' },
      })

      expect(result).toContain('flex')
      expect(result).toContain('flex-col')
      expect(result).toContain('mt-8')
    })
  })

  describe('Cas limites: Contenu', () => {
    it('T-01: should handle long value (20 chars)', async () => {
      const longValue = '12345678901234567890'
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, value: longValue },
      })

      expect(result).toContain(longValue)
    })

    it('T-02: should handle minimal value (1 char)', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, value: '5' },
      })

      expect(result).toContain('>5<')
    })

    it('T-03: should handle long label (100 chars)', async () => {
      const longLabel = 'A'.repeat(100)
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, label: longLabel },
      })

      expect(result).toContain(longLabel)
      expect(result).toContain('max-w-xs')
    })

    it('T-04: should handle minimal label (10 chars)', async () => {
      const shortLabel = 'Gain temps'
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, label: shortLabel },
      })

      expect(result).toContain(shortLabel)
    })

    it('T-05: should handle long source (150 chars)', async () => {
      const longSource = 'S'.repeat(150)
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, source: longSource },
      })

      expect(result).toContain(longSource)
    })

    it('T-06: should handle minimal source (5 chars)', async () => {
      const shortSource = 'AIAD!'
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, source: shortSource },
      })

      expect(result).toContain(shortSource)
    })

    it('T-12: should handle special characters in value', async () => {
      const specialValue = '>90%'
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, value: specialValue },
      })

      // Vérifie que la valeur est présente (peut être échappée)
      expect(result).toContain('90')
      expect(result).toContain('%')
    })

    it('T-13: should escape HTML injection in label', async () => {
      const xssLabel = "<script>alert('xss')</script> Une vraie description."
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, label: xssLabel },
      })

      expect(result).not.toContain('<script>')
      expect(result).toContain('&lt;script&gt;')
    })

    it('T-14: should handle French accents', async () => {
      const accentLabel = 'Économie réalisée significative'
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, label: accentLabel },
      })

      expect(result).toContain('Économie réalisée significative')
    })

    it('T-22: should handle ampersand in source', async () => {
      const ampSource = 'McKinsey & Company, 2024'
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, source: ampSource },
      })

      expect(result).toContain('McKinsey')
      expect(result).toContain('Company')
    })

    it('T-21: should handle value with symbols only', async () => {
      const symbolValue = '+++'
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, value: symbolValue },
      })

      expect(result).toContain('+++')
    })
  })

  describe('Styling: Classes de base', () => {
    it('should have bold value', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('font-bold')
    })

    it('should have blue-600 value color for default variant', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('text-blue-600')
    })

    it('should have gray-700 label color', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('text-gray-700')
    })

    it('should have gray-500 source color when not a link', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('text-gray-500')
    })

    it('should have blue-500 source color when a link', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, sourceUrl: 'https://example.com' },
      })

      expect(result).toContain('text-blue-500')
    })

    it('should have responsive text sizes', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('text-3xl')
      expect(result).toContain('md:text-4xl')
    })

    it('should have leading-none on value', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('leading-none')
    })

    it('should have max-w-xs on label', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('max-w-xs')
    })
  })

  describe('Accessibilité', () => {
    it('should use cite element for source', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('<cite')
      expect(result).toContain('not-italic')
    })

    it('should have focus styles on source link', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, sourceUrl: 'https://example.com' },
      })

      expect(result).toContain('focus:ring-2')
      expect(result).toContain('focus:ring-blue-500')
    })

    it('should have hover styles on source link', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, sourceUrl: 'https://example.com' },
      })

      expect(result).toContain('hover:text-blue-600')
      expect(result).toContain('hover:underline')
    })

    it('should have noopener noreferrer on external link', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, sourceUrl: 'https://example.com' },
      })

      expect(result).toContain('rel="noopener noreferrer"')
    })
  })

  describe('Variantes combinées', () => {
    it('should combine highlight variant with left alignment', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, variant: 'highlight', alignment: 'left' },
      })

      expect(result).toContain('bg-blue-50')
      expect(result).toContain('text-left')
      expect(result).toContain('items-start')
    })

    it('should combine compact variant with sourceUrl', async () => {
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

    it('should combine unit with highlight variant', async () => {
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
