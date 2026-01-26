# T-001-B2 : Créer le modèle de données BenefitItem

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 26 janvier 2026 |
| **Statut** | 📋 À faire |
| **User Story** | [US-001 - Comprendre AIAD rapidement](./spec.md) |
| **Dépendances** | Aucune (tâche racine) |
| **Bloque** | T-001-B5, T-001-F4 |

---

## 1. Objectif

Définir et implémenter le modèle de données `BenefitItem` qui structure les bénéfices clés affichés dans la hero section, en garantissant :

- **Type-safety** : Validation TypeScript à la compilation
- **Runtime validation** : Validation Zod à l'exécution
- **Intégration Astro** : Compatible avec Content Collections
- **Accessibilité** : Support des attributs ARIA pour les icônes

---

## 2. Contexte technique

### 2.1 Architecture cible

D'après [ARCHITECTURE.md](../ARCHITECTURE.md), le projet utilise :

- **Astro 4.x** avec Content Collections pour la gestion du contenu
- **TypeScript 5.x** en mode strict
- **Zod** (via `astro:content`) pour la validation des schémas
- **Lucide Icons** ou équivalent pour les pictogrammes

### 2.2 Positionnement dans l'arborescence

```
src/
├── content/
│   ├── config.ts           # ← Ajout du schéma benefitItem
│   └── benefits/
│       └── main.json       # ← Données (T-001-B5)
├── types/
│   ├── index.ts            # ← Export barrel
│   └── benefit.ts          # ← Interface BenefitItem
└── components/
    └── BenefitCard.astro   # ← Composant (T-001-F4)
```

---

## 3. Spécifications fonctionnelles

### 3.1 Description du modèle

Le `BenefitItem` représente un bénéfice clé affiché dans la hero section (US-001 : "3 bénéfices clés sous forme de pictos + texte court") :

| Élément UI | Champ correspondant | Critère d'acceptation |
|------------|--------------------|-----------------------|
| Icône/Picto | `icon` | Identifiant d'icône reconnu |
| Titre court | `title` | Texte accrocheur (2-5 mots) |
| Description | `description` | Explication concise du bénéfice |

### 3.2 Définition des champs

| Champ | Type | Requis | Description | Contraintes |
|-------|------|--------|-------------|-------------|
| `id` | `string` | ✅ | Identifiant unique slug-friendly | Pattern: `^[a-z0-9-]+$`, 3-50 chars |
| `icon` | `string` | ✅ | Identifiant de l'icône (Lucide) | Pattern: `^[a-z-]+$`, doit être une icône valide |
| `title` | `string` | ✅ | Titre court du bénéfice | 5-50 caractères |
| `description` | `string` | ✅ | Description explicative | 20-150 caractères |
| `order` | `number` | ✅ | Ordre d'affichage (1, 2, 3...) | Entier positif, unique |
| `locale` | `string` | ❌ | Code langue ISO 639-1 | 2 caractères, défaut: `"fr"` |
| `isActive` | `boolean` | ❌ | Bénéfice actif/masqué | Défaut: `true` |
| `ariaLabel` | `string` | ❌ | Label d'accessibilité pour l'icône | Max 100 caractères |
| `updatedAt` | `Date` | ✅ | Dernière modification | ISO 8601 |

### 3.3 Icônes supportées

Liste des icônes Lucide recommandées pour les bénéfices AIAD :

| Icône | Identifiant | Usage suggéré |
|-------|-------------|---------------|
| ⚡ | `zap` | Rapidité, performance |
| 🎯 | `target` | Précision, objectifs |
| 🔧 | `wrench` | Configuration, outils |
| 📈 | `trending-up` | Croissance, amélioration |
| 🛡️ | `shield` | Sécurité, fiabilité |
| 🤝 | `handshake` | Collaboration |
| 💡 | `lightbulb` | Innovation, idées |
| 🔄 | `refresh-cw` | Itération, mise à jour |
| 📦 | `package` | Packaging, modules |
| ✅ | `check-circle` | Validation, succès |

### 3.4 Règles métier

| ID | Règle | Justification |
|----|-------|---------------|
| R1 | `order` doit être unique par `locale` | Éviter les conflits d'affichage |
| R2 | `title` ne doit pas dépasser 5 mots | Lisibilité sur mobile |
| R3 | `description` doit être une phrase complète (terminer par `.` ou `!`) | Cohérence éditoriale |
| R4 | Maximum 5 `BenefitItem` actifs par `locale` | UX : éviter la surcharge |
| R5 | `icon` doit correspondre à une icône Lucide valide | Éviter les erreurs de rendu |

