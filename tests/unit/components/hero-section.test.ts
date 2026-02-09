// tests/unit/components/hero-section.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import HeroSection from '@components/hero/HeroSection.astro'
import type { HeroContent, BenefitItem, StatItem } from '@/types'

// ── Mock Content Collections ────────────────────────────────

const mockHeroContent: HeroContent = {
  id: 'hero-main-fr',
  title: 'AIAD : Le framework pour développer avec des agents IA',
  tagline: 'Structurez votre collaboration avec l\'intelligence artificielle',
  valueProposition: 'Une méthodologie éprouvée pour intégrer les agents IA.',
  locale: 'fr',
  isActive: true,
  updatedAt: new Date('2026-02-02'),
}

const mockBenefits: BenefitItem[] = [
  {
    id: 'benefit-1',
    icon: 'trending-up',
    title: 'Productivité décuplée',
    description: 'Automatisez les tâches répétitives.',
    order: 1,
    locale: 'fr',
    isActive: true,
    updatedAt: new Date(),
  },
  {
    id: 'benefit-2',
    icon: 'check-circle',
    title: 'Qualité garantie',
    description: 'Des standards intégrés dès le départ.',
    order: 2,
    locale: 'fr',
    isActive: true,
    updatedAt: new Date(),
  },
  {
    id: 'benefit-3',
    icon: 'users',
    title: 'Collaboration fluide',
    description: 'Travail structuré humains-IA.',
    order: 3,
    locale: 'fr',
    isActive: true,
    updatedAt: new Date(),
  },
]

const mockStats: StatItem[] = [
  {
    id: 'stat-1',
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
    updatedAt: new Date(),
  },
  {
    id: 'stat-2',
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
    updatedAt: new Date(),
  },
  {
    id: 'stat-3',
    value: '>90%',
    numericValue: 90,
    unit: '%',
    label: 'Des développeurs satisfaits de l\'IA',
    source: 'Stack Overflow Developer Survey 2024',
    sourceUrl: 'https://survey.stackoverflow.co/2024/ai',
    order: 3,
    locale: 'fr',
    isActive: true,
    highlight: false,
    updatedAt: new Date(),
  },
]

// ── Tests ────────────────────────────────────────────────────

