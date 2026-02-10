# T-004-F2 : Composant NavLink (lien de navigation avec etat actif et indicateur visuel)

| Metadonnee | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 10 fevrier 2026 |
| **Statut** | A faire |
| **User Story** | [US-004 - Naviguer facilement dans le framework](./spec-US-004.md) |
| **Dependances** | T-004-B1 (Types TypeScript navigation) |
| **Bloque** | T-004-F3 (DropdownMenu), T-004-F5 (MobileMenu), T-004-F9 (Sidebar), T-004-T3 (Tests composants atomiques) |

---

## 1. Objectif

Creer le composant **NavLink** qui sert de brique atomique pour tous les liens de navigation du site AIAD. Ce composant fournit :

- Un **lien HTML accessible** (`<a>`) avec gestion de l'etat actif via `aria-current="page"`
- Un **indicateur visuel** de la page courante (fond colore, bordure laterale ou soulignement selon le contexte)
- Le support des **badges** visuels (`new`, `essential`) issus des types `NavigationBadge`
- Des **variantes** adaptees a chaque contexte d'utilisation (header, sidebar, dropdown, mobile)
- La compatibilite avec les types `NavigationItem` definis en T-004-B1
- **0 JavaScript cote client** : l'etat actif est determine au build time via `Astro.url.pathname`

Ce composant est la fondation de tous les composants de navigation (DropdownMenu, MobileMenu, Sidebar) et assure la coherence visuelle et l'accessibilite sur l'ensemble du site.

---

## 2. Contexte technique

### 2.1 Stack

| Technologie | Version | Role |
|-------------|---------|------|
| Astro | 4.x | Composant statique (SSG, 0 JS client) |
| TypeScript | 5.x | Typage strict des props |
| Tailwind CSS | 3.x | Utility-first, etats visuels |

### 2.2 Arborescence

```
src/
├── components/
│   └── layout/
│       └── NavLink.astro           <-- CE COMPOSANT
├── types/
│   └── navigation.ts              # Types NavigationItem, NavigationBadge (T-004-B1)
├── layouts/
│   └── BaseLayout.astro           # Layout racine (T-004-F1)
└── pages/
    └── index.astro                # Page d'accueil (consommateur via Header)
```

### 2.3 Position dans l'architecture des composants

```
NavLink.astro                      <-- CE COMPOSANT (composant atomique)
├── DropdownMenu.astro (T-004-F3) <-- Consommateur (items du sous-menu)
├── MobileMenu.astro (T-004-F5)   <-- Consommateur (liens dans le menu mobile)
├── Sidebar.astro (T-004-F9)      <-- Consommateur (liens dans la sidebar)
└── Header.astro (T-004-F4)       <-- Consommateur indirect (via DropdownMenu)
```

### 2.4 Dependance T-004-B1

Le composant utilise les types suivants de `src/types/navigation.ts` :

```typescript
import type { NavigationBadge, NavigationSection } from '@/types/navigation'
```

- `NavigationBadge` : `'new' | 'essential'` — badge visuel a cote du label
- `NavigationSection` : `'framework' | 'mode-operatoire' | 'annexes'` — pour le code couleur par section

### 2.5 Conventions suivies

| Convention | Detail |
|-----------|--------|
| Nommage fichier | PascalCase dans `src/components/layout/` |
| TypeScript | Mode strict, props typees via `interface Props` |
| Imports | Alias `@/*` pour `src/*` |
| Design | Coherent avec CTAButton (focus ring `ring-2 ring-offset-2`) |
| Formatage | Prettier : pas de semicolons, single quotes, 2 espaces |

---

## 3. Specifications fonctionnelles

### 3.1 Description

Le composant `NavLink` est un **lien de navigation accessible** qui :

1. Rend un element `<a>` standard avec le `href` fourni
2. Detecte automatiquement si le lien correspond a la **page courante** (via `Astro.url.pathname`)
3. Applique `aria-current="page"` et un indicateur visuel sur le lien actif
4. Affiche optionnellement un **badge** (`new` ou `essential`) a cote du label
5. S'adapte visuellement a son **contexte** d'utilisation via la prop `variant`
6. Supporte un indicateur de **presence d'enfants** (chevron) pour les parents de sous-menus

### 3.2 Detection de l'etat actif

Le composant utilise `Astro.url.pathname` pour determiner si le lien est actif :

| Mode | Condition | Usage |
|------|-----------|-------|
| **Exact** (defaut) | `pathname === href` | Liens feuilles (pages terminales) |
| **Prefix** | `pathname === href \|\| pathname.startsWith(href + '/')` | Liens sections (Framework, Mode Operatoire, Annexes) |

La prop `activeMatch` controle le mode de detection.

**Exemples :**

| URL courante | `href` | `activeMatch` | Actif ? |
|--------------|--------|---------------|---------|
| `/framework/preambule` | `/framework/preambule` | `'exact'` | Oui |
| `/framework/preambule` | `/framework` | `'exact'` | Non |
| `/framework/preambule` | `/framework` | `'prefix'` | Oui |
| `/framework` | `/framework` | `'prefix'` | Oui |
| `/mode-operatoire/planification` | `/framework` | `'prefix'` | Non |
| `/annexes/templates/prd` | `/annexes/templates` | `'prefix'` | Oui |

### 3.3 Variantes visuelles

Le composant propose 4 variantes adaptees aux differents contextes :

| Variante | Contexte | Indicateur actif | Style inactif |
|----------|----------|-----------------|---------------|
| `'header'` | Barre de navigation principale | Soulignement `border-bottom-2` bleu | Texte `gray-700`, hover `gray-900` |
| `'sidebar'` | Navigation laterale docs | Fond `blue-50`, bordure gauche `blue-600` | Texte `gray-700`, hover fond `gray-50` |
| `'dropdown'` | Sous-menus deroulants | Fond `blue-50`, texte `blue-700` | Texte `gray-700`, hover fond `gray-50` |
| `'mobile'` | Menu mobile plein ecran | Fond `blue-50`, bordure gauche `blue-600` | Texte `gray-900`, hover fond `gray-50` |

### 3.4 Badges visuels

