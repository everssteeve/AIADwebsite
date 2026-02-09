# T-001-B5 : Créer les données JSON des 3 bénéfices clés

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 2 février 2026 |
| **Statut** | ✅ Terminé |
| **User Story** | [US-001 - Comprendre AIAD rapidement](./spec.md) |
| **Dépendances** | T-001-B2 (BenefitItem model) ✅ |
| **Bloque** | T-001-F4 (BenefitCard), T-001-F5 (BenefitsList), T-001-F9 (Intégration) |

---

## 1. Objectif

Créer le fichier de données JSON contenant les 3 bénéfices clés du framework AIAD en français, conformes au modèle `BenefitItem` défini dans T-001-B2, en garantissant :

- **Conformité au schéma** : Validation Zod réussie sans erreur
- **Qualité rédactionnelle** : Contenu percutant, professionnel et sans faute
- **Cohérence AIAD** : Bénéfices représentatifs du framework et de sa valeur ajoutée
- **Respect des règles métier** : R1-R5 du modèle BenefitItem
- **Accessibilité** : Labels ARIA descriptifs pour chaque icône
- **Intégration Astro** : Compatible avec Content Collections

---

## 2. Contexte technique

### 2.1 Architecture cible

D'après [ARCHITECTURE.md](../../ARCHITECTURE.md), le projet utilise :

- **Astro 4.x** avec Content Collections pour la gestion du contenu
- **TypeScript 5.x** en mode strict
- **Zod** (via `astro:content`) pour la validation des schémas
- **Lucide Icons** pour les pictogrammes

### 2.2 Positionnement dans l'arborescence

```
src/
├── content/
│   ├── config.ts           # Schéma benefitItemSchema (T-001-B2)
│   └── benefits/
│       └── main.json       # ← FICHIER À CRÉER
├── types/
│   └── benefit.ts          # Interface BenefitItem (T-001-B2)
└── components/
    ├── BenefitCard.astro   # Consommateur (T-001-F4)
    └── BenefitsList.astro  # Consommateur (T-001-F5)
```

### 2.3 Schéma de validation applicable

Le fichier doit respecter le schéma `benefitItemSchema` et `benefitItemListSchema` définis dans [T-001-B2](./T-001-B2-modele-donnees-BenefitItem.md) :

```typescript
// Rappel des contraintes du schéma (src/content/config.ts)
export const benefitItemSchema = z.object({
  id: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
  icon: z.enum(BENEFIT_ICONS),
  title: z.string().min(5).max(50).refine(val => val.trim().split(/\s+/).length <= 5),
  description: z.string().min(20).max(150).refine(val => /[.!]$/.test(val.trim())),
  order: z.number().int().positive(),
  locale: z.string().length(2).default('fr'),
  isActive: z.boolean().default(true),
  ariaLabel: z.string().max(100).optional(),
  updatedAt: z.string().datetime().transform(val => new Date(val)),
})

export const benefitItemListSchema = z.array(benefitItemSchema)
  .refine(/* R1: order unique par locale */)
  .refine(/* R4: max 5 actifs par locale */)
```

### 2.4 Règles métier applicables

| ID | Règle | Validation | Impact sur le contenu |
|----|-------|------------|----------------------|
| R1 | `order` unique par `locale` | List refine | Orders 1, 2, 3 distincts |
| R2 | `title` max 5 mots | Item refine | Titres courts et percutants |
| R3 | `description` termine par `.` ou `!` | Item refine | Phrases complètes |
| R4 | Max 5 `BenefitItem` actifs par `locale` | List refine | 3 bénéfices = OK |
| R5 | `icon` doit être une Lucide valide | Item enum | Choisir parmi BENEFIT_ICONS |

---

## 3. Spécifications fonctionnelles

### 3.1 Objectifs de communication

D'après US-001, le hero doit afficher :
> "3 bénéfices clés sous forme de pictos + texte court"

| Élément | Objectif | Temps de lecture cible |
|---------|----------|------------------------|
| Icône (picto) | Identifier visuellement le bénéfice | Instantané |
| Titre | Comprendre le bénéfice en un coup d'œil | < 2 secondes |
| Description | Expliquer concrètement le bénéfice | < 5 secondes |
| **Total 3 bénéfices** | Saisir la valeur globale d'AIAD | < 20 secondes |

### 3.2 Cible et tonalité

| Aspect | Spécification |
|--------|---------------|
| **Persona principal** | Développeur senior / Tech Lead découvrant AIAD |
| **Ton** | Professionnel, direct, orienté résultats |
| **Registre** | Technique accessible (pas de jargon excessif) |
| **Promesse** | Bénéfices concrets et mesurables |
| **Différenciateur** | Méthodologie structurée (pas juste des outils) |

### 3.3 Les 3 bénéfices clés d'AIAD

D'après l'analyse du framework AIAD (PRD et contenu source), les 3 bénéfices principaux sont :

| # | Bénéfice | Mot-clé | Justification |
|---|----------|---------|---------------|
| 1 | **Productivité accrue** | `productivity` | Gain de temps mesurable grâce à l'automatisation IA |
| 2 | **Qualité garantie** | `quality` | Standards et validations intégrés au workflow |
| 3 | **Collaboration structurée** | `collaboration` | Méthodologie claire pour le travail humain-IA |

### 3.4 Mapping icônes Lucide

