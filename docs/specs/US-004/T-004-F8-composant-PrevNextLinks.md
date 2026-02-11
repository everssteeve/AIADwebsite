# T-004-F8 : Composant PrevNextLinks (liens Precedent/Suivant contextuels)

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

Creer le composant **PrevNextLinks** qui affiche les liens de navigation sequentielle (page precedente et page suivante) en bas de chaque page de documentation du site AIAD. Ce composant fournit :

- Un **rendu semantique** avec `<nav aria-label="Navigation entre les pages">` conforme aux bonnes pratiques WAI-ARIA
- Un **calcul automatique** des liens precedent/suivant via le helper `getPrevNext()` (T-004-B4)
- Des **fleches directionnelles** SVG (`←` pour precedent, `→` pour suivant)
- Un **indicateur de section** quand la navigation traverse une frontiere de section (ex: Framework → Mode Operatoire)
- Un rendu **responsive** avec labels complets sur desktop et abreges sur mobile
- La compatibilite avec les types `PrevNextLinks` et `PrevNextItem` definis en T-004-B1
- **0 JavaScript cote client** : le composant est 100% statique, calcule au build time

Ce composant est consomme par le layout `DocsLayout` (T-004-F10) et s'affiche entre le contenu principal et le footer.

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
│       ├── Breadcrumb.astro           # T-004-F6 (reference de style)
│       ├── TableOfContents.astro      # T-004-F7 (reference de style)
│       └── PrevNextLinks.astro        <-- CE COMPOSANT
├── types/
│   └── navigation.ts                  # Types PrevNextItem, PrevNextLinks (T-004-B1)
├── lib/
│   └── navigation.ts                  # getPrevNext() helper (T-004-B4)
├── data/
│   └── navigation.ts                  # NAVIGATION_TREE (T-004-B3)
├── layouts/
│   ├── BaseLayout.astro               # Layout racine (T-004-F1)
│   └── DocsLayout.astro               # Layout docs (T-004-F10) — consommateur
└── pages/
    └── framework/
        └── [...slug].astro            # Pages qui consomment le composant
```

### 2.3 Position dans l'architecture des composants

```
PrevNextLinks.astro                 <-- CE COMPOSANT (composant atomique)
└── DocsLayout.astro (T-004-F10)   <-- Consommateur (entre contenu et footer)
    ├── framework/[...slug].astro   <-- Pages qui fournissent le pathname
    ├── mode-operatoire/[...slug].astro
    └── annexes/[...slug].astro
```

### 2.4 Dependances

#### T-004-B1 (Types)

Le composant utilise les types suivants de `src/types/navigation.ts` :

```typescript
import type { PrevNextItem, PrevNextLinks as PrevNextLinksType, NavigationTree } from '@/types/navigation'
```

- `PrevNextItem` : `{ label: string; href: string; section?: NavigationSection }` — lien vers une page adjacente
- `PrevNextLinks` : `{ prev: PrevNextItem | null; next: PrevNextItem | null }` — paire de liens sequentiels

#### T-004-B4 (Helpers)

Le composant utilise le helper suivant de `src/lib/navigation.ts` :

```typescript
import { getPrevNext, getCurrentSection, SECTION_LABELS } from '@/lib/navigation'
```

- `getPrevNext(tree, currentPath)` : retourne la paire `{ prev, next }` pour la page courante
  - `prev` est `null` si la page est la premiere (Framework > Preambule)
  - `next` est `null` si la page est la derniere (Annexes > I4 - Communaute)
  - Les liens traversent les sections (navigation cross-section)
- `getCurrentSection(path)` : retourne la section courante (`'framework'` | `'mode-operatoire'` | `'annexes'` | `null`)
- `SECTION_LABELS` : mapping section → label francais (`'framework'` → `'Framework'`, etc.)

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

Le composant `PrevNextLinks` est un **bloc de navigation sequentielle accessible** qui :

1. Recoit le chemin courant ou le calcule automatiquement via `Astro.url.pathname`
2. Appelle `getPrevNext()` pour obtenir les liens precedent et suivant
3. Rend un bloc `<nav>` avec deux liens cote a cote : precedent (gauche) et suivant (droite)
4. Affiche des **fleches directionnelles** SVG pour indiquer la direction
5. Affiche un **indicateur de section** quand le lien pointe vers une autre section
6. S'adapte au **responsive** : labels complets sur desktop, abreges sur mobile

### 3.2 Structure du composant

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Precedent                                        Suivant →   │
│  Vision & Philosophie                           Artefacts        │
│  [section: Framework]                   [section: Framework]     │
└──────────────────────────────────────────────────────────────────┘
```

Le composant affiche deux zones :

| Zone | Position | Contenu |
|------|----------|---------|
| Precedent | Gauche, aligne a gauche | Fleche `←` + label "Precedent" + titre de la page + indicateur de section (si cross-section) |
| Suivant | Droite, aligne a droite | Label "Suivant" + fleche `→` + titre de la page + indicateur de section (si cross-section) |

### 3.3 Indicateur de section cross-section

Quand le lien `prev` ou `next` pointe vers une page d'une **section differente** de la page courante, un indicateur de section est affiche :

| Scenario | Indicateur |
|----------|------------|
| Meme section (ex: Framework → Framework) | Pas d'indicateur |
| Section differente (ex: Framework → Mode Operatoire) | `Mode Operatoire` affiche en petit sous le titre de la page |

L'indicateur utilise le `SECTION_LABELS` du helper pour afficher le label francais de la section cible.

### 3.4 Responsive

| Ecran | Comportement |
|-------|-------------|
| Desktop (>= 768px) | Les deux liens cote a cote, labels complets "Precedent" / "Suivant", titre de page visible |
| Mobile (< 768px) | Les deux liens empiles verticalement (suivant en haut, precedent en bas), labels "Prec." / "Suiv." abreges, titre de page visible |

### 3.5 Cas avec un seul lien

| Cas | Comportement |
|-----|-------------|
| `prev` est `null` (premiere page) | Seul le lien "Suivant" est affiche, aligne a droite via `ml-auto` |
| `next` est `null` (derniere page) | Seul le lien "Precedent" est affiche, aligne a gauche |
| Les deux sont `null` (page isolee) | Le composant ne rend rien |

### 3.6 Accessibilite (RGAA AA)

| Critere | Implementation | Reference RGAA |
|---------|----------------|----------------|
| Semantique | `<nav aria-label="Navigation entre les pages">` | 12.2 |
| Liens explicites | Texte du lien = "Precedent : {titre}" ou "Suivant : {titre}" (via `aria-label`) | 6.1 |
| Focus visible | `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2` sur les liens | 10.7 |
| Contraste texte | Ratio >= 4.5:1 pour tous les etats | 3.2 |
| Navigation clavier | Tab / Shift+Tab entre les liens, Enter pour naviguer | 12.13 |
| Fleches decoratives | `aria-hidden="true"` sur les SVG fleches | 10.2 |

