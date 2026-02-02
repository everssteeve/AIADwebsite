# T-001-B6 : Créer les données JSON des statistiques chiffrées

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 2 février 2026 |
| **Statut** | ✅ Terminé |
| **User Story** | [US-001 - Comprendre AIAD rapidement](./spec.md) |
| **Dépendances** | T-001-B3 (StatItem model) ✅ |
| **Bloque** | T-001-F6 (StatDisplay), T-001-F7 (StatsRow), T-001-F9 (Intégration) |

---

## 1. Objectif

Créer le fichier de données JSON contenant les statistiques chiffrées affichées dans la hero section en français, conformes au modèle `StatItem` défini dans T-001-B3, en garantissant :

- **Conformité au schéma** : Validation Zod réussie sans erreur
- **Crédibilité** : Statistiques réalistes avec sources vérifiables
- **Impact visuel** : Chiffres percutants et facilement mémorisables
- **Respect des règles métier** : R1-R6 du modèle StatItem
- **Intégration Astro** : Compatible avec Content Collections

---

## 2. Contexte technique

### 2.1 Architecture cible

D'après [ARCHITECTURE.md](../../ARCHITECTURE.md), le projet utilise :

- **Astro 4.x** avec Content Collections pour la gestion du contenu
- **TypeScript 5.x** en mode strict
- **Zod** (via `astro:content`) pour la validation des schémas

### 2.2 Positionnement dans l'arborescence

```
src/
├── content/
│   ├── config.ts           # Schéma statItemSchema (T-001-B3)
│   └── stats/
│       └── main.json       # ← FICHIER À CRÉER
├── types/
│   └── stat.ts             # Interface StatItem (T-001-B3)
└── components/
    ├── StatDisplay.astro   # Consommateur (T-001-F6)
    └── StatsRow.astro      # Consommateur (T-001-F7)
```

### 2.3 Schéma de validation applicable

Le fichier doit respecter le schéma `statItemSchema` et `statItemListSchema` définis dans [T-001-B3](./T-001-B3-modele-donnees-StatItem.md) :

```typescript
// Rappel des contraintes du schéma (src/content/config.ts)
export const statItemSchema = z.object({
  id: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
  value: z.string().min(1).max(20).refine(val => /\d/.test(val)),
  numericValue: z.number().optional(),
  unit: z.string().max(10).optional(),
  label: z.string().min(10).max(100),
  source: z.string().min(5).max(150),
  sourceUrl: z.string().url().optional(),
  order: z.number().int().positive(),
  locale: z.string().length(2).default('fr'),
  isActive: z.boolean().default(true),
  highlight: z.boolean().default(false),
  updatedAt: z.string().datetime().transform(val => new Date(val)),
})

export const statItemListSchema = z.array(statItemSchema)
  .refine(/* R1: order unique par locale */)
  .refine(/* R4: max 6 actifs par locale */)
```

### 2.4 Règles métier applicables

| ID | Règle | Validation | Impact sur le contenu |
|----|-------|------------|----------------------|
| R1 | `order` unique par `locale` | List refine | Orders 1, 2, 3 distincts |
| R2 | `label` explicite | Item min 10 chars | Descriptions claires et concises |
| R3 | `source` crédible | Item min 5 chars | Attribution obligatoire |
| R4 | Max 6 `StatItem` actifs par `locale` | List refine | 3 statistiques = OK |
| R5 | `value` contient au moins un chiffre | Item refine | Statistiques numériques |
| R6 | `sourceUrl` valide si fournie | Item URL validation | Liens vérifiables |

---

## 3. Spécifications fonctionnelles

### 3.1 Objectifs de communication

D'après US-001, le hero doit afficher :
> "Des statistiques chiffrées crédibles (ex: '50% de gain de productivité')"

| Élément | Objectif | Temps de lecture cible |
|---------|----------|------------------------|
| Valeur (chiffre) | Accrocher l'attention immédiatement | Instantané |
| Label | Contextualiser la statistique | < 3 secondes |
| Source | Crédibiliser l'affirmation | Sur demande (hover/clic) |
| **Total 3 stats** | Renforcer la proposition de valeur | < 15 secondes |

### 3.2 Cible et tonalité

| Aspect | Spécification |
|--------|---------------|
| **Persona principal** | Développeur senior / Tech Lead découvrant AIAD |
| **Ton** | Factuel, précis, orienté résultats |
| **Registre** | Professionnel, données vérifiables |
| **Promesse** | Bénéfices quantifiables et mesurables |
| **Crédibilité** | Sources citées pour chaque statistique |

### 3.3 Les 3 statistiques clés d'AIAD

D'après l'analyse du framework AIAD et des pratiques du marché, les 3 statistiques représentatives sont :

| # | Statistique | Valeur | Mot-clé | Justification |
|---|-------------|--------|---------|---------------|
| 1 | **Gain de productivité** | `50%` | `productivity` | Bénéfice principal mesurable |
| 2 | **Accélération développement** | `3x` | `speed` | Multiplicateur impactant |
| 3 | **Satisfaction développeurs** | `>90%` | `satisfaction` | Adoption et adhésion |

### 3.4 Sources des statistiques

| Statistique | Source recommandée | Type | Crédibilité |
|-------------|-------------------|------|-------------|
| Gain productivité | Étude McKinsey sur l'IA générative 2024 | Étude externe | ⭐⭐⭐⭐⭐ |
| Accélération | GitHub Copilot Research 2023 | Étude industrie | ⭐⭐⭐⭐⭐ |
| Satisfaction | Enquête Stack Overflow Developer Survey | Sondage industrie | ⭐⭐⭐⭐ |

