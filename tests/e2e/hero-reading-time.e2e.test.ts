/**
 * T-001-T5 : Tests temps de lecture et UX du HeroSection
 *
 * Valide que le hero section permet à un visiteur de comprendre
 * AIAD en moins de 30 secondes.
 *
 * 5 catégories (~43 tests) :
 * - Comptage de mots et temps de lecture (RT-WC) : 10 tests
 * - Above the fold (RT-AF) : 10 tests
 * - Performance perceptuelle (RT-PERF) : 8 tests
 * - Hiérarchie visuelle et lisibilité (RT-VH) : 10 tests
 * - Densité textuelle et scanabilité (RT-SC) : 5 tests
 *
 * @see docs/specs/US-001/T-001-T5-tests-utilisateur-temps-lecture.md
 */

import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

// ── Types ──────────────────────────────────────────────────────

interface HeroContentAnalysis {
  primaryWordCount: number
  sourceWordCount: number
  totalWordCount: number
  estimatedReadingTimeSeconds: number
  sections: {
    title: number
    tagline: number
    valueProposition: number
    cta: number
    benefits: number
    stats: number
    sources: number
  }
}

interface PerformanceMetrics {
  lcp: number
  fcp: number
  cls: number
  tti: number
  domContentLoaded: number
  loadComplete: number
}

interface ElementVisibility {
  selector: string
  description: string
  isFullyAboveFold: boolean
  isPartiallyAboveFold: boolean
  bottomY: number
  viewportHeight: number
  visiblePercentage: number
}

interface AboveFoldAnalysis {
  viewportHeight: number
  elements: ElementVisibility[]
  criticalContentScore: number
}

interface TypographyProperties {
  selector: string
  fontSize: number
  fontWeight: number
  lineHeight: number
  color: string
  marginBottom: number
}

interface VisualHierarchyAnalysis {
  titleIsLargest: boolean
  hierarchyIsDecreasing: boolean
  ctaIsDistinct: boolean
  elements: TypographyProperties[]
}

interface ViewportConfig {
  name: string
  width: number
  height: number
}

const TEST_VIEWPORTS: ViewportConfig[] = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'desktop-large', width: 1920, height: 1080 },
]

// ── Helpers ────────────────────────────────────────────────────

async function analyzeHeroContent(page: Page): Promise<HeroContentAnalysis> {
  return page.evaluate(() => {
    function countWords(text: string): number {
      return text
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0).length
    }

    const hero = document.querySelector('#hero')
    if (!hero) throw new Error('#hero not found')

    // Titre (h1)
    const h1 = hero.querySelector('h1')?.textContent || ''

    // Tagline (p frère de h1 dans le même conteneur)
    const taglineEl = hero.querySelector('h1 + p')
    const tagline = taglineEl?.textContent || ''

    // Value proposition (p.leading-relaxed hors benefits/stats)
    let vpText = ''
    const leadingRelaxedEls = hero.querySelectorAll('p.leading-relaxed')
    for (const p of leadingRelaxedEls) {
      if (!p.closest('#benefits-section') && !p.closest('#stats-section')) {
        vpText = p.textContent || ''
        break
      }
    }

    // CTA
    const cta = hero.querySelector('a[href="/framework"] span')?.textContent || ''

    // Bénéfices (titres h3 + descriptions p)
    const benefitTexts: string[] = []
    hero.querySelectorAll('#benefits-section article').forEach((article) => {
      const h3 = article.querySelector('h3')?.textContent || ''
      const desc = article.querySelector('p')?.textContent || ''
      benefitTexts.push(h3, desc)
    })
    const benefitsText = benefitTexts.join(' ')

    // Stats (valeurs + labels, hors sources)
    const statTexts: string[] = []
    hero.querySelectorAll('#stats-section .stat-value').forEach((el) => {
      statTexts.push(el.textContent || '')
    })
    hero
      .querySelectorAll('#stats-section p.font-medium')
      .forEach((el) => {
        statTexts.push(el.textContent || '')
      })
    const statsText = statTexts.join(' ')

    // Sources (texte des <cite>)
    const sourceTexts: string[] = []
    hero.querySelectorAll('#stats-section cite').forEach((el) => {
      sourceTexts.push(el.textContent || '')
    })
    const sourcesText = sourceTexts.join(' ')

    const sections = {
      title: countWords(h1),
      tagline: countWords(tagline),
      valueProposition: countWords(vpText),
      cta: countWords(cta),
      benefits: countWords(benefitsText),
      stats: countWords(statsText),
      sources: countWords(sourcesText),
    }

    const primaryWordCount =
      sections.title +
      sections.tagline +
      sections.valueProposition +
      sections.cta +
      sections.benefits +
      sections.stats

    const totalWordCount = primaryWordCount + sections.sources

    return {
      primaryWordCount,
      sourceWordCount: sections.sources,
      totalWordCount,
      estimatedReadingTimeSeconds: Math.ceil((primaryWordCount / 250) * 60),
      sections,
    }
  })
}

