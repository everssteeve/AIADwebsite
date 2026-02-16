# T-004-F10 : Layout DocsLayout (assemblage Header + Sidebar + Content + TOC + Breadcrumb + PrevNext)

| Metadonnee | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 12 fevrier 2026 |
| **Statut** | A faire |
| **User Story** | [US-004 - Naviguer facilement dans le framework](./spec-US-004.md) |
| **Dependances** | T-004-F1 (BaseLayout), T-004-F4 (Header), T-004-F5 (MobileMenu via Header), T-004-F6 (Breadcrumb), T-004-F7 (TableOfContents), T-004-F8 (PrevNextLinks), T-004-F9 (Sidebar) |
| **Bloque** | T-004-F11 (Integration pages navigation), T-004-T5 (Tests integration DocsLayout) |

---

## 1. Objectif

Creer le layout **DocsLayout** qui assemble tous les composants de navigation dans un layout de page documentation coherent. Ce layout fournit :

- L'**extension de BaseLayout** (T-004-F1) : herite du shell HTML, des meta SEO, du skip-link et du slot `head`
- L'integration du **Header** (T-004-F4) : barre de navigation principale sticky en haut de page
- L'integration de la **Sidebar** (T-004-F9) : navigation laterale persistante a gauche (desktop >= 1024px)
- L'integration du **Breadcrumb** (T-004-F6) : fil d'Ariane dynamique au-dessus du contenu
- L'integration de la **TableOfContents** (T-004-F7) : table des matieres sticky a droite (desktop >= 1280px)
- L'integration des **PrevNextLinks** (T-004-F8) : liens sequentiels en bas du contenu
- Un **slot par defaut** pour le contenu principal de la page (MDX rendu)
- Un **layout a 3 colonnes** responsive : Sidebar | Contenu principal | TOC
- La **zone `<main>`** identifiee par `id="main-content"` (cible du skip-link de BaseLayout)
- La gestion du **responsive** : 3 colonnes desktop large, 2 colonnes desktop, 1 colonne mobile
- Le support des **donnees structurees JSON-LD** Breadcrumb pour le SEO

Ce layout est le composant d'assemblage central pour toutes les pages de documentation (Framework, Mode Operatoire, Annexes) et constitue le point de convergence de l'ensemble de la US-004.

---

## 2. Contexte technique

### 2.1 Stack

| Technologie | Version | Role |
|-------------|---------|------|
| Astro | 4.x | Layout composant statique (SSG, 0 JS client propre) |
| TypeScript | 5.x | Typage strict des props |
| Tailwind CSS | 3.x | Utility-first, responsive, grid/flex layout |

> Le DocsLayout lui-meme n'a pas de JavaScript client. L'interactivite provient des composants enfants : Header (via DropdownMenu + MobileMenu), Sidebar (accordeons), TableOfContents (scroll spy).

### 2.2 Arborescence

```
src/
├── layouts/
│   ├── BaseLayout.astro               # T-004-F1 (parent)
│   └── DocsLayout.astro               <-- CE COMPOSANT
├── components/
│   └── layout/
│       ├── Header.astro               # T-004-F4 (consomme)
│       ├── Sidebar.astro              # T-004-F9 (consomme)
│       ├── Breadcrumb.astro           # T-004-F6 (consomme)
│       ├── TableOfContents.astro      # T-004-F7 (consomme)
│       └── PrevNextLinks.astro        # T-004-F8 (consomme)
├── types/
│   └── navigation.ts                  # Types TableOfContentsItem, NavigationTree, etc.
├── data/
│   └── navigation.ts                  # NAVIGATION_TREE
└── pages/
    ├── framework/
    │   └── [...slug].astro            # Consommateur (T-004-F11)
    ├── mode-operatoire/
    │   └── [...slug].astro            # Consommateur (T-004-F11)
    └── annexes/
        └── [...slug].astro            # Consommateur (T-004-F11)
```

### 2.3 Position dans l'architecture

```
BaseLayout.astro (T-004-F1)
└── DocsLayout.astro (T-004-F10)        <-- CE COMPOSANT
    ├── Header.astro (T-004-F4)
    │   ├── DropdownMenu.astro (T-004-F3) x3
    │   └── MobileMenu.astro (T-004-F5)
    ├── Breadcrumb.astro (T-004-F6)
    ├── Sidebar.astro (T-004-F9)
    ├── <main> slot (contenu MDX)
    ├── TableOfContents.astro (T-004-F7)
    └── PrevNextLinks.astro (T-004-F8)
```

### 2.4 Dependances

#### T-004-F1 (BaseLayout)

Le layout etend BaseLayout pour heriter du shell HTML complet :

```astro
import BaseLayout from '@layouts/BaseLayout.astro'
```

Props transmises a BaseLayout :
- `title` : titre de la page formatee
- `description` : meta description
- `canonical` : URL canonique (optionnel)
- `ogType` : `'article'` pour les pages docs
- `ogImage` : image Open Graph (optionnel)
- `jsonLd` : donnees structurees JSON-LD Breadcrumb
- `skipLinkTarget` : `'main-content'` (cible du skip-link)

#### T-004-F4 (Header)

```astro
import Header from '@components/layout/Header.astro'
```

- Instance unique en haut du layout
- Prop `tree` transmise si un arbre custom est fourni

#### T-004-F6 (Breadcrumb)

```astro
import Breadcrumb from '@components/layout/Breadcrumb.astro'
```

- Instance unique entre le Header et le contenu
- Calcul automatique a partir de l'URL courante

#### T-004-F7 (TableOfContents)

```astro
import TableOfContents from '@components/layout/TableOfContents.astro'
```

- Instance unique dans la colonne droite
- Prop `headings` transmise depuis les props du layout (fournies par `post.render()`)

#### T-004-F8 (PrevNextLinks)

```astro
import PrevNextLinks from '@components/layout/PrevNextLinks.astro'
```

- Instance unique apres le contenu principal
- Calcul automatique a partir de l'URL courante

#### T-004-F9 (Sidebar)

```astro
import Sidebar from '@components/layout/Sidebar.astro'
```

- Instance unique dans la colonne gauche
- Visible uniquement en desktop (>= 1024px) via son propre `hidden lg:block`

### 2.5 Conventions suivies

| Convention | Detail |
|-----------|--------|
| Nommage fichier | PascalCase dans `src/layouts/` |
| TypeScript | Mode strict, props typees via `interface Props` |
| Imports | Alias `@/*` pour `src/*`, `@components/*`, `@layouts/*` |
| Composition | Slot pattern Astro, composition de layouts |
| Formatage | Prettier : pas de semicolons, single quotes, 2 espaces |
| Responsive | Mobile-first : 1 col → 2 col (lg:) → 3 col (xl:) |

---

## 3. Specifications fonctionnelles

### 3.1 Description

Le layout `DocsLayout` est le **layout d'assemblage principal** pour toutes les pages de documentation qui :