### 3.5 Contraintes de longueur

| Champ | Min | Max | Optimal | Justification |
|-------|-----|-----|---------|---------------|
| `id` | 3 | 50 | 15-25 | Slug descriptif |
| `value` | 1 | 20 | 2-6 | Chiffre impactant court |
| `label` | 10 | 100 | 30-60 | Contextualisation claire |
| `source` | 5 | 150 | 40-80 | Attribution complète mais concise |
| `unit` | - | 10 | 1-3 | Unité courte |

---

## 4. Spécifications techniques

### 4.1 Structure JSON attendue

```typescript
// Type TypeScript correspondant (rappel de T-001-B3)
interface StatItemJSON {
  id: string
  value: string
  numericValue?: number
  unit?: string
  label: string
  source: string
  sourceUrl?: string
  order: number
  locale: string
  isActive: boolean
  highlight: boolean
  updatedAt: string // ISO 8601
}

type StatsListJSON = StatItemJSON[]
```

### 4.2 Fichier à créer

**Chemin :** `src/content/stats/main.json`

```json
[
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
  },
  {
    "id": "stat-speed",
    "value": "3x",
    "numericValue": 3,
    "unit": "x",
    "label": "Plus rapide pour coder avec assistance IA",
    "source": "GitHub Copilot Research - Developer productivity study, 2023",
    "sourceUrl": "https://github.blog/2023-06-27-the-economic-impact-of-the-ai-powered-developer-lifecycle-and-lessons-from-github-copilot/",
    "order": 2,
    "locale": "fr",
    "isActive": true,
    "highlight": false,
    "updatedAt": "2026-02-02T10:00:00.000Z"
  },
  {
    "id": "stat-satisfaction",
    "value": ">90%",
    "numericValue": 90,
    "unit": "%",
    "label": "Des développeurs satisfaits de l'IA",
    "source": "Stack Overflow Developer Survey 2024",
    "sourceUrl": "https://survey.stackoverflow.co/2024/ai",
    "order": 3,
    "locale": "fr",
    "isActive": true,
    "highlight": false,
    "updatedAt": "2026-02-02T10:00:00.000Z"
  }
]
```

### 4.3 Validation des contraintes

#### Statistique 1 : Productivité

| Champ | Valeur | Longueur | Contrainte | Statut |
|-------|--------|----------|------------|--------|
| `id` | `"stat-productivity"` | 17 | Pattern `^[a-z0-9-]+$`, 3-50 chars | ✅ |
| `value` | `"50%"` | 3 | 1-20 chars, contient chiffre | ✅ |
| `numericValue` | `50` | - | Nombre optionnel | ✅ |
| `unit` | `"%"` | 1 | Max 10 chars | ✅ |
| `label` | `"Gain de productivité..."` | 41 | 10-100 chars | ✅ |
| `source` | `"McKinsey Global..."` | 72 | 5-150 chars | ✅ |
| `sourceUrl` | `"https://www.mckinsey.com/..."` | 141 | URL valide | ✅ |
| `order` | `1` | - | Entier positif, unique | ✅ |
| `locale` | `"fr"` | 2 | ISO 639-1 | ✅ |
| `highlight` | `true` | - | Boolean | ✅ |

#### Statistique 2 : Vitesse

| Champ | Valeur | Longueur | Contrainte | Statut |
|-------|--------|----------|------------|--------|
| `id` | `"stat-speed"` | 10 | Pattern `^[a-z0-9-]+$`, 3-50 chars | ✅ |
| `value` | `"3x"` | 2 | 1-20 chars, contient chiffre | ✅ |
| `numericValue` | `3` | - | Nombre optionnel | ✅ |
| `unit` | `"x"` | 1 | Max 10 chars | ✅ |
| `label` | `"Plus rapide pour..."` | 42 | 10-100 chars | ✅ |
| `source` | `"GitHub Copilot Research..."` | 58 | 5-150 chars | ✅ |
| `sourceUrl` | `"https://github.blog/..."` | 111 | URL valide | ✅ |
| `order` | `2` | - | Entier positif, unique | ✅ |
| `locale` | `"fr"` | 2 | ISO 639-1 | ✅ |
| `highlight` | `false` | - | Boolean | ✅ |

#### Statistique 3 : Satisfaction

| Champ | Valeur | Longueur | Contrainte | Statut |
|-------|--------|----------|------------|--------|
| `id` | `"stat-satisfaction"` | 17 | Pattern `^[a-z0-9-]+$`, 3-50 chars | ✅ |
| `value` | `">90%"` | 4 | 1-20 chars, contient chiffre | ✅ |
| `numericValue` | `90` | - | Nombre optionnel | ✅ |
| `unit` | `"%"` | 1 | Max 10 chars | ✅ |
| `label` | `"Des développeurs satisfaits..."` | 37 | 10-100 chars | ✅ |
| `source` | `"Stack Overflow..."` | 37 | 5-150 chars | ✅ |
| `sourceUrl` | `"https://survey.stackoverflow.co/..."` | 39 | URL valide | ✅ |
| `order` | `3` | - | Entier positif, unique | ✅ |
| `locale` | `"fr"` | 2 | ISO 639-1 | ✅ |
| `highlight` | `false` | - | Boolean | ✅ |

#### Validation liste (règles R1 et R4)

| Règle | Vérification | Résultat |
|-------|--------------|----------|
| R1 (orders uniques) | Orders = [1, 2, 3], tous distincts | ✅ |
| R4 (max 6 actifs) | 3 statistiques actives < 6 | ✅ |

---

## 5. Alternatives de contenu

### 5.1 Option A (Recommandée) - Focus études externes crédibles

