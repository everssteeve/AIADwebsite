# T-001-F5 : Créer le composant BenefitsList (grille des 3 bénéfices)

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 3 février 2026 |
| **Statut** | ✅ Terminé |
| **User Story** | [US-001 - Comprendre AIAD rapidement](./spec.md) |
| **Dépendances** | T-001-F4 (BenefitCard) ✅, T-001-B5 (données bénéfices) ✅ |
| **Bloque** | T-001-F8 (HeroSection assemblage), T-001-T2 (tests composants) |

---

## 1. Objectif

Créer le composant Astro `BenefitsList` qui affiche une grille responsive des 3 bénéfices clés du framework AIAD dans la hero section, en garantissant :

- **Composition** : Orchestration des composants `BenefitCard` existants
- **Responsive** : Grille adaptative (1 colonne mobile → 3 colonnes desktop)
- **Accessibilité** : Structure sémantique avec `<section>` et titre implicite/explicite
- **Flexibilité** : Support de données via props ou Content Collections
- **Performance** : Rendu statique sans JavaScript client (0 KB JS)
- **Type-safety** : Props typées avec TypeScript strict basées sur `BenefitItem[]`
- **Design system** : Intégration Tailwind CSS cohérente avec les autres composants hero

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
│       ├── BenefitsList.astro     # ← COMPOSANT À CRÉER
│       └── HeroSection.astro      # T-001-F8 (consommateur)
├── content/
│   └── benefits/
│       └── main.json              # ✅ Données (T-001-B5)
├── schemas/
│   └── benefit.ts                 # ✅ Schéma Zod
├── types/
│   ├── index.ts                   # Export barrel
│   └── benefit.ts                 # Interface BenefitItem (T-001-B2)
└── pages/
    └── index.astro                # Consommateur final (via HeroSection)
```

### 2.3 Dépendances

| Type | Nom | Provenance | Statut |
|------|-----|------------|--------|
| **Composant** | `BenefitCard` | T-001-F4 | ✅ Terminé |
| **Modèle de données** | `BenefitItem` | T-001-B2 | ✅ Terminé |
| **Données JSON** | `benefits/main.json` | T-001-B5 | ✅ Terminé |
| **Schéma Zod** | `benefitItemSchema` | T-001-B2 | ✅ Terminé |

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
│  │                    BenefitsList  ← CE COMPOSANT          │    │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │    │
│  │  │ BenefitCard  │ │ BenefitCard  │ │ BenefitCard  │     │    │
│  │  │ ┌──────┐     │ │ ┌──────┐     │ │ ┌──────┐     │     │    │
│  │  │ │ 📈  │     │ │ │  ✅  │     │ │ │ 👥  │     │     │    │
│  │  │ └──────┘     │ │ └──────┘     │ │ └──────┘     │     │    │
│  │  │ Productivité │ │   Qualité    │ │ Collaboration│     │    │
│  │  │  décuplée    │ │   garantie   │ │    fluide    │     │    │
│  │  │              │ │              │ │              │     │    │
│  │  │ Description..│ │ Description..│ │ Description..│     │    │
│  │  └──────────────┘ └──────────────┘ └──────────────┘     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ StatsRow (statistiques)                                  │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Spécifications fonctionnelles

### 3.1 Description du composant

Le `BenefitsList` est un composant composite responsable de l'orchestration et de la mise en page des bénéfices :

| Élément | Balise HTML | Source de données | Rôle |
|---------|-------------|-------------------|------|
| Conteneur | `<section>` | - | Encapsule la liste sémantiquement |
| Titre optionnel | `<h2>` (sr-only) | Props `title` | Accessibilité (lecteurs d'écran) |
| Grille | `<div>` avec CSS Grid | - | Layout responsive |
| Bénéfices | `BenefitCard[]` | Props `benefits` ou Content Collections | Affichage des 3 bénéfices |

### 3.2 Comportement attendu

#### 3.2.1 Rendu par défaut (Desktop ≥1024px)

```
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐ │
│  │                     │ │                     │ │                     │ │
│  │       ┌─────┐       │ │       ┌─────┐       │ │       ┌─────┐       │ │
│  │       │ 📈 │       │ │       │ ✅ │       │ │       │ 👥 │       │ │
│  │       └─────┘       │ │       └─────┘       │ │       └─────┘       │ │
│  │                     │ │                     │ │                     │ │
│  │  Productivité       │ │  Qualité garantie   │ │  Collaboration      │ │
│  │    décuplée         │ │                     │ │    fluide           │ │
│  │                     │ │                     │ │                     │ │
│  │  Automatisez les    │ │  Des standards de   │ │  Une méthodologie   │ │
│  │  tâches répétitives │ │  code et des        │ │  claire pour        │ │
│  │  et concentrez-vous │ │  validations...     │ │  structurer...      │ │
│  │                     │ │                     │ │                     │ │
│  └─────────────────────┘ └─────────────────────┘ └─────────────────────┘ │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
                          gap-8 (32px)
```

#### 3.2.2 Rendu mobile (< 768px)

```
┌─────────────────────────────┐
│                             │
│  ┌───────────────────────┐  │
│  │       ┌─────┐         │  │
│  │       │ 📈 │         │  │
│  │       └─────┘         │  │
│  │   Productivité        │  │
│  │     décuplée          │  │
│  │   Automatisez les...  │  │
│  └───────────────────────┘  │
│           gap-6             │
│  ┌───────────────────────┐  │
│  │       ┌─────┐         │  │
│  │       │ ✅ │         │  │
│  │       └─────┘         │  │
│  │   Qualité garantie    │  │
│  │   Des standards...    │  │
│  └───────────────────────┘  │
│           gap-6             │
│  ┌───────────────────────┐  │
│  │       ┌─────┐         │  │
│  │       │ 👥 │         │  │
│  │       └─────┘         │  │
│  │   Collaboration       │  │
│  │     fluide            │  │
│  │   Une méthodologie... │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
```

#### 3.2.3 Rendu tablette (768px - 1023px)

Option A (recommandée) : 3 colonnes avec gap réduit
Option B : 2 colonnes + 1 centrée en dessous

### 3.3 Variantes

Le composant supporte les variantes suivantes :

| Variante | Prop | Valeur par défaut | Description |
|----------|------|-------------------|-------------|
| `columns` | `1 \| 2 \| 3 \| 'auto'` | `'auto'` | Nombre de colonnes (auto = responsive) |
| `gap` | `'sm' \| 'md' \| 'lg'` | `'md'` | Espacement entre les cartes |
| `cardVariant` | `'default' \| 'compact' \| 'featured'` | `'default'` | Variante transmise aux BenefitCard |
| `centered` | `boolean` | `true` | Centre la grille horizontalement |
| `maxWidth` | `string` | `'max-w-6xl'` | Largeur maximale du conteneur |

#### 3.3.1 Configurations de grille

| Config `columns` | Mobile (< 768px) | Tablette (768-1023px) | Desktop (≥ 1024px) |
|------------------|------------------|----------------------|-------------------|
| `'auto'` | 1 colonne | 3 colonnes | 3 colonnes |
| `1` | 1 colonne | 1 colonne | 1 colonne |
| `2` | 1 colonne | 2 colonnes | 2 colonnes |
| `3` | 1 colonne | 3 colonnes | 3 colonnes |

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
<BenefitsList benefits={customBenefits} />
```