| Badge | Rendu | Style |
|-------|-------|-------|
| `'new'` | Pastille "Nouveau" a droite du label | `bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full` |
| `'essential'` | Pastille "Essentiel" a droite du label | `bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full` |
| `undefined` | Rien | — |

### 3.5 Chevron pour les parents

Quand `hasChildren` est `true`, un chevron SVG est affiche a droite du label (apres le badge eventuel). Le chevron pointe vers le bas pour indiquer qu'un sous-menu peut etre ouvert.

### 3.6 Accessibilite (RGAA AA)

| Critere | Implementation | Reference RGAA |
|---------|----------------|----------------|
| Etat courant | `aria-current="page"` sur le lien actif | 12.2 |
| Focus visible | `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2` | 10.7 |
| Contraste texte | Ratio >= 4.5:1 pour tous les etats (inactif, actif, hover) | 3.2 |
| Zone cliquable | Padding minimum `py-2 px-3` (44px hauteur min pour mobile) | 10.12 |
| Label explicite | Le texte du lien est le label — pas de `aria-label` necessaire sauf cas specifique | 6.1 |
| Lien externe | Non concerne (navigation interne uniquement) | — |

---

## 4. Specifications techniques

### 4.1 Interface TypeScript

```typescript
// src/components/layout/NavLink.astro (frontmatter)

import type { NavigationBadge, NavigationSection } from '@/types/navigation'

/**
 * Props du composant NavLink.
 *
 * Lien de navigation atomique avec etat actif, badge et variantes contextuelles.
 * Brique de base pour Header, DropdownMenu, MobileMenu et Sidebar.
 *
 * @example
 * ```astro
 * ---
 * import NavLink from '@components/layout/NavLink.astro'
 * ---
 * <NavLink
 *   href="/framework/preambule"
 *   label="Preambule"
 *   variant="sidebar"
 *   badge="essential"
 * />
 * ```
 */
export interface Props {
  // ── Navigation ─────────────────────────────────────

  /**
   * URL de destination du lien.
   * Doit commencer par '/' (navigation interne).
   */
  href: string

  /**
   * Texte affiche dans le lien.
   */
  label: string

  // ── Etat actif ─────────────────────────────────────

  /**
   * Mode de detection de l'etat actif.
   * - 'exact' : actif uniquement si pathname === href
   * - 'prefix' : actif si pathname commence par href
   * @default 'exact'
   */
  activeMatch?: 'exact' | 'prefix'

  /**
   * Forcer l'etat actif (outrepasse la detection automatique).
   * Utile pour les cas ou le parent controle l'etat.
   */
  isActive?: boolean

  // ── Visuels ────────────────────────────────────────

  /**
   * Variante visuelle adaptee au contexte d'utilisation.
   * @default 'sidebar'
   */
  variant?: 'header' | 'sidebar' | 'dropdown' | 'mobile'

  /**
   * Badge visuel a cote du label.
   */
  badge?: NavigationBadge

  /**
   * Section du site (pour le code couleur par section).
   * Non utilise directement par NavLink mais transmis par les parents
   * pour un eventuel rendu conditionnel.
   */
  section?: NavigationSection

  /**
   * Indique que ce lien a des enfants (sous-menu).
   * Affiche un chevron a droite du label.
   * @default false
   */
  hasChildren?: boolean

  // ── HTML ───────────────────────────────────────────

  /**
   * Classes CSS additionnelles sur le <a>.
   */
  class?: string

  /**
   * Attribut id du lien (utile pour aria-labelledby).
   */
  id?: string

  /**
   * Role ARIA si necessaire (ex: 'menuitem' dans un dropdown).
   */
  role?: string

  /**
   * Tabindex personnalise (ex: -1 pour les items de dropdown non focuses).
   */
  tabindex?: number
}
```

### 4.2 Implementation du composant

