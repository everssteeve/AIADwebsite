# T-004-T2 : Tests unitaires helpers de navigation (getBreadcrumbs, getPrevNext, flattenNav, getCurrentSection)

| Metadonnee | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 16 fevrier 2026 |
| **Statut** | 🟢 Terminée |
| **User Story** | [US-004 - Naviguer facilement dans le framework](./spec-US-004.md) |
| **Dependances** | T-004-B4 (Helpers navigation) |
| **Bloque** | Aucune (tache terminale) |

---

## 1. Objectif

Implementer la suite de tests unitaires exhaustive pour les helpers de navigation definis dans `src/lib/navigation.ts` (T-004-B4), en garantissant :

- **Couverture a 100%** : Chaque fonction publique, chaque constante exportee, chaque branche logique est testee
- **Validation nominale** : Les comportements attendus sur des arbres valides sont verifies avec des assertions precises
- **Cas limites** : Les 32 cas limites documentes dans T-004-B4 sont couverts
- **Regles metier** : Les 12 regles metier (R-B4-01 a R-B4-12) sont validees
- **Integration** : Les helpers fonctionnent correctement ensemble sur l'arbre `NAVIGATION_TREE` complet (71 items)
- **Immutabilite** : Aucune fonction ne mute l'arbre passe en argument
- **Regression** : La suite protege contre les modifications accidentelles des helpers

---

## 2. Contexte technique

### 2.1 Stack de test

| Technologie | Version | Role |
|-------------|---------|------|
| Vitest | 1.x | Framework de test unitaire |
| TypeScript | 5.x | Typage strict des fixtures et assertions |

### 2.2 Arborescence

```
tests/
└── unit/
    └── lib/
        └── navigation.test.ts     <-- CE FICHIER DE TEST
src/
├── lib/
│   └── navigation.ts              # Code teste (T-004-B4)
├── data/
│   └── navigation.ts              # Donnees de navigation (T-004-B3, 71 items)
└── types/
    └── navigation.ts              # Types source (T-004-B1)
```

### 2.3 Fichier teste

`src/lib/navigation.ts` exporte :

| Export | Type | Description |
|--------|------|-------------|
| `SECTION_LABELS` | `Readonly<Record<NavigationSection, string>>` | Mapping section → label francais (3 entrees) |
| `SECTION_ROOT_HREFS` | `Readonly<Record<NavigationSection, string>>` | Mapping section → href racine (3 entrees) |
| `flattenNav(tree?)` | `(NavigationTree?) → FlatNavigationList` | Aplatit l'arbre en liste sequentielle |
| `getBreadcrumbs(tree, path)` | `(NavigationTree, string) → BreadcrumbList \| null` | Genere le fil d'Ariane |
| `getPrevNext(tree, path)` | `(NavigationTree, string) → PrevNextLinks` | Retourne les liens Precedent/Suivant |
| `getCurrentSection(path)` | `(string) → NavigationSection \| null` | Determine la section d'un chemin |
| `getNavigation(tree?, section?)` | `(NavigationTree?, NavigationSection?) → NavigationTree` | Retourne l'arbre filtre ou complet |

Fonctions internes (testees indirectement) :

| Fonction interne | Description |
|------------------|-------------|
| `normalizePath(path)` | Retire le trailing slash (testee via les fonctions publiques) |
| `findAncestorChain(tree, path)` | Recherche un item et ses ancetres (testee via `getBreadcrumbs`) |
| `findInItems(items, path, ancestors)` | Recherche recursive par href (testee via `getBreadcrumbs`) |

### 2.4 Conventions de test

Conformement aux tests existants du projet (`tests/unit/schemas/navigation.test.ts`) :

| Convention | Detail |
|-----------|--------|
| Nommage fichier | `navigation.test.ts` dans `tests/unit/lib/` |
| Structure | `describe` par fonction/constante, `it` par cas de test |
| Fixtures | Variables `const` en haut du fichier, reutilisables |
| Assertions | Verification directe des valeurs retournees (pas de `safeParse`) |
| References cas limites | Prefixe `T-XX:` ou `CL-XX:` dans le nom du test |
| Langue des descriptions | Francais |
| Immutabilite | Au moins un test par fonction verifiant la non-mutation |

---

## 3. Specifications fonctionnelles

### 3.1 Regles metier testees

Les tests couvrent les 12 regles metier definies dans T-004-B4 :