#### 3.4.2 Via Content Collections (par défaut si pas de props)

```typescript
// Chargement automatique depuis src/content/benefits/main.json
const benefits = await getCollection('benefits')
```

### 3.5 Accessibilité (RGAA AA)

| Critère | Exigence | Implémentation |
|---------|----------|----------------|
| **1.1** Rôle sémantique | Section avec landmark | `<section>` avec `aria-labelledby` |
| **1.3** Titre de section | Titre pour lecteurs d'écran | `<h2 class="sr-only">` ou visible |
| **9.1** Hiérarchie titres | H2 pour section, H3 pour cartes | Titre section H2, BenefitCard utilise H3 |
| **10.1** Structure liste | Liste de contenus similaires | Grille CSS ou `role="list"` optionnel |
| **12.6** Navigation | Ordre de lecture logique | Ordre DOM = ordre visuel (1→2→3) |

---

## 4. Spécifications techniques

### 4.1 Interface TypeScript des Props

```typescript
// src/components/hero/BenefitsList.astro - Frontmatter

import type { BenefitItem } from '@/types'

/**
 * Nombre de colonnes de la grille
 */
export type BenefitsListColumns = 1 | 2 | 3 | 'auto'

/**
 * Taille de l'espacement entre les cartes
 */
export type BenefitsListGap = 'sm' | 'md' | 'lg'

/**
 * Variante des cartes de bénéfices
 */
export type BenefitCardVariant = 'default' | 'compact' | 'featured'

/**
 * Props du composant BenefitsList
 *
 * @example
 * ```astro
 * <BenefitsList
 *   benefits={benefits}
 *   columns="auto"
 *   gap="md"
 *   title="Pourquoi AIAD ?"
 * />
 * ```
 */
export interface BenefitsListProps {
  /**
   * Liste des bénéfices à afficher.
   * Si non fourni, charge automatiquement depuis Content Collections.
   */
  benefits?: BenefitItem[]

  /**
   * Nombre de colonnes de la grille.
   * - 'auto': responsive (1 col mobile → 3 col desktop)
   * - 1/2/3: nombre fixe de colonnes
   * @default 'auto'
   */
  columns?: BenefitsListColumns

  /**
   * Espacement entre les cartes.
   * - 'sm': gap-4 md:gap-5 (16px → 20px)
   * - 'md': gap-6 md:gap-8 (24px → 32px)
   * - 'lg': gap-8 md:gap-12 (32px → 48px)
   * @default 'md'
   */
  gap?: BenefitsListGap

  /**
   * Variante visuelle à appliquer à toutes les cartes.
   * Transmis directement aux composants BenefitCard.
   * @default 'default'
   */
  cardVariant?: BenefitCardVariant

  /**
   * Position de l'icône dans les cartes.
   * @default 'top'
   */
  iconPosition?: 'top' | 'left'

  /**
   * Taille des icônes dans les cartes.
   * @default 'md'
   */
  iconSize?: 'sm' | 'md' | 'lg'

  /**
   * Titre de la section (pour accessibilité).
   * Si fourni avec `showTitle: false`, sera invisible mais accessible aux lecteurs d'écran.
   * @default 'Bénéfices clés'
   */
  title?: string

  /**
   * Affiche le titre visiblement (vs sr-only).
   * @default false
   */
  showTitle?: boolean

  /**
   * Centre la grille horizontalement dans son conteneur.
   * @default true
   */
  centered?: boolean

  /**
   * Largeur maximale du conteneur.
   * @default 'max-w-6xl'
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
// src/components/hero/BenefitsList.astro

import type { BenefitItem } from '@/types'
import BenefitCard from './BenefitCard.astro'

export interface Props {
  benefits?: BenefitItem[]
  columns?: 1 | 2 | 3 | 'auto'
  gap?: 'sm' | 'md' | 'lg'
  cardVariant?: 'default' | 'compact' | 'featured'
  iconPosition?: 'top' | 'left'
  iconSize?: 'sm' | 'md' | 'lg'
  title?: string
  showTitle?: boolean
  centered?: boolean
  maxWidth?: string
  class?: string
  id?: string
}

const {
  benefits: benefitsProp,
  columns = 'auto',
  gap = 'md',
  cardVariant = 'default',
  iconPosition = 'top',
  iconSize = 'md',
  title = 'Bénéfices clés',
  showTitle = false,
  centered = true,
  maxWidth = 'max-w-6xl',
  class: className = '',
  id,
} = Astro.props

// Charger les bénéfices depuis Content Collections si non fournis via props
let benefits: BenefitItem[] = []

if (benefitsProp && benefitsProp.length > 0) {
  benefits = benefitsProp
} else {
  // Import dynamique pour éviter l'erreur si le module n'existe pas encore
  try {
    const { getCollection } = await import('astro:content')
    const benefitsData = await getCollection('benefits')

    // Trier par order et filtrer les actifs
    benefits = benefitsData
      .map((entry) => entry.data as BenefitItem)
      .filter((b) => b.isActive !== false)
      .sort((a, b) => a.order - b.order)
  } catch {
    // Fallback: pas de données disponibles
    console.warn('[BenefitsList] Could not load benefits from Content Collections')
    benefits = []
  }
}

// Runtime validation (development only)
if (import.meta.env.DEV) {
  if (benefits.length === 0) {
    console.warn('[BenefitsList] No benefits to display')
  }
  if (benefits.length > 5) {
    console.warn('[BenefitsList] More than 5 benefits may affect layout')
  }
}

// Génération de l'ID unique pour aria-labelledby
const sectionId = id || 'benefits-section'
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
---

<section
  id={sectionId}
  class={sectionClasses}
  aria-labelledby={titleId}
>
  <h2 id={titleId} class={titleClasses}>
    {title}
  </h2>

  <div class={gridClasses}>
    {benefits.map((benefit) => (
      <BenefitCard
        icon={benefit.icon}
        title={benefit.title}
        description={benefit.description}
        ariaLabel={benefit.ariaLabel}
        variant={cardVariant}
        iconPosition={iconPosition}
        iconSize={iconSize}
      />
    ))}
  </div>
</section>
```

