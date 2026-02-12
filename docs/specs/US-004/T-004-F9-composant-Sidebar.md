# T-004-F9 : Composant Sidebar (navigation laterale docs avec sections depliables)

| Metadonnee | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 12 fevrier 2026 |
| **Statut** | A faire |
| **User Story** | [US-004 - Naviguer facilement dans le framework](./spec-US-004.md) |
| **Dependances** | T-004-F2 (NavLink), T-004-B3 (Configuration navigation) |
| **Bloque** | T-004-F10 (DocsLayout), T-004-T5 (Tests integration DocsLayout) |

---

## 1. Objectif

Creer le composant **Sidebar** qui fournit la navigation laterale persistante dans les pages de documentation du site AIAD. Ce composant fournit :

- Une **navigation laterale fixe** (`<aside>`) visible sur desktop (>= 1024px), masquee sur mobile/tablette
- **Trois sections depliables** (Framework, Mode Operatoire, Annexes) en format accordeon non exclusif (plusieurs sections peuvent etre ouvertes simultanement)
- L'**ouverture automatique** de la section correspondant a la page courante
- L'utilisation du composant **NavLink** (T-004-F2) en variante `sidebar` pour chaque item
- Pour les Annexes, un **double niveau de navigation** : categories depliables contenant les fiches enfants
- Le **scroll independant** : la sidebar scrolle independamment du contenu principal si elle depasse la hauteur du viewport
- Un **indicateur visuel de la page active** via l'etat `active` du NavLink (fond `blue-50`, bordure `blue-600`)
- L'**enhancement progressif** : sans JavaScript, toutes les sections sont depliees et navigables
- La **position sticky** : la sidebar reste visible lors du scroll vertical du contenu

Ce composant est consomme par le DocsLayout (T-004-F10) et constitue l'element central de la navigation contextuelle dans les pages de documentation.

---

## 2. Contexte technique

### 2.1 Stack

| Technologie | Version | Role |
|-------------|---------|------|
| Astro | 4.x | Composant avec script client inline |
| TypeScript | 5.x | Typage strict des props |
| Tailwind CSS | 3.x | Utility-first, responsive, sticky, scroll |
| JavaScript client | ES2022 | Toggle accordeon sections/categories |

### 2.2 Arborescence

```
src/
├── components/
│   └── layout/
│       ├── NavLink.astro              # T-004-F2 (consomme)
│       ├── DropdownMenu.astro         # T-004-F3 (equivalent header desktop)
│       ├── MobileMenu.astro           # T-004-F5 (equivalent mobile)
│       └── Sidebar.astro              <-- CE COMPOSANT
├── types/
│   └── navigation.ts                  # Types NavigationItem, NavigationSection, NavigationTree (T-004-B1)
├── data/
│   └── navigation.ts                  # NAVIGATION_TREE (T-004-B3)
├── layouts/
│   ├── BaseLayout.astro               # Layout racine (T-004-F1)
│   └── DocsLayout.astro               # Layout docs (T-004-F10, consommateur)
└── pages/
    └── index.astro
```

### 2.3 Position dans l'architecture des composants

```
Sidebar.astro                          <-- CE COMPOSANT (composant compose)
├── NavLink.astro (T-004-F2)          <-- Consomme (items en variante sidebar)
└── DocsLayout.astro (T-004-F10)      <-- Consommateur (1 instance, visible >= 1024px)
```

### 2.4 Dependances

#### T-004-F2 (NavLink)

Le composant utilise `NavLink` en variante `sidebar` pour chaque item de navigation :

```astro
import NavLink from '@components/layout/NavLink.astro'
```

- Variante `sidebar` : texte `text-sm`, fond `blue-50` actif, texte `blue-700`, bordure gauche `border-l-2 border-blue-600`
- Props transmises : `href`, `label`, `badge`, `section`, `variant="sidebar"`, `hasChildren` (pour les categories Annexes)

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
| Responsive | Visible uniquement >= 1024px (`hidden lg:block`) |

---

## 3. Specifications fonctionnelles

### 3.1 Description

Le composant `Sidebar` est une **navigation laterale accessible et persistante** qui :

1. Rend un `<aside>` avec `<nav>` semantique pour la navigation laterale des pages de documentation
2. Affiche les 3 sections (Framework, Mode Operatoire, Annexes) sous forme de **boutons accordeon depliables**
3. Chaque section revele ses items (chapitres ou categories) au clic ou a la touche Enter/Space
4. Les items de navigation sont rendus via des `NavLink` en variante `sidebar`
5. Pour les Annexes, les categories sont des **sous-accordeons** contenant les fiches enfants
6. L'accordeon est **non exclusif** : plusieurs sections peuvent etre ouvertes simultanement (contrairement au MobileMenu)
7. **Auto-depliement** : la section correspondant a la page courante est automatiquement ouverte au chargement
8. La sidebar est **sticky** et scrolle independamment du contenu principal
9. Masquee sur mobile/tablette (< 1024px), le MobileMenu (T-004-F5) prend le relais

### 3.2 Pattern WAI-ARIA

Le composant suit le pattern [WAI-ARIA Disclosure (Show/Hide)](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) pour les sections depliables, dans un `<nav>` semantique :

| Element | Role/Attribut | Detail |
|---------|--------------|--------|
| Conteneur racine | `<aside aria-label="Navigation des documents">` | Landmark complementaire |
| Nav interne | `<nav aria-label="Sections de documentation">` | Navigation semantique |
| Bouton section | `<button aria-expanded="false/true" aria-controls="{section-panel-id}">` | Ouvre/ferme une section |
| Panneau section | `<div role="region" aria-labelledby="{section-button-id}">` | Contenu de la section |
| Items navigation | `<a>` via NavLink (variante sidebar) | Liens navigables |
| Bouton categorie (Annexes) | `<button aria-expanded="false/true" aria-controls="{category-panel-id}">` | Sous-accordeon pour les categories |
| Panneau categorie | `<div role="region" aria-labelledby="{category-button-id}">` | Fiches de la categorie |

### 3.3 Structure visuelle

```
┌──────────────────────┐
│  SIDEBAR             │
│                      │
│  ▾ Framework         │  ← Section ouverte (page courante dans Framework)
│    Preambule     ★   │  ← NavLink sidebar + badge "essential"
│    Vision & Philo.   │
│    Ecosysteme        │
│    Artefacts         │  ← Item actif (fond blue-50, bordure blue-600)
│    Boucles Iter.     │
│    Synchronisations  │
│    Metriques         │
│    Annexes           │
│  ─────────────────── │  ← Separateur
│  ▸ Mode Operatoire   │  ← Section fermee
│  ─────────────────── │
│  ▸ Annexes           │  ← Section fermee
│                      │
└──────────────────────┘
```