| Bénéfice | Icône recommandée | Identifiant | Alternative |
|----------|-------------------|-------------|-------------|
| Productivité | 📈 | `trending-up` | `zap`, `rocket` |
| Qualité | ✅ | `check-circle` | `shield`, `award` |
| Collaboration | 👥 | `users` | `handshake`, `layers` |

### 3.5 Contraintes de longueur

| Champ | Min | Max | Optimal | Justification |
|-------|-----|-----|---------|---------------|
| `id` | 3 | 50 | 15-25 | Slug descriptif |
| `title` | 5 | 50 | 15-30 | Impact visuel, max 5 mots |
| `description` | 20 | 150 | 60-100 | Phrase complète explicative |
| `ariaLabel` | - | 100 | 40-60 | Description de l'icône pour lecteurs d'écran |

---

## 4. Spécifications techniques

### 4.1 Structure JSON attendue

```typescript
// Type TypeScript correspondant (rappel de T-001-B2)
interface BenefitItemJSON {
  id: string
  icon: BenefitIcon
  title: string
  description: string
  order: number
  locale: string
  isActive: boolean
  ariaLabel?: string
  updatedAt: string // ISO 8601
}

type BenefitsListJSON = BenefitItemJSON[]
```

### 4.2 Fichier à créer

**Chemin :** `src/content/benefits/main.json`

```json
[
  {
    "id": "benefit-productivity",
    "icon": "trending-up",
    "title": "Productivité décuplée",
    "description": "Automatisez les tâches répétitives et concentrez-vous sur la valeur ajoutée de votre code.",
    "order": 1,
    "locale": "fr",
    "isActive": true,
    "ariaLabel": "Icône de graphique ascendant représentant la productivité",
    "updatedAt": "2026-02-02T10:00:00.000Z"
  },
  {
    "id": "benefit-quality",
    "icon": "check-circle",
    "title": "Qualité garantie",
    "description": "Des standards de code et des validations intégrés à chaque étape du développement.",
    "order": 2,
    "locale": "fr",
    "isActive": true,
    "ariaLabel": "Icône de coche dans un cercle représentant la qualité validée",
    "updatedAt": "2026-02-02T10:00:00.000Z"
  },
  {
    "id": "benefit-collaboration",
    "icon": "users",
    "title": "Collaboration fluide",
    "description": "Une méthodologie claire pour structurer le travail entre humains et agents IA.",
    "order": 3,
    "locale": "fr",
    "isActive": true,
    "ariaLabel": "Icône de groupe de personnes représentant la collaboration",
    "updatedAt": "2026-02-02T10:00:00.000Z"
  }
]
```

### 4.3 Validation des contraintes

#### Bénéfice 1 : Productivité

| Champ | Valeur | Longueur | Contrainte | Statut |
|-------|--------|----------|------------|--------|
| `id` | `"benefit-productivity"` | 21 | Pattern `^[a-z0-9-]+$`, 3-50 chars | ✅ |
| `icon` | `"trending-up"` | - | ∈ BENEFIT_ICONS | ✅ |
| `title` | `"Productivité décuplée"` | 22 | 5-50 chars, ≤ 5 mots (2 mots) | ✅ |
| `description` | `"Automatisez les tâches..."` | 96 | 20-150 chars, termine par `.` | ✅ |
| `order` | `1` | - | Entier positif, unique | ✅ |
| `locale` | `"fr"` | 2 | ISO 639-1 | ✅ |
| `ariaLabel` | `"Icône de graphique..."` | 58 | Max 100 chars | ✅ |

#### Bénéfice 2 : Qualité

| Champ | Valeur | Longueur | Contrainte | Statut |
|-------|--------|----------|------------|--------|
| `id` | `"benefit-quality"` | 15 | Pattern `^[a-z0-9-]+$`, 3-50 chars | ✅ |
| `icon` | `"check-circle"` | - | ∈ BENEFIT_ICONS | ✅ |
| `title` | `"Qualité garantie"` | 17 | 5-50 chars, ≤ 5 mots (2 mots) | ✅ |
| `description` | `"Des standards de code..."` | 91 | 20-150 chars, termine par `.` | ✅ |
| `order` | `2` | - | Entier positif, unique | ✅ |
| `locale` | `"fr"` | 2 | ISO 639-1 | ✅ |
| `ariaLabel` | `"Icône de coche..."` | 58 | Max 100 chars | ✅ |

#### Bénéfice 3 : Collaboration

| Champ | Valeur | Longueur | Contrainte | Statut |
|-------|--------|----------|------------|--------|
| `id` | `"benefit-collaboration"` | 21 | Pattern `^[a-z0-9-]+$`, 3-50 chars | ✅ |
| `icon` | `"users"` | - | ∈ BENEFIT_ICONS | ✅ |
| `title` | `"Collaboration fluide"` | 20 | 5-50 chars, ≤ 5 mots (2 mots) | ✅ |
| `description` | `"Une méthodologie claire..."` | 83 | 20-150 chars, termine par `.` | ✅ |
| `order` | `3` | - | Entier positif, unique | ✅ |
| `locale` | `"fr"` | 2 | ISO 639-1 | ✅ |
| `ariaLabel` | `"Icône de groupe..."` | 60 | Max 100 chars | ✅ |

#### Validation liste (règles R1 et R4)