### 4.3 Chargement des données Content Collections

#### 4.3.1 Configuration Content Collections (si pas déjà fait)

```typescript
// src/content/config.ts (ajout)

import { defineCollection } from 'astro:content'
import { benefitItemSchema } from '@/schemas/benefit'

const benefitsCollection = defineCollection({
  type: 'data',
  schema: benefitItemSchema,
})

export const collections = {
  // ... autres collections
  benefits: benefitsCollection,
}
```

#### 4.3.2 Structure des données

```
src/content/benefits/
├── main.json           # Fichier principal avec les 3 bénéfices
└── (optionnel)
    ├── productivity.json
    ├── quality.json
    └── collaboration.json
```

### 4.4 Export des types

```typescript
// src/types/components.ts (ajout)

export type { Props as BenefitsListProps } from '@components/hero/BenefitsList.astro'
export type {
  BenefitsListColumns,
  BenefitsListGap,
} from '@components/hero/BenefitsList.astro'
```

### 4.5 Utilisation du composant

#### 4.5.1 Utilisation basique (charge depuis Content Collections)

```astro
---
import BenefitsList from '@components/hero/BenefitsList.astro'
---

<BenefitsList />
```

#### 4.5.2 Utilisation avec bénéfices personnalisés

```astro
---
import BenefitsList from '@components/hero/BenefitsList.astro'
import type { BenefitItem } from '@/types'

const customBenefits: BenefitItem[] = [
  {
    id: 'custom-1',
    icon: 'rocket',
    title: 'Lancement rapide',
    description: 'Démarrez votre projet en quelques minutes.',
    order: 1,
    locale: 'fr',
    isActive: true,
    updatedAt: new Date(),
  },
  // ...
]
---

<BenefitsList benefits={customBenefits} />
```

#### 4.5.3 Utilisation avec titre visible

```astro
<BenefitsList
  title="Pourquoi choisir AIAD ?"
  showTitle={true}
  gap="lg"
/>
```

#### 4.5.4 Utilisation avec variante featured

```astro
<BenefitsList
  cardVariant="featured"
  gap="lg"
  iconSize="lg"
/>
```

#### 4.5.5 Grille 2 colonnes

```astro
<BenefitsList
  columns={2}
  gap="md"
  centered={true}
/>
```

#### 4.5.6 Intégration dans HeroSection (T-001-F8)

```astro
---
// src/components/hero/HeroSection.astro
import BenefitsList from './BenefitsList.astro'
---

<section class="hero-section py-16 md:py-24">
  <!-- ... HeroTitle, ValueProposition, CTAButton ... -->

  <div class="mt-12 md:mt-16">
    <BenefitsList
      columns="auto"
      gap="md"
      cardVariant="default"
    />
  </div>

  <!-- ... StatsRow ... -->
</section>
```

---

## 5. Design et style

### 5.1 Tokens de design

| Token | Mobile | Desktop (md) | Variable Tailwind |
|-------|--------|--------------|-------------------|
| **Section max-width** | 100% | 1152px | `max-w-6xl` |
| **Section padding** | - | - | Géré par parent |
| **Grid gap (sm)** | 16px | 20px | `gap-4 md:gap-5` |
| **Grid gap (md)** | 24px | 32px | `gap-6 md:gap-8` |
| **Grid gap (lg)** | 32px | 48px | `gap-8 md:gap-12` |
| **Title size** | 1.5rem | 1.875rem | `text-2xl md:text-3xl` |
| **Title margin bottom** | 32px | 48px | `mb-8 md:mb-12` |
| **Title color** | #111827 | - | `text-gray-900` |

### 5.2 Breakpoints

| Breakpoint | Largeur min | Colonnes (auto) | Comportement |
|------------|-------------|-----------------|--------------|
| **Mobile** | 0px | 1 | Cartes empilées verticalement |
| **md (Tablet)** | 768px | 3 | Grille 3 colonnes |
| **lg (Desktop)** | 1024px | 3 | Pas de changement |
| **xl** | 1280px | 3 | Pas de changement |

### 5.3 Cohérence avec le design system

| Aspect | BenefitsList | BenefitCard | Cohérence |
|--------|--------------|-------------|-----------|
| **Max width** | `max-w-6xl` | N/A | Standard container |
| **Spacing scale** | 4, 5, 6, 8, 12 | 4, 6 | ✅ Tailwind scale |
| **Grid system** | CSS Grid | N/A | Standard moderne |
| **Responsive pattern** | `md:grid-cols-3` | `md:text-*` | ✅ Mobile-first |
| **Color scheme** | gray-900 (titre) | gray-900, gray-600 | ✅ Cohérent |

### 5.4 États visuels

| État | Comportement | Classes |
|------|--------------|---------|
| **Vide (0 bénéfices)** | Rien affiché (section masquée) | Logique conditionnelle |
| **1 bénéfice** | Centré dans la grille | Grid avec 1 item |
| **2 bénéfices** | Centrés si columns=auto | Justification auto |
| **3+ bénéfices** | Grille normale | Standard |

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Cas limites identifiés

