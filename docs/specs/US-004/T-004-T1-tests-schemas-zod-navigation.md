# T-004-T1 : Tests unitaires schemas Zod de navigation (types, validation, cas limites)

| Metadonnee | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 13 fevrier 2026 |
| **Statut** | 🔵 A faire |
| **User Story** | [US-004 - Naviguer facilement dans le framework](./spec-US-004.md) |
| **Dependances** | T-004-B2 (Schemas Zod navigation) |
| **Bloque** | Aucune (tache terminale) |

---

## 1. Objectif

Implementer la suite de tests unitaires exhaustive pour les schemas Zod de navigation definis dans `src/schemas/navigation.ts` (T-004-B2), en garantissant :

- **Couverture a 100%** : Chaque schema, chaque champ, chaque regle metier est testee
- **Validation positive** : Les donnees valides sont acceptees avec les bonnes valeurs par defaut
- **Validation negative** : Les donnees invalides sont rejetees avec les messages d'erreur corrects en francais
- **Cas limites** : Les 44 cas limites documentes dans T-004-B2 sont couverts
- **Messages d'erreur** : Chaque message de `NAVIGATION_ERRORS` est verifie dans au moins un test
- **Regression** : La suite protege contre les modifications accidentelles des regles de validation

---

## 2. Contexte technique

### 2.1 Stack de test

| Technologie | Version | Role |
|-------------|---------|------|
| Vitest | 1.x | Framework de test unitaire |
| TypeScript | 5.x | Typage strict des fixtures et assertions |
| Zod | 3.x | Objet des tests (schemas de validation) |

### 2.2 Arborescence

```
tests/
└── unit/
    └── schemas/
        └── navigation.test.ts     <-- CE FICHIER DE TEST
src/
├── schemas/
│   └── navigation.ts              # Code teste (T-004-B2)
└── types/
    └── navigation.ts              # Types source (T-004-B1)
```

### 2.3 Fichier teste

`src/schemas/navigation.ts` exporte :

| Export | Type | Description |
|--------|------|-------------|
| `NAVIGATION_ERRORS` | Constante `as const` | 24 messages d'erreur en francais |
| `navigationSectionSchema` | `z.ZodEnum` | Enum des 3 sections |
| `navigationBadgeSchema` | `z.ZodEnum` | Enum des 2 badges |
| `navigationItemSchema` | `z.ZodType<NavigationItem>` | Schema recursif item navigation |
| `navigationTreeSchema` | `z.ZodObject` + refines | Arbre complet avec regles R1-R3 |
| `breadcrumbItemSchema` | `z.ZodObject` | Element breadcrumb |
| `breadcrumbListSchema` | `z.ZodArray` + refines | Liste breadcrumbs avec regles R5, R13 |
| `tableOfContentsItemSchema` | `z.ZodObject` | Element TOC |
| `tableOfContentsListSchema` | `z.ZodArray` + refine | Liste TOC avec regle R14 |
| `prevNextItemSchema` | `z.ZodObject` | Lien prev/next |
| `prevNextLinksSchema` | `z.ZodObject` | Paire prev/next nullable |
| `flatNavigationItemSchema` | `z.ZodObject` | Item aplati |
| `flatNavigationListSchema` | `z.ZodArray` + refine | Liste aplatie avec unicite IDs |

### 2.4 Conventions de test

Conformement aux tests existants (`tests/unit/types/navigation.test.ts`, `tests/unit/schemas/`) :

| Convention | Detail |
|-----------|--------|
| Nommage fichier | `navigation.test.ts` dans `tests/unit/schemas/` |
| Structure | `describe` par schema, `it` par cas de test |
| Fixtures | Variables `const` en haut du fichier, reutilisables |
| Assertions validation | `safeParse()` + verification `success` + `error.issues` |
| Cas parametres | `it.each()` pour les validations multiples (sections, badges) |
| References cas limites | Prefixe `CL-XX:` dans le nom du test |
| Langue des descriptions | Francais |

---

## 3. Specifications fonctionnelles

### 3.1 Regles metier testees

Les tests couvrent les 14 regles metier definies dans T-004-B2 :

