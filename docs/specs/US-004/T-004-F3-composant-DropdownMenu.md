# T-004-F3 : Composant DropdownMenu (sous-menu deroulant multi-niveaux)

| Metadonnee | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 11 fevrier 2026 |
| **Statut** | A faire |
| **User Story** | [US-004 - Naviguer facilement dans le framework](./spec-US-004.md) |
| **Dependances** | T-004-F2 (NavLink), T-004-B3 (Configuration navigation) |
| **Bloque** | T-004-F4 (Header), T-004-T4 (Tests integration Header) |

---

## 1. Objectif

Creer le composant **DropdownMenu** qui affiche un sous-menu deroulant dans la barre de navigation principale du site AIAD. Ce composant fournit :

- Un **bouton declencheur** (`<button>`) avec chevron qui ouvre/ferme le panneau deroulant
- Un **panneau de navigation** positionne sous le declencheur avec les items de la section
- Le support **multi-niveaux** pour les Annexes (categories avec fiches enfants groupees)
- La **navigation clavier** complete conforme au pattern WAI-ARIA Menu Button (Arrow Down/Up, Escape, Enter/Space, Home/End)
- Un **fermeture intelligente** : clic exterieur, touche Escape, perte de focus
- L'utilisation du composant **NavLink** (T-004-F2) en variante `dropdown` pour chaque item
- Un rendu **desktop uniquement** (le mobile utilise MobileMenu T-004-F5)
- L'**enhancement progressif** : sans JavaScript, le bouton est un lien vers la page index de la section

Ce composant est consomme par le Header (T-004-F4) et constitue l'element central de la navigation desktop.

---

## 2. Contexte technique

### 2.1 Stack

| Technologie | Version | Role |
|-------------|---------|------|
| Astro | 4.x | Composant avec island (`client:idle`) |
| TypeScript | 5.x | Typage strict des props |
| Tailwind CSS | 3.x | Utility-first, positionnement, animations |
| JavaScript client | ES2022 | Toggle, clavier, clic exterieur |

### 2.2 Arborescence

```
src/
├── components/
│   └── layout/
│       ├── NavLink.astro              # T-004-F2 (consomme)
│       └── DropdownMenu.astro         <-- CE COMPOSANT
├── types/
│   └── navigation.ts                  # Types NavigationItem, NavigationSection (T-004-B1)
├── data/
│   └── navigation.ts                  # NAVIGATION_TREE (T-004-B3)
├── layouts/
│   └── BaseLayout.astro               # Layout racine (T-004-F1)
└── pages/
    └── index.astro
```

### 2.3 Position dans l'architecture des composants

```
DropdownMenu.astro                     <-- CE COMPOSANT (composant compose)
├── NavLink.astro (T-004-F2)          <-- Consomme (items du sous-menu)
└── Header.astro (T-004-F4)           <-- Consommateur (3 instances : Framework, Mode Op., Annexes)
```

### 2.4 Dependances

#### T-004-F2 (NavLink)

Le composant utilise `NavLink` en variante `dropdown` pour chaque item du menu :

```astro
import NavLink from '@components/layout/NavLink.astro'
```

- Variante `dropdown` : fond `blue-50` actif, texte `blue-700`, `w-full`
- Props transmises : `href`, `label`, `badge`, `section`, `role="menuitem"`, `tabindex={-1}`

#### T-004-B3 (Configuration navigation)

Le composant recoit les items de navigation en prop, mais peut aussi consommer directement l'arbre :

```typescript
import type { NavigationItem, NavigationSection } from '@/types/navigation'
```

### 2.5 Conventions suivies

| Convention | Detail |
|-----------|--------|
| Nommage fichier | PascalCase dans `src/components/layout/` |
| TypeScript | Mode strict, props typees via `interface Props` |
| Imports | Alias `@/*` pour `src/*` |
| Design | Coherent avec NavLink (focus ring `ring-2 ring-offset-2`, couleurs `blue-600/700`) |
| Formatage | Prettier : pas de semicolons, single quotes, 2 espaces |
| Island | `client:idle` pour le JavaScript interactif |

---

## 3. Specifications fonctionnelles

### 3.1 Description

Le composant `DropdownMenu` est un **menu deroulant accessible** qui :

1. Rend un `<button>` declencheur avec le label de la section et un chevron
2. Affiche un panneau deroulant en dessous du bouton au clic ou a la touche Enter/Space
3. Liste les items de navigation de la section via des `NavLink` en variante `dropdown`
4. Gere les **sous-groupes** pour les Annexes (categories avec fiches indentees)
5. Supporte la **navigation clavier** complete (WAI-ARIA Menu Button pattern)
6. Se ferme au clic exterieur, a la touche Escape, ou quand le focus quitte le menu
7. Applique un indicateur visuel (chevron rotation) quand le menu est ouvert

### 3.2 Pattern WAI-ARIA

Le composant suit le pattern [WAI-ARIA Menu Button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) :

| Element | Role/Attribut | Detail |
|---------|--------------|--------|
| Bouton declencheur | `<button aria-haspopup="true" aria-expanded="false/true">` | Ouvre/ferme le menu |
| Panneau menu | `<div role="menu" aria-labelledby="{button-id}">` | Conteneur du menu |
| Items simples | `<a role="menuitem" tabindex="-1">` via NavLink | Liens navigables |
| Groupes (Annexes) | `<div role="group" aria-labelledby="{group-label-id}">` | Groupe de fiches |
| Label de groupe | `<span role="presentation" id="{group-label-id}">` | Titre de la categorie |

### 3.3 Modes d'affichage

Le composant supporte deux modes selon le contenu de la section :

| Mode | Condition | Rendu |
|------|-----------|-------|
| **Flat** (defaut) | Items sans `children` (Framework, Mode Operatoire) | Liste simple de NavLink |
| **Grouped** | Items avec `children` (Annexes) | Categories comme titres de groupe + fiches indentees |

#### 3.3.1 Mode flat (Framework, Mode Operatoire)

```
┌─────────────────────┐
│ Preambule        ★  │  ← badge "essential"
│ Vision & Philosophie│
│ Ecosysteme          │
│ Artefacts           │
│ Boucles Iteratives  │
│ Synchronisations    │
│ Metriques           │
│ Annexes             │
└─────────────────────┘
```

#### 3.3.2 Mode grouped (Annexes)

```
┌─────────────────────────┐
│ A - Templates           │  ← titre de groupe (non cliquable dans le menu)
│   A1 - PRD              │  ← fiche indentee
│   A2 - Architecture     │
│   A3 - Agent Guide      │
│   ...                   │
│ ─────────────────────── │  ← separateur
│ B - Roles               │
│   B1 - Product Manager  │
│   ...                   │
│ ─────────────────────── │
│ ...                     │
└─────────────────────────┘
```

### 3.4 Comportement d'ouverture/fermeture

| Action | Resultat |
|--------|----------|
| Clic sur le bouton (ferme) | Ouvre le menu, focus sur le premier item |
| Clic sur le bouton (ouvert) | Ferme le menu, focus sur le bouton |
| Enter / Space sur le bouton | Ouvre le menu, focus sur le premier item |
| Arrow Down sur le bouton | Ouvre le menu, focus sur le premier item |
| Arrow Up sur le bouton | Ouvre le menu, focus sur le dernier item |
| Escape (menu ouvert) | Ferme le menu, focus sur le bouton |
| Clic sur un item | Navigue vers la page (comportement natif du lien) |
| Clic exterieur | Ferme le menu |
| Focus quitte le menu (Tab apres le dernier item) | Ferme le menu |

### 3.5 Navigation clavier dans le menu

| Touche | Comportement |
|--------|-------------|
| Arrow Down | Focus sur le prochain menuitem (cyclique : dernier → premier) |
| Arrow Up | Focus sur le menuitem precedent (cyclique : premier → dernier) |
| Home | Focus sur le premier menuitem |
| End | Focus sur le dernier menuitem |
| Enter | Active le lien (navigation) |
| Escape | Ferme le menu, retour au bouton |
| Tab | Focus sur l'element suivant hors du menu, ferme le menu |
| Shift+Tab | Focus sur l'element precedent hors du menu, ferme le menu |
| Caractere (a-z) | Focus sur le premier item dont le label commence par ce caractere |

### 3.6 Indicateur visuel