### 3.7 Cas du composant vide

Si `getPrevNext()` retourne `{ prev: null, next: null }` (chemin introuvable ou page isolee), le composant **ne rend rien** (pas de `<nav>`).

---

## 4. Specifications techniques

### 4.1 Interface TypeScript

```typescript
// src/components/layout/PrevNextLinks.astro (frontmatter)

import type { PrevNextLinks as PrevNextLinksType, PrevNextItem, NavigationTree } from '@/types/navigation'

/**
 * Props du composant PrevNextLinks.
 *
 * Liens de navigation sequentielle (Precedent/Suivant) avec indicateur
 * de section cross-section. Calcule automatiquement les liens a partir
 * de l'URL courante.
 *
 * @example
 * ```astro
 * ---
 * import PrevNextLinks from '@components/layout/PrevNextLinks.astro'
 * ---
 * <PrevNextLinks />
 * ```
 *
 * @example
 * ```astro
 * <!-- Avec liens pre-calcules -->
 * <PrevNextLinks links={myLinks} />
 * ```
 */
export interface Props {
  // ── Donnees ──────────────────────────────────────

  /**
   * Paire de liens precedent/suivant.
   * Si fourni, outrepasse le calcul automatique via getPrevNext().
   * Utile pour les pages qui ne sont pas dans l'arbre de navigation.
   */
  links?: PrevNextLinksType

  /**
   * Arbre de navigation a utiliser pour le calcul.
   * Si non fourni, utilise NAVIGATION_TREE par defaut.
   * Utile pour l'injection dans les tests.
   */
  tree?: NavigationTree

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
// src/components/layout/PrevNextLinks.astro

import type { PrevNextLinks as PrevNextLinksType, NavigationTree } from '@/types/navigation'
import { getPrevNext, getCurrentSection, SECTION_LABELS } from '@/lib/navigation'
import { NAVIGATION_TREE } from '@/data/navigation'

export interface Props {
  links?: PrevNextLinksType
  tree?: NavigationTree
  class?: string
}

const {
  links,
  tree = NAVIGATION_TREE,
  class: className = '',
} = Astro.props

// ── Calcul des liens prev/next ──────────────────────
const currentPath = Astro.url.pathname
const prevNextLinks = links ?? getPrevNext(tree, currentPath)
const { prev, next } = prevNextLinks

// ── Detection cross-section ─────────────────────────
const currentSection = getCurrentSection(currentPath)

function isCrossSection(itemSection?: string): boolean {
  if (!currentSection || !itemSection) return false
  return currentSection !== itemSection
}

function getSectionLabel(section?: string): string | null {
  if (!section) return null
  return SECTION_LABELS[section as keyof typeof SECTION_LABELS] ?? null
}

// ── Aucun lien disponible → pas de rendu ────────────
const hasLinks = prev !== null || next !== null
---

{hasLinks && (
  <nav
    aria-label="Navigation entre les pages"
    class:list={[
      'prev-next-container border-t border-gray-200 pt-6 mt-8',
      className,
    ]}
    data-prev-next
  >
    <div class="flex flex-col md:flex-row md:justify-between gap-4">
      {/* ── Lien Precedent ──────────────────────────── */}
      {prev ? (
        <a
          href={prev.href}
          class="group flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:max-w-[calc(50%-0.5rem)]"
          aria-label={`Precedent : ${prev.label}`}
          data-prev-next-prev
        >
          <svg
            class="h-5 w-5 shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors duration-150"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <div class="min-w-0">
            <span class="block text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span class="hidden md:inline">Precedent</span>
              <span class="md:hidden">Prec.</span>
            </span>
            <span class="block text-sm font-medium text-gray-900 group-hover:text-blue-700 truncate transition-colors duration-150" data-prev-next-prev-title>
              {prev.label}
            </span>
            {isCrossSection(prev.section) && (
              <span class="block text-xs text-gray-400 mt-0.5" data-prev-next-prev-section>
                {getSectionLabel(prev.section)}
              </span>
            )}
          </div>
        </a>
      ) : (
        <div class="hidden md:block" />
      )}

      {/* ── Lien Suivant ────────────────────────────── */}
      {next ? (
        <a
          href={next.href}
          class="group flex items-center justify-end gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:max-w-[calc(50%-0.5rem)] md:ml-auto text-right"
          aria-label={`Suivant : ${next.label}`}
          data-prev-next-next
        >
          <div class="min-w-0">
            <span class="block text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span class="hidden md:inline">Suivant</span>
              <span class="md:hidden">Suiv.</span>
            </span>
            <span class="block text-sm font-medium text-gray-900 group-hover:text-blue-700 truncate transition-colors duration-150" data-prev-next-next-title>
              {next.label}
            </span>
            {isCrossSection(next.section) && (
              <span class="block text-xs text-gray-400 mt-0.5" data-prev-next-next-section>
                {getSectionLabel(next.section)}
              </span>
            )}
          </div>
          <svg
            class="h-5 w-5 shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors duration-150"
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
        </a>
      ) : (
        <div class="hidden md:block" />
      )}
    </div>
  </nav>
)}
```

### 4.3 Data attributes

| Attribut | Element | Usage |
|----------|---------|-------|
| `data-prev-next` | `<nav>` | Selecteur racine pour les tests et les composants parents |
| `data-prev-next-prev` | `<a>` | Selecteur du lien precedent |
| `data-prev-next-next` | `<a>` | Selecteur du lien suivant |
| `data-prev-next-prev-title` | `<span>` | Selecteur du titre de la page precedente |
| `data-prev-next-next-title` | `<span>` | Selecteur du titre de la page suivante |
| `data-prev-next-prev-section` | `<span>` | Selecteur de l'indicateur de section precedent (cross-section) |
| `data-prev-next-next-section` | `<span>` | Selecteur de l'indicateur de section suivant (cross-section) |

### 4.4 Exemples d'utilisation

#### Utilisation automatique (recommandee)

```astro
---
// Dans DocsLayout.astro ou une page
import PrevNextLinks from '@components/layout/PrevNextLinks.astro'
---

<PrevNextLinks />
```

Le composant detecte automatiquement l'URL courante via `Astro.url.pathname` et appelle `getPrevNext()`.

#### Avec liens pre-calcules

```astro
---
import PrevNextLinks from '@components/layout/PrevNextLinks.astro'

const customLinks = {
  prev: { label: 'Introduction', href: '/framework/preambule', section: 'framework' },
  next: { label: 'Ecosysteme', href: '/framework/ecosysteme', section: 'framework' },
}
---

<PrevNextLinks links={customLinks} />
```

#### Avec classe personnalisee

```astro
<PrevNextLinks class="px-4 py-2 bg-gray-50 rounded-lg" />
```

#### Avec arbre custom (pour les tests)

```astro
<PrevNextLinks tree={myTestTree} />
```

---

## 5. Design et Style

### 5.1 Palette de couleurs par etat

