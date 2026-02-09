// src/schemas/navigation.ts

/**
 * @module schemas/navigation
 * @description Schémas de validation Zod pour les données de navigation du site AIAD.
 * Implémente les règles métier R1-R14 définies dans US-004.
 *
 * @see {@link ../types/navigation.ts} pour les types TypeScript correspondants
 * @see {@link ../../docs/specs/US-004/T-004-B1-types-typescript-navigation.md} pour les types
 * @see {@link ../../docs/specs/US-004/T-004-B2-schemas-zod-navigation.md} pour cette spécification
 */

import { z } from 'zod'
import type { NavigationItem, NavigationSection, NavigationBadge } from '@/types/navigation'
import {
  NAVIGATION_SECTIONS,
  NAVIGATION_BADGES,
  MAX_NAVIGATION_DEPTH,
} from '@/types/navigation'

// ──────────────────────────────────────────────────
// Constantes d'erreur
// ──────────────────────────────────────────────────

/**
 * Messages d'erreur pour la validation des données de navigation.
 * Tous les messages sont en français pour la cohérence utilisateur.
 */
export const NAVIGATION_ERRORS = {
  // NavigationItem
  ID_PATTERN: 'L\'ID ne doit contenir que des minuscules, chiffres et tirets (pattern: ^[a-z0-9-]+$)',
  ID_MIN_LENGTH: 'L\'ID doit contenir au moins 2 caractères',
  ID_MAX_LENGTH: 'L\'ID ne doit pas dépasser 80 caractères',
  LABEL_MIN_LENGTH: 'Le label ne doit pas être vide',
  LABEL_MAX_LENGTH: 'Le label ne doit pas dépasser 100 caractères',
  HREF_START_SLASH: 'Le chemin doit commencer par \'/\'',
  HREF_NO_EXTERNAL: 'Les URL externes ne sont pas autorisées (navigation interne uniquement)',
  ORDER_INTEGER: 'L\'ordre doit être un entier',
  ORDER_NONNEGATIVE: 'L\'ordre doit être un entier positif ou nul (≥ 0)',
  SECTION_INVALID: 'La section doit être \'framework\', \'mode-operatoire\' ou \'annexes\'',
  BADGE_INVALID: 'Le badge doit être \'new\' ou \'essential\'',
  MAX_DEPTH_EXCEEDED: `La profondeur de navigation ne doit pas dépasser ${MAX_NAVIGATION_DEPTH} niveaux (règle R1)`,

  // NavigationTree
  TREE_DUPLICATE_ID: 'Chaque ID de navigation doit être unique dans tout l\'arbre (règle R2)',
  TREE_DUPLICATE_ORDER: 'L\'ordre doit être unique parmi les éléments frères (règle R3)',

  // Breadcrumb
  BREADCRUMB_EMPTY: 'Le fil d\'Ariane ne doit pas être vide',
  BREADCRUMB_START_HOME: 'Le fil d\'Ariane doit commencer par \'Accueil\' avec le href \'/\' (règle R5)',
  BREADCRUMB_LAST_CURRENT: 'Le dernier élément du fil d\'Ariane doit avoir isCurrent: true (règle R13)',

  // TableOfContents
  TOC_DEPTH_INVALID: 'Le niveau de heading doit être 2, 3 ou 4 (h2-h4) (règle R6)',
  TOC_TEXT_MIN_LENGTH: 'Le texte du heading ne doit pas être vide',
  TOC_TEXT_MAX_LENGTH: 'Le texte du heading ne doit pas dépasser 200 caractères',
  TOC_SLUG_PATTERN: 'Le slug ne doit contenir que des minuscules, chiffres et tirets',
  TOC_DUPLICATE_SLUG: 'Les slugs doivent être uniques dans une même table des matières (règle R14)',

  // FlatNavigationItem
  FLAT_DEPTH_NONNEGATIVE: 'La profondeur doit être un entier positif ou nul',
  FLAT_DUPLICATE_ID: 'Chaque ID doit être unique dans la liste aplatie',
} as const

// ──────────────────────────────────────────────────
// Schémas atomiques (enums)
// ──────────────────────────────────────────────────

/**
 * Schéma de validation pour les sections principales du site.
 *
 * @example
 * ```typescript
 * navigationSectionSchema.parse('framework')    // ✅ 'framework'
 * navigationSectionSchema.parse('blog')          // ❌ ZodError
 * ```
 */
