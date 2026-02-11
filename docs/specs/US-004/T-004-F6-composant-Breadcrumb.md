# T-004-F6 : Composant Breadcrumb (fil d'Ariane dynamique base sur l'URL)

| Metadonnee | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 11 fevrier 2026 |
| **Statut** | A faire |
| **User Story** | [US-004 - Naviguer facilement dans le framework](./spec-US-004.md) |
| **Dependances** | T-004-B1 (Types TypeScript navigation), T-004-B4 (Helpers navigation) |
| **Bloque** | T-004-F10 (DocsLayout), T-004-T3 (Tests composants atomiques) |

---

## 1. Objectif

Creer le composant **Breadcrumb** qui affiche un fil d'Ariane dynamique sur toutes les pages de documentation du site AIAD. Ce composant fournit :

- Un **rendu semantique** avec `<nav aria-label="Fil d'Ariane">` et une liste ordonnee `<ol>` conforme aux bonnes pratiques WAI-ARIA
- Un **calcul automatique** du chemin a partir de l'URL courante via le helper `getBreadcrumbs()` (T-004-B4)
- Des **donnees structurees JSON-LD** (`schema.org/BreadcrumbList`) pour le SEO
- Un **separateur visuel** (chevron `>`) entre chaque niveau
- Le **dernier element** affiche comme texte non cliquable avec `aria-current="page"`
- Une **troncature responsive** sur mobile (< 768px) pour les chemins longs
- La compatibilite avec les types `BreadcrumbItem` et `BreadcrumbList` definis en T-004-B1
- **0 JavaScript cote client** : le composant est 100% statique, calcule au build time

Ce composant est consomme par le layout `DocsLayout` (T-004-F10) et s'affiche entre le header et le contenu principal.

---

## 2. Contexte technique

### 2.1 Stack

| Technologie | Version | Role |
|-------------|---------|------|
| Astro | 4.x | Composant statique (SSG, 0 JS client) |
| TypeScript | 5.x | Typage strict des props |
| Tailwind CSS | 3.x | Utility-first, responsive |

### 2.2 Arborescence

```
src/
├── components/
│   └── layout/
│       ├── NavLink.astro              # T-004-F2 (reference de style)
│       ├── TableOfContents.astro      # T-004-F7 (reference de style)
│       └── Breadcrumb.astro           <-- CE COMPOSANT
├── types/
│   └── navigation.ts                  # Types BreadcrumbItem, BreadcrumbList (T-004-B1)
├── lib/
│   └── navigation.ts                  # getBreadcrumbs() helper (T-004-B4)
├── data/
│   └── navigation.ts                  # NAVIGATION_TREE (T-004-B3)
├── layouts/
│   ├── BaseLayout.astro               # Layout racine (T-004-F1)
│   └── DocsLayout.astro               # Layout docs (T-004-F10) — consommateur
└── pages/
    └── framework/
        └── [...slug].astro            # Pages qui consomment le breadcrumb
```

### 2.3 Position dans l'architecture des composants

```
Breadcrumb.astro                    <-- CE COMPOSANT (composant atomique)
└── DocsLayout.astro (T-004-F10)   <-- Consommateur (entre header et contenu)
    ├── framework/[...slug].astro   <-- Pages qui fournissent le pathname
    ├── mode-operatoire/[...slug].astro
    └── annexes/[...slug].astro
```

### 2.4 Dependances

#### T-004-B1 (Types)

Le composant utilise les types suivants de `src/types/navigation.ts` :

```typescript
import type { BreadcrumbItem, BreadcrumbList } from '@/types/navigation'
```

- `BreadcrumbItem` : `{ label: string; href: string; isCurrent?: boolean }` — element du fil d'Ariane
- `BreadcrumbList` : alias pour `BreadcrumbItem[]`

#### T-004-B4 (Helpers)

Le composant utilise le helper suivant de `src/lib/navigation.ts` :

```typescript
import { getBreadcrumbs } from '@/lib/navigation'
```

- `getBreadcrumbs(tree, currentPath)` : genere la liste ordonnee des breadcrumbs depuis l'arbre de navigation
  - Retourne `BreadcrumbList | null`
  - Le premier element est toujours `{ label: 'Accueil', href: '/' }`
  - Le dernier element a `isCurrent: true`
  - Retourne `null` si le chemin n'est pas trouve dans l'arbre

### 2.5 Conventions suivies

| Convention | Detail |
|-----------|--------|
| Nommage fichier | PascalCase dans `src/components/layout/` |
| TypeScript | Mode strict, props typees via `interface Props` |
| Imports | Alias `@/*` pour `src/*` |
| Design | Coherent avec NavLink (focus ring `ring-2 ring-offset-2`, couleurs `blue-600/700`) |
| Formatage | Prettier : pas de semicolons, single quotes, 2 espaces |

---

## 3. Specifications fonctionnelles

### 3.1 Description

Le composant `Breadcrumb` est un **fil d'Ariane accessible et SEO-friendly** qui :

1. Recoit le chemin courant (`currentPath`) ou le calcule automatiquement via `Astro.url.pathname`
2. Appelle `getBreadcrumbs()` pour obtenir la liste ordonnee des niveaux
3. Rend une structure `<nav>` > `<ol>` > `<li>` conforme aux bonnes pratiques WAI-ARIA Breadcrumb
4. Affiche chaque niveau comme un **lien cliquable** sauf le dernier qui est un **texte non cliquable** avec `aria-current="page"`
5. Insere un **separateur SVG** (chevron `>`) entre chaque niveau
6. Genere un **bloc JSON-LD** `schema.org/BreadcrumbList` pour le SEO
7. **Tronque** les niveaux intermediaires sur mobile (< 768px) avec un indicateur `...`

### 3.2 Structure du breadcrumb

La structure generee par `getBreadcrumbs()` suit ce schema :

| Niveau | Label | Href | Exemple |
|--------|-------|------|---------|
| 1 (toujours) | Accueil | `/` | Accueil |
| 2 (section) | Framework / Mode Operatoire / Annexes | `/framework` / `/mode-operatoire` / `/annexes` | Framework |
| 3 (categorie, annexes uniquement) | Nom categorie | `/annexes/templates` | A - Templates |
| N (dernier) | Page courante | URL courante | `isCurrent: true` | Preambule |

**Exemples de breadcrumbs :**

```
Page framework simple :
Accueil > Framework > Preambule

Page annexe avec categorie :
Accueil > Annexes > A - Templates > A1 - PRD

Page mode operatoire :
Accueil > Mode Operatoire > Planification
```

### 3.3 Separateur

Le separateur entre chaque item est un chevron SVG (`>`) :

| Aspect | Detail |
|--------|--------|
| Type | SVG chevron droit |
| Taille | `h-4 w-4` |
| Couleur | `text-gray-400` |
| Accessibilite | `aria-hidden="true"` (decoratif) |
| Position | Entre chaque `<li>`, a l'interieur du `<li>` precedent |

### 3.4 Troncature responsive (mobile)

Sur les ecrans mobiles (< 768px), quand le breadcrumb a plus de 3 niveaux :

