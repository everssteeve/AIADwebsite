# T-001-T4 : Tests d'accessibilité (a11y) HeroSection

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 09 février 2026 |
| **Statut** | 📋 À faire |
| **User Story** | [US-001 - Comprendre AIAD rapidement](./spec.md) |
| **Dépendances** | T-001-F9 (intégration page d'accueil), T-001-T3 (tests d'intégration) |
| **Bloque** | T-001-T5 (tests utilisateur) |

---

## 1. Objectif

Valider l'**accessibilité WCAG 2.1 AA** (RGAA) de la section HeroSection telle qu'elle est rendue **dans un navigateur réel**, en utilisant **Playwright** et **axe-core**. Ces tests vérifient ce qui ne peut pas être validé par des assertions sur du HTML statique : contraste de couleurs, navigation au clavier, indicateurs de focus, rendu par les technologies d'assistance, et reflow responsive.

### Distinction avec T-001-T2 et T-001-T3

| Aspect | T-001-T2 (unitaires) | T-001-T3 (intégration) | T-001-T4 (a11y) |
|--------|----------------------|------------------------|------------------|
| **Environnement** | Vitest + Astro Container | Vitest + Astro Container | **Playwright + navigateur réel** |
| **Périmètre** | Composant isolé | HeroSection assemblé | **Page d'accueil complète dans le navigateur** |
| **Focus a11y** | Attributs ARIA en string HTML | ARIA tree en string HTML | **WCAG 2.1 AA via axe-core, clavier, contraste** |
| **Contraste** | Non vérifiable (pas de CSSOM) | Non vérifiable | **Vérification axe-core des ratios réels** |
| **Clavier** | Non vérifiable | Non vérifiable | **Tab, Enter, Shift+Tab, focus visible** |
| **Focus visible** | Classe `focus:ring-2` en HTML | Classe `focus:ring-2` en HTML | **Outline/ring visible calculé** |
| **Screen reader** | Attributs HTML statiques | Attributs HTML statiques | **Arbre d'accessibilité du navigateur** |
| **Responsive** | Non testé | Non testé | **Viewports mobile/tablette/desktop** |
| **Zoom** | Non testé | Non testé | **Zoom 200%, reflow 320px** |

### Ce qui est testé

- **Conformité automatique WCAG 2.1 AA** : scan axe-core sur la page d'accueil (0 violation)
- **Navigation clavier** : ordre de tabulation logique, accès à tous les éléments interactifs
- **Focus visible** : indicateurs de focus visibles sur chaque élément focusable
- **Contraste de couleurs** : ratios texte/fond conformes (4.5:1 normal, 3:1 grand texte)
- **Landmarks ARIA** : structure de régions accessible (main, sections nommées)
- **Hiérarchie des titres** : outline de headings correct dans l'arbre d'accessibilité
- **Contenu alternatif** : icônes décoratives masquées, titres sr-only accessibles
- **Liens externes** : indication d'ouverture en nouvel onglet pour les technologies d'assistance
- **Responsive a11y** : accessibilité préservée sur mobile (320px) et tablette (768px)
- **Zoom 200%** : contenu lisible et fonctionnel après zoom
- **Attribut de langue** : `lang="fr"` sur `<html>`

### Ce qui est exclu (couvert ailleurs)

| Exclu | Couvert par |
|-------|-------------|
| Attributs ARIA présents dans le HTML statique | T-001-T2, T-001-T3 |
| Hiérarchie headings par comptage string | T-001-T3 |
| Données de production (textes, URLs) | T-001-T3 |
| Performance (Lighthouse score) | T-001-T5 |
| Test utilisateur temps de lecture | T-001-T5 |

---

## 2. Contexte technique

### 2.1 Stack de test

| Outil | Version | Rôle |
|-------|---------|------|
| **Playwright** | 1.x | Framework de test E2E, contrôle du navigateur |
| **@axe-core/playwright** | 4.x | Audit WCAG automatisé dans le navigateur |
| **TypeScript** | 5.x | Typage des tests et helpers |
| **Astro** (dev server) | 4.x | Serveur de développement pour servir la page |

### 2.2 Dépendances à installer

```bash
pnpm add -D @playwright/test @axe-core/playwright
pnpm exec playwright install chromium
```

### 2.3 Approche de test

Les tests d'accessibilité utilisent **Playwright** pour charger la page d'accueil dans un navigateur Chromium réel, puis :

1. **axe-core** scanne la page pour détecter les violations WCAG 2.1 AA automatiquement
2. Des interactions clavier (Tab, Enter, Shift+Tab) vérifient la navigation
3. Des captures de styles calculés (`getComputedStyle`) vérifient le focus visible
4. L'arbre d'accessibilité du navigateur (`page.accessibility.snapshot()`) vérifie les rôles et noms
5. Des viewports différents testent l'accessibilité responsive

```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('WCAG 2.1 AA — aucune violation', async ({ page }) => {
  await page.goto('/')

  const results = await new AxeBuilder({ page })
    .include('#hero')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()

  expect(results.violations).toEqual([])
})
```

### 2.4 Configuration Playwright

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/a11y',
  fullyParallel: true,
  retries: 1,
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm dev',
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'desktop',
      use: { viewport: { width: 1280, height: 720 } },
    },
    {
      name: 'tablet',
      use: { viewport: { width: 768, height: 1024 } },
    },
    {
      name: 'mobile',
      use: { viewport: { width: 375, height: 667 } },
    },
  ],
})
```

### 2.5 Structure des fichiers

```
tests/
└── a11y/
    └── hero-section.a11y.test.ts   ← CE FICHIER
playwright.config.ts                ← CONFIGURATION (à créer ou mettre à jour)
```

> **Convention** : Les tests d'accessibilité sont placés dans `tests/a11y/` pour les distinguer des tests unitaires (`tests/unit/`) et d'intégration (`tests/integration/`).

### 2.6 Composants et éléments sous test

```
Page d'accueil (index.astro)
└── <html lang="fr">
    └── <body>
        └── <main>
            └── <section id="hero" aria-labelledby="hero-title">     ← landmark
                ├── <h1 id="hero-title">                              ← heading level 1
                │   └── texte du titre
                ├── <p> tagline                                       ← texte
                ├── <p> value proposition                             ← texte
                ├── <a href="/framework">                             ← INTERACTIF (CTA)
                │   ├── <span> texte du bouton
                │   └── <svg aria-hidden="true">                     ← icône décorative
                ├── <section id="benefits-section">                   ← landmark
                │   ├── <h2 class="sr-only">                          ← heading level 2
                │   └── <article> × 3                                 ← cartes
                │       ├── <div role="presentation"> + <svg aria-hidden="true">
                │       ├── <h3>                                      ← heading level 3
                │       └── <p>                                       ← texte
                └── <section id="stats-section">                      ← landmark
                    ├── <h2 class="sr-only">                          ← heading level 2
                    └── <div> × 3                                     ← stats
                        ├── <p> valeur                                ← texte
                        ├── <p> label                                 ← texte
                        └── <footer>                                  ← source
                            └── <a target="_blank"> ou <cite>         ← INTERACTIF (liens)
                                └── <span class="sr-only">           ← texte caché
```

**Éléments interactifs focusables :**

| # | Élément | Type | Localisation |
|---|---------|------|--------------|
| 1 | CTA "Explorer le Framework" | `<a>` lien | Après la value proposition |
| 2 | Source McKinsey | `<a target="_blank">` lien externe | Section stats, stat 1 |
| 3 | Source GitHub Copilot | `<a target="_blank">` lien externe | Section stats, stat 2 |
| 4 | Source Stack Overflow | `<a target="_blank">` lien externe | Section stats, stat 3 |

---

## 3. Spécifications fonctionnelles

### 3.1 Types TypeScript pour les tests

```typescript
// ── Types pour les résultats axe-core ───────────────────────

