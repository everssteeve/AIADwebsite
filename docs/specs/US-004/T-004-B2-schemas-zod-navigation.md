# T-004-B2 : Créer les schémas Zod de validation pour les données de navigation

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 9 février 2026 |
| **Statut** | 🔵 À faire |
| **User Story** | [US-004 - Naviguer facilement dans le framework](./spec-US-004.md) |
| **Dépendances** | T-004-B1 (Types TypeScript navigation) |
| **Bloque** | T-004-T1 (Tests schémas Zod navigation), T-004-B3 (Configuration navigation, validation des données), T-004-B4 (Helpers navigation, validation des entrées) |

---

## 1. Objectif

Créer les schémas de validation Zod correspondant aux types TypeScript de navigation définis en T-004-B1, en garantissant :

- **Validation runtime** : Chaque donnée de navigation est validée à l'exécution avec des messages d'erreur explicites en français
- **Cohérence types/schémas** : Les schémas Zod infèrent les mêmes types que les interfaces TypeScript de `src/types/navigation.ts`
- **Règles métier** : Implémentation des contraintes documentées dans la JSDoc des types (patterns, longueurs, profondeur max, unicité)
- **Réutilisabilité** : Les schémas sont composables et utilisables à la fois pour la validation de la configuration (T-004-B3) et des données d'entrée des helpers (T-004-B4)

---

## 2. Contexte technique

### 2.1 Architecture cible

D'après [ARCHITECTURE.md](../../ARCHITECTURE.md) et les conventions du projet :

- **Astro 4.x** utilise Zod nativement pour les Content Collections (`astro:content`)
- **Zod 3.x** est déjà une dépendance du projet (via `@astrojs/mdx`)
- **TypeScript 5.x** en mode strict — les types inférés doivent être compatibles

### 2.2 Positionnement dans l'arborescence

```
src/
├── schemas/
│   ├── benefit.ts          # Existant (modèle à suivre)
│   ├── stat.ts             # Existant (modèle à suivre)
│   ├── hero.ts             # Existant
│   └── navigation.ts       # ← NOUVEAU - Schémas Zod navigation
├── types/
│   └── navigation.ts       # Existant (T-004-B1) — source de vérité pour les types
└── data/
    └── navigation.ts       # À venir (T-004-B3) — consommateur principal
```

### 2.3 Conventions suivies

Conformément aux schémas existants (`src/schemas/benefit.ts`, `src/schemas/stat.ts`) :

| Convention | Détail |
|-----------|--------|
| Nommage schémas | camelCase avec suffixe `Schema` (`navigationItemSchema`) |
| Nommage types inférés | PascalCase avec suffixe `SchemaType` (`NavigationItemSchemaType`) |
| Messages d'erreur | En français, explicites, référençant la règle métier |
| JSDoc | `@module`, `@description`, `@remarks`, `@example` sur chaque export |
| Constantes d'erreur | SCREAMING_SNAKE_CASE exportées (`NAVIGATION_ERRORS`) |

### 2.4 Relation types TypeScript ↔ schémas Zod

| Source de vérité (T-004-B1) | Schéma Zod (cette tâche) | Rôle |
|-----------------------------|--------------------------|------|
| `NavigationItem` (interface) | `navigationItemSchema` | Validation structure + contraintes |
| `NavigationTree` (interface) | `navigationTreeSchema` | Validation arbre complet |
| `BreadcrumbItem` (interface) | `breadcrumbItemSchema` | Validation breadcrumb |
| `TableOfContentsItem` (interface) | `tableOfContentsItemSchema` | Validation TOC |
| `PrevNextItem` (interface) | `prevNextItemSchema` | Validation lien prev/next |
| `PrevNextLinks` (interface) | `prevNextLinksSchema` | Validation paire prev/next |
| `FlatNavigationItem` (interface) | `flatNavigationItemSchema` | Validation item aplati |
| `NAVIGATION_SECTIONS` (constante) | `navigationSectionSchema` | Validation enum section |
| `NAVIGATION_BADGES` (constante) | `navigationBadgeSchema` | Validation enum badge |
| `TOC_HEADING_DEPTHS` (constante) | Intégré dans `tableOfContentsItemSchema` | Validation depth |

---

## 3. Spécifications fonctionnelles

### 3.1 Inventaire des schémas à créer

| Schéma | Type validé | Contraintes spécifiques |
|--------|-------------|------------------------|
| `navigationSectionSchema` | `NavigationSection` | Enum : `'framework'` \| `'mode-operatoire'` \| `'annexes'` |
| `navigationBadgeSchema` | `NavigationBadge` | Enum : `'new'` \| `'essential'` |
| `navigationItemSchema` | `NavigationItem` | Récursif, profondeur max, patterns, longueurs |
| `navigationTreeSchema` | `NavigationTree` | 3 sections, unicité IDs globale, unicité `order` par siblings |
| `breadcrumbItemSchema` | `BreadcrumbItem` | Pattern href, longueurs |
| `breadcrumbListSchema` | `BreadcrumbList` | Commence par Accueil, dernier = `isCurrent` |
| `tableOfContentsItemSchema` | `TableOfContentsItem` | Depth 2-4, pattern slug |
| `tableOfContentsListSchema` | `TableOfContentsList` | Ordre cohérent, pas de doublon slug |
| `prevNextItemSchema` | `PrevNextItem` | Pattern href, longueurs |
| `prevNextLinksSchema` | `PrevNextLinks` | prev/next nullable |
| `flatNavigationItemSchema` | `FlatNavigationItem` | Depth ≥ 0 |
| `flatNavigationListSchema` | `FlatNavigationList` | Unicité IDs |

### 3.2 Règles métier implémentées

| ID | Règle | Schéma concerné | Type de validation |
|----|-------|-----------------|-------------------|
| R1 | L'arbre de navigation ne doit pas excéder 4 niveaux de profondeur | `navigationItemSchema` | `.refine()` récursif |
| R2 | Chaque `NavigationItem.id` doit être unique dans tout l'arbre | `navigationTreeSchema` | `.refine()` global |
| R3 | `order` doit être un entier ≥ 0, unique parmi les siblings | `navigationItemSchema` (champ) + `navigationTreeSchema` (inter-siblings) | `.int().nonnegative()` + `.refine()` |
| R4 | `href` doit commencer par `/` | `navigationItemSchema`, `breadcrumbItemSchema`, `prevNextItemSchema` | `.startsWith('/')` |
| R5 | Le breadcrumb doit commencer par `Accueil` (`/`) | `breadcrumbListSchema` | `.refine()` |
| R6 | `TableOfContentsItem.depth` doit être 2, 3 ou 4 | `tableOfContentsItemSchema` | `z.union([z.literal(2), z.literal(3), z.literal(4)])` |
| R7 | `NavigationBadge` limité aux valeurs `'new'` et `'essential'` | `navigationBadgeSchema` | `z.enum()` |
| R8 | `id` doit suivre le pattern slug-friendly `^[a-z0-9-]+$` | `navigationItemSchema`, `flatNavigationItemSchema` | `.regex()` |
| R9 | Les items `isHidden: true` sont exclus de `flattenNav()` | Non implémenté ici (logique helper T-004-B4) | — |
| R10 | `label` non vide et ≤ 100 caractères | Tous les schémas avec `label` | `.min(1).max(100)` |
| R11 | `text` (TOC) non vide et ≤ 200 caractères | `tableOfContentsItemSchema` | `.min(1).max(200)` |
| R12 | `slug` (TOC) doit suivre le pattern `^[a-z0-9-]+$` | `tableOfContentsItemSchema` | `.regex()` |
| R13 | Dernière breadcrumb doit avoir `isCurrent: true` | `breadcrumbListSchema` | `.refine()` |
| R14 | Pas de slugs dupliqués dans une même TOC | `tableOfContentsListSchema` | `.refine()` |

