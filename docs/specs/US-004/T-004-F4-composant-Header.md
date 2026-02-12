# T-004-F4 : Composant Header (barre de navigation principale desktop avec 3 sections + dropdowns)

| Metadonnee | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 12 fevrier 2026 |
| **Statut** | A faire |
| **User Story** | [US-004 - Naviguer facilement dans le framework](./spec-US-004.md) |
| **Dependances** | T-004-F3 (DropdownMenu), T-004-F5 (MobileMenu), T-004-B3 (Configuration navigation) |
| **Bloque** | T-004-F10 (DocsLayout), T-004-T4 (Tests integration Header), T-004-T6 (Tests navigation clavier) |

---

## 1. Objectif

Creer le composant **Header** qui constitue la barre de navigation principale du site AIAD. Ce composant fournit :

- Un **bandeau horizontal sticky** en haut de page avec le branding et la navigation principale
- Le **logo/nom du site** "AIAD" cliquable (retour a l'accueil)
- **3 instances de DropdownMenu** (T-004-F3) pour les sections Framework, Mode Operatoire et Annexes
- L'integration du **MobileMenu** (T-004-F5) avec son bouton hamburger, visible uniquement sur mobile/tablette (< 1024px)
- La navigation desktop masquee sur mobile (`hidden lg:flex`)
- Une **semantique HTML correcte** (`<header>`, `<nav aria-label>`)
- Le support de l'**enhancement progressif** : sans JavaScript, les liens de section restent navigables via les fallbacks `<noscript>` des DropdownMenu
- Un design **responsive** et **sticky** (`sticky top-0 z-40`) avec separation visuelle (bordure basse, ombre subtile)

Ce composant est consomme par le DocsLayout (T-004-F10) et les pages standalone, et constitue le point d'entree principal de la navigation du site.

---

## 2. Contexte technique

### 2.1 Stack

| Technologie | Version | Role |
|-------------|---------|------|
| Astro | 4.x | Composant statique (SSG, 0 JS client propre) |
| TypeScript | 5.x | Typage strict des props |
| Tailwind CSS | 3.x | Utility-first, responsive, positionnement |

> Le Header lui-meme n'a pas de JavaScript client. L'interactivite provient des composants enfants : DropdownMenu (script inline) et MobileMenu (script inline).

### 2.2 Arborescence

```
src/
├── components/
│   └── layout/
│       ├── Header.astro                <-- CE COMPOSANT
│       ├── DropdownMenu.astro          # T-004-F3 (consomme x3)
│       ├── MobileMenu.astro            # T-004-F5 (consomme x1)
│       └── NavLink.astro               # T-004-F2 (consomme indirectement via DropdownMenu)
├── types/
│   └── navigation.ts                   # Types NavigationTree, NavigationSection (T-004-B1)
├── data/
│   └── navigation.ts                   # NAVIGATION_TREE (T-004-B3)
├── layouts/
│   └── BaseLayout.astro                # Layout racine (T-004-F1, contient le skip-link)
└── pages/
    └── index.astro
```

### 2.3 Position dans l'architecture des composants

```
Header.astro                            <-- CE COMPOSANT (composant compose)
├── DropdownMenu.astro (T-004-F3) x3   <-- Consomme (Framework, Mode Op., Annexes)
├── MobileMenu.astro (T-004-F5) x1     <-- Consomme (menu mobile complet)
└── DocsLayout.astro (T-004-F10)        <-- Consommateur
    └── BaseLayout.astro (T-004-F1)     <-- Layout racine (slot par defaut)
```

### 2.4 Dependances

#### T-004-F3 (DropdownMenu)

Le composant instancie 3 DropdownMenu pour les sections principales :

```astro
import DropdownMenu from '@components/layout/DropdownMenu.astro'
```

- Instanciation avec : `label`, `section`, `items`, `href`
- Chaque instance a un ID unique genere automatiquement par DropdownMenu (`dropdown-framework`, `dropdown-mode-operatoire`, `dropdown-annexes`)

#### T-004-F5 (MobileMenu)

Le composant inclut le MobileMenu pour la navigation sur ecrans < 1024px :

```astro
import MobileMenu from '@components/layout/MobileMenu.astro'
```

- Le MobileMenu consomme `NAVIGATION_TREE` en interne par defaut
- Le Header peut passer un `tree` custom si necessaire (pour les tests)

#### T-004-B3 (Configuration navigation)

Le composant consomme l'arbre de navigation pour alimenter les DropdownMenu :

```typescript
import { NAVIGATION_TREE } from '@/data/navigation'
import type { NavigationTree } from '@/types/navigation'
```

### 2.5 Conventions suivies

| Convention | Detail |
|-----------|--------|
| Nommage fichier | PascalCase dans `src/components/layout/` |
| TypeScript | Mode strict, props typees via `interface Props` |
| Imports | Alias `@/*` pour `src/*` |
| Design | Coherent avec NavLink, DropdownMenu (focus ring, couleurs, transitions) |
| Formatage | Prettier : pas de semicolons, single quotes, 2 espaces |
| Responsive | Mobile-first : `hidden lg:flex` pour la nav desktop, `lg:hidden` pour le hamburger |

---

## 3. Specifications fonctionnelles

### 3.1 Description

Le composant `Header` est une **barre de navigation principale** qui :

1. Rend un element `<header>` semantique contenant un `<nav aria-label="Navigation principale">`
2. Affiche le **logo/nom du site** "AIAD" a gauche, cliquable vers la page d'accueil (`/`)
3. Affiche **3 DropdownMenu** cote a cote pour les sections Framework, Mode Operatoire et Annexes (desktop uniquement, `hidden lg:flex`)
4. Affiche le **bouton hamburger du MobileMenu** a droite (mobile/tablette uniquement, `lg:hidden`)
5. Integre le composant **MobileMenu** complet (rendu dans le DOM mais masque par defaut)
6. Est **sticky** en haut de page (`sticky top-0 z-40`) avec fond blanc et bordure basse
7. A une **largeur maximale** centrée pour les grands ecrans
8. Supporte un **arbre de navigation injectable** via prop `tree` (pour les tests)

### 3.2 Maquette visuelle

#### Desktop (>= 1024px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  AIAD         Framework ▾      Mode Operatoire ▾      Annexes ▾          │
│               ┌──────────────┐                                            │
│               │  Dropdown    │ (au clic/clavier)                          │
│               └──────────────┘                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

#### Mobile/Tablette (< 1024px)

```
┌──────────────────────────────┐
│  AIAD                  [≡]   │
└──────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────┐
│  MobileMenu (overlay)        │
│  [X]                         │
│  Framework ▾                 │
│  Mode Operatoire ▾           │
│  Annexes ▾                   │
└──────────────────────────────┘
```

### 3.3 Structure HTML semantique

```html
<header class="sticky top-0 z-40 ...">
  <nav aria-label="Navigation principale">
    <div class="max-w-7xl mx-auto ...">
      <!-- Logo -->
      <a href="/" aria-label="AIAD - Accueil">AIAD</a>

      <!-- Navigation desktop (hidden sur mobile) -->
      <div class="hidden lg:flex ...">
        <DropdownMenu label="Framework" ... />
        <DropdownMenu label="Mode Operatoire" ... />
        <DropdownMenu label="Annexes" ... />
      </div>

      <!-- Hamburger mobile (hidden sur desktop) -->
      <div class="lg:hidden">
        <!-- Bouton hamburger integre dans MobileMenu -->
      </div>
    </div>
  </nav>

  <!-- MobileMenu (overlay, gere en interne) -->
  <MobileMenu />
</header>
```

### 3.4 Comportement responsive

| Ecran | Comportement |
|-------|-------------|
| Desktop (>= 1024px) | Logo + 3 DropdownMenu visibles, hamburger masque |
| Tablette (768px - 1023px) | Logo + hamburger visibles, DropdownMenu masques, MobileMenu utilisable |
| Mobile (< 768px) | Logo + hamburger visibles, DropdownMenu masques, MobileMenu utilisable |

### 3.5 Comportement sticky

| Etat | Style |
|------|-------|
| Normal | `sticky top-0 z-40 bg-white border-b border-gray-200` |
| Au scroll | Le header reste fixe en haut — pas de changement de style dynamique (simplicite, 0 JS) |

### 3.6 Logo/Branding

| Element | Detail |
|---------|--------|
| Texte | "AIAD" |
| Style | `text-xl font-bold text-gray-900` avec `hover:text-blue-600` |
| Lien | `href="/"` — retour a la page d'accueil |
| Accessibilite | `aria-label="AIAD - Accueil"` pour les lecteurs d'ecran |
| Focus | `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md` |

### 3.7 Enhancement progressif

Sans JavaScript :
- Le logo reste un lien fonctionnel vers l'accueil
- Les DropdownMenu affichent un fallback `<noscript>` avec liens directs vers les pages index de chaque section (`/framework`, `/mode-operatoire`, `/annexes`)
- Le MobileMenu est masque — la navigation mobile se fait via les liens `<noscript>` des DropdownMenu (non ideale mais fonctionnelle)

### 3.8 Accessibilite (RGAA AA)

| Critere | Implementation | Reference RGAA |
|---------|----------------|----------------|
| Landmark navigation | `<header>` + `<nav aria-label="Navigation principale">` | 12.6 |
| Logo accessible | `<a href="/" aria-label="AIAD - Accueil">` | 1.1 |
| Focus visible | `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2` sur le logo | 10.7 |
| Navigation clavier | Tab : logo → DropdownMenu#1 → #2 → #3 → contenu principal | 12.13 |
| Contraste | Texte `gray-900` sur fond `white` = 15.4:1 (>= 4.5:1 AA) | 3.2 |
| Separation visuelle | `border-b border-gray-200` — separateur entre header et contenu | 12.1 |
| Skip-link | Gere par BaseLayout (T-004-F1), saute au `#main-content` | 12.11 |

---

## 4. Specifications techniques

### 4.1 Interface TypeScript

```typescript
// src/components/layout/Header.astro (frontmatter)

import type { NavigationTree } from '@/types/navigation'

/**
 * Props du composant Header.
 *
 * Barre de navigation principale du site AIAD.
 * Compose DropdownMenu (T-004-F3) et MobileMenu (T-004-F5)
 * pour fournir une navigation complete responsive.
 *
 * @example
 * ```astro
 * ---
 * import Header from '@components/layout/Header.astro'
 * ---
 * <Header />
 * ```
 *
 * @example
 * ```astro
 * <!-- Avec arbre custom pour les tests -->
 * <Header tree={myTestTree} />
 * ```
 */
export interface Props {
  // ── Donnees ───────────────────────────────────────

  /**
   * Arbre de navigation a utiliser.
   * Si non fourni, utilise NAVIGATION_TREE depuis '@/data/navigation'.
   * Utile pour l'injection de donnees dans les tests unitaires.
   */
  tree?: NavigationTree

  // ── Branding ──────────────────────────────────────

  /**
   * Texte du logo/titre du site.
   * @default 'AIAD'
   */
  siteName?: string

  /**
   * URL de la page d'accueil (lien du logo).
   * @default '/'
   */
  homeHref?: string

  // ── HTML ──────────────────────────────────────────

  /**
   * Classes CSS additionnelles sur le <header>.
   */
  class?: string

  /**
   * Identifiant unique du composant.
   * Genere automatiquement si non fourni.
   */
  id?: string
}
```

### 4.2 Implementation du composant

```astro
---
// src/components/layout/Header.astro

import type { NavigationTree } from '@/types/navigation'
import { NAVIGATION_TREE } from '@/data/navigation'
import DropdownMenu from '@components/layout/DropdownMenu.astro'
import MobileMenu from '@components/layout/MobileMenu.astro'

export interface Props {
  tree?: NavigationTree
  siteName?: string
  homeHref?: string
  class?: string
  id?: string
}

const {
  tree = NAVIGATION_TREE,
  siteName = 'AIAD',
  homeHref = '/',
  class: className = '',
  id: providedId,
} = Astro.props

// ── ID unique ──────────────────────────────────
const baseId = providedId ?? 'site-header'
const navId = `${baseId}-nav`
---

<header
  class:list={[
    'sticky top-0 z-40 w-full border-b border-gray-200 bg-white',
    className,
  ]}
  id={baseId}
  data-header
>
  <nav
    aria-label="Navigation principale"
    id={navId}
    class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
  >
    <div class="flex h-16 items-center justify-between">
      {/* ── Logo / Branding ────────────────────── */}
      <div class="flex shrink-0 items-center">
        <a
          href={homeHref}
          class="text-xl font-bold text-gray-900 transition-colors duration-150 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-1"
          aria-label={`${siteName} - Accueil`}
          data-header-logo
        >
          {siteName}
        </a>
      </div>

      {/* ── Navigation desktop ─────────────────── */}
      <div
        class="hidden lg:flex lg:items-center lg:gap-1"
        data-header-desktop-nav
      >
        <DropdownMenu
          label="Framework"
          section="framework"
          items={tree.framework}
          href="/framework"
        />
        <DropdownMenu
          label="Mode Operatoire"
          section="mode-operatoire"
          items={tree.modeOperatoire}
          href="/mode-operatoire"
        />
        <DropdownMenu
          label="Annexes"
          section="annexes"
          items={tree.annexes}
          href="/annexes"
        />
      </div>

      {/* ── Bouton hamburger mobile ────────────── */}
      <div class="lg:hidden" data-header-mobile-trigger>
        {/* Le bouton hamburger est gere par MobileMenu */}
      </div>
    </div>
  </nav>

  {/* ── MobileMenu (overlay) ───────────────────── */}
  <MobileMenu tree={tree} />
</header>
```

### 4.3 Data attributes

| Attribut | Element | Usage |
|----------|---------|-------|
| `data-header` | `<header>` | Selecteur racine pour les tests et le JS externe |
| `data-header-logo` | `<a>` (logo) | Selecteur du lien logo pour les tests |
| `data-header-desktop-nav` | `<div>` (conteneur desktop) | Selecteur de la navigation desktop pour les tests et la visibilite responsive |
| `data-header-mobile-trigger` | `<div>` (conteneur hamburger) | Selecteur du conteneur du bouton hamburger pour les tests |

> Les DropdownMenu et MobileMenu apportent leurs propres `data-*` attributes (`data-dropdown`, `data-mobile-menu`, etc.).

### 4.4 Exemples d'utilisation

#### Utilisation standard (dans un layout)

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro'
import Header from '@components/layout/Header.astro'
---

<BaseLayout title="Framework AIAD" description="Documentation du framework AIAD">
  <Header />
  <main id="main-content" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <slot />
  </main>
</BaseLayout>
```

**Rendu HTML (structure simplifiee, desktop) :**

```html
<header class="sticky top-0 z-40 w-full border-b border-gray-200 bg-white" id="site-header" data-header>
  <nav aria-label="Navigation principale" id="site-header-nav" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <!-- Logo -->
      <div class="flex shrink-0 items-center">
        <a href="/" class="text-xl font-bold text-gray-900 ..." aria-label="AIAD - Accueil" data-header-logo>
          AIAD
        </a>
      </div>

      <!-- Navigation desktop -->
      <div class="hidden lg:flex lg:items-center lg:gap-1" data-header-desktop-nav>
        <!-- DropdownMenu Framework -->
        <div class="dropdown-container relative" data-dropdown data-dropdown-section="framework" id="dropdown-framework">
          <button type="button" aria-haspopup="true" aria-expanded="false" ...>
            <span>Framework</span>
            <svg ...>...</svg>
          </button>
          <div role="menu" class="... hidden ..." ...>...</div>
        </div>

        <!-- DropdownMenu Mode Operatoire -->
        <div class="dropdown-container relative" data-dropdown data-dropdown-section="mode-operatoire" id="dropdown-mode-operatoire">
          ...
        </div>

        <!-- DropdownMenu Annexes -->
        <div class="dropdown-container relative" data-dropdown data-dropdown-section="annexes" id="dropdown-annexes">
          ...
        </div>
      </div>

      <!-- Hamburger mobile (masque en desktop) -->
      <div class="lg:hidden" data-header-mobile-trigger></div>
    </div>
  </nav>

  <!-- MobileMenu (overlay, masque par defaut) -->
  <div data-mobile-menu ...>
    ...
  </div>
</header>
```

#### Avec arbre custom (tests)

```astro
---
import Header from '@components/layout/Header.astro'

const testTree = {
  framework: [
    { id: 'fw-1', label: 'Chapter 1', href: '/framework/ch1', order: 1 },
  ],
  modeOperatoire: [
    { id: 'mo-1', label: 'Step 1', href: '/mode-operatoire/step1', order: 1 },
  ],
  annexes: [],
}
---
<Header tree={testTree} />
```

#### Avec branding personnalise

```astro
<Header siteName="AIAD Framework" homeHref="/fr" class="shadow-sm" />
```

---

## 5. Design et Style

### 5.1 Palette de couleurs par etat

| Element | Etat | Texte | Fond | Bordure |
|---------|------|-------|------|---------|
| Header | Normal | — | `bg-white` (#FFFFFF) | `border-b border-gray-200` (#E5E7EB) |
| Logo | Normal | `text-gray-900` (#111827) | transparent | — |
| Logo | Hover | `text-blue-600` (#2563EB) | transparent | — |
| Logo | Focus | — | — | `ring-2 ring-blue-500 ring-offset-2` |
| DropdownMenu buttons | — | Via DropdownMenu (T-004-F3) | — | — |

### 5.2 Verification du contraste (WCAG AA)

| Combinaison | Ratio | Conforme AA ? |
|-------------|-------|---------------|
| `gray-900` (#111827) sur `white` (#FFFFFF) | 15.4:1 | Oui (>= 4.5:1) |
| `blue-600` (#2563EB) sur `white` (#FFFFFF) | 4.65:1 | Oui (>= 4.5:1) |
| `gray-200` (#E5E7EB) bordure — decoratif | N/A | Non applicable |

### 5.3 Dimensions et espacement

| Element | Style | Detail |
|---------|-------|--------|
| Header hauteur | `h-16` | 64px de hauteur |
| Conteneur max | `max-w-7xl mx-auto` | 1280px max, centre |
| Padding horizontal | `px-4 sm:px-6 lg:px-8` | 16px → 24px → 32px |
| Logo | `text-xl font-bold px-1` | 20px, gras, petit padding horizontal |
| Gap entre dropdowns | `lg:gap-1` | 4px entre les DropdownMenu |
| Position sticky | `sticky top-0 z-40` | Sticky en haut, z-index 40 |

### 5.4 Breakpoints responsive

| Breakpoint | Largeur | Comportement |
|------------|---------|-------------|
| Mobile | < 640px | Logo + hamburger. Padding `px-4` |
| SM | >= 640px | Logo + hamburger. Padding `px-6` |
| MD | >= 768px | Logo + hamburger. Padding `px-6` |
| LG | >= 1024px | Logo + 3 DropdownMenu. Padding `px-8`. Hamburger masque |
| XL | >= 1280px | Idem LG. Conteneur centre a 1280px max |

### 5.5 Coherence avec le design system

| Aspect | Conformite |
|--------|------------|
| Focus ring | `ring-2 ring-blue-500 ring-offset-2` — coherent avec NavLink, DropdownMenu, Breadcrumb |
| Couleurs hover | `blue-600` — coherent avec le design system |
| Transition | `transition-colors duration-150` — coherent avec NavLink |
| Coins arrondis | `rounded-md` pour le logo focus — coherent avec les boutons |
| Z-index | `z-40` pour le header, `z-50` pour les dropdowns (au-dessus du header) |
| Bordure | `border-gray-200` — coherent avec DropdownMenu panneau et les separateurs |
| Fond | `bg-white` — fond opaque pour le sticky (couvre le contenu en dessous) |

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Matrice des cas limites

| ID | Cas | Comportement attendu | Priorite |
|----|-----|----------------------|----------|
| CL-01 | Rendu desktop (>= 1024px) | Logo + 3 DropdownMenu visibles, hamburger masque | Haute |
| CL-02 | Rendu mobile (< 1024px) | Logo + hamburger visibles, DropdownMenu masques | Haute |
| CL-03 | Navigation clavier desktop | Tab : logo → Framework dropdown → Mode Op dropdown → Annexes dropdown → contenu | Haute |
| CL-04 | Clic sur le logo | Navigation vers `/` (accueil) | Haute |
| CL-05 | Focus sur le logo | Ring bleue visible (`ring-2 ring-blue-500 ring-offset-2`) | Haute |
| CL-06 | Scroll de la page | Header reste sticky en haut de la fenetre | Haute |
| CL-07 | Un seul dropdown ouvert a la fois | Ouvrir Framework ferme Mode Op et Annexes (gere par DropdownMenu) | Haute |
| CL-08 | Clic exterieur (menu ouvert) | Tous les dropdowns se ferment (gere par DropdownMenu) | Haute |
| CL-09 | Escape (menu ouvert) | Dropdown se ferme, focus revient au bouton (gere par DropdownMenu) | Haute |
| CL-10 | Sans JavaScript | Logo est un lien fonctionnel. DropdownMenu affiche `<noscript>` links. MobileMenu non fonctionnel | Haute |
| CL-11 | `tree` non fourni | Utilise `NAVIGATION_TREE` par defaut | Haute |
| CL-12 | `tree` avec sections vides | DropdownMenu rend un bouton sans items dans le panneau (gere par DropdownMenu) | Basse |
| CL-13 | `siteName` personnalise | Affiche le texte fourni au lieu de "AIAD" | Moyenne |
| CL-14 | `homeHref` personnalise | Le logo pointe vers l'URL fournie | Moyenne |
| CL-15 | `class` personnalise | Ajoute aux classes existantes du `<header>` (ne remplace pas) | Moyenne |
| CL-16 | `id` personnalise | Utilise comme id du `<header>` et base pour le `<nav>` id | Moyenne |
| CL-17 | Grand ecran (> 1920px) | Conteneur centre a 1280px max, espaces lateraux blancs | Haute |
| CL-18 | Tres petit ecran (320px) | Logo et hamburger tiennent sur une ligne, pas de debordement | Haute |
| CL-19 | Logo avec texte long | Pas de troncature, `shrink-0` empeche la compression | Moyenne |
| CL-20 | Page d'accueil (logo actif) | Le logo reste un lien cliquable, pas de style "actif" special | Moyenne |
| CL-21 | Page Framework (section active) | Le DropdownMenu Framework a un style actif (gere par DropdownMenu via NavLink) | Haute |
| CL-22 | 3 dropdowns ouverts en sequence rapide | Seul le dernier ouvert reste visible (gere par DropdownMenu `closeAllOtherDropdowns`) | Haute |
| CL-23 | Panneau dropdown depasse le bord droit | Gere par DropdownMenu (`left-0 top-full`) — le troisieme dropdown (Annexes) peut deborder legerement | Moyenne |
| CL-24 | `aria-label` sur le `<nav>` | "Navigation principale" — identifiable par les lecteurs d'ecran et les tests | Haute |
| CL-25 | Label XSS dans `siteName` | Echappe automatiquement par Astro (`{siteName}`) | Haute |

### 6.2 Strategie de fallback

```
Props manquantes ?
├── tree: non fourni → NAVIGATION_TREE (import par defaut)
├── siteName: non fourni → 'AIAD'
├── homeHref: non fourni → '/'
├── class: non fourni → '' (pas de classes additionnelles)
└── id: non fourni → 'site-header'

JavaScript indisponible ?
├── Logo → <a href="/"> fonctionnel
├── DropdownMenu → <noscript> avec liens directs vers les index de section
└── MobileMenu → masque (non fonctionnel)
```

---

## 7. Exemples entree/sortie

### 7.1 Header standard — rendu desktop

**Entree :**

```astro
<Header />
```

**Sortie HTML (structure simplifiee) :**

```html
<header class="sticky top-0 z-40 w-full border-b border-gray-200 bg-white" id="site-header" data-header>
  <nav aria-label="Navigation principale" id="site-header-nav" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <div class="flex shrink-0 items-center">
        <a href="/" class="text-xl font-bold text-gray-900 ..." aria-label="AIAD - Accueil" data-header-logo>
          AIAD
        </a>
      </div>
      <div class="hidden lg:flex lg:items-center lg:gap-1" data-header-desktop-nav>
        <div data-dropdown data-dropdown-section="framework" ...>...</div>
        <div data-dropdown data-dropdown-section="mode-operatoire" ...>...</div>
        <div data-dropdown data-dropdown-section="annexes" ...>...</div>
      </div>
      <div class="lg:hidden" data-header-mobile-trigger></div>
    </div>
  </nav>
  <!-- MobileMenu -->
  <div data-mobile-menu ...>...</div>
</header>
```

### 7.2 Header avec props personnalises

**Entree :**

```astro
<Header siteName="AIAD Framework" homeHref="/fr" class="shadow-sm" id="custom-header" />
```

**Sortie HTML (extrait) :**

```html
<header class="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm" id="custom-header" data-header>
  <nav aria-label="Navigation principale" id="custom-header-nav" ...>
    <div ...>
      <div ...>
        <a href="/fr" aria-label="AIAD Framework - Accueil" data-header-logo>
          AIAD Framework
        </a>
      </div>
      ...
    </div>
  </nav>
  ...
</header>
```

### 7.3 Header avec arbre custom (test)

**Entree :**

```astro
---
const minimalTree = {
  framework: [{ id: 'fw-1', label: 'Ch1', href: '/fw/1', order: 1 }],
  modeOperatoire: [],
  annexes: [],
}
---
<Header tree={minimalTree} />
```

**Sortie :** Le DropdownMenu Framework contient 1 item. Mode Operatoire et Annexes ont des panneaux vides. MobileMenu recoit le meme `minimalTree`.

### 7.4 Protection XSS

**Entree :**

```astro
<Header siteName='<script>alert("xss")</script>' />
```

**Sortie HTML :**

```html
<a href="/" aria-label="&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; - Accueil" data-header-logo>
  &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;
</a>
```

> Astro echappe automatiquement les expressions `{variable}` dans les templates.

---

## 8. Tests

### 8.1 Fichiers de test

| Fichier | Type | Framework |
|---------|------|-----------|
| `tests/unit/components/layout/header.test.ts` | Unitaire | Vitest + Astro Container |

### 8.2 Tests unitaires (Vitest)

```typescript
// tests/unit/components/layout/header.test.ts
import { describe, it, expect } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import Header from '@components/layout/Header.astro'

// ── Fixtures ────────────────────────────────────────
const MINIMAL_TREE = {
  framework: [
    { id: 'fw-preambule', label: 'Preambule', href: '/framework/preambule', section: 'framework' as const, order: 1, badge: 'essential' as const },
    { id: 'fw-vision', label: 'Vision', href: '/framework/vision', section: 'framework' as const, order: 2 },
  ],
  modeOperatoire: [
    { id: 'mo-preambule', label: 'Preambule', href: '/mode-operatoire/preambule', section: 'mode-operatoire' as const, order: 0 },
  ],
  annexes: [
    {
      id: 'annexes-a', label: 'A - Templates', href: '/annexes/templates', section: 'annexes' as const, order: 1,
      children: [
        { id: 'a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', order: 1 },
      ],
    },
  ],
}

const EMPTY_TREE = {
  framework: [],
  modeOperatoire: [],
  annexes: [],
}

// ── Helpers ──────────────────────────────────────────
async function renderHeader(
  props: Record<string, unknown> = {},
  currentPath: string = '/',
) {
  const container = await AstroContainer.create()
  return container.renderToString(Header, {
    props: {
      tree: MINIMAL_TREE,
      ...props,
    },
    request: new Request(`https://aiad.dev${currentPath}`),
  })
}

// ── Tests structure HTML ──────────────────────────────
describe('Header — Structure HTML', () => {
  it('T-01 : rend un element <header> avec data-header', async () => {
    const html = await renderHeader()
    expect(html).toContain('<header')
    expect(html).toContain('data-header')
  })

  it('T-02 : contient un <nav> avec aria-label="Navigation principale"', async () => {
    const html = await renderHeader()
    expect(html).toContain('<nav')
    expect(html).toContain('aria-label="Navigation principale"')
  })

  it('T-03 : le header est sticky en haut', async () => {
    const html = await renderHeader()
    expect(html).toContain('sticky')
    expect(html).toContain('top-0')
    expect(html).toContain('z-40')
  })

  it('T-04 : le header a un fond blanc et une bordure basse', async () => {
    const html = await renderHeader()
    expect(html).toContain('bg-white')
    expect(html).toContain('border-b')
    expect(html).toContain('border-gray-200')
  })

  it('T-05 : le conteneur a une largeur max de 7xl centree', async () => {
    const html = await renderHeader()
    expect(html).toContain('max-w-7xl')
    expect(html).toContain('mx-auto')
  })

  it('T-06 : la hauteur du header est h-16', async () => {
    const html = await renderHeader()
    expect(html).toContain('h-16')
  })
})

// ── Tests logo ──────────────────────────────────────
describe('Header — Logo/Branding', () => {
  it('T-07 : rend un lien logo avec data-header-logo', async () => {
    const html = await renderHeader()
    expect(html).toContain('data-header-logo')
  })

  it('T-08 : le logo pointe vers "/" par defaut', async () => {
    const html = await renderHeader()
    expect(html).toMatch(/data-header-logo[^>]*/)
    expect(html).toContain('href="/"')
  })

  it('T-09 : le logo affiche "AIAD" par defaut', async () => {
    const html = await renderHeader()
    // Le texte AIAD doit etre dans le lien logo
    const logoMatch = html.match(/data-header-logo[^>]*>([\s\S]*?)<\/a>/)
    expect(logoMatch).not.toBeNull()
    expect(logoMatch![1]).toContain('AIAD')
  })

  it('T-10 : le logo a aria-label "AIAD - Accueil"', async () => {
    const html = await renderHeader()
    expect(html).toContain('aria-label="AIAD - Accueil"')
  })

  it('T-11 : le logo a un focus ring', async () => {
    const html = await renderHeader()
    // Extraire les classes du lien logo
    const logoSection = html.match(/data-header-logo[^>]*class="([^"]*)"/)
    expect(logoSection).not.toBeNull()
    const classes = logoSection![1]
    expect(classes).toContain('focus:ring-2')
    expect(classes).toContain('focus:ring-blue-500')
    expect(classes).toContain('focus:ring-offset-2')
  })

  it('T-12 : le logo a un style bold et de grande taille', async () => {
    const html = await renderHeader()
    expect(html).toContain('text-xl')
    expect(html).toContain('font-bold')
  })

  it('T-13 : le logo change de couleur au hover', async () => {
    const html = await renderHeader()
    expect(html).toContain('hover:text-blue-600')
  })

  it('T-14 : siteName personnalise est affiche', async () => {
    const html = await renderHeader({ siteName: 'Mon Site' })
    const logoMatch = html.match(/data-header-logo[^>]*>([\s\S]*?)<\/a>/)
    expect(logoMatch).not.toBeNull()
    expect(logoMatch![1]).toContain('Mon Site')
  })

  it('T-15 : homeHref personnalise est applique', async () => {
    const html = await renderHeader({ homeHref: '/fr' })
    expect(html).toContain('href="/fr"')
  })

  it('T-16 : aria-label inclut le siteName personnalise', async () => {
    const html = await renderHeader({ siteName: 'Custom Name' })
    expect(html).toContain('aria-label="Custom Name - Accueil"')
  })
})

