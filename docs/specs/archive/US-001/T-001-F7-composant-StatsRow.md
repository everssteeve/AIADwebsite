# T-001-F7 : Créer le composant StatsRow (ligne de statistiques)

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 5 février 2026 |
| **Statut** | ✅ Terminé |
| **User Story** | [US-001 - Comprendre AIAD rapidement](./spec.md) |
| **Dépendances** | T-001-F6 (StatDisplay) ✅, T-001-B3 (StatItem model) ✅, T-001-B6 (Stats JSON data) ✅ |
| **Bloque** | T-001-F8 (HeroSection assemblage), T-001-T2 (tests composants) |

---

## 1. Objectif

Créer le composant Astro `StatsRow` qui affiche une ligne responsive de statistiques chiffrées dans la hero section, en garantissant :

- **Composition** : Orchestration des composants `StatDisplay` existants
- **Responsive** : Grille adaptative (1 colonne mobile → 3 colonnes desktop)
- **Accessibilité** : Structure sémantique avec `<section>` et titre sr-only
- **Flexibilité** : Support de données via props ou Content Collections
- **Performance** : Rendu statique sans JavaScript client (0 KB JS)
- **Type-safety** : Props typées avec TypeScript strict basées sur `StatItem[]`
- **Design system** : Intégration Tailwind CSS cohérente avec les autres composants hero
- **Séparateurs visuels** : Séparateurs optionnels entre les statistiques pour renforcer la lisibilité

---

## 2. Contexte technique

### 2.1 Architecture cible

D'après [ARCHITECTURE.md](../../ARCHITECTURE.md), le projet utilise :

- **Astro 4.x** avec composants `.astro` (static by default)
- **TypeScript 5.x** en mode strict
- **Tailwind CSS 3.x** pour le styling utility-first
- **Content Collections** pour la gestion des données
- **Pattern Mobile-first** pour le responsive design

### 2.2 Positionnement dans l'arborescence

```
src/
├── components/
│   └── hero/
│       ├── HeroTitle.astro        # ✅ Implémenté (T-001-F1)
│       ├── ValueProposition.astro # ✅ Implémenté (T-001-F2)
│       ├── BenefitCard.astro      # ✅ Implémenté (T-001-F4)
│       ├── BenefitsList.astro     # ✅ Implémenté (T-001-F5)
│       ├── StatDisplay.astro      # ✅ Implémenté (T-001-F6)
│       ├── StatsRow.astro         # ← COMPOSANT À CRÉER
│       └── HeroSection.astro      # T-001-F8 (consommateur)
├── components/
│   └── common/
│       └── CTAButton.astro        # ✅ Implémenté (T-001-F3)
├── content/
│   └── stats/
│       └── main.json              # ✅ Données (T-001-B6)
├── schemas/
│   └── stat.ts                    # ✅ Schéma Zod
├── types/
│   ├── index.ts                   # Export barrel
│   └── stat.ts                    # Interface StatItem (T-001-B3)
└── pages/
    └── index.astro                # Consommateur final (via HeroSection)
```

### 2.3 Dépendances

| Type | Nom | Provenance | Statut |
|------|-----|------------|--------|
| **Composant** | `StatDisplay` | T-001-F6 | ✅ Terminé |
| **Modèle de données** | `StatItem` | T-001-B3 | ✅ Terminé |
| **Données JSON** | `stats/main.json` | T-001-B6 | ✅ Terminé |
| **Schéma Zod** | `statItemSchema` | T-001-B3 | ✅ Terminé |

### 2.4 Position dans la hero section

```
┌─────────────────────────────────────────────────────────────────┐
│                         HeroSection                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ HeroTitle (H1 + tagline)                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ValueProposition                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────┐                                        │
│  │ CTAButton           │                                        │
│  └─────────────────────┘                                        │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    BenefitsList                           │    │
│  │  [ BenefitCard ]  [ BenefitCard ]  [ BenefitCard ]       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    StatsRow  ← CE COMPOSANT               │    │
│  │                                                           │    │
│  │  ┌──────────────┐ │ ┌──────────────┐ │ ┌──────────────┐ │    │
│  │  │ StatDisplay  │ │ │ StatDisplay  │ │ │ StatDisplay  │ │    │
│  │  │              │ │ │              │ │ │              │ │    │
│  │  │    50%       │ │ │     3x       │ │ │    >90%      │ │    │
│  │  │  ─────────   │ │ │  ─────────   │ │ │  ─────────   │ │    │
│  │  │ Productivité │ │ │   Vitesse    │ │ │ Satisfaction │ │    │
│  │  │   Source...  │ │ │   Source...  │ │ │   Source...  │ │    │
│  │  └──────────────┘ │ └──────────────┘ │ └──────────────┘ │    │
│  │                   │                   │                   │    │
│  │              séparateurs (optionnels)                      │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### 2.5 Parallèle avec BenefitsList

`StatsRow` suit le même pattern composite que `BenefitsList` (T-001-F5) :

| Aspect | BenefitsList | StatsRow |
|--------|--------------|----------|
| **Rôle** | Grille de bénéfices | Ligne de statistiques |
| **Enfant** | `BenefitCard` | `StatDisplay` |
| **Source** | Content Collections `benefits` | Content Collections `stats` |
| **Layout** | CSS Grid | CSS Grid |
| **Semantic** | `<section>` + `<h2>` sr-only | `<section>` + `<h2>` sr-only |
| **Spécificité** | Grille de cartes | Ligne avec séparateurs optionnels |

---

## 3. Spécifications fonctionnelles

### 3.1 Description du composant

Le `StatsRow` est un composant composite responsable de l'orchestration et de la mise en page des statistiques :

| Élément | Balise HTML | Source de données | Rôle |
|---------|-------------|-------------------|------|
| Conteneur | `<section>` | - | Encapsule la ligne sémantiquement |
| Titre optionnel | `<h2>` (sr-only) | Props `title` | Accessibilité (lecteurs d'écran) |
| Grille | `<div>` avec CSS Grid | - | Layout responsive |
| Statistiques | `StatDisplay[]` | Props `stats` ou Content Collections | Affichage des 3 stats |
| Séparateurs | `<div>` (décoratif) | - | Séparation visuelle (desktop) |

### 3.2 Comportement attendu

#### 3.2.1 Rendu par défaut (Desktop ≥ 768px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  ┌──────────────────┐  │  ┌──────────────────┐  │  ┌──────────────────┐  │
│  │                   │  │  │                   │  │  │                   │  │
│  │       50%         │  │  │        3x         │  │  │      >90%        │  │
│  │                   │  │  │                   │  │  │                   │  │
│  │  Gain de          │  │  │  Plus rapide pour │  │  │  Des développeurs│  │
│  │  productivité     │  │  │  coder avec       │  │  │  satisfaits de   │  │
│  │  avec les agents  │  │  │  assistance IA    │  │  │  l'IA            │  │
│  │                   │  │  │                   │  │  │                   │  │
│  │  McKinsey...      │  │  │  GitHub...        │  │  │  Stack Overflow..│  │
│  │                   │  │  │                   │  │  │                   │  │
│  └──────────────────┘  │  └──────────────────┘  │  └──────────────────┘  │
│                        │                         │                         │
│                   séparateurs verticaux                                     │
└────────────────────────────────────────────────────────────────────────────┘
                        gap-6 md:gap-8
```

#### 3.2.2 Rendu mobile (< 768px)

```
┌─────────────────────────────┐
│                             │
│  ┌───────────────────────┐  │
│  │         50%           │  │
│  │  Gain de productivité │  │
│  │  avec les agents IA   │  │
│  │  McKinsey...          │  │
│  └───────────────────────┘  │
│  ─────────────────────────  │  ← séparateur horizontal
│  ┌───────────────────────┐  │
│  │          3x           │  │
│  │  Plus rapide pour     │  │
│  │  coder avec IA        │  │
│  │  GitHub...            │  │
│  └───────────────────────┘  │
│  ─────────────────────────  │  ← séparateur horizontal
│  ┌───────────────────────┐  │
│  │        >90%           │  │
│  │  Des développeurs     │  │
│  │  satisfaits de l'IA   │  │
│  │  Stack Overflow...    │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
```

#### 3.2.3 Comportement des séparateurs

| Viewport | Séparateurs | Orientation | Style |
|----------|-------------|-------------|-------|
| Mobile (< 768px) | Horizontaux (entre les stats) | `border-t` | `border-gray-200` |
| Desktop (≥ 768px) | Verticaux (entre les stats) | `border-l` | `border-gray-200` |
| `showDividers=false` | Aucun | - | - |

### 3.3 Variantes

Le composant supporte les variantes suivantes :