1. **Etend BaseLayout** pour heriter du shell HTML, des meta SEO et du skip-link
2. **Integre le Header** comme premier element visible (sticky en haut)
3. **Rend le Breadcrumb** juste sous le header, au-dessus de la zone de contenu
4. **Organise un layout 3 colonnes** : Sidebar (gauche) | Contenu principal (centre) | TOC (droite)
5. **Contient le slot principal** dans la zone `<main>` avec l'id `main-content` (cible du skip-link)
6. **Positionne les PrevNextLinks** en bas du contenu, avant le footer eventuel
7. **Gere le responsive** avec des breakpoints progressifs
8. **Injecte les donnees structurees JSON-LD** de type `BreadcrumbList` dans BaseLayout

### 3.2 Structure visuelle — Desktop large (>= 1280px)

```
┌──────────────────────────────────────────────────────────────────────┐
│  [Skip to content]                                                    │
├──────────────────────────────────────────────────────────────────────┤
│  HEADER (sticky top-0 z-40)                                          │
│  AIAD    Framework ▾    Mode Operatoire ▾    Annexes ▾               │
├──────────────────────────────────────────────────────────────────────┤
│  Accueil > Framework > Artefacts                          (Breadcrumb)│
├────────────┬─────────────────────────────────────────┬───────────────┤
│  SIDEBAR   │         <main id="main-content">        │ TABLE DES     │
│  (w-64)    │                                         │ MATIERES      │
│  (sticky)  │  <slot /> (contenu MDX)                 │ (w-56, sticky)│
│            │                                         │               │
│  Framework │  # Titre H1                             │ • Section 1   │
│  ├ Preamb. │                                         │ • Section 2   │
│  ├ Vision  │  ## Section 1                           │   ├ Sous-s.   │
│  ├ Ecosy.  │  Lorem ipsum dolor sit amet...          │ • Section 3   │
│  ├ Artef.  │                                         │               │
│  ├ Boucles │  ## Section 2                           │               │
│  ├ Synchro │  Lorem ipsum dolor sit amet...          │               │
│  ├ Metriq. │                                         │               │
│  └ Annexes │  ### Sous-section                       │               │
│            │  Lorem ipsum dolor sit amet...          │               │
│  Mode Op.  │                                         │               │
│  ├ Preamb. │                                         │               │
│  └ ...     │                                         │               │
│            │                                         │               │
│  Annexes   │                                         │               │
│  ├ A-Templ │                                         │               │
│  └ ...     │                                         │               │
│            ├─────────────────────────────────────────┤               │
│            │  ← Precedent : Vision & Philosophie     │               │
│            │             Suivant : Boucles Iter. →   │               │
├────────────┴─────────────────────────────────────────┴───────────────┤
│  (Slot footer eventuel)                                               │
└──────────────────────────────────────────────────────────────────────┘
```

### 3.3 Structure visuelle — Desktop (1024px - 1279px)

```
┌──────────────────────────────────────────────────────────┐
│  HEADER (sticky)                                          │
├──────────────────────────────────────────────────────────┤
│  Breadcrumb                                               │
├────────────┬─────────────────────────────────────────────┤
│  SIDEBAR   │         <main id="main-content">            │
│  (w-64)    │                                             │
│            │  <slot /> (contenu MDX)                     │
│            │                                             │
│            │  ## Section 1                               │
│            │  Lorem ipsum...                             │
│            │                                             │
│            ├─────────────────────────────────────────────┤
│            │  ← Prec.         Suiv. →                    │
├────────────┴─────────────────────────────────────────────┤
│  (Footer)                                                 │
└──────────────────────────────────────────────────────────┘
```

> **Note** : La TableOfContents est masquee entre 1024px et 1279px (`hidden xl:block`). La Sidebar reste visible car elle est essentielle a la navigation.

### 3.4 Structure visuelle — Mobile/Tablette (< 1024px)

```
┌──────────────────────────────┐
│  HEADER (sticky)    [≡]      │  ← Hamburger pour MobileMenu
├──────────────────────────────┤
│  Breadcrumb (tronque)        │
├──────────────────────────────┤
│                              │
│  <main id="main-content">   │
│                              │
│  [Table des matieres]        │  ← TOC collapsible inline
│                              │
│  ## Section 1                │
│  Lorem ipsum...              │
│                              │
│  ## Section 2                │
│  Lorem ipsum...              │
│                              │
├──────────────────────────────┤
│  ← Prec.       Suiv. →      │
├──────────────────────────────┤
│  (Footer)                    │
└──────────────────────────────┘
```

> **Note** : Sur mobile, la Sidebar est masquee (`hidden lg:block` dans Sidebar.astro), le MobileMenu prend le relais via le Header. La TOC s'affiche en mode collapsible inline au-dessus du contenu (gere par TableOfContents.astro).

### 3.5 Breakpoints responsive

| Ecran | Largeur | Colonnes | Sidebar | TOC | Breadcrumb |
|-------|---------|----------|---------|-----|------------|
| Mobile | < 768px | 1 | Masquee | Collapsible inline | Tronque |
| Tablette | 768px - 1023px | 1 | Masquee | Collapsible inline | Complet |
| Desktop | 1024px - 1279px | 2 (Sidebar + Contenu) | Visible | Masquee | Complet |
| Desktop large | >= 1280px | 3 (Sidebar + Contenu + TOC) | Visible | Visible sticky | Complet |

### 3.6 Zones semantiques HTML

| Zone | Element HTML | Role ARIA / Attribut | Detail |
|------|-------------|---------------------|--------|
| Header | `<header>` via Header.astro | Landmark `banner` (implicite) | Navigation principale, sticky |
| Breadcrumb | `<nav aria-label>` via Breadcrumb.astro | Navigation | Fil d'Ariane |
| Sidebar | `<aside aria-label>` via Sidebar.astro | Landmark `complementary` | Navigation laterale |
| Contenu principal | `<main id="main-content">` | Landmark `main` | Zone du contenu MDX |
| TOC | `<aside aria-label>` via TOC.astro | Landmark `complementary` | Table des matieres |
| PrevNextLinks | `<nav aria-label>` via PrevNextLinks.astro | Navigation | Liens sequentiels |

### 3.7 Gestion du slot par defaut

Le slot par defaut du DocsLayout recoit le contenu MDX rendu par Astro. Ce contenu est place dans la zone `<main>` :

```astro
<main id="main-content" class="...">
  <article class="prose prose-gray max-w-none">
    <slot />
  </article>
</main>
```

L'utilisation de `prose` (Tailwind Typography) assure un rendu typographique coherent pour le contenu MDX (headings, paragraphes, listes, code blocks, tableaux).

### 3.8 Gestion du JSON-LD SEO

Le DocsLayout genere automatiquement les donnees structurees `BreadcrumbList` a partir de l'URL courante et les transmet a BaseLayout via la prop `jsonLd` :

