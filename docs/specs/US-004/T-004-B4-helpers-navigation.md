# T-004-B4 : Créer les helpers de navigation

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 10 février 2026 |
| **Statut** | 🟢 Terminée |
| **User Story** | [US-004 - Naviguer facilement dans le framework](./spec-US-004.md) |
| **Dépendances** | T-004-B1 (Types TypeScript navigation), T-004-B3 (Configuration navigation) |
| **Bloque** | T-004-F6 (Breadcrumb), T-004-F8 (PrevNextLinks), T-004-T2 (Tests helpers navigation) |

---

## 1. Objectif

Créer les fonctions utilitaires (helpers) de navigation qui transforment l'arbre hiérarchique `NAVIGATION_TREE` (T-004-B3) en données exploitables par les composants frontend, en garantissant :

- **Fonctions pures** : Chaque helper est une fonction pure sans effet de bord, prenant un arbre et un chemin en entrée, retournant un résultat déterministe
- **Type-safety** : Toutes les signatures utilisent les types T-004-B1, les retours sont strictement typés
- **Performance** : Aplatissement et lookups en O(n) sur 71 items — aucune opération coûteuse ni appel asynchrone
- **Testabilité** : Fonctions indépendantes de tout contexte Astro, testables unitairement avec des fixtures
- **Couverture complète** : 5 fonctions publiques + 2 constantes couvrant tous les besoins des composants Breadcrumb, PrevNextLinks, Sidebar, Header, MobileMenu

---

## 2. Contexte technique

### 2.1 Architecture cible

D'après [ARCHITECTURE.md](../../ARCHITECTURE.md) et les conventions du projet :

- **Astro 4.x** : les helpers sont appelés dans le frontmatter des composants Astro (côté serveur au build)
- **TypeScript 5.x** en mode strict (`noImplicitAny`, `strictNullChecks`)
- Types définis dans `src/types/navigation.ts` (T-004-B1)
- Schémas Zod dans `src/schemas/navigation.ts` (T-004-B2)
- Données de navigation dans `src/data/navigation.ts` (T-004-B3)

### 2.2 Positionnement dans l'arborescence

```
src/
├── types/
│   └── navigation.ts       # Existant (T-004-B1) — types
├── schemas/
│   └── navigation.ts       # Existant (T-004-B2) — schémas Zod
├── data/
│   └── navigation.ts       # Existant (T-004-B3) — arbre de navigation (71 items)
└── lib/
    └── navigation.ts       # ← NOUVEAU - Helpers de navigation
```

### 2.3 Conventions suivies

Conformément aux fichiers existants du projet :

| Convention | Détail |
|-----------|--------|
| Nommage fichier | kebab-case dans `src/lib/` |
| Nommage fonctions | camelCase (`flattenNav`, `getBreadcrumbs`) |
| Nommage constantes | SCREAMING_SNAKE_CASE (`SECTION_LABELS`) |
| JSDoc | Présent sur chaque fonction et constante exportée, avec `@param`, `@returns`, `@example` |
| Fonctions pures | Pas d'effets de bord, pas de mutation des arguments |
| Imports | Types via `import type`, constantes/données via `import` |
| Messages d'erreur | En français |

### 2.4 Relation avec les consommateurs

| Consommateur | Helper(s) utilisé(s) | Contexte d'appel |
|-------------|---------------------|------------------|
| `Breadcrumb.astro` (T-004-F6) | `getBreadcrumbs()` | Frontmatter Astro, `Astro.url.pathname` |
| `PrevNextLinks.astro` (T-004-F8) | `getPrevNext()` | Frontmatter Astro, `Astro.url.pathname` |
| `Sidebar.astro` (T-004-F9) | `getNavigation()`, `getCurrentSection()` | Frontmatter Astro |
| `Header.astro` (T-004-F4) | `getNavigation()` | Frontmatter Astro |
| `MobileMenu.astro` (T-004-F5) | `getNavigation()` | Frontmatter Astro |
| `DocsLayout.astro` (T-004-F10) | `getCurrentSection()`, `getBreadcrumbs()`, `getPrevNext()` | Frontmatter Astro |

---

## 3. Spécifications fonctionnelles

### 3.1 Inventaire des exports

| Type | Nom | Description |
|------|-----|-------------|
| **Constante** | `SECTION_LABELS` | Mapping `NavigationSection` → label d'affichage français |
| **Constante** | `SECTION_ROOT_HREFS` | Mapping `NavigationSection` → href de la page index de section |
| **Fonction** | `flattenNav()` | Aplatit un `NavigationTree` en `FlatNavigationItem[]` séquentiel |
| **Fonction** | `getBreadcrumbs()` | Génère le fil d'Ariane pour un chemin donné |
| **Fonction** | `getPrevNext()` | Retourne les liens Précédent/Suivant pour un chemin donné |
| **Fonction** | `getCurrentSection()` | Détermine la section d'un chemin URL |
| **Fonction** | `getNavigation()` | Retourne l'arbre de navigation (avec filtrage optionnel par section) |

### 3.2 Détail fonctionnel de chaque helper

#### 3.2.1 `SECTION_LABELS`

Constante de mapping entre les identifiants de section et leur label d'affichage en français, utilisée dans les breadcrumbs et la sidebar.

| Section | Label |
|---------|-------|
| `'framework'` | `'Framework'` |
| `'mode-operatoire'` | `'Mode Opératoire'` |
| `'annexes'` | `'Annexes'` |

#### 3.2.2 `SECTION_ROOT_HREFS`

Constante de mapping entre les identifiants de section et le href racine de la page index de chaque section.

| Section | Href |
|---------|------|
| `'framework'` | `'/framework'` |
| `'mode-operatoire'` | `'/mode-operatoire'` |
| `'annexes'` | `'/annexes'` |

#### 3.2.3 `flattenNav(tree)`

Aplatit l'arbre hiérarchique en une liste séquentielle ordonnée. L'ordre de parcours est :
1. Tous les items Framework (triés par `order`)
2. Tous les items Mode Opératoire (triés par `order`)
3. Tous les items Annexes (catégorie puis ses fiches enfants, triées par `order`)

**Comportements clés :**
- Les items avec `isHidden: true` sont **exclus** de la liste aplatie, ainsi que leurs enfants
- La propriété `section` est **propagée** du parent vers les enfants qui n'en ont pas
- Le champ `depth` reflète la profondeur dans l'arbre (0 = chapitre/catégorie, 1 = sous-page/fiche)
- Les items sont triés par `order` au sein de chaque groupe de siblings

#### 3.2.4 `getBreadcrumbs(tree, currentPath)`

Génère le fil d'Ariane complet pour une URL donnée.

**Comportements clés :**
- Le premier élément est **toujours** `{ label: 'Accueil', href: '/' }` (règle R5)
- Le deuxième élément est le **label de la section** avec le href racine de la section
- Les éléments suivants correspondent aux ancêtres hiérarchiques dans l'arbre
- Le dernier élément a `isCurrent: true` (règle R13)
- Si le chemin n'est pas trouvé dans l'arbre, retourne `null`
- Le chemin est **normalisé** (trailing slash retiré) avant la recherche

#### 3.2.5 `getPrevNext(tree, currentPath)`

Retourne les liens de navigation séquentielle (page précédente et suivante).

**Comportements clés :**
- Utilise `flattenNav()` pour obtenir l'ordre séquentiel
- `prev` est `null` si la page est la première de la séquence
- `next` est `null` si la page est la dernière de la séquence
- La `section` de chaque lien est renseignée (propagée depuis `flattenNav`)
- Si le chemin n'est pas trouvé, retourne `{ prev: null, next: null }`
- Permet la **navigation cross-section** (ex: dernier Framework → premier Mode Opératoire)

#### 3.2.6 `getCurrentSection(path)`

Détermine à quelle section du site appartient un chemin URL.

**Comportements clés :**
- Analyse le **premier segment** du chemin après `/`
- `/framework/*` → `'framework'`
- `/mode-operatoire/*` → `'mode-operatoire'`
- `/annexes/*` → `'annexes'`
- Tout autre chemin → `null`
- Le chemin est **normalisé** (trailing slash retiré) avant l'analyse

#### 3.2.7 `getNavigation(tree?, section?)`

Retourne l'arbre de navigation, optionnellement filtré par section.

**Comportements clés :**
- Sans arguments : retourne `NAVIGATION_TREE` importé depuis `@/data/navigation`
- Avec `tree` : utilise l'arbre fourni (utile pour les tests)
- Avec `section` : retourne uniquement les items de la section demandée dans un objet `NavigationTree` (les autres sections sont des tableaux vides)

### 3.3 Règles métier

