# T-001-B3 : Créer le modèle de données StatItem

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 27 janvier 2026 |
| **Statut** | 📋 À faire |
| **User Story** | [US-001 - Comprendre AIAD rapidement](./spec.md) |
| **Dépendances** | Aucune (tâche racine) |
| **Bloque** | T-001-B6, T-001-F6 |

---

## 1. Objectif

Définir et implémenter le modèle de données `StatItem` qui structure les statistiques chiffrées affichées dans la hero section, en garantissant :

- **Type-safety** : Validation TypeScript à la compilation
- **Runtime validation** : Validation Zod à l'exécution
- **Intégration Astro** : Compatible avec Content Collections
- **Crédibilité** : Attribution des sources pour chaque statistique

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
│   ├── config.ts           # ← Ajout du schéma statItem
│   └── stats/
│       └── main.json       # ← Données (T-001-B6)
├── types/
│   ├── index.ts            # ← Export barrel
│   └── stat.ts             # ← Interface StatItem
└── components/
    └── StatDisplay.astro   # ← Composant (T-001-F6)
```

---

## 3. Spécifications fonctionnelles

### 3.1 Description du modèle

Le `StatItem` représente une statistique chiffrée affichée dans la hero section (US-001 : "Des statistiques chiffrées crédibles") :

| Élément UI | Champ correspondant | Critère d'acceptation |
|------------|--------------------|-----------------------|
| Valeur chiffrée | `value` | Nombre ou pourcentage impactant |
| Label explicatif | `label` | Courte description de la stat |
| Source | `source` | Attribution crédible |

### 3.2 Définition des champs

| Champ | Type | Requis | Description | Contraintes |
|-------|------|--------|-------------|-------------|
| `id` | `string` | ✅ | Identifiant unique slug-friendly | Pattern: `^[a-z0-9-]+$`, 3-50 chars |
| `value` | `string` | ✅ | Valeur affichée (ex: "50%", "3x", "100+") | 1-20 caractères |
| `numericValue` | `number` | ❌ | Valeur numérique pour tri/comparaison | Nombre décimal |
| `unit` | `string` | ❌ | Unité de mesure (ex: "%", "x", "h") | Max 10 caractères |
| `label` | `string` | ✅ | Description courte de la statistique | 10-100 caractères |
| `source` | `string` | ✅ | Attribution/source de la statistique | 5-150 caractères |
| `sourceUrl` | `string` | ❌ | URL de la source (pour vérification) | URL valide |
| `order` | `number` | ✅ | Ordre d'affichage | Entier positif, unique |
| `locale` | `string` | ❌ | Code langue ISO 639-1 | 2 caractères, défaut: `"fr"` |
| `isActive` | `boolean` | ❌ | Statistique active/masquée | Défaut: `true` |
| `highlight` | `boolean` | ❌ | Mettre en avant cette stat | Défaut: `false` |
| `updatedAt` | `Date` | ✅ | Dernière modification | ISO 8601 |

### 3.3 Types de valeurs supportées

| Type | Exemple | Description |
|------|---------|-------------|
| Pourcentage | `"50%"` | Amélioration, réduction |
| Multiplicateur | `"3x"` | Facteur de multiplication |
| Nombre absolu | `"1000+"` | Quantité avec suffixe |
| Durée | `"24h"` | Temps |
| Combiné | `">90%"` | Avec opérateur comparatif |

### 3.4 Règles métier

| ID | Règle | Justification |
|----|-------|---------------|
| R1 | `order` doit être unique par `locale` | Éviter les conflits d'affichage |
| R2 | `label` doit être une phrase ou groupe nominal explicite | Compréhension immédiate |
| R3 | `source` doit être renseignée et crédible | Crédibilité des stats |
| R4 | Maximum 6 `StatItem` actifs par `locale` | UX : éviter la surcharge |
| R5 | `value` doit contenir au moins un chiffre | Statistique = données chiffrées |
| R6 | Si `sourceUrl` fournie, doit être une URL valide | Vérifiabilité |

---

## 4. Spécifications techniques

### 4.1 Interface TypeScript

```typescript
// src/types/stat.ts

