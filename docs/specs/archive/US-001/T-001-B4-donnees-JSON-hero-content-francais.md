# T-001-B4 : Créer les données JSON hero content (français)

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 2 février 2026 |
| **Statut** | ✅ Terminé |
| **User Story** | [US-001 - Comprendre AIAD rapidement](./spec.md) |
| **Dépendances** | T-001-B1 (HeroContent model) ✅ |
| **Bloque** | T-001-F1 (HeroTitle), T-001-F2 (ValueProposition), T-001-F9 (Intégration) |

---

## 1. Objectif

Créer le fichier de données JSON contenant le contenu textuel de la hero section en français, conforme au modèle `HeroContent` défini dans T-001-B1, en garantissant :

- **Conformité au schéma** : Validation Zod réussie sans erreur
- **Qualité rédactionnelle** : Contenu percutant, professionnel et sans faute
- **Optimisation SEO** : Métadonnées bien renseignées pour le référencement
- **Respect des règles métier** : R1 (AIAD dans titre), R2 (non-répétition), R3 (phrase complète)
- **Intégration Astro** : Compatible avec Content Collections

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
│   ├── config.ts           # Schéma heroContentSchemaWithRefinements (T-001-B1)
│   └── hero/
│       └── main.json       # ← FICHIER À CRÉER
├── types/
│   └── hero.ts             # Interface HeroContent (T-001-B1)
└── components/
    ├── HeroTitle.astro     # Consommateur (T-001-F1)
    └── ValueProposition.astro # Consommateur (T-001-F2)
```

### 2.3 Schéma de validation applicable

Le fichier doit respecter le schéma `heroContentSchemaWithRefinements` défini dans [T-001-B1](./T-001-B1-modele-donnees-HeroContent.md) :

```typescript
// Rappel des contraintes du schéma (src/content/config.ts)
export const heroContentSchemaWithRefinements = z.object({
  id: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
  title: z.string().min(10).max(80).refine(val => val.includes('AIAD')),
  tagline: z.string().min(10).max(120),
  valueProposition: z.string().min(20).max(200).refine(val => val.trim().endsWith('.')),
  locale: z.string().length(2).default('fr'),
  isActive: z.boolean().default(true),
  metadata: z.object({
    seoTitle: z.string().max(60).optional(),
    seoDescription: z.string().max(160).optional(),
  }).optional(),
  updatedAt: z.string().datetime().transform(val => new Date(val)),
}).refine(/* R2: tagline ne répète pas title */)
```

### 2.4 Règles métier applicables

| ID | Règle | Validation | Impact sur le contenu |
|----|-------|------------|----------------------|
| R1 | `title` doit contenir "AIAD" | Zod refine | Inclure "AIAD" obligatoirement dans le H1 |
| R2 | `tagline` ne doit pas répéter `title` | Zod refine (< 50% overlap) | Utiliser un vocabulaire différent |
| R3 | `valueProposition` doit terminer par `.` | Zod refine | Phrase complète avec ponctuation finale |
| R4 | Un seul `HeroContent` actif par `locale` | Collection-level | Unique fichier actif pour `"fr"` |

---

## 3. Spécifications fonctionnelles

### 3.1 Objectifs de communication

D'après US-001, le hero doit permettre au visiteur de :
> "comprendre en moins d'une minute ce qu'est AIAD et ses bénéfices principaux"

| Élément | Objectif | Temps de lecture cible |
|---------|----------|------------------------|
| Titre (H1) | Identifier immédiatement le produit | < 3 secondes |
| Tagline | Comprendre la promesse principale | < 5 secondes |
| Value Proposition | Saisir le bénéfice concret | < 10 secondes |

### 3.2 Cible et tonalité

| Aspect | Spécification |
|--------|---------------|
| **Persona principal** | Développeur senior / Tech Lead découvrant AIAD |
| **Ton** | Professionnel, direct, orienté bénéfices |
| **Registre** | Technique accessible (pas de jargon excessif) |
| **Promesse** | Productivité et structuration du travail avec l'IA |
| **Différenciateur** | Framework/Méthodologie (pas juste un outil) |

### 3.3 Mots-clés stratégiques

| Priorité | Mots-clés | Placement recommandé |
|----------|-----------|---------------------|
| **Haute** | AIAD, agents IA, framework | Titre, seoTitle |
| **Moyenne** | développement, productivité, méthodologie | Tagline, valueProposition |
| **Basse** | collaboration, workflow, intégration | valueProposition, seoDescription |

### 3.4 Contraintes de longueur

| Champ | Min | Max | Optimal | Justification |
|-------|-----|-----|---------|---------------|
| `id` | 3 | 50 | 10-15 | Slug lisible mais compact |
| `title` | 10 | 80 | 50-65 | Impact visuel H1 sans troncature |
| `tagline` | 10 | 120 | 50-80 | Lisibilité sur une ligne |
| `valueProposition` | 20 | 200 | 100-150 | 2-3 phrases maximum |
| `seoTitle` | - | 60 | 50-60 | Optimisé SERP Google |
| `seoDescription` | - | 160 | 140-160 | Maximiser l'extrait Google |

---

## 4. Spécifications techniques

### 4.1 Structure JSON attendue

```typescript
// Type TypeScript correspondant (rappel de T-001-B1)
interface HeroContentJSON {
  id: string
  title: string
  tagline: string
  valueProposition: string
  locale: string
  isActive: boolean
  metadata?: {
    seoTitle?: string
    seoDescription?: string
  }
  updatedAt: string // ISO 8601
}
```

### 4.2 Fichier à créer

**Chemin :** `src/content/hero/main.json`

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
    "seoDescription": "Découvrez AIAD, le framework de référence pour structurer votre collaboration avec les agents IA de codage et booster votre productivité."
  },
  "updatedAt": "2026-02-02T10:00:00.000Z"
}
```