---

## 4. Spécifications techniques

### 4.1 Constantes d'erreur

```typescript
// src/schemas/navigation.ts

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
```

### 4.2 Schémas atomiques (enums)

```typescript
import { z } from 'zod'
import {
  NAVIGATION_SECTIONS,
  NAVIGATION_BADGES,
  MAX_NAVIGATION_DEPTH,
  TOC_HEADING_DEPTHS,
} from '@/types/navigation'

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
  NAVIGATION_SECTIONS as unknown as [string, ...string[]],
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
  NAVIGATION_BADGES as unknown as [string, ...string[]],
  { errorMap: () => ({ message: NAVIGATION_ERRORS.BADGE_INVALID }) }
)
```

### 4.3 Schéma `navigationItemSchema` (récursif)

```typescript
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
```

### 4.4 Schéma `navigationTreeSchema`

```typescript
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
```

### 4.5 Schéma `breadcrumbItemSchema` et `breadcrumbListSchema`

```typescript
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
```

### 4.6 Schéma `tableOfContentsItemSchema` et `tableOfContentsListSchema`

```typescript
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
```

### 4.7 Schémas `prevNextItemSchema` et `prevNextLinksSchema`

```typescript
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
```

### 4.8 Schémas `flatNavigationItemSchema` et `flatNavigationListSchema`

```typescript
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
```

### 4.9 Types inférés et exports

```typescript
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
```

### 4.10 Structure complète du fichier

```typescript
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
import type { NavigationItem } from '@/types/navigation'
import {
  NAVIGATION_SECTIONS,
  NAVIGATION_BADGES,
  MAX_NAVIGATION_DEPTH,
} from '@/types/navigation'

// [Constantes d'erreur - section 4.1]
// [Schémas atomiques - section 4.2]
// [navigationItemSchema - section 4.3]
// [navigationTreeSchema - section 4.4]
// [breadcrumbItemSchema + breadcrumbListSchema - section 4.5]
// [tableOfContentsItemSchema + tableOfContentsListSchema - section 4.6]
// [prevNextItemSchema + prevNextLinksSchema - section 4.7]
// [flatNavigationItemSchema + flatNavigationListSchema - section 4.8]
// [Types inférés - section 4.9]
```

---

## 5. Cas limites et gestion d'erreurs

### 5.1 Cas limites identifiés

| ID | Cas limite | Entrée | Résultat attendu | Schéma |
|----|------------|--------|------------------|--------|
| CL-01 | Item sans children | `{ id: 'x', label: 'X', href: '/x', order: 1 }` | ✅ Accepté : item feuille | `navigationItemSchema` |
| CL-02 | Item avec `children: []` | `{ ..., children: [] }` | ✅ Accepté : tableau vide autorisé | `navigationItemSchema` |
| CL-03 | Arbre de 5 niveaux de profondeur | L1 → L2 → L3 → L4 → L5 | ❌ Rejeté : `MAX_DEPTH_EXCEEDED` | `navigationTreeSchema` |
| CL-04 | Arbre de 4 niveaux exactement | L1 → L2 → L3 → L4 | ✅ Accepté : profondeur limite | `navigationTreeSchema` |
| CL-05 | ID avec majuscules (`"Fw-Preambule"`) | `{ id: 'Fw-Preambule', ... }` | ❌ Rejeté : `ID_PATTERN` | `navigationItemSchema` |
| CL-06 | ID avec espaces (`"fw preambule"`) | `{ id: 'fw preambule', ... }` | ❌ Rejeté : `ID_PATTERN` | `navigationItemSchema` |
| CL-07 | ID avec caractères spéciaux (`"fw_préambule"`) | `{ id: 'fw_préambule', ... }` | ❌ Rejeté : `ID_PATTERN` (underscore et accent) | `navigationItemSchema` |
| CL-08 | ID de 1 caractère (`"x"`) | `{ id: 'x', ... }` | ❌ Rejeté : `ID_MIN_LENGTH` | `navigationItemSchema` |
| CL-09 | ID de 81 caractères | `{ id: 'a'.repeat(81), ... }` | ❌ Rejeté : `ID_MAX_LENGTH` | `navigationItemSchema` |
| CL-10 | `href` sans slash (`"framework"`) | `{ href: 'framework', ... }` | ❌ Rejeté : `HREF_START_SLASH` | `navigationItemSchema` |
| CL-11 | `href` URL externe (`"https://..."`) | `{ href: 'https://example.com', ... }` | ❌ Rejeté : `HREF_NO_EXTERNAL` | `navigationItemSchema` |
| CL-12 | `href` URL proto-relative (`"//cdn.com"`) | `{ href: '//cdn.com/path', ... }` | ❌ Rejeté : `HREF_NO_EXTERNAL` | `navigationItemSchema` |
| CL-13 | `order` négatif (`-1`) | `{ order: -1, ... }` | ❌ Rejeté : `ORDER_NONNEGATIVE` | `navigationItemSchema` |
| CL-14 | `order` flottant (`1.5`) | `{ order: 1.5, ... }` | ❌ Rejeté : `ORDER_INTEGER` | `navigationItemSchema` |
| CL-15 | `order` = 0 | `{ order: 0, ... }` | ✅ Accepté : 0 est valide | `navigationItemSchema` |
| CL-16 | Label vide (`""`) | `{ label: '', ... }` | ❌ Rejeté : `LABEL_MIN_LENGTH` | Tous |
| CL-17 | Label de 101 caractères | `{ label: 'a'.repeat(101), ... }` | ❌ Rejeté : `LABEL_MAX_LENGTH` | Tous |
| CL-18 | Label avec accents et symboles | `{ label: 'Écosystème & Architecture', ... }` | ✅ Accepté : UTF-8 | Tous |
| CL-19 | Section invalide (`"blog"`) | `{ section: 'blog', ... }` | ❌ Rejeté : `SECTION_INVALID` | `navigationItemSchema` |
| CL-20 | Badge invalide (`"featured"`) | `{ badge: 'featured', ... }` | ❌ Rejeté : `BADGE_INVALID` | `navigationItemSchema` |
| CL-21 | Deux IDs dupliqués dans l'arbre | `framework: [{ id: 'x' }], annexes: [{ id: 'x' }]` | ❌ Rejeté : `TREE_DUPLICATE_ID` | `navigationTreeSchema` |
| CL-22 | Deux siblings avec le même `order` | `[{ order: 1 }, { order: 1 }]` | ❌ Rejeté : `TREE_DUPLICATE_ORDER` | `navigationTreeSchema` |
| CL-23 | Siblings dans des niveaux différents avec même `order` | Parent `order: 1`, enfant `order: 1` | ✅ Accepté : différents niveaux | `navigationTreeSchema` |
| CL-24 | Section vide (`framework: []`) | `{ framework: [], modeOperatoire: [...], annexes: [...] }` | ✅ Accepté : tableau vide autorisé | `navigationTreeSchema` |
| CL-25 | Breadcrumb vide | `[]` | ❌ Rejeté : `BREADCRUMB_EMPTY` | `breadcrumbListSchema` |
| CL-26 | Breadcrumb sans `Accueil` en premier | `[{ label: 'Framework', href: '/framework' }]` | ❌ Rejeté : `BREADCRUMB_START_HOME` | `breadcrumbListSchema` |
| CL-27 | Breadcrumb sans `isCurrent` sur le dernier | `[{ label: 'Accueil', href: '/' }]` | ❌ Rejeté : `BREADCRUMB_LAST_CURRENT` | `breadcrumbListSchema` |
| CL-28 | Breadcrumb un seul élément (Accueil courant) | `[{ label: 'Accueil', href: '/', isCurrent: true }]` | ✅ Accepté | `breadcrumbListSchema` |
| CL-29 | TOC depth = 1 (h1) | `{ depth: 1, text: 'Titre', slug: 'titre' }` | ❌ Rejeté : `TOC_DEPTH_INVALID` | `tableOfContentsItemSchema` |
| CL-30 | TOC depth = 5 (h5) | `{ depth: 5, text: 'Détail', slug: 'detail' }` | ❌ Rejeté : `TOC_DEPTH_INVALID` | `tableOfContentsItemSchema` |
| CL-31 | TOC depth = 0 | `{ depth: 0, text: 'A', slug: 'a' }` | ❌ Rejeté : `TOC_DEPTH_INVALID` | `tableOfContentsItemSchema` |
| CL-32 | TOC liste vide | `[]` | ✅ Accepté (page sans headings) | `tableOfContentsListSchema` |
| CL-33 | TOC slugs dupliqués | `[{ slug: 'intro' }, { slug: 'intro' }]` | ❌ Rejeté : `TOC_DUPLICATE_SLUG` | `tableOfContentsListSchema` |
| CL-34 | TOC h2 puis h4 directement (sans h3) | `[{ depth: 2 }, { depth: 4 }]` | ✅ Accepté (pas de contrainte de hiérarchie) | `tableOfContentsListSchema` |
| CL-35 | TOC slug avec majuscules | `{ slug: 'Section-A' }` | ❌ Rejeté : `TOC_SLUG_PATTERN` | `tableOfContentsItemSchema` |
| CL-36 | PrevNext avec les deux null | `{ prev: null, next: null }` | ✅ Accepté (page isolée) | `prevNextLinksSchema` |
| CL-37 | PrevNext navigation cross-section | `{ prev: { section: 'framework' }, next: { section: 'mode-operatoire' } }` | ✅ Accepté | `prevNextLinksSchema` |
| CL-38 | FlatNavItem depth négatif | `{ depth: -1, ... }` | ❌ Rejeté : `FLAT_DEPTH_NONNEGATIVE` | `flatNavigationItemSchema` |
| CL-39 | FlatNavList IDs dupliqués | `[{ id: 'x' }, { id: 'x' }]` | ❌ Rejeté : `FLAT_DUPLICATE_ID` | `flatNavigationListSchema` |
| CL-40 | Item avec `isHidden: true` et même `order` qu'un visible | Visible `order: 1`, hidden `order: 1` | ✅ Accepté : les items masqués sont exclus de la vérification d'unicité `order` | `navigationTreeSchema` |
| CL-41 | Champs manquants (id absent) | `{ label: 'X', href: '/x', order: 1 }` | ❌ Rejeté : `id` requis | `navigationItemSchema` |
| CL-42 | Types incorrects (order = string) | `{ order: "1", ... }` | ❌ Rejeté : type invalide | `navigationItemSchema` |
| CL-43 | Valeur `null` là où non-nullable | `{ id: null, ... }` | ❌ Rejeté : type invalide | `navigationItemSchema` |
| CL-44 | Champs supplémentaires inconnus | `{ id: 'x', ..., extra: 'val' }` | ✅ Accepté (Zod strip par défaut) | Tous |

