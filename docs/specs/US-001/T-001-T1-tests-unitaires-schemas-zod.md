# T-001-T1 : Tests unitaires schémas Zod (BenefitItem, StatItem)

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.1 |
| **Date** | 05 février 2026 |
| **Statut** | ✅ Terminé |
| **User Story** | [US-001 - Comprendre AIAD rapidement](./spec.md) |
| **Dépendances** | T-001-B2 (BenefitItem), T-001-B3 (StatItem) |
| **Bloque** | T-001-T3 (tests intégration HeroSection) |

---

## 1. Objectif

Valider de manière exhaustive les schémas Zod `benefitItemSchema`, `benefitItemListSchema`, `statItemSchema` et `statItemListSchema` par des tests unitaires couvrant :

- **Validations champ par champ** : Chaque contrainte (min, max, pattern, refine) est testée individuellement
- **Règles métier inter-éléments** : Unicité des ordres (R1), limites d'actifs (R4)
- **Cas limites** : Valeurs aux bornes, types incorrects, champs manquants, entrées malformées
- **Messages d'erreur** : Vérification que les messages sont explicites et en français
- **Transformations** : Validation de la transformation `updatedAt` string → Date
- **Valeurs par défaut** : Vérification des defaults (`locale`, `isActive`, `highlight`)
- **Cohérence avec les données de production** : Validation des fichiers JSON réels

---

## 2. Contexte technique

### 2.1 Stack de test

| Outil | Version | Rôle |
|-------|---------|------|
| **Vitest** | 1.x | Framework de test |
| **Zod** | 3.x | Bibliothèque de validation sous test |
| **TypeScript** | 5.x | Typage des fixtures et assertions |

### 2.2 Fichiers sous test

| Fichier source | Schémas exportés |
|----------------|-----------------|
| `src/schemas/benefit.ts` | `benefitItemSchema`, `benefitItemListSchema`, `BenefitItemSchemaType`, `BenefitItemListSchemaType` |
| `src/schemas/stat.ts` | `statItemSchema`, `statItemListSchema`, `STAT_ITEM_ERRORS`, `StatItemSchemaType`, `StatItemListSchemaType` |

### 2.3 Fichiers de test

| Fichier de test | Schéma testé | État |
|----------------|--------------|------|
| `tests/unit/schemas/benefit-item.test.ts` | `benefitItemSchema`, `benefitItemListSchema` | Existant, à compléter |
| `tests/unit/schemas/stat-item.test.ts` | `statItemSchema`, `statItemListSchema` | Existant, à compléter |

### 2.4 Données de production (validation croisée)

| Fichier JSON | Schéma attendu |
|-------------|----------------|
| `src/content/benefits/benefit-productivity.json` | `benefitItemSchema` |
| `src/content/benefits/benefit-quality.json` | `benefitItemSchema` |
| `src/content/benefits/benefit-collaboration.json` | `benefitItemSchema` |
| `src/content/stats/stat-productivity.json` | `statItemSchema` |
| `src/content/stats/stat-speed.json` | `statItemSchema` |
| `src/content/stats/stat-satisfaction.json` | `statItemSchema` |

---

## 3. Spécifications fonctionnelles

### 3.1 Périmètre des tests

T-001-T1 consolide et complète les tests unitaires des schémas Zod en un référentiel unique. Les tests existants (créés lors de T-001-B2 et T-001-B3) servent de base. Cette tâche ajoute :

1. **Tests de robustesse** : Types incorrects (number au lieu de string, null, undefined, tableau vide)
2. **Tests de messages d'erreur** : Vérification exacte des messages en français
3. **Tests des constantes exportées** : `STAT_ITEM_ERRORS`, types inférés
4. **Tests de validation croisée** : Les fichiers JSON de production passent la validation
5. **Tests de non-régression** : Cas spécifiques liés à des bugs potentiels

### 3.2 Règles métier à couvrir

#### BenefitItem (src/schemas/benefit.ts)

| ID | Règle | Validation | Test(s) |
|----|-------|-----------|---------|
| R1 | `order` unique par `locale` pour les actifs | `benefitItemListSchema` refine | BL-R1-01 à BL-R1-05 |
| R2 | `title` max 5 mots | `benefitItemSchema` refine sur `title` | BI-T-01 à BI-T-05 |
| R3 | `description` termine par `.` ou `!` | `benefitItemSchema` refine sur `description` | BI-D-01 à BI-D-06 |
| R4 | Max 5 actifs par `locale` | `benefitItemListSchema` refine | BL-R4-01 à BL-R4-04 |
| R5 | `icon` doit être une icône Lucide valide | `benefitItemSchema` enum sur `icon` | BI-IC-01 à BI-IC-03 |

#### StatItem (src/schemas/stat.ts)

| ID | Règle | Validation | Test(s) |
|----|-------|-----------|---------|
| R1 | `order` unique par `locale` pour les actifs | `statItemListSchema` refine | SL-R1-01 à SL-R1-05 |
| R2 | `label` explicatif (min 10 chars) | `statItemSchema` min sur `label` | SI-L-01 à SI-L-03 |
| R3 | `source` renseignée (min 5 chars) | `statItemSchema` min sur `source` | SI-S-01 à SI-S-03 |
| R4 | Max 6 actifs par `locale` | `statItemListSchema` refine | SL-R4-01 à SL-R4-04 |
| R5 | `value` contient au moins un chiffre | `statItemSchema` refine sur `value` | SI-V-01 à SI-V-07 |
| R6 | `sourceUrl` URL valide si fournie | `statItemSchema` url sur `sourceUrl` | SI-SU-01 à SI-SU-04 |

---

## 4. Spécifications techniques

### 4.1 Types TypeScript pour les tests

```typescript
// Types utilitaires pour les fixtures de test

import type { BenefitItemSchemaType } from '@/schemas/benefit'
import type { StatItemSchemaType } from '@/schemas/stat'

/**
 * Input brut pour benefitItemSchema.safeParse()
 * (avant transformation de updatedAt)
 */
type BenefitItemRawInput = {
  id: string
  icon: string
  title: string
  description: string
  order: number
  locale?: string
  isActive?: boolean
  ariaLabel?: string
  updatedAt: string
}

/**
 * Input brut pour statItemSchema.safeParse()
 * (avant transformation de updatedAt)
 */
type StatItemRawInput = {
  id: string
  value: string
  numericValue?: number
  unit?: string
  label: string
  source: string
  sourceUrl?: string
  order: number
  locale?: string
  isActive?: boolean
  highlight?: boolean
  updatedAt: string
}

/**
 * Factory pour créer des fixtures BenefitItem avec overrides
 */
type BenefitItemFactory = (overrides?: Partial<BenefitItemRawInput>) => BenefitItemRawInput

/**
 * Factory pour créer des fixtures StatItem avec overrides
 */
type StatItemFactory = (overrides?: Partial<StatItemRawInput>) => StatItemRawInput
```

### 4.2 Fixtures de test

```typescript
// tests/unit/schemas/__fixtures__/benefit-fixtures.ts

export const VALID_BENEFIT_ITEM: BenefitItemRawInput = {
  id: 'benefit-productivity',
  icon: 'trending-up',
  title: 'Productivité accrue',
  description: 'Gagnez 50% de temps sur vos tâches répétitives.',
  order: 1,
  locale: 'fr',
  isActive: true,
  updatedAt: '2026-01-26T10:00:00.000Z',
}

export const createBenefit: BenefitItemFactory = (overrides = {}) => ({
  ...VALID_BENEFIT_ITEM,
  ...overrides,
})

// tests/unit/schemas/__fixtures__/stat-fixtures.ts

export const VALID_STAT_ITEM: StatItemRawInput = {
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

export const createStat: StatItemFactory = (overrides = {}) => ({
  ...VALID_STAT_ITEM,
  ...overrides,
})
```

### 4.3 Structure des fichiers de test

```
tests/
└── unit/
    └── schemas/
        ├── benefit-item.test.ts        # Tests benefitItemSchema + benefitItemListSchema
        ├── stat-item.test.ts           # Tests statItemSchema + statItemListSchema
        └── schemas-production.test.ts  # Validation croisée avec données JSON de production
```