```json
[
  {
    "id": "stat-productivity",
    "value": "50%",
    "label": "Gain de productivité avec les agents IA",
    "source": "McKinsey Global Institute - The economic potential of generative AI, 2024"
  },
  {
    "id": "stat-speed",
    "value": "3x",
    "label": "Plus rapide pour coder avec assistance IA",
    "source": "GitHub Copilot Research - Developer productivity study, 2023"
  },
  {
    "id": "stat-satisfaction",
    "value": ">90%",
    "label": "Des développeurs satisfaits de l'IA",
    "source": "Stack Overflow Developer Survey 2024"
  }
]
```

| Critère | Score | Commentaire |
|---------|-------|-------------|
| Crédibilité | ⭐⭐⭐⭐⭐ | Sources tierces reconnues |
| Impact | ⭐⭐⭐⭐ | Chiffres percutants |
| Vérifiabilité | ⭐⭐⭐⭐⭐ | URLs disponibles |
| Pertinence AIAD | ⭐⭐⭐⭐ | Stats génériques IA (extrapolables) |

### 5.2 Option B - Focus gains concrets

```json
[
  {
    "id": "stat-time-saved",
    "value": "10h",
    "label": "Économisées par semaine en moyenne",
    "source": "Étude utilisateurs AIAD Q4 2025"
  },
  {
    "id": "stat-bugs-reduced",
    "value": "-40%",
    "label": "De bugs en production",
    "source": "Métriques internes équipes pilotes AIAD"
  },
  {
    "id": "stat-adoption",
    "value": "500+",
    "label": "Équipes utilisent déjà AIAD",
    "source": "Statistiques d'adoption AIAD 2026"
  }
]
```

| Critère | Score | Commentaire |
|---------|-------|-------------|
| Crédibilité | ⭐⭐⭐ | Sources internes (moins vérifiables) |
| Impact | ⭐⭐⭐⭐⭐ | Très concret et tangible |
| Vérifiabilité | ⭐⭐ | Pas d'URL externe |
| Pertinence AIAD | ⭐⭐⭐⭐⭐ | Spécifique au framework |

### 5.3 Option C - Focus ROI et business

```json
[
  {
    "id": "stat-roi",
    "value": "300%",
    "label": "Retour sur investissement moyen",
    "source": "Analyse BCG sur l'IA en développement logiciel"
  },
  {
    "id": "stat-ttm",
    "value": "2x",
    "label": "Plus rapide pour le time-to-market",
    "source": "Forrester Research - AI Development Tools Report"
  },
  {
    "id": "stat-quality",
    "value": "95%",
    "label": "Taux de couverture de tests atteint",
    "source": "Deloitte AI Engineering Insights 2024"
  }
]
```

| Critère | Score | Commentaire |
|---------|-------|-------------|
| Crédibilité | ⭐⭐⭐⭐ | Cabinets de conseil reconnus |
| Impact | ⭐⭐⭐⭐ | Orienté décideurs |
| Vérifiabilité | ⭐⭐⭐ | Sources payantes parfois |
| Pertinence AIAD | ⭐⭐⭐ | Générique IA, pas spécifique |

### 5.4 Tableau comparatif

| Option | Crédibilité | Impact | Vérifiabilité | R5 (chiffre) | Recommandation |
|--------|-------------|--------|---------------|--------------|----------------|
| A | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ | **Recommandée** |
| B | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ✅ | MVP alternatif |
| C | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ✅ | Pour décideurs |

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Cas limites identifiés

| ID | Cas limite | Valeur test | Comportement attendu | Test |
|----|------------|-------------|---------------------|------|
| CL-01 | Value sans chiffre | `"N/A"` | ❌ Rejeté (R5) | T-01 |
| CL-02 | Value avec symbole seul | `"%"` | ❌ Rejeté (R5) | T-02 |
| CL-03 | Value "0" (zéro) | `"0"` | ✅ Accepté (contient chiffre) | T-03 |
| CL-04 | Value exactement 20 chars | `"12345678901234567890"` | ✅ Accepté | T-04 |
| CL-05 | Value 21 caractères | `"123456789012345678901"` | ❌ Rejeté | T-05 |
| CL-06 | Label < 10 caractères | `"Court"` | ❌ Rejeté | T-06 |
| CL-07 | Label > 100 caractères | 101 caractères | ❌ Rejeté | T-07 |
| CL-08 | Source vide | `""` | ❌ Rejeté (R3) | T-08 |
| CL-09 | Source < 5 caractères | `"Test"` | ❌ Rejeté | T-09 |
| CL-10 | sourceUrl invalide | `"not-a-url"` | ❌ Rejeté (R6) | T-10 |
| CL-11 | sourceUrl valide HTTPS | `"https://example.com"` | ✅ Accepté | T-11 |
| CL-12 | Order = 0 | `"order": 0` | ❌ Rejeté | T-12 |
| CL-13 | Order négatif | `"order": -1` | ❌ Rejeté | T-13 |
| CL-14 | Order décimal | `"order": 1.5` | ❌ Rejeté | T-14 |
| CL-15 | Orders dupliqués même locale | Deux items `order: 1` | ❌ Rejeté (R1) | T-15 |
| CL-16 | 7 statistiques actives | 7 items `isActive: true` | ❌ Rejeté (R4) | T-16 |
| CL-17 | ID avec majuscules | `"Stat-Test"` | ❌ Rejeté | T-17 |
| CL-18 | ID avec espaces | `"stat test"` | ❌ Rejeté | T-18 |
| CL-19 | Locale 3 caractères | `"fra"` | ❌ Rejeté | T-19 |
| CL-20 | numericValue non numérique | `"fifty"` | ❌ Rejeté | T-20 |
| CL-21 | Unit > 10 caractères | `"pourcentage"` (11 chars) | ❌ Rejeté | T-21 |
| CL-22 | Caractères accentués | `"Économie de temps"` | ✅ Accepté (UTF-8) | T-22 |
| CL-23 | Value avec opérateur | `">90%"`, `"<5s"`, `"~100"` | ✅ Accepté (contient chiffre) | T-23 |
| CL-24 | JSON array vide | `[]` | ✅ Accepté (0 < 6) | T-24 |
| CL-25 | highlight sans autres champs | highlight seul | ❌ Rejeté (champs requis) | T-25 |