| ID | Regle | Fonction | Type de test |
|----|-------|----------|-------------|
| R-B4-01 | `flattenNav()` exclut les items `isHidden: true` et leurs enfants | `flattenNav` | Arbre avec items caches → exclus |
| R-B4-02 | `flattenNav()` propage la `section` du parent vers les enfants sans section | `flattenNav` | Enfant sans section → herite du parent |
| R-B4-03 | `flattenNav()` trie les siblings par `order` croissant | `flattenNav` | Arbre desordonne → resultat trie |
| R-B4-04 | `flattenNav()` produit exactement 71 items sur NAVIGATION_TREE | `flattenNav` | Comptage sur arbre complet |
| R-B4-05 | `getBreadcrumbs()` commence toujours par Accueil (R5) | `getBreadcrumbs` | Premier element = Accueil |
| R-B4-06 | `getBreadcrumbs()` termine par `isCurrent: true` (R13) | `getBreadcrumbs` | Dernier element a isCurrent |
| R-B4-07 | `getBreadcrumbs()` retourne `null` si chemin introuvable | `getBreadcrumbs` | Chemin inexistant → null |
| R-B4-08 | `getPrevNext()` utilise l'ordre de `flattenNav()` | `getPrevNext` | Coherence avec la sequence aplatie |
| R-B4-09 | `getPrevNext()` retourne `{ prev: null, next: null }` si introuvable | `getPrevNext` | Chemin inexistant → neutre |
| R-B4-10 | `getCurrentSection()` retourne `null` pour les chemins hors section | `getCurrentSection` | Chemins `/`, `/glossaire`, etc. |
| R-B4-11 | Toutes les fonctions normalisent le chemin (trailing slash) | Toutes | Trailing slash → meme resultat |
| R-B4-12 | Aucune fonction ne mute l'arbre passe en argument | Toutes | Deep copy avant/apres → egal |

### 3.2 Inventaire des cas de test

#### 3.2.1 `SECTION_LABELS` (2 tests)

| # | Test | Assertion |
|---|------|-----------|
| 1 | Contient les 3 sections avec leurs labels francais | `'Framework'`, `'Mode Operatoire'`, `'Annexes'` |
| 2 | Contient exactement 3 entrees | `Object.keys().length === 3` |

#### 3.2.2 `SECTION_ROOT_HREFS` (3 tests)

| # | Test | Assertion |
|---|------|-----------|
| 1 | Contient les 3 sections avec leurs hrefs racine | `'/framework'`, `'/mode-operatoire'`, `'/annexes'` |
| 2 | Tous les hrefs commencent par `/` | Pattern `/^\\//` |
| 3 | Contient exactement 3 entrees | `Object.keys().length === 3` |

#### 3.2.3 `flattenNav` — Arbre complet NAVIGATION_TREE (4 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| 1 | Produit exactement 71 items | CL-27 | `flat.length === 71` |
| 2 | Le premier item est `fw-preambule` | CL-29 | `flat[0].id === 'fw-preambule'`, depth 0, section `'framework'` |
| 3 | Le dernier item est `annexe-i4-communaute` | CL-28 | `flat[70].id === 'annexe-i4-communaute'`, depth 1, section `'annexes'` |
| 4 | Tous les items ont un `section` defini | — | Chaque item.section est dans `['framework', 'mode-operatoire', 'annexes']` |

#### 3.2.4 `flattenNav` — Cas limites avec fixtures (10 tests)

| # | Test | CL | Fixture | Assertion |
|---|------|----|---------|-----------|
| 1 | Arbre vide retourne `[]` | CL-01 | `emptyTree` | `flat.length === 0` |
| 2 | Items `isHidden` sont exclus | CL-02 | `treeWithHidden` | 2 items, `fw-hidden` absent |
| 3 | Parent `isHidden` exclut aussi ses enfants | CL-03 | `treeWithHiddenParent` | 2 items, hidden-cat et hidden-child absents |
| 4 | Section propagee du parent vers les enfants | CL-04 | `minimalTree` | `annexe-a1.section === 'annexes'` |
| 5 | Items tries par `order` meme si arbre desordonne | CL-05 | `treeUnsorted` | `['fw-a', 'fw-b', 'fw-c']` |
| 6 | Arbre avec un seul item → 1 element | CL-06 | `singleTree` | `flat.length === 1` |
| 7 | Ordre sequentiel Framework → Mode Operatoire → Annexes | — | `minimalTree` | Sections dans l'ordre |
| 8 | Categories Annexes avant fiches enfants | — | `minimalTree` | Parent depth 0 puis enfants depth 1 |
| 9 | Depth des chapitres Framework est 0 | — | `NAVIGATION_TREE` | Tous les Framework items ont depth 0 |
| 10 | Ne mute pas l'arbre original | — | `minimalTree` | `JSON.stringify` avant/apres egal |

#### 3.2.5 `flattenNav` — Depth et structure des Annexes (2 tests)

| # | Test | Assertion |
|---|------|-----------|
| 1 | Depth des categories Annexes est 0, fiches est 1 | Categories `annexes-*` depth 0, fiches `annexe-*` depth 1 |
| 2 | Tous les items ont un section valide apres aplatissement | Chaque section est l'une des 3 valeurs valides |

#### 3.2.6 `getBreadcrumbs` — Cas nominaux (4 tests)

| # | Test | CL | Chemin | Longueur | Dernier element |
|---|------|----|--------|----------|-----------------|
| 1 | Chapitre Framework → 3 elements | CL-10 | `/framework/preambule` | 3 | `Preambule, isCurrent: true` |
| 2 | Chapitre Mode Operatoire → 3 elements | CL-31 | `/mode-operatoire/planification` | 3 | `Planification, isCurrent: true` |
| 3 | Categorie Annexe → 3 elements | CL-12 | `/annexes/templates` | 3 | `A - Templates, isCurrent: true` |
| 4 | Fiche Annexe → 4 elements | CL-11 | `/annexes/templates/prd` | 4 | `A1 - PRD, isCurrent: true` |

#### 3.2.7 `getBreadcrumbs` — Regles structurelles (3 tests)

