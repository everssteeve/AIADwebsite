// tests/unit/components/value-proposition.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import ValueProposition from '@components/hero/ValueProposition.astro'

describe('ValueProposition Component', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  const defaultProps = {
    text: 'Une méthodologie éprouvée pour intégrer les agents IA dans votre workflow de développement et multiplier votre productivité.',
  }

  describe('Rendu de base', () => {
    it('VP-00: devrait rendre le texte dans un <p>', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).toContain('<p')
      expect(result).toContain(defaultProps.text)
      expect(result).toContain('</p>')
    })

    it('VP-01: devrait avoir un seul <p> dans le composant', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      const pCount = (result.match(/<p/g) || []).length
      expect(pCount).toBe(1)
    })

    it('VP-02: devrait ne contenir aucune balise heading', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).not.toMatch(/<h[1-6]/)
    })
  })

  describe('Props: align', () => {
    it('VP-03: devrait appliquer text-center et mx-auto par défaut', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).toContain('text-center')
      expect(result).toContain('mx-auto')
    })

    it('VP-04: devrait appliquer text-left sans mx-auto quand align="left"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, align: 'left' },
      })

      expect(result).toContain('text-left')
      expect(result).not.toContain('mx-auto')
    })

    it('VP-05: devrait appliquer text-right et ml-auto quand align="right"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, align: 'right' },
      })

      expect(result).toContain('text-right')
      expect(result).toContain('ml-auto')
    })
  })

  describe('Props: size', () => {
    it('VP-06: devrait appliquer size md par défaut (text-base md:text-lg)', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).toContain('text-base')
      expect(result).toContain('md:text-lg')
    })

    it('VP-07: devrait appliquer text-sm md:text-base quand size="sm"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, size: 'sm' },
      })

      expect(result).toContain('text-sm')
      expect(result).toContain('md:text-base')
    })

    it('VP-08: devrait appliquer text-lg md:text-xl quand size="lg"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, size: 'lg' },
      })

      expect(result).toContain('text-lg')
      expect(result).toContain('md:text-xl')
    })
  })

  describe('Props: emphasis', () => {
    it('VP-09: devrait appliquer emphasis normal par défaut (text-gray-600 font-normal)', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).toContain('text-gray-600')
      expect(result).toContain('font-normal')
    })

    it('VP-10: devrait appliquer text-gray-500 quand emphasis="subtle"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, emphasis: 'subtle' },
      })

      expect(result).toContain('text-gray-500')
    })

    it('VP-11: devrait appliquer text-gray-700 font-medium quand emphasis="strong"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, emphasis: 'strong' },
      })

      expect(result).toContain('text-gray-700')
      expect(result).toContain('font-medium')
    })
  })

  describe('Props: maxWidth', () => {
    it('VP-12: devrait appliquer max-w-3xl par défaut (maxWidth="lg")', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).toContain('max-w-3xl')
    })

    it('VP-13: devrait appliquer max-w-xl quand maxWidth="sm"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, maxWidth: 'sm' },
      })

      expect(result).toContain('max-w-xl')
    })

    it('VP-14: devrait appliquer max-w-2xl quand maxWidth="md"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, maxWidth: 'md' },
      })

      expect(result).toContain('max-w-2xl')
    })

    it('VP-15: devrait ne pas appliquer de max-width quand maxWidth="full"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, maxWidth: 'full' },
      })

      expect(result).not.toContain('max-w-')
    })
  })

  describe('Props: class', () => {
    it('VP-16: devrait préserver les classes par défaut avec une classe custom', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, class: 'my-custom-class' },
      })

      expect(result).toContain('leading-relaxed')
      expect(result).toContain('my-custom-class')
    })
  })

  describe('Styling: Classes Tailwind', () => {
    it('VP-17: devrait toujours avoir leading-relaxed', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).toMatch(/<p[^>]*class="[^"]*leading-relaxed/)
    })
  })

  describe('Cas limites: Contenu', () => {
    it('VP-CL-01: devrait gérer un texte long (200 caractères)', async () => {
      const longText = 'A'.repeat(195) + ' fin.'
      const result = await container.renderToString(ValueProposition, {
        props: { text: longText },
      })

      expect(result).toContain(longText)
      expect(result).toContain('max-w-3xl')
    })

    it('VP-CL-02: devrait gérer un texte court (20 caractères)', async () => {
      const shortText = 'Productivité accrue.'
      const result = await container.renderToString(ValueProposition, {
        props: { text: shortText },
      })

      expect(result).toContain(shortText)
    })

    it('VP-CL-03: devrait rendre un <p> vide quand le texte est vide', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { text: '' },
      })

      expect(result).toContain('<p')
      expect(result).toContain('</p>')
    })

    it('VP-CL-04: devrait gérer les caractères spéciaux (apostrophe, &)', async () => {
      const specialText = "L'IA & vous — ensemble."
      const result = await container.renderToString(ValueProposition, {
        props: { text: specialText },
      })

      expect(result).toContain('&#39;')
      expect(result).toContain('&amp;')
    })

    it('VP-CL-05: devrait gérer les emojis dans le texte', async () => {
      const emojiText = 'Boostez votre productivité 🚀.'
      const result = await container.renderToString(ValueProposition, {
        props: { text: emojiText },
      })

      expect(result).toContain('🚀')
    })

    it('VP-CL-06: devrait échapper l\'injection HTML', async () => {
      const xssText = "Test <script>alert('xss')</script>."
      const result = await container.renderToString(ValueProposition, {
        props: { text: xssText },
      })

      expect(result).not.toContain('<script>')
      expect(result).toContain('&lt;script&gt;')
    })

    it('VP-CL-07: devrait appliquer tous les défauts quand les props optionnelles sont absentes', async () => {
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
})