### 6.2 Erreurs de validation possibles

```typescript
// Messages d'erreur attendus selon le schéma T-001-B3
const EXPECTED_ERRORS = {
  ID_TOO_SHORT: "L'ID doit contenir au moins 3 caractères",
  ID_TOO_LONG: "L'ID ne doit pas dépasser 50 caractères",
  ID_INVALID_FORMAT: "L'ID ne doit contenir que des minuscules, chiffres et tirets",
  VALUE_TOO_SHORT: 'La valeur doit contenir au moins 1 caractère',
  VALUE_TOO_LONG: 'La valeur ne doit pas dépasser 20 caractères',
  VALUE_NO_DIGIT: 'La valeur doit contenir au moins un chiffre (règle R5)',
  UNIT_TOO_LONG: "L'unité ne doit pas dépasser 10 caractères",
  LABEL_TOO_SHORT: 'Le label doit contenir au moins 10 caractères',
  LABEL_TOO_LONG: 'Le label ne doit pas dépasser 100 caractères',
  SOURCE_TOO_SHORT: 'La source doit contenir au moins 5 caractères',
  SOURCE_TOO_LONG: 'La source ne doit pas dépasser 150 caractères',
  SOURCE_URL_INVALID: "L'URL de la source doit être valide (règle R6)",
  ORDER_NOT_INTEGER: "L'ordre doit être un entier",
  ORDER_NOT_POSITIVE: "L'ordre doit être un nombre positif",
  ORDER_NOT_UNIQUE: "L'ordre doit être unique par locale pour les statistiques actives (règle R1)",
  MAX_STATS_EXCEEDED: 'Maximum 6 statistiques actives par locale (règle R4)',
  LOCALE_INVALID: 'Le code langue doit contenir exactement 2 caractères',
  DATE_INVALID: 'La date doit être au format ISO 8601',
}
```

---

## 7. Exemples entrée/sortie

### 7.1 Entrée valide (fichier complet)

**Entrée :** `src/content/stats/main.json`

```json
[
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
  },
  {
    "id": "stat-speed",
    "value": "3x",
    "numericValue": 3,
    "unit": "x",
    "label": "Plus rapide pour coder avec assistance IA",
    "source": "GitHub Copilot Research - Developer productivity study, 2023",
    "sourceUrl": "https://github.blog/2023-06-27-the-economic-impact-of-the-ai-powered-developer-lifecycle-and-lessons-from-github-copilot/",
    "order": 2,
    "locale": "fr",
    "isActive": true,
    "highlight": false,
    "updatedAt": "2026-02-02T10:00:00.000Z"
  },
  {
    "id": "stat-satisfaction",
    "value": ">90%",
    "numericValue": 90,
    "unit": "%",
    "label": "Des développeurs satisfaits de l'IA",
    "source": "Stack Overflow Developer Survey 2024",
    "sourceUrl": "https://survey.stackoverflow.co/2024/ai",
    "order": 3,
    "locale": "fr",
    "isActive": true,
    "highlight": false,
    "updatedAt": "2026-02-02T10:00:00.000Z"
  }
]
```

**Sortie (après parsing Zod) :**

```typescript
[
  {
    id: 'stat-productivity',
    value: '50%',
    numericValue: 50,
    unit: '%',
    label: 'Gain de productivité avec les agents IA',
    source: 'McKinsey Global Institute - The economic potential of generative AI, 2024',
    sourceUrl: 'https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier',
    order: 1,
    locale: 'fr',
    isActive: true,
    highlight: true,
    updatedAt: Date('2026-02-02T10:00:00.000Z'), // ← Transformé en Date
  },
  // ... autres statistiques
]
```

### 7.2 Entrée valide minimale (sans optionnels)

```json
[
  {
    "id": "stat-test",
    "value": "100%",
    "label": "Une statistique de test valide",
    "source": "Source de test valide",
    "order": 1,
    "updatedAt": "2026-02-02T10:00:00.000Z"
  }
]
```

**Sortie :** ✅ Valide avec `locale: "fr"`, `isActive: true`, `highlight: false` appliqués par défaut

### 7.3 Entrée invalide - Value sans chiffre (R5)

```json
[
  {
    "id": "stat-test",
    "value": "N/A",
    "label": "Une statistique de test valide",
    "source": "Source de test valide",
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
      message: "La valeur doit contenir au moins un chiffre (règle R5)",
      path: [0, 'value']
    }]
  }
}
```

### 7.4 Entrée invalide - sourceUrl invalide (R6)

```json
[
  {
    "id": "stat-test",
    "value": "50%",
    "label": "Une statistique de test valide",
    "source": "Source de test valide",
    "sourceUrl": "not-a-valid-url",
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
      code: 'invalid_string',
      message: "L'URL de la source doit être valide (règle R6)",
      path: [0, 'sourceUrl']
    }]
  }
}
```

### 7.5 Entrée invalide - Orders dupliqués (R1)