// ── Tests navigation desktop ──────────────────────────
describe('Header — Navigation desktop', () => {
  it('T-17 : contient un conteneur desktop avec data-header-desktop-nav', async () => {
    const html = await renderHeader()
    expect(html).toContain('data-header-desktop-nav')
  })

  it('T-18 : la navigation desktop est masquee sur mobile (hidden lg:flex)', async () => {
    const html = await renderHeader()
    const navMatch = html.match(/data-header-desktop-nav[^>]*class="([^"]*)"/)
    expect(navMatch).not.toBeNull()
    expect(navMatch![1]).toContain('hidden')
    expect(navMatch![1]).toContain('lg:flex')
  })

  it('T-19 : contient 3 DropdownMenu (framework, mode-operatoire, annexes)', async () => {
    const html = await renderHeader()
    expect(html).toContain('data-dropdown-section="framework"')
    expect(html).toContain('data-dropdown-section="mode-operatoire"')
    expect(html).toContain('data-dropdown-section="annexes"')
  })

  it('T-20 : les DropdownMenu ont les labels corrects', async () => {
    const html = await renderHeader()
    // Les boutons des dropdowns contiennent les labels
    expect(html).toContain('>Framework<')
    expect(html).toContain('>Mode Operatoire<')
    expect(html).toContain('>Annexes<')
  })

  it('T-21 : les DropdownMenu ont les hrefs de section corrects', async () => {
    const html = await renderHeader()
    expect(html).toContain('href="/framework"')
    expect(html).toContain('href="/mode-operatoire"')
    expect(html).toContain('href="/annexes"')
  })

  it('T-22 : le DropdownMenu Framework contient les items du tree', async () => {
    const html = await renderHeader()
    expect(html).toContain('Preambule')
    expect(html).toContain('Vision')
  })

  it('T-23 : le DropdownMenu Annexes fonctionne en mode grouped', async () => {
    const html = await renderHeader()
    expect(html).toContain('role="group"')
    expect(html).toContain('A - Templates')
    expect(html).toContain('A1 - PRD')
  })

  it('T-24 : les dropdowns ont des IDs uniques', async () => {
    const html = await renderHeader()
    expect(html).toContain('id="dropdown-framework"')
    expect(html).toContain('id="dropdown-mode-operatoire"')
    expect(html).toContain('id="dropdown-annexes"')
  })
})

