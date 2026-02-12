# T-004-F5 : Composant MobileMenu (hamburger + overlay plein ecran + navigation accordeon)

| Metadonnee | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 12 fevrier 2026 |
| **Statut** | A faire |
| **User Story** | [US-004 - Naviguer facilement dans le framework](./spec-US-004.md) |
| **Dependances** | T-004-F2 (NavLink), T-004-B3 (Configuration navigation) |
| **Bloque** | T-004-F10 (DocsLayout), T-004-T6 (Tests navigation clavier) |

---

## 1. Objectif

Creer le composant **MobileMenu** qui fournit la navigation principale du site AIAD sur les ecrans mobiles et tablettes (< 1024px). Ce composant fournit :

- Un **bouton hamburger** (`<button>`) qui ouvre/ferme le panneau de navigation mobile
- Un **overlay plein ecran** qui recouvre le contenu et affiche la navigation complete
- Une **navigation en accordeon** avec 3 sections depliables (Framework, Mode Operatoire, Annexes)
- Pour les Annexes, un **double niveau d'accordeon** : categories depliables contenant les fiches enfants
- L'utilisation du composant **NavLink** (T-004-F2) en variante `mobile` pour chaque item
- Un **focus trap** quand le menu est ouvert (le focus ne quitte pas l'overlay)
- La **fermeture intelligente** : clic sur l'overlay (backdrop), touche Escape, clic sur un lien
- Le **verrouillage du scroll** du body quand le menu est ouvert (`overflow: hidden`)
- Un rendu **mobile uniquement** : masque sur desktop (`lg:hidden`)
- L'**enhancement progressif** : sans JavaScript, les liens de section restent navigables

Ce composant est consomme par le Header (T-004-F4) et constitue l'element central de la navigation mobile.

---

## 2. Contexte technique

### 2.1 Stack

| Technologie | Version | Role |
|-------------|---------|------|
| Astro | 4.x | Composant avec script client inline |
| TypeScript | 5.x | Typage strict des props |
| Tailwind CSS | 3.x | Utility-first, responsive, animations |
| JavaScript client | ES2022 | Toggle, accordeon, focus trap, scroll lock |

### 2.2 Arborescence

```
src/
├── components/
│   └── layout/
│       ├── NavLink.astro              # T-004-F2 (consomme)
│       ├── DropdownMenu.astro         # T-004-F3 (equivalent desktop)
│       └── MobileMenu.astro           <-- CE COMPOSANT
├── types/
│   └── navigation.ts                  # Types NavigationItem, NavigationSection, NavigationTree (T-004-B1)
├── data/
│   └── navigation.ts                  # NAVIGATION_TREE (T-004-B3)
├── layouts/
│   └── BaseLayout.astro               # Layout racine (T-004-F1)
└── pages/
    └── index.astro
```

### 2.3 Position dans l'architecture des composants

```
MobileMenu.astro                       <-- CE COMPOSANT (composant compose)
├── NavLink.astro (T-004-F2)          <-- Consomme (items en variante mobile)
└── Header.astro (T-004-F4)           <-- Consommateur (1 instance, visible < 1024px)
```

### 2.4 Dependances

#### T-004-F2 (NavLink)

Le composant utilise `NavLink` en variante `mobile` pour chaque item de navigation :

```astro
import NavLink from '@components/layout/NavLink.astro'
```

- Variante `mobile` : `px-4 py-3 text-base`, fond `blue-50` actif, texte `blue-700`, `w-full`, `border-l-2`
- Props transmises : `href`, `label`, `badge`, `section`, `variant="mobile"`

#### T-004-B3 (Configuration navigation)

Le composant consomme l'arbre de navigation complet :

```typescript
import type { NavigationItem, NavigationTree } from '@/types/navigation'
import { NAVIGATION_TREE } from '@/data/navigation'
```

### 2.5 Conventions suivies

| Convention | Detail |
|-----------|--------|
| Nommage fichier | PascalCase dans `src/components/layout/` |
| TypeScript | Mode strict, props typees via `interface Props` |
| Imports | Alias `@/*` pour `src/*` |
| Design | Coherent avec NavLink (focus ring `ring-2 ring-offset-2`, couleurs `blue-600/700`) |
| Formatage | Prettier : pas de semicolons, single quotes, 2 espaces |
| Responsive | Visible uniquement < 1024px (`lg:hidden`) |

---

## 3. Specifications fonctionnelles

### 3.1 Description

Le composant `MobileMenu` est un **menu de navigation mobile accessible** qui :

1. Rend un `<button>` hamburger avec une icone 3 barres (ferme) ou une croix X (ouvert)
2. Affiche un panneau overlay plein ecran au clic ou a la touche Enter/Space
3. Le panneau contient les 3 sections de navigation en format **accordeon** depliable
4. Chaque section (Framework, Mode Operatoire, Annexes) est un bouton accordeon qui revele ses items
5. Les items de navigation sont rendus via des `NavLink` en variante `mobile`
6. Les Annexes ont un **double accordeon** : categories depliables contenant leurs fiches
7. Gere un **focus trap** pour empecher le focus de quitter l'overlay
8. Verrouille le **scroll du body** quand le menu est ouvert
9. Se ferme au clic sur le backdrop, a la touche Escape, ou au clic sur un lien de navigation

### 3.2 Pattern WAI-ARIA

Le composant suit le pattern [WAI-ARIA Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) pour l'overlay et le pattern [Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) pour les sections :

| Element | Role/Attribut | Detail |
|---------|--------------|--------|
| Bouton hamburger | `<button aria-expanded="false/true" aria-controls="{panel-id}" aria-label="Menu de navigation">` | Ouvre/ferme le menu |
| Overlay container | `<div role="dialog" aria-modal="true" aria-label="Navigation principale">` | Conteneur modal |
| Bouton section | `<button aria-expanded="false/true" aria-controls="{section-panel-id}">` | Ouvre/ferme une section accordeon |
| Panneau section | `<div role="region" aria-labelledby="{section-button-id}">` | Contenu de la section |
| Items navigation | `<a>` via NavLink (variante mobile) | Liens navigables |
| Bouton categorie (Annexes) | `<button aria-expanded="false/true" aria-controls="{category-panel-id}">` | Sous-accordeon pour les categories |
| Panneau categorie | `<div role="region" aria-labelledby="{category-button-id}">` | Fiches de la categorie |

### 3.3 Structure de l'overlay

```
┌──────────────────────────────┐
│  Navigation        [X]       │  ← En-tete overlay + bouton fermer
├──────────────────────────────┤
│                              │
│  ▸ Framework                 │  ← Bouton accordeon (section)
│  ─────────────────────────── │  ← Separateur
│  ▸ Mode Operatoire           │  ← Bouton accordeon (section)
│  ─────────────────────────── │
│  ▸ Annexes                   │  ← Bouton accordeon (section)
│                              │
│                              │
│                              │
│  ┌──────────────────────────┐│
│  │     Accueil              ││  ← Lien vers la page d'accueil
│  └──────────────────────────┘│
└──────────────────────────────┘
```

**Section Framework depliee :**

```
┌──────────────────────────────┐
│  Navigation        [X]       │
├──────────────────────────────┤
│  ▾ Framework                 │  ← Section ouverte (chevron tourne)
│    Preambule           ★     │  ← NavLink mobile + badge
│    Vision & Philosophie      │
│    Ecosysteme                │
│    Artefacts                 │
│    Boucles Iteratives        │
│    Synchronisations          │
│    Metriques                 │
│    Annexes                   │
│  ─────────────────────────── │
│  ▸ Mode Operatoire           │
│  ─────────────────────────── │
│  ▸ Annexes                   │
│                              │
│  ┌──────────────────────────┐│
│  │     Accueil              ││
│  └──────────────────────────┘│
└──────────────────────────────┘
```

**Section Annexes avec sous-accordeon deplie :**

```
┌──────────────────────────────┐
│  Navigation        [X]       │
├──────────────────────────────┤
│  ▸ Framework                 │
│  ─────────────────────────── │
│  ▸ Mode Operatoire           │
│  ─────────────────────────── │
│  ▾ Annexes                   │  ← Section ouverte
│    ▾ A - Templates           │  ← Categorie ouverte
│      A1 - PRD                │
│      A2 - Architecture       │
│      A3 - Agent Guide        │
│      A4 - Specs              │
│      A5 - DoOD               │
│      A6 - DoOuD              │
│    ▸ B - Roles               │  ← Categorie fermee
│    ▸ C - Boucles             │
│    ...                       │
│                              │
│  ┌──────────────────────────┐│
│  │     Accueil              ││
│  └──────────────────────────┘│
└──────────────────────────────┘
```

### 3.4 Comportement du bouton hamburger

| Action | Resultat |
|--------|----------|
| Clic sur le bouton (ferme) | Ouvre l'overlay, focus sur le bouton fermer, verrouille le scroll |
| Clic sur le bouton (ouvert) | Ferme l'overlay, retour du focus sur le hamburger, deverrouille le scroll |
| Enter / Space sur le bouton | Meme comportement que le clic |

### 3.5 Comportement de l'overlay

| Action | Resultat |
|--------|----------|
| Clic sur le bouton fermer [X] | Ferme l'overlay, retour du focus sur le hamburger |
| Escape | Ferme l'overlay, retour du focus sur le hamburger |
| Clic sur le backdrop (zone sombre derriere le panneau) | Ferme l'overlay, retour du focus sur le hamburger |
| Clic sur un NavLink | Navigation vers la page (le lien est suivi normalement) |
| Tab au-dela du dernier element focusable | Retour au premier element (focus trap) |
| Shift+Tab avant le premier element focusable | Retour au dernier element (focus trap) |

### 3.6 Comportement des accordeons

| Action | Resultat |
|--------|----------|
| Clic sur un titre de section (ferme) | Deplie la section, ferme les autres sections (accordeon exclusif) |
| Clic sur un titre de section (ouvert) | Replie la section |
| Clic sur un titre de categorie Annexes (ferme) | Deplie la categorie, ferme les autres categories (sous-accordeon exclusif) |
| Clic sur un titre de categorie Annexes (ouvert) | Replie la categorie |
| Enter / Space sur un titre | Meme comportement que le clic |

### 3.7 Icones du bouton hamburger

| Etat | Icone | Detail |
|------|-------|--------|
| Ferme | Hamburger (3 barres) | SVG 3 lignes horizontales |
| Ouvert | Croix (X) | SVG croix de fermeture |

### 3.8 Verrouillage du scroll

Quand l'overlay est ouvert :
- `document.body.style.overflow = 'hidden'` pour bloquer le scroll du body
- Le panneau de navigation interne est scrollable si le contenu deborde (`overflow-y: auto`)
- A la fermeture : `document.body.style.overflow = ''` pour restaurer le scroll

### 3.9 Focus trap

Le focus doit rester a l'interieur de l'overlay quand il est ouvert :

1. A l'ouverture : le focus se place sur le bouton fermer [X]
2. Tab depuis le dernier element focusable → retour au bouton fermer [X]
3. Shift+Tab depuis le bouton fermer [X] → aller au dernier element focusable
4. Les elements derriere l'overlay ne sont pas focusables (via `inert` sur le body content ou gestion manuelle)

### 3.10 Enhancement progressif

Sans JavaScript (ou avant hydratation), le composant rend :
- Le bouton hamburger est un `<a href="#mobile-nav">` qui saute a la section de navigation
- Les sections de l'accordeon sont toutes depliees par defaut (pas de JavaScript = tout visible)
- Les liens de navigation fonctionnent normalement

Le script client ajoute :
1. Le comportement toggle hamburger (ouverture/fermeture de l'overlay)
2. Le comportement accordeon (deplier/replier les sections)
3. Le focus trap
4. Le verrouillage du scroll
5. La fermeture au clic backdrop / Escape

### 3.11 Responsive

| Ecran | Comportement |
|-------|-------------|
| Mobile (< 768px) | Affiche le bouton hamburger, overlay plein ecran |
| Tablette (768px - 1023px) | Affiche le bouton hamburger, overlay plein ecran |
| Desktop (>= 1024px) | **Masque** (`lg:hidden`). Les DropdownMenu (T-004-F3) prennent le relais |

### 3.12 Ouverture automatique de la section active

A l'ouverture du menu, si la page courante appartient a une section (ex: `/framework/preambule`), cette section est automatiquement depliee pour montrer l'item actif dans le contexte. Le NavLink actif a l'etat `active` (fond `blue-50`).

### 3.13 Accessibilite (RGAA AA)

| Critere | Implementation | Reference RGAA |
|---------|----------------|----------------|
| Modal accessible | `role="dialog" aria-modal="true" aria-label="Navigation principale"` | 11.2 |
| Bouton hamburger | `<button aria-expanded aria-controls aria-label="Menu de navigation">` | 7.1 |
| Accordeon | `<button aria-expanded aria-controls>` + `<div role="region" aria-labelledby>` | 7.1 |
| Focus trap | Focus ne quitte pas l'overlay | 12.13 |
| Focus visible | `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2` | 10.7 |
| Contraste texte | Ratio >= 4.5:1 pour tous les etats | 3.2 |
| Annonce d'etat | `aria-expanded` change annonce l'ouverture/fermeture | 7.1 |
| Scroll lock | Body non scrollable quand le modal est ouvert | 12.13 |
| Icone decorative | `aria-hidden="true"` sur les SVG hamburger/croix/chevrons | 10.2 |
| Lien d'accueil | Toujours visible en bas du panneau pour un acces rapide | 12.2 |

---

## 4. Specifications techniques

### 4.1 Interface TypeScript

```typescript
// src/components/layout/MobileMenu.astro (frontmatter)

import type { NavigationItem, NavigationSection, NavigationTree } from '@/types/navigation'

/**
 * Props du composant MobileMenu.
 *
 * Menu de navigation mobile accessible avec overlay plein ecran,
 * accordeon 3 sections, focus trap et verrouillage du scroll.
 *
 * Consomme NavLink (T-004-F2) en variante `mobile` pour chaque item.
 *
 * @example
 * ```astro
 * ---
 * import MobileMenu from '@components/layout/MobileMenu.astro'
 * ---
 * <MobileMenu />
 * ```
 *
 * @example
 * ```astro
 * <!-- Avec arbre custom (pour les tests) -->
 * <MobileMenu tree={myTestTree} />
 * ```
 */
export interface Props {
  // ── Donnees ───────────────────────────────────────

  /**
   * Arbre de navigation a utiliser.
   * Si non fourni, utilise NAVIGATION_TREE par defaut.
   * Utile pour l'injection dans les tests.
   */
  tree?: NavigationTree

  // ── HTML ──────────────────────────────────────────

  /**
   * Classes CSS additionnelles sur le conteneur racine.
   */
  class?: string

  /**
   * Identifiant unique du composant.
   * Genere automatiquement si non fourni.
   * Utilise pour aria-controls et les data attributes.
   */
  id?: string
}
```

### 4.2 Implementation du composant

```astro
---
// src/components/layout/MobileMenu.astro

import type { NavigationItem, NavigationTree } from '@/types/navigation'
import NavLink from '@components/layout/NavLink.astro'
import { NAVIGATION_TREE } from '@/data/navigation'

export interface Props {
  tree?: NavigationTree
  class?: string
  id?: string
}

const {
  tree = NAVIGATION_TREE,
  class: className = '',
  id: providedId,
} = Astro.props

// ── IDs uniques ─────────────────────────────────
const baseId = providedId ?? 'mobile-menu'
const panelId = `${baseId}-panel`
const toggleId = `${baseId}-toggle`
const closeId = `${baseId}-close`

// ── Detection de la section active ──────────────
const currentPath = Astro.url.pathname
function detectActiveSection(): string | null {
  if (currentPath.startsWith('/framework')) return 'framework'
  if (currentPath.startsWith('/mode-operatoire')) return 'mode-operatoire'
  if (currentPath.startsWith('/annexes')) return 'annexes'
  return null
}
const activeSection = detectActiveSection()

// ── Sections de navigation ──────────────────────
const sections = [
  { key: 'framework', label: 'Framework', items: [...tree.framework].sort((a, b) => a.order - b.order), href: '/framework' },
  { key: 'mode-operatoire', label: 'Mode Operatoire', items: [...tree.modeOperatoire].sort((a, b) => a.order - b.order), href: '/mode-operatoire' },
  { key: 'annexes', label: 'Annexes', items: [...tree.annexes].sort((a, b) => a.order - b.order), href: '/annexes' },
] as const

// ── Helper : detection de children ──────────────
function hasChildren(item: NavigationItem): boolean {
  return !!item.children && item.children.length > 0
}
---

{/* ── Bouton hamburger ─────────────────────────── */}
<div class:list={['lg:hidden', className]} data-mobile-menu id={baseId}>
  <button
    type="button"
    class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
    aria-expanded="false"
    aria-controls={panelId}
    aria-label="Menu de navigation"
    id={toggleId}
    data-mobile-menu-toggle
  >
    {/* Icone hamburger (visible quand ferme) */}
    <svg
      class="h-6 w-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      data-mobile-menu-icon-open
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
    {/* Icone croix (visible quand ouvert, masquee par defaut) */}
    <svg
      class="hidden h-6 w-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      data-mobile-menu-icon-close
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>

  {/* ── Overlay plein ecran ──────────────────────── */}
  <div
    class="fixed inset-0 z-50 hidden"
    role="dialog"
    aria-modal="true"
    aria-label="Navigation principale"
    id={panelId}
    data-mobile-menu-panel
  >
    {/* Backdrop sombre */}
    <div
      class="absolute inset-0 bg-black/50"
      data-mobile-menu-backdrop
      aria-hidden="true"
    />

    {/* Panneau de navigation */}
    <div
      class="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl flex flex-col overflow-hidden"
      data-mobile-menu-content
    >
      {/* En-tete du panneau */}
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <span class="text-lg font-semibold text-gray-900">Navigation</span>
        <button
          type="button"
          class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
          aria-label="Fermer le menu"
          id={closeId}
          data-mobile-menu-close
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Corps scrollable */}
      <nav class="flex-1 overflow-y-auto px-2 py-4" aria-label="Navigation mobile">
        {sections.map((section, sectionIndex) => {
          const sectionButtonId = `${baseId}-section-${section.key}-button`
          const sectionPanelId = `${baseId}-section-${section.key}-panel`
          const isActiveSection = activeSection === section.key

          return (
            <div data-mobile-menu-section={section.key}>
              {/* Separateur entre les sections (sauf avant la premiere) */}
              {sectionIndex > 0 && (
                <hr class="my-2 border-gray-200" role="separator" />
              )}

              {/* Bouton titre de section (accordeon) */}
              <button
                type="button"
                class="flex items-center justify-between w-full px-4 py-3 text-left text-base font-semibold text-gray-900 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
                aria-expanded={isActiveSection ? 'true' : 'false'}
                aria-controls={sectionPanelId}
                id={sectionButtonId}
                data-mobile-menu-section-toggle
                data-section={section.key}
              >
                <span>{section.label}</span>
                <svg
                  class:list={[
                    'h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200',
                    isActiveSection ? 'rotate-180' : '',
                  ]}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  data-mobile-menu-section-chevron
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Panneau de la section (accordeon) */}
              <div
                class:list={[
                  'pl-2',
                  isActiveSection ? '' : 'hidden',
                ]}
                role="region"
                aria-labelledby={sectionButtonId}
                id={sectionPanelId}
                data-mobile-menu-section-panel
              >
                {section.key !== 'annexes' ? (
                  /* ── Mode simple (Framework, Mode Operatoire) ── */
                  <div class="space-y-0.5 py-1">
                    {section.items.map((item) => (
                      <NavLink
                        href={item.href}
                        label={item.label}
                        variant="mobile"
                        badge={item.badge}
                        section={section.key as any}
                      />
                    ))}
                  </div>
                ) : (
                  /* ── Mode sous-accordeon (Annexes) ─────────── */
                  <div class="space-y-0.5 py-1">
                    {section.items.map((category) => {
                      const categoryButtonId = `${baseId}-category-${category.id}-button`
                      const categoryPanelId = `${baseId}-category-${category.id}-panel`
                      const isCategoryActive = currentPath.startsWith(category.href)

                      return (
                        <div data-mobile-menu-category={category.id}>
                          {/* Bouton titre de categorie (sous-accordeon) */}
                          <button
                            type="button"
                            class="flex items-center justify-between w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
                            aria-expanded={isCategoryActive ? 'true' : 'false'}
                            aria-controls={categoryPanelId}
                            id={categoryButtonId}
                            data-mobile-menu-category-toggle
                          >
                            <span>{category.label}</span>
                            {hasChildren(category) && (
                              <svg
                                class:list={[
                                  'h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200',
                                  isCategoryActive ? 'rotate-180' : '',
                                ]}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                data-mobile-menu-category-chevron
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            )}
                          </button>

                          {/* Panneau de la categorie (fiches enfants) */}
                          {hasChildren(category) && (
                            <div
                              class:list={[
                                'pl-4',
                                isCategoryActive ? '' : 'hidden',
                              ]}
                              role="region"
                              aria-labelledby={categoryButtonId}
                              id={categoryPanelId}
                              data-mobile-menu-category-panel
                            >
                              <div class="space-y-0.5 py-1">
                                {[...category.children!]
                                  .sort((a, b) => a.order - b.order)
                                  .map((fiche) => (
                                    <NavLink
                                      href={fiche.href}
                                      label={fiche.label}
                                      variant="mobile"
                                      badge={fiche.badge}
                                      section="annexes"
                                    />
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Lien vers l'accueil (pied du panneau) */}
      <div class="border-t border-gray-200 px-4 py-3">
        <a
          href="/"
          class="flex items-center justify-center gap-2 w-full px-4 py-3 text-base font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
          data-mobile-menu-home
        >
          <svg
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"
            />
          </svg>
          Accueil
        </a>
      </div>
    </div>
  </div>
</div>

<script>
  /**
   * Script client pour le comportement interactif du MobileMenu.
   *
   * Fonctionnalites :
   * - Toggle ouverture/fermeture de l'overlay
   * - Accordeon : deplier/replier les sections (exclusif)
   * - Sous-accordeon pour les categories d'Annexes (exclusif)
   * - Focus trap dans l'overlay ouvert
   * - Verrouillage du scroll du body
   * - Fermeture au clic backdrop, Escape, clic sur lien
   * - Swap icone hamburger/croix
   */
  function initMobileMenu(container: HTMLElement) {
    const toggle = container.querySelector<HTMLButtonElement>('[data-mobile-menu-toggle]')
    const panel = container.querySelector<HTMLDivElement>('[data-mobile-menu-panel]')
    const closeBtn = container.querySelector<HTMLButtonElement>('[data-mobile-menu-close]')
    const backdrop = container.querySelector<HTMLDivElement>('[data-mobile-menu-backdrop]')
    const iconOpen = container.querySelector<SVGElement>('[data-mobile-menu-icon-open]')
    const iconClose = container.querySelector<SVGElement>('[data-mobile-menu-icon-close]')
    const content = container.querySelector<HTMLDivElement>('[data-mobile-menu-content]')

    if (!toggle || !panel || !closeBtn || !backdrop) return

    // ── Helpers ───────────────────────────────────
    function isOpen(): boolean {
      return toggle!.getAttribute('aria-expanded') === 'true'
    }

    function getFocusableElements(): HTMLElement[] {
      if (!content) return []
      return Array.from(
        content.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.closest('[hidden]') && !el.closest('.hidden'))
    }

    function open() {
      toggle!.setAttribute('aria-expanded', 'true')
      panel!.classList.remove('hidden')
      iconOpen?.classList.add('hidden')
      iconClose?.classList.remove('hidden')
      document.body.style.overflow = 'hidden'
      container.setAttribute('data-mobile-menu-open', '')

      // Focus sur le bouton fermer
      requestAnimationFrame(() => {
        closeBtn!.focus()
      })
    }

    function close() {
      toggle!.setAttribute('aria-expanded', 'false')
      panel!.classList.add('hidden')
      iconOpen?.classList.remove('hidden')
      iconClose?.classList.add('hidden')
      document.body.style.overflow = ''
      container.removeAttribute('data-mobile-menu-open')

      // Retour du focus sur le hamburger
      toggle!.focus()
    }

    // ── Accordeon sections ────────────────────────
    function toggleSection(button: HTMLButtonElement) {
      const sectionPanel = button.nextElementSibling?.nextElementSibling as HTMLElement | null
      const controlsId = button.getAttribute('aria-controls')
      const targetPanel = controlsId ? document.getElementById(controlsId) : sectionPanel

      if (!targetPanel) return

      const isExpanded = button.getAttribute('aria-expanded') === 'true'

      if (!isExpanded) {
        // Fermer les autres sections (accordeon exclusif)
        container.querySelectorAll<HTMLButtonElement>('[data-mobile-menu-section-toggle]').forEach((btn) => {
          if (btn !== button) {
            btn.setAttribute('aria-expanded', 'false')
            const chevron = btn.querySelector('[data-mobile-menu-section-chevron]')
            chevron?.classList.remove('rotate-180')
            const otherControlsId = btn.getAttribute('aria-controls')
            const otherPanel = otherControlsId ? document.getElementById(otherControlsId) : null
            otherPanel?.classList.add('hidden')
          }
        })
      }

      // Toggle la section courante
      button.setAttribute('aria-expanded', isExpanded ? 'false' : 'true')
      targetPanel.classList.toggle('hidden')
      const chevron = button.querySelector('[data-mobile-menu-section-chevron]')
      chevron?.classList.toggle('rotate-180')
    }

    // ── Accordeon categories (Annexes) ────────────
    function toggleCategory(button: HTMLButtonElement) {
      const controlsId = button.getAttribute('aria-controls')
      const targetPanel = controlsId ? document.getElementById(controlsId) : null

      if (!targetPanel) return

      const isExpanded = button.getAttribute('aria-expanded') === 'true'

      if (!isExpanded) {
        // Fermer les autres categories dans la meme section (sous-accordeon exclusif)
        const parentSection = button.closest('[data-mobile-menu-section]')
        if (parentSection) {
          parentSection.querySelectorAll<HTMLButtonElement>('[data-mobile-menu-category-toggle]').forEach((btn) => {
            if (btn !== button) {
              btn.setAttribute('aria-expanded', 'false')
              const chevron = btn.querySelector('[data-mobile-menu-category-chevron]')
              chevron?.classList.remove('rotate-180')
              const otherControlsId = btn.getAttribute('aria-controls')
              const otherPanel = otherControlsId ? document.getElementById(otherControlsId) : null
              otherPanel?.classList.add('hidden')
            }
          })
        }
      }

      // Toggle la categorie courante
      button.setAttribute('aria-expanded', isExpanded ? 'false' : 'true')
      targetPanel.classList.toggle('hidden')
      const chevron = button.querySelector('[data-mobile-menu-category-chevron]')
      chevron?.classList.toggle('rotate-180')
    }

    // ── Focus trap ────────────────────────────────
    function handleFocusTrap(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !isOpen()) return

      const focusable = getFocusableElements()
      if (focusable.length === 0) return

      const firstEl = focusable[0]
      const lastEl = focusable[focusable.length - 1]

      if (e.shiftKey) {
        // Shift+Tab : si on est sur le premier, aller au dernier
        if (document.activeElement === firstEl) {
          e.preventDefault()
          lastEl.focus()
        }
      } else {
        // Tab : si on est sur le dernier, aller au premier
        if (document.activeElement === lastEl) {
          e.preventDefault()
          firstEl.focus()
        }
      }
    }

    // ── Events: bouton hamburger ──────────────────
    toggle.addEventListener('click', () => {
      if (isOpen()) {
        close()
      } else {
        open()
      }
    })

    // ── Events: bouton fermer ─────────────────────
    closeBtn.addEventListener('click', () => {
      close()
    })

    // ── Events: backdrop ──────────────────────────
    backdrop.addEventListener('click', () => {
      if (isOpen()) {
        close()
      }
    })

    // ── Events: Escape ────────────────────────────
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen()) {
        e.preventDefault()
        close()
      }
    })

    // ── Events: focus trap ────────────────────────
    panel.addEventListener('keydown', handleFocusTrap)

    // ── Events: accordeons sections ───────────────
    container.querySelectorAll<HTMLButtonElement>('[data-mobile-menu-section-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => toggleSection(btn))
    })

    // ── Events: accordeons categories ─────────────
    container.querySelectorAll<HTMLButtonElement>('[data-mobile-menu-category-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => toggleCategory(btn))
    })
  }

  // ── Initialisation ──────────────────────────────
  document.querySelectorAll<HTMLElement>('[data-mobile-menu]').forEach(initMobileMenu)
</script>
```

### 4.3 Data attributes

| Attribut | Element | Usage |
|----------|---------|-------|
| `data-mobile-menu` | `<div>` racine | Selecteur pour l'initialisation JS et les tests |
| `data-mobile-menu-toggle` | `<button>` hamburger | Selecteur du bouton d'ouverture |
| `data-mobile-menu-panel` | `<div role="dialog">` | Selecteur de l'overlay complet |
| `data-mobile-menu-backdrop` | `<div>` fond sombre | Selecteur du backdrop cliquable |
| `data-mobile-menu-content` | `<div>` panneau blanc | Selecteur du contenu du panneau |
| `data-mobile-menu-close` | `<button>` fermer | Selecteur du bouton de fermeture [X] |
| `data-mobile-menu-icon-open` | `<svg>` hamburger | Selecteur de l'icone hamburger |
| `data-mobile-menu-icon-close` | `<svg>` croix | Selecteur de l'icone croix (sur le toggle) |
| `data-mobile-menu-section` | `<div>` conteneur section | Selecteur d'une section (avec valeur `framework`, `mode-operatoire`, `annexes`) |
| `data-mobile-menu-section-toggle` | `<button>` titre section | Selecteur des boutons accordeon section |
| `data-mobile-menu-section-chevron` | `<svg>` chevron section | Selecteur du chevron de section pour la rotation |
| `data-mobile-menu-section-panel` | `<div role="region">` | Selecteur du panneau de section |
| `data-mobile-menu-category` | `<div>` conteneur categorie | Selecteur d'une categorie Annexes (avec valeur = `category.id`) |
| `data-mobile-menu-category-toggle` | `<button>` titre categorie | Selecteur des boutons accordeon categorie |
| `data-mobile-menu-category-chevron` | `<svg>` chevron categorie | Selecteur du chevron de categorie pour la rotation |
| `data-mobile-menu-category-panel` | `<div role="region">` | Selecteur du panneau de categorie |
| `data-mobile-menu-home` | `<a>` lien accueil | Selecteur du lien vers la page d'accueil |
| `data-mobile-menu-open` | `<div>` racine (presence) | Indicateur d'etat ouvert (ajoute/retire par JS) |

### 4.4 Exemples d'utilisation

#### Usage standard (dans le Header)

```astro
---
import MobileMenu from '@components/layout/MobileMenu.astro'
---

<header class="...">
  <nav class="flex items-center justify-between ...">
    {/* Logo */}
    <a href="/" class="...">AIAD</a>

    {/* Navigation desktop (DropdownMenus) - masquee en mobile */}
    <div class="hidden lg:flex lg:items-center lg:gap-2">
      {/* ... DropdownMenus ... */}
    </div>

    {/* Navigation mobile - masquee en desktop */}
    <MobileMenu />
  </nav>
</header>
```

#### Avec arbre custom (tests)

```astro
<MobileMenu tree={myTestTree} />
```

#### Avec classe et id personnalises

```astro
<MobileMenu class="ml-2" id="main-mobile-nav" />
```

---

## 5. Design et Style

### 5.1 Palette de couleurs par etat

| Etat | Texte | Fond | Bordure |
|------|-------|------|---------|
| Bouton hamburger normal | `text-gray-700` (#374151) | transparent | — |
| Bouton hamburger hover | `text-gray-900` (#111827) | `bg-gray-100` (#F3F4F6) | — |
| Bouton hamburger focus | — | — | `ring-2 ring-blue-500 ring-offset-2` |
| Backdrop overlay | — | `bg-black/50` (noir 50% opacite) | — |
| Panneau background | — | `bg-white` (#FFFFFF) | `shadow-xl` |
| En-tete panneau | `text-gray-900` (#111827) | — | `border-b border-gray-200` |
| Bouton fermer | `text-gray-500` (#6B7280) | transparent | — |
| Bouton fermer hover | `text-gray-700` (#374151) | `bg-gray-100` (#F3F4F6) | — |
| Titre section (accordeon) | `text-gray-900` (#111827) | transparent | — |
| Titre section hover | `text-gray-900` | `bg-gray-50` (#F9FAFB) | — |
| Titre categorie (Annexes) | `text-gray-700` (#374151) | transparent | — |
| Titre categorie hover | `text-gray-700` | `bg-gray-50` (#F9FAFB) | — |
| Item inactif (NavLink) | `text-gray-900` (#111827) | transparent | — |
| Item actif (NavLink) | `text-blue-700` (#1D4ED8) | `bg-blue-50` (#EFF6FF) | `border-l-2 border-blue-600` |
| Item hover (NavLink) | `text-gray-900` | `bg-gray-50` (#F9FAFB) | — |
| Chevron | `text-gray-400` (#9CA3AF) | — | — |
| Separateur | — | — | `border-gray-200` (#E5E7EB) |
| Lien accueil | `text-gray-700` (#374151) | `bg-gray-50` (#F9FAFB) | — |
| Lien accueil hover | `text-gray-700` | `bg-gray-100` (#F3F4F6) | — |

### 5.2 Verification du contraste (WCAG AA)

| Combinaison | Ratio | Conforme AA ? |
|-------------|-------|---------------|
| `gray-700` (#374151) sur `white` (#FFFFFF) | 9.12:1 | Oui (>= 4.5:1) |
| `gray-900` (#111827) sur `white` (#FFFFFF) | 16.75:1 | Oui (>= 4.5:1) |
| `gray-900` (#111827) sur `gray-50` (#F9FAFB) | 15.4:1 | Oui (>= 4.5:1) |
| `blue-700` (#1D4ED8) sur `blue-50` (#EFF6FF) | 4.88:1 | Oui (>= 4.5:1) |
| `gray-500` (#6B7280) sur `white` (#FFFFFF) | 4.64:1 | Oui (>= 4.5:1) |
| `gray-700` (#374151) sur `gray-50` (#F9FAFB) | 8.41:1 | Oui (>= 4.5:1) |

### 5.3 Dimensions et espacement

| Element | Style | Detail |
|---------|-------|--------|
| Bouton hamburger | `p-2 rounded-md` | ~40px zone de clic, min 44px recommande en mobile |
| Icone hamburger/croix | `h-6 w-6` | 24px |
| Overlay | `fixed inset-0 z-50` | Plein ecran, z-index 50 |
| Backdrop | `absolute inset-0 bg-black/50` | Couvre tout l'ecran |
| Panneau | `absolute inset-y-0 right-0 w-full max-w-sm` | Glisse depuis la droite, max 384px |
| En-tete panneau | `px-4 py-3 border-b` | Padding 16px horizontal, 12px vertical |
| Titre section | `px-4 py-3 text-base font-semibold` | 16px texte, gras |
| Titre categorie | `px-4 py-2.5 text-sm font-medium` | 14px texte, medium |
| Chevron section | `h-5 w-5` | 20px |
| Chevron categorie | `h-4 w-4` | 16px |
| Items NavLink mobile | `px-4 py-3 text-base` | 16px texte, confort tactile |
| Indentation section | `pl-2` | 8px depuis la marge gauche |
| Indentation categorie | `pl-4` | 16px supplementaires |
| Separateur | `my-2 border-gray-200` | 8px marge verticale |
| Lien accueil | `px-4 py-3 bg-gray-50 rounded-md` | Mise en valeur en bas du panneau |
| Icone accueil | `h-5 w-5` | 20px |

### 5.4 Animation

| Propriete | Detail |
|-----------|--------|
| Chevron rotation | `transition-transform duration-200` + classe `rotate-180` (ajoutee par JS) |
| Icone hamburger/croix | Swap via `hidden` class (pas d'animation — simplicite) |
| Overlay apparition | Pas d'animation CSS de slide (affichage/masquage via `hidden`) — performance mobile |
| Hover items | `transition-colors duration-150` (via NavLink) |
| Bouton hover | `transition-colors duration-150` |

### 5.5 Coherence avec le design system

| Aspect | Conformite |
|--------|------------|
| Focus ring | `ring-2 ring-blue-500 ring-offset-2` — coherent avec NavLink, DropdownMenu, Breadcrumb |
| Couleurs actives | `blue-600/700/50` — coherent avec NavLink et le design system |
| Transition | `transition-colors duration-150` — coherent avec NavLink |
| Coins arrondis | `rounded-md` pour le bouton et les items |
| Ombre | `shadow-xl` pour le panneau (plus fort que le `shadow-lg` des dropdowns car overlay) |
| Taille texte | `text-base` (16px) — plus grand que le desktop `text-sm` pour le confort tactile mobile |
| Zone de clic | Items en `py-3` (48px+ de hauteur) — conforme aux recommandations Mobile Touch Target (>= 44px) |

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Matrice des cas limites

| ID | Cas | Comportement attendu | Priorite |
|----|-----|----------------------|----------|
| CL-01 | Clic sur le bouton hamburger (ferme) | Ouvre l'overlay, focus sur le bouton fermer, verrouille le scroll | Haute |
| CL-02 | Clic sur le bouton hamburger (ouvert) | Ferme l'overlay, focus sur le hamburger, deverrouille le scroll | Haute |
| CL-03 | Clic sur le bouton fermer [X] | Ferme l'overlay, focus sur le hamburger | Haute |
| CL-04 | Clic sur le backdrop | Ferme l'overlay, focus sur le hamburger | Haute |
| CL-05 | Touche Escape (overlay ouvert) | Ferme l'overlay, focus sur le hamburger | Haute |
| CL-06 | Touche Escape (overlay ferme) | Rien (pas d'action) | Basse |
| CL-07 | Clic sur un NavLink dans le menu | Navigation vers la page (comportement natif du lien) | Haute |
| CL-08 | Tab au-dela du dernier element focusable | Retour au premier (focus trap) | Haute |
| CL-09 | Shift+Tab avant le premier element focusable | Retour au dernier (focus trap) | Haute |
| CL-10 | Enter/Space sur le bouton hamburger | Meme comportement que le clic | Haute |
| CL-11 | Clic sur un titre de section (ferme) | Deplie la section, ferme les autres sections | Haute |
| CL-12 | Clic sur un titre de section (ouvert) | Replie la section | Haute |
| CL-13 | Clic sur un titre de categorie Annexes (ferme) | Deplie la categorie, ferme les autres | Haute |
| CL-14 | Clic sur un titre de categorie Annexes (ouvert) | Replie la categorie | Haute |
| CL-15 | Enter/Space sur un titre de section | Meme comportement que le clic | Haute |
| CL-16 | Section active detectee a l'ouverture | Section correspondant a l'URL courante depliee par defaut | Haute |
| CL-17 | Aucune section active (page d'accueil) | Toutes les sections repliees par defaut | Haute |
| CL-18 | Swap icones hamburger/croix | Hamburger visible quand ferme, croix visible quand ouvert | Haute |
| CL-19 | Scroll lock quand ouvert | `body.style.overflow = 'hidden'` | Haute |
| CL-20 | Scroll unlock quand ferme | `body.style.overflow = ''` | Haute |
| CL-21 | Panneau scrollable si contenu long | Section Annexes avec 9 categories + fiches → `overflow-y-auto` sur le corps | Haute |
| CL-22 | Desktop (>= 1024px) | Composant masque (`lg:hidden`) | Haute |
| CL-23 | Redimensionnement de la fenetre (mobile → desktop avec overlay ouvert) | L'overlay reste visible mais est masque par `lg:hidden` sur le conteneur parent | Moyenne |
| CL-24 | Sans JavaScript | Le bouton hamburger est un lien (enhancement progressif fallback). Toutes les sections depliees | Haute |
| CL-25 | `tree` vide | Pas de sections rendues, seul le lien accueil est present | Basse |
| CL-26 | Label avec caracteres speciaux/accents | Echappe automatiquement par Astro | Haute |
| CL-27 | `class` personnalise fourni | Ajoute aux classes existantes (ne remplace pas) | Moyenne |
| CL-28 | `id` personnalise fourni | Utilise comme base pour tous les IDs derives | Moyenne |
| CL-29 | Lien d'accueil toujours visible | En bas du panneau, dans le pied fixe | Haute |
| CL-30 | Plusieurs MobileMenu sur la meme page | Chaque instance isolee grace a la closure `initMobileMenu(container)` | Basse |

### 6.2 Strategie de fallback

```
Props manquantes ?
├── tree: non fourni → NAVIGATION_TREE par defaut
├── class: non fourni → '' (pas de classes additionnelles)
└── id: non fourni → 'mobile-menu' (genere automatiquement)

JavaScript indisponible ?
├── Le bouton hamburger est rendu comme <button> non fonctionnel
├── L'overlay est masque (hidden) donc les sections ne sont pas accessibles
├── Mitigation : les liens de section dans le Header desktop (via <noscript> des DropdownMenus) restent navigables
└── Note : le site etant SSG, le JS se charge tres rapidement. Le fallback no-JS est un cas extreme.
```

---

## 7. Exemples entree/sortie

### 7.1 Rendu initial (menu ferme)

**Entree :**

```astro
<MobileMenu />
```

**Sortie HTML (extrait) :**

```html
<div class="lg:hidden" data-mobile-menu id="mobile-menu">
  <button
    type="button"
    class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 ..."
    aria-expanded="false"
    aria-controls="mobile-menu-panel"
    aria-label="Menu de navigation"
    id="mobile-menu-toggle"
    data-mobile-menu-toggle
  >
    <svg class="h-6 w-6" aria-hidden="true" data-mobile-menu-icon-open>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
    <svg class="hidden h-6 w-6" aria-hidden="true" data-mobile-menu-icon-close>
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <div class="fixed inset-0 z-50 hidden" role="dialog" aria-modal="true" aria-label="Navigation principale" id="mobile-menu-panel" data-mobile-menu-panel>
    <div class="absolute inset-0 bg-black/50" data-mobile-menu-backdrop aria-hidden="true"></div>
    <div class="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl flex flex-col overflow-hidden" data-mobile-menu-content>
      <!-- En-tete avec bouton fermer -->
      <!-- Sections accordeon -->
      <!-- Lien accueil -->
    </div>
  </div>
</div>
```

### 7.2 Section Framework depliee (page /framework/preambule)

L'`aria-expanded` de la section Framework est `"true"` et son panneau n'a pas la classe `hidden`, car la page courante est dans `/framework`.

```html
<button
  aria-expanded="true"
  aria-controls="mobile-menu-section-framework-panel"
  id="mobile-menu-section-framework-button"
  data-mobile-menu-section-toggle
  data-section="framework"
  class="..."
>
  <span>Framework</span>
  <svg class="... rotate-180" data-mobile-menu-section-chevron>...</svg>
</button>
<div class="pl-2" role="region" aria-labelledby="mobile-menu-section-framework-button" id="mobile-menu-section-framework-panel" data-mobile-menu-section-panel>
  <div class="space-y-0.5 py-1">
    <!-- NavLink variant="mobile" pour chaque chapitre -->
    <a href="/framework/preambule" class="... bg-blue-50 text-blue-700 ..." aria-current="page" data-navlink>
      <span class="truncate">Preambule</span>
      <span class="... bg-amber-100 text-amber-800">Essentiel</span>
    </a>
    <a href="/framework/vision-philosophie" class="... text-gray-900 ..." data-navlink>
      <span class="truncate">Vision &amp; Philosophie</span>
    </a>
    <!-- ... 6 autres chapitres ... -->
  </div>
</div>
```

### 7.3 Section Annexes avec categorie depliee

Quand la page courante est `/annexes/templates/prd`, la section Annexes ET la categorie A - Templates sont depliees.

```html
<div data-mobile-menu-category="annexes-a-templates">
  <button
    aria-expanded="true"
    aria-controls="mobile-menu-category-annexes-a-templates-panel"
    data-mobile-menu-category-toggle
    class="..."
  >
    <span>A - Templates</span>
    <svg class="... rotate-180" data-mobile-menu-category-chevron>...</svg>
  </button>
  <div class="pl-4" role="region" aria-labelledby="..." id="mobile-menu-category-annexes-a-templates-panel" data-mobile-menu-category-panel>
    <div class="space-y-0.5 py-1">
      <a href="/annexes/templates/prd" class="... bg-blue-50 text-blue-700 ..." aria-current="page" data-navlink>
        <span class="truncate">A1 - PRD</span>
      </a>
      <a href="/annexes/templates/architecture" class="... text-gray-900 ..." data-navlink>
        <span class="truncate">A2 - Architecture</span>
      </a>
      <!-- ... autres fiches ... -->
    </div>
  </div>
</div>
```

### 7.4 Protection XSS

**Entree :**

```astro
<MobileMenu tree={{
  framework: [{ id: 'xss', label: '<script>alert("xss")</script>', href: '/test', order: 1 }],
  modeOperatoire: [],
  annexes: [],
}} />
```

**Sortie HTML :**

```html
<span>&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</span>
```

> Astro echappe automatiquement les expressions `{variable}` dans les templates.

### 7.5 Avec classe et id personnalises

**Entree :**

```astro
<MobileMenu class="ml-2" id="main-nav" />
```

**Sortie HTML (extrait) :**

```html
<div class="lg:hidden ml-2" data-mobile-menu id="main-nav">
  <button ... aria-controls="main-nav-panel" id="main-nav-toggle" ...>
  <div ... id="main-nav-panel" ...>
    <!-- IDs derives : main-nav-section-framework-button, main-nav-section-framework-panel, etc. -->
  </div>
</div>
```

---

## 8. Tests

### 8.1 Fichiers de test

| Fichier | Type | Framework |
|---------|------|-----------|
| `tests/unit/components/layout/mobile-menu.test.ts` | Unitaire | Vitest + Astro Container |

### 8.2 Tests unitaires (Vitest)

```typescript
// tests/unit/components/layout/mobile-menu.test.ts
import { describe, it, expect } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import MobileMenu from '@components/layout/MobileMenu.astro'
import type { NavigationTree } from '@/types/navigation'

// ── Fixtures ────────────────────────────────────────
const MINIMAL_TREE: NavigationTree = {
  framework: [
    { id: 'fw-preambule', label: 'Preambule', href: '/framework/preambule', section: 'framework', order: 1, badge: 'essential' as const },
    { id: 'fw-vision', label: 'Vision & Philosophie', href: '/framework/vision-philosophie', section: 'framework', order: 2 },
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
        { id: 'annexe-a2-arch', label: 'A2 - Architecture', href: '/annexes/templates/architecture', order: 2 },
      ],
    },
    {
      id: 'annexes-b-roles', label: 'B - Roles', href: '/annexes/roles',
      section: 'annexes', order: 2,
      children: [
        { id: 'annexe-b1-pm', label: 'B1 - Product Manager', href: '/annexes/roles/product-manager', order: 1 },
      ],
    },
  ],
}

const EMPTY_TREE: NavigationTree = {
  framework: [],
  modeOperatoire: [],
  annexes: [],
}

// ── Helpers ──────────────────────────────────────────
async function renderMobileMenu(
  props: Record<string, unknown> = {},
  currentPath: string = '/',
) {
  const container = await AstroContainer.create()
  return container.renderToString(MobileMenu, {
    props: {
      tree: MINIMAL_TREE,
      ...props,
    },
    request: new Request(`https://aiad.dev${currentPath}`),
  })
}

// ── Tests structure HTML de base ─────────────────────
describe('MobileMenu — Structure HTML', () => {
  it('T-01 : rend un conteneur avec data-mobile-menu', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('data-mobile-menu')
  })

  it('T-02 : rend un bouton hamburger avec data-mobile-menu-toggle', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('data-mobile-menu-toggle')
    expect(html).toContain('<button')
  })

  it('T-03 : le bouton hamburger a aria-expanded="false" par defaut', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('aria-expanded="false"')
  })

  it('T-04 : le bouton hamburger a aria-controls pointant vers le panneau', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('aria-controls="mobile-menu-panel"')
  })

  it('T-05 : le bouton hamburger a aria-label="Menu de navigation"', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('aria-label="Menu de navigation"')
  })

  it('T-06 : le panneau a role="dialog" et aria-modal="true"', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('role="dialog"')
    expect(html).toContain('aria-modal="true"')
  })

  it('T-07 : le panneau a aria-label="Navigation principale"', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('aria-label="Navigation principale"')
  })

  it('T-08 : le panneau est masque par defaut (classe hidden)', async () => {
    const html = await renderMobileMenu()
    expect(html).toMatch(/data-mobile-menu-panel[^>]*class="[^"]*hidden/)
  })

  it('T-09 : contient le bouton fermer avec aria-label="Fermer le menu"', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('aria-label="Fermer le menu"')
    expect(html).toContain('data-mobile-menu-close')
  })

  it('T-10 : contient le backdrop avec data-mobile-menu-backdrop', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('data-mobile-menu-backdrop')
    expect(html).toContain('bg-black/50')
  })
})

// ── Tests icones hamburger/croix ─────────────────────
describe('MobileMenu — Icones', () => {
  it('T-11 : l\'icone hamburger est presente (data-mobile-menu-icon-open)', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('data-mobile-menu-icon-open')
    expect(html).toContain('M4 6h16M4 12h16M4 18h16')
  })

  it('T-12 : l\'icone croix est presente mais masquee (data-mobile-menu-icon-close)', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('data-mobile-menu-icon-close')
    expect(html).toContain('M6 18L18 6M6 6l12 12')
  })

  it('T-13 : l\'icone croix a la classe hidden par defaut', async () => {
    const html = await renderMobileMenu()
    expect(html).toMatch(/data-mobile-menu-icon-close[^>]*class="[^"]*hidden/)
  })

  it('T-14 : les icones SVG ont aria-hidden="true"', async () => {
    const html = await renderMobileMenu()
    const svgMatches = html.match(/<svg[^>]*data-mobile-menu-icon[^>]*>/g) || []
    svgMatches.forEach((svg) => {
      expect(svg).toContain('aria-hidden="true"')
    })
  })
})

// ── Tests sections accordeon ─────────────────────────
describe('MobileMenu — Sections accordeon', () => {
  it('T-15 : rend 3 sections (Framework, Mode Operatoire, Annexes)', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('data-mobile-menu-section="framework"')
    expect(html).toContain('data-mobile-menu-section="mode-operatoire"')
    expect(html).toContain('data-mobile-menu-section="annexes"')
  })

  it('T-16 : chaque section a un bouton avec data-mobile-menu-section-toggle', async () => {
    const html = await renderMobileMenu()
    const toggleCount = (html.match(/data-mobile-menu-section-toggle/g) || []).length
    expect(toggleCount).toBe(3)
  })

  it('T-17 : chaque section a un panneau avec role="region"', async () => {
    const html = await renderMobileMenu()
    const regionCount = (html.match(/data-mobile-menu-section-panel/g) || []).length
    expect(regionCount).toBe(3)
  })

  it('T-18 : les boutons de section ont aria-controls pointant vers leur panneau', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('aria-controls="mobile-menu-section-framework-panel"')
    expect(html).toContain('aria-controls="mobile-menu-section-mode-operatoire-panel"')
    expect(html).toContain('aria-controls="mobile-menu-section-annexes-panel"')
  })

  it('T-19 : les panneaux de section ont aria-labelledby pointant vers leur bouton', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('aria-labelledby="mobile-menu-section-framework-button"')
  })

  it('T-20 : les labels de section sont affiches', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('Framework')
    expect(html).toContain('Mode Operatoire')
    expect(html).toContain('Annexes')
  })

  it('T-21 : les chevrons de section sont presents', async () => {
    const html = await renderMobileMenu()
    const chevronCount = (html.match(/data-mobile-menu-section-chevron/g) || []).length
    expect(chevronCount).toBe(3)
  })

  it('T-22 : les separateurs sont presents entre les sections', async () => {
    const html = await renderMobileMenu()
    const separatorCount = (html.match(/role="separator"/g) || []).length
    expect(separatorCount).toBe(2)
  })
})

// ── Tests section active ─────────────────────────────
describe('MobileMenu — Section active', () => {
  it('T-23 : la section Framework est depliee quand l\'URL commence par /framework', async () => {
    const html = await renderMobileMenu({}, '/framework/preambule')
    // Le bouton framework doit avoir aria-expanded="true"
    expect(html).toMatch(/data-section="framework"[^>]*aria-expanded="true"/)
  })

  it('T-24 : les autres sections sont repliees quand Framework est active', async () => {
    const html = await renderMobileMenu({}, '/framework/preambule')
    expect(html).toMatch(/data-section="mode-operatoire"[^>]*aria-expanded="false"/)
    expect(html).toMatch(/data-section="annexes"[^>]*aria-expanded="false"/)
  })

  it('T-25 : la section Mode Operatoire est depliee quand l\'URL commence par /mode-operatoire', async () => {
    const html = await renderMobileMenu({}, '/mode-operatoire/preambule')
    expect(html).toMatch(/data-section="mode-operatoire"[^>]*aria-expanded="true"/)
  })

  it('T-26 : toutes les sections sont repliees sur la page d\'accueil', async () => {
    const html = await renderMobileMenu({}, '/')
    expect(html).toMatch(/data-section="framework"[^>]*aria-expanded="false"/)
    expect(html).toMatch(/data-section="mode-operatoire"[^>]*aria-expanded="false"/)
    expect(html).toMatch(/data-section="annexes"[^>]*aria-expanded="false"/)
  })

  it('T-27 : le chevron de la section active est tourne (rotate-180)', async () => {
    const html = await renderMobileMenu({}, '/framework/preambule')
    // Le chevron dans la section framework doit avoir rotate-180
    const fwSection = html.split('data-section="framework"')[1]?.split('data-mobile-menu-section="')[0] || ''
    expect(fwSection).toContain('rotate-180')
  })
})

// ── Tests items de navigation ────────────────────────
describe('MobileMenu — Items de navigation', () => {
  it('T-28 : les items Framework sont rendus comme des NavLink', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('href="/framework/preambule"')
    expect(html).toContain('Preambule')
    expect(html).toContain('Vision &amp; Philosophie')
  })

  it('T-29 : les items ont data-navlink (via NavLink)', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('data-navlink')
  })

  it('T-30 : le badge est affiche sur les items qui en ont un', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('Essentiel')
  })

  it('T-31 : les items Mode Operatoire sont rendus', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('href="/mode-operatoire/preambule"')
  })
})

// ── Tests Annexes (sous-accordeon) ───────────────────
describe('MobileMenu — Annexes sous-accordeon', () => {
  it('T-32 : les categories Annexes sont rendues avec data-mobile-menu-category', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('data-mobile-menu-category="annexes-a-templates"')
    expect(html).toContain('data-mobile-menu-category="annexes-b-roles"')
  })

  it('T-33 : les categories ont des boutons toggle avec data-mobile-menu-category-toggle', async () => {
    const html = await renderMobileMenu()
    const toggleCount = (html.match(/data-mobile-menu-category-toggle/g) || []).length
    expect(toggleCount).toBe(2)
  })

  it('T-34 : les categories ont des panneaux avec role="region"', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('data-mobile-menu-category-panel')
  })

  it('T-35 : les labels de categorie sont affiches', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('A - Templates')
    expect(html).toContain('B - Roles')
  })

  it('T-36 : les fiches enfants sont rendues', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('A1 - PRD')
    expect(html).toContain('A2 - Architecture')
    expect(html).toContain('B1 - Product Manager')
  })

  it('T-37 : les fiches ont les bons hrefs', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('href="/annexes/templates/prd"')
    expect(html).toContain('href="/annexes/templates/architecture"')
    expect(html).toContain('href="/annexes/roles/product-manager"')
  })

  it('T-38 : la categorie active est depliee quand l\'URL correspond', async () => {
    const html = await renderMobileMenu({}, '/annexes/templates/prd')
    // Le bouton de la categorie A doit avoir aria-expanded="true"
    expect(html).toMatch(/data-mobile-menu-category="annexes-a-templates"[\s\S]*?aria-expanded="true"/)
  })

  it('T-39 : les categories inactives sont repliees', async () => {
    const html = await renderMobileMenu({}, '/annexes/templates/prd')
    // Le panneau B doit avoir la classe hidden
    expect(html).toMatch(/id="mobile-menu-category-annexes-b-roles-panel"[^>]*class="[^"]*hidden/)
  })

  it('T-40 : les chevrons de categorie sont presents', async () => {
    const html = await renderMobileMenu()
    const chevronCount = (html.match(/data-mobile-menu-category-chevron/g) || []).length
    expect(chevronCount).toBe(2)
  })
})