| ID | Regle | Schema | Type de test |
|----|-------|--------|-------------|
| R1 | Profondeur max 4 niveaux | `navigationTreeSchema` | Arbre 4 niveaux OK, 5 niveaux KO |
| R2 | Unicite globale des IDs | `navigationTreeSchema` | IDs dupliques entre sections KO |
| R3 | Unicite `order` parmi siblings | `navigationTreeSchema` | Order dupliques meme niveau KO |
| R4 | `href` commence par `/` | `navigationItemSchema`, `breadcrumbItemSchema`, `prevNextItemSchema` | Href sans slash KO |
| R5 | Breadcrumb commence par Accueil | `breadcrumbListSchema` | Premier element != Accueil KO |
| R6 | TOC depth 2, 3 ou 4 | `tableOfContentsItemSchema` | Depth 1, 0, 5 KO |
| R7 | Badge limite a `new`/`essential` | `navigationBadgeSchema` | Valeur inconnue KO |
| R8 | ID pattern slug `^[a-z0-9-]+$` | `navigationItemSchema` | Majuscules, espaces, underscore KO |
| R10 | Label non vide et <= 100 chars | Tous les schemas avec `label` | Vide KO, 101 chars KO |
| R11 | Text TOC non vide et <= 200 chars | `tableOfContentsItemSchema` | Vide KO, 201 chars KO |
| R12 | Slug pattern `^[a-z0-9-]+$` | `tableOfContentsItemSchema` | Majuscules KO |
| R13 | Dernier breadcrumb `isCurrent: true` | `breadcrumbListSchema` | Dernier sans isCurrent KO |
| R14 | Pas de slugs dupliques dans TOC | `tableOfContentsListSchema` | Slugs identiques KO |

### 3.2 Inventaire des cas de test

#### 3.2.1 `NAVIGATION_ERRORS` (2 tests)

| # | Test | Assertion |
|---|------|-----------|
| 1 | Exporte toutes les 24 cles de messages | Chaque cle est definie |
| 2 | Tous les messages sont en francais (non vides) | `typeof string`, `length > 0` |

#### 3.2.2 `navigationSectionSchema` (10 tests)

| # | Test | Entree | Resultat |
|---|------|--------|----------|
| 1 | Accepte `'framework'` | `'framework'` | `success: true` |
| 2 | Accepte `'mode-operatoire'` | `'mode-operatoire'` | `success: true` |
| 3 | Accepte `'annexes'` | `'annexes'` | `success: true` |
| 4 | Rejette `'blog'` | `'blog'` | `success: false` |
| 5 | Rejette `'templates'` | `'templates'` | `success: false` |
| 6 | Rejette chaine vide | `''` | `success: false` |
| 7 | Rejette majuscules | `'FRAMEWORK'` | `success: false` |
| 8 | Rejette nombre | `123` | `success: false` |
| 9 | Rejette null | `null` | `success: false` |
| 10 | Rejette undefined | `undefined` | `success: false` |

#### 3.2.3 `navigationBadgeSchema` (7 tests)

| # | Test | Entree | Resultat |
|---|------|--------|----------|
| 1 | Accepte `'new'` | `'new'` | `success: true` |
| 2 | Accepte `'essential'` | `'essential'` | `success: true` |
| 3 | Rejette `'featured'` | `'featured'` | `success: false` |
| 4 | Rejette `'important'` | `'important'` | `success: false` |
| 5 | Rejette chaine vide | `''` | `success: false` |
| 6 | Rejette majuscules | `'NEW'` | `success: false` |
| 7 | Rejette null | `null` | `success: false` |

#### 3.2.4 `navigationItemSchema` — Cas valides (6 tests)

| # | Test | CL | Description |
|---|------|----|-------------|
| 1 | Item minimal sans optionnels | CL-01 | `{ id, label, href, order }` accepte, `isHidden` defaut `false` |
| 2 | Item avec tous les optionnels | — | Section, badge, isHidden explicites |
| 3 | Item avec `children: []` | CL-02 | Tableau vide accepte |
| 4 | Item avec enfants imbriques (3 niveaux) | — | Structure recursive valide |
| 5 | `order = 0` | CL-15 | Zero est valide |
| 6 | Label avec accents et symboles | CL-18 | UTF-8 accepte |

#### 3.2.5 `navigationItemSchema` — Validation id (7 tests)

| # | Test | CL | Entree | Message attendu |
|---|------|----|--------|-----------------|
| 1 | Rejette ID avec majuscules | CL-05 | `'Fw-Preambule'` | `NAVIGATION_ERRORS.ID_PATTERN` |
| 2 | Rejette ID avec espaces | CL-06 | `'fw preambule'` | `ID_PATTERN` |
| 3 | Rejette ID avec underscore/accents | CL-07 | `'fw_preambule'` | `ID_PATTERN` |
| 4 | Rejette ID de 1 caractere | CL-08 | `'x'` | `ID_MIN_LENGTH` |
| 5 | Rejette ID de 81 caracteres | CL-09 | `'a'.repeat(81)` | `ID_MAX_LENGTH` |
| 6 | Accepte ID de 2 caracteres (borne min) | — | `'ab'` | `success: true` |
| 7 | Accepte ID de 80 caracteres (borne max) | — | `'a'.repeat(80)` | `success: true` |

#### 3.2.6 `navigationItemSchema` — Validation label (2 tests)

| # | Test | CL | Entree | Message attendu |
|---|------|----|--------|-----------------|
| 1 | Rejette label vide | CL-16 | `''` | `LABEL_MIN_LENGTH` |
| 2 | Rejette label > 100 caracteres | CL-17 | `'a'.repeat(101)` | `LABEL_MAX_LENGTH` |