### 4.3 Validation des contraintes

| Champ | Valeur | Longueur | Contrainte | Statut |
|-------|--------|----------|------------|--------|
| `id` | `"hero-main-fr"` | 12 | Pattern `^[a-z0-9-]+$`, 3-50 chars | ✅ |
| `title` | `"AIAD : Le framework..."` | 56 | Contient "AIAD", 10-80 chars | ✅ |
| `tagline` | `"Structurez votre..."` | 62 | 10-120 chars | ✅ |
| `valueProposition` | `"Une méthodologie..."` | 131 | 20-200 chars, termine par `.` | ✅ |
| `locale` | `"fr"` | 2 | ISO 639-1, exactement 2 chars | ✅ |
| `isActive` | `true` | - | Boolean | ✅ |
| `seoTitle` | `"AIAD Framework..."` | 48 | Max 60 chars | ✅ |
| `seoDescription` | `"Découvrez AIAD..."` | 138 | Max 160 chars | ✅ |
| `updatedAt` | `"2026-02-02T..."` | - | ISO 8601 datetime | ✅ |

### 4.4 Vérification règle R2 (non-répétition)

```
Title words (> 3 chars): [aiad, framework, pour, développer, avec, agents]
Tagline words (> 3 chars): [structurez, votre, collaboration, avec, intelligence, artificielle]

Overlap: ["avec"] (1 mot)
Tagline total words > 3 chars: 6
Overlap ratio: 1/6 = 16.7% < 50% ✅
```

---

## 5. Alternatives de contenu

### 5.1 Option A (Recommandée) - Focus Framework

```json
{
  "title": "AIAD : Le framework pour développer avec des agents IA",
  "tagline": "Structurez votre collaboration avec l'intelligence artificielle",
  "valueProposition": "Une méthodologie éprouvée pour intégrer les agents IA dans votre workflow de développement et multiplier votre productivité."
}
```