| # | Test | Regle | Assertion |
|---|------|-------|-----------|
| 1 | Premier element toujours Accueil | R-B4-05 (R5) | `crumbs[0] === { label: 'Accueil', href: '/' }` sur 3 chemins |
| 2 | Dernier element a toujours `isCurrent: true` | R-B4-06 (R13) | `crumbs[last].isCurrent === true` sur 3 chemins |
| 3 | Elements intermediaires n'ont pas `isCurrent` | — | `crumbs[0..n-2].isCurrent === undefined` |

#### 3.2.8 `getBreadcrumbs` — Cas limites (4 tests)

| # | Test | CL | Chemin | Resultat |
|---|------|----|--------|----------|
| 1 | Chemin introuvable retourne null | CL-08 | `/page-inexistante` | `null` |
| 2 | Chemin `/` retourne null | CL-07 | `/` | `null` |
| 3 | Trailing slash est normalise | CL-09 | `/framework/preambule/` | Egal a sans trailing slash |
| 4 | Fonctionne avec arbre minimal (fixture) | — | `/annexes/cat-a/fiche-1` | 4 elements valides |

#### 3.2.9 `getPrevNext` — Cas nominaux (4 tests)

| # | Test | CL | Chemin | Resultat |
|---|------|----|--------|----------|
| 1 | Premiere page du site → prev null | CL-13 | `/framework/preambule` | `prev: null`, `next: 'Vision & Philosophie'` |
| 2 | Derniere page du site → next null | CL-14 | `/annexes/ressources/communaute` | `prev: 'I3 - Bibliographie'`, `next: null` |
| 3 | Page au milieu → prev et next definis | — | `/framework/artefacts` | `prev: 'Ecosysteme'`, `next: 'Boucles Iteratives'` |
| 4 | Fonctionne avec arbre minimal (fixture) | — | `/mode-operatoire/phase-1` | prev et next non null |

#### 3.2.10 `getPrevNext` — Transitions cross-section (3 tests)

| # | Test | CL | Chemin | Assertion |
|---|------|----|--------|-----------|
| 1 | Transition Framework → Mode Operatoire | CL-15 | `/mode-operatoire/preambule` | `prev.section = 'framework'`, `next.section = 'mode-operatoire'` |
| 2 | Transition Mode Operatoire → Annexes | CL-16 | `/annexes/templates` | `prev.section = 'mode-operatoire'`, `next.section = 'annexes'` |
| 3 | Dernier MO → next est premiere categorie Annexes | CL-30 | `/mode-operatoire/annexes` | `next.href = '/annexes/templates'` |

#### 3.2.11 `getPrevNext` — Cas limites (3 tests)

| # | Test | CL | Chemin | Resultat |
|---|------|----|--------|----------|
| 1 | Chemin introuvable → `{ prev: null, next: null }` | CL-17 | `/page-inexistante` | Neutre |
| 2 | Trailing slash est normalise | CL-18 | `/framework/artefacts/` | Egal a sans trailing slash |
| 3 | Chaque lien prev/next a un section defini | — | Tous les items | `section !== undefined` |

#### 3.2.12 `getCurrentSection` — Cas nominaux (4 tests)

| # | Test | CL | Chemin | Resultat |
|---|------|----|--------|----------|
| 1 | `/framework` retourne `'framework'` | CL-21 | `/framework` | `'framework'` |
| 2 | `/framework/preambule` retourne `'framework'` | — | `/framework/preambule` | `'framework'` |
| 3 | `/mode-operatoire/initialisation` retourne `'mode-operatoire'` | — | `/mode-operatoire/initialisation` | `'mode-operatoire'` |
| 4 | `/annexes/templates/prd` retourne `'annexes'` | — | `/annexes/templates/prd` | `'annexes'` |

#### 3.2.13 `getCurrentSection` — Cas limites (6 tests)

| # | Test | CL | Chemin | Resultat |
|---|------|----|--------|----------|
| 1 | `/` retourne null | CL-19 | `/` | `null` |
| 2 | `/glossaire` retourne null | CL-20 | `/glossaire` | `null` |
| 3 | Chemin vide retourne null | CL-22 | `''` | `null` |
| 4 | Trailing slash est normalise | CL-23 | `/framework/`, `/mode-operatoire/`, `/annexes/` | Sections correctes |
| 5 | `/pour-qui` retourne null | — | `/pour-qui` | `null` |
| 6 | `/comparaisons` retourne null | — | `/comparaisons` | `null` |

#### 3.2.14 `getNavigation` — Cas nominaux (4 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| 1 | Sans arguments retourne NAVIGATION_TREE | CL-24 | 8 framework, 8 modeOperatoire, 9 annexes |
| 2 | Filtre sur `'framework'` ne retourne que Framework | CL-25 | 8 framework, 0 modeOperatoire, 0 annexes |
| 3 | Filtre sur `'mode-operatoire'` ne retourne que Mode Operatoire | — | 0 framework, 8 modeOperatoire, 0 annexes |
| 4 | Filtre sur `'annexes'` ne retourne que Annexes | CL-26 | 0 framework, 0 modeOperatoire, 9 annexes |

#### 3.2.15 `getNavigation` — Cas complementaires (3 tests)