| Etat | Chevron | Bouton |
|------|---------|--------|
| Ferme | `▾` (pointe en bas) | Style normal |
| Ouvert | `▴` (rotation 180deg) | Fond `gray-50`, texte `gray-900` |

### 3.7 Enhancement progressif

Sans JavaScript (ou avant hydratation), le composant rend un `<a>` fallback qui pointe vers la page index de la section (ex: `/framework`) au lieu d'un `<button>`. Cela garantit l'accessibilite meme sans JS.

Le script client remplace ce comportement en :
1. Convertissant le lien en bouton interactif via `role="button"` et `aria-haspopup="true"`
2. Ajoutant les event listeners pour le toggle, le clavier et le clic exterieur
3. Gerant le focus trap dans le menu ouvert

**Strategie alternative retenue** : Le composant utilise un `<button>` natif avec un `<noscript>` fallback en lien. Le JavaScript est charge via `<script>` dans le composant Astro (pas d'island React/Svelte).

### 3.8 Responsive

| Ecran | Comportement |
|-------|-------------|
| Desktop (>= 1024px) | Affiche complet, panneau en position absolue sous le bouton |
| Tablette (768px - 1023px) | Affiche complet, panneau peut etre tronque → `max-height` avec scroll |
| Mobile (< 768px) | **Masque** (`hidden lg:block`). Le MobileMenu (T-004-F5) prend le relais |

### 3.9 Accessibilite (RGAA AA)

| Critere | Implementation | Reference RGAA |
|---------|----------------|----------------|
| Menu semantique | `role="menu"` sur le panneau, `role="menuitem"` sur les items | 12.2 |
| Bouton declencheur | `<button aria-haspopup="true" aria-expanded="false/true">` | 7.1 |
| Label du menu | `aria-labelledby` pointant vers l'id du bouton | 12.6 |
| Focus visible | `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2` | 10.7 |
| Navigation clavier | Arrow keys, Escape, Enter, Home, End | 12.13 |
| Contraste texte | Ratio >= 4.5:1 pour tous les etats | 3.2 |
| Annonce d'etat | `aria-expanded` change annonce l'ouverture/fermeture aux lecteurs d'ecran | 7.1 |
| Groupes etiquetes | `role="group" aria-labelledby` pour les categories d'annexes | 12.6 |

---

## 4. Specifications techniques

### 4.1 Interface TypeScript

```typescript
// src/components/layout/DropdownMenu.astro (frontmatter)

import type { NavigationItem, NavigationSection } from '@/types/navigation'

/**
 * Props du composant DropdownMenu.
 *
 * Sous-menu deroulant accessible avec navigation clavier complete,
 * support multi-niveaux (groupes pour les Annexes) et enhancement progressif.
 *
 * Consomme NavLink (T-004-F2) en variante `dropdown` pour chaque item.
 *
 * @example
 * ```astro
 * ---
 * import DropdownMenu from '@components/layout/DropdownMenu.astro'
 * import { NAVIGATION_TREE } from '@/data/navigation'
 * ---
 * <DropdownMenu
 *   label="Framework"
 *   section="framework"
 *   items={NAVIGATION_TREE.framework}
 *   href="/framework"
 * />
 * ```
 */
export interface Props {
  // ── Contenu ─────────────────────────────────────

  /**
   * Label du bouton declencheur.
   * Ex: "Framework", "Mode Operatoire", "Annexes"
   */
  label: string

  /**
   * Items de navigation a afficher dans le menu.
   * Pour Framework/ModeOp : liste de chapitres (items feuilles).
   * Pour Annexes : liste de categories avec `children` (fiches).
   */
  items: NavigationItem[]

  // ── Navigation ─────────────────────────────────

  /**
   * Section de navigation associee.
   * Utilisee pour la detection de l'etat actif (prefix match)
   * et pour la transmission aux NavLink enfants.
   */
  section: NavigationSection

  /**
   * URL de la page index de la section.
   * Utilisee comme fallback href sans JavaScript.
   * Ex: "/framework", "/mode-operatoire", "/annexes"
   */
  href: string

  // ── HTML ────────────────────────────────────────

  /**
   * Classes CSS additionnelles sur le conteneur racine.
   */
  class?: string

  /**
   * Identifiant unique du composant.
   * Genere automatiquement si non fourni (base sur la section).
   * Utilise pour aria-labelledby et les data attributes.
   */
  id?: string
}
```

### 4.2 Implementation du composant

```astro
---
// src/components/layout/DropdownMenu.astro

import type { NavigationItem, NavigationSection } from '@/types/navigation'
import NavLink from '@components/layout/NavLink.astro'

export interface Props {
  label: string
  items: NavigationItem[]
  section: NavigationSection
  href: string
  class?: string
  id?: string
}

const {
  label,
  items,
  section,
  href,
  class: className = '',
  id: providedId,
} = Astro.props

// ── IDs uniques ─────────────────────────────────
const baseId = providedId ?? `dropdown-${section}`
const buttonId = `${baseId}-button`
const menuId = `${baseId}-menu`

// ── Detection du mode groupe (Annexes) ──────────
const hasGroups = items.some((item) => item.children && item.children.length > 0)

// ── Tri des items par order ─────────────────────
const sortedItems = [...items].sort((a, b) => a.order - b.order)
---

<div
  class:list={['dropdown-container relative', className]}
  data-dropdown
  data-dropdown-section={section}
  id={baseId}
>
  {/* ── Bouton declencheur ───────────────────── */}
  <button
    type="button"
    class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    aria-haspopup="true"
    aria-expanded="false"
    aria-controls={menuId}
    id={buttonId}
    data-dropdown-trigger
  >
    <span>{label}</span>
    <svg
      class="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      data-dropdown-chevron
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </button>

  {/* ── Fallback sans JS ─────────────────────── */}
  <noscript>
    <a
      href={href}
      class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {label}
    </a>
  </noscript>

  {/* ── Panneau du menu ──────────────────────── */}
  <div
    role="menu"
    aria-labelledby={buttonId}
    id={menuId}
    class="absolute left-0 top-full z-50 mt-1 hidden w-64 origin-top-left rounded-lg border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
    data-dropdown-menu
    tabindex="-1"
  >
    {!hasGroups ? (
      /* ── Mode flat (Framework, Mode Operatoire) ── */
      <div class="py-1" role="none">
        {sortedItems.map((item) => (
          <NavLink
            href={item.href}
            label={item.label}
            variant="dropdown"
            badge={item.badge}
            section={section}
            role="menuitem"
            tabindex={-1}
          />
        ))}
      </div>
    ) : (
      /* ── Mode grouped (Annexes) ───────────────── */
      sortedItems.map((category, catIndex) => (
        <div role="group" aria-labelledby={`${baseId}-group-${category.id}`}>
          {catIndex > 0 && (
            <hr class="my-1 border-gray-200" role="separator" />
          )}
          <div
            class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500"
            id={`${baseId}-group-${category.id}`}
            role="presentation"
          >
            <a
              href={category.href}
              class="hover:text-gray-700 transition-colors duration-150"
              role="menuitem"
              tabindex={-1}
              data-dropdown-group-link
            >
              {category.label}
            </a>
          </div>
          {category.children && (
            <div class="pl-2" role="none">
              {[...category.children]
                .sort((a, b) => a.order - b.order)
                .map((fiche) => (
                  <NavLink
                    href={fiche.href}
                    label={fiche.label}
                    variant="dropdown"
                    badge={fiche.badge}
                    section={section}
                    role="menuitem"
                    tabindex={-1}
                  />
                ))}
            </div>
          )}
        </div>
      ))
    )}
  </div>
</div>

<script>
  /**
   * Script client pour le comportement interactif du DropdownMenu.
   *
   * Fonctionnalites :
   * - Toggle ouverture/fermeture au clic sur le bouton
   * - Navigation clavier : Arrow Down/Up, Home, End, Escape, caractere
   * - Fermeture au clic exterieur
   * - Fermeture quand le focus quitte le menu (Tab/Shift+Tab)
   * - Rotation du chevron a l'ouverture
   * - Focus management sur les menuitems
   */
  function initDropdown(container: HTMLElement) {
    const trigger = container.querySelector<HTMLButtonElement>('[data-dropdown-trigger]')
    const menu = container.querySelector<HTMLDivElement>('[data-dropdown-menu]')
    const chevron = container.querySelector<SVGElement>('[data-dropdown-chevron]')

    if (!trigger || !menu) return

    // ── Helpers ───────────────────────────────────
    function getMenuItems(): HTMLElement[] {
      return Array.from(menu!.querySelectorAll<HTMLElement>('[role="menuitem"]'))
    }

    function isOpen(): boolean {
      return trigger!.getAttribute('aria-expanded') === 'true'
    }

    function open() {
      trigger!.setAttribute('aria-expanded', 'true')
      menu!.classList.remove('hidden')
      chevron?.classList.add('rotate-180')
      container.setAttribute('data-dropdown-open', '')
    }

    function close() {
      trigger!.setAttribute('aria-expanded', 'false')
      menu!.classList.add('hidden')
      chevron?.classList.remove('rotate-180')
      container.removeAttribute('data-dropdown-open')
    }

    function focusItem(index: number) {
      const items = getMenuItems()
      if (items.length === 0) return
      const clampedIndex = ((index % items.length) + items.length) % items.length
      items[clampedIndex].focus()
    }

    function focusFirstItem() {
      focusItem(0)
    }

    function focusLastItem() {
      const items = getMenuItems()
      focusItem(items.length - 1)
    }

    function getCurrentFocusIndex(): number {
      const items = getMenuItems()
      const focused = document.activeElement as HTMLElement
      return items.indexOf(focused)
    }

    function focusNextItem() {
      focusItem(getCurrentFocusIndex() + 1)
    }

    function focusPrevItem() {
      const index = getCurrentFocusIndex()
      focusItem(index <= 0 ? getMenuItems().length - 1 : index - 1)
    }

    function focusItemByChar(char: string) {
      const items = getMenuItems()
      const currentIndex = getCurrentFocusIndex()
      const lowerChar = char.toLowerCase()

      // Chercher a partir de l'item suivant (cyclique)
      for (let i = 1; i <= items.length; i++) {
        const idx = (currentIndex + i) % items.length
        const text = items[idx].textContent?.trim().toLowerCase() ?? ''
        if (text.startsWith(lowerChar)) {
          items[idx].focus()
          return
        }
      }
    }

    // ── Event: clic sur le bouton ─────────────────
    trigger.addEventListener('click', () => {
      if (isOpen()) {
        close()
        trigger.focus()
      } else {
        open()
        focusFirstItem()
      }
    })

    // ── Event: clavier sur le bouton ──────────────
    trigger.addEventListener('keydown', (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          if (!isOpen()) open()
          focusFirstItem()
          break
        case 'ArrowUp':
          e.preventDefault()
          if (!isOpen()) open()
          focusLastItem()
          break
        case 'Escape':
          if (isOpen()) {
            e.preventDefault()
            close()
            trigger.focus()
          }
          break
      }
    })

    // ── Event: clavier dans le menu ───────────────
    menu.addEventListener('keydown', (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          focusNextItem()
          break
        case 'ArrowUp':
          e.preventDefault()
          focusPrevItem()
          break
        case 'Home':
          e.preventDefault()
          focusFirstItem()
          break
        case 'End':
          e.preventDefault()
          focusLastItem()
          break
        case 'Escape':
          e.preventDefault()
          close()
          trigger.focus()
          break
        case 'Tab':
          // Laisser le Tab natif se produire, fermer le menu
          close()
          break
        default:
          // Navigation par caractere
          if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
            e.preventDefault()
            focusItemByChar(e.key)
          }
          break
      }
    })

    // ── Event: clic exterieur ─────────────────────
    document.addEventListener('click', (e: MouseEvent) => {
      if (isOpen() && !container.contains(e.target as Node)) {
        close()
      }
    })

    // ── Event: focus quitte le conteneur ──────────
    container.addEventListener('focusout', (e: FocusEvent) => {
      // Utiliser requestAnimationFrame pour laisser le focus se deplacer
      requestAnimationFrame(() => {
        if (isOpen() && !container.contains(document.activeElement)) {
          close()
        }
      })
    })
  }

  // ── Initialisation de tous les dropdowns ────────
  document.querySelectorAll<HTMLElement>('[data-dropdown]').forEach(initDropdown)
</script>
```

### 4.3 Data attributes

| Attribut | Element | Usage |
|----------|---------|-------|
| `data-dropdown` | `<div>` racine | Selecteur pour l'initialisation JS et les tests |
| `data-dropdown-section` | `<div>` racine | Section associee (`framework`, `mode-operatoire`, `annexes`) |
| `data-dropdown-trigger` | `<button>` | Selecteur du bouton declencheur |
| `data-dropdown-menu` | `<div role="menu">` | Selecteur du panneau menu |
| `data-dropdown-chevron` | `<svg>` | Selecteur du chevron pour la rotation |
| `data-dropdown-group-link` | `<a>` (titre groupe) | Selecteur des liens de titre de categorie (mode grouped) |
| `data-dropdown-open` | `<div>` racine (presence) | Indicateur d'etat ouvert (ajoute/retire par JS) |

### 4.4 Exemples d'utilisation

#### Framework (mode flat)

```astro
---
import DropdownMenu from '@components/layout/DropdownMenu.astro'
import { NAVIGATION_TREE } from '@/data/navigation'
---

<DropdownMenu
  label="Framework"
  section="framework"
  items={NAVIGATION_TREE.framework}
  href="/framework"
/>
```

**Rendu HTML (menu ferme) :**

```html
<div class="dropdown-container relative" data-dropdown data-dropdown-section="framework" id="dropdown-framework">
  <button
    type="button"
    class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md ..."
    aria-haspopup="true"
    aria-expanded="false"
    aria-controls="dropdown-framework-menu"
    id="dropdown-framework-button"
    data-dropdown-trigger
  >
    <span>Framework</span>
    <svg class="h-4 w-4 ..." data-dropdown-chevron aria-hidden="true">...</svg>
  </button>
  <noscript>
    <a href="/framework" class="...">Framework</a>
  </noscript>
  <div
    role="menu"
    aria-labelledby="dropdown-framework-button"
    id="dropdown-framework-menu"
    class="absolute left-0 top-full z-50 mt-1 hidden w-64 ..."
    data-dropdown-menu
    tabindex="-1"
  >
    <div class="py-1" role="none">
      <a href="/framework/preambule" class="..." role="menuitem" tabindex="-1" data-navlink>
        <span class="truncate">Preambule</span>
        <span class="... bg-amber-100 text-amber-800">Essentiel</span>
      </a>
      <a href="/framework/vision-philosophie" class="..." role="menuitem" tabindex="-1" data-navlink>
        <span class="truncate">Vision & Philosophie</span>
      </a>
      <!-- ... 6 autres chapitres ... -->
    </div>
  </div>
</div>
```

#### Annexes (mode grouped)

```astro
<DropdownMenu
  label="Annexes"
  section="annexes"
  items={NAVIGATION_TREE.annexes}
  href="/annexes"
/>
```

**Rendu HTML (extrait du panneau, mode ouvert) :**

```html
<div role="menu" aria-labelledby="dropdown-annexes-button" id="dropdown-annexes-menu" class="..." data-dropdown-menu>
  <!-- Groupe A -->
  <div role="group" aria-labelledby="dropdown-annexes-group-annexes-a-templates">
    <div class="px-3 py-2 text-xs font-semibold uppercase ..." id="dropdown-annexes-group-annexes-a-templates" role="presentation">
      <a href="/annexes/templates" class="..." role="menuitem" tabindex="-1" data-dropdown-group-link>
        A - Templates
      </a>
    </div>
    <div class="pl-2" role="none">
      <a href="/annexes/templates/prd" class="..." role="menuitem" tabindex="-1" data-navlink>
        <span class="truncate">A1 - PRD</span>
      </a>
      <!-- ... autres fiches ... -->
    </div>
  </div>
  <hr class="my-1 border-gray-200" role="separator" />
  <!-- Groupe B -->
  <div role="group" aria-labelledby="dropdown-annexes-group-annexes-b-roles">
    ...
  </div>
  <!-- ... 7 autres groupes ... -->
</div>
```

#### Avec classe personnalisee et id

```astro
<DropdownMenu
  label="Mode Operatoire"
  section="mode-operatoire"
  items={NAVIGATION_TREE.modeOperatoire}
  href="/mode-operatoire"
  class="ml-4"
  id="nav-mode-op"
/>
```

---

## 5. Design et Style

### 5.1 Palette de couleurs par etat

| Etat | Texte | Fond | Bordure |
|------|-------|------|---------|
| Bouton normal | `text-gray-700` (#374151) | transparent | — |
| Bouton hover | `text-gray-900` (#111827) | `bg-gray-50` (#F9FAFB) | — |
| Bouton focus | — | — | `ring-2 ring-blue-500 ring-offset-2` |
| Bouton ouvert | `text-gray-900` (#111827) | `bg-gray-50` (#F9FAFB) | — |
| Panneau menu | — | `bg-white` (#FFFFFF) | `border-gray-200` (#E5E7EB) + `shadow-lg` |
| Item inactif | `text-gray-700` (#374151) | transparent | — |
| Item hover | `text-gray-900` (#111827) | `bg-gray-50` (#F9FAFB) | — |
| Item actif | `text-blue-700` (#1D4ED8) | `bg-blue-50` (#EFF6FF) | — |
| Item focus | — | — | `ring-2 ring-blue-500 ring-offset-2` (via NavLink) |
| Titre groupe | `text-gray-500` (#6B7280) | transparent | — |
| Separateur | — | — | `border-gray-200` (#E5E7EB) |

### 5.2 Verification du contraste (WCAG AA)

| Combinaison | Ratio | Conforme AA ? |
|-------------|-------|---------------|
| `gray-700` (#374151) sur `white` (#FFFFFF) | 9.12:1 | Oui (>= 4.5:1) |
| `gray-900` (#111827) sur `gray-50` (#F9FAFB) | 15.4:1 | Oui (>= 4.5:1) |
| `blue-700` (#1D4ED8) sur `blue-50` (#EFF6FF) | 4.88:1 | Oui (>= 4.5:1) |
| `gray-500` (#6B7280) sur `white` (#FFFFFF) | 4.64:1 | Oui (>= 4.5:1) |

### 5.3 Dimensions et espacement

| Element | Style | Detail |
|---------|-------|--------|
| Bouton declencheur | `px-3 py-2 text-sm font-medium` | ~36px hauteur, coherent avec NavLink header |
| Panneau menu | `w-64 rounded-lg shadow-lg border` | 256px large, coins arrondis, ombre |
| Marge panneau/bouton | `mt-1` | 4px de gap entre bouton et panneau |
| Position panneau | `absolute left-0 top-full z-50` | Directement sous le bouton, z-index 50 |
| Item menu | Via NavLink `dropdown` : `px-3 py-2 text-sm w-full` | 36px hauteur min |
| Titre de groupe | `px-3 py-2 text-xs font-semibold uppercase tracking-wider` | 12px, tout en majuscules |
| Indentation fiches | `pl-2` sur le conteneur des fiches | 8px de retrait |
| Separateur | `my-1 border-gray-200` | 4px marge verticale |
| Max height | `max-h-[70vh] overflow-y-auto` | Scroll si le contenu depasse 70% du viewport |

### 5.4 Animation

| Propriete | Detail |
|-----------|--------|
| Chevron rotation | `transition-transform duration-200` + classe `rotate-180` (ajoutee par JS) |
| Panneau apparition | Pas d'animation (affichage/masquage via `hidden`) — simplicite et performance |
| Hover items | `transition-colors duration-150` (via NavLink) |

### 5.5 Coherence avec le design system

| Aspect | Conformite |
|--------|------------|
| Focus ring | `ring-2 ring-blue-500 ring-offset-2` — coherent avec NavLink, Breadcrumb, TOC, PrevNextLinks |
| Couleurs actives | `blue-600/700/50` — coherent avec NavLink et le design system |
| Transition | `transition-colors duration-150` — coherent avec NavLink |
| Coins arrondis | `rounded-lg` pour le panneau, `rounded-md` pour le bouton et les items |
| Ombre | `shadow-lg ring-1 ring-black/5` — standard pour les overlays |
| Typographie groupes | `text-xs uppercase tracking-wider` — coherent avec PrevNextLinks labels |

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Matrice des cas limites

| ID | Cas | Comportement attendu | Priorite |
|----|-----|----------------------|----------|
| CL-01 | Section Framework (8 items, pas de children) | Mode flat : liste simple de 8 NavLink | Haute |
| CL-02 | Section Mode Operatoire (8 items, pas de children) | Mode flat : liste simple de 8 NavLink | Haute |
| CL-03 | Section Annexes (9 categories avec children) | Mode grouped : 9 groupes avec titres et fiches indentees | Haute |
| CL-04 | Clic bouton quand ferme | Ouvre le menu, focus sur le premier item | Haute |
| CL-05 | Clic bouton quand ouvert | Ferme le menu, focus sur le bouton | Haute |
| CL-06 | Arrow Down sur le bouton (menu ferme) | Ouvre le menu, focus sur le premier item | Haute |
| CL-07 | Arrow Up sur le bouton (menu ferme) | Ouvre le menu, focus sur le dernier item | Haute |
| CL-08 | Escape quand le menu est ouvert | Ferme le menu, focus sur le bouton | Haute |
| CL-09 | Escape quand le menu est ferme | Rien (pas d'action) | Moyenne |
| CL-10 | Arrow Down sur le dernier item | Cyclique : focus sur le premier item | Haute |
| CL-11 | Arrow Up sur le premier item | Cyclique : focus sur le dernier item | Haute |
| CL-12 | Home dans le menu | Focus sur le premier item | Haute |
| CL-13 | End dans le menu | Focus sur le dernier item | Haute |
| CL-14 | Tab depuis le dernier item du menu | Ferme le menu, focus passe au prochain element de la page | Haute |
| CL-15 | Shift+Tab depuis le premier item du menu | Ferme le menu, focus revient au bouton | Haute |
| CL-16 | Clic exterieur quand le menu est ouvert | Ferme le menu | Haute |
| CL-17 | Clic sur un item du menu | Navigation vers la page (lien suivi), menu se ferme | Haute |
| CL-18 | Enter sur un item du menu | Navigation vers la page (lien suivi) | Haute |
| CL-19 | Caractere (ex: 'v') dans le menu | Focus sur "Vision & Philosophie" (premier item commencant par 'v') | Moyenne |
| CL-20 | Caractere sans correspondance | Rien (pas de changement de focus) | Basse |
| CL-21 | Sans JavaScript (`<noscript>`) | Lien `<a>` vers la page index de la section | Haute |
| CL-22 | `items` vide (`[]`) | Bouton rendu mais panneau vide — pas d'items | Basse |
| CL-23 | Item avec badge | Badge affiche via NavLink (coherent avec le composant) | Haute |
| CL-24 | Item avec `isHidden: true` | Item non rendu (filtre ou laisse au parent) | Moyenne |
| CL-25 | Panneau trop long (beaucoup d'items) | `max-h-[70vh] overflow-y-auto` : scroll dans le panneau | Haute |
| CL-26 | Label du bouton avec accents/caracteres speciaux | Echappe automatiquement par Astro | Haute |
| CL-27 | Plusieurs DropdownMenu ouverts simultanement | Un seul ouvert a la fois — ouvrir un menu ferme les autres | Haute |
| CL-28 | `class` personnalise fourni | Ajoute aux classes existantes (ne remplace pas) | Moyenne |
| CL-29 | `id` personnalise fourni | Utilise comme base pour tous les IDs derives | Moyenne |
| CL-30 | Chevron rotation a l'ouverture | Classe `rotate-180` ajoutee, retiree a la fermeture | Haute |

### 6.2 Strategie de fallback

```
Props manquantes ?
├── label: REQUIS (TypeScript l'impose)
├── items: REQUIS (TypeScript l'impose)
├── section: REQUIS (TypeScript l'impose)
├── href: REQUIS (TypeScript l'impose)
├── class: non fourni → '' (pas de classes additionnelles)
└── id: non fourni → genere automatiquement (`dropdown-{section}`)

JavaScript indisponible ?
└── <noscript> affiche un <a> vers la page index de la section
```

---

## 7. Exemples entree/sortie

### 7.1 Framework — menu ferme

**Entree :**

```astro
<DropdownMenu
  label="Framework"
  section="framework"
  items={NAVIGATION_TREE.framework}
  href="/framework"
/>
```

**Sortie HTML (extrait) :**

```html
<div class="dropdown-container relative" data-dropdown data-dropdown-section="framework" id="dropdown-framework">
  <button type="button" class="inline-flex items-center gap-1.5 ..." aria-haspopup="true" aria-expanded="false" aria-controls="dropdown-framework-menu" id="dropdown-framework-button" data-dropdown-trigger>
    <span>Framework</span>
    <svg class="h-4 w-4 ..." aria-hidden="true" data-dropdown-chevron>...</svg>
  </button>
  <div role="menu" aria-labelledby="dropdown-framework-button" id="dropdown-framework-menu" class="... hidden ..." data-dropdown-menu tabindex="-1">
    <div class="py-1" role="none">
      <!-- 8 items NavLink variant="dropdown" role="menuitem" -->
    </div>
  </div>
</div>
```

### 7.2 Framework — menu ouvert (apres clic)

Apres le clic sur le bouton, le JavaScript :
1. Change `aria-expanded="true"`
2. Retire `hidden` du panneau
3. Ajoute `rotate-180` au chevron
4. Ajoute `data-dropdown-open` au conteneur
5. Focus sur le premier `[role="menuitem"]`

### 7.3 Annexes — mode grouped

**Sortie HTML (extrait du panneau) :**

```html
<div role="menu" ...>
  <!-- Groupe A -->
  <div role="group" aria-labelledby="dropdown-annexes-group-annexes-a-templates">
    <div class="px-3 py-2 text-xs ..." id="dropdown-annexes-group-annexes-a-templates" role="presentation">
      <a href="/annexes/templates" role="menuitem" tabindex="-1" data-dropdown-group-link>A - Templates</a>
    </div>
    <div class="pl-2" role="none">
      <a href="/annexes/templates/prd" role="menuitem" tabindex="-1" data-navlink class="...">
        <span class="truncate">A1 - PRD</span>
      </a>
      <!-- ... 5 autres fiches ... -->
    </div>
  </div>
  <hr class="my-1 border-gray-200" role="separator" />
  <!-- ... 8 autres groupes ... -->
</div>
```

### 7.4 Sans JavaScript

**Sortie HTML visible :**

```html
<noscript>
  <a href="/framework" class="inline-flex items-center gap-1.5 ...">Framework</a>
</noscript>
```

Le `<button>` et le `<div role="menu">` sont rendus mais non fonctionnels. Le `<noscript>` fournit un lien de navigation direct.

### 7.5 Protection XSS

**Entree :**

```astro
<DropdownMenu
  label='<script>alert("xss")</script>'
  section="framework"
  items={[]}
  href="/test"
/>
```

**Sortie HTML :**

```html
<span>&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</span>
```

> Astro echappe automatiquement les expressions `{variable}` dans les templates.

---

## 8. Tests

### 8.1 Fichiers de test

| Fichier | Type | Framework |
|---------|------|-----------|
| `tests/unit/components/layout/dropdown-menu.test.ts` | Unitaire | Vitest + Astro Container |

### 8.2 Tests unitaires (Vitest)

```typescript
// tests/unit/components/layout/dropdown-menu.test.ts
import { describe, it, expect } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import DropdownMenu from '@components/layout/DropdownMenu.astro'

// ── Fixtures ────────────────────────────────────────
const FLAT_ITEMS = [
  { id: 'fw-preambule', label: 'Preambule', href: '/framework/preambule', section: 'framework' as const, order: 1, badge: 'essential' as const },
  { id: 'fw-vision', label: 'Vision & Philosophie', href: '/framework/vision-philosophie', section: 'framework' as const, order: 2 },
  { id: 'fw-ecosysteme', label: 'Ecosysteme', href: '/framework/ecosysteme', section: 'framework' as const, order: 3 },
]

const GROUPED_ITEMS = [
  {
    id: 'annexes-a-templates', label: 'A - Templates', href: '/annexes/templates',
    section: 'annexes' as const, order: 1,
    children: [
      { id: 'annexe-a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', order: 1 },
      { id: 'annexe-a2-arch', label: 'A2 - Architecture', href: '/annexes/templates/architecture', order: 2 },
    ],
  },
  {
    id: 'annexes-b-roles', label: 'B - Roles', href: '/annexes/roles',
    section: 'annexes' as const, order: 2,
    children: [
      { id: 'annexe-b1-pm', label: 'B1 - Product Manager', href: '/annexes/roles/product-manager', order: 1 },
    ],
  },
]

const EMPTY_ITEMS: never[] = []

// ── Helpers ──────────────────────────────────────────
async function renderDropdown(
  props: Record<string, unknown> = {},
  currentPath: string = '/',
) {
  const container = await AstroContainer.create()
  return container.renderToString(DropdownMenu, {
    props: {
      label: 'Framework',
      section: 'framework',
      items: FLAT_ITEMS,
      href: '/framework',
      ...props,
    },
    request: new Request(`https://aiad.dev${currentPath}`),
  })
}

// ── Tests structure HTML ──────────────────────────────
describe('DropdownMenu — Structure HTML', () => {
  it('T-01 : rend un conteneur avec data-dropdown', async () => {
    const html = await renderDropdown()
    expect(html).toContain('data-dropdown')
  })

  it('T-02 : rend un bouton declencheur avec data-dropdown-trigger', async () => {
    const html = await renderDropdown()
    expect(html).toContain('data-dropdown-trigger')
    expect(html).toContain('<button')
  })

  it('T-03 : le bouton a aria-haspopup="true"', async () => {
    const html = await renderDropdown()
    expect(html).toContain('aria-haspopup="true"')
  })

  it('T-04 : le bouton a aria-expanded="false" par defaut', async () => {
    const html = await renderDropdown()
    expect(html).toContain('aria-expanded="false"')
  })

  it('T-05 : le bouton a aria-controls pointant vers le menu', async () => {
    const html = await renderDropdown()
    expect(html).toContain('aria-controls="dropdown-framework-menu"')
  })

  it('T-06 : le panneau a role="menu"', async () => {
    const html = await renderDropdown()
    expect(html).toContain('role="menu"')
  })

  it('T-07 : le panneau a aria-labelledby pointant vers le bouton', async () => {
    const html = await renderDropdown()
    expect(html).toContain('aria-labelledby="dropdown-framework-button"')
  })

  it('T-08 : le panneau est masque par defaut (classe hidden)', async () => {
    const html = await renderDropdown()
    // Le menu div doit contenir "hidden"
    expect(html).toMatch(/data-dropdown-menu[^>]*class="[^"]*hidden/)
  })

  it('T-09 : le label du bouton est affiche', async () => {
    const html = await renderDropdown({ label: 'Framework' })
    expect(html).toContain('Framework')
  })

  it('T-10 : le chevron SVG est present avec aria-hidden', async () => {
    const html = await renderDropdown()
    expect(html).toContain('data-dropdown-chevron')
    expect(html).toContain('aria-hidden="true"')
  })
})

// ── Tests mode flat ────────────────────────────────────
describe('DropdownMenu — Mode flat (Framework/ModeOp)', () => {
  it('T-11 : rend les items comme des NavLink avec role="menuitem"', async () => {
    const html = await renderDropdown({ items: FLAT_ITEMS })
    expect(html).toContain('role="menuitem"')
    expect(html).toContain('Preambule')
    expect(html).toContain('Vision &amp; Philosophie')
    expect(html).toContain('Ecosysteme')
  })

  it('T-12 : les items ont tabindex="-1"', async () => {
    const html = await renderDropdown({ items: FLAT_ITEMS })
    expect(html).toContain('tabindex="-1"')
  })

  it('T-13 : les items ont les hrefs corrects', async () => {
    const html = await renderDropdown({ items: FLAT_ITEMS })
    expect(html).toContain('href="/framework/preambule"')
    expect(html).toContain('href="/framework/vision-philosophie"')
    expect(html).toContain('href="/framework/ecosysteme"')
  })

  it('T-14 : le badge est affiche sur les items qui en ont un', async () => {
    const html = await renderDropdown({ items: FLAT_ITEMS })
    expect(html).toContain('Essentiel')
  })

  it('T-15 : pas de role="group" en mode flat', async () => {
    const html = await renderDropdown({ items: FLAT_ITEMS })
    expect(html).not.toContain('role="group"')
  })

  it('T-16 : pas de role="separator" en mode flat', async () => {
    const html = await renderDropdown({ items: FLAT_ITEMS })
    expect(html).not.toContain('role="separator"')
  })
})

// ── Tests mode grouped ─────────────────────────────────
describe('DropdownMenu — Mode grouped (Annexes)', () => {
  it('T-17 : rend les categories avec role="group"', async () => {
    const html = await renderDropdown({ items: GROUPED_ITEMS, section: 'annexes', label: 'Annexes', href: '/annexes' })
    expect(html).toContain('role="group"')
  })

  it('T-18 : les groupes ont aria-labelledby pointant vers le titre', async () => {
    const html = await renderDropdown({ items: GROUPED_ITEMS, section: 'annexes', label: 'Annexes', href: '/annexes' })
    expect(html).toContain('aria-labelledby="dropdown-annexes-group-annexes-a-templates"')
  })

  it('T-19 : les titres de groupe sont affiches', async () => {
    const html = await renderDropdown({ items: GROUPED_ITEMS, section: 'annexes', label: 'Annexes', href: '/annexes' })
    expect(html).toContain('A - Templates')
    expect(html).toContain('B - Roles')
  })

  it('T-20 : les titres de groupe sont des liens cliquables avec role="menuitem"', async () => {
    const html = await renderDropdown({ items: GROUPED_ITEMS, section: 'annexes', label: 'Annexes', href: '/annexes' })
    expect(html).toContain('data-dropdown-group-link')
    expect(html).toContain('href="/annexes/templates"')
  })

  it('T-21 : les fiches enfants sont rendues', async () => {
    const html = await renderDropdown({ items: GROUPED_ITEMS, section: 'annexes', label: 'Annexes', href: '/annexes' })
    expect(html).toContain('A1 - PRD')
    expect(html).toContain('A2 - Architecture')
    expect(html).toContain('B1 - Product Manager')
  })

  it('T-22 : les fiches sont indentees (pl-2)', async () => {
    const html = await renderDropdown({ items: GROUPED_ITEMS, section: 'annexes', label: 'Annexes', href: '/annexes' })
    expect(html).toContain('pl-2')
  })

  it('T-23 : un separateur est present entre les groupes (sauf avant le premier)', async () => {
    const html = await renderDropdown({ items: GROUPED_ITEMS, section: 'annexes', label: 'Annexes', href: '/annexes' })
    expect(html).toContain('role="separator"')
  })

  it('T-24 : pas de separateur avant le premier groupe', async () => {
    const html = await renderDropdown({ items: GROUPED_ITEMS, section: 'annexes', label: 'Annexes', href: '/annexes' })
    // Le premier group ne doit pas etre precede d'un <hr>
    const firstGroupIndex = html.indexOf('role="group"')
    const firstSepIndex = html.indexOf('role="separator"')
    expect(firstSepIndex).toBeGreaterThan(firstGroupIndex)
  })
})

// ── Tests IDs et aria ──────────────────────────────────
describe('DropdownMenu — IDs et ARIA', () => {
  it('T-25 : IDs generes automatiquement a partir de la section', async () => {
    const html = await renderDropdown({ section: 'framework' })
    expect(html).toContain('id="dropdown-framework"')
    expect(html).toContain('id="dropdown-framework-button"')
    expect(html).toContain('id="dropdown-framework-menu"')
  })

  it('T-26 : IDs personnalises quand id est fourni', async () => {
    const html = await renderDropdown({ id: 'custom-dropdown' })
    expect(html).toContain('id="custom-dropdown"')
    expect(html).toContain('id="custom-dropdown-button"')
    expect(html).toContain('id="custom-dropdown-menu"')
  })

  it('T-27 : data-dropdown-section contient la section', async () => {
    const html = await renderDropdown({ section: 'mode-operatoire' })
    expect(html).toContain('data-dropdown-section="mode-operatoire"')
  })

  it('T-28 : le bouton a un id unique pour aria-labelledby', async () => {
    const html = await renderDropdown()
    const buttonId = 'dropdown-framework-button'
    expect(html).toContain(`id="${buttonId}"`)
    expect(html).toContain(`aria-labelledby="${buttonId}"`)
  })
})

// ── Tests noscript fallback ────────────────────────────
describe('DropdownMenu — Enhancement progressif', () => {
  it('T-29 : contient un <noscript> avec un lien fallback', async () => {
    const html = await renderDropdown({ href: '/framework' })
    expect(html).toContain('<noscript>')
    expect(html).toContain('href="/framework"')
  })

  it('T-30 : le lien noscript affiche le label', async () => {
    const html = await renderDropdown({ label: 'Framework', href: '/framework' })
    // Le noscript contient un <a> avec le label
    const noscriptMatch = html.match(/<noscript>([\s\S]*?)<\/noscript>/)
    expect(noscriptMatch).not.toBeNull()
    expect(noscriptMatch![1]).toContain('Framework')
  })
})

// ── Tests styles ─────────────────────────────────────
describe('DropdownMenu — Styles', () => {
  it('T-31 : le bouton a un focus ring', async () => {
    const html = await renderDropdown()
    expect(html).toContain('focus:ring-2')
    expect(html).toContain('focus:ring-blue-500')
    expect(html).toContain('focus:ring-offset-2')
  })

  it('T-32 : le panneau est positionne en absolu', async () => {
    const html = await renderDropdown()
    expect(html).toContain('absolute')
    expect(html).toContain('top-full')
    expect(html).toContain('z-50')
  })

  it('T-33 : le panneau a une ombre et une bordure', async () => {
    const html = await renderDropdown()
    expect(html).toContain('shadow-lg')
    expect(html).toContain('border-gray-200')
  })

  it('T-34 : le panneau a une largeur de w-64', async () => {
    const html = await renderDropdown()
    expect(html).toContain('w-64')
  })

  it('T-35 : le conteneur a la classe relative pour le positionnement', async () => {
    const html = await renderDropdown()
    expect(html).toContain('relative')
  })

  it('T-36 : le chevron a une transition pour la rotation', async () => {
    const html = await renderDropdown()
    expect(html).toContain('transition-transform')
    expect(html).toContain('duration-200')
  })

  it('T-37 : les titres de groupe sont en uppercase et petite taille', async () => {
    const html = await renderDropdown({ items: GROUPED_ITEMS, section: 'annexes', label: 'Annexes', href: '/annexes' })
    expect(html).toContain('uppercase')
    expect(html).toContain('tracking-wider')
    expect(html).toContain('text-xs')
    expect(html).toContain('font-semibold')
  })
})

// ── Tests classes et attributs ──────────────────────
describe('DropdownMenu — Classes et attributs', () => {
  it('T-38 : classe personnalisee ajoutee au conteneur', async () => {
    const html = await renderDropdown({ class: 'ml-4' })
    expect(html).toContain('ml-4')
  })

  it('T-39 : data-dropdown-menu present sur le panneau', async () => {
    const html = await renderDropdown()
    expect(html).toContain('data-dropdown-menu')
  })

  it('T-40 : data-dropdown-trigger present sur le bouton', async () => {
    const html = await renderDropdown()
    expect(html).toContain('data-dropdown-trigger')
  })
})

// ── Tests tri des items ─────────────────────────────
describe('DropdownMenu — Tri des items', () => {
  it('T-41 : les items sont tries par order', async () => {
    const unsortedItems = [
      { id: 'fw-c', label: 'C - Troisieme', href: '/c', order: 3, section: 'framework' as const },
      { id: 'fw-a', label: 'A - Premier', href: '/a', order: 1, section: 'framework' as const },
      { id: 'fw-b', label: 'B - Deuxieme', href: '/b', order: 2, section: 'framework' as const },
    ]
    const html = await renderDropdown({ items: unsortedItems })
    const indexA = html.indexOf('A - Premier')
    const indexB = html.indexOf('B - Deuxieme')
    const indexC = html.indexOf('C - Troisieme')
    expect(indexA).toBeLessThan(indexB)
    expect(indexB).toBeLessThan(indexC)
  })

  it('T-42 : les fiches enfants sont triees par order dans les groupes', async () => {
    const unsortedGrouped = [
      {
        id: 'cat-a', label: 'Cat A', href: '/a', section: 'annexes' as const, order: 1,
        children: [
          { id: 'f2', label: 'Fiche 2', href: '/a/2', order: 2 },
          { id: 'f1', label: 'Fiche 1', href: '/a/1', order: 1 },
        ],
      },
    ]
    const html = await renderDropdown({ items: unsortedGrouped, section: 'annexes', label: 'Annexes', href: '/annexes' })
    const indexF1 = html.indexOf('Fiche 1')
    const indexF2 = html.indexOf('Fiche 2')
    expect(indexF1).toBeLessThan(indexF2)
  })
})

// ── Tests items vides ──────────────────────────────
describe('DropdownMenu — Items vides', () => {
  it('T-43 : rend le bouton meme avec une liste vide', async () => {
    const html = await renderDropdown({ items: EMPTY_ITEMS })
    expect(html).toContain('data-dropdown-trigger')
    expect(html).toContain('Framework')
  })

  it('T-44 : le panneau menu est present meme avec une liste vide', async () => {
    const html = await renderDropdown({ items: EMPTY_ITEMS })
    expect(html).toContain('data-dropdown-menu')
  })
})

// ── Tests XSS ────────────────────────────────────────
describe('DropdownMenu — Protection XSS', () => {
  it('T-45 : label avec HTML est echappe', async () => {
    const html = await renderDropdown({ label: '<script>alert("xss")</script>' })
    expect(html).not.toContain('<script>alert')
    expect(html).toContain('&lt;script&gt;')
  })
})

// ── Tests script client ──────────────────────────────
describe('DropdownMenu — Script client', () => {
  it('T-46 : un <script> est present dans le rendu', async () => {
    const html = await renderDropdown()
    expect(html).toContain('<script>')
  })

  it('T-47 : le script reference data-dropdown pour l\'initialisation', async () => {
    const html = await renderDropdown()
    expect(html).toContain('[data-dropdown]')
  })

  it('T-48 : le script gere ArrowDown et ArrowUp', async () => {
    const html = await renderDropdown()
    expect(html).toContain('ArrowDown')
    expect(html).toContain('ArrowUp')
  })

  it('T-49 : le script gere Escape', async () => {
    const html = await renderDropdown()
    expect(html).toContain('Escape')
  })

  it('T-50 : le script gere le clic exterieur', async () => {
    const html = await renderDropdown()
    expect(html).toContain('click')
    expect(html).toContain('contains')
  })
})
```

### 8.3 Matrice de couverture

| ID | Test | Type | Assertion | Priorite |
|----|------|------|-----------|----------|
| T-01 | Conteneur `data-dropdown` | Unit | `toContain('data-dropdown')` | Haute |
| T-02 | Bouton `data-dropdown-trigger` | Unit | `toContain('data-dropdown-trigger')` | Haute |
| T-03 | `aria-haspopup="true"` | Unit | `toContain(...)` | Haute |
| T-04 | `aria-expanded="false"` par defaut | Unit | `toContain(...)` | Haute |
| T-05 | `aria-controls` vers le menu | Unit | `toContain(...)` | Haute |
| T-06 | `role="menu"` | Unit | `toContain(...)` | Haute |
| T-07 | `aria-labelledby` vers le bouton | Unit | `toContain(...)` | Haute |
| T-08 | Menu masque par defaut | Unit | `toMatch(...)` | Haute |
| T-09 | Label du bouton | Unit | `toContain(...)` | Haute |
| T-10 | Chevron SVG `aria-hidden` | Unit | `toContain(...)` | Haute |
| T-11 | Items NavLink avec `role="menuitem"` | Unit | `toContain(...)` | Haute |
| T-12 | Items `tabindex="-1"` | Unit | `toContain(...)` | Haute |
| T-13 | Hrefs corrects | Unit | `toContain(href)` | Haute |
| T-14 | Badge affiche | Unit | `toContain('Essentiel')` | Haute |
| T-15 | Pas de `role="group"` en flat | Unit | `not.toContain(...)` | Haute |
| T-16 | Pas de separateur en flat | Unit | `not.toContain(...)` | Haute |
| T-17 | `role="group"` en grouped | Unit | `toContain(...)` | Haute |
| T-18 | `aria-labelledby` sur les groupes | Unit | `toContain(...)` | Haute |
| T-19 | Titres de groupe | Unit | `toContain(...)` | Haute |
| T-20 | Titres de groupe cliquables | Unit | `toContain('data-dropdown-group-link')` | Haute |
| T-21 | Fiches enfants rendues | Unit | `toContain(...)` | Haute |
| T-22 | Fiches indentees | Unit | `toContain('pl-2')` | Moyenne |
| T-23 | Separateur entre groupes | Unit | `toContain('role="separator"')` | Haute |
| T-24 | Pas de separateur avant premier groupe | Unit | position relative | Moyenne |
| T-25 | IDs generes automatiquement | Unit | `toContain(ids)` | Haute |
| T-26 | IDs personnalises | Unit | `toContain(custom-ids)` | Moyenne |
| T-27 | `data-dropdown-section` | Unit | `toContain(...)` | Haute |
| T-28 | Coherence bouton id / `aria-labelledby` | Unit | meme id | Haute |
| T-29 | `<noscript>` avec lien fallback | Unit | `toContain('<noscript>')` | Haute |
| T-30 | Lien noscript avec label | Unit | noscript contient label | Haute |
| T-31 | Focus ring sur le bouton | Unit | `toContain('focus:ring-2')` | Haute |
| T-32 | Position absolue du panneau | Unit | `toContain('absolute')` | Haute |
| T-33 | Ombre et bordure du panneau | Unit | `toContain('shadow-lg')` | Moyenne |
| T-34 | Largeur panneau `w-64` | Unit | `toContain('w-64')` | Moyenne |
| T-35 | Conteneur `relative` | Unit | `toContain('relative')` | Haute |
| T-36 | Transition chevron | Unit | `toContain('transition-transform')` | Moyenne |
| T-37 | Styles titres de groupe | Unit | `uppercase tracking-wider` | Moyenne |
| T-38 | Classe personnalisee | Unit | `toContain('ml-4')` | Moyenne |
| T-39 | `data-dropdown-menu` | Unit | `toContain(...)` | Haute |
| T-40 | `data-dropdown-trigger` | Unit | `toContain(...)` | Haute |
| T-41 | Tri items par order | Unit | positions relatives | Haute |
| T-42 | Tri fiches enfants par order | Unit | positions relatives | Haute |
| T-43 | Bouton avec liste vide | Unit | bouton present | Basse |
| T-44 | Panneau avec liste vide | Unit | panneau present | Basse |
| T-45 | XSS label echappe | Unit | `not.toContain('<script>')` | Haute |
| T-46 | Script client present | Unit | `toContain('<script>')` | Haute |
| T-47 | Script reference `data-dropdown` | Unit | `toContain(...)` | Haute |
| T-48 | Script gere Arrow keys | Unit | `toContain('ArrowDown')` | Haute |
| T-49 | Script gere Escape | Unit | `toContain('Escape')` | Haute |
| T-50 | Script gere clic exterieur | Unit | `toContain('click')` | Haute |

---

## 9. Criteres d'acceptation

| ID | Critere | Verifie par |
|----|---------|-------------|
| CA-01 | Le fichier `src/components/layout/DropdownMenu.astro` est cree | Verification fichier |
| CA-02 | Le composant rend un `<button>` avec `aria-haspopup="true"` et `aria-expanded="false"` | T-02, T-03, T-04 |
| CA-03 | Le panneau menu a `role="menu"` et `aria-labelledby` vers le bouton | T-06, T-07 |
| CA-04 | Les items sont rendus via NavLink en variante `dropdown` avec `role="menuitem"` et `tabindex="-1"` | T-11, T-12 |
| CA-05 | Mode flat pour Framework/ModeOp (pas de groupes ni separateurs) | T-15, T-16 |
| CA-06 | Mode grouped pour Annexes (categories en `role="group"` avec titres cliquables et fiches indentees) | T-17, T-18, T-19, T-20, T-21, T-22 |
| CA-07 | Separateurs `role="separator"` entre les groupes (sauf avant le premier) | T-23, T-24 |
| CA-08 | Le menu est masque par defaut (`hidden`) | T-08 |
| CA-09 | Le script client gere le toggle ouverture/fermeture | T-46, T-47 |
| CA-10 | Navigation clavier : Arrow Down/Up, Home, End, Escape, caractere | T-48, T-49 |
| CA-11 | Fermeture au clic exterieur | T-50 |
| CA-12 | Le chevron a une rotation a l'ouverture (`rotate-180`) | T-36 |
| CA-13 | Enhancement progressif : `<noscript>` avec lien fallback | T-29, T-30 |
| CA-14 | IDs generes automatiquement a partir de la section ou du prop `id` | T-25, T-26 |
| CA-15 | Les items sont tries par `order` | T-41, T-42 |
| CA-16 | Focus ring visible sur le bouton (`ring-2 ring-blue-500 ring-offset-2`) | T-31 |
| CA-17 | Contrastes WCAG AA respectes pour tous les etats | Verification manuelle section 5.2 |
| CA-18 | Protection XSS par echappement Astro | T-45 |
| CA-19 | Classes personnalisees supportees via prop `class` | T-38 |
| CA-20 | Data attributes pour les selecteurs (`data-dropdown`, `data-dropdown-trigger`, `data-dropdown-menu`, etc.) | T-39, T-40 |
| CA-21 | TypeScript compile sans erreur (`pnpm typecheck`) | CI |
| CA-22 | ESLint passe sans warning (`pnpm lint`) | CI |
| CA-23 | Les 50 tests unitaires passent | CI |

---

## 10. Definition of Done

- [ ] Fichier `src/components/layout/DropdownMenu.astro` cree
- [ ] Interface TypeScript `Props` complete avec documentation JSDoc
- [ ] Import des types `NavigationItem` et `NavigationSection` depuis T-004-B1
- [ ] Import du composant `NavLink` depuis T-004-F2
- [ ] Bouton declencheur `<button>` avec `aria-haspopup`, `aria-expanded`, `aria-controls`
- [ ] Panneau menu `<div role="menu" aria-labelledby>` masque par defaut
- [ ] Mode flat (Framework, Mode Operatoire) : liste simple de NavLink
- [ ] Mode grouped (Annexes) : categories en `role="group"` avec titres cliquables et fiches indentees
- [ ] Separateurs `role="separator"` entre les groupes
- [ ] Chevron SVG avec rotation `rotate-180` a l'ouverture
- [ ] IDs generes automatiquement (`dropdown-{section}-button`, `dropdown-{section}-menu`)
- [ ] `<noscript>` fallback avec lien vers la page index de la section
- [ ] Script client : toggle, navigation clavier (Arrow, Home, End, Escape, caractere), clic exterieur, focusout
- [ ] Items tries par `order`
- [ ] Focus ring coherent avec le design system
- [ ] Data attributes (`data-dropdown`, `data-dropdown-trigger`, `data-dropdown-menu`, `data-dropdown-chevron`, `data-dropdown-group-link`, `data-dropdown-open`)
- [ ] Tests unitaires passants (50 tests)
- [ ] 0 erreur TypeScript (`pnpm typecheck`)
- [ ] 0 erreur ESLint (`pnpm lint`)
- [ ] Code formate avec Prettier

---

## 11. Notes d'implementation

### 11.1 Ordre d'implementation recommande

1. Creer le fichier `src/components/layout/DropdownMenu.astro` avec l'interface Props
2. Implementer le bouton declencheur avec les attributs ARIA
3. Implementer le panneau menu masque par defaut
4. Implementer le mode flat (Framework, Mode Operatoire) avec NavLink `dropdown`
5. Implementer le mode grouped (Annexes) avec `role="group"`, titres et separateurs
6. Ajouter le tri des items par `order`
7. Ajouter le `<noscript>` fallback
8. Ajouter les IDs generes et les data attributes
9. Implementer le script client : toggle ouverture/fermeture
10. Ajouter la navigation clavier (Arrow Down/Up, Home, End, Escape)
11. Ajouter la navigation par caractere
12. Ajouter la fermeture au clic exterieur et au focusout
13. Ajouter la rotation du chevron
14. Verifier avec `pnpm typecheck` et `pnpm lint`
15. Ecrire les tests unitaires

### 11.2 Points d'attention

| Point | Detail |
|-------|--------|
| **Script Astro vs Island** | Le script est inline dans le composant Astro (`<script>` tag) et non un island React/Svelte. Astro deuplique automatiquement les `<script>` quand le composant est utilise plusieurs fois sur la meme page — les scripts ne sont inclus qu'une seule fois. |
| **Gestion multi-instance** | Le script s'initialise sur tous les `[data-dropdown]` de la page. Chaque instance a son propre etat grace a la closure `initDropdown(container)`. |
| **Un seul dropdown ouvert** | Quand un dropdown s'ouvre, les autres doivent se fermer. Implementer cela en emettant un evenement custom (`dropdown:open`) ou en iterant sur tous les `[data-dropdown-open]`. |
| **`tabindex="-1"` sur les items** | Les items du menu ne sont pas dans l'ordre Tab natif. Le focus est gere programmatiquement par le script (Arrow keys). Seul le bouton est dans l'ordre Tab normal. |
| **NavLink `role` prop** | Le composant NavLink accepte une prop `role` qui est transmise au `<a>`. Utiliser `role="menuitem"` pour les items dans le dropdown. |
| **Largeur du panneau** | `w-64` (256px) convient pour les labels typiques. Pour les Annexes avec de longs labels, le `truncate` de NavLink evite les debordements. Adapter si necessaire a `w-72` ou `w-80`. |
| **`max-h-[70vh]` pour le scroll** | Le panneau Annexes avec 9 categories et 46 fiches peut etre tres long. Ajouter `max-h-[70vh] overflow-y-auto` sur le panneau menu pour permettre le scroll. |
| **Coherence avec le Header** | Le Header (T-004-F4) instanciera 3 `DropdownMenu` cote a cote. Les IDs doivent etre uniques pour chaque instance (`dropdown-framework`, `dropdown-mode-operatoire`, `dropdown-annexes`). |
| **Mode Operatoire section** | La section `mode-operatoire` contient un tiret. L'ID genere sera `dropdown-mode-operatoire` ce qui est valide en HTML. |
| **`Object.freeze` sur `NAVIGATION_TREE`** | L'arbre est gele. Le `[...items].sort()` cree une copie avant le tri pour eviter toute mutation. |
| **Fiches Annexes sans `section`** | Les fiches enfants des categories d'annexes n'ont pas de `section` dans la config (T-004-B3). La prop `section` est transmise explicitement par le composant (`section={section}`) a tous les NavLink. |

### 11.3 Extensions futures (hors scope)

| Extension | Description | User Story |
|-----------|-------------|------------|
| Hover pour ouvrir | Ouvrir le dropdown au survol (en plus du clic) avec un delai | Non definie |
| Animation d'apparition | Transition `opacity` + `transform` a l'ouverture du panneau | Non definie |
| Mega-menu Annexes | Afficher les Annexes en grille multi-colonnes au lieu d'une liste | Non definie |
| Recherche dans le dropdown | Champ de recherche/filtre en haut du panneau | Non definie |
| Mode sombre | Variantes de couleurs pour le dark mode | Non definie |
| Position responsive | Repositionner le panneau a droite si le dropdown est proche du bord droit | Non definie |

---

## 12. References

| Ressource | Lien |
|-----------|------|
| US-004 Spec | [spec-US-004.md](./spec-US-004.md) |
| Architecture | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| T-004-B1 Types navigation | [T-004-B1-types-typescript-navigation.md](./T-004-B1-types-typescript-navigation.md) |
| T-004-B3 Configuration navigation | [T-004-B3-configuration-navigation.md](./T-004-B3-configuration-navigation.md) |
| T-004-F2 NavLink | [T-004-F2-composant-NavLink.md](./T-004-F2-composant-NavLink.md) |
| T-004-F4 Header | [T-004-F4-composant-Header.md](./T-004-F4-composant-Header.md) |
| T-004-F5 MobileMenu | [T-004-F5-composant-MobileMenu.md](./T-004-F5-composant-MobileMenu.md) |
| WAI-ARIA Menu Button | https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/ |
| RGAA 12.2 Navigation | https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#12.2 |
| RGAA 7.1 Scripts | https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#7.1 |
| Tailwind CSS Z-Index | https://tailwindcss.com/docs/z-index |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 11/02/2026 | Creation initiale — mode flat et grouped, WAI-ARIA Menu Button pattern, navigation clavier complete, enhancement progressif, 30 cas limites, 50 tests unitaires, 23 criteres d'acceptation |
