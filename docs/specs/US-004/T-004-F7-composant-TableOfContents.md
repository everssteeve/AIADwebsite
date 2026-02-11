# T-004-F7 : Composant TableOfContents sticky (extraction automatique des headings h2-h4)

| Metadonnee | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 11 fevrier 2026 |
| **Statut** | A faire |
| **User Story** | [US-004 - Naviguer facilement dans le framework](./spec-US-004.md) |
| **Dependances** | T-004-B1 (Types TypeScript navigation) |
| **Bloque** | T-004-F10 (DocsLayout), T-004-T3 (Tests composants atomiques) |

---

## 1. Objectif

Creer le composant **TableOfContents** qui affiche une table des matieres interactive en position sticky dans la colonne droite des pages de documentation. Ce composant fournit :

- Un **rendu statique** de la liste des headings h2-h4 de la page courante, avec indentation hierarchique
- Un **scroll spy** cote client qui met en surbrillance le heading actuellement visible dans le viewport
- Un **smooth scroll** vers le heading clique
- Un mode **collapsible** sur mobile (< 768px) pour ne pas encombrer l'ecran
- La compatibilite avec le type `TableOfContentsItem` defini en T-004-B1
- **Progressive enhancement** : la TOC fonctionne sans JavaScript (liens d'ancrage classiques), le scroll spy et le smooth scroll enrichissent l'experience quand JS est disponible

Ce composant est consomme par le layout `DocsLayout` (T-004-F10) et s'affiche dans la colonne de droite du layout documentation.

---

## 2. Contexte technique

### 2.1 Stack

| Technologie | Version | Role |
|-------------|---------|------|
| Astro | 4.x | Composant avec island architecture (`client:idle`) |
| TypeScript | 5.x | Typage strict des props |
| Tailwind CSS | 3.x | Utility-first, positionnement sticky, responsive |

### 2.2 Arborescence

```
src/
├── components/
│   └── layout/
│       ├── NavLink.astro              # T-004-F2 (reference de style)
│       └── TableOfContents.astro      <-- CE COMPOSANT
├── types/
│   └── navigation.ts                  # Types TableOfContentsItem, TOCHeadingDepth (T-004-B1)
├── layouts/
│   ├── BaseLayout.astro               # Layout racine (T-004-F1)
│   └── DocsLayout.astro               # Layout docs (T-004-F10) — consommateur
└── pages/
    └── framework/
        └── [...slug].astro            # Pages qui fournissent les headings
```

### 2.3 Position dans l'architecture des composants

```
TableOfContents.astro               <-- CE COMPOSANT (composant atomique)
└── DocsLayout.astro (T-004-F10)   <-- Consommateur (colonne droite)
    ├── framework/[...slug].astro   <-- Fournisseur des headings via render()
    └── mode-operatoire/[...slug].astro
```

### 2.4 Dependance T-004-B1

Le composant utilise les types suivants de `src/types/navigation.ts` :

```typescript
import type { TableOfContentsItem, TableOfContentsList } from '@/types/navigation'
```

- `TableOfContentsItem` : `{ depth: 2 | 3 | 4; text: string; slug: string }` — item de heading
- `TableOfContentsList` : alias pour `TableOfContentsItem[]`

### 2.5 Comment Astro fournit les headings

Astro extrait automatiquement les headings lors du rendu d'un fichier MDX :

```astro
---
// Dans [...slug].astro ou DocsLayout.astro
const { Content, headings } = await post.render()
// headings: { depth: number; text: string; slug: string }[]
---
<TableOfContents headings={headings} />
```

Le tableau `headings` fourni par Astro correspond exactement a la structure de `TableOfContentsItem`. Le composant filtre les headings pour ne garder que les niveaux 2 a 4 (h2, h3, h4).

### 2.6 Conventions suivies

| Convention | Detail |
|-----------|--------|
| Nommage fichier | PascalCase dans `src/components/layout/` |
| TypeScript | Mode strict, props typees via `interface Props` |
| Imports | Alias `@/*` pour `src/*` |
| Design | Coherent avec NavLink (focus ring `ring-2 ring-offset-2`, couleurs `blue-600/700`) |
| Formatage | Prettier : pas de semicolons, single quotes, 2 espaces |
| Island | `client:idle` pour le scroll spy (JS differe, non bloquant) |

---

## 3. Specifications fonctionnelles

### 3.1 Description

Le composant `TableOfContents` est une **table des matieres sticky** qui :

1. Recoit un tableau de `headings` (h2-h4) depuis le parent (DocsLayout)
2. Filtre les headings pour ne garder que les niveaux 2, 3 et 4
3. Rend une liste hierarchique avec **indentation** par niveau (h2 = niveau 0, h3 = indente, h4 = double indente)
4. Chaque item est un **lien d'ancrage** (`<a href="#slug">`) vers le heading correspondant
5. En **position sticky** sur desktop, la TOC suit le scroll dans la colonne droite
6. Le **scroll spy** (cote client) detecte le heading visible et le met en surbrillance
7. Sur **mobile** (< 768px), la TOC est **collapsible** avec un bouton toggle

### 3.2 Scroll spy (JavaScript cote client)

Le scroll spy utilise l'API `IntersectionObserver` pour detecter quel heading est actuellement visible :

| Aspect | Detail |
|--------|--------|
| **API** | `IntersectionObserver` |
| **Seuil** | `rootMargin: '0px 0px -80% 0px'` (le heading est considere actif quand il entre dans les 20% superieurs du viewport) |
| **Comportement** | Le dernier heading entre dans la zone active est marque comme actif |
| **Mise a jour** | La classe active est ajoutee/retiree dynamiquement sur le lien correspondant |
| **Fallback** | Sans JS, aucun heading n'est mis en surbrillance (tous les liens restent inactifs visuellement) |

### 3.3 Smooth scroll

Quand l'utilisateur clique sur un item de la TOC :

| Aspect | Detail |
|--------|--------|
| **Methode** | `element.scrollIntoView({ behavior: 'smooth', block: 'start' })` |
| **Offset** | Un `scroll-margin-top` est applique aux headings cibles via CSS global pour compenser le header fixe |
| **Fallback** | Sans JS, le navigateur saute directement a l'ancre (comportement par defaut des liens `#slug`) |
| **URL** | Le hash de l'URL est mis a jour via `history.replaceState()` sans declencher de scroll supplementaire |

### 3.4 Positionnement sticky

```
Desktop (>= 1024px) :
┌──────────────────────────────────────────────────────────────────┐
│  SIDEBAR   │         CONTENU PRINCIPAL       │  TABLE DES       │
│            │                                 │  MATIERES        │
│            │                                 │  (sticky top-24) │
│            │  ## Section 1 ← active          │  • Section 1 ●   │
│            │  Lorem ipsum...                 │  • Section 2     │
│            │                                 │    ├ Sous-sect.  │
│            │  ## Section 2                   │  • Section 3     │
│            │  Lorem ipsum...                 │                  │
└──────────────────────────────────────────────────────────────────┘

Mobile (< 768px) :
┌──────────────────────────┐
│  [Table des matieres ▾]  │ ← Bouton toggle (ferme par defaut)
│                          │
│  ## Section 1            │
│  Lorem ipsum...          │
└──────────────────────────┘

Tablette (768px - 1023px) :
La TOC est masquee (meme comportement que mobile).
```

| Breakpoint | Comportement |
|-----------|-------------|
| `< 1024px` | TOC masquee par defaut, affichee via bouton toggle collapsible |
| `>= 1024px` | TOC visible en position `sticky` dans la colonne droite, `top: 6rem` (compense le header) |

### 3.5 Hierarchie visuelle

| Niveau | Element | Indentation | Style |
|--------|---------|-------------|-------|
| h2 | Lien principal | `pl-0` | `text-sm font-medium text-gray-700` |
| h3 | Sous-lien | `pl-4` | `text-sm text-gray-600` |
| h4 | Sous-sous-lien | `pl-8` | `text-xs text-gray-500` |

### 3.6 Etats visuels des items

| Etat | Style |
|------|-------|
| Inactif | Texte `gray-600/700`, hover `text-gray-900` |
| Actif (scroll spy) | Texte `blue-700`, bordure gauche `border-l-2 border-blue-600`, fond `bg-blue-50/50` |
| Focus (clavier) | `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2` |

### 3.7 Accessibilite (RGAA AA)

| Critere | Implementation | Reference RGAA |
|---------|----------------|----------------|
| Semantique | `<nav aria-label="Table des matieres">` | 12.6 |
| Liste | `<ul>` / `<li>` pour la structure hierarchique | 8.2 |
| Liens | `<a href="#slug">` pour chaque heading | 6.1 |
| Etat courant | `aria-current="true"` sur l'item actif (scroll spy) | 12.2 |
| Focus visible | `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2` | 10.7 |
| Contraste | Ratio >= 4.5:1 pour tous les etats | 3.2 |
| Toggle mobile | `<button aria-expanded="true/false" aria-controls="toc-list">` | 7.1 |
| Region cachee | `<div id="toc-list" hidden>` quand ferme sur mobile | 10.1 |
| Label titre | Titre "Sur cette page" affiche au-dessus de la liste | 12.6 |

### 3.8 Cas de la TOC vide

Si le tableau `headings` est vide ou ne contient aucun heading h2-h4, le composant **ne rend rien** (pas de `<nav>`, pas de wrapper). Cela evite un espace vide dans la colonne droite.

---

## 4. Specifications techniques

### 4.1 Interface TypeScript

```typescript
// src/components/layout/TableOfContents.astro (frontmatter)

import type { TableOfContentsItem } from '@/types/navigation'

/**
 * Props du composant TableOfContents.
 *
 * Table des matieres sticky avec scroll spy et navigation par ancres.
 * Consomme les headings extraits par Astro lors du rendu MDX.
 *
 * @example
 * ```astro
 * ---
 * import TableOfContents from '@components/layout/TableOfContents.astro'
 * const { Content, headings } = await post.render()
 * ---
 * <TableOfContents headings={headings} />
 * ```
 */
export interface Props {
  // ── Donnees ──────────────────────────────────────

  /**
   * Tableau des headings de la page.
   * Fourni par Astro via `post.render()`.
   * Filtre automatiquement pour ne garder que h2-h4.
   */
  headings: TableOfContentsItem[]

  // ── Configuration ────────────────────────────────

  /**
   * Titre affiche au-dessus de la liste.
   * @default 'Sur cette page'
   */
  title?: string

  /**
   * Profondeur minimale de heading a afficher.
   * @default 2
   */
  minDepth?: 2 | 3 | 4

  /**
   * Profondeur maximale de heading a afficher.
   * @default 4
   */
  maxDepth?: 2 | 3 | 4

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
// src/components/layout/TableOfContents.astro

import type { TableOfContentsItem } from '@/types/navigation'

export interface Props {
  headings: TableOfContentsItem[]
  title?: string
  minDepth?: 2 | 3 | 4
  maxDepth?: 2 | 3 | 4
  class?: string
}

const {
  headings,
  title = 'Sur cette page',
  minDepth = 2,
  maxDepth = 4,
  class: className = '',
} = Astro.props

// ── Filtrer les headings par profondeur ──────────────
const filteredHeadings = headings.filter(
  (h) => h.depth >= minDepth && h.depth <= maxDepth,
)

// ── Classes d'indentation par niveau ─────────────────
const depthClasses: Record<number, string> = {
  2: 'pl-0',
  3: 'pl-4',
  4: 'pl-8',
}

// ── Classes de style par niveau ──────────────────────
const depthTextClasses: Record<number, string> = {
  2: 'text-sm font-medium text-gray-700',
  3: 'text-sm text-gray-600',
  4: 'text-xs text-gray-500',
}
---

{filteredHeadings.length > 0 && (
  <nav
    aria-label="Table des matieres"
    class:list={[
      'toc-container',
      className,
    ]}
    data-toc
  >
    {/* ── Desktop : sticky, toujours visible ──────────── */}
    <div class="hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
        {title}
      </p>
      <ul class="space-y-1 border-l border-gray-200" data-toc-list>
        {filteredHeadings.map((heading) => (
          <li>
            <a
              href={`#${heading.slug}`}
              class:list={[
                'block py-1 -ml-px border-l-2 border-transparent transition-colors duration-150',
                'hover:text-gray-900 hover:border-gray-300',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm',
                depthClasses[heading.depth],
                depthTextClasses[heading.depth],
              ]}
              data-toc-link={heading.slug}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>

    {/* ── Mobile/Tablette : collapsible ───────────────── */}
    <div class="lg:hidden" data-toc-mobile>
      <button
        type="button"
        class="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
        aria-expanded="false"
        aria-controls="toc-mobile-list"
        data-toc-toggle
      >
        <span>{title}</span>
        <svg
          class="h-5 w-5 text-gray-400 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          data-toc-chevron
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <ul
        id="toc-mobile-list"
        class="mt-2 space-y-1 border-l border-gray-200 pl-2"
        hidden
        data-toc-mobile-list
      >
        {filteredHeadings.map((heading) => (
          <li>
            <a
              href={`#${heading.slug}`}
              class:list={[
                'block py-1.5 -ml-px border-l-2 border-transparent transition-colors duration-150',
                'hover:text-gray-900 hover:border-gray-300',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm',
                depthClasses[heading.depth],
                depthTextClasses[heading.depth],
              ]}
              data-toc-link={heading.slug}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </nav>
)}

<script>
  /**
   * TableOfContents — Script cote client
   *
   * Fonctionnalites :
   * 1. Scroll spy via IntersectionObserver
   * 2. Smooth scroll sur clic des liens
   * 3. Toggle mobile (ouvrir/fermer la TOC)
   *
   * Progressive enhancement : sans ce script, les liens d'ancrage
   * fonctionnent toujours (saut natif du navigateur).
   */

  function initTableOfContents(): void {
    const tocContainer = document.querySelector('[data-toc]')
    if (!tocContainer) return

    // ── Scroll spy ────────────────────────────────────
    const tocLinks = tocContainer.querySelectorAll<HTMLAnchorElement>('[data-toc-link]')
    if (tocLinks.length === 0) return

    const headingElements = Array.from(tocLinks)
      .map((link) => {
        const slug = link.getAttribute('data-toc-link')
        return slug ? document.getElementById(slug) : null
      })
      .filter((el): el is HTMLElement => el !== null)

    let activeLink: HTMLAnchorElement | null = null

    function setActiveLink(slug: string): void {
      // Retirer l'etat actif du lien precedent
      if (activeLink) {
        activeLink.classList.remove(
          'text-blue-700', 'border-blue-600', 'bg-blue-50/50', 'font-medium',
        )
        activeLink.classList.add('border-transparent')
        activeLink.removeAttribute('aria-current')
      }

      // Appliquer l'etat actif au nouveau lien
      const links = tocContainer.querySelectorAll<HTMLAnchorElement>(
        `[data-toc-link="${slug}"]`,
      )
      links.forEach((link) => {
        link.classList.add(
          'text-blue-700', 'border-blue-600', 'bg-blue-50/50', 'font-medium',
        )
        link.classList.remove('border-transparent')
        link.setAttribute('aria-current', 'true')
        activeLink = link
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id)
          }
        }
      },
      {
        rootMargin: '0px 0px -80% 0px',
        threshold: 0,
      },
    )

    headingElements.forEach((heading) => observer.observe(heading))

    // ── Smooth scroll ─────────────────────────────────
    tocLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault()
        const slug = link.getAttribute('data-toc-link')
        if (!slug) return

        const target = document.getElementById(slug)
        if (!target) return

        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        history.replaceState(null, '', `#${slug}`)

        // Fermer le menu mobile apres navigation
        const mobileList = tocContainer.querySelector('[data-toc-mobile-list]')
        const toggleBtn = tocContainer.querySelector('[data-toc-toggle]')
        if (mobileList && !mobileList.hasAttribute('hidden')) {
          mobileList.setAttribute('hidden', '')
          toggleBtn?.setAttribute('aria-expanded', 'false')
          const chevron = toggleBtn?.querySelector('[data-toc-chevron]')
          chevron?.classList.remove('rotate-180')
        }
      })
    })

    // ── Toggle mobile ─────────────────────────────────
    const toggleBtn = tocContainer.querySelector('[data-toc-toggle]')
    const mobileList = tocContainer.querySelector('[data-toc-mobile-list]')

    if (toggleBtn && mobileList) {
      toggleBtn.addEventListener('click', () => {
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true'

        if (isExpanded) {
          mobileList.setAttribute('hidden', '')
          toggleBtn.setAttribute('aria-expanded', 'false')
        } else {
          mobileList.removeAttribute('hidden')
          toggleBtn.setAttribute('aria-expanded', 'true')
        }

        // Rotation du chevron
        const chevron = toggleBtn.querySelector('[data-toc-chevron]')
        chevron?.classList.toggle('rotate-180')
      })
    }
  }

  // Initialiser quand le DOM est pret
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTableOfContents)
  } else {
    initTableOfContents()
  }