import type { AxeResults, Result as AxeViolation } from 'axe-core'

/**
 * Résultat d'un scan axe-core simplifié pour les assertions
 */
interface A11yAuditResult {
  /** Nombre total de violations */
  violationCount: number
  /** Violations groupées par impact */
  violationsByImpact: {
    critical: AxeViolation[]
    serious: AxeViolation[]
    moderate: AxeViolation[]
    minor: AxeViolation[]
  }
  /** Nombre de règles passées */
  passCount: number
  /** Nombre de règles incomplètes (nécessitant vérification manuelle) */
  incompleteCount: number
}

// ── Types pour la navigation clavier ────────────────────────

/**
 * Élément focusable identifié dans la page
 */
interface FocusableElement {
  /** Sélecteur CSS pour identifier l'élément */
  selector: string
  /** Rôle ARIA attendu */
  expectedRole: string
  /** Nom accessible attendu (ou pattern regex) */
  expectedName: string | RegExp
  /** L'élément devrait être atteignable par Tab */
  shouldBeTabbable: boolean
}

/**
 * Résultat de la vérification du focus visible
 */
interface FocusVisibilityResult {
  /** L'élément a un indicateur de focus visible */
  hasVisibleFocus: boolean
  /** Type d'indicateur détecté */
  indicatorType: 'outline' | 'ring' | 'border' | 'shadow' | 'none'
  /** Valeur CSS de l'indicateur */
  indicatorValue: string
}

// ── Types pour les vérifications de contraste ───────────────

/**
 * Résultat d'une vérification de contraste
 */
interface ContrastCheckResult {
  /** Ratio de contraste calculé */
  ratio: number
  /** Ratio minimum requis (4.5 normal, 3.0 large text) */
  requiredRatio: number
  /** Le contraste est conforme */
  passes: boolean
  /** Couleur de premier plan */
  foreground: string
  /** Couleur d'arrière-plan */
  background: string
}

// ── Types pour l'arbre d'accessibilité ──────────────────────

/**
 * Noeud de l'arbre d'accessibilité simplifié
 */
interface A11yTreeNode {
  role: string
  name?: string
  level?: number
  children?: A11yTreeNode[]
}

/**
 * Structure attendue des landmarks dans le hero
 */
interface ExpectedLandmarkStructure {
  main: {
    sections: {
      id: string
      labelledBy: string
      headingLevel: number
      headingText: string
    }[]
  }
}

// ── Types pour les viewports de test ────────────────────────

/**
 * Configuration de viewport pour les tests responsive
 */
interface ViewportConfig {
  name: string
  width: number
  height: number
}

/**
 * Viewports de test
 */
const TEST_VIEWPORTS: ViewportConfig[] = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'mobile-small', width: 320, height: 568 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'desktop-large', width: 1920, height: 1080 },
]
```

### 3.2 Helpers de test

```typescript
// ── Helper : vérifier le focus visible ──────────────────────

async function checkFocusVisible(
  page: Page,
  selector: string
): Promise<FocusVisibilityResult> {
  const element = page.locator(selector)
  await element.focus()

  const styles = await element.evaluate((el) => {
    const computed = window.getComputedStyle(el)
    return {
      outline: computed.outline,
      outlineWidth: computed.outlineWidth,
      outlineStyle: computed.outlineStyle,
      outlineColor: computed.outlineColor,
      boxShadow: computed.boxShadow,
      borderColor: computed.borderColor,
    }
  })

  const hasOutline =
    styles.outlineStyle !== 'none' && styles.outlineWidth !== '0px'
  const hasBoxShadow = styles.boxShadow !== 'none'

  let indicatorType: FocusVisibilityResult['indicatorType'] = 'none'
  if (hasOutline) indicatorType = 'outline'
  else if (hasBoxShadow) indicatorType = 'ring'

  return {
    hasVisibleFocus: hasOutline || hasBoxShadow,
    indicatorType,
    indicatorValue: hasOutline ? styles.outline : styles.boxShadow,
  }
}

// ── Helper : scanner axe-core avec configuration ────────────

async function auditA11y(
  page: Page,
  selector: string = '#hero'
): Promise<A11yAuditResult> {
  const results = await new AxeBuilder({ page })
    .include(selector)
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()

  return {
    violationCount: results.violations.length,
    violationsByImpact: {
      critical: results.violations.filter((v) => v.impact === 'critical'),
      serious: results.violations.filter((v) => v.impact === 'serious'),
      moderate: results.violations.filter((v) => v.impact === 'moderate'),
      minor: results.violations.filter((v) => v.impact === 'minor'),
    },
    passCount: results.passes.length,
    incompleteCount: results.incomplete.length,
  }
}

// ── Helper : obtenir l'ordre de tabulation ──────────────────

async function getTabOrder(page: Page, maxTabs: number = 20): Promise<string[]> {
  const tabOrder: string[] = []

  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press('Tab')

    const focusedSelector = await page.evaluate(() => {
      const el = document.activeElement
      if (!el || el === document.body) return null
      if (el.id) return `#${el.id}`
      if (el.getAttribute('href')) return `a[href="${el.getAttribute('href')}"]`
      return el.tagName.toLowerCase()
    })

    if (!focusedSelector) break
    tabOrder.push(focusedSelector)
  }

  return tabOrder
}
```

---

## 4. Matrice des tests

### 4.1 Conformité WCAG automatique (axe-core)

| ID | Description | Critère WCAG | Assertion principale |
|----|-------------|--------------|---------------------|
| A11Y-AXE-01 | Scan axe-core de `#hero` : 0 violation WCAG 2.1 AA | Multi-critères | `results.violations.toEqual([])` |
| A11Y-AXE-02 | Scan axe-core de `#hero` : 0 violation critique | Multi-critères | `violationsByImpact.critical.length === 0` |
| A11Y-AXE-03 | Scan axe-core de `#hero` : 0 violation sérieuse | Multi-critères | `violationsByImpact.serious.length === 0` |
| A11Y-AXE-04 | Scan axe-core de la page entière : 0 violation | Multi-critères | `results.violations.toEqual([])` |
| A11Y-AXE-05 | axe-core passe la règle `heading-order` | 1.3.1 | Pas de violation `heading-order` |
| A11Y-AXE-06 | axe-core passe la règle `landmark-one-main` | 1.3.1 | Pas de violation `landmark-one-main` |
| A11Y-AXE-07 | axe-core passe la règle `region` | 1.3.1 | Pas de violation `region` |
| A11Y-AXE-08 | axe-core passe la règle `color-contrast` | 1.4.3 | Pas de violation `color-contrast` |
| A11Y-AXE-09 | axe-core passe la règle `link-name` | 2.4.4 | Pas de violation `link-name` |
| A11Y-AXE-10 | axe-core passe la règle `image-alt` (SVG icons) | 1.1.1 | Pas de violation `image-alt` |

### 4.2 Navigation clavier

| ID | Description | Critère WCAG | Assertion principale |
|----|-------------|--------------|---------------------|
| A11Y-KB-01 | Tab depuis le haut de page atteint le CTA "Explorer le Framework" | 2.1.1 | `focusedElement.textContent` contient "Explorer le Framework" |
| A11Y-KB-02 | Tab continue vers le 1er lien source (McKinsey) | 2.1.1 | `focusedElement.href` contient "mckinsey.com" |
| A11Y-KB-03 | Tab continue vers le 2ème lien source (GitHub) | 2.1.1 | `focusedElement.href` contient "github.blog" |
| A11Y-KB-04 | Tab continue vers le 3ème lien source (Stack Overflow) | 2.1.1 | `focusedElement.href` contient "stackoverflow.co" |
| A11Y-KB-05 | Ordre de tabulation logique : CTA → source 1 → source 2 → source 3 | 2.4.3 | Indices de tab dans l'ordre attendu |
| A11Y-KB-06 | Shift+Tab revient en arrière dans l'ordre inverse | 2.4.3 | Focus revient au CTA depuis la source 1 |
| A11Y-KB-07 | Enter sur le CTA navigue vers `/framework` | 2.1.1 | `page.url()` contient `/framework` |
| A11Y-KB-08 | Enter sur un lien source ouvre un nouvel onglet | 2.1.1 | Nouvel onglet ouvert avec l'URL source |
| A11Y-KB-09 | Aucun piège clavier dans la section hero | 2.1.2 | Tab finit par quitter la section hero |
| A11Y-KB-10 | Éléments non interactifs (texte, icônes) ne reçoivent pas le focus | 2.4.3 | `<p>`, `<h1>`, `<svg>` non dans l'ordre de tab |