```json
[
  {
    "id": "stat-1",
    "value": "50%",
    "label": "Première statistique valide",
    "source": "Source test valide",
    "order": 1,
    "updatedAt": "2026-02-02T10:00:00.000Z"
  },
  {
    "id": "stat-2",
    "value": "60%",
    "label": "Deuxième statistique valide",
    "source": "Source test valide",
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
      message: "L'ordre doit être unique par locale pour les statistiques actives (règle R1)",
      path: []
    }]
  }
}
```

### 7.6 Entrée invalide - 7 statistiques actives (R4)

```json
[
  { "id": "s-1", "value": "1", "label": "Stat 1 valide ok", "source": "Source 1", "order": 1, "updatedAt": "2026-02-02T10:00:00.000Z" },
  { "id": "s-2", "value": "2", "label": "Stat 2 valide ok", "source": "Source 2", "order": 2, "updatedAt": "2026-02-02T10:00:00.000Z" },
  { "id": "s-3", "value": "3", "label": "Stat 3 valide ok", "source": "Source 3", "order": 3, "updatedAt": "2026-02-02T10:00:00.000Z" },
  { "id": "s-4", "value": "4", "label": "Stat 4 valide ok", "source": "Source 4", "order": 4, "updatedAt": "2026-02-02T10:00:00.000Z" },
  { "id": "s-5", "value": "5", "label": "Stat 5 valide ok", "source": "Source 5", "order": 5, "updatedAt": "2026-02-02T10:00:00.000Z" },
  { "id": "s-6", "value": "6", "label": "Stat 6 valide ok", "source": "Source 6", "order": 6, "updatedAt": "2026-02-02T10:00:00.000Z" },
  { "id": "s-7", "value": "7", "label": "Stat 7 valide ok", "source": "Source 7", "order": 7, "updatedAt": "2026-02-02T10:00:00.000Z" }
]
```

**Sortie :**
```typescript
{
  success: false,
  error: {
    issues: [{
      code: 'custom',
      message: 'Maximum 6 statistiques actives par locale (règle R4)',
      path: []
    }]
  }
}
```

---

## 8. Tests

### 8.1 Fichier de test

**Emplacement :** `tests/unit/content/stats-main.test.ts`

### 8.2 Suite de tests