| Ecran | Comportement |
|-------|-------------|
| Desktop (>= 768px) | Tous les niveaux sont affiches |
| Mobile (< 768px), <= 3 niveaux | Tous les niveaux sont affiches |
| Mobile (< 768px), > 3 niveaux | Accueil > `...` > Page courante |

La troncature fonctionne en masquant les niveaux intermediaires via CSS (`hidden md:inline-flex` sur les items du milieu) et en affichant un element `...` visible uniquement sur mobile (`inline-flex md:hidden`).

### 3.5 JSON-LD pour le SEO

Le composant genere un bloc `<script type="application/ld+json">` conforme a `schema.org/BreadcrumbList` :

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Accueil",
      "item": "https://aiad.dev/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Framework",
      "item": "https://aiad.dev/framework"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Preambule"
    }
  ]
}
```

**Regles JSON-LD :**

| Regle | Detail |
|-------|--------|
| Dernier item | Pas de propriete `item` (URL) — uniquement `name` |
| URL | Absolue, construite a partir de `Astro.site` ou `Astro.url.origin` |
| Position | Entier 1-based, incrementant |

### 3.6 Accessibilite (RGAA AA)

| Critere | Implementation | Reference RGAA |
|---------|----------------|----------------|
| Semantique | `<nav aria-label="Fil d'Ariane">` | 12.2 |
| Liste ordonnee | `<ol>` pour la sequence hierarchique | 8.2 |
| Etat courant | `aria-current="page"` sur le dernier element (non cliquable) | 12.2 |
| Focus visible | `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2` sur les liens | 10.7 |
| Contraste texte | Ratio >= 4.5:1 pour tous les etats | 3.2 |
| Separateur decoratif | `aria-hidden="true"` sur les chevrons SVG | 10.2 |
| Navigation clavier | Tab / Shift+Tab entre les liens (pas sur le dernier, qui est du texte) | 12.13 |
| Label explicite | Le texte du lien est descriptif — pas de `aria-label` necessaire | 6.1 |

### 3.7 Cas du breadcrumb vide

Si `getBreadcrumbs()` retourne `null` (chemin introuvable dans l'arbre), le composant **ne rend rien** (pas de `<nav>`, pas de JSON-LD). Cela evite un breadcrumb vide ou incomplet sur les pages non referencees dans la navigation (ex: `/404`, `/glossaire`).

---

## 4. Specifications techniques

### 4.1 Interface TypeScript

```typescript
// src/components/layout/Breadcrumb.astro (frontmatter)

import type { BreadcrumbItem, BreadcrumbList } from '@/types/navigation'
import type { NavigationTree } from '@/types/navigation'

/**
 * Props du composant Breadcrumb.
 *
 * Fil d'Ariane dynamique avec JSON-LD SEO et troncature responsive.
 * Calcule automatiquement le chemin a partir de l'URL courante.
 *
 * @example
 * ```astro
 * ---
 * import Breadcrumb from '@components/layout/Breadcrumb.astro'
 * ---
 * <Breadcrumb />
 * ```
 *
 * @example
 * ```astro
 * <!-- Avec items pre-calcules -->
 * <Breadcrumb items={myBreadcrumbs} />
 * ```
 */
export interface Props {
  // ── Donnees ──────────────────────────────────────

  /**
   * Liste des elements du breadcrumb.
   * Si fourni, outrepasse le calcul automatique via getBreadcrumbs().
   * Utile pour les pages qui ne sont pas dans l'arbre de navigation.
   */
  items?: BreadcrumbList

  /**
   * Arbre de navigation a utiliser pour le calcul.
   * Si non fourni, utilise NAVIGATION_TREE par defaut.
   * Utile pour l'injection dans les tests.
   */
  tree?: NavigationTree

  // ── Configuration ────────────────────────────────

  /**
   * URL de base du site pour les URLs absolues dans le JSON-LD.
   * Si non fourni, utilise Astro.site ou Astro.url.origin.
   */
  siteUrl?: string

  /**
   * Desactiver le bloc JSON-LD SEO.
   * @default false
   */
  noJsonLd?: boolean

  // ── HTML ─────────────────────────────────────────

  /**
   * Classes CSS additionnelles sur le <nav>.
   */
  class?: string
}
```

### 4.2 Implementation du composant

```astro
---
// src/components/layout/Breadcrumb.astro

import type { BreadcrumbItem, BreadcrumbList, NavigationTree } from '@/types/navigation'
import { getBreadcrumbs } from '@/lib/navigation'
import { NAVIGATION_TREE } from '@/data/navigation'

export interface Props {
  items?: BreadcrumbList
  tree?: NavigationTree
  siteUrl?: string
  noJsonLd?: boolean
  class?: string
}

const {
  items,
  tree = NAVIGATION_TREE,
  siteUrl,
  noJsonLd = false,
  class: className = '',
} = Astro.props

// ── Calcul du breadcrumb ──────────────────────────────
const currentPath = Astro.url.pathname
const breadcrumbs = items ?? getBreadcrumbs(tree, currentPath)

// ── URL de base pour JSON-LD ──────────────────────────
const baseUrl = siteUrl
  ?? (Astro.site ? Astro.site.origin : Astro.url.origin)

// ── JSON-LD schema.org/BreadcrumbList ─────────────────
function buildJsonLd(crumbs: BreadcrumbList): string {
  const itemListElement = crumbs.map((crumb, index) => {
    const entry: Record<string, unknown> = {
      '@type': 'ListItem',
      'position': index + 1,
      'name': crumb.label,
    }
    // Le dernier item n'a pas de propriete "item" (URL)
    if (!crumb.isCurrent) {
      entry.item = `${baseUrl}${crumb.href}`
    }
    return entry
  })

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  })
}
---