| ID | Règle | Fonction concernée | Justification |
|----|-------|--------------------|---------------|
| R-B4-01 | `flattenNav()` exclut les items avec `isHidden: true` et leurs enfants | `flattenNav` | Règle R9 (T-004-B1) |
| R-B4-02 | `flattenNav()` propage la `section` du parent vers les enfants sans section | `flattenNav` | Convention B3 : fiches enfants d'annexes n'ont pas de `section` |
| R-B4-03 | `flattenNav()` trie les siblings par `order` croissant | `flattenNav` | Ordre déterministe, cohérence avec l'arbre B3 |
| R-B4-04 | `flattenNav()` produit exactement 71 items sur l'arbre NAVIGATION_TREE complet (aucun item hidden) | `flattenNav` | Intégrité : 8 + 8 + 9 + 46 = 71 |
| R-B4-05 | `getBreadcrumbs()` commence toujours par `{ label: 'Accueil', href: '/' }` | `getBreadcrumbs` | Règle R5 (T-004-B1) |
| R-B4-06 | `getBreadcrumbs()` termine toujours par un item `isCurrent: true` | `getBreadcrumbs` | Règle R13 (T-004-B2) |
| R-B4-07 | `getBreadcrumbs()` retourne `null` si le chemin n'est pas trouvé | `getBreadcrumbs` | Gestion explicite de l'absence |
| R-B4-08 | `getPrevNext()` utilise l'ordre de `flattenNav()` pour la séquence | `getPrevNext` | Règle R7 (T-004-B1) |
| R-B4-09 | `getPrevNext()` retourne `{ prev: null, next: null }` si le chemin n'est pas trouvé | `getPrevNext` | Gestion explicite de l'absence |
| R-B4-10 | `getCurrentSection()` retourne `null` pour les chemins hors section | `getCurrentSection` | Pages hors documentation (accueil, glossaire, etc.) |
| R-B4-11 | Toutes les fonctions normalisent le chemin (retrait du trailing slash) | Toutes | Cohérence : `/framework/preambule/` → `/framework/preambule` |
| R-B4-12 | Aucune fonction ne mute l'arbre passé en argument | Toutes | Fonctions pures, immutabilité |

---

## 4. Spécifications techniques

### 4.1 Constantes

```typescript
// src/lib/navigation.ts

import type {
  NavigationItem,
  NavigationTree,
  NavigationSection,
  BreadcrumbItem,
  BreadcrumbList,
  PrevNextLinks,
  FlatNavigationItem,
  FlatNavigationList,
} from '@/types/navigation'
import { NAVIGATION_TREE } from '@/data/navigation'

/**
 * Labels d'affichage des sections de navigation en français.
 *
 * Utilisé par `getBreadcrumbs()` pour le deuxième élément du fil d'Ariane,
 * et par les composants Sidebar/Header pour les titres de section.
 *
 * @example
 * ```typescript
 * SECTION_LABELS['framework']       // → 'Framework'
 * SECTION_LABELS['mode-operatoire'] // → 'Mode Opératoire'
 * SECTION_LABELS['annexes']         // → 'Annexes'
 * ```
 */
export const SECTION_LABELS: Readonly<Record<NavigationSection, string>> = {
  'framework': 'Framework',
  'mode-operatoire': 'Mode Opératoire',
  'annexes': 'Annexes',
}

/**
 * Hrefs racine de chaque section de navigation.
 *
 * Utilisé par `getBreadcrumbs()` pour le lien de la section dans le fil d'Ariane.
 *
 * @example
 * ```typescript
 * SECTION_ROOT_HREFS['framework']       // → '/framework'
 * SECTION_ROOT_HREFS['mode-operatoire'] // → '/mode-operatoire'
 * SECTION_ROOT_HREFS['annexes']         // → '/annexes'
 * ```
 */
export const SECTION_ROOT_HREFS: Readonly<Record<NavigationSection, string>> = {
  'framework': '/framework',
  'mode-operatoire': '/mode-operatoire',
  'annexes': '/annexes',
}
```

### 4.2 Fonction utilitaire interne : `normalizePath`

```typescript
/**
 * Normalise un chemin URL en retirant le trailing slash.
 *
 * @param path - Chemin URL à normaliser
 * @returns Chemin sans trailing slash (sauf pour '/')
 *
 * @example
 * ```typescript
 * normalizePath('/framework/preambule/')  // → '/framework/preambule'
 * normalizePath('/framework/preambule')   // → '/framework/preambule'
 * normalizePath('/')                      // → '/'
 * normalizePath('')                       // → '/'
 * ```
 */
function normalizePath(path: string): string {
  if (!path || path === '/') return '/'
  return path.endsWith('/') ? path.slice(0, -1) : path
}
```

### 4.3 Fonction `flattenNav`

```typescript
/**
 * Aplatit un arbre de navigation hiérarchique en une liste séquentielle.
 *
 * L'ordre de la liste résultante est :
 * 1. Framework (chapitres triés par `order`)
 * 2. Mode Opératoire (chapitres triés par `order`)
 * 3. Annexes (pour chaque catégorie triée par `order` : catégorie puis fiches triées par `order`)
 *
 * Cet ordre correspond à la séquence de lecture linéaire du site et est utilisé
 * par `getPrevNext()` pour calculer les liens Précédent/Suivant.
 *
 * @param tree - Arbre de navigation (défaut : NAVIGATION_TREE)
 * @returns Liste aplatie ordonnée de tous les items navigables
 *
 * @remarks
 * - Les items avec `isHidden: true` sont exclus, ainsi que leurs enfants (règle R9)
 * - La `section` est propagée du parent vers les enfants qui n'en définissent pas
 * - Le champ `depth` commence à 0 pour les éléments de premier niveau de chaque section
 *
 * @example
 * ```typescript
 * import { flattenNav } from '@/lib/navigation'
 * import { NAVIGATION_TREE } from '@/data/navigation'
 *
 * const flat = flattenNav(NAVIGATION_TREE)
 * // → FlatNavigationItem[] (71 éléments)
 * // [
 * //   { id: 'fw-preambule', label: 'Préambule', href: '/framework/preambule', section: 'framework', depth: 0 },
 * //   { id: 'fw-vision', label: 'Vision & Philosophie', href: '/framework/vision-philosophie', section: 'framework', depth: 0 },
 * //   ...
 * //   { id: 'mo-preambule', label: 'Préambule', href: '/mode-operatoire/preambule', section: 'mode-operatoire', depth: 0 },
 * //   ...
 * //   { id: 'annexes-a-templates', label: 'A - Templates', href: '/annexes/templates', section: 'annexes', depth: 0 },
 * //   { id: 'annexe-a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', section: 'annexes', depth: 1 },
 * //   ...
 * // ]
 * ```
 */
export function flattenNav(tree: NavigationTree = NAVIGATION_TREE): FlatNavigationList {
  const result: FlatNavigationItem[] = []

  function walk(
    items: NavigationItem[],
    depth: number,
    parentSection?: NavigationSection,
  ): void {
    const sorted = [...items].sort((a, b) => a.order - b.order)
    for (const item of sorted) {
      if (item.isHidden) continue

      const section = item.section ?? parentSection

      result.push({
        id: item.id,
        label: item.label,
        href: item.href,
        section,
        depth,
      })

      if (item.children && item.children.length > 0) {
        walk(item.children, depth + 1, section)
      }
    }
  }

  walk(tree.framework, 0)
  walk(tree.modeOperatoire, 0)
  walk(tree.annexes, 0)

  return result
}
```

### 4.4 Fonction `getBreadcrumbs`

```typescript
/**
 * Génère le fil d'Ariane (breadcrumb) pour un chemin URL donné.
 *
 * La structure du breadcrumb est :
 * - Accueil (/) → Section (ex: /framework) → [Catégorie (annexes)] → Page courante
 *
 * @param tree - Arbre de navigation
 * @param currentPath - Chemin URL courant (ex: '/framework/preambule')
 * @returns Liste de breadcrumbs ou `null` si le chemin n'est pas trouvé
 *
 * @remarks
 * - Le premier élément est toujours `{ label: 'Accueil', href: '/' }` (règle R5)
 * - Le dernier élément a `isCurrent: true` (règle R13)
 * - Le chemin est normalisé (trailing slash retiré)
 * - Retourne `null` si le chemin ne correspond à aucun item de l'arbre
 *
 * @example
 * ```typescript
 * // Page Framework (profondeur 1)
 * getBreadcrumbs(tree, '/framework/preambule')
 * // → [
 * //   { label: 'Accueil', href: '/' },
 * //   { label: 'Framework', href: '/framework' },
 * //   { label: 'Préambule', href: '/framework/preambule', isCurrent: true },
 * // ]
 *
 * // Fiche Annexe (profondeur 2)
 * getBreadcrumbs(tree, '/annexes/templates/prd')
 * // → [
 * //   { label: 'Accueil', href: '/' },
 * //   { label: 'Annexes', href: '/annexes' },
 * //   { label: 'A - Templates', href: '/annexes/templates' },
 * //   { label: 'A1 - PRD', href: '/annexes/templates/prd', isCurrent: true },
 * // ]
 *
 * // Chemin introuvable
 * getBreadcrumbs(tree, '/page-inexistante')
 * // → null
 * ```
 */
export function getBreadcrumbs(
  tree: NavigationTree,
  currentPath: string,
): BreadcrumbList | null {
  const path = normalizePath(currentPath)

  // Chercher l'item et sa chaîne d'ancêtres dans l'arbre
  const chain = findAncestorChain(tree, path)
  if (!chain) return null

  const { section, ancestors, item } = chain
  const breadcrumbs: BreadcrumbItem[] = []

  // 1. Accueil (toujours premier)
  breadcrumbs.push({ label: 'Accueil', href: '/' })

  // 2. Section (ex: Framework, Mode Opératoire, Annexes)
  breadcrumbs.push({
    label: SECTION_LABELS[section],
    href: SECTION_ROOT_HREFS[section],
  })

  // 3. Ancêtres intermédiaires (catégorie d'annexe)
  for (const ancestor of ancestors) {
    breadcrumbs.push({
      label: ancestor.label,
      href: ancestor.href,
    })
  }

  // 4. Page courante (dernier élément)
  breadcrumbs.push({
    label: item.label,
    href: item.href,
    isCurrent: true,
  })

  return breadcrumbs
}
```