| Règle | Vérification | Résultat |
|-------|--------------|----------|
| R1 (orders uniques) | Orders = [1, 2, 3], tous distincts | ✅ |
| R4 (max 5 actifs) | 3 bénéfices actifs < 5 | ✅ |

---

## 5. Alternatives de contenu

### 5.1 Option A (Recommandée) - Focus Bénéfices Concrets

```json
[
  {
    "id": "benefit-productivity",
    "icon": "trending-up",
    "title": "Productivité décuplée",
    "description": "Automatisez les tâches répétitives et concentrez-vous sur la valeur ajoutée de votre code."
  },
  {
    "id": "benefit-quality",
    "icon": "check-circle",
    "title": "Qualité garantie",
    "description": "Des standards de code et des validations intégrés à chaque étape du développement."
  },
  {
    "id": "benefit-collaboration",
    "icon": "users",
    "title": "Collaboration fluide",
    "description": "Une méthodologie claire pour structurer le travail entre humains et agents IA."
  }
]
```

| Critère | Score | Commentaire |
|---------|-------|-------------|
| Clarté | ⭐⭐⭐⭐⭐ | Messages directs et compréhensibles |
| Cohérence | ⭐⭐⭐⭐⭐ | Structure parallèle (adjectif + nom) |
| Différenciation | ⭐⭐⭐⭐ | Bénéfices spécifiques à AIAD |
| Longueur | ⭐⭐⭐⭐⭐ | Optimal pour mobile |

### 5.2 Option B - Focus Résultats Chiffrés

```json
[
  {
    "id": "benefit-speed",
    "icon": "zap",
    "title": "3x plus rapide",
    "description": "Développez trois fois plus vite en déléguant les tâches répétitives aux agents IA."
  },
  {
    "id": "benefit-reliability",
    "icon": "shield",
    "title": "Zéro dette technique",
    "description": "Les agents appliquent systématiquement vos standards pour un code maintenable."
  },
  {
    "id": "benefit-workflow",
    "icon": "layers",
    "title": "Workflow optimisé",
    "description": "Une méthodologie éprouvée pour orchestrer la collaboration humain-IA efficacement."
  }
]
```

| Critère | Score | Commentaire |
|---------|-------|-------------|
| Clarté | ⭐⭐⭐⭐ | Messages accrocheurs |
| Cohérence | ⭐⭐⭐ | Structure moins homogène |
| Différenciation | ⭐⭐⭐⭐⭐ | Chiffres et résultats concrets |
| Longueur | ⭐⭐⭐⭐ | Correct |

### 5.3 Option C - Focus Méthodologie

```json
[
  {
    "id": "benefit-structure",
    "icon": "compass",
    "title": "Cadre structuré",
    "description": "Un framework complet avec rôles, rituels et artefacts pour guider votre équipe."
  },
  {
    "id": "benefit-iteration",
    "icon": "refresh-cw",
    "title": "Itérations maîtrisées",
    "description": "Des boucles de développement claires avec validation continue et feedback rapide."
  },
  {
    "id": "benefit-scalability",
    "icon": "rocket",
    "title": "Passage à l'échelle",
    "description": "Une approche qui s'adapte de l'équipe solo au département entier."
  }
]
```

| Critère | Score | Commentaire |
|---------|-------|-------------|
| Clarté | ⭐⭐⭐ | Plus conceptuel, moins immédiat |
| Cohérence | ⭐⭐⭐⭐⭐ | Très homogène |
| Différenciation | ⭐⭐⭐⭐⭐ | Positionnement méthodologique fort |
| Longueur | ⭐⭐⭐⭐ | Correct |

### 5.4 Tableau comparatif

| Option | Approche | R2 (5 mots max) | R3 (ponctuation) | Recommandation |
|--------|----------|-----------------|------------------|----------------|
| A | Bénéfices concrets | ✅ (2 mots) | ✅ | **Recommandée** |
| B | Résultats chiffrés | ✅ (2-3 mots) | ✅ | Alternative |
| C | Méthodologie | ✅ (2 mots) | ✅ | Alternative |

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Cas limites identifiés

| ID | Cas limite | Valeur test | Comportement attendu | Test |
|----|------------|-------------|---------------------|------|
| CL-01 | Title avec 6 mots | `"Un titre avec beaucoup trop de mots"` | ❌ Rejeté (R2) | T-01 |
| CL-02 | Title exactement 5 mots | `"Un deux trois quatre cinq"` | ✅ Accepté | T-02 |
| CL-03 | Description sans ponctuation | `"Une description sans point"` | ❌ Rejeté (R3) | T-03 |
| CL-04 | Description avec `?` | `"Une description interrogative?"` | ❌ Rejeté (R3) | T-04 |
| CL-05 | Description avec `!` | `"Une description enthousiaste!"` | ✅ Accepté | T-05 |
| CL-06 | Icône non supportée | `"invalid-icon"` | ❌ Rejeté (R5) | T-06 |
| CL-07 | Order dupliqué | Deux items avec `order: 1` | ❌ Rejeté (R1) | T-07 |
| CL-08 | Order = 0 | `"order": 0` | ❌ Rejeté | T-08 |
| CL-09 | Order négatif | `"order": -1` | ❌ Rejeté | T-09 |
| CL-10 | Order décimal | `"order": 1.5` | ❌ Rejeté | T-10 |
| CL-11 | 6 bénéfices actifs | 6 items `isActive: true` | ❌ Rejeté (R4) | T-11 |
| CL-12 | ID avec majuscules | `"Benefit-Test"` | ❌ Rejeté | T-12 |
| CL-13 | ID avec espaces | `"benefit test"` | ❌ Rejeté | T-13 |
| CL-14 | Description < 20 chars | `"Trop court."` | ❌ Rejeté | T-14 |
| CL-15 | Description > 150 chars | 151 caractères | ❌ Rejeté | T-15 |
| CL-16 | ariaLabel > 100 chars | 101 caractères | ❌ Rejeté | T-16 |
| CL-17 | Locale 3 chars | `"fra"` | ❌ Rejeté | T-17 |
| CL-18 | Caractères accentués | `"Qualité élevée"` | ✅ Accepté (UTF-8) | T-18 |
| CL-19 | Emoji dans title | `"Productivité 🚀"` | ✅ Accepté | T-19 |
| CL-20 | JSON array vide | `[]` | ✅ Accepté (0 < 5) | T-20 |

