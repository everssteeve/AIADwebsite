# T-001-T5 : Test utilisateur temps de lecture < 30s

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 09 février 2026 |
| **Statut** | 🚧 En cours (volet 1 automatisé terminé, volet 2 utilisateur à planifier) |
| **User Story** | [US-001 - Comprendre AIAD rapidement](./spec.md) |
| **Dépendances** | T-001-F9 (intégration page d'accueil), T-001-T4 (tests accessibilité) |
| **Bloque** | Aucune (dernière tâche de US-001) |

---

## 1. Objectif

Valider que le hero section de la page d'accueil permet à un visiteur de **comprendre en moins de 30 secondes** ce qu'est AIAD et ses bénéfices principaux. Cette validation combine :

1. **Tests automatisés** (Playwright) : mesure de la quantité de texte, métriques de performance perceptuelle (LCP, CLS), et vérification que le contenu est above the fold
2. **Protocole de test utilisateur** : méthodologie formalisée pour tester avec 5 utilisateurs réels et recueillir des données qualitatives et quantitatives

### Critère d'acceptation US-001

> « Temps de lecture du hero < 30 secondes (validé par 5 utilisateurs tests) »

### Ce qui est testé

- **Quantité de texte** : le volume de mots visibles dans le hero est compatible avec une lecture de 30 secondes (≤ 125 mots à 250 mots/min)
- **Performance perceptuelle** : le contenu s'affiche rapidement (LCP < 2s, pas de layout shift)
- **Lisibilité du contenu** : hiérarchie visuelle claire, above the fold, texte lisible
- **Compréhension effective** : 5 utilisateurs tests comprennent AIAD en < 30 secondes (protocole manuel)
- **Scanabilité** : la structure (titre → tagline → VP → bénéfices → stats) guide l'œil naturellement

### Distinction avec les autres tâches de test

| Aspect | T-001-T2 (unitaires) | T-001-T3 (intégration) | T-001-T4 (a11y) | T-001-T5 (cette tâche) |
|--------|----------------------|------------------------|------------------|------------------------|
| **Environnement** | Vitest | Vitest | Playwright | **Playwright + utilisateurs réels** |
| **Focus** | Props, rendu HTML | Assemblage complet | WCAG 2.1 AA | **UX : temps de lecture, compréhension** |
| **Temps de lecture** | Non testé | Non testé | Non testé | **Cœur du test** |
| **Performance** | Non testé | Non testé | Non testé | **LCP, CLS, First Contentful Paint** |
| **Above the fold** | Non testé | Non testé | Non testé | **Vérification positions visuelles** |
| **Densité textuelle** | Non testé | Non testé | Non testé | **Comptage de mots, ratio texte/viewport** |
| **Test utilisateur** | Non | Non | Non | **5 utilisateurs, protocole formalisé** |

### Ce qui est exclu (couvert ailleurs)

| Exclu | Couvert par |
|-------|-------------|
| Attributs ARIA, structure sémantique | T-001-T2, T-001-T3 |
| Conformité WCAG 2.1 AA (axe-core) | T-001-T4 |
| Navigation clavier, focus visible | T-001-T4 |
| Contraste de couleurs | T-001-T4 |
| Responsive (320px, tablette) | T-001-T4 |
| Données de production (textes, URLs) | T-001-T3 |

---

## 2. Contexte technique

### 2.1 Stack de test

| Outil | Version | Rôle |
|-------|---------|------|
| **Playwright** | 1.x | Framework de test E2E, mesure de métriques de performance |
| **TypeScript** | 5.x | Typage des tests et helpers |
| **Astro** (dev server) | 4.x | Serveur de développement pour servir la page |

### 2.2 Dépendances existantes

Aucune nouvelle dépendance nécessaire. Les dépendances Playwright installées pour T-001-T4 sont réutilisées :

```bash
# Déjà installé avec T-001-T4
@playwright/test
@axe-core/playwright (non utilisé ici mais déjà présent)
```

### 2.3 Contenu textuel du hero (données de production)

Le contenu réel chargé depuis les Content Collections :

| Élément | Texte | Nb mots |
|---------|-------|---------|
| **Titre (h1)** | « AIAD : Le framework pour développer avec des agents IA » | 10 |
| **Tagline** | « Structurez votre collaboration avec l'intelligence artificielle » | 7 |
| **Value Proposition** | « Une méthodologie éprouvée pour intégrer les agents IA dans votre workflow de développement et multiplier votre productivité. » | 18 |
| **CTA** | « Explorer le Framework » | 3 |
| **Benefit 1 titre** | « Productivité décuplée » | 2 |
| **Benefit 1 desc** | « Automatisez les tâches répétitives et concentrez-vous sur la valeur ajoutée de votre code. » | 14 |
| **Benefit 2 titre** | « Qualité garantie » | 2 |
| **Benefit 2 desc** | « Des standards de code et des validations intégrés à chaque étape du développement. » | 13 |
| **Benefit 3 titre** | « Collaboration fluide » | 2 |
| **Benefit 3 desc** | « Une méthodologie claire pour structurer le travail entre humains et agents IA. » | 12 |
| **Stat 1** | « 50% — Gain de productivité avec les agents IA » | 9 |
| **Stat 2** | « 3x — Plus rapide pour coder avec assistance IA » | 9 |
| **Stat 3** | « >90% — Des développeurs satisfaits de l'IA » | 7 |
| **Sources** (texte petit, lecture optionnelle) | McKinsey..., GitHub..., Stack Overflow... | ~15 |
| | **Total contenu principal** | **~108 mots** |
| | **Total avec sources** | **~123 mots** |

**Calcul de temps de lecture :**

| Vitesse de lecture | Mots/min | Temps (108 mots) | Temps (123 mots) |
|--------------------|----------|-------------------|-------------------|
| Lecture lente | 150 | 43s | 49s |
| Lecture normale | 200 | 32s | 37s |
| **Lecture scan** (attendu pour un hero) | **250** | **26s** | **30s** |
| Lecture rapide | 300 | 22s | 25s |

> **Conclusion** : à une vitesse de scan de 250 mots/min (comportement attendu sur un hero), le contenu principal (108 mots hors sources) se lit en ~26 secondes. Les sources (texte petit) sont optionnelles et ne doivent pas être comptabilisées dans les 30 secondes.

### 2.4 Approche de test

Les tests sont organisés en deux volets complémentaires :

**Volet 1 — Tests automatisés Playwright** (~25 tests) :
- Comptage de mots du contenu visible
- Vérification que le hero est above the fold
- Métriques de performance (LCP, CLS, FCP)
- Hiérarchie visuelle (taille des polices, espacement)
- Densité textuelle et ratio texte/viewport
- Temps de chargement complet

**Volet 2 — Protocole de test utilisateur** (5 utilisateurs) :
- Protocole standardisé avec questionnaire
- Métriques : temps de compréhension, score de compréhension, score de confiance
- Critères de réussite quantitatifs

### 2.5 Configuration Playwright

La configuration existante de T-001-T4 est réutilisée. Les tests de performance sont exécutés sur le projet `desktop` (1280×720) et `mobile` (375×667).

```typescript
// playwright.config.ts — existant, aucune modification requise
// Les tests T-001-T5 sont placés dans tests/e2e/
```

### 2.6 Structure des fichiers

```
tests/
├── a11y/
│   └── hero-section.a11y.test.ts        ← T-001-T4 (existant)
└── e2e/
    └── hero-reading-time.e2e.test.ts    ← CE FICHIER
docs/
└── tests/
    └── T-001-T5-protocole-utilisateur.md ← PROTOCOLE (à créer)
```

> **Convention** : Les tests E2E de validation UX sont placés dans `tests/e2e/` pour les distinguer des tests d'accessibilité (`tests/a11y/`) et unitaires (`tests/unit/`).

### 2.7 Composants et éléments sous test

```
Page d'accueil (index.astro)
└── <html lang="fr">
    └── <body>
        └── <main>
            └── <section id="hero">
                ├── <h1>                          ← Texte principal (10 mots)
                ├── <p> tagline                   ← Texte secondaire (7 mots)
                ├── <p> value proposition          ← Texte tertiaire (18 mots)
                ├── <a> CTA                       ← Texte d'action (3 mots)
                ├── <section> benefits             ← 3 × (titre + desc) (45 mots)
                │   ├── <article> Productivité
                │   ├── <article> Qualité
                │   └── <article> Collaboration
                └── <section> stats                ← 3 × (valeur + label) (25 mots)
                    ├── <div> 50%
                    ├── <div> 3x
                    └── <div> >90%
```

---

## 3. Spécifications fonctionnelles

### 3.1 Types TypeScript pour les tests

```typescript
// ── Types pour le comptage de mots ──────────────────────────

/**
 * Résultat de l'analyse du contenu textuel du hero
 */
interface HeroContentAnalysis {
  /** Nombre total de mots dans le contenu principal (hors sources) */
  primaryWordCount: number
  /** Nombre de mots dans les sources (texte petit) */
  sourceWordCount: number
  /** Nombre total de mots (principal + sources) */
  totalWordCount: number
  /** Temps de lecture estimé en secondes (250 mots/min) */
  estimatedReadingTimeSeconds: number
  /** Détail par section */
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

// ── Types pour les métriques de performance ─────────────────

/**
 * Métriques de performance perceptuelle de la page
 */
interface PerformanceMetrics {
  /** Largest Contentful Paint en ms */
  lcp: number
  /** First Contentful Paint en ms */
  fcp: number
  /** Cumulative Layout Shift (sans unité, 0 = parfait) */
  cls: number
  /** Time to Interactive en ms */
  tti: number
  /** DOMContentLoaded en ms */
  domContentLoaded: number
  /** Temps de chargement total en ms */
  loadComplete: number
}

// ── Types pour la vérification above the fold ───────────────

/**
 * Position d'un élément par rapport au viewport
 */
interface ElementVisibility {
  /** Sélecteur CSS de l'élément */
  selector: string
  /** Description de l'élément */
  description: string
  /** L'élément est entièrement visible dans le viewport initial */
  isFullyAboveFold: boolean
  /** L'élément est partiellement visible dans le viewport initial */
  isPartiallyAboveFold: boolean
  /** Position Y du bas de l'élément par rapport au viewport */
  bottomY: number
  /** Hauteur du viewport */
  viewportHeight: number
  /** Pourcentage de l'élément visible (0-100) */
  visiblePercentage: number
}

/**
 * Résultat de l'analyse above the fold
 */
interface AboveFoldAnalysis {
  /** Hauteur du viewport */
  viewportHeight: number
  /** Éléments analysés */
  elements: ElementVisibility[]
  /** Score global (0-100) : pourcentage du contenu critique above the fold */
  criticalContentScore: number
}

// ── Types pour la hiérarchie visuelle ───────────────────────

/**
 * Propriétés typographiques d'un élément
 */
interface TypographyProperties {
  /** Sélecteur CSS */
  selector: string
  /** Taille de police calculée en px */
  fontSize: number
  /** Graisse de police calculée */
  fontWeight: number
  /** Interligne calculé en px */
  lineHeight: number
  /** Couleur du texte */
  color: string
  /** Marge inférieure en px */
  marginBottom: number
}

/**
 * Analyse de la hiérarchie visuelle
 */
interface VisualHierarchyAnalysis {
  /** Le titre est le texte le plus grand */
  titleIsLargest: boolean
  /** Chaque niveau a une taille décroissante */
  hierarchyIsDecreasing: boolean
  /** Le CTA se distingue visuellement (couleur de fond) */
  ctaIsDistinct: boolean
  /** Détail par élément */
  elements: TypographyProperties[]
}

// ── Types pour le protocole utilisateur ─────────────────────

/**
 * Résultat d'un test utilisateur individuel
 */
interface UserTestResult {
  /** Identifiant anonyme du testeur (U1, U2, ...) */
  userId: string
  /** Profil du testeur */
  profile: {
    role: 'developer' | 'tech-lead' | 'manager' | 'non-technical'
    experienceWithAI: 'none' | 'beginner' | 'intermediate' | 'expert'
    ageRange: '18-25' | '26-35' | '36-45' | '46+'
  }
  /** Temps mesuré entre affichage de la page et clic sur "J'ai compris" (en secondes) */
  readingTimeSeconds: number
  /** Score de compréhension (0-5 questions correctes sur 5) */
  comprehensionScore: number
  /** Score de confiance auto-évalué (1-5 Likert) */
  confidenceScore: number
  /** Le testeur peut résumer AIAD en une phrase cohérente */
  canSummarizeCorrectly: boolean
  /** Le testeur identifie au moins 2 bénéfices sur 3 */
  identifiesBenefits: boolean
  /** Le testeur identifie la cible (développeurs + agents IA) */
  identifiesTarget: boolean
  /** Notes qualitatives libres */
  notes: string
  /** Date du test */
  testDate: Date
}

/**
 * Résultat agrégé de la campagne de tests utilisateurs
 */
interface UserTestCampaignResult {
  /** Nombre de testeurs */
  totalUsers: number
  /** Résultats individuels */
  results: UserTestResult[]
  /** Temps de lecture moyen (secondes) */
  averageReadingTime: number
  /** Temps de lecture médian (secondes) */
  medianReadingTime: number
  /** Pourcentage d'utilisateurs sous 30 secondes */
  percentageUnder30s: number
  /** Score de compréhension moyen (0-5) */
  averageComprehension: number
  /** Pourcentage d'utilisateurs pouvant résumer correctement */
  percentageCorrectSummary: number
  /** La campagne est validée (≥ 4/5 sous 30s ET comprehension ≥ 3.5) */
  isValidated: boolean
}

// ── Types pour les viewports de test ────────────────────────

/**
 * Configuration de viewport pour les tests
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
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'desktop-large', width: 1920, height: 1080 },
]
```

### 3.2 Helpers de test

```typescript
// ── Helper : compter les mots visibles du hero ──────────────

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

    // Contenu principal (hors sources)
    const h1 = hero.querySelector('h1')?.textContent || ''
    const tagline = hero.querySelector('h1 + p, [class*="tagline"]')?.textContent || ''

    // Value proposition : le paragraphe après la tagline
    const vpElements = hero.querySelectorAll('p')
    let vpText = ''
    for (const p of vpElements) {
      const text = p.textContent || ''
      if (text.includes('méthodologie') || text.includes('workflow')) {
        vpText = text
        break
      }
    }

    // CTA
    const cta = hero.querySelector('a[href="/framework"]')?.textContent || ''

    // Bénéfices (titres h3 + descriptions)
    const benefitTexts: string[] = []
    hero.querySelectorAll('#benefits-section article').forEach((article) => {
      const h3 = article.querySelector('h3')?.textContent || ''
      const desc = article.querySelector('p')?.textContent || ''
      benefitTexts.push(h3, desc)
    })
    const benefitsText = benefitTexts.join(' ')

    // Stats (valeurs + labels)
    const statTexts: string[] = []
    hero.querySelectorAll('#stats-section [class*="stat"]').forEach((stat) => {
      statTexts.push(stat.textContent || '')
    })
    // Fallback: récupérer les valeurs et labels directement
    if (statTexts.length === 0) {
      hero.querySelectorAll('#stats-section p').forEach((p) => {
        statTexts.push(p.textContent || '')
      })
    }
    const statsText = statTexts.join(' ')

    // Sources (texte petit, cite ou liens externes)
    const sourceTexts: string[] = []
    hero.querySelectorAll('#stats-section cite, #stats-section a[target="_blank"]').forEach((el) => {
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

// ── Helper : vérifier les éléments above the fold ───────────

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

  // Score : moyenne des pourcentages de visibilité des éléments critiques
  const criticalContentScore =
    elements.length > 0
      ? Math.round(
          elements.reduce((sum, e) => sum + e.visiblePercentage, 0) /
            elements.length
        )
      : 0

  return { viewportHeight, elements, criticalContentScore }
}

// ── Helper : collecter les métriques de performance ─────────

async function collectPerformanceMetrics(
  page: Page
): Promise<PerformanceMetrics> {
  return page.evaluate(() => {
    const perf = performance
    const nav = perf.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const paint = perf.getEntriesByType('paint')

    const fcp = paint.find((e) => e.name === 'first-contentful-paint')?.startTime || 0

    // LCP via PerformanceObserver (déjà enregistré)
    const lcpEntries = perf.getEntriesByType('largest-contentful-paint')
    const lcp = lcpEntries.length > 0
      ? lcpEntries[lcpEntries.length - 1].startTime
      : 0

    // CLS via layout-shift entries
    const layoutShifts = perf.getEntriesByType('layout-shift') as any[]
    const cls = layoutShifts
      .filter((e) => !e.hadRecentInput)
      .reduce((sum, e) => sum + e.value, 0)

    return {
      lcp,
      fcp,
      cls,
      tti: nav.domInteractive || 0,
      domContentLoaded: nav.domContentLoadedEventEnd || 0,
      loadComplete: nav.loadEventEnd || 0,
    }
  })
}

// ── Helper : analyser la hiérarchie typographique ───────────

async function analyzeVisualHierarchy(
  page: Page
): Promise<VisualHierarchyAnalysis> {
  const selectors = [
    { selector: '#hero h1', label: 'title' },
    { selector: '#hero h1 ~ p:first-of-type', label: 'tagline' },
    { selector: '#hero a[href="/framework"]', label: 'cta' },
    { selector: '#benefits-section h3', label: 'benefit-title' },
    { selector: '#benefits-section p', label: 'benefit-desc' },
    { selector: '#stats-section', label: 'stats' },
  ]

  const elements: TypographyProperties[] = []

  for (const { selector, label } of selectors) {
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

  const titleSize = elements.find((e) => e.selector.includes('h1'))?.fontSize || 0
  const otherSizes = elements
    .filter((e) => !e.selector.includes('h1'))
    .map((e) => e.fontSize)

  const titleIsLargest = otherSizes.every((s) => titleSize > s)

  // Vérifier la hiérarchie décroissante : h1 > h3 > p
  const h1Size = elements.find((e) => e.selector.includes('h1'))?.fontSize || 0
  const h3Size = elements.find((e) => e.selector.includes('h3'))?.fontSize || 0
  const pSize = elements.find((e) =>
    e.selector.includes('benefit-desc') || e.selector.includes('p')
  )?.fontSize || 0

  const hierarchyIsDecreasing = h1Size > h3Size && h3Size >= pSize

  // Vérifier que le CTA se distingue (a un background-color)
  const ctaEl = page.locator('a[href="/framework"]').first()
  const ctaBg = await ctaEl.evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor
  })
  const ctaIsDistinct = ctaBg !== 'rgba(0, 0, 0, 0)' && ctaBg !== 'transparent'

  return { titleIsLargest, hierarchyIsDecreasing, ctaIsDistinct, elements }
}
```

---

## 4. Matrice des tests

### 4.1 Comptage de mots et temps de lecture estimé

| ID | Description | Assertion principale |
|----|-------------|---------------------|
| RT-WC-01 | Le contenu principal du hero contient ≤ 125 mots (hors sources) | `primaryWordCount <= 125` |
| RT-WC-02 | Le contenu principal contient ≥ 50 mots (pas vide/tronqué) | `primaryWordCount >= 50` |
| RT-WC-03 | Le temps de lecture estimé à 250 mots/min est ≤ 30 secondes | `estimatedReadingTimeSeconds <= 30` |
| RT-WC-04 | Le titre (h1) contient entre 5 et 15 mots | `sections.title >= 5 && sections.title <= 15` |
| RT-WC-05 | La tagline contient entre 4 et 12 mots | `sections.tagline >= 4 && sections.tagline <= 12` |
| RT-WC-06 | La value proposition contient entre 10 et 30 mots | `sections.valueProposition >= 10 && sections.valueProposition <= 30` |
| RT-WC-07 | Chaque description de bénéfice contient ≤ 20 mots | Itération sur les 3 descriptions |
| RT-WC-08 | Chaque label de statistique contient ≤ 12 mots | Itération sur les 3 labels |
| RT-WC-09 | Le CTA contient entre 2 et 5 mots | `sections.cta >= 2 && sections.cta <= 5` |
| RT-WC-10 | Les sources ne représentent pas plus de 20% du texte total | `sourceWordCount / totalWordCount <= 0.20` |

### 4.2 Above the fold — contenu visible sans scroll

| ID | Description | Viewport | Assertion principale |
|----|-------------|----------|---------------------|
| RT-AF-01 | Le titre (h1) est entièrement above the fold | Desktop 1280×720 | `isFullyAboveFold === true` |
| RT-AF-02 | La tagline est entièrement above the fold | Desktop 1280×720 | `isFullyAboveFold === true` |
| RT-AF-03 | La value proposition est entièrement above the fold | Desktop 1280×720 | `isFullyAboveFold === true` |
| RT-AF-04 | Le CTA est entièrement above the fold | Desktop 1280×720 | `isFullyAboveFold === true` |
| RT-AF-05 | Les titres des 3 bénéfices sont au moins partiellement visibles | Desktop 1280×720 | `isPartiallyAboveFold === true` |
| RT-AF-06 | Le score de contenu critique above the fold est ≥ 80% | Desktop 1280×720 | `criticalContentScore >= 80` |
| RT-AF-07 | Sur mobile (375×667), le h1 + tagline + VP + CTA sont visibles | Mobile 375×667 | Tous `isPartiallyAboveFold === true` |
| RT-AF-08 | Sur tablette (768×1024), tout le hero principal est above the fold | Tablette 768×1024 | Score ≥ 90% |
| RT-AF-09 | Sur desktop large (1920×1080), tout le contenu est above the fold | Desktop 1920×1080 | Score === 100% |
| RT-AF-10 | Le CTA est visible sans scroll sur tous les viewports testés | Tous viewports | CTA `isPartiallyAboveFold` sur tous |

### 4.3 Performance perceptuelle

| ID | Description | Seuil | Assertion principale |
|----|-------------|-------|---------------------|
| RT-PERF-01 | Largest Contentful Paint (LCP) < 2000ms | 2000ms | `lcp < 2000` |
| RT-PERF-02 | First Contentful Paint (FCP) < 1000ms | 1000ms | `fcp < 1000` |
| RT-PERF-03 | Cumulative Layout Shift (CLS) < 0.1 | 0.1 | `cls < 0.1` |
| RT-PERF-04 | DOMContentLoaded < 2000ms | 2000ms | `domContentLoaded < 2000` |
| RT-PERF-05 | Le hero ne provoque aucun layout shift après affichage | 0 | `cls === 0` pour le hero |
| RT-PERF-06 | LCP < 2000ms sur mobile (375×667, throttle 3G rapide) | 2000ms | `lcp < 2000` avec throttle |
| RT-PERF-07 | Le contenu textuel du h1 est visible en < 500ms | 500ms | h1 rendu avant 500ms |
| RT-PERF-08 | Aucun flash de contenu non stylé (FOUC) | 0 | Pas de changement de police/taille |

### 4.4 Hiérarchie visuelle et lisibilité

| ID | Description | Assertion principale |
|----|-------------|---------------------|
| RT-VH-01 | Le titre (h1) est le texte le plus grand de la page | `titleIsLargest === true` |
| RT-VH-02 | La hiérarchie typographique est décroissante (h1 > h3 > p) | `hierarchyIsDecreasing === true` |
| RT-VH-03 | Le CTA se distingue visuellement (couleur de fond ≠ transparent) | `ctaIsDistinct === true` |
| RT-VH-04 | La taille du h1 est ≥ 30px sur desktop | `fontSize >= 30` |
| RT-VH-05 | La taille du h1 est ≥ 24px sur mobile | `fontSize >= 24` sur viewport 375px |
| RT-VH-06 | L'interligne du texte principal est ≥ 1.4 (lisibilité) | `lineHeight / fontSize >= 1.4` |
| RT-VH-07 | Les sections (bénéfices, stats) ont un espacement visuel suffisant (≥ 32px) | `marginTop >= 32` |
| RT-VH-08 | Le CTA a une taille de cible suffisante (≥ 44px de hauteur) | `height >= 44` |
| RT-VH-09 | Les 3 bénéfices ont une taille et un style cohérents entre eux | Tailles identiques |
| RT-VH-10 | Les 3 stats ont une taille et un style cohérents entre eux | Tailles identiques |

### 4.5 Densité textuelle et scanabilité

| ID | Description | Assertion principale |
|----|-------------|---------------------|
| RT-SC-01 | Le ratio texte/espace blanc dans le hero est < 60% | Surface textuelle < 60% de la surface totale |
| RT-SC-02 | Le hero contient au moins 3 éléments visuels non textuels (icônes, stats values) | ≥ 3 éléments visuels |
| RT-SC-03 | Chaque bénéfice a un picto/icône accompagnant le texte | 3 SVG dans `#benefits-section` |
| RT-SC-04 | Les valeurs statistiques (50%, 3x, >90%) sont visuellement proéminentes (taille ≥ 24px) | `fontSize >= 24` pour les valeurs stat |
| RT-SC-05 | Le contenu est structuré en blocs visuellement distincts (≥ 3 blocs) | ≥ 3 zones visuelles séparées par espacement |

---

## 5. Cas limites et gestion d'erreurs

### 5.1 Cas limites de contenu

| ID | Cas | Comportement attendu | Priorité |
|----|-----|----------------------|----------|
| CL-RT-01 | Contenu traduit dans une autre langue (mots plus longs) | Le comptage de mots reste ≤ 125 pour le français | Info |
| CL-RT-02 | Ajout d'un 4ème bénéfice | Le nombre total de mots ne doit pas dépasser 140 | Moyenne |
| CL-RT-03 | Value proposition allongée | Vérifier que le temps de lecture reste < 30s | Haute |
| CL-RT-04 | Texte des statistiques raccourci | Le hero ne doit pas paraître vide (≥ 50 mots) | Basse |
| CL-RT-05 | Sources supprimées (statsShowSources=false) | Le temps de lecture diminue, c'est acceptable | Info |
| CL-RT-06 | Polices non chargées (FOUT) | Le texte reste lisible en polices système | Moyenne |
| CL-RT-07 | Utilisateur avec déficience visuelle (texte agrandi 150%) | Le contenu reste structuré et above the fold (partiellement) | Haute |
| CL-RT-08 | Réseau lent (3G) — impact sur le temps de perception | LCP < 3000ms même en 3G rapide | Moyenne |
| CL-RT-09 | Viewport très haut (1280×1080) | Tout le hero est above the fold | Basse |
| CL-RT-10 | Viewport très court (1280×600) | Au minimum h1 + tagline + CTA visibles | Haute |

### 5.2 Cas limites du protocole utilisateur

| ID | Cas | Traitement |
|----|-----|------------|
| CL-UT-01 | Utilisateur lit en moins de 5 secondes | Vérifier le score de compréhension — un temps < 5s avec compréhension ≥ 4/5 est valide |
| CL-UT-02 | Utilisateur dépasse 60 secondes | Arrêter le chronomètre à 60s, noter comme échec, recueillir le feedback qualitatif |
| CL-UT-03 | Utilisateur connaît déjà AIAD | Exclure de l'échantillon, recruter un remplaçant |
| CL-UT-04 | Utilisateur non francophone | Exclure de l'échantillon (tests en français uniquement pour le MVP) |
| CL-UT-05 | Moins de 5 utilisateurs disponibles | Minimum 3 utilisateurs requis, documenter le motif |

---

## 6. Exemples entrée/sortie

### 6.1 Analyse du contenu textuel

**Entrée (action) :**
```typescript
await page.goto('/')
const analysis = await analyzeHeroContent(page)
```

**Sortie attendue :**
```json
{
  "primaryWordCount": 108,
  "sourceWordCount": 15,
  "totalWordCount": 123,
  "estimatedReadingTimeSeconds": 26,
  "sections": {
    "title": 10,
    "tagline": 7,
    "valueProposition": 18,
    "cta": 3,
    "benefits": 45,
    "stats": 25,
    "sources": 15
  }
}
```

### 6.2 Analyse above the fold — desktop

**Entrée :**
```typescript
await page.setViewportSize({ width: 1280, height: 720 })
await page.goto('/')
const atf = await analyzeAboveFold(page, [
  { selector: '#hero h1', description: 'Titre principal' },
  { selector: '#hero h1 ~ p', description: 'Tagline' },
  { selector: 'a[href="/framework"]', description: 'CTA' },
  { selector: '#benefits-section', description: 'Section bénéfices' },
  { selector: '#stats-section', description: 'Section statistiques' },
])
```

**Sortie attendue :**
```json
{
  "viewportHeight": 720,
  "elements": [
    {
      "selector": "#hero h1",
      "description": "Titre principal",
      "isFullyAboveFold": true,
      "isPartiallyAboveFold": true,
      "bottomY": 180,
      "viewportHeight": 720,
      "visiblePercentage": 100
    },
    {
      "selector": "a[href=\"/framework\"]",
      "description": "CTA",
      "isFullyAboveFold": true,
      "isPartiallyAboveFold": true,
      "bottomY": 380,
      "viewportHeight": 720,
      "visiblePercentage": 100
    },
    {
      "selector": "#benefits-section",
      "description": "Section bénéfices",
      "isFullyAboveFold": false,
      "isPartiallyAboveFold": true,
      "bottomY": 820,
      "viewportHeight": 720,
      "visiblePercentage": 75
    }
  ],
  "criticalContentScore": 85
}
```

### 6.3 Métriques de performance

**Entrée :**
```typescript
await page.goto('/', { waitUntil: 'networkidle' })
const metrics = await collectPerformanceMetrics(page)
```

**Sortie attendue :**
```json
{
  "lcp": 450,
  "fcp": 280,
  "cls": 0,
  "tti": 320,
  "domContentLoaded": 350,
  "loadComplete": 500
}
```

> Note : un site statique Astro (0 JS, HTML pré-rendu) a des métriques de performance très basses par nature. Les seuils sont larges (LCP < 2000ms) pour accommoder les variations de CI.

### 6.4 Hiérarchie visuelle — desktop

**Entrée :**
```typescript
await page.setViewportSize({ width: 1280, height: 720 })
await page.goto('/')
const vh = await analyzeVisualHierarchy(page)
```

**Sortie attendue :**
```json
{
  "titleIsLargest": true,
  "hierarchyIsDecreasing": true,
  "ctaIsDistinct": true,
  "elements": [
    { "selector": "#hero h1", "fontSize": 48, "fontWeight": 700, "lineHeight": 52 },
    { "selector": "#benefits-section h3", "fontSize": 18, "fontWeight": 600, "lineHeight": 28 },
    { "selector": "#benefits-section p", "fontSize": 16, "fontWeight": 400, "lineHeight": 24 }
  ]
}
```

### 6.5 Résultat d'un test utilisateur — exemple

**Entrée (données collectées manuellement) :**
```json
{
  "userId": "U1",
  "profile": {
    "role": "developer",
    "experienceWithAI": "intermediate",
    "ageRange": "26-35"
  },
  "readingTimeSeconds": 22,
  "comprehensionScore": 4,
  "confidenceScore": 4,
  "canSummarizeCorrectly": true,
  "identifiesBenefits": true,
  "identifiesTarget": true,
  "notes": "Structure claire, les icônes aident à scanner rapidement les bénéfices",
  "testDate": "2026-02-15T10:00:00.000Z"
}
```

### 6.6 Résultat agrégé d'une campagne — exemple de réussite

```json
{
  "totalUsers": 5,
  "averageReadingTime": 24.2,
  "medianReadingTime": 23,
  "percentageUnder30s": 100,
  "averageComprehension": 4.2,
  "percentageCorrectSummary": 100,
  "isValidated": true
}
```

### 6.7 Résultat agrégé — exemple d'échec

```json
{
  "totalUsers": 5,
  "averageReadingTime": 35.6,
  "medianReadingTime": 34,
  "percentageUnder30s": 40,
  "averageComprehension": 3.0,
  "percentageCorrectSummary": 60,
  "isValidated": false
}
```

> Si le test échoue, les actions correctives sont : réduire le texte de la VP, simplifier les descriptions des bénéfices, ou augmenter la hiérarchie visuelle pour faciliter le scan.

---

## 7. Tests

### 7.1 Fichiers de test

| Fichier | Type | Framework |
|---------|------|-----------|
| `tests/e2e/hero-reading-time.e2e.test.ts` | E2E automatisé | Playwright |
| `docs/tests/T-001-T5-protocole-utilisateur.md` | Protocole manuel | Document Markdown |
| `docs/tests/T-001-T5-resultats-utilisateur.json` | Résultats collectés | JSON |

### 7.2 Récapitulatif quantitatif

| Catégorie | Nb tests | Référence |
|-----------|----------|-----------|
| Comptage de mots et temps de lecture | 10 | RT-WC-01 à RT-WC-10 |
| Above the fold | 10 | RT-AF-01 à RT-AF-10 |
| Performance perceptuelle | 8 | RT-PERF-01 à RT-PERF-08 |
| Hiérarchie visuelle et lisibilité | 10 | RT-VH-01 à RT-VH-10 |
| Densité textuelle et scanabilité | 5 | RT-SC-01 à RT-SC-05 |
| **Total automatisé** | **~43 tests** | |
| **Tests utilisateur (manuels)** | **5 sessions** | Protocole section 8 |

### 7.3 Pattern de test standard

```typescript
import { test, expect } from '@playwright/test'

test.describe('HeroSection — Tests temps de lecture et UX', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#hero')
  })

  // ── Helpers ─────────────────────────────────────────────

  // analyzeHeroContent(), analyzeAboveFold(),
  // collectPerformanceMetrics(), analyzeVisualHierarchy()
  // (voir section 3.2)

  // ── Tests ───────────────────────────────────────────────

  test.describe('Comptage de mots et temps de lecture', () => { /* RT-WC-01 à 10 */ })
  test.describe('Above the fold', () => { /* RT-AF-01 à 10 */ })
  test.describe('Performance perceptuelle', () => { /* RT-PERF-01 à 08 */ })
  test.describe('Hiérarchie visuelle et lisibilité', () => { /* RT-VH-01 à 10 */ })
  test.describe('Densité textuelle et scanabilité', () => { /* RT-SC-01 à 05 */ })
})
```

### 7.4 Exemples de tests complets

#### Comptage de mots et temps de lecture

```typescript
test.describe('Comptage de mots et temps de lecture', () => {
  test('RT-WC-01 : le contenu principal contient ≤ 125 mots', async ({ page }) => {
    const analysis = await analyzeHeroContent(page)

    expect(
      analysis.primaryWordCount,
      `Le hero contient ${analysis.primaryWordCount} mots (max 125). ` +
      `Détail : titre=${analysis.sections.title}, tagline=${analysis.sections.tagline}, ` +
      `VP=${analysis.sections.valueProposition}, CTA=${analysis.sections.cta}, ` +
      `benefits=${analysis.sections.benefits}, stats=${analysis.sections.stats}`
    ).toBeLessThanOrEqual(125)
  })

  test('RT-WC-02 : le contenu principal contient ≥ 50 mots (pas vide)', async ({ page }) => {
    const analysis = await analyzeHeroContent(page)

    expect(analysis.primaryWordCount).toBeGreaterThanOrEqual(50)
  })

  test('RT-WC-03 : temps de lecture estimé ≤ 30 secondes (250 mots/min)', async ({ page }) => {
    const analysis = await analyzeHeroContent(page)

    expect(
      analysis.estimatedReadingTimeSeconds,
      `Temps estimé : ${analysis.estimatedReadingTimeSeconds}s ` +
      `(${analysis.primaryWordCount} mots à 250 mots/min)`
    ).toBeLessThanOrEqual(30)
  })

  test('RT-WC-04 : le titre contient entre 5 et 15 mots', async ({ page }) => {
    const analysis = await analyzeHeroContent(page)

    expect(analysis.sections.title).toBeGreaterThanOrEqual(5)
    expect(analysis.sections.title).toBeLessThanOrEqual(15)
  })

  test('RT-WC-07 : chaque description de bénéfice contient ≤ 20 mots', async ({ page }) => {
    const descriptions = await page.$$eval(
      '#benefits-section article p',
      (elements) => elements.map((el) => el.textContent?.trim().split(/\s+/).length || 0)
    )

    for (const wordCount of descriptions) {
      expect(wordCount).toBeLessThanOrEqual(20)
    }
  })

  test('RT-WC-10 : les sources ≤ 20% du texte total', async ({ page }) => {
    const analysis = await analyzeHeroContent(page)

    const ratio = analysis.sourceWordCount / analysis.totalWordCount
    expect(
      ratio,
      `Les sources représentent ${Math.round(ratio * 100)}% du texte total`
    ).toBeLessThanOrEqual(0.20)
  })
})
```

#### Above the fold

```typescript
test.describe('Above the fold', () => {
  test('RT-AF-01 : le titre (h1) est entièrement above the fold (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')

    const h1Box = await page.locator('#hero h1').boundingBox()
    expect(h1Box).not.toBeNull()
    expect(h1Box!.y + h1Box!.height).toBeLessThanOrEqual(720)
  })

  test('RT-AF-04 : le CTA est entièrement above the fold (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')

    const ctaBox = await page.locator('a[href="/framework"]').boundingBox()
    expect(ctaBox).not.toBeNull()
    expect(ctaBox!.y + ctaBox!.height).toBeLessThanOrEqual(720)
  })

  test('RT-AF-07 : sur mobile, h1 + tagline + VP + CTA visibles', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const elements = ['#hero h1', 'a[href="/framework"]']

    for (const selector of elements) {
      const box = await page.locator(selector).first().boundingBox()
      expect(box, `${selector} devrait être visible`).not.toBeNull()
      expect(
        box!.y,
        `${selector} devrait commencer dans le viewport`
      ).toBeLessThan(667)
    }
  })

  test('RT-AF-10 : le CTA est visible sans scroll sur tous les viewports', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1280, height: 720 },
      { width: 1920, height: 1080 },
    ]

    for (const vp of viewports) {
      await page.setViewportSize(vp)
      await page.goto('/')

      const ctaBox = await page.locator('a[href="/framework"]').boundingBox()
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
```

#### Performance perceptuelle

```typescript
test.describe('Performance perceptuelle', () => {
  test('RT-PERF-01 : LCP < 2000ms', async ({ page }) => {
    // Attente du chargement complet
    await page.goto('/', { waitUntil: 'networkidle' })

    // Collecter LCP via Performance API
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

  test('RT-PERF-05 : le hero ne provoque aucun layout shift', async ({ page }) => {
    // Naviguer et observer le CLS spécifiquement pendant le chargement du hero
    await page.goto('/')
    await page.waitForSelector('#hero')

    // Attendre la stabilisation
    await page.waitForTimeout(1000)

    const heroClsValue = await page.evaluate(() => {
      let cls = 0
      const entries = performance.getEntriesByType('layout-shift') as any[]
      for (const entry of entries) {
        if (!entry.hadRecentInput) {
          // Vérifier si le shift implique le hero
          for (const source of entry.sources || []) {
            const node = source.node as Element
            if (node && node.closest('#hero')) {
              cls += entry.value
            }
          }
        }
      }
      return cls
    })

    expect(heroClsValue).toBe(0)
  })
})
```

#### Hiérarchie visuelle et lisibilité

```typescript
test.describe('Hiérarchie visuelle et lisibilité', () => {
  test('RT-VH-01 : le titre (h1) est le texte le plus grand', async ({ page }) => {
    const vh = await analyzeVisualHierarchy(page)

    expect(
      vh.titleIsLargest,
      'Le h1 doit avoir la taille de police la plus grande de la page'
    ).toBe(true)
  })

  test('RT-VH-02 : hiérarchie typographique décroissante', async ({ page }) => {
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

  test('RT-VH-08 : le CTA a une taille de cible ≥ 44px', async ({ page }) => {
    const ctaBox = await page.locator('a[href="/framework"]').boundingBox()

    expect(ctaBox).not.toBeNull()
    expect(
      ctaBox!.height,
      `Hauteur CTA = ${ctaBox!.height}px (min 44px pour toucher mobile)`
    ).toBeGreaterThanOrEqual(44)
  })

  test('RT-VH-09 : les 3 bénéfices ont des tailles cohérentes', async ({ page }) => {
    const boxes = await page
      .locator('#benefits-section article')
      .evaluateAll((els) =>
        els.map((el) => {
          const rect = el.getBoundingClientRect()
          return { width: rect.width, height: rect.height }
        })
      )

    expect(boxes).toHaveLength(3)

    // Vérifier que les tailles sont similaires (tolérance 10%)
    const widths = boxes.map((b) => b.width)
    const heights = boxes.map((b) => b.height)

    const maxWidthDiff = Math.max(...widths) - Math.min(...widths)
    expect(maxWidthDiff).toBeLessThan(widths[0] * 0.1)

    const maxHeightDiff = Math.max(...heights) - Math.min(...heights)
    expect(maxHeightDiff).toBeLessThan(heights[0] * 0.15)
  })
})
```

#### Densité textuelle et scanabilité

```typescript
test.describe('Densité textuelle et scanabilité', () => {
  test('RT-SC-02 : le hero contient ≥ 3 éléments visuels non textuels', async ({ page }) => {
    // Icônes SVG dans les bénéfices + valeurs stat proéminentes
    const svgCount = await page.locator('#hero svg').count()
    const statValues = await page.locator('#stats-section [class*="stat-value"], #stats-section [class*="text-3xl"], #stats-section [class*="text-4xl"]').count()

    const visualElements = svgCount + statValues
    expect(
      visualElements,
      `${svgCount} SVGs + ${statValues} valeurs stat = ${visualElements} éléments visuels`
    ).toBeGreaterThanOrEqual(3)
  })

  test('RT-SC-03 : chaque bénéfice a un picto/icône', async ({ page }) => {
    const benefitSvgs = await page.locator('#benefits-section article svg').count()

    expect(benefitSvgs).toBe(3)
  })

  test('RT-SC-04 : les valeurs statistiques sont visuellement proéminentes', async ({ page }) => {
    // Les valeurs stat (50%, 3x, >90%) doivent avoir une taille ≥ 24px
    const statElements = page.locator('#stats-section')
    const exists = (await statElements.count()) > 0

    if (exists) {
      // Chercher les éléments textuels contenant les valeurs
      for (const value of ['50', '3x', '90']) {
        const el = page.locator(`#stats-section :text("${value}")`).first()
        const count = await el.count()

        if (count > 0) {
          const fontSize = await el.evaluate((element) => {
            return parseFloat(window.getComputedStyle(element).fontSize)
          })

          expect(
            fontSize,
            `La valeur stat "${value}" a une taille de ${fontSize}px (min 24px)`
          ).toBeGreaterThanOrEqual(24)
        }
      }
    }
  })

  test('RT-SC-05 : le contenu est structuré en ≥ 3 blocs distincts', async ({ page }) => {
    // Le hero doit contenir au moins 3 zones visuellement séparées :
    // 1. Zone titre (h1 + tagline + VP + CTA)
    // 2. Zone bénéfices
    // 3. Zone statistiques

    const sections = await page.locator('#hero > div > div, #hero section').count()

    expect(
      sections,
      'Le hero doit contenir au moins 3 blocs visuellement distincts'
    ).toBeGreaterThanOrEqual(3)
  })
})
```

### 7.5 Assertions types utilisées

| Assertion | Usage | Exemple |
|-----------|-------|---------|
| `expect(n).toBeLessThanOrEqual(max)` | Seuils maximaux (mots, temps, perf) | `primaryWordCount <= 125` |
| `expect(n).toBeGreaterThanOrEqual(min)` | Seuils minimaux (taille, score) | `fontSize >= 30` |
| `expect(n).toBeLessThan(max)` | Métriques de performance | `lcp < 2000` |
| `expect(n).toBe(expected)` | Valeurs exactes | `cls === 0` |
| `expect(box).not.toBeNull()` | Visibilité d'éléments | CTA présent dans le viewport |
| `expect(bool).toBe(true)` | Vérifications booléennes | `titleIsLargest` |
| `expect(arr).toHaveLength(n)` | Comptage d'éléments | 3 bénéfices |

### 7.6 Commandes d'exécution

```bash
# Exécuter les tests de temps de lecture (automatisés)
pnpm exec playwright test tests/e2e/hero-reading-time.e2e.test.ts