### 5.2 Matrice contraintes types vs validation

| Contrainte | TypeScript (T-004-B1) | Zod (ce fichier) |
|-----------|----------------------|-----------------|
| `id` pattern slug `^[a-z0-9-]+$` | JSDoc `@pattern` | `.regex()` ✅ |
| `id` longueur 2-80 | JSDoc `@minLength/@maxLength` | `.min(2).max(80)` ✅ |
| `href` commence par `/` | JSDoc `@pattern` | `.startsWith('/')` ✅ |
| `href` pas d'URL externe | Non spécifié | `.refine()` ✅ |
| `depth` = 2\|3\|4 | Type `TOCHeadingDepth` ✅ | `z.union([literal])` ✅ |
| `order` ≥ 0 entier | JSDoc `@minimum` | `.int().nonnegative()` ✅ |
| `label` non vide | JSDoc `@minLength` | `.min(1)` ✅ |
| `label` max 100 chars | JSDoc `@maxLength` | `.max(100)` ✅ |
| `text` max 200 chars | JSDoc `@maxLength` | `.max(200)` ✅ |
| Unicité des `id` | Non (type structurel) | `.refine()` global ✅ |
| Profondeur max 4 | Constante `MAX_NAVIGATION_DEPTH` | `.refine()` récursif ✅ |
| Unicité `order` siblings | Non (type structurel) | `.refine()` récursif ✅ |
| Breadcrumb commence par Accueil | Non (convention) | `.refine()` ✅ |
| Breadcrumb dernier = isCurrent | Non (convention) | `.refine()` ✅ |
| TOC slugs uniques | Non (type structurel) | `.refine()` ✅ |
| `isHidden` défaut `false` | JSDoc `@default` | `.optional().default(false)` ✅ |

---

## 6. Exemples entrée/sortie

### 6.1 `navigationItemSchema` — Item valide minimal

**Entrée :**
```typescript
const input = {
  id: 'fw-preambule',
  label: 'Préambule',
  href: '/framework/preambule',
  order: 1,
}
```

**Sortie (`safeParse`) :**
```typescript
{
  success: true,
  data: {
    id: 'fw-preambule',
    label: 'Préambule',
    href: '/framework/preambule',
    order: 1,
    isHidden: false,  // ← default appliqué
  }
}
```

### 6.2 `navigationItemSchema` — Item avec enfants

**Entrée :**
```typescript
const input = {
  id: 'annexes-a',
  label: 'A - Templates',
  href: '/annexes/templates',
  section: 'annexes',
  order: 1,
  badge: 'new',
  children: [
    { id: 'a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', order: 1 },
    { id: 'a2-arch', label: 'A2 - Architecture', href: '/annexes/templates/architecture', order: 2 },
  ],
}
```

**Sortie :**
```typescript
{
  success: true,
  data: {
    id: 'annexes-a',
    label: 'A - Templates',
    href: '/annexes/templates',
    section: 'annexes',
    order: 1,
    badge: 'new',
    isHidden: false,
    children: [
      { id: 'a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', order: 1, isHidden: false },
      { id: 'a2-arch', label: 'A2 - Architecture', href: '/annexes/templates/architecture', order: 2, isHidden: false },
    ],
  }
}
```

### 6.3 `navigationItemSchema` — Erreur ID invalide

**Entrée :**
```typescript
const input = {
  id: 'Fw_Préambule',  // Majuscules, underscore, accent
  label: 'Préambule',
  href: '/framework/preambule',
  order: 1,
}
```