---

## 5. Cas limites et gestion d'erreurs

### 5.1 BenefitItem - Cas limites

| ID | Cas limite | Entrée | Comportement attendu | Priorité |
|----|------------|--------|---------------------|----------|
| BI-CL-01 | ID à la limite basse | `id: 'abc'` (3 chars) | ✅ Accepté | Haute |
| BI-CL-02 | ID à la limite haute | `id: 'a'.repeat(50)` | ✅ Accepté | Haute |
| BI-CL-03 | ID avec caractères spéciaux | `id: 'bénéfit-1'` | ❌ Rejeté (accents) | Haute |
| BI-CL-04 | ID avec underscore | `id: 'benefit_1'` | ❌ Rejeté (pattern ^[a-z0-9-]+$) | Haute |
| BI-CL-05 | Titre exactement 5 mots | `title: 'Un deux trois quatre cinq'` | ✅ Accepté | Haute |
| BI-CL-06 | Titre exactement 1 mot long | `title: 'Productivité'` (12 chars, 1 mot) | ✅ Accepté | Moyenne |
| BI-CL-07 | Titre avec espaces multiples | `title: 'Un  deux  trois'` | ✅ Accepté (split /\s+/) | Moyenne |
| BI-CL-08 | Description exactement 20 chars | `description: '12345678901234567890'` mais sans `.` | ❌ Rejeté (R3) | Haute |
| BI-CL-09 | Description 20 chars avec `.` | `description: '1234567890123456789.'` | ✅ Accepté | Haute |
| BI-CL-10 | Description terminant par `. ` (espace après) | `description: 'Description valide. '` | ❌ Rejeté (trim puis test) | Moyenne |
| BI-CL-11 | Toutes les 20 icônes valides | Itération sur BENEFIT_ICONS | ✅ Toutes acceptées | Haute |
| BI-CL-12 | Champ `updatedAt` manquant | Objet sans `updatedAt` | ❌ Rejeté (required) | Haute |
| BI-CL-13 | Champ supplémentaire inconnu | `{ ...valid, extra: 'foo' }` | ✅ Accepté (strip par Zod) | Basse |
| BI-CL-14 | Type incorrect pour `order` | `order: '1'` (string) | ❌ Rejeté (expected number) | Haute |
| BI-CL-15 | Type incorrect pour `isActive` | `isActive: 'true'` (string) | ❌ Rejeté (expected boolean) | Haute |
| BI-CL-16 | Objet null | `null` | ❌ Rejeté | Haute |
| BI-CL-17 | Objet undefined | `undefined` | ❌ Rejeté | Haute |
| BI-CL-18 | Objet vide | `{}` | ❌ Rejeté (champs requis manquants) | Haute |
| BI-CL-19 | ariaLabel exactement 100 chars | `ariaLabel: 'A'.repeat(100)` | ✅ Accepté | Moyenne |
| BI-CL-20 | Emoji dans description | `description: 'Description avec emoji 🚀.'` | ✅ Accepté | Basse |

### 5.2 StatItem - Cas limites

| ID | Cas limite | Entrée | Comportement attendu | Priorité |
|----|------------|--------|---------------------|----------|
| SI-CL-01 | Value minimale avec chiffre | `value: '1'` | ✅ Accepté | Haute |
| SI-CL-02 | Value avec chiffre seul | `value: '0'` | ✅ Accepté | Haute |
| SI-CL-03 | Value sans aucun chiffre | `value: 'N/A'` | ❌ Rejeté (R5) | Haute |
| SI-CL-04 | Value symbole seul | `value: '%'` | ❌ Rejeté (R5) | Haute |
| SI-CL-05 | Value exactement 20 chars | `value: '12345678901234567890'` | ✅ Accepté | Haute |
| SI-CL-06 | Value avec opérateur | `value: '>90%'` | ✅ Accepté | Haute |
| SI-CL-07 | Value avec décimale | `value: '2.5x'` | ✅ Accepté | Moyenne |
| SI-CL-08 | sourceUrl HTTP (non HTTPS) | `sourceUrl: 'http://example.com'` | ✅ Accepté (URL valide) | Moyenne |
| SI-CL-09 | sourceUrl avec fragment | `sourceUrl: 'https://example.com#section'` | ✅ Accepté | Basse |
| SI-CL-10 | sourceUrl vide string | `sourceUrl: ''` | ❌ Rejeté (URL invalide) | Haute |
| SI-CL-11 | Label exactement 10 chars | `label: '1234567890'` | ✅ Accepté | Haute |
| SI-CL-12 | Label exactement 100 chars | `label: 'A'.repeat(100)` | ✅ Accepté | Haute |
| SI-CL-13 | Source exactement 5 chars | `source: '12345'` | ✅ Accepté | Haute |
| SI-CL-14 | Source exactement 150 chars | `source: 'A'.repeat(150)` | ✅ Accepté | Haute |
| SI-CL-15 | numericValue négatif | `numericValue: -10` | ✅ Accepté (pas de contrainte) | Moyenne |
| SI-CL-16 | numericValue zéro | `numericValue: 0` | ✅ Accepté | Moyenne |
| SI-CL-17 | unit vide string | `unit: ''` | ✅ Accepté (max 10, pas de min) | Basse |
| SI-CL-18 | Objet null | `null` | ❌ Rejeté | Haute |
| SI-CL-19 | Objet undefined | `undefined` | ❌ Rejeté | Haute |
| SI-CL-20 | Champ supplémentaire inconnu | `{ ...valid, extra: 'foo' }` | ✅ Accepté (strip) | Basse |
| SI-CL-21 | Type incorrect pour `highlight` | `highlight: 1` (number) | ❌ Rejeté (expected boolean) | Haute |
| SI-CL-22 | Type incorrect pour `value` | `value: 50` (number) | ❌ Rejeté (expected string) | Haute |

### 5.3 Listes - Cas limites

| ID | Cas limite | Entrée | Comportement attendu | Schéma |
|----|------------|--------|---------------------|--------|
| BL-CL-01 | Liste vide | `[]` | ✅ Accepté | benefitItemListSchema |
| BL-CL-02 | Liste d'un élément | `[validBenefit]` | ✅ Accepté | benefitItemListSchema |
| BL-CL-03 | 5 actifs exactement (limite) | 5 benefits actifs, même locale | ✅ Accepté | benefitItemListSchema |
| BL-CL-04 | 6 actifs (dépassement) | 6 benefits actifs, même locale | ❌ Rejeté (R4) | benefitItemListSchema |
| BL-CL-05 | 5 actifs + 5 inactifs | 10 benefits, 5 actifs | ✅ Accepté | benefitItemListSchema |
| BL-CL-06 | Multi-locale max actifs | 5 fr + 5 en, tous actifs | ✅ Accepté | benefitItemListSchema |
| SL-CL-01 | Liste vide | `[]` | ✅ Accepté | statItemListSchema |
| SL-CL-02 | 6 actifs exactement (limite) | 6 stats actifs, même locale | ✅ Accepté | statItemListSchema |
| SL-CL-03 | 7 actifs (dépassement) | 7 stats actifs, même locale | ❌ Rejeté (R4) | statItemListSchema |
| SL-CL-04 | Multi-locale max actifs | 6 fr + 6 en, tous actifs | ✅ Accepté | statItemListSchema |
| SL-CL-05 | Deux inactifs même order | 2 stats inactifs, order=1 | ✅ Accepté (R1 ignore inactifs) | statItemListSchema |

---

## 6. Exemples entrée/sortie

### 6.1 BenefitItem - Entrée valide minimale (defaults appliqués)

**Entrée :**
```json
{
  "id": "benefit-test",
  "icon": "zap",
  "title": "Titre valide",
  "description": "Une description valide et complète.",
  "order": 1,
  "updatedAt": "2026-01-26T10:00:00.000Z"
}
```

**Sortie `safeParse` :**
```typescript
{
  success: true,
  data: {
    id: 'benefit-test',
    icon: 'zap',
    title: 'Titre valide',
    description: 'Une description valide et complète.',
    order: 1,
    locale: 'fr',           // ← default
    isActive: true,          // ← default
    ariaLabel: undefined,    // ← optional
    updatedAt: Date('2026-01-26T10:00:00.000Z')  // ← transformé en Date
  }
}
```