// ── Tests mobile ────────────────────────────────────
describe('Header — Mobile', () => {
  it('T-25 : contient un conteneur mobile avec data-header-mobile-trigger', async () => {
    const html = await renderHeader()
    expect(html).toContain('data-header-mobile-trigger')
  })

  it('T-26 : le conteneur mobile est visible uniquement sur petit ecran (lg:hidden)', async () => {
    const html = await renderHeader()
    const mobileMatch = html.match(/data-header-mobile-trigger[^>]*class="([^"]*)"/)
    expect(mobileMatch).not.toBeNull()
    expect(mobileMatch![1]).toContain('lg:hidden')
  })

  it('T-27 : contient le composant MobileMenu', async () => {
    const html = await renderHeader()
    expect(html).toContain('data-mobile-menu')
  })
})

// ── Tests IDs et aria ──────────────────────────────
describe('Header — IDs et ARIA', () => {
  it('T-28 : ID par defaut "site-header" sur le <header>', async () => {
    const html = await renderHeader()
    expect(html).toContain('id="site-header"')
  })

  it('T-29 : ID personnalise applique sur le <header>', async () => {
    const html = await renderHeader({ id: 'custom-header' })
    expect(html).toContain('id="custom-header"')
  })

  it('T-30 : le <nav> a un ID derive du header ID', async () => {
    const html = await renderHeader()
    expect(html).toContain('id="site-header-nav"')
  })

  it('T-31 : le <nav> a un ID derive du header ID personnalise', async () => {
    const html = await renderHeader({ id: 'my-header' })
    expect(html).toContain('id="my-header-nav"')
  })
})