#### 3.2.7 `navigationItemSchema` — Validation href (3 tests)

| # | Test | CL | Entree | Message attendu |
|---|------|----|--------|-----------------|
| 1 | Rejette href sans slash | CL-10 | `'framework'` | `HREF_START_SLASH` |
| 2 | Rejette URL externe https | CL-11 | `'https://example.com'` | `HREF_START_SLASH` |
| 3 | Rejette URL proto-relative | CL-12 | `'//cdn.com/path'` | `HREF_NO_EXTERNAL` |

#### 3.2.8 `navigationItemSchema` — Validation order (3 tests)

| # | Test | CL | Entree | Message attendu |
|---|------|----|--------|-----------------|
| 1 | Rejette order negatif | CL-13 | `-1` | `ORDER_NONNEGATIVE` |
| 2 | Rejette order flottant | CL-14 | `1.5` | `ORDER_INTEGER` |
| 3 | Rejette order string | CL-42 | `'1'` | type invalide |

#### 3.2.9 `navigationItemSchema` — Validation section et badge (2 tests)

| # | Test | CL | Entree | Resultat |
|---|------|----|--------|----------|
| 1 | Rejette section invalide | CL-19 | `'blog'` | `success: false` |
| 2 | Rejette badge invalide | CL-20 | `'featured'` | `success: false` |

#### 3.2.10 `navigationItemSchema` — Champs manquants et types (5 tests)

| # | Test | CL | Description |
|---|------|----|-------------|
| 1 | Rejette item sans id | CL-41 | Champ requis |
| 2 | Rejette item sans label | — | Champ requis |
| 3 | Rejette item sans href | — | Champ requis |
| 4 | Rejette item sans order | — | Champ requis |
| 5 | Rejette `id: null` | CL-43 | Type invalide |

#### 3.2.11 `navigationItemSchema` — Valeurs par defaut (1 test)

| # | Test | Description |
|---|------|-------------|
| 1 | Applique `isHidden = false` par defaut | Champ absent → `false` |

#### 3.2.12 `navigationTreeSchema` — Cas valides (5 tests)

| # | Test | CL | Description |
|---|------|----|-------------|
| 1 | Accepte arbre complet valide | — | 3 sections avec items |
| 2 | Accepte section vide | CL-24 | `framework: []` |
| 3 | Accepte 4 niveaux exactement | CL-04 | Limite profondeur |
| 4 | Accepte meme order niveaux differents | CL-23 | Parent `order:1`, enfant `order:1` |
| 5 | Accepte item masque meme order | CL-40 | `isHidden: true` exclu de verification |

#### 3.2.13 `navigationTreeSchema` — Regle R1 profondeur (1 test)

| # | Test | CL | Description | Message attendu |
|---|------|----|-------------|-----------------|
| 1 | Rejette arbre 5 niveaux | CL-03 | L1→L2→L3→L4→L5 | `MAX_DEPTH_EXCEEDED` |

#### 3.2.14 `navigationTreeSchema` — Regle R2 unicite IDs (2 tests)

| # | Test | CL | Description | Message attendu |
|---|------|----|-------------|-----------------|
| 1 | Rejette IDs dupliques entre sections | CL-21 | `'preambule'` dans framework + modeOperatoire | `TREE_DUPLICATE_ID` |
| 2 | Rejette IDs dupliques parent/enfant | — | Parent et enfant meme id | `TREE_DUPLICATE_ID` |

#### 3.2.15 `navigationTreeSchema` — Regle R3 unicite order (2 tests)

| # | Test | CL | Description | Message attendu |
|---|------|----|-------------|-----------------|
| 1 | Rejette order dupliques siblings | CL-22 | Deux items `order: 1` | `TREE_DUPLICATE_ORDER` |
| 2 | Rejette order dupliques enfants | — | Deux enfants `order: 1` | `TREE_DUPLICATE_ORDER` |

#### 3.2.16 `breadcrumbItemSchema` (5 tests)

| # | Test | Description |
|---|------|-------------|
| 1 | Accepte item valide | `{ label, href }` |
| 2 | Accepte item avec `isCurrent` | `{ label, href, isCurrent: true }` |
| 3 | Applique `isCurrent = false` par defaut | Champ absent → `false` |
| 4 | Rejette label vide | `label: ''` |
| 5 | Rejette href sans slash | `href: 'test'` |

#### 3.2.17 `breadcrumbListSchema` (5 tests)