| Etat | Texte | Fond | Bordure |
|------|-------|------|---------|
| Lien inactif — label | `text-gray-500` (#6B7280) | transparent | `border-gray-200` (#E5E7EB) |
| Lien inactif — titre | `text-gray-900` (#111827) | transparent | — |
| Lien inactif — fleche | `text-gray-400` (#9CA3AF) | — | — |
| Lien hover — titre | `text-blue-700` (#1D4ED8) | `bg-blue-50/50` | `border-blue-300` (#93C5FD) |
| Lien hover — fleche | `text-blue-600` (#2563EB) | — | — |
| Lien focus | — | — | `ring-2 ring-blue-500 ring-offset-2` |
| Indicateur section | `text-gray-400` (#9CA3AF) | — | — |
| Separateur haut | — | — | `border-t border-gray-200` (#E5E7EB) |

### 5.2 Verification du contraste (WCAG AA)

| Combinaison | Ratio | Conforme AA ? |
|-------------|-------|---------------|
| `gray-500` (#6B7280) sur `white` (#FFFFFF) | 4.64:1 | Oui (>= 4.5:1) |
| `gray-900` (#111827) sur `white` (#FFFFFF) | 16.75:1 | Oui (>= 4.5:1) |
| `blue-700` (#1D4ED8) sur `white` (#FFFFFF) | 5.43:1 | Oui (>= 4.5:1) |
| `blue-700` (#1D4ED8) sur `blue-50/50` | ~5.1:1 | Oui (>= 4.5:1) |
| `gray-400` (#9CA3AF) sur `white` (#FFFFFF) | 3.04:1 | N/A (indicateur decoratif complementaire) |

### 5.3 Dimensions et espacement

| Element | Style | Detail |
|---------|-------|--------|
| Container | `border-t border-gray-200 pt-6 mt-8` | Separateur visuel au-dessus, marge haute |
| Layout | `flex flex-col md:flex-row md:justify-between gap-4` | Empile sur mobile, cote a cote sur desktop |
| Lien | `px-4 py-3 rounded-lg border` | Zone tactile >= 44px, coins arrondis, bordure |
| Largeur lien | `md:max-w-[calc(50%-0.5rem)]` | Max 50% de la largeur sur desktop |
| Fleche SVG | `h-5 w-5 shrink-0` | Taille 20px, ne se reduit pas |
| Gap interne lien | `gap-3` | Espacement entre fleche et texte |
| Titre | `text-sm font-medium truncate` | Taille 14px, tronque si trop long |
| Label direction | `text-xs uppercase tracking-wider` | Taille 12px, tout en majuscules |
| Indicateur section | `text-xs text-gray-400 mt-0.5` | Taille 12px, marge top subtile |

### 5.4 Coherence avec le design system

| Aspect | Conformite |
|--------|------------|
| Focus ring | `ring-2 ring-blue-500 ring-offset-2` — coherent avec NavLink, Breadcrumb et TOC |
| Couleurs actives | `blue-600/700/50` — coherent avec NavLink et TOC |
| Transition | `transition-colors duration-150` — coherent avec NavLink, Breadcrumb et TOC |
| Bordure | `border-gray-200` — coherent avec les separateurs du site |
| Uppercase label | `text-xs uppercase tracking-wider` — coherent avec le titre TOC |
| Coins arrondis | `rounded-lg` — coherent avec les boutons et cartes du site |

### 5.5 Maquette visuelle

```
Desktop (>= 768px) — page au milieu d'une section :
┌──────────────────────────────────────────────────────────────────┐
│  ──────────────────────────────────────────────────────────────  │
│                                                                  │
│  ┌───────────────────────────┐  ┌───────────────────────────┐   │
│  │ ←  PRECEDENT              │  │              SUIVANT  →   │   │
│  │    Vision & Philosophie   │  │          Artefacts        │   │
│  └───────────────────────────┘  └───────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

Desktop — cross-section (dernier Framework → premier Mode Operatoire) :
┌──────────────────────────────────────────────────────────────────┐
│  ┌───────────────────────────┐  ┌───────────────────────────┐   │
│  │ ←  PRECEDENT              │  │              SUIVANT  →   │   │
│  │    Metriques              │  │          Preambule        │   │
│  │                           │  │    Mode Operatoire        │   │
│  └───────────────────────────┘  └───────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘

Desktop — premiere page (prev = null) :
┌──────────────────────────────────────────────────────────────────┐
│                                 ┌───────────────────────────┐   │
│                                 │              SUIVANT  →   │   │
│                                 │   Vision & Philosophie    │   │
│                                 └───────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘

Mobile (< 768px) :
┌────────────────────────────┐
│  ┌──────────────────────┐  │
│  │ ←  PREC.             │  │
│  │    Vision & Philo... │  │
│  └──────────────────────┘  │
│  ┌──────────────────────┐  │
│  │           SUIV.  →   │  │
│  │       Artefacts      │  │
│  └──────────────────────┘  │
└────────────────────────────┘
```

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Matrice des cas limites

| ID | Cas | Comportement attendu | Priorite |
|----|-----|----------------------|----------|
| CL-01 | Page au milieu d'une section (cas nominal) | Deux liens affiches (prev et next) | Haute |
| CL-02 | Premiere page du site (`/framework/preambule`) | Seul le lien "Suivant" est affiche, aligne a droite | Haute |
| CL-03 | Derniere page du site (`/annexes/ressources/communaute`) | Seul le lien "Precedent" est affiche, aligne a gauche | Haute |
| CL-04 | `getPrevNext()` retourne `{ prev: null, next: null }` | Composant ne rend rien (pas de `<nav>`) | Haute |
| CL-05 | `links` fournis manuellement | Utilise `links` sans appeler `getPrevNext()` | Haute |
| CL-06 | Navigation cross-section (Framework → Mode Operatoire) | Indicateur de section affiche sous le titre | Haute |
| CL-07 | Navigation intra-section (Framework → Framework) | Pas d'indicateur de section | Haute |
| CL-08 | Titre de page tres long (> 50 caracteres) | Tronque via `truncate` | Moyenne |
| CL-09 | Lien prev sans section definie | Pas d'indicateur de section (pas de crash) | Moyenne |
| CL-10 | Lien next sans section definie | Pas d'indicateur de section (pas de crash) | Moyenne |
| CL-11 | URL avec trailing slash (`/framework/preambule/`) | Normalisee par `getPrevNext()` — rendu correct | Haute |
| CL-12 | Chemin introuvable dans l'arbre | `getPrevNext()` retourne `{ prev: null, next: null }` — pas de rendu | Haute |
| CL-13 | Label avec caracteres speciaux (accents, `&`, `<`) | Echappe automatiquement par Astro | Haute |
| CL-14 | `aria-label` sur les liens contient le titre complet | "Precedent : {titre}" ou "Suivant : {titre}" | Haute |
| CL-15 | Navigation clavier : Tab entre les deux liens | Deux liens focusables (prev puis next) | Haute |
| CL-16 | Un seul lien : prev seulement | Layout flex avec un div vide cote droit (desktop) | Moyenne |
| CL-17 | Un seul lien : next seulement | Layout flex avec un div vide cote gauche + `ml-auto` | Moyenne |
| CL-18 | `class` personnalise fourni | Ajoute aux classes existantes (ne remplace pas) | Moyenne |
| CL-19 | Fleches SVG ont `aria-hidden="true"` | Non lues par les lecteurs d'ecran | Haute |
| CL-20 | Mobile : labels abreges "Prec." / "Suiv." | Labels courts visibles sur mobile, complets sur desktop | Haute |
| CL-21 | Page d'accueil (`/`) | `getCurrentSection()` retourne `null`, pas de detection cross-section | Basse |
| CL-22 | `links` avec `prev` et `next` tous deux `null` | Composant ne rend rien | Haute |
| CL-23 | Section identique mais undefined pour les deux | Pas d'indicateur de section affiche | Basse |
| CL-24 | Transition Mode Operatoire → Annexes | Indicateur "Annexes" affiche sur le lien next | Haute |
| CL-25 | Transition Annexes → Mode Operatoire (retour arriere) | Indicateur "Mode Operatoire" affiche sur le lien prev | Haute |

### 6.2 Strategie de fallback

```
Props manquantes ?
├── links: non fourni → calcul automatique via getPrevNext(tree, Astro.url.pathname)
│   ├── getPrevNext retourne { prev: null, next: null } → pas de rendu
│   └── getPrevNext retourne au moins un lien → rendu partiel ou complet
├── tree: non fourni → NAVIGATION_TREE par defaut
└── class: non fourni → '' (pas de classes additionnelles)
```

---

## 7. Exemples entree/sortie

### 7.1 Page au milieu d'une section (cas nominal)

**URL courante :** `/framework/artefacts`

**`getPrevNext()` retourne :**

```typescript
{
  prev: { label: 'Ecosysteme', href: '/framework/ecosysteme', section: 'framework' },
  next: { label: 'Boucles Iteratives', href: '/framework/boucles-iteratives', section: 'framework' },
}
```

**`getCurrentSection()` retourne :** `'framework'`

**Sortie HTML :**

```html
<nav aria-label="Navigation entre les pages" class="prev-next-container border-t border-gray-200 pt-6 mt-8" data-prev-next>
  <div class="flex flex-col md:flex-row md:justify-between gap-4">
    <!-- Lien Precedent -->
    <a
      href="/framework/ecosysteme"
      class="group flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:max-w-[calc(50%-0.5rem)]"
      aria-label="Precedent : Ecosysteme"
      data-prev-next-prev
    >
      <svg class="h-5 w-5 shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors duration-150" aria-hidden="true" ...>
        <path d="M15 19l-7-7 7-7" />
      </svg>
      <div class="min-w-0">
        <span class="block text-xs font-medium text-gray-500 uppercase tracking-wider">
          <span class="hidden md:inline">Precedent</span>
          <span class="md:hidden">Prec.</span>
        </span>
        <span class="block text-sm font-medium text-gray-900 group-hover:text-blue-700 truncate transition-colors duration-150" data-prev-next-prev-title>
          Ecosysteme
        </span>
      </div>
    </a>

    <!-- Lien Suivant -->
    <a
      href="/framework/boucles-iteratives"
      class="group flex items-center justify-end gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:max-w-[calc(50%-0.5rem)] md:ml-auto text-right"
      aria-label="Suivant : Boucles Iteratives"
      data-prev-next-next
    >
      <div class="min-w-0">
        <span class="block text-xs font-medium text-gray-500 uppercase tracking-wider">
          <span class="hidden md:inline">Suivant</span>
          <span class="md:hidden">Suiv.</span>
        </span>
        <span class="block text-sm font-medium text-gray-900 group-hover:text-blue-700 truncate transition-colors duration-150" data-prev-next-next-title>
          Boucles Iteratives
        </span>
      </div>
      <svg class="h-5 w-5 shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors duration-150" aria-hidden="true" ...>
        <path d="M9 5l7 7-7 7" />
      </svg>
    </a>
  </div>
</nav>
```

### 7.2 Navigation cross-section

**URL courante :** `/framework/annexes` (dernier chapitre Framework)

**`getPrevNext()` retourne :**

```typescript
{
  prev: { label: 'Metriques', href: '/framework/metriques', section: 'framework' },
  next: { label: 'Preambule', href: '/mode-operatoire/preambule', section: 'mode-operatoire' },
}
```

**Resultat :** Le lien "Suivant" affiche `Mode Operatoire` comme indicateur de section sous le titre "Preambule", car `section: 'mode-operatoire'` differe de la section courante `'framework'`.

Le lien "Precedent" n'affiche pas d'indicateur car `section: 'framework'` est la meme section.

### 7.3 Premiere page — prev = null

**URL courante :** `/framework/preambule`

**`getPrevNext()` retourne :**

```typescript
{
  prev: null,
  next: { label: 'Vision & Philosophie', href: '/framework/vision-philosophie', section: 'framework' },
}
```

**Sortie HTML :**

```html
<nav aria-label="Navigation entre les pages" data-prev-next ...>
  <div class="flex flex-col md:flex-row md:justify-between gap-4">
    <div class="hidden md:block"></div>
    <a href="/framework/vision-philosophie" ... data-prev-next-next>
      ...
    </a>
  </div>
</nav>
```

Le `<div class="hidden md:block">` sert de placeholder sur desktop pour maintenir le lien "Suivant" aligne a droite.

### 7.4 Derniere page — next = null

**URL courante :** `/annexes/ressources/communaute`

**`getPrevNext()` retourne :**

```typescript
{
  prev: { label: 'I3 - Bibliographie', href: '/annexes/ressources/bibliographie', section: 'annexes' },
  next: null,
}
```

**Sortie HTML :** Seul le lien "Precedent" est affiche, sans placeholder droit (pas de `ml-auto` necessaire, le lien est naturellement a gauche).

### 7.5 Aucun lien — pas de rendu

**URL courante :** `/glossaire` (page hors navigation)

**`getPrevNext()` retourne :**

```typescript
{ prev: null, next: null }
```

**Sortie HTML :**

```html
<!-- Rien n'est rendu -->
```

### 7.6 Liens fournis manuellement

**Entree :**

```astro
<PrevNextLinks links={{
  prev: { label: 'Accueil', href: '/' },
  next: { label: 'Glossaire', href: '/glossaire' },
}} />
```

**Sortie HTML :** Deux liens rendus avec les valeurs fournies. Pas d'indicateur de section (pas de `section` defini sur les items).

### 7.7 Protection XSS

**Entree (liens manuels) :**

```astro
<PrevNextLinks links={{
  prev: { label: '<script>alert("xss")</script>', href: '/test' },
  next: null,
}} />
```

**Sortie HTML :**

```html
<span class="..." data-prev-next-prev-title>
  &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;
</span>
```

> Astro echappe automatiquement les expressions `{variable}` dans les templates.

---

## 8. Tests

### 8.1 Fichiers de test

| Fichier | Type | Framework |
|---------|------|-----------|
| `tests/unit/components/layout/prev-next-links.test.ts` | Unitaire | Vitest + Astro Container |

### 8.2 Tests unitaires (Vitest)

```typescript
// tests/unit/components/layout/prev-next-links.test.ts
import { describe, it, expect } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import PrevNextLinks from '@components/layout/PrevNextLinks.astro'

// ── Fixtures ─────────────────────────────────────────────

const BOTH_LINKS = {
  prev: { label: 'Ecosysteme', href: '/framework/ecosysteme', section: 'framework' },
  next: { label: 'Boucles Iteratives', href: '/framework/boucles-iteratives', section: 'framework' },
}

const CROSS_SECTION_LINKS = {
  prev: { label: 'Metriques', href: '/framework/metriques', section: 'framework' },
  next: { label: 'Preambule', href: '/mode-operatoire/preambule', section: 'mode-operatoire' },
}

const PREV_ONLY = {
  prev: { label: 'I3 - Bibliographie', href: '/annexes/ressources/bibliographie', section: 'annexes' },
  next: null,
}

const NEXT_ONLY = {
  prev: null,
  next: { label: 'Vision & Philosophie', href: '/framework/vision-philosophie', section: 'framework' },
}

const NO_LINKS = {
  prev: null,
  next: null,
}

const NO_SECTION_LINKS = {
  prev: { label: 'Page A', href: '/page-a' },
  next: { label: 'Page B', href: '/page-b' },
}

// ── Helpers ──────────────────────────────────────────────

async function renderPrevNext(
  props: Record<string, unknown> = {},
  currentPath: string = '/framework/artefacts',
) {
  const container = await AstroContainer.create()
  return container.renderToString(PrevNextLinks, {
    props: {
      links: BOTH_LINKS,
      ...props,
    },
    request: new Request(`https://aiad.dev${currentPath}`),
  })
}

// ── Tests rendu conditionnel ─────────────────────────────

describe('PrevNextLinks — Rendu conditionnel', () => {
  it('T-01 : rend le composant quand les deux liens sont presents', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('<nav')
    expect(html).toContain('data-prev-next')
  })

  it('T-02 : rend le composant quand seul prev est present', async () => {
    const html = await renderPrevNext({ links: PREV_ONLY })
    expect(html).toContain('<nav')
    expect(html).toContain('data-prev-next-prev')
    expect(html).not.toContain('data-prev-next-next')
  })

  it('T-03 : rend le composant quand seul next est present', async () => {
    const html = await renderPrevNext({ links: NEXT_ONLY })
    expect(html).toContain('<nav')
    expect(html).toContain('data-prev-next-next')
    expect(html).not.toContain('data-prev-next-prev')
  })

  it('T-04 : ne rend rien quand prev et next sont null', async () => {
    const html = await renderPrevNext({ links: NO_LINKS })
    expect(html).not.toContain('<nav')
    expect(html).not.toContain('data-prev-next')
  })
})

// ── Tests structure HTML ──────────────────────────────────

describe('PrevNextLinks — Structure HTML', () => {
  it('T-05 : genere un element <nav> avec aria-label', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('<nav')
    expect(html).toContain('aria-label="Navigation entre les pages"')
  })

  it('T-06 : contient un lien <a> pour le precedent avec href', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('href="/framework/ecosysteme"')
    expect(html).toContain('data-prev-next-prev')
  })

  it('T-07 : contient un lien <a> pour le suivant avec href', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('href="/framework/boucles-iteratives"')
    expect(html).toContain('data-prev-next-next')
  })

  it('T-08 : le lien precedent affiche le titre de la page', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('data-prev-next-prev-title')
    expect(html).toContain('Ecosysteme')
  })

  it('T-09 : le lien suivant affiche le titre de la page', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('data-prev-next-next-title')
    expect(html).toContain('Boucles Iteratives')
  })

  it('T-10 : les labels de direction "Precedent" et "Suivant" sont presents', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('Precedent')
    expect(html).toContain('Suivant')
  })
})

// ── Tests fleches SVG ────────────────────────────────────

describe('PrevNextLinks — Fleches', () => {
  it('T-11 : fleche gauche pour le lien precedent (chevron gauche)', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('M15 19l-7-7 7-7')
  })

  it('T-12 : fleche droite pour le lien suivant (chevron droit)', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('M9 5l7 7-7 7')
  })

  it('T-13 : les fleches ont aria-hidden="true"', async () => {
    const html = await renderPrevNext()
    const svgMatches = html.match(/<svg[^>]*>/g) || []
    svgMatches.forEach((svg) => {
      expect(svg).toContain('aria-hidden="true"')
    })
  })

  it('T-14 : les fleches ont la bonne taille (h-5 w-5)', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('h-5 w-5')
  })
})