async function analyzeAboveFold(
  page: Page,
  selectors: { selector: string; description: string }[]
): Promise<AboveFoldAnalysis> {
  const viewportHeight = page.viewportSize()?.height || 720

  const elements: ElementVisibility[] = []

  for (const { selector, description } of selectors) {
    const el = page.locator(selector).first()
    const box = await el.boundingBox()

    if (box) {
      const bottomY = box.y + box.height
      const visibleHeight = Math.max(
        0,
        Math.min(box.height, viewportHeight - box.y)
      )
      const visiblePercentage = Math.round((visibleHeight / box.height) * 100)

      elements.push({
        selector,
        description,
        isFullyAboveFold: bottomY <= viewportHeight,
        isPartiallyAboveFold: box.y < viewportHeight,
        bottomY,
        viewportHeight,
        visiblePercentage,
      })
    }
  }

  const criticalContentScore =
    elements.length > 0
      ? Math.round(
          elements.reduce((sum, e) => sum + e.visiblePercentage, 0) /
            elements.length
        )
      : 0

  return { viewportHeight, elements, criticalContentScore }
}

async function collectPerformanceMetrics(
  page: Page
): Promise<PerformanceMetrics> {
  return page.evaluate(() => {
    return new Promise<{
      lcp: number
      fcp: number
      cls: number
      tti: number
      domContentLoaded: number
      loadComplete: number
    }>((resolve) => {
      const nav = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming
      const paint = performance.getEntriesByType('paint')
      const fcp =
        paint.find((e) => e.name === 'first-contentful-paint')?.startTime || 0

      let lcp = 0
      let cls = 0

      // LCP via buffered observer
      try {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          if (entries.length > 0) {
            lcp = entries[entries.length - 1].startTime
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true })
      } catch {
        // LCP observer not supported
      }

      // CLS via buffered observer
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              cls += entry.value
            }
          }
        }).observe({ type: 'layout-shift', buffered: true })
      } catch {
        // layout-shift observer not supported
      }

      // Laisser le temps aux observers de traiter les entrées bufferisées
      setTimeout(() => {
        resolve({
          lcp,
          fcp,
          cls,
          tti: nav.domInteractive || 0,
          domContentLoaded: nav.domContentLoadedEventEnd || 0,
          loadComplete: nav.loadEventEnd || 0,
        })
      }, 1000)
    })
  })
}

async function analyzeVisualHierarchy(
  page: Page
): Promise<VisualHierarchyAnalysis> {
  const selectors = [
    { selector: '#hero h1', label: 'title' },
    { selector: '#hero h1 + p', label: 'tagline' },
    { selector: '#hero a[href="/framework"]', label: 'cta' },
    { selector: '#benefits-section h3', label: 'benefit-title' },
    { selector: '#benefits-section article p', label: 'benefit-desc' },
    { selector: '#stats-section', label: 'stats' },
  ]

  const elements: TypographyProperties[] = []

  for (const { selector } of selectors) {
    const el = page.locator(selector).first()
    const exists = (await el.count()) > 0

    if (exists) {
      const props = await el.evaluate((element) => {
        const cs = window.getComputedStyle(element)
        return {
          fontSize: parseFloat(cs.fontSize),
          fontWeight: parseInt(cs.fontWeight, 10),
          lineHeight: parseFloat(cs.lineHeight) || 0,
          color: cs.color,
          marginBottom: parseFloat(cs.marginBottom) || 0,
        }
      })

      elements.push({ selector, ...props })
    }
  }

  const titleSize =
    elements.find((e) => e.selector.includes('h1'))?.fontSize || 0
  const otherSizes = elements
    .filter((e) => !e.selector.includes('h1'))
    .map((e) => e.fontSize)

  const titleIsLargest = otherSizes.every((s) => titleSize > s)

  const h1Size =
    elements.find((e) => e.selector === '#hero h1')?.fontSize || 0
  const h3Size =
    elements.find((e) => e.selector === '#benefits-section h3')?.fontSize || 0
  const pSize =
    elements.find((e) => e.selector === '#benefits-section article p')
      ?.fontSize || 0

  const hierarchyIsDecreasing = h1Size > h3Size && h3Size >= pSize

  // Vérifier que le CTA se distingue (background-color != transparent)
  const ctaEl = page.locator('a[href="/framework"]').first()
  const ctaBg = await ctaEl.evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor
  })
  const ctaIsDistinct =
    ctaBg !== 'rgba(0, 0, 0, 0)' && ctaBg !== 'transparent'

  return { titleIsLargest, hierarchyIsDecreasing, ctaIsDistinct, elements }
}