### 4.3 Focus visible

| ID | Description | Critère WCAG | Assertion principale |
|----|-------------|--------------|---------------------|
| A11Y-FV-01 | CTA "Explorer le Framework" a un indicateur de focus visible | 2.4.7 | `checkFocusVisible` retourne `hasVisibleFocus: true` |
| A11Y-FV-02 | CTA focus indicator est un ring (box-shadow ou outline) | 2.4.7 | `indicatorType` est `'outline'` ou `'ring'` |
| A11Y-FV-03 | Lien source McKinsey a un focus visible | 2.4.7 | `hasVisibleFocus: true` |
| A11Y-FV-04 | Lien source GitHub a un focus visible | 2.4.7 | `hasVisibleFocus: true` |
| A11Y-FV-05 | Lien source Stack Overflow a un focus visible | 2.4.7 | `hasVisibleFocus: true` |
| A11Y-FV-06 | Le focus du CTA a un contraste suffisant (3:1 contre le fond) | 1.4.11 | Ratio contraste focus indicator ≥ 3:1 |
| A11Y-FV-07 | Le focus des liens source a un contraste suffisant | 1.4.11 | Ratio contraste focus indicator ≥ 3:1 |

### 4.4 Contraste de couleurs

| ID | Description | Critère WCAG | Assertion principale |
|----|-------------|--------------|---------------------|
| A11Y-CC-01 | Titre h1 (`text-gray-900` sur fond blanc) : ratio ≥ 4.5:1 | 1.4.3 | `axe-core color-contrast` passe |
| A11Y-CC-02 | Tagline (`text-gray-600` sur fond blanc) : ratio ≥ 4.5:1 | 1.4.3 | `axe-core color-contrast` passe |
| A11Y-CC-03 | Value proposition (`text-gray-600` sur fond blanc) : ratio ≥ 4.5:1 | 1.4.3 | `axe-core color-contrast` passe |
| A11Y-CC-04 | CTA texte (`text-white` sur `bg-blue-600`) : ratio ≥ 4.5:1 | 1.4.3 | `axe-core color-contrast` passe |
| A11Y-CC-05 | Titre benefit h3 (`text-gray-900` sur `bg-white`) : ratio ≥ 4.5:1 | 1.4.3 | `axe-core color-contrast` passe |
| A11Y-CC-06 | Description benefit (`text-gray-600` sur `bg-white`) : ratio ≥ 4.5:1 | 1.4.3 | `axe-core color-contrast` passe |
| A11Y-CC-07 | Valeur stat (`text-blue-600` sur fond) : ratio ≥ 3:1 (grand texte) | 1.4.3 | `axe-core color-contrast` passe |
| A11Y-CC-08 | Label stat (`text-gray-700`) : ratio ≥ 4.5:1 | 1.4.3 | `axe-core color-contrast` passe |
| A11Y-CC-09 | Source stat lien (`text-blue-500`) : ratio ≥ 4.5:1 | 1.4.3 | `axe-core color-contrast` passe |
| A11Y-CC-10 | Source stat texte (`text-gray-500`) : ratio ≥ 4.5:1 | 1.4.3 | `axe-core color-contrast` passe |
| A11Y-CC-11 | Contraste sur fond gradient (`bg-gradient-to-b from-white to-gray-50`) | 1.4.3 | `axe-core color-contrast` passe |
| A11Y-CC-12 | Stat highlight (`text-blue-700` sur `bg-blue-50`) : ratio ≥ 3:1 | 1.4.3 | `axe-core color-contrast` passe |

### 4.5 Landmarks et structure ARIA

| ID | Description | Critère WCAG | Assertion principale |
|----|-------------|--------------|---------------------|
| A11Y-LM-01 | La page contient un `<main>` | 1.3.1 | `page.locator('main')` existe |
| A11Y-LM-02 | `#hero` est une `<section>` avec `aria-labelledby` | 1.3.1 | Attribut `aria-labelledby="hero-title"` présent |
| A11Y-LM-03 | `#benefits-section` est une `<section>` avec `aria-labelledby` | 1.3.1 | Attribut `aria-labelledby="benefits-section-title"` |
| A11Y-LM-04 | `#stats-section` est une `<section>` avec `aria-labelledby` | 1.3.1 | Attribut `aria-labelledby="stats-section-title"` |
| A11Y-LM-05 | Chaque `aria-labelledby` pointe vers un ID existant et visible (même sr-only) | 1.3.1 | L'élément cible existe dans le DOM |
| A11Y-LM-06 | Les `<section>` avec `aria-labelledby` apparaissent comme régions dans l'arbre a11y | 1.3.1 | `page.getByRole('region')` retourne 3 éléments |
| A11Y-LM-07 | Chaque région a un nom accessible | 1.3.1 | `getByRole('region', { name })` pour chaque section |
| A11Y-LM-08 | Les BenefitCards utilisent `<article>` comme rôle sémantique | 1.3.1 | `page.locator('#hero article')` retourne 3 éléments |

### 4.6 Hiérarchie des headings

| ID | Description | Critère WCAG | Assertion principale |
|----|-------------|--------------|---------------------|
| A11Y-HD-01 | Exactement 1 heading de niveau 1 dans la page | 1.3.1 | `getByRole('heading', { level: 1 })` count === 1 |
| A11Y-HD-02 | Le h1 a le texte "AIAD : Le framework pour développer avec des agents IA" | 2.4.6 | Nom accessible du h1 contient le titre |
| A11Y-HD-03 | Exactement 2 headings de niveau 2 dans le hero | 1.3.1 | `getByRole('heading', { level: 2 })` count === 2 |
| A11Y-HD-04 | Les h2 ont les noms "Bénéfices clés" et "Chiffres clés" | 2.4.6 | Noms accessibles des h2 |
| A11Y-HD-05 | Les h2 sr-only sont accessibles aux technologies d'assistance | 1.3.1 | `getByRole('heading', { name: 'Bénéfices clés' })` trouvé |
| A11Y-HD-06 | Exactement 3 headings de niveau 3 dans le hero | 1.3.1 | `getByRole('heading', { level: 3 })` count === 3 |
| A11Y-HD-07 | Les h3 correspondent aux 3 titres de bénéfices | 2.4.6 | "Productivité décuplée", "Qualité garantie", "Collaboration fluide" |
| A11Y-HD-08 | Pas de heading de niveau 4, 5 ou 6 dans le hero | 1.3.1 | `getByRole('heading', { level: 4/5/6 })` count === 0 |
| A11Y-HD-09 | L'outline des headings est séquentiel (1 → 2 → 3, pas de saut) | 1.3.1 | Vérification arbre d'accessibilité |

### 4.7 Contenu non textuel (icônes, images)