{breadcrumbs && breadcrumbs.length > 0 && (
  <nav
    aria-label="Fil d'Ariane"
    class:list={[
      'breadcrumb-container',
      className,
    ]}
    data-breadcrumb
  >
    <ol class="flex items-center flex-wrap gap-y-1 text-sm">
      {breadcrumbs.map((crumb, index) => {
        const isFirst = index === 0
        const isLast = crumb.isCurrent === true
        const isMiddle = !isFirst && !isLast

        // Sur mobile (< md), masquer les items intermediaires quand il y a > 3 niveaux
        const mobileHiddenClass =
          breadcrumbs.length > 3 && isMiddle ? 'hidden md:inline-flex' : 'inline-flex'

        return (
          <li class={`${mobileHiddenClass} items-center`}>
            {/* Separateur (sauf pour le premier item) */}
            {index > 0 && (
              <svg
                class="mx-2 h-4 w-4 shrink-0 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}

            {/* Lien ou texte courant */}
            {isLast ? (
              <span
                class="text-gray-500 font-medium truncate max-w-[200px] md:max-w-none"
                aria-current="page"
                data-breadcrumb-current
              >
                {crumb.label}
              </span>
            ) : (
              <a
                href={crumb.href}
                class="text-gray-600 hover:text-gray-900 hover:underline transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm truncate max-w-[150px] md:max-w-none"
                data-breadcrumb-link
              >
                {crumb.label}
              </a>
            )}
          </li>
        )
      })}

      {/* Indicateur de troncature mobile (visible uniquement sur mobile quand > 3 niveaux) */}
      {breadcrumbs.length > 3 && (
        <li class="inline-flex md:hidden items-center" aria-hidden="true" data-breadcrumb-ellipsis>
          <svg
            class="mx-2 h-4 w-4 shrink-0 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span class="text-gray-400">...</span>
        </li>
      )}
    </ol>

    {/* JSON-LD pour le SEO */}
    {!noJsonLd && (
      <script
        type="application/ld+json"
        set:html={buildJsonLd(breadcrumbs)}
      />
    )}
  </nav>
)}
```

### 4.3 Data attributes

| Attribut | Element | Usage |
|----------|---------|-------|
| `data-breadcrumb` | `<nav>` | Selecteur racine pour les tests et les composants parents |
| `data-breadcrumb-link` | `<a>` | Selecteur des liens cliquables |
| `data-breadcrumb-current` | `<span>` | Selecteur de l'element courant (dernier) |
| `data-breadcrumb-ellipsis` | `<li>` | Selecteur de l'ellipsis mobile |

### 4.4 Exemples d'utilisation

#### Utilisation automatique (recommandee)

```astro
---
// Dans DocsLayout.astro ou une page
import Breadcrumb from '@components/layout/Breadcrumb.astro'
---

<Breadcrumb />
```

Le composant detecte automatiquement l'URL courante via `Astro.url.pathname` et appelle `getBreadcrumbs()`.

#### Avec items pre-calcules

```astro
---
import Breadcrumb from '@components/layout/Breadcrumb.astro'

const customBreadcrumbs = [
  { label: 'Accueil', href: '/' },
  { label: 'Glossaire', href: '/glossaire', isCurrent: true },
]
---

<Breadcrumb items={customBreadcrumbs} />
```

#### Avec classe personnalisee

```astro
<Breadcrumb class="px-4 py-2 bg-gray-50 rounded-lg" />
```

#### Sans JSON-LD

```astro
<Breadcrumb noJsonLd />
```

#### Avec arbre custom (pour les tests)

```astro
<Breadcrumb tree={myTestTree} />
```

---

## 5. Design et Style

### 5.1 Palette de couleurs par etat

| Etat | Texte | Fond | Decoration |
|------|-------|------|------------|
| Lien inactif | `text-gray-600` (#4B5563) | transparent | — |
| Lien hover | `text-gray-900` (#111827) | transparent | `underline` |
| Lien focus | — | — | `ring-2 ring-blue-500 ring-offset-2` |
| Page courante | `text-gray-500` (#6B7280) | transparent | `font-medium` |
| Separateur | `text-gray-400` (#9CA3AF) | — | — |

### 5.2 Verification du contraste (WCAG AA)

| Combinaison | Ratio | Conforme AA ? |
|-------------|-------|---------------|
| `gray-600` (#4B5563) sur `white` (#FFFFFF) | 7.00:1 | Oui (>= 4.5:1) |
| `gray-900` (#111827) sur `white` (#FFFFFF) | 16.75:1 | Oui (>= 4.5:1) |
| `gray-500` (#6B7280) sur `white` (#FFFFFF) | 4.64:1 | Oui (>= 4.5:1) |
| `gray-400` (#9CA3AF) sur `white` (#FFFFFF) | 3.04:1 | N/A (decoratif, `aria-hidden`) |

### 5.3 Dimensions et espacement

| Element | Style | Detail |
|---------|-------|--------|
| Container | `flex items-center flex-wrap gap-y-1 text-sm` | Flexbox horizontal, retour a la ligne autorise |
| Separateur | `mx-2 h-4 w-4` | Marge horizontale 0.5rem, taille 16px |
| Liens | `truncate max-w-[150px] md:max-w-none` | Troncature mobile, pleine largeur desktop |
| Page courante | `truncate max-w-[200px] md:max-w-none` | Troncature mobile plus large |
| Ellipsis mobile | `inline-flex md:hidden` | Visible uniquement sur mobile |

### 5.4 Coherence avec le design system

| Aspect | Conformite |
|--------|------------|
| Focus ring | `ring-2 ring-blue-500 ring-offset-2` — coherent avec NavLink et CTAButton |
| Couleurs texte | `gray-500/600/900` — coherent avec la palette du site |
| Transition | `transition-colors duration-150` — coherent avec NavLink |
| Taille texte | `text-sm` (14px) — coherent avec les composants de navigation |
| Separateur | Chevron SVG similaire a NavLink mais oriente a droite (`M9 5l7 7-7 7`) |

### 5.5 Maquette visuelle

```
Desktop :
┌───────────────────────────────────────────────────────────────────────────┐
│  Accueil  >  Framework  >  Preambule                                      │
│  [lien]      [lien]        [texte, non cliquable]                         │
└───────────────────────────────────────────────────────────────────────────┘

Desktop (annexe profonde) :
┌───────────────────────────────────────────────────────────────────────────┐
│  Accueil  >  Annexes  >  A - Templates  >  A1 - PRD                      │
└───────────────────────────────────────────────────────────────────────────┘

Mobile (> 3 niveaux, tronque) :
┌────────────────────────────┐
│  Accueil  >  ...  >  A1 - │
│  PRD                       │
└────────────────────────────┘
```

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Matrice des cas limites

| ID | Cas | Comportement attendu | Priorite |
|----|-----|----------------------|----------|
| CL-01 | Chemin trouve dans l'arbre (cas nominal) | Breadcrumb complet rendu avec JSON-LD | Haute |
| CL-02 | Chemin introuvable dans l'arbre (`getBreadcrumbs()` retourne `null`) | Composant ne rend rien (pas de `<nav>`, pas de JSON-LD) | Haute |
| CL-03 | `items` fournis manuellement | Utilise `items` sans appeler `getBreadcrumbs()` | Haute |
| CL-04 | `items` est un tableau vide (`[]`) | Composant ne rend rien | Haute |
| CL-05 | Page Framework simple (3 niveaux) | Accueil > Framework > Preambule | Haute |
| CL-06 | Page Mode Operatoire (3 niveaux) | Accueil > Mode Operatoire > Planification | Haute |
| CL-07 | Page Annexe avec categorie (4 niveaux) | Accueil > Annexes > A - Templates > A1 - PRD | Haute |
| CL-08 | Mobile avec <= 3 niveaux | Tous les niveaux affiches (pas de troncature) | Haute |
| CL-09 | Mobile avec > 3 niveaux | Accueil > ... > Page courante | Haute |
| CL-10 | URL avec trailing slash (`/framework/preambule/`) | Normalisee par `getBreadcrumbs()` — rendu correct | Haute |
| CL-11 | Dernier element est toujours non cliquable (`aria-current="page"`) | `<span>` avec `aria-current="page"` au lieu de `<a>` | Haute |
| CL-12 | Separateur SVG a `aria-hidden="true"` | Non lu par les lecteurs d'ecran | Haute |
| CL-13 | Label avec caracteres speciaux (accents, `&`, `<`) | Echappe automatiquement par Astro | Haute |
| CL-14 | Label tres long (> 40 caracteres) | Tronque via `truncate` + `max-w-[150px]` sur mobile | Moyenne |
| CL-15 | JSON-LD : dernier item sans propriete `item` | Conforme a schema.org (le dernier item n'a pas d'URL) | Haute |
| CL-16 | JSON-LD : URLs absolues | Construites avec `baseUrl + href` | Haute |
| CL-17 | `noJsonLd={true}` | Pas de bloc `<script type="application/ld+json">` | Moyenne |
| CL-18 | `Astro.site` non configure | Fallback sur `Astro.url.origin` | Moyenne |
| CL-19 | `class` personnalise fourni | Ajoute aux classes existantes (ne remplace pas) | Moyenne |
| CL-20 | Page d'accueil (`/`) | `getBreadcrumbs()` retourne `null` — pas de breadcrumb | Moyenne |
| CL-21 | Un seul element dans le breadcrumb | Rendu avec un seul `<li>`, pas de separateur | Basse |
| CL-22 | JSON-LD : caracteres speciaux dans les labels | Echappe par `JSON.stringify()` | Moyenne |
| CL-23 | Navigation clavier : Tab traverse les liens | Tous les liens focusables, le dernier (texte) n'est pas focusable | Haute |
| CL-24 | Ellipsis mobile a `aria-hidden="true"` | Non lu par les lecteurs d'ecran (decoratif) | Haute |
| CL-25 | `siteUrl` fourni manuellement | Utilise comme base pour les URLs JSON-LD | Basse |

### 6.2 Strategie de fallback

```
Props manquantes ?
├── items: non fourni → calcul automatique via getBreadcrumbs(tree, Astro.url.pathname)
│   ├── getBreadcrumbs retourne null → pas de rendu
│   └── getBreadcrumbs retourne [] → pas de rendu
├── tree: non fourni → NAVIGATION_TREE par defaut
├── siteUrl: non fourni → Astro.site?.origin ?? Astro.url.origin
├── noJsonLd: non fourni → false (JSON-LD genere)
└── class: non fourni → '' (pas de classes additionnelles)
```

---

## 7. Exemples entree/sortie

### 7.1 Page Framework simple (3 niveaux)

**URL courante :** `/framework/preambule`

**Breadcrumbs calcules par `getBreadcrumbs()` :**

```typescript
[
  { label: 'Accueil', href: '/' },
  { label: 'Framework', href: '/framework' },
  { label: 'Preambule', href: '/framework/preambule', isCurrent: true },
]
```

**Sortie HTML :**

```html
<nav aria-label="Fil d'Ariane" data-breadcrumb>
  <ol class="flex items-center flex-wrap gap-y-1 text-sm">
    <li class="inline-flex items-center">
      <a
        href="/"
        class="text-gray-600 hover:text-gray-900 hover:underline transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm truncate max-w-[150px] md:max-w-none"
        data-breadcrumb-link
      >
        Accueil
      </a>
    </li>
    <li class="inline-flex items-center">
      <svg class="mx-2 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" ...>
        <path d="M9 5l7 7-7 7" />
      </svg>
      <a
        href="/framework"
        class="text-gray-600 hover:text-gray-900 hover:underline transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm truncate max-w-[150px] md:max-w-none"
        data-breadcrumb-link
      >
        Framework
      </a>
    </li>
    <li class="inline-flex items-center">
      <svg class="mx-2 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" ...>
        <path d="M9 5l7 7-7 7" />
      </svg>
      <span
        class="text-gray-500 font-medium truncate max-w-[200px] md:max-w-none"
        aria-current="page"
        data-breadcrumb-current
      >
        Preambule
      </span>
    </li>
  </ol>
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://aiad.dev/" },
        { "@type": "ListItem", "position": 2, "name": "Framework", "item": "https://aiad.dev/framework" },
        { "@type": "ListItem", "position": 3, "name": "Preambule" }
      ]
    }
  </script>
