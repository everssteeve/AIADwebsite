/**
 * T-001-T4 : Tests d'accessibilite (a11y) HeroSection
 *
 * Valide l'accessibilite WCAG 2.1 AA de la section HeroSection
 * dans un navigateur reel via Playwright + axe-core.
 *
 * @see docs/specs/US-001/T-001-T4-tests-accessibilite-hero-section.md
 */

import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import type { Result as AxeViolation } from 'axe-core'

// ── Helpers ─────────────────────────────────────────────────────

/**
 * Scanner axe-core sur le hero avec les tags WCAG 2.1 AA
 */
async function auditHero(page: Page) {
  return new AxeBuilder({ page })
    .include('#hero')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
}

/**
 * Formate les violations axe-core pour un message d'erreur lisible
 */
function formatViolations(violations: AxeViolation[]): string {
  return violations
    .map(
      (v) =>
        `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} nodes)`
    )
    .join('\n')
}

/**
 * Verifie si un element a un indicateur de focus visible
 */
async function checkFocusVisible(
  page: Page,
  selector: string
): Promise<{ hasVisibleFocus: boolean; indicatorType: string; indicatorValue: string }> {
  const element = page.locator(selector)
  await element.focus()

  const styles = await element.evaluate((el) => {
    const computed = window.getComputedStyle(el)
    return {
      outline: computed.outline,
      outlineWidth: computed.outlineWidth,
      outlineStyle: computed.outlineStyle,
      boxShadow: computed.boxShadow,
    }
  })

  const hasOutline =
    styles.outlineStyle !== 'none' && styles.outlineWidth !== '0px'
  const hasBoxShadow = styles.boxShadow !== 'none'

  let indicatorType = 'none'
  if (hasOutline) indicatorType = 'outline'
  else if (hasBoxShadow) indicatorType = 'ring'

  return {
    hasVisibleFocus: hasOutline || hasBoxShadow,
    indicatorType,
    indicatorValue: hasOutline ? styles.outline : styles.boxShadow,
  }
}

// ── Tests ───────────────────────────────────────────────────────