export const navigationSectionSchema = z.enum(
  NAVIGATION_SECTIONS as unknown as [NavigationSection, ...NavigationSection[]],
  { errorMap: () => ({ message: NAVIGATION_ERRORS.SECTION_INVALID }) }
)

/**
 * Schéma de validation pour les badges de navigation.
 *
 * @example
 * ```typescript
 * navigationBadgeSchema.parse('new')        // ✅ 'new'
 * navigationBadgeSchema.parse('essential')  // ✅ 'essential'
 * navigationBadgeSchema.parse('featured')   // ❌ ZodError
 * ```
 */
export const navigationBadgeSchema = z.enum(
  NAVIGATION_BADGES as unknown as [NavigationBadge, ...NavigationBadge[]],
  { errorMap: () => ({ message: NAVIGATION_ERRORS.BADGE_INVALID }) }
)

// ──────────────────────────────────────────────────
// Schéma navigationItemSchema (récursif)
// ──────────────────────────────────────────────────

/**
 * Schéma de base pour un item de navigation (non récursif).
 * Utilisé comme base pour construire le schéma récursif.
 */
const navigationItemBaseSchema = z.object({
  id: z
    .string()
    .min(2, NAVIGATION_ERRORS.ID_MIN_LENGTH)
    .max(80, NAVIGATION_ERRORS.ID_MAX_LENGTH)
    .regex(/^[a-z0-9-]+$/, NAVIGATION_ERRORS.ID_PATTERN),

  label: z
    .string()
    .min(1, NAVIGATION_ERRORS.LABEL_MIN_LENGTH)
    .max(100, NAVIGATION_ERRORS.LABEL_MAX_LENGTH),

  href: z
    .string()
    .startsWith('/', NAVIGATION_ERRORS.HREF_START_SLASH)
    .refine(
      (val) => !val.startsWith('//') && !val.includes('://'),
      NAVIGATION_ERRORS.HREF_NO_EXTERNAL
    ),

  section: navigationSectionSchema.optional(),

  badge: navigationBadgeSchema.optional(),

  order: z
    .number()
    .int(NAVIGATION_ERRORS.ORDER_INTEGER)
    .nonnegative(NAVIGATION_ERRORS.ORDER_NONNEGATIVE),

  isHidden: z.boolean().optional().default(false),
})

/**
 * Schéma récursif pour un noeud de l'arbre de navigation.
 *
 * Implémente la structure récursive `NavigationItem` avec validation de
 * la profondeur maximale (règle R1 : max 4 niveaux).
 *
 * @remarks
 * La profondeur est validée par la fonction utilitaire `validateDepth()`
 * appliquée via un `.refine()` sur le `navigationTreeSchema`.
 * Le schéma récursif lui-même autorise la récursion mais la profondeur
 * est contrôlée au niveau de l'arbre complet.
 *
 * @example
 * ```typescript
 * // Item feuille (sans enfants) ✅
 * navigationItemSchema.parse({
 *   id: 'fw-preambule',
 *   label: 'Préambule',
 *   href: '/framework/preambule',
 *   order: 1,
 * })
 *
 * // Item avec enfants ✅
 * navigationItemSchema.parse({
 *   id: 'annexes-a',
 *   label: 'A - Templates',
 *   href: '/annexes/templates',
 *   section: 'annexes',
 *   order: 1,
 *   children: [
 *     { id: 'a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', order: 1 },
 *   ],
 * })
 * ```
 */
export const navigationItemSchema: z.ZodType<NavigationItem> = navigationItemBaseSchema.extend({
  children: z.lazy(() => z.array(navigationItemSchema)).optional(),
})

// ──────────────────────────────────────────────────
// Fonctions utilitaires pour navigationTreeSchema
// ──────────────────────────────────────────────────

/**
 * Fonction utilitaire : collecte tous les IDs d'un arbre de NavigationItem.
 * Utilisée pour vérifier l'unicité globale des IDs (règle R2).
 */
function collectAllIds(items: NavigationItem[]): string[] {
  const ids: string[] = []
  function walk(nodes: NavigationItem[]) {
    for (const node of nodes) {
      ids.push(node.id)
      if (node.children) walk(node.children)
    }
  }
  walk(items)
  return ids
}