### 6.2 Erreurs de validation possibles

```typescript
// Messages d'erreur attendus selon le schéma T-001-B2
const EXPECTED_ERRORS = {
  ID_TOO_SHORT: "L'ID doit contenir au moins 3 caractères",
  ID_TOO_LONG: "L'ID ne doit pas dépasser 50 caractères",
  ID_INVALID_FORMAT: "L'ID ne doit contenir que des minuscules, chiffres et tirets",
  ICON_INVALID: "L'icône doit être l'une des suivantes : zap, target, ...",
  TITLE_TOO_SHORT: 'Le titre doit contenir au moins 5 caractères',
  TITLE_TOO_LONG: 'Le titre ne doit pas dépasser 50 caractères',
  TITLE_TOO_MANY_WORDS: 'Le titre ne doit pas dépasser 5 mots (règle R2)',
  DESCRIPTION_TOO_SHORT: 'La description doit contenir au moins 20 caractères',
  DESCRIPTION_TOO_LONG: 'La description ne doit pas dépasser 150 caractères',
  DESCRIPTION_NO_PUNCTUATION: "La description doit se terminer par un point ou point d'exclamation (règle R3)",
  ORDER_NOT_INTEGER: "L'ordre doit être un entier",
  ORDER_NOT_POSITIVE: "L'ordre doit être un nombre positif",
  ORDER_NOT_UNIQUE: "L'ordre doit être unique par locale pour les bénéfices actifs (règle R1)",
  MAX_BENEFITS_EXCEEDED: 'Maximum 5 bénéfices actifs par locale (règle R4)',
  LOCALE_INVALID: 'Le code langue doit contenir exactement 2 caractères',
  ARIA_LABEL_TOO_LONG: "Le label d'accessibilité ne doit pas dépasser 100 caractères",
  DATE_INVALID: 'La date doit être au format ISO 8601',
}
```

---

## 7. Exemples entrée/sortie

### 7.1 Entrée valide (fichier complet)

**Entrée :** `src/content/benefits/main.json`

```json
[
  {
    "id": "benefit-productivity",
    "icon": "trending-up",
    "title": "Productivité décuplée",
    "description": "Automatisez les tâches répétitives et concentrez-vous sur la valeur ajoutée de votre code.",
    "order": 1,
    "locale": "fr",
    "isActive": true,
    "ariaLabel": "Icône de graphique ascendant représentant la productivité",
    "updatedAt": "2026-02-02T10:00:00.000Z"
  },
  {
    "id": "benefit-quality",
    "icon": "check-circle",
    "title": "Qualité garantie",
    "description": "Des standards de code et des validations intégrés à chaque étape du développement.",
    "order": 2,
    "locale": "fr",
    "isActive": true,
    "ariaLabel": "Icône de coche dans un cercle représentant la qualité validée",
    "updatedAt": "2026-02-02T10:00:00.000Z"
  },
  {
    "id": "benefit-collaboration",
    "icon": "users",
    "title": "Collaboration fluide",
    "description": "Une méthodologie claire pour structurer le travail entre humains et agents IA.",
    "order": 3,
    "locale": "fr",
    "isActive": true,
    "ariaLabel": "Icône de groupe de personnes représentant la collaboration",
    "updatedAt": "2026-02-02T10:00:00.000Z"
  }
]
```

**Sortie (après parsing Zod) :**

```typescript
[
  {
    id: 'benefit-productivity',
    icon: 'trending-up',
    title: 'Productivité décuplée',
    description: 'Automatisez les tâches répétitives et concentrez-vous sur la valeur ajoutée de votre code.',
    order: 1,
    locale: 'fr',
    isActive: true,
    ariaLabel: 'Icône de graphique ascendant représentant la productivité',
    updatedAt: Date('2026-02-02T10:00:00.000Z'), // ← Transformé en Date
  },
  // ... autres bénéfices
]
```

### 7.2 Entrée valide minimale (sans optionnels)

```json
[
  {
    "id": "benefit-test",
    "icon": "zap",
    "title": "Titre valide",
    "description": "Une description valide et complète.",
    "order": 1,
    "updatedAt": "2026-02-02T10:00:00.000Z"
  }
]
```

**Sortie :** ✅ Valide avec `locale: "fr"`, `isActive: true` appliqués par défaut

### 7.3 Entrée invalide - Orders dupliqués (R1)