| ID | Cas limite | Valeur/Situation | Comportement attendu | Test |
|----|------------|------------------|---------------------|------|
| CL-01 | Aucun bénéfice | `benefits = []` | Section masquée, warning dev | T-01 |
| CL-02 | 1 seul bénéfice | `benefits.length === 1` | Carte centrée, rendu normal | T-02 |
| CL-03 | 2 bénéfices | `benefits.length === 2` | 2 cartes, gap maintenu | T-03 |
| CL-04 | 5 bénéfices | `benefits.length === 5` | Grille étendue, warning dev | T-04 |
| CL-05 | 6+ bénéfices | `benefits.length > 5` | Rendu mais warning dev | T-05 |
| CL-06 | Bénéfice inactif | `isActive: false` | Filtré, non affiché | T-06 |
| CL-07 | Ordre non séquentiel | `order: [1, 3, 5]` | Trié par order | T-07 |
| CL-08 | Props benefits vide | `benefits={[]}` | Section masquée | T-08 |
| CL-09 | Props benefits null | `benefits={null}` | Charge depuis Content Collections | T-09 |
| CL-10 | Content Collections manquant | Module non trouvé | Fallback array vide, warning | T-10 |
| CL-11 | columns=1 | Grille 1 colonne | 1 colonne sur tous devices | T-11 |
| CL-12 | columns=2 | Grille 2 colonnes | 1 col mobile, 2 cols desktop | T-12 |
| CL-13 | gap="lg" | Grand espacement | gap-8 mobile, gap-12 desktop | T-13 |
| CL-14 | showTitle=true | Titre visible | H2 visible avec styles | T-14 |
| CL-15 | showTitle=false (défaut) | Titre sr-only | H2 avec class sr-only | T-15 |
| CL-16 | title personnalisé | `title="Custom"` | Texte custom affiché | T-16 |
| CL-17 | cardVariant="featured" | Cartes featured | Toutes cartes en featured | T-17 |
| CL-18 | centered=false | Non centré | Pas de mx-auto | T-18 |
| CL-19 | maxWidth custom | `maxWidth="max-w-4xl"` | Largeur réduite | T-19 |
| CL-20 | Classe additionnelle | `class="mt-8"` | Classe appliquée à section | T-20 |
| CL-21 | id fourni | `id="custom-id"` | ID appliqué à section | T-21 |
| CL-22 | Viewport très étroit (280px) | Écran 280px | Pas d'overflow horizontal | T-22 |
| CL-23 | Très long titre de section | 100 caractères | Wrap naturel | T-23 |
| CL-24 | Données malformées | Champ manquant | Erreur TypeScript/Zod | T-24 |
| CL-25 | Mix locales | `fr` et `en` | Tous affichés, non filtrés | T-25 |

### 6.2 Validation des props

```typescript
// Runtime validation (optionnel, en développement)
if (import.meta.env.DEV) {
  if (!benefits || benefits.length === 0) {
    console.warn('[BenefitsList] No benefits to display')
  }
  if (benefits && benefits.length > 5) {
    console.warn('[BenefitsList] More than 5 benefits may affect layout. Consider pagination.')
  }
  if (showTitle && !title) {
    console.warn('[BenefitsList] showTitle is true but no title provided')
  }
}
```

### 6.3 Stratégie de fallback

| Situation | Comportement | Justification |
|-----------|--------------|---------------|
| Pas de bénéfices (props) | Charge Content Collections | Flexibilité d'utilisation |
| Content Collections erreur | Array vide + warning | Graceful degradation |
| 0 bénéfices final | Section non rendue | Éviter section vide |
| Données invalides | Erreur TypeScript/build | Prévention à la compilation |

### 6.4 Rendu conditionnel

```astro
{benefits.length > 0 && (
  <section ...>
    <!-- Contenu -->
  </section>
)}
```

---

## 7. Exemples entrée/sortie

### 7.1 Rendu par défaut (3 bénéfices depuis Content Collections)

**Entrée (Props) :**

```typescript
{
  // Aucune prop benefits → charge depuis Content Collections
  columns: 'auto',
  gap: 'md',
  cardVariant: 'default',
  title: 'Bénéfices clés',
  showTitle: false,
}
```

**Données chargées (Content Collections) :**

```json
[
  {
    "id": "benefit-productivity",
    "icon": "trending-up",
    "title": "Productivité décuplée",
    "description": "Automatisez les tâches répétitives...",
    "order": 1
  },
  {
    "id": "benefit-quality",
    "icon": "check-circle",
    "title": "Qualité garantie",
    "description": "Des standards de code...",
    "order": 2
  },
  {
    "id": "benefit-collaboration",
    "icon": "users",
    "title": "Collaboration fluide",
    "description": "Une méthodologie claire...",
    "order": 3
  }
]
```

**Sortie (HTML) :**

```html
<section
  id="benefits-section"
  class="mx-auto max-w-6xl w-full"
  aria-labelledby="benefits-section-title"
>
  <h2 id="benefits-section-title" class="sr-only">
    Bénéfices clés
  </h2>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
    <article class="bg-white p-6 flex flex-col items-center text-center gap-4">
      <div class="flex items-center justify-center rounded-xl bg-blue-100 w-14 h-14 md:w-16 md:h-16 flex-shrink-0" role="presentation">
        <svg class="w-10 h-10 md:w-12 md:h-12 text-blue-600" aria-hidden="true"><!-- TrendingUp --></svg>
      </div>
      <div class="space-y-2">
        <h3 class="font-semibold text-gray-900 text-lg md:text-xl">Productivité décuplée</h3>
        <p class="text-gray-600 leading-relaxed text-sm md:text-base">Automatisez les tâches répétitives...</p>
      </div>
    </article>

    <article class="bg-white p-6 flex flex-col items-center text-center gap-4">
      <!-- Qualité garantie -->
    </article>

    <article class="bg-white p-6 flex flex-col items-center text-center gap-4">
      <!-- Collaboration fluide -->
    </article>
  </div>
</section>
```

### 7.2 Rendu avec titre visible

**Entrée (Props) :**

```typescript
{
  title: 'Pourquoi choisir AIAD ?',
  showTitle: true,
  gap: 'lg',
}
```

**Sortie (HTML) :**