| ID | Description | Critère WCAG | Assertion principale |
|----|-------------|--------------|---------------------|
| A11Y-NT-01 | Les icônes SVG des BenefitCards ont `aria-hidden="true"` | 1.1.1 | Chaque SVG dans les articles a l'attribut |
| A11Y-NT-02 | L'icône SVG du CTA a `aria-hidden="true"` | 1.1.1 | SVG dans le CTA a l'attribut |
| A11Y-NT-03 | Les conteneurs d'icônes avec `role="presentation"` ne sont pas annoncés | 1.1.1 | Pas dans l'arbre d'accessibilité |
| A11Y-NT-04 | Le CTA a un nom accessible complet sans l'icône | 4.1.2 | `getByRole('link', { name: 'Explorer le Framework' })` |
| A11Y-NT-05 | Les articles BenefitCard n'incluent pas les SVG dans leur nom accessible | 1.1.1 | Nom accessible de l'article = titre h3 |

### 4.8 Liens et éléments interactifs

| ID | Description | Critère WCAG | Assertion principale |
|----|-------------|--------------|---------------------|
| A11Y-LK-01 | Le CTA "Explorer le Framework" a un nom accessible | 2.4.4 | `getByRole('link', { name: /Explorer le Framework/ })` |
| A11Y-LK-02 | Les liens source ont chacun un nom accessible (texte de la source) | 2.4.4 | Chaque `<a>` dans les stats a un texte accessible |
| A11Y-LK-03 | Les liens `target="_blank"` ont un indicateur sr-only "(ouvre dans un nouvel onglet)" | 2.4.4 | `span.sr-only` avec le texte approprié |
| A11Y-LK-04 | Les liens source ont `rel="noopener noreferrer"` | Sécurité | Attribut vérifié sur chaque lien externe |
| A11Y-LK-05 | Le CTA n'a pas `target="_blank"` (lien interne) | — | Pas d'attribut `target` sur le CTA |
| A11Y-LK-06 | Le CTA a `href="/framework"` (pas de href="#") | 2.4.4 | `href` valide |

### 4.9 Responsive et zoom

| ID | Description | Critère WCAG | Assertion principale |
|----|-------------|--------------|---------------------|
| A11Y-RZ-01 | axe-core 0 violation sur viewport mobile (375×667) | Multi | `violations.toEqual([])` |
| A11Y-RZ-02 | axe-core 0 violation sur viewport tablette (768×1024) | Multi | `violations.toEqual([])` |
| A11Y-RZ-03 | axe-core 0 violation sur viewport desktop (1280×720) | Multi | `violations.toEqual([])` |
| A11Y-RZ-04 | Pas de scroll horizontal à 320px de large (reflow) | 1.4.10 | `scrollWidth <= viewportWidth` |
| A11Y-RZ-05 | Le CTA reste visible et cliquable sur mobile | 1.4.10 | `isVisible()` et `isEnabled()` |
| A11Y-RZ-06 | Tous les textes visibles à 320px (pas de troncature critique) | 1.4.10 | Le h1, VP, CTA sont visibles |
| A11Y-RZ-07 | Zoom 200% : contenu lisible sans perte d'information | 1.4.4 | Pas de chevauchement, textes visibles |
| A11Y-RZ-08 | Zoom 200% : CTA toujours fonctionnel | 1.4.4 | CTA clickable après zoom |
| A11Y-RZ-09 | Zoom 200% : axe-core 0 violation | 1.4.4 | `violations.toEqual([])` |
| A11Y-RZ-10 | Les grilles benefits et stats passent en 1 colonne sur mobile | 1.4.10 | Grid layout vérifié |

### 4.10 Langue et métadonnées

| ID | Description | Critère WCAG | Assertion principale |
|----|-------------|--------------|---------------------|
| A11Y-LANG-01 | `<html>` a l'attribut `lang="fr"` | 3.1.1 | `page.locator('html').getAttribute('lang')` === `'fr'` |
| A11Y-LANG-02 | `<title>` contient un texte descriptif | 2.4.2 | `page.title()` n'est pas vide |
| A11Y-LANG-03 | `<meta name="description">` est présent | — | Attribut `content` non vide |
| A11Y-LANG-04 | `<meta charset="UTF-8">` est présent | — | Encodage correct pour les caractères français |
| A11Y-LANG-05 | `<meta name="viewport">` est présent | 1.4.4 | Viewport meta correctement défini |

### 4.11 Texte sr-only (screen reader)

| ID | Description | Critère WCAG | Assertion principale |
|----|-------------|--------------|---------------------|
| A11Y-SR-01 | Le h2 "Bénéfices clés" est visuellement caché mais accessible | 1.3.1 | `sr-only` class + accessible via `getByRole` |
| A11Y-SR-02 | Le h2 "Chiffres clés" est visuellement caché mais accessible | 1.3.1 | `sr-only` class + accessible via `getByRole` |
| A11Y-SR-03 | Le texte "(ouvre dans un nouvel onglet)" est accessible aux AT | 1.3.1 | Présent dans le nom accessible du lien ou comme texte sr-only |
| A11Y-SR-04 | Les textes sr-only sont réellement invisibles visuellement | 1.3.1 | Dimensions calculées = 1×1px, overflow hidden |
| A11Y-SR-05 | Les textes sr-only ne créent pas d'espace visuel | 1.3.1 | Pas de décalage visible dans le layout |

---

## 5. Cas limites et gestion d'erreurs

### 5.1 Cas limites d'accessibilité

| ID | Cas | Comportement attendu | Priorité |
|----|-----|----------------------|----------|
| CL-A11Y-01 | Styles CSS non chargés (réseau lent) | Le contenu reste lisible en texte brut (progressive enhancement) | Haute |
| CL-A11Y-02 | JavaScript désactivé | La page est fonctionnelle (SSG, pas de JS requis pour le hero) | Haute |
| CL-A11Y-03 | Utilisateur avec font-size navigateur à 200% | Le contenu ne déborde pas, reste lisible | Haute |
| CL-A11Y-04 | Mode high contrast Windows | Les textes restent lisibles, les indicateurs de focus visibles | Moyenne |
| CL-A11Y-05 | Utilisateur naviguant uniquement au clavier | Tous les liens accessibles, focus visible, pas de piège | Haute |
| CL-A11Y-06 | Screen reader NVDA/JAWS : annonce du hero | Titre h1 annoncé, landmarks identifiés, headings navigables | Haute |
| CL-A11Y-07 | Zoom texte seul à 200% (sans zoom page) | Les textes restent dans leurs conteneurs | Moyenne |
| CL-A11Y-08 | Préférence `prefers-reduced-motion` activée | Les transitions CSS sont réduites ou supprimées | Basse |
| CL-A11Y-09 | Viewport très étroit (320px, ex: iPhone SE) | Contenu visible, pas de scroll horizontal | Haute |
| CL-A11Y-10 | Contraste sur fond gradient (bas de section) | Le contraste reste suffisant même en bas du gradient | Moyenne |

### 5.2 Interactions clavier edge cases

| ID | Cas | Entrée | Comportement attendu |
|----|-----|--------|----------------------|
| CL-KB-01 | Tab rapide (plusieurs Tab en succession) | 4 Tab rapides | Focus traverse CTA → 3 sources dans l'ordre |
| CL-KB-02 | Shift+Tab depuis après la section | Shift+Tab | Focus revient à la dernière source |
| CL-KB-03 | Escape sur un lien focusé | Escape | Pas d'action (pas de modal/dropdown) |
| CL-KB-04 | Space sur le CTA | Space | Suit le lien (comportement navigateur natif) |
| CL-KB-05 | Tab ne s'arrête pas sur les `<p>`, `<h1>`, `<h2>`, `<h3>` | Tab | Ces éléments sont sautés |

---

## 6. Exemples entrée/sortie

### 6.1 Scan axe-core — aucune violation

**Entrée (action) :**
```typescript
await page.goto('/')
const results = await new AxeBuilder({ page })
  .include('#hero')
  .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
  .analyze()
```

