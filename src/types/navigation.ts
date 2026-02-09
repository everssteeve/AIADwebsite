// src/types/navigation.ts

/**
 * Sections principales du site AIAD
 */
export const NAVIGATION_SECTIONS = Object.freeze(['framework', 'mode-operatoire', 'annexes'] as const)

/**
 * Badges visuels applicables aux items de navigation
 */
export const NAVIGATION_BADGES = ['new', 'essential'] as const

/**
 * Profondeur maximale autorisée pour l'arbre de navigation
 */
export const MAX_NAVIGATION_DEPTH = 4

/**
 * Niveaux de heading acceptés pour la table des matières
 */
export const TOC_HEADING_DEPTHS = [2, 3, 4] as const

/**
 * Section principale du site
 */
export type NavigationSection = typeof NAVIGATION_SECTIONS[number]
// Résout en : 'framework' | 'mode-operatoire' | 'annexes'

/**
 * Badge visuel pour les items de navigation
 */
export type NavigationBadge = typeof NAVIGATION_BADGES[number]
// Résout en : 'new' | 'essential'

/**
 * Niveaux de heading acceptés pour la table des matières
 */
export type TOCHeadingDepth = typeof TOC_HEADING_DEPTHS[number]
// Résout en : 2 | 3 | 4

/**
 * Noeud récursif de l'arbre de navigation
 *
 * Utilisé par les composants : Header, DropdownMenu, MobileMenu, Sidebar
 *
 * @example
 * ```typescript
 * const frameworkChapter: NavigationItem = {
 *   id: 'framework-preambule',
 *   label: 'Préambule',
 *   href: '/framework/preambule',
 *   section: 'framework',
 *   order: 1,
 *   badge: 'essential',
 * }
 *
 * const annexeCategory: NavigationItem = {
 *   id: 'annexes-a-templates',
 *   label: 'A - Templates',
 *   href: '/annexes/templates',
 *   section: 'annexes',
 *   order: 1,
 *   children: [
 *     {
 *       id: 'annexe-a1-prd',
 *       label: 'A1 - PRD',
 *       href: '/annexes/templates/prd',
 *       order: 1,
 *     },
 *   ],
 * }
 * ```
 *
 * @see {@link NavigationTree} pour la structure racine
 */
export interface NavigationItem {
  /**
   * Identifiant unique slug-friendly dans tout l'arbre
   * @pattern ^[a-z0-9-]+$
   * @minLength 2
   * @maxLength 80
   */
  id: string

  /**
   * Texte affiché dans le menu de navigation
   * @minLength 1
   * @maxLength 100
   */
  label: string

  /**
   * Chemin URL absolu de la page
   * Doit commencer par '/'
   * @pattern ^\/
   */
  href: string

  /**
   * Section principale à laquelle appartient cet item
   * Défini uniquement au niveau 1 de l'arbre, propagé par les helpers
   */
  section?: NavigationSection

  /**
   * Sous-éléments de navigation (récursif)
   * L'arbre ne doit pas dépasser MAX_NAVIGATION_DEPTH niveaux
   */
  children?: NavigationItem[]

  /**
   * Badge visuel optionnel affiché à côté du label
   */
  badge?: NavigationBadge

  /**
   * Ordre d'affichage parmi les siblings
   * Entier positif ou nul, unique parmi les frères
   * @minimum 0
   */
  order: number

  /**
   * Masquer cet item dans la navigation rendue
   * Les items masqués sont exclus de flattenNav() et du rendu
   * @default false
   */
  isHidden?: boolean
}

/**
 * Structure racine de l'arbre de navigation complet du site
 *
 * Contient les 3 sections principales avec leurs chapitres/catégories
 *
 * @example
 * ```typescript
 * const tree: NavigationTree = {
 *   framework: [
 *     { id: 'fw-preambule', label: 'Préambule', href: '/framework/preambule', order: 1 },
 *     { id: 'fw-vision', label: 'Vision & Philosophie', href: '/framework/vision-philosophie', order: 2 },
 *     // ... 6 autres chapitres
 *   ],
 *   modeOperatoire: [
 *     { id: 'mo-preambule', label: 'Préambule', href: '/mode-operatoire/preambule', order: 0 },
 *     // ... 7 autres chapitres
 *   ],
 *   annexes: [
 *     {
 *       id: 'annexes-a', label: 'A - Templates', href: '/annexes/templates', order: 1,
 *       children: [
 *         { id: 'a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', order: 1 },
 *         // ... 5 autres fiches
 *       ],
 *     },
 *     // ... 8 autres catégories
 *   ],
 * }
 * ```
 */
export interface NavigationTree {
  /** Chapitres du Framework AIAD (8 entrées) */
  framework: NavigationItem[]
  /** Chapitres du Mode Opératoire (8 entrées) */
  modeOperatoire: NavigationItem[]
  /** Catégories d'Annexes avec fiches enfants (9 catégories, 46 fiches) */
  annexes: NavigationItem[]
}

/**
 * Élément du fil d'Ariane (breadcrumb)
 *
 * @example
 * ```typescript
 * const breadcrumbs: BreadcrumbItem[] = [
 *   { label: 'Accueil', href: '/' },
 *   { label: 'Framework', href: '/framework' },
 *   { label: 'Préambule', href: '/framework/preambule', isCurrent: true },
 * ]
 * ```
 */
export interface BreadcrumbItem {
  /**
   * Texte affiché dans le breadcrumb
   * @minLength 1
   * @maxLength 100
   */
  label: string

  /**
   * Lien de navigation
   * Doit commencer par '/'
   * @pattern ^\/
   */
  href: string