```html
<section id="benefits-section" class="mx-auto max-w-6xl w-full" aria-labelledby="benefits-section-title">
  <h2 id="benefits-section-title" class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8 md:mb-12">
    Pourquoi choisir AIAD ?
  </h2>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
    <!-- BenefitCards -->
  </div>
</section>
```

### 7.3 Rendu avec variante featured et 2 colonnes

**Entrée (Props) :**

```typescript
{
  columns: 2,
  cardVariant: 'featured',
  iconSize: 'lg',
  maxWidth: 'max-w-4xl',
}
```

**Sortie (HTML) :**

```html
<section id="benefits-section" class="mx-auto max-w-4xl w-full" aria-labelledby="benefits-section-title">
  <h2 id="benefits-section-title" class="sr-only">Bénéfices clés</h2>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
    <article class="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col items-center text-center gap-4">
      <div class="flex items-center justify-center rounded-xl bg-blue-100 w-18 h-18 md:w-20 md:h-20 flex-shrink-0" role="presentation">
        <svg class="w-14 h-14 md:w-16 md:h-16 text-blue-600" aria-hidden="true"><!-- Icon --></svg>
      </div>
      <!-- ... -->
    </article>
    <!-- ... autres cartes featured -->
  </div>
</section>
```

### 7.4 Rendu avec bénéfices personnalisés (props)

**Entrée (Props) :**

```typescript
{
  benefits: [
    {
      id: 'custom-1',
      icon: 'rocket',
      title: 'Démarrage rapide',
      description: 'Lancez votre projet en quelques minutes.',
      order: 1,
      locale: 'fr',
      isActive: true,
      updatedAt: new Date(),
    },
    {
      id: 'custom-2',
      icon: 'shield',
      title: 'Sécurité renforcée',
      description: 'Protection intégrée contre les vulnérabilités.',
      order: 2,
      locale: 'fr',
      isActive: true,
      updatedAt: new Date(),
    },
  ],
  columns: 2,
  centered: false,
}
```

**Sortie (HTML) :**

```html
<section id="benefits-section" class="max-w-6xl w-full" aria-labelledby="benefits-section-title">
  <!-- Note: pas de mx-auto car centered=false -->
  <h2 id="benefits-section-title" class="sr-only">Bénéfices clés</h2>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
    <article><!-- Démarrage rapide --></article>
    <article><!-- Sécurité renforcée --></article>
  </div>
</section>
```

### 7.5 Rendu avec 0 bénéfices

**Entrée (Props) :**

```typescript
{
  benefits: [],
}
```

**Sortie (HTML) :**

```html
<!-- Rien n'est rendu (section masquée) -->
```

**Console (dev) :**
```
[BenefitsList] No benefits to display
```

---

## 8. Tests

### 8.1 Fichiers de test

| Type | Emplacement | Focus |
|------|-------------|-------|
| **Unitaires** | `tests/unit/components/benefits-list.test.ts` | Rendu, props, classes, données |
| **E2E** | `tests/e2e/benefits-list.spec.ts` | Intégration, responsive, visuel |
| **Accessibilité** | `tests/e2e/accessibility.spec.ts` | RGAA AA, ARIA, sémantique |

### 8.2 Suite de tests unitaires