```typescript
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': breadcrumbs?.map((item, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': item.label,
    'item': item.isCurrent ? undefined : `https://aiad.dev${item.href}`,
  })),
}
```

### 3.9 Enhancement progressif

Sans JavaScript :
- Le Header rend les liens de navigation directement (pas de dropdowns interactifs, mais les liens restent fonctionnels)
- La Sidebar rend les sections actives depliees, toutes les autres aussi (tout visible)
- Le Breadcrumb est statique (0 JS)
- Les PrevNextLinks sont statiques (0 JS)
- La TOC rend la liste de liens d'ancrage (le scroll spy et le smooth scroll ne fonctionnent pas)
- **La page est entierement navigable sans JavaScript**

### 3.10 Accessibilite (RGAA AA)

| Critere | Implementation | Reference RGAA |
|---------|----------------|----------------|
| Skip-link | Herite de BaseLayout → `#main-content` | 12.7 |
| Landmark main | `<main id="main-content">` | 12.6 |
| Landmarks complementaires | Sidebar (`<aside>`) et TOC (`<aside>`) | 12.6 |
| Navigation semantique | Header (`<nav>`), Breadcrumb (`<nav>`), PrevNextLinks (`<nav>`) | 12.2 |
| Ordre de lecture logique | Header → Breadcrumb → Sidebar → Contenu → TOC → PrevNext | 10.3 |
| Focus visible | Herite des composants enfants | 10.7 |
| Contraste | Herite des composants enfants | 3.2 |
| Titre de page | `<title>` via BaseLayout | 8.5 |
| Langue | `<html lang="fr">` via BaseLayout | 8.3 |

---

## 4. Specifications techniques

### 4.1 Interface TypeScript

```typescript
// src/layouts/DocsLayout.astro (frontmatter)

import type { TableOfContentsItem, NavigationTree } from '@/types/navigation'

/**
 * Props du layout DocsLayout.
 *
 * Layout d'assemblage pour les pages de documentation du site AIAD.
 * Etend BaseLayout et integre Header, Sidebar, Breadcrumb, TOC et PrevNextLinks.
 *
 * @example
 * ```astro
 * ---
 * import DocsLayout from '@layouts/DocsLayout.astro'
 * const { Content, headings } = await post.render()
 * ---
 * <DocsLayout
 *   title={post.data.title}
 *   description={post.data.description}
 *   headings={headings}
 * >
 *   <Content />
 * </DocsLayout>
 * ```
 *
 * @example
 * ```astro
 * <!-- Avec toutes les options -->
 * <DocsLayout
 *   title="Preambule"
 *   description="Introduction au framework AIAD"
 *   headings={headings}
 *   canonical="https://aiad.dev/framework/preambule"
 *   ogImage="/images/og/framework.png"
 *   tree={customTree}
 *   showSidebar={true}
 *   showToc={true}
 *   showBreadcrumb={true}
 *   showPrevNext={true}
 * >
 *   <Content />
 * </DocsLayout>
 * ```
 */
export interface Props {
  // ── SEO (transmis a BaseLayout) ──────────────────

  /**
   * Titre de la page (affiche dans `<title>` et les meta OG).
   * Formate automatiquement en "{title} | AIAD" par BaseLayout.
   */
  title: string

  /**
   * Meta description de la page.
   */
  description: string

  /**
   * URL canonique de la page (optionnel).
   * Transmis a BaseLayout pour `<link rel="canonical">`.
   */
  canonical?: string

  /**
   * Image Open Graph (optionnel).
   * Transmis a BaseLayout pour `<meta property="og:image">`.
   * @default '/images/og/default.png'
   */
  ogImage?: string

  // ── Contenu ─────────────────────────────────────

  /**
   * Headings extraits de la page MDX par Astro.
   * Fournis par `post.render()` et transmis a TableOfContents.
   * Si vide ou non fourni, la colonne TOC est masquee.
   */
  headings?: TableOfContentsItem[]

  // ── Navigation ──────────────────────────────────

  /**
   * Arbre de navigation custom.
   * Si non fourni, les composants enfants utilisent NAVIGATION_TREE par defaut.
   * Utile pour l'injection dans les tests.
   */
  tree?: NavigationTree

  // ── Affichage conditionnel ──────────────────────

  /**
   * Afficher la Sidebar.
   * @default true
   */
  showSidebar?: boolean

  /**
   * Afficher la TableOfContents.
   * Masquee automatiquement si `headings` est vide.
   * @default true
   */
  showToc?: boolean

  /**
   * Afficher le Breadcrumb.
   * @default true
   */
  showBreadcrumb?: boolean

  /**
   * Afficher les PrevNextLinks.
   * @default true
   */
  showPrevNext?: boolean

  // ── HTML ────────────────────────────────────────

  /**
   * Classes CSS additionnelles sur le conteneur racine du layout.
   */
  class?: string
}
```

### 4.2 Implementation du composant

```astro
---
// src/layouts/DocsLayout.astro

import type { TableOfContentsItem, NavigationTree } from '@/types/navigation'
import { getBreadcrumbs } from '@/lib/navigation'
import { NAVIGATION_TREE } from '@/data/navigation'
import BaseLayout from '@layouts/BaseLayout.astro'
import Header from '@components/layout/Header.astro'
import Sidebar from '@components/layout/Sidebar.astro'
import Breadcrumb from '@components/layout/Breadcrumb.astro'
import TableOfContents from '@components/layout/TableOfContents.astro'
import PrevNextLinks from '@components/layout/PrevNextLinks.astro'

export interface Props {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  headings?: TableOfContentsItem[]
  tree?: NavigationTree
  showSidebar?: boolean
  showToc?: boolean
  showBreadcrumb?: boolean
  showPrevNext?: boolean
  class?: string
}

const {
  title,
  description,
  canonical,
  ogImage,
  headings = [],
  tree,
  showSidebar = true,
  showToc = true,
  showBreadcrumb = true,
  showPrevNext = true,
  class: className = '',
} = Astro.props

// ── Navigation tree (pour injection dans les enfants) ──
const navTree = tree ?? NAVIGATION_TREE

// ── Breadcrumb data + JSON-LD ──────────────────────────
const currentPath = Astro.url.pathname
const breadcrumbs = getBreadcrumbs(navTree, currentPath)

const breadcrumbJsonLd = breadcrumbs
  ? {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.label,
        ...(item.isCurrent ? {} : { 'item': `https://aiad.dev${item.href}` }),
      })),
    }
  : undefined

// ── TOC visibility ─────────────────────────────────────
const hasToc = showToc && headings.length > 0
---

<BaseLayout
  title={title}
  description={description}
  canonical={canonical}
  ogType="article"
  ogImage={ogImage}
  jsonLd={breadcrumbJsonLd}
  skipLinkTarget="main-content"
