// tests/unit/components/hero-title.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import HeroTitle from '@components/hero/HeroTitle.astro'

describe('HeroTitle Component', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  // Fixture de base
  const defaultProps = {
    title: 'AIAD : Le framework pour développer avec des agents IA',
    tagline: 'Structurez votre collaboration avec l\'intelligence artificielle',
  }

  describe('Rendu de base', () => {
    it('T-00: should render title in h1 tag', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toContain('<h1')
      expect(result).toContain(defaultProps.title)
      expect(result).toContain('</h1>')
    })

    it('T-00b: should render tagline in p tag', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toContain('<p')
      // L'apostrophe est échappée en &#39; par Astro
      expect(result).toContain('Structurez votre collaboration avec l&#39;intelligence artificielle')
      expect(result).toContain('</p>')
    })

    it('should have only one h1 tag', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      const h1Count = (result.match(/<h1/g) || []).length
      expect(h1Count).toBe(1)
    })
  })

  describe('Props: align', () => {
    it('should apply text-center class by default', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toContain('text-center')
    })

    it('should apply text-left class when align="left"', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, align: 'left' },
      })

      expect(result).toContain('text-left')
      expect(result).not.toContain('text-center')
    })

    it('should apply text-right class when align="right"', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, align: 'right' },
      })

      expect(result).toContain('text-right')
    })

    it('should apply mx-auto to tagline only when centered', async () => {
      const resultCentered = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, align: 'center' },
      })

      const resultLeft = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, align: 'left' },
      })

      expect(resultCentered).toContain('mx-auto')
      expect(resultLeft).not.toContain('mx-auto')
    })
  })

  describe('Props: size', () => {
    it('should apply lg size classes by default', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toContain('lg:text-5xl')
      expect(result).toContain('lg:text-2xl')
    })

    it('should apply sm size classes when size="sm"', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, size: 'sm' },
      })

      expect(result).toContain('text-2xl')
      expect(result).toContain('md:text-3xl')
      expect(result).not.toContain('lg:text-5xl')
    })

    it('should apply md size classes when size="md"', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, size: 'md' },
      })

      expect(result).toContain('text-3xl')
      expect(result).toContain('md:text-4xl')
    })

    it('should apply correct gap for each size', async () => {
      const resultSm = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, size: 'sm' },
      })
      const resultMd = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, size: 'md' },
      })
      const resultLg = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, size: 'lg' },
      })

      expect(resultSm).toContain('gap-2')
      expect(resultMd).toContain('gap-3')
      expect(resultLg).toContain('gap-4')
    })
  })

  describe('Props: showTagline', () => {
    it('T-05: should not render tagline when showTagline=false', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, showTagline: false },
      })

      expect(result).not.toContain('<p')
      expect(result).not.toContain(defaultProps.tagline)
    })

    it('should render tagline by default (showTagline=true)', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toContain('<p')
      // L'apostrophe est échappée en &#39; par Astro
      expect(result).toContain('Structurez votre collaboration avec l&#39;intelligence artificielle')
    })
  })

  describe('Props: class', () => {
    it('T-13: should apply custom class to container', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, class: 'my-custom-class' },
      })

      expect(result).toContain('my-custom-class')
    })

    it('should preserve default classes when adding custom class', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, class: 'my-custom-class' },
      })

      expect(result).toContain('flex')
      expect(result).toContain('flex-col')
      expect(result).toContain('my-custom-class')
    })
  })

  describe('Cas limites: Contenu', () => {
    it('T-01: should handle very long title (80 chars)', async () => {
      const longTitle = 'AIAD : ' + 'A'.repeat(73) // 80 chars
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, title: longTitle },
      })

      expect(result).toContain(longTitle)
    })

    it('T-02: should handle short title (10 chars)', async () => {
      const shortTitle = 'AIAD : Dev'
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, title: shortTitle },
      })

      expect(result).toContain(shortTitle)
    })

    it('T-03: should handle very long tagline (120 chars)', async () => {
      const longTagline = 'A'.repeat(120)
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, tagline: longTagline },
      })

      expect(result).toContain(longTagline)
      expect(result).toContain('max-w-2xl')
    })

    it('T-06: should handle special characters in title', async () => {
      const specialTitle = 'AIAD : L\'IA & vous — ensemble'
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, title: specialTitle },
      })

      // Astro échappe automatiquement les caractères HTML
      expect(result).toContain('L&#39;IA')
      expect(result).toContain('&amp;')
    })

    it('T-07: should handle emoji in title', async () => {
      const emojiTitle = 'AIAD 🚀 : Le framework IA'
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, title: emojiTitle },
      })

      expect(result).toContain('🚀')
    })

    it('T-08: should escape HTML injection in title', async () => {
      const xssTitle = 'AIAD <script>alert(\'xss\')</script>'
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, title: xssTitle },
      })

      expect(result).not.toContain('<script>')
      expect(result).toContain('&lt;script&gt;')
    })

    it('T-04: should render empty p tag when tagline is empty but showTagline=true', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, tagline: '', showTagline: true },
      })

      expect(result).toContain('<p')
      expect(result).toContain('</p>')
    })
  })

  describe('Styling: Classes Tailwind', () => {
    it('should have font-bold on title', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      // Vérifier que le h1 a font-bold
      expect(result).toMatch(/<h1[^>]*class="[^"]*font-bold[^"]*"/)
    })

    it('should have text-gray-900 on title', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toMatch(/<h1[^>]*class="[^"]*text-gray-900[^"]*"/)
    })

    it('should have text-gray-600 on tagline', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toMatch(/<p[^>]*class="[^"]*text-gray-600[^"]*"/)
    })

    it('should have tracking-tight on title', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toMatch(/<h1[^>]*class="[^"]*tracking-tight[^"]*"/)
    })
  })
})