// ── Tests accessibilite ──────────────────────────────────

describe('PrevNextLinks — Accessibilite', () => {
  it('T-15 : le nav a aria-label="Navigation entre les pages"', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('aria-label="Navigation entre les pages"')
  })

  it('T-16 : le lien precedent a un aria-label descriptif', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('aria-label="Precedent : Ecosysteme"')
  })

  it('T-17 : le lien suivant a un aria-label descriptif', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('aria-label="Suivant : Boucles Iteratives"')
  })

  it('T-18 : les liens ont un focus ring', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('focus:ring-2')
    expect(html).toContain('focus:ring-blue-500')
    expect(html).toContain('focus:ring-offset-2')
  })
})

// ── Tests cross-section ──────────────────────────────────

describe('PrevNextLinks — Indicateur cross-section', () => {
  it('T-19 : pas d\'indicateur de section quand meme section', async () => {
    const html = await renderPrevNext({ links: BOTH_LINKS }, '/framework/artefacts')
    expect(html).not.toContain('data-prev-next-prev-section')
    expect(html).not.toContain('data-prev-next-next-section')
  })

  it('T-20 : indicateur de section affiche quand cross-section sur next', async () => {
    const html = await renderPrevNext({ links: CROSS_SECTION_LINKS }, '/framework/annexes')
    expect(html).toContain('data-prev-next-next-section')
    expect(html).toContain('Mode')
  })

  it('T-21 : pas d\'indicateur sur prev quand meme section (cross-section next)', async () => {
    const html = await renderPrevNext({ links: CROSS_SECTION_LINKS }, '/framework/annexes')
    expect(html).not.toContain('data-prev-next-prev-section')
  })

  it('T-22 : indicateur affiche le label francais de la section', async () => {
    const html = await renderPrevNext({ links: CROSS_SECTION_LINKS }, '/framework/annexes')
    // Le lien next pointe vers mode-operatoire → label "Mode Operatoire"
    const nextSection = html.match(/data-prev-next-next-section[^>]*>([\s\S]*?)<\/span>/)
    expect(nextSection).not.toBeNull()
  })

  it('T-23 : pas d\'indicateur quand le lien n\'a pas de section', async () => {
    const html = await renderPrevNext({ links: NO_SECTION_LINKS }, '/framework/artefacts')
    expect(html).not.toContain('data-prev-next-prev-section')
    expect(html).not.toContain('data-prev-next-next-section')
  })
})