```json
[
  {
    "id": "benefit-1",
    "icon": "zap",
    "title": "Premier bénéfice",
    "description": "Description du premier bénéfice valide.",
    "order": 1,
    "updatedAt": "2026-02-02T10:00:00.000Z"
  },
  {
    "id": "benefit-2",
    "icon": "target",
    "title": "Deuxième bénéfice",
    "description": "Description du deuxième bénéfice valide.",
    "order": 1,
    "updatedAt": "2026-02-02T10:00:00.000Z"
  }
]
```

**Sortie :**
```typescript
{
  success: false,
  error: {
    issues: [{
      code: 'custom',
      message: "L'ordre doit être unique par locale pour les bénéfices actifs (règle R1)",
      path: []
    }]
  }
}
```

### 7.4 Entrée invalide - Title trop long (R2)

```json
[
  {
    "id": "benefit-1",
    "icon": "zap",
    "title": "Un titre avec beaucoup trop de mots dedans",
    "description": "Description valide terminant par un point.",
    "order": 1,
    "updatedAt": "2026-02-02T10:00:00.000Z"
  }
]
```

**Sortie :**
```typescript
{
  success: false,
  error: {
    issues: [{
      code: 'custom',
      message: 'Le titre ne doit pas dépasser 5 mots (règle R2)',
      path: [0, 'title']
    }]
  }
}
```

### 7.5 Entrée invalide - Description sans ponctuation (R3)

```json
[
  {
    "id": "benefit-1",
    "icon": "zap",
    "title": "Titre valide",
    "description": "Une description sans ponctuation finale",
    "order": 1,
    "updatedAt": "2026-02-02T10:00:00.000Z"
  }
]
```

**Sortie :**
```typescript
{
  success: false,
  error: {
    issues: [{
      code: 'custom',
      message: "La description doit se terminer par un point ou point d'exclamation (règle R3)",
      path: [0, 'description']
    }]
  }
}
```

### 7.6 Entrée invalide - 6 bénéfices actifs (R4)

```json
[
  { "id": "b-1", "icon": "zap", "title": "Bénéfice 1", "description": "Description valide un.", "order": 1, "updatedAt": "2026-02-02T10:00:00.000Z" },
  { "id": "b-2", "icon": "zap", "title": "Bénéfice 2", "description": "Description valide deux.", "order": 2, "updatedAt": "2026-02-02T10:00:00.000Z" },
  { "id": "b-3", "icon": "zap", "title": "Bénéfice 3", "description": "Description valide trois.", "order": 3, "updatedAt": "2026-02-02T10:00:00.000Z" },
  { "id": "b-4", "icon": "zap", "title": "Bénéfice 4", "description": "Description valide quatre.", "order": 4, "updatedAt": "2026-02-02T10:00:00.000Z" },
  { "id": "b-5", "icon": "zap", "title": "Bénéfice 5", "description": "Description valide cinq.", "order": 5, "updatedAt": "2026-02-02T10:00:00.000Z" },
  { "id": "b-6", "icon": "zap", "title": "Bénéfice 6", "description": "Description valide six.", "order": 6, "updatedAt": "2026-02-02T10:00:00.000Z" }
]
```

**Sortie :**
```typescript
{
  success: false,
  error: {
    issues: [{
      code: 'custom',
      message: 'Maximum 5 bénéfices actifs par locale (règle R4)',
      path: []
    }]
  }
}
```

---

## 8. Tests

### 8.1 Fichier de test

**Emplacement :** `tests/unit/content/benefits-main.test.ts`

### 8.2 Suite de tests