// ── Tests responsive ─────────────────────────────────
describe('MobileMenu — Responsive', () => {
  it('T-41 : le conteneur racine a la classe lg:hidden', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('lg:hidden')
  })

  it('T-42 : l\'overlay a z-50 pour etre au-dessus du contenu', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('z-50')
  })

  it('T-43 : le panneau a max-w-sm', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('max-w-sm')
  })
})

// ── Tests lien accueil ───────────────────────────────
describe('MobileMenu — Lien accueil', () => {
  it('T-44 : le lien accueil est present avec data-mobile-menu-home', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('data-mobile-menu-home')
  })

  it('T-45 : le lien accueil pointe vers "/"', async () => {
    const html = await renderMobileMenu()
    // Trouver le lien avec data-mobile-menu-home et verifier le href
    expect(html).toMatch(/data-mobile-menu-home[^>]*href="\/"/)
  })

  it('T-46 : le lien accueil contient le texte "Accueil"', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('Accueil')
  })
})

// ── Tests IDs et ARIA ────────────────────────────────
describe('MobileMenu — IDs et ARIA', () => {
  it('T-47 : IDs generes automatiquement a partir de l\'id par defaut', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('id="mobile-menu"')
    expect(html).toContain('id="mobile-menu-toggle"')
    expect(html).toContain('id="mobile-menu-panel"')
    expect(html).toContain('id="mobile-menu-close"')
  })

  it('T-48 : IDs personnalises quand id est fourni', async () => {
    const html = await renderMobileMenu({ id: 'custom-menu' })
    expect(html).toContain('id="custom-menu"')
    expect(html).toContain('id="custom-menu-toggle"')
    expect(html).toContain('id="custom-menu-panel"')
  })
})