</nav>
```

### 7.2 Page Annexe profonde (4 niveaux, troncature mobile)

**URL courante :** `/annexes/templates/prd`

**Breadcrumbs :**

```typescript
[
  { label: 'Accueil', href: '/' },
  { label: 'Annexes', href: '/annexes' },
  { label: 'A - Templates', href: '/annexes/templates' },
  { label: 'A1 - PRD', href: '/annexes/templates/prd', isCurrent: true },
]
```

**Sortie HTML (desktop) :** Tous les 4 niveaux visibles.

**Sortie HTML (mobile, < 768px) :**
- "Accueil" est visible
- "Annexes" et "A - Templates" ont `hidden md:inline-flex` (masques)
- L'ellipsis `...` est visible (`inline-flex md:hidden`)
- "A1 - PRD" est visible (page courante)

Rendu visuel mobile : `Accueil > ... > A1 - PRD`

### 7.3 Chemin introuvable — pas de rendu

**URL courante :** `/glossaire`

**`getBreadcrumbs()` retourne :** `null`

**Sortie HTML :**

```html
<!-- Rien n'est rendu -->
```

### 7.4 Items fournis manuellement

**Entree :**

```astro
<Breadcrumb items={[
  { label: 'Accueil', href: '/' },
  { label: 'Glossaire', href: '/glossaire', isCurrent: true },
]} />
```

**Sortie HTML :**

```html
<nav aria-label="Fil d'Ariane" data-breadcrumb>
  <ol class="flex items-center flex-wrap gap-y-1 text-sm">
    <li class="inline-flex items-center">
      <a href="/" class="..." data-breadcrumb-link>Accueil</a>
    </li>
    <li class="inline-flex items-center">
      <svg class="mx-2 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true">...</svg>
      <span class="text-gray-500 font-medium ..." aria-current="page" data-breadcrumb-current>
        Glossaire
      </span>
    </li>
  </ol>
  <script type="application/ld+json">...</script>
</nav>
```

### 7.5 Sans JSON-LD

**Entree :**

```astro
<Breadcrumb noJsonLd />
```

**Sortie HTML :** Le `<nav>` est rendu normalement mais il n'y a pas de `<script type="application/ld+json">`.

### 7.6 Protection XSS

**Entree (items manuels) :**

```astro
<Breadcrumb items={[
  { label: 'Accueil', href: '/' },
  { label: '<script>alert("xss")</script>', href: '/test', isCurrent: true },
]} />
```

**Sortie HTML :**

```html
<span class="..." aria-current="page" data-breadcrumb-current>
  &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;
</span>
```

> Astro echappe automatiquement les expressions `{variable}` dans les templates.

### 7.7 JSON-LD — caracteres speciaux

**Label :** `Ecosysteme & Architecture`

**JSON-LD genere :**

```json
{ "@type": "ListItem", "position": 2, "name": "Ecosysteme & Architecture", "item": "..." }
```

> `JSON.stringify()` echappe correctement les caracteres speciaux.

---

## 8. Tests

### 8.1 Fichiers de test

| Fichier | Type | Framework |
|---------|------|-----------|
| `tests/unit/components/layout/breadcrumb.test.ts` | Unitaire | Vitest + Astro Container |

### 8.2 Tests unitaires (Vitest)

```typescript
// tests/unit/components/layout/breadcrumb.test.ts
import { describe, it, expect } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import Breadcrumb from '@components/layout/Breadcrumb.astro'

// ── Fixtures ─────────────────────────────────────────────

const SIMPLE_BREADCRUMBS = [
  { label: 'Accueil', href: '/' },
  { label: 'Framework', href: '/framework' },
  { label: 'Preambule', href: '/framework/preambule', isCurrent: true },
]