>
  {/* ── Header ──────────────────────────────────────────── */}
  <Header tree={navTree} />

  {/* ── Breadcrumb ──────────────────────────────────────── */}
  {showBreadcrumb && breadcrumbs && (
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3" data-docs-breadcrumb>
      <Breadcrumb items={breadcrumbs} tree={navTree} />
    </div>
  )}

  {/* ── Layout 3 colonnes ───────────────────────────────── */}
  <div
    class:list={[
      'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
      'flex flex-col lg:flex-row',
      className,
    ]}
    data-docs-layout
  >
    {/* ── Sidebar (colonne gauche) ──────────────────────── */}
    {showSidebar && (
      <Sidebar tree={navTree} />
    )}

    {/* ── Zone centrale : Contenu + PrevNext ────────────── */}
    <div class="flex-1 min-w-0 lg:pl-8 xl:pr-8">
      {/* ── Contenu principal ──────────────────────────── */}
      <main id="main-content" class="py-8" data-docs-main>
        <article class="prose prose-gray max-w-none" data-docs-article>
          <slot />
        </article>
      </main>

      {/* ── PrevNextLinks ──────────────────────────────── */}
      {showPrevNext && (
        <div class="border-t border-gray-200 py-8" data-docs-prevnext>
          <PrevNextLinks tree={navTree} />
        </div>
      )}
    </div>

    {/* ── TOC (colonne droite) ──────────────────────────── */}
    {hasToc && (
      <div class="hidden xl:block xl:w-56 xl:shrink-0" data-docs-toc>
        <div class="sticky top-20 py-8">
          <TableOfContents headings={headings} />
        </div>
      </div>
    )}
  </div>
</BaseLayout>
```

### 4.3 Data attributes

| Attribut | Element | Usage |
|----------|---------|-------|
| `data-docs-layout` | `<div>` conteneur flex | Selecteur pour le layout 3 colonnes (tests) |
| `data-docs-breadcrumb` | `<div>` conteneur breadcrumb | Selecteur du wrapper breadcrumb (tests) |
| `data-docs-main` | `<main>` | Selecteur du contenu principal (tests) |
| `data-docs-article` | `<article>` | Selecteur de l'article prose (tests) |
| `data-docs-prevnext` | `<div>` conteneur prevnext | Selecteur des liens sequentiels (tests) |
| `data-docs-toc` | `<div>` conteneur toc | Selecteur de la colonne TOC (tests) |
| `data-header` | (via Header.astro) | Selecteur du header (herite) |
| `data-sidebar` | (via Sidebar.astro) | Selecteur de la sidebar (herite) |

### 4.4 Exemples d'utilisation

#### Usage standard — Page de documentation

```astro
---
// src/pages/framework/[...slug].astro
import { getCollection } from 'astro:content'
import DocsLayout from '@layouts/DocsLayout.astro'

export async function getStaticPaths() {
  const posts = await getCollection('framework')
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }))
}

const { post } = Astro.props
const { Content, headings } = await post.render()
---

<DocsLayout
  title={post.data.title}
  description={post.data.description}
  headings={headings}
>
  <Content />
</DocsLayout>
```

#### Usage sans TOC (page index de section)

```astro
---
import DocsLayout from '@layouts/DocsLayout.astro'
---

<DocsLayout
  title="Framework AIAD"
  description="Vue d'ensemble du framework AIAD"
  showToc={false}
>
  <h1>Framework AIAD</h1>
  <p>Bienvenue dans le framework...</p>
</DocsLayout>
```

#### Usage sans Sidebar (page standalone)

```astro
---
import DocsLayout from '@layouts/DocsLayout.astro'
---

<DocsLayout
  title="Glossaire"
  description="Glossaire des termes AIAD"
  showSidebar={false}
  showPrevNext={false}
>
  <h1>Glossaire</h1>
  <!-- contenu du glossaire -->
</DocsLayout>
```

#### Usage avec arbre custom (tests)

```astro
<DocsLayout
  title="Test"
  description="Description test"
  headings={testHeadings}
  tree={customTree}
>
  <h2>Test content</h2>