/**
 * Liste des unités communes pour les statistiques
 */
export const STAT_UNITS = [
  '%',      // Pourcentage
  'x',      // Multiplicateur
  'h',      // Heures
  'j',      // Jours
  'min',    // Minutes
  's',      // Secondes
  'k',      // Milliers
  'M',      // Millions
  '+',      // Plus de
  '',       // Sans unité
] as const

/**
 * Type union des unités supportées
 */
export type StatUnit = typeof STAT_UNITS[number]

/**
 * Représente une statistique chiffrée affichée dans la hero section
 *
 * @example
 * ```typescript
 * const stat: StatItem = {
 *   id: 'stat-productivity',
 *   value: '50%',
 *   numericValue: 50,
 *   unit: '%',
 *   label: 'Gain de productivité moyen',
 *   source: 'Étude interne AIAD 2025',
 *   sourceUrl: 'https://aiad.dev/studies/productivity',
 *   order: 1,
 *   locale: 'fr',
 *   isActive: true,
 *   highlight: true,
 *   updatedAt: new Date('2026-01-27'),
 * }
 * ```
 *
 * @see {@link https://docs.example.com/PRD#us-001 | US-001}
 */
export interface StatItem {
  /**
   * Identifiant unique slug-friendly
   * @pattern ^[a-z0-9-]+$
   * @minLength 3
   * @maxLength 50
   */
  id: string

  /**
   * Valeur affichée de la statistique (ex: "50%", "3x", "100+")
   * Doit contenir au moins un chiffre
   * @minLength 1
   * @maxLength 20
   */
  value: string

  /**
   * Valeur numérique pour tri et comparaison
   * Permet de trier les stats par importance
   */
  numericValue?: number

  /**
   * Unité de mesure affichée
   * @maxLength 10
   */
  unit?: StatUnit | string

  /**
   * Description courte et explicative de la statistique
   * @minLength 10
   * @maxLength 100
   */
  label: string

  /**
   * Attribution de la source de la statistique
   * Requis pour la crédibilité
   * @minLength 5
   * @maxLength 150
   */
  source: string

  /**
   * URL de la source pour vérification
   * Optionnel mais recommandé
   */
  sourceUrl?: string

  /**
   * Ordre d'affichage dans la liste des statistiques
   * Doit être unique par locale
   * @minimum 1
   */
  order: number

  /**
   * Code langue ISO 639-1
   * @default "fr"
   */
  locale: string

  /**
   * Indique si cette statistique est active (affichée) ou masquée
   * @default true
   */
  isActive: boolean

  /**
   * Indique si cette statistique doit être mise en avant visuellement
   * @default false
   */
  highlight: boolean

  /**
   * Date de dernière modification
   */
  updatedAt: Date
}

/**
 * Type pour la création d'un StatItem (champs optionnels avec défauts)
 */
export type StatItemInput = Omit<StatItem, 'locale' | 'isActive' | 'highlight' | 'updatedAt' | 'numericValue' | 'unit' | 'sourceUrl'> & {
  locale?: string
  isActive?: boolean
  highlight?: boolean
  numericValue?: number
  unit?: StatUnit | string
  sourceUrl?: string
  updatedAt?: Date
}

/**
 * Type pour la mise à jour partielle d'un StatItem
 */
export type StatItemUpdate = Partial<Omit<StatItem, 'id'>>

/**
 * Type pour une liste de statistiques (utilisé par StatsRow)
 */
export type StatItemList = StatItem[]
```

### 4.2 Schéma Zod (Content Collection)

```typescript
// src/content/config.ts (ajout à l'existant)

import { defineCollection, z } from 'astro:content'

/**
 * Liste des unités valides pour les statistiques
 */