| # | Test | CL | Description | Message attendu |
|---|------|----|-------------|-----------------|
| 1 | Accepte liste valide | — | Accueil + items + isCurrent | `success: true` |
| 2 | Accepte Accueil seul courant | CL-28 | `[{ label: 'Accueil', href: '/', isCurrent: true }]` | `success: true` |
| 3 | Rejette breadcrumb vide | CL-25 | `[]` | `BREADCRUMB_EMPTY` |
| 4 | Rejette sans Accueil en premier | CL-26 | Premier element != Accueil | `BREADCRUMB_START_HOME` |
| 5 | Rejette sans isCurrent dernier | CL-27 | Dernier sans `isCurrent: true` | `BREADCRUMB_LAST_CURRENT` |

#### 3.2.18 `tableOfContentsItemSchema` (8 tests)

| # | Test | CL | Description |
|---|------|----|-------------|
| 1 | Accepte item h2 valide | — | `depth: 2` |
| 2 | Accepte depth 2 | — | Via `it.each` |
| 3 | Accepte depth 3 | — | Via `it.each` |
| 4 | Accepte depth 4 | — | Via `it.each` |
| 5 | Rejette depth 1 (h1) | CL-29 | `TOC_DEPTH_INVALID` |
| 6 | Rejette depth 5 (h5) | CL-30 | `TOC_DEPTH_INVALID` |
| 7 | Rejette depth 0 | CL-31 | `TOC_DEPTH_INVALID` |
| 8 | Rejette text vide | — | `TOC_TEXT_MIN_LENGTH` |
| 9 | Rejette text > 200 caracteres | — | `TOC_TEXT_MAX_LENGTH` |
| 10 | Rejette slug avec majuscules | CL-35 | `TOC_SLUG_PATTERN` |

#### 3.2.19 `tableOfContentsListSchema` (4 tests)

| # | Test | CL | Description | Message attendu |
|---|------|----|-------------|-----------------|
| 1 | Accepte liste vide | CL-32 | Page sans headings | `success: true` |
| 2 | Accepte liste valide | — | 2 items differents | `success: true` |
| 3 | Accepte h2 puis h4 sans h3 | CL-34 | Pas de contrainte hierarchie | `success: true` |
| 4 | Rejette slugs dupliques | CL-33 | Meme slug 2 items | `TOC_DUPLICATE_SLUG` |

#### 3.2.20 `prevNextItemSchema` (2 tests)

| # | Test | Description |
|---|------|-------------|
| 1 | Accepte item valide avec section | `{ label, href, section }` |
| 2 | Accepte item sans section | `{ label, href }` |

#### 3.2.21 `prevNextLinksSchema` (5 tests)

| # | Test | CL | Description |
|---|------|----|-------------|
| 1 | Accepte liens valides | — | prev et next definis |
| 2 | Accepte prev et next null | CL-36 | Page isolee |
| 3 | Accepte prev null | — | Premiere page |
| 4 | Accepte next null | — | Derniere page |
| 5 | Accepte cross-section | CL-37 | prev framework, next mode-operatoire |

#### 3.2.22 `flatNavigationItemSchema` (3 tests)

| # | Test | CL | Description |
|---|------|----|-------------|
| 1 | Accepte item valide | — | Avec section et depth |
| 2 | Accepte item sans section | — | Section optionnelle |
| 3 | Rejette depth negatif | CL-38 | `depth: -1` |

#### 3.2.23 `flatNavigationListSchema` (3 tests)

| # | Test | CL | Description | Message attendu |
|---|------|----|-------------|-----------------|
| 1 | Accepte liste valide | — | IDs uniques | `success: true` |
| 2 | Rejette IDs dupliques | CL-39 | Meme id 2 items | `FLAT_DUPLICATE_ID` |
| 3 | Accepte liste vide | — | `[]` | `success: true` |

#### 3.2.24 Erreurs multiples (1 test)

| # | Test | Description |
|---|------|-------------|
| 1 | Remonte toutes les erreurs item invalide | `{ id: '', label: '', href: 'no-slash', order: -1.5 }` → >= 3 erreurs |

---

## 4. Specifications techniques

### 4.1 Structure du fichier de test

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

// Fixtures
// Tests NAVIGATION_ERRORS
// Tests navigationSectionSchema
// Tests navigationBadgeSchema
// Tests navigationItemSchema (cas valides, id, label, href, order, section/badge, champs manquants, defauts)
// Tests navigationTreeSchema (cas valides, R1 profondeur, R2 unicite IDs, R3 unicite order)
// Tests breadcrumbItemSchema
// Tests breadcrumbListSchema
// Tests tableOfContentsItemSchema
// Tests tableOfContentsListSchema
// Tests prevNextItemSchema
// Tests prevNextLinksSchema
// Tests flatNavigationItemSchema
// Tests flatNavigationListSchema
// Tests erreurs multiples
```

### 4.2 Fixtures de test

```typescript
const validNavItem = {
  id: 'fw-preambule',
  label: 'Preambule',
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
  { label: 'Preambule', href: '/framework/preambule', isCurrent: true },
]

const validTocItem = { depth: 2 as const, text: 'Introduction', slug: 'introduction' }

