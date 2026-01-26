# T-001-B1 : Créer le modèle de données HeroContent

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 2.0 |
| **Date** | 26 janvier 2026 |
| **Statut** | À implémenter |
| **User Story** | [US-001 - Comprendre AIAD rapidement](../PRD.md#us-001--comprendre-aiad-rapidement) |
| **Dépendances** | Aucune (tâche racine) |
| **Bloque** | T-001-B4, T-001-F1 |

---

## 1. Objectif

Définir et implémenter le modèle de données `HeroContent` qui structure le contenu textuel principal de la hero section, en garantissant :

- **Type-safety** : Validation TypeScript à la compilation
- **Runtime validation** : Validation Zod à l'exécution
- **Intégration Astro** : Compatible avec Content Collections
- **Extensibilité i18n** : Préparé pour le multilinguisme (Phase 2)

---

## 2. Contexte technique

### 2.1 Architecture cible

D'après [ARCHITECTURE.md](../ARCHITECTURE.md), le projet utilise :

- **Astro 4.x** avec Content Collections pour la gestion du contenu
- **TypeScript 5.x** en mode strict
- **Zod** (via `astro:content`) pour la validation des schémas

### 2.2 Positionnement dans l'arborescence

```
src/
├── content/
│   ├── config.ts           # ← Ajout du schéma heroContent
│   └── hero/
│       └── main.json       # ← Données (T-001-B4)
├── types/
│   ├── index.ts            # ← Export barrel
│   └── hero.ts             # ← Interface HeroContent
└── lib/
    └── hero.ts             # ← Helpers (optionnel)
```

---

## 3. Spécifications fonctionnelles

### 3.1 Description du modèle

Le `HeroContent` encapsule les éléments textuels de la hero section définis dans US-001 :

| Élément UI | Champ correspondant | Critère d'acceptation |
|------------|--------------------|-----------------------|
| Titre H1 | `title` | Titre explicite du framework |
| Sous-titre | `tagline` | Accroche en une phrase |
| Description | `valueProposition` | Bénéfice principal |

### 3.2 Définition des champs

| Champ | Type | Requis | Description | Contraintes |
|-------|------|--------|-------------|-------------|
| `id` | `string` | ✅ | Identifiant unique slug-friendly | Pattern: `^[a-z0-9-]+$`, 3-50 chars |
| `title` | `string` | ✅ | Titre principal (H1) | 10-80 caractères |
| `tagline` | `string` | ✅ | Accroche percutante | 10-120 caractères |
| `valueProposition` | `string` | ✅ | Proposition de valeur | 20-200 caractères |
| `locale` | `string` | ❌ | Code langue ISO 639-1 | 2 caractères, défaut: `"fr"` |
| `isActive` | `boolean` | ❌ | Contenu actif/brouillon | Défaut: `true` |
| `metadata` | `object` | ❌ | Métadonnées SEO | Voir sous-schéma |
| `updatedAt` | `Date` | ✅ | Dernière modification | ISO 8601 |

#### 3.2.1 Sous-schéma `metadata`

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `seoTitle` | `string` | ❌ | Titre SEO alternatif (max 60 chars) |
| `seoDescription` | `string` | ❌ | Meta description (max 160 chars) |

### 3.3 Règles métier

| ID | Règle | Justification |
|----|-------|---------------|
| R1 | `title` doit contenir "AIAD" | Cohérence branding |
| R2 | `tagline` ne doit pas répéter `title` | Éviter la redondance |
| R3 | `valueProposition` doit être une phrase complète (terminer par `.`) | Lisibilité |
| R4 | Un seul `HeroContent` actif par `locale` | Unicité du contenu affiché |

---

## 4. Spécifications techniques

### 4.1 Interface TypeScript

```typescript
// src/types/hero.ts

/**
 * Métadonnées SEO optionnelles pour le hero content
 */
export interface HeroMetadata {
  /** Titre SEO alternatif (max 60 caractères) */
  seoTitle?: string
  /** Meta description pour les moteurs de recherche (max 160 caractères) */
  seoDescription?: string
}

/**
 * Représente le contenu principal de la hero section
 *
 * @example
 * ```typescript
 * const hero: HeroContent = {
 *   id: 'hero-main-fr',
 *   title: 'AIAD : Le framework pour développer avec des agents IA',
 *   tagline: 'Structurez votre collaboration avec l\'IA',
 *   valueProposition: 'Une méthodologie éprouvée pour intégrer les agents IA.',
 *   locale: 'fr',
 *   isActive: true,
 *   updatedAt: new Date('2026-01-26'),
 * }
 * ```
 *
 * @see {@link https://docs.example.com/PRD#us-001 | US-001}
 */
export interface HeroContent {
  /**
   * Identifiant unique slug-friendly
   * @pattern ^[a-z0-9-]+$
   * @minLength 3
   * @maxLength 50
   */
  id: string

  /**
   * Titre principal affiché en H1
   * Doit contenir "AIAD" pour la cohérence branding
   * @minLength 10
   * @maxLength 80
   */
  title: string

  /**
   * Accroche courte et percutante sous le titre
   * Ne doit pas répéter le contenu du titre
   * @minLength 10
   * @maxLength 120
   */
  tagline: string

  /**
   * Description de la proposition de valeur principale
   * Doit être une phrase complète (terminer par un point)
   * @minLength 20
   * @maxLength 200
   */
  valueProposition: string

  /**
   * Code langue ISO 639-1
   * @default "fr"
   */
  locale: string

  /**
   * Indique si ce contenu est actif (publié) ou en brouillon
   * @default true
   */
  isActive: boolean

  /**
   * Métadonnées SEO optionnelles
   */
  metadata?: HeroMetadata

  /**
   * Date de dernière modification
   * Utilisée pour le cache busting et l'affichage
   */
  updatedAt: Date
}

/**
 * Type pour la création d'un HeroContent (champs optionnels avec défauts)
 */
export type HeroContentInput = Omit<HeroContent, 'locale' | 'isActive' | 'updatedAt'> & {
  locale?: string
  isActive?: boolean
  updatedAt?: Date
}

/**
 * Type pour la mise à jour partielle d'un HeroContent
 */
export type HeroContentUpdate = Partial<Omit<HeroContent, 'id'>>
```

### 4.2 Schéma Zod (Content Collection)

```typescript
// src/content/config.ts

import { defineCollection, z } from 'astro:content'

/**
 * Schéma de validation pour les métadonnées SEO
 */
const heroMetadataSchema = z.object({
  seoTitle: z
    .string()
    .max(60, 'Le titre SEO ne doit pas dépasser 60 caractères')
    .optional(),
  seoDescription: z
    .string()
    .max(160, 'La meta description ne doit pas dépasser 160 caractères')
    .optional(),
})

/**
 * Schéma de validation pour HeroContent
 * Inclut les règles métier R1-R3
 */
export const heroContentSchema = z.object({
  id: z
    .string()
    .min(3, 'L\'ID doit contenir au moins 3 caractères')
    .max(50, 'L\'ID ne doit pas dépasser 50 caractères')
    .regex(/^[a-z0-9-]+$/, 'L\'ID ne doit contenir que des minuscules, chiffres et tirets'),

  title: z
    .string()
    .min(10, 'Le titre doit contenir au moins 10 caractères')
    .max(80, 'Le titre ne doit pas dépasser 80 caractères')
    .refine(
      (val) => val.includes('AIAD'),
      'Le titre doit contenir "AIAD" (règle R1)'
    ),

  tagline: z
    .string()
    .min(10, 'La tagline doit contenir au moins 10 caractères')
    .max(120, 'La tagline ne doit pas dépasser 120 caractères'),

  valueProposition: z
    .string()
    .min(20, 'La proposition de valeur doit contenir au moins 20 caractères')
    .max(200, 'La proposition de valeur ne doit pas dépasser 200 caractères')
    .refine(
      (val) => val.trim().endsWith('.'),
      'La proposition de valeur doit se terminer par un point (règle R3)'
    ),

  locale: z
    .string()
    .length(2, 'Le code langue doit contenir exactement 2 caractères')
    .default('fr'),

  isActive: z
    .boolean()
    .default(true),

  metadata: heroMetadataSchema.optional(),

  updatedAt: z
    .string()
    .datetime()
    .transform((val) => new Date(val)),
})

/**
 * Raffinement inter-champs : tagline ne doit pas répéter title (règle R2)
 */
export const heroContentSchemaWithRefinements = heroContentSchema.refine(
  (data) => {
    const titleWords = new Set(data.title.toLowerCase().split(/\s+/))
    const taglineWords = data.tagline.toLowerCase().split(/\s+/)
    const overlap = taglineWords.filter((w) => titleWords.has(w) && w.length > 3)
    return overlap.length < taglineWords.length * 0.5
  },
  {
    message: 'La tagline ne doit pas trop répéter le titre (règle R2)',
    path: ['tagline'],
  }
)

/**
 * Collection Content pour les hero contents
 */
const heroCollection = defineCollection({
  type: 'data',
  schema: heroContentSchemaWithRefinements,
})

export const collections = {
  hero: heroCollection,
  // ... autres collections existantes
}
```

### 4.3 Export barrel

```typescript
// src/types/index.ts

export type {
  HeroContent,
  HeroContentInput,
  HeroContentUpdate,
  HeroMetadata,
} from './hero'
```

---

## 5. Cas limites et gestion d'erreurs

### 5.1 Cas limites identifiés

| ID | Cas limite | Comportement attendu | Test |
|----|------------|---------------------|------|
| CL-01 | Titre exactement 80 caractères | ✅ Accepté | T-01 |
| CL-02 | Titre de 81 caractères | ❌ Rejeté avec message | T-02 |
| CL-03 | Titre sans "AIAD" | ❌ Rejeté (règle R1) | T-03 |
| CL-04 | Tagline identique au titre | ❌ Rejeté (règle R2) | T-04 |
| CL-05 | ValueProposition sans point final | ❌ Rejeté (règle R3) | T-05 |
| CL-06 | ID avec majuscules | ❌ Rejeté (pattern) | T-06 |
| CL-07 | ID avec espaces | ❌ Rejeté (pattern) | T-07 |
| CL-08 | Locale "fra" (3 chars) | ❌ Rejeté (length !== 2) | T-08 |
| CL-09 | updatedAt invalide | ❌ Rejeté (format ISO) | T-09 |
| CL-10 | Champs avec espaces en début/fin | ⚠️ Accepté (trim au render) | T-10 |
| CL-11 | Caractères spéciaux dans title | ✅ Accepté (UTF-8) | T-11 |
| CL-12 | Emoji dans tagline | ✅ Accepté (compte comme chars) | T-12 |
| CL-13 | HTML dans valueProposition | ⚠️ Accepté mais échappé au render | T-13 |

### 5.2 Messages d'erreur

```typescript
// Messages d'erreur standardisés
export const HERO_CONTENT_ERRORS = {
  TITLE_TOO_SHORT: 'Le titre doit contenir au moins 10 caractères',
  TITLE_TOO_LONG: 'Le titre ne doit pas dépasser 80 caractères',
  TITLE_MISSING_AIAD: 'Le titre doit contenir "AIAD" pour la cohérence branding',
  TAGLINE_TOO_SHORT: 'La tagline doit contenir au moins 10 caractères',
  TAGLINE_TOO_LONG: 'La tagline ne doit pas dépasser 120 caractères',
  TAGLINE_REPEATS_TITLE: 'La tagline ne doit pas répéter le contenu du titre',
  VALUE_PROP_TOO_SHORT: 'La proposition de valeur doit contenir au moins 20 caractères',
  VALUE_PROP_TOO_LONG: 'La proposition de valeur ne doit pas dépasser 200 caractères',
  VALUE_PROP_NO_PERIOD: 'La proposition de valeur doit se terminer par un point',
  ID_INVALID_FORMAT: "L'ID ne doit contenir que des minuscules, chiffres et tirets",
  LOCALE_INVALID: 'Le code langue doit contenir exactement 2 caractères',
  DATE_INVALID: 'La date doit être au format ISO 8601',
} as const
```

---

## 6. Exemples entrée/sortie

### 6.1 Entrée valide

```json
{
  "id": "hero-main-fr",
  "title": "AIAD : Le framework pour développer avec des agents IA",
  "tagline": "Structurez votre collaboration avec l'intelligence artificielle",
  "valueProposition": "Une méthodologie éprouvée pour intégrer les agents IA dans votre workflow de développement et multiplier votre productivité.",
  "locale": "fr",
  "isActive": true,
  "metadata": {
    "seoTitle": "AIAD Framework - Développement avec agents IA",
    "seoDescription": "Découvrez AIAD, le framework de référence pour structurer votre collaboration avec les agents IA de codage."
  },
  "updatedAt": "2026-01-26T10:00:00.000Z"
}
```

**Sortie :** ✅ Validation réussie, objet `HeroContent` typé retourné

### 6.2 Entrée invalide - Titre sans AIAD

```json
{
  "id": "hero-test",
  "title": "Le framework pour développer avec des agents IA",
  "tagline": "Structurez votre collaboration",
  "valueProposition": "Une méthodologie éprouvée.",
  "updatedAt": "2026-01-26T10:00:00.000Z"
}
```

**Sortie :**
```typescript
{
  success: false,
  error: {
    issues: [{
      code: 'custom',
      message: 'Le titre doit contenir "AIAD" (règle R1)',
      path: ['title']
    }]
  }
}
```

### 6.3 Entrée invalide - Multiple erreurs

```json
{
  "id": "Hero Main",
  "title": "Court",
  "tagline": "OK tagline valide ici",
  "valueProposition": "Sans point final",
  "updatedAt": "invalid-date"
}
```

**Sortie :**
```typescript
{
  success: false,
  error: {
    issues: [
      { path: ['id'], message: "L'ID ne doit contenir que des minuscules, chiffres et tirets" },
      { path: ['title'], message: 'Le titre doit contenir au moins 10 caractères' },
      { path: ['title'], message: 'Le titre doit contenir "AIAD" (règle R1)' },
      { path: ['valueProposition'], message: 'La proposition de valeur doit se terminer par un point (règle R3)' },
      { path: ['updatedAt'], message: 'Invalid datetime' }
    ]
  }
}
```

---

## 7. Tests

### 7.1 Fichier de test

**Emplacement :** `tests/unit/schemas/hero-content.test.ts`

### 7.2 Suite de tests

```typescript
// tests/unit/schemas/hero-content.test.ts

import { describe, it, expect } from 'vitest'
import { heroContentSchema, heroContentSchemaWithRefinements } from '@/content/config'

describe('HeroContent Schema', () => {
  // Fixture de base valide
  const validHeroContent = {
    id: 'hero-main-fr',
    title: 'AIAD : Le framework pour développer avec des agents IA',
    tagline: 'Structurez votre collaboration avec l\'intelligence artificielle',
    valueProposition: 'Une méthodologie éprouvée pour intégrer les agents IA.',
    locale: 'fr',
    isActive: true,
    updatedAt: '2026-01-26T10:00:00.000Z',
  }

  describe('Validation basique', () => {
    it('T-00: should validate a correct HeroContent', () => {
      const result = heroContentSchemaWithRefinements.safeParse(validHeroContent)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe('hero-main-fr')
        expect(result.data.updatedAt).toBeInstanceOf(Date)
      }
    })

    it('T-00b: should apply default values', () => {
      const minimal = {
        id: 'hero-test',
        title: 'AIAD : Titre de test valide',
        tagline: 'Une tagline suffisamment longue',
        valueProposition: 'Une proposition de valeur complète et bien formulée.',
        updatedAt: '2026-01-26T10:00:00.000Z',
      }

      const result = heroContentSchema.safeParse(minimal)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.locale).toBe('fr')
        expect(result.data.isActive).toBe(true)
      }
    })
  })

  describe('Validation du champ id', () => {
    it('T-06: should reject id with uppercase letters', () => {
      const invalid = { ...validHeroContent, id: 'Hero-Main' }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('id')
    })

    it('T-07: should reject id with spaces', () => {
      const invalid = { ...validHeroContent, id: 'hero main' }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should reject id shorter than 3 characters', () => {
      const invalid = { ...validHeroContent, id: 'ab' }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('3 caractères')
    })
  })

  describe('Validation du champ title', () => {
    it('T-01: should accept title with exactly 80 characters', () => {
      const title80 = 'AIAD : ' + 'A'.repeat(73) // Exactement 80
      const valid = { ...validHeroContent, title: title80 }
      const result = heroContentSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('T-02: should reject title exceeding 80 characters', () => {
      const title81 = 'AIAD : ' + 'A'.repeat(74) // 81 caractères
      const invalid = { ...validHeroContent, title: title81 }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('80 caractères')
    })

    it('T-03: should reject title without AIAD (règle R1)', () => {
      const invalid = {
        ...validHeroContent,
        title: 'Le framework pour développer avec des agents IA'
      }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('AIAD')
    })

    it('should reject title shorter than 10 characters', () => {
      const invalid = { ...validHeroContent, title: 'AIAD' }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-11: should accept special characters in title', () => {
      const valid = {
        ...validHeroContent,
        title: 'AIAD : Développez avec l\'IA — rapidement & efficacement'
      }
      const result = heroContentSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ tagline', () => {
    it('T-04: should reject tagline that repeats title (règle R2)', () => {
      const invalid = {
        ...validHeroContent,
        title: 'AIAD : Le framework pour les agents IA',
        tagline: 'Le framework pour les agents IA en entreprise'
      }
      const result = heroContentSchemaWithRefinements.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('tagline')
    })

    it('should reject tagline exceeding 120 characters', () => {
      const tagline121 = 'A'.repeat(121)
      const invalid = { ...validHeroContent, tagline: tagline121 }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-12: should accept emoji in tagline', () => {
      const valid = {
        ...validHeroContent,
        tagline: 'Boostez votre productivité avec l\'IA 🚀'
      }
      const result = heroContentSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ valueProposition', () => {
    it('T-05: should reject valueProposition without ending period (règle R3)', () => {
      const invalid = {
        ...validHeroContent,
        valueProposition: 'Une méthodologie sans point final'
      }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('point')
    })

    it('should accept valueProposition ending with period', () => {
      const valid = {
        ...validHeroContent,
        valueProposition: 'Une proposition complète qui se termine correctement.'
      }
      const result = heroContentSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('T-13: should accept HTML in valueProposition (escaped at render)', () => {
      const valid = {
        ...validHeroContent,
        valueProposition: 'Une <strong>méthodologie</strong> avec du HTML.'
      }
      const result = heroContentSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ locale', () => {
    it('T-08: should reject locale with 3 characters', () => {
      const invalid = { ...validHeroContent, locale: 'fra' }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('2 caractères')
    })

    it('should accept valid 2-letter locale', () => {
      const valid = { ...validHeroContent, locale: 'en' }
      const result = heroContentSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ updatedAt', () => {
    it('T-09: should reject invalid date format', () => {
      const invalid = { ...validHeroContent, updatedAt: 'invalid-date' }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should transform valid ISO string to Date object', () => {
      const result = heroContentSchema.safeParse(validHeroContent)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.updatedAt).toBeInstanceOf(Date)
        expect(result.data.updatedAt.toISOString()).toBe('2026-01-26T10:00:00.000Z')
      }
    })
  })

  describe('Validation du champ metadata', () => {
    it('should accept valid metadata', () => {
      const valid = {
        ...validHeroContent,
        metadata: {
          seoTitle: 'AIAD - Framework IA',
          seoDescription: 'Description SEO courte.',
        },
      }
      const result = heroContentSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('should reject seoTitle exceeding 60 characters', () => {
      const invalid = {
        ...validHeroContent,
        metadata: {
          seoTitle: 'A'.repeat(61),
        },
      }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should reject seoDescription exceeding 160 characters', () => {
      const invalid = {
        ...validHeroContent,
        metadata: {
          seoDescription: 'A'.repeat(161),
        },
      }
      const result = heroContentSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })
  })
})
```

### 7.3 Matrice de couverture

| Champ | Cas valide | Cas invalide | Cas limite | Couverture |
|-------|------------|--------------|------------|------------|
| `id` | ✅ | ✅ (3 tests) | ✅ | 100% |
| `title` | ✅ | ✅ (3 tests) | ✅ (80 chars) | 100% |
| `tagline` | ✅ | ✅ (2 tests) | ✅ (emoji) | 100% |
| `valueProposition` | ✅ | ✅ (2 tests) | ✅ (HTML) | 100% |
| `locale` | ✅ | ✅ | - | 100% |
| `isActive` | ✅ (défaut) | - | - | 100% |
| `metadata` | ✅ | ✅ (2 tests) | - | 100% |
| `updatedAt` | ✅ | ✅ | ✅ (transform) | 100% |

---

## 8. Critères d'acceptation

- [ ] **CA-01** : L'interface `HeroContent` est créée dans `src/types/hero.ts`
- [ ] **CA-02** : Les types auxiliaires (`HeroContentInput`, `HeroContentUpdate`, `HeroMetadata`) sont définis
- [ ] **CA-03** : Le schéma Zod est intégré dans `src/content/config.ts`
- [ ] **CA-04** : Les règles métier R1-R3 sont implémentées avec messages d'erreur explicites
- [ ] **CA-05** : Les types sont exportés via `src/types/index.ts`
- [ ] **CA-06** : La documentation JSDoc est présente sur chaque champ et type
- [ ] **CA-07** : Tous les tests passent (`pnpm test:unit -- hero-content`)
- [ ] **CA-08** : Couverture de tests ≥ 90% sur les fichiers créés

---

## 9. Definition of Done

- [ ] Code implémenté selon les spécifications
- [ ] Tests unitaires écrits et passants
- [ ] TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] ESLint passe sans warning (`pnpm lint`)
- [ ] Code reviewé par un pair
- [ ] Documentation à jour

---

## 10. Références

| Document | Lien |
|----------|------|
| User Story US-001 | [PRD.md#us-001](../PRD.md#us-001--comprendre-aiad-rapidement) |
| Architecture | [ARCHITECTURE.md](../ARCHITECTURE.md) |
| Zod Documentation | [zod.dev](https://zod.dev/) |
| Astro Content Collections | [docs.astro.build](https://docs.astro.build/en/guides/content-collections/) |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 2.0 | 26/01/2026 | Refonte complète : cas limites, tests détaillés, règles métier |
| 1.0 | 26/01/2026 | Version initiale |