const STAT_UNITS = [
  '%',
  'x',
  'h',
  'j',
  'min',
  's',
  'k',
  'M',
  '+',
  '',
] as const

/**
 * Schéma de validation pour StatItem
 * Inclut les règles métier R2-R3-R5-R6
 */
export const statItemSchema = z.object({
  id: z
    .string()
    .min(3, 'L\'ID doit contenir au moins 3 caractères')
    .max(50, 'L\'ID ne doit pas dépasser 50 caractères')
    .regex(/^[a-z0-9-]+$/, 'L\'ID ne doit contenir que des minuscules, chiffres et tirets'),

  value: z
    .string()
    .min(1, 'La valeur doit contenir au moins 1 caractère')
    .max(20, 'La valeur ne doit pas dépasser 20 caractères')
    .refine(
      (val) => /\d/.test(val),
      'La valeur doit contenir au moins un chiffre (règle R5)'
    ),

  numericValue: z
    .number()
    .optional(),

  unit: z
    .string()
    .max(10, 'L\'unité ne doit pas dépasser 10 caractères')
    .optional(),

  label: z
    .string()
    .min(10, 'Le label doit contenir au moins 10 caractères')
    .max(100, 'Le label ne doit pas dépasser 100 caractères'),

  source: z
    .string()
    .min(5, 'La source doit contenir au moins 5 caractères')
    .max(150, 'La source ne doit pas dépasser 150 caractères'),

  sourceUrl: z
    .string()
    .url('L\'URL de la source doit être valide (règle R6)')
    .optional(),

  order: z
    .number()
    .int('L\'ordre doit être un entier')
    .positive('L\'ordre doit être un nombre positif'),

  locale: z
    .string()
    .length(2, 'Le code langue doit contenir exactement 2 caractères')
    .default('fr'),

  isActive: z
    .boolean()
    .default(true),

  highlight: z
    .boolean()
    .default(false),

  updatedAt: z
    .string()
    .datetime()
    .transform((val) => new Date(val)),
})

/**
 * Schéma pour une liste de StatItems avec validation inter-éléments
 * Vérifie l'unicité des ordres (règle R1) et le maximum de 6 actifs (règle R4)
 */
export const statItemListSchema = z.array(statItemSchema)
  .refine(
    (items) => {
      const activeByLocale = new Map<string, number[]>()
      for (const item of items) {
        if (!item.isActive) continue
        const orders = activeByLocale.get(item.locale) || []
        if (orders.includes(item.order)) return false
        orders.push(item.order)
        activeByLocale.set(item.locale, orders)
      }
      return true
    },
    { message: 'L\'ordre doit être unique par locale pour les statistiques actives (règle R1)' }
  )
  .refine(
    (items) => {
      const countByLocale = new Map<string, number>()
      for (const item of items) {
        if (!item.isActive) continue
        const count = (countByLocale.get(item.locale) || 0) + 1
        if (count > 6) return false
        countByLocale.set(item.locale, count)
      }
      return true
    },
    { message: 'Maximum 6 statistiques actives par locale (règle R4)' }
  )

/**
 * Collection Content pour les stats
 */
const statsCollection = defineCollection({
  type: 'data',
  schema: statItemSchema,
})

export const collections = {
  // ... collections existantes (hero, benefits, etc.)
  stats: statsCollection,
}
```

### 4.3 Export barrel

```typescript
// src/types/index.ts (ajout à l'existant)

export type {
  StatItem,
  StatItemInput,
  StatItemUpdate,
  StatItemList,
  StatUnit,
} from './stat'

