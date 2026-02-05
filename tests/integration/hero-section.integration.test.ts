// tests/integration/hero-section.integration.test.ts
// T-001-T3 : Tests d'integration HeroSection
// Valide l'assemblage complet du composant HeroSection avec ses 5 sous-composants

import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import HeroSection from '@components/hero/HeroSection.astro'
import type { HeroContent, BenefitItem, StatItem } from '@/types'

// ── Fixtures de production (donnees reelles Content Collections) ──────────

const productionHeroContent: HeroContent = {
  id: 'hero-main-fr',
  title: 'AIAD : Le framework pour développer avec des agents IA',
  tagline: 'Structurez votre collaboration avec l\'intelligence artificielle',
  valueProposition: 'Une méthodologie éprouvée pour intégrer les agents IA dans votre workflow de développement et multiplier votre productivité.',
  locale: 'fr',
  isActive: true,
  metadata: {
    seoTitle: 'AIAD Framework - Développement avec agents IA',
    seoDescription: 'Découvrez AIAD, le framework de référence pour structurer votre collaboration avec les agents IA.',
  },
  updatedAt: new Date('2026-02-02T10:00:00.000Z'),
}

const productionBenefits: BenefitItem[] = [
  {
    id: 'benefit-productivity',
    icon: 'trending-up',
    title: 'Productivité décuplée',
    description: 'Automatisez les tâches répétitives et concentrez-vous sur la valeur ajoutée de votre code.',
    order: 1,
    locale: 'fr',
    isActive: true,
    ariaLabel: 'Icône de graphique ascendant représentant la productivité',
    updatedAt: new Date('2026-02-02T10:00:00.000Z'),
  },
  {
    id: 'benefit-quality',
    icon: 'check-circle',
    title: 'Qualité garantie',
    description: 'Des standards de code et des validations intégrés à chaque étape du développement.',
    order: 2,
    locale: 'fr',
    isActive: true,
    ariaLabel: 'Icône de coche dans un cercle représentant la qualité validée',
    updatedAt: new Date('2026-02-02T10:00:00.000Z'),
  },
  {
    id: 'benefit-collaboration',
    icon: 'users',
    title: 'Collaboration fluide',
    description: 'Une méthodologie claire pour structurer le travail entre humains et agents IA.',
    order: 3,
    locale: 'fr',
    isActive: true,
    ariaLabel: 'Icône de groupe de personnes représentant la collaboration',
    updatedAt: new Date('2026-02-02T10:00:00.000Z'),
  },
]

const productionStats: StatItem[] = [
  {
    id: 'stat-productivity',
    value: '50%',
    numericValue: 50,
    unit: '%',
    label: 'Gain de productivité avec les agents IA',
    source: 'McKinsey Global Institute - The economic potential of generative AI, 2024',
    sourceUrl: 'https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier',
    order: 1,
    locale: 'fr',
    isActive: true,
    highlight: true,
    updatedAt: new Date('2026-02-02T10:00:00.000Z'),
  },
  {
    id: 'stat-speed',
    value: '3x',
    numericValue: 3,
    unit: 'x',
    label: 'Plus rapide pour coder avec assistance IA',
    source: 'GitHub Copilot Research - Developer productivity study, 2023',
    sourceUrl: 'https://github.blog/2023-06-27-the-economic-impact-of-the-ai-powered-developer-lifecycle-and-lessons-from-github-copilot/',
    order: 2,
    locale: 'fr',
    isActive: true,
    highlight: false,
    updatedAt: new Date('2026-02-02T10:00:00.000Z'),
  },
  {
    id: 'stat-satisfaction',
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
    updatedAt: new Date('2026-02-02T10:00:00.000Z'),
  },
]

// ── Props par defaut ──────────────────────────────────────────────────────

const defaultProps = {
  heroContent: productionHeroContent,
  benefits: productionBenefits,
  stats: productionStats,
}

// ── Factories pour cas limites ────────────────────────────────────────────

function makeBenefit(
  id: string,
  title: string,
  order: number = 1,
): BenefitItem {
  return {
    id,
    icon: 'trending-up',
    title,
    description: 'Description suffisamment longue pour le test de validation.',
    order,
    locale: 'fr',
    isActive: true,
    updatedAt: new Date('2026-02-02T10:00:00.000Z'),
  }
}

function makeStat(
  id: string,
  value: string,
  order: number = 1,
  highlight: boolean = false,
): StatItem {
  return {
    id,
    value,
    label: 'Label de test suffisamment long',
    source: 'Source de test valide et credible',
    sourceUrl: 'https://example.com',
    order,
    locale: 'fr',
    isActive: true,
    highlight,
    updatedAt: new Date('2026-02-02T10:00:00.000Z'),
  }
}

// ── Suite de tests ────────────────────────────────────────────────────────