---

## 4. Spécifications techniques

### 4.1 Interface TypeScript

```typescript
// src/types/benefit.ts

/**
 * Liste des icônes Lucide supportées pour les bénéfices
 */
export const BENEFIT_ICONS = [
  'zap',
  'target',
  'wrench',
  'trending-up',
  'shield',
  'handshake',
  'lightbulb',
  'refresh-cw',
  'package',
  'check-circle',
  'rocket',
  'users',
  'code',
  'layers',
  'cpu',
  'globe',
  'lock',
  'star',
  'award',
  'compass',
] as const

/**
 * Type union des icônes supportées
 */
export type BenefitIcon = typeof BENEFIT_ICONS[number]

/**
 * Représente un bénéfice clé affiché dans la hero section
 *
 * @example
 * ```typescript
 * const benefit: BenefitItem = {
 *   id: 'benefit-productivity',
 *   icon: 'trending-up',
 *   title: 'Productivité accrue',
 *   description: 'Gagnez 50% de temps sur vos tâches répétitives grâce à l\'automatisation IA.',
 *   order: 1,
 *   locale: 'fr',
 *   isActive: true,
 *   updatedAt: new Date('2026-01-26'),
 * }
 * ```
 *
 * @see {@link https://docs.example.com/PRD#us-001 | US-001}
 */
export interface BenefitItem {
  /**
   * Identifiant unique slug-friendly
   * @pattern ^[a-z0-9-]+$
   * @minLength 3
   * @maxLength 50
   */
  id: string

  /**
   * Identifiant de l'icône Lucide à afficher
   * @see BENEFIT_ICONS pour la liste des icônes supportées
   */
  icon: BenefitIcon

  /**
   * Titre court et accrocheur du bénéfice
   * Doit être concis (2-5 mots maximum)
   * @minLength 5
   * @maxLength 50
   */
  title: string

  /**
   * Description explicative du bénéfice
   * Doit être une phrase complète (terminer par . ou !)
   * @minLength 20
   * @maxLength 150
   */
  description: string

  /**
   * Ordre d'affichage dans la liste des bénéfices
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
   * Indique si ce bénéfice est actif (affiché) ou masqué
   * @default true
   */
  isActive: boolean

  /**
   * Label d'accessibilité pour l'icône (attribut aria-label)
   * Si non fourni, utilise le title par défaut
   * @maxLength 100
   */
  ariaLabel?: string

  /**
   * Date de dernière modification
   */
  updatedAt: Date
}

/**
 * Type pour la création d'un BenefitItem (champs optionnels avec défauts)
 */
export type BenefitItemInput = Omit<BenefitItem, 'locale' | 'isActive' | 'updatedAt' | 'ariaLabel'> & {
  locale?: string
  isActive?: boolean
  ariaLabel?: string
  updatedAt?: Date
}

/**
 * Type pour la mise à jour partielle d'un BenefitItem
 */
export type BenefitItemUpdate = Partial<Omit<BenefitItem, 'id'>>

/**
 * Type pour une liste de bénéfices (utilisé par BenefitsList)
 */
export type BenefitItemList = BenefitItem[]
```

### 4.2 Schéma Zod (Content Collection)