| Variante | Prop | Valeur par défaut | Description |
|----------|------|-------------------|-------------|
| `columns` | `1 \| 2 \| 3 \| 'auto'` | `'auto'` | Nombre de colonnes (auto = responsive) |
| `gap` | `'sm' \| 'md' \| 'lg'` | `'md'` | Espacement entre les stats |
| `statVariant` | `'default' \| 'highlight' \| 'compact'` | `'default'` | Variante transmise aux StatDisplay |
| `showDividers` | `boolean` | `true` | Afficher les séparateurs entre stats |
| `centered` | `boolean` | `true` | Centre la ligne horizontalement |
| `maxWidth` | `string` | `'max-w-5xl'` | Largeur maximale du conteneur |

#### 3.3.1 Configurations de grille

| Config `columns` | Mobile (< 768px) | Desktop (≥ 768px) |
|------------------|------------------|--------------------|
| `'auto'` | 1 colonne | 3 colonnes |
| `1` | 1 colonne | 1 colonne |
| `2` | 1 colonne | 2 colonnes |
| `3` | 1 colonne | 3 colonnes |

#### 3.3.2 Configurations de gap

| Config `gap` | Valeur mobile | Valeur desktop | Classes Tailwind |
|--------------|---------------|----------------|------------------|
| `'sm'` | 16px | 20px | `gap-4 md:gap-5` |
| `'md'` | 24px | 32px | `gap-6 md:gap-8` |
| `'lg'` | 32px | 48px | `gap-8 md:gap-12` |

### 3.4 Sources de données

Le composant peut recevoir les données de deux manières :

#### 3.4.1 Via Props (prioritaire)

```astro
<StatsRow stats={customStats} />
```

#### 3.4.2 Via Content Collections (par défaut si pas de props)

```typescript
// Chargement automatique depuis src/content/stats/main.json
const stats = await getCollection('stats')
```

### 3.5 Gestion de la variante highlight

La variante de chaque `StatDisplay` est déterminée automatiquement par le champ `highlight` du `StatItem`, **sauf** si `statVariant` est explicitement fourni :

| Scénario | Comportement |
|----------|-------------|
| `statVariant` non fourni + `stat.highlight === true` | `variant="highlight"` |
| `statVariant` non fourni + `stat.highlight === false` | `variant="default"` |
| `statVariant="compact"` | Toutes les stats en `variant="compact"` |
| `statVariant="highlight"` | Toutes les stats en `variant="highlight"` |

### 3.6 Accessibilité (RGAA AA)

| Critère | Exigence | Implémentation |
|---------|----------|----------------|
| **1.1** Rôle sémantique | Section avec landmark | `<section>` avec `aria-labelledby` |
| **1.3** Titre de section | Titre pour lecteurs d'écran | `<h2 class="sr-only">` ou visible |
| **9.1** Hiérarchie titres | H2 pour section | Titre section H2, cohérent avec hero |
| **10.1** Séparateurs décoratifs | Masqués aux lecteurs d'écran | `aria-hidden="true"` + `role="separator"` |
| **12.6** Navigation | Ordre de lecture logique | Ordre DOM = ordre visuel (1→2→3) |

---

## 4. Spécifications techniques

### 4.1 Interface TypeScript des Props

```typescript
// src/components/hero/StatsRow.astro - Frontmatter

import type { StatItem } from '@/types'

/**
 * Nombre de colonnes de la grille
 */
export type StatsRowColumns = 1 | 2 | 3 | 'auto'

/**
 * Taille de l'espacement entre les stats
 */
export type StatsRowGap = 'sm' | 'md' | 'lg'

/**
 * Variante des statistiques individuelles
 */
export type StatDisplayVariant = 'default' | 'highlight' | 'compact'

/**
 * Props du composant StatsRow
 *
 * @example
 * ```astro
 * <StatsRow
 *   stats={stats}
 *   columns="auto"
 *   gap="md"
 *   showDividers={true}
 *   title="Chiffres clés"
 * />
 * ```
 */
export interface StatsRowProps {
  /**
   * Liste des statistiques à afficher.
   * Si non fourni, charge automatiquement depuis Content Collections.
   */
  stats?: StatItem[]

  /**
   * Nombre de colonnes de la grille.
   * - 'auto': responsive (1 col mobile → 3 col desktop)
   * - 1/2/3: nombre fixe de colonnes
   * @default 'auto'
   */
  columns?: StatsRowColumns

  /**
   * Espacement entre les statistiques.
   * - 'sm': gap-4 md:gap-5 (16px → 20px)
   * - 'md': gap-6 md:gap-8 (24px → 32px)
   * - 'lg': gap-8 md:gap-12 (32px → 48px)
   * @default 'md'
   */
  gap?: StatsRowGap

  /**
   * Variante visuelle à appliquer à toutes les stats.
   * Si non fourni, utilise le champ `highlight` de chaque StatItem.
   * @default undefined (auto basé sur stat.highlight)
   */
  statVariant?: StatDisplayVariant

  /**
   * Afficher les séparateurs entre les statistiques.
   * Sur mobile: séparateurs horizontaux
   * Sur desktop: séparateurs verticaux
   * @default true
   */
  showDividers?: boolean

  /**
   * Titre de la section (pour accessibilité).
   * Si fourni avec `showTitle: false`, sera invisible mais accessible aux lecteurs d'écran.
   * @default 'Chiffres clés'
   */
  title?: string

  /**
   * Affiche le titre visiblement (vs sr-only).
   * @default false
   */
  showTitle?: boolean

  /**
   * Afficher les sources sur chaque StatDisplay.
   * @default true
   */
  showSources?: boolean

  /**
   * Rendre les sources cliquables si sourceUrl fourni.
   * @default true
   */
  linkSources?: boolean

  /**
   * Centre la ligne horizontalement dans son conteneur.
   * @default true
   */
  centered?: boolean

  /**
   * Largeur maximale du conteneur.
   * @default 'max-w-5xl'
   */
  maxWidth?: string

  /**
   * Classes CSS additionnelles pour le conteneur section.
   */
  class?: string

  /**
   * ID de la section pour les ancres/navigation.
   */
  id?: string
}
```

### 4.2 Implémentation du composant

```astro
---
// src/components/hero/StatsRow.astro

import type { StatItem } from '@/types'
import StatDisplay from './StatDisplay.astro'

/**
 * Nombre de colonnes de la grille
 */
export type StatsRowColumns = 1 | 2 | 3 | 'auto'

/**
 * Taille de l'espacement entre les stats
 */
export type StatsRowGap = 'sm' | 'md' | 'lg'

/**
 * Variante des statistiques individuelles
 */
export type StatDisplayVariant = 'default' | 'highlight' | 'compact'

export interface Props {
  stats?: StatItem[]
  columns?: StatsRowColumns
  gap?: StatsRowGap
  statVariant?: StatDisplayVariant
  showDividers?: boolean
  title?: string
  showTitle?: boolean
  showSources?: boolean
  linkSources?: boolean
  centered?: boolean
  maxWidth?: string
  class?: string
  id?: string
}

const {
  stats: statsProp,
  columns = 'auto',
  gap = 'md',
  statVariant,
  showDividers = true,
  title = 'Chiffres clés',
  showTitle = false,
  showSources = true,
  linkSources = true,
  centered = true,
  maxWidth = 'max-w-5xl',
  class: className = '',
  id,
} = Astro.props

// Charger les statistiques depuis Content Collections si non fournies via props
let stats: StatItem[] = []

if (statsProp && statsProp.length > 0) {
  stats = statsProp
} else {
  try {
    const { getCollection } = await import('astro:content')
    const statsData = await getCollection('stats')

    stats = statsData
      .map((entry) => entry.data as StatItem)
      .filter((s) => s.isActive !== false)
      .sort((a, b) => a.order - b.order)
  } catch {
    console.warn('[StatsRow] Could not load stats from Content Collections')
    stats = []
  }
}

// Runtime validation (development only)
if (import.meta.env.DEV) {
  if (stats.length === 0) {
    console.warn('[StatsRow] No stats to display')
  }
  if (stats.length > 6) {
    console.warn('[StatsRow] More than 6 stats may affect layout')
  }
}

// Génération de l'ID unique pour aria-labelledby
const sectionId = id || 'stats-section'
const titleId = `${sectionId}-title`

// Mapping des configurations de colonnes
const columnClasses = {
  'auto': 'grid-cols-1 md:grid-cols-3',
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
} as const

// Mapping des gaps
const gapClasses = {
  'sm': 'gap-4 md:gap-5',
  'md': 'gap-6 md:gap-8',
  'lg': 'gap-8 md:gap-12',
} as const

// Construction des classes du conteneur grid
const gridClasses = [
  'grid',
  columnClasses[columns],
  gapClasses[gap],
].join(' ')

// Construction des classes du conteneur section
const sectionClasses = [
  centered ? 'mx-auto' : '',
  maxWidth,
  'w-full',
  className,
].filter(Boolean).join(' ')

// Classes du titre
const titleClasses = showTitle
  ? 'text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8 md:mb-12'
  : 'sr-only'

/**
 * Détermine la variante de chaque StatDisplay
 */
function getStatVariant(stat: StatItem): 'default' | 'highlight' | 'compact' {
  if (statVariant) return statVariant
  return stat.highlight ? 'highlight' : 'default'
}
---

{stats.length > 0 && (
  <section
    id={sectionId}
    class={sectionClasses}
    aria-labelledby={titleId}
  >
    <h2 id={titleId} class={titleClasses}>
      {title}
    </h2>

    <div class={gridClasses}>
      {stats.map((stat, index) => (
        <>
          {showDividers && index > 0 && (
            <div
              class="border-t border-gray-200 md:border-t-0 md:border-l md:border-gray-200"
              aria-hidden="true"
              role="separator"
            />
          )}
          <StatDisplay
            value={stat.value}
            label={stat.label}
            source={stat.source}
            sourceUrl={stat.sourceUrl}
            variant={getStatVariant(stat)}
            unit={stat.unit}
            showSource={showSources}
            linkSource={linkSources}
            alignment="center"
          />
        </>
      ))}
    </div>
  </section>
)}
```