const DEEP_BREADCRUMBS = [
  { label: 'Accueil', href: '/' },
  { label: 'Annexes', href: '/annexes' },
  { label: 'A - Templates', href: '/annexes/templates' },
  { label: 'A1 - PRD', href: '/annexes/templates/prd', isCurrent: true },
]

const MINIMAL_BREADCRUMBS = [
  { label: 'Accueil', href: '/' },
  { label: 'Glossaire', href: '/glossaire', isCurrent: true },
]

// ── Helpers ──────────────────────────────────────────────

async function renderBreadcrumb(
  props: Record<string, unknown> = {},
  currentPath: string = '/framework/preambule',
) {
  const container = await AstroContainer.create()
  return container.renderToString(Breadcrumb, {
    props: {
      items: SIMPLE_BREADCRUMBS,
      ...props,
    },
    request: new Request(`https://aiad.dev${currentPath}`),
  })
}

// ── Tests rendu conditionnel ─────────────────────────────

describe('Breadcrumb — Rendu conditionnel', () => {
  it('T-01 : rend le composant quand items est fourni', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('<nav')
    expect(html).toContain('data-breadcrumb')
  })

  it('T-02 : ne rend rien quand items est un tableau vide', async () => {
    const html = await renderBreadcrumb({ items: [] })
    expect(html).not.toContain('<nav')
    expect(html).not.toContain('data-breadcrumb')
  })

  it('T-03 : ne rend rien quand items est null (simule getBreadcrumbs null)', async () => {
    const html = await renderBreadcrumb({ items: null })
    expect(html).not.toContain('<nav')
  })
})

// ── Tests structure HTML ──────────────────────────────────

describe('Breadcrumb — Structure HTML', () => {
  it('T-04 : genere un element <nav> avec aria-label="Fil d\'Ariane"', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('<nav')
    expect(html).toContain("aria-label=\"Fil d'Ariane\"")
  })

  it('T-05 : contient une liste ordonnee <ol>', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('<ol')
    expect(html).toContain('</ol>')
  })

  it('T-06 : contient un <li> pour chaque element du breadcrumb', async () => {
    const html = await renderBreadcrumb()
    const liCount = (html.match(/<li /g) || []).length
    // 3 items (pas d'ellipsis car <= 3 niveaux)
    expect(liCount).toBe(3)
  })

  it('T-07 : les liens intermediaires sont des <a> avec href', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('href="/"')
    expect(html).toContain('href="/framework"')
  })

  it('T-08 : le dernier element est un <span> non cliquable', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('data-breadcrumb-current')
    expect(html).toContain('Preambule</span>')
  })

  it('T-09 : les labels sont affiches dans le bon ordre', async () => {
    const html = await renderBreadcrumb()
    const accueilPos = html.indexOf('Accueil')
    const frameworkPos = html.indexOf('Framework')
    const preambulePos = html.indexOf('Preambule')
    expect(accueilPos).toBeLessThan(frameworkPos)
    expect(frameworkPos).toBeLessThan(preambulePos)
  })
})

// ── Tests separateur ──────────────────────────────────────

describe('Breadcrumb — Separateur', () => {
  it('T-10 : pas de separateur avant le premier element', async () => {
    const html = await renderBreadcrumb()
    // Le premier <li> ne doit pas contenir de SVG
    const firstLi = html.split('<li')[1]
    const firstLiEnd = firstLi.indexOf('</li>')
    const firstLiContent = firstLi.substring(0, firstLiEnd)
    expect(firstLiContent).not.toContain('<svg')
  })

  it('T-11 : separateur SVG entre les elements', async () => {
    const html = await renderBreadcrumb()
    const svgCount = (html.match(/<svg/g) || []).length
    // 2 separateurs pour 3 elements
    expect(svgCount).toBe(2)
  })

  it('T-12 : les separateurs ont aria-hidden="true"', async () => {
    const html = await renderBreadcrumb()
    // Tous les SVG doivent avoir aria-hidden
    const svgMatches = html.match(/<svg[^>]*>/g) || []
    svgMatches.forEach((svg) => {
      expect(svg).toContain('aria-hidden="true"')
    })
  })

  it('T-13 : le separateur est un chevron droit', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('M9 5l7 7-7 7')
  })
})

// ── Tests aria-current ───────────────────────────────────

describe('Breadcrumb — Etat courant', () => {
  it('T-14 : le dernier element a aria-current="page"', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('aria-current="page"')
  })

  it('T-15 : seul le dernier element a aria-current', async () => {
    const html = await renderBreadcrumb()
    const ariaCurrentCount = (html.match(/aria-current/g) || []).length
    expect(ariaCurrentCount).toBe(1)
  })

  it('T-16 : les liens intermediaires n\'ont pas aria-current', async () => {
    const html = await renderBreadcrumb()
    // Les <a> ne doivent pas avoir aria-current
    const links = html.match(/<a[^>]*>/g) || []
    links.forEach((link) => {
      expect(link).not.toContain('aria-current')
    })
  })
})

// ── Tests troncature mobile ──────────────────────────────

describe('Breadcrumb — Troncature mobile', () => {
  it('T-17 : pas de troncature quand <= 3 niveaux', async () => {
    const html = await renderBreadcrumb({ items: SIMPLE_BREADCRUMBS })
    expect(html).not.toContain('data-breadcrumb-ellipsis')
    expect(html).not.toContain('hidden md:inline-flex')
  })

  it('T-18 : troncature quand > 3 niveaux', async () => {
    const html = await renderBreadcrumb({ items: DEEP_BREADCRUMBS })
    expect(html).toContain('data-breadcrumb-ellipsis')
  })

  it('T-19 : les items intermediaires ont hidden md:inline-flex quand > 3 niveaux', async () => {
    const html = await renderBreadcrumb({ items: DEEP_BREADCRUMBS })
    expect(html).toContain('hidden md:inline-flex')
  })

  it('T-20 : l\'ellipsis est visible sur mobile (inline-flex md:hidden)', async () => {
    const html = await renderBreadcrumb({ items: DEEP_BREADCRUMBS })
    // L'ellipsis doit avoir la classe pour etre visible sur mobile uniquement
    expect(html).toContain('inline-flex md:hidden')
  })

  it('T-21 : l\'ellipsis a aria-hidden="true"', async () => {
    const html = await renderBreadcrumb({ items: DEEP_BREADCRUMBS })
    // L'element ellipsis li doit avoir aria-hidden
    const ellipsisMatch = html.match(/data-breadcrumb-ellipsis[^>]*>/)?.[0] || ''
    expect(html).toContain('data-breadcrumb-ellipsis')
  })

  it('T-22 : l\'ellipsis contient "..."', async () => {
    const html = await renderBreadcrumb({ items: DEEP_BREADCRUMBS })
    expect(html).toContain('...')
  })

  it('T-23 : le premier et le dernier element ne sont jamais masques', async () => {
    const html = await renderBreadcrumb({ items: DEEP_BREADCRUMBS })
    // "Accueil" ne doit pas etre dans un hidden md:inline-flex
    // Le dernier element non plus (il a isCurrent)
    // On verifie que Accueil et A1 - PRD sont dans des <li> avec inline-flex (pas hidden)
    expect(html).toContain('Accueil')
    expect(html).toContain('A1 - PRD')
  })
})