```astro
---
// src/components/layout/NavLink.astro

import type { NavigationBadge, NavigationSection } from '@/types/navigation'

export interface Props {
  href: string
  label: string
  activeMatch?: 'exact' | 'prefix'
  isActive?: boolean
  variant?: 'header' | 'sidebar' | 'dropdown' | 'mobile'
  badge?: NavigationBadge
  section?: NavigationSection
  hasChildren?: boolean
  class?: string
  id?: string
  role?: string
  tabindex?: number
}

const {
  href,
  label,
  activeMatch = 'exact',
  isActive: forcedActive,
  variant = 'sidebar',
  badge,
  section,
  hasChildren = false,
  class: className = '',
  id,
  role,
  tabindex,
} = Astro.props

// ── Detection de l'etat actif ──────────────────────────
const pathname = Astro.url.pathname
// Normaliser les trailing slashes pour la comparaison
const normalizedPathname = pathname.endsWith('/') && pathname !== '/'
  ? pathname.slice(0, -1)
  : pathname
const normalizedHref = href.endsWith('/') && href !== '/'
  ? href.slice(0, -1)
  : href

const isCurrentPage =
  forcedActive !== undefined
    ? forcedActive
    : activeMatch === 'prefix'
      ? normalizedPathname === normalizedHref
        || normalizedPathname.startsWith(normalizedHref + '/')
      : normalizedPathname === normalizedHref

// ── Classes par variante ───────────────────────────────
const variantStyles = {
  header: {
    base: 'inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
    active: 'text-blue-700 border-b-2 border-blue-600 rounded-b-none',
    inactive: 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
  },
  sidebar: {
    base: 'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors duration-150',
    active: 'bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 -ml-px',
    inactive: 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
  },
  dropdown: {
    base: 'flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md transition-colors duration-150',
    active: 'bg-blue-50 text-blue-700 font-medium',
    inactive: 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
  },
  mobile: {
    base: 'flex items-center gap-2 w-full px-4 py-3 text-base rounded-md transition-colors duration-150',
    active: 'bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600',
    inactive: 'text-gray-900 hover:bg-gray-50',
  },
} as const

const styles = variantStyles[variant]
const stateClasses = isCurrentPage ? styles.active : styles.inactive

// ── Classes badge ──────────────────────────────────────
const badgeStyles = {
  new: 'bg-green-100 text-green-800',
  essential: 'bg-amber-100 text-amber-800',
} as const

// ── Assemblage des classes finales ─────────────────────
const linkClasses = [
  styles.base,
  stateClasses,
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  className,
].filter(Boolean).join(' ')
---

<a
  href={href}
  class={linkClasses}
  aria-current={isCurrentPage ? 'page' : undefined}
  id={id}
  role={role}
  tabindex={tabindex}
  data-section={section}
  data-navlink
>
  <span class="truncate">{label}</span>

  {badge && (
    <span
      class={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${badgeStyles[badge]}`}
    >
      {badge === 'new' ? 'Nouveau' : 'Essentiel'}
    </span>
  )}

  {hasChildren && (
    <svg
      class="ml-auto h-4 w-4 shrink-0 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  )}
</a>
```

### 4.3 Data attributes

| Attribut | Valeur | Usage |
|----------|--------|-------|
| `data-navlink` | (presence) | Selecteur pour les tests et les composants parents |
| `data-section` | `'framework' \| 'mode-operatoire' \| 'annexes' \| undefined` | Identification de la section pour le styling contextuel |

### 4.4 Exemples d'utilisation

#### Utilisation minimale (sidebar)

```astro
---
import NavLink from '@components/layout/NavLink.astro'
---

<NavLink href="/framework/preambule" label="Preambule" />
```

**Sortie HTML (page courante = `/framework/preambule`) :**

```html
<a
  href="/framework/preambule"
  class="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors duration-150 bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 -ml-px focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  aria-current="page"
  data-navlink
>
  <span class="truncate">Preambule</span>
</a>
```

**Sortie HTML (page courante = `/framework/vision-philosophie`) :**

```html
<a
  href="/framework/preambule"
  class="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors duration-150 text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  data-navlink
>
  <span class="truncate">Preambule</span>
</a>
```

#### Variante header avec prefix match

```astro
<NavLink
  href="/framework"
  label="Framework"
  variant="header"
  activeMatch="prefix"
  hasChildren
/>
```

**Sortie HTML (page courante = `/framework/preambule`) :**

```html
<a
  href="/framework"
  class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 text-blue-700 border-b-2 border-blue-600 rounded-b-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  aria-current="page"
  data-navlink
>
  <span class="truncate">Framework</span>
  <svg class="ml-auto h-4 w-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
  </svg>
</a>
```

#### Avec badge "essential"

```astro
<NavLink
  href="/framework/preambule"
  label="Preambule"
  variant="sidebar"
  badge="essential"
  section="framework"
/>
```

**Sortie HTML (page non courante) :**

```html
<a
  href="/framework/preambule"
  class="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors duration-150 text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  data-section="framework"
  data-navlink
>
  <span class="truncate">Preambule</span>
  <span class="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap bg-amber-100 text-amber-800">
    Essentiel
  </span>
</a>
```

#### Avec badge "new"

```astro
<NavLink
  href="/annexes/agents/security"
  label="F1 - Agent Security"
  variant="dropdown"
  badge="new"
  section="annexes"
/>
```

**Sortie HTML :**

```html
<a
  href="/annexes/agents/security"
  class="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md transition-colors duration-150 text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  data-section="annexes"
  data-navlink
>
  <span class="truncate">F1 - Agent Security</span>
  <span class="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap bg-green-100 text-green-800">
    Nouveau
  </span>
</a>
```

#### Variante mobile

```astro
<NavLink
  href="/mode-operatoire/planification"
  label="Planification"
  variant="mobile"
  section="mode-operatoire"
/>
```

#### Dans un dropdown avec role menuitem

```astro
<NavLink
  href="/framework/preambule"
  label="Preambule"
  variant="dropdown"
  role="menuitem"
  tabindex={-1}
/>
```

#### Etat actif force

```astro
<NavLink
  href="/framework"
  label="Framework"
  variant="header"
  isActive={true}
/>
```

---

## 5. Design et Style

### 5.1 Palette de couleurs par etat

| Etat | Texte | Fond | Bordure |
|------|-------|------|---------|
| Inactif | `text-gray-700` (#374151) | transparent | — |
| Hover (inactif) | `text-gray-900` (#111827) | `bg-gray-50` (#F9FAFB) | — |
| Actif (header) | `text-blue-700` (#1D4ED8) | transparent | `border-b-2 border-blue-600` (#2563EB) |
| Actif (sidebar) | `text-blue-700` (#1D4ED8) | `bg-blue-50` (#EFF6FF) | `border-l-2 border-blue-600` (#2563EB) |
| Actif (dropdown) | `text-blue-700` (#1D4ED8) | `bg-blue-50` (#EFF6FF) | — |
| Actif (mobile) | `text-blue-700` (#1D4ED8) | `bg-blue-50` (#EFF6FF) | `border-l-2 border-blue-600` (#2563EB) |
| Focus | — | — | `ring-2 ring-blue-500 ring-offset-2` |

### 5.2 Verification du contraste (WCAG AA)

| Combinaison | Ratio | Conforme AA ? |
|-------------|-------|---------------|
| `gray-700` (#374151) sur `white` (#FFFFFF) | 9.12:1 | Oui (>= 4.5:1) |
| `gray-900` (#111827) sur `gray-50` (#F9FAFB) | 15.4:1 | Oui (>= 4.5:1) |
| `blue-700` (#1D4ED8) sur `white` (#FFFFFF) | 5.43:1 | Oui (>= 4.5:1) |
| `blue-700` (#1D4ED8) sur `blue-50` (#EFF6FF) | 4.88:1 | Oui (>= 4.5:1) |
| `green-800` (#166534) sur `green-100` (#DCFCE7) | 5.81:1 | Oui (>= 4.5:1) |
| `amber-800` (#92400E) sur `amber-100` (#FEF3C7) | 5.18:1 | Oui (>= 4.5:1) |

### 5.3 Dimensions et espacement

| Variante | Padding | Hauteur min implicite | Taille texte |
|----------|---------|----------------------|-------------|
| `header` | `px-3 py-2` | ~36px | `text-sm` (14px) |
| `sidebar` | `px-3 py-2` | ~36px | `text-sm` (14px) |
| `dropdown` | `px-3 py-2` | ~36px | `text-sm` (14px) |
| `mobile` | `px-4 py-3` | ~48px (>= 44px tactile) | `text-base` (16px) |

### 5.4 Coherence avec le design system

| Aspect | Conformite |
|--------|------------|
| Focus ring | `ring-2 ring-blue-500 ring-offset-2` — coherent avec CTAButton (`ring-2 ring-offset-2`) |
| Couleurs actives | `blue-600/700/50` — coherent avec BaseLayout skip-link (`bg-blue-600`) |
| Transition | `transition-colors duration-150` — rapide et subtil |
| Border radius | `rounded-md` — coherent avec les composants existants |

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Matrice des cas limites

| ID | Cas | Comportement attendu | Priorite |
|----|-----|----------------------|----------|
| CL-01 | Page courante correspond exactement au `href` | Lien marque comme actif (`aria-current="page"`) | Haute |
| CL-02 | Page courante ne correspond pas au `href` | Lien inactif, pas d'`aria-current` | Haute |
| CL-03 | `activeMatch="prefix"` avec URL enfant | Lien actif (ex: href=`/framework` actif sur `/framework/preambule`) | Haute |
| CL-04 | `activeMatch="prefix"` avec URL sans lien | Lien inactif (ex: href=`/framework` inactif sur `/mode-operatoire`) | Haute |
| CL-05 | `activeMatch="prefix"` sur `/` (racine) | Actif sur toutes les pages — a eviter, utiliser `exact` pour la racine | Moyenne |
| CL-06 | `href` avec trailing slash (`/framework/`) | Normalise : trailing slash retire avant comparaison | Haute |
| CL-07 | URL courante avec trailing slash | Normalise : trailing slash retire avant comparaison | Haute |
| CL-08 | `href="/"` (page d'accueil) | Trailing slash preserve pour la racine | Haute |
| CL-09 | `isActive` force a `true` | Lien toujours actif independamment de l'URL | Moyenne |
| CL-10 | `isActive` force a `false` | Lien toujours inactif independamment de l'URL | Moyenne |
| CL-11 | `badge` non fourni | Aucun badge affiche | Haute |
| CL-12 | `badge="new"` | Badge vert "Nouveau" affiche | Haute |
| CL-13 | `badge="essential"` | Badge ambre "Essentiel" affiche | Haute |
| CL-14 | `hasChildren=true` | Chevron affiche a droite | Haute |
| CL-15 | `hasChildren=false` (defaut) | Pas de chevron | Haute |
| CL-16 | `badge` + `hasChildren` combines | Badge puis chevron, dans cet ordre | Moyenne |
| CL-17 | `label` tres long (>50 caracteres) | Texte tronque avec `truncate` (ellipsis) | Moyenne |
| CL-18 | `label` avec caracteres speciaux (accents, `&`, `<`) | Echappe automatiquement par Astro | Haute |
| CL-19 | `class` personnalise fourni | Ajoute aux classes existantes (ne remplace pas) | Moyenne |
| CL-20 | `variant` non fourni | Utilise `'sidebar'` par defaut | Moyenne |
| CL-21 | `role="menuitem"` fourni | Attribut `role` rendu sur le `<a>` | Moyenne |
| CL-22 | `tabindex={-1}` fourni | Attribut `tabindex` rendu sur le `<a>` | Moyenne |
| CL-23 | `section` fourni | `data-section` rendu sur le `<a>` | Basse |
| CL-24 | `section` non fourni | `data-section` absent du rendu | Basse |
| CL-25 | `id` fourni | Attribut `id` rendu sur le `<a>` | Basse |

### 6.2 Strategie de fallback

```
Props manquantes ?
├── href: REQUIS (TypeScript l'impose)
├── label: REQUIS (TypeScript l'impose)
├── activeMatch: non fourni → 'exact'
├── isActive: non fourni → detection automatique via Astro.url.pathname
├── variant: non fourni → 'sidebar'
├── badge: non fourni → pas de badge
├── section: non fourni → pas de data-section
├── hasChildren: non fourni → false (pas de chevron)
├── class: non fourni → '' (pas de classes additionnelles)
├── id: non fourni → pas d'attribut id
├── role: non fourni → pas d'attribut role
└── tabindex: non fourni → pas d'attribut tabindex
```

---

## 7. Exemples entree/sortie

### 7.1 Lien inactif (sidebar, defaut)

**Entree :**

```astro
<NavLink href="/framework/preambule" label="Preambule" />
```

**URL courante :** `/framework/vision-philosophie`

**Sortie HTML :**

```html
<a
  href="/framework/preambule"
  class="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors duration-150 text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  data-navlink
>
  <span class="truncate">Preambule</span>
</a>
```

### 7.2 Lien actif (sidebar)

**Entree :**

```astro
<NavLink href="/framework/preambule" label="Preambule" />
```

**URL courante :** `/framework/preambule`

**Sortie HTML :**

```html
<a
  href="/framework/preambule"
  class="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors duration-150 bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 -ml-px focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  aria-current="page"
  data-navlink
>
  <span class="truncate">Preambule</span>
</a>
```

### 7.3 Lien header avec prefix match actif

**Entree :**

```astro
<NavLink
  href="/framework"
  label="Framework"
  variant="header"
  activeMatch="prefix"
  hasChildren
/>
```

**URL courante :** `/framework/ecosysteme`

**Sortie HTML :**

```html
<a
  href="/framework"
  class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 text-blue-700 border-b-2 border-blue-600 rounded-b-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  aria-current="page"
  data-navlink
>
  <span class="truncate">Framework</span>
  <svg class="ml-auto h-4 w-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
  </svg>
</a>
```

### 7.4 Lien avec badge + section

**Entree :**

```astro
<NavLink
  href="/framework/preambule"
  label="Preambule"
  badge="essential"
  section="framework"
/>
```

**URL courante :** `/`

**Sortie HTML :**

```html
<a
  href="/framework/preambule"
  class="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors duration-150 text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  data-section="framework"
  data-navlink
>
  <span class="truncate">Preambule</span>
  <span class="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap bg-amber-100 text-amber-800">
    Essentiel
  </span>
</a>
```

### 7.5 Trailing slash normalise

**Entree :**

```astro
<NavLink href="/framework/preambule/" label="Preambule" />
```

**URL courante :** `/framework/preambule`

**Sortie HTML :** Lien marque comme actif (`aria-current="page"`) car les trailing slashes sont normalises.

### 7.6 Variante mobile

**Entree :**

```astro
<NavLink
  href="/mode-operatoire/planification"
  label="Planification"
  variant="mobile"
  section="mode-operatoire"
/>
```

**URL courante :** `/mode-operatoire/planification`

**Sortie HTML :**

```html
<a
  href="/mode-operatoire/planification"
  class="flex items-center gap-2 w-full px-4 py-3 text-base rounded-md transition-colors duration-150 bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  aria-current="page"
  data-section="mode-operatoire"
  data-navlink
>
  <span class="truncate">Planification</span>
</a>
```

### 7.7 Dropdown avec role menuitem

**Entree :**

```astro
<NavLink
  href="/framework/preambule"
  label="Preambule"
  variant="dropdown"
  role="menuitem"
  tabindex={-1}
/>
```

**URL courante :** `/`

**Sortie HTML :**

```html
<a
  href="/framework/preambule"
  class="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md transition-colors duration-150 text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  role="menuitem"
  tabindex="-1"
  data-navlink
>
  <span class="truncate">Preambule</span>
</a>
```

### 7.8 Protection XSS (label)

**Entree :**

```astro
<NavLink href="/test" label='<script>alert("xss")</script>' />
```

**Sortie HTML :**

```html
<a href="/test" class="..." data-navlink>
  <span class="truncate">&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</span>
</a>
```

> Astro echappe automatiquement les expressions `{variable}` dans les templates.

---

## 8. Tests

### 8.1 Fichiers de test

| Fichier | Type | Framework |
|---------|------|-----------|
| `tests/unit/components/layout/nav-link.test.ts` | Unitaire | Vitest + Astro Container |

### 8.2 Tests unitaires (Vitest)

```typescript
// tests/unit/components/layout/nav-link.test.ts
import { describe, it, expect } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import NavLink from '@components/layout/NavLink.astro'

// ── Helpers ────────────────────────────────────────────────

async function renderNavLink(
  props: Record<string, unknown> = {},
  currentPath: string = '/',
) {
  const container = await AstroContainer.create()
  return container.renderToString(NavLink, {
    props: {
      href: '/test',
      label: 'Test Link',
      ...props,
    },
    request: new Request(`https://aiad.dev${currentPath}`),
  })
}

// ── Tests structure HTML ──────────────────────────────────

describe('NavLink — Structure HTML', () => {
  it('T-01 : genere un element <a>', async () => {
    const html = await renderNavLink()
    expect(html).toContain('<a')
    expect(html).toContain('</a>')
  })

  it('T-02 : le href est present sur le lien', async () => {
    const html = await renderNavLink({ href: '/framework/preambule' })
    expect(html).toContain('href="/framework/preambule"')
  })

  it('T-03 : le label est affiche dans un <span>', async () => {
    const html = await renderNavLink({ label: 'Preambule' })
    expect(html).toContain('<span')
    expect(html).toContain('Preambule')
    expect(html).toContain('truncate')
  })

  it('T-04 : le data-navlink est present', async () => {
    const html = await renderNavLink()
    expect(html).toContain('data-navlink')
  })
})

// ── Tests etat actif ──────────────────────────────────────

describe('NavLink — Etat actif', () => {
  it('T-05 : aria-current="page" quand le href correspond a la page courante (exact)', async () => {
    const html = await renderNavLink(
      { href: '/framework/preambule' },
      '/framework/preambule',
    )
    expect(html).toContain('aria-current="page"')
  })

  it('T-06 : pas d\'aria-current quand le href ne correspond pas (exact)', async () => {
    const html = await renderNavLink(
      { href: '/framework/preambule' },
      '/framework/vision-philosophie',
    )
    expect(html).not.toContain('aria-current')
  })

  it('T-07 : actif avec activeMatch="prefix" quand l\'URL est enfant', async () => {
    const html = await renderNavLink(
      { href: '/framework', activeMatch: 'prefix' },
      '/framework/preambule',
    )
    expect(html).toContain('aria-current="page"')
  })

  it('T-08 : actif avec activeMatch="prefix" quand l\'URL correspond exactement', async () => {
    const html = await renderNavLink(
      { href: '/framework', activeMatch: 'prefix' },
      '/framework',
    )
    expect(html).toContain('aria-current="page"')
  })

  it('T-09 : inactif avec activeMatch="prefix" quand l\'URL est dans une autre section', async () => {
    const html = await renderNavLink(
      { href: '/framework', activeMatch: 'prefix' },
      '/mode-operatoire/planification',
    )
    expect(html).not.toContain('aria-current')
  })

  it('T-10 : isActive=true force l\'etat actif', async () => {
    const html = await renderNavLink(
      { href: '/framework', isActive: true },
      '/mode-operatoire',
    )
    expect(html).toContain('aria-current="page"')
  })

  it('T-11 : isActive=false force l\'etat inactif', async () => {
    const html = await renderNavLink(
      { href: '/framework/preambule', isActive: false },
      '/framework/preambule',
    )
    expect(html).not.toContain('aria-current')
  })
})

// ── Tests trailing slash ──────────────────────────────────

describe('NavLink — Trailing slash', () => {
  it('T-12 : normalise le href avec trailing slash', async () => {
    const html = await renderNavLink(
      { href: '/framework/preambule/' },
      '/framework/preambule',
    )
    expect(html).toContain('aria-current="page"')
  })

  it('T-13 : normalise l\'URL courante avec trailing slash', async () => {
    const html = await renderNavLink(
      { href: '/framework/preambule' },
      '/framework/preambule/',
    )
    expect(html).toContain('aria-current="page"')
  })

  it('T-14 : la racine "/" n\'est pas affectee par la normalisation', async () => {
    const html = await renderNavLink(
      { href: '/' },
      '/',
    )
    expect(html).toContain('aria-current="page"')
  })
})

// ── Tests variantes ───────────────────────────────────────

describe('NavLink — Variantes', () => {
  it('T-15 : variante sidebar par defaut', async () => {
    const html = await renderNavLink()
    expect(html).toContain('px-3 py-2')
    expect(html).toContain('text-sm')
  })

  it('T-16 : variante header', async () => {
    const html = await renderNavLink({ variant: 'header' })
    expect(html).toContain('inline-flex')
    expect(html).toContain('font-medium')
  })

  it('T-17 : variante dropdown a w-full', async () => {
    const html = await renderNavLink({ variant: 'dropdown' })
    expect(html).toContain('w-full')
  })

  it('T-18 : variante mobile a un padding plus grand', async () => {
    const html = await renderNavLink({ variant: 'mobile' })
    expect(html).toContain('px-4')
    expect(html).toContain('py-3')
    expect(html).toContain('text-base')
  })

  it('T-19 : variante sidebar active a une bordure gauche', async () => {
    const html = await renderNavLink(
      { href: '/test', variant: 'sidebar' },
      '/test',
    )
    expect(html).toContain('border-l-2')
    expect(html).toContain('border-blue-600')
  })

  it('T-20 : variante header active a un soulignement', async () => {
    const html = await renderNavLink(
      { href: '/test', variant: 'header' },
      '/test',
    )
    expect(html).toContain('border-b-2')
    expect(html).toContain('border-blue-600')
  })

  it('T-21 : variante dropdown active a un fond bleu', async () => {
    const html = await renderNavLink(
      { href: '/test', variant: 'dropdown' },
      '/test',
    )
    expect(html).toContain('bg-blue-50')
    expect(html).toContain('text-blue-700')
  })
})

// ── Tests badge ───────────────────────────────────────────

describe('NavLink — Badge', () => {
  it('T-22 : pas de badge par defaut', async () => {
    const html = await renderNavLink()
    expect(html).not.toContain('Nouveau')
    expect(html).not.toContain('Essentiel')
    expect(html).not.toContain('rounded-full')
  })

  it('T-23 : badge "new" affiche "Nouveau"', async () => {
    const html = await renderNavLink({ badge: 'new' })
    expect(html).toContain('Nouveau')
    expect(html).toContain('bg-green-100')
    expect(html).toContain('text-green-800')
  })

  it('T-24 : badge "essential" affiche "Essentiel"', async () => {
    const html = await renderNavLink({ badge: 'essential' })
    expect(html).toContain('Essentiel')
    expect(html).toContain('bg-amber-100')
    expect(html).toContain('text-amber-800')
  })

  it('T-25 : badge a les classes de style attendues', async () => {
    const html = await renderNavLink({ badge: 'new' })
    expect(html).toContain('text-xs')
    expect(html).toContain('font-medium')
    expect(html).toContain('px-2')
    expect(html).toContain('rounded-full')
  })
})

// ── Tests chevron ─────────────────────────────────────────

describe('NavLink — Chevron', () => {
  it('T-26 : pas de chevron par defaut', async () => {
    const html = await renderNavLink()
    expect(html).not.toContain('<svg')
  })

  it('T-27 : chevron affiche quand hasChildren=true', async () => {
    const html = await renderNavLink({ hasChildren: true })
    expect(html).toContain('<svg')
    expect(html).toContain('aria-hidden="true"')
  })

  it('T-28 : chevron a la classe ml-auto pour etre a droite', async () => {
    const html = await renderNavLink({ hasChildren: true })
    expect(html).toContain('ml-auto')
  })
})

// ── Tests classes et attributs ────────────────────────────

describe('NavLink — Classes et attributs', () => {
  it('T-29 : classe personnalisee ajoutee', async () => {
    const html = await renderNavLink({ class: 'my-custom-class' })
    expect(html).toContain('my-custom-class')
  })

  it('T-30 : focus ring present', async () => {
    const html = await renderNavLink()
    expect(html).toContain('focus:ring-2')
    expect(html).toContain('focus:ring-blue-500')
    expect(html).toContain('focus:ring-offset-2')
  })

  it('T-31 : data-section rendu quand section fourni', async () => {
    const html = await renderNavLink({ section: 'framework' })
    expect(html).toContain('data-section="framework"')
  })

  it('T-32 : pas de data-section sans prop section', async () => {
    const html = await renderNavLink()
    // data-section ne doit pas etre rendu ou doit etre vide
    expect(html).not.toMatch(/data-section="[^"]+"/);
  })

  it('T-33 : id rendu quand fourni', async () => {
    const html = await renderNavLink({ id: 'nav-framework' })
    expect(html).toContain('id="nav-framework"')
  })

  it('T-34 : role rendu quand fourni', async () => {
    const html = await renderNavLink({ role: 'menuitem' })
    expect(html).toContain('role="menuitem"')
  })

  it('T-35 : tabindex rendu quand fourni', async () => {
    const html = await renderNavLink({ tabindex: -1 })
    expect(html).toContain('tabindex="-1"')
  })

  it('T-36 : transition-colors presente', async () => {
    const html = await renderNavLink()
    expect(html).toContain('transition-colors')
  })
})

// ── Tests protection XSS ─────────────────────────────────

describe('NavLink — Protection XSS', () => {
  it('T-37 : label avec caracteres HTML est echappe', async () => {
    const html = await renderNavLink({ label: '<script>alert("xss")</script>' })
    expect(html).not.toContain('<script>alert')
    expect(html).toContain('&lt;script&gt;')
  })

  it('T-38 : label avec accents et caracteres speciaux', async () => {
    const html = await renderNavLink({ label: 'Ecosysteme & Architecture — Vue d\'ensemble' })
    expect(html).toContain('Ecosysteme')
  })
})

// ── Tests badge + chevron combines ────────────────────────

describe('NavLink — Combinaisons', () => {
  it('T-39 : badge et chevron affiches ensemble', async () => {
    const html = await renderNavLink({ badge: 'essential', hasChildren: true })
    expect(html).toContain('Essentiel')
    expect(html).toContain('<svg')
    // Le badge doit apparaitre avant le chevron
    const badgePos = html.indexOf('Essentiel')
    const chevronPos = html.indexOf('<svg')
    expect(badgePos).toBeLessThan(chevronPos)
  })

  it('T-40 : lien actif avec badge', async () => {
    const html = await renderNavLink(
      { href: '/test', badge: 'new' },
      '/test',
    )
    expect(html).toContain('aria-current="page"')
    expect(html).toContain('Nouveau')
  })
})
```

### 8.3 Matrice de couverture

| ID | Test | Type | Assertion | Priorite |
|----|------|------|-----------|----------|
| T-01 | Element `<a>` genere | Unit | `toContain('<a')` | Haute |
| T-02 | `href` present | Unit | `toContain('href=')` | Haute |
| T-03 | Label dans `<span>` avec truncate | Unit | `toContain('truncate')` | Haute |
| T-04 | `data-navlink` present | Unit | `toContain('data-navlink')` | Haute |
| T-05 | `aria-current="page"` quand actif (exact) | Unit | `toContain('aria-current="page"')` | Haute |
| T-06 | Pas d'`aria-current` quand inactif | Unit | `not.toContain('aria-current')` | Haute |
| T-07 | Actif avec prefix + URL enfant | Unit | `toContain('aria-current="page"')` | Haute |
| T-08 | Actif avec prefix + URL exacte | Unit | `toContain('aria-current="page"')` | Haute |
| T-09 | Inactif avec prefix + autre section | Unit | `not.toContain('aria-current')` | Haute |
| T-10 | `isActive=true` force l'etat | Unit | `toContain('aria-current="page"')` | Moyenne |
| T-11 | `isActive=false` force l'etat | Unit | `not.toContain('aria-current')` | Moyenne |
| T-12 | Trailing slash sur href | Unit | `toContain('aria-current')` | Haute |
| T-13 | Trailing slash sur URL courante | Unit | `toContain('aria-current')` | Haute |
| T-14 | Racine `/` preservee | Unit | `toContain('aria-current')` | Haute |
| T-15 | Variante sidebar par defaut | Unit | `toContain('px-3 py-2')` | Moyenne |
| T-16 | Variante header | Unit | `toContain('inline-flex')` | Moyenne |
| T-17 | Variante dropdown `w-full` | Unit | `toContain('w-full')` | Moyenne |
| T-18 | Variante mobile padding grand | Unit | `toContain('px-4')` | Moyenne |
| T-19 | Sidebar active : bordure gauche | Unit | `toContain('border-l-2')` | Haute |
| T-20 | Header actif : soulignement | Unit | `toContain('border-b-2')` | Haute |
| T-21 | Dropdown actif : fond bleu | Unit | `toContain('bg-blue-50')` | Haute |
| T-22 | Pas de badge par defaut | Unit | `not.toContain('Nouveau')` | Haute |
| T-23 | Badge "new" → "Nouveau" vert | Unit | `toContain('bg-green-100')` | Haute |
| T-24 | Badge "essential" → "Essentiel" ambre | Unit | `toContain('bg-amber-100')` | Haute |
| T-25 | Badge : classes de style | Unit | `toContain('rounded-full')` | Moyenne |
| T-26 | Pas de chevron par defaut | Unit | `not.toContain('<svg')` | Haute |
| T-27 | Chevron avec `hasChildren` | Unit | `toContain('<svg')` | Haute |
| T-28 | Chevron a droite (`ml-auto`) | Unit | `toContain('ml-auto')` | Moyenne |
| T-29 | Classe personnalisee | Unit | `toContain('my-custom-class')` | Moyenne |
| T-30 | Focus ring | Unit | `toContain('focus:ring-2')` | Haute |
| T-31 | `data-section` rendu | Unit | `toContain('data-section')` | Basse |
| T-32 | Pas de `data-section` sans prop | Unit | `not.toMatch(...)` | Basse |
| T-33 | `id` rendu | Unit | `toContain('id=')` | Basse |
| T-34 | `role` rendu | Unit | `toContain('role=')` | Moyenne |
| T-35 | `tabindex` rendu | Unit | `toContain('tabindex=')` | Moyenne |
| T-36 | Transition | Unit | `toContain('transition-colors')` | Basse |
| T-37 | XSS label echappe | Unit | `not.toContain('<script>')` | Haute |
| T-38 | Label avec accents | Unit | `toContain('Ecosysteme')` | Moyenne |
| T-39 | Badge + chevron combines | Unit | Badge avant chevron | Moyenne |
| T-40 | Actif + badge | Unit | Les deux presents | Moyenne |

---

## 9. Criteres d'acceptation

| ID | Critere | Verifie par |
|----|---------|-------------|
| CA-01 | Le fichier `src/components/layout/NavLink.astro` est cree | Verification fichier |
| CA-02 | Le composant rend un element `<a>` avec le `href` et le `label` fournis | T-01, T-02, T-03 |
| CA-03 | `aria-current="page"` est rendu quand le lien est actif (detection automatique) | T-05, T-06 |
| CA-04 | Le mode `activeMatch="prefix"` detecte les URLs enfants | T-07, T-08, T-09 |
| CA-05 | `isActive` permet de forcer l'etat actif/inactif | T-10, T-11 |
| CA-06 | Les trailing slashes sont normalises pour la comparaison | T-12, T-13, T-14 |
| CA-07 | 4 variantes (`header`, `sidebar`, `dropdown`, `mobile`) avec styles differencies | T-15 a T-21 |
| CA-08 | Indicateur actif correct par variante (soulignement header, bordure sidebar, fond dropdown) | T-19, T-20, T-21 |
| CA-09 | Badge "new" affiche "Nouveau" en vert, badge "essential" affiche "Essentiel" en ambre | T-22 a T-25 |
| CA-10 | Chevron affiche quand `hasChildren=true` | T-26, T-27, T-28 |
| CA-11 | Focus ring visible (`ring-2 ring-blue-500 ring-offset-2`) | T-30 |
| CA-12 | Contrastes WCAG AA respectes pour tous les etats | Verification manuelle section 5.2 |
| CA-13 | Zone cliquable >= 44px en variante mobile (`py-3`) | T-18 |
| CA-14 | Protection XSS par echappement Astro | T-37, T-38 |
| CA-15 | Props `class`, `id`, `role`, `tabindex` transmises au `<a>` | T-29, T-33, T-34, T-35 |
| CA-16 | `data-navlink` et `data-section` pour les selecteurs | T-04, T-31, T-32 |
| CA-17 | 0 JavaScript cote client (composant 100% statique) | Inspection build |
| CA-18 | TypeScript compile sans erreur (`pnpm typecheck`) | CI |
| CA-19 | ESLint passe sans warning (`pnpm lint`) | CI |
| CA-20 | Les 40 tests unitaires passent | CI |

---

## 10. Definition of Done

- [ ] Fichier `src/components/layout/NavLink.astro` cree
- [ ] Interface TypeScript `Props` complete avec documentation JSDoc
- [ ] Import des types `NavigationBadge` et `NavigationSection` depuis T-004-B1
- [ ] Detection automatique de l'etat actif via `Astro.url.pathname`
- [ ] Support du mode exact et prefix pour `activeMatch`
- [ ] Normalisation des trailing slashes
- [ ] Override par `isActive` (force actif/inactif)
- [ ] 4 variantes visuelles (header, sidebar, dropdown, mobile)
- [ ] Indicateur actif par variante (soulignement, bordure gauche, fond)
- [ ] `aria-current="page"` sur le lien actif
- [ ] Badges "Nouveau" (vert) et "Essentiel" (ambre)
- [ ] Chevron pour les parents de sous-menus
- [ ] Focus ring coherent avec le design system
- [ ] Props HTML transmises (`class`, `id`, `role`, `tabindex`)
- [ ] Data attributes (`data-navlink`, `data-section`)
- [ ] Tests unitaires passants (40 tests)
- [ ] 0 erreur TypeScript (`pnpm typecheck`)
- [ ] 0 erreur ESLint (`pnpm lint`)
- [ ] 0 JS cote client
- [ ] Code formate avec Prettier

---

## 11. Notes d'implementation

### 11.1 Ordre d'implementation recommande

1. Creer le fichier `src/components/layout/NavLink.astro` avec l'interface Props
2. Implementer le `<a>` basique avec `href` et `label`
3. Ajouter la detection de l'etat actif (`Astro.url.pathname`, normalisation trailing slash)
4. Ajouter le support `activeMatch` (exact vs prefix)
5. Ajouter le support `isActive` (override)
6. Implementer les 4 variantes visuelles avec les styles Tailwind
7. Ajouter les badges (new, essential)
8. Ajouter le chevron (`hasChildren`)
9. Ajouter les props HTML (`class`, `id`, `role`, `tabindex`)
10. Ajouter les data attributes (`data-navlink`, `data-section`)
11. Verifier avec `pnpm typecheck` et `pnpm lint`
12. Ecrire les tests unitaires

### 11.2 Points d'attention

| Point | Detail |
|-------|--------|
| **Trailing slash** | Astro peut generer des URLs avec ou sans trailing slash selon la configuration. La normalisation dans le composant assure la compatibilite dans les deux cas. |
| **`activeMatch="prefix"` sur "/"** | Utiliser `prefix` sur `href="/"` rendrait le lien actif sur TOUTES les pages. Toujours utiliser `exact` pour la page d'accueil. |
| **`aria-current` vs `aria-selected`** | Pour les liens de navigation, `aria-current="page"` est le pattern correct (WAI-ARIA Authoring Practices). `aria-selected` est pour les onglets. |
| **0 JS client** | Aucune directive `client:*` ne doit etre utilisee. L'etat actif est determine au build time par Astro. |
| **Chevron orientation** | Le chevron pointe vers le bas (pour indiquer un sous-menu). Les composants parents (DropdownMenu) peuvent le faire pivoter via CSS si besoin (ex: `rotate-180` quand ouvert). |
| **Contraste badges** | Les combinaisons `green-800/green-100` et `amber-800/amber-100` respectent toutes le ratio >= 4.5:1. |
| **`truncate` sur le label** | Le `<span class="truncate">` previent les debordements de texte long. Le texte complet reste accessible via le contenu textuel du lien. |

### 11.3 Extensions futures (hors scope)

| Extension | Description | User Story |
|-----------|-------------|------------|
| Icone avant le label | Ajout d'un slot ou prop `icon` pour afficher une icone a gauche du texte | Non definie |
| Compteur (badge numerique) | Badge affichant un nombre (ex: nombre de fiches dans une categorie) | Non definie |
| Tooltip au hover | Info supplementaire au survol pour les labels tronques | Non definie |
| Animation chevron | Rotation du chevron selon l'etat ouvert/ferme du sous-menu (via JS parent) | T-004-F3 |
| Mode sombre | Variantes de couleurs pour le dark mode | Non definie |

---

## 12. References

| Ressource | Lien |
|-----------|------|
| US-004 Spec | [spec-US-004.md](./spec-US-004.md) |
| Architecture | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| T-004-B1 Types navigation | [T-004-B1-types-typescript-navigation.md](./T-004-B1-types-typescript-navigation.md) |
| T-004-F1 BaseLayout | [T-004-F1-composant-BaseLayout.md](./T-004-F1-composant-BaseLayout.md) |
| T-004-F3 DropdownMenu | [T-004-F3-composant-DropdownMenu.md](./T-004-F3-composant-DropdownMenu.md) |
| T-004-F5 MobileMenu | [T-004-F5-composant-MobileMenu.md](./T-004-F5-composant-MobileMenu.md) |
| T-004-F9 Sidebar | [T-004-F9-composant-Sidebar.md](./T-004-F9-composant-Sidebar.md) |
| CTAButton (design reference) | [src/components/common/CTAButton.astro](../../../src/components/common/CTAButton.astro) |
| WAI-ARIA aria-current | https://www.w3.org/TR/wai-aria-1.1/#aria-current |
| RGAA 12.2 Navigation | https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#12.2 |
| Tailwind CSS Focus Ring | https://tailwindcss.com/docs/ring-width |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 10/02/2026 | Creation initiale — 4 variantes, detection etat actif (exact/prefix), badges, chevron, 25 cas limites, 40 tests unitaires, 20 criteres d'acceptation |