| # | Test | Assertion |
|---|------|-----------|
| 1 | Avec arbre custom retourne cet arbre | `minimalTree` → 2 fw, 1 mo, 1 annexes |
| 2 | Le filtrage retourne les memes references (pas de copie) | `nav.framework === NAVIGATION_TREE.framework` |
| 3 | Ne mute pas l'arbre original | Proprietes stables apres appel |

#### 3.2.16 Integration sur NAVIGATION_TREE complet (8 tests)

| # | Test | Assertion |
|---|------|-----------|
| 1 | `flattenNav` produit des IDs tous uniques | `Set(ids).size === ids.length` |
| 2 | `flattenNav` produit des hrefs tous uniques | `Set(hrefs).size === hrefs.length` |
| 3 | Chaque item aplati a un breadcrumb valide | `getBreadcrumbs !== null` pour les 71 items |
| 4 | Chaque item aplati a un `getPrevNext` coherent | `prev[i] === flat[i-1]`, `next[i] === flat[i+1]` |
| 5 | `getCurrentSection` est coherent avec `flattenNav` | `getCurrentSection(item.href) === item.section` |
| 6 | Les 8 premiers items sont le Framework complet | Section `'framework'`, labels Preambule a Annexes |
| 7 | Les items 8-15 sont le Mode Operatoire complet | Section `'mode-operatoire'`, labels Preambule a Annexes |
| 8 | Les items 16+ sont les Annexes (55 items = 9 cat. + 46 fiches) | Section `'annexes'`, total 55 |

---

## 4. Specifications techniques

### 4.1 Structure du fichier de test

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
} from '@/types/navigation'

// Fixtures
// Tests SECTION_LABELS
// Tests SECTION_ROOT_HREFS
// Tests flattenNav (arbre complet, cas limites, depth/structure)
// Tests getBreadcrumbs (cas nominaux, regles structurelles, cas limites)
// Tests getPrevNext (cas nominaux, cross-section, cas limites)
// Tests getCurrentSection (cas nominaux, cas limites)
// Tests getNavigation (cas nominaux, complementaires)
// Tests d'integration sur NAVIGATION_TREE complet
```

### 4.2 Fixtures de test

```typescript
/** Arbre minimal pour tests isoles */
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

/** Arbre avec items caches */
const treeWithHidden: NavigationTree = {
  framework: [
    { id: 'fw-visible', label: 'Visible', href: '/framework/visible', section: 'framework', order: 1 },
    { id: 'fw-hidden', label: 'Cache', href: '/framework/cache', section: 'framework', order: 2, isHidden: true },
    { id: 'fw-after', label: 'Apres', href: '/framework/apres', section: 'framework', order: 3 },
  ],
  modeOperatoire: [],
  annexes: [],
}

/** Arbre avec parent cache ayant des enfants */
const treeWithHiddenParent: NavigationTree = {
  framework: [],
  modeOperatoire: [],
  annexes: [
    {
      id: 'hidden-cat', label: 'Categorie Cachee', href: '/annexes/hidden', section: 'annexes', order: 1,
      isHidden: true,
      children: [
        { id: 'hidden-child', label: 'Enfant', href: '/annexes/hidden/child', order: 1 },
      ],
    },
    {
      id: 'visible-cat', label: 'Categorie Visible', href: '/annexes/visible', section: 'annexes', order: 2,
      children: [
        { id: 'visible-child', label: 'Enfant Visible', href: '/annexes/visible/child', order: 1 },
      ],
    },
  ],
}