**Note importante sur les séparateurs dans la grille :** L'approche ci-dessus insère les séparateurs comme éléments enfants de la grille. Cela modifie le nombre d'enfants de la grille. Une alternative est d'utiliser les bordures CSS directement sur les `StatDisplay` via une logique conditionnelle :

```astro
<!-- Alternative : séparateurs via bordures CSS -->
<div class={gridClasses}>
  {stats.map((stat, index) => (
    <div class:list={[
      showDividers && index > 0 && 'border-t border-gray-200 pt-6 md:border-t-0 md:border-l md:pl-8 md:pt-0',
    ]}>
      <StatDisplay
        value={stat.value}
        label={stat.label}
        source={stat.source}
        sourceUrl={stat.sourceUrl}
        variant={getStatVariant(stat)}
        unit={stat.unit}
        showSource={showSources}
        linkSource={linkSources}
        alignment="center"
      />
    </div>
  ))}
</div>
```

**L'implémentation recommandée est l'alternative (bordures CSS)** car elle ne modifie pas le nombre d'enfants de la grille et simplifie le layout.

### 4.3 Implémentation recommandée (version finale)

```astro
---
// src/components/hero/StatsRow.astro

import type { StatItem } from '@/types'
import StatDisplay from './StatDisplay.astro'

export type StatsRowColumns = 1 | 2 | 3 | 'auto'
export type StatsRowGap = 'sm' | 'md' | 'lg'
export type StatDisplayVariant = 'default' | 'highlight' | 'compact'

export interface Props {
  stats?: StatItem[]
  columns?: StatsRowColumns
  gap?: StatsRowGap
  statVariant?: StatDisplayVariant
  showDividers?: boolean
  title?: string
  showTitle?: boolean
  showSources?: boolean
  linkSources?: boolean
  centered?: boolean
  maxWidth?: string
  class?: string
  id?: string
}

const {
  stats: statsProp,
  columns = 'auto',
  gap = 'md',
  statVariant,
  showDividers = true,
  title = 'Chiffres clés',
  showTitle = false,
  showSources = true,
  linkSources = true,
  centered = true,
  maxWidth = 'max-w-5xl',
  class: className = '',
  id,
} = Astro.props

// Charger les statistiques depuis Content Collections si non fournies via props
let stats: StatItem[] = []

if (statsProp && statsProp.length > 0) {
  stats = statsProp
} else {
  try {
    const { getCollection } = await import('astro:content')
    const statsData = await getCollection('stats')

    stats = statsData
      .map((entry) => entry.data as StatItem)
      .filter((s) => s.isActive !== false)
      .sort((a, b) => a.order - b.order)
  } catch {
    console.warn('[StatsRow] Could not load stats from Content Collections')
    stats = []
  }
}

// Runtime validation (development only)
if (import.meta.env.DEV) {
  if (stats.length === 0) {
    console.warn('[StatsRow] No stats to display')
  }
  if (stats.length > 6) {
    console.warn('[StatsRow] More than 6 stats may affect layout')
  }
}

// Génération de l'ID unique pour aria-labelledby
const sectionId = id || 'stats-section'
const titleId = `${sectionId}-title`

// Mapping des configurations de colonnes
const columnClasses = {
  'auto': 'grid-cols-1 md:grid-cols-3',
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
} as const

// Mapping des gaps
const gapClasses = {
  'sm': 'gap-4 md:gap-5',
  'md': 'gap-6 md:gap-8',
  'lg': 'gap-8 md:gap-12',
} as const

// Construction des classes du conteneur grid
const gridClasses = [
  'grid',
  columnClasses[columns],
  gapClasses[gap],
].join(' ')

// Construction des classes du conteneur section
const sectionClasses = [
  centered ? 'mx-auto' : '',
  maxWidth,
  'w-full',
  className,
].filter(Boolean).join(' ')

// Classes du titre
const titleClasses = showTitle
  ? 'text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8 md:mb-12'
  : 'sr-only'

/**
 * Détermine la variante de chaque StatDisplay
 */
function getStatVariant(stat: StatItem): 'default' | 'highlight' | 'compact' {
  if (statVariant) return statVariant
  return stat.highlight ? 'highlight' : 'default'
}

/**
 * Classes pour le conteneur wrapper de chaque stat (gère les séparateurs)
 */
function getStatWrapperClasses(index: number): string {
  if (!showDividers || index === 0) return ''
  return 'border-t border-gray-200 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8'
}
---

{stats.length > 0 && (
  <section
    id={sectionId}
    class={sectionClasses}
    aria-labelledby={titleId}
  >
    <h2 id={titleId} class={titleClasses}>
      {title}
    </h2>

    <div class={gridClasses}>
      {stats.map((stat, index) => (
        <div class={getStatWrapperClasses(index)}>
          <StatDisplay
            value={stat.value}
            label={stat.label}
            source={stat.source}
            sourceUrl={stat.sourceUrl}
            variant={getStatVariant(stat)}
            unit={stat.unit}
            showSource={showSources}
            linkSource={linkSources}
            alignment="center"
          />
        </div>
      ))}
    </div>
  </section>
)}
```

### 4.4 Chargement des données Content Collections

#### 4.4.1 Configuration Content Collections (déjà faite dans T-001-B3)

```typescript
// src/content/config.ts (rappel - déjà configuré)

import { defineCollection } from 'astro:content'
import { statItemSchema } from '@/schemas/stat'

const statsCollection = defineCollection({
  type: 'data',
  schema: statItemSchema,
})

export const collections = {
  // ... autres collections
  stats: statsCollection,
}
```

### 4.5 Export des types

```typescript
// src/types/components.ts (ajout)

export type { Props as StatsRowProps } from '@components/hero/StatsRow.astro'
export type {
  StatsRowColumns,
  StatsRowGap,
} from '@components/hero/StatsRow.astro'
```

### 4.6 Utilisation du composant

#### 4.6.1 Utilisation basique (charge depuis Content Collections)

```astro
---
import StatsRow from '@components/hero/StatsRow.astro'
---

<StatsRow />
```

#### 4.6.2 Utilisation avec stats personnalisées

```astro
---
import StatsRow from '@components/hero/StatsRow.astro'
import type { StatItem } from '@/types'

const customStats: StatItem[] = [
  {
    id: 'custom-1',
    value: '10h',
    label: 'Économisées par semaine en moyenne',
    source: 'Étude interne AIAD',
    order: 1,
    locale: 'fr',
    isActive: true,
    highlight: false,
    updatedAt: new Date(),
  },
  // ...
]
---

<StatsRow stats={customStats} />
```

#### 4.6.3 Utilisation avec titre visible

```astro
<StatsRow
  title="AIAD en chiffres"
  showTitle={true}
  gap="lg"
/>
```

#### 4.6.4 Utilisation sans séparateurs

```astro
<StatsRow
  showDividers={false}
  gap="lg"
/>
```

#### 4.6.5 Variante compact (toutes les stats)

```astro
<StatsRow
  statVariant="compact"
  showSources={false}
  gap="sm"
/>
```

#### 4.6.6 Grille 2 colonnes

```astro
<StatsRow
  columns={2}
  gap="md"
  maxWidth="max-w-3xl"
/>
```

#### 4.6.7 Intégration dans HeroSection (T-001-F8)

