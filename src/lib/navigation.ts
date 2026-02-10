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

// ──────────────────────────────────────────────────
// Fonctions utilitaires internes
// ──────────────────────────────────────────────────

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

// ──────────────────────────────────────────────────
// Fonctions publiques
// ──────────────────────────────────────────────────

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
