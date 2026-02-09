# T-004-B1 : Définir les types TypeScript de navigation

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 9 février 2026 |
| **Statut** | 🟢 Terminée |
| **User Story** | [US-004 - Naviguer facilement dans le framework](./spec-US-004.md) |
| **Dépendances** | Aucune (tâche racine) |
| **Bloque** | T-004-B2 (Schémas Zod), T-004-B3 (Configuration navigation), T-004-B4 (Helpers), T-004-F2 (NavLink), T-004-F7 (TableOfContents) |

---

## 1. Objectif

Définir et implémenter les types TypeScript pour l'ensemble du système de navigation du site AIAD, en garantissant :

- **Type-safety** : Toutes les structures de navigation sont typées à la compilation
- **Cohérence** : Un seul fichier source de vérité pour les types partagés par tous les composants de navigation
- **Extensibilité** : Types préparés pour l'ajout de sections futures, i18n (Phase 2), et badges dynamiques
- **Compatibilité Astro** : Types alignés avec les conventions Astro (Content Collections, file-based routing)

---

## 2. Contexte technique

### 2.1 Architecture cible

D'après [ARCHITECTURE.md](../../ARCHITECTURE.md), le projet utilise :

- **Astro 4.x** avec Content Collections pour la gestion du contenu
- **TypeScript 5.x** en mode strict (`noImplicitAny`, `strictNullChecks`)
- **Zod** (via `astro:content`) pour la validation des schémas (T-004-B2)
- Types existants dans `src/types/` : `hero.ts`, `benefit.ts`, `stat.ts`

### 2.2 Positionnement dans l'arborescence

```
src/
├── types/
│   ├── index.ts            # ← Ajout des exports navigation
│   ├── hero.ts             # Existant
│   ├── benefit.ts          # Existant
│   ├── stat.ts             # Existant
│   └── navigation.ts       # ← NOUVEAU - Types navigation
├── data/
│   └── navigation.ts       # ← Configuration (T-004-B3)
└── lib/
    └── navigation.ts       # ← Helpers (T-004-B4)
```

### 2.3 Conventions suivies

Conformément aux types existants (`hero.ts`, `benefit.ts`) :

| Convention | Détail |
|-----------|--------|
| Nommage interfaces | PascalCase (`NavigationItem`) |
| Nommage types dérivés | PascalCase avec suffixe (`NavigationItemInput`) |
| Constantes | SCREAMING_SNAKE_CASE avec `as const` (`NAVIGATION_SECTIONS`) |
| JSDoc | Présent sur chaque interface, champ et type exporté |
| Exemples | `@example` dans la JSDoc des interfaces principales |

---

## 3. Spécifications fonctionnelles

### 3.1 Inventaire des types à créer

La navigation du site AIAD couvre 3 systèmes distincts qui nécessitent 7 types principaux :

| Système | Type(s) | Utilisé par |
|---------|---------|-------------|
| **Menu principal** | `NavigationItem`, `NavigationSection`, `NavigationTree` | Header, DropdownMenu, MobileMenu, Sidebar |
| **Fil d'Ariane** | `BreadcrumbItem` | Breadcrumb |
| **Table des matières** | `TableOfContentsItem` | TableOfContents |
| **Navigation séquentielle** | `PrevNextItem`, `PrevNextLinks` | PrevNextLinks |
| **Transverse** | `FlatNavigationItem` | Helpers (flattenNav, getPrevNext) |

### 3.2 Structure hiérarchique de navigation

Les types doivent supporter l'arbre suivant (jusqu'à 4 niveaux) :

```
Niveau 0 : Racine (implicite)
├── Niveau 1 : Section (Framework, Mode Opératoire, Annexes)
│   ├── Niveau 2 : Chapitre (ex: Préambule, Vision & Philosophie)
│   │   └── Niveau 3 : Sous-page (ex: Product Engineer) ← rare
│   └── Niveau 2 : Catégorie Annexe (ex: A - Templates)
│       └── Niveau 3 : Fiche Annexe (ex: A1 - PRD)
```

### 3.3 Définition des champs par type

#### 3.3.1 `NavigationSection` (constante + type)

Type union des 3 sections principales du site.

| Valeur | Description |
|--------|-------------|
| `'framework'` | 8 chapitres du Framework AIAD |
| `'mode-operatoire'` | 8 chapitres du Mode Opératoire |
| `'annexes'` | 9 catégories d'Annexes (46 fiches) |

#### 3.3.2 `NavigationBadge` (constante + type)

Type union des badges visuels applicables aux items de navigation.

| Valeur | Description | Usage |
|--------|-------------|-------|
| `'new'` | Contenu récemment ajouté | Nouveaux chapitres ou fiches |
| `'essential'` | Contenu marqué comme essentiel | Pages critiques du Mode Opératoire |

#### 3.3.3 `NavigationItem`

Noeud récursif de l'arbre de navigation, utilisé par le menu principal, la sidebar et le mobile menu.