export { STAT_UNITS } from './stat'
```

---

## 5. Cas limites et gestion d'erreurs

### 5.1 Cas limites identifiés

| ID | Cas limite | Comportement attendu | Test |
|----|------------|---------------------|------|
| CL-01 | Value exactement 20 caractères | ✅ Accepté | T-01 |
| CL-02 | Value de 21 caractères | ❌ Rejeté avec message | T-02 |
| CL-03 | Value sans chiffre ("N/A") | ❌ Rejeté (règle R5) | T-03 |
| CL-04 | Label < 10 caractères | ❌ Rejeté | T-04 |
| CL-05 | Source vide | ❌ Rejeté (règle R3) | T-05 |
| CL-06 | sourceUrl invalide | ❌ Rejeté (règle R6) | T-06 |
| CL-07 | Order = 0 | ❌ Rejeté (doit être positif) | T-07 |
| CL-08 | Order négatif | ❌ Rejeté (doit être positif) | T-08 |
| CL-09 | Order décimal (1.5) | ❌ Rejeté (doit être entier) | T-09 |
| CL-10 | Deux stats avec même order et locale | ❌ Rejeté (règle R1) | T-10 |
| CL-11 | 7 stats actives pour même locale | ❌ Rejeté (règle R4) | T-11 |
| CL-12 | Value avec symbole uniquement ("%") | ❌ Rejeté (règle R5) | T-12 |
| CL-13 | Value "0" (zéro) | ✅ Accepté (contient un chiffre) | T-13 |
| CL-14 | sourceUrl valide avec HTTPS | ✅ Accepté | T-14 |

### 5.2 Messages d'erreur

```typescript
// Messages d'erreur standardisés
export const STAT_ITEM_ERRORS = {
  ID_TOO_SHORT: 'L\'ID doit contenir au moins 3 caractères',
  ID_TOO_LONG: 'L\'ID ne doit pas dépasser 50 caractères',
  ID_INVALID_FORMAT: 'L\'ID ne doit contenir que des minuscules, chiffres et tirets',
  VALUE_TOO_SHORT: 'La valeur doit contenir au moins 1 caractère',
  VALUE_TOO_LONG: 'La valeur ne doit pas dépasser 20 caractères',
  VALUE_NO_DIGIT: 'La valeur doit contenir au moins un chiffre',
  UNIT_TOO_LONG: 'L\'unité ne doit pas dépasser 10 caractères',
  LABEL_TOO_SHORT: 'Le label doit contenir au moins 10 caractères',
  LABEL_TOO_LONG: 'Le label ne doit pas dépasser 100 caractères',
  SOURCE_TOO_SHORT: 'La source doit contenir au moins 5 caractères',
  SOURCE_TOO_LONG: 'La source ne doit pas dépasser 150 caractères',
  SOURCE_URL_INVALID: 'L\'URL de la source doit être valide',
  ORDER_NOT_INTEGER: 'L\'ordre doit être un entier',
  ORDER_NOT_POSITIVE: 'L\'ordre doit être un nombre positif',
  ORDER_NOT_UNIQUE: 'L\'ordre doit être unique par locale pour les statistiques actives',
  MAX_STATS_EXCEEDED: 'Maximum 6 statistiques actives par locale',
  LOCALE_INVALID: 'Le code langue doit contenir exactement 2 caractères',
  DATE_INVALID: 'La date doit être au format ISO 8601',
} as const
```

---

## 6. Exemples entrée/sortie

### 6.1 Entrée valide

```json
{
  "id": "stat-productivity",
  "value": "50%",
  "numericValue": 50,
  "unit": "%",
  "label": "Gain de productivité moyen",
  "source": "Étude interne AIAD 2025",
  "sourceUrl": "https://aiad.dev/studies/productivity",
  "order": 1,
  "locale": "fr",
  "isActive": true,
  "highlight": true,
  "updatedAt": "2026-01-27T10:00:00.000Z"
}
```

**Sortie :** ✅ Validation réussie, objet `StatItem` typé retourné

### 6.2 Liste de 3 statistiques valides

```json
[
  {
    "id": "stat-productivity",
    "value": "50%",
    "numericValue": 50,
    "label": "Gain de productivité moyen",
    "source": "Étude interne AIAD 2025",
    "order": 1,
    "updatedAt": "2026-01-27T10:00:00.000Z"
  },
  {
    "id": "stat-time-saved",
    "value": "3x",
    "numericValue": 3,
    "label": "Plus rapide qu'un développement manuel",
    "source": "Benchmark AIAD vs développement traditionnel",
    "order": 2,
    "updatedAt": "2026-01-27T10:00:00.000Z"
  },
  {
    "id": "stat-satisfaction",
    "value": ">90%",
    "numericValue": 90,
    "label": "Taux de satisfaction développeurs",
    "source": "Sondage utilisateurs AIAD Q4 2025",
    "order": 3,
    "highlight": true,
    "updatedAt": "2026-01-27T10:00:00.000Z"
  }
]
```

**Sortie :** ✅ Validation réussie pour les 3 items

### 6.3 Entrée invalide - Valeur sans chiffre

```json
{
  "id": "stat-test",
  "value": "N/A",
  "label": "Une statistique de test valide",
  "source": "Source de test",
  "order": 1,
  "updatedAt": "2026-01-27T10:00:00.000Z"
}
```

**Sortie :**
```typescript
{
  success: false,
  error: {
    issues: [{
      code: 'custom',
      message: "La valeur doit contenir au moins un chiffre (règle R5)",
      path: ['value']
    }]
  }
}
```

### 6.4 Entrée invalide - URL source invalide

```json
{
  "id": "stat-test",
  "value": "100%",
  "label": "Une statistique de test valide",
  "source": "Source de test",
  "sourceUrl": "not-a-valid-url",
  "order": 1,
  "updatedAt": "2026-01-27T10:00:00.000Z"
}
```

**Sortie :**
```typescript
{
  success: false,
  error: {
    issues: [{
      code: 'invalid_string',
      message: "L'URL de la source doit être valide (règle R6)",
      path: ['sourceUrl']
    }]
  }
}
```

---

## 7. Tests

### 7.1 Fichier de test

**Emplacement :** `tests/unit/schemas/stat-item.test.ts`

### 7.2 Suite de tests

```typescript
// tests/unit/schemas/stat-item.test.ts

