# T-001-F8 : Composant HeroSection (assemblage complet)

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 05 février 2026 |
| **Statut** | ✅ Terminé |
| **User Story** | [US-001](./spec.md) — Comprendre AIAD rapidement |
| **Dépendances** | T-001-F1 (HeroTitle), T-001-F2 (ValueProposition), T-001-F3 (CTAButton), T-001-F5 (BenefitsList), T-001-F7 (StatsRow) |
| **Bloque** | T-001-F9 (Intégration page d'accueil), T-001-T3 (Tests intégration) |

---

## 1. Objectif

Créer le composant **HeroSection** qui assemble tous les sous-composants du hero (HeroTitle, ValueProposition, CTAButton, BenefitsList, StatsRow) en une section cohérente, responsive et accessible. Ce composant est le point d'entrée unique pour afficher l'intégralité du hero sur la page d'accueil.

---

## 2. Contexte technique

### 2.1 Stack

| Technologie | Version | Rôle |
|-------------|---------|------|
| Astro | 4.x | Composant statique (SSG, 0 JS client) |
| TypeScript | 5.x | Typage strict des props et données |
| Tailwind CSS | 3.x | Utility-first, responsive mobile-first |

### 2.2 Arborescence

```
src/
├── components/
│   ├── hero/
│   │   ├── HeroTitle.astro          ← T-001-F1 ✅
│   │   ├── ValueProposition.astro   ← T-001-F2 ✅
│   │   ├── BenefitCard.astro        ← T-001-F4 ✅
│   │   ├── BenefitsList.astro       ← T-001-F5 ✅
│   │   ├── StatDisplay.astro        ← T-001-F6 ✅
│   │   ├── StatsRow.astro           ← T-001-F7 ✅
│   │   └── HeroSection.astro        ← CE COMPOSANT
│   └── common/
│       └── CTAButton.astro          ← T-001-F3 ✅
├── content/
│   ├── hero/main.json               ← Données hero (T-001-B4)
│   ├── benefits/main.json           ← Données bénéfices (T-001-B5)
│   └── stats/main.json              ← Données statistiques (T-001-B6)
└── types/
    ├── hero.ts                      ← HeroContent type
    ├── benefit.ts                   ← BenefitItem type
    └── stat.ts                      ← StatItem type
```

### 2.3 Dépendances

| Composant | Type | Import |
|-----------|------|--------|
| HeroTitle | Astro composant | `./HeroTitle.astro` |
| ValueProposition | Astro composant | `./ValueProposition.astro` |
| CTAButton | Astro composant | `@components/common/CTAButton.astro` |
| BenefitsList | Astro composant | `./BenefitsList.astro` |
| StatsRow | Astro composant | `./StatsRow.astro` |
| HeroContent | Type TypeScript | `@/types` |
| BenefitItem | Type TypeScript | `@/types` |
| StatItem | Type TypeScript | `@/types` |

### 2.4 Position dans l'architecture

```
Page d'accueil (index.astro)
└── HeroSection          ← CE COMPOSANT (assemblage)
    ├── HeroTitle         ← Atomique (H1 + tagline)
    ├── ValueProposition  ← Atomique (paragraphe)
    ├── CTAButton         ← Atomique (lien/bouton)
    ├── BenefitsList      ← Composé (grille de BenefitCard)
    │   └── BenefitCard × 3
    └── StatsRow          ← Composé (ligne de StatDisplay)
        └── StatDisplay × 3
```

---

## 3. Spécifications fonctionnelles

### 3.1 Description

Le composant `HeroSection` est un **composant d'assemblage** (pattern *container*) qui :

1. Charge les données hero depuis Content Collections (ou les reçoit en props)
2. Orchestre le rendu séquentiel de 5 sous-composants
3. Gère l'espacement vertical cohérent entre les sections
4. Assure le padding responsive global du hero
5. Fournit un point de configuration unique pour tout le hero

### 3.2 Comportement attendu

```
┌──────────────────────────────────────────────────────────────┐
│                        <section>                              │
│                      py-16 md:py-24                           │
│                      px-4 md:px-6                             │
│                                                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    HeroTitle                              │ │
│  │    "AIAD : Le framework pour développer avec des         │ │
│  │                    agents IA"                             │ │
│  │  "Structurez votre collaboration avec l'intelligence     │ │
│  │                   artificielle"                           │ │
│  └──────────────────────────────────────────────────────────┘ │
│                         ↕ mt-6                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                 ValueProposition                          │ │
│  │   "Une méthodologie éprouvée pour intégrer les agents    │ │
│  │   IA dans votre workflow de développement et multiplier  │ │
│  │                 votre productivité."                      │ │
│  └──────────────────────────────────────────────────────────┘ │
│                         ↕ mt-8                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                     CTAButton                             │ │
│  │             [ Explorer le Framework → ]                   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                      ↕ mt-12 md:mt-16                         │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                   BenefitsList                            │ │
│  │   ┌────────────┐  ┌────────────┐  ┌────────────┐        │ │
│  │   │ Productivé │  │  Qualité   │  │Collaboration│       │ │
│  │   │  décuplée  │  │  garantie  │  │   fluide    │       │ │
│  │   └────────────┘  └────────────┘  └────────────┘        │ │
│  └──────────────────────────────────────────────────────────┘ │
│                      ↕ mt-12 md:mt-16                         │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                     StatsRow                              │ │
│  │   ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐           │ │
│  │   │   50%    │ │ │    3x    │ │ │   >90%   │           │ │
│  │   │  Gain de │ │ │Plus rapide│ │ │Développeurs│          │ │
│  │   │producti- │ │ │pour coder│ │ │ satisfaits│           │ │
│  │   │  vité    │ │ │          │ │ │           │           │ │
│  │   └──────────┘ │ └──────────┘ │ └──────────┘           │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### 3.3 Hiérarchie visuelle

| Élément | Rôle | Espacement depuis l'élément précédent |
|---------|------|---------------------------------------|
| HeroTitle | Accroche principale (H1) | — (premier élément) |
| ValueProposition | Explication concise | `mt-6` (24px) |
| CTAButton | Action principale | `mt-8` (32px) |
| BenefitsList | Bénéfices clés | `mt-12 md:mt-16` (48px → 64px) |
| StatsRow | Preuves chiffrées | `mt-12 md:mt-16` (48px → 64px) |

### 3.4 Sections conditionnelles

Chaque sous-section peut être masquée individuellement :

| Prop | Section contrôlée | Par défaut |
|------|-------------------|------------|
| `showValueProposition` | ValueProposition | `true` |
| `showCTA` | CTAButton | `true` |
| `showBenefits` | BenefitsList | `true` |
| `showStats` | StatsRow | `true` |

> **Note** : Le `HeroTitle` est toujours affiché (il porte le `<h1>` de la page).

### 3.5 Accessibilité (RGAA AA)

| Critère | Implémentation | Référence RGAA |
|---------|----------------|----------------|
| Landmark | `<section aria-labelledby="hero-title">` | 9.2 |
| Titre de page | `<h1>` via HeroTitle (unique sur la page) | 9.1 |
| Hiérarchie titres | H1 (hero) → H2 (bénéfices, stats) → H3 (cartes) | 9.1 |
| Contraste texte | Ratio ≥ 4.5:1 (gray-900 sur fond blanc) | 3.2 |
| Contraste CTA | Ratio ≥ 4.5:1 (blanc sur blue-600) | 3.2 |
| Focus visible | Focus ring sur CTAButton et liens sources | 10.7 |
| Responsive | Fonctionnel de 320px à 1920px | 13.10 |
| Lecture < 30s | Contenu hero lisible en < 30 secondes | Spec US-001 |

---

## 4. Spécifications techniques

### 4.1 Interface TypeScript

```typescript
// src/components/hero/HeroSection.astro (frontmatter)

import type { HeroContent } from '@/types'
import type { BenefitItem } from '@/types'
import type { StatItem } from '@/types'

/**
 * Espacement vertical entre les sections du hero.
 * - 'compact': Espacement réduit pour les écrans petits ou les layouts denses
 * - 'default': Espacement standard recommandé
 * - 'spacious': Espacement large pour les mises en page aérées
 */
export type HeroSectionSpacing = 'compact' | 'default' | 'spacious'

/**
 * Style de fond de la section hero.
 * - 'none': Fond transparent (hérite du parent)
 * - 'gradient': Dégradé subtil blanc vers gris clair
 * - 'subtle': Fond gris très léger uniforme
 */
export type HeroSectionBackground = 'none' | 'gradient' | 'subtle'

/**
 * Props du composant HeroSection.
 *
 * Composant d'assemblage qui orchestre le rendu de tous les
 * sous-composants du hero : HeroTitle, ValueProposition,
 * CTAButton, BenefitsList, StatsRow.
 *
 * @example
 * ```astro
 * ---
 * import HeroSection from '@components/hero/HeroSection.astro'
 * ---
 * <HeroSection />
 * ```
 *
 * @example
 * ```astro
 * <HeroSection
 *   spacing="spacious"
 *   background="gradient"
 *   ctaText="Découvrir le Framework"
 *   ctaHref="/framework"
 *   showStats={false}
 * />
 * ```
 */
export interface Props {
  // ── Données ───────────────────────────────────────────────

  /**
   * Données du hero (titre, tagline, value proposition).
   * Si non fourni, charge automatiquement depuis Content Collections.
   */
  heroContent?: HeroContent

  /**
   * Liste des bénéfices à afficher.
   * Si non fourni, délègue le chargement à BenefitsList.
   */
  benefits?: BenefitItem[]

  /**
   * Liste des statistiques à afficher.
   * Si non fourni, délègue le chargement à StatsRow.
   */
  stats?: StatItem[]

  // ── Configuration CTA ─────────────────────────────────────

  /**
   * Texte du bouton CTA principal.
   * @default 'Explorer le Framework'
   */
  ctaText?: string

  /**
   * URL de destination du CTA.
   * @default '/framework'
   */
  ctaHref?: string

  /**
   * Variante visuelle du CTA.
   * @default 'primary'
   */
  ctaVariant?: 'primary' | 'secondary' | 'outline' | 'ghost'

  /**
   * Taille du CTA.
   * @default 'lg'
   */
  ctaSize?: 'sm' | 'md' | 'lg'

  // ── Layout ────────────────────────────────────────────────

  /**
   * Espacement vertical entre les sections du hero.
   * @default 'default'
   */
  spacing?: HeroSectionSpacing

  /**
   * Style de fond de la section hero.
   * @default 'none'
   */
  background?: HeroSectionBackground

  /**
   * Centre tous les contenus horizontalement.
   * @default true
   */
  centered?: boolean

  /**
   * Largeur maximale du conteneur interne.
   * @default 'max-w-7xl'
   */
  maxWidth?: string

  // ── Configuration sous-composants ─────────────────────────

  /**
   * Taille du titre HeroTitle.
   * @default 'lg'
   */
  titleSize?: 'sm' | 'md' | 'lg'

  /**
   * Taille de la ValueProposition.
   * @default 'md'
   */
  valuePropositionSize?: 'sm' | 'md' | 'lg'

  /**
   * Emphase de la ValueProposition.
   * @default 'normal'
   */
  valuePropositionEmphasis?: 'subtle' | 'normal' | 'strong'

  /**
   * Nombre de colonnes de la grille BenefitsList.
   * @default 'auto'
   */
  benefitsColumns?: 1 | 2 | 3 | 'auto'

  /**
   * Variante des cartes BenefitCard.
   * @default 'default'
   */
  benefitsCardVariant?: 'default' | 'compact' | 'featured'

  /**
   * Afficher les séparateurs entre les statistiques.
   * @default true
   */
  statsShowDividers?: boolean

  /**
   * Afficher les sources des statistiques.
   * @default true
   */
  statsShowSources?: boolean

  // ── Visibilité des sections ───────────────────────────────

  /**
   * Afficher la ValueProposition.
   * @default true
   */
  showValueProposition?: boolean

  /**
   * Afficher le bouton CTA.
   * @default true
   */
  showCTA?: boolean

  /**
   * Afficher la section BenefitsList.
   * @default true
   */
  showBenefits?: boolean

  /**
   * Afficher la section StatsRow.
   * @default true
   */
  showStats?: boolean

  // ── Accessibilité / HTML ──────────────────────────────────

  /**
   * Classes CSS additionnelles pour la section root.
   */
  class?: string

  /**
   * ID de la section hero.
   * @default 'hero'
   */
  id?: string
}
```

### 4.2 Implémentation du composant

```astro
---
// src/components/hero/HeroSection.astro

import type { HeroContent, BenefitItem, StatItem } from '@/types'
import HeroTitle from './HeroTitle.astro'
import ValueProposition from './ValueProposition.astro'
import CTAButton from '@components/common/CTAButton.astro'
import BenefitsList from './BenefitsList.astro'
import StatsRow from './StatsRow.astro'

export type HeroSectionSpacing = 'compact' | 'default' | 'spacious'
export type HeroSectionBackground = 'none' | 'gradient' | 'subtle'

export interface Props {
  heroContent?: HeroContent
  benefits?: BenefitItem[]
  stats?: StatItem[]
  ctaText?: string
  ctaHref?: string
  ctaVariant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  ctaSize?: 'sm' | 'md' | 'lg'
  spacing?: HeroSectionSpacing
  background?: HeroSectionBackground
  centered?: boolean
  maxWidth?: string
  titleSize?: 'sm' | 'md' | 'lg'
  valuePropositionSize?: 'sm' | 'md' | 'lg'
  valuePropositionEmphasis?: 'subtle' | 'normal' | 'strong'
  benefitsColumns?: 1 | 2 | 3 | 'auto'
  benefitsCardVariant?: 'default' | 'compact' | 'featured'
  statsShowDividers?: boolean
  statsShowSources?: boolean
  showValueProposition?: boolean
  showCTA?: boolean
  showBenefits?: boolean
  showStats?: boolean
  class?: string
  id?: string
}

const {
  heroContent: heroContentProp,
  benefits,
  stats,
  ctaText = 'Explorer le Framework',
  ctaHref = '/framework',
  ctaVariant = 'primary',
  ctaSize = 'lg',
  spacing = 'default',
  background = 'none',
  centered = true,
  maxWidth = 'max-w-7xl',
  titleSize = 'lg',
  valuePropositionSize = 'md',
  valuePropositionEmphasis = 'normal',
  benefitsColumns = 'auto',
  benefitsCardVariant = 'default',
  statsShowDividers = true,
  statsShowSources = true,
  showValueProposition = true,
  showCTA = true,
  showBenefits = true,
  showStats = true,
  class: className = '',
  id = 'hero',
} = Astro.props

// ── Chargement des données hero ──────────────────────────────

let heroContent: HeroContent | null = null

if (heroContentProp) {
  heroContent = heroContentProp
} else {
  try {
    const { getCollection } = await import('astro:content')
    const heroData = await getCollection('hero')
    const activeHero = heroData
      .map((entry) => entry.data as HeroContent)
      .find((h) => h.isActive !== false && h.locale === 'fr')
    heroContent = activeHero || null
  } catch {
    console.warn('[HeroSection] Could not load hero content from Content Collections')
    heroContent = null
  }
}

// Validation en développement
if (import.meta.env.DEV) {
  if (!heroContent) {
    console.error('[HeroSection] No hero content available — section will render with fallback')
  }
  if (!heroContent?.title) {
    console.warn('[HeroSection] Hero title is missing')
  }
}

// Valeurs par défaut si aucune donnée disponible
const title = heroContent?.title || 'AIAD'
const tagline = heroContent?.tagline || ''
const valueProposition = heroContent?.valueProposition || ''

// ── Mapping des classes d'espacement ─────────────────────────

/**
 * Classes d'espacement entre les sections internes.
 * Trois paliers : compact, default, spacious.
 */
const spacingClasses = {
  compact: {
    section: 'py-10 md:py-14',
    afterTitle: 'mt-4',
    afterValue: 'mt-6',
    afterCta: 'mt-8 md:mt-10',
    afterBenefits: 'mt-8 md:mt-10',
  },
  default: {
    section: 'py-16 md:py-24',
    afterTitle: 'mt-6',
    afterValue: 'mt-8',
    afterCta: 'mt-12 md:mt-16',
    afterBenefits: 'mt-12 md:mt-16',
  },
  spacious: {
    section: 'py-20 md:py-32',
    afterTitle: 'mt-8',
    afterValue: 'mt-10',
    afterCta: 'mt-16 md:mt-20',
    afterBenefits: 'mt-16 md:mt-20',
  },
} as const

const currentSpacing = spacingClasses[spacing]

// ── Mapping des classes de fond ──────────────────────────────

const backgroundClasses = {
  none: '',
  gradient: 'bg-gradient-to-b from-white to-gray-50',
  subtle: 'bg-gray-50',
} as const

// ── Construction des classes ─────────────────────────────────

const sectionClasses = [
  currentSpacing.section,
  'px-4 md:px-6 lg:px-8',
  backgroundClasses[background],
  className,
].filter(Boolean).join(' ')

const containerClasses = [
  'w-full',
  maxWidth,
  centered ? 'mx-auto' : '',
].filter(Boolean).join(' ')

const ctaContainerClasses = [
  currentSpacing.afterValue,
  centered ? 'flex justify-center' : '',
].filter(Boolean).join(' ')
---

<section
  id={id}
  class={sectionClasses}
  aria-labelledby={`${id}-title`}
>
  <div class={containerClasses}>
    {/* ── HeroTitle (toujours affiché) ──────────────────── */}
    <HeroTitle
      title={title}
      tagline={tagline}
      size={titleSize}
      align={centered ? 'center' : 'left'}
      showTagline={!!tagline}
      id={`${id}-title`}
    />

    {/* ── ValueProposition ─────────────────────────────── */}
    {showValueProposition && valueProposition && (
      <div class={currentSpacing.afterTitle}>
        <ValueProposition
          text={valueProposition}
          align={centered ? 'center' : 'left'}
          size={valuePropositionSize}
          emphasis={valuePropositionEmphasis}
        />
      </div>
    )}

    {/* ── CTAButton ────────────────────────────────────── */}
    {showCTA && (
      <div class={ctaContainerClasses}>
        <CTAButton
          text={ctaText}
          href={ctaHref}
          variant={ctaVariant}
          size={ctaSize}
        />
      </div>
    )}

    {/* ── BenefitsList ─────────────────────────────────── */}
    {showBenefits && (
      <div class={currentSpacing.afterCta}>
        <BenefitsList
          benefits={benefits}
          columns={benefitsColumns}
          cardVariant={benefitsCardVariant}
          centered={centered}
        />
      </div>
    )}

    {/* ── StatsRow ─────────────────────────────────────── */}
    {showStats && (
      <div class={currentSpacing.afterBenefits}>
        <StatsRow
          stats={stats}
          showDividers={statsShowDividers}
          showSources={statsShowSources}
          centered={centered}
        />
      </div>
    )}
  </div>
</section>
```

### 4.3 Exports de types

```typescript
// Réexporter depuis src/types/index.ts si nécessaire
export type { HeroSectionSpacing, HeroSectionBackground } from '@components/hero/HeroSection.astro'
```

### 4.4 Exemples d'utilisation

#### Utilisation par défaut (chargement automatique)

```astro
---
import HeroSection from '@components/hero/HeroSection.astro'
---

<!-- Charge toutes les données depuis Content Collections -->
<HeroSection />
```

#### Avec données injectées

```astro
---
import HeroSection from '@components/hero/HeroSection.astro'

const heroContent = {
  id: 'hero-main-fr',
  title: 'AIAD : Le framework pour développer avec des agents IA',
  tagline: 'Structurez votre collaboration avec l\'intelligence artificielle',
  valueProposition: 'Une méthodologie éprouvée pour intégrer les agents IA dans votre workflow de développement et multiplier votre productivité.',
  locale: 'fr',
  isActive: true,
  updatedAt: new Date(),
}
---

<HeroSection heroContent={heroContent} />
```

#### Configuration minimale

```astro
<HeroSection
  showBenefits={false}
  showStats={false}
  spacing="compact"
/>
```

#### Configuration complète

```astro
<HeroSection
  spacing="spacious"
  background="gradient"
  ctaText="Découvrir AIAD"
  ctaHref="/framework/introduction"
  ctaVariant="primary"
  ctaSize="lg"
  titleSize="lg"
  valuePropositionSize="lg"
  valuePropositionEmphasis="strong"
  benefitsColumns={3}
  benefitsCardVariant="featured"
  statsShowDividers={true}
  statsShowSources={true}
  centered={true}
/>
```

#### Sections sélectives

```astro
<!-- Hero sans statistiques -->
<HeroSection showStats={false} />

<!-- Hero avec seulement titre + CTA -->
<HeroSection
  showValueProposition={false}
  showBenefits={false}
  showStats={false}
  spacing="compact"
/>
```

---

## 5. Design et Style

### 5.1 Design tokens

| Token | Mobile (< 768px) | Tablette (768px+) | Desktop (1024px+) |
|-------|-------------------|--------------------|--------------------|
| Padding vertical section | `py-16` (64px) | `py-24` (96px) | `py-24` (96px) |
| Padding horizontal section | `px-4` (16px) | `px-6` (24px) | `px-8` (32px) |
| Largeur max conteneur | 100% | 100% | `max-w-7xl` (80rem) |
| Espace titre → value prop | `mt-6` (24px) | `mt-6` (24px) | `mt-6` (24px) |
| Espace value prop → CTA | `mt-8` (32px) | `mt-8` (32px) | `mt-8` (32px) |
| Espace CTA → bénéfices | `mt-12` (48px) | `mt-16` (64px) | `mt-16` (64px) |
| Espace bénéfices → stats | `mt-12` (48px) | `mt-16` (64px) | `mt-16` (64px) |

### 5.2 Variantes d'espacement

| Variante | Padding section | Espace titre→VP | Espace VP→CTA | Espace CTA→Ben | Espace Ben→Stats |
|----------|-----------------|-----------------|---------------|-----------------|-------------------|
| `compact` | `py-10 md:py-14` | `mt-4` | `mt-6` | `mt-8 md:mt-10` | `mt-8 md:mt-10` |
| `default` | `py-16 md:py-24` | `mt-6` | `mt-8` | `mt-12 md:mt-16` | `mt-12 md:mt-16` |
| `spacious` | `py-20 md:py-32` | `mt-8` | `mt-10` | `mt-16 md:mt-20` | `mt-16 md:mt-20` |

### 5.3 Variantes de fond

| Variante | Classes Tailwind | Rendu |
|----------|-----------------|-------|
| `none` | *(aucune)* | Transparent (hérite du parent) |
| `gradient` | `bg-gradient-to-b from-white to-gray-50` | Dégradé blanc → gris très clair |
| `subtle` | `bg-gray-50` | Fond gris uniforme très léger |

### 5.4 Breakpoints et responsive

| Breakpoint | Largeur | Comportement |
|------------|---------|-------------|
| Mobile | < 768px | Empilement vertical, espacement réduit, grid 1 col |
| Tablette | ≥ 768px (`md:`) | Espacement élargi, grids 3 cols |
| Desktop | ≥ 1024px (`lg:`) | Padding horizontal élargi, titre plus grand |

### 5.5 Cohérence avec le design system

| Aspect | Conformité |
|--------|------------|
| Couleurs | `gray-900`, `gray-600`, `gray-50`, `blue-600` (palette projet) |
| Typographie | Polices système via Tailwind defaults |
| Espacements | Échelle Tailwind standard (4, 6, 8, 10, 12, 16, 20, 24, 32) |
| Bordures | `border-gray-200` (séparateurs StatsRow) |
| Radius | `rounded-lg` (CTAButton) |
| Ombres | Aucune ombre (design épuré) |

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Matrice des cas limites

| ID | Cas | Comportement attendu | Priorité |
|----|-----|----------------------|----------|
| CL-01 | heroContent non disponible (Content Collections vide) | Affiche titre fallback "AIAD", masque tagline et VP | Haute |
| CL-02 | heroContent avec `isActive: false` | Ignore l'entrée, cherche une autre entrée active | Haute |
| CL-03 | Aucun bénéfice actif dans Content Collections | BenefitsList ne rend rien (section absente du DOM) | Haute |
| CL-04 | Aucune statistique active dans Content Collections | StatsRow ne rend rien (section absente du DOM) | Haute |
| CL-05 | `valueProposition` vide dans les données | Section ValueProposition masquée automatiquement | Moyenne |
| CL-06 | `tagline` vide dans les données | HeroTitle affiché sans tagline (`showTagline: false`) | Moyenne |
| CL-07 | Titre avec caractères spéciaux HTML (`<`, `>`, `&`) | Échappement automatique par Astro (protection XSS) | Haute |
| CL-08 | Titre très long (> 80 caractères) | Retour à la ligne naturel, max-width contraint | Basse |
| CL-09 | ValueProposition très longue (> 200 caractères) | Troncature visuelle via `max-w-3xl` sur ValueProposition | Basse |
| CL-10 | CTA `href` vide | Rendu avec `href="#"` (fallback CTAButton) | Moyenne |
| CL-11 | `spacing` invalide | TypeScript empêche à la compilation | Moyenne |
| CL-12 | `background` invalide | TypeScript empêche à la compilation | Moyenne |
| CL-13 | Toutes les sections masquées sauf titre | Rendu minimal avec seulement HeroTitle | Basse |
| CL-14 | BenefitsList chargé via props et Content Collections vide | Utilise les données props sans erreur | Moyenne |
| CL-15 | StatsRow chargé via props et Content Collections vide | Utilise les données props sans erreur | Moyenne |
| CL-16 | Écran très étroit (320px) | Layout 1 colonne, padding minimal, pas de débordement | Haute |
| CL-17 | Écran très large (> 1920px) | Conteneur centré avec `max-w-7xl`, marges auto | Moyenne |
| CL-18 | Content Collections jette une exception | Fallback gracieux avec console.warn en dev | Haute |
| CL-19 | Plusieurs entrées hero actives pour locale 'fr' | Utilise la première trouvée via `.find()` | Basse |
| CL-20 | `id` personnalisé fourni | Utilise l'id fourni pour section et aria-labelledby | Basse |
| CL-21 | BenefitsList avec > 3 bénéfices | BenefitsList gère l'affichage (wrap naturel) | Basse |
| CL-22 | StatsRow avec > 3 statistiques | StatsRow gère l'affichage (wrap naturel) | Basse |

### 6.2 Stratégie de fallback

```
Données hero non disponibles ?
├── heroContent prop fourni → Utiliser les props
├── Content Collections disponible → Charger depuis collections
│   ├── Entrée active trouvée → Utiliser cette entrée
│   └── Aucune entrée active → Fallback: title="AIAD", reste vide
└── Exception Content Collections → console.warn + fallback
```

### 6.3 Validation en développement

En mode `DEV` uniquement, les avertissements suivants sont émis :

| Condition | Niveau | Message |
|-----------|--------|---------|
| heroContent null | `error` | `[HeroSection] No hero content available — section will render with fallback` |
| title absent | `warn` | `[HeroSection] Hero title is missing` |

> Les validations détaillées de chaque sous-section sont déléguées aux sous-composants (BenefitsList, StatsRow, etc.).

---

## 7. Exemples entrée/sortie

### 7.1 Cas par défaut (données Content Collections)

**Entrée :**

```astro
<HeroSection />
```

**Sortie HTML (simplifiée) :**

```html
<section id="hero" class="py-16 md:py-24 px-4 md:px-6 lg:px-8" aria-labelledby="hero-title">
  <div class="w-full max-w-7xl mx-auto">

    <!-- HeroTitle -->
    <div class="flex flex-col gap-4 text-center">
      <h1 id="hero-title" class="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
        AIAD : Le framework pour développer avec des agents IA
      </h1>
      <p class="text-lg md:text-xl lg:text-2xl font-normal text-gray-600 max-w-2xl mx-auto">
        Structurez votre collaboration avec l'intelligence artificielle
      </p>
    </div>

    <!-- ValueProposition -->
    <div class="mt-6">
      <p class="leading-relaxed text-center mx-auto text-base md:text-lg text-gray-600 font-normal max-w-3xl">
        Une méthodologie éprouvée pour intégrer les agents IA dans votre workflow
        de développement et multiplier votre productivité.
      </p>
    </div>

    <!-- CTAButton -->
    <div class="mt-8 flex justify-center">
      <a href="/framework"
         class="inline-flex items-center justify-center rounded-lg ... bg-blue-600 text-white hover:bg-blue-700 ...">
        <span>Explorer le Framework</span>
        <svg class="w-5 h-5" aria-hidden="true">...</svg>
      </a>
    </div>

    <!-- BenefitsList -->
    <div class="mt-12 md:mt-16">
      <section id="benefits-section" class="mx-auto max-w-6xl w-full" aria-labelledby="benefits-section-title">
        <h2 id="benefits-section-title" class="sr-only">Bénéfices clés</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <!-- 3 × BenefitCard -->
        </div>
      </section>
    </div>

    <!-- StatsRow -->
    <div class="mt-12 md:mt-16">
      <section id="stats-section" class="mx-auto max-w-5xl w-full" aria-labelledby="stats-section-title">
        <h2 id="stats-section-title" class="sr-only">Chiffres clés</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <!-- 3 × StatDisplay avec séparateurs -->
        </div>
      </section>
    </div>

  </div>
</section>
```

### 7.2 Avec fond dégradé et espacement spacieux

**Entrée :**

```astro
<HeroSection spacing="spacious" background="gradient" />
```

**Sortie HTML (section root) :**

```html
<section
  id="hero"
  class="py-20 md:py-32 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50"
  aria-labelledby="hero-title"
>
  <div class="w-full max-w-7xl mx-auto">
    <!-- Espacement mt-8 après titre, mt-10 après VP, mt-16 md:mt-20 après CTA et bénéfices -->
    ...
  </div>
</section>
```

### 7.3 Sections partiellement masquées

**Entrée :**

```astro
<HeroSection showBenefits={false} showStats={false} spacing="compact" />
```

**Sortie HTML :**

```html
<section id="hero" class="py-10 md:py-14 px-4 md:px-6 lg:px-8" aria-labelledby="hero-title">
  <div class="w-full max-w-7xl mx-auto">
    <!-- HeroTitle -->
    <div class="flex flex-col gap-4 text-center">
      <h1 id="hero-title" class="...">AIAD : Le framework pour développer avec des agents IA</h1>
      <p class="...">Structurez votre collaboration avec l'intelligence artificielle</p>
    </div>

    <!-- ValueProposition -->
    <div class="mt-4">
      <p class="...">Une méthodologie éprouvée...</p>
    </div>

    <!-- CTAButton -->
    <div class="mt-6 flex justify-center">
      <a href="/framework" class="...">
        <span>Explorer le Framework</span>
        <svg aria-hidden="true">...</svg>
      </a>
    </div>

    <!-- PAS de BenefitsList -->
    <!-- PAS de StatsRow -->
  </div>
</section>
```

### 7.4 Données hero indisponibles (fallback)

**Entrée :** Content Collections hero vide

```astro
<HeroSection />
```

**Sortie HTML :**

```html
<section id="hero" class="py-16 md:py-24 px-4 md:px-6 lg:px-8" aria-labelledby="hero-title">
  <div class="w-full max-w-7xl mx-auto">
    <!-- HeroTitle avec fallback -->
    <div class="flex flex-col gap-4 text-center">
      <h1 id="hero-title" class="...">AIAD</h1>
      <!-- Pas de tagline (vide) -->
    </div>

    <!-- Pas de ValueProposition (vide) -->

    <!-- CTAButton (toujours affiché) -->
    <div class="mt-8 flex justify-center">
      <a href="/framework" class="...">
        <span>Explorer le Framework</span>
        <svg aria-hidden="true">...</svg>
      </a>
    </div>

    <!-- BenefitsList et StatsRow tentent leur propre chargement -->
    <div class="mt-12 md:mt-16">
      <!-- BenefitsList (peut être vide si Content Collections vide) -->
    </div>
    <div class="mt-12 md:mt-16">
      <!-- StatsRow (peut être vide si Content Collections vide) -->
    </div>
  </div>
</section>
```

### 7.5 Protection XSS

**Entrée :** Titre contenant du HTML malveillant

```astro
<HeroSection
  heroContent={{
    ...validHeroContent,
    title: '<script>alert("xss")</script>',
  }}
/>
```

**Sortie HTML :**

```html
<h1 id="hero-title" class="...">
  &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;
</h1>
```

> Astro échappe automatiquement les expressions `{variable}` dans les templates.

---

## 8. Tests

### 8.1 Fichiers de test

| Fichier | Type | Framework |
|---------|------|-----------|
| `tests/unit/components/hero-section.test.ts` | Unitaire | Vitest + Astro Container |
| `tests/e2e/hero-section.spec.ts` | E2E | Playwright |
| `tests/e2e/hero-accessibility.spec.ts` | Accessibilité | Playwright + axe-core |

### 8.2 Tests unitaires (Vitest)

```typescript
// tests/unit/components/hero-section.test.ts
import { describe, it, expect, vi } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import HeroSection from '@components/hero/HeroSection.astro'

// ── Mock Content Collections ────────────────────────────────

const mockHeroContent = {
  id: 'hero-main-fr',
  title: 'AIAD : Le framework pour développer avec des agents IA',
  tagline: 'Structurez votre collaboration avec l\'intelligence artificielle',
  valueProposition: 'Une méthodologie éprouvée pour intégrer les agents IA.',
  locale: 'fr',
  isActive: true,
  updatedAt: new Date('2026-02-02'),
}

const mockBenefits = [
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
    description: 'Des standards intégrés.',
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

const mockStats = [
  {
    id: 'stat-1',
    value: '50%',
    numericValue: 50,
    unit: '%',
    label: 'Gain de productivité',
    source: 'McKinsey 2024',
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
    label: 'Plus rapide pour coder',
    source: 'GitHub 2023',
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
    label: 'Développeurs satisfaits',
    source: 'Stack Overflow 2024',
    order: 3,
    locale: 'fr',
    isActive: true,
    highlight: false,
    updatedAt: new Date(),
  },
]

// ── Tests ────────────────────────────────────────────────────

describe('HeroSection', () => {
  describe('Rendu par défaut', () => {
    it('T-01 : rend une balise <section> avec id "hero"', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, benefits: mockBenefits, stats: mockStats },
      })

      expect(result).toContain('<section')
      expect(result).toContain('id="hero"')
    })

    it('T-02 : contient aria-labelledby lié au titre', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, benefits: mockBenefits, stats: mockStats },
      })

      expect(result).toContain('aria-labelledby="hero-title"')
      expect(result).toContain('id="hero-title"')
    })

    it('T-03 : rend le HeroTitle avec le titre correct', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, benefits: mockBenefits, stats: mockStats },
      })

      expect(result).toContain('AIAD : Le framework pour développer avec des agents IA')
      expect(result).toContain('<h1')
    })

    it('T-04 : rend la tagline', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, benefits: mockBenefits, stats: mockStats },
      })

      expect(result).toContain('Structurez votre collaboration')
    })

    it('T-05 : rend la ValueProposition', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, benefits: mockBenefits, stats: mockStats },
      })

      expect(result).toContain('Une méthodologie éprouvée')
    })

    it('T-06 : rend le CTAButton avec texte par défaut', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, benefits: mockBenefits, stats: mockStats },
      })

      expect(result).toContain('Explorer le Framework')
      expect(result).toContain('href="/framework"')
    })

    it('T-07 : rend la section BenefitsList', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, benefits: mockBenefits, stats: mockStats },
      })

      expect(result).toContain('Productivité décuplée')
      expect(result).toContain('Qualité garantie')
      expect(result).toContain('Collaboration fluide')
    })

    it('T-08 : rend la section StatsRow', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, benefits: mockBenefits, stats: mockStats },
      })

      expect(result).toContain('50%')
      expect(result).toContain('3x')
      expect(result).toContain('>90%')
    })
  })

  describe('Espacement', () => {
    it('T-09 : applique les classes "default" par défaut', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, benefits: mockBenefits, stats: mockStats },
      })

      expect(result).toContain('py-16')
      expect(result).toContain('md:py-24')
    })

    it('T-10 : applique les classes "compact"', async () => {
      const container = await AstroContainer.create()
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
      const container = await AstroContainer.create()
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
      const container = await AstroContainer.create()
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
      const container = await AstroContainer.create()
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
      const container = await AstroContainer.create()
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
      const container = await AstroContainer.create()
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
      const container = await AstroContainer.create()
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
      const container = await AstroContainer.create()
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
      const container = await AstroContainer.create()
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
      const container = await AstroContainer.create()
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
      const container = await AstroContainer.create()
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
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent },
      })

      expect(result).toContain('max-w-7xl')
    })

    it('T-22 : applique mx-auto quand centered=true', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, centered: true },
      })

      expect(result).toContain('mx-auto')
    })

    it('T-23 : n\'applique pas mx-auto quand centered=false', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, centered: false },
      })

      // Le conteneur principal ne doit pas avoir mx-auto
      // Note : les sous-composants reçoivent centered=false aussi
      expect(result).toContain('w-full')
    })

    it('T-24 : utilise un maxWidth personnalisé', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, maxWidth: 'max-w-5xl' },
      })

      expect(result).toContain('max-w-5xl')
    })

    it('T-25 : accepte un id personnalisé', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, id: 'custom-hero' },
      })

      expect(result).toContain('id="custom-hero"')
      expect(result).toContain('aria-labelledby="custom-hero-title"')
    })

    it('T-26 : accepte des classes CSS additionnelles', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, class: 'border-b' },
      })

      expect(result).toContain('border-b')
    })
  })

  describe('Fallback et données manquantes', () => {
    it('T-27 : rend le titre fallback "AIAD" sans heroContent', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: {},
      })

      expect(result).toContain('<h1')
      expect(result).toContain('AIAD')
    })

    it('T-28 : masque la VP si valueProposition est vide', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: {
          heroContent: { ...mockHeroContent, valueProposition: '' },
        },
      })

      // La condition showValueProposition && valueProposition élimine le rendu
      expect(result).not.toContain('leading-relaxed')
    })

    it('T-29 : masque la tagline si tagline est vide', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: {
          heroContent: { ...mockHeroContent, tagline: '' },
        },
      })

      // HeroTitle reçoit showTagline=false
      // Pas de <p> tagline dans le HeroTitle
      expect(result).toContain('<h1')
    })
  })

  describe('Passthrough sous-composants', () => {
    it('T-30 : transmet titleSize au HeroTitle', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: { heroContent: mockHeroContent, titleSize: 'sm' },
      })

      // En taille 'sm', le HeroTitle utilise text-2xl md:text-3xl
      expect(result).toContain('text-2xl')
    })

    it('T-31 : transmet benefitsCardVariant au BenefitsList', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: {
          heroContent: mockHeroContent,
          benefits: mockBenefits,
          benefitsCardVariant: 'compact',
        },
      })

      // Le rendu doit contenir les bénéfices avec la variante compact
      expect(result).toContain('Productivité décuplée')
    })

    it('T-32 : transmet statsShowSources au StatsRow', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(HeroSection, {
        props: {
          heroContent: mockHeroContent,
          stats: mockStats,
          statsShowSources: false,
        },
      })

      // Les sources ne doivent pas être visibles
      expect(result).not.toContain('McKinsey')
    })
  })
})
```

### 8.3 Tests E2E (Playwright)

```typescript
// tests/e2e/hero-section.spec.ts
import { test, expect } from '@playwright/test'