| Champ | Type | Requis | Description | Contraintes |
|-------|------|--------|-------------|-------------|
| `id` | `string` | ✅ | Identifiant unique slug-friendly | Pattern: `^[a-z0-9-]+$`, 2-80 chars |
| `label` | `string` | ✅ | Texte affiché dans la navigation | 1-100 caractères |
| `href` | `string` | ✅ | Chemin URL de la page | Doit commencer par `/` |
| `section` | `NavigationSection` | ❌ | Section parente (niveau 1 uniquement) | `'framework'` \| `'mode-operatoire'` \| `'annexes'` |
| `children` | `NavigationItem[]` | ❌ | Sous-éléments de navigation | Max 3 niveaux de profondeur |
| `badge` | `NavigationBadge` | ❌ | Badge visuel | `'new'` \| `'essential'` |
| `order` | `number` | ✅ | Ordre d'affichage parmi les siblings | Entier ≥ 0 |
| `isHidden` | `boolean` | ❌ | Masquer dans la navigation | Défaut: `false` |

#### 3.3.4 `NavigationTree`

Structure racine contenant les 3 sections de navigation.

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `framework` | `NavigationItem[]` | ✅ | Chapitres du Framework |
| `modeOperatoire` | `NavigationItem[]` | ✅ | Chapitres du Mode Opératoire |
| `annexes` | `NavigationItem[]` | ✅ | Catégories d'Annexes |

#### 3.3.5 `BreadcrumbItem`

Élément du fil d'Ariane affiché sur chaque page.

| Champ | Type | Requis | Description | Contraintes |
|-------|------|--------|-------------|-------------|
| `label` | `string` | ✅ | Texte affiché | 1-100 caractères |
| `href` | `string` | ✅ | Lien de navigation | Doit commencer par `/` |
| `isCurrent` | `boolean` | ❌ | Dernier élément (page courante) | Défaut: `false` |

#### 3.3.6 `TableOfContentsItem`

Élément de la table des matières d'une page (headings h2-h4).

| Champ | Type | Requis | Description | Contraintes |
|-------|------|--------|-------------|-------------|
| `depth` | `number` | ✅ | Niveau de heading | 2, 3 ou 4 (h2-h4) |
| `text` | `string` | ✅ | Texte du heading | 1-200 caractères |
| `slug` | `string` | ✅ | Ancre URL (id du heading) | Pattern: `^[a-z0-9-]+$` |

#### 3.3.7 `PrevNextItem`

Représente un lien de navigation séquentielle (page précédente ou suivante).

| Champ | Type | Requis | Description | Contraintes |
|-------|------|--------|-------------|-------------|
| `label` | `string` | ✅ | Titre de la page liée | 1-100 caractères |
| `href` | `string` | ✅ | Chemin URL | Doit commencer par `/` |
| `section` | `NavigationSection` | ❌ | Section de la page liée | Utile pour le visuel (badge section) |

#### 3.3.8 `PrevNextLinks`

Paire de liens séquentiels en bas de chaque page de documentation.

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `prev` | `PrevNextItem \| null` | ✅ | Page précédente (null si première page) |
| `next` | `PrevNextItem \| null` | ✅ | Page suivante (null si dernière page) |

#### 3.3.9 `FlatNavigationItem`

Version aplatie d'un `NavigationItem` pour le parcours linéaire (calcul prev/next).

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `id` | `string` | ✅ | Identifiant unique (hérité) |
| `label` | `string` | ✅ | Texte affiché (hérité) |
| `href` | `string` | ✅ | Chemin URL (hérité) |
| `section` | `NavigationSection` | ❌ | Section parente (héritée ou propagée) |
| `depth` | `number` | ✅ | Profondeur dans l'arbre (0 = racine section) |

### 3.4 Règles métier

| ID | Règle | Justification |
|----|-------|---------------|
| R1 | L'arbre de navigation ne doit pas excéder 4 niveaux de profondeur | Complexité UI, règle des < 3 clics |
| R2 | Chaque `NavigationItem.id` doit être unique dans tout l'arbre | Clé React/Astro et lookup O(1) |
| R3 | `NavigationItem.order` doit être un entier ≥ 0, unique parmi les siblings | Tri déterministe |
| R4 | `NavigationItem.href` doit commencer par `/` | Chemins absolus relatifs au site |
| R5 | Le breadcrumb doit toujours commencer par `Accueil` (`/`) | Orientation utilisateur |
| R6 | `TableOfContentsItem.depth` doit être 2, 3 ou 4 | Seuls h2-h4 sont dans la TOC |
| R7 | La navigation prev/next suit l'ordre `flattenNav()` sur tout l'arbre | Continuité de lecture |
| R8 | `NavigationBadge` est limité aux valeurs `'new'` et `'essential'` | Cohérence visuelle |
| R9 | Les items avec `isHidden: true` sont exclus de `flattenNav()` | Pages masquées non navigables |

---

## 4. Spécifications techniques

### 4.1 Constantes

```typescript
// src/types/navigation.ts

/**
 * Sections principales du site AIAD
 */
export const NAVIGATION_SECTIONS = ['framework', 'mode-operatoire', 'annexes'] as const

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
```

### 4.2 Types dérivés des constantes

```typescript
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
```

### 4.3 Interfaces principales

```typescript
// src/types/navigation.ts

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
```

### 4.4 Types utilitaires

```typescript
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
```

### 4.5 Export barrel

```typescript
// src/types/index.ts (ajout aux exports existants)

export type {
  NavigationItem,
  NavigationItemInput,
  NavigationItemUpdate,
  NavigationTree,
  NavigationSection,
  NavigationBadge,
  BreadcrumbItem,
  BreadcrumbList,
  TableOfContentsItem,
  TableOfContentsList,
  TOCHeadingDepth,
  PrevNextItem,
  PrevNextLinks,
  FlatNavigationItem,
  FlatNavigationList,
} from './navigation'

export {
  NAVIGATION_SECTIONS,
  NAVIGATION_BADGES,
  MAX_NAVIGATION_DEPTH,
  TOC_HEADING_DEPTHS,
} from './navigation'
```