### 4.5 Fonction utilitaire interne : `findAncestorChain`

```typescript
/**
 * Recherche un item dans l'arbre et retourne sa chaîne d'ancêtres.
 *
 * @param tree - Arbre de navigation
 * @param path - Chemin normalisé à rechercher
 * @returns Objet contenant la section, les ancêtres et l'item trouvé, ou null
 */
function findAncestorChain(
  tree: NavigationTree,
  path: string,
): { section: NavigationSection; ancestors: NavigationItem[]; item: NavigationItem } | null {
  // Chercher dans Framework
  const fwResult = findInItems(tree.framework, path, [])
  if (fwResult) return { section: 'framework', ...fwResult }

  // Chercher dans Mode Opératoire
  const moResult = findInItems(tree.modeOperatoire, path, [])
  if (moResult) return { section: 'mode-operatoire', ...moResult }

  // Chercher dans Annexes
  const anResult = findInItems(tree.annexes, path, [])
  if (anResult) return { section: 'annexes', ...anResult }

  return null
}

/**
 * Recherche récursive d'un item par href dans une liste de NavigationItem.
 *
 * @param items - Liste d'items à parcourir
 * @param path - Chemin normalisé à rechercher
 * @param ancestors - Ancêtres accumulés lors de la descente récursive
 * @returns Objet contenant les ancêtres et l'item trouvé, ou null
 */
function findInItems(
  items: NavigationItem[],
  path: string,
  ancestors: NavigationItem[],
): { ancestors: NavigationItem[]; item: NavigationItem } | null {
  for (const item of items) {
    if (item.href === path) {
      return { ancestors, item }
    }
    if (item.children && item.children.length > 0) {
      const result = findInItems(item.children, path, [...ancestors, item])
      if (result) return result
    }
  }
  return null
}
```

### 4.6 Fonction `getPrevNext`

```typescript
/**
 * Retourne les liens de navigation séquentielle (Précédent/Suivant) pour un chemin donné.
 *
 * La séquence suit l'ordre produit par `flattenNav()` :
 * Framework → Mode Opératoire → Annexes (catégories + fiches).
 *
 * @param tree - Arbre de navigation
 * @param currentPath - Chemin URL courant
 * @returns Paire { prev, next } avec PrevNextItem ou null aux extrémités
 *
 * @remarks
 * - `prev` est `null` pour la première page (fw-preambule)
 * - `next` est `null` pour la dernière page (annexe-i4-communaute)
 * - La navigation traverse les sections (ex: dernier Framework → premier Mode Opératoire)
 * - Si le chemin n'est pas trouvé, retourne `{ prev: null, next: null }`
 *
 * @example
 * ```typescript
 * // Page au milieu d'une section
 * getPrevNext(tree, '/framework/artefacts')
 * // → {
 * //   prev: { label: 'Écosystème', href: '/framework/ecosysteme', section: 'framework' },
 * //   next: { label: 'Boucles Itératives', href: '/framework/boucles-iteratives', section: 'framework' },
 * // }
 *
 * // Transition cross-section
 * getPrevNext(tree, '/mode-operatoire/preambule')
 * // → {
 * //   prev: { label: 'Annexes', href: '/framework/annexes', section: 'framework' },
 * //   next: { label: 'Initialisation', href: '/mode-operatoire/initialisation', section: 'mode-operatoire' },
 * // }
 *
 * // Première page du site
 * getPrevNext(tree, '/framework/preambule')
 * // → { prev: null, next: { label: 'Vision & Philosophie', ... } }
 *
 * // Dernière page du site
 * getPrevNext(tree, '/annexes/ressources/communaute')
 * // → { prev: { label: 'I3 - Bibliographie', ... }, next: null }
 * ```
 */
export function getPrevNext(
  tree: NavigationTree,
  currentPath: string,
): PrevNextLinks {
  const path = normalizePath(currentPath)
  const flat = flattenNav(tree)
  const currentIndex = flat.findIndex((item) => item.href === path)

  if (currentIndex === -1) {
    return { prev: null, next: null }
  }

  const prevItem = currentIndex > 0 ? flat[currentIndex - 1] : null
  const nextItem = currentIndex < flat.length - 1 ? flat[currentIndex + 1] : null

  return {
    prev: prevItem
      ? { label: prevItem.label, href: prevItem.href, section: prevItem.section }
      : null,
    next: nextItem
      ? { label: nextItem.label, href: nextItem.href, section: nextItem.section }
      : null,
  }
}
```

### 4.7 Fonction `getCurrentSection`

```typescript
/**
 * Détermine la section de navigation à laquelle appartient un chemin URL.
 *
 * Analyse le premier segment du chemin pour identifier la section.
 *
 * @param path - Chemin URL à analyser
 * @returns La section correspondante ou `null` si le chemin n'appartient à aucune section
 *
 * @example
 * ```typescript
 * getCurrentSection('/framework/preambule')           // → 'framework'
 * getCurrentSection('/mode-operatoire/initialisation') // → 'mode-operatoire'
 * getCurrentSection('/annexes/templates/prd')          // → 'annexes'
 * getCurrentSection('/')                               // → null
 * getCurrentSection('/glossaire')                      // → null
 * ```
 */
export function getCurrentSection(path: string): NavigationSection | null {
  const normalized = normalizePath(path)
  const segments = normalized.split('/').filter(Boolean)

  if (segments.length === 0) return null

  const firstSegment = segments[0]

  if (firstSegment === 'framework') return 'framework'
  if (firstSegment === 'mode-operatoire') return 'mode-operatoire'
  if (firstSegment === 'annexes') return 'annexes'

  return null
}
```

### 4.8 Fonction `getNavigation`

```typescript
/**
 * Retourne l'arbre de navigation, optionnellement filtré par section.
 *
 * Fonction d'accès à l'arbre de navigation servant de point d'entrée principal
 * pour les composants. Permet l'injection d'un arbre différent pour les tests.
 *
 * @param tree - Arbre de navigation (défaut : NAVIGATION_TREE)
 * @param section - Section à filtrer (optionnel). Si fournie, seule cette section contient des items.
 * @returns L'arbre de navigation complet ou filtré
 *
 * @example
 * ```typescript
 * // Arbre complet
 * const nav = getNavigation()
 * // → { framework: [...8], modeOperatoire: [...8], annexes: [...9] }
 *
 * // Filtré par section
 * const fwOnly = getNavigation(NAVIGATION_TREE, 'framework')
 * // → { framework: [...8], modeOperatoire: [], annexes: [] }
 *
 * // Avec arbre custom (pour les tests)
 * const customNav = getNavigation(myTestTree)
 * ```
 */
export function getNavigation(
  tree: NavigationTree = NAVIGATION_TREE,
  section?: NavigationSection,
): NavigationTree {
  if (!section) return tree

  return {
    framework: section === 'framework' ? tree.framework : [],
    modeOperatoire: section === 'mode-operatoire' ? tree.modeOperatoire : [],
    annexes: section === 'annexes' ? tree.annexes : [],
  }
}
```

### 4.9 Fichier complet attendu

```typescript
// src/lib/navigation.ts

/**
 * @module lib/navigation
 * @description Helpers de navigation pour le site AIAD.
 *
 * Fournit les fonctions utilitaires consommées par les composants de navigation :
 * - `flattenNav()` : Aplatissement de l'arbre en liste séquentielle
 * - `getBreadcrumbs()` : Génération du fil d'Ariane
 * - `getPrevNext()` : Liens Précédent/Suivant
 * - `getCurrentSection()` : Détection de la section courante
 * - `getNavigation()` : Accès à l'arbre de navigation
 *
 * Toutes les fonctions sont pures, synchrones, et utilisent les types T-004-B1.
 *
 * @see {@link ../types/navigation.ts} pour les types
 * @see {@link ../data/navigation.ts} pour les données
 * @see {@link ../../docs/specs/US-004/T-004-B4-helpers-navigation.md} pour cette spécification
 */

import type {
  NavigationItem,
  NavigationTree,
  NavigationSection,
  BreadcrumbItem,
  BreadcrumbList,
  PrevNextLinks,
  FlatNavigationItem,
  FlatNavigationList,
} from '@/types/navigation'
import { NAVIGATION_TREE } from '@/data/navigation'

// ──────────────────────────────────────────────────
// Constantes
// ──────────────────────────────────────────────────

export const SECTION_LABELS: Readonly<Record<NavigationSection, string>> = {
  // ... (cf. section 4.1)
}

export const SECTION_ROOT_HREFS: Readonly<Record<NavigationSection, string>> = {
  // ... (cf. section 4.1)
}

// ──────────────────────────────────────────────────
// Fonctions utilitaires internes
// ──────────────────────────────────────────────────

function normalizePath(path: string): string {
  // ... (cf. section 4.2)
}

function findAncestorChain(tree: NavigationTree, path: string) {
  // ... (cf. section 4.5)
}

function findInItems(items: NavigationItem[], path: string, ancestors: NavigationItem[]) {
  // ... (cf. section 4.5)
}

// ──────────────────────────────────────────────────
// Fonctions publiques
// ──────────────────────────────────────────────────

export function flattenNav(tree?: NavigationTree): FlatNavigationList {
  // ... (cf. section 4.3)
}

export function getBreadcrumbs(tree: NavigationTree, currentPath: string): BreadcrumbList | null {
  // ... (cf. section 4.4)
}

export function getPrevNext(tree: NavigationTree, currentPath: string): PrevNextLinks {
  // ... (cf. section 4.6)
}

export function getCurrentSection(path: string): NavigationSection | null {
  // ... (cf. section 4.7)
}

export function getNavigation(tree?: NavigationTree, section?: NavigationSection): NavigationTree {
  // ... (cf. section 4.8)
}
```