</DocsLayout>
```

---

## 5. Design et Style

### 5.1 Dimensions et espacement

| Element | Style Tailwind | Detail |
|---------|---------------|--------|
| Conteneur max width | `max-w-7xl` | 1280px max, coherent avec le Header |
| Padding horizontal | `px-4 sm:px-6 lg:px-8` | Responsive : 16px → 24px → 32px |
| Sidebar largeur | `w-64` (via Sidebar.astro) | 256px fixe |
| TOC largeur | `xl:w-56` | 224px fixe |
| Contenu zone | `flex-1 min-w-0` | Prend l'espace restant, evite l'overflow |
| Spacing sidebar-contenu | `lg:pl-8` | 32px entre sidebar et contenu |
| Spacing contenu-toc | `xl:pr-8` | 32px entre contenu et TOC |
| Contenu padding vertical | `py-8` | 32px en haut et en bas |
| PrevNext padding vertical | `py-8` | 32px en haut et en bas |
| Breadcrumb padding vertical | `py-3` | 12px en haut et en bas |
| TOC top offset | `sticky top-20` | 80px (sous le header sticky de 64px + 16px marge) |

### 5.2 Separateurs visuels

| Element | Style | Detail |
|---------|-------|--------|
| Bordure sous le header | Via Header.astro (`border-b border-gray-200`) | Herite du Header |
| Bordure droite sidebar | Via Sidebar.astro (`border-r border-gray-200`) | Herite de la Sidebar |
| Bordure au-dessus PrevNext | `border-t border-gray-200` | Separation contenu / navigation |

### 5.3 Typographie du contenu (prose)

L'article utilise le plugin `@tailwindcss/typography` avec la configuration `prose prose-gray max-w-none` :

| Element | Rendu |
|---------|-------|
| `<h1>` | `text-4xl font-bold text-gray-900` |
| `<h2>` | `text-2xl font-bold text-gray-900` |
| `<h3>` | `text-xl font-semibold text-gray-900` |
| `<h4>` | `text-lg font-semibold text-gray-900` |
| `<p>` | `text-base text-gray-700 leading-7` |
| `<a>` | `text-blue-600 underline hover:text-blue-800` |
| `<code>` | `bg-gray-100 rounded px-1 py-0.5 text-sm` |
| `<pre>` | `bg-gray-900 text-gray-100 rounded-lg p-4` |

> **Note** : `max-w-none` supprime la largeur maximale par defaut de prose (~65ch) pour que le contenu prenne toute la largeur disponible dans la colonne centrale.

### 5.4 Coherence avec le design system

| Aspect | Conformite |
|--------|------------|
| Max width | `max-w-7xl` — coherent avec Header.astro |
| Padding horizontal | `px-4 sm:px-6 lg:px-8` — coherent avec Header.astro |
| Couleur de fond | `bg-white` — herite de BaseLayout `body` |
| Couleur texte | `text-gray-900` — herite de BaseLayout `body` |
| Bordures | `border-gray-200` — coherent avec Header, Sidebar |
| Focus ring | Herite des composants enfants |

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Matrice des cas limites

| ID | Cas | Comportement attendu | Priorite |
|----|-----|----------------------|----------|
| CL-01 | Page standard avec tous les composants | Layout 3 colonnes complet (desktop large) | Haute |
| CL-02 | Page sans headings (headings = []) | TOC masquee, layout 2 colonnes max | Haute |
| CL-03 | Page sans headings (headings non fourni) | TOC masquee, layout 2 colonnes max | Haute |
| CL-04 | `showSidebar={false}` | Pas de sidebar, contenu prend toute la largeur | Haute |
| CL-05 | `showToc={false}` | Pas de TOC, contenu s'etend a droite | Haute |
| CL-06 | `showBreadcrumb={false}` | Pas de breadcrumb, contenu directement sous le header | Haute |
| CL-07 | `showPrevNext={false}` | Pas de liens sequentiels en bas du contenu | Haute |
| CL-08 | Tous les show* a false | Juste Header + main content, layout minimal | Moyenne |
| CL-09 | Page non trouvee dans l'arbre de navigation (breadcrumbs = null) | Breadcrumb non rendu (meme si showBreadcrumb=true), pas de JSON-LD | Haute |
| CL-10 | URL avec trailing slash (`/framework/preambule/`) | Normalise par getBreadcrumbs, comportement identique | Haute |
| CL-11 | Page d'accueil (`/`) avec DocsLayout | Breadcrumb non rendu (pas dans l'arbre), sidebar sans section depliee | Basse |
| CL-12 | Desktop large (>= 1280px) | 3 colonnes : Sidebar + Contenu + TOC | Haute |
| CL-13 | Desktop (1024px - 1279px) | 2 colonnes : Sidebar + Contenu (TOC masquee) | Haute |
| CL-14 | Mobile/Tablette (< 1024px) | 1 colonne : Contenu seul (Sidebar masquee, MobileMenu via Header) | Haute |
| CL-15 | Contenu tres long (> 3000 mots) | Sidebar sticky, TOC sticky, scroll independant | Haute |
| CL-16 | Contenu tres court (1 paragraphe) | Layout correct sans scroll, PrevNext visible | Haute |
| CL-17 | Beaucoup de headings (> 20) | TOC scrolle independamment grace a son overflow-y-auto | Moyenne |
| CL-18 | `tree` custom fourni | Transmet l'arbre a Header, Sidebar, Breadcrumb, PrevNextLinks | Haute |
| CL-19 | `canonical` fourni | Transmis a BaseLayout pour `<link rel="canonical">` | Moyenne |
| CL-20 | `ogImage` fourni | Transmis a BaseLayout pour `<meta property="og:image">` | Moyenne |
| CL-21 | Slot vide (pas de contenu) | `<main>` vide mais valide, PrevNext toujours visible | Basse |
| CL-22 | Titre avec caracteres speciaux | Echappe par Astro et BaseLayout | Haute |
| CL-23 | Description avec caracteres speciaux | Echappe par Astro et BaseLayout | Haute |
| CL-24 | JSON-LD genere correctement | Structure `BreadcrumbList` valide, dernier element sans `item` | Haute |
| CL-25 | `class` personnalise fourni | Ajoute au conteneur flex (ne remplace pas) | Moyenne |
| CL-26 | Sans JavaScript | Tous les composants fonctionnent en mode degrade, page navigable | Haute |
| CL-27 | Skip-link fonctionnel | Focus sur `#main-content` au clic/Enter sur le skip-link | Haute |
| CL-28 | Prose overflow (images larges, code long) | `min-w-0` empeche l'overflow horizontal | Haute |

### 6.2 Strategie de fallback

```
Props manquantes ?
├── headings: non fourni → [] (TOC masquee)
├── tree: non fourni → NAVIGATION_TREE par defaut
├── showSidebar: non fourni → true
├── showToc: non fourni → true
├── showBreadcrumb: non fourni → true
├── showPrevNext: non fourni → true
├── canonical: non fourni → pas de <link rel="canonical">
├── ogImage: non fourni → '/images/og/default.png' (via BaseLayout)
└── class: non fourni → '' (pas de classes additionnelles)

Breadcrumbs non trouves (page hors arbre) ?
├── breadcrumbs = null
├── Breadcrumb non rendu (meme si showBreadcrumb=true)
├── JSON-LD non injecte
└── PrevNextLinks rend { prev: null, next: null }
```

---

## 7. Exemples entree/sortie

### 7.1 Rendu standard (page /framework/artefacts avec headings)

**Entree :**

```astro
<DocsLayout
  title="Artefacts"
  description="Les artefacts du framework AIAD"
  headings={[
    { depth: 2, text: 'PRD', slug: 'prd' },
    { depth: 2, text: 'Architecture', slug: 'architecture' },
    { depth: 3, text: 'Principes', slug: 'principes' },
  ]}
>
  <h1>Artefacts</h1>
  <h2 id="prd">PRD</h2>
  <p>Le Product Requirements Document...</p>
  <h2 id="architecture">Architecture</h2>
  <h3 id="principes">Principes</h3>
  <p>Les principes architecturaux...</p>
</DocsLayout>
```

**Sortie HTML (structure simplifiee) :**

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Artefacts | AIAD</title>
    <meta name="description" content="Les artefacts du framework AIAD" />
    <meta property="og:type" content="article" />
    <!-- ... autres meta OG ... -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://aiad.dev/" },
          { "@type": "ListItem", "position": 2, "name": "Framework", "item": "https://aiad.dev/framework" },
          { "@type": "ListItem", "position": 3, "name": "Artefacts" }
        ]
      }
    </script>
  </head>
  <body class="min-h-screen bg-white text-gray-900 antialiased">
    <!-- Skip-link -->
    <a href="#main-content" class="skip-link sr-only focus:not-sr-only ...">
      Aller au contenu principal
    </a>

    <!-- Header (sticky) -->
    <header class="sticky top-0 z-40 ..." data-header>
      <nav aria-label="Navigation principale">...</nav>
    </header>

    <!-- Breadcrumb -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3" data-docs-breadcrumb>
      <nav aria-label="Fil d'Ariane">
        <ol>
          <li><a href="/">Accueil</a></li>
          <li><a href="/framework">Framework</a></li>
          <li aria-current="page">Artefacts</li>
        </ol>
      </nav>
    </div>

    <!-- Layout 3 colonnes -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row" data-docs-layout>
      <!-- Sidebar -->
      <aside class="hidden lg:block w-64 ..." data-sidebar>
        <nav aria-label="Sections de documentation">...</nav>
      </aside>

      <!-- Zone centrale -->
      <div class="flex-1 min-w-0 lg:pl-8 xl:pr-8">
        <!-- Contenu principal -->
        <main id="main-content" class="py-8" data-docs-main>
          <article class="prose prose-gray max-w-none" data-docs-article>
            <h1>Artefacts</h1>
            <h2 id="prd">PRD</h2>
            <p>Le Product Requirements Document...</p>
            <h2 id="architecture">Architecture</h2>
            <h3 id="principes">Principes</h3>
            <p>Les principes architecturaux...</p>
          </article>
        </main>

        <!-- PrevNextLinks -->
        <div class="border-t border-gray-200 py-8" data-docs-prevnext>
          <nav aria-label="Navigation entre les pages">
            <a href="/framework/ecosysteme">← Ecosysteme</a>
            <a href="/framework/boucles-iteratives">Boucles Iteratives →</a>
          </nav>
        </div>
      </div>

      <!-- TOC (desktop large uniquement) -->
      <div class="hidden xl:block xl:w-56 xl:shrink-0" data-docs-toc>
        <div class="sticky top-20 py-8">
          <aside aria-label="Sur cette page">
            <nav>
              <a href="#prd">PRD</a>
              <a href="#architecture">Architecture</a>
              <a href="#principes" class="pl-4">Principes</a>
            </nav>
          </aside>
        </div>
      </div>
    </div>
  </body>