---

## 5. Cas limites et gestion d'erreurs

### 5.1 Cas limites identifiés

| ID | Cas limite | Comportement attendu | Test |
|----|------------|---------------------|------|
| CL-01 | `NavigationItem` sans `children` | ✅ Accepté : item feuille (page terminale) | T-01 |
| CL-02 | `NavigationItem` avec `children: []` (tableau vide) | ✅ Accepté : équivalent à pas de children | T-02 |
| CL-03 | `NavigationItem` avec 5 niveaux de profondeur | ❌ Rejeté par la validation Zod (T-004-B2), type autorise mais convention interdit | T-03 |
| CL-04 | `NavigationItem.id` avec majuscules | ❌ Rejeté (pattern slug-friendly) | T-04 |
| CL-05 | `NavigationItem.id` avec espaces | ❌ Rejeté (pattern slug-friendly) | T-05 |
| CL-06 | `NavigationItem.href` sans slash initial | ❌ Rejeté (doit commencer par `/`) | T-06 |
| CL-07 | `NavigationItem.href` avec URL externe | ❌ Rejeté (navigation interne uniquement) | T-07 |
| CL-08 | `NavigationItem.order` négatif | ❌ Rejeté (doit être ≥ 0) | T-08 |
| CL-09 | `NavigationItem.order` flottant (1.5) | ❌ Rejeté (doit être entier) | T-09 |
| CL-10 | Deux siblings avec le même `order` | ⚠️ Accepté par le type, rejeté par la validation Zod (T-004-B2) | T-10 |
| CL-11 | `NavigationItem.label` vide (`""`) | ❌ Rejeté (minLength 1) | T-11 |
| CL-12 | `NavigationItem.label` avec caractères spéciaux (accents, `&`) | ✅ Accepté (UTF-8, HTML encodé au render) | T-12 |
| CL-13 | `BreadcrumbItem` sans `isCurrent` | ✅ Accepté : défaut `false` | T-13 |
| CL-14 | Breadcrumb avec un seul élément (page d'accueil) | ✅ Accepté : `[{ label: 'Accueil', href: '/', isCurrent: true }]` | T-14 |
| CL-15 | `TableOfContentsItem.depth` = 1 (h1) | ❌ Rejeté (seuls h2-h4, type `TOCHeadingDepth`) | T-15 |
| CL-16 | `TableOfContentsItem.depth` = 5 (h5) | ❌ Rejeté (seuls h2-h4) | T-16 |
| CL-17 | TOC vide (page sans headings h2-h4) | ✅ Accepté : `[]` (la TOC est masquée) | T-17 |
| CL-18 | TOC avec h2 puis h4 directement (sans h3) | ✅ Accepté : le type n'impose pas la hiérarchie stricte | T-18 |
| CL-19 | `PrevNextLinks` avec `prev` et `next` tous les deux `null` | ✅ Accepté : page isolée (pas de séquence) | T-19 |
| CL-20 | `PrevNextItem.section` différent du `section` courant | ✅ Accepté : navigation cross-section (Framework → Mode Opératoire) | T-20 |
| CL-21 | `FlatNavigationItem.depth` = 0 | ✅ Accepté : élément racine d'une section | T-21 |
| CL-22 | `NavigationItem.isHidden` = `true` avec des `children` | ✅ Accepté : le parent est masqué, les children aussi | T-22 |
| CL-23 | `NavigationTree` avec une section vide (`framework: []`) | ✅ Accepté par le type, warning à la validation | T-23 |
| CL-24 | `NavigationItem.id` dupliqué dans l'arbre | ⚠️ Accepté par le type, rejeté par la validation Zod (T-004-B2) | T-24 |
| CL-25 | `TableOfContentsItem.slug` avec caractères unicode normalisés | ✅ Accepté : `principes-fondateurs` (slug auto-généré) | T-25 |

### 5.2 Contraintes de type vs contraintes de validation

Le fichier `navigation.ts` définit les **formes** (interfaces). Les **contraintes runtime** (longueurs, patterns, unicité) sont implémentées dans les schémas Zod (T-004-B2).

| Contrainte | TypeScript (ce fichier) | Zod (T-004-B2) |
|-----------|------------------------|-----------------|
| `id` pattern slug | JSDoc `@pattern` (documentation) | `.regex(/^[a-z0-9-]+$/)` |
| `href` commence par `/` | JSDoc `@pattern` (documentation) | `.startsWith('/')` |
| `depth` = 2\|3\|4 | Type `TOCHeadingDepth` ✅ | `.refine()` ✅ |
| `order` ≥ 0 | JSDoc `@minimum` (documentation) | `.int().nonnegative()` |
| `label` non vide | JSDoc `@minLength` (documentation) | `.min(1)` |
| Unicité des `id` | Non (structure, pas contrainte) | `.refine()` custom |
| Profondeur max | Constante `MAX_NAVIGATION_DEPTH` | `.refine()` récursif |

---

## 6. Exemples entrée/sortie

### 6.1 NavigationItem - Chapitre Framework simple

```typescript
// Entrée : chapitre sans sous-pages
const chapter: NavigationItem = {
  id: 'fw-preambule',
  label: 'Préambule',
  href: '/framework/preambule',
  section: 'framework',
  order: 1,
  badge: 'essential',
}

// Résultat : item feuille, rendu comme lien simple dans le menu
```

### 6.2 NavigationItem - Catégorie Annexe avec fiches enfants

```typescript
// Entrée : catégorie avec 6 fiches
const annexeCategory: NavigationItem = {
  id: 'annexes-a-templates',
  label: 'A - Templates',
  href: '/annexes/templates',
  section: 'annexes',
  order: 1,
  children: [
    { id: 'annexe-a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', order: 1 },
    { id: 'annexe-a2-architecture', label: 'A2 - Architecture', href: '/annexes/templates/architecture', order: 2 },
    { id: 'annexe-a3-agent-guide', label: 'A3 - Agent Guide', href: '/annexes/templates/agent-guide', order: 3 },
    { id: 'annexe-a4-specs', label: 'A4 - Specs', href: '/annexes/templates/specs', order: 4 },
    { id: 'annexe-a5-dood', label: 'A5 - DoOD', href: '/annexes/templates/dood', order: 5 },
    { id: 'annexe-a6-dooud', label: 'A6 - DoOuD', href: '/annexes/templates/dooud', order: 6 },
  ],
}

// Résultat : rendu comme dropdown avec 6 sous-items dans le menu
```

### 6.3 NavigationTree - Structure complète (extrait)

```typescript
const navigationTree: NavigationTree = {
  framework: [
    { id: 'fw-preambule', label: 'Préambule', href: '/framework/preambule', order: 1, badge: 'essential' },
    { id: 'fw-vision', label: 'Vision & Philosophie', href: '/framework/vision-philosophie', order: 2 },
    { id: 'fw-ecosysteme', label: 'Écosystème', href: '/framework/ecosysteme', order: 3 },
    { id: 'fw-artefacts', label: 'Artefacts', href: '/framework/artefacts', order: 4 },
    { id: 'fw-boucles', label: 'Boucles Itératives', href: '/framework/boucles-iteratives', order: 5 },
    { id: 'fw-synchronisations', label: 'Synchronisations', href: '/framework/synchronisations', order: 6 },
    { id: 'fw-metriques', label: 'Métriques', href: '/framework/metriques', order: 7 },
    { id: 'fw-annexes', label: 'Annexes', href: '/framework/annexes', order: 8 },
  ],
  modeOperatoire: [
    { id: 'mo-preambule', label: 'Préambule', href: '/mode-operatoire/preambule', order: 0 },
    { id: 'mo-initialisation', label: 'Initialisation', href: '/mode-operatoire/initialisation', order: 1 },
    { id: 'mo-planification', label: 'Planification', href: '/mode-operatoire/planification', order: 2 },
    { id: 'mo-developpement', label: 'Développement', href: '/mode-operatoire/developpement', order: 3 },
    { id: 'mo-validation', label: 'Validation', href: '/mode-operatoire/validation', order: 4 },
    { id: 'mo-deploiement', label: 'Déploiement', href: '/mode-operatoire/deploiement', order: 5 },
    { id: 'mo-rituels', label: 'Rituels & Amélioration', href: '/mode-operatoire/rituels-amelioration', order: 6 },
    { id: 'mo-annexes', label: 'Annexes', href: '/mode-operatoire/annexes', order: 7 },
  ],
  annexes: [
    {
      id: 'annexes-a', label: 'A - Templates', href: '/annexes/templates', order: 1,
      children: [
        { id: 'a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', order: 1 },
        // ... 5 autres
      ],
    },
    // ... 8 autres catégories
  ],
}
```

### 6.4 BreadcrumbList - Page profonde

```typescript
// URL : /annexes/templates/prd
const breadcrumbs: BreadcrumbList = [
  { label: 'Accueil', href: '/' },
  { label: 'Annexes', href: '/annexes' },
  { label: 'A - Templates', href: '/annexes/templates' },
  { label: 'A1 - PRD', href: '/annexes/templates/prd', isCurrent: true },
]
```

### 6.5 TableOfContentsList - Page avec headings mixtes

```typescript
const toc: TableOfContentsList = [
  { depth: 2, text: 'Contexte du projet', slug: 'contexte-du-projet' },
  { depth: 3, text: 'Contraintes techniques', slug: 'contraintes-techniques' },
  { depth: 3, text: 'Contraintes organisationnelles', slug: 'contraintes-organisationnelles' },
  { depth: 2, text: 'Objectifs', slug: 'objectifs' },
  { depth: 4, text: 'Objectifs secondaires', slug: 'objectifs-secondaires' },
]
```

### 6.6 PrevNextLinks - Navigation cross-section

```typescript
// Dernière page du Framework → Première page du Mode Opératoire
const crossSection: PrevNextLinks = {
  prev: {
    label: 'Annexes',
    href: '/framework/annexes',
    section: 'framework',
  },
  next: {
    label: 'Préambule',
    href: '/mode-operatoire/preambule',
    section: 'mode-operatoire',
  },
}
```

### 6.7 FlatNavigationList - Extrait aplati

```typescript
const flatNav: FlatNavigationList = [
  // Framework
  { id: 'fw-preambule', label: 'Préambule', href: '/framework/preambule', section: 'framework', depth: 0 },
  { id: 'fw-vision', label: 'Vision & Philosophie', href: '/framework/vision-philosophie', section: 'framework', depth: 0 },
  // ... autres chapitres Framework
  // Mode Opératoire
  { id: 'mo-preambule', label: 'Préambule', href: '/mode-operatoire/preambule', section: 'mode-operatoire', depth: 0 },
  // ... autres chapitres Mode Opératoire
  // Annexes (catégories + fiches)
  { id: 'annexes-a', label: 'A - Templates', href: '/annexes/templates', section: 'annexes', depth: 0 },
  { id: 'a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', section: 'annexes', depth: 1 },
  { id: 'a2-architecture', label: 'A2 - Architecture', href: '/annexes/templates/architecture', section: 'annexes', depth: 1 },
  // ... autres fiches
]
```

---

## 7. Tests

### 7.1 Fichier de test

**Emplacement :** `tests/unit/types/navigation.test.ts`

### 7.2 Suite de tests

```typescript
// tests/unit/types/navigation.test.ts

import { describe, it, expect, expectTypeOf } from 'vitest'
import {
  NAVIGATION_SECTIONS,
  NAVIGATION_BADGES,
  MAX_NAVIGATION_DEPTH,
  TOC_HEADING_DEPTHS,
} from '@/types/navigation'
import type {
  NavigationItem,
  NavigationItemInput,
  NavigationItemUpdate,
  NavigationTree,
  NavigationSection,
  NavigationBadge,
  BreadcrumbItem,
  BreadcrumbList,
  TableOfContentsItem,
  TableOfContentsList,
  TOCHeadingDepth,
  PrevNextItem,
  PrevNextLinks,
  FlatNavigationItem,
  FlatNavigationList,
} from '@/types/navigation'

// ──────────────────────────────────────────────────
// Fixtures
// ──────────────────────────────────────────────────

const validNavigationItem: NavigationItem = {
  id: 'fw-preambule',
  label: 'Préambule',
  href: '/framework/preambule',
  section: 'framework',
  order: 1,
}

const validNavigationItemWithChildren: NavigationItem = {
  id: 'annexes-a-templates',
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

const validBreadcrumb: BreadcrumbItem = {
  label: 'Framework',
  href: '/framework',
}

const validTocItem: TableOfContentsItem = {
  depth: 2,
  text: 'Contexte du projet',
  slug: 'contexte-du-projet',
}

const validPrevNextItem: PrevNextItem = {
  label: 'Vision & Philosophie',
  href: '/framework/vision-philosophie',
  section: 'framework',
}

// ──────────────────────────────────────────────────
// Tests des constantes
// ──────────────────────────────────────────────────

describe('Constantes de navigation', () => {
  describe('NAVIGATION_SECTIONS', () => {
    it('contient exactement 3 sections', () => {
      expect(NAVIGATION_SECTIONS).toHaveLength(3)
    })

    it('contient framework, mode-operatoire et annexes', () => {
      expect(NAVIGATION_SECTIONS).toContain('framework')
      expect(NAVIGATION_SECTIONS).toContain('mode-operatoire')
      expect(NAVIGATION_SECTIONS).toContain('annexes')
    })

    it('est un tuple readonly (as const)', () => {
      // Vérifie que le tableau ne peut pas être modifié
      expect(Object.isFrozen(NAVIGATION_SECTIONS)).toBe(true)
    })
  })

  describe('NAVIGATION_BADGES', () => {
    it('contient exactement 2 badges', () => {
      expect(NAVIGATION_BADGES).toHaveLength(2)
    })

    it('contient new et essential', () => {
      expect(NAVIGATION_BADGES).toContain('new')
      expect(NAVIGATION_BADGES).toContain('essential')
    })
  })

  describe('MAX_NAVIGATION_DEPTH', () => {
    it('vaut 4', () => {
      expect(MAX_NAVIGATION_DEPTH).toBe(4)
    })
  })

  describe('TOC_HEADING_DEPTHS', () => {
    it('contient exactement 3 niveaux', () => {
      expect(TOC_HEADING_DEPTHS).toHaveLength(3)
    })

    it('contient les niveaux 2, 3 et 4', () => {
      expect(TOC_HEADING_DEPTHS).toContain(2)
      expect(TOC_HEADING_DEPTHS).toContain(3)
      expect(TOC_HEADING_DEPTHS).toContain(4)
    })

    it('ne contient pas le niveau 1 (h1)', () => {
      expect(TOC_HEADING_DEPTHS).not.toContain(1)
    })
  })
})

// ──────────────────────────────────────────────────
// Tests de typage (compile-time)
// ──────────────────────────────────────────────────

describe('Types de navigation (compile-time)', () => {
  describe('NavigationSection', () => {
    it('accepte les valeurs valides', () => {
      expectTypeOf<'framework'>().toMatchTypeOf<NavigationSection>()
      expectTypeOf<'mode-operatoire'>().toMatchTypeOf<NavigationSection>()
      expectTypeOf<'annexes'>().toMatchTypeOf<NavigationSection>()
    })
  })

  describe('NavigationBadge', () => {
    it('accepte les valeurs valides', () => {
      expectTypeOf<'new'>().toMatchTypeOf<NavigationBadge>()
      expectTypeOf<'essential'>().toMatchTypeOf<NavigationBadge>()
    })
  })

  describe('TOCHeadingDepth', () => {
    it('accepte 2, 3 et 4', () => {
      expectTypeOf<2>().toMatchTypeOf<TOCHeadingDepth>()
      expectTypeOf<3>().toMatchTypeOf<TOCHeadingDepth>()
      expectTypeOf<4>().toMatchTypeOf<TOCHeadingDepth>()
    })
  })

  describe('NavigationItem', () => {
    it('a les champs obligatoires id, label, href et order', () => {
      expectTypeOf<NavigationItem>().toHaveProperty('id')
      expectTypeOf<NavigationItem>().toHaveProperty('label')
      expectTypeOf<NavigationItem>().toHaveProperty('href')
      expectTypeOf<NavigationItem>().toHaveProperty('order')
    })

    it('a les champs optionnels section, children, badge et isHidden', () => {
      expectTypeOf(validNavigationItem.section).toEqualTypeOf<NavigationSection | undefined>()
      expectTypeOf(validNavigationItem.children).toEqualTypeOf<NavigationItem[] | undefined>()
      expectTypeOf(validNavigationItem.badge).toEqualTypeOf<NavigationBadge | undefined>()
      expectTypeOf(validNavigationItem.isHidden).toEqualTypeOf<boolean | undefined>()
    })

    it('est récursif via children', () => {
      const nested: NavigationItem = {
        ...validNavigationItem,
        children: [
          {
            ...validNavigationItem,
            id: 'child',
            children: [{ ...validNavigationItem, id: 'grandchild' }],
          },
        ],
      }
      expect(nested.children?.[0]?.children?.[0]?.id).toBe('grandchild')
    })
  })

  describe('NavigationTree', () => {
    it('a les 3 sections obligatoires', () => {
      expectTypeOf<NavigationTree>().toHaveProperty('framework')
      expectTypeOf<NavigationTree>().toHaveProperty('modeOperatoire')
      expectTypeOf<NavigationTree>().toHaveProperty('annexes')
    })

    it('chaque section contient un tableau de NavigationItem', () => {
      const tree: NavigationTree = {
        framework: [validNavigationItem],
        modeOperatoire: [{ ...validNavigationItem, id: 'mo-1' }],
        annexes: [validNavigationItemWithChildren],
      }
      expectTypeOf(tree.framework).toEqualTypeOf<NavigationItem[]>()
      expectTypeOf(tree.modeOperatoire).toEqualTypeOf<NavigationItem[]>()
      expectTypeOf(tree.annexes).toEqualTypeOf<NavigationItem[]>()
    })
  })

  describe('BreadcrumbItem', () => {
    it('a les champs obligatoires label et href', () => {
      expectTypeOf<BreadcrumbItem>().toHaveProperty('label')
      expectTypeOf<BreadcrumbItem>().toHaveProperty('href')
    })

    it('a le champ optionnel isCurrent', () => {
      expectTypeOf(validBreadcrumb.isCurrent).toEqualTypeOf<boolean | undefined>()
    })
  })

  describe('TableOfContentsItem', () => {
    it('a les champs obligatoires depth, text et slug', () => {
      expectTypeOf<TableOfContentsItem>().toHaveProperty('depth')
      expectTypeOf<TableOfContentsItem>().toHaveProperty('text')
      expectTypeOf<TableOfContentsItem>().toHaveProperty('slug')
    })

    it('depth est de type TOCHeadingDepth', () => {
      expectTypeOf(validTocItem.depth).toEqualTypeOf<TOCHeadingDepth>()
    })
  })

  describe('PrevNextItem', () => {
    it('a les champs obligatoires label et href', () => {
      expectTypeOf<PrevNextItem>().toHaveProperty('label')
      expectTypeOf<PrevNextItem>().toHaveProperty('href')
    })

    it('a le champ optionnel section', () => {
      expectTypeOf(validPrevNextItem.section).toEqualTypeOf<NavigationSection | undefined>()
    })
  })

  describe('PrevNextLinks', () => {
    it('a les champs prev et next qui peuvent être null', () => {
      const links: PrevNextLinks = { prev: null, next: null }
      expectTypeOf(links.prev).toEqualTypeOf<PrevNextItem | null>()
      expectTypeOf(links.next).toEqualTypeOf<PrevNextItem | null>()
    })
  })

  describe('FlatNavigationItem', () => {
    it('a les champs obligatoires id, label, href et depth', () => {
      expectTypeOf<FlatNavigationItem>().toHaveProperty('id')
      expectTypeOf<FlatNavigationItem>().toHaveProperty('label')
      expectTypeOf<FlatNavigationItem>().toHaveProperty('href')
      expectTypeOf<FlatNavigationItem>().toHaveProperty('depth')
    })

    it('a le champ optionnel section', () => {
      const flat: FlatNavigationItem = {
        id: 'test',
        label: 'Test',
        href: '/test',
        depth: 0,
      }
      expectTypeOf(flat.section).toEqualTypeOf<NavigationSection | undefined>()
    })
  })
})

// ──────────────────────────────────────────────────
// Tests des types utilitaires
// ──────────────────────────────────────────────────

describe('Types utilitaires', () => {
  describe('NavigationItemInput', () => {
    it('requiert id, label, href et order', () => {
      const input: NavigationItemInput = {
        id: 'test',
        label: 'Test',
        href: '/test',
        order: 1,
      }
      expect(input).toBeDefined()
    })

    it('accepte section, children, badge et isHidden en optionnel', () => {
      const input: NavigationItemInput = {
        id: 'test',
        label: 'Test',
        href: '/test',
        order: 1,
        section: 'framework',
        badge: 'new',
        isHidden: false,
        children: [
          { id: 'child', label: 'Child', href: '/child', order: 1 },
        ],
      }
      expect(input.section).toBe('framework')
    })
  })

  describe('NavigationItemUpdate', () => {
    it('rend tous les champs sauf id optionnels', () => {
      const update: NavigationItemUpdate = { label: 'Nouveau label' }
      expect(update.label).toBe('Nouveau label')
    })

    it('ne contient pas le champ id', () => {
      const update: NavigationItemUpdate = {}
      expectTypeOf(update).not.toHaveProperty('id')
    })
  })

  describe('BreadcrumbList', () => {
    it('est un alias pour BreadcrumbItem[]', () => {
      const list: BreadcrumbList = [
        { label: 'Accueil', href: '/' },
        { label: 'Framework', href: '/framework', isCurrent: true },
      ]
      expectTypeOf(list).toEqualTypeOf<BreadcrumbItem[]>()
    })
  })

  describe('TableOfContentsList', () => {
    it('est un alias pour TableOfContentsItem[]', () => {
      const list: TableOfContentsList = [validTocItem]
      expectTypeOf(list).toEqualTypeOf<TableOfContentsItem[]>()
    })
  })

  describe('FlatNavigationList', () => {
    it('est un alias pour FlatNavigationItem[]', () => {
      const list: FlatNavigationList = [
        { id: 'test', label: 'Test', href: '/test', depth: 0 },
      ]
      expectTypeOf(list).toEqualTypeOf<FlatNavigationItem[]>()
    })
  })
})

// ──────────────────────────────────────────────────
// Tests des cas limites (structure)
// ──────────────────────────────────────────────────

describe('Cas limites (structure)', () => {
  it('T-01: NavigationItem sans children est valide', () => {
    const leaf: NavigationItem = {
      id: 'leaf',
      label: 'Page',
      href: '/page',
      order: 1,
    }
    expect(leaf.children).toBeUndefined()
  })

  it('T-02: NavigationItem avec children vide est valide', () => {
    const emptyChildren: NavigationItem = {
      id: 'empty',
      label: 'Section',
      href: '/section',
      order: 1,
      children: [],
    }
    expect(emptyChildren.children).toEqual([])
  })

  it('T-12: label avec caractères spéciaux (accents, &)', () => {
    const special: NavigationItem = {
      id: 'special',
      label: 'Écosystème & Architecture — Vue d\'ensemble',
      href: '/ecosysteme',
      order: 1,
    }
    expect(special.label).toContain('É')
    expect(special.label).toContain('&')
    expect(special.label).toContain('—')
  })

  it('T-13: BreadcrumbItem sans isCurrent', () => {
    const crumb: BreadcrumbItem = {
      label: 'Framework',
      href: '/framework',
    }
    expect(crumb.isCurrent).toBeUndefined()
  })

  it('T-14: Breadcrumb avec un seul élément', () => {
    const homeBreadcrumb: BreadcrumbList = [
      { label: 'Accueil', href: '/', isCurrent: true },
    ]
    expect(homeBreadcrumb).toHaveLength(1)
    expect(homeBreadcrumb[0].isCurrent).toBe(true)
  })

  it('T-17: TOC vide (page sans headings)', () => {
    const emptyToc: TableOfContentsList = []
    expect(emptyToc).toHaveLength(0)
  })

  it('T-18: TOC avec h2 puis h4 directement (sans h3)', () => {
    const gappedToc: TableOfContentsList = [
      { depth: 2, text: 'Section', slug: 'section' },
      { depth: 4, text: 'Détail', slug: 'detail' },
    ]
    expect(gappedToc[0].depth).toBe(2)
    expect(gappedToc[1].depth).toBe(4)
  })

  it('T-19: PrevNextLinks avec les deux liens null', () => {
    const isolated: PrevNextLinks = { prev: null, next: null }
    expect(isolated.prev).toBeNull()
    expect(isolated.next).toBeNull()
  })

  it('T-20: Navigation cross-section', () => {
    const crossSection: PrevNextLinks = {
      prev: { label: 'Annexes', href: '/framework/annexes', section: 'framework' },
      next: { label: 'Préambule', href: '/mode-operatoire/preambule', section: 'mode-operatoire' },
    }
    expect(crossSection.prev?.section).toBe('framework')
    expect(crossSection.next?.section).toBe('mode-operatoire')
    expect(crossSection.prev?.section).not.toBe(crossSection.next?.section)
  })

  it('T-21: FlatNavigationItem depth = 0 (racine section)', () => {
    const rootItem: FlatNavigationItem = {
      id: 'fw-preambule',
      label: 'Préambule',
      href: '/framework/preambule',
      section: 'framework',
      depth: 0,
    }
    expect(rootItem.depth).toBe(0)
  })

  it('T-22: NavigationItem masqué avec children', () => {
    const hiddenParent: NavigationItem = {
      id: 'hidden-parent',
      label: 'Section masquée',
      href: '/hidden',
      order: 99,
      isHidden: true,
      children: [
        { id: 'hidden-child', label: 'Enfant', href: '/hidden/child', order: 1 },
      ],
    }
    expect(hiddenParent.isHidden).toBe(true)
    expect(hiddenParent.children).toHaveLength(1)
  })

  it('T-23: NavigationTree avec section vide', () => {
    const partialTree: NavigationTree = {
      framework: [],
      modeOperatoire: [{ id: 'mo-1', label: 'Test', href: '/mo/test', order: 1 }],
      annexes: [],
    }
    expect(partialTree.framework).toHaveLength(0)
    expect(partialTree.modeOperatoire).toHaveLength(1)
  })

  it('NavigationItem 3 niveaux de profondeur (structure valide)', () => {
    const deepItem: NavigationItem = {
      id: 'level-0',
      label: 'Niveau 0',
      href: '/level-0',
      order: 1,
      children: [
        {
          id: 'level-1',
          label: 'Niveau 1',
          href: '/level-0/level-1',
          order: 1,
          children: [
            {
              id: 'level-2',
              label: 'Niveau 2',
              href: '/level-0/level-1/level-2',
              order: 1,
            },
          ],
        },
      ],
    }
    expect(deepItem.children?.[0]?.children?.[0]?.id).toBe('level-2')
  })
})
```

### 7.3 Matrice de couverture

| Type | Cas valide | Cas optionnel | Cas limite | Type-check | Couverture |
|------|------------|---------------|------------|------------|------------|
| `NAVIGATION_SECTIONS` | ✅ | - | - | ✅ | 100% |
| `NAVIGATION_BADGES` | ✅ | - | - | ✅ | 100% |
| `MAX_NAVIGATION_DEPTH` | ✅ | - | - | - | 100% |
| `TOC_HEADING_DEPTHS` | ✅ | - | ✅ (exclut h1) | ✅ | 100% |
| `NavigationItem` | ✅ | ✅ (4 champs) | ✅ (6 tests) | ✅ | 100% |
| `NavigationTree` | ✅ | - | ✅ (section vide) | ✅ | 100% |
| `BreadcrumbItem` | ✅ | ✅ (isCurrent) | ✅ (un seul élément) | ✅ | 100% |
| `TableOfContentsItem` | ✅ | - | ✅ (vide, gap h2→h4) | ✅ | 100% |
| `PrevNextItem` | ✅ | ✅ (section) | ✅ (cross-section) | ✅ | 100% |
| `PrevNextLinks` | ✅ | - | ✅ (null/null) | ✅ | 100% |
| `FlatNavigationItem` | ✅ | ✅ (section) | ✅ (depth 0) | ✅ | 100% |
| `NavigationItemInput` | ✅ | ✅ | - | ✅ | 100% |
| `NavigationItemUpdate` | ✅ | - | ✅ (pas d'id) | ✅ | 100% |
| Aliases (`BreadcrumbList`, etc.) | ✅ | - | - | ✅ | 100% |

### 7.4 Commandes de test

```bash
# Exécuter les tests de ce fichier uniquement
pnpm test:unit -- navigation

# Avec couverture
pnpm test:unit -- navigation --coverage

# Vérification TypeScript (compilation des types)
pnpm typecheck
```

---

## 8. Critères d'acceptation

- [ ] **CA-01** : Le fichier `src/types/navigation.ts` est créé avec tous les types listés en section 4
- [ ] **CA-02** : Les 4 constantes (`NAVIGATION_SECTIONS`, `NAVIGATION_BADGES`, `MAX_NAVIGATION_DEPTH`, `TOC_HEADING_DEPTHS`) sont exportées avec `as const`
- [ ] **CA-03** : Les 3 types dérivés des constantes (`NavigationSection`, `NavigationBadge`, `TOCHeadingDepth`) sont exportés
- [ ] **CA-04** : Les 7 interfaces principales (`NavigationItem`, `NavigationTree`, `BreadcrumbItem`, `TableOfContentsItem`, `PrevNextItem`, `PrevNextLinks`, `FlatNavigationItem`) sont exportées
- [ ] **CA-05** : Les 5 types utilitaires (`NavigationItemInput`, `NavigationItemUpdate`, `BreadcrumbList`, `TableOfContentsList`, `FlatNavigationList`) sont exportés
- [ ] **CA-06** : Le fichier `src/types/index.ts` est mis à jour avec les re-exports navigation
- [ ] **CA-07** : La documentation JSDoc est présente sur chaque interface, constante et champ
- [ ] **CA-08** : Chaque interface principale a un `@example` dans sa JSDoc
- [ ] **CA-09** : Tous les tests passent (`pnpm test:unit -- navigation`)
- [ ] **CA-10** : TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] **CA-11** : ESLint passe sans warning (`pnpm lint`)
- [ ] **CA-12** : Les types sont compatibles avec les interfaces existantes d'`ARCHITECTURE.md` (section API et interfaces)

---

## 9. Definition of Done

- [ ] Code implémenté selon les spécifications (sections 4.1 à 4.5)
- [ ] Tests unitaires écrits et passants (section 7.2)
- [ ] Couverture de tests ≥ 90% sur `src/types/navigation.ts`
- [ ] TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] ESLint passe sans warning (`pnpm lint`)
- [ ] Code reviewé par un pair
- [ ] Documentation JSDoc complète

---

## 10. Références

| Document | Lien |
|----------|------|
| User Story US-004 | [spec-US-004.md](./spec-US-004.md) |
| Architecture | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| Types existants (modèle) | [src/types/hero.ts](../../../src/types/hero.ts) |
| Types existants (modèle) | [src/types/benefit.ts](../../../src/types/benefit.ts) |
| Navigation ARCHITECTURE.md | [ARCHITECTURE.md § API et interfaces](../../ARCHITECTURE.md#api-et-interfaces) |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 09/02/2026 | Création initiale : 7 interfaces, 5 types utilitaires, 4 constantes, 25 cas limites, suite de tests complète |
