// tests/unit/components/hero-title.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import HeroTitle from '@components/hero/HeroTitle.astro'

describe('HeroTitle Component', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  const defaultProps = {
    title: 'AIAD : Le framework pour développer avec des agents IA',
    tagline: 'Structurez votre collaboration avec l\'intelligence artificielle',
  }

  describe('Rendu de base', () => {
    it('HT-00: devrait rendre le titre dans un <h1>', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toContain('<h1')
      expect(result).toContain(defaultProps.title)
      expect(result).toContain('</h1>')
    })

    it('HT-00b: devrait rendre la tagline dans un <p>', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toContain('<p')
      expect(result).toContain('Structurez votre collaboration avec l&#39;intelligence artificielle')
      expect(result).toContain('</p>')
    })

    it('HT-01: devrait avoir un seul <h1> dans le composant', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      const h1Count = (result.match(/<h1/g) || []).length
      expect(h1Count).toBe(1)
    })
  })

  describe('Props: align', () => {
    it('HT-02: devrait appliquer text-center par défaut', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toContain('text-center')
    })

    it('HT-03: devrait appliquer text-left quand align="left"', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, align: 'left' },
      })

      expect(result).toContain('text-left')
      expect(result).not.toContain('text-center')
    })

    it('HT-04: devrait appliquer text-right quand align="right"', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, align: 'right' },
      })

      expect(result).toContain('text-right')
    })

    it('HT-05: devrait ajouter mx-auto à la tagline quand align="center"', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, align: 'center' },
      })

      expect(result).toContain('mx-auto')
    })
  })

  describe('Props: size', () => {
    it('HT-06: devrait appliquer size lg par défaut (lg:text-5xl)', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toContain('lg:text-5xl')
    })

    it('HT-07: devrait appliquer text-2xl md:text-3xl quand size="sm"', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, size: 'sm' },
      })

      expect(result).toContain('text-2xl')
      expect(result).toContain('md:text-3xl')
    })

    it('HT-08: devrait appliquer text-3xl md:text-4xl quand size="md"', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, size: 'md' },
      })

      expect(result).toContain('text-3xl')
      expect(result).toContain('md:text-4xl')
    })

    it('HT-09: devrait appliquer le gap correct par taille (sm→gap-2, md→gap-3, lg→gap-4)', async () => {
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
    it('HT-10: devrait masquer la tagline quand showTagline=false', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, showTagline: false },
      })

      expect(result).not.toContain('<p')
    })

    it('HT-11: devrait afficher la tagline par défaut (showTagline=true)', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toContain('<p')
    })
  })

  describe('Props: class', () => {
    it('HT-12: devrait ajouter la classe custom au conteneur', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, class: 'my-custom-class' },
      })

      expect(result).toContain('my-custom-class')
    })

    it('HT-13: devrait préserver les classes par défaut avec une classe custom', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, class: 'my-custom-class' },
      })

      expect(result).toContain('flex')
      expect(result).toContain('my-custom-class')
    })
  })

  describe('Props: id', () => {
    it('HT-14: devrait appliquer l\'id au <h1>', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, id: 'hero-title' },
      })

      expect(result).toContain('id="hero-title"')
    })
  })

  describe('Styling: Classes Tailwind', () => {
    it('HT-15: devrait avoir font-bold sur le titre', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toMatch(/<h1[^>]*class="[^"]*font-bold/)
    })

    it('HT-16: devrait avoir text-gray-900 sur le titre', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toMatch(/<h1[^>]*class="[^"]*text-gray-900/)
    })

    it('HT-17: devrait avoir tracking-tight sur le titre', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toMatch(/<h1[^>]*class="[^"]*tracking-tight/)
    })

    it('HT-18: devrait avoir text-gray-600 sur la tagline', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toMatch(/<p[^>]*class="[^"]*text-gray-600/)
    })
  })

  describe('Cas limites: Contenu', () => {
    it('HT-CL-01: devrait gérer un titre long (80 caractères)', async () => {
      const longTitle = 'AIAD : ' + 'A'.repeat(73)
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, title: longTitle },
      })

      expect(result).toContain(longTitle)
    })

    it('HT-CL-02: devrait gérer un titre court (10 caractères)', async () => {
      const shortTitle = 'AIAD : Dev'
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, title: shortTitle },
      })

      expect(result).toContain(shortTitle)
    })

    it('HT-CL-03: devrait gérer une tagline longue (120 caractères)', async () => {
      const longTagline = 'A'.repeat(120)
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, tagline: longTagline },
      })

      expect(result).toContain(longTagline)
      expect(result).toContain('max-w-2xl')
    })

    it('HT-CL-04: devrait rendre un <p> vide quand tagline vide et showTagline=true', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, tagline: '', showTagline: true },
      })

      expect(result).toContain('<p')
      expect(result).toContain('</p>')
    })

    it('HT-CL-05: devrait gérer les caractères spéciaux dans le titre', async () => {
      const specialTitle = 'AIAD : L\'IA & vous — ensemble'
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, title: specialTitle },
      })

      expect(result).toContain('&#39;')
      expect(result).toContain('&amp;')
    })

    it('HT-CL-06: devrait gérer les emojis dans le titre', async () => {
      const emojiTitle = 'AIAD 🚀 : Le framework IA'
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, title: emojiTitle },
      })

      expect(result).toContain('🚀')
    })

    it('HT-CL-07: devrait échapper l\'injection HTML dans le titre', async () => {
      const xssTitle = 'AIAD <script>alert(\'xss\')</script>'
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, title: xssTitle },
      })

      expect(result).not.toContain('<script>')
      expect(result).toContain('&lt;script&gt;')
    })
  })
})