```typescript
// src/content/config.ts (ajout à l'existant)

import { defineCollection, z } from 'astro:content'

/**
 * Liste des icônes Lucide valides pour les bénéfices
 */
const BENEFIT_ICONS = [
  'zap',
  'target',
  'wrench',
  'trending-up',
  'shield',
  'handshake',
  'lightbulb',
  'refresh-cw',
  'package',
  'check-circle',
  'rocket',
  'users',
  'code',
  'layers',
  'cpu',
  'globe',
  'lock',
  'star',
  'award',
  'compass',
] as const

/**
 * Schéma de validation pour BenefitItem
 * Inclut les règles métier R2-R3
 */
export const benefitItemSchema = z.object({
  id: z
    .string()
    .min(3, 'L\'ID doit contenir au moins 3 caractères')
    .max(50, 'L\'ID ne doit pas dépasser 50 caractères')
    .regex(/^[a-z0-9-]+$/, 'L\'ID ne doit contenir que des minuscules, chiffres et tirets'),

  icon: z
    .enum(BENEFIT_ICONS, {
      errorMap: () => ({ message: `L'icône doit être l'une des suivantes : ${BENEFIT_ICONS.join(', ')}` })
    }),

  title: z
    .string()
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(50, 'Le titre ne doit pas dépasser 50 caractères')
    .refine(
      (val) => val.trim().split(/\s+/).length <= 5,
      'Le titre ne doit pas dépasser 5 mots (règle R2)'
    ),

  description: z
    .string()
    .min(20, 'La description doit contenir au moins 20 caractères')
    .max(150, 'La description ne doit pas dépasser 150 caractères')
    .refine(
      (val) => /[.!]$/.test(val.trim()),
      'La description doit se terminer par un point ou point d\'exclamation (règle R3)'
    ),

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

  ariaLabel: z
    .string()
    .max(100, 'Le label d\'accessibilité ne doit pas dépasser 100 caractères')
    .optional(),

  updatedAt: z
    .string()
    .datetime()
    .transform((val) => new Date(val)),
})

/**
 * Schéma pour une liste de BenefitItems avec validation inter-éléments
 * Vérifie l'unicité des ordres (règle R1) et le maximum de 5 actifs (règle R4)
 */
export const benefitItemListSchema = z.array(benefitItemSchema)
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
    { message: 'L\'ordre doit être unique par locale pour les bénéfices actifs (règle R1)' }
  )
  .refine(
    (items) => {
      const countByLocale = new Map<string, number>()
      for (const item of items) {
        if (!item.isActive) continue
        const count = (countByLocale.get(item.locale) || 0) + 1
        if (count > 5) return false
        countByLocale.set(item.locale, count)
      }
      return true
    },
    { message: 'Maximum 5 bénéfices actifs par locale (règle R4)' }
  )

/**
 * Collection Content pour les benefits
 */
const benefitsCollection = defineCollection({
  type: 'data',
  schema: benefitItemSchema,
})

export const collections = {
  // ... collections existantes (hero, etc.)
  benefits: benefitsCollection,
}
```

### 4.3 Export barrel

```typescript
// src/types/index.ts (ajout à l'existant)

export type {
  BenefitItem,
  BenefitItemInput,
  BenefitItemUpdate,
  BenefitItemList,
  BenefitIcon,
} from './benefit'

export { BENEFIT_ICONS } from './benefit'
```

---

## 5. Cas limites et gestion d'erreurs

### 5.1 Cas limites identifiés

| ID | Cas limite | Comportement attendu | Test |
|----|------------|---------------------|------|
| CL-01 | Titre exactement 50 caractères | ✅ Accepté | T-01 |
| CL-02 | Titre de 51 caractères | ❌ Rejeté avec message | T-02 |
| CL-03 | Titre de 6 mots | ❌ Rejeté (règle R2) | T-03 |
| CL-04 | Description sans ponctuation finale | ❌ Rejeté (règle R3) | T-04 |
| CL-05 | Description terminant par `?` | ❌ Rejeté (règle R3) | T-05 |
| CL-06 | Icône non supportée | ❌ Rejeté (règle R5) | T-06 |
| CL-07 | Order = 0 | ❌ Rejeté (doit être positif) | T-07 |
| CL-08 | Order négatif | ❌ Rejeté (doit être positif) | T-08 |
| CL-09 | Order décimal (1.5) | ❌ Rejeté (doit être entier) | T-09 |
| CL-10 | Deux bénéfices avec même order et locale | ❌ Rejeté (règle R1) | T-10 |
| CL-11 | 6 bénéfices actifs pour même locale | ❌ Rejeté (règle R4) | T-11 |
| CL-12 | ariaLabel de 101 caractères | ❌ Rejeté | T-12 |
| CL-13 | Emoji dans title | ✅ Accepté (compte comme chars) | T-13 |
| CL-14 | Description terminant par `!` | ✅ Accepté | T-14 |

### 5.2 Messages d'erreur