**Sortie attendue :**
```json
{
  "violations": [],
  "passes": [
    { "id": "color-contrast", "impact": null, "nodes": [ /* ... */ ] },
    { "id": "heading-order", "impact": null, "nodes": [ /* ... */ ] },
    { "id": "landmark-one-main", "impact": null, "nodes": [ /* ... */ ] },
    { "id": "region", "impact": null, "nodes": [ /* ... */ ] },
    { "id": "link-name", "impact": null, "nodes": [ /* ... */ ] },
    { "id": "image-alt", "impact": null, "nodes": [ /* ... */ ] }
  ],
  "incomplete": [],
  "inapplicable": [ /* ... */ ]
}
```

### 6.2 Scan axe-core — exemple de violation (à NE PAS avoir)

**Sortie NON souhaitée (exemple de violation de contraste) :**
```json
{
  "violations": [
    {
      "id": "color-contrast",
      "impact": "serious",
      "description": "Ensures the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
      "nodes": [
        {
          "html": "<cite class=\"text-xs text-gray-500 not-italic\">McKinsey Global Institute</cite>",
          "failureSummary": "Fix any of the following: Element has insufficient color contrast of 3.73 (foreground color: #6b7280, background color: #ffffff, font size: 9.6pt)"
        }
      ]
    }
  ]
}
```

> Si cette violation apparaît, il faut ajuster la couleur `text-gray-500` vers une couleur plus foncée (ex: `text-gray-600`).

### 6.3 Navigation clavier — ordre de tab

**Entrée (actions clavier) :**
```typescript
// Depuis le début de la page
await page.keyboard.press('Tab')  // → CTA
await page.keyboard.press('Tab')  // → Source McKinsey
await page.keyboard.press('Tab')  // → Source GitHub
await page.keyboard.press('Tab')  // → Source Stack Overflow
```

**Sortie attendue (éléments focusés séquentiellement) :**
```
1. <a href="/framework">Explorer le Framework ➜</a>
   → rôle: "link", nom: "Explorer le Framework"

2. <a href="https://www.mckinsey.com/..." target="_blank">
   → rôle: "link", nom: "McKinsey Global Institute... (ouvre dans un nouvel onglet)"

3. <a href="https://github.blog/..." target="_blank">
   → rôle: "link", nom: "GitHub Copilot Research... (ouvre dans un nouvel onglet)"

4. <a href="https://survey.stackoverflow.co/..." target="_blank">
   → rôle: "link", nom: "Stack Overflow Developer Survey 2024 (ouvre dans un nouvel onglet)"
```

### 6.4 Focus visible — CTA

**Entrée :**
```typescript
await page.locator('a[href="/framework"]').focus()
const styles = await page.locator('a[href="/framework"]').evaluate((el) => {
  const cs = window.getComputedStyle(el)
  return { boxShadow: cs.boxShadow, outline: cs.outline }
})
```

**Sortie attendue :**
```json
{
  "boxShadow": "rgb(59, 130, 246) 0px 0px 0px 2px, rgb(255, 255, 255) 0px 0px 0px 4px",
  "outline": "none"
}
```

> Le `focus:ring-2 focus:ring-offset-2 focus:ring-blue-500` de Tailwind génère un box-shadow visible.

### 6.5 Arbre d'accessibilité — structure des landmarks

**Entrée :**
```typescript
const snapshot = await page.accessibility.snapshot()
```

**Sortie attendue (simplifiée) :**
```json
{
  "role": "WebArea",
  "name": "AIAD - Framework de développement avec agents IA",
  "children": [
    {
      "role": "main",
      "children": [
        {
          "role": "region",
          "name": "AIAD : Le framework pour développer avec des agents IA",
          "children": [
            { "role": "heading", "name": "AIAD : Le framework pour développer avec des agents IA", "level": 1 },
            { "role": "paragraph", "name": "Structurez votre collaboration..." },
            { "role": "paragraph", "name": "Une méthodologie éprouvée..." },
            { "role": "link", "name": "Explorer le Framework" },
            {
              "role": "region",
              "name": "Bénéfices clés",
              "children": [
                { "role": "heading", "name": "Bénéfices clés", "level": 2 },
                { "role": "article", "children": [
                  { "role": "heading", "name": "Productivité décuplée", "level": 3 }
                ]},
                { "role": "article", "children": [
                  { "role": "heading", "name": "Qualité garantie", "level": 3 }
                ]},
                { "role": "article", "children": [
                  { "role": "heading", "name": "Collaboration fluide", "level": 3 }
                ]}
              ]
            },
            {
              "role": "region",
              "name": "Chiffres clés",
              "children": [
                { "role": "heading", "name": "Chiffres clés", "level": 2 },
                { "role": "link", "name": "McKinsey Global Institute... (ouvre dans un nouvel onglet)" },
                { "role": "link", "name": "GitHub Copilot Research... (ouvre dans un nouvel onglet)" },
                { "role": "link", "name": "Stack Overflow Developer Survey 2024 (ouvre dans un nouvel onglet)" }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 6.6 Responsive — pas de scroll horizontal à 320px

**Entrée :**
```typescript
await page.setViewportSize({ width: 320, height: 568 })
await page.goto('/')