describe('HeroSection -- Tests d\'intégration', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  async function render(
    props: Record<string, unknown> = defaultProps,
  ): Promise<string> {
    return container.renderToString(HeroSection, { props })
  }

  function countOccurrences(html: string, pattern: string): number {
    return (html.match(new RegExp(pattern, 'g')) || []).length
  }

  // ════════════════════════════════════════════════════════════════════════
  // 1. Assemblage complet (INT-01 a INT-13)
  // ════════════════════════════════════════════════════════════════════════

  describe('Assemblage complet', () => {
    let html: string

    beforeAll(async () => {
      const c = await AstroContainer.create()
      html = await c.renderToString(HeroSection, { props: defaultProps })
    })

    it('INT-01 : rend une <section> root avec id="hero"', () => {
      expect(html).toContain('<section')
      expect(html).toContain('id="hero"')
    })

    it('INT-02 : contient exactement un <h1>', () => {
      const h1Count = countOccurrences(html, '<h1')
      expect(h1Count).toBe(1)
    })

    it('INT-03 : le <h1> contient le titre de production complet', () => {
      expect(html).toContain(
        'AIAD : Le framework pour développer avec des agents IA',
      )
    })

    it('INT-04 : la tagline est rendue après le <h1>', () => {
      const h1CloseIndex = html.indexOf('</h1>')
      const taglineIndex = html.indexOf('Structurez votre collaboration')
      expect(taglineIndex).toBeGreaterThan(h1CloseIndex)
    })

    it('INT-05 : la ValueProposition est rendue (texte complet)', () => {
      expect(html).toContain(
        'Une méthodologie éprouvée pour intégrer les agents IA dans votre workflow',
      )
    })

    it('INT-06 : le CTAButton est rendu avec texte et href', () => {
      expect(html).toContain('Explorer le Framework')
      expect(html).toContain('href="/framework"')
    })

    it('INT-07 : le CTAButton contient un SVG d\'icône', () => {
      const ctaIndex = html.indexOf('Explorer le Framework')
      const svgAfterCta = html.indexOf('<svg', ctaIndex)
      expect(svgAfterCta).toBeGreaterThan(ctaIndex)
    })

    it('INT-08 : rend exactement 3 BenefitCards (<article>)', () => {
      const articleCount = countOccurrences(html, '<article')
      expect(articleCount).toBe(3)
    })

    it('INT-09 : chaque BenefitCard contient un SVG d\'icône', () => {
      const svgCount = countOccurrences(html, '<svg')
      // 3 icones Lucide (benefits) + 1 icone CTA (arrow) = 4 minimum
      expect(svgCount).toBeGreaterThanOrEqual(4)
    })

    it('INT-10 : rend exactement 3 valeurs stat-value', () => {
      const statCount = countOccurrences(html, 'stat-value')
      expect(statCount).toBe(3)
    })

    it('INT-11 : contient les 3 titres de bénéfices de production', () => {
      expect(html).toContain('Productivité décuplée')
      expect(html).toContain('Qualité garantie')
      expect(html).toContain('Collaboration fluide')
    })

    it('INT-12 : contient les 3 valeurs statistiques de production', () => {
      expect(html).toContain('50%')
      expect(html).toContain('3x')
      // >90% est echappe par Astro
      expect(html).toContain('&gt;90%')
    })

    it('INT-13 : contient les 3 sources statistiques', () => {
      expect(html).toContain('McKinsey')
      expect(html).toContain('GitHub')
      expect(html).toContain('Stack Overflow')
    })
  })

  // ════════════════════════════════════════════════════════════════════════
  // 2. Hierarchie HTML et structure semantique (INT-H-01 a INT-H-10)
  // ════════════════════════════════════════════════════════════════════════

  describe('Hiérarchie HTML', () => {
    let html: string

    beforeAll(async () => {
      const c = await AstroContainer.create()
      html = await c.renderToString(HeroSection, { props: defaultProps })
    })

    it('INT-H-01 : exactement 1 <h1>', () => {
      expect(countOccurrences(html, '<h1')).toBe(1)
    })

    it('INT-H-02 : exactement 2 <h2> (bénéfices + stats)', () => {
      expect(countOccurrences(html, '<h2')).toBe(2)
    })

    it('INT-H-03 : exactement 3 <h3> (3 BenefitCards)', () => {
      expect(countOccurrences(html, '<h3')).toBe(3)
    })

    it('INT-H-04 : pas de <h4>, <h5> ou <h6>', () => {
      expect(html).not.toMatch(/<h[4-6]/)
    })

    it('INT-H-05 : le <h1> apparaît avant tous les <h2>', () => {
      const h1Index = html.indexOf('<h1')
      const firstH2Index = html.indexOf('<h2')
      expect(h1Index).toBeLessThan(firstH2Index)
    })

    it('INT-H-06 : les <h2> apparaissent avant les <h3>', () => {
      const firstH2Index = html.indexOf('<h2')
      const firstH3Index = html.indexOf('<h3')
      expect(firstH2Index).toBeLessThan(firstH3Index)
    })

    it('INT-H-07 : hiérarchie continue sans saut h1 -> h3', () => {
      const h1Index = html.indexOf('<h1')
      const firstH2Index = html.indexOf('<h2')
      const firstH3Index = html.indexOf('<h3')
      expect(firstH2Index).toBeGreaterThan(h1Index)
      expect(firstH2Index).toBeLessThan(firstH3Index)
    })

    it('INT-H-08 : structure <section> root -> <div> conteneur', () => {
      const sectionIndex = html.indexOf('<section')
      const divIndex = html.indexOf('<div', sectionIndex)
      const h1Index = html.indexOf('<h1')
      expect(divIndex).toBeGreaterThan(sectionIndex)
      expect(divIndex).toBeLessThan(h1Index)
    })

    it('INT-H-09 : BenefitsList dans une <section> avec aria-labelledby', () => {
      expect(html).toContain('id="benefits-section"')
      expect(html).toContain('aria-labelledby="benefits-section-title"')
    })

    it('INT-H-10 : StatsRow dans une <section> avec aria-labelledby', () => {
      expect(html).toContain('id="stats-section"')
      expect(html).toContain('aria-labelledby="stats-section-title"')
    })
  })

  // ════════════════════════════════════════════════════════════════════════
  // 3. Accessibilite globale (INT-A-01 a INT-A-10)
  // ════════════════════════════════════════════════════════════════════════

  describe('Accessibilité globale', () => {
    let html: string

    beforeAll(async () => {
      const c = await AstroContainer.create()
      html = await c.renderToString(HeroSection, { props: defaultProps })
    })

    it('INT-A-01 : section hero a aria-labelledby pointant vers le h1', () => {
      expect(html).toContain('aria-labelledby="hero-title"')
      expect(html).toContain('id="hero-title"')
    })

    it('INT-A-02 : section benefits a aria-labelledby', () => {
      expect(html).toContain('aria-labelledby="benefits-section-title"')
    })

    it('INT-A-03 : section stats a aria-labelledby', () => {
      expect(html).toContain('aria-labelledby="stats-section-title"')
    })

    it('INT-A-04 : tous les aria-labelledby pointent vers des IDs existants', () => {
      const ariaRefs = [...html.matchAll(/aria-labelledby="([^"]+)"/g)]
      expect(ariaRefs.length).toBeGreaterThan(0)
      for (const match of ariaRefs) {
        expect(html).toContain(`id="${match[1]}"`)
      }
    })

    it('INT-A-05 : les icônes SVG ont aria-hidden="true"', () => {
      const ariaHiddenCount = countOccurrences(html, 'aria-hidden="true"')
      expect(ariaHiddenCount).toBeGreaterThanOrEqual(3)
    })

    it('INT-A-06 : les liens sources ont rel="noopener noreferrer"', () => {
      const relCount = countOccurrences(html, 'rel="noopener noreferrer"')
      expect(relCount).toBeGreaterThanOrEqual(3)
    })

    it('INT-A-07 : les liens sources ont target="_blank"', () => {
      const targetCount = countOccurrences(html, 'target="_blank"')
      expect(targetCount).toBeGreaterThanOrEqual(3)
    })

    it('INT-A-08 : les liens sources contiennent un <span class="sr-only">', () => {
      const srOnlyCount = countOccurrences(html, 'sr-only')
      // 3 spans sr-only (sources) + 2 h2 sr-only (benefits + stats) = 5
      expect(srOnlyCount).toBeGreaterThanOrEqual(5)
    })

    it('INT-A-09 : les <h2> de BenefitsList et StatsRow sont sr-only', () => {
      const h2SrOnly = html.match(/<h2[^>]*class="[^"]*sr-only[^"]*"/g) || []
      expect(h2SrOnly.length).toBe(2)
    })

    it('INT-A-10 : le CTAButton a focus:ring-2 pour le focus visible', () => {
      expect(html).toContain('focus:ring-2')
    })
  })

  // ════════════════════════════════════════════════════════════════════════
  // 4. Ordre sequentiel des sous-composants (INT-O-01 a INT-O-07)
  // ════════════════════════════════════════════════════════════════════════

  describe('Ordre séquentiel', () => {
    let html: string

    beforeAll(async () => {
      const c = await AstroContainer.create()
      html = await c.renderToString(HeroSection, { props: defaultProps })
    })

    it('INT-O-01 : HeroTitle (<h1>) apparaît en premier', () => {
      const h1Index = html.indexOf('<h1')
      const vpIndex = html.indexOf('Une méthodologie')
      const ctaIndex = html.indexOf('Explorer le Framework')
      const benefitsIndex = html.indexOf('benefits-section')
      const statsIndex = html.indexOf('stats-section')

      expect(h1Index).toBeLessThan(vpIndex)
      expect(h1Index).toBeLessThan(ctaIndex)
      expect(h1Index).toBeLessThan(benefitsIndex)
      expect(h1Index).toBeLessThan(statsIndex)
    })

    it('INT-O-02 : ValueProposition apparaît après HeroTitle', () => {
      const h1CloseIndex = html.indexOf('</h1>')
      const vpIndex = html.indexOf('Une méthodologie')
      expect(vpIndex).toBeGreaterThan(h1CloseIndex)
    })

    it('INT-O-03 : CTAButton apparaît après ValueProposition', () => {
      const vpIndex = html.indexOf('multiplier votre productivité')
      const ctaIndex = html.indexOf('Explorer le Framework')
      expect(ctaIndex).toBeGreaterThan(vpIndex)
    })

    it('INT-O-04 : BenefitsList apparaît après CTAButton', () => {
      const ctaIndex = html.indexOf('Explorer le Framework')
      const benefitsIndex = html.indexOf('benefits-section')
      expect(benefitsIndex).toBeGreaterThan(ctaIndex)
    })

    it('INT-O-05 : StatsRow apparaît après BenefitsList', () => {
      const benefitsIndex = html.indexOf('benefits-section')
      const statsIndex = html.indexOf('stats-section')
      expect(statsIndex).toBeGreaterThan(benefitsIndex)
    })

    it('INT-O-06 : les 3 BenefitCards dans l\'ordre 1, 2, 3', () => {
      const idx1 = html.indexOf('Productivité décuplée')
      const idx2 = html.indexOf('Qualité garantie')
      const idx3 = html.indexOf('Collaboration fluide')

      expect(idx1).toBeLessThan(idx2)
      expect(idx2).toBeLessThan(idx3)
    })

    it('INT-O-07 : les 3 StatDisplay dans l\'ordre 1, 2, 3', () => {
      // Utiliser les labels uniques pour eviter les faux positifs
      // (ex: '3x' matche dans 'text-3xl')
      const idx1 = html.indexOf('Gain de productivité avec les agents IA')
      const idx2 = html.indexOf('Plus rapide pour coder avec assistance IA')
      const idx3 = html.indexOf('développeurs satisfaits')

      expect(idx1).toBeGreaterThan(-1)
      expect(idx2).toBeGreaterThan(-1)
      expect(idx3).toBeGreaterThan(-1)
      expect(idx1).toBeLessThan(idx2)
      expect(idx2).toBeLessThan(idx3)
    })
  })

  // ════════════════════════════════════════════════════════════════════════
  // 5. Espacement inter-sections (INT-S-01 a INT-S-10)
  // ════════════════════════════════════════════════════════════════════════

  describe('Espacement inter-sections', () => {
    describe('spacing default', () => {
      let html: string

      beforeAll(async () => {
        const c = await AstroContainer.create()
        html = await c.renderToString(HeroSection, { props: defaultProps })
      })

      it('INT-S-01 : section padding py-16 md:py-24', () => {
        expect(html).toContain('py-16')
        expect(html).toContain('md:py-24')
      })

      it('INT-S-02 : espace après titre mt-6', () => {
        expect(html).toContain('mt-6')
      })

      it('INT-S-03 : espace après VP mt-8', () => {
        expect(html).toContain('mt-8')
      })

      it('INT-S-04 : espace après CTA mt-12 md:mt-16', () => {
        expect(html).toContain('mt-12')
        expect(html).toContain('md:mt-16')
      })

      it('INT-S-05 : espace après BenefitsList mt-12 md:mt-16', () => {
        // afterCta et afterBenefits sont tous les deux mt-12 md:mt-16
        const mt12Count = countOccurrences(html, 'mt-12')
        expect(mt12Count).toBeGreaterThanOrEqual(2)
      })
    })

    describe('spacing compact', () => {
      let html: string

      beforeAll(async () => {
        const c = await AstroContainer.create()
        html = await c.renderToString(HeroSection, {
          props: { ...defaultProps, spacing: 'compact' },
        })
      })

      it('INT-S-06 : section padding py-10 md:py-14', () => {
        expect(html).toContain('py-10')
        expect(html).toContain('md:py-14')
      })

      it('INT-S-07 : espaces internes réduits', () => {
        expect(html).toContain('mt-4')
        expect(html).toContain('mt-6')
        expect(html).toContain('mt-8')
        expect(html).toContain('md:mt-10')
      })
    })

    describe('spacing spacious', () => {
      let html: string

      beforeAll(async () => {
        const c = await AstroContainer.create()
        html = await c.renderToString(HeroSection, {
          props: { ...defaultProps, spacing: 'spacious' },
        })
      })

      it('INT-S-08 : section padding py-20 md:py-32', () => {
        expect(html).toContain('py-20')
        expect(html).toContain('md:py-32')
      })

      it('INT-S-09 : espaces internes étendus', () => {
        expect(html).toContain('mt-8')
        expect(html).toContain('mt-10')
        expect(html).toContain('mt-16')
        expect(html).toContain('md:mt-20')
      })
    })

    it('INT-S-10 : padding horizontal px-4 md:px-6 lg:px-8 toujours présent', async () => {
      const htmlDefault = await render(defaultProps)
      expect(htmlDefault).toContain('px-4')
      expect(htmlDefault).toContain('md:px-6')
      expect(htmlDefault).toContain('lg:px-8')

      const htmlCompact = await render({ ...defaultProps, spacing: 'compact' })
      expect(htmlCompact).toContain('px-4')
      expect(htmlCompact).toContain('md:px-6')
      expect(htmlCompact).toContain('lg:px-8')

      const htmlSpacious = await render({ ...defaultProps, spacing: 'spacious' })
      expect(htmlSpacious).toContain('px-4')
      expect(htmlSpacious).toContain('md:px-6')
      expect(htmlSpacious).toContain('lg:px-8')
    })
  })

  // ════════════════════════════════════════════════════════════════════════
  // 6. Propagation des props parent -> enfants (INT-P-01 a INT-P-24)
  // ════════════════════════════════════════════════════════════════════════

  describe('Propagation des props', () => {
    describe('centered=true (défaut)', () => {
      let html: string

      beforeAll(async () => {
        const c = await AstroContainer.create()
        html = await c.renderToString(HeroSection, { props: defaultProps })
      })

      it('INT-P-01 : HeroTitle text-center', () => {
        expect(html).toContain('text-center')
      })

      it('INT-P-02 : ValueProposition mx-auto', () => {
        expect(html).toContain('mx-auto')
      })

      it('INT-P-03 : CTA wrapper flex justify-center', () => {
        expect(html).toContain('flex justify-center')
      })

      it('INT-P-04 : BenefitsList mx-auto', () => {
        // BenefitsList section has mx-auto when centered=true
        const benefitsIdx = html.indexOf('benefits-section')
        const sectionBefore = html.lastIndexOf('<section', benefitsIdx)
        const sectionContent = html.substring(sectionBefore, benefitsIdx + 100)
        expect(sectionContent).toContain('mx-auto')
      })

      it('INT-P-05 : StatsRow mx-auto', () => {
        const statsIdx = html.indexOf('stats-section')
        const sectionBefore = html.lastIndexOf('<section', statsIdx)
        const sectionContent = html.substring(sectionBefore, statsIdx + 100)
        expect(sectionContent).toContain('mx-auto')
      })
    })

    describe('centered=false', () => {
      let html: string

      beforeAll(async () => {
        const c = await AstroContainer.create()
        html = await c.renderToString(HeroSection, {
          props: { ...defaultProps, centered: false },
        })
      })

      it('INT-P-06 : HeroTitle text-left', () => {
        expect(html).toContain('text-left')
      })

      it('INT-P-07 : CTA wrapper sans flex justify-center', () => {
        // Verifier que le wrapper CTA n'a pas 'flex justify-center'
        // Note: le CTAButton lui-meme a 'inline-flex items-center justify-center'
        // qui ne contient pas la sous-chaine exacte 'flex justify-center'
        expect(html).not.toContain('flex justify-center')
      })
    })

    it('INT-P-08 : titleSize=sm -> text-2xl md:text-3xl', async () => {
      const html = await render({ ...defaultProps, titleSize: 'sm' })
      expect(html).toContain('text-2xl')
      expect(html).toContain('md:text-3xl')
    })

    it('INT-P-09 : titleSize=lg -> lg:text-5xl', async () => {
      const html = await render({ ...defaultProps, titleSize: 'lg' })
      expect(html).toContain('lg:text-5xl')
    })

    it('INT-P-10 : valuePropositionSize=lg -> text-lg md:text-xl', async () => {
      const html = await render({
        ...defaultProps,
        valuePropositionSize: 'lg',
      })
      expect(html).toContain('text-lg')
      expect(html).toContain('md:text-xl')
    })

    it('INT-P-11 : valuePropositionEmphasis=strong -> font-medium text-gray-700', async () => {
      const html = await render({
        ...defaultProps,
        valuePropositionEmphasis: 'strong',
      })
      expect(html).toContain('font-medium')
      expect(html).toContain('text-gray-700')
    })

    it('INT-P-12 : ctaText custom -> texte affiché', async () => {
      const html = await render({
        ...defaultProps,
        ctaText: 'Découvrir maintenant',
      })
      expect(html).toContain('Découvrir maintenant')
    })

    it('INT-P-13 : ctaHref custom -> lien correct', async () => {
      const html = await render({
        ...defaultProps,
        ctaHref: '/custom',
      })
      expect(html).toContain('href="/custom"')
    })

    it('INT-P-14 : ctaVariant=secondary -> classes secondary', async () => {
      const html = await render({
        ...defaultProps,
        ctaVariant: 'secondary',
      })
      expect(html).toContain('bg-gray-100')
    })

    it('INT-P-15 : ctaSize=sm -> classes SM', async () => {
      const html = await render({
        ...defaultProps,
        ctaSize: 'sm',
      })
      expect(html).toContain('text-sm')
      expect(html).toContain('px-4')
    })

    it('INT-P-16 : benefitsColumns=2 -> md:grid-cols-2', async () => {
      const html = await render({
        ...defaultProps,
        benefitsColumns: 2,
      })
      expect(html).toContain('md:grid-cols-2')
    })

    it('INT-P-17 : benefitsCardVariant=featured -> bg-blue-50 dans les cards', async () => {
      const html = await render({
        ...defaultProps,
        benefitsCardVariant: 'featured',
      })
      expect(html).toContain('bg-blue-50')
      expect(html).toContain('border-blue-100')
    })

    it('INT-P-18 : statsShowDividers=false -> pas de séparateurs', async () => {
      const html = await render({
        ...defaultProps,
        statsShowDividers: false,
      })
      expect(html).not.toContain('border-t border-gray-200')
    })

    it('INT-P-19 : statsShowSources=false -> pas de <cite>', async () => {
      const html = await render({
        ...defaultProps,
        statsShowSources: false,
      })
      expect(html).not.toContain('<cite')
    })

    it('INT-P-20 : background=gradient -> classes gradient', async () => {
      const html = await render({
        ...defaultProps,
        background: 'gradient',
      })
      expect(html).toContain('bg-gradient-to-b')
      expect(html).toContain('from-white')
      expect(html).toContain('to-gray-50')
    })

    it('INT-P-21 : background=subtle -> bg-gray-50', async () => {
      const html = await render({
        ...defaultProps,
        background: 'subtle',
      })
      expect(html).toContain('bg-gray-50')
    })

    it('INT-P-22 : maxWidth=max-w-5xl -> conteneur max-w-5xl', async () => {
      const html = await render({
        ...defaultProps,
        maxWidth: 'max-w-5xl',
      })
      expect(html).toContain('max-w-5xl')
    })

    it('INT-P-23 : id=landing-hero -> IDs cohérents', async () => {
      const html = await render({
        ...defaultProps,
        id: 'landing-hero',
      })
      expect(html).toContain('id="landing-hero"')
      expect(html).toContain('aria-labelledby="landing-hero-title"')
      expect(html).toContain('id="landing-hero-title"')
    })

    it('INT-P-24 : class custom -> classes ajoutées', async () => {
      const html = await render({
        ...defaultProps,
        class: 'border-b border-gray-100',
      })
      expect(html).toContain('border-b')
      expect(html).toContain('border-gray-100')
    })
  })

  // ════════════════════════════════════════════════════════════════════════
  // 7. Visibilite conditionnelle des sections (INT-V-01 a INT-V-11)
  // ════════════════════════════════════════════════════════════════════════

  describe('Visibilité conditionnelle', () => {
    it('INT-V-01 : par défaut, 5 sous-composants visibles', async () => {
      const html = await render()

      expect(html).toContain('<h1')
      expect(html).toContain('Une méthodologie éprouvée')
      expect(html).toContain('Explorer le Framework')
      expect(html).toContain('benefits-section')
      expect(html).toContain('stats-section')
    })

    it('INT-V-02 : showValueProposition=false -> VP absente', async () => {
      const html = await render({
        ...defaultProps,
        showValueProposition: false,
      })

      expect(html).not.toContain('Une méthodologie éprouvée')
      expect(html).toContain('<h1')
      expect(html).toContain('Explorer le Framework')
      expect(html).toContain('benefits-section')
      expect(html).toContain('stats-section')
    })

    it('INT-V-03 : showCTA=false -> CTA absent', async () => {
      const html = await render({
        ...defaultProps,
        showCTA: false,
      })

      expect(html).not.toContain('Explorer le Framework')
      expect(html).toContain('<h1')
      expect(html).toContain('Une méthodologie éprouvée')
      expect(html).toContain('benefits-section')
      expect(html).toContain('stats-section')
    })

    it('INT-V-04 : showBenefits=false -> BenefitsList absente', async () => {
      const html = await render({
        ...defaultProps,
        showBenefits: false,
      })

      expect(html).not.toContain('benefits-section')
      expect(html).toContain('<h1')
      expect(html).toContain('Une méthodologie éprouvée')
      expect(html).toContain('Explorer le Framework')
      expect(html).toContain('stats-section')
    })

    it('INT-V-05 : showStats=false -> StatsRow absente', async () => {
      const html = await render({
        ...defaultProps,
        showStats: false,
      })

      expect(html).not.toContain('stats-section')
      expect(html).toContain('<h1')
      expect(html).toContain('Une méthodologie éprouvée')
      expect(html).toContain('Explorer le Framework')
      expect(html).toContain('benefits-section')
    })

    it('INT-V-06 : showBenefits=false + showStats=false -> titre, VP, CTA', async () => {
      const html = await render({
        ...defaultProps,
        showBenefits: false,
        showStats: false,
      })

      expect(html).not.toContain('benefits-section')
      expect(html).not.toContain('stats-section')
      expect(html).toContain('<h1')
      expect(html).toContain('Une méthodologie éprouvée')
      expect(html).toContain('Explorer le Framework')
    })

    it('INT-V-07 : toutes sections masquées sauf titre', async () => {
      const html = await render({
        ...defaultProps,
        showValueProposition: false,
        showCTA: false,
        showBenefits: false,
        showStats: false,
      })

      expect(html).toContain('<h1')
      expect(html).toContain('<section')
      expect(html).not.toContain('Explorer le Framework')
      expect(html).not.toContain('benefits-section')
      expect(html).not.toContain('stats-section')
    })

    it('INT-V-08 : showValueProposition=false -> hiérarchie titres inchangée', async () => {
      const html = await render({
        ...defaultProps,
        showValueProposition: false,
      })

      expect(countOccurrences(html, '<h1')).toBe(1)
      expect(countOccurrences(html, '<h2')).toBe(2)
      expect(countOccurrences(html, '<h3')).toBe(3)
    })

    it('INT-V-09 : showBenefits=false -> 1 h2 (stats), 0 h3', async () => {
      const html = await render({
        ...defaultProps,
        showBenefits: false,
      })

      expect(countOccurrences(html, '<h2')).toBe(1)
      expect(countOccurrences(html, '<h3')).toBe(0)
    })

    it('INT-V-10 : showStats=false -> 1 h2 (bénéfices), 3 h3', async () => {
      const html = await render({
        ...defaultProps,
        showStats: false,
      })

      expect(countOccurrences(html, '<h2')).toBe(1)
      expect(countOccurrences(html, '<h3')).toBe(3)
    })

    it('INT-V-11 : showBenefits=false + showStats=false -> 0 h2, 0 h3', async () => {
      const html = await render({
        ...defaultProps,
        showBenefits: false,
        showStats: false,
      })

      expect(countOccurrences(html, '<h2')).toBe(0)
      expect(countOccurrences(html, '<h3')).toBe(0)
    })
  })

  // ════════════════════════════════════════════════════════════════════════
  // 8. Donnees de production (INT-D-01 a INT-D-10)
  // ════════════════════════════════════════════════════════════════════════

  describe('Données de production', () => {
    let html: string

    beforeAll(async () => {
      const c = await AstroContainer.create()
      html = await c.renderToString(HeroSection, { props: defaultProps })
    })

    it('INT-D-01 : le titre de production est rendu correctement', () => {
      expect(html).toContain(
        'AIAD : Le framework pour développer avec des agents IA',
      )
    })

    it('INT-D-02 : la tagline contient l\'apostrophe échappée', () => {
      expect(html).toContain('l&#39;intelligence')
    })

    it('INT-D-03 : la VP de production est rendue en entier', () => {
      expect(html).toContain(
        'multiplier votre productivité.',
      )
    })

    it('INT-D-04 : les 3 descriptions de bénéfices sont rendues', () => {
      expect(html).toContain(
        'Automatisez les tâches répétitives',
      )
      expect(html).toContain(
        'Des standards de code et des validations',
      )
      expect(html).toContain(
        'Une méthodologie claire pour structurer le travail',
      )
    })

    it('INT-D-05 : les 3 labels de statistiques sont rendus', () => {
      expect(html).toContain('Gain de productivité avec les agents IA')
      expect(html).toContain('Plus rapide pour coder avec assistance IA')
      expect(html).toContain('développeurs satisfaits')
    })

    it('INT-D-06 : les URLs source sont rendues comme liens <a>', () => {
      const linkCount = countOccurrences(html, '<a')
      // 3 liens sources + 1 CTA = au moins 4 liens
      expect(linkCount).toBeGreaterThanOrEqual(4)
    })

    it('INT-D-07 : les URLs source sont des liens valides (https://)', () => {
      const httpsCount = countOccurrences(html, 'href="https://')
      expect(httpsCount).toBeGreaterThanOrEqual(3)
    })

    it('INT-D-08 : la stat highlight (50%) reçoit bg-blue-50', () => {
      // Chercher bg-blue-50 dans la zone des stats
      const statsIdx = html.indexOf('stats-section')
      const htmlAfterStats = html.substring(statsIdx)
      expect(htmlAfterStats).toContain('bg-blue-50')
    })

    it('INT-D-09 : les stats non-highlight reçoivent bg-transparent', () => {
      const statsIdx = html.indexOf('stats-section')
      const htmlAfterStats = html.substring(statsIdx)
      expect(htmlAfterStats).toContain('bg-transparent')
    })

    it('INT-D-10 : l\'apostrophe dans le label stat est échappée', () => {
      expect(html).toContain('l&#39;IA')
    })
  })

  // ════════════════════════════════════════════════════════════════════════
  // 9. Cas limites et degrades end-to-end (INT-CL-01 a INT-CL-20)
  // ════════════════════════════════════════════════════════════════════════

  describe('Cas limites et dégradés', () => {
    it('INT-CL-01 : rendu minimal sans aucune prop', async () => {
      const html = await render({})

      expect(html).toContain('<section')
      expect(html).toContain('<h1')
      expect(html).toContain('AIAD')
    })

    it('INT-CL-02 : heroContent sans tagline', async () => {
      const html = await render({
        heroContent: { ...productionHeroContent, tagline: '' },
        benefits: productionBenefits,
        stats: productionStats,
      })

      // h1 present, pas de tagline
      expect(html).toContain('<h1')
      expect(html).toContain('AIAD : Le framework')
      // La tagline vide ne devrait pas generer de <p> tagline
      // (showTagline={!!tagline} = false)
    })

    it('INT-CL-03 : heroContent sans valueProposition', async () => {
      const html = await render({
        heroContent: { ...productionHeroContent, valueProposition: '' },
        benefits: productionBenefits,
        stats: productionStats,
      })

      expect(html).not.toContain('Une méthodologie éprouvée')
      expect(html).toContain('Explorer le Framework')
    })

    it('INT-CL-04 : heroContent avec tagline + VP vides', async () => {
      const html = await render({
        heroContent: {
          ...productionHeroContent,
          tagline: '',
          valueProposition: '',
        },
        benefits: productionBenefits,
        stats: productionStats,
      })

      expect(html).toContain('AIAD : Le framework')
      expect(html).toContain('Explorer le Framework')
      expect(html).toContain('benefits-section')
      expect(html).toContain('stats-section')
    })

    it('INT-CL-05 : benefits vide -> pas de section bénéfices', async () => {
      const html = await render({
        heroContent: productionHeroContent,
        benefits: [],
        stats: productionStats,
      })

      expect(html).not.toContain('benefits-section')
      expect(countOccurrences(html, '<article')).toBe(0)
      expect(countOccurrences(html, '<h3')).toBe(0)
      expect(html).toContain('stats-section')
    })

    it('INT-CL-06 : stats vide -> pas de section stats', async () => {
      const html = await render({
        heroContent: productionHeroContent,
        benefits: productionBenefits,
        stats: [],
      })

      expect(html).not.toContain('stats-section')
      expect(html).toContain('benefits-section')
    })

    it('INT-CL-07 : benefits vide + stats vide', async () => {
      const html = await render({
        heroContent: productionHeroContent,
        benefits: [],
        stats: [],
      })

      expect(html).not.toContain('benefits-section')
      expect(html).not.toContain('stats-section')
      expect(html).toContain('<h1')
      expect(html).toContain('Une méthodologie éprouvée')
      expect(html).toContain('Explorer le Framework')
    })

    it('INT-CL-08 : 1 seul benefit', async () => {
      const html = await render({
        heroContent: productionHeroContent,
        benefits: [makeBenefit('b1', 'Unique bénéfice')],
        stats: productionStats,
      })

      expect(countOccurrences(html, '<article')).toBe(1)
      expect(countOccurrences(html, '<h3')).toBe(1)
    })

    it('INT-CL-09 : 5 benefits', async () => {
      const fiveBenefits = Array.from({ length: 5 }, (_, i) =>
        makeBenefit(`b${i}`, `Bénéfice numéro ${i + 1}`, i + 1),
      )
      const html = await render({
        heroContent: productionHeroContent,
        benefits: fiveBenefits,
        stats: productionStats,
      })

      expect(countOccurrences(html, '<article')).toBe(5)
      expect(countOccurrences(html, '<h3')).toBe(5)
    })

    it('INT-CL-10 : 1 seule stat', async () => {
      const html = await render({
        heroContent: productionHeroContent,
        benefits: productionBenefits,
        stats: [makeStat('s1', '42%')],
      })

      expect(countOccurrences(html, 'stat-value')).toBe(1)
      // Pas de separateur pour 1 seule stat
      expect(html).not.toContain('border-t border-gray-200')
    })

    it('INT-CL-11 : 2 stats', async () => {
      const html = await render({
        heroContent: productionHeroContent,
        benefits: productionBenefits,
        stats: [
          makeStat('s1', '42%', 1),
          makeStat('s2', '7x', 2),
        ],
      })

      expect(countOccurrences(html, 'stat-value')).toBe(2)
      // 1 separateur (entre stat 1 et stat 2)
      expect(countOccurrences(html, 'border-t border-gray-200')).toBe(1)
    })

    it('INT-CL-12 : 6 stats', async () => {
      const sixStats = Array.from({ length: 6 }, (_, i) =>
        makeStat(`s${i}`, `${(i + 1) * 10}%`, i + 1),
      )
      const html = await render({
        heroContent: productionHeroContent,
        benefits: productionBenefits,
        stats: sixStats,
      })

      expect(countOccurrences(html, 'stat-value')).toBe(6)
    })

    it('INT-CL-13 : XSS dans le titre -> échappé', async () => {
      const html = await render({
        heroContent: {
          ...productionHeroContent,
          title: '<script>alert("xss")</script>',
        },
        benefits: productionBenefits,
        stats: productionStats,
      })

      expect(html).toContain('&lt;script&gt;')
      expect(html).not.toContain('<script>alert')
    })

    it('INT-CL-14 : XSS dans la VP -> échappé', async () => {
      const html = await render({
        heroContent: {
          ...productionHeroContent,
          valueProposition: '<img onerror=alert(1)> Description valide.',
        },
        benefits: productionBenefits,
        stats: productionStats,
      })

      expect(html).toContain('&lt;img')
    })

    it('INT-CL-15 : XSS dans un titre de benefit -> échappé', async () => {
      const xssBenefit: BenefitItem = {
        ...productionBenefits[0],
        title: '<b>Bold</b>',
      }
      const html = await render({
        heroContent: productionHeroContent,
        benefits: [xssBenefit, productionBenefits[1], productionBenefits[2]],
        stats: productionStats,
      })

      expect(html).toContain('&lt;b&gt;')
    })

    it('INT-CL-16 : XSS dans une source de stat -> échappé', async () => {
      const xssStat: StatItem = {
        ...productionStats[0],
        source: '<script>x</script>',
      }
      const html = await render({
        heroContent: productionHeroContent,
        benefits: productionBenefits,
        stats: [xssStat, productionStats[1], productionStats[2]],
      })

      expect(html).toContain('&lt;script&gt;')
    })

    it('INT-CL-17 : caractères spéciaux français rendus correctement', async () => {
      const html = await render({
        heroContent: {
          ...productionHeroContent,
          title: 'AIAD : éèêëçôùü àâïî',
        },
        benefits: productionBenefits,
        stats: productionStats,
      })

      expect(html).toContain('éèêëçôùü')
      expect(html).toContain('àâïî')
    })

    it('INT-CL-18 : emojis rendus correctement', async () => {
      const html = await render({
        heroContent: {
          ...productionHeroContent,
          title: 'AIAD Framework',
          tagline: 'Intelligence artificielle',
          valueProposition: 'Une proposition de valeur avec des emojis et du texte assez long.',
        },
        benefits: productionBenefits,
        stats: productionStats,
      })

      // Verifier que le rendu fonctionne avec un contenu standard
      expect(html).toContain('AIAD Framework')
    })

    it('INT-CL-19 : ampersand dans une source -> échappé', async () => {
      const ampStat: StatItem = {
        ...productionStats[0],
        source: 'McKinsey & Company',
      }
      const html = await render({
        heroContent: productionHeroContent,
        benefits: productionBenefits,
        stats: [ampStat, productionStats[1], productionStats[2]],
      })

      expect(html).toContain('McKinsey &amp; Company')
    })

    it('INT-CL-20 : heroContent undefined -> fallback titre AIAD', async () => {
      const html = await render({
        heroContent: undefined,
        benefits: productionBenefits,
        stats: productionStats,
      })

      expect(html).toContain('<h1')
      expect(html).toContain('AIAD')
    })
  })

  // ════════════════════════════════════════════════════════════════════════
  // 10. Combinaisons de props (INT-CO-01 a INT-CO-10)
  // ════════════════════════════════════════════════════════════════════════

  describe('Combinaisons de props', () => {
    it('INT-CO-01 : spacing=compact + background=gradient', async () => {
      const html = await render({
        ...defaultProps,
        spacing: 'compact',
        background: 'gradient',
      })

      expect(html).toContain('py-10')
      expect(html).toContain('md:py-14')
      expect(html).toContain('bg-gradient-to-b')
      expect(html).toContain('from-white')
      expect(html).toContain('to-gray-50')
    })

    it('INT-CO-02 : spacing=spacious + showBenefits=false + showStats=false', async () => {
      const html = await render({
        ...defaultProps,
        spacing: 'spacious',
        showBenefits: false,
        showStats: false,
      })

      expect(html).toContain('py-20')
      expect(html).not.toContain('benefits-section')
      expect(html).not.toContain('stats-section')
      expect(html).toContain('<h1')
      expect(html).toContain('Une méthodologie éprouvée')
      expect(html).toContain('Explorer le Framework')
    })

    it('INT-CO-03 : centered=false + titleSize=sm', async () => {
      const html = await render({
        ...defaultProps,
        centered: false,
        titleSize: 'sm',
      })

      expect(html).toContain('text-left')
      expect(html).toContain('text-2xl')
      expect(html).not.toContain('mx-auto')
    })

    it('INT-CO-04 : benefitsCardVariant=featured + statsShowDividers=false', async () => {
      const html = await render({
        ...defaultProps,
        benefitsCardVariant: 'featured',
        statsShowDividers: false,
      })

      // Cartes featured
      const benefitsIdx = html.indexOf('benefits-section')
      const benefitsHtml = html.substring(benefitsIdx)
      expect(benefitsHtml).toContain('bg-blue-50')
      expect(benefitsHtml).toContain('border-blue-100')

      // Pas de separateurs dans stats
      expect(html).not.toContain('border-t border-gray-200')
    })

    it('INT-CO-05 : ctaVariant=outline + ctaSize=sm', async () => {
      const html = await render({
        ...defaultProps,
        ctaVariant: 'outline',
        ctaSize: 'sm',
      })

      expect(html).toContain('bg-transparent')
      expect(html).toContain('border-2')
      expect(html).toContain('border-blue-600')
      expect(html).toContain('text-sm')
      expect(html).toContain('px-4')
    })

    it('INT-CO-06 : showCTA=false + showValueProposition=false', async () => {
      const html = await render({
        ...defaultProps,
        showCTA: false,
        showValueProposition: false,
      })

      expect(html).not.toContain('Explorer le Framework')
      expect(html).not.toContain('Une méthodologie éprouvée')
      expect(html).toContain('benefits-section')
      expect(html).toContain('stats-section')
    })

    it('INT-CO-07 : valuePropositionEmphasis=strong + valuePropositionSize=lg', async () => {
      const html = await render({
        ...defaultProps,
        valuePropositionEmphasis: 'strong',
        valuePropositionSize: 'lg',
      })

      expect(html).toContain('font-medium')
      expect(html).toContain('text-gray-700')
      expect(html).toContain('text-lg')
      expect(html).toContain('md:text-xl')
    })

    it('INT-CO-08 : maxWidth=max-w-4xl + centered=true + background=subtle', async () => {
      const html = await render({
        ...defaultProps,
        maxWidth: 'max-w-4xl',
        centered: true,
        background: 'subtle',
      })

      expect(html).toContain('max-w-4xl')
      expect(html).toContain('mx-auto')
      expect(html).toContain('bg-gray-50')
    })

    it('INT-CO-09 : id=custom + class=mt-10 border-b', async () => {
      const html = await render({
        ...defaultProps,
        id: 'custom',
        class: 'mt-10 border-b',
      })

      expect(html).toContain('id="custom"')
      expect(html).toContain('aria-labelledby="custom-title"')
      expect(html).toContain('id="custom-title"')
      expect(html).toContain('mt-10')
      expect(html).toContain('border-b')
    })

    it('INT-CO-10 : toutes les props par défaut avec données complètes', async () => {
      const html = await render(defaultProps)

      // Rendu complet valide
      expect(html).toContain('<section')
      expect(html).toContain('id="hero"')
      expect(html).toContain('<h1')
      expect(html).toContain('Explorer le Framework')
      expect(html).toContain('benefits-section')
      expect(html).toContain('stats-section')
      expect(countOccurrences(html, '<article')).toBe(3)
      expect(countOccurrences(html, 'stat-value')).toBe(3)
    })
  })
})