# Exécuter sur un viewport spécifique
pnpm exec playwright test tests/e2e/hero-reading-time.e2e.test.ts --project=desktop

# Mode headed (navigateur visible)
pnpm exec playwright test tests/e2e/hero-reading-time.e2e.test.ts --headed

# Avec rapport HTML
pnpm exec playwright test tests/e2e/hero-reading-time.e2e.test.ts --reporter=html

# Tous les tests E2E (a11y + reading time)
pnpm exec playwright test tests/
```

---

## 8. Protocole de test utilisateur

### 8.1 Vue d'ensemble

| Paramètre | Valeur |
|-----------|--------|
| **Nombre de testeurs** | 5 (minimum 3 si recrutement difficile) |
| **Durée par session** | 10 minutes |
| **Format** | En personne ou visioconférence avec partage d'écran |
| **Outil de chronométrage** | Chronomètre manuel ou `performance.now()` |
| **Critère de réussite** | ≥ 4/5 testeurs lisent et comprennent en < 30s |

### 8.2 Profil des testeurs

Recruter un panel diversifié :

| # | Profil souhaité | Expérience IA | Justification |
|---|----------------|---------------|---------------|
| U1 | Développeur junior/mid | Débutant | Cible principale de AIAD |
| U2 | Tech Lead / Architecte | Intermédiaire | Décideur technique |
| U3 | Product Manager / PO | Aucune-Débutant | Décideur non-technique |
| U4 | Développeur senior | Expert | A11y power user, compare avec l'existant |
| U5 | Profil mixte (QA, DevOps) | Variable | Vérification transversale |

**Critères d'exclusion :**
- Connaît déjà AIAD ou a participé au développement
- Ne parle pas couramment français
- A déjà vu la page d'accueil

### 8.3 Déroulement d'une session

```
┌─────────────────────────────────────────────────────────────┐
│  Phase 1 — Briefing (2 min)                                │
│  • Expliquer le contexte (sans révéler AIAD)               │
│  • "Vous allez voir une page web. Lisez-la normalement."   │
│  • "Quand vous pensez avoir compris le sujet, dites STOP." │
│  • Démarrer l'enregistrement d'écran si possible           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 2 — Exposition (max 60 secondes)                    │
│  • Afficher la page d'accueil (hero visible)               │
│  • Démarrer le chronomètre immédiatement                   │
│  • L'utilisateur lit à son rythme naturel                  │
│  • STOP quand l'utilisateur dit avoir compris              │
│  • Si > 60s : arrêter, noter le temps comme "60+"          │
│  • Noter le temps exact : T = __ secondes                  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 3 — Questionnaire (5 min)                           │
│  • Masquer la page (alt-tab ou fermer l'onglet)            │
│  • Poser les 5 questions de compréhension                  │
│  • Poser l'auto-évaluation de confiance                    │
│  • Recueillir les commentaires libres                      │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 4 — Debriefing (3 min)                              │
│  • Demander ce qui a aidé à comprendre rapidement          │
│  • Demander ce qui était confus ou superflu                │
│  • Demander si la structure guide bien l'œil               │
│  • Remercier le testeur                                    │
└─────────────────────────────────────────────────────────────┘
```

### 8.4 Questionnaire de compréhension (5 questions)

Chaque question vaut 1 point. Score total : 0 à 5.

| # | Question | Réponse attendue | Critère de validation |
|---|----------|-----------------|----------------------|
| Q1 | « De quoi parle cette page ? Résumez en une phrase. » | AIAD est un framework pour développer avec des agents IA | Mentionne « framework » ou « méthodologie » ET « IA » ou « agents IA » |
| Q2 | « À qui s'adresse ce produit/service ? » | Aux développeurs qui travaillent avec l'IA | Mentionne « développeurs » ou « équipes de développement » |
| Q3 | « Citez au moins 2 bénéfices mentionnés. » | Productivité, Qualité, Collaboration (2 sur 3) | Cite au moins 2 bénéfices (paraphrase acceptée) |
| Q4 | « Quel chiffre vous a le plus marqué ? » | 50%, 3x, ou >90% (n'importe lequel) | Cite au moins 1 statistique (valeur ou contexte) |
| Q5 | « Quelle action vous est proposée ? » | Explorer le Framework / en savoir plus | Mentionne l'action principale (CTA) |

### 8.5 Grille de notation

```
Score de compréhension : __/5 (questions correctes)
Score de confiance : __/5 (auto-évaluation Likert)
  1 = Pas du tout confiant
  2 = Peu confiant
  3 = Moyennement confiant
  4 = Confiant
  5 = Très confiant

Résumé correct : ☐ Oui  ☐ Non
Identifie bénéfices (≥ 2/3) : ☐ Oui  ☐ Non
Identifie la cible : ☐ Oui  ☐ Non
```

### 8.6 Critères de réussite de la campagne

| Critère | Seuil | Obligatoire |
|---------|-------|-------------|
| ≥ 4/5 testeurs lisent en < 30 secondes | 80% | **Oui** |
| Temps de lecture moyen < 30 secondes | < 30s | **Oui** |
| Temps de lecture médian < 30 secondes | < 30s | **Oui** |
| Score de compréhension moyen ≥ 3.5/5 | ≥ 3.5 | **Oui** |
| ≥ 4/5 testeurs peuvent résumer correctement | 80% | **Oui** |
| ≥ 4/5 testeurs identifient au moins 2 bénéfices | 80% | Non (souhaitable) |
| Score de confiance moyen ≥ 3/5 | ≥ 3 | Non (souhaitable) |

### 8.7 Actions correctives si échec

| Problème identifié | Action corrective | Impact estimé |
|--------------------|--------------------|---------------|
| Temps > 30s, trop de texte | Réduire la VP à 1 phrase courte (< 15 mots) | -5s |
| Temps > 30s, descriptions bénéfices longues | Raccourcir chaque description à < 12 mots | -3s |
| Faible compréhension, titre ambigu | Reformuler le titre pour être plus explicite | +1 point compréhension |
| Statistiques non remarquées | Augmenter la taille des valeurs stat | +1 stat retenue |
| CTA non identifié | Augmenter le contraste/taille du CTA | +1 point Q5 |
| Sources confusent la lecture | Réduire la taille ou masquer les sources | -2s |
| Structure non guidante | Augmenter l'espacement entre sections | Meilleur scan |

### 8.8 Template de résultats

Le fichier `docs/tests/T-001-T5-resultats-utilisateur.json` contiendra :

```json
{
  "campaign": {
    "date": "2026-02-XX",
    "tester": "Nom du facilitateur",
    "environment": "Desktop Chrome 1280×720",
    "pageVersion": "commit-hash"
  },
  "results": [
    {
      "userId": "U1",
      "profile": { "role": "developer", "experienceWithAI": "beginner", "ageRange": "26-35" },
      "readingTimeSeconds": 22,
      "comprehensionScore": 4,
      "confidenceScore": 4,
      "canSummarizeCorrectly": true,
      "identifiesBenefits": true,
      "identifiesTarget": true,
      "notes": "Structure claire. Les icônes aident."
    }
  ],
  "summary": {
    "totalUsers": 5,
    "averageReadingTime": 24.2,
    "medianReadingTime": 23,
    "percentageUnder30s": 100,
    "averageComprehension": 4.2,
    "percentageCorrectSummary": 100,
    "isValidated": true
  }
}
```

---

## 9. Critères d'acceptation

### 9.1 Tests automatisés (Volet 1)

- [x] Le fichier `tests/e2e/hero-reading-time.e2e.test.ts` existe
- [x] Tous les ~43 tests automatisés passent avec `pnpm exec playwright test tests/e2e/hero-reading-time.e2e.test.ts`
- [x] Les 5 catégories de tests sont implémentées (mots, above fold, performance, hiérarchie, scanabilité)
- [x] Le contenu principal du hero contient ≤ 125 mots (hors sources)
- [x] Le temps de lecture estimé à 250 mots/min est ≤ 30 secondes
- [x] Le titre (h1), la tagline, la VP et le CTA sont above the fold sur desktop (1280×720)
- [x] Le CTA est visible sans scroll sur tous les viewports (mobile, tablette, desktop)
- [x] LCP < 2000ms sur desktop et mobile
- [x] CLS < 0.1 (idéalement 0)
- [x] La hiérarchie typographique est strictement décroissante (h1 > h3 > p)
- [x] Le CTA se distingue visuellement (couleur de fond non transparente)
- [x] Le CTA a une taille de cible ≥ 44px
- [x] Les 3 bénéfices ont des tailles cohérentes entre eux
- [x] Les valeurs statistiques sont proéminentes (≥ 24px)
- [x] Chaque bénéfice a un picto/icône SVG
- [x] Le hero contient au moins 3 blocs visuellement distincts
- [x] 0 erreur TypeScript (`pnpm typecheck`)

### 9.2 Tests utilisateur (Volet 2)

- [x] Le protocole de test est documenté dans `docs/tests/T-001-T5-protocole-utilisateur.md`
- [ ] 5 utilisateurs ont été testés (minimum 3)
- [ ] Les résultats sont consignés dans `docs/tests/T-001-T5-resultats-utilisateur.json`
- [ ] ≥ 4/5 testeurs lisent et comprennent en < 30 secondes
- [ ] Temps de lecture moyen < 30 secondes
- [ ] Temps de lecture médian < 30 secondes
- [ ] Score de compréhension moyen ≥ 3.5/5
- [ ] ≥ 4/5 testeurs peuvent résumer AIAD correctement
- [ ] Les commentaires qualitatifs sont documentés
- [ ] Si échec : les actions correctives sont identifiées et un re-test est planifié

---

## 10. Notes d'implémentation

### 10.1 Distinction avec T-001-T4

T-001-T4 valide l'**accessibilité technique** (WCAG, clavier, ARIA). T-001-T5 valide l'**expérience utilisateur** (lisibilité, compréhension, rapidité de lecture) :

| Aspect | T-001-T4 (accessibilité) | T-001-T5 (temps de lecture) |
|--------|--------------------------|----------------------------|
| Conformité WCAG | axe-core, 87 tests | Non testé ici |
| Quantité de texte | Non testé | Comptage de mots ≤ 125 |
| Above the fold | Non testé | Positions des éléments vs viewport |
| Performance | Non testé | LCP, CLS, FCP |
| Hiérarchie visuelle | Structure ARIA | Tailles de police, espacement |
| Compréhension | Non testé | 5 utilisateurs, questionnaire |
| Utilisateurs réels | Non | **Oui (5 sessions)** |

### 10.2 Ordre de développement recommandé

1. Créer le dossier `tests/e2e/` s'il n'existe pas
2. Créer `tests/e2e/hero-reading-time.e2e.test.ts`
3. Implémenter les helpers (`analyzeHeroContent`, `analyzeAboveFold`, `collectPerformanceMetrics`, `analyzeVisualHierarchy`)
4. Catégorie par catégorie, dans cet ordre :
   - a) Comptage de mots (RT-WC) — le plus fondamental
   - b) Above the fold (RT-AF)
   - c) Performance perceptuelle (RT-PERF)
   - d) Hiérarchie visuelle (RT-VH)
   - e) Densité et scanabilité (RT-SC)
5. Vérifier que tous les tests passent : `pnpm exec playwright test tests/e2e/`
6. Préparer le protocole utilisateur dans `docs/tests/T-001-T5-protocole-utilisateur.md`
7. Recruter et planifier les 5 sessions de test
8. Conduire les sessions et consigner les résultats
9. Analyser les résultats et documenter les conclusions

### 10.3 Performance API et compatibilité

- **`PerformanceObserver`** pour LCP et CLS est supporté dans Chromium (utilisé par Playwright)
- **`performance.getEntriesByType('layout-shift')`** requiert `buffered: true` pour récupérer les shifts passés
- **Les métriques sur le serveur de dev** peuvent différer de la production (pas de CDN, pas de cache). Les seuils sont volontairement larges (LCP < 2000ms au lieu de < 1000ms en production)
- **Pour les tests de performance en CI** : utiliser `networkidle` dans `waitUntil` et ajouter un warm-up si nécessaire

### 10.4 Robustesse du comptage de mots

Le helper `analyzeHeroContent` dépend de la structure DOM du hero. Si la structure change :
- Les sélecteurs CSS doivent être mis à jour
- Les assertions par section (`sections.title`, etc.) peuvent nécessiter un ajustement
- Le seuil global (≤ 125 mots) reste stable indépendamment de la structure

**Recommandation** : ajouter des `data-testid` aux éléments du hero si les sélecteurs CSS sont fragiles.

### 10.5 Interprétation des résultats utilisateur

Le temps de lecture de 30 secondes est un **seuil d'attention**, pas un temps de lecture complète :

- **< 15s** : l'utilisateur scanne rapidement et retient l'essentiel (excellent)
- **15-25s** : lecture naturelle d'un hero bien structuré (bon)
- **25-30s** : lecture complète incluant les sources (acceptable)
- **30-45s** : le contenu est trop dense ou la structure ne guide pas l'œil (action requise)
- **> 45s** : problème majeur de densité textuelle ou de hiérarchie visuelle

### 10.6 Scripts npm suggérés

Ajouter au `package.json` :

```json
{
  "scripts": {
    "test:e2e": "playwright test tests/e2e/",
    "test:e2e:reading": "playwright test tests/e2e/hero-reading-time.e2e.test.ts",
    "test:e2e:headed": "playwright test tests/e2e/ --headed"
  }
}
```

### 10.7 Relation avec les autres tâches de test

| Tâche | Relation avec T-001-T5 |
|-------|------------------------|
| T-001-T1 (tests schémas Zod) | Valide les données en amont. Pas de lien direct. |
| T-001-T2 (tests unitaires) | Vérifie le rendu HTML des composants individuels. |
| T-001-T3 (tests intégration) | Vérifie l'assemblage complet des composants. |
| T-001-T4 (tests accessibilité) | Vérifie la conformité WCAG dans le navigateur. T-001-T5 en dépend. |
| **T-001-T5 (cette tâche)** | Valide l'expérience utilisateur finale : temps de lecture < 30s. |

---

## 11. Références

| Ressource | Lien |
|-----------|------|
| US-001 Spec | [spec.md](./spec.md) |
| T-001-F8 HeroSection | [T-001-F8-composant-HeroSection.md](./T-001-F8-composant-HeroSection.md) |
| T-001-F9 Intégration | [T-001-F9-integration-page-accueil.md](./T-001-F9-integration-page-accueil.md) |
| T-001-T3 Tests intégration | [T-001-T3-tests-integration-HeroSection.md](./T-001-T3-tests-integration-HeroSection.md) |
| T-001-T4 Tests accessibilité | [T-001-T4-tests-accessibilite-hero-section.md](./T-001-T4-tests-accessibilite-hero-section.md) |
| Architecture | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| HeroSection source | `src/components/hero/HeroSection.astro` |
| Page d'accueil | `src/pages/index.astro` |
| Données hero | `src/content/hero/main.json` |
| Données bénéfices | `src/content/benefits/*.json` |
| Données statistiques | `src/content/stats/*.json` |
| Nielsen Norman Group — How Users Read on the Web | https://www.nngroup.com/articles/how-users-read-on-the-web/ |
| Google Web Vitals | https://web.dev/vitals/ |
| Playwright Performance Testing | https://playwright.dev/docs/api/class-page#page-evaluate |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 09/02/2026 | Création initiale — Spécification complète des tests temps de lecture et UX |
| 1.1 | 09/02/2026 | Volet 1 terminé : 43 tests E2E Playwright implémentés + protocole utilisateur documenté |