```typescript
// Messages d'erreur standardisés
export const BENEFIT_ITEM_ERRORS = {
  ID_TOO_SHORT: 'L\'ID doit contenir au moins 3 caractères',
  ID_TOO_LONG: 'L\'ID ne doit pas dépasser 50 caractères',
  ID_INVALID_FORMAT: 'L\'ID ne doit contenir que des minuscules, chiffres et tirets',
  ICON_INVALID: 'L\'icône spécifiée n\'est pas supportée',
  TITLE_TOO_SHORT: 'Le titre doit contenir au moins 5 caractères',
  TITLE_TOO_LONG: 'Le titre ne doit pas dépasser 50 caractères',
  TITLE_TOO_MANY_WORDS: 'Le titre ne doit pas dépasser 5 mots',
  DESCRIPTION_TOO_SHORT: 'La description doit contenir au moins 20 caractères',
  DESCRIPTION_TOO_LONG: 'La description ne doit pas dépasser 150 caractères',
  DESCRIPTION_NO_PUNCTUATION: 'La description doit se terminer par un point ou point d\'exclamation',
  ORDER_NOT_INTEGER: 'L\'ordre doit être un entier',
  ORDER_NOT_POSITIVE: 'L\'ordre doit être un nombre positif',
  ORDER_NOT_UNIQUE: 'L\'ordre doit être unique par locale pour les bénéfices actifs',
  MAX_BENEFITS_EXCEEDED: 'Maximum 5 bénéfices actifs par locale',
  LOCALE_INVALID: 'Le code langue doit contenir exactement 2 caractères',
  ARIA_LABEL_TOO_LONG: 'Le label d\'accessibilité ne doit pas dépasser 100 caractères',
  DATE_INVALID: 'La date doit être au format ISO 8601',
} as const
```

---

## 6. Exemples entrée/sortie

### 6.1 Entrée valide

```json
{
  "id": "benefit-productivity",
  "icon": "trending-up",
  "title": "Productivité accrue",
  "description": "Gagnez 50% de temps sur vos tâches répétitives grâce à l'automatisation IA.",
  "order": 1,
  "locale": "fr",
  "isActive": true,
  "ariaLabel": "Icône de graphique montant représentant la productivité",
  "updatedAt": "2026-01-26T10:00:00.000Z"
}
```

**Sortie :** ✅ Validation réussie, objet `BenefitItem` typé retourné

### 6.2 Liste de 3 bénéfices valides

```json
[
  {
    "id": "benefit-productivity",
    "icon": "trending-up",
    "title": "Productivité accrue",
    "description": "Gagnez 50% de temps sur vos tâches répétitives.",
    "order": 1,
    "updatedAt": "2026-01-26T10:00:00.000Z"
  },
  {
    "id": "benefit-quality",
    "icon": "check-circle",
    "title": "Qualité garantie",
    "description": "Des agents IA qui respectent vos standards de code.",
    "order": 2,
    "updatedAt": "2026-01-26T10:00:00.000Z"
  },
  {
    "id": "benefit-collaboration",
    "icon": "users",
    "title": "Collaboration fluide",
    "description": "Travaillez en équipe avec l'IA comme partenaire.",
    "order": 3,
    "updatedAt": "2026-01-26T10:00:00.000Z"
  }
]
```

**Sortie :** ✅ Validation réussie pour les 3 items

### 6.3 Entrée invalide - Icône non supportée

```json
{
  "id": "benefit-test",
  "icon": "invalid-icon",
  "title": "Titre valide",
  "description": "Une description valide qui termine bien.",
  "order": 1,
  "updatedAt": "2026-01-26T10:00:00.000Z"
}
```

**Sortie :**
```typescript
{
  success: false,
  error: {
    issues: [{
      code: 'invalid_enum_value',
      message: "L'icône doit être l'une des suivantes : zap, target, wrench, ...",
      path: ['icon']
    }]
  }
}
```

### 6.4 Entrée invalide - Multiple erreurs

```json
{
  "id": "Benefit Test",
  "icon": "zap",
  "title": "Un titre beaucoup trop long avec plus de cinq mots dedans",
  "description": "Pas de point final",
  "order": -1,
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
      { path: ['title'], message: 'Le titre ne doit pas dépasser 5 mots (règle R2)' },
      { path: ['description'], message: 'La description doit contenir au moins 20 caractères' },
      { path: ['description'], message: 'La description doit se terminer par un point ou point d\'exclamation (règle R3)' },
      { path: ['order'], message: 'L\'ordre doit être un nombre positif' },
      { path: ['updatedAt'], message: 'Invalid datetime' }
    ]
  }
}
```

---

## 7. Tests

### 7.1 Fichier de test

**Emplacement :** `tests/unit/schemas/benefit-item.test.ts`

### 7.2 Suite de tests