</script>
```

### 4.3 Data attributes

| Attribut | Element | Usage |
|----------|---------|-------|
| `data-toc` | `<nav>` | Selecteur racine pour les tests et le script |
| `data-toc-list` | `<ul>` (desktop) | Liste desktop des items |
| `data-toc-link` | `<a>` | Selecteur des liens avec le slug comme valeur |
| `data-toc-mobile` | `<div>` | Wrapper mobile |
| `data-toc-toggle` | `<button>` | Bouton toggle mobile |
| `data-toc-chevron` | `<svg>` | Chevron animable du bouton toggle |
| `data-toc-mobile-list` | `<ul>` | Liste mobile des items |

### 4.4 Exemples d'utilisation

#### Utilisation standard dans DocsLayout

```astro
---
// src/layouts/DocsLayout.astro
import BaseLayout from './BaseLayout.astro'
import TableOfContents from '@components/layout/TableOfContents.astro'

interface Props {
  title: string
  description: string
  headings: { depth: number; text: string; slug: string }[]
}

const { title, description, headings } = Astro.props
---

<BaseLayout title={title} description={description}>
  <div class="flex">
    <!-- Sidebar (T-004-F9) -->
    <main class="flex-1 px-8 py-12">
      <slot />
    </main>
    <aside class="hidden lg:block w-64 shrink-0 px-4 py-12">
      <TableOfContents headings={headings} />
    </aside>
  </div>