**Section Annexes depliee avec sous-categories :**

```
┌──────────────────────┐
│  ...                 │
│  ─────────────────── │
│  ▾ Annexes           │  ← Section ouverte
│    ▾ A - Templates   │  ← Categorie ouverte
│      A1 - PRD        │
│      A2 - Arch.      │
│      A3 - Agent Guide│
│      A4 - Specs      │
│      A5 - DoOD       │
│      A6 - DoOuD      │
│    ▸ B - Roles       │  ← Categorie fermee
│    ▸ C - Boucles     │
│    ▸ D - Rituels     │
│    ▸ E - Metriques   │
│    ▸ F - Agents      │
│    ▸ G - Config.     │
│    ▸ H - Bonnes Pr.  │
│    ▸ I - Ressources  │
│                      │
└──────────────────────┘
```

### 3.4 Comportement des accordeons sections

| Action | Resultat |
|--------|----------|
| Clic sur un titre de section (ferme) | Deplie la section (les autres restent dans leur etat) |
| Clic sur un titre de section (ouvert) | Replie la section |
| Enter / Space sur un titre de section | Meme comportement que le clic |

> **Difference avec MobileMenu** : l'accordeon est non exclusif (plusieurs sections peuvent etre ouvertes simultanement), car la sidebar a assez d'espace vertical et l'utilisateur peut vouloir comparer des chapitres entre sections.

### 3.5 Comportement des sous-accordeons (Annexes)

| Action | Resultat |
|--------|----------|
| Clic sur un titre de categorie (ferme) | Deplie la categorie, ferme les autres categories (sous-accordeon exclusif) |
| Clic sur un titre de categorie (ouvert) | Replie la categorie |
| Enter / Space sur un titre de categorie | Meme comportement que le clic |

> **Les sous-accordeons Annexes sont exclusifs** (une seule categorie ouverte a la fois) car il y a 9 categories avec de nombreuses fiches, et ouvrir plusieurs categories simultanement rendrait la sidebar difficile a naviguer.

### 3.6 Auto-depliement au chargement

A l'affichage initial de la page, le composant detecte la section active a partir de l'URL courante :

| URL | Section depliee | Categorie depliee |
|-----|----------------|-------------------|
| `/framework/*` | Framework | — |
| `/mode-operatoire/*` | Mode Operatoire | — |
| `/annexes/templates/*` | Annexes | A - Templates |
| `/annexes/roles/*` | Annexes | B - Roles |
| `/annexes/*` (autre) | Annexes | Categorie correspondante |
| `/` (accueil) | Aucune | — |
| `/pour-qui` (hors docs) | Aucune | — |

### 3.7 Position sticky et scroll independant

| Comportement | Detail |
|-------------|--------|
| Position | `sticky top-0` : la sidebar reste visible lors du scroll vertical |
| Hauteur maximale | `max-h-screen` (100vh) : ne depasse pas la hauteur du viewport |
| Scroll interne | `overflow-y-auto` : scroll independant si le contenu de la sidebar depasse |
| Scrollbar | Styles discrets (`scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent`) ou CSS custom |

### 3.8 Enhancement progressif

Sans JavaScript (ou avant hydratation), le composant rend :
- Toutes les sections depliees par defaut (pas de classe `hidden` sur les panneaux sans JS)
- Les liens de navigation fonctionnent normalement
- L'item actif est correctement mis en surbrillance (gere cote serveur par NavLink)

Le script client ajoute :
1. Le repli initial des sections non actives (via ajout de `hidden`)
2. Le comportement accordeon (deplier/replier les sections et categories)
3. La rotation des chevrons

**Strategie retenue** : Les panneaux sont rendus **visibles** cote serveur (pas de `hidden` par defaut). Le script client replie les sections non actives au chargement. Cela garantit que tout est visible sans JS.

### 3.9 Responsive

| Ecran | Comportement |
|-------|-------------|
| Mobile (< 768px) | **Masque** (`hidden lg:block`). Le MobileMenu (T-004-F5) prend le relais |
| Tablette (768px - 1023px) | **Masque** (`hidden lg:block`). Le MobileMenu prend le relais |
| Desktop (>= 1024px) | **Affiche** : sidebar laterale fixe dans le DocsLayout |
| Desktop large (>= 1280px) | Meme comportement, sidebar potentiellement plus large |

### 3.10 Accessibilite (RGAA AA)

| Critere | Implementation | Reference RGAA |
|---------|----------------|----------------|
| Landmark complementaire | `<aside aria-label="Navigation des documents">` | 12.6 |
| Navigation semantique | `<nav aria-label="Sections de documentation">` | 12.2 |
| Accordeon | `<button aria-expanded aria-controls>` + `<div role="region" aria-labelledby>` | 7.1 |
| Focus visible | `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2` | 10.7 |
| Contraste texte | Ratio >= 4.5:1 pour tous les etats | 3.2 |
| Annonce d'etat | `aria-expanded` change annonce l'ouverture/fermeture | 7.1 |
| Page courante | `aria-current="page"` sur le NavLink actif (gere par NavLink) | 12.2 |
| Icone decorative | `aria-hidden="true"` sur les SVG chevrons | 10.2 |

---

## 4. Specifications techniques

### 4.1 Interface TypeScript

```typescript
// src/components/layout/Sidebar.astro (frontmatter)

import type { NavigationItem, NavigationSection, NavigationTree } from '@/types/navigation'

/**
 * Props du composant Sidebar.
 *
 * Navigation laterale persistante pour les pages de documentation,
 * avec 3 sections depliables (Framework, Mode Operatoire, Annexes),
 * sous-accordeon pour les Annexes, et auto-depliement de la section active.
 *
 * Consomme NavLink (T-004-F2) en variante `sidebar` pour chaque item.
 *
 * @example
 * ```astro
 * ---
 * import Sidebar from '@components/layout/Sidebar.astro'
 * ---
 * <Sidebar />
 * ```
 *
 * @example
 * ```astro
 * <!-- Avec arbre custom (pour les tests) -->
 * <Sidebar tree={myTestTree} />
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
   * Classes CSS additionnelles sur le conteneur racine `<aside>`.
   */
  class?: string

  /**
   * Identifiant unique du composant.
   * Genere automatiquement si non fourni ('sidebar').
   * Utilise pour aria-controls et les data attributes.
   */
  id?: string
}
```

### 4.2 Implementation du composant

```astro
---
// src/components/layout/Sidebar.astro

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
const baseId = providedId ?? 'sidebar'