---

## 5. Cas limites et gestion d'erreurs

### 5.1 Cas limites identifiés

| ID | Cas limite | Fonction | Comportement attendu | Test |
|----|------------|----------|---------------------|------|
| CL-01 | Arbre vide (3 sections vides) | `flattenNav` | Retourne `[]` | T-01 |
| CL-02 | Item avec `isHidden: true` | `flattenNav` | Item exclu de la liste aplatie | T-02 |
| CL-03 | Item parent `isHidden: true` avec children | `flattenNav` | Parent ET enfants exclus | T-03 |
| CL-04 | Item enfant sans `section` défini | `flattenNav` | `section` propagée depuis le parent | T-04 |
| CL-05 | Items non triés par `order` dans l'arbre | `flattenNav` | Résultat trié par `order` croissant | T-05 |
| CL-06 | Arbre avec un seul item | `flattenNav` | Retourne un tableau avec 1 élément | T-06 |
| CL-07 | Chemin `/` (accueil) | `getBreadcrumbs` | Retourne `null` (pas dans l'arbre de navigation) | T-07 |
| CL-08 | Chemin introuvable | `getBreadcrumbs` | Retourne `null` | T-08 |
| CL-09 | Chemin avec trailing slash `/framework/preambule/` | `getBreadcrumbs` | Normalisé → même résultat que sans trailing slash | T-09 |
| CL-10 | Chemin de chapitre Framework (profondeur 1) | `getBreadcrumbs` | 3 éléments : Accueil → Section → Page | T-10 |
| CL-11 | Chemin de fiche Annexe (profondeur 2) | `getBreadcrumbs` | 4 éléments : Accueil → Section → Catégorie → Fiche | T-11 |
| CL-12 | Chemin de catégorie Annexe (profondeur 1) | `getBreadcrumbs` | 3 éléments : Accueil → Section → Catégorie | T-12 |
| CL-13 | Première page du site (`/framework/preambule`) | `getPrevNext` | `{ prev: null, next: {...} }` | T-13 |
| CL-14 | Dernière page du site (`/annexes/ressources/communaute`) | `getPrevNext` | `{ prev: {...}, next: null }` | T-14 |
| CL-15 | Transition cross-section (Framework → Mode Opératoire) | `getPrevNext` | `prev.section !== next.section` | T-15 |
| CL-16 | Transition cross-section (Mode Opératoire → Annexes) | `getPrevNext` | `prev.section !== next.section` | T-16 |
| CL-17 | Chemin introuvable | `getPrevNext` | `{ prev: null, next: null }` | T-17 |
| CL-18 | Chemin avec trailing slash | `getPrevNext` | Normalisé → même résultat | T-18 |
| CL-19 | Chemin `/` | `getCurrentSection` | `null` | T-19 |
| CL-20 | Chemin `/glossaire` | `getCurrentSection` | `null` | T-20 |
| CL-21 | Chemin `/framework` (section root, sans sous-page) | `getCurrentSection` | `'framework'` | T-21 |
| CL-22 | Chemin vide `''` | `getCurrentSection` | `null` | T-22 |
| CL-23 | Chemin avec trailing slash `/framework/` | `getCurrentSection` | `'framework'` | T-23 |
| CL-24 | `getNavigation()` sans arguments | `getNavigation` | Retourne `NAVIGATION_TREE` | T-24 |
| CL-25 | `getNavigation(tree, 'framework')` | `getNavigation` | Seul `framework` rempli, autres vides | T-25 |
| CL-26 | `getNavigation(tree, 'annexes')` | `getNavigation` | Seul `annexes` rempli, autres vides | T-26 |
| CL-27 | `flattenNav` avec NAVIGATION_TREE complet | `flattenNav` | Exactement 71 items | T-27 |
| CL-28 | Séquence complète : dernier flat item est `annexe-i4-communaute` | `flattenNav` | Vérification du dernier élément | T-28 |
| CL-29 | Séquence complète : premier flat item est `fw-preambule` | `flattenNav` | Vérification du premier élément | T-29 |
| CL-30 | Chemin `/mode-operatoire/annexes` (dernier MO) → next = premier Annexe | `getPrevNext` | Next = catégorie A - Templates | T-30 |
| CL-31 | `getBreadcrumbs` sur page Mode Opératoire | `getBreadcrumbs` | Breadcrumb avec label 'Mode Opératoire' | T-31 |
| CL-32 | `normalizePath` avec chemin `''` vide | `normalizePath` (interne) | Retourne `'/'` | T-32 |

### 5.2 Stratégie de gestion d'erreurs

| Scénario | Stratégie | Détail |
|----------|-----------|--------|
| Chemin introuvable (`getBreadcrumbs`) | **Retour `null`** | Le composant Breadcrumb gère l'absence (n'affiche rien ou affiche seulement Accueil) |
| Chemin introuvable (`getPrevNext`) | **Retour neutre** | `{ prev: null, next: null }` — le composant PrevNextLinks masque les liens |
| Chemin hors section (`getCurrentSection`) | **Retour `null`** | Le composant Sidebar utilise `null` pour ne pas mettre en surbrillance de section |
| Arbre invalide passé en argument | **Non géré** | L'arbre est validé par Zod au build (T-004-B3). Les helpers font confiance à l'arbre. |
| Performance sur grand arbre | **Non pertinent** | 71 items max, parcours O(n) < 1ms |

---

## 6. Exemples entrée/sortie

### 6.1 `flattenNav` — Arbre complet

```typescript
import { flattenNav } from '@/lib/navigation'
import { NAVIGATION_TREE } from '@/data/navigation'

const flat = flattenNav(NAVIGATION_TREE)

// Premiers éléments (Framework)
flat[0]   // → { id: 'fw-preambule', label: 'Préambule', href: '/framework/preambule', section: 'framework', depth: 0 }
flat[1]   // → { id: 'fw-vision', label: 'Vision & Philosophie', href: '/framework/vision-philosophie', section: 'framework', depth: 0 }
flat[7]   // → { id: 'fw-annexes', label: 'Annexes', href: '/framework/annexes', section: 'framework', depth: 0 }

// Premiers éléments Mode Opératoire (index 8)
flat[8]   // → { id: 'mo-preambule', label: 'Préambule', href: '/mode-operatoire/preambule', section: 'mode-operatoire', depth: 0 }

// Premiers éléments Annexes (index 16)
flat[16]  // → { id: 'annexes-a-templates', label: 'A - Templates', href: '/annexes/templates', section: 'annexes', depth: 0 }
flat[17]  // → { id: 'annexe-a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', section: 'annexes', depth: 1 }

// Dernier élément
flat[70]  // → { id: 'annexe-i4-communaute', label: 'I4 - Communauté', href: '/annexes/ressources/communaute', section: 'annexes', depth: 1 }

flat.length // → 71
```

### 6.2 `flattenNav` — Items cachés exclus

```typescript
const treeWithHidden: NavigationTree = {
  framework: [
    { id: 'fw-1', label: 'Visible', href: '/fw/visible', order: 1 },
    { id: 'fw-2', label: 'Caché', href: '/fw/cache', order: 2, isHidden: true },
    { id: 'fw-3', label: 'Aussi visible', href: '/fw/aussi-visible', order: 3 },
  ],
  modeOperatoire: [],
  annexes: [],
}

flattenNav(treeWithHidden)
// → [
//   { id: 'fw-1', label: 'Visible', href: '/fw/visible', depth: 0 },
//   { id: 'fw-3', label: 'Aussi visible', href: '/fw/aussi-visible', depth: 0 },
// ]
// L'item 'fw-2' est exclu
```

### 6.3 `flattenNav` — Propagation de section