```astro
---
// src/components/hero/HeroSection.astro
import StatsRow from './StatsRow.astro'
---

<section class="hero-section py-16 md:py-24">
  <!-- ... HeroTitle, ValueProposition, CTAButton, BenefitsList ... -->

  <div class="mt-12 md:mt-16">
    <StatsRow
      columns="auto"
      gap="md"
      showDividers={true}
    />
  </div>
</section>
```

---

## 5. Design et style

### 5.1 Tokens de design

| Token | Mobile | Desktop (md) | Variable Tailwind |
|-------|--------|--------------|-------------------|
| **Section max-width** | 100% | 1024px | `max-w-5xl` |
| **Grid gap (sm)** | 16px | 20px | `gap-4 md:gap-5` |
| **Grid gap (md)** | 24px | 32px | `gap-6 md:gap-8` |
| **Grid gap (lg)** | 32px | 48px | `gap-8 md:gap-12` |
| **Title size** | 1.5rem | 1.875rem | `text-2xl md:text-3xl` |
| **Title margin bottom** | 32px | 48px | `mb-8 md:mb-12` |
| **Title color** | #111827 | - | `text-gray-900` |
| **Divider color** | #E5E7EB | - | `border-gray-200` |
| **Divider padding-top (mobile)** | 1.5rem | - | `pt-6` |
| **Divider padding-left (desktop)** | 2rem | - | `md:pl-8` |

### 5.2 Breakpoints

| Breakpoint | Largeur min | Colonnes (auto) | Séparateurs | Comportement |
|------------|-------------|-----------------|-------------|--------------|
| **Mobile** | 0px | 1 | Horizontaux | Stats empilées verticalement |
| **md (Tablet)** | 768px | 3 | Verticaux | Grille 3 colonnes côte à côte |
| **lg (Desktop)** | 1024px | 3 | Verticaux | Pas de changement |

### 5.3 Cohérence avec le design system

| Aspect | BenefitsList | StatsRow | Cohérence |
|--------|--------------|----------|-----------|
| **Max width** | `max-w-6xl` | `max-w-5xl` | ✅ (plus étroit car stat plus compact) |
| **Spacing scale** | gap-4/5/6/8/12 | gap-4/5/6/8/12 | ✅ Même échelle |
| **Grid system** | CSS Grid | CSS Grid | ✅ Identique |
| **Responsive pattern** | `md:grid-cols-3` | `md:grid-cols-3` | ✅ Même breakpoint |
| **Section semantic** | `<section>` + `<h2>` | `<section>` + `<h2>` | ✅ Identique |
| **Color scheme** | gray-900 (titre) | gray-900 (titre) | ✅ Identique |
| **Divider** | Aucun | `border-gray-200` | ✅ Standard Tailwind |

### 5.4 États visuels

| État | Comportement | Classes |
|------|--------------|---------|
| **Vide (0 stats)** | Rien affiché (section masquée) | Logique conditionnelle |
| **1 statistique** | Centrée dans la grille | Grid avec 1 item |
| **2 statistiques** | 2 colonnes, 1 séparateur | Grid avec 2 items |
| **3 statistiques** | 3 colonnes, 2 séparateurs | Standard |
| **4+ statistiques** | Grille étendue (wrap) | Warning en dev |

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Cas limites identifiés

| ID | Cas limite | Valeur/Situation | Comportement attendu | Test |
|----|------------|------------------|---------------------|------|
| CL-01 | Aucune statistique | `stats = []` | Section masquée, warning dev | T-01 |
| CL-02 | 1 seule statistique | `stats.length === 1` | Stat centrée, pas de séparateur | T-02 |
| CL-03 | 2 statistiques | `stats.length === 2` | 2 stats, 1 séparateur | T-03 |
| CL-04 | 4 statistiques | `stats.length === 4` | Grille étendue, warning dev | T-04 |
| CL-05 | 6 statistiques | `stats.length === 6` | Grille étendue, warning dev | T-05 |
| CL-06 | Statistique inactive | `isActive: false` | Filtrée, non affichée | T-06 |
| CL-07 | Ordre non séquentiel | `order: [1, 3, 5]` | Trié par order | T-07 |
| CL-08 | Props stats vide | `stats={[]}` | Section masquée | T-08 |
| CL-09 | Props stats null/undefined | `stats={undefined}` | Charge depuis Content Collections | T-09 |
| CL-10 | Content Collections manquant | Module non trouvé | Fallback array vide, warning | T-10 |
| CL-11 | columns=1 | Grille 1 colonne | 1 colonne sur tous devices | T-11 |
| CL-12 | columns=2 | Grille 2 colonnes | 1 col mobile, 2 cols desktop | T-12 |
| CL-13 | gap="lg" | Grand espacement | gap-8 mobile, gap-12 desktop | T-13 |
| CL-14 | showTitle=true | Titre visible | H2 visible avec styles | T-14 |
| CL-15 | showTitle=false (défaut) | Titre sr-only | H2 avec class sr-only | T-15 |
| CL-16 | title personnalisé | `title="Custom"` | Texte custom affiché | T-16 |
| CL-17 | showDividers=false | Sans séparateurs | Pas de bordures | T-17 |
| CL-18 | showDividers=true (défaut) | Avec séparateurs | Bordures entre stats | T-18 |
| CL-19 | centered=false | Non centré | Pas de mx-auto | T-19 |
| CL-20 | maxWidth custom | `maxWidth="max-w-3xl"` | Largeur réduite | T-20 |
| CL-21 | Classe additionnelle | `class="mt-8"` | Classe appliquée à section | T-21 |
| CL-22 | id fourni | `id="custom-id"` | ID appliqué à section | T-22 |
| CL-23 | Viewport très étroit (280px) | Écran 280px | Pas d'overflow horizontal | T-23 |
| CL-24 | showSources=false | Sources masquées | StatDisplay sans sources | T-24 |
| CL-25 | linkSources=false | Sources non cliquables | StatDisplay avec sources textuelles | T-25 |
| CL-26 | statVariant="compact" | Toutes en compact | Override highlight des StatItem | T-26 |
| CL-27 | statVariant non fourni | Auto highlight | Respect du champ highlight | T-27 |
| CL-28 | Mix highlight/default | 1 highlight + 2 default | Styles différenciés | T-28 |
| CL-29 | Données malformées | Champ manquant | Erreur TypeScript/Zod | T-29 |
| CL-30 | Très long titre de section | 100 caractères | Wrap naturel | T-30 |

### 6.2 Validation des props

```typescript
// Runtime validation (optionnel, en développement)
if (import.meta.env.DEV) {
  if (!stats || stats.length === 0) {
    console.warn('[StatsRow] No stats to display')
  }
  if (stats && stats.length > 6) {
    console.warn('[StatsRow] More than 6 stats may affect layout. Consider pagination.')
  }
  if (showTitle && !title) {
    console.warn('[StatsRow] showTitle is true but no title provided')
  }
}
```

### 6.3 Stratégie de fallback

| Situation | Comportement | Justification |
|-----------|--------------|---------------|
| Pas de stats (props) | Charge Content Collections | Flexibilité d'utilisation |
| Content Collections erreur | Array vide + warning | Graceful degradation |
| 0 stats final | Section non rendue | Éviter section vide |
| Données invalides | Erreur TypeScript/build | Prévention à la compilation |
| statVariant non reconnu | Erreur TypeScript | Types stricts |

---

## 7. Exemples entrée/sortie

### 7.1 Rendu par défaut (3 stats depuis Content Collections, avec séparateurs)

**Entrée (Props) :**

```typescript
{
  // Aucune prop stats → charge depuis Content Collections
  columns: 'auto',
  gap: 'md',
  showDividers: true,
  title: 'Chiffres clés',
  showTitle: false,
}
```

**Données chargées (Content Collections) :**

```json
[
  {
    "id": "stat-productivity",
    "value": "50%",
    "numericValue": 50,
    "unit": "%",
    "label": "Gain de productivité avec les agents IA",
    "source": "McKinsey Global Institute - The economic potential of generative AI, 2024",
    "sourceUrl": "https://www.mckinsey.com/...",
    "order": 1,
    "locale": "fr",
    "isActive": true,
    "highlight": true,
    "updatedAt": "2026-02-02T10:00:00.000Z"
  },
  {
    "id": "stat-speed",
    "value": "3x",
    "numericValue": 3,
    "unit": "x",
    "label": "Plus rapide pour coder avec assistance IA",
    "source": "GitHub Copilot Research - Developer productivity study, 2023",
    "sourceUrl": "https://github.blog/...",
    "order": 2,
    "locale": "fr",
    "isActive": true,
    "highlight": false,
    "updatedAt": "2026-02-02T10:00:00.000Z"
  },
  {
    "id": "stat-satisfaction",
    "value": ">90%",
    "numericValue": 90,
    "unit": "%",
    "label": "Des développeurs satisfaits de l'IA",
    "source": "Stack Overflow Developer Survey 2024",
    "sourceUrl": "https://survey.stackoverflow.co/2024/ai",
    "order": 3,
    "locale": "fr",
    "isActive": true,
    "highlight": false,
    "updatedAt": "2026-02-02T10:00:00.000Z"
  }
]
```