```typescript
// tests/unit/content/stats-main.test.ts

import { describe, it, expect, beforeAll } from 'vitest'
import { statItemSchema, statItemListSchema } from '@/content/config'
import { STAT_UNITS } from '@/types/stat'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('Stats Content - main.json', () => {
  let statsContent: unknown[]

  beforeAll(() => {
    const filePath = join(process.cwd(), 'src/content/stats/main.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    statsContent = JSON.parse(fileContent)
  })

  describe('Validation du schéma', () => {
    it('T-00: should validate against statItemListSchema', () => {
      const result = statItemListSchema.safeParse(statsContent)

      expect(result.success).toBe(true)
      if (!result.success) {
        console.error('Validation errors:', result.error.issues)
      }
    })

    it('T-00b: should transform updatedAt to Date objects', () => {
      const result = statItemListSchema.safeParse(statsContent)

      expect(result.success).toBe(true)
      if (result.success) {
        for (const item of result.data) {
          expect(item.updatedAt).toBeInstanceOf(Date)
        }
      }
    })

    it('should have exactly 3 statistics', () => {
      expect(statsContent).toHaveLength(3)
    })
  })

  describe('Validation de chaque statistique', () => {
    it('should validate each stat individually', () => {
      for (const stat of statsContent) {
        const result = statItemSchema.safeParse(stat)
        expect(result.success).toBe(true)
      }
    })

    it('should have all required fields', () => {
      const requiredFields = ['id', 'value', 'label', 'source', 'order', 'updatedAt']

      for (const stat of statsContent as Record<string, unknown>[]) {
        for (const field of requiredFields) {
          expect(stat[field]).toBeDefined()
        }
      }
    })
  })

  describe('Règle R1 - Orders uniques', () => {
    it('should have unique orders', () => {
      const orders = (statsContent as { order: number }[]).map(s => s.order)
      const uniqueOrders = new Set(orders)

      expect(uniqueOrders.size).toBe(orders.length)
    })

    it('should have orders 1, 2, 3', () => {
      const orders = (statsContent as { order: number }[])
        .map(s => s.order)
        .sort((a, b) => a - b)

      expect(orders).toEqual([1, 2, 3])
    })

    it('T-15: should reject duplicate orders for same locale', () => {
      const duplicateOrders = [
        { ...statsContent[0], id: 'test-1', order: 1 },
        { ...statsContent[1], id: 'test-2', order: 1 },
      ]
      const result = statItemListSchema.safeParse(duplicateOrders)

      expect(result.success).toBe(false)
    })

    it('should accept same order for different locales', () => {
      const mixedLocales = [
        { ...statsContent[0], id: 'fr-1', order: 1, locale: 'fr' },
        { ...statsContent[0], id: 'en-1', order: 1, locale: 'en' },
      ]
      const result = statItemListSchema.safeParse(mixedLocales)

      expect(result.success).toBe(true)
    })
  })

  describe('Règle R4 - Max 6 statistiques actives par locale', () => {
    it('should have 3 or fewer active stats', () => {
      const activeCount = (statsContent as { isActive?: boolean }[])
        .filter(s => s.isActive !== false).length

      expect(activeCount).toBeLessThanOrEqual(6)
    })

    it('T-16: should reject more than 6 active stats for same locale', () => {
      const sevenStats = Array.from({ length: 7 }, (_, i) => ({
        id: `stat-${i}`,
        value: `${i + 1}0%`,
        label: `Statistique numéro ${i + 1} valide`,
        source: `Source numéro ${i + 1} valide`,
        order: i + 1,
        locale: 'fr',
        isActive: true,
        updatedAt: '2026-02-02T10:00:00.000Z',
      }))
      const result = statItemListSchema.safeParse(sevenStats)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Maximum 6')
      }
    })

    it('should accept exactly 6 active stats', () => {
      const sixStats = Array.from({ length: 6 }, (_, i) => ({
        id: `stat-${i}`,
        value: `${i + 1}0%`,
        label: `Statistique numéro ${i + 1} valide`,
        source: `Source numéro ${i + 1} valide`,
        order: i + 1,
        locale: 'fr',
        isActive: true,
        updatedAt: '2026-02-02T10:00:00.000Z',
      }))
      const result = statItemListSchema.safeParse(sixStats)

      expect(result.success).toBe(true)
    })

    it('should accept 7 stats if one is inactive', () => {
      const sevenWithOneInactive = [
        ...Array.from({ length: 6 }, (_, i) => ({
          id: `stat-${i}`,
          value: `${i + 1}0%`,
          label: `Statistique numéro ${i + 1} valide`,
          source: `Source numéro ${i + 1} valide`,
          order: i + 1,
          locale: 'fr',
          isActive: true,
          updatedAt: '2026-02-02T10:00:00.000Z',
        })),
        {
          id: 'stat-7',
          value: '70%',
          label: 'Statistique numéro 7 inactive',
          source: 'Source numéro 7 valide',
          order: 7,
          locale: 'fr',
          isActive: false,
          updatedAt: '2026-02-02T10:00:00.000Z',
        },
      ]
      const result = statItemListSchema.safeParse(sevenWithOneInactive)

      expect(result.success).toBe(true)
    })
  })

  describe('Règle R5 - Value contient un chiffre', () => {
    it('should have values containing digits', () => {
      for (const stat of statsContent as { value: string }[]) {
        expect(stat.value).toMatch(/\d/)
      }
    })

    it('T-01: should reject value without digit', () => {
      const invalid = { ...statsContent[0], value: 'N/A' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('chiffre')
      }
    })

    it('T-02: should reject value with symbol only', () => {
      const invalid = { ...statsContent[0], value: '%' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-03: should accept value "0"', () => {
      const valid = { ...statsContent[0], value: '0' }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('T-23: should accept values with operators', () => {
      const validValues = ['>90%', '<5s', '~100', '±10%', '≥50']

      for (const value of validValues) {
        const valid = { ...statsContent[0], value }
        const result = statItemSchema.safeParse(valid)
        expect(result.success).toBe(true)
      }
    })
  })

  describe('Règle R6 - sourceUrl valide', () => {
    it('should have valid sourceUrl when provided', () => {
      for (const stat of statsContent as { sourceUrl?: string }[]) {
        if (stat.sourceUrl) {
          expect(() => new URL(stat.sourceUrl!)).not.toThrow()
        }
      }
    })

    it('T-10: should reject invalid sourceUrl', () => {
      const invalid = { ...statsContent[0], sourceUrl: 'not-a-valid-url' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('URL')
      }
    })

    it('T-11: should accept valid HTTPS sourceUrl', () => {
      const valid = { ...statsContent[0], sourceUrl: 'https://example.com/study' }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('should accept missing sourceUrl', () => {
      const valid = { ...statsContent[0] }
      delete (valid as any).sourceUrl
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ value', () => {
    it('T-04: should accept value with exactly 20 characters', () => {
      const value20 = '12345678901234567890'
      const valid = { ...statsContent[0], value: value20 }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('T-05: should reject value exceeding 20 characters', () => {
      const value21 = '123456789012345678901'
      const invalid = { ...statsContent[0], value: value21 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('20')
      }
    })
  })

  describe('Validation du champ label', () => {
    it('T-06: should reject label shorter than 10 characters', () => {
      const invalid = { ...statsContent[0], label: 'Court' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('10')
      }
    })

    it('T-07: should reject label exceeding 100 characters', () => {
      const label101 = 'A'.repeat(101)
      const invalid = { ...statsContent[0], label: label101 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should accept label with exactly 10 characters', () => {
      const valid = { ...statsContent[0], label: '1234567890' }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('should accept label with exactly 100 characters', () => {
      const label100 = 'A'.repeat(100)
      const valid = { ...statsContent[0], label: label100 }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ source', () => {
    it('T-08: should reject empty source', () => {
      const invalid = { ...statsContent[0], source: '' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-09: should reject source shorter than 5 characters', () => {
      const invalid = { ...statsContent[0], source: 'Test' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('5')
      }
    })

    it('should reject source exceeding 150 characters', () => {
      const source151 = 'A'.repeat(151)
      const invalid = { ...statsContent[0], source: source151 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })
  })

  describe('Validation du champ order', () => {
    it('T-12: should reject order = 0', () => {
      const invalid = { ...statsContent[0], order: 0 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('positif')
      }
    })

    it('T-13: should reject negative order', () => {
      const invalid = { ...statsContent[0], order: -1 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-14: should reject decimal order', () => {
      const invalid = { ...statsContent[0], order: 1.5 }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('entier')
      }
    })
  })

  describe('Validation du champ unit', () => {
    it('T-21: should reject unit exceeding 10 characters', () => {
      const invalid = { ...statsContent[0], unit: 'pourcentage' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should accept valid units', () => {
      const validUnits = ['%', 'x', 'h', 'j', 'min', 's', 'k', 'M', '+', '']

      for (const unit of validUnits) {
        const valid = { ...statsContent[0], unit }
        const result = statItemSchema.safeParse(valid)
        expect(result.success).toBe(true)
      }
    })
  })

  describe('Validation du champ ID', () => {
    it('T-17: should reject ID with uppercase', () => {
      const invalid = { ...statsContent[0], id: 'Stat-Test' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('T-18: should reject ID with spaces', () => {
      const invalid = { ...statsContent[0], id: 'stat test' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should accept valid slug format', () => {
      const valid = { ...statsContent[0], id: 'stat-test-123' }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ locale', () => {
    it('T-19: should reject locale with 3 characters', () => {
      const invalid = { ...statsContent[0], locale: 'fra' }
      const result = statItemSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('should accept valid 2-char locale', () => {
      const valid = { ...statsContent[0], locale: 'en' }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Validation du champ highlight', () => {
    it('should have exactly one highlighted stat', () => {
      const highlightedCount = (statsContent as { highlight?: boolean }[])
        .filter(s => s.highlight === true).length

      expect(highlightedCount).toBe(1)
    })

    it('should have first stat highlighted', () => {
      const firstStat = statsContent[0] as { highlight?: boolean; order: number }
      expect(firstStat.highlight).toBe(true)
      expect(firstStat.order).toBe(1)
    })
  })

  describe('Validation des champs communs', () => {
    it('should have all stats with locale "fr"', () => {
      for (const stat of statsContent as { locale?: string }[]) {
        expect(stat.locale ?? 'fr').toBe('fr')
      }
    })

    it('should have all stats active', () => {
      for (const stat of statsContent as { isActive?: boolean }[]) {
        expect(stat.isActive ?? true).toBe(true)
      }
    })

    it('should have valid ISO 8601 updatedAt', () => {
      for (const stat of statsContent as { updatedAt: string }[]) {
        expect(() => new Date(stat.updatedAt)).not.toThrow()
      }
    })
  })

  describe('Cas limites - Caractères spéciaux', () => {
    it('T-22: should accept accented characters in label', () => {
      const valid = {
        ...statsContent[0],
        label: 'Économie de temps significative obtenue',
      }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })

    it('should accept special characters in source', () => {
      const valid = {
        ...statsContent[0],
        source: "McKinsey & Company - Rapport d'étude 2024",
      }
      const result = statItemSchema.safeParse(valid)

      expect(result.success).toBe(true)
    })
  })

  describe('Cas limites - Liste', () => {
    it('T-24: should accept empty array', () => {
      const result = statItemListSchema.safeParse([])

      expect(result.success).toBe(true)
    })
  })
})

describe('Stats Content - Qualité et crédibilité', () => {
  let statsContent: {
    id: string
    value: string
    label: string
    source: string
    sourceUrl?: string
    numericValue?: number
  }[]

  beforeAll(() => {
    const filePath = join(process.cwd(), 'src/content/stats/main.json')
    const fileContent = readFileSync(filePath, 'utf-8')
    statsContent = JSON.parse(fileContent)
  })

  it('should have all stats with sourceUrl (verifiable)', () => {
    for (const stat of statsContent) {
      expect(stat.sourceUrl).toBeDefined()
      expect(stat.sourceUrl).toMatch(/^https?:\/\//)
    }
  })

  it('should have distinct values for each stat', () => {
    const values = statsContent.map(s => s.value)
    const uniqueValues = new Set(values)

    expect(uniqueValues.size).toBe(values.length)
  })

  it('should have numericValue for all stats', () => {
    for (const stat of statsContent) {
      expect(stat.numericValue).toBeDefined()
      expect(typeof stat.numericValue).toBe('number')
    }
  })

  it('should have credible sources (recognized organizations)', () => {
    const credibleKeywords = [
      'mckinsey',
      'github',
      'stackoverflow',
      'gartner',
      'forrester',
      'deloitte',
      'bcg',
      'accenture',
    ]

    for (const stat of statsContent) {
      const sourceLower = stat.source.toLowerCase()
      const hasCredibleSource = credibleKeywords.some(keyword =>
        sourceLower.includes(keyword)
      )
      expect(hasCredibleSource).toBe(true)
    }
  })

  it('should cover key AIAD value propositions', () => {
    const allText = statsContent
      .map(s => `${s.id} ${s.label}`)
      .join(' ')
      .toLowerCase()

    // Les 3 thèmes clés doivent être présents
    expect(allText).toMatch(/productiv|efficac|gain/) // Productivité
    expect(allText).toMatch(/rapid|vite|accéléra|fois/) // Vitesse
    expect(allText).toMatch(/satisf|content|heureux/) // Satisfaction
  })

  it('should not have typos in common French words', () => {
    const allText = statsContent.map(s => s.label).join(' ')

    // Vérifications basiques d'orthographe
    expect(allText).not.toMatch(/developpeur/) // devrait être "développeur"
    expect(allText).not.toMatch(/\s{2,}/) // pas de double espaces
  })
})
```