```typescript
const treeWithChildren: NavigationTree = {
  framework: [],
  modeOperatoire: [],
  annexes: [
    {
      id: 'annexes-a', label: 'A - Templates', href: '/annexes/templates',
      section: 'annexes', order: 1,
      children: [
        { id: 'a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', order: 1 },
        // ↑ pas de section défini → propagé depuis le parent ('annexes')
      ],
    },
  ],
}

const flat = flattenNav(treeWithChildren)
flat[1].section // → 'annexes' (propagé depuis le parent)
```

### 6.4 `getBreadcrumbs` — Chapitre Framework

```typescript
import { getBreadcrumbs } from '@/lib/navigation'

getBreadcrumbs(NAVIGATION_TREE, '/framework/ecosysteme')
// → [
//   { label: 'Accueil', href: '/' },
//   { label: 'Framework', href: '/framework' },
//   { label: 'Écosystème', href: '/framework/ecosysteme', isCurrent: true },
// ]
```

### 6.5 `getBreadcrumbs` — Fiche Annexe (profondeur 2)

```typescript
getBreadcrumbs(NAVIGATION_TREE, '/annexes/roles/product-engineer')
// → [
//   { label: 'Accueil', href: '/' },
//   { label: 'Annexes', href: '/annexes' },
//   { label: 'B - Rôles', href: '/annexes/roles' },
//   { label: 'B2 - Product Engineer', href: '/annexes/roles/product-engineer', isCurrent: true },
// ]
```

### 6.6 `getBreadcrumbs` — Chapitre Mode Opératoire

```typescript
getBreadcrumbs(NAVIGATION_TREE, '/mode-operatoire/planification')
// → [
//   { label: 'Accueil', href: '/' },
//   { label: 'Mode Opératoire', href: '/mode-operatoire' },
//   { label: 'Planification', href: '/mode-operatoire/planification', isCurrent: true },
// ]
```

### 6.7 `getBreadcrumbs` — Catégorie Annexe (page index)

```typescript
getBreadcrumbs(NAVIGATION_TREE, '/annexes/templates')
// → [
//   { label: 'Accueil', href: '/' },
//   { label: 'Annexes', href: '/annexes' },
//   { label: 'A - Templates', href: '/annexes/templates', isCurrent: true },
// ]
```

### 6.8 `getBreadcrumbs` — Chemin introuvable

```typescript
getBreadcrumbs(NAVIGATION_TREE, '/page-inexistante')
// → null

getBreadcrumbs(NAVIGATION_TREE, '/')
// → null (la page d'accueil n'est pas dans l'arbre de navigation)
```

### 6.9 `getPrevNext` — Page au milieu

```typescript
import { getPrevNext } from '@/lib/navigation'

getPrevNext(NAVIGATION_TREE, '/framework/artefacts')
// → {
//   prev: { label: 'Écosystème', href: '/framework/ecosysteme', section: 'framework' },
//   next: { label: 'Boucles Itératives', href: '/framework/boucles-iteratives', section: 'framework' },
// }
```

### 6.10 `getPrevNext` — Transition cross-section

```typescript
// Dernier chapitre Framework → Premier chapitre Mode Opératoire
getPrevNext(NAVIGATION_TREE, '/mode-operatoire/preambule')
// → {
//   prev: { label: 'Annexes', href: '/framework/annexes', section: 'framework' },
//   next: { label: 'Initialisation', href: '/mode-operatoire/initialisation', section: 'mode-operatoire' },
// }

// Dernier chapitre Mode Opératoire → Première catégorie Annexes
getPrevNext(NAVIGATION_TREE, '/annexes/templates')
// → {
//   prev: { label: 'Annexes', href: '/mode-operatoire/annexes', section: 'mode-operatoire' },
//   next: { label: 'A1 - PRD', href: '/annexes/templates/prd', section: 'annexes' },
// }
```

### 6.11 `getPrevNext` — Première et dernière page

```typescript
// Première page
getPrevNext(NAVIGATION_TREE, '/framework/preambule')
// → { prev: null, next: { label: 'Vision & Philosophie', href: '/framework/vision-philosophie', section: 'framework' } }

// Dernière page
getPrevNext(NAVIGATION_TREE, '/annexes/ressources/communaute')
// → { prev: { label: 'I3 - Bibliographie', href: '/annexes/ressources/bibliographie', section: 'annexes' }, next: null }
```

### 6.12 `getCurrentSection` — Divers chemins

```typescript
import { getCurrentSection } from '@/lib/navigation'

getCurrentSection('/framework/preambule')           // → 'framework'
getCurrentSection('/framework')                     // → 'framework'
getCurrentSection('/mode-operatoire/initialisation') // → 'mode-operatoire'
getCurrentSection('/annexes/templates/prd')          // → 'annexes'
getCurrentSection('/')                               // → null
getCurrentSection('/glossaire')                      // → null
getCurrentSection('/pour-qui')                       // → null
getCurrentSection('')                                // → null
```

### 6.13 `getNavigation` — Filtrage par section

```typescript
import { getNavigation } from '@/lib/navigation'

// Arbre complet
const full = getNavigation()
full.framework.length       // → 8
full.modeOperatoire.length  // → 8
full.annexes.length         // → 9

// Filtré sur Framework uniquement
const fwOnly = getNavigation(NAVIGATION_TREE, 'framework')
fwOnly.framework.length       // → 8
fwOnly.modeOperatoire.length  // → 0
fwOnly.annexes.length         // → 0

// Filtré sur Annexes
const annexesOnly = getNavigation(NAVIGATION_TREE, 'annexes')
annexesOnly.framework.length       // → 0
annexesOnly.modeOperatoire.length  // → 0
annexesOnly.annexes.length         // → 9
```

---

## 7. Tests

### 7.1 Fichier de test

**Emplacement :** `tests/unit/lib/navigation.test.ts`

### 7.2 Suite de tests