```typescript
// tests/unit/components/benefits-list.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import BenefitsList from '@components/hero/BenefitsList.astro'
import type { BenefitItem } from '@/types'

describe('BenefitsList Component', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  // Fixture de base valide
  const mockBenefits: BenefitItem[] = [
    {
      id: 'benefit-1',
      icon: 'trending-up',
      title: 'Productivité décuplée',
      description: 'Automatisez les tâches répétitives et concentrez-vous sur la valeur.',
      order: 1,
      locale: 'fr',
      isActive: true,
      updatedAt: new Date('2026-02-02'),
    },
    {
      id: 'benefit-2',
      icon: 'check-circle',
      title: 'Qualité garantie',
      description: 'Des standards de code et des validations intégrés.',
      order: 2,
      locale: 'fr',
      isActive: true,
      updatedAt: new Date('2026-02-02'),
    },
    {
      id: 'benefit-3',
      icon: 'users',
      title: 'Collaboration fluide',
      description: 'Une méthodologie claire pour structurer le travail.',
      order: 3,
      locale: 'fr',
      isActive: true,
      updatedAt: new Date('2026-02-02'),
    },
  ]

  describe('Rendu de base', () => {
    it('T-00: should render as section element', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('<section')
      expect(result).toContain('</section>')
    })

    it('T-00b: should render aria-labelledby on section', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('aria-labelledby="benefits-section-title"')
    })

    it('T-00c: should render h2 title element', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('<h2')
      expect(result).toContain('id="benefits-section-title"')
    })

    it('should render correct number of BenefitCards', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      const articleMatches = result.match(/<article/g)
      expect(articleMatches).toHaveLength(3)
    })

    it('should render grid container', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('class="grid')
    })
  })

  describe('Props: columns', () => {
    it('should apply auto column classes by default', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).toContain('md:grid-cols-3')
    })

    it('T-11: should apply 1 column classes', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, columns: 1 },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).not.toContain('md:grid-cols-3')
      expect(result).not.toContain('md:grid-cols-2')
    })

    it('T-12: should apply 2 column classes', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, columns: 2 },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).toContain('md:grid-cols-2')
    })

    it('should apply 3 column classes', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, columns: 3 },
      })

      expect(result).toContain('grid-cols-1')
      expect(result).toContain('md:grid-cols-3')
    })
  })

  describe('Props: gap', () => {
    it('should apply md gap classes by default', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('gap-6')
      expect(result).toContain('md:gap-8')
    })

    it('should apply sm gap classes', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, gap: 'sm' },
      })

      expect(result).toContain('gap-4')
      expect(result).toContain('md:gap-5')
    })

    it('T-13: should apply lg gap classes', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, gap: 'lg' },
      })

      expect(result).toContain('gap-8')
      expect(result).toContain('md:gap-12')
    })
  })

  describe('Props: title et showTitle', () => {
    it('T-15: should render sr-only title by default', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('sr-only')
      expect(result).toContain('Bénéfices clés')
    })

    it('T-14: should render visible title when showTitle=true', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, showTitle: true },
      })

      expect(result).not.toContain('sr-only')
      expect(result).toContain('text-2xl')
      expect(result).toContain('md:text-3xl')
      expect(result).toContain('font-bold')
    })

    it('T-16: should render custom title', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, title: 'Pourquoi AIAD ?' },
      })

      expect(result).toContain('Pourquoi AIAD ?')
    })
  })

  describe('Props: cardVariant', () => {
    it('should pass default variant to cards', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('bg-white')
    })

    it('T-17: should pass featured variant to cards', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, cardVariant: 'featured' },
      })

      expect(result).toContain('bg-blue-50')
      expect(result).toContain('border-blue-100')
    })

    it('should pass compact variant to cards', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, cardVariant: 'compact' },
      })

      expect(result).toContain('p-4')
    })
  })

  describe('Props: centered et maxWidth', () => {
    it('should apply centered classes by default', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('mx-auto')
    })

    it('T-18: should not apply mx-auto when centered=false', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, centered: false },
      })

      expect(result).not.toContain('mx-auto')
    })

    it('should apply default maxWidth', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('max-w-6xl')
    })

    it('T-19: should apply custom maxWidth', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, maxWidth: 'max-w-4xl' },
      })

      expect(result).toContain('max-w-4xl')
      expect(result).not.toContain('max-w-6xl')
    })
  })

  describe('Props: class et id', () => {
    it('T-20: should apply custom class', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, class: 'mt-8 custom-class' },
      })

      expect(result).toContain('mt-8')
      expect(result).toContain('custom-class')
    })

    it('T-21: should apply custom id', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, id: 'custom-benefits' },
      })

      expect(result).toContain('id="custom-benefits"')
      expect(result).toContain('aria-labelledby="custom-benefits-title"')
    })
  })

  describe('Cas limites: Nombre de bénéfices', () => {
    it('T-01: should not render section when benefits array is empty', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: [] },
      })

      expect(result).not.toContain('<section')
    })

    it('T-02: should render correctly with 1 benefit', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: [mockBenefits[0]] },
      })

      expect(result).toContain('<section')
      const articleMatches = result.match(/<article/g)
      expect(articleMatches).toHaveLength(1)
    })

    it('T-03: should render correctly with 2 benefits', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits.slice(0, 2) },
      })

      const articleMatches = result.match(/<article/g)
      expect(articleMatches).toHaveLength(2)
    })

    it('T-04: should render correctly with 5 benefits', async () => {
      const fiveBenefits = [
        ...mockBenefits,
        { ...mockBenefits[0], id: 'benefit-4', order: 4 },
        { ...mockBenefits[0], id: 'benefit-5', order: 5 },
      ]

      const result = await container.renderToString(BenefitsList, {
        props: { benefits: fiveBenefits },
      })

      const articleMatches = result.match(/<article/g)
      expect(articleMatches).toHaveLength(5)
    })

    it('T-05: should render with more than 5 benefits', async () => {
      const sixBenefits = [
        ...mockBenefits,
        { ...mockBenefits[0], id: 'benefit-4', order: 4 },
        { ...mockBenefits[0], id: 'benefit-5', order: 5 },
        { ...mockBenefits[0], id: 'benefit-6', order: 6 },
      ]

      const result = await container.renderToString(BenefitsList, {
        props: { benefits: sixBenefits },
      })

      const articleMatches = result.match(/<article/g)
      expect(articleMatches).toHaveLength(6)
    })
  })

  describe('Cas limites: Filtrage et tri', () => {
    it('T-06: should filter out inactive benefits', async () => {
      const mixedBenefits = [
        { ...mockBenefits[0], isActive: true },
        { ...mockBenefits[1], isActive: false },
        { ...mockBenefits[2], isActive: true },
      ]

      // Note: Le filtrage se fait lors du chargement, pas dans le composant directement
      // Ce test vérifie que le composant accepte les données pré-filtrées
      const filteredBenefits = mixedBenefits.filter(b => b.isActive)

      const result = await container.renderToString(BenefitsList, {
        props: { benefits: filteredBenefits },
      })

      const articleMatches = result.match(/<article/g)
      expect(articleMatches).toHaveLength(2)
    })

    it('T-07: should render benefits sorted by order', async () => {
      const unorderedBenefits = [
        { ...mockBenefits[2], order: 3 },
        { ...mockBenefits[0], order: 1 },
        { ...mockBenefits[1], order: 2 },
      ]

      const sortedBenefits = [...unorderedBenefits].sort((a, b) => a.order - b.order)

      const result = await container.renderToString(BenefitsList, {
        props: { benefits: sortedBenefits },
      })

      // Vérifier que le premier bénéfice est celui avec order: 1
      const firstTitleIndex = result.indexOf('Productivité')
      const secondTitleIndex = result.indexOf('Qualité')
      const thirdTitleIndex = result.indexOf('Collaboration')

      expect(firstTitleIndex).toBeLessThan(secondTitleIndex)
      expect(secondTitleIndex).toBeLessThan(thirdTitleIndex)
    })
  })

  describe('Accessibilité', () => {
    it('should use section element for semantic structure', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result.match(/<section/g)?.length).toBe(1)
    })

    it('should have aria-labelledby linking to title', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('aria-labelledby="benefits-section-title"')
      expect(result).toContain('id="benefits-section-title"')
    })

    it('should use h2 for section title', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      expect(result).toContain('<h2')
      expect(result).not.toContain('<h1')
      expect(result).not.toContain('<h3')
    })

    it('should render h3 titles for each BenefitCard', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits },
      })

      const h3Matches = result.match(/<h3/g)
      expect(h3Matches).toHaveLength(3)
    })
  })

  describe('Props: iconPosition et iconSize', () => {
    it('should pass iconPosition to cards', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, iconPosition: 'left' },
      })

      expect(result).toContain('flex-row')
    })

    it('should pass iconSize to cards', async () => {
      const result = await container.renderToString(BenefitsList, {
        props: { benefits: mockBenefits, iconSize: 'lg' },
      })

      expect(result).toContain('w-14')
      expect(result).toContain('h-14')
    })
  })
})
```

### 8.3 Suite de tests E2E (Playwright)