// ── Tests styles ─────────────────────────────────────
describe('MobileMenu — Styles', () => {
  it('T-49 : le bouton hamburger a un focus ring', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('focus:ring-2')
    expect(html).toContain('focus:ring-blue-500')
    expect(html).toContain('focus:ring-offset-2')
  })

  it('T-50 : le panneau a shadow-xl', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('shadow-xl')
  })
})

// ── Tests classes et attributs ───────────────────────
describe('MobileMenu — Classes et attributs', () => {
  it('T-51 : classe personnalisee ajoutee au conteneur', async () => {
    const html = await renderMobileMenu({ class: 'ml-2' })
    expect(html).toContain('ml-2')
  })

  it('T-52 : le backdrop a aria-hidden="true"', async () => {
    const html = await renderMobileMenu()
    expect(html).toMatch(/data-mobile-menu-backdrop[^>]*aria-hidden="true"/)
  })
})

// ── Tests tri des items ──────────────────────────────
describe('MobileMenu — Tri des items', () => {
  it('T-53 : les items Framework sont tries par order', async () => {
    const html = await renderMobileMenu()
    const preambuleIndex = html.indexOf('Preambule')
    const visionIndex = html.indexOf('Vision')
    expect(preambuleIndex).toBeLessThan(visionIndex)
  })

  it('T-54 : les fiches Annexes sont triees par order dans les categories', async () => {
    const html = await renderMobileMenu()
    const a1Index = html.indexOf('A1 - PRD')
    const a2Index = html.indexOf('A2 - Architecture')
    expect(a1Index).toBeLessThan(a2Index)
  })
})