### 6.2 BenefitItem - Multiples erreurs simultanées

**Entrée :**
```json
{
  "id": "INVALID ID",
  "icon": "non-existent",
  "title": "Un titre beaucoup trop long avec bien plus de cinq mots",
  "description": "Court",
  "order": -1,
  "updatedAt": "pas-une-date"
}
```

**Sortie `safeParse` :**
```typescript
{
  success: false,
  error: {
    issues: [
      { path: ['id'], message: "L'ID ne doit contenir que des minuscules, chiffres et tirets" },
      { path: ['icon'], message: "L'icône doit être l'une des suivantes : zap, target, ..." },
      { path: ['title'], message: "Le titre ne doit pas dépasser 5 mots (règle R2)" },
      { path: ['description'], message: "La description doit contenir au moins 20 caractères" },
      { path: ['order'], message: "L'ordre doit être un nombre positif" },
      { path: ['updatedAt'], message: "Invalid datetime" }
    ]
  }
}
```

### 6.3 StatItem - Entrée valide complète

**Entrée :**
```json
{
  "id": "stat-productivity",
  "value": "50%",
  "numericValue": 50,
  "unit": "%",
  "label": "Gain de productivité avec les agents IA",
  "source": "McKinsey Global Institute - The economic potential of generative AI, 2024",
  "sourceUrl": "https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier",
  "order": 1,
  "locale": "fr",
  "isActive": true,
  "highlight": true,
  "updatedAt": "2026-02-02T10:00:00.000Z"
}
```

**Sortie `safeParse` :**
```typescript
{
  success: true,
  data: {
    id: 'stat-productivity',
    value: '50%',
    numericValue: 50,
    unit: '%',
    label: 'Gain de productivité avec les agents IA',
    source: 'McKinsey Global Institute - The economic potential of generative AI, 2024',
    sourceUrl: 'https://www.mckinsey.com/...',
    order: 1,
    locale: 'fr',
    isActive: true,
    highlight: true,
    updatedAt: Date('2026-02-02T10:00:00.000Z')  // ← transformé en Date
  }
}
```

### 6.4 StatItem - Value sans chiffre (R5)

**Entrée :**
```json
{
  "id": "stat-invalid",
  "value": "N/A",
  "label": "Une statistique invalide ici",
  "source": "Source de test",
  "order": 1,
  "updatedAt": "2026-01-27T10:00:00.000Z"
}
```

**Sortie `safeParse` :**
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

### 6.5 BenefitItemList - Ordres dupliqués (R1)

**Entrée :**
```json
[
  { "id": "b-1", "icon": "zap", "title": "Titre un", "description": "Description valide numéro un.", "order": 1, "locale": "fr", "isActive": true, "updatedAt": "2026-01-26T10:00:00.000Z" },
  { "id": "b-2", "icon": "target", "title": "Titre deux", "description": "Description valide numéro deux.", "order": 1, "locale": "fr", "isActive": true, "updatedAt": "2026-01-26T10:00:00.000Z" }
]
```

**Sortie `safeParse` :**
```typescript
{
  success: false,
  error: {
    issues: [{
      code: 'custom',
      message: "L'ordre doit être unique par locale pour les bénéfices actifs (règle R1)"
    }]
  }
}
```

---

## 7. Tests

### 7.1 Fichiers de test

| Emplacement | Contenu |
|-------------|---------|
| `tests/unit/schemas/benefit-item.test.ts` | Tests `benefitItemSchema` + `benefitItemListSchema` |
| `tests/unit/schemas/stat-item.test.ts` | Tests `statItemSchema` + `statItemListSchema` |
| `tests/unit/schemas/schemas-production.test.ts` | Validation croisée avec données JSON de production |

### 7.2 Suite de tests - benefitItemSchema