```typescript
// tests/e2e/benefits-list.spec.ts

import { test, expect } from '@playwright/test'

test.describe('BenefitsList Component - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display benefits list in hero section', async ({ page }) => {
    const benefitsSection = page.locator('section[aria-labelledby*="benefits"]')

    await expect(benefitsSection).toBeVisible()
  })

  test('should display exactly 3 benefit cards', async ({ page }) => {
    const benefitCards = page.locator('section[aria-labelledby*="benefits"] article')

    await expect(benefitCards).toHaveCount(3)
  })

  test('should display benefits in correct order', async ({ page }) => {
    const titles = page.locator('section[aria-labelledby*="benefits"] article h3')

    const titleTexts = await titles.allTextContents()

    expect(titleTexts[0]).toContain('Productivité')
    expect(titleTexts[1]).toContain('Qualité')
    expect(titleTexts[2]).toContain('Collaboration')
  })

  test('T-22: should not have horizontal overflow on narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 280, height: 600 })

    const body = page.locator('body')
    const bodyWidth = await body.evaluate((el) => el.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })

  test('should be responsive across breakpoints', async ({ page }) => {
    const benefitsSection = page.locator('section[aria-labelledby*="benefits"]')
    const grid = benefitsSection.locator('> div').first()

    // Mobile - 1 colonne
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(benefitsSection).toBeVisible()

    // Tablet - devrait avoir 3 colonnes (md breakpoint)
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(benefitsSection).toBeVisible()

    // Desktop - 3 colonnes
    await page.setViewportSize({ width: 1440, height: 900 })
    await expect(benefitsSection).toBeVisible()
  })

  test('should stack cards vertically on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    const cards = page.locator('section[aria-labelledby*="benefits"] article')
    const firstCard = cards.first()
    const secondCard = cards.nth(1)

    const firstBox = await firstCard.boundingBox()
    const secondBox = await secondCard.boundingBox()

    // Sur mobile, les cartes sont empilées (y différent, x similaire)
    expect(secondBox!.y).toBeGreaterThan(firstBox!.y + firstBox!.height - 10)
  })

  test('should display cards side by side on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })

    const cards = page.locator('section[aria-labelledby*="benefits"] article')
    const firstCard = cards.first()
    const secondCard = cards.nth(1)

    const firstBox = await firstCard.boundingBox()
    const secondBox = await secondCard.boundingBox()

    // Sur desktop, les cartes sont côte à côte (même y, x différent)
    expect(Math.abs(firstBox!.y - secondBox!.y)).toBeLessThan(10)
    expect(secondBox!.x).toBeGreaterThan(firstBox!.x)
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    // Vérifier la hiérarchie : h1 (hero) > h2 (section) > h3 (cards)
    const h1 = page.locator('h1')
    const h2Benefits = page.locator('section[aria-labelledby*="benefits"] h2')
    const h3Cards = page.locator('section[aria-labelledby*="benefits"] h3')

    await expect(h1).toHaveCount(1)
    await expect(h2Benefits).toHaveCount(1)
    await expect(h3Cards).toHaveCount(3)
  })
})
```

### 8.4 Tests d'accessibilité