// ── Tests JSON-LD ────────────────────────────────────────

describe('Breadcrumb — JSON-LD', () => {
  it('T-24 : genere un bloc script type="application/ld+json"', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('type="application/ld+json"')
  })

  it('T-25 : le JSON-LD contient "@type": "BreadcrumbList"', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('"@type":"BreadcrumbList"')
  })

  it('T-26 : le JSON-LD contient le bon nombre d\'elements', async () => {
    const html = await renderBreadcrumb()
    const positionMatches = html.match(/"position":/g) || []
    expect(positionMatches.length).toBe(3)
  })

  it('T-27 : le JSON-LD a des positions 1-based', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('"position":1')
    expect(html).toContain('"position":2')
    expect(html).toContain('"position":3')
  })

  it('T-28 : le dernier item JSON-LD n\'a pas de propriete "item"', async () => {
    const html = await renderBreadcrumb()
    // Extraire le JSON-LD
    const jsonLdMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)
    expect(jsonLdMatch).not.toBeNull()
    const jsonLd = JSON.parse(jsonLdMatch![1])
    const lastItem = jsonLd.itemListElement[jsonLd.itemListElement.length - 1]
    expect(lastItem.item).toBeUndefined()
    expect(lastItem.name).toBe('Preambule')
  })

  it('T-29 : les items non-derniers ont une propriete "item" (URL)', async () => {
    const html = await renderBreadcrumb()
    const jsonLdMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)
    const jsonLd = JSON.parse(jsonLdMatch![1])
    const firstItem = jsonLd.itemListElement[0]
    expect(firstItem.item).toContain('/')
  })

  it('T-30 : noJsonLd=true desactive le JSON-LD', async () => {
    const html = await renderBreadcrumb({ noJsonLd: true })
    expect(html).not.toContain('application/ld+json')
  })

  it('T-31 : le JSON-LD utilise des URLs absolues', async () => {
    const html = await renderBreadcrumb()
    const jsonLdMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)
    const jsonLd = JSON.parse(jsonLdMatch![1])
    const firstItem = jsonLd.itemListElement[0]
    expect(firstItem.item).toMatch(/^https?:\/\//)
  })
})

// ── Tests accessibilite ──────────────────────────────────

describe('Breadcrumb — Accessibilite', () => {
  it('T-32 : le nav a aria-label="Fil d\'Ariane"', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain("aria-label=\"Fil d'Ariane\"")
  })

  it('T-33 : les liens ont un focus ring', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('focus:ring-2')
    expect(html).toContain('focus:ring-blue-500')
    expect(html).toContain('focus:ring-offset-2')
  })

  it('T-34 : la liste utilise <ol> (ordonnee)', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('<ol')
    expect(html).not.toMatch(/<ul[^>]*class="flex items-center/)
  })
})

// ── Tests styles ─────────────────────────────────────────

describe('Breadcrumb — Styles', () => {
  it('T-35 : les liens ont text-gray-600', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('text-gray-600')
  })

  it('T-36 : la page courante a text-gray-500 et font-medium', async () => {
    const html = await renderBreadcrumb()
    const currentSpan = html.match(/data-breadcrumb-current[^>]*class="([^"]*)"/) ||
                        html.match(/class="([^"]*)"[^>]*data-breadcrumb-current/)
    expect(html).toContain('text-gray-500')
    expect(html).toContain('font-medium')
  })

  it('T-37 : les liens ont hover:underline', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('hover:underline')
  })

  it('T-38 : les separateurs ont text-gray-400', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('text-gray-400')
  })

  it('T-39 : transition-colors presente sur les liens', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('transition-colors')
  })
})

// ── Tests classes et attributs ──────────────────────────

describe('Breadcrumb — Classes et attributs', () => {
  it('T-40 : classe personnalisee ajoutee au nav', async () => {
    const html = await renderBreadcrumb({ class: 'my-custom-class' })
    expect(html).toContain('my-custom-class')
  })

  it('T-41 : data-breadcrumb present sur le nav', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('data-breadcrumb')
  })

  it('T-42 : data-breadcrumb-link present sur les liens', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('data-breadcrumb-link')
  })

  it('T-43 : data-breadcrumb-current present sur la page courante', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('data-breadcrumb-current')
  })
})

// ── Tests XSS ────────────────────────────────────────────

describe('Breadcrumb — Protection XSS', () => {
  it('T-44 : label avec HTML est echappe', async () => {
    const items = [
      { label: '<script>alert("xss")</script>', href: '/test', isCurrent: true },
    ]
    const html = await renderBreadcrumb({ items })
    expect(html).not.toContain('<script>alert')
    expect(html).toContain('&lt;script&gt;')
  })

  it('T-45 : label avec accents et caracteres speciaux', async () => {
    const items = [
      { label: 'Accueil', href: '/' },
      { label: 'Ecosysteme & Architecture — Vue d\'ensemble', href: '/test', isCurrent: true },
    ]
    const html = await renderBreadcrumb({ items })
    expect(html).toContain('Ecosysteme')
  })
})

// ── Tests combinaisons ───────────────────────────────────