**Sortie :**
```typescript
{
  success: false,
  error: {
    issues: [{
      code: 'custom',
      message: "L'ID ne doit contenir que des minuscules, chiffres et tirets (pattern: ^[a-z0-9-]+$)",
      path: ['id'],
    }],
  }
}
```

### 6.4 `navigationTreeSchema` — IDs dupliqués

**Entrée :**
```typescript
const input = {
  framework: [
    { id: 'preambule', label: 'Préambule', href: '/framework/preambule', order: 1 },
  ],
  modeOperatoire: [
    { id: 'preambule', label: 'Préambule', href: '/mode-operatoire/preambule', order: 0 },
    // ↑ même id que dans framework !
  ],
  annexes: [],
}
```

**Sortie :**
```typescript
{
  success: false,
  error: {
    issues: [{
      code: 'custom',
      message: "Chaque ID de navigation doit être unique dans tout l'arbre (règle R2)",
      path: [],
    }],
  }
}
```

### 6.5 `navigationTreeSchema` — Profondeur excédée (5 niveaux)

**Entrée :**
```typescript
const input = {
  framework: [],
  modeOperatoire: [],
  annexes: [{
    id: 'l1', label: 'L1', href: '/l1', order: 1,
    children: [{
      id: 'l2', label: 'L2', href: '/l1/l2', order: 1,
      children: [{
        id: 'l3', label: 'L3', href: '/l1/l2/l3', order: 1,
        children: [{
          id: 'l4', label: 'L4', href: '/l1/l2/l3/l4', order: 1,
          children: [{
            id: 'l5', label: 'L5', href: '/l1/l2/l3/l4/l5', order: 1,
          }],
        }],
      }],
    }],
  }],
}
```

**Sortie :**
```typescript
{
  success: false,
  error: {
    issues: [{
      code: 'custom',
      message: "La profondeur de navigation ne doit pas dépasser 4 niveaux (règle R1)",
      path: [],
    }],
  }
}
```

### 6.6 `breadcrumbListSchema` — Valide

**Entrée :**
```typescript
const input = [
  { label: 'Accueil', href: '/' },
  { label: 'Annexes', href: '/annexes' },
  { label: 'A - Templates', href: '/annexes/templates' },
  { label: 'A1 - PRD', href: '/annexes/templates/prd', isCurrent: true },
]
```

**Sortie :**
```typescript
{
  success: true,
  data: [
    { label: 'Accueil', href: '/', isCurrent: false },
    { label: 'Annexes', href: '/annexes', isCurrent: false },
    { label: 'A - Templates', href: '/annexes/templates', isCurrent: false },
    { label: 'A1 - PRD', href: '/annexes/templates/prd', isCurrent: true },
  ]
}
```

### 6.7 `breadcrumbListSchema` — Sans Accueil

**Entrée :**
```typescript
const input = [
  { label: 'Framework', href: '/framework' },
  { label: 'Préambule', href: '/framework/preambule', isCurrent: true },
]
```

**Sortie :**
```typescript
{
  success: false,
  error: {
    issues: [{
      code: 'custom',
      message: "Le fil d'Ariane doit commencer par 'Accueil' avec le href '/' (règle R5)",
      path: [],
    }],
  }
}
```

### 6.8 `tableOfContentsListSchema` — Slugs dupliqués

**Entrée :**
```typescript
const input = [
  { depth: 2, text: 'Introduction', slug: 'introduction' },
  { depth: 3, text: 'Introduction détaillée', slug: 'introduction' }, // doublon !
]
```

**Sortie :**
```typescript
{
  success: false,
  error: {
    issues: [{
      code: 'custom',
      message: "Les slugs doivent être uniques dans une même table des matières (règle R14)",
      path: [],
    }],
  }
}
```

### 6.9 `prevNextLinksSchema` — Navigation cross-section

**Entrée :**
```typescript
const input = {
  prev: { label: 'Annexes', href: '/framework/annexes', section: 'framework' },
  next: { label: 'Préambule', href: '/mode-operatoire/preambule', section: 'mode-operatoire' },
}
```

**Sortie :**
```typescript
{
  success: true,
  data: {
    prev: { label: 'Annexes', href: '/framework/annexes', section: 'framework' },
    next: { label: 'Préambule', href: '/mode-operatoire/preambule', section: 'mode-operatoire' },
  }
}
```

### 6.10 `navigationItemSchema` — Erreurs multiples

**Entrée :**
```typescript
const input = {
  id: '',           // trop court
  label: '',        // vide
  href: 'no-slash', // pas de /
  order: -1.5,      // négatif et flottant
}
```

**Sortie (toutes les erreurs) :**
```typescript
{
  success: false,
  error: {
    issues: [
      { message: "L'ID doit contenir au moins 2 caractères", path: ['id'] },
      { message: "Le label ne doit pas être vide", path: ['label'] },
      { message: "Le chemin doit commencer par '/'", path: ['href'] },
      { message: "L'ordre doit être un entier", path: ['order'] },
    ],
  }
}
```

---

## 7. Tests

### 7.1 Fichier de test

**Emplacement :** `tests/unit/schemas/navigation.test.ts`

### 7.2 Suite de tests