// ── Tests responsive ─────────────────────────────────────

describe('PrevNextLinks — Responsive', () => {
  it('T-24 : label complet "Precedent" visible sur desktop (hidden md:inline)', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('hidden md:inline')
    expect(html).toContain('Precedent')
  })

  it('T-25 : label abrege "Prec." visible sur mobile (md:hidden)', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('md:hidden')
    expect(html).toContain('Prec.')
  })

  it('T-26 : label complet "Suivant" visible sur desktop', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('Suivant')
  })

  it('T-27 : label abrege "Suiv." visible sur mobile', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('Suiv.')
  })

  it('T-28 : layout flex-col sur mobile, flex-row sur desktop', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('flex-col')
    expect(html).toContain('md:flex-row')
  })
})

// ── Tests styles ─────────────────────────────────────────

describe('PrevNextLinks — Styles', () => {
  it('T-29 : bordure superieure de separation', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('border-t')
    expect(html).toContain('border-gray-200')
  })

  it('T-30 : les liens ont une bordure et des coins arrondis', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('rounded-lg')
    expect(html).toContain('border border-gray-200')
  })

  it('T-31 : hover change la bordure et le fond', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('hover:border-blue-300')
    expect(html).toContain('hover:bg-blue-50/50')
  })

  it('T-32 : hover change la couleur du titre', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('group-hover:text-blue-700')
  })

  it('T-33 : hover change la couleur de la fleche', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('group-hover:text-blue-600')
  })

  it('T-34 : transitions presentes', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('transition-colors')
    expect(html).toContain('duration-150')
  })

  it('T-35 : les titres ont truncate pour les labels longs', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('truncate')
  })

  it('T-36 : labels de direction sont uppercase', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('uppercase')
    expect(html).toContain('tracking-wider')
  })
})