/**
 * Fonction utilitaire : vérifie que la profondeur maximale d'un arbre
 * ne dépasse pas MAX_NAVIGATION_DEPTH niveaux (règle R1).
 */
function getMaxDepth(items: NavigationItem[], currentDepth: number = 1): number {
  let maxDepth = currentDepth
  for (const item of items) {
    if (item.children && item.children.length > 0) {
      const childDepth = getMaxDepth(item.children, currentDepth + 1)
      if (childDepth > maxDepth) maxDepth = childDepth
    }
  }
  return maxDepth
}

/**
 * Fonction utilitaire : vérifie que les `order` sont uniques parmi les siblings.
 * Retourne true si tous les siblings ont un order unique (règle R3).
 */
function hasUniqueOrderAmongSiblings(items: NavigationItem[]): boolean {
  const orders = items.filter((item) => !item.isHidden).map((item) => item.order)
  if (new Set(orders).size !== orders.length) return false
  for (const item of items) {
    if (item.children && item.children.length > 0) {
      if (!hasUniqueOrderAmongSiblings(item.children)) return false
    }
  }
  return true
}

// ──────────────────────────────────────────────────
// Schéma navigationTreeSchema
// ──────────────────────────────────────────────────

/**
 * Schéma de validation pour l'arbre de navigation complet du site.
 *
 * Valide la structure des 3 sections principales et applique les contraintes
 * globales inter-éléments :
 * - **R1** : Profondeur max 4 niveaux
 * - **R2** : Unicité globale des IDs
 * - **R3** : Unicité des `order` parmi les siblings
 *
 * @example
 * ```typescript
 * const tree = navigationTreeSchema.parse({
 *   framework: [
 *     { id: 'fw-preambule', label: 'Préambule', href: '/framework/preambule', order: 1 },
 *     { id: 'fw-vision', label: 'Vision & Philosophie', href: '/framework/vision-philosophie', order: 2 },
 *   ],
 *   modeOperatoire: [
 *     { id: 'mo-preambule', label: 'Préambule', href: '/mode-operatoire/preambule', order: 0 },
 *   ],
 *   annexes: [
 *     {
 *       id: 'annexes-a', label: 'A - Templates', href: '/annexes/templates', order: 1,
 *       children: [
 *         { id: 'a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', order: 1 },
 *       ],
 *     },
 *   ],
 * })
 * ```
 */
export const navigationTreeSchema = z.object({
  framework: z.array(navigationItemSchema),
  modeOperatoire: z.array(navigationItemSchema),
  annexes: z.array(navigationItemSchema),
})
  .refine(
    (tree) => {
      const allItems = [...tree.framework, ...tree.modeOperatoire, ...tree.annexes]
      const maxDepth = getMaxDepth(allItems)
      return maxDepth <= MAX_NAVIGATION_DEPTH
    },
    { message: NAVIGATION_ERRORS.MAX_DEPTH_EXCEEDED }
  )
  .refine(
    (tree) => {
      const allItems = [...tree.framework, ...tree.modeOperatoire, ...tree.annexes]
      const allIds = collectAllIds(allItems)
      return new Set(allIds).size === allIds.length
    },
    { message: NAVIGATION_ERRORS.TREE_DUPLICATE_ID }
  )
  .refine(
    (tree) => {
      return (
        hasUniqueOrderAmongSiblings(tree.framework) &&
        hasUniqueOrderAmongSiblings(tree.modeOperatoire) &&
        hasUniqueOrderAmongSiblings(tree.annexes)
      )
    },
    { message: NAVIGATION_ERRORS.TREE_DUPLICATE_ORDER }
  )

// ──────────────────────────────────────────────────
// Schémas breadcrumb
// ──────────────────────────────────────────────────

/**
 * Schéma de validation pour un élément de breadcrumb.
 *
 * @example
 * ```typescript
 * breadcrumbItemSchema.parse({ label: 'Framework', href: '/framework' })         // ✅
 * breadcrumbItemSchema.parse({ label: 'PRD', href: '/annexes/prd', isCurrent: true }) // ✅
 * ```
 */
export const breadcrumbItemSchema = z.object({
  label: z
    .string()
    .min(1, NAVIGATION_ERRORS.LABEL_MIN_LENGTH)
    .max(100, NAVIGATION_ERRORS.LABEL_MAX_LENGTH),

  href: z
    .string()
    .startsWith('/', NAVIGATION_ERRORS.HREF_START_SLASH),

  isCurrent: z.boolean().optional().default(false),
})