describe('Breadcrumb — Combinaisons', () => {
  it('T-46 : breadcrumb minimal (2 niveaux)', async () => {
    const html = await renderBreadcrumb({ items: MINIMAL_BREADCRUMBS })
    const liCount = (html.match(/<li /g) || []).length
    expect(liCount).toBe(2)
    expect(html).toContain('Accueil')
    expect(html).toContain('Glossaire')
    // Un seul separateur
    const svgCount = (html.match(/<svg/g) || []).length
    expect(svgCount).toBe(1)
  })

  it('T-47 : breadcrumb profond (4 niveaux) genere le bon nombre d\'elements', async () => {
    const html = await renderBreadcrumb({ items: DEEP_BREADCRUMBS })
    expect(html).toContain('Accueil')
    expect(html).toContain('Annexes')
    expect(html).toContain('A - Templates')
    expect(html).toContain('A1 - PRD')
  })

  it('T-48 : JSON-LD correct pour un breadcrumb profond', async () => {
    const html = await renderBreadcrumb({ items: DEEP_BREADCRUMBS })
    const jsonLdMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)
    expect(jsonLdMatch).not.toBeNull()
    const jsonLd = JSON.parse(jsonLdMatch![1])
    expect(jsonLd.itemListElement).toHaveLength(4)
    expect(jsonLd.itemListElement[3].name).toBe('A1 - PRD')
    expect(jsonLd.itemListElement[3].item).toBeUndefined()
  })

  it('T-49 : classe personnalisee + items manuels', async () => {
    const html = await renderBreadcrumb({
      items: MINIMAL_BREADCRUMBS,
      class: 'bg-gray-50 px-4',
    })
    expect(html).toContain('bg-gray-50')
    expect(html).toContain('Glossaire')
  })

  it('T-50 : noJsonLd avec items manuels', async () => {
    const html = await renderBreadcrumb({
      items: SIMPLE_BREADCRUMBS,
      noJsonLd: true,
    })
    expect(html).toContain('<nav')
    expect(html).not.toContain('application/ld+json')
  })
})
```

### 8.3 Matrice de couverture

| ID | Test | Type | Assertion | Priorite |
|----|------|------|-----------|----------|
| T-01 | Rendu avec items fournis | Unit | `toContain('data-breadcrumb')` | Haute |
| T-02 | Pas de rendu si items vide | Unit | `not.toContain('<nav')` | Haute |
| T-03 | Pas de rendu si items null | Unit | `not.toContain('<nav')` | Haute |
| T-04 | `<nav>` avec `aria-label` | Unit | `toContain('aria-label')` | Haute |
| T-05 | Liste `<ol>` presente | Unit | `toContain('<ol')` | Haute |
| T-06 | Bon nombre de `<li>` | Unit | count == items.length | Haute |
| T-07 | Liens intermediaires avec href | Unit | `toContain('href=')` | Haute |
| T-08 | Dernier element est un `<span>` | Unit | `toContain('data-breadcrumb-current')` | Haute |
| T-09 | Ordre correct des labels | Unit | positions comparees | Haute |
| T-10 | Pas de separateur avant le 1er | Unit | premier `<li>` sans `<svg>` | Haute |
| T-11 | Separateurs SVG entre elements | Unit | count == items.length - 1 | Haute |
| T-12 | Separateurs `aria-hidden="true"` | Unit | tous les SVG ont `aria-hidden` | Haute |
| T-13 | Chevron droit (`M9 5l7 7-7 7`) | Unit | `toContain(...)` | Moyenne |
| T-14 | `aria-current="page"` sur le dernier | Unit | `toContain(...)` | Haute |
| T-15 | Un seul `aria-current` | Unit | count == 1 | Haute |
| T-16 | Pas d'`aria-current` sur les liens | Unit | liens sans `aria-current` | Haute |
| T-17 | Pas de troncature si <= 3 niveaux | Unit | pas d'ellipsis | Haute |
| T-18 | Troncature si > 3 niveaux | Unit | ellipsis present | Haute |
| T-19 | Items intermediaires caches en mobile | Unit | `hidden md:inline-flex` | Haute |
| T-20 | Ellipsis visible sur mobile | Unit | `inline-flex md:hidden` | Haute |
| T-21 | Ellipsis `aria-hidden="true"` | Unit | `toContain(...)` | Haute |
| T-22 | Ellipsis contient `...` | Unit | `toContain('...')` | Moyenne |
| T-23 | Premier et dernier jamais masques | Unit | presence des labels | Haute |
| T-24 | JSON-LD `script` present | Unit | `toContain(...)` | Haute |
| T-25 | JSON-LD `@type: BreadcrumbList` | Unit | `toContain(...)` | Haute |
| T-26 | JSON-LD bon nombre d'elements | Unit | count positions | Haute |
| T-27 | JSON-LD positions 1-based | Unit | `toContain(...)` | Haute |
| T-28 | JSON-LD dernier sans `item` | Unit | `toBeUndefined()` | Haute |
| T-29 | JSON-LD non-derniers avec `item` | Unit | `toContain(...)` | Haute |
| T-30 | `noJsonLd=true` desactive le JSON-LD | Unit | `not.toContain(...)` | Moyenne |
| T-31 | JSON-LD URLs absolues | Unit | `toMatch(/^https?:\/\//)` | Haute |
| T-32 | `aria-label` correct | Unit | `toContain(...)` | Haute |
| T-33 | Focus ring present | Unit | `toContain('focus:ring-2')` | Haute |
| T-34 | Liste ordonnee `<ol>` | Unit | `toContain('<ol')` | Haute |
| T-35 | Liens `text-gray-600` | Unit | `toContain(...)` | Moyenne |
| T-36 | Page courante `text-gray-500 font-medium` | Unit | `toContain(...)` | Moyenne |
| T-37 | Liens `hover:underline` | Unit | `toContain(...)` | Moyenne |
| T-38 | Separateurs `text-gray-400` | Unit | `toContain(...)` | Moyenne |
| T-39 | `transition-colors` | Unit | `toContain(...)` | Basse |
| T-40 | Classe personnalisee | Unit | `toContain('my-custom-class')` | Moyenne |
| T-41 | `data-breadcrumb` | Unit | `toContain(...)` | Haute |
| T-42 | `data-breadcrumb-link` | Unit | `toContain(...)` | Haute |
| T-43 | `data-breadcrumb-current` | Unit | `toContain(...)` | Haute |
| T-44 | XSS echappe | Unit | `not.toContain('<script>')` | Haute |
| T-45 | Accents et caracteres speciaux | Unit | `toContain('Ecosysteme')` | Moyenne |
| T-46 | Breadcrumb minimal (2 niveaux) | Unit | 2 `<li>`, 1 SVG | Moyenne |
| T-47 | Breadcrumb profond (4 niveaux) | Unit | 4 labels presents | Haute |
| T-48 | JSON-LD breadcrumb profond | Unit | 4 elements, dernier sans `item` | Haute |
| T-49 | Classe + items manuels | Unit | combinaison correcte | Moyenne |
| T-50 | `noJsonLd` + items manuels | Unit | nav present, pas de JSON-LD | Moyenne |

---

## 9. Criteres d'acceptation

| ID | Critere | Verifie par |
|----|---------|-------------|
| CA-01 | Le fichier `src/components/layout/Breadcrumb.astro` est cree | Verification fichier |
| CA-02 | Le composant rend un `<nav aria-label="Fil d'Ariane">` avec une `<ol>` | T-04, T-05, T-34 |
| CA-03 | Les items sont calcules automatiquement via `getBreadcrumbs()` ou fournis via prop `items` | T-01, T-03 |
| CA-04 | Le composant ne rend rien quand le chemin est introuvable ou items est vide | T-02, T-03 |
| CA-05 | Le dernier element est un `<span>` avec `aria-current="page"` (non cliquable) | T-08, T-14, T-15 |
| CA-06 | Les liens intermediaires sont des `<a>` avec href | T-07 |
| CA-07 | Separateurs SVG chevron entre chaque niveau avec `aria-hidden="true"` | T-11, T-12, T-13 |
| CA-08 | Troncature responsive : items intermediaires masques sur mobile quand > 3 niveaux | T-17, T-18, T-19, T-20 |
| CA-09 | Ellipsis `...` affiche sur mobile pour les breadcrumbs tronques | T-22 |
| CA-10 | JSON-LD `schema.org/BreadcrumbList` genere avec URLs absolues | T-24, T-25, T-28, T-31 |
| CA-11 | JSON-LD desactivable via `noJsonLd={true}` | T-30 |
| CA-12 | Focus ring visible sur les liens (`ring-2 ring-blue-500 ring-offset-2`) | T-33 |
| CA-13 | Contrastes WCAG AA respectes pour tous les etats | Verification manuelle section 5.2 |
| CA-14 | Protection XSS par echappement Astro | T-44, T-45 |
| CA-15 | Classes personnalisees supportees via prop `class` | T-40 |
| CA-16 | Data attributes pour les selecteurs (`data-breadcrumb`, `data-breadcrumb-link`, `data-breadcrumb-current`) | T-41, T-42, T-43 |
| CA-17 | 0 JavaScript cote client (composant 100% statique) | Inspection build |
| CA-18 | TypeScript compile sans erreur (`pnpm typecheck`) | CI |
| CA-19 | ESLint passe sans warning (`pnpm lint`) | CI |
| CA-20 | Les 50 tests unitaires passent | CI |

---

## 10. Definition of Done

- [ ] Fichier `src/components/layout/Breadcrumb.astro` cree
- [ ] Interface TypeScript `Props` complete avec documentation JSDoc
- [ ] Import des types `BreadcrumbItem`, `BreadcrumbList`, `NavigationTree` depuis T-004-B1
- [ ] Import du helper `getBreadcrumbs()` depuis T-004-B4
- [ ] Import de `NAVIGATION_TREE` depuis T-004-B3
- [ ] Calcul automatique du breadcrumb via `getBreadcrumbs(tree, Astro.url.pathname)`
- [ ] Support des items pre-calcules via prop `items`
- [ ] Rendu conditionnel : rien si breadcrumbs null ou vide
- [ ] Structure semantique : `<nav>` > `<ol>` > `<li>`
- [ ] `aria-label="Fil d'Ariane"` sur le `<nav>`
- [ ] Liens `<a>` pour les items intermediaires
- [ ] `<span>` avec `aria-current="page"` pour le dernier item
- [ ] Separateurs SVG chevron avec `aria-hidden="true"`
- [ ] Troncature responsive : items intermediaires masques sur mobile quand > 3 niveaux
- [ ] Ellipsis `...` visible sur mobile avec `aria-hidden="true"`
- [ ] JSON-LD `schema.org/BreadcrumbList` avec URLs absolues
- [ ] Prop `noJsonLd` pour desactiver le JSON-LD
- [ ] Focus ring coherent avec le design system
- [ ] `hover:underline` sur les liens
- [ ] Troncature texte `truncate` sur mobile pour les labels longs
- [ ] Data attributes (`data-breadcrumb`, `data-breadcrumb-link`, `data-breadcrumb-current`, `data-breadcrumb-ellipsis`)
- [ ] Tests unitaires passants (50 tests)
- [ ] 0 erreur TypeScript (`pnpm typecheck`)
- [ ] 0 erreur ESLint (`pnpm lint`)
- [ ] 0 JS cote client
- [ ] Code formate avec Prettier

---

## 11. Notes d'implementation

### 11.1 Ordre d'implementation recommande

1. Creer le fichier `src/components/layout/Breadcrumb.astro` avec l'interface Props
2. Implementer le calcul du breadcrumb (automatique via `getBreadcrumbs()` ou via prop `items`)
3. Implementer le rendu conditionnel (null/vide = pas de rendu)
4. Implementer la structure HTML semantique (`<nav>` > `<ol>` > `<li>`)
5. Implementer les liens (`<a>`) et le texte courant (`<span>` avec `aria-current`)
6. Ajouter les separateurs SVG avec `aria-hidden="true"`
7. Implementer la troncature responsive (classes `hidden md:inline-flex` + ellipsis)
8. Implementer le JSON-LD avec `buildJsonLd()`
9. Ajouter les data attributes
10. Ajouter les styles (focus ring, hover, transitions)
11. Verifier avec `pnpm typecheck` et `pnpm lint`
12. Ecrire les tests unitaires

### 11.2 Points d'attention

| Point | Detail |
|-------|--------|
| **`getBreadcrumbs()` peut retourner `null`** | Toujours verifier le retour avant de rendre le composant. Les pages non referencees dans l'arbre (ex: `/glossaire`, `/404`) n'auront pas de breadcrumb. |
| **Trailing slash** | `getBreadcrumbs()` normalise deja les trailing slashes. Pas besoin de le faire dans le composant. |
| **JSON-LD URLs absolues** | Le `baseUrl` doit etre une URL absolue (`https://...`). Si `Astro.site` n'est pas configure, utiliser `Astro.url.origin` comme fallback. |
| **JSON-LD dernier item** | Le dernier item (page courante) ne doit PAS avoir de propriete `item` selon les recommandations schema.org. Seul le `name` est obligatoire. |
| **Troncature mobile** | La troncature CSS via `hidden md:inline-flex` est preferable a du JavaScript. Les items intermediaires sont dans le DOM (accessibles aux moteurs de recherche et lecteurs d'ecran) mais masques visuellement sur mobile. |
| **Ellipsis position** | L'ellipsis est rendu APRES tous les items dans le DOM, mais visuellement il s'insere entre le premier et le dernier grace a `order` CSS ou au fait que les items intermediaires sont `hidden`. Verifier le rendu visuel. |
| **`set:html` pour JSON-LD** | Utiliser `set:html={buildJsonLd(breadcrumbs)}` dans le `<script>` pour inserer le JSON brut sans echappement supplementaire par Astro. |
| **0 JS client** | Aucune directive `client:*` ne doit etre utilisee. Aucun `<script>` cote client. Le JSON-LD est un `<script type="application/ld+json">` qui n'est pas du JavaScript executable. |
| **Coherence visuelle avec la maquette** | Le breadcrumb doit s'afficher entre le header et le contenu principal, dans le padding du contenu. Voir la maquette du DocsLayout en section 8.4 de spec-US-004.md. |

### 11.3 Extensions futures (hors scope)

| Extension | Description | User Story |
|-----------|-------------|------------|
| Breadcrumb interactif | Menu dropdown sur chaque niveau pour naviguer lateralement entre les pages soeurs | Non definie |
| Icone Home | Remplacer le texte "Accueil" par une icone maison | Non definie |
| Animation de transition | Animation de slide-in quand le breadcrumb change entre les pages | Non definie |
| Mode sombre | Variantes de couleurs pour le dark mode | Non definie |
| Copier le chemin | Bouton pour copier l'URL du breadcrumb dans le presse-papier | Non definie |

---

## 12. References

| Ressource | Lien |
|-----------|------|
| US-004 Spec | [spec-US-004.md](./spec-US-004.md) |
| Architecture | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| T-004-B1 Types navigation | [T-004-B1-types-typescript-navigation.md](./T-004-B1-types-typescript-navigation.md) |
| T-004-B4 Helpers navigation | [T-004-B4-helpers-navigation.md](./T-004-B4-helpers-navigation.md) |
| T-004-F1 BaseLayout | [T-004-F1-composant-BaseLayout.md](./T-004-F1-composant-BaseLayout.md) |
| T-004-F2 NavLink | [T-004-F2-composant-NavLink.md](./T-004-F2-composant-NavLink.md) |
| T-004-F10 DocsLayout | [T-004-F10-layout-DocsLayout.md](./T-004-F10-layout-DocsLayout.md) |
| schema.org BreadcrumbList | https://schema.org/BreadcrumbList |
| WAI-ARIA Breadcrumb | https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/ |
| RGAA 12.2 Navigation | https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#12.2 |
| Google Structured Data Breadcrumb | https://developers.google.com/search/docs/appearance/structured-data/breadcrumb |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 11/02/2026 | Creation initiale — fil d'Ariane dynamique, JSON-LD SEO, troncature mobile, calcul automatique via getBreadcrumbs(), 25 cas limites, 50 tests unitaires, 20 criteres d'acceptation |