// ── Tests classes et attributs ──────────────────────────

describe('PrevNextLinks — Classes et attributs', () => {
  it('T-37 : classe personnalisee ajoutee au nav', async () => {
    const html = await renderPrevNext({ class: 'my-custom-class' })
    expect(html).toContain('my-custom-class')
  })

  it('T-38 : data-prev-next present sur le nav', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('data-prev-next')
  })

  it('T-39 : data-prev-next-prev present sur le lien precedent', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('data-prev-next-prev')
  })

  it('T-40 : data-prev-next-next present sur le lien suivant', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('data-prev-next-next')
  })

  it('T-41 : data-prev-next-prev-title present', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('data-prev-next-prev-title')
  })

  it('T-42 : data-prev-next-next-title present', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('data-prev-next-next-title')
  })
})

// ── Tests XSS ────────────────────────────────────────────

describe('PrevNextLinks — Protection XSS', () => {
  it('T-43 : label avec HTML est echappe', async () => {
    const links = {
      prev: { label: '<script>alert("xss")</script>', href: '/test' },
      next: null,
    }
    const html = await renderPrevNext({ links })
    expect(html).not.toContain('<script>alert')
    expect(html).toContain('&lt;script&gt;')
  })

  it('T-44 : label avec accents et caracteres speciaux', async () => {
    const links = {
      prev: { label: 'Ecosysteme & Architecture — Vue d\'ensemble', href: '/test' },
      next: null,
    }
    const html = await renderPrevNext({ links })
    expect(html).toContain('Ecosysteme')
  })
})

// ── Tests combinaisons ───────────────────────────────────