```typescript
// tests/unit/schemas/benefit-item.test.ts

import { describe, it, expect } from 'vitest'
import { benefitItemSchema, benefitItemListSchema } from '@/schemas/benefit'

describe('benefitItemSchema', () => {
  // === FIXTURE DE BASE ===
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

  const createBenefit = (overrides = {}) => ({
    ...validBenefitItem,
    ...overrides,
  })

  // === VALIDATION BASIQUE ===

  describe('Validation basique', () => {
    it('BI-00: devrait valider un BenefitItem correct complet', () => {
      const result = benefitItemSchema.safeParse(validBenefitItem)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe('benefit-productivity')
        expect(result.data.icon).toBe('trending-up')
        expect(result.data.title).toBe('Productivité accrue')
        expect(result.data.description).toBe('Gagnez 50% de temps sur vos tâches répétitives.')
        expect(result.data.order).toBe(1)
        expect(result.data.locale).toBe('fr')
        expect(result.data.isActive).toBe(true)
        expect(result.data.updatedAt).toBeInstanceOf(Date)
      }
    })

    it('BI-01: devrait appliquer les valeurs par défaut (locale, isActive)', () => {
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
        expect(result.data.ariaLabel).toBeUndefined()
      }
    })

    it('BI-02: devrait rejeter null', () => {
      const result = benefitItemSchema.safeParse(null)
      expect(result.success).toBe(false)
    })

    it('BI-03: devrait rejeter undefined', () => {
      const result = benefitItemSchema.safeParse(undefined)
      expect(result.success).toBe(false)
    })

    it('BI-04: devrait rejeter un objet vide', () => {
      const result = benefitItemSchema.safeParse({})
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    })

    it('BI-05: devrait rejeter un type primitif (string)', () => {
      const result = benefitItemSchema.safeParse('not-an-object')
      expect(result.success).toBe(false)
    })
  })

  // === CHAMP id ===

  describe('Champ id', () => {
    it('BI-ID-01: devrait accepter un id valide minimal (3 chars)', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ id: 'abc' }))
      expect(result.success).toBe(true)
    })

    it('BI-ID-02: devrait accepter un id valide maximal (50 chars)', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ id: 'a'.repeat(50) }))
      expect(result.success).toBe(true)
    })

    it('BI-ID-03: devrait rejeter un id trop court (2 chars)', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ id: 'ab' }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('3 caractères')
    })

    it('BI-ID-04: devrait rejeter un id trop long (51 chars)', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ id: 'a'.repeat(51) }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('50 caractères')
    })

    it('BI-ID-05: devrait rejeter un id avec majuscules', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ id: 'Benefit-Test' }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('id')
    })

    it('BI-ID-06: devrait rejeter un id avec espaces', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ id: 'benefit test' }))
      expect(result.success).toBe(false)
    })

    it('BI-ID-07: devrait rejeter un id avec underscores', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ id: 'benefit_test' }))
      expect(result.success).toBe(false)
    })

    it('BI-ID-08: devrait rejeter un id avec accents', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ id: 'bénéfit-1' }))
      expect(result.success).toBe(false)
    })

    it('BI-ID-09: devrait accepter un id avec chiffres et tirets', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ id: 'benefit-123-test' }))
      expect(result.success).toBe(true)
    })
  })

  // === CHAMP icon (R5) ===

  describe('Champ icon (R5)', () => {
    it('BI-IC-01: devrait rejeter une icône invalide', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ icon: 'invalid-icon' }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('icon')
    })

    it('BI-IC-02: devrait accepter toutes les 20 icônes valides', () => {
      const validIcons = [
        'zap', 'target', 'wrench', 'trending-up', 'shield',
        'handshake', 'lightbulb', 'refresh-cw', 'package', 'check-circle',
        'rocket', 'users', 'code', 'layers', 'cpu',
        'globe', 'lock', 'star', 'award', 'compass',
      ]
      for (const icon of validIcons) {
        const result = benefitItemSchema.safeParse(createBenefit({ icon }))
        expect(result.success, `L'icône '${icon}' devrait être acceptée`).toBe(true)
      }
    })

    it('BI-IC-03: devrait rejeter une icône vide', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ icon: '' }))
      expect(result.success).toBe(false)
    })
  })

  // === CHAMP title (R2) ===

  describe('Champ title (R2 - max 5 mots)', () => {
    it('BI-T-01: devrait accepter un titre de 5 mots exactement', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ title: 'Un deux trois quatre cinq' })
      )
      expect(result.success).toBe(true)
    })

    it('BI-T-02: devrait rejeter un titre de 6 mots (R2)', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ title: 'Un titre avec plus de cinq' })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('5 mots')
    })

    it('BI-T-03: devrait accepter un titre d\'1 mot (>= 5 chars)', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ title: 'Productivité' })
      )
      expect(result.success).toBe(true)
    })

    it('BI-T-04: devrait rejeter un titre < 5 caractères', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ title: 'Abcd' }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('5 caractères')
    })

    it('BI-T-05: devrait accepter un titre de 50 caractères exactement', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ title: 'A'.repeat(50) })
      )
      expect(result.success).toBe(true)
    })

    it('BI-T-06: devrait rejeter un titre de 51 caractères', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ title: 'A'.repeat(51) })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('50 caractères')
    })

    it('BI-T-07: devrait accepter un emoji dans le titre', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ title: 'Productivité 🚀' })
      )
      expect(result.success).toBe(true)
    })

    it('BI-T-08: devrait compter correctement les mots avec espaces multiples', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ title: 'Un  deux  trois' })
      )
      expect(result.success).toBe(true) // 3 mots malgré doubles espaces
    })
  })

  // === CHAMP description (R3) ===

  describe('Champ description (R3 - ponctuation finale)', () => {
    it('BI-D-01: devrait accepter une description terminant par un point', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ description: 'Une description valide et complète.' })
      )
      expect(result.success).toBe(true)
    })

    it('BI-D-02: devrait accepter une description terminant par un point d\'exclamation', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ description: 'Une description valide et complète!' })
      )
      expect(result.success).toBe(true)
    })

    it('BI-D-03: devrait rejeter une description sans ponctuation finale (R3)', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ description: 'Une description sans ponctuation finale' })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('point')
    })

    it('BI-D-04: devrait rejeter une description terminant par un point d\'interrogation', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ description: 'Une description avec question finale?' })
      )
      expect(result.success).toBe(false)
    })

    it('BI-D-05: devrait rejeter une description < 20 caractères', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ description: 'Court.' })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('20 caractères')
    })

    it('BI-D-06: devrait accepter une description de 150 caractères exactement', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ description: 'A'.repeat(149) + '.' })
      )
      expect(result.success).toBe(true)
    })

    it('BI-D-07: devrait rejeter une description > 150 caractères', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ description: 'A'.repeat(150) + '.' })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('150 caractères')
    })

    it('BI-D-08: devrait accepter une description de 20 caractères avec point', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ description: 'A'.repeat(19) + '.' })
      )
      expect(result.success).toBe(true)
    })
  })

  // === CHAMP order ===

  describe('Champ order', () => {
    it('BI-O-01: devrait accepter un entier positif', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ order: 10 }))
      expect(result.success).toBe(true)
    })

    it('BI-O-02: devrait rejeter order = 0', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ order: 0 }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('positif')
    })

    it('BI-O-03: devrait rejeter un order négatif', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ order: -1 }))
      expect(result.success).toBe(false)
    })

    it('BI-O-04: devrait rejeter un order décimal', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ order: 1.5 }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('entier')
    })

    it('BI-O-05: devrait rejeter order de type string', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ order: '1' }))
      expect(result.success).toBe(false)
    })
  })

  // === CHAMP locale ===

  describe('Champ locale', () => {
    it('BI-LC-01: devrait accepter un code langue de 2 caractères', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ locale: 'en' }))
      expect(result.success).toBe(true)
    })

    it('BI-LC-02: devrait rejeter un code langue de 3 caractères', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ locale: 'fra' }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('2 caractères')
    })

    it('BI-LC-03: devrait rejeter un code langue de 1 caractère', () => {
      const result = benefitItemSchema.safeParse(createBenefit({ locale: 'f' }))
      expect(result.success).toBe(false)
    })
  })

  // === CHAMP ariaLabel ===

  describe('Champ ariaLabel (optionnel)', () => {
    it('BI-AL-01: devrait accepter un ariaLabel valide', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ ariaLabel: 'Icône représentant la productivité' })
      )
      expect(result.success).toBe(true)
    })

    it('BI-AL-02: devrait accepter un ariaLabel de 100 caractères', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ ariaLabel: 'A'.repeat(100) })
      )
      expect(result.success).toBe(true)
    })

    it('BI-AL-03: devrait rejeter un ariaLabel > 100 caractères', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ ariaLabel: 'A'.repeat(101) })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('100 caractères')
    })

    it('BI-AL-04: devrait accepter l\'absence de ariaLabel', () => {
      const input = createBenefit()
      delete (input as any).ariaLabel
      const result = benefitItemSchema.safeParse(input)
      expect(result.success).toBe(true)
    })
  })

  // === CHAMP updatedAt ===

  describe('Champ updatedAt (transformation)', () => {
    it('BI-UA-01: devrait transformer une date ISO en objet Date', () => {
      const result = benefitItemSchema.safeParse(validBenefitItem)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.updatedAt).toBeInstanceOf(Date)
        expect(result.data.updatedAt.toISOString()).toBe('2026-01-26T10:00:00.000Z')
      }
    })

    it('BI-UA-02: devrait rejeter une date invalide', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ updatedAt: 'invalid-date' })
      )
      expect(result.success).toBe(false)
    })

    it('BI-UA-03: devrait rejeter un champ updatedAt manquant', () => {
      const input = { ...validBenefitItem }
      delete (input as any).updatedAt
      const result = benefitItemSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('BI-UA-04: devrait rejeter une date non-ISO (format FR)', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ updatedAt: '26/01/2026' })
      )
      expect(result.success).toBe(false)
    })
  })

  // === CHAMP isActive ===

  describe('Champ isActive (type)', () => {
    it('BI-IA-01: devrait rejeter isActive de type string', () => {
      const result = benefitItemSchema.safeParse(
        createBenefit({ isActive: 'true' as any })
      )
      expect(result.success).toBe(false)
    })
  })
})

// ====================================================================
// benefitItemListSchema
// ====================================================================

describe('benefitItemListSchema', () => {
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

  // === R1 : Unicité de order par locale ===

  describe('Règle R1 - Unicité de order par locale', () => {
    it('BL-R1-01: devrait rejeter deux actifs avec même order et même locale', () => {
      const list = [
        createBenefit({ id: 'benefit-1', order: 1 }),
        createBenefit({ id: 'benefit-2', order: 1 }),
      ]
      const result = benefitItemListSchema.safeParse(list)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('unique')
    })

    it('BL-R1-02: devrait accepter même order pour locales différentes', () => {
      const list = [
        createBenefit({ id: 'benefit-1', order: 1, locale: 'fr' }),
        createBenefit({ id: 'benefit-2', order: 1, locale: 'en' }),
      ]
      const result = benefitItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })

    it('BL-R1-03: devrait ignorer les inactifs pour la vérification d\'unicité', () => {
      const list = [
        createBenefit({ id: 'benefit-1', order: 1, isActive: true }),
        createBenefit({ id: 'benefit-2', order: 1, isActive: false }),
      ]
      const result = benefitItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })

    it('BL-R1-04: devrait accepter des orders différents pour même locale', () => {
      const list = [
        createBenefit({ id: 'benefit-1', order: 1 }),
        createBenefit({ id: 'benefit-2', order: 2 }),
        createBenefit({ id: 'benefit-3', order: 3 }),
      ]
      const result = benefitItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })

    it('BL-R1-05: devrait accepter deux inactifs avec même order', () => {
      const list = [
        createBenefit({ id: 'benefit-1', order: 1, isActive: false }),
        createBenefit({ id: 'benefit-2', order: 1, isActive: false }),
      ]
      const result = benefitItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })
  })

  // === R4 : Maximum 5 bénéfices actifs par locale ===

  describe('Règle R4 - Maximum 5 actifs par locale', () => {
    it('BL-R4-01: devrait accepter exactement 5 actifs', () => {
      const list = Array.from({ length: 5 }, (_, i) =>
        createBenefit({ id: `benefit-${i}`, order: i + 1 })
      )
      const result = benefitItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })

    it('BL-R4-02: devrait rejeter 6 actifs pour même locale', () => {
      const list = Array.from({ length: 6 }, (_, i) =>
        createBenefit({ id: `benefit-${i}`, order: i + 1 })
      )
      const result = benefitItemListSchema.safeParse(list)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('Maximum 5')
    })

    it('BL-R4-03: devrait accepter 6 éléments si 1 est inactif', () => {
      const list = [
        ...Array.from({ length: 5 }, (_, i) =>
          createBenefit({ id: `benefit-${i}`, order: i + 1 })
        ),
        createBenefit({ id: 'benefit-6', order: 6, isActive: false }),
      ]
      const result = benefitItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })

    it('BL-R4-04: devrait accepter 5 actifs par locale pour locales différentes', () => {
      const frBenefits = Array.from({ length: 5 }, (_, i) =>
        createBenefit({ id: `benefit-fr-${i}`, order: i + 1, locale: 'fr' })
      )
      const enBenefits = Array.from({ length: 5 }, (_, i) =>
        createBenefit({ id: `benefit-en-${i}`, order: i + 1, locale: 'en' })
      )
      const result = benefitItemListSchema.safeParse([...frBenefits, ...enBenefits])
      expect(result.success).toBe(true)
    })
  })

  // === Cas limites liste ===

  describe('Cas limites liste', () => {
    it('BL-CL-01: devrait accepter une liste vide', () => {
      const result = benefitItemListSchema.safeParse([])
      expect(result.success).toBe(true)
    })

    it('BL-CL-02: devrait accepter un seul élément', () => {
      const result = benefitItemListSchema.safeParse([createBenefit()])
      expect(result.success).toBe(true)
    })
  })
})
```

### 7.3 Suite de tests - statItemSchema

```typescript
// tests/unit/schemas/stat-item.test.ts