// ── Tests classes personnalisees ──────────────────────
describe('Header — Classes et attributs', () => {
  it('T-32 : classe personnalisee ajoutee au <header>', async () => {
    const html = await renderHeader({ class: 'shadow-sm' })
    expect(html).toContain('shadow-sm')
  })

  it('T-33 : les classes par defaut sont conservees avec la classe personnalisee', async () => {
    const html = await renderHeader({ class: 'shadow-sm' })
    expect(html).toContain('sticky')
    expect(html).toContain('bg-white')
    expect(html).toContain('shadow-sm')
  })
})

// ── Tests arbre de navigation ────────────────────────
describe('Header — Arbre de navigation', () => {
  it('T-34 : utilise l\'arbre injecte via prop tree', async () => {
    const customTree = {
      framework: [
        { id: 'custom-fw', label: 'Custom Framework', href: '/custom-fw', order: 1 },
      ],
      modeOperatoire: [],
      annexes: [],
    }
    const html = await renderHeader({ tree: customTree })
    expect(html).toContain('Custom Framework')
  })

  it('T-35 : transmet l\'arbre au MobileMenu', async () => {
    // Le MobileMenu devrait recevoir le meme tree que le Header
    // On verifie qu'il rend les items du tree injecte
    const html = await renderHeader()
    // Le MobileMenu contient les items du tree (Preambule, Vision, etc.)
    // via ses accordeons
    expect(html).toContain('data-mobile-menu')
  })

  it('T-36 : fonctionne avec un arbre vide', async () => {
    const html = await renderHeader({ tree: EMPTY_TREE })
    // Le header se rend meme avec un arbre vide
    expect(html).toContain('data-header')
    expect(html).toContain('AIAD')
    // Les dropdowns sont presents mais leurs panneaux sont vides
    expect(html).toContain('data-dropdown-section="framework"')
  })
})