const hasHorizontalScroll = await page.evaluate(() => {
  return document.documentElement.scrollWidth > document.documentElement.clientWidth
})
```

**Sortie attendue :**
```
hasHorizontalScroll === false
```

---

## 7. Tests

### 7.1 Fichier de test

| Fichier | Type | Framework |
|---------|------|-----------|
| `tests/a11y/hero-section.a11y.test.ts` | Accessibilité (E2E) | Playwright + axe-core |

### 7.2 Récapitulatif quantitatif

| Catégorie | Nb tests | Référence |
|-----------|----------|-----------|
| Conformité WCAG automatique (axe-core) | 10 | A11Y-AXE-01 à A11Y-AXE-10 |
| Navigation clavier | 10 | A11Y-KB-01 à A11Y-KB-10 |
| Focus visible | 7 | A11Y-FV-01 à A11Y-FV-07 |
| Contraste de couleurs | 12 | A11Y-CC-01 à A11Y-CC-12 |
| Landmarks et structure ARIA | 8 | A11Y-LM-01 à A11Y-LM-08 |
| Hiérarchie des headings | 9 | A11Y-HD-01 à A11Y-HD-09 |
| Contenu non textuel | 5 | A11Y-NT-01 à A11Y-NT-05 |
| Liens et éléments interactifs | 6 | A11Y-LK-01 à A11Y-LK-06 |
| Responsive et zoom | 10 | A11Y-RZ-01 à A11Y-RZ-10 |
| Langue et métadonnées | 5 | A11Y-LANG-01 à A11Y-LANG-05 |
| Texte sr-only | 5 | A11Y-SR-01 à A11Y-SR-05 |
| **Total** | **~87 tests** | |

### 7.3 Pattern de test standard

```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('HeroSection — Tests d\'accessibilité', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Attendre que le hero soit chargé
    await page.waitForSelector('#hero')
  })

  // ── Helpers ─────────────────────────────────────────────

  async function auditHero(page: Page) {
    return new AxeBuilder({ page })
      .include('#hero')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
  }

  function formatViolations(violations: AxeViolation[]): string {
    return violations
      .map((v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} nodes)`)
      .join('\n')
  }

  // ── Tests ───────────────────────────────────────────────

  describe('Conformité WCAG automatique', () => { /* A11Y-AXE-01 à 10 */ })
  describe('Navigation clavier', () => { /* A11Y-KB-01 à 10 */ })
  describe('Focus visible', () => { /* A11Y-FV-01 à 07 */ })
  describe('Contraste de couleurs', () => { /* A11Y-CC-01 à 12 */ })
  describe('Landmarks et structure ARIA', () => { /* A11Y-LM-01 à 08 */ })
  describe('Hiérarchie des headings', () => { /* A11Y-HD-01 à 09 */ })
  describe('Contenu non textuel', () => { /* A11Y-NT-01 à 05 */ })
  describe('Liens et éléments interactifs', () => { /* A11Y-LK-01 à 06 */ })
  describe('Responsive et zoom', () => { /* A11Y-RZ-01 à 10 */ })
  describe('Langue et métadonnées', () => { /* A11Y-LANG-01 à 05 */ })
  describe('Texte sr-only', () => { /* A11Y-SR-01 à 05 */ })
})
```

### 7.4 Exemples de tests complets

#### Conformité WCAG automatique

```typescript
describe('Conformité WCAG automatique', () => {
  test('A11Y-AXE-01 : 0 violation WCAG 2.1 AA dans le hero', async ({ page }) => {
    const results = await auditHero(page)

    expect(
      results.violations,
      formatViolations(results.violations)
    ).toEqual([])
  })

  test('A11Y-AXE-04 : 0 violation sur la page entière', async ({ page }) => {
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

    const headingViolation = results.violations.find(
      (v) => v.id === 'heading-order'
    )
    expect(headingViolation).toBeUndefined()
  })

  test('A11Y-AXE-08 : pas de violation color-contrast', async ({ page }) => {
    const results = await auditHero(page)

    const contrastViolation = results.violations.find(
      (v) => v.id === 'color-contrast'
    )
    expect(contrastViolation).toBeUndefined()
  })
})
```

#### Navigation clavier

```typescript
describe('Navigation clavier', () => {
  test('A11Y-KB-01 : Tab atteint le CTA "Explorer le Framework"', async ({ page }) => {
    // Focus le body d'abord
    await page.locator('body').click()

    await page.keyboard.press('Tab')

    const focused = page.locator(':focus')
    await expect(focused).toHaveAttribute('href', '/framework')
    await expect(focused).toContainText('Explorer le Framework')
  })

  test('A11Y-KB-05 : ordre de tabulation logique CTA → sources', async ({ page }) => {
    await page.locator('body').click()

    // Tab 1 : CTA
    await page.keyboard.press('Tab')
    const cta = page.locator(':focus')
    await expect(cta).toHaveAttribute('href', '/framework')

    // Tab 2 : source McKinsey
    await page.keyboard.press('Tab')
    const source1 = page.locator(':focus')
    const href1 = await source1.getAttribute('href')
    expect(href1).toContain('mckinsey.com')

    // Tab 3 : source GitHub
    await page.keyboard.press('Tab')
    const source2 = page.locator(':focus')
    const href2 = await source2.getAttribute('href')
    expect(href2).toContain('github.blog')

    // Tab 4 : source Stack Overflow
    await page.keyboard.press('Tab')
    const source3 = page.locator(':focus')
    const href3 = await source3.getAttribute('href')
    expect(href3).toContain('stackoverflow.co')
  })

  test('A11Y-KB-06 : Shift+Tab revient en arrière', async ({ page }) => {
    // Naviguer jusqu'à la source McKinsey
    await page.locator('body').click()
    await page.keyboard.press('Tab') // CTA
    await page.keyboard.press('Tab') // Source 1

    // Shift+Tab revient au CTA
    await page.keyboard.press('Shift+Tab')
    const focused = page.locator(':focus')
    await expect(focused).toHaveAttribute('href', '/framework')
  })

  test('A11Y-KB-07 : Enter sur le CTA navigue vers /framework', async ({ page }) => {
    await page.locator('body').click()
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')

    await page.waitForURL('**/framework')
    expect(page.url()).toContain('/framework')
  })

  test('A11Y-KB-09 : pas de piège clavier dans le hero', async ({ page }) => {
    await page.locator('body').click()

    const focusedElements: string[] = []
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
      const tag = await page.evaluate(() => document.activeElement?.tagName)
      const href = await page.evaluate(() =>
        document.activeElement?.getAttribute('href')
      )
      focusedElements.push(`${tag}:${href}`)
    }

    // Le focus doit sortir du hero (pas de cycle infini dans les 4 liens)
    const uniqueElements = new Set(focusedElements)
    expect(uniqueElements.size).toBeGreaterThan(1) // Pas bloqué sur 1 élément
  })

  test('A11Y-KB-10 : éléments non interactifs ne reçoivent pas le focus', async ({ page }) => {
    await page.locator('body').click()

    const focusedTags: string[] = []
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
      const tag = await page.evaluate(() => document.activeElement?.tagName)
      if (tag) focusedTags.push(tag)
    }

    // Seuls les <a> et <button> doivent recevoir le focus par Tab
    const nonInteractiveTags = focusedTags.filter(
      (t) => !['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(t) && t !== 'BODY'
    )
    expect(nonInteractiveTags).toEqual([])
  })
})
```

#### Focus visible

```typescript
describe('Focus visible', () => {
  test('A11Y-FV-01 : CTA a un indicateur de focus visible', async ({ page }) => {
    const cta = page.locator('a[href="/framework"]')
    await cta.focus()

    const hasVisibleFocus = await cta.evaluate((el) => {
      const cs = window.getComputedStyle(el)
      const hasOutline = cs.outlineStyle !== 'none' && cs.outlineWidth !== '0px'
      const hasBoxShadow = cs.boxShadow !== 'none'
      return hasOutline || hasBoxShadow
    })

    expect(hasVisibleFocus).toBe(true)
  })

  test('A11Y-FV-03 : liens source ont un focus visible', async ({ page }) => {
    const sourceLinks = page.locator('#stats-section a[target="_blank"]')
    const count = await sourceLinks.count()

    expect(count).toBe(3)

    for (let i = 0; i < count; i++) {
      const link = sourceLinks.nth(i)
      await link.focus()

      const hasVisibleFocus = await link.evaluate((el) => {
        const cs = window.getComputedStyle(el)
        const hasOutline = cs.outlineStyle !== 'none' && cs.outlineWidth !== '0px'
        const hasBoxShadow = cs.boxShadow !== 'none'
        return hasOutline || hasBoxShadow
      })

      expect(hasVisibleFocus).toBe(true)
    }
  })
})
```

#### Landmarks et structure ARIA

```typescript
describe('Landmarks et structure ARIA', () => {
  test('A11Y-LM-01 : la page contient un <main>', async ({ page }) => {
    const main = page.locator('main')
    await expect(main).toHaveCount(1)
  })

  test('A11Y-LM-06 : 3 sections identifiées comme régions', async ({ page }) => {
    const regions = page.getByRole('region')
    await expect(regions).toHaveCount(3) // hero, benefits, stats
  })

  test('A11Y-LM-07 : chaque région a un nom accessible', async ({ page }) => {
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

  test('A11Y-LM-08 : 3 articles dans la section bénéfices', async ({ page }) => {
    const articles = page.locator('#benefits-section article')
    await expect(articles).toHaveCount(3)
  })
})
```

#### Hiérarchie des headings

```typescript
describe('Hiérarchie des headings', () => {
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

  test('A11Y-HD-04 : h2 "Bénéfices clés" et "Chiffres clés" accessibles', async ({ page }) => {
    const benefitsH2 = page.getByRole('heading', { name: /bénéfices clés/i, level: 2 })
    await expect(benefitsH2).toHaveCount(1)

    const statsH2 = page.getByRole('heading', { name: /chiffres clés/i, level: 2 })
    await expect(statsH2).toHaveCount(1)
  })

  test('A11Y-HD-06 : exactement 3 headings de niveau 3', async ({ page }) => {
    const h3s = page.locator('#hero').getByRole('heading', { level: 3 })
    await expect(h3s).toHaveCount(3)
  })

  test('A11Y-HD-07 : les h3 sont les titres des bénéfices', async ({ page }) => {
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
})
```

#### Contenu non textuel

```typescript
describe('Contenu non textuel', () => {
  test('A11Y-NT-01 : icônes SVG des BenefitCards ont aria-hidden', async ({ page }) => {
    const svgs = page.locator('#benefits-section article svg')
    const count = await svgs.count()

    expect(count).toBe(3)

    for (let i = 0; i < count; i++) {
      await expect(svgs.nth(i)).toHaveAttribute('aria-hidden', 'true')
    }
  })

  test('A11Y-NT-02 : icône SVG du CTA a aria-hidden', async ({ page }) => {
    const ctaSvg = page.locator('a[href="/framework"] svg')
    await expect(ctaSvg).toHaveAttribute('aria-hidden', 'true')
  })

  test('A11Y-NT-04 : CTA a un nom accessible sans l\'icône', async ({ page }) => {
    const cta = page.getByRole('link', { name: 'Explorer le Framework' })
    await expect(cta).toHaveCount(1)
  })
})
```

#### Responsive et zoom

```typescript
describe('Responsive et zoom', () => {
  test('A11Y-RZ-01 : 0 violation axe-core sur mobile (375×667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const results = await new AxeBuilder({ page })
      .include('#hero')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(results.violations, formatViolations(results.violations)).toEqual([])
  })

  test('A11Y-RZ-04 : pas de scroll horizontal à 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 })
    await page.goto('/')

    const hasHorizontalScroll = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
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

  test('A11Y-RZ-07 : zoom 200% — contenu lisible', async ({ page }) => {
    await page.goto('/')

    // Simuler un zoom à 200%
    await page.evaluate(() => {
      document.documentElement.style.zoom = '2'
    })

    // Le h1 et le CTA doivent rester visibles
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()

    const cta = page.locator('a[href="/framework"]')
    await expect(cta).toBeVisible()
  })

  test('A11Y-RZ-10 : grilles passent en 1 colonne sur mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Vérifier que les cartes sont empilées verticalement
    const articles = page.locator('#benefits-section article')
    const count = await articles.count()

    if (count >= 2) {
      const box0 = await articles.nth(0).boundingBox()
      const box1 = await articles.nth(1).boundingBox()

      // En 1 colonne : la 2ème carte est en dessous (y plus grand)
      expect(box1!.y).toBeGreaterThan(box0!.y)
      // Et elles ont la même position x (même colonne)
      expect(Math.abs(box0!.x - box1!.x)).toBeLessThan(10)
    }
  })
})
```

#### Langue et métadonnées

```typescript
describe('Langue et métadonnées', () => {
  test('A11Y-LANG-01 : html a lang="fr"', async ({ page }) => {
    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('fr')
  })

  test('A11Y-LANG-02 : title contient un texte descriptif', async ({ page }) => {
    const title = await page.title()
    expect(title.length).toBeGreaterThan(10)
    expect(title).toContain('AIAD')
  })

  test('A11Y-LANG-03 : meta description présente', async ({ page }) => {
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content')

    expect(description).toBeTruthy()
    expect(description!.length).toBeGreaterThan(20)
  })
})
```

#### Texte sr-only

```typescript
describe('Texte sr-only', () => {
  test('A11Y-SR-01 : h2 "Bénéfices clés" accessible mais visuellement caché', async ({ page }) => {
    // Accessible via getByRole (screen reader)
    const heading = page.getByRole('heading', { name: /bénéfices clés/i, level: 2 })
    await expect(heading).toHaveCount(1)

    // Visuellement caché (classe sr-only)
    await expect(heading).toHaveClass(/sr-only/)
  })

  test('A11Y-SR-04 : textes sr-only visuellement invisibles', async ({ page }) => {
    const srOnlyElements = page.locator('#hero .sr-only')
    const count = await srOnlyElements.count()

    expect(count).toBeGreaterThanOrEqual(2) // Au moins les 2 h2

    for (let i = 0; i < count; i++) {
      const box = await srOnlyElements.nth(i).boundingBox()

      // sr-only : dimensions 1×1px, overflow hidden
      if (box) {
        expect(box.width).toBeLessThanOrEqual(1)
        expect(box.height).toBeLessThanOrEqual(1)
      }
    }
  })
})
```

### 7.5 Assertions types utilisées

| Assertion | Usage | Exemple |
|-----------|-------|---------|
| `expect(violations).toEqual([])` | 0 violation axe-core | Scan WCAG complet |
| `expect(violation).toBeUndefined()` | Règle spécifique non violée | `heading-order` |
| `await expect(locator).toHaveCount(n)` | Nombre d'éléments | 3 régions, 1 h1 |
| `await expect(locator).toContainText(s)` | Texte accessible | Contenu des headings |
| `await expect(locator).toHaveAttribute(k, v)` | Attribut HTML | `aria-hidden="true"` |
| `await expect(locator).toHaveClass(regex)` | Classe CSS | `sr-only` |
| `await expect(locator).toBeVisible()` | Visibilité | CTA sur mobile |
| `expect(href).toContain(s)` | URL d'un lien | Source URL |
| `expect(box.y).toBeGreaterThan(n)` | Position géométrique | Layout mobile 1 colonne |
| `expect(hasVisibleFocus).toBe(true)` | Focus visible calculé | Indicateur de focus |

### 7.6 Commandes d'exécution

```bash
# Installer les dépendances de test a11y
pnpm add -D @playwright/test @axe-core/playwright
pnpm exec playwright install chromium

# Exécuter les tests a11y uniquement
pnpm exec playwright test tests/a11y/hero-section.a11y.test.ts

# Exécuter sur un viewport spécifique
pnpm exec playwright test tests/a11y/ --project=mobile

# Avec le rapport HTML
pnpm exec playwright test tests/a11y/ --reporter=html

# Mode debug (headed browser)
pnpm exec playwright test tests/a11y/ --headed --debug

# Mode UI (interactif)
pnpm exec playwright test tests/a11y/ --ui
```

---

## 8. Critères d'acceptation

- [ ] Les dépendances `@playwright/test` et `@axe-core/playwright` sont installées
- [ ] Le fichier `playwright.config.ts` est créé ou mis à jour avec les 3 projets (desktop, tablet, mobile)
- [ ] Le fichier `tests/a11y/hero-section.a11y.test.ts` existe
- [ ] Tous les ~87 tests passent avec `pnpm exec playwright test tests/a11y/`
- [ ] Les 11 catégories de tests sont implémentées
- [ ] axe-core retourne 0 violation WCAG 2.1 AA sur `#hero` (desktop, tablette, mobile)
- [ ] axe-core retourne 0 violation WCAG 2.1 AA sur la page entière
- [ ] La navigation clavier fonctionne : Tab parcourt CTA → 3 liens source dans l'ordre
- [ ] Shift+Tab fonctionne en sens inverse
- [ ] Enter sur le CTA navigue vers `/framework`
- [ ] Chaque élément focusable a un indicateur de focus visible (outline ou ring)
- [ ] Les indicateurs de focus ont un contraste suffisant (≥ 3:1) contre le fond
- [ ] Les 3 régions ARIA (hero, benefits, stats) sont nommées et navigables
- [ ] La hiérarchie des headings est stricte : h1 → h2 → h3 sans saut
- [ ] Les headings sr-only sont accessibles aux technologies d'assistance
- [ ] Les icônes SVG ont `aria-hidden="true"` et ne polluent pas l'arbre d'accessibilité
- [ ] Les liens `target="_blank"` ont un texte sr-only "(ouvre dans un nouvel onglet)"
- [ ] `<html lang="fr">` est défini
- [ ] Pas de scroll horizontal à 320px de large
- [ ] Le CTA reste visible et fonctionnel sur mobile et au zoom 200%
- [ ] Les grilles benefits/stats passent en 1 colonne sur mobile
- [ ] 0 erreur TypeScript (`pnpm typecheck`)

---

## 9. Notes d'implémentation

### 9.1 Distinction avec T-001-T3

Le fichier `tests/integration/hero-section.integration.test.ts` (T-001-T3) vérifie la structure HTML statique par assertions string. T-001-T4 la complète en vérifiant le **rendu réel dans le navigateur** :

| Aspect | T-001-T3 (intégration, Vitest) | T-001-T4 (a11y, Playwright) |
|--------|-------------------------------|----------------------------|
| ARIA attributes | `toContain('aria-labelledby="..."')` | `getByRole('region', { name })` |
| Headings | `countOccurrences('<h1')` | `getByRole('heading', { level: 1 })` |
| Contraste | Non vérifiable | axe-core `color-contrast` avec styles calculés |
| Focus | `toContain('focus:ring-2')` en CSS class | `getComputedStyle` vérifie l'outline/shadow réel |
| Clavier | Non vérifiable | `page.keyboard.press('Tab')` + vérification focus |
| sr-only | `toContain('class="sr-only"')` | `boundingBox()` vérifie dimensions 1×1px |
| Responsive | Non testé | `setViewportSize` + assertions visuelles |

### 9.2 Ordre de développement recommandé

1. Installer les dépendances : `pnpm add -D @playwright/test @axe-core/playwright`
2. Installer le navigateur : `pnpm exec playwright install chromium`
3. Créer `playwright.config.ts` avec la configuration web server
4. Créer `tests/a11y/hero-section.a11y.test.ts`
5. Implémenter les helpers (`auditHero`, `formatViolations`, `checkFocusVisible`)
6. Catégorie par catégorie, dans cet ordre :
   - a) Conformité WCAG automatique (A11Y-AXE) — le plus critique
   - b) Landmarks et structure (A11Y-LM)
   - c) Hiérarchie headings (A11Y-HD)
   - d) Navigation clavier (A11Y-KB)
   - e) Focus visible (A11Y-FV)
   - f) Contenu non textuel (A11Y-NT)
   - g) Liens (A11Y-LK)
   - h) Contraste (A11Y-CC) — largement couvert par axe-core
   - i) Responsive/zoom (A11Y-RZ)
   - j) Langue/métadonnées (A11Y-LANG)
   - k) Texte sr-only (A11Y-SR)