```typescript
// tests/unit/lib/navigation.test.ts

import { describe, it, expect } from 'vitest'
import {
  SECTION_LABELS,
  SECTION_ROOT_HREFS,
  flattenNav,
  getBreadcrumbs,
  getPrevNext,
  getCurrentSection,
  getNavigation,
} from '@/lib/navigation'
import { NAVIGATION_TREE, NAVIGATION_COUNTS } from '@/data/navigation'
import type {
  NavigationTree,
  NavigationItem,
  NavigationSection,
} from '@/types/navigation'

// ──────────────────────────────────────────────────
// Fixtures
// ──────────────────────────────────────────────────

/** Arbre minimal pour tests isolés */
const minimalTree: NavigationTree = {
  framework: [
    { id: 'fw-1', label: 'Chapitre 1', href: '/framework/chapitre-1', section: 'framework', order: 1 },
    { id: 'fw-2', label: 'Chapitre 2', href: '/framework/chapitre-2', section: 'framework', order: 2 },
  ],
  modeOperatoire: [
    { id: 'mo-1', label: 'Phase 1', href: '/mode-operatoire/phase-1', section: 'mode-operatoire', order: 1 },
  ],
  annexes: [
    {
      id: 'annexes-a', label: 'A - Cat', href: '/annexes/cat-a', section: 'annexes', order: 1,
      children: [
        { id: 'annexe-a1', label: 'A1 - Fiche', href: '/annexes/cat-a/fiche-1', order: 1 },
        { id: 'annexe-a2', label: 'A2 - Fiche', href: '/annexes/cat-a/fiche-2', order: 2 },
      ],
    },
  ],
}

/** Arbre vide */
const emptyTree: NavigationTree = {
  framework: [],
  modeOperatoire: [],
  annexes: [],
}

/** Arbre avec items cachés */
const treeWithHidden: NavigationTree = {
  framework: [
    { id: 'fw-visible', label: 'Visible', href: '/framework/visible', section: 'framework', order: 1 },
    { id: 'fw-hidden', label: 'Caché', href: '/framework/cache', section: 'framework', order: 2, isHidden: true },
    { id: 'fw-after', label: 'Après', href: '/framework/apres', section: 'framework', order: 3 },
  ],
  modeOperatoire: [],
  annexes: [],
}

/** Arbre avec parent caché ayant des enfants */
const treeWithHiddenParent: NavigationTree = {
  framework: [],
  modeOperatoire: [],
  annexes: [
    {
      id: 'hidden-cat', label: 'Catégorie Cachée', href: '/annexes/hidden', section: 'annexes', order: 1,
      isHidden: true,
      children: [
        { id: 'hidden-child', label: 'Enfant', href: '/annexes/hidden/child', order: 1 },
      ],
    },
    {
      id: 'visible-cat', label: 'Catégorie Visible', href: '/annexes/visible', section: 'annexes', order: 2,
      children: [
        { id: 'visible-child', label: 'Enfant Visible', href: '/annexes/visible/child', order: 1 },
      ],
    },
  ],
}

/** Arbre avec order non séquentiel */
const treeUnsorted: NavigationTree = {
  framework: [
    { id: 'fw-c', label: 'C', href: '/framework/c', section: 'framework', order: 3 },
    { id: 'fw-a', label: 'A', href: '/framework/a', section: 'framework', order: 1 },
    { id: 'fw-b', label: 'B', href: '/framework/b', section: 'framework', order: 2 },
  ],
  modeOperatoire: [],
  annexes: [],
}

// ──────────────────────────────────────────────────
// Tests des constantes
// ──────────────────────────────────────────────────

describe('Constantes de navigation', () => {
  describe('SECTION_LABELS', () => {
    it('contient les 3 sections avec leurs labels français', () => {
      expect(SECTION_LABELS['framework']).toBe('Framework')
      expect(SECTION_LABELS['mode-operatoire']).toBe('Mode Opératoire')
      expect(SECTION_LABELS['annexes']).toBe('Annexes')
    })

    it('contient exactement 3 entrées', () => {
      expect(Object.keys(SECTION_LABELS)).toHaveLength(3)
    })
  })

  describe('SECTION_ROOT_HREFS', () => {
    it('contient les 3 sections avec leurs hrefs racine', () => {
      expect(SECTION_ROOT_HREFS['framework']).toBe('/framework')
      expect(SECTION_ROOT_HREFS['mode-operatoire']).toBe('/mode-operatoire')
      expect(SECTION_ROOT_HREFS['annexes']).toBe('/annexes')
    })

    it('tous les hrefs commencent par /', () => {
      for (const href of Object.values(SECTION_ROOT_HREFS)) {
        expect(href).toMatch(/^\//)
      }
    })

    it('contient exactement 3 entrées', () => {
      expect(Object.keys(SECTION_ROOT_HREFS)).toHaveLength(3)
    })
  })
})

// ──────────────────────────────────────────────────
// Tests de flattenNav
// ──────────────────────────────────────────────────

describe('flattenNav', () => {
  it('T-27: produit exactement 71 items sur NAVIGATION_TREE complet', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    expect(flat).toHaveLength(NAVIGATION_COUNTS.TOTAL_ITEMS)
    expect(flat).toHaveLength(71)
  })

  it('T-29: le premier item est fw-preambule', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    expect(flat[0].id).toBe('fw-preambule')
    expect(flat[0].href).toBe('/framework/preambule')
    expect(flat[0].section).toBe('framework')
    expect(flat[0].depth).toBe(0)
  })

  it('T-28: le dernier item est annexe-i4-communaute', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    expect(flat[flat.length - 1].id).toBe('annexe-i4-communaute')
    expect(flat[flat.length - 1].href).toBe('/annexes/ressources/communaute')
    expect(flat[flat.length - 1].section).toBe('annexes')
    expect(flat[flat.length - 1].depth).toBe(1)
  })

  it('T-01: arbre vide retourne un tableau vide', () => {
    const flat = flattenNav(emptyTree)
    expect(flat).toEqual([])
  })

  it('T-02: les items isHidden sont exclus', () => {
    const flat = flattenNav(treeWithHidden)
    expect(flat).toHaveLength(2)
    expect(flat.map((i) => i.id)).toEqual(['fw-visible', 'fw-after'])
    expect(flat.find((i) => i.id === 'fw-hidden')).toBeUndefined()
  })

  it('T-03: un parent isHidden exclut aussi ses enfants', () => {
    const flat = flattenNav(treeWithHiddenParent)
    expect(flat).toHaveLength(2)
    expect(flat.map((i) => i.id)).toEqual(['visible-cat', 'visible-child'])
    expect(flat.find((i) => i.id === 'hidden-cat')).toBeUndefined()
    expect(flat.find((i) => i.id === 'hidden-child')).toBeUndefined()
  })

  it('T-04: la section est propagée du parent vers les enfants', () => {
    const flat = flattenNav(minimalTree)
    const fiche = flat.find((i) => i.id === 'annexe-a1')
    expect(fiche).toBeDefined()
    expect(fiche!.section).toBe('annexes')
  })

  it('T-05: les items sont triés par order même si l\'arbre ne l\'est pas', () => {
    const flat = flattenNav(treeUnsorted)
    expect(flat.map((i) => i.id)).toEqual(['fw-a', 'fw-b', 'fw-c'])
    expect(flat.map((i) => i.label)).toEqual(['A', 'B', 'C'])
  })

  it('T-06: arbre avec un seul item retourne un tableau avec 1 élément', () => {
    const singleTree: NavigationTree = {
      framework: [{ id: 'fw-only', label: 'Seul', href: '/framework/seul', section: 'framework', order: 1 }],
      modeOperatoire: [],
      annexes: [],
    }
    const flat = flattenNav(singleTree)
    expect(flat).toHaveLength(1)
    expect(flat[0].id).toBe('fw-only')
  })

  it('l\'ordre séquentiel est Framework → Mode Opératoire → Annexes', () => {
    const flat = flattenNav(minimalTree)
    const sections = flat.map((i) => i.section)
    // Framework d'abord
    expect(sections[0]).toBe('framework')
    expect(sections[1]).toBe('framework')
    // Puis Mode Opératoire
    expect(sections[2]).toBe('mode-operatoire')
    // Puis Annexes
    expect(sections[3]).toBe('annexes')
  })

  it('les catégories Annexes apparaissent avant leurs fiches enfants', () => {
    const flat = flattenNav(minimalTree)
    const annexeItems = flat.filter((i) => i.section === 'annexes')
    expect(annexeItems[0].id).toBe('annexes-a')
    expect(annexeItems[0].depth).toBe(0)
    expect(annexeItems[1].id).toBe('annexe-a1')
    expect(annexeItems[1].depth).toBe(1)
    expect(annexeItems[2].id).toBe('annexe-a2')
    expect(annexeItems[2].depth).toBe(1)
  })

  it('le depth des chapitres Framework est 0', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    const fwItems = flat.filter((i) => i.section === 'framework')
    for (const item of fwItems) {
      expect(item.depth).toBe(0)
    }
  })

  it('le depth des catégories Annexes est 0 et des fiches est 1', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    const annexeItems = flat.filter((i) => i.section === 'annexes')
    for (const item of annexeItems) {
      expect(item.depth === 0 || item.depth === 1).toBe(true)
    }
    // Les catégories (depth 0) commencent par 'annexes-'
    const categories = annexeItems.filter((i) => i.depth === 0)
    for (const cat of categories) {
      expect(cat.id).toMatch(/^annexes-/)
    }
    // Les fiches (depth 1) commencent par 'annexe-'
    const fiches = annexeItems.filter((i) => i.depth === 1)
    for (const fiche of fiches) {
      expect(fiche.id).toMatch(/^annexe-/)
    }
  })

  it('tous les items ont un section défini après aplatissement', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    for (const item of flat) {
      expect(item.section).toBeDefined()
      expect(['framework', 'mode-operatoire', 'annexes']).toContain(item.section)
    }
  })

  it('ne mute pas l\'arbre original', () => {
    const original = JSON.parse(JSON.stringify(minimalTree))
    flattenNav(minimalTree)
    expect(minimalTree).toEqual(original)
  })
})

// ──────────────────────────────────────────────────
// Tests de getBreadcrumbs
// ──────────────────────────────────────────────────

describe('getBreadcrumbs', () => {
  it('T-10: chapitre Framework → 3 éléments', () => {
    const crumbs = getBreadcrumbs(NAVIGATION_TREE, '/framework/preambule')
    expect(crumbs).not.toBeNull()
    expect(crumbs).toHaveLength(3)
    expect(crumbs![0]).toEqual({ label: 'Accueil', href: '/' })
    expect(crumbs![1]).toEqual({ label: 'Framework', href: '/framework' })
    expect(crumbs![2]).toEqual({ label: 'Préambule', href: '/framework/preambule', isCurrent: true })
  })

  it('T-31: chapitre Mode Opératoire → 3 éléments avec label "Mode Opératoire"', () => {
    const crumbs = getBreadcrumbs(NAVIGATION_TREE, '/mode-operatoire/planification')
    expect(crumbs).not.toBeNull()
    expect(crumbs).toHaveLength(3)
    expect(crumbs![1]).toEqual({ label: 'Mode Opératoire', href: '/mode-operatoire' })
    expect(crumbs![2]).toEqual({ label: 'Planification', href: '/mode-operatoire/planification', isCurrent: true })
  })

  it('T-12: catégorie Annexe → 3 éléments', () => {
    const crumbs = getBreadcrumbs(NAVIGATION_TREE, '/annexes/templates')
    expect(crumbs).not.toBeNull()
    expect(crumbs).toHaveLength(3)
    expect(crumbs![0]).toEqual({ label: 'Accueil', href: '/' })
    expect(crumbs![1]).toEqual({ label: 'Annexes', href: '/annexes' })
    expect(crumbs![2]).toEqual({ label: 'A - Templates', href: '/annexes/templates', isCurrent: true })
  })

  it('T-11: fiche Annexe → 4 éléments', () => {
    const crumbs = getBreadcrumbs(NAVIGATION_TREE, '/annexes/templates/prd')
    expect(crumbs).not.toBeNull()
    expect(crumbs).toHaveLength(4)
    expect(crumbs![0]).toEqual({ label: 'Accueil', href: '/' })
    expect(crumbs![1]).toEqual({ label: 'Annexes', href: '/annexes' })
    expect(crumbs![2]).toEqual({ label: 'A - Templates', href: '/annexes/templates' })
    expect(crumbs![3]).toEqual({ label: 'A1 - PRD', href: '/annexes/templates/prd', isCurrent: true })
  })

  it('le premier élément est toujours Accueil (règle R5)', () => {
    const paths = [
      '/framework/preambule',
      '/mode-operatoire/initialisation',
      '/annexes/agents/agent-security',
    ]
    for (const path of paths) {
      const crumbs = getBreadcrumbs(NAVIGATION_TREE, path)
      expect(crumbs).not.toBeNull()
      expect(crumbs![0]).toEqual({ label: 'Accueil', href: '/' })
    }
  })

  it('le dernier élément a toujours isCurrent: true (règle R13)', () => {
    const paths = [
      '/framework/ecosysteme',
      '/mode-operatoire/validation',
      '/annexes/roles/tech-lead',
    ]
    for (const path of paths) {
      const crumbs = getBreadcrumbs(NAVIGATION_TREE, path)
      expect(crumbs).not.toBeNull()
      expect(crumbs![crumbs!.length - 1].isCurrent).toBe(true)
    }
  })

  it('les éléments intermédiaires n\'ont pas isCurrent: true', () => {
    const crumbs = getBreadcrumbs(NAVIGATION_TREE, '/annexes/templates/prd')
    expect(crumbs).not.toBeNull()
    for (let i = 0; i < crumbs!.length - 1; i++) {
      expect(crumbs![i].isCurrent).toBeUndefined()
    }
  })

  it('T-08: chemin introuvable retourne null', () => {
    expect(getBreadcrumbs(NAVIGATION_TREE, '/page-inexistante')).toBeNull()
    expect(getBreadcrumbs(NAVIGATION_TREE, '/framework/page-qui-nexiste-pas')).toBeNull()
  })

  it('T-07: chemin "/" retourne null (accueil pas dans l\'arbre)', () => {
    expect(getBreadcrumbs(NAVIGATION_TREE, '/')).toBeNull()
  })

  it('T-09: trailing slash est normalisé', () => {
    const withSlash = getBreadcrumbs(NAVIGATION_TREE, '/framework/preambule/')
    const withoutSlash = getBreadcrumbs(NAVIGATION_TREE, '/framework/preambule')
    expect(withSlash).toEqual(withoutSlash)
  })

  it('fonctionne avec un arbre minimal (fixture)', () => {
    const crumbs = getBreadcrumbs(minimalTree, '/annexes/cat-a/fiche-1')
    expect(crumbs).not.toBeNull()
    expect(crumbs).toHaveLength(4)
    expect(crumbs![0].label).toBe('Accueil')
    expect(crumbs![1].label).toBe('Annexes')
    expect(crumbs![2].label).toBe('A - Cat')
    expect(crumbs![3].label).toBe('A1 - Fiche')
    expect(crumbs![3].isCurrent).toBe(true)
  })
})

// ──────────────────────────────────────────────────
// Tests de getPrevNext
// ──────────────────────────────────────────────────

describe('getPrevNext', () => {
  it('T-13: première page du site → prev: null', () => {
    const result = getPrevNext(NAVIGATION_TREE, '/framework/preambule')
    expect(result.prev).toBeNull()
    expect(result.next).not.toBeNull()
    expect(result.next!.label).toBe('Vision & Philosophie')
    expect(result.next!.href).toBe('/framework/vision-philosophie')
    expect(result.next!.section).toBe('framework')
  })

  it('T-14: dernière page du site → next: null', () => {
    const result = getPrevNext(NAVIGATION_TREE, '/annexes/ressources/communaute')
    expect(result.next).toBeNull()
    expect(result.prev).not.toBeNull()
    expect(result.prev!.label).toBe('I3 - Bibliographie')
    expect(result.prev!.href).toBe('/annexes/ressources/bibliographie')
    expect(result.prev!.section).toBe('annexes')
  })

  it('page au milieu d\'une section → prev et next définis', () => {
    const result = getPrevNext(NAVIGATION_TREE, '/framework/artefacts')
    expect(result.prev).not.toBeNull()
    expect(result.prev!.label).toBe('Écosystème')
    expect(result.prev!.section).toBe('framework')
    expect(result.next).not.toBeNull()
    expect(result.next!.label).toBe('Boucles Itératives')
    expect(result.next!.section).toBe('framework')
  })

  it('T-15: transition Framework → Mode Opératoire', () => {
    const result = getPrevNext(NAVIGATION_TREE, '/mode-operatoire/preambule')
    expect(result.prev).not.toBeNull()
    expect(result.prev!.href).toBe('/framework/annexes')
    expect(result.prev!.section).toBe('framework')
    expect(result.next).not.toBeNull()
    expect(result.next!.section).toBe('mode-operatoire')
  })

  it('T-16: transition Mode Opératoire → Annexes', () => {
    const result = getPrevNext(NAVIGATION_TREE, '/annexes/templates')
    expect(result.prev).not.toBeNull()
    expect(result.prev!.href).toBe('/mode-operatoire/annexes')
    expect(result.prev!.section).toBe('mode-operatoire')
    expect(result.next).not.toBeNull()
    expect(result.next!.section).toBe('annexes')
  })

  it('T-30: dernier Mode Opératoire → next est première catégorie Annexes', () => {
    const result = getPrevNext(NAVIGATION_TREE, '/mode-operatoire/annexes')
    expect(result.next).not.toBeNull()
    expect(result.next!.href).toBe('/annexes/templates')
    expect(result.next!.label).toBe('A - Templates')
    expect(result.next!.section).toBe('annexes')
  })

  it('T-17: chemin introuvable retourne { prev: null, next: null }', () => {
    const result = getPrevNext(NAVIGATION_TREE, '/page-inexistante')
    expect(result.prev).toBeNull()
    expect(result.next).toBeNull()
  })

  it('T-18: trailing slash est normalisé', () => {
    const withSlash = getPrevNext(NAVIGATION_TREE, '/framework/artefacts/')
    const withoutSlash = getPrevNext(NAVIGATION_TREE, '/framework/artefacts')
    expect(withSlash).toEqual(withoutSlash)
  })

  it('chaque lien prev/next a un section défini', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    for (const item of flat) {
      const result = getPrevNext(NAVIGATION_TREE, item.href)
      if (result.prev) {
        expect(result.prev.section).toBeDefined()
      }
      if (result.next) {
        expect(result.next.section).toBeDefined()
      }
    }
  })

  it('fonctionne avec un arbre minimal (fixture)', () => {
    const result = getPrevNext(minimalTree, '/mode-operatoire/phase-1')
    expect(result.prev).not.toBeNull()
    expect(result.prev!.id ?? result.prev!.href).toBeDefined()
    expect(result.next).not.toBeNull()
  })
})

// ──────────────────────────────────────────────────
// Tests de getCurrentSection
// ──────────────────────────────────────────────────

describe('getCurrentSection', () => {
  it('T-21: "/framework" retourne "framework"', () => {
    expect(getCurrentSection('/framework')).toBe('framework')
  })

  it('"/framework/preambule" retourne "framework"', () => {
    expect(getCurrentSection('/framework/preambule')).toBe('framework')
  })

  it('"/mode-operatoire/initialisation" retourne "mode-operatoire"', () => {
    expect(getCurrentSection('/mode-operatoire/initialisation')).toBe('mode-operatoire')
  })

  it('"/annexes/templates/prd" retourne "annexes"', () => {
    expect(getCurrentSection('/annexes/templates/prd')).toBe('annexes')
  })

  it('T-19: "/" retourne null', () => {
    expect(getCurrentSection('/')).toBeNull()
  })

  it('T-20: "/glossaire" retourne null', () => {
    expect(getCurrentSection('/glossaire')).toBeNull()
  })

  it('T-22: chemin vide retourne null', () => {
    expect(getCurrentSection('')).toBeNull()
  })

  it('T-23: trailing slash est normalisé', () => {
    expect(getCurrentSection('/framework/')).toBe('framework')
    expect(getCurrentSection('/mode-operatoire/')).toBe('mode-operatoire')
    expect(getCurrentSection('/annexes/')).toBe('annexes')
  })

  it('"/pour-qui" retourne null', () => {
    expect(getCurrentSection('/pour-qui')).toBeNull()
  })

  it('"/comparaisons" retourne null', () => {
    expect(getCurrentSection('/comparaisons')).toBeNull()
  })
})

// ──────────────────────────────────────────────────
// Tests de getNavigation
// ──────────────────────────────────────────────────

describe('getNavigation', () => {
  it('T-24: sans arguments retourne NAVIGATION_TREE', () => {
    const nav = getNavigation()
    expect(nav.framework).toHaveLength(8)
    expect(nav.modeOperatoire).toHaveLength(8)
    expect(nav.annexes).toHaveLength(9)
  })

  it('T-25: filtré sur "framework" ne retourne que Framework', () => {
    const nav = getNavigation(NAVIGATION_TREE, 'framework')
    expect(nav.framework).toHaveLength(8)
    expect(nav.modeOperatoire).toHaveLength(0)
    expect(nav.annexes).toHaveLength(0)
  })

  it('filtré sur "mode-operatoire" ne retourne que Mode Opératoire', () => {
    const nav = getNavigation(NAVIGATION_TREE, 'mode-operatoire')
    expect(nav.framework).toHaveLength(0)
    expect(nav.modeOperatoire).toHaveLength(8)
    expect(nav.annexes).toHaveLength(0)
  })

  it('T-26: filtré sur "annexes" ne retourne que Annexes', () => {
    const nav = getNavigation(NAVIGATION_TREE, 'annexes')
    expect(nav.framework).toHaveLength(0)
    expect(nav.modeOperatoire).toHaveLength(0)
    expect(nav.annexes).toHaveLength(9)
  })

  it('avec un arbre custom, retourne cet arbre', () => {
    const nav = getNavigation(minimalTree)
    expect(nav.framework).toHaveLength(2)
    expect(nav.modeOperatoire).toHaveLength(1)
    expect(nav.annexes).toHaveLength(1)
  })

  it('le filtrage retourne les mêmes items (pas de copie partielle)', () => {
    const nav = getNavigation(NAVIGATION_TREE, 'framework')
    expect(nav.framework).toBe(NAVIGATION_TREE.framework)
  })

  it('ne mute pas l\'arbre original', () => {
    const original = { ...minimalTree }
    getNavigation(minimalTree, 'framework')
    expect(minimalTree.framework).toBe(original.framework)
    expect(minimalTree.modeOperatoire).toBe(original.modeOperatoire)
    expect(minimalTree.annexes).toBe(original.annexes)
  })
})

// ──────────────────────────────────────────────────
// Tests d'intégration sur NAVIGATION_TREE complet
// ──────────────────────────────────────────────────

describe('Intégration sur NAVIGATION_TREE complet', () => {
  it('flattenNav produit des IDs tous uniques', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    const ids = flat.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('flattenNav produit des hrefs tous uniques', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    const hrefs = flat.map((i) => i.href)
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })

  it('chaque item de flattenNav a un breadcrumb valide', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    for (const item of flat) {
      const crumbs = getBreadcrumbs(NAVIGATION_TREE, item.href)
      expect(crumbs).not.toBeNull()
      expect(crumbs!.length).toBeGreaterThanOrEqual(3)
      expect(crumbs![0].label).toBe('Accueil')
      expect(crumbs![crumbs!.length - 1].isCurrent).toBe(true)
      expect(crumbs![crumbs!.length - 1].href).toBe(item.href)
    }
  })

  it('chaque item de flattenNav a un getPrevNext cohérent', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    for (let i = 0; i < flat.length; i++) {
      const result = getPrevNext(NAVIGATION_TREE, flat[i].href)
      if (i === 0) {
        expect(result.prev).toBeNull()
      } else {
        expect(result.prev).not.toBeNull()
        expect(result.prev!.href).toBe(flat[i - 1].href)
      }
      if (i === flat.length - 1) {
        expect(result.next).toBeNull()
      } else {
        expect(result.next).not.toBeNull()
        expect(result.next!.href).toBe(flat[i + 1].href)
      }
    }
  })

  it('getCurrentSection est cohérent avec le section de flattenNav', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    for (const item of flat) {
      const section = getCurrentSection(item.href)
      expect(section).toBe(item.section)
    }
  })

  it('la séquence des 8 premiers items est le Framework complet', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    const first8 = flat.slice(0, 8)
    expect(first8.every((i) => i.section === 'framework')).toBe(true)
    expect(first8[0].label).toBe('Préambule')
    expect(first8[7].label).toBe('Annexes')
  })

  it('les items 8-15 sont le Mode Opératoire complet', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    const mo = flat.slice(8, 16)
    expect(mo.every((i) => i.section === 'mode-operatoire')).toBe(true)
    expect(mo[0].label).toBe('Préambule')
    expect(mo[7].label).toBe('Annexes')
  })

  it('les items 16+ sont les Annexes (catégories + fiches)', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    const annexes = flat.slice(16)
    expect(annexes.every((i) => i.section === 'annexes')).toBe(true)
    expect(annexes).toHaveLength(55) // 9 catégories + 46 fiches
  })
})
```