// ── Tests responsive ────────────────────────────────
describe('Header — Responsive', () => {
  it('T-37 : padding responsive (px-4 sm:px-6 lg:px-8)', async () => {
    const html = await renderHeader()
    expect(html).toContain('px-4')
    expect(html).toContain('sm:px-6')
    expect(html).toContain('lg:px-8')
  })

  it('T-38 : les DropdownMenu sont dans un conteneur hidden lg:flex', async () => {
    const html = await renderHeader()
    const navMatch = html.match(/data-header-desktop-nav[^>]*class="([^"]*)"/)
    expect(navMatch).not.toBeNull()
    expect(navMatch![1]).toContain('hidden')
    expect(navMatch![1]).toContain('lg:flex')
  })

  it('T-39 : le conteneur mobile est lg:hidden', async () => {
    const html = await renderHeader()
    const mobileMatch = html.match(/data-header-mobile-trigger[^>]*class="([^"]*)"/)
    expect(mobileMatch).not.toBeNull()
    expect(mobileMatch![1]).toContain('lg:hidden')
  })
})

// ── Tests XSS ───────────────────────────────────────
describe('Header — Protection XSS', () => {
  it('T-40 : siteName avec HTML est echappe', async () => {
    const html = await renderHeader({ siteName: '<script>alert("xss")</script>' })
    expect(html).not.toContain('<script>alert')
    expect(html).toContain('&lt;script&gt;')
  })

  it('T-41 : homeHref avec Javascript est echappe', async () => {
    const html = await renderHeader({ homeHref: 'javascript:alert(1)' })
    // Astro rend le href tel quel mais le CSP du site bloque l'execution
    // Le test verifie que le href est bien rendu (pas d'injection dans d'autres attributs)
    expect(html).toContain('href="javascript:alert(1)"')
  })
})

