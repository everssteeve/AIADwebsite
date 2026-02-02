// tests/unit/components/value-proposition.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import ValueProposition from '@components/hero/ValueProposition.astro'

describe('ValueProposition Component', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  // Fixture de base
  const defaultProps = {
    text: 'Une méthodologie éprouvée pour intégrer les agents IA dans votre workflow de développement et multiplier votre productivité.',
  }

  describe('Rendu de base', () => {
    it('T-00: should render text in p tag', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).toContain('<p')
      expect(result).toContain(defaultProps.text)
      expect(result).toContain('</p>')
    })

    it('should have only one p tag', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      const pCount = (result.match(/<p/g) || []).length
      expect(pCount).toBe(1)
    })

    it('should not contain any heading tags', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).not.toMatch(/<h[1-6]/)
    })
  })

  describe('Props: align', () => {
    it('should apply text-center and mx-auto by default', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).toContain('text-center')
      expect(result).toContain('mx-auto')
    })

    it('T-17: should apply text-left without mx-auto when align="left"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, align: 'left' },
      })

      expect(result).toContain('text-left')
      expect(result).not.toContain('mx-auto')
    })

    it('should apply text-right and ml-auto when align="right"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, align: 'right' },
      })

      expect(result).toContain('text-right')
      expect(result).toContain('ml-auto')
    })
  })

  describe('Props: size', () => {
    it('should apply md size classes by default', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).toContain('text-base')
      expect(result).toContain('md:text-lg')
    })

    it('should apply sm size classes when size="sm"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, size: 'sm' },
      })

      expect(result).toContain('text-sm')
      expect(result).toContain('md:text-base')
    })

    it('should apply lg size classes when size="lg"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, size: 'lg' },
      })

      expect(result).toContain('text-lg')
      expect(result).toContain('md:text-xl')
    })
  })

  describe('Props: emphasis', () => {
    it('should apply normal emphasis by default', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).toContain('text-gray-600')
      expect(result).toContain('font-normal')
    })

    it('should apply subtle emphasis classes', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, emphasis: 'subtle' },
      })

      expect(result).toContain('text-gray-500')
      expect(result).toContain('font-normal')
    })

    it('should apply strong emphasis classes', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, emphasis: 'strong' },
      })

      expect(result).toContain('text-gray-700')
      expect(result).toContain('font-medium')
    })
  })

  describe('Props: maxWidth', () => {
    it('should apply max-w-3xl by default (lg)', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).toContain('max-w-3xl')
    })

    it('should apply max-w-xl when maxWidth="sm"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, maxWidth: 'sm' },
      })

      expect(result).toContain('max-w-xl')
    })

    it('should apply max-w-2xl when maxWidth="md"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, maxWidth: 'md' },
      })

      expect(result).toContain('max-w-2xl')
    })

    it('should not apply max-width class when maxWidth="full"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, maxWidth: 'full' },
      })

      expect(result).not.toContain('max-w-')
    })
  })

  describe('Props: class', () => {
    it('T-13: should apply custom class', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, class: 'my-custom-class' },
      })

      expect(result).toContain('my-custom-class')
    })

    it('should preserve default classes when adding custom class', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, class: 'mt-8' },
      })

      expect(result).toContain('leading-relaxed')
      expect(result).toContain('mt-8')
    })
  })

  describe('Cas limites: Contenu', () => {
    it('T-01: should handle very long text (200 chars)', async () => {
      const longText = 'A'.repeat(195) + ' fin.'
      const result = await container.renderToString(ValueProposition, {
        props: { text: longText },
      })

      expect(result).toContain(longText)
      expect(result).toContain('max-w-3xl')
    })

    it('T-02: should handle short text (20 chars)', async () => {
      const shortText = 'Productivité accrue.'
      const result = await container.renderToString(ValueProposition, {
        props: { text: shortText },
      })

      expect(result).toContain(shortText)
    })

    it('T-04: should handle special characters', async () => {
      const specialText = "L'IA & vous — ensemble."
      const result = await container.renderToString(ValueProposition, {
        props: { text: specialText },
      })

      // Astro échappe automatiquement les caractères HTML
      expect(result).toContain('L&#39;IA')
      expect(result).toContain('&amp;')
    })

    it('T-05: should handle emoji', async () => {
      const emojiText = 'Boostez votre productivité 🚀.'
      const result = await container.renderToString(ValueProposition, {
        props: { text: emojiText },
      })

      expect(result).toContain('🚀')
    })

    it('T-06: should escape HTML injection', async () => {
      const xssText = "Test <script>alert('xss')</script>."
      const result = await container.renderToString(ValueProposition, {
        props: { text: xssText },
      })

      expect(result).not.toContain('<script>')
      expect(result).toContain('&lt;script&gt;')
    })

    it('T-07: should render empty p tag when text is empty', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { text: '' },
      })

      expect(result).toContain('<p')
      expect(result).toContain('</p>')
    })

    it('T-08: should apply all default values when optional props missing', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).toContain('text-center')
      expect(result).toContain('mx-auto')
      expect(result).toContain('text-base')
      expect(result).toContain('md:text-lg')
      expect(result).toContain('text-gray-600')
      expect(result).toContain('font-normal')
      expect(result).toContain('max-w-3xl')
    })
  })

  describe('Styling: Classes Tailwind', () => {
    it('should always have leading-relaxed for readability', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).toMatch(/<p[^>]*class="[^"]*leading-relaxed[^"]*"/)
    })

    it('should apply all classes to the p element', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: {
          ...defaultProps,
          align: 'center',
          size: 'md',
          emphasis: 'normal',
          maxWidth: 'lg',
          class: 'custom',
        },
      })

      // Vérifier que toutes les classes sont sur le <p>
      expect(result).toMatch(/<p[^>]*class="[^"]*leading-relaxed[^"]*"/)
      expect(result).toMatch(/<p[^>]*class="[^"]*text-center[^"]*"/)
      expect(result).toMatch(/<p[^>]*class="[^"]*custom[^"]*"/)
    })
  })
})
