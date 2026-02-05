// tests/unit/components/benefit-card.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import BenefitCard from '@components/hero/BenefitCard.astro'

describe('BenefitCard Component', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  const defaultProps = {
    icon: 'trending-up' as const,
    title: 'Productivité décuplée',
    description: 'Automatisez les tâches répétitives et concentrez-vous sur la valeur ajoutée de votre code.',
  }

  describe('Rendu de base', () => {
    it('BC-00: devrait rendre dans un <article>', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('<article')
    })

    it('BC-00b: devrait rendre le titre dans un <h3>', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('<h3')
      expect(result).toContain('Productivité décuplée')
    })

    it('BC-00c: devrait rendre la description dans un <p>', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('<p')
      expect(result).toContain('Automatisez les tâches')
    })

    it('BC-01: devrait rendre l\'icône en SVG avec text-blue-600', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('<svg')
      expect(result).toContain('text-blue-600')
    })

    it('BC-02: devrait avoir le conteneur d\'icône avec bg-blue-100', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('bg-blue-100')
    })
  })

  describe('Props: variant', () => {
    it('BC-03: devrait appliquer variant default (bg-white p-6)', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, variant: 'default' },
      })

      expect(result).toContain('bg-white')
      expect(result).toContain('p-6')
    })

    it('BC-04: devrait appliquer variant compact (p-4)', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, variant: 'compact' },
      })

      expect(result).toContain('p-4')
    })

    it('BC-05: devrait appliquer variant featured (bg-blue-50 border border-blue-100 rounded-xl)', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, variant: 'featured' },
      })

      expect(result).toContain('bg-blue-50')
      expect(result).toContain('border')
      expect(result).toContain('border-blue-100')
      expect(result).toContain('rounded-xl')
    })
  })

  describe('Props: iconPosition', () => {
    it('BC-06: devrait appliquer iconPosition top par défaut (flex-col items-center text-center)', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('flex-col')
      expect(result).toContain('items-center')
      expect(result).toContain('text-center')
    })

    it('BC-07: devrait appliquer iconPosition left (flex-row items-start text-left)', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, iconPosition: 'left' },
      })

      expect(result).toContain('flex-row')
      expect(result).toContain('items-start')
      expect(result).toContain('text-left')
    })
  })

  describe('Props: iconSize', () => {
    it('BC-08: devrait appliquer iconSize md par défaut (w-10 h-10 md:w-12 md:h-12)', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('w-10')
      expect(result).toContain('h-10')
      expect(result).toContain('md:w-12')
      expect(result).toContain('md:h-12')
    })

    it('BC-09: devrait appliquer iconSize sm (w-8 h-8)', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, iconSize: 'sm' },
      })

      expect(result).toContain('w-8')
      expect(result).toContain('h-8')
    })

    it('BC-10: devrait appliquer iconSize lg (w-14 h-14 md:w-16 md:h-16)', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, iconSize: 'lg' },
      })

      expect(result).toContain('w-14')
      expect(result).toContain('h-14')
      expect(result).toContain('md:w-16')
      expect(result).toContain('md:h-16')
    })
  })

  describe('Props: ariaLabel', () => {
    it('BC-11: devrait ajouter aria-label au conteneur icône quand fourni', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, ariaLabel: 'Icône de productivité' },
      })

      expect(result).toContain('aria-label="Icône de productivité"')
      expect(result).not.toContain('role="presentation"')
    })

    it('BC-12: devrait ajouter role="presentation" quand ariaLabel non fourni', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('role="presentation"')
    })

    it('BC-13: devrait toujours avoir aria-hidden="true" sur le SVG', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('aria-hidden="true"')
    })
  })

  describe('Props: class', () => {
    it('BC-14: devrait appliquer la classe custom', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, class: 'my-custom-class' },
      })

      expect(result).toContain('my-custom-class')
    })
  })

  describe('Props: icon (échantillon représentatif)', () => {
    it('BC-15: devrait rendre un SVG pour 10 icônes différentes', async () => {
      const iconsToTest = [
        'trending-up', 'check-circle', 'users', 'zap', 'target',
        'shield', 'rocket', 'layers', 'code', 'compass',
      ] as const

      for (const icon of iconsToTest) {
        const result = await container.renderToString(BenefitCard, {
          props: { ...defaultProps, icon },
        })

        expect(result).toContain('<svg')
      }
    })
  })

  describe('Styling: Classes Tailwind', () => {
    it('BC-16: devrait avoir font-semibold sur le titre', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('font-semibold')
    })

    it('BC-17: devrait avoir text-gray-900 sur le titre', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('text-gray-900')
    })

    it('BC-18: devrait avoir text-gray-600 leading-relaxed sur la description', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('text-gray-600')
      expect(result).toContain('leading-relaxed')
    })

    it('BC-19: devrait avoir rounded-xl sur le conteneur d\'icône', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('rounded-xl')
    })
  })

  describe('Accessibilité', () => {
    it('BC-20: devrait avoir exactement un <article>', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result.match(/<article/g)?.length).toBe(1)
    })

    it('BC-21: devrait utiliser <h3> uniquement (pas h2 ni h4)', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('<h3')
      expect(result).not.toContain('<h2')
      expect(result).not.toContain('<h4')
    })
  })

  describe('Cas limites: Contenu', () => {
    it('BC-CL-01: devrait gérer un titre long (50 caractères)', async () => {
      const longTitle = 'Productivité exceptionnellement accrue et améliorée'
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, title: longTitle },
      })

      expect(result).toContain(longTitle)
    })

    it('BC-CL-02: devrait gérer un titre court (5 caractères)', async () => {
      const shortTitle = 'Gains'
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, title: shortTitle },
      })

      expect(result).toContain(shortTitle)
    })

    it('BC-CL-03: devrait gérer une description longue (150 caractères)', async () => {
      const longDesc = 'A'.repeat(145) + '.'
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, description: longDesc },
      })

      expect(result).toContain(longDesc)
    })

    it('BC-CL-04: devrait gérer une description courte (20 caractères)', async () => {
      const shortDesc = 'Gagnez du temps vite.'
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, description: shortDesc },
      })

      expect(result).toContain(shortDesc)
    })

    it('BC-CL-05: devrait gérer les caractères spéciaux dans le titre', async () => {
      const specialTitle = 'Qualité & Performance'
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, title: specialTitle },
      })

      expect(result).toContain('&amp;')
    })

    it('BC-CL-06: devrait échapper l\'injection HTML dans la description', async () => {
      const xssDesc = '<script>alert(\'xss\')</script> Une vraie description.'
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, description: xssDesc },
      })

      expect(result).not.toContain('<script>')
      expect(result).toContain('&lt;script&gt;')
    })

    it('BC-CL-07: devrait gérer les emojis dans le titre', async () => {
      const emojiTitle = 'Productivité 🚀'
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, title: emojiTitle },
      })

      expect(result).toContain('🚀')
    })

    it('BC-CL-08: devrait gérer les accents français', async () => {
      const accentTitle = 'Qualité élevée'
      const accentDesc = 'Une description avec des caractères accentués éàùçêô.'
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, title: accentTitle, description: accentDesc },
      })

      expect(result).toContain('éàùçêô')
    })

    it('BC-CL-09: devrait gérer les sauts de ligne dans la description', async () => {
      const newlineDesc = 'Ligne 1\nLigne 2 description valide.'
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, description: newlineDesc },
      })

      expect(result).toContain('Ligne 1')
      expect(result).toContain('Ligne 2')
    })

    it('BC-CL-10: devrait réduire la taille titre/description en variant compact', async () => {
      const resultCompact = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, variant: 'compact' },
      })
      const resultDefault = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, variant: 'default' },
      })

      expect(resultCompact).toContain('text-base')
      expect(resultCompact).toContain('md:text-lg')
      expect(resultDefault).toContain('text-lg')
      expect(resultDefault).toContain('md:text-xl')
    })
  })
})