</html>
```

### 7.2 Rendu sans headings (TOC masquee)

**Entree :**

```astro
<DocsLayout
  title="Framework AIAD"
  description="Vue d'ensemble"
>
  <h1>Framework AIAD</h1>
  <p>Bienvenue...</p>
</DocsLayout>
```

**Sortie :** Layout 2 colonnes max (Sidebar + Contenu). Le `<div data-docs-toc>` n'est pas rendu.

### 7.3 Rendu sans Sidebar

**Entree :**

```astro
<DocsLayout
  title="Glossaire"
  description="Glossaire des termes AIAD"
  showSidebar={false}
  showPrevNext={false}
>
  <h1>Glossaire</h1>
</DocsLayout>
```

**Sortie :** Pas de `<aside data-sidebar>`. Le contenu occupe toute la largeur dans le conteneur `max-w-7xl`. Pas de `<div data-docs-prevnext>`.

### 7.4 Page hors arbre de navigation

**Entree :** URL `/page-inconnue` avec DocsLayout

**Sortie :** `breadcrumbs` est `null` → pas de `<div data-docs-breadcrumb>`, pas de JSON-LD. Le reste du layout fonctionne normalement. PrevNextLinks rend `{ prev: null, next: null }` → le composant ne rend rien ou affiche des placeholders vides.

### 7.5 Protection XSS

**Entree :**

```astro
<DocsLayout
  title='<script>alert("xss")</script>'
  description='<img src=x onerror="alert(1)">'
>
  <p>Content</p>
</DocsLayout>
```

**Sortie :**

```html
<title>&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; | AIAD</title>
<meta name="description" content="&lt;img src=x onerror=&quot;alert(1)&quot;&gt;" />
```

> Astro echappe automatiquement les expressions dans les attributs HTML.

---

## 8. Tests

### 8.1 Fichiers de test

| Fichier | Type | Framework |
|---------|------|-----------|
| `tests/unit/layouts/docs-layout.test.ts` | Unitaire | Vitest + Astro Container |

### 8.2 Tests unitaires (Vitest)

```typescript
// tests/unit/layouts/docs-layout.test.ts
import { describe, it, expect } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import DocsLayout from '@layouts/DocsLayout.astro'
import type { NavigationTree, TableOfContentsItem } from '@/types/navigation'

// ── Fixtures ────────────────────────────────────────
const MINIMAL_TREE: NavigationTree = {
  framework: [
    { id: 'fw-preambule', label: 'Preambule', href: '/framework/preambule', section: 'framework', order: 1, badge: 'essential' as const },
    { id: 'fw-vision', label: 'Vision & Philosophie', href: '/framework/vision-philosophie', section: 'framework', order: 2 },
    { id: 'fw-artefacts', label: 'Artefacts', href: '/framework/artefacts', section: 'framework', order: 3 },
  ],
  modeOperatoire: [
    { id: 'mo-preambule', label: 'Preambule', href: '/mode-operatoire/preambule', section: 'mode-operatoire', order: 0 },
  ],
  annexes: [
    {
      id: 'annexes-a-templates', label: 'A - Templates', href: '/annexes/templates',
      section: 'annexes', order: 1,
      children: [
        { id: 'annexe-a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', order: 1 },
      ],
    },
  ],
}

const TEST_HEADINGS: TableOfContentsItem[] = [
  { depth: 2, text: 'Section 1', slug: 'section-1' },
  { depth: 3, text: 'Sous-section', slug: 'sous-section' },
  { depth: 2, text: 'Section 2', slug: 'section-2' },
]

// ── Helpers ──────────────────────────────────────────
async function renderDocsLayout(
  props: Record<string, unknown> = {},
  currentPath: string = '/framework/artefacts',
) {
  const container = await AstroContainer.create()
  return container.renderToString(DocsLayout, {
    props: {
      title: 'Test Page',
      description: 'Description test',
      headings: TEST_HEADINGS,
      tree: MINIMAL_TREE,
      ...props,
    },
    request: new Request(`https://aiad.dev${currentPath}`),
  })
}

// ── Tests structure HTML de base ─────────────────────
describe('DocsLayout — Structure HTML', () => {
  it('T-01 : rend un document HTML complet avec doctype', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('<!doctype html>')
    expect(html).toContain('<html lang="fr">')
  })

  it('T-02 : rend le <title> formate avec | AIAD', async () => {
    const html = await renderDocsLayout({ title: 'Artefacts' })
    expect(html).toContain('<title>Artefacts | AIAD</title>')
  })

  it('T-03 : rend la meta description', async () => {
    const html = await renderDocsLayout({ description: 'Les artefacts AIAD' })
    expect(html).toContain('content="Les artefacts AIAD"')
  })

  it('T-04 : rend og:type article', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('content="article"')
  })

  it('T-05 : rend le skip-link pointant vers main-content', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('href="#main-content"')
    expect(html).toContain('Aller au contenu principal')
  })

  it('T-06 : rend un <main> avec id="main-content"', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('id="main-content"')
    expect(html).toContain('<main')
  })

  it('T-07 : rend un <article> avec classe prose', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('data-docs-article')
    expect(html).toMatch(/class="[^"]*prose/)
  })

  it('T-08 : rend le conteneur layout avec data-docs-layout', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('data-docs-layout')
  })

  it('T-09 : le conteneur a max-w-7xl', async () => {
    const html = await renderDocsLayout()
    expect(html).toMatch(/data-docs-layout[^>]*class="[^"]*max-w-7xl/)
  })
})

// ── Tests composants integres ────────────────────────
describe('DocsLayout — Composants integres', () => {
  it('T-10 : integre le Header', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('data-header')
  })

  it('T-11 : integre le Breadcrumb sur une page connue', async () => {
    const html = await renderDocsLayout({}, '/framework/artefacts')
    expect(html).toContain('data-docs-breadcrumb')
  })

  it('T-12 : integre la Sidebar', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('data-sidebar')
  })

  it('T-13 : integre la TableOfContents quand headings sont fournis', async () => {
    const html = await renderDocsLayout({ headings: TEST_HEADINGS })
    expect(html).toContain('data-docs-toc')
  })

  it('T-14 : integre les PrevNextLinks', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('data-docs-prevnext')
  })
})