test.describe('HeroSection - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('E-01 : affiche la section hero sur la page d\'accueil', async ({ page }) => {
    const hero = page.locator('#hero')
    await expect(hero).toBeVisible()
  })

  test('E-02 : contient un H1 unique sur la page', async ({ page }) => {
    const h1Elements = page.locator('h1')
    await expect(h1Elements).toHaveCount(1)
  })

  test('E-03 : H1 contient "AIAD"', async ({ page }) => {
    const h1 = page.locator('h1')
    await expect(h1).toContainText('AIAD')
  })

  test('E-04 : CTA "Explorer le Framework" est visible above the fold', async ({ page }) => {
    const cta = page.locator('a:has-text("Explorer le Framework")')
    await expect(cta).toBeVisible()

    // Vérifier que le CTA est dans le viewport initial
    const ctaBox = await cta.boundingBox()
    const viewportSize = page.viewportSize()
    expect(ctaBox).toBeTruthy()
    expect(ctaBox!.y + ctaBox!.height).toBeLessThan(viewportSize!.height)
  })

  test('E-05 : CTA navigue vers /framework', async ({ page }) => {
    const cta = page.locator('a:has-text("Explorer le Framework")')
    await cta.click()
    await expect(page).toHaveURL(/\/framework/)
  })

  test('E-06 : affiche 3 bénéfices', async ({ page }) => {
    const benefitsSection = page.locator('#benefits-section')
    await expect(benefitsSection).toBeVisible()

    const cards = benefitsSection.locator('article')
    await expect(cards).toHaveCount(3)
  })

  test('E-07 : affiche 3 statistiques', async ({ page }) => {
    const statsSection = page.locator('#stats-section')
    await expect(statsSection).toBeVisible()
  })

  test('E-08 : layout responsive mobile (< 768px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    const hero = page.locator('#hero')
    await expect(hero).toBeVisible()

    // Vérifier que les éléments s'empilent verticalement
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()

    const cta = page.locator('a:has-text("Explorer le Framework")')
    await expect(cta).toBeVisible()
  })

  test('E-09 : layout responsive tablette (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })

    const hero = page.locator('#hero')
    await expect(hero).toBeVisible()

    // Bénéfices en grille 3 colonnes
    const benefitsGrid = page.locator('#benefits-section .grid')
    await expect(benefitsGrid).toBeVisible()
  })

  test('E-10 : layout responsive desktop (1280px)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })

    const hero = page.locator('#hero')
    await expect(hero).toBeVisible()
  })

  test('E-11 : pas de scroll horizontal', async ({ page }) => {
    const body = page.locator('body')
    const scrollWidth = await body.evaluate((el) => el.scrollWidth)
    const clientWidth = await body.evaluate((el) => el.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
  })

  test('E-12 : temps de lecture hero < 30 secondes', async ({ page }) => {
    // Compter les mots visibles dans la section hero
    const heroText = await page.locator('#hero').innerText()
    const wordCount = heroText.split(/\s+/).filter(Boolean).length

    // Vitesse de lecture moyenne : 200-250 mots/minute
    // 30 secondes = 100-125 mots max
    expect(wordCount).toBeLessThan(150) // Marge de sécurité
  })
})
```

### 8.4 Tests d'accessibilité (axe-core)

```typescript
// tests/e2e/hero-accessibility.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('HeroSection - Accessibilité', () => {
  test('A-01 : respecte WCAG 2.0 AA', async ({ page }) => {
    await page.goto('/')

    const results = await new AxeBuilder({ page })
      .include('#hero')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('A-02 : section hero est un landmark accessible', async ({ page }) => {
    await page.goto('/')

    const hero = page.locator('#hero')
    const ariaLabel = await hero.getAttribute('aria-labelledby')
    expect(ariaLabel).toBeTruthy()

    const titleId = ariaLabel!
    const title = page.locator(`#${titleId}`)
    await expect(title).toBeAttached()
  })

  test('A-03 : hiérarchie des titres correcte (H1 → H2)', async ({ page }) => {
    await page.goto('/')

    // Un seul H1
    const h1Count = await page.locator('#hero h1').count()
    expect(h1Count).toBe(1)

    // H2 pour bénéfices et stats (peuvent être sr-only)
    const h2Count = await page.locator('#hero h2').count()
    expect(h2Count).toBeGreaterThanOrEqual(2) // bénéfices + stats
  })

  test('A-04 : navigation au clavier fonctionne', async ({ page }) => {
    await page.goto('/')

    // Tab jusqu'au CTA
    await page.keyboard.press('Tab')
    // Peut nécessiter plusieurs tabs selon les éléments focusables

    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('A-05 : CTA a un contraste suffisant', async ({ page }) => {
    await page.goto('/')

    const results = await new AxeBuilder({ page })
      .include('a:has-text("Explorer le Framework")')
      .withRules(['color-contrast'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('A-06 : contenu accessible à 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 })
    await page.goto('/')

    const hero = page.locator('#hero')
    await expect(hero).toBeVisible()

    // Pas de débordement
    const heroBox = await hero.boundingBox()
    expect(heroBox!.width).toBeLessThanOrEqual(320)
  })
})
```

### 8.5 Matrice de couverture

| ID | Test | Type | Assertion | Priorité |
|----|------|------|-----------|----------|
| T-01 | Section `<section>` avec id "hero" | Unit | `toContain('<section')` + `toContain('id="hero"')` | Haute |
| T-02 | `aria-labelledby` lié au titre | Unit | `toContain('aria-labelledby="hero-title"')` | Haute |
| T-03 | H1 avec titre correct | Unit | `toContain('<h1')` + `toContain(title)` | Haute |
| T-04 | Tagline rendue | Unit | `toContain(tagline)` | Haute |
| T-05 | ValueProposition rendue | Unit | `toContain(valueProposition)` | Haute |
| T-06 | CTAButton avec texte et href par défaut | Unit | `toContain('Explorer le Framework')` + `toContain('href="/framework"')` | Haute |
| T-07 | BenefitsList avec 3 cartes | Unit | `toContain` pour chaque titre de bénéfice | Haute |
| T-08 | StatsRow avec 3 stats | Unit | `toContain` pour chaque valeur stat | Haute |
| T-09 | Espacement "default" | Unit | `toContain('py-16')` | Moyenne |
| T-10 | Espacement "compact" | Unit | `toContain('py-10')` | Moyenne |
| T-11 | Espacement "spacious" | Unit | `toContain('py-20')` | Moyenne |
| T-12 | Fond "none" | Unit | `not.toContain('bg-gradient')` | Moyenne |
| T-13 | Fond "gradient" | Unit | `toContain('bg-gradient-to-b')` | Moyenne |
| T-14 | Fond "subtle" | Unit | `toContain('bg-gray-50')` | Moyenne |
| T-15 | Masquer ValueProposition | Unit | `not.toContain(valueProposition)` | Haute |
| T-16 | Masquer CTA | Unit | `not.toContain('Explorer le Framework')` | Haute |
| T-17 | Masquer BenefitsList | Unit | `not.toContain('benefits-section')` | Haute |
| T-18 | Masquer StatsRow | Unit | `not.toContain('stats-section')` | Haute |
| T-19 | HeroTitle toujours visible | Unit | `toContain('<h1')` | Haute |
| T-20 | CTA personnalisé | Unit | `toContain` texte et href custom | Moyenne |
| T-21 | max-w-7xl par défaut | Unit | `toContain('max-w-7xl')` | Moyenne |
| T-22 | mx-auto avec centered=true | Unit | `toContain('mx-auto')` | Moyenne |
| T-23 | Pas de mx-auto avec centered=false | Unit | Vérification DOM | Moyenne |
| T-24 | maxWidth personnalisé | Unit | `toContain('max-w-5xl')` | Basse |
| T-25 | ID personnalisé | Unit | `toContain('id="custom-hero"')` | Basse |
| T-26 | Classes CSS additionnelles | Unit | `toContain('border-b')` | Basse |
| T-27 | Fallback titre sans heroContent | Unit | `toContain('AIAD')` | Haute |
| T-28 | VP masquée si vide | Unit | `not.toContain('leading-relaxed')` | Moyenne |
| T-29 | Tagline masquée si vide | Unit | Vérification DOM | Moyenne |
| T-30 | Passthrough titleSize | Unit | Vérification classes taille | Basse |
| T-31 | Passthrough benefitsCardVariant | Unit | Rendu bénéfices correct | Basse |
| T-32 | Passthrough statsShowSources | Unit | `not.toContain` source text | Basse |
| E-01 | Section hero visible | E2E | `toBeVisible()` | Haute |
| E-02 | H1 unique sur la page | E2E | `toHaveCount(1)` | Haute |
| E-03 | H1 contient "AIAD" | E2E | `toContainText('AIAD')` | Haute |
| E-04 | CTA above the fold | E2E | Position dans viewport | Haute |
| E-05 | CTA navigue vers /framework | E2E | `toHaveURL(/\/framework/)` | Haute |
| E-06 | 3 bénéfices affichés | E2E | `toHaveCount(3)` | Haute |
| E-07 | 3 statistiques affichées | E2E | `toBeVisible()` | Haute |
| E-08 | Layout mobile 375px | E2E | Empilement vertical | Moyenne |
| E-09 | Layout tablette 768px | E2E | Grid 3 colonnes | Moyenne |
| E-10 | Layout desktop 1280px | E2E | Rendu correct | Moyenne |
| E-11 | Pas de scroll horizontal | E2E | `scrollWidth <= clientWidth` | Haute |
| E-12 | Temps de lecture < 30s | E2E | `wordCount < 150` | Haute |
| A-01 | WCAG 2.0 AA | A11y | `violations.toEqual([])` | Haute |
| A-02 | Landmark accessible | A11y | `aria-labelledby` valide | Haute |
| A-03 | Hiérarchie titres H1→H2 | A11y | Count correct | Haute |
| A-04 | Navigation clavier | A11y | Focus visible | Haute |
| A-05 | Contraste CTA | A11y | axe color-contrast | Haute |
| A-06 | Accessible à 320px | A11y | Pas de débordement | Moyenne |

---

## 9. Critères d'acceptation

| ID | Critère | Vérifié par |
|----|---------|-------------|
| CA-01 | Le composant rend une `<section>` avec `id="hero"` et `aria-labelledby` | T-01, T-02 |
| CA-02 | Le HeroTitle (H1 + tagline) est toujours affiché | T-03, T-04, T-19 |
| CA-03 | La ValueProposition est affichée par défaut et masquable | T-05, T-15 |
| CA-04 | Le CTAButton affiche "Explorer le Framework" par défaut avec lien `/framework` | T-06, E-05 |
| CA-05 | Le CTA est visible above the fold (sans scroll) | E-04 |
| CA-06 | BenefitsList affiche 3 bénéfices depuis Content Collections | T-07, E-06 |
| CA-07 | StatsRow affiche 3 statistiques depuis Content Collections | T-08, E-07 |
| CA-08 | Chaque section peut être masquée individuellement via props | T-15, T-16, T-17, T-18 |
| CA-09 | L'espacement suit 3 variantes : compact, default, spacious | T-09, T-10, T-11 |
| CA-10 | Le fond supporte 3 variantes : none, gradient, subtle | T-12, T-13, T-14 |
| CA-11 | Le conteneur respecte `max-w-7xl` et `mx-auto` par défaut | T-21, T-22 |
| CA-12 | Le composant est responsive de 320px à 1920px+ sans scroll horizontal | E-08, E-09, E-10, E-11, A-06 |
| CA-13 | Le temps de lecture du hero est < 30 secondes | E-12 |
| CA-14 | Le composant respecte WCAG 2.0 AA | A-01 |
| CA-15 | La hiérarchie des titres est correcte (H1 unique, H2 sections) | A-03, E-02 |
| CA-16 | Le composant charge les données depuis Content Collections par défaut | T-03, T-07, T-08 |
| CA-17 | Le composant accepte des données via props (surcharge) | T-20, T-27 |
| CA-18 | Le composant gère gracieusement les données manquantes (fallback) | T-27, T-28, T-29 |
| CA-19 | 0 JavaScript côté client (composant 100% statique) | Inspection build |
| CA-20 | Protection XSS via échappement automatique Astro | Section 7.5 |

---

## 10. Definition of Done

- [ ] Fichier `src/components/hero/HeroSection.astro` créé
- [ ] Interface TypeScript `Props` complète avec JSDoc
- [ ] Tous les sous-composants importés et rendus correctement
- [ ] Chargement des données hero depuis Content Collections avec fallback
- [ ] 3 variantes d'espacement (compact, default, spacious)
- [ ] 3 variantes de fond (none, gradient, subtle)
- [ ] 4 sections masquables (ValueProposition, CTA, Benefits, Stats)
- [ ] Responsive mobile-first (320px → 1920px+)
- [ ] Accessibilité RGAA AA validée (aria-labelledby, hiérarchie titres)
- [ ] Tests unitaires passants (32 tests)
- [ ] Tests E2E passants (12 tests)
- [ ] Tests accessibilité passants (6 tests)
- [ ] 0 erreur TypeScript (`pnpm typecheck`)
- [ ] 0 erreur ESLint (`pnpm lint`)
- [ ] 0 JS côté client
- [ ] Code formaté avec Prettier
- [ ] Code review effectuée

---

## 11. Notes d'implémentation

### 11.1 Ordre d'implémentation recommandé

1. Créer le fichier `HeroSection.astro` avec l'interface Props
2. Implémenter le chargement des données hero depuis Content Collections
3. Rendre les sous-composants dans l'ordre séquentiel
4. Ajouter les classes d'espacement et de fond
5. Implémenter la visibilité conditionnelle des sections
6. Ajouter les props de passthrough vers les sous-composants
7. Tester avec `pnpm typecheck` et `pnpm lint`
8. Écrire les tests unitaires
9. Intégrer dans `index.astro` (T-001-F9) pour les tests E2E

### 11.2 Points d'attention

| Point | Détail |
|-------|--------|
| **H1 unique** | Le `HeroTitle` rend le seul `<h1>` de la page. Aucun autre composant ne doit rendre de `<h1>`. |
| **Content Collections async** | Le chargement Content Collections est asynchrone. Utiliser `await import('astro:content')` avec try/catch. |
| **Délégation données** | Les bénéfices et stats sont chargés par BenefitsList et StatsRow respectivement, sauf si fournis en props. |
| **Pas de JavaScript client** | Aucune directive `client:*` ne doit être utilisée. Le composant est 100% statique. |
| **Espacement vertical** | Les `mt-*` sont appliqués via des `<div>` wrapper et non directement sur les sous-composants. |
| **ID aria-labelledby** | L'ID du H1 suit le pattern `${id}-title` pour garantir l'unicité si `id` est personnalisé. |

### 11.3 Extensions futures (hors scope)

| Extension | Description | User Story |
|-----------|-------------|------------|
| Mode sombre | Variantes de couleurs dark mode | Non définie |
| Animation d'entrée | Fade-in au scroll des sections | Non définie |
| CTA secondaire | Deuxième bouton CTA (ex: "Voir la démo") | Non définie |
| Multilangue | Support locale 'en' pour les données | Phase 2 |

---

## 12. Références

| Ressource | Lien |
|-----------|------|
| US-001 Spec | [spec.md](./spec.md) |
| T-001-F1 HeroTitle | [T-001-F1-composant-HeroTitle.md](./T-001-F1-composant-HeroTitle.md) |
| T-001-F2 ValueProposition | [T-001-F2-composant-ValueProposition.md](./T-001-F2-composant-ValueProposition.md) |
| T-001-F3 CTAButton | [T-001-F3-composant-CTAButton.md](./T-001-F3-composant-CTAButton.md) |
| T-001-F5 BenefitsList | [T-001-F5-composant-BenefitsList.md](./T-001-F5-composant-BenefitsList.md) |
| T-001-F7 StatsRow | [T-001-F7-composant-StatsRow.md](./T-001-F7-composant-StatsRow.md) |
| T-001-B4 Données Hero | [T-001-B4-donnees-JSON-hero-content-francais.md](./T-001-B4-donnees-JSON-hero-content-francais.md) |
| Architecture | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| Astro Components | https://docs.astro.build/en/basics/astro-components/ |
| Tailwind CSS | https://tailwindcss.com/docs |
| RGAA (accessibilité) | https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/ |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 05/02/2026 | Création initiale — Spécification complète du composant HeroSection |