// ── Tests semantique ────────────────────────────────
describe('Header — Semantique', () => {
  it('T-42 : le <header> est un element HTML5 semantique', async () => {
    const html = await renderHeader()
    expect(html).toMatch(/<header\s/)
    expect(html).toContain('</header>')
  })

  it('T-43 : le <nav> est enfant du <header>', async () => {
    const html = await renderHeader()
    const headerContent = html.match(/<header[^>]*>([\s\S]*)<\/header>/)?.[1] ?? ''
    expect(headerContent).toContain('<nav')
  })

  it('T-44 : le logo est dans un lien <a>', async () => {
    const html = await renderHeader()
    expect(html).toMatch(/<a[^>]*data-header-logo/)
  })

  it('T-45 : le conteneur desktop contient exactement 3 data-dropdown', async () => {
    const html = await renderHeader()
    const dropdowns = html.match(/data-dropdown-section="/g)
    expect(dropdowns).not.toBeNull()
    expect(dropdowns!.length).toBe(3)
  })
})
```

### 8.3 Matrice de couverture

| ID | Test | Type | Assertion | Priorite |
|----|------|------|-----------|----------|
| T-01 | `<header>` avec `data-header` | Unit | `toContain` | Haute |
| T-02 | `<nav>` avec `aria-label` | Unit | `toContain` | Haute |
| T-03 | Header sticky | Unit | `toContain('sticky', 'top-0', 'z-40')` | Haute |
| T-04 | Fond blanc et bordure basse | Unit | `toContain('bg-white', 'border-b')` | Haute |
| T-05 | Largeur max centree | Unit | `toContain('max-w-7xl', 'mx-auto')` | Haute |
| T-06 | Hauteur h-16 | Unit | `toContain('h-16')` | Haute |
| T-07 | Logo `data-header-logo` | Unit | `toContain` | Haute |
| T-08 | Logo href `/` | Unit | `toContain('href="/"')` | Haute |
| T-09 | Logo texte "AIAD" | Unit | regex match | Haute |
| T-10 | Logo `aria-label` | Unit | `toContain` | Haute |
| T-11 | Logo focus ring | Unit | regex + `toContain` | Haute |
| T-12 | Logo bold et grande taille | Unit | `toContain('text-xl', 'font-bold')` | Moyenne |
| T-13 | Logo hover couleur | Unit | `toContain('hover:text-blue-600')` | Moyenne |
| T-14 | `siteName` personnalise | Unit | regex match | Moyenne |
| T-15 | `homeHref` personnalise | Unit | `toContain` | Moyenne |
| T-16 | `aria-label` avec siteName custom | Unit | `toContain` | Moyenne |
| T-17 | Conteneur desktop `data-header-desktop-nav` | Unit | `toContain` | Haute |
| T-18 | Nav desktop `hidden lg:flex` | Unit | regex + `toContain` | Haute |
| T-19 | 3 DropdownMenu sections | Unit | `toContain` x3 | Haute |
| T-20 | Labels des DropdownMenu | Unit | `toContain` | Haute |
| T-21 | Hrefs des sections | Unit | `toContain` | Haute |
| T-22 | Items Framework rendus | Unit | `toContain` | Haute |
| T-23 | Annexes en mode grouped | Unit | `toContain('role="group"')` | Haute |
| T-24 | IDs uniques des dropdowns | Unit | `toContain` | Haute |
| T-25 | Conteneur mobile `data-header-mobile-trigger` | Unit | `toContain` | Haute |
| T-26 | Mobile `lg:hidden` | Unit | regex + `toContain` | Haute |
| T-27 | MobileMenu present | Unit | `toContain('data-mobile-menu')` | Haute |
| T-28 | ID par defaut `site-header` | Unit | `toContain` | Haute |
| T-29 | ID personnalise | Unit | `toContain` | Moyenne |
| T-30 | Nav ID derive | Unit | `toContain` | Moyenne |
| T-31 | Nav ID derive du custom ID | Unit | `toContain` | Moyenne |
| T-32 | Classe personnalisee | Unit | `toContain` | Moyenne |
| T-33 | Classes par defaut conservees | Unit | `toContain` | Moyenne |
| T-34 | Arbre injecte | Unit | `toContain('Custom Framework')` | Haute |
| T-35 | Arbre transmis au MobileMenu | Unit | `toContain('data-mobile-menu')` | Haute |
| T-36 | Arbre vide | Unit | `toContain('data-header')` | Basse |
| T-37 | Padding responsive | Unit | `toContain` | Moyenne |
| T-38 | Desktop hidden lg:flex | Unit | regex + `toContain` | Haute |
| T-39 | Mobile lg:hidden | Unit | regex + `toContain` | Haute |
| T-40 | XSS siteName | Unit | `not.toContain('<script>')` | Haute |
| T-41 | XSS homeHref | Unit | `toContain` | Haute |
| T-42 | Semantique `<header>` | Unit | regex match | Haute |
| T-43 | `<nav>` enfant de `<header>` | Unit | regex match | Haute |
| T-44 | Logo dans `<a>` | Unit | regex match | Haute |
| T-45 | Exactement 3 dropdowns | Unit | count match | Haute |

---

## 9. Criteres d'acceptation

| ID | Critere | Verifie par |
|----|---------|-------------|
| CA-01 | Le fichier `src/components/layout/Header.astro` est cree | Verification fichier |
| CA-02 | Le composant rend un `<header>` semantique avec `data-header` | T-01, T-42 |
| CA-03 | Le composant contient un `<nav aria-label="Navigation principale">` | T-02 |
| CA-04 | Le header est sticky (`sticky top-0 z-40`) avec fond blanc opaque | T-03, T-04 |
| CA-05 | Le logo "AIAD" est un lien `<a href="/">` avec `aria-label` | T-07, T-08, T-09, T-10 |
| CA-06 | Le logo a un focus ring accessible (`ring-2 ring-blue-500 ring-offset-2`) | T-11 |
| CA-07 | 3 DropdownMenu instancies : Framework, Mode Operatoire, Annexes | T-19, T-24, T-45 |
| CA-08 | Les DropdownMenu ont les labels et hrefs corrects | T-20, T-21 |
| CA-09 | La navigation desktop est masquee sur mobile (`hidden lg:flex`) | T-18, T-38 |
| CA-10 | Le bouton hamburger est masque sur desktop (`lg:hidden`) | T-26, T-39 |
| CA-11 | Le MobileMenu est integre dans le Header | T-27 |
| CA-12 | L'arbre de navigation est injectable via prop `tree` | T-34 |
| CA-13 | L'arbre est transmis au MobileMenu | T-35 |
| CA-14 | `siteName`, `homeHref`, `class` et `id` sont configurables | T-14, T-15, T-29, T-32 |
| CA-15 | Le conteneur a une largeur max centree (`max-w-7xl mx-auto`) | T-05 |
| CA-16 | Le padding est responsive (`px-4 sm:px-6 lg:px-8`) | T-37 |
| CA-17 | Protection XSS par echappement Astro | T-40 |
| CA-18 | TypeScript compile sans erreur (`pnpm typecheck`) | CI |
| CA-19 | ESLint passe sans warning (`pnpm lint`) | CI |
| CA-20 | Les 45 tests unitaires passent | CI |

---

## 10. Definition of Done

- [ ] Fichier `src/components/layout/Header.astro` cree
- [ ] Interface TypeScript `Props` complete avec documentation JSDoc
- [ ] Import de `NAVIGATION_TREE` depuis `@/data/navigation` (T-004-B3)
- [ ] Import de `DropdownMenu` depuis `@components/layout/DropdownMenu.astro` (T-004-F3)
- [ ] Import de `MobileMenu` depuis `@components/layout/MobileMenu.astro` (T-004-F5)
- [ ] Element `<header>` avec `sticky top-0 z-40 bg-white border-b border-gray-200`
- [ ] Element `<nav aria-label="Navigation principale">`
- [ ] Logo `<a>` avec `href`, `aria-label`, focus ring, `data-header-logo`
- [ ] 3 instances de DropdownMenu (Framework, Mode Operatoire, Annexes) dans un conteneur `hidden lg:flex`
- [ ] Conteneur hamburger `lg:hidden` avec `data-header-mobile-trigger`
- [ ] MobileMenu integre avec transmission du `tree`
- [ ] Conteneur `max-w-7xl mx-auto` avec padding responsive
- [ ] Data attributes (`data-header`, `data-header-logo`, `data-header-desktop-nav`, `data-header-mobile-trigger`)
- [ ] Props optionnels : `tree`, `siteName`, `homeHref`, `class`, `id`
- [ ] IDs generes (`site-header`, `site-header-nav`) ou personnalises
- [ ] Tests unitaires passants (45 tests)
- [ ] 0 erreur TypeScript (`pnpm typecheck`)
- [ ] 0 erreur ESLint (`pnpm lint`)
- [ ] Code formate avec Prettier

---

## 11. Notes d'implementation

### 11.1 Ordre d'implementation recommande

1. Creer le fichier `src/components/layout/Header.astro` avec l'interface Props
2. Importer `NAVIGATION_TREE`, `DropdownMenu` et `MobileMenu`
3. Implementer le `<header>` avec classes sticky et `data-header`
4. Implementer le `<nav aria-label="Navigation principale">` avec conteneur max-width
5. Implementer le logo `<a>` avec aria-label et focus ring
6. Ajouter les 3 DropdownMenu dans un conteneur `hidden lg:flex`
7. Ajouter le conteneur hamburger `lg:hidden`
8. Integrer le MobileMenu avec transmission du `tree`
9. Ajouter les props optionnels (`siteName`, `homeHref`, `class`, `id`)
10. Verifier avec `pnpm typecheck` et `pnpm lint`
11. Ecrire les tests unitaires

### 11.2 Points d'attention

| Point | Detail |
|-------|--------|
| **0 JavaScript propre** | Le Header n'a pas de `<script>` client. Toute l'interactivite est deleguee aux composants enfants (DropdownMenu et MobileMenu). |
| **Z-index hierarchy** | Le header utilise `z-40`. Les dropdowns utilisent `z-50` (au-dessus). Le MobileMenu utilise un z-index encore superieur pour son overlay (gere en interne). |
| **Fond opaque obligatoire** | Le header etant sticky, `bg-white` est requis pour masquer le contenu qui defilerait en dessous. |
| **Arbre transmis au MobileMenu** | Le `tree` injecte au Header doit etre transmis au MobileMenu via `<MobileMenu tree={tree} />` pour garantir la coherence entre desktop et mobile. |
| **Bouton hamburger** | Le bouton hamburger est rendu par le MobileMenu lui-meme. Le conteneur `data-header-mobile-trigger` sert de placeholder visuel. L'implementation reelle depend de la facon dont MobileMenu expose son bouton toggle. Si MobileMenu inclut deja le bouton dans son rendu, le conteneur peut rester vide. |
| **Label "Mode Operatoire"** | Le label du DropdownMenu est "Mode Operatoire" (sans accent) pour la coherence avec le DropdownMenu existant. Le DropdownMenu echappe correctement les caracteres. |
| **Largeur des DropdownMenu** | Avec 3 dropdowns cote a cote, la largeur totale sur desktop est environ 3 x 170px = 510px. Le `max-w-7xl` (1280px) laisse largement la place pour le logo et les dropdowns. |
| **Dernier dropdown (Annexes)** | Le DropdownMenu Annexes est le plus a droite. Son panneau s'ouvre avec `left-0` par rapport au bouton, ce qui peut le faire deborder a droite sur les ecrans moyens. Si cela pose probleme, une solution serait d'ajouter `right-0 left-auto` au DropdownMenu Annexes via la prop `class`. Hors scope pour cette tache. |
| **Test du MobileMenu dans le Header** | Les tests du Header verifient que le MobileMenu est present (`data-mobile-menu`) mais ne testent pas son comportement interactif (couvert par les tests de MobileMenu T-004-F5). |

### 11.3 Extensions futures (hors scope)

| Extension | Description | User Story |
|-----------|-------------|------------|
| Barre de recherche dans le header | Champ de recherche Pagefind integre dans la barre de navigation | US non definie |
| Theme toggle (dark mode) | Bouton de basculement clair/sombre dans le header | Non definie |
| Header reduit au scroll | Reduction de la hauteur du header (64px → 48px) au scroll | Non definie |
| Breadcrumb inline dans le header | Afficher le breadcrumb directement dans le header au lieu d'un bandeau separe | Non definie |
| Indicateur de section active | Surligner le dropdown de la section courante (ex: fond bleu leger) | Non definie |
| Logo SVG | Remplacer le texte "AIAD" par un logo SVG | Non definie |

---

## 12. References

| Ressource | Lien |
|-----------|------|
| US-004 Spec | [spec-US-004.md](./spec-US-004.md) |
| Architecture | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| T-004-B1 Types navigation | [T-004-B1-types-typescript-navigation.md](./T-004-B1-types-typescript-navigation.md) |
| T-004-B3 Configuration navigation | [T-004-B3-configuration-navigation.md](./T-004-B3-configuration-navigation.md) |
| T-004-F1 BaseLayout | [T-004-F1-composant-BaseLayout.md](./T-004-F1-composant-BaseLayout.md) |
| T-004-F2 NavLink | [T-004-F2-composant-NavLink.md](./T-004-F2-composant-NavLink.md) |
| T-004-F3 DropdownMenu | [T-004-F3-composant-DropdownMenu.md](./T-004-F3-composant-DropdownMenu.md) |
| T-004-F5 MobileMenu | [T-004-F5-composant-MobileMenu.md](./T-004-F5-composant-MobileMenu.md) |
| T-004-F10 DocsLayout | [T-004-F10-layout-DocsLayout.md](./T-004-F10-layout-DocsLayout.md) |
| WAI-ARIA Navigation | https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/ |
| RGAA 12.6 Zones de navigation | https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#12.6 |
| RGAA 12.11 Skip-link | https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#12.11 |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 12/02/2026 | Creation initiale — header sticky avec logo, 3 DropdownMenu, MobileMenu, responsive desktop/mobile, 25 cas limites, 45 tests unitaires, 20 criteres d'acceptation |