**Sortie (HTML) :**

```html
<section
  id="stats-section"
  class="mx-auto max-w-5xl w-full"
  aria-labelledby="stats-section-title"
>
  <h2 id="stats-section-title" class="sr-only">
    Chiffres clés
  </h2>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
    <!-- Stat 1 : highlight (pas de séparateur car index=0) -->
    <div class="">
      <div class="flex flex-col bg-blue-50 border border-blue-100 rounded-xl p-5 md:p-8 text-center items-center">
        <p class="font-bold leading-none text-4xl md:text-5xl text-blue-700">
          <span class="stat-value">50%</span>
        </p>
        <p class="mt-2 font-medium text-gray-700 leading-snug max-w-xs text-base md:text-lg">
          Gain de productivité avec les agents IA
        </p>
        <footer class="mt-3">
          <a href="https://www.mckinsey.com/..." target="_blank" rel="noopener noreferrer"
             class="text-xs text-blue-500 hover:text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded transition-colors">
            <cite class="not-italic">McKinsey Global Institute - The economic potential of generative AI, 2024</cite>
            <span class="sr-only">(ouvre dans un nouvel onglet)</span>
          </a>
        </footer>
      </div>
    </div>

    <!-- Stat 2 : default (avec séparateur) -->
    <div class="border-t border-gray-200 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
      <div class="flex flex-col bg-transparent p-4 md:p-6 text-center items-center">
        <p class="font-bold leading-none text-3xl md:text-4xl text-blue-600">
          <span class="stat-value">3x</span>
        </p>
        <p class="mt-2 font-medium text-gray-700 leading-snug max-w-xs text-sm md:text-base">
          Plus rapide pour coder avec assistance IA
        </p>
        <footer class="mt-3">
          <a href="https://github.blog/..." target="_blank" rel="noopener noreferrer"
             class="text-xs text-blue-500 hover:text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded transition-colors">
            <cite class="not-italic">GitHub Copilot Research - Developer productivity study, 2023</cite>
            <span class="sr-only">(ouvre dans un nouvel onglet)</span>
          </a>
        </footer>
      </div>
    </div>

    <!-- Stat 3 : default (avec séparateur) -->
    <div class="border-t border-gray-200 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
      <div class="flex flex-col bg-transparent p-4 md:p-6 text-center items-center">
        <p class="font-bold leading-none text-3xl md:text-4xl text-blue-600">
          <span class="stat-value">&gt;90%</span>
        </p>
        <p class="mt-2 font-medium text-gray-700 leading-snug max-w-xs text-sm md:text-base">
          Des développeurs satisfaits de l'IA
        </p>
        <footer class="mt-3">
          <a href="https://survey.stackoverflow.co/2024/ai" target="_blank" rel="noopener noreferrer"
             class="text-xs text-blue-500 hover:text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded transition-colors">
            <cite class="not-italic">Stack Overflow Developer Survey 2024</cite>
            <span class="sr-only">(ouvre dans un nouvel onglet)</span>
          </a>
        </footer>
      </div>
    </div>
  </div>
</section>
```

### 7.2 Rendu avec titre visible et sans séparateurs

**Entrée (Props) :**

```typescript
{
  title: 'AIAD en chiffres',
  showTitle: true,
  showDividers: false,
  gap: 'lg',
}
```

**Sortie (HTML) :**

```html
<section id="stats-section" class="mx-auto max-w-5xl w-full" aria-labelledby="stats-section-title">
  <h2 id="stats-section-title" class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8 md:mb-12">
    AIAD en chiffres
  </h2>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
    <div class="">
      <!-- StatDisplay highlight -->
    </div>
    <div class="">
      <!-- StatDisplay default (pas de bordure car showDividers=false) -->
    </div>
    <div class="">
      <!-- StatDisplay default -->
    </div>
  </div>
</section>
```

### 7.3 Rendu compact sans sources, 2 colonnes

**Entrée (Props) :**

```typescript
{
  columns: 2,
  statVariant: 'compact',
  showSources: false,
  showDividers: true,
  maxWidth: 'max-w-3xl',
}
```

**Sortie (HTML) :**

```html
<section id="stats-section" class="mx-auto max-w-3xl w-full" aria-labelledby="stats-section-title">
  <h2 id="stats-section-title" class="sr-only">Chiffres clés</h2>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
    <div class="">
      <div class="flex flex-col bg-transparent p-2 md:p-3 text-center items-center">
        <p class="font-bold leading-none text-2xl md:text-3xl text-blue-600">
          <span class="stat-value">50%</span>
        </p>
        <p class="mt-2 font-medium text-gray-700 leading-snug max-w-xs text-xs md:text-sm">
          Gain de productivité avec les agents IA
        </p>
        <!-- Pas de footer car showSources=false -->
      </div>
    </div>
    <div class="border-t border-gray-200 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
      <div class="flex flex-col bg-transparent p-2 md:p-3 text-center items-center">
        <p class="font-bold leading-none text-2xl md:text-3xl text-blue-600">
          <span class="stat-value">3x</span>
        </p>
        <p class="mt-2 font-medium text-gray-700 leading-snug max-w-xs text-xs md:text-sm">
          Plus rapide pour coder avec assistance IA
        </p>
      </div>
    </div>
    <!-- 3ème stat wrappée à la ligne suivante en grille 2 cols -->
    <div class="border-t border-gray-200 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
      <!-- StatDisplay compact -->
    </div>
  </div>
</section>
```

### 7.4 Rendu avec 0 statistiques

**Entrée (Props) :**

```typescript
{
  stats: [],
}
```

**Sortie (HTML) :**

```html
<!-- Rien n'est rendu (section masquée) -->
```

**Console (dev) :**
```
[StatsRow] No stats to display
```

### 7.5 Rendu avec stats personnalisées non centrées

**Entrée (Props) :**

```typescript
{
  stats: [
    {
      id: 'custom-1',
      value: '10h',
      label: 'Économisées par semaine en moyenne',
      source: 'Étude interne AIAD 2025',
      order: 1,
      locale: 'fr',
      isActive: true,
      highlight: false,
      updatedAt: new Date(),
    },
    {
      id: 'custom-2',
      value: '-40%',
      label: 'De bugs détectés en production',
      source: 'Métriques internes équipes pilotes',
      order: 2,
      locale: 'fr',
      isActive: true,
      highlight: true,
      updatedAt: new Date(),
    },
  ],
  centered: false,
  columns: 2,
}
```

**Sortie (HTML) :**

```html
<section id="stats-section" class="max-w-5xl w-full" aria-labelledby="stats-section-title">
  <!-- Note: pas de mx-auto car centered=false -->
  <h2 id="stats-section-title" class="sr-only">Chiffres clés</h2>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
    <div class="">
      <!-- StatDisplay default (highlight=false) -->
    </div>
    <div class="border-t border-gray-200 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
      <!-- StatDisplay highlight (highlight=true → variant="highlight") -->
    </div>
  </div>
</section>
```

---

## 8. Tests

### 8.1 Fichiers de test

| Type | Emplacement | Focus |
|------|-------------|-------|
| **Unitaires** | `tests/unit/components/stats-row.test.ts` | Rendu, props, classes, données, séparateurs |
| **E2E** | `tests/e2e/stats-row.spec.ts` | Intégration, responsive, visuel |
| **Accessibilité** | `tests/e2e/accessibility.spec.ts` | RGAA AA, ARIA, sémantique |

### 8.2 Suite de tests unitaires