/** Arbre avec order non sequentiel */
const treeUnsorted: NavigationTree = {
  framework: [
    { id: 'fw-c', label: 'C', href: '/framework/c', section: 'framework', order: 3 },
    { id: 'fw-a', label: 'A', href: '/framework/a', section: 'framework', order: 1 },
    { id: 'fw-b', label: 'B', href: '/framework/b', section: 'framework', order: 2 },
  ],
  modeOperatoire: [],
  annexes: [],
}
```

### 4.3 Patterns de test

#### Pattern 1 : Verification de valeur retournee

```typescript
it('T-27: produit exactement 71 items sur NAVIGATION_TREE complet', () => {
  const flat = flattenNav(NAVIGATION_TREE)
  expect(flat).toHaveLength(NAVIGATION_COUNTS.TOTAL_ITEMS)
  expect(flat).toHaveLength(71)
})
```

#### Pattern 2 : Verification de structure de retour

```typescript
it('T-10: chapitre Framework → 3 elements', () => {
  const crumbs = getBreadcrumbs(NAVIGATION_TREE, '/framework/preambule')
  expect(crumbs).not.toBeNull()
  expect(crumbs).toHaveLength(3)
  expect(crumbs![0]).toEqual({ label: 'Accueil', href: '/' })
  expect(crumbs![1]).toEqual({ label: 'Framework', href: '/framework' })
  expect(crumbs![2]).toEqual({ label: 'Preambule', href: '/framework/preambule', isCurrent: true })
})
```

#### Pattern 3 : Verification de non-mutation

```typescript
it('ne mute pas l\'arbre original', () => {
  const original = JSON.parse(JSON.stringify(minimalTree))
  flattenNav(minimalTree)
  expect(minimalTree).toEqual(original)
})
```

#### Pattern 4 : Boucle d'integration sur tous les items

```typescript
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
```

#### Pattern 5 : Verification de la normalisation trailing slash

```typescript
it('T-09: trailing slash est normalise', () => {
  const withSlash = getBreadcrumbs(NAVIGATION_TREE, '/framework/preambule/')
  const withoutSlash = getBreadcrumbs(NAVIGATION_TREE, '/framework/preambule')
  expect(withSlash).toEqual(withoutSlash)
})
```

---

## 5. Cas limites et gestion d'erreurs

### 5.1 Cartographie des 32 cas limites de T-004-B4

| CL | Description | Fonction | Test | Resultat attendu |
|----|-------------|----------|------|-----------------|
| CL-01 | Arbre vide (3 sections vides) | `flattenNav` | §3.2.4 #1 | ✅ Retourne `[]` |
| CL-02 | Item avec `isHidden: true` | `flattenNav` | §3.2.4 #2 | ✅ Item exclu |
| CL-03 | Parent `isHidden: true` avec children | `flattenNav` | §3.2.4 #3 | ✅ Parent ET enfants exclus |
| CL-04 | Enfant sans `section` defini | `flattenNav` | §3.2.4 #4 | ✅ Section propagee depuis parent |
| CL-05 | Items non tries par `order` | `flattenNav` | §3.2.4 #5 | ✅ Resultat trie par order |
| CL-06 | Arbre avec un seul item | `flattenNav` | §3.2.4 #6 | ✅ Tableau avec 1 element |
| CL-07 | Chemin `/` (accueil) | `getBreadcrumbs` | §3.2.8 #2 | ✅ Retourne `null` |
| CL-08 | Chemin introuvable | `getBreadcrumbs` | §3.2.8 #1 | ✅ Retourne `null` |
| CL-09 | Trailing slash `/framework/preambule/` | `getBreadcrumbs` | §3.2.8 #3 | ✅ Normalise → meme resultat |
| CL-10 | Chapitre Framework (profondeur 1) | `getBreadcrumbs` | §3.2.6 #1 | ✅ 3 elements |
| CL-11 | Fiche Annexe (profondeur 2) | `getBreadcrumbs` | §3.2.6 #4 | ✅ 4 elements |
| CL-12 | Categorie Annexe (profondeur 1) | `getBreadcrumbs` | §3.2.6 #3 | ✅ 3 elements |
| CL-13 | Premiere page du site | `getPrevNext` | §3.2.9 #1 | ✅ `prev: null` |
| CL-14 | Derniere page du site | `getPrevNext` | §3.2.9 #2 | ✅ `next: null` |
| CL-15 | Transition Framework → Mode Operatoire | `getPrevNext` | §3.2.10 #1 | ✅ Cross-section |
| CL-16 | Transition Mode Operatoire → Annexes | `getPrevNext` | §3.2.10 #2 | ✅ Cross-section |
| CL-17 | Chemin introuvable | `getPrevNext` | §3.2.11 #1 | ✅ `{ prev: null, next: null }` |
| CL-18 | Trailing slash | `getPrevNext` | §3.2.11 #2 | ✅ Normalise |
| CL-19 | Chemin `/` | `getCurrentSection` | §3.2.13 #1 | ✅ `null` |
| CL-20 | Chemin `/glossaire` | `getCurrentSection` | §3.2.13 #2 | ✅ `null` |
| CL-21 | Chemin `/framework` (root) | `getCurrentSection` | §3.2.12 #1 | ✅ `'framework'` |
| CL-22 | Chemin vide `''` | `getCurrentSection` | §3.2.13 #3 | ✅ `null` |
| CL-23 | Trailing slash `/framework/` | `getCurrentSection` | §3.2.13 #4 | ✅ `'framework'` |
| CL-24 | `getNavigation()` sans arguments | `getNavigation` | §3.2.14 #1 | ✅ NAVIGATION_TREE complet |
| CL-25 | `getNavigation(tree, 'framework')` | `getNavigation` | §3.2.14 #2 | ✅ Seul framework rempli |
| CL-26 | `getNavigation(tree, 'annexes')` | `getNavigation` | §3.2.14 #4 | ✅ Seul annexes rempli |
| CL-27 | `flattenNav` avec NAVIGATION_TREE complet | `flattenNav` | §3.2.3 #1 | ✅ 71 items |
| CL-28 | Dernier flat item est `annexe-i4-communaute` | `flattenNav` | §3.2.3 #3 | ✅ Verification dernier element |
| CL-29 | Premier flat item est `fw-preambule` | `flattenNav` | §3.2.3 #2 | ✅ Verification premier element |
| CL-30 | Dernier MO → next = premier Annexe | `getPrevNext` | §3.2.10 #3 | ✅ Next = A - Templates |
| CL-31 | Breadcrumb Mode Operatoire avec label correct | `getBreadcrumbs` | §3.2.6 #2 | ✅ Label 'Mode Operatoire' |
| CL-32 | `normalizePath('')` → `'/'` | `normalizePath` (interne) | Test indirect via `getCurrentSection('')` | ✅ `null` |

### 5.2 Strategie de gestion d'erreurs

Les helpers ne levent pas d'exceptions. Ils gèrent tous les cas par des retours explicites :

| Scenario | Fonction | Strategie | Valeur de retour |
|----------|----------|-----------|-----------------|
| Chemin introuvable | `getBreadcrumbs` | Retour `null` | `null` |
| Chemin introuvable | `getPrevNext` | Retour neutre | `{ prev: null, next: null }` |
| Chemin hors section | `getCurrentSection` | Retour `null` | `null` |
| Arbre vide | `flattenNav` | Retour vide | `[]` |
| Arbre invalide | Toutes | Non gere (valide par Zod au build) | Comportement indetermine |

---

## 6. Exemples entree/sortie

### 6.1 `flattenNav` — Arbre complet

**Entree :**
```typescript
const flat = flattenNav(NAVIGATION_TREE)
```

**Sortie (extraits) :**
```typescript
flat.length     // → 71
flat[0]         // → { id: 'fw-preambule', label: 'Preambule', href: '/framework/preambule', section: 'framework', depth: 0 }
flat[8]         // → { id: 'mo-preambule', label: 'Preambule', href: '/mode-operatoire/preambule', section: 'mode-operatoire', depth: 0 }
flat[16]        // → { id: 'annexes-a-templates', label: 'A - Templates', href: '/annexes/templates', section: 'annexes', depth: 0 }
flat[17]        // → { id: 'annexe-a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', section: 'annexes', depth: 1 }
flat[70]        // → { id: 'annexe-i4-communaute', label: 'I4 - Communaute', href: '/annexes/ressources/communaute', section: 'annexes', depth: 1 }
```

### 6.2 `flattenNav` — Items caches exclus

**Entree :**
```typescript
const flat = flattenNav(treeWithHidden)
```

**Sortie :**
```typescript
flat.length                         // → 2
flat.map(i => i.id)                 // → ['fw-visible', 'fw-after']
flat.find(i => i.id === 'fw-hidden') // → undefined
```

### 6.3 `getBreadcrumbs` — Chapitre Framework

**Entree :**
```typescript
const crumbs = getBreadcrumbs(NAVIGATION_TREE, '/framework/preambule')
```

**Sortie :**
```typescript
[
  { label: 'Accueil', href: '/' },
  { label: 'Framework', href: '/framework' },
  { label: 'Preambule', href: '/framework/preambule', isCurrent: true },
]
```

### 6.4 `getBreadcrumbs` — Fiche Annexe (profondeur 2)

**Entree :**
```typescript
const crumbs = getBreadcrumbs(NAVIGATION_TREE, '/annexes/templates/prd')
```

**Sortie :**
```typescript
[
  { label: 'Accueil', href: '/' },
  { label: 'Annexes', href: '/annexes' },
  { label: 'A - Templates', href: '/annexes/templates' },
  { label: 'A1 - PRD', href: '/annexes/templates/prd', isCurrent: true },
]
```

### 6.5 `getBreadcrumbs` — Chemin introuvable

**Entree :**
```typescript
getBreadcrumbs(NAVIGATION_TREE, '/page-inexistante')
```

**Sortie :**
```typescript
null
```

### 6.6 `getPrevNext` — Transition cross-section

**Entree :**
```typescript
const result = getPrevNext(NAVIGATION_TREE, '/mode-operatoire/preambule')
```

**Sortie :**
```typescript
{
  prev: { label: 'Annexes', href: '/framework/annexes', section: 'framework' },
  next: { label: 'Initialisation', href: '/mode-operatoire/initialisation', section: 'mode-operatoire' },
}
```

### 6.7 `getPrevNext` — Premiere page

**Entree :**
```typescript
const result = getPrevNext(NAVIGATION_TREE, '/framework/preambule')
```

**Sortie :**
```typescript
{
  prev: null,
  next: { label: 'Vision & Philosophie', href: '/framework/vision-philosophie', section: 'framework' },
}
```

### 6.8 `getCurrentSection` — Divers chemins

**Entrees et sorties :**
```typescript
getCurrentSection('/framework/preambule')           // → 'framework'
getCurrentSection('/mode-operatoire/initialisation') // → 'mode-operatoire'
getCurrentSection('/annexes/templates/prd')          // → 'annexes'
getCurrentSection('/')                               // → null
getCurrentSection('/glossaire')                      // → null
getCurrentSection('')                                // → null
getCurrentSection('/framework/')                     // → 'framework'
```

### 6.9 `getNavigation` — Filtrage par section

**Entree :**
```typescript
const fwOnly = getNavigation(NAVIGATION_TREE, 'framework')
```

**Sortie :**
```typescript
{
  framework: [...8 items],    // Meme reference que NAVIGATION_TREE.framework
  modeOperatoire: [],         // Vide
  annexes: [],                // Vide
}
```

---

## 7. Tests

### 7.1 Fichier de test

**Emplacement :** `tests/unit/lib/navigation.test.ts`

### 7.2 Comptage des tests

| Bloc `describe` | Nombre de tests |
|-----------------|----------------|
| `SECTION_LABELS` | 2 |
| `SECTION_ROOT_HREFS` | 3 |
| `flattenNav` — Arbre complet | 4 |
| `flattenNav` — Cas limites avec fixtures | 10 |
| `flattenNav` — Depth et structure Annexes | 2 |
| `getBreadcrumbs` — Cas nominaux | 4 |
| `getBreadcrumbs` — Regles structurelles | 3 |
| `getBreadcrumbs` — Cas limites | 4 |
| `getPrevNext` — Cas nominaux | 4 |
| `getPrevNext` — Transitions cross-section | 3 |
| `getPrevNext` — Cas limites | 3 |
| `getCurrentSection` — Cas nominaux | 4 |
| `getCurrentSection` — Cas limites | 6 |
| `getNavigation` — Cas nominaux | 4 |
| `getNavigation` — Complementaires | 3 |
| Integration NAVIGATION_TREE complet | 8 |
| **Total** | **~67 tests** |

### 7.3 Matrice de couverture

| Fonction / Export | Cas nominal | Cas limites | Integration | Nb tests | Couverture |
|-------------------|-------------|-------------|-------------|----------|------------|
| `SECTION_LABELS` | ✅ valeurs | ✅ count | — | 2 | 100% |
| `SECTION_ROOT_HREFS` | ✅ valeurs, format | ✅ count | — | 3 | 100% |
| `flattenNav` | ✅ complet (71), ordre, sections | ✅ vide, hidden, hidden parent, propagation, tri, seul, depth | ✅ IDs/hrefs uniques | 16 | 100% |
| `getBreadcrumbs` | ✅ FW, MO, Annexe cat., Annexe fiche | ✅ introuvable, accueil, trailing slash, fixture | ✅ tous items valides | 11 | 100% |
| `getPrevNext` | ✅ premier, dernier, milieu, fixture | ✅ cross-section x3, introuvable, trailing slash, sections | ✅ coherence sequentielle | 10 | 100% |
| `getCurrentSection` | ✅ 3 sections, sous-chemins | ✅ accueil, glossaire, vide, trailing slash, pages hors-doc | ✅ coherence flattenNav | 10 | 100% |
| `getNavigation` | ✅ complet, filtre x3 | ✅ arbre custom, reference, immutabilite | — | 7 | 100% |
| Integration | — | — | ✅ IDs uniques, hrefs uniques, breadcrumbs, prevnext, sections, sequences FW/MO/Annexes | 8 | 100% |
| **Total** | | | | **~67** | |

### 7.4 Couverture des branches du code

| Branche | Fichier | Ligne | Test(s) |
|---------|---------|-------|---------|
| `normalizePath` : path vide ou `/` | `navigation.ts:93` | `if (!path \|\| path === '/')` | CL-07, CL-19, CL-22 |
| `normalizePath` : trailing slash | `navigation.ts:94` | `path.endsWith('/')` | CL-09, CL-18, CL-23 |
| `normalizePath` : chemin normal | `navigation.ts:94` | else | Tous les cas nominaux |
| `flattenNav.walk` : item hidden | `navigation.ts:200` | `if (item.isHidden) continue` | CL-02, CL-03 |
| `flattenNav.walk` : section propagee | `navigation.ts:202` | `item.section ?? parentSection` | CL-04 |
| `flattenNav.walk` : avec children | `navigation.ts:212` | `if (item.children)` | Annexes avec fiches |
| `flattenNav.walk` : sans children | `navigation.ts:212` | else (feuille) | Chapitres FW/MO |
| `findAncestorChain` : framework | `navigation.ts:109` | Trouvé dans FW | CL-10 |
| `findAncestorChain` : modeOperatoire | `navigation.ts:113` | Trouvé dans MO | CL-31 |
| `findAncestorChain` : annexes | `navigation.ts:117` | Trouvé dans Annexes | CL-11, CL-12 |
| `findAncestorChain` : non trouvé | `navigation.ts:120` | `return null` | CL-07, CL-08 |
| `findInItems` : match direct | `navigation.ts:137` | `item.href === path` | Tous les cas nominaux |
| `findInItems` : recurse children | `navigation.ts:140-142` | Descente recursive | CL-11 (fiche annexe) |
| `findInItems` : non trouvé | `navigation.ts:145` | `return null` | CL-08 |
| `getPrevNext` : index -1 | `navigation.ts:347-348` | `currentIndex === -1` | CL-17 |
| `getPrevNext` : premier item | `navigation.ts:351` | `currentIndex > 0` false | CL-13 |
| `getPrevNext` : dernier item | `navigation.ts:352` | `currentIndex < flat.length - 1` false | CL-14 |
| `getPrevNext` : milieu | `navigation.ts:351-352` | Les deux true | §3.2.9 #3 |
| `getCurrentSection` : segments vide | `navigation.ts:385` | `segments.length === 0` | CL-19, CL-22 |
| `getCurrentSection` : framework | `navigation.ts:389` | Match `'framework'` | CL-21 |
| `getCurrentSection` : mode-operatoire | `navigation.ts:390` | Match `'mode-operatoire'` | §3.2.12 #3 |
| `getCurrentSection` : annexes | `navigation.ts:391` | Match `'annexes'` | §3.2.12 #4 |
| `getCurrentSection` : autre | `navigation.ts:393` | `return null` | CL-20 |
| `getNavigation` : sans section | `navigation.ts:424` | `if (!section) return tree` | CL-24 |
| `getNavigation` : framework | `navigation.ts:427` | `section === 'framework'` | CL-25 |
| `getNavigation` : mode-operatoire | `navigation.ts:428` | `section === 'mode-operatoire'` | §3.2.14 #3 |
| `getNavigation` : annexes | `navigation.ts:429` | `section === 'annexes'` | CL-26 |

### 7.5 Commandes de test

```bash
# Executer les tests de ce fichier uniquement
pnpm test:unit -- lib/navigation