</BaseLayout>
```

#### Avec titre personnalise

```astro
<TableOfContents headings={headings} title="Sommaire" />
```

#### Filtrer les profondeurs

```astro
<!-- Uniquement h2 et h3 (pas de h4) -->
<TableOfContents headings={headings} maxDepth={3} />

<!-- Uniquement h2 -->
<TableOfContents headings={headings} maxDepth={2} />
```

#### Avec classe personnalisee

```astro
<TableOfContents headings={headings} class="border rounded-lg p-4" />
```

---

## 5. Design et Style

### 5.1 Palette de couleurs par etat

| Etat | Texte | Fond | Bordure |
|------|-------|------|---------|
| Inactif (h2) | `text-gray-700` (#374151) | transparent | `border-transparent` |
| Inactif (h3) | `text-gray-600` (#4B5563) | transparent | `border-transparent` |
| Inactif (h4) | `text-gray-500` (#6B7280) | transparent | `border-transparent` |
| Hover | `text-gray-900` (#111827) | transparent | `border-gray-300` (#D1D5DB) |
| Actif (scroll spy) | `text-blue-700` (#1D4ED8) | `bg-blue-50/50` | `border-l-2 border-blue-600` (#2563EB) |
| Focus | — | — | `ring-2 ring-blue-500 ring-offset-2` |
| Titre | `text-gray-500` (#6B7280) | — | — |

### 5.2 Verification du contraste (WCAG AA)

| Combinaison | Ratio | Conforme AA ? |
|-------------|-------|---------------|
| `gray-700` (#374151) sur `white` (#FFFFFF) | 9.12:1 | Oui (>= 4.5:1) |
| `gray-600` (#4B5563) sur `white` (#FFFFFF) | 7.00:1 | Oui (>= 4.5:1) |
| `gray-500` (#6B7280) sur `white` (#FFFFFF) | 4.64:1 | Oui (>= 4.5:1) |
| `gray-900` (#111827) sur `white` (#FFFFFF) | 16.75:1 | Oui (>= 4.5:1) |
| `blue-700` (#1D4ED8) sur `white` (#FFFFFF) | 5.43:1 | Oui (>= 4.5:1) |
| `blue-700` (#1D4ED8) sur `blue-50/50` | ~5.1:1 | Oui (>= 4.5:1) |
| `gray-500` (#6B7280) titre uppercase | 4.64:1 | Oui (>= 4.5:1 pour texte 12px+ uppercase) |

### 5.3 Dimensions et espacement

| Element | Style | Detail |
|---------|-------|--------|
| Container desktop | `sticky top-24 max-h-[calc(100vh-8rem)]` | Sticky sous le header (6rem), max hauteur viewport - 8rem |
| Container desktop | `overflow-y-auto` | Scroll interne si la TOC depasse le viewport |
| Titre | `text-xs font-semibold uppercase tracking-wider mb-3` | Petit texte, tout en majuscules |
| Items | `py-1` (desktop), `py-1.5` (mobile) | Espacement vertical entre items |
| Bordure gauche | `border-l border-gray-200` (liste), `border-l-2` (item actif) | Ligne de guidage visuel |
| Bouton mobile | `px-4 py-3 rounded-lg` | Zone tactile >= 44px |
| Largeur | Heritee du parent (`w-64` dans DocsLayout) | Fixee par le layout parent |

### 5.4 Coherence avec le design system

| Aspect | Conformite |
|--------|------------|
| Focus ring | `ring-2 ring-blue-500 ring-offset-2` — coherent avec NavLink et CTAButton |
| Couleurs actives | `blue-600/700/50` — coherent avec NavLink sidebar active |
| Transition | `transition-colors duration-150` — coherent avec NavLink |
| Bordure gauche active | `border-l-2 border-blue-600` — coherent avec NavLink sidebar active |
| Chevron | Meme SVG que NavLink (`M19 9l-7 7-7-7`), avec animation `rotate-180` |

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Matrice des cas limites

| ID | Cas | Comportement attendu | Priorite |
|----|-----|----------------------|----------|
| CL-01 | `headings` est un tableau vide | Le composant ne rend rien (pas de `<nav>`) | Haute |
| CL-02 | Aucun heading h2-h4 apres filtrage | Le composant ne rend rien | Haute |
| CL-03 | Uniquement des h2 | Rendu sans indentation, tous au meme niveau | Haute |
| CL-04 | Uniquement des h3 et h4 (pas de h2) | Rendu avec indentation relative (h3 = `pl-4`, h4 = `pl-8`) | Moyenne |
| CL-05 | H4 sans h3 parent (saut de niveau) | Rendu normalement avec son indentation `pl-8` | Moyenne |
| CL-06 | Heading avec texte tres long (> 60 caracteres) | Texte tronque avec `line-clamp-2` implicite par la largeur fixe du container | Moyenne |
| CL-07 | Heading avec caracteres speciaux (HTML, accents) | Echappe automatiquement par Astro dans le template | Haute |
| CL-08 | Heading avec slug contenant des caracteres speciaux | Le slug est genere par Astro (safe par construction) | Basse |
| CL-09 | Page sans JavaScript (progressive enhancement) | Liens d'ancrage fonctionnent, pas de scroll spy, pas de smooth scroll | Haute |
| CL-10 | Toggle mobile : clic quand ferme | La liste s'ouvre, `aria-expanded="true"`, chevron pivote 180deg | Haute |
| CL-11 | Toggle mobile : clic quand ouvert | La liste se ferme, `aria-expanded="false"`, chevron revient | Haute |
| CL-12 | Clic sur un item mobile | Smooth scroll vers le heading, la TOC se referme | Haute |
| CL-13 | Scroll spy : premier heading visible | Premier item marque comme actif | Haute |
| CL-14 | Scroll spy : dernier heading visible | Dernier item marque comme actif | Haute |
| CL-15 | Scroll spy : aucun heading visible (haut de page) | Aucun item actif (tous inactifs) | Moyenne |
| CL-16 | Heading cible introuvable dans le DOM (`getElementById` retourne null) | Le clic ne fait rien, pas d'erreur | Moyenne |
| CL-17 | Redimensionnement fenetre (mobile → desktop) | Les deux versions sont rendues, `hidden lg:block` / `lg:hidden` gere le switch | Basse |
| CL-18 | `minDepth` > `maxDepth` | Aucun heading ne passe le filtre, composant ne rend rien | Basse |
| CL-19 | `title` personnalise | Le titre fourni est affiche a la place de "Sur cette page" | Basse |
| CL-20 | `class` personnalise | Classe ajoutee au `<nav>` sans remplacer les classes existantes | Basse |
| CL-21 | Tres grand nombre de headings (> 30) | `overflow-y-auto` sur desktop permet le scroll interne | Moyenne |
| CL-22 | Heading avec le meme slug (doublon) | Le scroll spy et les liens ciblent le premier element avec ce slug | Basse |

### 6.2 Strategie de fallback

```
Props manquantes ?
├── headings: REQUIS (TypeScript l'impose)
│   ├── vide [] → pas de rendu
│   └── pas de h2-h4 → pas de rendu
├── title: non fourni → 'Sur cette page'
├── minDepth: non fourni → 2
├── maxDepth: non fourni → 4
└── class: non fourni → '' (pas de classes additionnelles)

JavaScript indisponible ?
├── Liens d'ancrage → fonctionnent (href="#slug")
├── Scroll spy → non actif (aucun item en surbrillance)
├── Smooth scroll → saut natif du navigateur
└── Toggle mobile → la liste reste cachee (hidden)
    └── AMELIORATION : ajouter <noscript> avec la liste visible
```

---

## 7. Exemples entree/sortie

### 7.1 Page avec headings h2, h3 et h4

**Entree :**

```typescript
const headings = [
  { depth: 2, text: 'Vision', slug: 'vision' },
  { depth: 3, text: 'Principes fondateurs', slug: 'principes-fondateurs' },
  { depth: 3, text: 'Valeurs cles', slug: 'valeurs-cles' },
  { depth: 2, text: 'Philosophie', slug: 'philosophie' },
  { depth: 3, text: 'Approche iterative', slug: 'approche-iterative' },
  { depth: 4, text: 'Boucle de feedback', slug: 'boucle-de-feedback' },
]
```

```astro
<TableOfContents headings={headings} />
```

**Sortie HTML (desktop, simplifie) :**

```html
<nav aria-label="Table des matieres" data-toc>
  <div class="hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
    <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
      Sur cette page
    </p>
    <ul class="space-y-1 border-l border-gray-200" data-toc-list>
      <li>
        <a href="#vision"
           class="block py-1 -ml-px border-l-2 border-transparent transition-colors duration-150 hover:text-gray-900 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm pl-0 text-sm font-medium text-gray-700"
           data-toc-link="vision">
          Vision
        </a>
      </li>
      <li>
        <a href="#principes-fondateurs"
           class="block py-1 -ml-px border-l-2 border-transparent transition-colors duration-150 hover:text-gray-900 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm pl-4 text-sm text-gray-600"
           data-toc-link="principes-fondateurs">
          Principes fondateurs
        </a>
      </li>
      <li>
        <a href="#valeurs-cles"
           class="... pl-4 text-sm text-gray-600"
           data-toc-link="valeurs-cles">
          Valeurs cles
        </a>
      </li>
      <li>
        <a href="#philosophie"
           class="... pl-0 text-sm font-medium text-gray-700"
           data-toc-link="philosophie">
          Philosophie
        </a>
      </li>
      <li>
        <a href="#approche-iterative"
           class="... pl-4 text-sm text-gray-600"
           data-toc-link="approche-iterative">
          Approche iterative
        </a>
      </li>
      <li>
        <a href="#boucle-de-feedback"
           class="... pl-8 text-xs text-gray-500"
           data-toc-link="boucle-de-feedback">
          Boucle de feedback
        </a>
      </li>
    </ul>
  </div>
  <!-- Version mobile (simplifiee pour lisibilite) -->
  <div class="lg:hidden" data-toc-mobile>
    <button type="button" aria-expanded="false" aria-controls="toc-mobile-list" data-toc-toggle class="...">
      <span>Sur cette page</span>
      <svg data-toc-chevron>...</svg>
    </button>
    <ul id="toc-mobile-list" hidden data-toc-mobile-list class="...">
      <!-- Meme contenu que la version desktop -->
    </ul>
  </div>
</nav>
```

### 7.2 Page avec uniquement des h2

**Entree :**

```typescript
const headings = [
  { depth: 2, text: 'Introduction', slug: 'introduction' },
  { depth: 2, text: 'Methodologie', slug: 'methodologie' },
  { depth: 2, text: 'Conclusion', slug: 'conclusion' },
]
```

**Sortie HTML (desktop, items uniquement) :**

```html
<ul class="space-y-1 border-l border-gray-200" data-toc-list>
  <li>
    <a href="#introduction" class="... pl-0 text-sm font-medium text-gray-700" data-toc-link="introduction">
      Introduction
    </a>
  </li>
  <li>
    <a href="#methodologie" class="... pl-0 text-sm font-medium text-gray-700" data-toc-link="methodologie">
      Methodologie
    </a>
  </li>
  <li>
    <a href="#conclusion" class="... pl-0 text-sm font-medium text-gray-700" data-toc-link="conclusion">
      Conclusion
    </a>
  </li>
</ul>
```

### 7.3 Headings vides — pas de rendu

**Entree :**

```astro
<TableOfContents headings={[]} />
```

**Sortie HTML :**

```html
<!-- Rien n'est rendu -->
```

### 7.4 Filtrage avec maxDepth=3

**Entree :**

```typescript
const headings = [
  { depth: 2, text: 'Vision', slug: 'vision' },
  { depth: 3, text: 'Principes', slug: 'principes' },
  { depth: 4, text: 'Detail', slug: 'detail' }, // Filtre (4 > maxDepth=3)
]
```

```astro
<TableOfContents headings={headings} maxDepth={3} />
```

**Sortie :** Seuls "Vision" et "Principes" sont rendus. "Detail" est exclu.

### 7.5 Avec titre personnalise

**Entree :**

```astro
<TableOfContents headings={headings} title="Sommaire" />
```

**Sortie HTML (titre) :**

```html
<p class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
  Sommaire
</p>
```

### 7.6 Etat actif (scroll spy, apres execution JS)

Quand le heading `#philosophie` est visible dans le viewport, le script ajoute les classes actives :

**Avant (statique) :**

```html
<a href="#philosophie"
   class="... border-transparent ... text-sm font-medium text-gray-700"
   data-toc-link="philosophie">
  Philosophie
</a>
```

**Apres (scroll spy actif) :**

```html
<a href="#philosophie"
   class="... border-blue-600 bg-blue-50/50 text-blue-700 font-medium"
   aria-current="true"
   data-toc-link="philosophie">
  Philosophie
</a>
```

### 7.7 Protection XSS

**Entree :**

```typescript
const headings = [
  { depth: 2, text: '<script>alert("xss")</script>', slug: 'xss-test' },
]
```

**Sortie HTML :**

```html
<a href="#xss-test" class="..." data-toc-link="xss-test">
  &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;
</a>
```

---

## 8. Tests

### 8.1 Fichiers de test

| Fichier | Type | Framework |
|---------|------|-----------|
| `tests/unit/components/layout/table-of-contents.test.ts` | Unitaire | Vitest + Astro Container |

### 8.2 Tests unitaires (Vitest)

```typescript
// tests/unit/components/layout/table-of-contents.test.ts
import { describe, it, expect } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import TableOfContents from '@components/layout/TableOfContents.astro'

// ── Fixtures ─────────────────────────────────────────────

const SAMPLE_HEADINGS = [
  { depth: 2, text: 'Vision', slug: 'vision' },
  { depth: 3, text: 'Principes fondateurs', slug: 'principes-fondateurs' },
  { depth: 3, text: 'Valeurs cles', slug: 'valeurs-cles' },
  { depth: 2, text: 'Philosophie', slug: 'philosophie' },
  { depth: 3, text: 'Approche iterative', slug: 'approche-iterative' },
  { depth: 4, text: 'Boucle de feedback', slug: 'boucle-de-feedback' },
]

const H2_ONLY_HEADINGS = [
  { depth: 2, text: 'Introduction', slug: 'introduction' },
  { depth: 2, text: 'Methodologie', slug: 'methodologie' },
  { depth: 2, text: 'Conclusion', slug: 'conclusion' },
]

// ── Helpers ──────────────────────────────────────────────

async function renderTOC(
  props: Record<string, unknown> = {},
) {
  const container = await AstroContainer.create()
  return container.renderToString(TableOfContents, {
    props: {
      headings: SAMPLE_HEADINGS,
      ...props,
    },
  })
}

// ── Tests rendu conditionnel ─────────────────────────────

describe('TableOfContents — Rendu conditionnel', () => {
  it('T-01 : ne rend rien quand headings est vide', async () => {
    const html = await renderTOC({ headings: [] })
    expect(html).not.toContain('<nav')
    expect(html).not.toContain('data-toc')
  })

  it('T-02 : ne rend rien quand aucun heading ne passe le filtre', async () => {
    const headings = [{ depth: 1, text: 'H1 titre', slug: 'h1-titre' }]
    const html = await renderTOC({ headings })
    expect(html).not.toContain('<nav')
  })

  it('T-03 : rend le composant quand il y a des headings valides', async () => {
    const html = await renderTOC()
    expect(html).toContain('<nav')
    expect(html).toContain('data-toc')
  })
})

// ── Tests structure HTML ──────────────────────────────────

describe('TableOfContents — Structure HTML', () => {
  it('T-04 : genere un element <nav> avec aria-label', async () => {
    const html = await renderTOC()
    expect(html).toContain('<nav')
    expect(html).toContain('aria-label="Table des matieres"')
  })

  it('T-05 : contient une liste <ul> pour les items', async () => {
    const html = await renderTOC()
    expect(html).toContain('<ul')
    expect(html).toContain('</ul>')
  })

  it('T-06 : contient un lien <a> pour chaque heading', async () => {
    const html = await renderTOC()
    expect(html).toContain('href="#vision"')
    expect(html).toContain('href="#principes-fondateurs"')
    expect(html).toContain('href="#philosophie"')
    expect(html).toContain('href="#approche-iterative"')
    expect(html).toContain('href="#boucle-de-feedback"')
  })

  it('T-07 : chaque lien a le data-toc-link avec le slug', async () => {
    const html = await renderTOC()
    expect(html).toContain('data-toc-link="vision"')
    expect(html).toContain('data-toc-link="principes-fondateurs"')
    expect(html).toContain('data-toc-link="philosophie"')
  })

  it('T-08 : affiche le texte de chaque heading', async () => {
    const html = await renderTOC()
    expect(html).toContain('Vision')
    expect(html).toContain('Principes fondateurs')
    expect(html).toContain('Philosophie')
    expect(html).toContain('Boucle de feedback')
  })
})

// ── Tests titre ───────────────────────────────────────────

describe('TableOfContents — Titre', () => {
  it('T-09 : affiche le titre par defaut "Sur cette page"', async () => {
    const html = await renderTOC()
    expect(html).toContain('Sur cette page')
  })

  it('T-10 : affiche un titre personnalise', async () => {
    const html = await renderTOC({ title: 'Sommaire' })
    expect(html).toContain('Sommaire')
  })

  it('T-11 : le titre a le style uppercase', async () => {
    const html = await renderTOC()
    expect(html).toContain('uppercase')
    expect(html).toContain('tracking-wider')
  })
})

// ── Tests indentation par profondeur ──────────────────────

describe('TableOfContents — Indentation', () => {
  it('T-12 : h2 a l\'indentation pl-0', async () => {
    const html = await renderTOC({ headings: [{ depth: 2, text: 'Test', slug: 'test' }] })
    expect(html).toContain('pl-0')
  })

  it('T-13 : h3 a l\'indentation pl-4', async () => {
    const html = await renderTOC({ headings: [{ depth: 3, text: 'Test', slug: 'test' }] })
    expect(html).toContain('pl-4')
  })

  it('T-14 : h4 a l\'indentation pl-8', async () => {
    const html = await renderTOC({ headings: [{ depth: 4, text: 'Test', slug: 'test' }] })
    expect(html).toContain('pl-8')
  })
})

// ── Tests styles par profondeur ──────────────────────────

describe('TableOfContents — Styles par profondeur', () => {
  it('T-15 : h2 a le style text-sm font-medium text-gray-700', async () => {
    const html = await renderTOC({ headings: [{ depth: 2, text: 'Test', slug: 'test' }] })
    expect(html).toContain('font-medium')
    expect(html).toContain('text-gray-700')
  })

  it('T-16 : h3 a le style text-sm text-gray-600', async () => {
    const html = await renderTOC({ headings: [{ depth: 3, text: 'Test', slug: 'test' }] })
    expect(html).toContain('text-gray-600')
  })

  it('T-17 : h4 a le style text-xs text-gray-500', async () => {
    const html = await renderTOC({ headings: [{ depth: 4, text: 'Test', slug: 'test' }] })
    expect(html).toContain('text-xs')
    expect(html).toContain('text-gray-500')
  })
})

// ── Tests positionnement sticky ──────────────────────────

describe('TableOfContents — Positionnement', () => {
  it('T-18 : le container desktop est sticky', async () => {
    const html = await renderTOC()
    expect(html).toContain('sticky')
    expect(html).toContain('top-24')
  })

  it('T-19 : le container desktop a un max-height et overflow', async () => {
    const html = await renderTOC()
    expect(html).toContain('max-h-[calc(100vh-8rem)]')
    expect(html).toContain('overflow-y-auto')
  })

  it('T-20 : le container desktop est cache en mobile (hidden lg:block)', async () => {
    const html = await renderTOC()
    expect(html).toContain('hidden lg:block')
  })
})

// ── Tests version mobile ─────────────────────────────────

describe('TableOfContents — Mobile', () => {
  it('T-21 : le container mobile est visible sous lg (lg:hidden)', async () => {
    const html = await renderTOC()
    expect(html).toContain('lg:hidden')
  })

  it('T-22 : le bouton toggle a aria-expanded="false" par defaut', async () => {
    const html = await renderTOC()
    expect(html).toContain('aria-expanded="false"')
  })

  it('T-23 : le bouton toggle a aria-controls="toc-mobile-list"', async () => {
    const html = await renderTOC()
    expect(html).toContain('aria-controls="toc-mobile-list"')
  })

  it('T-24 : la liste mobile a l\'attribut hidden par defaut', async () => {
    const html = await renderTOC()
    expect(html).toContain('id="toc-mobile-list"')
    // La liste mobile a l'attribut hidden
    expect(html).toMatch(/id="toc-mobile-list"[^>]*hidden/)
  })

  it('T-25 : le bouton toggle a data-toc-toggle', async () => {
    const html = await renderTOC()
    expect(html).toContain('data-toc-toggle')
  })

  it('T-26 : le chevron a data-toc-chevron', async () => {
    const html = await renderTOC()
    expect(html).toContain('data-toc-chevron')
  })

  it('T-27 : le bouton toggle affiche le titre', async () => {
    const html = await renderTOC()
    // Le bouton contient le titre par defaut
    const mobileSection = html.split('lg:hidden')[1]
    expect(mobileSection).toContain('Sur cette page')
  })
})

// ── Tests filtrage des profondeurs ─────────────────────

describe('TableOfContents — Filtrage profondeurs', () => {
  it('T-28 : maxDepth=3 exclut les h4', async () => {
    const html = await renderTOC({ maxDepth: 3 })
    expect(html).not.toContain('Boucle de feedback')
    expect(html).toContain('Vision')
    expect(html).toContain('Principes fondateurs')
  })

  it('T-29 : maxDepth=2 ne garde que les h2', async () => {
    const html = await renderTOC({ maxDepth: 2 })
    expect(html).toContain('Vision')
    expect(html).toContain('Philosophie')
    expect(html).not.toContain('Principes fondateurs')
    expect(html).not.toContain('Boucle de feedback')
  })

  it('T-30 : minDepth=3 exclut les h2', async () => {
    const html = await renderTOC({ minDepth: 3 })
    expect(html).not.toContain('>Vision<')
    expect(html).toContain('Principes fondateurs')
    expect(html).toContain('Boucle de feedback')
  })

  it('T-31 : minDepth > maxDepth ne rend rien', async () => {
    const html = await renderTOC({ minDepth: 4, maxDepth: 2 })
    expect(html).not.toContain('<nav')
  })

  it('T-32 : les headings h1 sont toujours exclus', async () => {
    const headings = [
      { depth: 1, text: 'Titre H1', slug: 'titre-h1' },
      { depth: 2, text: 'Section', slug: 'section' },
    ]
    const html = await renderTOC({ headings })
    expect(html).not.toContain('Titre H1')
    expect(html).toContain('Section')
  })
})

// ── Tests accessibilite ──────────────────────────────────

describe('TableOfContents — Accessibilite', () => {
  it('T-33 : le nav a aria-label="Table des matieres"', async () => {
    const html = await renderTOC()
    expect(html).toContain('aria-label="Table des matieres"')
  })

  it('T-34 : les liens ont un focus ring', async () => {
    const html = await renderTOC()
    expect(html).toContain('focus:ring-2')
    expect(html).toContain('focus:ring-blue-500')
    expect(html).toContain('focus:ring-offset-2')
  })

  it('T-35 : la bordure gauche de guidage est presente', async () => {
    const html = await renderTOC()
    expect(html).toContain('border-l')
    expect(html).toContain('border-gray-200')
  })

  it('T-36 : chaque item est dans un <li>', async () => {
    const html = await renderTOC()
    const liCount = (html.match(/<li>/g) || []).length
    // 6 headings x 2 (desktop + mobile) = 12
    expect(liCount).toBe(SAMPLE_HEADINGS.length * 2)
  })
})

// ── Tests classes et attributs ──────────────────────────

describe('TableOfContents — Classes et attributs', () => {
  it('T-37 : classe personnalisee ajoutee au nav', async () => {
    const html = await renderTOC({ class: 'my-custom-class' })
    expect(html).toContain('my-custom-class')
  })

  it('T-38 : data-toc present sur le nav', async () => {
    const html = await renderTOC()
    expect(html).toContain('data-toc')
  })

  it('T-39 : data-toc-list present sur la liste desktop', async () => {
    const html = await renderTOC()
    expect(html).toContain('data-toc-list')
  })

  it('T-40 : transition-colors presente sur les liens', async () => {
    const html = await renderTOC()
    expect(html).toContain('transition-colors')
  })

  it('T-41 : les liens ont border-transparent par defaut', async () => {
    const html = await renderTOC()
    expect(html).toContain('border-transparent')
  })
})

// ── Tests XSS ────────────────────────────────────────────

describe('TableOfContents — Protection XSS', () => {
  it('T-42 : heading avec HTML est echappe', async () => {
    const headings = [
      { depth: 2, text: '<script>alert("xss")</script>', slug: 'xss-test' },
    ]
    const html = await renderTOC({ headings })
    expect(html).not.toContain('<script>alert')
    expect(html).toContain('&lt;script&gt;')
  })

  it('T-43 : heading avec accents et caracteres speciaux', async () => {
    const headings = [
      { depth: 2, text: 'Ecosysteme & Architecture — Vue d\'ensemble', slug: 'ecosysteme' },
    ]
    const html = await renderTOC({ headings })
    expect(html).toContain('Ecosysteme')
  })
})

// ── Tests script client ──────────────────────────────────

describe('TableOfContents — Script client', () => {
  it('T-44 : le script est present dans le rendu', async () => {
    const html = await renderTOC()
    expect(html).toContain('<script>')
    expect(html).toContain('initTableOfContents')
  })

  it('T-45 : le script reference IntersectionObserver', async () => {
    const html = await renderTOC()
    expect(html).toContain('IntersectionObserver')
  })

  it('T-46 : le script reference scrollIntoView', async () => {
    const html = await renderTOC()
    expect(html).toContain('scrollIntoView')
  })

  it('T-47 : le script gere le toggle mobile', async () => {
    const html = await renderTOC()
    expect(html).toContain('data-toc-toggle')
    expect(html).toContain('aria-expanded')
  })
})

// ── Tests combinaisons ───────────────────────────────────

describe('TableOfContents — Combinaisons', () => {
  it('T-48 : uniquement des h2 rend sans indentation', async () => {
    const html = await renderTOC({ headings: H2_ONLY_HEADINGS })
    expect(html).toContain('pl-0')
    expect(html).not.toContain('pl-4')
    expect(html).not.toContain('pl-8')
  })

  it('T-49 : titre personnalise apparait dans desktop et mobile', async () => {
    const html = await renderTOC({ title: 'Sommaire' })
    const occurrences = (html.match(/Sommaire/g) || []).length
    // Au moins 2 : une fois dans desktop, une fois dans le bouton mobile
    expect(occurrences).toBeGreaterThanOrEqual(2)
  })

  it('T-50 : le nombre de liens correspond au nombre de headings filtres', async () => {
    const html = await renderTOC()
    const linkCount = (html.match(/data-toc-link="/g) || []).length
    // 6 headings x 2 (desktop + mobile)
    expect(linkCount).toBe(SAMPLE_HEADINGS.length * 2)
  })
})
```

### 8.3 Matrice de couverture

| ID | Test | Type | Assertion | Priorite |
|----|------|------|-----------|----------|
| T-01 | Pas de rendu si headings vide | Unit | `not.toContain('<nav')` | Haute |
| T-02 | Pas de rendu si aucun h2-h4 | Unit | `not.toContain('<nav')` | Haute |
| T-03 | Rendu avec headings valides | Unit | `toContain('data-toc')` | Haute |
| T-04 | `<nav>` avec `aria-label` | Unit | `toContain('aria-label')` | Haute |
| T-05 | Liste `<ul>` presente | Unit | `toContain('<ul')` | Haute |
| T-06 | Lien `<a>` pour chaque heading | Unit | `toContain('href="#slug"')` | Haute |
| T-07 | `data-toc-link` avec slug | Unit | `toContain('data-toc-link="slug"')` | Haute |
| T-08 | Texte des headings affiche | Unit | `toContain('texte')` | Haute |
| T-09 | Titre par defaut "Sur cette page" | Unit | `toContain('Sur cette page')` | Haute |
| T-10 | Titre personnalise | Unit | `toContain('Sommaire')` | Moyenne |
| T-11 | Titre uppercase | Unit | `toContain('uppercase')` | Basse |
| T-12 | Indentation h2 : `pl-0` | Unit | `toContain('pl-0')` | Haute |
| T-13 | Indentation h3 : `pl-4` | Unit | `toContain('pl-4')` | Haute |
| T-14 | Indentation h4 : `pl-8` | Unit | `toContain('pl-8')` | Haute |
| T-15 | Style h2 : `font-medium text-gray-700` | Unit | `toContain(...)` | Moyenne |
| T-16 | Style h3 : `text-gray-600` | Unit | `toContain(...)` | Moyenne |
| T-17 | Style h4 : `text-xs text-gray-500` | Unit | `toContain(...)` | Moyenne |
| T-18 | Container sticky | Unit | `toContain('sticky')` | Haute |
| T-19 | Container max-height + overflow | Unit | `toContain('max-h-...')` | Haute |
| T-20 | Desktop cache en mobile | Unit | `toContain('hidden lg:block')` | Haute |
| T-21 | Mobile visible sous lg | Unit | `toContain('lg:hidden')` | Haute |
| T-22 | Toggle mobile `aria-expanded="false"` | Unit | `toContain(...)` | Haute |
| T-23 | Toggle mobile `aria-controls` | Unit | `toContain(...)` | Haute |
| T-24 | Liste mobile hidden par defaut | Unit | `toMatch(...)` | Haute |
| T-25 | Data attribute `data-toc-toggle` | Unit | `toContain(...)` | Moyenne |
| T-26 | Data attribute `data-toc-chevron` | Unit | `toContain(...)` | Moyenne |
| T-27 | Bouton toggle affiche le titre | Unit | `toContain(...)` | Moyenne |
| T-28 | `maxDepth=3` exclut h4 | Unit | `not.toContain(...)` | Haute |
| T-29 | `maxDepth=2` ne garde que h2 | Unit | `toContain/not.toContain` | Haute |
| T-30 | `minDepth=3` exclut h2 | Unit | `not.toContain(...)` | Haute |
| T-31 | `minDepth > maxDepth` ne rend rien | Unit | `not.toContain('<nav')` | Moyenne |
| T-32 | h1 toujours exclus | Unit | `not.toContain(...)` | Haute |
| T-33 | `aria-label` correct | Unit | `toContain(...)` | Haute |
| T-34 | Focus ring present | Unit | `toContain('focus:ring-2')` | Haute |
| T-35 | Bordure gauche de guidage | Unit | `toContain('border-l')` | Moyenne |
| T-36 | Chaque item dans un `<li>` | Unit | count == headings * 2 | Moyenne |
| T-37 | Classe personnalisee | Unit | `toContain('my-custom-class')` | Moyenne |
| T-38 | `data-toc` present | Unit | `toContain(...)` | Haute |
| T-39 | `data-toc-list` present | Unit | `toContain(...)` | Moyenne |
| T-40 | Transition | Unit | `toContain('transition-colors')` | Basse |
| T-41 | `border-transparent` par defaut | Unit | `toContain(...)` | Basse |
| T-42 | XSS echappe | Unit | `not.toContain('<script>')` | Haute |
| T-43 | Accents et caracteres speciaux | Unit | `toContain('Ecosysteme')` | Moyenne |
| T-44 | Script present | Unit | `toContain('<script>')` | Haute |
| T-45 | Script : IntersectionObserver | Unit | `toContain(...)` | Moyenne |
| T-46 | Script : scrollIntoView | Unit | `toContain(...)` | Moyenne |
| T-47 | Script : toggle mobile | Unit | `toContain(...)` | Moyenne |
| T-48 | H2 uniquement : pas d'indentation | Unit | `not.toContain('pl-4')` | Moyenne |
| T-49 | Titre personnalise dans desktop + mobile | Unit | count >= 2 | Moyenne |
| T-50 | Nombre correct de liens | Unit | count == headings * 2 | Haute |

---

## 9. Criteres d'acceptation

| ID | Critere | Verifie par |
|----|---------|-------------|
| CA-01 | Le fichier `src/components/layout/TableOfContents.astro` est cree | Verification fichier |
| CA-02 | Le composant rend un `<nav aria-label="Table des matieres">` avec des `<a href="#slug">` | T-04, T-06 |
| CA-03 | Les headings sont filtres par profondeur (h2-h4 par defaut, configurable via `minDepth`/`maxDepth`) | T-28 a T-32 |
| CA-04 | L'indentation hierarchique est correcte (h2=`pl-0`, h3=`pl-4`, h4=`pl-8`) | T-12, T-13, T-14 |
| CA-05 | Le composant ne rend rien quand headings est vide ou ne contient pas de h2-h4 | T-01, T-02 |
| CA-06 | Le positionnement sticky fonctionne sur desktop (`sticky top-24`) | T-18 |
| CA-07 | Le container desktop a un overflow scroll pour les longues TOC | T-19 |
| CA-08 | La version mobile a un bouton toggle avec `aria-expanded` et `aria-controls` | T-22, T-23 |
| CA-09 | La liste mobile est cachee par defaut (`hidden`) | T-24 |
| CA-10 | Le titre par defaut est "Sur cette page" et est personnalisable | T-09, T-10 |
| CA-11 | Le script client implement le scroll spy via IntersectionObserver | T-44, T-45 |
| CA-12 | Le script client implement le smooth scroll | T-46 |
| CA-13 | Le script client implement le toggle mobile | T-47 |
| CA-14 | Progressive enhancement : liens d'ancrage fonctionnent sans JS | T-06 (liens `href="#slug"`) |
| CA-15 | Focus ring visible sur les liens (`ring-2 ring-blue-500 ring-offset-2`) | T-34 |
| CA-16 | Contrastes WCAG AA respectes pour tous les niveaux | Verification manuelle section 5.2 |
| CA-17 | Protection XSS par echappement Astro | T-42, T-43 |
| CA-18 | Classes personnalisees supportees via prop `class` | T-37 |
| CA-19 | Data attributes pour les selecteurs (`data-toc`, `data-toc-link`, `data-toc-toggle`) | T-38, T-39, T-25, T-26 |
| CA-20 | TypeScript compile sans erreur (`pnpm typecheck`) | CI |
| CA-21 | ESLint passe sans warning (`pnpm lint`) | CI |
| CA-22 | Les 50 tests unitaires passent | CI |

---

## 10. Definition of Done

- [ ] Fichier `src/components/layout/TableOfContents.astro` cree
- [ ] Interface TypeScript `Props` complete avec documentation JSDoc
- [ ] Import du type `TableOfContentsItem` depuis T-004-B1
- [ ] Filtrage des headings par profondeur (`minDepth`, `maxDepth`)
- [ ] Rendu conditionnel : rien si pas de headings valides
- [ ] Indentation hierarchique correcte (h2, h3, h4)
- [ ] Styles differencies par niveau de profondeur
- [ ] Position sticky sur desktop (`sticky top-24`)
- [ ] Container avec `overflow-y-auto` et `max-h-[calc(100vh-8rem)]`
- [ ] Version desktop cachee en mobile (`hidden lg:block`)
- [ ] Version mobile collapsible avec bouton toggle
- [ ] `aria-expanded`, `aria-controls`, `hidden` sur le toggle mobile
- [ ] Script client : scroll spy via `IntersectionObserver`
- [ ] Script client : smooth scroll via `scrollIntoView`
- [ ] Script client : toggle mobile (ouvrir/fermer)
- [ ] Script client : fermeture auto de la TOC mobile apres clic sur un lien
- [ ] Script client : mise a jour du hash URL via `history.replaceState`
- [ ] `aria-current="true"` sur l'item actif (via JS)
- [ ] `aria-label="Table des matieres"` sur le `<nav>`
- [ ] Focus ring coherent avec le design system
- [ ] Titre par defaut "Sur cette page" personnalisable
- [ ] Bordure gauche de guidage (`border-l border-gray-200`)
- [ ] Data attributes (`data-toc`, `data-toc-link`, `data-toc-toggle`, `data-toc-chevron`, `data-toc-list`, `data-toc-mobile-list`)
- [ ] Tests unitaires passants (50 tests)
- [ ] 0 erreur TypeScript (`pnpm typecheck`)
- [ ] 0 erreur ESLint (`pnpm lint`)
- [ ] Code formate avec Prettier

---

## 11. Notes d'implementation

### 11.1 Ordre d'implementation recommande

1. Creer le fichier `src/components/layout/TableOfContents.astro` avec l'interface Props
2. Implementer le filtrage des headings par profondeur
3. Implementer le rendu conditionnel (pas de headings = pas de rendu)
4. Implementer la version desktop (liste statique avec indentation et styles par niveau)
5. Ajouter le positionnement sticky et l'overflow scroll
6. Implementer la version mobile (bouton toggle + liste cachee)
7. Ajouter les data attributes pour les selecteurs
8. Implementer le script client : scroll spy (IntersectionObserver)
9. Implementer le script client : smooth scroll
10. Implementer le script client : toggle mobile
11. Ajouter les etats visuels actifs (classes ajoutees par JS)
12. Verifier avec `pnpm typecheck` et `pnpm lint`
13. Ecrire les tests unitaires

### 11.2 Points d'attention

| Point | Detail |
|-------|--------|
| **Headings Astro** | Le tableau `headings` fourni par `post.render()` contient tous les headings (h1-h6). Le composant doit filtrer pour ne garder que h2-h4 par defaut. |
| **IntersectionObserver rootMargin** | Le `rootMargin: '0px 0px -80% 0px'` signifie que seuls les headings dans les 20% superieurs du viewport sont consideres comme actifs. Ajuster si le header fixe occupe plus d'espace. |
| **`scroll-margin-top` sur les headings** | Les headings cibles doivent avoir un `scroll-margin-top` en CSS global pour compenser le header fixe. Exemple : `[id] { scroll-margin-top: 6rem; }`. Ce CSS est a ajouter dans `src/styles/global.css`, pas dans ce composant. |
| **Doublons de rendu desktop/mobile** | Les items sont rendus deux fois (desktop + mobile) car les deux versions sont dans le DOM. C'est le pattern responsive CSS (`hidden lg:block` / `lg:hidden`). Seule la version visible est affichee. |
| **`history.replaceState` vs `pushState`** | Utiliser `replaceState` evite de polluer l'historique du navigateur avec chaque clic sur la TOC. L'utilisateur peut toujours utiliser Back pour revenir a la page precedente. |
| **Fermeture auto mobile** | Apres un clic sur un lien en mode mobile, la TOC se referme automatiquement pour liberer l'espace ecran et montrer le contenu cible. |
| **Script inline vs island** | Le script est un `<script>` inline Astro (non un island React/Vue). Il est bundled et deduplique automatiquement par Astro. Pas besoin de directive `client:idle` pour un script inline. |
| **`<noscript>` mobile** | Sans JS, la liste mobile reste cachee (`hidden`). Une amelioration future pourrait ajouter un `<noscript>` qui rend la liste visible en CSS-only. Hors scope de cette tache. |
| **Contenu des liens** | Le texte du lien est directement le `heading.text`. Pas besoin de `aria-label` car le texte est descriptif par nature. |

### 11.3 CSS global a ajouter (hors scope, note pour T-004-F10)

```css
/* src/styles/global.css — a ajouter par DocsLayout */
[id] {
  scroll-margin-top: 6rem;
}
```

### 11.4 Extensions futures (hors scope)

| Extension | Description | User Story |
|-----------|-------------|------------|
| Indicateur de progression | Barre de progression verticale a cote de la bordure gauche | Non definie |
| Expansion/contraction | Possibilite de replier les h3/h4 sous leur h2 parent | Non definie |
| Surlignage de section | Surligner la section visible dans la page, pas seulement le heading | Non definie |
| Mode sombre | Variantes de couleurs pour le dark mode | Non definie |
| `<noscript>` mobile | Afficher la liste mobile visible quand JS est desactive | Non definie |
| Animation de scroll | Indicateur visuel de la destination lors du smooth scroll | Non definie |

---

## 12. References

| Ressource | Lien |
|-----------|------|
| US-004 Spec | [spec-US-004.md](./spec-US-004.md) |
| Architecture | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| T-004-B1 Types navigation | [T-004-B1-types-typescript-navigation.md](./T-004-B1-types-typescript-navigation.md) |
| T-004-F1 BaseLayout | [T-004-F1-composant-BaseLayout.md](./T-004-F1-composant-BaseLayout.md) |
| T-004-F2 NavLink | [T-004-F2-composant-NavLink.md](./T-004-F2-composant-NavLink.md) |
| T-004-F10 DocsLayout | [T-004-F10-layout-DocsLayout.md](./T-004-F10-layout-DocsLayout.md) |
| Astro headings API | https://docs.astro.build/en/guides/content-collections/#rendering-content |
| IntersectionObserver | https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver |
| WAI-ARIA aria-current | https://www.w3.org/TR/wai-aria-1.1/#aria-current |
| RGAA 12.6 Navigation | https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#12.6 |
| Tailwind CSS Sticky | https://tailwindcss.com/docs/position#sticky-positioning-elements |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 11/02/2026 | Creation initiale — sticky desktop, collapsible mobile, scroll spy IntersectionObserver, smooth scroll, progressive enhancement, filtrage profondeur, 22 cas limites, 50 tests unitaires, 22 criteres d'acceptation |