```typescript
// tests/unit/schemas/navigation.test.ts

import { describe, it, expect } from 'vitest'
import {
  NAVIGATION_ERRORS,
  navigationSectionSchema,
  navigationBadgeSchema,
  navigationItemSchema,
  navigationTreeSchema,
  breadcrumbItemSchema,
  breadcrumbListSchema,
  tableOfContentsItemSchema,
  tableOfContentsListSchema,
  prevNextItemSchema,
  prevNextLinksSchema,
  flatNavigationItemSchema,
  flatNavigationListSchema,
} from '@/schemas/navigation'

// ──────────────────────────────────────────────────
// Fixtures
// ──────────────────────────────────────────────────

const validNavItem = {
  id: 'fw-preambule',
  label: 'Préambule',
  href: '/framework/preambule',
  order: 1,
}

const validNavItemWithOptionals = {
  ...validNavItem,
  section: 'framework' as const,
  badge: 'essential' as const,
  isHidden: false,
}

const validNavItemWithChildren = {
  id: 'annexes-a',
  label: 'A - Templates',
  href: '/annexes/templates',
  section: 'annexes' as const,
  order: 1,
  children: [
    { id: 'a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', order: 1 },
    { id: 'a2-arch', label: 'A2 - Architecture', href: '/annexes/templates/architecture', order: 2 },
  ],
}

const validBreadcrumbList = [
  { label: 'Accueil', href: '/' },
  { label: 'Framework', href: '/framework' },
  { label: 'Préambule', href: '/framework/preambule', isCurrent: true },
]

const validTocItem = { depth: 2 as const, text: 'Introduction', slug: 'introduction' }

const validPrevNextLinks = {
  prev: { label: 'Vision', href: '/framework/vision', section: 'framework' as const },
  next: { label: 'Artefacts', href: '/framework/artefacts', section: 'framework' as const },
}

const validTree = {
  framework: [
    { id: 'fw-preambule', label: 'Préambule', href: '/framework/preambule', order: 1 },
    { id: 'fw-vision', label: 'Vision & Philosophie', href: '/framework/vision', order: 2 },
  ],
  modeOperatoire: [
    { id: 'mo-preambule', label: 'Préambule', href: '/mode-operatoire/preambule', order: 0 },
  ],
  annexes: [
    {
      id: 'annexes-a', label: 'A - Templates', href: '/annexes/templates', order: 1,
      children: [
        { id: 'a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', order: 1 },
      ],
    },
  ],
}

// ──────────────────────────────────────────────────
// Tests constantes d'erreur
// ──────────────────────────────────────────────────

describe('NAVIGATION_ERRORS', () => {
  it('exporte toutes les clés de messages d\'erreur', () => {
    expect(NAVIGATION_ERRORS.ID_PATTERN).toBeDefined()
    expect(NAVIGATION_ERRORS.ID_MIN_LENGTH).toBeDefined()
    expect(NAVIGATION_ERRORS.ID_MAX_LENGTH).toBeDefined()
    expect(NAVIGATION_ERRORS.LABEL_MIN_LENGTH).toBeDefined()
    expect(NAVIGATION_ERRORS.LABEL_MAX_LENGTH).toBeDefined()
    expect(NAVIGATION_ERRORS.HREF_START_SLASH).toBeDefined()
    expect(NAVIGATION_ERRORS.HREF_NO_EXTERNAL).toBeDefined()
    expect(NAVIGATION_ERRORS.ORDER_INTEGER).toBeDefined()
    expect(NAVIGATION_ERRORS.ORDER_NONNEGATIVE).toBeDefined()
    expect(NAVIGATION_ERRORS.SECTION_INVALID).toBeDefined()
    expect(NAVIGATION_ERRORS.BADGE_INVALID).toBeDefined()
    expect(NAVIGATION_ERRORS.MAX_DEPTH_EXCEEDED).toBeDefined()
    expect(NAVIGATION_ERRORS.TREE_DUPLICATE_ID).toBeDefined()
    expect(NAVIGATION_ERRORS.TREE_DUPLICATE_ORDER).toBeDefined()
    expect(NAVIGATION_ERRORS.BREADCRUMB_EMPTY).toBeDefined()
    expect(NAVIGATION_ERRORS.BREADCRUMB_START_HOME).toBeDefined()
    expect(NAVIGATION_ERRORS.BREADCRUMB_LAST_CURRENT).toBeDefined()
    expect(NAVIGATION_ERRORS.TOC_DEPTH_INVALID).toBeDefined()
    expect(NAVIGATION_ERRORS.TOC_TEXT_MIN_LENGTH).toBeDefined()
    expect(NAVIGATION_ERRORS.TOC_TEXT_MAX_LENGTH).toBeDefined()
    expect(NAVIGATION_ERRORS.TOC_SLUG_PATTERN).toBeDefined()
    expect(NAVIGATION_ERRORS.TOC_DUPLICATE_SLUG).toBeDefined()
    expect(NAVIGATION_ERRORS.FLAT_DEPTH_NONNEGATIVE).toBeDefined()
    expect(NAVIGATION_ERRORS.FLAT_DUPLICATE_ID).toBeDefined()
  })

  it('les messages sont en français', () => {
    Object.values(NAVIGATION_ERRORS).forEach((message) => {
      expect(typeof message).toBe('string')
      expect(message.length).toBeGreaterThan(0)
    })
  })
})

// ──────────────────────────────────────────────────
// Tests navigationSectionSchema
// ──────────────────────────────────────────────────

describe('navigationSectionSchema', () => {
  it.each(['framework', 'mode-operatoire', 'annexes'])(
    'accepte la section valide "%s"',
    (section) => {
      expect(navigationSectionSchema.safeParse(section).success).toBe(true)
    }
  )

  it.each(['blog', 'templates', '', 'FRAMEWORK', 123, null, undefined])(
    'rejette la valeur invalide %j',
    (value) => {
      const result = navigationSectionSchema.safeParse(value)
      expect(result.success).toBe(false)
    }
  )
})

// ──────────────────────────────────────────────────
// Tests navigationBadgeSchema
// ──────────────────────────────────────────────────

describe('navigationBadgeSchema', () => {
  it.each(['new', 'essential'])(
    'accepte le badge valide "%s"',
    (badge) => {
      expect(navigationBadgeSchema.safeParse(badge).success).toBe(true)
    }
  )

  it.each(['featured', 'important', '', 'NEW', null])(
    'rejette la valeur invalide %j',
    (value) => {
      const result = navigationBadgeSchema.safeParse(value)
      expect(result.success).toBe(false)
    }
  )
})

// ──────────────────────────────────────────────────
// Tests navigationItemSchema
// ──────────────────────────────────────────────────

describe('navigationItemSchema', () => {
  describe('Cas valides', () => {
    it('CL-01: accepte un item minimal (sans optionnels)', () => {
      const result = navigationItemSchema.safeParse(validNavItem)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe('fw-preambule')
        expect(result.data.isHidden).toBe(false) // default
      }
    })

    it('accepte un item avec tous les champs optionnels', () => {
      const result = navigationItemSchema.safeParse(validNavItemWithOptionals)
      expect(result.success).toBe(true)
    })

    it('CL-02: accepte un item avec children vide', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, children: [] })
      expect(result.success).toBe(true)
    })

    it('accepte un item avec enfants imbriqués (3 niveaux)', () => {
      const result = navigationItemSchema.safeParse(validNavItemWithChildren)
      expect(result.success).toBe(true)
    })

    it('CL-15: accepte order = 0', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, order: 0 })
      expect(result.success).toBe(true)
    })

    it('CL-18: accepte un label avec accents et symboles', () => {
      const result = navigationItemSchema.safeParse({
        ...validNavItem,
        label: 'Écosystème & Architecture — Vue d\'ensemble',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('Validation id', () => {
    it('CL-05: rejette un ID avec majuscules', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, id: 'Fw-Preambule' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.ID_PATTERN)
      }
    })

    it('CL-06: rejette un ID avec espaces', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, id: 'fw preambule' })
      expect(result.success).toBe(false)
    })

    it('CL-07: rejette un ID avec underscore et accents', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, id: 'fw_préambule' })
      expect(result.success).toBe(false)
    })

    it('CL-08: rejette un ID de 1 caractère', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, id: 'x' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.ID_MIN_LENGTH)
      }
    })

    it('CL-09: rejette un ID de 81 caractères', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, id: 'a'.repeat(81) })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.ID_MAX_LENGTH)
      }
    })

    it('accepte un ID aux bornes (2 caractères)', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, id: 'ab' })
      expect(result.success).toBe(true)
    })

    it('accepte un ID aux bornes (80 caractères)', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, id: 'a'.repeat(80) })
      expect(result.success).toBe(true)
    })
  })

  describe('Validation label', () => {
    it('CL-16: rejette un label vide', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, label: '' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.LABEL_MIN_LENGTH)
      }
    })

    it('CL-17: rejette un label de 101 caractères', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, label: 'a'.repeat(101) })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.LABEL_MAX_LENGTH)
      }
    })
  })

  describe('Validation href', () => {
    it('CL-10: rejette un href sans slash initial', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, href: 'framework' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.HREF_START_SLASH)
      }
    })

    it('CL-11: rejette une URL externe https', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, href: 'https://example.com' })
      expect(result.success).toBe(false)
    })

    it('CL-12: rejette une URL proto-relative', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, href: '//cdn.com/path' })
      expect(result.success).toBe(false)
    })
  })

  describe('Validation order', () => {
    it('CL-13: rejette un order négatif', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, order: -1 })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.ORDER_NONNEGATIVE)
      }
    })

    it('CL-14: rejette un order flottant', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, order: 1.5 })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.ORDER_INTEGER)
      }
    })

    it('CL-42: rejette un order de type string', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, order: '1' })
      expect(result.success).toBe(false)
    })
  })

  describe('Validation section et badge', () => {
    it('CL-19: rejette une section invalide', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, section: 'blog' })
      expect(result.success).toBe(false)
    })

    it('CL-20: rejette un badge invalide', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, badge: 'featured' })
      expect(result.success).toBe(false)
    })
  })

  describe('Champs manquants et types incorrects', () => {
    it('CL-41: rejette un item sans id', () => {
      const { id, ...noId } = validNavItem
      const result = navigationItemSchema.safeParse(noId)
      expect(result.success).toBe(false)
    })

    it('rejette un item sans label', () => {
      const { label, ...noLabel } = validNavItem
      const result = navigationItemSchema.safeParse(noLabel)
      expect(result.success).toBe(false)
    })

    it('rejette un item sans href', () => {
      const { href, ...noHref } = validNavItem
      const result = navigationItemSchema.safeParse(noHref)
      expect(result.success).toBe(false)
    })

    it('rejette un item sans order', () => {
      const { order, ...noOrder } = validNavItem
      const result = navigationItemSchema.safeParse(noOrder)
      expect(result.success).toBe(false)
    })

    it('CL-43: rejette id = null', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, id: null })
      expect(result.success).toBe(false)
    })
  })

  describe('Valeurs par défaut', () => {
    it('applique isHidden = false par défaut', () => {
      const result = navigationItemSchema.safeParse(validNavItem)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.isHidden).toBe(false)
      }
    })
  })
})

// ──────────────────────────────────────────────────
// Tests navigationTreeSchema
// ──────────────────────────────────────────────────

describe('navigationTreeSchema', () => {
  describe('Cas valides', () => {
    it('accepte un arbre complet valide', () => {
      const result = navigationTreeSchema.safeParse(validTree)
      expect(result.success).toBe(true)
    })

    it('CL-24: accepte un arbre avec une section vide', () => {
      const result = navigationTreeSchema.safeParse({
        framework: [],
        modeOperatoire: [{ id: 'mo-1', label: 'Test', href: '/test', order: 1 }],
        annexes: [],
      })
      expect(result.success).toBe(true)
    })

    it('CL-04: accepte un arbre de 4 niveaux exactement', () => {
      const tree = {
        framework: [],
        modeOperatoire: [],
        annexes: [{
          id: 'l1', label: 'L1', href: '/l1', order: 1,
          children: [{
            id: 'l2', label: 'L2', href: '/l1/l2', order: 1,
            children: [{
              id: 'l3', label: 'L3', href: '/l1/l2/l3', order: 1,
            }],
          }],
        }],
      }
      const result = navigationTreeSchema.safeParse(tree)
      expect(result.success).toBe(true)
    })

    it('CL-23: accepte des siblings dans des niveaux différents avec le même order', () => {
      const tree = {
        framework: [{
          id: 'parent', label: 'Parent', href: '/parent', order: 1,
          children: [{ id: 'child', label: 'Child', href: '/parent/child', order: 1 }],
        }],
        modeOperatoire: [],
        annexes: [],
      }
      const result = navigationTreeSchema.safeParse(tree)
      expect(result.success).toBe(true)
    })

    it('CL-40: accepte un item masqué avec le même order qu\'un visible', () => {
      const tree = {
        framework: [
          { id: 'item-visible', label: 'Visible', href: '/visible', order: 1 },
          { id: 'item-hidden', label: 'Masqué', href: '/hidden', order: 1, isHidden: true },
        ],
        modeOperatoire: [],
        annexes: [],
      }
      const result = navigationTreeSchema.safeParse(tree)
      expect(result.success).toBe(true)
    })
  })

  describe('Règle R1 : profondeur maximale', () => {
    it('CL-03: rejette un arbre de 5 niveaux', () => {
      const tree = {
        framework: [],
        modeOperatoire: [],
        annexes: [{
          id: 'l1', label: 'L1', href: '/l1', order: 1,
          children: [{
            id: 'l2', label: 'L2', href: '/l2', order: 1,
            children: [{
              id: 'l3', label: 'L3', href: '/l3', order: 1,
              children: [{
                id: 'l4', label: 'L4', href: '/l4', order: 1,
                children: [{
                  id: 'l5', label: 'L5', href: '/l5', order: 1,
                }],
              }],
            }],
          }],
        }],
      }
      const result = navigationTreeSchema.safeParse(tree)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.MAX_DEPTH_EXCEEDED)
      }
    })
  })

  describe('Règle R2 : unicité des IDs', () => {
    it('CL-21: rejette des IDs dupliqués entre sections', () => {
      const tree = {
        framework: [{ id: 'preambule', label: 'FW', href: '/fw', order: 1 }],
        modeOperatoire: [{ id: 'preambule', label: 'MO', href: '/mo', order: 0 }],
        annexes: [],
      }
      const result = navigationTreeSchema.safeParse(tree)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.TREE_DUPLICATE_ID)
      }
    })

    it('rejette des IDs dupliqués parent/enfant', () => {
      const tree = {
        framework: [{
          id: 'dupli', label: 'Parent', href: '/parent', order: 1,
          children: [{ id: 'dupli', label: 'Child', href: '/child', order: 1 }],
        }],
        modeOperatoire: [],
        annexes: [],
      }
      const result = navigationTreeSchema.safeParse(tree)
      expect(result.success).toBe(false)
    })
  })

  describe('Règle R3 : unicité des order parmi siblings', () => {
    it('CL-22: rejette deux siblings avec le même order', () => {
      const tree = {
        framework: [
          { id: 'fw-1', label: 'A', href: '/a', order: 1 },
          { id: 'fw-2', label: 'B', href: '/b', order: 1 }, // doublon
        ],
        modeOperatoire: [],
        annexes: [],
      }
      const result = navigationTreeSchema.safeParse(tree)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.TREE_DUPLICATE_ORDER)
      }
    })

    it('rejette des order dupliqués dans les enfants', () => {
      const tree = {
        framework: [{
          id: 'parent', label: 'Parent', href: '/parent', order: 1,
          children: [
            { id: 'child-1', label: 'C1', href: '/c1', order: 1 },
            { id: 'child-2', label: 'C2', href: '/c2', order: 1 },
          ],
        }],
        modeOperatoire: [],
        annexes: [],
      }
      const result = navigationTreeSchema.safeParse(tree)
      expect(result.success).toBe(false)
    })
  })
})

// ──────────────────────────────────────────────────
// Tests breadcrumbItemSchema et breadcrumbListSchema
// ──────────────────────────────────────────────────

describe('breadcrumbItemSchema', () => {
  it('accepte un item valide', () => {
    const result = breadcrumbItemSchema.safeParse({ label: 'Framework', href: '/framework' })
    expect(result.success).toBe(true)
  })

  it('accepte un item avec isCurrent', () => {
    const result = breadcrumbItemSchema.safeParse({ label: 'PRD', href: '/prd', isCurrent: true })
    expect(result.success).toBe(true)
  })

  it('applique isCurrent = false par défaut', () => {
    const result = breadcrumbItemSchema.safeParse({ label: 'Test', href: '/test' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.isCurrent).toBe(false)
    }
  })

  it('rejette un label vide', () => {
    const result = breadcrumbItemSchema.safeParse({ label: '', href: '/test' })
    expect(result.success).toBe(false)
  })

  it('rejette un href sans slash', () => {
    const result = breadcrumbItemSchema.safeParse({ label: 'Test', href: 'test' })
    expect(result.success).toBe(false)
  })
})

describe('breadcrumbListSchema', () => {
  it('accepte une liste valide', () => {
    const result = breadcrumbListSchema.safeParse(validBreadcrumbList)
    expect(result.success).toBe(true)
  })

  it('CL-28: accepte un breadcrumb avec un seul élément (Accueil courant)', () => {
    const result = breadcrumbListSchema.safeParse([
      { label: 'Accueil', href: '/', isCurrent: true },
    ])
    expect(result.success).toBe(true)
  })

  it('CL-25: rejette un breadcrumb vide', () => {
    const result = breadcrumbListSchema.safeParse([])
    expect(result.success).toBe(false)
  })

  it('CL-26: rejette un breadcrumb sans Accueil en premier', () => {
    const result = breadcrumbListSchema.safeParse([
      { label: 'Framework', href: '/framework', isCurrent: true },
    ])
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.BREADCRUMB_START_HOME)
    }
  })

  it('CL-27: rejette un breadcrumb sans isCurrent sur le dernier élément', () => {
    const result = breadcrumbListSchema.safeParse([
      { label: 'Accueil', href: '/' },
      { label: 'Framework', href: '/framework' },
    ])
    expect(result.success).toBe(false)
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message)
      expect(messages).toContain(NAVIGATION_ERRORS.BREADCRUMB_LAST_CURRENT)
    }
  })
})

// ──────────────────────────────────────────────────
// Tests tableOfContentsItemSchema et tableOfContentsListSchema
// ──────────────────────────────────────────────────

describe('tableOfContentsItemSchema', () => {
  it('accepte un item valide (h2)', () => {
    const result = tableOfContentsItemSchema.safeParse(validTocItem)
    expect(result.success).toBe(true)
  })

  it.each([2, 3, 4])('accepte depth = %d', (depth) => {
    const result = tableOfContentsItemSchema.safeParse({ ...validTocItem, depth })
    expect(result.success).toBe(true)
  })

  it('CL-29: rejette depth = 1 (h1)', () => {
    const result = tableOfContentsItemSchema.safeParse({ ...validTocItem, depth: 1 })
    expect(result.success).toBe(false)
  })

  it('CL-30: rejette depth = 5 (h5)', () => {
    const result = tableOfContentsItemSchema.safeParse({ ...validTocItem, depth: 5 })
    expect(result.success).toBe(false)
  })

  it('CL-31: rejette depth = 0', () => {
    const result = tableOfContentsItemSchema.safeParse({ ...validTocItem, depth: 0 })
    expect(result.success).toBe(false)
  })

  it('rejette un text vide', () => {
    const result = tableOfContentsItemSchema.safeParse({ ...validTocItem, text: '' })
    expect(result.success).toBe(false)
  })

  it('rejette un text > 200 caractères', () => {
    const result = tableOfContentsItemSchema.safeParse({ ...validTocItem, text: 'a'.repeat(201) })
    expect(result.success).toBe(false)
  })

  it('CL-35: rejette un slug avec majuscules', () => {
    const result = tableOfContentsItemSchema.safeParse({ ...validTocItem, slug: 'Section-A' })
    expect(result.success).toBe(false)
  })
})

describe('tableOfContentsListSchema', () => {
  it('CL-32: accepte une liste vide', () => {
    const result = tableOfContentsListSchema.safeParse([])
    expect(result.success).toBe(true)
  })

  it('accepte une liste valide', () => {
    const result = tableOfContentsListSchema.safeParse([
      { depth: 2, text: 'Section A', slug: 'section-a' },
      { depth: 3, text: 'Détail A', slug: 'detail-a' },
    ])
    expect(result.success).toBe(true)
  })

  it('CL-34: accepte h2 puis h4 directement (sans h3)', () => {
    const result = tableOfContentsListSchema.safeParse([
      { depth: 2, text: 'Section', slug: 'section' },
      { depth: 4, text: 'Détail profond', slug: 'detail-profond' },
    ])
    expect(result.success).toBe(true)
  })

  it('CL-33: rejette des slugs dupliqués', () => {
    const result = tableOfContentsListSchema.safeParse([
      { depth: 2, text: 'Introduction', slug: 'introduction' },
      { depth: 3, text: 'Introduction détaillée', slug: 'introduction' },
    ])
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.TOC_DUPLICATE_SLUG)
    }
  })
})

// ──────────────────────────────────────────────────
// Tests prevNextItemSchema et prevNextLinksSchema
// ──────────────────────────────────────────────────

describe('prevNextItemSchema', () => {
  it('accepte un item valide', () => {
    const result = prevNextItemSchema.safeParse({
      label: 'Vision & Philosophie',
      href: '/framework/vision',
      section: 'framework',
    })
    expect(result.success).toBe(true)
  })

  it('accepte un item sans section', () => {
    const result = prevNextItemSchema.safeParse({
      label: 'Test',
      href: '/test',
    })
    expect(result.success).toBe(true)
  })
})

describe('prevNextLinksSchema', () => {
  it('accepte des liens valides', () => {
    const result = prevNextLinksSchema.safeParse(validPrevNextLinks)
    expect(result.success).toBe(true)
  })

  it('CL-36: accepte prev et next null', () => {
    const result = prevNextLinksSchema.safeParse({ prev: null, next: null })
    expect(result.success).toBe(true)
  })

  it('accepte prev null (première page)', () => {
    const result = prevNextLinksSchema.safeParse({
      prev: null,
      next: { label: 'Vision', href: '/framework/vision', section: 'framework' },
    })
    expect(result.success).toBe(true)
  })

  it('accepte next null (dernière page)', () => {
    const result = prevNextLinksSchema.safeParse({
      prev: { label: 'Communauté', href: '/annexes/ressources/communaute', section: 'annexes' },
      next: null,
    })
    expect(result.success).toBe(true)
  })

  it('CL-37: accepte la navigation cross-section', () => {
    const result = prevNextLinksSchema.safeParse({
      prev: { label: 'Annexes FW', href: '/framework/annexes', section: 'framework' },
      next: { label: 'Préambule MO', href: '/mode-operatoire/preambule', section: 'mode-operatoire' },
    })
    expect(result.success).toBe(true)
  })
})

// ──────────────────────────────────────────────────
// Tests flatNavigationItemSchema et flatNavigationListSchema
// ──────────────────────────────────────────────────

describe('flatNavigationItemSchema', () => {
  it('accepte un item valide', () => {
    const result = flatNavigationItemSchema.safeParse({
      id: 'fw-preambule',
      label: 'Préambule',
      href: '/framework/preambule',
      section: 'framework',
      depth: 0,
    })
    expect(result.success).toBe(true)
  })

  it('accepte un item sans section', () => {
    const result = flatNavigationItemSchema.safeParse({
      id: 'test',
      label: 'Test',
      href: '/test',
      depth: 0,
    })
    expect(result.success).toBe(true)
  })

  it('CL-38: rejette depth négatif', () => {
    const result = flatNavigationItemSchema.safeParse({
      id: 'test',
      label: 'Test',
      href: '/test',
      depth: -1,
    })
    expect(result.success).toBe(false)
  })
})

describe('flatNavigationListSchema', () => {
  it('accepte une liste valide', () => {
    const result = flatNavigationListSchema.safeParse([
      { id: 'fw-1', label: 'A', href: '/a', section: 'framework', depth: 0 },
      { id: 'fw-2', label: 'B', href: '/b', section: 'framework', depth: 0 },
    ])
    expect(result.success).toBe(true)
  })

  it('CL-39: rejette des IDs dupliqués', () => {
    const result = flatNavigationListSchema.safeParse([
      { id: 'dupli', label: 'A', href: '/a', depth: 0 },
      { id: 'dupli', label: 'B', href: '/b', depth: 0 },
    ])
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.FLAT_DUPLICATE_ID)
    }
  })

  it('accepte une liste vide', () => {
    const result = flatNavigationListSchema.safeParse([])
    expect(result.success).toBe(true)
  })
})

// ──────────────────────────────────────────────────
// Tests d'erreurs multiples
// ──────────────────────────────────────────────────

describe('Erreurs multiples', () => {
  it('CL-10 (6.10): remonte toutes les erreurs sur un item totalement invalide', () => {
    const result = navigationItemSchema.safeParse({
      id: '',
      label: '',
      href: 'no-slash',
      order: -1.5,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(3)
    }
  })
})
```