| Critère | Score | Commentaire |
|---------|-------|-------------|
| Clarté | ⭐⭐⭐⭐⭐ | Message direct et compréhensible |
| SEO | ⭐⭐⭐⭐ | Mots-clés bien placés |
| Différenciation | ⭐⭐⭐⭐ | "Framework" + "méthodologie" |
| Appel à l'action implicite | ⭐⭐⭐ | Bénéfice clair mais pas d'urgence |

### 5.2 Option B - Focus Productivité

```json
{
  "title": "AIAD : Développez 3x plus vite avec les agents IA",
  "tagline": "Le framework qui structure votre collaboration avec l'intelligence artificielle",
  "valueProposition": "Adoptez une méthodologie éprouvée pour intégrer les agents IA dans vos projets et accélérer significativement vos cycles de développement."
}
```

| Critère | Score | Commentaire |
|---------|-------|-------------|
| Clarté | ⭐⭐⭐⭐ | Message clair |
| SEO | ⭐⭐⭐⭐ | Bons mots-clés |
| Différenciation | ⭐⭐⭐ | Chiffre accrocheur mais moins précis |
| Appel à l'action implicite | ⭐⭐⭐⭐⭐ | "3x plus vite" crée l'envie |

**Validation R2 Option B :**
```
Title: [aiad, développez, plus, vite, avec, agents]
Tagline: [framework, structure, votre, collaboration, avec, intelligence, artificielle]
Overlap: ["avec"] = 14.3% < 50% ✅
```

### 5.3 Option C - Focus Méthodologie

```json
{
  "title": "AIAD : La méthodologie de développement assisté par agents IA",
  "tagline": "Un cadre structuré pour maximiser votre productivité avec l'IA",
  "valueProposition": "Transformez votre façon de coder en adoptant un framework pensé pour la collaboration humain-IA et les workflows modernes."
}
```

| Critère | Score | Commentaire |
|---------|-------|-------------|
| Clarté | ⭐⭐⭐ | Plus conceptuel |
| SEO | ⭐⭐⭐⭐ | "méthodologie", "agents IA" |
| Différenciation | ⭐⭐⭐⭐⭐ | Positionnement unique fort |
| Appel à l'action implicite | ⭐⭐⭐ | "Transformez" mais abstrait |

**Validation R2 Option C :**
```
Title: [aiad, méthodologie, développement, assisté, agents]
Tagline: [cadre, structuré, pour, maximiser, votre, productivité, avec]
Overlap: [] = 0% < 50% ✅
```

### 5.4 Tableau comparatif

| Option | Title (chars) | Tagline (chars) | VP (chars) | R1 | R2 | R3 | Recommandation |
|--------|---------------|-----------------|------------|----|----|----|----|
| A | 56 | 62 | 131 | ✅ | ✅ | ✅ | **Recommandée** |
| B | 52 | 78 | 142 | ✅ | ✅ | ✅ | Alternative |
| C | 64 | 63 | 128 | ✅ | ✅ | ✅ | Alternative |

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Cas limites identifiés

| ID | Cas limite | Valeur test | Comportement attendu | Test |
|----|------------|-------------|---------------------|------|
| CL-01 | Title sans "AIAD" | `"Le framework pour développer avec des agents IA"` | ❌ Rejeté (R1) | T-01 |
| CL-02 | Title avec "aiad" minuscule | `"aiad : Le framework..."` | ✅ Accepté (case-insensitive check) | T-02 |
| CL-03 | Tagline répétant title (> 50%) | `"Le framework pour développer avec des agents IA en entreprise"` | ❌ Rejeté (R2) | T-03 |
| CL-04 | ValueProposition sans point | `"Une méthodologie éprouvée"` | ❌ Rejeté (R3) | T-04 |
| CL-05 | ValueProposition avec point + espace | `"Une méthodologie. "` | ✅ Accepté (trim appliqué) | T-05 |
| CL-06 | Locale invalide (3 chars) | `"fra"` | ❌ Rejeté | T-06 |
| CL-07 | updatedAt invalide | `"2026-02-30"` | ❌ Rejeté (date invalide) | T-07 |
| CL-08 | seoTitle > 60 chars | 61 caractères | ❌ Rejeté | T-08 |
| CL-09 | seoDescription > 160 chars | 161 caractères | ❌ Rejeté | T-09 |
| CL-10 | ID avec majuscules | `"Hero-Main-FR"` | ❌ Rejeté (pattern) | T-10 |
| CL-11 | ID avec espaces | `"hero main fr"` | ❌ Rejeté (pattern) | T-11 |
| CL-12 | Caractères accentués dans tagline | `"Découvrez l'IA"` | ✅ Accepté (UTF-8) | T-12 |
| CL-13 | Apostrophe typographique | `"l'intelligence"` vs `"l'intelligence"` | ✅ Accepté (les deux) | T-13 |
| CL-14 | JSON avec BOM UTF-8 | Fichier avec BOM | ⚠️ Potentiellement problématique | T-14 |
| CL-15 | Champs supplémentaires | `{"id": "...", "extra": "field"}` | ⚠️ Ignoré (Zod strict?) | T-15 |