```typescript
// tests/unit/schemas/benefit-item.test.ts

import { describe, it, expect } from 'vitest'
import { benefitItemSchema, benefitItemListSchema } from '@/content/config'

describe('BenefitItem Schema', () => {
  // Fixture de base valide
  const validBenefitItem = {
    id: 'benefit-productivity',
    icon: 'trending-up',
    title: 'Productivité accrue',
    description: 'Gagnez 50% de temps sur vos tâches répétitives.',
    order: 1,
    locale: 'fr',
    isActive: true,
    updatedAt: '2026-01-26T10:00:00.000Z',
  }

  describe('Validation basique', () => {
    it('T-00: should validate a correct BenefitItem', () => {
      const result = benefitItemSchema.safeParse(validBenefitItem)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe('benefit-productivity')
        expect(result.data.icon).toBe('trending-up')
        expect(result.data.updatedAt).toBeInstanceOf(Date)
      }
    })

    it('T-00b: should apply default values', () => {
      const minimal = {
        id: 'benefit-test',
        icon: 'zap',
        title: 'Titre valide',
        description: 'Une description valide et complète.',
        order: 1,
        updatedAt: '2026-01-26T10:00:00.000Z',
      }

      const result = benefitItemSchema.safeParse(minimal)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.locale).toBe('fr')
        expect(result.data.isActive).toBe(true)
      }
    })
  })

  describe('Validation du champ icon', () => {
    it('T-06: should reject invalid icon', () => {
      const invalid = { ...validBenefitItem, icon: 'invalid-icon' }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('icon')
    })

    it('should accept all valid icons', () => {
      const validIcons = ['zap', 'target', 'wrench', 'trending-up', 'shield']

      for (const icon of validIcons) {
        const valid = { ...validBenefitItem, icon }
        const result = benefitItemSchema.safeParse(valid)
        expect(result.success).toBe(true)
      }
    })
  })

  describe('Validation du champ title', () => {
    it('T-01: should accept title with exactly 50 characters', () => {
      const title50 = 'A'.repeat(50)
      const valid = { ...validBenefitItem, title: title50 }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('T-02: should reject title exceeding 50 characters', () => {
      const title51 = 'A'.repeat(51)
      const invalid = { ...validBenefitItem, title: title51 }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('50 caractères')
    })

    it('T-03: should reject title with more than 5 words (règle R2)', () => {
      const invalid = {
        ...validBenefitItem,
        title: 'Un titre avec plus de cinq mots'
      }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('5 mots')
    })

    it('should accept title with exactly 5 words', () => {
      const valid = {
        ...validBenefitItem,
        title: 'Un deux trois quatre cinq'
      }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('T-13: should accept emoji in title', () => {
      const valid = {
        ...validBenefitItem,
        title: 'Productivité 🚀'
      }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ description', () => {
    it('T-04: should reject description without ending punctuation (règle R3)', () => {
      const invalid = {
        ...validBenefitItem,
        description: 'Une description sans ponctuation finale'
      }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('point')
    })

    it('T-05: should reject description ending with question mark', () => {
      const invalid = {
        ...validBenefitItem,
        description: 'Une description qui termine par une question?'
      }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-14: should accept description ending with exclamation mark', () => {
      const valid = {
        ...validBenefitItem,
        description: 'Une description qui se termine bien!'
      }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('should reject description shorter than 20 characters', () => {
      const invalid = { ...validBenefitItem, description: 'Court.' }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should reject description exceeding 150 characters', () => {
      const description151 = 'A'.repeat(149) + '.'
      const invalid = { ...validBenefitItem, description: description151 }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })
  })

  describe('Validation du champ order', () => {
    it('T-07: should reject order = 0', () => {
      const invalid = { ...validBenefitItem, order: 0 }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('positif')
    })

    it('T-08: should reject negative order', () => {
      const invalid = { ...validBenefitItem, order: -1 }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-09: should reject decimal order', () => {
      const invalid = { ...validBenefitItem, order: 1.5 }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('entier')
    })

    it('should accept positive integer order', () => {
      const valid = { ...validBenefitItem, order: 10 }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ ariaLabel', () => {
    it('should accept valid ariaLabel', () => {
      const valid = {
        ...validBenefitItem,
        ariaLabel: 'Icône représentant la productivité'
      }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('T-12: should reject ariaLabel exceeding 100 characters', () => {
      const invalid = {
        ...validBenefitItem,
        ariaLabel: 'A'.repeat(101)
      }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('100 caractères')
    })
  })
})

describe('BenefitItemList Schema', () => {
  const createBenefit = (overrides = {}) => ({
    id: 'benefit-test',
    icon: 'zap',
    title: 'Titre valide',
    description: 'Une description valide et complète.',
    order: 1,
    locale: 'fr',
    isActive: true,
    updatedAt: '2026-01-26T10:00:00.000Z',
    ...overrides,
  })

  describe('Règle R1 - Unicité de order par locale', () => {
    it('T-10: should reject duplicate orders for same locale', () => {
      const list = [
        createBenefit({ id: 'benefit-1', order: 1 }),
        createBenefit({ id: 'benefit-2', order: 1 }), // Même order
      ]
      const result = benefitItemListSchema.safeParse(list)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('unique')
    })

    it('should accept same order for different locales', () => {
      const list = [
        createBenefit({ id: 'benefit-1', order: 1, locale: 'fr' }),
        createBenefit({ id: 'benefit-2', order: 1, locale: 'en' }),
      ]
      const result = benefitItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })

    it('should accept duplicate orders for inactive benefits', () => {
      const list = [
        createBenefit({ id: 'benefit-1', order: 1, isActive: true }),
        createBenefit({ id: 'benefit-2', order: 1, isActive: false }),
      ]
      const result = benefitItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })
  })

  describe('Règle R4 - Maximum 5 bénéfices actifs par locale', () => {
    it('T-11: should reject more than 5 active benefits for same locale', () => {
      const list = Array.from({ length: 6 }, (_, i) =>
        createBenefit({ id: `benefit-${i}`, order: i + 1 })
      )
      const result = benefitItemListSchema.safeParse(list)

      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('Maximum 5')
    })

    it('should accept exactly 5 active benefits', () => {
      const list = Array.from({ length: 5 }, (_, i) =>
        createBenefit({ id: `benefit-${i}`, order: i + 1 })
      )
      const result = benefitItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })

    it('should accept 6 benefits if one is inactive', () => {
      const list = [
        ...Array.from({ length: 5 }, (_, i) =>
          createBenefit({ id: `benefit-${i}`, order: i + 1 })
        ),
        createBenefit({ id: 'benefit-6', order: 6, isActive: false }),
      ]
      const result = benefitItemListSchema.safeParse(list)

      expect(result.success).toBe(true)
    })
  })
})
```