7. Vérifier que tous les tests passent : `pnpm exec playwright test tests/a11y/`
8. Corriger les éventuelles violations axe-core dans les composants source

### 9.3 Gestion des violations axe-core

Si axe-core détecte des violations, voici la procédure :

1. **Identifier** la violation (ex: `color-contrast` sur `text-gray-500`)
2. **Localiser** le composant source (ex: `StatDisplay.astro:201`)
3. **Corriger** le style dans le composant (ex: `text-gray-500` → `text-gray-600`)
4. **Re-tester** : `pnpm exec playwright test tests/a11y/ -g "AXE"`
5. **Vérifier** que la correction ne casse pas les tests T-001-T2 et T-001-T3

> **Violation probable** : `text-gray-500` (#6B7280) sur fond blanc (#FFFFFF) a un ratio de 4.6:1. C'est au-dessus du seuil 4.5:1 mais de justesse. `text-blue-500` (#3B82F6) sur fond blanc a un ratio de 4.5:1, ce qui est à la limite. Un ajustement vers `text-blue-600` (#2563EB, ratio 4.6:1) peut être nécessaire.

### 9.4 Scripts npm suggérés

Ajouter au `package.json` :

```json
{
  "scripts": {
    "test:a11y": "playwright test tests/a11y/",
    "test:a11y:headed": "playwright test tests/a11y/ --headed",
    "test:a11y:mobile": "playwright test tests/a11y/ --project=mobile",
    "test:a11y:report": "playwright test tests/a11y/ --reporter=html && playwright show-report"
  }
}
```

### 9.5 Relation avec les autres tâches de test

| Tâche | Relation avec T-001-T4 |
|-------|------------------------|
| T-001-T1 (tests schémas Zod) | Valide les données en amont. Pas de lien direct. |
| T-001-T2 (tests unitaires) | Vérifie les attributs ARIA en HTML string. T-001-T4 les valide dans le navigateur. |
| T-001-T3 (tests intégration) | Vérifie l'arbre HTML assemblé. T-001-T4 vérifie l'arbre d'accessibilité réel. |
| **T-001-T4 (cette tâche)** | Valide l'accessibilité dans un navigateur réel via Playwright + axe-core. |
| T-001-T5 (tests utilisateur) | Valide l'expérience utilisateur (temps de lecture). Dépend de T-001-T4. |

### 9.6 Contraintes et limites

- **axe-core ne couvre que ~57% des critères WCAG** automatiquement. Les tests manuels clavier, focus et responsive complètent la couverture.
- **`page.accessibility.snapshot()`** est un API Chromium-spécifique. Les assertions basées sur `getByRole` sont préférées car plus portables.
- **Le serveur de dev Astro** doit tourner pendant les tests. Le `webServer` dans `playwright.config.ts` s'en charge automatiquement.
- **Le zoom CSS (`document.documentElement.style.zoom`)** n'est pas identique au zoom navigateur natif. Les tests de zoom sont des approximations.
- **Les violations `color-contrast` d'axe-core** peuvent varier selon le rendu du navigateur (anti-aliasing, subpixel rendering). En cas de ratio limite (4.5–4.6:1), préférer une marge de sécurité.

---

## 10. Références WCAG

### Critères WCAG 2.1 AA couverts

| Critère | Nom | Catégorie de test |
|---------|-----|-------------------|
| 1.1.1 | Non-text Content | A11Y-NT |
| 1.3.1 | Info and Relationships | A11Y-LM, A11Y-HD, A11Y-SR |
| 1.3.2 | Meaningful Sequence | A11Y-KB (ordre de tab) |
| 1.4.3 | Contrast (Minimum) | A11Y-CC, A11Y-AXE |
| 1.4.4 | Resize Text | A11Y-RZ (zoom) |
| 1.4.10 | Reflow | A11Y-RZ (320px) |
| 1.4.11 | Non-text Contrast | A11Y-FV (focus indicators) |
| 2.1.1 | Keyboard | A11Y-KB |
| 2.1.2 | No Keyboard Trap | A11Y-KB-09 |
| 2.4.2 | Page Titled | A11Y-LANG-02 |
| 2.4.3 | Focus Order | A11Y-KB-05 |
| 2.4.4 | Link Purpose (In Context) | A11Y-LK |
| 2.4.6 | Headings and Labels | A11Y-HD |
| 2.4.7 | Focus Visible | A11Y-FV |
| 3.1.1 | Language of Page | A11Y-LANG-01 |
| 4.1.2 | Name, Role, Value | A11Y-NT, A11Y-LK |

---

## 11. Références

| Ressource | Lien |
|-----------|------|
| US-001 Spec | [spec.md](./spec.md) |
| T-001-F8 HeroSection | [T-001-F8-composant-HeroSection.md](./T-001-F8-composant-HeroSection.md) |
| T-001-F9 Intégration | [T-001-F9-integration-page-accueil.md](./T-001-F9-integration-page-accueil.md) |
| T-001-T2 Tests unitaires | [T-001-T2-tests-unitaires-composants.md](./T-001-T2-tests-unitaires-composants.md) |
| T-001-T3 Tests intégration | [T-001-T3-tests-integration-HeroSection.md](./T-001-T3-tests-integration-HeroSection.md) |
| Architecture | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| HeroSection source | `src/components/hero/HeroSection.astro` |
| CTAButton source | `src/components/common/CTAButton.astro` |
| Page d'accueil | `src/pages/index.astro` |
| WCAG 2.1 AA | https://www.w3.org/TR/WCAG21/ |
| axe-core rules | https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md |
| Playwright accessibility | https://playwright.dev/docs/accessibility-testing |
| RGAA 4.1 | https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/ |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 09/02/2026 | Création initiale — Spécification complète des tests d'accessibilité HeroSection |