### 7.3 Matrice de couverture

| Schéma | Cas valide | Cas invalide | Cas limite | Message vérifié | Couverture |
|--------|------------|-------------|------------|-----------------|------------|
| `NAVIGATION_ERRORS` | ✅ (clés) | - | - | ✅ (français) | 100% |
| `navigationSectionSchema` | ✅ (3 valeurs) | ✅ (7 valeurs) | - | - | 100% |
| `navigationBadgeSchema` | ✅ (2 valeurs) | ✅ (5 valeurs) | - | - | 100% |
| `navigationItemSchema` | ✅ (6 tests) | ✅ (14 tests) | ✅ (CL-01 à CL-20) | ✅ (8 messages) | 100% |
| `navigationTreeSchema` | ✅ (4 tests) | ✅ (5 tests) | ✅ (CL-03, CL-04, CL-21-24, CL-40) | ✅ (3 messages) | 100% |
| `breadcrumbItemSchema` | ✅ (3 tests) | ✅ (2 tests) | - | - | 100% |
| `breadcrumbListSchema` | ✅ (2 tests) | ✅ (3 tests) | ✅ (CL-25 à CL-28) | ✅ (3 messages) | 100% |
| `tableOfContentsItemSchema` | ✅ (4 tests) | ✅ (5 tests) | ✅ (CL-29 à CL-35) | - | 100% |
| `tableOfContentsListSchema` | ✅ (3 tests) | ✅ (1 test) | ✅ (CL-32 à CL-34) | ✅ (1 message) | 100% |
| `prevNextItemSchema` | ✅ (2 tests) | - | - | - | 100% |
| `prevNextLinksSchema` | ✅ (4 tests) | - | ✅ (CL-36, CL-37) | - | 100% |
| `flatNavigationItemSchema` | ✅ (2 tests) | ✅ (1 test) | ✅ (CL-38) | - | 100% |
| `flatNavigationListSchema` | ✅ (2 tests) | ✅ (1 test) | ✅ (CL-39) | ✅ (1 message) | 100% |
| Erreurs multiples | - | ✅ (1 test) | - | - | 100% |