/**
 * Schéma de validation pour une liste de breadcrumbs complète.
 *
 * @remarks
 * Règles métier implémentées :
 * - **R5** : Le premier élément doit être `{ label: 'Accueil', href: '/' }`
 * - **R13** : Le dernier élément doit avoir `isCurrent: true`
 *
 * @example
 * ```typescript
 * breadcrumbListSchema.parse([
 *   { label: 'Accueil', href: '/' },
 *   { label: 'Framework', href: '/framework' },
 *   { label: 'Préambule', href: '/framework/preambule', isCurrent: true },
 * ]) // ✅
 * ```
 */
export const breadcrumbListSchema = z.array(breadcrumbItemSchema)
  .min(1, NAVIGATION_ERRORS.BREADCRUMB_EMPTY)
  .refine(
    (items) => items[0]?.label === 'Accueil' && items[0]?.href === '/',
    { message: NAVIGATION_ERRORS.BREADCRUMB_START_HOME }
  )
  .refine(
    (items) => items.length > 0 && items[items.length - 1].isCurrent === true,
    { message: NAVIGATION_ERRORS.BREADCRUMB_LAST_CURRENT }
  )

// ──────────────────────────────────────────────────
// Schémas table des matières
// ──────────────────────────────────────────────────

/**
 * Schéma de validation pour un élément de la table des matières.
 *
 * @example
 * ```typescript
 * tableOfContentsItemSchema.parse({ depth: 2, text: 'Introduction', slug: 'introduction' }) // ✅
 * tableOfContentsItemSchema.parse({ depth: 1, text: 'Titre', slug: 'titre' })               // ❌ depth invalide
 * ```
 */
export const tableOfContentsItemSchema = z.object({
  depth: z.union(
    [z.literal(2), z.literal(3), z.literal(4)],
    { errorMap: () => ({ message: NAVIGATION_ERRORS.TOC_DEPTH_INVALID }) }
  ),

  text: z
    .string()
    .min(1, NAVIGATION_ERRORS.TOC_TEXT_MIN_LENGTH)
    .max(200, NAVIGATION_ERRORS.TOC_TEXT_MAX_LENGTH),

  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, NAVIGATION_ERRORS.TOC_SLUG_PATTERN),
})

/**
 * Schéma de validation pour une liste de table des matières.
 *
 * @remarks
 * - Autorise un tableau vide (page sans headings h2-h4, la TOC sera masquée)
 * - **R14** : Les slugs doivent être uniques dans une même TOC
 *
 * @example
 * ```typescript
 * tableOfContentsListSchema.parse([])  // ✅ (page sans headings)
 * tableOfContentsListSchema.parse([
 *   { depth: 2, text: 'Section A', slug: 'section-a' },
 *   { depth: 3, text: 'Détail', slug: 'detail' },
 * ]) // ✅
 * ```
 */
export const tableOfContentsListSchema = z.array(tableOfContentsItemSchema)
  .refine(
    (items) => {
      const slugs = items.map((item) => item.slug)
      return new Set(slugs).size === slugs.length
    },
    { message: NAVIGATION_ERRORS.TOC_DUPLICATE_SLUG }
  )

// ──────────────────────────────────────────────────
// Schémas prev/next
// ──────────────────────────────────────────────────

/**
 * Schéma de validation pour un lien prev/next.
 *
 * @example
 * ```typescript
 * prevNextItemSchema.parse({
 *   label: 'Vision & Philosophie',
 *   href: '/framework/vision-philosophie',
 *   section: 'framework',
 * }) // ✅
 * ```
 */
export const prevNextItemSchema = z.object({
  label: z
    .string()
    .min(1, NAVIGATION_ERRORS.LABEL_MIN_LENGTH)
    .max(100, NAVIGATION_ERRORS.LABEL_MAX_LENGTH),

  href: z
    .string()
    .startsWith('/', NAVIGATION_ERRORS.HREF_START_SLASH),

  section: navigationSectionSchema.optional(),
})