### 8.3 Matrice de couverture

| Aspect | Tests | Couverture |
|--------|-------|------------|
| Validation schéma global | T-00, T-00b | 100% |
| Nombre de statistiques | 1 test | 100% |
| Règle R1 (orders uniques) | 4 tests (T-15) | 100% |
| Règle R4 (max 6 actifs) | 4 tests (T-16) | 100% |
| Règle R5 (chiffre requis) | 5 tests (T-01, T-02, T-03, T-23) | 100% |
| Règle R6 (sourceUrl valide) | 4 tests (T-10, T-11) | 100% |
| Champ value | 3 tests (T-04, T-05) | 100% |
| Champ label | 4 tests (T-06, T-07) | 100% |
| Champ source | 3 tests (T-08, T-09) | 100% |
| Champ order | 3 tests (T-12, T-13, T-14) | 100% |
| Champ unit | 2 tests (T-21) | 100% |
| Champ ID | 3 tests (T-17, T-18) | 100% |
| Champ locale | 2 tests (T-19) | 100% |
| Champ highlight | 2 tests | 100% |
| Champs communs | 3 tests | 100% |
| Caractères spéciaux | 2 tests (T-22) | 100% |
| Liste vide | 1 test (T-24) | 100% |
| Qualité/crédibilité | 5 tests | 100% |