**Total : ~72 tests, couvrant 44 cas limites, 14 règles métier.**

### 7.4 Commandes de test

```bash
# Exécuter les tests de ce fichier uniquement
pnpm test:unit -- navigation

# Schémas uniquement
pnpm test:unit -- schemas/navigation

# Avec couverture
pnpm test:unit -- schemas/navigation --coverage

# Vérification TypeScript (compilation des types inférés)
pnpm typecheck
```

---

## 8. Critères d'acceptation

- [ ] **CA-01** : Le fichier `src/schemas/navigation.ts` est créé avec les 12 schémas listés en section 3.1
- [ ] **CA-02** : La constante `NAVIGATION_ERRORS` est exportée avec tous les messages en français
- [ ] **CA-03** : Les schémas atomiques (`navigationSectionSchema`, `navigationBadgeSchema`) valident les enums correctement
- [ ] **CA-04** : `navigationItemSchema` est récursif et valide les enfants
- [ ] **CA-05** : `navigationItemSchema` applique le défaut `isHidden: false`
- [ ] **CA-06** : `navigationTreeSchema` rejette les IDs dupliqués (règle R2)
- [ ] **CA-07** : `navigationTreeSchema` rejette les `order` dupliqués entre siblings (règle R3)
- [ ] **CA-08** : `navigationTreeSchema` rejette les arbres de profondeur > 4 (règle R1)
- [ ] **CA-09** : `breadcrumbListSchema` valide le premier élément Accueil (règle R5) et le dernier `isCurrent` (règle R13)
- [ ] **CA-10** : `tableOfContentsItemSchema` rejette les `depth` hors 2-4 (règle R6)
- [ ] **CA-11** : `tableOfContentsListSchema` rejette les slugs dupliqués (règle R14)
- [ ] **CA-12** : `prevNextLinksSchema` accepte `prev` et `next` nullable
- [ ] **CA-13** : `flatNavigationListSchema` rejette les IDs dupliqués
- [ ] **CA-14** : Les types inférés (`*SchemaType`) sont compatibles avec les interfaces de T-004-B1
- [ ] **CA-15** : Tous les tests passent (`pnpm test:unit -- schemas/navigation`)
- [ ] **CA-16** : TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] **CA-17** : ESLint passe sans warning (`pnpm lint`)