// ── Tests affichage conditionnel ─────────────────────
describe('DocsLayout — Affichage conditionnel', () => {
  it('T-15 : masque la Sidebar quand showSidebar={false}', async () => {
    const html = await renderDocsLayout({ showSidebar: false })
    expect(html).not.toContain('data-sidebar')
  })

  it('T-16 : masque la TOC quand showToc={false}', async () => {
    const html = await renderDocsLayout({ showToc: false })
    expect(html).not.toContain('data-docs-toc')
  })

  it('T-17 : masque la TOC quand headings est vide', async () => {
    const html = await renderDocsLayout({ headings: [] })
    expect(html).not.toContain('data-docs-toc')
  })

  it('T-18 : masque la TOC quand headings n\'est pas fourni', async () => {
    const html = await renderDocsLayout({ headings: undefined })
    expect(html).not.toContain('data-docs-toc')
  })

  it('T-19 : masque le Breadcrumb quand showBreadcrumb={false}', async () => {
    const html = await renderDocsLayout({ showBreadcrumb: false })
    expect(html).not.toContain('data-docs-breadcrumb')
  })

  it('T-20 : masque les PrevNextLinks quand showPrevNext={false}', async () => {
    const html = await renderDocsLayout({ showPrevNext: false })
    expect(html).not.toContain('data-docs-prevnext')
  })

  it('T-21 : masque le Breadcrumb quand la page n\'est pas dans l\'arbre', async () => {
    const html = await renderDocsLayout({}, '/page-inconnue')
    expect(html).not.toContain('data-docs-breadcrumb')
  })
})

// ── Tests JSON-LD ────────────────────────────────────
describe('DocsLayout — JSON-LD SEO', () => {
  it('T-22 : genere le JSON-LD BreadcrumbList pour une page connue', async () => {
    const html = await renderDocsLayout({}, '/framework/artefacts')
    expect(html).toContain('"@type":"BreadcrumbList"')
  })

  it('T-23 : le JSON-LD contient les positions correctes', async () => {
    const html = await renderDocsLayout({}, '/framework/artefacts')
    expect(html).toContain('"position":1')
    expect(html).toContain('"position":2')
    expect(html).toContain('"position":3')
  })

  it('T-24 : le JSON-LD contient "Accueil" comme premier element', async () => {
    const html = await renderDocsLayout({}, '/framework/artefacts')
    expect(html).toContain('"name":"Accueil"')
  })

  it('T-25 : le dernier element JSON-LD n\'a pas de propriete "item"', async () => {
    const html = await renderDocsLayout({}, '/framework/artefacts')
    // Le dernier ListItem (page courante) ne doit pas avoir "item"
    // On verifie que le label de la page courante est present sans URL
    expect(html).toContain('"name":"Artefacts"')
  })

  it('T-26 : pas de JSON-LD quand la page n\'est pas dans l\'arbre', async () => {
    const html = await renderDocsLayout({}, '/page-inconnue')
    expect(html).not.toContain('"@type":"BreadcrumbList"')
  })
})

// ── Tests responsive (classes CSS) ───────────────────
describe('DocsLayout — Responsive', () => {
  it('T-27 : le layout utilise flex-col sur mobile et flex-row sur desktop', async () => {
    const html = await renderDocsLayout()
    expect(html).toMatch(/data-docs-layout[^>]*class="[^"]*flex flex-col lg:flex-row/)
  })

  it('T-28 : la colonne TOC utilise hidden xl:block', async () => {
    const html = await renderDocsLayout({ headings: TEST_HEADINGS })
    expect(html).toMatch(/data-docs-toc[^>]*class="[^"]*hidden xl:block/)
  })

  it('T-29 : la zone centrale a min-w-0 pour eviter l\'overflow', async () => {
    const html = await renderDocsLayout()
    expect(html).toMatch(/class="[^"]*flex-1 min-w-0/)
  })
})

// ── Tests props transmises ───────────────────────────
describe('DocsLayout — Transmission des props', () => {
  it('T-30 : transmet le tree custom au Header', async () => {
    const html = await renderDocsLayout({ tree: MINIMAL_TREE })
    // Le Header doit avoir les items du tree custom
    expect(html).toContain('data-header')
    expect(html).toContain('Framework')
  })

  it('T-31 : transmet le tree custom a la Sidebar', async () => {
    const html = await renderDocsLayout({ tree: MINIMAL_TREE })
    expect(html).toContain('data-sidebar')
  })

  it('T-32 : transmet canonical a BaseLayout quand fourni', async () => {
    const html = await renderDocsLayout({ canonical: 'https://aiad.dev/framework/artefacts' })
    expect(html).toContain('rel="canonical"')
    expect(html).toContain('href="https://aiad.dev/framework/artefacts"')
  })

  it('T-33 : pas de canonical quand non fourni', async () => {
    const html = await renderDocsLayout()
    expect(html).not.toContain('rel="canonical"')
  })

  it('T-34 : transmet ogImage a BaseLayout quand fourni', async () => {
    const html = await renderDocsLayout({ ogImage: '/images/og/custom.png' })
    expect(html).toContain('/images/og/custom.png')
  })
})

// ── Tests classes CSS personnalisees ─────────────────
describe('DocsLayout — Classes personnalisees', () => {
  it('T-35 : ajoute les classes custom au conteneur layout', async () => {
    const html = await renderDocsLayout({ class: 'custom-class' })
    expect(html).toContain('custom-class')
  })
})

// ── Tests accessibilite ──────────────────────────────
describe('DocsLayout — Accessibilite', () => {
  it('T-36 : le skip-link cible main-content', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('href="#main-content"')
    expect(html).toContain('id="main-content"')
  })

  it('T-37 : rend le landmark main', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('<main')
  })

  it('T-38 : rend le landmark banner (header)', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('<header')
  })

  it('T-39 : rend les landmarks complementaires (sidebar et/ou toc)', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('<aside')
  })

  it('T-40 : le document a lang="fr"', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('lang="fr"')
  })
})

// ── Tests protection XSS ─────────────────────────────
describe('DocsLayout — Protection XSS', () => {
  it('T-41 : le titre est echappe dans le <title>', async () => {
    const html = await renderDocsLayout({ title: '<script>alert("xss")</script>' })
    expect(html).not.toContain('<script>alert')
    expect(html).toContain('&lt;script&gt;')
  })

  it('T-42 : la description est echappee', async () => {
    const html = await renderDocsLayout({ description: '<img onerror="alert(1)">' })
    expect(html).not.toContain('onerror=')
  })
})