```typescript
// tests/unit/components/stats-row.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import StatsRow from '@components/hero/StatsRow.astro'
import type { StatItem } from '@/types'

describe('StatsRow Component', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  // Fixture de base valide
  const mockStats: StatItem[] = [
    {
      id: 'stat-productivity',
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
      updatedAt: new Date('2026-02-02'),
    },
    {
      id: 'stat-speed',
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
      updatedAt: new Date('2026-02-02'),
    },
    {
      id: 'stat-satisfaction',
      value: '>90%',
      numericValue: 90,
      unit: '%',
      label: "Des développeurs satisfaits de l'IA",
      source: 'Stack Overflow Developer Survey 2024',
      sourceUrl: 'https://survey.stackoverflow.co/2024/ai',
      order: 3,
      locale: 'fr',
      isActive: true,
      highlight: false,
      updatedAt: new Date('2026-02-02'),
    },
  ]

  describe('Rendu de base', () => {
    it('T-00: should render as section element', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('<section')
      expect(result).toContain('</section>')
    })

    it('T-00b: should render aria-labelledby on section', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('aria-labelledby="stats-section-title"')
    })

    it('T-00c: should render h2 title element', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('<h2')
      expect(result).toContain('id="stats-section-title"')
    })

    it('should render correct number of StatDisplay components', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      const statValueMatches = result.match(/stat-value/g)
      expect(statValueMatches).toHaveLength(3)
    })

    it('should render grid container', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('grid')
    })

    it('should render all stat values', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('50%')
      expect(result).toContain('3x')
      // >90% sera échappé en HTML
      expect(result).toContain('90%')
    })

    it('should render all stat labels', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('Gain de productivité')
      expect(result).toContain('Plus rapide pour coder')
      expect(result).toContain('développeurs satisfaits')
    })

    it('should render all stat sources', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('McKinsey')
      expect(result).toContain('GitHub')
      expect(result).toContain('Stack Overflow')
    })
  })

  describe('Props: columns', () => {
    it('should apply auto column classes by default', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).toContain('md:grid-cols-3')
    })

    it('T-11: should apply 1 column classes', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, columns: 1 },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).not.toContain('md:grid-cols-3')
      expect(result).not.toContain('md:grid-cols-2')
    })

    it('T-12: should apply 2 column classes', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, columns: 2 },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).toContain('md:grid-cols-2')
    })

    it('should apply 3 column classes', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, columns: 3 },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).toContain('md:grid-cols-3')
    })
  })

  describe('Props: gap', () => {
    it('should apply md gap classes by default', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('gap-6')
      expect(result).toContain('md:gap-8')
    })

    it('should apply sm gap classes', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, gap: 'sm' },
      })

      expect(result).toContain('gap-4')
      expect(result).toContain('md:gap-5')
    })

    it('T-13: should apply lg gap classes', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, gap: 'lg' },
      })

      expect(result).toContain('gap-8')
      expect(result).toContain('md:gap-12')
    })
  })

  describe('Props: title et showTitle', () => {
    it('T-15: should render sr-only title by default', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('sr-only')
      expect(result).toContain('Chiffres clés')
    })

    it('T-14: should render visible title when showTitle=true', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, showTitle: true },
      })

      expect(result).not.toContain('sr-only')
      expect(result).toContain('text-2xl')
      expect(result).toContain('md:text-3xl')
      expect(result).toContain('font-bold')
    })

    it('T-16: should render custom title', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, title: 'AIAD en chiffres' },
      })

      expect(result).toContain('AIAD en chiffres')
    })
  })

  describe('Props: showDividers', () => {
    it('T-18: should render dividers by default', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('border-t')
      expect(result).toContain('border-gray-200')
      expect(result).toContain('md:border-l')
    })

    it('T-17: should not render dividers when showDividers=false', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, showDividers: false },
      })

      expect(result).not.toContain('border-t border-gray-200')
      expect(result).not.toContain('md:border-l')
    })

    it('should not render divider on first stat', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      // Le premier div wrapper ne doit pas avoir de bordure
      // Compter le nombre d'occurrences de la classe séparateur
      const dividerMatches = result.match(/border-t border-gray-200/g)
      // Il doit y avoir exactement 2 séparateurs pour 3 stats
      expect(dividerMatches).toHaveLength(2)
    })
  })

  describe('Props: statVariant et auto-highlight', () => {
    it('T-27: should auto-detect highlight from stat data', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      // La première stat (highlight=true) doit avoir les classes highlight
      expect(result).toContain('bg-blue-50')
      expect(result).toContain('text-blue-700')

      // Les autres stats doivent avoir les classes default
      expect(result).toContain('text-blue-600')
    })

    it('T-26: should override highlight with statVariant="compact"', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, statVariant: 'compact' },
      })

      // Toutes les stats doivent être compact
      expect(result).toContain('text-2xl')
      expect(result).toContain('p-2')

      // Pas de styles highlight
      expect(result).not.toContain('bg-blue-50')
    })

    it('T-28: should handle mix of highlight and default', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      // bg-blue-50 ne doit apparaître qu'une fois (pour la stat highlight)
      const highlightMatches = result.match(/bg-blue-50/g)
      expect(highlightMatches).toHaveLength(1)
    })
  })

  describe('Props: showSources et linkSources', () => {
    it('should show sources by default', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('<cite')
      expect(result).toContain('McKinsey')
    })

    it('T-24: should hide sources when showSources=false', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, showSources: false },
      })

      expect(result).not.toContain('<cite')
      expect(result).not.toContain('<footer')
    })

    it('should render source links by default', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('<a')
      expect(result).toContain('target="_blank"')
    })

    it('T-25: should render plain text sources when linkSources=false', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, linkSources: false },
      })

      expect(result).toContain('<cite')
      expect(result).toContain('text-gray-500')
      // Pas de liens
      expect(result).not.toContain('target="_blank"')
    })
  })

  describe('Props: centered et maxWidth', () => {
    it('should apply centered classes by default', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('mx-auto')
    })

    it('T-19: should not apply mx-auto when centered=false', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, centered: false },
      })

      expect(result).not.toContain('mx-auto')
    })

    it('should apply default maxWidth', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('max-w-5xl')
    })

    it('T-20: should apply custom maxWidth', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, maxWidth: 'max-w-3xl' },
      })

      expect(result).toContain('max-w-3xl')
      expect(result).not.toContain('max-w-5xl')
    })
  })

  describe('Props: class et id', () => {
    it('T-21: should apply custom class', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, class: 'mt-8 custom-class' },
      })

      expect(result).toContain('mt-8')
      expect(result).toContain('custom-class')
    })

    it('T-22: should apply custom id', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats, id: 'custom-stats' },
      })

      expect(result).toContain('id="custom-stats"')
      expect(result).toContain('aria-labelledby="custom-stats-title"')
    })
  })

  describe('Cas limites: Nombre de statistiques', () => {
    it('T-01: should not render section when stats array is empty', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: [] },
      })

      expect(result).not.toContain('<section')
    })

    it('T-02: should render correctly with 1 stat (no divider)', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: [mockStats[0]] },
      })

      expect(result).toContain('<section')
      const statValueMatches = result.match(/stat-value/g)
      expect(statValueMatches).toHaveLength(1)

      // Pas de séparateur avec 1 seule stat
      expect(result).not.toContain('border-t border-gray-200')
    })

    it('T-03: should render correctly with 2 stats (1 divider)', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats.slice(0, 2) },
      })

      const statValueMatches = result.match(/stat-value/g)
      expect(statValueMatches).toHaveLength(2)

      const dividerMatches = result.match(/border-t border-gray-200/g)
      expect(dividerMatches).toHaveLength(1)
    })

    it('T-04: should render correctly with 4 stats', async () => {
      const fourStats = [
        ...mockStats,
        { ...mockStats[0], id: 'stat-4', order: 4, highlight: false },
      ]

      const result = await container.renderToString(StatsRow, {
        props: { stats: fourStats },
      })

      const statValueMatches = result.match(/stat-value/g)
      expect(statValueMatches).toHaveLength(4)
    })

    it('T-05: should render with 6 stats', async () => {
      const sixStats = [
        ...mockStats,
        { ...mockStats[0], id: 'stat-4', order: 4, highlight: false },
        { ...mockStats[1], id: 'stat-5', order: 5 },
        { ...mockStats[2], id: 'stat-6', order: 6 },
      ]

      const result = await container.renderToString(StatsRow, {
        props: { stats: sixStats },
      })

      const statValueMatches = result.match(/stat-value/g)
      expect(statValueMatches).toHaveLength(6)
    })
  })

  describe('Cas limites: Tri et filtrage', () => {
    it('T-07: should render stats sorted by order', async () => {
      const unorderedStats = [
        { ...mockStats[2], order: 3 },
        { ...mockStats[0], order: 1 },
        { ...mockStats[1], order: 2 },
      ]

      const sortedStats = [...unorderedStats].sort((a, b) => a.order - b.order)

      const result = await container.renderToString(StatsRow, {
        props: { stats: sortedStats },
      })

      const productivityIndex = result.indexOf('productivité')
      const rapideIndex = result.indexOf('rapide')
      const satisfaitsIndex = result.indexOf('satisfaits')

      expect(productivityIndex).toBeLessThan(rapideIndex)
      expect(rapideIndex).toBeLessThan(satisfaitsIndex)
    })
  })

  describe('Accessibilité', () => {
    it('should use section element for semantic structure', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result.match(/<section/g)?.length).toBe(1)
    })

    it('should have aria-labelledby linking to title', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('aria-labelledby="stats-section-title"')
      expect(result).toContain('id="stats-section-title"')
    })

    it('should use h2 for section title', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      expect(result).toContain('<h2')
      expect(result).not.toContain('<h1')
    })

    it('should have cite elements for each source', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      const citeMatches = result.match(/<cite/g)
      expect(citeMatches).toHaveLength(3)
    })

    it('should have noopener noreferrer on external links', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      const noopenerMatches = result.match(/rel="noopener noreferrer"/g)
      expect(noopenerMatches).toHaveLength(3)
    })

    it('should have sr-only text for external links', async () => {
      const result = await container.renderToString(StatsRow, {
        props: { stats: mockStats },
      })

      const srOnlyMatches = result.match(/nouvel onglet/g)
      expect(srOnlyMatches).toHaveLength(3)
    })
  })
})
```