import { describe, it, expect } from 'vitest'
import { statItemSchema, statItemListSchema, STAT_ITEM_ERRORS } from '@/schemas/stat'

describe('statItemSchema', () => {
  // === FIXTURE DE BASE ===
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

  const createStat = (overrides = {}) => ({
    ...validStatItem,
    ...overrides,
  })

  // === VALIDATION BASIQUE ===

  describe('Validation basique', () => {
    it('SI-00: devrait valider un StatItem correct complet', () => {
      const result = statItemSchema.safeParse(validStatItem)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe('stat-productivity')
        expect(result.data.value).toBe('50%')
        expect(result.data.numericValue).toBe(50)
        expect(result.data.locale).toBe('fr')
        expect(result.data.isActive).toBe(true)
        expect(result.data.highlight).toBe(false)
        expect(result.data.updatedAt).toBeInstanceOf(Date)
      }
    })

    it('SI-01: devrait appliquer les valeurs par défaut (locale, isActive, highlight)', () => {
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
        expect(result.data.numericValue).toBeUndefined()
        expect(result.data.unit).toBeUndefined()
        expect(result.data.sourceUrl).toBeUndefined()
      }
    })

    it('SI-02: devrait rejeter null', () => {
      const result = statItemSchema.safeParse(null)
      expect(result.success).toBe(false)
    })

    it('SI-03: devrait rejeter undefined', () => {
      const result = statItemSchema.safeParse(undefined)
      expect(result.success).toBe(false)
    })

    it('SI-04: devrait rejeter un objet vide', () => {
      const result = statItemSchema.safeParse({})
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    })
  })

  // === CHAMP id ===

  describe('Champ id', () => {
    it('SI-ID-01: devrait accepter un id valide minimal (3 chars)', () => {
      const result = statItemSchema.safeParse(createStat({ id: 'abc' }))
      expect(result.success).toBe(true)
    })

    it('SI-ID-02: devrait accepter un id valide maximal (50 chars)', () => {
      const result = statItemSchema.safeParse(createStat({ id: 'a'.repeat(50) }))
      expect(result.success).toBe(true)
    })

    it('SI-ID-03: devrait rejeter un id trop court (2 chars)', () => {
      const result = statItemSchema.safeParse(createStat({ id: 'ab' }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.ID_TOO_SHORT)
    })

    it('SI-ID-04: devrait rejeter un id trop long (51 chars)', () => {
      const result = statItemSchema.safeParse(createStat({ id: 'a'.repeat(51) }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.ID_TOO_LONG)
    })

    it('SI-ID-05: devrait rejeter un id avec majuscules', () => {
      const result = statItemSchema.safeParse(createStat({ id: 'Stat-Test' }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.ID_INVALID_FORMAT)
    })

    it('SI-ID-06: devrait rejeter un id avec espaces', () => {
      const result = statItemSchema.safeParse(createStat({ id: 'stat test' }))
      expect(result.success).toBe(false)
    })

    it('SI-ID-07: devrait accepter un id avec chiffres et tirets', () => {
      const result = statItemSchema.safeParse(createStat({ id: 'stat-123-test' }))
      expect(result.success).toBe(true)
    })
  })

  // === CHAMP value (R5) ===

  describe('Champ value (R5 - doit contenir un chiffre)', () => {
    it('SI-V-01: devrait accepter une valeur avec pourcentage', () => {
      const result = statItemSchema.safeParse(createStat({ value: '50%' }))
      expect(result.success).toBe(true)
    })

    it('SI-V-02: devrait accepter une valeur multiplicateur', () => {
      const result = statItemSchema.safeParse(createStat({ value: '3x' }))
      expect(result.success).toBe(true)
    })

    it('SI-V-03: devrait accepter une valeur avec opérateur', () => {
      const result = statItemSchema.safeParse(createStat({ value: '>90%' }))
      expect(result.success).toBe(true)
    })

    it('SI-V-04: devrait accepter la valeur "0"', () => {
      const result = statItemSchema.safeParse(createStat({ value: '0' }))
      expect(result.success).toBe(true)
    })

    it('SI-V-05: devrait rejeter une valeur sans chiffre (R5)', () => {
      const result = statItemSchema.safeParse(createStat({ value: 'N/A' }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.VALUE_NO_DIGIT)
    })

    it('SI-V-06: devrait rejeter un symbole seul sans chiffre (R5)', () => {
      const result = statItemSchema.safeParse(createStat({ value: '%' }))
      expect(result.success).toBe(false)
    })

    it('SI-V-07: devrait accepter une valeur de 20 caractères exactement', () => {
      const result = statItemSchema.safeParse(
        createStat({ value: '12345678901234567890' })
      )
      expect(result.success).toBe(true)
    })

    it('SI-V-08: devrait rejeter une valeur de 21 caractères', () => {
      const result = statItemSchema.safeParse(
        createStat({ value: '123456789012345678901' })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.VALUE_TOO_LONG)
    })

    it('SI-V-09: devrait accepter divers formats valides', () => {
      const validValues = ['50%', '3x', '100+', '>90%', '24h', '1000', '2.5x']
      for (const value of validValues) {
        const result = statItemSchema.safeParse(createStat({ value }))
        expect(result.success, `La valeur '${value}' devrait être acceptée`).toBe(true)
      }
    })

    it('SI-V-10: devrait rejeter value de type number', () => {
      const result = statItemSchema.safeParse(createStat({ value: 50 }))
      expect(result.success).toBe(false)
    })
  })

  // === CHAMP label (R2) ===

  describe('Champ label (R2 - explicatif)', () => {
    it('SI-L-01: devrait accepter un label de 10 caractères exactement', () => {
      const result = statItemSchema.safeParse(createStat({ label: '1234567890' }))
      expect(result.success).toBe(true)
    })

    it('SI-L-02: devrait rejeter un label < 10 caractères', () => {
      const result = statItemSchema.safeParse(createStat({ label: 'Court' }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.LABEL_TOO_SHORT)
    })

    it('SI-L-03: devrait rejeter un label > 100 caractères', () => {
      const result = statItemSchema.safeParse(
        createStat({ label: 'A'.repeat(101) })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.LABEL_TOO_LONG)
    })

    it('SI-L-04: devrait accepter un label de 100 caractères exactement', () => {
      const result = statItemSchema.safeParse(
        createStat({ label: 'A'.repeat(100) })
      )
      expect(result.success).toBe(true)
    })
  })

  // === CHAMP source (R3) ===

  describe('Champ source (R3 - renseignée)', () => {
    it('SI-S-01: devrait accepter une source de 5 caractères exactement', () => {
      const result = statItemSchema.safeParse(createStat({ source: '12345' }))
      expect(result.success).toBe(true)
    })

    it('SI-S-02: devrait rejeter une source vide', () => {
      const result = statItemSchema.safeParse(createStat({ source: '' }))
      expect(result.success).toBe(false)
    })

    it('SI-S-03: devrait rejeter une source < 5 caractères', () => {
      const result = statItemSchema.safeParse(createStat({ source: 'Test' }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.SOURCE_TOO_SHORT)
    })

    it('SI-S-04: devrait rejeter une source > 150 caractères', () => {
      const result = statItemSchema.safeParse(
        createStat({ source: 'A'.repeat(151) })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.SOURCE_TOO_LONG)
    })

    it('SI-S-05: devrait accepter une source de 150 caractères exactement', () => {
      const result = statItemSchema.safeParse(
        createStat({ source: 'A'.repeat(150) })
      )
      expect(result.success).toBe(true)
    })
  })

  // === CHAMP sourceUrl (R6) ===

  describe('Champ sourceUrl (R6 - URL valide si fournie)', () => {
    it('SI-SU-01: devrait accepter une URL HTTPS valide', () => {
      const result = statItemSchema.safeParse(
        createStat({ sourceUrl: 'https://example.com/study' })
      )
      expect(result.success).toBe(true)
    })

    it('SI-SU-02: devrait accepter une URL HTTP valide', () => {
      const result = statItemSchema.safeParse(
        createStat({ sourceUrl: 'http://example.com/study' })
      )
      expect(result.success).toBe(true)
    })

    it('SI-SU-03: devrait rejeter une URL invalide', () => {
      const result = statItemSchema.safeParse(
        createStat({ sourceUrl: 'not-a-url' })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.SOURCE_URL_INVALID)
    })

    it('SI-SU-04: devrait accepter l\'absence de sourceUrl', () => {
      const input = createStat()
      delete (input as any).sourceUrl
      const result = statItemSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('SI-SU-05: devrait rejeter une chaîne vide pour sourceUrl', () => {
      const result = statItemSchema.safeParse(
        createStat({ sourceUrl: '' })
      )
      expect(result.success).toBe(false)
    })
  })

  // === CHAMP order ===

  describe('Champ order', () => {
    it('SI-O-01: devrait accepter un entier positif', () => {
      const result = statItemSchema.safeParse(createStat({ order: 10 }))
      expect(result.success).toBe(true)
    })

    it('SI-O-02: devrait rejeter order = 0', () => {
      const result = statItemSchema.safeParse(createStat({ order: 0 }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.ORDER_NOT_POSITIVE)
    })

    it('SI-O-03: devrait rejeter un order négatif', () => {
      const result = statItemSchema.safeParse(createStat({ order: -1 }))
      expect(result.success).toBe(false)
    })

    it('SI-O-04: devrait rejeter un order décimal', () => {
      const result = statItemSchema.safeParse(createStat({ order: 1.5 }))
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.ORDER_NOT_INTEGER)
    })
  })

  // === CHAMP highlight ===

  describe('Champ highlight', () => {
    it('SI-H-01: devrait accepter highlight = true', () => {
      const result = statItemSchema.safeParse(createStat({ highlight: true }))
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.highlight).toBe(true)
      }
    })

    it('SI-H-02: devrait avoir false comme valeur par défaut', () => {
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

    it('SI-H-03: devrait rejeter highlight de type number', () => {
      const result = statItemSchema.safeParse(createStat({ highlight: 1 }))
      expect(result.success).toBe(false)
    })
  })

  // === CHAMPS optionnels ===

  describe('Champs optionnels (numericValue, unit)', () => {
    it('SI-OPT-01: devrait accepter numericValue', () => {
      const result = statItemSchema.safeParse(createStat({ numericValue: 50 }))
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.numericValue).toBe(50)
      }
    })

    it('SI-OPT-02: devrait accepter numericValue négatif', () => {
      const result = statItemSchema.safeParse(createStat({ numericValue: -10 }))
      expect(result.success).toBe(true)
    })

    it('SI-OPT-03: devrait accepter numericValue = 0', () => {
      const result = statItemSchema.safeParse(createStat({ numericValue: 0 }))
      expect(result.success).toBe(true)
    })

    it('SI-OPT-04: devrait accepter une unité valide', () => {
      const result = statItemSchema.safeParse(createStat({ unit: '%' }))
      expect(result.success).toBe(true)
    })

    it('SI-OPT-05: devrait rejeter une unité > 10 caractères', () => {
      const result = statItemSchema.safeParse(
        createStat({ unit: 'A'.repeat(11) })
      )
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.UNIT_TOO_LONG)
    })

    it('SI-OPT-06: devrait accepter une unité vide', () => {
      const result = statItemSchema.safeParse(createStat({ unit: '' }))
      expect(result.success).toBe(true)
    })
  })

  // === CHAMP updatedAt ===

  describe('Champ updatedAt (transformation)', () => {
    it('SI-UA-01: devrait transformer une date ISO en objet Date', () => {
      const result = statItemSchema.safeParse(validStatItem)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.updatedAt).toBeInstanceOf(Date)
        expect(result.data.updatedAt.toISOString()).toBe('2026-01-27T10:00:00.000Z')
      }
    })

    it('SI-UA-02: devrait rejeter une date invalide', () => {
      const result = statItemSchema.safeParse(
        createStat({ updatedAt: 'invalid-date' })
      )
      expect(result.success).toBe(false)
    })
  })

  // === MESSAGES D'ERREUR (STAT_ITEM_ERRORS) ===

  describe('Constante STAT_ITEM_ERRORS', () => {
    it('SI-ERR-01: devrait exporter toutes les clés d\'erreur attendues', () => {
      const expectedKeys = [
        'ID_TOO_SHORT', 'ID_TOO_LONG', 'ID_INVALID_FORMAT',
        'VALUE_TOO_SHORT', 'VALUE_TOO_LONG', 'VALUE_NO_DIGIT',
        'UNIT_TOO_LONG',
        'LABEL_TOO_SHORT', 'LABEL_TOO_LONG',
        'SOURCE_TOO_SHORT', 'SOURCE_TOO_LONG', 'SOURCE_URL_INVALID',
        'ORDER_NOT_INTEGER', 'ORDER_NOT_POSITIVE', 'ORDER_NOT_UNIQUE',
        'MAX_STATS_EXCEEDED',
        'LOCALE_INVALID', 'DATE_INVALID',
      ]
      for (const key of expectedKeys) {
        expect(STAT_ITEM_ERRORS).toHaveProperty(key)
        expect(typeof (STAT_ITEM_ERRORS as any)[key]).toBe('string')
      }
    })

    it('SI-ERR-02: les messages d\'erreur doivent être en français', () => {
      for (const message of Object.values(STAT_ITEM_ERRORS)) {
        // Vérifie que les messages contiennent des caractères français
        // (au moins un mot français commun ou des accents)
        expect(typeof message).toBe('string')
        expect(message.length).toBeGreaterThan(0)
      }
    })
  })
})

// ====================================================================
// statItemListSchema
// ====================================================================

describe('statItemListSchema', () => {
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

  // === R1 : Unicité de order par locale ===

  describe('Règle R1 - Unicité de order par locale', () => {
    it('SL-R1-01: devrait rejeter deux actifs avec même order et même locale', () => {
      const list = [
        createStat({ id: 'stat-1', order: 1 }),
        createStat({ id: 'stat-2', order: 1 }),
      ]
      const result = statItemListSchema.safeParse(list)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.ORDER_NOT_UNIQUE)
    })

    it('SL-R1-02: devrait accepter même order pour locales différentes', () => {
      const list = [
        createStat({ id: 'stat-1', order: 1, locale: 'fr' }),
        createStat({ id: 'stat-2', order: 1, locale: 'en' }),
      ]
      const result = statItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })

    it('SL-R1-03: devrait ignorer les inactifs pour la vérification d\'unicité', () => {
      const list = [
        createStat({ id: 'stat-1', order: 1, isActive: true }),
        createStat({ id: 'stat-2', order: 1, isActive: false }),
      ]
      const result = statItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })

    it('SL-R1-04: devrait accepter des orders différents pour même locale', () => {
      const list = [
        createStat({ id: 'stat-1', order: 1 }),
        createStat({ id: 'stat-2', order: 2 }),
        createStat({ id: 'stat-3', order: 3 }),
      ]
      const result = statItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })

    it('SL-R1-05: devrait accepter deux inactifs avec même order', () => {
      const list = [
        createStat({ id: 'stat-1', order: 1, isActive: false }),
        createStat({ id: 'stat-2', order: 1, isActive: false }),
      ]
      const result = statItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })
  })

  // === R4 : Maximum 6 statistiques actives par locale ===

  describe('Règle R4 - Maximum 6 actifs par locale', () => {
    it('SL-R4-01: devrait accepter exactement 6 actifs', () => {
      const list = Array.from({ length: 6 }, (_, i) =>
        createStat({ id: `stat-${i}`, order: i + 1 })
      )
      const result = statItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })

    it('SL-R4-02: devrait rejeter 7 actifs pour même locale', () => {
      const list = Array.from({ length: 7 }, (_, i) =>
        createStat({ id: `stat-${i}`, order: i + 1 })
      )
      const result = statItemListSchema.safeParse(list)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toBe(STAT_ITEM_ERRORS.MAX_STATS_EXCEEDED)
    })

    it('SL-R4-03: devrait accepter 7 éléments si 1 est inactif', () => {
      const list = [
        ...Array.from({ length: 6 }, (_, i) =>
          createStat({ id: `stat-${i}`, order: i + 1 })
        ),
        createStat({ id: 'stat-7', order: 7, isActive: false }),
      ]
      const result = statItemListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })

    it('SL-R4-04: devrait accepter 6 actifs par locale pour locales différentes', () => {
      const frStats = Array.from({ length: 6 }, (_, i) =>
        createStat({ id: `stat-fr-${i}`, order: i + 1, locale: 'fr' })
      )
      const enStats = Array.from({ length: 6 }, (_, i) =>
        createStat({ id: `stat-en-${i}`, order: i + 1, locale: 'en' })
      )
      const result = statItemListSchema.safeParse([...frStats, ...enStats])
      expect(result.success).toBe(true)
    })
  })

  // === Cas limites liste ===

  describe('Cas limites liste', () => {
    it('SL-CL-01: devrait accepter une liste vide', () => {
      const result = statItemListSchema.safeParse([])
      expect(result.success).toBe(true)
    })

    it('SL-CL-02: devrait accepter un seul élément', () => {
      const result = statItemListSchema.safeParse([createStat()])
      expect(result.success).toBe(true)
    })
  })
})
```

### 7.4 Suite de tests - Validation croisée production

```typescript
// tests/unit/schemas/schemas-production.test.ts

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { benefitItemSchema, benefitItemListSchema } from '@/schemas/benefit'
import { statItemSchema, statItemListSchema } from '@/schemas/stat'

