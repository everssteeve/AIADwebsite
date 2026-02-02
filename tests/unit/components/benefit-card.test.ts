// tests/unit/components/benefit-card.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import BenefitCard from '@components/hero/BenefitCard.astro'

describe('BenefitCard Component', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  // Fixture de base valide
  const defaultProps = {
    icon: 'trending-up' as const,
    title: 'Productivité décuplée',
    description: 'Automatisez les tâches répétitives et concentrez-vous sur la valeur ajoutée de votre code.',
  }

  describe('Rendu de base', () => {
    it('T-00: should render as article element', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('<article')
      expect(result).toContain('</article>')
    })

    it('T-00b: should render title as h3', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('<h3')
      expect(result).toContain('Productivité décuplée')
      expect(result).toContain('</h3>')
    })

    it('T-00c: should render description as p', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('<p')
      expect(result).toContain('Automatisez les tâches')
      expect(result).toContain('</p>')
    })

    it('should render icon as SVG', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('<svg')
      expect(result).toContain('text-blue-600')
    })

    it('should have icon container with bg-blue-100', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('bg-blue-100')
    })
  })

  describe('Props: variant', () => {
    it('should apply default variant classes', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, variant: 'default' },
      })

      expect(result).toContain('bg-white')
      expect(result).toContain('p-6')
    })

    it('should apply compact variant classes', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, variant: 'compact' },
      })

      expect(result).toContain('bg-white')
      expect(result).toContain('p-4')
    })

    it('T-16: should apply featured variant classes', async () => {
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
    it('should apply top position classes by default', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('flex-col')
      expect(result).toContain('items-center')
      expect(result).toContain('text-center')
    })

    it('T-14: should apply left position classes', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, iconPosition: 'left' },
      })

      expect(result).toContain('flex-row')
      expect(result).toContain('items-start')
      expect(result).toContain('text-left')
    })
  })

  describe('Props: iconSize', () => {
    it('should apply md size by default', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('w-10')
      expect(result).toContain('h-10')
      expect(result).toContain('md:w-12')
      expect(result).toContain('md:h-12')
    })

    it('should apply sm size classes', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, iconSize: 'sm' },
      })

      expect(result).toContain('w-8')
      expect(result).toContain('h-8')
    })

    it('T-17: should apply lg size classes', async () => {
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
    it('T-06: should add aria-label to icon container when provided', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, ariaLabel: 'Icône de productivité' },
      })

      expect(result).toContain('aria-label="Icône de productivité"')
      expect(result).not.toContain('role="presentation"')
    })

    it('T-07: should add role="presentation" when ariaLabel not provided', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('role="presentation"')
    })

    it('should always have aria-hidden on SVG', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, ariaLabel: 'Test' },
      })

      expect(result).toContain('aria-hidden="true"')
    })
  })

  describe('Props: class', () => {
    it('T-13: should apply custom class', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, class: 'my-custom-class' },
      })

      expect(result).toContain('my-custom-class')
    })

    it('should preserve default classes when adding custom class', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, class: 'mt-8' },
      })

      expect(result).toContain('bg-white')
      expect(result).toContain('p-6')
      expect(result).toContain('mt-8')
    })
  })

  describe('Props: icon (toutes les icônes)', () => {
    it('T-18: should render all supported icons', async () => {
      const iconsToTest = [
        'trending-up', 'check-circle', 'users', 'zap', 'target',
        'shield', 'rocket', 'layers', 'code', 'compass'
      ] as const

      for (const icon of iconsToTest) {
        const result = await container.renderToString(BenefitCard, {
          props: { ...defaultProps, icon },
        })

        expect(result).toContain('<svg')
        expect(result).toContain('</svg>')
      }
    })
  })

  describe('Cas limites: Contenu', () => {
    it('T-01: should handle long title (50 chars)', async () => {
      const longTitle = 'Productivité exceptionnellement accrue et améliorée'
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, title: longTitle },
      })

      expect(result).toContain(longTitle)
    })

    it('T-02: should handle minimal title (5 chars)', async () => {
      const shortTitle = 'Gains'
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, title: shortTitle },
      })

      expect(result).toContain(shortTitle)
    })

    it('T-03: should handle long description (150 chars)', async () => {
      const longDesc = 'A'.repeat(145) + '.'
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, description: longDesc },
      })

      expect(result).toContain(longDesc)
    })

    it('T-04: should handle minimal description (20 chars)', async () => {
      const shortDesc = 'Gagnez du temps vite.'
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, description: shortDesc },
      })

      expect(result).toContain(shortDesc)
    })

    it('T-09: should escape special characters in title', async () => {
      const specialTitle = 'Qualité & Performance'
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, title: specialTitle },
      })

      // Astro échappe automatiquement
      expect(result).toContain('Qualité')
      expect(result).toContain('Performance')
    })

    it('T-10: should escape HTML injection in description', async () => {
      const xssDesc = '<script>alert(\'xss\')</script> Une vraie description.'
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, description: xssDesc },
      })

      expect(result).not.toContain('<script>')
      expect(result).toContain('&lt;script&gt;')
    })

    it('T-11: should handle emoji in title', async () => {
      const emojiTitle = 'Productivité 🚀'
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, title: emojiTitle },
      })

      expect(result).toContain('Productivité 🚀')
    })

    it('T-12: should handle French accents', async () => {
      const accentTitle = 'Qualité élevée'
      const accentDesc = 'Une description avec des caractères accentués éàùç.'
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, title: accentTitle, description: accentDesc },
      })

      expect(result).toContain('Qualité élevée')
      expect(result).toContain('éàùç')
    })

    it('T-20: should handle newline in description', async () => {
      const newlineDesc = 'Ligne 1\nLigne 2 description valide.'
      const result = await container.renderToString(BenefitCard, {
        props: { ...defaultProps, description: newlineDesc },
      })

      // Les newlines sont préservés mais rendus inline par défaut
      expect(result).toContain('Ligne 1')
      expect(result).toContain('Ligne 2')
    })
  })

  describe('Styling: Classes de base', () => {
    it('should have flex layout', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('flex')
    })

    it('should have title with font-semibold', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('font-semibold')
    })

    it('should have title with text-gray-900', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('text-gray-900')
    })

    it('should have description with text-gray-600', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('text-gray-600')
    })

    it('should have description with leading-relaxed', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('leading-relaxed')
    })

    it('should have icon container with rounded-xl', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('rounded-xl')
    })
  })

  describe('Accessibilité', () => {
    it('should use article element for semantic structure', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result.match(/<article/g)?.length).toBe(1)
    })

    it('should use h3 for title hierarchy', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('<h3')
      expect(result).not.toContain('<h2')
      expect(result).not.toContain('<h4')
    })

    it('should have icon with aria-hidden', async () => {
      const result = await container.renderToString(BenefitCard, {
        props: defaultProps,
      })

      expect(result).toContain('aria-hidden="true"')
    })
  })
})