/**
 * Schéma de validation pour la paire de liens séquentiels prev/next.
 *
 * @remarks
 * - `prev` est null pour la première page du site
 * - `next` est null pour la dernière page du site
 * - Les deux peuvent être null pour une page isolée
 *
 * @example
 * ```typescript
 * prevNextLinksSchema.parse({
 *   prev: { label: 'Préambule', href: '/framework/preambule', section: 'framework' },
 *   next: { label: 'Artefacts', href: '/framework/artefacts', section: 'framework' },
 * }) // ✅
 *
 * prevNextLinksSchema.parse({ prev: null, next: null }) // ✅ (page isolée)
 * ```
 */
export const prevNextLinksSchema = z.object({
  prev: prevNextItemSchema.nullable(),
  next: prevNextItemSchema.nullable(),
})

// ──────────────────────────────────────────────────
// Schémas flat navigation
// ──────────────────────────────────────────────────

/**
 * Schéma de validation pour un item de navigation aplati.
 *
 * @example
 * ```typescript
 * flatNavigationItemSchema.parse({
 *   id: 'fw-preambule',
 *   label: 'Préambule',
 *   href: '/framework/preambule',
 *   section: 'framework',
 *   depth: 0,
 * }) // ✅
 * ```
 */
export const flatNavigationItemSchema = z.object({
  id: z
    .string()
    .min(2, NAVIGATION_ERRORS.ID_MIN_LENGTH)
    .max(80, NAVIGATION_ERRORS.ID_MAX_LENGTH)
    .regex(/^[a-z0-9-]+$/, NAVIGATION_ERRORS.ID_PATTERN),

  label: z
    .string()
    .min(1, NAVIGATION_ERRORS.LABEL_MIN_LENGTH)
    .max(100, NAVIGATION_ERRORS.LABEL_MAX_LENGTH),

  href: z
    .string()
    .startsWith('/', NAVIGATION_ERRORS.HREF_START_SLASH),

  section: navigationSectionSchema.optional(),

  depth: z
    .number()
    .int(NAVIGATION_ERRORS.FLAT_DEPTH_NONNEGATIVE)
    .nonnegative(NAVIGATION_ERRORS.FLAT_DEPTH_NONNEGATIVE),
})

/**
 * Schéma de validation pour une liste aplatie de navigation.
 *
 * @remarks
 * Vérifie l'unicité des IDs dans la liste complète.
 *
 * @example
 * ```typescript
 * flatNavigationListSchema.parse([
 *   { id: 'fw-preambule', label: 'Préambule', href: '/framework/preambule', section: 'framework', depth: 0 },
 *   { id: 'fw-vision', label: 'Vision', href: '/framework/vision', section: 'framework', depth: 0 },
 * ]) // ✅
 * ```
 */
export const flatNavigationListSchema = z.array(flatNavigationItemSchema)
  .refine(
    (items) => {
      const ids = items.map((item) => item.id)
      return new Set(ids).size === ids.length
    },
    { message: NAVIGATION_ERRORS.FLAT_DUPLICATE_ID }
  )

// ──────────────────────────────────────────────────
// Types inférés des schémas
// ──────────────────────────────────────────────────

/** Type inféré du schéma NavigationItem */
export type NavigationItemSchemaType = z.infer<typeof navigationItemSchema>

/** Type inféré du schéma NavigationTree */
export type NavigationTreeSchemaType = z.infer<typeof navigationTreeSchema>

/** Type inféré du schéma BreadcrumbItem */
export type BreadcrumbItemSchemaType = z.infer<typeof breadcrumbItemSchema>

/** Type inféré du schéma BreadcrumbList */
export type BreadcrumbListSchemaType = z.infer<typeof breadcrumbListSchema>

/** Type inféré du schéma TableOfContentsItem */
export type TableOfContentsItemSchemaType = z.infer<typeof tableOfContentsItemSchema>

/** Type inféré du schéma TableOfContentsList */
export type TableOfContentsListSchemaType = z.infer<typeof tableOfContentsListSchema>

/** Type inféré du schéma PrevNextItem */
export type PrevNextItemSchemaType = z.infer<typeof prevNextItemSchema>

/** Type inféré du schéma PrevNextLinks */
export type PrevNextLinksSchemaType = z.infer<typeof prevNextLinksSchema>

/** Type inféré du schéma FlatNavigationItem */
export type FlatNavigationItemSchemaType = z.infer<typeof flatNavigationItemSchema>

/** Type inféré du schéma FlatNavigationList */
export type FlatNavigationListSchemaType = z.infer<typeof flatNavigationListSchema>