const validPrevNextLinks = {
  prev: { label: 'Vision', href: '/framework/vision', section: 'framework' as const },
  next: { label: 'Artefacts', href: '/framework/artefacts', section: 'framework' as const },
}

const validTree = {
  framework: [
    { id: 'fw-preambule', label: 'Preambule', href: '/framework/preambule', order: 1 },
    { id: 'fw-vision', label: 'Vision & Philosophie', href: '/framework/vision', order: 2 },
  ],
  modeOperatoire: [
    { id: 'mo-preambule', label: 'Preambule', href: '/mode-operatoire/preambule', order: 0 },
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
```

### 4.3 Patterns de test

#### Pattern 1 : Validation positive avec `safeParse`

```typescript
it('accepte un item minimal', () => {
  const result = navigationItemSchema.safeParse(validNavItem)
  expect(result.success).toBe(true)
  if (result.success) {
    expect(result.data.id).toBe('fw-preambule')
    expect(result.data.isHidden).toBe(false) // default
  }
})
```

#### Pattern 2 : Validation negative avec verification du message

```typescript
it('rejette un ID avec majuscules', () => {
  const result = navigationItemSchema.safeParse({ ...validNavItem, id: 'Fw-Preambule' })
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.ID_PATTERN)
  }
})
```

#### Pattern 3 : Tests parametres avec `it.each`

```typescript
it.each(['framework', 'mode-operatoire', 'annexes'])(
  'accepte la section valide "%s"',
  (section) => {
    expect(navigationSectionSchema.safeParse(section).success).toBe(true)
  }
)
```

#### Pattern 4 : Verification du message dans les erreurs refine

```typescript
it('rejette un breadcrumb sans Accueil en premier', () => {
  const result = breadcrumbListSchema.safeParse([
    { label: 'Framework', href: '/framework', isCurrent: true },
  ])
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.BREADCRUMB_START_HOME)
  }
})
```

---

## 5. Cas limites et gestion d'erreurs

### 5.1 Cartographie des 44 cas limites de T-004-B2

| CL | Description | Schema | Test | Resultat attendu |
|----|-------------|--------|------|-----------------|
| CL-01 | Item sans children | `navigationItemSchema` | Validation positive | ✅ Accepte |
| CL-02 | Item avec `children: []` | `navigationItemSchema` | Validation positive | ✅ Accepte |
| CL-03 | Arbre 5 niveaux profondeur | `navigationTreeSchema` | Regle R1 | ❌ `MAX_DEPTH_EXCEEDED` |
| CL-04 | Arbre 4 niveaux exactement | `navigationTreeSchema` | Validation positive | ✅ Accepte |
| CL-05 | ID avec majuscules | `navigationItemSchema` | Validation id | ❌ `ID_PATTERN` |
| CL-06 | ID avec espaces | `navigationItemSchema` | Validation id | ❌ `ID_PATTERN` |
| CL-07 | ID avec underscore/accents | `navigationItemSchema` | Validation id | ❌ `ID_PATTERN` |
| CL-08 | ID de 1 caractere | `navigationItemSchema` | Validation id | ❌ `ID_MIN_LENGTH` |
| CL-09 | ID de 81 caracteres | `navigationItemSchema` | Validation id | ❌ `ID_MAX_LENGTH` |
| CL-10 | href sans slash | `navigationItemSchema` | Validation href | ❌ `HREF_START_SLASH` |
| CL-11 | href URL externe https | `navigationItemSchema` | Validation href | ❌ `HREF_START_SLASH` |
| CL-12 | href URL proto-relative | `navigationItemSchema` | Validation href | ❌ `HREF_NO_EXTERNAL` |
| CL-13 | order negatif (-1) | `navigationItemSchema` | Validation order | ❌ `ORDER_NONNEGATIVE` |
| CL-14 | order flottant (1.5) | `navigationItemSchema` | Validation order | ❌ `ORDER_INTEGER` |
| CL-15 | order = 0 | `navigationItemSchema` | Validation positive | ✅ Accepte |
| CL-16 | Label vide | `navigationItemSchema` | Validation label | ❌ `LABEL_MIN_LENGTH` |
| CL-17 | Label > 100 caracteres | `navigationItemSchema` | Validation label | ❌ `LABEL_MAX_LENGTH` |
| CL-18 | Label accents et symboles | `navigationItemSchema` | Validation positive | ✅ Accepte |
| CL-19 | Section invalide (`'blog'`) | `navigationItemSchema` | Validation section | ❌ `SECTION_INVALID` |
| CL-20 | Badge invalide (`'featured'`) | `navigationItemSchema` | Validation badge | ❌ `BADGE_INVALID` |
| CL-21 | IDs dupliques entre sections | `navigationTreeSchema` | Regle R2 | ❌ `TREE_DUPLICATE_ID` |
| CL-22 | Siblings meme order | `navigationTreeSchema` | Regle R3 | ❌ `TREE_DUPLICATE_ORDER` |
| CL-23 | Niveaux differents meme order | `navigationTreeSchema` | Validation positive | ✅ Accepte |
| CL-24 | Section vide `framework: []` | `navigationTreeSchema` | Validation positive | ✅ Accepte |
| CL-25 | Breadcrumb vide | `breadcrumbListSchema` | Validation negative | ❌ `BREADCRUMB_EMPTY` |
| CL-26 | Breadcrumb sans Accueil | `breadcrumbListSchema` | Regle R5 | ❌ `BREADCRUMB_START_HOME` |
| CL-27 | Breadcrumb dernier sans isCurrent | `breadcrumbListSchema` | Regle R13 | ❌ `BREADCRUMB_LAST_CURRENT` |
| CL-28 | Breadcrumb Accueil seul courant | `breadcrumbListSchema` | Validation positive | ✅ Accepte |
| CL-29 | TOC depth = 1 (h1) | `tableOfContentsItemSchema` | Regle R6 | ❌ `TOC_DEPTH_INVALID` |
| CL-30 | TOC depth = 5 (h5) | `tableOfContentsItemSchema` | Regle R6 | ❌ `TOC_DEPTH_INVALID` |
| CL-31 | TOC depth = 0 | `tableOfContentsItemSchema` | Regle R6 | ❌ `TOC_DEPTH_INVALID` |
| CL-32 | TOC liste vide | `tableOfContentsListSchema` | Validation positive | ✅ Accepte |
| CL-33 | TOC slugs dupliques | `tableOfContentsListSchema` | Regle R14 | ❌ `TOC_DUPLICATE_SLUG` |
| CL-34 | TOC h2 puis h4 sans h3 | `tableOfContentsListSchema` | Validation positive | ✅ Accepte |
| CL-35 | TOC slug majuscules | `tableOfContentsItemSchema` | Validation slug | ❌ `TOC_SLUG_PATTERN` |
| CL-36 | PrevNext prev et next null | `prevNextLinksSchema` | Validation positive | ✅ Accepte |
| CL-37 | PrevNext cross-section | `prevNextLinksSchema` | Validation positive | ✅ Accepte |
| CL-38 | FlatNavItem depth negatif | `flatNavigationItemSchema` | Validation negative | ❌ `FLAT_DEPTH_NONNEGATIVE` |
| CL-39 | FlatNavList IDs dupliques | `flatNavigationListSchema` | Validation negative | ❌ `FLAT_DUPLICATE_ID` |
| CL-40 | Item masque meme order | `navigationTreeSchema` | Validation positive | ✅ Accepte |
| CL-41 | Champ id absent | `navigationItemSchema` | Champs manquants | ❌ Champ requis |
| CL-42 | order type string | `navigationItemSchema` | Validation order | ❌ Type invalide |
| CL-43 | id = null | `navigationItemSchema` | Champs manquants | ❌ Type invalide |
| CL-44 | Champs supplementaires | Tous | Strip par defaut | ✅ Accepte (strip) |

### 5.2 Messages d'erreur verifies

Chaque message de `NAVIGATION_ERRORS` est verifie dans au moins un test :

| Message | Test(s) |
|---------|---------|
| `ID_PATTERN` | CL-05, CL-06, CL-07 |
| `ID_MIN_LENGTH` | CL-08 |
| `ID_MAX_LENGTH` | CL-09 |
| `LABEL_MIN_LENGTH` | CL-16 |
| `LABEL_MAX_LENGTH` | CL-17 |
| `HREF_START_SLASH` | CL-10, CL-11 |
| `HREF_NO_EXTERNAL` | CL-12 |
| `ORDER_INTEGER` | CL-14 |
| `ORDER_NONNEGATIVE` | CL-13 |
| `SECTION_INVALID` | CL-19, navigationSectionSchema tests |
| `BADGE_INVALID` | CL-20, navigationBadgeSchema tests |
| `MAX_DEPTH_EXCEEDED` | CL-03 |
| `TREE_DUPLICATE_ID` | CL-21 |
| `TREE_DUPLICATE_ORDER` | CL-22 |
| `BREADCRUMB_EMPTY` | CL-25 |
| `BREADCRUMB_START_HOME` | CL-26 |
| `BREADCRUMB_LAST_CURRENT` | CL-27 |
| `TOC_DEPTH_INVALID` | CL-29, CL-30, CL-31 |
| `TOC_TEXT_MIN_LENGTH` | tableOfContentsItemSchema text vide |
| `TOC_TEXT_MAX_LENGTH` | tableOfContentsItemSchema text > 200 |
| `TOC_SLUG_PATTERN` | CL-35 |
| `TOC_DUPLICATE_SLUG` | CL-33 |
| `FLAT_DEPTH_NONNEGATIVE` | CL-38 |
| `FLAT_DUPLICATE_ID` | CL-39 |

---

## 6. Exemples entree/sortie

### 6.1 Test validation positive — Item minimal

**Entree (fixture) :**
```typescript
const input = { id: 'fw-preambule', label: 'Preambule', href: '/framework/preambule', order: 1 }
```

**Sortie (`safeParse`) :**
```typescript
{
  success: true,
  data: {
    id: 'fw-preambule',
    label: 'Preambule',
    href: '/framework/preambule',
    order: 1,
    isHidden: false,  // defaut applique
  }
}
```

**Assertion :**
```typescript
expect(result.success).toBe(true)
expect(result.data.isHidden).toBe(false)
```

### 6.2 Test validation negative — ID invalide

**Entree :**
```typescript
const input = { ...validNavItem, id: 'Fw-Preambule' }
```

**Sortie (`safeParse`) :**
```typescript
{
  success: false,
  error: {
    issues: [{
      code: 'custom',
      message: "L'ID ne doit contenir que des minuscules, chiffres et tirets (pattern: ^[a-z0-9-]+$)",
      path: ['id'],
    }]
  }
}
```

**Assertion :**
```typescript
expect(result.success).toBe(false)
expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.ID_PATTERN)
```

### 6.3 Test arbre profondeur excessive

**Entree :**
```typescript
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
```

**Assertion :**
```typescript
expect(result.success).toBe(false)
expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.MAX_DEPTH_EXCEEDED)
```

### 6.4 Test breadcrumb invalide

**Entree :**
```typescript
const input = [
  { label: 'Framework', href: '/framework', isCurrent: true },
]
```

**Assertion :**
```typescript
expect(result.success).toBe(false)
expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.BREADCRUMB_START_HOME)
```

### 6.5 Test erreurs multiples

**Entree :**
```typescript
const input = { id: '', label: '', href: 'no-slash', order: -1.5 }
```

**Assertion :**
```typescript
expect(result.success).toBe(false)
expect(result.error.issues.length).toBeGreaterThanOrEqual(3)
```

---

## 7. Tests

### 7.1 Fichier de test

**Emplacement :** `tests/unit/schemas/navigation.test.ts`

### 7.2 Comptage des tests

| Bloc `describe` | Nombre de tests |
|-----------------|----------------|
| `NAVIGATION_ERRORS` | 2 |
| `navigationSectionSchema` | 10 (via `it.each`) |
| `navigationBadgeSchema` | 7 (via `it.each`) |
| `navigationItemSchema` — Cas valides | 6 |
| `navigationItemSchema` — Validation id | 7 |
| `navigationItemSchema` — Validation label | 2 |
| `navigationItemSchema` — Validation href | 3 |
| `navigationItemSchema` — Validation order | 3 |
| `navigationItemSchema` — Validation section/badge | 2 |
| `navigationItemSchema` — Champs manquants | 5 |
| `navigationItemSchema` — Defauts | 1 |
| `navigationTreeSchema` — Cas valides | 5 |
| `navigationTreeSchema` — Regle R1 | 1 |
| `navigationTreeSchema` — Regle R2 | 2 |
| `navigationTreeSchema` — Regle R3 | 2 |
| `breadcrumbItemSchema` | 5 |
| `breadcrumbListSchema` | 5 |
| `tableOfContentsItemSchema` | 10 |
| `tableOfContentsListSchema` | 4 |
| `prevNextItemSchema` | 2 |
| `prevNextLinksSchema` | 5 |
| `flatNavigationItemSchema` | 3 |
| `flatNavigationListSchema` | 3 |
| Erreurs multiples | 1 |
| **Total** | **~95 tests** |

### 7.3 Matrice de couverture

| Schema | Cas valide | Cas invalide | Cas limite | Message verifie | Couverture |
|--------|-----------|-------------|------------|-----------------|------------|
| `NAVIGATION_ERRORS` | ✅ (cles) | — | — | ✅ (francais) | 100% |
| `navigationSectionSchema` | ✅ (3) | ✅ (7) | — | — | 100% |
| `navigationBadgeSchema` | ✅ (2) | ✅ (5) | — | — | 100% |
| `navigationItemSchema` | ✅ (6) | ✅ (19) | ✅ (18 CL) | ✅ (10 msg) | 100% |
| `navigationTreeSchema` | ✅ (5) | ✅ (5) | ✅ (7 CL) | ✅ (3 msg) | 100% |
| `breadcrumbItemSchema` | ✅ (3) | ✅ (2) | — | — | 100% |
| `breadcrumbListSchema` | ✅ (2) | ✅ (3) | ✅ (4 CL) | ✅ (3 msg) | 100% |
| `tableOfContentsItemSchema` | ✅ (4) | ✅ (6) | ✅ (5 CL) | ✅ (4 msg) | 100% |
| `tableOfContentsListSchema` | ✅ (3) | ✅ (1) | ✅ (3 CL) | ✅ (1 msg) | 100% |
| `prevNextItemSchema` | ✅ (2) | — | — | — | 100% |
| `prevNextLinksSchema` | ✅ (5) | — | ✅ (2 CL) | — | 100% |
| `flatNavigationItemSchema` | ✅ (2) | ✅ (1) | ✅ (1 CL) | — | 100% |
| `flatNavigationListSchema` | ✅ (2) | ✅ (1) | ✅ (1 CL) | ✅ (1 msg) | 100% |
| Erreurs multiples | — | ✅ (1) | — | — | 100% |

**Total : ~95 tests couvrant 44 cas limites, 14 regles metier, 24 messages d'erreur.**

### 7.4 Commandes de test

```bash
# Executer les tests de ce fichier uniquement
pnpm test:unit -- schemas/navigation