### 7.3 Matrice de couverture

| Fonction / Export | Cas nominal | Cas limites | Intégration | Nb tests | Couverture |
|-------------------|-------------|-------------|-------------|----------|------------|
| `SECTION_LABELS` | ✅ valeurs | ✅ count | — | 2 | 100% |
| `SECTION_ROOT_HREFS` | ✅ valeurs | ✅ format, count | — | 3 | 100% |
| `flattenNav` | ✅ complet, ordre, sections | ✅ vide, hidden, hidden parent, propagation, tri, seul | ✅ IDs/hrefs uniques, 71 items | 14 | 100% |
| `getBreadcrumbs` | ✅ Framework, MO, Annexe cat., Annexe fiche | ✅ introuvable, accueil, trailing slash, fixture | ✅ tous items valides | 11 | 100% |
| `getPrevNext` | ✅ milieu, prev/next | ✅ premier, dernier, cross-section x2, introuvable, trailing slash | ✅ cohérence séquentielle | 10 | 100% |
| `getCurrentSection` | ✅ 3 sections | ✅ accueil, hors section, vide, trailing slash | ✅ cohérence avec flattenNav | 10 | 100% |
| `getNavigation` | ✅ complet, filtré x3 | ✅ arbre custom, immutabilité, référence | — | 7 | 100% |
| **Total** | | | | **~57** | |