// ── Tests XSS ────────────────────────────────────────
describe('MobileMenu — Protection XSS', () => {
  it('T-55 : label avec HTML est echappe', async () => {
    const xssTree: NavigationTree = {
      framework: [{ id: 'xss', label: '<script>alert("xss")</script>', href: '/test', order: 1 }],
      modeOperatoire: [],
      annexes: [],
    }
    const html = await renderMobileMenu({ tree: xssTree })
    expect(html).not.toContain('<script>alert')
    expect(html).toContain('&lt;script&gt;')
  })
})

// ── Tests script client ──────────────────────────────
describe('MobileMenu — Script client', () => {
  it('T-56 : un <script> est present dans le rendu', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('<script>')
  })

  it('T-57 : le script reference data-mobile-menu pour l\'initialisation', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('[data-mobile-menu]')
  })

  it('T-58 : le script gere Escape', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('Escape')
  })

  it('T-59 : le script gere le focus trap (Tab)', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('Tab')
    expect(html).toContain('shiftKey')
  })

  it('T-60 : le script gere le verrouillage du scroll', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('overflow')
    expect(html).toContain('hidden')
  })
})

// ── Tests arbre vide ─────────────────────────────────
describe('MobileMenu — Arbre vide', () => {
  it('T-61 : rend le bouton hamburger meme avec un arbre vide', async () => {
    const html = await renderMobileMenu({ tree: EMPTY_TREE })
    expect(html).toContain('data-mobile-menu-toggle')
  })

  it('T-62 : le lien accueil est toujours present avec un arbre vide', async () => {
    const html = await renderMobileMenu({ tree: EMPTY_TREE })
    expect(html).toContain('data-mobile-menu-home')
  })
})
```

### 8.3 Matrice de couverture

| ID | Test | Type | Assertion | Priorite |
|----|------|------|-----------|----------|
| T-01 | Conteneur `data-mobile-menu` | Unit | `toContain(...)` | Haute |
| T-02 | Bouton hamburger `data-mobile-menu-toggle` | Unit | `toContain(...)` | Haute |
| T-03 | `aria-expanded="false"` par defaut | Unit | `toContain(...)` | Haute |
| T-04 | `aria-controls` vers le panneau | Unit | `toContain(...)` | Haute |
| T-05 | `aria-label="Menu de navigation"` | Unit | `toContain(...)` | Haute |
| T-06 | `role="dialog" aria-modal="true"` | Unit | `toContain(...)` | Haute |
| T-07 | `aria-label="Navigation principale"` | Unit | `toContain(...)` | Haute |
| T-08 | Panneau masque par defaut | Unit | `toMatch(...)` | Haute |
| T-09 | Bouton fermer avec `aria-label` | Unit | `toContain(...)` | Haute |
| T-10 | Backdrop `bg-black/50` | Unit | `toContain(...)` | Haute |
| T-11 | Icone hamburger presente | Unit | `toContain(path)` | Haute |
| T-12 | Icone croix presente | Unit | `toContain(path)` | Haute |
| T-13 | Icone croix masquee par defaut | Unit | `toMatch(...)` | Haute |
| T-14 | Icones `aria-hidden="true"` | Unit | chaque SVG a `aria-hidden` | Haute |
| T-15 | 3 sections rendues | Unit | `toContain(...)` x3 | Haute |
| T-16 | Boutons toggle section | Unit | count == 3 | Haute |
| T-17 | Panneaux section `role="region"` | Unit | count == 3 | Haute |
| T-18 | `aria-controls` des sections | Unit | `toContain(...)` x3 | Haute |
| T-19 | `aria-labelledby` des panneaux | Unit | `toContain(...)` | Haute |
| T-20 | Labels des sections | Unit | `toContain(...)` x3 | Haute |
| T-21 | Chevrons des sections | Unit | count == 3 | Moyenne |
| T-22 | Separateurs entre sections | Unit | count == 2 | Moyenne |
| T-23 | Section active depliee (Framework) | Unit | `aria-expanded="true"` | Haute |
| T-24 | Autres sections repliees | Unit | `aria-expanded="false"` | Haute |
| T-25 | Section active (Mode Operatoire) | Unit | `aria-expanded="true"` | Haute |
| T-26 | Toutes repliees sur accueil | Unit | `aria-expanded="false"` x3 | Haute |
| T-27 | Chevron tourne section active | Unit | `rotate-180` | Moyenne |
| T-28 | Items Framework rendus | Unit | `toContain(href)` | Haute |
| T-29 | `data-navlink` present | Unit | `toContain(...)` | Haute |
| T-30 | Badge affiche | Unit | `toContain('Essentiel')` | Haute |
| T-31 | Items Mode Operatoire rendus | Unit | `toContain(href)` | Haute |
| T-32 | Categories Annexes rendues | Unit | `toContain(data-attr)` | Haute |
| T-33 | Boutons toggle categorie | Unit | count == 2 | Haute |
| T-34 | Panneaux categorie `role="region"` | Unit | `toContain(...)` | Haute |
| T-35 | Labels categories | Unit | `toContain(...)` | Haute |
| T-36 | Fiches enfants rendues | Unit | `toContain(...)` | Haute |
| T-37 | Hrefs fiches corrects | Unit | `toContain(href)` | Haute |
| T-38 | Categorie active depliee | Unit | `aria-expanded="true"` | Haute |
| T-39 | Categories inactives repliees | Unit | `hidden` | Haute |
| T-40 | Chevrons categorie | Unit | count == 2 | Moyenne |
| T-41 | `lg:hidden` sur le conteneur | Unit | `toContain(...)` | Haute |
| T-42 | `z-50` sur l'overlay | Unit | `toContain(...)` | Haute |
| T-43 | `max-w-sm` sur le panneau | Unit | `toContain(...)` | Moyenne |
| T-44 | Lien accueil present | Unit | `toContain(...)` | Haute |
| T-45 | Lien accueil href="/" | Unit | `toMatch(...)` | Haute |
| T-46 | Texte "Accueil" | Unit | `toContain(...)` | Haute |
| T-47 | IDs generes automatiquement | Unit | `toContain(ids)` | Haute |
| T-48 | IDs personnalises | Unit | `toContain(custom)` | Moyenne |
| T-49 | Focus ring sur le bouton | Unit | `toContain('focus:ring-2')` | Haute |
| T-50 | `shadow-xl` sur le panneau | Unit | `toContain(...)` | Moyenne |
| T-51 | Classe personnalisee | Unit | `toContain('ml-2')` | Moyenne |
| T-52 | Backdrop `aria-hidden="true"` | Unit | `toMatch(...)` | Haute |
| T-53 | Tri items Framework | Unit | positions relatives | Haute |
| T-54 | Tri fiches Annexes | Unit | positions relatives | Haute |
| T-55 | XSS echappe | Unit | `not.toContain('<script>')` | Haute |
| T-56 | Script client present | Unit | `toContain('<script>')` | Haute |
| T-57 | Script reference `data-mobile-menu` | Unit | `toContain(...)` | Haute |
| T-58 | Script gere Escape | Unit | `toContain('Escape')` | Haute |
| T-59 | Script gere focus trap | Unit | `toContain('Tab')` | Haute |
| T-60 | Script gere scroll lock | Unit | `toContain('overflow')` | Haute |
| T-61 | Bouton avec arbre vide | Unit | bouton present | Basse |
| T-62 | Lien accueil avec arbre vide | Unit | lien present | Basse |

---

## 9. Criteres d'acceptation

| ID | Critere | Verifie par |
|----|---------|-------------|
| CA-01 | Le fichier `src/components/layout/MobileMenu.astro` est cree | Verification fichier |
| CA-02 | Le composant rend un `<button>` hamburger avec `aria-expanded`, `aria-controls`, `aria-label` | T-02, T-03, T-04, T-05 |
| CA-03 | Le panneau overlay a `role="dialog" aria-modal="true" aria-label="Navigation principale"` | T-06, T-07 |
| CA-04 | Le panneau est masque par defaut (`hidden`) | T-08 |
| CA-05 | Le bouton fermer [X] est present avec `aria-label="Fermer le menu"` | T-09 |
| CA-06 | Le backdrop cliquable est present | T-10 |
| CA-07 | L'icone hamburger (3 barres) est visible quand le menu est ferme | T-11 |
| CA-08 | L'icone croix (X) est masquee par defaut, visible quand le menu est ouvert | T-12, T-13 |
| CA-09 | Les 3 sections (Framework, Mode Operatoire, Annexes) sont rendues en accordeon | T-15, T-16, T-17, T-20 |
| CA-10 | Les sections ont `aria-expanded`, `aria-controls`, `role="region"`, `aria-labelledby` | T-18, T-19 |
| CA-11 | La section correspondant a l'URL courante est depliee par defaut | T-23, T-24, T-25 |
| CA-12 | Les items sont rendus via NavLink en variante `mobile` | T-28, T-29, T-30, T-31 |
| CA-13 | Les Annexes ont un sous-accordeon avec categories depliables et fiches enfants | T-32, T-33, T-34, T-36 |
| CA-14 | La categorie correspondant a l'URL courante est depliee par defaut | T-38, T-39 |
| CA-15 | Le composant est masque en desktop (`lg:hidden`) | T-41 |
| CA-16 | Le lien "Accueil" est present en bas du panneau | T-44, T-45, T-46 |
| CA-17 | Les items sont tries par `order` | T-53, T-54 |
| CA-18 | Focus ring visible sur tous les elements interactifs | T-49 |
| CA-19 | Contrastes WCAG AA respectes pour tous les etats | Verification manuelle section 5.2 |
| CA-20 | Protection XSS par echappement Astro | T-55 |
| CA-21 | Script client : toggle overlay, scroll lock, focus trap, Escape, backdrop click | T-56, T-57, T-58, T-59, T-60 |
| CA-22 | Script client : accordeon sections exclusif + sous-accordeon categories exclusif | T-56, T-57 |
| CA-23 | IDs generes automatiquement ou personnalises via prop `id` | T-47, T-48 |
| CA-24 | Classes personnalisees supportees via prop `class` | T-51 |
| CA-25 | Data attributes pour les selecteurs | T-01, T-02, T-10, T-52 |
| CA-26 | TypeScript compile sans erreur (`pnpm typecheck`) | CI |
| CA-27 | ESLint passe sans warning (`pnpm lint`) | CI |
| CA-28 | Les 62 tests unitaires passent | CI |

---

## 10. Definition of Done

- [ ] Fichier `src/components/layout/MobileMenu.astro` cree
- [ ] Interface TypeScript `Props` complete avec documentation JSDoc
- [ ] Import des types `NavigationItem`, `NavigationTree` depuis T-004-B1
- [ ] Import du composant `NavLink` depuis T-004-F2 (variante `mobile`)
- [ ] Import de `NAVIGATION_TREE` depuis T-004-B3
- [ ] Bouton hamburger `<button>` avec `aria-expanded`, `aria-controls`, `aria-label`
- [ ] Icone hamburger (3 barres) et icone croix (X) avec swap
- [ ] Overlay `<div role="dialog" aria-modal="true">` masque par defaut
- [ ] Backdrop cliquable `bg-black/50` avec `aria-hidden="true"`
- [ ] Panneau de navigation `max-w-sm` glissant depuis la droite
- [ ] En-tete du panneau avec titre "Navigation" et bouton fermer [X]
- [ ] 3 sections accordeon (Framework, Mode Operatoire, Annexes) avec `aria-expanded`, `aria-controls`, `role="region"`
- [ ] Accordeon exclusif : une seule section ouverte a la fois
- [ ] Sous-accordeon pour les categories d'Annexes avec `aria-expanded`, `aria-controls`, `role="region"`
- [ ] Sous-accordeon exclusif : une seule categorie ouverte a la fois
- [ ] Items rendus via NavLink en variante `mobile` avec badges
- [ ] Section active depliee automatiquement en fonction de l'URL courante
- [ ] Categorie active depliee automatiquement en fonction de l'URL courante
- [ ] Items tries par `order`
- [ ] Lien "Accueil" avec icone maison en bas du panneau
- [ ] Separateurs entre les sections
- [ ] Masque en desktop (`lg:hidden`)
- [ ] IDs generes automatiquement (`mobile-menu-*`) ou personnalises via prop `id`
- [ ] Data attributes complets (19 selecteurs)
- [ ] Script client : toggle ouverture/fermeture overlay
- [ ] Script client : swap icone hamburger/croix
- [ ] Script client : accordeon sections (exclusif)
- [ ] Script client : sous-accordeon categories (exclusif)
- [ ] Script client : fermeture au clic backdrop
- [ ] Script client : fermeture a la touche Escape
- [ ] Script client : focus trap (Tab / Shift+Tab)
- [ ] Script client : verrouillage du scroll body (`overflow: hidden`)
- [ ] Focus ring coherent avec le design system
- [ ] Contrastes WCAG AA
- [ ] Tests unitaires passants (62 tests)
- [ ] 0 erreur TypeScript (`pnpm typecheck`)
- [ ] 0 erreur ESLint (`pnpm lint`)
- [ ] Code formate avec Prettier

---

## 11. Notes d'implementation

### 11.1 Ordre d'implementation recommande

1. Creer le fichier `src/components/layout/MobileMenu.astro` avec l'interface Props
2. Implementer le bouton hamburger avec les attributs ARIA et les deux icones SVG
3. Implementer l'overlay masque par defaut avec le backdrop
4. Implementer le panneau avec l'en-tete (titre + bouton fermer)
5. Implementer les 3 sections accordeon (Framework, Mode Operatoire) avec les NavLink en variante `mobile`
6. Implementer la section Annexes avec le sous-accordeon (categories + fiches)
7. Implementer la detection de section/categorie active et le deplier automatique
8. Ajouter le lien "Accueil" en bas du panneau
9. Ajouter les IDs generes, les data attributes et les separateurs
10. Implementer le script client : toggle ouverture/fermeture
11. Ajouter le swap icone hamburger/croix
12. Ajouter le verrouillage du scroll body
13. Implementer l'accordeon exclusif (sections)
14. Implementer le sous-accordeon exclusif (categories)
15. Ajouter la fermeture au clic backdrop et a la touche Escape
16. Implementer le focus trap (Tab / Shift+Tab)
17. Verifier avec `pnpm typecheck` et `pnpm lint`
18. Ecrire les tests unitaires

### 11.2 Points d'attention

| Point | Detail |
|-------|--------|
| **Script Astro inline** | Le script est dans le composant Astro (`<script>` tag) et non un island React/Svelte. Astro deduplique automatiquement les `<script>` quand le composant est utilise plusieurs fois. |
| **Gestion multi-instance** | Le script s'initialise sur tous les `[data-mobile-menu]` de la page. En pratique, il n'y aura qu'une seule instance dans le Header. |
| **Focus trap robuste** | La liste des elements focusables doit etre recalculee dynamiquement car l'accordeon montre/masque des elements. Utiliser `getFocusableElements()` a chaque Tab plutot qu'une liste statique. |
| **Elements masques dans le focus trap** | Les elements dans des sections `.hidden` ne doivent pas etre focusables. Le `filter` exclut les elements dans les conteneurs caches. |
| **Scroll lock et multiple overlays** | Si d'autres modals coexistent sur la page, le scroll lock doit etre gere globalement (pas de restauration prematuree). Pour le MVP, un seul modal a la fois est attendu. |
| **NavLink `variant="mobile"`** | La variante `mobile` de NavLink est deja implementee (T-004-F2) avec `px-4 py-3 text-base`. Les zones de clic font >= 48px de hauteur, conforme aux recommandations Mobile Touch Target. |
| **Accordeon exclusif** | Quand une section s'ouvre, les autres se ferment. Cela evite un panneau trop long sur mobile. Le sous-accordeon des Annexes suit la meme logique. |
| **`Object.freeze` sur `NAVIGATION_TREE`** | L'arbre est gele. Le `[...items].sort()` cree une copie avant le tri pour eviter toute mutation. |
| **Section vs as const** | Le type `section.key` est infere comme `string` a cause du mapping. Le cast `as any` pour la prop `section` est un compromis acceptable ou utiliser un type assertion explicite. |
| **Body inert (hors scope)** | Idealement, le body content devrait avoir l'attribut `inert` quand le modal est ouvert pour empecher les interactions. Cela sera gere au niveau du DocsLayout (T-004-F10) ou du Header (T-004-F4). |
| **Redimensionnement fenetre** | Si l'utilisateur redimensionne la fenetre de mobile a desktop avec le menu ouvert, le `lg:hidden` sur le conteneur parent masque tout. Le scroll lock reste actif. Mitigation : ajouter un listener `resize` dans le script pour fermer le menu au passage a desktop. |
| **Panneau depuis la droite** | Le panneau glisse depuis la droite (`right-0`) pour suivre la convention mobile standard et la position du bouton hamburger (a droite du header). |

### 11.3 Extensions futures (hors scope)

| Extension | Description | User Story |
|-----------|-------------|------------|
| Animation de slide | Transition CSS `transform: translateX()` a l'ouverture/fermeture du panneau | Non definie |
| Gesture swipe | Fermer le menu par un swipe a droite (tactile) | Non definie |
| Recherche dans le menu | Champ de recherche/filtre en haut du panneau mobile | Non definie |
| Mode sombre | Variantes de couleurs pour le dark mode | Non definie |
| Indicateur de progression | Barre de progression de lecture dans le menu | Non definie |
| Body `inert` | Attribut `inert` sur le contenu derriere l'overlay | T-004-F10 (DocsLayout) |

---

## 12. References

| Ressource | Lien |
|-----------|------|
| US-004 Spec | [spec-US-004.md](./spec-US-004.md) |
| Architecture | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| T-004-B1 Types navigation | [T-004-B1-types-typescript-navigation.md](./T-004-B1-types-typescript-navigation.md) |
| T-004-B3 Configuration navigation | [T-004-B3-configuration-navigation.md](./T-004-B3-configuration-navigation.md) |
| T-004-F2 NavLink | [T-004-F2-composant-NavLink.md](./T-004-F2-composant-NavLink.md) |
| T-004-F3 DropdownMenu | [T-004-F3-composant-DropdownMenu.md](./T-004-F3-composant-DropdownMenu.md) |
| T-004-F4 Header | [T-004-F4-composant-Header.md](./T-004-F4-composant-Header.md) |
| T-004-F10 DocsLayout | [T-004-F10-layout-DocsLayout.md](./T-004-F10-layout-DocsLayout.md) |
| WAI-ARIA Dialog (Modal) | https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ |
| WAI-ARIA Accordion | https://www.w3.org/WAI/ARIA/apg/patterns/accordion/ |
| RGAA 7.1 Scripts | https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#7.1 |
| RGAA 12.2 Navigation | https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#12.2 |
| RGAA 12.13 Clavier | https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#12.13 |
| Mobile Touch Target | https://www.w3.org/WAI/WCAG21/Understanding/target-size.html |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 12/02/2026 | Creation initiale — hamburger + overlay plein ecran, accordeon 3 sections + sous-accordeon Annexes, focus trap, scroll lock, enhancement progressif, 30 cas limites, 62 tests unitaires, 28 criteres d'acceptation |