describe('PrevNextLinks — Combinaisons', () => {
  it('T-45 : prev seulement — placeholder droit present sur desktop', async () => {
    const html = await renderPrevNext({ links: PREV_ONLY })
    expect(html).toContain('data-prev-next-prev')
    expect(html).not.toContain('data-prev-next-next')
    // Un div vide pour le placeholder
    expect(html).toContain('hidden md:block')
  })

  it('T-46 : next seulement — lien aligne a droite via ml-auto', async () => {
    const html = await renderPrevNext({ links: NEXT_ONLY })
    expect(html).toContain('data-prev-next-next')
    expect(html).not.toContain('data-prev-next-prev')
    expect(html).toContain('md:ml-auto')
  })

  it('T-47 : classe personnalisee + liens manuels', async () => {
    const html = await renderPrevNext({
      links: BOTH_LINKS,
      class: 'bg-gray-50 px-4',
    })
    expect(html).toContain('bg-gray-50')
    expect(html).toContain('Ecosysteme')
    expect(html).toContain('Boucles Iteratives')
  })

  it('T-48 : liens sans section definie — pas d\'indicateur cross-section', async () => {
    const html = await renderPrevNext({ links: NO_SECTION_LINKS })
    expect(html).toContain('Page A')
    expect(html).toContain('Page B')
    expect(html).not.toContain('data-prev-next-prev-section')
    expect(html).not.toContain('data-prev-next-next-section')
  })

  it('T-49 : cross-section complet — indicateurs sur les deux liens', async () => {
    const links = {
      prev: { label: 'Annexes', href: '/framework/annexes', section: 'framework' },
      next: { label: 'Preambule', href: '/mode-operatoire/preambule', section: 'mode-operatoire' },
    }
    const html = await renderPrevNext({ links }, '/annexes/templates')
    // La page courante est dans 'annexes', donc :
    // prev.section = 'framework' (different) → indicateur
    // next.section = 'mode-operatoire' (different) → indicateur
    expect(html).toContain('data-prev-next-prev-section')
    expect(html).toContain('data-prev-next-next-section')
  })

  it('T-50 : aria-label adapte au contenu de chaque lien', async () => {
    const links = {
      prev: { label: 'Metriques', href: '/framework/metriques' },
      next: { label: 'Preambule', href: '/mode-operatoire/preambule' },
    }
    const html = await renderPrevNext({ links })
    expect(html).toContain('aria-label="Precedent : Metriques"')
    expect(html).toContain('aria-label="Suivant : Preambule"')
  })
})
```

### 8.3 Matrice de couverture

| ID | Test | Type | Assertion | Priorite |
|----|------|------|-----------|----------|
| T-01 | Rendu avec deux liens | Unit | `toContain('data-prev-next')` | Haute |
| T-02 | Rendu avec prev seulement | Unit | prev present, next absent | Haute |
| T-03 | Rendu avec next seulement | Unit | next present, prev absent | Haute |
| T-04 | Pas de rendu si aucun lien | Unit | `not.toContain('<nav')` | Haute |
| T-05 | `<nav>` avec `aria-label` | Unit | `toContain('aria-label')` | Haute |
| T-06 | Lien prev avec href | Unit | `toContain('href=...')` | Haute |
| T-07 | Lien next avec href | Unit | `toContain('href=...')` | Haute |
| T-08 | Titre prev affiche | Unit | `toContain(title)` | Haute |
| T-09 | Titre next affiche | Unit | `toContain(title)` | Haute |
| T-10 | Labels "Precedent"/"Suivant" | Unit | `toContain(...)` | Haute |
| T-11 | Fleche gauche (chevron) | Unit | `toContain('M15 19l-7-7 7-7')` | Haute |
| T-12 | Fleche droite (chevron) | Unit | `toContain('M9 5l7 7-7 7')` | Haute |
| T-13 | Fleches `aria-hidden="true"` | Unit | tous les SVG avec `aria-hidden` | Haute |
| T-14 | Taille fleches `h-5 w-5` | Unit | `toContain(...)` | Moyenne |
| T-15 | `aria-label` nav correct | Unit | `toContain(...)` | Haute |
| T-16 | `aria-label` prev descriptif | Unit | `toContain('Precedent : ...')` | Haute |
| T-17 | `aria-label` next descriptif | Unit | `toContain('Suivant : ...')` | Haute |
| T-18 | Focus ring present | Unit | `toContain('focus:ring-2')` | Haute |
| T-19 | Pas d'indicateur intra-section | Unit | pas de `data-prev-next-*-section` | Haute |
| T-20 | Indicateur cross-section next | Unit | `toContain('data-prev-next-next-section')` | Haute |
| T-21 | Pas d'indicateur prev meme section | Unit | `not.toContain(...)` | Haute |
| T-22 | Indicateur affiche label francais | Unit | contenu du span section | Haute |
| T-23 | Pas d'indicateur sans section | Unit | pas de `data-*-section` | Moyenne |
| T-24 | Label desktop "Precedent" | Unit | `hidden md:inline` + texte | Haute |
| T-25 | Label mobile "Prec." | Unit | `md:hidden` + texte | Haute |
| T-26 | Label desktop "Suivant" | Unit | `toContain('Suivant')` | Haute |
| T-27 | Label mobile "Suiv." | Unit | `toContain('Suiv.')` | Haute |
| T-28 | Layout responsive | Unit | `flex-col` + `md:flex-row` | Haute |
| T-29 | Bordure superieure | Unit | `border-t border-gray-200` | Moyenne |
| T-30 | Liens avec bordure et coins arrondis | Unit | `rounded-lg` + `border` | Moyenne |
| T-31 | Hover bordure et fond | Unit | `hover:border-blue-300` | Moyenne |
| T-32 | Hover couleur titre | Unit | `group-hover:text-blue-700` | Moyenne |
| T-33 | Hover couleur fleche | Unit | `group-hover:text-blue-600` | Moyenne |
| T-34 | Transitions | Unit | `transition-colors` | Basse |
| T-35 | Truncate sur les titres | Unit | `toContain('truncate')` | Moyenne |
| T-36 | Labels uppercase | Unit | `uppercase tracking-wider` | Basse |
| T-37 | Classe personnalisee | Unit | `toContain('my-custom-class')` | Moyenne |
| T-38 | `data-prev-next` | Unit | `toContain(...)` | Haute |
| T-39 | `data-prev-next-prev` | Unit | `toContain(...)` | Haute |
| T-40 | `data-prev-next-next` | Unit | `toContain(...)` | Haute |
| T-41 | `data-prev-next-prev-title` | Unit | `toContain(...)` | Haute |
| T-42 | `data-prev-next-next-title` | Unit | `toContain(...)` | Haute |
| T-43 | XSS echappe | Unit | `not.toContain('<script>')` | Haute |
| T-44 | Accents et caracteres speciaux | Unit | `toContain('Ecosysteme')` | Moyenne |
| T-45 | Prev seulement + placeholder | Unit | div vide `hidden md:block` | Moyenne |
| T-46 | Next seulement + `ml-auto` | Unit | `toContain('md:ml-auto')` | Moyenne |
| T-47 | Classe + liens manuels | Unit | combinaison correcte | Moyenne |
| T-48 | Liens sans section | Unit | pas d'indicateur | Moyenne |
| T-49 | Cross-section sur les deux liens | Unit | indicateurs presents | Haute |
| T-50 | `aria-label` adapte | Unit | contenu dynamique | Haute |

---

## 9. Criteres d'acceptation

| ID | Critere | Verifie par |
|----|---------|-------------|
| CA-01 | Le fichier `src/components/layout/PrevNextLinks.astro` est cree | Verification fichier |
| CA-02 | Le composant rend un `<nav aria-label="Navigation entre les pages">` avec des liens `<a>` | T-05, T-06, T-07 |
| CA-03 | Les liens sont calcules automatiquement via `getPrevNext()` ou fournis via prop `links` | T-01 |
| CA-04 | Le composant ne rend rien quand `prev` et `next` sont tous deux `null` | T-04 |
| CA-05 | Le lien precedent affiche une fleche gauche, le label "Precedent" et le titre de la page | T-08, T-10, T-11 |
| CA-06 | Le lien suivant affiche le label "Suivant", le titre de la page et une fleche droite | T-09, T-10, T-12 |
| CA-07 | Un indicateur de section est affiche quand la navigation traverse une frontiere de section | T-19, T-20, T-22 |
| CA-08 | Pas d'indicateur quand la navigation reste dans la meme section | T-19, T-21 |
| CA-09 | Responsive : labels "Prec."/"Suiv." sur mobile, "Precedent"/"Suivant" sur desktop | T-24, T-25, T-26, T-27 |
| CA-10 | Responsive : layout empile sur mobile, cote a cote sur desktop | T-28 |
| CA-11 | Un seul lien prev → affiche sans placeholder visible | T-45 |
| CA-12 | Un seul lien next → aligne a droite via `ml-auto` | T-46 |
| CA-13 | `aria-label` descriptif sur chaque lien ("Precedent : {titre}" / "Suivant : {titre}") | T-16, T-17 |
| CA-14 | Focus ring visible sur les liens (`ring-2 ring-blue-500 ring-offset-2`) | T-18 |
| CA-15 | Fleches SVG avec `aria-hidden="true"` | T-13 |
| CA-16 | Contrastes WCAG AA respectes pour tous les etats | Verification manuelle section 5.2 |
| CA-17 | Protection XSS par echappement Astro | T-43, T-44 |
| CA-18 | Classes personnalisees supportees via prop `class` | T-37 |
| CA-19 | Data attributes pour les selecteurs (`data-prev-next`, `data-prev-next-prev`, `data-prev-next-next`, etc.) | T-38 a T-42 |
| CA-20 | 0 JavaScript cote client (composant 100% statique) | Inspection build |
| CA-21 | TypeScript compile sans erreur (`pnpm typecheck`) | CI |
| CA-22 | ESLint passe sans warning (`pnpm lint`) | CI |
| CA-23 | Les 50 tests unitaires passent | CI |

---

## 10. Definition of Done

- [ ] Fichier `src/components/layout/PrevNextLinks.astro` cree
- [ ] Interface TypeScript `Props` complete avec documentation JSDoc
- [ ] Import des types `PrevNextLinks`, `PrevNextItem`, `NavigationTree` depuis T-004-B1
- [ ] Import du helper `getPrevNext()`, `getCurrentSection()`, `SECTION_LABELS` depuis T-004-B4
- [ ] Import de `NAVIGATION_TREE` depuis T-004-B3
- [ ] Calcul automatique des liens via `getPrevNext(tree, Astro.url.pathname)`
- [ ] Support des liens pre-calcules via prop `links`
- [ ] Rendu conditionnel : rien si prev et next sont null
- [ ] Lien precedent avec fleche gauche SVG, label "Precedent", titre de page
- [ ] Lien suivant avec label "Suivant", titre de page, fleche droite SVG
- [ ] Indicateur de section cross-section avec label francais
- [ ] Pas d'indicateur quand navigation intra-section
- [ ] Labels responsive : "Prec."/"Suiv." sur mobile, "Precedent"/"Suivant" sur desktop
- [ ] Layout responsive : empile sur mobile, cote a cote sur desktop
- [ ] Gestion prev seul / next seul avec placeholder et alignement
- [ ] `aria-label` descriptif sur chaque lien
- [ ] `aria-hidden="true"` sur les fleches SVG
- [ ] Focus ring coherent avec le design system
- [ ] Hover : changement de bordure, fond, couleur titre et fleche
- [ ] Troncature texte `truncate` sur les titres longs
- [ ] Data attributes (`data-prev-next`, `data-prev-next-prev`, `data-prev-next-next`, `data-prev-next-prev-title`, `data-prev-next-next-title`, `data-prev-next-prev-section`, `data-prev-next-next-section`)
- [ ] Bordure superieure de separation (`border-t border-gray-200`)
- [ ] Tests unitaires passants (50 tests)
- [ ] 0 erreur TypeScript (`pnpm typecheck`)
- [ ] 0 erreur ESLint (`pnpm lint`)
- [ ] 0 JS cote client
- [ ] Code formate avec Prettier

---

## 11. Notes d'implementation

### 11.1 Ordre d'implementation recommande

1. Creer le fichier `src/components/layout/PrevNextLinks.astro` avec l'interface Props
2. Implementer le calcul des liens (automatique via `getPrevNext()` ou via prop `links`)
3. Implementer le rendu conditionnel (null/null = pas de rendu)
4. Implementer la structure HTML du lien precedent (fleche + label + titre)
5. Implementer la structure HTML du lien suivant (label + titre + fleche)
6. Ajouter la detection cross-section via `getCurrentSection()` et `SECTION_LABELS`
7. Implementer l'indicateur de section conditionnel
8. Implementer le responsive (labels abreges, layout empile/cote a cote)
9. Gerer les cas prev seul / next seul (placeholder, alignement)
10. Ajouter les data attributes
11. Ajouter les styles (focus ring, hover, transitions, bordure superieure)
12. Verifier avec `pnpm typecheck` et `pnpm lint`
13. Ecrire les tests unitaires

### 11.2 Points d'attention

| Point | Detail |
|-------|--------|
| **`getPrevNext()` peut retourner `{ prev: null, next: null }`** | Toujours verifier avant de rendre. Les pages non referencees dans l'arbre n'auront pas de liens prev/next. |
| **Detection cross-section** | La detection repose sur `getCurrentSection(Astro.url.pathname)` qui analyse le premier segment de l'URL. Si la page courante n'appartient a aucune section (ex: `/glossaire`), `currentSection` sera `null` et aucun indicateur cross-section ne sera affiche. |
| **`SECTION_LABELS`** | Utiliser le mapping `SECTION_LABELS` pour afficher le label francais de la section cible. Ne pas hardcoder les labels dans le composant. |
| **Alias de type `PrevNextLinksType`** | Comme le composant s'appelle `PrevNextLinks` et le type aussi, utiliser un alias `PrevNextLinksType` pour l'import du type : `import type { PrevNextLinks as PrevNextLinksType } from '@/types/navigation'`. |
| **`group` hover** | Utiliser la classe Tailwind `group` sur le lien `<a>` et `group-hover:*` sur les enfants pour coordonner les changements de couleur au hover. |
| **Placeholder pour l'alignement** | Quand `prev` est `null` et `next` est present, un `<div class="hidden md:block">` sert de spacer invisible sur desktop pour que `justify-between` aligne `next` a droite. Sur mobile (layout empile), ce div est cache. |
| **`text-right` sur le lien next** | Le lien "Suivant" a `text-right` pour aligner le texte a droite (label, titre, indicateur de section). La fleche est positionnee apres le bloc texte dans le DOM. |
| **`min-w-0` sur le wrapper texte** | Necessaire pour que `truncate` fonctionne a l'interieur d'un conteneur flex. Sans `min-w-0`, le conteneur flex ne reduira pas le texte. |
| **0 JS client** | Aucune directive `client:*` ne doit etre utilisee. Aucun `<script>` cote client. Le composant est entierement statique. |
| **Coherence visuelle avec la maquette** | Le composant doit s'afficher entre le contenu principal et le footer, avec une bordure superieure de separation. Voir la maquette du DocsLayout en section 8.4 de spec-US-004.md. |
| **Ordre des liens en mobile** | Sur mobile, les liens sont empiles : le lien precedent en premier (haut), le lien suivant en second (bas). Cela suit l'ordre de lecture naturel et maintient la coherence avec le DOM order. |

### 11.3 Extensions futures (hors scope)

| Extension | Description | User Story |
|-----------|-------------|------------|
| Navigation au clavier fleches | Raccourci clavier `←` / `→` pour naviguer entre les pages | Non definie |
| Indicateur de progression | "Page 3/8" ou barre de progression dans le composant | Non definie |
| Prefetch au hover | Utiliser `data-astro-prefetch` pour prefetcher la page suivante au hover | Non definie |
| Animation de transition | Transition de page fluide avec View Transitions API | Non definie |
| Mode sombre | Variantes de couleurs pour le dark mode | Non definie |

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
| T-004-F6 Breadcrumb | [T-004-F6-composant-Breadcrumb.md](./T-004-F6-composant-Breadcrumb.md) |
| T-004-F10 DocsLayout | [T-004-F10-layout-DocsLayout.md](./T-004-F10-layout-DocsLayout.md) |
| WAI-ARIA Navigation | https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html |
| RGAA 12.2 Navigation | https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#12.2 |
| Tailwind CSS Group Hover | https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 11/02/2026 | Creation initiale — liens Precedent/Suivant contextuels, indicateur cross-section, responsive, calcul automatique via getPrevNext(), 25 cas limites, 50 tests unitaires, 23 criteres d'acceptation |