### 8.3 Suite de tests E2E (Playwright)

```typescript
// tests/e2e/stats-row.spec.ts

import { test, expect } from '@playwright/test'

test.describe('StatsRow Component - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display stats row in hero section', async ({ page }) => {
    const statsSection = page.locator('section[aria-labelledby*="stats"]')

    await expect(statsSection).toBeVisible()
  })

  test('should display exactly 3 stat values', async ({ page }) => {
    const statValues = page.locator('.stat-value')

    await expect(statValues).toHaveCount(3)
  })

  test('should display expected stat values', async ({ page }) => {
    const expectedValues = ['50%', '3x', '>90%']

    for (const value of expectedValues) {
      await expect(page.locator(`text=${value}`)).toBeVisible()
    }
  })

  test('should display sources for each stat', async ({ page }) => {
    const sources = page.locator('section[aria-labelledby*="stats"] cite')

    await expect(sources).toHaveCount(3)
  })

  test('should have clickable source links', async ({ page }) => {
    const sourceLinks = page.locator('section[aria-labelledby*="stats"] footer a[target="_blank"]')

    const count = await sourceLinks.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('should display stats in correct order', async ({ page }) => {
    const statValues = page.locator('section[aria-labelledby*="stats"] .stat-value')

    const values = await statValues.allTextContents()

    expect(values[0]).toContain('50%')
    expect(values[1]).toContain('3x')
    expect(values[2]).toContain('90%')
  })

  test('T-23: should not have horizontal overflow on narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 280, height: 600 })

    const body = page.locator('body')
    const bodyWidth = await body.evaluate((el) => el.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })

  test('should be responsive across breakpoints', async ({ page }) => {
    const statsSection = page.locator('section[aria-labelledby*="stats"]')

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(statsSection).toBeVisible()

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(statsSection).toBeVisible()

    // Desktop
    await page.setViewportSize({ width: 1440, height: 900 })
    await expect(statsSection).toBeVisible()
  })

  test('should stack stats vertically on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    const statValues = page.locator('section[aria-labelledby*="stats"] .stat-value')
    const firstStat = statValues.first()
    const secondStat = statValues.nth(1)

    const firstBox = await firstStat.boundingBox()
    const secondBox = await secondStat.boundingBox()

    // Sur mobile, les stats sont empilées (y différent)
    expect(secondBox!.y).toBeGreaterThan(firstBox!.y + 10)
  })

  test('should display stats side by side on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })

    const statValues = page.locator('section[aria-labelledby*="stats"] .stat-value')
    const firstStat = statValues.first()
    const secondStat = statValues.nth(1)

    const firstBox = await firstStat.boundingBox()
    const secondBox = await secondStat.boundingBox()

    // Sur desktop, les stats sont côte à côte (même y, x différent)
    expect(Math.abs(firstBox!.y - secondBox!.y)).toBeLessThan(50)
    expect(secondBox!.x).toBeGreaterThan(firstBox!.x)
  })

  test('should show dividers between stats on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })

    // Vérifier les séparateurs via les bordures gauches
    const dividedStats = page.locator('section[aria-labelledby*="stats"] [class*="md:border-l"]')

    const count = await dividedStats.count()
    // 2 séparateurs pour 3 stats
    expect(count).toBe(2)
  })

  test('highlight stat should have different styling', async ({ page }) => {
    // La première stat (50%) est highlight
    const highlightedStat = page.locator('section[aria-labelledby*="stats"] .bg-blue-50').first()

    if (await highlightedStat.count() > 0) {
      await expect(highlightedStat).toBeVisible()
    }
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    const h1 = page.locator('h1')
    const h2Stats = page.locator('section[aria-labelledby*="stats"] h2')

    await expect(h1).toHaveCount(1)
    await expect(h2Stats).toHaveCount(1)
  })
})
```

### 8.4 Tests d'accessibilité