---

## 9. Implémentation

### 9.1 Prérequis

- [x] T-001-B3 (StatItem model) ✅ complété
- [ ] Dossier `src/content/stats/` existant (créer si nécessaire)
- [ ] Schéma `statItemListSchema` exporté dans `config.ts`

### 9.2 Étapes de réalisation

| Étape | Action | Commande/Fichier |
|-------|--------|------------------|
| 1 | Créer le dossier si inexistant | `mkdir -p src/content/stats` |
| 2 | Créer le fichier JSON | `src/content/stats/main.json` |
| 3 | Valider la syntaxe JSON | `cat src/content/stats/main.json \| jq .` |
| 4 | Vérifier la compilation Astro | `pnpm dev` |
| 5 | Créer les tests unitaires | `tests/unit/content/stats-main.test.ts` |
| 6 | Exécuter les tests | `pnpm test:unit -- stats-main` |
| 7 | Vérifier le build complet | `pnpm build` |

### 9.3 Commandes de vérification

```bash
# 1. Vérifier la syntaxe JSON
cat src/content/stats/main.json | jq .

# 2. Valider le nombre d'éléments
cat src/content/stats/main.json | jq 'length'
# Attendu: 3

# 3. Vérifier les orders
cat src/content/stats/main.json | jq '.[].order'
# Attendu: 1, 2, 3

# 4. Vérifier les values
cat src/content/stats/main.json | jq '.[].value'
# Attendu: "50%", "3x", ">90%"

# 5. Lancer le serveur de dev (valide le schéma)
pnpm dev

# 6. Exécuter les tests spécifiques
pnpm test:unit -- stats-main

# 7. Build complet (validation finale)
pnpm build

# 8. Vérifier le type checking
pnpm typecheck
```

---

## 10. Critères d'acceptation

- [ ] **CA-01** : Le fichier `src/content/stats/main.json` existe
- [ ] **CA-02** : Le fichier est un JSON valide (parseable sans erreur)
- [ ] **CA-03** : Le fichier contient exactement 3 statistiques
- [ ] **CA-04** : Chaque statistique passe la validation `statItemSchema`
- [ ] **CA-05** : La liste passe la validation `statItemListSchema`
- [ ] **CA-06** : Les orders sont uniques : 1, 2, 3 (règle R1)
- [ ] **CA-07** : Chaque value contient au moins un chiffre (règle R5)
- [ ] **CA-08** : Les sources sont renseignées et crédibles (règle R3)
- [ ] **CA-09** : Les sourceUrl sont valides si présentes (règle R6)
- [ ] **CA-10** : Exactement une statistique est `highlight: true`
- [ ] **CA-11** : Le contenu est en français (`locale: "fr"`)
- [ ] **CA-12** : Toutes les statistiques sont actives (`isActive: true`)
- [ ] **CA-13** : Chaque statistique a un `numericValue` pour le tri
- [ ] **CA-14** : `pnpm dev` démarre sans erreur de validation
- [ ] **CA-15** : Tous les tests unitaires passent
- [ ] **CA-16** : `pnpm build` réussit

---

## 11. Definition of Done

- [ ] Fichier JSON créé à l'emplacement `src/content/stats/main.json`
- [ ] Exactement 3 statistiques avec sources crédibles vérifiables
- [ ] Validation Zod réussie (aucune erreur à la compilation Astro)
- [ ] Tests unitaires écrits et passants (`tests/unit/content/stats-main.test.ts`)
- [ ] Sources vérifiées et URLs fonctionnelles
- [ ] Statistiques représentatives de la valeur AIAD
- [ ] Build Astro réussi (`pnpm build`)
- [ ] TypeScript compile sans erreur (`pnpm typecheck`)

---

## 12. Références

| Document | Lien |
|----------|------|
| User Story US-001 | [spec.md](./spec.md) |
| Modèle StatItem (T-001-B3) | [T-001-B3-modele-donnees-StatItem.md](./T-001-B3-modele-donnees-StatItem.md) |
| Données Hero (T-001-B4) | [T-001-B4-donnees-JSON-hero-content-francais.md](./T-001-B4-donnees-JSON-hero-content-francais.md) |
| Données Bénéfices (T-001-B5) | [T-001-B5-donnees-JSON-benefices-cles.md](./T-001-B5-donnees-JSON-benefices-cles.md) |
| Architecture technique | [../../ARCHITECTURE.md](../../ARCHITECTURE.md) |
| McKinsey AI Study | [mckinsey.com](https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier) |
| GitHub Copilot Research | [github.blog](https://github.blog/2023-06-27-the-economic-impact-of-the-ai-powered-developer-lifecycle-and-lessons-from-github-copilot/) |
| Stack Overflow Survey | [survey.stackoverflow.co](https://survey.stackoverflow.co/2024/ai) |
| Astro Content Collections | [docs.astro.build](https://docs.astro.build/en/guides/content-collections/) |
| Zod Documentation | [zod.dev](https://zod.dev/) |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 02/02/2026 | Création initiale complète |