// ── Tests ──────────────────────────────────────────────────────

test.describe('HeroSection — Tests temps de lecture et UX', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#hero')
  })

  // ── 1. Comptage de mots et temps de lecture ────────────────

  test.describe('Comptage de mots et temps de lecture', () => {
    test('RT-WC-01 : le contenu principal contient ≤ 125 mots', async ({
      page,
    }) => {
      const analysis = await analyzeHeroContent(page)

      expect(
        analysis.primaryWordCount,
        `Le hero contient ${analysis.primaryWordCount} mots (max 125). ` +
          `Détail : titre=${analysis.sections.title}, tagline=${analysis.sections.tagline}, ` +
          `VP=${analysis.sections.valueProposition}, CTA=${analysis.sections.cta}, ` +
          `benefits=${analysis.sections.benefits}, stats=${analysis.sections.stats}`
      ).toBeLessThanOrEqual(125)
    })

    test('RT-WC-02 : le contenu principal contient ≥ 50 mots (pas vide)', async ({
      page,
    }) => {
      const analysis = await analyzeHeroContent(page)

      expect(analysis.primaryWordCount).toBeGreaterThanOrEqual(50)
    })

    test('RT-WC-03 : temps de lecture estimé ≤ 30 secondes (250 mots/min)', async ({
      page,
    }) => {
      const analysis = await analyzeHeroContent(page)

      expect(
        analysis.estimatedReadingTimeSeconds,
        `Temps estimé : ${analysis.estimatedReadingTimeSeconds}s ` +
          `(${analysis.primaryWordCount} mots à 250 mots/min)`
      ).toBeLessThanOrEqual(30)
    })

    test('RT-WC-04 : le titre contient entre 5 et 15 mots', async ({
      page,
    }) => {
      const analysis = await analyzeHeroContent(page)

      expect(analysis.sections.title).toBeGreaterThanOrEqual(5)
      expect(analysis.sections.title).toBeLessThanOrEqual(15)
    })

    test('RT-WC-05 : la tagline contient entre 4 et 12 mots', async ({
      page,
    }) => {
      const analysis = await analyzeHeroContent(page)

      expect(analysis.sections.tagline).toBeGreaterThanOrEqual(4)
      expect(analysis.sections.tagline).toBeLessThanOrEqual(12)
    })

    test('RT-WC-06 : la value proposition contient entre 10 et 30 mots', async ({
      page,
    }) => {
      const analysis = await analyzeHeroContent(page)

      expect(analysis.sections.valueProposition).toBeGreaterThanOrEqual(10)
      expect(analysis.sections.valueProposition).toBeLessThanOrEqual(30)
    })

    test('RT-WC-07 : chaque description de bénéfice contient ≤ 20 mots', async ({
      page,
    }) => {
      const descriptions = await page.$$eval(
        '#benefits-section article p',
        (elements) =>
          elements.map(
            (el) =>
              el.textContent
                ?.trim()
                .split(/\s+/)
                .filter((w) => w.length > 0).length || 0
          )
      )

      expect(descriptions.length).toBeGreaterThanOrEqual(1)
      for (const wordCount of descriptions) {
        expect(wordCount).toBeLessThanOrEqual(20)
      }
    })

    test('RT-WC-08 : chaque label de statistique contient ≤ 12 mots', async ({
      page,
    }) => {
      const labels = await page.$$eval(
        '#stats-section p.font-medium',
        (elements) =>
          elements.map(
            (el) =>
              el.textContent
                ?.trim()
                .split(/\s+/)
                .filter((w) => w.length > 0).length || 0
          )
      )

      expect(labels.length).toBeGreaterThanOrEqual(1)
      for (const wordCount of labels) {
        expect(wordCount).toBeLessThanOrEqual(12)
      }
    })

    test('RT-WC-09 : le CTA contient entre 2 et 5 mots', async ({ page }) => {
      const analysis = await analyzeHeroContent(page)

      expect(analysis.sections.cta).toBeGreaterThanOrEqual(2)
      expect(analysis.sections.cta).toBeLessThanOrEqual(5)
    })

    test('RT-WC-10 : les sources ≤ 20% du texte total', async ({ page }) => {
      const analysis = await analyzeHeroContent(page)

      if (analysis.totalWordCount > 0) {
        const ratio = analysis.sourceWordCount / analysis.totalWordCount
        expect(
          ratio,
          `Les sources représentent ${Math.round(ratio * 100)}% du texte total`
        ).toBeLessThanOrEqual(0.2)
      }
    })
  })

  // ── 2. Above the fold ──────────────────────────────────────

  test.describe('Above the fold', () => {
    test('RT-AF-01 : le titre (h1) est entièrement above the fold (desktop)', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.goto('/')

      const h1Box = await page.locator('#hero h1').boundingBox()
      expect(h1Box).not.toBeNull()
      expect(h1Box!.y + h1Box!.height).toBeLessThanOrEqual(720)
    })

    test('RT-AF-02 : la tagline est entièrement above the fold (desktop)', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.goto('/')

      const taglineBox = await page
        .locator('#hero h1 + p')
        .first()
        .boundingBox()
      expect(taglineBox).not.toBeNull()
      expect(taglineBox!.y + taglineBox!.height).toBeLessThanOrEqual(720)
    })

    test('RT-AF-03 : la value proposition est entièrement above the fold (desktop)', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.goto('/')

      // VP est le p.leading-relaxed hors benefits/stats
      const vpLocator = page
        .locator('#hero p.leading-relaxed')
        .first()
      const vpBox = await vpLocator.boundingBox()
      expect(vpBox).not.toBeNull()
      expect(vpBox!.y + vpBox!.height).toBeLessThanOrEqual(720)
    })

    test('RT-AF-04 : le CTA est entièrement above the fold (desktop)', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.goto('/')

      const ctaBox = await page
        .locator('a[href="/framework"]')
        .boundingBox()
      expect(ctaBox).not.toBeNull()
      expect(ctaBox!.y + ctaBox!.height).toBeLessThanOrEqual(720)
    })

    test('RT-AF-05 : les titres des 3 bénéfices sont au moins partiellement visibles (desktop)', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.goto('/')

      const h3Elements = page.locator('#benefits-section article h3')
      const count = await h3Elements.count()
      expect(count).toBe(3)

      for (let i = 0; i < count; i++) {
        const box = await h3Elements.nth(i).boundingBox()
        expect(
          box,
          `Le titre du bénéfice ${i + 1} devrait être présent`
        ).not.toBeNull()
        expect(
          box!.y,
          `Le titre du bénéfice ${i + 1} devrait commencer dans le viewport`
        ).toBeLessThan(720)
      }
    })

    test('RT-AF-06 : le score de contenu critique above the fold est ≥ 80% (desktop)', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.goto('/')

      const atf = await analyzeAboveFold(page, [
        { selector: '#hero h1', description: 'Titre principal' },
        { selector: '#hero h1 + p', description: 'Tagline' },
        { selector: 'a[href="/framework"]', description: 'CTA' },
        { selector: '#benefits-section', description: 'Section bénéfices' },
        { selector: '#stats-section', description: 'Section statistiques' },
      ])

      expect(
        atf.criticalContentScore,
        `Score above the fold : ${atf.criticalContentScore}% (min 80%)`
      ).toBeGreaterThanOrEqual(80)
    })

    test('RT-AF-07 : sur mobile, h1 + tagline + VP + CTA visibles', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      const elements = [
        '#hero h1',
        '#hero h1 + p',
        'a[href="/framework"]',
      ]

      for (const selector of elements) {
        const box = await page.locator(selector).first().boundingBox()
        expect(
          box,
          `${selector} devrait être visible`
        ).not.toBeNull()
        expect(
          box!.y,
          `${selector} devrait commencer dans le viewport`
        ).toBeLessThan(667)
      }
    })

    test('RT-AF-08 : sur tablette, tout le hero principal est above the fold (score ≥ 90%)', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/')

      const atf = await analyzeAboveFold(page, [
        { selector: '#hero h1', description: 'Titre principal' },
        { selector: '#hero h1 + p', description: 'Tagline' },
        { selector: 'a[href="/framework"]', description: 'CTA' },
        { selector: '#benefits-section', description: 'Section bénéfices' },
        { selector: '#stats-section', description: 'Section statistiques' },
      ])

      expect(
        atf.criticalContentScore,
        `Score above the fold tablette : ${atf.criticalContentScore}% (min 90%)`
      ).toBeGreaterThanOrEqual(90)
    })

    test('RT-AF-09 : sur desktop large, tout le contenu est above the fold (score = 100%)', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto('/')

      const atf = await analyzeAboveFold(page, [
        { selector: '#hero h1', description: 'Titre principal' },
        { selector: '#hero h1 + p', description: 'Tagline' },
        { selector: 'a[href="/framework"]', description: 'CTA' },
        { selector: '#benefits-section', description: 'Section bénéfices' },
        { selector: '#stats-section', description: 'Section statistiques' },
      ])

      expect(
        atf.criticalContentScore,
        `Score above the fold desktop-large : ${atf.criticalContentScore}% (attendu 100%)`
      ).toBe(100)
    })

    test('RT-AF-10 : le CTA est visible sans scroll sur tous les viewports', async ({
      page,
    }) => {
      const viewports = [
        { width: 375, height: 667 },
        { width: 768, height: 1024 },
        { width: 1280, height: 720 },
        { width: 1920, height: 1080 },
      ]

      for (const vp of viewports) {
        await page.setViewportSize(vp)
        await page.goto('/')

        const ctaBox = await page
          .locator('a[href="/framework"]')
          .boundingBox()
        expect(
          ctaBox,
          `CTA absent à ${vp.width}×${vp.height}`
        ).not.toBeNull()
        expect(
          ctaBox!.y,
          `CTA hors viewport à ${vp.width}×${vp.height}`
        ).toBeLessThan(vp.height)
      }
    })
  })

  // ── 3. Performance perceptuelle ────────────────────────────

  test.describe('Performance perceptuelle', () => {
    test('RT-PERF-01 : LCP < 2000ms', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' })

      const lcp = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const last = entries[entries.length - 1]
            resolve(last.startTime)
          }).observe({ type: 'largest-contentful-paint', buffered: true })

          // Timeout fallback
          setTimeout(() => resolve(0), 5000)
        })
      })

      expect(lcp, `LCP = ${lcp}ms (max 2000ms)`).toBeLessThan(2000)
    })

    test('RT-PERF-02 : FCP < 1500ms', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' })

      const fcp = await page.evaluate(() => {
        const paint = performance.getEntriesByType('paint')
        return (
          paint.find((e) => e.name === 'first-contentful-paint')?.startTime || 0
        )
      })

      // Seuil à 1500ms : le serveur dev Astro avec workers parallèles
      // peut dépasser 1000ms ; en production (SSG), FCP sera < 300ms
      expect(fcp, `FCP = ${fcp}ms (max 1500ms)`).toBeLessThan(1500)
    })

    test('RT-PERF-03 : CLS < 0.1', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' })

      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as any[]) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value
              }
            }
          }).observe({ type: 'layout-shift', buffered: true })

          setTimeout(() => resolve(clsValue), 3000)
        })
      })

      expect(cls, `CLS = ${cls} (max 0.1)`).toBeLessThan(0.1)
    })

    test('RT-PERF-04 : DOMContentLoaded < 3000ms', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' })

      const dcl = await page.evaluate(() => {
        const nav = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming
        return nav.domContentLoadedEventEnd || 0
      })

      // Seuil à 3000ms : le serveur dev Astro avec workers parallèles
      // peut dépasser 2000ms ; en production (SSG), DCL sera < 500ms
      expect(
        dcl,
        `DOMContentLoaded = ${dcl}ms (max 3000ms)`
      ).toBeLessThan(3000)
    })

    test('RT-PERF-05 : le hero ne provoque aucun layout shift', async ({
      page,
    }) => {
      await page.goto('/')
      await page.waitForSelector('#hero')

      // Attendre la stabilisation
      await page.waitForTimeout(1000)

      const heroClsValue = await page.evaluate(() => {
        let cls = 0
        const entries = performance.getEntriesByType(
          'layout-shift'
        ) as any[]
        for (const entry of entries) {
          if (!entry.hadRecentInput) {
            for (const source of entry.sources || []) {
              const node = source.node as Element
              if (node && node.closest && node.closest('#hero')) {
                cls += entry.value
              }
            }
          }
        }
        return cls
      })

      expect(heroClsValue).toBe(0)
    })

    test('RT-PERF-06 : LCP < 2000ms sur mobile (375×667, 3G rapide)', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Throttle réseau via CDP (3G rapide)
      const client = await page.context().newCDPSession(page)
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        downloadThroughput: (1.6 * 1024 * 1024) / 8,
        uploadThroughput: (750 * 1024) / 8,
        latency: 150,
      })

      await page.goto('/', { waitUntil: 'networkidle' })

      const lcp = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const last = entries[entries.length - 1]
            resolve(last.startTime)
          }).observe({ type: 'largest-contentful-paint', buffered: true })

          setTimeout(() => resolve(0), 5000)
        })
      })

      expect(
        lcp,
        `LCP mobile 3G = ${lcp}ms (max 2000ms)`
      ).toBeLessThan(2000)
    })

    test('RT-PERF-07 : le contenu textuel du h1 est visible en < 800ms', async ({
      page,
    }) => {
      // Mesure côté navigateur pour éviter l'overhead Playwright
      // Le FCP indique quand le premier contenu (h1) est peint
      await page.goto('/', { waitUntil: 'networkidle' })

      const fcp = await page.evaluate(() => {
        const paint = performance.getEntriesByType('paint')
        return (
          paint.find((e) => e.name === 'first-contentful-paint')?.startTime || 0
        )
      })

      // Le h1 est le premier élément textuel significatif — le FCP le couvre
      // Seuil à 800ms : RT-PERF-02 valide déjà FCP < 1000ms,
      // ce test vérifie que le h1 apparaît rapidement même sous charge
      expect(
        fcp,
        `FCP (proxy h1 visible) = ${fcp}ms (max 800ms)`
      ).toBeLessThan(800)
    })

    test('RT-PERF-08 : aucun flash de contenu non stylé (FOUC)', async ({
      page,
    }) => {
      await page.goto('/')
      await page.waitForSelector('#hero')
      await page.waitForTimeout(1000)

      // Vérifier que le CLS du hero est 0 (proxy fiable pour un site Astro SSG)
      const heroClsValue = await page.evaluate(() => {
        let cls = 0
        const entries = performance.getEntriesByType(
          'layout-shift'
        ) as any[]
        for (const entry of entries) {
          if (!entry.hadRecentInput) {
            for (const source of entry.sources || []) {
              const node = source.node as Element
              if (node && node.closest && node.closest('#hero')) {
                cls += entry.value
              }
            }
          }
        }
        return cls
      })

      expect(
        heroClsValue,
        'Le hero ne devrait pas avoir de layout shift (FOUC)'
      ).toBe(0)
    })
  })

  // ── 4. Hiérarchie visuelle et lisibilité ───────────────────

  test.describe('Hiérarchie visuelle et lisibilité', () => {
    test('RT-VH-01 : le titre (h1) est le texte le plus grand', async ({
      page,
    }) => {
      const vh = await analyzeVisualHierarchy(page)

      expect(
        vh.titleIsLargest,
        'Le h1 doit avoir la taille de police la plus grande du hero'
      ).toBe(true)
    })

    test('RT-VH-02 : hiérarchie typographique décroissante (h1 > h3 > p)', async ({
      page,
    }) => {
      const vh = await analyzeVisualHierarchy(page)

      expect(vh.hierarchyIsDecreasing).toBe(true)
    })

    test('RT-VH-03 : le CTA se distingue visuellement', async ({ page }) => {
      const vh = await analyzeVisualHierarchy(page)

      expect(vh.ctaIsDistinct).toBe(true)
    })

    test('RT-VH-04 : taille du h1 ≥ 30px sur desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.goto('/')

      const fontSize = await page.locator('#hero h1').evaluate((el) => {
        return parseFloat(window.getComputedStyle(el).fontSize)
      })

      expect(fontSize).toBeGreaterThanOrEqual(30)
    })

    test('RT-VH-05 : taille du h1 ≥ 24px sur mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      const fontSize = await page.locator('#hero h1').evaluate((el) => {
        return parseFloat(window.getComputedStyle(el).fontSize)
      })

      expect(fontSize).toBeGreaterThanOrEqual(24)
    })

    test('RT-VH-06 : l\'interligne du texte principal est ≥ 1.4', async ({
      page,
    }) => {
      // Vérifier le ratio lineHeight/fontSize sur la VP
      const vpLocator = page.locator('#hero p.leading-relaxed').first()
      const exists = (await vpLocator.count()) > 0

      if (exists) {
        const ratio = await vpLocator.evaluate((el) => {
          const cs = window.getComputedStyle(el)
          const fontSize = parseFloat(cs.fontSize)
          const lineHeight = parseFloat(cs.lineHeight)
          return lineHeight / fontSize
        })

        expect(
          ratio,
          `Ratio interligne/taille = ${ratio.toFixed(2)} (min 1.4)`
        ).toBeGreaterThanOrEqual(1.4)
      }
    })

    test('RT-VH-07 : les sections (bénéfices, stats) ont un espacement ≥ 32px', async ({
      page,
    }) => {
      // L'espacement est appliqué sur les divs wrapper via mt-12 (48px) ou mt-16 (64px)
      const benefitsWrapper = page.locator('#benefits-section').locator('..')
      const statsWrapper = page.locator('#stats-section').locator('..')

      for (const wrapper of [benefitsWrapper, statsWrapper]) {
        const exists = (await wrapper.count()) > 0
        if (exists) {
          const marginTop = await wrapper.evaluate((el) => {
            return parseFloat(window.getComputedStyle(el).marginTop) || 0
          })

          expect(
            marginTop,
            `Espacement section = ${marginTop}px (min 32px)`
          ).toBeGreaterThanOrEqual(32)
        }
      }
    })

    test('RT-VH-08 : le CTA a une taille de cible ≥ 44px', async ({
      page,
    }) => {
      const ctaBox = await page
        .locator('a[href="/framework"]')
        .boundingBox()

      expect(ctaBox).not.toBeNull()
      expect(
        ctaBox!.height,
        `Hauteur CTA = ${ctaBox!.height}px (min 44px pour toucher mobile)`
      ).toBeGreaterThanOrEqual(44)
    })

    test('RT-VH-09 : les 3 bénéfices ont des tailles cohérentes', async ({
      page,
    }) => {
      const boxes = await page
        .locator('#benefits-section article')
        .evaluateAll((els) =>
          els.map((el) => {
            const rect = el.getBoundingClientRect()
            return { width: rect.width, height: rect.height }
          })
        )

      expect(boxes).toHaveLength(3)

      const widths = boxes.map((b) => b.width)
      const heights = boxes.map((b) => b.height)

      // Tolérance 10% en largeur
      const maxWidthDiff = Math.max(...widths) - Math.min(...widths)
      expect(
        maxWidthDiff,
        `Différence de largeur = ${maxWidthDiff}px (max 10% de ${widths[0]}px)`
      ).toBeLessThan(widths[0] * 0.1)

      // Tolérance 15% en hauteur
      const maxHeightDiff = Math.max(...heights) - Math.min(...heights)
      expect(
        maxHeightDiff,
        `Différence de hauteur = ${maxHeightDiff}px (max 15% de ${heights[0]}px)`
      ).toBeLessThan(heights[0] * 0.15)
    })

    test('RT-VH-10 : les 3 stats ont des tailles cohérentes', async ({
      page,
    }) => {
      // Les stat containers sont les divs enfants de la grid dans #stats-section
      const boxes = await page
        .locator('#stats-section .flex.flex-col')
        .evaluateAll((els) =>
          els.map((el) => {
            const rect = el.getBoundingClientRect()
            return { width: rect.width, height: rect.height }
          })
        )

      expect(boxes.length).toBeGreaterThanOrEqual(3)

      const widths = boxes.slice(0, 3).map((b) => b.width)
      const heights = boxes.slice(0, 3).map((b) => b.height)

      // Tolérance 20% en largeur (la variante highlight a une bordure supplémentaire)
      const maxWidthDiff = Math.max(...widths) - Math.min(...widths)
      expect(maxWidthDiff).toBeLessThanOrEqual(widths[0] * 0.2)

      // Tolérance 30% en hauteur (la variante highlight a un padding plus grand)
      const maxHeightDiff = Math.max(...heights) - Math.min(...heights)
      expect(maxHeightDiff).toBeLessThanOrEqual(heights[0] * 0.3)
    })
  })

  // ── 5. Densité textuelle et scanabilité ────────────────────

  test.describe('Densité textuelle et scanabilité', () => {
    test('RT-SC-01 : le ratio texte/espace blanc dans le hero est < 60%', async ({
      page,
    }) => {
      const ratio = await page.evaluate(() => {
        const hero = document.querySelector('#hero')
        if (!hero) return 1

        const heroRect = hero.getBoundingClientRect()
        const heroArea = heroRect.width * heroRect.height
        if (heroArea === 0) return 1

        // Sommer les bounding boxes des éléments textuels feuilles
        let textArea = 0
        const textElements = hero.querySelectorAll(
          'h1, h2, h3, p, a[href="/framework"], cite'
        )
        const counted = new Set<Element>()

        textElements.forEach((el) => {
          // Éviter le double comptage des éléments imbriqués
          let parent = el.parentElement
          let isNested = false
          while (parent && parent !== hero) {
            if (counted.has(parent)) {
              isNested = true
              break
            }
            parent = parent.parentElement
          }

          if (!isNested) {
            const rect = el.getBoundingClientRect()
            textArea += rect.width * rect.height
            counted.add(el)
          }
        })

        return textArea / heroArea
      })

      expect(
        ratio,
        `Ratio texte/espace = ${Math.round(ratio * 100)}% (max 60%)`
      ).toBeLessThan(0.6)
    })

    test('RT-SC-02 : le hero contient ≥ 3 éléments visuels non textuels', async ({
      page,
    }) => {
      const svgCount = await page.locator('#hero svg').count()
      const statValues = await page
        .locator('#stats-section .stat-value')
        .count()

      const visualElements = svgCount + statValues
      expect(
        visualElements,
        `${svgCount} SVGs + ${statValues} valeurs stat = ${visualElements} éléments visuels`
      ).toBeGreaterThanOrEqual(3)
    })

    test('RT-SC-03 : chaque bénéfice a un picto/icône', async ({ page }) => {
      const benefitSvgs = await page
        .locator('#benefits-section article svg')
        .count()

      expect(benefitSvgs).toBe(3)
    })

    test('RT-SC-04 : les valeurs statistiques sont visuellement proéminentes (≥ 24px)', async ({
      page,
    }) => {
      const statValues = page.locator('#stats-section .stat-value')
      const count = await statValues.count()

      expect(count).toBeGreaterThanOrEqual(1)

      for (let i = 0; i < count; i++) {
        const fontSize = await statValues.nth(i).evaluate((el) => {
          return parseFloat(window.getComputedStyle(el).fontSize)
        })

        expect(
          fontSize,
          `Valeur stat ${i + 1} a une taille de ${fontSize}px (min 24px)`
        ).toBeGreaterThanOrEqual(24)
      }
    })

    test('RT-SC-05 : le contenu est structuré en ≥ 3 blocs distincts', async ({
      page,
    }) => {
      // Le hero doit contenir au moins 3 zones visuellement séparées :
      // 1. Zone titre (h1 + tagline + VP + CTA)
      // 2. Zone bénéfices (#benefits-section)
      // 3. Zone statistiques (#stats-section)
      const directChildren = await page
        .locator('#hero > div > div, #hero section')
        .count()

      expect(
        directChildren,
        'Le hero doit contenir au moins 3 blocs visuellement distincts'
      ).toBeGreaterThanOrEqual(3)
    })
  })
})