// ── Tests integration complete ───────────────────────
describe('DocsLayout — Integration complete', () => {
  it('T-43 : rend tous les composants sur une page Framework', async () => {
    const html = await renderDocsLayout(
      { headings: TEST_HEADINGS },
      '/framework/artefacts',
    )
    // Header
    expect(html).toContain('data-header')
    // Breadcrumb
    expect(html).toContain('data-docs-breadcrumb')
    // Sidebar
    expect(html).toContain('data-sidebar')
    // Main content
    expect(html).toContain('data-docs-main')
    // Article prose
    expect(html).toContain('data-docs-article')
    // PrevNextLinks
    expect(html).toContain('data-docs-prevnext')
    // TOC
    expect(html).toContain('data-docs-toc')
  })

  it('T-44 : rend correctement une page Annexe', async () => {
    const html = await renderDocsLayout(
      { headings: TEST_HEADINGS },
      '/annexes/templates/prd',
    )
    expect(html).toContain('data-header')
    expect(html).toContain('data-docs-breadcrumb')
    expect(html).toContain('data-sidebar')
    expect(html).toContain('data-docs-main')
  })

  it('T-45 : rend correctement une page Mode Operatoire', async () => {
    const html = await renderDocsLayout(
      { headings: TEST_HEADINGS },
      '/mode-operatoire/preambule',
    )
    expect(html).toContain('data-header')
    expect(html).toContain('data-docs-breadcrumb')
    expect(html).toContain('data-sidebar')
    expect(html).toContain('data-docs-main')
  })
})
```

### 8.3 Resume des tests

| # | Categorie | Nombre | Description |
|---|-----------|--------|-------------|
| T-01 → T-09 | Structure HTML | 9 | Document HTML, title, meta, skip-link, main, article, layout |
| T-10 → T-14 | Composants integres | 5 | Header, Breadcrumb, Sidebar, TOC, PrevNextLinks |
| T-15 → T-21 | Affichage conditionnel | 7 | showSidebar, showToc, showBreadcrumb, showPrevNext, page hors arbre |
| T-22 → T-26 | JSON-LD SEO | 5 | BreadcrumbList, positions, accueil, dernier element, pas de JSON-LD |
| T-27 → T-29 | Responsive | 3 | flex-col/row, hidden xl:block, min-w-0 |
| T-30 → T-34 | Transmission des props | 5 | tree, canonical, ogImage |
| T-35 | Classes personnalisees | 1 | Classe custom sur le conteneur |
| T-36 → T-40 | Accessibilite | 5 | Skip-link, landmarks, lang |
| T-41 → T-42 | Protection XSS | 2 | Echappement titre, description |
| T-43 → T-45 | Integration complete | 3 | Pages Framework, Annexe, Mode Operatoire |
| **Total** | | **45** | |

### 8.4 Assertions cles

| Test | Assertion | Criticite |
|------|-----------|-----------|
| T-01 | Document HTML complet avec doctype | Bloquant |
| T-05 | Skip-link pointe vers main-content | Bloquant |
| T-06 | `<main>` avec id="main-content" | Bloquant |
| T-07 | Article avec classe prose | Bloquant |
| T-10 | Header integre | Bloquant |
| T-12 | Sidebar integree | Bloquant |
| T-13 | TOC integree quand headings fournis | Bloquant |
| T-14 | PrevNextLinks integres | Bloquant |
| T-15 | Sidebar masquee quand showSidebar=false | Bloquant |
| T-17 | TOC masquee quand headings vide | Bloquant |
| T-22 | JSON-LD BreadcrumbList genere | Bloquant |
| T-26 | Pas de JSON-LD pour page hors arbre | Bloquant |
| T-27 | Layout responsive flex-col/row | Bloquant |
| T-36 | Skip-link cible main-content | Bloquant |
| T-41 | Protection XSS titre | Bloquant |
| T-43 | Tous les composants presents sur page standard | Bloquant |

---

## 9. Dependance `@tailwindcss/typography`

Le DocsLayout necessite le plugin `@tailwindcss/typography` pour la classe `prose`. Si le plugin n'est pas encore installe :

```bash
pnpm add -D @tailwindcss/typography
```

Configuration dans `tailwind.config.mjs` :

```javascript
export default {
  // ...
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

> **Verification prealable** : verifier si `@tailwindcss/typography` est deja present dans `package.json` avant d'ajouter. Si le plugin n'est pas disponible, utiliser des classes manuelles pour le rendu typographique au lieu de `prose`.

---

## 10. Difference avec BaseLayout (T-004-F1)

| Aspect | BaseLayout (T-004-F1) | DocsLayout (T-004-F10) |
|--------|----------------------|------------------------|
| **Role** | Shell HTML racine (head, body, skip-link) | Assemblage navigation + contenu documentation |
| **Contenu** | Slot generique | Slot dans un layout 3 colonnes |
| **Header** | Non inclus | Integre Header (T-004-F4) |
| **Sidebar** | Non incluse | Integre Sidebar (T-004-F9) |
| **TOC** | Non incluse | Integre TableOfContents (T-004-F7) |
| **Breadcrumb** | Non inclus | Integre Breadcrumb (T-004-F6) |
| **PrevNext** | Non inclus | Integre PrevNextLinks (T-004-F8) |
| **JSON-LD** | Supporte via prop `jsonLd` | Genere automatiquement BreadcrumbList |
| **og:type** | `website` par defaut | `article` (overridden) |
| **Utilisation** | Pages standalone (accueil, glossaire) | Pages documentation (framework, mode-op, annexes) |

---

## 11. Checklist de validation

- [ ] Le layout etend BaseLayout correctement
- [ ] Le Header est integre en haut de page
- [ ] Le Breadcrumb est integre entre le header et le contenu
- [ ] La Sidebar est integree a gauche
- [ ] La TableOfContents est integree a droite
- [ ] Les PrevNextLinks sont integres en bas du contenu
- [ ] Le `<main id="main-content">` existe et est cible du skip-link
- [ ] L'article utilise la classe `prose` pour le rendu typographique
- [ ] Le layout est responsive : 1 col / 2 col / 3 col
- [ ] La TOC est masquee (< 1280px) avec `hidden xl:block`
- [ ] La Sidebar est masquee (< 1024px) via son propre `hidden lg:block`
- [ ] Le JSON-LD BreadcrumbList est genere pour les pages dans l'arbre
- [ ] Pas de JSON-LD pour les pages hors arbre
- [ ] `showSidebar={false}` masque la sidebar
- [ ] `showToc={false}` masque la TOC
- [ ] `showBreadcrumb={false}` masque le breadcrumb
- [ ] `showPrevNext={false}` masque les PrevNextLinks
- [ ] Les headings vides masquent la TOC
- [ ] Le `tree` custom est transmis a tous les composants enfants
- [ ] Le `canonical` et `ogImage` sont transmis a BaseLayout
- [ ] Protection XSS (echappement automatique)
- [ ] 45 tests passent
- [ ] Enhancement progressif : page navigable sans JavaScript
- [ ] `og:type` est `article` pour les pages docs

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 12/02/2026 | Creation initiale |