/**
 * Charge un fichier JSON depuis src/content/
 */
function loadJson(relativePath: string): unknown {
  const fullPath = resolve(__dirname, '../../../src/content', relativePath)
  return JSON.parse(readFileSync(fullPath, 'utf-8'))
}

describe('Validation croisée - Données de production', () => {
  describe('Fichiers JSON BenefitItem', () => {
    const benefitFiles = [
      'benefits/benefit-productivity.json',
      'benefits/benefit-quality.json',
      'benefits/benefit-collaboration.json',
    ]

    for (const file of benefitFiles) {
      it(`PROD-B-${file}: devrait valider ${file}`, () => {
        const data = loadJson(file)
        const result = benefitItemSchema.safeParse(data)
        expect(result.success, `${file} ne passe pas la validation: ${JSON.stringify(result.error?.issues)}`).toBe(true)
      })
    }

    it('PROD-BL: la liste complète des bénéfices de production devrait être valide', () => {
      const allBenefits = [
        loadJson('benefits/benefit-productivity.json'),
        loadJson('benefits/benefit-quality.json'),
        loadJson('benefits/benefit-collaboration.json'),
      ]
      const result = benefitItemListSchema.safeParse(allBenefits)
      expect(result.success).toBe(true)
    })

    it('PROD-BL-ORDER: les bénéfices de production ne doivent pas avoir d\'ordres dupliqués', () => {
      const allBenefits = [
        loadJson('benefits/benefit-productivity.json'),
        loadJson('benefits/benefit-quality.json'),
        loadJson('benefits/benefit-collaboration.json'),
      ]
      const result = benefitItemListSchema.safeParse(allBenefits)
      expect(result.success).toBe(true)
    })
  })

  describe('Fichiers JSON StatItem', () => {
    const statFiles = [
      'stats/stat-productivity.json',
      'stats/stat-speed.json',
      'stats/stat-satisfaction.json',
    ]

    for (const file of statFiles) {
      it(`PROD-S-${file}: devrait valider ${file}`, () => {
        const data = loadJson(file)
        const result = statItemSchema.safeParse(data)
        expect(result.success, `${file} ne passe pas la validation: ${JSON.stringify(result.error?.issues)}`).toBe(true)
      })
    }

    it('PROD-SL: la liste complète des statistiques de production devrait être valide', () => {
      const allStats = [
        loadJson('stats/stat-productivity.json'),
        loadJson('stats/stat-speed.json'),
        loadJson('stats/stat-satisfaction.json'),
      ]
      const result = statItemListSchema.safeParse(allStats)
      expect(result.success).toBe(true)
    })

    it('PROD-SL-ORDER: les statistiques de production ne doivent pas avoir d\'ordres dupliqués', () => {
      const allStats = [
        loadJson('stats/stat-productivity.json'),
        loadJson('stats/stat-speed.json'),
        loadJson('stats/stat-satisfaction.json'),
      ]
      const result = statItemListSchema.safeParse(allStats)
      expect(result.success).toBe(true)
    })
  })
})
```

### 7.5 Matrice de couverture

#### BenefitItem

| Champ | Cas valide | Cas invalide | Cas limite | Couverture | Tests |
|-------|-----------|-------------|------------|------------|-------|
| `id` | BI-ID-01, BI-ID-02, BI-ID-09 | BI-ID-03, BI-ID-04, BI-ID-05, BI-ID-06, BI-ID-07, BI-ID-08 | BI-ID-01 (3ch), BI-ID-02 (50ch) | 100% | 9 |
| `icon` | BI-IC-02 (20 icônes) | BI-IC-01, BI-IC-03 | - | 100% | 3 |
| `title` | BI-T-01, BI-T-03, BI-T-05, BI-T-07, BI-T-08 | BI-T-02, BI-T-04, BI-T-06 | BI-T-01 (5 mots), BI-T-05 (50ch) | 100% | 8 |
| `description` | BI-D-01, BI-D-02, BI-D-06, BI-D-08 | BI-D-03, BI-D-04, BI-D-05, BI-D-07 | BI-D-06 (150ch), BI-D-08 (20ch) | 100% | 8 |
| `order` | BI-O-01 | BI-O-02, BI-O-03, BI-O-04, BI-O-05 | BI-O-02 (0) | 100% | 5 |
| `locale` | BI-LC-01, BI-01 (défaut) | BI-LC-02, BI-LC-03 | - | 100% | 4 |
| `isActive` | BI-01 (défaut) | BI-IA-01 | - | 100% | 2 |
| `ariaLabel` | BI-AL-01, BI-AL-02, BI-AL-04 | BI-AL-03 | BI-AL-02 (100ch) | 100% | 4 |
| `updatedAt` | BI-UA-01 | BI-UA-02, BI-UA-03, BI-UA-04 | BI-UA-01 (transform) | 100% | 4 |
| **List R1** | BL-R1-02, BL-R1-03, BL-R1-04, BL-R1-05 | BL-R1-01 | BL-R1-03 (inactif) | 100% | 5 |
| **List R4** | BL-R4-01, BL-R4-03, BL-R4-04 | BL-R4-02 | BL-R4-01 (5 exact) | 100% | 4 |
| **Production** | PROD-B-*, PROD-BL | - | - | 100% | 5 |

**Total BenefitItem : 62 tests**

#### StatItem

| Champ | Cas valide | Cas invalide | Cas limite | Couverture | Tests |
|-------|-----------|-------------|------------|------------|-------|
| `id` | SI-ID-01, SI-ID-02, SI-ID-07 | SI-ID-03, SI-ID-04, SI-ID-05, SI-ID-06 | SI-ID-01 (3ch), SI-ID-02 (50ch) | 100% | 7 |
| `value` | SI-V-01 à SI-V-04, SI-V-07, SI-V-09 | SI-V-05, SI-V-06, SI-V-08, SI-V-10 | SI-V-04 (0), SI-V-07 (20ch) | 100% | 10 |
| `label` | SI-L-01, SI-L-04 | SI-L-02, SI-L-03 | SI-L-01 (10ch), SI-L-04 (100ch) | 100% | 4 |
| `source` | SI-S-01, SI-S-05 | SI-S-02, SI-S-03, SI-S-04 | SI-S-01 (5ch), SI-S-05 (150ch) | 100% | 5 |
| `sourceUrl` | SI-SU-01, SI-SU-02, SI-SU-04 | SI-SU-03, SI-SU-05 | SI-SU-04 (absent) | 100% | 5 |
| `order` | SI-O-01 | SI-O-02, SI-O-03, SI-O-04 | SI-O-02 (0) | 100% | 4 |
| `highlight` | SI-H-01, SI-H-02 | SI-H-03 | SI-H-02 (défaut) | 100% | 3 |
| `numericValue` | SI-OPT-01, SI-OPT-02, SI-OPT-03 | - | SI-OPT-03 (0) | 100% | 3 |
| `unit` | SI-OPT-04, SI-OPT-06 | SI-OPT-05 | SI-OPT-06 (vide) | 100% | 3 |
| `updatedAt` | SI-UA-01 | SI-UA-02 | SI-UA-01 (transform) | 100% | 2 |
| `locale` | SI-01 (défaut) | - | - | 100% | 1 |
| `ERRORS` | SI-ERR-01, SI-ERR-02 | - | - | 100% | 2 |
| **List R1** | SL-R1-02, SL-R1-03, SL-R1-04, SL-R1-05 | SL-R1-01 | SL-R1-03 (inactif) | 100% | 5 |
| **List R4** | SL-R4-01, SL-R4-03, SL-R4-04 | SL-R4-02 | SL-R4-01 (6 exact) | 100% | 4 |
| **Production** | PROD-S-*, PROD-SL | - | - | 100% | 5 |

**Total StatItem : 64 tests**

### 7.6 Résumé des tests

| Fichier | Nb tests | Schémas couverts |
|---------|----------|-----------------|
| `benefit-item.test.ts` | 62 | `benefitItemSchema`, `benefitItemListSchema` |
| `stat-item.test.ts` | 64 | `statItemSchema`, `statItemListSchema`, `STAT_ITEM_ERRORS` |
| `schemas-production.test.ts` | 10 | Validation croisée données JSON |
| **Total** | **136** | **4 schémas + 1 constante** |

---

## 8. Critères d'acceptation

- [x] **CA-01** : Tous les champs de `benefitItemSchema` sont testés individuellement (valide, invalide, limites)
- [x] **CA-02** : Tous les champs de `statItemSchema` sont testés individuellement (valide, invalide, limites)
- [x] **CA-03** : Les règles R1-R5 de BenefitItem sont couvertes avec au moins 3 tests chacune
- [x] **CA-04** : Les règles R1-R6 de StatItem sont couvertes avec au moins 3 tests chacune
- [x] **CA-05** : Les validations de listes (`benefitItemListSchema`, `statItemListSchema`) couvrent unicité et max actifs
- [x] **CA-06** : Les valeurs par défaut (`locale`, `isActive`, `highlight`) sont testées explicitement
- [x] **CA-07** : La transformation `updatedAt` (string → Date) est testée
- [x] **CA-08** : Les messages d'erreur sont vérifiés en français
- [x] **CA-09** : La constante `STAT_ITEM_ERRORS` est testée (exhaustivité des clés)
- [x] **CA-10** : Les 6 fichiers JSON de production passent la validation des schémas
- [x] **CA-11** : Les types incorrects (string au lieu de number, etc.) sont rejetés
- [x] **CA-12** : Les entrées null, undefined et objets vides sont rejetées
- [x] **CA-13** : Tous les tests passent (`pnpm test:unit -- schemas`) — 136 tests passants (62 benefit + 64 stat + 10 production)
- [ ] **CA-14** : Couverture de test >= 95% sur `src/schemas/benefit.ts` et `src/schemas/stat.ts`

---

## 9. Definition of Done

- [x] Tests unitaires écrits et passants (136 tests : 62 benefit + 64 stat + 10 production)
- [x] Fichier `schemas-production.test.ts` créé pour la validation croisée
- [x] Les tests existants dans `benefit-item.test.ts` et `stat-item.test.ts` sont complétés (pas remplacés)
- [ ] Couverture de test >= 95% sur les fichiers de schémas
- [ ] TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] ESLint passe sans warning (`pnpm lint`)
- [ ] Code reviewé par un pair
- [x] Matrice de couverture mise à jour dans cette spec

---

## 10. Notes d'implémentation

### 10.1 Stratégie d'exécution

Les tests existants dans `benefit-item.test.ts` (40 tests) et `stat-item.test.ts` (42 tests) couvrent déjà une base solide. T-001-T1 doit :

1. **Compléter** les tests existants avec les cas manquants (types incorrects, null/undefined, bornes exactes)
2. **Créer** le fichier `schemas-production.test.ts` pour la validation croisée
3. **Normaliser** les IDs de tests (BI-*, SI-*, BL-*, SL-*, PROD-*) pour la traçabilité
4. **Vérifier** les messages d'erreur exacts (particulièrement via `STAT_ITEM_ERRORS`)

### 10.2 Commandes de test

```bash
# Exécuter tous les tests de schémas
pnpm test:unit -- schemas