// ── Detection de la section active ──────────────
const currentPath = Astro.url.pathname
function detectActiveSection(): string | null {
  if (currentPath.startsWith('/framework')) return 'framework'
  if (currentPath.startsWith('/mode-operatoire')) return 'mode-operatoire'
  if (currentPath.startsWith('/annexes')) return 'annexes'
  return null
}
const activeSection = detectActiveSection()

// ── Detection de la categorie active (Annexes) ──
function detectActiveCategory(): string | null {
  if (!currentPath.startsWith('/annexes/')) return null
  for (const cat of tree.annexes) {
    if (currentPath.startsWith(cat.href)) return cat.id
  }
  return null
}
const activeCategory = detectActiveCategory()

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

<aside
  class:list={[
    'hidden lg:block w-64 shrink-0 sticky top-0 max-h-screen overflow-y-auto',
    'border-r border-gray-200 bg-white',
    'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent',
    className,
  ]}
  aria-label="Navigation des documents"
  data-sidebar
  id={baseId}
>
  <nav class="px-3 py-4" aria-label="Sections de documentation">
    {sections.map((section, sectionIndex) => {
      const sectionButtonId = `${baseId}-section-${section.key}-button`
      const sectionPanelId = `${baseId}-section-${section.key}-panel`
      const isActiveSection = activeSection === section.key

      return (
        <div data-sidebar-section={section.key}>
          {/* Separateur entre les sections (sauf avant la premiere) */}
          {sectionIndex > 0 && (
            <hr class="my-3 border-gray-200" role="separator" />
          )}

          {/* Bouton titre de section (accordeon) */}
          <button
            type="button"
            class="flex items-center justify-between w-full px-2 py-2 text-left text-sm font-semibold text-gray-900 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
            aria-expanded={isActiveSection ? 'true' : 'false'}
            aria-controls={sectionPanelId}
            id={sectionButtonId}
            data-sidebar-section-toggle
            data-section={section.key}
          >
            <span>{section.label}</span>
            <svg
              class:list={[
                'h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200',
                isActiveSection ? 'rotate-180' : '',
              ]}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              data-sidebar-section-chevron
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
              'mt-1',
              isActiveSection ? '' : 'hidden',
            ]}
            role="region"
            aria-labelledby={sectionButtonId}
            id={sectionPanelId}
            data-sidebar-section-panel
          >
            {section.key !== 'annexes' ? (
              /* ── Mode simple (Framework, Mode Operatoire) ── */
              <div class="space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    href={item.href}
                    label={item.label}
                    variant="sidebar"
                    badge={item.badge}
                    section={section.key as any}
                  />
                ))}
              </div>
            ) : (
              /* ── Mode sous-accordeon (Annexes) ─────────── */
              <div class="space-y-0.5">
                {section.items.map((category) => {
                  const categoryButtonId = `${baseId}-category-${category.id}-button`
                  const categoryPanelId = `${baseId}-category-${category.id}-panel`
                  const isCategoryActive = activeCategory === category.id

                  return (
                    <div data-sidebar-category={category.id}>
                      {/* Bouton titre de categorie (sous-accordeon) */}
                      <button
                        type="button"
                        class="flex items-center justify-between w-full px-2 py-1.5 text-left text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
                        aria-expanded={isCategoryActive ? 'true' : 'false'}
                        aria-controls={categoryPanelId}
                        id={categoryButtonId}
                        data-sidebar-category-toggle
                      >
                        <span class="truncate">{category.label}</span>
                        {hasChildren(category) && (
                          <svg
                            class:list={[
                              'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform duration-200',
                              isCategoryActive ? 'rotate-180' : '',
                            ]}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            data-sidebar-category-chevron
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
                            'pl-3 mt-0.5',
                            isCategoryActive ? '' : 'hidden',
                          ]}
                          role="region"
                          aria-labelledby={categoryButtonId}
                          id={categoryPanelId}
                          data-sidebar-category-panel
                        >
                          <div class="space-y-0.5">
                            {[...category.children!]
                              .sort((a, b) => a.order - b.order)
                              .map((fiche) => (
                                <NavLink
                                  href={fiche.href}
                                  label={fiche.label}
                                  variant="sidebar"
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
</aside>

<script>
  /**
   * Script client pour le comportement interactif de la Sidebar.
   *
   * Fonctionnalites :
   * - Accordeon non exclusif : deplier/replier les sections independamment
   * - Sous-accordeon exclusif pour les categories d'Annexes
   * - Rotation des chevrons a l'ouverture/fermeture
   */
  function initSidebar(container: HTMLElement) {
    // ── Accordeon sections ────────────────────────
    function toggleSection(button: HTMLButtonElement) {
      const controlsId = button.getAttribute('aria-controls')
      const targetPanel = controlsId ? document.getElementById(controlsId) : null

      if (!targetPanel) return

      const isExpanded = button.getAttribute('aria-expanded') === 'true'

      // Toggle la section courante (non exclusif : pas de fermeture des autres)
      button.setAttribute('aria-expanded', isExpanded ? 'false' : 'true')
      targetPanel.classList.toggle('hidden')
      const chevron = button.querySelector('[data-sidebar-section-chevron]')
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
        const parentSection = button.closest('[data-sidebar-section]')
        if (parentSection) {
          parentSection.querySelectorAll<HTMLButtonElement>('[data-sidebar-category-toggle]').forEach((btn) => {
            if (btn !== button) {
              btn.setAttribute('aria-expanded', 'false')
              const chevron = btn.querySelector('[data-sidebar-category-chevron]')
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
      const chevron = button.querySelector('[data-sidebar-category-chevron]')
      chevron?.classList.toggle('rotate-180')
    }

    // ── Events: accordeons sections ───────────────
    container.querySelectorAll<HTMLButtonElement>('[data-sidebar-section-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => toggleSection(btn))
    })

    // ── Events: accordeons categories ─────────────
    container.querySelectorAll<HTMLButtonElement>('[data-sidebar-category-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => toggleCategory(btn))
    })
  }

  // ── Initialisation ──────────────────────────────
  document.querySelectorAll<HTMLElement>('[data-sidebar]').forEach(initSidebar)
</script>
```

### 4.3 Data attributes

| Attribut | Element | Usage |
|----------|---------|-------|
| `data-sidebar` | `<aside>` racine | Selecteur pour l'initialisation JS et les tests |
| `data-sidebar-section` | `<div>` conteneur section | Selecteur d'une section (avec valeur `framework`, `mode-operatoire`, `annexes`) |
| `data-sidebar-section-toggle` | `<button>` titre section | Selecteur des boutons accordeon section |
| `data-sidebar-section-chevron` | `<svg>` chevron section | Selecteur du chevron de section pour la rotation |
| `data-sidebar-section-panel` | `<div role="region">` | Selecteur du panneau de section |
| `data-sidebar-category` | `<div>` conteneur categorie | Selecteur d'une categorie Annexes (avec valeur = `category.id`) |
| `data-sidebar-category-toggle` | `<button>` titre categorie | Selecteur des boutons accordeon categorie |
| `data-sidebar-category-chevron` | `<svg>` chevron categorie | Selecteur du chevron de categorie pour la rotation |
| `data-sidebar-category-panel` | `<div role="region">` | Selecteur du panneau de categorie |

### 4.4 Exemples d'utilisation

#### Usage standard (dans le DocsLayout)

```astro
---
import Sidebar from '@components/layout/Sidebar.astro'
---

<div class="flex">
  <Sidebar />
  <main class="flex-1 px-8 py-12">
    <slot />
  </main>
</div>
```

#### Avec arbre custom (tests)

```astro
<Sidebar tree={myTestTree} />
```

#### Avec classe et id personnalises

```astro
<Sidebar class="border-r-2" id="docs-sidebar" />
```

---

## 5. Design et Style

### 5.1 Palette de couleurs par etat

| Etat | Texte | Fond | Bordure |
|------|-------|------|---------|
| Sidebar background | — | `bg-white` (#FFFFFF) | `border-r border-gray-200` (#E5E7EB) |
| Titre section normal | `text-gray-900` (#111827) | transparent | — |
| Titre section hover | `text-gray-900` (#111827) | `bg-gray-50` (#F9FAFB) | — |
| Titre section focus | — | — | `ring-2 ring-blue-500 ring-offset-2` |
| Titre categorie normal | `text-gray-700` (#374151) | transparent | — |
| Titre categorie hover | `text-gray-700` (#374151) | `bg-gray-50` (#F9FAFB) | — |
| Titre categorie focus | — | — | `ring-2 ring-blue-500 ring-offset-2` |
| Item inactif (NavLink) | `text-gray-700` (#374151) | transparent | — |
| Item actif (NavLink) | `text-blue-700` (#1D4ED8) | `bg-blue-50` (#EFF6FF) | `border-l-2 border-blue-600` |
| Item hover (NavLink) | `text-gray-900` (#111827) | `bg-gray-50` (#F9FAFB) | — |
| Chevron | `text-gray-400` (#9CA3AF) | — | — |
| Separateur | — | — | `border-gray-200` (#E5E7EB) |

### 5.2 Verification du contraste (WCAG AA)

| Combinaison | Ratio | Conforme AA ? |
|-------------|-------|---------------|
| `gray-700` (#374151) sur `white` (#FFFFFF) | 9.12:1 | Oui (>= 4.5:1) |
| `gray-900` (#111827) sur `white` (#FFFFFF) | 16.75:1 | Oui (>= 4.5:1) |
| `gray-900` (#111827) sur `gray-50` (#F9FAFB) | 15.4:1 | Oui (>= 4.5:1) |
| `blue-700` (#1D4ED8) sur `blue-50` (#EFF6FF) | 4.88:1 | Oui (>= 4.5:1) |
| `gray-400` (#9CA3AF) sur `white` (#FFFFFF) | 2.85:1 | Oui pour icone decorative (non-textuel) |

### 5.3 Dimensions et espacement

| Element | Style | Detail |
|---------|-------|--------|
| Sidebar largeur | `w-64` | 256px, coherent avec les standards de sidebar |
| Sidebar position | `sticky top-0` | Reste visible au scroll |
| Sidebar hauteur max | `max-h-screen` | 100vh, ne depasse pas la fenetre |
| Sidebar scroll | `overflow-y-auto` | Scroll interne si le contenu deborde |
| Padding nav | `px-3 py-4` | 12px horizontal, 16px vertical |
| Titre section | `px-2 py-2 text-sm font-semibold` | 14px, gras |
| Titre categorie | `px-2 py-1.5 text-sm font-medium` | 14px, medium |
| Chevron section | `h-4 w-4` | 16px |
| Chevron categorie | `h-3.5 w-3.5` | 14px (plus petit pour la hierarchie visuelle) |
| Items NavLink sidebar | Via NavLink `sidebar` : `px-2 py-1.5 text-sm` | 14px, compact pour la sidebar |
| Indentation categories | `pl-3` | 12px depuis la marge gauche |
| Separateur | `my-3 border-gray-200` | 12px marge verticale |
| Bordure droite | `border-r border-gray-200` | Separation avec le contenu principal |

### 5.4 Animation

| Propriete | Detail |
|-----------|--------|
| Chevron rotation | `transition-transform duration-200` + classe `rotate-180` (ajoutee/retiree par JS) |
| Panneau apparition | Pas d'animation (affichage/masquage via `hidden`) — simplicite et performance |
| Hover items | `transition-colors duration-150` (via NavLink) |
| Hover sections | `transition-colors duration-150` |

### 5.5 Coherence avec le design system

| Aspect | Conformite |
|--------|------------|
| Focus ring | `ring-2 ring-blue-500 ring-offset-2` — coherent avec NavLink, DropdownMenu, MobileMenu, Breadcrumb |
| Couleurs actives | `blue-600/700/50` — coherent avec NavLink et le design system |
| Transition | `transition-colors duration-150` — coherent avec NavLink |
| Coins arrondis | `rounded-md` pour les boutons et les items |
| Typographie | `text-sm` (14px) — coherent avec la taille desktop standard |
| Chevron | SVG avec `fill="none" stroke="currentColor"` — coherent avec DropdownMenu et MobileMenu |

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Matrice des cas limites

| ID | Cas | Comportement attendu | Priorite |
|----|-----|----------------------|----------|
| CL-01 | Page dans `/framework/*` | Section Framework depliee automatiquement, NavLink actif mis en surbrillance | Haute |
| CL-02 | Page dans `/mode-operatoire/*` | Section Mode Operatoire depliee automatiquement | Haute |
| CL-03 | Page dans `/annexes/templates/prd` | Section Annexes depliee + categorie A - Templates depliee + item A1 - PRD actif | Haute |
| CL-04 | Page d'accueil (`/`) | Aucune section depliee | Haute |
| CL-05 | Page hors docs (`/pour-qui`) | Aucune section depliee | Haute |
| CL-06 | Clic sur un titre de section (ferme) | Deplie la section (non exclusif, les autres restent dans leur etat) | Haute |
| CL-07 | Clic sur un titre de section (ouvert) | Replie la section | Haute |
| CL-08 | Clic sur un titre de categorie Annexes (ferme) | Deplie la categorie, ferme les autres categories (exclusif) | Haute |
| CL-09 | Clic sur un titre de categorie Annexes (ouvert) | Replie la categorie | Haute |
| CL-10 | Enter/Space sur un titre de section | Meme comportement que le clic | Haute |
| CL-11 | Enter/Space sur un titre de categorie | Meme comportement que le clic | Haute |
| CL-12 | Framework 8 items, pas de children | Mode simple : liste de 8 NavLink | Haute |
| CL-13 | Mode Operatoire 8 items, pas de children | Mode simple : liste de 8 NavLink | Haute |
| CL-14 | Annexes 9 categories avec children | Mode sous-accordeon : 9 categories depliables avec fiches | Haute |
| CL-15 | Sidebar tres longue (toutes sections depliees + Annexes avec categories) | Scroll interne (`overflow-y-auto`) actif | Haute |
| CL-16 | Desktop (>= 1024px) | Sidebar visible | Haute |
| CL-17 | Mobile/Tablette (< 1024px) | Sidebar masquee (`hidden lg:block`) | Haute |
| CL-18 | Sans JavaScript | Toutes les sections et categories actives sont depliees. Les autres sont dans l'etat initial SSR (section active depliee) | Haute |
| CL-19 | `tree` vide | Pas de sections rendues, sidebar vide | Basse |
| CL-20 | `tree` avec un seul framework item | Section Framework avec 1 seul item | Basse |
| CL-21 | Label avec caracteres speciaux/accents | Echappe automatiquement par Astro | Haute |
| CL-22 | `class` personnalise fourni | Ajoute aux classes existantes (ne remplace pas) | Moyenne |
| CL-23 | `id` personnalise fourni | Utilise comme base pour tous les IDs derives | Moyenne |
| CL-24 | Item avec badge `essential` | Badge affiche via NavLink (coherent avec le composant) | Haute |
| CL-25 | Item avec badge `new` | Badge affiche via NavLink | Moyenne |
| CL-26 | Item avec `isHidden: true` | Item non rendu (filtre ou laisse au parent via NavLink) | Moyenne |
| CL-27 | Redimensionnement fenetre (mobile → desktop) | Sidebar reapparait via `hidden lg:block`, etat preservé | Moyenne |
| CL-28 | Plusieurs sections ouvertes simultanement | Autorise (accordeon non exclusif pour les sections) | Haute |
| CL-29 | Categorie Annexes sans children | Bouton categorie sans chevron, pas de panneau depliable | Basse |
| CL-30 | Plusieurs Sidebar sur la meme page | Chaque instance isolee grace a la closure `initSidebar(container)` | Basse |

### 6.2 Strategie de fallback

```
Props manquantes ?
├── tree: non fourni → NAVIGATION_TREE par defaut
├── class: non fourni → '' (pas de classes additionnelles)
└── id: non fourni → 'sidebar' (genere automatiquement)

JavaScript indisponible ?
├── Toutes les sections actives sont depliees (etat SSR preserve)
├── Les sections non actives sont repliees (etat SSR : hidden)
├── Les liens fonctionnent normalement
├── Les boutons accordeon ne sont pas fonctionnels sans JS
└── Enhancement progressif : la navigation reste utilisable via les liens
```

---

## 7. Exemples entree/sortie

### 7.1 Rendu initial (page /framework/artefacts)

**Entree :**

```astro
<Sidebar />
```

**Sortie HTML (extrait) :**

```html
<aside
  class="hidden lg:block w-64 shrink-0 sticky top-0 max-h-screen overflow-y-auto border-r border-gray-200 bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
  aria-label="Navigation des documents"
  data-sidebar
  id="sidebar"
>
  <nav class="px-3 py-4" aria-label="Sections de documentation">
    <!-- Section Framework (depliee car page dans /framework) -->
    <div data-sidebar-section="framework">
      <button
        type="button"
        class="flex items-center justify-between w-full px-2 py-2 text-left text-sm font-semibold text-gray-900 rounded-md ..."
        aria-expanded="true"
        aria-controls="sidebar-section-framework-panel"
        id="sidebar-section-framework-button"
        data-sidebar-section-toggle
        data-section="framework"
      >
        <span>Framework</span>
        <svg class="h-4 w-4 ... rotate-180" data-sidebar-section-chevron aria-hidden="true">...</svg>
      </button>
      <div class="mt-1" role="region" aria-labelledby="sidebar-section-framework-button" id="sidebar-section-framework-panel" data-sidebar-section-panel>
        <div class="space-y-0.5">
          <a href="/framework/preambule" class="... text-gray-700 ..." data-navlink>
            <span class="truncate">Preambule</span>
            <span class="... bg-amber-100 text-amber-800">Essentiel</span>
          </a>
          <!-- ... autres chapitres ... -->
          <a href="/framework/artefacts" class="... bg-blue-50 text-blue-700 border-l-2 border-blue-600 ..." aria-current="page" data-navlink>
            <span class="truncate">Artefacts</span>
          </a>
          <!-- ... suite ... -->
        </div>
      </div>
    </div>

    <hr class="my-3 border-gray-200" role="separator" />

    <!-- Section Mode Operatoire (fermee) -->
    <div data-sidebar-section="mode-operatoire">
      <button ... aria-expanded="false" ...>
        <span>Mode Operatoire</span>
        <svg class="h-4 w-4 ..." data-sidebar-section-chevron>...</svg>
      </button>
      <div class="mt-1 hidden" role="region" ... data-sidebar-section-panel>
        <!-- ... items ... -->
      </div>
    </div>

    <hr class="my-3 border-gray-200" role="separator" />

    <!-- Section Annexes (fermee) -->
    <div data-sidebar-section="annexes">
      <button ... aria-expanded="false" ...>
        <span>Annexes</span>
        <svg class="h-4 w-4 ..." data-sidebar-section-chevron>...</svg>
      </button>
      <div class="mt-1 hidden" role="region" ... data-sidebar-section-panel>
        <!-- ... categories et fiches ... -->
      </div>
    </div>
  </nav>
</aside>
```

### 7.2 Section Annexes depliee avec categorie active (page /annexes/templates/prd)

```html
<div data-sidebar-section="annexes">
  <button aria-expanded="true" ... data-sidebar-section-toggle data-section="annexes">
    <span>Annexes</span>
    <svg class="... rotate-180" data-sidebar-section-chevron>...</svg>
  </button>
  <div class="mt-1" role="region" ... data-sidebar-section-panel>
    <div class="space-y-0.5">
      <!-- Categorie A - Templates (depliee car active) -->
      <div data-sidebar-category="annexes-a-templates">
        <button aria-expanded="true" ... data-sidebar-category-toggle>
          <span class="truncate">A - Templates</span>
          <svg class="... rotate-180" data-sidebar-category-chevron>...</svg>
        </button>
        <div class="pl-3 mt-0.5" role="region" ... data-sidebar-category-panel>
          <div class="space-y-0.5">
            <a href="/annexes/templates/prd" class="... bg-blue-50 text-blue-700 ..." aria-current="page" data-navlink>
              <span class="truncate">A1 - PRD</span>
            </a>
            <a href="/annexes/templates/architecture" class="... text-gray-700 ..." data-navlink>
              <span class="truncate">A2 - Architecture</span>
            </a>
            <!-- ... 4 autres fiches ... -->
          </div>
        </div>
      </div>

      <!-- Categorie B - Roles (fermee) -->
      <div data-sidebar-category="annexes-b-roles">
        <button aria-expanded="false" ... data-sidebar-category-toggle>
          <span class="truncate">B - Roles</span>
          <svg class="..." data-sidebar-category-chevron>...</svg>
        </button>
        <div class="pl-3 mt-0.5 hidden" role="region" ... data-sidebar-category-panel>
          <!-- ... fiches ... -->
        </div>
      </div>
      <!-- ... 7 autres categories ... -->
    </div>
  </div>
</div>
```

### 7.3 Avec arbre custom (tests)

**Entree :**

```astro
<Sidebar tree={{
  framework: [
    { id: 'fw-test', label: 'Test', href: '/framework/test', section: 'framework', order: 1 },
  ],
  modeOperatoire: [],
  annexes: [],
}} />
```

**Sortie HTML :** Sidebar avec une seule section Framework contenant un seul item "Test". Les sections Mode Operatoire et Annexes sont vides mais les boutons sont tout de meme rendus.

### 7.4 Protection XSS

**Entree :**

```astro
<Sidebar tree={{
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
<Sidebar class="border-r-2" id="docs-nav" />
```

**Sortie HTML (extrait) :**

```html
<aside class="hidden lg:block w-64 ... border-r-2" data-sidebar id="docs-nav">
  <nav ...>
    <!-- IDs derives : docs-nav-section-framework-button, docs-nav-section-framework-panel, etc. -->
  </nav>
</aside>
```

---

## 8. Tests

### 8.1 Fichiers de test

| Fichier | Type | Framework |
|---------|------|-----------|
| `tests/unit/components/layout/sidebar.test.ts` | Unitaire | Vitest + Astro Container |

### 8.2 Tests unitaires (Vitest)

```typescript
// tests/unit/components/layout/sidebar.test.ts
import { describe, it, expect } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import Sidebar from '@components/layout/Sidebar.astro'
import type { NavigationTree } from '@/types/navigation'

// ── Fixtures ────────────────────────────────────────
const MINIMAL_TREE: NavigationTree = {
  framework: [
    { id: 'fw-preambule', label: 'Preambule', href: '/framework/preambule', section: 'framework', order: 1, badge: 'essential' as const },
    { id: 'fw-vision', label: 'Vision & Philosophie', href: '/framework/vision-philosophie', section: 'framework', order: 2 },
    { id: 'fw-ecosysteme', label: 'Ecosysteme', href: '/framework/ecosysteme', section: 'framework', order: 3 },
  ],
  modeOperatoire: [
    { id: 'mo-preambule', label: 'Preambule', href: '/mode-operatoire/preambule', section: 'mode-operatoire', order: 0 },
    { id: 'mo-init', label: 'Initialisation', href: '/mode-operatoire/initialisation', section: 'mode-operatoire', order: 1 },
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
async function renderSidebar(
  props: Record<string, unknown> = {},
  currentPath: string = '/',
) {
  const container = await AstroContainer.create()
  return container.renderToString(Sidebar, {
    props: {
      tree: MINIMAL_TREE,
      ...props,
    },
    request: new Request(`https://aiad.dev${currentPath}`),
  })
}

// ── Tests structure HTML de base ─────────────────────
describe('Sidebar — Structure HTML', () => {
  it('T-01 : rend un <aside> avec data-sidebar', async () => {
    const html = await renderSidebar()
    expect(html).toContain('data-sidebar')
    expect(html).toContain('<aside')
  })

  it('T-02 : rend aria-label "Navigation des documents" sur le aside', async () => {
    const html = await renderSidebar()
    expect(html).toContain('aria-label="Navigation des documents"')
  })

  it('T-03 : rend un <nav> avec aria-label "Sections de documentation"', async () => {
    const html = await renderSidebar()
    expect(html).toContain('aria-label="Sections de documentation"')
    expect(html).toContain('<nav')
  })

  it('T-04 : rend les 3 sections (framework, mode-operatoire, annexes)', async () => {
    const html = await renderSidebar()
    expect(html).toContain('data-sidebar-section="framework"')
    expect(html).toContain('data-sidebar-section="mode-operatoire"')
    expect(html).toContain('data-sidebar-section="annexes"')
  })

  it('T-05 : chaque section a un bouton avec data-sidebar-section-toggle', async () => {
    const html = await renderSidebar()
    const toggleCount = (html.match(/data-sidebar-section-toggle/g) || []).length
    expect(toggleCount).toBe(3)
  })

  it('T-06 : chaque section a un panneau avec data-sidebar-section-panel', async () => {
    const html = await renderSidebar()
    const panelCount = (html.match(/data-sidebar-section-panel/g) || []).length
    expect(panelCount).toBe(3)
  })

  it('T-07 : les boutons section ont aria-expanded', async () => {
    const html = await renderSidebar()
    expect(html).toMatch(/data-sidebar-section-toggle[^>]*aria-expanded/)
  })

  it('T-08 : les boutons section ont aria-controls pointant vers le panneau', async () => {
    const html = await renderSidebar()
    expect(html).toContain('aria-controls="sidebar-section-framework-panel"')
    expect(html).toContain('aria-controls="sidebar-section-mode-operatoire-panel"')
    expect(html).toContain('aria-controls="sidebar-section-annexes-panel"')
  })

  it('T-09 : les panneaux section ont role="region"', async () => {
    const html = await renderSidebar()
    const regionCount = (html.match(/role="region"/g) || []).length
    expect(regionCount).toBeGreaterThanOrEqual(3)
  })

  it('T-10 : les panneaux section ont aria-labelledby pointant vers le bouton', async () => {
    const html = await renderSidebar()
    expect(html).toContain('aria-labelledby="sidebar-section-framework-button"')
    expect(html).toContain('aria-labelledby="sidebar-section-mode-operatoire-button"')
    expect(html).toContain('aria-labelledby="sidebar-section-annexes-button"')
  })

  it('T-11 : les labels des sections sont affiches', async () => {
    const html = await renderSidebar()
    expect(html).toContain('Framework')
    expect(html).toContain('Mode Operatoire')
    expect(html).toContain('Annexes')
  })

  it('T-12 : rend des separateurs entre les sections', async () => {
    const html = await renderSidebar()
    expect(html).toContain('role="separator"')
  })

  it('T-13 : la sidebar est masquee sur mobile (hidden lg:block)', async () => {
    const html = await renderSidebar()
    expect(html).toMatch(/class="[^"]*hidden lg:block/)
  })

  it('T-14 : la sidebar a une largeur de w-64', async () => {
    const html = await renderSidebar()
    expect(html).toMatch(/class="[^"]*w-64/)
  })

  it('T-15 : la sidebar est sticky', async () => {
    const html = await renderSidebar()
    expect(html).toMatch(/class="[^"]*sticky/)
  })
})

// ── Tests items de navigation ─────────────────────────
describe('Sidebar — Items de navigation', () => {
  it('T-16 : rend les items Framework en NavLink sidebar', async () => {
    const html = await renderSidebar()
    expect(html).toContain('href="/framework/preambule"')
    expect(html).toContain('href="/framework/vision-philosophie"')
    expect(html).toContain('href="/framework/ecosysteme"')
  })

  it('T-17 : rend les items Mode Operatoire en NavLink sidebar', async () => {
    const html = await renderSidebar()
    expect(html).toContain('href="/mode-operatoire/preambule"')
    expect(html).toContain('href="/mode-operatoire/initialisation"')
  })

  it('T-18 : rend les categories Annexes avec data-sidebar-category', async () => {
    const html = await renderSidebar()
    expect(html).toContain('data-sidebar-category="annexes-a-templates"')
    expect(html).toContain('data-sidebar-category="annexes-b-roles"')
  })

  it('T-19 : rend les fiches Annexes en NavLink sidebar', async () => {
    const html = await renderSidebar()
    expect(html).toContain('href="/annexes/templates/prd"')
    expect(html).toContain('href="/annexes/templates/architecture"')
    expect(html).toContain('href="/annexes/roles/product-manager"')
  })

  it('T-20 : les categories Annexes ont un bouton depliable', async () => {
    const html = await renderSidebar()
    const catToggleCount = (html.match(/data-sidebar-category-toggle/g) || []).length
    expect(catToggleCount).toBe(2) // 2 categories dans la fixture
  })

  it('T-21 : les categories Annexes ont un panneau depliable', async () => {
    const html = await renderSidebar()
    const catPanelCount = (html.match(/data-sidebar-category-panel/g) || []).length
    expect(catPanelCount).toBe(2)
  })

  it('T-22 : les items sont tries par order', async () => {
    const html = await renderSidebar()
    const preambuleIdx = html.indexOf('Preambule')
    const visionIdx = html.indexOf('Vision &amp; Philosophie')
    const ecosystemeIdx = html.indexOf('Ecosysteme')
    expect(preambuleIdx).toBeLessThan(visionIdx)
    expect(visionIdx).toBeLessThan(ecosystemeIdx)
  })

  it('T-23 : rend le badge essential sur le Preambule Framework', async () => {
    const html = await renderSidebar()
    expect(html).toContain('Essentiel')
  })
})

// ── Tests section active ──────────────────────────────
describe('Sidebar — Section active', () => {
  it('T-24 : section Framework depliee sur /framework/preambule', async () => {
    const html = await renderSidebar({}, '/framework/preambule')
    // Le bouton Framework doit avoir aria-expanded="true"
    expect(html).toMatch(/data-section="framework"[^>]*aria-expanded="true"/)
    // Son panneau ne doit pas etre hidden
    expect(html).toMatch(/id="sidebar-section-framework-panel"[^>]*data-sidebar-section-panel/)
  })

  it('T-25 : section Mode Operatoire depliee sur /mode-operatoire/initialisation', async () => {
    const html = await renderSidebar({}, '/mode-operatoire/initialisation')
    expect(html).toMatch(/data-section="mode-operatoire"[^>]*aria-expanded="true"/)
  })

  it('T-26 : section Annexes depliee sur /annexes/templates/prd', async () => {
    const html = await renderSidebar({}, '/annexes/templates/prd')
    expect(html).toMatch(/data-section="annexes"[^>]*aria-expanded="true"/)
  })

  it('T-27 : categorie A - Templates depliee sur /annexes/templates/prd', async () => {
    const html = await renderSidebar({}, '/annexes/templates/prd')
    // Le bouton de la categorie A doit avoir aria-expanded="true"
    expect(html).toMatch(/data-sidebar-category="annexes-a-templates"[\s\S]*?aria-expanded="true"/)
  })

  it('T-28 : aucune section depliee sur la page d\'accueil', async () => {
    const html = await renderSidebar({}, '/')
    // Tous les boutons section doivent avoir aria-expanded="false"
    const expandedTrueCount = (html.match(/data-sidebar-section-toggle[^>]*aria-expanded="true"/g) || []).length
    expect(expandedTrueCount).toBe(0)
  })

  it('T-29 : sections non actives fermees sur /framework/preambule', async () => {
    const html = await renderSidebar({}, '/framework/preambule')
    expect(html).toMatch(/data-section="mode-operatoire"[^>]*aria-expanded="false"/)
    expect(html).toMatch(/data-section="annexes"[^>]*aria-expanded="false"/)
  })

  it('T-30 : categorie B - Roles fermee sur /annexes/templates/prd', async () => {
    const html = await renderSidebar({}, '/annexes/templates/prd')
    expect(html).toMatch(/data-sidebar-category="annexes-b-roles"[\s\S]*?aria-expanded="false"/)
  })
})

// ── Tests props optionnelles ──────────────────────────
describe('Sidebar — Props optionnelles', () => {
  it('T-31 : classe personnalisee ajoutee au conteneur', async () => {
    const html = await renderSidebar({ class: 'border-r-2' })
    expect(html).toContain('border-r-2')
  })

  it('T-32 : id personnalise utilise comme base', async () => {
    const html = await renderSidebar({ id: 'docs-nav' })
    expect(html).toContain('id="docs-nav"')
    expect(html).toContain('id="docs-nav-section-framework-button"')
    expect(html).toContain('id="docs-nav-section-framework-panel"')
  })

  it('T-33 : id par defaut est "sidebar"', async () => {
    const html = await renderSidebar()
    expect(html).toContain('id="sidebar"')
  })

  it('T-34 : arbre custom override le NAVIGATION_TREE', async () => {
    const customTree: NavigationTree = {
      framework: [{ id: 'custom-item', label: 'Custom', href: '/custom', section: 'framework', order: 1 }],
      modeOperatoire: [],
      annexes: [],
    }
    const html = await renderSidebar({ tree: customTree })
    expect(html).toContain('Custom')
    expect(html).toContain('href="/custom"')
  })

  it('T-35 : arbre vide rend les sections sans items', async () => {
    const html = await renderSidebar({ tree: EMPTY_TREE })
    // Les boutons section sont rendus mais les panneaux sont vides
    expect(html).toContain('data-sidebar-section-toggle')
  })
})

// ── Tests protection XSS ──────────────────────────────
describe('Sidebar — Protection XSS', () => {
  it('T-36 : les labels sont echappes', async () => {
    const xssTree: NavigationTree = {
      framework: [{ id: 'xss', label: '<script>alert("xss")</script>', href: '/test', order: 1 }],
      modeOperatoire: [],
      annexes: [],
    }
    const html = await renderSidebar({ tree: xssTree })
    expect(html).not.toContain('<script>alert')
    expect(html).toContain('&lt;script&gt;')
  })
})
```

### 8.3 Resume des tests

| # | Categorie | Nombre | Description |
|---|-----------|--------|-------------|
| T-01 → T-15 | Structure HTML | 15 | Conteneur, ARIA, sections, responsive, sticky |
| T-16 → T-23 | Items de navigation | 8 | NavLinks, categories, tri, badges |
| T-24 → T-30 | Section active | 7 | Auto-depliement, detection URL, categories actives |
| T-31 → T-35 | Props optionnelles | 5 | class, id, tree, arbre vide |
| T-36 | Protection XSS | 1 | Echappement automatique |
| **Total** | | **36** | |

### 8.4 Assertions cles

| Test | Assertion | Criticite |
|------|-----------|-----------|
| T-01 | Le composant rend un `<aside>` avec `data-sidebar` | Bloquant |
| T-02 | Le `<aside>` a un `aria-label` descriptif | Bloquant |
| T-04 | Les 3 sections sont rendues | Bloquant |
| T-08 | `aria-controls` lie correctement bouton et panneau | Bloquant |
| T-13 | Masque sur mobile (`hidden lg:block`) | Bloquant |
| T-16 | Les items Framework sont rendus avec les bons hrefs | Bloquant |
| T-18 | Les categories Annexes sont rendues | Bloquant |
| T-19 | Les fiches Annexes sont rendues avec les bons hrefs | Bloquant |
| T-24 | Section auto-depliee sur la page active | Bloquant |
| T-27 | Categorie auto-depliee sur la page active | Bloquant |
| T-28 | Aucune section depliee sur la page d'accueil | Bloquant |
| T-36 | Protection XSS (echappement des labels) | Bloquant |

---

## 9. Difference avec MobileMenu (T-004-F5)

| Aspect | Sidebar (T-004-F9) | MobileMenu (T-004-F5) |
|--------|--------------------|-----------------------|
| **Visibilite** | Desktop >= 1024px (`hidden lg:block`) | Mobile/Tablette < 1024px (`lg:hidden`) |
| **Position** | Laterale, sticky, dans le flux | Overlay plein ecran, position fixe |
| **Accordeon sections** | Non exclusif (plusieurs ouvertes) | Exclusif (une seule ouverte) |
| **Accordeon categories** | Exclusif | Exclusif |
| **Focus trap** | Non (pas de modal) | Oui (overlay modal) |
| **Scroll lock** | Non (scroll independant) | Oui (`body.overflow: hidden`) |
| **Bouton hamburger** | Non | Oui |
| **Lien accueil** | Non | Oui (en bas du panneau) |
| **Taille texte** | `text-sm` (14px) | `text-base` (16px) |
| **Enhancement progressif** | Sections actives depliees, navigation OK | Overlay masque sans JS |

---

## 10. Checklist de validation

- [ ] Le composant rend un `<aside>` avec `<nav>` semantique
- [ ] Les 3 sections (Framework, Mode Operatoire, Annexes) sont presentes
- [ ] Chaque section est depliable/repliable au clic
- [ ] L'accordeon est non exclusif (plusieurs sections ouvertes)
- [ ] Les categories Annexes sont des sous-accordeons exclusifs
- [ ] La section active est auto-depliee au chargement
- [ ] La categorie active est auto-depliee au chargement
- [ ] Les items utilisent NavLink en variante `sidebar`
- [ ] L'item actif a `aria-current="page"` et le style actif
- [ ] Les badges sont affiches (essential, new)
- [ ] Les items sont tries par `order`
- [ ] La sidebar est sticky et scrollable
- [ ] Masquee sur mobile (`hidden lg:block`)
- [ ] ARIA : `aria-expanded`, `aria-controls`, `aria-labelledby`, `role="region"`
- [ ] Focus visible sur tous les elements interactifs
- [ ] Contraste conforme WCAG AA
- [ ] Protection XSS (echappement automatique)
- [ ] 36 tests passent
- [ ] Enhancement progressif : navigable sans JavaScript

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 12/02/2026 | Creation initiale |