---

## 9. Definition of Done

- [ ] Code implémenté selon les spécifications (sections 4.1 à 4.10)
- [ ] Tests unitaires écrits et passants (section 7.2, ~72 tests)
- [ ] Couverture de tests ≥ 90% sur `src/schemas/navigation.ts`
- [ ] TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] ESLint passe sans warning (`pnpm lint`)
- [ ] Documentation JSDoc complète (`@module`, `@description`, `@remarks`, `@example`)
- [ ] Types inférés compatibles avec les interfaces de `src/types/navigation.ts` (T-004-B1)
- [ ] Messages d'erreur en français vérifiés par les tests

---

## 10. Références

| Document | Lien |
|----------|------|
| User Story US-004 | [spec-US-004.md](./spec-US-004.md) |
| Types TypeScript navigation (T-004-B1) | [T-004-B1-types-typescript-navigation.md](./T-004-B1-types-typescript-navigation.md) |
| Architecture | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| Schéma Zod existant (modèle) | [src/schemas/benefit.ts](../../../src/schemas/benefit.ts) |
| Schéma Zod existant (modèle) | [src/schemas/stat.ts](../../../src/schemas/stat.ts) |
| Types implémentés | [src/types/navigation.ts](../../../src/types/navigation.ts) |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 09/02/2026 | Création initiale : 12 schémas, 14 règles métier, 44 cas limites, ~72 tests, 17 critères d'acceptation |