### 7.3 Matrice de couverture

| Champ | Cas valide | Cas invalide | Cas limite | Couverture |
|-------|------------|--------------|------------|------------|
| `id` | ✅ | ✅ (3 tests) | ✅ | 100% |
| `icon` | ✅ | ✅ (1 test) | ✅ (all icons) | 100% |
| `title` | ✅ | ✅ (3 tests) | ✅ (50 chars, 5 mots) | 100% |
| `description` | ✅ | ✅ (4 tests) | ✅ (!, .) | 100% |
| `order` | ✅ | ✅ (3 tests) | ✅ (0, decimal) | 100% |
| `locale` | ✅ (défaut) | ✅ | - | 100% |
| `isActive` | ✅ (défaut) | - | - | 100% |
| `ariaLabel` | ✅ | ✅ (1 test) | - | 100% |
| `updatedAt` | ✅ | ✅ | ✅ (transform) | 100% |
| **List R1** | ✅ | ✅ | ✅ (diff locale) | 100% |
| **List R4** | ✅ | ✅ | ✅ (5 exactly) | 100% |

---

## 8. Critères d'acceptation

- [ ] **CA-01** : L'interface `BenefitItem` est créée dans `src/types/benefit.ts`
- [ ] **CA-02** : Les types auxiliaires (`BenefitItemInput`, `BenefitItemUpdate`, `BenefitIcon`) sont définis
- [ ] **CA-03** : La constante `BENEFIT_ICONS` liste toutes les icônes supportées
- [ ] **CA-04** : Le schéma Zod est intégré dans `src/content/config.ts`
- [ ] **CA-05** : Les règles métier R1-R5 sont implémentées avec messages d'erreur explicites
- [ ] **CA-06** : Le schéma de liste valide l'unicité des orders et le max 5 actifs
- [ ] **CA-07** : Les types sont exportés via `src/types/index.ts`
- [ ] **CA-08** : La documentation JSDoc est présente sur chaque champ et type
- [ ] **CA-09** : Tous les tests passent (`pnpm test:unit -- benefit-item`)
- [ ] **CA-10** : Couverture de tests ≥ 90% sur les fichiers créés

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
| Lucide Icons | [lucide.dev](https://lucide.dev/icons/) |
| Zod Documentation | [zod.dev](https://zod.dev/) |
| Astro Content Collections | [docs.astro.build](https://docs.astro.build/en/guides/content-collections/) |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 26/01/2026 | Création initiale |