### 7.4 Commandes de test

```bash
# Exécuter les tests de ce fichier uniquement
pnpm test:unit -- lib/navigation

# Avec couverture
pnpm test:unit -- lib/navigation --coverage

# Vérification TypeScript (compilation des types)
pnpm typecheck
```

---

## 8. Critères d'acceptation

- [ ] **CA-01** : Le fichier `src/lib/navigation.ts` est créé avec toutes les fonctions et constantes listées en section 4
- [ ] **CA-02** : `SECTION_LABELS` contient les 3 mappings section → label français
- [ ] **CA-03** : `SECTION_ROOT_HREFS` contient les 3 mappings section → href racine
- [ ] **CA-04** : `flattenNav()` produit exactement 71 items sur `NAVIGATION_TREE`, dans l'ordre Framework → Mode Opératoire → Annexes
- [ ] **CA-05** : `flattenNav()` exclut les items `isHidden: true` et leurs enfants, propage la `section`, trie par `order`
- [ ] **CA-06** : `getBreadcrumbs()` retourne un breadcrumb valide pour chaque page de l'arbre (3 ou 4 éléments selon la profondeur)
- [ ] **CA-07** : `getBreadcrumbs()` commence toujours par `Accueil` (R5) et finit par `isCurrent: true` (R13)
- [ ] **CA-08** : `getBreadcrumbs()` retourne `null` pour un chemin introuvable
- [ ] **CA-09** : `getPrevNext()` retourne les liens corrects pour chaque page, avec `null` aux extrémités
- [ ] **CA-10** : `getPrevNext()` gère les transitions cross-section (Framework → MO → Annexes)
- [ ] **CA-11** : `getCurrentSection()` identifie correctement les 3 sections et retourne `null` pour les autres chemins
- [ ] **CA-12** : `getNavigation()` retourne l'arbre complet sans filtre, ou filtré par section
- [ ] **CA-13** : Toutes les fonctions normalisent le chemin (trailing slash)
- [ ] **CA-14** : La documentation JSDoc est présente sur chaque fonction et constante exportée, avec `@param`, `@returns`, `@example`
- [ ] **CA-15** : Tous les tests passent (~57 tests)
- [ ] **CA-16** : TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] **CA-17** : ESLint passe sans warning (`pnpm lint`)

---

## 9. Definition of Done

- [ ] Code implémenté selon les spécifications (sections 4.1 à 4.9)
- [ ] 5 fonctions publiques + 2 constantes exportées
- [ ] Tests unitaires écrits et passants (~57 tests, section 7.2)
- [ ] Tests d'intégration sur `NAVIGATION_TREE` complet passants (section 7.2, dernier `describe`)
- [ ] Couverture de tests ≥ 90% sur `src/lib/navigation.ts`
- [ ] TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] ESLint passe sans warning (`pnpm lint`)
- [ ] Code reviewé par un pair
- [ ] Documentation JSDoc complète sur tous les exports

---

## 10. Références

| Document | Lien |
|----------|------|
| User Story US-004 | [spec-US-004.md](./spec-US-004.md) |
| Architecture | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| Types navigation (T-004-B1) | [T-004-B1-types-typescript-navigation.md](./T-004-B1-types-typescript-navigation.md) |
| Schémas Zod (T-004-B2) | [T-004-B2-schemas-zod-navigation.md](./T-004-B2-schemas-zod-navigation.md) |
| Configuration navigation (T-004-B3) | [T-004-B3-configuration-navigation.md](./T-004-B3-configuration-navigation.md) |
| Types implémentés | [src/types/navigation.ts](../../../src/types/navigation.ts) |
| Schémas implémentés | [src/schemas/navigation.ts](../../../src/schemas/navigation.ts) |
| Données implémentées | [src/data/navigation.ts](../../../src/data/navigation.ts) |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 10/02/2026 | Création initiale : 5 fonctions publiques, 2 constantes, 32 cas limites, ~57 tests, 17 critères d'acceptation |