  /**
   * Indique si c'est la page courante (dernier élément)
   * Le dernier élément est rendu comme texte, non cliquable
   * @default false
   */
  isCurrent?: boolean
}

/**
 * Élément de la table des matières (headings h2-h4 d'une page)
 *
 * @example
 * ```typescript
 * const toc: TableOfContentsItem[] = [
 *   { depth: 2, text: 'Vision', slug: 'vision' },
 *   { depth: 3, text: 'Principes fondateurs', slug: 'principes-fondateurs' },
 *   { depth: 2, text: 'Philosophie', slug: 'philosophie' },
 *   { depth: 3, text: 'Approche itérative', slug: 'approche-iterative' },
 *   { depth: 4, text: 'Boucle de feedback', slug: 'boucle-de-feedback' },
 * ]
 * ```
 */
export interface TableOfContentsItem {
  /**
   * Niveau de heading
   * 2 = h2, 3 = h3, 4 = h4
   * @minimum 2
   * @maximum 4
   */
  depth: TOCHeadingDepth

  /**
   * Texte du heading tel qu'affiché dans la page
   * @minLength 1
   * @maxLength 200
   */
  text: string

  /**
   * Ancre URL générée à partir du texte (id du heading)
   * Utilisé pour le scroll-to et le scroll-spy
   * @pattern ^[a-z0-9-]+$
   */
  slug: string
}

/**
 * Lien de navigation séquentielle (page précédente ou suivante)
 *
 * @example
 * ```typescript
 * const prevLink: PrevNextItem = {
 *   label: 'Vision & Philosophie',
 *   href: '/framework/vision-philosophie',
 *   section: 'framework',
 * }
 * ```
 */
export interface PrevNextItem {
  /**
   * Titre de la page liée
   * @minLength 1
   * @maxLength 100
   */
  label: string

  /**
   * Chemin URL de la page liée
   * @pattern ^\/
   */
  href: string

  /**
   * Section de la page liée
   * Utile pour afficher un indicateur visuel quand on change de section
   */
  section?: NavigationSection
}

/**
 * Paire de liens séquentiels affichés en bas des pages de documentation
 *
 * @example
 * ```typescript
 * // Page au milieu d'une section
 * const links: PrevNextLinks = {
 *   prev: { label: 'Vision & Philosophie', href: '/framework/vision-philosophie', section: 'framework' },
 *   next: { label: 'Artefacts', href: '/framework/artefacts', section: 'framework' },
 * }
 *
 * // Première page du site (pas de précédent)
 * const firstPage: PrevNextLinks = {
 *   prev: null,
 *   next: { label: 'Vision & Philosophie', href: '/framework/vision-philosophie', section: 'framework' },
 * }
 *
 * // Dernière page du site (pas de suivant)
 * const lastPage: PrevNextLinks = {
 *   prev: { label: 'I4 - Communauté', href: '/annexes/ressources/communaute', section: 'annexes' },
 *   next: null,
 * }
 * ```
 */
export interface PrevNextLinks {
  /** Page précédente dans l'ordre de navigation, null si première page */
  prev: PrevNextItem | null
  /** Page suivante dans l'ordre de navigation, null si dernière page */
  next: PrevNextItem | null
}

/**
 * Version aplatie d'un NavigationItem pour le parcours linéaire
 *
 * Produit par flattenNav() dans les helpers (T-004-B4)
 * Utilisé pour calculer les liens prev/next de manière séquentielle
 *
 * @example
 * ```typescript
 * const flatItems: FlatNavigationItem[] = [
 *   { id: 'fw-preambule', label: 'Préambule', href: '/framework/preambule', section: 'framework', depth: 0 },
 *   { id: 'fw-vision', label: 'Vision & Philosophie', href: '/framework/vision-philosophie', section: 'framework', depth: 0 },
 *   { id: 'mo-preambule', label: 'Préambule', href: '/mode-operatoire/preambule', section: 'mode-operatoire', depth: 0 },
 *   { id: 'annexes-a', label: 'A - Templates', href: '/annexes/templates', section: 'annexes', depth: 0 },
 *   { id: 'a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', section: 'annexes', depth: 1 },
 * ]
 * ```
 */
export interface FlatNavigationItem {
  /** Identifiant unique (hérité de NavigationItem) */
  id: string
  /** Texte affiché (hérité de NavigationItem) */
  label: string
  /** Chemin URL (hérité de NavigationItem) */
  href: string
  /** Section parente (héritée ou propagée depuis le parent) */
  section?: NavigationSection
  /**
   * Profondeur dans l'arbre original
   * 0 = chapitre/catégorie, 1 = sous-page/fiche, etc.
   */
  depth: number
}

/**
 * Type pour la création d'un NavigationItem (order et id obligatoires, reste optionnel)
 */
export type NavigationItemInput = Pick<NavigationItem, 'id' | 'label' | 'href' | 'order'> & {
  section?: NavigationSection
  children?: NavigationItemInput[]
  badge?: NavigationBadge
  isHidden?: boolean
}

/**
 * Type pour une mise à jour partielle d'un NavigationItem
 */
export type NavigationItemUpdate = Partial<Omit<NavigationItem, 'id'>>

/**
 * Liste de breadcrumbs (alias pour clarté)
 */
export type BreadcrumbList = BreadcrumbItem[]

/**
 * Liste de table des matières (alias pour clarté)
 */
export type TableOfContentsList = TableOfContentsItem[]

/**
 * Liste aplatie de navigation (alias pour clarté)
 */
export type FlatNavigationList = FlatNavigationItem[]