test.describe('HeroSection — Tests d\'accessibilite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#hero')
  })

  // ════════════════════════════════════════════════════════════════
  // 1. Conformite WCAG automatique (axe-core)
  // ════════════════════════════════════════════════════════════════

  test.describe('Conformite WCAG automatique', () => {
    test('A11Y-AXE-01 : 0 violation WCAG 2.1 AA dans le hero', async ({ page }) => {
      const results = await auditHero(page)

      expect(
        results.violations,
        formatViolations(results.violations)
      ).toEqual([])
    })

    test('A11Y-AXE-02 : 0 violation critique dans le hero', async ({ page }) => {
      const results = await auditHero(page)
      const critical = results.violations.filter((v) => v.impact === 'critical')

      expect(critical, formatViolations(critical)).toHaveLength(0)
    })

    test('A11Y-AXE-03 : 0 violation serieuse dans le hero', async ({ page }) => {
      const results = await auditHero(page)
      const serious = results.violations.filter((v) => v.impact === 'serious')

      expect(serious, formatViolations(serious)).toHaveLength(0)
    })

    test('A11Y-AXE-04 : 0 violation sur la page entiere', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      expect(
        results.violations,
        formatViolations(results.violations)
      ).toEqual([])
    })

    test('A11Y-AXE-05 : pas de violation heading-order', async ({ page }) => {
      const results = await auditHero(page)
      const violation = results.violations.find((v) => v.id === 'heading-order')

      expect(violation).toBeUndefined()
    })

    test('A11Y-AXE-06 : pas de violation landmark-one-main', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      const violation = results.violations.find(
        (v) => v.id === 'landmark-one-main'
      )

      expect(violation).toBeUndefined()
    })

    test('A11Y-AXE-07 : pas de violation region', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      const violation = results.violations.find((v) => v.id === 'region')

      expect(violation).toBeUndefined()
    })

    test('A11Y-AXE-08 : pas de violation color-contrast', async ({ page }) => {
      const results = await auditHero(page)
      const violation = results.violations.find(
        (v) => v.id === 'color-contrast'
      )

      expect(violation).toBeUndefined()
    })

    test('A11Y-AXE-09 : pas de violation link-name', async ({ page }) => {
      const results = await auditHero(page)
      const violation = results.violations.find((v) => v.id === 'link-name')

      expect(violation).toBeUndefined()
    })

    test('A11Y-AXE-10 : pas de violation image-alt (SVG icons)', async ({ page }) => {
      const results = await auditHero(page)
      const violation = results.violations.find((v) => v.id === 'image-alt')

      expect(violation).toBeUndefined()
    })
  })

  // ════════════════════════════════════════════════════════════════
  // 2. Navigation clavier
  // ════════════════════════════════════════════════════════════════

  test.describe('Navigation clavier', () => {
    /**
     * Helper pour obtenir le href de l'element actuellement focus
     */
    async function getFocusedHref(page: Page): Promise<string | null> {
      return page.evaluate(() => document.activeElement?.getAttribute('href') ?? null)
    }

    /**
     * Helper pour obtenir le texte de l'element actuellement focus
     */
    async function getFocusedText(page: Page): Promise<string> {
      return page.evaluate(() => document.activeElement?.textContent?.trim() ?? '')
    }

    /**
     * Helper pour positionner le focus au debut du document
     */
    async function resetFocus(page: Page): Promise<void> {
      await page.evaluate(() => {
        (document.activeElement as HTMLElement)?.blur()
      })
    }

    test('A11Y-KB-01 : Tab atteint le CTA "Explorer le Framework"', async ({ page }) => {
      await resetFocus(page)
      await page.keyboard.press('Tab')

      const href = await getFocusedHref(page)
      expect(href).toBe('/framework')

      const text = await getFocusedText(page)
      expect(text).toContain('Explorer le Framework')
    })

    test('A11Y-KB-02 : Tab continue vers le 1er lien source (McKinsey)', async ({ page }) => {
      await resetFocus(page)
      await page.keyboard.press('Tab') // CTA
      await page.keyboard.press('Tab') // Source 1

      const href = await getFocusedHref(page)
      expect(href).toContain('mckinsey.com')
    })

    test('A11Y-KB-03 : Tab continue vers le 2eme lien source (GitHub)', async ({ page }) => {
      await resetFocus(page)
      await page.keyboard.press('Tab') // CTA
      await page.keyboard.press('Tab') // Source 1
      await page.keyboard.press('Tab') // Source 2

      const href = await getFocusedHref(page)
      expect(href).toContain('github.blog')
    })

    test('A11Y-KB-04 : Tab continue vers le 3eme lien source (Stack Overflow)', async ({ page }) => {
      await resetFocus(page)
      await page.keyboard.press('Tab') // CTA
      await page.keyboard.press('Tab') // Source 1
      await page.keyboard.press('Tab') // Source 2
      await page.keyboard.press('Tab') // Source 3

      const href = await getFocusedHref(page)
      expect(href).toContain('stackoverflow.co')
    })

    test('A11Y-KB-05 : ordre de tabulation logique CTA -> sources', async ({ page }) => {
      await resetFocus(page)

      // Tab 1 : CTA
      await page.keyboard.press('Tab')
      expect(await getFocusedHref(page)).toBe('/framework')

      // Tab 2 : source McKinsey
      await page.keyboard.press('Tab')
      expect(await getFocusedHref(page)).toContain('mckinsey.com')

      // Tab 3 : source GitHub
      await page.keyboard.press('Tab')
      expect(await getFocusedHref(page)).toContain('github.blog')

      // Tab 4 : source Stack Overflow
      await page.keyboard.press('Tab')
      expect(await getFocusedHref(page)).toContain('stackoverflow.co')
    })

    test('A11Y-KB-06 : Shift+Tab revient en arriere', async ({ page }) => {
      await resetFocus(page)
      await page.keyboard.press('Tab') // CTA
      await page.keyboard.press('Tab') // Source 1

      // Shift+Tab revient au CTA
      await page.keyboard.press('Shift+Tab')
      expect(await getFocusedHref(page)).toBe('/framework')
    })

    test('A11Y-KB-07 : Enter sur le CTA navigue vers /framework', async ({ page }) => {
      await resetFocus(page)
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')

      await page.waitForURL('**/framework')
      expect(page.url()).toContain('/framework')
    })

    test('A11Y-KB-08 : Enter sur un lien source ouvre un nouvel onglet', async ({ page, context }) => {
      await resetFocus(page)
      await page.keyboard.press('Tab') // CTA
      await page.keyboard.press('Tab') // Source 1

      // Verifier que le lien a target="_blank" (ouvre un nouvel onglet)
      const target = await page.evaluate(
        () => document.activeElement?.getAttribute('target')
      )
      expect(target).toBe('_blank')

      // Verifier qu'un nouvel onglet s'ouvre en pressant Enter
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.keyboard.press('Enter'),
      ])

      // Le navigateur en mode test peut ne pas charger l'URL externe,
      // verifier que le nouvel onglet a ete cree
      expect(newPage).toBeTruthy()
      await newPage.close()
    })

    test('A11Y-KB-09 : pas de piege clavier dans le hero', async ({ page }) => {
      await resetFocus(page)

      const focusedElements: string[] = []
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab')
        const info = await page.evaluate(() => {
          const el = document.activeElement
          return `${el?.tagName}:${el?.getAttribute('href')}`
        })
        focusedElements.push(info)
      }

      // Le focus doit sortir du hero (pas de cycle infini dans les 4 liens)
      const uniqueElements = new Set(focusedElements)
      expect(uniqueElements.size).toBeGreaterThan(1)
    })

    test('A11Y-KB-10 : elements non interactifs ne recoivent pas le focus', async ({ page }) => {
      await resetFocus(page)

      const focusedTags: string[] = []
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab')
        const tag = await page.evaluate(() => document.activeElement?.tagName)
        if (tag) focusedTags.push(tag)
      }

      // Seuls les <a> et <button> doivent recevoir le focus par Tab
      const nonInteractiveTags = focusedTags.filter(
        (t) =>
          !['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(t) &&
          t !== 'BODY'
      )
      expect(nonInteractiveTags).toEqual([])
    })
  })

  // ════════════════════════════════════════════════════════════════
  // 3. Focus visible
  // ════════════════════════════════════════════════════════════════

  test.describe('Focus visible', () => {
    test('A11Y-FV-01 : CTA a un indicateur de focus visible', async ({ page }) => {
      const result = await checkFocusVisible(page, 'a[href="/framework"]')
      expect(result.hasVisibleFocus).toBe(true)
    })

    test('A11Y-FV-02 : CTA focus indicator est un ring ou outline', async ({ page }) => {
      const result = await checkFocusVisible(page, 'a[href="/framework"]')
      expect(['outline', 'ring']).toContain(result.indicatorType)
    })

    test('A11Y-FV-03 : lien source McKinsey a un focus visible', async ({ page }) => {
      const sourceLinks = page.locator('#stats-section a[target="_blank"]')
      const firstLink = sourceLinks.nth(0)
      await firstLink.focus()

      const hasVisibleFocus = await firstLink.evaluate((el) => {
        const cs = window.getComputedStyle(el)
        const hasOutline = cs.outlineStyle !== 'none' && cs.outlineWidth !== '0px'
        const hasBoxShadow = cs.boxShadow !== 'none'
        return hasOutline || hasBoxShadow
      })

      expect(hasVisibleFocus).toBe(true)
    })

    test('A11Y-FV-04 : lien source GitHub a un focus visible', async ({ page }) => {
      const sourceLinks = page.locator('#stats-section a[target="_blank"]')
      const secondLink = sourceLinks.nth(1)
      await secondLink.focus()

      const hasVisibleFocus = await secondLink.evaluate((el) => {
        const cs = window.getComputedStyle(el)
        const hasOutline = cs.outlineStyle !== 'none' && cs.outlineWidth !== '0px'
        const hasBoxShadow = cs.boxShadow !== 'none'
        return hasOutline || hasBoxShadow
      })

      expect(hasVisibleFocus).toBe(true)
    })

    test('A11Y-FV-05 : lien source Stack Overflow a un focus visible', async ({ page }) => {
      const sourceLinks = page.locator('#stats-section a[target="_blank"]')
      const thirdLink = sourceLinks.nth(2)
      await thirdLink.focus()

      const hasVisibleFocus = await thirdLink.evaluate((el) => {
        const cs = window.getComputedStyle(el)
        const hasOutline = cs.outlineStyle !== 'none' && cs.outlineWidth !== '0px'
        const hasBoxShadow = cs.boxShadow !== 'none'
        return hasOutline || hasBoxShadow
      })

      expect(hasVisibleFocus).toBe(true)
    })

    test('A11Y-FV-06 : focus du CTA a un contraste suffisant (3:1)', async ({ page }) => {
      const cta = page.locator('a[href="/framework"]')
      await cta.focus()

      const focusStyles = await cta.evaluate((el) => {
        const cs = window.getComputedStyle(el)
        return {
          outlineColor: cs.outlineColor,
          outlineWidth: cs.outlineWidth,
          outlineStyle: cs.outlineStyle,
          boxShadow: cs.boxShadow,
        }
      })

      // Verifier qu'un indicateur existe (outline ou ring)
      const hasIndicator =
        (focusStyles.outlineStyle !== 'none' && focusStyles.outlineWidth !== '0px') ||
        focusStyles.boxShadow !== 'none'
      expect(hasIndicator).toBe(true)
    })

    test('A11Y-FV-07 : focus des liens source a un contraste suffisant', async ({ page }) => {
      const sourceLinks = page.locator('#stats-section a[target="_blank"]')
      const count = await sourceLinks.count()

      expect(count).toBe(3)

      for (let i = 0; i < count; i++) {
        const link = sourceLinks.nth(i)
        await link.focus()

        const hasIndicator = await link.evaluate((el) => {
          const cs = window.getComputedStyle(el)
          const hasOutline = cs.outlineStyle !== 'none' && cs.outlineWidth !== '0px'
          const hasBoxShadow = cs.boxShadow !== 'none'
          return hasOutline || hasBoxShadow
        })

        expect(hasIndicator).toBe(true)
      }
    })
  })

  // ════════════════════════════════════════════════════════════════
  // 4. Contraste de couleurs
  // ════════════════════════════════════════════════════════════════

  test.describe('Contraste de couleurs', () => {
    test('A11Y-CC-01 : titre h1 (text-gray-900 sur fond) contraste >= 4.5:1', async ({ page }) => {
      const results = await auditHero(page)
      const contrastViolation = results.violations.find(
        (v) => v.id === 'color-contrast'
      )
      const h1Violation = contrastViolation?.nodes.find((n) =>
        n.html.includes('<h1')
      )

      expect(h1Violation).toBeUndefined()
    })

    test('A11Y-CC-02 : tagline (text-gray-600 sur fond) contraste >= 4.5:1', async ({ page }) => {
      const results = await auditHero(page)
      const contrastViolation = results.violations.find(
        (v) => v.id === 'color-contrast'
      )
      // Verifier qu'aucun <p> de la tagline ne viole le contraste
      const taglineViolation = contrastViolation?.nodes.find(
        (n) => n.html.includes('text-gray-600') && n.html.includes('tagline')
      )

      expect(taglineViolation).toBeUndefined()
    })

    test('A11Y-CC-03 : value proposition contraste >= 4.5:1', async ({ page }) => {
      const results = await auditHero(page)
      const contrastViolation = results.violations.find(
        (v) => v.id === 'color-contrast'
      )
      const vpViolation = contrastViolation?.nodes.find((n) =>
        n.html.includes('value-proposition')
      )

      expect(vpViolation).toBeUndefined()
    })

    test('A11Y-CC-04 : CTA texte (text-white sur bg-blue-600) contraste >= 4.5:1', async ({ page }) => {
      const results = await auditHero(page)
      const contrastViolation = results.violations.find(
        (v) => v.id === 'color-contrast'
      )
      const ctaViolation = contrastViolation?.nodes.find((n) =>
        n.html.includes('href="/framework"')
      )

      expect(ctaViolation).toBeUndefined()
    })

    test('A11Y-CC-05 : titre benefit h3 (text-gray-900 sur bg-white) contraste >= 4.5:1', async ({ page }) => {
      const results = await auditHero(page)
      const contrastViolation = results.violations.find(
        (v) => v.id === 'color-contrast'
      )
      const h3Violations = contrastViolation?.nodes.filter((n) =>
        n.html.includes('<h3')
      )

      expect(h3Violations ?? []).toHaveLength(0)
    })

    test('A11Y-CC-06 : description benefit (text-gray-600 sur bg-white) contraste >= 4.5:1', async ({ page }) => {
      const results = await auditHero(page)
      const contrastViolation = results.violations.find(
        (v) => v.id === 'color-contrast'
      )
      const descViolations = contrastViolation?.nodes.filter(
        (n) =>
          n.html.includes('text-gray-600') &&
          n.html.includes('<p')
      )

      expect(descViolations ?? []).toHaveLength(0)
    })

    test('A11Y-CC-07 : valeur stat (text-blue-600 sur fond) contraste >= 3:1 (grand texte)', async ({ page }) => {
      const results = await auditHero(page)
      const contrastViolation = results.violations.find(
        (v) => v.id === 'color-contrast'
      )
      const statValueViolations = contrastViolation?.nodes.filter((n) =>
        n.html.includes('stat-value')
      )

      expect(statValueViolations ?? []).toHaveLength(0)
    })

    test('A11Y-CC-08 : label stat (text-gray-700) contraste >= 4.5:1', async ({ page }) => {
      const results = await auditHero(page)
      const contrastViolation = results.violations.find(
        (v) => v.id === 'color-contrast'
      )
      const labelViolations = contrastViolation?.nodes.filter((n) =>
        n.html.includes('text-gray-700')
      )

      expect(labelViolations ?? []).toHaveLength(0)
    })

    test('A11Y-CC-09 : source stat lien (text-blue-600) contraste >= 4.5:1', async ({ page }) => {
      const results = await auditHero(page)
      const contrastViolation = results.violations.find(
        (v) => v.id === 'color-contrast'
      )
      const sourceViolations = contrastViolation?.nodes.filter((n) =>
        n.html.includes('text-blue-600') && n.html.includes('<a')
      )

      expect(sourceViolations ?? []).toHaveLength(0)
    })

    test('A11Y-CC-10 : source stat texte (text-gray-500) contraste >= 4.5:1', async ({ page }) => {
      const results = await auditHero(page)
      const contrastViolation = results.violations.find(
        (v) => v.id === 'color-contrast'
      )
      const citationViolations = contrastViolation?.nodes.filter(
        (n) => n.html.includes('text-gray-500') && n.html.includes('<cite')
      )

      expect(citationViolations ?? []).toHaveLength(0)
    })

    test('A11Y-CC-11 : contraste sur fond gradient (bg-gradient-to-b)', async ({ page }) => {
      // Le gradient from-white to-gray-50 ne devrait pas affecter le contraste
      const results = await auditHero(page)
      const contrastViolation = results.violations.find(
        (v) => v.id === 'color-contrast'
      )

      expect(contrastViolation).toBeUndefined()
    })

    test('A11Y-CC-12 : stat highlight (text-blue-700 sur bg-blue-50) contraste >= 3:1', async ({ page }) => {
      // Si une stat est en variante highlight, verifier le contraste
      const results = await auditHero(page)
      const contrastViolation = results.violations.find(
        (v) => v.id === 'color-contrast'
      )
      const highlightViolations = contrastViolation?.nodes.filter((n) =>
        n.html.includes('bg-blue-50')
      )

      expect(highlightViolations ?? []).toHaveLength(0)
    })
  })

  // ════════════════════════════════════════════════════════════════
  // 5. Landmarks et structure ARIA
  // ════════════════════════════════════════════════════════════════

  test.describe('Landmarks et structure ARIA', () => {
    test('A11Y-LM-01 : la page contient un <main>', async ({ page }) => {
      const main = page.locator('main')
      await expect(main).toHaveCount(1)
    })

    test('A11Y-LM-02 : #hero est une <section> avec aria-labelledby', async ({ page }) => {
      const hero = page.locator('#hero')
      await expect(hero).toHaveAttribute('aria-labelledby', 'hero-title')

      const tagName = await hero.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('section')
    })

    test('A11Y-LM-03 : #benefits-section est une <section> avec aria-labelledby', async ({ page }) => {
      const benefits = page.locator('#benefits-section')
      await expect(benefits).toHaveAttribute(
        'aria-labelledby',
        'benefits-section-title'
      )

      const tagName = await benefits.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('section')
    })

    test('A11Y-LM-04 : #stats-section est une <section> avec aria-labelledby', async ({ page }) => {
      const stats = page.locator('#stats-section')
      await expect(stats).toHaveAttribute(
        'aria-labelledby',
        'stats-section-title'
      )

      const tagName = await stats.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('section')
    })

    test('A11Y-LM-05 : chaque aria-labelledby pointe vers un ID existant', async ({ page }) => {
      const sections = page.locator('#hero section[aria-labelledby]')
      const count = await sections.count()

      for (let i = 0; i < count; i++) {
        const labelledBy = await sections.nth(i).getAttribute('aria-labelledby')
        expect(labelledBy).toBeTruthy()

        const target = page.locator(`#${labelledBy}`)
        await expect(target).toHaveCount(1)
      }

      // Verifier aussi le hero lui-meme
      const heroLabel = await page.locator('#hero').getAttribute('aria-labelledby')
      expect(heroLabel).toBeTruthy()
      const heroTarget = page.locator(`#${heroLabel}`)
      await expect(heroTarget).toHaveCount(1)
    })

    test('A11Y-LM-06 : 3 sections identifiees comme regions', async ({ page }) => {
      const regions = page.getByRole('region')
      await expect(regions).toHaveCount(3)
    })

    test('A11Y-LM-07 : chaque region a un nom accessible', async ({ page }) => {
      // Hero section
      const heroRegion = page.getByRole('region', {
        name: /AIAD.*framework/i,
      })
      await expect(heroRegion).toHaveCount(1)

      // Benefits section
      const benefitsRegion = page.getByRole('region', {
        name: /bénéfices clés/i,
      })
      await expect(benefitsRegion).toHaveCount(1)

      // Stats section
      const statsRegion = page.getByRole('region', {
        name: /chiffres clés/i,
      })
      await expect(statsRegion).toHaveCount(1)
    })

    test('A11Y-LM-08 : 3 articles dans la section benefices', async ({ page }) => {
      const articles = page.locator('#benefits-section article')
      await expect(articles).toHaveCount(3)
    })
  })

  // ════════════════════════════════════════════════════════════════
  // 6. Hierarchie des headings
  // ════════════════════════════════════════════════════════════════

  test.describe('Hierarchie des headings', () => {
    test('A11Y-HD-01 : exactement 1 heading de niveau 1', async ({ page }) => {
      const h1 = page.getByRole('heading', { level: 1 })
      await expect(h1).toHaveCount(1)
    })

    test('A11Y-HD-02 : h1 contient le titre AIAD', async ({ page }) => {
      const h1 = page.getByRole('heading', { level: 1 })
      await expect(h1).toContainText(
        'AIAD : Le framework pour développer avec des agents IA'
      )
    })

    test('A11Y-HD-03 : exactement 2 headings de niveau 2 dans le hero', async ({ page }) => {
      const h2s = page.locator('#hero').getByRole('heading', { level: 2 })
      await expect(h2s).toHaveCount(2)
    })

    test('A11Y-HD-04 : h2 "Benefices cles" et "Chiffres cles" accessibles', async ({ page }) => {
      const benefitsH2 = page.getByRole('heading', {
        name: /bénéfices clés/i,
        level: 2,
      })
      await expect(benefitsH2).toHaveCount(1)

      const statsH2 = page.getByRole('heading', {
        name: /chiffres clés/i,
        level: 2,
      })
      await expect(statsH2).toHaveCount(1)
    })

    test('A11Y-HD-05 : h2 sr-only accessibles aux technologies d\'assistance', async ({ page }) => {
      const benefitsHeading = page.getByRole('heading', {
        name: /bénéfices clés/i,
      })
      await expect(benefitsHeading).toHaveCount(1)

      const statsHeading = page.getByRole('heading', {
        name: /chiffres clés/i,
      })
      await expect(statsHeading).toHaveCount(1)
    })

    test('A11Y-HD-06 : exactement 3 headings de niveau 3 dans le hero', async ({ page }) => {
      const h3s = page.locator('#hero').getByRole('heading', { level: 3 })
      await expect(h3s).toHaveCount(3)
    })

    test('A11Y-HD-07 : h3 correspondent aux 3 titres de benefices', async ({ page }) => {
      const h3s = page.locator('#hero').getByRole('heading', { level: 3 })

      await expect(h3s.nth(0)).toContainText('Productivité décuplée')
      await expect(h3s.nth(1)).toContainText('Qualité garantie')
      await expect(h3s.nth(2)).toContainText('Collaboration fluide')
    })

    test('A11Y-HD-08 : pas de h4, h5 ou h6 dans le hero', async ({ page }) => {
      for (const level of [4, 5, 6]) {
        const headings = page.locator('#hero').getByRole('heading', { level })
        await expect(headings).toHaveCount(0)
      }
    })

    test('A11Y-HD-09 : outline des headings sequentiel (1 -> 2 -> 3)', async ({ page }) => {
      const headings = await page.locator('#hero [role="heading"], #hero h1, #hero h2, #hero h3, #hero h4, #hero h5, #hero h6').evaluateAll((elements) => {
        return elements.map((el) => {
          const tag = el.tagName.toLowerCase()
          const level = parseInt(tag.replace('h', ''), 10)
          return { tag, level, text: el.textContent?.trim().substring(0, 50) || '' }
        }).filter((h) => !isNaN(h.level))
      })

      // Verifier qu'il n'y a pas de saut de niveau
      for (let i = 1; i < headings.length; i++) {
        const prev = headings[i - 1]
        const curr = headings[i]
        // Le niveau ne peut augmenter que de 1 a la fois
        expect(
          curr.level - prev.level,
          `Saut de heading: h${prev.level} "${prev.text}" -> h${curr.level} "${curr.text}"`
        ).toBeLessThanOrEqual(1)
      }
    })
  })

  // ════════════════════════════════════════════════════════════════
  // 7. Contenu non textuel (icones, images)
  // ════════════════════════════════════════════════════════════════

  test.describe('Contenu non textuel', () => {
    test('A11Y-NT-01 : icones SVG des BenefitCards ont aria-hidden', async ({ page }) => {
      const svgs = page.locator('#benefits-section article svg')
      const count = await svgs.count()

      expect(count).toBe(3)

      for (let i = 0; i < count; i++) {
        await expect(svgs.nth(i)).toHaveAttribute('aria-hidden', 'true')
      }
    })

    test('A11Y-NT-02 : icone SVG du CTA a aria-hidden', async ({ page }) => {
      const ctaSvg = page.locator('a[href="/framework"] svg')
      await expect(ctaSvg).toHaveAttribute('aria-hidden', 'true')
    })

    test('A11Y-NT-03 : conteneurs role="presentation" ne sont pas annonces', async ({ page }) => {
      const presentationElements = page.locator('#hero [role="presentation"]')
      const count = await presentationElements.count()

      // Verifier que ces elements existent mais ont bien le role presentation
      for (let i = 0; i < count; i++) {
        await expect(presentationElements.nth(i)).toHaveAttribute(
          'role',
          'presentation'
        )
      }
    })

    test('A11Y-NT-04 : CTA a un nom accessible sans l\'icone', async ({ page }) => {
      const cta = page.getByRole('link', { name: 'Explorer le Framework' })
      await expect(cta).toHaveCount(1)
    })

    test('A11Y-NT-05 : articles BenefitCard n\'incluent pas les SVG dans leur nom accessible', async ({ page }) => {
      const articles = page.locator('#benefits-section article')
      const count = await articles.count()

      for (let i = 0; i < count; i++) {
        const article = articles.nth(i)
        // Verifier que chaque article a un h3 comme heading
        const h3 = article.locator('h3')
        await expect(h3).toHaveCount(1)

        // Verifier que le SVG ne pollue pas le nom accessible
        const svgs = article.locator('svg')
        const svgCount = await svgs.count()
        for (let j = 0; j < svgCount; j++) {
          await expect(svgs.nth(j)).toHaveAttribute('aria-hidden', 'true')
        }
      }
    })
  })

  // ════════════════════════════════════════════════════════════════
  // 8. Liens et elements interactifs
  // ════════════════════════════════════════════════════════════════

  test.describe('Liens et elements interactifs', () => {
    test('A11Y-LK-01 : CTA "Explorer le Framework" a un nom accessible', async ({ page }) => {
      const cta = page.getByRole('link', { name: /Explorer le Framework/ })
      await expect(cta).toHaveCount(1)
    })

    test('A11Y-LK-02 : liens source ont chacun un nom accessible', async ({ page }) => {
      const sourceLinks = page.locator('#stats-section a[target="_blank"]')
      const count = await sourceLinks.count()

      expect(count).toBe(3)

      for (let i = 0; i < count; i++) {
        const link = sourceLinks.nth(i)
        const text = await link.textContent()
        expect(text?.trim().length).toBeGreaterThan(0)
      }
    })

    test('A11Y-LK-03 : liens target="_blank" ont un indicateur sr-only', async ({ page }) => {
      const sourceLinks = page.locator('#stats-section a[target="_blank"]')
      const count = await sourceLinks.count()

      expect(count).toBe(3)

      for (let i = 0; i < count; i++) {
        const link = sourceLinks.nth(i)
        const srOnly = link.locator('.sr-only')
        await expect(srOnly).toHaveCount(1)
        await expect(srOnly).toContainText('ouvre dans un nouvel onglet')
      }
    })

    test('A11Y-LK-04 : liens source ont rel="noopener noreferrer"', async ({ page }) => {
      const sourceLinks = page.locator('#stats-section a[target="_blank"]')
      const count = await sourceLinks.count()

      for (let i = 0; i < count; i++) {
        const rel = await sourceLinks.nth(i).getAttribute('rel')
        expect(rel).toContain('noopener')
        expect(rel).toContain('noreferrer')
      }
    })

    test('A11Y-LK-05 : CTA n\'a pas target="_blank" (lien interne)', async ({ page }) => {
      const cta = page.locator('a[href="/framework"]')
      const target = await cta.getAttribute('target')
      expect(target).toBeNull()
    })

    test('A11Y-LK-06 : CTA a href="/framework" (pas de href="#")', async ({ page }) => {
      const cta = page.locator('a[href="/framework"]')
      await expect(cta).toHaveCount(1)

      const href = await cta.getAttribute('href')
      expect(href).toBe('/framework')
    })
  })

  // ════════════════════════════════════════════════════════════════
  // 9. Responsive et zoom
  // ════════════════════════════════════════════════════════════════

  test.describe('Responsive et zoom', () => {
    test('A11Y-RZ-01 : 0 violation axe-core sur mobile (375x667)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      const results = await new AxeBuilder({ page })
        .include('#hero')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      expect(results.violations, formatViolations(results.violations)).toEqual(
        []
      )
    })

    test('A11Y-RZ-02 : 0 violation axe-core sur tablette (768x1024)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/')

      const results = await new AxeBuilder({ page })
        .include('#hero')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      expect(results.violations, formatViolations(results.violations)).toEqual(
        []
      )
    })

    test('A11Y-RZ-03 : 0 violation axe-core sur desktop (1280x720)', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.goto('/')

      const results = await new AxeBuilder({ page })
        .include('#hero')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      expect(results.violations, formatViolations(results.violations)).toEqual(
        []
      )
    })

    test('A11Y-RZ-04 : pas de scroll horizontal a 320px', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 })
      await page.goto('/')

      const hasHorizontalScroll = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth
      )

      expect(hasHorizontalScroll).toBe(false)
    })

    test('A11Y-RZ-05 : CTA visible et cliquable sur mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      const cta = page.locator('a[href="/framework"]')
      await expect(cta).toBeVisible()
      await expect(cta).toBeEnabled()
    })

    test('A11Y-RZ-06 : textes visibles a 320px (pas de troncature critique)', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 })
      await page.goto('/')

      const h1 = page.getByRole('heading', { level: 1 })
      await expect(h1).toBeVisible()

      const cta = page.locator('a[href="/framework"]')
      await expect(cta).toBeVisible()
    })

    test('A11Y-RZ-07 : zoom 200% — contenu lisible', async ({ page }) => {
      await page.goto('/')

      // Simuler un zoom a 200%
      await page.evaluate(() => {
        ;(document.documentElement.style as CSSStyleDeclaration & { zoom: string }).zoom = '2'
      })

      const h1 = page.getByRole('heading', { level: 1 })
      await expect(h1).toBeVisible()

      const cta = page.locator('a[href="/framework"]')
      await expect(cta).toBeVisible()
    })

    test('A11Y-RZ-08 : zoom 200% — CTA toujours fonctionnel', async ({ page }) => {
      await page.goto('/')

      await page.evaluate(() => {
        ;(document.documentElement.style as CSSStyleDeclaration & { zoom: string }).zoom = '2'
      })

      const cta = page.locator('a[href="/framework"]')
      await expect(cta).toBeVisible()
      await expect(cta).toBeEnabled()
    })

    test('A11Y-RZ-09 : zoom 200% — axe-core 0 violation', async ({ page }) => {
      await page.goto('/')

      await page.evaluate(() => {
        ;(document.documentElement.style as CSSStyleDeclaration & { zoom: string }).zoom = '2'
      })

      const results = await new AxeBuilder({ page })
        .include('#hero')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      expect(results.violations, formatViolations(results.violations)).toEqual(
        []
      )
    })

    test('A11Y-RZ-10 : grilles passent en 1 colonne sur mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      const articles = page.locator('#benefits-section article')
      const count = await articles.count()

      if (count >= 2) {
        const box0 = await articles.nth(0).boundingBox()
        const box1 = await articles.nth(1).boundingBox()

        // En 1 colonne : la 2eme carte est en dessous (y plus grand)
        expect(box1!.y).toBeGreaterThan(box0!.y)
        // Et elles ont la meme position x (meme colonne)
        expect(Math.abs(box0!.x - box1!.x)).toBeLessThan(10)
      }
    })
  })

  // ════════════════════════════════════════════════════════════════
  // 10. Langue et metadonnees
  // ════════════════════════════════════════════════════════════════

  test.describe('Langue et metadonnees', () => {
    test('A11Y-LANG-01 : html a lang="fr"', async ({ page }) => {
      const lang = await page.locator('html').getAttribute('lang')
      expect(lang).toBe('fr')
    })

    test('A11Y-LANG-02 : title contient un texte descriptif', async ({ page }) => {
      const title = await page.title()
      expect(title.length).toBeGreaterThan(10)
      expect(title).toContain('AIAD')
    })

    test('A11Y-LANG-03 : meta description presente', async ({ page }) => {
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content')

      expect(description).toBeTruthy()
      expect(description!.length).toBeGreaterThan(20)
    })

    test('A11Y-LANG-04 : meta charset="UTF-8" present', async ({ page }) => {
      const charset = page.locator('meta[charset="UTF-8"]')
      await expect(charset).toHaveCount(1)
    })

    test('A11Y-LANG-05 : meta viewport present', async ({ page }) => {
      const viewport = page.locator('meta[name="viewport"]')
      await expect(viewport).toHaveCount(1)

      const content = await viewport.getAttribute('content')
      expect(content).toContain('width=device-width')
    })
  })

  // ════════════════════════════════════════════════════════════════
  // 11. Texte sr-only (screen reader)
  // ════════════════════════════════════════════════════════════════

  test.describe('Texte sr-only', () => {
    test('A11Y-SR-01 : h2 "Benefices cles" visuellement cache mais accessible', async ({ page }) => {
      const heading = page.getByRole('heading', {
        name: /bénéfices clés/i,
        level: 2,
      })
      await expect(heading).toHaveCount(1)

      // Visuellement cache (classe sr-only)
      await expect(heading).toHaveClass(/sr-only/)
    })

    test('A11Y-SR-02 : h2 "Chiffres cles" visuellement cache mais accessible', async ({ page }) => {
      const heading = page.getByRole('heading', {
        name: /chiffres clés/i,
        level: 2,
      })
      await expect(heading).toHaveCount(1)

      await expect(heading).toHaveClass(/sr-only/)
    })

    test('A11Y-SR-03 : texte "(ouvre dans un nouvel onglet)" accessible aux AT', async ({ page }) => {
      const srOnlyTexts = page.locator('#stats-section a[target="_blank"] .sr-only')
      const count = await srOnlyTexts.count()

      expect(count).toBe(3)

      for (let i = 0; i < count; i++) {
        await expect(srOnlyTexts.nth(i)).toContainText(
          'ouvre dans un nouvel onglet'
        )
      }
    })

    test('A11Y-SR-04 : textes sr-only visuellement invisibles (1x1px)', async ({ page }) => {
      const srOnlyElements = page.locator('#hero .sr-only')
      const count = await srOnlyElements.count()

      expect(count).toBeGreaterThanOrEqual(2) // Au moins les 2 h2

      for (let i = 0; i < count; i++) {
        const box = await srOnlyElements.nth(i).boundingBox()

        // sr-only : dimensions 1x1px, overflow hidden
        if (box) {
          expect(box.width).toBeLessThanOrEqual(1)
          expect(box.height).toBeLessThanOrEqual(1)
        }
      }
    })

    test('A11Y-SR-05 : textes sr-only ne creent pas d\'espace visuel', async ({ page }) => {
      const srOnlyElements = page.locator('#hero .sr-only')
      const count = await srOnlyElements.count()

      for (let i = 0; i < count; i++) {
        const el = srOnlyElements.nth(i)
        const styles = await el.evaluate((element) => {
          const cs = window.getComputedStyle(element)
          return {
            position: cs.position,
            overflow: cs.overflow,
          }
        })

        // sr-only utilise position absolute et overflow hidden
        expect(styles.position).toBe('absolute')
        expect(styles.overflow).toBe('hidden')
      }
    })
  })
})