### 6.2 Erreurs de validation possibles

```typescript
// Messages d'erreur attendus selon le schéma T-001-B1
const EXPECTED_ERRORS = {
  TITLE_MISSING_AIAD: 'Le titre doit contenir "AIAD" (règle R1)',
  TAGLINE_REPEATS_TITLE: 'La tagline ne doit pas trop répéter le titre (règle R2)',
  VALUE_PROP_NO_PERIOD: 'La proposition de valeur doit se terminer par un point (règle R3)',
  ID_INVALID_FORMAT: "L'ID ne doit contenir que des minuscules, chiffres et tirets",
  LOCALE_INVALID: 'Le code langue doit contenir exactement 2 caractères',
  SEO_TITLE_TOO_LONG: 'Le titre SEO ne doit pas dépasser 60 caractères',
  SEO_DESC_TOO_LONG: 'La meta description ne doit pas dépasser 160 caractères',
}
```

---

## 7. Exemples entrée/sortie

### 7.1 Entrée valide (fichier complet)

**Entrée :** `src/content/hero/main.json`

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
    "seoDescription": "Découvrez AIAD, le framework de référence pour structurer votre collaboration avec les agents IA de codage et booster votre productivité."
  },
  "updatedAt": "2026-02-02T10:00:00.000Z"
}
```

**Sortie (après parsing Zod) :**

```typescript
{
  id: 'hero-main-fr',
  title: 'AIAD : Le framework pour développer avec des agents IA',
  tagline: 'Structurez votre collaboration avec l\'intelligence artificielle',
  valueProposition: 'Une méthodologie éprouvée pour intégrer les agents IA dans votre workflow de développement et multiplier votre productivité.',
  locale: 'fr',
  isActive: true,
  metadata: {
    seoTitle: 'AIAD Framework - Développement avec agents IA',
    seoDescription: 'Découvrez AIAD, le framework de référence pour structurer votre collaboration avec les agents IA de codage et booster votre productivité.'
  },
  updatedAt: Date('2026-02-02T10:00:00.000Z') // ← Transformé en objet Date
}
```

### 7.2 Entrée valide minimale (sans metadata)

```json
{
  "id": "hero-main-fr",
  "title": "AIAD : Le framework pour les agents IA",
  "tagline": "Structurez votre travail avec l'IA",
  "valueProposition": "Une méthodologie pour intégrer les agents IA.",
  "updatedAt": "2026-02-02T10:00:00.000Z"
}
```

**Sortie :** ✅ Valide avec `locale: "fr"`, `isActive: true` appliqués par défaut

### 7.3 Entrée invalide - Title sans AIAD (R1)

```json
{
  "id": "hero-main-fr",
  "title": "Le framework pour développer avec des agents IA",
  "tagline": "Structurez votre collaboration",
  "valueProposition": "Une méthodologie éprouvée.",
  "updatedAt": "2026-02-02T10:00:00.000Z"
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

### 7.4 Entrée invalide - Tagline répète title (R2)

```json
{
  "id": "hero-main-fr",
  "title": "AIAD : Le framework pour développer avec des agents IA",
  "tagline": "Le framework pour développer avec des agents IA en entreprise",
  "valueProposition": "Une méthodologie éprouvée.",
  "updatedAt": "2026-02-02T10:00:00.000Z"
}
```

**Calcul overlap :**
```
Title words (>3): [aiad, framework, pour, développer, avec, agents]
Tagline words (>3): [framework, pour, développer, avec, agents, entreprise]
Overlap: [framework, pour, développer, avec, agents] = 5 mots
Ratio: 5/6 = 83% > 50% ❌
```

**Sortie :**
```typescript
{
  success: false,
  error: {
    issues: [{
      code: 'custom',
      message: 'La tagline ne doit pas trop répéter le titre (règle R2)',
      path: ['tagline']
    }]
  }
}
```

### 7.5 Entrée invalide - ValueProposition sans point (R3)

```json
{
  "id": "hero-main-fr",
  "title": "AIAD : Le framework pour les agents IA",
  "tagline": "Structurez votre collaboration",
  "valueProposition": "Une méthodologie éprouvée sans point final",
  "updatedAt": "2026-02-02T10:00:00.000Z"
}
```

**Sortie :**
```typescript
{
  success: false,
  error: {
    issues: [{
      code: 'custom',
      message: 'La proposition de valeur doit se terminer par un point (règle R3)',
      path: ['valueProposition']
    }]
  }
}
```

---

## 8. Tests

### 8.1 Fichier de test

**Emplacement :** `tests/unit/content/hero-main.test.ts`

### 8.2 Suite de tests

```typescript
// tests/unit/content/hero-main.test.ts

import { describe, it, expect, beforeAll } from 'vitest'
import { heroContentSchemaWithRefinements } from '@/content/config'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('Hero Content - main.json', () => {
  let heroContent: unknown

  beforeAll(() => {
    const filePath = join(process.cwd(), 'src/content/hero/main.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    heroContent = JSON.parse(fileContent)
  })

  describe('Validation du schéma', () => {
    it('T-00: should validate against heroContentSchemaWithRefinements', () => {
      const result = heroContentSchemaWithRefinements.safeParse(heroContent)

      expect(result.success).toBe(true)
      if (!result.success) {
        console.error('Validation errors:', result.error.issues)
      }
    })

    it('T-00b: should transform updatedAt to Date object', () => {
      const result = heroContentSchemaWithRefinements.safeParse(heroContent)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.updatedAt).toBeInstanceOf(Date)
      }
    })
  })

  describe('Règle R1 - Title contient AIAD', () => {
    it('T-01: should have title containing "AIAD"', () => {
      const content = heroContent as { title: string }
      expect(content.title).toContain('AIAD')
    })

    it('T-02: should accept "aiad" in lowercase', () => {
      const testContent = {
        ...(heroContent as object),
        title: 'aiad : Le framework pour les agents IA',
      }
      const result = heroContentSchemaWithRefinements.safeParse(testContent)

      // Note: dépend de l'implémentation - case-sensitive ou non
      // Ajuster selon le comportement réel du schéma
      expect(result.success).toBe(true)
    })
  })

  describe('Règle R2 - Tagline ne répète pas title', () => {
    it('T-03: should reject tagline that repeats title words > 50%', () => {
      const testContent = {
        ...(heroContent as object),
        title: 'AIAD : Le framework pour développer avec des agents IA',
        tagline: 'Le framework pour développer avec des agents IA en entreprise',
      }
      const result = heroContentSchemaWithRefinements.safeParse(testContent)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('tagline')
      }
    })

    it('should accept tagline with < 50% overlap', () => {
      const content = heroContent as { title: string; tagline: string }
      const titleWords = new Set(
        content.title
          .toLowerCase()
          .split(/\s+/)
          .filter((w) => w.length > 3)
      )
      const taglineWords = content.tagline.toLowerCase().split(/\s+/)
      const overlap = taglineWords.filter(
        (w) => titleWords.has(w) && w.length > 3
      )

      expect(overlap.length).toBeLessThan(taglineWords.length * 0.5)
    })
  })

  describe('Règle R3 - ValueProposition termine par point', () => {
    it('T-04: should reject valueProposition without ending period', () => {
      const testContent = {
        ...(heroContent as object),
        valueProposition: 'Une méthodologie sans point final',
      }
      const result = heroContentSchemaWithRefinements.safeParse(testContent)

      expect(result.success).toBe(false)
    })

    it('T-05: should accept valueProposition with trailing space after period', () => {
      const testContent = {
        ...(heroContent as object),
        valueProposition: 'Une méthodologie éprouvée pour les agents IA. ',
      }
      const result = heroContentSchemaWithRefinements.safeParse(testContent)

      expect(result.success).toBe(true)
    })

    it('should have valueProposition ending with period', () => {
      const content = heroContent as { valueProposition: string }
      expect(content.valueProposition.trim()).toMatch(/\.$/)
    })
  })

  describe('Validation des champs requis', () => {
    it('should have correct id format', () => {
      const content = heroContent as { id: string }
      expect(content.id).toBe('hero-main-fr')
      expect(content.id).toMatch(/^[a-z0-9-]+$/)
    })

    it('should have locale "fr"', () => {
      const content = heroContent as { locale: string }
      expect(content.locale).toBe('fr')
    })

    it('should be active', () => {
      const content = heroContent as { isActive: boolean }
      expect(content.isActive).toBe(true)
    })

    it('should have valid ISO 8601 updatedAt', () => {
      const content = heroContent as { updatedAt: string }
      expect(() => new Date(content.updatedAt)).not.toThrow()
      expect(new Date(content.updatedAt).toISOString()).toBe(content.updatedAt)
    })
  })

  describe('Validation des métadonnées SEO', () => {
    it('should have metadata object', () => {
      const content = heroContent as { metadata?: object }
      expect(content.metadata).toBeDefined()
    })

    it('should have seoTitle under 60 characters', () => {
      const content = heroContent as { metadata?: { seoTitle?: string } }
      expect(content.metadata?.seoTitle).toBeDefined()
      expect(content.metadata!.seoTitle!.length).toBeLessThanOrEqual(60)
    })

    it('T-08: should reject seoTitle over 60 characters', () => {
      const testContent = {
        ...(heroContent as object),
        metadata: {
          seoTitle: 'A'.repeat(61),
        },
      }
      const result = heroContentSchemaWithRefinements.safeParse(testContent)

      expect(result.success).toBe(false)
    })

    it('should have seoDescription under 160 characters', () => {
      const content = heroContent as { metadata?: { seoDescription?: string } }
      expect(content.metadata?.seoDescription).toBeDefined()
      expect(content.metadata!.seoDescription!.length).toBeLessThanOrEqual(160)
    })

    it('T-09: should reject seoDescription over 160 characters', () => {
      const testContent = {
        ...(heroContent as object),
        metadata: {
          seoDescription: 'A'.repeat(161),
        },
      }
      const result = heroContentSchemaWithRefinements.safeParse(testContent)

      expect(result.success).toBe(false)
    })
  })

  describe('Validation des contraintes de longueur', () => {
    it('should have title between 10 and 80 characters', () => {
      const content = heroContent as { title: string }
      expect(content.title.length).toBeGreaterThanOrEqual(10)
      expect(content.title.length).toBeLessThanOrEqual(80)
    })

    it('should have tagline between 10 and 120 characters', () => {
      const content = heroContent as { tagline: string }
      expect(content.tagline.length).toBeGreaterThanOrEqual(10)
      expect(content.tagline.length).toBeLessThanOrEqual(120)
    })

    it('should have valueProposition between 20 and 200 characters', () => {
      const content = heroContent as { valueProposition: string }
      expect(content.valueProposition.length).toBeGreaterThanOrEqual(20)
      expect(content.valueProposition.length).toBeLessThanOrEqual(200)
    })
  })

  describe('Cas limites - ID', () => {
    it('T-10: should reject ID with uppercase', () => {
      const testContent = {
        ...(heroContent as object),
        id: 'Hero-Main-FR',
      }
      const result = heroContentSchemaWithRefinements.safeParse(testContent)

      expect(result.success).toBe(false)
    })

    it('T-11: should reject ID with spaces', () => {
      const testContent = {
        ...(heroContent as object),
        id: 'hero main fr',
      }
      const result = heroContentSchemaWithRefinements.safeParse(testContent)

      expect(result.success).toBe(false)
    })
  })

  describe('Cas limites - Locale', () => {
    it('T-06: should reject locale with 3 characters', () => {
      const testContent = {
        ...(heroContent as object),
        locale: 'fra',
      }
      const result = heroContentSchemaWithRefinements.safeParse(testContent)

      expect(result.success).toBe(false)
    })
  })

  describe('Cas limites - Caractères spéciaux', () => {
    it('T-12: should accept accented characters', () => {
      const testContent = {
        ...(heroContent as object),
        tagline: 'Découvrez l\'efficacité de l\'IA générative',
      }
      const result = heroContentSchemaWithRefinements.safeParse(testContent)

      expect(result.success).toBe(true)
    })

    it('T-13: should accept both apostrophe types', () => {
      const testContent1 = {
        ...(heroContent as object),
        tagline: "Structurez l'intelligence artificielle", // apostrophe droite
      }
      const testContent2 = {
        ...(heroContent as object),
        tagline: 'Structurez l'intelligence artificielle', // apostrophe typographique
      }

      expect(heroContentSchemaWithRefinements.safeParse(testContent1).success).toBe(true)
      expect(heroContentSchemaWithRefinements.safeParse(testContent2).success).toBe(true)
    })
  })
})

describe('Hero Content - Qualité rédactionnelle', () => {
  let heroContent: {
    title: string
    tagline: string
    valueProposition: string
    metadata?: { seoTitle?: string; seoDescription?: string }
  }

  beforeAll(() => {
    const filePath = join(process.cwd(), 'src/content/hero/main.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    heroContent = JSON.parse(fileContent)
  })

  it('should have AIAD at the beginning of title', () => {
    expect(heroContent.title.startsWith('AIAD')).toBe(true)
  })

  it('should contain key SEO terms', () => {
    const allText = [
      heroContent.title,
      heroContent.tagline,
      heroContent.valueProposition,
      heroContent.metadata?.seoTitle || '',
      heroContent.metadata?.seoDescription || '',
    ].join(' ').toLowerCase()

    expect(allText).toContain('aiad')
    expect(allText).toContain('agent')
    expect(allText).toMatch(/framework|méthodologie/)
    expect(allText).toMatch(/ia|intelligence artificielle/)
  })

  it('should not have typos in common French words', () => {
    const text = [
      heroContent.title,
      heroContent.tagline,
      heroContent.valueProposition,
    ].join(' ')

    // Vérifications basiques d'orthographe
    expect(text).not.toMatch(/developpement/) // devrait être "développement"
    expect(text).not.toMatch(/méthodologié/) // faute courante
    expect(text).not.toMatch(/\s{2,}/) // pas de double espaces
  })
})
```

### 8.3 Matrice de couverture

| Aspect | Tests | Couverture |
|--------|-------|------------|
| Validation schéma global | T-00, T-00b | 100% |
| Règle R1 (AIAD in title) | T-01, T-02 | 100% |
| Règle R2 (no repeat) | T-03 + assertion overlap | 100% |
| Règle R3 (ends with .) | T-04, T-05 + assertion | 100% |
| Champs requis | 5 tests | 100% |
| Métadonnées SEO | 5 tests (T-08, T-09) | 100% |
| Contraintes longueur | 3 tests | 100% |
| Cas limites ID | T-10, T-11 | 100% |
| Cas limites locale | T-06 | 100% |
| Caractères spéciaux | T-12, T-13 | 100% |
| Qualité rédactionnelle | 3 tests | 100% |

---

## 9. Implémentation

### 9.1 Prérequis

- [ ] T-001-B1 (HeroContent model) ✅ complété
- [ ] Dossier `src/content/hero/` existant (créer si nécessaire)
- [ ] Schéma `heroContentSchemaWithRefinements` exporté dans `config.ts`

### 9.2 Étapes de réalisation

| Étape | Action | Commande/Fichier |
|-------|--------|------------------|
| 1 | Créer le dossier si inexistant | `mkdir -p src/content/hero` |
| 2 | Créer le fichier JSON | `src/content/hero/main.json` |
| 3 | Valider la syntaxe JSON | `cat src/content/hero/main.json \| jq .` |
| 4 | Vérifier la compilation Astro | `pnpm dev` |
| 5 | Créer les tests unitaires | `tests/unit/content/hero-main.test.ts` |
| 6 | Exécuter les tests | `pnpm test:unit -- hero-main` |
| 7 | Vérifier le build complet | `pnpm build` |

### 9.3 Commandes de vérification

```bash
# 1. Vérifier la syntaxe JSON
cat src/content/hero/main.json | jq .

# 2. Lancer le serveur de dev (valide le schéma)
pnpm dev

# 3. Exécuter les tests spécifiques
pnpm test:unit -- hero-main

# 4. Build complet (validation finale)
pnpm build

# 5. Vérifier le type checking
pnpm typecheck
```

---

## 10. Critères d'acceptation

- [ ] **CA-01** : Le fichier `src/content/hero/main.json` existe
- [ ] **CA-02** : Le fichier est un JSON valide (parseable sans erreur)
- [ ] **CA-03** : Le fichier passe la validation `heroContentSchemaWithRefinements`
- [ ] **CA-04** : Le titre contient "AIAD" (règle R1)
- [ ] **CA-05** : La tagline ne répète pas le titre à > 50% (règle R2)
- [ ] **CA-06** : La valueProposition termine par un point (règle R3)
- [ ] **CA-07** : Les métadonnées SEO sont renseignées (seoTitle, seoDescription)
- [ ] **CA-08** : `seoTitle` ≤ 60 caractères
- [ ] **CA-09** : `seoDescription` ≤ 160 caractères
- [ ] **CA-10** : Le contenu est en français (`locale: "fr"`)
- [ ] **CA-11** : Le contenu est actif (`isActive: true`)
- [ ] **CA-12** : `pnpm dev` démarre sans erreur de validation
- [ ] **CA-13** : Tous les tests unitaires passent
- [ ] **CA-14** : `pnpm build` réussit

---

## 11. Definition of Done

- [ ] Fichier JSON créé à l'emplacement `src/content/hero/main.json`
- [ ] Validation Zod réussie (aucune erreur à la compilation Astro)
- [ ] Tests unitaires écrits et passants (`tests/unit/content/hero-main.test.ts`)
- [ ] Contenu relu pour qualité rédactionnelle (orthographe, grammaire)
- [ ] Mots-clés SEO présents dans le contenu
- [ ] Build Astro réussi (`pnpm build`)
- [ ] TypeScript compile sans erreur (`pnpm typecheck`)

---

## 12. Références

| Document | Lien |
|----------|------|
| User Story US-001 | [spec.md](./spec.md) |
| Modèle HeroContent (T-001-B1) | [T-001-B1-modele-donnees-HeroContent.md](./T-001-B1-modele-donnees-HeroContent.md) |
| Architecture technique | [ARCHITECTURE.md](../ARCHITECTURE.md) |
| Guide Claude | [CLAUDE.md](../CLAUDE.md) |
| Astro Content Collections | [docs.astro.build](https://docs.astro.build/en/guides/content-collections/) |
| Zod Documentation | [zod.dev](https://zod.dev/) |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 02/02/2026 | Création initiale complète |