describe('HeroSection', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  describe('Rendu par défaut', () => {
    it('T-01 : rend une balise <section> avec id "hero"', async () => {
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, benefits: mockBenefits, stats: mockStats },
      })

      expect(result).toContain('<section')
      expect(result).toContain('id="hero"')
    })

    it('T-02 : contient aria-labelledby lié au titre', async () => {
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, benefits: mockBenefits, stats: mockStats },
      })

      expect(result).toContain('aria-labelledby="hero-title"')
      expect(result).toContain('id="hero-title"')
    })

    it('T-03 : rend le HeroTitle avec le titre correct', async () => {
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, benefits: mockBenefits, stats: mockStats },
      })

      expect(result).toContain('AIAD : Le framework pour développer avec des agents IA')
      expect(result).toContain('<h1')
    })

    it('T-04 : rend la tagline', async () => {
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, benefits: mockBenefits, stats: mockStats },
      })

      expect(result).toContain('Structurez votre collaboration')
    })

    it('T-05 : rend la ValueProposition', async () => {
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, benefits: mockBenefits, stats: mockStats },
      })

      expect(result).toContain('Une méthodologie éprouvée')
    })

    it('T-06 : rend le CTAButton avec texte par défaut', async () => {
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, benefits: mockBenefits, stats: mockStats },
      })

      expect(result).toContain('Explorer le Framework')
      expect(result).toContain('href="/framework"')
    })

    it('T-07 : rend la section BenefitsList', async () => {
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, benefits: mockBenefits, stats: mockStats },
      })

      expect(result).toContain('Productivité décuplée')
      expect(result).toContain('Qualité garantie')
      expect(result).toContain('Collaboration fluide')
    })

    it('T-08 : rend la section StatsRow', async () => {
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, benefits: mockBenefits, stats: mockStats },
      })

      expect(result).toContain('50%')
      expect(result).toContain('3x')
      expect(result).toContain('&gt;90%')
    })
  })

  describe('Espacement', () => {
    it('T-09 : applique les classes "default" par défaut', async () => {
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, benefits: mockBenefits, stats: mockStats },
      })

      expect(result).toContain('py-16')
      expect(result).toContain('md:py-24')
    })

    it('T-10 : applique les classes "compact"', async () => {
      const result = await container.renderToString(HeroSection, {
        props: {
          heroContent: mockHeroContent,
          benefits: mockBenefits,
          stats: mockStats,
          spacing: 'compact',
        },
      })

      expect(result).toContain('py-10')
      expect(result).toContain('md:py-14')
    })

    it('T-11 : applique les classes "spacious"', async () => {
      const result = await container.renderToString(HeroSection, {
        props: {
          heroContent: mockHeroContent,
          benefits: mockBenefits,
          stats: mockStats,
          spacing: 'spacious',
        },
      })

      expect(result).toContain('py-20')
      expect(result).toContain('md:py-32')
    })
  })

  describe('Fond', () => {
    it('T-12 : pas de classe de fond avec "none"', async () => {
      const result = await container.renderToString(HeroSection, {
        props: {
          heroContent: mockHeroContent,
          benefits: mockBenefits,
          stats: mockStats,
          background: 'none',
        },
      })

      expect(result).not.toContain('bg-gradient')
      expect(result).not.toContain('bg-gray-50')
    })

    it('T-13 : applique le dégradé avec "gradient"', async () => {
      const result = await container.renderToString(HeroSection, {
        props: {
          heroContent: mockHeroContent,
          benefits: mockBenefits,
          stats: mockStats,
          background: 'gradient',
        },
      })

      expect(result).toContain('bg-gradient-to-b')
      expect(result).toContain('from-white')
      expect(result).toContain('to-gray-50')
    })

    it('T-14 : applique le fond subtil avec "subtle"', async () => {
      const result = await container.renderToString(HeroSection, {
        props: {
          heroContent: mockHeroContent,
          benefits: mockBenefits,
          stats: mockStats,
          background: 'subtle',
        },
      })

      expect(result).toContain('bg-gray-50')
    })
  })

  describe('Visibilité des sections', () => {
    it('T-15 : masque la ValueProposition quand showValueProposition=false', async () => {
      const result = await container.renderToString(HeroSection, {
        props: {
          heroContent: mockHeroContent,
          benefits: mockBenefits,
          stats: mockStats,
          showValueProposition: false,
        },
      })

      expect(result).not.toContain('Une méthodologie éprouvée')
    })

    it('T-16 : masque le CTAButton quand showCTA=false', async () => {
      const result = await container.renderToString(HeroSection, {
        props: {
          heroContent: mockHeroContent,
          benefits: mockBenefits,
          stats: mockStats,
          showCTA: false,
        },
      })

      expect(result).not.toContain('Explorer le Framework')
    })

    it('T-17 : masque BenefitsList quand showBenefits=false', async () => {
      const result = await container.renderToString(HeroSection, {
        props: {
          heroContent: mockHeroContent,
          benefits: mockBenefits,
          stats: mockStats,
          showBenefits: false,
        },
      })

      expect(result).not.toContain('Productivité décuplée')
      expect(result).not.toContain('benefits-section')
    })

    it('T-18 : masque StatsRow quand showStats=false', async () => {
      const result = await container.renderToString(HeroSection, {
        props: {
          heroContent: mockHeroContent,
          benefits: mockBenefits,
          stats: mockStats,
          showStats: false,
        },
      })

      expect(result).not.toContain('50%')
      expect(result).not.toContain('stats-section')
    })

    it('T-19 : HeroTitle toujours visible même si tout est masqué', async () => {
      const result = await container.renderToString(HeroSection, {
        props: {
          heroContent: mockHeroContent,
          showValueProposition: false,
          showCTA: false,
          showBenefits: false,
          showStats: false,
        },
      })

      expect(result).toContain('<h1')
      expect(result).toContain('AIAD')
    })
  })

  describe('Configuration CTA', () => {
    it('T-20 : CTA avec texte personnalisé', async () => {
      const result = await container.renderToString(HeroSection, {
        props: {
          heroContent: mockHeroContent,
          ctaText: 'Découvrir AIAD',
          ctaHref: '/decouvrir',
        },
      })

      expect(result).toContain('Découvrir AIAD')
      expect(result).toContain('href="/decouvrir"')
    })
  })

  describe('Conteneur et layout', () => {
    it('T-21 : applique max-w-7xl par défaut', async () => {
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent },
      })

      expect(result).toContain('max-w-7xl')
    })

    it('T-22 : applique mx-auto quand centered=true', async () => {
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, centered: true },
      })

      expect(result).toContain('mx-auto')
    })

    it('T-23 : n\'applique pas mx-auto quand centered=false', async () => {
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, centered: false },
      })

      expect(result).toContain('w-full')
    })

    it('T-24 : utilise un maxWidth personnalisé', async () => {
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, maxWidth: 'max-w-5xl' },
      })

      expect(result).toContain('max-w-5xl')
    })

    it('T-25 : accepte un id personnalisé', async () => {
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, id: 'custom-hero' },
      })

      expect(result).toContain('id="custom-hero"')
      expect(result).toContain('aria-labelledby="custom-hero-title"')
    })

    it('T-26 : accepte des classes CSS additionnelles', async () => {
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, class: 'border-b' },
      })

      expect(result).toContain('border-b')
    })
  })

  describe('Fallback et données manquantes', () => {
    it('T-27 : rend le titre fallback "AIAD" sans heroContent', async () => {
      const result = await container.renderToString(HeroSection, {
        props: {},
      })

      expect(result).toContain('<h1')
      expect(result).toContain('AIAD')
    })

    it('T-28 : masque la VP si valueProposition est vide', async () => {
      const result = await container.renderToString(HeroSection, {
        props: {
          heroContent: { ...mockHeroContent, valueProposition: '' },
          showBenefits: false,
          showStats: false,
        },
      })

      expect(result).not.toContain('leading-relaxed')
    })

    it('T-29 : masque la tagline si tagline est vide', async () => {
      const result = await container.renderToString(HeroSection, {
        props: {
          heroContent: { ...mockHeroContent, tagline: '' },
        },
      })

      expect(result).toContain('<h1')
    })
  })

  describe('Passthrough sous-composants', () => {
    it('T-30 : transmet titleSize au HeroTitle', async () => {
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, titleSize: 'sm' },
      })

      expect(result).toContain('text-2xl')
    })

    it('T-31 : transmet benefitsCardVariant au BenefitsList', async () => {
      const result = await container.renderToString(HeroSection, {
        props: {
          heroContent: mockHeroContent,
          benefits: mockBenefits,
          benefitsCardVariant: 'compact',
        },
      })

      expect(result).toContain('Productivité décuplée')
    })

    it('T-32 : transmet statsShowSources au StatsRow', async () => {
      const result = await container.renderToString(HeroSection, {
        props: {
          heroContent: mockHeroContent,
          stats: mockStats,
          statsShowSources: false,
        },
      })

      expect(result).not.toContain('McKinsey')
    })
  })
})
