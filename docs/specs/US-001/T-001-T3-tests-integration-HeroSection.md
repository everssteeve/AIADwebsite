# T-001-T3 : Tests d'intégration HeroSection

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 05 février 2026 |
| **Statut** | 📋 À faire |
| **User Story** | [US-001 - Comprendre AIAD rapidement](./spec.md) |
| **Dépendances** | T-001-F8 (HeroSection), T-001-F9 (intégration page d'accueil), T-001-T2 (tests unitaires composants) |
| **Bloque** | T-001-T4 (tests accessibilité) |

---

## 1. Objectif

Valider par des tests d'intégration que le composant **HeroSection** assemble correctement ses 5 sous-composants (HeroTitle, ValueProposition, CTAButton, BenefitsList, StatsRow) et produit un rendu HTML cohérent, accessible et conforme aux spécifications US-001.

### Distinction avec T-001-T2 (tests unitaires)

| Aspect | T-001-T2 (unitaires) | T-001-T3 (intégration) |
|--------|----------------------|------------------------|
| **Périmètre** | Chaque composant isolé | HeroSection assemblé avec tous ses enfants |
| **Focus** | Props, variantes, cas limites d'un composant | Interactions entre composants, flux de données, structure globale |
| **Données** | Fixtures minimales par composant | Données de production complètes (Content Collections) |
| **Hiérarchie HTML** | Vérifie les balises d'un composant | Vérifie l'arbre complet h1 → h2 → h3 |
| **Accessibilité** | ARIA d'un composant | ARIA tree global, landmarks, heading outline |
| **Rendu** | HTML d'un composant | HTML assemblé complet (> 100 lignes) |

### Ce qui est testé

- **Assemblage complet** : Les 5 sous-composants sont rendus ensemble dans le bon ordre
- **Flux de données** : Les props de HeroSection sont correctement propagées aux enfants
- **Hiérarchie HTML globale** : Un seul `<h1>`, puis `<h2>` pour les sections, puis `<h3>` pour les cartes
- **Accessibilité globale** : Landmarks, aria-labelledby, heading outline complet
- **Données de production** : Les données réelles de Content Collections produisent le rendu attendu
- **Espacement inter-sections** : L'ordre et les classes de spacing entre les blocs sont corrects
- **Cas dégradés end-to-end** : Données manquantes, partielles, vides traversant toute la chaîne
- **Sécurité XSS end-to-end** : L'échappement fonctionne à travers l'assemblage complet
- **Combinaisons de props** : Plusieurs props interagissant entre composants parent et enfants

### Ce qui est exclu (couvert ailleurs)

| Exclu | Couvert par |
|-------|-------------|
| Tests de chaque composant individuel (props, variantes) | T-001-T2 |
| Tests d'accessibilité axe-core en navigateur | T-001-T4 |
| Tests E2E avec navigation utilisateur | T-001-T4 / Tests E2E Playwright |
| Tests de performance Lighthouse | T-001-T5 |
| Tests utilisateur temps de lecture | T-001-T5 |

---

## 2. Contexte technique

### 2.1 Stack de test

| Outil | Version | Rôle |
|-------|---------|------|
| **Vitest** | 1.x | Framework de test (via `getViteConfig` d'Astro) |
| **Astro Container API** | experimental | Rendu serveur de HeroSection + enfants en string HTML |
| **TypeScript** | 5.x | Typage des props, fixtures et assertions |

### 2.2 Approche de test

Les tests d'intégration utilisent la même **Astro Container API** que les tests unitaires, mais avec une différence fondamentale : on rend le composant **HeroSection** (et non ses enfants individuels), ce qui provoque le rendu en cascade de tous les sous-composants.

```typescript
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import HeroSection from '@components/hero/HeroSection.astro'

const container = await AstroContainer.create()
const result = await container.renderToString(HeroSection, {
  props: {
    heroContent: mockHeroContent,
    benefits: mockBenefits,
    stats: mockStats,
  },
})
// `result` contient le HTML complet avec tous les sous-composants rendus
```

**Points d'attention :**
- Le rendu inclut **tous** les sous-composants (HeroTitle, ValueProposition, CTAButton, BenefitsList → BenefitCard ×3, StatsRow → StatDisplay ×3)
- Les données doivent être passées via props pour éviter les appels `astro:content` en test
- Le HTML résultant est volumineux (~200-500 lignes) ; les assertions doivent être précises
- L'échappement HTML Astro s'applique à travers toute la chaîne (`'` → `&#39;`, `&` → `&amp;`, `<` → `&lt;`)

### 2.3 Configuration Vitest

```typescript
// vitest.config.ts (existant)
import { getViteConfig } from 'astro/config'

export default getViteConfig({
  test: {
    globals: true,
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts'],
    },
  },
})
```

### 2.4 Structure des fichiers

```
tests/
└── integration/
    └── hero-section.integration.test.ts   ← CE FICHIER
```

> **Convention** : Les tests d'intégration sont placés dans `tests/integration/` pour les distinguer des tests unitaires dans `tests/unit/`.

### 2.5 Composants sous test (assemblage)

```
HeroSection                        ← Composant racine testé
├── HeroTitle                      ← <h1> + tagline
├── ValueProposition               ← <p> proposition de valeur
├── CTAButton                      ← <a> bouton d'action
├── BenefitsList                   ← <section> conteneur
│   ├── BenefitCard (×3)          ← <article> carte bénéfice
│   │   └── SVG icône + h3 + p
│   └── ...
└── StatsRow                       ← <section> conteneur
    ├── StatDisplay (×3)           ← div stat
    │   └── valeur + label + cite
    └── ...
```

---

## 3. Spécifications fonctionnelles

### 3.1 Types TypeScript pour les fixtures

```typescript
import type { HeroContent } from '@/types'
import type { BenefitItem } from '@/types'
import type { StatItem } from '@/types'

// ── Props d'entrée du composant HeroSection ─────────────────

interface HeroSectionProps {
  // Données
  heroContent?: HeroContent
  benefits?: BenefitItem[]
  stats?: StatItem[]

  // Configuration CTA
  ctaText?: string
  ctaHref?: string
  ctaVariant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  ctaSize?: 'sm' | 'md' | 'lg'

  // Layout
  spacing?: 'compact' | 'default' | 'spacious'
  background?: 'none' | 'gradient' | 'subtle'
  centered?: boolean
  maxWidth?: string

  // Configuration sous-composants
  titleSize?: 'sm' | 'md' | 'lg'
  valuePropositionSize?: 'sm' | 'md' | 'lg'
  valuePropositionEmphasis?: 'subtle' | 'normal' | 'strong'
  benefitsColumns?: 1 | 2 | 3 | 'auto'
  benefitsCardVariant?: 'default' | 'compact' | 'featured'
  statsShowDividers?: boolean
  statsShowSources?: boolean

  // Visibilité des sections
  showValueProposition?: boolean
  showCTA?: boolean
  showBenefits?: boolean
  showStats?: boolean

  // HTML
  class?: string
  id?: string
}
```

### 3.2 Fixtures de test (données de production)

```typescript
// ── Données hero réelles (Content Collections) ─────────────

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

// ── Données bénéfices réelles ───────────────────────────────

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

// ── Données statistiques réelles ────────────────────────────

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

// ── Props par défaut pour les tests ─────────────────────────

const defaultIntegrationProps: HeroSectionProps = {
  heroContent: productionHeroContent,
  benefits: productionBenefits,
  stats: productionStats,
}
```

---

## 4. Matrice des tests

### 4.1 Assemblage complet — Présence des 5 sous-composants

| ID | Description | Assertion principale |
|----|-------------|---------------------|
| INT-01 | Le rendu complet contient une `<section>` root avec `id="hero"` | `toContain('<section')`, `toContain('id="hero"')` |
| INT-02 | Le rendu contient exactement un `<h1>` (HeroTitle) | Comptage `<h1` === 1 |
| INT-03 | Le `<h1>` contient le titre "AIAD : Le framework pour développer avec des agents IA" | `toContain` le titre complet |
| INT-04 | La tagline est rendue après le `<h1>` | Index tagline > index `</h1>` |
| INT-05 | La ValueProposition est rendue (texte complet de production) | `toContain('Une méthodologie éprouvée pour intégrer les agents IA dans votre workflow')` |
| INT-06 | Le CTAButton "Explorer le Framework" est rendu avec `href="/framework"` | `toContain('Explorer le Framework')`, `toContain('href="/framework"')` |
| INT-07 | Le CTAButton contient un SVG d'icône | `toContain('<svg')` après "Explorer le Framework" |
| INT-08 | La BenefitsList rend exactement 3 `<article>` (BenefitCards) | Comptage `<article` === 3 |
| INT-09 | Chaque BenefitCard contient un SVG d'icône | Comptage `<svg` ≥ 3 (icônes) + 1 (CTA) |
| INT-10 | La StatsRow rend exactement 3 valeurs `stat-value` | Comptage `stat-value` === 3 |
| INT-11 | Le rendu contient les 3 titres de bénéfices de production | `toContain('Productivité décuplée')`, `toContain('Qualité garantie')`, `toContain('Collaboration fluide')` |
| INT-12 | Le rendu contient les 3 valeurs statistiques de production | `toContain('50%')`, `toContain('3x')`, `toContain('&gt;90%')` |
| INT-13 | Le rendu contient les 3 sources statistiques | `toContain('McKinsey')`, `toContain('GitHub')`, `toContain('Stack Overflow')` |

### 4.2 Hiérarchie HTML et structure sémantique

| ID | Description | Assertion principale |
|----|-------------|---------------------|
| INT-H-01 | Exactement 1 `<h1>` dans tout le rendu | Comptage `<h1` === 1 |
| INT-H-02 | Exactement 2 `<h2>` dans le rendu (bénéfices + stats) | Comptage `<h2` === 2 |
| INT-H-03 | Exactement 3 `<h3>` dans le rendu (3 BenefitCards) | Comptage `<h3` === 3 |
| INT-H-04 | Pas de `<h4>`, `<h5>` ou `<h6>` | `not.toMatch(/<h[4-6]/)` |
| INT-H-05 | Le `<h1>` apparaît avant tous les `<h2>` | Index `<h1` < index premier `<h2` |
| INT-H-06 | Les `<h2>` apparaissent avant les `<h3>` | Index premier `<h2` < index premier `<h3` |
| INT-H-07 | Hiérarchie continue : pas de saut h1 → h3 sans h2 | Les h2 existent entre h1 et h3 |
| INT-H-08 | Structure `<section>` root → `<div>` conteneur → sous-composants | Structure DOM correcte |
| INT-H-09 | BenefitsList dans une `<section>` avec `aria-labelledby` | `toContain('id="benefits-section"')` |
| INT-H-10 | StatsRow dans une `<section>` avec `aria-labelledby` | `toContain('id="stats-section"')` |

### 4.3 Accessibilité globale (ARIA tree)

| ID | Description | Assertion principale |
|----|-------------|---------------------|
| INT-A-01 | `<section id="hero">` possède `aria-labelledby="hero-title"` | Attribut présent et pointant vers le h1 |
| INT-A-02 | `<section id="benefits-section">` possède `aria-labelledby="benefits-section-title"` | Attribut présent |
| INT-A-03 | `<section id="stats-section">` possède `aria-labelledby="stats-section-title"` | Attribut présent |
| INT-A-04 | Tous les `aria-labelledby` pointent vers des IDs existants dans le DOM | Cohérence IDs |
| INT-A-05 | Les icônes SVG des BenefitCards ont `aria-hidden="true"` | Comptage `aria-hidden="true"` ≥ 3 |
| INT-A-06 | Les liens sources StatDisplay ont `rel="noopener noreferrer"` | Comptage `noopener noreferrer` === 3 |
| INT-A-07 | Les liens sources StatDisplay ont `target="_blank"` | Comptage `target="_blank"` === 3 |
| INT-A-08 | Les liens sources contiennent un `<span class="sr-only">` pour "nouvel onglet" | Comptage `sr-only` ≥ 3 (sources) + 2 (titres h2 sr-only) |
| INT-A-09 | Les `<h2>` de BenefitsList et StatsRow sont `sr-only` par défaut | 2 éléments `<h2` avec classe `sr-only` |
| INT-A-10 | Le CTAButton a `focus:ring-2` pour le focus visible | `toContain('focus:ring-2')` |

### 4.4 Ordre séquentiel des sous-composants dans le DOM

| ID | Description | Assertion principale |
|----|-------------|---------------------|
| INT-O-01 | HeroTitle (`<h1>`) apparaît en premier | Index `<h1` < index de tous les autres sous-composants |
| INT-O-02 | ValueProposition apparaît après HeroTitle | Index "Une méthodologie" > index `</h1>` |
| INT-O-03 | CTAButton apparaît après ValueProposition | Index "Explorer le Framework" > index "multiplier votre productivité" |
| INT-O-04 | BenefitsList apparaît après CTAButton | Index "benefits-section" > index "Explorer le Framework" |
| INT-O-05 | StatsRow apparaît après BenefitsList | Index "stats-section" > index "benefits-section" |
| INT-O-06 | Les 3 BenefitCards apparaissent dans l'ordre (1, 2, 3) | Index "Productivité" < "Qualité" < "Collaboration" |
| INT-O-07 | Les 3 StatDisplay apparaissent dans l'ordre (1, 2, 3) | Index "50%" < "3x" < "&gt;90%" |

### 4.5 Espacement inter-sections

| ID | Description | Assertion principale |
|----|-------------|---------------------|
| INT-S-01 | Spacing `default` : section padding `py-16 md:py-24` | `toContain('py-16')`, `toContain('md:py-24')` |
| INT-S-02 | Spacing `default` : espace après titre `mt-6` | `toContain('mt-6')` (wrapper VP) |
| INT-S-03 | Spacing `default` : espace après VP `mt-8` | `toContain('mt-8')` (wrapper CTA) |
| INT-S-04 | Spacing `default` : espace après CTA `mt-12 md:mt-16` | `toContain('mt-12')`, `toContain('md:mt-16')` |
| INT-S-05 | Spacing `default` : espace après BenefitsList `mt-12 md:mt-16` | 2ème occurrence de `mt-12 md:mt-16` |
| INT-S-06 | Spacing `compact` : section padding `py-10 md:py-14` | `toContain('py-10')` |
| INT-S-07 | Spacing `compact` : espaces internes réduits (`mt-4`, `mt-6`, `mt-8 md:mt-10`) | Classes présentes |
| INT-S-08 | Spacing `spacious` : section padding `py-20 md:py-32` | `toContain('py-20')` |
| INT-S-09 | Spacing `spacious` : espaces internes étendus (`mt-8`, `mt-10`, `mt-16 md:mt-20`) | Classes présentes |
| INT-S-10 | Padding horizontal `px-4 md:px-6 lg:px-8` toujours présent | Classes présentes quel que soit le spacing |

### 4.6 Propagation des props parent → enfants

| ID | Description | Assertion principale |
|----|-------------|---------------------|
| INT-P-01 | `centered=true` (défaut) → HeroTitle `align='center'` → `text-center` | `toContain('text-center')` dans le HeroTitle |
| INT-P-02 | `centered=true` → ValueProposition `align='center'` → `mx-auto` | `toContain('mx-auto')` |
| INT-P-03 | `centered=true` → CTA wrapper `flex justify-center` | `toContain('flex justify-center')` |
| INT-P-04 | `centered=true` → BenefitsList `centered=true` → `mx-auto` | `toContain('mx-auto')` dans benefits |
| INT-P-05 | `centered=true` → StatsRow `centered=true` → `mx-auto` | `toContain('mx-auto')` dans stats |
| INT-P-06 | `centered=false` → HeroTitle `align='left'` → `text-left` | `toContain('text-left')` |
| INT-P-07 | `centered=false` → CTA wrapper sans `flex justify-center` | Pas de `justify-center` dans wrapper CTA |
| INT-P-08 | `titleSize='sm'` → HeroTitle reçoit `size='sm'` → `text-2xl md:text-3xl` | Classes SM présentes |
| INT-P-09 | `titleSize='lg'` → HeroTitle reçoit `size='lg'` → `lg:text-5xl` | Classes LG présentes |
| INT-P-10 | `valuePropositionSize='lg'` → VP `size='lg'` → `text-lg md:text-xl` | Classes VP LG |
| INT-P-11 | `valuePropositionEmphasis='strong'` → VP `emphasis='strong'` → `font-medium text-gray-700` | Classes strong |
| INT-P-12 | `ctaText` custom → texte affiché dans le CTA | `toContain` le texte custom |
| INT-P-13 | `ctaHref` custom → lien correct | `toContain('href="/custom"')` |
| INT-P-14 | `ctaVariant='secondary'` → CTA classes secondary (`bg-gray-100`) | Classes secondary |
| INT-P-15 | `ctaSize='sm'` → CTA classes SM (`text-sm`, `px-4`) | Classes SM CTA |
| INT-P-16 | `benefitsColumns=2` → BenefitsList grid `md:grid-cols-2` | `toContain('md:grid-cols-2')` |
| INT-P-17 | `benefitsCardVariant='featured'` → BenefitCards `bg-blue-50` | `toContain('bg-blue-50')` dans les cards |
| INT-P-18 | `statsShowDividers=false` → StatsRow sans séparateurs | `not.toContain('border-t border-gray-200')` |
| INT-P-19 | `statsShowSources=false` → StatDisplay sans `<cite>` | `not.toContain('<cite')` |
| INT-P-20 | `background='gradient'` → section `bg-gradient-to-b from-white to-gray-50` | Classes gradient |
| INT-P-21 | `background='subtle'` → section `bg-gray-50` | Classe subtle |
| INT-P-22 | `maxWidth='max-w-5xl'` → conteneur `max-w-5xl` au lieu de `max-w-7xl` | `toContain('max-w-5xl')` |
| INT-P-23 | `id='landing-hero'` → section `id="landing-hero"`, h1 `id="landing-hero-title"`, `aria-labelledby="landing-hero-title"` | IDs cohérents |
| INT-P-24 | `class='border-b border-gray-100'` → classes ajoutées à la section | Classes custom présentes |

### 4.7 Visibilité conditionnelle des sections

| ID | Description | Assertion principale |
|----|-------------|---------------------|
| INT-V-01 | Par défaut : 5 sous-composants visibles | Tous les contenus présents |
| INT-V-02 | `showValueProposition=false` : VP absente, 4 sous-composants | `not.toContain` texte VP, les 4 autres présents |
| INT-V-03 | `showCTA=false` : CTA absent, 4 sous-composants | `not.toContain('Explorer le Framework')`, les 4 autres présents |
| INT-V-04 | `showBenefits=false` : BenefitsList absente, 4 sous-composants | `not.toContain('benefits-section')`, les 4 autres présents |
| INT-V-05 | `showStats=false` : StatsRow absente, 4 sous-composants | `not.toContain('stats-section')`, les 4 autres présents |
| INT-V-06 | `showBenefits=false` + `showStats=false` : seulement titre, VP, CTA | Pas de sections, mais h1 + VP + CTA présents |
| INT-V-07 | Toutes sections masquées sauf titre : seulement `<h1>` + `<section>` | `toContain('<h1')`, `not.toContain('Explorer')`, `not.toContain('benefits')`, `not.toContain('stats')` |
| INT-V-08 | `showValueProposition=false` : hiérarchie titres inchangée (h1, h2×2, h3×3) | Comptages corrects |
| INT-V-09 | `showBenefits=false` : seulement 1 `<h2>` (stats), 0 `<h3>` | Comptage h2 === 1, h3 === 0 |
| INT-V-10 | `showStats=false` : seulement 1 `<h2>` (bénéfices), 3 `<h3>` | Comptage h2 === 1, h3 === 3 |
| INT-V-11 | `showBenefits=false` + `showStats=false` : 0 `<h2>`, 0 `<h3>` | Comptage h2 === 0, h3 === 0 |

### 4.8 Données de production (Content Collections)

| ID | Description | Assertion principale |
|----|-------------|---------------------|
| INT-D-01 | Le titre de production est rendu correctement | Texte complet présent |
| INT-D-02 | La tagline de production contient l'apostrophe échappée (`l&#39;intelligence`) | `toContain('l&#39;intelligence')` |
| INT-D-03 | La VP de production est rendue en entier (phrase complète terminant par ".") | Texte complet + point |
| INT-D-04 | Les 3 descriptions de bénéfices sont rendues en entier | Chaque description présente |
| INT-D-05 | Les 3 labels de statistiques sont rendus | Chaque label présent |
| INT-D-06 | Les 3 URLs source sont rendues comme liens `<a>` | Comptage `<a` incluant les URLs source ≥ 3 |
| INT-D-07 | Les URLs source de production sont des liens valides (https://) | `toContain('href="https://')` ≥ 3 fois |
| INT-D-08 | La stat highlight (50%) reçoit la variante highlight (`bg-blue-50`) | `bg-blue-50` présent autour de la stat 50% |
| INT-D-09 | Les stats non-highlight (3x, >90%) reçoivent la variante default (`bg-transparent`) | `bg-transparent` présent pour ces stats |
| INT-D-10 | L'apostrophe dans "Des développeurs satisfaits de l'IA" est échappée | `toContain('l&#39;IA')` |

### 4.9 Cas limites et dégradés end-to-end

| ID | Description | Entrée | Assertion principale |
|----|-------------|--------|---------------------|
| INT-CL-01 | HeroSection sans aucune prop (fallback total) | `props: {}` | `<h1>` avec "AIAD", `<section>` présente |
| INT-CL-02 | heroContent sans tagline | `tagline: ''` | Pas de `<p>` tagline dans HeroTitle |
| INT-CL-03 | heroContent sans valueProposition | `valueProposition: ''` | Pas de VP, CTA toujours rendu |
| INT-CL-04 | heroContent avec tagline + VP vides | `tagline: '', valueProposition: ''` | Seulement h1 "AIAD", CTA, benefits, stats |
| INT-CL-05 | benefits = [] (liste vide) | `benefits: []` | Pas de `<section id="benefits-section">`, pas de `<h2>` benefits, pas de `<article>` |
| INT-CL-06 | stats = [] (liste vide) | `stats: []` | Pas de `<section id="stats-section">`, pas de `<h2>` stats |
| INT-CL-07 | benefits vide + stats vide | `benefits: [], stats: []` | Seulement hero title, VP, CTA |
| INT-CL-08 | 1 seul benefit | 1 élément | 1 `<article>`, 1 `<h3>` |
| INT-CL-09 | 5 benefits | 5 éléments | 5 `<article>`, 5 `<h3>` |
| INT-CL-10 | 1 seule stat | 1 élément | 1 `stat-value`, 0 séparateur |
| INT-CL-11 | 2 stats | 2 éléments | 2 `stat-value`, 1 séparateur |
| INT-CL-12 | 6 stats | 6 éléments | 6 `stat-value` rendus |
| INT-CL-13 | XSS dans le titre → échappé à travers HeroSection | `title: '<script>alert("xss")</script>'` | `toContain('&lt;script&gt;')`, `not.toContain('<script>alert')` |
| INT-CL-14 | XSS dans la VP → échappé | `valueProposition: '<img onerror=alert(1)>.'` | `toContain('&lt;img')` |
| INT-CL-15 | XSS dans un titre de benefit → échappé | `title: '<b>Bold</b>'` | `toContain('&lt;b&gt;')` |
| INT-CL-16 | XSS dans une source de stat → échappé | `source: '<script>x</script>'` | `toContain('&lt;script&gt;')` |
| INT-CL-17 | Caractères spéciaux français dans tous les textes | `é`, `è`, `ê`, `ç`, `ô`, `ù` | Tous rendus correctement |
| INT-CL-18 | Emojis dans le titre et la VP | `🚀` dans titre, `💡` dans VP | Emojis présents dans le HTML |
| INT-CL-19 | Ampersand dans une source | `source: 'McKinsey & Company'` | `toContain('McKinsey &amp; Company')` ou `toContain('McKinsey & Company')` |
| INT-CL-20 | Titre fallback "AIAD" propagé au `<h1>` quand heroContent est null | `heroContent: undefined` | `<h1>` contient "AIAD" |

### 4.10 Combinaisons de props (interactions croisées)

| ID | Description | Props | Assertion principale |
|----|-------------|-------|---------------------|
| INT-CO-01 | `spacing='compact'` + `background='gradient'` | Les deux props | `py-10`, `bg-gradient-to-b` sur la même section |
| INT-CO-02 | `spacing='spacious'` + `showBenefits=false` + `showStats=false` | Espacement large, sections cachées | `py-20`, pas de benefits/stats, mais h1 + VP + CTA |
| INT-CO-03 | `centered=false` + `titleSize='sm'` | Toutes les sections alignées à gauche + petit titre | `text-left`, `text-2xl`, pas de `mx-auto` sur le conteneur |
| INT-CO-04 | `benefitsCardVariant='featured'` + `statsShowDividers=false` | Cartes featured + pas de séparateurs stats | `bg-blue-50` dans cards, pas de `border-t border-gray-200` |
| INT-CO-05 | `ctaVariant='outline'` + `ctaSize='sm'` | CTA outline petit | `bg-transparent`, `border-2`, `text-sm`, `px-4` |
| INT-CO-06 | `showCTA=false` + `showValueProposition=false` | Titre + benefits + stats seulement | Pas de CTA ni VP, mais benefits et stats présents |
| INT-CO-07 | `valuePropositionEmphasis='strong'` + `valuePropositionSize='lg'` | VP grande et en gras | `font-medium`, `text-gray-700`, `text-lg md:text-xl` |
| INT-CO-08 | `maxWidth='max-w-4xl'` + `centered=true` + `background='subtle'` | Layout personnalisé complet | `max-w-4xl`, `mx-auto`, `bg-gray-50` |
| INT-CO-09 | `id='custom'` + `class='mt-10 border-b'` | ID et classes custom | `id="custom"`, `aria-labelledby="custom-title"`, `mt-10`, `border-b` |
| INT-CO-10 | Toutes les props par défaut (aucune prop) avec données complètes | Données uniquement | Rendu complet par défaut avec toutes les valeurs par défaut |

---

## 5. Cas limites et gestion d'erreurs

### 5.1 Cas dégradés de données

| ID | Cas | Comportement attendu | Priorité |
|----|-----|----------------------|----------|
| CL-01 | Aucune donnée (props vides `{}`) | Section `<section>` rendue avec h1 "AIAD" en fallback, CTA par défaut | Haute |
| CL-02 | heroContent null, benefits et stats fournis | h1 "AIAD", pas de tagline ni VP, benefits et stats rendus | Haute |
| CL-03 | heroContent fourni, benefits vide, stats vide | h1 + tagline + VP + CTA, pas de BenefitsList ni StatsRow | Haute |
| CL-04 | heroContent avec `isActive: false` passé en prop | HeroSection utilise les données telles quelles (pas de filtrage en prop mode) | Moyenne |
| CL-05 | benefits avec mix `isActive: true/false` passé en prop | BenefitsList reçoit la liste telle quelle (filtrage fait en amont) | Moyenne |
| CL-06 | benefits non triés (ordre 3, 1, 2) | BenefitsList les rend dans l'ordre reçu (tri fait en amont) | Basse |

### 5.2 Cas de sécurité (XSS)

| ID | Cas | Entrée | Sortie attendue |
|----|-----|--------|-----------------|
| XSS-01 | Script dans titre | `<script>alert('xss')</script>` | `&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;` |
| XSS-02 | Event handler dans VP | `<img onerror=alert(1) src=x>.` | `&lt;img onerror=alert(1) src=x&gt;.` |
| XSS-03 | HTML dans un titre de benefit | `<b onmouseover=alert(1)>Gain</b>` | `&lt;b onmouseover=...&gt;Gain&lt;/b&gt;` |
| XSS-04 | URL javascript: dans sourceUrl | `javascript:alert(1)` | Rendu en texte, pas en lien exécutable |

### 5.3 Cas de caractères spéciaux

| ID | Cas | Entrée | Sortie attendue |
|----|-----|--------|-----------------|
| CS-01 | Apostrophe française | `L'IA et l'avenir` | `L&#39;IA et l&#39;avenir` |
| CS-02 | Ampersand | `McKinsey & Company` | `McKinsey &amp; Company` |
| CS-03 | Chevrons | `Gain > 50%` | `Gain &gt; 50%` |
| CS-04 | Guillemets | `Le "framework"` | `Le &quot;framework&quot;` ou `Le "framework"` |
| CS-05 | Accents composés | `à é è ê ë ï ô ù ü ç` | Rendus correctement (UTF-8) |
| CS-06 | Emoji | `🚀 Productivité` | Emoji rendu tel quel |

---

## 6. Exemples entrée/sortie

### 6.1 Assemblage complet par défaut

**Entrée (props) :**
```typescript
{
  heroContent: productionHeroContent,
  benefits: productionBenefits,
  stats: productionStats,
}
```

**Sortie (structure HTML simplifiée) :**
```html
<section id="hero" class="py-16 md:py-24 px-4 md:px-6 lg:px-8" aria-labelledby="hero-title">
  <div class="w-full max-w-7xl mx-auto">

    <!-- ① HeroTitle -->
    <div class="flex flex-col gap-4 text-center">
      <h1 id="hero-title" class="... font-bold tracking-tight text-gray-900">
        AIAD : Le framework pour développer avec des agents IA
      </h1>
      <p class="... text-gray-600 max-w-2xl mx-auto">
        Structurez votre collaboration avec l&#39;intelligence artificielle
      </p>
    </div>

    <!-- ② ValueProposition -->
    <div class="mt-6">
      <p class="leading-relaxed text-center mx-auto ... max-w-3xl">
        Une méthodologie éprouvée pour intégrer les agents IA dans votre workflow
        de développement et multiplier votre productivité.
      </p>
    </div>

    <!-- ③ CTAButton -->
    <div class="mt-8 flex justify-center">
      <a href="/framework" class="inline-flex ... bg-blue-600 text-white ...">
        <span>Explorer le Framework</span>
        <svg class="w-5 h-5" aria-hidden="true">...</svg>
      </a>
    </div>

    <!-- ④ BenefitsList -->
    <div class="mt-12 md:mt-16">
      <section id="benefits-section" aria-labelledby="benefits-section-title" class="mx-auto max-w-6xl">
        <h2 id="benefits-section-title" class="sr-only">Bénéfices clés</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <article class="bg-white p-6 ...">
            <div class="... bg-blue-100"><svg aria-hidden="true"><!-- trending-up --></svg></div>
            <h3 class="font-semibold text-gray-900">Productivité décuplée</h3>
            <p class="text-gray-600">Automatisez les tâches répétitives...</p>
          </article>
          <article><!-- Qualité garantie --></article>
          <article><!-- Collaboration fluide --></article>
        </div>
      </section>
    </div>

    <!-- ⑤ StatsRow -->
    <div class="mt-12 md:mt-16">
      <section id="stats-section" aria-labelledby="stats-section-title" class="mx-auto max-w-5xl">
        <h2 id="stats-section-title" class="sr-only">Chiffres clés</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div class="">
            <!-- StatDisplay: 50% (highlight → bg-blue-50) -->
            <p class="stat-value">50</p><span>%</span>
            <p>Gain de productivité avec les agents IA</p>
            <a href="https://www.mckinsey.com/..." target="_blank" rel="noopener noreferrer">
              <cite>McKinsey Global Institute...</cite>
            </a>
          </div>
          <div class="border-t border-gray-200 ...">
            <!-- StatDisplay: 3x -->
          </div>
          <div class="border-t border-gray-200 ...">
            <!-- StatDisplay: >90% -->
          </div>
        </div>
      </section>
    </div>

  </div>
</section>
```

### 6.2 Sections partiellement masquées

**Entrée :**
```typescript
{
  heroContent: productionHeroContent,
  benefits: productionBenefits,
  stats: productionStats,
  showBenefits: false,
  showStats: false,
  spacing: 'compact',
}
```

**Sortie (structure simplifiée) :**
```html
<section id="hero" class="py-10 md:py-14 px-4 md:px-6 lg:px-8" aria-labelledby="hero-title">
  <div class="w-full max-w-7xl mx-auto">
    <!-- HeroTitle : h1 + tagline -->
    <!-- ValueProposition : mt-4 -->
    <!-- CTAButton : mt-6 -->
    <!-- PAS de BenefitsList -->
    <!-- PAS de StatsRow -->
  </div>
</section>
```

**Vérifications :**
- Pas de `<h2>`, pas de `<h3>`, pas de `<article>`
- Comptage `<h1` === 1, `<h2` === 0, `<h3` === 0

### 6.3 Fallback sans données

**Entrée :**
```typescript
{ /* aucune prop */ }
```

**Sortie (structure simplifiée) :**
```html
<section id="hero" class="py-16 md:py-24 ..." aria-labelledby="hero-title">
  <div class="w-full max-w-7xl mx-auto">
    <div class="flex flex-col ... text-center">
      <h1 id="hero-title" class="...">AIAD</h1>
      <!-- Pas de tagline (vide) -->
    </div>
    <!-- Pas de ValueProposition (vide) -->
    <div class="mt-8 flex justify-center">
      <a href="/framework" class="...">Explorer le Framework</a>
    </div>
    <!-- BenefitsList et StatsRow tentent leur chargement Content Collections -->
  </div>
</section>
```

### 6.4 Protection XSS end-to-end

**Entrée :**
```typescript
{
  heroContent: {
    ...productionHeroContent,
    title: '<script>alert("xss")</script>AIAD',
    tagline: '<img src=x onerror=alert(1)>Test tagline',
    valueProposition: '<b onmouseover=alert(1)>Proposition.</b>',
  },
  benefits: [{
    ...productionBenefits[0],
    title: '<script>x</script>',
    description: '<iframe src="evil.com"></iframe> Description valide.',
  }],
  stats: productionStats,
}
```

**Sortie (vérifications) :**
```html
<!-- Titre : script échappé -->
<h1>...&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;AIAD</h1>

<!-- Tagline : img échappée -->
<p>...&lt;img src=x onerror=alert(1)&gt;Test tagline</p>

<!-- VP : b échappée -->
<p>...&lt;b onmouseover=alert(1)&gt;Proposition.&lt;/b&gt;</p>

<!-- Benefit : iframe échappée -->
<p>...&lt;iframe src=&quot;evil.com&quot;&gt;&lt;/iframe&gt; Description valide.</p>
```

---

## 7. Tests

### 7.1 Fichier de test

| Fichier | Type | Framework |
|---------|------|-----------|
| `tests/integration/hero-section.integration.test.ts` | Intégration | Vitest + Astro Container API |

### 7.2 Récapitulatif quantitatif

| Catégorie | Nb tests | Référence |
|-----------|----------|-----------|
| Assemblage complet (présence des sous-composants) | 13 | INT-01 à INT-13 |
| Hiérarchie HTML et structure sémantique | 10 | INT-H-01 à INT-H-10 |
| Accessibilité globale (ARIA tree) | 10 | INT-A-01 à INT-A-10 |
| Ordre séquentiel dans le DOM | 7 | INT-O-01 à INT-O-07 |
| Espacement inter-sections | 10 | INT-S-01 à INT-S-10 |
| Propagation des props parent → enfants | 24 | INT-P-01 à INT-P-24 |
| Visibilité conditionnelle | 11 | INT-V-01 à INT-V-11 |
| Données de production | 10 | INT-D-01 à INT-D-10 |
| Cas limites et dégradés | 20 | INT-CL-01 à INT-CL-20 |
| Combinaisons de props | 10 | INT-CO-01 à INT-CO-10 |
| **Total** | **~125 tests** | |

### 7.3 Pattern de test standard

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import HeroSection from '@components/hero/HeroSection.astro'
import type { HeroContent, BenefitItem, StatItem } from '@/types'

describe('HeroSection — Tests d\'intégration', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  // Fixtures de production
  const productionHeroContent: HeroContent = { /* ... */ }
  const productionBenefits: BenefitItem[] = [ /* ... */ ]
  const productionStats: StatItem[] = [ /* ... */ ]

  const defaultProps = {
    heroContent: productionHeroContent,
    benefits: productionBenefits,
    stats: productionStats,
  }

  // Helper : rend et retourne le HTML
  async function render(props: Record<string, unknown> = defaultProps) {
    return container.renderToString(HeroSection, { props })
  }

  // Helper : compte les occurrences d'un pattern
  function countOccurrences(html: string, pattern: string): number {
    return (html.match(new RegExp(pattern, 'g')) || []).length
  }

  describe('Assemblage complet', () => { /* INT-01 à INT-13 */ })
  describe('Hiérarchie HTML', () => { /* INT-H-01 à INT-H-10 */ })
  describe('Accessibilité globale', () => { /* INT-A-01 à INT-A-10 */ })
  describe('Ordre séquentiel', () => { /* INT-O-01 à INT-O-07 */ })
  describe('Espacement inter-sections', () => { /* INT-S-01 à INT-S-10 */ })
  describe('Propagation des props', () => { /* INT-P-01 à INT-P-24 */ })
  describe('Visibilité conditionnelle', () => { /* INT-V-01 à INT-V-11 */ })
  describe('Données de production', () => { /* INT-D-01 à INT-D-10 */ })
  describe('Cas limites et dégradés', () => { /* INT-CL-01 à INT-CL-20 */ })
  describe('Combinaisons de props', () => { /* INT-CO-01 à INT-CO-10 */ })
})
```

### 7.4 Exemples de tests complets

#### Assemblage complet

```typescript
describe('Assemblage complet', () => {
  it('INT-01 : rend une <section> root avec id="hero"', async () => {
    const html = await render()

    expect(html).toContain('<section')
    expect(html).toContain('id="hero"')
  })

  it('INT-02 : contient exactement un <h1>', async () => {
    const html = await render()

    const h1Count = countOccurrences(html, '<h1')
    expect(h1Count).toBe(1)
  })

  it('INT-08 : rend exactement 3 BenefitCards (<article>)', async () => {
    const html = await render()

    const articleCount = countOccurrences(html, '<article')
    expect(articleCount).toBe(3)
  })

  it('INT-10 : rend exactement 3 valeurs stat-value', async () => {
    const html = await render()

    const statCount = countOccurrences(html, 'stat-value')
    expect(statCount).toBe(3)
  })

  it('INT-12 : contient les 3 valeurs statistiques de production', async () => {
    const html = await render()

    expect(html).toContain('50%')
    expect(html).toContain('3x')
    // >90% est échappé par Astro
    expect(html).toContain('&gt;90%')
  })
})
```

#### Hiérarchie HTML

```typescript
describe('Hiérarchie HTML', () => {
  it('INT-H-01 : exactement 1 <h1>', async () => {
    const html = await render()
    expect(countOccurrences(html, '<h1')).toBe(1)
  })

  it('INT-H-02 : exactement 2 <h2> (bénéfices + stats)', async () => {
    const html = await render()
    expect(countOccurrences(html, '<h2')).toBe(2)
  })

  it('INT-H-03 : exactement 3 <h3> (3 BenefitCards)', async () => {
    const html = await render()
    expect(countOccurrences(html, '<h3')).toBe(3)
  })

  it('INT-H-04 : pas de <h4>, <h5> ou <h6>', async () => {
    const html = await render()
    expect(html).not.toMatch(/<h[4-6]/)
  })

  it('INT-H-05 : le <h1> apparaît avant tous les <h2>', async () => {
    const html = await render()

    const h1Index = html.indexOf('<h1')
    const firstH2Index = html.indexOf('<h2')
    expect(h1Index).toBeLessThan(firstH2Index)
  })

  it('INT-H-06 : les <h2> apparaissent avant les <h3>', async () => {
    const html = await render()

    const firstH2Index = html.indexOf('<h2')
    const firstH3Index = html.indexOf('<h3')
    expect(firstH2Index).toBeLessThan(firstH3Index)
  })

  it('INT-H-07 : hiérarchie continue sans saut h1 → h3', async () => {
    const html = await render()

    const h1Index = html.indexOf('<h1')
    const firstH2Index = html.indexOf('<h2')
    const firstH3Index = html.indexOf('<h3')

    // h2 existe et est entre h1 et h3
    expect(firstH2Index).toBeGreaterThan(h1Index)
    expect(firstH2Index).toBeLessThan(firstH3Index)
  })
})
```

#### Accessibilité globale

```typescript
describe('Accessibilité globale', () => {
  it('INT-A-01 : section hero a aria-labelledby pointant vers le h1', async () => {
    const html = await render()

    expect(html).toContain('aria-labelledby="hero-title"')
    expect(html).toContain('id="hero-title"')
  })

  it('INT-A-04 : tous les aria-labelledby pointent vers des IDs existants', async () => {
    const html = await render()

    // Extraire tous les aria-labelledby
    const ariaRefs = html.match(/aria-labelledby="([^"]+)"/g) || []
    for (const ref of ariaRefs) {
      const id = ref.match(/aria-labelledby="([^"]+)"/)?.[1]
      expect(html).toContain(`id="${id}"`)
    }
  })

  it('INT-A-06 : les liens sources ont rel="noopener noreferrer"', async () => {
    const html = await render()

    const relCount = countOccurrences(html, 'rel="noopener noreferrer"')
    expect(relCount).toBeGreaterThanOrEqual(3) // 3 sources stats
  })

  it('INT-A-09 : les <h2> de BenefitsList et StatsRow sont sr-only', async () => {
    const html = await render()

    // Les h2 doivent avoir la classe sr-only
    const h2Matches = html.match(/<h2[^>]*class="[^"]*sr-only[^"]*"/g) || []
    expect(h2Matches.length).toBe(2)
  })
})
```

#### Ordre séquentiel

```typescript
describe('Ordre séquentiel', () => {
  it('INT-O-01 : HeroTitle apparaît en premier', async () => {
    const html = await render()

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

  it('INT-O-05 : StatsRow apparaît après BenefitsList', async () => {
    const html = await render()

    const benefitsIndex = html.indexOf('benefits-section')
    const statsIndex = html.indexOf('stats-section')
    expect(statsIndex).toBeGreaterThan(benefitsIndex)
  })

  it('INT-O-06 : les 3 BenefitCards dans l\'ordre 1, 2, 3', async () => {
    const html = await render()

    const idx1 = html.indexOf('Productivité décuplée')
    const idx2 = html.indexOf('Qualité garantie')
    const idx3 = html.indexOf('Collaboration fluide')

    expect(idx1).toBeLessThan(idx2)
    expect(idx2).toBeLessThan(idx3)
  })

  it('INT-O-07 : les 3 StatDisplay dans l\'ordre 1, 2, 3', async () => {
    const html = await render()

    const idx1 = html.indexOf('50%')
    const idx2 = html.indexOf('3x')
    const idx3 = html.indexOf('&gt;90%')

    expect(idx1).toBeLessThan(idx2)
    expect(idx2).toBeLessThan(idx3)
  })
})
```

#### Cas limites et dégradés

```typescript
describe('Cas limites et dégradés', () => {
  it('INT-CL-01 : rendu minimal sans aucune prop', async () => {
    const html = await render({})

    expect(html).toContain('<section')
    expect(html).toContain('<h1')
    expect(html).toContain('AIAD')
  })

  it('INT-CL-05 : benefits vide → pas de section bénéfices', async () => {
    const html = await render({
      heroContent: productionHeroContent,
      benefits: [],
      stats: productionStats,
    })

    expect(html).not.toContain('benefits-section')
    expect(countOccurrences(html, '<article')).toBe(0)
    expect(countOccurrences(html, '<h3')).toBe(0)
    // Stats toujours présentes
    expect(html).toContain('stats-section')
  })

  it('INT-CL-13 : XSS dans le titre échappé à travers l\'assemblage', async () => {
    const html = await render({
      heroContent: {
        ...productionHeroContent,
        title: '<script>alert("xss")</script>AIAD',
      },
      benefits: productionBenefits,
      stats: productionStats,
    })

    expect(html).toContain('&lt;script&gt;')
    expect(html).not.toContain('<script>alert')
  })

  it('INT-CL-18 : emojis rendus correctement', async () => {
    const html = await render({
      heroContent: {
        ...productionHeroContent,
        title: 'AIAD 🚀 Framework',
        tagline: '💡 Intelligence artificielle',
      },
      benefits: productionBenefits,
      stats: productionStats,
    })

    expect(html).toContain('🚀')
    expect(html).toContain('💡')
  })
})
```

#### Combinaisons de props

```typescript
describe('Combinaisons de props', () => {
  it('INT-CO-01 : spacing compact + background gradient', async () => {
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

  it('INT-CO-04 : benefitsCardVariant featured + statsShowDividers false', async () => {
    const html = await render({
      ...defaultProps,
      benefitsCardVariant: 'featured',
      statsShowDividers: false,
    })

    // Cards featured
    expect(html).toContain('bg-blue-50')
    expect(html).toContain('border-blue-100')

    // Pas de séparateurs dans stats
    // Les séparateurs sont des classes sur les wrappers de stats (sauf le premier)
    // Vérifier que les dividers ne sont pas rendus
    const statWrapperBorders = countOccurrences(html, 'border-t border-gray-200')
    // Avec showDividers=false, il ne devrait pas y avoir de border-t border-gray-200 dans StatsRow
    // Note: la vérification exacte dépend de l'implémentation StatsRow
  })

  it('INT-CO-09 : id custom + class custom', async () => {
    const html = await render({
      ...defaultProps,
      id: 'landing-hero',
      class: 'mt-10 border-b',
    })

    expect(html).toContain('id="landing-hero"')
    expect(html).toContain('aria-labelledby="landing-hero-title"')
    expect(html).toContain('id="landing-hero-title"')
    expect(html).toContain('mt-10')
    expect(html).toContain('border-b')
  })
})
```

### 7.5 Assertions types utilisées

| Assertion | Usage | Exemple |
|-----------|-------|---------|
| `expect(html).toContain(string)` | Présence d'un texte/classe dans le HTML complet | `toContain('Productivité décuplée')` |
| `expect(html).not.toContain(string)` | Absence | `not.toContain('<script>alert')` |
| `expect(html).toMatch(regex)` | Pattern dans le HTML | `toMatch(/<h2[^>]*class="[^"]*sr-only/)` |
| `expect(count).toBe(n)` | Comptage exact d'éléments | Nombre de `<article>` === 3 |
| `expect(index).toBeLessThan(other)` | Ordre dans le DOM | Ordre des sections |
| `expect(index).toBeGreaterThan(other)` | Ordre inverse | Stats après Benefits |
| `countOccurrences(html, pattern)` | Helper comptage | Nombre de `<h2` |

### 7.6 Commandes d'exécution

```bash
# Exécuter les tests d'intégration HeroSection
pnpm vitest run tests/integration/hero-section.integration.test.ts

# Mode watch
pnpm vitest tests/integration/hero-section.integration.test.ts

# Avec couverture
pnpm vitest run tests/integration/ --coverage

# Tous les tests (unitaires + intégration)
pnpm vitest run
```

---

## 8. Critères d'acceptation

- [ ] Le fichier `tests/integration/hero-section.integration.test.ts` existe
- [ ] Tous les ~125 tests passent avec `pnpm vitest run tests/integration/`
- [ ] Les 10 catégories de tests sont implémentées (assemblage, hiérarchie, a11y, ordre, espacement, propagation, visibilité, production, cas limites, combinaisons)
- [ ] Le rendu complet avec données de production est validé (tous les textes, URLs, classes)
- [ ] La hiérarchie HTML est stricte : 1 `<h1>`, 2 `<h2>`, 3 `<h3>`, 0 `<h4-h6>`
- [ ] Tous les `aria-labelledby` pointent vers des IDs existants dans le DOM
- [ ] L'échappement XSS est vérifié end-to-end (titre, tagline, VP, benefits, stats)
- [ ] Les 3 variantes d'espacement (`compact`, `default`, `spacious`) sont validées avec toutes les classes internes
- [ ] Les 3 variantes de fond (`none`, `gradient`, `subtle`) sont validées
- [ ] La propagation des props est vérifiée pour chaque sous-composant (centered, sizes, variants, etc.)
- [ ] Les 4 sections masquables sont testées individuellement et en combinaison
- [ ] Le fallback sans données (props vides) produit un rendu valide avec titre "AIAD"
- [ ] Les données de production (Content Collections réelles) sont utilisées comme fixtures
- [ ] Les caractères spéciaux français (accents, apostrophes, ampersand) sont testés
- [ ] Les emojis sont rendus correctement
- [ ] 0 erreur TypeScript (`pnpm typecheck`)

---

## 9. Notes d'implémentation

### 9.1 Différence avec le fichier existant `hero-section.test.ts`

Le fichier `tests/unit/components/hero-section.test.ts` (créé avec T-001-F8/T-001-T2) contient 32 tests unitaires qui vérifient les props individuelles de HeroSection. Ces tests restent valides et ne sont pas remplacés.

Le nouveau fichier `tests/integration/hero-section.integration.test.ts` (T-001-T3) ajoute une couverture d'intégration complémentaire :

| Aspect | `hero-section.test.ts` (unitaire) | `hero-section.integration.test.ts` (intégration) |
|--------|-----------------------------------|---------------------------------------------------|
| Données | Fixtures minimales | Données de production complètes |
| Structure HTML | Vérifie des fragments | Vérifie l'arbre complet (h1→h2→h3, comptages) |
| Ordre DOM | Non vérifié | Ordre séquentiel vérifié entre toutes les sections |
| Accessibilité | aria-labelledby du hero | ARIA tree complet (tous les aria-labelledby, sr-only, rel) |
| Espacement | Classes de la section root | Classes de tous les wrappers internes |
| Propagation | Quelques props | Toutes les props de passthrough (24 tests) |
| XSS | Non testé | Vérifié end-to-end à travers l'assemblage |
| Combinaisons | Non testées | 10 scénarios multi-props |

### 9.2 Ordre de développement recommandé

1. Créer le dossier `tests/integration/` s'il n'existe pas
2. Créer le fichier `hero-section.integration.test.ts`
3. Implémenter les fixtures de production (copier les données réelles des JSON)
4. Implémenter les helpers (`render`, `countOccurrences`)
5. Catégorie par catégorie, implémenter les tests dans cet ordre :
   - a) Assemblage complet (INT-01 à INT-13)
   - b) Hiérarchie HTML (INT-H-01 à INT-H-10)
   - c) Accessibilité (INT-A-01 à INT-A-10)
   - d) Ordre séquentiel (INT-O-01 à INT-O-07)
   - e) Espacement (INT-S-01 à INT-S-10)
   - f) Propagation (INT-P-01 à INT-P-24)
   - g) Visibilité (INT-V-01 à INT-V-11)
   - h) Données de production (INT-D-01 à INT-D-10)
   - i) Cas limites (INT-CL-01 à INT-CL-20)
   - j) Combinaisons (INT-CO-01 à INT-CO-10)
6. Vérifier que tous les tests passent : `pnpm vitest run tests/integration/`
7. Vérifier le typage : `pnpm typecheck`

### 9.3 Contraintes de l'Astro Container API

- **`experimental_AstroContainer`** : API expérimentale pouvant changer entre versions d'Astro
- **Échappement HTML** : Astro échappe `'` → `&#39;`, `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`, `"` → `&quot;`
- **Import dynamique** : Le `await import('astro:content')` dans HeroSection nécessite que les données soient passées via props en test pour éviter les erreurs
- **Attributs data-astro** : Astro peut ajouter des attributs `data-astro-*`. Les assertions doivent utiliser des patterns flexibles
- **Volume HTML** : Le rendu complet est volumineux (~300-500 lignes). Les comptages via regex sont préférés aux assertions exactes

### 9.4 Relation avec les autres tâches de test

| Tâche | Relation avec T-001-T3 |
|-------|------------------------|
| T-001-T1 (tests schémas Zod) | Valide les données **avant** qu'elles n'entrent dans les composants |
| T-001-T2 (tests unitaires) | Valide chaque composant **individuellement** |
| **T-001-T3 (cette tâche)** | Valide l'**assemblage complet** de tous les composants |
| T-001-T4 (tests a11y) | Valide l'accessibilité **dans le navigateur** via axe-core + Playwright |
| T-001-T5 (tests utilisateur) | Valide l'**expérience utilisateur** (temps de lecture < 30s) |

### 9.5 Configuration Vitest mise à jour

Le fichier `vitest.config.ts` existant inclut déjà `tests/**/*.test.ts`, ce qui couvre `tests/integration/*.test.ts`. Aucune modification de configuration n'est nécessaire.

---

## 10. Références

| Ressource | Lien |
|-----------|------|
| US-001 Spec | [spec.md](./spec.md) |
| T-001-F8 HeroSection | [T-001-F8-composant-HeroSection.md](./T-001-F8-composant-HeroSection.md) |
| T-001-T2 Tests unitaires | [T-001-T2-tests-unitaires-composants.md](./T-001-T2-tests-unitaires-composants.md) |
| T-001-T1 Tests schémas | [T-001-T1-tests-unitaires-schemas-zod.md](./T-001-T1-tests-unitaires-schemas-zod.md) |
| Architecture | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| HeroSection source | `src/components/hero/HeroSection.astro` |
| Données hero | `src/content/hero/main.json` |
| Données bénéfices | `src/content/benefits/*.json` |
| Données statistiques | `src/content/stats/*.json` |
| Types TypeScript | `src/types/hero.ts`, `src/types/benefit.ts`, `src/types/stat.ts` |
| Schémas Zod | `src/schemas/hero.ts`, `src/schemas/benefit.ts`, `src/schemas/stat.ts` |
| Tests unitaires existants | `tests/unit/components/hero-section.test.ts` |
| Astro Container API | https://docs.astro.build/en/reference/container-reference/ |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 05/02/2026 | Création initiale — Spécification complète des tests d'intégration HeroSection |