# Avec couverture
pnpm test:unit -- schemas/navigation --coverage

# Mode watch
pnpm test:unit -- schemas/navigation --watch

# Verification TypeScript
pnpm typecheck
```

---

## 8. Criteres d'acceptation

- [ ] **CA-01** : Le fichier `tests/unit/schemas/navigation.test.ts` existe et est executable
- [ ] **CA-02** : Les 12 schemas exportes par `src/schemas/navigation.ts` sont testes
- [ ] **CA-03** : La constante `NAVIGATION_ERRORS` est testee (24 cles, messages en francais)
- [ ] **CA-04** : `navigationSectionSchema` : 3 valeurs valides + 7 invalides testees
- [ ] **CA-05** : `navigationBadgeSchema` : 2 valeurs valides + 5 invalides testees
- [ ] **CA-06** : `navigationItemSchema` : validations id (pattern, longueur), label, href, order, section, badge, champs manquants
- [ ] **CA-07** : `navigationItemSchema` : valeur par defaut `isHidden: false` verifiee
- [ ] **CA-08** : `navigationTreeSchema` : regle R1 (profondeur max 4, rejet a 5) verifiee
- [ ] **CA-09** : `navigationTreeSchema` : regle R2 (unicite IDs globale) verifiee
- [ ] **CA-10** : `navigationTreeSchema` : regle R3 (unicite order siblings, exclusion hidden) verifiee
- [ ] **CA-11** : `breadcrumbListSchema` : regle R5 (Accueil en premier) verifiee
- [ ] **CA-12** : `breadcrumbListSchema` : regle R13 (dernier isCurrent) verifiee
- [ ] **CA-13** : `tableOfContentsItemSchema` : regle R6 (depth 2-4) verifiee
- [ ] **CA-14** : `tableOfContentsListSchema` : regle R14 (slugs uniques) verifiee
- [ ] **CA-15** : `prevNextLinksSchema` : nullable prev/next verifie
- [ ] **CA-16** : `flatNavigationListSchema` : unicite IDs verifiee
- [ ] **CA-17** : Les 44 cas limites de T-004-B2 sont couverts par au moins un test
- [ ] **CA-18** : Les 24 messages de `NAVIGATION_ERRORS` sont verifies dans les assertions
- [ ] **CA-19** : Un test verifie que les erreurs multiples sont toutes remontees
- [ ] **CA-20** : Tous les tests passent (`pnpm test:unit -- schemas/navigation`)
- [ ] **CA-21** : Couverture >= 95% sur `src/schemas/navigation.ts`
- [ ] **CA-22** : TypeScript compile sans erreur (`pnpm typecheck`)

---

## 9. Definition of Done

- [ ] Fichier de test cree a `tests/unit/schemas/navigation.test.ts`
- [ ] ~95 tests ecrits et passants
- [ ] 44 cas limites de T-004-B2 couverts
- [ ] 14 regles metier validees
- [ ] 24 messages d'erreur `NAVIGATION_ERRORS` verifies
- [ ] Couverture >= 95% sur `src/schemas/navigation.ts`
- [ ] TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] ESLint passe sans warning (`pnpm lint`)
- [ ] Tests executables en isolation (`pnpm test:unit -- schemas/navigation`)

---

## 10. References

| Document | Lien |
|----------|------|
| User Story US-004 | [spec-US-004.md](./spec-US-004.md) |
| Schemas Zod navigation (T-004-B2) | [T-004-B2-schemas-zod-navigation.md](./T-004-B2-schemas-zod-navigation.md) |
| Types TypeScript navigation (T-004-B1) | [T-004-B1-types-typescript-navigation.md](./T-004-B1-types-typescript-navigation.md) |
| Architecture | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| Code teste | [src/schemas/navigation.ts](../../../src/schemas/navigation.ts) |
| Tests types navigation (reference) | [tests/unit/types/navigation.test.ts](../../../tests/unit/types/navigation.test.ts) |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 13/02/2026 | Creation initiale : ~95 tests, 44 cas limites, 14 regles metier, 24 messages d'erreur, 22 criteres d'acceptation |