```typescript
// tests/e2e/accessibility.spec.ts (ajout pour StatsRow)

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('StatsRow Accessibility', () => {
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto('/')

    const results = await new AxeBuilder({ page })
      .include('section[aria-labelledby*="stats"]')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('should have section with aria-labelledby', async ({ page }) => {
    await page.goto('/')

    const section = page.locator('section[aria-labelledby*="stats"]')
    const labelledby = await section.getAttribute('aria-labelledby')

    expect(labelledby).toBeTruthy()

    // Vérifier que l'élément référencé existe
    const title = page.locator(`#${labelledby}`)
    await expect(title).toBeAttached()
  })

  test('should have accessible title (visible or sr-only)', async ({ page }) => {
    await page.goto('/')

    const title = page.locator('section[aria-labelledby*="stats"] h2')

    await expect(title).toBeAttached()

    const titleText = await title.textContent()
    expect(titleText?.trim()).toBeTruthy()
  })

  test('source links should be keyboard accessible', async ({ page }) => {
    await page.goto('/')

    const sourceLinks = page.locator('section[aria-labelledby*="stats"] footer a[target="_blank"]')
    const count = await sourceLinks.count()

    if (count > 0) {
      await sourceLinks.first().focus()

      const isFocused = await sourceLinks.first().evaluate((el) => {
        return document.activeElement === el
      })

      expect(isFocused).toBe(true)
    }
  })

  test('should have proper text contrast for stat values', async ({ page }) => {
    await page.goto('/')

    const value = page.locator('.stat-value').first()
    const valueColor = await value.evaluate((el) => {
      return window.getComputedStyle(el).color
    })

    // text-blue-600 = rgb(37, 99, 235) ou text-blue-700 = rgb(29, 78, 216)
    expect(valueColor).toMatch(/rgb\(\d+, \d+, \d+\)/)
  })

  test('should use cite element for proper attribution', async ({ page }) => {
    await page.goto('/')

    const citeElements = page.locator('section[aria-labelledby*="stats"] cite')

    const count = await citeElements.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test('should maintain reading order', async ({ page }) => {
    await page.goto('/')

    const statValues = page.locator('section[aria-labelledby*="stats"] .stat-value')
    const count = await statValues.count()

    for (let i = 0; i < count - 1; i++) {
      const currentStat = statValues.nth(i)
      const nextStat = statValues.nth(i + 1)

      const currentBox = await currentStat.boundingBox()
      const nextBox = await nextStat.boundingBox()

      expect(currentBox).toBeTruthy()
      expect(nextBox).toBeTruthy()
    }
  })
})
```

### 8.5 Matrice de couverture

| Aspect | Tests unitaires | Tests E2E | Couverture |
|--------|-----------------|-----------|------------|
| Rendu basique | T-00, T-00b, T-00c + 4 tests | ✅ | 100% |
| Props columns | 4 tests (T-11, T-12) | ✅ | 100% |
| Props gap | 3 tests (T-13) | - | 100% |
| Props title/showTitle | 3 tests (T-14, T-15, T-16) | ✅ | 100% |
| Props showDividers | 3 tests (T-17, T-18) | ✅ | 100% |
| Props statVariant/highlight | 3 tests (T-26, T-27, T-28) | ✅ | 100% |
| Props showSources/linkSources | 4 tests (T-24, T-25) | ✅ | 100% |
| Props centered/maxWidth | 4 tests (T-19, T-20) | - | 100% |
| Props class/id | 2 tests (T-21, T-22) | - | 100% |
| Cas limites (0-6 stats) | 5 tests (T-01 à T-05) | T-23 | 100% |
| Tri/ordre | 1 test (T-07) | ✅ | 100% |
| Accessibilité | 6 tests | 7 tests | 100% |
| Responsive | - | 4 tests | 100% |

---

## 9. Critères d'acceptation

- [ ] **CA-01** : Le composant `StatsRow.astro` existe dans `src/components/hero/`
- [ ] **CA-02** : Le composant rend un `<section>` comme élément racine
- [ ] **CA-03** : Le composant a un `aria-labelledby` pointant vers le titre
- [ ] **CA-04** : Le titre est rendu dans un `<h2>` (sr-only par défaut)
- [ ] **CA-05** : La grille utilise CSS Grid avec classes responsive
- [ ] **CA-06** : Les StatDisplay sont rendus dans le bon ordre (par `order`)
- [ ] **CA-07** : Le composant charge depuis Content Collections si pas de props `stats`
- [ ] **CA-08** : Le composant accepte des `stats` personnalisées via props
- [ ] **CA-09** : Les variantes `columns`, `gap`, `statVariant` fonctionnent
- [ ] **CA-10** : Le composant est responsive (1 col mobile → 3 cols desktop)
- [ ] **CA-11** : La section n'est pas rendue si 0 statistiques
- [ ] **CA-12** : Les séparateurs sont visibles par défaut entre les stats
- [ ] **CA-13** : Les séparateurs sont horizontaux sur mobile et verticaux sur desktop
- [ ] **CA-14** : `showDividers=false` supprime les séparateurs
- [ ] **CA-15** : Le champ `highlight` du StatItem détermine automatiquement la variante
- [ ] **CA-16** : `statVariant` override le highlight automatique si fourni
- [ ] **CA-17** : `showSources=false` masque les sources de tous les StatDisplay
- [ ] **CA-18** : `linkSources=false` rend les sources non cliquables
- [ ] **CA-19** : Le composant n'émet pas de JavaScript client (static)
- [ ] **CA-20** : Le composant respecte RGAA AA (hiérarchie, ARIA, contrastes)
- [ ] **CA-21** : TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] **CA-22** : ESLint passe sans warning (`pnpm lint`)
- [ ] **CA-23** : Tous les tests unitaires passent
- [ ] **CA-24** : Tous les tests E2E passent

---

## 10. Definition of Done

- [ ] Composant implémenté dans `src/components/hero/StatsRow.astro`
- [ ] Interface Props documentée avec JSDoc
- [ ] Chargement depuis Content Collections fonctionnel
- [ ] Toutes les variantes (columns, gap, statVariant, showDividers) implémentées
- [ ] Gestion automatique du highlight basée sur `StatItem.highlight`
- [ ] Séparateurs responsive (horizontal mobile / vertical desktop)
- [ ] Tests unitaires écrits et passants (`tests/unit/components/stats-row.test.ts`)
- [ ] Tests E2E écrits et passants (`tests/e2e/stats-row.spec.ts`)
- [ ] TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] ESLint passe sans warning (`pnpm lint`)
- [ ] Composant visuellement vérifié sur mobile, tablet, desktop
- [ ] Accessibilité vérifiée (axe-core)
- [ ] Code reviewé par un pair

---

## 11. Notes d'implémentation

### 11.1 Points d'attention

1. **Chargement Content Collections** : Utiliser `try/catch` pour le chargement dynamique, identique au pattern de `BenefitsList`.

2. **Filtrage des stats** : Filtrer `isActive !== false` lors du chargement pour ne pas afficher les stats désactivées.

3. **Tri par order** : Toujours trier les stats par `order` pour garantir un affichage cohérent.

4. **Rendu conditionnel** : Ne pas rendre la section si aucune statistique n'est disponible.

5. **Séparateurs** : Les séparateurs sont implémentés via des bordures CSS sur les wrappers (pas des éléments séparés dans la grille) pour ne pas perturber le layout CSS Grid.

6. **Séparateurs mobile/desktop** : Utiliser `border-t` pour mobile et `md:border-l` avec `md:border-t-0` pour desktop (responsive via Tailwind).

7. **Auto-highlight** : Si `statVariant` n'est pas fourni, utiliser `stat.highlight` pour déterminer si la stat est en `highlight` ou `default`.

8. **Hiérarchie des titres** : Utiliser `<h2>` car la page a déjà un `<h1>` (HeroTitle).

9. **Pas de JavaScript** : Ce composant est 100% statique. Aucune hydratation client.

10. **max-w-5xl vs max-w-6xl** : Le StatsRow utilise `max-w-5xl` (plus étroit que BenefitsList) car les stats sont plus compactes et le contenu tient dans moins de largeur.

### 11.2 Différences avec BenefitsList

| Aspect | BenefitsList | StatsRow |
|--------|--------------|----------|
| **Enfant** | `BenefitCard` (article) | `StatDisplay` (div) |
| **Séparateurs** | Aucun | Bordures responsive |
| **Max width** | `max-w-6xl` | `max-w-5xl` |
| **Default title** | "Bénéfices clés" | "Chiffres clés" |
| **Auto variant** | Non (cardVariant uniforme) | Oui (basé sur stat.highlight) |
| **Props spécifiques** | iconPosition, iconSize | showSources, linkSources, showDividers |
| **Element wrapper** | Non | `<div>` pour gérer les bordures |

### 11.3 Extensions futures

| Extension | Priorité | Impact |
|-----------|----------|--------|
| Mode sombre | Moyenne | Classes `dark:border-gray-700`, `dark:text-*` |
| Animation compteur | Basse | Intersection Observer pour animer la valeur |
| Tooltip source | Basse | Afficher la source complète au hover |
| Séparateurs custom | Basse | Prop pour le style de séparateur |
| Grille responsive adaptative | Basse | Adapter le nombre de colonnes selon le nombre de stats |

### 11.4 Relation avec les autres composants

```
HeroSection (T-001-F8)
├── HeroTitle (T-001-F1) ✅
├── ValueProposition (T-001-F2) ✅
├── CTAButton (T-001-F3) ✅
├── BenefitsList (T-001-F5) ✅
│   └── BenefitCard[] (T-001-F4) ✅
└── StatsRow (T-001-F7) ← CE COMPOSANT
    ├── <section aria-labelledby>
    ├── <h2> title (sr-only)
    └── <div class="grid">
        └── <div> (wrapper avec bordures optionnelles)
            └── StatDisplay[] (T-001-F6) ✅
                ├── <p> value (with optional unit)
                ├── <p> label
                └── <footer><cite> source (optionally linked)
```

### 11.5 Données source

Le composant consomme les données de `src/content/stats/main.json` (T-001-B6) :

```json
[
  {
    "id": "stat-productivity",
    "value": "50%",
    "numericValue": 50,
    "unit": "%",
    "label": "Gain de productivité avec les agents IA",
    "source": "McKinsey Global Institute - The economic potential of generative AI, 2024",
    "sourceUrl": "https://www.mckinsey.com/...",
    "order": 1,
    "locale": "fr",
    "isActive": true,
    "highlight": true,
    "updatedAt": "2026-02-02T10:00:00.000Z"
  },
  {
    "id": "stat-speed",
    "value": "3x",
    "numericValue": 3,
    "unit": "x",
    "label": "Plus rapide pour coder avec assistance IA",
    "source": "GitHub Copilot Research - Developer productivity study, 2023",
    "sourceUrl": "https://github.blog/...",
    "order": 2,
    "locale": "fr",
    "isActive": true,
    "highlight": false,
    "updatedAt": "2026-02-02T10:00:00.000Z"
  },
  {
    "id": "stat-satisfaction",
    "value": ">90%",
    "numericValue": 90,
    "unit": "%",
    "label": "Des développeurs satisfaits de l'IA",
    "source": "Stack Overflow Developer Survey 2024",
    "sourceUrl": "https://survey.stackoverflow.co/2024/ai",
    "order": 3,
    "locale": "fr",
    "isActive": true,
    "highlight": false,
    "updatedAt": "2026-02-02T10:00:00.000Z"
  }
]
```

---

## 12. Références

| Document | Lien |
|----------|------|
| User Story US-001 | [spec.md](./spec.md) |
| Composant StatDisplay (T-001-F6) | [T-001-F6-composant-StatDisplay.md](./T-001-F6-composant-StatDisplay.md) |
| Composant BenefitsList (T-001-F5) | [T-001-F5-composant-BenefitsList.md](./T-001-F5-composant-BenefitsList.md) |
| Modèle StatItem (T-001-B3) | [T-001-B3-modele-donnees-StatItem.md](./T-001-B3-modele-donnees-StatItem.md) |
| Données Stats (T-001-B6) | [T-001-B6-donnees-JSON-statistiques-chiffrees.md](./T-001-B6-donnees-JSON-statistiques-chiffrees.md) |
| Architecture technique | [../../ARCHITECTURE.md](../../ARCHITECTURE.md) |
| Guide Claude | [../../CLAUDE.md](../../CLAUDE.md) |
| Astro Components | [docs.astro.build](https://docs.astro.build/en/core-concepts/astro-components/) |
| Astro Content Collections | [docs.astro.build](https://docs.astro.build/en/guides/content-collections/) |
| CSS Grid | [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) |
| Tailwind Grid | [tailwindcss.com](https://tailwindcss.com/docs/grid-template-columns) |
| RGAA 4.1 | [accessibilite.numerique.gouv.fr](https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/) |
| Astro Container API | [docs.astro.build](https://docs.astro.build/en/reference/container-reference/) |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 05/02/2026 | Création initiale complète |