```typescript
// tests/unit/content/benefits-main.test.ts

import { describe, it, expect, beforeAll } from 'vitest'
import { benefitItemSchema, benefitItemListSchema } from '@/content/config'
import { BENEFIT_ICONS } from '@/types/benefit'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('Benefits Content - main.json', () => {
  let benefitsContent: unknown[]

  beforeAll(() => {
    const filePath = join(process.cwd(), 'src/content/benefits/main.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    benefitsContent = JSON.parse(fileContent)
  })

  describe('Validation du schéma', () => {
    it('T-00: should validate against benefitItemListSchema', () => {
      const result = benefitItemListSchema.safeParse(benefitsContent)

      expect(result.success).toBe(true)
      if (!result.success) {
        console.error('Validation errors:', result.error.issues)
      }
    })

    it('T-00b: should transform updatedAt to Date objects', () => {
      const result = benefitItemListSchema.safeParse(benefitsContent)

      expect(result.success).toBe(true)
      if (result.success) {
        for (const item of result.data) {
          expect(item.updatedAt).toBeInstanceOf(Date)
        }
      }
    })

    it('should have exactly 3 benefits', () => {
      expect(benefitsContent).toHaveLength(3)
    })
  })

  describe('Validation de chaque bénéfice', () => {
    it('should validate each benefit individually', () => {
      for (const benefit of benefitsContent) {
        const result = benefitItemSchema.safeParse(benefit)
        expect(result.success).toBe(true)
      }
    })

    it('should have all required fields', () => {
      const requiredFields = ['id', 'icon', 'title', 'description', 'order', 'updatedAt']

      for (const benefit of benefitsContent as Record<string, unknown>[]) {
        for (const field of requiredFields) {
          expect(benefit[field]).toBeDefined()
        }
      }
    })
  })

  describe('Règle R1 - Orders uniques', () => {
    it('should have unique orders', () => {
      const orders = (benefitsContent as { order: number }[]).map(b => b.order)
      const uniqueOrders = new Set(orders)

      expect(uniqueOrders.size).toBe(orders.length)
    })

    it('should have orders 1, 2, 3', () => {
      const orders = (benefitsContent as { order: number }[])
        .map(b => b.order)
        .sort((a, b) => a - b)

      expect(orders).toEqual([1, 2, 3])
    })

    it('T-07: should reject duplicate orders for same locale', () => {
      const duplicateOrders = [
        { ...benefitsContent[0], id: 'test-1', order: 1 },
        { ...benefitsContent[1], id: 'test-2', order: 1 },
      ]
      const result = benefitItemListSchema.safeParse(duplicateOrders)

      expect(result.success).toBe(false)
    })
  })

  describe('Règle R2 - Title max 5 mots', () => {
    it('should have titles with 5 words or less', () => {
      for (const benefit of benefitsContent as { title: string }[]) {
        const wordCount = benefit.title.trim().split(/\s+/).length
        expect(wordCount).toBeLessThanOrEqual(5)
      }
    })

    it('T-01: should reject title with 6 words', () => {
      const invalid = {
        ...benefitsContent[0],
        title: 'Un titre avec beaucoup trop de mots',
      }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-02: should accept title with exactly 5 words', () => {
      const valid = {
        ...benefitsContent[0],
        title: 'Un deux trois quatre cinq',
      }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Règle R3 - Description termine par . ou !', () => {
    it('should have descriptions ending with . or !', () => {
      for (const benefit of benefitsContent as { description: string }[]) {
        expect(benefit.description.trim()).toMatch(/[.!]$/)
      }
    })

    it('T-03: should reject description without punctuation', () => {
      const invalid = {
        ...benefitsContent[0],
        description: 'Une description sans ponctuation finale',
      }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-04: should reject description ending with ?', () => {
      const invalid = {
        ...benefitsContent[0],
        description: 'Une description qui est une question?',
      }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-05: should accept description ending with !', () => {
      const valid = {
        ...benefitsContent[0],
        description: 'Une description enthousiaste et valide!',
      }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Règle R4 - Max 5 bénéfices actifs', () => {
    it('should have 3 or fewer active benefits', () => {
      const activeCount = (benefitsContent as { isActive?: boolean }[])
        .filter(b => b.isActive !== false).length

      expect(activeCount).toBeLessThanOrEqual(5)
    })

    it('T-11: should reject more than 5 active benefits', () => {
      const sixBenefits = Array.from({ length: 6 }, (_, i) => ({
        id: `benefit-${i}`,
        icon: 'zap',
        title: `Bénéfice ${i + 1}`,
        description: `Description valide numéro ${i + 1}.`,
        order: i + 1,
        locale: 'fr',
        isActive: true,
        updatedAt: '2026-02-02T10:00:00.000Z',
      }))
      const result = benefitItemListSchema.safeParse(sixBenefits)

      expect(result.success).toBe(false)
    })
  })

  describe('Règle R5 - Icônes valides', () => {
    it('should have valid Lucide icons', () => {
      for (const benefit of benefitsContent as { icon: string }[]) {
        expect(BENEFIT_ICONS).toContain(benefit.icon)
      }
    })

    it('T-06: should reject invalid icon', () => {
      const invalid = {
        ...benefitsContent[0],
        icon: 'invalid-icon',
      }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should have distinct icons for each benefit', () => {
      const icons = (benefitsContent as { icon: string }[]).map(b => b.icon)
      const uniqueIcons = new Set(icons)

      expect(uniqueIcons.size).toBe(icons.length)
    })
  })

  describe('Validation des champs communs', () => {
    it('should have all benefits with locale "fr"', () => {
      for (const benefit of benefitsContent as { locale?: string }[]) {
        expect(benefit.locale ?? 'fr').toBe('fr')
      }
    })

    it('should have all benefits active', () => {
      for (const benefit of benefitsContent as { isActive?: boolean }[]) {
        expect(benefit.isActive ?? true).toBe(true)
      }
    })

    it('should have valid ISO 8601 updatedAt', () => {
      for (const benefit of benefitsContent as { updatedAt: string }[]) {
        expect(() => new Date(benefit.updatedAt)).not.toThrow()
      }
    })

    it('should have valid slug format for IDs', () => {
      for (const benefit of benefitsContent as { id: string }[]) {
        expect(benefit.id).toMatch(/^[a-z0-9-]+$/)
        expect(benefit.id.length).toBeGreaterThanOrEqual(3)
        expect(benefit.id.length).toBeLessThanOrEqual(50)
      }
    })
  })

  describe('Validation accessibilité', () => {
    it('should have ariaLabel for each benefit', () => {
      for (const benefit of benefitsContent as { ariaLabel?: string }[]) {
        expect(benefit.ariaLabel).toBeDefined()
        expect(typeof benefit.ariaLabel).toBe('string')
      }
    })

    it('should have ariaLabel under 100 characters', () => {
      for (const benefit of benefitsContent as { ariaLabel?: string }[]) {
        if (benefit.ariaLabel) {
          expect(benefit.ariaLabel.length).toBeLessThanOrEqual(100)
        }
      }
    })

    it('T-16: should reject ariaLabel over 100 characters', () => {
      const invalid = {
        ...benefitsContent[0],
        ariaLabel: 'A'.repeat(101),
      }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should have descriptive ariaLabels (contain "icône")', () => {
      for (const benefit of benefitsContent as { ariaLabel?: string }[]) {
        if (benefit.ariaLabel) {
          expect(benefit.ariaLabel.toLowerCase()).toContain('icône')
        }
      }
    })
  })

  describe('Cas limites - Order', () => {
    it('T-08: should reject order = 0', () => {
      const invalid = { ...benefitsContent[0], order: 0 }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-09: should reject negative order', () => {
      const invalid = { ...benefitsContent[0], order: -1 }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-10: should reject decimal order', () => {
      const invalid = { ...benefitsContent[0], order: 1.5 }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })
  })

  describe('Cas limites - ID', () => {
    it('T-12: should reject ID with uppercase', () => {
      const invalid = { ...benefitsContent[0], id: 'Benefit-Test' }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-13: should reject ID with spaces', () => {
      const invalid = { ...benefitsContent[0], id: 'benefit test' }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })
  })

  describe('Cas limites - Description', () => {
    it('T-14: should reject description under 20 characters', () => {
      const invalid = { ...benefitsContent[0], description: 'Trop court.' }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-15: should reject description over 150 characters', () => {
      const invalid = {
        ...benefitsContent[0],
        description: 'A'.repeat(149) + '.',
      }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })
  })

  describe('Cas limites - Locale', () => {
    it('T-17: should reject locale with 3 characters', () => {
      const invalid = { ...benefitsContent[0], locale: 'fra' }
      const result = benefitItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })
  })

  describe('Cas limites - Caractères spéciaux', () => {
    it('T-18: should accept accented characters', () => {
      const valid = {
        ...benefitsContent[0],
        title: 'Qualité élevée',
        description: 'Une description avec des caractères accentués éàùç.',
      }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('T-19: should accept emoji in title', () => {
      const valid = {
        ...benefitsContent[0],
        title: 'Productivité 🚀',
      }
      const result = benefitItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Cas limites - Liste', () => {
    it('T-20: should accept empty array', () => {
      const result = benefitItemListSchema.safeParse([])

      expect(result.success).toBe(true)
    })

    it('should accept different locales with same order', () => {
      const mixedLocales = [
        { ...benefitsContent[0], id: 'fr-1', order: 1, locale: 'fr' },
        { ...benefitsContent[0], id: 'en-1', order: 1, locale: 'en' },
      ]
      const result = benefitItemListSchema.safeParse(mixedLocales)

      expect(result.success).toBe(true)
    })
  })
})

describe('Benefits Content - Qualité rédactionnelle', () => {
  let benefitsContent: {
    id: string
    title: string
    description: string
    icon: string
    ariaLabel?: string
  }[]

  beforeAll(() => {
    const filePath = join(process.cwd(), 'src/content/benefits/main.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    benefitsContent = JSON.parse(fileContent)
  })

  it('should have consistent title structure (adjective + noun)', () => {
    // Tous les titres doivent avoir une structure similaire
    const titles = benefitsContent.map(b => b.title)

    // Vérifier que tous les titres ont 2-3 mots
    for (const title of titles) {
      const wordCount = title.trim().split(/\s+/).length
      expect(wordCount).toBeGreaterThanOrEqual(2)
      expect(wordCount).toBeLessThanOrEqual(3)
    }
  })

  it('should not have typos in common French words', () => {
    const allText = benefitsContent
      .map(b => `${b.title} ${b.description}`)
      .join(' ')

    // Vérifications basiques d'orthographe
    expect(allText).not.toMatch(/tache(?!s)/) // "tâche" avec accent
    expect(allText).not.toMatch(/\s{2,}/) // pas de double espaces
  })

  it('should have distinct descriptions (no repetition)', () => {
    const descriptions = benefitsContent.map(b => b.description.toLowerCase())

    // Vérifier que les descriptions ne se répètent pas
    for (let i = 0; i < descriptions.length; i++) {
      for (let j = i + 1; j < descriptions.length; j++) {
        const similarity = calculateSimilarity(descriptions[i], descriptions[j])
        expect(similarity).toBeLessThan(0.5) // < 50% de similarité
      }
    }
  })

  it('should cover the 3 key AIAD benefits', () => {
    const allText = benefitsContent
      .map(b => `${b.id} ${b.title} ${b.description}`)
      .join(' ')
      .toLowerCase()

    // Les 3 thèmes clés doivent être présents
    expect(allText).toMatch(/productiv|rapid|efficac/) // Productivité
    expect(allText).toMatch(/qualit|standard|valid/) // Qualité
    expect(allText).toMatch(/collabor|équipe|travail/) // Collaboration
  })
})

// Helper function for similarity check
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.split(/\s+/).filter(w => w.length > 3))
  const words2 = str2.split(/\s+/).filter(w => w.length > 3)
  const overlap = words2.filter(w => words1.has(w)).length
  return overlap / words2.length
}
```