# Avec couverture
pnpm test:unit -- lib/navigation --coverage

# Mode watch
pnpm test:unit -- lib/navigation --watch

# Verification TypeScript
pnpm typecheck
```

---

## 8. Criteres d'acceptation

- [ ] **CA-01** : Le fichier `tests/unit/lib/navigation.test.ts` existe et est executable
- [ ] **CA-02** : Les 5 fonctions publiques de `src/lib/navigation.ts` sont testees
- [ ] **CA-03** : Les 2 constantes exportees (`SECTION_LABELS`, `SECTION_ROOT_HREFS`) sont testees
- [ ] **CA-04** : `flattenNav()` : 71 items sur arbre complet, ordre Framework → MO → Annexes verifie
- [ ] **CA-05** : `flattenNav()` : items `isHidden` exclus (R-B4-01), section propagee (R-B4-02), tri par order (R-B4-03)
- [ ] **CA-06** : `flattenNav()` : arbre vide, arbre avec un seul item, parent cache avec enfants testes
- [ ] **CA-07** : `getBreadcrumbs()` : commence par Accueil (R-B4-05/R5), termine par isCurrent (R-B4-06/R13)
- [ ] **CA-08** : `getBreadcrumbs()` : profondeur 1 (3 elements), profondeur 2 (4 elements) verifies
- [ ] **CA-09** : `getBreadcrumbs()` : retourne `null` pour chemin introuvable (R-B4-07)
- [ ] **CA-10** : `getPrevNext()` : `prev: null` premiere page, `next: null` derniere page (R-B4-08)
- [ ] **CA-11** : `getPrevNext()` : transitions cross-section FW→MO et MO→Annexes verifiees
- [ ] **CA-12** : `getPrevNext()` : retourne `{ prev: null, next: null }` pour chemin introuvable (R-B4-09)
- [ ] **CA-13** : `getCurrentSection()` : identifie les 3 sections et retourne `null` pour hors-section (R-B4-10)
- [ ] **CA-14** : `getNavigation()` : retourne arbre complet sans filtre, filtre par section correct
- [ ] **CA-15** : Normalisation du trailing slash verifiee sur toutes les fonctions (R-B4-11)
- [ ] **CA-16** : Non-mutation de l'arbre verifiee sur `flattenNav` et `getNavigation` (R-B4-12)
- [ ] **CA-17** : Les 32 cas limites de T-004-B4 sont couverts par au moins un test
- [ ] **CA-18** : Tests d'integration : IDs uniques, hrefs uniques, coherence breadcrumbs/prevnext/section pour les 71 items
- [ ] **CA-19** : Tous les tests passent (`pnpm test:unit -- lib/navigation`)
- [ ] **CA-20** : Couverture >= 95% sur `src/lib/navigation.ts`
- [ ] **CA-21** : TypeScript compile sans erreur (`pnpm typecheck`)

---

## 9. Definition of Done

- [ ] Fichier de test cree a `tests/unit/lib/navigation.test.ts`
- [ ] ~67 tests ecrits et passants
- [ ] 32 cas limites de T-004-B4 couverts
- [ ] 12 regles metier validees (R-B4-01 a R-B4-12)
- [ ] Toutes les branches du code couvertes (cf. §7.4)
- [ ] Tests d'integration sur NAVIGATION_TREE complet passants (71 items)
- [ ] Couverture >= 95% sur `src/lib/navigation.ts`
- [ ] TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] ESLint passe sans warning (`pnpm lint`)
- [ ] Tests executables en isolation (`pnpm test:unit -- lib/navigation`)

---

## 10. References

| Document | Lien |
|----------|------|
| User Story US-004 | [spec-US-004.md](./spec-US-004.md) |
| Helpers navigation (T-004-B4) | [T-004-B4-helpers-navigation.md](./T-004-B4-helpers-navigation.md) |
| Types TypeScript navigation (T-004-B1) | [T-004-B1-types-typescript-navigation.md](./T-004-B1-types-typescript-navigation.md) |
| Schemas Zod navigation (T-004-B2) | [T-004-B2-schemas-zod-navigation.md](./T-004-B2-schemas-zod-navigation.md) |
| Configuration navigation (T-004-B3) | [T-004-B3-configuration-navigation.md](./T-004-B3-configuration-navigation.md) |
| Architecture | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| Code teste | [src/lib/navigation.ts](../../../src/lib/navigation.ts) |
| Donnees de navigation | [src/data/navigation.ts](../../../src/data/navigation.ts) |
| Tests schemas (reference format) | [T-004-T1-tests-schemas-zod-navigation.md](./T-004-T1-tests-schemas-zod-navigation.md) |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 16/02/2026 | Creation initiale : ~67 tests, 32 cas limites, 12 regles metier, 27 branches, 21 criteres d'acceptation |