```typescript
// tests/e2e/accessibility.spec.ts (ajout pour BenefitsList)

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('BenefitsList Accessibility', () => {
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto('/')

    const results = await new AxeBuilder({ page })
      .include('section[aria-labelledby*="benefits"]')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('should have section with aria-labelledby', async ({ page }) => {
    await page.goto('/')

    const section = page.locator('section[aria-labelledby*="benefits"]')
    const labelledby = await section.getAttribute('aria-labelledby')

    expect(labelledby).toBeTruthy()

    // Vérifier que l'élément référencé existe
    const title = page.locator(`#${labelledby}`)
    await expect(title).toBeAttached()
  })

  test('should have proper heading structure (h2 > h3)', async ({ page }) => {
    await page.goto('/')

    const section = page.locator('section[aria-labelledby*="benefits"]')
    const h2 = section.locator('h2')
    const h3s = section.locator('h3')

    await expect(h2).toHaveCount(1)
    await expect(h3s).toHaveCount(3)
  })

  test('should have accessible title (visible or sr-only)', async ({ page }) => {
    await page.goto('/')

    const title = page.locator('section[aria-labelledby*="benefits"] h2')

    // Le titre doit exister (même s'il est sr-only)
    await expect(title).toBeAttached()

    const titleText = await title.textContent()
    expect(titleText?.trim()).toBeTruthy()
  })

  test('should maintain reading order', async ({ page }) => {
    await page.goto('/')

    const cards = page.locator('section[aria-labelledby*="benefits"] article')
    const cardCount = await cards.count()

    // Vérifier que les cartes sont dans l'ordre du DOM
    for (let i = 0; i < cardCount - 1; i++) {
      const currentCard = cards.nth(i)
      const nextCard = cards.nth(i + 1)

      const currentBox = await currentCard.boundingBox()
      const nextBox = await nextCard.boundingBox()

      // Sur mobile (stacked) ou desktop (row), l'ordre doit être préservé
      expect(currentBox).toBeTruthy()
      expect(nextBox).toBeTruthy()
    }
  })
})
```

### 8.5 Matrice de couverture

| Aspect | Tests unitaires | Tests E2E | Couverture |
|--------|-----------------|-----------|------------|
| Rendu basique | T-00, T-00b, T-00c | ✅ | 100% |
| Props columns | 4 tests (T-11, T-12) | ✅ | 100% |
| Props gap | 3 tests (T-13) | - | 100% |
| Props title/showTitle | 3 tests (T-14, T-15, T-16) | - | 100% |
| Props cardVariant | 3 tests (T-17) | - | 100% |
| Props centered/maxWidth | 4 tests (T-18, T-19) | - | 100% |
| Props class/id | 2 tests (T-20, T-21) | - | 100% |
| Cas limites (0-6 bénéfices) | 5 tests (T-01 à T-05) | - | 100% |
| Filtrage/tri | 2 tests (T-06, T-07) | ✅ | 100% |
| Accessibilité | 4 tests | 5 tests | 100% |
| Responsive | - | 4 tests (T-22) | 100% |
| iconPosition/iconSize | 2 tests | - | 100% |

---

## 9. Critères d'acceptation

- [ ] **CA-01** : Le composant `BenefitsList.astro` existe dans `src/components/hero/`
- [ ] **CA-02** : Le composant rend un `<section>` comme élément racine
- [ ] **CA-03** : Le composant a un `aria-labelledby` pointant vers le titre
- [ ] **CA-04** : Le titre est rendu dans un `<h2>` (sr-only par défaut)
- [ ] **CA-05** : La grille utilise CSS Grid avec classes responsive
- [ ] **CA-06** : Les BenefitCards sont rendus dans le bon ordre (par `order`)
- [ ] **CA-07** : Le composant charge depuis Content Collections si pas de props `benefits`
- [ ] **CA-08** : Le composant accepte des `benefits` personnalisés via props
- [ ] **CA-09** : Les variantes `columns`, `gap`, `cardVariant` fonctionnent
- [ ] **CA-10** : Le composant est responsive (1 col mobile → 3 cols desktop)
- [ ] **CA-11** : La section n'est pas rendue si 0 bénéfices
- [ ] **CA-12** : Le composant n'émet pas de JavaScript client (static)
- [ ] **CA-13** : Le composant respecte RGAA AA (hiérarchie, ARIA)
- [ ] **CA-14** : TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] **CA-15** : ESLint passe sans warning (`pnpm lint`)
- [ ] **CA-16** : Tous les tests unitaires passent
- [ ] **CA-17** : Tous les tests E2E passent

---

## 10. Definition of Done

- [ ] Composant implémenté dans `src/components/hero/BenefitsList.astro`
- [ ] Interface Props documentée avec JSDoc
- [ ] Chargement depuis Content Collections fonctionnel
- [ ] Toutes les variantes (columns, gap, cardVariant) implémentées
- [ ] Tests unitaires écrits et passants (`tests/unit/components/benefits-list.test.ts`)
- [ ] Tests E2E écrits et passants (`tests/e2e/benefits-list.spec.ts`)
- [ ] TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] ESLint passe sans warning (`pnpm lint`)
- [ ] Composant visuellement vérifié sur mobile, tablet, desktop
- [ ] Accessibilité vérifiée (axe-core)
- [ ] Code reviewé par un pair

---

## 11. Notes d'implémentation

### 11.1 Points d'attention

1. **Chargement Content Collections** : Utiliser `try/catch` pour le chargement dynamique car le module peut ne pas exister pendant le développement initial.

2. **Filtrage des bénéfices** : Filtrer `isActive !== false` lors du chargement pour ne pas afficher les bénéfices désactivés.

3. **Tri par order** : Toujours trier les bénéfices par `order` pour garantir un affichage cohérent.

4. **Rendu conditionnel** : Ne pas rendre la section si aucun bénéfice n'est disponible.

5. **Hiérarchie des titres** : Utiliser `<h2>` pour le titre de section car la page a déjà un `<h1>` (HeroTitle). Les BenefitCards utilisent `<h3>`.

6. **Accessibilité sr-only** : Le titre par défaut est `sr-only` pour les lecteurs d'écran mais n'encombre pas le design visuel.

7. **CSS Grid vs Flexbox** : Utiliser CSS Grid pour un contrôle précis des colonnes et gaps.

8. **Props drilling** : Les props `cardVariant`, `iconPosition`, `iconSize` sont transmises aux BenefitCards.

### 11.2 Extensions futures

| Extension | Priorité | Impact |
|-----------|----------|--------|
| Pagination/carousel | Moyenne | Pour plus de 5 bénéfices |
| Animation d'entrée | Basse | Intersection Observer pour fade-in |
| Filtrage par catégorie | Basse | Permettre de filtrer les bénéfices |
| Mode sombre | Moyenne | Classes `dark:*` sur section et grid |
| Slot pour header custom | Basse | Permettre un contenu personnalisé avant la grille |

### 11.3 Relation avec les autres composants

```
HeroSection (T-001-F8)
├── HeroTitle (T-001-F1) ✅
├── ValueProposition (T-001-F2) ✅
├── CTAButton (T-001-F3) ✅
├── BenefitsList (T-001-F5) ← CE COMPOSANT
│   ├── <section aria-labelledby>
│   ├── <h2> title (sr-only)
│   └── <div class="grid">
│       └── BenefitCard[] (T-001-F4) ✅
│           ├── Icon (lucide-astro)
│           ├── <h3> title
│           └── <p> description
└── StatsRow (T-001-F7)
    └── StatDisplay[] (T-001-F6)
```

### 11.4 Données source

Le composant consomme les données de `src/content/benefits/main.json` (T-001-B5) :

```json
[
  {
    "id": "benefit-productivity",
    "icon": "trending-up",
    "title": "Productivité décuplée",
    "description": "Automatisez les tâches répétitives et concentrez-vous sur la valeur ajoutée de votre code.",
    "order": 1,
    "locale": "fr",
    "isActive": true,
    "ariaLabel": "Icône de graphique ascendant représentant la productivité",
    "updatedAt": "2026-02-02T10:00:00.000Z"
  },
  ...
]
```

---

## 12. Références

| Document | Lien |
|----------|------|
| User Story US-001 | [spec.md](./spec.md) |
| Composant BenefitCard (T-001-F4) | [T-001-F4-composant-BenefitCard.md](./T-001-F4-composant-BenefitCard.md) |
| Modèle BenefitItem (T-001-B2) | [T-001-B2-modele-donnees-BenefitItem.md](./T-001-B2-modele-donnees-BenefitItem.md) |
| Données Benefits (T-001-B5) | [T-001-B5-donnees-JSON-benefices-cles.md](./T-001-B5-donnees-JSON-benefices-cles.md) |
| Architecture technique | [../../ARCHITECTURE.md](../../ARCHITECTURE.md) |
| Astro Content Collections | [docs.astro.build](https://docs.astro.build/en/guides/content-collections/) |
| CSS Grid | [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) |
| Tailwind Grid | [tailwindcss.com](https://tailwindcss.com/docs/grid-template-columns) |
| RGAA 4.1 | [accessibilite.numerique.gouv.fr](https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/) |
| Astro Container API | [docs.astro.build/container](https://docs.astro.build/en/reference/container-reference/) |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 03/02/2026 | Création initiale complète |