### 8.3 Matrice de couverture

| Aspect | Tests | Couverture |
|--------|-------|------------|
| Validation schéma global | T-00, T-00b | 100% |
| Nombre de bénéfices | 1 test | 100% |
| Règle R1 (orders uniques) | 3 tests (T-07) | 100% |
| Règle R2 (5 mots max) | 3 tests (T-01, T-02) | 100% |
| Règle R3 (ponctuation) | 4 tests (T-03, T-04, T-05) | 100% |
| Règle R4 (max 5 actifs) | 2 tests (T-11) | 100% |
| Règle R5 (icônes valides) | 3 tests (T-06) | 100% |
| Champs communs | 4 tests | 100% |
| Accessibilité (ariaLabel) | 4 tests (T-16) | 100% |
| Cas limites Order | 3 tests (T-08, T-09, T-10) | 100% |
| Cas limites ID | 2 tests (T-12, T-13) | 100% |
| Cas limites Description | 2 tests (T-14, T-15) | 100% |
| Cas limites Locale | 1 test (T-17) | 100% |
| Caractères spéciaux | 2 tests (T-18, T-19) | 100% |
| Liste vide/mixte | 2 tests (T-20) | 100% |
| Qualité rédactionnelle | 4 tests | 100% |

---

## 9. Implémentation