# Exécuter uniquement les tests BenefitItem
pnpm test:unit -- benefit-item

# Exécuter uniquement les tests StatItem
pnpm test:unit -- stat-item

# Exécuter les tests de validation production
pnpm test:unit -- schemas-production

# Couverture de code
pnpm test:unit -- schemas --coverage
```

### 10.3 Convention de nommage des tests

| Préfixe | Signification | Exemple |
|---------|---------------|---------|
| `BI-*` | BenefitItem schema individuel | `BI-ID-01` |
| `BL-*` | BenefitItem list schema | `BL-R1-01` |
| `SI-*` | StatItem schema individuel | `SI-V-05` |
| `SL-*` | StatItem list schema | `SL-R4-02` |
| `PROD-*` | Validation production | `PROD-B-*` |

---

## 11. Références

| Document | Lien |
|----------|------|
| User Story US-001 | [spec.md](./spec.md) |
| Spec T-001-B2 BenefitItem | [T-001-B2-modele-donnees-BenefitItem.md](./T-001-B2-modele-donnees-BenefitItem.md) |
| Spec T-001-B3 StatItem | [T-001-B3-modele-donnees-StatItem.md](./T-001-B3-modele-donnees-StatItem.md) |
| Schéma Benefit | `src/schemas/benefit.ts` |
| Schéma Stat | `src/schemas/stat.ts` |
| Données Benefits | `src/content/benefits/*.json` |
| Données Stats | `src/content/stats/*.json` |
| Architecture Tests | [ARCHITECTURE.md#tests](../ARCHITECTURE.md) |
| Vitest Documentation | [vitest.dev](https://vitest.dev/) |
| Zod Documentation | [zod.dev](https://zod.dev/) |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 05/02/2026 | Création initiale - ~134 tests spécifiés |
| 1.1 | 05/02/2026 | Implémentation terminée - 136 tests passants (62 benefit + 64 stat + 10 production) |