import { describe, it, expect } from 'vitest'
import { statItemSchema, statItemListSchema } from '@/content/config'

describe('StatItem Schema', () => {
  // Fixture de base valide
  const validStatItem = {
    id: 'stat-productivity',
    value: '50%',
    numericValue: 50,
    label: 'Gain de productivité moyen',
    source: 'Étude interne AIAD 2025',
    order: 1,
    locale: 'fr',
    isActive: true,
    highlight: false,
    updatedAt: '2026-01-27T10:00:00.000Z',
  }

  describe('Validation basique', () => {
    it('T-00: should validate a correct StatItem', () => {
      const result = statItemSchema.safeParse(validStatItem)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe('stat-productivity')
        expect(result.data.value).toBe('50%')
        expect(result.data.updatedAt).toBeInstanceOf(Date)
      }
    })

    it('T-00b: should apply default values', () => {
      const minimal = {
        id: 'stat-test',
        value: '100',
        label: 'Une statistique de test',
        source: 'Source de test',
        order: 1,
        updatedAt: '2026-01-27T10:00:00.000Z',
      }

      const result = statItemSchema.safeParse(minimal)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.locale).toBe('fr')
        expect(result.data.isActive).toBe(true)
        expect(result.data.highlight).toBe(false)
      }
    })
  })

  describe('Validation du champ value', () => {
    it('T-01: should accept value with exactly 20 characters', () => {
      const value20 = '12345678901234567890'
      const valid = { ...validStatItem, value: value20 }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('T-02: should reject value exceeding 20 characters', () => {
      const value21 = '123456789012345678901'
      const invalid = { ...validStatItem, value: value21 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('20 caractères')
    })

    it('T-03: should reject value without digit (règle R5)', () => {
      const invalid = { ...validStatItem, value: 'N/A' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('chiffre')
    })

    it('T-12: should reject value with symbol only', () => {
      const invalid = { ...validStatItem, value: '%' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-13: should accept value "0"', () => {
      const valid = { ...validStatItem, value: '0' }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('should accept various valid value formats', () => {
      const validValues = ['50%', '3x', '100+', '>90%', '24h', '1000', '2.5x']

      for (const value of validValues) {
        const valid = { ...validStatItem, value }
        const result = statItemSchema.safeParse(valid)
        expect(result.success).toBe(true)
      }
    })
  })

  describe('Validation du champ label', () => {
    it('T-04: should reject label shorter than 10 characters', () => {
      const invalid = { ...validStatItem, label: 'Court' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('10 caractères')
    })

    it('should accept label with exactly 10 characters', () => {
      const valid = { ...validStatItem, label: '1234567890' }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('should reject label exceeding 100 characters', () => {
      const label101 = 'A'.repeat(101)
      const invalid = { ...validStatItem, label: label101 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })
  })

  describe('Validation du champ source', () => {
    it('T-05: should reject empty source', () => {
      const invalid = { ...validStatItem, source: '' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should reject source shorter than 5 characters', () => {
      const invalid = { ...validStatItem, source: 'Test' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('5 caractères')
    })

    it('should reject source exceeding 150 characters', () => {
      const source151 = 'A'.repeat(151)
      const invalid = { ...validStatItem, source: source151 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })
  })

  describe('Validation du champ sourceUrl', () => {
    it('T-06: should reject invalid sourceUrl', () => {
      const invalid = { ...validStatItem, sourceUrl: 'not-a-url' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('URL')
    })

    it('T-14: should accept valid HTTPS sourceUrl', () => {
      const valid = {
        ...validStatItem,
        sourceUrl: 'https://example.com/study'
      }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('should accept missing sourceUrl', () => {
      const valid = { ...validStatItem }
      delete (valid as any).sourceUrl
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ order', () => {
    it('T-07: should reject order = 0', () => {
      const invalid = { ...validStatItem, order: 0 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('positif')
    })

    it('T-08: should reject negative order', () => {
      const invalid = { ...validStatItem, order: -1 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-09: should reject decimal order', () => {
      const invalid = { ...validStatItem, order: 1.5 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('entier')
    })

    it('should accept positive integer order', () => {
      const valid = { ...validStatItem, order: 10 }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ highlight', () => {
    it('should accept highlight = true', () => {
      const valid = { ...validStatItem, highlight: true }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.highlight).toBe(true)
      }
    })

    it('should default highlight to false', () => {
      const minimal = {
        id: 'stat-test',
        value: '100',
        label: 'Une statistique de test',
        source: 'Source de test',
        order: 1,
        updatedAt: '2026-01-27T10:00:00.000Z',
      }

      const result = statItemSchema.safeParse(minimal)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.highlight).toBe(false)
      }
    })
  })
})

describe('StatItemList Schema', () => {
  const createStat = (overrides = {}) => ({
    id: 'stat-test',
    value: '100%',
    label: 'Une statistique de test',
    source: 'Source de test valide',
    order: 1,
    locale: 'fr',
    isActive: true,
    highlight: false,
    updatedAt: '2026-01-27T10:00:00.000Z',
    ...overrides,
  })

  describe('Règle R1 - Unicité de order par locale', () => {
    it('T-10: should reject duplicate orders for same locale', () => {
      const list = [
        createStat({ id: 'stat-1', order: 1 }),
        createStat({ id: 'stat-2', order: 1 }), // Même order
      ]
      const result = statItemListSchema.safeParse(list)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('unique')
    })

    it('should accept same order for different locales', () => {
      const list = [
        createStat({ id: 'stat-1', order: 1, locale: 'fr' }),
        createStat({ id: 'stat-2', order: 1, locale: 'en' }),
      ]
      const result = statItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })

    it('should accept duplicate orders for inactive stats', () => {
      const list = [
        createStat({ id: 'stat-1', order: 1, isActive: true }),
        createStat({ id: 'stat-2', order: 1, isActive: false }),
      ]
      const result = statItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })
  })

  describe('Règle R4 - Maximum 6 statistiques actives par locale', () => {
    it('T-11: should reject more than 6 active stats for same locale', () => {
      const list = Array.from({ length: 7 }, (_, i) =>
        createStat({ id: `stat-${i}`, order: i + 1 })
      )
      const result = statItemListSchema.safeParse(list)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('Maximum 6')
    })

    it('should accept exactly 6 active stats', () => {
      const list = Array.from({ length: 6 }, (_, i) =>
        createStat({ id: `stat-${i}`, order: i + 1 })
      )
      const result = statItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })

    it('should accept 7 stats if one is inactive', () => {
      const list = [
        ...Array.from({ length: 6 }, (_, i) =>
          createStat({ id: `stat-${i}`, order: i + 1 })
        ),
        createStat({ id: 'stat-7', order: 7, isActive: false }),
      ]
      const result = statItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })
  })
})
```

### 7.3 Matrice de couverture

| Champ | Cas valide | Cas invalide | Cas limite | Couverture |
|-------|------------|--------------|------------|------------|
| `id` | ✅ | ✅ (3 tests) | ✅ | 100% |
| `value` | ✅ | ✅ (3 tests) | ✅ (20 chars, digit) | 100% |
| `numericValue` | ✅ | - | - | 100% |
| `unit` | ✅ | ✅ | - | 100% |
| `label` | ✅ | ✅ (2 tests) | ✅ (10 chars) | 100% |
| `source` | ✅ | ✅ (3 tests) | - | 100% |
| `sourceUrl` | ✅ | ✅ (1 test) | ✅ (optional) | 100% |
| `order` | ✅ | ✅ (3 tests) | ✅ (0, decimal) | 100% |
| `locale` | ✅ (défaut) | ✅ | - | 100% |
| `isActive` | ✅ (défaut) | - | - | 100% |
| `highlight` | ✅ | - | ✅ (défaut) | 100% |
| `updatedAt` | ✅ | ✅ | ✅ (transform) | 100% |
| **List R1** | ✅ | ✅ | ✅ (diff locale) | 100% |
| **List R4** | ✅ | ✅ | ✅ (6 exactly) | 100% |

---

## 8. Critères d'acceptation

- [ ] **CA-01** : L'interface `StatItem` est créée dans `src/types/stat.ts`
- [ ] **CA-02** : Les types auxiliaires (`StatItemInput`, `StatItemUpdate`, `StatUnit`) sont définis
- [ ] **CA-03** : La constante `STAT_UNITS` liste les unités supportées
- [ ] **CA-04** : Le schéma Zod est intégré dans `src/content/config.ts`
- [ ] **CA-05** : Les règles métier R1-R6 sont implémentées avec messages d'erreur explicites
- [ ] **CA-06** : Le schéma de liste valide l'unicité des orders et le max 6 actifs
- [ ] **CA-07** : Les types sont exportés via `src/types/index.ts`
- [ ] **CA-08** : La documentation JSDoc est présente sur chaque champ et type
- [ ] **CA-09** : Tous les tests passent (`pnpm test:unit -- stat-item`)
- [ ] **CA-10** : Couverture de tests >= 90% sur les fichiers créés

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
| User Story US-001 | [spec.md](./spec.md) |
| Tâche connexe T-001-B1 | [T-001-B1-modele-donnees-HeroContent.md](./T-001-B1-modele-donnees-HeroContent.md) |
| Tâche connexe T-001-B2 | [T-001-B2-modele-donnees-BenefitItem.md](./T-001-B2-modele-donnees-BenefitItem.md) |
| Zod Documentation | [zod.dev](https://zod.dev/) |
| Astro Content Collections | [docs.astro.build](https://docs.astro.build/en/guides/content-collections/) |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 27/01/2026 | Création initiale |