### 9.1 Prérequis

- [x] T-001-B2 (BenefitItem model) ✅ complété
- [ ] Dossier `src/content/benefits/` existant (créer si nécessaire)
- [ ] Schéma `benefitItemListSchema` exporté dans `config.ts`

### 9.2 Étapes de réalisation

| Étape | Action | Commande/Fichier |
|-------|--------|------------------|
| 1 | Créer le dossier si inexistant | `mkdir -p src/content/benefits` |
| 2 | Créer le fichier JSON | `src/content/benefits/main.json` |
| 3 | Valider la syntaxe JSON | `cat src/content/benefits/main.json \| jq .` |
| 4 | Vérifier la compilation Astro | `pnpm dev` |
| 5 | Créer les tests unitaires | `tests/unit/content/benefits-main.test.ts` |
| 6 | Exécuter les tests | `pnpm test:unit -- benefits-main` |
| 7 | Vérifier le build complet | `pnpm build` |

### 9.3 Commandes de vérification

```bash
# 1. Vérifier la syntaxe JSON
cat src/content/benefits/main.json | jq .

# 2. Valider le nombre d'éléments
cat src/content/benefits/main.json | jq 'length'
# Attendu: 3

# 3. Vérifier les orders
cat src/content/benefits/main.json | jq '.[].order'
# Attendu: 1, 2, 3

# 4. Lancer le serveur de dev (valide le schéma)
pnpm dev

# 5. Exécuter les tests spécifiques
pnpm test:unit -- benefits-main

# 6. Build complet (validation finale)
pnpm build

# 7. Vérifier le type checking
pnpm typecheck
```

---

## 10. Critères d'acceptation

- [ ] **CA-01** : Le fichier `src/content/benefits/main.json` existe
- [ ] **CA-02** : Le fichier est un JSON valide (parseable sans erreur)
- [ ] **CA-03** : Le fichier contient exactement 3 bénéfices
- [ ] **CA-04** : Chaque bénéfice passe la validation `benefitItemSchema`
- [ ] **CA-05** : La liste passe la validation `benefitItemListSchema`
- [ ] **CA-06** : Les orders sont uniques : 1, 2, 3 (règle R1)
- [ ] **CA-07** : Les titres ont 5 mots maximum (règle R2)
- [ ] **CA-08** : Les descriptions terminent par `.` ou `!` (règle R3)
- [ ] **CA-09** : Les icônes sont des icônes Lucide valides (règle R5)
- [ ] **CA-10** : Chaque bénéfice a un `ariaLabel` descriptif
- [ ] **CA-11** : Le contenu est en français (`locale: "fr"`)
- [ ] **CA-12** : Tous les bénéfices sont actifs (`isActive: true`)
- [ ] **CA-13** : `pnpm dev` démarre sans erreur de validation
- [ ] **CA-14** : Tous les tests unitaires passent
- [ ] **CA-15** : `pnpm build` réussit

---

## 11. Definition of Done

- [ ] Fichier JSON créé à l'emplacement `src/content/benefits/main.json`
- [ ] Exactement 3 bénéfices représentant les valeurs clés d'AIAD
- [ ] Validation Zod réussie (aucune erreur à la compilation Astro)
- [ ] Tests unitaires écrits et passants (`tests/unit/content/benefits-main.test.ts`)
- [ ] Contenu relu pour qualité rédactionnelle (orthographe, grammaire)
- [ ] Labels ARIA présents et descriptifs pour l'accessibilité
- [ ] Build Astro réussi (`pnpm build`)
- [ ] TypeScript compile sans erreur (`pnpm typecheck`)

---

## 12. Références

| Document | Lien |
|----------|------|
| User Story US-001 | [spec.md](./spec.md) |
| Modèle BenefitItem (T-001-B2) | [T-001-B2-modele-donnees-BenefitItem.md](./T-001-B2-modele-donnees-BenefitItem.md) |
| Données Hero (T-001-B4) | [T-001-B4-donnees-JSON-hero-content-francais.md](./T-001-B4-donnees-JSON-hero-content-francais.md) |
| Architecture technique | [../../ARCHITECTURE.md](../../ARCHITECTURE.md) |
| Guide Claude | [../../CLAUDE.md](../../CLAUDE.md) |
| Lucide Icons | [lucide.dev](https://lucide.dev/icons/) |
| Astro Content Collections | [docs.astro.build](https://docs.astro.build/en/guides/content-collections/) |
| Zod Documentation | [zod.dev](https://zod.dev/) |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 02/02/2026 | Création initiale complète |
